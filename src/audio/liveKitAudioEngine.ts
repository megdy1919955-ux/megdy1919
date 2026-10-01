/**
 * LiveKitAudioEngine:
 * محرك الصوت عالي الجودة المستند إلى LiveKit Cloud WebRTC
 * يوفر اتصالاً فائق الدقة ومنخفض التأخير للبث الصوتي للغرف مع إمكانية التحدث والاستماع.
 */

import {
  Room,
  RoomEvent,
  RemoteTrack,
  RemoteTrackPublication,
  RemoteParticipant,
  LocalAudioTrack,
  createLocalAudioTrack,
  Track
} from 'livekit-client';

export type LiveKitStatus = 'idle' | 'connecting' | 'connected' | 'disconnected' | 'error';

export interface LiveKitStreamInfo {
  participantIdentity: string;
  participantName?: string;
  track: RemoteTrack;
}

export class LiveKitAudioEngine {
  private static instance: LiveKitAudioEngine | null = null;

  public status: LiveKitStatus = 'idle';
  public roomId: string = '';
  public userId: string = '';
  public userName: string = '';
  public isMicMuted: boolean = true;

  private room: Room | null = null;
  private localAudioTrack: LocalAudioTrack | null = null;
  private remoteAudioElements: Map<string, HTMLAudioElement> = new Map();
  private listeners: Map<string, Set<(data: any) => void>> = new Map();

  public static getInstance(): LiveKitAudioEngine {
    if (!LiveKitAudioEngine.instance) {
      LiveKitAudioEngine.instance = new LiveKitAudioEngine();
    }
    return LiveKitAudioEngine.instance;
  }

  constructor() {
    this.setStatus('idle');
  }

  public getRoomInstance(): Room | null {
    return this.room;
  }

  public on(event: string, callback: (data: any) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }

  private emit(event: string, data?: any): void {
    const cbs = this.listeners.get(event);
    if (cbs) {
      cbs.forEach((cb) => {
        try {
          cb(data);
        } catch (e) {
          console.error(`[LiveKitAudioEngine] listener error on ${event}:`, e);
        }
      });
    }
  }

  private setStatus(s: LiveKitStatus): void {
    this.status = s;
    this.emit('status', s);
  }

  /**
   * الانضمام إلى الغرفة الصوتية عبر LiveKit Cloud
   */
  public async joinRoom(roomId: string, userId: string, userName: string): Promise<boolean> {
    this.roomId = roomId;
    this.userId = userId;
    this.userName = userName;

    this.setStatus('connecting');

    try {
      // جلب توكن LiveKit من السيرفر
      const res = await fetch(`/api/livekit/token?room=${encodeURIComponent(roomId)}&identity=${encodeURIComponent(userId)}&name=${encodeURIComponent(userName)}`);
      if (!res.ok) {
        console.warn('[LiveKitAudioEngine] Token endpoint returned status:', res.status);
        this.setStatus('disconnected');
        return false;
      }

      const data = await res.json();
      if (!data.available || !data.token || !data.serverUrl) {
        console.warn('[LiveKitAudioEngine] Token response invalid:', data);
        this.setStatus('disconnected');
        return false;
      }

      if (this.room) {
        try {
          await this.room.disconnect();
        } catch {}
        this.room = null;
      }

      const room = new Room({
        adaptiveStream: true,
        dynacast: true,
        audioCaptureDefaults: {
          autoGainControl: true,
          echoCancellation: true,
          noiseSuppression: true
        }
      });

      this.room = room;

      // استقبال المسارات الصوتية للآخرين وتشغيلها
      room.on(RoomEvent.TrackSubscribed, (track: RemoteTrack, publication: RemoteTrackPublication, participant: RemoteParticipant) => {
        if (track.kind === Track.Kind.Audio) {
          const audioElement = track.attach();
          audioElement.autoplay = true;
          (audioElement as any).playsInline = true;
          this.remoteAudioElements.set(participant.identity, audioElement);
          this.emit('remoteAudioStarted', {
            identity: participant.identity,
            name: participant.name
          });
        }
      });

      room.on(RoomEvent.TrackUnsubscribed, (track: RemoteTrack, publication: RemoteTrackPublication, participant: RemoteParticipant) => {
        if (track.kind === Track.Kind.Audio) {
          const el = this.remoteAudioElements.get(participant.identity);
          if (el) {
            track.detach(el);
            el.remove();
            this.remoteAudioElements.delete(participant.identity);
          }
          this.emit('remoteAudioStopped', {
            identity: participant.identity
          });
        }
      });

      room.on(RoomEvent.ActiveSpeakersChanged, (speakers) => {
        this.emit('activeSpeakers', speakers.map(s => ({ identity: s.identity, level: s.audioLevel })));
      });

      room.on(RoomEvent.Disconnected, () => {
        this.setStatus('disconnected');
      });

      room.on(RoomEvent.Reconnecting, () => {
        this.setStatus('connecting');
      });

      room.on(RoomEvent.Reconnected, () => {
        this.setStatus('connected');
      });

      // الاتصال بسيرفر LiveKit Cloud
      await room.connect(data.serverUrl, data.token);
      this.setStatus('connected');
      console.log('[LiveKitAudioEngine] Connected to room successfully:', roomId);
      return true;
    } catch (err: any) {
      console.warn('[LiveKitAudioEngine] Connection failed:', err?.message || err);
      this.setStatus('disconnected');
      return false;
    }
  }

