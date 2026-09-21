import { RealtimeVoiceEngine, AudioStreamMode } from './realtimeVoiceService';
import { AgoraVoiceEngine } from './agoraVoiceService';
import { ZegoVoiceEngine } from './zegoVoiceService';
import { RealtimeRoomPresence, RealtimePeerAudioState, RealtimeNetworkQuality } from '../types/realtimeAudio';

export type VoiceEngineDriver = 'zegocloud' | 'agora' | 'webrtc' | 'auto';

export interface UnifiedVoiceEngineConfig {
  roomId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  seatId?: number | null;
  preferredDriver?: VoiceEngineDriver;
  isNoiseSuppressionEnabled?: boolean;
}

export class UnifiedRealtimeVoiceEngine {
  private webrtcEngine: RealtimeVoiceEngine;
  private agoraEngine: AgoraVoiceEngine | null = null;
  private zegoEngine: ZegoVoiceEngine | null = null;
  private activeDriver: 'zegocloud' | 'agora' | 'webrtc' = 'webrtc';
  private config: UnifiedVoiceEngineConfig;

  public isMuted: boolean = true;
  public isSpeakerMuted: boolean = false;
  public isNoiseSuppressionEnabled: boolean = true;
  public currentSeatId: number | null = null;
  public myPeerId: string;
  private _getCurrentSeatId?: () => number | null;

  public set getCurrentSeatId(fn: (() => number | null) | undefined) {
    this._getCurrentSeatId = fn;
    this.webrtcEngine.getCurrentSeatId = fn;
  }
  public get getCurrentSeatId(): (() => number | null) | undefined {
    return this._getCurrentSeatId;
  }

  // Unified Callbacks
  public onConnectionStatus?: (status: 'connecting' | 'connected' | 'disconnected' | 'error') => void;
  public onPresenceUpdate?: (peers: RealtimeRoomPresence[]) => void;
  public onPeerSpeaking?: (state: RealtimePeerAudioState) => void;
  public onNetworkQuality?: (quality: RealtimeNetworkQuality) => void;
  public onChatMessage?: (msg: any) => void;
  public onDriverChanged?: (driver: 'zegocloud' | 'agora' | 'webrtc') => void;
  public onMicPermissionError?: (err: Error) => void;

  constructor(config: UnifiedVoiceEngineConfig) {
    this.config = config;
    this.currentSeatId = config.seatId ?? null;
    this.isNoiseSuppressionEnabled = config.isNoiseSuppressionEnabled ?? true;

    // 1. Initialize WebRTC engine as dependable base/fallback & signaling
    this.webrtcEngine = new RealtimeVoiceEngine(config.roomId, config.userName, config.userAvatar);
    this.myPeerId = this.webrtcEngine.myPeerId;

    const preferred = config.preferredDriver || 'auto';

    // 2. Initialize ZEGOCLOUD Engine only if explicitly requested
    if (preferred === 'zegocloud') {
      this.zegoEngine = new ZegoVoiceEngine({
        appId: 2138622497,
        roomId: config.roomId,
        userId: config.userId,
        userName: config.userName,
        userAvatar: config.userAvatar,
        seatId: this.currentSeatId,
        isNoiseSuppressionEnabled: this.isNoiseSuppressionEnabled
      });
      this.activeDriver = 'zegocloud';
    }

    // 3. Initialize Agora Engine only if explicitly requested and configured
    const agoraAppId = ((import.meta as any).env?.VITE_AGORA_APP_ID as string) || '';
    if (agoraAppId && preferred === 'agora') {
      this.agoraEngine = new AgoraVoiceEngine({
        appId: agoraAppId,
        roomId: config.roomId,
        userId: config.userId,
        userName: config.userName,
        userAvatar: config.userAvatar,
        seatId: this.currentSeatId,
        isNoiseSuppressionEnabled: this.isNoiseSuppressionEnabled
      });
      this.activeDriver = 'agora';
    }

    // Default to high-fidelity native WebRTC engine
    if (preferred === 'auto' || preferred === 'webrtc') {
      this.activeDriver = 'webrtc';
    }

    this.bindEngineEvents();
  }

