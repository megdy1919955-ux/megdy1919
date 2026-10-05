import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, IS_CLOUD_SYNC_DISABLED } from './firebase';
import { updateRoomSeatInFirestore } from './roomRealtimeService';

export interface WebRTCPeerSignal {
  senderId: string;
  targetId: string;
  type: 'offer' | 'answer' | 'ice-candidate';
  payload: any;
  timestamp: number;
}

export interface FirestoreWebRTCConfig {
  roomId: string;
  userId?: string;
  userName?: string;
  userAvatar?: string;
  seatId?: number | null;
}

export class FirestoreWebRTCEngine {
  public roomId: string;
  public myPeerId: string;
  public seatId: number | null = null;
  public isMuted: boolean = true;
  public isCameraEnabled: boolean = false;

  public localAudioStream: MediaStream | null = null;
  private localVideoStream: MediaStream | null = null;
  private peerConnections: Map<string, RTCPeerConnection> = new Map();
  private remoteAudioElements: Map<string, HTMLAudioElement> = new Map();
  private remoteVideoStreams: Map<string, MediaStream> = new Map();

  private audioContext: AudioContext | null = null;
  private micAnalyser: AnalyserNode | null = null;
  private micSource: MediaStreamAudioSourceNode | null = null;
  private animFrameId: number | null = null;

  private unsubSignals: (() => void) | null = null;

  public onRemoteStream?: (peerId: string, stream: MediaStream) => void;
  public onRemoteStreamRemoved?: (peerId: string) => void;
  public onSpeakingChange?: (isSpeaking: boolean, level: number) => void;
  public onPeerSpeaking?: (state: { seatId?: number | null; userName?: string; isSpeaking: boolean; audioLevel: number }) => void;
  public onMicPermissionError?: (error: any) => void;
  public onRemoteVideoTrack?: (peerId: string, stream: MediaStream) => void;

  private speakingInterval: any = null;

