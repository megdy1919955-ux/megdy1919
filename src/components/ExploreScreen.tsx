import React, { useState } from 'react';
import { Trophy, Crown, Flame, Sparkles, Medal } from 'lucide-react';
import { LEADERBOARD_DATA, MOCK_USERS } from '../data/mockData';
import { User } from '../types';

interface ExploreScreenProps {
  currentUser: User;
  onOpenRecharge: () => void;
}

export const ExploreScreen: React.FC<ExploreScreenProps> = ({ currentUser, onOpenRecharge }) => {
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const ranks = LEADERBOARD_DATA[period];

  const getRankMedal = (rank: number) => {
    switch (rank) {
      case 1:
        return <span className="text-2xl">🥇</span>;
      case 2:
        return <span className="text-2xl">🥈</span>;
      case 3:
        return <span className="text-2xl">🥉</span>;
      default:
        return <span className="font-mono font-bold text-slate-400 text-sm">{rank}</span>;
    }
  };

  return (
    <div className="space-y-4 pb-20 max-w-7xl mx-auto px-4 pt-3">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <h2 className="text-base font-extrabold text-white">لوحة شرف الأساطير 👑</h2>
        </div>
        {/* Period toggle */}
        <div className="bg-slate-900 border border-slate-800 p-1 rounded-2xl flex items-center gap-1">
          <button
            onClick={() => setPeriod('daily')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
              period === 'daily' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            يومي
          </button>
          <button
            onClick={() => setPeriod('weekly')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
              period === 'weekly' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            أسبوعي
          </button>
          <button
            onClick={() => setPeriod('monthly')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
              period === 'monthly' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            شهري
          </button>
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      {ranks.length >= 3 && (
        <div className="grid grid-cols-3 gap-2 pt-4 items-end max-w-lg mx-auto">
          {/* #2 Silver */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-3 flex flex-col items-center text-center shadow-lg relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-2xl">🥈</span>
            <img
              src={ranks[1].user.avatar}
              alt={ranks[1].user.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-slate-400 mt-2 mb-1"
            />
            <p className="text-xs font-bold text-white truncate max-w-full">{ranks[1].user.name}</p>
            <span className="text-[10px] text-amber-400 font-mono font-bold mt-1">
              {(ranks[1].points / 1000).toLocaleString()}K 🪙
            </span>
          </div>

          {/* #1 Gold */}
          <div className="bg-gradient-to-b from-amber-950/80 to-slate-900 border-2 border-amber-400 rounded-3xl p-4 flex flex-col items-center text-center shadow-2xl relative scale-105">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-3xl animate-bounce">👑</div>
            <img
              src={ranks[0].user.avatar}
              alt={ranks[0].user.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-amber-300 mt-2 mb-1 shadow-lg"
            />
            <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full mb-1">
              المركز الأول
            </span>
            <p className="text-xs font-black text-white truncate max-w-full">{ranks[0].user.name}</p>
            <span className="text-xs text-amber-300 font-mono font-black mt-1">
              {(ranks[0].points / 1000).toLocaleString()}K 🪙
            </span>
          </div>

          {/* #3 Bronze */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-3 flex flex-col items-center text-center shadow-lg relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-2xl">🥉</span>
            <img
              src={ranks[2].user.avatar}
              alt={ranks[2].user.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-amber-700 mt-2 mb-1"
            />
            <p className="text-xs font-bold text-white truncate max-w-full">{ranks[2].user.name}</p>
            <span className="text-[10px] text-amber-400 font-mono font-bold mt-1">
              {(ranks[2].points / 1000).toLocaleString()}K 🪙
            </span>
          </div>
        </div>
      )}

      {/* Full Leaderboard List */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4 space-y-2">
        <h3 className="text-xs font-bold text-slate-400 mb-2">قائمة الترتيب الكاملة</h3>
        {ranks.map((item) => (
          <div
            key={item.rank}
            className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-amber-500/40 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 flex items-center justify-center font-bold">
                {getRankMedal(item.rank)}
              </div>
              <img
                src={item.user.avatar}
                alt={item.user.name}
                className="w-10 h-10 rounded-full object-cover border border-amber-400/50"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-white">{item.user.name}</h4>
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.2 rounded font-mono">
                    VIP{item.user.vipLevel}
                  </span>
                </div>
                <p className="text-[11px] text-amber-400/80 font-medium">{item.title}</p>
              </div>
            </div>

            <div className="text-left">
              <span className="text-xs font-extrabold text-amber-400 font-mono block">
                {item.points.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-400">نقطة مجد</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
