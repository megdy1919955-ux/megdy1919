import React from 'react';
import { motion } from 'motion/react';
import { Crown } from 'lucide-react';

export interface RoomHostNoticeTickerProps {
  hostName?: string;
  noticeText?: string;
}

export const RoomHostNoticeTicker: React.FC<RoomHostNoticeTickerProps> = React.memo(({
  hostName = 'أميرة الشرق 👑',
  noticeText = 'أهلاً ومرحباً بالجميع! يرجى الالتزام بالاحترام المتبادل على المايكات، ويمنع استخدام الكلمات غير اللائقة. استمتعوا بالأمسية الموسيقية 🎵'
}) => {
  return (
    <div className="bg-gradient-to-r from-amber-950/80 via-amber-900/90 to-amber-950/80 border border-amber-500/50 rounded-2xl p-2.5 mb-1 shadow-lg relative overflow-hidden shrink-0 w-full max-w-full">
      <div className="flex items-center justify-between gap-1 border-b border-amber-500/30 pb-1 mb-1">
        <div className="flex items-center gap-1.5 text-amber-300 font-black text-[11px]">
          <Crown className="w-4 h-4 fill-amber-400 text-amber-300 animate-bounce" />
          <span>[دخول المضيف] لوحة إعلانات ودليل الغرفة</span>
        </div>
        <span className="text-[10px] bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full font-black shadow-xs">
          {hostName}
        </span>
      </div>

      {/* MOVING TICKER TEXT INSIDE CHAT */}
      <div className="overflow-hidden relative w-full h-5 flex items-center">
        <motion.div
          animate={{ x: ['100%', '-100%'] }}
          transition={{ repeat: Infinity, duration: 15, ease: 'linear' }}
          className="whitespace-nowrap text-[11px] font-bold text-amber-100 flex items-center gap-2 absolute"
        >
          <span>
            📜 <b>دليل واستخدام الغرفة:</b> {noticeText}
          </span>
        </motion.div>
      </div>
    </div>
  );
});

RoomHostNoticeTicker.displayName = 'RoomHostNoticeTicker';
