import React from 'react';
import { Sparkles, Gift } from 'lucide-react';
import { ChatMessage } from './roomTypes';

export interface RoomGiftWinNoticeProps {
  message: ChatMessage;
  onClick?: (message: ChatMessage) => void;
}

/**
 * مكون إشعارات الهدايا والمكاسب المنفصل تماماً (RoomGiftWinNotice)
 * - منفصل 100% بدون أي تداخل مع المايكات أو أقسام الروم
 * - شريط أفقي لامع ومميز لرسائل الهدايا والمكاسب
 */
export const RoomGiftWinNotice: React.FC<RoomGiftWinNoticeProps> = ({
  message,
  onClick
}) => {
  const isLuckyWin = message.isLuckyWinMessage;

  return (
    <div
      onClick={() => onClick && onClick(message)}
      className="w-fit max-w-[95%] my-1 select-none cursor-pointer"
    >
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-purple-950/85 via-pink-950/85 to-purple-950/85 border border-pink-500/40 shadow-sm backdrop-blur-md">
        {/* أفاتار صغير للمرسل/الفائز */}
        {message.avatar ? (
          <img
            src={message.avatar}
            alt={message.userName}
            className="w-6 h-6 rounded-full object-cover border border-amber-400/70 shrink-0"
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-pink-500/20 border border-pink-400/50 flex items-center justify-center shrink-0">
            {isLuckyWin ? (
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            ) : (
              <Gift className="w-3.5 h-3.5 text-pink-300" />
            )}
          </div>
        )}

        {/* النص والتفاصيل */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="font-bold text-amber-300 truncate max-w-[100px]">
            {message.userName}
          </span>

          {isLuckyWin ? (
            <>
              <span className="text-amber-100/90 text-[11px]">ربح جائزة كبرى</span>
              <span className="font-black text-emerald-400 font-mono">
                +{message.winAmount?.toLocaleString() || '1,000'} 🪙
              </span>
            </>
          ) : (
            <>
              <span className="text-pink-200/90 text-[11px]">أرسل هدية</span>
              {message.giftIcon && <span className="text-sm">{message.giftIcon}</span>}
              <span className="font-bold text-pink-300 text-[11px]">
                {message.giftName || 'وردة ذهبية'}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
