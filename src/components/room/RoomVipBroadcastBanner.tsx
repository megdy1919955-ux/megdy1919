import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Crown, Shield } from 'lucide-react';

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

export interface RoomVipBroadcastBannerProps {
  currentAnnouncement: VipAnnouncementItem | null;
  onDismiss: (id: string) => void;
}

/**
 * مكون إعلان VIP الطائر في منتصف الشاشة (RoomVipBroadcastBanner)
 * - منفصل 100% ومستقل عن المايكات وعن الهيدر وعن الشات
 * - يظهر كشريط متحرك فخم يطير في وسط الشاشة عند تفعيل إشارة N وإرسال الرسالة
 * - يتم تدميره تلقائياً بعد انتهاء حركته (7.5 ثوانٍ)
 */
export const RoomVipBroadcastBanner: React.FC<RoomVipBroadcastBannerProps> = React.memo(({
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
    }, 7600); // مدة الرحلة عبر الشاشة 7.6 ثوانٍ
    return () => clearTimeout(timer);
  }, [currentAnnouncement?.id]);

  if (!currentAnnouncement) return null;

  const vipNum =
    typeof currentAnnouncement.vipLevel === 'number'
      ? currentAnnouncement.vipLevel
      : parseInt(currentAnnouncement.vipLevel?.toString().match(/\d+/)?.[0] || '8', 10);

  const vipLabel = `VIP${vipNum}`;

  return (
    <div
      id="room-vip-broadcast-layer"
      className="fixed top-1/2 -translate-y-[calc(50%-1cm)] inset-x-0 z-50 pointer-events-none flex flex-col items-center justify-center px-2 overflow-visible select-none"
    >
      <AnimatePresence>
        <motion.div
          key={currentAnnouncement.id}
          /* حركة انزلاقية ملكية من اليسار ثم الاستقرار بالوسط ثم الانطلاق السريع لليمين */
          initial={{ x: '-110vw', opacity: 0 }}
          animate={{
            x: ['-110vw', '-25vw', '0vw', '0vw', '120vw'],
            opacity: [0, 1, 1, 1, 0]
          }}
          transition={{
            duration: 7.5,
            times: [0, 0.22, 0.55, 0.72, 1],
            ease: ['easeOut', 'linear', 'linear', 'easeIn']
          }}
          className="relative w-full max-w-lg select-none"
        >
          {/* كبسولة الإعلان الملكية العنابية المتدرجة مع إطار ذهبي لامع */}
          <div className="relative flex items-center bg-gradient-to-r from-[#7a0000] via-[#9e0505] to-[#600000] border-2 border-[#FCD34D] rounded-full py-1 sm:py-1.5 px-3 shadow-[0_0_22px_rgba(239,68,68,0.8),0_0_15px_rgba(245,158,11,0.6)] overflow-hidden h-11 sm:h-12 backdrop-blur-md">
            
            {/* بروفايل المرسل في المقدمة فقط داخل إطار ذهبي مشع */}
            <div className="relative shrink-0 ml-0.5 mr-2.5 z-20 flex items-center">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.9)] ring-2 ring-amber-300">
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

            {/* محتوى الإعلان الداخلي (اسم + شارات + نص الرسالة) */}
            <div className="flex flex-col justify-center flex-1 min-w-0 pr-2 pl-1 overflow-hidden">
              
              {/* الصف الأول: اسم المرسل والشارات الملكية */}
              <div className="flex items-center gap-1.5 flex-nowrap overflow-x-hidden leading-none mb-0.5">
                <span className="font-black text-amber-200 text-xs sm:text-[13px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)] whitespace-nowrap">
                  {currentAnnouncement.senderName}
                </span>

                {/* شارة الدرع الملكي الأزرق */}
                <div className="flex items-center justify-center w-3.5 h-3.5 rounded-xs bg-gradient-to-b from-blue-400 via-indigo-600 to-blue-900 border border-blue-200 shadow-2xs shrink-0">
                  <Shield className="w-2.5 h-2.5 text-blue-100 fill-blue-200" />
                </div>

                {/* شارة التاج الذهبي */}
                <div className="flex items-center gap-0.5 px-1.5 py-0 rounded-full bg-gradient-to-r from-rose-500 via-orange-400 to-amber-400 text-slate-950 font-black text-[8.5px] font-mono shadow-2xs border border-amber-200 shrink-0 h-3.5">
                  <span>{currentAnnouncement.level || 99}</span>
                  <Crown className="w-2 h-2 fill-amber-950 text-amber-950" />
                </div>

                {/* شارة VIP الذهبية */}
                <div className="flex items-center px-1.5 py-0 rounded-full bg-[#1A1817] border border-amber-300 text-amber-300 font-mono font-black text-[8.5px] tracking-wider shadow-2xs shrink-0 h-3.5">
                  <span>{vipLabel}</span>
                </div>

                {/* وسام N المضيء الخاص بالسحابة N */}
                <span className="text-[9px] font-black text-cyan-200 mr-auto bg-cyan-950/80 px-2 py-0 rounded-full border border-cyan-400/50 shrink-0 h-3.5 flex items-center shadow-[0_0_8px_rgba(6,182,212,0.4)]">
                  ☁️ إعلان N
                </span>
              </div>

              {/* الصف الثاني: نص رسالة الإعلان واضح وبارز في منتصف الشاشة */}
              <div className="relative w-full h-4 sm:h-5 flex items-center overflow-hidden">
                <span className="text-[12px] sm:text-[13px] font-black text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)] tracking-wide leading-none truncate w-full text-right">
                  {currentAnnouncement.text}
                </span>
              </div>

            </div>

          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
});

RoomVipBroadcastBanner.displayName = 'RoomVipBroadcastBanner';
