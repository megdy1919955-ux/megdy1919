import React from 'react';

/**
 * Super Legend Luxury 3D Realistic Icons
 * Styled in warm royal gold, champagne, and frosted crystal matching the Broadcaster Center aesthetics.
 */

// 1. مستوى المستخدم (User Level 3D Icon - Royal Gold Star, Wings & Crystal Medallion)
export const UserLevel3DIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={`${className} drop-shadow-[0_4px_6px_rgba(180,140,60,0.35)]`} viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="lvlGoldGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFF4C2" />
        <stop offset="30%" stopColor="#F5D061" />
        <stop offset="70%" stopColor="#C89228" />
        <stop offset="100%" stopColor="#7E4F0B" />
      </linearGradient>
      <linearGradient id="lvlRubyCore" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FF6B8B" />
        <stop offset="50%" stopColor="#D92048" />
        <stop offset="100%" stopColor="#8A0C27" />
      </linearGradient>
      <radialGradient id="lvlSparkle" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#F5D061" stopOpacity="0" />
      </radialGradient>
    </defs>
    {/* Outer Golden Laurel / Wings */}
    <path d="M10 28C6 22 8 14 14 10C13 14 15 18 19 20C15 22 12 25 10 28Z" fill="url(#lvlGoldGrad)" opacity="0.9" />
    <path d="M38 28C42 22 40 14 34 10C35 14 33 18 29 20C33 22 36 25 38 28Z" fill="url(#lvlGoldGrad)" opacity="0.9" />
    {/* Central Royal Medallion Base */}
    <circle cx="24" cy="24" r="15" fill="url(#lvlGoldGrad)" stroke="#FFF8E0" strokeWidth="1.2" />
    <circle cx="24" cy="24" r="12" fill="#2A1B0A" stroke="#E2B755" strokeWidth="1" />
    {/* Inner Ruby Gem Facet */}
    <circle cx="24" cy="24" r="9.5" fill="url(#lvlRubyCore)" />
    {/* 3D 5-Pointed Star Highlight */}
    <path d="M24 16.5L26.3 21.2L31.5 22L27.7 25.6L28.6 30.8L24 28.4L19.4 30.8L20.3 25.6L16.5 22L21.7 21.2L24 16.5Z" fill="#FFF4C2" stroke="#B38022" strokeWidth="0.8" />
    {/* Top Glint */}
    <circle cx="21" cy="20" r="1.5" fill="white" opacity="0.9" />
  </svg>
);

// 2. الشارات (Badges 3D Icon - Royal Gold Trophy Medal with Gemstone & Golden Ribbons)
export const Badges3DIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={`${className} drop-shadow-[0_4px_6px_rgba(180,140,60,0.35)]`} viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="bdgGoldGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFF9D6" />
        <stop offset="35%" stopColor="#F5D061" />
        <stop offset="70%" stopColor="#C89228" />
        <stop offset="100%" stopColor="#7E4F0B" />
      </linearGradient>
      <linearGradient id="bdgRibbon" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#D92048" />
        <stop offset="100%" stopColor="#7A0C22" />
      </linearGradient>
      <linearGradient id="bdgSapphire" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#6EE7B7" />
        <stop offset="50%" stopColor="#059669" />
        <stop offset="100%" stopColor="#064E3B" />
      </linearGradient>
    </defs>
    {/* Dual Hanging Ribbons */}
    <path d="M18 24L12 40L20 36L22 24H18Z" fill="url(#bdgRibbon)" />
    <path d="M30 24L36 40L28 36L26 24H30Z" fill="url(#bdgRibbon)" />
    {/* Outer Golden Sunburst Crest */}
    <circle cx="24" cy="20" r="14" fill="url(#bdgGoldGrad)" stroke="#FFF8E0" strokeWidth="1.2" />
    <circle cx="24" cy="20" r="11" fill="#FAF5E8" stroke="#B38022" strokeWidth="1" />
    {/* Inner Royal Emerald / Sapphire Shield Jewel */}
    <path d="M24 13L30 17V23C30 27 24 30 24 30C24 30 18 27 18 23V17L24 13Z" fill="url(#bdgSapphire)" stroke="#FFF" strokeWidth="0.8" />
    {/* Mini Gold Crown inside Jewel */}
    <path d="M21 21L22.5 19L24 21L25.5 19L27 21V23H21V21Z" fill="#FFF2B8" />
    <circle cx="24" cy="18" r="1" fill="#FFF" />
  </svg>
);

// 3. العائلات (Families 3D Icon - Imperial Gold Castle & Twin Wings Shield)
export const Families3DIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={`${className} drop-shadow-[0_4px_6px_rgba(180,140,60,0.35)]`} viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="famGoldGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFF9D6" />
        <stop offset="35%" stopColor="#F5D061" />
        <stop offset="70%" stopColor="#C89228" />
        <stop offset="100%" stopColor="#7E4F0B" />
      </linearGradient>
      <linearGradient id="famShieldInner" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#3B2610" />
        <stop offset="100%" stopColor="#1E1205" />
      </linearGradient>
    </defs>
    {/* Imperial Shield Body */}
    <path d="M24 6L38 12V24C38 34 24 42 24 42C24 42 10 34 10 24V12L24 6Z" fill="url(#famGoldGrad)" stroke="#FFF9E6" strokeWidth="1.5" />
    <path d="M24 9L35 14V23C35 31.5 24 38.5 24 38.5C24 38.5 13 31.5 13 23V14L24 9Z" fill="url(#famShieldInner)" stroke="#E2B755" strokeWidth="1" />
    {/* 3D Castle / Fort Crest */}
    <path d="M19 28H29V20H27V17H25V20H23V17H21V20H19V28Z" fill="url(#famGoldGrad)" />
    {/* Castle Arch Door */}
    <path d="M22 28V24C22 23 23 22 24 22C25 22 26 23 26 24V28H22Z" fill="#1E1205" />
    {/* Royal Top Crown on Shield */}
    <path d="M19 13L21.5 10.5L24 13L26.5 10.5L29 13V15H19V13Z" fill="#FFF2B8" />
  </svg>
);

