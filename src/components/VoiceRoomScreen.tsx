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
  User
} from 'lucide-react';
import { FamilyModal } from './FamilyModal';
import { SuperLegendModal } from './SuperLegendModal';
import { RoomInfoModal } from './RoomInfoModal';
import { LottieReactionPlayer } from './LottieReactionPlayer';
import { DevConfigModal } from './DevConfigModal';
import { precacheAllLottieAssets, getStoredEmojiConfigs, EmojiLottieConfig } from '../lib/lottieCache';
import { HostProfileModal } from './HostProfileModal';
import { AdvancedUserProfileModal, UserProfileData } from './AdvancedUserProfileModal';
import { SeatActionModal } from './SeatActionModal';
import { QuickMicOptionsModal } from './QuickMicOptionsModal';
import { MicRequestQueueModal, MicRequestItem } from './MicRequestQueueModal';
import { ProfessionalGiftPanel, GiftItem } from './ProfessionalGiftPanel';
import { AudioReactiveMicObject } from './AudioReactiveMicObject';
import { MovableEmojiLottiePicker } from './MovableEmojiLottiePicker';

interface VoiceRoomScreenProps {
  roomTitle?: string;
  hostName?: string;
  roomId?: string;
  onClose: () => void;
  onOpenRecharge?: () => void;
  onNavigateToRoom?: (roomName: string) => void;
}

interface MicSeat {
  id: number;
  userName: string;
  avatar?: string;
  isHost?: boolean;
  isMuted?: boolean;
  isSpeaking?: boolean;
  isEmpty?: boolean;
  isLocked?: boolean;
  speakingAura?: SpeakingAuraType;
}