  /**
   * تشغيل ونشر صوت المايك عند الصعود على المقعد
   */
  public async publishMicrophone(audioStream?: MediaStream): Promise<boolean> {
    if (!this.room || this.status !== 'connected') {
      console.warn('[LiveKitAudioEngine] Room is not connected');
      return false;
    }

    try {
      if (this.localAudioTrack) {
        await this.localAudioTrack.unmute();
        this.isMicMuted = false;
        this.emit('micStateChanged', { isMuted: false });
        return true;
      }

      if (audioStream && audioStream.getAudioTracks().length > 0) {
        const mediaStreamTrack = audioStream.getAudioTracks()[0];
        this.localAudioTrack = new LocalAudioTrack(mediaStreamTrack);
      } else {
        this.localAudioTrack = await createLocalAudioTrack({
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        });
      }

      await this.room.localParticipant.publishTrack(this.localAudioTrack);
      this.isMicMuted = false;
      this.emit('micStateChanged', { isMuted: false });
      return true;
    } catch (err: any) {
      console.warn('[LiveKitAudioEngine] Failed to publish microphone:', err?.message || err);
      return false;
    }
  }

  /**
   * كتم المايك أو إيقاف النشر
   */
  public async muteMicrophone(): Promise<void> {
    if (this.localAudioTrack) {
      try {
        await this.localAudioTrack.mute();
      } catch {}
      this.isMicMuted = true;
      this.emit('micStateChanged', { isMuted: true });
    }
  }

  /**
   * إلغاء كتم المايك
   */
  public async unmuteMicrophone(): Promise<void> {
    if (this.localAudioTrack) {
      try {
        await this.localAudioTrack.unmute();
      } catch {}
      this.isMicMuted = false;
      this.emit('micStateChanged', { isMuted: false });
    }
  }

  /**
   * إيقاف البث ومغادرة المقعد
   */
  public async unpublishMicrophone(): Promise<void> {
    if (this.localAudioTrack && this.room) {
      try {
        await this.room.localParticipant.unpublishTrack(this.localAudioTrack);
        this.localAudioTrack.stop();
        this.localAudioTrack = null;
      } catch {}
    }
    this.isMicMuted = true;
    this.emit('micStateChanged', { isMuted: true });
  }

  /**
   * مغادرة الغرفة وتنظيف جميع الموارد
   */
  public async leaveRoom(): Promise<void> {
    await this.unpublishMicrophone();

    this.remoteAudioElements.forEach((el) => {
      try {
        el.pause();
        el.srcObject = null;
        el.remove();
      } catch {}
    });
    this.remoteAudioElements.clear();

    if (this.room) {
      try {
        await this.room.disconnect();
      } catch {}
      this.room = null;
    }

    this.setStatus('disconnected');
    this.listeners.clear();
  }
}
