import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Sparkles,
  Send,
  Globe,
  Music,
  ChevronDown,
  Gift as GiftIcon,
  Crown,
  Flame,
  Check,
  Search,
  Volume2,
  Trophy,
  Star,
  Coins,
  Zap
} from 'lucide-react';

export interface GiftItem {
  id: string;
  name: string;
  price: number;
  icon: string;
  category: 'الفعالية' | 'رائج' | 'استرداد' | 'الدولة/المنطقة' | 'مخصصة' | 'الامتيازات' | 'مداعبة' | 'الكل';
  subCategory?: string;
  badge?: string; // e.g. "برج الاسد", "LV1", "Top1", "JACKPOT", "حظ"
  hasSound?: boolean;
  hasGlobalBroadcast?: boolean;
  isLucky?: boolean;
}

interface SeatUser {
  id: number;
  userName: string;
  avatar: string;
  isEmpty: boolean;
}

interface ProfessionalGiftPanelProps {
  isOpen: boolean;
  onClose: () => void;
  userCoins?: number;
  onOpenRecharge?: () => void;
  onSendGift?: (gift: GiftItem, quantity: number, targetName: string) => void;
  seats?: SeatUser[];
}

const GIFT_CATEGORIES = [
  'الفعالية',
  'رائج',
  'استرداد',
  'الدولة/المنطقة',
  'مخصصة',
  'الامتيازات',
  'مداعبة',
  'الكل'
] as const;

type CategoryType = (typeof GIFT_CATEGORIES)[number];

const MULTIPLIERS = [1, 7, 17, 77, 555, 777];

