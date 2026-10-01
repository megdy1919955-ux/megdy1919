import React from 'react';
import { MicSeat } from './roomTypes';
import { RoomSingleMic, SeatReactionData } from './RoomSingleMic';

export interface RoomMicsGridProps {
  allMicSeats: MicSeat[];
  activeMicCount?: number;
  onSeatClick?: (seatId: number) => void;
  activeReactions?: Record<number, SeatReactionData>;
}

/**
 * شبكة المقاعد الصوتية لـ 20 مايك (RoomMicsGrid)
 * - شبكة ثابتة تماماً ومستقرة بدون اهتزاز
 * - متناسقة الأبعاد 4 صفوف × 5 أعمدة
 */
export const RoomMicsGrid: React.FC<RoomMicsGridProps> = ({
  allMicSeats,
  activeMicCount = 20,
  onSeatClick,
  activeReactions
}) => {
  const displaySeats = allMicSeats.slice(0, activeMicCount);

  return (
    <div
      id="room-mics-grid-container"
      className="w-full flex flex-col justify-center items-center px-1 select-none shrink-0"
    >
      {/* شبكة 20 مايك (5 أعمدة × 4 صفوف) ثابتة كلياً وبدون أي اهتزاز */}
      <div className="grid grid-cols-5 gap-y-3.5 gap-x-2 sm:gap-x-3 w-full max-w-[450px] justify-items-center items-center">
        {displaySeats.map((seat) => (
          <RoomSingleMic
            key={seat.id}
            seat={seat}
            onSeatClick={onSeatClick}
            activeReaction={activeReactions?.[seat.id]}
          />
        ))}
      </div>
    </div>
  );
};
