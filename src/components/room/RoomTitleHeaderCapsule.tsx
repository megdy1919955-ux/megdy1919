import React from 'react';
import { Lock } from 'lucide-react';
import { MainRoomCustomizerConfig } from '../../types/roomCustomizer';
import { hexToRgba } from '../../lib/roomCustomizerService';
import { MicSeat } from './roomTypes';

export interface RoomTitleHeaderCapsuleProps {
  currentRoomTitle: string;
  currentRoomAvatar: string;
  hostSeat: MicSeat;
  isRoomLocked: boolean;
  mainRoomConfig?: MainRoomCustomizerConfig;
  onOpenRoomInfo: () => void;
  onOpenHostProfile: () => void;
}

/**
 * كبسولة عنوان الغرفة وهوية المضيف (مكون منفصل خفيف ونظيف)
 * يضم صورة الروم، الاسم مع شريط التمرير الطبيعي، وهوية المضيف وشارة المالك/القفل
 */
export const RoomTitleHeaderCapsule: React.FC<RoomTitleHeaderCapsuleProps> = ({
  currentRoomTitle,
  currentRoomAvatar,
  hostSeat,
  isRoomLocked,
  mainRoomConfig,
  onOpenRoomInfo,
  onOpenHostProfile
}) => {
  const config = mainRoomConfig || ({} as MainRoomCustomizerConfig);

  return (
    <div
      onClick={onOpenRoomInfo}
      style={{
        backgroundColor: hexToRgba(
          config.topBarBgColor || '#1A2132',
          (config.topBarOpacity ?? 90) / 100
        ),
        borderColor: config.topBarBorderColor || 'rgba(245, 158, 11, 0.35)',
        backdropFilter: `blur(${config.topBarBackdropBlur || 16}px)`
      }}
      className="border rounded-xl py-1.5 pr-1.5 pl-3.5 h-13 sm:h-14 flex items-center gap-2.5 min-w-0 max-w-[62%] sm:max-w-[68%] shadow-md cursor-pointer hover:border-amber-400/80 hover:brightness-110 transition-all active:scale-95 group shrink-0"
      title="انقر لعرض شاشة إدارة الغرفة وتعديل الاسم والمشرفين"
    >
      {/* Room Avatar */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          onOpenRoomInfo();
        }}
        className="w-10 h-10 sm:w-10.5 sm:h-10.5 rounded-lg border-2 border-amber-400 overflow-hidden shrink-0 shadow-[0_0_10px_rgba(245,158,11,0.45)] group-hover:scale-105 transition-transform bg-slate-900 cursor-pointer"
        title="انقر لعرض تفاصيل وإعلان الغرفة ووكالة أبو أمجد لتسجيل المضيفين 👑"
      >
        <img
          src={
            currentRoomAvatar ||
            hostSeat.avatar ||
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'
          }
          alt={currentRoomTitle}
          className="w-full h-full object-cover rounded-md"
        />
      </div>

      <div className="flex flex-col min-w-0 justify-center flex-1 overflow-hidden py-0.5">
        {/* Room Title */}
        <div className="overflow-hidden w-full relative h-5 flex items-center">
          {currentRoomTitle.length > 13 ? (
            <span
              className="text-[12.5px] sm:text-[13px] font-black leading-none inline-block whitespace-nowrap animate-natural-marquee tracking-tight"
              style={{ color: config.roomTitleColor || '#ffffff' }}
            >
              {currentRoomTitle}
            </span>
          ) : (
            <span
              className="text-[12.5px] sm:text-[13px] font-black truncate leading-tight block tracking-tight"
              style={{ color: config.roomTitleColor || '#ffffff' }}
            >
              {currentRoomTitle}
            </span>
          )}
        </div>

        {/* Host and Role Status */}
        <span className="text-[9.5px] font-mono text-slate-300 truncate flex items-center gap-1.5 leading-none mt-0.5">
          <span
            onClick={(e) => {
              e.stopPropagation();
              onOpenHostProfile();
            }}
            className="text-amber-300 font-extrabold truncate hover:underline cursor-pointer"
            title="عرض الكارت التعريفي للمضيف"
          >
            {hostSeat.userName}
          </span>
          {isRoomLocked ? (
            <span title="الغرفة مقفلة برمز 🔒">
              <Lock className="w-3 h-3 text-amber-400 stroke-[2.5] shrink-0 animate-pulse" />
            </span>
          ) : (
            <span className="text-[8.5px] text-amber-300 font-bold bg-amber-500/20 border border-amber-500/30 px-1.5 py-0.2 rounded-full shrink-0 flex items-center gap-0.5">
              <span>👑</span>
              <span>المالك</span>
            </span>
          )}
        </span>
      </div>
    </div>
  );
};
