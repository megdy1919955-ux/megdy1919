import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MicOff, Mic, Eye, User, Gift } from 'lucide-react';

interface QuickMicOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  seatId?: number;
  userName?: string;
  avatar?: string;
  userId?: string;
  isMuted?: boolean;
  isHost?: boolean;
  canControlMic?: boolean;
  isCurrentAdmin?: boolean;
  onToggleMute?: () => void;
  onLeaveSeat?: () => void;
  onOpenNotes?: () => void;
  onOpenDataStats?: () => void;
  onSendGift?: () => void;
}

export const QuickMicOptionsModal: React.FC<QuickMicOptionsModalProps> = ({
  isOpen,
  onClose,
  seatId,
  userName = 'أنا',
  avatar,
  userId,
  isMuted = false,
  isHost = false,
  canControlMic = true,
  isCurrentAdmin = false,
  onToggleMute,
  onLeaveSeat,
  onOpenDataStats,
  onSendGift
}) => {
  const hasMicControl = canControlMic || isCurrentAdmin;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[80] bg-black/15 flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-auto cursor-default select-none"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 80, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 80, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-gradient-to-b from-[#162035]/95 to-[#0E1524]/95 backdrop-blur-md border border-white/10 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden text-white relative flex flex-col dir-rtl pointer-events-auto"
            dir="rtl"
          >
            {/* Modal Header */}
            <div className="p-3.5 bg-gradient-to-r from-purple-900/30 via-slate-900/60 to-[#121929] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt={userName}
                      className="w-10 h-10 rounded-full object-cover border-2 border-amber-400 shadow-md"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 border-2 border-amber-300 flex items-center justify-center text-slate-950 font-black shadow-md">
                      <User className="w-5 h-5 text-slate-950" />
                    </div>
                  )}
                  {isHost && (
                    <span className="absolute -top-1 -right-1 text-xs">👑</span>
                  )}
                </div>
                <div className="text-right">
                  <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                    <span>{userName}</span>
                    {seatId && (
                      <span className="text-[10px] bg-white/10 text-amber-300 px-1.5 py-0.2 rounded-full font-mono font-bold">
                        مايك {seatId}
                      </span>
                    )}
                  </h3>
                  <p className="text-[10.5px] text-slate-400 font-mono">
                    {userId ? `ID: ${userId}` : 'حسابك النشط على المايك'}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="إغلاق"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Mic Options: 3 Main Cards (النزول، كتم الصوت، الملف الشخصي) */}
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-3 gap-2.5 w-full">
                {/* 1. الوقوف والمشاهدة (النزول) */}
                <button
                  type="button"
                  onClick={() => {
                    onLeaveSeat?.();
                    onClose();
                  }}
                  className="p-3 bg-gradient-to-b from-[#1F2B45] to-[#162035] border border-cyan-500/30 hover:border-cyan-400/70 text-slate-100 hover:bg-cyan-950/40 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all shadow-md active:scale-95 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Eye className="w-5 h-5 text-cyan-400" />
                  </div>
                  <span className="text-[11px] font-black text-center leading-tight text-cyan-200">
                    الوقوف والنزول
                  </span>
                </button>

                {/* 2. زر الهدايا الواسطي (إرسال هدية) */}
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onSendGift?.();
                  }}
                  className="p-3 bg-gradient-to-b from-[#2D1A3E] to-[#1D1128] border border-pink-500/40 hover:border-pink-400 text-pink-200 hover:bg-pink-950/40 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all shadow-md active:scale-95 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-400/40 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Gift className="w-5 h-5 text-pink-400" />
                  </div>
                  <span className="text-[11px] font-black text-center leading-tight text-pink-200">
                    إرسال هدية
                  </span>
                </button>

                {/* 3. الملف الشخصي */}
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenDataStats?.();
                  }}
                  className="p-3 bg-gradient-to-b from-[#201D3D] to-[#17142E] border border-purple-500/40 hover:border-purple-400 text-white rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all shadow-md active:scale-95 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <User className="w-5 h-5 text-purple-300" />
                  </div>
                  <span className="text-[11px] font-black text-purple-200">
                    الملف الشخصي
                  </span>
                </button>
              </div>

              {/* Status strip showing current mic status without yellow banner */}
              {hasMicControl && (
                <button
                  type="button"
                  onClick={() => {
                    onToggleMute?.();
                  }}
                  className={`w-full py-2.5 px-3 rounded-xl border flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm ${
                    isMuted
                      ? 'bg-rose-950/60 border-rose-500/60 text-rose-200 hover:bg-rose-900/60'
                      : 'bg-emerald-950/50 border-emerald-500/50 text-emerald-200 hover:bg-emerald-900/50'
                  }`}
                >
                  {isMuted ? (
                    <>
                      <MicOff className="w-4 h-4 text-rose-400" />
                      <span className="text-xs font-black">المايك مكتوم حالياً • اضغط لفتح المايك 🎙️</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-black">المايك قيد التحدث • اضغط لكتم الصوت 🔇</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