export type SpeakingAuraType = 'default' | 'gold_fire' | 'neon_purple' | 'cyan_plasma' | 'royal_ruby';
export type BubbleSkinType = 'red_gold' | 'royal_gold' | 'cyber_neon' | 'pink_velvet' | 'emerald_luxury' | 'default';

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
  onClose,
  onOpenRecharge,
  onNavigateToRoom
}) => {
  // Current active room title state (allows seamless redirection when clicking global broadcast banners)
  const [currentRoomTitle, setCurrentRoomTitle] = useState<string>(roomTitle);
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
      userName: 'أميرة الشرق',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
      isHost: true,
      isMuted: false,
      isSpeaking: true,
      isEmpty: false
    },
    {
      id: 2,
      userName: 'سارة الك...',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
      isMuted: false,
      isSpeaking: true,
      isEmpty: false
    },
    {
      id: 3,
      userName: 'خالد...',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      isMuted: true,
      isSpeaking: false,
      isEmpty: false
    },
    {
      id: 4,
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

  // User Mic & Balance
  const [isMyMicMuted, setIsMyMicMuted] = useState(false);
  const [userCoins, setUserCoins] = useState('40M');

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

  // Flying Gifts Animation State to target mic seats
  const [flyingGifts, setFlyingGifts] = useState<{
    id: string;
    icon: string;
    seatId: number;
    startX: number;
    startY: number;
    targetX: number;
    targetY: number;
    delay: number;
    particles: {
      id: number;
      symbol: string;
      offsetX: number;
      offsetY: number;
      delay: number;
    }[];
  }[]>([]);

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
  const [showGamesDrawer, setShowGamesDrawer] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [emojiCategoryTab, setEmojiCategoryTab] = useState<'laughs' | 'hearts' | 'cheers' | 'animated'>('laughs');
  const [activeSeatReactions, setActiveSeatReactions] = useState<{
    [seatId: number]: { emoji: string; emojiType?: string; lottieAssetPath?: string; glowColor?: string; id: string };
  }>({});
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);
  const [showDevConfigModal, setShowDevConfigModal] = useState(false);
  const [showVoiceRemoteModal, setShowVoiceRemoteModal] = useState(false);
  const [showFamilyModal, setShowFamilyModal] = useState(false);

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
  const [showRoomInfoModal, setShowRoomInfoModal] = useState(false);
  const [showHostProfileModal, setShowHostProfileModal] = useState(false);
  const [showAudienceModal, setShowAudienceModal] = useState(false);

  // Dynamic Context Menus & Action Sheets States
  const [selectedUserForProfile, setSelectedUserForProfile] = useState<UserProfileData | null>(null);
  const [showAdvancedProfileModal, setShowAdvancedProfileModal] = useState(false);
  const [selectedSeatForAction, setSelectedSeatForAction] = useState<number | null>(null);
  const [showSeatActionModal, setShowSeatActionModal] = useState(false);
  const [selectedSeatForQuickMic, setSelectedSeatForQuickMic] = useState<number | null>(null);
  const [showQuickMicOptionsModal, setShowQuickMicOptionsModal] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<'owner' | 'host' | 'moderator' | 'guest'>('owner');
  const isCurrentAdmin = currentUserRole === 'owner' || currentUserRole === 'moderator';
  const isOwner = currentUserRole === 'owner';

  // Security guard: Ensure mic control modal is automatically closed and inaccessible if user is not the owner
  useEffect(() => {
    if (!isOwner && showMicControlModal) {
      setShowMicControlModal(false);
    }
  }, [isOwner, showMicControlModal]);

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
      if (currentUserRole === 'host') {
        // HOST AUTO-JOIN: Immediately occupy seat without any modal or request queue
        if (targetSeat.isLocked) {
          setToastNotification('المقعد مقفل حالياً 🔒');
          setTimeout(() => setToastNotification(null), 2500);
          return;
        }
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

  // Helper function to sit down on seat from SeatActionModal or Host Auto-Join
  const handleTakeSeat = (seatId: number) => {
    setAllMicSeats((prev) =>
      prev.map((seat) => {
        if (seat.id === seatId) {
          const nextMuted = seat.isMuted ? true : isMyMicMuted;
          if (nextMuted) {
            setIsMyMicMuted(true);
          }
          return {
            ...seat,
            isEmpty: false,
            userName: currentUserRole === 'host' ? 'المضيف (أنا)' : 'أنا (انضمام)',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
            isHost: currentUserRole === 'host' ? true : seat.isHost,
            isMuted: nextMuted,
            isSpeaking: !nextMuted
          };
        }
        return seat;
      })
    );
  };

  // Helper function to leave seat from QuickMicOptionsModal
  const handleLeaveSeat = (seatId?: number) => {
    const targetId = seatId || selectedSeatForQuickMic;
    setAllMicSeats((prev) =>
      prev.map((seat) => {
        if (seat.id === targetId || seat.userName.includes('أنا') || seat.userName === 'المضيف (أنا)') {
          return { ...seat, isEmpty: true, userName: '' };
        }
        return seat;
      })
    );
  };

  // Helper function to toggle seat mute state
  const handleToggleMuteSeat = (seatId: number) => {
    setAllMicSeats((prev) =>
      prev.map((seat) => {
        if (seat.id === seatId) {
          const nextMuted = !seat.isMuted;
          if (seat.userName.includes('أنا') || seat.userName.includes('انضمام')) {
            setIsMyMicMuted(nextMuted);
          }
          return { ...seat, isMuted: nextMuted };
        }
        return seat;
      })
    );
  };

  // Sync isMyMicMuted with user's seat in allMicSeats
  useEffect(() => {
    setAllMicSeats((prev) =>
      prev.map((s) => {
        if (!s.isEmpty && (s.userName.includes('أنا') || s.userName.includes('انضمام'))) {
          if (s.isMuted !== isMyMicMuted) {
            return { ...s, isMuted: isMyMicMuted };
          }
        }
        return s;
      })
    );
  }, [isMyMicMuted]);

  // Helper function to lock or unlock seat
  const handleToggleLockSeat = (seatId: number) => {
    setAllMicSeats((prev) =>
      prev.map((seat) => {
        if (seat.id === seatId) {
          return { ...seat, isLocked: !seat.isLocked };
        }
        return seat;
      })
    );
  };

  // Helper function to remove user from mic (move down to audience)
  const handleRemoveFromMic = (seatId: number) => {
    setAllMicSeats((prev) =>
      prev.map((seat) => {
        if (seat.id === seatId) {
          return { ...seat, isEmpty: true, userName: '', avatar: '' };
        }
        return seat;
      })
    );
  };

  // Helper function to approve mic request from queue
  const handleApproveMicRequest = (req: MicRequestItem) => {
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
    targetSeatIds?: number[]
  ) => {
    const recipient = targetName || hostSeat.userName;

    // Trigger global high-value gift announcement if gift value is 20,000 coins or more
    if (totalValue >= 20000) {
      window.dispatchEvent(
        new CustomEvent('global_high_value_gift', {
          detail: {
            sender: 'أنا (الزائر)',
            giftName: rawGiftName || giftName,
            giftIcon,
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

    // Set subtle gift notification banner pill (slides in from right to left in middle of screen)
    // Accumulate quantity if sender hits repeatedly (combo count x1, x2, x3...)
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

    // Determine target seat coordinates for flying animation path
    const roomContainer = document.getElementById('voice-room-container');
    const containerRect = roomContainer ? roomContainer.getBoundingClientRect() : null;

    // Start coordinates (Gift Box Button or Bottom-Left Icons Area: أسفل الشاشة)
    let defaultStartX = containerRect ? containerRect.width * 0.15 : window.innerWidth * 0.15;
    let defaultStartY = containerRect ? containerRect.height - 35 : window.innerHeight - 35;

    const giftBtnElem = document.getElementById('room-gift-button') || document.getElementById('room-bottom-left-actions');
    if (giftBtnElem && containerRect) {
      const gbRect = giftBtnElem.getBoundingClientRect();
      defaultStartX = (gbRect.left + gbRect.width / 2) - containerRect.left;
      defaultStartY = (gbRect.top + gbRect.height / 2) - containerRect.top;
    }

    const getFallbackSeatCoordsPct = (sId: number) => {
      if (sId === 1) return { x: 50, y: 18 };
      if (sId === 2) return { x: 30, y: 28 };
      if (sId === 3) return { x: 50, y: 28 };
      if (sId === 4) return { x: 70, y: 28 };
      if (sId === 5) return { x: 20, y: 38 };
      if (sId === 6) return { x: 40, y: 38 };
      if (sId === 7) return { x: 60, y: 38 };
      if (sId === 8) return { x: 80, y: 38 };
      if (sId === 9) return { x: 30, y: 48 };
      if (sId === 10) return { x: 70, y: 48 };

      const row = Math.floor((sId - 2) / 4) + 1;
      const col = (sId - 2) % 4;
      return { x: 20 + col * 20, y: 28 + row * 10 };
    };

    // Helper to generate elegant trailing particles (hearts & stars)
    const particleSymbols = ['💖', '✨', '⭐', '💫', '🌟', '💕'];
    const createGiftParticles = () =>
      Array.from({ length: 5 }, (_, pIdx) => ({
        id: pIdx,
        symbol: particleSymbols[Math.floor(Math.random() * particleSymbols.length)],
        offsetX: (Math.random() - 0.5) * 50,
        offsetY: (Math.random() - 0.5) * 50,
        delay: 0.12 + pIdx * 0.08,
      }));

    // Determine target coordinates for interactive flying gift path
    let seatsToAnimate: number[] = [];
    let isTargetOnMic = false;

    if (targetSeatIds && targetSeatIds.length > 0) {
      seatsToAnimate = targetSeatIds;
      isTargetOnMic = true;
    } else if (recipient === 'جميع الحضور' || recipient.includes('جميع')) {
      const activeSeats = allMicSeats.filter((s) => !s.isEmpty).map((s) => s.id);
      if (activeSeats.length > 0) {
        seatsToAnimate = activeSeats;
        isTargetOnMic = true;
      } else {
        isTargetOnMic = false;
      }
    } else {
      const foundSeat = allMicSeats.find((s) => !s.isEmpty && (s.userName === recipient || recipient.includes(s.userName)));
      if (foundSeat) {
        seatsToAnimate = [foundSeat.id];
        isTargetOnMic = true;
      } else {
        isTargetOnMic = false;
      }
    }

    const refWidth = containerRect ? containerRect.width : window.innerWidth;
    const refHeight = containerRect ? containerRect.height : window.innerHeight;

    let newFlyingItems: {
      id: string;
      icon: string;
      seatId: number;
      startX: number;
      startY: number;
      targetX: number;
      targetY: number;
      delay: number;
      particles: {
        id: number;
        symbol: string;
        offsetX: number;
        offsetY: number;
        delay: number;
      }[];
    }[] = [];

    if (isTargetOnMic && seatsToAnimate.length > 0) {
      // Targets are on Mic Seats (Host, Owner, Admin, Members)
      newFlyingItems = seatsToAnimate.map((sId, idx) => {
        const seatElem = document.getElementById(`mic-seat-${sId}`);
        let targetX = 0;
        let targetY = 0;

        if (seatElem && containerRect) {
          const seatRect = seatElem.getBoundingClientRect();
          targetX = (seatRect.left + seatRect.width / 2) - containerRect.left;
          targetY = (seatRect.top + seatRect.height / 2) - containerRect.top;
        } else {
          const pct = getFallbackSeatCoordsPct(sId);
          targetX = (pct.x / 100) * refWidth;
          targetY = (pct.y / 100) * refHeight;
        }

        return {
          id: `fg-${Date.now()}-${sId}-${Math.random()}`,
          icon: giftIcon,
          seatId: sId,
          startX: defaultStartX,
          startY: defaultStartY,
          targetX,
          targetY,
          delay: idx * 0.09,
          particles: createGiftParticles(),
        };
      });
    } else {
      // Target is NOT on a mic seat (Selected from chat / outside seats): Fly to top room audience/listeners counter
      const audienceElem = document.getElementById('room-top-audience');
      let targetX = refWidth * 0.70;
      let targetY = refHeight * 0.08;

      if (audienceElem && containerRect) {
        const aRect = audienceElem.getBoundingClientRect();
        targetX = (aRect.left + aRect.width / 2) - containerRect.left;
        targetY = (aRect.top + aRect.height / 2) - containerRect.top;
      }

      newFlyingItems = [{
        id: `fg-${Date.now()}-aud-${Math.random()}`,
        icon: giftIcon,
        seatId: 0,
        startX: defaultStartX,
        startY: defaultStartY,
        targetX,
        targetY,
        delay: 0,
        particles: createGiftParticles(),
      }];
    }

    setFlyingGifts((prev) => [...prev, ...newFlyingItems]);

    // Schedule flight completion: gift glides smoothly, displays arrival glow, then disappears cleanly (~1.25s)
    newFlyingItems.forEach((fg) => {
      setTimeout(() => {
        setFlyingGifts((prev) => prev.filter((item) => item.id !== fg.id));
      }, (fg.delay + 1.25) * 1000);
    });

    const giftMsgId = Date.now().toString() + Math.random().toString(36).substring(2, 6);

    setChatMessages((prev) => [
      ...prev,
      {
        id: giftMsgId,
        userName: 'أنا (الزائر)',
        text: `أرسل ${giftName} ${giftIcon} إلى ${recipient}`,
        userColor: 'text-pink-400',
        isGift: true
      }
    ]);

    // Auto-dismiss gift message from chat feed after 10 seconds
    setTimeout(() => {
      setChatMessages((prev) => prev.filter((msg) => msg.id !== giftMsgId));
    }, 10000);

    // Reset banner dismissal timer so rapid consecutive hits keep banner open & active
    if (giftBannerTimerRef.current) {
      clearTimeout(giftBannerTimerRef.current);
    }
    giftBannerTimerRef.current = setTimeout(() => {
      setActiveGiftBanner(null);
    }, 4000);
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
      id="voice-room-container"
      className="fixed inset-0 h-screen w-full max-w-full z-50 bg-[#0B0E17] text-white font-sans flex flex-col justify-between overflow-hidden overflow-x-hidden select-none"
      dir="rtl"
    >
      {/* GLOW ATMOSPHERE BACKGROUND */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,rgba(30,27,75,0.6),transparent_70%)] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* 1. TOP HEADER BAR */}
      <div className="relative z-20 pt-3 px-3 pb-2 space-y-2 w-full max-w-full overflow-x-hidden">
        {/* Row 1 Header Icons & Room Title Pill */}
        <div className="flex items-center justify-between gap-2">
          {/* Right Section (in RTL: 1st in DOM): Room Title & Host Profile Capsule (Clickable on Host Avatar/Name for Room Management & Admins Modal) */}
          <div
            onClick={() => setShowRoomInfoModal(true)}
            className="bg-[#1A2132]/90 border border-amber-500/30 rounded-full py-1 pr-1.5 pl-4 flex items-center gap-2 max-w-[65%] shadow-md cursor-pointer hover:border-amber-400/70 hover:bg-[#20293f] transition-all active:scale-95 group"
            title="انقر لعرض شاشة إدارة الغرفة والمشرفين"
          >
            {/* Host Avatar on Right Edge */}
            <div className="w-8.5 h-8.5 rounded-full border-2 border-amber-400 overflow-hidden shrink-0 shadow-[0_0_10px_rgba(245,158,11,0.5)] group-hover:scale-105 transition-transform">
              <img
                src={hostSeat.avatar}
                alt={hostSeat.userName}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col min-w-0">
              <span className="text-xs font-black text-white truncate leading-tight flex items-center gap-1">
                <span>{currentRoomTitle}</span>
              </span>
              <span className="text-[10px] font-mono text-slate-300 truncate flex items-center gap-1">
                <span className="text-amber-300 font-extrabold truncate">{hostSeat.userName}</span>
                <span className="text-[9px] text-amber-300 font-bold bg-amber-500/20 border border-amber-500/40 px-1 rounded shrink-0">مضيف</span>
              </span>
            </div>
          </div>

          {/* Left Section (in RTL: 2nd in DOM): Listener Count, Menu, Power */}
          <div className="flex items-center gap-1.5">
            {/* Listener Count Pill -> Opens Audience List Modal */}
            <button
              id="room-top-audience"
              onClick={() => setShowAudienceModal(true)}
              className="bg-[#1A2132] hover:bg-[#25314a] border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold text-slate-200 shadow-sm cursor-pointer transition-colors"
              title="انقر لعرض قائمة الحضور والمستمعين"
            >
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-mono text-xs text-white">18</span>
            </button>

            {/* More Options Button */}
            <button
              onClick={() => setShowSettingsDrawer(true)}
              className="w-9 h-9 rounded-full bg-[#1A2132] hover:bg-slate-700/50 border border-white/10 flex items-center justify-center text-slate-200 cursor-pointer relative"
            >
              <MoreHorizontal className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 ring-2 ring-[#0B0E17]" />
            </button>

            {/* Power/Close Button */}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-[#1A2132] hover:bg-red-900/40 border border-white/10 flex items-center justify-center text-slate-200 cursor-pointer transition-colors shadow-md"
            >
              <Power className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Row 2 Sub-Header Quick Badges (Positioned slightly higher, reversed order, and logic mapped) */}
        <div className="flex flex-row-reverse items-center justify-between gap-1 -mt-1 pt-0 pb-0.5">
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
              onClick={() => setShowMicControlModal(true)}
              className="bg-[#151D2C] border border-emerald-500/40 px-1.5 py-0.5 rounded-full flex items-center gap-0.5 text-[8px] font-black text-emerald-300 shadow-2xs hover:border-emerald-400 transition-colors cursor-pointer"
              title="إدارة وتخصيص عدد المايكات"
            >
              <Radio className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
              <span>{activeMicCount} مايك</span>
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
                <span className="text-2xl shrink-0 animate-pulse">{highValueGiftNotice.giftIcon}</span>
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

      {/* UNIFIED SEQUENTIAL COLUMN LAYOUT: MIC GRID + DYNAMIC CHAT AREA AS A SINGLE BLOCK WITH TOP MARGIN SHIFT (38px ~ 2cm total) */}
      <div className="flex-1 min-h-0 flex flex-col mt-[38px] overflow-hidden overflow-x-hidden relative z-20 w-full max-w-full">
        {/* 2. DYNAMIC MIC ARRANGEMENT SECTION (STATIONARY 100% FIXED MIC SIZES) */}
        <div className="relative px-3 sm:px-6 pt-0 pb-0.5 space-y-1.5 sm:space-y-2 w-full max-w-2xl mx-auto flex flex-col shrink-0 transition-all duration-300 overflow-x-hidden">
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

            return (
              <div key={rowIndex} className={`grid ${gridColsClass} justify-center items-center`}>
                {rowSeats.map((seat) => {
                  const isSeatHost = seat.isHost || (seat.id === 1 && !seat.isEmpty && seat.userName === 'أميرة الشرق');
                  const isSpeaking = seat.isSpeaking && !seat.isMuted;
                  const auraStyle = getSpeakingAuraStyles(seat.speakingAura || 'default');

                  return (
                    <div
                      key={seat.id}
                      id={`mic-seat-${seat.id}`}
                      onClick={() => handleSeatClick(seat.id)}
                      className="flex flex-col items-center space-y-0.5 cursor-pointer group my-0"
                    >
                      <div className="relative">
                        {seat.isEmpty ? (
                          <div
                            className={`${circleSizeClass} rounded-full border border-dashed ${
                              seat.isLocked
                                ? 'border-indigo-500/70 bg-[#121124]/90 text-indigo-300 shadow-[0_0_12px_rgba(99,102,241,0.25)]'
                                : seat.isMuted
                                ? 'border-rose-500/80 bg-[#24121a]/90 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                                : 'border-amber-400/50 bg-[#121824]/60 text-amber-300/90'
                            } backdrop-blur-xs flex items-center justify-center shadow-2xs transition-all group-hover:scale-105 ${
                              seat.isLocked
                                ? 'group-hover:border-indigo-400 group-hover:bg-[#181632]'
                                : seat.isMuted
                                ? 'group-hover:border-rose-400 group-hover:bg-[#321622]'
                                : 'group-hover:border-amber-300/80 group-hover:bg-[#182132]/80'
                            } relative`}
                          >
                            {seat.isLocked ? (
                              <Lock className={`${iconSizeClass} text-indigo-300 stroke-[2.2]`} />
                            ) : (
                              <Plus className={`${iconSizeClass} ${seat.isMuted ? 'text-rose-400' : 'text-amber-300/90'} stroke-[2.5]`} />
                            )}

                            {/* SHOW RED MUTED MIC BADGE OVERLAY ON EMPTY SEAT WHEN MUTED */}
                            {seat.isMuted && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#0B0E17] bg-rose-600 text-white shadow-md z-30 ring-2 ring-rose-500/50"
                                title="المقعد مكتوم 🔇"
                              >
                                <MicOff className="w-2.5 h-2.5 stroke-[2.8]" />
                              </motion.div>
                            )}
                          </div>
                        ) : (
                          <div className="relative flex items-center justify-center">
                            {/* STORE-INTEGRATED SPEAKING CIRCULAR SOUND WAVE / RIPPLE EFFECT */}
                            {isSpeaking && (
                              <>
                                {/* Ring 1: Inner Wave Pulse */}
                                <motion.div
                                  animate={{ scale: auraStyle.scale1, opacity: auraStyle.opacity1 }}
                                  transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
                                  className={`absolute -inset-1 rounded-full pointer-events-none z-0 ${auraStyle.ring1Class}`}
                                />
                                {/* Ring 2: Expanding Middle Sound Wave */}
                                <motion.div
                                  animate={{ scale: auraStyle.scale2, opacity: auraStyle.opacity2 }}
                                  transition={{ repeat: Infinity, duration: 1.6, ease: 'easeOut', delay: 0.2 }}
                                  className={`absolute -inset-2 rounded-full pointer-events-none z-0 ${auraStyle.ring2Class}`}
                                />
                                {/* Ring 3: Rotating Sound Aura Circle */}
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ repeat: Infinity, duration: 5, ease: 'linear' }}
                                  className={`absolute -inset-1.5 rounded-full pointer-events-none z-0 ${auraStyle.ring3Class}`}
                                />
                              </>
                            )}

                            {/* Main Avatar Container */}
                            <div
                              className={`${circleSizeClass} rounded-full p-0.5 bg-gradient-to-tr ${
                                isSpeaking
                                  ? auraStyle.avatarBorderClass
                                  : isSeatHost
                                  ? 'from-amber-400/90 via-emerald-400/90 to-cyan-400/90 shadow-sm'
                                  : 'from-cyan-400/90 to-emerald-400/90 shadow-xs'
                              } relative transition-transform group-hover:scale-105 z-10`}
                            >
                              {/* Avatar Image */}
                              <img
                                src={seat.avatar}
                                alt={seat.userName}
                                className="w-full h-full object-cover rounded-full relative z-10"
                              />

                              {/* Lock Badge on occupied seat if locked by admin */}
                              {seat.isLocked && (
                                <div className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 rounded-full flex items-center justify-center border border-[#0B0E17] bg-indigo-600 text-white shadow-xs z-20" title="المقعد مقفل 🔒">
                                  <Lock className="w-2.5 h-2.5 stroke-[2.5]" />
                                </div>
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
                      </div>

                      {seat.isEmpty ? (
                        <span className={`text-[10.5px] sm:text-[11.5px] font-black drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] font-mono leading-none ${
                          seat.isLocked ? 'text-indigo-300' : 'text-amber-300/90'
                        }`}>
                          {seat.id}
                        </span>
                      ) : (
                        <div
                          className={`px-1.5 py-0.2 rounded-full text-center shadow-xs max-w-[76px] sm:max-w-[84px] truncate ${
                            isSeatHost
                              ? 'bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 border border-amber-500/40'
                              : 'bg-[#151D2C]/85 border border-white/10'
                          }`}
                        >
                          <span
                            className={`text-[9.5px] font-bold truncate block leading-tight ${
                              isSeatHost ? 'text-amber-200 font-extrabold' : 'text-slate-100'
                            }`}
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
        </div>

        {/* SUBTLE & COMPACT GIFT BANNER PILL IN MIDDLE OF SCREEN (شريط إشعار إرسال الهدايا بالمنتصف - مطابق للنموذج) */}
        <AnimatePresence>
          {activeGiftBanner && (
            <motion.div
              initial={{ opacity: 0, x: 150, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 150, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 320 }}
              className="absolute top-[31%] right-2 sm:right-4 z-40 max-w-[270px] bg-gradient-to-l from-[#171F33]/90 via-[#0F1626]/85 to-[#19243C]/90 border border-amber-400/50 rounded-full py-1 px-2.5 shadow-[0_6px_25px_rgba(0,0,0,0.7)] backdrop-blur-md flex items-center justify-between gap-2 pointer-events-none select-none"
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
                  {activeGiftBanner.giftIcon.startsWith('http') ||
                  activeGiftBanner.giftIcon.startsWith('/') ||
                  activeGiftBanner.giftIcon.startsWith('data:') ? (
                    <img
                      src={activeGiftBanner.giftIcon}
                      alt={activeGiftBanner.giftName}
                      className="w-7 h-7 object-contain drop-shadow-[0_2px_8px_rgba(245,158,11,0.7)]"
                    />
                  ) : (
                    <span className="text-2xl drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)] animate-bounce">
                      {activeGiftBanner.giftIcon}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* GIFT FLYING ANIMATION OVERLAY TO TARGET MIC SEATS OR AUDIENCE COUNTER */}
        <AnimatePresence>
          {flyingGifts.map((fg) => {
            const arcMidX = (fg.startX + fg.targetX) / 2 + (fg.startX < fg.targetX ? 30 : -30);
            const arcMidY = Math.min(fg.startY, fg.targetY) - 45;

            return (
              <React.Fragment key={fg.id}>
                {/* Main Flying Gift Container (Responsive Scaled Size) */}
                <motion.div
                  initial={{
                    opacity: 0,
                    scale: 0.25,
                    x: fg.startX,
                    y: fg.startY,
                  }}
                  animate={{
                    opacity: [0, 1, 1, 1, 0],
                    scale: [0.25, 1.25, 1.1, 1.0, 0],
                    x: [fg.startX, arcMidX, fg.targetX, fg.targetX],
                    y: [fg.startY, arcMidY, fg.targetY, fg.targetY],
                  }}
                  transition={{
                    duration: 0.85,
                    delay: fg.delay,
                    times: [0, 0.45, 0.8, 1],
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="absolute top-0 left-0 z-50 pointer-events-none -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                >
                  <div className="relative p-2 sm:p-2.5 rounded-full bg-gradient-to-tr from-amber-500/60 via-pink-500/50 to-purple-600/60 border-2 border-amber-300 shadow-[0_0_25px_rgba(245,158,11,0.85)] backdrop-blur-xs flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14">
                    {fg.icon.startsWith('http') || fg.icon.startsWith('/') || fg.icon.startsWith('data:') ? (
                      <img
                        src={fg.icon}
                        alt="gift"
                        className="w-9 h-9 sm:w-11 sm:h-11 object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
                      />
                    ) : (
                      <span className="text-3xl sm:text-4xl filter drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] animate-pulse">
                        {fg.icon}
                      </span>
                    )}
                    <Sparkles className="w-4 h-4 text-amber-300 absolute -top-1.5 -right-1.5 animate-spin" />
                  </div>
                </motion.div>

                {/* Floating Trail Particles (Hearts & Stars) */}
                {fg.particles.map((p) => (
                  <motion.div
                    key={`${fg.id}-p-${p.id}`}
                    initial={{
                      opacity: 0,
                      scale: 0.3,
                      x: fg.startX,
                      y: fg.startY,
                    }}
                    animate={{
                      opacity: [0, 0.9, 1, 0],
                      scale: [0.3, 1.2, 0.8, 0],
                      x: [fg.startX, arcMidX + p.offsetX, fg.targetX + p.offsetX * 1.2],
                      y: [fg.startY, arcMidY + p.offsetY, fg.targetY + p.offsetY * 1.2],
                    }}
                    transition={{
                      duration: 0.9,
                      delay: fg.delay + p.delay,
                      times: [0, 0.3, 0.7, 1],
                      ease: 'easeOut',
                    }}
                    className="absolute top-0 left-0 z-45 pointer-events-none -translate-x-1/2 -translate-y-1/2 text-sm sm:text-base filter drop-shadow-[0_2px_8px_rgba(245,158,11,0.8)] select-none"
                  >
                    {p.symbol}
                  </motion.div>
                ))}

                {/* Arrival Glow Ring & Soft Burst Effect at Target Location */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.3 }}
                  animate={{
                    opacity: [0, 0, 0.9, 0],
                    scale: [0.3, 0.3, 1.8, 2.3],
                  }}
                  transition={{
                    duration: 0.5,
                    delay: fg.delay + 0.65,
                    times: [0, 0.6, 0.8, 1],
                  }}
                  style={{ left: fg.targetX, top: fg.targetY }}
                  className="absolute z-40 pointer-events-none -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-2 border-amber-300 bg-amber-400/20 shadow-[0_0_30px_rgba(251,191,36,0.9)] flex items-center justify-center"
                >
                  <Sparkles className="w-8 h-8 text-amber-300 animate-spin" />
                </motion.div>
              </React.Fragment>
            );
          })}
        </AnimatePresence>

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

        {/* 4. ISOLATED LIVE CHAT MESSAGES FEED (ZERO ROOM VIBRATION/JITTER ON SENDING MESSAGES) */}
        <RoomChatFeed
          chatMessages={chatMessages}
          onReplyTo={(reply) => setReplyingToMessage(reply)}
          onOpenChatInput={() => setShowChatInputModal(true)}
          onOpenUserProfile={(userData) => {
            setSelectedUserForProfile(userData);
            setShowAdvancedProfileModal(true);
          }}
        />
      </div>

      {/* 5. BOTTOM CONTROL DOCK BAR */}
      <div className="relative z-30 px-3 py-1.5 bg-[#0D121F]/90 border-t border-white/10 backdrop-blur-md flex items-center justify-between gap-1 w-full max-w-full overflow-x-hidden">
        {/* Far Right (1st in DOM): Chat Input Popup Toggle Button */}
        <button
          onClick={() => setShowChatInputModal(true)}
          className="w-8 h-8 rounded-full bg-[#1A2234] hover:bg-[#25314A] text-slate-300 flex items-center justify-center cursor-pointer transition-colors shadow-md relative"
        >
          <MessageSquare className="w-4 h-4" />
          <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-red-500 ring-1.5 ring-[#0D121F]" />
        </button>

        {/* 2nd from Right (2nd in DOM): Mic Toggle Button */}
        <button
          onClick={() => setIsMyMicMuted(!isMyMicMuted)}
          className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors shadow-md ${
            isMyMicMuted ? 'bg-red-500/80 text-white' : 'bg-[#1A2234] text-slate-300 hover:bg-[#25314A]'
          }`}
        >
          {isMyMicMuted ? (
            <MicOff className="w-4 h-4 stroke-[2.5]" />
          ) : (
            <Mic className="w-4 h-4 stroke-[2.5]" />
          )}
        </button>

        {/* 3rd from Right (3rd in DOM): Emoji Button */}
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="w-8 h-8 rounded-full bg-[#1A2234] hover:bg-[#25314A] text-yellow-300 flex items-center justify-center cursor-pointer transition-colors shadow-md relative"
        >
          <Smile className="w-4 h-4" />
        </button>

        {/* Center (4th in DOM): Prominent Glowing Gift Box Button */}
        <button
          id="room-gift-button"
          onClick={() => setShowGiftDrawer(true)}
          className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-amber-400 p-0.5 flex items-center justify-center cursor-pointer shadow-[0_0_15px_rgba(236,72,153,0.8)] transition-transform hover:scale-110 -translate-y-0.5 animate-pulse"
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
          className="w-8 h-8 rounded-full bg-[#1A2234] hover:bg-[#25314A] text-cyan-300 flex items-center justify-center cursor-pointer transition-colors shadow-md relative"
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
          onClick={() => setShowGamesDrawer(true)}
          className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-600 via-purple-600 to-pink-500 text-white flex items-center justify-center cursor-pointer shadow-[0_0_10px_rgba(236,72,153,0.5)] transition-transform hover:scale-105"
        >
          <Gamepad2 className="w-4 h-4" />
        </button>

        {/* Far Left (7th in DOM): Grid Menu Button */}
        <button
          id="room-bottom-left-actions"
          onClick={() => setShowSettingsDrawer(true)}
          className="w-8 h-8 rounded-full bg-[#1A2234] hover:bg-[#25314A] text-slate-300 flex items-center justify-center cursor-pointer transition-colors shadow-md"
        >
          <Grid className="w-4 h-4" />
        </button>
      </div>

      {/* CHAT INPUT MODAL POPUP */}
      <AnimatePresence>
        {showChatInputModal && (
          <div
            className="fixed inset-0 z-50 flex items-end justify-center p-3 pb-4 bg-transparent cursor-default select-none pointer-events-auto"
            onClick={() => setShowChatInputModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ duration: 0.15 }}
              dir="rtl"
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-[#121827]/95 border border-white/20 p-3 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] pointer-events-auto backdrop-blur-md"
            >
              {/* CONDITIONAL REPLY PREVIEW BAR (معاينة الرد الشرطية - تظهر فقط عند وجود رد مفعل) */}
              {replyingToMessage && (
                <div className="flex items-center justify-between gap-2 p-2 mb-2 bg-[#1B2338]/90 border border-amber-400/40 border-r-4 border-r-amber-400 rounded-xl text-xs backdrop-blur-md shadow-lg animate-fade-in">
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
                    onClick={() => setShowChatInputModal(false)}
                    className="p-2 text-slate-400 hover:text-white rounded-xl bg-[#1A2132] hover:bg-red-950/40 transition-colors cursor-pointer"
                    title="إغلاق"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs cursor-pointer shadow-md hover:brightness-105"
                  >
                    إرسال
                  </button>
                </div>

                {/* Left side: Message Input Box */}
                <input
                  type="text"
                  autoFocus
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="إرسال رسالة للشات..."
                  className="flex-1 bg-[#1A2132] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                />
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MOVABLE & DYNAMIC EMOJI / LOTTIE REACTION PICKER */}
      <MovableEmojiLottiePicker
        isOpen={showEmojiPicker}
        onClose={() => setShowEmojiPicker(false)}
        onSendEmojiReaction={handleSendEmojiReaction}
        onOpenVoiceRemote={() => setShowVoiceRemoteModal(true)}
      />

      {/* PROFESSIONAL GIFTS PANEL */}
      <ProfessionalGiftPanel
        isOpen={showGiftDrawer}
        onClose={() => setShowGiftDrawer(false)}
        userCoins={userCoins}
        onOpenRecharge={onOpenRecharge}
        onSendGift={(gift, quantity, targetName, targetSeatIds) => {
          const totalVal = gift.price * quantity;
          handleSendGift(
            `${gift.name} (x${quantity}) [إلى: ${targetName}]`,
            gift.icon,
            totalVal,
            gift.name,
            targetName,
            targetSeatIds
          );
        }}
        seats={activeSeats}
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
                      setShowSettingsDrawer(false);
                      setShowMicControlModal(true);
                    }}
                    className="w-full p-3 bg-[#1A2234] border border-emerald-500/30 rounded-2xl flex items-center justify-between text-xs font-bold hover:bg-slate-700/80 cursor-pointer transition-colors shadow-sm"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                        <Radio className="w-4 h-4" />
                      </div>
                      <span className="text-slate-100 font-extrabold text-xs">وضع الميكروفون</span>
                    </div>
                    <div className="flex items-center gap-1 bg-emerald-950/70 border border-emerald-500/40 px-2.5 py-1 rounded-full">
                      <span className="text-emerald-300 font-mono font-black text-xs">{activeMicCount}</span>
                      <span className="text-emerald-400 text-[10px] font-bold">ميكروفون</span>
                    </div>
                  </button>
                )}

                <button className="w-full p-3 bg-[#1A2234] rounded-2xl flex items-center justify-between text-xs font-bold hover:bg-slate-700">
                  <span>قفل المايكات الفارغة</span>
                  <span className="text-emerald-400">مفتوح</span>
                </button>
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
            className="fixed inset-0 z-50 bg-transparent flex items-end justify-center p-0 sm:p-4 pointer-events-auto cursor-default select-none"
            onClick={() => setShowRoomSupportModal(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-[#121827]/95 backdrop-blur-2xl border-t-2 border-cyan-500/60 rounded-t-3xl sm:rounded-3xl p-4 space-y-3.5 text-white shadow-2xl max-h-[85vh] flex flex-col justify-between pointer-events-auto overflow-hidden"
            >
              {/* Header & Main Tabs Row */}
              <div className="space-y-2.5 shrink-0">
                <div className="flex items-center justify-between pb-1 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-400" />
                    <h2 className="text-base font-black text-amber-300">إحصائيات ولوحة متصدري الغرفة</h2>
                  </div>
                  <button
                    onClick={() => setShowRoomSupportModal(false)}
                    className="p-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Swipe Hint Banner */}
                <div className="flex items-center justify-between text-[10px] text-slate-300 font-medium px-2 bg-white/5 py-1 rounded-xl border border-white/5">
                  <span className="text-cyan-300 font-bold flex items-center gap-1">
                    <span>👈</span>
                    <span>اسحب لليسار</span>
                  </span>
                  <span className="text-amber-300/90 font-black flex items-center gap-1">
                    <span>⚡ اسحب الشاشة للتنقل بين القوائم</span>
                  </span>
                  <span className="text-cyan-300 font-bold flex items-center gap-1">
                    <span>اسحب لليمين</span>
                    <span>👉</span>
                  </span>
                </div>

                {/* 3 Main Tabs: المساهمات (Diamonds), النادي (Club), الجاذبية (Charm) */}
                <div className="grid grid-cols-3 gap-1 bg-[#1A2234] p-1 rounded-2xl border border-white/10 text-center">
                  <button
                    onClick={() => {
                      setStatsMainTab('diamonds');
                      setStatsTimeFilter('24h');
                    }}
                    className={`py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      statsMainTab === 'diamonds'
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md scale-[1.02]'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    💎 المساهمات
                  </button>

                  <button
                    onClick={() => {
                      setStatsMainTab('club');
                      setStatsTimeFilter('24h');
                    }}
                    className={`py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      statsMainTab === 'club'
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md scale-[1.02]'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    🛡️ النادي
                  </button>

                  <button
                    onClick={() => {
                      setStatsMainTab('charm');
                      setStatsTimeFilter('24h');
                    }}
                    className={`py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      statsMainTab === 'charm'
                        ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-md scale-[1.02]'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    ✨ الجاذبية
                  </button>
                </div>

                {/* Sub-time filters row */}
                <div className="flex items-center justify-center gap-2 pt-0.5">
                  {statsMainTab === 'club' ? (
                    <>
                      <button
                        onClick={() => setStatsTimeFilter('24h')}
                        className={`px-3 py-1 rounded-full text-[11px] font-black transition-all cursor-pointer ${
                          statsTimeFilter === '24h'
                            ? 'bg-purple-600 text-white ring-1 ring-purple-300'
                            : 'bg-white/5 text-slate-400 hover:text-white'
                        }`}
                      >
                        24 ساعة
                      </button>
                      <button
                        onClick={() => setStatsTimeFilter('weekly')}
                        className={`px-3 py-1 rounded-full text-[11px] font-black transition-all cursor-pointer ${
                          statsTimeFilter === 'weekly'
                            ? 'bg-purple-600 text-white ring-1 ring-purple-300'
                            : 'bg-white/5 text-slate-400 hover:text-white'
                        }`}
                      >
                        أسبوعي
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setStatsTimeFilter('24h')}
                        className={`px-3 py-1 rounded-full text-[11px] font-black transition-all cursor-pointer ${
                          statsTimeFilter === '24h'
                            ? statsMainTab === 'diamonds' ? 'bg-cyan-500 text-slate-950 font-black' : 'bg-pink-600 text-white'
                            : 'bg-white/5 text-slate-400 hover:text-white'
                        }`}
                      >
                        24 ساعة
                      </button>
                      <button
                        onClick={() => setStatsTimeFilter('all')}
                        className={`px-3 py-1 rounded-full text-[11px] font-black transition-all cursor-pointer ${
                          statsTimeFilter === 'all'
                            ? statsMainTab === 'diamonds' ? 'bg-cyan-500 text-slate-950 font-black' : 'bg-pink-600 text-white'
                            : 'bg-white/5 text-slate-400 hover:text-white'
                        }`}
                      >
                        الإجمالي
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Swipe Container for Leaderboard List (Drag left / right to switch tabs) */}
              <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.15}
                onDragEnd={(_e, info) => {
                  const threshold = 35;
                  const velocityThreshold = 120;
                  const tabsOrder: ('diamonds' | 'club' | 'charm')[] = ['diamonds', 'club', 'charm'];
                  const currentIdx = tabsOrder.indexOf(statsMainTab);

                  // Inverted Swipe Direction Logic:
                  // Swiping Right -> Navigate to next tab (Diamonds -> Club -> Charm)
                  // Swiping Left  -> Navigate to previous tab (Charm -> Club -> Diamonds)
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
                className="flex-1 min-h-[220px] overflow-y-auto no-scrollbar touch-pan-y cursor-grab active:cursor-grabbing my-1 pr-0.5"
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
                          className="p-2 bg-[#1A2234] border border-white/10 rounded-2xl flex items-center justify-between text-xs hover:border-cyan-500/40 transition-all cursor-pointer hover:scale-[1.01]"
                        >
                          <div className="flex items-center gap-2 overflow-hidden max-w-[70%]">
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

                            {/* Avatar */}
                            <img
                              src={item.avatar}
                              alt={item.name}
                              className="w-8 h-8 rounded-full object-cover border border-cyan-400/50 shrink-0"
                            />

                            {/* Single Line User Metadata: Name, Level, VIP, N-Level */}
                            <div className="flex items-center gap-1.5 truncate">
                              <span className="font-black text-slate-100 truncate text-[11px]">{item.name}</span>
                              <span className="bg-purple-600/90 text-white text-[8px] font-black px-1.5 py-0.2 rounded-md shrink-0">
                                Lv.{item.level}
                              </span>
                              <span className="bg-amber-500/90 text-slate-950 text-[8px] font-black px-1.5 py-0.2 rounded-md shrink-0">
                                {item.vip}
                              </span>
                              <span className="bg-emerald-600/90 text-white text-[8px] font-black px-1.5 py-0.2 rounded-md shrink-0">
                                {item.nLevel}
                              </span>
                            </div>
                          </div>

                          {/* Value */}
                          <span className="font-mono font-black text-cyan-300 text-xs dir-ltr shrink-0 pr-1">
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
                          className="p-2 bg-[#1A2234] border border-white/10 rounded-2xl flex items-center justify-between text-xs hover:border-purple-500/40 transition-colors"
                        >
                          <div className="flex items-center gap-2 overflow-hidden max-w-[70%]">
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

                            <img
                              src={item.avatar}
                              alt={item.name}
                              className="w-8 h-8 rounded-full object-cover border border-purple-400/50 shrink-0"
                            />

                            <div className="flex items-center gap-1.5 truncate">
                              <span className="font-black text-slate-100 truncate text-[11px]">{item.name}</span>
                              <span className="bg-purple-600/90 text-white text-[8px] font-black px-1.5 py-0.2 rounded-md shrink-0">
                                Lv.{item.level}
                              </span>
                              <span className="bg-amber-500/90 text-slate-950 text-[8px] font-black px-1.5 py-0.2 rounded-md shrink-0">
                                {item.vip}
                              </span>
                              <span className="bg-emerald-600/90 text-white text-[8px] font-black px-1.5 py-0.2 rounded-md shrink-0">
                                {item.nLevel}
                              </span>
                            </div>
                          </div>

                          <span className="font-mono font-black text-purple-300 text-xs dir-ltr shrink-0 pr-1">
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
                          className="p-2 bg-[#1A2234] border border-white/10 rounded-2xl flex items-center justify-between text-xs hover:border-pink-500/40 transition-all cursor-pointer hover:scale-[1.01]"
                        >
                          <div className="flex items-center gap-2 overflow-hidden max-w-[70%]">
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

                            <img
                              src={item.avatar}
                              alt={item.name}
                              className="w-8 h-8 rounded-full object-cover border border-pink-400/50 shrink-0"
                            />

                            <div className="flex items-center gap-1.5 truncate">
                              <span className="font-black text-slate-100 truncate text-[11px]">{item.name}</span>
                              <span className="bg-purple-600/90 text-white text-[8px] font-black px-1.5 py-0.2 rounded-md shrink-0">
                                Lv.{item.level}
                              </span>
                              <span className="bg-amber-500/90 text-slate-950 text-[8px] font-black px-1.5 py-0.2 rounded-md shrink-0">
                                {item.vip}
                              </span>
                              <span className="bg-emerald-600/90 text-white text-[8px] font-black px-1.5 py-0.2 rounded-md shrink-0">
                                {item.nLevel}
                              </span>
                            </div>
                          </div>

                          <span className="font-mono font-black text-pink-300 text-xs dir-ltr shrink-0 pr-1">
                            {item.val}
                          </span>
                        </div>
                      ))
                    )}
                  </motion.div>
                </AnimatePresence>
              </motion.div>

              {/* Bottom Action / Footer Bar */}
              <div className="pt-2 border-t border-white/10 shrink-0 space-y-2">
                {statsMainTab === 'diamonds' && (
                  <>
                    <div className="flex items-center justify-between text-xs bg-slate-900/80 px-3 py-1.5 rounded-xl border border-cyan-500/20">
                      <span className="font-bold text-slate-300 text-[11px]">إجمالي الألماس والدعم بالروم:</span>
                      <span className="font-mono font-black text-cyan-300 dir-ltr text-xs">
                        {statsTimeFilter === '24h' ? '40,000,000 💎' : '325,700,000 💎'}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setShowRoomSupportModal(false);
                        onOpenRecharge?.();
                      }}
                      className="w-full py-2.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-slate-950 font-black text-xs rounded-xl shadow-md hover:brightness-110 cursor-pointer transition-all"
                    >
                      شحن ماسات وإرسال هدايا الآن 💎
                    </button>
                  </>
                )}

                {statsMainTab === 'club' && (
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
                )}

                {statsMainTab === 'charm' && (
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
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
        onSendGift={() => setShowGiftDrawer(true)}
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
        onSendGift={() => setShowGiftDrawer(true)}
        onMentionUser={(u) => {
          setInputMessage(`@${u.name} `);
          setShowChatInputModal(true);
        }}
        onToggleMuteUser={(u) => {
          if (u.seatId) handleToggleMuteSeat(u.seatId);
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
                          src={usr.avatar}
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
        onTakeSeat={(seatId) => handleTakeSeat(seatId)}
        onToggleLockSeat={(seatId) => handleToggleLockSeat(seatId)}
        onToggleMuteSeat={(seatId) => handleToggleMuteSeat(seatId)}
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
              isHost: targetSeat.isHost
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
        isMuted={isMyMicMuted}
        onToggleMute={() => {
          if (selectedSeatForQuickMic) {
            handleToggleMuteSeat(selectedSeatForQuickMic);
          } else {
            setIsMyMicMuted(!isMyMicMuted);
          }
        }}
        onLeaveSeat={() => handleLeaveSeat(selectedSeatForQuickMic || undefined)}
        onOpenDataStats={() => {
          setSelectedUserForProfile({
            id: 'my_user_profile',
            name: currentUserRole === 'host' ? 'المضيف (أنا)' : 'أنا',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
            userId: '88492011',
            country: 'السعودية',
            countryFlag: '🇸🇦',
            isHost: currentUserRole === 'host',
            isMuted: isMyMicMuted,
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
        onSendGift={() => setShowGiftDrawer(true)}
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

                {/* Preset Thumbnails Grid (3 Columns matching screenshot) */}
                <div className="grid grid-cols-3 gap-2.5 max-h-[380px] overflow-y-auto pr-0.5 custom-scrollbar">
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
                        onClick={() => setActiveMicCount(preset)}
                        className="flex flex-col items-center gap-1 group cursor-pointer"
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

      {/* Voice-Activated Remote & Interactive Mic Object Modal */}
      <AnimatePresence>
        {showVoiceRemoteModal && (
          <div
            className="fixed inset-0 z-50 bg-transparent flex items-center justify-center p-4 pointer-events-auto cursor-default select-none"
            onClick={() => setShowVoiceRemoteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-[#0F172A]/95 backdrop-blur-xl border-2 border-emerald-500/50 rounded-3xl p-4 space-y-3 text-white shadow-[0_0_50px_rgba(16,185,129,0.3)] pointer-events-auto"
              dir="rtl"
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400">
                    <Radio className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-emerald-300">الريموت الصوتي والمايك المباشر</h3>
                    <p className="text-[10px] text-slate-400 font-bold">التحكم الصوتي والتفاعل المباشر مع حركة الصوت</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowVoiceRemoteModal(false)}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <AudioReactiveMicObject
                isMuted={isMyMicMuted}
                isSpeaking={!isMyMicMuted}
                onTriggerEmojiReaction={(emoji) => {
                  handleSendEmojiReaction(emoji);
                }}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Developer Configuration & Lottie Assets Manager Modal */}
      <DevConfigModal
        isOpen={showDevConfigModal}
        onClose={() => setShowDevConfigModal(false)}
      />
    </div>
  );
};

