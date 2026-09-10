import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Check,
  Clock,
  Scan,
  Maximize2,
  X,
  Upload,
  Coins,
  Sparkles,
  CheckCircle2,
  Crown
} from 'lucide-react';
import { saveRoomThemeAndWallpaperToFirestore } from '../lib/roomThemeFirestoreService';
import { MainRoomCustomizerConfig } from '../types/roomCustomizer';

export interface RoomWallpaperItem {
  id: string;
  name: string;
  imageUrl: string;
  durationDays?: number;
  priceCoins?: number;
  isPurchased?: boolean;
}

// Available (متاح) Wallpapers matching Screenshot 1 (3-column grid)
export const AVAILABLE_WALLPAPERS: RoomWallpaperItem[] = [
  {
    id: 'avail-1-corridor',
    name: 'الممر الغامض',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'avail-2-gothic-castle',
    name: 'القلعة القوطية الزرقاء',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'avail-3-sky-combat',
    name: 'طيران الكوماندوز الليلي',
    imageUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'avail-4-fire-car',
    name: 'سيارة اللهب الحارقة',
    imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'avail-5-cyber-eyes',
    name: 'محارب السايبر الأزرق',
    imageUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'avail-6-pubg-soldier',
    name: 'بطل المعركة التكتيكي',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'avail-7-wedding-arch',
    name: 'عشاق الحديقة الوردية',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'avail-8-mafia-trench',
    name: 'الرجل الغامض الكلاسيكي',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'avail-9-eagle-suv',
    name: 'نسر الصحراء والدفع الرباعي',
    imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'avail-10-fire-nebula',
    name: 'سديم النار الكوني',
    imageUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'avail-11-blue-sky',
    name: 'السماء الزرقاء الصافية',
    imageUrl: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'avail-12-golden-crown',
    name: 'التاج الملكي الذهبي',
    imageUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'avail-13-dubai-skyline',
    name: 'أبراج دبي المضيئة',
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=800'
  }
];

// Store (متجر) Wallpapers matching Screenshot 2 (2-column grid with price & buy button)
export const STORE_WALLPAPERS: RoomWallpaperItem[] = [
  {
    id: 'store-1-flower-couple',
    name: 'عشاق الورد والقلوب',
    imageUrl: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&q=80&w=800',
    durationDays: 14,
    priceCoins: 30000
  },
  {
    id: 'store-2-bokeh-couple',
    name: 'حب تحت أضواء البوكيه',
    imageUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=800',
    durationDays: 14,
    priceCoins: 30000
  },
  {
    id: 'store-3-dolphin-beach',
    name: 'شاطئ الدلفين الاستوائي',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800',
    durationDays: 14,
    priceCoins: 30000
  },
  {
    id: 'store-4-pineapple-ocean',
    name: 'منزل الأناناس تحت الماء',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800',
    durationDays: 14,
    priceCoins: 30000
  },
  {
    id: 'store-5-golden-palace',
    name: 'عرش الأساطير الملكي',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=800',
    durationDays: 30,
    priceCoins: 50000
  },
  {
    id: 'store-6-neon-city',
    name: 'سديم النيون السايبر',
    imageUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800',
    durationDays: 30,
    priceCoins: 40000
  }
];

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