  public getActiveDriver(): 'zegocloud' | 'agora' | 'webrtc' {
    return this.activeDriver;
  }

  private bindEngineEvents(): void {
    // 1. WebRTC Event Routing (Always routes chat and fallback presence)
    this.webrtcEngine.onConnectionStatus = (status) => {
      if (this.activeDriver === 'webrtc') {
        this.onConnectionStatus?.(status);
      }
    };

    this.webrtcEngine.onPresenceUpdate = (peers) => {
      if (this.activeDriver === 'webrtc') {
        this.onPresenceUpdate?.(peers);
      }
    };

    this.webrtcEngine.onPeerSpeaking = (state) => {
      if (this.activeDriver === 'webrtc') {
        this.onPeerSpeaking?.(state);
      }
    };

    this.webrtcEngine.onChatMessage = (msg) => {
      this.onChatMessage?.(msg);
    };

    this.webrtcEngine.onMicPermissionError = (err) => {
      if (this.activeDriver === 'webrtc') {
        this.onMicPermissionError?.(err);
      }
    };

    // 2. ZEGOCLOUD Event Routing
    if (this.zegoEngine) {
      this.zegoEngine.onConnectionStatus = (status) => {
        if (this.activeDriver === 'zegocloud') {
          this.onConnectionStatus?.(status);
        }
      };

      this.zegoEngine.onPresenceUpdate = (peers) => {
        if (this.activeDriver === 'zegocloud') {
          this.onPresenceUpdate?.(peers);
        }
      };

      this.zegoEngine.onPeerSpeaking = (state) => {
        if (this.activeDriver === 'zegocloud') {
          this.onPeerSpeaking?.(state);
        }
      };

      this.zegoEngine.onNetworkQuality = (quality) => {
        if (this.activeDriver === 'zegocloud') {
          this.onNetworkQuality?.(quality);
        }
      };

      this.zegoEngine.onMicPermissionError = (err) => {
        if (this.activeDriver === 'zegocloud') {
          this.onMicPermissionError?.(err);
        }
      };
    }

    // 3. Agora Event Routing
    if (this.agoraEngine) {
      this.agoraEngine.onConnectionStatus = (status) => {
        if (this.activeDriver === 'agora') {
          this.onConnectionStatus?.(status);
        }
      };

      this.agoraEngine.onPresenceUpdate = (peers) => {
        if (this.activeDriver === 'agora') {
          this.onPresenceUpdate?.(peers);
        }
      };

      this.agoraEngine.onPeerSpeaking = (state) => {
        if (this.activeDriver === 'agora') {
          this.onPeerSpeaking?.(state);
        }
      };

      this.agoraEngine.onNetworkQuality = (quality) => {
        if (this.activeDriver === 'agora') {
          this.onNetworkQuality?.(quality);
        }
      };

      this.agoraEngine.onMicPermissionError = (err) => {
        if (this.activeDriver === 'agora') {
          this.onMicPermissionError?.(err);
        }
      };
    }
  }

