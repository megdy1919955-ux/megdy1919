import React from 'react';
import { RefreshCw, CheckCircle2 } from 'lucide-react';

interface PullToRefreshIndicatorProps {
  pullDistance: number;
  isRefreshing: boolean;
  refreshSuccess: boolean;
  threshold?: number;
}

export const PullToRefreshIndicator: React.FC<PullToRefreshIndicatorProps> = ({
  pullDistance,
  isRefreshing,
  refreshSuccess,
  threshold = 45
}) => {
  if (pullDistance <= 5 && !isRefreshing) return null;

  const isTriggered = pullDistance >= threshold;

  return (
    <div
      className="w-full flex items-center justify-center overflow-hidden transition-all duration-150 pointer-events-none z-30"
      style={{ height: `${pullDistance}px` }}
    >
      <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/90 text-white backdrop-blur-md border border-slate-800 shadow-xl text-xs font-bold font-sans">
        {refreshSuccess ? (
          <>
            <CheckCircle2 className="w-4 h-4 text-emerald-400 animate-bounce" />
            <span className="text-emerald-300">تم التحديث مع السيرفر بنجاح ✨</span>
          </>
        ) : isRefreshing ? (
          <>
            <RefreshCw className="w-4 h-4 text-amber-400 animate-spin" />
            <span className="text-amber-200">جاري التحديث اللحظي من السيرفر...</span>
          </>
        ) : (
          <>
            <RefreshCw
              className="w-4 h-4 text-slate-300 transition-transform duration-150"
              style={{ transform: `rotate(${Math.min(360, (pullDistance / threshold) * 180)}deg)` }}
            />
            <span className="text-slate-200">
              {isTriggered ? 'افلت للتحديث اللحظي' : 'اسحب للأسفل للتحديث'}
            </span>
          </>
        )}
      </div>
    </div>
  );
};
