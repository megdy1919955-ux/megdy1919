import React, { useEffect, useRef } from 'react';
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
  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;

  useEffect(() => {
    if (!currentAnnouncement?.id) return;
    const annId = currentAnnouncement.id;
    const timer = setTimeout(() => {
      onDismissRef.current(annId);
    }, 7600); // Display & travel duration: 7.6 seconds
    return () => clearTimeout(timer);
  }, [currentAnnouncement?.id]);

  if (!currentAnnouncement) return null;

  const vipNum = typeof currentAnnouncement.vipLevel === 'number'
    ? currentAnnouncement.vipLevel
    : parseInt(currentAnnouncement.vipLevel?.toString().match(/\d+/)?.[0] || '6', 10);

  const vipLabel = `VIP${vipNum}`;

  return (
    /* Positioned lowered by ~0.5cm to align perfectly at mic #15 row */
    <div className="fixed top-[335px] sm:top-[360px] inset-x-0 z-50 pointer-events-none flex flex-col items-center justify-center px-2 overflow-visible">
      <AnimatePresence>
        <motion.div
          key={currentAnnouncement.id}
          /* Smooth, graceful glide into center, then accelerated departure to the right */
          initial={{ x: '-110vw', opacity: 0 }}
          animate={{
            x: ['-110vw', '-35vw', '0vw', '0vw', '120vw'],
            opacity: [0, 1, 1, 1, 0]
          }}
          transition={{
            duration: 7.5,
            times: [0, 0.22, 0.55, 0.7, 1],
            ease: ['easeOut', 'linear', 'linear', 'easeIn']
          }}
          className="relative w-full max-w-lg select-none"
        >
          {/* Main Gold-Trimmed Crimson Capsule Banner - Reduced height by >50% (نحيف ومضغوط) */}
          <div className="relative flex items-center bg-gradient-to-r from-[#800000] via-[#990000] to-[#660000] border-[1.5px] border-[#FCD34D] rounded-full py-0.5 sm:py-1 px-2 shadow-[0_0_15px_rgba(239,68,68,0.7),0_0_10px_rgba(245,158,11,0.4)] overflow-hidden h-8 sm:h-9">
            
            {/* Left Wing Embellishment: Golden Ornamental Wing on the left (الجناح على الجانب الأيسر) */}
            <div className="absolute -left-1 sm:-left-1.5 top-1/2 -translate-y-1/2 z-20 pointer-events-none flex items-center">
              <div className="w-6 h-7 sm:w-7 sm:h-8 bg-gradient-to-tr from-amber-500 via-yellow-300 to-amber-600 rounded-r-full shadow-[0_0_8px_rgba(245,158,11,0.9)] flex items-center justify-center border-y border-r border-yellow-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-950 animate-spin" style={{ animationDuration: '6s' }} />
              </div>
            </div>

            {/* Inner Content Area - Ultra Slim 2-row layout with padding for the left wing */}
            <div className="flex flex-col justify-center w-full min-w-0 pl-6 sm:pl-7 pr-1.5 overflow-hidden">
              
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

              {/* Bottom Row: Fully Visible Static Announcement Message (كتابة كاملة ثابتة غير متحركة داخل الشريط) */}
              <div className="relative w-full h-3.5 sm:h-4 flex items-center overflow-hidden">
                <span className="text-[10px] sm:text-[11.5px] font-black text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)] tracking-wide leading-none truncate w-full text-right">
                  {currentAnnouncement.text}
                </span>
              </div>

            </div>

            {/* Right Side: Circular User Avatar with Golden Border Ring (وضع الصورة في الجانب اليمين المقابل) */}
            <div className="relative shrink-0 mr-0.5 ml-1.5">
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
