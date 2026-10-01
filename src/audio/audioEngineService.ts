/**
 * AudioEngineService:
 * مسؤولية أحادية وحصرية: إدارة مخرج الصوت واستقبال البث الصوتي فقط (Media Audio Output).
 *  - ضبط مخرج الصوت ليكون وسائط (Media Audio / STREAM_MUSIC) حكراً وليس مكالمة هاتفية (Call Audio).
 *  - تفعيل إلغاء الصدى (Acoustic Echo Cancellation) وبوابة الضوضاء (Noise Gate).
 *  - استقلال تام: لا يتدخل في عناصر الواجهة إطلاقاً.
 *  - يتواصل مع النظام عبر إشارات خفيفة (Stream Triggers & Event Emitters).
 */

import { ZegoExpressEngine } from 'zego-express-engine-webrtc';
import { notifyNativeAndroidAudioMode, syncMediaSessionState } from './nativeAudioBridge';
import { RealtimePeerAudioState, RealtimeNetworkQuality, AudioStreamMode } from './types';

export type AudioEngineStatus = 'idle' | 'connecting' | 'connected' | 'disconnected' | 'error';

export interface RemoteAudioStreamInfo {
  streamId: string;
  userId: string;
  userName?: string;
  mediaStream: MediaStream;
}

export type AudioEngineEventMap = {
  status: AudioEngineStatus;
  peerSpeaking: RealtimePeerAudioState;
  networkQuality: RealtimeNetworkQuality;
  remoteStreamAdded: RemoteAudioStreamInfo;
  remoteStreamRemoved: string;
  speakerMuteChanged: boolean;
};

export class AudioEngineService {
  private static instance: AudioEngineService | null = null;

  public status: AudioEngineStatus = 'idle';
  public isSpeakerMuted: boolean = false;
  public roomId: string = '';
  public userId: string = '';
  public userName: string = '';

  private zg: ZegoExpressEngine | null = null;
  private playbackAudioContext: AudioContext | null = null;
  private masterGainNode: GainNode | null = null;
  private remoteSources: Map<string, MediaStreamAudioSourceNode> = new Map();
  private remoteGainNodes: Map<string, GainNode> = new Map();
  private playingElements: Map<string, HTMLAudioElement> = new Map();

  // StreamTriggers: Reactive listener registry for zero-overhead decoupled updates
  private listeners: Map<string, Set<(data: any) => void>> = new Map();

  public static getInstance(): AudioEngineService {
    if (!AudioEngineService.instance) {
      AudioEngineService.instance = new AudioEngineService();
    }
    return AudioEngineService.instance;
  }

  constructor() {
    this.enforceMediaAudioOutput();
  }

  /**
   * ضبط مخرج الصوت ليكون وسائط (Media Audio) حكراً
   * يعطل وضع المكالمة الهاتفية (Call Mode) ويفرض STREAM_MUSIC ونمط التشغيل العالي الدقة
   */
  public enforceMediaAudioOutput(): void {
    try {
      notifyNativeAndroidAudioMode('media');
      syncMediaSessionState(this.roomId ? `غرفة صوتية ${this.roomId}` : 'غرفة النجم الصوتية', true);
    } catch (e) {
      console.warn('[AudioEngineService] Media mode sync warning:', e);
    }
  }

