import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, HelpCircle, Swords, Check } from 'lucide-react';

interface TeamBattleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmStart: (config: { durationMinutes: number; joinedTeam: 'none' | 'red' | 'blue' }) => void;
  onTriggerToast?: (msg: string) => void;
  activeMicCount?: number;
}

export const TeamBattleModal: React.FC<TeamBattleModalProps> = ({
  isOpen,
  onClose,
  onConfirmStart,
  onTriggerToast,
  activeMicCount,
}) => {
  const [selectedDuration, setSelectedDuration] = useState<number>(15); // Default 15 mins
  const [joinedTeam, setJoinedTeam] = useState<'none' | 'red' | 'blue'>('none'); // Default 'none' (ولا واحد)
  const [showInfoPopover, setShowInfoPopover] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    const allowedMicCounts = [2, 4, 5, 6, 8, 9, 10, 12, 15, 20];
    if (activeMicCount !== undefined && !allowedMicCounts.includes(activeMicCount)) {
      if (onTriggerToast) {
        onTriggerToast('لا يمكن تشغيل التحدي بهذا العدد من المايكات');
      }
      onClose();
      return;
    }

    onConfirmStart({
      durationMinutes: selectedDuration,
      joinedTeam,
    });
    if (onTriggerToast) {
      onTriggerToast(`تم بدء معركة الفريق بنجاح ⚔️ (الجولة: ${selectedDuration} دقيقة)`);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-auto select-none"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md bg-[#0D121F] border-t sm:border border-purple-500/30 rounded-t-3xl sm:rounded-3xl shadow-2xl text-white relative overflow-hidden dir-rtl flex flex-col max-h-[92vh]"
        >
          {/* Header Bar Banner (Matching Image 1) */}
          <div className="relative h-14 bg-gradient-to-r from-purple-800 via-pink-600 to-rose-600 flex items-center justify-between px-4 shrink-0 shadow-lg">
            {/* Title Centered */}
            <div className="flex-1 text-center flex items-center justify-center gap-2">
              <Swords className="w-5 h-5 text-white animate-pulse" />
              <h3 className="text-base font-black text-white tracking-wide drop-shadow-md">
                معركة الفريق
              </h3>
            </div>

            {/* Info Button ? on Right/Left */}
            <button
              onClick={() => setShowInfoPopover(!showInfoPopover)}
              className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer absolute right-4"
              title="قواعد وتفاصيل المعركة"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* Close Button X on Left */}
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-all cursor-pointer absolute left-4"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Info Popover Overlay if toggled */}
          {showInfoPopover && (
            <div className="bg-purple-950/95 border-b border-purple-500/40 p-3 text-xs text-purple-100 space-y-1 animate-fadeIn">
              <p className="font-bold">📜 قواعد معركة الفريق (Team PK):</p>
              <ul className="list-disc list-inside text-[11px] space-y-0.5 text-purple-200/90">
                <li>تنقسم مايكات الغرفة إلى فريقين: الفريق الأحمر والفريق الأزرق.</li>
                <li>يتم حساب نتائج الهدايا المرسلة للمتنافسين على المايكات لكل فريق.</li>
                <li>الفريق الذي يجمع أعلى قيمة PK عند انتهاء وقت الجولة يكون هو الفائز!</li>
              </ul>
            </div>
          )}

          {/* Body Content */}
          <div className="p-4 space-y-5 overflow-y-auto custom-scrollbar">
            {/* Subheading Text */}
            <p className="text-center text-xs font-bold text-slate-200 leading-relaxed px-2">
              معركة بين الأحمر والأزرق، وسيكون صاحب قيمة PK الأعلى هو الفائز!
            </p>

            {/* Graphic Team Preview (Matching Image 1 Graphic Header) */}
            <div className="flex items-center justify-center gap-3 py-1">
              {/* Red Team Seats Container (Right in RTL) */}
              <div className="flex-1 bg-gradient-to-r from-rose-600/90 via-red-600/90 to-amber-600/90 rounded-2xl p-2.5 flex items-center justify-around border border-rose-400/50 shadow-lg shadow-rose-500/20">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={`red-icon-${i}`}
                    className="w-7 h-7 rounded-full bg-white/20 border border-white/40 flex items-center justify-center shadow-inner"
                  >
                    <span className="text-xs">🪑</span>
                  </div>
                ))}
              </div>

              {/* Center Crossed Swords Icon */}
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center border-2 border-white/80 shadow-xl shadow-pink-500/40 animate-bounce">
                  <Swords className="w-5 h-5 text-white" />
                </div>
              </div>

              {/* Blue Team Seats Container (Left in RTL) */}
              <div className="flex-1 bg-gradient-to-r from-cyan-600/90 via-blue-600/90 to-indigo-600/90 rounded-2xl p-2.5 flex items-center justify-around border border-cyan-400/50 shadow-lg shadow-cyan-500/20">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={`blue-icon-${i}`}
                    className="w-7 h-7 rounded-full bg-white/20 border border-white/40 flex items-center justify-center shadow-inner"
                  >
                    <span className="text-xs">🪑</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Round Duration Selector Section ("الوقت لكل جولة") */}
            <div className="space-y-2.5 pt-1">
              <h4 className="text-center text-xs font-black text-slate-100">
                الوقت لكل جولة
              </h4>
              <div className="flex items-center justify-center gap-3">
                {[
                  { value: 5, label: '5 دقائق' },
                  { value: 15, label: '15 دقيقة' },
                  { value: 30, label: '30 دقيقة' },
                ].map((item) => {
                  const isSelected = selectedDuration === item.value;
                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setSelectedDuration(item.value)}
                      className={`px-5 py-2.5 rounded-full text-xs font-black transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/30 scale-105'
                          : 'bg-slate-800/90 text-slate-300 border-slate-700/80 hover:bg-slate-750'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Join Selection Section ("سأنضم إلى") */}
            <div className="space-y-3 pt-2">
              <h4 className="text-center text-xs font-black text-slate-100">
                سأنضم إلى
              </h4>
              <div className="flex items-center justify-center gap-5 dir-rtl">
                {/* 1. Neither (ولا واحد) */}
                <label
                  onClick={() => setJoinedTeam('none')}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      joinedTeam === 'none'
                        ? 'border-emerald-500 bg-emerald-500 text-slate-950'
                        : 'border-slate-500 bg-transparent group-hover:border-slate-400'
                    }`}
                  >
                    {joinedTeam === 'none' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <span className={`text-xs font-bold ${joinedTeam === 'none' ? 'text-white' : 'text-slate-400'}`}>
                    ولا واحد
                  </span>
                </label>

                {/* 2. Red Team (الفريق الأحمر) */}
                <label
                  onClick={() => setJoinedTeam('red')}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      joinedTeam === 'red'
                        ? 'border-rose-500 bg-rose-500 text-white'
                        : 'border-slate-500 bg-transparent group-hover:border-rose-400'
                    }`}
                  >
                    {joinedTeam === 'red' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <span className={`text-xs font-bold ${joinedTeam === 'red' ? 'text-rose-400' : 'text-slate-400'}`}>
                    الفريق الأحمر
                  </span>
                </label>

                {/* 3. Blue Team (الفريق الأزرق) */}
                <label
                  onClick={() => setJoinedTeam('blue')}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      joinedTeam === 'blue'
                        ? 'border-cyan-500 bg-cyan-500 text-slate-950'
                        : 'border-slate-500 bg-transparent group-hover:border-cyan-400'
                    }`}
                  >
                    {joinedTeam === 'blue' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <span className={`text-xs font-bold ${joinedTeam === 'blue' ? 'text-cyan-400' : 'text-slate-400'}`}>
                    الفريق الأزرق
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Footer OK Button (Matching Image 1 Green Button) */}
          <div className="p-4 bg-[#0B0F1A] border-t border-slate-800/80 shrink-0">
            <button
              onClick={handleConfirm}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/25 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>موافق</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
