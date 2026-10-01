import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion } from 'motion/react';
import { 
  EmojiSlotItem, 
  EmojiCategory,
  EMOJI_TABS,
  getEmojisFromCache, 
  getOrHydrateEmojisOnDemand, 
  setupDashboardMessageListener 
} from '../../lib/emojiService';

export interface RoomEmojiPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEmoji: (emoji: EmojiSlotItem) => void;
}

/**
 * مربع إيموجي منفصل ومستقل كلياً (Isolated On-Demand Slot Card)
 * - تحميل مستقل عند الطلب (On-Demand Loading).
 * - معزول تماماً ومحصن بـ React.memo لمنع أي إعادة تصيير غير لازمة للمربعات الأخرى.
 */
interface EmojiSlotCardProps {
  item: EmojiSlotItem;
  onSelect: (item: EmojiSlotItem) => void;
}

const RoomEmojiSlotCard = React.memo<EmojiSlotCardProps>(({ item, onSelect }) => {
  const [isTapped, setIsTapped] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsTapped(true);
    setTimeout(() => setIsTapped(false), 260);
    onSelect(item);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`relative flex flex-col items-center justify-between p-2 rounded-2xl bg-[#F6F7F9] hover:bg-[#EEF1F5] active:scale-90 transition-all cursor-pointer aspect-square select-none shadow-[0_1px_2px_rgba(0,0,0,0.02)] ${
        isTapped ? 'ring-2 ring-[#00C48C] bg-emerald-50 scale-95' : ''
      }`}
    >
      {/* الشارة المستقلة للمربع إن وجدت */}
      {item.badge && (
        <span className="absolute top-1 left-1 px-1 py-0.2 rounded text-[7px] font-black bg-rose-500 text-white uppercase">
          {item.badge}
        </span>
      )}

      {/* الرمز أو الصورة التعبيرية في المنتصف بتحميل كسول عند الطلب */}
      <div className="text-3xl my-auto select-none flex items-center justify-center transform hover:scale-110 transition-transform">
        {item.iconUrl ? (
          <img
            src={item.iconUrl}
            alt={item.name}
            loading="lazy"
            decoding="async"
            className="w-9 h-9 object-contain drop-shadow-xs"
          />
        ) : (
          <span>{item.emoji}</span>
        )}
      </div>

      {/* اسم التفاعل بالعربي */}
      <span className="text-[11px] font-medium text-slate-700 truncate max-w-full text-center mt-0.5 leading-tight">
        {item.name}
      </span>
    </button>
  );
});

RoomEmojiSlotCard.displayName = 'RoomEmojiSlotCard';

/**
 * نافذة الإيموجي والتعبيرات الصوتية (RoomEmojiPickerModal)
 * 1. مكبرة للأعلى بمقدار 1 سم وثابتة الارتفاع تماماً بدون أي اهتزاز أو تغيير في الأبعاد.
 * 2. التمرير لليمين واليسار متصل بحركة الإصبع المباشرة (Live Touch Follower Slider).
 *    يستطيع المستخدم رؤية الصفحة التالية تنسحب تدريجياً مع حركة الإصبع في نفس اللحظة.
 * 3. الروم يظل ظاهراً وواضحاً تماماً 100% بدون أي ضباب.
 * 4. كل مربع تحميل عند الطلب ومنفصل تماماً.
 */
