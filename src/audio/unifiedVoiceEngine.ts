import { ZegoVoiceEngine } from './zegoAudioService';
import { RoomChatSignaling } from './roomChatSignaling';
import {
  RealtimeRoomPresence,
  RealtimePeerAudioState,
  RealtimeNetworkQuality,
  UnifiedVoiceEngineConfig,
  AudioStreamMode
} from './types';

/**
 * UnifiedRealtimeVoiceEngine:
 * Isolated, modular high-performance real-time voice coordinator.
 * Audio is driven exclusively by ZEGOCLOUD (AppID: 2138622497) with zero WebRTC fallback.
 * In-room chat messages are routed via lightweight RoomChatSignaling.
 */
export class UnifiedRealtimeVoiceEngine {
  private chatSignaling: RoomChatSignaling;
  private zegoEngine: ZegoVoiceEngine;
  private activeDriver: 'zegocloud' = 'zegocloud';
  private config: UnifiedVoiceEngineConfig;

  public isMuted: boolean = true;
  public isSpeakerMuted: boolean = false;
  public isNoiseSuppressionEnabled: boolean = true;
  public currentSeatId: number | null = null;
  public myPeerId: string;
  public getCurrentSeatId?: () => number | null;

  // Event Callbacks
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

    // 1. Text chat channel (lightweight WebSocket signaling)
    this.chatSignaling = new RoomChatSignaling({
      roomId: config.roomId,
      userId: config.userId,
      userName: config.userName,
      userAvatar: config.userAvatar,
      seatId: this.currentSeatId
    });
    this.myPeerId = this.chatSignaling.myPeerId;

    // 2. Pure ZEGOCLOUD Audio Engine (Official AppID: 2138622497)
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
    // 1. In-room chat text routing
    this.chatSignaling.onChatMessage = (msg) => {
      this.onChatMessage?.(msg);
    };

    // 2. ZEGOCLOUD Audio Event Routing
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

  public async connect(): Promise<void> {
    // Connect chat signaling
    this.chatSignaling.connect();

    // Connect ZEGOCLOUD Audio Engine
    this.activeDriver = 'zegocloud';
    this.onDriverChanged?.('zegocloud');

    const success = await this.zegoEngine.join();
    if (!success) {
      console.warn('ZEGOCLOUD room join attempt notice. Fallback is permanently disabled.');
      this.onConnectionStatus?.('disconnected');
    }
  }

  public async enableMicrophone(): Promise<boolean> {
    this.setMute(false);
    return await this.zegoEngine.publishMicrophone(true);
  }

  public setMute(muted: boolean): void {
    this.isMuted = muted;
    this.zegoEngine.muteMicrophone(muted);
  }

  public setSpeakerMuted(muted: boolean): void {
    this.isSpeakerMuted = muted;
    this.zegoEngine.setSpeakerMuted(muted);
  }

  public setNoiseSuppression(enabled: boolean): void {
    this.isNoiseSuppressionEnabled = enabled;
    this.zegoEngine.setNoiseSuppression(enabled);
  }

  public setAudioStreamMode(_mode: AudioStreamMode): void {
    // Kept in STREAM_MUSIC Media mode
  }

  public updateSeat(seatId: number | null): void {
    this.currentSeatId = seatId;
    this.zegoEngine.seatId = seatId;
    this.chatSignaling.updateSeat(seatId);

    if (seatId === null) {
      this.disableMicrophone();
    }
  }

  public disableMicrophone(): void {
    this.isMuted = true;
    this.zegoEngine.publishMicrophone(false);
  }

  public sendChat(text: string, badges?: any[], bubbleSkin?: string, msgId?: string): void {
    this.chatSignaling.sendChat(text, badges, bubbleSkin, msgId);
  }

  public destroy(): void {
    this.chatSignaling.destroy();
    this.zegoEngine.leave();
  }
}
