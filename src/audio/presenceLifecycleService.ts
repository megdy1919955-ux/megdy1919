/**
 * PresenceLifecycleService:
 * مسؤولية أحادية وحصرية: إدارة الحضور ودورة الحياة الحقيقية للروم (Presence Lifecycle & Clean-up).
 *  - عند الدخول: إرسال إشارة خفيفة للسيرفر لإدراج المستخدم في قائمة المستمعين وإظهار رسالة الحضور في الشات.
 *  - عند الخروج أو قطع الاتصال (Disconnect Clean-up):
 *     1. قطع الاتصال الصوتي فوراً.
 *     2. تحرير المايك تلقائياً إذا كان المستخدم على المايك (Hardware Mic Release).
 *     3. مسح جلسة المستخدم من السيرفر عبر WebSocket وBeacon REST Endpoint وتنظيف الذاكرة المؤقتة لمنع تعليق الحساب.
 *  - يتواصل عبر إشارات StreamTriggers فقط.
 */

import { AudioEngineService } from './audioEngineService';
import { MicLogicController } from './micLogicController';
import { exitRoomSession } from '../lib/roomSessionService';

export interface PresenceUserInfo {
  userId: string;
  userName: string;
  userAvatar: string;
  seatId?: number | null;
  vipLevel?: string | number;
  level?: number;
  roomTitle?: string;
  roomAvatar?: string;
  hostName?: string;
  isOwner?: boolean;
  countryName?: string;
  countryCode?: string;
  flag?: string;
}

export interface RoomPresencePeer {
  peerId: string;
  userName: string;
  userAvatar: string;
  seatId: number | null;
  isMuted: boolean;
  isSpeaking: boolean;
  joinedAt: number;
}

export type PresenceEventMap = {
  attendeesUpdated: RoomPresencePeer[];
  userEntered: { userName: string; userId: string; isSystemMsg: boolean };
  userLeft: { userName: string; peerId: string; seatId?: number | null };
  peerSeatUpdated: {
    peerId: string;
    seatId: number | null;
    userName?: string;
    userAvatar?: string;
    isMuted?: boolean;
  };
  peerSpeakingState: {
    peerId: string;
    seatId: number | null;
    isSpeaking: boolean;
    audioLevel: number;
  };
  disconnectedClean: { roomId: string; userId: string };
};

export class PresenceLifecycleService {
  private static instance: PresenceLifecycleService | null = null;

  public roomId: string = '';
  public currentUser: PresenceUserInfo | null = null;
  public attendees: Map<string, RoomPresencePeer> = new Map();

  private ws: WebSocket | null = null;
  private isDestroyed: boolean = false;
  private autoCleanRegistered: boolean = false;

  // StreamTriggers
  private listeners: Map<string, Set<(data: any) => void>> = new Map();

  public static getInstance(): PresenceLifecycleService {
    if (!PresenceLifecycleService.instance) {
      PresenceLifecycleService.instance = new PresenceLifecycleService();
    }
    return PresenceLifecycleService.instance;
  }

  constructor() {
    this.registerBrowserLifecycleHandlers();
  }