// Comprehensive database of gifts matching the user's uploaded screenshots
const GIFTS_DATABASE: GiftItem[] = [
  // 1. الفعالية / برج الأسد / الفعاليات
  {
    id: '1',
    name: 'شعلة الأسد 🦁',
    price: 50,
    icon: '🔥',
    category: 'الفعالية',
    subCategory: 'حدث برج الاسد',
    badge: 'برج الاسد',
    hasSound: true,
    hasGlobalBroadcast: true
  },
  {
    id: '2',
    name: 'خاتم برج الأسد ♌',
    price: 10000,
    icon: '🔮',
    category: 'الفعالية',
    subCategory: 'حدث برج الاسد',
    badge: 'برج الاسد',
    hasSound: true,
    hasGlobalBroadcast: true
  },
  {
    id: '3',
    name: 'سيارة الأفعى الذهبية 🏎️',
    price: 500000,
    icon: '🏎️',
    category: 'الفعالية',
    subCategory: 'حدث برج الاسد',
    badge: 'برج الاسد',
    hasSound: true,
    hasGlobalBroadcast: true
  },
  {
    id: '4',
    name: 'المحارب الأسطوري ⚔️',
    price: 250000,
    icon: '🛡️',
    category: 'الفعالية',
    subCategory: 'حدث برج الاسد',
    badge: 'برج الاسد',
    hasSound: true,
    hasGlobalBroadcast: true
  },
  {
    id: '5',
    name: 'الأسد الملكي الشامخ 🦁',
    price: 99999,
    icon: '🦁',
    category: 'الفعالية',
    subCategory: 'حدث برج الاسد',
    badge: 'برج الاسد',
    hasSound: true,
    hasGlobalBroadcast: true
  },
  {
    id: '6',
    name: 'أمير الصحراء 👳‍♂️',
    price: 20000,
    icon: '👳‍♂️',
    category: 'الفعالية',
    subCategory: 'حدث برج الاسد',
    badge: 'برج الاسد',
    hasSound: true,
    hasGlobalBroadcast: true
  },
  {
    id: '7',
    name: 'طائرة الفضاء الملكية 🚀',
    price: 2000000,
    icon: '🚀',
    category: 'الفعالية',
    subCategory: 'حدث برج الاسد',
    badge: 'برج الاسد',
    hasSound: true,
    hasGlobalBroadcast: true
  },
  {
    id: '8',
    name: 'عشاق الأبدية 💖',
    price: 5000000,
    icon: '👩‍❤️‍👨',
    category: 'الفعالية',
    subCategory: 'رحلة رومانسية',
    badge: 'برج الاسد',
    hasSound: true,
    hasGlobalBroadcast: true
  },

  // 2. رائج (Trending)
  {
    id: '9',
    name: 'المجرة الكونية 🌌',
    price: 777,
    icon: '🌌',
    category: 'رائج',
    badge: 'رائج',
    hasSound: true,
    hasGlobalBroadcast: true
  },
  {
    id: '10',
    name: 'الأسد الذهبي المتلألئ 🦁',
    price: 77777,
    icon: '🦁',
    category: 'رائج',
    badge: 'رائج',
    hasSound: true,
    hasGlobalBroadcast: true
  },
  {
    id: '11',
    name: 'أحد أساطير الحب 📜',
    price: 20000,
    icon: '📜',
    category: 'رائج',
    badge: 'رائج',
    hasSound: true,
    hasGlobalBroadcast: true
  },
  {
    id: '12',
    name: 'القصر الكريستالي 🏰',
    price: 999900,
    icon: '🏰',
    category: 'رائج',
    badge: 'رائج',
    hasSound: true,
    hasGlobalBroadcast: true
  },
  {
    id: '13',
    name: 'السيارة الذهبية الفارهة 🚘',
    price: 150000,
    icon: '🏎️',
    category: 'رائج',
    badge: 'رائج',
    hasSound: true,
    hasGlobalBroadcast: true
  },
  {
    id: '14',
    name: 'زجاجة العطور الفاخرة 🍾',
    price: 1777,
    icon: '🍾',
    category: 'رائج',
    hasSound: true,
    hasGlobalBroadcast: false
  },
  {
    id: '15',
    name: 'ملك العرش 👑',
    price: 77777,
    icon: '🤴',
    category: 'رائج',
    badge: 'رائج',
    hasSound: true,
    hasGlobalBroadcast: true
  },
  {
    id: '16',
    name: 'البطة السعيدة 🐥',
    price: 300,
    icon: '🐥',
    category: 'رائج',
    hasSound: true
  },

  // 3. استرداد / Lucky (Lucky Gifts & Jackpots)
  {
    id: '17',
    name: 'البطيخة السعيدة 🍉',
    price: 2000,
    icon: '🍉',
    category: 'استرداد',
    badge: 'حظ',
    isLucky: true
  },
  {
    id: '18',
    name: 'الآيس كريم المثلج 🍦',
    price: 400,
    icon: '🍦',
    category: 'استرداد',
    badge: 'حظ',
    isLucky: true
  },
  {
    id: '19',
    name: 'السيارة الذهب الأسطورية 🏎️',
    price: 10000,
    icon: '🏎️',
    category: 'استردad' as any,
    badge: 'حظ',
    isLucky: true
  },
  {
    id: '20',
    name: 'حقيبة الأموال 💰',
    price: 5000,
    icon: '💰',
    category: 'استرداد',
    badge: 'حظ',
    isLucky: true
  },
  {
    id: '21',
    name: 'أجراس الحظ الذهبية 🔔',
    price: 800,
    icon: '🔔',
    category: 'استرداد',
    badge: 'JACKPOT',
    isLucky: true
  },
  {
    id: '22',
    name: 'صندوق الكنز السحري 📦',
    price: 24000,
    icon: '📦',
    category: 'استرداد',
    badge: 'JACKPOT',
    isLucky: true
  },
  {
    id: '23',
    name: 'الكرة البلورية الأسطورية 🔮',
    price: 4000,
    icon: '🔮',
    category: 'استرداد',
    badge: 'JACKPOT',
    isLucky: true
  },
  {
    id: '24',
    name: 'نجمة الجاكبوت ⭐️',
    price: 400,
    icon: '⭐️',
    category: 'استرداد',
    badge: 'JACKPOT',
    isLucky: true
  },

  // 4. الدولة / المنطقة (Country Flags)
  {
    id: '25',
    name: 'علم دولة قطر 🇶🇦',
    price: 20000,
    icon: '🇶🇦',
    category: 'الدولة/المنطقة',
    hasSound: true,
    hasGlobalBroadcast: true
  },
  {
    id: '26',
    name: 'علم المملكة العربية السعودية 🇸🇦',
    price: 20000,
    icon: '🇸🇦',
    category: 'الدولة/المنطقة',
    hasSound: true,
    hasGlobalBroadcast: true
  },
  {
    id: '27',
    name: 'علم سلطنة عمان 🇴🇲',
    price: 20000,
    icon: '🇴🇲',
    category: 'الدولة/المنطقة',
    hasSound: true,
    hasGlobalBroadcast: true
  },
  {
    id: '28',
    name: 'بوابة الشمس الأسطورية ☀️',
    price: 2000000,
    icon: '🪐',
    category: 'الدولة/المنطقة',
    hasSound: true,
    hasGlobalBroadcast: true
  },
  {
    id: '29',
    name: 'علم دولة الإمارات 🇦🇪',
    price: 20000,
    icon: '🇦🇪',
    category: 'الدولة/المنطقة',
    hasSound: true,
    hasGlobalBroadcast: true
  },
  {
    id: '30',
    name: 'علم الجمهورية اللبنانية 🇱🇧',
    price: 20000,
    icon: '🇱🇧',
    category: 'الدولة/المنطقة',
    hasSound: true,
    hasGlobalBroadcast: true
  },
  {
    id: '31',
    name: 'علم الجمهورية العربية السورية 🇸🇾',
    price: 20000,
    icon: '🇸🇾',
    category: 'الدولة/المنطقة',
    hasSound: true,
    hasGlobalBroadcast: true
  },
  {
    id: '32',
    name: 'علم جمهورية مصر العربية 🇪🇬',
    price: 20000,
    icon: '🇪🇬',
    category: 'الدولة/المنطقة',
    hasSound: true,
    hasGlobalBroadcast: true
  },

  // 5. مخصصة (Custom Frames / Cards)
  {
    id: '33',
    name: 'اقهريهم 💃',
    price: 20000,
    icon: '💃',
    category: 'مخصصة',
    badge: 'Top3',
    hasSound: true,
    hasGlobalBroadcast: true
  },
  {
    id: '34',
    name: 'سوري وكيان 💑',
    price: 20000,
    icon: '💑',
    category: 'مخصصة',
    badge: 'Top2',
    hasSound: true,
    hasGlobalBroadcast: true
  },
  {
    id: '35',
    name: 'نسيم ونورة 👑',
    price: 20000,
    icon: '👑',
    category: 'مخصصة',
    badge: 'Top1',
    hasSound: true,
    hasGlobalBroadcast: true
  },
  {
    id: '36',
    name: 'إحنا دولة 🦁',
    price: 20000,
    icon: '🦁',
    category: 'مخصصة',
    badge: 'LV1',
    hasSound: true,
    hasGlobalBroadcast: true
  },
  {
    id: '37',
    name: 'فيرساتشي الذهبي 👑',
    price: 20000,
    icon: '✨',
    category: 'مخصصة',
    badge: 'LV1',
    hasSound: true,
    hasGlobalBroadcast: true
  },

  // 6. مداعبة (Teasing / Fun)
  {
    id: '38',
    name: 'مسدس الماء 🔫',
    price: 100,
    icon: '🔫',
    category: 'مداعبة',
    hasSound: true
  },
  {
    id: '39',
    name: 'المطرقة المضحكة 🔨',
    price: 200,
    icon: '🔨',
    category: 'مداعبة',
    hasSound: true
  },
  {
    id: '40',
    name: 'قنبلة الضحك 💣',
    price: 500,
    icon: '💣',
    category: 'مداعبة',
    hasSound: true
  }
];

