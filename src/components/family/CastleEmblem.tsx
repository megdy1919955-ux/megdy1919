import React from 'react';

export interface CastleTierInfo {
  tier: number;
  name: string;
  levelRange: string;
  description: string;
  minLevel: number;
  maxMembers: number;
  maxRooms: number;
  buffs: string[];
}

export const CASTLE_TIERS: CastleTierInfo[] = [
  {
    tier: 1,
    name: 'برج الحراسة الأول',
    levelRange: 'Lv.1 - Lv.2',
    description: 'نواة العائلة وبرج المراقبة التأسيسي للمغامرين الجدد',
    minLevel: 1,
    maxMembers: 50,
    maxRooms: 2,
    buffs: ['فتح الدردشة العائلية', 'غرفتين صوتيتين']
  },
  {
    tier: 2,
    name: 'حصن الفرسان الحجري',
    levelRange: 'Lv.3 - Lv.5',
    description: 'أسوار حجرية متينة وأبراج دفاعية تعلن بداية قوة العائلة',
    minLevel: 3,
    maxMembers: 120,
    maxRooms: 4,
    buffs: ['زيادة سعة الأعضاء إلى 120', 'شارة الحصن العائلي', '4 غرف عائلية']
  },
  {
    tier: 3,
    name: 'قلعة الفرسان الذهبية',
    levelRange: 'Lv.6 - Lv.11',
    description: 'قلعة شامخة ذات قباب ذهبية وبوابات ملكية محصنة بالفرسان',
    minLevel: 6,
    maxMembers: 350,
    maxRooms: 6,
    buffs: ['زيادة سعة الأعضاء إلى 350', 'تأثير دخول القلعة الذهبية', 'مضاعفة نقاط تفاعل الرومات']
  },
  {
    tier: 4,
    name: 'قلعة المجد الإمبراطورية',
    levelRange: 'Lv.12 - Lv.19',
    description: 'قلعة إمبراطورية فاخرة بأبراج متعددة وشعلات نار ملكية وقاعات شرف',
    minLevel: 12,
    maxMembers: 980,
    maxRooms: 10,
    buffs: ['سعة 980 عضواً', '10 غرف عائلية نشطة', 'بانر شرف في الصفحة الرئيسية', 'حماية الرومات برمز سري VIP']
  },
  {
    tier: 5,
    name: 'القلعة الملكية الأسطورية الخالدة',
    levelRange: 'Lv.20+',
    description: 'أعلى وأعظم رتبة قلاع في تطبيق النجم، مرصعة بالياقوت والذهب الخالص',
    minLevel: 20,
    maxMembers: 2500,
    maxRooms: 20,
    buffs: ['سعة غير محدودة للأعضاء', 'أجنحة الفينيق الملكية للقلعة', 'تأثير دخول عرش القلعة الأسطوري', 'تاج القلعة الخالد']
  }
];

export function getCastleTierByLevel(level: number): CastleTierInfo {
  if (level >= 20) return CASTLE_TIERS[4];
  if (level >= 12) return CASTLE_TIERS[3];
  if (level >= 6) return CASTLE_TIERS[2];
  if (level >= 3) return CASTLE_TIERS[1];
  return CASTLE_TIERS[0];
}

interface CastleEmblemProps {
  level: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
}

/**
 * 3D Castle Visualizer that dynamically evolves based on Family Level:
 * - Tier 1 (Lv 1-2): Simple Single Wooden/Stone Watchtower
 * - Tier 2 (Lv 3-5): Fortified Stone Keep with 2 Side Bastions
 * - Tier 3 (Lv 6-11): Triple-Tower Golden Fortress with Crest
 * - Tier 4 (Lv 12-19): Grand Imperial 5-Tower Citadel with Golden Spires & Glowing Torches
 * - Tier 5 (Lv 20+): Legendary Celestial Citadel with Floating Phoenix Wings & Crown Jewels
 */
