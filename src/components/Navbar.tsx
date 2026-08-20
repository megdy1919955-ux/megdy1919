import React from 'react';
import { Sparkles, Plus, Wallet, Gem } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  currentUser: User;
  onOpenRecharge: () => void;
  onOpenVip: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentUser, onOpenRecharge, onOpenVip }) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-200 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-black text-xl">
            👑
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg text-white tracking-wide">سوبر ليجند</span>
              <span className="text-[10px] bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 font-black px-1.5 py-0.5 rounded-full uppercase">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-400">منصة الغرف الصوتية والألعاب</p>
          </div>
        </div>

        {/* Currency & VIP Badges */}
        <div className="flex items-center gap-2">
          {/* VIP Level Badge */}
          <button
            onClick={onOpenVip}
            className="flex items-center gap-1 bg-gradient-to-r from-purple-900/70 to-indigo-900/70 hover:from-purple-800 hover:to-indigo-800 border border-purple-500/30 px-2.5 py-1.5 rounded-full transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-300 animate-pulse" />
            <span className="text-xs font-bold text-purple-200">VIP {currentUser.vipLevel}</span>
          </button>

          {/* Coins Balance */}
          <div
            onClick={onOpenRecharge}
            className="flex items-center gap-2 bg-slate-800/80 hover:bg-slate-800 border border-amber-500/30 px-3 py-1.5 rounded-full cursor-pointer transition group"
          >
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center text-[10px] text-slate-950 font-bold">
                🪙
              </div>
              <span className="text-xs font-extrabold text-amber-400 font-mono">
                {currentUser.coins.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-1 border-r border-slate-700 pr-2">
              <Gem className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-xs font-bold text-cyan-300 font-mono">
                {currentUser.diamonds.toLocaleString()}
              </span>
            </div>
            <div className="w-5 h-5 rounded-full bg-amber-500 group-hover:scale-110 flex items-center justify-center text-slate-950 transition">
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
