import React from 'react';
import { Sparkles } from 'lucide-react';

export interface CounterLedDisplayProps {
  currentValue: number;
}

/**
 * شاشة العرض الرقمية LED للعداد للمقعد
 */
export const CounterLedDisplay: React.FC<CounterLedDisplayProps> = ({ currentValue }) => {
  return (
    <div className="my-4 p-4 rounded-2xl bg-[#090D16] border border-amber-500/30 flex flex-col items-center justify-center gap-1 shadow-inner relative">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        القيمة الحالية بالعداد
      </span>
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
        <span className="text-3xl font-black font-mono text-amber-300 tracking-wider drop-shadow-[0_0_12px_rgba(245,158,11,0.5)]">
          {currentValue.toLocaleString('en-US')}
        </span>
        <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
      </div>
    </div>
  );
};
