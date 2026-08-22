import React, { useState } from 'react';
import { X, Crown, ShieldCheck, Zap } from 'lucide-react';
import { VIP_TIERS } from '../data/superLegend';
import { UserProfileData } from '../types';

interface VipCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfileData;
  onUpgrade?: (newVipLevel: string) => void;
}

export const VipCenterModal: React.FC<VipCenterModalProps> = ({ isOpen, onClose, profile, onUpgrade }) => {
  const currentVip = profile.vipLevel || profile.vipTier || 'VIP 8';
  const [selectedVip, setSelectedVip] = useState(currentVip);

  if (!isOpen) return null;

  const activeTier = VIP_TIERS.find(t => `VIP ${t.level}` === selectedVip) || VIP_TIERS[7];

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200" dir="rtl">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Crown className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white tracking-wide">مركز VIP - كبار الشخصيات</h2>
              <p className="text-[10px] text-slate-400">استمتع بامتيازات حصرية وتخفيضات الهدايا</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* User Current Badge Banner */}
          <div className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 rounded-2xl p-4 text-slate-950 flex items-center justify-between shadow-xl border border-yellow-300">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-950 text-amber-400 flex items-center justify-center text-xl font-black border border-amber-400/50 shadow-inner">
                👑
              </div>
              <div>
                <span className="text-[10px] font-bold bg-slate-950/20 text-slate-950 px-2 py-0.5 rounded-md">مستواك الحالي</span>
                <h3 className="text-base font-black tracking-wide mt-0.5">{currentVip}</h3>
                <p className="text-[11px] font-semibold opacity-90">نسبة التخفيض: 25% على الهدايا والخدمات</p>
              </div>
            </div>
            <span className="text-xs font-black bg-slate-950 text-amber-400 px-3 py-1.5 rounded-xl shadow-md">
              عضوية فاخرة
            </span>
          </div>

          {/* VIP Levels Horizontal Selector */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-2">اختر مستوى VIP للاطلاع على الامتيازات:</label>
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {VIP_TIERS.map((tier) => {
                const isCurrent = `VIP ${tier.level}` === currentVip;
                const isSelected = `VIP ${tier.level}` === selectedVip;
                return (
                  <button
                    key={tier.level}
                    onClick={() => setSelectedVip(`VIP ${tier.level}`)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-1.5 cursor-pointer ${
                      isSelected 
                        ? 'bg-amber-500 text-slate-950 border-amber-300 font-black shadow-lg scale-105' 
                        : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span>👑 VIP {tier.level}</span>
                    {isCurrent && <span className="text-[9px] bg-slate-950 text-amber-400 px-1.5 py-0.2 rounded font-extrabold">حالي</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected VIP Details Card */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h4 className="text-sm font-black text-amber-300">{activeTier.title}</h4>
                <p className="text-[10px] text-slate-400">النقاط المطلوبة: {activeTier.requiredCoins.toLocaleString()} عملة</p>
              </div>
              <span className="text-xs font-bold bg-amber-500/10 text-amber-400 px-3 py-1 rounded-lg border border-amber-500/20">
                خصم {activeTier.discount}
              </span>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 block">مميزات عضوية {activeTier.title}:</span>
              <div className="space-y-2">
                {activeTier.privileges.map((priv, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-slate-900/80 border border-slate-800/80 p-2.5 rounded-xl text-xs text-slate-200">
                    <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{priv}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <span className="text-xs text-slate-400">تزداد مميزاتك تلقائياً مع كل عملية شحن</span>
          <button
            onClick={() => {
              if (onUpgrade) onUpgrade(`VIP ${activeTier.level}`);
              onClose();
            }}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>تفعيل {activeTier.title}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
