import React from 'react';
import { ChevronLeft } from 'lucide-react';
import type { HostServerStats } from '../../../lib/serverRewardsService';

export interface SalarySectionProps {
  hostStats: HostServerStats;
  onOpenEarningsDetails: () => void;
}

export const SalarySection: React.FC<SalarySectionProps> = ({
  hostStats,
  onOpenEarningsDetails
}) => {
  return (
    <div className="relative rounded-[32px] bg-white border border-slate-200 p-4 sm:p-5 pt-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)] space-y-4">
      {/* Top Left Floating Timer Badge */}
      <div className="absolute -top-3 left-4 bg-slate-900 text-white px-3.5 py-0.5 rounded-full text-[10px] font-black font-mono shadow-sm border border-slate-700 flex items-center gap-1">
        <span>⏱</span>
        <span>3 أيام 3 ساعات</span>
      </div>

      {/* Header: Title and Amount */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm sm:text-base font-black text-slate-900 font-serif">
          الراتب الشهري (المحول من الألماس)
        </h3>
        <div 
          onClick={onOpenEarningsDetails}
          className="flex items-center gap-1 text-emerald-600 font-black text-lg sm:text-xl font-mono cursor-pointer hover:opacity-80 transition-opacity"
        >
          <ChevronLeft className="w-4 h-4 text-slate-500" />
          <span>$ {hostStats.earningsUsd.toFixed(2)}</span>
        </div>
      </div>

      {/* Horizontal Sleek Glass Layout for Stats (الألماسات -> الأيام -> الساعات) */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-2.5 shadow-2xs">
        <div className="grid grid-cols-3 divide-x divide-x-reverse divide-slate-200 text-center items-center">
          {/* 1. الألماسات */}
          <div className="px-2 space-y-1">
            <div className="flex items-center justify-center gap-1">
              <span className="text-xs">💎</span>
              <span className="font-mono font-black text-base text-slate-900">{hostStats.diamondsEarned.toLocaleString('en-US')}</span>
            </div>
            <div className="text-[11px] font-bold text-slate-600">
              الألماسات
            </div>
          </div>

          {/* 2. الأيام المؤهلة */}
          <div className="px-2 space-y-1">
            <div className="flex items-center justify-center gap-1 font-mono font-black text-base text-slate-900">
              <span className="text-xs">📅</span>
              <span className="text-slate-900">{hostStats.qualifiedDays}</span>
              <span className="text-xs text-slate-500">/{hostStats.qualifiedDaysTarget} أيام</span>
            </div>
            <div className="text-[11px] font-bold text-slate-600">
              الأيام المؤهلة
            </div>
          </div>

          {/* 3. الساعات (المدة المؤهلة) */}
          <div className="px-2 space-y-1">
            <div className="flex items-center justify-center gap-1 font-mono font-black text-base text-slate-900">
              <span className="text-xs">⏳</span>
              <span className="text-slate-900">{hostStats.streamHours}</span>
              <span className="text-xs text-slate-500">/{hostStats.streamHoursTarget} س</span>
            </div>
            <div className="text-[11px] font-bold text-slate-600">
              الساعات
            </div>
          </div>
        </div>
      </div>

      {/* 5 Sculpted Treasure Chests on Track */}
      <div className="pt-2">
        {/* Chest Labels */}
        <div className="flex items-center justify-between text-[11px] font-black font-mono text-slate-700 px-2 pb-1">
          <span>$1</span>
          <span>+$1</span>
          <span>+$1</span>
          <span>+$1</span>
          <span>+$+</span>
        </div>

        {/* Track with 5 Chests */}
        <div className="relative flex items-center justify-between px-2 py-1">
          {/* Horizontal track line */}
          <div className="absolute top-1/2 left-3 right-3 h-2 bg-slate-200 -translate-y-1/2 rounded-full" />
          
          {[0, 1, 2, 3, 4].map((idx) => (
            <div key={idx} className="relative z-10 flex flex-col items-center">
              <div className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-white p-[1.5px] shadow-xs hover:scale-110 transition-all cursor-pointer border border-slate-300">
                <div className="w-full h-full bg-white rounded-[9px] flex items-center justify-center text-sm">
                  📦
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Capsule: المستوى التالي */}
      <div className="bg-slate-50 text-slate-900 rounded-2xl p-3 border border-slate-200 shadow-2xs space-y-2">
        <div className="flex items-center justify-between text-xs font-black">
          <span className="text-slate-800 font-mono">المستوى التالي {hostStats.nextLevelTargetUsd}$</span>
        </div>

        {/* Gleaming Progress Bar */}
        <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden p-[1px] border border-slate-300">
          <div 
            className="h-full bg-slate-800 rounded-full shadow-2xs transition-all duration-500" 
            style={{ width: `${Math.min(100, Math.max(0, Math.round((hostStats.diamondsEarned / Math.max(1, hostStats.diamondsEarned + hostStats.neededDiamondsForNextLevel)) * 100)))}%` }}
          />
        </div>

        {/* Progress Labels */}
        <div className="flex items-center justify-between text-[11px] font-bold font-mono text-slate-500">
          <span className="text-slate-500">{(hostStats.diamondsEarned + hostStats.neededDiamondsForNextLevel).toLocaleString('en-US')}</span>
          <span className="text-slate-900 font-black">لا يزال يلزم {hostStats.neededDiamondsForNextLevel.toLocaleString('en-US')} 💎</span>
        </div>
      </div>
    </div>
  );
};
