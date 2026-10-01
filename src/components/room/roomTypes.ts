// Room Common TypeScript Definitions
import { UserProfileData } from '../../types';

export interface MicSeat {
  id: number;
  userId?: string;
  userName: string;
  avatar?: string;
  isHost?: boolean;
  isOwner?: boolean;
  isMuted?: boolean;
  isMutedByAdmin?: boolean;
  isSpeaking?: boolean;
  audioLevel?: number;
  isEmpty?: boolean;
  isLocked?: boolean;
  isPendingAudioAcceptance?: boolean;
  isInvitationPending?: boolean;
  inviterName?: string;
  speakingAura?: SpeakingAuraType;
  vipLevel?: string;
}

export type SpeakingAuraType = 'default' | 'gold_fire' | 'neon_purple' | 'cyan_plasma' | 'royal_ruby';
export type BubbleSkinType = 'red_gold' | 'royal_gold' | 'cyber_neon' | 'pink_velvet' | 'emerald_luxury' | 'default';

export interface FloatingEffect {
  id: string;
  emoji: string;
  x: number;
}

export interface BadgeItem {
  id: string;
  label?: string;
  icon?: string;
  type?: 'vip' | 'level' | 'role' | 'supporter';
  bgClass: string;
}

export interface ChatMessage {
  id: string;
  userName: string;
  avatar?: string;
  text: string;
  userColor?: string;
  isGift?: boolean;
  isHost?: boolean;
  isOwner?: boolean;
  userGender?: 'male' | 'female';
  userAge?: number;
  heartLevel?: number;
  crownLevel?: number;
  vipLevel?: string | number;
  nobleLevel?: string;
  isJoinMessage?: boolean;
  isLuckyWinMessage?: boolean;
  winAmount?: number;
  multiplier?: number;
  giftName?: string;
  giftIcon?: string;
  badges?: BadgeItem[];
  bubbleSkin?: BubbleSkinType;
  isSystem?: boolean;
  replyTo?: {
    id: string;
    userName: string;
    text: string;
  };
}

export interface RoomEntranceEvent {
  id: string;
  userName: string;
  avatar: string;
  vipLevel: number | string;
  nobleLevel?: string;
  isOwner?: boolean;
  isHost?: boolean;
  actionText?: string;
  timestamp?: number;
}

export interface RibbonMilestoneTheme {
  name: string;
  gradientStops: Array<{ offset: string; stopColor: string }>;
  foldColor: string;
  shadowColor: string;
  strokeColor: string;
}

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

export const getRibbonMilestoneTheme = (val: number = 0): RibbonMilestoneTheme => {
  if (val >= 1000000) {
    return {
      name: 'الذهبي الأسطوري (1M+)',
      gradientStops: [
        { offset: '0%', stopColor: '#f59e0b' },
        { offset: '35%', stopColor: '#fbbf24' },
        { offset: '70%', stopColor: '#f59e0b' },
        { offset: '100%', stopColor: '#ea580c' },
      ],
      foldColor: '#9a3412',
      shadowColor: 'rgba(234, 88, 12, 0.45)',
      strokeColor: '#fde68a',
    };
  }
  if (val >= 500000) {
    return {
      name: 'الأرجواني الملكي (500K+)',
      gradientStops: [
        { offset: '0%', stopColor: '#a855f7' },
        { offset: '35%', stopColor: '#c084fc' },
        { offset: '70%', stopColor: '#9333ea' },
        { offset: '100%', stopColor: '#7e22ce' },
      ],
      foldColor: '#581c87',
      shadowColor: 'rgba(147, 51, 234, 0.45)',
      strokeColor: '#e9d5ff',
    };
  }
  if (val >= 100000) {
    return {
      name: 'الياقوتي الساطع (100K+)',
      gradientStops: [
        { offset: '0%', stopColor: '#ef4444' },
        { offset: '35%', stopColor: '#f87171' },
        { offset: '70%', stopColor: '#dc2626' },
        { offset: '100%', stopColor: '#b91c1c' },
      ],
      foldColor: '#7f1d1d',
      shadowColor: 'rgba(220, 38, 38, 0.45)',
      strokeColor: '#fecaca',
    };
  }
  return {
    name: 'الافتراضي المتدرج',
    gradientStops: [
      { offset: '0%', stopColor: '#3b82f6' },
      { offset: '35%', stopColor: '#60a5fa' },
      { offset: '70%', stopColor: '#2563eb' },
      { offset: '100%', stopColor: '#1d4ed8' },
    ],
    foldColor: '#1e3a8a',
    shadowColor: 'rgba(37, 99, 235, 0.4)',
    strokeColor: '#bfdbfe',
  };
};

export const getSpeakingAuraStyles = (aura: SpeakingAuraType = 'default') => {
  switch (aura) {
    case 'gold_fire':
      return {
        ring1Class: 'border-2 border-amber-400 shadow-[0_0_14px_rgba(251,191,36,0.85)]',
        ring2Class: 'border border-orange-400/70 shadow-[0_0_18px_rgba(249,115,22,0.5)]',
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
      return {
        ring1Class: 'border-[1px] border-emerald-400/40 shadow-[0_0_8px_rgba(52,211,153,0.3)]',
        ring2Class: 'border-[0.75px] border-cyan-400/25 shadow-[0_0_6px_rgba(6,182,212,0.15)]',
        ring3Class: 'border-[0.75px] border-dashed border-emerald-300/35',
        avatarBorderClass: 'from-emerald-400/40 via-teal-300/30 to-emerald-400/40 shadow-[0_0_6px_rgba(52,211,153,0.25)] ring-1 ring-emerald-400/30',
        scale1: [1, 1.14, 1],
        opacity1: [0.6, 0.2, 0.6],
        scale2: [1, 1.25, 1],
        opacity2: [0.4, 0.05, 0.4],
      };
  }
};