// 4. مظهري (My Looks 3D Icon - Luxury Vanity Wardrobe & Diamond Tiara)
export const Appearance3DIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={`${className} drop-shadow-[0_4px_6px_rgba(180,140,60,0.35)]`} viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="appGoldGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFF9D6" />
        <stop offset="35%" stopColor="#F5D061" />
        <stop offset="70%" stopColor="#C89228" />
        <stop offset="100%" stopColor="#7E4F0B" />
      </linearGradient>
      <linearGradient id="appMirrorGlass" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#E0F2FE" />
        <stop offset="50%" stopColor="#BAE6FD" />
        <stop offset="100%" stopColor="#7DD3FC" />
      </linearGradient>
    </defs>
    {/* Ornate Golden Hand Mirror / Wardrobe Frame */}
    <ellipse cx="24" cy="20" rx="14" ry="15" fill="url(#appGoldGrad)" stroke="#FFF9E6" strokeWidth="1.2" />
    <ellipse cx="24" cy="20" rx="11" ry="12" fill="url(#appMirrorGlass)" stroke="#C89228" strokeWidth="1" />
    {/* Mirror Handle Base */}
    <path d="M22 34H26L27 42C27 43.5 25.5 45 24 45C22.5 45 21 43.5 21 42L22 34Z" fill="url(#appGoldGrad)" stroke="#7E4F0B" strokeWidth="0.8" />
    {/* Sparkling Diamond Tiara on Top */}
    <path d="M17 18L20 14L24 17L28 14L31 18H17Z" fill="url(#appGoldGrad)" />
    {/* Sparkling Shimmer Rays */}
    <circle cx="21" cy="17" r="1.5" fill="#FFF" />
    <line x1="16" y1="23" x2="21" y2="17" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
    <circle cx="32" cy="11" r="1.8" fill="#FFF5C2" />
  </svg>
);

// 5. مركز VIP (VIP Center 3D Icon - Ultra Clear Royal Crown & VIP Gold Badge)
export const VipCenter3DIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={`${className} drop-shadow-[0_4px_8px_rgba(180,140,60,0.4)]`} viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="vipGoldA" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFFEEB" />
        <stop offset="25%" stopColor="#FDE047" />
        <stop offset="60%" stopColor="#CA8A04" />
        <stop offset="100%" stopColor="#713F12" />
      </linearGradient>
      <linearGradient id="vipVelvetA" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#991B1B" />
        <stop offset="100%" stopColor="#450A0A" />
      </linearGradient>
      <linearGradient id="vipGemBlue" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#E0F2FE" />
        <stop offset="50%" stopColor="#38BDF8" />
        <stop offset="100%" stopColor="#0284C7" />
      </linearGradient>
    </defs>
    {/* Royal Red Velvet Cap behind Crown */}
    <path d="M12 28C12 18 16 13 24 13C32 13 36 18 36 28H12Z" fill="url(#vipVelvetA)" />
    {/* Crown Spikes Body */}
    <path d="M7 28L10 12L18 20L24 8L30 20L38 12L41 28H7Z" fill="url(#vipGoldA)" stroke="#FFFEEB" strokeWidth="1.2" strokeLinejoin="round" />
    {/* Crown Jewels on Spikes */}
    <circle cx="10" cy="11" r="2.5" fill="url(#vipGemBlue)" stroke="#FFF" strokeWidth="0.8" />
    <circle cx="24" cy="7" r="3.2" fill="url(#vipGemBlue)" stroke="#FFF" strokeWidth="0.8" />
    <circle cx="38" cy="11" r="2.5" fill="url(#vipGemBlue)" stroke="#FFF" strokeWidth="0.8" />
    {/* Crown Headband Base */}
    <rect x="6" y="28" width="36" height="8" rx="3" fill="url(#vipGoldA)" stroke="#FFFEEB" strokeWidth="1" />
    {/* Embossed VIP Badge on Base */}
    <rect x="15" y="29.5" width="18" height="5" rx="1.5" fill="#450A0A" />
    <text x="24" y="33.8" textAnchor="middle" fill="#FEF08A" fontSize="4.5" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.5">VIP</text>
    {/* Diamond Glints */}
    <circle cx="9" cy="32" r="1.5" fill="url(#vipGemBlue)" stroke="#FFF" strokeWidth="0.5" />
    <circle cx="39" cy="32" r="1.5" fill="url(#vipGemBlue)" stroke="#FFF" strokeWidth="0.5" />
  </svg>
);