  private rtcConfig: RTCConfiguration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
      { urls: 'stun:stun3.l.google.com:19302' },
      { urls: 'stun:stun4.l.google.com:19302' }
    ],
    iceCandidatePoolSize: 10
  };

  constructor(roomIdOrConfig: string | FirestoreWebRTCConfig, myPeerId?: string) {
    if (typeof roomIdOrConfig === 'string') {
      this.roomId = roomIdOrConfig || 'default-room';
      this.myPeerId = myPeerId || `peer_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    } else {
      this.roomId = roomIdOrConfig.roomId || 'default-room';
      this.myPeerId = roomIdOrConfig.userId || `peer_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
      this.seatId = roomIdOrConfig.seatId ?? null;
    }
  }

  public async connect(): Promise<void> {
    return this.init();
  }

  public async init(): Promise<void> {
    this.listenToSignalingMessages();
  }

  // تم ضبط قيود الصوت لتعمل بنمط الوسائط عالي الجودة (Media Mode)
  public async enableMicrophone(): Promise<boolean> {
    try {
      if (!this.localAudioStream) {
        this.localAudioStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
            sampleRate: 48000,
            channelCount: 2 // نمط الوسائط الاستريو الواضح
          },
          video: false
        });

        this.localAudioStream.getAudioTracks().forEach((track) => {
          this.peerConnections.forEach((pc) => {
            pc.addTrack(track, this.localAudioStream!);
          });
        });

        this.setupAudioLevelAnalysis();
      }

      this.localAudioStream.getAudioTracks().forEach((t) => (t.enabled = true));
      this.isMuted = false;

      if (this.seatId) {
        updateRoomSeatInFirestore(this.roomId, this.seatId, {
          isMuted: false,
          isSpeaking: false,
          peerId: this.myPeerId
        }).catch(() => {});
      }

      return true;
    } catch (err: any) {
      console.warn('Microphone access failed:', err);
      this.onMicPermissionError?.(err);
      return false;
    }
  }

  public stopLocalAudioStream() {
    if (this.localAudioStream) {
      this.localAudioStream.getTracks().forEach((track) => {
        track.stop();
      });
      this.localAudioStream = null;
    }
  }

  public releaseMicrophone(): void {
    if (this.animFrameId) {
      clearTimeout(this.animFrameId);
      this.animFrameId = null;
    }
    this.stopLocalAudioStream();
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close().catch(() => {});
      this.audioContext = null;
    }
    this.micAnalyser = null;
    this.micSource = null;
  }

  public disableMicrophone(): void {
    this.isMuted = true;
    if (this.animFrameId) {
      clearTimeout(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.localAudioStream) {
      this.localAudioStream.getAudioTracks().forEach((t) => (t.enabled = false));
    }

    if (this.seatId) {
      updateRoomSeatInFirestore(this.roomId, this.seatId, {
        isMuted: true,
        isSpeaking: false
      }).catch(() => {});
    }
  }

  public updateSeat(seatId: number | null): void {
    this.seatId = seatId;
    if (seatId === null) {
      this.disableMicrophone();
      this.stopLocalAudioStream();
    }
  }

  public setIsSpeaking(isSpeaking: boolean): void {
    this.onSpeakingChange?.(isSpeaking, isSpeaking ? 30 : 0);
    this.onPeerSpeaking?.({
      seatId: this.seatId,
      isSpeaking: isSpeaking,
      audioLevel: isSpeaking ? 30 : 0
    });
    if (this.seatId) {
      updateRoomSeatInFirestore(this.roomId, this.seatId, {
        isSpeaking: isSpeaking,
        audioLevel: isSpeaking ? 30 : 0
      }).catch(() => {});
    }
  }

  public leaveCurrentSeat(): void {
    this.seatId = null;
    this.stopLocalAudioStream();
    this.disableMicrophone();
  }

  public toggleMute(shouldMute: boolean): void {
    this.isMuted = shouldMute;

    if (this.localAudioStream) {
      const audioTrack = this.localAudioStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !shouldMute;
      }
    }

    if (shouldMute && this.speakingInterval) {
      clearInterval(this.speakingInterval);
      this.speakingInterval = null;
      this.setIsSpeaking(false);
    }

    if (shouldMute) {
      this.disableMicrophone();
    } else {
      this.enableMicrophone().catch(() => {});
    }
  }

  public setMute(muted: boolean): void {
    this.toggleMute(muted);
  }

  private setupAudioLevelAnalysis(): void {
    if (!this.localAudioStream) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      this.audioContext = new AudioCtx();
      this.micSource = this.audioContext.createMediaStreamSource(this.localAudioStream);
      this.micAnalyser = this.audioContext.createAnalyser();
      this.micAnalyser.fftSize = 256;
      this.micAnalyser.smoothingTimeConstant = 0.4;
      this.micSource.connect(this.micAnalyser);

      const bufferLength = this.micAnalyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      let lastSpeakingState = false;

      const checkVolume = () => {
        // Stop checking volume completely if muted or no analyzer to prevent CPU overheating
        if (!this.micAnalyser || this.isMuted) {
          if (lastSpeakingState) {
            lastSpeakingState = false;
            this.setIsSpeaking(false);
          }
          this.animFrameId = null;
          return;
        }

        const audioTrack = this.localAudioStream?.getAudioTracks()[0];
        if (!audioTrack || !audioTrack.enabled) {
          if (lastSpeakingState) {
            lastSpeakingState = false;
            this.setIsSpeaking(false);
          }
          this.animFrameId = null;
          return;
        }

        this.micAnalyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;

        const isSpeakingNow = average > 18;
        if (isSpeakingNow !== lastSpeakingState) {
          lastSpeakingState = isSpeakingNow;
          this.setIsSpeaking(isSpeakingNow);
        }

        // Throttle to 150ms for low battery and thermal footprint
        this.animFrameId = window.setTimeout(checkVolume, 150);
      };

      if (!this.isMuted) {
        checkVolume();
      }
    } catch (e) {
      console.warn('Audio level analyzer init failed:', e);
    }
  }

  private listenToSignalingMessages(): void {
    if (IS_CLOUD_SYNC_DISABLED) return;

    const path = `rooms/${this.roomId}/rtcSignals`;
    try {
      const signalsRef = collection(db, 'rooms', this.roomId, 'rtcSignals');
      this.unsubSignals = onSnapshot(signalsRef, (snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
          if (change.type === 'added') {
            const data = change.doc.data() as WebRTCPeerSignal;
            if (data.targetId === this.myPeerId && data.senderId !== this.myPeerId) {
              await this.handleIncomingSignal(data);
              try {
                await deleteDoc(change.doc.ref);
              } catch {}
            }
          }
        });
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, path);
    }
  }

  private async handleIncomingSignal(signal: WebRTCPeerSignal): Promise<void> {
    const { senderId, type, payload } = signal;
    let pc = this.peerConnections.get(senderId);

    if (type === 'offer') {
      if (!pc) {
        pc = this.createPeerConnection(senderId);
      }
      await pc.setRemoteDescription(new RTCSessionDescription(payload));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      await this.sendSignal({
        senderId: this.myPeerId,
        targetId: senderId,
        type: 'answer',
        payload: { sdp: answer.sdp, type: answer.type },
        timestamp: Date.now()
      });
    } else if (type === 'answer') {
      if (pc) {
        await pc.setRemoteDescription(new RTCSessionDescription(payload));
      }
    } else if (type === 'ice-candidate') {
      if (pc && payload) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(payload));
        } catch (e) {
          console.warn('Error adding received ice candidate', e);
        }
      }
    }
  }

  public async connectToPeer(targetPeerId: string, _isInitiator?: boolean): Promise<void> {
    if (this.peerConnections.has(targetPeerId)) return;
    const pc = this.createPeerConnection(targetPeerId);

    if (this.localAudioStream) {
      this.localAudioStream.getAudioTracks().forEach((track) => {
        pc.addTrack(track, this.localAudioStream!);
      });
    }

    const offer = await pc.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true
    });
    await pc.setLocalDescription(offer);

    await this.sendSignal({
      senderId: this.myPeerId,
      targetId: targetPeerId,
      type: 'offer',
      payload: { sdp: offer.sdp, type: offer.type },
      timestamp: Date.now()
    });
  }

  private createPeerConnection(remotePeerId: string): RTCPeerConnection {
    const pc = new RTCPeerConnection(this.rtcConfig);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.sendSignal({
          senderId: this.myPeerId,
          targetId: remotePeerId,
          type: 'ice-candidate',
          payload: event.candidate.toJSON(),
          timestamp: Date.now()
        }).catch(() => {});
      }
    };

    pc.ontrack = (event) => {
      const [remoteStream] = event.streams;
      if (!remoteStream) return;

      if (event.track.kind === 'audio') {
        let audioEl = this.remoteAudioElements.get(remotePeerId);
        if (!audioEl) {
          // إجبار عنصر الصوت على تشغيل صوت الوسائط العريض والسماعة الخارجية
          audioEl = new Audio();
          audioEl.autoplay = true;
          (audioEl as any).playsInline = true;
          (audioEl as any).sinkId = ''; // استخدام المخرج الافتراضي للوسائط
          if (typeof (audioEl as any).setSinkId === 'function') {
            (audioEl as any).setSinkId('').catch(() => {});
          }
          this.remoteAudioElements.set(remotePeerId, audioEl);
        }
        audioEl.srcObject = remoteStream;
        audioEl.play().catch(() => {});
        this.onRemoteStream?.(remotePeerId, remoteStream);
      }
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed' || pc.connectionState === 'closed') {
        this.closePeer(remotePeerId);
      }
    };

    this.peerConnections.set(remotePeerId, pc);
    return pc;
  }

  private async sendSignal(signal: WebRTCPeerSignal): Promise<void> {
    if (IS_CLOUD_SYNC_DISABLED) return;
    const path = `rooms/${this.roomId}/rtcSignals`;
    try {
      const sigDoc = doc(collection(db, 'rooms', this.roomId, 'rtcSignals'));
      await setDoc(sigDoc, signal);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  }

  private closePeer(peerId: string): void {
    const pc = this.peerConnections.get(peerId);
    if (pc) {
      pc.close();
      this.peerConnections.delete(peerId);
    }
    const audioEl = this.remoteAudioElements.get(peerId);
    if (audioEl) {
      audioEl.pause();
      audioEl.srcObject = null;
      this.remoteAudioElements.delete(peerId);
    }
    this.remoteVideoStreams.delete(peerId);
    this.onRemoteStreamRemoved?.(peerId);
  }

  public destroy(): void {
    if (this.unsubSignals) {
      this.unsubSignals();
      this.unsubSignals = null;
    }
    this.releaseMicrophone();
    this.peerConnections.forEach((pc) => pc.close());
    this.peerConnections.clear();
    this.remoteAudioElements.forEach((el) => {
      el.pause();
      el.srcObject = null;
    });
    this.remoteAudioElements.clear();
    this.remoteVideoStreams.clear();
  }
}