  public on<K extends keyof PresenceEventMap>(event: K, handler: (data: PresenceEventMap[K]) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler as any);
    return () => {
      this.listeners.get(event)?.delete(handler as any);
    };
  }

  private emit<K extends keyof PresenceEventMap>(event: K, data: PresenceEventMap[K]): void {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.forEach((fn) => {
        try {
          fn(data);
        } catch (e) {
          console.error(`[PresenceLifecycleService] Error in handler for ${event}:`, e);
        }
      });
    }
  }

  /**
   * إشارة الدخول الخفيفة للسيرفر (Lightweight Entry Signal)
   * تسجل الحضور وتطبع رسالة الدخول دون تحميل أي أصول ثقيلة
   */
  public async enterRoom(roomId: string, user: PresenceUserInfo): Promise<void> {
    this.roomId = roomId;
    this.currentUser = user;
    this.isDestroyed = false;

    // 1. ربط سياق الروم بمتحكم المايك ومحرك الصوت
    const audioEngine = AudioEngineService.getInstance();
    const micController = MicLogicController.getInstance();

    micController.initRoomContext(roomId, user.userId);
    micController.enterAsListener(); // افتراضياً مستمع فقط (Zero mic hardware access)

    // 2. إطلاق إشارة WebSocket خفيفة للروم
    this.connectSignalingSocket();
  }

  private connectSignalingSocket(): void {
    if (this.isDestroyed || !this.roomId || !this.currentUser) return;

    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws/audio-room`;
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        if (!this.currentUser || !this.roomId) return;

        // إشارة الدخول الخفيفة مع تسجيل معلومات الروم الحقيقي
        this.sendWsMessage({
          type: 'join_room',
          roomId: this.roomId,
          payload: {
            peerId: this.currentUser.userId,
            userName: this.currentUser.userName,
            userAvatar: this.currentUser.userAvatar,
            seatId: this.currentUser.seatId || null,
            isMuted: true,
            roomTitle: this.currentUser.roomTitle,
            roomAvatar: this.currentUser.roomAvatar,
            hostName: this.currentUser.hostName,
            isOwner: this.currentUser.isOwner,
            ownerId: this.currentUser.isOwner ? this.currentUser.userId : undefined,
            countryName: this.currentUser.countryName || 'اليمن',
            countryCode: this.currentUser.countryCode || 'YE',
            flag: this.currentUser.flag || '🇾🇪'
          }
        });

        this.emit('userEntered', {
          userName: this.currentUser.userName,
          userId: this.currentUser.userId,
          isSystemMsg: true
        });
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleSignalingMessage(data);
        } catch {}
      };

      this.ws.onclose = () => {
        if (!this.isDestroyed) {
          setTimeout(() => this.connectSignalingSocket(), 2500);
        }
      };
    } catch (e) {
      console.warn('[PresenceLifecycleService] WebSocket connection notice:', e);
    }
  }

  private handleSignalingMessage(data: any): void {
    const { type, payload } = data;

    switch (type) {
      case 'room_presence_sync': {
        if (payload?.peers && Array.isArray(payload.peers)) {
          this.attendees.clear();
          payload.peers.forEach((p: any) => {
            this.attendees.set(p.peerId, {
              peerId: p.peerId,
              userName: p.userName || 'مستخدم',
              userAvatar: p.userAvatar || '',
              seatId: p.seatId ?? null,
              isMuted: p.isMuted ?? true,
              isSpeaking: false,
              joinedAt: Date.now()
            });
          });
          this.emit('attendeesUpdated', Array.from(this.attendees.values()));
        }
        break;
      }

      case 'peer_joined': {
        if (payload?.peerId) {
          this.attendees.set(payload.peerId, {
            peerId: payload.peerId,
            userName: payload.userName || 'مستخدم',
            userAvatar: payload.userAvatar || '',
            seatId: payload.seatId ?? null,
            isMuted: payload.isMuted ?? true,
            isSpeaking: false,
            joinedAt: Date.now()
          });
          this.emit('attendeesUpdated', Array.from(this.attendees.values()));
          this.emit('userEntered', {
            userName: payload.userName,
            userId: payload.peerId,
            isSystemMsg: true
          });
        }
        break;
      }

      case 'peer_left': {
        if (payload?.peerId) {
          this.attendees.delete(payload.peerId);
          this.emit('attendeesUpdated', Array.from(this.attendees.values()));
          this.emit('userLeft', {
            userName: payload.userName || '',
            peerId: payload.peerId,
            seatId: payload.seatId
          });
        }
        break;
      }

      case 'peer_seat_updated': {
        if (payload?.peerId) {
          const existing = this.attendees.get(payload.peerId);
          if (existing) {
            existing.seatId = payload.seatId ?? null;
            existing.isMuted = payload.isMuted ?? true;
            if (payload.userName) existing.userName = payload.userName;
            if (payload.userAvatar) existing.userAvatar = payload.userAvatar;
          } else {
            this.attendees.set(payload.peerId, {
              peerId: payload.peerId,
              userName: payload.userName || 'مستخدم',
              userAvatar: payload.userAvatar || '',
              seatId: payload.seatId ?? null,
              isMuted: payload.isMuted ?? true,
              isSpeaking: false,
              joinedAt: Date.now()
            });
          }
          this.emit('attendeesUpdated', Array.from(this.attendees.values()));
          this.emit('peerSeatUpdated', {
            peerId: payload.peerId,
            seatId: payload.seatId ?? null,
            userName: payload.userName || existing?.userName,
            userAvatar: payload.userAvatar || existing?.userAvatar,
            isMuted: payload.isMuted
          });
        }
        break;
      }

      case 'peer_speaking_state': {
        if (payload?.peerId) {
          const peer = this.attendees.get(payload.peerId);
          if (peer) {
            peer.isSpeaking = Boolean(payload.isSpeaking);
          }
          this.emit('peerSpeakingState', {
            peerId: payload.peerId,
            seatId: payload.seatId ?? null,
            isSpeaking: Boolean(payload.isSpeaking),
            audioLevel: payload.audioLevel || 0
          });
        }
        break;
      }

      default:
        break;
    }
  }

  private sendWsMessage(msg: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(msg));
    }
  }

  /**
   * إرسال تحديث المايك والمقعد للسيرفر ليظهر عند جميع الحاضرين
   */
  public sendSeatUpdate(seatId: number | null, isMuted: boolean): void {
    if (this.currentUser) {
      this.currentUser.seatId = seatId;
    }
    this.sendWsMessage({
      type: 'seat_update',
      roomId: this.roomId,
      payload: {
        seatId,
        isMuted,
        userName: this.currentUser?.userName,
        userAvatar: this.currentUser?.userAvatar
      }
    });
  }

  /**
   * إرسال حالة التحدث اللحظية عبر الـ WebSocket لكافة الأجهزة
   */
  public sendSpeakingState(seatId: number | null, isSpeaking: boolean, audioLevel: number = 0): void {
    this.sendWsMessage({
      type: 'speaking_state',
      roomId: this.roomId,
      payload: {
        seatId,
        isSpeaking,
        audioLevel
      }
    });
  }

  /**
   * دالة الفصل الحقيقية والتحرير التام (Disconnect Clean-up):
   * تُستدعى تلقائياً عند إغلاق التطبيق أو الخروج من الروم:
   *  1. قطع الاتصال الصوتي فوراً.
   *  2. تحرير المايك تلقائياً إذا كان المستخدم على المايك (إغلاق عتاد اللاقط).
   *  3. مسح جلسة المستخدم من السيرفر وتنظيف الذاكرة المؤقتة لمنع تعليق الحساب.
   */
  public disconnectAndCleanup(): void {
    if (this.isDestroyed) return;
    this.isDestroyed = true;

    const currentRoomId = this.roomId;
    const currentUserId = this.currentUser?.userId;
    const currentSeatId = this.currentUser?.seatId;

    // 1. تحرير عتاد الميكروفون فوراً وإيقاف أي التقاط نشط
    try {
      const micController = MicLogicController.getInstance();
      micController.releaseHardwareMicrophone();
      micController.destroy();
    } catch (e) {
      console.warn('[PresenceLifecycleService] Mic release warning:', e);
    }

    // 2. قطع الاتصال الصوتي وإغلاق Web Audio Context
    try {
      const audioEngine = AudioEngineService.getInstance();
      audioEngine.destroy();
    } catch (e) {
      console.warn('[PresenceLifecycleService] AudioEngine teardown warning:', e);
    }

    // 3. إرسال إشارة المغادرة عبر WebSocket
    try {
      this.sendWsMessage({
        type: 'leave_room',
        roomId: currentRoomId,
        payload: {
          peerId: currentUserId,
          seatId: currentSeatId
        }
      });
      if (this.ws) {
        this.ws.close();
        this.ws = null;
      }
    } catch {}

    // 4. إرسال إشارة Beacon للسيرفر لحذف الجلسة وتحرير المقعد حتى عند إغلاق التطبيق فجأة
    if (currentRoomId && currentUserId) {
      try {
        const payload = JSON.stringify({
          userId: currentUserId,
          peerId: currentUserId,
          seatId: currentSeatId
        });

        if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
          const blob = new Blob([payload], { type: 'application/json' });
          navigator.sendBeacon(`/api/rooms/${encodeURIComponent(currentRoomId)}/leave`, blob);
        } else {
          fetch(`/api/rooms/${encodeURIComponent(currentRoomId)}/leave`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: payload,
            keepalive: true
          }).catch(() => {});
        }
      } catch (beaconErr) {
        console.warn('[PresenceLifecycleService] Leave beacon notice:', beaconErr);
      }
    }

    // 5. مسح جلسة الروم من التخزين المؤقت المحلي
    try {
      exitRoomSession();
    } catch {}

    this.attendees.clear();
    this.roomId = '';
    this.currentUser = null;

    if (currentRoomId && currentUserId) {
      this.emit('disconnectedClean', { roomId: currentRoomId, userId: currentUserId });
    }
    this.listeners.clear();
  }

  /**
   * ربط مستمعات دورة حياة المتصفح/الجوال للضمان المطلق لعدم تعليق الحساب
   */
  private registerBrowserLifecycleHandlers(): void {
    if (this.autoCleanRegistered || typeof window === 'undefined') return;
    this.autoCleanRegistered = true;

    const cleanupAction = () => {
      if (this.roomId && this.currentUser) {
        this.disconnectAndCleanup();
      }
    };

    window.addEventListener('beforeunload', cleanupAction);
    window.addEventListener('pagehide', cleanupAction);
    window.addEventListener('unload', cleanupAction);
  }
}
