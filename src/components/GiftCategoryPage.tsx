import React, { useState, useEffect } from 'react';
import { GiftItem } from '../lib/giftCmsService';
import { SingleGiftCard } from './SingleGiftCard';

export interface GiftCategoryPageProps {
  category: string;
  selectedSubTab: string;
  giftsList: GiftItem[];
  selectedGiftId?: string;
  isActivePage: boolean;
  onSelectGift: (gift: GiftItem) => void;
}

/**
 * صفحة فئة الهدايا المستقلة (Lazy Category Page with Device Memory Retention)
 * لا يتم استدعاؤها أو معالجة هداياها في ذاكرة الجوال إلا عندما يقوم المستخدم بالانتقال إليها
 * وبمجرد تحميلها تبقى محفوظة في ذاكرة الهاتف وتعمل فوراً بدون تأخير
 */
export const GiftCategoryPage: React.FC<GiftCategoryPageProps> = ({
  category,
  selectedSubTab,
  giftsList,
  selectedGiftId,
  isActivePage,
  onSelectGift
}) => {
  // تبقى الصفحة نشطة ومحفوظة في الذاكرة بعد أول فتح لها
  const [hasBeenActivated, setHasBeenActivated] = useState<boolean>(isActivePage);

  useEffect(() => {
    if (isActivePage && !hasBeenActivated) {
      setHasBeenActivated(true);
    }
  }, [isActivePage, hasBeenActivated]);

  // إذا لم يطلب المستخدم هذه الصفحة بعد، لا يتم تحميل أي شيء منها لتوفير ذاكرة الهاتف
  if (!hasBeenActivated) {
    return (
      <div className="w-full shrink-0 snap-center px-1.5 py-1.5 min-h-[160px] flex items-center justify-center">
        <div className="flex items-center gap-1.5 text-slate-500 text-xs">
          <span className="animate-pulse">⏳</span>
          <span>يتم التحميل عند الطلب...</span>
        </div>
      </div>
    );
  }

  const catGifts = giftsList.filter((gift) => {
    if (category === 'الكل') return true;
    if (gift.category !== category) return false;
    if (category === 'الفعالية' && selectedSubTab !== 'الكل' && gift.subCategory) {
      return gift.subCategory === selectedSubTab;
    }
    return true;
  });

  return (
    <div className="w-full shrink-0 snap-center px-1.5 py-1.5 overflow-y-auto no-scrollbar">
      <div className="grid grid-cols-4 gap-1.5 w-full">
        {catGifts.map((gift) => (
          <SingleGiftCard
            key={gift.id}
            gift={gift}
            isSelected={selectedGiftId === gift.id}
            category={category}
            onSelect={onSelectGift}
          />
        ))}
      </div>
    </div>
  );
};

export default GiftCategoryPage;

