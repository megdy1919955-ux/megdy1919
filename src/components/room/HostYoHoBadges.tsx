import React from 'react';

// 🌟 YOHO HOST SPECIAL BADGES COMPONENT (EXACT MATCH FOR USER SCREENSHOT: Heart 39, Crown 111, Gender 29/24, Luxury VIP6)
export interface HostYoHoBadgesProps {
  gender?: 'male' | 'female';
  age?: number;
  heartLevel?: number;
  crownLevel?: number;
  vipLevel?: string | number;
  onToggleGender?: () => void;
}

export const HostYoHoBadges: React.FC<HostYoHoBadgesProps> = ({
  gender = 'female',
  age = 24,
  heartLevel = 39,
  crownLevel = 111,
  vipLevel = 'VIP6',
  onToggleGender
}) => {
  const isFemale = gender === 'female';
  const displayAge = age || (isFemale ? 24 : 29);

  return (
    <div className="inline-flex items-center gap-1 flex-nowrap align-middle shrink-0 select-none py-0.5" dir="ltr">
      {/* 1. Heart / Romance Capsule Badge (39 + Heart - Red to Coral gradient) */}
      <div
        className="inline-flex items-center gap-0.5 px-1.5 py-[2px] rounded-full bg-gradient-to-r from-[#FF3B30] via-[#FF453A] to-[#FF2D55] text-white shadow-[0_1px_3px_rgba(255,59,48,0.4)] shrink-0 border border-white/15"
        title={`مستوى الرومانسية والدعم: ${heartLevel} ❤️`}
      >
        <span className="font-black italic text-[9.5px] leading-none text-white tracking-tight drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)] font-sans">
          {heartLevel}
        </span>
        <svg
          className="w-2.5 h-2.5 text-white fill-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.2)] ml-0.5 shrink-0"
          viewBox="0 0 24 24"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>

      {/* 2. Crown / Glory Level Capsule Badge (111 + Crown - Magenta to Orange gradient) */}
      <div
        className="inline-flex items-center gap-0.5 px-1.5 py-[2px] rounded-full bg-gradient-to-r from-[#FF007A] via-[#FF1493] to-[#FF8C00] text-white shadow-[0_1px_3px_rgba(255,0,122,0.4)] shrink-0 border border-white/15"
        title={`مستوى الكراون والمجد: ${crownLevel} 👑`}
      >
        <span className="font-black italic text-[9.5px] leading-none text-white tracking-tight drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)] font-sans">
          {crownLevel}
        </span>
        <span className="text-[10px] leading-none drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)] ml-0.5 filter">
          👑
        </span>
      </div>

      {/* 3. Gender & Age Capsule Badge (Male: Cyan Blue with ♂ | Female: Hot Pink with ♀) */}
      <div
        onClick={(e) => {
          if (onToggleGender) {
            e.stopPropagation();
            onToggleGender();
          }
        }}
        className={`inline-flex items-center gap-0.5 px-1.5 py-[2px] rounded-full text-white shrink-0 cursor-pointer hover:scale-105 active:scale-95 transition-all border border-white/20 ${
          isFemale
            ? 'bg-gradient-to-r from-[#FF2E7E] via-[#FF3877] to-[#FF65A5] shadow-[0_1px_3px_rgba(255,46,126,0.4)] ring-1 ring-pink-300/40'
            : 'bg-gradient-to-r from-[#0088FF] via-[#0095FF] to-[#00B4D8] shadow-[0_1px_3px_rgba(0,136,255,0.4)] ring-1 ring-blue-300/40'
        }`}
        title={`شارة ${isFemale ? 'أنثى ♀ (وردي فاقع)' : 'ذكر ♂ (أزرق سماوي)'} - انقر للتبديل الفوري بين الذكر والأنثى`}
      >
        <span className="font-black text-[9.5px] leading-none text-white tracking-tight drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)] font-sans">
          {displayAge}
        </span>
        <span className="text-[11px] leading-none font-black text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)] ml-0.5">
          {isFemale ? '♀' : '♂'}
        </span>
      </div>

      {/* 4. Luxury VIP6 Capsule Badge (Dark Gold Oval with Metallic Gold Border & VIP6 text) */}
      <div
        className="inline-flex items-center px-1.5 py-[1.5px] rounded-full bg-gradient-to-b from-[#2D261B] via-[#1A160F] to-[#0D0B08] border border-[#D4AF37] ring-1 ring-[#FFE599]/40 shadow-[0_1px_4px_rgba(212,175,55,0.4)] shrink-0"
        title={`عضوية النخبة ${vipLevel}`}
      >
        <span className="italic font-black text-[9px] tracking-tight text-[#F7E7BE] drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] font-sans">
          {vipLevel}
        </span>
      </div>
    </div>
  );
};