// 6. النقاط الودية (Friendly Points 3D Icon - Glowing Royal Heart with Angel Wings & Star Sparkles)
export const FriendlyPoints3DIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={`${className} drop-shadow-[0_4px_8px_rgba(220,50,90,0.35)]`} viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="fpGoldA" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFFEEB" />
        <stop offset="30%" stopColor="#FDE047" />
        <stop offset="70%" stopColor="#CA8A04" />
        <stop offset="100%" stopColor="#713F12" />
      </linearGradient>
      <linearGradient id="fpRubyA" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FF4D6D" />
        <stop offset="40%" stopColor="#E11D48" />
        <stop offset="100%" stopColor="#881337" />
      </linearGradient>
    </defs>
    {/* Golden Angel Wings Behind */}
    <path d="M12 24C6 19 8 10 16 7C14 11 16 16 20 18C15 19 12 21 12 24Z" fill="url(#fpGoldA)" opacity="0.95" />
    <path d="M36 24C42 19 40 10 32 7C34 11 32 16 28 18C33 19 36 21 36 24Z" fill="url(#fpGoldA)" opacity="0.95" />
    {/* Outer 3D Gold Heart Border */}
    <path d="M24 39C24 39 8 28 8 17.5C8 11.5 12.5 7 18.5 7C22 7 23.5 9 24 10.5C24.5 9 26 7 29.5 7C35.5 7 40 11.5 40 17.5C40 28 24 39 24 39Z" fill="url(#fpGoldA)" stroke="#FFFEEB" strokeWidth="1" />
    {/* 3D Ruby Gem Heart */}
    <path d="M24 35.5C24 35.5 11 26 11 17.5C11 13 14.5 9.5 19 9.5C22 9.5 23.3 11 24 12.2C24.7 11 26 9.5 29 9.5C33.5 9.5 37 13 37 17.5C37 26 24 35.5 24 35.5Z" fill="url(#fpRubyA)" stroke="#FFAEC0" strokeWidth="0.8" />
    {/* Star Sparkle on Corner */}
    <circle cx="17" cy="15" r="2" fill="#FFF" opacity="0.9" />
    <path d="M34 9L35 6L36 9L39 10L36 11L35 14L34 11L31 10L34 9Z" fill="url(#fpGoldA)" />
  </svg>
);

// 7. بطاقات الدعوة (Invitation Cards 3D Icon - Luxury Gold VIP Pass Ticket with Star Ribbon)
export const InviteCard3DIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={`${className} drop-shadow-[0_4px_8px_rgba(180,140,60,0.35)]`} viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="ticketGoldA" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFFEEB" />
        <stop offset="30%" stopColor="#FDE047" />
        <stop offset="70%" stopColor="#CA8A04" />
        <stop offset="100%" stopColor="#713F12" />
      </linearGradient>
      <linearGradient id="ticketDark" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#2E1B0E" />
        <stop offset="100%" stopColor="#150C05" />
      </linearGradient>
    </defs>
    {/* Angled Golden Pass Ticket */}
    <rect x="6" y="11" width="36" height="26" rx="4" fill="url(#ticketGoldA)" stroke="#FFFEEB" strokeWidth="1.2" />
    <rect x="8" y="13" width="32" height="22" rx="3" fill="url(#ticketDark)" />
    {/* Ticket Cutout Notches */}
    <circle cx="6" cy="24" r="3.5" fill="#FAF5E8" />
    <circle cx="42" cy="24" r="3.5" fill="#FAF5E8" />
    {/* Perforated Divider Line */}
    <line x1="17" y1="14" x2="17" y2="34" stroke="url(#ticketGoldA)" strokeWidth="1.5" strokeDasharray="2 2" />
    {/* Star Medal Badge on Left */}
    <circle cx="12" cy="24" r="3" fill="url(#ticketGoldA)" />
    <path d="M12 21.5L13 23.5L15 23.8L13.5 25.2L14 27.2L12 26.2L10 27.2L10.5 25.2L9 23.8L11 23.5L12 21.5Z" fill="#2E1B0E" />
    {/* VIP Golden Text & Bar Lines on Right */}
    <text x="28" y="21" textAnchor="middle" fill="#FEF08A" fontSize="6.5" fontWeight="900" fontFamily="sans-serif">VIP</text>
    <rect x="20" y="25" width="16" height="1.8" rx="0.9" fill="url(#ticketGoldA)" />
    <rect x="23" y="29" width="10" height="1.5" rx="0.75" fill="url(#ticketGoldA)" opacity="0.8" />
  </svg>
);

