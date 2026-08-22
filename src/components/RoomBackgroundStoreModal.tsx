import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Palette,
  Sparkles,
  Check,
  Crown,
  Gift,
  ShoppingBag,
  Lock,
  Zap,
  Star,
  Flame,
  CheckCircle2,
  SlidersHorizontal,
  Coins,
  CloudCheck,
  ShieldCheck
} from 'lucide-react';
import { saveRoomThemeAndWallpaperToFirestore } from '../lib/roomThemeFirestoreService';
import { MainRoomCustomizerConfig } from '../types/roomCustomizer';

export interface RoomBackgroundItem {
  id: string;
  name: string;
  category: 'gifts_store' | 'royal' | 'animated' | 'vip';
  imageUrl: string;
  isUnlocked: boolean;
  unlockedVia: 'gift' | 'store' | 'default' | 'none';
  priceCoins?: number;
  giftRequirement?: string;
  tag: string;
}

interface RoomBackgroundStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeBackgroundUrl?: string;
  onSelectBackground?: (bgUrl: string, bgName: string) => void;
  isUnlockedViaGiftOrStore?: boolean;
  roomId?: string;
  isOwner?: boolean;
  ownerId?: string;
  ownerName?: string;
  roomTitle?: string;
  themeConfig?: MainRoomCustomizerConfig;
}

export const ROOM_BACKGROUNDS: RoomBackgroundItem[] = [
  {
    id: 'bg-royal-palace',
    name: 'القصر الملكي البنفسجي 🏰',
    category: 'royal',
    imageUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=1200',
    isUnlocked: true,
    unlockedVia: 'default',
    tag: 'المجهزة حالياً',
  },
  {
    id: 'bg-cosmic-galaxy',
    name: 'المجرة الكونية الذهبية 🌌',
    category: 'gifts_store',
    imageUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&q=80&w=1200',
    isUnlocked: true,
    unlockedVia: 'gift',
    giftRequirement: 'دعم هدايا الغرفة 5,000 قطعة',
    tag: 'مفتوحة بدعم الهدايا 🎁',
  },
  {
    id: 'bg-emerald-falls',
    name: 'شلالات الزمرد الساحرة 🌊',
    category: 'gifts_store',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1200',
    isUnlocked: true,
    unlockedVia: 'store',
    priceCoins: 1200,
    tag: 'تم الشراء من المتجر 🛒',
  },
  {
    id: 'bg-legend-throne',
    name: 'عرش الأساطير الذهبي 👑',
    category: 'royal',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=1200',
    isUnlocked: true,
    unlockedVia: 'gift',
    giftRequirement: 'مستوى الغرفة VIP 10',
    tag: 'مكافأة هدايا الغرفة 🎁',
  },
  {
    id: 'bg-neon-cyberpunk',
    name: 'سديم النجوم النيون 🎆',
    category: 'animated',
    imageUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1200',
    isUnlocked: true,
    unlockedVia: 'store',
    priceCoins: 2500,
    tag: 'متحركة 3D 🔮',
  },
  {
    id: 'bg-dubai-nights',
    name: 'ليالي دبي البرّاقة 🏙️',
    category: 'gifts_store',
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=1200',
    isUnlocked: true,
    unlockedVia: 'gift',
    giftRequirement: 'دعم هدايا الروم 10,000 كوينز',
    tag: 'متجر الهدايا 💎',
  },
];

