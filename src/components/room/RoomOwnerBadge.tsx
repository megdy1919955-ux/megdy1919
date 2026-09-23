import React from 'react';
import { User } from 'lucide-react';

export interface RoomOwnerBadgeProps {
  className?: string;
  size?: 'sm' | 'md';
}

/**
 * RoomOwnerBadge:
 * إشارة رجل باللون الأزرق لتمييز صاحب الروم (المالك)
 * تظهر بجانب الاسم فقط إذا كان الروم خاص بالمستخدم (صاحب الروم)
 * أما إذا كان مضيفاً عادياً، يظهر الاسم طبيعياً بدون هذه الإشارة.
 */
export const RoomOwnerBadge: React.FC<RoomOwnerBadgeProps> = ({
  className = '',
  size = 'sm',
}) => {
  const isSm = size === 'sm';
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full bg-blue-500/20 border border-blue-400 text-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.7)] shrink-0 select-none ${
        isSm ? 'w-3.5 h-3.5 p-0.5' : 'w-4 h-4 p-0.5'
      } ${className}`}
      title="صاحب الروم (المالك)"
    >
      <User className={`${isSm ? 'w-2.5 h-2.5' : 'w-3 h-3'} fill-blue-400 stroke-[2.2]`} />
    </span>
  );
};
