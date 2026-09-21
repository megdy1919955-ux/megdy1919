import React from 'react';
import { Loader2 } from 'lucide-react';

interface LazyScreenSkeletonProps {
  title?: string;
}

export const LazyScreenSkeleton: React.FC<LazyScreenSkeletonProps> = ({ title = 'جاري التحميل...' }) => {
  return (
    <div className="w-full py-16 flex items-center justify-center px-4" dir="rtl">
      {/* Sleek strip with square and title */}
      <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-slate-900/80 backdrop-blur-md border border-amber-500/30 shadow-lg text-white">
        <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0">
          <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
        </div>
        <div className="flex items-center gap-2 pl-2">
          <span className="text-xs sm:text-sm font-bold text-amber-300 whitespace-nowrap">
            {title}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default LazyScreenSkeleton;

