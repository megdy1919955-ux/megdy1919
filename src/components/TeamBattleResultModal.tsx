import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Crown, Sparkles, X, Shield, Swords, Flame, HeartHandshake } from 'lucide-react';

export interface PKSupporter {
  name: string;
  avatar: string;
  coins: number;
  team: 'red' | 'blue' | 'none';
}

interface TeamBattleResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  redScore: number;
  blueScore: number;
  winner: 'red' | 'blue' | 'draw';
  topSupporter: PKSupporter | null;
}

export const TeamBattleResultModal: React.FC<TeamBattleResultModalProps> = ({
  isOpen,
  onClose,
  redScore,
  blueScore,
  winner,
  topSupporter
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 bg-transparent flex items-center justify-center p-4 pointer-events-auto cursor-default select-none dir-rtl"
        onClick={onClose}
        dir="rtl"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 30 }}
          transition={{ type: 'spring', damping: 22, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-sm bg-gradient-to-b from-[#1a1c2e] via-[#121422] to-[#0a0b12] border-2 border-amber-500/40 rounded-3xl shadow-[0_0_50px_rgba(245,158,11,0.25)] overflow-hidden text-white relative flex flex-col pointer-events-auto"
        >
          {/* Top Decorative Rays / Glow */}
          <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-amber-500/20 via-purple-600/10 to-transparent pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 left-3 p-1.5 rounded-full bg-black/50 hover:bg-black/70 text-slate-300 hover:text-white transition-colors cursor-pointer z-20 border border-white/10"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Winner Banner & Trophy Header */}
          <div className="pt-6 pb-2 px-4 text-center flex flex-col items-center relative z-10">
            {/* Animated Trophy Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: [0, 1.2, 1], rotate: [ -20, 10, 0 ] }}
              transition={{ duration: 0.6, ease: 'backOut' }}
              className="relative mb-2"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-300 via-yellow-500 to-amber-600 p-0.5 shadow-[0_0_30px_rgba(245,158,11,0.6)] flex items-center justify-center">
                <div className="w-full h-full rounded-[14px] bg-[#121422] flex items-center justify-center">
                  <Trophy className="w-9 h-9 text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
                </div>
              </div>
              <Sparkles className="w-5 h-5 text-amber-300 absolute -top-1 -right-1 animate-pulse" />
            </motion.div>

            {/* Victory Title */}
            <h2 className="text-xl font-black bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-200 bg-clip-text text-transparent drop-shadow-sm">
              {winner === 'red' && '🏆 انتصار الفريق الأحمر! 🔴'}
              {winner === 'blue' && '🏆 انتصار الفريق الأزرق! 🔵'}
              {winner === 'draw' && '⚖️ تعادل حماسي بين الفريقين!'}
            </h2>
            <p className="text-[11px] text-slate-400 font-bold mt-0.5">
              نتائج معركة الفريق النهاية حُسمت الجولة 🔥
            </p>
          </div>

          {/* Score Comparison Display */}
          <div className="px-5 py-3 relative z-10">
            <div className="grid grid-cols-2 gap-3 bg-black/40 border border-white/10 p-3 rounded-2xl backdrop-blur-md relative overflow-hidden">
              {/* VS Badge in center */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 text-slate-950 font-black text-[10px] flex items-center justify-center border-2 border-[#121422] shadow-md z-10">
                VS
              </div>

              {/* Red Team Score Box */}
              <div
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                  winner === 'red'
                    ? 'bg-red-500/20 border-red-500/80 shadow-[0_0_20px_rgba(239,68,68,0.3)] ring-1 ring-red-400'
                    : 'bg-red-950/20 border-red-500/20 opacity-80'
                }`}
              >
                <div className="flex items-center gap-1 text-xs font-black text-rose-300">
                  <Flame className="w-3.5 h-3.5 text-red-400" />
                  <span>الفريق الأحمر</span>
                </div>
                <span className="text-xl font-black text-white font-mono drop-shadow-sm">
                  {redScore.toLocaleString()}
                </span>
                <span className="text-[9px] text-rose-300/80 font-bold">نقطة دعم</span>
              </div>

              {/* Blue Team Score Box */}
              <div
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                  winner === 'blue'
                    ? 'bg-cyan-500/20 border-cyan-500/80 shadow-[0_0_20px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400'
                    : 'bg-cyan-950/20 border-cyan-500/20 opacity-80'
                }`}
              >
                <div className="flex items-center gap-1 text-xs font-black text-cyan-300">
                  <Shield className="w-3.5 h-3.5 text-cyan-400" />
                  <span>الفريق الأزرق</span>
                </div>
                <span className="text-xl font-black text-white font-mono drop-shadow-sm">
                  {blueScore.toLocaleString()}
                </span>
                <span className="text-[9px] text-cyan-300/80 font-bold">نقطة دعم</span>
              </div>
            </div>
          </div>

          {/* King of Support / الداعم الأكبر Section at Bottom */}
          <div className="px-5 pb-4 pt-1 relative z-10">
            <div className="bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/15 border border-amber-500/40 rounded-2xl p-3 flex flex-col gap-2">
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
                <div className="flex items-center gap-1.5 text-amber-300 font-black text-xs">
                  <Crown className="w-4 h-4 text-amber-400 fill-amber-400/30" />
                  <span>ملك الدعم (الداعم الأكبر للجولة)</span>
                </div>
                <span className="text-[9px] bg-amber-400/20 text-amber-200 border border-amber-400/40 px-2 py-0.5 rounded-full font-bold">
                  MVP
                </span>
              </div>

              {topSupporter ? (
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2.5">
                    <div className="relative">
                      <img
                        src={topSupporter.avatar}
                        alt={topSupporter.name}
                        className="w-11 h-11 rounded-full object-cover border-2 border-amber-400 shadow-md ring-2 ring-amber-500/40"
                      />
                      <Crown className="w-4 h-4 text-yellow-400 fill-yellow-400 absolute -top-1.5 -right-1 drop-shadow-md" />
                    </div>
                    <div className="text-right">
                      <h4 className="text-xs font-black text-white flex items-center gap-1">
                        <span>{topSupporter.name}</span>
                        {topSupporter.team === 'red' && (
                          <span className="text-[9px] bg-red-500/30 text-red-300 border border-red-500/40 px-1.5 py-0.2 rounded-full">
                            فريق أحمر 🚩
                          </span>
                        )}
                        {topSupporter.team === 'blue' && (
                          <span className="text-[9px] bg-blue-500/30 text-blue-300 border border-blue-500/40 px-1.5 py-0.2 rounded-full">
                            فريق أزرق 🚩
                          </span>
                        )}
                      </h4>
                      <p className="text-[10px] text-amber-300 font-bold mt-0.5">
                        الداعم الأكبر لمعركة الفريق 👑
                      </p>
                    </div>
                  </div>

                  <div className="text-left bg-amber-400/10 border border-amber-400/30 px-2.5 py-1 rounded-xl">
                    <div className="text-xs font-black text-amber-300 font-mono">
                      💎 {topSupporter.coins.toLocaleString()}
                    </div>
                    <div className="text-[8.5px] text-amber-200/80 font-bold">إجمالي الدعم</div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 py-1 text-slate-300 text-xs font-bold">
                  <HeartHandshake className="w-4 h-4 text-amber-400" />
                  <span>عابرسبيل (داعم الشرف لهذه الجولة) 💎</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Button */}
          <div className="p-4 pt-1 bg-black/30 border-t border-white/5 flex justify-center">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:brightness-110 active:scale-95 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 cursor-pointer transition-all text-center"
            >
              حسناً (إغلاق)
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