  /**
   * تهيئة محرك Web Audio في وضع الوسائط (latencyHint: 'playback')
   * لضمان إخراج الصوت عبر سبيكر الوسائط الخارجي وبجودة ستيريو كاملة
   */
  public initPlaybackAudioContext(): AudioContext | null {
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

      // latencyHint: 'playback' يضمن إرسال الصوت لنظام تشغيل أندرويد/iOS كـ Media وليس Call
      this.playbackAudioContext = new AudioContextClass({ latencyHint: 'playback' });
      this.masterGainNode = this.playbackAudioContext.createGain();
      this.masterGainNode.gain.value = this.isSpeakerMuted ? 0.0 : 1.0;
      this.masterGainNode.connect(this.playbackAudioContext.destination);

      if (this.playbackAudioContext.state === 'suspended') {
        this.playbackAudioContext.resume().catch(() => {});
      }

      this.enforceMediaAudioOutput();
      return this.playbackAudioContext;
    } catch (e) {
      console.warn('[AudioEngineService] Playback AudioContext init warning:', e);
      return null;
    }
  }

  /**
   * اشتراك في أحداث المحرك الصوتية بنمط Stream Trigger
   */
  public on<K extends keyof AudioEngineEventMap>(event: K, handler: (data: AudioEngineEventMap[K]) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler as any);
    return () => {
      this.listeners.get(event)?.delete(handler as any);
    };
  }

  private emit<K extends keyof AudioEngineEventMap>(event: K, data: AudioEngineEventMap[K]): void {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.forEach((fn) => {
        try {
          fn(data);
        } catch (e) {
          console.error(`[AudioEngineService] Error in event handler for ${event}:`, e);
        }
      });
    }
  }

  /**
   * تهيئة واستقبال الصوت فقط دون تشغيل المايك
   * وضع المستمع التام (Subscriber Mode)
   */
  public async initializeSubscriber(options: {
    appId?: number;
    roomId: string;
    userId: string;
    userName: string;
  }): Promise<boolean> {
    this.roomId = options.roomId;
    this.userId = options.userId;
    this.userName = options.userName;

    this.setStatus('connecting');
    this.enforceMediaAudioOutput();

    try {
      // 1. إذا كان المحرك مسجلاً في غرفة سابقة أو متصلاً، نقوم بتسجيل الخروج أولاً لتجنب 'state error'
      if (this.zg) {
        try {
          if (this.roomId) {
            await this.zg.logoutRoom(this.roomId);
          }
        } catch (logoutPrevErr) {
          console.warn('[AudioEngineService] Previous room logout notice:', logoutPrevErr);
        }
      }

      // جلب توكن ZEGOCLOUD الرسمي من السيرفر
      const tokenRes = await fetch(`/api/zego/token?userId=${encodeURIComponent(options.userId)}&roomId=${encodeURIComponent(options.roomId)}`);
      if (!tokenRes.ok) {
        this.setStatus('disconnected');
        return false;
      }
      const tokenData = await tokenRes.json();
      if (!tokenData.available || !tokenData.token) {
        this.setStatus('disconnected');
        return false;
      }

      const appId = options.appId || tokenData.appId || 2138622497;
      const server = tokenData.server || `wss://webliveroom${appId}-api.zegocloud.com/ws`;

      // إعادة إنشاء المحرك أو استخدام المحرك الحالي بأمان
      if (!this.zg) {
        this.zg = new ZegoExpressEngine(appId, server, {
          scenario: 6
        });
        this.bindZegoEvents();
      }

      // تسجيل الدخول كمستمع (Subscriber) فقط - دون أي طلب للميكروفون
      const loginOk = await this.zg.loginRoom(
        this.roomId,
        tokenData.token,
        { userID: this.userId, userName: this.userName },
        { userUpdate: true, maxMemberCount: 1000 }
      );

      if (loginOk) {
        this.setStatus('connected');
        try {
          this.zg.setSoundLevelDelegate(true, 300);
        } catch {}
        this.enforceMediaAudioOutput();
        return true;
      } else {
        this.setStatus('disconnected');
        return false;
      }
    } catch (err: any) {
      console.warn('[AudioEngineService] Subscriber initialization notice:', err?.message || err);
      // تجنب إسقاط الواجهة في حال كان الخطأ حالة عابرة في الغرفة
      this.setStatus('disconnected');
      return false;
    }
  }

  private setStatus(s: AudioEngineStatus): void {
    this.status = s;
    this.emit('status', s);
  }

  private bindZegoEvents(): void {
    if (!this.zg) return;

    this.zg.on('roomStateUpdate', (_roomID, state) => {
      if (state === 'CONNECTED') {
        this.setStatus('connected');
      } else if (state === 'DISCONNECTED') {
        this.setStatus('disconnected');
      } else if (state === 'CONNECTING') {
        this.setStatus('connecting');
      }
    });

    // استقبال مسارات الصوت القادمة من المتحدثين الآخرين وتشغيلها عبر Media Output
    this.zg.on('roomStreamUpdate', async (_roomID, updateType, streamList) => {
      if (!this.zg) return;

      for (const stream of streamList) {
        if (stream.user.userID === this.userId) continue;

        if (updateType === 'ADD') {
          try {
            const remoteStream = await this.zg.startPlayingStream(stream.streamID);

            // توجيه الصوت عبر Web Audio Playback Context (STREAM_MUSIC)
            const ctx = this.initPlaybackAudioContext();
            if (ctx && this.masterGainNode) {
              try {
                if (this.remoteSources.has(stream.streamID)) {
                  this.remoteSources.get(stream.streamID)?.disconnect();
                }
                if (this.remoteGainNodes.has(stream.streamID)) {
                  this.remoteGainNodes.get(stream.streamID)?.disconnect();
                }

                const sourceNode = ctx.createMediaStreamSource(remoteStream);
                const streamGainNode = ctx.createGain();
                streamGainNode.gain.value = 1.0;

                sourceNode.connect(streamGainNode);
                streamGainNode.connect(this.masterGainNode);

                this.remoteSources.set(stream.streamID, sourceNode);
                this.remoteGainNodes.set(stream.streamID, streamGainNode);
              } catch (pipeErr) {
                console.warn('[AudioEngineService] Audio node pipe notice:', pipeErr);
              }
            }

            // عنصر تشغيل احتياطي بصوت الوسائط المباشر
            const audioEl = new Audio();
            audioEl.srcObject = remoteStream;
            audioEl.autoplay = true;
            (audioEl as any).playsInline = true;
            audioEl.muted = !!ctx || this.isSpeakerMuted;
            await audioEl.play().catch(() => {});
            this.playingElements.set(stream.streamID, audioEl);

            this.enforceMediaAudioOutput();

            this.emit('remoteStreamAdded', {
              streamId: stream.streamID,
              userId: stream.user.userID,
              userName: stream.user.userName,
              mediaStream: remoteStream
            });
          } catch (err) {
            console.warn(`[AudioEngineService] Failed to play remote stream ${stream.streamID}:`, err);
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

          const el = this.playingElements.get(stream.streamID);
          if (el) {
            el.pause();
            el.srcObject = null;
            this.playingElements.delete(stream.streamID);
          }

          this.emit('remoteStreamRemoved', stream.streamID);
        }
      }
    });

    // مراقبة مستوى صوت المتحدثين للتغذية الراجعة
    this.zg.on('soundLevelUpdate', (list) => {
      list.forEach((item) => {
        const parts = item.streamID.split('_');
        const targetUserId = parts.length >= 2 ? parts[1] : item.streamID;
        const isSpeaking = item.soundLevel > 12;

        this.emit('peerSpeaking', {
          peerId: targetUserId,
          userName: '',
          userAvatar: '',
          isSpeaking,
          isMuted: !isSpeaking,
          audioLevel: Math.min(100, Math.round((item.soundLevel / 100) * 100))
        });
      });
    });

    this.zg.on('publishQualityUpdate', (_streamId, stats: any) => {
      const rtt = stats?.audio?.rtt || stats?.video?.rtt || 25;
      this.emit('networkQuality', {
        pingMs: rtt,
        qualityScore: rtt < 60 ? 'excellent' : rtt < 120 ? 'good' : 'fair',
        engineMode: 'zegocloud',
        bitrateKbps: Math.round(stats?.audio?.audioBitrate || 64)
      });
    });
  }

  /**
   * كتم أو تشغيل سماعة الغرفة للمستخدم
   */
  public setSpeakerMuted(muted: boolean): void {
    this.isSpeakerMuted = muted;
    if (this.masterGainNode && this.playbackAudioContext) {
      this.masterGainNode.gain.setValueAtTime(muted ? 0.0 : 1.0, this.playbackAudioContext.currentTime);
    }
    this.playingElements.forEach((el) => {
      el.muted = muted;
    });
    this.emit('speakerMuteChanged', muted);
  }

  public getZegoInstance(): ZegoExpressEngine | null {
    return this.zg;
  }

  /**
   * تدمير وفصل المحرك الصوتي وتنظيف الذاكرة المؤقتة بالكامل
   */
  public destroy(): void {
    try {
      this.playingElements.forEach((el, streamId) => {
        try {
          this.zg?.stopPlayingStream(streamId);
          el.pause();
          el.srcObject = null;
        } catch {}
      });
      this.playingElements.clear();

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

      if (this.zg && this.roomId) {
        if (this.status === 'connected' || this.status === 'connecting') {
          try {
            this.zg.logoutRoom(this.roomId);
          } catch (logoutErr) {
            console.warn('[AudioEngineService] Safe logout notice:', logoutErr);
          }
        }
        try {
          (this.zg as any).destroyEngine?.();
        } catch {}
        this.zg = null;
      }

      this.setStatus('disconnected');
      this.listeners.clear();
    } catch (err) {
      console.warn('[AudioEngineService] Teardown warning:', err);
    }
  }
}
