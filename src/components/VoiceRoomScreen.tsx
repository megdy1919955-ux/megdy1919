import React, { useState, useEffect, useRef } from 'react';
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
  Wrench,
  User,
  Clock,
  Swords,
  HelpCircle,
  Maximize2,
  Minimize2,
  Palette,
  Moon,
  Sun,
  Search,
  Clapperboard,
  Film,
  Tv,
  Youtube,
  Lightbulb,
  Play
} from 'lucide-react';
import { RedCinemaSeat } from './RedCinemaSeat';
import { CinemaYouTubePickerModal, CinemaVideoItem, VideoSuggestion } from './CinemaYouTubePickerModal';
import { FamilyModal } from './FamilyModal';
import { SuperLegendModal } from './SuperLegendModal';
import { RoomInfoModal } from './RoomInfoModal';
import { LeaderboardThemeModal } from './LeaderboardThemeModal';
import { LeaderboardThemeConfig } from '../types/leaderboardTheme';
import { getSavedLeaderboardTheme } from '../lib/leaderboardThemeService';
import { LottieReactionPlayer } from './LottieReactionPlayer';
import { DevConfigModal } from './DevConfigModal';
import { precacheAllLottieAssets, getStoredEmojiConfigs, EmojiLottieConfig } from '../lib/lottieCache';
import { HostProfileModal } from './HostProfileModal';
import { AdvancedUserProfileModal, UserProfileData } from './AdvancedUserProfileModal';
import { SeatActionModal } from './SeatActionModal';
import { QuickMicOptionsModal } from './QuickMicOptionsModal';
import { MicRequestQueueModal, MicRequestItem } from './MicRequestQueueModal';
import { ProfessionalGiftPanel, GiftItem } from './ProfessionalGiftPanel';
import { MusicPlayerModal } from './MusicPlayerModal';
import { EffectsAndSoundModal } from './EffectsAndSoundModal';
import { MovableEmojiLottiePicker } from './MovableEmojiLottiePicker';
import { TopOptionsMenuModal } from './TopOptionsMenuModal';
import { DigitalCounterControlModal } from './DigitalCounterControlModal';
import { RoomBackgroundStoreModal } from './RoomBackgroundStoreModal';
import { YoHoRoomToolsAndGamesModal } from './YoHoRoomToolsAndGamesModal';
import { TeamBattleModal } from './TeamBattleModal';
import { TeamBattleResultModal, PKSupporter } from './TeamBattleResultModal';
import { NormalRoundResultModal, NormalRoundResultData } from './NormalRoundResultModal';
import { DynamicAnchoredGiftOverlay, DynamicFlyingGift } from './DynamicAnchoredGiftOverlay';
import { MainRoomCustomizerModal } from './MainRoomCustomizerModal';
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
import { SideGiftStream, SideGiftEvent } from './SideGiftStream';
import { processRefundGiftDraw, isRefundGift, RefundDrawResult } from '../lib/refundVaultService';
import {
  AppRole,
  getActiveAppRole,
  APP_ROLES,
  canAccessBottomControlBar,
  canManageGifts,
  isDeveloper
} from '../lib/roleService';

interface VoiceRoomScreenProps {
  roomTitle?: string;
  hostName?: string;
  roomId?: string;
  isOwner?: boolean;
  onClose: () => void;
  onOpenRecharge?: () => void;
  onNavigateToRoom?: (roomName: string) => void;
}

interface MicSeat {
  id: number;
  userId?: string;
  userName: string;
  avatar?: string;
  isHost?: boolean;
  isMuted?: boolean;
  isMutedByAdmin?: boolean;
  isSpeaking?: boolean;
  isEmpty?: boolean;
  isLocked?: boolean;
  speakingAura?: SpeakingAuraType;
}

export type SpeakingAuraType = 'default' | 'gold_fire' | 'neon_purple' | 'cyan_plasma' | 'royal_ruby';
export type BubbleSkinType = 'red_gold' | 'royal_gold' | 'cyber_neon' | 'pink_velvet' | 'emerald_luxury' | 'default';

// Helper function to format digital counter values with clean short suffixes (K, M)
export const formatCounterNumber = (val: number): string => {
  if (!val || val <= 0) return '0';
  if (val >= 1000000) {
    const formatted = (val / 1000000).toFixed(1);
    return formatted.endsWith('.0') ? `${Math.floor(val / 1000000)}M` : `${formatted}M`;
  }
  if (val >= 1000) {
    const formatted = (val / 1000).toFixed(1);
    return formatted.endsWith('.0') ? `${Math.floor(val / 1000)}K` : `${formatted}K`;
  }
  return val.toString();
};

export interface RibbonMilestoneTheme {
  name: string;
  gradientStops: Array<{ offset: string; stopColor: string }>;
  foldColor: string;
  shadowColor: string;
  strokeColor: string;
}

// Helper function for Dynamic Color Shifting Based on Gift Milestones per Seat
export const getRibbonMilestoneTheme = (val: number = 0): RibbonMilestoneTheme => {
  if (val >= 1000000) { // 1M+ Legendary Gold/Amber Fire
    return {
      name: 'الذهبي الأسطوري (1M+)',
      gradientStops: [
        { offset: '0%', stopColor: '#f59e0b' },
        { offset: '35%', stopColor: '#fbbf24' },
        { offset: '70%', stopColor: '#f59e0b' },
        { offset: '100%', stopColor: '#ea580c' },
      ],
      foldColor: '#b45309',
      shadowColor: '#78350f',
      strokeColor: 'rgba(254, 240, 138, 0.95)',
    };
  }
  if (val >= 100000) { // 100K+ Royal Diamond / Ruby Red
    return {
      name: 'الياقوتي الملكي (100K+)',
      gradientStops: [
        { offset: '0%', stopColor: '#e11d48' },
        { offset: '35%', stopColor: '#f43f5e' },
        { offset: '70%', stopColor: '#e11d48' },
        { offset: '100%', stopColor: '#9f1239' },
      ],
      foldColor: '#881337',
      shadowColor: '#4c0519',
      strokeColor: 'rgba(254, 205, 211, 0.85)',
    };
  }
  if (val >= 10000) { // 10K+ Cyber Purple / Violet
    return {
      name: 'النيون البنفسجي (10K+)',
      gradientStops: [
        { offset: '0%', stopColor: '#8b5cf6' },
        { offset: '35%', stopColor: '#d946ef' },
        { offset: '70%', stopColor: '#a855f7' },
        { offset: '100%', stopColor: '#6366f1' },
      ],
      foldColor: '#5b21b6',
      shadowColor: '#3b0764',
      strokeColor: 'rgba(245, 208, 254, 0.85)',
    };
  }
  if (val >= 1000) { // 1K+ Oceanic Cyan / Sky Blue
    return {
      name: 'السماوي البلازمي (1K+)',
      gradientStops: [
        { offset: '0%', stopColor: '#0284c7' },
        { offset: '35%', stopColor: '#38bdf8' },
        { offset: '70%', stopColor: '#0284c7' },
        { offset: '100%', stopColor: '#0d9488' },
      ],
      foldColor: '#0369a1',
      shadowColor: '#0c4a6e',
      strokeColor: 'rgba(186, 230, 253, 0.85)',
    };
  }
  // Standard Emerald Green (0 - 999)
  return {
    name: 'الزمردي الكلاسيكي (0-999)',
    gradientStops: [
      { offset: '0%', stopColor: '#10b981' },
      { offset: '35%', stopColor: '#22c55e' },
      { offset: '70%', stopColor: '#10b981' },
      { offset: '100%', stopColor: '#06b6d4' },
    ],
    foldColor: '#047857',
    shadowColor: '#064e3b',
    strokeColor: 'rgba(255, 255, 255, 0.5)',
  };
};

// Helper function to return dynamic speaking aura rings & avatar frame glow based on equipped aura item from shop
export const getSpeakingAuraStyles = (aura: SpeakingAuraType = 'default') => {
  switch (aura) {
    case 'gold_fire':
      return {
        ring1Class: 'border-2 border-amber-400 shadow-[0_0_14px_rgba(245,158,11,0.85)]',
        ring2Class: 'border border-amber-400/70 shadow-[0_0_18px_rgba(245,158,11,0.5)]',
        ring3Class: 'border border-dashed border-yellow-300/60',
        avatarBorderClass: 'from-amber-400 via-yellow-300 to-amber-500 shadow-[0_0_18px_rgba(245,158,11,0.9)]',
        scale1: [1, 1.25, 1],
        opacity1: [0.85, 0.25, 0.85],
        scale2: [1, 1.42, 1],
        opacity2: [0.65, 0.1, 0.65],
      };
    case 'neon_purple':
      return {
        ring1Class: 'border-2 border-purple-400 shadow-[0_0_14px_rgba(168,85,247,0.85)]',
        ring2Class: 'border border-pink-400/70 shadow-[0_0_18px_rgba(236,72,153,0.5)]',
        ring3Class: 'border border-dashed border-fuchsia-300/60',
        avatarBorderClass: 'from-purple-400 via-fuchsia-300 to-pink-500 shadow-[0_0_18px_rgba(168,85,247,0.9)]',
        scale1: [1, 1.25, 1],
        opacity1: [0.85, 0.25, 0.85],
        scale2: [1, 1.42, 1],
        opacity2: [0.65, 0.1, 0.65],
      };
    case 'cyan_plasma':
      return {
        ring1Class: 'border-2 border-cyan-400 shadow-[0_0_14px_rgba(6,182,212,0.85)]',
        ring2Class: 'border border-teal-400/70 shadow-[0_0_18px_rgba(20,184,166,0.5)]',
        ring3Class: 'border border-dashed border-emerald-300/60',
        avatarBorderClass: 'from-cyan-400 via-teal-300 to-emerald-400 shadow-[0_0_18px_rgba(6,182,212,0.9)]',
        scale1: [1, 1.25, 1],
        opacity1: [0.85, 0.25, 0.85],
        scale2: [1, 1.42, 1],
        opacity2: [0.65, 0.1, 0.65],
      };
    case 'royal_ruby':
      return {
        ring1Class: 'border-2 border-rose-500 shadow-[0_0_14px_rgba(244,63,94,0.85)]',
        ring2Class: 'border border-red-400/70 shadow-[0_0_18px_rgba(239,68,68,0.5)]',
        ring3Class: 'border border-dashed border-pink-300/60',
        avatarBorderClass: 'from-rose-500 via-pink-400 to-red-600 shadow-[0_0_18px_rgba(244,63,94,0.9)]',
        scale1: [1, 1.25, 1],
        opacity1: [0.85, 0.25, 0.85],
        scale2: [1, 1.42, 1],
        opacity2: [0.65, 0.1, 0.65],
      };
    case 'default':
    default:
      // ULTRA-SUBTLE & EYE-FRIENDLY WHITE SPEAKING WAVE (توهج خفيف جداً وهادئ ومريح للعين مع حركة ناعمة)
      return {
        ring1Class: 'border border-white/35 bg-white/5 shadow-[0_0_8px_rgba(255,255,255,0.2)]',
        ring2Class: 'border border-white/20 shadow-[0_0_10px_rgba(255,255,255,0.15)]',
        ring3Class: 'border border-dashed border-white/15 shadow-none',
        avatarBorderClass: 'from-white/60 via-slate-200/40 to-white/60 shadow-[0_0_8px_rgba(255,255,255,0.3)] ring-1 ring-white/40',
        scale1: [1, 1.12, 1],
        opacity1: [0.4, 0.1, 0.4],
        scale2: [1, 1.2, 1],
        opacity2: [0.25, 0.05, 0.25],
      };
  }
};

