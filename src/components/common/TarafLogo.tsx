import React from 'react';

interface TarafLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  withRing?: boolean;
}

/**
 * Official Taraf Chat (ترف شات) Emblem & Logo
 * Faithfully recreated from the official royal gold & champagne luxury emblem.
 */
export const TarafLogo: React.FC<TarafLogoProps> = ({
  className = '',
  size = 'md',
  showText = false,
  withRing = true
}) => {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
    xl: 'w-28 h-28'
  };

  return (
    <div className={`inline-flex flex-col items-center justify-center ${className}`}>
      <svg
        className={`${sizeMap[size]} drop-shadow-[0_4px_12px_rgba(180,140,60,0.25)] select-none`}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle Warm Off-White / Cream Background Glow */}
          <radialGradient id="tarafBg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="85%" stopColor="#F9F6F0" />
            <stop offset="100%" stopColor="#EFE8DA" />
          </radialGradient>

          {/* 3D Gold Gradient for Arabic Calligraphy & Serif Latin TARAF */}
          <linearGradient id="tarafGoldMain" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#DFC386" />
            <stop offset="25%" stopColor="#C59A4E" />
            <stop offset="50%" stopColor="#EAD39B" />
            <stop offset="75%" stopColor="#A8792A" />
            <stop offset="100%" stopColor="#755013" />
          </linearGradient>

          {/* Outer Ring Gold Foil */}
          <linearGradient id="tarafRingGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EAD7A6" />
            <stop offset="35%" stopColor="#CAA053" />
            <stop offset="70%" stopColor="#E1C688" />
            <stop offset="100%" stopColor="#8A601A" />
          </linearGradient>

          {/* Shadow Filter for 3D Bevel depth */}
          <filter id="tarafGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#6B4912" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Outer Circular Disk Container */}
        <circle cx="100" cy="100" r="96" fill="url(#tarafBg)" />

        {/* Outer Refined Thin Gold Ring */}
        {withRing && (
          <circle
            cx="100"
            cy="100"
            r="94"
            stroke="url(#tarafRingGold)"
            strokeWidth="1.8"
            opacity="0.9"
          />
        )}

        {/* Inner Calligraphy "ترف" (3D Sculpted Arabic Typography) */}
        <g filter="url(#tarafGlow)">
          {/* Main sweeping swoosh of letter Ra/Fa (ر / ف) */}
          <path
            d="M 62 108 
               C 56 122, 66 138, 92 138 
               C 114 138, 134 126, 142 104 
               C 145 95, 145 78, 142 66
               C 139 52, 126 44, 114 45
               C 99 47, 88 59, 87 74
               C 86 89, 97 101, 112 101
               C 126 101, 137 92, 140 78
               C 138 78, 132 88, 116 88
               C 104 88, 98 80, 99 71
               C 100 62, 107 55, 116 55
               C 126 55, 133 62, 134 72
               C 135 88, 123 118, 106 126
               C 92 133, 76 130, 70 120
               C 66 114, 66 109, 68 102
               Z"
            fill="url(#tarafGoldMain)"
          />

          {/* Letter Ta (ت) and sweeping upper curve */}
          <path
            d="M 125 45
               C 135 41, 148 44, 154 52
               C 158 57, 159 66, 159 78
               C 159 95, 154 114, 144 126
               C 137 134, 128 140, 118 144
               C 126 138, 134 130, 139 120
               C 146 106, 148 90, 148 76
               C 148 68, 146 62, 142 58
               C 137 53, 130 51, 122 53
               Z"
            fill="url(#tarafGoldMain)"
          />

          {/* Lower Tail Hook of Taraf */}
          <path
            d="M 64 100
               C 62 108, 62 118, 68 126
               C 74 134, 86 139, 102 139
               C 114 139, 125 135, 132 129
               C 122 135, 108 137, 98 135
               C 84 133, 75 127, 72 118
               C 69 110, 69 104, 70 98
               Z"
            fill="url(#tarafGoldMain)"
          />

          {/* Upper Diamond Dot for (ف) */}
          <polygon
            points="95,48 100,43 105,48 100,53"
            fill="url(#tarafGoldMain)"
          />

          {/* Two Diamond Dots for (ت) */}
          <polygon
            points="142,60 146,56 150,60 146,64"
            fill="url(#tarafGoldMain)"
          />
          <polygon
            points="152,65 156,61 160,65 156,69"
            fill="url(#tarafGoldMain)"
          />
        </g>

        {/* Latin Typography: "T A R A F" in Regal Serif Lettering */}
        <text
          x="100"
          y="172"
          textAnchor="middle"
          fill="url(#tarafGoldMain)"
          fontFamily="'Cinzel', 'Times New Roman', 'Playfair Display', 'Tajawal', serif"
          fontSize="22"
          fontWeight="600"
          letterSpacing="8"
          style={{ textTransform: 'uppercase' }}
        >
          TARAF
        </text>
      </svg>

      {showText && (
        <div className="mt-1.5 text-center">
          <span className="block text-xs font-black text-[#5C3F13] tracking-wide">
            ترف شات
          </span>
          <span className="block text-[9px] font-bold text-[#A89478] tracking-widest font-mono">
            TARAF CHAT
          </span>
        </div>
      )}
    </div>
  );
};
export default TarafLogo;
