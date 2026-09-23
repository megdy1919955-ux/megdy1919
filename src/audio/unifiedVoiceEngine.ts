import { ZegoVoiceEngine } from './zegoAudioService';
import { RoomChatSignaling } from './roomChatSignaling';
import {
  RealtimeRoomPresence,
  RealtimePeerAudioState,
  RealtimeNetworkQuality,
  UnifiedVoiceEngineConfig,
  AudioStreamMode
} from './types';

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

    this.chatSignaling = new RoomChatSignaling({
      roomId: config.roomId,
      userId: config.userId,
      userName: config.userName,
      userAvatar: config.userAvatar,
      seatId: this.currentSeatId
    });
    this.myPeerId = this.chatSignaling.myPeerId;

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
    this.chatSignaling.onChatMessage = (msg) => {
      this.onChatMessage?.(msg);
    };

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
    this.chatSignaling.connect();
    this.activeDriver = 'zegocloud';
    this.onDriverChanged?.('zegocloud');

    const success = await this.zegoEngine.join();
    if (!success) {
      this.onConnectionStatus?.('disconnected');
    }
  }

  public async enableMicrophone(): Promise<boolean> {
    this.setMute(false);
    if (typeof (this.zegoEngine as any).publishMicrophone === 'function') {
      return await (this.zegoEngine as any).publishMicrophone(true);
    }
    return true;
  }

  public setMute(muted: boolean): void {
    this.isMuted = muted;
    if (typeof this.zegoEngine.muteMicrophone === 'function') {
      this.zegoEngine.muteMicrophone(muted);
    }
  }

  public setSpeakerMuted(muted: boolean): void {
    this.isSpeakerMuted = muted;
    if (typeof this.zegoEngine.setSpeakerMuted === 'function') {
      this.zegoEngine.setSpeakerMuted(muted);
    }
  }

  public setNoiseSuppression(enabled: boolean): void {
    this.isNoiseSuppressionEnabled = enabled;
    if (typeof this.zegoEngine.setNoiseSuppression === 'function') {
      this.zegoEngine.setNoiseSuppression(enabled);
    }
  }

  public setAudioStreamMode(_mode: AudioStreamMode): void {}

  public updateSeat(seatId: number | null): void {
    this.currentSeatId = seatId;
    (this.zegoEngine as any).seatId = seatId;
    this.chatSignaling.updateSeat(seatId);

    if (seatId === null) {
      this.disableMicrophone();
    }
  }

  public disableMicrophone(): void {
    this.isMuted = true;
    if (typeof (this.zegoEngine as any).publishMicrophone === 'function') {
      (this.zegoEngine as any).publishMicrophone(false);
    } else {
      this.setMute(true);
    }
  }

  public sendChat(text: string, badges?: any[], bubbleSkin?: string, msgId?: string): void {
    this.chatSignaling.sendChat(text, badges, bubbleSkin, msgId);
  }

  public destroy(): void {
    this.chatSignaling.destroy();
    this.zegoEngine.leave();
  }
}
