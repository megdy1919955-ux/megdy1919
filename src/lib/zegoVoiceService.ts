/**
 * ZegoVoiceEngine (موقوفة بالكامل):
 * تم استبدال ZEGOCLOUD بمحرك LiveKit Cloud WebRTC الأساسي.
 */

import { RealtimeRoomPresence, RealtimePeerAudioState, RealtimeNetworkQuality } from '../types/realtimeAudio';

export interface ZegoVoiceEngineOptions {
  appId?: number;
  server?: string | string[];
  roomId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  seatId?: number | null;
  isNoiseSuppressionEnabled?: boolean;
}

export class ZegoVoiceEngine {
  public appId: number = 0;
  public server: string | string[] = '';
  public roomId: string = '';
  public userId: string = '';
  public userName: string = '';
  public userAvatar: string = '';
  public seatId: number | null = null;
  public isMuted: boolean = true;
  public isSpeakerMuted: boolean = false;
  public isNoiseSuppressionEnabled: boolean = true;
  public isPublishing: boolean = false;
  public isConnected: boolean = false;

  public onConnectionStatus?: (status: 'disconnected' | 'connecting' | 'connected' | 'error') => void;
  public onPresenceUpdate?: (peers: RealtimeRoomPresence[]) => void;
  public onPeerSpeaking?: (state: RealtimePeerAudioState) => void;
  public onNetworkQuality?: (quality: RealtimeNetworkQuality) => void;
  public onMicPermissionError?: (err: Error) => void;

  constructor(options?: Partial<ZegoVoiceEngineOptions>) {
    if (options) {
      this.roomId = options.roomId || '';
      this.userId = options.userId || '';
      this.userName = options.userName || '';
      this.userAvatar = options.userAvatar || '';
      this.seatId = options.seatId ?? null;
    }
  }

  public async connect(): Promise<boolean> {
    console.log('[ZegoVoiceEngine] Service is retired. Using LiveKit Cloud WebRTC.');
    this.isConnected = true;
    this.onConnectionStatus?.('connected');
    return true;
  }

  public async join(): Promise<boolean> {
    return this.connect();
  }

  public async leave(): Promise<void> {
    this.destroy();
  }

  public async enableMicrophone(): Promise<boolean> {
    return true;
  }

  public async publishMicrophone(param?: any): Promise<boolean> {
    return true;
  }

  public async muteMicrophone(muted: boolean): Promise<void> {
    this.setMute(muted);
  }

  public setMute(muted: boolean): void {
    this.isMuted = muted;
  }

  public setSpeakerMuted(muted: boolean): void {
    this.isSpeakerMuted = muted;
  }

  public setNoiseSuppression(enabled: boolean): void {
    this.isNoiseSuppressionEnabled = enabled;
  }

  public updateSeat(seatId: number | null): void {
    this.seatId = seatId;
  }

  public async playSoundEffect(assetKey: string, volume: number = 1.0): Promise<void> {}

  public stopAllSoundEffects(): void {}

  public destroy(): void {
    this.isConnected = false;
    this.onConnectionStatus?.('disconnected');
  }
}
