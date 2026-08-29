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

// 5. مركز VIP (VIP Center 3D Icon - Imperial Gold Crown on Velvet Cushion)
export const VipCenter3DIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={`${className} drop-shadow-[0_4px_6px_rgba(180,140,60,0.35)]`} viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="vipGold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFFBE6" />
        <stop offset="30%" stopColor="#F7D46D" />
        <stop offset="70%" stopColor="#C99427" />
        <stop offset="100%" stopColor="#7D4E08" />
      </linearGradient>
      <linearGradient id="vipRuby" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FF4D6D" />
        <stop offset="100%" stopColor="#A00020" />
      </linearGradient>
    </defs>
    {/* Crown Base Band */}
    <path d="M8 32H40V36C40 37.5 38.5 39 36 39H12C9.5 39 8 37.5 8 36V32Z" fill="url(#vipGold)" stroke="#FFF" strokeWidth="0.8" />
    {/* Crown Spikes & Arches */}
    <path d="M8 32L12 18L20 25L24 12L28 25L36 18L40 32H8Z" fill="url(#vipGold)" stroke="#FFF9E0" strokeWidth="1" />
    {/* Gemstones on Spikes */}
    <circle cx="12" cy="17" r="2.5" fill="url(#vipRuby)" stroke="#FFF" strokeWidth="0.8" />
    <circle cx="24" cy="11" r="3.2" fill="url(#vipRuby)" stroke="#FFF" strokeWidth="1" />
    <circle cx="36" cy="17" r="2.5" fill="url(#vipRuby)" stroke="#FFF" strokeWidth="0.8" />
    {/* Headband Jewels */}
    <rect x="15" y="34" width="4" height="3" rx="1.5" fill="url(#vipRuby)" />
    <circle cx="24" cy="35.5" r="2" fill="#E0F2FE" />
    <rect x="29" y="34" width="4" height="3" rx="1.5" fill="url(#vipRuby)" />
  </svg>
);

// 6. النقاط الودية (Friendly Points 3D Icon - Glowing Golden Heart & Friendship Hands)
export const FriendlyPoints3DIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={`${className} drop-shadow-[0_4px_6px_rgba(180,140,60,0.35)]`} viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="fpGold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFF9D6" />
        <stop offset="35%" stopColor="#F5D061" />
        <stop offset="70%" stopColor="#C89228" />
        <stop offset="100%" stopColor="#7E4F0B" />
      </linearGradient>
      <linearGradient id="fpHeart" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FF758C" />
        <stop offset="50%" stopColor="#FF416C" />
        <stop offset="100%" stopColor="#C70039" />
      </linearGradient>
    </defs>
    {/* Outer Golden Friendship Aura Ring */}
    <circle cx="24" cy="24" r="16" fill="#FAF5E8" stroke="url(#fpGold)" strokeWidth="2" strokeDasharray="3 2" />
    {/* Central Glowing 3D Heart */}
    <path d="M24 33.5C24 33.5 12 25.5 12 18.5C12 14.5 15 11.5 19 11.5C21.5 11.5 23.5 13 24 14.5C24.5 13 26.5 11.5 29 11.5C33 11.5 36 14.5 36 18.5C36 25.5 24 33.5 24 33.5Z" fill="url(#fpHeart)" stroke="#FFF" strokeWidth="1.2" />
    {/* Shimmer on Heart */}
    <path d="M16 16C15 18 15.5 20.5 17 22" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
    {/* Golden Clasp Sparks */}
    <circle cx="24" cy="15" r="1.5" fill="#FFF" />
    <path d="M34 12L35 14L37 15L35 16L34 18L33 16L31 15L33 14L34 12Z" fill="url(#fpGold)" />
  </svg>
);

// 7. بطاقات الدعوة (Invitation Cards 3D Icon - Luxury Gold VIP Pass & Wax Seal)
export const InviteCard3DIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={`${className} drop-shadow-[0_4px_6px_rgba(180,140,60,0.35)]`} viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="cardGold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFF9D6" />
        <stop offset="35%" stopColor="#F5D061" />
        <stop offset="70%" stopColor="#C89228" />
        <stop offset="100%" stopColor="#7E4F0B" />
      </linearGradient>
      <linearGradient id="cardBg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#302213" />
        <stop offset="100%" stopColor="#191107" />
      </linearGradient>
      <linearGradient id="waxRed" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#E63946" />
        <stop offset="100%" stopColor="#9B111E" />
      </linearGradient>
    </defs>
    {/* Background Slanted Card */}
    <rect x="14" y="8" width="26" height="30" rx="4" transform="rotate(10 27 23)" fill="url(#cardGold)" opacity="0.6" />
    {/* Main Golden VIP Card */}
    <rect x="8" y="10" width="30" height="28" rx="4" fill="url(#cardBg)" stroke="url(#cardGold)" strokeWidth="1.5" />
    {/* Gold Filigree Card Lines */}
    <line x1="13" y1="16" x2="25" y2="16" stroke="url(#cardGold)" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="13" y1="21" x2="22" y2="21" stroke="url(#cardGold)" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
    {/* Red Royal Wax Seal */}
    <circle cx="30" cy="27" r="5" fill="url(#waxRed)" stroke="#FFF" strokeWidth="0.8" />
    <path d="M29 25L30 24L31 25L30.5 29H29.5L29 25Z" fill="#FFF" />
  </svg>
);

