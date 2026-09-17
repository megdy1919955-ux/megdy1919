import React from 'react';
import { MicSeat, SpeakingAuraType } from './roomTypes';
import { MainRoomCustomizerConfig } from '../../types/roomCustomizer';
import { SingleMicSeat } from './SingleMicSeat';

// Dynamic row partition generator matching getPresetRowLayout
export const getRowLayoutForCount = (count: number): number[] => {
  switch (count) {
    case 2:
      return [2];
    case 5:
      return [1, 4];
    case 8:
      return [4, 4];
    case 9:
      return [1, 4, 4];
    case 12:
      return [2, 5, 5];
    case 15:
      return [5, 5, 5];
    case 20:
      return [5, 5, 5, 5];
    default:
      if (count <= 4) return [count];
      if (count <= 8) return [Math.ceil(count / 2), Math.floor(count / 2)];
      if (count <= 15) {
        return [
          Math.ceil(count / 3),
          Math.ceil((count - Math.ceil(count / 3)) / 2),
          Math.floor((count - Math.ceil(count / 3)) / 2)
        ];
      }
      return [5, 5, 5, 5];
  }
};

// Helper function to return team assignment for Team Battle PK based on seat ID & active mic count
export const getTeamForSeat = (
  seatId: number,
  activeMicCount: number,
  ownerJoinedTeam: 'none' | 'red' | 'blue' = 'none'
): 'red' | 'blue' | 'none' => {
  const rowCounts = getRowLayoutForCount(activeMicCount);
  let currentSeatStart = 1;

  for (const rc of rowCounts) {
    if (seatId >= currentSeatStart && seatId < currentSeatStart + rc) {
      const indexInRow = seatId - currentSeatStart;
      if (rc === 1 || seatId === 1) {
        return ownerJoinedTeam;
      }
      const rightHalfSize = Math.ceil(rc / 2);
      return indexInRow < rightHalfSize ? 'red' : 'blue';
    }
    currentSeatStart += rc;
  }

  if (seatId === 1) return ownerJoinedTeam;
  return seatId <= Math.ceil(activeMicCount / 2) ? 'red' : 'blue';
};

// Dynamic vertical spacing helper between mic rows:
export const getMicRowSpacingClass = (count: number) => {
  if (count === 20) return 'space-y-1 sm:space-y-1.5';
  if (count >= 12) return 'space-y-1.5 sm:space-y-2';
  if (count >= 5) return 'space-y-2 sm:space-y-2.5';
  return 'space-y-1';
};