  public async connect(): Promise<void> {
    // Always connect WebSocket signaling for room chat & presence
    this.webrtcEngine.connect();

    // Try ZEGOCLOUD first if active
    if (this.activeDriver === 'zegocloud' && this.zegoEngine) {
      const success = await this.zegoEngine.join();
      if (!success) {
        console.warn('ZEGOCLOUD room connection unsuccessful. Seamlessly falling back to Agora / WebRTC.');
        if (this.agoraEngine) {
          const agoraSuccess = await this.agoraEngine.connect();
          if (agoraSuccess) {
            this.activeDriver = 'agora';
            this.onDriverChanged?.('agora');
            return;
          }
        }
        this.activeDriver = 'webrtc';
        this.onDriverChanged?.('webrtc');
      } else {
        this.onDriverChanged?.('zegocloud');
        return;
      }
    } else if (this.activeDriver === 'agora' && this.agoraEngine) {
      const success = await this.agoraEngine.connect();
      if (!success) {
        this.activeDriver = 'webrtc';
        this.onDriverChanged?.('webrtc');
      } else {
        this.onDriverChanged?.('agora');
        return;
      }
    } else {
      this.activeDriver = 'webrtc';
      this.onDriverChanged?.('webrtc');
    }

    // WebRTC default quality metrics
    this.onNetworkQuality?.({
      pingMs: 32,
      qualityScore: 'excellent',
      engineMode: 'webrtc',
      bitrateKbps: 48
    });
  }

  public async enableMicrophone(): Promise<boolean> {
    this.isMuted = false;
    this.setMute(false);
    if (this.activeDriver === 'zegocloud' && this.zegoEngine) {
      const success = await this.zegoEngine.publishMicrophone(true);
      if (success) {
        return true;
      }
    }

    if (this.activeDriver === 'agora' && this.agoraEngine) {
      const success = await this.agoraEngine.enableMicrophone();
      if (success) {
        return true;
      }
    }

    // Native WebRTC fallback
    const res = await this.webrtcEngine.enableMicrophone();
    return res;
  }

  public setMute(muted: boolean): void {
    this.isMuted = muted;
    this.webrtcEngine.setMute(muted);
    if (this.zegoEngine) {
      this.zegoEngine.muteMicrophone(muted);
    }
    if (this.agoraEngine) {
      this.agoraEngine.setMute(muted);
    }
  }

  public setSpeakerMuted(muted: boolean): void {
    this.isSpeakerMuted = muted;
    this.webrtcEngine.setSpeakerMuted(muted);
    if (this.zegoEngine) {
      this.zegoEngine.setSpeakerMuted(muted);
    }
    if (this.agoraEngine) {
      this.agoraEngine.setSpeakerMuted(muted);
    }
  }

  public setNoiseSuppression(enabled: boolean): void {
    this.isNoiseSuppressionEnabled = enabled;
    this.webrtcEngine.setNoiseSuppression(enabled);
    if (this.zegoEngine) {
      this.zegoEngine.setNoiseSuppression(enabled);
    }
    if (this.agoraEngine) {
      this.agoraEngine.setNoiseSuppression(enabled);
    }
  }

  public setAudioStreamMode(mode: AudioStreamMode): void {
    this.webrtcEngine.setAudioStreamMode(mode);
  }

  public updateSeat(seatId: number | null): void {
    this.currentSeatId = seatId;
    this.webrtcEngine.updateSeat(seatId);

    // If user leaves mic seats, completely disable microphone and release hardware tracks!
    if (seatId === null) {
      this.disableMicrophone();
    } else {
      if (this.zegoEngine) {
        this.zegoEngine.seatId = seatId;
      }
    }

    if (this.agoraEngine) {
      this.agoraEngine.updateSeat(seatId);
    }
  }

  // Completely shut down and stop physical microphone hardware
  public disableMicrophone(): void {
    this.isMuted = true;
    if (this.zegoEngine) {
      this.zegoEngine.publishMicrophone(false);
    }
    if (this.agoraEngine) {
      this.agoraEngine.setMute(true);
    }
    this.webrtcEngine.disableMicrophone();
  }

  public sendChat(text: string, badges?: any[], bubbleSkin?: string, msgId?: string): void {
    this.webrtcEngine.sendChat(text, badges, bubbleSkin, msgId);
  }

  public destroy(): void {
    this.webrtcEngine.destroy();
    if (this.zegoEngine) {
      this.zegoEngine.leave();
      this.zegoEngine = null;
    }
    if (this.agoraEngine) {
      this.agoraEngine.destroy();
      this.agoraEngine = null;
    }
  }
}
