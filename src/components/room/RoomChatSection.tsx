import React, { useRef, useEffect, useState, useCallback } from 'react';
import { AnimatePresence } from 'motion/react';
import { UserProfileData } from '../AdvancedUserProfileModal';
import { ChatMessage } from './roomTypes';
import { ChatMessageItem, getBubbleStyles } from './ChatMessageItem';
import { RoomHostNoticeTicker } from './RoomHostNoticeTicker';
import { ChatMessageActionsModal } from './ChatMessageActionsModal';
import { RoomChatReportModal } from './RoomChatReportModal';

export { getBubbleStyles };

export interface RoomChatSectionProps {
  chatMessages: ChatMessage[];
  roomId?: string;
  hostName?: string;
  isOwner?: boolean;
  onReplyTo: (reply: { id: string; userName: string; text: string; avatar?: string }) => void;
  onOpenChatInput: () => void;
  onOpenUserProfile?: (userData: UserProfileData) => void;
  onToggleHostGender?: (messageId: string) => void;
}

export const RoomChatSection = React.memo(
  ({
    chatMessages,
    roomId = 'default',
    hostName,
    isOwner = false,
    onReplyTo,
    onOpenChatInput,
    onOpenUserProfile,
  }: RoomChatSectionProps) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [highlightedMessageId, setHighlightedMessageId] = useState<string | null>(null);

    // Selected message for the Actions Menu (نسخ، تبليغ، ترجمة)
    const [selectedActionMessage, setSelectedActionMessage] = useState<ChatMessage | null>(null);
    const [actionMenuPosition, setActionMenuPosition] = useState<{ x: number; y: number } | null>(null);
    const [reportingMessage, setReportingMessage] = useState<ChatMessage | null>(null);
    const [chatToast, setChatToast] = useState<string | null>(null);

    const showToast = useCallback((msg: string) => {
      setChatToast(msg);
      setTimeout(() => setChatToast(null), 2500);
    }, []);

    // Auto-scroll isolated strictly to this container only (No window.scrollIntoView to prevent room screen jitter)
    useEffect(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({
          top: scrollContainerRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
    }, [chatMessages]);

    const scrollToMessage = useCallback((messageId: string) => {
      const container = scrollContainerRef.current;
      const el = document.getElementById(`chat-msg-${messageId}`);
      if (el && container) {
        const containerRect = container.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        const relativeTop =
          elRect.top - containerRect.top + container.scrollTop - containerRect.height / 2 + elRect.height / 2;

        container.scrollTo({
          top: relativeTop,
          behavior: 'smooth'
        });
        setHighlightedMessageId(messageId);
        setTimeout(() => {
          setHighlightedMessageId(null);
        }, 1800);
      }
    }, []);

    return (
      <div
        className="flex-1 pr-1 pl-[104px] pt-0 pb-1 flex flex-col min-h-0 relative z-20 transition-all duration-300 overflow-hidden overflow-x-hidden w-full max-w-full"
      >
        {/* Floating Mini Toast Feedback */}
        {chatToast && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 px-3 py-1.5 rounded-full bg-slate-900/95 border border-amber-400/50 text-amber-200 text-xs font-black shadow-lg animate-fadeIn select-none pointer-events-none whitespace-nowrap">
            {chatToast}
          </div>
        )}

        <div
          ref={scrollContainerRef}
          className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain pr-0.5 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-yellow-500/30 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent w-full max-w-full"
        >
          <div className="min-h-full flex flex-col justify-end space-y-1.5 pt-0.5 pb-1 w-full max-w-full overflow-x-hidden">
            {/* لوحة الترحيب وإعلانات دخول المضيف - لون أصفر نقي وبدون خلفية وقابلة للتعديل للمالك */}
            <RoomHostNoticeTicker
              roomId={roomId}
              hostName={hostName}
              isOwner={isOwner}
            />

            {/* رسائل الدردشة الحقيقية (بحد أقصى 30 رسالة وتصفية الأقدم تلقائياً من الأعلى) */}
            <AnimatePresence initial={false}>
              {chatMessages.slice(-30).map((msg, msgIndex) => (
                <ChatMessageItem
                  key={`${msg.id}-${msgIndex}`}
                  msg={msg}
                  msgIndex={msgIndex}
                  isHighlighted={highlightedMessageId === msg.id}
                  onReplyTo={onReplyTo}
                  onOpenChatInput={onOpenChatInput}
                  onOpenUserProfile={onOpenUserProfile}
                  onScrollToMessage={scrollToMessage}
                  onSelectMessage={(targetMsg, pos) => {
                    setSelectedActionMessage(targetMsg);
                    setActionMenuPosition(pos || null);
                  }}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* 1. قائمة إجراءات الرسالة المستطيلة العائمة من الأعلى للأسفل (نسخ - تبليغ - ترجمة) */}
        <ChatMessageActionsModal
          isOpen={Boolean(selectedActionMessage)}
          onClose={() => {
            setSelectedActionMessage(null);
            setActionMenuPosition(null);
          }}
          message={selectedActionMessage}
          anchorPosition={actionMenuPosition}
          onReport={(msg) => {
            setReportingMessage(msg);
          }}
          onToast={showToast}
        />

        {/* 2. نافذة البلاغ الرسمية المطابقة للصورة رقم 3 بالخيارات السبعة */}
        <RoomChatReportModal
          isOpen={Boolean(reportingMessage)}
          onClose={() => setReportingMessage(null)}
          targetUserName={reportingMessage?.userName || 'المستخدم'}
          targetMessageText={reportingMessage?.text}
          onSubmitReport={(reason) => {
            showToast(`تم إرسال البلاغ (${reason}) بنجاح وسيتم اتخاذ الإجراء فوراً 🛡️`);
          }}
        />
      </div>
    );
  }
);

RoomChatSection.displayName = 'RoomChatSection';
