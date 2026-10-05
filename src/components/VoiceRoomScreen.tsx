import React, { useState, useEffect, useRef, useMemo, useCallback, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Share2,
  Settings,
  Mic,
  MicOff,
  Gift,
  Gamepad2,
  Smile,
  Send,
  Crown,
  Copy,
  Plus,
  Lock,
  Sparkles,
  Coins,
  Power,
  MoreHorizontal,
  Users,
  Grid,
  Mail,
  MessageSquare,
  Pin,
  Pencil,
  ShieldCheck,
  Star,
  Scroll,
  Trophy,
  BarChart2,
  Flame,
  Radio,
  SlidersHorizontal,
  Check,
  Minus,
  Volume2,
  Globe,
  ExternalLink,
  CornerUpLeft,
  Hand,
  User,
  Clock,
  Swords,
  HelpCircle,
  Maximize2,
  Minimize2,
  Palette,
  Search,
  Clapperboard,
  Film,
  Tv,
  Youtube,
  Lightbulb,
  Play,
  Sun,
  Moon,
  Cloud,
  LogOut
} from 'lucide-react';
import { RedCinemaSeat } from './RedCinemaSeat';
import { CinemaYouTubePickerModal, CinemaVideoItem, VideoSuggestion } from './CinemaYouTubePickerModal';
import { FamilyModal } from './FamilyModal';
import { SuperLegendModal } from './SuperLegendModal';
import { LeaderboardThemeConfig } from '../types/leaderboardTheme';
import { getSavedLeaderboardTheme } from '../lib/leaderboardThemeService';
import { LottieReactionPlayer } from './LottieReactionPlayer';
import { DevConfigModal } from './DevConfigModal';
import { precacheAllLottieAssets, getStoredEmojiConfigs, EmojiLottieConfig } from '../lib/lottieCache';
import { HostProfileModal } from './HostProfileModal';
import { AdvancedUserProfileModal, UserProfileData } from './AdvancedUserProfileModal';
import { UserProfileModal } from './UserProfileModal';
import { SeatActionModal } from './SeatActionModal';
import { MicRequestQueueModal, MicRequestItem } from './MicRequestQueueModal';
import type { GiftItem } from './ProfessionalGiftPanel';
const QuickMicOptionsModal = lazy(() =>
  import('./QuickMicOptionsModal').then((m) => ({ default: m.QuickMicOptionsModal }))
);
const ProfessionalGiftPanel = lazy(() =>
  import('./ProfessionalGiftPanel').then((m) => ({ default: m.ProfessionalGiftPanel }))
);
const MusicPlayerModal = lazy(() =>
  import('./MusicPlayerModal').then((m) => ({ default: m.MusicPlayerModal }))
);
const EffectsAndSoundModal = lazy(() =>
  import('./audio').then((m) => ({ default: m.EffectsAndSoundModal }))
);
const MovableEmojiLottiePicker = lazy(() =>
  import('./MovableEmojiLottiePicker').then((m) => ({ default: m.MovableEmojiLottiePicker }))
);
const ModeratorStatsModal = lazy(() =>
  import('./moderator').then((m) => ({ default: m.ModeratorStatsModal }))
);
import { recordModeratorAction } from '../lib/moderatorStatsService';
import { banUserFromRoom, isUserImmuneFromKick, getModeratorKickPermission } from '../lib/roomKickService';
const DigitalCounterControlModal = lazy(() =>
  import('./counter').then((m) => ({ default: m.DigitalCounterControlModal }))
);
const RoomBackgroundStoreModal = lazy(() =>
  import('./wallpaper').then((m) => ({ default: m.RoomBackgroundStoreModal }))
);
import { NajmRoomMessagesModal, YoHoRoomMessagesModal } from './NajmRoomMessagesModal';
import { NajmRoomToolsAndGamesModal, YoHoRoomToolsAndGamesModal } from './NajmRoomToolsAndGamesModal';
import type { PKSupporter } from './TeamBattleResultModal';
import type { NormalRoundResultData } from './NormalRoundResultModal';
const TeamBattleModal = lazy(() =>
  import('./TeamBattleModal').then((m) => ({ default: m.TeamBattleModal }))
);
const TeamBattleResultModal = lazy(() =>
  import('./TeamBattleResultModal').then((m) => ({ default: m.TeamBattleResultModal }))
);
const NormalRoundResultModal = lazy(() =>
  import('./NormalRoundResultModal').then((m) => ({ default: m.NormalRoundResultModal }))
);
import { DynamicAnchoredGiftOverlay, DynamicFlyingGift } from './DynamicAnchoredGiftOverlay';
import {
  MainRoomCustomizerConfig,
  SpeakingWaveformStyle,
  SeatShapeType
} from '../types/roomCustomizer';
import {
  getMainRoomCustomizerConfig,
  saveMainRoomCustomizerConfig,
  hexToRgba,
  DEFAULT_MAIN_ROOM_CONFIG
} from '../lib/roomCustomizerService';
import {
  subscribeToRoomThemeFromFirestore,
  saveRoomThemeAndWallpaperToFirestore
} from '../lib/roomThemeFirestoreService';
import { wakeLockService } from '../lib/wakeLockService';
import { isVideoResource, isMediaUrl, getCleanGiftEmoji, playGiftAudioEffect } from '../lib/giftCmsService';
import { LuckyChestModal, LuckyChestConfig } from './LuckyChestModal';
import { LuckyChestClaimModal } from './LuckyChestClaimModal';
import { FloatingLuckyChestWidget } from './FloatingLuckyChestWidget';
import { LuckyChestWinnerToast, LuckyChestWinnerNoticeData } from './LuckyChestWinnersTicker';
import { LuckyRefundModal } from './LuckyRefundModal';
import { ElectricRefundEnergySphere, ElectricOrbState } from './ElectricRefundEnergySphere';
import { playElectricChargeZap, playElectricExplosionSound } from '../lib/electricSoundService';
import { SideGiftStream, SideGiftEvent } from './SideGiftStream';
import { ErrorBoundary } from './ErrorBoundary';
import { isFirebaseReady } from '../lib/firebase';
import { sendGiftSignalToServer, sendReceiveSupport, fetchMobileMe } from '../lib/serverRewardsService';
import { processRefundGiftDraw, isRefundGift, RefundDrawResult } from '../lib/refundVaultService';
import { RoomCinemaSection } from './room/RoomCinemaSection';
import { RoomTeamBattleSection } from './room/RoomTeamBattleSection';
import { RoomExitSection } from './room/modals/RoomExitSection';
import { RoomModalManager } from './room/modals/RoomModalManager';
const RoomTopOptionsController = lazy(() =>
  import('./room/RoomTopOptionsController').then((m) => ({ default: m.RoomTopOptionsController }))
);
const RoomInfoModalContainer = lazy(() =>
  import('./room/RoomInfoModalContainer').then((m) => ({ default: m.RoomInfoModalContainer }))
);
import { backNavigation } from '../lib/backNavigation';
import {
  setActiveRoomSession,
  minimizeRoomSession,
  exitRoomSession,
  dissolveRoomSession
} from '../lib/roomSessionService';
import {
  AppRole,
  getActiveAppRole,
  APP_ROLES,
  canAccessBottomControlBar,
  canManageGifts,
  isDeveloper
} from '../lib/roleService';
import {
  UnifiedRealtimeVoiceEngine
} from '../lib/unifiedRealtimeVoiceEngine';
import {
  RealtimeVoiceEngine,
  AudioStreamMode,
  getSavedAudioStreamMode,
  saveAudioStreamMode
} from '../lib/realtimeVoiceService';
import {
  getSavedNoiseSuppressionState,
  saveNoiseSuppressionState
} from '../lib/audioNoiseSuppressionProcessor';
import { RealtimeRoomPresence, RealtimePeerAudioState, RealtimeNetworkQuality } from '../types/realtimeAudio';
import {
  MicSeat,
  SpeakingAuraType,
  BubbleSkinType,
  FloatingEffect,
  BadgeItem,
  ChatMessage,
  RibbonMilestoneTheme,
  formatCounterNumber,
  getRibbonMilestoneTheme,
  HostYoHoBadges,
  RoomChatSection as RoomChatFeed,
  RoomMicsGrid,
  RoomHeader,
  RoomBottomBar,
  RoomEntranceBanner,
  RoomEntranceEvent,
  VipAnnouncementFlyer,
  VipAnnouncementItem,
  VipBroadcastChatInput,
  RoomChatInputModal,
  RoomLeaderboardStatsModal,
  getSavedVipBroadcastQuota,
  saveVipBroadcastQuota,
  getRowLayoutForCount,
  getTeamForSeat,
  getSpeakingAuraStyles,
  getMicRowSpacingClass,
  WallpaperBackgroundCachePill
} from './room';
import {
  getCachedRoomState,
  saveRoomStateToCache,
  preloadWallpaperSilently,
  isWallpaperInCache
} from '../lib/roomCacheService';
import { useRoomProgressiveHydration } from '../hooks/useRoomProgressiveHydration';
import { getCurrentAuthUser, OWNER_DEV_ID } from '../lib/authService';
import { recordGiftSupport, resetRoomStats } from '../services/roomStatsService';
import {
  subscribeToRoomMessages,
  sendRoomChatMessage,
  subscribeToRoomSeats,
  updateRoomSeatInFirestore,
  vacateRoomSeatInFirestore,
  switchRoomSeatInFirestore,
  toggleSeatMuteInFirestore,
  subscribeToRoomCinema,
  updateRoomCinemaInFirestore,
  subscribeToRoomEvents,
  sendRoomEventToFirestore,
  RealtimeSeatData
} from '../lib/roomRealtimeService';
import { FirestoreWebRTCEngine } from '../lib/firestoreWebRTCEngine';

export type { BadgeItem, MicSeat, ChatMessage, RoomEntranceEvent };
export type Seat = MicSeat;

// 1. دالة تحديث حالة المقعد الموحدة (مع الحفاظ الصارم على بيانات المستخدم ومنع مسح الاسم أو الصورة عند الكتم)
export const updateSeatsStateCleanly = (
  prevSeats: Seat[],
  updatedSeat: Partial<Seat> & { id: number }
): Seat[] => {
  // الحماية من تكرار المقاعد تنشط فقط عندما يتم إشغال المقعد بمستخدم جديد بصورة صريحة
  const isTargetOccupyingNew =
    updatedSeat.isEmpty === false &&
    ((Boolean(updatedSeat.userId) && updatedSeat.userId !== '') ||
     (Boolean(updatedSeat.userName) && updatedSeat.userName !== ''));

  return prevSeats.map((seat) => {
    // 1. عند استهداف المقعد المحدد للتحديث: يتم دمج التحديثات مع الحفاظ الصارم على الاسم والصورة والمعرف
    if (seat.id === updatedSeat.id) {
      const preservedUserName =
        (updatedSeat.userName !== undefined && updatedSeat.userName !== '')
          ? updatedSeat.userName
          : seat.userName;

      const preservedAvatar =
        (updatedSeat.avatar !== undefined && updatedSeat.avatar !== '')
          ? updatedSeat.avatar
          : seat.avatar;

      const preservedUserId =
        (updatedSeat.userId !== undefined && updatedSeat.userId !== '')
          ? updatedSeat.userId
          : seat.userId;

      return {
        ...seat,
        ...updatedSeat,
        isEmpty: updatedSeat.isEmpty !== undefined ? updatedSeat.isEmpty : seat.isEmpty,
        userName: preservedUserName,
        avatar: preservedAvatar,
        userId: preservedUserId
      } as Seat;
    }

    // 2. حماية مطلقة لمنع التكرار: إذا كان مقعد آخر يتم إشغاله بمستخدم جديد يحمل نفس userId أو userName
    if (isTargetOccupyingNew) {
      const sameUserId =
        Boolean(updatedSeat.userId && seat.userId && seat.userId.trim() !== '' && seat.userId === updatedSeat.userId);

      const sameUserName =
        Boolean(updatedSeat.userName && seat.userName && seat.userName.trim() !== '' && seat.userName.trim().toLowerCase() === updatedSeat.userName.trim().toLowerCase());

      if (sameUserId || sameUserName) {
        return {
          id: seat.id,
          isEmpty: true,
          userId: undefined,
          userName: '',
          avatar: '',
          isMuted: false,
          isMutedByAdmin: false,
          isSpeaking: false,
        };
      }
    }

    return seat;
  });
};

