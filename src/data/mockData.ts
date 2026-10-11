import { UserProfileData, VisitorUser, FriendUser, FollowerUser, LikeActivity } from '../types';

export const INITIAL_USER_PROFILE: UserProfileData = {
  name: '(عابرسبيل)',
  userId: '1001001',
  avatarUrl: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=400',
  coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200',
  bio: '',
  isOnline: true,
  level: 25,
  vipTier: 'VIP8',
  badges: [
    {
      id: 'vip_8',
      code: 'VIP8',
      title: 'عضوية VIP 8',
      category: 'vip',
      bgColor: 'from-amber-600 via-yellow-500 to-amber-700',
      textColor: 'text-amber-100',
      borderColor: 'border-yellow-300/40',
      description: 'شارة VIP المستوى الثامن الذهبية',
      levelProgress: 92
    },
    {
      id: 'super_legend_1',
      code: 'SL1',
      title: 'سوبر ليجند (SL1)',
      category: 'noble',
      bgColor: 'from-amber-600 via-yellow-500 to-amber-700',
      textColor: 'text-amber-100',
      borderColor: 'border-yellow-300/40',
      description: 'شارة رتبة سوبر ليجند الأسطورية المستوى الأول',
      levelProgress: 85
    }
  ],
  stats: {
    visitors: 0,
    friends: 0,
    followers: 0,
    likes: 0
  }
};

export const MOCK_VISITORS: VisitorUser[] = [];

export const MOCK_FRIENDS: FriendUser[] = [];

export const MOCK_FOLLOWERS: FollowerUser[] = [];

export const MOCK_LIKES: LikeActivity[] = [];

