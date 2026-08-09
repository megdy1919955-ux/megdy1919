import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MicOff, Mic, Eye, BarChart2, Gift, Sparkles } from 'lucide-react';

interface QuickMicOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  seatId?: number;
  userName?: string;
  isMuted?: boolean;
  isHost?: boolean;
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
  isMuted = false,
  isHost = false,
  onToggleMute,
  onLeaveSeat,
  onOpenDataStats,
  onSendGift
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-auto cursor-default select-none"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 80, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 80, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-[#121929]/95 backdrop-blur-xl border border-amber-500/30 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden text-white relative flex flex-col dir-rtl pointer-events-auto"
            dir="rtl"
          >
            {/* Modal Header */}
            <div className="p-4 bg-gradient-to-r from-amber-500/20 via-purple-900/30 to-[#121929] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-bold">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-right">
                  <h3 className="text-sm font-black text-white">تفاصيل خيارات المايك والمضيف</h3>
                  <p className="text-[10px] text-slate-400">
                    {userName} {seatId ? `• مقعد (${seatId})` : ''}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Mic Options Grid (الوقوف ومشاهدة | بيانات | هدية) */}
            <div className="p-4 space-y-3">
              <div className={`grid ${!isHost ? 'grid-cols-4' : 'grid-cols-3'} gap-2.5 w-full`}>
                {/* 1. كتم المايك / فتح المايك (تم إخفاؤه تماماً عن المضيف بناءً على الطلب) */}
                {!isHost && (
                  <button
                    onClick={() => {
                      onToggleMute?.();
                      triggerToast(isMuted ? 'تم فتح المايك 🎙️' : 'تم كتم المايك 🔇');
                    }}
                    className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all shadow-sm ${
                      isMuted
                        ? 'bg-rose-600/35 border-rose-500 text-rose-200 hover:bg-rose-600/50 shadow-rose-500/10'
                        : 'bg-emerald-600/25 border-emerald-500/60 text-emerald-200 hover:bg-emerald-600/40 shadow-emerald-500/10'
                    }`}
                  >
                    {isMuted ? <MicOff className="w-5 h-5 text-rose-400 stroke-[2.2]" /> : <Mic className="w-5 h-5 text-emerald-400 stroke-[2.2]" />}
                    <span className="text-[11px] font-black">{isMuted ? 'فتح المايك' : 'كتم المايك'}</span>
                  </button>
                )}

                {/* 2. الوقوف ومشاهدة (Stand Up & Watch / Leave Seat) */}
                <button
                  onClick={() => {
                    triggerToast('تم مغادرة المقعد والوقوف للمشاهدة 👋');
                    onLeaveSeat?.();
                    setTimeout(onClose, 600);
                  }}
                  className="p-3 bg-[#1D273D] border border-white/10 text-slate-200 hover:bg-rose-950/40 hover:border-rose-500/40 rounded-2xl flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all"
                >
                  <Eye className="w-5 h-5 text-cyan-400" />
                  <span className="text-[10px] font-bold text-center leading-tight">الوقوف ومشاهدة</span>
                </button>

                {/* 3. البيانات (Data / My Profile Card) */}
                <button
                  onClick={() => {
                    triggerToast('تم فتح بطاقة البيانات والبروفايل 👤');
                    onOpenDataStats?.();
                    setTimeout(onClose, 400);
                  }}
                  className="p-3 bg-[#1D273D] border border-white/10 text-slate-200 hover:bg-[#25324D] rounded-2xl flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all"
                >
                  <BarChart2 className="w-5 h-5 text-purple-400" />
                  <span className="text-[11px] font-bold">بيانات</span>
                </button>

                {/* 4. هدية (Send Gift) */}
                <button
                  onClick={() => {
                    onClose();
                    onSendGift?.();
                  }}
                  className="p-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold rounded-2xl flex flex-col items-center justify-center gap-1.5 shadow-lg shadow-pink-500/20 hover:brightness-110 cursor-pointer transition-all"
                >
                  <Gift className="w-5 h-5 fill-white" />
                  <span className="text-[11px] font-bold">هدية</span>
                </button>
              </div>
            </div>

            {/* Toast Notification */}
            {toastMessage && (
              <div className="p-2 bg-amber-400 text-slate-950 text-xs font-black text-center shadow-inner">
                {toastMessage}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
