import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Hash, X } from 'lucide-react';
import { DigitalCounterControlModalProps } from './counterTypes';
import { CounterLedDisplay } from './CounterLedDisplay';
import { CounterQuickActions } from './CounterQuickActions';
import { CounterFooterControls } from './CounterFooterControls';

export const DigitalCounterControlModal: React.FC<DigitalCounterControlModalProps> = ({
  isOpen,
  onClose,
  seatId,
  seatUserName = 'مستخدم المقعد',
  currentValue,
  onUpdateCounter,
  onResetCounter,
  onTriggerToast,
  isCounterRunning = true,
  isCounterPaused = false,
  onToggleCounterRunning
}) => {
  if (!isOpen || seatId === null) return null;

  const handleQuickAdd = (delta: number) => {
    const nextVal = Math.max(0, currentValue + delta);
    onUpdateCounter(seatId, nextVal);
    onTriggerToast?.(`تم تحديث العداد إلى: ${nextVal.toLocaleString('en-US')} 🔢`);
  };

  const handleCustomSet = (value: number) => {
    onUpdateCounter(seatId, value);
    onTriggerToast?.(`تم تعيين العداد إلى: ${value.toLocaleString('en-US')} ✅`);
    onClose();
  };

  const handleReset = () => {
    onResetCounter(seatId);
    onTriggerToast?.(`تم تصفير العداد للمقعد رقم ${seatId} بنجاح 🔄`);
    onClose();
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 bg-transparent flex items-center justify-center p-4 pointer-events-auto cursor-default select-none dir-rtl"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 10 }}
          transition={{ type: 'spring', stiffness: 350, damping: 26 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-sm bg-[#121827] border border-amber-500/40 rounded-3xl p-5 shadow-2xl text-white relative overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Hash className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-black text-sm text-amber-300">التحكم بالعداد الرقمي (Mic #{seatId})</h3>
                <p className="text-[11px] text-slate-400 font-medium">{seatUserName}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Current Counter Digital LED Box */}
          <CounterLedDisplay currentValue={currentValue} />

          {/* Quick Actions and Custom Input */}
          <CounterQuickActions
            onQuickAdd={handleQuickAdd}
            onCustomSet={handleCustomSet}
            onTriggerToast={onTriggerToast}
            isOpen={isOpen}
            seatId={seatId}
          />

          {/* Footer Controls: Status Toggle & Reset */}
          <CounterFooterControls
            isCounterRunning={isCounterRunning}
            isCounterPaused={isCounterPaused}
            onToggleCounterRunning={onToggleCounterRunning}
            onReset={handleReset}
          />
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DigitalCounterControlModal;
