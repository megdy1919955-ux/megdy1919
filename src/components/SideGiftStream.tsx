import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Trophy, Gift, ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react';

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
  onOpenUserProfile?: (userData: any) => void;
}

export const SideGiftStream: React.FC<SideGiftStreamProps> = ({
  events,
  onExpireEvent,
  onOpenUserProfile
}) => {
  // Y-axis offset for moving/dragging the gift stream up and down (محاذاة وتحريك الإشعارات للأعلى والأسفل)
  const [verticalOffset, setVerticalOffset] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('super_legend_gift_stream_offset_y');
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed)) return parsed;
      }
    } catch (e) {}
    return 0;
  });

  const [isAdjustingPosition, setIsAdjustingPosition] = useState<boolean>(false);

  // Auto-expire individual notifications after 10s
  useEffect(() => {
    if (events.length === 0) return;

    const now = Date.now();
    const timers = events.map((ev) => {
      const remainingTime = Math.max(200, 10000 - (now - ev.timestamp));
      return setTimeout(() => {
        onExpireEvent(ev.id);
      }, remainingTime);
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [events, onExpireEvent]);

  // Persist vertical offset position
  const updateVerticalOffset = (newOffset: number) => {
    // Constrain offset between -280px (upwards towards mics) and 120px (downwards towards dock)
    const clamped = Math.max(-280, Math.min(120, newOffset));
    setVerticalOffset(clamped);
    try {
      localStorage.setItem('super_legend_gift_stream_offset_y', clamped.toString());
    } catch (e) {}
  };

  if (events.length === 0) return null;

  return (
    <motion.div
      id="side-gift-stream"
      drag="y"
      dragConstraints={{ top: -280, bottom: 120 }}
      dragElastic={0.15}
      onDragEnd={(_, info) => {
        updateVerticalOffset(verticalOffset + info.offset.y);
      }}
      animate={{ y: verticalOffset }}
      transition={{ type: 'spring', damping: 25, stiffness: 280 }}
      className="absolute bottom-2 left-2 z-30 pointer-events-auto flex flex-col gap-1.5 w-auto max-w-[55vw] sm:max-w-[270px] select-none touch-none py-1 pr-1 group"
    >
      {/* POSITION CONTROL HANDLE: Tap or hover to nudge notifications up or down */}
      <div className="flex items-center justify-between px-1 -mb-1 opacity-0 group-hover:opacity-100 sm:opacity-0 transition-opacity duration-200">
        <div className="flex items-center gap-1 bg-slate-950/80 backdrop-blur-md border border-white/10 rounded-full px-2 py-0.5 shadow-md">
          <button
            onClick={(e) => {
              e.stopPropagation();
              updateVerticalOffset(verticalOffset - 35);
            }}
            className="text-slate-300 hover:text-amber-300 active:scale-90 transition-transform p-0.5"
            title="تحريك إشعارات الهدايا للأعلى ⬆️"
          >
            <ChevronUp className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
          <span className="text-[8.5px] font-bold text-slate-300 font-mono flex items-center gap-0.5">
            <ArrowUpDown className="w-2.5 h-2.5 text-amber-400" />
            <span>سحب للتحريك</span>
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              updateVerticalOffset(verticalOffset + 35);
            }}
            className="text-slate-300 hover:text-amber-300 active:scale-90 transition-transform p-0.5"
            title="تحريك إشعارات الهدايا للأسفل ⬇️"
          >
            <ChevronDown className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
          {verticalOffset !== 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                updateVerticalOffset(0);
              }}
              className="text-[8px] text-rose-300 hover:text-rose-200 underline font-bold ml-1"
              title="إعادة التمركز الافتراضي"
            >
              إعادة
            </button>
          )}
        </div>
      </div>

      {/* SEQUENTIAL STACKING LIST (نظام تجميع الهدايا المتتابعة بحيث لا تتداخل بل تترتب تحت بعضها) */}
      <AnimatePresence initial={false}>
        {events.slice(-5).map((ev, index) => {
          const isWin = ev.actionType === 'refund_win' || ev.actionType === 'jackpot';
          const isJackpot = ev.actionType === 'jackpot';

          return (
            <motion.div
              key={ev.id}
              layout="position"
              initial={{ opacity: 0, x: -45, scale: 0.88, y: -10 }}
              animate={{ opacity: 1, x: 0, scale: 1, y: 0 }}
              exit={{ opacity: 0, x: -35, scale: 0.85, transition: { duration: 0.28 } }}
              transition={{ type: 'spring', damping: 24, stiffness: 340 }}
              onClick={() => {
                if (onOpenUserProfile) {
                  onOpenUserProfile({
                    id: ev.id,
                    name: ev.senderName,
                    avatar: ev.senderAvatar,
                    customBio: `الداعم ${ev.senderName}`
                  });
                }
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl border backdrop-blur-md shadow-[0_6px_20px_rgba(0,0,0,0.6)] transition-all cursor-pointer active:scale-95 pointer-events-auto shrink-0 relative overflow-hidden ${
                isJackpot
                  ? 'bg-gradient-to-r from-amber-950/95 via-yellow-950/90 to-slate-950/95 border-amber-400/90 text-amber-100 shadow-amber-500/30'
                  : isWin
                  ? 'bg-gradient-to-r from-purple-950/95 via-pink-950/90 to-slate-950/95 border-purple-400/80 text-purple-100 shadow-purple-500/30'
                  : 'bg-gradient-to-r from-[#111726]/95 via-[#182033]/95 to-[#1c132b]/95 border-amber-400/50 text-slate-100 shadow-slate-950/60 hover:border-amber-400'
              }`}
            >
              {/* Subtle top shimmer glow bar */}
              <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent pointer-events-none" />

              {/* Sender Mini Circular Avatar */}
              <div className="relative shrink-0">
                <img
                  src={
                    ev.senderAvatar ||
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'
                  }
                  alt={ev.senderName}
                  className="w-6.5 h-6.5 rounded-full object-cover border border-amber-400/80 shadow-xs"
                />
                {isJackpot ? (
                  <Trophy className="w-3 h-3 text-amber-300 absolute -top-1 -right-1 drop-shadow-md" />
                ) : isWin ? (
                  <Sparkles className="w-3 h-3 text-purple-300 absolute -top-1 -right-1 drop-shadow-md" />
                ) : (
                  <Gift className="w-3 h-3 text-pink-400 absolute -top-1 -right-1 drop-shadow-md" />
                )}
              </div>

              {/* Text Information Column (Sender Name Top, Recipient / Win Detail Bottom) */}
              <div className="flex flex-col min-w-0 flex-1 leading-tight text-right">
                <div className="flex items-center gap-1 justify-between">
                  <span className="text-[11px] font-black text-amber-300 truncate max-w-[85px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                    {ev.senderName}
                  </span>
                  <span className="text-[9.5px] text-amber-100/90 font-bold whitespace-nowrap px-1 py-0.2 rounded bg-white/10 text-[8.5px]">
                    {isWin ? 'ربح 🎯' : 'أهدى 🎁'}
                  </span>
                </div>

                <div className="text-[9.5px] text-slate-200 truncate font-semibold mt-0.5 flex items-center gap-1">
                  {isWin ? (
                    <span className="text-emerald-300 font-mono font-bold">
                      +{ev.coinsWon?.toLocaleString('en-US')} 🪙
                    </span>
                  ) : (
                    <>
                      <span className="text-slate-400 text-[9px]">إلى</span>
                      <span className="text-amber-200 font-bold truncate max-w-[80px]">{ev.targetName || 'الروم'}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Gift Icon / Multiplier Quantity Tag */}
              <div className="flex items-center gap-1 shrink-0 pl-0.5">
                {ev.giftIcon && (
                  <span className="text-sm sm:text-base drop-shadow-md animate-pulse">{ev.giftIcon}</span>
                )}
                {!isWin && ev.quantity && ev.quantity > 1 && (
                  <motion.span
                    key={ev.quantity}
                    initial={{ scale: 1.4 }}
                    animate={{ scale: 1 }}
                    className="text-xs font-black text-amber-300 font-mono italic tracking-tighter bg-amber-500/20 border border-amber-400/50 px-1 py-0.2 rounded-md shadow-xs"
                  >
                    x{ev.quantity}
                  </motion.span>
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
};
