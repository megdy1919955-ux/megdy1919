import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MicSeat,
  ChatMessage,
  RoomHeader,
  RoomMicsGrid,
  RoomChatSection,
  RoomGiftStreamColumn,
  RoomChatMessageContextMenu,
  RoomChatTranslationToast,
  RoomBottomBar,
  RoomVipBroadcastBanner,
  VipAnnouncementItem
} from './room';
import { getCurrentAuthUser } from '../lib/authService';
import { initSilentEmojiSignalEngine } from '../lib/emojiService';
import { lazyWithRetry } from '../lib/lazyWithRetry';
import { roomComponentApi } from '../lib/roomComponentApi';
import { processGiftSupportEvent } from '../lib/levelService';
import { AudioEngineService } from '../audio/audioEngineService';
import { MicLogicController } from '../audio/micLogicController';
import { PresenceLifecycleService, RoomPresencePeer } from '../audio/presenceLifecycleService';

// ============================================================================
// التحميل الكسول المستقل عند الطلب فقط (Lazy On-Demand Components)
// لا يتم تحميل كود أي نافذة أو مكون فرعي إلى الذاكرة إلا عند ضغط المستخدم فعلياً
// ============================================================================
const AdvancedUserProfileModal = lazyWithRetry(
  () => import('./AdvancedUserProfileModal').then((m) => ({ default: m.AdvancedUserProfileModal })),
  'AdvancedUserProfileModal'
);

const TopOptionsMenuModal = lazyWithRetry(
  () => import('./TopOptionsMenuModal').then((m) => ({ default: m.TopOptionsMenuModal })),
  'TopOptionsMenuModal'
);

const RoomAudienceModal = lazyWithRetry(
  () => import('./room/RoomAudienceModal').then((m) => ({ default: m.RoomAudienceModal })),
  'RoomAudienceModal'
);

const RoomEmojiPickerModal = lazyWithRetry(
  () => import('./room/RoomEmojiPickerModal').then((m) => ({ default: m.RoomEmojiPickerModal })),
  'RoomEmojiPickerModal'
);

const RoomGiftBoxModal = lazyWithRetry(
  () => import('./room/RoomGiftBoxModal').then((m) => ({ default: m.RoomGiftBoxModal })),
  'RoomGiftBoxModal'
);

const RoomInfoModal = lazyWithRetry(
  () => import('./RoomInfoModal').then((m) => ({ default: m.RoomInfoModal })),
  'RoomInfoModal'
);

const RoomExitSection = lazyWithRetry(
  () => import('./room/modals/RoomExitSection').then((m) => ({ default: m.RoomExitSection })),
  'RoomExitSection'
);

const RoomChatInputModal = lazyWithRetry(
  () => import('./room/RoomChatInputModal').then((m) => ({ default: m.RoomChatInputModal })),
  'RoomChatInputModal'
);

const RoomChatReportModal = lazyWithRetry(
  () => import('./room/RoomChatReportModal').then((m) => ({ default: m.RoomChatReportModal })),
  'RoomChatReportModal'
);

export type { MicSeat, ChatMessage };

export interface VoiceRoomScreenProps {
  roomTitle?: string;
  roomAvatar?: string;
  hostName?: string;
  roomId?: string;
  isOwner?: boolean;
  currentUserId?: string;
  currentUserName?: string;
  currentUserAvatar?: string;
  currentUserVip?: string | number;
  onClose: () => void;
  onMinimize?: () => void;
  onOpenRecharge?: () => void;
  onNavigateToRoom?: (roomName: string) => void;
}

/**
 * الغرفة الصوتية (VoiceRoomScreen)
 * تجمع المكونات الأربعة المنفصلة تماماً (الهيدر، شبكة المقاعد، قسم الدردشة، وشريط الأيقونات السفلي)
 * دون أي تداخل في الكود أو الأوامر.
 */
