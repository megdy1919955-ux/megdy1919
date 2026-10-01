import React from 'react';

// ==========================================
// 1. شارات وميداليات الشاشات (Badges & Medals)
// ==========================================

// شارة المستوى 100 (Blue Crystal Winged Shield 100)
export const Badge100Shield: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg className={`${className} drop-shadow-md`} viewBox="0 0 64 64" fill="none">
    <defs>
      <linearGradient id="b100_wing" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#BAE6FD" />
        <stop offset="50%" stopColor="#38BDF8" />
        <stop offset="100%" stopColor="#0284C7" />
      </linearGradient>
      <linearGradient id="b100_shield" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="25%" stopColor="#E0F2FE" />
        <stop offset="60%" stopColor="#0284C7" />
        <stop offset="100%" stopColor="#0369A1" />
      </linearGradient>
      <linearGradient id="b100_gold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="50%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
    </defs>
    {/* Wings */}
    <path d="M12 28C6 22 8 12 16 8C14 14 18 18 22 20C17 22 14 25 12 28Z" fill="url(#b100_wing)" />
    <path d="M52 28C58 22 56 12 48 8C50 14 46 18 42 20C47 22 50 25 52 28Z" fill="url(#b100_wing)" />
    <path d="M8 38C4 32 6 24 14 20C12 26 16 30 20 32C15 34 10 36 8 38Z" fill="url(#b100_wing)" opacity="0.8" />
    <path d="M56 38C60 32 58 24 50 20C52 26 48 30 44 32C49 34 54 36 56 38Z" fill="url(#b100_wing)" opacity="0.8" />
    {/* Outer Shield Frame */}
    <path d="M32 6L48 14V34C48 45 32 56 32 56C32 56 16 45 16 34V14L32 6Z" fill="url(#b100_gold)" stroke="#FFF" strokeWidth="1.5" />
    {/* Inner Crystal Shield */}
    <path d="M32 10L44 16.5V33C44 42 32 51 32 51C32 51 20 42 20 33V16.5L32 10Z" fill="url(#b100_shield)" stroke="#BAE6FD" strokeWidth="1" />
    {/* Crystal Facets */}
    <path d="M32 10L32 51L44 33V16.5L32 10Z" fill="#FFF" opacity="0.2" />
    {/* 100 Text */}
    <text x="32" y="34" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="900" fontFamily="sans-serif" letterSpacing="-0.5" filter="drop-shadow(0px 1px 2px rgba(0,0,0,0.6))">100</text>
    {/* Sparkle */}
    <circle cx="28" cy="18" r="1.5" fill="#FFFFFF" />
  </svg>
);

// شارة المستوى 150 (Violet Crystal Radiant Shield 150)
export const Badge150Shield: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg className={`${className} drop-shadow-md`} viewBox="0 0 64 64" fill="none">
    <defs>
      <linearGradient id="b150_wing" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#E9D5FF" />
        <stop offset="50%" stopColor="#C084FC" />
        <stop offset="100%" stopColor="#7E22CE" />
      </linearGradient>
      <linearGradient id="b150_shield" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FAF5FF" />
        <stop offset="30%" stopColor="#C084FC" />
        <stop offset="70%" stopColor="#7E22CE" />
        <stop offset="100%" stopColor="#581C87" />
      </linearGradient>
      <linearGradient id="b150_gold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#F5D061" />
        <stop offset="100%" stopColor="#C89228" />
      </linearGradient>
    </defs>
    <circle cx="32" cy="32" r="26" fill="#C084FC" opacity="0.15" />
    {/* Wings */}
    <path d="M12 28C6 22 8 12 16 8C14 14 18 18 22 20C17 22 14 25 12 28Z" fill="url(#b150_wing)" />
    <path d="M52 28C58 22 56 12 48 8C50 14 46 18 42 20C47 22 50 25 52 28Z" fill="url(#b150_wing)" />
    <path d="M8 38C4 32 6 24 14 20C12 26 16 30 20 32C15 34 10 36 8 38Z" fill="url(#b150_wing)" opacity="0.8" />
    <path d="M56 38C60 32 58 24 50 20C52 26 48 30 44 32C49 34 54 36 56 38Z" fill="url(#b150_wing)" opacity="0.8" />
    {/* Shield */}
    <path d="M32 6L48 14V34C48 45 32 56 32 56C32 56 16 45 16 34V14L32 6Z" fill="url(#b150_gold)" stroke="#FFF" strokeWidth="1.5" />
    <path d="M32 10L44 16.5V33C44 42 32 51 32 51C32 51 20 42 20 33V16.5L32 10Z" fill="url(#b150_shield)" stroke="#E9D5FF" strokeWidth="1" />
    <text x="32" y="34" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="900" fontFamily="sans-serif" letterSpacing="-0.5" filter="drop-shadow(0px 1px 2px rgba(0,0,0,0.6))">150</text>
  </svg>
);

