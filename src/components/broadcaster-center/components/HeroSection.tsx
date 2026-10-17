import React from 'react';
import type { HostServerStats } from '../../../lib/serverRewardsService';

export interface HeroSectionProps {
  userName: string;
  userAvatar: string;
  userId: string;
  hostStats: HostServerStats;
  onOpenEarningsDetails: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  userName,
  userAvatar,
  userId,
  hostStats,
  onOpenEarningsDetails
}) => {
  return (
    <div className="relative overflow-hidden rounded-[32px] bg-white border border-slate-200 p-4 sm:p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04),inset_0_2px_4px_rgba(255,255,255,1)]">
      {/* Background subtle geometric corner marks */}
      <div className="absolute top-3 left-3 opacity-20 text-slate-400">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
          <line x1="2" y1="2" x2="10" y2="10" />
          <line x1="6" y1="2" x2="14" y2="10" />
          <line x1="10" y1="2" x2="18" y2="10" />
        </svg>
      </div>

      {/* Top Row: User Avatar & Info (Right) + Earnings Details Button (Left) */}
      <div className="flex items-center justify-between relative z-10">
        {/* User Profile Info */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-13 h-13 rounded-full p-[2px] bg-gradient-to-tr from-slate-700 via-slate-400 to-slate-200 shadow-sm">
              <img 
                src={userAvatar} 
                alt={userName} 
                className="w-full h-full rounded-full object-cover bg-slate-900 border border-white"
              />
            </div>
            {/* Glowing border ring */}
            <div className="absolute -inset-0.5 rounded-full border border-slate-300 pointer-events-none" />
          </div>

          <div className="text-right">
            <div className="text-base font-black text-slate-900 leading-tight flex items-center gap-1.5">
              <span>{userName}</span>
              <span className="text-[10px] bg-purple-100 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-full font-black">
                🎙️ مضيف
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-purple-50 border border-purple-200 text-purple-800 text-[11px] font-mono font-black shadow-2xs">
                HOST-101-01
              </span>
              <span className="text-xs font-bold font-mono text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                ID: {userId}
              </span>
            </div>
          </div>
        </div>

        {/* Earnings Details Pill Button */}
        <button 
          onClick={onOpenEarningsDetails}
          className="bg-slate-100 hover:bg-slate-200 active:scale-95 transition-all px-3.5 py-1.5 rounded-full text-xs font-black text-slate-800 border border-slate-300 shadow-xs cursor-pointer flex items-center gap-1"
        >
          <span>تفاصيل الأرباح</span>
        </button>
      </div>

      {/* Symmetrical Dual Metric Cards */}
      <div className="grid grid-cols-2 gap-3 mt-4 text-center relative z-10">
        {/* Right Box: أرباح اليوم ($) */}
        <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3.5 shadow-2xs hover:bg-slate-100/80 transition-all">
          <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 tracking-tight">
            0.00
          </div>
          <div className="text-xs font-bold text-slate-600 mt-1">
            أرباح اليوم ($)
          </div>
        </div>

        {/* Left Box: أرباح الشهر الحالي ($) */}
        <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3.5 shadow-2xs hover:bg-slate-100/80 transition-all">
          <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 tracking-tight">
            {hostStats.earningsUsd.toFixed(2)}
          </div>
          <div className="text-xs font-bold text-slate-600 mt-1">
            أرباح الشهر الحالي ($)
          </div>
        </div>
      </div>
    </div>
  );
};
