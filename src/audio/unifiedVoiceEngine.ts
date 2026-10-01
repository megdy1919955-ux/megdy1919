import { AudioEngineService } from './audioEngineService';
import { MicLogicController } from './micLogicController';
import { PresenceLifecycleService } from './presenceLifecycleService';
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
  private audioEngine: AudioEngineService;
  private micController: MicLogicController;
  private presenceService: PresenceLifecycleService;
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

  private unsubs: Array<() => void> = [];

  constructor(config: UnifiedVoiceEngineConfig) {
    this.config = config;
    this.currentSeatId = config.seatId ?? null;
    this.isNoiseSuppressionEnabled = config.isNoiseSuppressionEnabled ?? true;
    this.myPeerId = config.userId;

    this.audioEngine = AudioEngineService.getInstance();
    this.micController = MicLogicController.getInstance();
    this.presenceService = PresenceLifecycleService.getInstance();

    this.chatSignaling = new RoomChatSignaling({
      roomId: config.roomId,
      userId: config.userId,
      userName: config.userName,
      userAvatar: config.userAvatar,
      seatId: this.currentSeatId
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

    // 1. AudioEngine StreamTriggers
    const unsubAudioStatus = this.audioEngine.on('status', (status) => {
      if (status !== 'idle') {
        this.onConnectionStatus?.(status);
      }
    });

    const unsubSpeaking = this.audioEngine.on('peerSpeaking', (state) => {
      this.onPeerSpeaking?.(state);
    });

    const unsubNet = this.audioEngine.on('networkQuality', (q) => {
      this.onNetworkQuality?.(q);
    });

    // 2. MicLogicController StreamTriggers
    const unsubMicStatus = this.micController.on('micStatusChanged', (status) => {
      this.isMuted = status.isHardwareMuted;
      this.currentSeatId = status.seatId;
    });

    const unsubMySpeaking = this.micController.on('speakingState', (spk) => {
      this.onPeerSpeaking?.({
        peerId: this.myPeerId,
        userName: this.config.userName,
        userAvatar: this.config.userAvatar,
        seatId: this.currentSeatId,
        isSpeaking: spk.isSpeaking,
        isMuted: this.isMuted,
        audioLevel: spk.audioLevel
      });
    });

    const unsubMicErr = this.micController.on('permissionError', (err) => {
      this.onMicPermissionError?.(err);
    });

    // 3. PresenceLifecycleService StreamTriggers
    const unsubPresence = this.presenceService.on('attendeesUpdated', (peers) => {
      const presenceList: RealtimeRoomPresence[] = peers.map((p) => ({
        peerId: p.peerId,
        userName: p.userName,
        userAvatar: p.userAvatar,
        seatId: p.seatId,
        isMuted: p.isMuted,
        isSpeaking: p.isSpeaking,
        joinedAt: p.joinedAt
      }));
      this.onPresenceUpdate?.(presenceList);
    });

    this.unsubs.push(
      unsubAudioStatus,
      unsubSpeaking,
      unsubNet,
      unsubMicStatus,
      unsubMySpeaking,
      unsubMicErr,
      unsubPresence
    );
  }

  public async connect(): Promise<void> {
    this.chatSignaling.connect();
    this.activeDriver = 'zegocloud';
    this.onDriverChanged?.('zegocloud');

    // 1. الدخول كمستمع (Subscriber Mode) فقط
    this.micController.initRoomContext(this.config.roomId, this.config.userId);
    this.micController.enterAsListener();

    // 2. إشارة الحضور الخفيفة للسيرفر
    await this.presenceService.enterRoom(this.config.roomId, {
      userId: this.config.userId,
      userName: this.config.userName,
      userAvatar: this.config.userAvatar,
      seatId: this.currentSeatId
    });

    // 3. تهيئة مخرج الصوت وسائط Media Audio
    const success = await this.audioEngine.initializeSubscriber({
      roomId: this.config.roomId,
      userId: this.config.userId,
      userName: this.config.userName
    });

    // 4. إذا كان لديه مقعد محدد عند الدخول، يتفعل كناشر
    if (success && this.currentSeatId !== null) {
      await this.micController.takeMicSeat(this.currentSeatId);
    }
  }

  public async enableMicrophone(): Promise<boolean> {
    if (this.currentSeatId !== null) {
      return await this.micController.setHardwareMute(false);
    }
    return false;
  }

  public setMute(muted: boolean): void {
    this.isMuted = muted;
    this.micController.setHardwareMute(muted).catch(() => {});
  }

  public setSpeakerMuted(muted: boolean): void {
    this.isSpeakerMuted = muted;
    this.audioEngine.setSpeakerMuted(muted);
  }

  public setNoiseSuppression(enabled: boolean): void {
    this.isNoiseSuppressionEnabled = enabled;
    this.micController.setNoiseSuppression(enabled);
  }

  public setAudioStreamMode(_mode: AudioStreamMode): void {
    this.audioEngine.enforceMediaAudioOutput();
  }

  public updateSeat(seatId: number | null): void {
    this.currentSeatId = seatId;
    this.chatSignaling.updateSeat(seatId);

    if (seatId !== null) {
      // الصعود للمايك (Publisher Mode)
      this.micController.takeMicSeat(seatId).catch(() => {});
    } else {
      // النزول للمايك (العودة لوضع المستمع وتحرير العتاد)
      this.disableMicrophone();
    }
  }

  public disableMicrophone(): void {
    this.isMuted = true;
    this.micController.stepDownFromMic();
  }

  public sendChat(text: string, badges?: any[], bubbleSkin?: string, msgId?: string): void {
    this.chatSignaling.sendChat(text, badges, bubbleSkin, msgId);
  }

  public destroy(): void {
    this.unsubs.forEach((u) => u());
    this.unsubs = [];
    this.chatSignaling.destroy();
    this.presenceService.disconnectAndCleanup();
  }
}
