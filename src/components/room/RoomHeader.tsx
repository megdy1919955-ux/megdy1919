import React from 'react';
import { Users, MoreHorizontal, Power } from 'lucide-react';
import { MainRoomCustomizerConfig } from '../../types/roomCustomizer';
import { MicSeat } from './roomTypes';
import { RoomTitleHeaderCapsule } from './RoomTitleHeaderCapsule';

export interface RoomHeaderProps {
  currentRoomTitle: string;
  currentRoomAvatar: string;
  hostSeat: MicSeat;
  isRoomLocked: boolean;
  mainRoomConfig?: MainRoomCustomizerConfig;
  isRegularUser: boolean;
  onOpenRoomInfo: () => void;
  onOpenHostProfile: () => void;
  onOpenAudienceModal: () => void;
  onOpenOptionsMenu: () => void;
  onOpenExitModal: () => void;
}

export const RoomHeader: React.FC<RoomHeaderProps> = ({
  currentRoomTitle,
  currentRoomAvatar,
  hostSeat,
  isRoomLocked,
  mainRoomConfig,
  isRegularUser,
  onOpenRoomInfo,
  onOpenHostProfile,
  onOpenAudienceModal,
  onOpenOptionsMenu,
  onOpenExitModal
}) => {
  const config = mainRoomConfig || ({} as MainRoomCustomizerConfig);

  return (
    <div className="flex items-center justify-between gap-1.5 w-full select-none">
      {/* Right Section (in RTL: 1st in DOM): Decoupled Room Title & Host Profile Capsule */}
      <RoomTitleHeaderCapsule
        currentRoomTitle={currentRoomTitle}
        currentRoomAvatar={currentRoomAvatar}
        hostSeat={hostSeat}
        isRoomLocked={isRoomLocked}
        mainRoomConfig={mainRoomConfig}
        onOpenRoomInfo={onOpenRoomInfo}
        onOpenHostProfile={onOpenHostProfile}
      />

      {/* Left Section (in RTL: 2nd in DOM): Listener Count, 3-Dots Options Menu, Power */}
      <div className="flex items-center gap-1 shrink-0">
        {/* Listener Count Pill */}
        <button
          id="room-top-audience"
          onClick={onOpenAudienceModal}
          style={{
            backgroundColor: config.topAudiencePillBg || '#1A2132'
          }}
          className="hover:brightness-125 border border-white/10 px-2 py-1 rounded-full flex items-center gap-1 text-[11px] font-bold text-slate-200 shadow-xs cursor-pointer transition-colors active:scale-95"
          title="انقر لعرض قائمة الحضور والمستمعين"
        >
          <Users className="w-3 h-3 text-indigo-400" />
          <span className="font-mono text-[11px] text-white">18</span>
        </button>

        {/* Three-Dots Options Menu Button */}
        <button
          id="room-top-more-options"
          onClick={onOpenOptionsMenu}
          style={{
            backgroundColor: config.topMoreBtnBg || '#1A2132'
          }}
          className="w-7.5 h-7.5 rounded-full hover:brightness-125 border border-white/10 flex items-center justify-center text-slate-200 cursor-pointer relative transition-colors active:scale-95 shadow-xs"
          title="خيارات وإعدادات الغرفة"
        >
          <MoreHorizontal className="w-4 h-4" />
          <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-red-500 ring-1.5 ring-[#0B0E17]" />
        </button>

        {/* Power/Close Button */}
        <button
          onClick={onOpenExitModal}
          style={{
            backgroundColor: config.topPowerBtnBg || '#1A2132'
          }}
          className="w-7.5 h-7.5 rounded-full hover:bg-red-900/50 border border-white/10 flex items-center justify-center text-slate-200 cursor-pointer transition-colors shadow-xs active:scale-95"
          title="مغادرة / إغلاق الغرفة"
        >
          <Power className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
