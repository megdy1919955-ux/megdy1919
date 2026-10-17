import React from 'react';
import { RoyalThemeStyles } from '../ProfileThemeConfig';
import { TCoin3DIcon, Diamond3DIcon } from '../RealisticIcons';

export interface CurrencyCardsProps {
  coinsBalance: number;
  diamondsBalance: number;
  curRoyal: RoyalThemeStyles;
  onOpenRecharge?: () => void;
}

export const CurrencyCards: React.FC<CurrencyCardsProps> = ({
  coinsBalance,
  diamondsBalance,
  curRoyal
}) => {
  return (
    <div className="grid grid-cols-2 gap-3" dir="rtl">
      {/* Recharge / Coins Card (Appears on the RIGHT in RTL) - READ-ONLY */}
      <div
        className={`relative p-[2px] rounded-2xl ${curRoyal.outerBorder} ${curRoyal.shadow} transition-all duration-300 select-none w-full`}
      >
        <div className={`${curRoyal.innerBg} rounded-[14px] p-2.5 sm:p-3 flex flex-col justify-between h-full border ${curRoyal.innerBorder} transition-all duration-300`}>
          {/* Top Header: T-Coin Icon + Label */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 min-w-0">
              <TCoin3DIcon className="w-5 h-5 shrink-0" />
              <span className={`text-xs font-black ${curRoyal.coinsText} transition-colors`}>
                الكوينز (المحفظة)
              </span>
            </div>
          </div>
          {/* Numbers taking full natural width */}
          <div className={`text-lg sm:text-xl font-black ${curRoyal.coinsText} font-mono leading-tight tracking-tight mt-1.5 drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)] truncate`}>
            {coinsBalance.toLocaleString('en-US')}
          </div>
        </div>
      </div>

      {/* Diamonds Card (Appears on the LEFT in RTL) - READ-ONLY */}
      <div
        className={`relative p-[2px] rounded-2xl ${curRoyal.outerBorder} ${curRoyal.shadow} transition-all duration-300 select-none w-full`}
      >
        <div className={`${curRoyal.innerBg} rounded-[14px] p-2.5 sm:p-3 flex flex-col justify-between h-full border ${curRoyal.innerBorder} transition-all duration-300`}>
          {/* Top Header: Diamond Icon + Label */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 min-w-0">
              <Diamond3DIcon className="w-5 h-5 shrink-0" />
              <span className={`text-xs font-black ${curRoyal.diamondsText} transition-colors`}>
                الماسة
              </span>
            </div>
          </div>
          {/* Numbers taking full natural width */}
          <div className={`text-lg sm:text-xl font-black ${curRoyal.diamondsText} font-mono leading-tight tracking-tight mt-1.5 drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)] truncate`}>
            {diamondsBalance.toLocaleString('en-US')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyCards;
