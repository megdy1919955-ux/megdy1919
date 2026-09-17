import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Crown, Sparkles, User, Shield } from 'lucide-react';

export interface VipAnnouncementItem {
  id: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  vipLevel: string | number;
  level?: number;
  nobleLevel?: string;
  createdAt?: number;
}

export interface VipAnnouncementFlyerProps {
  currentAnnouncement: VipAnnouncementItem | null;
  onDismiss: (id: string) => void;
}

export const VipAnnouncementFlyer: React.FC<VipAnnouncementFlyerProps> = React.memo(({
  currentAnnouncement,
  onDismiss
}) => {
  useEffect(() => {
    if (!currentAnnouncement) return;
    const timer = setTimeout(() => {
      onDismiss(currentAnnouncement.id);
    }, 8500); // Display for 8.5 seconds
    return () => clearTimeout(timer);
  }, [currentAnnouncement, onDismiss]);

  if (!currentAnnouncement) return null;

  const vipNum = typeof currentAnnouncement.vipLevel === 'number'
    ? currentAnnouncement.vipLevel
    : parseInt(currentAnnouncement.vipLevel?.toString().match(/\d+/)?.[0] || '6', 10);

  const vipLabel = `VIP${vipNum}`;

  return (
    <div className="fixed top-24 sm:top-32 inset-x-0 z-50 pointer-events-none flex flex-col items-center justify-center px-2">
      <AnimatePresence>
        <motion.div
          key={currentAnnouncement.id}
          initial={{ opacity: 0, x: -240, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 240, scale: 0.85 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          className="relative w-full max-w-xl select-none"
        >
          {/* Main Gold-Trimmed Crimson Capsule Banner - Reduced height by >50% (نحيف ومضغوط وبتوجيه عكسي) */}
          <div className="relative flex items-center bg-gradient-to-l from-[#800000] via-[#990000] to-[#660000] border-[1.5px] border-[#FCD34D] rounded-full py-0.5 sm:py-1 px-2 shadow-[0_0_15px_rgba(239,68,68,0.7),0_0_10px_rgba(245,158,11,0.4)] overflow-hidden h-8 sm:h-9">
            
            {/* Reversed: Golden Ornamental Right Wing/Crest Embellishment (توجيه الجناح الذهبي لليمين) */}
            <div className="absolute -right-1 sm:-right-1.5 top-1/2 -translate-y-1/2 z-20 pointer-events-none flex items-center">
              <div className="w-6 h-7 sm:w-7 sm:h-8 bg-gradient-to-tl from-amber-500 via-yellow-300 to-amber-600 rounded-l-full shadow-[0_0_8px_rgba(245,158,11,0.9)] flex items-center justify-center border-y border-l border-yellow-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-950 animate-spin" style={{ animationDuration: '6s' }} />
              </div>
            </div>

            {/* Inner Content Area - Ultra Slim 2-row layout */}
            <div className="flex flex-col justify-center w-full min-w-0 pr-6 sm:pr-7 pl-1.5 overflow-hidden">
              
              {/* Top Row: User Name & Micro Badges Row */}
              <div className="flex items-center gap-1 sm:gap-1.5 flex-nowrap overflow-x-hidden leading-none mb-0.5">
                
                {/* Sender Name */}
                <span className="font-black text-amber-200 text-[10px] sm:text-[11px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)] whitespace-nowrap">
                  {currentAnnouncement.senderName}
                </span>

                {/* Blue Royal Crest / Castle */}
                <div className="flex items-center justify-center w-3.5 h-3.5 rounded-xs bg-gradient-to-b from-blue-400 via-indigo-600 to-blue-900 border border-blue-200 shadow-2xs shrink-0" title="تاج النبالة الملكي">
                  <Shield className="w-2.5 h-2.5 text-blue-100 fill-blue-200" />
                </div>

                {/* Level Badge with Crown: e.g. 94 👑 */}
                <div className="flex items-center gap-0.5 px-1 py-0 rounded-full bg-gradient-to-r from-rose-500 via-orange-400 to-amber-400 text-slate-950 font-black text-[8px] font-mono shadow-2xs border border-amber-200 shrink-0 h-3">
                  <span>{currentAnnouncement.level || 94}</span>
                  <Crown className="w-2 h-2 fill-amber-950 text-amber-950" />
                </div>

                {/* VIP Badge: e.g. VIP6 */}
                <div className="flex items-center px-1 py-0 rounded-full bg-[#1A1817] border border-amber-300 text-amber-300 font-mono font-black text-[8px] tracking-wider shadow-2xs shrink-0 h-3">
                  <span>{vipLabel}</span>
                </div>

                {/* Wolf / Beast Noble Badge: N5 */}
                <div className="flex items-center gap-0.5 px-1 py-0 rounded-full bg-gradient-to-r from-emerald-800 via-green-600 to-emerald-900 border border-emerald-300 text-emerald-100 font-black text-[8px] font-mono shadow-2xs shrink-0 h-3">
                  <span className="text-[9px]">🐺</span>
                  <span>{currentAnnouncement.nobleLevel || 'N5'}</span>
                </div>

                {/* Turquoise Online / Profile Badge */}
                <div className="w-3 h-3 rounded-full bg-cyan-400 border border-cyan-100 flex items-center justify-center text-slate-950 shadow-2xs shrink-0">
                  <User className="w-2 h-2 text-slate-950 fill-slate-950" />
                </div>

                <span className="text-[8px] font-black text-amber-300 mr-auto bg-black/40 px-1.5 py-0 rounded-full border border-amber-400/40 shrink-0 h-3 flex items-center">
                  📢 VIP
                </span>
              </div>

              {/* Bottom Row: Ultra-Slim Moving Marquee Announcement Message */}
              <div className="relative overflow-hidden w-full h-3.5 sm:h-4 flex items-center">
                <motion.div
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ repeat: Infinity, duration: 11, ease: 'linear' }}
                  className="whitespace-nowrap text-[10px] sm:text-[11px] font-black text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)] flex items-center gap-1.5 absolute tracking-wide leading-none"
                >
                  <span>{currentAnnouncement.text}</span>
                </motion.div>
              </div>

            </div>

            {/* Reversed: Far Left Circular User Avatar (وضع الصورة على الجهة المقابلة) */}
            <div className="relative shrink-0 ml-0.5 mr-0">
              <div className="w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.9)] ring-1 ring-amber-300">
                <img
                  src={
                    currentAnnouncement.senderAvatar ||
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'
                  }
                  alt={currentAnnouncement.senderName}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>

          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
});

VipAnnouncementFlyer.displayName = 'VipAnnouncementFlyer';
