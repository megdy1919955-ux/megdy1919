import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Plus, Minus, Hash, Check, X, Sparkles } from 'lucide-react';

interface DigitalCounterControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  seatId: number | null;
  seatUserName?: string;
  currentValue: number;
  onUpdateCounter: (seatId: number, newValue: number) => void;
  onResetCounter: (seatId: number) => void;
  onTriggerToast?: (msg: string) => void;
  isCounterRunning?: boolean;
  isCounterPaused?: boolean;
  onToggleCounterRunning?: () => void;
}

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
  onToggleCounterRunning,
}) => {
  const [customValInput, setCustomValInput] = useState('');

  useEffect(() => {
    setCustomValInput('');
  }, [isOpen, seatId]);

  if (!isOpen || seatId === null) return null;

  const handleQuickAdd = (delta: number) => {
    const nextVal = Math.max(0, currentValue + delta);
    onUpdateCounter(seatId, nextVal);
    onTriggerToast?.(`تم تحديث العداد إلى: ${nextVal.toLocaleString('en-US')} 🔢`);
  };

  const handleCustomSet = () => {
    const parsed = parseInt(customValInput, 10);
    if (isNaN(parsed) || parsed < 0) {
      onTriggerToast?.('يرجى إدخال رقم صحيح غير سالب 🔢');
      return;
    }
    onUpdateCounter(seatId, parsed);
    onTriggerToast?.(`تم تعيين العداد إلى: ${parsed.toLocaleString('en-US')} ✅`);
    setCustomValInput('');
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
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 pointer-events-auto cursor-default select-none dir-rtl"
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
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Current Counter Digital LED Box */}
          <div className="my-4 p-4 rounded-2xl bg-[#090D16] border border-amber-500/30 flex flex-col items-center justify-center gap-1 shadow-inner relative">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">القيمة الحالية بالعداد</span>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span className="text-3xl font-black font-mono text-amber-300 tracking-wider drop-shadow-[0_0_12px_rgba(245,158,11,0.5)]">
                {currentValue.toLocaleString('en-US')}
              </span>
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            </div>
          </div>

          {/* Quick Increment Buttons (+10, +50, +100, +1000) */}
          <div className="space-y-2 mb-4">
            <span className="text-[11px] font-bold text-slate-300 block">إضافة سريعة:</span>
            <div className="grid grid-cols-4 gap-1.5">
              {[10, 50, 100, 1000].map((step) => (
                <button
                  key={`add-${step}`}
                  onClick={() => handleQuickAdd(step)}
                  className="py-2 px-1 rounded-xl bg-amber-500/15 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-black font-mono text-xs cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-0.5"
                >
                  <Plus className="w-3 h-3 text-amber-400" />
                  <span>{step}</span>
                </button>
              ))}
            </div>

            {/* Quick Decrement Buttons (-10, -50, -100) */}
            <span className="text-[11px] font-bold text-slate-300 block pt-1">خصم سريع:</span>
            <div className="grid grid-cols-3 gap-1.5">
              {[10, 50, 100].map((step) => (
                <button
                  key={`sub-${step}`}
                  onClick={() => handleQuickAdd(-step)}
                  className="py-1.5 px-1 rounded-xl bg-rose-500/15 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-black font-mono text-xs cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-0.5"
                >
                  <Minus className="w-3 h-3 text-rose-400" />
                  <span>{step}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Set Value Input */}
          <div className="space-y-2 mb-4">
            <span className="text-[11px] font-bold text-slate-300 block">تعيين قيمة مخصصة:</span>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="أدخل القيمة المطلوبة..."
                value={customValInput}
                onChange={(e) => setCustomValInput(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
              <button
                onClick={handleCustomSet}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-3 py-2 rounded-xl text-xs flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
              >
                <Check className="w-3.5 h-3.5" />
                <span>تعيين</span>
              </button>
            </div>
          </div>

          {/* Counter Status & Pause Toggle + Reset Counter Button */}
          <div className="pt-2 border-t border-white/10 space-y-2">
            {onToggleCounterRunning && (
              <button
                onClick={onToggleCounterRunning}
                className={`w-full py-2 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  isCounterRunning && !isCounterPaused
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                    : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-black shadow-md'
                }`}
              >
                <span>{isCounterRunning && !isCounterPaused ? 'إيقاف العداد ⏸️' : 'تشغيل العداد ▶️'}</span>
              </button>
            )}

            <button
              onClick={handleReset}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-98"
            >
              <RotateCcw className="w-4 h-4" />
              <span>تصفير العداد إلى (0) 🔄</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
