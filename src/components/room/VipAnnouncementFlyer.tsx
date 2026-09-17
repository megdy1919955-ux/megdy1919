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
    <div className="fixed top-28 sm:top-36 inset-x-0 z-50 pointer-events-none flex flex-col items-center justify-center px-2">
      <AnimatePresence>
        <motion.div
          key={currentAnnouncement.id}
          initial={{ opacity: 0, x: 220, scale: 0.85 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -220, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          className="relative w-full max-w-2xl select-none"
        >
          {/* Main Gold-Trimmed Crimson Capsule Banner (مطابق للصورة التوضيحية لـ YoHo) */}
          <div className="relative flex items-center bg-gradient-to-r from-[#800000] via-[#990000] to-[#660000] border-[2.5px] border-[#FCD34D] rounded-full py-2.5 px-3 sm:px-4 shadow-[0_0_25px_rgba(239,68,68,0.75),0_0_15px_rgba(245,158,11,0.5)] overflow-hidden">
            
            {/* Golden Ornamental Left Wing/Crest Embellishment */}
            <div className="absolute -left-1 sm:-left-2 top-1/2 -translate-y-1/2 z-20 pointer-events-none flex items-center">
              <div className="w-9 h-12 sm:w-11 sm:h-14 bg-gradient-to-tr from-amber-500 via-yellow-300 to-amber-600 rounded-r-full shadow-[0_0_12px_rgba(245,158,11,0.9)] flex items-center justify-center border-y-2 border-r-2 border-yellow-200">
                <Sparkles className="w-5 h-5 text-amber-950 animate-spin" style={{ animationDuration: '6s' }} />
              </div>
            </div>

            {/* Inner Content Area */}
            <div className="flex flex-col w-full min-w-0 pr-1 pl-7 sm:pl-8">
              
              {/* Top Row: User Name & Rich Badges Row (as shown in user photo) */}
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap mb-1 overflow-x-hidden">
                
                {/* Sender Name */}
                <span className="font-black text-amber-200 text-xs sm:text-sm drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)] whitespace-nowrap">
                  {currentAnnouncement.senderName}
                </span>

                {/* Blue Royal Crest / Castle */}
                <div className="flex items-center justify-center w-5 h-5 rounded-md bg-gradient-to-b from-blue-400 via-indigo-600 to-blue-900 border border-blue-200 shadow-xs text-[10px]" title="تاج النبالة الملكي">
                  <Shield className="w-3.5 h-3.5 text-blue-100 fill-blue-200" />
                </div>

                {/* Level Badge with Crown: e.g. 94 👑 */}
                <div className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-gradient-to-r from-rose-500 via-orange-400 to-amber-400 text-slate-950 font-black text-[10px] font-mono shadow-xs border border-amber-200">
                  <span>{currentAnnouncement.level || 94}</span>
                  <Crown className="w-3 h-3 fill-amber-950 text-amber-950" />
                </div>

                {/* VIP Badge: e.g. VIP6 */}
                <div className="flex items-center px-2 py-0.5 rounded-full bg-[#1A1817] border border-amber-300 text-amber-300 font-mono font-black text-[10px] tracking-wider shadow-xs">
                  <span>{vipLabel}</span>
                </div>

                {/* Wolf / Beast Noble Badge: N5 */}
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-emerald-800 via-green-600 to-emerald-900 border border-emerald-300 text-emerald-100 font-black text-[10px] font-mono shadow-xs">
                  <span className="text-[11px]">🐺</span>
                  <span>{currentAnnouncement.nobleLevel || 'N5'}</span>
                </div>

                {/* Turquoise Online / Profile Badge */}
                <div className="w-4.5 h-4.5 rounded-full bg-cyan-400 border border-cyan-100 flex items-center justify-center text-slate-950 shadow-xs">
                  <User className="w-3 h-3 text-slate-950 fill-slate-950" />
                </div>

                <span className="text-[10px] font-black text-amber-300 mr-auto bg-black/30 px-2 py-0.5 rounded-full border border-amber-400/40">
                  📢 إعلان VIP
                </span>
              </div>

              {/* Bottom Row: High-Visibility Marquee Announcement Message */}
              <div className="relative overflow-hidden w-full h-7 flex items-center">
                <motion.div
                  animate={{ x: ['100%', '-100%'] }}
                  transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
                  className="whitespace-nowrap text-xs sm:text-sm font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] flex items-center gap-2 absolute tracking-wide"
                >
                  <span>{currentAnnouncement.text}</span>
                </motion.div>
              </div>

            </div>

            {/* Far Right: Circular User Avatar with Golden Border Ring */}
            <div className="relative shrink-0 mr-1 ml-0.5">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.9)] ring-1.5 ring-amber-300">
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
