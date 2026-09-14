import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Crown } from 'lucide-react';
import { RoomEntranceEvent } from './roomTypes';

export interface RoomEntranceBannerProps {
  currentEntrance?: RoomEntranceEvent | null;
  entranceQueue?: RoomEntranceEvent[];
  onDismiss?: (id: string) => void;
}

// Visual themes corresponding to different VIP tiers
export const getEntranceVipTheme = (vipRaw: number | string | undefined) => {
  let level = 6;
  if (typeof vipRaw === 'number') {
    level = vipRaw;
  } else if (typeof vipRaw === 'string') {
    const match = vipRaw.match(/\d+/);
    level = match ? parseInt(match[0], 10) : 6;
  }

  if (level >= 9) {
    // VIP 9 - 10: Cosmic Crown Diamond & Solar Gold
    return {
      tier: 'cosmic',
      levelText: `VIP ${level}`,
      nobleDefault: 'N9',
      borderColor: 'border-amber-300/90',
      borderStyle: {
        background: 'linear-gradient(90deg, #f59e0b, #ec4899, #38bdf8, #f59e0b)',
        padding: '1px',
      },
      capsuleBg: 'bg-[#000000]',
      badgeBg: 'bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 text-slate-950',
      badgeBorder: 'border-amber-200/80',
      nobleBg: 'bg-gradient-to-r from-purple-900/90 to-amber-900/90 text-amber-300 border-amber-400/60',
      nameColor: 'text-amber-200 font-black',
      actionColor: 'text-amber-300 font-black',
      wingColors: {
        outerBlade: 'url(#cosmicOuter)',
        innerBlade: 'url(#cosmicInner)',
      },
      shimmerColor: 'rgba(255, 255, 255, 0.25)',
    };
  }

  if (level >= 7) {
    // VIP 7 - 8: Imperial Ruby & Royal Purple (Clean Black, No Red Glow)
    return {
      tier: 'ruby',
      levelText: `VIP ${level}`,
      nobleDefault: 'N5',
      borderColor: 'border-amber-400/80',
      borderStyle: {
        background: 'linear-gradient(90deg, #f59e0b, #a855f7, #d97706)',
        padding: '1px',
      },
      capsuleBg: 'bg-[#000000]',
      badgeBg: 'bg-gradient-to-r from-amber-600 via-purple-600 to-amber-600 text-white',
      badgeBorder: 'border-amber-300/80',
      nobleBg: 'bg-gradient-to-r from-purple-950 to-amber-950 text-amber-200 border-amber-400/60',
      nameColor: 'text-amber-200 font-black',
      actionColor: 'text-amber-300 font-black',
      wingColors: {
        outerBlade: 'url(#rubyOuter)',
        innerBlade: 'url(#rubyInner)',
      },
      shimmerColor: 'rgba(255, 235, 180, 0.25)',
    };
  }

  if (level >= 4) {
    // VIP 4 - 6: Royal 24K Gold & Cobalt Blue
    return {
      tier: 'gold',
      levelText: `VIP ${level}`,
      nobleDefault: 'N1',
      borderColor: 'border-amber-400/90',
      borderStyle: {
        background: 'linear-gradient(90deg, #f59e0b, #fef08a, #eab308, #d97706)',
        padding: '1px',
      },
      capsuleBg: 'bg-[#000000]',
      badgeBg: 'bg-gradient-to-r from-amber-500/20 via-yellow-500/30 to-amber-500/20 text-yellow-200',
      badgeBorder: 'border-amber-400/90 ring-1 ring-amber-300/40',
      nobleBg: 'bg-gradient-to-r from-[#172520] to-[#1E3A2F] text-[#bbf7d0] border-[#4ade80]/60',
      nameColor: 'text-[#FDE047] font-black',
      actionColor: 'text-[#FDE047] font-black',
      wingColors: {
        outerBlade: 'url(#goldCobaltOuter)',
        innerBlade: 'url(#goldCobaltInner)',
      },
      shimmerColor: 'rgba(254, 240, 138, 0.25)',
    };
  }

  if (level >= 1) {
    // VIP 1 - 3: Emerald & Silver Aristocrat
    return {
      tier: 'emerald',
      levelText: `VIP ${level}`,
      nobleDefault: 'N1',
      borderColor: 'border-emerald-400/80',
      borderStyle: {
        background: 'linear-gradient(90deg, #10b981, #6ee7b7, #059669)',
        padding: '1px',
      },
      capsuleBg: 'bg-[#000000]',
      badgeBg: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-emerald-50',
      badgeBorder: 'border-emerald-300/80',
      nobleBg: 'bg-emerald-950 text-emerald-200 border-emerald-400/60',
      nameColor: 'text-emerald-300 font-black',
      actionColor: 'text-emerald-300 font-black',
      wingColors: {
        outerBlade: 'url(#emeraldOuter)',
        innerBlade: 'url(#emeraldInner)',
      },
      shimmerColor: 'rgba(167, 243, 208, 0.25)',
    };
  }

  // Regular Member / VIP 0
  return {
    tier: 'member',
    levelText: level > 0 ? `VIP ${level}` : 'VIP 1',
    nobleDefault: 'N0',
    borderColor: 'border-slate-500/70',
    borderStyle: {
      background: 'linear-gradient(90deg, #94a3b8, #e2e8f0, #64748b)',
      padding: '1px',
    },
    capsuleBg: 'bg-[#000000]',
    badgeBg: 'bg-slate-700 text-slate-200',
    badgeBorder: 'border-slate-400/60',
    nobleBg: 'bg-slate-800 text-slate-300 border-slate-500/50',
    nameColor: 'text-slate-100 font-black',
    actionColor: 'text-slate-200 font-bold',
    wingColors: {
      outerBlade: 'url(#silverOuter)',
      innerBlade: 'url(#silverInner)',
    },
    shimmerColor: 'rgba(255, 255, 255, 0.15)',
  };
};