export const RoomBackgroundStoreModal: React.FC<RoomBackgroundStoreModalProps> = ({
  isOpen,
  onClose,
  activeBackgroundUrl = 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=1200',
  onSelectBackground,
  isUnlockedViaGiftOrStore = true,
  roomId = '884920',
  isOwner = true,
  ownerId = '88492011',
  ownerName = 'أميرة الشرق',
  roomTitle = 'روم السهرة والنغم 🎵',
  themeConfig
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'gifts_store' | 'royal' | 'animated'>('gifts_store');
  const [selectedBgId, setSelectedBgId] = useState<string>('bg-royal-palace');
  const [equippedBgId, setEquippedBgId] = useState<string>('bg-royal-palace');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isSavingToCloud, setIsSavingToCloud] = useState<boolean>(false);

  const backgroundList = ROOM_BACKGROUNDS.map((bg) =>
    bg.id === 'bg-neon-cyberpunk' ? { ...bg, isUnlocked: isUnlockedViaGiftOrStore } : bg
  );

  useEffect(() => {
    if (activeBackgroundUrl) {
      const match = backgroundList.find((b) => b.imageUrl === activeBackgroundUrl);
      if (match) {
        setEquippedBgId(match.id);
        setSelectedBgId(match.id);
      }
    }
  }, [activeBackgroundUrl]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3200);
  };

  const filteredBgs = backgroundList.filter((bg) => {
    if (activeTab === 'all') return true;
    return bg.category === activeTab;
  });

  const selectedBg = backgroundList.find((b) => b.id === selectedBgId) || backgroundList[0];

  const handleApplyBackground = async (bg: RoomBackgroundItem) => {
    if (!bg.isUnlocked) {
      showToast('هذه الخلفية تتطلب الشراء من المتجر أو الفتح عبر الهدايا 🔒');
      return;
    }

    if (!isOwner) {
      showToast('عذراً، صلاحية تغيير وحفظ خلفية الغرفة الصوتية مخصصة حصرياً لصاحب الغرفة (المالك) فقط 👑');
      return;
    }

    setIsSavingToCloud(true);
    setEquippedBgId(bg.id);
    onSelectBackground?.(bg.imageUrl, bg.name);

    try {
      const res = await saveRoomThemeAndWallpaperToFirestore({
        roomId,
        isOwner: true,
        ownerId,
        ownerName,
        roomTitle,
        wallpaperUrl: bg.imageUrl,
        wallpaperName: bg.name,
        themeConfig
      });

      if (res.success) {
        showToast(`تم حفظ وتطبيق خلفية "${bg.name}" في قاعدة بيانات الروم [${roomId}] بنجاح ☁️👑`);
      } else {
        showToast(res.error || `تم تطبيق الخلفية محلياً`);
      }
    } catch (e) {
      showToast(`تم تطبيق خلفية "${bg.name}" بنجاح 🎨`);
    } finally {
      setIsSavingToCloud(false);
    }
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 pointer-events-auto select-none dir-rtl"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg bg-[#0F1420] border border-purple-500/30 rounded-3xl overflow-hidden shadow-2xl text-white relative flex flex-col max-h-[92vh]"
        >
          {/* Header Bar */}
          <div className="relative bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 p-4 border-b border-purple-500/30 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-purple-500/20 border border-purple-400/50 flex items-center justify-center text-purple-300 shadow-md">
                <Palette className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-black text-white">متجر وخلفيات الغرفة 🎨</h2>
                  <span className="bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                    <Crown className="w-3 h-3 fill-slate-950" />
                    <span>صاحب الغرفة فقط</span>
                  </span>
                  <span className="bg-slate-800 text-cyan-300 font-mono text-[9px] px-2 py-0.5 rounded-full border border-cyan-500/30">
                    ID: {roomId}
                  </span>
                </div>
                <p className="text-[11px] text-purple-200/80 font-medium mt-0.5">
                  حفظ وتطبيق خلفية الغرفة يرتبط بـ (room_id: {roomId}) في قاعدة البيانات
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Live Room Preview Card */}
          <div className="p-3 bg-slate-950/80 border-b border-slate-800/80 shrink-0 relative overflow-hidden">
            <div className="relative h-44 rounded-2xl overflow-hidden border border-purple-500/30 shadow-inner group">
              <img
                src={selectedBg.imageUrl || 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&q=80&w=800'}
                alt={selectedBg.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-between p-3">
                {/* Top Badge */}
                <div className="flex items-center justify-between">
                  <span className="bg-black/60 backdrop-blur-md text-purple-300 text-[10px] font-bold px-2.5 py-1 rounded-full border border-purple-400/30 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>معاينة الخلفية المباشرة</span>
                  </span>

                  {selectedBg.id === equippedBgId && (
                    <span className="bg-emerald-500 text-slate-950 font-black text-[10px] px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>مطبقة حالياً</span>
                    </span>
                  )}
                </div>

                {/* Bottom Details & Apply Action */}
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-black text-white">{selectedBg.name}</h3>
                    <p className="text-[10px] text-amber-300 font-bold flex items-center gap-1 mt-0.5">
                      <Gift className="w-3 h-3 text-amber-400" />
                      <span>{selectedBg.tag}</span>
                    </p>
                  </div>

                  <button
                    onClick={() => handleApplyBackground(selectedBg)}
                    className={`px-4 py-2 rounded-xl font-black text-xs transition-all shadow-lg flex items-center gap-1.5 cursor-pointer ${
                      selectedBg.id === equippedBgId
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 hover:from-purple-400 hover:to-indigo-400 text-white shadow-purple-500/30'
                    }`}
                  >
                    <Palette className="w-4 h-4" />
                    <span>{selectedBg.id === equippedBgId ? 'مجهزة' : 'تطبيق للروم'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Categories Tabs */}
          <div className="flex gap-1.5 p-3 border-b border-slate-800 bg-[#121826] overflow-x-auto no-scrollbar shrink-0">
            <button
              onClick={() => setActiveTab('gifts_store')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'gifts_store'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 border border-purple-400/40'
                  : 'bg-slate-800/70 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Gift className="w-3.5 h-3.5 text-amber-400" />
              <span>الهدايا والمشتريات 🎁</span>
            </button>

            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 border border-purple-400/40'
                  : 'bg-slate-800/70 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              الكل
            </button>

            <button
              onClick={() => setActiveTab('royal')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'royal'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 border border-purple-400/40'
                  : 'bg-slate-800/70 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Crown className="w-3.5 h-3.5 text-yellow-400" />
              <span>ملكية فاخرة 👑</span>
            </button>

            <button
              onClick={() => setActiveTab('animated')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'animated'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 border border-purple-400/40'
                  : 'bg-slate-800/70 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>متحركة 3D 🔮</span>
            </button>
          </div>

          {/* Background Wallpapers Grid */}
          <div className="p-3.5 grid grid-cols-2 gap-3 overflow-y-auto max-h-[320px] custom-scrollbar flex-1">
            {filteredBgs.map((bg) => {
              const isSelected = bg.id === selectedBgId;
              const isEquipped = bg.id === equippedBgId;

              return (
                <div
                  key={bg.id}
                  onClick={() => setSelectedBgId(bg.id)}
                  className={`relative rounded-2xl overflow-hidden border-2 cursor-pointer transition-all duration-200 bg-slate-900 flex flex-col justify-between group ${
                    isSelected
                      ? 'border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.4)] scale-[1.02]'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="relative h-28 w-full overflow-hidden">
                    <img
                      src={bg.imageUrl || 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&q=80&w=800'}
                      alt={bg.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Top Status Tag */}
                    <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
                      {isEquipped ? (
                        <span className="bg-emerald-500 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-full shadow-md">
                          مجهزة
                        </span>
                      ) : bg.isUnlocked ? (
                        <span className="bg-purple-600 text-white font-bold text-[9px] px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
                          <Check className="w-3 h-3 text-amber-300" />
                          <span>مفتوحة</span>
                        </span>
                      ) : (
                        <span className="bg-rose-600 text-white font-bold text-[9px] px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
                          <Lock className="w-3 h-3 text-amber-300" />
                          <span>مغلقة</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Title & Info */}
                  <div className="p-2.5 bg-[#141A28] flex flex-col gap-1 border-t border-slate-800">
                    <span className="text-xs font-black text-white truncate">{bg.name}</span>
                    <span className="text-[10px] text-purple-300 font-bold truncate flex items-center gap-1">
                      <Gift className="w-3 h-3 text-amber-400 shrink-0" />
                      <span className="truncate">{bg.tag}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Toast Notice */}
          <AnimatePresence>
            {toastMsg && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 px-4 py-2 rounded-2xl font-black text-xs shadow-2xl z-50 flex items-center gap-2 border border-amber-300"
              >
                <Sparkles className="w-4 h-4 fill-slate-950" />
                <span>{toastMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
