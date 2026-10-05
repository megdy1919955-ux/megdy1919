import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Armchair, MicOff, Mic, Lock, Unlock, Users, Sparkles, CheckCircle2, UserMinus, UserCheck, ShieldAlert, Gift, Eye } from 'lucide-react';

interface SeatActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  seatId: number | null;
  seatUserName?: string;
  isSeatLocked?: boolean;
  isSeatMuted?: boolean;
  isInvitationPending?: boolean;
  isCurrentAdmin?: boolean;
  isRoomOwner?: boolean;
  currentUserSeatId?: number | null;
  onTakeSeat?: (seatId: number) => void;
  onToggleLockSeat?: (seatId: number) => void;
  onToggleMuteSeat?: (seatId: number) => void;
  onRequestMic?: (seatId: number) => void;
  onInviteAudience?: (seatId: number) => void;
  onRemoveFromMic?: (seatId: number) => void;
  onViewProfile?: (seatId: number) => void;
  onAcceptInvitation?: (seatId: number) => void;
  onCancelInvitation?: (seatId: number) => void;
}

export const SeatActionModal: React.FC<SeatActionModalProps> = ({
  isOpen,
  onClose,
  seatId,
  seatUserName,
  isSeatLocked = false,
  isSeatMuted = false,
  isInvitationPending = false,
  isCurrentAdmin = true,
  isRoomOwner = false,
  currentUserSeatId,
  onTakeSeat,
  onToggleLockSeat,
  onToggleMuteSeat,
  onRequestMic,
  onInviteAudience,
  onRemoveFromMic,
  onViewProfile,
  onAcceptInvitation,
  onCancelInvitation
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen || seatId === null) return null;

  const isOccupied = Boolean(seatUserName && seatUserName.trim() !== '' && !seatUserName.includes('فارغ'));
  const canClimbLocked = isRoomOwner || isCurrentAdmin;

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[80] flex items-end justify-center p-3 pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))] bg-transparent pointer-events-auto select-none"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md bg-transparent border-0 shadow-none text-white relative flex flex-col dir-rtl pointer-events-auto"
          dir="rtl"
        >
          {/* Action Items List (أفقي ومصغر وأنيق لا يغطي الشاشة) */}
          <div className="w-full">
            {/* PENDING INVITATION MANAGEMENT OPTIONS */}
            {isInvitationPending ? (
              <div className="w-full bg-[#121928]/95 backdrop-blur-md border border-white/15 rounded-2xl p-1.5 shadow-2xl grid grid-cols-3 gap-1.5">
                {/* 1. موافقة وفتح المايك */}
                <button
                  onClick={() => {
                    triggerToast('تمت الموافقة وفتح المايك بنجاح! 🎙️');
                    onAcceptInvitation?.(seatId);
                    setTimeout(onClose, 400);
                  }}
                  className="py-2 px-1 rounded-xl flex flex-col items-center justify-center gap-1 bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 hover:border-emerald-300 transition-all active:scale-95 shadow-sm cursor-pointer"
                  title="موافقة وفتح المايك"
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <Mic className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-[10px] font-black whitespace-nowrap">موافقة وفتح</span>
                </button>

                {/* 2. إلغاء الدعوة */}
                <button
                  onClick={() => {
                    triggerToast('تم إلغاء الدعوة وتفريغ المقعد ❌');
                    onCancelInvitation?.(seatId);
                    setTimeout(onClose, 400);
                  }}
                  className="py-2 px-1 rounded-xl flex flex-col items-center justify-center gap-1 bg-rose-500/20 border border-rose-500/40 text-rose-300 hover:border-rose-400 transition-all active:scale-95 shadow-sm cursor-pointer"
                  title="إلغاء الدعوة"
                >
                  <div className="w-7 h-7 rounded-lg bg-rose-500/20 flex items-center justify-center">
                    <X className="w-4 h-4 text-rose-400" />
                  </div>
                  <span className="text-[10px] font-black whitespace-nowrap">إلغاء وتفريغ</span>
                </button>

                {/* 3. الملف الشخصي */}
                <button
                  onClick={() => {
                    onViewProfile?.(seatId);
                    onClose();
                  }}
                  className="py-2 px-1 rounded-xl flex flex-col items-center justify-center gap-1 bg-purple-500/20 border border-purple-400/40 text-purple-200 hover:border-purple-300 transition-all active:scale-95 shadow-sm cursor-pointer"
                  title="الملف الشخصي"
                >
                  <div className="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <Eye className="w-4 h-4 text-purple-300" />
                  </div>
                  <span className="text-[10px] font-black whitespace-nowrap">الملف الشخصي</span>
                </button>
              </div>
            ) : isOccupied ? (
              /* OCCUPIED SEAT MANAGEMENT - COMPACT HORIZONTAL BAR */
              <div className="w-full bg-[#121928]/95 backdrop-blur-md border border-white/15 rounded-2xl p-1.5 shadow-2xl grid grid-cols-4 gap-1.5">
                {/* 1. تكتم المايك / فتح المايك */}
                <button
                  onClick={() => {
                    const isHostSeat = seatId === 1 || seatUserName?.includes('المضيف') || seatUserName?.includes('مالك');
                    const isSelf = currentUserSeatId === seatId || seatUserName?.includes('أنا');
                    if (isHostSeat && !isRoomOwner && !isSelf) {
                      triggerToast('لا تملك صلاحية تعديل مايك مالك الغرفة 👑');
                      return;
                    }
                    triggerToast(isSeatMuted ? 'تم فتح المايك للمتحدث 🎙️' : 'تم كتم ميكروفون المتحدث 🔇');
                    onToggleMuteSeat?.(seatId);
                  }}
                  className={`py-2 px-1 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer transition-all active:scale-95 shadow-sm border ${
                    isSeatMuted
                      ? 'bg-rose-500/20 border-rose-400/40 text-rose-200 hover:border-rose-300'
                      : 'bg-emerald-500/20 border-emerald-400/40 text-emerald-200 hover:border-emerald-300'
                  }`}
                  title={isSeatMuted ? 'فتح المايك' : 'تكتم المايك'}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    isSeatMuted ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {isSeatMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </div>
                  <span className="text-[10px] font-black whitespace-nowrap">
                    {isSeatMuted ? 'فتح المايك' : 'تكتم المايك'}
                  </span>
                </button>

                {/* 2. إنزال من المايك */}
                <button
                  onClick={() => {
                    const isHostSeat = seatId === 1 || seatUserName?.includes('المضيف') || seatUserName?.includes('مالك');
                    if (isHostSeat && !isRoomOwner) {
                      triggerToast('لا يمكن إنزال مالك الغرفة من المايك 👑');
                      return;
                    }
                    triggerToast(`تم إنزال ${seatUserName} إلى الجمهور! ⬇️`);
                    onRemoveFromMic?.(seatId);
                    setTimeout(onClose, 500);
                  }}
                  className="py-2 px-1 rounded-xl flex flex-col items-center justify-center gap-1 bg-rose-500/20 border border-rose-500/40 text-rose-300 hover:border-rose-400 transition-all active:scale-95 shadow-sm cursor-pointer"
                  title="إنزال"
                >
                  <div className="w-7 h-7 rounded-lg bg-rose-500/20 flex items-center justify-center">
                    <UserMinus className="w-4 h-4 text-rose-400" />
                  </div>
                  <span className="text-[10px] font-black text-rose-200 whitespace-nowrap">
                    إنزال
                  </span>
                </button>

                {/* 3. الملف الشخصي */}
                <button
                  onClick={() => {
                    onViewProfile?.(seatId);
                    onClose();
                  }}
                  className="py-2 px-1 rounded-xl flex flex-col items-center justify-center gap-1 bg-purple-500/20 border border-purple-400/40 text-purple-200 hover:border-purple-300 transition-all active:scale-95 shadow-sm cursor-pointer"
                  title="الملف الشخصي"
                >
                  <div className="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <Eye className="w-4 h-4 text-purple-300" />
                  </div>
                  <span className="text-[10px] font-black text-purple-200 whitespace-nowrap">
                    الملف الشخصي
                  </span>
                </button>

                {/* 4. إقفال المايك */}
                <button
                  onClick={() => {
                    triggerToast(isSeatLocked ? 'تم فتح المقعد 🔓' : 'تم إقفال المايك 🔒');
                    onToggleLockSeat?.(seatId);
                  }}
                  className={`py-2 px-1 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer transition-all active:scale-95 shadow-sm border ${
                    isSeatLocked
                      ? 'bg-amber-500/20 border-amber-400/40 text-amber-200'
                      : 'bg-indigo-500/20 border-indigo-400/40 text-indigo-200'
                  }`}
                  title={isSeatLocked ? 'فتح المايك' : 'إقفال المايك'}
                >
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                    {isSeatLocked ? <Unlock className="w-4 h-4 text-emerald-300" /> : <Lock className="w-4 h-4 text-indigo-300" />}
                  </div>
                  <span className="text-[10px] font-black text-indigo-200 whitespace-nowrap">
                    {isSeatLocked ? 'فتح المايك' : 'إقفال المايك'}
                  </span>
                </button>
              </div>
            ) : (
              /* EMPTY SEAT MANAGEMENT OPTIONS - COMPACT HORIZONTAL BAR */
              isCurrentAdmin ? (
                <div className="w-full bg-[#121928]/95 backdrop-blur-md border border-white/15 rounded-2xl p-1.5 shadow-2xl grid grid-cols-4 gap-1.5">
                  {/* 1. انتقال */}
                  <button
                    onClick={() => {
                      if (isSeatLocked && !canClimbLocked) {
                        triggerToast('عذراً! هذا المايك مغلق حالياً 🔒');
                        return;
                      }
                      if (currentUserSeatId) {
                        triggerToast('جاري انتقال المضيف والعداد تلقائياً... 🔄');
                      } else {
                        triggerToast('تم الصعود على المقعد بنجاح! 🪑');
                      }
                      onTakeSeat?.(seatId);
                      setTimeout(onClose, 500);
                    }}
                    disabled={isSeatLocked && !canClimbLocked}
                    className={`py-2 px-1 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer transition-all active:scale-95 shadow-sm border ${
                      isSeatLocked && !canClimbLocked
                        ? 'bg-slate-800/60 border-slate-700/50 text-slate-500 opacity-60 cursor-not-allowed'
                        : isSeatLocked && canClimbLocked
                        ? 'bg-gradient-to-b from-amber-600/30 to-amber-700/40 border-amber-400/50 text-amber-200 hover:border-amber-300'
                        : 'bg-gradient-to-b from-amber-500/25 to-yellow-600/20 border-amber-400/40 text-amber-200 hover:border-amber-300'
                    }`}
                    title="انتقال"
                  >
                    <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center">
                      <Armchair className="w-4 h-4 text-amber-300" />
                    </div>
                    <span className="text-[10px] font-black text-amber-200 whitespace-nowrap">
                      انتقال
                    </span>
                  </button>

                  {/* 2. تكتم المايك */}
                  <button
                    onClick={() => {
                      triggerToast(isSeatMuted ? 'تم فتح المايك للمقعد 🎙️' : 'تم كتم المايك للمقعد 🔇');
                      onToggleMuteSeat?.(seatId);
                    }}
                    className={`py-2 px-1 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer transition-all active:scale-95 shadow-sm border ${
                      isSeatMuted
                        ? 'bg-rose-500/20 border-rose-400/40 text-rose-200 hover:border-rose-300'
                        : 'bg-emerald-500/20 border-emerald-400/40 text-emerald-200 hover:border-emerald-300'
                    }`}
                    title={isSeatMuted ? 'فتح المايك' : 'تكتم المايك'}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      isSeatMuted ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {isSeatMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </div>
                    <span className={`text-[10px] font-black whitespace-nowrap ${
                      isSeatMuted ? 'text-rose-200' : 'text-emerald-200'
                    }`}>
                      {isSeatMuted ? 'فتح المايك' : 'تكتم المايك'}
                    </span>
                  </button>

                  {/* 3. إقفال المايك */}
                  <button
                    onClick={() => {
                      triggerToast(isSeatLocked ? 'تم فتح المقعد 🔓' : 'تم إقفال المايك 🔒');
                      onToggleLockSeat?.(seatId);
                    }}
                    className={`py-2 px-1 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer transition-all active:scale-95 shadow-sm border ${
                      isSeatLocked
                        ? 'bg-amber-500/20 border-amber-400/40 text-amber-200 hover:border-amber-300'
                        : 'bg-indigo-500/20 border-indigo-400/40 text-indigo-200 hover:border-indigo-300'
                    }`}
                    title={isSeatLocked ? 'فتح المايك' : 'إقفال المايك'}
                  >
                    <div className="w-7 h-7 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                      {isSeatLocked ? (
                        <Unlock className="w-4 h-4 text-emerald-300" />
                      ) : (
                        <Lock className="w-4 h-4 text-indigo-300" />
                      )}
                    </div>
                    <span className="text-[10px] font-black text-indigo-200 whitespace-nowrap">
                      {isSeatLocked ? 'فتح المايك' : 'إقفال المايك'}
                    </span>
                  </button>

                  {/* 4. قائمة المتواجدين */}
                  <button
                    onClick={() => {
                      onInviteAudience?.(seatId);
                      onClose();
                    }}
                    className="py-2 px-1 rounded-xl flex flex-col items-center justify-center gap-1 bg-purple-500/20 border border-purple-400/40 hover:border-purple-300 text-purple-200 transition-all active:scale-95 shadow-sm cursor-pointer"
                    title="قائمة المتواجدين"
                  >
                    <div className="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <Users className="w-4 h-4 text-purple-300" />
                    </div>
                    <span className="text-[10px] font-black text-purple-200 whitespace-nowrap">
                      قائمة المتواجدين
                    </span>
                  </button>
                </div>
              ) : (
                /* Audience compact action button */
                <button
                  onClick={() => {
                    if (isSeatLocked && !canClimbLocked) {
                      triggerToast('عذراً! هذا المايك مغلق حالياً 🔒');
                      return;
                    }
                    if (isSeatLocked) {
                      triggerToast('تم ارسال طلب المايك للإدارة! ✋');
                      onRequestMic?.(seatId);
                    } else {
                      triggerToast('تم جلوسك على المقعد بنجاح! 🪑');
                      onTakeSeat?.(seatId);
                    }
                    setTimeout(onClose, 500);
                  }}
                  className="w-full py-2.5 px-3 bg-[#121928]/95 backdrop-blur-md border border-cyan-500/40 hover:border-cyan-400 text-cyan-200 font-bold rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xl active:scale-95"
                >
                  <Armchair className="w-4 h-4 text-cyan-300" />
                  <span className="text-xs font-black">
                    {isSeatLocked ? 'طلب الصعود للمايك ✋' : 'الصعود على المقعد 🪑'}
                  </span>
                </button>
              )
            )}
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
