import React from 'react';
import { RotateCcw } from 'lucide-react';

export interface CounterFooterControlsProps {
  isCounterRunning?: boolean;
  isCounterPaused?: boolean;
  onToggleCounterRunning?: () => void;
  onReset: () => void;
}

/**
 * أزرار التحكم السفلية: إيقاف/تشغيل العداد + تصفير العداد إلى 0
 */
export const CounterFooterControls: React.FC<CounterFooterControlsProps> = ({
  isCounterRunning = true,
  isCounterPaused = false,
  onToggleCounterRunning,
  onReset
}) => {
  return (
    <div className="pt-2 border-t border-white/10 space-y-2">
      {onToggleCounterRunning && (
        <button
          type="button"
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
        type="button"
        onClick={onReset}
        className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-98"
      >
        <RotateCcw className="w-4 h-4" />
        <span>تصفير العداد إلى (0) 🔄</span>
      </button>
    </div>
  );
};
