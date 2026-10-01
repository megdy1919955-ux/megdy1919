/**
 * MicLogicController:
 * مسؤولية أحادية وحصرية: إدارة منطق المايكات ومعالجة الصوت وتحرير العتاد (Mic Logic & Hardware Release).
 *  - وضع المستمع (Listener): لا يطلب أذونات ولا يفتح المايك إطلاقاً.
 *  - وضع الناشر (Publisher): يتفعل لاقط الميكروفون فقط عند الصعود الفعلي على المقعد.
 *  - الكتم الحقيقي (Hardware Mute): إيقاف لاقط الصوت على مستوى العتاد تماماً (track.stop)
 *    لإزالة إشارة المايك النشط الخضراء/البرتقالية من أعلى شاشة الجوال فوراً وتوفير 100% من طاقة البطارية.
 *  - منع الصدى والضوضاء: تفعيل AEC (Acoustic Echo Cancellation) وبوابة الضوضاء (Noise Gate).
 */

import { AudioEngineService } from './audioEngineService';
import { LiveKitAudioEngine } from './liveKitAudioEngine';
import { AudioNoiseSuppressionProcessor, getSavedNoiseSuppressionState } from './audioNoiseSuppressionProcessor';
import { PresenceLifecycleService } from './presenceLifecycleService';

export interface MicStatusState {
  isOnMic: boolean;
  seatId: number | null;
  isHardwareMuted: boolean;
  isGateOpen: boolean;
  audioLevel: number;
  noiseSuppressionEnabled: boolean;
}

export type MicLogicEventMap = {
  micStatusChanged: MicStatusState;
  speakingState: { isSpeaking: boolean; audioLevel: number };
  hardwareReleased: void;
  permissionError: Error;
};

export class MicLogicController {
  private static instance: MicLogicController | null = null;

  public isOnMic: boolean = false;
  public seatId: number | null = null;
  public isHardwareMuted: boolean = true;
  public isNoiseSuppressionEnabled: boolean = true;

  private rawMediaStream: MediaStream | null = null;
  private noiseProcessor: AudioNoiseSuppressionProcessor | null = null;
  private localPublishStreamId: string = '';
  private isPublishingToZego: boolean = false;
  private roomId: string = '';
  private userId: string = '';

  // StreamTriggers
  private listeners: Map<string, Set<(data: any) => void>> = new Map();

  public static getInstance(): MicLogicController {
    if (!MicLogicController.instance) {
      MicLogicController.instance = new MicLogicController();
    }
    return MicLogicController.instance;
  }

  constructor() {
    this.isNoiseSuppressionEnabled = getSavedNoiseSuppressionState();
  }