// شارة المستوى 180 (Rose/Red Radiant Shield 180)
export const Badge180Shield: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg className={`${className} drop-shadow-md`} viewBox="0 0 64 64" fill="none">
    <defs>
      <linearGradient id="b180_wing" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FECDD3" />
        <stop offset="50%" stopColor="#FB7185" />
        <stop offset="100%" stopColor="#BE123C" />
      </linearGradient>
      <linearGradient id="b180_shield" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFF1F2" />
        <stop offset="30%" stopColor="#FB7185" />
        <stop offset="70%" stopColor="#E11D48" />
        <stop offset="100%" stopColor="#881337" />
      </linearGradient>
      <linearGradient id="b180_gold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFE4E6" />
        <stop offset="100%" stopColor="#F43F5E" />
      </linearGradient>
    </defs>
    <circle cx="32" cy="32" r="26" fill="#FB7185" opacity="0.2" />
    {/* Wings */}
    <path d="M12 28C6 22 8 12 16 8C14 14 18 18 22 20C17 22 14 25 12 28Z" fill="url(#b180_wing)" />
    <path d="M52 28C58 22 56 12 48 8C50 14 46 18 42 20C47 22 50 25 52 28Z" fill="url(#b180_wing)" />
    <path d="M8 38C4 32 6 24 14 20C12 26 16 30 20 32C15 34 10 36 8 38Z" fill="url(#b180_wing)" opacity="0.8" />
    <path d="M56 38C60 32 58 24 50 20C52 26 48 30 44 32C49 34 54 36 56 38Z" fill="url(#b180_wing)" opacity="0.8" />
    {/* Shield */}
    <path d="M32 6L48 14V34C48 45 32 56 32 56C32 56 16 45 16 34V14L32 6Z" fill="url(#b180_gold)" stroke="#FFF" strokeWidth="1.5" />
    <path d="M32 10L44 16.5V33C44 42 32 51 32 51C32 51 20 42 20 33V16.5L32 10Z" fill="url(#b180_shield)" stroke="#FECDD3" strokeWidth="1" />
    <text x="32" y="34" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="900" fontFamily="sans-serif" letterSpacing="-0.5" filter="drop-shadow(0px 1px 2px rgba(0,0,0,0.6))">180</text>
  </svg>
);

