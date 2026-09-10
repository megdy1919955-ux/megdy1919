import React from 'react';
import { motion } from 'motion/react';
import { Lock, Plus, MicOff, Crown, Mic } from 'lucide-react';

interface RedCinemaSeatProps {
  seatNumber: number;
  seatData?: {
    id: number;
    userName?: string;
    avatar?: string;
    isHost?: boolean;
    isEmpty?: boolean;
    isMuted?: boolean;
    isLocked?: boolean;
    isSpeaking?: boolean;
    isInvitationPending?: boolean;
    gender?: 'male' | 'female';
  };
  onClick: () => void;
}

export const RedCinemaSeat: React.FC<RedCinemaSeatProps> = ({
  seatNumber,
  seatData,
  onClick
}) => {
  const isEmpty = seatData?.isEmpty ?? true;
  const isLocked = seatData?.isLocked ?? false;
  const isSpeaking = (seatData?.isSpeaking ?? false) && !seatData?.isMuted;
  const isMuted = seatData?.isMuted ?? false;
  const isHost = seatData?.isHost ?? false;
  const isInvitationPending = seatData?.isInvitationPending ?? false;

  return (
    <div
      onClick={onClick}
      className="flex flex-col items-center select-none cursor-pointer group transition-transform active:scale-95"
      title={isEmpty ? (isLocked ? `المقعد ${seatNumber} مقفل 🔒` : `انقر للصعود إلى مقعد السينما ${seatNumber} 💺`) : `${seatData?.userName} (مقعد ${seatNumber})`}
    >
      {/* 3D Luxury Red Cinema Armchair Container */}
      <div className="relative w-16 h-18 sm:w-18 sm:h-20 flex items-center justify-center">
        {/* Cinema Chair Backing & Wings (Rich Crimson Red) */}
        <svg
          viewBox="0 0 100 110"
          className="absolute inset-0 w-full h-full filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]"
        >
          <defs>
            {/* Red Leather Radial & Linear Gradients */}
            <linearGradient id={`redSeatBackGrad_${seatNumber}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e52d27" />
              <stop offset="35%" stopColor="#b31217" />
              <stop offset="85%" stopColor="#780206" />
              <stop offset="100%" stopColor="#4a0000" />
            </linearGradient>

            <linearGradient id={`redSeatHeadrest_${seatNumber}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ff416c" />
              <stop offset="60%" stopColor="#c70039" />
              <stop offset="100%" stopColor="#660000" />
            </linearGradient>

            <linearGradient id={`redArmrestGrad_${seatNumber}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2c3437" />
              <stop offset="40%" stopColor="#1a1d20" />
              <stop offset="100%" stopColor="#0d0f11" />
            </linearGradient>

            <radialGradient id={`redCushionGlow_${seatNumber}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ff4d4d" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#800000" stopOpacity="0.8" />
            </radialGradient>
          </defs>

          {/* Seat Headrest curved top */}
          <path
            d="M 24 18 C 24 6, 76 6, 76 18 C 76 28, 24 28, 24 18 Z"
            fill={`url(#redSeatHeadrest_${seatNumber})`}
            stroke="#ff6b6b"
            strokeWidth="0.8"
          />

          {/* Main Seat Back Body with side wings */}
          <path
            d="M 18 24 C 18 16, 82 16, 82 24 C 88 45, 88 75, 82 92 C 78 96, 22 96, 18 92 C 12 75, 12 45, 18 24 Z"
            fill={`url(#redSeatBackGrad_${seatNumber})`}
            stroke="#ff4d4d"
            strokeWidth="0.6"
          />

          {/* Vertical Stitching lines */}
          <path d="M 38 26 L 38 88" stroke="#500000" strokeWidth="1" strokeDasharray="2,2" opacity="0.6" />
          <path d="M 62 26 L 62 88" stroke="#500000" strokeWidth="1" strokeDasharray="2,2" opacity="0.6" />

          {/* Bottom Cushion Front Lip */}
          <path
            d="M 14 84 C 14 78, 86 78, 86 84 C 86 98, 14 98, 14 84 Z"
            fill="#800000"
            stroke="#b30000"
            strokeWidth="0.8"
          />

          {/* Left Armrest with cup holder lip */}
          <rect x="4" y="52" width="12" height="34" rx="5" fill={`url(#redArmrestGrad_${seatNumber})`} stroke="#404040" strokeWidth="0.5" />
          <circle cx="10" cy="57" r="3.5" fill="#0a0a0a" stroke="#222" strokeWidth="0.5" />

          {/* Right Armrest with cup holder lip */}
          <rect x="84" y="52" width="12" height="34" rx="5" fill={`url(#redArmrestGrad_${seatNumber})`} stroke="#404040" strokeWidth="0.5" />
          <circle cx="90" cy="57" r="3.5" fill="#0a0a0a" stroke="#222" strokeWidth="0.5" />
        </svg>

        {/* Center Circular Action / Avatar Slot (Overlay on the red chair) */}
        <div className="relative z-10 w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center mt-1">
          {isEmpty ? (
            <div
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 flex items-center justify-center backdrop-blur-xs transition-all ${
                isLocked
                  ? 'border-red-400/50 bg-red-950/60 shadow-[0_0_10px_rgba(239,68,68,0.4)]'
                  : 'border-red-400/40 bg-red-900/40 shadow-[0_0_10px_rgba(255,100,100,0.3)] group-hover:border-red-300 group-hover:scale-105'
              }`}
            >
              {isLocked ? (
                <Lock className="w-5 h-5 text-red-300 stroke-[2.2] drop-shadow-md" />
              ) : (
                <Plus className="w-6 h-6 text-red-200 stroke-[2.5] drop-shadow-md group-hover:text-white" />
              )}
            </div>
          ) : (
            <div className="relative w-10 h-10 sm:w-11 sm:h-11">
              {/* Speaking Soundwave Glow Ring */}
              {isSpeaking && (
                <motion.div
                  animate={{ scale: [1, 1.25, 1], opacity: [0.9, 0.4, 0.9] }}
                  transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -inset-1 rounded-full bg-emerald-400/40 border-2 border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.8)] z-0"
                />
              )}

              {/* Invitation Pending Pulsing Ring */}
              {isInvitationPending && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.9, 0.4, 0.9] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -inset-1 rounded-full bg-amber-400/40 border-2 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.85)] z-0"
                />
              )}

              {/* User Avatar */}
              <img
                src={seatData?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'}
                alt={seatData?.userName || 'User'}
                className={`w-full h-full rounded-full object-cover border-2 shadow-lg relative z-10 ${
                  isSpeaking
                    ? 'border-emerald-400 ring-2 ring-emerald-500/50'
                    : isInvitationPending
                    ? 'border-amber-400 ring-2 ring-amber-400/80'
                    : isHost
                    ? 'border-amber-400 ring-2 ring-amber-500/40'
                    : 'border-red-400/80 ring-1 ring-red-500/30'
                }`}
              />

              {/* Host Crown */}
              {isHost && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20">
                  <Crown className="w-4 h-4 text-amber-300 fill-amber-400 drop-shadow-md" />
                </div>
              )}

              {/* Mute Mic Badge / Yellow Mic Indicator */}
              {isInvitationPending ? (
                <div className="absolute -bottom-1 -right-1 z-20 rounded-full p-0.5 shadow-md border border-white/80 bg-amber-400 text-slate-950 ring-1 ring-amber-300">
                  <Mic className="w-2.5 h-2.5" />
                </div>
              ) : isMuted ? (
                <div className="absolute -bottom-1 -right-1 z-20 rounded-full p-0.5 shadow-md border border-white/80 bg-red-600 text-white">
                  <MicOff className="w-2.5 h-2.5" />
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>

      {/* Seat Number or User Name */}
      <div className="mt-0.5 text-center max-w-[80px]">
        {isEmpty ? (
          <span className="text-xs sm:text-sm font-black text-slate-100 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] font-mono">
            {seatNumber}
          </span>
        ) : (
          <div className="flex flex-col items-center">
            <span className={`text-[10px] font-black truncate w-full leading-tight drop-shadow-sm ${
              isInvitationPending ? 'text-amber-300' : 'text-amber-200'
            }`}>
              {seatData?.userName}
            </span>
            <span className="text-[8.5px] font-mono text-slate-300/80 leading-none">
              #{seatNumber}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
