import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Trophy } from 'lucide-react';
import { RefundDrawResult } from '../lib/refundVaultService';

interface LuckyRefundModalProps {
  result: RefundDrawResult | null;
  onClose: () => void;
  onConfirmCollect?: () => void;
}

export const LuckyRefundModal: React.FC<LuckyRefundModalProps> = ({
  result,
  onClose,
  onConfirmCollect
}) => {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const onConfirmRef = useRef(onConfirmCollect);
  onConfirmRef.current = onConfirmCollect;

  useEffect(() => {
    if (!result) return;

    // Disappear strictly after 3 seconds as requested (3000ms)
    const timer = setTimeout(() => {
      onCloseRef.current();
      if (onConfirmRef.current) onConfirmRef.current();
    }, 3000);

    return () => clearTimeout(timer);
  }, [result?.id]);

  if (!result) return null;

  const isMega = result.winTier === 'mega_jackpot';
  const isBig = result.winTier === 'big';

  const handleDismiss = () => {
    onClose();
    if (onConfirmCollect) onConfirmCollect();
  };

  return (
    <AnimatePresence mode="wait">
      {/* Floating directly in the center of the screen, ultra-compact, auto-dismisses in 3s */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[105] pointer-events-none select-none dir-rtl">
        <motion.div
          key={result.id}
          initial={{ opacity: 0, scale: 0.7, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.65, y: -15 }}
          transition={{ type: 'spring', damping: 22, stiffness: 420 }}
          onClick={handleDismiss}
          className={`pointer-events-auto cursor-pointer flex items-center gap-2 px-3.5 py-1.5 rounded-full border shadow-2xl backdrop-blur-md whitespace-nowrap transition-transform active:scale-95 ${
            isMega
              ? 'bg-gradient-to-r from-amber-950/95 via-yellow-900/95 to-slate-950/95 border-amber-400 text-amber-100 shadow-[0_0_24px_rgba(245,158,11,0.7)]'
              : isBig
              ? 'bg-gradient-to-r from-purple-950/95 via-pink-950/95 to-slate-950/95 border-purple-400 text-purple-100 shadow-[0_0_20px_rgba(168,85,247,0.6)]'
              : 'bg-gradient-to-r from-slate-950/95 via-emerald-950/95 to-slate-950/95 border-emerald-400/80 text-emerald-100 shadow-[0_0_16px_rgba(16,185,129,0.5)]'
          }`}
        >
          {/* Mini Icon */}
          {isMega ? (
            <Trophy className="w-4 h-4 text-amber-300 animate-bounce shrink-0" />
          ) : isBig ? (
            <Sparkles className="w-4 h-4 text-purple-300 animate-pulse shrink-0" />
          ) : (
            <span className="text-sm shrink-0">✨</span>
          )}

          {/* Label */}
          <span className="text-[11px] font-black text-slate-200">
            {isMega ? 'الجائزة الكبرى:' : isBig ? 'مردود كبير:' : 'استرداد:'}
          </span>

          {/* Fixed Won Amount - Instant and stable */}
          <div className="flex items-center gap-1">
            <span
              className={`text-base sm:text-lg font-mono font-black tracking-tight ${
                isMega
                  ? 'text-amber-300 drop-shadow-[0_0_8px_rgba(245,158,11,0.9)]'
                  : isBig
                  ? 'text-purple-300 drop-shadow-[0_0_8px_rgba(168,85,247,0.9)]'
                  : 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.9)]'
              }`}
            >
              +{result.refundCoins.toLocaleString('en-US')}
            </span>
            <span className="text-xs">🪙</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