// Dynamic Speaking Wave Aura Style Generator
export const getSpeakingAuraStyles = (aura: SpeakingAuraType = 'default') => {
  switch (aura) {
    case 'gold_fire':
      return {
        ring1Class: 'border-2 border-amber-400 shadow-[0_0_14px_rgba(251,191,36,0.85)]',
        ring2Class: 'border border-orange-400/70 shadow-[0_0_18px_rgba(249,115,22,0.5)]',
        ring3Class: 'border border-dashed border-yellow-300/60',
        avatarBorderClass: 'from-amber-400 via-yellow-300 to-amber-500 shadow-[0_0_18px_rgba(245,158,11,0.9)]',
        scale1: [1, 1.25, 1],
        opacity1: [0.85, 0.25, 0.85],
        scale2: [1, 1.42, 1],
        opacity2: [0.65, 0.1, 0.65],
      };
    case 'neon_purple':
      return {
        ring1Class: 'border-2 border-purple-400 shadow-[0_0_14px_rgba(168,85,247,0.85)]',
        ring2Class: 'border border-pink-400/70 shadow-[0_0_18px_rgba(236,72,153,0.5)]',
        ring3Class: 'border border-dashed border-fuchsia-300/60',
        avatarBorderClass: 'from-purple-400 via-fuchsia-300 to-pink-500 shadow-[0_0_18px_rgba(168,85,247,0.9)]',
        scale1: [1, 1.25, 1],
        opacity1: [0.85, 0.25, 0.85],
        scale2: [1, 1.42, 1],
        opacity2: [0.65, 0.1, 0.65],
      };
    case 'cyan_plasma':
      return {
        ring1Class: 'border-2 border-cyan-400 shadow-[0_0_14px_rgba(6,182,212,0.85)]',
        ring2Class: 'border border-teal-400/70 shadow-[0_0_18px_rgba(20,184,166,0.5)]',
        ring3Class: 'border border-dashed border-emerald-300/60',
        avatarBorderClass: 'from-cyan-400 via-teal-300 to-emerald-400 shadow-[0_0_18px_rgba(6,182,212,0.9)]',
        scale1: [1, 1.25, 1],
        opacity1: [0.85, 0.25, 0.85],
        scale2: [1, 1.42, 1],
        opacity2: [0.65, 0.1, 0.65],
      };
    case 'royal_ruby':
      return {
        ring1Class: 'border-2 border-rose-500 shadow-[0_0_14px_rgba(244,63,94,0.85)]',
        ring2Class: 'border border-red-400/70 shadow-[0_0_18px_rgba(239,68,68,0.5)]',
        ring3Class: 'border border-dashed border-pink-300/60',
        avatarBorderClass: 'from-rose-500 via-pink-400 to-red-600 shadow-[0_0_18px_rgba(244,63,94,0.9)]',
        scale1: [1, 1.25, 1],
        opacity1: [0.85, 0.25, 0.85],
        scale2: [1, 1.42, 1],
        opacity2: [0.65, 0.1, 0.65],
      };
    case 'default':
    default:
      return {
        ring1Class: 'border border-white/35 bg-white/5 shadow-[0_0_8px_rgba(255,255,255,0.2)]',
        ring2Class: 'border border-white/20 shadow-[0_0_10px_rgba(255,255,255,0.15)]',
        ring3Class: 'border border-dashed border-white/15 shadow-none',
        avatarBorderClass: 'from-white/60 via-slate-200/40 to-white/60 shadow-[0_0_8px_rgba(255,255,255,0.3)] ring-1 ring-white/40',
        scale1: [1, 1.12, 1],
        opacity1: [0.4, 0.1, 0.4],
        scale2: [1, 1.2, 1],
        opacity2: [0.25, 0.05, 0.25],
      };
  }
};

export interface RoomMicsGridProps {
  allMicSeats: MicSeat[];
  activeMicCount: number;
  seatRows?: MicSeat[][];
  mainRoomConfig?: MainRoomCustomizerConfig;
  isTeamBattleActive?: boolean;
  teamBattleStatus?: 'idle' | 'preparation' | 'running' | 'ended';
  ownerJoinedTeam?: 'none' | 'red' | 'blue';
  showCountersOnMics?: boolean;
  seatCounters?: Record<number, number>;
  recentlyUpdatedSeatCounters?: Record<number, any>;
  activeSeatReactions?: Record<number, any>;
  isOwner?: boolean;
  isCurrentAdmin?: boolean;
  currentUserRole?: string;
  isSpeakerAudioMuted?: boolean;
  sessionTimerNode?: React.ReactNode;
  hostVipLevel?: number | string;
  onSeatClick: (seatId: number) => void;
  onOpenUserProfile?: (userData: any) => void;
}