// درع NOBLE 3 الحصان الفضي والزمردي (Silver & Emerald Horse Crest)
export const Noble3HorseBadge: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg className={`${className} drop-shadow-md`} viewBox="0 0 64 64" fill="none">
    <defs>
      <linearGradient id="nb3_silver" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#F8FAFC" />
        <stop offset="40%" stopColor="#CBD5E1" />
        <stop offset="80%" stopColor="#94A3B8" />
        <stop offset="100%" stopColor="#64748B" />
      </linearGradient>
      <linearGradient id="nb3_emerald" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#6EE7B7" />
        <stop offset="50%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#047857" />
      </linearGradient>
    </defs>
    {/* Laurel Wreath */}
    <path d="M14 36C10 28 14 18 20 14C18 20 22 26 26 28C20 32 16 34 14 36Z" fill="url(#nb3_emerald)" />
    <path d="M50 36C54 28 50 18 44 14C46 20 42 26 38 28C44 32 48 34 50 36Z" fill="url(#nb3_emerald)" />
    {/* Horse Head */}
    <path d="M32 8C30 10 28 14 26 18C25 21 27 24 30 25C31 25.5 32 28 32 30C32 28 33 25.5 34 25C37 24 39 21 38 18C36 14 34 10 32 8Z" fill="url(#nb3_silver)" stroke="#FFF" strokeWidth="0.8" />
    <circle cx="29" cy="18" r="1" fill="#047857" />
    <circle cx="35" cy="18" r="1" fill="#047857" />
    {/* Silver Wings Shield */}
    <path d="M18 22C18 22 32 18 32 18C32 18 46 22 46 22V36C46 46 32 54 32 54C32 54 18 46 18 36V22Z" fill="url(#nb3_silver)" stroke="#FFF" strokeWidth="1" />
    <path d="M22 25C22 25 32 22 32 22C32 22 42 25 42 25V35C42 43 32 50 32 50C32 50 22 43 22 35V25Z" fill="url(#nb3_emerald)" />
    {/* Ribbon Banner */}
    <rect x="18" y="38" width="28" height="9" rx="2" fill="#1E293B" stroke="url(#nb3_silver)" strokeWidth="1" />
    <text x="32" y="44.5" textAnchor="middle" fill="#FFFFFF" fontSize="6.5" fontWeight="900" fontFamily="sans-serif">NOBLE 3</text>
  </svg>
);

