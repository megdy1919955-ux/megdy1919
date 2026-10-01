/**
 * Global Firestore-backed WebRTC Real-time Audio Engine
 * Operates autonomously on any mobile device (Android APK, iOS, Web)
 * without requiring any local backend server.
 */

import { RealtimeRoomPresence, RealtimePeerAudioState, RealtimeNetworkQuality } from '../types/realtimeAudio';
import {
  subscribeToRoomSignals,
  sendRoomSignalInFirestore,
  updateRoomSeatInFirestore,
  RealtimeSignalPacket
} from './roomRealtimeService';
import { notifyNativeAndroidAudioMode, syncMediaSessionState } from './realtimeVoiceService';

const RTC_CONFIG: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' }
  ]
};

export interface FirestoreWebRTCConfig {
  roomId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  seatId?: number | null;
}

export class FirestoreWebRTCEngine {
  public roomId: string;
  public userId: string;
  public userName: string;
  public userAvatar: string;
  public myPeerId: string;
  public seatId: number | null = null;
  public isMuted: boolean = true;
  public isCameraEnabled: boolean = false;

  private localAudioStream: MediaStream | null = null;
  private localVideoStream: MediaStream | null = null;
  private peerConnections: Map<string, RTCPeerConnection> = new Map();
  private remoteAudioElements: Map<string, HTMLAudioElement> = new Map();
  private remoteVideoStreams: Map<string, MediaStream> = new Map();

  private audioContext: AudioContext | null = null;
  private micAnalyser: AnalyserNode | null = null;
  private micSource: MediaStreamAudioSourceNode | null = null;
  private animFrameId: number | null = null;

  private unsubSignals: (() => void) | null = null;

  // Callbacks
  public onConnectionStatus?: (status: 'connecting' | 'connected' | 'disconnected' | 'error') => void;
  public onPeerSpeaking?: (state: RealtimePeerAudioState) => void;
  public onRemoteVideoStream?: (peerId: string, stream: MediaStream | null) => void;
  public onMicPermissionError?: (err: Error) => void;

  constructor(config: FirestoreWebRTCConfig) {
    this.roomId = config.roomId;
    this.userId = config.userId;
    this.userName = config.userName;
    this.userAvatar = config.userAvatar;
    this.seatId = config.seatId ?? null;
    this.myPeerId = `peer_${config.userId.replace(/[^a-zA-Z0-9]/g, '_')}_${Math.random().toString(36).substring(2, 6)}`;

    notifyNativeAndroidAudioMode('media');
    syncMediaSessionState(`غرفة صوتية ${config.roomId}`, true);
  }

  public connect(): void {
    this.onConnectionStatus?.('connected');

    // Subscribe to incoming WebRTC signals directed to our peerId
    this.unsubSignals = subscribeToRoomSignals(this.roomId, this.myPeerId, (signal) => {
      this.handleIncomingSignal(signal);
    });
  }

  /**
   * Start local microphone capture and Web Audio level monitor
   */
  public async enableMicrophone(): Promise<boolean> {
    try {
      if (!this.localAudioStream) {
        this.localAudioStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });

        // Add local tracks to all existing peer connections
        this.localAudioStream.getAudioTracks().forEach((track) => {
          this.peerConnections.forEach((pc) => {
            pc.addTrack(track, this.localAudioStream!);
          });
        });

        this.setupAudioLevelAnalysis();
      }

      this.isMuted = false;
      this.localAudioStream.getAudioTracks().forEach((t) => (t.enabled = true));

      if (this.seatId) {
        updateRoomSeatInFirestore(this.roomId, this.seatId, {
          isMuted: false,
          isSpeaking: false,
          peerId: this.myPeerId
        });
      }

