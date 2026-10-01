import React from 'react';
import { motion } from 'motion/react';
import { Swords, HelpCircle } from 'lucide-react';

interface RoomTeamBattleSectionProps {
  isTeamBattleActive: boolean;
  teamBattleStatus: 'preparation' | 'running' | 'completed' | 'ended';
  teamBattleTimer: number;
  redTeamScore: number;
  blueTeamScore: number;
  isOwner: boolean;
  activeMicCount: number;
  onOpenTeamBattleModal: () => void;
  onStartBattle: () => void;
  onFinishBattle: () => void;
  onCloseBattle: () => void;
  onToast: (msg: string) => void;
}

export const RoomTeamBattleSection: React.FC<RoomTeamBattleSectionProps> = ({
  isTeamBattleActive,
  teamBattleStatus,
  teamBattleTimer,
  redTeamScore,
  blueTeamScore,
  isOwner,
  activeMicCount,
  onOpenTeamBattleModal,
  onStartBattle,
  onFinishBattle,
  onCloseBattle,
  onToast,
}) => {
  if (!isTeamBattleActive) return null;

  const totalScore = redTeamScore + blueTeamScore;
  const redPct = totalScore === 0 ? 50 : Math.max(8, Math.min(92, (redTeamScore / totalScore) * 100));
  const bluePct = 100 - redPct;

  return (
    <div className="w-full max-w-md mx-auto my-1.5 px-3 dir-rtl shrink-0 z-30 animate-fadeIn">
      {/* Dual PK Score Progress Bar - VISIBLE ONLY WHEN BATTLE IS RUNNING */}
      {teamBattleStatus === 'running' && (
        <div className="relative h-5 my-2">
          {/* Outer Bar Track */}
          <div className="w-full h-full rounded-full bg-slate-950 overflow-hidden border-2 border-amber-500/40 flex shadow-[0_0_20px_rgba(0,0,0,0.8)]">
            {/* Red Team Score Fill (Right side in RTL) */}
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-red-500 to-rose-600 transition-all duration-500 ease-out flex items-center justify-start px-2 font-mono text-[9px] font-black text-white whitespace-nowrap overflow-hidden"
              style={{ width: `${redPct}%` }}
            >
              <span className="drop-shadow-sm">{redTeamScore.toLocaleString()} PK</span>
            </div>

            {/* Blue Team Score Fill (Left side in RTL) */}
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-cyan-500 to-blue-600 transition-all duration-500 ease-out flex items-center justify-end px-2 font-mono text-[9px] font-black text-white whitespace-nowrap overflow-hidden"
              style={{ width: `${bluePct}%` }}
            >
              <span className="drop-shadow-sm">{blueTeamScore.toLocaleString()} PK</span>
            </div>
          </div>

          {/* 3D Floating Dueling Swords & VS Marker */}
          <div
            className="absolute top-1/2 transition-all duration-500 ease-out z-30 flex flex-col items-center justify-center pointer-events-none select-none"
            style={{
              right: `${redPct}%`,
              transform: 'translate(50%, -50%)',
            }}
          >
            {/* Glowing Vertical Split Beam */}
            <div className="absolute -inset-y-3 w-0.5 bg-gradient-to-b from-amber-100 via-yellow-400 to-amber-600 shadow-[0_0_14px_#f59e0b] opacity-90 rounded-full" />

            {/* Animated 3D Floating Dueling Assembly */}
            <div className="relative flex flex-col items-center justify-center filter drop-shadow-[0_6px_12px_rgba(0,0,0,0.95)]">
              {/* 3D Realistic Dueling Swords SVG */}
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg viewBox="0 0 72 72" className="w-full h-full overflow-visible">
                  <defs>
                    {/* RED TEAM SWORD 3D GRADIENTS */}
                    <linearGradient id="redBlade3D" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="25%" stopColor="#fca5a5" />
                      <stop offset="65%" stopColor="#dc2626" />
                      <stop offset="100%" stopColor="#7f1d1d" />
                    </linearGradient>
                    <linearGradient id="redHilt3D" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#fde047" />
                      <stop offset="50%" stopColor="#d97706" />
                      <stop offset="100%" stopColor="#78350f" />
                    </linearGradient>
                    <radialGradient id="rubyCoreGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#ff4d4d" />
                      <stop offset="100%" stopColor="#990000" />
                    </radialGradient>

                    {/* BLUE TEAM SWORD 3D GRADIENTS */}
                    <linearGradient id="blueBlade3D" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="25%" stopColor="#bae6fd" />
                      <stop offset="65%" stopColor="#0284c7" />
                      <stop offset="100%" stopColor="#0c4a6e" />
                    </linearGradient>
                    <linearGradient id="blueHilt3D" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#e2e8f0" />
                      <stop offset="50%" stopColor="#64748b" />
                      <stop offset="100%" stopColor="#0f172a" />
                    </linearGradient>
                    <radialGradient id="sapphireCoreGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#38bdf8" />
                      <stop offset="100%" stopColor="#0369a1" />
                    </radialGradient>

                    {/* CLASH SPARK GLOW */}
                    <radialGradient id="clashSparkGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="40%" stopColor="#fef08a" />
                      <stop offset="80%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="transparent" />
                    </radialGradient>
                  </defs>

                  {/* RED SWORD */}
                  <motion.g
                    animate={{
                      rotate: [-34, -26, -34],
                      x: [0, -2, 0],
                      y: [0, 1, 0],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.5,
                      ease: 'easeInOut',
                    }}
                    style={{ transformOrigin: '48px 48px' }}
                  >
                    <path d="M48 48 L22 14 L20 18 L46 52 Z" fill="#000" opacity="0.4" />
                    <path d="M48 48 L21 13 L17 11 L19 17 L46 52 Z" fill="url(#redBlade3D)" />
                    <line x1="47" y1="50" x2="19" y2="13" stroke="#ffffff" strokeWidth="0.8" opacity="0.85" />
                    <path d="M40 43 Q46 48 43 53 L49 51 Q51 45 44 40 Z" fill="url(#redHilt3D)" stroke="#f59e0b" strokeWidth="0.5" />
                    <line x1="47" y1="50" x2="57" y2="60" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
                    <line x1="47" y1="50" x2="57" y2="60" stroke="#fef08a" strokeWidth="0.8" strokeDasharray="1 2" />
                    <circle cx="58" cy="61" r="3.5" fill="url(#rubyCoreGlow)" stroke="#f59e0b" strokeWidth="0.8" />
                  </motion.g>

                  {/* BLUE SWORD */}
                  <motion.g
                    animate={{
                      rotate: [34, 26, 34],
                      x: [0, 2, 0],
                      y: [0, 1, 0],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.5,
                      ease: 'easeInOut',
                    }}
                    style={{ transformOrigin: '24px 48px' }}
                  >
                    <path d="M24 48 L50 14 L52 18 L26 52 Z" fill="#000" opacity="0.4" />
                    <path d="M24 48 L51 13 L55 11 L53 17 L26 52 Z" fill="url(#blueBlade3D)" />
                    <line x1="25" y1="50" x2="53" y2="13" stroke="#ffffff" strokeWidth="0.8" opacity="0.85" />
                    <path d="M32 43 Q26 48 29 53 L23 51 Q21 45 28 40 Z" fill="url(#blueHilt3D)" stroke="#e2e8f0" strokeWidth="0.5" />
                    <line x1="25" y1="50" x2="15" y2="60" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
                    <line x1="25" y1="50" x2="15" y2="60" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="1 2" />
                    <circle cx="14" cy="61" r="3.5" fill="url(#sapphireCoreGlow)" stroke="#e2e8f0" strokeWidth="0.8" />
                  </motion.g>

                  {/* REALISTIC CLASH SPARK EFFECT */}
                  <motion.g
                    animate={{
                      scale: [0.7, 1.35, 0.7],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.25,
                      ease: 'easeInOut',
                    }}
                    style={{ transformOrigin: '36px 28px' }}
                  >
                    <circle cx="36" cy="28" r="7" fill="url(#clashSparkGlow)" />
                    <circle cx="36" cy="28" r="2.5" fill="#ffffff" />
                    <path d="M36 18 L36 38 M26 28 L46 28" stroke="#ffffff" strokeWidth="0.9" opacity="0.9" />
                  </motion.g>
                </svg>
              </div>

              {/* Floating 3D "VS" Text */}
              <span
                className="font-black italic text-[11px] tracking-tighter -mt-1.5 bg-gradient-to-b from-yellow-100 via-amber-300 to-amber-600 bg-clip-text text-transparent select-none filter drop-shadow-[0_2px_4px_rgba(0,0,0,1)]"
                style={{
                  textShadow: '0 0 10px rgba(245, 158, 11, 0.9), 0 2px 4px rgba(0, 0, 0, 1)',
                  WebkitTextStroke: '0.4px rgba(255, 255, 255, 0.8)',
                }}
              >
                VS
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Team Banners & Controls Row */}
      <div className="mt-1 flex items-center justify-between text-xs font-black">
        {/* Red Team Banner (Right side in RTL) */}
        <div className="bg-gradient-to-r from-rose-950/90 to-red-900/90 border border-rose-500/50 rounded-xl px-2.5 py-1 text-rose-300 flex items-center gap-1.5 shadow-md">
          <span className="text-sm">🚩</span>
          <div className="flex flex-col text-right">
            <span className="text-[10px] font-bold text-rose-200">الفريق الأحمر</span>
            <span className="text-[9px] font-mono text-rose-400/80">Lv0</span>
          </div>
        </div>

        {/* Center Capsule Pill Button */}
        <div className="bg-gradient-to-r from-purple-950/90 via-slate-900 to-indigo-950/90 border border-purple-500/50 rounded-full px-3 py-1 flex items-center gap-2 shadow-xl">
          <button
            onClick={() => {
              if (isOwner) {
                onOpenTeamBattleModal();
              } else {
                onToast('معاينة إعدادات التحدي (متاحة للتعديل للمالك فقط 👑)');
              }
            }}
            className="flex items-center gap-1 text-[10.5px] font-black text-purple-200 hover:text-white cursor-pointer"
          >
            <span>معركة الفريق</span>
            <HelpCircle className="w-3 h-3 text-purple-400" />
          </button>

          {/* Action Button: Start / End / Timer */}
          {teamBattleStatus === 'preparation' ? (
            <button
              onClick={() => {
                if (!isOwner) {
                  onToast('بدء التحدي متاح لمالك الغرفة فقط 👑');
                  return;
                }
                const allowedMicCounts = [2, 4, 5, 6, 8, 9, 10, 12, 15, 20];
                if (!allowedMicCounts.includes(activeMicCount)) {
                  onToast('لا يمكن تشغيل التحدي بهذا العدد من المايكات');
                  return;
                }
                onStartBattle();
              }}
              className="px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-rose-500 text-slate-950 text-[11px] font-black shadow-lg shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 border border-amber-300 ring-2 ring-amber-400/40 animate-pulse"
            >
              <Swords className="w-3.5 h-3.5 text-slate-950 stroke-[2.5]" />
              <span>بدء المعركة</span>
            </button>
          ) : teamBattleStatus === 'running' ? (
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[10px] text-amber-300 font-black animate-pulse">
                ⏱️ {Math.floor(teamBattleTimer / 60)}:{String(teamBattleTimer % 60).padStart(2, '0')}
              </span>
              {isOwner && (
                <button
                  onClick={onFinishBattle}
                  className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[9px] font-bold hover:bg-rose-700 cursor-pointer shadow-sm"
                >
                  إنهاء المعركة
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={onCloseBattle}
              className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black cursor-pointer"
            >
              تمت الجولة
            </button>
          )}
        </div>

        {/* Blue Team Banner (Left side in RTL) */}
        <div className="bg-gradient-to-r from-blue-950/90 to-cyan-900/90 border border-cyan-500/50 rounded-xl px-2.5 py-1 text-cyan-300 flex items-center gap-1.5 shadow-md">
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-bold text-cyan-200">الفريق الأزرق</span>
            <span className="text-[9px] font-mono text-cyan-400/80">Lv0</span>
          </div>
          <span className="text-sm">🚩</span>
        </div>
      </div>
    </div>
  );
};