// درع NOBLE 4 / NOBLE 5 الذئب الزمردي (Emerald Wolf Crest)
export const NobleWolfBadge: React.FC<{ level?: 4 | 5; className?: string }> = ({ level = 4, className = "w-16 h-16" }) => (
  <svg className={`${className} drop-shadow-md`} viewBox="0 0 64 64" fill="none">
    <defs>
      <linearGradient id={`nwolf_${level}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#A7F3D0" />
        <stop offset="40%" stopColor="#34D399" />
        <stop offset="80%" stopColor="#059669" />
        <stop offset="100%" stopColor="#064E3B" />
      </linearGradient>
      <linearGradient id="nwolf_silver" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#CBD5E1" />
      </linearGradient>
    </defs>
    {/* Emerald Wings */}
    <path d="M10 26C4 18 8 10 16 6C14 12 18 18 24 20C18 22 14 24 10 26Z" fill={`url(#nwolf_${level})`} />
    <path d="M54 26C60 18 56 10 48 6C50 12 46 18 40 20C46 22 50 24 54 26Z" fill={`url(#nwolf_${level})`} />
    <path d="M6 36C2 30 6 22 14 18C12 24 16 28 22 30C16 32 10 34 6 36Z" fill={`url(#nwolf_${level})`} opacity="0.85" />
    <path d="M58 36C62 30 58 22 50 18C52 24 48 28 42 30C48 32 54 34 58 36Z" fill={`url(#nwolf_${level})`} opacity="0.85" />
    {/* Wolf Head Emblem */}
    <path d="M32 14L24 22L27 28L32 26L37 28L40 22L32 14Z" fill={`url(#nwolf_${level})`} stroke="#FFF" strokeWidth="1" />
    <polygon points="28,21 30,23 27,24" fill="#FEF08A" />
    <polygon points="36,21 34,23 37,24" fill="#FEF08A" />
    {/* Shield Base */}
    <path d="M20 28C20 28 32 24 32 24C32 24 44 28 44 28V38C44 46 32 54 32 54C32 54 20 46 20 38V28Z" fill={`url(#nwolf_${level})`} stroke="#FFF" strokeWidth="1.2" />
    {/* Banner */}
    <rect x="18" y="40" width="28" height="9" rx="2" fill="#064E3B" stroke="url(#nwolf_silver)" strokeWidth="1" />
    <text x="32" y="46.5" textAnchor="middle" fill="#FFFFFF" fontSize="6.5" fontWeight="900" fontFamily="sans-serif">NOBLE {level}</text>
  </svg>
);

// ميدالية الإبهام والنجوم (Thumbs Up Star Medals: ممتازة / رائعة / جيدة)
export const ThumbsUpMedal: React.FC<{ type?: 'excellent' | 'great' | 'good'; className?: string }> = ({ type = 'excellent', className = "w-16 h-16" }) => {
  const getColors = () => {
    switch (type) {
      case 'excellent': // Pink/Gold (ميدالية ممتازة)
        return {
          starBg: 'from-fuchsia-500 via-pink-500 to-amber-400',
          ribbon: 'from-pink-600 to-purple-700',
          accent: '#F43F5E',
          ring: '#FBBF24',
        };
      case 'great': // Violet/Gold (ميدالية رائعة)
        return {
          starBg: 'from-violet-600 via-purple-500 to-amber-400',
          ribbon: 'from-purple-700 to-indigo-800',
          accent: '#8B5CF6',
          ring: '#FBBF24',
        };
      case 'good': // Sapphire Blue/Gold (ميدالية جيدة)
        return {
          starBg: 'from-sky-500 via-blue-600 to-cyan-400',
          ribbon: 'from-blue-700 to-sky-800',
          accent: '#0284C7',
          ring: '#FBBF24',
        };
    }
  };

  const c = getColors();

  return (
    <svg className={`${className} drop-shadow-lg`} viewBox="0 0 64 64" fill="none">
      <defs>
        <linearGradient id={`tum_star_${type}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFBEB" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
        <linearGradient id={`tum_hand_${type}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FED7AA" />
          <stop offset="50%" stopColor="#FB923C" />
          <stop offset="100%" stopColor="#C2410C" />
        </linearGradient>
      </defs>
      {/* 8-Pointed Starburst Backing */}
      <path d="M32 4L39 15L52 14L49 27L59 34L49 41L52 54L39 53L32 64L25 53L12 54L15 41L5 34L15 27L12 14L25 15L32 4Z" fill={type === 'excellent' ? '#E11D48' : type === 'great' ? '#7C3AED' : '#0284C7'} stroke="#FEF08A" strokeWidth="1.5" />
      {/* Gold Laurel Ring */}
      <circle cx="32" cy="34" r="18" fill="url(#tum_star_${type})" stroke="#FFF" strokeWidth="1.5" />
      <circle cx="32" cy="34" r="14" fill={type === 'excellent' ? '#BE123C' : type === 'great' ? '#581C87' : '#0369A1'} />
      {/* 3D Golden Thumbs Up */}
      <path d="M26 38V30C26 30 29 25 32 23C33 22 34 23 34 25V28H39C41 28 42 29.5 42 31.5C42 32.5 41 33.5 40 34C41 34.5 41.5 35.5 41 36.5C41 37.5 40 38.5 39 39H35C33 39 26 38 26 38Z" fill="url(#tum_hand_${type})" stroke="#FEF3C7" strokeWidth="1" />
      <rect x="23" y="30" width="4" height="9" rx="1.5" fill="#FBBF24" stroke="#FFF" strokeWidth="0.8" />
      {/* Sparkle Glint */}
      <path d="M44 14L45 10L46 14L50 15L46 16L45 20L44 16L40 15L44 14Z" fill="#FFFBEB" />
    </svg>
  );
};

// وسام الخبرة المضاعفة (Gấp Đôi Kinh Nghiệm Double EXP Silver Crest)
export const DoubleExpBadge: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg className={`${className} drop-shadow-lg`} viewBox="0 0 64 64" fill="none">
    <defs>
      <linearGradient id="dexp_silver" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="50%" stopColor="#E2E8F0" />
        <stop offset="100%" stopColor="#94A3B8" />
      </linearGradient>
    </defs>
    {/* Frost Sparkle Cloud */}
    <circle cx="32" cy="32" r="25" fill="#FFFFFF" opacity="0.3" filter="blur(3px)" />
    {/* Hexagon Diamond Shield */}
    <polygon points="32,6 54,18 54,46 32,58 10,46 10,18" fill="url(#dexp_silver)" stroke="#FFFFFF" strokeWidth="2" />
    <polygon points="32,12 48,22 48,42 32,52 16,42 16,22" fill="#1E293B" />
    {/* EXP Chest / Ingot Icon */}
    <rect x="23" y="27" width="18" height="11" rx="2" fill="url(#dexp_silver)" stroke="#FFF" strokeWidth="1" />
    <text x="32" y="35" textAnchor="middle" fill="#0F172A" fontSize="6.5" fontWeight="900" fontFamily="sans-serif">EXP x2</text>
    {/* Top Diamond */}
    <polygon points="32,16 37,22 32,26 27,22" fill="#E2E8F0" stroke="#FFF" strokeWidth="0.8" />
  </svg>
);

// وسام الاحتفال السنوي (Anniversary Celebration Party Giftbox)
export const AnniversaryBadge: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg className={`${className} drop-shadow-lg`} viewBox="0 0 64 64" fill="none">
    <defs>
      <linearGradient id="anni_pink" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#F472B6" />
        <stop offset="100%" stopColor="#DB2777" />
      </linearGradient>
      <linearGradient id="anni_yellow" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FDE047" />
        <stop offset="100%" stopColor="#CA8A04" />
      </linearGradient>
    </defs>
    {/* Confetti & Gift Streamers */}
    <circle cx="16" cy="18" r="3" fill="#38BDF8" />
    <circle cx="48" cy="16" r="3.5" fill="#F43F5E" />
    <circle cx="52" cy="38" r="2.5" fill="#FBBF24" />
    <circle cx="12" cy="42" r="3" fill="#A855F7" />
    <path d="M20 10L24 14L20 18" stroke="#F43F5E" strokeWidth="2" strokeLinecap="round" />
    <path d="M44 10L40 14L44 18" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
    {/* Gift Box Base */}
    <rect x="18" y="26" width="28" height="24" rx="4" fill="url(#anni_pink)" stroke="#FFF" strokeWidth="1.5" />
    {/* Yellow Ribbon */}
    <rect x="29" y="26" width="6" height="24" fill="url(#anni_yellow)" />
    <rect x="18" y="34" width="28" height="6" fill="url(#anni_yellow)" />
    {/* Bow on Top */}
    <path d="M26 22C23 18 25 14 30 18C30 18 31 22 32 26C33 22 34 18 34 18C39 14 41 18 38 22C35 25 32 26 32 26C32 26 29 25 26 22Z" fill="url(#anni_yellow)" stroke="#FFF" strokeWidth="1" />
  </svg>
);

// وسام الفانوس الملكي والرمضاني (Golden Crescent & Green Lantern Medal)
export const RamadanLanternBadge: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg className={`${className} drop-shadow-lg`} viewBox="0 0 64 64" fill="none">
    <defs>
      <linearGradient id="rl_gold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="50%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
      <linearGradient id="rl_emerald" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#34D399" />
        <stop offset="50%" stopColor="#059669" />
        <stop offset="100%" stopColor="#064E3B" />
      </linearGradient>
    </defs>
    {/* Outer Golden Crescent Frame */}
    <circle cx="32" cy="32" r="26" stroke="url(#rl_gold)" strokeWidth="2.5" fill="#064E3B" />
    <path d="M42 12C30 14 24 24 26 36C28 48 40 54 48 50C36 56 22 48 20 34C18 20 30 10 42 12Z" fill="url(#rl_gold)" opacity="0.9" />
    {/* Glowing Islamic Lantern in Center */}
    {/* Lantern Top */}
    <path d="M30 18H34L36 22H28L30 18Z" fill="url(#rl_gold)" stroke="#FFF" strokeWidth="0.6" />
    {/* Lantern Body */}
    <path d="M28 22H36L38 32L32 40L26 32L28 22Z" fill="url(#rl_emerald)" stroke="url(#rl_gold)" strokeWidth="1.2" />
    {/* Glow Core */}
    <circle cx="32" cy="30" r="3.5" fill="#FEF08A" filter="drop-shadow(0 0 4px #FDE047)" />
    {/* Lantern Base */}
    <rect x="29" y="40" width="6" height="3" rx="1" fill="url(#rl_gold)" />
  </svg>
);