export const RoomMicsGrid: React.FC<RoomMicsGridProps> = React.memo(({
  allMicSeats = [],
  activeMicCount = 8,
  seatRows: passedSeatRows,
  mainRoomConfig = {} as MainRoomCustomizerConfig,
  isTeamBattleActive = false,
  teamBattleStatus = 'idle',
  ownerJoinedTeam = 'none' as 'none' | 'red' | 'blue',
  showCountersOnMics = true,
  seatCounters = {},
  recentlyUpdatedSeatCounters = {},
  activeSeatReactions = {},
  isOwner = false,
  isCurrentAdmin = false,
  currentUserRole = 'guest',
  sessionTimerNode,
  hostVipLevel = 6,
  onSeatClick,
}) => {
  const activeSeats = allMicSeats.slice(0, activeMicCount);
  const rowCounts = getRowLayoutForCount(activeMicCount);
  const calculatedSeatRows: MicSeat[][] = [];
  let currentSeatIdx = 0;

  for (const rc of rowCounts) {
    const row = activeSeats.slice(currentSeatIdx, currentSeatIdx + rc);
    if (row.length > 0) {
      calculatedSeatRows.push(row);
    }
    currentSeatIdx += rc;
  }

  const seatRows = passedSeatRows && passedSeatRows.length > 0 ? passedSeatRows : calculatedSeatRows;
  const config = mainRoomConfig || ({} as MainRoomCustomizerConfig);

  const seatShapeRounded =
    config.seatShape === 'squircle'
      ? 'rounded-2xl'
      : config.seatShape === 'rounded_rect'
      ? 'rounded-xl'
      : config.seatShape === 'hexagon'
      ? 'rounded-[28%]'
      : 'rounded-full';

  return (
    <div className={`w-full max-w-full px-3 sm:px-6 pt-1 pb-0 flex flex-col justify-center select-none overflow-visible ${getMicRowSpacingClass(activeMicCount)}`}>
      {seatRows.map((rowSeats, rowIndex) => {
        const colCount = rowSeats.length;
        const gridColsClass =
          colCount === 1
            ? 'grid-cols-1 max-w-[130px] mx-auto'
            : colCount === 2
            ? 'grid-cols-2 w-full max-w-[185px] sm:max-w-[210px] mx-auto justify-items-center gap-2'
            : colCount === 3
            ? 'grid-cols-3 w-full max-w-sm sm:max-w-md mx-auto justify-items-center gap-1.5'
            : colCount === 4
            ? 'grid-cols-4 w-full max-w-md sm:max-w-xl mx-auto justify-items-center gap-1'
            : colCount === 5
            ? 'grid-cols-5 w-full max-w-lg sm:max-w-2xl mx-auto justify-items-center gap-1'
            : colCount === 6
            ? 'grid-cols-6 w-full justify-items-center gap-1'
            : 'grid-cols-7 w-full justify-items-center gap-1';

        const circleSizeClass =
          colCount <= 2 && rowIndex === 0
            ? 'w-17 h-17 sm:w-21 sm:h-21'
            : colCount <= 3
            ? 'w-15.5 h-15.5 sm:w-18.5 sm:h-18.5'
            : colCount <= 4
            ? 'w-14 h-14 sm:w-16.5 sm:h-16.5'
            : 'w-13 h-13 sm:w-15 sm:h-15';

        const iconSizeClass = colCount <= 2 ? 'w-6.5 h-6.5' : colCount <= 4 ? 'w-5.5 h-5.5' : 'w-4.5 h-4.5';

        return (
          <div key={rowIndex} className={`grid ${gridColsClass} justify-center items-start relative z-10 overflow-visible py-0.5`}>
            {rowSeats.map((seat) => {
              const seatTeam = isTeamBattleActive ? getTeamForSeat(seat.id, activeMicCount, ownerJoinedTeam) : null;
              const isTimerSeat = Boolean((seat.id === 20 || (activeMicCount < 20 && seat.id === activeMicCount)) && sessionTimerNode);

              return (
                <SingleMicSeat
                  key={seat.id}
                  seat={seat}
                  circleSizeClass={circleSizeClass}
                  iconSizeClass={iconSizeClass}
                  seatShapeRounded={seatShapeRounded}
                  config={config}
                  isRedTeamSeat={seatTeam === 'red'}
                  isBlueTeamSeat={seatTeam === 'blue'}
                  isTeamBattleActive={isTeamBattleActive}
                  teamBattleStatus={teamBattleStatus}
                  showCountersOnMics={showCountersOnMics}
                  seatCounterValue={seatCounters[seat.id] || 0}
                  recentCounterUpdate={recentlyUpdatedSeatCounters[seat.id]}
                  activeReaction={activeSeatReactions[seat.id]}
                  hostVipLevel={hostVipLevel}
                  isOwner={isOwner}
                  isCurrentAdmin={isCurrentAdmin}
                  currentUserRole={currentUserRole}
                  sessionTimerNode={sessionTimerNode}
                  isTimerSeat={isTimerSeat}
                  onSeatClick={onSeatClick}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
});

RoomMicsGrid.displayName = 'RoomMicsGrid';