// 8. المركز التجاري (Mall 3D Icon - Luxury Golden Shopping Bag with Gifts & Gems)
export const Mall3DIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={`${className} drop-shadow-[0_4px_8px_rgba(180,140,60,0.35)]`} viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="mallGoldA" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFFEEB" />
        <stop offset="30%" stopColor="#FDE047" />
        <stop offset="70%" stopColor="#CA8A04" />
        <stop offset="100%" stopColor="#713F12" />
      </linearGradient>
      <linearGradient id="giftRed" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FF4D6D" />
        <stop offset="100%" stopColor="#9F1239" />
      </linearGradient>
    </defs>
    {/* Handles */}
    <path d="M18 16V10C18 6.7 20.7 4 24 4C27.3 4 30 6.7 30 10V16" stroke="url(#mallGoldA)" strokeWidth="3" strokeLinecap="round" />
    {/* Luxury Golden Bag Body */}
    <path d="M9 15L12 41C12 42.5 13.5 43.5 15.5 43.5H32.5C34.5 43.5 36 42.5 36 41L39 15H9Z" fill="url(#mallGoldA)" stroke="#FFFEEB" strokeWidth="1.2" />
    {/* Diamond Quilted Center */}
    <path d="M14 27L24 17L34 27L24 37L14 27Z" fill="#FAF5E8" stroke="#CA8A04" strokeWidth="1" />
    {/* Red Ribbon Gift Bow in Center */}
    <circle cx="24" cy="27" r="3.5" fill="url(#giftRed)" stroke="#FFF" strokeWidth="0.8" />
    <circle cx="24" cy="27" r="1.2" fill="#FFFEEB" />
    {/* Sparkling Shimmer */}
    <path d="M11 20L13 38" stroke="#FFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
  </svg>
);

// 9. مركز الدعوة (Invite Center 3D Icon - Golden Megaphone Broadcasting Gold Coins)
export const InviteCenter3DIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={`${className} drop-shadow-[0_4px_8px_rgba(180,140,60,0.35)]`} viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="invGoldA" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFFEEB" />
        <stop offset="30%" stopColor="#FDE047" />
        <stop offset="70%" stopColor="#CA8A04" />
        <stop offset="100%" stopColor="#713F12" />
      </linearGradient>
      <linearGradient id="coinGold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFFBE6" />
        <stop offset="50%" stopColor="#FACC15" />
        <stop offset="100%" stopColor="#A16207" />
      </linearGradient>
    </defs>
    {/* Megaphone Cone Body */}
    <path d="M10 20L26 12V32L10 24V20Z" fill="url(#invGoldA)" stroke="#FFFEEB" strokeWidth="1.2" />
    {/* Megaphone Speaker Bell */}
    <ellipse cx="26" cy="22" rx="4" ry="10" fill="#2E1B0E" stroke="url(#invGoldA)" strokeWidth="1.5" />
    {/* Broadcast Sound Waves */}
    <path d="M32 16C34.5 19.5 34.5 24.5 32 28" stroke="url(#invGoldA)" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M37 12C41.5 18 41.5 26 37 32" stroke="url(#invGoldA)" strokeWidth="2.5" strokeLinecap="round" />
    {/* Megaphone Handle */}
    <path d="M13 23L11 34C10.5 35.5 11.5 37 13 37H16C17.2 37 18 36 18.5 34.8L20 22" fill="url(#invGoldA)" stroke="#713F12" strokeWidth="0.8" />
    {/* Floating Gold Coin with + Sign */}
    <circle cx="36" cy="10" r="4.5" fill="url(#coinGold)" stroke="#FFF" strokeWidth="0.8" />
    <text x="36" y="12.5" textAnchor="middle" fill="#5C3F13" fontSize="6" fontWeight="900" fontFamily="sans-serif">+</text>
  </svg>
);

// 10. جينيس (Genius / Guinness 3D Icon - Majestic Golden Trophy Cup with Star & Laurel of Records)
export const Genius3DIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={`${className} drop-shadow-[0_4px_8px_rgba(180,140,60,0.4)]`} viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="trophyGoldA" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFFEEB" />
        <stop offset="30%" stopColor="#FDE047" />
        <stop offset="70%" stopColor="#CA8A04" />
        <stop offset="100%" stopColor="#713F12" />
      </linearGradient>
      <linearGradient id="trophyGem" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#67E8F9" />
        <stop offset="100%" stopColor="#0E7490" />
      </linearGradient>
    </defs>
    {/* Trophy Cup Side Handles */}
    <path d="M12 14H8C6 14 5 16 5 18C5 23 9 26 14 26H16" stroke="url(#trophyGoldA)" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M36 14H40C42 14 43 16 43 18C43 23 39 26 34 26H32" stroke="url(#trophyGoldA)" strokeWidth="2.5" strokeLinecap="round" />
    {/* Trophy Main Goblet */}
    <path d="M12 10H36V20C36 27 30.5 31 24 31C17.5 31 12 27 12 20V10Z" fill="url(#trophyGoldA)" stroke="#FFFEEB" strokeWidth="1.2" />
    {/* Trophy Stem & Tiered Base */}
    <path d="M22 31V37H26V31" fill="url(#trophyGoldA)" />
    <path d="M14 37H34V42C34 43 33 44 32 44H16C15 44 14 43 14 42V37Z" fill="url(#trophyGoldA)" stroke="#FFFEEB" strokeWidth="1" />
    {/* Big 3D Star & Laurel Emblem on Trophy Goblet */}
    <circle cx="24" cy="19" r="6" fill="#2E1B0E" stroke="url(#trophyGoldA)" strokeWidth="1" />
    <path d="M24 14.5L25.6 17.8L29.2 18.3L26.6 20.8L27.2 24.4L24 22.7L20.8 24.4L21.4 20.8L18.8 18.3L22.4 17.8L24 14.5Z" fill="url(#trophyGoldA)" stroke="#FFF" strokeWidth="0.5" />
    {/* Crown on Top */}
    <path d="M19 8L21.5 5L24 8L26.5 5L29 8H19Z" fill="url(#trophyGoldA)" />
  </svg>
);

