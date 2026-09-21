import React from 'react';
import { RoomExitModal } from '../../RoomExitModal';

interface RoomExitSectionProps {
  isOpen: boolean;
  onClose: () => void;
  onKeepInBackground: () => void;
  onExit: () => void;
  onDissolveAll: () => void;
  isOwner: boolean;
  roomTitle: string;
  hostName: string;
  onTriggerToast?: (message: string) => void;
}

export const RoomExitSection: React.FC<RoomExitSectionProps> = ({
  isOpen,
  onClose,
  onKeepInBackground,
  onExit,
  onDissolveAll,
  isOwner,
  roomTitle,
  hostName,
  onTriggerToast
}) => {
  return (
    <RoomExitModal
      isOpen={isOpen}
      onClose={onClose}
      onKeepInBackground={onKeepInBackground}
      onExit={onExit}
      onDissolveAll={onDissolveAll}
      isOwner={isOwner}
      roomTitle={roomTitle}
      hostName={hostName}
      onTriggerToast={onTriggerToast}
    />
  );
};
