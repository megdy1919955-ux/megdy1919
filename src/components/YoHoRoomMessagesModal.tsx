import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  UnifiedChatMessagesView,
  YoHoChatMessageItem,
  ChatMessageEntry,
  INITIAL_CHATS_DATA
} from './UnifiedChatMessagesView';

export type { YoHoChatMessageItem, ChatMessageEntry };
export { INITIAL_CHATS_DATA };

interface YoHoRoomMessagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenUserProfile?: (user: any) => void;
}

export const YoHoRoomMessagesModal: React.FC<YoHoRoomMessagesModalProps> = ({
  isOpen,
  onClose,
  onOpenUserProfile
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div
          id="yoho-messages-modal-overlay"
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs select-none"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg h-[82vh] max-h-[700px] bg-white rounded-t-3xl shadow-2xl flex flex-col overflow-hidden relative"
          >
            {/* Top Sheet Drag Indicator */}
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mt-2 shrink-0 opacity-80" />

            {/* Unified Chat Messages Content */}
            <div className="flex-1 w-full h-full overflow-hidden">
              <UnifiedChatMessagesView
                isModalMode={true}
                onCloseModal={onClose}
                onOpenUserProfile={onOpenUserProfile}
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