// ==========================================
// 2. إطارات الصور الشخصية (Avatar Frames)
// ==========================================

// إطار 1: إطار الشرف الملكي والماسي (Crown, Thumbs Up Ribbon & Multi-gems Frame)
export const RoyalHonorAvatarFrame: React.FC<{ children?: React.ReactNode; className?: string }> = ({ children, className = "w-28 h-28" }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 drop-shadow-[0_4px_10px_rgba(245,158,11,0.4)]" viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="roya_gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFBEB" />
          <stop offset="30%" stopColor="#FDE047" />
          <stop offset="70%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#92400E" />
        </linearGradient>
        <linearGradient id="roya_pink" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F472B6" />
          <stop offset="100%" stopColor="#A855F7" />
        </linearGradient>
      </defs>
      {/* Crown Top */}
      <path d="M40 12L50 4L60 12L56 16H44L40 12Z" fill="url(#roya_gold)" stroke="#FFF" strokeWidth="1" />
      <circle cx="50" cy="5" r="2" fill="#F43F5E" />
      {/* Outer Golden Ring Frame */}
      <circle cx="50" cy="50" r="38" stroke="url(#roya_gold)" strokeWidth="4.5" />
      <circle cx="50" cy="50" r="34" stroke="url(#roya_pink)" strokeWidth="2.5" />
      {/* Crystal Wings surrounding the Ring */}
      <path d="M16 38C10 32 14 22 22 18C20 25 24 30 30 32C22 34 18 36 16 38Z" fill="url(#roya_pink)" />
      <path d="M84 38C90 32 86 22 78 18C80 25 76 30 70 32C78 34 82 36 84 38Z" fill="url(#roya_pink)" />
      <path d="M12 58C8 50 12 42 20 40C18 47 24 52 28 54C20 56 14 57 12 58Z" fill="url(#roya_gold)" />
      <path d="M88 58C92 50 88 42 80 40C82 47 76 52 72 54C80 56 86 57 88 58Z" fill="url(#roya_gold)" />
      {/* Bottom Ribbon with Thumbs up & Ruby Gem */}
      <circle cx="50" cy="88" r="5" fill="#E11D48" stroke="url(#roya_gold)" strokeWidth="1.5" />
      <path d="M38 84C42 80 46 84 50 84C54 84 58 80 62 84C58 90 42 90 38 84Z" fill="url(#roya_gold)" stroke="#FFF" strokeWidth="0.8" />
    </svg>
    <div className="w-[66%] h-[66%] rounded-full overflow-hidden z-0">
      {children}
    </div>
  </div>
);

