import React, { useState, useEffect } from 'react';
import { Plus, Minus, Check } from 'lucide-react';
import { QUICK_ADD_STEPS, QUICK_SUB_STEPS } from './counterTypes';

export interface CounterQuickActionsProps {
  onQuickAdd: (delta: number) => void;
  onCustomSet: (value: number) => void;
  onTriggerToast?: (msg: string) => void;
  isOpen: boolean;
  seatId: number | null;
}

/**
 * أزرار التحكم السريع بإضافة وخصم النقاط + حقل تعيين قيمة مخصصة للعداد
 */
export const CounterQuickActions: React.FC<CounterQuickActionsProps> = ({
  onQuickAdd,
  onCustomSet,
  onTriggerToast,
  isOpen,
  seatId
}) => {
  const [customValInput, setCustomValInput] = useState('');

  useEffect(() => {
    setCustomValInput('');
  }, [isOpen, seatId]);

  const handleCustomSubmit = () => {
    const parsed = parseInt(customValInput, 10);
    if (isNaN(parsed) || parsed < 0) {
      onTriggerToast?.('يرجى إدخال رقم صحيح غير سالب 🔢');
      return;
    }
    onCustomSet(parsed);
    setCustomValInput('');
  };

  return (
    <>
      {/* Quick Increment Buttons (+10, +50, +100, +1000) */}
      <div className="space-y-2 mb-4">
        <span className="text-[11px] font-bold text-slate-300 block">إضافة سريعة:</span>
        <div className="grid grid-cols-4 gap-1.5">
          {QUICK_ADD_STEPS.map((step) => (
            <button
              key={`add-${step}`}
              type="button"
              onClick={() => onQuickAdd(step)}
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
          {QUICK_SUB_STEPS.map((step) => (
            <button
              key={`sub-${step}`}
              type="button"
              onClick={() => onQuickAdd(-step)}
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
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCustomSubmit();
            }}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
          <button
            type="button"
            onClick={handleCustomSubmit}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-3 py-2 rounded-xl text-xs flex items-center gap-1 cursor-pointer transition-colors shadow-sm active:scale-95"
          >
            <Check className="w-3.5 h-3.5" />
            <span>تعيين</span>
          </button>
        </div>
      </div>
    </>
  );
};
