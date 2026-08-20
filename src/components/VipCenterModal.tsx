import React, { useState } from 'react';
import { X, Crown, Sparkles, Check, Shield, Flame, Gem } from 'lucide-react';
import { User } from '../types';

interface VipCenterModalProps {
  currentUser: User;
  onClose: () => void;
  onOpenRecharge: () => void;
}

export const VipCenterModal: React.FC<VipCenterModalProps> = ({
  currentUser,
  onClose,
  onOpenRecharge
}) => {
  const [selectedLevel, setSelectedLevel] = useState<number>(currentUser.vipLevel || 8);

  const vipLevels = [
    { level: 1, title: 'VIP برونزي', reqCoins: '1,000', badge: '🥉', color: 'from-amber-700 to-amber-900', perks: ['شارة VIP 1 في الشات', 'إطار أساسي للمايك', 'دخول مميز'] },
    { level: 3, title: 'VIP فضي', reqCoins: '10,000', badge: '🥈', color: 'from-slate-400 to-slate-600', perks: ['إطار فضي متحرك', 'تأثير دخول صوتي', 'رمز VIP مميز'] },
    { level: 5, title: 'VIP ذهبي', reqCoins: '50,000', badge: '🥇', color: 'from-amber-500 to-yellow-600', perks: ['تأثير دخول ذهبي مشع', 'أولوية اعتلاء المايك', 'إرسال هدايا خاصة'] },
    { level: 7, title: 'VIP ماسي', reqCoins: '200,000', badge: '💎', color: 'from-cyan-500 to-blue-700', perks: ['دخول ملكي بسيارة فارهة', 'إطار ماسي متوهج', 'حماية من الطرد أو الكتم'] },
    { level: 8, title: 'VIP أسطوري', reqCoins: '500,000', badge: '👑', color: 'from-purple-600 to-indigo-800', perks: ['شارة سوبر ليجند الذهبية', 'تأثير دخول التنين الأسطوري', 'صندوق حظ مخصص في الغرف', 'غرفة دردشة خاصة VIP'] },
    { level: 10, title: 'VIP إمبراطوري', reqCoins: '2,000,000', badge: '🌟', color: 'from-rose-600 via-purple-700 to-amber-500', perks: ['إمبراطور المنصة الأول', 'قصر عائم عند الدخول', 'تثبيت الغرفة في مقدمة الاستكشاف', 'رسائل برودكاست عامة'] }
  ];

  const currentLevelData = vipLevels.find((v) => v.level === selectedLevel) || vipLevels[4];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg p-5 text-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              👑
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">مركز الـ VIP والامتيازات الملكية</h3>
              <p className="text-[11px] text-purple-300">مستواك الحالي: VIP {currentUser.vipLevel}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* VIP Level Slider/Pills */}
        <div className="flex items-center gap-2 overflow-x-auto my-3 pb-1 no-scrollbar">
          {vipLevels.map((v) => (
            <button
              key={v.level}
              onClick={() => setSelectedLevel(v.level)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1 ${
                selectedLevel === v.level
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span>{v.badge}</span>
              <span>VIP {v.level}</span>
            </button>
          ))}
        </div>

        {/* Selected VIP Card */}
        <div className={`p-4 rounded-3xl bg-gradient-to-br ${currentLevelData.color} border border-white/20 shadow-xl mb-4`}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{currentLevelData.badge}</span>
                <h4 className="font-black text-base text-white">{currentLevelData.title}</h4>
              </div>
              <p className="text-xs text-white/80 mt-0.5">يتطلب شحن ودعم بقيمة {currentLevelData.reqCoins} كوينز</p>
            </div>
            <span className="bg-black/40 text-amber-300 text-xs font-mono font-bold px-2.5 py-1 rounded-full border border-white/20">
              VIP {currentLevelData.level}
            </span>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-white/20">
            <p className="text-xs font-bold text-white mb-1">الامتيازات والصلاحيات:</p>
            {currentLevelData.perks.map((perk, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-white/90">
                <Check className="w-3.5 h-3.5 text-amber-300 stroke-[3]" />
                <span>{perk}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            رصيدك: <span className="text-amber-400 font-bold font-mono">{currentUser.coins.toLocaleString()} 🪙</span>
          </div>
          <button
            onClick={() => {
              onClose();
              onOpenRecharge();
            }}
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black text-xs px-5 py-2.5 rounded-2xl shadow-lg shadow-amber-500/20 hover:scale-105 transition cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>شحن وترقية الـ VIP</span>
          </button>
        </div>
      </div>
    </div>
  );
};
