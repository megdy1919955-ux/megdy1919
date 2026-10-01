import React from 'react';
import { Users } from 'lucide-react';
import { FamilyModal } from '../FamilyModal';

export interface RoomFamilyBadgeProps {
  onOpen: () => void;
}

/**
 * شارة العائلة والأسرة السريعة (مكون زر منفصل)
 */
export const RoomFamilyBadge: React.FC<RoomFamilyBadgeProps> = ({ onOpen }) => {
  return (
    <button
      onClick={onOpen}
      className="bg-gradient-to-r from-purple-600 to-indigo-600 text-purple-100 px-1.5 py-0.5 rounded-full border border-purple-300/40 flex items-center gap-0.5 text-[8px] font-black shadow-2xs hover:border-purple-300 transition-colors cursor-pointer"
      title="عائلة المستخدم والقبيلة"
    >
      <Users className="w-2.5 h-2.5 text-purple-200" />
      <span>العائلة</span>
    </button>
  );
};

export interface RoomFamilyModalContainerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRoom?: (roomId: string) => void;
}

/**
 * وحدة العائلة المنفصلة (تضم نافذة العائلة بالكامل معزولة عن كود الروم الرئيسي)
 */
export const RoomFamilyModalContainer: React.FC<RoomFamilyModalContainerProps> = ({
  isOpen,
  onClose,
  onSelectRoom
}) => {
  if (!isOpen) return null;

  return (
    <FamilyModal
      isOpen={isOpen}
      onClose={onClose}
      onSelectRoom={onSelectRoom}
    />
  );
};
