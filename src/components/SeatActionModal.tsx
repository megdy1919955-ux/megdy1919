import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Armchair, MicOff, Mic, Lock, Unlock, Users, Sparkles, CheckCircle2 } from 'lucide-react';

interface SeatActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  seatId: number | null;
  seatUserName?: string;
  isSeatLocked?: boolean;
  isSeatMuted?: boolean;
  isCurrentAdmin?: boolean;
  onTakeSeat?: (seatId: number) => void;
  onToggleLockSeat?: (seatId: number) => void;
  onToggleMuteSeat?: (seatId: number) => void;
  onRequestMic?: (seatId: number) => void;
  onInviteAudience?: (seatId: number) => void;
}

export const SeatActionModal: React.FC<SeatActionModalProps> = ({
  isOpen,
  onClose,
  seatId,
  seatUserName,
  isSeatLocked = false,
  isSeatMuted = false,
  isCurrentAdmin = true,
  onTakeSeat,
  onToggleLockSeat,
  onToggleMuteSeat,
  onRequestMic,
  onInviteAudience
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen || seatId === null) return null;

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
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
              <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 font-bold">
                <Armchair className="w-4 h-4" />
              </div>
              <div className="text-right">
                <h3 className="text-sm font-black text-white">التحكم بالمقعد رقم ({seatId})</h3>
                <p className="text-[10px] text-slate-400">
                  {seatUserName ? `الحالي: ${seatUserName}` : 'المقعد فارغ حالياً'}
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

          {/* Action Items List */}
          <div className="p-4 space-y-2.5">
            {/* 1. Take Seat (اجلس) */}
            <button
              onClick={() => {
                triggerToast('تم جلوسك على المقعد بنجاح! 🪑');
                onTakeSeat?.(seatId);
                setTimeout(onClose, 600);
              }}
              className="w-full p-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-110 text-slate-950 font-black rounded-2xl flex items-center justify-between shadow-lg shadow-amber-500/10 cursor-pointer transition-all"
            >
              <div className="flex items-center gap-2.5">
                <Armchair className="w-5 h-5 fill-slate-950" />
                <span className="text-sm">اجلس على المقعد (Take Seat)</span>
              </div>
              <Sparkles className="w-4 h-4" />
            </button>

            {/* 2. Mute/Lock Mic (إغلاق الميكروفون) */}
            <button
              onClick={() => {
                triggerToast(isSeatMuted ? 'تم فتح ميكروفون المقعد 🎙️' : 'تم إغلاق ميكروفون المقعد 🔇');
                onToggleMuteSeat?.(seatId);
              }}
              className="w-full p-3 bg-[#1D273D] hover:bg-[#263452] border border-white/10 text-white font-bold rounded-2xl flex items-center justify-between cursor-pointer transition-all"
            >
              <div className="flex items-center gap-2.5">
                {isSeatMuted ? <Mic className="w-5 h-5 text-emerald-400" /> : <MicOff className="w-5 h-5 text-rose-400" />}
                <span className="text-sm">{isSeatMuted ? 'فتح الميكروفون' : 'إغلاق الميكروفون (Mute Mic)'}</span>
              </div>
              <span className="text-[10px] text-amber-300 font-mono bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
                {isSeatMuted ? 'مقفل' : 'متاح'}
              </span>
            </button>

            {/* 3. Request Mic (اطلب مايك) */}
            <button
              onClick={() => {
                triggerToast('تم ارسال طلب المايك للإدارة! ✋');
                onRequestMic?.(seatId);
                setTimeout(onClose, 600);
              }}
              className="w-full p-3 bg-[#1D273D] hover:bg-[#263452] border border-white/10 text-cyan-300 font-bold rounded-2xl flex items-center justify-between cursor-pointer transition-all"
            >
              <div className="flex items-center gap-2.5">
                <Mic className="w-5 h-5 text-cyan-400" />
                <span className="text-sm">اطلب مايك (Request Mic)</span>
              </div>
              <span className="text-[10px] text-cyan-400 font-bold">طابور الانتظار</span>
            </button>

            {/* 4. Open/Lock Seat (فتح/قفل المقعد) */}
            <button
              onClick={() => {
                triggerToast(isSeatLocked ? 'تم فتح المقعد للجميع 🔓' : 'تم قفل المقعد 🔒');
                onToggleLockSeat?.(seatId);
              }}
              className="w-full p-3 bg-[#1D273D] hover:bg-[#263452] border border-white/10 text-indigo-300 font-bold rounded-2xl flex items-center justify-between cursor-pointer transition-all"
            >
              <div className="flex items-center gap-2.5">
                {isSeatLocked ? <Unlock className="w-5 h-5 text-emerald-400" /> : <Lock className="w-5 h-5 text-indigo-400" />}
                <span className="text-sm">{isSeatLocked ? 'فتح المقعد (Open Seat)' : 'قفل المقعد (Lock Seat)'}</span>
              </div>
              <span className="text-[10px] text-indigo-300">التحكم بالشواغر</span>
            </button>

            {/* 5. Invite Audience (دعوة الجمهور لاستخدام الميكروفون) */}
            <button
              onClick={() => {
                triggerToast('تم إرسال دعوة عامة للجمهور للصعود على المايك! 📣');
                onInviteAudience?.(seatId);
                setTimeout(onClose, 800);
              }}
              className="w-full p-3 bg-gradient-to-r from-purple-600 to-indigo-700 hover:brightness-110 text-white font-bold rounded-2xl flex items-center justify-between shadow-md cursor-pointer transition-all"
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-5 h-5 text-purple-200" />
                <span className="text-sm">دعوة الجمهور لاستخدام الميكروفون</span>
              </div>
              <CheckCircle2 className="w-4 h-4 text-purple-300" />
            </button>
          </div>

          {/* Toast Banner */}
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
