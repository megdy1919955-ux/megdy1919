import React from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';
import { RoomWallpaperItem } from './wallpaperData';

export interface WallpaperFullscreenPreviewProps {
  previewBg: RoomWallpaperItem;
  purchasedStoreIds: string[];
  onClose: () => void;
  onApplyOrBuy: (item: RoomWallpaperItem) => void;
}

/**
 * نافذة المعاينة بملء الشاشة للخلفية قبل الشراء أو التطبيق
 */
export const WallpaperFullscreenPreview: React.FC<WallpaperFullscreenPreviewProps> = ({
  previewBg,
  purchasedStoreIds,
  onClose,
  onApplyOrBuy
}) => {
  const isPurchased = purchasedStoreIds.includes(previewBg.id);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-60 bg-black/90 flex flex-col justify-between p-4 pointer-events-auto select-none dir-rtl"
      onClick={onClose}
    >
      <div className="flex items-center justify-between z-10">
        <span className="text-white font-bold text-sm bg-black/50 px-3 py-1 rounded-full backdrop-blur-md">
          معاينة: {previewBg.name}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 cursor-pointer"
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
          type="button"
          onClick={() => onApplyOrBuy(previewBg)}
          className="bg-[#00c765] hover:bg-[#00b058] text-white font-black px-8 py-3 rounded-full text-base shadow-lg transition-transform active:scale-95 cursor-pointer"
        >
          {isPurchased
            ? 'تطبيق الخلفية'
            : `شراء الآن (${previewBg.priceCoins?.toLocaleString()} كوينز)`}
        </button>
      </div>
    </motion.div>
  );
};
