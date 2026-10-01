import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion } from 'motion/react';
import { ChevronDown, Check, Sparkles, Mic, Radio } from 'lucide-react';
import { GiftItem } from '../../lib/giftCmsService';
import { 
  GIFT_BOX_CATEGORIES, 
  getGiftsFromDeviceMemory, 
  getOrHydrateGiftsOnDemand, 
  setupGiftDashboardSilentListener 
} from '../../lib/giftBoxService';
import { MicSeat } from './roomTypes';

export interface RoomGiftBoxModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendGift: (gift: GiftItem, comboCount: number, recipientSeatId?: number) => void;
  userCoins?: number;
  onOpenRecharge?: () => void;
  micSeats?: MicSeat[];
  currentUserId?: string;
}

/**
 * كرت الهدية المستقل والمعزول كلياً (Isolated Gift Slot Card)
 * - محمي بـ React.memo لمنع أي إعادة تصيير غير لازمة لبقية الكروت
 * - تحميل كسول عند الطلب للصور والوسائط
 */
interface GiftSlotCardProps {
  gift: GiftItem;
  isSelected: boolean;
  onSelect: (gift: GiftItem) => void;
}

const RoomGiftSlotCard = React.memo<GiftSlotCardProps>(({ gift, isSelected, onSelect }) => {
  return (
    <button
      type="button"
      onClick={() => onSelect(gift)}
      className={`relative flex flex-col items-center justify-between p-2 rounded-2xl transition-all cursor-pointer aspect-[1/1.08] select-none text-right ${
        isSelected
          ? 'bg-gradient-to-b from-amber-500/20 via-amber-400/10 to-transparent border-2 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.35)] scale-[1.02]'
          : 'bg-[#181C2E]/80 border border-white/5 hover:border-white/15 hover:bg-[#20253B]/90'
      }`}
    >
      {/* شارة الهدية إن وجدت (مثل: استرداد، رائج، جاكبوت) */}
      {gift.badge && (
        <span className="absolute top-1 left-1 px-1.5 py-0.2 rounded-md text-[8px] font-black bg-gradient-to-r from-amber-500 to-rose-500 text-white uppercase shadow-xs">
          {gift.badge}
        </span>
      )}

      {/* أيقونة الهدية أو صورتها عند الطلب */}
      <div className="w-12 h-12 flex items-center justify-center my-auto">
        {gift.icon && (gift.icon.startsWith('http') || gift.icon.startsWith('data:') || gift.icon.startsWith('/')) ? (
          <img
            src={gift.icon}
            alt={gift.name}
            loading="lazy"
            decoding="async"
            className="w-11 h-11 object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] transform hover:scale-108 transition-transform"
          />
        ) : (
          <span className="text-3xl select-none filter drop-shadow transform hover:scale-110 transition-transform">
            {gift.icon || '🎁'}
          </span>
        )}
      </div>

      {/* اسم الهدية وسعرها بالكوينز */}
      <div className="w-full flex flex-col items-center text-center mt-1">
        <span className="text-[11px] font-bold text-white truncate max-w-full leading-tight">
          {gift.name}
        </span>
        <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-amber-300 mt-0.5">
          <span className="text-amber-400">🪙</span>
          <span>{gift.price.toLocaleString()}</span>
        </div>
      </div>
    </button>
  );
});

RoomGiftSlotCard.displayName = 'RoomGiftSlotCard';

/**
 * نافذة صندوق الهدايا المستقلة (RoomGiftBoxModal)
 * 1. في الأعلى: خيار الثلاث شرطات، وعند النقر يظهر مستطيلان (جميع من على المايك / جميع من في الروم).
 * 2. بجانب زر إرسال: سهم المضاعفات مع خيار التحديد اليدوي وإضافة الرقم يدوياً.
 * 3. مصغرات بروفايلات المتواجدين على المايك في الأعلى مع التبويبات بالأسماء النصية الصافية تحتها.
 * 4. خط التقدم الطويل من اليمين إلى الشمال مع مستوى 1 ومستوى 2 وكتابة صغيرة.
 * 5. تصميم مستقل كلياً بدون ربط خارجي.
 */
