import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Trophy, Gift } from 'lucide-react';

export interface SideGiftEvent {
  id: string;
  senderName: string;
  senderAvatar?: string;
  actionType: 'gift' | 'refund_win' | 'jackpot';
  giftName: string;
  giftIcon?: string;
  quantity?: number;
  targetName?: string;
  coinsWon?: number;
  timestamp: number;
}

interface SideGiftStreamProps {
  events: SideGiftEvent[];
  onExpireEvent: (id: string) => void;
}

export const SideGiftStream: React.FC<SideGiftStreamProps> = ({
  events,
  onExpireEvent
}) => {
  useEffect(() => {
    if (events.length === 0) return;

    const now = Date.now();
    const timers = events.map((ev) => {
      const remainingTime = Math.max(200, 4200 - (now - ev.timestamp));
      return setTimeout(() => {
        onExpireEvent(ev.id);
      }, remainingTime);
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [events, onExpireEvent]);

  if (events.length === 0) return null;

  return (
    <div
      id="side-gift-stream"
      className="absolute bottom-20 sm:bottom-24 left-2.5 z-30 pointer-events-none flex flex-col-reverse gap-1.5 w-auto max-w-[34vw] sm:max-w-[210px] select-none"
    >
      <AnimatePresence initial={false}>
        {events.slice(-3).map((ev) => {
          const isWin = ev.actionType === 'refund_win' || ev.actionType === 'jackpot';
          const isJackpot = ev.actionType === 'jackpot';

          return (
            <motion.div
              key={ev.id}
              layout
              initial={{ opacity: 0, x: -40, scale: 0.85 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.8 }}
              transition={{ type: 'spring', damping: 20, stiffness: 350 }}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-xl border backdrop-blur-md shadow-lg transition-all ${
                isJackpot
                  ? 'bg-gradient-to-r from-amber-950/90 via-yellow-950/85 to-slate-950/90 border-amber-400/80 text-amber-100 shadow-amber-500/20'
                  : isWin
                  ? 'bg-gradient-to-r from-purple-950/90 via-pink-950/85 to-slate-950/90 border-purple-400/70 text-purple-100 shadow-purple-500/20'
                  : 'bg-gradient-to-r from-slate-950/90 via-slate-900/90 to-purple-950/80 border-purple-500/40 text-slate-100 shadow-slate-950/50'
              }`}
            >
              {/* Sender Mini Avatar */}
              <div className="relative shrink-0">
                <img
                  src={
                    ev.senderAvatar ||
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'
                  }
                  alt={ev.senderName}
                  className="w-5 h-5 rounded-full object-cover border border-white/20 shadow-xs"
                />
                {isJackpot ? (
                  <Trophy className="w-2.5 h-2.5 text-amber-300 absolute -top-1 -right-1" />
                ) : isWin ? (
                  <Sparkles className="w-2.5 h-2.5 text-purple-300 absolute -top-1 -right-1" />
                ) : (
                  <Gift className="w-2.5 h-2.5 text-pink-400 absolute -top-1 -right-1" />
                )}
              </div>

              {/* Text Information Column */}
              <div className="flex flex-col min-w-0 flex-1 leading-tight">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-black text-amber-300 truncate max-w-[65px]">
                    {ev.senderName}
                  </span>
                  <span className="text-[9px] text-slate-300 font-bold whitespace-nowrap">
                    {isWin ? 'ربح' : 'دعم'}
                  </span>
                </div>

                <div className="text-[9px] text-slate-300 truncate font-semibold">
                  {isWin ? (
                    <span className="text-emerald-300 font-mono font-bold">
                      +{ev.coinsWon?.toLocaleString('en-US')} 🪙
                    </span>
                  ) : (
                    <span>إلى {ev.targetName || 'الروم'}</span>
                  )}
                </div>
              </div>

              {/* Gift Icon / Count Tag */}
              <div className="flex items-center gap-0.5 shrink-0 pl-0.5">
                {ev.giftIcon && (
                  <span className="text-xs sm:text-sm drop-shadow-xs">{ev.giftIcon}</span>
                )}
                {!isWin && ev.quantity && ev.quantity > 1 && (
                  <span className="text-[10px] font-black text-yellow-300 font-mono tracking-tighter">
                    x{ev.quantity}
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
