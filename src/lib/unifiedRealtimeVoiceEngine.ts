import { RealtimeVoiceEngine, AudioStreamMode } from './realtimeVoiceService';
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
  private zegoEngine: ZegoVoiceEngine | null = null;
  private activeDriver: 'zegocloud' = 'zegocloud';
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
  public onDriverChanged?: (driver: 'zegocloud') => void;
  public onMicPermissionError?: (err: Error) => void;

  constructor(config: UnifiedVoiceEngineConfig) {
    this.config = config;
    this.currentSeatId = config.seatId ?? null;
    this.isNoiseSuppressionEnabled = config.isNoiseSuppressionEnabled ?? true;

    // 1. Text chat channel only (WebRTC signaling channel)
    this.webrtcEngine = new RealtimeVoiceEngine(config.roomId, config.userName, config.userAvatar);
    this.myPeerId = this.webrtcEngine.myPeerId;

    // 2. Pure ZEGOCLOUD Engine (Exclusive audio engine with official AppID 2138622497)
    // Fallback to WebRTC or any other provider is permanently eliminated.
    this.activeDriver = 'zegocloud';
    this.zegoEngine = new ZegoVoiceEngine({
      appId: 2138622497,
      roomId: config.roomId,
      userId: config.userId,
      userName: config.userName,
      userAvatar: config.userAvatar,
      seatId: this.currentSeatId,
      isNoiseSuppressionEnabled: this.isNoiseSuppressionEnabled
    });

    this.bindEngineEvents();
  }

  public getActiveDriver(): 'zegocloud' {
    return 'zegocloud';
  }

  private bindEngineEvents(): void {
    // 1. In-room chat text routing only
    this.webrtcEngine.onChatMessage = (msg) => {
      this.onChatMessage?.(msg);
    };

    // 2. ZEGOCLOUD Audio Event Routing - Sole authoritative source for voice, presence & quality
    if (this.zegoEngine) {
      this.zegoEngine.onConnectionStatus = (status) => {
        this.onConnectionStatus?.(status);
      };

      this.zegoEngine.onPresenceUpdate = (peers) => {
        this.onPresenceUpdate?.(peers);
      };

      this.zegoEngine.onPeerSpeaking = (state) => {
        this.onPeerSpeaking?.(state);
      };

      this.zegoEngine.onNetworkQuality = (quality) => {
        this.onNetworkQuality?.(quality);
      };

      this.zegoEngine.onMicPermissionError = (err) => {
        this.onMicPermissionError?.(err);
      };
    }
  }

  public async connect(): Promise<void> {
    // Connect WebSocket signaling strictly for room text chat messages
    this.webrtcEngine.connect();

    // 100% ZEGOCLOUD Real-Time Audio Engine - Fallback is completely disabled
    this.activeDriver = 'zegocloud';
    this.onDriverChanged?.('zegocloud');

    if (this.zegoEngine) {
      const success = await this.zegoEngine.join();
      if (!success) {
        console.warn('⚠️ ZEGOCLOUD room join attempt failed. Fallback is disabled; persisting strictly with ZEGOCLOUD.');
        this.onConnectionStatus?.('disconnected');
      }
    }
  }

  public async enableMicrophone(): Promise<boolean> {
    this.isMuted = false;
    this.setMute(false);
    // Strictly publish microphone via ZEGOCLOUD - No WebRTC fallback
    if (this.zegoEngine) {
      return await this.zegoEngine.publishMicrophone(true);
    }
    return false;
  }

  public setMute(muted: boolean): void {
    this.isMuted = muted;
    if (this.zegoEngine) {
      this.zegoEngine.muteMicrophone(muted);
    }
  }

  public setSpeakerMuted(muted: boolean): void {
    this.isSpeakerMuted = muted;
    if (this.zegoEngine) {
      this.zegoEngine.setSpeakerMuted(muted);
    }
  }

  public setNoiseSuppression(enabled: boolean): void {
    this.isNoiseSuppressionEnabled = enabled;
    if (this.zegoEngine) {
      this.zegoEngine.setNoiseSuppression(enabled);
    }
  }

  public setAudioStreamMode(mode: AudioStreamMode): void {
    // Keep media playback sync for ZEGOCLOUD
  }

  public updateSeat(seatId: number | null): void {
    this.currentSeatId = seatId;
    if (this.zegoEngine) {
      this.zegoEngine.seatId = seatId;
    }
    if (seatId === null) {
      this.disableMicrophone();
    }
  }

  // Completely shut down and stop physical microphone hardware
  public disableMicrophone(): void {
    this.isMuted = true;
    if (this.zegoEngine) {
      this.zegoEngine.publishMicrophone(false);
    }
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
  }
}
