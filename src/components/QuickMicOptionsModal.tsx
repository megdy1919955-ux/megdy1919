import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, FileText, MicOff, Mic, Eye, BarChart2, Gift, Sparkles, Check } from 'lucide-react';

interface QuickMicOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  seatId?: number;
  userName?: string;
  isMuted?: boolean;
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
  onToggleMute,
  onLeaveSeat,
  onOpenNotes,
  onOpenDataStats,
  onSendGift
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);

  if (!isOpen) return null;

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2200);
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 80, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 80, opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-sm bg-[#121929] border border-amber-500/30 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden text-white relative flex flex-col dir-rtl"
          dir="rtl"
        >
          {/* Modal Header */}
          <div className="p-4 bg-gradient-to-r from-amber-500/20 via-purple-900/30 to-[#121929] border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-bold">
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-right">
                <h3 className="text-sm font-black text-white">خيارات المايك السريعة</h3>
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

          {/* Quick Mic Options Grid (ملاحظات | إغلاق الميكروفون | الوقوف ومشاهدة | البيانات | هدية) */}
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-5 gap-2 w-full">
              {/* 1. ملاحظات (Notes) */}
              <button
                onClick={() => {
                  setShowNoteInput(!showNoteInput);
                  onOpenNotes?.();
                }}
                className={`p-2.5 rounded-2xl border flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all ${
                  showNoteInput
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                    : 'bg-[#1D273D] border-white/10 text-slate-200 hover:bg-[#25324D]'
                }`}
              >
                <FileText className="w-5 h-5 text-amber-400" />
                <span className="text-[10px] font-bold">ملاحظات</span>
              </button>

              {/* 2. كتم المايك / فتح المايك (Mute / Open Mic) */}
              <button
                onClick={() => {
                  onToggleMute?.();
                  triggerToast(isMuted ? 'تم فتح المايك 🎙️' : 'تم كتم المايك 🔇');
                }}
                className={`p-2.5 rounded-2xl border flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all shadow-sm ${
                  isMuted
                    ? 'bg-rose-600/35 border-rose-500 text-rose-200 hover:bg-rose-600/50 shadow-rose-500/10'
                    : 'bg-emerald-600/25 border-emerald-500/60 text-emerald-200 hover:bg-emerald-600/40 shadow-emerald-500/10'
                }`}
              >
                {isMuted ? <MicOff className="w-5 h-5 text-rose-400 stroke-[2.2]" /> : <Mic className="w-5 h-5 text-emerald-400 stroke-[2.2]" />}
                <span className="text-[10px] font-black">{isMuted ? 'فتح المايك' : 'كتم المايك'}</span>
              </button>

              {/* 3. الوقوف ومشاهدة (Stand Up & Watch / Leave Seat) */}
              <button
                onClick={() => {
                  triggerToast('تم مغادرة المقعد للجمهور 👋');
                  onLeaveSeat?.();
                  setTimeout(onClose, 600);
                }}
                className="p-2.5 bg-[#1D273D] border border-white/10 text-slate-200 hover:bg-rose-950/40 hover:border-rose-500/40 rounded-2xl flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all"
              >
                <Eye className="w-5 h-5 text-cyan-400" />
                <span className="text-[10px] font-bold text-center leading-tight">الوقوف ومشاهدة</span>
              </button>

              {/* 4. البيانات (Data / Stats) */}
              <button
                onClick={() => {
                  triggerToast('تم فتح إحصائيات البيانات 📊');
                  onOpenDataStats?.();
                }}
                className="p-2.5 bg-[#1D273D] border border-white/10 text-slate-200 hover:bg-[#25324D] rounded-2xl flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all"
              >
                <BarChart2 className="w-5 h-5 text-purple-400" />
                <span className="text-[10px] font-bold">البيانات</span>
              </button>

              {/* 5. هدية (Send Gift) */}
              <button
                onClick={() => {
                  onClose();
                  onSendGift?.();
                }}
                className="p-2.5 bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold rounded-2xl flex flex-col items-center justify-center gap-1.5 shadow-lg shadow-pink-500/20 hover:brightness-110 cursor-pointer transition-all"
              >
                <Gift className="w-5 h-5 fill-white" />
                <span className="text-[10px] font-bold">هدية</span>
              </button>
            </div>

            {/* Expanded Notes Input Field if toggled */}
            {showNoteInput && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="pt-2 space-y-2 border-t border-white/10"
              >
                <label className="text-[11px] font-bold text-amber-300 block">
                  كتابة ملاحظة سريعة على المقعد:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="مثال: مرحباً بكم جميعاً، المايك متاح..."
                    className="flex-1 bg-slate-900 border border-amber-500/30 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400"
                  />
                  <button
                    onClick={() => {
                      triggerToast('تم حفظ الملاحظة على المايك 📝');
                      setShowNoteInput(false);
                    }}
                    className="p-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-bold text-xs flex items-center justify-center cursor-pointer"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Toast Notification */}
          {toastMessage && (
            <div className="p-2 bg-amber-400 text-slate-950 text-xs font-black text-center shadow-inner">
              {toastMessage}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