      return true;
    } catch (err: any) {
      console.warn('Microphone access failed:', err);
      this.onMicPermissionError?.(err);
      return false;
    }
  }

  public disableMicrophone(): void {
    this.isMuted = true;
    if (this.localAudioStream) {
      this.localAudioStream.getAudioTracks().forEach((t) => (t.enabled = false));
    }

    if (this.seatId) {
      updateRoomSeatInFirestore(this.roomId, this.seatId, {
        isMuted: true,
        isSpeaking: false
      });
    }

    this.onPeerSpeaking?.({
      peerId: this.myPeerId,
      seatId: this.seatId ?? undefined,
      userName: this.userName,
      userAvatar: this.userAvatar,
      isMuted: true,
      isSpeaking: false,
      audioLevel: 0
    });
  }

  public setMute(muted: boolean): void {
    if (muted) {
      this.disableMicrophone();
    } else {
      this.enableMicrophone();
    }
  }

  /**
   * Setup Web Audio Analyzer to calculate real speech volume and trigger speaking waves
   */
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

      const buffer = new Uint8Array(this.micAnalyser.frequencyBinCount);
      let lastSpeakingState = false;

      const checkVolume = () => {
        if (!this.micAnalyser || this.isMuted) {
          if (lastSpeakingState) {
            lastSpeakingState = false;
            this.onPeerSpeaking?.({
              peerId: this.myPeerId,
              seatId: this.seatId ?? undefined,
              userName: this.userName,
              userAvatar: this.userAvatar,
              isMuted: true,
              isSpeaking: false,
              audioLevel: 0
            });
            if (this.seatId) {
              updateRoomSeatInFirestore(this.roomId, this.seatId, {
                isSpeaking: false,
                audioLevel: 0
              });
            }
          }
          this.animFrameId = requestAnimationFrame(checkVolume);
          return;
        }

        this.micAnalyser.getByteFrequencyData(buffer);
        let sum = 0;
        for (let i = 0; i < buffer.length; i++) {
          sum += buffer[i];
        }
        const avg = sum / buffer.length;
        const isSpeaking = avg > 12; // Sound threshold

        if (isSpeaking !== lastSpeakingState) {
          lastSpeakingState = isSpeaking;
          this.onPeerSpeaking?.({
            peerId: this.myPeerId,
            seatId: this.seatId ?? undefined,
            userName: this.userName,
            userAvatar: this.userAvatar,
            isMuted: this.isMuted,
            isSpeaking,
            audioLevel: isSpeaking ? Math.min(100, Math.round(avg * 1.5)) : 0
          });

          if (this.seatId) {
            updateRoomSeatInFirestore(this.roomId, this.seatId, {
              isSpeaking,
              audioLevel: isSpeaking ? Math.min(100, Math.round(avg * 1.5)) : 0
            });
          }
        }

        this.animFrameId = requestAnimationFrame(checkVolume);
      };

      this.animFrameId = requestAnimationFrame(checkVolume);
    } catch (e) {
      console.warn('Audio level analyzer warning:', e);
    }
  }

  /**
   * Connect to another peer in the room
   */
  public async connectToPeer(remotePeerId: string, initiator: boolean = false): Promise<void> {
    if (this.peerConnections.has(remotePeerId) || remotePeerId === this.myPeerId) return;

    try {
      const pc = new RTCPeerConnection(RTC_CONFIG);
      this.peerConnections.set(remotePeerId, pc);

      // Add local audio tracks if available
      if (this.localAudioStream) {
        this.localAudioStream.getAudioTracks().forEach((track) => {
          pc.addTrack(track, this.localAudioStream!);
        });
      }

      // Add local video tracks if available
      if (this.localVideoStream) {
        this.localVideoStream.getVideoTracks().forEach((track) => {
          pc.addTrack(track, this.localVideoStream!);
        });
      }

      // Handle ICE Candidates
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          sendRoomSignalInFirestore(this.roomId, {
            fromPeerId: this.myPeerId,
            toPeerId: remotePeerId,
            type: 'ice-candidate',
            payload: JSON.stringify(event.candidate),
            timestamp: Date.now()
          });
        }
      };

      // Handle remote incoming track (Audio and Video)
      pc.ontrack = (event) => {
        const stream = event.streams[0];
        if (event.track.kind === 'audio') {
          let audioEl = this.remoteAudioElements.get(remotePeerId);
          if (!audioEl) {
            audioEl = new Audio();
            audioEl.autoplay = true;
            (audioEl as any).playsInline = true;
            this.remoteAudioElements.set(remotePeerId, audioEl);
          }
          audioEl.srcObject = stream;
          audioEl.play().catch(() => {});
        } else if (event.track.kind === 'video') {
          this.remoteVideoStreams.set(remotePeerId, stream);
          this.onRemoteVideoStream?.(remotePeerId, stream);
        }
      };

      if (initiator) {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        await sendRoomSignalInFirestore(this.roomId, {
          fromPeerId: this.myPeerId,
          toPeerId: remotePeerId,
          type: 'offer',
          payload: JSON.stringify(offer),
          timestamp: Date.now()
        });
      }
    } catch (err) {
      console.warn(`Failed to connect to peer ${remotePeerId}:`, err);
    }
  }

  private async handleIncomingSignal(signal: RealtimeSignalPacket): Promise<void> {
    try {
      const fromPeerId = signal.fromPeerId;
      if (fromPeerId === this.myPeerId) return;

      let pc = this.peerConnections.get(fromPeerId);
      if (!pc) {
        await this.connectToPeer(fromPeerId, false);
        pc = this.peerConnections.get(fromPeerId);
      }
      if (!pc) return;

      if (signal.type === 'offer') {
        const offer = JSON.parse(signal.payload);
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        await sendRoomSignalInFirestore(this.roomId, {
          fromPeerId: this.myPeerId,
          toPeerId: fromPeerId,
          type: 'answer',
          payload: JSON.stringify(answer),
          timestamp: Date.now()
        });
      } else if (signal.type === 'answer') {
        const answer = JSON.parse(signal.payload);
        if (pc.signalingState !== 'stable') {
          await pc.setRemoteDescription(new RTCSessionDescription(answer));
        }
      } else if (signal.type === 'ice-candidate') {
        const candidate = JSON.parse(signal.payload);
        await pc.addIceCandidate(new RTCIceCandidate(candidate)).catch(() => {});
      }
    } catch (err) {
      console.warn('Error handling incoming WebRTC signal:', err);
    }
  }

  public destroy(): void {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
    if (this.unsubSignals) {
      this.unsubSignals();
    }
    if (this.localAudioStream) {
      this.localAudioStream.getTracks().forEach((t) => t.stop());
    }
    if (this.localVideoStream) {
      this.localVideoStream.getTracks().forEach((t) => t.stop());
    }
    this.peerConnections.forEach((pc) => pc.close());
    this.peerConnections.clear();
    this.remoteAudioElements.forEach((el) => {
      el.srcObject = null;
      el.remove();
    });
    this.remoteAudioElements.clear();
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close().catch(() => {});
    }
  }
}
