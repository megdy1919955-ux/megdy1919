import React from 'react';
import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';

interface LazyModalSkeletonProps {
  title?: string;
}

export const LazyModalSkeleton: React.FC<LazyModalSkeletonProps> = ({ title = 'جاري التحميل...' }) => {
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none select-none"
      dir="rtl"
    >
      {/* Sleek horizontal floating bar centered in screen: strip with square icon and title only */}
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -8 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className="relative flex items-center gap-3 px-5 py-2.5 rounded-full bg-slate-900/90 backdrop-blur-md border border-amber-500/40 shadow-[0_10px_30px_rgba(0,0,0,0.6),0_0_20px_rgba(245,158,11,0.25)] text-white"
      >
        {/* Small Square with subtle gold glow and rotating loader */}
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500/30 to-yellow-400/20 border border-amber-400/50 flex items-center justify-center shrink-0 shadow-inner">
          <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
        </div>

        {/* Title Name */}
        <div className="flex items-center gap-2 pr-0.5 pl-2">
          <span className="text-sm font-bold text-amber-300 whitespace-nowrap">
            {title}
          </span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
        </div>

        {/* Subtle bottom light shimmer indicator */}
        <div className="absolute bottom-0 left-5 right-5 h-[1px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
      </motion.div>
    </div>
  );
};

export default LazyModalSkeleton;

