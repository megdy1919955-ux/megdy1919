import * as ZegoModule from 'zego-express-engine-webrtc';
const ZegoExpressEngine = ((ZegoModule as any)?.ZegoExpressEngine || (ZegoModule as any)?.default || ZegoModule) as any;
type ZegoExpressEngine = any;
import { RealtimeRoomPresence, RealtimePeerAudioState, RealtimeNetworkQuality, ZegoVoiceEngineOptions } from './types';
import { notifyNativeAndroidAudioMode, syncMediaSessionState } from './nativeAudioBridge';

export class ZegoVoiceEngine {
  public appId: number;
  public server: string | string[];
  public roomId: string;
  public userId: string;
  public userName: string;
  public userAvatar: string;
  public seatId: number | null;
  public isMuted: boolean = true;
  public isSpeakerMuted: boolean = false;
  public isNoiseSuppressionEnabled: boolean = true;
  public isPublishing: boolean = false;
  public isConnected: boolean = false;

  private zg: ZegoExpressEngine | null = null;
  private localStream: MediaStream | null = null;
  private localStreamId: string = '';
  private playingStreams: Map<string, HTMLAudioElement> = new Map();
  private onlineUsers: Map<string, { userName: string; seatId?: number | null }> = new Map();

  // Web Audio Media Playback Engine (Enforces STREAM_MUSIC / Media Mode on Android/iOS)
  private playbackAudioContext: AudioContext | null = null;
  private masterGainNode: GainNode | null = null;
  private remoteSources: Map<string, MediaStreamAudioSourceNode> = new Map();
  private remoteGainNodes: Map<string, GainNode> = new Map();
  private isLeaving: boolean = false;
  private reconnectTimer: any = null;

  // Callbacks
  public onConnectionStatus?: (status: 'connecting' | 'connected' | 'disconnected' | 'error') => void;
  public onPresenceUpdate?: (peers: RealtimeRoomPresence[]) => void;
  public onPeerSpeaking?: (state: RealtimePeerAudioState) => void;
  public onNetworkQuality?: (quality: RealtimeNetworkQuality) => void;
  public onMicPermissionError?: (err: Error) => void;

  constructor(options: ZegoVoiceEngineOptions) {
    this.appId = options.appId || 2138622497;
    this.roomId = options.roomId;
    this.userId = options.userId;
    this.userName = options.userName;
    this.userAvatar = options.userAvatar;
    this.seatId = options.seatId ?? null;
    this.isNoiseSuppressionEnabled = options.isNoiseSuppressionEnabled ?? true;

    // Resilient list of WebSocket servers
    if (options.server) {
      this.server = options.server;
    } else {
      const customEnvServer = (import.meta as any).env?.VITE_ZEGO_SERVER_URL;
      if (customEnvServer) {
        this.server = customEnvServer;
      } else {
        this.server = [
          `wss://webliveroom${this.appId}-api.zegocloud.com/ws`,
          'wss://webliveroom-api.zegocloud.com/ws',
          `wss://webliveroom${this.appId}-api.coolzcloud.com/ws`,
          'wss://webliveroom-api.coolzcloud.com/ws',
          'wss://webliveroom-api.zego.im/ws'
        ];
      }
    }
  }

  private async fetchZegoToken(): Promise<{ token: string; server?: string } | null> {
    try {
      const res = await fetch(`/api/zego/token?userId=${encodeURIComponent(this.userId)}&roomId=${encodeURIComponent(this.roomId)}`);
      if (!res.ok) {
        console.warn(`ZEGOCLOUD token request failed: HTTP ${res.status}`);
        return null;
      }
      const data = await res.json();
      if (!data.available || !data.token) {
        return null;
      }
      return {
        token: data.token,
        server: data.server
      };
    } catch (err) {
      console.warn('ZEGOCLOUD token fetch error:', err);
      return null;
    }
  }