// Single Gliding Entrance Banner Item (Slim rectangle with protruding avatar & continuous walk)
interface GlidingItemProps {
  item: RoomEntranceEvent;
  onComplete: (id: string) => void;
}

const GlidingEntranceItem: React.FC<GlidingItemProps> = ({ item, onComplete }) => {
  const theme = getEntranceVipTheme(item.vipLevel);
  const actionText = 'انضم إلى الغرفة';

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
      className="absolute pointer-events-none select-none z-50 flex items-center will-change-transform overflow-visible"
    >
      <div className="relative flex items-center dir-rtl isolate overflow-visible py-1">
        {/* RECTANGULAR CAPSULE BODY - EXACT SAME HORIZONTAL SIZE AND HEIGHT AS CHAT JOIN PILL (w-fit, rounded-full, py-1 px-3) */}
        <div
          style={{ backgroundColor: '#000000', boxShadow: 'none' }}
          className={`h-7 sm:h-[28px] py-1 pr-1 pl-3.5 rounded-full bg-[#000000] border ${theme.borderColor} flex items-center gap-1.5 sm:gap-2 w-fit select-none relative overflow-visible shadow-md`}
        >
          {/* Animated Light Shimmer Sweep */}
          <motion.div
            initial={{ x: '-150%' }}
            animate={{ x: '350%' }}
            transition={{ repeat: Infinity, repeatDelay: 1.5, duration: 1.8, ease: 'easeInOut' }}
            className="absolute inset-y-0 w-16 -skew-x-25 pointer-events-none z-30 overflow-hidden rounded-full"
            style={{
              background: `linear-gradient(90deg, transparent 0%, ${theme.shimmerColor} 50%, transparent 100%)`,
            }}
          />

          {/* 1. PROTRUDING AVATAR AT THE BEGINNING OF THE RECTANGLE */}
          <div className="relative shrink-0 -mr-2 z-30 flex items-center justify-center">
            <div className="w-8 h-8 sm:w-[32px] sm:h-[32px] rounded-full p-[1px] bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-500 ring-2 ring-amber-500/50 shadow-md">
              <img
                src={item.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
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

          {/* 2. VIP Badge Only (إشارة VIP والرقم فقط - تم إلغاء إشارة N6 / N2 تماماً) */}
          <span className={`px-1.5 py-0.2 rounded-full border text-[9px] font-mono font-black tracking-tight flex items-center justify-center shrink-0 ${theme.badgeBg} ${theme.badgeBorder}`}>
            {theme.levelText}
          </span>

          {/* 3. User Name (مع ظهور الاسم كامل دون اقتصاص) */}
          <span className={`font-black text-[11px] whitespace-nowrap ${theme.nameColor}`}>
            {item.userName}
          </span>

          {/* 4. Action Text ("انضم إلى الغرفة") */}
          <span className={`text-[10.5px] font-bold whitespace-nowrap ${theme.actionColor}`}>
            {actionText}
          </span>

          {/* 5. Sparkle Accent */}
          <span className="text-[12px] animate-pulse shrink-0">✨</span>
        </div>
      </div>
    </motion.div>
  );
};

