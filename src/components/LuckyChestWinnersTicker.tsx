import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Crown } from 'lucide-react';

export interface LuckyChestWinnerNoticeData {
  id: string;
  userName: string;
  avatar: string;
  wonAmount: number;
  vipLevel?: number;
  nobleLevel?: string;
  isHost?: boolean;
  chestType?: 'normal' | 'super' | 'bag';
}

interface GlidingWinnerItemProps {
  item: LuckyChestWinnerNoticeData;
  onComplete: (id: string) => void;
}

const GlidingWinnerItem: React.FC<GlidingWinnerItemProps> = ({ item, onComplete }) => {
  const vipText = item.vipLevel ? `VIP${item.vipLevel}` : 'VIP6';
  const nobleTag = item.nobleLevel || 'N1';

  return (
    <motion.div
      initial={{ x: '-100vw', opacity: 0 }}
      animate={{
        x: ['-100vw', '0vw', '0vw', '100vw'],
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration: 2.2,
        times: [0, 0.2, 0.75, 1],
        ease: ['easeOut', 'linear', 'easeIn'],
      }}
      onAnimationComplete={() => onComplete(item.id)}
      className="absolute pointer-events-none select-none z-45 flex items-center will-change-transform overflow-visible"
    >
      <div className="relative flex items-center dir-rtl isolate overflow-visible py-1">
        {/* RECTANGULAR CAPSULE BODY - EXACT SAME DESIGN AS JOIN BANNER WITH PURE BLACK BACKGROUND */}
        <div
          style={{ backgroundColor: '#000000', boxShadow: 'none' }}
          className="h-7 sm:h-[28px] py-1 pr-1 pl-3.5 rounded-full bg-[#000000] border border-amber-400/80 flex items-center gap-1.5 sm:gap-2 w-fit select-none relative overflow-visible shadow-md"
        >
          {/* Animated Light Shimmer Sweep */}
          <motion.div
            initial={{ x: '-150%' }}
            animate={{ x: '350%' }}
            transition={{ repeat: Infinity, repeatDelay: 1.5, duration: 1.8, ease: 'easeInOut' }}
            className="absolute inset-y-0 w-16 -skew-x-25 pointer-events-none z-30 overflow-hidden rounded-full"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(251, 191, 36, 0.4) 50%, transparent 100%)',
            }}
          />

          {/* 1. PROTRUDING AVATAR AT THE BEGINNING OF THE RECTANGLE (بارز في بداية المستطيل) */}
          <div className="relative shrink-0 -mr-2 z-30 flex items-center justify-center">
            <div className="w-8 h-8 sm:w-[32px] sm:h-[32px] rounded-full p-[1px] bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-500 ring-2 ring-amber-500/50 shadow-md">
              <img
                src={
                  item.avatar ||
                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'
                }
                alt={item.userName}
                className="w-full h-full rounded-full object-cover border border-slate-950"
              />
            </div>
            {item.isHost && (
              <div className="absolute -top-1.5 -right-1 z-40">
                <Crown className="w-3.5 h-3.5 text-amber-300 fill-amber-400 drop-shadow-md animate-bounce" />
              </div>
            )}
          </div>

          {/* 2. Nobility Badge */}
          {nobleTag && (
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-950/80 border border-emerald-400/60 text-emerald-300 text-[8.5px] font-mono font-black shrink-0">
              {nobleTag}
            </span>
          )}

          {/* 3. VIP Badge */}
          <span className="px-1.5 py-0.2 rounded-full border border-amber-200/80 text-[9px] font-mono font-black tracking-tight flex items-center justify-center shrink-0 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950">
            {vipText}
          </span>

          {/* 4. User Name */}
          <span className="font-black text-[11px] truncate max-w-[110px] sm:max-w-[140px] text-amber-200">
            {item.userName}
          </span>

          {/* 5. Won Amount From Lucky Chest ("مع المبلغ الذي تم اخذه من الصندوق") */}
          <div className="flex items-center gap-1 shrink-0 text-amber-300 font-mono font-black text-[10px] sm:text-[10.5px] whitespace-nowrap">
            <span>ربح +{item.wonAmount.toLocaleString()} كوينز</span>
            <span className="text-[11px]">🪙</span>
          </div>

          {/* 6. Sparkle Accent */}
          <span className="text-[12px] animate-pulse shrink-0">✨</span>
        </div>
      </div>
    </motion.div>
  );
};

export interface LuckyChestWinnerToastProps {
  winnerNotice?: LuckyChestWinnerNoticeData | null;
  winnersQueue?: LuckyChestWinnerNoticeData[];
  onDismiss?: (id: string) => void;
  onOpenUserProfile?: () => void;
}

export const LuckyChestWinnerToast: React.FC<LuckyChestWinnerToastProps> = ({
  winnerNotice,
  winnersQueue = [],
  onDismiss,
}) => {
  const [queue, setQueue] = useState<LuckyChestWinnerNoticeData[]>([]);
  const [currentWinner, setCurrentWinner] = useState<LuckyChestWinnerNoticeData | null>(null);
  const seenIdsRef = useRef<Set<string>>(new Set());

  // Listen to single winnerNotice prop with deduplication
  useEffect(() => {
    if (winnerNotice && !seenIdsRef.current.has(winnerNotice.id)) {
      seenIdsRef.current.add(winnerNotice.id);
      setQueue((prev) => [...prev, winnerNotice]);
    }
  }, [winnerNotice]);

  // Listen to winnersQueue array prop with deduplication
  useEffect(() => {
    if (winnersQueue && winnersQueue.length > 0) {
      setQueue((prev) => {
        const toAdd: LuckyChestWinnerNoticeData[] = [];
        winnersQueue.forEach((item) => {
          if (!seenIdsRef.current.has(item.id)) {
            seenIdsRef.current.add(item.id);
            toAdd.push(item);
          }
        });
        if (toAdd.length === 0) return prev;
        return [...prev, ...toAdd];
      });
    }
  }, [winnersQueue]);

  // Sequential Queue Dispatcher: Strict single-banner queue (بعد أن يمشي الأول يظهر الثاني)
  useEffect(() => {
    if (!currentWinner && queue.length > 0) {
      const nextItem = queue[0];
      const remaining = queue.slice(1);
      setCurrentWinner(nextItem);
      setQueue(remaining);
    }
  }, [currentWinner, queue]);

  const handleComplete = (id: string) => {
    // Only after the current glider completely finishes and exits screen, clear it so next one enters
    setCurrentWinner(null);
    onDismiss?.(id);
  };

  if (!currentWinner) return null;

  return (
    /* SECONDARY TRACK: ملاصق وتحت شريط انضم إلى الغرفة مباشرةً (-top-7 vs top-0.5) */
    <div className="absolute top-0.5 sm:top-0 left-0 right-0 h-9 flex justify-center pointer-events-none select-none z-45 overflow-visible">
      <GlidingWinnerItem key={currentWinner.id} item={currentWinner} onComplete={handleComplete} />
    </div>
  );
};
