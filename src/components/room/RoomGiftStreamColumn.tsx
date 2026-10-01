import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, Sparkles } from 'lucide-react';

export interface RoomGiftStreamItem {
  id: string;
  senderName: string;
  senderAvatar?: string;
  receiverName?: string;
  giftName: string;
  giftIcon: string;
  comboCount: number;
  giftValue?: number;
}

export interface RoomGiftStreamColumnProps {
  giftEvents: RoomGiftStreamItem[];
  onGiftClick?: (gift: RoomGiftStreamItem) => void;
}

/**
 * مكون مسار الهدايا العمودي المستقل بنسبة 20% على جهة الشمال (RoomGiftStreamColumn)
 * - منفصل 100% ومستقل عن شات الرسائل وعن المايكات وعن الهيدر.
 * - يظهر فقاعات مستطيلة عمودية ومتحركة ببريق ملكي للهدايا المضروبة وكومبو الهدايا.
 * - يختفي كل إشعار بسلاسة بعد انتهاء عرضه أو تراكمه.
 */
export const RoomGiftStreamColumn: React.FC<RoomGiftStreamColumnProps> = ({
  giftEvents,
  onGiftClick
}) => {
  return (
    <div
      id="room-gift-stream-column-20"
      className="w-full h-full flex flex-col justify-end items-center gap-1.5 overflow-hidden pointer-events-auto select-none py-1"
    >
      <AnimatePresence mode="popLayout">
        {giftEvents.slice(-4).map((gift) => (
          <motion.div
            key={gift.id}
            initial={{ opacity: 0, x: -25, scale: 0.85 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7, transition: { duration: 0.25 } }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            onClick={() => onGiftClick && onGiftClick(gift)}
            className="w-full flex flex-col items-center bg-gradient-to-b from-[#2a0845]/90 via-[#1b0836]/90 to-[#0f041d]/90 border border-amber-400/40 hover:border-amber-300 rounded-xl p-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.5)] cursor-pointer group active:scale-95 transition-transform"
          >
            {/* أيقونة الهدية الكبيرة مع تأثير وميض */}
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center shrink-0">
              <span className="text-2xl drop-shadow-[0_2px_8px_rgba(251,191,36,0.6)] animate-pulse">
                {gift.giftIcon || '🎁'}
              </span>

              {/* عداد الكومبو المشع */}
              {gift.comboCount > 1 && (
                <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black text-[10px] px-1 rounded-full shadow-md leading-tight">
                  x{gift.comboCount}
                </div>
              )}
            </div>

            {/* اسم الهدية الصغير */}
            <span className="text-[10px] text-amber-200 font-bold truncate max-w-full text-center leading-none mt-1">
              {gift.giftName}
            </span>

            {/* اسم الراسل المختصر */}
            <span className="text-[9px] text-slate-300 truncate max-w-full text-center leading-tight opacity-80">
              {gift.senderName}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
