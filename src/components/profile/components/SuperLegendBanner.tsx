import React from 'react';
import { ChevronLeft, Sparkles } from 'lucide-react';

export interface SuperLegendBannerProps {
  onOpenSuperLegend: () => void;
}

export const SuperLegendBanner: React.FC<SuperLegendBannerProps> = ({
  onOpenSuperLegend
}) => {
  return (
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
  );
};

export default SuperLegendBanner;