export const VoiceRoomScreen: React.FC<VoiceRoomScreenProps> = ({
  roomTitle,
  roomAvatar,
  hostName,
  roomId = 'room-1001001',
  isOwner = true,
  currentUserId,
  currentUserName,
  currentUserAvatar,
  currentUserVip,
  onClose,
  onMinimize,
  onOpenRecharge,
  onNavigateToRoom
}) => {
  const authUser = getCurrentAuthUser();
  const myUserId = currentUserId || authUser?.id || '1001001';
  const myUserName = currentUserName || authUser?.name || 'أبو أمجد';
  const myUserAvatar = currentUserAvatar || authUser?.avatar || 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=400';
  const [myUserCoins, setMyUserCoins] = useState<number>(() => {
    return authUser?.coins ?? 100000000;
  });

  useEffect(() => {
    const handleCoinsChange = () => {
      const freshUser = getCurrentAuthUser();
      if (freshUser && typeof freshUser.coins === 'number') {
        setMyUserCoins(freshUser.coins);
      }
    };
    window.addEventListener('support_event_processed', handleCoinsChange);
    window.addEventListener('user_coins_updated', handleCoinsChange);
    window.addEventListener('user_profile_updated', handleCoinsChange);
    window.addEventListener('storage', handleCoinsChange);
    return () => {
      window.removeEventListener('support_event_processed', handleCoinsChange);
      window.removeEventListener('user_coins_updated', handleCoinsChange);
      window.removeEventListener('user_profile_updated', handleCoinsChange);
      window.removeEventListener('storage', handleCoinsChange);
    };
  }, []);

  // 1. حالة العنوان والغرفة (مبنية على بيانات المالك الواقعية مع دعم التعديل الحر لاسم الروم وصورته)
  const [currentRoomTitle, setCurrentRoomTitle] = useState(() => {
    try {
      const savedConfig = localStorage.getItem(`najm_my_room_cfg_${myUserId}`);
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig);
        if (parsed?.title && (isOwner || roomId.includes(myUserId))) return parsed.title;
      }
      const savedRoomTitle = localStorage.getItem(`super_legend_room_title_${roomId}`);
      if (savedRoomTitle) return savedRoomTitle;
    } catch {}
    return roomTitle || `روم ${myUserName} 🎙️👑`;
  });

  const [currentRoomAvatar, setCurrentRoomAvatar] = useState(() => {
    try {
      const savedConfig = localStorage.getItem(`najm_my_room_cfg_${myUserId}`);
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig);
        if (parsed?.image && (isOwner || roomId.includes(myUserId))) return parsed.image;
      }
      const savedRoomAvatar = localStorage.getItem(`super_legend_room_avatar_${roomId}`);
      if (savedRoomAvatar) return savedRoomAvatar;
    } catch {}
    return roomAvatar || myUserAvatar;
  });

  const resolvedHostName = hostName || myUserName;
  const [isRoomLocked, setIsRoomLocked] = useState(false);

  // 2. حالة المقاعد (20 مقعد، المايك الأول 1 للمالك فقط إذا كان المستخدم هو المالك، وإلا فارغ تماماً كمستمع بدون أي حساب وهمي)
  const [activeMicCount, setActiveMicCount] = useState<number>(20);
  const [micSeats, setMicSeats] = useState<MicSeat[]>(() => {
    const seats: MicSeat[] = [];
    for (let i = 1; i <= 20; i++) {
      if (i === 1 && isOwner) {
        seats.push({
          id: 1,
          userId: myUserId,
          userName: myUserName,
          avatar: myUserAvatar,
          isHost: true,
          isOwner: true,
          isMuted: true,
          isSpeaking: false,
          isEmpty: false
        });
      } else {
        seats.push({
          id: i,
          userName: '',
          isEmpty: true,
          isMuted: false,
          isSpeaking: false,
          isLocked: false
        });
      }
    }
    return seats;
  });

  // 3. حالة رسائل الدردشة (واقعية وديناميكية وفق رتبة المستخدم الحقيقية)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => [
    {
      id: `sys-welcome-${Date.now()}`,
      userName: 'نظام الروم',
      text: isOwner
        ? `انضم المالك 👑 ${myUserName} إلى الغرفة`
        : `انضم ${myUserName} إلى قائمة المستمعين 🎙️`,
      userColor: isOwner ? '#F59E0B' : '#38BDF8',
      isSystem: true
    }
  ]);

  // 4. حالة شريط التحكم السفلي والمايك (منفصلة تماماً، كتم افتراضي آمن لتجنب فرض إذن المايك بدون تفاعل)
  const [isMyMicMuted, setIsMyMicMuted] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGiftBox, setShowGiftBox] = useState(false);
  const [seatReactions, setSeatReactions] = useState<Record<number, {
    id: string;
    emoji: string;
    name: string;
    iconUrl?: string;
  }>>({});
  const [showChatInput, setShowChatInput] = useState(false);
  const [chatInputText, setChatInputText] = useState('');
  const [isVipBroadcastActive, setIsVipBroadcastActive] = useState(false);
  const [currentVipAnnouncement, setCurrentVipAnnouncement] = useState<VipAnnouncementItem | null>(null);
  const [replyingToMessage, setReplyingToMessage] = useState<{ id: string; userName: string; text: string; avatar?: string } | null>(null);

  // 5. حالة عمود الهدايا المنفصل على الشمال (20% - يبدأ فارغاً بدون هدايا وهمية)
  const [giftStreamEvents, setGiftStreamEvents] = useState<Array<{
    id: string;
    senderName: string;
    senderAvatar?: string;
    giftName: string;
    giftIcon: string;
    comboCount: number;
    giftValue?: number;
  }>>([]);

  // 6. حالة قائمة الخيارات الثلاثة (نسخ، تبليغ، ترجمة) للضغط المطول
  const [contextMenuMessage, setContextMenuMessage] = useState<ChatMessage | null>(null);
  const [contextMenuAnchor, setContextMenuAnchor] = useState<{ x: number; y: number } | null>(null);

  // حالة مربع الترجمة العائم بأعلى وسط الشاشة
  const [translationData, setTranslationData] = useState<{
    originalText: string;
    translatedText: string;
    senderName: string;
  } | null>(null);

  // حالة نافذة الإبلاغ المنفصلة
  const [reportingMessage, setReportingMessage] = useState<ChatMessage | null>(null);

  // حالة نافذة المشرفين المنفصلة (تفتح عند الضغط على اسم الغرفة بالأعلى)
  const [showModeratorsModal, setShowModeratorsModal] = useState(false);

  // حالة الكرت التعريفي المنبثق للمستخدم (منفصل تماماً ودون ربطه بأي شيء)
  const [selectedUserForProfile, setSelectedUserForProfile] = useState<any | null>(null);

  // حالة قائمة الخيارات العليا (الثلاث نقاط) المنفصلة
  const [showTopOptionsMenu, setShowTopOptionsMenu] = useState(false);

  // حالة قائمة الحضور المنفصلة
  const [showAudienceModal, setShowAudienceModal] = useState(false);
  const [remoteAttendees, setRemoteAttendees] = useState<RoomPresencePeer[]>([]);

  // هل المستخدم الحالي متواجد على المايك كـ Publisher؟
  const isUserOnMic = useMemo(() => {
    return micSeats.some((s) => s.userId === myUserId && !s.isEmpty);
  }, [micSeats, myUserId]);

  // قائمة الحضور الحقيقية في الغرفة (حساب حقيقي دقيق 100% بدون أي تزييف أو وهمية)
  const realAttendees = useMemo(() => {
    const list: Array<{
      id: string;
      name: string;
      avatar: string;
      role: 'owner' | 'moderator' | 'vip' | 'listener';
      seatId?: number;
      isMuted?: boolean;
      level?: number;
      vipLevel?: number;
      friendlyPoints?: number;
      country?: string;
    }> = [];

    // 1. المتواجدون على المايكات
    micSeats.forEach((seat) => {
      if (!seat.isEmpty && seat.userName && seat.userName !== String(seat.id)) {
        list.push({
          id: seat.userId || `user-${seat.id}`,
          name: seat.userName,
          avatar: seat.avatar || (seat.id === 1 ? myUserAvatar : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'),
          role: seat.isHost || seat.id === 1 ? 'owner' : 'listener',
          seatId: seat.id,
          isMuted: seat.isMuted,
          level: seat.id === 1 ? 88 : 53,
          vipLevel: seat.id === 1 ? 8 : 6,
          friendlyPoints: seat.id === 1 ? 8888 : 2963,
          country: 'اليمن 🇾🇪'
        });
      }
    });

    // 2. إذا كان المستخدم الحالي غير متواجد على المايك وهو في الغرفة كمستمع
    const isCurrentUserOnMic = list.some((u) => u.id === myUserId);
    if (!isCurrentUserOnMic && myUserId) {
      list.push({
        id: myUserId,
        name: myUserName,
        avatar: myUserAvatar,
        role: isOwner ? 'owner' : 'listener',
        seatId: undefined,
        isMuted: false,
        level: 88,
        vipLevel: 8,
        friendlyPoints: 8888,
        country: 'اليمن 🇾🇪'
      });
    }

    // 3. المستمعون الحقيقيون من خادم الحضور الفعلي
    remoteAttendees.forEach((p) => {
      if (!list.some((u) => u.id === p.peerId)) {
        list.push({
          id: p.peerId,
          name: p.userName || 'مستمع',
          avatar: p.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
          role: 'listener',
          seatId: p.seatId ?? undefined,
          isMuted: p.isMuted,
          level: 30,
          vipLevel: 3,
          friendlyPoints: 1200,
          country: 'اليمن 🇾🇪'
        });
      }
    });

    return list;
  }, [micSeats, myUserId, myUserName, myUserAvatar, isOwner, remoteAttendees]);

  // 7. حالة النوافذ والإشعارات
  const [showExitModal, setShowExitModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // 🎙️ دورة حياة محرك الصوت الحقيقي والحضور (Modular Audio & Presence System)
  // تسلسل التحميل الكسول المنفصل بالترتيب الصارم:
  // (إطار الواجهة -> محرك الاستماع الصوتي Media Audio -> إشارات المايكات عند الطلب -> دورة الحضور والتنظيف)
  useEffect(() => {
    let isMounted = true;
    const audioEngine = AudioEngineService.getInstance();
    const micController = MicLogicController.getInstance();
    const presenceService = PresenceLifecycleService.getInstance();

    // 1. تهيئة وضع الاستماع (Subscriber Mode) فقط بمخرج وسائط Media Audio
    audioEngine.initializeSubscriber({
      roomId,
      userId: myUserId,
      userName: myUserName
    });

    // 2. إشارة الحضور الخفيفة مع تسجيل الروم الحقيقي وبياناته في السيرفر
    presenceService.enterRoom(roomId, {
      userId: myUserId,
      userName: myUserName,
      userAvatar: myUserAvatar,
      seatId: isOwner ? 1 : null,
      vipLevel: currentUserVip,
      roomTitle: currentRoomTitle,
      roomAvatar: currentRoomAvatar,
      hostName: myUserName,
      isOwner: isOwner,
      countryName: 'اليمن',
      countryCode: 'YE',
      flag: '🇾🇪'
    });

    // 3. وضع المستمع / الناشر:
    if (isOwner) {
      // المالك يحجز المقعد الأول لكن يبدأ في وضع الكتم لتجنب طلب إذن المايك بدون تفاعل مستخدم (User Gesture)
      micController.takeMicSeat(1, false).then(() => {
        if (isMounted) {
          setIsMyMicMuted(true);
        }
      });
    } else {
      // المستمع: وضع الاستقبال فقط دون فتح لاقط المايك
      micController.enterAsListener();
      setIsMyMicMuted(true);
    }

    // 4. ربط أحداث المايكات عبر StreamTriggers
    const unsubMicStatus = micController.on('micStatusChanged', (status) => {
      if (!isMounted) return;
      setIsMyMicMuted(status.isHardwareMuted);
      if (status.seatId) {
        setMicSeats((prev) =>
          prev.map((s) => (s.id === status.seatId ? { ...s, isMuted: status.isHardwareMuted } : s))
        );
      }
    });

    const unsubMicErr = micController.on('permissionError', () => {
      if (!isMounted) return;
      showToast('يرجى السماح بإذن المايك للتحدث في الغرفة 🎙️');
    });

    const unsubSpeaking = micController.on('speakingState', (spk) => {
      if (!isMounted) return;
      const mySeat = micController.seatId;
      if (mySeat) {
        setMicSeats((prev) =>
          prev.map((s) => (s.id === mySeat ? { ...s, isSpeaking: spk.isSpeaking } : s))
        );
      }
    });

    const unsubPeerSpeaking = audioEngine.on('peerSpeaking', (peerSpk) => {
      if (!isMounted) return;
      setMicSeats((prev) =>
        prev.map((s) => {
          if (s.userId === peerSpk.peerId) {
            return { ...s, isSpeaking: peerSpk.isSpeaking };
          }
          return s;
        })
      );
    });

    // مزامنة حالة التحدث المباشرة عبر WebSocket اللحظي لجميع الأجهزة
    const unsubPresenceSpeaking = presenceService.on('peerSpeakingState', (peerSpk) => {
      if (!isMounted) return;
      setMicSeats((prev) =>
        prev.map((s) => {
          if (s.userId === peerSpk.peerId || (peerSpk.seatId && s.id === peerSpk.seatId)) {
            return { ...s, isSpeaking: peerSpk.isSpeaking };
          }
          return s;
        })
      );
    });

    const unsubUserEntered = presenceService.on('userEntered', (u) => {
      if (!isMounted) return;
      if (u.userId !== myUserId) {
        setChatMessages((prev) => [
          ...prev,
          {
            id: `sys-entered-${Date.now()}-${u.userId}`,
            userName: 'نظام الروم',
            text: `انضم ${u.userName} إلى قائمة المستمعين 🎙️`,
            userColor: '#38BDF8',
            isSystem: true
          }
        ]);
      }
    });

    const unsubAttendees = presenceService.on('attendeesUpdated', (list) => {
      if (!isMounted) return;
      setRemoteAttendees(list);

      // مزامنة حالة المقاعد فورياً من قائمة الحضور الحالية عند الدخول أو التحديث الشامل
      setMicSeats((prev) =>
        prev.map((s) => {
          // إذا كان مقعد المالك وهو المستخدم الحالي نحافظ على حالته
          if (s.userId === myUserId) return s;
          const peerOnSeat = list.find((p) => p.seatId === s.id);
          if (peerOnSeat) {
            return {
              ...s,
              userId: peerOnSeat.peerId,
              userName: peerOnSeat.userName,
              avatar: peerOnSeat.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
              isEmpty: false,
              isMuted: peerOnSeat.isMuted,
              isSpeaking: peerOnSeat.isSpeaking
            };
          } else {
            // المقعد فارغ
            return s.userId && s.userId !== myUserId
              ? { ...s, userId: undefined, userName: '', avatar: undefined, isEmpty: true, isSpeaking: false, isMuted: false }
              : s;
          }
        })
      );
    });

    // مزامنة فورية فائقة السرعة عند صعود أي مستخدم على المايك أو نزوله
    const unsubSeatUpdated = presenceService.on('peerSeatUpdated', (p) => {
      if (!isMounted) return;
      setMicSeats((prev) => {
        // إذا كان النزول من المايك
        if (!p.seatId) {
          return prev.map((s) =>
            s.userId === p.peerId
              ? { ...s, userId: undefined, userName: '', avatar: undefined, isEmpty: true, isSpeaking: false, isMuted: false }
              : s
          );
        }
        // صعود على مقعد محدد
        return prev.map((s) => {
          // تفريغ أي مقعد قديم كان يشغله نفس المستخدم
          if (s.userId === p.peerId && s.id !== p.seatId) {
            return { ...s, userId: undefined, userName: '', avatar: undefined, isEmpty: true, isSpeaking: false, isMuted: false };
          }
          if (s.id === p.seatId) {
            return {
              ...s,
              userId: p.peerId,
              userName: p.userName || 'مستخدم',
              avatar: p.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
              isEmpty: false,
              isMuted: p.isMuted ?? false,
              isSpeaking: false
            };
          }
          return s;
        });
      });
    });

    const unsubUserLeft = presenceService.on('userLeft', (u) => {
      if (!isMounted) return;
      setMicSeats((prev) =>
        prev.map((s) =>
          s.userId === u.peerId || (u.seatId && s.id === u.seatId)
            ? { ...s, userId: undefined, userName: '', avatar: undefined, isEmpty: true, isSpeaking: false, isMuted: false }
            : s
        )
      );
    });

    return () => {
      isMounted = false;
      unsubMicStatus();
      unsubMicErr();
      unsubSpeaking();
      unsubPeerSpeaking();
      unsubPresenceSpeaking();
      unsubUserEntered();
      unsubAttendees();
      unsubSeatUpdated();
      unsubUserLeft();
      // دالة الفصل الحقيقية والتحرير التام للمايك ومسح جلسة السيرفر
      presenceService.disconnectAndCleanup();
    };
  }, [roomId, myUserId, myUserName, myUserAvatar, isOwner]);

  // 🛰️ تشغيل مستمع الإشارة الصامتة في الخلفية (Zero-battery & Zero-data impact)
  useEffect(() => {
    const unsubscribeSilent = initSilentEmojiSignalEngine();
    return () => {
      unsubscribeSilent();
    };
  }, []);

  // معالج النقر على المقعد: إذا كان المقعد مشغولاً يفتح الكرت التعريفي أو يبدل الكتم للمستخدم
  const handleSeatClick = async (seatId: number) => {
    const seat = micSeats.find((s) => s.id === seatId);
    const micController = MicLogicController.getInstance();

    if (seat && !seat.isEmpty && seat.userName && seat.userName !== String(seat.id)) {
      if (seat.userId === myUserId) {
        // ضغط المستخدم على مقعده الخاص -> كتم أو تشغيل عتادي
        const targetMute = !isMyMicMuted;
        const ok = await micController.setHardwareMute(targetMute);
        if (ok) {
          setIsMyMicMuted(targetMute);
          setMicSeats((prev) =>
            prev.map((s) => (s.id === seatId ? { ...s, isMuted: targetMute } : s))
          );
          showToast(!targetMute ? '🎙️ تم تشغيل المايك' : '🔇 تم كتم المايك عتادياً');
        }
        return;
      }

      roomComponentApi.profile.openProfile({
        id: seat.userId || (seat.id === 1 ? myUserId : `user-${seat.id}`),
        name: seat.userName,
        avatar: seat.avatar || (seat.id === 1 ? myUserAvatar : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'),
        userId: seat.userId || (seat.id === 1 ? myUserId : `9944${seat.id}21`),
        country: 'اليمن 🇾🇪',
        isHost: seat.isHost || seat.id === 1,
        seatId: seat.id,
        level: seat.id === 1 ? 88 : 53,
        vipLevel: seat.id === 1 ? 8 : 6,
        friendlyPoints: seat.id === 1 ? 8888 : 2963,
        isMuted: seat.isMuted
      });
    } else {
      // الصعود للمايك وتفعيل الصوت الحقيقي فوراً (Publisher Mode - User Gesture)
      const ok = await micController.takeMicSeat(seatId, true);
      if (ok) {
        setIsMyMicMuted(false);
        setMicSeats((prev) =>
          prev.map((s) => {
            if (s.userId === myUserId) {
              return { ...s, userId: undefined, userName: '', avatar: undefined, isEmpty: true, isSpeaking: false, isMuted: false };
            }
            if (s.id === seatId) {
              return {
                ...s,
                userId: myUserId,
                userName: myUserName,
                avatar: myUserAvatar,
                isEmpty: false,
                isMuted: false,
                isSpeaking: false
              };
            }
            return s;
          })
        );
        showToast(`🎙️ صعدت على المقعد [${seatId}] وتفعل المايك`);
      } else {
        showToast(`المقعد رقم [${seatId}] متاح للصعود 🎙️`);
      }
    }
  };

  // إرسال رسالة شات جديدة
  const handleSendChatMessage = () => {
    if (!chatInputText.trim()) return;
    const msgText = chatInputText.trim();
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      userName: myUserName,
      avatar: myUserAvatar,
      text: msgText,
      vipLevel: currentUserVip || 'VIP8',
      isOwner: isOwner,
      replyTo: replyingToMessage
        ? {
            id: replyingToMessage.id,
            userName: replyingToMessage.userName,
            text: replyingToMessage.text
          }
        : undefined
    };
    setChatMessages((prev) => [...prev, newMsg]);

    // إذا كانت إشارة N مفعلة، إطلاق شريط الإعلان الطائر في وسط الشاشة فوراً
    if (isVipBroadcastActive) {
      setCurrentVipAnnouncement({
        id: `vip-ann-${Date.now()}`,
        senderName: myUserName,
        senderAvatar: myUserAvatar,
        text: msgText,
        vipLevel: currentUserVip || 'VIP8',
        level: 99,
        nobleLevel: 'N5',
        createdAt: Date.now()
      });
      showToast('☁️ تم إطلاق إعلان VIP الطائر في وسط الشاشة!');
    }

    setChatInputText('');
    setReplyingToMessage(null);
    setShowChatInput(false);
  };

  // ربط الواجهة البرمجية المستقلة (Room Component Independent API)
  // تتيح لكل مكون استقبال البيانات بشكل منفصل من لوحة التحكم أو التطبيق دون إعادة تحميل الروم
  useEffect(() => {
    // 1. واجهة الهدايا المستقلة
    const unsubGiftsOpen = roomComponentApi.gifts.onOpenStateChange((isOpen) => {
      setShowGiftBox(isOpen);
    });
    const unsubGiftSend = roomComponentApi.gifts.onSendGift(async ({ gift, combo, recipientSeatId }) => {
      const recipientNum = typeof recipientSeatId === 'number' ? recipientSeatId : (recipientSeatId ? parseInt(String(recipientSeatId), 10) : undefined);
      const targetSeat = recipientNum ? micSeats.find((s) => s.id === recipientNum) : undefined;
      const receiverId = targetSeat && !targetSeat.isEmpty ? targetSeat.userId : undefined;
      const receiverName = targetSeat && !targetSeat.isEmpty ? targetSeat.userName : undefined;

      const singlePrice = (gift?.price as number) || 0;
      const totalVal = singlePrice * combo;

      setGiftStreamEvents((prev) => [
        {
          id: `gift-${Date.now()}-${Math.random()}`,
          senderName: myUserName,
          giftName: gift?.name || 'هدية',
          giftIcon: gift?.icon || '🎁',
          comboCount: combo,
          giftValue: totalVal
        },
        ...prev.slice(0, 4)
      ]);
      const targetText = recipientNum ? `لمقعد ${recipientNum}` : 'للجميع';
      showToast(`🎁 أرسلت ${gift?.name || 'هدية'} x${combo} ${targetText}!`);

      try {
        const supportRes = await processGiftSupportEvent({
          senderId: myUserId,
          senderName: myUserName,
          receiverId: receiverId,
          receiverName: receiverName,
          giftId: gift?.id || 'gift_standard',
          giftName: gift?.name || 'هدية',
          giftIcon: gift?.icon,
          giftValue: singlePrice,
          quantity: combo,
          roomId: roomId || 'room_1'
        });

        if (supportRes?.sender?.leveledUp) {
          showToast(`👑 مبارك! ارتقى مستوى الداعم لديك إلى المستوى ${supportRes.sender.newLevel}!`);
        }
        if (supportRes?.receiver?.leveledUp) {
          showToast(`💖 مبارك لـ ${receiverName || 'المستلم'}! ارتقى مستوى الجاذبية إلى المستوى ${supportRes.receiver.newLevel}!`);
        }
      } catch (err) {
        console.warn('[VoiceRoomScreen] Gift support error:', err);
      }
    });

    // 2. واجهة الإيموجي المستقلة
    const unsubEmojiOpen = roomComponentApi.emojis.onOpenStateChange((isOpen) => {
      setShowEmojiPicker(isOpen);
    });
    const unsubEmojiReaction = roomComponentApi.emojis.onSeatReaction((reaction) => {
      setSeatReactions((prev) => ({
        ...prev,
        [reaction.seatId]: {
          id: `${Date.now()}_${Math.random()}`,
          emoji: reaction.emoji,
          name: reaction.name,
          iconUrl: reaction.iconUrl
        }
      }));
      setTimeout(() => {
        setSeatReactions((prev) => {
          const next = { ...prev };
          delete next[reaction.seatId];
          return next;
        });
      }, reaction.durationMs || 2800);
    });

    // 3. واجهة المايكات المستقلة
    const unsubMics = roomComponentApi.mics.onAction((action) => {
      if (action.type === 'mute') {
        setMicSeats((prev) =>
          prev.map((s) => (s.id === action.seatId ? { ...s, isMuted: action.isMuted } : s))
        );
      } else if (action.type === 'lock') {
        setMicSeats((prev) =>
          prev.map((s) => (s.id === action.seatId ? { ...s, isLocked: action.isLocked } : s))
        );
      } else if (action.type === 'occupy') {
        setMicSeats((prev) =>
          prev.map((s) =>
            s.id === action.seatId
              ? {
                  ...s,
                  userId: action.user.id,
                  userName: action.user.name,
                  avatar: action.user.avatar,
                  isEmpty: false
                }
              : s
          )
        );
      } else if (action.type === 'kick') {
        setMicSeats((prev) =>
          prev.map((s) =>
            s.id === action.seatId
              ? {
                  ...s,
                  userId: undefined,
                  userName: '',
                  avatar: undefined,
                  isEmpty: true,
                  isSpeaking: false,
                  isMuted: false
                }
              : s
          )
        );
      } else if (action.type === 'set_count') {
        setActiveMicCount(action.count);
      } else if (action.type === 'toggle_my_mic') {
        setIsMyMicMuted((prev) => {
          const next = !prev;
          showToast(!next ? '🎙️ تم تشغيل المايك' : '🔇 تم كتم المايك');
          return next;
        });
      }
    });

    // 4. واجهة الشات المستقلة
    const unsubChat = roomComponentApi.chat.onAction((action) => {
      if (action.type === 'push_system') {
        setChatMessages((prev) => [
          ...prev,
          {
            id: `msg-${Date.now()}-${Math.random()}`,
            userName: 'نظام الروم',
            text: action.text,
            userColor: action.userColor || '#F59E0B',
            isSystem: true
          }
        ]);
      } else if (action.type === 'push_user') {
        setChatMessages((prev) => [
          ...prev,
          {
            id: `msg-${Date.now()}-${Math.random()}`,
            userName: action.userName,
            text: action.text,
            isVip: action.isVip,
            isOwner: action.isOwner,
            avatar: action.avatar,
            userColor: action.isOwner ? '#F59E0B' : '#60A5FA'
          }
        ]);
      } else if (action.type === 'clear') {
        setChatMessages([]);
      } else if (action.type === 'open_input') {
        if (action.replyTo) setReplyingToMessage(action.replyTo);
        setShowChatInput(true);
      } else if (action.type === 'close_input') {
        setShowChatInput(false);
      } else if (action.type === 'report_message') {
        setReportingMessage(action.message);
      } else if (action.type === 'translate') {
        setTranslationData(action.data);
      }
    });

    // 5. واجهة معلومات وإعدادات الروم المستقلة
    const unsubInfoModal = roomComponentApi.roomInfo.onInfoModalOpenChange((open) => {
      setShowModeratorsModal(open);
    });
    const unsubSettingsMenu = roomComponentApi.roomInfo.onSettingsMenuOpenChange((open) => {
      setShowTopOptionsMenu(open);
    });
    const unsubInfoUpdate = roomComponentApi.roomInfo.onInfoUpdate((payload) => {
      if (payload.title) setCurrentRoomTitle(payload.title);
      if (payload.avatar) setCurrentRoomAvatar(payload.avatar);
      if (payload.isLocked !== undefined) setIsRoomLocked(payload.isLocked);
    });

    // 6. واجهة الحضور المستقلة
    const unsubAudience = roomComponentApi.audience.onOpenStateChange((open) => {
      setShowAudienceModal(open);
    });

    // 7. واجهة كرت البروفايل المستقلة
    const unsubProfile = roomComponentApi.profile.onUserSelect((user) => {
      setSelectedUserForProfile(user);
    });

    // 8. واجهة الخروج المستقلة
    const unsubExit = roomComponentApi.exit.onOpenStateChange((open) => {
      setShowExitModal(open);
    });

    // إتاحة الواجهة على window للتحكم والاختبار المباشر من لوحة التحكم
    if (typeof window !== 'undefined') {
      (window as any).__ROOM_API__ = roomComponentApi;
    }

    return () => {
      unsubGiftsOpen();
      unsubGiftSend();
      unsubEmojiOpen();
      unsubEmojiReaction();
      unsubMics();
      unsubChat();
      unsubInfoModal();
      unsubSettingsMenu();
      unsubInfoUpdate();
      unsubAudience();
      unsubProfile();
      unsubExit();
    };
  }, [myUserName, myUserId]);

  // بدء الرد على رسالة عند السحب لليسار
  const handleSwipeToReply = (targetMsg: ChatMessage) => {
    setReplyingToMessage({
      id: targetMsg.id,
      userName: targetMsg.userName,
      text: targetMsg.text,
      avatar: targetMsg.avatar
    });
    setShowChatInput(true);
    showToast(`↩️ الرد على @${targetMsg.userName}`);
  };

  return (
    <div
      id="voice-room-container"
      className="fixed inset-0 w-full h-full flex flex-col justify-between overflow-hidden select-none bg-gradient-to-b from-[#101322] via-[#0B0D17] to-[#07080E] text-white"
    >
      {/* توست سريع للإشعارات */}
      {toastMessage && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-black/85 backdrop-blur-md border border-amber-400/40 rounded-full text-amber-300 text-xs font-bold shadow-2xl animate-fade-in pointer-events-none">
          {toastMessage}
        </div>
      )}

      {/* المكون الأول: عنوان الروم والهيدر (ثابت بأعلى الروم) */}
      <div className="relative z-20 w-full pt-1 shrink-0">
        <RoomHeader
          roomTitle={currentRoomTitle}
          roomAvatar={currentRoomAvatar}
          hostName={myUserName}
          roomId={roomId}
          isOwner={isOwner}
          isRoomLocked={isRoomLocked}
          listenerCount={realAttendees.length}
          onOpenRoomInfo={() => roomComponentApi.roomInfo.openInfoModal()}
          onOpenHostProfile={() => {
            const hostSeat = micSeats[0];
            roomComponentApi.profile.openProfile({
              id: hostSeat?.userId || myUserId,
              name: hostSeat?.userName || myUserName,
              avatar: hostSeat?.avatar || myUserAvatar,
              userId: hostSeat?.userId || myUserId,
              country: 'اليمن 🇾🇪',
              isHost: true,
              seatId: 1,
              level: 88,
              vipLevel: 8,
              friendlyPoints: 8888,
              isMuted: hostSeat?.isMuted
            });
          }}
          onOpenAudienceList={() => roomComponentApi.audience.open()}
          onOpenSettingsMenu={() => roomComponentApi.roomInfo.openSettingsMenu()}
          onExitRoom={() => roomComponentApi.exit.open()}
        />
      </div>

      {/* المكون الثاني: شبكة المقاعد (مسافة فاضية 1.7 سم برفع 3 ملم للأعلى، وثبات مطلق ومستقل كلياً عن الكيبورد) */}
      <div className="relative z-10 w-full shrink-0 pt-[1.7cm] pb-2">
        <RoomMicsGrid
          allMicSeats={micSeats}
          activeMicCount={activeMicCount}
          onSeatClick={handleSeatClick}
          activeReactions={seatReactions}
        />
      </div>

      {/* المكون الثالث: مساحة الشات المقسمة هندسياً (80% للشات جهة اليمين + 20% لفقاعات الهدايا جهة الشمال) */}
      <div className="relative z-10 flex-1 min-h-0 w-full px-2 py-1 overflow-hidden flex flex-row items-end">
        {/* قسم الشات الرئيسي (80% معزول ومستقل بالكامل) */}
        <div className="w-[80%] h-full flex flex-col justify-end overflow-hidden">
          <RoomChatSection
            chatMessages={chatMessages}
            onOpenChatInput={() => roomComponentApi.chat.openInput()}
            onMessageClick={(msg) => showToast(`هيكل الشات: رسالة من ${msg.userName}`)}
            onMessageLongPress={(msg, anchor) => {
              setContextMenuMessage(msg);
              setContextMenuAnchor(anchor);
            }}
            onReplyToMessage={handleSwipeToReply}
          />
        </div>

        {/* مسار الهدايا المنفصل على الشمال (20% معزول لعرض فقاعات ومكاسب الهدايا المضروبة) */}
        <div className="w-[20%] h-full flex flex-col justify-end overflow-hidden pl-1">
          <RoomGiftStreamColumn
            giftEvents={giftStreamEvents}
            onGiftClick={(gift) => showToast(`🎁 ضرب هدية: ${gift.giftName} x${gift.comboCount}`)}
          />
        </div>
      </div>

      {/* المكون الرابع: الأيقونات والشريط السفلي (ثابت تماماً بأسفل الروم) */}
      <div className="relative z-20 w-full shrink-0">
        <RoomBottomBar
          isMyMicMuted={isMyMicMuted}
          isUserOnMic={isUserOnMic}
          unreadMessagesCount={3}
          onOpenChatInput={() => roomComponentApi.chat.openInput()}
          onToggleMyMic={async () => {
            const micController = MicLogicController.getInstance();
            if (isUserOnMic) {
              const targetMute = !isMyMicMuted;
              const ok = await micController.setHardwareMute(targetMute);
              if (ok) {
                setIsMyMicMuted(targetMute);
                setMicSeats((prev) =>
                  prev.map((s) => (s.userId === myUserId ? { ...s, isMuted: targetMute } : s))
                );
                showToast(!targetMute ? '🎙️ تم تشغيل المايك' : '🔇 تم كتم المايك عتادياً');
              }
            } else {
              const emptySeat = micSeats.find((s) => s.isEmpty);
              if (emptySeat) {
                handleSeatClick(emptySeat.id);
              } else {
                showToast('🎧 أنت في وضع المستمع حالياً، المقاعد ممتلئة');
              }
            }
          }}
          onToggleEmojiPicker={() => roomComponentApi.emojis.open()}
          onOpenGiftDrawer={() => roomComponentApi.gifts.open()}
          onOpenMessagesModal={() => showToast('هيكل الأيقونات: تم النقر على زر الرسائل ✉️')}
          onOpenGamesModal={() => showToast('هيكل الأيقونات: تم النقر على زر الألعاب 🎮')}
          onOpenToolsModal={() => roomComponentApi.roomInfo.openSettingsMenu()}
        />
      </div>

      {/* نافذة إدخال الدردشة السريعة - استدعاء كسول عند الطلب فقط */}
      {showChatInput && (
        <Suspense fallback={null}>
          <RoomChatInputModal
            isOpen={showChatInput}
            onClose={() => {
              setShowChatInput(false);
              setReplyingToMessage(null);
            }}
            inputMessage={chatInputText}
            setInputMessage={setChatInputText}
            canUserType={true}
            isVipBroadcastActive={isVipBroadcastActive}
            onToggleVipBroadcast={() => setIsVipBroadcastActive((prev) => !prev)}
            vipBroadcastRemaining={10}
            onSendMessage={handleSendChatMessage}
            replyingToMessage={replyingToMessage}
            onCancelReply={() => setReplyingToMessage(null)}
          />
        </Suspense>
      )}

      {/* شريط إعلان VIP الطائر في منتصف الشاشة (مكون منفصل 100%) */}
      <RoomVipBroadcastBanner
        currentAnnouncement={currentVipAnnouncement}
        onDismiss={() => setCurrentVipAnnouncement(null)}
      />

      {/* قائمة الخيارات المنبثقة للرسالة (نسخ، تبليغ، ترجمة) للضغط المطول */}
      <RoomChatMessageContextMenu
        isOpen={Boolean(contextMenuMessage)}
        message={contextMenuMessage}
        anchorPosition={contextMenuAnchor}
        onClose={() => {
          setContextMenuMessage(null);
          setContextMenuAnchor(null);
        }}
        onTranslate={(msg) => {
          const original = msg.text.trim();
          let translation = '';
          if (/[\u0600-\u06FF]/.test(original)) {
            if (original.includes('السلام')) translation = 'Peace be upon you';
            else if (original.includes('مرحبا') || original.includes('أهلا')) translation = 'Welcome to the room!';
            else translation = `Translated: "${original}"`;
          } else {
            translation = `الترجمة إلى العربية: "${original}"`;
          }
          setTranslationData({
            originalText: original,
            translatedText: translation,
            senderName: msg.userName
          });
        }}
        onReport={(msg) => {
          setReportingMessage(msg);
        }}
        onToast={showToast}
      />

      {/* مربع الترجمة العائم في أعلى وسط الشاشة (مكون منفصل 100%) */}
      {translationData && (
        <RoomChatTranslationToast
          isOpen={Boolean(translationData)}
          originalText={translationData.originalText}
          translatedText={translationData.translatedText}
          senderName={translationData.senderName}
          onClose={() => setTranslationData(null)}
        />
      )}

      {/* نافذة الإبلاغ المنفصلة (استدعاء كسول عند الطلب فقط) */}
      {reportingMessage && (
        <Suspense fallback={null}>
          <RoomChatReportModal
            isOpen={Boolean(reportingMessage)}
            message={reportingMessage}
            onClose={() => setReportingMessage(null)}
            onSubmitReport={(msg, reason) => {
              showToast(`تم إرسال البلاغ بنجاح: ${reason} 🛡️`);
            }}
          />
        </Suspense>
      )}

      {/* نافذة المشرفين ومعلومات الروم (استدعاء كسول عند الطلب فقط) */}
      {showModeratorsModal && (
        <Suspense fallback={null}>
          <RoomInfoModal
            isOpen={showModeratorsModal}
            onClose={() => setShowModeratorsModal(false)}
            roomTitle={currentRoomTitle}
            roomId={roomId}
            hostAvatar={currentRoomAvatar}
            hostName={hostName}
            isRoomOwner={isOwner}
            userRole={isOwner ? 'owner' : 'guest'}
            onUpdateRoomTitle={(newTitle) => {
              setCurrentRoomTitle(newTitle);
              try {
                localStorage.setItem(`super_legend_room_title_${roomId}`, newTitle);
                localStorage.setItem(`najm_my_room_cfg_${myUserId}`, JSON.stringify({ title: newTitle, image: currentRoomAvatar }));
                window.dispatchEvent(new CustomEvent('my_room_config_updated', { detail: { title: newTitle } }));
              } catch {}
              showToast(`✓ تم تحديث اسم الغرفة إلى "${newTitle}"`);
            }}
            onUpdateRoomAvatar={(newAvatar) => {
              setCurrentRoomAvatar(newAvatar);
              try {
                localStorage.setItem(`super_legend_room_avatar_${roomId}`, newAvatar);
                localStorage.setItem(`najm_my_room_cfg_${myUserId}`, JSON.stringify({ title: currentRoomTitle, image: newAvatar }));
                window.dispatchEvent(new CustomEvent('my_room_config_updated', { detail: { image: newAvatar } }));
              } catch {}
              showToast('✓ تم تحديث صورة الغرفة بنجاح');
            }}
          />
        </Suspense>
      )}

      {/* نافذة خيارات الخروج من الغرفة (استدعاء كسول عند الطلب فقط) */}
      {showExitModal && (
        <Suspense fallback={null}>
          <RoomExitSection
            isOpen={showExitModal}
            onClose={() => setShowExitModal(false)}
            onKeepInBackground={() => {
              setShowExitModal(false);
              if (onMinimize) onMinimize();
              else onClose();
            }}
            onExit={() => {
              setShowExitModal(false);
              PresenceLifecycleService.getInstance().disconnectAndCleanup();
              onClose();
            }}
            onDissolveAll={() => {
              setShowExitModal(false);
              PresenceLifecycleService.getInstance().disconnectAndCleanup();
              onClose();
            }}
            isOwner={isOwner}
            roomTitle={currentRoomTitle}
            hostName={hostName}
            onTriggerToast={showToast}
          />
        </Suspense>
      )}

      {/* الكرت التعريفي للبروفايل (منفصل واستدعاء كسول بالكامل دون ربطه بأي نظام خارجي) */}
      {selectedUserForProfile && (
        <Suspense fallback={null}>
          <AdvancedUserProfileModal
            isOpen={Boolean(selectedUserForProfile)}
            onClose={() => setSelectedUserForProfile(null)}
            user={selectedUserForProfile}
            isRoomOwner={isOwner}
            isCurrentAdmin={isOwner}
          />
        </Suspense>
      )}

      {/* قائمة خيارات الغرفة (الثلاث نقاط) - استدعاء كسول ومنفصل تماماً */}
      {showTopOptionsMenu && (
        <Suspense fallback={null}>
          <TopOptionsMenuModal
            isOpen={showTopOptionsMenu}
            onClose={() => setShowTopOptionsMenu(false)}
            currentUserRole={isOwner ? 'owner' : (MicLogicController.getInstance().isOnMic ? 'host' : 'guest')}
            isOwner={isOwner}
            isRoomLocked={isRoomLocked}
            onToggleLockRoom={() => {
              setIsRoomLocked((prev) => !prev);
              showToast(!isRoomLocked ? '🔒 تم قفل الغرفة' : '🔓 تم فتح قفل الغرفة');
            }}
            onClearChat={() => {
              setChatMessages([]);
              showToast('🧹 تم مسح رسائل الشات');
            }}
            onTriggerToast={showToast}
          />
        </Suspense>
      )}

      {/* قائمة الحضور الحقيقية - استدعاء كسول ومنفصل تماماً */}
      {showAudienceModal && (
        <Suspense fallback={null}>
          <RoomAudienceModal
            isOpen={showAudienceModal}
            onClose={() => setShowAudienceModal(false)}
            attendees={realAttendees}
            isRoomOwner={isOwner}
            isCurrentAdmin={isOwner}
            onSelectUser={(u) => {
              setShowAudienceModal(false);
              roomComponentApi.profile.openProfile({
                id: u.id,
                name: u.name,
                avatar: u.avatar,
                userId: u.id.replace('user-', '') || '77989080',
                country: u.country || 'اليمن 🇾🇪',
                isHost: u.role === 'owner',
                seatId: u.seatId,
                level: u.level || 50,
                vipLevel: u.vipLevel || 6,
                friendlyPoints: u.friendlyPoints || 2963,
                isMuted: u.isMuted
              });
            }}
            onInviteToMic={(u) => {
              showToast(`تم إرسال دعوة للمايك إلى ${u.name} 🎙️`);
            }}
          />
        </Suspense>
      )}

      {/* نافذة الإيموجي المنفصلة كلياً - استدعاء كسول عند النقر فقط */}
      {showEmojiPicker && (
        <Suspense fallback={null}>
          <RoomEmojiPickerModal
            isOpen={showEmojiPicker}
            onClose={() => setShowEmojiPicker(false)}
            onSelectEmoji={(emojiItem) => {
              // تحديد مقعد المستخدم المعرف على المايك لإظهار التفاعل فوق بروفايله مباشرة
              const mySeat = micSeats.find((s) => s.userId === myUserId || (s.isHost && isOwner)) || micSeats[0];
              const targetSeatId = mySeat ? mySeat.id : 1;

              setSeatReactions((prev) => ({
                ...prev,
                [targetSeatId]: {
                  id: `${Date.now()}_${Math.random()}`,
                  emoji: emojiItem.emoji,
                  name: emojiItem.name,
                  iconUrl: emojiItem.iconUrl
                }
              }));

              // اختفاء التفاعل تلقائياً بعد 2.8 ثانية
              setTimeout(() => {
                setSeatReactions((prev) => {
                  const next = { ...prev };
                  delete next[targetSeatId];
                  return next;
                });
              }, 2800);
            }}
          />
        </Suspense>
      )}

      {/* نافذة صندوق الهدايا المنفصلة كلياً - استدعاء وتحميل عند الطلب فقط */}
      {showGiftBox && (
        <Suspense fallback={null}>
          <RoomGiftBoxModal
            isOpen={showGiftBox}
            onClose={() => setShowGiftBox(false)}
            onSendGift={async (gift, comboCount, recipientSeatId) => {
              const targetSeat = recipientSeatId ? micSeats.find((s) => s.id === recipientSeatId) : undefined;
              const receiverId = targetSeat && !targetSeat.isEmpty ? targetSeat.userId : undefined;
              const receiverName = targetSeat && !targetSeat.isEmpty ? targetSeat.userName : undefined;

              const singlePrice = gift.price || 0;
              const totalVal = singlePrice * comboCount;

              // إضافة حدث الهدية لمسار الهدايا الحي على الشمال
              setGiftStreamEvents((prev) => [
                {
                  id: `gift-${Date.now()}-${Math.random()}`,
                  senderName: myUserName,
                  giftName: gift.name,
                  giftIcon: gift.icon,
                  comboCount: comboCount,
                  giftValue: totalVal
                },
                ...prev.slice(0, 4)
              ]);

              const targetText = recipientSeatId ? `لمقعد ${recipientSeatId}` : 'للجميع';
              showToast(`🎁 أرسلت ${gift.name} x${comboCount} ${targetText}!`);

              try {
                const supportRes = await processGiftSupportEvent({
                  senderId: myUserId,
                  senderName: myUserName,
                  receiverId: receiverId,
                  receiverName: receiverName,
                  giftId: gift.id,
                  giftName: gift.name,
                  giftIcon: gift.icon,
                  giftValue: singlePrice,
                  quantity: comboCount,
                  roomId: roomId || 'room_1'
                });

                if (supportRes?.sender?.leveledUp) {
                  showToast(`👑 مبارك! ارتقى مستوى الداعم لديك إلى المستوى ${supportRes.sender.newLevel}!`);
                }
                if (supportRes?.receiver?.leveledUp) {
                  showToast(`💖 مبارك لـ ${receiverName || 'المستلم'}! ارتقى مستوى الجاذبية إلى المستوى ${supportRes.receiver.newLevel}!`);
                }
              } catch (err) {
                console.warn('[VoiceRoomScreen] Gift support error:', err);
              }
            }}
            userCoins={myUserCoins}
            onOpenRecharge={onOpenRecharge}
            micSeats={micSeats}
            currentUserId={myUserId}
          />
        </Suspense>
      )}
    </div>
  );
};

export default VoiceRoomScreen;
