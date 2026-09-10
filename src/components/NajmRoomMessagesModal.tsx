import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  UnifiedChatMessagesView,
  NajmChatMessageItem,
  ChatMessageEntry,
  INITIAL_CHATS_DATA
} from './UnifiedChatMessagesView';

export type { NajmChatMessageItem, ChatMessageEntry };
export type YoHoChatMessageItem = NajmChatMessageItem;
export { INITIAL_CHATS_DATA };

interface NajmRoomMessagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenUserProfile?: (user: any) => void;
  targetUser?: any;
}

export const NajmRoomMessagesModal: React.FC<NajmRoomMessagesModalProps> = ({
  isOpen,
  onClose,
  onOpenUserProfile,
  targetUser
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div
          id="najm-messages-modal-overlay"
          className="fixed inset-0 z-50 flex items-end justify-center bg-transparent select-none"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg h-[80vh] max-h-[700px] bg-white rounded-t-3xl shadow-2xl flex flex-col overflow-hidden relative"
          >
            {/* Top Sheet Drag Indicator */}
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mt-2 shrink-0 opacity-80" />

            {/* Unified Chat Messages Content */}
            <div className="flex-1 w-full h-full overflow-hidden">
              <UnifiedChatMessagesView
                isModalMode={true}
                onCloseModal={onClose}
                onOpenUserProfile={onOpenUserProfile}
                initialTargetUser={targetUser}
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export const YoHoRoomMessagesModal = NajmRoomMessagesModal;
export default NajmRoomMessagesModal;
