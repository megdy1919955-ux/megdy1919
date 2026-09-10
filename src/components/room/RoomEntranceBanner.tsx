import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RoomEntranceEvent } from './roomTypes';

export interface RoomEntranceBannerProps {
  currentEntrance: RoomEntranceEvent | null;
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
      levelText: `VIP${level}`,
      nobleDefault: 'N9',
      borderColor: 'border-amber-300/90 shadow-[0_0_20px_rgba(245,158,11,0.6),0_0_35px_rgba(168,85,247,0.4)]',
      borderStyle: {
        background: 'linear-gradient(90deg, #f59e0b, #ec4899, #38bdf8, #f59e0b)',
        padding: '1.5px',
      },
      capsuleBg: 'bg-gradient-to-r from-[#070512] via-[#0f0926] to-[#080614]',
      badgeBg: 'bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 text-slate-950',
      badgeBorder: 'border-amber-200/80',
      nobleBg: 'bg-gradient-to-r from-purple-900/90 to-amber-900/90 text-amber-300 border-amber-400/60',
      nameColor: 'text-amber-200 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]',
      actionColor: 'text-amber-300 font-black',
      wingColors: {
        outerBlade: 'url(#cosmicOuter)',
        innerBlade: 'url(#cosmicInner)',
        glow: 'rgba(236,72,153,0.8)',
      },
      shimmerColor: 'rgba(255, 255, 255, 0.35)',
    };
  }

  if (level >= 7) {
    // VIP 7 - 8: Imperial Ruby & Royal Purple
    return {
      tier: 'ruby',
      levelText: `VIP${level}`,
      nobleDefault: 'N5',
      borderColor: 'border-rose-400/90 shadow-[0_0_18px_rgba(244,63,94,0.5),0_0_25px_rgba(192,38,211,0.35)]',
      borderStyle: {
        background: 'linear-gradient(90deg, #e11d48, #c026d3, #f43f5e)',
        padding: '1.5px',
      },
      capsuleBg: 'bg-gradient-to-r from-[#120409] via-[#1a0714] to-[#100308]',
      badgeBg: 'bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 text-white',
      badgeBorder: 'border-rose-300/80',
      nobleBg: 'bg-gradient-to-r from-rose-950 to-purple-950 text-rose-200 border-rose-400/60',
      nameColor: 'text-rose-200 drop-shadow-[0_0_8px_rgba(244,63,94,0.7)]',
      actionColor: 'text-rose-300 font-black',
      wingColors: {
        outerBlade: 'url(#rubyOuter)',
        innerBlade: 'url(#rubyInner)',
        glow: 'rgba(244,63,94,0.75)',
      },
      shimmerColor: 'rgba(255, 200, 220, 0.3)',
    };
  }

  if (level >= 4) {
    // VIP 4 - 6: Royal 24K Gold & Cobalt Blue (EXACT REPLICA of user's screenshot!)
    return {
      tier: 'gold',
      levelText: `VIP${level}`,
      nobleDefault: 'N1',
      borderColor: 'border-amber-400/90 shadow-[0_0_15px_rgba(245,158,11,0.5),0_0_25px_rgba(2,132,199,0.3)]',
      borderStyle: {
        background: 'linear-gradient(90deg, #f59e0b, #fef08a, #eab308, #d97706)',
        padding: '1.5px',
      },
      capsuleBg: 'bg-[#0B0E17]',
      badgeBg: 'bg-gradient-to-r from-amber-500/20 via-yellow-500/30 to-amber-500/20 text-yellow-200',
      badgeBorder: 'border-amber-400/90 ring-1 ring-amber-300/40',
      nobleBg: 'bg-gradient-to-r from-[#172520] to-[#1E3A2F] text-[#bbf7d0] border-[#4ade80]/60',
      nameColor: 'text-[#FDE047] drop-shadow-[0_0_6px_rgba(250,204,21,0.6)]',
      actionColor: 'text-[#FDE047] font-black',
      wingColors: {
        outerBlade: 'url(#goldCobaltOuter)',
        innerBlade: 'url(#goldCobaltInner)',
        glow: 'rgba(56,189,248,0.7)',
      },
      shimmerColor: 'rgba(254, 240, 138, 0.35)',
    };
  }

  if (level >= 1) {
    // VIP 1 - 3: Emerald & Silver Aristocrat
    return {
      tier: 'emerald',
      levelText: `VIP${level}`,
      nobleDefault: 'N1',
      borderColor: 'border-emerald-400/80 shadow-[0_0_15px_rgba(16,185,129,0.4)]',
      borderStyle: {
        background: 'linear-gradient(90deg, #10b981, #6ee7b7, #059669)',
        padding: '1.5px',
      },
      capsuleBg: 'bg-[#08120F]',
      badgeBg: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-emerald-50',
      badgeBorder: 'border-emerald-300/80',
      nobleBg: 'bg-emerald-950 text-emerald-200 border-emerald-400/60',
      nameColor: 'text-emerald-300 drop-shadow-[0_0_6px_rgba(52,211,153,0.5)]',
      actionColor: 'text-emerald-300 font-black',
      wingColors: {
        outerBlade: 'url(#emeraldOuter)',
        innerBlade: 'url(#emeraldInner)',
        glow: 'rgba(16,185,129,0.6)',
      },
      shimmerColor: 'rgba(167, 243, 208, 0.3)',
    };
  }

  // Regular Member / VIP 0
  return {
    tier: 'member',
    levelText: 'عضو',
    nobleDefault: 'N0',
    borderColor: 'border-slate-400/70 shadow-[0_0_10px_rgba(148,163,184,0.3)]',
    borderStyle: {
      background: 'linear-gradient(90deg, #94a3b8, #e2e8f0, #64748b)',
      padding: '1.2px',
    },
    capsuleBg: 'bg-[#0C101A]',
    badgeBg: 'bg-slate-700 text-slate-200',
    badgeBorder: 'border-slate-400/60',
    nobleBg: 'bg-slate-800 text-slate-300 border-slate-500/50',
    nameColor: 'text-slate-100',
    actionColor: 'text-slate-200 font-bold',
    wingColors: {
      outerBlade: 'url(#silverOuter)',
      innerBlade: 'url(#silverInner)',
      glow: 'rgba(148,163,184,0.5)',
    },
    shimmerColor: 'rgba(255, 255, 255, 0.2)',
  };
};

