import React from 'react';
import { ChevronLeft } from 'lucide-react';
import type { SubViewType } from '../BroadcasterCenterModal';
import type { HostServerStats } from '../../lib/serverRewardsService';
import { HeroSection } from './components/HeroSection';
import { SalarySection } from './components/SalarySection';
import { ToolCard } from './components/ToolCard';

export interface MainViewProps {
  userName: string;
  userAvatar: string;
  userId: string;
  hostStats: HostServerStats;
  onNavigate: (view: SubViewType) => void;
  showAlert: (msg: string) => void;
}

export const MainView: React.FC<MainViewProps> = ({
  userName,
  userAvatar,
  userId,
  hostStats,
  onNavigate,
  showAlert
}) => {
  return (
    <div className="w-full max-w-lg mx-auto p-4 space-y-3.5 pb-16 flex-1">

      {/* ========================================================= */}
      {/* 1. HERO BOX: Pure White with Dark-White Layering Card    */}
      {/* ========================================================= */}
      <HeroSection 
        userName={userName}
        userAvatar={userAvatar}
        userId={userId}
        hostStats={hostStats}
        onOpenEarningsDetails={() => onNavigate('earnings_details')}
      />

      {/* ========================================================= */}
      {/* 2. TWO ACTION CARDS: Best Achievement & Host Level        */}
      {/* ========================================================= */}
      <div className="grid grid-cols-2 gap-3">
        {/* Left Card: مستوى المضيف */}
        <div 
          onClick={() => showAlert(`مستوى المضيف الحالي هو ${hostStats.hostLevel}`)}
          className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-3.5 shadow-xs flex items-center justify-between text-slate-800 cursor-pointer hover:bg-slate-50 hover:border-slate-300 active:scale-95 transition-all group"
        >
          <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-[-2px] transition-all" />
          <div className="text-right">
            <span className="text-[11px] font-bold text-slate-500 block">مستوى المضيف</span>
            <span className="text-base font-black font-mono text-slate-900 mt-0.5 block tracking-wide">
              {hostStats.hostLevel}
            </span>
          </div>
          {/* 3D Medal 🥈 */}
          <div className="w-11 h-11 rounded-xl bg-slate-100 p-[1.5px] shadow-2xs border border-slate-200 flex items-center justify-center">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center text-xl">
              🥈
            </div>
          </div>
        </div>

        {/* Right Card: أفضل انجاز */}
        <div 
          onClick={() => showAlert(`أفضل إنجاز محقق هو ${hostStats.bestAchievementDiamonds > 0 ? (hostStats.bestAchievementDiamonds / 1000000).toFixed(1) + 'M' : '0'} ماسة!`)}
          className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-3.5 shadow-xs flex items-center justify-between text-slate-800 cursor-pointer hover:bg-slate-50 hover:border-slate-300 active:scale-95 transition-all group"
        >
          <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-[-2px] transition-all" />
          <div className="text-right">
            <span className="text-[11px] font-bold text-slate-500 block">أفضل انجاز</span>
            <span className="text-base font-black font-mono text-slate-900 mt-0.5 block flex items-center gap-1">
              {hostStats.bestAchievementDiamonds > 0 ? (hostStats.bestAchievementDiamonds / 1000000).toFixed(1) + 'M' : '0'} <span className="text-xs">💎</span>
            </span>
          </div>
          {/* 3D Trophy 🏆 */}
          <div className="w-11 h-11 rounded-xl bg-slate-100 p-[1.5px] shadow-2xs border border-slate-200 flex items-center justify-center">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center text-xl">
              🏆
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. MONTHLY SALARY & MILESTONE TRACK (الراتب الشهري)      */}
      {/* ========================================================= */}
      <SalarySection 
        hostStats={hostStats}
        onOpenEarningsDetails={() => onNavigate('earnings_details')}
      />

      {/* ========================================================= */}
      {/* 4. ULTRA-REALISTIC WHITE & DARK WHITE "أدواتي" PANEL     */}
      {/* ========================================================= */}
      <div className="relative rounded-[32px] bg-white border border-slate-200 p-4 sm:p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)] select-none">
        
        {/* Ambient Background Decorative Grid Marks */}
        <div className="absolute top-4 left-4 opacity-15 text-slate-300">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="2" y1="2" x2="10" y2="10" />
            <line x1="6" y1="2" x2="14" y2="10" />
            <line x1="10" y1="2" x2="18" y2="10" />
            <line x1="10" y1="2" x2="2" y2="10" />
            <line x1="14" y1="2" x2="6" y2="10" />
            <line x1="18" y1="2" x2="10" y2="10" />
          </svg>
        </div>

        {/* Header: "أدواتي" */}
        <div className="flex items-center justify-end mb-3.5 px-1">
          <h2 className="text-xl sm:text-2xl font-black font-serif tracking-wide text-slate-900">
            أدواتي
          </h2>
        </div>

        {/* 4x2 Grid of Cards */}
        <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">

          {/* ----------------- ROW 1 ----------------- */}

          {/* 1. وكالتي (Col 1 - Rightmost) */}
          <ToolCard 
            title="وكالتي"
            onClick={() => onNavigate('my_agency')}
            subIcon={
              <svg className="w-3.5 h-3.5 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="#F1F5F9" />
              </svg>
            }
            icon={
              <svg className="w-9 h-9 drop-shadow-xs" viewBox="0 0 48 48" fill="none">
                <defs>
                  <linearGradient id="monochromeGrad1" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#334155" />
                    <stop offset="50%" stopColor="#1E293B" />
                    <stop offset="100%" stopColor="#0F172A" />
                  </linearGradient>
                </defs>
                <line x1="24" y1="16" x2="14" y2="34" stroke="url(#monochromeGrad1)" strokeWidth="3" strokeLinecap="round" />
                <line x1="24" y1="16" x2="34" y2="34" stroke="url(#monochromeGrad1)" strokeWidth="3" strokeLinecap="round" />
                <line x1="14" y1="34" x2="34" y2="34" stroke="url(#monochromeGrad1)" strokeWidth="3" strokeLinecap="round" />
                <circle cx="24" cy="14" r="7" fill="#FFFFFF" stroke="url(#monochromeGrad1)" strokeWidth="2.5" />
                <circle cx="24" cy="12" r="2.5" fill="url(#monochromeGrad1)" />
                <path d="M20 17C20 15 22 14.5 24 14.5C26 14.5 28 15 28 17" stroke="url(#monochromeGrad1)" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="14" cy="34" r="7" fill="#FFFFFF" stroke="url(#monochromeGrad1)" strokeWidth="2.5" />
                <circle cx="14" cy="32" r="2.5" fill="url(#monochromeGrad1)" />
                <path d="M10 37C10 35 12 34.5 14 34.5C16 34.5 18 35 18 37" stroke="url(#monochromeGrad1)" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="34" cy="34" r="7" fill="#FFFFFF" stroke="url(#monochromeGrad1)" strokeWidth="2.5" />
                <circle cx="34" cy="32" r="2.5" fill="url(#monochromeGrad1)" />
                <path d="M30 37C30 35 32 34.5 34 34.5C36 34.5 38 35 38 37" stroke="url(#monochromeGrad1)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            }
          />

          {/* 2. سجلات البث المباشر (Col 2) */}
          <ToolCard 
            title="سجلات البث المباشر"
            onClick={() => onNavigate('records')}
            subIcon={
              <div className="flex items-center justify-center gap-1.5 opacity-85 text-slate-600">
                <span className="text-[9px] font-mono font-bold tracking-tighter">((•))</span>
                <div className="w-3 h-2.5 border border-slate-400 rounded-[2px] grid grid-cols-2 gap-[1px] p-[1px]">
                  <div className="bg-slate-400/40 rounded-[1px]" />
                  <div className="bg-slate-400/40 rounded-[1px]" />
                </div>
              </div>
            }
            icon={
              <svg className="w-9 h-9 drop-shadow-xs" viewBox="0 0 48 48" fill="none">
                <defs>
                  <linearGradient id="micDark" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#475569" />
                    <stop offset="50%" stopColor="#1E293B" />
                    <stop offset="100%" stopColor="#0F172A" />
                  </linearGradient>
                </defs>
                <rect x="18" y="8" width="12" height="18" rx="6" fill="url(#micDark)" />
                <line x1="20" y1="13" x2="28" y2="13" stroke="#FFF" strokeWidth="1.2" opacity="0.6" />
                <line x1="20" y1="17" x2="28" y2="17" stroke="#FFF" strokeWidth="1.2" opacity="0.6" />
                <line x1="20" y1="21" x2="28" y2="21" stroke="#FFF" strokeWidth="1.2" opacity="0.6" />
                <path d="M14 18C14 24.5 18.5 29 24 29C29.5 29 34 24.5 34 18" stroke="url(#micDark)" strokeWidth="3" strokeLinecap="round" />
                <line x1="24" y1="29" x2="24" y2="36" stroke="url(#micDark)" strokeWidth="3.5" strokeLinecap="round" />
                <ellipse cx="24" cy="38" rx="9" ry="3.5" fill="url(#micDark)" />
              </svg>
            }
          />

          {/* 3. محفظتي (Col 3) */}
          <ToolCard 
            title="محفظتي"
            onClick={() => onNavigate('wallet')}
            subIcon={
              <div className="flex items-center justify-center gap-1.5 opacity-85 text-slate-600">
                <span className="text-[9px]">🪙</span>
                <span className="text-[9px]">👛</span>
                <div className="w-3 h-3 border border-slate-400 rounded-[2px] bg-slate-100 flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-slate-600" />
                </div>
              </div>
            }
            icon={
              <svg className="w-11 h-9 drop-shadow-xs" viewBox="0 0 48 40" fill="none">
                <defs>
                  <linearGradient id="walletDark" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#475569" />
                    <stop offset="50%" stopColor="#334155" />
                    <stop offset="100%" stopColor="#1E293B" />
                  </linearGradient>
                  <linearGradient id="snapWhite" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FFF" />
                    <stop offset="100%" stopColor="#CBD5E1" />
                  </linearGradient>
                </defs>
                <rect x="5" y="8" width="38" height="26" rx="6" fill="url(#walletDark)" stroke="#0F172A" strokeWidth="1" />
                <rect x="7" y="10" width="34" height="22" rx="4.5" fill="none" stroke="#E2E8F0" strokeWidth="0.8" strokeDasharray="1.5,1.5" opacity="0.6" />
                <path d="M26 15H39C41.5 15 43 17 43 19.5V22.5C43 25 41.5 27 39 27H26V15Z" fill="#1E293B" stroke="#0F172A" strokeWidth="1" />
                <circle cx="37" cy="21" r="3.5" fill="url(#snapWhite)" stroke="#FFF" strokeWidth="0.8" />
                <circle cx="37" cy="21" r="1.2" fill="#0F172A" />
              </svg>
            }
          />

          {/* 4. تغيير الوكالة (Col 4 - Leftmost) */}
          <ToolCard 
            title="تغيير الوكالة"
            onClick={() => onNavigate('change_agency')}
            subIcon={
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 4H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z" fill="#F1F5F9" />
                <path d="M9 10h6M9 14h6" />
              </svg>
            }
            icon={
              <svg className="w-10 h-10 drop-shadow-xs" viewBox="0 0 48 48" fill="none">
                <defs>
                  <linearGradient id="scrollDark" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#F8FAFC" />
                    <stop offset="100%" stopColor="#E2E8F0" />
                  </linearGradient>
                  <linearGradient id="penDark" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#475569" />
                    <stop offset="100%" stopColor="#0F172A" />
                  </linearGradient>
                </defs>
                <path d="M12 10C10 10 9 11.5 9 13.5V33C9 35 10 36.5 12 36.5H30C32 36.5 33 35 33 33V13.5C33 11.5 32 10 30 10H12Z" fill="url(#scrollDark)" stroke="#64748B" strokeWidth="1.8" />
                <path d="M9 13C9 11 11 9 13 9H31C33 9 34 11 34 13" stroke="#64748B" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M9 33C9 35 11 37 13 37H33C35 37 36 35 36 33" stroke="#64748B" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="14" y1="16" x2="26" y2="16" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                <line x1="14" y1="20" x2="24" y2="20" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                <line x1="14" y1="24" x2="21" y2="24" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                <path d="M14 29Q17 28 19 30T23 29" stroke="#0F172A" strokeWidth="1.2" fill="none" />
                <g transform="rotate(35 28 22)">
                  <rect x="25" y="10" width="5" height="18" rx="2" fill="url(#penDark)" />
                  <path d="M25 28L27.5 34L30 28Z" fill="#F1F5F9" stroke="#0F172A" strokeWidth="0.5" />
                  <line x1="27.5" y1="30" x2="27.5" y2="33" stroke="#0F172A" strokeWidth="0.6" />
                </g>
              </svg>
            }
          />

          {/* ----------------- ROW 2 ----------------- */}

          {/* 5. داعمي (Col 1 - Rightmost) */}
          <ToolCard 
            title="داعمي"
            onClick={() => onNavigate('supporters')}
            subIcon={
              <div className="flex items-center justify-center gap-0.5 opacity-85 text-slate-600">
                <span className="text-[10px]">🤲</span>
                <span className="text-[9px]">🪙</span>
              </div>
            }
            icon={
              <svg className="w-9 h-9 drop-shadow-xs" viewBox="0 0 48 48" fill="none">
                <defs>
                  <linearGradient id="shieldDark" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#475569" />
                    <stop offset="50%" stopColor="#334155" />
                    <stop offset="100%" stopColor="#0F172A" />
                  </linearGradient>
                </defs>
                <path d="M24 6L37 11V22C37 31 29 39 24 42C19 39 11 31 11 22V11L24 6Z" fill="#F8FAFC" stroke="url(#shieldDark)" strokeWidth="2" />
                <polygon points="24,12 25.8,16.5 30.5,16.8 26.8,19.8 28,24.5 24,21.8 20,24.5 21.2,19.8 17.5,16.8 22.2,16.5" fill="url(#shieldDark)" opacity="0.6" />
                <path d="M12 30L20 23L27 27L36 17" stroke="url(#shieldDark)" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="12" cy="30" r="2.5" fill="url(#shieldDark)" />
                <circle cx="20" cy="23" r="2.5" fill="url(#shieldDark)" />
                <circle cx="27" cy="27" r="2.5" fill="url(#shieldDark)" />
                <circle cx="36" cy="17" r="3" fill="#FFF" stroke="#0F172A" strokeWidth="1" />
              </svg>
            }
          />

          {/* 6. Download the invoice / قسيمة الراتب (Col 2) */}
          <ToolCard 
            title={<>Download<br />the invoice</>}
            onClick={() => onNavigate('earnings_details')}
            className="font-serif"
            icon={
              <svg className="w-9 h-9 drop-shadow-xs" viewBox="0 0 48 48" fill="none">
                <defs>
                  <linearGradient id="docDark" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#475569" />
                    <stop offset="100%" stopColor="#0F172A" />
                  </linearGradient>
                </defs>
                <path d="M14 9H28L36 17V37C36 39 34.5 40 32.5 40H14C12 40 10.5 39 10.5 37V12C10.5 10 12 9 14 9Z" fill="#FFF" stroke="url(#docDark)" strokeWidth="2.2" />
                <path d="M28 9V17H36" stroke="url(#docDark)" strokeWidth="1.8" fill="#E2E8F0" />
                <line x1="23.5" y1="21" x2="23.5" y2="33" stroke="url(#docDark)" strokeWidth="2.8" strokeLinecap="round" />
                <polyline points="18,28.5 23.5,33.5 29,28.5" stroke="url(#docDark)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
          />

        </div>

        {/* Bottom Watermark Hash */}
        <div className="text-center pt-3 pb-0.5 text-[11px] font-mono text-slate-400 font-bold tracking-widest opacity-80">
          f9d80c1a5f
        </div>

      </div>

    </div>
  );
};

export default MainView;
