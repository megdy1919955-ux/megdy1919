import React from 'react';

interface NajmLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showText?: boolean;
  withRing?: boolean;
}

/**
 * Official Al-Najm (النجم) Emblem & Logo
 * Uses the official user-authorized cosmic gold & electric blue star emblem.
 */
export const NajmLogo: React.FC<NajmLogoProps> = ({
  className = '',
  size = 'md',
  showText = false,
  withRing = true
}) => {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
    xl: 'w-28 h-28',
    '2xl': 'w-36 h-36'
  };

  return (
    <div className={`inline-flex flex-col items-center justify-center ${className}`}>
      <div className={`relative ${sizeMap[size]} rounded-full overflow-hidden shrink-0 select-none shadow-[0_4px_20px_rgba(212,175,55,0.35)] ${
        withRing ? 'ring-2 ring-[#D4AF37]/80' : ''
      }`}>
        <img
          src="/al_najm_logo.png"
          alt="شعار النجم الرسمي"
          className="w-full h-full object-cover"
          loading="eager"
        />
      </div>

      {showText && (
        <div className="mt-1.5 text-center">
          <span className="block text-sm font-black text-[#5C3F13] tracking-wide">
            النجم
          </span>
          <span className="block text-[9px] font-bold text-[#A89478] tracking-widest font-mono">
            AL-NAJM LIVE
          </span>
        </div>
      )}
    </div>
  );
};

export const TarafLogo = NajmLogo;
export default NajmLogo;
