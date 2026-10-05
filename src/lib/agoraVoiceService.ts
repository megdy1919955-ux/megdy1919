import type {
  IAgoraRTCClient,
  IMicrophoneAudioTrack,
  IAgoraRTCRemoteUser
} from 'agora-rtc-sdk-ng';
import { RealtimeRoomPresence, RealtimePeerAudioState, RealtimeNetworkQuality } from '../types/realtimeAudio';

let cachedAgoraRTC: any = null;
async function getAgoraRTCModule() {
  if (!cachedAgoraRTC && typeof window !== 'undefined') {
    const mod = await import('agora-rtc-sdk-ng');
    cachedAgoraRTC = mod.default || mod;
  }
  return cachedAgoraRTC;
}

export interface AgoraVoiceEngineOptions {
  appId?: string;
  roomId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  seatId?: number | null;
  isNoiseSuppressionEnabled?: boolean;
}

export class AgoraVoiceEngine {
  private client: IAgoraRTCClient | null = null;
  private localAudioTrack: IMicrophoneAudioTrack | null = null;
  private isJoined: boolean = false;
  private isPublishing: boolean = false;

  public appId: string;
  public roomId: string;
  public userId: string;
  public userName: string;
  public userAvatar: string;
  public seatId: number | null = null;
  public isMuted: boolean = true;
  public isSpeakerMuted: boolean = false;
  public isNoiseSuppressionEnabled: boolean = true;

  // UI Event Callbacks
  public onConnectionStatus?: (status: 'connecting' | 'connected' | 'disconnected' | 'error') => void;
  public onPeerSpeaking?: (state: RealtimePeerAudioState) => void;
  public onPresenceUpdate?: (peers: RealtimeRoomPresence[]) => void;
  public onNetworkQuality?: (quality: RealtimeNetworkQuality) => void;
  public onMicPermissionError?: (err: Error) => void;

  private remoteUsers: Map<string, IAgoraRTCRemoteUser> = new Map();

  constructor(options: AgoraVoiceEngineOptions) {
    this.appId = options.appId || ((import.meta as any).env?.VITE_AGORA_APP_ID as string) || '';
    this.roomId = options.roomId;
    this.userId = options.userId;
    this.userName = options.userName;
    this.userAvatar = options.userAvatar;
    this.seatId = options.seatId ?? null;
    this.isNoiseSuppressionEnabled = options.isNoiseSuppressionEnabled ?? true;
  }