  public on<K extends keyof MicLogicEventMap>(event: K, handler: (data: MicLogicEventMap[K]) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler as any);
    return () => {
      this.listeners.get(event)?.delete(handler as any);
    };
  }

  private emit<K extends keyof MicLogicEventMap>(event: K, data: MicLogicEventMap[K]): void {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.forEach((fn) => {
        try {
          fn(data);
        } catch (e) {
          console.error(`[MicLogicController] Error in handler for ${event}:`, e);
        }
      });
    }
  }

  public initRoomContext(roomId: string, userId: string): void {
    this.roomId = roomId;
    this.userId = userId;
  }

  /**
   * وضع المستمع (Listener Mode):
   * الدخول للروم دون فتح لاقط الميكروفون نهائياً، وضمان بقاء عتاد المايك مطفأ بالكامل
   */
  public enterAsListener(): void {
    this.releaseHardwareMicrophone();
    this.isOnMic = false;
    this.seatId = null;
    this.isHardwareMuted = true;
    this.broadcastStatus();
  }

  /**
   * وضع الناشر (Publisher Mode):
   * الصعود الفعلي على المايك.
   * autoAcquireMic: افتراضياً false لتجنب طلب إذن المايك عند تحميل الصفحة بدون نقر المستخدم.
   * يتفعل اللاقط فقط عند الطلب الصريح أو تفاعل المستخدم (User Gesture).
   */
  public async takeMicSeat(seatId: number, autoAcquireMic: boolean = false): Promise<boolean> {
    this.isOnMic = true;
    this.seatId = seatId;

    if (autoAcquireMic) {
      this.isHardwareMuted = false;
      const acquired = await this.acquireAndPublishStream();
      this.broadcastStatus();
      try {
        PresenceLifecycleService.getInstance().sendSeatUpdate(seatId, false);
      } catch {}
      return acquired;
    } else {
      this.isHardwareMuted = true;
      this.broadcastStatus();
      try {
        PresenceLifecycleService.getInstance().sendSeatUpdate(seatId, true);
      } catch {}
      return true;
    }
  }

  /**
   * النزول من المايك وتحرير العتاد فوراً
   */
  public stepDownFromMic(): void {
    this.releaseHardwareMicrophone();
    this.isOnMic = false;
    this.seatId = null;
    this.isHardwareMuted = true;
    this.broadcastStatus();
    this.emit('hardwareReleased', undefined);
    try {
      PresenceLifecycleService.getInstance().sendSeatUpdate(null, true);
    } catch {}
  }

  /**
   * الكتم الحقيقي على مستوى العتاد (Hardware Mute)
   * عند كتم الصوت: إيقاف التراكات تماماً (track.stop) وفصل البث لإزالة إشارة المايك من شاشة الهاتف
   * عند إلغاء الكتم: إعادة طلب اللاقط بسلاسة وإعادة البث النقي
   */
  public async toggleMute(): Promise<boolean> {
    if (!this.isOnMic) return true;
    const targetMute = !this.isHardwareMuted;
    return await this.setHardwareMute(targetMute);
  }

  public async setHardwareMute(mute: boolean): Promise<boolean> {
    this.isHardwareMuted = mute;

    if (mute) {
      // 🛑 كتم حقيقي عتادي: إيقاف تشغيل عتاد المايك لتوفير البطارية وإزالة الأيقونة من شريط الإشعارات
      this.releaseHardwareMicrophone();
      this.emit('speakingState', { isSpeaking: false, audioLevel: 0 });
      this.broadcastStatus();
      try {
        PresenceLifecycleService.getInstance().sendSeatUpdate(this.seatId, true);
      } catch {}
      return true;
    } else {
      // 🎙️ إعادة تشغيل العتاد: طلب اللاقط ومعالجة الصوت وإعادة البث
      if (this.isOnMic) {
        const ok = await this.acquireAndPublishStream();
        this.broadcastStatus();
        try {
          PresenceLifecycleService.getInstance().sendSeatUpdate(this.seatId, false);
        } catch {}
        return ok;
      }
      return false;
    }
  }

  /**
   * تفعيل/تعطيل معالج إلغاء الصدى وبوابة الضوضاء (AEC & Noise Gate)
   */
  public setNoiseSuppression(enabled: boolean): void {
    this.isNoiseSuppressionEnabled = enabled;
    if (this.noiseProcessor) {
      this.noiseProcessor.setEnabled(enabled);
    }
    if (this.rawMediaStream) {
      this.rawMediaStream.getAudioTracks().forEach((track) => {
        try {
          track.applyConstraints({
            noiseSuppression: enabled,
            echoCancellation: true,
            autoGainControl: true
          });
        } catch {}
      });
    }
    this.broadcastStatus();
  }

  /**
   * الاستحواذ العتادي على المايك مع تطبيق إلغاء الصدى (AEC) وبوابة الضوضاء (Noise Gate)
   */
  private async acquireAndPublishStream(): Promise<boolean> {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('getUserMedia is not supported on this platform');
      }

      // إعدادات العتاد الصارمة لمنع الصدى والتغذية العكسية
      const audioConstraints: MediaTrackConstraints = {
        echoCancellation: { ideal: true },
        noiseSuppression: { ideal: this.isNoiseSuppressionEnabled },
        autoGainControl: { ideal: true },
        channelCount: { ideal: 1 },
        sampleRate: { ideal: 48000 }
      };

      // 1. طلب الوصول للاقط الميكروفون
      this.rawMediaStream = await navigator.mediaDevices.getUserMedia({
        audio: audioConstraints,
        video: false
      });

      // 2. ربط معالج بوابة الضوضاء الرقمي (AudioNoiseSuppressionProcessor)
      if (this.noiseProcessor) {
        this.noiseProcessor.destroy();
      }

      this.noiseProcessor = new AudioNoiseSuppressionProcessor(
        this.rawMediaStream,
        this.isNoiseSuppressionEnabled,
        {
          gateThreshold: 0.012,
          speechHoldMs: 120,
          speechReleaseMs: 35,
          onGateStateChange: (isOpen, level) => {
            const isSpeaking = isOpen && level > 5;
            this.emit('speakingState', {
              isSpeaking,
              audioLevel: level
            });
            if (this.seatId) {
              try {
                PresenceLifecycleService.getInstance().sendSpeakingState(this.seatId, isSpeaking, level);
              } catch {}
            }
          }
        }
      );

      const processedStream = this.noiseProcessor.getProcessedStream();

      // 3. البث إلى المحرك الصوتي LiveKit Cloud WebRTC
      try {
        const livekitEngine = LiveKitAudioEngine.getInstance();
        if (livekitEngine.status === 'connected') {
          await livekitEngine.publishMicrophone(processedStream);
        }
      } catch (lkErr) {
        console.warn('[MicLogicController] LiveKit publish notice:', lkErr);
      }

      // 4. البث إلى المحرك الصوتي ZEGOCLOUD إن وجد
      const audioEngine = AudioEngineService.getInstance();
      const zg = audioEngine.getZegoInstance();

      if (zg && this.roomId && this.userId) {
        const cleanRoom = this.roomId.replace(/[^a-zA-Z0-9_-]/g, '');
        const cleanUser = this.userId.replace(/[^a-zA-Z0-9_-]/g, '');
        this.localPublishStreamId = `s_${cleanRoom}_${cleanUser}`;

        try {
          await zg.startPublishingStream(this.localPublishStreamId, processedStream);
          this.isPublishingToZego = true;
          zg.mutePublishStreamAudio(processedStream, false);
        } catch (publishErr) {
          console.warn('[MicLogicController] Zego stream publish notice:', publishErr);
        }
      }

      this.isHardwareMuted = false;
      return true;
    } catch (err: any) {
      console.warn('[MicLogicController] Hardware microphone capture notice:', err?.name || err?.message || err);
      this.isHardwareMuted = true;
      this.releaseHardwareMicrophone();
      this.emit('permissionError', err instanceof Error ? err : new Error(String(err)));
      return false;
    }
  }

  /**
   * تحرير وإغلاق لاقط الميكروفون على مستوى العتاد تماماً (Hardware Release)
   */
  public releaseHardwareMicrophone(): void {
    // 1. إيقاف البث عبر محرك الصوت LiveKit و Zego
    try {
      LiveKitAudioEngine.getInstance().unpublishMicrophone().catch(() => {});
    } catch {}

    const audioEngine = AudioEngineService.getInstance();
    const zg = audioEngine.getZegoInstance();

    if (zg && this.localPublishStreamId && this.isPublishingToZego) {
      try {
        if (audioEngine.status === 'connected') {
          zg.stopPublishingStream(this.localPublishStreamId);
        }
      } catch (stopErr) {
        console.warn('[MicLogicController] stopPublishingStream notice:', stopErr);
      }
      this.isPublishingToZego = false;
    }

    // 2. تدمير معالج بوابة الضوضاء
    if (this.noiseProcessor) {
      try {
        this.noiseProcessor.destroy();
      } catch {}
      this.noiseProcessor = null;
    }

    // 3. إيقاف جميع التراكات العتادية للمايك (يغلق المستشعر فوراً في نظام الجوال)
    if (this.rawMediaStream) {
      try {
        this.rawMediaStream.getTracks().forEach((track) => {
          track.enabled = false;
          track.stop();
        });
      } catch {}
      this.rawMediaStream = null;
    }

    this.isHardwareMuted = true;
  }

  private broadcastStatus(): void {
    this.emit('micStatusChanged', {
      isOnMic: this.isOnMic,
      seatId: this.seatId,
      isHardwareMuted: this.isHardwareMuted,
      isGateOpen: this.noiseProcessor ? this.noiseProcessor.isGateOpen() : false,
      audioLevel: this.noiseProcessor ? this.noiseProcessor.getCurrentVolumeLevel() : 0,
      noiseSuppressionEnabled: this.isNoiseSuppressionEnabled
    });
  }

  /**
   * تدمير وفصل متحكم المايكات بالكامل
   */
  public destroy(): void {
    this.releaseHardwareMicrophone();
    this.isOnMic = false;
    this.seatId = null;
    this.listeners.clear();
  }
}
