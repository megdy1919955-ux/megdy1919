export interface User {
  id: string;
  name: string;
  avatar: string;
  role: 'owner' | 'admin' | 'vip' | 'super_legend' | 'user';
  vipLevel: number;
  legendLevel: number;
  wealthLevel: number;
  charmLevel: number;
  coins: number;
  diamonds: number;
  bio: string;
  isHost?: boolean;
  frame?: string;
  badge?: string;
  followersCount: number;
  followingCount: number;
  country: string;
  countryFlag: string;
}

export interface MicSeat {
  seatIndex: number;
  user: User | null;
  isMuted: boolean;
  isLocked: boolean;
  isSpeaking: boolean;
  audioLevel: number; // 0 to 100
  giftScore: number;
}

export interface Gift {
  id: string;
  name: string;
  nameAr: string;
  price: number;
  icon: string;
  category: 'popular' | 'vip' | 'legendary' | 'effects';
  animationType?: 'confetti' | 'dragon' | 'castle' | 'yacht' | 'supercar' | 'crown';
  durationMs?: number;
  soundEffect?: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  role: string;
  vipLevel: number;
  legendLevel: number;
  text: string;
  type: 'chat' | 'gift' | 'system' | 'join' | 'pk';
  timestamp: string;
  giftData?: {
    giftName: string;
    giftIcon: string;
    count: number;
    targetUserName: string;
  };
}

export interface VoiceRoom {
  id: string;
  title: string;
  description: string;
  host: User;
  tag: string;
  country: string;
  countryFlag: string;
  bgTheme: string;
  bgImage?: string;
  listenersCount: number;
  hotScore: number;
  isPrivate: boolean;
  announcement: string;
  luckyChest: {
    active: boolean;
    poolCoins: number;
    remainingSeconds: number;
    totalContributors: number;
  };
  pkBattle?: {
    active: boolean;
    blueTeam: { host: User; score: number; supporters: number };
    redTeam: { host: User; score: number; supporters: number };
    remainingSeconds: number;
  };
}

export interface RechargePackage {
  id: string;
  coins: number;
  bonusCoins: number;
  priceUSD: number;
  popular?: boolean;
  discountBadge?: string;
}
