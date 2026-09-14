// Room Common TypeScript Definitions
import { UserProfileData } from '../../types';

export interface MicSeat {
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
  isPendingAudioAcceptance?: boolean;
  isInvitationPending?: boolean;
  inviterName?: string;
  speakingAura?: SpeakingAuraType;
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
