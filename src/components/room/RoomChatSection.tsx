import React, { useRef, useEffect } from 'react';
import { ChatMessage } from './roomTypes';
import { RoomSingleChatMessage } from './RoomSingleChatMessage';
import { RoomSystemNotice } from './RoomSystemNotice';
import { RoomGiftWinNotice } from './RoomGiftWinNotice';

export interface RoomChatSectionProps {
  chatMessages: ChatMessage[];
  onOpenChatInput?: () => void;
  onMessageClick?: (message: ChatMessage) => void;
  onMessageLongPress?: (message: ChatMessage, anchor: { x: number; y: number }) => void;
  onReplyToMessage?: (message: ChatMessage) => void;
}

/**
 * قسم الشات ورسائل الدردشة المنفصل تماماً (RoomChatSection)
 * - منفصل 100% ومستقل عن المايكات وعن الهيدر وعن شريط الأيقونات وعن عمود الهدايا الـ 20%.
 * - يملأ مساحته المخصصة بنسبة 100% داخل العمود الممنوح له (وهو 80% من عرض الشاشة).
 * - التمرير الداخلي معزول ومحصور بالكامل داخل هذا المكون فقط.
 * - يدعم الضغط المطول لإظهار الخيارات الثلاثة (نسخ، تبليغ، ترجمة).
 * - يدعم القفز والانتقال السلس إلى الرسالة السابقة عند النقر على اقتباس الرد مع وميض مؤقت.
 */
export const RoomChatSection: React.FC<RoomChatSectionProps> = ({
  chatMessages,
  onOpenChatInput,
  onMessageClick,
  onMessageLongPress,
  onReplyToMessage
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // التمرير إلى أسفل عند وصول رسائل جديدة تلقائياً
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [chatMessages.length]);

  // دالة القفز إلى الرسالة السابقة عند النقر على الرد المستنسخ
  const handleScrollToMessage = (targetId: string) => {
    if (!scrollContainerRef.current) return;
    const targetElement = scrollContainerRef.current.querySelector(
      `[data-chat-id="${targetId}"]`
    ) as HTMLElement | null;

    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // وميض تأكيدي على الرسالة السابقة
      targetElement.classList.add('ring-2', 'ring-amber-400', 'bg-amber-500/10', 'rounded-xl', 'transition-all');
      setTimeout(() => {
        targetElement.classList.remove('ring-2', 'ring-amber-400', 'bg-amber-500/10', 'rounded-xl');
      }, 1500);
    }
  };

  return (
    <div
      id="room-chat-feed-container"
      className="w-full h-full flex flex-col justify-end overflow-hidden select-none"
    >
      <div
        ref={scrollContainerRef}
        className="overflow-y-auto no-scrollbar space-y-1.5 px-1 py-1 max-h-full scroll-smooth"
      >
        {chatMessages.map((msg) => {
          // 1. فحص هل هي رسالة نظام أو ترحيب
          const isSystem =
            msg.isSystem ||
            msg.id.startsWith('sys_') ||
            msg.userName === 'نظام الغرفة' ||
            msg.text.includes('مرحباً بك') ||
            msg.text.includes('أهلاً');

          if (isSystem) {
            return (
              <RoomSystemNotice
                key={msg.id}
                id={msg.id}
                text={msg.text}
                type={msg.text.includes('مرحباً') || msg.text.includes('أهلاً') ? 'welcome' : 'system'}
              />
            );
          }

          // 2. فحص هل هي رسالة فوز بالحظ
          if (msg.isLuckyWinMessage) {
            return (
              <RoomGiftWinNotice
                key={msg.id}
                message={msg}
                onClick={onMessageClick}
              />
            );
          }

          // 3. رسالة دردشة عادية تدعم السحب لليسار والضغط المطول والقفز للرسالة السابقة
          return (
            <RoomSingleChatMessage
              key={msg.id}
              message={msg}
              onClick={onMessageClick}
              onLongPress={onMessageLongPress}
              onReplyTo={onReplyToMessage}
              onScrollToMessage={handleScrollToMessage}
            />
          );
        })}
      </div>
    </div>
  );
};