  private initPlaybackAudioContext(): AudioContext | null {
    if (this.playbackAudioContext && this.playbackAudioContext.state !== 'closed') {
      if (this.playbackAudioContext.state === 'suspended') {
        this.playbackAudioContext.resume().catch(() => {});
      }
      return this.playbackAudioContext;
    }

    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

      if (!AudioContextClass) return null;

      // latencyHint: 'playback' ensures Android/iOS OS treats this as Media Playback (STREAM_MUSIC)
      this.playbackAudioContext = new AudioContextClass({ latencyHint: 'playback' });
      this.masterGainNode = this.playbackAudioContext.createGain();
      this.masterGainNode.gain.value = this.isSpeakerMuted ? 0.0 : 1.0;
      this.masterGainNode.connect(this.playbackAudioContext.destination);

      if (this.playbackAudioContext.state === 'suspended') {
        this.playbackAudioContext.resume().catch(() => {});
      }
      return this.playbackAudioContext;
    } catch (e) {
      console.warn('Playback AudioContext initialization warning:', e);
      return null;
    }
  }

  public async join(): Promise<boolean> {
    this.isLeaving = false;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    try {
      const tokenData = await this.fetchZegoToken();
      if (!tokenData) {
        console.warn('ZEGOCLOUD is not configured on backend.');
        return false;
      }

      this.onConnectionStatus?.('connecting');

      const serverCandidate = tokenData.server || this.server;

      // Initialize ZegoExpressEngine with valid StandardChatroom scenario (6)
      this.zg = new ZegoExpressEngine(this.appId, serverCandidate as any, {
        scenario: 6 // 6 = StandardChatroom, 7 = HighQualityChatroom, 3 = Default
      });

      this.setupEventListeners();

      // Login to Zego Room
      const loginResult = await this.zg.loginRoom(
        this.roomId,
        tokenData.token,
        {
          userID: this.userId,
          userName: this.userName
        },
        {
          userUpdate: true,
          maxMemberCount: 1000
        }
      );

      if (loginResult) {
        this.isConnected = true;
        this.onConnectionStatus?.('connected');

        notifyNativeAndroidAudioMode('media');
        syncMediaSessionState(`غرفة صوتية ${this.roomId}`, true);

        this.zg.setSoundLevelDelegate(true, 300);

        if (this.seatId !== null) {
          await this.publishMicrophone(true);
        }

        return true;
      } else {
        throw new Error('ZEGOCLOUD room login returned false');
      }
    } catch (err: any) {
      console.warn('ZEGOCLOUD room join notice:', err?.code, err?.message || err);
      if (this.zg) {
        try {
          this.zg.logoutRoom(this.roomId);
        } catch {}
        try {
          (this.zg as any).destroyEngine?.();
        } catch {}
        this.zg = null;
      }
      this.isConnected = false;
      this.onConnectionStatus?.('disconnected');
      return false;
    }
  }

  private setupEventListeners(): void {
    if (!this.zg) return;

    this.zg.on('roomStateUpdate', (roomID: string, state: 'DISCONNECTED' | 'CONNECTING' | 'CONNECTED', errorCode: number) => {
      console.log(`📡 ZEGOCLOUD Room [${roomID}] state: ${state}, code: ${errorCode}`);
      if (state === 'CONNECTED') {
        this.isConnected = true;
        if (this.reconnectTimer) {
          clearTimeout(this.reconnectTimer);
          this.reconnectTimer = null;
        }
        this.onConnectionStatus?.('connected');
      } else if (state === 'DISCONNECTED') {
        this.isConnected = false;
        this.onConnectionStatus?.('disconnected');
        if (!this.isLeaving) {
          this.scheduleAutoReconnect();
        }
      } else if (state === 'CONNECTING') {
        this.onConnectionStatus?.('connecting');
      }
    });

    this.zg.on('roomUserUpdate', (roomID: string, updateType: 'DELETE' | 'ADD', userList: any[]) => {
      userList.forEach((u) => {
        if (updateType === 'ADD') {
          this.onlineUsers.set(u.userID, { userName: u.userName || '' });
        } else {
          this.onlineUsers.delete(u.userID);
        }
      });
      this.syncPresence();
    });

    this.zg.on('roomStreamUpdate', async (roomID: string, updateType: 'DELETE' | 'ADD', streamList: Array<{ streamID: string; user: { userID: string; userName?: string } }>) => {
      if (!this.zg) return;

      for (const stream of streamList) {
        if (stream.user.userID === this.userId) continue;

        if (updateType === 'ADD') {
          try {
            const remoteMediaStream = await this.zg.startPlayingStream(stream.streamID);

            const playbackCtx = this.initPlaybackAudioContext();
            if (playbackCtx && this.masterGainNode) {
              try {
                if (this.remoteSources.has(stream.streamID)) {
                  this.remoteSources.get(stream.streamID)?.disconnect();
                }
                if (this.remoteGainNodes.has(stream.streamID)) {
                  this.remoteGainNodes.get(stream.streamID)?.disconnect();
                }

                const sourceNode = playbackCtx.createMediaStreamSource(remoteMediaStream);
                const streamGainNode = playbackCtx.createGain();
                streamGainNode.gain.value = 1.0;

                sourceNode.connect(streamGainNode);
                streamGainNode.connect(this.masterGainNode);

                this.remoteSources.set(stream.streamID, sourceNode);
                this.remoteGainNodes.set(stream.streamID, streamGainNode);
              } catch (audioPipeErr) {
                console.warn('ZEGOCLOUD Web Audio node routing notice:', audioPipeErr);
              }
            }

            const audioEl = new Audio();
            audioEl.srcObject = remoteMediaStream;
            audioEl.autoplay = true;
            (audioEl as any).playsInline = true;
            audioEl.muted = !!playbackCtx || this.isSpeakerMuted;
            await audioEl.play().catch(() => {});
            this.playingStreams.set(stream.streamID, audioEl);

            notifyNativeAndroidAudioMode('media');
            syncMediaSessionState(`غرفة صوتية ${this.roomId}`, true);
          } catch (playErr) {
            console.warn(`Failed to play remote stream ${stream.streamID}:`, playErr);
          }
        } else if (updateType === 'DELETE') {
          this.zg.stopPlayingStream(stream.streamID);

          if (this.remoteSources.has(stream.streamID)) {
            try {
              this.remoteSources.get(stream.streamID)?.disconnect();
            } catch {}
            this.remoteSources.delete(stream.streamID);
          }
          if (this.remoteGainNodes.has(stream.streamID)) {
            try {
              this.remoteGainNodes.get(stream.streamID)?.disconnect();
            } catch {}
            this.remoteGainNodes.delete(stream.streamID);
          }

          const audioEl = this.playingStreams.get(stream.streamID);
          if (audioEl) {
            audioEl.pause();
            audioEl.srcObject = null;
            this.playingStreams.delete(stream.streamID);
          }
        }
      }
    });

    this.zg.on('soundLevelUpdate', (soundLevelList: Array<{ streamID: string; soundLevel: number; type: string }>) => {
      soundLevelList.forEach((item) => {
        const isSpeaking = item.soundLevel > 12;
        const normalizedLevel = Math.min(100, Math.round((item.soundLevel / 100) * 100));

        const parts = item.streamID.split('_');
        const targetUserId = parts.length >= 2 ? parts[1] : item.streamID;

        this.onPeerSpeaking?.({
          peerId: targetUserId,
          userName: this.onlineUsers.get(targetUserId)?.userName || 'مستخدم',
          userAvatar: '',
          seatId: this.onlineUsers.get(targetUserId)?.seatId ?? null,
          isSpeaking,
          isMuted: !isSpeaking,
          audioLevel: normalizedLevel
        });
      });
    });

    this.zg.on('capturedSoundLevelUpdate', (soundLevel: number) => {
      if (this.isMuted) return;
      const isSpeaking = soundLevel > 10;
      this.onPeerSpeaking?.({
        peerId: this.userId,
        userName: this.userName,
        userAvatar: this.userAvatar,
        seatId: this.seatId,
        isSpeaking,
        isMuted: this.isMuted,
        audioLevel: Math.min(100, Math.round(soundLevel))
      });
    });

    this.zg.on('publishQualityUpdate', (streamID: string, stats: any) => {
      const rtt = stats?.video?.rtt || stats?.audio?.rtt || 25;
      this.onNetworkQuality?.({
        pingMs: rtt,
        qualityScore: rtt < 60 ? 'excellent' : rtt < 120 ? 'good' : 'fair',
        engineMode: 'zegocloud',
        bitrateKbps: Math.round(stats?.audio?.audioBitrate || 64)
      });
    });
  }

  private syncPresence(): void {
    const peers: RealtimeRoomPresence[] = Array.from(this.onlineUsers.entries()).map(([uId, data]) => ({
      peerId: uId,
      userName: data.userName,
      userAvatar: '',
      seatId: data.seatId,
      isMuted: true,
      isSpeaking: false,
      joinedAt: Date.now()
    }));
    this.onPresenceUpdate?.(peers);
  }

  public async publishMicrophone(enable: boolean): Promise<boolean> {
    if (!this.zg || !this.isConnected) return false;

    if (enable) {
      try {
        // If already publishing, smoothly unmute without duplicate stream creation
        if (this.isPublishing && this.localStream) {
          this.isMuted = false;
          this.zg.mutePublishStreamAudio(this.localStream, false);
          return true;
        }

        if (!this.localStream) {
          const micConstraints: MediaTrackConstraints = {
            echoCancellation: true,
            noiseSuppression: this.isNoiseSuppressionEnabled,
            autoGainControl: true
          };

          this.localStream = await this.zg.createStream({
            camera: {
              video: false,
              audio: micConstraints as any
            }
          });
        }

        const cleanRoom = this.roomId.replace(/[^a-zA-Z0-9_-]/g, '');
        const cleanUser = this.userId.replace(/[^a-zA-Z0-9_-]/g, '');
        if (!this.localStreamId) {
          this.localStreamId = `s_${cleanRoom}_${cleanUser}`;
        }

        const ok = await this.zg.startPublishingStream(this.localStreamId, this.localStream);
        this.isPublishing = ok;
        this.isMuted = false;

        this.zg.mutePublishStreamAudio(this.localStream, false);
        return ok;
      } catch (err: any) {
        console.error('ZEGOCLOUD microphone capture failed:', err);
        this.onMicPermissionError?.(err);
        return false;
      }
    } else {
      if (this.isPublishing && this.localStreamId) {
        try {
          this.zg.stopPublishingStream(this.localStreamId);
        } catch {}
        this.isPublishing = false;
      }
      if (this.localStream) {
        try {
          this.zg.destroyStream(this.localStream);
        } catch {}
        this.localStream = null;
      }
      this.isMuted = true;
      return true;
    }
  }

  public muteMicrophone(muted: boolean): void {
    this.isMuted = muted;
    if (this.zg && this.localStream) {
      this.zg.mutePublishStreamAudio(this.localStream, muted);
    }
  }

  public setSpeakerMuted(muted: boolean): void {
    this.isSpeakerMuted = muted;
    if (this.masterGainNode && this.playbackAudioContext) {
      this.masterGainNode.gain.setValueAtTime(muted ? 0.0 : 1.0, this.playbackAudioContext.currentTime);
    }
    this.playingStreams.forEach((audioEl) => {
      audioEl.muted = muted;
    });
  }

  public setNoiseSuppression(enabled: boolean): void {
    this.isNoiseSuppressionEnabled = enabled;
    if (this.localStream) {
      const audioTracks = this.localStream.getAudioTracks();
      audioTracks.forEach((track) => {
        try {
          track.applyConstraints({
            noiseSuppression: enabled,
            echoCancellation: true
          });
        } catch {}
      });
    }
  }

  private scheduleAutoReconnect(): void {
    if (this.isLeaving || this.reconnectTimer) return;
    console.log('🔄 ZEGOCLOUD: Auto-reconnecting in 2.5s (strictly persisting on ZEGOCLOUD)...');
    this.reconnectTimer = setTimeout(async () => {
      this.reconnectTimer = null;
      if (this.isLeaving || this.isConnected) return;
      try {
        const wasPublishing = this.isPublishing;
        const joined = await this.join();
        if (joined && wasPublishing && !this.isMuted) {
          await this.publishMicrophone(true);
        }
      } catch (e) {
        console.warn('ZEGOCLOUD reconnection retry notice:', e);
        if (!this.isLeaving) {
          this.scheduleAutoReconnect();
        }
      }
    }, 2500);
  }

  public async leave(): Promise<void> {
    this.isLeaving = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (!this.zg) return;
    try {
      if (this.localStream) {
        if (this.isPublishing && this.localStreamId) {
          this.zg.stopPublishingStream(this.localStreamId);
        }
        this.zg.destroyStream(this.localStream);
        this.localStream = null;
      }
      this.playingStreams.forEach((audioEl, streamId) => {
        try {
          this.zg?.stopPlayingStream(streamId);
          audioEl.pause();
          audioEl.srcObject = null;
        } catch {}
      });
      this.playingStreams.clear();

      this.remoteSources.forEach((src) => {
        try {
          src.disconnect();
        } catch {}
      });
      this.remoteSources.clear();

      this.remoteGainNodes.forEach((gn) => {
        try {
          gn.disconnect();
        } catch {}
      });
      this.remoteGainNodes.clear();

      if (this.playbackAudioContext && this.playbackAudioContext.state !== 'closed') {
        try {
          this.playbackAudioContext.close().catch(() => {});
        } catch {}
        this.playbackAudioContext = null;
      }

      if (this.isConnected) {
        try {
          this.zg.logoutRoom(this.roomId);
        } catch (logoutErr: any) {
          // Ignore zm.lo (room not exist) when room is already closed or disconnected
        }
      }
      try {
        (this.zg as any).destroyEngine?.();
      } catch {}
      this.zg = null;
    } catch (err) {
      console.warn('Error during ZEGOCLOUD room leave:', err);
    } finally {
      this.isConnected = false;
      this.isPublishing = false;
    }
  }
}
