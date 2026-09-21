import { RealtimeRoomPresence, RealtimePeerAudioState } from '../types/realtimeAudio';
import {
  AudioNoiseSuppressionProcessor,
  getSavedNoiseSuppressionState
} from './audioNoiseSuppressionProcessor';

export type AudioStreamMode = 'media' | 'communication';

export const SAVED_AUDIO_STREAM_MODE_KEY = 'najm_room_audio_stream_mode';

export function getSavedAudioStreamMode(): AudioStreamMode {
  return 'media'; // Strictly unified Media Stream (Normal Mode / STREAM_MUSIC) for all users
}

export function saveAudioStreamMode(_mode: AudioStreamMode): void {
  try {
    localStorage.setItem(SAVED_AUDIO_STREAM_MODE_KEY, 'media');
  } catch {}
}

/**
 * Notifies Native Android WebView Bridge or Wrapper if present
 * Enforces Audio Mode to MODE_NORMAL (0) and sets volume controls to STREAM_MUSIC (3)
 */
export function notifyNativeAndroidAudioMode(_mode?: AudioStreamMode): void {
  try {
    const win = window as any;
    const androidMode = 'NORMAL';
    const streamType = 'STREAM_MUSIC';

    if (typeof win.AndroidAudioBridge?.setAudioMode === 'function') {
      win.AndroidAudioBridge.setAudioMode(androidMode);
    }
    if (typeof win.AndroidAudioBridge?.setVolumeControlStream === 'function') {
      win.AndroidAudioBridge.setVolumeControlStream(streamType);
    }
    if (typeof win.Android?.setAudioMode === 'function') {
      win.Android.setAudioMode(androidMode);
    }
    if (typeof win.Android?.setSpeakerphoneOn === 'function') {
      win.Android.setSpeakerphoneOn(true);
    }
    if (typeof win.ReactNativeWebView?.postMessage === 'function') {
      win.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'SET_AUDIO_MODE',
        mode: androidMode,
        streamType: streamType
      }));
    }
    window.dispatchEvent(new CustomEvent('native_audio_mode_changed', {
      detail: { mode: androidMode, streamType }
    }));
  } catch (err) {
    console.warn('Native audio mode notification warning:', err);
  }
}

/**
 * Configure MediaSession metadata & playbackState to tell Android/iOS OS
 * that this session is MEDIA PLAYBACK (binding hardware volume buttons to Media Volume)
 */
