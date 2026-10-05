import React from 'react';
import { Search, Lightbulb, X, Play, Clapperboard } from 'lucide-react';
import { RedCinemaSeat } from '../RedCinemaSeat';
import { SeatUser } from '../../types';
import { CinemaVideoItem } from '../CinemaYouTubePickerModal';

interface RoomCinemaSectionProps {
  selectedCinemaVideo: CinemaVideoItem | null;
  videoSuggestions: CinemaVideoItem[];
  isOwner: boolean;
  allMicSeats: SeatUser[];
  onOpenVideoPicker: () => void;
  onCloseCinema: () => void;
  onSeatClick: (seatId: number) => void;
}

export const RoomCinemaSection: React.FC<RoomCinemaSectionProps> = ({
  selectedCinemaVideo,
  videoSuggestions,
  isOwner,
  allMicSeats,
  onOpenVideoPicker,
  onCloseCinema,
  onSeatClick,
}) => {
  return (
    <div className="w-full flex flex-col items-center space-y-2 sm:space-y-3 z-10">
      {/* 1. TOP VIDEO SCREEN BOX */}
      <div className="w-full max-w-md mx-auto h-[205px] sm:h-[225px] bg-[#000000]/95 border border-white/10 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden shadow-[0_10px_35px_rgba(0,0,0,0.9)] select-none">
        {/* Minimal Top Control Header */}
        <div className="absolute top-2 inset-x-2.5 flex items-center justify-between z-30 pointer-events-auto">
          {selectedCinemaVideo ? (
            <button
              onClick={onOpenVideoPicker}
              className={`px-2.5 py-1 rounded-full text-white text-[11px] font-bold border flex items-center gap-1.5 cursor-pointer backdrop-blur-xs shadow-md transition-all active:scale-95 ${
                isOwner
                  ? 'bg-black/80 hover:bg-black/95 border-emerald-500/40 text-emerald-300'
                  : 'bg-black/80 hover:bg-black/95 border-amber-500/40 text-amber-300'
              }`}
              title={isOwner ? "إدارة الفيديوهات وقائمة الاقتراحات" : "اقتراح فيديو آخر لصاحب الغرفة"}
            >
              {isOwner ? (
                <>
                  <Search className="w-3.5 h-3.5 text-emerald-400" />
                  <span>بحث / إدارة {videoSuggestions.length > 0 ? `(${videoSuggestions.length})` : ''}</span>
                </>
              ) : (
                <>
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  <span>اقتراح فيديو 💡</span>
                </>
              )}
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={onCloseCinema}
            className="p-1.5 rounded-full bg-black/75 hover:bg-rose-600/90 text-white border border-white/15 transition-colors cursor-pointer backdrop-blur-xs shadow-md"
            title={isOwner ? "إغلاق وضع السينما والعودة للمقاعد" : "إغلاق الشاشة متاح لمالك الغرفة فقط"}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {selectedCinemaVideo ? (
          /* Clean YouTube Player with Minimal Fixed Frame */
          <div className="w-full h-full flex flex-col relative z-10 bg-black">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${selectedCinemaVideo.youtubeId}?autoplay=1&enablejsapi=1&rel=0&modestbranding=1&controls=1&fs=0`}
              title={selectedCinemaVideo.title}
              className="w-full h-full border-0 bg-black"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        ) : (
          /* Minimal Empty Cinema Screen */
          <div className="flex flex-col items-center justify-center text-center z-10 space-y-2 px-4">
            {/* Clapperboard Slate Icon */}
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 shadow-inner mb-0.5">
              <Clapperboard className="w-8 h-8 text-slate-300 stroke-[1.4]" />
            </div>

            {/* Action Button: Owner selects/plays, Non-owner suggests */}
            <button
              onClick={onOpenVideoPicker}
              className={`px-8 sm:px-9 py-2.5 rounded-full font-black text-xs sm:text-sm active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer ${
                isOwner
                  ? 'bg-[#00E676] hover:bg-[#00c853] text-[#003314] shadow-[0_0_20px_rgba(0,230,118,0.45)]'
                  : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-[0_0_20px_rgba(251,191,36,0.35)]'
              }`}
            >
              {isOwner ? (
                <>
                  <Play className="w-3.5 h-3.5 fill-[#003314]" />
                  <span>تحديد وتشغيل فيديو</span>
                </>
              ) : (
                <>
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>اقتراح فيديو للمالك 💡</span>
                </>
              )}
            </button>

            {/* Subtitle text */}
            <p className="text-[11px] sm:text-xs text-slate-400 font-medium tracking-tight">
              {isOwner
                ? 'مشاهدة الفيديو والدردشة مع الأصدقاء'
                : 'يمكن للمشرفين والأعضاء اقتراح مقاطع ليعتمدها مالك الغرفة'}
            </p>
          </div>
        )}
      </div>

      {/* 2. THE 8 LUXURY RED CINEMA SEATS (2 Rows of 4 Seats) */}
      <div className="w-full max-w-md mx-auto space-y-1 sm:space-y-1.5 pt-0.5">
        {/* Row 1: Seats 1, 2, 3, 4 */}
        <div className="grid grid-cols-4 gap-1 sm:gap-2 justify-items-center dir-rtl">
          {[1, 2, 3, 4].map((seatId) => {
            const seatData = allMicSeats.find((s) => s.id === seatId);
            return (
              <RedCinemaSeat
                key={`cinema-seat-${seatId}`}
                seatNumber={seatId}
                seatData={seatData}
                onClick={() => onSeatClick(seatId)}
              />
            );
          })}
        </div>

        {/* Row 2: Seats 5, 6, 7, 8 */}
        <div className="grid grid-cols-4 gap-1 sm:gap-2 justify-items-center dir-rtl">
          {[5, 6, 7, 8].map((seatId) => {
            const seatData = allMicSeats.find((s) => s.id === seatId);
            return (
              <RedCinemaSeat
                key={`cinema-seat-${seatId}`}
                seatNumber={seatId}
                seatData={seatData}
                onClick={() => onSeatClick(seatId)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
