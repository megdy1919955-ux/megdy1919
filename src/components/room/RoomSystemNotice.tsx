import React from 'react';

export interface RoomSystemNoticeProps {
  id: string;
  text: string;
  type?: 'welcome' | 'system' | 'lock';
}

/**
 * مكون رسائل النظام والترحيب المنفصل (RoomSystemNotice)
 * - منفصل 100% ومستقل تماماً عن أي مكون آخر
 * - يظهر إشعار ترحيبي أو إشعار نظام دائري أنيق متدرج
 */
export const RoomSystemNotice: React.FC<RoomSystemNoticeProps> = ({
  text,
  type = 'system'
}) => {
  return (
    <div className="w-fit max-w-[92%] my-1 select-none pointer-events-auto">
      <div
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] leading-tight shadow-xs backdrop-blur-md border ${
          type === 'welcome'
            ? 'bg-amber-500/15 border-amber-400/30 text-amber-300'
            : 'bg-indigo-950/40 border-indigo-500/30 text-indigo-200'
        }`}
      >
        <span className="text-[12px] shrink-0">
          {type === 'welcome' ? '✨' : '📢'}
        </span>
        <span className="font-medium drop-shadow-xs">{text}</span>
      </div>
    </div>
  );
};
