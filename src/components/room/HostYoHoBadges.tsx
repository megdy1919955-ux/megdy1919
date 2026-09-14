import React from 'react';

// Helper to parse VIP number
export const parseVipNumber = (vip?: string | number): number => {
  if (typeof vip === 'number') return vip;
  if (!vip) return 0;
  const match = vip.toString().match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
};

// 🌟 YOHO HOST & VIP BADGES COMPONENT (VIP, Heart 39, Crown 111)
// Note: Age & Gender are intentionally omitted here and reserved strictly for User Profile and User Card per design guidelines
export interface HostYoHoBadgesProps {
  gender?: 'male' | 'female';
  age?: number;
  heartLevel?: number;
  crownLevel?: number;
  vipLevel?: string | number;
  onToggleGender?: () => void;
}

export const HostYoHoBadges: React.FC<HostYoHoBadgesProps> = ({
  heartLevel = 39,
  crownLevel = 111,
  vipLevel = 'VIP6',
}) => {
  const vipNum = parseVipNumber(vipLevel);
  const isVip8Plus = vipNum >= 8;
  const displayVip = typeof vipLevel === 'string' && vipLevel.startsWith('VIP') ? vipLevel : `VIP${vipNum || 6}`;

  return (
    <div className="inline-flex items-center gap-1 flex-nowrap align-middle shrink-0 select-none py-0.5" dir="ltr">
      {/* 1. VIP Capsule Badge (Ruby Red & Gold for VIP 8+, Royal Gold for < 8) */}
      <div
        className={`inline-flex items-center px-1.5 py-[1.5px] rounded-full shrink-0 border shadow-xs ${
          isVip8Plus
            ? 'bg-gradient-to-r from-[#991B1B] via-[#DC2626] to-[#7F1D1D] border-[#FCA5A5] ring-1 ring-red-400/50 shadow-[0_1px_4px_rgba(220,38,38,0.5)]'
            : 'bg-gradient-to-b from-[#2D261B] via-[#1A160F] to-[#0D0B08] border-[#D4AF37] ring-1 ring-[#FFE599]/40 shadow-[0_1px_4px_rgba(212,175,55,0.4)]'
        }`}
        title={`عضوية النخبة ${displayVip}`}
      >
        <span
          className={`italic font-black text-[9px] tracking-tight font-sans ${
            isVip8Plus ? 'text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]' : 'text-[#F7E7BE] drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]'
          }`}
        >
          {displayVip}
        </span>
      </div>

      {/* 2. Heart / Romance Capsule Badge (39 + Heart - Red to Coral gradient) */}
      {heartLevel > 0 && (
        <div
          className="inline-flex items-center gap-0.5 px-1.5 py-[2px] rounded-full bg-gradient-to-r from-[#FF3B30] via-[#FF453A] to-[#FF2D55] text-white shadow-[0_1px_3px_rgba(255,59,48,0.4)] shrink-0 border border-white/15"
          title={`مستوى الدعم: ${heartLevel} ❤️`}
        >
          <span className="font-black italic text-[9px] leading-none text-white tracking-tight drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)] font-sans">
            {heartLevel}
          </span>
          <svg
            className="w-2.5 h-2.5 text-white fill-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.2)] ml-0.5 shrink-0"
            viewBox="0 0 24 24"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      )}

      {/* 3. Crown / Glory Level Capsule Badge (111 + Crown - Magenta to Orange gradient) */}
      {crownLevel > 0 && (
        <div
          className="inline-flex items-center gap-0.5 px-1.5 py-[2px] rounded-full bg-gradient-to-r from-[#FF007A] via-[#FF1493] to-[#FF8C00] text-white shadow-[0_1px_3px_rgba(255,0,122,0.4)] shrink-0 border border-white/15"
          title={`مستوى الكراون: ${crownLevel} 👑`}
        >
          <span className="font-black italic text-[9px] leading-none text-white tracking-tight drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)] font-sans">
            {crownLevel}
          </span>
          <span className="text-[9.5px] leading-none drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)] ml-0.5 filter">
            👑
          </span>
        </div>
      )}
    </div>
  );
};