export const CastleEmblem: React.FC<CastleEmblemProps> = ({
  level,
  className = '',
  size = 'md',
  animated = true
}) => {
  const tierInfo = getCastleTierByLevel(level);
  const tier = tierInfo.tier;

  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-36 h-36'
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${sizeClasses[size]} ${className}`}>
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_6px_14px_rgba(180,140,60,0.35)]"
      >
        <defs>
          {/* Royal Gold Gradients */}
          <linearGradient id={`goldBase_${tier}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF9E6" />
            <stop offset="30%" stopColor="#F5D061" />
            <stop offset="70%" stopColor="#C89228" />
            <stop offset="100%" stopColor="#7E4F0B" />
          </linearGradient>

          <linearGradient id={`goldWall_${tier}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#EAD39B" />
            <stop offset="50%" stopColor="#C59A4E" />
            <stop offset="100%" stopColor="#8A601A" />
          </linearGradient>

          <linearGradient id={`stoneWall_${tier}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4A3E31" />
            <stop offset="100%" stopColor="#1E1710" />
          </linearGradient>

          <linearGradient id={`roofRuby_${tier}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF4D6D" />
            <stop offset="50%" stopColor="#D92048" />
            <stop offset="100%" stopColor="#800620" />
          </linearGradient>

          <linearGradient id={`roofSapphire_${tier}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="50%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1E3A8A" />
          </linearGradient>

          {/* Glowing Aura for Grand Citadels */}
          <radialGradient id={`castleAura_${tier}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F5D061" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#7E4F0B" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Outer Aura Glow for high tier castles */}
        {tier >= 3 && (
          <circle cx="60" cy="60" r="56" fill={`url(#castleAura_${tier})`} />
        )}

        {/* TIER 1: Simple Watchtower (Lv 1-2) */}
        {tier === 1 && (
          <g>
            {/* Ground / Foundation */}
            <rect x="35" y="88" width="50" height="12" rx="4" fill={`url(#goldBase_${tier})`} stroke="#FFF" strokeWidth="0.8" />
            
            {/* Main Tower Shaft */}
            <path d="M42 88L45 42H75L78 88H42Z" fill={`url(#stoneWall_${tier})`} stroke={`url(#goldBase_${tier})`} strokeWidth="1.5" />
            
            {/* Wooden/Stone Door */}
            <path d="M54 88V72C54 69 57 66 60 66C63 66 66 69 66 72V88H54Z" fill={`url(#goldBase_${tier})`} />
            
            {/* Watch Window */}
            <rect x="56" y="50" width="8" height="10" rx="3" fill="#FFE599" stroke="#7E4F0B" strokeWidth="1" />
            
            {/* Battlements / Turret Top */}
            <path d="M40 42H80V34H75V38H65V34H55V38H45V34H40V42Z" fill={`url(#goldBase_${tier})`} stroke="#FFF" strokeWidth="0.8" />
            
            {/* Small Flag Pole & Flag */}
            <line x1="60" y1="34" x2="60" y2="18" stroke={`url(#goldBase_${tier})`} strokeWidth="2" strokeLinecap="round" />
            <path d="M60 18L76 23L60 28V18Z" fill={`url(#roofRuby_${tier})`} />
          </g>
        )}

        {/* TIER 2: Stone Fortress with 2 Towers (Lv 3-5) */}
        {tier === 2 && (
          <g>
            {/* Base Wall Plinth */}
            <rect x="24" y="90" width="72" height="12" rx="4" fill={`url(#goldBase_${tier})`} stroke="#FFF" strokeWidth="1" />
            
            {/* Left Tower */}
            <path d="M28 90V46H44V90H28Z" fill={`url(#stoneWall_${tier})`} stroke={`url(#goldBase_${tier})`} strokeWidth="1.2" />
            <path d="M26 46H46V40H42V43H36V40H32V43H26V46Z" fill={`url(#goldBase_${tier})`} />
            <path d="M26 40L36 24L46 40H26Z" fill={`url(#roofRuby_${tier})`} stroke={`url(#goldBase_${tier})`} strokeWidth="0.8" />
            
            {/* Right Tower */}
            <path d="M76 90V46H92V90H76Z" fill={`url(#stoneWall_${tier})`} stroke={`url(#goldBase_${tier})`} strokeWidth="1.2" />
            <path d="M74 46H94V40H90V43H84V40H80V43H74V46Z" fill={`url(#goldBase_${tier})`} />
            <path d="M74 40L84 24L94 40H74Z" fill={`url(#roofRuby_${tier})`} stroke={`url(#goldBase_${tier})`} strokeWidth="0.8" />
            
            {/* Center Main Keep */}
            <path d="M44 90V40H76V90H44Z" fill={`url(#goldWall_${tier})`} stroke="#FFF" strokeWidth="1" />
            <path d="M42 40H78V34H72V37H64V34H56V37H48V34H42V40Z" fill={`url(#goldBase_${tier})`} />
            
            {/* Royal Arch Gate */}
            <path d="M52 90V68C52 63 56 60 60 60C64 60 68 63 68 68V90H52Z" fill="#1A1108" stroke={`url(#goldBase_${tier})`} strokeWidth="1.5" />
            <line x1="60" y1="60" x2="60" y2="90" stroke={`url(#goldBase_${tier})`} strokeWidth="1" />
            
            {/* Center Pennant */}
            <line x1="60" y1="34" x2="60" y2="16" stroke={`url(#goldBase_${tier})`} strokeWidth="2" strokeLinecap="round" />
            <path d="M60 16L78 22L60 28V16Z" fill={`url(#roofRuby_${tier})`} />
          </g>
        )}

        {/* TIER 3: Golden Fortress with 3 Towers (Lv 6-11) */}
        {tier === 3 && (
          <g>
            {/* Stepped Grand Foundation */}
            <path d="M16 98H104V90C104 88 102 86 100 86H20C18 86 16 88 16 90V98Z" fill={`url(#goldBase_${tier})`} stroke="#FFF" strokeWidth="1" />
            
            {/* Outer Wall Ramparts */}
            <rect x="22" y="58" width="76" height="30" fill={`url(#stoneWall_${tier})`} stroke={`url(#goldBase_${tier})`} strokeWidth="1.5" />
            
            {/* Side Towers Left & Right */}
            <rect x="18" y="42" width="18" height="46" rx="2" fill={`url(#goldWall_${tier})`} stroke="#FFF" strokeWidth="0.8" />
            <polygon points="16,42 27,22 38,42" fill={`url(#roofRuby_${tier})`} stroke={`url(#goldBase_${tier})`} strokeWidth="1" />
            <circle cx="27" cy="22" r="2.5" fill={`url(#goldBase_${tier})`} />

            <rect x="84" y="42" width="18" height="46" rx="2" fill={`url(#goldWall_${tier})`} stroke="#FFF" strokeWidth="0.8" />
            <polygon points="82,42 93,22 104,42" fill={`url(#roofRuby_${tier})`} stroke={`url(#goldBase_${tier})`} strokeWidth="1" />
            <circle cx="93" cy="22" r="2.5" fill={`url(#goldBase_${tier})`} />

            {/* Central Grand Spire & Keep */}
            <rect x="42" y="32" width="36" height="56" rx="3" fill={`url(#goldBase_${tier})`} stroke="#FFF" strokeWidth="1.2" />
            <polygon points="38,32 60,10 82,32" fill={`url(#roofRuby_${tier})`} stroke="#FFF" strokeWidth="1.2" />
            
            {/* Spire Top Golden Star */}
            <circle cx="60" cy="10" r="3.5" fill="#FFF9E6" stroke="#C89228" strokeWidth="1" />

            {/* Castle Main Crest & Gate */}
            <path d="M50 88V64C50 58 54 55 60 55C66 55 70 58 70 64V88H50Z" fill="#140E07" stroke={`url(#goldBase_${tier})`} strokeWidth="2" />
            <circle cx="60" cy="44" r="5" fill="#FFF" stroke={`url(#goldBase_${tier})`} strokeWidth="1.5" />
            <path d="M58 44L60 41L62 44L60 47Z" fill={`url(#roofRuby_${tier})`} />
          </g>
        )}

        {/* TIER 4: Grand Imperial 5-Tower Citadel (Lv 12-19) */}
        {tier === 4 && (
          <g>
            {/* Imperial Winged Base */}
            <path d="M12 96C12 94 14 92 16 92H104C106 92 108 94 108 96V102H12V96Z" fill={`url(#goldBase_${tier})`} stroke="#FFF" strokeWidth="1.2" />
            <rect x="18" y="86" width="84" height="8" fill={`url(#stoneWall_${tier})`} stroke={`url(#goldBase_${tier})`} strokeWidth="1" />

            {/* Far Left & Far Right Bastions */}
            <rect x="14" y="52" width="16" height="36" rx="2" fill={`url(#goldWall_${tier})`} stroke="#FFF" strokeWidth="0.8" />
            <polygon points="12,52 22,34 32,52" fill={`url(#roofRuby_${tier})`} stroke={`url(#goldBase_${tier})`} strokeWidth="1" />
            <line x1="22" y1="34" x2="22" y2="24" stroke={`url(#goldBase_${tier})`} strokeWidth="1.5" />
            <polygon points="22,24 30,28 22,32" fill={`url(#goldBase_${tier})`} />

            <rect x="90" y="52" width="16" height="36" rx="2" fill={`url(#goldWall_${tier})`} stroke="#FFF" strokeWidth="0.8" />
            <polygon points="88,52 98,34 108,52" fill={`url(#roofRuby_${tier})`} stroke={`url(#goldBase_${tier})`} strokeWidth="1" />
            <line x1="98" y1="34" x2="98" y2="24" stroke={`url(#goldBase_${tier})`} strokeWidth="1.5" />
            <polygon points="98,24 106,28 98,32" fill={`url(#goldBase_${tier})`} />

            {/* Mid Left & Mid Right Spire Towers */}
            <rect x="30" y="38" width="18" height="50" rx="2" fill={`url(#goldBase_${tier})`} stroke="#FFF" strokeWidth="1" />
            <polygon points="28,38 39,18 50,38" fill={`url(#roofRuby_${tier})`} stroke="#FFF" strokeWidth="1" />

            <rect x="72" y="38" width="18" height="50" rx="2" fill={`url(#goldBase_${tier})`} stroke="#FFF" strokeWidth="1" />
            <polygon points="70,38 81,18 92,38" fill={`url(#roofRuby_${tier})`} stroke="#FFF" strokeWidth="1" />

            {/* High Center Imperial Palace & Great Tower */}
            <rect x="44" y="26" width="32" height="62" rx="3" fill={`url(#goldBase_${tier})`} stroke="#FFF" strokeWidth="1.5" />
            <polygon points="40,26 60,4 80,26" fill={`url(#roofRuby_${tier})`} stroke="#FFF" strokeWidth="1.5" />
            
            {/* Top Imperial Crown Jewel */}
            <circle cx="60" cy="4" r="4.5" fill="#FFF9E6" stroke="#C89228" strokeWidth="1.2" />
            <circle cx="60" cy="4" r="2" fill="#D92048" />

            {/* Great Grand Gate with Portcullis */}
            <path d="M48 88V58C48 51 53 46 60 46C67 46 72 51 72 58V88H48Z" fill="#191107" stroke={`url(#goldBase_${tier})`} strokeWidth="2.5" />
            <path d="M52 64H68M52 72H68M52 80H68M56 50V88M64 50V88" stroke={`url(#goldBase_${tier})`} strokeWidth="1.5" strokeLinecap="round" />
            
            {/* Front Royal Shield Brooch */}
            <path d="M60 33L67 38V46C67 51 60 55 60 55C60 55 53 51 53 46V38L60 33Z" fill={`url(#roofRuby_${tier})`} stroke="#FFF" strokeWidth="1" />
            <path d="M57 43L59 41L60 43L61 41L63 43V45H57V43Z" fill="#FFF" />
          </g>
        )}

        {/* TIER 5: Celestial Legendary Citadel (Lv 20+) */}
        {tier === 5 && (
          <g>
            {/* Heavenly Golden Aura Rays */}
            <path d="M60 10L10 100M60 10L110 100M60 10L30 105M60 10L90 105" stroke={`url(#goldBase_${tier})`} strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
            
            {/* Celestial Phoenix Wings Embellishment */}
            <path d="M15 65C8 50 12 30 28 20C24 35 32 45 42 50C28 55 20 60 15 65Z" fill={`url(#goldBase_${tier})`} opacity="0.9" />
            <path d="M105 65C112 50 108 30 92 20C96 35 88 45 78 50C92 55 100 60 105 65Z" fill={`url(#goldBase_${tier})`} opacity="0.9" />

            {/* Stepped Pure Gold Grand Platform */}
            <path d="M8 104H112V96C112 92 108 90 104 90H16C12 90 8 92 8 96V104Z" fill={`url(#goldBase_${tier})`} stroke="#FFF" strokeWidth="1.5" />
            
            {/* Outer Spires (x4) */}
            <rect x="18" y="46" width="14" height="46" rx="2" fill={`url(#goldBase_${tier})`} stroke="#FFF" strokeWidth="0.8" />
            <polygon points="16,46 25,24 34,46" fill={`url(#roofSapphire_${tier})`} stroke={`url(#goldBase_${tier})`} strokeWidth="1" />
            
            <rect x="88" y="46" width="14" height="46" rx="2" fill={`url(#goldBase_${tier})`} stroke="#FFF" strokeWidth="0.8" />
            <polygon points="86,46 95,24 104,46" fill={`url(#roofSapphire_${tier})`} stroke={`url(#goldBase_${tier})`} strokeWidth="1" />

            {/* Inner Spires (x2) */}
            <rect x="34" y="32" width="16" height="60" rx="2" fill={`url(#goldBase_${tier})`} stroke="#FFF" strokeWidth="1" />
            <polygon points="32,32 42,12 52,32" fill={`url(#roofRuby_${tier})`} stroke="#FFF" strokeWidth="1.2" />

            <rect x="70" y="32" width="16" height="60" rx="2" fill={`url(#goldBase_${tier})`} stroke="#FFF" strokeWidth="1" />
            <polygon points="68,32 78,12 88,32" fill={`url(#roofRuby_${tier})`} stroke="#FFF" strokeWidth="1.2" />

            {/* Central Celestial Sanctuary Keep */}
            <rect x="46" y="20" width="28" height="72" rx="4" fill={`url(#goldBase_${tier})`} stroke="#FFF" strokeWidth="1.8" />
            <polygon points="42,20 60,0 78,20" fill={`url(#roofSapphire_${tier})`} stroke="#FFF" strokeWidth="1.8" />
            
            {/* Glowing Diamond Halo Crown on Top */}
            <polygon points="60,-2 65,3 60,8 55,3" fill="#FFF" stroke={`url(#goldBase_${tier})`} strokeWidth="1" />
            <circle cx="60" cy="3" r="1.5" fill="#FFE599" />

            {/* Radiant Celestial Sun Gate */}
            <path d="M48 92V54C48 46 53 42 60 42C67 42 72 46 72 54V92H48Z" fill="#140D04" stroke={`url(#goldBase_${tier})`} strokeWidth="2.5" />
            <circle cx="60" cy="56" r="6" fill={`url(#goldBase_${tier})`} stroke="#FFF" strokeWidth="1" />
            <circle cx="60" cy="56" r="3" fill={`url(#roofRuby_${tier})`} />
          </g>
        )}
      </svg>

      {/* Floating Level Tag */}
      <div className="absolute -bottom-2 bg-gradient-to-r from-[#C89228] via-[#F5D061] to-[#7E4F0B] text-[#2A1B0A] font-black text-[9px] px-2 py-0.5 rounded-full border border-white shadow-md font-mono flex items-center gap-0.5">
        <span>Lv.{level}</span>
      </div>
    </div>
  );
};