export const RoomEntranceBanner: React.FC<RoomEntranceBannerProps> = ({
  currentEntrance,
  onDismiss,
}) => {
  const [activeItem, setActiveItem] = useState<RoomEntranceEvent | null>(currentEntrance);

  useEffect(() => {
    if (currentEntrance) {
      setActiveItem(currentEntrance);
      const timer = setTimeout(() => {
        setActiveItem(null);
        if (onDismiss) {
          onDismiss(currentEntrance.id);
        }
      }, 4200);
      return () => clearTimeout(timer);
    } else {
      setActiveItem(null);
    }
  }, [currentEntrance, onDismiss]);

  if (!activeItem) return null;

  const theme = getEntranceVipTheme(activeItem.vipLevel);
  const nobleTag = activeItem.nobleLevel || theme.nobleDefault;
  const actionText = activeItem.actionText || 'تم الانضمام';

  return (
    <div className="absolute top-1 left-1/2 -translate-x-1/2 z-50 pointer-events-none select-none w-full max-w-md px-2 flex justify-center">
      <AnimatePresence mode="wait">
        {activeItem && (
          <motion.div
            key={activeItem.id}
            initial={{ x: 120, opacity: 0, scale: 0.92 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: -120, opacity: 0, scale: 0.95 }}
            transition={{
              type: 'spring',
              stiffness: 380,
              damping: 26,
              mass: 0.8,
            }}
            className="relative flex items-center dir-rtl isolate"
          >
            {/* 1. CRYSTALLINE WINGS / FEATHER CREST (Left Side in RTL - Extends outside the banner) */}
            <div
              className="absolute -left-7 top-1/2 -translate-y-1/2 z-30 pointer-events-none filter drop-shadow-md"
              style={{ filter: `drop-shadow(0 0 10px ${theme.wingColors.glow})` }}
            >
              <svg width="44" height="42" viewBox="0 0 44 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  {/* VIP 4-6 Gold & Cobalt Wing Gradients (Identical to screenshot) */}
                  <linearGradient id="goldCobaltOuter" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="40%" stopColor="#0284c7" />
                    <stop offset="100%" stopColor="#0369a1" />
                  </linearGradient>
                  <linearGradient id="goldCobaltInner" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fef08a" />
                    <stop offset="50%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#b45309" />
                  </linearGradient>

                  {/* Cosmic Wing Gradients */}
                  <linearGradient id="cosmicOuter" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f472b6" />
                    <stop offset="50%" stopColor="#c084fc" />
                    <stop offset="100%" stopColor="#38bdf8" />
                  </linearGradient>
                  <linearGradient id="cosmicInner" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fef08a" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>

                  {/* Ruby Wing Gradients */}
                  <linearGradient id="rubyOuter" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fb7185" />
                    <stop offset="60%" stopColor="#e11d48" />
                    <stop offset="100%" stopColor="#881337" />
                  </linearGradient>
                  <linearGradient id="rubyInner" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fbcfe8" />
                    <stop offset="100%" stopColor="#be123c" />
                  </linearGradient>

                  {/* Emerald Wing Gradients */}
                  <linearGradient id="emeraldOuter" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6ee7b7" />
                    <stop offset="60%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#047857" />
                  </linearGradient>
                  <linearGradient id="emeraldInner" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a7f3d0" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>

                  {/* Silver Wing Gradients */}
                  <linearGradient id="silverOuter" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#e2e8f0" />
                    <stop offset="100%" stopColor="#64748b" />
                  </linearGradient>
                  <linearGradient id="silverInner" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f8fafc" />
                    <stop offset="100%" stopColor="#94a3b8" />
                  </linearGradient>
                </defs>

                {/* Layer 1: Bottom Cyan/Blue Crystal Blade */}
                <path
                  d="M42 29L16 39C13 40 9 37 10 33L13 26L42 29Z"
                  fill={theme.wingColors.outerBlade}
                  stroke="#ffffff"
                  strokeWidth="0.6"
                  strokeOpacity="0.4"
                />
                {/* Layer 2: Mid Cyan Blade */}
                <path
                  d="M43 21L8 31C5 32 3 28 5 24L10 17L43 21Z"
                  fill={theme.wingColors.outerBlade}
                  stroke="#ffffff"
                  strokeWidth="0.8"
                  strokeOpacity="0.6"
                />
                {/* Layer 3: Upper Cyan Blade */}
                <path
                  d="M44 14L4 23C1 24 0 20 2 16L9 9L44 14Z"
                  fill={theme.wingColors.outerBlade}
                  stroke="#ffffff"
                  strokeWidth="0.9"
                  strokeOpacity="0.7"
                />
                {/* Layer 4: Top Tier Gold-Tipped Crystal Wing (Pointed forward) */}
                <path
                  d="M44 7L3 14C-0.5 15 -0.5 11 2 8L12 2C15 -0.5 18 -0.5 21 2L44 7Z"
                  fill={theme.wingColors.innerBlade}
                  stroke="#fffbeb"
                  strokeWidth="1"
                />
                {/* Crystal Facet Highlight lines */}
                <path d="M12 2L6 11L44 11" stroke="#ffffff" strokeWidth="0.75" strokeOpacity="0.8" />
                <path d="M9 9L4 18L43 18" stroke="#ffffff" strokeWidth="0.6" strokeOpacity="0.7" />
              </svg>
            </div>

            {/* 2. THE MAIN CAPSULE BANNER (Bordered Pill with Shimmer and Metallic Trim) */}
            <div
              className={`rounded-full p-[1.5px] transition-all relative overflow-hidden shadow-2xl ${theme.borderColor}`}
              style={{
                boxShadow: `0 0 16px ${theme.wingColors.glow}`,
              }}
            >
              {/* Animated Light Shimmer Sweep across the banner */}
              <motion.div
                initial={{ x: '-150%' }}
                animate={{ x: '250%' }}
                transition={{
                  repeat: Infinity,
                  repeatDelay: 1.8,
                  duration: 1.6,
                  ease: 'easeInOut',
                }}
                className="absolute inset-y-0 w-28 -skew-x-25 pointer-events-none z-30"
                style={{
                  background: `linear-gradient(90deg, transparent 0%, ${theme.shimmerColor} 50%, transparent 100%)`,
                }}
              />

              {/* Capsule Inner Body */}
              <div
                className={`h-9 sm:h-10 ${theme.capsuleBg} rounded-full pl-6 pr-1.5 flex items-center gap-1.5 sm:gap-2 relative z-10 border border-white/10`}
              >
                {/* A. User Avatar with Protruding Golden Ring (Right side in RTL) */}
                <div className="relative shrink-0 -mr-1">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-500 shadow-md">
                    <img
                      src={
                        activeItem.avatar ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
                      }
                      alt={activeItem.userName}
                      className="w-full h-full rounded-full object-cover border border-slate-950"
                    />
                  </div>
                </div>

                {/* B. Nobility Badge (وسام النبلاء N1 مع الخيل / الأجنحة الفضية الخضراء) */}
                <div
                  className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full border shadow-sm ${theme.nobleBg} text-[9px] font-black tracking-tighter`}
                >
                  {/* Winged Crest / Horse Emblem Mini Icon */}
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-900/60 border border-white/20 flex items-center justify-center text-[8px]">
                    🐎
                  </div>
                  <span className="font-mono font-black italic">{nobleTag}</span>
                </div>

                {/* C. VIP Capsule Badge (VIP6 Capsule exactly like screenshot) */}
                <div
                  className={`px-2 py-0.5 rounded-full border text-[10px] font-mono font-black tracking-wider flex items-center justify-center shadow-xs ${theme.badgeBg} ${theme.badgeBorder}`}
                >
                  <span>{theme.levelText}</span>
                </div>

                {/* D. Heraldic Honor Shield Medal (شارة الشرف العسكرية / الدرع) */}
                <div className="w-4 h-4 rounded-xs flex items-center justify-center drop-shadow-xs shrink-0">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-emerald-300 fill-emerald-500/30">
                    <path
                      d="M12 2L4 5V11C4 16.5 7.5 21.6 12 23C16.5 21.6 20 16.5 20 11V5L12 2Z"
                      stroke="#4ade80"
                      strokeWidth="1.5"
                    />
                    <path d="M12 7L13.5 10.5L17 11L14.5 13.5L15 17L12 15L9 17L9.5 13.5L7 11L10.5 10.5L12 7Z" fill="#facc15" />
                  </svg>
                </div>

                {/* E. User Name in Luminous Golden Font */}
                <div className="flex items-center gap-1 overflow-hidden whitespace-nowrap max-w-[130px] sm:max-w-[170px]">
                  <span className={`text-[11.5px] sm:text-[12.5px] font-black truncate ${theme.nameColor}`}>
                    {activeItem.userName}
                  </span>
                </div>

                {/* F. Action Slogan ("تم الانضمام" in vibrant yellow font) */}
                <div className="whitespace-nowrap shrink-0 pr-0.5">
                  <span className={`text-[11px] sm:text-[12px] ${theme.actionColor}`}>
                    {actionText}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
