import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Crown, Sparkles, X, Gift, Users, Award, ShieldCheck } from 'lucide-react';

export interface SeatScoreItem {
  seatId: number;
  userName: string;
  avatar?: string;
  score: number;
}

export interface NormalRoundResultData {
  topSeatName: string;
  topSeatAvatar: string;
  topSeatNumber: number;
  topSeatScore: number;
  totalRoundScore: number;
  seatScores: SeatScoreItem[];
}

interface NormalRoundResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  resultData: NormalRoundResultData | null;
}

export const NormalRoundResultModal: React.FC<NormalRoundResultModalProps> = ({
  isOpen,
  onClose,
  resultData
}) => {
  if (!isOpen || !resultData) return null;

  const { topSeatName, topSeatAvatar, topSeatNumber, topSeatScore, totalRoundScore, seatScores } = resultData;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 bg-transparent flex items-center justify-center p-4 pointer-events-auto cursor-default select-none dir-rtl"
        onClick={onClose}
        dir="rtl"
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 25 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 25 }}
          transition={{ type: 'spring', damping: 24, stiffness: 320 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-sm bg-gradient-to-b from-[#181d2e] via-[#111524] to-[#0a0d18] border-2 border-amber-500/40 rounded-3xl shadow-[0_0_50px_rgba(245,158,11,0.22)] overflow-hidden text-white relative flex flex-col pointer-events-auto"
        >
          {/* Top Rays & Glow */}
          <div className="absolute top-0 inset-x-0 h-36 bg-gradient-to-b from-amber-500/20 via-yellow-500/10 to-transparent pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 left-3 p-1.5 rounded-full bg-black/50 hover:bg-black/70 text-slate-300 hover:text-white transition-colors cursor-pointer z-20 border border-white/10"
            title="إغلاق وتصفير الجولة"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header Banner */}
          <div className="pt-6 pb-2 px-4 text-center flex flex-col items-center relative z-10">
            <motion.div
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: [0, 1.2, 1], rotate: [-15, 8, 0] }}
              transition={{ duration: 0.5, ease: 'backOut' }}
              className="relative mb-2"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-300 via-yellow-500 to-amber-600 p-0.5 shadow-[0_0_30px_rgba(245,158,11,0.5)] flex items-center justify-center">
                <div className="w-full h-full rounded-[14px] bg-[#111524] flex items-center justify-center">
                  <Trophy className="w-9 h-9 text-amber-400 drop-shadow-[0_0_12px_rgba(245,158,11,0.8)]" />
                </div>
              </div>
              <Sparkles className="w-5 h-5 text-amber-300 absolute -top-1 -right-1 animate-pulse" />
            </motion.div>

            <h2 className="text-lg font-black bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-100 bg-clip-text text-transparent drop-shadow-xs">
              👑 نجم الدعم للجولة العادية
            </h2>
            <p className="text-[11px] text-amber-200/80 font-bold mt-0.5">
              نتائج إحصائيات العداد العادي لهذه الجولة 🌟
            </p>
          </div>

          {/* Featured Top Supported Seat Card */}
          <div className="px-5 py-2 relative z-10">
            <div className="bg-gradient-to-b from-amber-500/20 via-yellow-500/10 to-amber-500/5 border border-amber-500/40 rounded-2xl p-3.5 flex flex-col items-center text-center shadow-lg relative overflow-hidden">
              {/* Crown Badge */}
              <div className="absolute top-2 right-2 flex items-center gap-1 bg-amber-400/20 border border-amber-400/40 px-2 py-0.5 rounded-full text-[9px] font-black text-amber-300">
                <Crown className="w-3 h-3 text-amber-400 fill-amber-400/50" />
                <span>المركز الأول</span>
              </div>

              {/* Avatar with Halo */}
              <div className="relative my-2">
                <img
                  src={topSeatAvatar}
                  alt={topSeatName}
                  className="w-16 h-16 rounded-full object-cover border-2 border-amber-400 shadow-xl ring-4 ring-amber-500/30"
                />
                <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-[9px] px-1.5 py-0.2 rounded-md shadow-md">
                  مايك #{topSeatNumber}
                </div>
              </div>

              {/* Name & Support Count */}
              <h3 className="text-sm font-black text-white flex items-center gap-1">
                <span>{topSeatName}</span>
              </h3>

              <div className="mt-2 bg-black/40 border border-amber-400/30 px-3 py-1.5 rounded-xl flex items-center gap-2">
                <Gift className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-black text-amber-300 font-mono">
                  💎 {topSeatScore.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-300 font-bold">دعم بالجولة</span>
              </div>
            </div>
          </div>

          {/* Other Seats List (if any) */}
          {seatScores.length > 1 && (
            <div className="px-5 py-1.5 relative z-10">
              <div className="bg-black/30 border border-white/10 rounded-2xl p-2.5 max-h-28 overflow-y-auto custom-scrollbar flex flex-col gap-1.5">
                <div className="text-[10px] text-slate-400 font-extrabold pb-1 border-b border-white/5 flex items-center justify-between">
                  <span>ترتيب بقية المايكات بالجولة:</span>
                  <Users className="w-3 h-3 text-slate-400" />
                </div>
                {seatScores.slice(1, 5).map((item, idx) => (
                  <div
                    key={item.seatId}
                    className="flex items-center justify-between text-xs bg-white/5 px-2 py-1 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-amber-400 w-4">
                        #{idx + 2}
                      </span>
                      <span className="text-slate-200 font-bold text-[11px] truncate max-w-[110px]">
                        {item.userName} (مايك {item.seatId})
                      </span>
                    </div>
                    <span className="font-mono font-black text-amber-300 text-[11px]">
                      💎 {item.score.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Round Total Metric */}
          <div className="px-5 py-1 relative z-10">
            <div className="bg-[#131726] border border-slate-700/60 rounded-xl p-2 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-slate-300 font-bold">
                <Award className="w-4 h-4 text-amber-400" />
                <span>إجمالي دعم جميع المايكات بالجولة:</span>
              </div>
              <span className="font-mono font-black text-amber-300 text-sm">
                💎 {totalRoundScore.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Reassuring Notice Box (Accounting separation) */}
          <div className="px-5 py-1.5 relative z-10">
            <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-2 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-[9.5px] text-emerald-200/90 font-medium leading-tight">
                تم تصفير عداد الشاشة لهذه الجولة بنجاح 🔢. <br />
                <span className="text-amber-300 font-bold">ملاحظة:</span> رصيد الهدايا الحقيقي محفوظ ومضاف بحسابات مستلمي الهدايا بشكل كلي، التصفير شاشي للجولة فقط.
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="p-4 pt-1 bg-black/30 border-t border-white/5 flex justify-center">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:brightness-110 active:scale-95 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 cursor-pointer transition-all text-center"
            >
              حسناً (إغلاق وتصفير العداد)
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
