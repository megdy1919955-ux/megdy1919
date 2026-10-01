import React from 'react';
import { Scan, Clock } from 'lucide-react';
import { RoomWallpaperItem } from './wallpaperData';

export interface StoreWallpapersTabProps {
  wallpapers: RoomWallpaperItem[];
  purchasedStoreIds: string[];
  equippedBgUrl: string;
  onPreview: (item: RoomWallpaperItem) => void;
  onBuyOrEquip: (item: RoomWallpaperItem) => void;
}

/**
 * تبويب متجر الخلفيات (عمودين مع بطاقات العرض، مدة الأيام، كوينز، وزر الشراء/التفعيل)
 */
export const StoreWallpapersTab: React.FC<StoreWallpapersTabProps> = ({
  wallpapers,
  purchasedStoreIds,
  equippedBgUrl,
  onPreview,
  onBuyOrEquip
}) => {
  return (
    <div className="p-3.5 pb-10 overflow-y-auto max-h-[70vh] custom-scrollbar flex-1 bg-white">
      <div className="grid grid-cols-2 gap-3 sm:gap-3.5">
        {wallpapers.map((bg) => {
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
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPreview(bg);
                    }}
                    className="bg-black/55 backdrop-blur-xs text-white text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 hover:bg-black/80 transition-colors shadow-xs cursor-pointer"
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
                type="button"
                onClick={() => onBuyOrEquip(bg)}
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
  );
};