// إطار 2: إطار NOBLE 3 الفضي والأخضر الزمردي (Silver Horse Wreath Frame)
export const Noble3AvatarFrame: React.FC<{ children?: React.ReactNode; className?: string }> = ({ children, className = "w-28 h-28" }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 drop-shadow-[0_4px_10px_rgba(16,185,129,0.3)]" viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="nob_silver" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#CBD5E1" />
          <stop offset="100%" stopColor="#64748B" />
        </linearGradient>
        <linearGradient id="nob_emerald" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#065F46" />
        </linearGradient>
      </defs>
      {/* Horse Head Top */}
      <path d="M50 4C47 8 45 12 43 16C42 19 45 22 50 22C55 22 58 19 57 16C55 12 53 8 50 4Z" fill="url(#nob_silver)" stroke="#FFF" strokeWidth="0.8" />
      <circle cx="50" cy="14" r="1.5" fill="#10B981" />
      {/* Silver Outer Ring */}
      <circle cx="50" cy="50" r="38" stroke="url(#nob_silver)" strokeWidth="4" />
      <circle cx="50" cy="50" r="34" stroke="url(#nob_emerald)" strokeWidth="1.5" />
      {/* Winged Wreath Sides */}
      <path d="M18 36C12 28 16 18 24 14C22 22 28 28 32 30C24 32 20 34 18 36Z" fill="url(#nob_emerald)" />
      <path d="M82 36C88 28 84 18 76 14C78 22 72 28 68 30C76 32 80 34 82 36Z" fill="url(#nob_emerald)" />
      <path d="M14 56C10 46 14 38 22 36C20 44 26 50 30 52C22 54 16 55 14 56Z" fill="url(#nob_silver)" />
      <path d="M86 56C90 46 86 38 78 36C80 44 74 50 70 52C78 54 84 55 86 56Z" fill="url(#nob_silver)" />
      {/* NOBLE 3 Banner Bottom */}
      <rect x="28" y="78" width="44" height="12" rx="3" fill="#1E293B" stroke="url(#nob_silver)" strokeWidth="1.5" />
      <text x="50" y="87" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="900" fontFamily="sans-serif">NOBLE 3</text>
    </svg>
    <div className="w-[66%] h-[66%] rounded-full overflow-hidden z-0">
      {children}
    </div>
  </div>
);