export const RoomBackgroundStoreModal: React.FC<RoomBackgroundStoreModalProps> = ({
  isOpen,
  onClose,
  activeBackgroundUrl = 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=800',
  onSelectBackground,
  roomId = '884920',
  isOwner = true,
  ownerId = '88492011',
  ownerName = 'عابر سبيل',
  roomTitle = 'روم السهرة والنغم 🎵',
  themeConfig
}) => {
  // Tab state: 'available' (متاح - Right Tab) or 'store' (متجر - Left Tab)
  const [activeTab, setActiveTab] = useState<'available' | 'store'>('available');
  const [equippedBgUrl, setEquippedBgUrl] = useState<string>(activeBackgroundUrl);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [previewBg, setPreviewBg] = useState<RoomWallpaperItem | null>(null);

  // Purchased items store persistence
  const [purchasedStoreIds, setPurchasedStoreIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('najm_purchased_wallpapers') || localStorage.getItem('yoho_purchased_wallpapers');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  // Custom user-uploaded wallpapers
  const [customWallpapers, setCustomWallpapers] = useState<RoomWallpaperItem[]>(() => {
    try {
      const saved = localStorage.getItem('najm_custom_user_wallpapers') || localStorage.getItem('yoho_custom_user_wallpapers');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  useEffect(() => {
    if (activeBackgroundUrl) {
      setEquippedBgUrl(activeBackgroundUrl);
    }
  }, [activeBackgroundUrl]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Combine default available with custom uploaded & purchased store items
  const allAvailableWallpapers: RoomWallpaperItem[] = [
    ...customWallpapers,
    ...AVAILABLE_WALLPAPERS,
    ...STORE_WALLPAPERS.filter((s) => purchasedStoreIds.includes(s.id))
  ];

  // Apply selected wallpaper to room & sync with Firestore
  const handleSelectWallpaper = async (item: RoomWallpaperItem) => {
    if (!isOwner) {
      showToast('تغيير خلفية الغرفة متاح لصاحب الغرفة (المالك) فقط 👑');
      return;
    }

    setEquippedBgUrl(item.imageUrl);
    onSelectBackground?.(item.imageUrl, item.name);

    try {
      await saveRoomThemeAndWallpaperToFirestore({
        roomId,
        isOwner: true,
        ownerId,
        ownerName,
        roomTitle,
        wallpaperUrl: item.imageUrl,
        wallpaperName: item.name,
        themeConfig
      });
      showToast(`تم تطبيق خلفية "${item.name}" بنجاح 🖼️✨`);
    } catch (e) {
      showToast(`تم تطبيق خلفية "${item.name}" محلياً 🖼️`);
    }
  };

  // Buy wallpaper from Store tab
  const handleBuyStoreWallpaper = async (item: RoomWallpaperItem) => {
    const isAlreadyBought = purchasedStoreIds.includes(item.id);

    if (isAlreadyBought) {
      handleSelectWallpaper(item);
      return;
    }

    // Check user coins
    let currentCoins = 50000;
    try {
      const savedCoins = localStorage.getItem('user_wallet_coins');
      if (savedCoins) {
        currentCoins = parseInt(savedCoins, 10) || 50000;
      }
    } catch (e) {}

    const price = item.priceCoins || 30000;
    if (currentCoins < price) {
      showToast(`رصيدك غير كافٍ (${currentCoins.toLocaleString()} كوينز). يلزم ${price.toLocaleString()} كوينز للشراء 🪙`);
      return;
    }

    // Deduct coins
    const newCoins = Math.max(0, currentCoins - price);
    try {
      localStorage.setItem('user_wallet_coins', newCoins.toString());
      window.dispatchEvent(
        new CustomEvent('user_coins_updated', {
          detail: { coins: newCoins }
        })
      );
    } catch (e) {}

    // Save to purchased list
    const updatedPurchased = [...purchasedStoreIds, item.id];
    setPurchasedStoreIds(updatedPurchased);
    try {
      localStorage.setItem('najm_purchased_wallpapers', JSON.stringify(updatedPurchased));
    } catch (e) {}

    // Equip immediately
    await handleSelectWallpaper(item);
    showToast(`تم شراء وتفعيل خلفية "${item.name}" بنجاح! 🛍️✨`);
  };

  // Custom upload handler
  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        const newCustomItem: RoomWallpaperItem = {
          id: `custom-${Date.now()}`,
          name: `خلفية مخصصة ${customWallpapers.length + 1}`,
          imageUrl: base64
        };
        const updated = [newCustomItem, ...customWallpapers];
        setCustomWallpapers(updated);
        try {
          localStorage.setItem('najm_custom_user_wallpapers', JSON.stringify(updated));
        } catch (err) {}
        handleSelectWallpaper(newCustomItem);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <AnimatePresence>
      <div
        id="room-background-store-overlay"
        className="fixed inset-0 z-50 bg-transparent flex flex-col justify-end pointer-events-auto select-none dir-rtl"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%', opacity: 0.5 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg mx-auto bg-white rounded-t-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[82vh] text-slate-900 relative"
        >
          {/* Top Bar Tabs: متاح (Right) | متجر (Left) matching screenshot header exactly */}
          <div className="relative pt-4 pb-2 px-6 bg-white border-b border-slate-100 flex items-center justify-around shrink-0">
            {/* Left Tab: متجر (Store) */}
            <button
              id="tab-room-bg-store"
              onClick={() => setActiveTab('store')}
              className="flex flex-col items-center justify-center cursor-pointer transition-all flex-1 py-1"
            >
              <span
                className={`text-base sm:text-lg font-black transition-colors ${
                  activeTab === 'store' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600 font-bold'
                }`}
              >
                متجر
              </span>
              {/* Green indicator bar under active tab */}
              <div
                className={`h-1 w-6 rounded-full mt-1.5 transition-all ${
                  activeTab === 'store' ? 'bg-[#00c765]' : 'bg-transparent'
                }`}
              />
            </button>

            {/* Right Tab: متاح (Available) */}
            <button
              id="tab-room-bg-available"
              onClick={() => setActiveTab('available')}
              className="flex flex-col items-center justify-center cursor-pointer transition-all flex-1 py-1"
            >
              <span
                className={`text-base sm:text-lg font-black transition-colors ${
                  activeTab === 'available' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600 font-bold'
                }`}
              >
                متاح
              </span>
              {/* Green indicator bar under active tab */}
              <div
                className={`h-1 w-6 rounded-full mt-1.5 transition-all ${
                  activeTab === 'available' ? 'bg-[#00c765]' : 'bg-transparent'
                }`}
              />
            </button>
          </div>

          {/* TAB 1: متاح (Available Wallpapers - 3 Column Grid matching Screenshot 1) */}
          {activeTab === 'available' && (
            <div className="p-3.5 pb-10 overflow-y-auto max-h-[70vh] custom-scrollbar flex-1 bg-white">
              <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                {/* Upload Custom Wallpaper Button */}
                <label className="aspect-[9/14] rounded-xl border-2 border-dashed border-slate-200 hover:border-[#00c765] bg-slate-50/80 flex flex-col items-center justify-center text-slate-400 hover:text-[#00c765] cursor-pointer transition-all active:scale-95 group shadow-2xs">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCustomUpload}
                    className="hidden"
                  />
                  <div className="w-8 h-8 rounded-full bg-white border border-slate-200 group-hover:border-[#00c765] flex items-center justify-center text-slate-500 group-hover:text-[#00c765] shadow-xs mb-1 transition-colors">
                    <Upload className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-center leading-tight">
                    رفع خلفية
                  </span>
                </label>

                {/* Wallpapers List */}
                {allAvailableWallpapers.map((bg) => {
                  const isEquipped = bg.imageUrl === equippedBgUrl;

                  return (
                    <div
                      key={bg.id}
                      onClick={() => handleSelectWallpaper(bg)}
                      className={`relative aspect-[9/14] rounded-xl overflow-hidden shadow-xs cursor-pointer transition-all duration-200 group border-2 ${
                        isEquipped
                          ? 'border-[#00c765] shadow-md ring-2 ring-[#00c765]/30'
                          : 'border-transparent hover:border-slate-300'
                      }`}
                    >
                      <img
                        src={bg.imageUrl}
                        alt={bg.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />

                      {/* Equipped Checkmark Overlay */}
                      {isEquipped && (
                        <div className="absolute top-1.5 right-1.5 bg-[#00c765] text-white p-0.5 rounded-full shadow-md z-10 flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: متجر (Store Wallpapers - 2 Column Grid matching Screenshot 2) */}
          {activeTab === 'store' && (
            <div className="p-3.5 pb-10 overflow-y-auto max-h-[70vh] custom-scrollbar flex-1 bg-white">
              <div className="grid grid-cols-2 gap-3 sm:gap-3.5">
                {STORE_WALLPAPERS.map((bg) => {
                  const isPurchased = purchasedStoreIds.includes(bg.id);
                  const isEquipped = bg.imageUrl === equippedBgUrl;

                  return (
                    <div
                      key={bg.id}
                      className="rounded-2xl overflow-hidden border border-slate-100 shadow-xs flex flex-col bg-white transition-all hover:shadow-md"
                    >
                      {/* Image Preview Container */}
                      <div className="relative aspect-square w-full overflow-hidden bg-slate-900">
                        <img
                          src={bg.imageUrl}
                          alt={bg.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />

                        {/* Top-Left: Scan / Preview Button with Duration Pill (e.g. 14 أيام) */}
                        <div className="absolute top-2 left-2 flex items-center gap-1 z-10">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreviewBg(bg);
                            }}
                            className="bg-black/55 backdrop-blur-xs text-white text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 hover:bg-black/80 transition-colors shadow-xs"
                            title="معاينة الخلفية بالكامل"
                          >
                            <Scan className="w-3.5 h-3.5 stroke-[2.2]" />
                            <span>{bg.durationDays || 14} أيام</span>
                            <Clock className="w-2.5 h-2.5 opacity-80" />
                          </button>
                        </div>

                        {/* Bottom-Right Price Tag (e.g. 30,000 عملات) */}
                        <div className="absolute bottom-2 right-2 text-right z-10">
                          <span className="text-white text-xs font-black drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.9)] font-mono">
                            {bg.priceCoins?.toLocaleString('en-US')} عملات
                          </span>
                        </div>
                      </div>

                      {/* Bottom Buy Button (يشترى) in Green */}
                      <button
                        onClick={() => handleBuyStoreWallpaper(bg)}
                        className={`w-full py-2.5 px-3 font-black text-sm flex items-center justify-center transition-all cursor-pointer ${
                          isEquipped
                            ? 'bg-[#00c765] text-white'
                            : isPurchased
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                            : 'bg-[#00c765] hover:bg-[#00b058] active:scale-[0.99] text-white shadow-xs'
                        }`}
                      >
                        {isEquipped ? 'مجهزة حالياً ✓' : isPurchased ? 'استخدام' : 'يشترى'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TOAST NOTIFICATION */}
          <AnimatePresence>
            {toastMsg && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/95 text-white px-4 py-2 rounded-2xl font-bold text-xs shadow-2xl z-50 flex items-center gap-2 border border-slate-700 pointer-events-none whitespace-nowrap"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#00c765]" />
                <span>{toastMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* FULLSCREEN PREVIEW MODAL */}
        <AnimatePresence>
          {previewBg && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-60 bg-black/90 flex flex-col justify-between p-4 pointer-events-auto select-none dir-rtl"
              onClick={() => setPreviewBg(null)}
            >
              <div className="flex items-center justify-between z-10">
                <span className="text-white font-bold text-sm bg-black/50 px-3 py-1 rounded-full backdrop-blur-md">
                  معاينة: {previewBg.name}
                </span>
                <button
                  onClick={() => setPreviewBg(null)}
                  className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="relative max-w-sm mx-auto w-full h-[65vh] rounded-3xl overflow-hidden shadow-2xl border border-white/20 my-auto">
                <img
                  src={previewBg.imageUrl}
                  alt={previewBg.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex justify-center pb-4 z-10">
                <button
                  onClick={() => {
                    handleBuyStoreWallpaper(previewBg);
                    setPreviewBg(null);
                  }}
                  className="bg-[#00c765] hover:bg-[#00b058] text-white font-black px-8 py-3 rounded-full text-base shadow-lg transition-transform active:scale-95"
                >
                  {purchasedStoreIds.includes(previewBg.id) ? 'تطبيق الخلفية' : `شراء الآن (${previewBg.priceCoins?.toLocaleString()} كوينز)`}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatePresence>
  );
};
