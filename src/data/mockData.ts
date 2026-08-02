import { UserProfileData, VisitorUser, FriendUser, FollowerUser, LikeActivity } from '../types';

export const INITIAL_USER_PROFILE: UserProfileData = {
  name: '(عابرسبيل)',
  userId: 'YE1330000',
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
    visitors: 4103,
    friends: 408,
    followers: 164,
    likes: 5367
  }
};

export const MOCK_VISITORS: VisitorUser[] = [
  {
    id: 'v1',
    name: 'سارة الأحمد',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    timeAgo: 'منذ 5 دقائق',
    isVIP: true,
    level: 18
  },
  {
    id: 'v2',
    name: 'خالد بن سلطان',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    timeAgo: 'منذ 25 دقيقة',
    isVIP: true,
    level: 32
  },
  {
    id: 'v3',
    name: 'ريم الشمري',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
    timeAgo: 'منذ ساعة واحدة',
    isVIP: false,
    level: 12
  },
  {
    id: 'v4',
    name: 'فهد العتيبي',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    timeAgo: 'منذ 3 ساعات',
    isVIP: true,
    level: 28
  },
  {
    id: 'v5',
    name: 'نورة الحارثي',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    timeAgo: 'منذ 5 ساعات',
    isVIP: false,
    level: 9
  }
];

export const MOCK_FRIENDS: FriendUser[] = [
  {
    id: 'f1',
    name: 'فيصل المطيري',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200',
    status: 'in_room',
    level: 30,
    vipTier: 'VIP6'
  },
  {
    id: 'f2',
    name: 'منى القحطاني',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    status: 'online',
    level: 22,
    vipTier: 'VIP4'
  },
  {
    id: 'f3',
    name: 'عمر اليافعي',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200',
    status: 'offline',
    level: 19
  },
  {
    id: 'f4',
    name: 'ليان الزهراني',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=200',
    status: 'online',
    level: 27,
    vipTier: 'VIP7'
  }
];

export const MOCK_FOLLOWERS: FollowerUser[] = [
  {
    id: 'fl1',
    name: 'محمد الصالح',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
    isFollowingBack: true,
    level: 15
  },
  {
    id: 'fl2',
    name: 'أمل العلي',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=200',
    isFollowingBack: false,
    level: 11
  },
  {
    id: 'fl3',
    name: 'يوسف الشهري',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=200',
    isFollowingBack: true,
    level: 24
  },
  {
    id: 'fl4',
    name: 'شهد الناصر',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
    isFollowingBack: false,
    level: 8
  }
];

export const MOCK_LIKES: LikeActivity[] = [
  {
    id: 'l1',
    userName: 'سارة الأحمد',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    action: 'أهدتك تاج الكريستال الملكي 👑',
    giftName: 'تاج الكريستال',
    giftIcon: '💎',
    timeAgo: 'منذ 10 دقائق'
  },
  {
    id: 'l2',
    userName: 'خالد بن سلطان',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    action: 'أعجب بملفك الشخصي ❤️',
    timeAgo: 'منذ 30 دقيقة'
  },
  {
    id: 'l3',
    userName: 'فيصل المطيري',
    userAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200',
    action: 'أرسل سيارة فراري ذهبية 🏎️',
    giftName: 'سيارة VIP',
    giftIcon: '🏎️',
    timeAgo: 'منذ ساعتين'
  }
];
