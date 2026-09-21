import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Image as ImageIcon, CheckCircle, Loader2 } from 'lucide-react';

export interface WallpaperBackgroundCachePillProps {
  notice: {
    status: 'caching' | 'ready' | null;
    text: string;
  } | null;
}

/**
 * تنبيه خفي ورشيق لتحميل وحفظ خلفية الروم في الحافظة المؤقتة في الخلفية
 */
export const WallpaperBackgroundCachePill: React.FC<WallpaperBackgroundCachePillProps> = ({ notice }) => {
  if (!notice || !notice.status) return null;

  const isCaching = notice.status === 'caching';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -12, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -12, scale: 0.95 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="fixed top-14 left-1/2 -translate-x-1/2 z-40 pointer-events-none select-none"
        dir="rtl"
      >
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold shadow-lg backdrop-blur-md border ${
            isCaching
              ? 'bg-slate-900/80 text-amber-300 border-amber-500/30'
              : 'bg-emerald-950/85 text-emerald-300 border-emerald-500/40 shadow-emerald-900/20'
          }`}
        >
          {isCaching ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400 shrink-0" />
              <ImageIcon className="w-3 h-3 text-amber-300 shrink-0" />
              <span className="truncate max-w-[240px]">{notice.text}</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate max-w-[240px]">{notice.text}</span>
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