interface VoiceRoomScreenProps {
  roomTitle?: string;
  roomAvatar?: string;
  hostName?: string;
  roomId?: string;
  ownerId?: string;
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

export const VoiceRoomScreen: React.FC<VoiceRoomScreenProps> = ({
  roomTitle = 'روم صقر اليمن 🦅 - سوالف وتر',
  roomAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
  hostName = 'أميرة الشرق',
  roomId = '7798my-r',
  ownerId: ownerIdProp,
  isOwner: isOwnerProp = false,
  currentUserId,
  currentUserName,
  currentUserAvatar,
  currentUserVip,
  onClose,
  onMinimize,
  onOpenRecharge,
  onNavigateToRoom
}) => {
  // Current Authenticated User Information
  const authUser = getCurrentAuthUser();
  const myUserId = currentUserId || authUser?.id || '88492011';
  const myUserName = currentUserName || authUser?.name || 'مستخدم النجم';
  const myUserAvatar = currentUserAvatar || authUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200';
  const myVipLevel = currentUserVip ? (typeof currentUserVip === 'number' ? `VIP${currentUserVip}` : currentUserVip) : (authUser?.vipTier || 'VIP1');

  // فحص صارم ومباشر لصلاحية المالك:
  // لا تُمنح صلاحيات المالك إلا إذا كان معرف المستخدم الحالي يطابق ownerId الخاص بالغرفة الحالية حصراً
  const isDedicatedMyRoom = roomId === 'my-own-room-7798' || Boolean(roomId && roomId.startsWith('my-own-room'));
  const effectiveRoomOwnerId = ownerIdProp || (isDedicatedMyRoom ? myUserId : undefined);

  const isStrictRoomOwner = Boolean(
    isDedicatedMyRoom ||
    (effectiveRoomOwnerId && effectiveRoomOwnerId === myUserId) ||
    (isOwnerProp === true && (!effectiveRoomOwnerId || effectiveRoomOwnerId === myUserId))
  );

  const isOwnerInitial = isStrictRoomOwner;
  const CURRENT_USER_PROFILE_ID = myUserId;

  // Current active room title state (allows seamless redirection & custom rename by Owner)
  const [currentRoomTitle, setCurrentRoomTitle] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(`super_legend_room_title_${roomId}`);
      if (saved) return saved;
    } catch (e) {}
    return roomTitle;
  });

  // Current active room avatar state (allows dedicated Room Avatar independent from host profile avatar)
  const [currentRoomAvatar, setCurrentRoomAvatar] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(`super_legend_room_avatar_${roomId}`);
      if (saved) return saved;
    } catch (e) {}
    return roomAvatar;
  });
  const [navigationToast, setNavigationToast] = useState<{
    roomTitle: string;
    sender: string;
    giftName: string;
  } | null>(null);
  // Dynamic Mic Management System State (Supports 2, 5, 8, 9, 12, 15, 20 seats)
  const [activeMicCount, setActiveMicCount] = useState<number>(20); // Default 20 active mics
  const [showMicControlModal, setShowMicControlModal] = useState<boolean>(false);
  const [requireMicRequest, setRequireMicRequest] = useState<boolean>(false);

  // Dynamic Host VIP Level State (VIP 8+ -> Red host name 🔴, < 8 -> White host name ⚪)
  const [hostVipLevel, setHostVipLevel] = useState<number>(8);

  // Unified Flexible Mic Seats State (Seats 1 to 20 - Clean Real Seats without Fake Bots)
  // All seats start empty. User joins in the broadcast audience at the bottom without ascending to the mic automatically.
  const [allMicSeats, setAllMicSeats] = useState<MicSeat[]>(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      userName: '',
      isEmpty: true
    }));
  });

  // Host Seat derived dynamically for info panels and headers (falls back to owner identity if unseated)
  const hostSeat = allMicSeats.find((s) => s.isHost && !s.isEmpty) || {
    id: 1,
    userId: myUserId,
    userName: isOwnerInitial ? myUserName : (hostName || 'مضيف الغرفة'),
    avatar: isOwnerInitial ? myUserAvatar : (roomAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'),
    isHost: true,
    isEmpty: true,
    vipLevel: myVipLevel
  };

  // Sync hostSeat VIP and badges when hostVipLevel toggles
  useEffect(() => {
    setAllMicSeats((prev) =>
      prev.map((s) => (s.id === 1 ? { ...s, vipLevel: `VIP${hostVipLevel}` } : s))
    );
  }, [hostVipLevel]);

  const allMicSeatsRef = useRef<MicSeat[]>(allMicSeats);
  useEffect(() => {
    allMicSeatsRef.current = allMicSeats;
  }, [allMicSeats]);

  // Dynamic list of room audience and chat members currently present in the room
  // User enters into the broadcast in the audience at the bottom without automatically ascending to a mic
  const [roomAudienceList, setRoomAudienceList] = useState<Array<{
    id: string;
    name: string;
    avatar: string;
    role: string;
    level: string;
    vip: string;
  }>>([
    {
      id: myUserId,
      name: myUserName,
      avatar: myUserAvatar,
      role: isOwnerInitial ? 'المالك 👑' : 'مستمع حاضر 🎧',
      level: 'Lv.88',
      vip: myVipLevel
    }
  ]);
  const audienceAndChatMembers = roomAudienceList;

  // User Profile ID & Role Definitions (dynamic CURRENT_USER_PROFILE_ID set above)

  // Helper to map AppRole to Room Role
  const mapAppRoleToRoomRole = (role: AppRole): 'owner' | 'host' | 'moderator' | 'guest' => {
    if (role === 'developer' || role === 'owner') return 'owner';
    if (role === 'moderator') return 'moderator';
    return 'guest';
  };

  const [currentAppRole, setCurrentAppRole] = useState<AppRole>(() => getActiveAppRole());
  // الدور داخل الغرفة مشروط حصراً بكون المستخدم المالك الحقيقي للغرفة أو زائر عادي
  const [currentUserRole, setCurrentUserRole] = useState<'owner' | 'host' | 'moderator' | 'guest'>(() => {
    return isStrictRoomOwner ? 'owner' : 'guest';
  });

  const canShowBottomBar = canAccessBottomControlBar(currentAppRole);
  const isDev = isDeveloper(currentAppRole) || currentAppRole === 'developer';

  useEffect(() => {
    setCurrentUserRole(isStrictRoomOwner ? 'owner' : 'guest');
  }, [isStrictRoomOwner, roomId]);

  const isOwner = isStrictRoomOwner;
  const isModerator = !isOwner && currentUserRole === 'moderator';
  const isRegularUser = !isOwner && !isModerator;
  const isCurrentAdmin = isOwner || isModerator;

  const [userMuteStates, setUserMuteStates] = useState<Record<string, boolean>>({
    [CURRENT_USER_PROFILE_ID]: false,
    [myUserId]: false
  });

  // Helper to check if a seat belongs to the current user (Memoized to prevent unnecessary re-renders)
  const isSeatMine = useCallback((s: MicSeat): boolean => {
    if (s.isEmpty) return false;
    if (s.userId && (s.userId === myUserId || s.userId === CURRENT_USER_PROFILE_ID || (Boolean(authUser?.id) && s.userId === authUser?.id))) {
      return true;
    }
    if (s.userName && (s.userName === myUserName || s.userName === 'أنا (انضمام)' || s.userName === 'المضيف (أنا)')) {
      return true;
    }
    return false;
  }, [myUserId, myUserName, authUser?.id]);

  // Derived current user occupied seat and admin mute status
  const [myOccupiedSeatId, setMyOccupiedSeat] = useState<number | null>(null);
  const myOccupiedSeatIdRef = useRef<number | null>(myOccupiedSeatId);
  useEffect(() => {
    myOccupiedSeatIdRef.current = myOccupiedSeatId;
  }, [myOccupiedSeatId]);

  const myOccupiedSeat = allMicSeats.find(isSeatMine);
  const isMySeatMutedByAdmin = Boolean(myOccupiedSeat?.isMuted && myOccupiedSeat?.isMutedByAdmin);

  // Current User Mic Mute State derived directly from occupied seat or user state
  const isMyMicMuted = myOccupiedSeat
    ? Boolean(myOccupiedSeat.isMuted)
    : Boolean(userMuteStates[myUserId] ?? userMuteStates[CURRENT_USER_PROFILE_ID] ?? false);
  // Supporter Coins Balance with real-time automatic persistence
  const getInitialUserCoins = (): number => {
    try {
      const saved = localStorage.getItem('user_wallet_coins');
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed >= 0) return parsed;
      }
    } catch {
      // ignore localStorage errors
    }
    return isOwner ? 100000000 : (authUser?.coins || 50000);
  };

  const [userCoinsBalance, setUserCoinsBalance] = useState<number>(getInitialUserCoins);

  const formatCoinsDisplay = (amount: number): string => {
    if (amount >= 1000000000) return `${(amount / 1000000000).toFixed(2)}B`;
    if (amount >= 10000000) return `${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(2)}M`;
    if (amount >= 10000) return `${(amount / 1000).toFixed(1)}K`;
    return amount.toLocaleString('en-US');
  };

  const userCoins = formatCoinsDisplay(userCoinsBalance);
  const userCoinsBalanceRef = useRef<number>(userCoinsBalance);
  userCoinsBalanceRef.current = userCoinsBalance;
  const isInternalCoinsUpdateRef = useRef<boolean>(false);

  // Ensure 100,000,000 coins are seeded to localStorage upon entering room
  useEffect(() => {
    try {
      const currentCoins = localStorage.getItem('user_wallet_coins');
      const parsedCoins = currentCoins ? parseInt(currentCoins, 10) : 0;
      if (!currentCoins || isNaN(parsedCoins) || parsedCoins < 100000000) {
        localStorage.setItem('user_wallet_coins', '100000000');
        setUserCoinsBalance(100000000);
        queueMicrotask(() => {
          window.dispatchEvent(
            new CustomEvent('user_coins_updated', {
              detail: { coins: 100000000, source: 'voice_room' }
            })
          );
        });
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('user_wallet_coins', userCoinsBalance.toString());
      if (isInternalCoinsUpdateRef.current) {
        isInternalCoinsUpdateRef.current = false;
        queueMicrotask(() => {
          window.dispatchEvent(
            new CustomEvent('user_coins_updated', {
              detail: { coins: userCoinsBalance, source: 'voice_room' }
            })
          );
        });
      }
    } catch {
      // ignore
    }
  }, [userCoinsBalance]);

  useEffect(() => {
    const handleGlobalCoinsUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.source === 'voice_room') return;
      if (typeof customEvent.detail?.coins === 'number' && customEvent.detail.coins !== userCoinsBalanceRef.current) {
        setUserCoinsBalance(customEvent.detail.coins);
      }
    };
    window.addEventListener('user_coins_updated', handleGlobalCoinsUpdate);
    return () => {
      window.removeEventListener('user_coins_updated', handleGlobalCoinsUpdate);
    };
  }, []);

  const [activeRefundDrawResult, setActiveRefundDrawResult] = useState<RefundDrawResult | null>(null);
  const [electricOrbState, setElectricOrbState] = useState<ElectricOrbState | null>(null);
  const rapidRefundTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rapidRefundExplodeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rapidRefundDismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rapidRefundSuspenseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rapidRefundTapsRef = useRef<{
    count: number;
    accumulatedCoins: number;
    accumulatedSpent: number;
    hasMegaJackpot: boolean;
    hasBigWin: boolean;
    maxMultiplier: number;
    giftName: string;
    giftIcon: string;
  }>({
    count: 0,
    accumulatedCoins: 0,
    accumulatedSpent: 0,
    hasMegaJackpot: false,
    hasBigWin: false,
    maxMultiplier: 1,
    giftName: '',
    giftIcon: ''
  });

  const handleDismissElectricOrb = () => {
    setElectricOrbState(null);
    if (rapidRefundTimerRef.current) clearTimeout(rapidRefundTimerRef.current);
    if (rapidRefundExplodeTimerRef.current) clearTimeout(rapidRefundExplodeTimerRef.current);
    if (rapidRefundSuspenseTimerRef.current) clearTimeout(rapidRefundSuspenseTimerRef.current);
    if (rapidRefundDismissTimerRef.current) clearTimeout(rapidRefundDismissTimerRef.current);
    rapidRefundTapsRef.current = {
      count: 0,
      accumulatedCoins: 0,
      accumulatedSpent: 0,
      hasMegaJackpot: false,
      hasBigWin: false,
      maxMultiplier: 1,
      giftName: '',
      giftIcon: ''
    };
  };

  const handleRefundOrbDraw = (result: RefundDrawResult, gift: GiftItem, qty: number) => {
    // 1. Play synthesized electric spark audio with rising pitch
    const nextCount = rapidRefundTapsRef.current.count + 1;
    playElectricChargeZap(nextCount);

    // 2. Accumulate draw stats and total coins spent
    const spentOnThisDraw = result.totalCost || (gift.price * qty) || 0;
    rapidRefundTapsRef.current.count = nextCount;
    rapidRefundTapsRef.current.accumulatedCoins += result.refundCoins;
    rapidRefundTapsRef.current.accumulatedSpent += spentOnThisDraw;
    rapidRefundTapsRef.current.hasMegaJackpot = rapidRefundTapsRef.current.hasMegaJackpot || result.winTier === 'mega_jackpot';
    rapidRefundTapsRef.current.hasBigWin = rapidRefundTapsRef.current.hasBigWin || result.winTier === 'big';
    rapidRefundTapsRef.current.maxMultiplier = Math.max(rapidRefundTapsRef.current.maxMultiplier, result.multiplier);
    rapidRefundTapsRef.current.giftName = gift.name;
    rapidRefundTapsRef.current.giftIcon = gift.icon;

    const currentSnapshot = { ...rapidRefundTapsRef.current };

    // 3. Update sphere state in charging mode
    setElectricOrbState({
      isActive: true,
      isExploding: false,
      showResult: false,
      tapCount: currentSnapshot.count,
      accumulatedCoins: currentSnapshot.accumulatedCoins,
      accumulatedSpent: currentSnapshot.accumulatedSpent,
      lastDrawResult: result,
      hasMegaJackpot: currentSnapshot.hasMegaJackpot,
      hasBigWin: currentSnapshot.hasBigWin,
      maxMultiplier: currentSnapshot.maxMultiplier,
      giftName: gift.name,
      giftIcon: gift.icon
    });

    // Clear previous pending timers
    if (rapidRefundTimerRef.current) clearTimeout(rapidRefundTimerRef.current);
    if (rapidRefundExplodeTimerRef.current) clearTimeout(rapidRefundExplodeTimerRef.current);
    if (rapidRefundSuspenseTimerRef.current) clearTimeout(rapidRefundSuspenseTimerRef.current);
    if (rapidRefundDismissTimerRef.current) clearTimeout(rapidRefundDismissTimerRef.current);

    // 1. Stop Tapping Detection (800ms of inactivity): Sphere immediately explodes and disappears
    rapidRefundTimerRef.current = setTimeout(() => {
      // Step A: Immediately trigger Sphere Explosion
      setElectricOrbState((prev) => (prev ? { ...prev, isExploding: true } : null));

      // Step B: After 400ms explosion burst, sphere disappears completely
      rapidRefundExplodeTimerRef.current = setTimeout(() => {
        setElectricOrbState((prev) => (prev ? { ...prev, isActive: false, isExploding: false } : null));

        // Step C: Suspense countdown (exact 7 seconds suspense after tapping finishes) -> Trigger Lightning Flash & Payout Reveal
        rapidRefundSuspenseTimerRef.current = setTimeout(() => {
          // Trigger the grand tiered lightning strike & reveal the total won coins
          setElectricOrbState((prev) => (prev ? { ...prev, isActive: true, isExploding: true, showResult: true } : null));

          // Auto-dismiss the payout ribbon after 4.5 seconds
          rapidRefundDismissTimerRef.current = setTimeout(() => {
            handleDismissElectricOrb();
          }, 4500);
        }, 7000);
      }, 400);
    }, 800);
  };

  const [toastNotification, setToastNotification] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastNotification(msg);
    setTimeout(() => setToastNotification(null), 3500);
  };
  const [sideGiftEvents, setSideGiftEvents] = useState<SideGiftEvent[]>([
    {
      id: 'demo-initial-rose-gift',
      senderName: 'فهد الملكي',
      senderId: 'user-fahad-demo',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      actionType: 'gift',
      giftName: 'تاج الملوك 👑',
      giftIcon: '👑',
      quantity: 1,
      targetName: 'أنا (الداعم)',
      targetId: CURRENT_USER_PROFILE_ID,
      timestamp: Date.now()
    }
  ]);

  const handleExpireSideGiftEvent = useCallback((id: string) => {
    setSideGiftEvents((prev) => prev.filter((ev) => ev.id !== id));
  }, []);

  // Quick Rose Return Handler: للمدعوم فقط عند الضغط على أيقونة الوردة
  const handleReturnRose = (event: SideGiftEvent) => {
    if (!event) return;

    // استثناء دعم الذات: منع الرد على النفس إطلاقاً
    const currentUserName = myOccupiedSeat?.userName || 'أنا (الداعم)';
    if (
      event.senderId === CURRENT_USER_PROFILE_ID ||
      event.senderName === currentUserName ||
      event.senderName?.includes('أنا')
    ) {
      return;
    }

    if (userCoinsBalance < 100) {
      setToastNotification('⚠️ رصيدك غير كافٍ لإرسال وردة (يلزم 100 كوينز)');
      setTimeout(() => setToastNotification(null), 3000);
      return;
    }

    // 1. خصم 100 كوينز فوراً
    setUserCoinsBalance((prev) => {
      const nextBalance = Math.max(0, prev - 100);
      try {
        localStorage.setItem('user_wallet_coins', nextBalance.toString());
      } catch (_) {}
      window.dispatchEvent(
        new CustomEvent('user_coins_updated', {
          detail: { coins: nextBalance, source: 'voice_room' }
        })
      );
      return nextBalance;
    });

    // 2. تحديث بطاقة الهدية كـ تم الرد عليها
    setSideGiftEvents((prev) =>
      prev.map((e) => (e.id === event.id ? { ...e, isReturned: true } : e))
    );

    // 3. إرسال وردة للداعم كـ رد للهدية في مسار الهدايا
    const returnEventId = `side-rose-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setSideGiftEvents((prev) => [
      ...prev,
      {
        id: returnEventId,
        senderName: currentUserName,
        senderId: CURRENT_USER_PROFILE_ID,
        senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
        actionType: 'gift',
        giftName: 'وردة الرد السريع 🌹',
        giftIcon: '🌹',
        quantity: 1,
        targetName: event.senderName,
        targetId: event.senderId,
        timestamp: Date.now()
      }
    ]);

    // 4. تأثير طيران الوردة على الشاشة
    const newRoseFlyingItem: DynamicFlyingGift = {
      id: `fg-rose-${Date.now()}-${Math.random()}`,
      icon: '🌹',
      targetElementId: 'room-top-audience',
      fallbackTargetPct: { x: 45, y: 30 },
      delay: 0,
      renderLayer: 'above_mics',
      particles: []
    };
    setFlyingGifts((prev) => [...prev, newRoseFlyingItem]);
    setTimeout(() => {
      setFlyingGifts((prev) => prev.filter((item) => item.id !== newRoseFlyingItem.id));
    }, 2500);

    // 5. إشعار تأكيد إرسال الوردة
    setToastNotification(`تم إرسال وردة 🌹 ردّاً على هدية ${event.senderName} (-100 كوينز)`);
    setTimeout(() => setToastNotification(null), 3000);
  };

  // Room Chat Lock State
  const [isChatLocked, setIsChatLocked] = useState(false);

  // Dedicated Platform Mic State: starts false when joining room, switches to true upon ascending to platform
  const [isOnMic, setIsOnMic] = useState<boolean>(false);

  // Derived state: check if current user is currently seated on any mic
  const isUserOnMic = isOnMic || allMicSeats.some(isSeatMine);

  // Sync isOnMic state whenever allMicSeats changes
  useEffect(() => {
    const isCurrentlySeated = allMicSeats.some(isSeatMine);
    if (isCurrentlySeated !== isOnMic) {
      setIsOnMic(isCurrentlySeated);
    }
  }, [allMicSeats, isOnMic]);

  // Helper check: is user allowed to type in chat when chat is locked
  const canUserTypeInChat = () => {
    if (!isChatLocked) return true;
    const isOwnerOrAdmin = isOwner || isCurrentAdmin;
    return isOwnerOrAdmin || isUserOnMic;
  };

  // Equipped Chat Bubble Skin for active user
  const [equippedBubbleSkin, setEquippedBubbleSkin] = useState<BubbleSkinType>('red_gold');

  // Swipe-to-Reply & Jump/Scroll to Original Message states
  const [replyingToMessage, setReplyingToMessage] = useState<{
    id: string;
    userName: string;
    text: string;
    avatar?: string;
  } | null>(null);

  // Chat Feed State with Avatars, Conditional Badges, and Dynamic Bubble Skins (نظيفة تماماً بدون أي رسائل وهمية)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  // Timestamp when user enters the room on their device to guarantee fresh, clean chat session
  const userRoomJoinTimestampRef = useRef<number>(Date.now());

  // Clean chat cache on local device whenever user enters or leaves the room
  useEffect(() => {
    userRoomJoinTimestampRef.current = Date.now();
    setChatMessages([]);
    try {
      localStorage.removeItem(`room_chat_messages_${roomId}`);
      sessionStorage.removeItem(`room_chat_messages_${roomId}`);
    } catch {}

    return () => {
      setChatMessages([]);
      try {
        localStorage.removeItem(`room_chat_messages_${roomId}`);
        sessionStorage.removeItem(`room_chat_messages_${roomId}`);
      } catch {}
    };
  }, [roomId]);

  // Real-time VIP Room Entrance Ribbon Queue (طابور دخول الغرفة الملكي الفاخر عند ساعة العداد)
  const [entranceQueue, setEntranceQueue] = useState<RoomEntranceEvent[]>([]);

  // Real-time badges for current user synced with central server & dashboard
  const [myRealBadges, setMyRealBadges] = useState<{
    supporterLevel: number;
    charmLevel: number;
    vipLevel: string;
    sharesLevel?: number | string;
    isSuperAdmin?: boolean;
    supporterBadgeDesign?: string;
    charmBadgeDesign?: string;
    vipDesignStyle?: string;
  }>({
    supporterLevel: 120,
    charmLevel: 45,
    vipLevel: 'VIP7',
    sharesLevel: 1,
    isSuperAdmin: true,
    supporterBadgeDesign: 'royal_dragon_flame',
    charmBadgeDesign: 'diamond_rose_5star',
    vipDesignStyle: 'royal_gold_3d'
  });

  useEffect(() => {
    let isCurrent = true;
    const loadRealBadges = async () => {
      try {
        const targetId = myUserId || '1001001';
        const meData = await fetchMobileMe(targetId);
        if (isCurrent && meData && meData.badges) {
          setMyRealBadges({
            supporterLevel: meData.badges.supporterLevel ?? meData.badges.level ?? 120,
            charmLevel: meData.badges.charmLevel ?? 45,
            vipLevel: meData.badges.vipLevel || 'VIP7',
            sharesLevel: 1,
            isSuperAdmin: targetId === '1001001' || isOwner,
            supporterBadgeDesign: meData.badges.supporterBadgeDesign || 'royal_dragon_flame',
            charmBadgeDesign: meData.badges.charmBadgeDesign || 'diamond_rose_5star',
            vipDesignStyle: meData.badges.vipDesignStyle || 'royal_gold_3d'
          });
        }
      } catch (err) {
        console.warn('Failed to load real badges in room:', err);
      }
    };
    loadRealBadges();

    const handleUpdate = () => loadRealBadges();
    window.addEventListener('dashboard_config_updated', handleUpdate);
    window.addEventListener('user_levels_tiers_updated', handleUpdate);
    return () => {
      isCurrent = false;
      window.removeEventListener('dashboard_config_updated', handleUpdate);
      window.removeEventListener('user_levels_tiers_updated', handleUpdate);
    };
  }, [myUserId, isOwner]);

  // Trigger Entrance Banner
  const triggerRoomEntrance = (user: {
    userName: string;
    avatar?: string;
    vipLevel?: number | string;
    nobleLevel?: string;
    actionText?: string;
  }) => {
    const entranceId = `ent-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newEvent: RoomEntranceEvent = {
      id: entranceId,
      userName: user.userName,
      avatar:
        user.avatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      vipLevel: user.vipLevel || 'VIP 6',
      actionText: user.actionText || 'انضم إلى الغرفة',
    };
    setEntranceQueue((prev) => [...prev, newEvent]);
  };

  // Trigger Batch Entrance (No simulated fake users)
  const triggerBatchRoomEntrance = (_count: number = 10) => {
    // Disabled in production
  };

  const [inputMessage, setInputMessage] = useState('');
  const [showChatInputModal, setShowChatInputModal] = useState(false);

  // VIP Cloud Announcement Broadcast Feature (إعلان VIP المتحرك - سحابة بحرف N)
  const [isVipBroadcastActive, setIsVipBroadcastActive] = useState(false);
  const [vipBroadcastRemaining, setVipBroadcastRemaining] = useState<number>(() => getSavedVipBroadcastQuota(50));
  const [currentVipAnnouncement, setCurrentVipAnnouncement] = useState<VipAnnouncementItem | null>(null);
  const [vipAnnouncementQueue, setVipAnnouncementQueue] = useState<VipAnnouncementItem[]>([]);

  // إلغاء ضغطة الزر تلقائياً عند تغيير الغرفة أو الخروج منها مع استمرار اعتماد الرصيد المستخدم
  useEffect(() => {
    setIsVipBroadcastActive(false);
    setVipBroadcastRemaining(getSavedVipBroadcastQuota(50));
    return () => {
      setIsVipBroadcastActive(false);
    };
  }, [roomId]);

  const handleDismissVipAnnouncement = useCallback(() => {
    setCurrentVipAnnouncement(null);
  }, []);

  useEffect(() => {
    if (!currentVipAnnouncement && vipAnnouncementQueue.length > 0) {
      const nextItem = vipAnnouncementQueue[0];
      setCurrentVipAnnouncement(nextItem);
      setVipAnnouncementQueue((prev) => prev.slice(1));
    }
  }, [currentVipAnnouncement, vipAnnouncementQueue]);

  // Dynamic Visual Viewport Metrics are encapsulated inside RoomChatInputModal

  // Floating Effects
  const [floatingEffects, setFloatingEffects] = useState<FloatingEffect[]>([]);
  const [activeGiftBanner, setActiveGiftBanner] = useState<{
    sender: string;
    senderAvatar?: string;
    giftName: string;
    giftIcon: string;
    quantity?: number;
    target: string;
    targetAvatar?: string;
  } | null>(null);
  const giftBannerTimerRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Dynamic Object-Reference Flying Gifts Animation State
  const [flyingGifts, setFlyingGifts] = useState<DynamicFlyingGift[]>([]);

  // Non-blocking Background Video Gift Animation State (Layer 2 & Layer 4 Video Gifts)
  const [activeVideoGift, setActiveVideoGift] = useState<{
    id: string;
    videoUrl?: string;
    icon?: string;
    thumbnailUrl?: string;
    name: string;
    sender: string;
    target: string;
    placement?: 'center' | 'top' | 'mics' | 'bottom' | 'fullscreen';
    renderLayer?: 'behind_mics' | 'above_mics';
    displayPosition?: 'above' | 'below' | 'center';
    scale?: number;
    blendMode?: 'screen' | 'normal' | 'lighten';
  } | null>(null);
  const [videoHasRenderError, setVideoHasRenderError] = useState(false);
  const videoGiftTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Dynamic Lucky Chest Winner Gliding Banners
  const [activeLuckyChestWinnerNotice, setActiveLuckyChestWinnerNotice] = useState<LuckyChestWinnerNoticeData | null>(null);
  const [luckyChestWinnersQueue, setLuckyChestWinnersQueue] = useState<LuckyChestWinnerNoticeData[]>([]);
  const luckyChestNoticeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 20,000+ Coins High-Value Gift Global Notification Banner (Disappears automatically after 6s)
  const [highValueGiftNotice, setHighValueGiftNotice] = useState<{
    sender: string;
    giftName: string;
    giftIcon: string;
    totalValue: number;
    targetName: string;
    roomTitle?: string;
  } | null>(null);

  const highValueNoticeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Consolidated Top-Level Audio & Realtime Refs (Ensures strict React Hook order stability)
  const voiceEngineRef = useRef<UnifiedRealtimeVoiceEngine | null>(null);
  const firestoreRtcRef = useRef<FirestoreWebRTCEngine | null>(null);
  const prevShowCountersOnMicsRef = useRef<boolean>(false);

  // Firebase & Room Initialization Guard State
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(() => isFirebaseReady());
  const [isRoomComponentReady, setIsRoomComponentReady] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    const timer = setTimeout(() => {
      if (isMounted) {
        setIsFirebaseConnected(isFirebaseReady());
        setIsRoomComponentReady(true);
      }
    }, 80);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  // Global broadcast listener for gifts >= 20,000 coins across all rooms
  useEffect(() => {
    const handleGlobalGiftEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{
        sender: string;
        giftName: string;
        giftIcon: string;
        totalValue: number;
        targetName: string;
        roomTitle?: string;
      }>;
      if (customEvent.detail && customEvent.detail.totalValue >= 20000) {
        setHighValueGiftNotice({
          sender: customEvent.detail.sender,
          giftName: customEvent.detail.giftName,
          giftIcon: customEvent.detail.giftIcon,
          totalValue: customEvent.detail.totalValue,
          targetName: customEvent.detail.targetName,
          roomTitle: customEvent.detail.roomTitle
        });

        if (highValueNoticeTimerRef.current) {
          clearTimeout(highValueNoticeTimerRef.current);
        }

        // Auto-disappear after 6 seconds
        highValueNoticeTimerRef.current = setTimeout(() => {
          setHighValueGiftNotice(null);
        }, 6000);
      }
    };

    window.addEventListener('global_high_value_gift', handleGlobalGiftEvent);
    return () => {
      window.removeEventListener('global_high_value_gift', handleGlobalGiftEvent);
      if (highValueNoticeTimerRef.current) {
        clearTimeout(highValueNoticeTimerRef.current);
      }
    };
  }, []);

  // Click-to-Redirect / Deep Linking handler for global notification banner
  const handleBannerNavigate = () => {
    if (!highValueGiftNotice) return;
    const targetRoom = highValueGiftNotice.roomTitle || 'وكالة شحن سوريا ألمانيا';

    // Show instant toast feedback for seamless navigation
    setNavigationToast({
      roomTitle: targetRoom,
      sender: highValueGiftNotice.sender,
      giftName: highValueGiftNotice.giftName
    });

    // Update active room title seamlessly
    setCurrentRoomTitle(targetRoom);

    // Broadcast system message to room chat
    const chatMsgId = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setChatMessages((prev) => [
      ...prev,
      {
        id: chatMsgId,
        userName: 'الرابط العالمي 🌐',
        text: `🚀 تم الانتقال الفوري إلى [${targetRoom}] لمتابعة رمي الهدايا الفاخرة (${highValueGiftNotice.totalValue.toLocaleString()} 💎)!`,
        userColor: 'text-amber-300 font-bold',
        isGift: true
      }
    ]);

    // Clear notice upon redirection
    setHighValueGiftNotice(null);

    if (onNavigateToRoom) {
      onNavigateToRoom(targetRoom);
    }

    setTimeout(() => {
      setNavigationToast(null);
    }, 3200);
  };

  const [showGiftDrawer, setShowGiftDrawer] = useState(false);
  const [selectedGiftTargetSeatIds, setSelectedGiftTargetSeatIds] = useState<number[]>([]);

  // Reset gift target selection on room switch (Requirement 4)
  const prevRoomIdForGiftsRef = useRef<string | undefined>(roomId);
  useEffect(() => {
    if (roomId && prevRoomIdForGiftsRef.current && prevRoomIdForGiftsRef.current !== roomId) {
      setSelectedGiftTargetSeatIds([]);
    }
    prevRoomIdForGiftsRef.current = roomId;
  }, [roomId]);
  const [recentlyUpdatedSeatCounters, setRecentlyUpdatedSeatCounters] = useState<
    Record<number, { amount: number; giftIcon: string; id: string }>
  >({});
  const [showGamesDrawer, setShowGamesDrawer] = useState(false);
  const [showYoHoBottomToolsModal, setShowYoHoBottomToolsModal] = useState(false);
  const [isRoomSpeakerMuted, setIsRoomSpeakerMuted] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [emojiCategoryTab, setEmojiCategoryTab] = useState<'laughs' | 'hearts' | 'cheers' | 'animated'>('laughs');
  const [activeSeatReactions, setActiveSeatReactions] = useState<{
    [seatId: number]: { emoji: string; emojiType?: string; lottieAssetPath?: string; glowColor?: string; id: string };
  }>({});
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);
  const [showTopOptionsMenuModal, setShowTopOptionsMenuModal] = useState(false);
  const [showModeratorStatsModal, setShowModeratorStatsModal] = useState(false);
  const [showRoomExitModal, setShowRoomExitModal] = useState(false);
  const [mainRoomConfig, setMainRoomConfig] = useState<MainRoomCustomizerConfig>(() => getMainRoomCustomizerConfig());
  const [currentRoomBgName, setCurrentRoomBgName] = useState<string>(() => {
    const cached = getCachedRoomState(roomId);
    return cached?.wallpaperName || 'القصر الملكي البنفسجي 🏰';
  });

  // Sync active room session with roomSessionService
  useEffect(() => {
    const totalCount = Math.max(
      1,
      allMicSeats.filter((s) => !s.isEmpty).length +
        audienceAndChatMembers.filter((a) => !allMicSeats.some((s) => s.userId === a.id)).length
    );
    queueMicrotask(() => {
      setActiveRoomSession({
        roomId,
        roomTitle: currentRoomTitle,
        hostName: hostSeat.userName || hostName,
        roomAvatar: currentRoomAvatar,
        isOwner: isOwner,
        ownerId: hostSeat.userId || myUserId,
        listenerCount: totalCount,
        isMinimized: false,
        isMuted: isMyMicMuted,
      });
    });
  }, [roomId, currentRoomTitle, hostSeat.userName, hostName, currentRoomAvatar, isOwner, isMyMicMuted, allMicSeats, audienceAndChatMembers, myUserId]);

  // Realistic Entrance Banner & Event broadcast when user enters the room
  useEffect(() => {
    const timer = setTimeout(() => {
      triggerRoomEntrance({
        userName: myUserName,
        avatar: myUserAvatar,
        vipLevel: myRealBadges.vipLevel || myVipLevel,
        nobleLevel: isOwnerInitial ? 'مالك الروم 👑' : 'نجم متألق 🌟',
        actionText: 'انضم إلى الغرفة 🌟'
      });

      // Explicit Room Chat Join Message: انضم [اسم المستخدم] إلى الروم
      const joinMsgId = 'join-' + Date.now();
      setChatMessages((prev) => {
        if (prev.some((m) => m.id === joinMsgId || (m.isJoinMessage && m.userId === myUserId))) return prev;
        return [
          ...prev,
          {
            id: joinMsgId,
            userId: myUserId,
            userName: myUserName,
            avatar: myUserAvatar,
            vipLevel: myRealBadges.vipLevel || myVipLevel || 'VIP7',
            text: `انضم ${myUserName} إلى الروم 🌟`,
            isJoinMessage: true,
            isHost: isOwnerInitial,
            userColor: 'text-[#FDE047] font-black'
          }
        ];
      });

      const safeRoomId = roomId || 'default-room';
      sendRoomEventToFirestore(safeRoomId, {
        type: 'entrance',
        senderId: myUserId,
        senderName: myUserName,
        senderAvatar: myUserAvatar,
        content: `انضم ${myUserName} إلى الروم 🌟`,
        timestamp: Date.now()
      }).catch(() => {});
    }, 350);

    return () => clearTimeout(timer);
  }, [myUserName, myUserAvatar, myVipLevel, isOwnerInitial, roomId, myUserId]);

  // Handle Room Session Keep in background (احتفاظ)
  const handleKeepInBackground = () => {
    minimizeRoomSession();
    setShowRoomExitModal(false);
    if (onMinimize) {
      onMinimize();
    } else {
      onClose();
    }
  };

  // Handle Individual Exit (خروج من الروم تماماً)
  const handleSoloExit = () => {
    setIsVipBroadcastActive(false);
    const currentRoomId = roomId || 'default-room';

    setIsOnMic(false);

    // 1. Disconnect and release physical microphone tracks and WebRTC engine immediately
    if (voiceEngineRef.current) {
      try {
        voiceEngineRef.current.updateSeat(null);
        voiceEngineRef.current.disableMicrophone();
        voiceEngineRef.current.releaseMicrophone?.();
        voiceEngineRef.current.destroy();
      } catch {}
      voiceEngineRef.current = null;
    }
    if (firestoreRtcRef.current) {
      try {
        firestoreRtcRef.current.disableMicrophone();
        firestoreRtcRef.current.releaseMicrophone();
        firestoreRtcRef.current.destroy();
      } catch {}
      firestoreRtcRef.current = null;
    }

    // 2. Vacate user's seat from Firestore immediately so seat is released in the cloud
    const myOccupiedSeats = allMicSeatsRef.current.filter((s) => !s.isEmpty && isSeatMine(s));
    myOccupiedSeats.forEach((seat) => {
      vacateRoomSeatInFirestore(currentRoomId, seat.id).catch(() => {});
    });

    // 3. Clear user seat immediately on exit so account does not hang
    setAllMicSeats(prev => prev.map(s => {
      if (isSeatMine(s) || s.userId === CURRENT_USER_PROFILE_ID || s.userId === myUserId || Boolean(s.userName?.includes('أنا'))) {
        return {
          ...s,
          isEmpty: true,
          userId: undefined,
          userName: '',
          avatar: '',
          vipLevel: undefined,
          isHost: false,
          isMuted: false,
          isMutedByAdmin: false,
          isSpeaking: false,
          isInvitationPending: false,
          isPendingAudioAcceptance: false
        };
      }
      return s;
    }));

    // 4. Terminate active room session completely & clean chat
    setChatMessages([]);
    try {
      localStorage.removeItem(`room_chat_messages_${currentRoomId}`);
      sessionStorage.removeItem(`room_chat_messages_${currentRoomId}`);
    } catch {}
    exitRoomSession();
    setIsRoomActive(false);
    setRoomUptimeSeconds(0);
    setShowRoomExitModal(false);

    // 5. Close room screen and broadcast exit event
    onClose();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('room_force_closed', { detail: { roomId: currentRoomId } }));
      window.dispatchEvent(new CustomEvent('room_exited', { detail: { roomId: currentRoomId } }));
    }
  };

  // Handle Room Dissolve (إحالة - طرد وإخراج الجميع من الروم - للمالك فقط)
  const handleDissolveRoom = () => {
    if (!isOwner) return;
    const currentRoomId = roomId || 'default-room';

    // 1. Broadcast kick/dissolve event to Firestore so all other devices and users exit immediately!
    sendRoomEventToFirestore(currentRoomId, {
      type: 'room_dissolved',
      senderId: myUserId,
      senderName: myUserName,
      content: 'قام المالك بإحالة الغرفة وطرد جميع المتواجدين',
      timestamp: Date.now()
    }).catch(() => {});

    // 2. Vacate ALL 20 mic seats in Firestore so the room is completely cleared
    for (let sId = 1; sId <= 20; sId++) {
      vacateRoomSeatInFirestore(currentRoomId, sId).catch(() => {});
    }

    // 3. Reset local seats and audience completely
    setAllMicSeats(prev => prev.map(s => ({
      ...s,
      isEmpty: true,
      userId: undefined,
      userName: `المقعد #${s.id}`,
      avatar: undefined,
      isLocked: false,
      isMuted: false,
      isSpeaking: false
    })));
    setRoomAudienceList([]);
    setChatMessages([]);
    setSeatCounters({});

    // 4. Disconnect and release physical microphone tracks and WebRTC engine
    if (voiceEngineRef.current) {
      try {
        voiceEngineRef.current.updateSeat(null);
        voiceEngineRef.current.disableMicrophone();
        voiceEngineRef.current.releaseMicrophone?.();
        voiceEngineRef.current.destroy();
      } catch {}
      voiceEngineRef.current = null;
    }
    if (firestoreRtcRef.current) {
      try {
        firestoreRtcRef.current.disableMicrophone();
        firestoreRtcRef.current.releaseMicrophone();
        firestoreRtcRef.current.destroy();
      } catch {}
      firestoreRtcRef.current = null;
    }

    // 5. Terminate room session and dispatch dissolve event
    dissolveRoomSession(currentRoomId);
    setIsRoomActive(false);
    setRoomUptimeSeconds(0);
    setShowRoomExitModal(false);

    // 6. Show toast and close room completely
    triggerToast('🚪 تمت إحالة الروم وطرد جميع المتواجدين بنجاح');
    onClose();

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('room_force_closed', { detail: { roomId: currentRoomId } }));
    }
  };

  useEffect(() => {
    // 1. Local event listeners for instantaneous UI feedback
    const handleMainRoomThemeUpdated = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.config) {
        setMainRoomConfig(customEvent.detail.config);
      } else {
        setMainRoomConfig(getMainRoomCustomizerConfig());
      }
    };

    const handleRoomWallpaperUpdated = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.wallpaperUrl) {
        const nextUrl = customEvent.detail.wallpaperUrl;
        const nextName = customEvent.detail.wallpaperName || 'خلفية الروم';
        setCurrentRoomBgUrl(nextUrl);
        if (customEvent.detail.wallpaperName) {
          setCurrentRoomBgName(nextName);
        }
        // Save to mobile cache & preload in background silently
        saveRoomStateToCache(roomId, {
          wallpaperUrl: nextUrl,
          wallpaperName: nextName
        });
        preloadWallpaperSilently(nextUrl, nextName);
      }
    };

    const handleRoomMetadataUpdated = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.roomId === roomId || !customEvent.detail?.roomId) {
        if (customEvent.detail?.roomAvatar) {
          setCurrentRoomAvatar(customEvent.detail.roomAvatar);
        }
        if (customEvent.detail?.roomTitle) {
          setCurrentRoomTitle(customEvent.detail.roomTitle);
        }
      }
    };

    window.addEventListener('main_room_theme_updated', handleMainRoomThemeUpdated);
    window.addEventListener('room_wallpaper_updated', handleRoomWallpaperUpdated);
    window.addEventListener('room_metadata_updated', handleRoomMetadataUpdated);

    // 2. Real-time Firestore subscription linked to room_id
    const unsubscribeFirestore = subscribeToRoomThemeFromFirestore(roomId, (cloudDoc) => {
      if (cloudDoc) {
        if (cloudDoc.themeConfig) {
          setMainRoomConfig({
            ...cloudDoc.themeConfig,
            roomOverlayDarkness: 0,
            activeWallpaperDimming: 0,
            activeWallpaperBrightness: 100,
            roomAmbientGlowIntensity: 0,
            roomBackdropBlur: 0
          });
        }
        if (cloudDoc.wallpaperUrl) {
          setCurrentRoomBgUrl(cloudDoc.wallpaperUrl);
          saveRoomStateToCache(roomId, {
            wallpaperUrl: cloudDoc.wallpaperUrl,
            wallpaperName: cloudDoc.wallpaperName || 'خلفية الروم'
          });
          preloadWallpaperSilently(cloudDoc.wallpaperUrl, cloudDoc.wallpaperName);
        }
        if (cloudDoc.wallpaperName) {
          setCurrentRoomBgName(cloudDoc.wallpaperName);
        }
        if (cloudDoc.roomTitle) {
          setCurrentRoomTitle(cloudDoc.roomTitle);
        }
        if (cloudDoc.roomAvatar) {
          setCurrentRoomAvatar(cloudDoc.roomAvatar);
        }
      }
    });

    const handleTestGiftInRoom = (e: Event) => {
      const customEvent = e as CustomEvent;
      const gift = customEvent.detail?.gift as GiftItem | undefined;
      if (gift) {
        handleSendGift(
          gift.name,
          gift.icon,
          gift.price,
          gift.name,
          'معاينة واختبار الهدية 🎯',
          undefined,
          gift.videoUrl,
          gift
        );
      }
    };
    window.addEventListener('test_gift_in_room', handleTestGiftInRoom);

    return () => {
      window.removeEventListener('main_room_theme_updated', handleMainRoomThemeUpdated);
      window.removeEventListener('room_wallpaper_updated', handleRoomWallpaperUpdated);
      window.removeEventListener('room_metadata_updated', handleRoomMetadataUpdated);
      window.removeEventListener('test_gift_in_room', handleTestGiftInRoom);
      unsubscribeFirestore();
    };
  }, [roomId]);

  // Screen Always On (إبقاء الشاشة مستيقظة أوتوماتيكياً فور دخول أي روم بدون الحاجة لأي تدخل من المستخدم)
  useEffect(() => {
    wakeLockService.requestRoomWakeLock().catch(() => {});
    return () => {
      wakeLockService.releaseWakeLock().catch(() => {});
    };
  }, [roomId]);

  const [isRoomLocked, setIsRoomLocked] = useState<boolean>(() => {
    const saved = localStorage.getItem('global_room_lock_status');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return Boolean(parsed.isLocked);
      } catch (e) {}
    }
    return false;
  });

  const [roomPassword, setRoomPassword] = useState<string>(() => {
    const saved = localStorage.getItem('global_room_lock_status');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.password || '123456';
      } catch (e) {}
    }
    return '123456';
  });

  useEffect(() => {
    const syncLock = () => {
      const saved = localStorage.getItem('global_room_lock_status');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setIsRoomLocked(Boolean(parsed.isLocked));
          if (parsed.password) setRoomPassword(parsed.password);
        } catch (e) {}
      }
    };
    window.addEventListener('room_lock_updated', syncLock);
    window.addEventListener('storage', syncLock);
    return () => {
      window.removeEventListener('room_lock_updated', syncLock);
      window.removeEventListener('storage', syncLock);
    };
  }, []);

  // الدالة الأساسية لتنفيذ القفل الموحد للصلاحيات والسيرفر
  const setRoomLockStatus = (shouldLock: boolean, password?: string) => {
    if (currentUserRole !== 'owner') {
      setToastNotification('خاصية قفل الغرفة متاحة للوكيل (صاحب الغرفة) فقط 🔒');
      setTimeout(() => setToastNotification(null), 3000);
      return;
    }

    const pass = password || roomPassword || '123456';
    setIsRoomLocked(shouldLock);
    if (password) setRoomPassword(password);

    const lockData = { isLocked: shouldLock, password: pass };
    localStorage.setItem('global_room_lock_status', JSON.stringify(lockData));
    window.dispatchEvent(new CustomEvent('room_lock_updated', { detail: lockData }));

    const msg = shouldLock
      ? `تم قفل الروم بنجاح بالرمز السري (${pass}) 🔒`
      : 'تم فتح الروم وإزالة الرمز السري 🔓';
    setToastNotification(msg);
    setTimeout(() => setToastNotification(null), 3500);
  };

  const [isIncognito, setIsIncognito] = useState(false);

  // Real-time WebRTC & Agora Unified Audio Engine States
  const [onlineRealtimePeers, setOnlineRealtimePeers] = useState<RealtimeRoomPresence[]>([]);
  const [isVoiceEngineConnected, setIsVoiceEngineConnected] = useState<boolean>(false);
  const [activeVoiceDriver, setActiveVoiceDriver] = useState<'zegocloud' | 'agora' | 'webrtc'>('webrtc');
  const [voiceNetworkQuality, setVoiceNetworkQuality] = useState<RealtimeNetworkQuality | null>(null);
  const [isNoiseSuppressionEnabled, setIsNoiseSuppressionEnabled] = useState<boolean>(() =>
    getSavedNoiseSuppressionState()
  );
  const [audioStreamMode, setAudioStreamMode] = useState<AudioStreamMode>(() =>
    getSavedAudioStreamMode()
  );

  const handleToggleAudioStreamMode = (_targetMode?: AudioStreamMode) => {
    setAudioStreamMode('media');
    saveAudioStreamMode('media');
    if (voiceEngineRef.current) {
      voiceEngineRef.current.setAudioStreamMode('media');
    }
    setToastNotification('🎵 مسار الصوت مضبوط تلقائياً وموحد على وضع الوسائط (Media Stream) لجميع المستخدمين');
    setTimeout(() => setToastNotification(null), 3500);
  };

  const handleToggleNoiseSuppression = () => {
    const nextState = !isNoiseSuppressionEnabled;
    setIsNoiseSuppressionEnabled(nextState);
    saveNoiseSuppressionState(nextState);
    if (voiceEngineRef.current) {
      voiceEngineRef.current.setNoiseSuppression(nextState);
    }
    setToastNotification(
      nextState
        ? '🎙️ تم تشغيل إلغاء ضوضاء المايكروفون (عزل الضجيج الصوتي بتقنية DSP)'
        : '🎙️ تم إيقاف إلغاء ضوضاء المايكروفون'
    );
    setTimeout(() => setToastNotification(null), 3000);
  };

  useEffect(() => {
    const realDisplayName = myUserName;
    const realDisplayAvatar = myUserAvatar;
    const engine = new UnifiedRealtimeVoiceEngine({
      roomId,
      userId: `user_${CURRENT_USER_PROFILE_ID}`,
      userName: realDisplayName,
      userAvatar: realDisplayAvatar,
      seatId: null,
      preferredDriver: 'webrtc',
      isNoiseSuppressionEnabled
    });
    engine.setNoiseSuppression(isNoiseSuppressionEnabled);
    voiceEngineRef.current = engine;

    engine.onConnectionStatus = (status) => {
      setIsVoiceEngineConnected(status === 'connected');
    };

    engine.onDriverChanged = (driver) => {
      setActiveVoiceDriver(driver);
    };

    engine.onNetworkQuality = (quality) => {
      setVoiceNetworkQuality(quality);
    };

    engine.onPresenceUpdate = (peers) => {
      setOnlineRealtimePeers(peers);
      // Sync other connected devices/peers into mic seats if they occupy a seat (with diff check to protect mobile CPU)
      setAllMicSeats((prev) => {
        let hasChanges = false;
        const nextSeats = prev.map((seat) => {
          // If local user occupies this seat, keep local user
          if (isSeatMine(seat)) {
            return seat;
          }

          // Check if a remote peer sits on this seat
          const remotePeer = peers.find((p) => p.seatId === seat.id && p.peerId !== engine.myPeerId);
          if (remotePeer) {
            const updatedSeat: MicSeat = {
              ...seat,
              isEmpty: false,
              userId: `peer_${remotePeer.peerId}`,
              userName: remotePeer.userName,
              avatar: remotePeer.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
              isMuted: remotePeer.isMuted,
              isHost: seat.id === 1
            };
            if (seat.isEmpty !== updatedSeat.isEmpty || seat.userName !== updatedSeat.userName || seat.isMuted !== updatedSeat.isMuted) {
              hasChanges = true;
            }
            return updatedSeat;
          }

          // If no remote peer is on seat 1, and local user is not owner, show the room host
          if (seat.id === 1 && !isOwner) {
            const hostSeatItem: MicSeat = {
              ...seat,
              isEmpty: false,
              userId: 'host_seat_1',
              userName: hostName || 'مضيف الغرفة',
              avatar: roomAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
              isHost: true,
              vipLevel: 'VIP8'
            };
            if (seat.isEmpty !== hostSeatItem.isEmpty || seat.userName !== hostSeatItem.userName) {
              hasChanges = true;
            }
            return hostSeatItem;
          }

          // All other vacant seats: strictly EMPTY!
          if (!seat.isEmpty) {
            hasChanges = true;
          }
          return {
            ...seat,
            isEmpty: true,
            userId: undefined,
            userName: '',
            avatar: '',
            isSpeaking: false,
            isHost: false
          };
        });

        return hasChanges ? nextSeats : prev;
      });
    };

    engine.getCurrentSeatId = () => {
      const mySeat = allMicSeatsRef.current.find(isSeatMine);
      return mySeat ? mySeat.id : null;
    };

    engine.onPeerSpeaking = (speakingState) => {
      setAllMicSeats((prev) =>
        prev.map((s) => {
          const isTargetSeat = (speakingState.seatId && s.id === speakingState.seatId) ||
            (!speakingState.seatId && !s.isEmpty && (
              (speakingState.peerId && s.userId === speakingState.peerId) ||
              (speakingState.userName && s.userName === speakingState.userName)
            ));

          if (isTargetSeat) {
            return {
              ...s,
              isSpeaking: speakingState.isSpeaking,
              audioLevel: speakingState.isSpeaking ? Math.max(20, speakingState.audioLevel || 40) : 0
            };
          }
          return s;
        })
      );
    };

    engine.onChatMessage = (incomingMsg) => {
      // Do not accept echo of our own sent messages
      if (incomingMsg.senderPeerId && incomingMsg.senderPeerId === engine.myPeerId) return;
      setChatMessages((prev) => {
        if (prev.some((m) => m.id === incomingMsg.id)) return prev;
        // Safety against immediate echo of self message with same text
        const isEcho = prev.slice(-3).some((m) => m.text === incomingMsg.text && (m.isHost || Boolean(m.userName?.includes('أنا'))));
        if (isEcho) return prev;
        return [
          ...prev,
          {
            id: incomingMsg.id || `msg-${Date.now()}`,
            userName: incomingMsg.userName || 'زائر',
            avatar: incomingMsg.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
            text: incomingMsg.text || '',
            userColor: 'text-cyan-300 font-bold',
            bubbleSkin: incomingMsg.bubbleSkin || 'default',
            badges: incomingMsg.badges || []
          }
        ].slice(-30);
      });
    };

    engine.onMicPermissionError = (err) => {
      setToastNotification('تعذر الوصول للمايك: يرجى السماح بصلاحية الميكروفون في المتصفح 🎙️');
      setTimeout(() => setToastNotification(null), 4000);
    };

    engine.connect();

    return () => {
      try {
        engine.disableMicrophone();
        engine.destroy();
      } catch {}
      voiceEngineRef.current = null;
    };
  }, [roomId, currentUserRole, hostName]);


  // --- Real-time Global Sync across devices via Firebase Firestore ---
  useEffect(() => {
    if (!isRoomComponentReady) return;
    const currentRoomId = roomId || 'default-room';

    // 1. Subscribe to Live Firestore Chat Messages (Filtered to user entry time so returning user sees clean chat)
    const unsubChat = subscribeToRoomMessages(
      currentRoomId,
      (msgs) => {
        if (msgs && msgs.length > 0) {
          setChatMessages((prev) => {
            const map = new Map<string, ChatMessage>();
            prev.forEach((m) => map.set(m.id, m));
            msgs.forEach((m) => map.set(m.id, m));
            return Array.from(map.values()).slice(-30);
          });
        }
      },
      userRoomJoinTimestampRef.current
    );

    // 2. Initialize Autonomous Firestore-signaled WebRTC Voice Engine
    const rtcEngine = new FirestoreWebRTCEngine({
      roomId: currentRoomId,
      userId: myUserId,
      userName: myUserName,
      userAvatar: myUserAvatar,
      seatId: null
    });

    rtcEngine.onPeerSpeaking = (speakingState) => {
      setAllMicSeats((prev) =>
        prev.map((s) => {
          const isTarget = (speakingState.seatId && s.id === speakingState.seatId) ||
            (speakingState.userName && s.userName === speakingState.userName);
          if (isTarget) {
            return {
              ...s,
              isSpeaking: speakingState.isSpeaking,
              audioLevel: speakingState.audioLevel || 35
            };
          }
          return s;
        })
      );
    };

    rtcEngine.connect();
    firestoreRtcRef.current = rtcEngine;

    // 3. Subscribe to Live Mic Seats in Firestore (With diff check to prevent mobile infinite re-render loops)
    const unsubSeats = subscribeToRoomSeats(currentRoomId, (remoteSeats) => {
      setAllMicSeats((prev) => {
        let hasChanges = false;
        const nextSeats = prev.map((seat) => {
          const remote = remoteSeats[seat.id];
          if (!remote) {
            return seat;
          }

          // If another remote device occupies this seat, connect P2P WebRTC audio
          if (!remote.isEmpty && remote.peerId && remote.peerId !== rtcEngine.myPeerId) {
            rtcEngine.connectToPeer(remote.peerId, true).catch(() => {});
          }

          // 1. If remote seat is marked empty in Firestore:
          if (remote.isEmpty) {
            // CONDITIONAL RENDERING GUARD:
            // Do NOT wipe the local user's seat while asynchronous Firebase write or seat interaction is in progress!
            const isLocalUserOnThisSeat =
              (myOccupiedSeatIdRef.current && seat.id === myOccupiedSeatIdRef.current) ||
              isSeatMine(seat);

            if (isLocalUserOnThisSeat) {
              return seat;
            }

            if (!seat.isEmpty) {
              hasChanges = true;
            }
            return {
              ...seat,
              isEmpty: true,
              userId: undefined,
              userName: '',
              avatar: '',
              isSpeaking: false,
              isMuted: true,
              audioLevel: 0
            };
          }

          // 2. If seat is occupied, check if it belongs to current user
          const isMe = remote.userId === myUserId || remote.userName === myUserName;
          if (isMe) {
            const nextItem: MicSeat = {
              ...seat,
              isEmpty: false,
              userId: myUserId,
              userName: myUserName,
              avatar: myUserAvatar,
              isMuted: isMyMicMuted,
              isSpeaking: Boolean(seat.isSpeaking),
              audioLevel: seat.audioLevel || 0,
              isHost: Boolean(isOwner || currentUserRole === 'host')
            };
            if (
              seat.isEmpty !== nextItem.isEmpty ||
              seat.userId !== nextItem.userId ||
              seat.userName !== nextItem.userName ||
              seat.isMuted !== nextItem.isMuted
            ) {
              hasChanges = true;
            }
            return nextItem;
          }

          const updatedSeat: MicSeat = {
            ...seat,
            isEmpty: remote.isEmpty !== undefined ? remote.isEmpty : seat.isEmpty,
            userId: (remote.userId !== undefined && remote.userId !== '') ? remote.userId : seat.userId,
            userName: (remote.userName !== undefined && remote.userName !== '') ? remote.userName : seat.userName,
            avatar: (remote.avatar !== undefined && remote.avatar !== '') ? remote.avatar : seat.avatar,
            vipLevel: remote.vipLevel || seat.vipLevel,
            isMuted: remote.isMuted !== undefined ? Boolean(remote.isMuted) : seat.isMuted,
            isSpeaking: remote.isSpeaking !== undefined ? Boolean(remote.isSpeaking) : Boolean(seat.isSpeaking),
            audioLevel: remote.audioLevel !== undefined ? remote.audioLevel : (seat.audioLevel || 0),
            isLocked: remote.isLocked !== undefined ? Boolean(remote.isLocked) : seat.isLocked,
            isHost: remote.isHost !== undefined ? Boolean(remote.isHost) : seat.isHost
          };

          if (
            seat.isEmpty !== updatedSeat.isEmpty ||
            seat.userId !== updatedSeat.userId ||
            seat.userName !== updatedSeat.userName ||
            seat.isMuted !== updatedSeat.isMuted ||
            seat.isSpeaking !== updatedSeat.isSpeaking ||
            seat.isLocked !== updatedSeat.isLocked
          ) {
            hasChanges = true;
          }

          return updatedSeat;
        });

        // تجميع وتأكيد المقاعد الفريدة تماماً ومنع تكرار أي مستخدم (Unique Seats Deduplication)
        const seenUserIds = new Set<string>();
        const seenUserNames = new Set<string>();
        let hasDuplicatesRemoved = false;

        const myKnownSeatId = myOccupiedSeatIdRef.current || allMicSeatsRef.current.find(isSeatMine)?.id;

        const uniqueSeats = nextSeats.map((seat) => {
          if (seat.isEmpty) return seat;

          const uid = seat.userId ? seat.userId.trim() : '';
          const uname = seat.userName ? seat.userName.trim().toLowerCase() : '';

          const isMe =
            (uid !== '' && (uid === myUserId || uid === CURRENT_USER_PROFILE_ID)) ||
            (uname !== '' && (uname === myUserName.toLowerCase() || uname.includes('أنا')));

          if (isMe && myKnownSeatId && seat.id !== myKnownSeatId) {
            hasDuplicatesRemoved = true;
            return {
              ...seat,
              isEmpty: true,
              userId: undefined,
              userName: '',
              avatar: '',
              isMuted: true,
              isSpeaking: false,
              audioLevel: 0
            };
          }

          const isDuplicateUser =
            (uid !== '' && seenUserIds.has(uid)) ||
            (uname !== '' && seenUserNames.has(uname));

          if (isDuplicateUser) {
            hasDuplicatesRemoved = true;
            return {
              ...seat,
              isEmpty: true,
              userId: undefined,
              userName: '',
              avatar: '',
              isMuted: true,
              isSpeaking: false,
              audioLevel: 0
            };
          }

          if (uid !== '') seenUserIds.add(uid);
          if (uname !== '') seenUserNames.add(uname);
          return seat;
        });

        return (hasChanges || hasDuplicatesRemoved) ? uniqueSeats : prev;
      });
    });

    // 4. Subscribe to Live Synchronized Cinema Video
    const unsubCinema = subscribeToRoomCinema(currentRoomId, (cinema) => {
      if (cinema && cinema.youtubeId) {
        setSelectedCinemaVideo({
          id: cinema.videoId || 'live-cinema',
          youtubeId: cinema.youtubeId,
          title: cinema.title || 'فيديو متزامن',
          author: cinema.author || 'السينما',
          thumbnail: cinema.thumbnail || '',
          category: 'cinema'
        });
        setIsCinemaWatchMode(true);
      } else if (cinema === null) {
        setSelectedCinemaVideo(null);
        setIsCinemaWatchMode(false);
      }
    });

    // 5. Subscribe to Live Room Events (Gifts, Reactions, Entrance, Room Dissolve, VIP Cloud 'N' Announcement)
    const unsubEvents = subscribeToRoomEvents(currentRoomId, (event) => {
      if (event.type === 'vip_announcement') {
        const annId = event.id || `vip-ann-${event.timestamp || Date.now()}`;
        const vipItem: VipAnnouncementItem = {
          id: annId,
          senderName: event.senderName,
          senderAvatar: event.senderAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
          text: event.content,
          vipLevel: event.metadata?.vipLevel || 'VIP6',
          level: event.metadata?.level || 94,
          nobleLevel: event.metadata?.nobleLevel || 'N5',
          createdAt: event.timestamp || Date.now()
        };

        setCurrentVipAnnouncement((curr) => {
          if (!curr) return vipItem;
          if (curr.id === annId) return curr;
          setVipAnnouncementQueue((q) => (q.some((x) => x.id === annId) ? q : [...q, vipItem]));
          return curr;
        });
      } else if (event.type === 'gift') {
        setActiveGiftBanner({
          sender: event.senderName,
          senderAvatar: event.senderAvatar,
          giftName: event.content,
          target: event.targetName || 'الجميع'
        });
        setTimeout(() => setActiveGiftBanner(null), 4000);
      } else if (event.type === 'room_dissolved' && event.senderId !== myUserId) {
        // Owner dissolved the room and ejected all occupants!
        triggerToast('⚠️ قام المالك بإحالة الغرفة وطرد جميع المتواجدين');
        handleSoloExit();
      } else if (event.type === 'entrance' && event.senderId !== myUserId) {
        // Real-time notification of another user entering the room
        triggerRoomEntrance({
          userName: event.senderName,
          avatar: event.senderAvatar,
          vipLevel: 'VIP5',
          nobleLevel: 'ضيف مميز ✨',
          actionText: 'انضم إلى الغرفة 🎙️'
        });
      }
    });

    const handleRoomDissolvedByOwner = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (!isOwner && (customEvent.detail?.roomId === currentRoomId || !customEvent.detail?.roomId)) {
        triggerToast('⚠️ قام المالك بإحالة الغرفة وطرد جميع المتواجدين');
        handleSoloExit();
      }
    };
    window.addEventListener('room_dissolved_by_owner', handleRoomDissolvedByOwner);

    return () => {
      try { unsubChat?.(); } catch {}
      try { unsubSeats?.(); } catch {}
      try { unsubCinema?.(); } catch {}
      try { unsubEvents?.(); } catch {}
      window.removeEventListener('room_dissolved_by_owner', handleRoomDissolvedByOwner);
      try {
        rtcEngine?.destroy?.();
      } catch {}
      if (firestoreRtcRef) {
        firestoreRtcRef.current = null;
      }
    };
  }, [roomId, myUserId, myUserName, myUserAvatar, isOwner, isRoomComponentReady]);

  // Digital Counter States & Protection Logic (منطق إدارة العدادات مع إجراءات الحماية)
  const [showCountersOnMics, setShowCountersOnMics] = useState(true);
  const [isCounterRunning, setIsCounterRunning] = useState<boolean>(true);
  const [isCounterPaused, setIsCounterPaused] = useState<boolean>(false);

  // إيقاف العداد
  const stopCounter = () => {
    setIsCounterRunning(false);
    setIsCounterPaused(true);
  };

  // منطق إدارة العدادات مع إجراءات الحماية: حظر تغيير وضع المايكات طالما أن العداد نشط
  const onAttemptToChangeMicLayout = (preset: number) => {
    if (isTeamBattleActive) {
      setToastNotification('لا يمكن تغيير إعدادات المايكات أثناء وضع معركة الفريق 🛑');
      setTimeout(() => setToastNotification(null), 3000);
      return;
    }

    if (isCounterRunning && !isCounterPaused) {
      setToastNotification('يجب إيقاف العدادات أولاً لتغيير وضع المايكات 🛑');
      setTimeout(() => setToastNotification(null), 3000);
      return;
    }

    setActiveMicCount(preset);
    setToastNotification(`تم تطبيق إعداد المايكات (${preset} مايكات) بنجاح 🎙️`);
    setTimeout(() => setToastNotification(null), 3000);
  };

  // منطق خلو الغرفة: إيقاف العداد وتحديد الحالة كمتوقفة فور خلو الغرفة لاستقبال البث القادم
  const onUserLeftRoom = () => {
    const isRoomEmpty = allMicSeats.every((seat) => seat.isEmpty);
    if (isRoomEmpty) {
      stopCounter(); // إيقاف العداد فور خلو الغرفة
      setIsCounterPaused(true); // تعيين الحالة كمتوقفة لاستقبال البث القادم
    }
  };

  useEffect(() => {
    onUserLeftRoom();
  }, [allMicSeats]);

  // Cumulative Room Broadcast Hours Uptime Counter State (عداد ساعات البث المباشر المجمعة للروم - يبدأ من البداية لجميع المتواجدين)
  const [roomUptimeSeconds, setRoomUptimeSeconds] = useState(0);
  const [isRoomActive, setIsRoomActive] = useState(true);

  // Initialize broadcast timer: When entering the room or opening broadcast, start from zero (00:00)
  useEffect(() => {
    setRoomUptimeSeconds(0);
  }, [roomId]);

  // Interval timer for Room Uptime - accumulates while room is active, visible to EVERYONE in the room
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isRoomActive) {
      timer = setInterval(() => {
        setRoomUptimeSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRoomActive]);

  // Helper function to format seconds into HH:MM:SS or MM:SS
  const formatUptimeTime = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    const pad = (n: number) => n.toString().padStart(2, '0');
    if (hrs > 0) {
      return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
    }
    return `${pad(mins)}:${pad(secs)}`;
  };
  const [seatCounters, setSeatCounters] = useState<Record<number, number>>({
    1: 1250,
    2: 840,
    3: 520,
    4: 310,
    5: 180,
    6: 95,
    7: 60,
    8: 30,
    9: 0,
    10: 0,
    11: 0,
    12: 0,
    13: 0,
    14: 0,
    15: 0,
    16: 0,
    17: 0,
    18: 0,
    19: 0,
    20: 0,
  });
  const [selectedSeatForCounterControl, setSelectedSeatForCounterControl] = useState<number | null>(null);
  const [showCounterControlModal, setShowCounterControlModal] = useState(false);
  const [showDevConfigModal, setShowDevConfigModal] = useState(false);
  const [showMusicPlayerModal, setShowMusicPlayerModal] = useState(false);
  const [showSoundEffectsModal, setShowSoundEffectsModal] = useState(false);
  const [isSmartBalanceEnabled, setIsSmartBalanceEnabled] = useState(true);
  const [showFamilyModal, setShowFamilyModal] = useState(false);

  // Cinema Watch Together & YouTube Video Sync Mode (مشاهدة الفيديو مع الأصدقاء)
  const [isCinemaWatchMode, setIsCinemaWatchMode] = useState<boolean>(false);
  const [selectedCinemaVideo, setSelectedCinemaVideo] = useState<CinemaVideoItem | null>(null);
  const [showCinemaVideoPickerModal, setShowCinemaVideoPickerModal] = useState<boolean>(false);
  const [videoSuggestions, setVideoSuggestions] = useState<VideoSuggestion[]>([]);

  // Suggestion handlers for Room Owner & Supervisors / Members
  const handleSuggestVideo = (
    video: CinemaVideoItem,
    suggester: {
      userId: string;
      userName: string;
      avatar?: string;
      userRole: 'owner' | 'host' | 'moderator' | 'guest';
    }
  ) => {
    const newSug: VideoSuggestion = {
      id: `sug_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      video,
      suggestedBy: suggester,
      suggestedAt: 'الآن'
    };

    setVideoSuggestions((prev) => [newSug, ...prev]);

    const roleName =
      suggester.userRole === 'moderator'
        ? 'المشرف'
        : suggester.userRole === 'host'
        ? 'المضيف'
        : 'العضو';

    const sugMsg: ChatMessage = {
      id: `chat_sug_${Date.now()}`,
      userName: suggester.userName,
      avatar: suggester.avatar,
      text: `💡 اقترح ${roleName} فيديو: "${video.title}" لسينما الروم`,
      userColor: '#F59E0B',
      isHost: suggester.userRole === 'owner' || suggester.userRole === 'host'
    };
    setChatMessages((prev) => [...prev, sugMsg]);

    setToastNotification(`تم إرسال اقتراح الفيديو "${video.title}" لصاحب الغرفة بنجاح 💡✨`);
    setTimeout(() => setToastNotification(null), 3500);
  };

  const handleAcceptSuggestion = (suggestion: VideoSuggestion) => {
    setSelectedCinemaVideo(suggestion.video);
    setIsCinemaWatchMode(true);
    setShowCinemaVideoPickerModal(false);

    updateRoomCinemaInFirestore(roomId || 'default-room', {
      videoId: suggestion.video.id,
      youtubeId: suggestion.video.youtubeId,
      title: suggestion.video.title,
      author: suggestion.video.channelTitle,
      thumbnail: suggestion.video.thumbnailUrl,
      isPlaying: true,
      updatedBy: myUserName,
      updatedAt: Date.now()
    }).catch(() => {});

    setVideoSuggestions((prev) => prev.filter((s) => s.id !== suggestion.id));

    const acceptMsg: ChatMessage = {
      id: `chat_accept_${Date.now()}`,
      userName: hostSeat.userName || 'مالك الغرفة',
      avatar: hostSeat.avatar,
      text: `🎬 بدأ مالك الغرفة تشغيل الاقتراح المقدم من ${suggestion.suggestedBy.userName}: "${suggestion.video.title}" 🍿✨`,
      userColor: '#10B981',
      isHost: true
    };
    setChatMessages((prev) => [...prev, acceptMsg]);

    setToastNotification(`تم بدء تشغيل الفيديو المقترح: "${suggestion.video.title}" 🎬🍿`);
    setTimeout(() => setToastNotification(null), 3500);
  };

  const handleDeleteSuggestion = (suggestionId: string) => {
    setVideoSuggestions((prev) => prev.filter((s) => s.id !== suggestionId));
    setToastNotification('تم حذف الاقتراح من القائمة');
    setTimeout(() => setToastNotification(null), 2500);
  };

  // Normal Room Counter Round Result State
  const [showNormalRoundResultModal, setShowNormalRoundResultModal] = useState(false);
  const [normalRoundResultData, setNormalRoundResultData] = useState<NormalRoundResultData | null>(null);

  // Team Battle (معركة الفريق / Team PK) States
  const [showTeamBattleModal, setShowTeamBattleModal] = useState(false);
  const [showTeamBattleResultModal, setShowTeamBattleResultModal] = useState(false);
  const [isTeamBattleActive, setIsTeamBattleActive] = useState(false);
  const [teamBattleStatus, setTeamBattleStatus] = useState<'preparation' | 'running' | 'ended'>('preparation');
  const [teamBattleTimer, setTeamBattleTimer] = useState<number>(15 * 60);
  const [redTeamScore, setRedTeamScore] = useState<number>(0);
  const [blueTeamScore, setBlueTeamScore] = useState<number>(0);
  const [ownerJoinedTeam, setOwnerJoinedTeam] = useState<'none' | 'red' | 'blue'>('none');
  const [pkTopSupportersMap, setPkTopSupportersMap] = useState<Record<string, PKSupporter>>({});
  const [pkResultData, setPkResultData] = useState<{
    redScore: number;
    blueScore: number;
    winner: 'red' | 'blue' | 'draw';
    topSupporter: PKSupporter | null;
  }>({
    redScore: 0,
    blueScore: 0,
    winner: 'draw',
    topSupporter: null
  });

  // Lucky Chest (صندوق حظ / صندوق الحظ السوبر / حقيبة الهدايا) States & Synchronization
  const [showLuckyChestModal, setShowLuckyChestModal] = useState(false);
  const [showLuckyChestClaimModal, setShowLuckyChestClaimModal] = useState(false);
  const [selectedChestForClaim, setSelectedChestForClaim] = useState<LuckyChestConfig | null>(null);
  const [activeLuckyChests, setActiveLuckyChests] = useState<LuckyChestConfig[]>(() => {
    try {
      const saved = localStorage.getItem('super_legend_active_lucky_chests');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    // Initial active lucky chest ready to claim
    return [
      {
        id: 'chest_sample_super_1',
        type: 'super',
        coins: 99999,
        portions: 20,
        eligibility: 'unlimited',
        drawTime: 'instant',
        senderName: 'عابر سبيل..',
        senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
        senderVip: 'VIP 6',
        senderLevel: 'Lv.113',
        createdAt: Date.now() - 15000,
        totalCoins: 99999,
        remainingPortions: 17,
        claimedBy: [
          {
            userId: 'user_101',
            userName: 'سلطان القلوب',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
            wonAmount: 4950,
            claimedAt: Date.now() - 10000
          },
          {
            userId: 'user_102',
            userName: 'البرنسيسة نور',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100',
            wonAmount: 5120,
            claimedAt: Date.now() - 6000
          },
          {
            userId: 'user_103',
            userName: 'صقر قريش',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100',
            wonAmount: 4880,
            claimedAt: Date.now() - 3000
          }
        ]
      }
    ];
  });

  // Sync active lucky chests across rooms and tabs
  useEffect(() => {
    const syncChests = () => {
      try {
        const saved = localStorage.getItem('super_legend_active_lucky_chests');
        if (saved) {
          setActiveLuckyChests(JSON.parse(saved));
        }
      } catch (e) {}
    };
    window.addEventListener('storage', syncChests);
    window.addEventListener('lucky_chest_updated', syncChests);
    return () => {
      window.removeEventListener('storage', syncChests);
      window.removeEventListener('lucky_chest_updated', syncChests);
    };
  }, []);

  const handleSendLuckyChest = (chestData: Omit<LuckyChestConfig, 'id' | 'createdAt' | 'remainingPortions' | 'claimedBy'>) => {
    const newChest: LuckyChestConfig = {
      ...chestData,
      id: `chest_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      roomId: roomId || 'room-1',
      roomTitle: currentRoomTitle || roomTitle || 'وكالة شحن سوريا ألمانيا',
      createdAt: Date.now(),
      remainingPortions: chestData.portions,
      claimedBy: []
    };

    const updated = [newChest, ...activeLuckyChests];
    setActiveLuckyChests(updated);
    localStorage.setItem('super_legend_active_lucky_chests', JSON.stringify(updated));
    window.dispatchEvent(new Event('lucky_chest_updated'));

    if (chestData.type === 'super') {
      setHighValueGiftNotice({
        sender: chestData.senderName,
        giftName: 'صندوق الحظ السوبر العالمي',
        giftIcon: '👑',
        targetName: currentRoomTitle,
        totalValue: chestData.coins
      });
      setTimeout(() => setHighValueGiftNotice(null), 10000);
    }
  };

  const handleClaimLuckyChestPrize = (chestId: string, wonAmt: number) => {
    try {
      const savedClaimed = JSON.parse(localStorage.getItem('claimed_lucky_chest_ids') || '[]');
      if (!savedClaimed.includes(chestId)) {
        savedClaimed.push(chestId);
        localStorage.setItem('claimed_lucky_chest_ids', JSON.stringify(savedClaimed));
      }
    } catch (e) {}

    const effectiveUserId = hostSeat.userId || '88492011';
    const updated = activeLuckyChests
      .map((c) => {
        if (c.id === chestId) {
          const alreadyClaimed = c.claimedBy.some((cl) => cl.userId === effectiveUserId);
          if (!alreadyClaimed) {
            const newClaimer = {
              userId: effectiveUserId,
              userName: hostSeat.userName || hostName || 'عابر سبيل',
              avatar: hostSeat.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
              wonAmount: wonAmt,
              claimedAt: Date.now()
            };
            const rem = Math.max(0, (c.remainingPortions ?? c.portions) - 1);
            return {
              ...c,
              remainingPortions: rem,
              claimedBy: [newClaimer, ...c.claimedBy]
            };
          }
        }
        return c;
      })
      // If all portions have been taken (e.g. 5, 15, or 20 people claimed it), it disappears completely!
      .filter((c) => (c.remainingPortions ?? (c.portions - c.claimedBy.length)) > 0);

    setActiveLuckyChests(updated);
    localStorage.setItem('super_legend_active_lucky_chests', JSON.stringify(updated));
    window.dispatchEvent(new Event('lucky_chest_updated'));

    const updatedChest = updated.find((c) => c.id === chestId);
    if (updatedChest) {
      setSelectedChestForClaim(updatedChest);
    }

    // Trigger gliding banners for all who took from this lucky chest ("جميع من اخذوا من هذا الصندوق")
    const winnerName = hostSeat.userName || hostName || 'عابر سبيل';
    const winnerAvatar = hostSeat.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200';
    const currentTargetChest = updatedChest || activeLuckyChests.find((c) => c.id === chestId);
    const chestType = currentTargetChest?.type || 'super';

    const myWinnerNotice: LuckyChestWinnerNoticeData = {
      id: `chest_win_${Date.now()}_${effectiveUserId}`,
      userName: winnerName,
      avatar: winnerAvatar,
      wonAmount: wonAmt,
      vipLevel: hostVipLevel || 8,
      nobleLevel: 'N1',
      isHost: isOwner,
      chestType: chestType,
    };

    setActiveLuckyChestWinnerNotice(myWinnerNotice);
    setLuckyChestWinnersQueue((prev) => [...prev, myWinnerNotice]);
  };

  // Finish / Stop Team Battle and Display Results
  const finishTeamBattleRound = () => {
    const winner: 'red' | 'blue' | 'draw' =
      redTeamScore > blueTeamScore ? 'red' : blueTeamScore > redTeamScore ? 'blue' : 'draw';

    const supportersArray: PKSupporter[] = Object.values(pkTopSupportersMap);
    supportersArray.sort((a, b) => b.coins - a.coins);

    const topSupporter: PKSupporter =
      supportersArray.length > 0 && supportersArray[0].coins > 0
        ? supportersArray[0]
        : {
            name: 'عابرسبيل',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
            coins: Math.max(redTeamScore, blueTeamScore) > 0 ? Math.max(redTeamScore, blueTeamScore) : 3500,
            team: redTeamScore >= blueTeamScore ? 'red' : 'blue'
          };

    setPkResultData({
      redScore: redTeamScore,
      blueScore: blueTeamScore,
      winner,
      topSupporter
    });
    setShowTeamBattleResultModal(true);

    // Reset scores & counters to zero and freeze state
    setRedTeamScore(0);
    setBlueTeamScore(0);
    setSeatCounters({});
    setPkTopSupportersMap({});
    setIsTeamBattleActive(false);
    setTeamBattleStatus('preparation');
    setTeamBattleTimer(15 * 60);
  };

  // Team Battle Countdown Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTeamBattleActive && teamBattleStatus === 'running' && teamBattleTimer > 0) {
      interval = setInterval(() => {
        setTeamBattleTimer((prev) => {
          if (prev <= 1) {
            finishTeamBattleRound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTeamBattleActive, teamBattleStatus, teamBattleTimer, redTeamScore, blueTeamScore, pkTopSupportersMap]);

  // Dynamic Dev Emoji Configurations synced in real-time (بدون تحميل مسبق ثقيل عند الدخول)
  const [emojiConfigs, setEmojiConfigs] = useState(() => getStoredEmojiConfigs());

  // مزامنة تعديلات الإيموجي دون أي تحميل مسبق ثقيل يستهلك المعالج أو الذاكرة
  useEffect(() => {
    const handleConfigUpdate = () => {
      setEmojiConfigs(getStoredEmojiConfigs());
    };
    window.addEventListener('lottie_config_updated', handleConfigUpdate);
    return () => window.removeEventListener('lottie_config_updated', handleConfigUpdate);
  }, []);
  const [showSuperLegendModal, setShowSuperLegendModal] = useState(false);
  const [showRoomSupportModal, setShowRoomSupportModal] = useState(false);

  // إحصائيات الدعم الكلي الشامل لمبالغ الدعم داخل الروم (Total Room Support Diamonds)
  const [totalRoomSupportDiamonds, setTotalRoomSupportDiamonds] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(`room_total_support_diamonds_${roomId}`);
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed >= 0 && parsed < 40000000) return parsed;
        // أرقام المحاكاة القديمة (48.5 مليون) يتم تصفيرها فوراً
        localStorage.setItem(`room_total_support_diamonds_${roomId}`, '0');
      }
    } catch (e) {}
    return 0; // تصفير كامل بدون أي محاكاة
  });

  // فحص وتنظيف قاطع لأي بقايا للأرقام الوهمية السابقة فور فتح الغرفة
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`room_total_support_diamonds_${roomId}`);
      if (saved && parseInt(saved, 10) >= 40000000) {
        localStorage.setItem(`room_total_support_diamonds_${roomId}`, '0');
        setTotalRoomSupportDiamonds(0);
      }
    } catch (e) {}
  }, [roomId]);

  const [leaderboardTheme, setLeaderboardTheme] = useState<LeaderboardThemeConfig>(() => getSavedLeaderboardTheme());
  const [showRoomInfoModal, setShowRoomInfoModal] = useState(false);
  const [showRoomBackgroundStoreModal, setShowRoomBackgroundStoreModal] = useState<boolean>(false);
  const [showYoHoMessagesModal, setShowYoHoMessagesModal] = useState<boolean>(false);
  const [privateChatTargetUser, setPrivateChatTargetUser] = useState<any | null>(null);
  const [currentRoomBgUrl, setCurrentRoomBgUrl] = useState<string>(() => {
    const cached = getCachedRoomState(roomId);
    return (
      cached?.wallpaperUrl ||
      'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=1200'
    );
  });

  // Progressive Hydration Pipeline & Ultra-Fast On-Demand Loading:
  // Phase 1: الصوت أولاً فوراً (Instant Audio Stream ⚡)
  // Phase 2: هيكل المايكات مع الأشخاص (Seats Layout & Structure 🎙️)
  // Phase 3: الشات والرسائل التفاعلية (Live Chat Stream 💬)
  // Phase 4: البروفايلات في المقاعد (Seat Profiles Hydration 👤)
  // Phase 5: الأشرطة المتحركة إن وجدت (Moving Tickers & Strips 🎟️)
  // Phase 6: خلفية الروم والفعاليات (Wallpaper Last 🖼️)
  const {
    isAudioReady,
    isSeatsReady,
    isChatReady,
    isProfilesHydrated,
    isTickersReady,
    isWallpaperReady,
    wallpaperCacheNotice
  } = useRoomProgressiveHydration(roomId, currentRoomBgUrl, currentRoomBgName);
  const [showHostProfileModal, setShowHostProfileModal] = useState(false);
  const [showAudienceModal, setShowAudienceModal] = useState(false);

  // Dynamic Context Menus & Action Sheets States
  const [selectedUserForProfile, setSelectedUserForProfile] = useState<UserProfileData | null>(null);
  const [showAdvancedProfileModal, setShowAdvancedProfileModal] = useState(false);
  const [showFullUserProfileModal, setShowFullUserProfileModal] = useState<boolean>(false);
  const [fullProfileUser, setFullProfileUser] = useState<UserProfileData | null>(null);
  const [selectedSeatForAction, setSelectedSeatForAction] = useState<number | null>(null);
  const [showSeatActionModal, setShowSeatActionModal] = useState(false);
  const [showQuickMicOptionsModal, setShowQuickMicOptionsModal] = useState(false);

  // Unified, Realistic Profile Opener: Guarantee that the ID, level, name, and avatar are 100% authentic and consistent everywhere
  const handleOpenUserProfileSafely = useCallback((userData: Partial<UserProfileData> & { userId?: string; seatId?: number }) => {
    const rawId = (userData.id || userData.userId || '').toString().trim();
    const rawName = (userData.name || '').trim();

    const isMe =
      rawId === myUserId ||
      rawId === CURRENT_USER_PROFILE_ID ||
      (Boolean(authUser?.id) && rawId === authUser?.id) ||
      rawName === myUserName.trim() ||
      rawName === 'أنا' ||
      rawName.includes('(أنا)') ||
      rawName === 'أنا (الداعم)' ||
      rawName === 'أنا (انضمام)' ||
      (rawName === 'مستخدم النجم' && !rawId);

    if (isMe) {
      setSelectedUserForProfile({
        id: myUserId,
        userId: myUserId,
        name: myUserName,
        avatar: myUserAvatar,
        country: authUser?.country || 'اليمن',
        countryFlag: authUser?.country === 'السعودية' ? '🇸🇦' : '🇾🇪',
        isHost: Boolean(isOwner || currentUserRole === 'host'),
        isOwner: Boolean(isOwner || myUserId === '1001001'),
        isSuperAdmin: Boolean(isOwner || myUserId === '1001001'),
        supporterLevel: myRealBadges.supporterLevel,
        charmLevel: myRealBadges.charmLevel,
        vipLevel: myRealBadges.vipLevel as any,
        sharesLevel: myRealBadges.sharesLevel,
        isMuted: isMyMicMuted,
        isMutedByAdmin: isMySeatMutedByAdmin,
        seatId: userData.seatId || myOccupiedSeat?.id || 1,
        vip: myRealBadges.vipLevel,
        level: myRealBadges.supporterLevel,
        bio: authUser?.bio || 'أهلاً بكم في ملفي الشخصي في تطبيق النجم 🌟',
        badges: [],
        followersCount: authUser?.followersCount || 120,
        followingCount: authUser?.followingCount || 45,
        sentGiftsCount: userData.sentGiftsCount ?? (authUser?.sentGiftsCount || 0),
        receivedGiftsCount: userData.receivedGiftsCount ?? (authUser?.receivedGiftsCount || 0)
      });
    } else {
      const realId = userData.userId || userData.id || `user_${rawName.replace(/\s+/g, '_')}`;
      setSelectedUserForProfile({
        id: realId,
        userId: realId,
        name: userData.name || 'مستخدم',
        avatar: userData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        country: userData.country || 'اليمن',
        countryFlag: userData.countryFlag || '🇾🇪',
        isHost: Boolean(userData.isHost),
        isMuted: Boolean(userData.isMuted),
        isMutedByAdmin: Boolean(userData.isMutedByAdmin),
        seatId: userData.seatId,
        vip: userData.vip || (typeof userData.vipLevel === 'number' ? `VIP${userData.vipLevel}` : (userData.vipLevel || 'VIP3')),
        vipLevel: typeof userData.vipLevel === 'number' ? userData.vipLevel : 3,
        level: userData.level || 1,
        bio: userData.bio || 'مستخدم مميز في تطبيق النجم 🌟',
        badges: userData.badges || [
          { id: 'b-guest', label: 'عضو مميز', icon: '⭐', bgClass: 'bg-white/10 text-white font-bold' }
        ],
        followersCount: userData.followersCount || 0,
        followingCount: userData.followingCount || 0,
        sentGiftsCount: userData.sentGiftsCount || 0,
        receivedGiftsCount: userData.receivedGiftsCount || 0
      });
    }
    setShowAdvancedProfileModal(true);
  }, [myUserId, myUserName, myUserAvatar, authUser, isOwner, currentUserRole, isMyMicMuted, isMySeatMutedByAdmin, myOccupiedSeat, myVipLevel]);

  // Synchronize user role with isOwnerProp whenever room changes
  useEffect(() => {
    setCurrentUserRole(isOwnerProp ? 'owner' : 'guest');
  }, [isOwnerProp]);

  // Synchronize Seat 1 host display name based on role and hostName
  useEffect(() => {
    setAllMicSeats((prev) =>
      prev.map((s) =>
        s.id === 1 && !s.isEmpty
          ? {
              ...s,
              userName: isOwnerProp ? (myUserName || hostName || 'أنا المالك 👑') : (s.userName || hostName || ''),
            }
          : s
      )
    );
  }, [hostName, isOwnerProp, myUserName]);

  // Security guard: Ensure mic control modal is automatically closed and inaccessible if user is not the owner
  useEffect(() => {
    if (!isOwner && showMicControlModal) {
      setShowMicControlModal(false);
    }
  }, [isOwner, showMicControlModal]);

  // Security guard: Ensure top options menu modal is automatically closed and completely inaccessible if user lacks Room Owner or Moderator privileges
  useEffect(() => {
    if (!isCurrentAdmin && showTopOptionsMenuModal) {
      setShowTopOptionsMenuModal(false);
    }
  }, [isCurrentAdmin, showTopOptionsMenuModal]);

  // Seat Request Queue State (نظام طلبات الصعود للمايك - يبدأ نظيفاً بدون طلبات وهمية)
  const [micRequests, setMicRequests] = useState<MicRequestItem[]>([]);
  const [showMicRequestsModal, setShowMicRequestsModal] = useState(false);
  const [invitedUserIds, setInvitedUserIds] = useState<string[]>([]);
  const [targetInviteSeatId, setTargetInviteSeatId] = useState<number | null>(null);
  const [pendingHostInvitation, setPendingHostInvitation] = useState<{
    user: { id: string; name: string; avatar?: string; role?: string; isHost?: boolean };
    seatId: number;
    inviterName: string;
  } | null>(null);

  // Hardware Back Button handler for Voice Room and its modals
  useEffect(() => {
    return backNavigation.registerHandler('voice_room_screen', 80, () => {
      // 1. If Exit Modal is open, close it
      if (showRoomExitModal) {
        setShowRoomExitModal(false);
        return;
      }
      // 2. If any inner drawer/modal is open, close that first
      if (showGiftDrawer) {
        setShowGiftDrawer(false);
        return;
      }
      if (showGamesDrawer) {
        setShowGamesDrawer(false);
        return;
      }
      if (showSettingsDrawer) {
        setShowSettingsDrawer(false);
        return;
      }
      if (showEmojiPicker) {
        setShowEmojiPicker(false);
        return;
      }
      if (showChatInputModal) {
        setShowChatInputModal(false);
        return;
      }
      if (showTopOptionsMenuModal) {
        setShowTopOptionsMenuModal(false);
        return;
      }
      if (showYoHoBottomToolsModal) {
        setShowYoHoBottomToolsModal(false);
        return;
      }
      if (showLuckyChestModal) {
        setShowLuckyChestModal(false);
        return;
      }
      if (showLuckyChestClaimModal) {
        setShowLuckyChestClaimModal(false);
        return;
      }
      if (showTeamBattleModal) {
        setShowTeamBattleModal(false);
        return;
      }
      if (showTeamBattleResultModal) {
        setShowTeamBattleResultModal(false);
        return;
      }
      if (showNormalRoundResultModal) {
        setShowNormalRoundResultModal(false);
        return;
      }
      if (showAudienceModal) {
        setShowAudienceModal(false);
        return;
      }
      if (showAdvancedProfileModal) {
        setShowAdvancedProfileModal(false);
        return;
      }
      if (showFullUserProfileModal) {
        setShowFullUserProfileModal(false);
        return;
      }
      if (showHostProfileModal) {
        setShowHostProfileModal(false);
        return;
      }
      if (showRoomInfoModal) {
        setShowRoomInfoModal(false);
        return;
      }
      if (showRoomSupportModal) {
        setShowRoomSupportModal(false);
        return;
      }
      if (showSuperLegendModal) {
        setShowSuperLegendModal(false);
        return;
      }
      if (showRoomBackgroundStoreModal) {
        setShowRoomBackgroundStoreModal(false);
        return;
      }
      if (showYoHoMessagesModal) {
        setShowYoHoMessagesModal(false);
        return;
      }
      if (showQuickMicOptionsModal) {
        setShowQuickMicOptionsModal(false);
        return;
      }
      if (showSeatActionModal) {
        setShowSeatActionModal(false);
        return;
      }
      if (showFamilyModal) {
        setShowFamilyModal(false);
        return;
      }
      if (showCinemaVideoPickerModal) {
        setShowCinemaVideoPickerModal(false);
        return;
      }
      if (showDevConfigModal) {
        setShowDevConfigModal(false);
        return;
      }
      if (showCounterControlModal) {
        setShowCounterControlModal(false);
        return;
      }
      if (showMusicPlayerModal) {
        setShowMusicPlayerModal(false);
        return;
      }
      if (showSoundEffectsModal) {
        setShowSoundEffectsModal(false);
        return;
      }
      if (showModeratorStatsModal) {
        setShowModeratorStatsModal(false);
        return;
      }
      if (showMicControlModal) {
        setShowMicControlModal(false);
        return;
      }

      // 3. If in full voice room with no modal open, open Room Exit modal
      setShowRoomExitModal(true);
    });
  }, [
    showRoomExitModal,
    showGiftDrawer,
    showGamesDrawer,
    showSettingsDrawer,
    showEmojiPicker,
    showChatInputModal,
    showTopOptionsMenuModal,
    showYoHoBottomToolsModal,
    showLuckyChestModal,
    showLuckyChestClaimModal,
    showTeamBattleModal,
    showTeamBattleResultModal,
    showNormalRoundResultModal,
    showAudienceModal,
    showAdvancedProfileModal,
    showFullUserProfileModal,
    showHostProfileModal,
    showRoomInfoModal,
    showRoomSupportModal,
    showSuperLegendModal,
    showRoomBackgroundStoreModal,
    showYoHoMessagesModal,
    showQuickMicOptionsModal,
    showSeatActionModal,
    showFamilyModal,
    showCinemaVideoPickerModal,
    showDevConfigModal,
    showCounterControlModal,
    showMusicPlayerModal,
    showSoundEffectsModal,
    showModeratorStatsModal,
    showMicControlModal
  ]);

  // تفريغ فوري لمقعد المايك عند خروج الشخص المستدعى أو أي متواجد من البث/الروم حتى لا يظل حسابه معلقاً
  const handleUserExitRoom = useCallback((userId: string, userName?: string) => {
    setAllMicSeats((prev) =>
      prev.map((seat) => {
        const matchesId = Boolean(seat.userId && seat.userId === userId);
        const matchesName = Boolean(
          userName &&
          seat.userName &&
          (seat.userName.trim().toLowerCase() === userName.trim().toLowerCase() ||
           seat.userName.includes(userName) ||
           userName.includes(seat.userName))
        );
        if (matchesId || matchesName) {
          return {
            ...seat,
            isEmpty: true,
            userId: undefined,
            userName: '',
            avatar: '',
            vipLevel: undefined,
            isHost: false,
            isMuted: false,
            isMutedByAdmin: false,
            isSpeaking: false,
            isInvitationPending: false,
            isPendingAudioAcceptance: false
          };
        }
        return seat;
      })
    );

    // إزالة المستخدم من قائمة المتواجدين في الروم
    setRoomAudienceList((prev) => prev.filter((u) => u.id !== userId));
    setInvitedUserIds((prev) => prev.filter((id) => id !== userId));
    setPendingHostInvitation((prev) => (prev?.user.id === userId ? null : prev));

    setToastNotification(`🚪 غادر ${userName || 'المستخدم'} الروم وتم إفراغ مقعد المايك تلقائياً`);
    setTimeout(() => setToastNotification(null), 3000);
  }, []);

  // مراقبة تلقائية: إذا خرج أي مستخدم من الروم وكان على المايك أو مستدعى، يزال حسابه فوراً من المايك
  useEffect(() => {
    setAllMicSeats((prev) => {
      let changed = false;
      const updated = prev.map((seat) => {
        if (seat.isEmpty || seat.isHost || seat.id === 1) return seat;
        if (seat.userId === CURRENT_USER_PROFILE_ID || seat.userName?.includes('أنا')) return seat;

        // إذا كان المقعد مشغولاً بشخص لم يعد متواجداً في قائمة المتواجدين بالروم
        if (seat.userId && !roomAudienceList.some((u) => u.id === seat.userId)) {
          changed = true;
          return {
            ...seat,
            isEmpty: true,
            userId: undefined,
            userName: '',
            avatar: '',
            vipLevel: undefined,
            isHost: false,
            isMuted: false,
            isMutedByAdmin: false,
            isSpeaking: false,
            isInvitationPending: false,
            isPendingAudioAcceptance: false
          };
        }
        return seat;
      });
      return changed ? updated : prev;
    });
  }, [roomAudienceList]);

  // Filter ONLY audience in chat / room who are NOT on any mic seat!
  const availableAudienceForInvite = useMemo(() => {
    return audienceAndChatMembers.filter((usr) => {
      // Check if user is currently occupying any mic (empty seats ignored)
      const isOnMic = allMicSeats.some((seat) => {
        if (seat.isEmpty) return false;
        if (seat.userId && seat.userId === usr.id) return true;
        if (seat.userName && usr.name) {
          const sName = seat.userName.trim().toLowerCase();
          const uName = usr.name.trim().toLowerCase();
          return sName === uName || sName.includes(uName) || uName.includes(sName);
        }
        return false;
      });

      // Filter out self/host
      const isHostSelf =
        Boolean(usr.name?.includes('أميرة')) ||
        Boolean(usr.name?.includes('المضيف')) ||
        Boolean(usr.name?.includes('أنا'));

      return !isOnMic && !isHostSelf;
    });
  }, [allMicSeats, audienceAndChatMembers]);

  // Active Mic Seats sliced dynamically according to activeMicCount
  const activeSeats = allMicSeats.slice(0, activeMicCount);

  // Dynamic Row Partitioning Logic for Presets (2, 5, 8, 9, 12, 15, 20)
  const getPresetRowLayout = (count: number): number[] => {
    switch (count) {
      case 2:
        return [2];
      case 5:
        return [1, 4];
      case 8:
        return [4, 4];
      case 9:
        return [1, 4, 4];
      case 12:
        return [2, 5, 5];
      case 15:
        return [5, 5, 5];
      case 20:
        return [5, 5, 5, 5];
      default:
        if (count <= 4) return [count];
        if (count <= 8) return [Math.ceil(count / 2), Math.floor(count / 2)];
        if (count <= 15) return [Math.ceil(count / 3), Math.ceil((count - Math.ceil(count / 3)) / 2), Math.floor((count - Math.ceil(count / 3)) / 2)];
        return [5, 5, 5, 5];
    }
  };

  const rowCounts = getPresetRowLayout(activeMicCount);
  const seatRows: MicSeat[][] = [];
  let currentSeatIdx = 0;
  for (const rc of rowCounts) {
    const row = activeSeats.slice(currentSeatIdx, currentSeatIdx + rc);
    if (row.length > 0) {
      seatRows.push(row);
    }
    currentSeatIdx += rc;
  }

  // Dynamic vertical spacing helper between mic rows:
  // Distributes ~0.5cm (~18px) upward expansion evenly across rows
  // ensuring the bottom-most row of mics remains exactly in place while lifting rows above it upwards.
  const getMicRowSpacingClass = (count: number) => {
    if (count === 20) return 'space-y-3 sm:space-y-3.5'; // 4 rows: 3 gaps of 12px (6px original + 6px extra = +18px total)
    if (count >= 9) return 'space-y-[15px] sm:space-y-4'; // 3 rows: 2 gaps of 15px (6px original + 9px extra = +18px total)
    if (count >= 5) return 'space-y-[22px] sm:space-y-6'; // 2 rows: 1 gap of 22px (6px original + 16px extra = +16px total)
    return 'space-y-2 sm:space-y-2.5';
  };

  // Handle Seat Click based on Seat State & User Permissions
  const handleSeatClick = (seatId: number) => {
    const targetSeat = allMicSeats.find((s) => s.id === seatId);
    if (!targetSeat) return;

    if (targetSeat.isInvitationPending) {
      // PENDING INVITATION SEAT: Open Seat Action Modal to accept & open mic, cancel, or view profile
      setSelectedSeatForAction(seatId);
      setTargetInviteSeatId(seatId);
      setShowSeatActionModal(true);
      return;
    }

    if (targetSeat.isEmpty) {
      const canClimbLockedSeat = isOwner || isCurrentAdmin || currentUserRole === 'host' || currentUserRole === 'moderator' || currentUserRole === 'owner';

      if (targetSeat.isLocked && !canClimbLockedSeat) {
        setToastNotification('عذراً! هذا المايك مغلق أو مقفل حالياً 🔒 لا يمكن الصعود عليه إلا بدعوة من الإدارة.');
        setTimeout(() => setToastNotification(null), 3000);
        return;
      }

      // إذا لم يكن المستخدم على أي مايك حالياً، فالضغط على المايك يصعده للمنصة مباشرة
      const isUserAlreadyOnMic = isOnMic || allMicSeats.some(isSeatMine);
      if (!isUserAlreadyOnMic && !targetSeat.isLocked) {
        handleAscendToPlatform(seatId);
        return;
      }

      // EMPTY SEAT: Show Seat Action Modal so user can invite audience, take seat, lock, etc.
      setSelectedSeatForAction(seatId);
      setTargetInviteSeatId(seatId);
      setShowSeatActionModal(true);
      return;
    }

    const isCurrentUserSeat =
      !targetSeat.isEmpty &&
      (isSeatMine(targetSeat) ||
        targetSeat.userId === myUserId ||
        targetSeat.userId === CURRENT_USER_PROFILE_ID ||
        (Boolean(authUser?.id) && targetSeat.userId === authUser?.id) ||
        targetSeat.userName === myUserName ||
        (targetSeat.isHost && isOwner));

    if (isCurrentUserSeat) {
      // Show Quick Mic & Host Options Modal (المستطيلات الثلاثة: الوقوف ومشاهدة، إهداء هدية، الملف الشخصي)
      setSelectedSeatForAction(seatId);
      setShowQuickMicOptionsModal(true);
      return;
    } else {
      // 3. OTHER USER'S SEAT / HOST: Show Advanced User Profile Modal
      setSelectedUserForProfile({
        id: targetSeat.userId || `user_seat_${targetSeat.id}`,
        userId: targetSeat.userId || `user_seat_${targetSeat.id}`,
        name: targetSeat.userName,
        avatar: targetSeat.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        country: 'اليمن',
        countryFlag: '🇾🇪',
        isHost: Boolean(targetSeat.isHost),
        isMuted: targetSeat.isMuted,
        isMutedByAdmin: targetSeat.isMutedByAdmin,
        seatId: targetSeat.id,
        vip: targetSeat.vipLevel || 'VIP 5',
        vipLevel: 5,
        level: 1,
        badges: [
          { id: 'b1', label: targetSeat.isHost ? 'المضيف 👑' : 'متحدث المايك', icon: '👑', bgClass: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black' },
          { id: 'b2', label: targetSeat.vipLevel || 'VIP 5', icon: '💎', bgClass: 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold' }
        ]
      });
      setShowAdvancedProfileModal(true);
    }
  };

  // Dedicated Mic Mute Toggle function for Current User Profile ID
  const handleToggleMyMic = async () => {
    // If the current user's seat is muted by an Admin / Owner (Profile-level / Admin mute lock active)
    if (isMySeatMutedByAdmin) {
      setToastNotification('🔒 تم كتم الميكروفون بقرار إداري. يُرجى إلغاء الكتم من نافذة الملف الشخصي / الإدارة حصراً');
      setTimeout(() => setToastNotification(null), 3200);
      return;
    }

    const nextMuted = !isMyMicMuted;
    
    // Enable real device mic capture or mute instantly
    if (!nextMuted) {
      if (firestoreRtcRef.current) {
        firestoreRtcRef.current.toggleMute(false);
      }
      if (voiceEngineRef.current) {
        voiceEngineRef.current.toggleMute(false);
        const ok = await voiceEngineRef.current.enableMicrophone();
        if (!ok && !firestoreRtcRef.current) {
          setToastNotification('يرجى السماح بصلاحية الميكروفون في المتصفح لبدء التحدث 🎙️');
          setTimeout(() => setToastNotification(null), 3000);
        }
      }
    } else {
      if (firestoreRtcRef.current) {
        firestoreRtcRef.current.toggleMute(true);
      }
      if (voiceEngineRef.current) {
        voiceEngineRef.current.toggleMute(true);
        voiceEngineRef.current.disableMicrophone();
      }
    }

    // Sync state in Firestore so peer devices see mute/unmute status
    const currentOccupiedSeat = allMicSeats.find(isSeatMine);
    if (currentOccupiedSeat) {
      toggleSeatMuteInFirestore(roomId || 'default-room', currentOccupiedSeat.id, nextMuted).catch(() => {});
    }

    setUserMuteStates((prev) => ({
      ...prev,
      [CURRENT_USER_PROFILE_ID]: nextMuted,
      [myUserId]: nextMuted,
      ...(authUser?.id ? { [authUser.id]: nextMuted } : {})
    }));
    if (currentOccupiedSeat) {
      setAllMicSeats((prev) =>
        updateSeatsStateCleanly(prev, {
          id: currentOccupiedSeat.id,
          isEmpty: false,
          userId: myUserId,
          userName: myUserName,
          avatar: myUserAvatar,
          vipLevel: myVipLevel,
          isHost: currentOccupiedSeat.isHost,
          isMuted: nextMuted,
          isMutedByAdmin: false,
          isSpeaking: false
        })
      );
    }
    setToastNotification(nextMuted ? '🔇 تم كتم الميكروفون' : '🎙️ تم فتح الميكروفون وبث الصوت الحقيقي!');
    setTimeout(() => setToastNotification(null), 2000);
  };

  // Helper function to switch seat atomically with clean disconnect of old seat
  const handleSwitchSeat = async (newSeatId: number) => {
    // 1. إيقاف الاتصال والتنظيف للمقعد القديم فوراً
    if (voiceEngineRef.current) {
      voiceEngineRef.current.leaveCurrentSeat(); // إغلاق الـ Stream والـ PeerConnection القديم
    }
    if (firestoreRtcRef.current) {
      firestoreRtcRef.current.leaveCurrentSeat();
    }

    const currentSeat = allMicSeats.find(isSeatMine);
    const currentSeatId = currentSeat?.id;

    // 2. تحديث الحالات محلياً لمنع التكرار
    setMyOccupiedSeat(newSeatId);

    // 3. تحديث Firestore للمقعد الجديد والقديم في عملية واحدة (Batch/Transaction)
    try {
      if (currentSeatId) {
        await switchRoomSeatInFirestore(roomId || 'default-room', currentSeatId, newSeatId, {
          userId: myUserId,
          userName: myUserName,
          avatar: myUserAvatar,
          vipLevel: myVipLevel,
          isMuted: isMyMicMuted,
          isSpeaking: false,
          isHost: isOwner && newSeatId === 1,
          peerId: firestoreRtcRef.current?.myPeerId
        });
      }
    } catch (error) {
      console.error("فشل نقل المقعد:", error);
    }

    handleTakeSeat(newSeatId);
  };

  // Helper function to sit down on seat or transfer between mic seats (Mic-to-Mic Counter Transfer Logic)
  // Advanced Mute Persistence:
  // If target seat was previously muted by Admin/Owner, occupant joins in a MUTED state with the red badge immediately.
  const handleTakeSeat = (targetSeatId: number) => {
    if (isTeamBattleActive) {
      setToastNotification('لا يمكن تحريك أو نقل المقاعد أثناء معركة الفريق 🛑');
      setTimeout(() => setToastNotification(null), 3000);
      return;
    }

    const targetSeat = allMicSeats.find((s) => s.id === targetSeatId);
    if (!targetSeat) return;

    setIsOnMic(true);

    // Strict Lock Validation:
    // Room Owner, Moderator, Agent, and Host can climb locked seats directly!
    const canClimbLockedSeat = isOwner || isCurrentAdmin || currentUserRole === 'host' || currentUserRole === 'moderator' || currentUserRole === 'owner';
    if (targetSeat.isLocked && !canClimbLockedSeat) {
      setToastNotification('عذراً! هذا المايك مغلق أو مقفل حالياً 🔒 لا يُسمح بالصعود عليه إلا بعد فتحه أو بدعوة من الإدارة.');
      setTimeout(() => setToastNotification(null), 3000);
      return;
    }

    const isTargetSlotAdminMuted = Boolean(targetSeat.isMutedByAdmin);

    // Check if current user is ALREADY sitting on another mic seat in the room
    const currentSeat = allMicSeats.find(isSeatMine);

    // Strict User Intent Mute Rule:
    // If moving between seats, preserve the current mic state.
    // If taking a fresh seat from the audience, microphone opens immediately to speak!
    const joinMuted = isTargetSlotAdminMuted || (currentSeat ? Boolean(currentSeat.isMuted) : false);
    const joinMutedByAdmin = isTargetSlotAdminMuted;

    setUserMuteStates((prev) => ({
      ...prev,
      [CURRENT_USER_PROFILE_ID]: joinMuted,
      [myUserId]: joinMuted,
      ...(authUser?.id ? { [authUser.id]: joinMuted } : {})
    }));

    // Update real-time voice engine seat and mute state immediately
    if (voiceEngineRef.current) {
      voiceEngineRef.current.updateSeat(targetSeatId);
      if (joinMuted) {
        voiceEngineRef.current.setMute(true);
        voiceEngineRef.current.disableMicrophone();
      } else {
        voiceEngineRef.current.setMute(false);
        voiceEngineRef.current.enableMicrophone();
      }
    }

    // Sync seat occupancy to Firestore for all mobile peers in a single transaction/batch
    if (currentSeat && currentSeat.id !== targetSeatId) {
      setMyOccupiedSeat(targetSeatId);
      switchRoomSeatInFirestore(roomId || 'default-room', currentSeat.id, targetSeatId, {
        userId: myUserId,
        userName: myUserName,
        avatar: myUserAvatar,
        vipLevel: myVipLevel,
        isMuted: joinMuted,
        isSpeaking: false,
        isHost: isOwner && targetSeatId === 1,
        peerId: firestoreRtcRef.current?.myPeerId
      }).catch((error) => {
        console.error("فشل نقل المقعد:", error);
      });
    } else if (!currentSeat) {
      setMyOccupiedSeat(targetSeatId);
      updateRoomSeatInFirestore(roomId || 'default-room', targetSeatId, {
        isEmpty: false,
        userId: myUserId,
        userName: myUserName,
        avatar: myUserAvatar,
        vipLevel: myVipLevel,
        isMuted: joinMuted,
        isSpeaking: false,
        isHost: isOwner && targetSeatId === 1,
        peerId: firestoreRtcRef.current?.myPeerId
      }).catch(() => {});
    }

    if (firestoreRtcRef.current) {
      firestoreRtcRef.current.seatId = targetSeatId;
      if (!joinMuted) {
        firestoreRtcRef.current.enableMicrophone().catch(() => {});
      } else {
        firestoreRtcRef.current.disableMicrophone();
      }
    }

    if (currentSeat && currentSeat.id !== targetSeatId) {
      // --- MIC-TO-MIC COUNTER TRANSFER LOGIC ---
      // In case of direct move between mics without completely stepping down off stage,
      // the counter retains its accumulated balance and transfers with the host to the new mic seat.
      const currentVal = seatCounters[currentSeat.id] || 0;

      setAllMicSeats((prev) =>
        updateSeatsStateCleanly(prev, {
          id: targetSeatId,
          isEmpty: false,
          userId: myUserId,
          userName: myUserName,
          avatar: myUserAvatar,
          vipLevel: myVipLevel,
          isHost: Boolean(isOwner || currentUserRole === 'host'),
          isMuted: joinMuted,
          isMutedByAdmin: joinMutedByAdmin,
          isSpeaking: false
        })
      );

      // Transfer accumulated counter value directly to the new seat & zero out the old vacant seat
      setSeatCounters((prev) => ({
        ...prev,
        [targetSeatId]: currentVal,
        [currentSeat.id]: 0
      }));

      setToastNotification(
        joinMuted
          ? `🔄 تم الانتقال للمايك #${targetSeatId} في وضع الكتم 🔇 (الميكروفون مغلق)`
          : `🔄 تم نقل المضيف ورصيد العداد (${formatCounterNumber(currentVal)}) تلقائياً من المايك #${currentSeat.id} إلى المايك #${targetSeatId}!`
      );
      setTimeout(() => setToastNotification(null), 3200);
    } else if (!currentSeat) {
      // --- FRESH JOIN FROM AUDIENCE ---
      // User takes the mic seat with instant microphone response
      setAllMicSeats((prev) =>
        updateSeatsStateCleanly(prev, {
          id: targetSeatId,
          isEmpty: false,
          userId: myUserId,
          userName: myUserName,
          avatar: myUserAvatar,
          vipLevel: myVipLevel,
          isHost: Boolean(isOwner || currentUserRole === 'host'),
          isMuted: joinMuted,
          isMutedByAdmin: joinMutedByAdmin,
          isSpeaking: false,
          isInvitationPending: false,
          isPendingAudioAcceptance: false
        })
      );

      // Initialize counter for fresh mic session
      setSeatCounters((prev) => ({
        ...prev,
        [targetSeatId]: 0
      }));

      setToastNotification(
        joinMuted
          ? `🎙️ تم صعود المايك #${targetSeatId} في وضع الكتم 🔇 (الميكروفون مغلق)`
          : `🎙️ تم صعود المايك #${targetSeatId} وفُتح الصوت مباشرة للحديث!`
      );
      setTimeout(() => setToastNotification(null), 2500);
    }
  };

  // Explicit Handler for 'طلب الصعود للمنصة' button
  const handleAscendToPlatform = (preferredSeatId?: number) => {
    setIsOnMic(true);
    let targetSeatId = preferredSeatId;
    if (!targetSeatId) {
      const firstEmpty = allMicSeats.slice(0, activeMicCount).find((s) => s.isEmpty && !s.isLocked);
      targetSeatId = firstEmpty ? firstEmpty.id : (isOwner ? 1 : 1);
    }
    handleTakeSeat(targetSeatId);
  };

  // Helper function to leave seat (Mic_Vacant_Event: Actual Counter Reset)
  // Preserves admin mute status on the empty slot if it was muted by admin
  const handleLeaveSeat = async (seatId?: number) => {
    const targetId = seatId || myOccupiedSeat?.id || selectedSeatForAction;

    // 1. تحديث UI محلياً فوراً لمنع تعليق الواجهة
    setIsOnMic(false);

    // 2. إيقاف الصوت والأجهزة محلياً
    if (voiceEngineRef.current) {
      voiceEngineRef.current.leaveCurrentSeat();
      voiceEngineRef.current.stopLocalAudioStream();
      voiceEngineRef.current.setMute(true);
    }

    if (firestoreRtcRef.current) {
      firestoreRtcRef.current.leaveCurrentSeat();
      firestoreRtcRef.current.stopLocalAudioStream();
    }

    // 3. تحديث Firestore مع ضمان التنظيف حتى لو فشل الطلب
    if (targetId) {
      try {
        await vacateRoomSeatInFirestore(roomId || 'default-room', targetId);
      } catch (error) {
        console.error("فشل تفريغ المقعد في السحابة:", error);
      }
    }

    setUserMuteStates((prev) => ({
      ...prev,
      [CURRENT_USER_PROFILE_ID]: true
    }));

    setAllMicSeats((prev) => {
      const seatsToVacate = prev.filter(
        (s) =>
          s.id === targetId ||
          s.userId === CURRENT_USER_PROFILE_ID ||
          s.userId === myUserId ||
          (Boolean(authUser?.id) && s.userId === authUser?.id) ||
          s.userName === myUserName ||
          Boolean(s.userName?.includes('أنا'))
      );

      // Reset counters ONLY when user completely steps down off-stage or leaves room (Mic_Vacant_Event)
      if (seatsToVacate.length > 0) {
        setSeatCounters((cnts) => {
          const next = { ...cnts };
          seatsToVacate.forEach((s) => {
            next[s.id] = 0;
          });
          return next;
        });
      }

      return prev.map((seat) => {
        if (
          seat.id === targetId ||
          seat.userId === CURRENT_USER_PROFILE_ID ||
          seat.userId === myUserId ||
          (Boolean(authUser?.id) && seat.userId === authUser?.id) ||
          seat.userName === myUserName ||
          Boolean(seat.userName?.includes('أنا'))
        ) {
          // If the seat was admin-muted, the empty slot permanently preserves the muted red badge
          const shouldKeepAdminMute = Boolean(seat.isMutedByAdmin);
          return {
            ...seat,
            isEmpty: true,
            userId: undefined,
            userName: '',
            avatar: '',
            isHost: false,
            isMuted: shouldKeepAdminMute,
            isMutedByAdmin: shouldKeepAdminMute,
            isSpeaking: false
          };
        }
        return seat;
      });
    });

    setRoomAudienceList((prev) => {
      if (prev.some((a) => a.id === myUserId)) return prev;
      return [
        {
          id: myUserId,
          name: myUserName,
          avatar: myUserAvatar,
          role: isOwner ? 'المالك 👑' : 'مستمع حاضر 🎧',
          level: 'Lv.88',
          vip: myVipLevel
        },
        ...prev
      ];
    });

    setToastNotification('👋 تم النزول من المنصة والعودة إلى قائمة المستمعين');
    setTimeout(() => setToastNotification(null), 2500);
  };

  // Helper function to toggle seat mute state (Permission Hierarchy: Owner/Admin override, Empty slot attachment)
  const handleToggleMuteSeat = (seatId: number, forcedByAdmin?: boolean, silent?: boolean) => {
    const targetSeat = allMicSeats.find((s) => s.id === seatId);
    if (!targetSeat) return;

    // Check if target seat is empty (Empty Slot Muting by Admin/Owner)
    if (targetSeat.isEmpty) {
      if (!isCurrentAdmin && !isOwner) {
        setToastNotification('كتم أو فتح مقاعد المايك الشاغرة متاح للمشرفين والمالك فقط 🔒');
        setTimeout(() => setToastNotification(null), 2500);
        return;
      }
      const nextMuted = !targetSeat.isMutedByAdmin;
      setAllMicSeats((prev) =>
        prev.map((seat) => {
          if (seat.id === seatId) {
            return {
              ...seat,
              isMuted: nextMuted,
              isMutedByAdmin: nextMuted,
              isSpeaking: false
            };
          }
          return seat;
        })
      );
      toggleSeatMuteInFirestore(roomId || 'default-room', seatId, nextMuted).catch(() => {});
      setToastNotification(
        nextMuted
          ? `🔇 تم كتم مقعد المايك #${seatId} إدارياً (تثبيت علامة الكتم الحمراء)`
          : `🎙️ تم إلغاء كتم مقعد المايك #${seatId} الشاغر`
      );
      setTimeout(() => setToastNotification(null), 2500);
      return;
    }

    // Check if target seat belongs to the current user (Self-Mute)
    const isSelfSeat = isSeatMine(targetSeat);

    // Strict Room Owner Authority Protection:
    // If target seat is Host/Room Owner and not self, a moderator or guest cannot mute or unmute the owner.
    const isTargetOwner = targetSeat.isHost || targetSeat.id === 1 || Boolean(targetSeat.userName?.includes('المضيف')) || Boolean(targetSeat.userName?.includes('أميرة الشرق'));
    if (isTargetOwner && !isSelfSeat && (currentUserRole === 'moderator' || currentUserRole === 'host' || currentUserRole === 'guest')) {
      setToastNotification('لا تملك صلاحية تعديل أو إلغاء كتم ميكروفون مالك الغرفة 👑');
      setTimeout(() => setToastNotification(null), 2500);
      return;
    }

    // If regular user has no admin privileges and is trying to mute other users, prevent it
    if (!isCurrentAdmin && !isOwner && !isSelfSeat) {
      setToastNotification('لا تملك صلاحيات إدارية للتحكم بميكروفونات الغرفة 🔒');
      setTimeout(() => setToastNotification(null), 2500);
      return;
    }

    const targetUserId = isSelfSeat
      ? (myUserId || CURRENT_USER_PROFILE_ID)
      : (targetSeat.userId || `user_seat_${targetSeat.id}`);

    const currentMuted = targetUserId in userMuteStates ? userMuteStates[targetUserId] : Boolean(targetSeat.isMuted);
    const nextMuted = !currentMuted;
    const isByAdmin = forcedByAdmin !== undefined ? (nextMuted ? forcedByAdmin : false) : (nextMuted ? (isCurrentAdmin || isOwner) : false);

    // Store mute status against the user's unique profile ID in the session state
    setUserMuteStates((prev) => ({
      ...prev,
      [targetUserId]: nextMuted,
      [CURRENT_USER_PROFILE_ID]: isSelfSeat ? nextMuted : prev[CURRENT_USER_PROFILE_ID],
      [myUserId]: isSelfSeat ? nextMuted : prev[myUserId]
    }));

    // Update real-time voice engine immediately if toggling self seat
    if (isSelfSeat) {
      if (voiceEngineRef.current) {
        voiceEngineRef.current.setMute(nextMuted);
        if (!nextMuted) {
          voiceEngineRef.current.enableMicrophone();
        } else {
          voiceEngineRef.current.disableMicrophone();
        }
      }
      if (firestoreRtcRef.current) {
        if (!nextMuted) {
          firestoreRtcRef.current.enableMicrophone().catch(() => {});
        } else {
          firestoreRtcRef.current.disableMicrophone();
        }
      }
    }

    // Update Firestore mute field cleanly without overwriting user data
    toggleSeatMuteInFirestore(roomId || 'default-room', seatId, nextMuted).catch(() => {});

    setAllMicSeats((prev) =>
      updateSeatsStateCleanly(prev, {
        id: seatId,
        isEmpty: targetSeat.isEmpty,
        userId: targetSeat.userId,
        userName: targetSeat.userName,
        avatar: targetSeat.avatar,
        vipLevel: targetSeat.vipLevel,
        isHost: targetSeat.isHost,
        isMuted: nextMuted,
        isMutedByAdmin: isByAdmin,
        isSpeaking: false
      })
    );

    if (!silent && !showQuickMicOptionsModal) {
      setToastNotification(
        nextMuted
          ? (isByAdmin ? `🔇 تم كتم ${targetSeat.userName} بقرار إداري` : `🔇 تم كتم ميكروفون ${targetSeat.userName}`)
          : `🎙️ تم إلغاء كتم ميكروفون ${targetSeat.userName}`
      );
      setTimeout(() => setToastNotification(null), 2500);
    }
  };

  // Helper function to lock or unlock seat
  const handleToggleLockSeat = (seatId: number) => {
    if (isTeamBattleActive) {
      setToastNotification('لا يمكن قفل أو فتح المقاعد أثناء معركة الفريق 🛑');
      setTimeout(() => setToastNotification(null), 3000);
      return;
    }
    setAllMicSeats((prev) =>
      prev.map((seat) => {
        if (seat.id === seatId) {
          return { ...seat, isLocked: !seat.isLocked };
        }
        return seat;
      })
    );
  };

  // Helper function to remove user from mic (move down to audience - Mic_Vacant_Event)
  // Preserves seat lock state (وعند نزول المضيف يبقى المايك مغلقاً) and admin-mute
  const handleRemoveFromMic = (seatId: number, customModName?: string) => {
    if (isTeamBattleActive) {
      setToastNotification('لا يمكن إنزال أو تحريك المقاعد أثناء معركة الفريق 🛑');
      setTimeout(() => setToastNotification(null), 3000);
      return;
    }
    const targetSeat = allMicSeats.find((s) => s.id === seatId);
    const removedName = targetSeat?.userName || `المقعد #${seatId}`;
    const modName = customModName || (isOwner ? 'المالك (أميرة الشرق)' : 'المشرف عابر');

    setAllMicSeats((prev) =>
      prev.map((seat) => {
        if (seat.id === seatId) {
          const shouldKeepAdminMute = Boolean(seat.isMutedByAdmin);
          return {
            ...seat,
            isEmpty: true,
            userId: undefined,
            userName: '',
            avatar: '',
            isHost: false,
            isMuted: shouldKeepAdminMute,
            isMutedByAdmin: shouldKeepAdminMute,
            isSpeaking: false
            // isLocked is strictly preserved as-is!
          };
        }
        return seat;
      })
    );

    // Reset counter for that seat upon actual vacating/stepping down (Mic_Vacant_Event)
    setSeatCounters((prev) => ({
      ...prev,
      [seatId]: 0
    }));

    // Record action in supervisor statistics log
    if (targetSeat && !targetSeat.isEmpty) {
      recordModeratorAction({
        moderatorName: modName,
        moderatorAvatar: isOwner
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
        moderatorRole: isOwner ? 'owner' : 'moderator',
        targetUserName: removedName,
        targetUserAvatar: targetSeat.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        targetSeatId: seatId,
        actionType: 'drop_mic',
        actionTitle: 'إنزال من المايك',
        description: `${modName} قام بإنزال ${removedName} من المايك #${seatId}`,
        reason: 'إفساح المقعد للمتحدثين'
      });

      // Mic descent/drop intentionally silent in chat per user requirement
    }

    setToastNotification(`⬇️ ${modName} قام بإنزال ${removedName} من المايك #${seatId}`);
    setTimeout(() => setToastNotification(null), 3000);
  };

  // Direct & Silent Host / Audience Mic Invitation (دعوة المضيف وظهور صورته فوراً مع فتح الصوت بعد الموافقة)
  const handleDirectInviteToMic = (
    user: { id: string; name: string; avatar?: string; role?: string; isHost?: boolean; vip?: string | number; vipLevel?: string | number },
    preferredSeatId?: number | null
  ) => {
    // التحقق من الصلاحيات: المضيف العادي لا يحق له تصعيد أي شخص إلى المايك. الصلاحية للمشرف أو صاحب الروم فقط
    const canEscalateToMic = isOwner || isCurrentAdmin || currentUserRole === 'owner' || currentUserRole === 'moderator';
    if (!canEscalateToMic) {
      setToastNotification('عذراً! المضيف العادي لا يحق له تصعيد أي شخص إلى المايك. هذه الصلاحية للمشرف الذي لديه صلاحية أو صاحب الروم فقط 🛑');
      setTimeout(() => setToastNotification(null), 3200);
      return;
    }

    // 1. Strictly identify the exact requested seat ID
    const desiredSeatId = preferredSeatId ?? targetInviteSeatId ?? selectedSeatForAction;

    let targetSeatId: number | undefined;

    if (desiredSeatId != null) {
      const targetSeatObj = allMicSeats.find((s) => s.id === desiredSeatId);
      if (!targetSeatObj) {
        setToastNotification(`عذراً! رقم المايك #${desiredSeatId} غير متوفر في الروم.`);
        setTimeout(() => setToastNotification(null), 2500);
        return;
      }

      // Check if target seat is already occupied by a different active speaker
      const isOccupiedByOther =
        !targetSeatObj.isEmpty &&
        !targetSeatObj.isInvitationPending &&
        targetSeatObj.userId !== user.id;

      if (isOccupiedByOther) {
        setToastNotification(`عذراً! المايك #${desiredSeatId} مشغول حالياً بـ (${targetSeatObj.userName}) 🎙️. تم إلغاء الدعوة لمنع الارتداد لمايك آخر.`);
        setTimeout(() => setToastNotification(null), 3200);
        return;
      }

      // Exact seat match - never bounce to another seat!
      targetSeatId = desiredSeatId;

      // Expand active mic count if the invited seat is outside the current active slice (e.g. mic 15 or 20)
      if (targetSeatId > activeMicCount) {
        setActiveMicCount(Math.min(24, Math.max(targetSeatId, activeMicCount)));
      }
    } else {
      // ONLY fallback to first available empty seat if NO specific seat was ever selected
      const firstAvailableSeat = allMicSeats
        .slice(0, activeMicCount)
        .find((s) => s.isEmpty || s.isInvitationPending);
      if (firstAvailableSeat) {
        targetSeatId = firstAvailableSeat.id;
      }
    }

    if (!targetSeatId) {
      setToastNotification('جميع مقاعد المايك ممتلئة حالياً 🛑');
      setTimeout(() => setToastNotification(null), 2500);
      return;
    }

    const assignedSeatId = targetSeatId;

    // 1. Instantly place user on assignedSeatId with their photo/avatar and name, with yellow mic visible to everyone
    const inviterTitle = hostSeat?.userName || hostName || (isOwner ? 'أبو أمجد' : 'المشرف');

    setAllMicSeats((prev) =>
      prev.map((seat) => {
        if (seat.id === assignedSeatId) {
          return {
            ...seat,
            isEmpty: false, // Visible to everyone that the user is on the mic!
            userId: user.id,
            userName: user.name,
            avatar: user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
            vipLevel: (user as any).vipLevel ?? (user as any).vip ?? seat.vipLevel,
            isHost: false,
            isMuted: true, // Muted initially until accepted (لا يصدر صوت)
            isMutedByAdmin: false,
            isSpeaking: false,
            isInvitationPending: true, // Yellow mic indicator stays visible until approved (إشارة المايك الصفراء)
            isPendingAudioAcceptance: true,
            inviterName: inviterTitle
          };
        }
        return seat;
      })
    );

    // Track invited users
    if (!invitedUserIds.includes(user.id)) {
      setInvitedUserIds((prev) => [...prev, user.id]);
    }

    // Reset/init counter for fresh mic session on that exact seat
    setSeatCounters((prev) => ({
      ...prev,
      [assignedSeatId]: 0
    }));

    // Trigger acceptance prompt strictly as a private invite for the invited user
    setPendingHostInvitation({
      user,
      seatId: assignedSeatId,
      inviterName: inviterTitle
    });

    // Close source modals immediately and reset (chat stays completely clean without public spam)
    setShowAudienceModal(false);
    setShowSeatActionModal(false);
    setSelectedSeatForAction(null);
    setTargetInviteSeatId(null);

    setToastNotification(`🎙️ لقد دعاك ${inviterTitle} إلى المايك #${assignedSeatId}`);
    setTimeout(() => setToastNotification(null), 3000);
  };

  // Handle Accept Invitation -> Unmutes audio & activates voice stream!
  const handleAcceptHostInvitation = async () => {
    if (!pendingHostInvitation) return;
    const { user, seatId } = pendingHostInvitation;

    // Activate microphone and real-time audio broadcast
    if (voiceEngineRef.current) {
      voiceEngineRef.current.updateSeat(seatId);
      await voiceEngineRef.current.enableMicrophone();
      voiceEngineRef.current.setMute(false);
    }

    setUserMuteStates((prev) => ({
      ...prev,
      [user.id]: false,
      [CURRENT_USER_PROFILE_ID]: false
    }));

    setAllMicSeats((prev) =>
      prev.map((seat) => {
        if (seat.id === seatId) {
          return {
            ...seat,
            isEmpty: false, // Officially ascends to the mic!
            userId: user.id,
            userName: user.name,
            avatar: user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
            vipLevel: (user as any).vipLevel ?? (user as any).vip ?? seat.vipLevel,
            isMuted: false, // Open voice mic upon approval! (يصدر الصوت الآن)
            isSpeaking: false,
            isInvitationPending: false,
            isPendingAudioAcceptance: false
          };
        }
        return seat;
      })
    );

    setPendingHostInvitation(null);
    setToastNotification(`🎉 صعد ${user.name} للمايك #${seatId} وفُتح الميكروفون وبدأ بث الصوت بنجاح! 🎙️`);
    setTimeout(() => setToastNotification(null), 3500);
  };

  // Handle Reject/Decline Invitation -> Removes occupant & empties seat
  const handleRejectHostInvitation = () => {
    if (!pendingHostInvitation) return;
    const { user, seatId } = pendingHostInvitation;

    setAllMicSeats((prev) =>
      prev.map((seat) => {
        if (seat.id === seatId) {
          return {
            ...seat,
            isEmpty: true,
            userId: undefined,
            userName: '',
            avatar: '',
            isHost: false,
            isMuted: false,
            isMutedByAdmin: false,
            isSpeaking: false,
            isInvitationPending: false,
            isPendingAudioAcceptance: false
          };
        }
        return seat;
      })
    );

    setInvitedUserIds((prev) => prev.filter((id) => id !== user.id));
    setPendingHostInvitation(null);
    setToastNotification(`❌ تم إلغاء دعوة صعود المايك #${seatId}`);
    setTimeout(() => setToastNotification(null), 2500);
  };

  // Helper function to kick user from room and log into moderator statistics
  const handleKickFromRoom = (user: UserProfileData) => {
    // 1. VIP 5+ Protection: users with VIP 5 or above are strictly immune from kick!
    const userVipNum = typeof user.vip === 'number'
      ? user.vip
      : (typeof user.vip === 'string' ? parseInt(user.vip.replace(/\D/g, '') || '0', 10) : 0);

    const kickImmunity = isUserImmuneFromKick(user);
    if (kickImmunity.immune) {
      setToastNotification(kickImmunity.reason || `🛡️ لا يمكن طرد ${user.name} لأن لديه حماية VIP 5 فما فوق!`);
      setTimeout(() => setToastNotification(null), 3500);
      return;
    }

    // 2. Moderator Permission Check: Moderator must have explicit kick permission from room owner
    if (!isOwner && !isDev) {
      const hasKickPerm = getModeratorKickPermission('current_mod_id');
      if (!hasKickPerm) {
        setToastNotification('⛔ المشرف يحق له الطرد فقط إذا منحه مالك الروم الصلاحية!');
        setTimeout(() => setToastNotification(null), 3500);
        return;
      }
    }

    const kickerName = isOwner ? 'مالك الروم' : (isDev ? 'المبرمج' : 'مشرف الروم');

    // 3. Register 24-hour ban in roomKickService
    banUserFromRoom({
      userId: user.userId || user.id,
      name: user.name,
      avatar: user.avatar,
      vipLevel: userVipNum,
      vipLabel: typeof user.vip === 'string' ? user.vip : (user.vip ? `VIP ${user.vip}` : undefined),
      bannedBy: kickerName,
      bannedByRole: isOwner ? 'owner' : (isDev ? 'developer' : 'moderator')
    });

    // 4. Record into supervisor statistics audit
    recordModeratorAction({
      moderatorName: kickerName,
      moderatorAvatar: isOwner
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      moderatorRole: isOwner ? 'owner' : 'moderator',
      targetUserName: user.name || 'العضو',
      targetUserAvatar: user.avatar,
      targetSeatId: user.seatId,
      actionType: 'kick_room',
      actionTitle: 'طرد من الغرفة',
      description: `${kickerName} قام بطرد ${user.name} من الغرفة (حظر 24 ساعة)`,
      reason: 'مخالفة آداب وقوانين الروم'
    });

    // 5. If occupying a mic seat or invited, clear seat completely and remove from room
    setAllMicSeats((prev) =>
      prev.map((seat) => {
        const matchesId = Boolean(
          (user.userId && seat.userId === user.userId) ||
          (user.id && seat.userId === user.id) ||
          (user.seatId && seat.id === user.seatId)
        );
        const matchesName = Boolean(
          user.name && seat.userName && seat.userName.trim().toLowerCase() === user.name.trim().toLowerCase()
        );
        if (matchesId || matchesName) {
          return {
            ...seat,
            isEmpty: true,
            userId: undefined,
            userName: '',
            avatar: '',
            vipLevel: undefined,
            isHost: false,
            isMuted: false,
            isMutedByAdmin: false,
            isSpeaking: false,
            isInvitationPending: false,
            isPendingAudioAcceptance: false
          };
        }
        return seat;
      })
    );
    setRoomAudienceList((prev) => prev.filter((u) => u.id !== user.id && u.id !== user.userId));
    setInvitedUserIds((prev) => prev.filter((id) => id !== user.id && id !== user.userId));
    setPendingHostInvitation((prev) => (prev?.user.id === user.id || prev?.user.id === user.userId ? null : prev));

    // 6. Broadcast red notification message in chat: "خالد قام بطرد سارة"
    const kickChatMsg: ChatMessage = {
      id: `chat-kick-${Date.now()}-${Math.random()}`,
      userName: kickerName,
      text: `${kickerName} قام بطرد ${user.name}`,
      avatar: isOwner
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      userColor: '#EF4444'
    };
    setChatMessages((prev) => [...prev, kickChatMsg]);

    setToastNotification(`🚪 ${kickerName} قام بطرد ${user.name} من الغرفة (مهلة 24 ساعة)`);
    setTimeout(() => setToastNotification(null), 3500);
  };

  // Helper function to move/swap any host or user between mic seats while preserving & transferring counter balance
  const handleMoveUserSeat = (fromSeatId: number, toSeatId: number) => {
    if (isTeamBattleActive) {
      setToastNotification('لا يمكن نقل أو تحريك المقاعد أثناء معركة الفريق 🛑');
      setTimeout(() => setToastNotification(null), 3000);
      return;
    }
    const sourceSeat = allMicSeats.find((s) => s.id === fromSeatId);
    const targetSeat = allMicSeats.find((s) => s.id === toSeatId);
    if (!sourceSeat || sourceSeat.isEmpty || !targetSeat) return;

    const sourceCounter = seatCounters[fromSeatId] || 0;
    const targetCounter = seatCounters[toSeatId] || 0;

    if (targetSeat.isEmpty) {
      if (targetSeat.isLocked) {
        setToastNotification('عذراً! المايك المستهدف مغلق أو مقفل حالياً 🔒 لا يمكن الانتقال إليه.');
        setTimeout(() => setToastNotification(null), 3000);
        return;
      }

      // Direct Move to Empty Seat
      setAllMicSeats((prev) =>
        prev.map((s) => {
          if (s.id === fromSeatId) {
            return { ...s, isEmpty: true, userName: '', avatar: '', isHost: false };
          }
          if (s.id === toSeatId) {
            return {
              ...s,
              isEmpty: false,
              userName: sourceSeat.userName,
              avatar: sourceSeat.avatar,
              isHost: sourceSeat.isHost,
              isMuted: sourceSeat.isMuted,
              isSpeaking: sourceSeat.isSpeaking
            };
          }
          return s;
        })
      );

      setSeatCounters((prev) => ({
        ...prev,
        [toSeatId]: sourceCounter,
        [fromSeatId]: 0
      }));

      setToastNotification(
        `🔄 تم نقل المضيف ${sourceSeat.userName} ورصيد العداد (${formatCounterNumber(sourceCounter)}) من المايك #${fromSeatId} إلى المايك #${toSeatId}!`
      );
      setTimeout(() => setToastNotification(null), 3200);
    } else {
      // Swap Seats Between Two Users
      setAllMicSeats((prev) =>
        prev.map((s) => {
          if (s.id === fromSeatId) {
            return {
              ...s,
              userName: targetSeat.userName,
              avatar: targetSeat.avatar,
              isHost: targetSeat.isHost,
              isMuted: targetSeat.isMuted,
              isSpeaking: targetSeat.isSpeaking
            };
          }
          if (s.id === toSeatId) {
            return {
              ...s,
              userName: sourceSeat.userName,
              avatar: sourceSeat.avatar,
              isHost: sourceSeat.isHost,
              isMuted: sourceSeat.isMuted,
              isSpeaking: sourceSeat.isSpeaking
            };
          }
          return s;
        })
      );

      setSeatCounters((prev) => ({
        ...prev,
        [toSeatId]: sourceCounter,
        [fromSeatId]: targetCounter
      }));

      setToastNotification(
        `🔄 تم تبديل المايكات ونقل العدادات المتبادلة بين المايك #${fromSeatId} والمايك #${toSeatId}!`
      );
      setTimeout(() => setToastNotification(null), 3200);
    }
  };

  // Helper function to approve mic request from queue
  const handleApproveMicRequest = (req: MicRequestItem) => {
    if (isTeamBattleActive) {
      setToastNotification('لا يمكن قبول طلبات المايك أثناء معركة الفريق 🛑');
      setTimeout(() => setToastNotification(null), 3000);
      return;
    }
    if (currentUserRole === 'host' || currentUserRole === 'guest') {
      setToastNotification('عذراً، قبول أو رفض طلبات المايك محصور لمالك الروم والمشرفين فقط ⛔');
      setTimeout(() => setToastNotification(null), 3000);
      return;
    }

    const emptySeat = allMicSeats.find((s) => s.isEmpty && !s.isLocked);
    if (!emptySeat) {
      setToastNotification('جميع المقاعد ممتلئة أو مقفلة حالياً!');
      setTimeout(() => setToastNotification(null), 3000);
      return;
    }

    setAllMicSeats((prev) =>
      prev.map((s) => {
        if (s.id === emptySeat.id) {
          return {
            ...s,
            isEmpty: false,
            userName: req.userName,
            avatar: req.avatar,
            isMuted: s.isMuted,
            isSpeaking: false
          };
        }
        return s;
      })
    );

    setMicRequests((prev) => prev.filter((item) => item.id !== req.id));
    setToastNotification(`تم قبول ${req.userName} وصعوده على المايك رقم (${emptySeat.id})! 🎙️`);
    setTimeout(() => setToastNotification(null), 3000);
  };

  // Helper function to reject mic request from queue
  const handleRejectMicRequest = (requestId: string) => {
    if (currentUserRole === 'host' || currentUserRole === 'guest') {
      setToastNotification('عذراً، قبول أو رفض طلبات المايك محصور لمالك الروم والمشرفين فقط ⛔');
      setTimeout(() => setToastNotification(null), 3000);
      return;
    }

    setMicRequests((prev) => prev.filter((item) => item.id !== requestId));
  };

  // Helper function to approve all mic requests
  const handleApproveAllMicRequests = () => {
    if (isTeamBattleActive) {
      setToastNotification('لا يمكن قبول طلبات المايك أثناء معركة الفريق 🛑');
      setTimeout(() => setToastNotification(null), 3000);
      return;
    }
    if (currentUserRole === 'host' || currentUserRole === 'guest') {
      setToastNotification('عذراً، قبول أو رفض طلبات المايك محصور لمالك الروم والمشرفين فقط ⛔');
      setTimeout(() => setToastNotification(null), 3000);
      return;
    }

    const emptySeats = allMicSeats.filter((s) => s.isEmpty && !s.isLocked);
    if (emptySeats.length === 0) {
      setToastNotification('لا توجد مقاعد فارغة حالياً!');
      setTimeout(() => setToastNotification(null), 3000);
      return;
    }

    const toApprove = micRequests.slice(0, emptySeats.length);
    const approvedIds = new Set(toApprove.map((r) => r.id));

    setAllMicSeats((prev) => {
      let seatIdx = 0;
      return prev.map((s) => {
        if (s.isEmpty && !s.isLocked && seatIdx < toApprove.length) {
          const req = toApprove[seatIdx];
          seatIdx++;
          return {
            ...s,
            isEmpty: false,
            userName: req.userName,
            avatar: req.avatar,
            isMuted: s.isMuted,
            isSpeaking: false
          };
        }
        return s;
      });
    });

    setMicRequests((prev) => prev.filter((r) => !approvedIds.has(r.id)));
    setToastNotification(`تم قبول ${toApprove.length} طلبات صعود على المايك بنجاح! 🎙️`);
    setTimeout(() => setToastNotification(null), 3000);
  };

  // Helper function to clear all mic requests
  const handleClearAllMicRequests = () => {
    if (currentUserRole === 'host' || currentUserRole === 'guest') {
      setToastNotification('عذراً، قبول أو رفض طلبات المايك محصور لمالك الروم والمشرفين فقط ⛔');
      setTimeout(() => setToastNotification(null), 3000);
      return;
    }

    setMicRequests([]);
    setToastNotification('تم مسح جميع طلبات الصعود للمايك');
    setTimeout(() => setToastNotification(null), 3000);
  };

  // User submits request to get on mic
  const handleRequestMicFromUser = () => {
    const isOnStage = allMicSeats.some((s) => !s.isEmpty && (Boolean(s.userName?.includes('أنا')) || Boolean(s.userName?.includes('انضمام'))));
    if (isOnStage) {
      setToastNotification('أنت موجود بالفعل على أحد المايكات! 🎙️');
      setTimeout(() => setToastNotification(null), 3000);
      return;
    }

    const alreadyInQueue = micRequests.some((r) => Boolean(r.userName?.includes('أنا')));
    if (alreadyInQueue) {
      setToastNotification('طلبك موجود بالفعل في طابور انتظار الإدارة! ✋');
      setTimeout(() => setToastNotification(null), 3000);
      return;
    }

    const newReq: MicRequestItem = {
      id: `req-${Date.now()}`,
      userName: 'أنا (طلب جديد)',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      level: 'Lv.70',
      vip: 'VIP 6',
      timeAgo: 'الآن'
    };

    setMicRequests((prev) => [newReq, ...prev]);
    setToastNotification('تم إرسال طلب الصعود للمايك بنجاح للإدارة! ✋');
    setTimeout(() => setToastNotification(null), 3000);
  };

  // Toggle Host Gender between Male (♂ Blue) and Female (♀ Pink) in Chat Feed
  const handleToggleHostGender = (messageId: string) => {
    setChatMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          const currentGender =
            msg.userGender ||
            (Boolean(msg.userName?.includes('أميرة')) || Boolean(msg.userName?.includes('مضيفة')) ? 'female' : 'male');
          const nextGender: 'male' | 'female' = currentGender === 'female' ? 'male' : 'female';
          const nextAge = nextGender === 'female' ? 24 : 29;
          setToastNotification(
            nextGender === 'female'
              ? 'تم تحويل إشارة المضيف إلى: أنثى ♀ (كبسولة وردية) 🌸'
              : 'تم تحويل إشارة المضيف إلى: ذكر ♂ (كبسولة زرقاء) 💎'
          );
          setTimeout(() => setToastNotification(null), 2500);
          return {
            ...msg,
            userGender: nextGender,
            userAge: nextAge
          };
        }
        return msg;
      })
    );
  };

  // Send message
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!canUserTypeInChat()) {
      setToastNotification('الدردشة النصية مقفلة حالياً، يجب الصعود على المايك للكتابة 🔒');
      setTimeout(() => setToastNotification(null), 3000);
      return;
    }
    if (!inputMessage.trim()) return;

    const isUserHost = currentUserRole === 'host' || isOwner;
    const newMsgId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const currentSentText = inputMessage.trim().slice(0, 100);
    const realSenderName = myUserName || (isUserHost ? 'مضيف الروم 👑' : 'عضو النجم ⭐');
    const realSenderAvatar = myUserAvatar;

    // 1. Broadcast immediately to Firebase Firestore so ALL mobile phones receive it
    sendRoomChatMessage(roomId || 'default-room', {
      msgId: newMsgId,
      userId: myUserId,
      userName: realSenderName,
      avatar: realSenderAvatar,
      text: currentSentText,
      userColor: isUserHost
        ? hostVipLevel >= 8
          ? 'text-red-500 font-black'
          : 'text-white font-bold'
        : 'text-amber-300 font-bold',
      bubbleSkin: equippedBubbleSkin,
      isHost: isUserHost,
      vipLevel: myVipLevel,
      replyTo: replyingToMessage
        ? {
            id: replyingToMessage.id,
            userName: replyingToMessage.userName,
            text: replyingToMessage.text
          }
        : undefined,
      badges: undefined
    }).catch((e) => console.warn('Chat send error:', e));

    // 2. Also send to realtime voice engine data channel if connected
    if (voiceEngineRef.current) {
      try {
        if (typeof (voiceEngineRef.current as any).sendChatMessage === 'function') {
          (voiceEngineRef.current as any).sendChatMessage({
            id: newMsgId,
            userName: realSenderName,
            avatar: realSenderAvatar,
            text: currentSentText,
            bubbleSkin: equippedBubbleSkin,
            senderPeerId: voiceEngineRef.current.myPeerId
          });
        } else if (typeof voiceEngineRef.current.sendChat === 'function') {
          voiceEngineRef.current.sendChat(currentSentText, undefined, equippedBubbleSkin, newMsgId);
        }
      } catch (err) {
        console.warn('Realtime voice engine chat send error:', err);
      }
    }

    setChatMessages((prev) => [
      ...prev,
      {
        id: newMsgId,
        userId: myUserId,
        userName: realSenderName,
        avatar: realSenderAvatar,
        text: currentSentText,
        userColor: isUserHost
          ? hostVipLevel >= 8
            ? 'text-red-500 font-black'
            : 'text-white font-bold'
          : 'text-amber-300 font-bold',
        bubbleSkin: equippedBubbleSkin,
        isHost: isUserHost,
        supporterLevel: myRealBadges.supporterLevel,
        charmLevel: myRealBadges.charmLevel,
        heartLevel: myRealBadges.supporterLevel,
        crownLevel: myRealBadges.charmLevel,
        vipLevel: myRealBadges.vipLevel || (isUserHost ? (hostVipLevel >= 8 ? `VIP${hostVipLevel}` : 'VIP6') : (myVipLevel || 'VIP6')),
        sharesLevel: myRealBadges.sharesLevel,
        isSuperAdmin: myRealBadges.isSuperAdmin,
        replyTo: replyingToMessage
          ? {
              id: replyingToMessage.id,
              userName: replyingToMessage.userName,
              text: replyingToMessage.text
            }
          : undefined,
        badges: undefined
      }
    ].slice(-30));
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    setInputMessage('');
    setReplyingToMessage(null);
    setShowChatInputModal(false);

    // Trigger VIP Cloud N Moving Marquee Announcement if active
    if (isVipBroadcastActive) {
      if (vipBroadcastRemaining <= 0) {
        setToastNotification('⚠️ استنفدت رصيد رسائل إعلان VIP اليومية!');
        setTimeout(() => setToastNotification(null), 3000);
      } else {
        const nextRemaining = Math.max(0, vipBroadcastRemaining - 1);
        setVipBroadcastRemaining(nextRemaining);
        saveVipBroadcastQuota(nextRemaining);
        const vipItem: VipAnnouncementItem = {
          id: `vip-ann-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          senderName: realSenderName,
          senderAvatar: isUserHost
            ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
            : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
          text: currentSentText,
          vipLevel: isUserHost ? (hostVipLevel >= 8 ? `VIP${hostVipLevel}` : 'VIP6') : 'VIP6',
          level: 94,
          nobleLevel: 'N5'
        };

        // Reset and trigger announcement immediately for sender
        setCurrentVipAnnouncement(null);
        setTimeout(() => {
          setCurrentVipAnnouncement(vipItem);
        }, 50);

        // 3. Broadcast VIP Marquee Cloud N Announcement across Firebase to ALL peers in the room
        sendRoomEventToFirestore(roomId || 'default-room', {
          id: vipItem.id,
          type: 'vip_announcement',
          senderId: myUserId,
          senderName: realSenderName,
          senderAvatar: vipItem.senderAvatar,
          content: currentSentText,
          metadata: {
            vipLevel: vipItem.vipLevel,
            level: vipItem.level,
            nobleLevel: vipItem.nobleLevel
          },
          timestamp: Date.now()
        }).catch((err) => console.warn('VIP Announcement Firebase broadcast error:', err));

        setToastNotification(`📢 تم إرسال إعلان VIP المتحرك بنجاح! (متبقي: ${nextRemaining})`);
        setTimeout(() => setToastNotification(null), 3000);
      }
    }

    // Broadcast real message to all connected peers in the room via WebSocket
    voiceEngineRef.current?.sendChat(
      currentSentText,
      isUserHost
        ? undefined
        : [
            {
              id: 'ub-vip',
              label: 'VIP 8',
              icon: '👑',
              bgClass: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black',
            },
          ],
      equippedBubbleSkin,
      newMsgId
    );
  };

  const handleSendGift = (
    giftName: string,
    giftIcon: string,
    totalValue: number = 0,
    rawGiftName: string = '',
    targetName: string = '',
    targetSeatIds?: number[],
    videoUrl?: string,
    giftItem?: GiftItem,
    explicitQuantity?: number
  ) => {
    const recipient = targetName || hostSeat.userName;
    const cleanDisplayEmoji = getCleanGiftEmoji(rawGiftName || giftName, giftIcon);

    // Broadcast gift event to Firestore for all mobile peers
    sendRoomEventToFirestore(roomId || 'default-room', {
      type: 'gift',
      senderName: myUserName,
      senderAvatar: myUserAvatar,
      targetName: recipient,
      content: rawGiftName || giftName,
      timestamp: Date.now()
    }).catch(() => {});

    // Play optional synthesized/custom audio effect
    if (giftItem) {
      playGiftAudioEffect(giftItem);
    }

    // Trigger Non-Blocking Background Video Gift (Layer 2 - under mics, above background)
    const isVideo = Boolean(
      videoUrl ||
      isVideoResource(giftIcon) ||
      giftItem?.videoUrl ||
      (giftItem && isVideoResource(giftItem.icon))
    );

    if (isVideo) {
      const vidSource = videoUrl || giftItem?.videoUrl || (isVideoResource(giftIcon) ? giftIcon : undefined);
      if (videoGiftTimerRef.current) {
        clearTimeout(videoGiftTimerRef.current);
      }
      const durationMs = (giftItem?.durationSeconds || 5.5) * 1000;
      if (vidSource) {
        setVideoHasRenderError(false);
        setActiveVideoGift({
          id: `vid-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          videoUrl: vidSource,
          icon: giftIcon,
          thumbnailUrl: giftItem?.thumbnailUrl,
          name: rawGiftName || giftName,
          sender: 'أنا (الزائر)',
          target: recipient,
          placement: giftItem?.placement || (giftItem?.displayPosition === 'above' ? 'top' : giftItem?.displayPosition === 'below' ? 'bottom' : 'center'),
          renderLayer: giftItem?.renderLayer || 'behind_mics',
          displayPosition: giftItem?.displayPosition || (giftItem?.placement === 'top' ? 'above' : giftItem?.placement === 'bottom' ? 'below' : 'center'),
          scale: giftItem?.scale || 1.0,
          blendMode: giftItem?.blendMode || 'screen'
        });

        videoGiftTimerRef.current = setTimeout(() => {
          setActiveVideoGift(null);
          setVideoHasRenderError(false);
        }, durationMs);
      }
    }

    // Trigger global high-value gift announcement if gift value is 20,000 coins or more
    if (totalValue >= 20000) {
      window.dispatchEvent(
        new CustomEvent('global_high_value_gift', {
          detail: {
            sender: 'أنا (الزائر)',
            giftName: rawGiftName || giftName,
            giftIcon: isVideo ? cleanDisplayEmoji : giftIcon,
            totalValue,
            targetName: recipient,
            roomTitle: roomTitle || 'وكالة شحن سوريا ألمانيا'
          }
        })
      );
    }

    // Extract quantity from explicit parameter or giftName string (e.g. "x7")
    let giftQty = explicitQuantity || 1;
    if (!explicitQuantity && giftName.includes('x')) {
      const match = giftName.match(/x(\d+)/);
      if (match) giftQty = parseInt(match[1], 10);
    }

    // Deduct cost of gift from supporter balance & increment total room support diamonds stats
    if (totalValue > 0) {
      isInternalCoinsUpdateRef.current = true;
      setUserCoinsBalance((prev) => Math.max(0, prev - totalValue));
      setTotalRoomSupportDiamonds((prev) => {
        const nextVal = prev + totalValue;
        try {
          localStorage.setItem(`room_total_support_diamonds_${roomId}`, nextVal.toString());
        } catch (e) {}
        return nextVal;
      });

      // Record real supporter and charm recipient in room stats service & server
      const targetSeatUser = allMicSeats.find((s) => s.userName === recipient);
      recordGiftSupport(roomId || roomTitle || 'default', {
        senderId: myUserId || 'user_me',
        senderName: myUserName || 'أنا',
        senderAvatar: myUserAvatar || '',
        senderLevel: String(authUser?.level || 1),
        senderVip: myVipLevel,
        recipientId: targetSeatUser?.userId || (recipient === myUserName ? myUserId : undefined),
        recipientName: recipient,
        recipientAvatar: targetSeatUser?.userAvatar || (recipient === myUserName ? myUserAvatar : undefined),
        recipientLevel: recipient === myUserName ? String(authUser?.level || 1) : '1',
        recipientVip: recipient === myUserName ? myVipLevel : (targetSeatUser?.vipLevel || 'VIP1'),
        giftValue: totalValue
      }).then((updated) => {
        setTotalRoomSupportDiamonds(updated.totalDiamonds);
      }).catch(() => {});

      // 🌟 Central Rule: POST /api/hosts/{hostId}/receive-support
      const targetUserId = targetSeatUser?.userId || (recipient === myUserName ? myUserId : '1001001');
      sendReceiveSupport(targetUserId, {
        senderId: myUserId || '1001001',
        senderName: myUserName || 'الداعم',
        giftId: giftItem?.id || 'gift-generic',
        giftName: rawGiftName || giftName,
        giftValue: totalValue,
        quantity: giftQty,
        roomId: roomId || 'default-room'
      }).catch(() => {});
    }

    // ================= LUCKY REFUND DRAW MECHANISM =================
    const isRefund = Boolean(
      giftItem && (
        giftItem.category === 'استرداد' ||
        giftItem.isRefund ||
        giftItem.isLucky ||
        isRefundGift(giftItem) ||
        (rawGiftName || giftName).includes('استرداد')
      )
    );

    let refundResult: RefundDrawResult | null = null;

    if (isRefund && giftItem) {
      refundResult = processRefundGiftDraw(giftItem, giftQty, 'أنا (الداعم)', recipient);

      // AUTOMATICALLY and IMMEDIATELY add won refund coins to supporter's wallet balance
      isInternalCoinsUpdateRef.current = true;
      setUserCoinsBalance((prev) => prev + refundResult.refundCoins);

      // Trigger Electric Energy Sphere in center of the screen (with rapid tap accumulation & explosion)
      handleRefundOrbDraw(refundResult, giftItem, giftQty);

      // Post celebratory announcement in dedicated left side ticker (freeing room chat from spam)
      const isBigPrize = refundResult.winTier === 'big' || refundResult.winTier === 'mega_jackpot';
      if (isBigPrize) {
        setTimeout(() => {
          const winSideId = `side-win-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
          setSideGiftEvents((prev) => [
            ...prev.slice(-4),
            {
              id: winSideId,
              senderName: 'أنا (الداعم)',
              senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
              actionType: refundResult.winTier === 'mega_jackpot' ? 'jackpot' : 'refund_win',
              giftName: refundResult.tierLabel,
              giftIcon: '🪙',
              coinsWon: refundResult.refundCoins,
              targetName: refundResult.senderName,
              timestamp: Date.now()
            }
          ]);
        }, 2000);
      }
    }

    // Effective coins received by the recipient on mic (for refund gifts, only recipientCoins is credited, remainder feeds the treasury)
    const recipientGainValue = refundResult ? refundResult.recipientCoins : totalValue;

    // Increment Team Battle PK Points ONLY if Team PK is active and battle status is running
    if (isTeamBattleActive && teamBattleStatus === 'running' && recipientGainValue > 0) {
      let recipientTeam: 'red' | 'blue' | 'none' = 'none';
      if (targetSeatIds && targetSeatIds.length > 0) {
        const occupiedTargetIds = targetSeatIds.filter((sid) =>
          allMicSeats.some((s) => s.id === sid && !s.isEmpty)
        );
        occupiedTargetIds.forEach((sid) => {
          const team = getTeamForSeat(sid, activeMicCount, ownerJoinedTeam);
          if (team === 'red') setRedTeamScore((prev) => prev + recipientGainValue);
          if (team === 'blue') setBlueTeamScore((prev) => prev + recipientGainValue);
          recipientTeam = team;
        });
      } else {
        const foundSeat = allMicSeats.find((s) => !s.isEmpty && s.userName === recipient);
        if (foundSeat) {
          const team = getTeamForSeat(foundSeat.id, activeMicCount, ownerJoinedTeam);
          if (team === 'red') setRedTeamScore((prev) => prev + recipientGainValue);
          if (team === 'blue') setBlueTeamScore((prev) => prev + recipientGainValue);
          recipientTeam = team;
        } else {
          recipientTeam = 'none';
        }
      }

      const senderName = 'عابرسبيل';
      const senderAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150';

      setPkTopSupportersMap((prev) => {
        const existing = prev[senderName] || { name: senderName, avatar: senderAvatar, coins: 0, team: recipientTeam };
        return {
          ...prev,
          [senderName]: {
            ...existing,
            coins: existing.coins + totalValue,
            team: recipientTeam !== 'none' ? recipientTeam : existing.team
          }
        };
      });
    }

    // [ISOLATION TEST]: Delay side gift notification banner until AFTER the flight animation sequence has completed
    setTimeout(() => {
      setActiveGiftBanner((prevBanner) => {
        if (prevBanner && prevBanner.sender === 'عابرسبيل' && prevBanner.target === recipient) {
          return {
            ...prevBanner,
            giftName: rawGiftName || giftName,
            giftIcon,
            quantity: (prevBanner.quantity || 1) + giftQty
          };
        }
        return {
          sender: 'عابرسبيل',
          senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
          giftName: rawGiftName || giftName,
          giftIcon,
          quantity: giftQty,
          target: recipient
        };
      });

      // Reset banner dismissal timer
      if (giftBannerTimerRef.current) {
        clearTimeout(giftBannerTimerRef.current);
      }
      giftBannerTimerRef.current = setTimeout(() => {
        setActiveGiftBanner(null);
      }, 4000);
    }, 1200);

    // Determine target seat coordinates for flying animation path dynamically at the moment of send
    const roomContainer = document.getElementById('voice-room-container');
    const containerRect = roomContainer ? roomContainer.getBoundingClientRect() : null;

    const refWidth = containerRect ? containerRect.width : window.innerWidth;
    const refHeight = containerRect ? containerRect.height : window.innerHeight;

    // START POINT: Strictly and unconditionally originates from the exact center of the screen
    const defaultStartX = refWidth / 2;
    const defaultStartY = refHeight / 2;

    const getFallbackSeatCoordsPct = (sId: number) => {
      // Calculate dynamic row & column fallback based on current row layout presets
      const rowLayout = getPresetRowLayout(activeMicCount);
      let sCount = 0;
      let targetRowIndex = 0;
      let targetColIndex = 0;
      let targetRowSize = 1;

      for (let r = 0; r < rowLayout.length; r++) {
        const countInRow = rowLayout[r];
        if (sId <= sCount + countInRow) {
          targetRowIndex = r;
          targetColIndex = (sId - 1) - sCount;
          targetRowSize = countInRow;
          break;
        }
        sCount += countInRow;
      }

      // Vertical position scaling per row: row 0 starts around top 14-20%, following rows step down ~10%
      const baseTopPct = activeMicCount <= 2 ? 20 : activeMicCount <= 5 ? 16 : 14;
      const rowStepPct = activeMicCount > 12 ? 9.5 : 10.5;
      const yPct = baseTopPct + targetRowIndex * rowStepPct;

      // Horizontal spacing across row items
      const xPct = targetRowSize === 1
        ? 50
        : (targetColIndex + 0.5) * (100 / targetRowSize);

      return { x: xPct, y: yPct };
    };

    // No trailing particles (pure standalone gift image/icon only)
    const createGiftParticles = () => [];

    // Determine target coordinates for interactive flying gift path
    let seatsToAnimate: number[] = [];
    let isTargetOnMic = false;

    if (targetSeatIds && targetSeatIds.length > 0) {
      seatsToAnimate = targetSeatIds;
      isTargetOnMic = true;
    } else if (recipient === 'جميع الحضور' || recipient.includes('جميع') || recipient.includes('الكل') || recipient.includes('المتواجدون على المايك')) {
      const activeSeats = allMicSeats.filter((s) => !s.isEmpty).map((s) => s.id);
      if (activeSeats.length > 0) {
        seatsToAnimate = activeSeats;
        isTargetOnMic = true;
      } else {
        seatsToAnimate = allMicSeats.map((s) => s.id);
        isTargetOnMic = true;
      }
    } else {
      // Check exact user match, seat ID match, or name substring match
      const foundSeat = allMicSeats.find(
        (s) => (
          s.userName === recipient || 
          recipient.includes(s.userName) || 
          s.userName.includes(recipient) ||
          recipient.includes(`مقعد ${s.id}`) ||
          recipient.includes(`المايك #${s.id}`) ||
          recipient.includes(`مايك ${s.id}`)
        )
      );
      if (foundSeat) {
        seatsToAnimate = [foundSeat.id];
        isTargetOnMic = true;
      } else {
        const seatMatch = recipient.match(/(?:مقعد|المقعد|المايك|مايك)\s*#?(\d+)/);
        if (seatMatch) {
          const matchedSeatId = parseInt(seatMatch[1], 10);
          seatsToAnimate = [matchedSeatId];
          isTargetOnMic = true;
        } else {
          isTargetOnMic = false;
        }
      }
    }

    let newFlyingItems: DynamicFlyingGift[] = [];

    const flyingIcon = isVideo ? cleanDisplayEmoji : (isMediaUrl(giftIcon) ? giftIcon : cleanDisplayEmoji);
    const giftRenderLayer = giftItem?.renderLayer || 'behind_mics';

    // Multi-Gift Animation: Launch actual number of gifts (e.g. 7 gifts)
    const visualGiftCount = Math.max(1, Math.min(giftQty, 50));
    const stepDelay = visualGiftCount > 25 ? 0.04 : visualGiftCount > 10 ? 0.05 : 0.07;

    if (isTargetOnMic && seatsToAnimate.length > 0) {
      newFlyingItems = [];
      seatsToAnimate.forEach((sId, seatIdx) => {
        for (let q = 0; q < visualGiftCount; q++) {
          newFlyingItems.push({
            id: `fg-${Date.now()}-${sId}-${q}-${Math.random().toString(36).substring(2, 6)}`,
            icon: flyingIcon,
            targetElementId: `mic-seat-${sId}`,
            fallbackTargetPct: getFallbackSeatCoordsPct(sId),
            delay: (seatIdx * 0.1) + (q * stepDelay),
            renderLayer: giftRenderLayer,
            particles: createGiftParticles(),
          });
        }
      });
    } else {
      newFlyingItems = [];
      for (let q = 0; q < visualGiftCount; q++) {
        newFlyingItems.push({
          id: `fg-${Date.now()}-aud-${q}-${Math.random().toString(36).substring(2, 6)}`,
          icon: flyingIcon,
          targetElementId: 'room-top-audience',
          fallbackTargetPct: { x: 18, y: 5 },
          delay: q * stepDelay,
          renderLayer: giftRenderLayer,
          particles: createGiftParticles(),
        });
      }
    }

    setFlyingGifts((prev) => [...prev, ...newFlyingItems]);

    // Gift-Linked Counter Integration: Increment Total Gift Value ONLY for strictly occupied target seats on mic in real time
    const strictlyOccupiedTargetSeats = seatsToAnimate.filter((sId) =>
      allMicSeats.some((s) => s.id === sId && !s.isEmpty)
    );

    if (isTargetOnMic && strictlyOccupiedTargetSeats.length > 0 && recipientGainValue > 0) {
      setSeatCounters((prev) => {
        const nextCounters = { ...prev };
        strictlyOccupiedTargetSeats.forEach((sId) => {
          nextCounters[sId] = (nextCounters[sId] || 0) + recipientGainValue;
        });
        return nextCounters;
      });

      // Trigger instant live animation and floating counter badge on targeted seats
      const nowId = Date.now().toString() + Math.random().toString(36).substring(2, 6);
      setRecentlyUpdatedSeatCounters((prev) => {
        const next = { ...prev };
        strictlyOccupiedTargetSeats.forEach((sId) => {
          next[sId] = {
            amount: recipientGainValue,
            giftIcon: cleanDisplayEmoji,
            id: `${nowId}-${sId}`
          };
        });
        return next;
      });

      // Clear the live pulse animation after 2.8s
      setTimeout(() => {
        setRecentlyUpdatedSeatCounters((prev) => {
          const next = { ...prev };
          let changed = false;
          strictlyOccupiedTargetSeats.forEach((sId) => {
            if (next[sId]?.id.startsWith(nowId)) {
              delete next[sId];
              changed = true;
            }
          });
          return changed ? next : prev;
        });
      }, 2800);
    }

    // Schedule flight completion: gift glides smoothly, impacts target coordinates, triggers arrival shockwave, then cleans up safely
    newFlyingItems.forEach((fg) => {
      setTimeout(() => {
        setFlyingGifts((prev) => prev.filter((item) => item.id !== fg.id));
      }, (fg.delay + 2.2) * 1000);
    });

    // Route gift notification smoothly to dedicated left side ticker (freeing room chat from clutter)
    const sideEventId = `side-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const targetSeatObj = targetSeatIds && targetSeatIds.length > 0
      ? allMicSeats.find((s) => s.id === targetSeatIds[0])
      : hostSeat;

    setSideGiftEvents((prev) => [
      ...prev,
      {
        id: sideEventId,
        senderName: 'أنا (الداعم)',
        senderId: CURRENT_USER_PROFILE_ID,
        senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
        actionType: 'gift',
        giftName: rawGiftName || giftName,
        giftIcon: cleanDisplayEmoji,
        quantity: giftQty || 1,
        targetName: recipient,
        targetId: targetSeatObj?.userId,
        timestamp: Date.now()
      }
    ]);
  };

  // Helper trigger for testing 20,000+ gift global banner when clicking Gift Log button
  const handleGiftLogClick = () => {
    setShowGiftDrawer(true);
    window.dispatchEvent(
      new CustomEvent('global_high_value_gift', {
        detail: {
          sender: 'أنا (الزائر)',
          giftName: 'خاتم برج الأسد الملكي 🔮',
          giftIcon: '🔮',
          totalValue: 25000,
          targetName: hostSeat.userName,
          roomTitle: roomTitle || 'وكالة شحن سوريا ألمانيا'
        }
      })
    );
  };

  // Real-time WebSocket reaction signal listener for mic seat animations
  useEffect(() => {
    const handleWsReaction = (e: Event) => {
      const customEv = e as CustomEvent<{
        seatId: number;
        seatIndex?: number;
        emoji: string;
        emojiType?: string;
        lottieAssetPath?: string;
        glowColor?: string;
      }>;
      if (!customEv.detail) return;
      const { seatId, seatIndex, emoji, emojiType, lottieAssetPath, glowColor } = customEv.detail;
      const targetSeatId = seatId || seatIndex || 1;
      const reactionId = Date.now().toString() + Math.random().toString();

      setActiveSeatReactions((prev) => ({
        ...prev,
        [targetSeatId]: { emoji, emojiType, lottieAssetPath, glowColor, id: reactionId }
      }));

      // Auto disappear overlay after 3 seconds
      setTimeout(() => {
        setActiveSeatReactions((prev) => {
          if (prev[targetSeatId]?.id === reactionId) {
            const copy = { ...prev };
            delete copy[targetSeatId];
            return copy;
          }
          return prev;
        });
      }, 3000);
    };

    window.addEventListener('room_ws_emoji_reaction', handleWsReaction);
    return () => {
      window.removeEventListener('room_ws_emoji_reaction', handleWsReaction);
    };
  }, []);

  // Gift_Event_Listener: Dynamic real-time listener for incoming gifts to calculate and increment Total Gift Value per seat
  useEffect(() => {
    const handleGiftEvent = (e: Event) => {
      const customEv = e as CustomEvent<{
        seatId?: number;
        targetSeatIds?: number[];
        totalValue?: number;
        giftValue?: number;
      }>;
      if (!customEv.detail) return;
      const { seatId, targetSeatIds, totalValue = 0, giftValue = 0 } = customEv.detail;
      const addVal = totalValue || giftValue;
      const targets = targetSeatIds || (seatId ? [seatId] : []);

      if (targets.length > 0 && addVal > 0) {
        setSeatCounters((prev) => {
          const nextCounters = { ...prev };
          targets.forEach((sId) => {
            nextCounters[sId] = (nextCounters[sId] || 0) + addVal;
          });
          return nextCounters;
        });
      }
    };

    window.addEventListener('room_gift_event', handleGiftEvent);
    return () => {
      window.removeEventListener('room_gift_event', handleGiftEvent);
    };
  }, []);

  const handleSendReaction = (emoji: string) => {
    const newEffect: FloatingEffect = {
      id: Date.now().toString() + Math.random(),
      emoji,
      x: Math.floor(Math.random() * 60) + 20
    };
    setFloatingEffects((prev) => [...prev, newEffect]);

    setTimeout(() => {
      setFloatingEffects((prev) => prev.filter((item) => item.id !== newEffect.id));
    }, 2200);
  };

  const handleSendEmojiReaction = (emoji: string, overrideAssetPath?: string, overrideGlowColor?: string) => {
    // Check if current user is on any mic seat
    const userMicSeat = allMicSeats.find(
      (s) => isSeatMine(s) || (!s.isEmpty && (Boolean(s.userName?.includes('أنا')) || Boolean(s.userName?.includes('انضمام')) || Boolean(s.userName?.includes('المالك')) || Boolean(s.userName?.includes('مضيف')) || s.isHost))
    );

    if (!userMicSeat) {
      setToastNotification('يجب أن تكون على المايك لاستخدام التفاعلات 🎙️');
      setTimeout(() => setToastNotification(null), 3000);
      return;
    }

    // Dismiss the emoji picker modal sheet immediately on selection
    setShowEmojiPicker(false);

    // Fetch dynamic Lottie configuration mapped in Dev Config Manager
    const currentConfigs = getStoredEmojiConfigs();
    const emojiCfg = currentConfigs[emoji] || {
      emoji,
      category: 'laugh',
      lottieAssetPath: `emojis/laugh.json`,
      glowColor: '#F59E0B'
    };

    const emojiType = emojiCfg.category || 'laugh';
    const lottieAssetPath = overrideAssetPath || emojiCfg.lottieAssetPath || `emojis/${emojiType}.json`;
    const glowColor = overrideGlowColor || emojiCfg.glowColor || '#F59E0B';

    // Directly trigger mic speaking wave glow and equipment interaction for 3 seconds
    setAllMicSeats((prev) =>
      prev.map((s) => (s.id === userMicSeat.id ? { ...s, isSpeaking: true, isMuted: false } : s))
    );

    // Broadcast WebSocket signal with dynamic lottieAssetPath and glowColor to all clients in the room
    window.dispatchEvent(
      new CustomEvent('room_ws_emoji_reaction', {
        detail: {
          seatId: userMicSeat.id,
          seatIndex: userMicSeat.id,
          emoji,
          emojiType,
          lottieAssetPath,
          glowColor
        }
      })
    );

    // Reset speaking wave highlight back after 3 seconds
    setTimeout(() => {
      setAllMicSeats((prev) =>
        prev.map((s) => (s.id === userMicSeat.id ? { ...s, isSpeaking: false } : s))
      );
    }, 3000);
  };

  return (
    <div
      ref={containerRef}
      id="voice-room-container"
      className="fixed inset-0 w-full h-full z-50 bg-[#0B0E17] text-white font-sans flex flex-col justify-between overflow-hidden overflow-x-hidden select-none overscroll-none"
      dir="rtl"
    >
      {/* BACKGROUND WALLPAPER CACHE NOTIFICATION (تنبيه خفي رشيق لتحميل وتجهيز خلفية الروم) */}
      <WallpaperBackgroundCachePill notice={wallpaperCacheNotice} />

      {/* ACTIVE ROOM WALLPAPER BACKGROUND LAYER (الخلفية التي عينها صاحب الروم - محملة تدريجياً وخفياً كآخر عنصر) */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-all duration-700 pointer-events-none ${
          isWallpaperReady ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
        }`}
        style={{
          backgroundImage: isWallpaperReady ? `url('${currentRoomBgUrl}')` : undefined,
          opacity: isWallpaperReady ? (mainRoomConfig.activeWallpaperOpacity ?? 100) / 100 : 0,
          filter: `brightness(${(mainRoomConfig.activeWallpaperBrightness ?? 100) / 100}) contrast(${(mainRoomConfig.activeWallpaperContrast ?? 100) / 100})`
        }}
      />
      {/* ACTIVE WALLPAPER DIMMING (تعتيم وتظليل خلفية الروم) */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-300"
        style={{
          backgroundColor: `rgba(0, 0, 0, ${(mainRoomConfig.activeWallpaperDimming ?? 0) / 100})`
        }}
      />
      {/* DYNAMIC MIC AREA OVERLAY DARKNESS (درجة تظليل وتعتيم خلفية المايكات) */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-300"
        style={{
          backgroundColor: `rgba(0, 0, 0, ${(mainRoomConfig.roomOverlayDarkness ?? 0) / 100})`,
          backdropFilter: mainRoomConfig.roomBackdropBlur ? `blur(${mainRoomConfig.roomBackdropBlur}px)` : undefined
        }}
      />
      {/* GLOW ATMOSPHERE BACKGROUND */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at top center, ${hexToRgba(mainRoomConfig.roomAmbientGlowColor || '#3b82f6', (mainRoomConfig.roomAmbientGlowIntensity ?? 0) / 100)}, transparent 70%)`
        }}
      />
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{
          backgroundColor: hexToRgba(mainRoomConfig.roomAmbientGlowColor || '#3b82f6', (mainRoomConfig.roomAmbientGlowIntensity ?? 0) / 300)
        }}
      />

      {/* ========================================================================= */}
      {/* LAYER 2: NON-BLOCKING BACKGROUND VIDEO & GIFT ANIMATION LAYER (الطبقة الثانية: تحت المايكات وفوق الخلفية مباشرة) */}
      {/* Implements IgnorePointer (pointer-events-none) to eliminate screen freezing and touch blocking */}
      {/* ========================================================================= */}
      <div
        id="room-layer-2-video-decor"
        className="absolute inset-0 z-10 pointer-events-none select-none touch-none overflow-hidden"
        style={{ pointerEvents: 'none' }}
        aria-hidden="true"
      >
        {/* Full-Screen Ambient Video Gift Player (Room Decor Style with mix-blend-mode & opacity - Behind Mics Layer) */}
        <AnimatePresence>
          {activeVideoGift && (activeVideoGift.renderLayer === 'behind_mics' || !activeVideoGift.renderLayer) && (
            <motion.div
              key={activeVideoGift.id}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 0.96, scale: 1 }}
              exit={{ opacity: 0, scale: 1.06 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className={`absolute inset-0 pointer-events-none select-none flex overflow-hidden ${
                activeVideoGift.placement === 'top' || activeVideoGift.displayPosition === 'above'
                  ? 'items-start justify-center pt-16'
                  : activeVideoGift.placement === 'mics'
                  ? 'items-center justify-center -translate-y-6'
                  : activeVideoGift.placement === 'bottom' || activeVideoGift.displayPosition === 'below'
                  ? 'items-end justify-center pb-24'
                  : activeVideoGift.placement === 'fullscreen'
                  ? 'items-center justify-center'
                  : 'items-center justify-center'
              }`}
              style={{ pointerEvents: 'none' }}
            >
              {/* Subtle background glow atmosphere */}
              <div className="absolute inset-0 bg-radial from-amber-500/10 via-purple-500/5 to-transparent pointer-events-none" />

              {/* Contained Video/Asset Frame that acts as room decor without obscuring UI elements */}
              <div
                className={`relative flex items-center justify-center pointer-events-none px-4 transition-transform ${
                  activeVideoGift.placement === 'fullscreen'
                    ? 'w-full h-full max-h-screen'
                    : 'w-full max-w-md sm:max-w-lg max-h-[70vh]'
                }`}
                style={{
                  pointerEvents: 'none',
                  transform: `scale(${activeVideoGift.scale || 1.0})`
                }}
              >
                {!videoHasRenderError && Boolean(activeVideoGift.videoUrl || (activeVideoGift.icon && isVideoResource(activeVideoGift.icon))) ? (
                  <video
                    src={activeVideoGift.videoUrl || activeVideoGift.icon}
                    autoPlay
                    playsInline
                    muted
                    loop={false}
                    tabIndex={-1}
                    onError={() => setVideoHasRenderError(true)}
                    className={`object-contain pointer-events-none select-none filter drop-shadow-[0_12px_32px_rgba(0,0,0,0.85)] drop-shadow-[0_0_24px_rgba(245,158,11,0.35)] ${
                      activeVideoGift.placement === 'fullscreen'
                        ? 'w-full h-full object-cover'
                        : 'w-full max-h-[62vh]'
                    }`}
                    style={{
                      pointerEvents: 'none',
                      mixBlendMode: activeVideoGift.blendMode || 'screen',
                      opacity: 0.95
                    }}
                  />
                ) : (activeVideoGift.thumbnailUrl || (activeVideoGift.icon && isMediaUrl(activeVideoGift.icon))) ? (
                  /* Automatic Fallback to High-Resolution Static Thumbnail Version of Asset to prevent screen freeze */
                  <motion.div
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative flex items-center justify-center pointer-events-none"
                    style={{ pointerEvents: 'none' }}
                  >
                    <img
                      src={activeVideoGift.thumbnailUrl || activeVideoGift.icon}
                      alt={activeVideoGift.name}
                      className="max-h-[50vh] max-w-[85vw] object-contain drop-shadow-[0_0_35px_rgba(245,158,11,0.6)] animate-pulse"
                      style={{
                        pointerEvents: 'none',
                        mixBlendMode: activeVideoGift.blendMode || 'screen'
                      }}
                    />
                  </motion.div>
                ) : (
                  /* Fallback Emblem Badge */
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: [0.95, 1.05, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse' }}
                    className="w-48 h-48 rounded-full bg-radial from-amber-500/20 via-amber-600/10 to-transparent flex items-center justify-center border border-amber-400/30 backdrop-blur-xs pointer-events-none shadow-[0_0_40px_rgba(245,158,11,0.4)]"
                    style={{ pointerEvents: 'none' }}
                  >
                    <span className="text-7xl filter drop-shadow-[0_0_20px_rgba(245,158,11,0.8)]">
                      {getCleanGiftEmoji(activeVideoGift.name, activeVideoGift.icon)}
                    </span>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* DYNAMIC OBJECT-REFERENCE FLYING GIFTS (BEHIND MICS LAYER) */}
        <DynamicAnchoredGiftOverlay
          flyingGifts={flyingGifts.filter((g) => g.renderLayer === 'behind_mics' || !g.renderLayer)}
          containerRef={containerRef}
          onComplete={(id) => {
            setFlyingGifts((prev) => prev.filter((item) => item.id !== id));
          }}
        />
      </div>

      {/* 1. TOP HEADER BAR */}
      <div className="relative z-20 pt-2.5 px-2.5 sm:px-3 pb-1.5 space-y-1.5 w-full max-w-full overflow-x-hidden">
        {/* Row 1 Header Icons & Room Title Pill (Modular RoomHeader) */}
        <RoomHeader
          currentRoomTitle={currentRoomTitle}
          currentRoomAvatar={currentRoomAvatar}
          hostSeat={hostSeat}
          isRoomLocked={isRoomLocked}
          mainRoomConfig={mainRoomConfig}
          isRegularUser={isRegularUser}
          audienceCount={Math.max(1, allMicSeats.filter((s) => !s.isEmpty).length + audienceAndChatMembers.filter((a) => !allMicSeats.some((s) => s.userId === a.id)).length)}
          onOpenRoomInfo={() => setShowRoomInfoModal(true)}
          onOpenHostProfile={() => {
            handleOpenUserProfileSafely({
              id: hostSeat.userId || (isOwner ? myUserId : 'host_1'),
              userId: hostSeat.userId || (isOwner ? myUserId : 'host_1'),
              name: hostSeat.userName || (isOwner ? myUserName : hostName),
              avatar: hostSeat.avatar || (isOwner ? myUserAvatar : currentRoomAvatar),
              isHost: true,
              seatId: hostSeat.id || 1
            });
          }}
          onOpenAudienceModal={() => {
            if (!targetInviteSeatId && !selectedSeatForAction) {
              const firstEmpty = allMicSeats.slice(0, activeMicCount).find((s) => s.isEmpty);
              if (firstEmpty) {
                setTargetInviteSeatId(firstEmpty.id);
              }
            }
            setShowAudienceModal(true);
          }}
          onOpenOptionsMenu={() => setShowTopOptionsMenuModal(true)}
          onOpenExitModal={() => setShowRoomExitModal(true)}
        />

        {/* Row 2 Sub-Header Quick Badges (Positioned slightly higher, reversed order, and logic mapped) */}
        <div className="space-y-1 -mt-1 pt-0 pb-0.5 relative">
          <div className="flex flex-row-reverse items-center justify-between gap-1">
            {/* 1. Right: Family / الأسرة Badge -> Opens FamilyModal */}
            <button
              onClick={() => setShowFamilyModal(true)}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-purple-100 px-1.5 py-0.5 rounded-full border border-purple-300/40 flex items-center gap-0.5 text-[8px] font-black shadow-2xs hover:border-purple-300 transition-colors cursor-pointer"
              title="عائلة المستخدم والقبيلة"
            >
              <Users className="w-2.5 h-2.5 text-purple-200" />
              <span>العائلة</span>
            </button>

            {/* 2. Star / الأساطير Badge -> Opens SuperLegendModal (Top Supporters) */}
            <button
              onClick={() => setShowSuperLegendModal(true)}
              className="bg-[#151D2C] border border-amber-500/40 px-1.5 py-0.5 rounded-full flex items-center gap-0.5 text-[8px] font-black text-amber-300 shadow-2xs hover:border-amber-400 transition-colors cursor-pointer"
              title="قائمة كبار الداعمين والأساطير"
            >
              <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
              <span>الأساطير</span>
            </button>

            {/* 3. Gift Log Badge -> Opens Gift Drawer and triggers 20k+ banner sample */}
            <button
              onClick={handleGiftLogClick}
              className="bg-[#151D2C] border border-white/10 px-1.5 py-0.5 rounded-full flex items-center gap-0.5 text-[8px] font-black text-pink-300 shadow-2xs hover:border-pink-500/50 transition-colors cursor-pointer"
              title="سجل الهدايا المرسلة"
            >
              <Gift className="w-2.5 h-2.5 text-pink-400" />
              <span>السجل</span>
            </button>

            {/* 4. Mic Control Badge -> Opens Mic Control Modal (Strictly Visible for Room Owner) */}
            {isOwner && (
              <button
                onClick={() => {
                  if (isCounterRunning && !isCounterPaused) {
                    setToastNotification('يجب إيقاف العداد أولاً لتعديل وضع المايكات 🛑');
                    setTimeout(() => setToastNotification(null), 3000);
                  }
                  setShowMicControlModal(true);
                }}
                className={`px-1.5 py-0.5 rounded-full flex items-center gap-0.5 text-[8px] font-black shadow-2xs transition-all cursor-pointer ${
                  isCounterRunning && !isCounterPaused
                    ? 'bg-slate-800/90 border border-slate-600/60 text-slate-400 opacity-70'
                    : 'bg-[#151D2C] border border-emerald-500/40 text-emerald-300 hover:border-emerald-400'
                }`}
                title={isCounterRunning && !isCounterPaused ? 'يجب إيقاف العداد أولاً لتغيير وضع المايكات' : 'إدارة وتخصيص عدد المايكات'}
              >
                <Radio className={`w-2.5 h-2.5 ${isCounterRunning && !isCounterPaused ? 'text-slate-400' : 'text-emerald-400 animate-pulse'}`} />
                <span>{activeMicCount} مايك</span>
                {isCounterRunning && !isCounterPaused && <span className="text-[7px]">🔒</span>}
              </button>
            )}

            {/* 5. Seat Request Queue Badge -> Opens Seat Request Queue Modal (ONLY for Owner and Moderator) */}
            {(isOwner || isModerator) && (
              <button
                onClick={() => setShowMicRequestsModal(true)}
                className="bg-[#151D2C] border border-cyan-500/50 px-1.5 py-0.5 rounded-full flex items-center gap-0.5 text-[8px] font-black text-cyan-300 shadow-2xs hover:border-cyan-400 transition-colors cursor-pointer relative"
                title="قائمة طلبات الصعود للمايك (طابور الانتظار)"
              >
                <Hand className="w-2.5 h-2.5 text-cyan-400 animate-bounce" />
                <span>طلبات {micRequests.length}</span>
                {micRequests.length > 0 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping absolute -top-0.5 -right-0.5" />
                )}
              </button>
            )}

            {/* 7. Left: Diamond / Total Room Support -> Opens Room Support Stats Modal */}
            <button
              onClick={() => setShowRoomSupportModal(true)}
              className="bg-gradient-to-r from-[#111A2E] to-[#16233B] border border-cyan-400/50 hover:border-cyan-300 px-2 py-0.5 rounded-full flex items-center gap-1 text-[8.5px] font-mono font-black text-cyan-300 shadow-xs cursor-pointer transition-all active:scale-95"
              title={`إجمالي إحصائيات الدعم الكلي في الغرفة: ${totalRoomSupportDiamonds.toLocaleString()} 💎 (انقر لفتح الإحصائيات الكاملة)`}
            >
              <span className="text-[9.5px] drop-shadow-[0_0_6px_rgba(6,182,212,0.8)]">💎</span>
              <span className="tracking-tight">
                {totalRoomSupportDiamonds >= 1_000_000
                  ? `${(totalRoomSupportDiamonds / 1_000_000).toFixed(1)}M`
                  : totalRoomSupportDiamonds >= 1_000
                  ? `${(totalRoomSupportDiamonds / 1_000).toFixed(1)}k`
                  : totalRoomSupportDiamonds.toLocaleString()}
              </span>
            </button>
          </div>

          {/* Under Sub-Header / Family Row: Quick Room Lighting & Shading Control (استرجاع التحكم بإضاءة وتظليل الغرفة) */}
          <div className="flex items-center justify-start pl-1 pt-0.5 gap-1.5" dir="ltr">
            {(isDev || isOwner) && (
              <button
                id="quick-room-shading-btn"
                type="button"
                onClick={() => {
                  const currentDarkness = mainRoomConfig.roomOverlayDarkness ?? 0;
                  let nextDarkness = 0;
                  let msg = '';
                  if (currentDarkness === 0) {
                    nextDarkness = 25;
                    msg = '🎨 تظليل خفيف للمايكات: 25%';
                  } else if (currentDarkness <= 30) {
                    nextDarkness = 50;
                    msg = '🎨 تظليل متوازن للمايكات: 50%';
                  } else if (currentDarkness <= 60) {
                    nextDarkness = 80;
                    msg = '🎨 تظليل داكن للمايكات: 80%';
                  } else {
                    nextDarkness = 0;
                    msg = '🌿 ألوان طبيعية 100% (تم إلغاء التظليل تماماً)';
                  }
                  const updated: MainRoomCustomizerConfig = {
                    ...mainRoomConfig,
                    roomOverlayDarkness: nextDarkness,
                    activeWallpaperDimming: nextDarkness === 0 ? 0 : (mainRoomConfig.activeWallpaperDimming ?? 0)
                  };
                  setMainRoomConfig(updated);
                  saveMainRoomCustomizerConfig(updated);
                  setToastNotification(msg);
                  setTimeout(() => setToastNotification(null), 2500);
                }}
                className={`w-5.5 h-5.5 rounded-full flex items-center justify-center shadow-xs cursor-pointer active:scale-90 transition-all border ${
                  (mainRoomConfig.roomOverlayDarkness ?? 0) === 0
                    ? 'bg-emerald-950/80 border-emerald-400/60 text-emerald-300 hover:border-emerald-300'
                    : 'bg-amber-950/80 border-amber-400/60 text-amber-300 hover:border-amber-300'
                }`}
                title={`التحكم بإضاءة وتظليل الغرفة: ${
                  (mainRoomConfig.roomOverlayDarkness ?? 0) === 0
                    ? 'الخلفية بلونها الطبيعي الخالص (0%) - انقر للتظليل'
                    : `تظليل مفعّل (${mainRoomConfig.roomOverlayDarkness}%) - انقر للتبديل أو الإلغاء`
                }`}
              >
                {(mainRoomConfig.roomOverlayDarkness ?? 0) === 0 ? (
                  <Sun className="w-2.5 h-2.5 text-amber-300" />
                ) : (
                  <Moon className="w-2.5 h-2.5 text-cyan-300" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 20,000+ COINS HIGH-VALUE GLOBAL GIFT NOTIFICATION RECTANGLE (CLICK-TO-REDIRECT DEEP LINK BANNER - NO CLOSE BUTTON) */}
      <AnimatePresence>
        {highValueGiftNotice && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: -6 }}
            transition={{ type: 'spring', stiffness: 380, damping: 25 }}
            className="absolute top-[62px] sm:top-[66px] left-1/2 -translate-x-1/2 z-40 w-[72%] sm:w-[60%] max-w-[295px] pointer-events-auto"
          >
            <div
              onClick={handleBannerNavigate}
              className="relative bg-[#18110B]/95 border-2 border-amber-400/90 rounded-2xl px-2.5 py-1.5 flex items-center justify-between gap-1.5 shadow-[0_0_24px_rgba(245,158,11,0.6)] cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all hover:border-amber-300 hover:shadow-[0_0_30px_rgba(245,158,11,0.85)] group"
              title="انقر للانتقال الفوري إلى الغرفة لمتابعة الحدث 🚀"
            >
              {/* Globe Top Decorator Badge - شعار عالمي */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-500 text-slate-950 font-black text-[9px] px-2.5 py-0.2 rounded-full border border-amber-200 shadow-md flex items-center gap-1 shrink-0 uppercase tracking-wide group-hover:scale-105 transition-transform">
                <Globe className="w-3 h-3 text-slate-950 fill-amber-950 animate-spin" />
                <span>شعار عالمي • +20,000 💎</span>
              </div>

              {/* Banner Details (Entire container is clickable for deep link room redirection) */}
              <div className="flex-1 min-w-0 flex items-center justify-center gap-2 pt-1 text-[10px] font-bold text-amber-100 truncate">
                <div className="shrink-0 flex items-center justify-center">
                  {highValueGiftNotice.giftIcon && isVideoResource(highValueGiftNotice.giftIcon) ? (
                    <video
                      src={highValueGiftNotice.giftIcon}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-7 h-7 object-contain drop-shadow-md"
                      style={{ mixBlendMode: 'screen' }}
                    />
                  ) : (highValueGiftNotice.giftIcon && isMediaUrl(highValueGiftNotice.giftIcon)) ? (
                    <img
                      src={highValueGiftNotice.giftIcon}
                      alt={highValueGiftNotice.giftName}
                      className="w-7 h-7 object-contain drop-shadow-md"
                    />
                  ) : (
                    <span className="text-2xl shrink-0 animate-pulse">
                      {getCleanGiftEmoji(highValueGiftNotice.giftName, highValueGiftNotice.giftIcon)}
                    </span>
                  )}
                </div>
                <div className="truncate flex flex-col text-center">
                  <div className="flex items-center justify-center gap-1 truncate text-amber-200 font-black text-[11px]">
                    <span className="truncate">{highValueGiftNotice.sender}</span>
                    <span className="text-amber-400 font-normal text-[9px]">إلى</span>
                    <span className="truncate text-amber-300">{highValueGiftNotice.targetName}</span>
                  </div>
                  <span className="text-[9.5px] font-mono text-amber-300/90 truncate font-extrabold dir-rtl">
                    أرسل {highValueGiftNotice.giftName} ({highValueGiftNotice.totalValue.toLocaleString()} 💎)
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Redirect Toast Feedback */}
      <AnimatePresence>
        {navigationToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white px-4 py-2 rounded-2xl shadow-[0_0_25px_rgba(16,185,129,0.7)] border border-emerald-300/50 flex items-center gap-2.5 font-bold text-xs pointer-events-none"
          >
            <span className="text-lg animate-bounce">🚀</span>
            <div className="flex flex-col">
              <span className="text-emerald-200 text-[10px] font-medium">جاري الانتقال الفوري للغرفة...</span>
              <span className="font-black text-amber-300 text-xs truncate max-w-[200px]">
                {navigationToast.roomTitle}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* UNIFIED SEQUENTIAL COLUMN LAYOUT: MIC GRID + DYNAMIC CHAT AREA AS A SINGLE BLOCK WITH TOP MARGIN SHIFT (Expanded upward by ~0.5cm / 18px while bottom mic row stays fixed in place) */}
      <div className="flex-1 min-h-0 flex flex-col mt-[20px] sm:mt-[24px] overflow-visible relative z-20 w-full max-w-full">
        {/* 2. DYNAMIC MIC ARRANGEMENT SECTION / CINEMA WATCH MODE */}
        <div className={`relative px-3 sm:px-6 pt-1 pb-0 ${isCinemaWatchMode ? 'space-y-1.5 sm:space-y-2' : ''} w-full max-w-2xl mx-auto flex flex-col shrink-0 transition-all duration-300 overflow-visible`}>
          {isCinemaWatchMode ? (
            /* CINEMA / WATCH TOGETHER MODE (مشاهدة الفيديو ومقاعد السينما الحمراء الفخمة - مكون معزول) */
            <RoomCinemaSection
              selectedCinemaVideo={selectedCinemaVideo}
              videoSuggestions={videoSuggestions}
              isOwner={isOwner}
              allMicSeats={allMicSeats}
              onOpenVideoPicker={() => setShowCinemaVideoPickerModal(true)}
              onCloseCinema={() => {
                if (isOwner) {
                  setIsCinemaWatchMode(false);
                  setSelectedCinemaVideo(null);
                  updateRoomCinemaInFirestore(roomId || 'default-room', null).catch(() => {});
                  setToastNotification('تم إغلاق وضع سينما الروم والعودة للمقاعد 🎙️');
                  setTimeout(() => setToastNotification(null), 3000);
                } else {
                  setToastNotification('عذراً، إغلاق سينما الروم متاح حصرياً لمالك الغرفة فقط 👑');
                  setTimeout(() => setToastNotification(null), 3000);
                }
              }}
              onSeatClick={handleSeatClick}
            />
          ) : (
            <>
              <RoomMicsGrid
                activeMicCount={activeMicCount}
                allMicSeats={allMicSeats}
                seatRows={seatRows}
                mainRoomConfig={mainRoomConfig}
                hostVipLevel={hostVipLevel}
                isProfilesHydrated={isProfilesHydrated}
                isTeamBattleActive={isTeamBattleActive}
                teamBattleStatus={teamBattleStatus}
                ownerJoinedTeam={ownerJoinedTeam}
                showCountersOnMics={showCountersOnMics}
                seatCounters={seatCounters}
                recentlyUpdatedSeatCounters={recentlyUpdatedSeatCounters}
                activeSeatReactions={activeSeatReactions}
                isOwner={isOwner}
                isCurrentAdmin={isCurrentAdmin}
                currentUserRole={currentUserRole}
                isSpeakerAudioMuted={isRoomSpeakerMuted}
                sessionTimerNode={null}
                onSeatClick={handleSeatClick}
                onOpenUserProfile={(userData) => {
                  handleOpenUserProfileSafely(userData);
                }}
              />
            </>
          )}
        </div>

        {/* TEAM BATTLE (معركة الفريق) VS STATUS BAR & CONTROL PANEL - مكون معزول */}
        <RoomTeamBattleSection
          isTeamBattleActive={isTeamBattleActive}
          teamBattleStatus={teamBattleStatus}
          teamBattleTimer={teamBattleTimer}
          redTeamScore={redTeamScore}
          blueTeamScore={blueTeamScore}
          isOwner={isOwner}
          activeMicCount={activeMicCount}
          onOpenTeamBattleModal={() => setShowTeamBattleModal(true)}
          onStartBattle={() => {
            setTeamBattleStatus('running');
            setRedTeamScore(0);
            setBlueTeamScore(0);
            setSeatCounters({});
            setPkTopSupportersMap({});
            setToastNotification('بدأت معركة الفريق الآن! ⚔️🔥');
            setTimeout(() => setToastNotification(null), 3000);
          }}
          onFinishBattle={() => {
            finishTeamBattleRound();
          }}
          onCloseBattle={() => {
            setIsTeamBattleActive(false);
            setToastNotification('انتهت معركة الفريق 🎉');
            setTimeout(() => setToastNotification(null), 3000);
          }}
          onToast={(msg) => {
            setToastNotification(msg);
            setTimeout(() => setToastNotification(null), 3000);
          }}
        />

        {/* SUBTLE & COMPACT GIFT BANNER PILL IN MIDDLE OF SCREEN (ISOLATION TEST: Completely hidden/disabled during animation sequence) */}
        <AnimatePresence>
          {isTickersReady && activeGiftBanner && flyingGifts.length === 0 && (
            <motion.div
              initial={{ opacity: 0, x: 150, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 150, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 320 }}
              className="absolute top-[31%] right-2 sm:right-4 z-20 max-w-[270px] bg-gradient-to-l from-[#171F33]/90 via-[#0F1626]/85 to-[#19243C]/90 border border-amber-400/50 rounded-full py-1 px-2.5 shadow-[0_6px_25px_rgba(0,0,0,0.7)] flex items-center justify-between gap-2 pointer-events-none select-none"
              dir="rtl"
            >
              {/* Right Side (Start of Pill): Sender Circular Avatar */}
              <div className="relative shrink-0 w-8 h-8 rounded-full border border-amber-400/90 p-0.5 bg-slate-900 shadow-sm overflow-hidden flex items-center justify-center">
                <img
                  src={
                    activeGiftBanner.senderAvatar ||
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'
                  }
                  alt={activeGiftBanner.sender}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>

              {/* Center: Stacked Text (Sender Name Top, Recipient Bottom) */}
              <div className="flex flex-col min-w-0 flex-1 leading-tight text-right pr-0.5">
                <span className="text-[11px] font-bold text-amber-200 truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                  ({activeGiftBanner.sender})
                </span>
                <span className="text-[10px] font-medium text-slate-200 truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                  إلى ({activeGiftBanner.target})
                </span>
              </div>

              {/* Left Side (End of Pill): Gift Thumbnail Image/Icon + Multiplier Quantity (x1, x2, x3...) */}
              <div className="flex items-center gap-1 shrink-0 pl-0.5">
                <motion.span
                  key={activeGiftBanner.quantity || 1}
                  initial={{ scale: 1.6, color: '#FDE047' }}
                  animate={{ scale: 1, color: '#F59E0B' }}
                  transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                  className="text-xs sm:text-sm font-black italic font-mono text-amber-300 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]"
                >
                  x{activeGiftBanner.quantity || 1}
                </motion.span>
                <div className="relative w-8 h-8 flex items-center justify-center">
                  {activeGiftBanner.giftIcon && isVideoResource(activeGiftBanner.giftIcon) ? (
                    <video
                      src={activeGiftBanner.giftIcon}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-7 h-7 object-contain drop-shadow-[0_2px_8px_rgba(245,158,11,0.7)]"
                      style={{ mixBlendMode: 'screen' }}
                    />
                  ) : (activeGiftBanner.giftIcon && isMediaUrl(activeGiftBanner.giftIcon)) ? (
                    <img
                      src={activeGiftBanner.giftIcon}
                      alt={activeGiftBanner.giftName}
                      className="w-7 h-7 object-contain drop-shadow-[0_2px_8px_rgba(245,158,11,0.7)]"
                    />
                  ) : (
                    <span className="text-2xl drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)] animate-bounce">
                      {getCleanGiftEmoji(activeGiftBanner.giftName, activeGiftBanner.giftIcon)}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ========================================================================= */}
        {/* LAYER 4: ABOVE MICS VIDEO GIFTS & HIGH PRIORITY FLYING GIFTS (فوق المايكات) */}
        {/* ========================================================================= */}
        <div
          id="room-layer-4-above-mics-decor"
          className="absolute inset-0 z-35 pointer-events-none select-none touch-none overflow-hidden"
          style={{ pointerEvents: 'none' }}
          aria-hidden="true"
        >
          {/* Full-Screen Ambient Video Gift Player (Above Mics Layer) */}
          <AnimatePresence>
            {activeVideoGift && activeVideoGift.renderLayer === 'above_mics' && (
              <motion.div
                key={activeVideoGift.id}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 0.98, scale: 1 }}
                exit={{ opacity: 0, scale: 1.06 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className={`absolute inset-0 pointer-events-none select-none flex overflow-hidden ${
                  activeVideoGift.placement === 'top' || activeVideoGift.displayPosition === 'above'
                    ? 'items-start justify-center pt-16'
                    : activeVideoGift.placement === 'mics'
                    ? 'items-center justify-center -translate-y-6'
                    : activeVideoGift.placement === 'bottom' || activeVideoGift.displayPosition === 'below'
                    ? 'items-end justify-center pb-24'
                    : activeVideoGift.placement === 'fullscreen'
                    ? 'items-center justify-center'
                    : 'items-center justify-center'
                }`}
                style={{ pointerEvents: 'none' }}
              >
                {/* Subtle background glow atmosphere */}
                <div className="absolute inset-0 bg-radial from-amber-500/15 via-purple-500/10 to-transparent pointer-events-none" />

                {/* Contained Video/Asset Frame */}
                <div
                  className={`relative flex items-center justify-center pointer-events-none px-4 transition-transform ${
                    activeVideoGift.placement === 'fullscreen'
                      ? 'w-full h-full max-h-screen'
                      : 'w-full max-w-md sm:max-w-lg max-h-[70vh]'
                  }`}
                  style={{
                    pointerEvents: 'none',
                    transform: `scale(${activeVideoGift.scale || 1.0})`
                  }}
                >
                  {!videoHasRenderError && Boolean(activeVideoGift.videoUrl || (activeVideoGift.icon && isVideoResource(activeVideoGift.icon))) ? (
                    <video
                      src={activeVideoGift.videoUrl || activeVideoGift.icon}
                      autoPlay
                      playsInline
                      muted
                      loop={false}
                      tabIndex={-1}
                      onError={() => setVideoHasRenderError(true)}
                      className={`object-contain pointer-events-none select-none filter drop-shadow-[0_12px_36px_rgba(0,0,0,0.9)] drop-shadow-[0_0_28px_rgba(245,158,11,0.5)] ${
                        activeVideoGift.placement === 'fullscreen'
                          ? 'w-full h-full object-cover'
                          : 'w-full max-h-[62vh]'
                      }`}
                      style={{
                        pointerEvents: 'none',
                        mixBlendMode: activeVideoGift.blendMode || 'screen',
                        opacity: 0.98
                      }}
                    />
                  ) : (activeVideoGift.thumbnailUrl || (activeVideoGift.icon && isMediaUrl(activeVideoGift.icon))) ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative flex items-center justify-center pointer-events-none"
                      style={{ pointerEvents: 'none' }}
                    >
                      <img
                        src={activeVideoGift.thumbnailUrl || activeVideoGift.icon}
                        alt={activeVideoGift.name}
                        className="max-h-[50vh] max-w-[85vw] object-contain drop-shadow-[0_0_40px_rgba(245,158,11,0.7)] animate-pulse"
                        style={{
                          pointerEvents: 'none',
                          mixBlendMode: activeVideoGift.blendMode || 'screen'
                        }}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: [0.95, 1.05, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse' }}
                      className="w-48 h-48 rounded-full bg-radial from-amber-500/25 via-amber-600/15 to-transparent flex items-center justify-center border border-amber-400/40 backdrop-blur-xs pointer-events-none shadow-[0_0_45px_rgba(245,158,11,0.5)]"
                      style={{ pointerEvents: 'none' }}
                    >
                      <span className="text-7xl filter drop-shadow-[0_0_25px_rgba(245,158,11,0.9)]">
                        {getCleanGiftEmoji(activeVideoGift.name, activeVideoGift.icon)}
                      </span>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* DYNAMIC OBJECT-REFERENCE FLYING GIFTS (ABOVE MICS LAYER) */}
          <DynamicAnchoredGiftOverlay
            flyingGifts={flyingGifts.filter((g) => g.renderLayer === 'above_mics')}
            containerRef={containerRef}
            onComplete={(id) => {
              setFlyingGifts((prev) => prev.filter((item) => item.id !== id));
            }}
          />
        </div>

        {/* FLOATING EMOJI ANIMATIONS */}
        {floatingEffects.map((effect) => (
          <motion.div
            key={effect.id}
            initial={{ opacity: 1, y: 0, scale: 0.8 }}
            animate={{ opacity: 0, y: -220, scale: 1.5 }}
            transition={{ duration: 2, ease: 'easeOut' }}
            className="absolute bottom-24 text-3xl pointer-events-none z-30"
            style={{ right: `${effect.x}%` }}
          >
            {effect.emoji}
          </motion.div>
        ))}

        {/* 4. ISOLATED LIVE CHAT MESSAGES FEED WITH FLOATING ENTRANCE BANNER */}
        <div className="relative flex-1 min-h-0 flex flex-col w-full overflow-visible">
          {/* LUXURY VIP MOVING ANNOUNCEMENT MARQUEE BANNER (شريط إعلان VIP المتحرك وسط الشاشة) */}
          <VipAnnouncementFlyer
            currentAnnouncement={currentVipAnnouncement}
            onDismiss={handleDismissVipAnnouncement}
          />

          {/* LUXURY VIP ROOM ENTRANCE BANNER (شريط دخول الغرفة الفاخر عند رأس المحادثة بنظام طابور متواصل) */}
          <RoomEntranceBanner
            entranceQueue={entranceQueue}
            onDismiss={(id) => {
              setEntranceQueue((prev) => prev.filter((item) => item.id !== id));
            }}
          />

          {/* LUCKY CHEST WINNERS GLIDING BANNER (شريط الفائزين من صندوق الحظ - تحته ملاصق له تماماً) */}
          <LuckyChestWinnerToast
            winnerNotice={activeLuckyChestWinnerNotice}
            winnersQueue={luckyChestWinnersQueue}
            onDismiss={(id) => {
              setLuckyChestWinnersQueue((prev) => prev.filter((item) => item.id !== id));
              if (activeLuckyChestWinnerNotice?.id === id) {
                setActiveLuckyChestWinnerNotice(null);
              }
            }}
          />

          <div className={`flex-1 flex flex-col min-h-0 w-full transition-opacity duration-300 ${isChatReady ? 'opacity-100' : 'opacity-0'}`}>
            <RoomChatFeed
              chatMessages={chatMessages}
              roomId={roomId || roomTitle || 'default'}
              hostName={hostName || (isOwner ? (myUserName || 'أبو أمجد (المالك 👑)') : 'صاحب الروم (المالك 👑)')}
              isOwner={isOwner}
              onReplyTo={(reply) => setReplyingToMessage(reply)}
              onOpenChatInput={() => setShowChatInputModal(true)}
              onToggleHostGender={handleToggleHostGender}
              onOpenUserProfile={(userData) => {
                handleOpenUserProfileSafely(userData);
              }}
            />
          </div>

          {/* DEDICATED LEFT-SIDE GIFT & PRIZES STREAM (WITH FLOATING BROADCAST TIMER AT TOP) */}
          <ErrorBoundary fallback={null}>
            <SideGiftStream
              events={sideGiftEvents}
              onExpireEvent={handleExpireSideGiftEvent}
              currentUserId={CURRENT_USER_PROFILE_ID}
              currentUserName={myOccupiedSeat?.userName || 'أنا (الداعم)'}
              userCoinsBalance={userCoinsBalance}
              onReturnRose={handleReturnRose}
              sessionTimerNode={
                <div className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-red-700 border border-red-300/80 text-white font-mono font-black tracking-wider whitespace-nowrap shadow-lg shadow-red-950/60 ring-1 ring-white/20 select-none">
                  <span className="dir-ltr text-[10px] font-black text-white">{formatUptimeTime(roomUptimeSeconds)}</span>
                </div>
              }
              onOpenUserProfile={(userData) => {
                handleOpenUserProfileSafely(userData);
              }}
            />
          </ErrorBoundary>
        </div>
      </div>

      {/* 5. BOTTOM CONTROL DOCK BAR (Modular RoomBottomBar) */}
      <RoomBottomBar
        mainRoomConfig={mainRoomConfig}
        isChatLocked={isChatLocked}
        canUserTypeInChat={canUserTypeInChat()}
        isUserOnMic={isUserOnMic}
        isMySeatMutedByAdmin={isMySeatMutedByAdmin}
        isMyMicMuted={isMyMicMuted}
        isNoiseSuppressionEnabled={isNoiseSuppressionEnabled}
        showEmojiPicker={showEmojiPicker}
        currentUserName={myUserName}
        currentUserAvatar={myUserAvatar}
        currentUserVip={myVipLevel}
        mySeatId={myOccupiedSeat?.id || null}
        onRequestMic={() => handleAscendToPlatform()}
        onOpenMyProfile={() => {
          handleOpenUserProfileSafely({
            id: myUserId,
            userId: myUserId,
            name: myUserName
          });
        }}
        onOpenChatInput={() => {
          if (isChatLocked && !canUserTypeInChat()) {
            setToastNotification("الدردشة النصية مقفلة للمستمعين 🔒 (متاحة لأعضاء المايك والإدارة فقط)");
            setTimeout(() => setToastNotification(null), 3000);
          }
          setShowChatInputModal(true);
        }}
        onToggleMyMic={handleToggleMyMic}
        onToggleEmojiPicker={() => setShowEmojiPicker(!showEmojiPicker)}
        onOpenGiftDrawer={() => {
          setSelectedGiftTargetSeatIds([]);
          setShowGiftDrawer(true);
        }}
        onOpenMessagesModal={() => setShowYoHoMessagesModal(true)}
        onOpenToolsModal={() => setShowYoHoBottomToolsModal(true)}
      />

      {/* CHAT INPUT MODAL POPUP (DECOUPLED & MODULAR) */}
      <RoomChatInputModal
        isOpen={showChatInputModal}
        onClose={() => setShowChatInputModal(false)}
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        canUserType={canUserTypeInChat()}
        isVipBroadcastActive={isVipBroadcastActive}
        onToggleVipBroadcast={() => setIsVipBroadcastActive((prev) => !prev)}
        vipBroadcastRemaining={vipBroadcastRemaining}
        onSendMessage={handleSendMessage}
        replyingToMessage={replyingToMessage}
        onCancelReply={() => setReplyingToMessage(null)}
        isHost={Boolean(currentUserRole === 'host' || isOwner)}
      />

      {/* MOVABLE & DYNAMIC EMOJI / LOTTIE REACTION PICKER (محمل عند الطلب فقط) */}
      {showEmojiPicker && (
        <Suspense fallback={null}>
          <MovableEmojiLottiePicker
            isOpen={showEmojiPicker}
            onClose={() => setShowEmojiPicker(false)}
            onSendEmojiReaction={handleSendEmojiReaction}
          />
        </Suspense>
      )}



      {/* ELECTRIC REFUND ENERGY SPHERE (كرة طاقة كهربائية في وسط الشاشة مع التضخم والانفجار عند النقر السريع) */}
      <ElectricRefundEnergySphere
        orbState={electricOrbState}
        onDismiss={handleDismissElectricOrb}
      />

      {/* LUCKY REFUND JACKPOT MODAL */}
      <LuckyRefundModal
        result={activeRefundDrawResult}
        onClose={() => setActiveRefundDrawResult(null)}
        onConfirmCollect={() => setActiveRefundDrawResult(null)}
      />

      {/* MINI-GAMES DRAWER */}
      <AnimatePresence>
        {showGamesDrawer && (
          <div
            className="fixed inset-0 z-50 bg-transparent flex items-end justify-center pointer-events-auto cursor-default select-none"
            onClick={() => setShowGamesDrawer(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-[#121827] border-t-2 border-indigo-500/60 rounded-t-3xl p-4 space-y-4 text-white pointer-events-auto shadow-2xl"
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Gamepad2 className="w-5 h-5 text-indigo-400" />
                  <h2 className="text-base font-black text-indigo-300">الألعاب التفاعلية بالروم</h2>
                </div>
                <button
                  onClick={() => setShowGamesDrawer(false)}
                  className="p-1.5 rounded-full bg-white/10 text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-4 rounded-2xl border border-white/20 text-center space-y-2 cursor-pointer hover:scale-102 transition-transform">
                  <div className="text-3xl">🎲</div>
                  <h3 className="text-sm font-black">LUDO التنافسية</h3>
                  <p className="text-[10px] text-indigo-100 font-bold">العب مع أعضاء المايك الآن</p>
                </div>

                <div className="bg-gradient-to-br from-amber-600 to-orange-600 p-4 rounded-2xl border border-white/20 text-center space-y-2 cursor-pointer hover:scale-102 transition-transform">
                  <div className="text-3xl">🎡</div>
                  <h3 className="text-sm font-black">عجلة الحظ الملكية</h3>
                  <p className="text-[10px] text-amber-100 font-bold">اربح ملايين الكوينز</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ROOM SETTINGS DRAWER */}
      <AnimatePresence>
        {showSettingsDrawer && (
          <div
            className="fixed inset-0 z-50 bg-transparent flex items-end justify-center pointer-events-auto cursor-default select-none"
            onClick={() => setShowSettingsDrawer(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-[#121827] border-t-2 border-slate-700 rounded-t-3xl p-4 space-y-3 text-white pointer-events-auto shadow-2xl"
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <h2 className="text-base font-black text-amber-300">إعدادات الغرفة</h2>
                <button
                  onClick={() => setShowSettingsDrawer(false)}
                  className="p-1.5 rounded-full bg-white/10 text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">

                {/* Mic Mode Control Button (Invisible Access: Strictly Visible for Room Owner) */}
                {isOwner && (
                  <button
                    onClick={() => {
                      if (isCounterRunning && !isCounterPaused) {
                        setToastNotification('يجب إيقاف العداد أولاً لتعديل وضع المايكات 🛑');
                        setTimeout(() => setToastNotification(null), 3000);
                      }
                      setShowSettingsDrawer(false);
                      setShowMicControlModal(true);
                    }}
                    className={`w-full p-3 border rounded-2xl flex items-center justify-between text-xs font-bold transition-colors shadow-sm cursor-pointer ${
                      isCounterRunning && !isCounterPaused
                        ? 'bg-slate-800/60 border-slate-700 text-slate-400 opacity-70'
                        : 'bg-[#1A2234] border-emerald-500/30 hover:bg-slate-700/80 text-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-xl border flex items-center justify-center ${
                        isCounterRunning && !isCounterPaused
                          ? 'bg-slate-700/40 border-slate-600/50 text-slate-400'
                          : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                      }`}>
                        <Radio className="w-4 h-4" />
                      </div>
                      <span className="font-extrabold text-xs">وضع الميكروفون</span>
                      {isCounterRunning && !isCounterPaused && (
                        <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded-md">مغلق (العداد يعمل) 🔒</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 bg-emerald-950/70 border border-emerald-500/40 px-2.5 py-1 rounded-full">
                      <span className="text-emerald-300 font-mono font-black text-xs">{activeMicCount}</span>
                      <span className="text-emerald-400 text-[10px] font-bold">ميكروفون</span>
                    </div>
                  </button>
                )}

                {/* Chat Lock Control Button (For Room Owner or Admins) */}
                {(isOwner || isCurrentAdmin) && (
                  <button
                    onClick={() => {
                      setIsChatLocked(!isChatLocked);
                      setToastNotification(!isChatLocked ? 'تم قفل الدردشة بالروم بنجاح 🔒' : 'تم فتح الدردشة للجميع 🔓');
                      setTimeout(() => setToastNotification(null), 2500);
                    }}
                    className={`w-full p-3 border rounded-2xl flex items-center justify-between text-xs font-bold transition-all cursor-pointer shadow-sm ${
                      isChatLocked
                        ? 'bg-rose-950/60 border-rose-500/50 text-rose-200'
                        : 'bg-[#1A2234] border-slate-700 text-slate-100 hover:bg-slate-700/80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                        isChatLocked ? 'bg-rose-500/20 border border-rose-500/40 text-rose-400' : 'bg-amber-500/20 border border-amber-500/40 text-amber-400'
                      }`}>
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <span className="font-extrabold text-xs">حالة الدردشة العامة</span>
                    </div>
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black border ${
                      isChatLocked
                        ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                        : 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                    }`}>
                      {isChatLocked ? (
                        <>
                          <Lock className="w-3 h-3 stroke-[2.5]" />
                          <span>مقشة (للمشرفين والمايكات)</span>
                        </>
                      ) : (
                        <span>مفتوحة للجميع 🔓</span>
                      )}
                    </div>
                  </button>
                )}
                <button className="w-full p-3 bg-[#1A2234] rounded-2xl flex items-center justify-between text-xs font-bold hover:bg-slate-700">
                  <span>جودة الصوت المباشر</span>
                  <span className="text-amber-300">HD فائقة النقاء</span>
                </button>
                <button
                  onClick={() => {
                    setShowSettingsDrawer(false);
                    setShowRoomExitModal(true);
                  }}
                  className="w-full p-3 bg-red-600/80 rounded-2xl text-center text-xs font-black text-white hover:bg-red-600 cursor-pointer"
                >
                  مغادرة وإغلاق الغرفة
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TABBED STATISTICS PANEL (Leaderboard & Stats Modal - Extracted into RoomLeaderboardStatsModal) */}
      <RoomLeaderboardStatsModal
        isOpen={showRoomSupportModal}
        onClose={() => setShowRoomSupportModal(false)}
        currentAppRole={currentAppRole}
        leaderboardTheme={leaderboardTheme}
        onSelectUserProfile={(user) => {
          handleOpenUserProfileSafely(user);
        }}
        onOpenFamilyModal={() => setShowFamilyModal(true)}
        totalRoomSupportDiamonds={totalRoomSupportDiamonds}
        onResetStats={() => {
          setTotalRoomSupportDiamonds(0);
          try {
            localStorage.setItem(`room_total_support_diamonds_${roomId}`, '0');
            localStorage.removeItem(`room_supporters_leaderboard_${roomTitle || 'default'}`);
            localStorage.removeItem(`room_supporters_leaderboard_${roomId || 'default'}`);
          } catch (e) {}
          setToastNotification('🧹 تم تصفير إحصائيات الدعم في الغرفة بنجاح');
          setTimeout(() => setToastNotification(null), 2500);
        }}
        roomId={roomId || roomTitle || 'default'}
        roomTitle={roomTitle || 'غرفة الصوت الحية'}
        currentUserId={myUserId || authUser?.id || 'user_me'}
        currentUserName={myUserName || authUser?.name || 'أنا'}
        currentUserAvatar={myUserAvatar || authUser?.avatar || ''}
        currentUserLevel={authUser?.level || 1}
        currentUserVip={myVipLevel}
      />

      {/* FAMILY MODAL (محمل عند الطلب فقط) */}
      {showFamilyModal && (
        <FamilyModal
          isOpen={showFamilyModal}
          onClose={() => setShowFamilyModal(false)}
        />
      )}

      {/* SUPER LEGEND MODAL (محمل عند الطلب فقط) */}
      {showSuperLegendModal && (
        <SuperLegendModal
          isOpen={showSuperLegendModal}
          onClose={() => setShowSuperLegendModal(false)}
          onOpenRecharge={onOpenRecharge}
        />
      )}

      {/* HOST PROFILE QUICK VIEW MODAL (محمل عند الطلب فقط) */}
      {showHostProfileModal && (
        <HostProfileModal
          isOpen={showHostProfileModal}
          onClose={() => setShowHostProfileModal(false)}
          hostName={hostSeat.userName || 'أميرة الشرق 👑'}
          hostAvatar={hostSeat.avatar}
          hostId={roomId}
          isHostMuted={hostSeat.isMuted}
          canControlMic={currentUserRole === 'owner'}
          currentAppRole={currentAppRole}
          onToggleHostMute={() => {
            handleToggleMuteSeat(hostSeat.id);
          }}
          onSendGift={() => {
            setSelectedGiftTargetSeatIds([hostSeat.id || 1]);
            setShowHostProfileModal(false);
            setShowGiftDrawer(true);
          }}
          onMentionHost={() => {
            setInputMessage(`@${hostSeat.userName || 'أميرة الشرق'} `);
            setShowChatInputModal(true);
          }}
          onOpenFullProfile={() => {
            setFullProfileUser({
              id: roomId || '8849201',
              userId: roomId || '8849201',
              name: hostSeat.userName || 'أميرة الشرق 👑',
              avatar: hostSeat.avatar,
              country: 'اليمن',
              countryFlag: '🇾🇪',
              isHost: true,
              isAdmin: true
            });
            setShowHostProfileModal(false);
            setShowFullUserProfileModal(true);
          }}
        />
      )}

      {/* ADVANCED USER PROFILE MODAL (بطاقة البروفايل المتقدمة) */}
      {showAdvancedProfileModal && selectedUserForProfile && (
        <AdvancedUserProfileModal
          isOpen={showAdvancedProfileModal}
          onClose={() => setShowAdvancedProfileModal(false)}
          user={selectedUserForProfile}
          isCurrentAdmin={isCurrentAdmin}
          isRoomOwner={isOwner}
          currentAppRole={currentAppRole}
          onSendGift={(u) => {
            const targetSeatId = (u as any)?.seatId || selectedUserForProfile?.seatId || 1;
            setSelectedGiftTargetSeatIds([targetSeatId]);
            setShowAdvancedProfileModal(false);
            setShowGiftDrawer(true);
          }}
          onMentionUser={(u) => {
            const currentSenderName = isOwner ? 'أميرة الشرق (المالك)' : 'عابرسبيل (أنا)';
            const currentSenderAvatar = isOwner
              ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'
              : 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=400';

            const reminderChatMsg: ChatMessage = {
              id: `chat-reminder-${Date.now()}-${Math.random()}`,
              userName: currentSenderName,
              text: `🔔 قام بإرسال إشارة تذكير إلى @${u.name} في الشات`,
              avatar: currentSenderAvatar,
              userColor: '#3B82F6'
            };
            setChatMessages((prev) => [...prev, reminderChatMsg]);
            setInputMessage(`@${u.name} `);
            setShowChatInputModal(true);
            setToastNotification(`🔔 تم إرسال إشارة تذكير إلى @${u.name} على الشات`);
            setTimeout(() => setToastNotification(null), 3000);
          }}
          onToggleMuteUser={(u) => {
            if (u.seatId) handleToggleMuteSeat(u.seatId, u.isMutedByAdmin !== undefined ? u.isMutedByAdmin : true);
          }}
          onManageSeat={(u) => {
            // إنزال مباشر من المقعد بدون فتح أي أيقونة أو نافذة
            const targetSeatId =
              u.seatId || allMicSeats.find((s) => !s.isEmpty && (s.userName === u.name || s.userId === u.userId))?.id;
            if (targetSeatId) {
              const modName = isOwner ? 'المالك (أميرة الشرق)' : 'المشرف عابر';
              handleRemoveFromMic(targetSeatId, modName);
              // In accordance with user requirement: dropping someone from mic/seat does NOT show in chat
              setToastNotification(`🪑 تم إنزال ${u.name} من المقعد بنجاح`);
              setTimeout(() => setToastNotification(null), 3000);
            }
          }}
          onKickFromRoom={(u) => handleKickFromRoom(u)}
          onOpenAdminControls={() => setShowRoomInfoModal(true)}
          onOpenPrivateChat={(u) => {
            setPrivateChatTargetUser(u || selectedUserForProfile);
            setShowAdvancedProfileModal(false);
            setShowYoHoMessagesModal(true);
          }}
          onOpenFullProfile={(u) => {
            setFullProfileUser(u);
            setShowAdvancedProfileModal(false);
            setShowFullUserProfileModal(true);
          }}
        />
      )}

      {/* FULL USER PROFILE MODAL (الملف الشخصي الكامل) */}
      {showFullUserProfileModal && fullProfileUser && (
        <UserProfileModal
          isOpen={showFullUserProfileModal}
          onClose={() => setShowFullUserProfileModal(false)}
          userProfile={{
            id: fullProfileUser.id,
            userId: fullProfileUser.userId || fullProfileUser.id,
            name: fullProfileUser.name,
            avatarUrl: fullProfileUser.avatar,
            country: fullProfileUser.country || 'اليمن',
            countryFlag: fullProfileUser.countryFlag || '🇾🇪',
            bio: (fullProfileUser as any).bio || 'أهلاً بكم في ملفي الشخصي في سوبر ليجند 🌟',
            vipLevel: (fullProfileUser as any).vipLevel || (fullProfileUser.isHost ? 'VIP8' : 'VIP6'),
            superLegendLevel: (fullProfileUser as any).superLegendLevel || 'SL1',
            stats: {
              friends: 120,
              followers: 5365,
              visitors: 892
            }
          } as any}
        />
      )}

      {/* AUDIENCE / INVITE LIST MODAL (قائمة المتواجدين بالشات والغرفة للدعوة للمايك) */}
      <AnimatePresence>
        {showAudienceModal && (() => {
          const effectiveInviteSeatId = targetInviteSeatId ?? selectedSeatForAction;
          const canEscalateToMic = isOwner || isCurrentAdmin || currentUserRole === 'owner' || currentUserRole === 'moderator';
          return (
            <div
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center p-0 sm:p-4 pointer-events-auto cursor-default select-none"
              onClick={() => {
                setShowAudienceModal(false);
                setTargetInviteSeatId(null);
                setSelectedSeatForAction(null);
              }}
            >
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md bg-[#121827] border-t-2 border-indigo-500/60 sm:border-2 rounded-t-3xl sm:rounded-3xl p-4 space-y-3 text-white shadow-2xl max-h-[80vh] flex flex-col pointer-events-auto"
                dir="rtl"
              >
                <div className="flex items-center justify-between pb-2 border-b border-white/10 shrink-0">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-400" />
                    <div>
                      <h2 className="text-base font-black text-indigo-300">
                        دعوة شخص للمايك {effectiveInviteSeatId ? `#${effectiveInviteSeatId}` : ''} 🎙️
                      </h2>
                      <p className="text-[10px] text-slate-400 font-medium">
                        المتواجدون بالشات والغرفة فقط (غير متواجدين على المايكات)
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAudienceModal(false);
                      setTargetInviteSeatId(null);
                      setSelectedSeatForAction(null);
                    }}
                    className="p-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Target Mic Destination Badge & Quick Empty Seats Switcher */}
                <div className="bg-[#1A2234] border border-white/10 rounded-xl p-2 flex items-center justify-between gap-2 shrink-0">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Mic className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="text-xs font-bold text-slate-300">المايك المحدد:</span>
                    <span className="text-xs font-black text-amber-300 bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 rounded-lg whitespace-nowrap">
                      {effectiveInviteSeatId ? `مايك #${effectiveInviteSeatId}` : 'أول مايك متاح'}
                    </span>
                  </div>

                  {/* Switcher chips for all available empty seats */}
                  <div className="flex items-center gap-1 overflow-x-auto max-w-[170px] custom-scrollbar py-0.5" title="اضغط لاختيار مايك محدد">
                    {allMicSeats.slice(0, activeMicCount).filter(s => s.isEmpty || s.id === effectiveInviteSeatId).map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          setTargetInviteSeatId(s.id);
                          setSelectedSeatForAction(s.id);
                        }}
                        className={`text-[10px] px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer shrink-0 ${
                          effectiveInviteSeatId === s.id
                            ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                            : 'bg-white/10 text-slate-300 hover:bg-white/20'
                        }`}
                      >
                        #{s.id}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Permission Notice Banner: Host has no permission to escalate, only Owner and Moderator */}
                {!canEscalateToMic && (
                  <div className="bg-amber-500/15 border border-amber-500/30 rounded-xl p-2.5 flex items-center gap-2 text-amber-300 text-[11px] shrink-0 font-medium">
                    <Lock className="w-4 h-4 shrink-0 text-amber-400" />
                    <span>تنبيه: المضيف العادي لا يحق له تصعيد أي شخص إلى المايك. هذه الصلاحية للمشرف الذي لديه صلاحية أو صاحب الروم فقط.</span>
                  </div>
                )}

                <div className="overflow-y-auto space-y-2 flex-1 pr-1 custom-scrollbar">
                  {availableAudienceForInvite.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 space-y-2">
                      <Users className="w-8 h-8 mx-auto text-slate-600 opacity-50" />
                      <p className="text-xs font-bold">لا يوجد أعضاء في الشات خارج المايكات حالياً</p>
                      <p className="text-[10px] text-slate-500">جميع المتواجدين إما على المايكات أو المضيف</p>
                    </div>
                  ) : (
                    availableAudienceForInvite.map((usr) => {
                      const isInvited = Boolean(invitedUserIds?.includes(usr.id));

                      const handleSendInvite = () => {
                        if (!canEscalateToMic) {
                          setToastNotification('عذراً! المضيف العادي لا يحق له تصعيد أي شخص إلى المايك. هذه الصلاحية للمشرف الذي لديه صلاحية أو صاحب الروم فقط 🛑');
                          setTimeout(() => setToastNotification(null), 3200);
                          return;
                        }
                        handleDirectInviteToMic(usr, effectiveInviteSeatId);
                      };

                      return (
                        <div
                          key={usr.id}
                          className="p-2.5 bg-[#1A2234] border border-white/10 hover:border-amber-500/60 rounded-2xl flex items-center justify-between transition-all hover:scale-[1.01] hover:bg-[#202B42]"
                        >
                          {/* User Info - Clicking sends invite only if authorized */}
                          <div
                            onClick={canEscalateToMic ? handleSendInvite : () => {
                              setToastNotification('عذراً! المضيف العادي لا يحق له تصعيد أي شخص إلى المايك. هذه الصلاحية للمشرف أو صاحب الروم فقط 🛑');
                              setTimeout(() => setToastNotification(null), 3200);
                            }}
                            className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer"
                            title={canEscalateToMic ? `اضغط لإرسال دعوة صعود ${effectiveInviteSeatId ? 'مايك #' + effectiveInviteSeatId : 'المايك'}` : 'الصلاحية للمشرف أو صاحب الروم فقط'}
                          >
                            <img
                              src={usr.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'}
                              alt={usr.name}
                              className="w-10 h-10 rounded-full object-cover border border-indigo-400/50 shrink-0"
                            />
                            <div className="flex flex-col min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="font-extrabold text-xs text-white truncate">{usr.name}</span>
                                <span className="text-[9px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 rounded font-bold shrink-0">
                                  {usr.role}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 mt-0.5 text-[9px] text-slate-400 font-mono">
                                <span className="text-purple-300 font-bold">{usr.level}</span>
                                <span>•</span>
                                <span className="text-amber-300 font-bold">{usr.vip}</span>
                              </div>
                            </div>
                          </div>

                          {/* Right Side Actions: Direct Invite Button + Profile View */}
                          <div className="flex items-center gap-2 shrink-0">
                            {/* Invite to Mic Button (Only allowed for Room Owner or Moderator) */}
                            {canEscalateToMic ? (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSendInvite();
                                }}
                                className={`text-[11px] px-3 py-1.5 rounded-xl font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-md ${
                                  isInvited
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-emerald-500/10'
                                    : 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-110 text-slate-950 font-black'
                                }`}
                              >
                                <Mic className="w-3.5 h-3.5" />
                                <span>{isInvited ? 'تمت الدعوة ✓' : (effectiveInviteSeatId ? `دعوة للمايك #${effectiveInviteSeatId}` : 'دعوة للمايك')}</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setToastNotification('عذراً! المضيف العادي لا يحق له تصعيد أي شخص إلى المايك. هذه الصلاحية للمشرف الذي لديه صلاحية أو صاحب الروم فقط 🛑');
                                  setTimeout(() => setToastNotification(null), 3200);
                                }}
                                className="text-[10px] px-2.5 py-1.5 rounded-xl font-bold flex items-center gap-1 bg-white/5 border border-white/10 text-slate-400 hover:text-slate-300 hover:bg-white/10 cursor-pointer"
                                title="المضيف العادي لا يحق له تصعيد أي شخص إلى المايك (صلاحية المشرف وصاحب الروم فقط)"
                              >
                                <Lock className="w-3 h-3 text-slate-400" />
                                <span>صلاحية مشرف/مالك</span>
                              </button>
                            )}

                            {/* Profile Button */}
                            <button
                              type="button"
                              title="عرض الملف الشخصي"
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowAudienceModal(false);
                                handleOpenUserProfileSafely(usr);
                              }}
                              className="p-1.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 rounded-xl transition-all cursor-pointer flex items-center"
                            >
                              <User className="w-3.5 h-3.5" />
                            </button>

                            {/* Exit / Leave Room Simulation Button (مغادرة الروم لتفريغ المايك تلقائياً) */}
                            <button
                              type="button"
                              title="مغادرة الروم (خروج من البث)"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUserExitRoom(usr.id, usr.name);
                              }}
                              className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 border border-rose-500/20 rounded-xl transition-all cursor-pointer flex items-center gap-1 text-[10px]"
                            >
                              <LogOut className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">خروج</span>
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* MODULAR LAZY-LOADED ROOM MODALS CONTROLLER (All 33 Room Modals Completely Decoupled) */}
      <RoomModalManager
        showSeatActionModal={showSeatActionModal}
        setShowSeatActionModal={setShowSeatActionModal}
        selectedSeatForAction={selectedSeatForAction}
        setSelectedSeatForAction={setSelectedSeatForAction}
        allMicSeats={allMicSeats}
        handleAcceptHostInvitation={handleAcceptHostInvitation}
        handleRejectHostInvitation={handleRejectHostInvitation}
        isCurrentAdmin={isCurrentAdmin}
        currentUserRole={currentUserRole}
        isOwner={isOwner}
        CURRENT_USER_PROFILE_ID={CURRENT_USER_PROFILE_ID}
        handleTakeSeat={handleTakeSeat}
        handleToggleLockSeat={handleToggleLockSeat}
        handleToggleMuteSeat={handleToggleMuteSeat}
        handleRequestMicFromUser={handleRequestMicFromUser}
        setTargetInviteSeatId={setTargetInviteSeatId}
        setShowAudienceModal={setShowAudienceModal}
        handleRemoveFromMic={handleRemoveFromMic}
        setSelectedUserForProfile={setSelectedUserForProfile}
        setShowAdvancedProfileModal={setShowAdvancedProfileModal}
        showMicRequestsModal={showMicRequestsModal}
        setShowMicRequestsModal={setShowMicRequestsModal}
        micRequests={micRequests}
        handleApproveMicRequest={handleApproveMicRequest}
        handleRejectMicRequest={handleRejectMicRequest}
        handleApproveAllMicRequests={handleApproveAllMicRequests}
        handleClearAllMicRequests={handleClearAllMicRequests}
        pendingHostInvitation={pendingHostInvitation}
        showQuickMicOptionsModal={showQuickMicOptionsModal}
        setShowQuickMicOptionsModal={setShowQuickMicOptionsModal}
        selectedSeatForQuickMic={myOccupiedSeat?.id || selectedSeatForAction}
        myUserName={myUserName}
        myUserAvatar={myUserAvatar}
        myUserId={myUserId}
        myOccupiedSeat={myOccupiedSeat}
        handleLeaveSeat={handleLeaveSeat}
        authUser={authUser}
        myVipLevel={myVipLevel}
        setSelectedGiftTargetSeatIds={setSelectedGiftTargetSeatIds}
        setShowGiftDrawer={setShowGiftDrawer}
        showMicControlModal={showMicControlModal}
        setShowMicControlModal={setShowMicControlModal}
        isCounterRunning={isCounterRunning}
        isCounterPaused={isCounterPaused}
        activeMicCount={activeMicCount}
        onAttemptToChangeMicLayout={onAttemptToChangeMicLayout}
        requireMicRequest={requireMicRequest}
        setRequireMicRequest={setRequireMicRequest}
        showMusicPlayerModal={showMusicPlayerModal}
        setShowMusicPlayerModal={setShowMusicPlayerModal}
        setToastNotification={setToastNotification}
        showSoundEffectsModal={showSoundEffectsModal}
        setShowSoundEffectsModal={setShowSoundEffectsModal}
        setIsSmartBalanceEnabled={setIsSmartBalanceEnabled}
        showDevConfigModal={showDevConfigModal}
        setShowDevConfigModal={setShowDevConfigModal}
        showTopOptionsMenuModal={showTopOptionsMenuModal}
        setShowTopOptionsMenuModal={setShowTopOptionsMenuModal}
        currentAppRole={currentAppRole}
        isRoomLocked={isRoomLocked}
        setRoomLockStatus={setRoomLockStatus}
        setChatMessages={setChatMessages}
        isChatLocked={isChatLocked}
        setIsChatLocked={setIsChatLocked}
        setShowRoomBackgroundStoreModal={setShowRoomBackgroundStoreModal}
        isIncognito={isIncognito}
        setIsIncognito={setIsIncognito}
        showCountersOnMics={showCountersOnMics}
        stopCounter={stopCounter}
        setShowCountersOnMics={setShowCountersOnMics}
        hostSeat={hostSeat}
        setNormalRoundResultData={setNormalRoundResultData}
        setShowNormalRoundResultModal={setShowNormalRoundResultModal}
        setSeatCounters={setSeatCounters}
        setIsCounterRunning={setIsCounterRunning}
        setIsCounterPaused={setIsCounterPaused}
        setRoomUptimeSeconds={setRoomUptimeSeconds}
        setShowRoomInfoModal={setShowRoomInfoModal}
        setShowTeamBattleModal={setShowTeamBattleModal}
        setShowModeratorStatsModal={setShowModeratorStatsModal}
        setShowRoomSupportModal={setShowRoomSupportModal}
        currentRoomTitle={currentRoomTitle}
        showYoHoBottomToolsModal={showYoHoBottomToolsModal}
        setShowYoHoBottomToolsModal={setShowYoHoBottomToolsModal}
        roomId={roomId}
        isRoomSpeakerMuted={isRoomSpeakerMuted}
        setIsRoomSpeakerMuted={setIsRoomSpeakerMuted}
        voiceEngineRef={voiceEngineRef}
        isNoiseSuppressionEnabled={isNoiseSuppressionEnabled}
        handleToggleNoiseSuppression={handleToggleNoiseSuppression}
        audioStreamMode={audioStreamMode}
        handleToggleAudioStreamMode={handleToggleAudioStreamMode}
        setShowLuckyChestModal={setShowLuckyChestModal}
        setIsCinemaWatchMode={setIsCinemaWatchMode}
        setShowCinemaVideoPickerModal={setShowCinemaVideoPickerModal}
        triggerRoomEntrance={triggerRoomEntrance}
        triggerBatchRoomEntrance={triggerBatchRoomEntrance}
        currentUserName={currentUserName}
        showCinemaVideoPickerModal={showCinemaVideoPickerModal}
        selectedCinemaVideo={selectedCinemaVideo}
        videoSuggestions={videoSuggestions}
        setSelectedCinemaVideo={setSelectedCinemaVideo}
        updateRoomCinemaInFirestore={updateRoomCinemaInFirestore}
        handleSuggestVideo={handleSuggestVideo}
        handleAcceptSuggestion={handleAcceptSuggestion}
        handleDeleteSuggestion={handleDeleteSuggestion}
        showLuckyChestModal={showLuckyChestModal}
        handleSendLuckyChest={handleSendLuckyChest}
        userCoins={userCoins}
        showLuckyChestClaimModal={showLuckyChestClaimModal}
        setShowLuckyChestClaimModal={setShowLuckyChestClaimModal}
        selectedChestForClaim={selectedChestForClaim}
        hostName={hostName}
        handleClaimLuckyChestPrize={handleClaimLuckyChestPrize}
        showRoomBackgroundStoreModal={showRoomBackgroundStoreModal}
        currentRoomBgUrl={currentRoomBgUrl}
        setCurrentRoomBgUrl={setCurrentRoomBgUrl}
        setCurrentRoomBgName={setCurrentRoomBgName}
        saveRoomStateToCache={saveRoomStateToCache}
        preloadWallpaperSilently={preloadWallpaperSilently}
        showYoHoMessagesModal={showYoHoMessagesModal}
        setShowYoHoMessagesModal={setShowYoHoMessagesModal}
        privateChatTargetUser={privateChatTargetUser}
        setPrivateChatTargetUser={setPrivateChatTargetUser}
        showCounterControlModal={showCounterControlModal}
        setShowCounterControlModal={setShowCounterControlModal}
        selectedSeatForCounterControl={selectedSeatForCounterControl}
        seatCounters={seatCounters}
        setIsTeamBattleActive={setIsTeamBattleActive}
        setTeamBattleStatus={setTeamBattleStatus}
        setTeamBattleTimer={setTeamBattleTimer}
        setOwnerJoinedTeam={setOwnerJoinedTeam}
        setRedTeamScore={setRedTeamScore}
        setBlueTeamScore={setBlueTeamScore}
        setPkTopSupportersMap={setPkTopSupportersMap}
        showNormalRoundResultModal={showNormalRoundResultModal}
        normalRoundResultData={normalRoundResultData}
        showTeamBattleResultModal={showTeamBattleResultModal}
        setShowTeamBattleResultModal={setShowTeamBattleResultModal}
        pkResultData={pkResultData}
        showRoomInfoModal={showRoomInfoModal}
        currentRoomAvatar={currentRoomAvatar}
        setCurrentUserRole={setCurrentUserRole}
        setShowSettingsDrawer={setShowSettingsDrawer}
        setCurrentRoomTitle={setCurrentRoomTitle}
        saveRoomThemeAndWallpaperToFirestore={saveRoomThemeAndWallpaperToFirestore}
        setCurrentRoomAvatar={setCurrentRoomAvatar}
        showRoomExitModal={showRoomExitModal}
        setShowRoomExitModal={setShowRoomExitModal}
        handleKeepInBackground={handleKeepInBackground}
        handleSoloExit={handleSoloExit}
        handleDissolveRoom={handleDissolveRoom}
        showFullUserProfileModal={showFullUserProfileModal}
        setShowFullUserProfileModal={setShowFullUserProfileModal}
        fullProfileUser={fullProfileUser}
        showAdvancedProfileModal={showAdvancedProfileModal}
        selectedUserForProfile={selectedUserForProfile}
        handleKickFromRoom={handleKickFromRoom}
        setInputMessage={setInputMessage}
        setShowChatInputModal={setShowChatInputModal}
        setFullProfileUser={setFullProfileUser}
        showAudienceModal={showAudienceModal}
        targetInviteSeatId={targetInviteSeatId}
        availableAudienceForInvite={availableAudienceForInvite}
        invitedUserIds={invitedUserIds}
        handleDirectInviteToMic={handleDirectInviteToMic}
        handleUserExitRoom={handleUserExitRoom}
        showFamilyModal={showFamilyModal}
        setShowFamilyModal={setShowFamilyModal}
        showSuperLegendModal={showSuperLegendModal}
        setShowSuperLegendModal={setShowSuperLegendModal}
        onOpenRecharge={onOpenRecharge}
        showHostProfileModal={showHostProfileModal}
        setShowHostProfileModal={setShowHostProfileModal}
        showEmojiPicker={showEmojiPicker}
        setShowEmojiPicker={setShowEmojiPicker}
        handleSendEmojiReaction={handleSendEmojiReaction}
        showGiftDrawer={showGiftDrawer}
        userCoinsBalance={userCoinsBalance}
        selectedGiftTargetSeatIds={selectedGiftTargetSeatIds}
        handleSendGift={handleSendGift}
        activeSeats={activeSeats}
        activeRefundDrawResult={activeRefundDrawResult}
        setActiveRefundDrawResult={setActiveRefundDrawResult}
        showSettingsDrawer={showSettingsDrawer}
        showGamesDrawer={showGamesDrawer}
        setShowGamesDrawer={setShowGamesDrawer}
      />

      {/* FLOATING ACTION TOAST NOTIFICATION BANNER */}
      <AnimatePresence>
        {toastNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 font-black px-4 py-2 rounded-2xl shadow-[0_0_30px_rgba(245,158,11,0.7)] border border-amber-200 text-xs text-center dir-rtl pointer-events-none"
          >
            {toastNotification}
          </motion.div>
        )}
      </AnimatePresence>








    </div>
  );
};

export default VoiceRoomScreen;