// 11. الزوار (Visitors 3D Icon - Royal Golden Eye of Horus / Crystal Lens with Aura & Sparkles)
export const Visitors3DIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={`${className} drop-shadow-[0_4px_6px_rgba(180,140,60,0.35)]`} viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="visGold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFF9D6" />
        <stop offset="35%" stopColor="#F5D061" />
        <stop offset="70%" stopColor="#C89228" />
        <stop offset="100%" stopColor="#7E4F0B" />
      </linearGradient>
      <linearGradient id="visIris" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#38BDF8" />
        <stop offset="50%" stopColor="#0284C7" />
        <stop offset="100%" stopColor="#0369A1" />
      </linearGradient>
      <linearGradient id="visPupil" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1E293B" />
        <stop offset="100%" stopColor="#0F172A" />
      </linearGradient>
    </defs>
    {/* Outer Golden Aura Rays */}
    <path d="M24 6L25 10L27 7L26 11" stroke="url(#visGold)" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M24 42L25 38L27 41L26 37" stroke="url(#visGold)" strokeWidth="1.2" strokeLinecap="round" />
    {/* Eye Outer Golden Almond Frame */}
    <path d="M6 24C6 24 13 12 24 12C35 12 42 24 42 24C42 24 35 36 24 36C13 36 6 24 6 24Z" fill="#FFFDF8" stroke="url(#visGold)" strokeWidth="2.5" />
    {/* Golden Sclera Border */}
    <circle cx="24" cy="24" r="10" fill="url(#visGold)" stroke="#FFF8E0" strokeWidth="1" />
    {/* Sapphire / Cyan Crystal Iris */}
    <circle cx="24" cy="24" r="7.5" fill="url(#visIris)" />
    {/* Deep Pupil */}
    <circle cx="24" cy="24" r="4" fill="url(#visPupil)" />
    {/* 3D Highlight Glints */}
    <circle cx="22" cy="21.5" r="2" fill="#FFFFFF" />
    <circle cx="26.5" cy="26" r="0.9" fill="#FFFFFF" opacity="0.8" />
    {/* Sparkle on Top-Right Corner */}
    <path d="M37 15L38 12L39 15L42 16L39 17L38 20L37 17L34 16L37 15Z" fill="url(#visGold)" />
  </svg>
);

// 12. الأصدقاء (Friends 3D Icon - Twin Royal Golden Friendship Knights Shields & Crown)
export const Friends3DIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={`${className} drop-shadow-[0_4px_6px_rgba(180,140,60,0.35)]`} viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="frdGold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFF9D6" />
        <stop offset="35%" stopColor="#F5D061" />
        <stop offset="70%" stopColor="#C89228" />
        <stop offset="100%" stopColor="#7E4F0B" />
      </linearGradient>
      <linearGradient id="frdTeal" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#34D399" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
      <linearGradient id="frdPurple" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#A78BFA" />
        <stop offset="100%" stopColor="#6D28D9" />
      </linearGradient>
    </defs>
    {/* Left Friend Shield */}
    <path d="M16 12C16 12 24 10 24 10V32C24 38 16 41 16 41C16 41 8 38 8 32V12C8 12 16 12 16 12Z" fill="url(#frdGold)" stroke="#FFF9E0" strokeWidth="1" />
    <path d="M16 14C16 14 22 12.5 22 12.5V30.5C22 35 16 38 16 38C16 38 10 35 10 30.5V14L16 14Z" fill="url(#frdTeal)" />
    {/* Right Friend Shield */}
    <path d="M32 12C32 12 24 10 24 10V32C24 38 32 41 32 41C32 41 40 38 40 32V12C40 12 32 12 32 12Z" fill="url(#frdGold)" stroke="#FFF9E0" strokeWidth="1" />
    <path d="M32 14C32 14 26 12.5 26 12.5V30.5C26 35 32 38 32 38C32 38 38 35 38 30.5V14L32 14Z" fill="url(#frdPurple)" />
    {/* Golden Bonding Crest Crown in Center */}
    <path d="M20 10L24 6L28 10L26 13H22L20 10Z" fill="url(#frdGold)" stroke="#FFF" strokeWidth="0.8" />
    {/* Friendship Star in Center */}
    <circle cx="24" cy="22" r="5" fill="url(#frdGold)" stroke="#FFF" strokeWidth="1" />
    <path d="M24 18.5L25.2 21L27.8 21.3L25.8 23L26.3 25.5L24 24.2L21.7 25.5L22.2 23L20.2 21.3L22.8 21L24 18.5Z" fill="#FFFBE6" />
  </svg>
);

