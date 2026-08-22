import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';

export interface LuckyChestWinnerNoticeData {
  id: string;
  userName: string;
  avatar: string;
  wonAmount: number;
  chestType?: 'normal' | 'super' | 'bag';
}

interface LuckyChestWinnerToastProps {
  winnerNotice: LuckyChestWinnerNoticeData | null;
  onOpenUserProfile?: () => void;
}

export const LuckyChestWinnerToast: React.FC<LuckyChestWinnerToastProps> = ({
  winnerNotice,
  onOpenUserProfile
}) => {
  return (
    <AnimatePresence>
      {winnerNotice && (
        <motion.div
          key={winnerNotice.id}
          initial={{ opacity: 0, x: 120, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -120, scale: 0.9 }}
          transition={{ type: 'spring', damping: 22, stiffness: 300 }}
          onClick={onOpenUserProfile}
          className="absolute top-[37%] right-2 sm:right-4 z-25 max-w-[280px] bg-gradient-to-l from-amber-950/90 via-slate-900/90 to-[#19243C]/90 border border-amber-400/60 rounded-2xl py-1 px-2.5 shadow-[0_6px_25px_rgba(0,0,0,0.7)] backdrop-blur-md flex items-center justify-between gap-2 cursor-pointer select-none pointer-events-auto filter drop-shadow-md"
          dir="rtl"
        >
          {/* Winner Avatar with Golden Ring */}
          <div className="relative shrink-0 w-7 h-7 rounded-full border border-amber-400 p-0.2 bg-slate-900 shadow-sm overflow-hidden flex items-center justify-center">
            <img
              src={
                winnerNotice.avatar ||
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'
              }
              alt={winnerNotice.userName}
              className="w-full h-full object-cover rounded-full"
            />
          </div>

          {/* Winner Info: Name + Action Text */}
          <div className="flex flex-col min-w-0 flex-1 leading-tight text-right pr-0.5">
            <span className="text-[11px] font-bold text-amber-200 truncate">
              {winnerNotice.userName}
            </span>
            <span className="text-[9.5px] font-medium text-slate-300 truncate">
              انقض على صندوق الحظ 🎁
            </span>
          </div>

          {/* Winning Coins Badge */}
          <div className="flex items-center gap-1 shrink-0 px-2 py-0.5 rounded-lg bg-amber-500/20 border border-amber-400/50 text-amber-300">
            <Sparkles className="w-3 h-3 text-amber-300 fill-amber-300 animate-pulse" />
            <span className="text-xs font-black font-mono tracking-tight text-amber-300">
              +{winnerNotice.wonAmount.toLocaleString()}
            </span>
            <span className="text-[10px]">🪙</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
