export interface BadgeInfo {
  id: string;
  code: string; // e.g. 'N4', 'VIP8', '25', '113', '15', '53'
  title: string;
  category: 'noble' | 'vip' | 'level' | 'wealth' | 'charm' | 'activity';
  bgColor: string;
  textColor: string;
  borderColor?: string;
  iconName?: string;
  description: string;
  levelProgress?: number;
}

export interface StatItem {
  id: 'visitors' | 'friends' | 'likes' | 'followers';
  label: string;
  value: number | string;
  icon: string;
}

export interface UserProfileData {
  name: string;
  userId: string;
  avatarUrl: string;
  coverUrl?: string;
  country?: string;
  bio: string;
  isOnline: boolean;
  level: number;
  vipTier: string;
  badges: BadgeInfo[];
  stats: {
    visitors: number;
    friends: number;
    likes: number;
    followers: number;
  };
}

export interface VisitorUser {
  id: string;
  name: string;
  avatar: string;
  timeAgo: string;
  isVIP?: boolean;
  level?: number;
}

export interface FriendUser {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'in_room';
  level: number;
  vipTier?: string;
}

export interface FollowerUser {
  id: string;
  name: string;
  avatar: string;
  isFollowingBack: boolean;
  level: number;
}

export interface LikeActivity {
  id: string;
  userName: string;
  userAvatar: string;
  action: string;
  giftName?: string;
  giftIcon?: string;
  timeAgo: string;
}
