import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Gift, Lock, Calendar, Clock, AlertCircle, X } from 'lucide-react';
import { saveRoomThemeAndWallpaperToFirestore } from '../../lib/roomThemeFirestoreService';
import {
  RoomWallpaperItem,
  AVAILABLE_WALLPAPERS,
  STORE_WALLPAPERS
} from './wallpaperData';
import { AvailableWallpapersTab } from './AvailableWallpapersTab';
import { StoreWallpapersTab } from './StoreWallpapersTab';
import { WallpaperFullscreenPreview } from './WallpaperFullscreenPreview';
import {
  CustomWallpaperGiftGrant,
  getCustomWallpaperGiftGrant,
  isCustomWallpaperGrantActive,
  grantCustomWallpaperGift,
  revokeCustomWallpaperGift,
  DEFAULT_ROOM_WALLPAPER_URL,
  getGrantRemainingTime
} from '../../lib/customWallpaperGiftService';

export interface RoomBackgroundStoreModalProps {
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
  currentAppRole?: string;
}

export const RoomBackgroundStoreModal: React.FC<RoomBackgroundStoreModalProps> = ({
  isOpen,
  onClose,
  activeBackgroundUrl = DEFAULT_ROOM_WALLPAPER_URL,
  onSelectBackground,
  roomId = '884920',
  isOwner = true,
  ownerId = '88492011',
  ownerName = 'عابر سبيل',
  roomTitle = 'روم السهرة والنغم 🎵',
  currentAppRole
}) => {
  // Tab state: 'available' (متاح - Right Tab) or 'store' (متجر - Left Tab)
  const [activeTab, setActiveTab] = useState<'available' | 'store'>('available');
  const [equippedBgUrl, setEquippedBgUrl] = useState<string>(activeBackgroundUrl);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [previewBg, setPreviewBg] = useState<RoomWallpaperItem | null>(null);
  const [showGrantInfoDialog, setShowGrantInfoDialog] = useState<boolean>(false);

  // Administrative gift grant state for custom mobile wallpaper upload
  const [giftGrant, setGiftGrant] = useState<CustomWallpaperGiftGrant | null>(() =>
    getCustomWallpaperGiftGrant()
  );

  const isDevOrAdmin = isOwner || currentAppRole === 'developer' || currentAppRole === 'admin';

  // Purchased items store persistence
  const [purchasedStoreIds, setPurchasedStoreIds] = useState<string[]>(() => {
    try {
      const saved =
        localStorage.getItem('najm_purchased_wallpapers') ||
        localStorage.getItem('yoho_purchased_wallpapers');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  // Custom user-uploaded wallpapers
  const [customWallpapers, setCustomWallpapers] = useState<RoomWallpaperItem[]>(() => {
    try {
      const saved =
        localStorage.getItem('najm_custom_user_wallpapers') ||
        localStorage.getItem('yoho_custom_user_wallpapers');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Check grant expiration upon modal open
  useEffect(() => {
    const currentGrant = getCustomWallpaperGiftGrant();
    setGiftGrant(currentGrant);

    // If grant is expired or not active, and equipped background is a custom one, revert to default!
    if (!currentGrant && equippedBgUrl && (equippedBgUrl.startsWith('data:') || customWallpapers.some((c) => c.imageUrl === equippedBgUrl))) {
      const defaultItem = AVAILABLE_WALLPAPERS[0];
      const defaultUrl = defaultItem?.imageUrl || DEFAULT_ROOM_WALLPAPER_URL;
      const defaultName = defaultItem?.name || 'الخلفية الافتراضية';
      setEquippedBgUrl(defaultUrl);
      onSelectBackground?.(defaultUrl, defaultName);
      setCustomWallpapers([]);
      revokeCustomWallpaperGift();
      showToast('انتهت مدة هدية رفع الخلفية من الإدارة، تم إلغاء الخلفية الخاصة وإعادتها للافتراضية 🎁⏰');
    }
  }, [isOpen]);

  useEffect(() => {
    if (activeBackgroundUrl) {
      setEquippedBgUrl(activeBackgroundUrl);
    }
  }, [activeBackgroundUrl]);

  if (!isOpen) return null;

  // Combine default available with custom uploaded & purchased store items
  const allAvailableWallpapers: RoomWallpaperItem[] = [
    ...(giftGrant?.isGranted ? customWallpapers : []),
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
        wallpaperName: item.name
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
      showToast(`عذراً، رصيد العملات لديك (${currentCoins.toLocaleString()}) غير كافٍ للشراء 🪙`);
      return;
    }

    // Deduct coins & save
    const newCoins = currentCoins - price;
    try {
      localStorage.setItem('user_wallet_coins', newCoins.toString());
    } catch (e) {}

    const updatedPurchased = [...purchasedStoreIds, item.id];
    setPurchasedStoreIds(updatedPurchased);
    try {
      localStorage.setItem('najm_purchased_wallpapers', JSON.stringify(updatedPurchased));
    } catch (e) {}

    showToast(`تهانينا! تم شراء خلفية "${item.name}" بنجاح 🛍️✨`);
    handleSelectWallpaper(item);
  };

  // Handle custom wallpaper upload from device (Strictly checked against active admin grant)
  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isCustomWallpaperGrantActive()) {
      showToast('خاصية رفع الخلفية من الجوال مقفلة: تحتاج إلى هدية إدارية سارية الصلاحية 🎁🔒');
      setShowGrantInfoDialog(true);
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 5 ميجابايت ⚠️');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        const newCustomItem: RoomWallpaperItem = {
          id: `custom-${Date.now()}`,
          name: `خلفية خاصة ممنوحة ${customWallpapers.length + 1}`,
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

  // Admin Grant handlers
  const handleAdminGrantGift = (durationDays: number) => {
    const grant = grantCustomWallpaperGift(durationDays, 'إدارة التطبيق');
    setGiftGrant(grant);
    const rem = getGrantRemainingTime(grant);
    showToast(`تم تفعيل هدية رفع الخلفية بنجاح لمدة ${durationDays} يوماً (حتى ${rem.formattedExpiresAt}) 🎁✨`);
  };

  const handleAdminRevokeGift = () => {
    revokeCustomWallpaperGift();
    setGiftGrant(null);
    setCustomWallpapers([]);

    // If currently equipped wallpaper is a custom one, revert to default
    if (equippedBgUrl.startsWith('data:') || customWallpapers.some((c) => c.imageUrl === equippedBgUrl)) {
      const defaultItem = AVAILABLE_WALLPAPERS[0];
      const defaultUrl = defaultItem?.imageUrl || DEFAULT_ROOM_WALLPAPER_URL;
      const defaultName = defaultItem?.name || 'الخلفية الافتراضية';
      setEquippedBgUrl(defaultUrl);
      onSelectBackground?.(defaultUrl, defaultName);
    }

    showToast('تم إلغاء هدية الخلفية الخاصة وإعادة تعيين الخلفية للافتراضية 🛑');
  };

  return (
    <AnimatePresence>
      <div
        id="room-background-store-overlay"
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex flex-col justify-end pointer-events-auto select-none dir-rtl"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%', opacity: 0.5 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg mx-auto bg-white rounded-t-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[84vh] text-slate-900 relative border-t border-slate-200"
        >
          {/* Top Bar Tabs: متاح (Right) | متجر (Left) */}
          <div className="relative pt-4 pb-2 px-6 bg-white border-b border-slate-100 flex items-center justify-around shrink-0">
            {/* Left Tab: متجر (Store) */}
            <button
              id="tab-room-bg-store"
              type="button"
              onClick={() => setActiveTab('store')}
              className="flex flex-col items-center justify-center cursor-pointer transition-all flex-1 py-1"
            >
              <span
                className={`text-base sm:text-lg font-black transition-colors ${
                  activeTab === 'store'
                    ? 'text-slate-900'
                    : 'text-slate-400 hover:text-slate-600 font-bold'
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
              type="button"
              onClick={() => setActiveTab('available')}
              className="flex flex-col items-center justify-center cursor-pointer transition-all flex-1 py-1"
            >
              <span
                className={`text-base sm:text-lg font-black transition-colors ${
                  activeTab === 'available'
                    ? 'text-slate-900'
                    : 'text-slate-400 hover:text-slate-600 font-bold'
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

          {/* TAB 1: متاح (Available Wallpapers - 3 Column Grid with Admin Gift Protection) */}
          {activeTab === 'available' && (
            <AvailableWallpapersTab
              wallpapers={allAvailableWallpapers}
              equippedBgUrl={equippedBgUrl}
              onSelectWallpaper={handleSelectWallpaper}
              onCustomUpload={handleCustomUpload}
              giftGrant={giftGrant}
              onLockedUploadClick={() => setShowGrantInfoDialog(true)}
              isDevOrAdmin={isDevOrAdmin}
              onAdminGrantGift={handleAdminGrantGift}
              onAdminRevokeGift={handleAdminRevokeGift}
            />
          )}

          {/* TAB 2: متجر (Store Wallpapers - 2 Column Grid) */}
          {activeTab === 'store' && (
            <StoreWallpapersTab
              wallpapers={STORE_WALLPAPERS}
              purchasedStoreIds={purchasedStoreIds}
              equippedBgUrl={equippedBgUrl}
              onPreview={(bg) => setPreviewBg(bg)}
              onBuyOrEquip={handleBuyStoreWallpaper}
            />
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
            <WallpaperFullscreenPreview
              previewBg={previewBg}
              purchasedStoreIds={purchasedStoreIds}
              onClose={() => setPreviewBg(null)}
              onApplyOrBuy={(bg) => {
                handleBuyStoreWallpaper(bg);
                setPreviewBg(null);
              }}
            />
          )}
        </AnimatePresence>

        {/* EXPLANATION DIALOG FOR ADMINISTRATIVE GIFT (نافذة توضيح شروط الهدية الإدارية) */}
        <AnimatePresence>
          {showGrantInfoDialog && (
            <div
              className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
              onClick={() => setShowGrantInfoDialog(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-sm bg-white rounded-3xl p-5 text-slate-900 shadow-2xl border border-slate-200 relative text-right"
                dir="rtl"
              >
                <button
                  onClick={() => setShowGrantInfoDialog(false)}
                  className="absolute top-4 left-4 p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                    <Gift className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900">هدية رفع الخلفية الخاصة</h3>
                    <p className="text-[11px] text-purple-600 font-bold">صلاحية إدارية خاصة ومحددة المدة</p>
                  </div>
                </div>

                <div className="py-4 space-y-2.5 text-xs text-slate-600 leading-relaxed">
                  <div className="flex items-start gap-2 bg-purple-50/70 p-2.5 rounded-xl border border-purple-100">
                    <AlertCircle className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <span>
                      ميزة رفع صورة خلفية خاصة من الجوال هي <strong>هدية تمنحها الإدارة</strong> للأشخاص المميزين وليست متاحة بشكل دائم.
                    </span>
                  </div>

                  <div className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                    <Calendar className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span>
                      تكون الهدية محددة <strong>بتاريخ بدء وانتهاء</strong>. وعند انتهاء المدة، يتم إلغاء الخلفية الخاصة تلقائياً حتى يتم منح هدية جديدة من الإدارة.
                    </span>
                  </div>
                </div>

                {/* Admin quick test controls */}
                {isDevOrAdmin && (
                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <div className="text-[11px] font-black text-slate-700">تحكم الإدارة (منح تجريبي للمعاينة):</div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          handleAdminGrantGift(7);
                          setShowGrantInfoDialog(false);
                        }}
                        className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-xl text-xs transition-colors cursor-pointer shadow-xs"
                      >
                        منح 7 أيام 🎁
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          handleAdminGrantGift(30);
                          setShowGrantInfoDialog(false);
                        }}
                        className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl text-xs transition-colors cursor-pointer shadow-xs"
                      >
                        منح 30 يوماً ✨
                      </button>
                    </div>
                  </div>
                )}

                <div className="pt-3">
                  <button
                    type="button"
                    onClick={() => setShowGrantInfoDialog(false)}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    حسناً، فهمت
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </AnimatePresence>
  );
};

export default RoomBackgroundStoreModal;