// 8. المركز التجاري (Mall 3D Icon - Luxury Gold Shopping Castle / Boutiques)
export const Mall3DIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={`${className} drop-shadow-[0_4px_6px_rgba(180,140,60,0.35)]`} viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="mallGold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFF9D6" />
        <stop offset="35%" stopColor="#F5D061" />
        <stop offset="70%" stopColor="#C89228" />
        <stop offset="100%" stopColor="#7E4F0B" />
      </linearGradient>
    </defs>
    {/* Luxury Golden Shopping Bag Body */}
    <path d="M10 16L13 39C13 41 14.5 42 16.5 42H31.5C33.5 42 35 41 35 39L38 16H10Z" fill="url(#mallGold)" stroke="#FFF8E0" strokeWidth="1.2" />
    {/* Bag Front Diamond Quilt Pattern */}
    <path d="M14 26L24 16L34 26L24 36L14 26Z" fill="#FAF5E8" stroke="#B38022" strokeWidth="1" />
    {/* Center Diamond Brooch */}
    <circle cx="24" cy="26" r="3" fill="#FFF" stroke="#B38022" strokeWidth="0.8" />
    <circle cx="24" cy="26" r="1.2" fill="#E2B755" />
    {/* Arch Handle with Gold Rings */}
    <path d="M18 18V12C18 8.5 20.5 6 24 6C27.5 6 30 8.5 30 12V18" stroke="url(#mallGold)" strokeWidth="3" strokeLinecap="round" />
    <circle cx="18" cy="18" r="2" fill="#7E4F0B" />
    <circle cx="30" cy="18" r="2" fill="#7E4F0B" />
  </svg>
);

// 9. مركز الدعوة (Invite Center 3D Icon - Golden Royal Megaphone & Reward Horn)
export const InviteCenter3DIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={`${className} drop-shadow-[0_4px_6px_rgba(180,140,60,0.35)]`} viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="invGold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFF9D6" />
        <stop offset="35%" stopColor="#F5D061" />
        <stop offset="70%" stopColor="#C89228" />
        <stop offset="100%" stopColor="#7E4F0B" />
      </linearGradient>
    </defs>
    {/* Golden Megaphone Cone */}
    <path d="M12 20L28 12V32L12 24V20Z" fill="url(#invGold)" stroke="#FFF9E0" strokeWidth="1.2" />
    {/* Speaker Horn Ring */}
    <ellipse cx="28" cy="22" rx="4" ry="10" fill="#2D1D0B" stroke="url(#invGold)" strokeWidth="1.5" />
    {/* Speaker Sound Waves / Burst Rays */}
    <path d="M34 16C36.5 19.5 36.5 24.5 34 28" stroke="url(#invGold)" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M39 12C43 18 43 26 39 32" stroke="url(#invGold)" strokeWidth="2.5" strokeLinecap="round" />
    {/* Megaphone Handle */}
    <path d="M14 24L11 34C10.5 35.5 12 37 13.5 37H16.5C17.5 37 18.5 36 19 35L20 23" fill="url(#invGold)" stroke="#7E4F0B" strokeWidth="0.8" />
    {/* Exploding Gold Coin Reward */}
    <circle cx="38" cy="10" r="3.5" fill="url(#invGold)" stroke="#FFF" strokeWidth="0.8" />
    <text x="36" y="12" fontSize="5" fontWeight="bold" fill="#5C3F13">$</text>
  </svg>
);

// 10. جينيس (Genius 3D Icon - Golden Wisdom Astrolabe / Orbiting Atom & Brain of Wonders)
export const Genius3DIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={`${className} drop-shadow-[0_4px_6px_rgba(180,140,60,0.35)]`} viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="genGold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFF9D6" />
        <stop offset="35%" stopColor="#F5D061" />
        <stop offset="70%" stopColor="#C89228" />
        <stop offset="100%" stopColor="#7E4F0B" />
      </linearGradient>
      <linearGradient id="genCore" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#E0F2FE" />
        <stop offset="50%" stopColor="#38BDF8" />
        <stop offset="100%" stopColor="#0284C7" />
      </linearGradient>
    </defs>
    {/* Outer Orbit Rings (Astrolabe style) */}
    <ellipse cx="24" cy="24" rx="16" ry="6" transform="rotate(-30 24 24)" stroke="url(#genGold)" strokeWidth="1.8" strokeLinecap="round" />
    <ellipse cx="24" cy="24" rx="16" ry="6" transform="rotate(30 24 24)" stroke="url(#genGold)" strokeWidth="1.8" strokeLinecap="round" />
    <ellipse cx="24" cy="24" rx="16" ry="6" transform="rotate(90 24 24)" stroke="url(#genGold)" strokeWidth="1.8" strokeLinecap="round" />
    {/* Glowing Center Crystal Nucleus */}
    <circle cx="24" cy="24" r="8" fill="url(#genGold)" stroke="#FFF9E0" strokeWidth="1.2" />
    <circle cx="24" cy="24" r="5.5" fill="url(#genCore)" stroke="#FFF" strokeWidth="0.8" />
    {/* Orbiting Golden Electrons */}
    <circle cx="12" cy="16" r="2" fill="url(#genGold)" stroke="#FFF" strokeWidth="0.5" />
    <circle cx="36" cy="32" r="2" fill="url(#genGold)" stroke="#FFF" strokeWidth="0.5" />
    <circle cx="34" cy="14" r="2" fill="url(#genGold)" stroke="#FFF" strokeWidth="0.5" />
    {/* Core Sparkle */}
    <circle cx="22" cy="22" r="1.5" fill="#FFF" />
  </svg>
);