export const ProfessionalGiftPanel: React.FC<ProfessionalGiftPanelProps> = ({
  isOpen,
  onClose,
  userCoins = 353,
  onOpenRecharge,
  onSendGift,
  seats = []
}) => {
  const [selectedTab, setSelectedTab] = useState<CategoryType>('الفعالية');
  const [selectedSubTab, setSelectedSubTab] = useState<string>('الكل');
  // Default selected gift is position 0 (index 0) in 'الفعالية'
  const firstEventGift = GIFTS_DATABASE.find((g) => g.category === 'الفعالية') || GIFTS_DATABASE[0];
  const [selectedGift, setSelectedGift] = useState<GiftItem>(firstEventGift);
  const [giftQuantity, setGiftQuantity] = useState<number>(1);
  const [showQuantityMenu, setShowQuantityMenu] = useState<boolean>(false);
  const [customQuantity, setCustomQuantity] = useState<string>('');
  const [showCustomQtyInput, setShowCustomQtyInput] = useState<boolean>(false);
  
  // Recipient Seat Selection state
  const [selectedSeatIds, setSelectedSeatIds] = useState<number[]>([1]); // Default Seat 1
  const [broadcastNotice, setBroadcastNotice] = useState<string | null>(null);

  const [showSuccessCheck, setShowSuccessCheck] = useState<boolean>(false);
  const [totalSentCount, setTotalSentCount] = useState<number>(0);
  const [localCoins, setLocalCoins] = useState<number>(userCoins);
  const [flyingParticles, setFlyingParticles] = useState<
    Array<{ id: number; delay: number; xOffset: number; xTarget: number; scale: number }>
  >([]);

  useEffect(() => {
    setLocalCoins(userCoins);
  }, [userCoins]);

  // Reset combo counter, gift quantity, tab & default gift to position 0 of 'الفعالية' whenever panel closes
  useEffect(() => {
    if (!isOpen) {
      setTotalSentCount(0);
      setShowSuccessCheck(false);
      setFlyingParticles([]);
      setGiftQuantity(1);
      setShowQuantityMenu(false);
      setShowCustomQtyInput(false);
      setSelectedTab('الفعالية');
      setSelectedSubTab('الكل');
      const defaultFirstGift = GIFTS_DATABASE.find((g) => g.category === 'الفعالية') || GIFTS_DATABASE[0];
      if (defaultFirstGift) {
        setSelectedGift(defaultFirstGift);
      }
    }
  }, [isOpen]);

  const handleClose = () => {
    setTotalSentCount(0);
    setFlyingParticles([]);
    setShowSuccessCheck(false);
    setGiftQuantity(1);
    setShowQuantityMenu(false);
    setShowCustomQtyInput(false);
    setSelectedTab('الفعالية');
    setSelectedSubTab('الكل');
    const defaultFirstGift = GIFTS_DATABASE.find((g) => g.category === 'الفعالية') || GIFTS_DATABASE[0];
    if (defaultFirstGift) {
      setSelectedGift(defaultFirstGift);
    }
    onClose();
  };

  // Sync Scrolling Refs
  const tabsContainerRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const giftsScrollContainerRef = useRef<HTMLDivElement | null>(null);
  const pageRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const isManualScrollRef = useRef<boolean>(false);

  // Auto-scroll active tab into view and scroll gifts page on tab selection
  useEffect(() => {
    if (!isOpen) return;

    // Smoothly scroll active tab button to center of tab bar without page jump
    const activeTabBtn = tabRefs.current[selectedTab];
    const tabsContainer = tabsContainerRef.current;
    if (activeTabBtn && tabsContainer) {
      const btnOffset = activeTabBtn.offsetLeft;
      const btnWidth = activeTabBtn.offsetWidth;
      const containerWidth = tabsContainer.offsetWidth;
      const targetScroll = btnOffset - containerWidth / 2 + btnWidth / 2;
      tabsContainer.scrollTo({
        left: targetScroll,
        behavior: 'smooth',
      });
    }

    // If tab was clicked manually, scroll the gifts container to the target page smoothly
    if (isManualScrollRef.current) {
      const activePageEl = pageRefs.current[selectedTab];
      const giftsContainer = giftsScrollContainerRef.current;
      if (activePageEl && giftsContainer) {
        giftsContainer.scrollTo({
          left: activePageEl.offsetLeft,
          behavior: 'smooth',
        });
      }
      const timer = setTimeout(() => {
        isManualScrollRef.current = false;
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [selectedTab, isOpen]);

  // Handle horizontal scrolling inside the gifts panel to sync top tab bar
  const handleGiftsScroll = () => {
    if (isManualScrollRef.current || !giftsScrollContainerRef.current) return;
    const container = giftsScrollContainerRef.current;
    const containerWidth = container.clientWidth;
    if (!containerWidth) return;

    // Determine current visible page index based on scroll position
    const scrollLeft = Math.abs(container.scrollLeft);
    const pageIndex = Math.min(
      GIFT_CATEGORIES.length - 1,
      Math.max(0, Math.round(scrollLeft / containerWidth))
    );
    const currentCategory = GIFT_CATEGORIES[pageIndex];
    if (currentCategory && currentCategory !== selectedTab) {
      setSelectedTab(currentCategory);
      setSelectedSubTab('الكل');
    }
  };

  if (!isOpen) return null;

  // Filter gifts logic
  const filteredGifts = GIFTS_DATABASE.filter((gift) => {
    if (selectedTab === 'الكل') return true;
    if (gift.category !== selectedTab) return false;
    if (selectedSubTab !== 'الكل' && gift.subCategory) {
      return gift.subCategory === selectedSubTab;
    }
    return true;
  });

  const totalCost = selectedGift.price * giftQuantity * selectedSeatIds.length;

  const toggleSeatSelection = (seatId: number) => {
    if (selectedSeatIds.includes(seatId)) {
      if (selectedSeatIds.length > 1) {
        setSelectedSeatIds(selectedSeatIds.filter((id) => id !== seatId));
      }
    } else {
      setSelectedSeatIds([...selectedSeatIds, seatId]);
    }
  };

  const selectAllSeats = () => {
    const allSeatIds = seats.map((s) => s.id);
    if (selectedSeatIds.length === allSeatIds.length) {
      setSelectedSeatIds([1]); // default back to 1
    } else {
      setSelectedSeatIds(allSeatIds);
    }
  };

  const handleSend = () => {
    if (localCoins < totalCost) {
      setBroadcastNotice('⚠️ رصيدك لا يكفي! يرجى إعادة الشحن');
      setTimeout(() => setBroadcastNotice(null), 3000);
      return;
    }

    // Programmatically update local coins immediately without reloading interface
    setLocalCoins((prev) => Math.max(0, prev - totalCost));

    const targetNames =
      selectedSeatIds.length === seats.length
        ? 'جميع الحضور'
        : selectedSeatIds.map((id) => `مقعد ${id}`).join(', ');

    if (onSendGift) {
      onSendGift(selectedGift, giftQuantity, targetNames);
    }

    // Spawn a stream of golden lightning icons matching giftQuantity (1:1 exact count)
    const streamCount = Math.min(100, Math.max(1, giftQuantity));
    const now = Date.now();
    const delayStep = streamCount > 25 ? 0.03 : 0.05;
    const newParticles = Array.from({ length: streamCount }, (_, i) => ({
      id: now + Math.random() + i,
      delay: i * delayStep, // staggered sequential stream delay
      xOffset: (Math.random() - 0.5) * 26,
      xTarget: (Math.random() - 0.5) * 20,
      scale: 0.85 + Math.random() * 0.35,
    }));

    setFlyingParticles((prev) => [...prev, ...newParticles]);
    const totalDurationMs = Math.ceil((streamCount * delayStep + 1.8) * 1000);
    setTimeout(() => {
      setFlyingParticles((prev) => prev.filter((p) => !newParticles.some((np) => np.id === p.id)));
    }, totalDurationMs);

    // Immediate visual feedback inside panel without closing
    setShowSuccessCheck(true);
    setTotalSentCount((prev) => prev + giftQuantity);

    setBroadcastNotice(
      `🎉 تم إرسال (${selectedGift.name}) x${giftQuantity} بنجاح إلى ${targetNames}!`
    );

    setTimeout(() => {
      setShowSuccessCheck(false);
    }, 1200);

    setTimeout(() => {
      setBroadcastNotice(null);
    }, 2500);
  };

  const handleApplyCustomQty = () => {
    const parsed = parseInt(customQuantity, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setGiftQuantity(parsed);
    }
    setShowCustomQtyInput(false);
    setShowQuantityMenu(false);
  };

  return (
    <AnimatePresence>
      <div 
        onClick={(e) => {
          if (e.target === e.currentTarget) handleClose();
        }}
        className="fixed inset-0 z-50 bg-transparent flex items-end justify-center dir-rtl select-none"
      >
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="w-full max-w-md flex flex-col items-stretch gap-1.5 px-2 pb-0 sm:px-0 relative pointer-events-none"
        >
          {/* Standalone Independent Container Box for Global Broadcast Banner (Above Level Bar & Close X) */}
          <AnimatePresence>
            {Boolean(selectedGift?.hasGlobalBroadcast && selectedGift.price >= 20000) && (
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.95, height: 0 }}
                animate={{ opacity: 1, y: 0, scale: 1, height: 'auto' }}
                exit={{ opacity: 0, y: 12, scale: 0.95, height: 0 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden pointer-events-auto shrink-0 z-30"
              >
                <div className="w-full flex items-center justify-between bg-gradient-to-r from-cyan-950/95 via-[#0A1329]/95 to-cyan-950/95 backdrop-blur-xl border border-cyan-400/50 rounded-2xl px-3.5 py-2 text-[10px] text-cyan-200 shadow-[0_4px_25px_rgba(6,182,212,0.3)]">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-cyan-400 animate-spin-slow shrink-0" />
                    <span className="font-bold tracking-wide">سيؤدي إرسال هذه الهدية إلى تشغيل إشعار عالمي</span>
                  </div>
                  <span className="text-amber-300 font-extrabold text-[9px] bg-amber-400/20 px-2 py-0.5 rounded-full border border-amber-400/40 shadow-xs shrink-0">
                    إشعار عام 🌐
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Gift Panel Card */}
          <div className="w-full pointer-events-auto bg-[#0A0E1A]/80 backdrop-blur-xl border-t border-cyan-500/40 border-x border-white/10 rounded-t-3xl text-white shadow-[0_-10px_30px_rgba(0,0,0,0.5)] flex flex-col justify-between max-h-[52vh] sm:max-h-[50vh] overflow-hidden relative">
            {/* Flying Golden Tiny Lightning Stream Animation (Bottom Combo Lightning Source -> Top User Level Icon) */}
            <AnimatePresence>
              {flyingParticles.map((particle) => (
                <motion.div
                  key={particle.id}
                  initial={{ opacity: 0, y: 0, x: particle.xOffset, scale: particle.scale * 0.7 }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    y: -360 - Math.random() * 15,
                    x: [particle.xOffset, particle.xOffset + particle.xTarget, 0],
                    scale: [particle.scale * 0.7, particle.scale * 1.35, particle.scale * 0.3],
                  }}
                  transition={{
                    duration: 1.25, // +500ms slower for smooth fluid motion
                    delay: particle.delay,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="absolute bottom-6 left-10 z-50 pointer-events-none flex items-center justify-center"
                >
                  <div className="p-1 rounded-full bg-amber-400/25 drop-shadow-[0_0_12px_rgba(251,191,36,0.95)]">
                    <Zap className="w-4.5 h-4.5 text-amber-300 fill-amber-300 stroke-amber-400 stroke-[2.5]" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* ================= 1. TOP EXP BAR & NOTIFICATION SECTION ================= */}
          <div className="bg-[#070A14]/90 backdrop-blur-md border-b border-white/5 px-2.5 py-1 shrink-0">
            {/* EXP / Level Progress Row with Integrated Dynamic Golden Progress Bar */}
            {(() => {
              const expGained = selectedGift ? selectedGift.price * giftQuantity * selectedSeatIds.length : 0;
              const baseRemainingEXP = 401516;
              const remainingExp = Math.max(0, baseRemainingEXP - expGained);
              const progressPercent = Math.min(100, Math.max(15, ((1254756 - remainingExp) / 1254756) * 100));

              return (
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-300">
                  {/* Current Level 113 */}
                  <span className="bg-gradient-to-r from-pink-600 to-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shrink-0 shadow-xs flex items-center gap-0.5 border border-pink-400/30">
                    113 👑
                  </span>

                  {/* Stretched Golden Slim Progress Bar & Dynamic EXP Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center gap-0.5 px-0.5">
                    <div className="flex items-center justify-between text-[8px] text-slate-400 font-mono leading-none">
                      <span className="truncate text-amber-300 font-semibold">
                        إضافة {expGained.toLocaleString()} نقطة خبرة
                      </span>
                      <span className="truncate text-slate-400 mr-1">
                        {remainingExp.toLocaleString()} قبل رفع المستوى
                      </span>
                    </div>
                    {/* Slim Golden Bar */}
                    <div className="w-full h-1.5 bg-slate-900/90 rounded-full overflow-hidden border border-amber-500/30 p-[0.5px] shadow-inner relative">
                      <div
                        className="h-full bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-300 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.7)] transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Next Level 114 */}
                  <span className="bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded-full shrink-0 shadow-xs flex items-center gap-0.5 border border-amber-400/40">
                    114 👑
                  </span>

                  {/* Close Button X */}
                  <button
                    onClick={handleClose}
                    className="p-0.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0 mr-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })()}
          </div>

          {/* ================= 2. RECIPIENT SEAT MIC SELECTOR BAR ================= */}
          <div className="bg-[#0B1220]/70 backdrop-blur-md px-2 py-1 border-b border-white/5 flex items-center justify-between shrink-0">
            <button
              onClick={selectAllSeats}
              className="p-1 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="تحديد الكل"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {/* Seat avatars row (Scaled down for compact precision) */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {(seats.length > 0
                ? seats
                : Array.from({ length: 7 }, (_, i) => ({
                    id: i + 1,
                    userName: `المستخدم ${i + 1}`,
                    avatar: `https://images.unsplash.com/photo-${1534528741775 + i}?w=80&h=80&fit=crop&crop=faces`,
                    isEmpty: false
                  }))
              ).map((seat) => {
                const isSelected = selectedSeatIds.includes(seat.id);
                return (
                  <button
                    key={seat.id}
                    onClick={() => toggleSeatSelection(seat.id)}
                    className="relative shrink-0 flex flex-col items-center cursor-pointer group"
                  >
                    <div
                      className={`relative w-7 h-7 rounded-full transition-all duration-200 ${
                        isSelected
                          ? 'ring-2 ring-emerald-400 ring-offset-1 ring-offset-[#0B1220] scale-105'
                          : 'opacity-70 group-hover:opacity-100'
                      }`}
                    >
                      <img
                        src={seat.avatar}
                        alt={seat.userName}
                        className="w-full h-full rounded-full object-cover"
                      />
                      <span className="absolute -bottom-0.5 -right-0.5 bg-emerald-500 text-slate-950 font-black text-[7px] w-3 h-3 rounded-full flex items-center justify-center border border-slate-950">
                        {seat.id}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ================= 3. MAIN CATEGORY TABS (Sync Scrolling Enabled) ================= */}
          <div className="bg-[#080D18]/70 backdrop-blur-md border-b border-white/5 px-1.5 pt-1 shrink-0 space-y-0.5">
            <div 
              ref={tabsContainerRef}
              className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-0.5 text-[10px] scroll-smooth"
            >
              {GIFT_CATEGORIES.map((cat) => {
                const isActive = selectedTab === cat;
                return (
                  <button
                    key={cat}
                    ref={(el) => { tabRefs.current[cat] = el; }}
                    onClick={() => {
                      isManualScrollRef.current = true;
                      setSelectedTab(cat);
                      setSelectedSubTab('الكل');
                    }}
                    className={`px-2 py-0.5 rounded-lg font-black whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-400 to-cyan-500 text-slate-950 shadow-xs scale-102'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Sub-categories bar (Compact) */}
            {selectedTab === 'الفعالية' && (
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1 text-[9px]">
                {['الكل', 'حدث برج الاسد', 'النمط الاسبوعي', 'رحلة رومانسية'].map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubTab(sub)}
                    className={`px-2 py-0.5 rounded-md font-bold whitespace-nowrap transition-all cursor-pointer ${
                      selectedSubTab === sub
                        ? 'bg-white/15 text-amber-300 border border-amber-400/30'
                        : 'bg-white/5 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ================= 4. SPECIAL LUCKY JACKPOT BANNER ================= */}
          {selectedTab === 'استرداد' && (
            <div className="mx-2 mt-1 bg-gradient-to-r from-amber-700 via-yellow-600 to-amber-800 rounded-xl p-1.5 text-center border border-amber-300/40 shadow-md relative overflow-hidden shrink-0">
              <div className="relative z-10 flex items-center justify-between">
                <div className="text-right">
                  <h3 className="text-[10px] font-black text-amber-200 uppercase tracking-wider flex items-center gap-0.5">
                    <Sparkles className="w-3 h-3 text-yellow-300" /> LUCKY GIFT
                  </h3>
                  <p className="text-[9px] font-bold text-white">جاكبوت 1000000 لفائز واحد!</p>
                </div>
                <div className="flex items-center gap-1.5 text-[9px] font-mono font-bold bg-slate-950/60 px-2 py-1 rounded-lg border border-amber-400/30">
                  <span className="text-amber-400 text-[8px]">JACKPOT</span>
                  <span className="text-emerald-400 text-[10px] font-black">1,722,354 💎</span>
                </div>
              </div>
            </div>
          )}

          {/* Toast / Broadcast Alert */}
          <AnimatePresence>
            {broadcastNotice && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mx-2 my-1 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 text-[10px] font-black p-1.5 rounded-lg text-center shadow-md"
              >
                {broadcastNotice}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ================= 5. GIFTS GRID (Synchronized Horizontal Paged Carousel) ================= */}
          <div
            ref={giftsScrollContainerRef}
            onScroll={handleGiftsScroll}
            className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar flex-1 min-h-[160px] max-h-[220px] scroll-smooth"
          >
            {GIFT_CATEGORIES.map((cat) => {
              const catGifts = GIFTS_DATABASE.filter((gift) => {
                if (cat === 'الكل') return true;
                if (gift.category !== cat) return false;
                if (cat === 'الفعالية' && selectedSubTab !== 'الكل' && gift.subCategory) {
                  return gift.subCategory === selectedSubTab;
                }
                return true;
              });

              return (
                <div
                  key={cat}
                  ref={(el) => { pageRefs.current[cat] = el; }}
                  className="w-full shrink-0 snap-center p-2 overflow-y-auto no-scrollbar"
                >
                  <div className="grid grid-cols-4 gap-1.5">
                    {catGifts.map((gift) => {
                      const isSelected = selectedGift.id === gift.id;

                      return (
                        <div
                          key={gift.id}
                          onClick={() => setSelectedGift(gift)}
                          className={`relative rounded-xl p-1.5 flex flex-col items-center justify-between text-center transition-all cursor-pointer group min-h-[75px] ${
                            isSelected
                              ? 'bg-[#102232] border-2 border-emerald-400 shadow-md shadow-emerald-500/20 scale-[1.02]'
                              : 'bg-[#111726] border border-white/5 hover:bg-[#162034] hover:border-cyan-400/40'
                          }`}
                        >
                          {/* Top Left Badge */}
                          {gift.badge && (
                            <span className="absolute top-0.5 left-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-[7px] font-black px-1 py-0.1 rounded-md shadow-xs z-10">
                              {gift.badge}
                            </span>
                          )}

                          {/* Top Right Icons */}
                          <div className="absolute top-0.5 right-0.5 flex items-center gap-0.5 z-10">
                            {gift.hasGlobalBroadcast && gift.price >= 20000 && (
                              <span className="w-3 h-3 rounded-full bg-pink-500/80 text-white flex items-center justify-center text-[6px]" title="إشعار عالمي">
                                🌐
                              </span>
                            )}
                            {gift.hasSound && (
                              <span className="w-3 h-3 rounded-full bg-cyan-500/80 text-slate-950 flex items-center justify-center text-[6px]" title="مؤثر صوتي">
                                🎵
                              </span>
                            )}
                          </div>

                          {/* Gift Graphic / Icon */}
                          <div className="my-auto py-0.5 text-2xl group-hover:scale-110 transition-transform duration-200 drop-shadow-xs">
                            {gift.icon}
                          </div>

                          {/* Gift Price in Coins */}
                          <div className="mt-auto flex items-center justify-center gap-0.5 w-full pt-0.5">
                            <span className="text-amber-400 text-[9px]">🪙</span>
                            <span className="text-[10px] font-mono font-black text-amber-300">
                              {gift.price.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ================= 6. FOOTER CONTROL BAR (Static/Sticky Layer) ================= */}
          <div className="bg-[#070B14]/90 backdrop-blur-md p-2 border-t border-white/10 shrink-0 sticky bottom-0 z-30 relative">
            {/* Multiplier / Quantity Dropup Popover */}
            <AnimatePresence>
              {showQuantityMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute bottom-12 right-2 w-32 bg-[#131A2A] border border-cyan-400/40 rounded-xl shadow-2xl p-1 z-50 space-y-0.5"
                >
                  <button
                    onClick={() => setShowCustomQtyInput(!showCustomQtyInput)}
                    className="w-full text-center py-1 px-2 rounded-lg text-[10px] font-black bg-white/10 text-cyan-300 hover:bg-cyan-500/20 transition-colors"
                  >
                    آخر (تخصيص)
                  </button>

                  {showCustomQtyInput && (
                    <div className="p-1 bg-slate-900 rounded-lg space-y-1">
                      <input
                        type="number"
                        placeholder="أدخل العدد..."
                        value={customQuantity}
                        onChange={(e) => setCustomQuantity(e.target.value)}
                        className="w-full bg-slate-800 text-white text-[10px] p-1 rounded-md text-center font-mono font-bold focus:outline-hidden focus:ring-1 focus:ring-cyan-400"
                      />
                      <button
                        onClick={handleApplyCustomQty}
                        className="w-full bg-emerald-500 text-slate-950 font-black text-[9px] py-0.5 rounded-md"
                      >
                        تأكيد
                      </button>
                    </div>
                  )}

                  {MULTIPLIERS.map((qty) => (
                    <button
                      key={qty}
                      onClick={() => {
                        setGiftQuantity(qty);
                        setShowQuantityMenu(false);
                      }}
                      className={`w-full text-center py-1 rounded-lg text-[10px] font-mono font-black transition-colors ${
                        giftQuantity === qty
                          ? 'bg-gradient-to-r from-emerald-400 to-cyan-500 text-slate-950'
                          : 'text-slate-200 hover:bg-white/10'
                      }`}
                    >
                      {qty}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between gap-2">
              {/* Left Side: Combined Cyan Send Button + Quantity Dropup Pill + Visual Feedback */}
              <div className="flex items-center gap-1 relative">
                {/* Instant Visual Feedback Floating Badge */}
                <AnimatePresence>
                  {showSuccessCheck && (
                    <motion.div
                      initial={{ opacity: 0, y: 5, scale: 0.8 }}
                      animate={{ opacity: 1, y: -24, scale: 1 }}
                      exit={{ opacity: 0, y: -32, scale: 0.8 }}
                      className="absolute -top-1 left-3 bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-full shadow-lg border border-white/20 flex items-center gap-1 z-20 pointer-events-none whitespace-nowrap"
                    >
                      <Sparkles className="w-2.5 h-2.5 text-amber-900" />
                      <span>تم الإرسال x{giftQuantity}!</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  onClick={handleSend}
                  className={`font-black text-xs px-5 py-1.5 rounded-full shadow-md transition-all flex items-center gap-1.5 cursor-pointer relative overflow-hidden ${
                    showSuccessCheck
                      ? 'bg-gradient-to-r from-emerald-300 via-green-400 to-emerald-400 text-slate-950 scale-105 shadow-emerald-500/40 ring-2 ring-emerald-300'
                      : 'bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500 text-slate-950 shadow-cyan-500/20 hover:brightness-110 active:scale-95'
                  }`}
                >
                  {showSuccessCheck ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-slate-950 stroke-[3] animate-bounce" />
                      <span>تم الإرسال!</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 fill-slate-950 rotate-180" />
                      <span>إرسال</span>
                    </>
                  )}
                </button>

                {/* Quantity Select Pill button (e.g. 1 ^) */}
                <button
                  onClick={() => setShowQuantityMenu(!showQuantityMenu)}
                  className="bg-[#151D2E] hover:bg-[#1E293B] border border-cyan-400/40 text-cyan-300 font-mono font-black text-[11px] px-2.5 py-1.5 rounded-full flex items-center gap-1 transition-all cursor-pointer"
                >
                  <span>{giftQuantity}</span>
                  <ChevronDown className="w-3 h-3 text-cyan-400" />
                </button>

                {/* Session total sent count badge if gifts sent */}
                {totalSentCount > 0 && (
                  <span className="text-[9px] font-mono text-emerald-300 font-black bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30 shadow-xs flex items-center gap-1" title="إجمالي الهدايا المرسلة في الجلسة">
                    <Zap className="w-2.5 h-2.5 text-amber-300 fill-amber-300 animate-pulse" />
                    <span>{totalSentCount}</span>
                  </span>
                )}
              </div>

              {/* Center: Bonuses / علاوات Chest Button */}
              <button
                onClick={() => {
                  setBroadcastNotice('🎁 تم فتح مكافأة اليوم: +500 قطعة ذهبية!');
                  setTimeout(() => setBroadcastNotice(null), 3000);
                }}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[10px] font-black px-2.5 py-1.5 rounded-xl shadow-xs hover:scale-105 transition-all flex items-center gap-1 cursor-pointer"
              >
                <span>🧰</span>
                <span>علاوات</span>
              </button>

              {/* Right Side: Coin Balance & Recharge Trigger */}
              <div
                onClick={onOpenRecharge}
                className="flex items-center gap-1 bg-[#121A2C] border border-amber-400/40 px-2.5 py-1 rounded-full cursor-pointer hover:bg-amber-500/10 transition-colors"
              >
                <span className="text-amber-400 text-xs">🪙</span>
                <span className="font-mono font-black text-white text-[10px]">
                  {localCoins.toLocaleString()}
                </span>
                <span className="text-amber-400 text-[10px] font-bold">‹</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
    </AnimatePresence>
  );
};