// 13. تمت المتابعة / المتابعون (Following 3D Icon - Royal Gold Star Medal with Checkmark & Angel Wings)
export const Following3DIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={`${className} drop-shadow-[0_4px_6px_rgba(180,140,60,0.35)]`} viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="folGold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFF9D6" />
        <stop offset="35%" stopColor="#F5D061" />
        <stop offset="70%" stopColor="#C89228" />
        <stop offset="100%" stopColor="#7E4F0B" />
      </linearGradient>
      <linearGradient id="folEmerald" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#10B981" />
        <stop offset="50%" stopColor="#059669" />
        <stop offset="100%" stopColor="#047857" />
      </linearGradient>
    </defs>
    {/* Angel Wings */}
    <path d="M12 28C6 24 8 16 14 12C13 16 15 20 18 22C15 24 13 26 12 28Z" fill="url(#folGold)" opacity="0.9" />
    <path d="M36 28C42 24 40 16 34 12C35 16 33 20 30 22C33 24 35 26 36 28Z" fill="url(#folGold)" opacity="0.9" />
    {/* Hanging Gold Ribbons */}
    <path d="M20 28L16 42L22 38L24 28H20Z" fill="url(#folGold)" />
    <path d="M28 28L32 42L26 38L24 28H28Z" fill="url(#folGold)" />
    {/* Outer Golden Scalloped Medallion */}
    <circle cx="24" cy="22" r="14" fill="url(#folGold)" stroke="#FFF9E0" strokeWidth="1.2" />
    {/* Inner Emerald Shield / Circle */}
    <circle cx="24" cy="22" r="10.5" fill="url(#folEmerald)" stroke="#FFF" strokeWidth="1" />
    {/* 3D Bold Golden Checkmark */}
    <path d="M19 22.5L22.5 26L29 18.5" stroke="#FFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M19 22.5L22.5 26L29 18.5" stroke="#FFF2B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    {/* Glint */}
    <circle cx="21" cy="16" r="1.5" fill="#FFF" />
  </svg>
);

// 14. المعجبين / الإعجابات (Likes 3D Icon - Imperial Gold & Radiant Ruby Heart Medallion)
export const Likes3DIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={`${className} drop-shadow-[0_4px_6px_rgba(180,140,60,0.35)]`} viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="likGold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFF9D6" />
        <stop offset="35%" stopColor="#F5D061" />
        <stop offset="70%" stopColor="#C89228" />
        <stop offset="100%" stopColor="#7E4F0B" />
      </linearGradient>
      <linearGradient id="likRuby" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FF4D6D" />
        <stop offset="40%" stopColor="#E60039" />
        <stop offset="80%" stopColor="#B3002D" />
        <stop offset="100%" stopColor="#660018" />
      </linearGradient>
    </defs>
    {/* Golden Laurel Wings Surrounding Heart */}
    <path d="M8 22C6 16 10 10 16 8C14 12 16 16 20 18C15 20 11 23 8 22Z" fill="url(#likGold)" opacity="0.85" />
    <path d="M40 22C42 16 38 10 32 8C34 12 32 16 28 18C33 20 37 23 40 22Z" fill="url(#likGold)" opacity="0.85" />
    {/* Outer Golden Heart Frame */}
    <path d="M24 40C24 40 8 29 8 18.5C8 12.5 12.5 8 18.5 8C21.8 8 23.5 10 24 11.5C24.5 10 26.2 8 29.5 8C35.5 8 40 12.5 40 18.5C40 29 24 40 24 40Z" fill="url(#likGold)" stroke="#FFF9E0" strokeWidth="1.2" />
    {/* Inner 3D Radiant Ruby Gem Heart */}
    <path d="M24 36.5C24 36.5 11 27 11 18.5C11 13.8 14.5 10.5 19 10.5C21.8 10.5 23.3 12 24 13.2C24.7 12 26.2 10.5 29 10.5C33.5 10.5 37 13.8 37 18.5C37 27 24 36.5 24 36.5Z" fill="url(#likRuby)" stroke="#FFB3C1" strokeWidth="1" />
    {/* Heart Facet 3D Highlights */}
    <path d="M14 15C13 18 14 22 17 25" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
    <circle cx="28" cy="14" r="1.5" fill="#FFF" />
    {/* Sparkle Glint on Top Right */}
    <path d="M35 8L36 5L37 8L40 9L37 10L36 13L35 10L32 9L35 8Z" fill="url(#likGold)" />
  </svg>
);

// 15. وكالتي / الوكلاء الرسميين (Official Agency 3D Icon - Royal Gold & Leather Briefcase with Crown Clasp)
export const OfficialAgency3DIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={`${className} drop-shadow-[0_4px_6px_rgba(180,140,60,0.35)]`} viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="oagGold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFF9D6" />
        <stop offset="35%" stopColor="#F5D061" />
        <stop offset="70%" stopColor="#C89228" />
        <stop offset="100%" stopColor="#7E4F0B" />
      </linearGradient>
      <linearGradient id="oagLeather" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#3B2610" />
        <stop offset="100%" stopColor="#1E1205" />
      </linearGradient>
      <linearGradient id="oagClasp" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFFBE6" />
        <stop offset="50%" stopColor="#F5D061" />
        <stop offset="100%" stopColor="#C89228" />
      </linearGradient>
    </defs>
    {/* Briefcase Handle */}
    <path d="M18 12V8C18 6.5 19.5 5 21 5H27C28.5 5 30 6.5 30 8V12" stroke="url(#oagGold)" strokeWidth="2.5" strokeLinecap="round" />
    {/* Briefcase Main Body */}
    <rect x="8" y="12" width="32" height="26" rx="4" fill="url(#oagGold)" stroke="#FFF9E0" strokeWidth="1.2" />
    <rect x="9.5" y="13.5" width="29" height="23" rx="3" fill="url(#oagLeather)" />
    {/* Top Flap */}
    <path d="M8 14H40V22L24 28L8 22V14Z" fill="url(#oagGold)" stroke="#FFF9E0" strokeWidth="1" />
    <path d="M9.5 15H38.5V21L24 26.5L9.5 21V15Z" fill="url(#oagLeather)" />
    {/* Golden Straps */}
    <rect x="14" y="12" width="3" height="26" rx="1" fill="url(#oagGold)" />
    <rect x="31" y="12" width="3" height="26" rx="1" fill="url(#oagGold)" />
    {/* Center Royal Gold Clasp / Crown Lock */}
    <circle cx="24" cy="26" r="4.5" fill="url(#oagClasp)" stroke="#FFF" strokeWidth="0.8" />
    <path d="M22 26L23 24.5L24 26L25 24.5L26 26V27.5H22V26Z" fill="#7E4F0B" />
    <circle cx="24" cy="24" r="0.8" fill="#FFF" />
  </svg>
);

