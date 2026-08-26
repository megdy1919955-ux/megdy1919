import React from 'react';
import { UnifiedChatMessagesView } from './UnifiedChatMessagesView';

export const MessagesScreen: React.FC = () => {
  return (
    <div className="w-full h-full min-h-[calc(100vh-80px)] flex flex-col bg-white pb-20 select-none">
      <UnifiedChatMessagesView isModalMode={false} />
    </div>
  );
};
