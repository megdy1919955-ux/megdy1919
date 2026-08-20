import { User, Gift, VoiceRoom, RechargePackage } from '../types';

export const CURRENT_USER: User = {
  id: 'usr_me',
  name: 'أسطورة العرب 👑',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  role: 'super_legend',
  vipLevel: 8,
  legendLevel: 50,
  wealthLevel: 42,
  charmLevel: 38,
  coins: 85400,
  diamonds: 12500,
  bio: 'مرحباً بكم في عالم سوبر ليجند ✨ | عشاق الطرب والحوار الراقي 🎙️',
  frame: 'legend-dragon',
  badge: '👑 سوبر ليجند',
  followersCount: 14200,
  followingCount: 320,
  country: 'السعودية',
  countryFlag: '🇸🇦'
};

export const MOCK_USERS: User[] = [
  CURRENT_USER,
  {
    id: 'usr_1',
    name: 'سلطان القلوب 💫',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'vip',
    vipLevel: 7,
    legendLevel: 35,
    wealthLevel: 30,
    charmLevel: 28,
    coins: 45000,
    diamonds: 8000,
    bio: 'صاحب البث الصوتي رقم 1 🎙️',
    followersCount: 9800,
    followingCount: 210,
    country: 'الإمارات',
    countryFlag: '🇦🇪'
  },
  {
    id: 'usr_2',
    name: 'أميرة النجوم ⭐',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    role: 'super_legend',
    vipLevel: 9,
    legendLevel: 60,
    wealthLevel: 55,
    charmLevel: 49,
    coins: 190000,
    diamonds: 32000,
    bio: 'الملكة الأولى لسوبر ليجند 👑💎',
    followersCount: 28400,
    followingCount: 150,
    country: 'الكويت',
    countryFlag: '🇰🇼'
  },
  {
    id: 'usr_3',
    name: 'فارس الليل 🌙',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    role: 'vip',
    vipLevel: 5,
    legendLevel: 22,
    wealthLevel: 18,
    charmLevel: 20,
    coins: 12000,
    diamonds: 2400,
    bio: 'عاشق للشعر والقصيد 📜',
    followersCount: 4300,
    followingCount: 88,
    country: 'قطر',
    countryFlag: '🇶🇦'
  },
  {
    id: 'usr_4',
    name: 'صقر قريش 🦅',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    role: 'vip',
    vipLevel: 6,
    legendLevel: 28,
    wealthLevel: 25,
    charmLevel: 31,
    coins: 34000,
    diamonds: 6500,
    bio: 'ألعاب ومسابقات يومية جوائز كبرى 🎁',
    followersCount: 8900,
    followingCount: 340,
    country: 'عمان',
    countryFlag: '🇴🇲'
  }
];

export const MOCK_GIFTS: Gift[] = [
  {
    id: 'gift_rose',
    name: 'Rose',
    nameAr: 'وردة حمراء 🌹',
    price: 10,
    icon: '🌹',
    category: 'popular',
    animationType: 'confetti'
  },
  {
    id: 'gift_heart',
    name: 'Heart Fire',
    nameAr: 'قلب ناري ❤️‍🔥',
    price: 50,
    icon: '❤️‍🔥',
    category: 'popular',
    animationType: 'confetti'
  },
  {
    id: 'gift_perfume',
    name: 'Royal Perfume',
    nameAr: 'عطر ملكي 🧴',
    price: 199,
    icon: '✨',
    category: 'popular',
    animationType: 'confetti'
  },
  {
    id: 'gift_ring',
    name: 'Diamond Ring',
    nameAr: 'خاتم الماس 💍',
    price: 999,
    icon: '💍',
    category: 'vip',
    animationType: 'crown'
  },
  {
    id: 'gift_crown',
    name: 'Legend Crown',
    nameAr: 'تاج الأسطورة 👑',
    price: 2999,
    icon: '👑',
    category: 'vip',
    animationType: 'crown'
  },
  {
    id: 'gift_car',
    name: 'Super Sports Car',
    nameAr: 'سيارة سوبر كار 🏎️',
    price: 9999,
    icon: '🏎️',
    category: 'legendary',
    animationType: 'supercar'
  },
  {
    id: 'gift_yacht',
    name: 'Royal Yacht',
    nameAr: 'يخت ملكي 🛥️',
    price: 29999,
    icon: '🛥️',
    category: 'legendary',
    animationType: 'yacht'
  },
  {
    id: 'gift_dragon',
    name: 'Golden Dragon',
    nameAr: 'التنين الذهبي الأسطوري 🐉',
    price: 99999,
    icon: '🐉',
    category: 'legendary',
    animationType: 'dragon'
  },
  {
    id: 'gift_castle',
    name: 'Sultan Palace',
    nameAr: 'قصر السلاطين 🏰',
    price: 199999,
    icon: '🏰',
    category: 'legendary',
    animationType: 'castle'
  }
];