// 16. إداري الوكالات (Agency Admin 3D Icon - Royal Golden Bank / Ministry Columns)
export const AgencyAdmin3DIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={`${className} drop-shadow-[0_4px_6px_rgba(180,140,60,0.35)]`} viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="admGold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFF9D6" />
        <stop offset="35%" stopColor="#F5D061" />
        <stop offset="70%" stopColor="#C89228" />
        <stop offset="100%" stopColor="#7E4F0B" />
      </linearGradient>
    </defs>
    {/* Pediment Triangle Roof */}
    <polygon points="24,6 6,17 42,17" fill="url(#admGold)" stroke="#FFF8E0" strokeWidth="1" />
    <circle cx="24" cy="12" r="2.5" fill="#3B2610" />
    {/* Architrave */}
    <rect x="8" y="17" width="32" height="3" fill="url(#admGold)" />
    {/* Pillars */}
    <rect x="11" y="20" width="4" height="18" fill="url(#admGold)" rx="1" />
    <rect x="19" y="20" width="4" height="18" fill="url(#admGold)" rx="1" />
    <rect x="25" y="20" width="4" height="18" fill="url(#admGold)" rx="1" />
    <rect x="33" y="20" width="4" height="18" fill="url(#admGold)" rx="1" />
    {/* Base Steps */}
    <rect x="8" y="38" width="32" height="3" fill="url(#admGold)" />
    <rect x="5" y="41" width="38" height="3" fill="url(#admGold)" rx="1" />
  </svg>
);

// 17. إداري الثيمات (Theme Admin 3D Icon - Royal Artist Palette & Gold Brush)
export const ThemeAdmin3DIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={`${className} drop-shadow-[0_4px_6px_rgba(180,140,60,0.35)]`} viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="thmGold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFF9D6" />
        <stop offset="35%" stopColor="#F5D061" />
        <stop offset="70%" stopColor="#C89228" />
        <stop offset="100%" stopColor="#7E4F0B" />
      </linearGradient>
    </defs>
    <path d="M24 6C13 6 6 13.5 6 23C6 31 12 36 17 36C19 36 20 34.5 20 33C20 31.5 19 30 19 28C19 25 21.5 23 25 23H29C35.5 23 42 18.5 42 12C42 8.5 34 6 24 6Z" fill="url(#thmGold)" stroke="#FFF9E0" strokeWidth="1.2" />
    <circle cx="14" cy="16" r="3" fill="#D946EF" stroke="#FFF" strokeWidth="0.8" />
    <circle cx="22" cy="12" r="3" fill="#3B82F6" stroke="#FFF" strokeWidth="0.8" />
    <circle cx="30" cy="14" r="3" fill="#10B981" stroke="#FFF" strokeWidth="0.8" />
    <circle cx="13" cy="27" r="3" fill="#F59E0B" stroke="#FFF" strokeWidth="0.8" />
    <circle cx="33" cy="33" r="4.5" fill="#FAF5E8" stroke="#B38022" strokeWidth="1" />
  </svg>
);

// 18. الوسيط المعتمد (Broker 3D Icon - Royal Golden Handshake & Agreement Seal)
export const Broker3DIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={`${className} drop-shadow-[0_4px_6px_rgba(180,140,60,0.35)]`} viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="brkGold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFF9D6" />
        <stop offset="35%" stopColor="#F5D061" />
        <stop offset="70%" stopColor="#C89228" />
        <stop offset="100%" stopColor="#7E4F0B" />
      </linearGradient>
    </defs>
    <circle cx="24" cy="24" r="17" fill="#FAF5E8" stroke="url(#brkGold)" strokeWidth="2" />
    <path d="M12 24L18 18L24 23L30 18L36 24L24 34L12 24Z" fill="url(#brkGold)" stroke="#FFF9E0" strokeWidth="1" />
    <circle cx="24" cy="23" r="3.5" fill="#10B981" stroke="#FFF" strokeWidth="0.8" />
  </svg>
);