export const RoomGiftBoxModal: React.FC<RoomGiftBoxModalProps> = ({
  isOpen,
  onClose,
  onSendGift,
  userCoins = 24580,
  onOpenRecharge,
  micSeats = []
}) => {
  const [gifts, setGifts] = useState<GiftItem[]>(getGiftsFromDeviceMemory());
  const [selectedGiftId, setSelectedGiftId] = useState<string | null>(null);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState<number>(0);
  const [comboCount, setComboCount] = useState<number>(1);
  const [showComboMenu, setShowComboMenu] = useState<boolean>(false);
  const [showCustomInput, setShowCustomInput] = useState<boolean>(false);
  const [customCountInput, setCustomCountInput] = useState<string>('1');
  const [selectedRecipientSeatId, setSelectedRecipientSeatId] = useState<number | 'all' | 'all_mics' | 'all_room'>('all_mics');
  const [showAllMenu, setShowAllMenu] = useState<boolean>(false);

  // حالة سحب الشاشة المتصلة بحركة الإصبع المباشرة
  const [dragOffsetPx, setDragOffsetPx] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);
  const isHorizontalSwipe = useRef<boolean | null>(null);

  const categories = GIFT_BOX_CATEGORIES;

  // التحميل عند الطلب والتخزين بذاكرة الجوال والاستماع للرسائل الخفية
  useEffect(() => {
    if (!isOpen) return;

    // 1. جلب التحديثات عند الطلب
    getOrHydrateGiftsOnDemand().then((hydrated) => {
      setGifts(hydrated);
      if (!selectedGiftId && hydrated.length > 0) {
        setSelectedGiftId(hydrated[0].id);
      }
    });

    // 2. مستمع الرسائل الخفية من الداشبورد الخارجي
    const unsubscribe = setupGiftDashboardSilentListener((updatedGifts) => {
      setGifts(updatedGifts);
    });

    return () => {
      unsubscribe();
    };
  }, [isOpen, selectedGiftId]);

  // قائمة المتحدثين الفعليين على المقاعد لاختيار مستلم الهدية
  const displaySeats = useMemo(() => {
    const occupied = micSeats.filter((s) => !s.isEmpty && s.userName && s.userName !== String(s.id));
    if (occupied.length > 0) return occupied;

    // متحدثين افتراضيين للعرض المرئي الفخم إن لم تكن المقاعد مشغولة حالياً
    return [
      { id: 1, userName: 'المضيف 👑', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150', isHost: true },
      { id: 2, userName: 'فارس الليل', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150' },
      { id: 3, userName: 'سندريلا ✨', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150' },
      { id: 4, userName: 'البرنس', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150' },
      { id: 5, userName: 'الملكة 👑', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150' }
    ];
  }, [micSeats]);

  // تصنيف الهدايا حسب الأقسام
  const categorizedGifts = useMemo(() => {
    const map: Record<string, GiftItem[]> = {};
    categories.forEach((cat) => {
      map[cat.id] = [];
    });

    gifts.forEach((g) => {
      if (map[g.category]) {
        map[g.category].push(g);
      }
      if (map['الكل']) {
        map['الكل'].push(g);
      }
      if (g.price >= 5000 && map['فاخرة']) {
        map['فاخرة'].push(g);
      }
      if ((g.hasSound || g.videoUrl) && map['تفاعلية']) {
        map['تفاعلية'].push(g);
      }
    });

    return map;
  }, [gifts, categories]);

  // إيماءات اللمس المباشرة لتقليب الصفحات
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartPos.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
    isHorizontalSwipe.current = null;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartPos.current) return;
    const diffX = e.touches[0].clientX - touchStartPos.current.x;
    const diffY = e.touches[0].clientY - touchStartPos.current.y;

    if (isHorizontalSwipe.current === null) {
      if (Math.abs(diffX) > 8 || Math.abs(diffY) > 8) {
        isHorizontalSwipe.current = Math.abs(diffX) > Math.abs(diffY);
      }
    }

    if (isHorizontalSwipe.current) {
      let boundedDiff = diffX;
      if (
        (activeCategoryIndex === 0 && diffX > 0) ||
        (activeCategoryIndex === categories.length - 1 && diffX < 0)
      ) {
        boundedDiff = diffX * 0.28;
      }
      setDragOffsetPx(boundedDiff);
    }
  };

  const handleTouchEnd = () => {
    if (isHorizontalSwipe.current && containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth || 360;
      const threshold = Math.min(containerWidth * 0.18, 50);

      if (dragOffsetPx < -threshold && activeCategoryIndex < categories.length - 1) {
        setActiveCategoryIndex((prev) => prev + 1);
      } else if (dragOffsetPx > threshold && activeCategoryIndex > 0) {
        setActiveCategoryIndex((prev) => prev - 1);
      }
    }

    setIsDragging(false);
    setDragOffsetPx(0);
    touchStartPos.current = null;
    isHorizontalSwipe.current = null;
  };

  const selectedGift = useMemo(() => {
    return gifts.find((g) => g.id === selectedGiftId) || gifts[0];
  }, [gifts, selectedGiftId]);

  const handleSelectGift = useCallback((gift: GiftItem) => {
    setSelectedGiftId(gift.id);
  }, []);

  const handleSend = () => {
    if (!selectedGift) return;
    const recipientSeat =
      typeof selectedRecipientSeatId === 'number' ? selectedRecipientSeatId : undefined;
    onSendGift(selectedGift, comboCount, recipientSeat);
  };

  const isAllSelected =
    selectedRecipientSeatId === 'all' ||
    selectedRecipientSeatId === 'all_mics' ||
    selectedRecipientSeatId === 'all_room';

  if (!isOpen) return null;

  return (
    /* خلفية شفافة تضمن وضوح شاشة الروم 100% دون أي حجب أو ضباب */
    <div
      className="fixed inset-0 z-50 flex items-end justify-center select-none bg-transparent"
      onClick={() => {
        setShowAllMenu(false);
        setShowComboMenu(false);
        onClose();
      }}
    >
      {/* 
        حاوية صندوق الهدايا: 
        - أبعاد ثابتة ومستقرة تماماً (Fixed Height: 55vh)
      */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => {
          e.stopPropagation();
          setShowAllMenu(false);
          setShowComboMenu(false);
        }}
        style={{ height: '55vh', minHeight: '55vh', maxHeight: '55vh' }}
        className="w-full max-w-md bg-gradient-to-b from-[#131728] via-[#0E111F] to-[#0A0C16] text-white rounded-t-[28px] shadow-[0_-12px_45px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden border-t border-amber-500/20"
        dir="rtl"
      >
        {/* مقبض سحب صغير أنيق */}
        <div className="pt-2 pb-1 shrink-0 flex justify-center items-center">
          <div className="w-10 h-1 bg-white/20 rounded-full" />
        </div>

        {/* 
          1. مصغرات البروفايلات الموجودين على المايك:
             - خيار الثلاث شرطات في البداية مع مستطيلين (جميع من على المايك / جميع من في الروم)
             - مصغرات الأشخاص على المايك
        */}
        <div className="px-3 pt-1 pb-2 shrink-0 flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-white/5 relative">
          {/* خيار الثلاث شرطات */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowAllMenu((prev) => !prev);
                setShowComboMenu(false);
              }}
              className={`flex flex-col items-center gap-1 shrink-0 transition-all cursor-pointer ${
                isAllSelected ? 'scale-105' : 'opacity-70 hover:opacity-100'
              }`}
            >
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center p-0.5 transition-all ${
                  isAllSelected
                    ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-[#131728] bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 shadow-[0_0_12px_rgba(251,191,36,0.6)]'
                    : 'bg-[#1E243B] border border-white/10 text-amber-300'
                }`}
              >
                {/* ثلاث شرطات أفقية واضحة ومميزة */}
                <div className="w-4 h-3 flex flex-col justify-between items-center">
                  <span className={`w-3.5 h-[2px] rounded-full transition-colors ${isAllSelected ? 'bg-slate-950' : 'bg-amber-300'}`} />
                  <span className={`w-3.5 h-[2px] rounded-full transition-colors ${isAllSelected ? 'bg-slate-950' : 'bg-amber-300'}`} />
                  <span className={`w-3.5 h-[2px] rounded-full transition-colors ${isAllSelected ? 'bg-slate-950' : 'bg-amber-300'}`} />
                </div>
              </div>
              <span
                className={`text-[10px] font-bold truncate max-w-[52px] leading-tight ${
                  isAllSelected ? 'text-amber-300' : 'text-slate-400'
                }`}
              >
                {selectedRecipientSeatId === 'all_room' ? 'في الروم' : 'الجميع'}
              </span>
            </button>
          </div>

          {/* مصغرات المستخدمين المتواجدين على المايك */}
          {displaySeats.map((seat) => {
            const isSelected = selectedRecipientSeatId === seat.id;
            return (
              <button
                key={seat.id}
                type="button"
                onClick={() => {
                  setSelectedRecipientSeatId(seat.id);
                  setShowAllMenu(false);
                }}
                className={`flex flex-col items-center gap-1 shrink-0 transition-all cursor-pointer relative ${
                  isSelected ? 'scale-105' : 'opacity-70 hover:opacity-100'
                }`}
              >
                <div
                  className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-full p-0.5 transition-all ${
                    isSelected
                      ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-[#131728] shadow-[0_0_12px_rgba(251,191,36,0.6)]'
                      : 'border border-white/15'
                  }`}
                >
                  <img
                    src={
                      seat.avatar ||
                      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'
                    }
                    alt={seat.userName}
                    className="w-full h-full rounded-full object-cover"
                  />
                  {/* شارة رقم المقعد */}
                  <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-slate-950 text-[8px] font-bold text-amber-300 border border-amber-400/50 flex items-center justify-center shadow">
                    {seat.id}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-bold truncate max-w-[48px] leading-tight ${
                    isSelected ? 'text-amber-300' : 'text-slate-300'
                  }`}
                >
                  {seat.userName}
                </span>
              </button>
            );
          })}
        </div>

        {/* 
          2. التبويبات بالأسماء فقط وبدون أي إيموجي بجانبها، منزلة للأسفل قليلاً
        */}
        <div className="flex items-center justify-between px-3 border-b border-white/5 shrink-0 overflow-x-auto no-scrollbar pt-1">
          {categories.map((cat, idx) => {
            const isActive = activeCategoryIndex === idx;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setActiveCategoryIndex(idx);
                  setDragOffsetPx(0);
                }}
                className={`py-1.5 px-2.5 relative flex flex-col items-center justify-center transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'text-amber-300 font-black text-xs sm:text-sm'
                    : 'text-slate-400 font-bold text-xs hover:text-slate-200'
                }`}
              >
                <span>{cat.label}</span>
                {isActive && (
                  <motion.span
                    layoutId="activeGiftCategoryIndicator"
                    className="block w-4 h-0.5 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full mx-auto mt-1 shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                {!isActive && <span className="block w-4 h-0.5 bg-transparent mx-auto mt-1" />}
              </button>
            );
          })}
        </div>

        {/* 
          3. مسار التمرير الأفقي المتصل بالإصبع ومربعات الهدايا
        */}
        <div
          ref={containerRef}
          className="flex-1 h-full overflow-hidden relative cursor-grab active:cursor-grabbing"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          dir="ltr"
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              width: `${categories.length * 100}%`,
              height: '100%',
              transform: `translateX(calc(-${activeCategoryIndex * (100 / categories.length)}% + ${dragOffsetPx}px))`,
              transition: isDragging ? 'none' : 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
              willChange: 'transform'
            }}
          >
            {categories.map((cat) => {
              const catGifts = categorizedGifts[cat.id] || [];

              return (
                <div
                  key={cat.id}
                  style={{ width: `${100 / categories.length}%` }}
                  className="h-full shrink-0 flex flex-col overflow-hidden"
                  dir="rtl"
                >
                  <div className="h-full overflow-y-auto overscroll-contain p-2.5 pb-4">
                    <div className="grid grid-cols-4 gap-2">
                      {catGifts.map((gift) => (
                        <RoomGiftSlotCard
                          key={gift.id}
                          gift={gift}
                          isSelected={selectedGiftId === gift.id}
                          onSelect={handleSelectGift}
                        />
                      ))}
                    </div>

                    {catGifts.length === 0 && (
                      <div className="py-12 text-center text-slate-500 text-xs font-bold">
                        لا توجد هدايا في هذا القسم حالياً
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 
          4. الخط الطويل من اليمين إلى الشمال:
             - في اليمين: مستوى 1
             - في الشمال: مستوى 2
             - داخل الشريط: كتابة صغيرة للوصول إلى المستوى الثاني (معزول ومنفصل كلياً)
        */}
        <div className="shrink-0 px-3.5 py-1.5 bg-[#0C0F1D]/80 border-t border-white/5 flex items-center gap-2 select-none">
          {/* اليمين: المستوى الحالي (مستوى 1) */}
          <div className="flex items-center shrink-0">
            <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-[10px] font-black text-slate-950 shadow-xs">
              مستوى 1
            </span>
          </div>

          {/* في الوسط: الخط الطويل الممتد من اليمين للشمال مع كتابة صغيرة */}
          <div className="flex-1 relative flex flex-col justify-center">
            <div className="w-full h-3.5 bg-[#171C30] rounded-full overflow-hidden border border-white/10 relative">
              {/* شريط التقدم */}
              <div
                className="h-full bg-gradient-to-l from-amber-400 via-amber-500 to-yellow-500 rounded-full shadow-[0_0_10px_rgba(251,191,36,0.5)] transition-all duration-300"
                style={{ width: '45%' }}
              />
              {/* كتابة صغيرة داخل الخط الطويل */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-[9px] font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)] tracking-tight">
                  الوصول إلى المستوى الثاني (450 / 1,000)
                </span>
              </div>
            </div>
          </div>

          {/* الشمال: المستوى المستهدف (مستوى 2) */}
          <div className="flex items-center shrink-0">
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-black text-slate-400 border border-white/10 shadow-xs">
              مستوى 2
            </span>
          </div>
        </div>

        {/* 5. الشريط السفلي لصندوق الهدايا (الرصيد، تحديد المستلم، السهم مع التحديد اليدوي، زر الإرسال) */}
        <div className="shrink-0 bg-[#0B0D18]/95 border-t border-white/10 px-3 py-2 flex items-center justify-between gap-2 z-20">
          {/* رصيد الكوينز وشحن سريع */}
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="flex items-center gap-1 bg-[#1A1F36] px-2.5 py-1 rounded-full border border-amber-500/20">
              <span className="text-amber-400 text-xs">🪙</span>
              <span className="font-mono text-xs font-bold text-amber-300">
                {userCoins.toLocaleString()}
              </span>
            </div>
            {onOpenRecharge && (
              <button
                type="button"
                onClick={onOpenRecharge}
                className="px-2 py-1 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[11px] font-bold border border-amber-400/30 cursor-pointer active:scale-95"
              >
                شحن
              </button>
            )}
          </div>

          {/* مضاعف الكومبو وزر الإرسال */}
          <div className="flex items-center gap-2 shrink-0">
            {/* مضاعف الكومبو والسهم مع فتح القائمة العائمة */}
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowComboMenu((prev) => !prev);
                  setShowAllMenu(false);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1A1F36] text-xs font-bold text-amber-300 border border-white/10 hover:border-amber-400/40 cursor-pointer active:scale-95 transition-all shadow-sm"
              >
                <span>x{comboCount}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>

            {/* زر الإرسال الفخم */}
            <button
              type="button"
              onClick={handleSend}
              disabled={!selectedGift}
              className="px-5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-slate-950 font-black text-xs shadow-[0_2px_12px_rgba(245,158,11,0.4)] active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <span>إرسال</span>
              <Sparkles className="w-3.5 h-3.5 text-slate-900" />
            </button>
          </div>
        </div>

        {/* 
          6. النوافذ العائمة فوق كل شيء (Floating Over Everything - z-[100]):
             - ظهور شكلي ومستقل كلياً بدون أي ربط خارجي
        */}

        {/* نافذة الراديو العائمة (مطابقة للصورة 1) */}
        {showAllMenu && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/45 backdrop-blur-[2px] select-none"
            onClick={(e) => {
              e.stopPropagation();
              setShowAllMenu(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.16 }}
              className="w-72 bg-[#2D2E3A] border border-white/10 rounded-[22px] shadow-[0_16px_50px_rgba(0,0,0,0.95)] p-4 flex flex-col gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 1. الكل على الميكرو... */}
              <button
                type="button"
                onClick={() => {
                  setSelectedRecipientSeatId('all_mics');
                  setShowAllMenu(false);
                }}
                className="w-full flex items-center gap-3.5 text-right cursor-pointer group select-none py-1"
              >
                <div
                  className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
                    selectedRecipientSeatId === 'all_mics' || selectedRecipientSeatId === 'all'
                      ? 'border-emerald-400 bg-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                      : 'border-slate-500 group-hover:border-slate-400'
                  }`}
                >
                  {(selectedRecipientSeatId === 'all_mics' || selectedRecipientSeatId === 'all') && (
                    <div className="w-3.5 h-3.5 rounded-full bg-emerald-400" />
                  )}
                </div>
                <span className="text-white text-base font-bold tracking-wide truncate">
                  الكل على الميكرو...
                </span>
              </button>

              {/* 2. الجميع في الغرفة */}
              <button
                type="button"
                onClick={() => {
                  setSelectedRecipientSeatId('all_room');
                  setShowAllMenu(false);
                }}
                className="w-full flex items-center gap-3.5 text-right cursor-pointer group select-none py-1"
              >
                <div
                  className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
                    selectedRecipientSeatId === 'all_room'
                      ? 'border-emerald-400 bg-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                      : 'border-slate-500 group-hover:border-slate-400'
                  }`}
                >
                  {selectedRecipientSeatId === 'all_room' && (
                    <div className="w-3.5 h-3.5 rounded-full bg-emerald-400" />
                  )}
                </div>
                <span className="text-white text-base font-bold tracking-wide truncate">
                  الجميع في الغرفة
                </span>
              </button>
            </motion.div>
          </div>
        )}

        {/* العمود الرأسي للأرقام العائم فوق كل شيء على الجهة الشمال (مطابق للصورة 2) */}
        {showComboMenu && (
          <div
            className="fixed inset-0 z-[100] select-none flex items-end justify-center pointer-events-auto"
            onClick={(e) => {
              e.stopPropagation();
              setShowComboMenu(false);
              setShowCustomInput(false);
            }}
          >
            <div className="w-full max-w-md relative h-full pointer-events-none">
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.95 }}
                transition={{ duration: 0.16 }}
                className="absolute bottom-14 left-4 w-24 bg-[#252735] border border-white/10 rounded-[22px] shadow-[0_16px_50px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col backdrop-blur-md pointer-events-auto mb-1"
                onClick={(e) => e.stopPropagation()}
              >
                {/* صف "آخر" - إدخال الرقم يدوياً مع زر موافق */}
                <div className="border-b border-white/10">
                  {!showCustomInput ? (
                    <button
                      type="button"
                      onClick={() => setShowCustomInput(true)}
                      className="w-full py-2.5 text-center text-sm font-bold text-white hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      آخر
                    </button>
                  ) : (
                    <div className="p-1.5 flex flex-col gap-1 bg-[#1A1C27]">
                      <input
                        type="number"
                        min="1"
                        max="99999"
                        value={customCountInput}
                        onChange={(e) => setCustomCountInput(e.target.value)}
                        placeholder="الرقم"
                        autoFocus
                        className="w-full px-1 py-1 rounded-md bg-slate-900 text-amber-300 text-xs font-mono font-bold border border-white/20 text-center outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const num = parseInt(customCountInput, 10);
                          if (num > 0) {
                            setComboCount(num);
                          }
                          setShowCustomInput(false);
                          setShowComboMenu(false);
                        }}
                        className="w-full py-1 rounded-md bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-[10px] font-black cursor-pointer shadow-xs active:scale-95"
                      >
                        موافق
                      </button>
                    </div>
                  )}
                </div>

                {/* الأرقام المطابقة للصورة: 777, 555, 77, 17, 7, 1 */}
                {[777, 555, 77, 17, 7, 1].map((num, idx, arr) => {
                  const isSelected = comboCount === num;
                  return (
                    <button
                      key={num}
                      type="button"
                      onClick={() => {
                        setComboCount(num);
                        setCustomCountInput(String(num));
                        setShowCustomInput(false);
                        setShowComboMenu(false);
                      }}
                      className={`w-full py-2.5 text-center font-mono cursor-pointer transition-colors hover:bg-white/5 select-none ${
                        idx < arr.length - 1 ? 'border-b border-white/10' : ''
                      } ${
                        isSelected
                          ? 'text-[#10B981] font-black text-base drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                          : 'text-white font-bold text-sm'
                      }`}
                    >
                      {num}
                    </button>
                  );
                })}
              </motion.div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default RoomGiftBoxModal;
