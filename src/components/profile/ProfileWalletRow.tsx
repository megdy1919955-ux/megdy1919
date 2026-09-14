import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ChevronLeft } from 'lucide-react';
import { TCoin3DIcon, Diamond3DIcon } from './RealisticIcons';
import { RoyalThemeStyles } from './ProfileThemeConfig';

interface ProfileWalletRowProps {
  coinsBalance: number;
  diamondsBalance: number;
  curRoyal: RoyalThemeStyles;
  onOpenRecharge: () => void;
  onOpenSuperLegend: () => void;
}

export const ProfileWalletRow: React.FC<ProfileWalletRowProps> = ({
  coinsBalance,
  diamondsBalance,
  curRoyal,
  onOpenRecharge,
  onOpenSuperLegend
}) => {
  return (
    <div className="relative space-y-3.5">
      {/* Dev Badge #2 */}
      <span className="absolute -top-2.5 left-2 z-50 w-6 h-6 rounded-full bg-amber-500 text-black font-black text-xs flex items-center justify-center shadow-lg border-2 border-white pointer-events-none select-none">
        #2
      </span>

      {/* Super Legend Banner */}
      <div
        onClick={onOpenSuperLegend}
        className="relative rounded-2xl bg-gradient-to-r from-[#2B2313] via-[#3D3017] to-[#1F190D] p-3 text-white overflow-hidden shadow-md flex items-center justify-between border border-amber-500/30 cursor-pointer hover:border-amber-400 transition-all group"
      >
        {/* Sparkles Overlay Background */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:12px_12px]" />

        {/* Tag on Left */}
        <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full z-10 shadow-sm flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-slate-950 fill-slate-950" />
          <span>مستوى جديد</span>
        </span>

        {/* Banner Title Center / Right */}
        <div className="z-10 flex items-center gap-1.5">
          <ChevronLeft className="w-4 h-4 text-amber-400 group-hover:-translate-x-0.5 transition-transform" />
          <span className="text-sm sm:text-base font-black tracking-wider text-amber-300 italic font-serif uppercase flex items-center gap-1">
            <span>SUPER LEGEND</span>
            <span className="text-xs">👑</span>
          </span>
        </div>
      </div>

      {/* Currency Row (2 Horizontal Cards: Recharge on Right, Diamonds on Left) */}
      <div className="grid grid-cols-2 gap-3" dir="rtl">
        {/* Recharge / Coins Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={onOpenRecharge}
          className={`relative p-[2px] rounded-2xl ${curRoyal.outerBorder} ${curRoyal.shadow} transition-all duration-300 cursor-pointer group w-full`}
        >
          <div className={`${curRoyal.innerBg} rounded-[14px] p-2.5 sm:p-3 flex flex-col justify-between h-full border ${curRoyal.innerBorder} group-hover:bg-white/90 transition-all duration-300`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 min-w-0">
                <TCoin3DIcon className="w-5 h-5 shrink-0" />
                <span className={`text-xs font-black ${curRoyal.coinsText} transition-colors`}>
                  شحن
                </span>
              </div>
              <ChevronLeft className={`w-4 h-4 ${curRoyal.chevron} group-hover:-translate-x-0.5 transition-transform shrink-0`} />
            </div>
            <div className={`text-lg sm:text-xl font-black ${curRoyal.coinsText} font-mono leading-tight tracking-tight mt-1.5 drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)] truncate`}>
              {coinsBalance.toLocaleString('en-US')}
            </div>
          </div>
        </motion.div>

        {/* Diamonds Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={onOpenRecharge}
          className={`relative p-[2px] rounded-2xl ${curRoyal.outerBorder} ${curRoyal.shadow} transition-all duration-300 cursor-pointer group w-full`}
        >
          <div className={`${curRoyal.innerBg} rounded-[14px] p-2.5 sm:p-3 flex flex-col justify-between h-full border ${curRoyal.innerBorder} group-hover:bg-white/90 transition-all duration-300`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 min-w-0">
                <Diamond3DIcon className="w-5 h-5 shrink-0" />
                <span className={`text-xs font-black ${curRoyal.diamondsText} transition-colors`}>
                  الماسة
                </span>
              </div>
              <ChevronLeft className={`w-4 h-4 ${curRoyal.diamondsText} group-hover:-translate-x-0.5 transition-transform shrink-0`} />
            </div>
            <div className={`text-lg sm:text-xl font-black ${curRoyal.diamondsText} font-mono leading-tight tracking-tight mt-1.5 drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)] truncate`}>
              {diamondsBalance.toLocaleString('en-US')}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
