/**
 * نافذة مغادرة الغرفة الصوتية الخفيفة والسريعة (YoHo Lightweight Room Exit Menu)
 * مطابقة لتصميم YoHo السريع والمريح:
 * - خلفية معتمة خفيفة
 * - 3 أزرار دائرية بيضاء مركزية مع أيقونات وعناوين واضحة:
 *   1. احتفظ (Keep / Background floating)
 *   2. خروج (Exit / Leave room)
 *   3. حل الغرفة (Dissolve / Close room for owner)
 * Super Legend App (c) 2026
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Power } from 'lucide-react';

interface RoomExitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeepInBackground: () => void;
  onExit: () => void;
  onDissolveAll: () => void;
  isOwner: boolean;
  roomTitle?: string;
  hostName?: string;
  onTriggerToast?: (msg: string) => void;
}

export const RoomExitModal: React.FC<RoomExitModalProps> = ({
  isOpen,
  onClose,
  onKeepInBackground,
  onExit,
  onDissolveAll,
  isOwner,
  onTriggerToast
}) => {
  if (!isOpen) return null;

  const handleDissolveClick = () => {
    if (!isOwner) {
      if (onTriggerToast) {
        onTriggerToast('إغلاق وحل الغرفة متاح حصرياً لمالك الروم 👑');
      }
      onClose();
      return;
    }
    onDissolveAll();
    onClose();
  };

  return (
    <AnimatePresence>
      <div
        id="yoho-room-exit-backdrop"
        className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/75 backdrop-blur-[3px] select-none pointer-events-auto cursor-pointer"
        onClick={onClose}
        dir="rtl"
      >
        {/* Central Floating Actions Stack */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.85 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="flex flex-col items-center justify-center gap-12 sm:gap-14 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 1. احتفظ (Keep / Floating Widget) */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.02 }}
            className="flex flex-col items-center"
          >
            <button
              id="room-exit-keep-btn"
              onClick={() => {
                onKeepInBackground();
                onClose();
              }}
              className="w-[76px] h-[76px] sm:w-[84px] sm:h-[84px] rounded-full bg-white hover:bg-slate-100 active:scale-90 transition-transform shadow-[0_10px_30px_rgba(0,0,0,0.6)] flex items-center justify-center text-slate-900 cursor-pointer"
              title="احتفظ"
            >
              {/* Plus icon with framing ticks matching YoHo */}
              <svg
                className="w-9 h-9 sm:w-10 sm:h-10 text-slate-900"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="6" x2="12" y2="18" />
                <line x1="6" y1="12" x2="18" y2="12" />
                <path d="M5 8V5h3" />
                <path d="M19 8V5h-3" />
                <path d="M5 16v3h3" />
                <path d="M19 16v3h-3" />
              </svg>
            </button>
            <span className="text-white text-base sm:text-lg font-bold tracking-wide mt-2.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              احتفظ
            </span>
          </motion.div>

          {/* 2. خروج (Exit / Individual Leave) */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.06 }}
            className="flex flex-col items-center"
          >
            <button
              id="room-exit-leave-btn"
              onClick={() => {
                onExit();
                onClose();
              }}
              className="w-[76px] h-[76px] sm:w-[84px] sm:h-[84px] rounded-full bg-white hover:bg-slate-100 active:scale-90 transition-transform shadow-[0_10px_30px_rgba(0,0,0,0.6)] flex items-center justify-center text-slate-900 cursor-pointer"
              title="خروج"
            >
              <Power
                className="w-9 h-9 sm:w-10 sm:h-10 text-slate-900 stroke-[2.6]"
              />
            </button>
            <span className="text-white text-base sm:text-lg font-bold tracking-wide mt-2.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              خروج
            </span>
          </motion.div>

          {/* 3. حل الغرفة (Dissolve / Close Room) */}
          <motion.div
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            className="flex flex-col items-center"
          >
            <button
              id="room-exit-dissolve-btn"
              onClick={handleDissolveClick}
              className="w-[76px] h-[76px] sm:w-[84px] sm:h-[84px] rounded-full bg-white hover:bg-slate-100 active:scale-90 transition-transform shadow-[0_10px_30px_rgba(0,0,0,0.6)] flex items-center justify-center text-slate-900 cursor-pointer"
              title="حل الغرفة"
            >
              {/* House with X icon matching YoHo */}
              <svg
                className="w-9 h-9 sm:w-10 sm:h-10 text-slate-900"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 10.5L12 3.5l9 7V20a1.5 1.5 0 0 1-1.5 1.5H4.5A1.5 1.5 0 0 1 3 20V10.5z" />
                <line x1="9.5" y1="12" x2="14.5" y2="17" />
                <line x1="14.5" y1="12" x2="9.5" y2="17" />
              </svg>
            </button>
            <span className="text-white text-base sm:text-lg font-bold tracking-wide mt-2.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              حل الغرفة
            </span>
          </motion.div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