  public async isSupported(): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    const AgoraRTC = await getAgoraRTCModule();
    return AgoraRTC?.checkSystemRequirements?.() ?? false;
  }

  public async connect(): Promise<boolean> {
    if (!this.appId) {
      console.warn('Agora App ID not provided. Switching to WebRTC engine.');
      return false;
    }

    try {
      const AgoraRTC = await getAgoraRTCModule();
      if (!AgoraRTC) return false;
      try {
        AgoraRTC.setLogLevel(3);
      } catch {}

      this.onConnectionStatus?.('connecting');
      this.client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

      // Setup Listeners
      this.setupClientEvents();

      // Join Channel
      // For token: null is accepted during development/testing with App ID without certificate
      await this.client.join(this.appId, this.roomId, null, this.userId);
      this.isJoined = true;
      this.onConnectionStatus?.('connected');

      // Enable Real-time Audio Volume Indication (Interval: 200ms, Smooth: 3)
      this.client.enableAudioVolumeIndicator();

      return true;
    } catch (err) {
      console.error('Failed to connect to Agora Voice Channel:', err);
      this.onConnectionStatus?.('error');
      return false;
    }
  }

  private setupClientEvents(): void {
    if (!this.client) return;

    // Remote user published audio track
    this.client.on('user-published', async (user, mediaType) => {
      if (mediaType === 'audio') {
        try {
          const remoteTrack = await this.client?.subscribe(user, mediaType);
          if (remoteTrack && !this.isSpeakerMuted) {
            remoteTrack.play();
          }
          this.remoteUsers.set(String(user.uid), user);
          this.notifyPresence();
        } catch (e) {
          console.warn('Error subscribing to remote audio track:', e);
        }
      }
    });

    // Remote user unpublished audio track
    this.client.on('user-unpublished', (user, mediaType) => {
      if (mediaType === 'audio') {
        this.notifyPresence();
      }
    });

    // Remote user left channel
    this.client.on('user-left', (user) => {
      this.remoteUsers.delete(String(user.uid));
      this.notifyPresence();
    });

    // Real-time Voice Volume Indicator (Detects who is speaking)
    this.client.on('volume-indicator', (volumes) => {
      volumes.forEach((vol) => {
        const isLocal = vol.uid === undefined || String(vol.uid) === this.userId;
        const peerId = isLocal ? this.userId : String(vol.uid);
        const level = vol.level; // 0 to 100
        const isSpeaking = level > 5;

        this.onPeerSpeaking?.({
          peerId,
          userName: isLocal ? this.userName : `متحدث (${peerId})`,
          userAvatar: isLocal ? this.userAvatar : '',
          seatId: isLocal ? this.seatId : null,
          isSpeaking,
          isMuted: isLocal ? this.isMuted : false,
          audioLevel: level / 100
        });
      });
    });

    // Network Quality Listener
    this.client.on('network-quality', (stats) => {
      const uplink = stats.uplinkNetworkQuality;
      const downlink = stats.downlinkNetworkQuality;
      const average = Math.max(uplink, downlink);

      let qualityScore: 'excellent' | 'good' | 'fair' | 'poor' = 'good';
      if (average <= 1) qualityScore = 'excellent';
      else if (average === 2) qualityScore = 'good';
      else if (average <= 4) qualityScore = 'fair';
      else qualityScore = 'poor';

      this.onNetworkQuality?.({
        pingMs: average * 25,
        qualityScore,
        engineMode: 'agora',
        bitrateKbps: 64
      });
    });
  }

  // Publish local microphone to Agora Channel
  public async enableMicrophone(): Promise<boolean> {
    if (!this.client || !this.isJoined) {
      console.warn('Cannot enable microphone: Agora client is not connected');
      return false;
    }

    try {
      if (!this.localAudioTrack) {
        const AgoraRTC = await getAgoraRTCModule();
        if (!AgoraRTC) return false;

        // High quality microphone track with noise suppression (ANS), echo cancellation (AEC), and gain control (AGC)
        this.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack({
          AEC: true,
          ANS: this.isNoiseSuppressionEnabled,
          AGC: true,
          encoderConfig: 'speech_standard'
        });
      }

      if (!this.isPublishing) {
        await this.client.publish(this.localAudioTrack);
        this.isPublishing = true;
      }

      await this.localAudioTrack.setMuted(this.isMuted);
      return true;
    } catch (err) {
      console.warn('Microphone permission error or device unavailable:', err);
      this.onMicPermissionError?.(err as Error);
      return false;
    }
  }

  public async setMute(muted: boolean): Promise<void> {
    this.isMuted = muted;
    if (this.localAudioTrack) {
      try {
        await this.localAudioTrack.setMuted(muted);
      } catch (e) {
        console.warn('Error setting Agora track mute state:', e);
      }
    }
  }

  public setSpeakerMuted(muted: boolean): void {
    this.isSpeakerMuted = muted;
    this.remoteUsers.forEach((user) => {
      if (user.audioTrack) {
        if (muted) {
          user.audioTrack.stop();
        } else {
          user.audioTrack.play();
        }
      }
    });
  }

  public setNoiseSuppression(enabled: boolean): void {
    this.isNoiseSuppressionEnabled = enabled;
    // When recreating or adjusting, Agora handles ANS internally
  }

  public updateSeat(seatId: number | null): void {
    this.seatId = seatId;
  }

  private notifyPresence(): void {
    const list: RealtimeRoomPresence[] = [];

    // Add local user
    list.push({
      peerId: this.userId,
      userName: this.userName,
      userAvatar: this.userAvatar,
      seatId: this.seatId,
      isMuted: this.isMuted,
      isSpeaking: false,
      joinedAt: Date.now()
    });

    // Add remote users
    this.remoteUsers.forEach((user, uid) => {
      list.push({
        peerId: uid,
        userName: `متحدث (${uid})`,
        userAvatar: '',
        seatId: null,
        isMuted: !user.hasAudio,
        isSpeaking: false,
        joinedAt: Date.now()
      });
    });

    this.onPresenceUpdate?.(list);
  }

  public async destroy(): Promise<void> {
    try {
      if (this.localAudioTrack) {
        this.localAudioTrack.stop();
        this.localAudioTrack.close();
        this.localAudioTrack = null;
      }
      if (this.client && this.isJoined) {
        await this.client.leave();
        this.client.removeAllListeners();
        this.client = null;
      }
      this.isJoined = false;
      this.isPublishing = false;
      this.remoteUsers.clear();
    } catch (e) {
      console.warn('Error cleaning up Agora Voice Engine:', e);
    }
  }
}