// 19. المراقب العام (Moderator 3D Icon - Royal Imperial Guardian Shield & Golden Sword)
export const Moderator3DIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={`${className} drop-shadow-[0_4px_6px_rgba(180,140,60,0.35)]`} viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="modGold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFF9D6" />
        <stop offset="35%" stopColor="#F5D061" />
        <stop offset="70%" stopColor="#C89228" />
        <stop offset="100%" stopColor="#7E4F0B" />
      </linearGradient>
      <linearGradient id="modTeal" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#0D9488" />
        <stop offset="100%" stopColor="#115E59" />
      </linearGradient>
    </defs>
    <path d="M24 6L38 11V22C38 32 24 41 24 41C24 41 10 32 10 22V11L24 6Z" fill="url(#modGold)" stroke="#FFF9E0" strokeWidth="1.2" />
    <path d="M24 9L35 13V21.5C35 29.5 24 37.5 24 37.5C24 37.5 13 29.5 13 21.5V13L24 9Z" fill="url(#modTeal)" stroke="#F5D061" strokeWidth="0.8" />
    <path d="M24 14L28 20H20L24 14Z" fill="url(#modGold)" />
    <rect x="23" y="19" width="2" height="12" fill="#FFFBE6" />
  </svg>
);

// 20. عملة T الذهبية (T-Coin 3D Icon - Luxury Gold Coin with Embossed Letter T)
export const TCoin3DIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={`${className} drop-shadow-[0_2px_4px_rgba(180,140,40,0.4)]`} viewBox="0 0 32 32" fill="none">
    <defs>
      <linearGradient id="tCoinRim" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFFEEB" />
        <stop offset="25%" stopColor="#FDE047" />
        <stop offset="60%" stopColor="#CA8A04" />
        <stop offset="100%" stopColor="#713F12" />
      </linearGradient>
      <linearGradient id="tCoinInner" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="40%" stopColor="#EAB308" />
        <stop offset="100%" stopColor="#854D0E" />
      </linearGradient>
      <linearGradient id="tLetterGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="40%" stopColor="#FFFBEB" />
        <stop offset="100%" stopColor="#FDE68A" />
      </linearGradient>
    </defs>
    {/* Outer 3D Coin Edge */}
    <circle cx="16" cy="16" r="15" fill="url(#tCoinRim)" stroke="#FFFEEB" strokeWidth="0.8" />
    {/* Inner Recessed Face */}
    <circle cx="16" cy="16" r="12" fill="url(#tCoinInner)" stroke="#713F12" strokeWidth="0.6" />
    {/* Dotted Milling Ring */}
    <circle cx="16" cy="16" r="10.5" stroke="#FFFEEB" strokeWidth="0.6" strokeDasharray="1.2 1.2" opacity="0.75" />
    {/* 3D Embossed Letter T */}
    {/* Shadow of T */}
    <path d="M10 9H22V12.5H17.8V23H14.2V12.5H10V9Z" fill="#582C05" />
    {/* Main Face of T */}
    <path d="M9.5 8.5H21.5V11.8H17.3V22.5H13.7V11.8H9.5V8.5Z" fill="url(#tLetterGrad)" stroke="#78350F" strokeWidth="0.4" />
    {/* Top Glint */}
    <circle cx="11" cy="10" r="1.2" fill="#FFFFFF" opacity="0.9" />
  </svg>
);

// 21. الماسة ثلاثية الأبعاد (Diamond 3D Crystal Gem Icon)
export const Diamond3DIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={`${className} drop-shadow-[0_2px_5px_rgba(2,132,199,0.4)]`} viewBox="0 0 32 32" fill="none">
    <defs>
      <linearGradient id="dmTopFacet" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#BAE6FD" />
      </linearGradient>
      <linearGradient id="dmSideFacetL" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#E0F2FE" />
        <stop offset="100%" stopColor="#38BDF8" />
      </linearGradient>
      <linearGradient id="dmSideFacetR" x1="1" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#BAE6FD" />
        <stop offset="100%" stopColor="#0284C7" />
      </linearGradient>
      <linearGradient id="dmBottomL" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#0284C7" />
        <stop offset="100%" stopColor="#0369A1" />
      </linearGradient>
      <linearGradient id="dmBottomR" x1="1" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#38BDF8" />
        <stop offset="100%" stopColor="#0C4A6E" />
      </linearGradient>
      <linearGradient id="dmCenterFacet" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#E0F2FE" />
        <stop offset="50%" stopColor="#38BDF8" />
        <stop offset="100%" stopColor="#0284C7" />
      </linearGradient>
    </defs>
    {/* Crown (Top facets) */}
    <polygon points="10,6 22,6 27,12 5,12" fill="url(#dmSideFacetL)" stroke="#FFF" strokeWidth="0.5" />
    <polygon points="11,6 21,6 18,12 14,12" fill="url(#dmTopFacet)" stroke="#FFF" strokeWidth="0.5" />
    <polygon points="10,6 14,12 5,12" fill="url(#dmSideFacetL)" stroke="#FFF" strokeWidth="0.4" />
    <polygon points="22,6 27,12 18,12" fill="url(#dmSideFacetR)" stroke="#FFF" strokeWidth="0.4" />
    {/* Pavilion (Bottom facets) */}
    <polygon points="5,12 14,12 16,26" fill="url(#dmBottomL)" stroke="#FFF" strokeWidth="0.4" />
    <polygon points="14,12 18,12 16,26" fill="url(#dmCenterFacet)" stroke="#FFF" strokeWidth="0.5" />
    <polygon points="18,12 27,12 16,26" fill="url(#dmBottomR)" stroke="#FFF" strokeWidth="0.4" />
    {/* Sparkle glints */}
    <circle cx="12" cy="8" r="1.2" fill="#FFFFFF" opacity="0.95" />
    <circle cx="21" cy="14" r="0.8" fill="#FFFFFF" opacity="0.9" />
  </svg>
);


