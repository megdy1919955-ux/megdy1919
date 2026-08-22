import React from 'react';
import { motion } from 'motion/react';

interface ThreeDLuckyChestProps {
  isOpen?: boolean;
  isSuper?: boolean;
  isReady?: boolean;
  timeString?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

export const ThreeDLuckyChest: React.FC<ThreeDLuckyChestProps> = ({
  isOpen = false,
  isSuper = false,
  isReady = false,
  timeString,
  size = 'sm'
}) => {
  // Dimensions based on size (ultra-compact, sleek & lightweight)
  const sizeConfig = {
    xs: { width: 28, height: 25 },
    sm: { width: 34, height: 30 },
    md: { width: 46, height: 40 },
    lg: { width: 68, height: 60 }
  }[size] || { width: 34, height: 30 };

  // Colors: Super (Gold/Ruby) vs Classic (Crimson/Gold/Purple)
  const colors = isSuper
    ? {
        mainGrad: 'url(#goldChestGrad)',
        mainBorder: '#FDE047',
        trimGrad: 'url(#goldTrimGrad)',
        gemGrad: 'url(#rubyGemGrad)',
        lockGrad: 'url(#goldLockGrad)',
        glow: '#EAB308',
        shadow: 'rgba(234, 179, 8, 0.4)'
      }
    : {
        mainGrad: 'url(#classicChestGrad)',
        mainBorder: '#F59E0B',
        trimGrad: 'url(#classicTrimGrad)',
        gemGrad: 'url(#cyanGemGrad)',
        lockGrad: 'url(#goldLockGrad)',
        glow: '#EC4899',
        shadow: 'rgba(236, 72, 153, 0.4)'
      };

  return (
    <div
      className="relative flex flex-col items-center justify-center select-none"
      style={{
        width: sizeConfig.width,
        height: sizeConfig.height + 12
      }}
    >
      {/* 3D Realistic SVG Chest */}
      <svg
        viewBox="0 0 100 90"
        className="w-full h-full overflow-visible drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]"
      >
        <defs>
          {/* Super Golden Chest Gradients */}
          <linearGradient id="goldChestGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#854D0E" />
            <stop offset="30%" stopColor="#CA8A04" />
            <stop offset="70%" stopColor="#A16207" />
            <stop offset="100%" stopColor="#422006" />
          </linearGradient>

          <linearGradient id="goldTrimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="50%" stopColor="#EAB308" />
            <stop offset="100%" stopColor="#A16207" />
          </linearGradient>

          {/* Classic Crimson/Purple Chest Gradients */}
          <linearGradient id="classicChestGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#881337" />
            <stop offset="35%" stopColor="#BE123C" />
            <stop offset="70%" stopColor="#701A75" />
            <stop offset="100%" stopColor="#2E0854" />
          </linearGradient>

          <linearGradient id="classicTrimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="40%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>

          {/* Gold Lock / Buckle */}
          <linearGradient id="goldLockGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FEF9C3" />
            <stop offset="45%" stopColor="#FACC15" />
            <stop offset="85%" stopColor="#CA8A04" />
            <stop offset="100%" stopColor="#713F12" />
          </linearGradient>

          {/* Ruby Gem */}
          <radialGradient id="rubyGemGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FECDD3" />
            <stop offset="40%" stopColor="#F43F5E" />
            <stop offset="90%" stopColor="#881337" />
          </radialGradient>

          {/* Cyan Gem */}
          <radialGradient id="cyanGemGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#CFFAFE" />
            <stop offset="40%" stopColor="#06B6D4" />
            <stop offset="90%" stopColor="#0E7490" />
          </radialGradient>

          {/* Gold Interior Light Gradient */}
          <radialGradient id="chestGlowInside" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FEF08A" stopOpacity="1" />
            <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#B45309" stopOpacity="0" />
          </radialGradient>

          {/* Filter for 3D Specular Highlight */}
          <filter id="chestSoftGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 3D Drop Shadow Underneath (Ground level, no container) */}
        <ellipse cx="50" cy="84" rx="36" ry="6" fill="rgba(0,0,0,0.55)" filter="blur(3px)" />

        {/* CHEST BASE (Frontal 3D view with perspective bevels) */}
        <g id="chest-base">
          {/* Main Box Cavity Inner Dark */}
          {isOpen && (
            <g id="chest-interior">
              <path
                d="M 16,42 L 84,42 L 78,60 L 22,60 Z"
                fill="#1E0E0E"
              />
              <circle cx="50" cy="46" r="24" fill="url(#chestGlowInside)" filter="url(#chestSoftGlow)" />
              {/* Internal treasure coins sparkling */}
              <circle cx="42" cy="48" r="4" fill="#FEF08A" />
              <circle cx="58" cy="47" r="3.5" fill="#FACC15" />
              <circle cx="50" cy="44" r="5" fill="#FDE047" />
              {/* Light rays burst when open */}
              <path d="M 50,45 L 35,15" stroke="#FEF08A" strokeWidth="1.5" strokeOpacity="0.8" strokeLinecap="round" />
              <path d="M 50,45 L 50,10" stroke="#FEF08A" strokeWidth="2" strokeOpacity="0.9" strokeLinecap="round" />
              <path d="M 50,45 L 65,15" stroke="#FEF08A" strokeWidth="1.5" strokeOpacity="0.8" strokeLinecap="round" />
            </g>
          )}

          {/* Main Chest Front Body Panel */}
          <path
            d="M 14,46 L 86,46 L 81,80 L 19,80 Z"
            fill={colors.mainGrad}
            stroke="#170707"
            strokeWidth="1.2"
          />

          {/* 3D Bevel Highlight along left & bottom */}
          <path
            d="M 14,46 L 19,80 L 23,78 L 19,48 Z"
            fill="rgba(255,255,255,0.18)"
          />
          <path
            d="M 86,46 L 81,80 L 77,78 L 81,48 Z"
            fill="rgba(0,0,0,0.35)"
          />

          {/* Golden Reinforced Corner Straps (Left & Right) */}
          <path
            d="M 14,46 L 24,46 L 26,80 L 19,80 Z"
            fill={colors.trimGrad}
            stroke="rgba(0,0,0,0.4)"
            strokeWidth="0.8"
          />
          <path
            d="M 86,46 L 76,46 L 74,80 L 81,80 Z"
            fill={colors.trimGrad}
            stroke="rgba(0,0,0,0.4)"
            strokeWidth="0.8"
          />

          {/* Golden Central Band */}
          <path
            d="M 45,46 L 55,46 L 54,80 L 46,80 Z"
            fill={colors.trimGrad}
            stroke="rgba(0,0,0,0.35)"
            strokeWidth="0.8"
          />

          {/* 3D Rivets/Bolts on straps */}
          <circle cx="20" cy="50" r="1.4" fill="#FEF9C3" stroke="#713F12" strokeWidth="0.6" />
          <circle cx="21" cy="64" r="1.4" fill="#FEF9C3" stroke="#713F12" strokeWidth="0.6" />
          <circle cx="22" cy="76" r="1.4" fill="#FEF9C3" stroke="#713F12" strokeWidth="0.6" />

          <circle cx="80" cy="50" r="1.4" fill="#FEF9C3" stroke="#713F12" strokeWidth="0.6" />
          <circle cx="79" cy="64" r="1.4" fill="#FEF9C3" stroke="#713F12" strokeWidth="0.6" />
          <circle cx="78" cy="76" r="1.4" fill="#FEF9C3" stroke="#713F12" strokeWidth="0.6" />

          {/* Lower Front Lock Catch Base */}
          <path
            d="M 44,52 L 56,52 L 54,64 L 46,64 Z"
            fill={colors.lockGrad}
            stroke="#451A03"
            strokeWidth="0.8"
          />
          {/* Keyhole */}
          <circle cx="50" cy="56" r="1.8" fill="#1C1917" />
          <polygon points="49.2,56 50.8,56 51.2,60 48.8,60" fill="#1C1917" />
        </g>

        {/* CHEST LID (Smooth 3D Opening Animation) */}
        <motion.g
          id="chest-lid"
          style={{ originX: '50px', originY: '46px' }}
          animate={
            isOpen
              ? { rotateX: -70, y: -12, scaleY: 0.85 }
              : { rotateX: 0, y: 0, scaleY: 1 }
          }
          transition={{
            type: 'spring',
            stiffness: 280,
            damping: 18
          }}
        >
          {/* 3D Arched Domed Lid Body */}
          <path
            d="M 12,46 C 12,24 88,24 88,46 Z"
            fill={colors.mainGrad}
            stroke="#170707"
            strokeWidth="1.2"
          />

          {/* Lid 3D Top Dome Highlight */}
          <path
            d="M 16,42 C 18,28 82,28 84,42 C 78,32 22,32 16,42 Z"
            fill="rgba(255,255,255,0.22)"
          />

          {/* Golden Arched Left Strap */}
          <path
            d="M 12,46 C 12,24 28,24 28,46 L 22,46 C 22,29 17,29 17,46 Z"
            fill={colors.trimGrad}
            stroke="rgba(0,0,0,0.3)"
            strokeWidth="0.6"
          />

          {/* Golden Arched Right Strap */}
          <path
            d="M 88,46 C 88,24 72,24 72,46 L 78,46 C 78,29 83,29 83,46 Z"
            fill={colors.trimGrad}
            stroke="rgba(0,0,0,0.3)"
            strokeWidth="0.6"
          />

          {/* Golden Arched Center Band with Gem Shield */}
          <path
            d="M 44,46 C 44,24 56,24 56,46 Z"
            fill={colors.trimGrad}
            stroke="rgba(0,0,0,0.4)"
            strokeWidth="0.8"
          />

          {/* Lid Rivets */}
          <circle cx="20" cy="36" r="1.4" fill="#FEF9C3" stroke="#713F12" strokeWidth="0.6" />
          <circle cx="80" cy="36" r="1.4" fill="#FEF9C3" stroke="#713F12" strokeWidth="0.6" />

          {/* Golden Overhanging Lid Latch / Upper Lock */}
          <path
            d="M 43,40 L 57,40 L 55,50 L 45,50 Z"
            fill={colors.lockGrad}
            stroke="#451A03"
            strokeWidth="0.9"
          />

          {/* Radiant Faceted 3D Gem in Center */}
          <polygon
            points="50,33 55,38 50,43 45,38"
            fill={colors.gemGrad}
            stroke="#FEF08A"
            strokeWidth="0.8"
          />
          {/* Gem sparkle core */}
          <circle cx="48.5" cy="36" r="1.2" fill="#FFFFFF" opacity="0.9" />

          {/* Crown on Top for Super Chest */}
          {isSuper && (
            <g transform="translate(42, 17) scale(0.65)">
              <path
                d="M 0,12 L 3,3 L 12,8 L 21,3 L 24,12 Z"
                fill="url(#goldTrimGrad)"
                stroke="#713F12"
                strokeWidth="1"
              />
              <circle cx="3" cy="2" r="1.5" fill="#EF4444" />
              <circle cx="12" cy="7" r="1.8" fill="#3B82F6" />
              <circle cx="21" cy="2" r="1.5" fill="#EF4444" />
            </g>
          )}
        </motion.g>

        {/* Ambient Floating Sparkle particles */}
        <g id="ambient-sparkles">
          <circle cx="18" cy="24" r="1.2" fill="#FDE047" opacity="0.9">
            <animate attributeName="opacity" values="0.2;1;0.2" dur="2s" repeatCount="indefinite" />
            <animate attributeName="cy" values="24;20;24" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="82" cy="20" r="1.4" fill="#FEF08A" opacity="0.8">
            <animate attributeName="opacity" values="0.8;0.2;0.8" dur="1.8s" repeatCount="indefinite" />
            <animate attributeName="cy" values="20;16;20" dur="1.8s" repeatCount="indefinite" />
          </circle>
          <circle cx="50" cy="12" r="1" fill="#FFFFFF" opacity="0.9">
            <animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite" />
          </circle>
        </g>
      </svg>

      {/* Discrete Timer / Ready Floating Capsule Badge (Directly below chest, no rectangular background box) */}
      {timeString && (
        <div
          className={`-mt-0.5 px-1.5 py-0.2 rounded-full text-[7.5px] font-black tracking-tight leading-none shadow-sm border flex items-center gap-0.5 z-30 transition-all ${
            isReady
              ? 'bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 border-amber-200 animate-pulse'
              : 'bg-slate-950/85 backdrop-blur-xs text-amber-300 border-amber-500/30'
          }`}
        >
          <span>{isReady ? 'انقضاض' : timeString}</span>
        </div>
      )}
    </div>
  );
};
