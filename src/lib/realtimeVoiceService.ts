import { RealtimeRoomPresence, RealtimePeerAudioState } from '../types/realtimeAudio';

// WebRTC ICE Configuration (Free Public STUN servers for robust P2P audio streaming between any mobile and desktop)
const ICE_SERVERS: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' }
  ]
};

export class RealtimeVoiceEngine {
  private ws: WebSocket | null = null;
  private localStream: MediaStream | null = null;
  private peerConnections: Map<string, RTCPeerConnection> = new Map();
  private remoteAudioElements: Map<string, HTMLAudioElement> = new Map();
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private microphoneSource: MediaStreamAudioSourceNode | null = null;
  private animFrameId: number | null = null;

  public roomId: string;
  public myPeerId: string;
  public myUserName: string;
  public myUserAvatar: string;
  public isMuted: boolean = true;
  public currentSeatId: number | null = null;

  // Callbacks for UI sync
  public onPresenceUpdate?: (peers: RealtimeRoomPresence[]) => void;
  public onPeerSpeaking?: (state: RealtimePeerAudioState) => void;
  public onChatMessage?: (msg: any) => void;
  public onConnectionStatus?: (status: 'connecting' | 'connected' | 'disconnected' | 'error') => void;
  public onMicPermissionError?: (err: Error) => void;

  private activePeers: Map<string, RealtimeRoomPresence> = new Map();

  constructor(roomId: string, userName: string, userAvatar: string) {
    this.roomId = roomId;
    this.myPeerId = `peer-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    this.myUserName = userName;
    this.myUserAvatar = userAvatar;
  }

  // Connect WebSocket & Join Room Signaling
  public connect() {
    try {
      this.onConnectionStatus?.('connecting');
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws/audio-room`;

      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.onConnectionStatus?.('connected');
        this.sendMessage({
          type: 'join_room',
          roomId: this.roomId,
          payload: {
            peerId: this.myPeerId,
            userName: this.myUserName,
            userAvatar: this.myUserAvatar,
            seatId: this.currentSeatId,
            isMuted: this.isMuted
          }
        });
      };

