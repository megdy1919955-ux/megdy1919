import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { VoiceRoomScreen } from './VoiceRoomScreen';
import { FloatingRoomWidget } from './FloatingRoomWidget';
import { subscribeToRoomSession } from '../lib/roomSessionService';
import { LuckyChestConfig } from './LuckyChestModal';
import { ThreeDLuckyChest } from './ThreeDLuckyChest';
import { PWAInstallBanner } from './PWAInstallBanner';
import {
  Search,
  Crown,
  Menu,
  Star,
  Sparkles,
  Calendar,
  X,
  Mic,
  Gift,
  Film,
  Gamepad2,
  Disc,
  Volume2,
  Radio,
  Maximize2,
  Minimize2,
  Globe,
  SlidersHorizontal,
  Check,
  ChevronLeft,
  Zap,
  Trophy,
  Coins,
  Flame,
  Lock,
  KeyRound
} from 'lucide-react';

export interface RoomData {
  id: string;
  title: string;
  host: string;
  listenersCount: number;
  image: string;
  countryName: string;
  countryCode: string;
  flag: string;
  badge?: {
    type: 'text' | 'icon';
    content: string;
    bgColor: string;
    textColor?: string;
  };
  hasPlusAvatar?: boolean;
  topTag?: string;
  isLudoGame?: boolean;
  isLocked?: boolean;
  password?: string;
  ownerId?: string;
  isOwner?: boolean;
  avatars: string[];
}

interface BannerItem {
  id: string;
  title: string;
  subtitle: string;
  timeRange: string;
  badgeText: string;
  gradientBg: string;
  borderColor: string;
  accentTextColor: string;
  icon: React.ReactNode;
}

export interface HomeScreenProps {
  onOpenRecharge?: () => void;
  onOpenRoom?: (room: RoomData) => void;
}

const DEFAULT_INITIAL_ROOM: RoomData = {
  id: 'room-1',
  title: 'وكالة شحن سوريا ألمانيا',
  host: 'وكالة شحن سوريا ألمانيا',
  listenersCount: 24,
  countryName: 'سوريا',
  countryCode: 'SY',
  flag: '🇸🇾',
  topTag: 'senior Star Scout',
  image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
  badge: {
    type: 'text',
    content: 'دردشة',
    bgColor: 'bg-[#00E676]',
    textColor: 'text-slate-950'
  },
  hasPlusAvatar: false,
  avatars: [
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=100',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100'
  ]
};

