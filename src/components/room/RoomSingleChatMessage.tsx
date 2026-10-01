import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { Crown, Reply } from 'lucide-react';
import { ChatMessage } from './roomTypes';

export interface RoomSingleChatMessageProps {
  message: ChatMessage;
  onClick?: (message: ChatMessage) => void;
  onLongPress?: (message: ChatMessage, anchor: { x: number; y: number }) => void;
  onReplyTo?: (message: ChatMessage) => void;
  onScrollToMessage?: (messageId: string) => void;
}

/**
 * مكون رسالة الدردشة الفردية المنفصل تماماً (RoomSingleChatMessage)
 * - منفصل 100% ومستقل عن أي كود مشترك وخفيف جداً
 * - يدعم الضغط المطول (Long Press) لمدة 450 مللي ثانية لإظهار الخيارات الثلاثة (نسخ، تبليغ، ترجمة)
 * - يدعم السحب السلس لليسار للرد السريع
 * - يظهر الاسم والبروفايل خارج وأعلى الفقاعة
 * - لون الاسم أبيض افتراضياً، وأحمر لـ VIP8 فما فوق أو المالك
 */
export const RoomSingleChatMessage: React.FC<RoomSingleChatMessageProps> = ({
  message,
  onClick,
  onLongPress,
  onReplyTo,
  onScrollToMessage
}) => {
  const isOwner =
    message.isOwner ||
    message.userName.includes('المالك') ||
    message.userName.includes('المضيف');

  // استخراج رقم الـ VIP
  const vipNum =
    typeof message.vipLevel === 'number'
      ? message.vipLevel
      : parseInt(message.vipLevel?.toString().match(/\d+/)?.[0] || '0', 10);

  // الاسم باللون الأبيض افتراضياً، ولكن لمن يملك VIP 8 وما فوق أو المالك يكون باللون الأحمر
  const isVip8OrAbove = isOwner || vipNum >= 8;
  const userNameColorClass = isVip8OrAbove
    ? 'text-red-400 font-black drop-shadow-[0_1px_2px_rgba(239,68,68,0.5)]'
    : 'text-white font-bold';

  let hapticFired = false;
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // بدء عداد الضغط المطول
  const startLongPress = (clientX: number, clientY: number) => {
    touchStartPosRef.current = { x: clientX, y: clientY };
    if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
    longPressTimerRef.current = setTimeout(() => {
      if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
        try {
          window.navigator.vibrate(25);
        } catch (_) {}
      }
      if (onLongPress) {
        onLongPress(message, { x: clientX, y: clientY });
      }
    }, 450);
  };

  // إلغاء الضغط المطول عند رفع الإصبع أو التمرير
  const cancelLongPress = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  return (
    <div
      id={`single-chat-${message.id}`}
      data-chat-id={message.id}
      className="relative my-1 w-full select-none touch-pan-y"
    >
      <motion.div
        drag="x"
        dragDirectionLock={true}
        dragConstraints={{ left: -60, right: 0 }}
        dragElastic={0.12}
        dragSnapToOrigin={true}
        onDrag={(_, info) => {
          cancelLongPress();
          if (info.offset.x < -35 && !hapticFired) {
            hapticFired = true;
            if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
              try {
                window.navigator.vibrate(15);
              } catch (_) {}
            }
          }
        }}
        onDragEnd={(_, info) => {
          if (info.offset.x < -30 && onReplyTo) {
            onReplyTo(message);
          }
        }}
        onPointerDown={(e) => startLongPress(e.clientX, e.clientY)}
        onPointerUp={cancelLongPress}
        onPointerLeave={cancelLongPress}
        onContextMenu={(e) => {
          e.preventDefault();
          if (onLongPress) onLongPress(message, { x: e.clientX, y: e.clientY });
        }}
        className="flex flex-col items-start w-fit max-w-[95%] cursor-pointer group"
        onClick={() => onClick && onClick(message)}
      >
        {/* صف الرأس الخارجي: البروفايل + الاسم فوق الفقاعة وبجانب البروفايل + شارة الـ VIP */}
        <div className="flex items-center gap-1.5 mb-1 px-0.5">
          {/* أفاتار المرسل الدائري */}
          {message.avatar && (
            <div className="relative shrink-0">
              <img
                src={message.avatar}
                alt={message.userName}
                className={`w-6 h-6 rounded-full object-cover shadow-xs border ${
                  isOwner ? 'border-amber-400' : 'border-white/30'
                }`}
              />
              {isOwner && (
                <Crown className="w-3 h-3 text-amber-300 absolute -top-1.5 -right-1 drop-shadow" />
              )}
            </div>
          )}

          {/* اسم المرسل خارج وفوق الفقاعة (أحمر لـ VIP8 فما فوق، وأبيض للباقي) */}
          <span className={`text-[11.5px] truncate max-w-[130px] leading-tight ${userNameColorClass}`}>
            {message.userName}
          </span>

          {/* شارة VIP */}
          {message.vipLevel && (
            <span className="text-[9px] px-1 py-0.2 bg-gradient-to-r from-amber-500/30 to-yellow-500/20 text-amber-300 rounded-sm font-bold border border-amber-500/40 leading-none">
              {message.vipLevel}
            </span>
          )}
        </div>

        {/* فقاعة الرسالة الملكية المتدرجة: تقع بالكامل تحت البروفايل والاسم */}
        <div
          className={`rounded-2xl rounded-tr-xs px-3 py-1.5 text-xs shadow-xs transition-colors backdrop-blur-md ${
            isOwner
              ? 'bg-gradient-to-r from-amber-950/85 via-yellow-950/75 to-amber-950/85 border border-amber-400/50 text-amber-100'
              : 'bg-[#121827]/90 border border-white/10 text-slate-100'
          }`}
        >
          {/* اقتباس الرسالة المستنسخة السابقة: عند الضغط عليه يقفز ويعود للرسالة السابقة */}
          {message.replyTo && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                if (onScrollToMessage && message.replyTo?.id) {
                  onScrollToMessage(message.replyTo.id);
                }
              }}
              className="flex items-center gap-1.5 px-2 py-1 mb-1.5 bg-black/50 hover:bg-black/70 active:scale-98 transition-all border-r-2 border-amber-400 rounded-md text-[10px] text-slate-300 cursor-pointer shadow-inner"
              title="اضغط للعودة إلى الرسالة السابقة"
            >
              <Reply className="w-3 h-3 text-amber-400 shrink-0 rotate-180" />
              <span className="font-bold text-amber-300 shrink-0">@{message.replyTo.userName}:</span>
              <span className="truncate max-w-[110px] opacity-85">{message.replyTo.text}</span>
            </div>
          )}

          {/* نص الرسالة الأصلي */}
          <span className="text-[12px] leading-snug break-words [overflow-wrap:anywhere] text-slate-100 block">
            {message.text}
          </span>
        </div>
      </motion.div>
    </div>
  );
};
