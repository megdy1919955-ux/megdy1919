import React from 'react';
import { Lock } from 'lucide-react';

export interface RoomTitleCapsuleProps {
  roomTitle: string;
  roomAvatar: string;
  hostName: string;
  roomId?: string;
  isOwner?: boolean;
  isRoomLocked?: boolean;
  onOpenRoomInfo?: () => void;
  onOpenHostProfile?: () => void;
}

/**
 * كبسولة عنوان الروم (RoomTitleCapsule)
 * هيكل مستقل 100% ومنفصل تماماً، يعرض تصميم عنوان الروم الأصلي الفخم:
 * - صورة الروم المربعة بحواف مستديرة وإطار ذهبي
 * - عنوان الروم بخط عريض وأنيق مع شريط حركة النص (Marquee)
 * - اسم المضيف وشارة المالك 👑 وشارة القفل 🔒
 * - بدون أي أوامر أو أزرار متداخلة.
 */
export const RoomTitleCapsule: React.FC<RoomTitleCapsuleProps> = ({
  roomTitle,
  roomAvatar,
  hostName,
  roomId = '',
  isOwner = true,
  isRoomLocked = false,
  onOpenRoomInfo,
  onOpenHostProfile
}) => {
  return (
    <div
      onClick={onOpenRoomInfo}
      className="bg-[#1A2132]/90 border border-amber-500/35 backdrop-blur-md rounded-xl py-1.5 pr-1.5 pl-3 h-13 sm:h-14 flex items-center gap-2.5 min-w-0 max-w-[65%] sm:max-w-[70%] shadow-md cursor-pointer hover:border-amber-400 hover:brightness-110 transition-all active:scale-95 select-none shrink-0"
      title="معلومات وإدارة الغرفة"
    >
      {/* 1. صورة الغرفة الأنيقة */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          if (onOpenRoomInfo) onOpenRoomInfo();
        }}
        className="w-10 h-10 sm:w-10.5 sm:h-10.5 rounded-lg border-2 border-amber-400 overflow-hidden shrink-0 shadow-[0_0_10px_rgba(245,158,11,0.45)] bg-slate-900 cursor-pointer"
      >
        <img
          src={
            roomAvatar ||
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'
          }
          alt={roomTitle}
          className="w-full h-full object-cover rounded-md"
        />
      </div>

      {/* 2. بيانات العنوان والمضيف */}
      <div className="flex flex-col min-w-0 justify-center flex-1 overflow-hidden py-0.5">
        {/* عنوان الروم */}
        <div className="overflow-hidden w-full relative h-5 flex items-center">
          {roomTitle.length > 14 ? (
            <span className="text-[12.5px] sm:text-[13px] font-black leading-none inline-block whitespace-nowrap animate-natural-marquee tracking-tight text-white">
              {roomTitle}
            </span>
          ) : (
            <span className="text-[12.5px] sm:text-[13px] font-black truncate leading-tight block tracking-tight text-white">
              {roomTitle}
            </span>
          )}
        </div>

        {/* المضيف والشارات (المالك 👑 أو القفل 🔒) */}
        <div className="text-[9.5px] font-mono text-slate-300 truncate flex items-center gap-1.5 leading-none mt-0.5">
          <span
            onClick={(e) => {
              e.stopPropagation();
              if (onOpenHostProfile) onOpenHostProfile();
            }}
            className="text-amber-300 font-extrabold truncate hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>{hostName || 'مضيف الغرفة'}</span>
          </span>

          {/* شارة القفل أو شارة المالك */}
          {isRoomLocked ? (
            <span title="الغرفة مقفلة 🔒">
              <Lock className="w-3 h-3 text-amber-400 stroke-[2.5] shrink-0 animate-pulse" />
            </span>
          ) : isOwner ? (
            <span className="text-[8.5px] text-amber-300 font-bold bg-amber-500/20 border border-amber-500/30 px-1.5 py-0.2 rounded-full shrink-0 flex items-center gap-0.5">
              <span>👑</span>
              <span>المالك</span>
            </span>
          ) : (
            <span className="text-[8.5px] text-slate-300 font-bold bg-slate-700/40 border border-slate-600/30 px-1.5 py-0.2 rounded-full shrink-0 flex items-center gap-0.5">
              <span>🎙️</span>
              <span>مضيف</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
