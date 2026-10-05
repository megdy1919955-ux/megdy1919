import React from 'react';

// Helper to parse VIP number
export const parseVipNumber = (vip?: string | number): number => {
  if (typeof vip === 'number') return vip;
  if (!vip) return 0;
  const match = vip.toString().match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
};

// 🌟 NAJM HOST & VIP BADGES COMPONENT (VIP, Heart 39, Crown 111)
// Note: Age & Gender are intentionally omitted here and reserved strictly for User Profile and User Card per design guidelines
export interface NajmHostVipBadgesProps {
  gender?: 'male' | 'female';
  age?: number;
  heartLevel?: number; // الداعم (Supporter Level)
  crownLevel?: number; // المدعوم (Charm Level)
  supporterLevel?: number;
  charmLevel?: number;
  vipLevel?: string | number;
  sharesLevel?: number | string; // الشاير إن وجدت
  isSuperAdmin?: boolean; // المطور الأساسي
  showVipBadge?: boolean;
  showSupporterBadge?: boolean;
  showCharmBadge?: boolean;
  supporterBadgeDesign?: string;
  charmBadgeDesign?: string;
  vipDesignStyle?: string;
  onToggleGender?: () => void;
}

export type HostYoHoBadgesProps = NajmHostVipBadgesProps;

export const NajmHostVipBadges: React.FC<NajmHostVipBadgesProps> = ({
  heartLevel,
  crownLevel,
  supporterLevel,
  charmLevel,
  vipLevel,
  sharesLevel,
  isSuperAdmin,
  showVipBadge = true,
  showSupporterBadge = true,
  showCharmBadge = true,
  supporterBadgeDesign = 'royal_dragon_flame',
  charmBadgeDesign = 'diamond_rose_5star',
  vipDesignStyle = 'royal_gold_3d'
}) => {
  // Resolve actual levels
  const realSupporter = supporterLevel !== undefined ? supporterLevel : heartLevel;
  const realCharm = charmLevel !== undefined ? charmLevel : crownLevel;
  const vipNum = parseVipNumber(vipLevel);
  const displayVip = typeof vipLevel === 'string' && vipLevel.startsWith('VIP') ? vipLevel : (vipNum > 0 ? `VIP${vipNum}` : (vipLevel ? String(vipLevel) : ''));

  // Design styles
  const supporterBg = supporterBadgeDesign === 'golden_flame'
    ? 'bg-gradient-to-r from-amber-500 to-yellow-600 border-amber-300 text-amber-950'
    : supporterBadgeDesign === 'ruby_fire'
    ? 'bg-gradient-to-r from-rose-700 to-red-800 border-rose-300 text-white'
    : 'bg-gradient-to-r from-[#DC2626] via-[#EA580C] to-[#D97706] border-red-300/60 text-white';

  const charmBg = charmBadgeDesign === 'sapphire_bloom'
    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 border-cyan-300 text-white'
    : charmBadgeDesign === 'crystal_star'
    ? 'bg-gradient-to-r from-emerald-600 to-teal-500 border-teal-300 text-white'
    : 'bg-gradient-to-r from-[#9333EA] via-[#C026D3] to-[#EC4899] border-pink-300/60 text-white';

  return (
    <div className="inline-flex items-center gap-1 flex-nowrap align-middle shrink-0 select-none py-0.5" dir="ltr">
      {/* 1. VIP Capsule Badge */}
      {showVipBadge && displayVip && (
        <div
          className={`inline-flex items-center gap-0.5 px-1.5 py-[1px] rounded-full shrink-0 border shadow-2xs ${
            vipDesignStyle === 'royal_gold_3d'
              ? 'bg-gradient-to-r from-[#78350F] via-[#B45309] to-[#D97706] text-amber-200 border-amber-300/50 shadow-[0_1px_4px_rgba(217,119,6,0.35)]'
              : 'bg-gradient-to-r from-purple-800 to-indigo-900 text-purple-200 border-purple-400/50'
          }`}
          title={`عضوية النخبة ${displayVip}`}
        >
          <span className="text-[8.5px] leading-none">👑</span>
          <span className="italic font-black text-[8.5px] tracking-tight font-sans leading-none">
            {displayVip}
          </span>
        </div>
      )}

      {/* 2. Supporter Capsule Badge (الداعم الحقيقي) */}
      {showSupporterBadge && typeof realSupporter === 'number' && realSupporter > 0 && (
        <div
          className={`inline-flex items-center gap-0.5 px-1.5 py-[1px] rounded-full text-white shadow-2xs shrink-0 border border-white/20 ${supporterBg}`}
          title={`مستوى الداعم: ${realSupporter} 🔥`}
        >
          <span className="text-[8.5px] leading-none">🔥</span>
          <span className="font-black italic text-[8.5px] leading-none text-white tracking-tight font-sans">
            {realSupporter}
          </span>
        </div>
      )}

      {/* 3. Charm / Broadcaster Level Capsule Badge (المدعوم الحقيقي) */}
      {showCharmBadge && typeof realCharm === 'number' && realCharm > 0 && (
        <div
          className={`inline-flex items-center gap-0.5 px-1.5 py-[1px] rounded-full text-white shadow-2xs shrink-0 border border-white/20 ${charmBg}`}
          title={`مستوى المدعوم/الكاريزما: ${realCharm} 💎`}
        >
          <span className="text-[8.5px] leading-none">💎</span>
          <span className="font-black italic text-[8.5px] leading-none text-white tracking-tight font-sans">
            {realCharm}
          </span>
        </div>
      )}

      {/* 4. Shares Badge (الشاير إن وجدت) */}
      {sharesLevel !== undefined && Number(sharesLevel) > 0 && (
        <div
          className="inline-flex items-center gap-0.5 px-1.5 py-[1px] rounded-full bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-2xs shrink-0 border border-emerald-300/40"
          title={`شارة المشاركة (الشاير): ${sharesLevel} 🔄`}
        >
          <span className="text-[8.5px] leading-none">🔄</span>
          <span className="font-black italic text-[8.5px] leading-none text-white tracking-tight font-sans">
            {sharesLevel}
          </span>
        </div>
      )}

      {/* 5. Super Admin / Developer Badge */}
      {isSuperAdmin && (
        <div
          className="inline-flex items-center gap-0.5 px-1.5 py-[1px] rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white shadow-2xs shrink-0 border border-amber-300/60"
          title="المطور الأساسي والسوبر أدمن 👑"
        >
          <span className="text-[8.5px] leading-none">👑</span>
        </div>
      )}
    </div>
  );
};

export const HostYoHoBadges = NajmHostVipBadges;
export default NajmHostVipBadges;