      this.ws.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);
          await this.handleSignalingMessage(data);
        } catch (e) {
          console.error('Error handling WS message:', e);
        }
      };

      this.ws.onclose = () => {
        this.onConnectionStatus?.('disconnected');
        // Auto-reconnect after 3 seconds
        setTimeout(() => {
          if (this.ws?.readyState === WebSocket.CLOSED) {
            this.connect();
          }
        }, 3000);
      };

      this.ws.onerror = (e) => {
        console.warn('Voice WebSocket signaling error:', e);
        this.onConnectionStatus?.('error');
      };
    } catch (err) {
      console.error('Failed to initialize WebSocket signaling:', err);
    }
  }

  // Initialize Microphone & Local Audio Stream
  public async enableMicrophone(): Promise<boolean> {
    try {
      if (this.localStream) {
        this.setMute(false);
        return true;
      }

      // Request actual microphone from device
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        },
        video: false
      });

      this.localStream = stream;
      this.isMuted = false;

      // Audio analysis for real-time visual waves
      this.setupAudioAnalysis(stream);

      // Add tracks to any existing WebRTC peer connections
      this.peerConnections.forEach((pc) => {
        stream.getAudioTracks().forEach((track) => {
          pc.addTrack(track, stream);
        });
      });

      // Renegotiate with peers
      this.activePeers.forEach((_, peerId) => {
        this.createOffer(peerId);
      });

      this.broadcastSeatUpdate();
      return true;
    } catch (err) {
      console.error('Microphone access error:', err);
      this.onMicPermissionError?.(err as Error);
      return false;
    }
  }

  // Mute / Unmute Toggle
  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach((track) => {
        track.enabled = !muted;
      });
    }

    this.broadcastSeatUpdate();
    this.sendMessage({
      type: 'speaking_state',
      roomId: this.roomId,
      payload: {
        isSpeaking: false,
        audioLevel: 0
      }
    });
  }

  // Assign or change mic seat
  public updateSeat(seatId: number | null) {
    this.currentSeatId = seatId;
    this.broadcastSeatUpdate();
  }

  private broadcastSeatUpdate() {
    this.sendMessage({
      type: 'update_seat',
      roomId: this.roomId,
      payload: {
        seatId: this.currentSeatId,
        isMuted: this.isMuted
      }
    });
  }

  // Real-time audio analysis for live waveform visualization
  private setupAudioAnalysis(stream: MediaStream) {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioCtx();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.5;

      this.microphoneSource = this.audioContext.createMediaStreamSource(stream);
      this.microphoneSource.connect(this.analyser);

      const bufferLength = this.analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      let lastSpeaking = false;
      let lastTimeSent = 0;

      const checkVolume = () => {
        if (!this.analyser || this.isMuted) {
          if (lastSpeaking) {
            lastSpeaking = false;
            this.sendSpeakingState(false, 0);
          }
          this.animFrameId = requestAnimationFrame(checkVolume);
          return;
        }

        this.analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const avg = sum / bufferLength;
        const isSpeaking = avg > 12; // Threshold for actual voice detection
        const audioLevel = Math.min(100, Math.round((avg / 128) * 100));

        const now = Date.now();
        if (isSpeaking !== lastSpeaking || (isSpeaking && now - lastTimeSent > 150)) {
          lastSpeaking = isSpeaking;
          lastTimeSent = now;
          this.sendSpeakingState(isSpeaking, audioLevel);
        }

        this.animFrameId = requestAnimationFrame(checkVolume);
      };

      this.animFrameId = requestAnimationFrame(checkVolume);
    } catch (err) {
      console.warn('Audio analysis setup warning:', err);
    }
  }

  private sendSpeakingState(isSpeaking: boolean, audioLevel: number) {
    this.sendMessage({
      type: 'speaking_state',
      roomId: this.roomId,
      payload: { isSpeaking, audioLevel }
    });

    if (this.currentSeatId) {
      this.onPeerSpeaking?.({
        peerId: this.myPeerId,
        userName: this.myUserName,
        userAvatar: this.myUserAvatar,
        seatId: this.currentSeatId,
        isSpeaking,
        isMuted: this.isMuted,
        audioLevel
      });
    }
  }

  // Handle incoming signaling messages from server
  private async handleSignalingMessage(msg: any) {
    const { type, payload } = msg;

    switch (type) {
      case 'room_presence_sync': {
        const peers = payload.peers as RealtimeRoomPresence[];
        this.activePeers.clear();
        peers.forEach((p) => {
          this.activePeers.set(p.peerId, p);
          // Initiate WebRTC peer connection to receive audio
          this.initPeerConnection(p.peerId);
        });
        this.notifyPresence();
        break;
      }

      case 'peer_joined': {
        const peer = payload as RealtimeRoomPresence;
        this.activePeers.set(peer.peerId, peer);
        this.initPeerConnection(peer.peerId);
        this.notifyPresence();
        break;
      }

      case 'peer_seat_updated': {
        const peer = this.activePeers.get(payload.peerId);
        if (peer) {
          peer.seatId = payload.seatId;
          peer.isMuted = payload.isMuted;
          this.notifyPresence();
        }
        break;
      }

      case 'peer_speaking_state': {
        this.onPeerSpeaking?.({
          peerId: payload.peerId,
          userName: this.activePeers.get(payload.peerId)?.userName || 'متحدث',
          userAvatar: this.activePeers.get(payload.peerId)?.userAvatar || '',
          seatId: payload.seatId,
          isSpeaking: payload.isSpeaking,
          isMuted: false,
          audioLevel: payload.audioLevel || 0
        });
        break;
      }

      case 'peer_left': {
        this.activePeers.delete(payload.peerId);
        this.closePeerConnection(payload.peerId);
        this.notifyPresence();
        break;
      }

      case 'chat_broadcast': {
        this.onChatMessage?.(payload);
        break;
      }

      case 'webrtc_signal': {
        await this.handleWebRTCSignal(payload.fromPeerId, payload.signalData);
        break;
      }

      default:
        break;
    }
  }

  // Create WebRTC Peer Connection
  private initPeerConnection(targetPeerId: string): RTCPeerConnection {
    if (this.peerConnections.has(targetPeerId)) {
      return this.peerConnections.get(targetPeerId)!;
    }

    const pc = new RTCPeerConnection(ICE_SERVERS);
    this.peerConnections.set(targetPeerId, pc);

    // Add local audio tracks if microphone is active
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach((track) => {
        pc.addTrack(track, this.localStream!);
      });
    }

    // Handle remote audio stream arrival
    pc.ontrack = (event) => {
      const [remoteStream] = event.streams;
      if (remoteStream) {
        let audioEl = this.remoteAudioElements.get(targetPeerId);
        if (!audioEl) {
          audioEl = new Audio();
          audioEl.autoplay = true;
          (audioEl as any).playsInline = true;
          this.remoteAudioElements.set(targetPeerId, audioEl);
        }
        audioEl.srcObject = remoteStream;
        audioEl.play().catch((err) => {
          console.warn('Auto-play blocked, user interaction required:', err);
        });
      }
    };

    // Send ICE candidates across signaling channel
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.sendSignal(targetPeerId, {
          type: 'candidate',
          candidate: event.candidate
        });
      }
    };

    return pc;
  }

  private async createOffer(targetPeerId: string) {
    const pc = this.initPeerConnection(targetPeerId);
    try {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      this.sendSignal(targetPeerId, {
        type: 'offer',
        sdp: pc.localDescription
      });
    } catch (err) {
      console.error('Error creating WebRTC offer:', err);
    }
  }

  private async handleWebRTCSignal(fromPeerId: string, signal: any) {
    const pc = this.initPeerConnection(fromPeerId);

    try {
      if (signal.type === 'offer') {
        await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        this.sendSignal(fromPeerId, {
          type: 'answer',
          sdp: pc.localDescription
        });
      } else if (signal.type === 'answer') {
        await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
      } else if (signal.type === 'candidate') {
        if (signal.candidate) {
          await pc.addIceCandidate(new RTCIceCandidate(signal.candidate));
        }
      }
    } catch (err) {
      console.error('Error handling WebRTC signal:', err);
    }
  }

  private sendSignal(targetPeerId: string, signalData: any) {
    this.sendMessage({
      type: 'webrtc_signal',
      roomId: this.roomId,
      payload: {
        targetPeerId,
        signalData
      }
    });
  }

  public sendChat(text: string, badges?: any[], bubbleSkin?: string) {
    this.sendMessage({
      type: 'chat_message',
      roomId: this.roomId,
      payload: {
        id: `chat-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        userName: this.myUserName,
        avatar: this.myUserAvatar,
        text,
        timestamp: Date.now(),
        seatId: this.currentSeatId,
        badges,
        bubbleSkin
      }
    });
  }

  private sendMessage(msg: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(msg));
    }
  }

  private notifyPresence() {
    const list = Array.from(this.activePeers.values());
    this.onPresenceUpdate?.(list);
  }

  private closePeerConnection(peerId: string) {
    const pc = this.peerConnections.get(peerId);
    if (pc) {
      pc.close();
      this.peerConnections.delete(peerId);
    }
    const audioEl = this.remoteAudioElements.get(peerId);
    if (audioEl) {
      audioEl.srcObject = null;
      audioEl.remove();
      this.remoteAudioElements.delete(peerId);
    }
  }

  // Cleanup on leave
  public destroy() {
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    if (this.localStream) {
      this.localStream.getTracks().forEach((t) => t.stop());
      this.localStream = null;
    }
    if (this.audioContext) {
      this.audioContext.close().catch(() => {});
    }
    this.peerConnections.forEach((pc) => pc.close());
    this.peerConnections.clear();
    this.remoteAudioElements.forEach((el) => {
      el.srcObject = null;
      el.remove();
    });
    this.remoteAudioElements.clear();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
