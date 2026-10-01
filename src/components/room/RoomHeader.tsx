import React from 'react';
import { Users, MoreHorizontal, Power } from 'lucide-react';
import { RoomTitleCapsule } from './RoomTitleCapsule';

export interface RoomHeaderProps {
  // بيانات العنوان والمضيف
  roomTitle: string;
  roomAvatar: string;
  hostName: string;
  roomId?: string;
  isOwner?: boolean;
  isRoomLocked?: boolean;
  listenerCount?: number;

  // توجيهات الأزرار (مفصولة تماماً بدون أي أوامر داخلية)
  onOpenRoomInfo?: () => void;
  onOpenHostProfile?: () => void;
  onOpenAudienceList?: () => void;
  onOpenSettingsMenu?: () => void;
  onExitRoom?: () => void;
}

/**
 * هيدر الغرفة (RoomHeader)
 * يجمع كبسولة العنوان المنفصلة مع أزرار التحكم العلوية المستقلة
 */
export const RoomHeader: React.FC<RoomHeaderProps> = ({
  roomTitle,
  roomAvatar,
  hostName,
  roomId = '',
  isOwner = true,
  isRoomLocked = false,
  listenerCount = 1,
  onOpenRoomInfo,
  onOpenHostProfile,
  onOpenAudienceList,
  onOpenSettingsMenu,
  onExitRoom
}) => {
  return (
    <div
      id="room-top-header"
      className="w-full flex items-center justify-between gap-2 px-3 py-1.5 select-none"
    >
      {/* 1. كبسولة عنوان الغرفة المنفصلة تماماً (كما كانت سابقاً بدقة) */}
      <RoomTitleCapsule
        roomTitle={roomTitle}
        roomAvatar={roomAvatar}
        hostName={hostName}
        roomId={roomId}
        isOwner={isOwner}
        isRoomLocked={isRoomLocked}
        onOpenRoomInfo={onOpenRoomInfo}
        onOpenHostProfile={onOpenHostProfile}
      />

      {/* 2. الأزرار العلوية المستقلة (الحضور، الخيارات، الخروج) */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* زر عدد المستمعين والجمهور */}
        <button
          onClick={onOpenAudienceList}
          title="قائمة الحضور"
          className="flex items-center gap-1 bg-[#1A2132]/90 hover:bg-slate-700/80 border border-white/10 px-2.5 py-1.5 rounded-full text-slate-200 text-xs active:scale-95 transition-all shadow-sm"
        >
          <Users className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-bold font-mono text-[11px]">{listenerCount}</span>
        </button>

        {/* زر خيارات وإعدادات الغرفة */}
        <button
          onClick={onOpenSettingsMenu}
          title="خيارات الغرفة"
          className="w-8 h-8 rounded-full bg-[#1A2132]/90 hover:bg-slate-700/80 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white active:scale-95 transition-all shadow-sm"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>

        {/* زر الخروج من الغرفة */}
        <button
          onClick={onExitRoom}
          title="مغادرة الغرفة"
          className="w-8 h-8 rounded-full bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 flex items-center justify-center text-rose-400 active:scale-95 transition-all shadow-sm"
        >
          <Power className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