export function syncMediaSessionState(roomTitle: string = 'غرفة صوتية مباشرة', isPlaying: boolean = true) {
  if ('mediaSession' in navigator) {
    try {
      if (isPlaying) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: roomTitle,
          artist: 'بث صوتي وسائط (Media Stream) 🎵',
          album: 'الوسائط والسبيكر الخارجي',
          artwork: [
            { src: '/al_najm_logo.png', sizes: '192x192', type: 'image/png' },
            { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }
          ]
        });
        navigator.mediaSession.playbackState = 'playing';

        // Register handlers so the OS recognizes active media playback
        navigator.mediaSession.setActionHandler('play', () => {});
        navigator.mediaSession.setActionHandler('pause', () => {});
      } else {
        navigator.mediaSession.playbackState = 'none';
      }
    } catch {
      // Ignore
    }
  }
}

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
  private rawMicStream: MediaStream | null = null;
  private localStream: MediaStream | null = null;
  private noiseProcessor: AudioNoiseSuppressionProcessor | null = null;
  private peerConnections: Map<string, RTCPeerConnection> = new Map();
  private remoteAudioElements: Map<string, HTMLAudioElement> = new Map();
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private microphoneSource: MediaStreamAudioSourceNode | null = null;
  private animFrameId: number | null = null;

  // Media Stream / Normal Mode playback engine (Web Audio -> STREAM_MUSIC)
  private playbackAudioContext: AudioContext | null = null;
  private masterGainNode: GainNode | null = null;
  private remoteSources: Map<string, MediaStreamAudioSourceNode> = new Map();
  private remoteGainNodes: Map<string, GainNode> = new Map();

  public roomId: string;
  public myPeerId: string;
  public myUserName: string;
  public myUserAvatar: string;
  public isMuted: boolean = true;
  public isSpeakerMuted: boolean = false;
  public isNoiseSuppressionEnabled: boolean = getSavedNoiseSuppressionState();
  public audioStreamMode: AudioStreamMode = getSavedAudioStreamMode();
  public currentSeatId: number | null = null;
  public getCurrentSeatId?: () => number | null;

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
    
    // Initialize OS media session and native audio mode
    notifyNativeAndroidAudioMode(this.audioStreamMode);
    syncMediaSessionState(`غرفة صوتية ${roomId}`, true);
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

  // Initialize Web Audio Master Playback Engine (Explicitly routes to STREAM_MUSIC / Media Mode)
  private initPlaybackAudioContext(): AudioContext | null {
    if (this.playbackAudioContext) {
      if (this.playbackAudioContext.state === 'suspended') {
        this.playbackAudioContext.resume().catch(() => {});
      }
      return this.playbackAudioContext;
    }

    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;

      // latencyHint: 'playback' instructs Android/iOS and browser to route via Media / Music stream
      this.playbackAudioContext = new AudioCtx({ latencyHint: 'playback' });
      this.masterGainNode = this.playbackAudioContext.createGain();
      this.masterGainNode.gain.value = this.isSpeakerMuted ? 0 : 1.0;
      this.masterGainNode.connect(this.playbackAudioContext.destination);

      if (this.playbackAudioContext.state === 'suspended') {
        this.playbackAudioContext.resume().catch(() => {});
      }

      return this.playbackAudioContext;
    } catch (err) {
      console.warn('Playback AudioContext initialization warning:', err);
      return null;
    }
  }

  // Toggle speaker mute / unmute across media playback engine and elements
  public setSpeakerMuted(muted: boolean): void {
    this.isSpeakerMuted = muted;
    if (this.masterGainNode && this.playbackAudioContext) {
      this.masterGainNode.gain.setValueAtTime(
        muted ? 0 : 1.0,
        this.playbackAudioContext.currentTime
      );
    }
    this.remoteAudioElements.forEach((el) => {
      // If Web Audio is active, elements stay muted to prevent echo. Otherwise sync with isSpeakerMuted.
      if (!this.playbackAudioContext) {
        el.muted = muted;
      }
    });
  }

  // Enforce Media Mode (Normal / Music / Speaker) for all users
  public async setAudioStreamMode(_mode?: AudioStreamMode): Promise<void> {
    this.audioStreamMode = 'media';
    saveAudioStreamMode('media');
    notifyNativeAndroidAudioMode('media');
  }

  // Initialize Microphone & Local Audio Stream with Client-side Noise Suppression DSP
  public async enableMicrophone(): Promise<boolean> {
    try {
      if (this.localStream) {
        // Only unmute if not explicitly muted by user
        if (!this.isMuted) {
          this.setMute(false);
        }
        return true;
      }

      // Check if getUserMedia is supported in the current environment
      if (!navigator?.mediaDevices?.getUserMedia) {
        console.warn('getUserMedia not supported in this browser or iframe environment');
        return this.createFallbackAudioStream();
      }

      try {
        // Request microphone with intelligent constraints:
        // If noise suppression is requested, enable hardware acoustic cancellation.
        // In addition, client-side software DSP (AudioNoiseSuppressionProcessor) isolates the voice.
        const isMediaMode = this.audioStreamMode === 'media';

        const audioConstraints: MediaTrackConstraints = this.isNoiseSuppressionEnabled
          ? {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
              channelCount: 1,
              sampleRate: 48000
            }
          : (isMediaMode
            ? {
                echoCancellation: false,
                noiseSuppression: false,
                autoGainControl: false,
                channelCount: 2,
                sampleRate: 48000
              }
            : {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true,
                channelCount: 1,
                sampleRate: 48000
              });

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: audioConstraints,
          video: false
        });

        // Ensure native Android bridge is synchronized with Normal / Media stream
        notifyNativeAndroidAudioMode(this.audioStreamMode);
        syncMediaSessionState(`غرفة صوتية ${this.roomId}`, true);

        this.rawMicStream = stream;

        // Apply client-side DSP Noise Suppression Processor (Dual steep Biquad bandpass + Adaptive Noise Floor + Compressor)
        this.noiseProcessor = new AudioNoiseSuppressionProcessor(
          stream,
          this.isNoiseSuppressionEnabled,
          {
            gateThreshold: 0.012,
            gateCloseThreshold: 0.007,
            speechHoldMs: 110,
            speechReleaseMs: 30,
            onGateStateChange: (isOpen, audioLevel) => {
              if (this.isMuted) return;
              if (!isOpen) {
                this.sendSpeakingState(false, 0);
              }
            }
          }
        );

        const transmissionStream = this.isNoiseSuppressionEnabled
          ? this.noiseProcessor.getProcessedStream()
          : stream;

        this.localStream = transmissionStream;
        
        // Preserve muted status if already set
        if (this.isMuted) {
          this.setMute(true);
        }

        // Audio analysis for real-time visual waves
        this.setupAudioAnalysis(transmissionStream);

        // Add tracks to any existing WebRTC peer connections
        this.peerConnections.forEach((pc) => {
          transmissionStream.getAudioTracks().forEach((track) => {
            pc.addTrack(track, transmissionStream);
          });
        });

        // Renegotiate with peers
        this.activePeers.forEach((_, peerId) => {
          this.createOffer(peerId);
        });

        this.broadcastSeatUpdate();
        return true;
      } catch (micErr) {
        // Log friendly notice without triggering uncaught runtime console.error
        console.warn('Microphone permission not granted or device unavailable, using fallback audio channel:', (micErr as Error)?.message || micErr);
        this.onMicPermissionError?.(micErr as Error);
        return this.createFallbackAudioStream();
      }
    } catch (err) {
      console.warn('Microphone initialization notice:', (err as Error)?.message || err);
      return this.createFallbackAudioStream();
    }
  }

  // Graceful fallback audio stream (silent Web Audio destination) when physical mic is denied or unavailable in iframe
  private createFallbackAudioStream(): boolean {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return false;

      if (!this.audioContext) {
        this.audioContext = new AudioCtx();
      }

      const dest = this.audioContext.createMediaStreamDestination();
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      gain.gain.value = 0; // silent audio stream
      osc.connect(gain);
      gain.connect(dest);
      osc.start();

      const fallbackStream = dest.stream;
      this.localStream = fallbackStream;
      this.rawMicStream = fallbackStream;
      this.isMuted = false;

      this.setupAudioAnalysis(fallbackStream);

      this.peerConnections.forEach((pc) => {
        fallbackStream.getAudioTracks().forEach((track) => {
          pc.addTrack(track, fallbackStream);
        });
      });

      this.broadcastSeatUpdate();
      return true;
    } catch (e) {
      console.warn('Fallback audio stream creation warning:', e);
      return false;
    }
  }

  // Toggle Noise Suppression Filter dynamically on the fly
  public setNoiseSuppression(enabled: boolean): void {
    this.isNoiseSuppressionEnabled = enabled;
    
    // 1. Hardware Acoustic Processing at microphone level
    if (this.rawMicStream) {
      this.rawMicStream.getAudioTracks().forEach((track) => {
        if (typeof track.applyConstraints === 'function') {
          track.applyConstraints({
            noiseSuppression: enabled,
            echoCancellation: enabled,
            autoGainControl: true
          }).catch(() => {});
        }
      });
    }

    // 2. Client-side Software DSP Processing (Acoustic Bandpass + Noise Gate + Dynamic Limiter)
    if (this.noiseProcessor) {
      this.noiseProcessor.setEnabled(enabled);
      
      const targetStream = enabled
        ? this.noiseProcessor.getProcessedStream()
        : (this.rawMicStream || this.localStream);

      if (targetStream) {
        // Ensure mute status is reflected on target stream tracks
        targetStream.getAudioTracks().forEach((track) => {
          track.enabled = !this.isMuted;
        });

        if (targetStream !== this.localStream) {
          const newTrack = targetStream.getAudioTracks()[0];
          if (newTrack) {
            this.peerConnections.forEach((pc) => {
              const senders = pc.getSenders();
              const audioSender = senders.find((s) => s.track && s.track.kind === 'audio');
              if (audioSender) {
                audioSender.replaceTrack(newTrack).catch((err) => {
                  console.warn('Error replacing audio track on peer connection:', err);
                });
              }
            });
          }
          this.localStream = targetStream;
          this.setupAudioAnalysis(targetStream);
        }
      }
    }
  }

  // Mute / Unmute Toggle
  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (this.rawMicStream) {
      this.rawMicStream.getAudioTracks().forEach((track) => {
        track.enabled = !muted;
      });
    }
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
    if (seatId === null) {
      // User stepped down from mic seat -> completely release microphone hardware!
      this.disableMicrophone();
    }
    this.broadcastSeatUpdate();
  }

  // Completely shut down and stop physical microphone hardware
  public disableMicrophone(): void {
    try {
      if (this.rawMicStream) {
        this.rawMicStream.getTracks().forEach((track) => {
          try {
            track.stop();
          } catch {}
        });
        this.rawMicStream = null;
      }
      if (this.localStream) {
        this.localStream.getTracks().forEach((track) => {
          try {
            track.stop();
          } catch {}
        });
        this.localStream = null;
      }
      if (this.microphoneSource) {
        try {
          this.microphoneSource.disconnect();
        } catch {}
        this.microphoneSource = null;
      }
      if (this.noiseProcessor) {
        try {
          this.noiseProcessor.destroy();
        } catch {}
        this.noiseProcessor = null;
      }
      this.isMuted = true;
      this.broadcastSeatUpdate();
      this.sendMessage({
        type: 'speaking_state',
        roomId: this.roomId,
        payload: {
          isSpeaking: false,
          audioLevel: 0
        }
      });
    } catch (e) {
      console.warn('Notice while disabling microphone:', e);
    }
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

        // Strict Gate verification: If gate is closed (ambient noise/silence), mic vibration is completely stopped
        const isGateOpen = this.noiseProcessor ? this.noiseProcessor.isGateOpen() : true;
        const isSpeaking = isGateOpen && !this.isMuted && avg > 13;
        const audioLevel = isSpeaking ? Math.min(100, Math.round((avg / 128) * 100)) : 0;

        const now = Date.now();
        if (isSpeaking !== lastSpeaking || (isSpeaking && now - lastTimeSent > 120)) {
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
    const seatId = this.currentSeatId ?? (this.getCurrentSeatId ? this.getCurrentSeatId() : null);

    this.sendMessage({
      type: 'speaking_state',
      roomId: this.roomId,
      payload: { isSpeaking, audioLevel, seatId }
    });

    if (seatId) {
      this.onPeerSpeaking?.({
        peerId: this.myPeerId,
        userName: this.myUserName,
        userAvatar: this.myUserAvatar,
        seatId: seatId,
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
        // 1. High-Fidelity Web Audio Playback Engine (Directs audio to OS STREAM_MUSIC / Media Mode)
        const playbackCtx = this.initPlaybackAudioContext();
        if (playbackCtx && this.masterGainNode) {
          try {
            if (this.remoteSources.has(targetPeerId)) {
              this.remoteSources.get(targetPeerId)?.disconnect();
            }
            if (this.remoteGainNodes.has(targetPeerId)) {
              this.remoteGainNodes.get(targetPeerId)?.disconnect();
            }

            const source = playbackCtx.createMediaStreamSource(remoteStream);
            const peerGain = playbackCtx.createGain();
            peerGain.gain.value = 1.0;

            source.connect(peerGain);
            peerGain.connect(this.masterGainNode);

            this.remoteSources.set(targetPeerId, source);
            this.remoteGainNodes.set(targetPeerId, peerGain);
          } catch (e) {
            console.warn('Web Audio media pipeline routing fallback:', e);
          }
        }

        // 2. HTMLAudioElement for mobile background keep-alive & fallback
        let audioEl = this.remoteAudioElements.get(targetPeerId);
        if (!audioEl) {
          audioEl = new Audio();
          audioEl.autoplay = true;
          (audioEl as any).playsInline = true;
          this.remoteAudioElements.set(targetPeerId, audioEl);
        }
        audioEl.srcObject = remoteStream;
        // When Web Audio destination is playing, mute HTMLAudioElement to prevent duplicate sound
        audioEl.muted = !!playbackCtx || this.isSpeakerMuted;
        audioEl.play().catch((err) => {
          console.warn('Auto-play notice:', err);
        });

        // 3. Keep Android OS volume rocker synced with Media Volume
        notifyNativeAndroidAudioMode(this.audioStreamMode);
        syncMediaSessionState(`غرفة صوتية ${this.roomId}`, true);
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
    const sourceNode = this.remoteSources.get(peerId);
    if (sourceNode) {
      sourceNode.disconnect();
      this.remoteSources.delete(peerId);
    }
    const gainNode = this.remoteGainNodes.get(peerId);
    if (gainNode) {
      gainNode.disconnect();
      this.remoteGainNodes.delete(peerId);
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
    if (this.noiseProcessor) {
      this.noiseProcessor.destroy();
      this.noiseProcessor = null;
    }
    if (this.rawMicStream) {
      this.rawMicStream.getTracks().forEach((t) => t.stop());
      this.rawMicStream = null;
    }
    if (this.localStream) {
      this.localStream.getTracks().forEach((t) => t.stop());
      this.localStream = null;
    }
    if (this.audioContext) {
      this.audioContext.close().catch(() => {});
      this.audioContext = null;
    }
    if (this.playbackAudioContext) {
      this.playbackAudioContext.close().catch(() => {});
      this.playbackAudioContext = null;
    }
    this.remoteSources.forEach((s) => s.disconnect());
    this.remoteSources.clear();
    this.remoteGainNodes.forEach((g) => g.disconnect());
    this.remoteGainNodes.clear();
    this.peerConnections.forEach((pc) => pc.close());
    this.peerConnections.clear();
    this.remoteAudioElements.forEach((el) => {
      el.srcObject = null;
      el.remove();
    });
    this.remoteAudioElements.clear();
    syncMediaSessionState('', false);
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