// إطار 3: إطار الفارس الملكي الذهبي والياقوت الأزرق (Knight Helm & Blue Diamonds Frame)
export const KnightSapphireAvatarFrame: React.FC<{ children?: React.ReactNode; className?: string }> = ({ children, className = "w-28 h-28" }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 drop-shadow-[0_4px_10px_rgba(2,132,199,0.35)]" viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="knt_gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#78350F" />
        </linearGradient>
        <linearGradient id="knt_blue" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7DD3FC" />
          <stop offset="50%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#0369A1" />
        </linearGradient>
      </defs>
      {/* Knight Helm on Top */}
      <path d="M50 2L42 12H58L50 2Z" fill="url(#knt_gold)" stroke="#FFF" strokeWidth="0.8" />
      <path d="M40 12C36 14 36 20 44 22H56C64 20 64 14 60 12H40Z" fill="url(#knt_gold)" stroke="#FFF" strokeWidth="1" />
      <path d="M46 16H54V18H46V16Z" fill="#1E293B" />
      {/* Sapphire Crystal Wings Left & Right */}
      <path d="M12 36L24 24L30 32L16 42L12 36Z" fill="url(#knt_blue)" stroke="#FFF" strokeWidth="0.8" />
      <path d="M88 36L76 24L70 32L84 42L88 36Z" fill="url(#knt_blue)" stroke="#FFF" strokeWidth="0.8" />
      <path d="M10 56L22 46L28 54L14 62L10 56Z" fill="url(#knt_blue)" stroke="#FFF" strokeWidth="0.8" />
      <path d="M90 56L78 46L72 54L86 62L90 56Z" fill="url(#knt_blue)" stroke="#FFF" strokeWidth="0.8" />
      {/* Outer Ring */}
      <circle cx="50" cy="50" r="38" stroke="url(#knt_gold)" strokeWidth="4" />
      {/* Bottom Golden Lion Head Crest */}
      <path d="M50 82L44 76L46 70H54L56 76L50 82Z" fill="url(#knt_gold)" stroke="#FFF" strokeWidth="1" />
      <circle cx="47" cy="74" r="1" fill="#0284C7" />
      <circle cx="53" cy="74" r="1" fill="#0284C7" />
      <path d="M40 82C40 82 46 88 50 88C54 88 60 82 60 82" stroke="url(#knt_gold)" strokeWidth="3" />
    </svg>
    <div className="w-[66%] h-[66%] rounded-full overflow-hidden z-0">
      {children}
    </div>
  </div>
);