export const MOCK_ROOMS: VoiceRoom[] = [
  {
    id: 'room_1',
    title: '👑 مجلس سوبر ليجند العام | طرب وسوالف راقية',
    description: 'أهلاً بالجميع في الغرفة الرسمية لسوبر ليجند، نقاشات يومية ومسابقات وجوائز كبرى.',
    host: MOCK_USERS[1],
    tag: 'طرب وسوالف',
    country: 'السعودية',
    countryFlag: '🇸🇦',
    bgTheme: 'from-purple-950 via-slate-900 to-indigo-950',
    listenersCount: 1420,
    hotScore: 98500,
    isPrivate: false,
    announcement: '📢 مرحباً بكل الأعضاء والضيوف الكرام، التزام الاحترام المتبادل وقوانين الروم.',
    luckyChest: {
      active: true,
      poolCoins: 5000,
      remainingSeconds: 145,
      totalContributors: 34
    },
    pkBattle: {
      active: true,
      blueTeam: { host: MOCK_USERS[1], score: 24500, supporters: 48 },
      redTeam: { host: MOCK_USERS[2], score: 38200, supporters: 62 },
      remainingSeconds: 180
    }
  },
  {
    id: 'room_2',
    title: '🎵 سهرة الطرب والأغاني الخليجية 🎤',
    description: 'أجمل الأصوات والمواهب الغنائية الحية مع نخبة العازفين.',
    host: MOCK_USERS[2],
    tag: 'موسيقى وغناء',
    country: 'الكويت',
    countryFlag: '🇰🇼',
    bgTheme: 'from-amber-950 via-slate-900 to-rose-950',
    listenersCount: 890,
    hotScore: 65400,
    isPrivate: false,
    announcement: '✨ مسابقة أفضل صوت الليلة الساعة 10 بتوقيت مكة!',
    luckyChest: {
      active: false,
      poolCoins: 0,
      remainingSeconds: 0,
      totalContributors: 0
    }
  },
  {
    id: 'room_3',
    title: '📜 أمسية الشعر النبطي والخواطر 🌙',
    description: 'مساحة خاصة لمحبي الشعر والأدب والقصائد العذبة.',
    host: MOCK_USERS[3],
    tag: 'شعر وأدب',
    country: 'قطر',
    countryFlag: '🇶🇦',
    bgTheme: 'from-emerald-950 via-slate-900 to-teal-950',
    listenersCount: 620,
    hotScore: 42100,
    isPrivate: false,
    announcement: '📖 ميكروفون مفتوح للجميع لإلقاء أجمل الأبيات.',
    luckyChest: {
      active: true,
      poolCoins: 2000,
      remainingSeconds: 85,
      totalContributors: 12
    }
  },
  {
    id: 'room_4',
    title: '🎮 مسابقات وتحدي الألعاب والجوائز الفورية 🎁',
    description: 'عجلة الحظ، النرد، وتوزيع كوينزات وهدايا للمتفاعلين.',
    host: MOCK_USERS[4],
    tag: 'ألعاب وجوائز',
    country: 'عمان',
    countryFlag: '🇴🇲',
    bgTheme: 'from-blue-950 via-slate-900 to-cyan-950',
    listenersCount: 1100,
    hotScore: 78900,
    isPrivate: false,
    announcement: '🎯 الفائز بالمركز الأول يحصل على 10,000 كوينز فوراً!',
    luckyChest: {
      active: true,
      poolCoins: 10000,
      remainingSeconds: 210,
      totalContributors: 55
    }
  }
];

export const RECHARGE_PACKAGES: RechargePackage[] = [
  { id: 'pkg_1', coins: 1000, bonusCoins: 100, priceUSD: 0.99 },
  { id: 'pkg_2', coins: 5500, bonusCoins: 800, priceUSD: 4.99, popular: true, discountBadge: '+15% إضافي' },
  { id: 'pkg_3', coins: 12000, bonusCoins: 2500, priceUSD: 9.99, discountBadge: '+20% إضافي' },
  { id: 'pkg_4', coins: 65000, bonusCoins: 15000, priceUSD: 49.99, discountBadge: '+25% إضافي' },
  { id: 'pkg_5', coins: 140000, bonusCoins: 40000, priceUSD: 99.99, popular: true, discountBadge: 'عرض الأساطير 👑' },
  { id: 'pkg_6', coins: 750000, bonusCoins: 250000, priceUSD: 499.99, discountBadge: 'VIP ملكي 💎' }
];

export const LEADERBOARD_DATA = {
  daily: [
    { rank: 1, user: MOCK_USERS[2], points: 2840000, title: 'إمبراطور الكرم' },
    { rank: 2, user: CURRENT_USER, points: 1950000, title: 'أسطورة اليوم' },
    { rank: 3, user: MOCK_USERS[1], points: 1420000, title: 'أمير الدعم' },
    { rank: 4, user: MOCK_USERS[4], points: 890000, title: 'الفارس الذهبي' },
    { rank: 5, user: MOCK_USERS[3], points: 640000, title: 'نجم السهرة' }
  ],
  weekly: [
    { rank: 1, user: CURRENT_USER, points: 12840000, title: 'ملك الأسبوع 👑' },
    { rank: 2, user: MOCK_USERS[2], points: 11200000, title: 'أميرة العطاء' },
    { rank: 3, user: MOCK_USERS[1], points: 8900000, title: 'فارس المجد' }
  ],
  monthly: [
    { rank: 1, user: CURRENT_USER, points: 45000000, title: 'أسطورة الشهر الخالدة 💎' },
    { rank: 2, user: MOCK_USERS[2], points: 39000000, title: 'ملكة سوبر ليجند' },
    { rank: 3, user: MOCK_USERS[1], points: 27500000, title: 'عملاق الدعم' }
  ]
};
