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
}

export const SeatActionModal: React.FC<SeatActionModalProps> = ({
  isOpen,
  onClose,
  seatId,
  seatUserName,
  isSeatLocked = false,
  isSeatMuted = false,
  isCurrentAdmin = true,
  isRoomOwner = false,
  currentUserSeatId,
  onTakeSeat,
  onToggleLockSeat,
  onToggleMuteSeat,
  onRequestMic,
  onInviteAudience,
  onRemoveFromMic,
  onViewProfile
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen || seatId === null) return null;

  const isOccupied = Boolean(seatUserName && seatUserName.trim() !== '' && !seatUserName.includes('فارغ'));

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:p-4 bg-transparent transition-all pointer-events-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-sm bg-[#121929] border-t-2 border-amber-500/60 border-x border-b border-amber-500/20 rounded-t-[2.5rem] sm:rounded-3xl shadow-[0_-12px_60px_rgba(0,0,0,0.85)] overflow-hidden text-white relative flex flex-col dir-rtl"
          dir="rtl"
        >
          {/* BottomSheet Drag Indicator Pill */}
          <div className="pt-2.5 pb-1 flex justify-center shrink-0">
            <div className="w-10 h-1 rounded-full bg-white/25" />
          </div>

          {/* Modal Header */}
          <div className="px-4 pb-3 pt-1 bg-gradient-to-r from-amber-500/15 via-purple-900/20 to-transparent border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 font-bold">
                <Armchair className="w-4 h-4" />
              </div>
              <div className="text-right">
                <h3 className="text-sm font-black text-white">التحكم بالمقعد رقم ({seatId})</h3>
                <p className="text-[10px] text-amber-300 font-bold">
                  {isOccupied ? `المستخدم الحالي: ${seatUserName}` : 'المقعد فارغ حالياً'}
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
            {/* OCCUPIED SEAT MANAGEMENT OPTIONS */}
            {isOccupied ? (
              <>
                {/* 1. Mute/Unmute Mic (كتم المايك / فتح المايك - متاح فقط للإداريين والمالك) */}
                {(isCurrentAdmin || isRoomOwner) && (() => {
                  const isHostSeat = seatId === 1 || seatUserName?.includes('المضيف') || seatUserName?.includes('مالك');
                  const isSelf = currentUserSeatId === seatId || seatUserName?.includes('أنا');
                  const isModRestricted = isHostSeat && !isRoomOwner && !isSelf;

                  return (
                    <button
                      onClick={() => {
                        if (isModRestricted) {
                          triggerToast('لا تملك صلاحية تعديل أو إلغاء كتم ميكروفون مالك الغرفة 👑');
                          return;
                        }
                        triggerToast(isSeatMuted ? 'تم فتح المايك للمتحدث 🎙️' : 'تم كتم ميكروفون المتحدث 🔇');
                        onToggleMuteSeat?.(seatId);
                      }}
                      className={`w-full p-3 font-bold rounded-2xl flex items-center justify-between transition-all border shadow-md ${
                        isModRestricted
                          ? 'opacity-60 bg-slate-800/40 border-slate-700 text-slate-400 cursor-not-allowed'
                          : isSeatMuted
                          ? 'bg-rose-600/35 hover:bg-rose-600/50 border-rose-500 text-rose-200 shadow-rose-500/20 cursor-pointer'
                          : 'bg-emerald-600/25 hover:bg-emerald-600/40 border-emerald-500/60 text-emerald-200 shadow-emerald-500/10 cursor-pointer'
                      }`}
                      title={isModRestricted ? 'محمي بصلاحيات مالك الغرفة 👑' : undefined}
                    >
                      <div className="flex items-center gap-2.5">
                        {isSeatMuted ? (
                          <MicOff className="w-5 h-5 text-rose-400 stroke-[2.2]" />
                        ) : (
                          <Mic className="w-5 h-5 text-emerald-400 stroke-[2.2]" />
                        )}
                        <span className="text-sm font-black">
                          {isSeatMuted ? 'فتح المايك (Unmute)' : 'كتم المايك (Mute)'}
                        </span>
                      </div>
                      <span className={`text-[10.5px] font-black px-2.5 py-1 rounded-xl border ${
                        isModRestricted
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : isSeatMuted
                          ? 'bg-rose-500/30 text-rose-200 border-rose-400/60'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      }`}>
                        {isModRestricted ? 'محمي 👑' : isSeatMuted ? 'مكتوم 🔇' : 'مفتوح 🎙️'}
                      </span>
                    </button>
                  );
                })()}

                {/* 2. Remove From Mic to Audience (النزول إلى الجمهور) */}
                {isCurrentAdmin && (
                  <button
                    onClick={() => {
                      const isHostSeat = seatId === 1 || seatUserName?.includes('المضيف') || seatUserName?.includes('مالك');
                      if (isHostSeat && !isRoomOwner) {
                        triggerToast('لا يمكن للمشرف إنزال مالك الغرفة من المايك 👑');
                        return;
                      }
                      triggerToast(`تم إنزال ${seatUserName} إلى الجمهور! ⬇️`);
                      onRemoveFromMic?.(seatId);
                      setTimeout(onClose, 600);
                    }}
                    className="w-full p-3 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 font-bold rounded-2xl flex items-center justify-between cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <UserMinus className="w-5 h-5 text-rose-400" />
                      <span className="text-sm">إنزال إلى الجمهور (Remove From Mic)</span>
                    </div>
                    <span className="text-[10px] text-rose-400 font-bold">طرد من المايك</span>
                  </button>
                )}

                {/* 3. View Profile (عرض البروفايل) */}
                <button
                  onClick={() => {
                    onViewProfile?.(seatId);
                    onClose();
                  }}
                  className="w-full p-3 bg-[#1D273D] hover:bg-[#263452] border border-white/10 text-cyan-300 font-bold rounded-2xl flex items-center justify-between cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <Eye className="w-5 h-5 text-cyan-400" />
                    <span className="text-sm">عرض البطاقة الشخصية (View Profile)</span>
                  </div>
                  <span className="text-[10px] text-cyan-400">الملف الشخصي</span>
                </button>

                {/* 4. Open/Lock Seat */}
                {isCurrentAdmin && (
                  <button
                    onClick={() => {
                      triggerToast(isSeatLocked ? 'تم فتح المقعد 🔓' : 'تم قفل المقعد 🔒');
                      onToggleLockSeat?.(seatId);
                    }}
                    className="w-full p-3 bg-[#1D273D] hover:bg-[#263452] border border-white/10 text-indigo-300 font-bold rounded-2xl flex items-center justify-between cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      {isSeatLocked ? <Unlock className="w-5 h-5 text-emerald-400" /> : <Lock className="w-5 h-5 text-indigo-400" />}
                      <span className="text-sm">{isSeatLocked ? 'فتح المقعد' : 'قفل المقعد (Lock Seat)'}</span>
                    </div>
                    <span className="text-[10px] text-indigo-300">قفل الإدارة</span>
                  </button>
                )}
              </>
            ) : (
              /* EMPTY SEAT MANAGEMENT OPTIONS */
              <>
                {/* 1. Take Seat / Transfer to Seat */}
                <button
                  onClick={() => {
                    if (isSeatLocked) {
                      triggerToast('عذراً! هذا المايك مغلق أو مقفل حالياً 🔒 لا يمكن الصعود عليه نهائياً.');
                      return;
                    }
                    if (currentUserSeatId) {
                      triggerToast('جاري نقل المضيف والعداد تلقائياً... 🔄');
                    } else {
                      triggerToast('تم جلوسك على المقعد بنجاح! 🪑');
                    }
                    onTakeSeat?.(seatId);
                    setTimeout(onClose, 600);
                  }}
                  disabled={isSeatLocked}
                  className={`w-full p-3 rounded-2xl flex items-center justify-between shadow-lg transition-all ${
                    isSeatLocked
                      ? 'bg-slate-800/80 border border-slate-700 text-slate-400 opacity-60 cursor-not-allowed'
                      : 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:brightness-110 text-slate-950 font-black shadow-amber-500/20 cursor-pointer'
                  }`}
                  title={isSeatLocked ? 'المايك مقفل حالياً 🔒' : undefined}
                >
                  <div className="flex items-center gap-2.5">
                    {isSeatLocked ? <Lock className="w-5 h-5 text-slate-400" /> : <Armchair className="w-5 h-5 fill-slate-950" />}
                    <span className="text-sm font-black">
                      {isSeatLocked
                        ? 'المايك مغلق/مقفل 🔒 (غير متاح للصعود)'
                        : currentUserSeatId
                        ? 'انتقال المضيف للمايك (نقل العداد تلقائياً 🔄)'
                        : 'اجلس على المقعد (Take Seat)'}
                    </span>
                  </div>
                  {isSeatLocked ? (
                    <span className="text-[10px] bg-rose-500/20 text-rose-300 font-bold px-2 py-0.5 rounded-lg border border-rose-500/30">
                      مقفل 🔒
                    </span>
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                </button>

                {/* 2. Mute/Unmute Mic for Owner & Moderator, or Request Mic for Audience */}
                {isCurrentAdmin ? (
                  <button
                    onClick={() => {
                      triggerToast(isSeatMuted ? 'تم فتح المايك للمقعد 🎙️' : 'تم كتم المايك للمقعد 🔇');
                      onToggleMuteSeat?.(seatId);
                    }}
                    className={`w-full p-3 font-bold rounded-2xl flex items-center justify-between cursor-pointer transition-all border shadow-md ${
                      isSeatMuted
                        ? 'bg-rose-600/35 hover:bg-rose-600/50 border-rose-500 text-rose-200 shadow-rose-500/20'
                        : 'bg-emerald-600/25 hover:bg-emerald-600/40 border-emerald-500/60 text-emerald-200 shadow-emerald-500/10'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {isSeatMuted ? (
                        <MicOff className="w-5 h-5 text-rose-400 stroke-[2.2]" />
                      ) : (
                        <Mic className="w-5 h-5 text-emerald-400 stroke-[2.2]" />
                      )}
                      <span className="text-sm font-black">
                        {isSeatMuted ? 'فتح المايك (Unmute Seat)' : 'كتم المايك (Mute Seat)'}
                      </span>
                    </div>
                    <span className={`text-[10.5px] font-black px-2.5 py-1 rounded-xl border ${
                      isSeatMuted
                        ? 'bg-rose-500/30 text-rose-200 border-rose-400/60'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    }`}>
                      {isSeatMuted ? 'مكتوم 🔇' : 'مفتوح 🎙️'}
                    </span>
                  </button>
                ) : (
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
                      <span className="text-sm">تقديم طلب صعود للمايك (Request Mic)</span>
                    </div>
                    <span className="text-[10px] text-cyan-400 font-bold">طابور الانتظار ✋</span>
                  </button>
                )}

                {/* 3. Open/Lock Seat (فتح/قفل المقعد) */}
                {isCurrentAdmin && (
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
                )}

                {/* 4. Invite Audience (دعوة شخص للصعود) */}
                {isCurrentAdmin && (
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
                      <span className="text-sm">دعوة شخص من الجمهور للصعود</span>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-purple-300" />
                  </button>
                )}
              </>
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