export const RoomEmojiPickerModal: React.FC<RoomEmojiPickerModalProps> = ({
  isOpen,
  onClose,
  onSelectEmoji
}) => {
  const [emojis, setEmojis] = useState<EmojiSlotItem[]>(getEmojisFromCache());
  const [activeTabIndex, setActiveTabIndex] = useState<number>(1); // تبدأ افتراضياً على 'مجاني' (index 1)
  
  // حالة السحب الحية التفاعلية مع الإصبع
  const [dragOffsetPx, setDragOffsetPx] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);
  const isHorizontalSwipe = useRef<boolean | null>(null);

  const tabList = useMemo(() => EMOJI_TABS, []);

  // التحديث الصامت التلقائي عند الطلب وتخزينه في ذاكرة الجوال
  useEffect(() => {
    if (!isOpen) return;

    // جلب التحديثات فوراً عند الطلب (On-Demand Hydration)
    getOrHydrateEmojisOnDemand().then((hydratedList) => {
      setEmojis(hydratedList);
    });

    // مستمع لرسائل الداشبورد الخارجية
    const unsubscribeDashboard = setupDashboardMessageListener((updatedList) => {
      setEmojis(updatedList);
    });

    return () => {
      unsubscribeDashboard();
    };
  }, [isOpen]);

  // تقسيم الإيموجي حسب التبويبات لتسريع الأداء وتحميلها عند الطلب
  const categorizedEmojis = useMemo(() => {
    const map: Record<string, EmojiSlotItem[]> = {
      free: [],
      emoji: [],
      featured: [],
      custom: [],
      vip: [],
      events: [],
      classic: [],
      energy: [],
      games: []
    };

    emojis.forEach((item) => {
      const cat = item.category as string;
      if (cat === 'free' || cat === 'classic') {
        map.free.push(item);
      } else if (cat === 'emoji') {
        map.emoji.push(item);
      } else if (cat === 'featured' || cat === 'energy') {
        map.featured.push(item);
      } else if (cat === 'custom') {
        map.custom.push(item);
      } else if (cat === 'vip') {
        map.vip.push(item);
      } else if (cat === 'events' || cat === 'games') {
        map.events.push(item);
      } else {
        if (!map[cat]) {
          map[cat] = [];
        }
        map[cat].push(item);
      }
    });

    return map;
  }, [emojis]);

  // معالجات السحب المباشر باللمس مع حركة الإصبع (Live Touch Follower)
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
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = currentX - touchStartPos.current.x;
    const diffY = currentY - touchStartPos.current.y;

    // تحديد اتجاه الحركة في بداية السحب
    if (isHorizontalSwipe.current === null) {
      if (Math.abs(diffX) > 8 || Math.abs(diffY) > 8) {
        isHorizontalSwipe.current = Math.abs(diffX) > Math.abs(diffY);
      }
    }

    // إذا كان السحب أفقياً، نربط موضع الكاروسيل بإصبع المستخدم لحظياً!
    if (isHorizontalSwipe.current) {
      // مقاومة مطاطية عند أطراف الشاشة الأولى والأخيرة
      let boundedDiff = diffX;
      if (
        (activeTabIndex === 0 && diffX > 0) ||
        (activeTabIndex === tabList.length - 1 && diffX < 0)
      ) {
        boundedDiff = diffX * 0.28;
      }
      setDragOffsetPx(boundedDiff);
    }
  };

  const handleTouchEnd = () => {
    if (isHorizontalSwipe.current && containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth || 360;
      const threshold = Math.min(containerWidth * 0.18, 55);

      if (dragOffsetPx < -threshold && activeTabIndex < tabList.length - 1) {
        // سحب لليسار -> الانتقال للقائمة التالية
        setActiveTabIndex((prev) => prev + 1);
      } else if (dragOffsetPx > threshold && activeTabIndex > 0) {
        // سحب لليمين -> الانتقال للقائمة السابقة
        setActiveTabIndex((prev) => prev - 1);
      }
    }

    // إعادة الضبط بسلاسة
    setIsDragging(false);
    setDragOffsetPx(0);
    touchStartPos.current = null;
    isHorizontalSwipe.current = null;
  };

  // دعم السحب بالفأرة للتجربة على المتصفح والكمبيوتر
  const handleMouseDown = (e: React.MouseEvent) => {
    touchStartPos.current = { x: e.clientX, y: e.clientY };
    isHorizontalSwipe.current = null;
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !touchStartPos.current) return;
    const diffX = e.clientX - touchStartPos.current.x;
    let boundedDiff = diffX;
    if (
      (activeTabIndex === 0 && diffX > 0) ||
      (activeTabIndex === tabList.length - 1 && diffX < 0)
    ) {
      boundedDiff = diffX * 0.28;
    }
    setDragOffsetPx(boundedDiff);
  };

  const handleMouseUp = () => {
    if (isDragging) {
      handleTouchEnd();
    }
  };

  const handleSelectSlot = useCallback((item: EmojiSlotItem) => {
    onSelectEmoji(item);
  }, [onSelectEmoji]);

  if (!isOpen) return null;

  const currentTab = tabList[activeTabIndex] || tabList[0];

  return (
    /* خلفية شفافة تماماً بدون أي ضباب لضمان وضوح الروم 100% */
    <div
      className="fixed inset-0 z-50 flex items-end justify-center select-none bg-transparent"
      onClick={onClose}
    >
      {/* 
        حاوية النافذة: 
        - مكبرة للأعلى بمقدار 1 سم (calc(38vh + 1cm)).
        - ثابتة الأبعاد تماماً بدون أي تكبير أو تصغير عند تقليب الصفحات.
      */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ height: 'calc(38vh + 1cm)' }}
        className="w-full max-w-md bg-white text-slate-900 rounded-t-[24px] shadow-[0_-8px_30px_rgba(0,0,0,0.18)] flex flex-col min-h-[calc(38vh+1cm)] max-h-[calc(38vh+1cm)] overflow-hidden border-t border-slate-100"
        dir="rtl"
      >
        {/* مقبض سحب صغير وأنيق في الأعلى */}
        <div className="pt-2 pb-1 shrink-0 flex justify-center items-center">
          <div className="w-10 h-1 bg-slate-200 rounded-full" />
        </div>

        {/* 1. التبويبات مباشرة في الأعلى بدون شريط إضافي */}
        <div className="flex items-center justify-between px-3 border-b border-slate-100 shrink-0 bg-white overflow-x-auto no-scrollbar">
          {tabList.map((tab, idx) => {
            const isActive = activeTabIndex === idx;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTabIndex(idx);
                  setDragOffsetPx(0);
                }}
                className={`py-1.5 px-2.5 relative flex flex-col items-center justify-center transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'text-slate-900 font-black text-sm'
                    : 'text-slate-400 font-bold text-xs hover:text-slate-600'
                }`}
              >
                <span>{tab.label}</span>
                {/* المؤشر الأخضر الأنيق المتنقل بدقة تحت التبويب النشط */}
                {isActive && (
                  <motion.span
                    layoutId="fixedTabIndicatorBar"
                    className="block w-4 h-1 bg-[#00C48C] rounded-full mx-auto mt-1"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}
                {!isActive && <span className="block w-4 h-1 bg-transparent mx-auto mt-1" />}
              </button>
            );
          })}
        </div>

        {/* 
          2. مسار السحب التفاعلي المتصل بحركة الإصبع الحية (Live Touch Follower Track)
          يتحرك في نفس لحظة السحب لتظهر الصفحة التالية وتنسحب جنباً إلى جنب مع إصبع المستخدم
        */}
        <div
          ref={containerRef}
          className="flex-1 h-full overflow-hidden relative cursor-grab active:cursor-grabbing"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          dir="ltr" /* توحيد الإحداثيات الأفقية لمنع أي تعارض في التحريك */
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              width: `${tabList.length * 100}%`,
              height: '100%',
              transform: `translateX(calc(-${activeTabIndex * (100 / tabList.length)}% + ${dragOffsetPx}px))`,
              transition: isDragging ? 'none' : 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
              willChange: 'transform'
            }}
          >
            {tabList.map((tab, idx) => {
              const tabItems = categorizedEmojis[tab.id] || [];

              return (
                <div
                  key={tab.id}
                  style={{ width: `${100 / tabList.length}%` }}
                  className="h-full shrink-0 flex flex-col overflow-hidden"
                  dir="rtl" /* إعادة الاتجاه العربي للمحتوى الداخلي */
                >
                  {/* حاوية التمرير الرأسي للأعلى والأسفل داخل كل قسم */}
                  <div className="h-full overflow-y-auto overscroll-contain p-3 pb-8">
                    <div className="grid grid-cols-4 gap-2.5">
                      {tabItems.map((item) => (
                        <RoomEmojiSlotCard
                          key={item.id}
                          item={item}
                          onSelect={handleSelectSlot}
                        />
                      ))}
                    </div>

                    {tabItems.length === 0 && (
                      <div className="py-12 text-center text-slate-400 text-xs font-bold">
                        لا توجد عناصر مضافة في هذا القسم حالياً
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomEmojiPickerModal;