// Dynamic row partition generator matching getPresetRowLayout
const getRowLayoutForCount = (count: number): number[] => {
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

// Helper function to return team assignment for Team Battle PK based on seat ID & active mic count
export const getTeamForSeat = (
  seatId: number,
  activeMicCount: number,
  ownerJoinedTeam: 'none' | 'red' | 'blue' = 'none'
): 'red' | 'blue' | 'none' => {
  const rowCounts = getRowLayoutForCount(activeMicCount);
  let currentSeatStart = 1;

  for (const rc of rowCounts) {
    if (seatId >= currentSeatStart && seatId < currentSeatStart + rc) {
      // Index inside this row (0-based, from Right to Left in RTL visual layout)
      const indexInRow = seatId - currentSeatStart;
      if (rc === 1 || seatId === 1) {
        // Single top center mic -> Owner/Host mic follows ownerJoinedTeam selection
        return ownerJoinedTeam;
      }
      // Right half of row -> 'red', Left half of row -> 'blue'
      const rightHalfSize = Math.ceil(rc / 2);
      return indexInRow < rightHalfSize ? 'red' : 'blue';
    }
    currentSeatStart += rc;
  }

  // Fallback if seatId exceeds layout
  if (seatId === 1) return ownerJoinedTeam;
  return seatId <= Math.ceil(activeMicCount / 2) ? 'red' : 'blue';
};

export interface BadgeItem {
  id: string;
  label?: string;
  icon?: string;
  type?: 'vip' | 'level' | 'role' | 'supporter';
  bgClass: string;
}

interface ChatMessage {
  id: string;
  userName: string;
  avatar?: string;
  text: string;
  userColor?: string;
  isGift?: boolean;
  isHost?: boolean;
  badges?: BadgeItem[];
  bubbleSkin?: BubbleSkinType;
  replyTo?: {
    id: string;
    userName: string;
    text: string;
  };
}

// Helper function to return dynamic chat bubble skin styling based on equipped skin item
const getBubbleStyles = (skin: BubbleSkinType = 'default', isHost?: boolean, isGift?: boolean) => {
  const baseClasses = 'w-fit max-w-[75%] self-start break-words [overflow-wrap:anywhere] [word-break:break-word] rounded-2xl text-xs rounded-tr-xs shadow-xs transition-all duration-200 overflow-hidden';

  if (isGift) {
    return `${baseClasses} bg-gradient-to-r from-pink-950/90 via-purple-950/90 to-pink-950/90 border border-pink-500/50 text-pink-200 px-2.5 py-1 text-[10.5px]`;
  }

  switch (skin) {
    case 'red_gold':
      // Red Ornate Gold Skin (الفقاعة الحمراء المزخرفة بالذهب)
      return `${baseClasses} relative bg-gradient-to-r from-red-950 via-rose-950 to-amber-950 border-2 border-amber-400/90 text-amber-100 shadow-[0_0_15px_rgba(245,158,11,0.35)] px-3 py-1.5`;
    case 'royal_gold':
      // Royal Golden Velvet Skin
      return `${baseClasses} relative bg-gradient-to-r from-amber-950 via-yellow-950 to-amber-950 border border-amber-300/80 text-amber-100 shadow-[0_0_12px_rgba(245,158,11,0.25)] px-3 py-1.5`;
    case 'cyber_neon':
      // Cyber Cyan Neon Skin
      return `${baseClasses} relative bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 border border-cyan-400/80 text-cyan-100 shadow-[0_0_12px_rgba(6,182,212,0.3)] px-3 py-1.5`;
    case 'pink_velvet':
      // Pink Velvet Skin
      return `${baseClasses} relative bg-gradient-to-r from-fuchsia-950 via-pink-950 to-purple-950 border border-pink-400/80 text-pink-100 shadow-[0_0_12px_rgba(236,72,153,0.3)] px-3 py-1.5`;
    case 'emerald_luxury':
      // Emerald Luxury Skin
      return `${baseClasses} relative bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 border border-emerald-400/80 text-emerald-100 shadow-[0_0_12px_rgba(16,185,129,0.3)] px-3 py-1.5`;
    case 'default':
    default:
      if (isHost) {
        return `${baseClasses} bg-gradient-to-r from-amber-950/90 via-amber-900/90 to-amber-950/90 border border-amber-500/60 text-amber-100 px-3 py-1.5`;
      }
      return `${baseClasses} bg-[#121827]/85 border border-white/10 text-slate-100 px-3 py-1.5`;
  }
};

interface FloatingEffect {
  id: string;
  emoji: string;
  x: number;
}

interface RoomChatFeedProps {
  chatMessages: ChatMessage[];
  onReplyTo: (reply: { id: string; userName: string; text: string; avatar?: string }) => void;
  onOpenChatInput: () => void;
  onOpenUserProfile?: (userData: UserProfileData) => void;
}

const RoomChatFeed = React.memo(({ chatMessages, onReplyTo, onOpenChatInput, onOpenUserProfile }: RoomChatFeedProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [highlightedMessageId, setHighlightedMessageId] = useState<string | null>(null);

  // Auto-scroll isolated strictly to this container only (No window.scrollIntoView to prevent room screen jitter)
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [chatMessages]);

  const scrollToMessage = (messageId: string) => {
    const container = scrollContainerRef.current;
    const el = document.getElementById(`chat-msg-${messageId}`);
    if (el && container) {
      const containerRect = container.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      const relativeTop = elRect.top - containerRect.top + container.scrollTop - (containerRect.height / 2) + (elRect.height / 2);

      container.scrollTo({
        top: relativeTop,
        behavior: 'smooth'
      });
      setHighlightedMessageId(messageId);
      setTimeout(() => {
        setHighlightedMessageId(null);
      }, 1800);
    }
  };

  return (
    <div
      className="flex-1 px-3 pt-1 pb-1 flex flex-col min-h-0 relative z-20 transition-all duration-300 overflow-hidden overflow-x-hidden w-full max-w-full isolate"
      style={{ contain: 'layout paint' }}
    >
      <div
        ref={scrollContainerRef}
        className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain pr-1.5 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-amber-500/30 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent w-full max-w-full"
      >
        <div className="min-h-full flex flex-col justify-end space-y-1.5 py-1 w-full max-w-full overflow-x-hidden">
          {/* MOVING HOST ANNOUNCEMENT BOARD INSIDE CHAT STREAM */}
          <div className="bg-gradient-to-r from-amber-950/80 via-amber-900/90 to-amber-950/80 border border-amber-500/50 rounded-2xl p-2.5 mb-1 shadow-lg backdrop-blur-md relative overflow-hidden shrink-0 w-full max-w-full">
            <div className="flex items-center justify-between gap-1 border-b border-amber-500/30 pb-1 mb-1">
              <div className="flex items-center gap-1.5 text-amber-300 font-black text-[11px]">
                <Crown className="w-4 h-4 fill-amber-400 text-amber-300 animate-bounce" />
                <span>[دخول المضيف] لوحة إعلانات ودليل الغرفة</span>
              </div>
              <span className="text-[10px] bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full font-black shadow-xs">
                أميرة الشرق 👑
              </span>
            </div>

            {/* MOVING TICKER TEXT INSIDE CHAT */}
            <div className="overflow-hidden relative w-full h-5 flex items-center">
              <motion.div
                animate={{ x: ['100%', '-100%'] }}
                transition={{ repeat: Infinity, duration: 15, ease: 'linear' }}
                className="whitespace-nowrap text-[11px] font-bold text-amber-100 flex items-center gap-2 absolute"
              >
                <span>📜 <b>دليل واستخدام الغرفة:</b> أهلاً ومرحباً بالجميع! يرجى الالتزام بالاحترام المتبادل على المايكات، ويمنع استخدام الكلمات غير اللائقة. استمتعوا بالأمسية الموسيقية 🎵</span>
              </motion.div>
            </div>
          </div>

          {/* REGULAR CHAT MESSAGES WITH AVATARS, CONDITIONAL BADGES, DYNAMIC BUBBLE SKINS & SWIPE TO REPLY */}
          <AnimatePresence initial={false}>
            {chatMessages.map((msg) => {
              const isHighlighted = highlightedMessageId === msg.id;
              let hapticTriggered = false;

              return (
                <div key={msg.id} id={`chat-msg-${msg.id}`} className="relative my-1 w-full max-w-full overflow-x-hidden touch-pan-y">
                  <motion.div
                    drag="x"
                    dragDirectionLock={true}
                    dragConstraints={{ left: -65, right: 0 }}
                    dragElastic={0.1}
                    dragSnapToOrigin={true}
                    onDrag={(_, info) => {
                      if (info.offset.x < -30 && !hapticTriggered) {
                        hapticTriggered = true;
                        if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
                          try {
                            window.navigator.vibrate(12);
                          } catch (_) {}
                        }
                      }
                    }}
                    onDragEnd={(_, info) => {
                      if (info.offset.x < -30) {
                        onReplyTo({
                          id: msg.id,
                          userName: msg.userName,
                          text: msg.text,
                          avatar: msg.avatar
                        });
                        onOpenChatInput();
                      }
                    }}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20, height: 0, marginTop: 0, marginBottom: 0, overflow: 'hidden' }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className={`flex items-start gap-2 text-xs w-full max-w-full pr-3 pl-1 py-1 rounded-2xl ${
                      isHighlighted
                        ? 'ring-2 ring-amber-400 bg-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.6)] z-30 transition-colors duration-300'
                        : ''
                    }`}
                  >
                    {/* 1. Speaker Profile Picture Avatar */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenUserProfile?.({
                          id: msg.id,
                          name: msg.userName,
                          avatar: msg.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
                          userId: `884${msg.id.slice(-4)}`,
                          country: 'السعودية',
                          countryFlag: '🇸🇦',
                          isHost: msg.isHost
                        });
                      }}
                      className="relative shrink-0 mt-0.5 ml-0.5 cursor-pointer hover:scale-105 transition-transform"
                      title="انقر لمعاينة بطاقة البروفايل"
                    >
                      <img
                        src={
                          msg.avatar ||
                          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'
                        }
                        alt={msg.userName}
                        className={`w-7 h-7 rounded-full object-cover border shadow-xs ${
                          msg.isHost
                            ? 'border-amber-400 ring-2 ring-amber-500/40'
                            : 'border-white/20'
                        }`}
                      />
                      {msg.isHost && (
                        <div className="absolute -top-1.5 -right-1 z-10">
                          <Crown className="w-3.5 h-3.5 text-amber-300 fill-amber-400 drop-shadow-md animate-bounce" />
                        </div>
                      )}
                    </div>

                    {/* Chat Content Column: Header (Name + Badges) & Dynamic Bubble */}
                    <div className="flex flex-col min-w-0 flex-1">
                      {/* User Header: Name + Conditional Badges + Quick Reply Trigger */}
                      <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenUserProfile?.({
                              id: msg.id,
                              name: msg.userName,
                              avatar: msg.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
                              userId: `884${msg.id.slice(-4)}`,
                              country: 'السعودية',
                              countryFlag: '🇸🇦',
                              isHost: msg.isHost
                            });
                          }}
                          className={`font-black text-[11px] truncate cursor-pointer hover:underline ${
                            msg.userColor || (msg.isHost ? 'text-amber-300' : 'text-slate-200')
                          }`}
                          title="انقر لمعاينة بطاقة البروفايل"
                        >
                          {msg.userName}
                        </span>

                        {/* CONDITIONAL BADGES / MEDALS */}
                        {msg.badges && msg.badges.length > 0 && (
                          <div className="flex items-center gap-1 flex-wrap">
                            {msg.badges.map((badge) => (
                              <span
                                key={badge.id}
                                className={`text-[8.5px] px-1.5 py-0.2 rounded-full font-black flex items-center gap-0.5 shadow-2xs shrink-0 ${badge.bgClass}`}
                              >
                                {badge.icon && <span className="text-[9px]">{badge.icon}</span>}
                                <span>{badge.label}</span>
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Quick Reply Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onReplyTo({
                              id: msg.id,
                              userName: msg.userName,
                              text: msg.text,
                              avatar: msg.avatar
                            });
                            onOpenChatInput();
                          }}
                          className="mr-auto opacity-40 hover:opacity-100 text-amber-300 p-0.5 hover:bg-white/10 rounded-full transition-all cursor-pointer"
                          title="رد على هذه الرسالة"
                        >
                          <CornerUpLeft className="w-3 h-3" />
                        </button>
                      </div>

                      {/* DYNAMIC CHAT BUBBLE SKIN CONTAINER */}
                      <div className={getBubbleStyles(msg.bubbleSkin, msg.isHost, msg.isGift)}>
                        {/* QUOTED MESSAGE SUB-CARD */}
                        {msg.replyTo && (
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              scrollToMessage(msg.replyTo!.id);
                            }}
                            className="mb-1.5 p-1.5 rounded-xl bg-black/40 border-r-3 border-amber-400 text-[10px] cursor-pointer hover:bg-black/60 transition-all flex items-center justify-between gap-2 group/reply shadow-inner"
                          >
                            <div className="flex flex-col min-w-0">
                              <span className="font-extrabold text-amber-300 text-[9.5px]">@{msg.replyTo.userName}</span>
                              <span className="text-slate-200 truncate text-[9px] font-medium">{msg.replyTo.text}</span>
                            </div>
                            <div className="flex items-center gap-1 shrink-0 bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded-md text-[8px] font-black group-hover/reply:bg-amber-400 group-hover/reply:text-slate-950 transition-colors">
                              <span>انتقال</span>
                              <CornerUpLeft className="w-2.5 h-2.5" />
                            </div>
                          </div>
                        )}

                        <div className="flex flex-wrap items-center gap-1.5 break-words [overflow-wrap:anywhere] [word-break:break-word] max-w-full">
                          <span
                            className={`font-bold break-words [overflow-wrap:anywhere] [word-break:break-word] leading-relaxed ${
                              msg.isGift ? 'text-pink-100 text-[10.5px]' : 'text-slate-100 text-xs'
                            }`}
                          >
                            {msg.text}
                          </span>
                          {msg.isGift && (
                            <span className="text-[8px] bg-pink-500/20 text-pink-300 font-extrabold px-1 py-0.2 rounded border border-pink-400/30 shrink-0 mr-0.5">
                              ⏱️ 10ث
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
});

export const VoiceRoomScreen: React.FC<VoiceRoomScreenProps> = ({
  roomTitle = 'روم صقر اليمن 🦅 - سوالف وتر',
  hostName = 'أميرة الشرق',
  roomId = '7798my-r',
  isOwner: isOwnerProp = true,
  onClose,
  onOpenRecharge,
  onNavigateToRoom
}) => {
  // Current active room title state (allows seamless redirection & custom rename by Owner)
  const [currentRoomTitle, setCurrentRoomTitle] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(`super_legend_room_title_${roomId}`);
      if (saved) return saved;
    } catch (e) {}
    return roomTitle;
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

  // Unified Flexible Mic Seats State (Seats 1 to 20 - Equal Permissions & Free Positioning)
  const [allMicSeats, setAllMicSeats] = useState<MicSeat[]>([
    {
      id: 1,
      userId: '8841001',
      userName: 'أميرة الشرق',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
      isHost: true,
      isMuted: false,
      isSpeaking: true,
      isEmpty: false
    },
    {
      id: 2,
      userId: '8842002',
      userName: 'سارة الك...',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
      isMuted: false,
      isSpeaking: true,
      isEmpty: false
    },
    {
      id: 3,
      userId: '8843003',
      userName: 'خالد...',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      isMuted: true,
      isMutedByAdmin: true,
      isSpeaking: false,
      isEmpty: false
    },
    {
      id: 4,
      userId: '8844004',
      userName: 'ريما...',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
      isMuted: false,
      isSpeaking: false,
      isEmpty: false
    },
    {
      id: 5,
      userName: '',
      isEmpty: true,
      isLocked: true
    },
    ...Array.from({ length: 15 }, (_, i) => ({
      id: i + 6,
      userName: '',
      isEmpty: true
    }))
  ]);

  // Host Seat derived dynamically for info panels and headers
  const hostSeat = allMicSeats.find((s) => s.isHost && !s.isEmpty) || allMicSeats[0];

  // User Profile ID & Role Definitions
  const CURRENT_USER_PROFILE_ID = '88492011';

  // Helper to map AppRole to Room Role
  const mapAppRoleToRoomRole = (role: AppRole): 'owner' | 'host' | 'moderator' | 'guest' => {
    if (role === 'developer' || role === 'owner' || role === 'designer') return 'owner';
    if (role === 'host') return 'host';
    if (role === 'moderator') return 'moderator';
    return 'guest';
  };

  const [currentAppRole, setCurrentAppRole] = useState<AppRole>(() => getActiveAppRole());
  const [currentUserRole, setCurrentUserRole] = useState<'owner' | 'host' | 'moderator' | 'guest'>(() => {
    const active = getActiveAppRole();
    return mapAppRoleToRoomRole(active);
  });

  const canShowBottomBar = canAccessBottomControlBar(currentAppRole);

  useEffect(() => {
    const handleRoleChanged = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.role) {
        const nextRole = customEvent.detail.role as AppRole;
        setCurrentAppRole(nextRole);
        const nextRoomRole = mapAppRoleToRoomRole(nextRole);
        setCurrentUserRole(nextRoomRole);
        const title = customEvent.detail.roleInfo?.title || customEvent.detail.role;
        setToastNotification(`تم تطبيق صلاحيات: ${title} 🛡️`);
        setTimeout(() => setToastNotification(null), 3000);
      }
    };

    const handlePermissionsUpdated = () => {
      setCurrentAppRole(getActiveAppRole());
    };

    window.addEventListener('app_role_changed', handleRoleChanged);
    window.addEventListener('app_permissions_updated', handlePermissionsUpdated);
    return () => {
      window.removeEventListener('app_role_changed', handleRoleChanged);
      window.removeEventListener('app_permissions_updated', handlePermissionsUpdated);
    };
  }, []);
  const isCurrentAdmin = currentUserRole === 'owner' || currentUserRole === 'moderator';
  const isOwner = currentUserRole === 'owner';

  const [userMuteStates, setUserMuteStates] = useState<Record<string, boolean>>({
    [CURRENT_USER_PROFILE_ID]: false,
    '8841001': false,
    '8842002': false,
    '8843003': true,
    '8844004': false
  });

  // Current User Mic Mute State derived directly from user profile account state
  const isMyMicMuted = Boolean(userMuteStates[CURRENT_USER_PROFILE_ID]);

  // Derived current user occupied seat and admin mute status
  const myOccupiedSeat = allMicSeats.find(
    (s) =>
      !s.isEmpty &&
      (s.userId === CURRENT_USER_PROFILE_ID ||
        s.userName.includes('أنا') ||
        (currentUserRole === 'host' && s.isHost))
  );
  const isMySeatMutedByAdmin = Boolean(myOccupiedSeat?.isMuted && myOccupiedSeat?.isMutedByAdmin);
  // Supporter Coins Balance with real-time automatic persistence
  const getInitialUserCoins = (): number => {
    try {
      const saved = localStorage.getItem('user_wallet_coins');
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed > 0) return parsed;
      }
    } catch {
      // ignore localStorage errors
    }
    return 40000000;
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

  useEffect(() => {
    try {
      localStorage.setItem('user_wallet_coins', userCoinsBalance.toString());
      window.dispatchEvent(
        new CustomEvent('user_coins_updated', {
          detail: { coins: userCoinsBalance }
        })
      );
    } catch {
      // ignore
    }
  }, [userCoinsBalance]);

  useEffect(() => {
    const handleGlobalCoinsUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (typeof customEvent.detail?.coins === 'number' && customEvent.detail.coins !== userCoinsBalance) {
        setUserCoinsBalance(customEvent.detail.coins);
      }
    };
    window.addEventListener('user_coins_updated', handleGlobalCoinsUpdate);
    return () => {
      window.removeEventListener('user_coins_updated', handleGlobalCoinsUpdate);
    };
  }, [userCoinsBalance]);

  const [activeRefundDrawResult, setActiveRefundDrawResult] = useState<RefundDrawResult | null>(null);
  const [sideGiftEvents, setSideGiftEvents] = useState<SideGiftEvent[]>([]);

  const handleExpireSideGiftEvent = (id: string) => {
    setSideGiftEvents((prev) => prev.filter((ev) => ev.id !== id));
  };

  // Room Chat Lock State
  const [isChatLocked, setIsChatLocked] = useState(false);

  // Derived state: check if current user is currently seated on any mic
  const isUserOnMic = allMicSeats.some(
    (s) =>
      !s.isEmpty &&
      (s.userId === CURRENT_USER_PROFILE_ID ||
        s.userName.includes('أنا') ||
        s.userName === 'أنا (الزائر)' ||
        (currentUserRole === 'host' && s.isHost))
  );

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

  // Chat Feed State with Avatars, Conditional Badges, and Dynamic Bubble Skins
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'm-host-1',
      userName: 'أميرة الشرق (المضيفة)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
      text: 'أهلاً وسهلاً بجميع الحضور الكرام في روم السهرة! 🌟🎵',
      userColor: 'text-amber-300 font-extrabold',
      isHost: true,
      bubbleSkin: 'red_gold', // 🔴 Red Ornate Gold Skin equipped for Host
      badges: [
        { id: 'b1', label: 'VIP 10', icon: '👑', bgClass: 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 font-black' },
        { id: 'b2', label: 'LVL 90', icon: '🔥', bgClass: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black' },
        { id: 'b3', label: 'مضيف الغرفة', icon: '🎙️', bgClass: 'bg-amber-500/20 text-amber-300 border border-amber-400/40 font-bold' }
      ]
    },
    {
      id: 'm1',
      userName: 'مريم العتيبي',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
      text: 'أحلى روم صوتية اليوم 🎵 الشات فخم بالفقاعات والشارات!',
      userColor: 'text-cyan-300 font-bold',
      bubbleSkin: 'royal_gold',
      badges: [
        { id: 'b4', label: 'VIP 5', icon: '💎', bgClass: 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold' }
      ]
    },
    {
      id: 'm2',
      userName: 'أصيل العدني',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      text: 'أهلاً بالجميع، سهرة ممتعة ✨',
      userColor: 'text-emerald-300 font-bold',
      bubbleSkin: 'default'
      // NO badges: Space is completely hidden conditionally without gaps!
    },
    {
      id: 'm3',
      userName: 'صقر الشام',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
      text: 'منورين يا شباب الصوت ممتاز جداً 🎙️ وسعيد بالوجود معكم!',
      userColor: 'text-amber-300 font-bold',
      bubbleSkin: 'cyber_neon',
      badges: [
        { id: 'b5', label: 'داعم ماسي 🏆', icon: '🏆', bgClass: 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black' }
      ],
      replyTo: {
        id: 'm-host-1',
        userName: 'أميرة الشرق (المضيفة)',
        text: 'أهلاً وسهلاً بجميع الحضور الكرام في روم السهرة! 🌟🎵'
      }
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [showChatInputModal, setShowChatInputModal] = useState(false);

  // Stabilize viewport and instantly eliminate keyboard dismissal scroll gaps
  useEffect(() => {
    const handleViewportReset = () => {
      if (!showChatInputModal) {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        if (document.body) document.body.scrollTop = 0;
        if (document.documentElement) document.documentElement.scrollTop = 0;
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportReset);
      window.visualViewport.addEventListener('scroll', handleViewportReset);
    }
    window.addEventListener('scroll', handleViewportReset, { passive: true });

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportReset);
        window.visualViewport.removeEventListener('scroll', handleViewportReset);
      }
      window.removeEventListener('scroll', handleViewportReset);
    };
  }, [showChatInputModal]);

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

  // Dynamic Lucky Chest Winner Notification Toast (Disappears automatically after 4.5s)
  const [activeLuckyChestWinnerNotice, setActiveLuckyChestWinnerNotice] = useState<LuckyChestWinnerNoticeData | null>(null);
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

  // Drawers & Modals
  const [showGiftDrawer, setShowGiftDrawer] = useState(false);
  const [selectedGiftTargetSeatIds, setSelectedGiftTargetSeatIds] = useState<number[]>([]);
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
  const [showMainRoomCustomizerModal, setShowMainRoomCustomizerModal] = useState(false);
  const [mainRoomConfig, setMainRoomConfig] = useState<MainRoomCustomizerConfig>(() => getMainRoomCustomizerConfig());
  const [currentRoomBgName, setCurrentRoomBgName] = useState<string>('القصر الملكي البنفسجي 🏰');

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
        setCurrentRoomBgUrl(customEvent.detail.wallpaperUrl);
        if (customEvent.detail.wallpaperName) {
          setCurrentRoomBgName(customEvent.detail.wallpaperName);
        }
      }
    };

    window.addEventListener('main_room_theme_updated', handleMainRoomThemeUpdated);
    window.addEventListener('room_wallpaper_updated', handleRoomWallpaperUpdated);

    // 2. Real-time Firestore subscription linked to room_id
    const unsubscribeFirestore = subscribeToRoomThemeFromFirestore(roomId, (cloudDoc) => {
      if (cloudDoc) {
        if (cloudDoc.themeConfig) {
          setMainRoomConfig(cloudDoc.themeConfig);
        }
        if (cloudDoc.wallpaperUrl) {
          setCurrentRoomBgUrl(cloudDoc.wallpaperUrl);
        }
        if (cloudDoc.wallpaperName) {
          setCurrentRoomBgName(cloudDoc.wallpaperName);
        }
        if (cloudDoc.roomTitle) {
          setCurrentRoomTitle(cloudDoc.roomTitle);
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

  // Cumulative Room Broadcast Hours Uptime Counter State (عداد ساعات البث المباشر المجمعة للروم)
  const [roomUptimeSeconds, setRoomUptimeSeconds] = useState(0);
  const [isRoomActive, setIsRoomActive] = useState(true);

  // Reset broadcast timer whenever scoreboard/counter display is toggled back on from hidden state
  const prevShowCountersOnMicsRef = useRef(showCountersOnMics);
  useEffect(() => {
    if (!prevShowCountersOnMicsRef.current && showCountersOnMics) {
      setRoomUptimeSeconds(0);
    }
    prevShowCountersOnMicsRef.current = showCountersOnMics;
  }, [showCountersOnMics]);

  // Interval timer for Room Uptime - accumulates while room is active and broadcast timer/scoreboard is visible
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isRoomActive && showCountersOnMics) {
      timer = setInterval(() => {
        setRoomUptimeSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRoomActive, showCountersOnMics]);

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

    // Trigger dynamic single rectangle notification that disappears after 4.5s
    const winnerName = hostSeat.userName || hostName || 'عابر سبيل';
    const winnerAvatar = hostSeat.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200';
    setActiveLuckyChestWinnerNotice({
      id: `chest_win_${Date.now()}`,
      userName: winnerName,
      avatar: winnerAvatar,
      wonAmount: wonAmt,
      chestType: (updatedChest || activeLuckyChests.find((c) => c.id === chestId))?.type || 'super'
    });

    if (luckyChestNoticeTimerRef.current) {
      clearTimeout(luckyChestNoticeTimerRef.current);
    }
    luckyChestNoticeTimerRef.current = setTimeout(() => {
      setActiveLuckyChestWinnerNotice(null);
    }, 4500);
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

  // Dynamic Dev Emoji Configurations synced in real-time
  const [emojiConfigs, setEmojiConfigs] = useState(() => getStoredEmojiConfigs());

  // Pre-cache all Lottie assets on voice room mount and keep synced with Dev Manager
  useEffect(() => {
    precacheAllLottieAssets();
    const handleConfigUpdate = () => {
      setEmojiConfigs(getStoredEmojiConfigs());
    };
    window.addEventListener('lottie_config_updated', handleConfigUpdate);
    return () => window.removeEventListener('lottie_config_updated', handleConfigUpdate);
  }, []);
  const [showSuperLegendModal, setShowSuperLegendModal] = useState(false);
  const [showRoomSupportModal, setShowRoomSupportModal] = useState(false);
  const [showLeaderboardThemeModal, setShowLeaderboardThemeModal] = useState(false);
  const [leaderboardTheme, setLeaderboardTheme] = useState<LeaderboardThemeConfig>(() => getSavedLeaderboardTheme());
  const [showRoomInfoModal, setShowRoomInfoModal] = useState(false);
  const [showRoomBackgroundStoreModal, setShowRoomBackgroundStoreModal] = useState<boolean>(false);
  const [currentRoomBgUrl, setCurrentRoomBgUrl] = useState<string>(
    'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=1200'
  );
  const [showHostProfileModal, setShowHostProfileModal] = useState(false);
  const [showAudienceModal, setShowAudienceModal] = useState(false);

  // Dynamic Context Menus & Action Sheets States
  const [selectedUserForProfile, setSelectedUserForProfile] = useState<UserProfileData | null>(null);
  const [showAdvancedProfileModal, setShowAdvancedProfileModal] = useState(false);
  const [selectedSeatForAction, setSelectedSeatForAction] = useState<number | null>(null);
  const [showSeatActionModal, setShowSeatActionModal] = useState(false);
  const [selectedSeatForQuickMic, setSelectedSeatForQuickMic] = useState<number | null>(null);
  const [showQuickMicOptionsModal, setShowQuickMicOptionsModal] = useState(false);

  // Synchronize user role with isOwnerProp whenever room changes
  useEffect(() => {
    setCurrentUserRole(isOwnerProp ? 'owner' : 'guest');
  }, [isOwnerProp]);

  // Synchronize Seat 1 host display name based on role and hostName
  useEffect(() => {
    setAllMicSeats((prev) =>
      prev.map((s) =>
        s.id === 1
          ? {
              ...s,
              userName: isOwnerProp ? (hostName || 'أنا المالك 👑') : (hostName || 'مضيف الغرفة'),
            }
          : s
      )
    );
  }, [hostName, isOwnerProp]);

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

  // Seat Request Queue State (نظام طلبات الصعود للمايك)
  const [micRequests, setMicRequests] = useState<MicRequestItem[]>([
    {
      id: 'req-1',
      userName: 'خالد العتيبي',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      level: 'Lv.64',
      vip: 'VIP 5',
      timeAgo: 'منذ دقيقة'
    },
    {
      id: 'req-2',
      userName: 'مريم العدني',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
      level: 'Lv.58',
      vip: 'VIP 4',
      timeAgo: 'منذ 3 دقائق'
    },
    {
      id: 'req-3',
      userName: 'الدكتورة هناء',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
      level: 'Lv.48',
      vip: 'VIP 3',
      timeAgo: 'منذ 5 دقائق'
    }
  ]);
  const [showMicRequestsModal, setShowMicRequestsModal] = useState(false);
  const [toastNotification, setToastNotification] = useState<string | null>(null);
  const [invitedUserIds, setInvitedUserIds] = useState<string[]>([]);

  // Tabbed Statistics Panel State
  const [statsMainTab, setStatsMainTab] = useState<'diamonds' | 'club' | 'charm'>('diamonds');
  const [statsTimeFilter, setStatsTimeFilter] = useState<'24h' | 'all' | 'weekly'>('24h');

  // Auto-reset statistics modal tab to default 'diamonds' (المساهمات) when closed
  useEffect(() => {
    if (!showRoomSupportModal) {
      setStatsMainTab('diamonds');
      setStatsTimeFilter('24h');
    }
  }, [showRoomSupportModal]);

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

  // Handle Seat Click based on Seat State & User Permissions
  const handleSeatClick = (seatId: number) => {
    const targetSeat = allMicSeats.find((s) => s.id === seatId);
    if (!targetSeat) return;

    if (targetSeat.isEmpty) {
      if (targetSeat.isLocked) {
        if (!isCurrentAdmin && !isOwner) {
          setToastNotification('عذراً! هذا المايك مغلق أو مقفل حالياً 🔒 لا يمكن الصعود عليه.');
          setTimeout(() => setToastNotification(null), 3000);
          return;
        }
        // If admin/owner clicks a locked seat, open modal to allow unlocking or managing
        setSelectedSeatForAction(seatId);
        setShowSeatActionModal(true);
        return;
      }

      if (currentUserRole === 'host') {
        // HOST AUTO-JOIN: Immediately occupy seat without any modal or request queue
        handleTakeSeat(seatId);
        setToastNotification('تم صعود المضيف للميكروفون فوراً 🎙️');
        setTimeout(() => setToastNotification(null), 2500);
      } else {
        // 1. EMPTY SEAT: Show Seat Action Modal
        setSelectedSeatForAction(seatId);
        setShowSeatActionModal(true);
      }
    } else if (targetSeat.userName === 'أنا (انضمام)' || targetSeat.userName === 'أنا' || targetSeat.userName === 'المضيف (أنا)' || targetSeat.userName.includes('أنا') || (currentUserRole === 'host' && targetSeat.isHost)) {
      // RESTORED: Show Quick Mic & Host Options Modal (الوقوف ومشاهدة، بيانات الهدية، كتم المايك، ملاحظات، هدية)
      setSelectedSeatForQuickMic(seatId);
      setShowQuickMicOptionsModal(true);
    } else {
      // 3. OTHER USER'S SEAT / HOST: Show Advanced User Profile Modal
      setSelectedUserForProfile({
        id: targetSeat.id.toString(),
        name: targetSeat.userName,
        avatar: targetSeat.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        userId: `884${targetSeat.id}901`,
        country: 'السعودية',
        countryFlag: '🇸🇦',
        isHost: targetSeat.isHost || targetSeat.id === 1,
        isMuted: targetSeat.isMuted,
        isMutedByAdmin: targetSeat.isMutedByAdmin,
        seatId: targetSeat.id,
        badges: [
          { id: 'b1', label: targetSeat.isHost ? 'مالك الغرفة' : 'متحدث المايك', icon: '👑', bgClass: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black' },
          { id: 'b2', label: 'VIP 10', icon: '💎', bgClass: 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold' },
          { id: 'b3', label: 'سوبر أسطورة', icon: '🔥', bgClass: 'bg-gradient-to-r from-red-500 to-amber-500 text-white font-bold' }
        ],
        cpRelation: {
          partnerName: 'أميرة الشرق 👑',
          partnerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
          level: 25,
          intimacyPoints: '128,900',
          title: 'الشريك الماسي 💖'
        }
      });
      setShowAdvancedProfileModal(true);
    }
  };

  // Dedicated Mic Mute Toggle function for Current User Profile ID
  const handleToggleMyMic = () => {
    // If the current user's seat is muted by an Admin / Owner (Profile-level / Admin mute lock active)
    if (isMySeatMutedByAdmin) {
      setToastNotification('🔒 تم كتم الميكروفون بقرار إداري. يُرجى إلغاء الكتم من نافذة الملف الشخصي / الإدارة حصراً');
      setTimeout(() => setToastNotification(null), 3200);
      return;
    }

    const nextMuted = !isMyMicMuted;
    setUserMuteStates((prev) => ({
      ...prev,
      [CURRENT_USER_PROFILE_ID]: nextMuted
    }));
    setAllMicSeats((prev) =>
      prev.map((seat) => {
        const isMySeat =
          seat.userId === CURRENT_USER_PROFILE_ID ||
          seat.userName.includes('أنا') ||
          (currentUserRole === 'host' && seat.isHost);
        if (isMySeat && !seat.isEmpty) {
          return {
            ...seat,
            isMuted: nextMuted,
            isMutedByAdmin: false,
            isSpeaking: !nextMuted
          };
        }
        return seat;
      })
    );
    setToastNotification(nextMuted ? '🔇 تم كتم الميكروفون' : '🎙️ تم فتح الميكروفون');
    setTimeout(() => setToastNotification(null), 2000);
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

    // Strict Lock Validation: Prevent Host or any user from sitting on a locked / closed mic
    if (targetSeat.isLocked) {
      setToastNotification('عذراً! هذا المايك مغلق أو مقفل حالياً 🔒 لا يُسمح بالصعود عليه إلا بعد فتحه.');
      setTimeout(() => setToastNotification(null), 3000);
      return;
    }

    const isTargetSlotAdminMuted = Boolean(targetSeat.isMutedByAdmin);

    // Check if current user is ALREADY sitting on another mic seat in the room
    const currentSeat = allMicSeats.find(
      (s) =>
        !s.isEmpty &&
        (s.userId === CURRENT_USER_PROFILE_ID ||
          s.userName.includes('أنا') ||
          s.userName.includes('المضيف') ||
          (currentUserRole === 'host' && s.isHost))
    );

    // If target seat was muted by Admin/Owner, the user joins in Muted state & red icon is displayed
    const joinMuted = isTargetSlotAdminMuted ? true : Boolean(userMuteStates[CURRENT_USER_PROFILE_ID]);
    const joinMutedByAdmin = isTargetSlotAdminMuted;

    if (isTargetSlotAdminMuted) {
      setUserMuteStates((prev) => ({
        ...prev,
        [CURRENT_USER_PROFILE_ID]: true
      }));
    }

    if (currentSeat && currentSeat.id !== targetSeatId) {
      // --- MIC-TO-MIC COUNTER TRANSFER LOGIC ---
      // In case of direct move between mics without completely stepping down off stage,
      // the counter retains its accumulated balance and transfers with the host to the new mic seat.
      const currentVal = seatCounters[currentSeat.id] || 0;

      setAllMicSeats((prev) =>
        prev.map((seat) => {
          if (seat.id === currentSeat.id) {
            // Vacate old mic seat - if old seat was admin-muted, keep its admin mute flag
            return {
              ...seat,
              isEmpty: true,
              userId: undefined,
              userName: '',
              avatar: '',
              isHost: false,
              isMuted: seat.isMutedByAdmin,
              isMutedByAdmin: seat.isMutedByAdmin,
              isSpeaking: false
            };
          }
          if (seat.id === targetSeatId) {
            // Occupy new mic seat with host identity and persistent/slot mute state
            return {
              ...seat,
              isEmpty: false,
              userId: CURRENT_USER_PROFILE_ID,
              userName: currentSeat.userName,
              avatar: currentSeat.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
              isHost: currentUserRole === 'host' ? true : currentSeat.isHost,
              isMuted: joinMuted,
              isMutedByAdmin: joinMutedByAdmin,
              isSpeaking: !joinMuted
            };
          }
          return seat;
        })
      );

      // Transfer accumulated counter value directly to the new seat & zero out the old vacant seat
      setSeatCounters((prev) => ({
        ...prev,
        [targetSeatId]: currentVal,
        [currentSeat.id]: 0
      }));

      setToastNotification(
        isTargetSlotAdminMuted
          ? `🔄 تم الانتقال للمايك #${targetSeatId}. المقعد مكتوم إدارياً (تم الكتم تلقائياً 🔇)`
          : `🔄 تم نقل المضيف ورصيد العداد (${formatCounterNumber(currentVal)}) تلقائياً من المايك #${currentSeat.id} إلى المايك #${targetSeatId}!`
      );
      setTimeout(() => setToastNotification(null), 3200);
    } else if (!currentSeat) {
      // --- FRESH JOIN FROM AUDIENCE ---
      // User takes the mic seat with their persistent mute state preserved, or slot admin-mute enforced
      setAllMicSeats((prev) =>
        prev.map((seat) => {
          if (seat.id === targetSeatId) {
            return {
              ...seat,
              isEmpty: false,
              userId: CURRENT_USER_PROFILE_ID,
              userName: currentUserRole === 'host' ? 'المضيف (أنا)' : 'أنا (انضمام)',
              avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
              isHost: currentUserRole === 'host' ? true : seat.isHost,
              isMuted: joinMuted,
              isMutedByAdmin: joinMutedByAdmin,
              isSpeaking: !joinMuted
            };
          }
          return seat;
        })
      );

      // Initialize counter for fresh mic session
      setSeatCounters((prev) => ({
        ...prev,
        [targetSeatId]: 0
      }));

      setToastNotification(
        isTargetSlotAdminMuted
          ? `🎙️ تم صعود المايك #${targetSeatId} في وضع الكتم الإداري 🔇 (المقعد مكتوم مسبقاً)`
          : `🎙️ تم صعود المايك #${targetSeatId} وبدء جلسة عداد جديدة!`
      );
      setTimeout(() => setToastNotification(null), 2500);
    }
  };

  // Helper function to leave seat (Mic_Vacant_Event: Actual Counter Reset)
  // Preserves admin mute status on the empty slot if it was muted by admin
  const handleLeaveSeat = (seatId?: number) => {
    const targetId = seatId || selectedSeatForQuickMic;

    setAllMicSeats((prev) => {
      const seatsToVacate = prev.filter(
        (s) =>
          s.id === targetId ||
          s.userId === CURRENT_USER_PROFILE_ID ||
          s.userName.includes('أنا') ||
          s.userName === 'المضيف (أنا)'
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
          seat.userName.includes('أنا') ||
          seat.userName === 'المضيف (أنا)'
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

    setToastNotification('⬇️ تم مغادرة المايك وتصفير العداد للمايك الشاغر (Mic_Vacant_Event)');
    setTimeout(() => setToastNotification(null), 3000);
  };

  // Helper function to toggle seat mute state (Permission Hierarchy: Owner/Admin override, Empty slot attachment)
  const handleToggleMuteSeat = (seatId: number, forcedByAdmin?: boolean) => {
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
      setToastNotification(
        nextMuted
          ? `🔇 تم كتم مقعد المايك #${seatId} إدارياً (تثبيت علامة الكتم الحمراء)`
          : `🎙️ تم إلغاء كتم مقعد المايك #${seatId} الشاغر`
      );
      setTimeout(() => setToastNotification(null), 2500);
      return;
    }

    // Check if target seat belongs to the current user (Self-Mute)
    const isSelfSeat =
      targetSeat.userId === CURRENT_USER_PROFILE_ID ||
      targetSeat.userName.includes('أنا') ||
      (currentUserRole === 'owner' && (targetSeat.isHost || targetSeat.id === 1));

    // Strict Room Owner Authority Protection:
    // If target seat is Host/Room Owner and not self, a moderator or guest cannot mute or unmute the owner.
    const isTargetOwner = targetSeat.isHost || targetSeat.id === 1 || targetSeat.userName.includes('المضيف') || targetSeat.userName.includes('أميرة الشرق');
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
      ? CURRENT_USER_PROFILE_ID
      : (targetSeat.userId || `user_seat_${targetSeat.id}`);

    const currentMuted = targetUserId in userMuteStates ? userMuteStates[targetUserId] : Boolean(targetSeat.isMuted);
    const nextMuted = !currentMuted;
    const isByAdmin = forcedByAdmin !== undefined ? (nextMuted ? forcedByAdmin : false) : (nextMuted ? (isCurrentAdmin || isOwner) : false);

    // Store mute status against the user's unique profile ID in the session state
    setUserMuteStates((prev) => ({
      ...prev,
      [targetUserId]: nextMuted
    }));

    setAllMicSeats((prev) =>
      prev.map((seat) => {
        if (seat.id === seatId) {
          return {
            ...seat,
            isMuted: nextMuted,
            isMutedByAdmin: isByAdmin,
            isSpeaking: !nextMuted
          };
        }
        return seat;
      })
    );

    setToastNotification(
      nextMuted
        ? (isByAdmin ? `🔇 تم كتم ${targetSeat.userName} بقرار إداري` : `🔇 تم كتم ميكروفون ${targetSeat.userName}`)
        : `🎙️ تم إلغاء كتم ميكروفون ${targetSeat.userName}`
    );
    setTimeout(() => setToastNotification(null), 2500);
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
  const handleRemoveFromMic = (seatId: number) => {
    if (isTeamBattleActive) {
      setToastNotification('لا يمكن إنزال أو تحريك المقاعد أثناء معركة الفريق 🛑');
      setTimeout(() => setToastNotification(null), 3000);
      return;
    }
    const targetSeat = allMicSeats.find((s) => s.id === seatId);
    const removedName = targetSeat?.userName || `المقعد #${seatId}`;

    setAllMicSeats((prev) =>
      prev.map((seat) => {
        if (seat.id === seatId) {
          return { ...seat, isEmpty: true, userName: '', avatar: '', isHost: false };
        }
        return seat;
      })
    );

    // Reset counter for that seat upon actual vacating/stepping down (Mic_Vacant_Event)
    setSeatCounters((prev) => ({
      ...prev,
      [seatId]: 0
    }));

    setToastNotification(`⬇️ تم إنزال ${removedName} وتصفير عداد المايك #${seatId} (Mic_Vacant_Event)`);
    setTimeout(() => setToastNotification(null), 3000);
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
            isSpeaking: !s.isMuted
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
            isSpeaking: !s.isMuted
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
    const isOnStage = allMicSeats.some((s) => !s.isEmpty && (s.userName.includes('أنا') || s.userName.includes('انضمام')));
    if (isOnStage) {
      setToastNotification('أنت موجود بالفعل على أحد المايكات! 🎙️');
      setTimeout(() => setToastNotification(null), 3000);
      return;
    }

    const alreadyInQueue = micRequests.some((r) => r.userName.includes('أنا'));
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

  // Send message
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!canUserTypeInChat()) {
      setToastNotification('الدردشة النصية مقفلة حالياً، يجب الصعود على المايك للكتابة 🔒');
      setTimeout(() => setToastNotification(null), 3000);
      return;
    }
    if (!inputMessage.trim()) return;

    setChatMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        userName: 'أنا (الزائر)',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
        text: inputMessage,
        userColor: 'text-amber-300 font-bold',
        bubbleSkin: equippedBubbleSkin,
        replyTo: replyingToMessage
          ? {
              id: replyingToMessage.id,
              userName: replyingToMessage.userName,
              text: replyingToMessage.text
            }
          : undefined,
        badges: [
          {
            id: 'ub-vip',
            label: 'VIP 8',
            icon: '👑',
            bgClass: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black'
          },
          {
            id: 'ub-lvl',
            label: 'LVL 60',
            icon: '⚡',
            bgClass: 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold'
          }
        ]
      }
    ]);
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    setInputMessage('');
    setReplyingToMessage(null);
    setShowChatInputModal(false);
  };

  const handleSendGift = (
    giftName: string,
    giftIcon: string,
    totalValue: number = 0,
    rawGiftName: string = '',
    targetName: string = '',
    targetSeatIds?: number[],
    videoUrl?: string,
    giftItem?: GiftItem
  ) => {
    const recipient = targetName || hostSeat.userName;
    const cleanDisplayEmoji = getCleanGiftEmoji(rawGiftName || giftName, giftIcon);

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

    // Extract quantity from giftName string if present (e.g. "x5")
    let giftQty = 1;
    if (giftName.includes('x')) {
      const match = giftName.match(/x(\d+)/);
      if (match) giftQty = parseInt(match[1], 10);
    }

    // Deduct cost of gift from supporter balance
    if (totalValue > 0) {
      setUserCoinsBalance((prev) => Math.max(0, prev - totalValue));
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

    if (isRefund && giftItem) {
      const refundResult = processRefundGiftDraw(giftItem, giftQty, 'أنا (الداعم)', recipient);

      // AUTOMATICALLY and IMMEDIATELY add won refund coins to supporter's wallet balance
      setUserCoinsBalance((prev) => prev + refundResult.refundCoins);

      // Delay showing the refund rectangle by exactly 3 seconds (after gift hit / multiplication)
      setTimeout(() => {
        setActiveRefundDrawResult(refundResult);

        // Auto-clear failsafe after 3 seconds of display
        setTimeout(() => {
          setActiveRefundDrawResult((current) => (current?.id === refundResult.id ? null : current));
        }, 3000);
      }, 3000);

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
        }, 3000);
      }
    }

    // Increment Team Battle PK Points ONLY if Team PK is active and battle status is running
    if (isTeamBattleActive && teamBattleStatus === 'running' && totalValue > 0) {
      let recipientTeam: 'red' | 'blue' | 'none' = 'none';
      if (targetSeatIds && targetSeatIds.length > 0) {
        const occupiedTargetIds = targetSeatIds.filter((sid) =>
          allMicSeats.some((s) => s.id === sid && !s.isEmpty)
        );
        occupiedTargetIds.forEach((sid) => {
          const team = getTeamForSeat(sid, activeMicCount, ownerJoinedTeam);
          if (team === 'red') setRedTeamScore((prev) => prev + totalValue);
          if (team === 'blue') setBlueTeamScore((prev) => prev + totalValue);
          recipientTeam = team;
        });
      } else {
        const foundSeat = allMicSeats.find((s) => !s.isEmpty && s.userName === recipient);
        if (foundSeat) {
          const team = getTeamForSeat(foundSeat.id, activeMicCount, ownerJoinedTeam);
          if (team === 'red') setRedTeamScore((prev) => prev + totalValue);
          if (team === 'blue') setBlueTeamScore((prev) => prev + totalValue);
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

      // Vertical position scaling per row: row 0 starts around top 18-22%, following rows step down ~10%
      const baseTopPct = activeMicCount <= 2 ? 22 : activeMicCount <= 5 ? 18 : 16;
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

    if (isTargetOnMic && seatsToAnimate.length > 0) {
      // END POINT CONDITION A (On Seat): Object-Reference Anchor directly to active mic seat UI element ID
      newFlyingItems = seatsToAnimate.map((sId, idx) => ({
        id: `fg-${Date.now()}-${sId}-${Math.random()}`,
        icon: flyingIcon,
        targetElementId: `mic-seat-${sId}`,
        fallbackTargetPct: getFallbackSeatCoordsPct(sId),
        delay: idx * 0.08,
        renderLayer: giftRenderLayer,
        particles: createGiftParticles(),
      }));
    } else {
      // END POINT CONDITION B (Not On Seat): Object-Reference Anchor directly to Header Participant List / Three-Lines icon UI element ID
      newFlyingItems = [{
        id: `fg-${Date.now()}-aud-${Math.random()}`,
        icon: flyingIcon,
        targetElementId: 'room-top-audience',
        fallbackTargetPct: { x: 18, y: 5 },
        delay: 0,
        renderLayer: giftRenderLayer,
        particles: createGiftParticles(),
      }];
    }

    setFlyingGifts((prev) => [...prev, ...newFlyingItems]);

    // Gift-Linked Counter Integration: Increment Total Gift Value ONLY for strictly occupied target seats on mic in real time
    const strictlyOccupiedTargetSeats = seatsToAnimate.filter((sId) =>
      allMicSeats.some((s) => s.id === sId && !s.isEmpty)
    );

    if (isTargetOnMic && strictlyOccupiedTargetSeats.length > 0 && totalValue > 0) {
      setSeatCounters((prev) => {
        const nextCounters = { ...prev };
        strictlyOccupiedTargetSeats.forEach((sId) => {
          nextCounters[sId] = (nextCounters[sId] || 0) + totalValue;
        });
        return nextCounters;
      });

      // Trigger instant live animation and floating counter badge on targeted seats
      const nowId = Date.now().toString() + Math.random().toString(36).substring(2, 6);
      setRecentlyUpdatedSeatCounters((prev) => {
        const next = { ...prev };
        strictlyOccupiedTargetSeats.forEach((sId) => {
          next[sId] = {
            amount: totalValue,
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
    setSideGiftEvents((prev) => [
      ...prev.slice(-4),
      {
        id: sideEventId,
        senderName: 'أنا (الداعم)',
        senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
        actionType: 'gift',
        giftName: rawGiftName || giftName,
        giftIcon: cleanDisplayEmoji,
        quantity: giftQty || 1,
        targetName: recipient,
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
      (s) => !s.isEmpty && (s.userName.includes('أنا') || s.userName.includes('انضمام') || s.userName.includes('المالك') || s.userName.includes('مضيف') || s.isHost)
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
      {/* ACTIVE ROOM WALLPAPER BACKGROUND LAYER (الخلفية التي عينها صاحب الروم/المبرمج) */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-500 pointer-events-none"
        style={{
          backgroundImage: `url('${currentRoomBgUrl}')`,
          opacity: (mainRoomConfig.activeWallpaperOpacity ?? 100) / 100,
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
          backgroundColor: `rgba(0, 0, 0, ${(mainRoomConfig.roomOverlayDarkness ?? 35) / 100})`,
          backdropFilter: mainRoomConfig.roomBackdropBlur ? `blur(${mainRoomConfig.roomBackdropBlur}px)` : undefined
        }}
      />
      {/* GLOW ATMOSPHERE BACKGROUND */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at top center, ${hexToRgba(mainRoomConfig.roomAmbientGlowColor || '#3b82f6', (mainRoomConfig.roomAmbientGlowIntensity ?? 30) / 100)}, transparent 70%)`
        }}
      />
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{
          backgroundColor: hexToRgba(mainRoomConfig.roomAmbientGlowColor || '#3b82f6', (mainRoomConfig.roomAmbientGlowIntensity ?? 30) / 300)
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
                {!videoHasRenderError && (activeVideoGift.videoUrl || isVideoResource(activeVideoGift.icon)) ? (
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
                ) : activeVideoGift.thumbnailUrl || isMediaUrl(activeVideoGift.icon) ? (
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
        {/* Row 1 Header Icons & Room Title Pill */}
        <div className="flex items-center justify-between gap-1.5 w-full">
          {/* Right Section (in RTL: 1st in DOM): Room Title & Host Profile Capsule (Clickable on Host Avatar/Name for Room Management & Admins Modal) */}
          <div
            onClick={() => setShowRoomInfoModal(true)}
            style={{
              backgroundColor: hexToRgba(mainRoomConfig.topBarBgColor || '#1A2132', (mainRoomConfig.topBarOpacity ?? 90) / 100),
              borderColor: mainRoomConfig.topBarBorderColor || 'rgba(245, 158, 11, 0.35)',
              backdropFilter: `blur(${mainRoomConfig.topBarBackdropBlur || 16}px)`
            }}
            className="border rounded-full py-1 pr-1 pl-3.5 h-11.5 sm:h-12 flex items-center gap-2 min-w-0 max-w-[58%] sm:max-w-[65%] shadow-md cursor-pointer hover:border-amber-400/80 hover:brightness-110 transition-all active:scale-95 group shrink-0"
            title="انقر لعرض شاشة إدارة الغرفة وتعديل الاسم والمشرفين"
          >
            {/* Host Avatar on Right Edge */}
            <div className="w-8.5 h-8.5 rounded-full border-2 border-amber-400 overflow-hidden shrink-0 shadow-[0_0_10px_rgba(245,158,11,0.45)] group-hover:scale-105 transition-transform">
              <img
                src={hostSeat.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300'}
                alt={hostSeat.userName}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col min-w-0 justify-center flex-1 overflow-hidden py-0.5">
              {/* Room Title with Natural Smooth Movement / Marquee for long titles */}
              <div className="overflow-hidden w-full relative h-5 flex items-center">
                {currentRoomTitle.length > 13 ? (
                  <span
                    className="text-[12px] sm:text-[12.5px] font-black leading-none inline-block whitespace-nowrap animate-natural-marquee tracking-tight"
                    style={{ color: mainRoomConfig.roomTitleColor || '#ffffff' }}
                  >
                    {currentRoomTitle}
                  </span>
                ) : (
                  <span
                    className="text-[12px] sm:text-[12.5px] font-black truncate leading-tight block tracking-tight"
                    style={{ color: mainRoomConfig.roomTitleColor || '#ffffff' }}
                  >
                    {currentRoomTitle}
                  </span>
                )}
              </div>

              {/* Host and Role Status */}
              <span className="text-[9.5px] font-mono text-slate-300 truncate flex items-center gap-1.5 leading-none mt-0.5">
                <span className="text-amber-300 font-extrabold truncate">{hostSeat.userName}</span>
                {isRoomLocked ? (
                  <span title="الغرفة مقفلة برمز 🔒">
                    <Lock className="w-3 h-3 text-amber-400 stroke-[2.5] shrink-0 animate-pulse" />
                  </span>
                ) : (
                  <span className="text-[8.5px] text-amber-300 font-bold bg-amber-500/20 border border-amber-500/30 px-1.5 py-0.2 rounded-full shrink-0 flex items-center gap-0.5">
                    <span>👑</span>
                    <span>المالك</span>
                  </span>
                )}
              </span>
            </div>
          </div>

          {/* Left Section (in RTL: 2nd in DOM): Listener Count, 3-Dots Options Menu, Power */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Listener Count Pill -> Opens Audience List Modal */}
            <button
              id="room-top-audience"
              onClick={() => setShowAudienceModal(true)}
              style={{
                backgroundColor: mainRoomConfig.topAudiencePillBg || '#1A2132'
              }}
              className="hover:brightness-125 border border-white/10 px-2 py-1 rounded-full flex items-center gap-1 text-[11px] font-bold text-slate-200 shadow-xs cursor-pointer transition-colors active:scale-95"
              title="انقر لعرض قائمة الحضور والمستمعين"
            >
              <Users className="w-3 h-3 text-indigo-400" />
              <span className="font-mono text-[11px] text-white">18</span>
            </button>

            {/* Three-Dots Options Menu Button (خيارات وإعدادات الغرفة) */}
            <button
              id="room-top-more-options"
              onClick={() => setShowTopOptionsMenuModal(true)}
              style={{
                backgroundColor: mainRoomConfig.topMoreBtnBg || '#1A2132'
              }}
              className="w-7.5 h-7.5 rounded-full hover:brightness-125 border border-white/10 flex items-center justify-center text-slate-200 cursor-pointer relative transition-colors active:scale-95 shadow-xs"
              title="خيارات وإعدادات الغرفة"
            >
              <MoreHorizontal className="w-4 h-4" />
              <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-red-500 ring-1.5 ring-[#0B0E17]" />
            </button>

            {/* Power/Close Button */}
            <button
              onClick={() => {
                setIsRoomActive(false);
                setRoomUptimeSeconds(0);
                onClose();
              }}
              style={{
                backgroundColor: mainRoomConfig.topPowerBtnBg || '#1A2132'
              }}
              className="w-7.5 h-7.5 rounded-full hover:bg-red-900/50 border border-white/10 flex items-center justify-center text-slate-200 cursor-pointer transition-colors shadow-xs active:scale-95"
              title="مغادرة / إغلاق الغرفة"
            >
              <Power className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        </div>

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

            {/* 5. Seat Request Queue Badge -> Opens Seat Request Queue Modal */}
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

            {/* 7. Left: Diamond / Total Room Support -> Opens Room Support Stats Modal */}
            <button
              onClick={() => {
                setStatsMainTab('diamonds');
                setStatsTimeFilter('24h');
                setShowRoomSupportModal(true);
              }}
              className="bg-[#151D2C] border border-cyan-500/40 px-1.5 py-0.5 rounded-full flex items-center gap-0.5 text-[8px] font-mono font-black text-cyan-300 shadow-2xs cursor-pointer hover:border-cyan-400 transition-colors"
              title="إحصائيات الدعم الكلي في هذه الغرفة"
            >
              <span className="text-[9px]">💎</span>
              <span>{userCoins}</span>
            </button>
          </div>

          {/* Under Sub-Header Row: Developer Settings & Room Lighting/Shading as compact icons on the Left (رموز مصغرة على اليسار) */}
          {isDeveloper(currentAppRole) && (
            <div className="flex items-center justify-start gap-1.5 pl-1 pt-0.5" dir="ltr">
              {/* 1. Mini Developer Room Customizer/Settings Icon Symbol (رمز الإعدادات) */}
              <button
                id="developer-room-customizer-btn"
                type="button"
                onClick={() => setShowMainRoomCustomizerModal(true)}
                className="w-5.5 h-5.5 rounded-full bg-[#0f172a]/90 hover:bg-slate-800 border border-cyan-400/50 hover:border-cyan-300 text-cyan-300 flex items-center justify-center shadow-xs cursor-pointer active:scale-90 transition-all"
                title="لوحة تحكم وتخصيص إعدادات الروم (خاص بالمبرمج 👑)"
              >
                <Wrench className="w-2.5 h-2.5 text-cyan-400" />
              </button>

              {/* 2. Mini Room Lighting & Shading Icon Symbol (رمز إضاءة وتظليل الغرفة) */}
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
            </div>
          )}
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
              className="relative bg-[#18110B]/95 border-2 border-amber-400/90 backdrop-blur-xl rounded-2xl px-2.5 py-1.5 flex items-center justify-between gap-1.5 shadow-[0_0_24px_rgba(245,158,11,0.6)] cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all hover:border-amber-300 hover:shadow-[0_0_30px_rgba(245,158,11,0.85)] group"
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
                  {isVideoResource(highValueGiftNotice.giftIcon) ? (
                    <video
                      src={highValueGiftNotice.giftIcon}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-7 h-7 object-contain drop-shadow-md"
                      style={{ mixBlendMode: 'screen' }}
                    />
                  ) : isMediaUrl(highValueGiftNotice.giftIcon) ? (
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

      {/* UNIFIED SEQUENTIAL COLUMN LAYOUT: MIC GRID + DYNAMIC CHAT AREA AS A SINGLE BLOCK WITH TOP MARGIN SHIFT (Pulled down ~1cm so top notifications remain completely clear) */}
      <div className="flex-1 min-h-0 flex flex-col mt-[38px] sm:mt-[42px] overflow-hidden overflow-x-hidden relative z-20 w-full max-w-full">
        {/* 2. DYNAMIC MIC ARRANGEMENT SECTION / CINEMA WATCH MODE */}
        <div className="relative px-3 sm:px-6 pt-1 pb-1 space-y-1.5 sm:space-y-2 w-full max-w-2xl mx-auto flex flex-col shrink-0 transition-all duration-300 overflow-x-hidden">
          {isCinemaWatchMode ? (
            /* CINEMA / WATCH TOGETHER MODE (مشاهدة الفيديو ومقاعد السينما الحمراء الفخمة) */
            <div className="w-full flex flex-col items-center space-y-2 sm:space-y-3 z-10">
              {/* 1. TOP VIDEO SCREEN BOX (شاشة ثابتة غير متوسعة ممتدة للأعلى بحوالي 1سم) */}
              <div className="w-full max-w-md mx-auto h-[205px] sm:h-[225px] bg-[#000000]/95 border border-white/10 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden shadow-[0_10px_35px_rgba(0,0,0,0.9)] select-none">
                {/* Minimal Top Control Header */}
                <div className="absolute top-2 inset-x-2.5 flex items-center justify-between z-30 pointer-events-auto">
                  {selectedCinemaVideo ? (
                    <button
                      onClick={() => setShowCinemaVideoPickerModal(true)}
                      className={`px-2.5 py-1 rounded-full text-white text-[11px] font-bold border flex items-center gap-1.5 cursor-pointer backdrop-blur-xs shadow-md transition-all active:scale-95 ${
                        isOwner
                          ? 'bg-black/80 hover:bg-black/95 border-emerald-500/40 text-emerald-300'
                          : 'bg-black/80 hover:bg-black/95 border-amber-500/40 text-amber-300'
                      }`}
                      title={isOwner ? "إدارة الفيديوهات وقائمة الاقتراحات" : "اقتراح فيديو آخر لصاحب الغرفة"}
                    >
                      {isOwner ? (
                        <>
                          <Search className="w-3.5 h-3.5 text-emerald-400" />
                          <span>بحث / إدارة {videoSuggestions.length > 0 ? `(${videoSuggestions.length})` : ''}</span>
                        </>
                      ) : (
                        <>
                          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                          <span>اقتراح فيديو 💡</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <div />
                  )}

                  <button
                    onClick={() => {
                      if (isOwner) {
                        setIsCinemaWatchMode(false);
                        setSelectedCinemaVideo(null);
                        setToastNotification('تم إغلاق وضع سينما الروم والعودة للمقاعد 🎙️');
                        setTimeout(() => setToastNotification(null), 3000);
                      } else {
                        setToastNotification('عذراً، إغلاق سينما الروم متاح حصرياً لمالك الغرفة فقط 👑');
                        setTimeout(() => setToastNotification(null), 3000);
                      }
                    }}
                    className="p-1.5 rounded-full bg-black/75 hover:bg-rose-600/90 text-white border border-white/15 transition-colors cursor-pointer backdrop-blur-xs shadow-md"
                    title={isOwner ? "إغلاق وضع السينما والعودة للمقاعد" : "إغلاق الشاشة متاح لمالك الغرفة فقط"}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {selectedCinemaVideo ? (
                  /* Clean YouTube Player with Minimal Fixed Frame */
                  <div className="w-full h-full flex flex-col relative z-10 bg-black">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${selectedCinemaVideo.youtubeId}?autoplay=1&enablejsapi=1&rel=0&modestbranding=1&controls=1&fs=0`}
                      title={selectedCinemaVideo.title}
                      className="w-full h-full border-0 bg-black"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                  </div>
                ) : (
                  /* Minimal Empty Cinema Screen Matching Screenshot Exactly */
                  <div className="flex flex-col items-center justify-center text-center z-10 space-y-2 px-4">
                    {/* Clapperboard Slate Icon in rounded square */}
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 shadow-inner mb-0.5">
                      <Clapperboard className="w-8 h-8 text-slate-300 stroke-[1.4]" />
                    </div>

                    {/* Action Button: Owner selects/plays, Non-owner suggests */}
                    <button
                      onClick={() => setShowCinemaVideoPickerModal(true)}
                      className={`px-8 sm:px-9 py-2.5 rounded-full font-black text-xs sm:text-sm active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer ${
                        isOwner
                          ? 'bg-[#00E676] hover:bg-[#00c853] text-[#003314] shadow-[0_0_20px_rgba(0,230,118,0.45)]'
                          : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-[0_0_20px_rgba(251,191,36,0.35)]'
                      }`}
                    >
                      {isOwner ? (
                        <>
                          <Play className="w-3.5 h-3.5 fill-[#003314]" />
                          <span>تحديد وتشغيل فيديو</span>
                        </>
                      ) : (
                        <>
                          <Lightbulb className="w-3.5 h-3.5" />
                          <span>اقتراح فيديو للمالك 💡</span>
                        </>
                      )}
                    </button>

                    {/* Subtitle text */}
                    <p className="text-[11px] sm:text-xs text-slate-400 font-medium tracking-tight">
                      {isOwner
                        ? 'مشاهدة الفيديو والدردشة مع الأصدقاء'
                        : 'يمكن للمشرفين والأعضاء اقتراح مقاطع ليعتمدها مالك الغرفة'}
                    </p>
                  </div>
                )}
              </div>

              {/* 2. THE 8 LUXURY RED CINEMA SEATS (2 Rows of 4 Seats - Exact Match to Screenshot) */}
              <div className="w-full max-w-md mx-auto space-y-1 sm:space-y-1.5 pt-0.5">
                {/* Row 1: Seats 4, 3, 2, 1 (in RTL grid order [1, 2, 3, 4] -> renders 1 on right, 4 on left) */}
                <div className="grid grid-cols-4 gap-1 sm:gap-2 justify-items-center dir-rtl">
                  {[1, 2, 3, 4].map((seatId) => {
                    const seatData = allMicSeats.find((s) => s.id === seatId);
                    return (
                      <RedCinemaSeat
                        key={`cinema-seat-${seatId}`}
                        seatNumber={seatId}
                        seatData={seatData}
                        onClick={() => handleSeatClick(seatId)}
                      />
                    );
                  })}
                </div>

                {/* Row 2: Seats 8, 7, 6, 5 (in RTL grid order [5, 6, 7, 8] -> renders 5 on right, 8 on left) */}
                <div className="grid grid-cols-4 gap-1 sm:gap-2 justify-items-center dir-rtl">
                  {[5, 6, 7, 8].map((seatId) => {
                    const seatData = allMicSeats.find((s) => s.id === seatId);
                    return (
                      <RedCinemaSeat
                        key={`cinema-seat-${seatId}`}
                        seatNumber={seatId}
                        seatData={seatData}
                        onClick={() => handleSeatClick(seatId)}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* TEAM BATTLE SPLIT-SCREEN BACKGROUND DECORATION FRAME */}
          {isTeamBattleActive && (
            <div className="absolute inset-x-1 sm:inset-x-3 inset-y-0 rounded-3xl overflow-hidden pointer-events-none z-0 border border-amber-400/40 shadow-2xl backdrop-blur-xs flex dir-rtl transition-all duration-500">
              {/* Right Half: Red Team Zone Frame */}
              <div className="flex-1 bg-gradient-to-br from-rose-950/90 via-red-950/80 to-slate-950/95 border-r-2 border-y-2 border-rose-500/60 p-2 sm:p-3 flex flex-col justify-between relative overflow-hidden shadow-[inset_0_0_35px_rgba(244,63,94,0.4)]">
                {/* Decorative Glow Orb & Crest Pattern */}
                <div className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full bg-rose-600/30 blur-3xl pointer-events-none" />
                <div className="flex items-center justify-start text-rose-200 relative z-10">
                  <span className="text-[10px] sm:text-[11px] font-black tracking-wider uppercase bg-rose-500/30 px-2.5 py-0.5 rounded-full border border-rose-500/50 shadow-sm text-rose-100">
                    الفريق الأحمر 🚩
                  </span>
                </div>
                <div className="self-start text-[9px] font-mono font-black text-rose-400/70 tracking-widest uppercase relative z-10">
                  RED TEAM
                </div>
              </div>

              {/* Center VS Divider Line */}
              <div className="w-1.5 bg-gradient-to-b from-amber-400 via-purple-500 to-rose-500 shadow-[0_0_15px_rgba(251,191,36,0.95)] relative z-20 flex items-center justify-center">
                <div className="w-7 h-7 rounded-full bg-slate-950 border-2 border-amber-400 flex items-center justify-center shadow-2xl -mx-3.5">
                  <Swords className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                </div>
              </div>

              {/* Left Half: Blue Team Zone Frame */}
              <div className="flex-1 bg-gradient-to-bl from-sky-950/90 via-blue-950/80 to-slate-950/95 border-l-2 border-y-2 border-cyan-400/60 p-2 sm:p-3 flex flex-col justify-between relative overflow-hidden shadow-[inset_0_0_35px_rgba(6,182,212,0.4)]">
                {/* Decorative Glow Orb & Crest Pattern */}
                <div className="absolute -left-8 -bottom-8 w-36 h-36 rounded-full bg-cyan-500/30 blur-3xl pointer-events-none" />
                <div className="flex items-center justify-end text-cyan-200 relative z-10">
                  <span className="text-[10px] sm:text-[11px] font-black tracking-wider uppercase bg-cyan-500/30 px-2.5 py-0.5 rounded-full border border-cyan-500/50 shadow-sm text-cyan-100">
                    🚩 الفريق الأزرق
                  </span>
                </div>
                <div className="self-end text-[9px] font-mono font-black text-cyan-400/70 tracking-widest uppercase relative z-10">
                  BLUE TEAM
                </div>
              </div>
            </div>
          )}

          {seatRows.map((rowSeats, rowIndex) => {
            const colCount = rowSeats.length;
            const gridColsClass =
              colCount === 1 ? 'grid-cols-1 max-w-[130px] mx-auto' :
              colCount === 2 ? 'grid-cols-2 w-full max-w-[185px] sm:max-w-[210px] mx-auto justify-items-center gap-2' :
              colCount === 3 ? 'grid-cols-3 w-full max-w-sm sm:max-w-md mx-auto justify-items-center gap-1.5' :
              colCount === 4 ? 'grid-cols-4 w-full max-w-md sm:max-w-xl mx-auto justify-items-center gap-1' :
              colCount === 5 ? 'grid-cols-5 w-full max-w-lg sm:max-w-2xl mx-auto justify-items-center gap-1' :
              colCount === 6 ? 'grid-cols-6 w-full justify-items-center gap-1' : 'grid-cols-7 w-full justify-items-center gap-1';

            // Expanded, crystal-clear avatar circle sizes across all seat count presets
            const circleSizeClass =
              colCount <= 2 && rowIndex === 0
                ? 'w-17 h-17 sm:w-21 sm:h-21'
                : colCount <= 3
                ? 'w-15.5 h-15.5 sm:w-18.5 sm:h-18.5'
                : colCount <= 4
                ? 'w-14 h-14 sm:w-16.5 sm:h-16.5'
                : 'w-13 h-13 sm:w-15 sm:h-15';

            const iconSizeClass = colCount <= 2 ? 'w-6.5 h-6.5' : colCount <= 4 ? 'w-5.5 h-5.5' : 'w-4.5 h-4.5';
            const seatShapeRounded =
              mainRoomConfig.seatShape === 'squircle'
                ? 'rounded-2xl'
                : mainRoomConfig.seatShape === 'rounded_rect'
                ? 'rounded-xl'
                : mainRoomConfig.seatShape === 'hexagon'
                ? 'rounded-[28%]'
                : 'rounded-full';

            return (
              <div key={rowIndex} className={`grid ${gridColsClass} justify-center items-center relative z-10`}>
                {rowSeats.map((seat) => {
                  const isSeatHost = seat.isHost || (seat.id === 1 && !seat.isEmpty && seat.userName === 'أميرة الشرق');
                  const isSpeaking = seat.isSpeaking && !seat.isMuted;
                  const auraStyle = getSpeakingAuraStyles(seat.speakingAura || 'default');
                  const seatTeam = isTeamBattleActive ? getTeamForSeat(seat.id, activeMicCount, ownerJoinedTeam) : null;
                  const isRedTeamSeat = seatTeam === 'red';
                  const isBlueTeamSeat = seatTeam === 'blue';

                  const dynamicPulseDuration = mainRoomConfig.speakingPulseSpeed || 1.2;
                  const dynamicScaleTarget = mainRoomConfig.speakingScaleMultiplier || 1.15;
                  const dynamicGlowColor = mainRoomConfig.speakingGlowColor || '#22c55e';
                  const dynamicGlowIntensity = mainRoomConfig.speakingGlowIntensity ?? 24;
                  const dynamicRingColor = mainRoomConfig.speakingRingColor || '#4ade80';
                  const dynamicRingWidth = mainRoomConfig.speakingRingWidth || 2.5;

                  return (
                    <div
                      key={seat.id}
                      id={`mic-seat-${seat.id}`}
                      onClick={() => handleSeatClick(seat.id)}
                      className="flex flex-col items-center space-y-0.5 cursor-pointer group my-0"
                    >
                      <div className="relative">
                        {/* Custom Chair Frame Integration if equipped */}
                        {mainRoomConfig.customChairFrameUrl && (
                          <div
                            className={`absolute -inset-1.5 ${seatShapeRounded} pointer-events-none z-0 overflow-hidden`}
                            style={{ opacity: (mainRoomConfig.customChairFrameOpacity ?? 85) / 100 }}
                          >
                            <img
                              src={mainRoomConfig.customChairFrameUrl}
                              alt="chair"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        {seat.isEmpty ? (
                          <div
                            style={
                              isRedTeamSeat || isBlueTeamSeat
                                ? undefined
                                : seat.isLocked
                                ? {
                                    backgroundColor: hexToRgba(mainRoomConfig.lockedSeatBgColor || '#0f172a', (mainRoomConfig.lockedSeatOpacity ?? 40) / 100),
                                    borderColor: mainRoomConfig.lockedSeatBorderColor || '#cbd5e1'
                                  }
                                : {
                                    backgroundColor: hexToRgba(mainRoomConfig.emptySeatBgColor || '#000000', (mainRoomConfig.emptySeatOpacity ?? 25) / 100),
                                    borderColor: mainRoomConfig.emptySeatBorderColor || '#ffffff',
                                    borderWidth: `${mainRoomConfig.emptySeatBorderWidth || 1.5}px`
                                  }
                            }
                            className={`${circleSizeClass} ${seatShapeRounded} border ${
                              isRedTeamSeat
                                ? 'border-2 border-red-500/90 bg-gradient-to-b from-rose-950/80 via-red-950/90 to-amber-950/80 shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                                : isBlueTeamSeat
                                ? 'border-2 border-cyan-400/90 bg-gradient-to-b from-sky-950/80 via-indigo-950/90 to-blue-950/80 shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                                : seat.isLocked
                                ? 'border-dashed text-white shadow-[0_0_12px_rgba(255,255,255,0.15)]'
                                : seat.isMuted
                                ? 'border-dashed text-white shadow-[0_0_12px_rgba(255,255,255,0.15)]'
                                : 'border-dashed text-white'
                            } backdrop-blur-xs flex items-center justify-center shadow-2xs transition-all group-hover:scale-105 relative`}
                          >
                            {seat.isLocked ? (
                              <Lock
                                className={`${iconSizeClass} stroke-[2.2]`}
                                style={{ color: mainRoomConfig.lockedSeatLockColor || '#f8fafc' }}
                              />
                            ) : (
                              <Plus
                                className={`${iconSizeClass} stroke-[2.5]`}
                                style={{ color: mainRoomConfig.emptySeatPlusColor || '#ffffff' }}
                              />
                            )}

                            {/* SHOW MUTED MIC INDICATOR ON EMPTY SEAT - RED BADGE PERMANENTLY ATTACHED (ADMIN/OWNER ONLY) */}
                            {seat.isMutedByAdmin && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                                className="absolute -bottom-0.5 -right-0.5 w-4.5 h-4.5 rounded-full flex items-center justify-center border-1.5 border-[#0B0E17] bg-rose-600 text-white shadow-md z-30 ring-1.5 ring-rose-500/70"
                                title="المقعد مكتوم بواسطة الإدارة 🔇"
                              >
                                <MicOff className="w-2.5 h-2.5 stroke-[2.8]" />
                              </motion.div>
                            )}
                          </div>
                        ) : (
                          <div className="relative flex items-center justify-center">
                            {/* STORE-INTEGRATED + ROOM CUSTOMIZER SPEAKING CIRCULAR SOUND WAVE / RIPPLE EFFECT */}
                            {isSpeaking && (
                              <>
                                {/* Ring 1: Dynamic Customizer Speaking Pulse Ring */}
                                <motion.div
                                  animate={{ scale: [1, dynamicScaleTarget, 1], opacity: [0.35, 0.95, 0.35] }}
                                  transition={{ repeat: Infinity, duration: dynamicPulseDuration, ease: 'easeInOut' }}
                                  className={`absolute -inset-1 ${seatShapeRounded} pointer-events-none z-0`}
                                  style={{
                                    boxShadow: `0 0 ${dynamicGlowIntensity}px ${dynamicGlowColor}`,
                                    border: `${dynamicRingWidth}px solid ${dynamicRingColor}`
                                  }}
                                />
                                {/* Ring 2: Expanding Middle Sound Wave */}
                                <motion.div
                                  animate={{ scale: auraStyle.scale2, opacity: auraStyle.opacity2 }}
                                  transition={{ repeat: Infinity, duration: 1.6, ease: 'easeOut', delay: 0.2 }}
                                  className={`absolute -inset-2 ${seatShapeRounded} pointer-events-none z-0 ${auraStyle.ring2Class}`}
                                />
                                {/* Ring 3: Rotating Sound Aura Circle */}
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ repeat: Infinity, duration: 5, ease: 'linear' }}
                                  className={`absolute -inset-1.5 ${seatShapeRounded} pointer-events-none z-0 ${auraStyle.ring3Class}`}
                                />
                              </>
                            )}

                            {/* Main Avatar Container */}
                            <div
                              className={`${circleSizeClass} rounded-full p-0.5 bg-gradient-to-tr ${
                                isSpeaking
                                  ? auraStyle.avatarBorderClass
                                  : isRedTeamSeat
                                  ? 'from-red-500 via-rose-600 to-amber-500 shadow-[0_0_15px_rgba(239,68,68,0.8)] ring-2 ring-rose-500/60'
                                  : isBlueTeamSeat
                                  ? 'from-cyan-400 via-blue-500 to-indigo-500 shadow-[0_0_15px_rgba(6,182,212,0.8)] ring-2 ring-cyan-400/60'
                                  : Boolean(recentlyUpdatedSeatCounters[seat.id])
                                  ? 'from-amber-400 via-yellow-300 to-rose-500 ring-2 ring-amber-400 shadow-[0_0_18px_rgba(251,191,36,0.9)]'
                                  : isSeatHost
                                  ? 'from-amber-400/90 via-emerald-400/90 to-cyan-400/90 shadow-sm'
                                  : 'from-cyan-400/90 to-emerald-400/90 shadow-xs'
                              } relative transition-transform group-hover:scale-105 z-10`}
                            >
                              {/* FLOATING LIVE GIFT INCREMENT COUNTER BADGE ANIMATION */}
                              <AnimatePresence>
                                {recentlyUpdatedSeatCounters[seat.id] && (
                                  <motion.div
                                    key={recentlyUpdatedSeatCounters[seat.id].id}
                                    initial={{ opacity: 0, y: 0, scale: 0.7 }}
                                    animate={{
                                      opacity: [0, 1, 1, 0],
                                      y: [-2, -22, -32],
                                      scale: [0.7, 1.15, 0.95],
                                    }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 2.2, ease: "easeOut" }}
                                    className="absolute -top-7 left-1/2 -translate-x-1/2 z-50 pointer-events-none flex items-center gap-1 bg-gradient-to-r from-amber-500 via-pink-600 to-rose-600 px-2 py-0.5 rounded-full shadow-[0_0_12px_rgba(251,191,36,0.9)] border border-amber-300 whitespace-nowrap"
                                  >
                                    <span className="text-[10px]">{recentlyUpdatedSeatCounters[seat.id].giftIcon}</span>
                                    <span className="font-mono font-black text-[10px] text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)]">
                                      +{formatCounterNumber(recentlyUpdatedSeatCounters[seat.id].amount)}
                                    </span>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                              {/* TEAM BATTLE PK BADGE OVERLAY */}
                              {isTeamBattleActive && (isRedTeamSeat || isBlueTeamSeat) && (
                                <div
                                  className={`absolute -top-1.5 ${
                                    isRedTeamSeat ? '-right-1' : '-left-1'
                                  } z-30 px-1.5 py-0.2 rounded-full text-[8.5px] font-black shadow-md flex items-center gap-0.5 border ${
                                    isRedTeamSeat
                                      ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white border-rose-300 ring-1 ring-red-500/50'
                                      : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-cyan-300 ring-1 ring-cyan-400/50'
                                  }`}
                                >
                                  {isRedTeamSeat ? '🚩 أحمر' : 'أزرق 🚩'}
                                </div>
                              )}

                              {/* Avatar Image */}
                              <img
                                src={seat.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'}
                                alt={seat.userName}
                                className="w-full h-full object-cover rounded-full relative z-10"
                              />

                              {/* Lock Badge on occupied seat if locked by admin */}
                              {seat.isLocked && (
                                <div className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 rounded-full flex items-center justify-center border border-[#0B0E17] bg-indigo-600 text-white shadow-xs z-20" title="المقعد مقفل 🔒">
                                  <Lock className="w-2.5 h-2.5 stroke-[2.5]" />
                                </div>
                              )}

                              {/* Red Muted Mic Badge on occupied seat - strictly reserved for Admin/Owner profile mutes */}
                              {seat.isMutedByAdmin && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                                  className="absolute -bottom-0.5 -right-0.5 w-4.5 h-4.5 rounded-full flex items-center justify-center border-1.5 border-[#0B0E17] bg-rose-600 text-white shadow-md z-30 ring-1.5 ring-rose-500/70"
                                  title="تم كتم المايك بواسطة الإدارة 🔇"
                                >
                                  <MicOff className="w-2.5 h-2.5 stroke-[2.8]" />
                                </motion.div>
                              )}

                              {/* 3-SECOND WEBSOCKET ANIMATED LOTTIE REACTION OVERLAY ON SEAT (CENTERED FIXED AVATAR OVERLAY STACK) */}
                              {activeSeatReactions[seat.id] && (
                                <AnimatePresence>
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.2, y: 12 }}
                                    animate={{ opacity: 1, scale: 1.25, y: -4 }}
                                    exit={{ opacity: 0, scale: 0.3, y: -15 }}
                                    transition={{ type: "spring", stiffness: 380, damping: 22 }}
                                    className="absolute inset-0 z-40 rounded-full flex items-center justify-center pointer-events-none"
                                  >
                                    <LottieReactionPlayer
                                      emoji={activeSeatReactions[seat.id].emoji}
                                      emojiType={activeSeatReactions[seat.id].emojiType}
                                      lottieAssetPath={activeSeatReactions[seat.id].lottieAssetPath}
                                      glowColor={activeSeatReactions[seat.id].glowColor}
                                    />
                                  </motion.div>
                                </AnimatePresence>
                              )}
                            </div>
                          </div>
                        )}

                        {/* DIGITAL COUNTER REALISTIC RIBBON BADGE (غير قابل للنقر - أداء وتحديث حي وفعلي في استقبال الهدايا والألوان) */}
                        {(isTeamBattleActive ? teamBattleStatus === 'running' : showCountersOnMics) && !seat.isEmpty && (() => {
                          const seatVal = seatCounters[seat.id] || 0;
                          const milestoneTheme = getRibbonMilestoneTheme(seatVal);
                          const isRecentlyUpdated = Boolean(recentlyUpdatedSeatCounters[seat.id]);
                          return (
                            <motion.div
                              animate={isRecentlyUpdated ? { scale: [1, 1.25, 1], y: [0, -3, 0] } : { scale: 1, y: 0 }}
                              transition={{ duration: 0.5, ease: "easeOut" }}
                              className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 z-30 pointer-events-none select-none"
                              title={`عداد المايك ${seat.id}: ${milestoneTheme.name}`}
                            >
                              <div className={`relative flex items-center justify-center px-3.5 py-0 min-w-[42px] h-[14px] ${isRecentlyUpdated ? 'drop-shadow-[0_0_8px_rgba(251,191,36,0.95)]' : ''}`}>
                                {/* Exact Realistic Ribbon Banner SVG with Dynamic Milestone Color Shifting */}
                                <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none" viewBox="0 0 72 18" preserveAspectRatio="none">
                                  <defs>
                                    {/* Milestone Dynamic Ribbon Gradient */}
                                    <linearGradient id={`ribbonGrad-${seat.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                      {milestoneTheme.gradientStops.map((s, idx) => (
                                        <stop key={idx} offset={s.offset} stopColor={s.stopColor} />
                                      ))}
                                    </linearGradient>

                                    {/* Top Specular Gloss Light */}
                                    <linearGradient id={`ribbonGloss-${seat.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.65" />
                                      <stop offset="60%" stopColor="#ffffff" stopOpacity="0.15" />
                                      <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
                                    </linearGradient>

                                    {/* Realistic Milestone Ribbon Outer Shadow */}
                                    <filter id={`ribbonShadow-${seat.id}`} x="-20%" y="-20%" width="140%" height="140%">
                                      <feDropShadow dx="0" dy="1.2" stdDeviation="1.0" floodColor={milestoneTheme.shadowColor} floodOpacity="0.75" />
                                    </filter>
                                  </defs>

                                  {/* Main Curved Ribbon Body with Double-Pointed Fishtail Wings */}
                                  <path
                                    d="M 13,2.5 Q 36,1.2 59,2.5 L 68,1 L 63.5,9 L 69,17 Q 36,18.2 13,17 L 3,17 L 8.5,9 L 4,1 Z"
                                    fill={`url(#ribbonGrad-${seat.id})`}
                                    filter={`url(#ribbonShadow-${seat.id})`}
                                    stroke={milestoneTheme.strokeColor}
                                    strokeWidth="0.75"
                                  />

                                  {/* 3D Dark Inner Fold Lines for Ribbon Wings Junction Depth */}
                                  <path d="M 13,2.5 L 13,17 L 10,9 Z" fill={milestoneTheme.foldColor} opacity="0.5" />
                                  <path d="M 59,2.5 L 59,17 L 62,9 Z" fill={milestoneTheme.foldColor} opacity="0.5" />

                                  {/* Specular Curved Gloss Light Overlay on Ribbon Top */}
                                  <path
                                    d="M 13,2.8 Q 36,1.5 59,2.8 L 59,6 Q 36,4.8 13,6 Z"
                                    fill={`url(#ribbonGloss-${seat.id})`}
                                  />
                                </svg>

                                {/* Clean White Bold Counter Text */}
                                <span className="relative z-10 font-black font-mono text-[9.5px] leading-none text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)] tracking-tight">
                                  {formatCounterNumber(seatVal)}
                                </span>
                              </div>
                            </motion.div>
                          );
                        })()}
                      </div>

                      {seat.isEmpty ? (
                        <div className="flex items-center justify-center gap-0.5 bg-transparent mt-0.5">
                          <span className="text-[11px] sm:text-[12px] font-black text-white font-mono drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)] leading-none bg-transparent select-none">
                            {seat.id}
                          </span>
                        </div>
                      ) : (
                        <div
                          className="mt-0.5 px-1.5 py-0.2 bg-transparent text-center max-w-[76px] sm:max-w-[84px] truncate flex items-center justify-center gap-0.5"
                        >
                          <span
                            className="text-[9.5px] font-bold text-white truncate block leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)]"
                          >
                            {seat.userName}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
            </>
          )}
        </div>

        {/* TEAM BATTLE (معركة الفريق) VS STATUS BAR & CONTROL PANEL */}
        {isTeamBattleActive && (
          <div className="w-full max-w-md mx-auto my-1.5 px-3 dir-rtl shrink-0 z-30 animate-fadeIn">
            {/* Dual PK Score Progress Bar - VISIBLE ONLY WHEN BATTLE IS RUNNING */}
            {teamBattleStatus === 'running' && (() => {
              const totalScore = redTeamScore + blueTeamScore;
              const redPct = totalScore === 0 ? 50 : Math.max(8, Math.min(92, (redTeamScore / totalScore) * 100));
              const bluePct = 100 - redPct;

              return (
                <div className="relative h-5 my-2">
                  {/* Outer Bar Track (Rounded pill holding the Red and Blue progress colors) */}
                  <div className="w-full h-full rounded-full bg-slate-950 overflow-hidden border-2 border-amber-500/40 flex shadow-[0_0_20px_rgba(0,0,0,0.8)]">
                    {/* Red Team Score Fill (Right side in RTL) */}
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 via-red-500 to-rose-600 transition-all duration-500 ease-out flex items-center justify-start px-2 font-mono text-[9px] font-black text-white whitespace-nowrap overflow-hidden"
                      style={{ width: `${redPct}%` }}
                    >
                      <span className="drop-shadow-sm">{redTeamScore.toLocaleString()} PK</span>
                    </div>

                    {/* Blue Team Score Fill (Left side in RTL) */}
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 via-cyan-500 to-blue-600 transition-all duration-500 ease-out flex items-center justify-end px-2 font-mono text-[9px] font-black text-white whitespace-nowrap overflow-hidden"
                      style={{ width: `${bluePct}%` }}
                    >
                      <span className="drop-shadow-sm">{blueTeamScore.toLocaleString()} PK</span>
                    </div>
                  </div>

                  {/* 3D Floating Dueling Swords & VS Marker (Realistic 3D, Containerless, Red Right / Blue Left) */}
                  <div
                    className="absolute top-1/2 transition-all duration-500 ease-out z-30 flex flex-col items-center justify-center pointer-events-none select-none"
                    style={{
                      right: `${redPct}%`,
                      transform: 'translate(50%, -50%)',
                    }}
                  >
                    {/* Glowing Vertical Split Beam */}
                    <div className="absolute -inset-y-3 w-0.5 bg-gradient-to-b from-amber-100 via-yellow-400 to-amber-600 shadow-[0_0_14px_#f59e0b] opacity-90 rounded-full" />

                    {/* Animated 3D Floating Dueling Assembly */}
                    <div className="relative flex flex-col items-center justify-center filter drop-shadow-[0_6px_12px_rgba(0,0,0,0.95)]">
                      {/* 3D Realistic Dueling Swords SVG */}
                      <div className="relative w-12 h-12 flex items-center justify-center">
                        <svg viewBox="0 0 72 72" className="w-full h-full overflow-visible">
                          <defs>
                            {/* RED TEAM SWORD 3D GRADIENTS (Right Side) */}
                            <linearGradient id="redBlade3D" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#ffffff" />
                              <stop offset="25%" stopColor="#fca5a5" />
                              <stop offset="65%" stopColor="#dc2626" />
                              <stop offset="100%" stopColor="#7f1d1d" />
                            </linearGradient>
                            <linearGradient id="redHilt3D" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#fde047" />
                              <stop offset="50%" stopColor="#d97706" />
                              <stop offset="100%" stopColor="#78350f" />
                            </linearGradient>
                            <radialGradient id="rubyCoreGlow" cx="50%" cy="50%" r="50%">
                              <stop offset="0%" stopColor="#ff4d4d" />
                              <stop offset="100%" stopColor="#990000" />
                            </radialGradient>

                            {/* BLUE TEAM SWORD 3D GRADIENTS (Left Side) */}
                            <linearGradient id="blueBlade3D" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#ffffff" />
                              <stop offset="25%" stopColor="#bae6fd" />
                              <stop offset="65%" stopColor="#0284c7" />
                              <stop offset="100%" stopColor="#0c4a6e" />
                            </linearGradient>
                            <linearGradient id="blueHilt3D" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#e2e8f0" />
                              <stop offset="50%" stopColor="#64748b" />
                              <stop offset="100%" stopColor="#0f172a" />
                            </linearGradient>
                            <radialGradient id="sapphireCoreGlow" cx="50%" cy="50%" r="50%">
                              <stop offset="0%" stopColor="#38bdf8" />
                              <stop offset="100%" stopColor="#0369a1" />
                            </radialGradient>

                            {/* CLASH SPARK GLOW */}
                            <radialGradient id="clashSparkGlow" cx="50%" cy="50%" r="50%">
                              <stop offset="0%" stopColor="#ffffff" />
                              <stop offset="40%" stopColor="#fef08a" />
                              <stop offset="80%" stopColor="#f59e0b" />
                              <stop offset="100%" stopColor="transparent" />
                            </radialGradient>
                          </defs>

                          {/* RED SWORD (Positioned on Right Side, Striking Leftwards) */}
                          <motion.g
                            animate={{
                              rotate: [-34, -26, -34],
                              x: [0, -2, 0],
                              y: [0, 1, 0],
                            }}
                            transition={{
                              repeat: Infinity,
                              duration: 0.5,
                              ease: 'easeInOut',
                            }}
                            style={{ transformOrigin: '48px 48px' }}
                          >
                            {/* Blade Drop Shadow */}
                            <path d="M48 48 L22 14 L20 18 L46 52 Z" fill="#000" opacity="0.4" />

                            {/* Realistic Main Blade */}
                            <path d="M48 48 L21 13 L17 11 L19 17 L46 52 Z" fill="url(#redBlade3D)" />
                            {/* Blade Ridge / Fuller Reflection */}
                            <line x1="47" y1="50" x2="19" y2="13" stroke="#ffffff" strokeWidth="0.8" opacity="0.85" />

                            {/* Guard (Crossguard) */}
                            <path d="M40 43 Q46 48 43 53 L49 51 Q51 45 44 40 Z" fill="url(#redHilt3D)" stroke="#f59e0b" strokeWidth="0.5" />

                            {/* Handle / Grip */}
                            <line x1="47" y1="50" x2="57" y2="60" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
                            <line x1="47" y1="50" x2="57" y2="60" stroke="#fef08a" strokeWidth="0.8" strokeDasharray="1 2" />

                            {/* Pommel Gem (Ruby) */}
                            <circle cx="58" cy="61" r="3.5" fill="url(#rubyCoreGlow)" stroke="#f59e0b" strokeWidth="0.8" />
                          </motion.g>

                          {/* BLUE SWORD (Positioned on Left Side, Striking Rightwards) */}
                          <motion.g
                            animate={{
                              rotate: [34, 26, 34],
                              x: [0, 2, 0],
                              y: [0, 1, 0],
                            }}
                            transition={{
                              repeat: Infinity,
                              duration: 0.5,
                              ease: 'easeInOut',
                            }}
                            style={{ transformOrigin: '24px 48px' }}
                          >
                            {/* Blade Drop Shadow */}
                            <path d="M24 48 L50 14 L52 18 L26 52 Z" fill="#000" opacity="0.4" />

                            {/* Realistic Main Blade */}
                            <path d="M24 48 L51 13 L55 11 L53 17 L26 52 Z" fill="url(#blueBlade3D)" />
                            {/* Blade Ridge / Fuller Reflection */}
                            <line x1="25" y1="50" x2="53" y2="13" stroke="#ffffff" strokeWidth="0.8" opacity="0.85" />

                            {/* Guard (Crossguard) */}
                            <path d="M32 43 Q26 48 29 53 L23 51 Q21 45 28 40 Z" fill="url(#blueHilt3D)" stroke="#e2e8f0" strokeWidth="0.5" />

                            {/* Handle / Grip */}
                            <line x1="25" y1="50" x2="15" y2="60" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
                            <line x1="25" y1="50" x2="15" y2="60" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="1 2" />

                            {/* Pommel Gem (Sapphire) */}
                            <circle cx="14" cy="61" r="3.5" fill="url(#sapphireCoreGlow)" stroke="#e2e8f0" strokeWidth="0.8" />
                          </motion.g>

                          {/* REALISTIC CLASH SPARK EFFECT */}
                          <motion.g
                            animate={{
                              scale: [0.7, 1.35, 0.7],
                              opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                              repeat: Infinity,
                              duration: 0.25,
                              ease: 'easeInOut',
                            }}
                            style={{ transformOrigin: '36px 28px' }}
                          >
                            <circle cx="36" cy="28" r="7" fill="url(#clashSparkGlow)" />
                            <circle cx="36" cy="28" r="2.5" fill="#ffffff" />
                            <path d="M36 18 L36 38 M26 28 L46 28" stroke="#ffffff" strokeWidth="0.9" opacity="0.9" />
                          </motion.g>
                        </svg>
                      </div>

                      {/* Floating 3D "VS" Text (Borderless & Containerless) */}
                      <span
                        className="font-black italic text-[11px] tracking-tighter -mt-1.5 bg-gradient-to-b from-yellow-100 via-amber-300 to-amber-600 bg-clip-text text-transparent select-none filter drop-shadow-[0_2px_4px_rgba(0,0,0,1)]"
                        style={{
                          textShadow: '0 0 10px rgba(245, 158, 11, 0.9), 0 2px 4px rgba(0, 0, 0, 1)',
                          WebkitTextStroke: '0.4px rgba(255, 255, 255, 0.8)',
                        }}
                      >
                        VS
                      </span>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Team Banners & Controls Row (Matching Image 2) */}
            <div className="mt-1 flex items-center justify-between text-xs font-black">
              {/* Red Team Banner (Right side in RTL) */}
              <div className="bg-gradient-to-r from-rose-950/90 to-red-900/90 border border-rose-500/50 rounded-xl px-2.5 py-1 text-rose-300 flex items-center gap-1.5 shadow-md">
                <span className="text-sm">🚩</span>
                <div className="flex flex-col text-right">
                  <span className="text-[10px] font-bold text-rose-200">الفريق الأحمر</span>
                  <span className="text-[9px] font-mono text-rose-400/80">Lv0</span>
                </div>
              </div>

              {/* Center Capsule Pill Button */}
              <div className="bg-gradient-to-r from-purple-950/90 via-slate-900 to-indigo-950/90 border border-purple-500/50 rounded-full px-3 py-1 flex items-center gap-2 shadow-xl">
                <button
                  onClick={() => {
                    if (isOwner) {
                      setShowTeamBattleModal(true);
                    } else {
                      setToastNotification('معاينة إعدادات التحدي (متاحة للتعديل للمالك فقط 👑)');
                      setTimeout(() => setToastNotification(null), 3000);
                    }
                  }}
                  className="flex items-center gap-1 text-[10.5px] font-black text-purple-200 hover:text-white cursor-pointer"
                >
                  <span>معركة الفريق</span>
                  <HelpCircle className="w-3 h-3 text-purple-400" />
                </button>

                {/* Action Button: Start / End / Timer */}
                {teamBattleStatus === 'preparation' ? (
                  <button
                    onClick={() => {
                      if (!isOwner) {
                        setToastNotification('بدء التحدي متاح لمالك الغرفة فقط 👑');
                        setTimeout(() => setToastNotification(null), 3000);
                        return;
                      }
                      const allowedMicCounts = [2, 4, 5, 6, 8, 9, 10, 12, 15, 20];
                      if (!allowedMicCounts.includes(activeMicCount)) {
                        setToastNotification('لا يمكن تشغيل التحدي بهذا العدد من المايكات');
                        setTimeout(() => setToastNotification(null), 3000);
                        return;
                      }
                      setTeamBattleStatus('running');
                      setRedTeamScore(0);
                      setBlueTeamScore(0);
                      setSeatCounters({});
                      setPkTopSupportersMap({});
                      setToastNotification('بدأت معركة الفريق الآن! ⚔️🔥');
                      setTimeout(() => setToastNotification(null), 3000);
                    }}
                    className="px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-rose-500 text-slate-950 text-[11px] font-black shadow-lg shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 border border-amber-300 ring-2 ring-amber-400/40 animate-pulse"
                  >
                    <Swords className="w-3.5 h-3.5 text-slate-950 stroke-[2.5]" />
                    <span>بدء المعركة</span>
                  </button>
                ) : teamBattleStatus === 'running' ? (
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] text-amber-300 font-black animate-pulse">
                      ⏱️ {Math.floor(teamBattleTimer / 60)}:{String(teamBattleTimer % 60).padStart(2, '0')}
                    </span>
                    {isOwner && (
                      <button
                        onClick={() => {
                          finishTeamBattleRound();
                        }}
                        className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[9px] font-bold hover:bg-rose-700 cursor-pointer shadow-sm"
                      >
                        إنهاء المعركة
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setIsTeamBattleActive(false);
                      setToastNotification('انتهت معركة الفريق 🎉');
                      setTimeout(() => setToastNotification(null), 3000);
                    }}
                    className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black cursor-pointer"
                  >
                    تمت الجولة
                  </button>
                )}
              </div>

              {/* Blue Team Banner (Left side in RTL) */}
              <div className="bg-gradient-to-r from-blue-950/90 to-cyan-900/90 border border-cyan-500/50 rounded-xl px-2.5 py-1 text-cyan-300 flex items-center gap-1.5 shadow-md">
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-bold text-cyan-200">الفريق الأزرق</span>
                  <span className="text-[9px] font-mono text-cyan-400/80">Lv0</span>
                </div>
                <span className="text-sm">🚩</span>
              </div>
            </div>
          </div>
        )}

        {/* SUBTLE & COMPACT GIFT BANNER PILL IN MIDDLE OF SCREEN (ISOLATION TEST: Completely hidden/disabled during animation sequence) */}
        <AnimatePresence>
          {activeGiftBanner && flyingGifts.length === 0 && (
            <motion.div
              initial={{ opacity: 0, x: 150, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 150, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 320 }}
              className="absolute top-[31%] right-2 sm:right-4 z-20 max-w-[270px] bg-gradient-to-l from-[#171F33]/90 via-[#0F1626]/85 to-[#19243C]/90 border border-amber-400/50 rounded-full py-1 px-2.5 shadow-[0_6px_25px_rgba(0,0,0,0.7)] backdrop-blur-md flex items-center justify-between gap-2 pointer-events-none select-none"
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
                  {isVideoResource(activeGiftBanner.giftIcon) ? (
                    <video
                      src={activeGiftBanner.giftIcon}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-7 h-7 object-contain drop-shadow-[0_2px_8px_rgba(245,158,11,0.7)]"
                      style={{ mixBlendMode: 'screen' }}
                    />
                  ) : isMediaUrl(activeGiftBanner.giftIcon) ? (
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
                  {!videoHasRenderError && (activeVideoGift.videoUrl || isVideoResource(activeVideoGift.icon)) ? (
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
                  ) : activeVideoGift.thumbnailUrl || isMediaUrl(activeVideoGift.icon) ? (
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

        {/* DYNAMIC LUCKY CHEST WINNER RECTANGLE TOAST (Disappears automatically after 4.5s) */}
        <LuckyChestWinnerToast
          winnerNotice={activeLuckyChestWinnerNotice}
          onOpenUserProfile={() => {
            if (activeLuckyChestWinnerNotice) {
              setSelectedUserForProfile({
                id: activeLuckyChestWinnerNotice.id,
                name: activeLuckyChestWinnerNotice.userName,
                avatar: activeLuckyChestWinnerNotice.avatar,
                userId: activeLuckyChestWinnerNotice.id,
                country: 'سوريا',
                countryFlag: '🇸🇾',
                badges: [
                  { id: '1', label: 'VIP 6', bgClass: 'bg-gradient-to-r from-amber-500 to-yellow-300 text-slate-950 font-black' },
                  { id: '2', label: 'Lv.50', bgClass: 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold' }
                ]
              });
              setShowAdvancedProfileModal(true);
            }
          }}
        />

        {/* 4. ISOLATED LIVE CHAT MESSAGES FEED WITH ABSOLUTE OVERLAY CUMULATIVE CLOCK */}
        <div className="relative flex-1 min-h-0 flex flex-col w-full">
          {/* CUMULATIVE BROADCAST HOURS CLOCK BADGE FLOATING OVER TOP OF CHAT (TAKES ZERO LAYOUT SPACE) */}
          {showCountersOnMics && (
            <div className="absolute top-1 left-1/2 -translate-x-1/2 z-30 pointer-events-none select-none">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-950/80 border border-amber-500/30 backdrop-blur-md text-amber-300 text-[11px] font-mono font-bold tracking-wide shadow-sm">
                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="dir-ltr">{formatUptimeTime(roomUptimeSeconds)}</span>
              </div>
            </div>
          )}

          <RoomChatFeed
            chatMessages={chatMessages}
            onReplyTo={(reply) => setReplyingToMessage(reply)}
            onOpenChatInput={() => setShowChatInputModal(true)}
            onOpenUserProfile={(userData) => {
              setSelectedUserForProfile(userData);
              setShowAdvancedProfileModal(true);
            }}
          />

          {/* DEDICATED LEFT-SIDE GIFT & PRIZES STREAM (TAKES ~20-25% ON THE LEFT, LEAVING MAIN CHAT 100% CLEAN) */}
          <SideGiftStream
            events={sideGiftEvents}
            onExpireEvent={handleExpireSideGiftEvent}
          />
        </div>
      </div>

      {/* 5. BOTTOM CONTROL DOCK BAR (Available to all users) */}
      <div
        style={{
          backgroundColor: hexToRgba(mainRoomConfig.bottomBarBgColor || '#0D121F', (mainRoomConfig.bottomBarOpacity ?? 90) / 100),
          borderColor: mainRoomConfig.bottomBarBorderColor || 'rgba(255, 255, 255, 0.1)',
          backdropFilter: `blur(${mainRoomConfig.bottomBarBackdropBlur || 16}px)`
        }}
        className="relative z-30 px-3 py-1.5 border-t flex items-center justify-between gap-1 w-full max-w-full overflow-x-hidden"
      >
        {/* Far Right (1st in DOM): Chat Input Popup Toggle Button */}
        <button
          onClick={() => {
            if (isChatLocked && !canUserTypeInChat()) {
              setToastNotification('الدردشة النصية مقفلة للمستمعين 🔒 (متاحة لأعضاء المايك والإدارة فقط)');
              setTimeout(() => setToastNotification(null), 3000);
            }
            setShowChatInputModal(true);
          }}
          title={isChatLocked && !canUserTypeInChat() ? 'الدردشة مقفلة للمستمعين 🔒' : 'إرسال رسالة'}
          style={{
            backgroundColor: isChatLocked && !canUserTypeInChat() ? undefined : mainRoomConfig.bottomButtonsBg || '#1A2234'
          }}
          className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all shadow-md relative ${
            isChatLocked && !canUserTypeInChat()
              ? 'bg-rose-950/80 text-rose-300 border border-rose-500/50 hover:bg-rose-900/80 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
              : 'hover:brightness-125 text-slate-300'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          {/* Prominent Lock icon for listeners when chat is locked */}
          {isChatLocked && !canUserTypeInChat() ? (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center text-[9px] shadow-md border border-[#0D121F] animate-pulse">
              <Lock className="w-2.5 h-2.5 stroke-[2.5]" />
            </span>
          ) : (
            <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-red-500 ring-1.5 ring-[#0D121F]" />
          )}
        </button>

        {/* 2nd from Right (2nd in DOM): Mic Toggle Button (Control Lock for Admin Mute) */}
        <button
          onClick={handleToggleMyMic}
          title={
            isMySeatMutedByAdmin
              ? 'الميكروفون مكتوم إدارياً 🔒 (استخدم نافذة البروفايل للتحكم)'
              : isMyMicMuted
              ? 'فتح المايك (Unmute)'
              : 'كتم المايك (Mute)'
          }
          style={{
            backgroundColor:
              isMySeatMutedByAdmin || isMyMicMuted
                ? undefined
                : mainRoomConfig.bottomButtonsBg || '#1A2234'
          }}
          className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors shadow-md relative ${
            isMySeatMutedByAdmin
              ? 'bg-rose-950/90 border border-rose-500 text-rose-300 ring-2 ring-rose-500/40 opacity-90'
              : isMyMicMuted
              ? 'bg-red-500/80 text-white'
              : 'text-slate-300 hover:brightness-125'
          }`}
        >
          {isMySeatMutedByAdmin ? (
            <div className="relative flex items-center justify-center">
              <MicOff className="w-4 h-4 text-rose-300 stroke-[2.5]" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 ring-1 ring-white" />
            </div>
          ) : isMyMicMuted ? (
            <MicOff className="w-4 h-4 stroke-[2.5]" />
          ) : (
            <Mic className="w-4 h-4 stroke-[2.5]" />
          )}
        </button>

        {/* 3rd from Right (3rd in DOM): Emoji Button */}
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          style={{
            backgroundColor: mainRoomConfig.bottomButtonsBg || '#1A2234'
          }}
          className="w-8 h-8 rounded-full hover:brightness-125 text-yellow-300 flex items-center justify-center cursor-pointer transition-colors shadow-md relative"
        >
          <Smile className="w-4 h-4" />
        </button>

        {/* Center (4th in DOM): Prominent Glowing Gift Box Button */}
        <button
          id="room-gift-button"
          onClick={() => {
            setSelectedGiftTargetSeatIds([]);
            setShowGiftDrawer(true);
          }}
          style={{
            boxShadow: `0 0 ${mainRoomConfig.bottomGiftGlowIntensity ?? 16}px ${mainRoomConfig.bottomGiftGlowColor || '#ec4899'}`
          }}
          className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-amber-400 p-0.5 flex items-center justify-center cursor-pointer transition-transform hover:scale-110 -translate-y-0.5 animate-pulse"
        >
          <div className="w-full h-full rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
            <Gift className="w-4.5 h-4.5 text-white fill-white" />
          </div>
        </button>

        {/* 3rd from Left (5th in DOM): Raise Hand / Mic Request Queue Button */}
        <button
          onClick={() => {
            if (isCurrentAdmin) {
              setShowMicRequestsModal(true);
            } else {
              handleRequestMicFromUser();
            }
          }}
          style={{
            backgroundColor: mainRoomConfig.bottomButtonsBg || '#1A2234'
          }}
          className="w-8 h-8 rounded-full hover:brightness-125 text-cyan-300 flex items-center justify-center cursor-pointer transition-colors shadow-md relative"
          title={isCurrentAdmin ? 'إدارة طلبات الصعود للمايك' : 'طلب صعود للمايك'}
        >
          <Hand className="w-4 h-4 text-cyan-400" />
          {micRequests.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[8px] font-mono font-extrabold w-4 h-4 rounded-full flex items-center justify-center border border-[#0D121F] shadow-sm">
              {micRequests.length}
            </span>
          )}
        </button>

        {/* 2nd from Left (6th in DOM): Gamepad Games Button (Pink Glow) */}
        <button
          onClick={() => setShowYoHoBottomToolsModal(true)}
          className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-600 via-purple-600 to-pink-500 text-white flex items-center justify-center cursor-pointer shadow-[0_0_10px_rgba(236,72,153,0.5)] transition-transform hover:scale-105"
          title="الألعاب التفاعلية والأدوات"
        >
          <Gamepad2 className="w-4 h-4" />
        </button>

        {/* Far Left (7th in DOM): Grid Menu Button */}
        <button
          id="room-bottom-left-actions"
          onClick={() => setShowYoHoBottomToolsModal(true)}
          style={{
            backgroundColor: mainRoomConfig.bottomButtonsBg || '#1A2234'
          }}
          className="w-8 h-8 rounded-full hover:brightness-125 text-slate-300 flex items-center justify-center cursor-pointer transition-colors shadow-md"
          title="الأدوات الأساسية والألعاب"
        >
          <Grid className="w-4 h-4" />
        </button>
      </div>

      {/* CHAT INPUT MODAL POPUP (INSTANT ZERO-LAG & FLUSH ALIGNED) */}
      <AnimatePresence>
        {showChatInputModal && (
          <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 cursor-default select-none pointer-events-auto transition-opacity duration-75"
            onPointerDown={(e) => {
              if (e.target === e.currentTarget) {
                if (document.activeElement instanceof HTMLElement) {
                  document.activeElement.blur();
                }
                setShowChatInputModal(false);
              }
            }}
          >
            <div
              dir="rtl"
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-[#121827] border-t border-x border-white/20 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] rounded-t-2xl shadow-2xl pointer-events-auto transform-gpu"
            >
              {/* CONDITIONAL REPLY PREVIEW BAR (معاينة الرد الشرطية - تظهر فقط عند وجود رد مفعل) */}
              {replyingToMessage && (
                <div className="flex items-center justify-between gap-2 p-2 mb-2 bg-[#1B2338] border border-amber-400/40 border-r-4 border-r-amber-400 rounded-xl text-xs shadow-md">
                  <div className="flex items-center gap-2 min-w-0">
                    {/* Speaker Avatar Thumbnail */}
                    <img
                      src={
                        replyingToMessage.avatar ||
                        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'
                      }
                      alt={replyingToMessage.userName}
                      className="w-7 h-7 rounded-full object-cover border border-amber-400/60 shadow-xs shrink-0"
                    />
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1 text-[10px] font-black text-amber-300">
                        <CornerUpLeft className="w-3 h-3 text-amber-400 shrink-0" />
                        <span>جاري الرد على @{replyingToMessage.userName}:</span>
                      </div>
                      <span className="text-[11px] text-slate-100 font-medium truncate">{replyingToMessage.text}</span>
                    </div>
                  </div>
                  {/* Close Icon (X) button to cancel reply */}
                  <button
                    type="button"
                    onClick={() => setReplyingToMessage(null)}
                    className="p-1 text-slate-400 hover:text-red-400 rounded-full hover:bg-white/10 cursor-pointer transition-colors shrink-0"
                    title="إلغاء الرد"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (document.activeElement instanceof HTMLElement) {
                    document.activeElement.blur();
                  }
                  handleSendMessage(e);
                }}
                className="flex items-center gap-2"
              >
                {/* Right side: Close (X) button & Yellow Send button */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      if (document.activeElement instanceof HTMLElement) {
                        document.activeElement.blur();
                      }
                      setShowChatInputModal(false);
                    }}
                    className="p-2 text-slate-400 hover:text-white rounded-xl bg-[#1A2132] hover:bg-red-950/40 transition-colors cursor-pointer"
                    title="إغلاق"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs cursor-pointer shadow-md hover:brightness-105 active:scale-95 transition-transform"
                  >
                    إرسال
                  </button>
                </div>

                {/* Left side: Message Input Box */}
                <input
                  type="text"
                  autoFocus
                  disabled={!canUserTypeInChat()}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={canUserTypeInChat() ? "إرسال رسالة للشات..." : "الدردشة مقفلة، اطلب المايك للكتابة 🔒"}
                  className={`flex-1 border rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none ${
                    canUserTypeInChat()
                      ? 'bg-[#1A2132] border-white/10 focus:border-amber-400'
                      : 'bg-slate-900 border-rose-500/30 text-slate-500 cursor-not-allowed'
                  }`}
                />
              </form>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* MOVABLE & DYNAMIC EMOJI / LOTTIE REACTION PICKER */}
      <MovableEmojiLottiePicker
        isOpen={showEmojiPicker}
        onClose={() => setShowEmojiPicker(false)}
        onSendEmojiReaction={handleSendEmojiReaction}
      />

      {/* PROFESSIONAL GIFTS PANEL */}
      <ProfessionalGiftPanel
        isOpen={showGiftDrawer}
        onClose={() => {
          setSelectedGiftTargetSeatIds([]);
          setShowGiftDrawer(false);
        }}
        userCoins={userCoinsBalance}
        initialSelectedSeatIds={selectedGiftTargetSeatIds}
        onOpenRecharge={onOpenRecharge}
        onSendGift={(gift, quantity, targetName, targetSeatIds) => {
          const totalVal = gift.price * quantity;
          handleSendGift(
            `${gift.name} (x${quantity}) [إلى: ${targetName}]`,
            gift.icon,
            totalVal,
            gift.name,
            targetName,
            targetSeatIds,
            gift.videoUrl,
            gift
          );
        }}
        seats={activeSeats}
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
              className="w-full max-w-md bg-[#121827]/90 backdrop-blur-xl border-t-2 border-indigo-500/60 rounded-t-3xl p-4 space-y-4 text-white pointer-events-auto shadow-2xl"
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
              className="w-full max-w-md bg-[#121827]/90 backdrop-blur-xl border-t-2 border-slate-700 rounded-t-3xl p-4 space-y-3 text-white pointer-events-auto shadow-2xl"
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
                <div className="p-3 bg-[#1A2234] border border-amber-500/40 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-slate-100 font-extrabold text-xs">رتبة المستخدم الحالي تجريبياً</span>
                      <span className="text-[10px] text-slate-400">حدد الرتبة لاستعراض صلاحياتها بشكل مستقل</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 pt-1">
                    <button
                      onClick={() => setCurrentUserRole('owner')}
                      className={`py-1.5 px-1 rounded-xl text-[10px] font-black transition-all cursor-pointer text-center ${
                        currentUserRole === 'owner'
                          ? 'bg-amber-500 text-slate-950 shadow-xs ring-1 ring-amber-300'
                          : 'bg-white/5 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      👑 مالك
                    </button>

                    <button
                      onClick={() => setCurrentUserRole('host')}
                      className={`py-1.5 px-1 rounded-xl text-[10px] font-black transition-all cursor-pointer text-center ${
                        currentUserRole === 'host'
                          ? 'bg-cyan-500 text-slate-950 shadow-xs ring-1 ring-cyan-300'
                          : 'bg-white/5 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      🎙️ مضيف
                    </button>

                    <button
                      onClick={() => setCurrentUserRole('moderator')}
                      className={`py-1.5 px-1 rounded-xl text-[10px] font-black transition-all cursor-pointer text-center ${
                        currentUserRole === 'moderator'
                          ? 'bg-purple-600 text-white shadow-xs ring-1 ring-purple-300'
                          : 'bg-white/5 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      🛡️ مشرف
                    </button>
                  </div>
                </div>

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
                    onClose();
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

      {/* TABBED STATISTICS PANEL (Diamond Badge / Support Stats Click) */}
      <AnimatePresence>
        {showRoomSupportModal && (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-auto cursor-default select-none"
            onClick={() => setShowRoomSupportModal(false)}
          >
            <motion.div
              initial={{ y: '100%', opacity: 0.5 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: leaderboardTheme.modalBgCustomCss || undefined,
                borderColor: leaderboardTheme.modalBorderColor,
                boxShadow: leaderboardTheme.modalGlowEffect || `0 0 35px ${leaderboardTheme.modalBorderColor}40`
              }}
              className={`w-full max-w-md ${!leaderboardTheme.modalBgCustomCss ? leaderboardTheme.modalBg : ''} backdrop-blur-2xl border-t-2 sm:border-2 rounded-t-3xl sm:rounded-3xl p-4 text-white shadow-2xl h-[82vh] min-h-[82vh] max-h-[82vh] flex flex-col justify-between pointer-events-auto overflow-hidden sm:mb-4`}
            >
              {/* Header & Main Tabs Row (Fixed Top Section) */}
              <div className="space-y-2.5 shrink-0">
                <div className="flex items-center justify-between pb-1 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Trophy
                      className="w-5 h-5"
                      style={{ color: leaderboardTheme.headerIconColor || '#fbbf24' }}
                    />
                    <h2
                      className="text-base font-black"
                      style={{ color: leaderboardTheme.headerTitleColor || '#fde047' }}
                    >
                      إحصائيات ولوحة متصدري الغرفة
                    </h2>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* DEVELOPER THEME CUSTOMIZATION BUTTON - ONLY VISIBLE TO THE PROGRAMMER */}
                    {isDeveloper(currentAppRole) && (
                      <button
                        onClick={() => setShowLeaderboardThemeModal(true)}
                        title="تخصيص ثيم وألوان النافذة (خاص بالمبرمج فقط)"
                        className="p-1.5 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 hover:brightness-110 shadow-md transition-all cursor-pointer flex items-center justify-center animate-pulse"
                      >
                        <Palette className="w-4 h-4 stroke-[2.5]" />
                      </button>
                    )}

                    <button
                      onClick={() => setShowRoomSupportModal(false)}
                      className="p-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Eyes of Guidance Full-Width Banner (Covers from right to left completely without gaps) */}
                <div
                  className="-mx-4 px-3 py-1.5 flex items-center justify-between text-[10.5px] font-bold border-y border-white/10 shadow-inner w-[calc(100%+2rem)]"
                  style={{
                    backgroundColor: leaderboardTheme.swipeBannerBg || 'rgba(15,23,42,0.85)',
                    color: leaderboardTheme.swipeBannerTextColor || '#e2e8f0'
                  }}
                >
                  <div
                    className="flex items-center gap-1 shrink-0 font-extrabold"
                    style={{ color: leaderboardTheme.cardStatsNumberColor || '#38bdf8' }}
                  >
                    <span>👁️</span>
                    <span>👈 اسحب لليسار</span>
                  </div>

                  <div className="flex-1 text-center font-black flex items-center justify-center gap-1.5 px-1 truncate">
                    <span className="animate-pulse">✨</span>
                    <span className="truncate">عيون الإرشاد: مرر للتنقل الفوري بين القوائم</span>
                    <span className="animate-pulse">✨</span>
                  </div>

                  <div
                    className="flex items-center gap-1 shrink-0 font-extrabold"
                    style={{ color: leaderboardTheme.cardStatsNumberColor || '#38bdf8' }}
                  >
                    <span>اسحب لليمين 👉</span>
                    <span>👁️</span>
                  </div>
                </div>

                {/* 3 Main Tabs: المساهمات (Diamonds), النادي (Club), الجاذبية (Charm) */}
                <div
                  className="grid grid-cols-3 gap-1 p-1 rounded-2xl border border-white/10 text-center"
                  style={{ backgroundColor: leaderboardTheme.tabsContainerBg }}
                >
                  <button
                    onClick={() => {
                      setStatsMainTab('diamonds');
                      setStatsTimeFilter('24h');
                    }}
                    style={{
                      background: statsMainTab === 'diamonds' ? leaderboardTheme.diamondsTabGradient : 'transparent',
                      color: statsMainTab === 'diamonds' ? leaderboardTheme.diamondsTabTextColor : leaderboardTheme.inactiveTabTextColor
                    }}
                    className={`py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      statsMainTab === 'diamonds' ? 'shadow-md scale-[1.02]' : 'hover:text-white'
                    }`}
                  >
                    💎 المساهمات
                  </button>

                  <button
                    onClick={() => {
                      setStatsMainTab('club');
                      setStatsTimeFilter('24h');
                    }}
                    style={{
                      background: statsMainTab === 'club' ? leaderboardTheme.clubTabGradient : 'transparent',
                      color: statsMainTab === 'club' ? leaderboardTheme.clubTabTextColor : leaderboardTheme.inactiveTabTextColor
                    }}
                    className={`py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      statsMainTab === 'club' ? 'shadow-md scale-[1.02]' : 'hover:text-white'
                    }`}
                  >
                    🛡️ النادي
                  </button>

                  <button
                    onClick={() => {
                      setStatsMainTab('charm');
                      setStatsTimeFilter('24h');
                    }}
                    style={{
                      background: statsMainTab === 'charm' ? leaderboardTheme.charmTabGradient : 'transparent',
                      color: statsMainTab === 'charm' ? leaderboardTheme.charmTabTextColor : leaderboardTheme.inactiveTabTextColor
                    }}
                    className={`py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      statsMainTab === 'charm' ? 'shadow-md scale-[1.02]' : 'hover:text-white'
                    }`}
                  >
                    ✨ الجاذبية
                  </button>
                </div>

                {/* Sub-time filters row */}
                <div className="flex items-center justify-center gap-2 pt-1">
                  {statsMainTab === 'club' ? (
                    <>
                      <button
                        onClick={() => setStatsTimeFilter('24h')}
                        style={{
                          backgroundColor: statsTimeFilter === '24h' ? leaderboardTheme.filterActiveBg : leaderboardTheme.filterInactiveBg,
                          color: statsTimeFilter === '24h' ? leaderboardTheme.filterActiveText : '#94a3b8'
                        }}
                        className="px-3 py-1 rounded-full text-[11px] font-black transition-all cursor-pointer"
                      >
                        24 ساعة
                      </button>
                      <button
                        onClick={() => setStatsTimeFilter('weekly')}
                        style={{
                          backgroundColor: statsTimeFilter === 'weekly' ? leaderboardTheme.filterActiveBg : leaderboardTheme.filterInactiveBg,
                          color: statsTimeFilter === 'weekly' ? leaderboardTheme.filterActiveText : '#94a3b8'
                        }}
                        className="px-3 py-1 rounded-full text-[11px] font-black transition-all cursor-pointer"
                      >
                        أسبوعي
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setStatsTimeFilter('24h')}
                        style={{
                          backgroundColor: statsTimeFilter === '24h' ? leaderboardTheme.filterActiveBg : leaderboardTheme.filterInactiveBg,
                          color: statsTimeFilter === '24h' ? leaderboardTheme.filterActiveText : '#94a3b8'
                        }}
                        className="px-3 py-1 rounded-full text-[11px] font-black transition-all cursor-pointer"
                      >
                        24 ساعة
                      </button>
                      <button
                        onClick={() => setStatsTimeFilter('all')}
                        style={{
                          backgroundColor: statsTimeFilter === 'all' ? leaderboardTheme.filterActiveBg : leaderboardTheme.filterInactiveBg,
                          color: statsTimeFilter === 'all' ? leaderboardTheme.filterActiveText : '#94a3b8'
                        }}
                        className="px-3 py-1 rounded-full text-[11px] font-black transition-all cursor-pointer"
                      >
                        الإجمالي
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Swipe Container for Leaderboard List (Fixed Flex-1 Scrollable Center Area) */}
              <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.15}
                onDragEnd={(_e, info) => {
                  const threshold = 35;
                  const velocityThreshold = 120;
                  const tabsOrder: ('diamonds' | 'club' | 'charm')[] = ['diamonds', 'club', 'charm'];
                  const currentIdx = tabsOrder.indexOf(statsMainTab);

                  if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
                    if (currentIdx < tabsOrder.length - 1) {
                      setStatsMainTab(tabsOrder[currentIdx + 1]);
                      setStatsTimeFilter('24h');
                    }
                  } else if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
                    if (currentIdx > 0) {
                      setStatsMainTab(tabsOrder[currentIdx - 1]);
                      setStatsTimeFilter('24h');
                    }
                  }
                }}
                className="flex-1 min-h-0 overflow-y-auto no-scrollbar touch-pan-y cursor-grab active:cursor-grabbing my-2 pr-0.5"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={statsMainTab + statsTimeFilter}
                    initial={{ opacity: 0, x: statsMainTab === 'diamonds' ? 25 : statsMainTab === 'charm' ? -25 : 0 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: statsMainTab === 'diamonds' ? -25 : statsMainTab === 'charm' ? 25 : 0 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    className="space-y-2"
                  >
                    {/* 1. DIAMONDS LEADERBOARD LIST */}
                    {statsMainTab === 'diamonds' && (
                      (statsTimeFilter === '24h' ? [
                        { rank: 1, name: 'الأمير أسامة (الرئيس)', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100', level: '88', vip: 'VIP8', nLevel: 'N.15', val: '18,500,000 💎' },
                        { rank: 2, name: 'سارة الكابيتانو', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=100', level: '75', vip: 'VIP6', nLevel: 'N.12', val: '12,200,000 💎' },
                        { rank: 3, name: 'صقر الشام', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100', level: '64', vip: 'VIP5', nLevel: 'N.10', val: '9,300,000 💎' },
                        { rank: 4, name: 'الملك الكويتي', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100', level: '52', vip: 'VIP4', nLevel: 'N.8', val: '5,100,000 💎' },
                        { rank: 5, name: 'الدكتورة هناء', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100', level: '48', vip: 'VIP3', nLevel: 'N.6', val: '3,400,000 💎' }
                      ] : [
                        { rank: 1, name: 'السلطان قابوس', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100', level: '99', vip: 'VIP9', nLevel: 'N.20', val: '120,500,000 💎' },
                        { rank: 2, name: 'الأمير أسامة (الرئيس)', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100', level: '88', vip: 'VIP8', nLevel: 'N.15', val: '95,000,000 💎' },
                        { rank: 3, name: 'شيخ الشباب', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100', level: '82', vip: 'VIP7', nLevel: 'N.14', val: '68,200,000 💎' },
                        { rank: 4, name: 'لورد بغداد', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100', level: '71', vip: 'VIP6', nLevel: 'N.11', val: '42,000,000 💎' }
                      ]).map((item) => (
                        <div
                          key={item.rank}
                          onClick={() => {
                            setShowRoomSupportModal(false);
                            setSelectedUserForProfile({
                              id: `sup-dia-${item.rank}`,
                              name: item.name,
                              avatar: item.avatar,
                              userId: `9920${item.rank}`,
                              country: 'السعودية',
                              countryFlag: '🇸🇦'
                            });
                            setShowAdvancedProfileModal(true);
                          }}
                          style={{
                            backgroundColor: leaderboardTheme.cardBg,
                            borderColor: leaderboardTheme.cardBorderColor
                          }}
                          className="p-2.5 border rounded-2xl flex items-center justify-between text-xs transition-all cursor-pointer hover:scale-[1.01] relative overflow-visible shadow-sm"
                        >
                          <div className="flex items-center gap-2 overflow-visible max-w-[72%] relative z-10">
                            {/* Rank Badge (#1 Gold, #2 Silver, #3 Bronze) */}
                            <div
                              className={`w-7 h-7 shrink-0 rounded-xl flex items-center justify-center font-black text-xs shadow-md border ${
                                item.rank === 1
                                  ? 'bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 border-amber-200 ring-2 ring-amber-400/50'
                                  : item.rank === 2
                                  ? 'bg-gradient-to-tr from-slate-300 to-slate-100 text-slate-950 border-slate-200 ring-1 ring-slate-300'
                                  : item.rank === 3
                                  ? 'bg-gradient-to-tr from-amber-700 to-amber-500 text-white border-amber-600'
                                  : 'bg-white/10 text-slate-300 border-white/5'
                              }`}
                            >
                              {item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : item.rank === 3 ? '🥉' : item.rank}
                            </div>

                            {/* Themed Avatar Frame (Top 1, 2, 3 with custom upload / preset support) */}
                            {(() => {
                              const frameConfig =
                                item.rank === 1
                                  ? leaderboardTheme.rank1Frame
                                  : item.rank === 2
                                  ? leaderboardTheme.rank2Frame
                                  : item.rank === 3
                                  ? leaderboardTheme.rank3Frame
                                  : null;

                              if (!frameConfig || item.rank > 3) {
                                return (
                                  <img
                                    src={item.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'}
                                    alt={item.name}
                                    className="w-8 h-8 rounded-full object-cover border border-white/20 shrink-0"
                                  />
                                );
                              }

                              if (frameConfig.type === 'custom_upload' && frameConfig.customImageUrl) {
                                return (
                                  <div className="relative shrink-0 flex items-center justify-center mr-1 z-20 overflow-visible w-9 h-9">
                                    <img
                                      src={frameConfig.customImageUrl}
                                      alt="Custom Frame"
                                      className="absolute inset-0 w-full h-full object-contain pointer-events-none z-30 scale-135"
                                    />
                                    <img
                                      src={item.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'}
                                      alt={item.name}
                                      className="w-7 h-7 rounded-full object-cover relative z-10"
                                    />
                                  </div>
                                );
                              }

                              return (
                                <div className="relative shrink-0 flex items-center justify-center mr-1 z-20 overflow-visible">
                                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[13px] filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] z-30 select-none pointer-events-none">
                                    {frameConfig.crownEmoji || (item.rank === 1 ? '👑' : item.rank === 2 ? '💎' : '✨')}
                                  </span>
                                  <div
                                    className={`p-[2.5px] rounded-full bg-gradient-to-tr ${
                                      frameConfig.borderGradient ||
                                      (item.rank === 1
                                        ? 'from-amber-600 via-yellow-300 to-amber-500'
                                        : item.rank === 2
                                        ? 'from-slate-400 via-white to-slate-300'
                                        : 'from-amber-800 via-amber-500 to-yellow-600')
                                    } relative z-20`}
                                    style={{
                                      boxShadow: `0 0 16px ${
                                        frameConfig.glowColor ||
                                        (item.rank === 1 ? 'rgba(251,191,36,0.85)' : item.rank === 2 ? 'rgba(226,232,240,0.8)' : 'rgba(217,119,6,0.8)')
                                      }`
                                    }}
                                  >
                                    <div className="p-[1px] bg-[#121827] rounded-full">
                                      <img
                                        src={item.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'}
                                        alt={item.name}
                                        className="w-8 h-8 rounded-full object-cover"
                                      />
                                    </div>
                                  </div>
                                  <span
                                    className={`absolute -bottom-1 -right-0.5 text-[8px] rounded-full px-1 font-black shadow-md leading-tight z-30 pointer-events-none ${
                                      frameConfig.badgeBg && frameConfig.badgeBg.startsWith('from-')
                                        ? `bg-gradient-to-r ${frameConfig.badgeBg}`
                                        : ''
                                    }`}
                                    style={{
                                      background:
                                        frameConfig.badgeBg && !frameConfig.badgeBg.startsWith('from-')
                                          ? frameConfig.badgeBg
                                          : undefined,
                                      color:
                                        frameConfig.badgeTextColor ||
                                        (item.rank === 1 ? '#020617' : item.rank === 2 ? '#0f172a' : '#ffffff')
                                    }}
                                  >
                                    {frameConfig.starBadgeEmoji || (item.rank === 1 ? '★' : '✦')}
                                  </span>
                                </div>
                              );
                            })()}

                            {/* Single Line User Metadata: Name, Level, VIP, N-Level */}
                            <div className="flex items-center gap-1.5 truncate overflow-hidden min-w-0">
                              <span
                                className="font-black truncate text-[11px]"
                                style={{ color: leaderboardTheme.cardNameColor }}
                              >
                                {item.name}
                              </span>
                              <span
                                className="text-white text-[8px] font-black px-1.5 py-0.2 rounded-md shrink-0"
                                style={{ backgroundColor: leaderboardTheme.cardMetaLevelBg }}
                              >
                                Lv.{item.level}
                              </span>
                              <span
                                className="text-slate-950 text-[8px] font-black px-1.5 py-0.2 rounded-md shrink-0"
                                style={{ backgroundColor: leaderboardTheme.cardMetaVipBg }}
                              >
                                {item.vip}
                              </span>
                              <span
                                className="text-white text-[8px] font-black px-1.5 py-0.2 rounded-md shrink-0"
                                style={{ backgroundColor: leaderboardTheme.cardMetaNLevelBg }}
                              >
                                {item.nLevel}
                              </span>
                            </div>
                          </div>

                          {/* Value */}
                          <span
                            className="font-mono font-black text-xs dir-ltr shrink-0 pr-1"
                            style={{ color: leaderboardTheme.cardStatsNumberColor }}
                          >
                            {item.val}
                          </span>
                        </div>
                      ))
                    )}

                    {/* 2. CLUB RANKING LIST */}
                    {statsMainTab === 'club' && (
                      (statsTimeFilter === '24h' ? [
                        { rank: 1, name: 'نادي الفرسان الذهب', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100', level: '80', vip: 'VIP8', nLevel: 'N.16', val: '240,000 نقطة' },
                        { rank: 2, name: 'نادي الملوك والعظماء', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100', level: '72', vip: 'VIP7', nLevel: 'N.14', val: '180,000 نقطة' },
                        { rank: 3, name: 'نادي النجوم الأسطوري', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=100', level: '65', vip: 'VIP5', nLevel: 'N.11', val: '135,000 نقطة' }
                      ] : [
                        { rank: 1, name: 'نادي الصقور العالمية', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100', level: '90', vip: 'VIP9', nLevel: 'N.18', val: '1,250,000 نقطة' },
                        { rank: 2, name: 'نادي الفرسان الذهب', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100', level: '80', vip: 'VIP8', nLevel: 'N.16', val: '980,000 نقطة' },
                        { rank: 3, name: 'نادي عشاق الطرب', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100', level: '68', vip: 'VIP6', nLevel: 'N.12', val: '740,000 نقطة' }
                      ]).map((item) => (
                        <div
                          key={item.rank}
                          style={{
                            backgroundColor: leaderboardTheme.cardBg,
                            borderColor: leaderboardTheme.cardBorderColor
                          }}
                          className="p-2.5 border rounded-2xl flex items-center justify-between text-xs transition-colors relative overflow-visible shadow-sm"
                        >
                          <div className="flex items-center gap-2 overflow-visible max-w-[72%] relative z-10">
                            <div
                              className={`w-7 h-7 shrink-0 rounded-xl flex items-center justify-center font-black text-xs shadow-md border ${
                                item.rank === 1
                                  ? 'bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 border-amber-200'
                                  : item.rank === 2
                                  ? 'bg-gradient-to-tr from-slate-300 to-slate-100 text-slate-950 border-slate-200'
                                  : 'bg-gradient-to-tr from-amber-700 to-amber-500 text-white border-amber-600'
                              }`}
                            >
                              {item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : '🥉'}
                            </div>

                            {/* Themed Avatar Frame */}
                            {(() => {
                              const frameConfig =
                                item.rank === 1
                                  ? leaderboardTheme.rank1Frame
                                  : item.rank === 2
                                  ? leaderboardTheme.rank2Frame
                                  : item.rank === 3
                                  ? leaderboardTheme.rank3Frame
                                  : null;

                              if (!frameConfig || item.rank > 3) {
                                return (
                                  <img
                                    src={item.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'}
                                    alt={item.name}
                                    className="w-8 h-8 rounded-full object-cover border border-white/20 shrink-0"
                                  />
                                );
                              }

                              if (frameConfig.type === 'custom_upload' && frameConfig.customImageUrl) {
                                return (
                                  <div className="relative shrink-0 flex items-center justify-center mr-1 z-20 overflow-visible w-9 h-9">
                                    <img
                                      src={frameConfig.customImageUrl}
                                      alt="Custom Frame"
                                      className="absolute inset-0 w-full h-full object-contain pointer-events-none z-30 scale-135"
                                    />
                                    <img
                                      src={item.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'}
                                      alt={item.name}
                                      className="w-7 h-7 rounded-full object-cover relative z-10"
                                    />
                                  </div>
                                );
                              }

                              return (
                                <div className="relative shrink-0 flex items-center justify-center mr-1 z-20 overflow-visible">
                                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[13px] filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] z-30 select-none pointer-events-none">
                                    {frameConfig.crownEmoji || (item.rank === 1 ? '👑' : item.rank === 2 ? '💎' : '✨')}
                                  </span>
                                  <div
                                    className={`p-[2.5px] rounded-full bg-gradient-to-tr ${
                                      frameConfig.borderGradient ||
                                      (item.rank === 1
                                        ? 'from-amber-600 via-yellow-300 to-amber-500'
                                        : item.rank === 2
                                        ? 'from-slate-400 via-white to-slate-300'
                                        : 'from-amber-800 via-amber-500 to-yellow-600')
                                    } relative z-20`}
                                    style={{
                                      boxShadow: `0 0 16px ${
                                        frameConfig.glowColor ||
                                        (item.rank === 1 ? 'rgba(251,191,36,0.85)' : item.rank === 2 ? 'rgba(226,232,240,0.8)' : 'rgba(217,119,6,0.8)')
                                      }`
                                    }}
                                  >
                                    <div className="p-[1px] bg-[#121827] rounded-full">
                                      <img
                                        src={item.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'}
                                        alt={item.name}
                                        className="w-8 h-8 rounded-full object-cover"
                                      />
                                    </div>
                                  </div>
                                  <span
                                    className={`absolute -bottom-1 -right-0.5 text-[8px] rounded-full px-1 font-black shadow-md leading-tight z-30 pointer-events-none ${
                                      frameConfig.badgeBg && frameConfig.badgeBg.startsWith('from-')
                                        ? `bg-gradient-to-r ${frameConfig.badgeBg}`
                                        : ''
                                    }`}
                                    style={{
                                      background:
                                        frameConfig.badgeBg && !frameConfig.badgeBg.startsWith('from-')
                                          ? frameConfig.badgeBg
                                          : undefined,
                                      color:
                                        frameConfig.badgeTextColor ||
                                        (item.rank === 1 ? '#020617' : item.rank === 2 ? '#0f172a' : '#ffffff')
                                    }}
                                  >
                                    {frameConfig.starBadgeEmoji || (item.rank === 1 ? '★' : '✦')}
                                  </span>
                                </div>
                              );
                            })()}

                            <div className="flex items-center gap-1.5 truncate overflow-hidden min-w-0">
                              <span
                                className="font-black truncate text-[11px]"
                                style={{ color: leaderboardTheme.cardNameColor }}
                              >
                                {item.name}
                              </span>
                              <span
                                className="text-white text-[8px] font-black px-1.5 py-0.2 rounded-md shrink-0"
                                style={{ backgroundColor: leaderboardTheme.cardMetaLevelBg }}
                              >
                                Lv.{item.level}
                              </span>
                              <span
                                className="text-slate-950 text-[8px] font-black px-1.5 py-0.2 rounded-md shrink-0"
                                style={{ backgroundColor: leaderboardTheme.cardMetaVipBg }}
                              >
                                {item.vip}
                              </span>
                              <span
                                className="text-white text-[8px] font-black px-1.5 py-0.2 rounded-md shrink-0"
                                style={{ backgroundColor: leaderboardTheme.cardMetaNLevelBg }}
                              >
                                {item.nLevel}
                              </span>
                            </div>
                          </div>

                          <span
                            className="font-mono font-black text-xs dir-ltr shrink-0 pr-1"
                            style={{ color: leaderboardTheme.cardStatsNumberColor }}
                          >
                            {item.val}
                          </span>
                        </div>
                      ))
                    )}

                    {/* 3. CHARM RANKING LIST */}
                    {statsMainTab === 'charm' && (
                      (statsTimeFilter === '24h' ? [
                        { rank: 1, name: 'وردة الأمل', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=100', level: '70', vip: 'VIP7', nLevel: 'N.13', val: '2,850,000 ✨' },
                        { rank: 2, name: 'ليلى الملكة', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100', level: '66', vip: 'VIP6', nLevel: 'N.11', val: '1,920,000 ✨' },
                        { rank: 3, name: 'نغم السعادة', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100', level: '59', vip: 'VIP5', nLevel: 'N.9', val: '1,410,000 ✨' },
                        { rank: 4, name: 'شمس الأصيل', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100', level: '45', vip: 'VIP3', nLevel: 'N.6', val: '890,000 ✨' }
                      ] : [
                        { rank: 1, name: 'أميرة القلوب', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=100', level: '92', vip: 'VIP9', nLevel: 'N.19', val: '28,500,000 ✨' },
                        { rank: 2, name: 'وردة الأمل', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100', level: '70', vip: 'VIP7', nLevel: 'N.13', val: '19,200,000 ✨' },
                        { rank: 3, name: 'ملكة الشرق', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100', level: '68', vip: 'VIP6', nLevel: 'N.12', val: '14,800,000 ✨' }
                      ]).map((item) => (
                        <div
                          key={item.rank}
                          onClick={() => {
                            setShowRoomSupportModal(false);
                            setSelectedUserForProfile({
                              id: `sup-ch-${item.rank}`,
                              name: item.name,
                              avatar: item.avatar,
                              userId: `9920${item.rank}`,
                              country: 'السعودية',
                              countryFlag: '🇸🇦'
                            });
                            setShowAdvancedProfileModal(true);
                          }}
                          style={{
                            backgroundColor: leaderboardTheme.cardBg,
                            borderColor: leaderboardTheme.cardBorderColor
                          }}
                          className="p-2.5 border rounded-2xl flex items-center justify-between text-xs transition-all cursor-pointer hover:scale-[1.01] relative overflow-visible shadow-sm"
                        >
                          <div className="flex items-center gap-2 overflow-visible max-w-[72%] relative z-10">
                            <div
                              className={`w-7 h-7 shrink-0 rounded-xl flex items-center justify-center font-black text-xs shadow-md border ${
                                item.rank === 1
                                  ? 'bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 border-amber-200'
                                  : item.rank === 2
                                  ? 'bg-gradient-to-tr from-slate-300 to-slate-100 text-slate-950 border-slate-200'
                                  : item.rank === 3
                                  ? 'bg-gradient-to-tr from-amber-700 to-amber-500 text-white border-amber-600'
                                  : 'bg-white/10 text-slate-300 border-white/5'
                              }`}
                            >
                              {item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : item.rank === 3 ? '🥉' : item.rank}
                            </div>

                            {/* Themed Avatar Frame */}
                            {(() => {
                              const frameConfig =
                                item.rank === 1
                                  ? leaderboardTheme.rank1Frame
                                  : item.rank === 2
                                  ? leaderboardTheme.rank2Frame
                                  : item.rank === 3
                                  ? leaderboardTheme.rank3Frame
                                  : null;

                              if (!frameConfig || item.rank > 3) {
                                return (
                                  <img
                                    src={item.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'}
                                    alt={item.name}
                                    className="w-8 h-8 rounded-full object-cover border border-white/20 shrink-0"
                                  />
                                );
                              }

                              if (frameConfig.type === 'custom_upload' && frameConfig.customImageUrl) {
                                return (
                                  <div className="relative shrink-0 flex items-center justify-center mr-1 z-20 overflow-visible w-9 h-9">
                                    <img
                                      src={frameConfig.customImageUrl}
                                      alt="Custom Frame"
                                      className="absolute inset-0 w-full h-full object-contain pointer-events-none z-30 scale-135"
                                    />
                                    <img
                                      src={item.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'}
                                      alt={item.name}
                                      className="w-7 h-7 rounded-full object-cover relative z-10"
                                    />
                                  </div>
                                );
                              }

                              return (
                                <div className="relative shrink-0 flex items-center justify-center mr-1 z-20 overflow-visible">
                                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[13px] filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] z-30 select-none pointer-events-none">
                                    {frameConfig.crownEmoji || (item.rank === 1 ? '👑' : item.rank === 2 ? '💎' : '✨')}
                                  </span>
                                  <div
                                    className={`p-[2.5px] rounded-full bg-gradient-to-tr ${
                                      frameConfig.borderGradient ||
                                      (item.rank === 1
                                        ? 'from-amber-600 via-yellow-300 to-amber-500'
                                        : item.rank === 2
                                        ? 'from-slate-400 via-white to-slate-300'
                                        : 'from-amber-800 via-amber-500 to-yellow-600')
                                    } relative z-20`}
                                    style={{
                                      boxShadow: `0 0 16px ${
                                        frameConfig.glowColor ||
                                        (item.rank === 1 ? 'rgba(251,191,36,0.85)' : item.rank === 2 ? 'rgba(226,232,240,0.8)' : 'rgba(217,119,6,0.8)')
                                      }`
                                    }}
                                  >
                                    <div className="p-[1px] bg-[#121827] rounded-full">
                                      <img
                                        src={item.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'}
                                        alt={item.name}
                                        className="w-8 h-8 rounded-full object-cover"
                                      />
                                    </div>
                                  </div>
                                  <span
                                    className={`absolute -bottom-1 -right-0.5 text-[8px] rounded-full px-1 font-black shadow-md leading-tight z-30 pointer-events-none ${
                                      frameConfig.badgeBg && frameConfig.badgeBg.startsWith('from-')
                                        ? `bg-gradient-to-r ${frameConfig.badgeBg}`
                                        : ''
                                    }`}
                                    style={{
                                      background:
                                        frameConfig.badgeBg && !frameConfig.badgeBg.startsWith('from-')
                                          ? frameConfig.badgeBg
                                          : undefined,
                                      color:
                                        frameConfig.badgeTextColor ||
                                        (item.rank === 1 ? '#020617' : item.rank === 2 ? '#0f172a' : '#ffffff')
                                    }}
                                  >
                                    {frameConfig.starBadgeEmoji || (item.rank === 1 ? '★' : '✦')}
                                  </span>
                                </div>
                              );
                            })()}

                            <div className="flex items-center gap-1.5 truncate overflow-hidden min-w-0">
                              <span
                                className="font-black truncate text-[11px]"
                                style={{ color: leaderboardTheme.cardNameColor }}
                              >
                                {item.name}
                              </span>
                              <span
                                className="text-white text-[8px] font-black px-1.5 py-0.2 rounded-md shrink-0"
                                style={{ backgroundColor: leaderboardTheme.cardMetaLevelBg }}
                              >
                                Lv.{item.level}
                              </span>
                              <span
                                className="text-slate-950 text-[8px] font-black px-1.5 py-0.2 rounded-md shrink-0"
                                style={{ backgroundColor: leaderboardTheme.cardMetaVipBg }}
                              >
                                {item.vip}
                              </span>
                              <span
                                className="text-white text-[8px] font-black px-1.5 py-0.2 rounded-md shrink-0"
                                style={{ backgroundColor: leaderboardTheme.cardMetaNLevelBg }}
                              >
                                {item.nLevel}
                              </span>
                            </div>
                          </div>

                          <span
                            className="font-mono font-black text-xs dir-ltr shrink-0 pr-1"
                            style={{ color: leaderboardTheme.cardStatsNumberColor }}
                          >
                            {item.val}
                          </span>
                        </div>
                      ))
                    )}
                  </motion.div>
                </AnimatePresence>
              </motion.div>

              {/* Bottom Action / Footer Bar (Fixed Symmetrical Layout Across All Tabs) */}
              <div className="pt-2 border-t border-white/10 shrink-0 space-y-2">
                {statsMainTab === 'diamonds' && (
                  <>
                    <div
                      className="flex items-center justify-between text-xs px-3 py-1.5 rounded-xl border"
                      style={{
                        backgroundColor: leaderboardTheme.summaryBoxBg,
                        borderColor: leaderboardTheme.summaryBoxBorder
                      }}
                    >
                      <span
                        className="font-bold text-[11px]"
                        style={{ color: leaderboardTheme.summaryLabelColor }}
                      >
                        إجمالي الألماس والدعم بالروم:
                      </span>
                      <span
                        className="font-mono font-black dir-ltr text-xs"
                        style={{ color: leaderboardTheme.cardStatsNumberColor }}
                      >
                        {statsTimeFilter === '24h' ? '40,000,000 💎' : '325,700,000 💎'}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setShowRoomSupportModal(false);
                        onOpenRecharge?.();
                      }}
                      style={{
                        background: leaderboardTheme.actionButtonGradient,
                        color: leaderboardTheme.actionButtonTextColor
                      }}
                      className="w-full py-2.5 font-black text-xs rounded-xl shadow-md hover:brightness-110 cursor-pointer transition-all"
                    >
                      شحن ماسات وإرسال هدايا الآن 💎
                    </button>
                  </>
                )}

                {statsMainTab === 'club' && (
                  <>
                    <div
                      className="flex items-center justify-between text-xs px-3 py-1.5 rounded-xl border"
                      style={{
                        backgroundColor: leaderboardTheme.summaryBoxBg,
                        borderColor: leaderboardTheme.summaryBoxBorder
                      }}
                    >
                      <span
                        className="font-bold text-[11px]"
                        style={{ color: leaderboardTheme.summaryLabelColor }}
                      >
                        إجمالي نقاط وإنجازات الأندية:
                      </span>
                      <span
                        className="font-mono font-black dir-ltr text-xs"
                        style={{ color: leaderboardTheme.cardStatsNumberColor }}
                      >
                        {statsTimeFilter === '24h' ? '555,000 🛡️' : '2,970,000 🛡️'}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setShowRoomSupportModal(false);
                        setShowFamilyModal(true);
                      }}
                      className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-xs rounded-xl shadow-md hover:brightness-110 cursor-pointer transition-all flex items-center justify-center gap-1.5"
                    >
                      <Users className="w-4 h-4" />
                      <span>انضم الآن إلى النادي العائلي 🛡️</span>
                    </button>
                  </>
                )}

                {statsMainTab === 'charm' && (
                  <>
                    <div
                      className="flex items-center justify-between text-xs px-3 py-1.5 rounded-xl border"
                      style={{
                        backgroundColor: leaderboardTheme.summaryBoxBg,
                        borderColor: leaderboardTheme.summaryBoxBorder
                      }}
                    >
                      <span
                        className="font-bold text-[11px]"
                        style={{ color: leaderboardTheme.summaryLabelColor }}
                      >
                        إجمالي تفاعل وجاذبية الروم:
                      </span>
                      <span
                        className="font-mono font-black dir-ltr text-xs"
                        style={{ color: leaderboardTheme.cardStatsNumberColor }}
                      >
                        {statsTimeFilter === '24h' ? '7,070,000 ✨' : '62,500,000 ✨'}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setShowRoomSupportModal(false);
                        setShowGiftDrawer(true);
                      }}
                      className="w-full py-2.5 bg-gradient-to-r from-pink-500 via-rose-600 to-purple-600 text-white font-black text-xs rounded-xl shadow-md hover:brightness-110 cursor-pointer transition-all flex items-center justify-center gap-1.5"
                    >
                      <Gift className="w-4 h-4" />
                      <span>إرسال هدايا وزيادة نقاط الجاذبية ✨</span>
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* LEADERBOARD DEVELOPER THEME MODAL */}
      <LeaderboardThemeModal
        isOpen={showLeaderboardThemeModal}
        onClose={() => setShowLeaderboardThemeModal(false)}
        currentTheme={leaderboardTheme}
        onThemeChange={(newTheme) => setLeaderboardTheme(newTheme)}
      />

      {/* FAMILY MODAL */}
      <FamilyModal
        isOpen={showFamilyModal}
        onClose={() => setShowFamilyModal(false)}
      />

      {/* SUPER LEGEND MODAL */}
      <SuperLegendModal
        isOpen={showSuperLegendModal}
        onClose={() => setShowSuperLegendModal(false)}
        onOpenRecharge={onOpenRecharge}
      />

      {/* ROOM INFO & ADMIN PANEL MODAL */}
      <RoomInfoModal
        isOpen={showRoomInfoModal}
        onClose={() => setShowRoomInfoModal(false)}
        roomTitle={roomTitle}
        roomId={roomId}
        hostAvatar={hostSeat.avatar}
        hostName={hostSeat.userName}
        userRole={currentUserRole}
        currentAppRole={currentAppRole}
        onRoleChange={(role) => setCurrentUserRole(role)}
        onOpenSettings={() => setShowSettingsDrawer(true)}
      />

      {/* HOST PROFILE QUICK VIEW MODAL */}
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
      />

      {/* ADVANCED USER PROFILE MODAL (بطاقة البروفايل المتقدمة) */}
      <AdvancedUserProfileModal
        isOpen={showAdvancedProfileModal}
        onClose={() => setShowAdvancedProfileModal(false)}
        user={selectedUserForProfile}
        isCurrentAdmin={isCurrentAdmin}
        isRoomOwner={currentUserRole === 'owner'}
        currentAppRole={currentAppRole}
        onSendGift={(u) => {
          const targetSeatId = (u as any)?.seatId || selectedUserForProfile?.seatId || 1;
          setSelectedGiftTargetSeatIds([targetSeatId]);
          setShowAdvancedProfileModal(false);
          setShowGiftDrawer(true);
        }}
        onMentionUser={(u) => {
          setInputMessage(`@${u.name} `);
          setShowChatInputModal(true);
        }}
        onToggleMuteUser={(u) => {
          if (u.seatId) handleToggleMuteSeat(u.seatId, u.isMutedByAdmin !== undefined ? u.isMutedByAdmin : true);
        }}
        onManageSeat={(u) => {
          if (u.seatId) {
            setSelectedSeatForAction(u.seatId);
            setShowSeatActionModal(true);
          }
        }}
        onOpenAdminControls={() => setShowRoomInfoModal(true)}
        onOpenPrivateChat={() => setShowChatInputModal(true)}
      />

      {/* AUDIENCE / INVITE LIST MODAL (قائمة الاستدعاء للمايك والحضور - 18) */}
      <AnimatePresence>
        {showAudienceModal && (
          <div
            className="fixed inset-0 z-50 bg-transparent flex items-end justify-center p-0 sm:p-4 pointer-events-auto cursor-default select-none"
            onClick={() => setShowAudienceModal(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-[#121827]/90 backdrop-blur-xl border-t-2 border-indigo-500/60 rounded-t-3xl sm:rounded-3xl p-4 space-y-3 text-white shadow-2xl max-h-[80vh] flex flex-col pointer-events-auto"
              dir="rtl"
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/10 shrink-0">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-400" />
                  <h2 className="text-base font-black text-indigo-300">قائمة الاستدعاء للمايك 🎙️ (18)</h2>
                </div>
                <button
                  onClick={() => setShowAudienceModal(false)}
                  className="p-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-[10.5px] text-slate-300 font-medium shrink-0 flex items-center justify-between bg-indigo-950/40 border border-indigo-500/20 px-2.5 py-1.5 rounded-xl">
                <span>🎙️ الضغط على الاسم: إرسال دعوة للمايك</span>
                <span className="text-amber-300 font-bold">👤 الضغط على الأيقونة: عرض البروفايل</span>
              </p>

              <div className="overflow-y-auto space-y-2 flex-1 pr-1 custom-scrollbar">
                {[
                  { id: 'aud-1', name: 'أميرة الشرق 👑', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200', role: 'مضيف الغرفة 👑', level: 'Lv.90', vip: 'VIP 10', isHost: true },
                  { id: 'aud-2', name: 'سارة الكابيتانو', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200', role: 'أدمن الروم 🛡️', level: 'Lv.75', vip: 'VIP 6' },
                  { id: 'aud-3', name: 'خالد العتيبي', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', role: 'متحدث مايك 🎙️', level: 'Lv.64', vip: 'VIP 5' },
                  { id: 'aud-4', name: 'مريم العدني', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200', role: 'مستمع VIP 💎', level: 'Lv.58', vip: 'VIP 4' },
                  { id: 'aud-5', name: 'الملك الكويتي', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200', role: 'داعم أسطوري 🌟', level: 'Lv.82', vip: 'VIP 8' },
                  { id: 'aud-6', name: 'الدكتورة هناء', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200', role: 'مستمع مميز ✨', level: 'Lv.48', vip: 'VIP 3' },
                  { id: 'aud-7', name: 'وردة الأمل', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200', role: 'مستمع حاضر 🌸', level: 'Lv.35', vip: 'VIP 2' },
                  { id: 'aud-8', name: 'صقر الشمال', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', role: 'عضو نشيط ⚡', level: 'Lv.29', vip: 'VIP 1' }
                ].map((usr) => {
                  const isInvited = invitedUserIds.includes(usr.id);

                  const handleSendInvite = () => {
                    if (!isInvited) {
                      setInvitedUserIds((prev) => [...prev, usr.id]);
                    }
                    setToastNotification(`تم إرسال دعوة صعود للمايك إلى ${usr.name} 🎙️✨`);
                    setTimeout(() => setToastNotification(null), 3000);
                  };

                  return (
                    <div
                      key={usr.id}
                      onClick={handleSendInvite}
                      className="p-2.5 bg-[#1A2234] border border-white/10 hover:border-indigo-500/60 rounded-2xl flex items-center justify-between cursor-pointer transition-all hover:scale-[1.01] hover:bg-[#202B42]"
                    >
                      {/* User Info - Clicking here or entire card triggers Invite to Mic */}
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <img
                          src={usr.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'}
                          alt={usr.name}
                          className="w-9 h-9 rounded-full object-cover border border-indigo-400/50 shrink-0"
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

                      {/* Right Side Actions: Invite Action Button + Separate Profile View Button */}
                      <div className="flex items-center gap-2 shrink-0">
                        {/* Invite Button Badge */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSendInvite();
                          }}
                          className={`text-[10px] px-2.5 py-1 rounded-xl font-black flex items-center gap-1 transition-all cursor-pointer ${
                            isInvited
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-emerald-500/10'
                              : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:brightness-110 text-white shadow-md'
                          }`}
                        >
                          <Mic className="w-3 h-3" />
                          <span>{isInvited ? 'تمت الدعوة ✓' : 'استدعاء للمايك'}</span>
                        </button>

                        {/* Separate Profile Button (Exclusively opens Profile) */}
                        <button
                          type="button"
                          title="عرض الملف الشخصي"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevents row click (Invite) from firing
                            setShowAudienceModal(false);
                            setSelectedUserForProfile({
                              id: usr.id,
                              name: usr.name,
                              avatar: usr.avatar,
                              userId: `884${usr.id.slice(-3)}`,
                              country: 'السعودية',
                              countryFlag: '🇸🇦',
                              isHost: usr.isHost
                            });
                            setShowAdvancedProfileModal(true);
                          }}
                          className="p-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl transition-all cursor-pointer flex items-center gap-1 text-[10px] font-bold"
                        >
                          <User className="w-3.5 h-3.5 text-amber-300" />
                          <span className="hidden sm:inline">البروفايل</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SEAT ACTION MODAL (قائمة التحكم بالمقعد والمايك - خيارات الإدارة والجمهور) */}
      <SeatActionModal
        isOpen={showSeatActionModal}
        onClose={() => setShowSeatActionModal(false)}
        seatId={selectedSeatForAction}
        seatUserName={
          selectedSeatForAction
            ? allMicSeats.find((s) => s.id === selectedSeatForAction)?.userName
            : undefined
        }
        isSeatLocked={
          selectedSeatForAction
            ? allMicSeats.find((s) => s.id === selectedSeatForAction)?.isLocked
            : false
        }
        isSeatMuted={
          selectedSeatForAction
            ? allMicSeats.find((s) => s.id === selectedSeatForAction)?.isMuted
            : false
        }
        isCurrentAdmin={isCurrentAdmin}
        isRoomOwner={currentUserRole === 'owner'}
        currentUserSeatId={allMicSeats.find((s) => !s.isEmpty && (s.userName.includes('أنا') || s.userName.includes('المضيف') || (currentUserRole === 'host' && s.isHost)))?.id}
        onTakeSeat={(seatId) => handleTakeSeat(seatId)}
        onToggleLockSeat={(seatId) => handleToggleLockSeat(seatId)}
        onToggleMuteSeat={(seatId) => handleToggleMuteSeat(seatId, true)}
        onRequestMic={() => handleRequestMicFromUser()}
        onInviteAudience={() => setShowAudienceModal(true)}
        onRemoveFromMic={(seatId) => handleRemoveFromMic(seatId)}
        onViewProfile={(seatId) => {
          const targetSeat = allMicSeats.find((s) => s.id === seatId);
          if (targetSeat) {
            setSelectedUserForProfile({
              id: targetSeat.id.toString(),
              name: targetSeat.userName,
              avatar: targetSeat.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
              userId: `884${targetSeat.id}901`,
              country: 'السعودية',
              countryFlag: '🇸🇦',
              isHost: targetSeat.isHost,
              isMuted: targetSeat.isMuted,
              isMutedByAdmin: targetSeat.isMutedByAdmin,
              seatId: targetSeat.id
            });
            setShowAdvancedProfileModal(true);
          }
        }}
      />

      {/* SEAT REQUEST QUEUE MODAL (قائمة طلبات الصعود للميكروفون) */}
      <MicRequestQueueModal
        isOpen={showMicRequestsModal}
        onClose={() => setShowMicRequestsModal(false)}
        requests={micRequests}
        userRole={currentUserRole}
        isCurrentAdmin={isCurrentAdmin}
        onApproveRequest={handleApproveMicRequest}
        onRejectRequest={handleRejectMicRequest}
        onApproveAll={handleApproveAllMicRequests}
        onClearAll={handleClearAllMicRequests}
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

      {/* QUICK MIC & HOST OPTIONS MODAL (قائمة خيارات الملاحظات والمايك وتفاصيل المضيف) */}
      <QuickMicOptionsModal
        isOpen={showQuickMicOptionsModal}
        onClose={() => setShowQuickMicOptionsModal(false)}
        seatId={selectedSeatForQuickMic || undefined}
        userName={currentUserRole === 'host' ? 'المضيف (أنا)' : 'أنا'}
        isHost={currentUserRole === 'host' || selectedSeatForQuickMic === 1 || Boolean(selectedSeatForQuickMic && allMicSeats.find((s) => s.id === selectedSeatForQuickMic)?.isHost)}
        isMuted={
          selectedSeatForQuickMic
            ? Boolean(allMicSeats.find((s) => s.id === selectedSeatForQuickMic)?.isMuted)
            : false
        }
        canControlMic={isCurrentAdmin || isOwner}
        isCurrentAdmin={isCurrentAdmin}
        onToggleMute={() => {
          if (selectedSeatForQuickMic) {
            handleToggleMuteSeat(selectedSeatForQuickMic);
          }
        }}
        onLeaveSeat={() => handleLeaveSeat(selectedSeatForQuickMic || undefined)}
        onOpenDataStats={() => {
          const mySeatObj = selectedSeatForQuickMic ? allMicSeats.find((s) => s.id === selectedSeatForQuickMic) : null;
          setSelectedUserForProfile({
            id: 'my_user_profile',
            name: currentUserRole === 'host' ? 'المضيف (أنا)' : 'أنا',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
            userId: '88492011',
            country: 'السعودية',
            countryFlag: '🇸🇦',
            isHost: currentUserRole === 'host',
            isMuted: mySeatObj ? mySeatObj.isMuted : false,
            isMutedByAdmin: mySeatObj ? mySeatObj.isMutedByAdmin : false,
            seatId: selectedSeatForQuickMic || 1,
            badges: [
              { id: 'b1', label: currentUserRole === 'host' ? 'المضيف 👑' : 'متحدث المايك', icon: '👑', bgClass: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black' },
              { id: 'b2', label: 'VIP 10', icon: '💎', bgClass: 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold' },
              { id: 'b3', label: 'سوبر أسطورة', icon: '🔥', bgClass: 'bg-gradient-to-r from-red-500 to-amber-500 text-white font-bold' }
            ],
            cpRelation: {
              partnerName: 'أميرة الشرق 👑',
              partnerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
              level: 25,
              intimacyPoints: '128,900',
              title: 'الشريك الماسي 💖'
            }
          });
          setShowAdvancedProfileModal(true);
        }}
        onSendGift={() => {
          setSelectedGiftTargetSeatIds([selectedSeatForQuickMic || 1]);
          setShowQuickMicOptionsModal(false);
          setShowGiftDrawer(true);
        }}
      />

      {/* DYNAMIC MIC CONTROL PANEL MODAL (STRICTLY VISIBLE & LOADED FOR ROOM OWNER ONLY) */}
      <AnimatePresence>
        {showMicControlModal && isOwner && (
          <div
            className="fixed inset-0 z-50 bg-transparent flex items-center justify-center p-3 pointer-events-auto cursor-default select-none"
            onClick={() => setShowMicControlModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-[#121929]/95 backdrop-blur-xl border border-slate-700/60 rounded-3xl overflow-hidden shadow-2xl text-white space-y-3.5 pb-4 pointer-events-auto"
              dir="rtl"
            >
              {/* Modal Blue Header Banner */}
              <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-3.5 text-center relative shadow-md">
                <h2 className="text-base font-black text-white tracking-wide">وضع الميكروفون</h2>
                <button
                  onClick={() => setShowMicControlModal(false)}
                  className="absolute top-3 left-3 p-1 rounded-full bg-black/20 hover:bg-black/40 text-white/90 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="px-3.5 space-y-3">
                {/* Yellow Tips Section (قسم النصائح الأصفر) */}
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-2.5 text-[11px] text-amber-300 font-bold leading-snug space-y-1">
                  <div className="flex items-center gap-1 text-amber-200">
                    <span>نصائح:</span>
                    <span>1. المقعد الممتاز مناسب فقط للوضع mic-9؛</span>
                  </div>
                  <div className="text-amber-300/90 pr-11">
                    2. لا يدعم الوضع mic-9 ألعاب العملات الفضية؛
                  </div>
                </div>

                {/* Preset Thumbnails Grid (2, 5, 8, 9, 12, 15, 20) */}
                <div className={`grid grid-cols-3 gap-2.5 max-h-[380px] overflow-y-auto pr-0.5 custom-scrollbar transition-all ${
                  isCounterRunning && !isCounterPaused ? 'opacity-40 grayscale pointer-events-none select-none' : 'opacity-100'
                }`}>
                  {[2, 5, 8, 9, 12, 15, 20].map((preset) => {
                    const isSelected = activeMicCount === preset;

                    // Row layout definition for thumbnail circles
                    const getThumbRows = (cnt: number) => {
                      switch (cnt) {
                        case 2: return [2];
                        case 5: return [1, 4];
                        case 8: return [4, 4];
                        case 9: return [1, 4, 4];
                        case 12: return [2, 5, 5];
                        case 15: return [5, 5, 5];
                        case 20: return [5, 5, 5, 5];
                        default: return [4, 4];
                      }
                    };

                    const thumbRows = getThumbRows(preset);

                    return (
                      <button
                        key={preset}
                        disabled={isCounterRunning && !isCounterPaused}
                        onClick={() => onAttemptToChangeMicLayout(preset)}
                        className="flex flex-col items-center gap-1 group cursor-pointer disabled:cursor-not-allowed"
                      >
                        {/* Thumbnail Card */}
                        <div
                          className={`relative w-full aspect-[4/3] rounded-2xl p-1.5 transition-all flex flex-col items-center justify-center gap-1 overflow-hidden ${
                            isSelected
                              ? 'bg-[#182338] border-2 border-emerald-400 shadow-[0_0_18px_rgba(16,185,129,0.35)]'
                              : 'bg-[#151E2E] border border-white/10 hover:border-emerald-500/40 hover:bg-[#1A263B]'
                          }`}
                        >
                          {/* Dark bokeh ambient background texture */}
                          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/15 via-purple-900/20 to-slate-950/90 pointer-events-none" />

                          {/* Selected Check Badge in Top-Left */}
                          {isSelected && (
                            <div className="absolute top-1 left-1 z-10 w-4.5 h-4.5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-md">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </div>
                          )}

                          {/* Miniature Circle Slots */}
                          <div className="relative z-1 w-full flex flex-col items-center justify-center gap-0.5">
                            {thumbRows.map((colCount, rIdx) => (
                              <div key={rIdx} className="flex items-center justify-center gap-0.5">
                                {Array.from({ length: colCount }).map((_, cIdx) => (
                                  <div
                                    key={cIdx}
                                    className="w-3 h-3 rounded-full border border-white/40 bg-white/10 flex items-center justify-center text-white/90"
                                  >
                                    <Plus className="w-1.5 h-1.5 stroke-[3]" />
                                  </div>
                                ))}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Title text under thumbnail */}
                        <span
                          className={`text-[11px] font-black leading-tight ${
                            isSelected ? 'text-emerald-400' : 'text-slate-200'
                          }`}
                        >
                          {preset} ميكروفونات
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Bottom Toggle Switch Option (Matching screenshot) */}
                <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-300">
                    يلزمك أن تطلب أن تكون على الميكروفون.
                  </span>
                  <button
                    onClick={() => setRequireMicRequest(!requireMicRequest)}
                    className={`w-10 h-5.5 rounded-full p-0.5 transition-colors cursor-pointer relative shrink-0 ${
                      requireMicRequest ? 'bg-emerald-500' : 'bg-slate-700'
                    }`}
                  >
                    <div
                      className={`w-4.5 h-4.5 rounded-full bg-white shadow-sm transition-transform ${
                        requireMicRequest ? 'translate-x-0' : '-translate-x-4.5'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Integrated Music Player & Audio Import Modal */}
      <MusicPlayerModal
        isOpen={showMusicPlayerModal}
        onClose={() => setShowMusicPlayerModal(false)}
        currentUserRole={currentUserRole}
        canControl={isOwner || currentUserRole === 'host' || currentUserRole === 'moderator'}
        isMicSpeaking={allMicSeats.some((s) => !s.isEmpty && !s.isMuted && s.isSpeaking)}
        onToastNotification={(msg) => {
          setToastNotification(msg);
          setTimeout(() => setToastNotification(null), 3000);
        }}
      />

      {/* SCREEN: تحويل التأثير والصوت (Effects & Sound Settings Modal - 11 Toggle Controls) */}
      <EffectsAndSoundModal
        isOpen={showSoundEffectsModal}
        onClose={() => setShowSoundEffectsModal(false)}
        onTriggerToast={(msg) => {
          setToastNotification(msg);
          setTimeout(() => setToastNotification(null), 3000);
        }}
        onSettingsChanged={(cfg) => {
          if (cfg.smartBalance !== undefined) {
            setIsSmartBalanceEnabled(cfg.smartBalance);
          }
        }}
      />

      {/* Developer Configuration & Lottie Assets Manager Modal */}
      <DevConfigModal
        isOpen={showDevConfigModal}
        onClose={() => setShowDevConfigModal(false)}
      />

      {/* TOP THREE-DOTS OPTIONS MENU MODAL (قائمة الخيارات العلوية 16 عنصر شبكة 4x4) */}
      <TopOptionsMenuModal
        isOpen={showTopOptionsMenuModal}
        onClose={() => setShowTopOptionsMenuModal(false)}
        currentUserRole={currentUserRole}
        currentAppRole={currentAppRole}
        isVIP={true}
        userVipLevel={8}
        isRoomLocked={isRoomLocked}
        onToggleLockRoom={(passcode) => {
          setRoomLockStatus(!isRoomLocked, passcode);
        }}
        onClearChat={() => {
          setChatMessages([]);
          setToastNotification('تم مسح جميع رسائل الدردشة 🧹');
          setTimeout(() => setToastNotification(null), 3000);
        }}
        isChatLocked={isChatLocked}
        onToggleLockChat={() => {
          setIsChatLocked(!isChatLocked);
          setToastNotification(!isChatLocked ? 'تم قفل الدردشة في الغرفة 🚫' : 'تم فتح الدردشة في الغرفة 💬');
          setTimeout(() => setToastNotification(null), 3000);
        }}
        onOpenWallpapers={() => setShowRoomBackgroundStoreModal(true)}
        isIncognito={isIncognito}
        onToggleIncognito={() => {
          if (!isRoomLocked) {
            setToastNotification('يجب إغلاق الغرفة أولاً لاستخدام ميزة الإخفاء');
            setTimeout(() => setToastNotification(null), 3000);
            return;
          }
          const nextState = !isIncognito;
          setIsIncognito(nextState);
          setToastNotification(nextState ? 'تم تفعيل خاصية إخفاء الغرفة عن الجميع (تختفي من قائمة الرومات) 🥷🔒' : 'تم تعطيل وضع الإخفاء وإظهار الغرفة 👁️');
          setTimeout(() => setToastNotification(null), 3000);
        }}
        isCountersVisible={isCounterRunning && !isCounterPaused && showCountersOnMics}
        isCounterActive={isCounterRunning && !isCounterPaused}
        onOpenLeaderboard={() => {
          if (isCounterRunning && !isCounterPaused) {
            // أ. إيقاف العداد العادي وإخفاؤه
            stopCounter();
            setShowCountersOnMics(false);

            // حساب أرقام وإحصائيات الجولة العادية من العدادات (seatCounters)
            const seatScoresList: Array<{ seatId: number; userName: string; avatar?: string; score: number }> = [];
            let totalScore = 0;

            allMicSeats.forEach((seat) => {
              const val = seatCounters[seat.id] || 0;
              totalScore += val;
              if (val > 0 || !seat.isEmpty) {
                seatScoresList.push({
                  seatId: seat.id,
                  userName: seat.userName,
                  avatar: seat.avatar,
                  score: val
                });
              }
            });

            // الترتيب التنازلي حسب النقاط
            seatScoresList.sort((a, b) => b.score - a.score);

            const topItem = seatScoresList[0] || {
              seatId: 1,
              userName: hostSeat.userName || 'مالك الروم',
              avatar: hostSeat.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
              score: 0
            };

            setNormalRoundResultData({
              topSeatName: topItem.userName,
              topSeatAvatar: topItem.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
              topSeatNumber: topItem.seatId,
              topSeatScore: topItem.score,
              totalRoundScore: totalScore,
              seatScores: seatScoresList
            });

            // ب. إظهار نافذة نتائج الجولة العادية المستقلة تماماً عن التحدي
            setShowNormalRoundResultModal(true);
            setToastNotification('تم إيقاف العداد وإظهار نتيجة النجم الأكثر دعماً للجولة العادية 🏆');
            setTimeout(() => setToastNotification(null), 3500);
          } else {
            // ج. عند إعادة التشغيل: تصفير شاشي كامل وبدء جولة جديدة كلياً من الصفر
            setSeatCounters({});
            setIsCounterRunning(true);
            setIsCounterPaused(false);
            setShowCountersOnMics(true);
            setRoomUptimeSeconds(0);
            setToastNotification('تم تشغيل العداد الرقمي المباشر وبدء جولة جديدة من الصفر 🔢✨');
            setTimeout(() => setToastNotification(null), 3000);
          }
        }}
        onOpenRoomMode={() => setShowRoomInfoModal(true)}
        onOpenMusic={() => setShowMusicPlayerModal(true)}
        onOpenSoundEffects={() => setShowSoundEffectsModal(true)}
        onOpenMicMode={() => {
          if (isOwner) {
            setShowMicControlModal(true);
          } else {
            setToastNotification('تغيير وضع المايك متاح لمضيف الغرفة فقط 🎙️');
            setTimeout(() => setToastNotification(null), 3000);
          }
        }}
        onStartTeamBattle={() => {
          if (!isOwner) {
            setToastNotification('عذراً، بدء معركة الفريق متاح حصرياً لمالك الغرفة (Room Owner) فقط 👑');
            setTimeout(() => setToastNotification(null), 3000);
            return;
          }
          const allowedMicCounts = [2, 5, 8, 9];
          if (!allowedMicCounts.includes(activeMicCount)) {
            setToastNotification('لا يمكن تشغيل التحدي بهذا العدد من المايكات');
            setTimeout(() => setToastNotification(null), 3000);
            return;
          }
          setShowTeamBattleModal(true);
        }}
        onStartRoomPK={() => {
          setToastNotification('تم فتح تحدي الغُرَف PK 🥊🔥');
          setTimeout(() => setToastNotification(null), 3000);
        }}
        onOpenCustomTheme={() => {
          setToastNotification('جاري تجهيز ثيم المايكات الموحد 🎙️');
          setTimeout(() => setToastNotification(null), 3000);
        }}
        onTriggerToast={(msg) => {
          setToastNotification(msg);
          setTimeout(() => setToastNotification(null), 3200);
        }}
      />

      {/* YOHO BOTTOM TOOLS & GAMES MODAL (مطابقة قائمة الأزرار السفلية لمرجع يوهو) */}
      <YoHoRoomToolsAndGamesModal
        isOpen={showYoHoBottomToolsModal}
        onClose={() => setShowYoHoBottomToolsModal(false)}
        roomId={roomId}
        roomTitle={currentRoomTitle}
        isSpeakerMuted={isRoomSpeakerMuted}
        onToggleSpeaker={() => {
          const nextState = !isRoomSpeakerMuted;
          setIsRoomSpeakerMuted(nextState);
          setToastNotification(nextState ? 'تم إيقاف مكبر الصوت 🔇' : 'تم تشغيل مكبر الصوت 🔊');
          setTimeout(() => setToastNotification(null), 3000);
        }}
        onOpenSoundEffects={() => setShowSoundEffectsModal(true)}
        onOpenMusicPlayer={() => setShowMusicPlayerModal(true)}
        onOpenLuckyBox={() => setShowLuckyChestModal(true)}
        onOpenCinemaWatchParty={() => {
          if (isOwner) {
            setIsCinemaWatchMode(true);
            setShowCinemaVideoPickerModal(true);
            setToastNotification('تم فتح نافذة سينما الروم وتشغيل الفيديوهات 🎬🍿');
            setTimeout(() => setToastNotification(null), 3200);
          } else {
            setShowCinemaVideoPickerModal(true);
            setToastNotification('خاصية تشغيل الفيديو لمالك الغرفة فقط 👑 - يمكنك اقتراح مقاطع لعرضها 💡');
            setTimeout(() => setToastNotification(null), 3500);
          }
        }}
        onTriggerToast={(msg) => {
          setToastNotification(msg);
          setTimeout(() => setToastNotification(null), 3200);
        }}
      />

      {/* CINEMA YOUTUBE VIDEO PICKER, SUGGESTIONS & SEARCH MODAL */}
      <CinemaYouTubePickerModal
        isOpen={showCinemaVideoPickerModal}
        onClose={() => setShowCinemaVideoPickerModal(false)}
        isOwner={isOwner}
        currentUserRole={currentUserRole}
        currentUserName={
          currentUserRole === 'host'
            ? 'المضيف (أنا)'
            : currentUserRole === 'owner'
            ? (hostSeat.userName || 'مالك الغرفة')
            : currentUserRole === 'moderator'
            ? 'المشرف (أنا)'
            : 'عضو الغرفة (أنا)'
        }
        currentUserId={hostSeat.userId || 'user_current'}
        currentUserAvatar={hostSeat.avatar}
        currentVideoId={selectedCinemaVideo?.youtubeId}
        suggestions={videoSuggestions}
        onSelectVideo={(video) => {
          setSelectedCinemaVideo(video);
          setIsCinemaWatchMode(true);
        }}
        onSuggestVideo={handleSuggestVideo}
        onAcceptSuggestion={handleAcceptSuggestion}
        onDeleteSuggestion={handleDeleteSuggestion}
        onTriggerToast={(msg) => {
          setToastNotification(msg);
          setTimeout(() => setToastNotification(null), 3200);
        }}
      />

      {/* FLOATING LUCKY CHEST POPUP BENEATH GEMS / TOP HEADER */}
      <FloatingLuckyChestWidget
        activeChests={activeLuckyChests}
        currentUserId={hostSeat.userId || '88492011'}
        currentUserName={hostSeat.userName || hostName || 'عابر سبيل'}
        roomId={roomId || 'room-1'}
        onOpenChestClaim={(chest) => {
          setSelectedChestForClaim(chest);
          setShowLuckyChestClaimModal(true);
        }}
        isInsideRoom={true}
      />

      {/* LUCKY CHEST MODAL (إرسال صندوق حظ / سوبر / حقيبة الهدايا) */}
      <LuckyChestModal
        isOpen={showLuckyChestModal}
        onClose={() => setShowLuckyChestModal(false)}
        onSendChest={handleSendLuckyChest}
        userCoins={userCoins}
        onTriggerToast={(msg) => {
          setToastNotification(msg);
          setTimeout(() => setToastNotification(null), 3500);
        }}
      />

      {/* LUCKY CHEST CLAIM & WIN POPUP (الانقضاض على الصندوق والفوز الفوري) */}
      <LuckyChestClaimModal
        isOpen={showLuckyChestClaimModal}
        onClose={() => setShowLuckyChestClaimModal(false)}
        chest={selectedChestForClaim}
        currentUserId={hostSeat.userId || '88492011'}
        currentUserName={hostSeat.userName || hostName || 'عابر سبيل'}
        currentUserAvatar={hostSeat.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'}
        onClaimPrize={handleClaimLuckyChestPrize}
        onTriggerToast={(msg) => {
          setToastNotification(msg);
          setTimeout(() => setToastNotification(null), 3500);
        }}
      />

      {/* ROOM BACKGROUND STORE MODAL (RoomBackgroundStoreView) */}
      <RoomBackgroundStoreModal
        isOpen={showRoomBackgroundStoreModal}
        onClose={() => setShowRoomBackgroundStoreModal(false)}
        activeBackgroundUrl={currentRoomBgUrl}
        roomId={roomId}
        isOwner={isOwner}
        ownerId={hostSeat.userId || '88492011'}
        ownerName={hostSeat.userName || hostName}
        roomTitle={currentRoomTitle}
        themeConfig={mainRoomConfig}
        onSelectBackground={(bgUrl, bgName) => {
          setCurrentRoomBgUrl(bgUrl);
          setCurrentRoomBgName(bgName);
          setToastNotification(`تم تغيير خلفية الغرفة إلى "${bgName}" 🎨✨`);
          setTimeout(() => setToastNotification(null), 3000);
        }}
        isUnlockedViaGiftOrStore={true}
      />

      {/* DIGITAL COUNTER CONTROL MODAL (العداد الرقمي المتزامن للتحكم والتصفير بواسطة صاحب الغرفة) */}
      <DigitalCounterControlModal
        isOpen={showCounterControlModal}
        onClose={() => setShowCounterControlModal(false)}
        seatId={selectedSeatForCounterControl}
        seatUserName={
          selectedSeatForCounterControl
            ? allMicSeats.find((s) => s.id === selectedSeatForCounterControl)?.userName || `المقعد #${selectedSeatForCounterControl}`
            : ''
        }
        currentValue={
          selectedSeatForCounterControl ? seatCounters[selectedSeatForCounterControl] || 0 : 0
        }
        onUpdateCounter={(seatId, newValue) => {
          setSeatCounters((prev) => ({ ...prev, [seatId]: newValue }));
        }}
        onResetCounter={(seatId) => {
          setSeatCounters((prev) => ({ ...prev, [seatId]: 0 }));
        }}
        onTriggerToast={(msg) => {
          setToastNotification(msg);
          setTimeout(() => setToastNotification(null), 3200);
        }}
        isCounterRunning={isCounterRunning}
        isCounterPaused={isCounterPaused}
        onToggleCounterRunning={() => {
          if (isCounterRunning && !isCounterPaused) {
            stopCounter();
            setToastNotification('تم إيقاف العداد بنجاح ⏸️');
          } else {
            setIsCounterRunning(true);
            setIsCounterPaused(false);
            setShowCountersOnMics(true);
            setRoomUptimeSeconds(0);
            setToastNotification('تم تشغيل العداد بنجاح ▶️');
          }
          setTimeout(() => setToastNotification(null), 3000);
        }}
      />

      {/* TEAM BATTLE CONFIGURATION & START MODAL (نافذة معركة الفريق) */}
      <TeamBattleModal
        isOpen={showTeamBattleModal}
        onClose={() => setShowTeamBattleModal(false)}
        activeMicCount={activeMicCount}
        onConfirmStart={(config) => {
          const allowedMicCounts = [2, 4, 5, 6, 8, 9, 10, 12, 15, 20];
          if (!allowedMicCounts.includes(activeMicCount)) {
            setToastNotification('لا يمكن تشغيل التحدي بهذا العدد من المايكات');
            setTimeout(() => setToastNotification(null), 3000);
            return;
          }
          setIsTeamBattleActive(true);
          setTeamBattleStatus('preparation');
          setTeamBattleTimer(config.durationMinutes * 60);
          setOwnerJoinedTeam(config.joinedTeam);
          setRedTeamScore(0);
          setBlueTeamScore(0);
          setSeatCounters({});
          setPkTopSupportersMap({});
          setToastNotification(`تم إعداد معركة الفريق (${config.durationMinutes} دقيقة). اضغط "بدء المعركة" للانطلاق ⚔️🔥`);
          setTimeout(() => setToastNotification(null), 3500);
        }}
        onTriggerToast={(msg) => {
          setToastNotification(msg);
          setTimeout(() => setToastNotification(null), 3200);
        }}
      />

      {/* NORMAL ROOM COUNTER RESULT MODAL (نافذة نتائج الجولة العادية المستقلة وتصفير الحسابات) */}
      <NormalRoundResultModal
        isOpen={showNormalRoundResultModal}
        onClose={() => {
          setShowNormalRoundResultModal(false);
          setSeatCounters({}); // تصفير عدادات المايكات للجولة عند إغلاق النتيجة
        }}
        resultData={normalRoundResultData}
      />

      {/* TEAM BATTLE RESULT POPUP MODAL (نافذة نتائج معركة الفريق والداعم الأكبر) */}
      <TeamBattleResultModal
        isOpen={showTeamBattleResultModal}
        onClose={() => setShowTeamBattleResultModal(false)}
        redScore={pkResultData.redScore}
        blueScore={pkResultData.blueScore}
        winner={pkResultData.winner}
        topSupporter={pkResultData.topSupporter}
      />

      {/* ROOM INFO & MANAGEMENT MODAL (نافذة تفاصيل ومعلومات الروم وإدارة المشرفين وتعديل اسم الروم للمالك) */}
      <RoomInfoModal
        isOpen={showRoomInfoModal}
        onClose={() => setShowRoomInfoModal(false)}
        roomTitle={currentRoomTitle}
        roomId={roomId}
        hostAvatar={hostSeat.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
        hostName={hostSeat.userName || 'مالك الغرفة'}
        userRole={currentUserRole}
        currentAppRole={currentAppRole}
        onRoleChange={(role) => {
          setCurrentUserRole(role);
        }}
        onOpenSettings={() => setShowSettingsDrawer(true)}
        onUpdateRoomTitle={(newTitle) => {
          setCurrentRoomTitle(newTitle);
          try {
            localStorage.setItem(`super_legend_room_title_${roomId}`, newTitle);
          } catch (e) {}
          setToastNotification(`تم تغيير اسم الروم إلى "${newTitle}" بنجاح 🏷️👑`);
          setTimeout(() => setToastNotification(null), 3000);
        }}
      />

      {/* DEVELOPER ROOM CUSTOMIZATION ENGINE MODAL (لوحة تحكم وتخصيص ثيم وإضاءة الروم الشاملة والمستقلة للمبرمج) */}
      <MainRoomCustomizerModal
        isOpen={showMainRoomCustomizerModal}
        onClose={() => setShowMainRoomCustomizerModal(false)}
        roomId={roomId}
        isOwner={isOwner}
        ownerId={hostSeat.userId || '88492011'}
        ownerName={hostSeat.userName || hostName}
        roomTitle={currentRoomTitle}
        wallpaperUrl={currentRoomBgUrl}
        wallpaperName={currentRoomBgName}
        initialConfig={mainRoomConfig}
        onConfigChange={(newCfg) => {
          setMainRoomConfig(newCfg);
        }}
      />
    </div>
  );
};

