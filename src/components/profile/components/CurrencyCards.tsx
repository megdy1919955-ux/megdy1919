import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft } from 'lucide-react';
import { RoyalThemeStyles } from '../ProfileThemeConfig';
import { TCoin3DIcon, Diamond3DIcon } from '../RealisticIcons';

export interface CurrencyCardsProps {
  coinsBalance: number;
  diamondsBalance: number;
  curRoyal: RoyalThemeStyles;
  onOpenRecharge: () => void;
}

export const CurrencyCards: React.FC<CurrencyCardsProps> = ({
  coinsBalance,
  diamondsBalance,
  curRoyal,
  onOpenRecharge
}) => {
  return (
    <div className="grid grid-cols-2 gap-3" dir="rtl">
      {/* Recharge / Coins Card (Appears on the RIGHT in RTL) */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.96 }}
        onClick={onOpenRecharge}
        className={`relative p-[2px] rounded-2xl ${curRoyal.outerBorder} ${curRoyal.shadow} transition-all duration-300 cursor-pointer group w-full`}
      >
        <div className={`${curRoyal.innerBg} rounded-[14px] p-2.5 sm:p-3 flex flex-col justify-between h-full border ${curRoyal.innerBorder} group-hover:bg-white/90 transition-all duration-300`}>
          {/* Top Header: T-Coin Icon + Label & Arrow */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 min-w-0">
              <TCoin3DIcon className="w-5 h-5 shrink-0" />
              <span className={`text-xs font-black ${curRoyal.coinsText} transition-colors`}>
                الكوينز (المحفظة)
              </span>
            </div>
            <ChevronLeft className={`w-4 h-4 ${curRoyal.chevron} group-hover:-translate-x-0.5 transition-transform shrink-0`} />
          </div>
          {/* Numbers taking full natural width */}
          <div className={`text-lg sm:text-xl font-black ${curRoyal.coinsText} font-mono leading-tight tracking-tight mt-1.5 drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)] truncate`}>
            {coinsBalance.toLocaleString('en-US')}
          </div>
        </div>
      </motion.div>

      {/* Diamonds Card (Appears on the LEFT in RTL) */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.96 }}
        onClick={onOpenRecharge}
        className={`relative p-[2px] rounded-2xl ${curRoyal.outerBorder} ${curRoyal.shadow} transition-all duration-300 cursor-pointer group w-full`}
      >
        <div className={`${curRoyal.innerBg} rounded-[14px] p-2.5 sm:p-3 flex flex-col justify-between h-full border ${curRoyal.innerBorder} group-hover:bg-white/90 transition-all duration-300`}>
          {/* Top Header: Diamond Icon + Label & Arrow */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 min-w-0">
              <Diamond3DIcon className="w-5 h-5 shrink-0" />
              <span className={`text-xs font-black ${curRoyal.diamondsText} transition-colors`}>
                الماسة
              </span>
            </div>
            <ChevronLeft className={`w-4 h-4 ${curRoyal.diamondsText} group-hover:-translate-x-0.5 transition-transform shrink-0`} />
          </div>
          {/* Numbers taking full natural width */}
          <div className={`text-lg sm:text-xl font-black ${curRoyal.diamondsText} font-mono leading-tight tracking-tight mt-1.5 drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)] truncate`}>
            {diamondsBalance.toLocaleString('en-US')}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CurrencyCards;
