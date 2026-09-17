import React, { useRef, useEffect, useState, useCallback } from 'react';
import { AnimatePresence } from 'motion/react';
import { UserProfileData } from '../AdvancedUserProfileModal';
import { ChatMessage } from './roomTypes';
import { ChatMessageItem, getBubbleStyles } from './ChatMessageItem';
import { RoomHostNoticeTicker } from './RoomHostNoticeTicker';

export { getBubbleStyles };

export interface RoomChatSectionProps {
  chatMessages: ChatMessage[];
  onReplyTo: (reply: { id: string; userName: string; text: string; avatar?: string }) => void;
  onOpenChatInput: () => void;
  onOpenUserProfile?: (userData: UserProfileData) => void;
  onToggleHostGender?: (messageId: string) => void;
}

export const RoomChatSection = React.memo(
  ({
    chatMessages,
    onReplyTo,
    onOpenChatInput,
    onOpenUserProfile,
  }: RoomChatSectionProps) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [highlightedMessageId, setHighlightedMessageId] = useState<string | null>(null);

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
        className="flex-1 pr-1 pl-[104px] pt-0 pb-1 flex flex-col min-h-0 relative z-20 transition-all duration-300 overflow-hidden overflow-x-hidden w-full max-w-full isolate"
        style={{ contain: 'layout paint' }}
      >
        <div
          ref={scrollContainerRef}
          className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain pr-0.5 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-amber-500/30 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent w-full max-w-full"
        >
          <div className="min-h-full flex flex-col justify-end space-y-1.5 pt-0.5 pb-1 w-full max-w-full overflow-x-hidden">
            {/* MOVING HOST ANNOUNCEMENT BOARD INSIDE CHAT STREAM */}
            <RoomHostNoticeTicker />

            {/* REGULAR CHAT MESSAGES WITH AVATARS, BADGES, AND MEMOIZED ITEMS */}
            <AnimatePresence initial={false}>
              {chatMessages.map((msg, msgIndex) => (
                <ChatMessageItem
                  key={`${msg.id}-${msgIndex}`}
                  msg={msg}
                  msgIndex={msgIndex}
                  isHighlighted={highlightedMessageId === msg.id}
                  onReplyTo={onReplyTo}
                  onOpenChatInput={onOpenChatInput}
                  onOpenUserProfile={onOpenUserProfile}
                  onScrollToMessage={scrollToMessage}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  }
);

RoomChatSection.displayName = 'RoomChatSection';