export const RoomEntranceBanner: React.FC<RoomEntranceBannerProps> = ({
  currentEntrance,
  entranceQueue = [],
  onDismiss,
}) => {
  // Pending queue of items waiting in line
  const [queue, setQueue] = useState<RoomEntranceEvent[]>([]);
  // Only ONE banner active at any time: بعد أن يمشي الأول يظهر الثاني كالطابور
  const [currentEntranceItem, setCurrentEntranceItem] = useState<RoomEntranceEvent | null>(null);
  const seenIdsRef = useRef<Set<string>>(new Set());

  // Listen to single incoming currentEntrance with strict deduplication
  useEffect(() => {
    if (!currentEntrance) return;
    if (seenIdsRef.current.has(currentEntrance.id)) return;
    seenIdsRef.current.add(currentEntrance.id);
    setQueue((prev) => [...prev, currentEntrance]);
  }, [currentEntrance]);

  // Listen to incoming array entranceQueue (batch of 10, 20, 30 people) with strict deduplication
  useEffect(() => {
    if (!entranceQueue || entranceQueue.length === 0) return;
    setQueue((prev) => {
      const toAdd: RoomEntranceEvent[] = [];
      entranceQueue.forEach((item) => {
        if (!seenIdsRef.current.has(item.id)) {
          seenIdsRef.current.add(item.id);
          toAdd.push(item);
        }
      });
      if (toAdd.length === 0) return prev;
      return [...prev, ...toAdd];
    });
  }, [entranceQueue]);

  // Sequential Queue Dispatcher: Strict single-banner queue (بعد أن يمشي الأول يظهر الثاني)
  useEffect(() => {
    if (!currentEntranceItem && queue.length > 0) {
      const nextItem = queue[0];
      const remaining = queue.slice(1);
      setCurrentEntranceItem(nextItem);
      setQueue(remaining);
    }
  }, [currentEntranceItem, queue]);

  const handleGliderComplete = (id: string) => {
    // When current glider completely finishes animation and leaves the screen, clear it so next one enters
    setCurrentEntranceItem(null);
    if (onDismiss) {
      onDismiss(id);
    }
  };

  if (!currentEntranceItem) {
    return null;
  }

  return (
    // Raised to -top-7 above the chat so it never covers chat messages, centered horizontally, overflow-visible
    <div className="absolute -top-7 sm:-top-8 left-0 right-0 h-9 flex justify-center pointer-events-none select-none z-50 overflow-visible">
      <GlidingEntranceItem
        key={currentEntranceItem.id}
        item={currentEntranceItem}
        onComplete={handleGliderComplete}
      />
    </div>
  );
};
