import React from 'react';
import {
  Crown,
  Sparkles,
  Wallet,
  Gem,
  Award,
  ShieldCheck,
  ChevronLeft,
  Settings,
  Flame,
  Star,
  Users,
  Edit3
} from 'lucide-react';
import { User } from '../types';

interface ProfileScreenProps {
  currentUser: User;
  onOpenRecharge: () => void;
  onOpenVip: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  currentUser,
  onOpenRecharge,
  onOpenVip
}) => {
  return (
    <div className="space-y-4 pb-20 max-w-7xl mx-auto px-4 pt-3">
      {/* Profile Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/30 p-5 shadow-2xl">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-amber-400 shadow-lg"
              />
              <span className="absolute -bottom-1 -right-1 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 text-[10px] font-black px-1.5 rounded-full shadow">
                VIP {currentUser.vipLevel}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-white">{currentUser.name}</h2>
                <span>{currentUser.countryFlag}</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">ID: 88997766 • {currentUser.country}</p>
              <div className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full mt-1.5 border border-amber-500/30">
                <Crown className="w-3 h-3 text-amber-400" />
                {currentUser.badge}
              </div>
            </div>
          </div>

          <button className="p-2 rounded-2xl bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white cursor-pointer transition">
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* Bio */}
        <p className="text-xs text-slate-300 mt-3.5 leading-relaxed bg-slate-950/40 p-2.5 rounded-2xl border border-slate-800/60">
          {currentUser.bio}
        </p>

        {/* Followers & Following */}
        <div className="flex items-center gap-6 mt-4 pt-3 border-t border-slate-800/80 text-xs">
          <div>
            <span className="font-extrabold text-white font-mono text-sm block">
              {currentUser.followersCount.toLocaleString()}
            </span>
            <span className="text-slate-400 text-[11px]">المتابعون</span>
          </div>
          <div>
            <span className="font-extrabold text-white font-mono text-sm block">
              {currentUser.followingCount.toLocaleString()}
            </span>
            <span className="text-slate-400 text-[11px]">المتابَعون</span>
          </div>
          <div>
            <span className="font-extrabold text-amber-400 font-mono text-sm block">
              مستوى {currentUser.legendLevel}
            </span>
            <span className="text-slate-400 text-[11px]">رتبة الأسطورة</span>
          </div>
        </div>
      </div>

      {/* Wallet Balance Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-amber-400" />
            <h3 className="font-extrabold text-sm text-white">المحفظة والرصيد</h3>
          </div>
          <button
            onClick={onOpenRecharge}
            className="text-xs font-black text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-300 px-3.5 py-1.5 rounded-xl shadow-md shadow-amber-500/20 hover:scale-105 transition cursor-pointer"
          >
            شحن فوري +
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Gold Coins */}
          <div className="bg-slate-950/80 border border-amber-500/30 rounded-2xl p-3">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>الكوينز الذهبية</span>
              <span className="text-base">🪙</span>
            </div>
            <span className="text-lg font-extrabold text-amber-400 font-mono">
              {currentUser.coins.toLocaleString()}
            </span>
          </div>

          {/* Diamonds */}
          <div className="bg-slate-950/80 border border-cyan-500/30 rounded-2xl p-3">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>الألماس الملكي</span>
              <Gem className="w-4 h-4 text-cyan-400" />
            </div>
            <span className="text-lg font-extrabold text-cyan-300 font-mono">
              {currentUser.diamonds.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Levels & Privileges Menu */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-3 space-y-2">
        <div
          onClick={onOpenVip}
          className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-purple-950/60 to-slate-950/80 border border-purple-500/30 hover:border-purple-500/60 cursor-pointer transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600/30 flex items-center justify-center text-purple-300 text-xl border border-purple-500/40">
              👑
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">مركز الـ VIP والامتيازات</h4>
              <p className="text-[11px] text-purple-300">أنت في المستوى VIP {currentUser.vipLevel} • اضغط للاطلاع على الهدايا والترقيات</p>
            </div>
          </div>
          <ChevronLeft className="w-4 h-4 text-slate-400" />
        </div>

        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-amber-500/40 cursor-pointer transition">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-400 text-xl border border-amber-500/30">
              🛡️
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">مستوى الثراء والجاذبية</h4>
              <p className="text-[11px] text-slate-400">ثراء: {currentUser.wealthLevel} | جاذبية: {currentUser.charmLevel}</p>
            </div>
          </div>
          <ChevronLeft className="w-4 h-4 text-slate-400" />
        </div>

        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-amber-500/40 cursor-pointer transition">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xl border border-emerald-500/30">
              🎨
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">إطارات وتأثيرات الدخول</h4>
              <p className="text-[11px] text-slate-400">تخصيص ثيم الأسطورة والإطار الذهبي</p>
            </div>
          </div>
          <ChevronLeft className="w-4 h-4 text-slate-400" />
        </div>
      </div>
    </div>
  );
};
