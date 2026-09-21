import React from 'react';
import { RoomInfoModal } from '../RoomInfoModal';

export interface RoomInfoModalContainerProps {
  isOpen: boolean;
  onClose: () => void;
  roomTitle: string;
  roomId: string;
  hostAvatar: string;
  hostName: string;
  currentUserRole: 'owner' | 'host' | 'moderator' | 'guest';
  isRoomOwner: boolean;
  currentAppRole: string;
  agencyName?: string;
  agencyOwnerName?: string;
  agencyGid?: string;
  onRoleChange?: (role: 'owner' | 'host' | 'moderator' | 'guest') => void;
  onOpenSettings?: () => void;
  onUpdateRoomTitle: (newTitle: string) => void;
  onUpdateRoomAvatar: (newAvatarUrl: string) => void;
}

/**
 * وحدة تفاصيل ومعلومات الروم وإدارة المشرفين وتعديل اسم وصورة الروم المنفصلة
 * مكوّن مغلّف مستقل يخفف شاشة الروم ويعزل إدارة المشرفين وبيانات الروم
 */
export const RoomInfoModalContainer: React.FC<RoomInfoModalContainerProps> = ({
  isOpen,
  onClose,
  roomTitle,
  roomId,
  hostAvatar,
  hostName,
  currentUserRole,
  isRoomOwner,
  currentAppRole,
  agencyName = 'وكالة أبو أمجد لتسجيل المضيفين',
  agencyOwnerName = 'أبو أمجد 👑',
  agencyGid = '88902',
  onRoleChange,
  onOpenSettings,
  onUpdateRoomTitle,
  onUpdateRoomAvatar
}) => {
  if (!isOpen) return null;

  return (
    <RoomInfoModal
      isOpen={isOpen}
      onClose={onClose}
      roomTitle={roomTitle}
      roomId={roomId}
      hostAvatar={hostAvatar}
      hostName={hostName}
      userRole={currentUserRole}
      isRoomOwner={isRoomOwner}
      currentAppRole={currentAppRole}
      agencyName={agencyName}
      agencyOwnerName={agencyOwnerName}
      agencyGid={agencyGid}
      onRoleChange={onRoleChange}
      onOpenSettings={onOpenSettings}
      onUpdateRoomTitle={onUpdateRoomTitle}
      onUpdateRoomAvatar={onUpdateRoomAvatar}
    />
  );
};