export const HomeScreen: React.FC<HomeScreenProps> = ({ onOpenRecharge, onOpenRoom }) => {
  const [selectedRoomModal, setSelectedRoomModal] = useState<RoomData | null>(null);
  const [activeVoiceRoom, setActiveVoiceRoom] = useState<RoomData | null>(null);
  const [isRoomMinimized, setIsRoomMinimized] = useState<boolean>(false);

  const openRoom = (room: RoomData) => {
    if (onOpenRoom) {
      onOpenRoom(room);
    } else {
      setActiveVoiceRoom(room);
      setIsRoomMinimized(false);
    }
  };

  useEffect(() => {
    const unsub = subscribeToRoomSession((session) => {
      if (!session) {
        setActiveVoiceRoom(null);
        setIsRoomMinimized(false);
      } else {
        setIsRoomMinimized(Boolean(session.isMinimized));
      }
    });
    return unsub;
  }, []);

  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
    };
  }, []);

  const toggleFullscreen = () => {
    try {
      if (!document.fullscreenElement) {
        const elem = document.documentElement as any;
        if (elem.requestFullscreen) {
          elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
          elem.webkitRequestFullscreen();
        }
      } else {
        const doc = document as any;
        if (doc.exitFullscreen) {
          doc.exitFullscreen();
        } else if (doc.webkitExitFullscreen) {
          doc.webkitExitFullscreen();
        }
      }
    } catch (e) {
      console.warn('Fullscreen toggle failed:', e);
    }
  };

  // Smooth Auto-Play Carousel state (3.5s interval with easeInOut animation)
  const [currentBannerIndex, setCurrentBannerIndex] = useState<number>(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState<boolean>(false);
  const pauseTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const bannerItems: BannerItem[] = [
    {
      id: 'banner-1',
      title: 'مسابقة كأس الصداقة لدولة المغرب 🇲🇦',
      subtitle: 'اربح ملايين الكوينز والصناديق الملكية الفاخرة!',
      timeRange: 'UTC+2 24:00 08\\6 - 00:00 08\\3',
      badgeText: 'جوائز كبرى',
      gradientBg: 'from-[#2c1300] via-[#5c3708] to-[#1f0d01]',
      borderColor: 'border-amber-500/40',
      accentTextColor: 'text-amber-300',
      icon: <Gift className="w-7 h-7 text-amber-300 fill-amber-400 animate-bounce" />
    },
    {
      id: 'banner-2',
      title: 'قاعة المشاهير 👑 VIP',
      subtitle: 'تنافس مع أقوى المضيفين وانتزع عرش الصدارة!',
      timeRange: '(UTC+2) 24:00 12/31 - 00:00 2026/01/01',
      badgeText: 'الملوك VIP',
      gradientBg: 'from-[#1e0a38] via-[#3b1263] to-[#120524]',
      borderColor: 'border-purple-500/40',
      accentTextColor: 'text-purple-300',
      icon: <Crown className="w-7 h-7 text-amber-300 fill-amber-400 animate-pulse" />
    },
    {
      id: 'banner-3',
      title: 'مهرجان الشحن الفوري 💎',
      subtitle: 'احصل على بونص +50% كوينز إضافية عند كل عملية شحن!',
      timeRange: 'عرض لفترة محدودة 🔥 24 ساعة',
      badgeText: 'عروض بونص',
      gradientBg: 'from-[#022c22] via-[#064e3b] to-[#021d17]',
      borderColor: 'border-emerald-500/40',
      accentTextColor: 'text-emerald-300',
      icon: <Zap className="w-7 h-7 text-emerald-300 fill-emerald-400/80 animate-bounce" />
    },
    {
      id: 'banner-4',
      title: 'حفلة سوبر نايت Live 🎙️',
      subtitle: 'استمع لأفضل الأصوات العربية وشارك في إهداء الهدايا الفاخرة',
      timeRange: 'الليلة الساعة 10:00 مساءً 🎶',
      badgeText: 'بث حصري',
      gradientBg: 'from-[#310416] via-[#630b2e] to-[#20020e]',
      borderColor: 'border-rose-500/40',
      accentTextColor: 'text-rose-300',
      icon: <Mic className="w-7 h-7 text-rose-300 fill-rose-400 animate-pulse" />
    },
    {
      id: 'banner-5',
      title: 'تحدي الرومات الذهبية 🏆',
      subtitle: 'جمع أصدقاءك وحقق أعلى نقاط شعبية هذا الأسبوع',
      timeRange: 'متبقي 3 أيام ⏳ للجائزة',
      badgeText: 'بطولة الشعبية',
      gradientBg: 'from-[#0a192f] via-[#1e3a8a] to-[#030e21]',
      borderColor: 'border-blue-500/40',
      accentTextColor: 'text-sky-300',
      icon: <Trophy className="w-7 h-7 text-amber-300 fill-amber-400 animate-bounce" />
    },
    {
      id: 'banner-6',
      title: 'سندباد الهدايا الأسطورية 🧞‍♂️',
      subtitle: 'افتح الفوانيس والعلب السحرية واربح أشكال وسيارات الملك',
      timeRange: 'فعالية الصيف الكبرى 🌟',
      badgeText: 'صناديق سحرية',
      gradientBg: 'from-[#28052b] via-[#520d59] to-[#18021a]',
      borderColor: 'border-fuchsia-500/40',
      accentTextColor: 'text-fuchsia-300',
      icon: <Sparkles className="w-7 h-7 text-fuchsia-300 fill-fuchsia-400 animate-pulse" />
    }
  ];

  // Auto-play interval for Smooth Carousel (3.5 seconds)
  useEffect(() => {
    if (isCarouselPaused) return;

    const timer = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % bannerItems.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [isCarouselPaused, bannerItems.length]);

  const handleCarouselTouch = () => {
    setIsCarouselPaused(true);
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    pauseTimeoutRef.current = setTimeout(() => {
      setIsCarouselPaused(false);
    }, 4000);
  };

  // Geographic Country Filtering & Search state
  const [selectedCountry, setSelectedCountry] = useState<string>('all'); // 'all' or country name e.g. 'مصر'
  const [isCountryModalOpen, setIsCountryModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Global Room Lock System State & Listener
  const [globalLockData, setGlobalLockData] = useState<{ isLocked: boolean; password?: string }>(() => {
    const saved = localStorage.getItem('global_room_lock_status');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return { isLocked: false, password: '' };
  });

  // Global Lucky Chests Outside-Room State & Synchronization
  const [activeLuckyChests, setActiveLuckyChests] = useState<LuckyChestConfig[]>(() => {
    try {
      const saved = localStorage.getItem('super_legend_active_lucky_chests');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
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
        roomId: 'room-1',
        roomTitle: 'وكالة شحن سوريا ألمانيا',
        claimedBy: []
      }
    ];
  });
  const [, setChestTick] = useState<number>(0);
  const [locallyClaimedIds, setLocallyClaimedIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('claimed_lucky_chest_ids') || '[]');
    } catch {
      return [];
    }
  });

  const [, setMetadataRefresh] = useState(0);

  useEffect(() => {
    const syncChests = () => {
      try {
        const saved = localStorage.getItem('super_legend_active_lucky_chests');
        if (saved) {
          setActiveLuckyChests(JSON.parse(saved));
        }
        setLocallyClaimedIds(JSON.parse(localStorage.getItem('claimed_lucky_chest_ids') || '[]'));
      } catch (e) {}
    };

    const handleRoomMetaUpdate = () => {
      setMetadataRefresh((prev) => prev + 1);
    };

    window.addEventListener('storage', syncChests);
    window.addEventListener('storage', handleRoomMetaUpdate);
    window.addEventListener('lucky_chest_updated', syncChests);
    window.addEventListener('room_metadata_updated', handleRoomMetaUpdate);
    return () => {
      window.removeEventListener('storage', syncChests);
      window.removeEventListener('storage', handleRoomMetaUpdate);
      window.removeEventListener('lucky_chest_updated', syncChests);
      window.removeEventListener('room_metadata_updated', handleRoomMetaUpdate);
    };
  }, []);

  // Real-time ticking timer for countdown on room cards
  useEffect(() => {
    if (activeLuckyChests.length === 0) return;
    const interval = setInterval(() => {
      setChestTick((v) => v + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [activeLuckyChests.length]);

  // Helper to get active, non-depleted, unclaimed lucky chests strictly for a specific room
  const getRoomActiveChests = (room: RoomData) => {
    return activeLuckyChests.filter((chest) => {
      const isIdClaimedLocally = locallyClaimedIds.includes(chest.id);
      const isClaimedByMe =
        isIdClaimedLocally ||
        chest.claimedBy?.some((c) => c.userId === currentUserId);
      const remainingPortions =
        chest.remainingPortions ?? Math.max(0, chest.portions - (chest.claimedBy?.length || 0));
      const isDepleted = remainingPortions <= 0;

      if (isClaimedByMe || isDepleted) return false;

      // Strictly match this specific room's ID
      const targetRoomId = chest.roomId || 'room-1';
      return targetRoomId === room.id;
    });
  };

  const [showEnterPinModal, setShowEnterPinModal] = useState<boolean>(false);
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');
  const [roomToJoinPending, setRoomToJoinPending] = useState<RoomData | null>(null);

  useEffect(() => {
    const syncLock = () => {
      const saved = localStorage.getItem('global_room_lock_status');
      if (saved) {
        try {
          setGlobalLockData(JSON.parse(saved));
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

  const currentUserId = 'user-owner-me'; // ID المستخدم الحالي المالك

  // بيانات رومك الخاص (البث المباشر) بصلات المالك الكاملة
  const MY_ROOM_DATA: RoomData = {
    id: 'my-own-room-7798',
    title: 'رومي الخاص (البث المباشر) 🎙️',
    host: 'أنا (المالك 👑)',
    listenersCount: 15,
    countryName: 'السعودية',
    countryCode: 'SA',
    flag: '🇸🇦',
    ownerId: currentUserId,
    isOwner: true,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    badge: {
      type: 'text',
      content: 'رومك الخاص',
      bgColor: 'bg-amber-500',
      textColor: 'text-slate-950'
    },
    avatars: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=100'
    ]
  };

  const handleAttemptJoinRoom = (room: RoomData) => {
    // 1. إذا كان المستخدم الحالي هو مالك الروم الخاص به، اسمح له بالدخول فوراً بصلاحيات المالك
    if (room.ownerId === currentUserId || room.isOwner) {
      openRoom(room);
      return;
    }

    // 2. إذا كان الروم مقفلاً وغير تابع للمالك، اطلب الرمز للدخول كمضيف/زائر عادي
    const isLocked = room.isLocked || (globalLockData.isLocked && room.id === 'room-1');
    if (isLocked) {
      setRoomToJoinPending(room);
      setShowEnterPinModal(true);
      setEnteredPin('');
      setPinError('');
    } else {
      openRoom(room);
    }
  };

  const handleVerifyAndEnterRoom = () => {
    if (!enteredPin || enteredPin.length !== 6) {
      setPinError('يرجى إدخال الرمز السري المكون من 6 أرقام بالضبط 🔢');
      return;
    }
    const correctPassword = roomToJoinPending?.password || globalLockData.password || '123456';
    if (enteredPin === correctPassword) {
      setShowEnterPinModal(false);
      setEnteredPin('');
      setPinError('');
      setSelectedRoomModal(null);
      if (roomToJoinPending) {
        openRoom(roomToJoinPending);
      }
    } else {
      setPinError('الرمز السري غير صحيح! ❌ يرجى التأكد من الرقم والمحاولة مجدداً');
    }
  };

  // List of Arab countries for location filtering
  const arabCountries = [
    { code: 'all', name: 'التوصيات', flag: '🔥' },
    { code: 'SA', name: 'السعودية', flag: '🇸🇦' },
    { code: 'EG', name: 'مصر', flag: '🇪🇬' },
    { code: 'IQ', name: 'العراق', flag: '🇮🇶' },
    { code: 'YE', name: 'اليمن', flag: '🇾🇪' },
    { code: 'PS', name: 'فلسطين', flag: '🇵🇸' },
    { code: 'AE', name: 'الإمارات', flag: '🇦🇪' },
    { code: 'KW', name: 'الكويت', flag: '🇰🇼' },
    { code: 'JO', name: 'الأردن', flag: '🇯🇴' },
    { code: 'SY', name: 'سوريا', flag: '🇸🇾' },
    { code: 'SD', name: 'السودان', flag: '🇸🇩' },
    { code: 'MA', name: 'المغرب', flag: '🇲🇦' },
    { code: 'DZ', name: 'الجزائر', flag: '🇩🇿' },
    { code: 'TN', name: 'تونس', flag: '🇹🇳' },
    { code: 'LY', name: 'ليبيا', flag: '🇱🇾' },
    { code: 'QA', name: 'قطر', flag: '🇶🇦' },
    { code: 'OM', name: 'عُمان', flag: '🇴🇲' },
    { code: 'BH', name: 'البحرين', flag: '🇧🇭' },
    { code: 'LB', name: 'لبنان', flag: '🇱🇧' },
    { code: 'SO', name: 'الصومال', flag: '🇸🇴' },
    { code: 'MR', name: 'موريتانيا', flag: '🇲🇷' },
  ];

  // Exact room data with country metadata and stats matching reference designs
  const roomList: RoomData[] = [
    {
      id: 'room-1',
      title: 'وكالة شحن سوريا ألمانيا',
      host: 'وكالة شحن سوريا ألمانيا',
      listenersCount: 24,
      countryName: 'سوريا',
      countryCode: 'SY',
      flag: '🇸🇾',
      topTag: 'senior Star Scout',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      badge: {
        type: 'text',
        content: 'دردشة',
        bgColor: 'bg-[#00E676]',
        textColor: 'text-slate-950'
      },
      hasPlusAvatar: false,
      avatars: [
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=100',
        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100'
      ]
    },
    {
      id: 'room-2',
      title: 'وكآلة آلأيهم',
      host: 'وكآلة آلأيهم MOE',
      listenersCount: 73,
      countryName: 'مصر',
      countryCode: 'EG',
      flag: '🇪🇬',
      image: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&q=80&w=400',
      badge: {
        type: 'text',
        content: 'دردشة',
        bgColor: 'bg-[#00E676]',
        textColor: 'text-slate-950'
      },
      hasPlusAvatar: true,
      avatars: [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100'
      ]
    },
    {
      id: 'room-3',
      title: 'Ludo ابدأ الآن',
      host: 'لعبة لودو التنافسية',
      listenersCount: 784,
      countryName: 'مصر',
      countryCode: 'EG',
      flag: '🇪🇬',
      isLudoGame: true,
      image: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&q=80&w=400',
      badge: {
        type: 'text',
        content: '100 ⭐️',
        bgColor: 'bg-amber-500',
        textColor: 'text-slate-950'
      },
      avatars: []
    },
    {
      id: 'room-4',
      title: 'ما وراء الطبيعة',
      host: 'روم ما وراء الطبيعة 100700',
      listenersCount: 72,
      countryName: 'مصر',
      countryCode: 'EG',
      flag: '🇪🇬',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=400',
      badge: {
        type: 'text',
        content: 'إذاعة',
        bgColor: 'bg-purple-600',
        textColor: 'text-white'
      },
      hasPlusAvatar: true,
      avatars: [
        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100'
      ]
    },
    {
      id: 'room-5',
      title: 'سَنُقْرِئُكَ فَلَا تَنَسَىٰ...',
      host: 'وكالة الجابري',
      listenersCount: 42,
      countryName: 'الإمارات',
      countryCode: 'AE',
      flag: '🇦🇪',
      image: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80&w=400',
      badge: {
        type: 'text',
        content: 'إذاعة',
        bgColor: 'bg-purple-600',
        textColor: 'text-white'
      },
      hasPlusAvatar: true,
      avatars: [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100'
      ]
    },
    {
      id: 'room-6',
      title: 'وكاله ZEUS لتسجيل المضيفين',
      host: 'وكالة زيوس ZEUS',
      listenersCount: 156,
      countryName: 'السعودية',
      countryCode: 'SA',
      flag: '🇸🇦',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
      badge: {
        type: 'text',
        content: 'دردشة',
        bgColor: 'bg-[#00E676]',
        textColor: 'text-slate-950'
      },
      hasPlusAvatar: true,
      avatars: [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100'
      ]
    }
  ];

  // Function to resolve dynamically edited title and avatar for any room from cache or storage
  const getDynamicRoomData = (room: RoomData): RoomData => {
    let dynamicTitle = room.title;
    let dynamicImage = room.image;

    try {
      const savedTitle = localStorage.getItem(`super_legend_room_title_${room.id}`);
      if (savedTitle) dynamicTitle = savedTitle;
      const savedAvatar = localStorage.getItem(`super_legend_room_avatar_${room.id}`);
      if (savedAvatar) dynamicImage = savedAvatar;
    } catch (e) {}

    return {
      ...room,
      title: dynamicTitle,
      image: dynamicImage
    };
  };

  // Filter rooms by country & search query with dynamic titles/avatars
  const filteredRooms = roomList.map(getDynamicRoomData).filter((room) => {
    const matchesCountry = selectedCountry === 'all' || room.countryName === selectedCountry || room.countryCode === selectedCountry;
    const matchesSearch = searchQuery.trim() === '' ||
      room.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.host.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCountry && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#f8faf8] text-slate-900 pb-28 font-sans select-none relative overflow-x-hidden w-full max-w-full touch-pan-y" dir="rtl">
      {/* 1. TOP HEADER BAR: CLEAN & UNCLUTTERED 
          (1st ON RIGHT: أيقونة البث المباشر / رومك, 2nd: عدسة البحث. ALL OTHER ICONS AND TABS REMOVED COMPLETELY) */}
      <div className="bg-gradient-to-b from-[#e1f3e7] via-[#ebf7ef] to-[#f8faf8] px-4 pt-3.5 pb-2.5 border-b border-emerald-100/60 shadow-2xs">
        <div className="flex items-center gap-2.5">
          {/* 1st ON RIGHT (RTL): أيقونة البث المباشر (رومك) */}
          <button
            onClick={() => {
              openRoom(MY_ROOM_DATA);
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white shadow-sm hover:shadow-md active:scale-95 transition-all cursor-pointer border border-emerald-400/30"
            title="دخول البث المباشر الخاص بك (رومك المالك 👑)"
          >
            <div className="relative flex items-center justify-center">
              <Radio className="w-4 h-4 text-white animate-pulse" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white animate-ping" />
            </div>
            <span className="text-xs font-black tracking-wide">رومك (البث المباشر)</span>
          </button>

          {/* 2nd ON RIGHT: عدسة البحث */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className={`w-9 h-9 rounded-2xl border flex items-center justify-center transition-all cursor-pointer ${
              isSearchOpen 
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs' 
                : 'bg-white border-slate-200/90 text-slate-700 hover:text-black hover:bg-slate-50 shadow-2xs'
            }`}
            title="البحث عن روم أو مذيع"
          >
            <Search className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* 3rd ON LEFT: زر إخفاء المتصفح والشاشة الكاملة */}
          <button
            onClick={toggleFullscreen}
            className="ms-auto flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-500/40 text-amber-950 text-[11px] font-black hover:bg-amber-500/30 active:scale-95 transition-all cursor-pointer shadow-2xs"
            title={isFullscreen ? 'الخروج من الشاشة الكاملة' : 'إخفاء شريط المتصفح وجعل التطبيق شاشة كاملة'}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-amber-700" />
                <span>تصغير</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-amber-700" />
                <span>شاشة كاملة</span>
              </>
            )}
          </button>
        </div>

        {/* Dynamic Search Input Drawer */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2.5 overflow-hidden"
            >
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="ابحث عن اسم الروم أو اسم المذيع..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-9 py-2 bg-white border border-slate-300/80 rounded-2xl text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 shadow-inner"
                  autoFocus
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-3 pointer-events-none" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute left-3 p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Standalone Native App Install Banner */}
      <PWAInstallBanner />

      <div className="px-3 space-y-3 pt-2">
        {/* 2. TOP CAROUSEL BANNER (SMOOTH AUTO-PLAY CAROUSEL WITH INDICATOR DOTS) */}
        <div
          className="relative rounded-3xl overflow-hidden shadow-md group border border-amber-500/30 bg-slate-950 select-none min-h-[145px] flex flex-col justify-between"
          onTouchStart={handleCarouselTouch}
          onMouseEnter={handleCarouselTouch}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={bannerItems[currentBannerIndex].id}
              initial={{ opacity: 0, scale: 0.98, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.98, x: -20 }}
              transition={{ duration: 0.5, ease: [0.4, 0.0, 0.2, 1] }} // Curves.easeInOut for smooth transition
              onClick={() => onOpenRecharge?.()}
              className={`w-full bg-gradient-to-r ${bannerItems[currentBannerIndex].gradientBg} text-white p-3.5 border ${bannerItems[currentBannerIndex].borderColor} overflow-hidden rounded-3xl min-h-[145px] flex flex-col justify-between shadow-md cursor-pointer relative`}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.15),transparent_70%)] pointer-events-none" />

              <div className="relative z-10 flex items-center justify-between gap-2 pointer-events-none">
                <div className="space-y-1 max-w-[70%]">
                  <div className="text-[10px] font-mono font-bold text-amber-200/90 dir-ltr text-right">
                    {bannerItems[currentBannerIndex].timeRange}
                  </div>
                  <h2 className={`text-base font-black ${bannerItems[currentBannerIndex].accentTextColor} drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] tracking-tight line-clamp-1`}>
                    {bannerItems[currentBannerIndex].title}
                  </h2>
                  <p className="text-[11px] text-slate-100 font-bold leading-tight line-clamp-2">
                    {bannerItems[currentBannerIndex].subtitle}
                  </p>
                </div>

                <div className="relative shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-tr from-amber-500/80 via-yellow-300/80 to-amber-200/80 rounded-2xl p-0.5 shadow-xl flex items-center justify-center backdrop-blur-xs">
                    <div className="w-full h-full bg-slate-950/90 rounded-2xl p-1.5 flex flex-col items-center justify-center text-center">
                      {bannerItems[currentBannerIndex].icon}
                      <span className={`text-[8px] font-black ${bannerItems[currentBannerIndex].accentTextColor} mt-0.5 truncate max-w-[55px]`}>
                        {bannerItems[currentBannerIndex].badgeText}
                      </span>
                    </div>
                  </div>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 absolute -top-1 -right-1 animate-pulse" />
                </div>
              </div>

              {/* Indicator Dots Overlay at Bottom Center */}
              <div className="relative z-20 flex items-center justify-center gap-1.5 pt-2 pointer-events-auto">
                {bannerItems.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCarouselTouch();
                      setCurrentBannerIndex(idx);
                    }}
                    className={`rounded-full transition-all duration-300 cursor-pointer ${
                      idx === currentBannerIndex
                        ? 'w-6 h-1.5 bg-white shadow-md ring-1 ring-white/50'
                        : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/80'
                    }`}
                    title={`البانر ${idx + 1}`}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 3. FILTER CHIPS ROW: RECOMMENDATIONS FIRST ON RIGHT + CLEAN FILTER ICON ALONE + COUNTRY CHIPS */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 text-xs w-full max-w-full touch-pan-x" dir="rtl">
          {/* 1st ON RIGHT (RTL): "التوصيات" (Recommendations - Default & Primary) */}
          <button
            onClick={() => setSelectedCountry('all')}
            className={`px-3.5 py-2 rounded-2xl font-black shrink-0 flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 ${
              selectedCountry === 'all' || selectedCountry === 'التوصيات'
                ? 'bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white border border-emerald-500 shadow-sm'
                : 'bg-white border border-slate-200/90 text-slate-800 hover:bg-slate-50 shadow-2xs'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300/40" />
            <span>التوصيات</span>
          </button>

          {/* 2nd ON RIGHT: Clean Filter Icon Alone (NO text beside it!) */}
          <button
            onClick={() => setIsCountryModalOpen(true)}
            className="w-9 h-9 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 cursor-pointer shrink-0 shadow-xs flex items-center justify-center border border-slate-700/80 active:scale-95 transition-all"
            title="اختيار الدولة وتصفية الرومات"
          >
            <SlidersHorizontal className="w-4 h-4 text-amber-400 stroke-[2.5]" />
          </button>

          {/* Direct Country Quick-Filter Chips */}
          {arabCountries.filter(c => c.code !== 'all').map((c) => {
            const isSelected = selectedCountry === c.name;
            return (
              <button
                key={c.code}
                onClick={() => setSelectedCountry(c.name)}
                className={`px-3.5 py-1.5 rounded-2xl font-black shrink-0 flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all active:scale-95 ${
                  isSelected
                    ? 'bg-emerald-600 text-white border border-emerald-500 shadow-xs'
                    : 'bg-white border border-slate-200/80 text-slate-800 hover:bg-slate-50'
                }`}
              >
                <span>{c.name}</span>
                <span className="text-sm">{c.flag}</span>
              </button>
            );
          })}
        </div>

        {/* 4. ROOMS GRID: 2 PARALLEL COLUMNS WITH GLASSMORPHISM OVERLAY ON ROOM CARDS */}
        {filteredRooms.length === 0 ? (
          <div className="py-12 text-center bg-white border border-slate-200 rounded-3xl p-6 space-y-2">
            <Globe className="w-10 h-10 text-slate-400 mx-auto animate-pulse" />
            <h4 className="text-xs font-black text-slate-800">لا توجد رومات متاحة حالياً وفق التصفية المختارة</h4>
            <p className="text-[10px] text-slate-500">جرب اختيار "جميع الدول" أو إزالة كلمة البحث</p>
            <button
              onClick={() => {
                setSelectedCountry('all');
                setSearchQuery('');
              }}
              className="mt-2 px-4 py-1.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-emerald-700 transition-all cursor-pointer"
            >
              إعادة ضبط الفلتر
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3.5 w-full max-w-full overflow-x-hidden">
            {filteredRooms.map((room) => (
              <div key={room.id} className="flex flex-col space-y-1.5 w-full">
                {/* LUDO SPECIAL GAME CARD */}
                {room.isLudoGame ? (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedRoomModal(room)}
                    className="relative aspect-[4/5] w-full bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-3xl overflow-hidden shadow-md border border-blue-400/30 cursor-pointer group flex flex-col justify-between p-3 text-white text-center"
                  >
                    {/* Background Ludo Artwork */}
                    <img
                      src={room.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'}
                      alt="Ludo"
                      className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-900/40 via-transparent to-blue-950/90 pointer-events-none" />

                    {/* Top Star Rating Badge */}
                    <div className="relative z-10 flex justify-end">
                      <span className="bg-amber-400/90 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1 border border-amber-300">
                        {room.badge?.content || '100 ⭐️'}
                      </span>
                    </div>

                    {/* Center Ludo Title & Active Count */}
                    <div className="relative z-10 my-auto space-y-1">
                      <div className="text-xl font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-wide">
                        LUDO
                      </div>
                      <div className="text-[11px] font-black text-amber-200 drop-shadow-sm">
                        {room.listenersCount} المتواجدون
                      </div>
                    </div>

                    {/* Bottom Action Button "ابدأ الآن" */}
                    <div className="relative z-10">
                      <button className="w-full py-1.5 bg-white text-blue-900 font-black text-xs rounded-xl shadow-md hover:bg-blue-50 transition-all cursor-pointer">
                        ابدأ الآن
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  /* STANDARD VOICE ROOM CARD WITH GLASSMORPHISM OVERLAY */
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      const isLocked = room.isLocked || (room.id === 'room-1' && globalLockData.isLocked);
                      if (isLocked) {
                        handleAttemptJoinRoom(room);
                      } else {
                        setSelectedRoomModal(room);
                      }
                    }}
                    className="relative aspect-[4/5] w-full bg-slate-900 rounded-3xl overflow-hidden shadow-sm border border-slate-200/80 cursor-pointer group"
                  >
                    {/* Room Background Image */}
                    <img
                      src={room.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'}
                      alt={room.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Top Right Flag / Country Tag */}
                    <div className="absolute top-2.5 right-2.5 z-10 bg-black/40 backdrop-blur-md border border-white/20 px-2 py-0.5 rounded-full text-[10px] text-white font-bold flex items-center gap-1 shadow-xs">
                      <span>{room.flag}</span>
                      <span>{room.countryName}</span>
                    </div>

                    {/* Top Left External Lock Indicator Badge (مؤشر القفل الخارجي) */}
                    {(room.isLocked || (room.id === 'room-1' && globalLockData.isLocked)) ? (
                      <div className="absolute top-2.5 left-2.5 z-20 bg-rose-600/90 text-white px-2 py-0.5 rounded-full border border-rose-300 shadow-md backdrop-blur-xs flex items-center gap-1 text-[9px] font-black animate-pulse" title="الغرفة مقفلة برمز سري 🔒">
                        <Lock className="w-3 h-3 stroke-[2.5]" />
                        <span>مقفل</span>
                      </div>
                    ) : room.topTag ? (
                      <div className="absolute top-2.5 left-2.5 z-10 bg-purple-600/90 text-white font-black text-[9px] px-2 py-0.5 rounded-md shadow-xs">
                        {room.topTag}
                      </div>
                    ) : null}

                    {/* 3D LUCKY CHEST ON ROOM IMAGE (صندوق الحظ فوق صورة الغرفة مباشرة) */}
                    {(() => {
                      const roomChests = getRoomActiveChests(room);
                      if (roomChests.length === 0) return null;
                      const topChest = roomChests[0];
                      const isSuper = topChest.type === 'super';
                      const durationSeconds = topChest.drawTime === '10m' ? 600 : topChest.drawTime === '5m' ? 300 : 60;
                      const elapsed = Math.floor((Date.now() - topChest.createdAt) / 1000);
                      const remainingSeconds = Math.max(0, durationSeconds - elapsed);
                      const mins = Math.floor(remainingSeconds / 60);
                      const secs = remainingSeconds % 60;
                      const timeString = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
                      const isReady = remainingSeconds === 0 || topChest.drawTime === 'instant';

                      return (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.94 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAttemptJoinRoom(room);
                          }}
                          className="absolute top-10 right-2 z-25 flex flex-col items-center cursor-pointer pointer-events-auto filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)]"
                          title={`صندوق حظ نشط داخل هذه الغرفة (${topChest.totalCoins.toLocaleString()} كوينز) - انقر للدخول فوراً والانقضاض! 🎁`}
                        >
                          <div className="relative flex flex-col items-center">
                            {roomChests.length > 1 && (
                              <div className="absolute -top-1 -left-1 bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 font-black text-[7.5px] px-1.5 py-0.2 rounded-full border border-white shadow-xs z-30 flex items-center gap-0.5">
                                <span>x{roomChests.length}</span>
                              </div>
                            )}
                            <ThreeDLuckyChest
                              isSuper={isSuper}
                              isReady={isReady}
                              timeString={timeString}
                              size="xs"
                            />
                          </div>
                        </motion.div>
                      );
                    })()}

                    {/* GLASSMORPHISM ROOM STATS OVERLAY WITH STACKED AVATARS & BADGE ON LEFT */}
                    <div className="absolute bottom-0 inset-x-0 z-10 px-2.5 py-1.5 bg-slate-950/60 backdrop-blur-md border-t border-white/15 flex items-end justify-between rounded-b-3xl">
                      {/* RIGHT SIDE (RTL): Count + Animated Blue Live Signal */}
                      <div className="flex items-center gap-1.5 pb-0.5">
                        <span className="font-mono font-black text-xs text-white drop-shadow-sm">
                          {room.listenersCount}
                        </span>
                        <div className="flex items-end gap-0.5 h-3 shrink-0" title="بث مباشر">
                          <span className="w-0.5 h-1.5 bg-cyan-400 rounded-xs animate-pulse" />
                          <span className="w-0.5 h-2.5 bg-cyan-400 rounded-xs" />
                          <span className="w-0.5 h-3 bg-cyan-400 rounded-xs animate-pulse" />
                        </div>
                      </div>

                      {/* LEFT SIDE (شمال البطاقة): Vertical Column (Avatars on Top, Badge Directly Under) */}
                      <div className="flex flex-col items-start gap-1 -translate-y-3">
                        {/* Top Layer: Avatars starting from Left -> Right */}
                        <div className="flex items-center -space-x-1.5 dir-ltr">
                          {room.avatars.slice(0, 3).map((av, idx) => (
                            <img
                              key={`${room.id}-speaker-av-${idx}`}
                              src={av || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=100'}
                              alt="mic speaker"
                              className="w-6 h-6 rounded-full border-2 border-slate-900 object-cover shadow-md ring-1 ring-cyan-400/50"
                            />
                          ))}
                          {room.hasPlusAvatar && (
                            <div
                              className="w-5.5 h-5.5 rounded-full bg-cyan-400 text-slate-950 font-black text-[9px] flex items-center justify-center z-20 shadow-md border-2 border-slate-900"
                              title="انضم للمايك"
                            >
                              +
                            </div>
                          )}
                        </div>

                        {/* Bottom Layer: "دردشة" or "إذاعة" Badge Tag directly underneath avatars */}
                        {room.badge && (
                          <span
                            className={`px-2 py-0.5 rounded-md text-[9px] font-black shadow-xs shrink-0 ${room.badge.bgColor} ${room.badge.textColor || 'text-white'}`}
                          >
                            {room.badge.content}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ROOM TITLE & HOST DIRECTLY BELOW CARD */}
                <div className="px-1 space-y-0.5">
                  <h3 className="text-xs font-black text-slate-900 truncate dir-rtl leading-tight flex items-center gap-1">
                    <span className="truncate">{room.title}</span>
                    {(room.isLocked || (room.id === 'room-1' && globalLockData.isLocked)) && (
                      <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0 stroke-[2.5]" />
                    )}
                  </h3>
                  <p className="text-[10px] font-bold text-slate-500 truncate">
                    {room.host}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 5. EGYPTIAN PHARAOH LUXURY BANNER AT BOTTOM */}
        <div className="relative rounded-3xl bg-gradient-to-r from-[#190d03] via-[#3d2407] to-[#140a02] text-white p-3.5 border border-amber-500/30 shadow-md overflow-hidden flex items-center justify-between">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 shrink-0 shadow-sm">
            <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-amber-400" />
            </div>
          </div>

          <div className="text-right flex-1 px-3">
            <div className="text-xs font-black text-amber-300">من باشا مصر 🦅</div>
            <p className="text-[10px] text-amber-100/80 font-bold line-clamp-1">
              إلى الداعم المتألق أخي وصديقي الروسي...
            </p>
          </div>

          <div className="w-10 h-10 rounded-full border-2 border-amber-400 overflow-hidden shrink-0 shadow-xs">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
              alt="Basha"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* 6. FLOATING DAILY CHECK-IN ACTION WIDGET */}
      <div className="fixed bottom-16 left-3 z-30">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onOpenRecharge}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 via-orange-400 to-yellow-300 p-1 shadow-2xl flex items-center justify-center cursor-pointer border-2 border-white relative animate-bounce"
        >
          <div className="w-full h-full bg-gradient-to-b from-amber-400 via-orange-500 to-amber-600 rounded-full flex flex-col items-center justify-center text-white text-center shadow-inner">
            <Calendar className="w-7 h-7 stroke-[2.5]" />
          </div>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white ring-1 ring-red-400" />
        </motion.button>
      </div>

      {/* ARAB COUNTRIES SELECTION MODAL */}
      <AnimatePresence>
        {isCountryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm" dir="rtl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-slate-200 text-slate-900 space-y-4 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-900">اختيار الدولة (النطاق الجغرافي)</h3>
                    <p className="text-[10px] text-slate-500">تصفية الرومات المباشرة حسب الدولة</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCountryModalOpen(false)}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 cursor-pointer transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 max-h-[55vh] overflow-y-auto no-scrollbar p-0.5">
                {arabCountries.map((c) => {
                  const isSelected = selectedCountry === c.name || (c.code === 'all' && (selectedCountry === 'all' || selectedCountry === 'التوصيات'));
                  return (
                    <button
                      key={c.code}
                      onClick={() => {
                        setSelectedCountry(c.code === 'all' ? 'all' : c.name);
                        setIsCountryModalOpen(false);
                      }}
                      className={`p-3 rounded-2xl border text-right flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-600 shadow-sm font-black'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800 font-bold'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{c.flag}</span>
                        <span className="text-xs">{c.name}</span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-white shrink-0" />}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setIsCountryModalOpen(false)}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer"
              >
                إغلاق القائمة
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ROOM LIVE MODAL POPUP */}
      <AnimatePresence>
        {selectedRoomModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm" dir="rtl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-sm bg-slate-900 text-white rounded-3xl p-5 shadow-2xl border border-amber-500/30 space-y-4 text-center relative overflow-hidden"
            >
              <button
                onClick={() => setSelectedRoomModal(null)}
                className="absolute top-3 left-3 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-20 h-20 mx-auto rounded-full border-4 border-amber-400 overflow-hidden shadow-lg">
                <img
                  src={selectedRoomModal.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'}
                  alt={selectedRoomModal.host}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-1">
                <div className="inline-block bg-white/10 px-2.5 py-0.5 rounded-full text-[10px] text-amber-300 font-bold border border-white/10 mb-1">
                  {selectedRoomModal.flag} {selectedRoomModal.countryName}
                </div>
                <h3 className="text-base font-black text-amber-300">{selectedRoomModal.title}</h3>
                <p className="text-xs text-slate-300 font-bold">المضيف: {selectedRoomModal.host}</p>
              </div>

              <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/80 flex items-center justify-around text-xs font-mono">
                <div>
                  <span className="text-slate-400 block text-[10px]">المستمعون</span>
                  <span className="text-amber-400 font-black">{selectedRoomModal.listenersCount}</span>
                </div>
                <div className="h-6 w-px bg-slate-700" />
                <div>
                  <span className="text-slate-400 block text-[10px]">جودة الصوت</span>
                  <span className="text-emerald-400 font-black">عالية HD 🎙️</span>
                </div>
              </div>

              <button
                onClick={() => {
                  const currentRoom = selectedRoomModal;
                  setSelectedRoomModal(null);
                  if (currentRoom) {
                    handleAttemptJoinRoom(currentRoom);
                  }
                }}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-sm rounded-2xl shadow-lg hover:opacity-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <Mic className="w-4 h-4 fill-slate-950" />
                <span>دخول الميكروفون والبث المباشر</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6-DIGIT PIN ENTRY MODAL FOR LOCKED ROOMS (نافذة إدخال رمز القفل للدخول) */}
      <AnimatePresence>
        {showEnterPinModal && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4" dir="rtl">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white shadow-2xl relative space-y-4"
            >
              <button
                onClick={() => {
                  setShowEnterPinModal(false);
                  setEnteredPin('');
                  setPinError('');
                }}
                className="absolute top-3 left-3 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
                  <Lock className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white">الروم مقفلة برمز سري 🔒</h3>
                  <p className="text-[11px] text-slate-400">أدخل رمز الدخول المكون من 6 أرقام للانضمام للروم</p>
                </div>
              </div>

              <div className="space-y-2">
                <input
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  placeholder="رمز الدخول (6 أرقام)..."
                  value={enteredPin}
                  onChange={(e) => {
                    const onlyDigits = e.target.value.replace(/\D/g, '');
                    setEnteredPin(onlyDigits);
                    setPinError('');
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-4 py-3 text-center text-xl font-mono font-bold tracking-widest text-amber-400 focus:outline-none focus:border-amber-500/80"
                  autoFocus
                />
                {pinError && (
                  <p className="text-xs font-bold text-rose-400 text-center">{pinError}</p>
                )}
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleVerifyAndEnterRoom}
                  className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>تأكيد ودخول الروم</span>
                </button>
                <button
                  onClick={() => {
                    setShowEnterPinModal(false);
                    setEnteredPin('');
                    setPinError('');
                  }}
                  className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FLOATING ROOM MINI WIDGET (الوضع الاحتياطي فقط إذا لم يُمرر onOpenRoom) */}
      {!onOpenRoom && isRoomMinimized && activeVoiceRoom && (
        <FloatingRoomWidget
          onExpand={() => setIsRoomMinimized(false)}
          onExit={() => {
            setActiveVoiceRoom(null);
            setIsRoomMinimized(false);
          }}
        />
      )}

      {/* FULL SCREEN VOICE ROOM INTERIOR (الوضع الاحتياطي - يبقى محملاً بالخلفية عند الاحتفاظ) */}
      {!onOpenRoom && activeVoiceRoom && (
        <div className={isRoomMinimized ? 'opacity-0 pointer-events-none invisible fixed inset-0 -z-50' : 'opacity-100 pointer-events-auto visible fixed inset-0 z-50'}>
          <VoiceRoomScreen
            roomTitle={activeVoiceRoom.title}
            hostName={activeVoiceRoom.host}
            roomId={activeVoiceRoom.id}
            isOwner={Boolean(activeVoiceRoom.isOwner || activeVoiceRoom.ownerId === currentUserId)}
            onClose={() => {
              setActiveVoiceRoom(null);
              setIsRoomMinimized(false);
            }}
            onMinimize={() => setIsRoomMinimized(true)}
            onOpenRecharge={onOpenRecharge}
          />
        </div>
      )}
    </div>
  );
};