// إطار 4: إطار التاج الإمبراطوري والأسود الذهبية (Imperial Crown & Golden Lions Frame)
export const ImperialCrownAvatarFrame: React.FC<{ children?: React.ReactNode; className?: string }> = ({ children, className = "w-28 h-28" }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 drop-shadow-[0_4px_12px_rgba(245,158,11,0.45)]" viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="imp_gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFBEB" />
          <stop offset="35%" stopColor="#FBBF24" />
          <stop offset="70%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#78350F" />
        </linearGradient>
      </defs>
      {/* Imperial Crown on Top */}
      <path d="M36 18L42 8L50 14L58 8L64 18H36Z" fill="url(#imp_gold)" stroke="#FFF" strokeWidth="1" />
      <circle cx="42" cy="8" r="2" fill="#E11D48" />
      <circle cx="50" cy="14" r="2.5" fill="#FEF08A" />
      <circle cx="58" cy="8" r="2" fill="#E11D48" />
      {/* Outer Heavy Baroque Gold Ring */}
      <circle cx="50" cy="50" r="38" stroke="url(#imp_gold)" strokeWidth="5" />
      {/* Left Golden Lion Head */}
      <path d="M18 42C12 38 10 46 16 52C14 56 18 60 22 56C24 50 20 44 18 42Z" fill="url(#imp_gold)" stroke="#FFF" strokeWidth="0.8" />
      <circle cx="16" cy="46" r="1.2" fill="#E11D48" />
      {/* Right Golden Lion Head */}
      <path d="M82 42C88 38 90 46 84 52C86 56 82 60 78 56C76 50 80 44 82 42Z" fill="url(#imp_gold)" stroke="#FFF" strokeWidth="0.8" />
      <circle cx="84" cy="46" r="1.2" fill="#E11D48" />
      {/* Bottom Royal Star Crest */}
      <path d="M50 80L53 87L60 88L55 93L56 100L50 96L44 100L45 93L40 88L47 87L50 80Z" fill="url(#imp_gold)" stroke="#FFF" strokeWidth="0.8" />
      <circle cx="50" cy="90" r="3" fill="#E11D48" />
    </svg>
    <div className="w-[66%] h-[66%] rounded-full overflow-hidden z-0">
      {children}
    </div>
  </div>
);


// ==========================================
// 3. فقاعات الدردشة (Chat Bubbles)
// ==========================================

// فقاعة 1: فقاعة الأجنحة الذهبية والوردي الملكي (Pink & Gold Filigree Wings Bubble)
export const RoyalPinkChatBubble: React.FC<{ text?: string; className?: string }> = ({ text = "Hello", className = "w-full max-w-[200px]" }) => (
  <div className={`relative px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF5E7E] via-[#FF4365] to-[#FF5E7E] text-white font-black text-center shadow-md border border-amber-300 ${className}`}>
    {/* Left Gold Wing Decor */}
    <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-6 bg-gradient-to-tr from-amber-400 to-yellow-200 clip-wing-l drop-shadow-xs" />
    {/* Right Gold Wing Decor */}
    <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-6 bg-gradient-to-tr from-yellow-200 to-amber-400 clip-wing-r drop-shadow-xs" />
    <span className="font-mono text-sm tracking-wide">{text}</span>
  </div>
);

// فقاعة 2: فقاعة NOBLE الفارس الرمادية والذهبية (Slate & Horse Crest Bubble)
export const NobleSlateChatBubble: React.FC<{ text?: string; className?: string }> = ({ text = "Hello", className = "w-full max-w-[200px]" }) => (
  <div className={`relative px-4 py-2 rounded-xl bg-gradient-to-r from-[#475569] via-[#64748B] to-[#475569] text-white font-black text-center shadow-md border border-amber-300 ${className}`}>
    {/* Left Horse Crest Decor */}
    <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-5 h-6 bg-gradient-to-b from-amber-300 to-emerald-700 rounded-sm flex items-center justify-center text-[8px]">
      🏇
    </div>
    <span className="font-mono text-sm tracking-wide">{text}</span>
  </div>
);

// فقاعة 3: فقاعة الألماس الذهبية (Coral & Diamond Border Bubble)
export const DiamondCoralChatBubble: React.FC<{ text?: string; className?: string }> = ({ text = "Hello", className = "w-full max-w-[200px]" }) => (
  <div className={`relative px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF4B72] via-[#FF335C] to-[#FF4B72] text-white font-black text-center shadow-md border-2 border-amber-300 ${className}`}>
    {/* Diamond Pip Center Top */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-sky-400 border border-white rotate-45" />
    {/* Diamond Pip Center Bottom */}
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-sky-400 border border-white rotate-45" />
    <span className="font-mono text-sm tracking-wide">{text}</span>
  </div>
);
