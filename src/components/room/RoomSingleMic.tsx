import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Plus, Mic, MicOff } from 'lucide-react';
import { MicSeat } from './roomTypes';

export interface SeatReactionData {
  id: string;
  emoji: string;
  name: string;
  iconUrl?: string;
}

export interface RoomSingleMicProps {
  seat: MicSeat;
  onSeatClick?: (seatId: number) => void;
  activeReaction?: SeatReactionData | null;
}

/**
 * هيكل المايك المنفصل المستقل (RoomSingleMic)
 * - ثابت 100% بدون أي اهتزاز عند اللمس أو التمرير (Rock-solid static stability).
 * - بدون أي فئات حركية مسببة للاهتزاز (no active:scale or hover shift).
 * - الرقم تحت المقعد مباشرة والدائرة موسعة ونظيفة تماماً.
 */
export const RoomSingleMic: React.FC<RoomSingleMicProps> = ({
  seat,
  onSeatClick,
  activeReaction
}) => {
  const isEmpty = seat.isEmpty || !seat.userName || seat.userName === String(seat.id);

  return (
    <div
      onClick={() => onSeatClick && onSeatClick(seat.id)}
      className="flex flex-col items-center justify-center cursor-pointer select-none group relative"
      title={isEmpty ? `مقعد ${seat.id}` : `${seat.userName} (مقعد ${seat.id})`}
    >
      {/* 1. دائرة المقعد الموسعة الثابتة تماماً بدون اهتزاز */}
      <div className="relative w-14 h-14 sm:w-15 sm:h-15 flex items-center justify-center">
        {isEmpty ? (
          // المقعد الفارغ (ثابت ومستقر تماماً)
          <div
            className={`relative w-13 h-13 sm:w-14 sm:h-14 rounded-full border border-dashed flex items-center justify-center shadow-inner overflow-hidden ${
              seat.isLocked
                ? 'border-slate-500/60 bg-slate-900/50 text-slate-400'
                : 'border-white/30 bg-black/35 text-white/80 group-hover:border-amber-400/80 group-hover:text-amber-400'
            }`}
          >
            {seat.isLocked ? (
              <Lock className="w-4.5 h-4.5 text-slate-400 stroke-[2]" />
            ) : (
              <Plus className="w-5 h-5 stroke-[2.5]" />
            )}

            {/* تفاعل الإيموجي في وسط المقعد تماماً ملء البروفايل بدون كتابة وبدون تنطيط */}
            <AnimatePresence>
              {activeReaction && (
                <motion.div
                  key={activeReaction.id}
                  initial={{ scale: 0.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="absolute inset-0 z-30 flex items-center justify-center rounded-full bg-black/60 pointer-events-none"
                >
                  <div className="w-full h-full flex items-center justify-center text-3xl sm:text-4xl select-none leading-none drop-shadow-md">
                    {activeReaction.iconUrl ? (
                      <img
                        src={activeReaction.iconUrl}
                        alt="emoji"
                        className="w-10 h-10 object-contain drop-shadow"
                      />
                    ) : (
                      <span>{activeReaction.emoji}</span>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          // المقعد المشغول بمستخدم (ثابت بدون اهتزاز)
          <div className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-full p-0.5 overflow-hidden">
            <img
              src={
                seat.avatar ||
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'
              }
              alt={seat.userName}
              className={`w-full h-full rounded-full object-cover border-2 shadow-md ${
                seat.isSpeaking
                  ? 'border-amber-400 ring-2 ring-amber-400/60'
                  : seat.isHost
                  ? 'border-amber-400/90'
                  : 'border-slate-400/70'
              }`}
            />

            {/* تفاعل الإيموجي في وسط البروفايل تماماً، ملء البروفايل، بدون كتابة وبدون تنطيط */}
            <AnimatePresence>
              {activeReaction && (
                <motion.div
                  key={activeReaction.id}
                  initial={{ scale: 0.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="absolute inset-0 z-30 flex items-center justify-center rounded-full bg-black/55 backdrop-blur-[0.5px] pointer-events-none"
                >
                  <div className="w-full h-full flex items-center justify-center text-3xl sm:text-4xl select-none leading-none drop-shadow-md">
                    {activeReaction.iconUrl ? (
                      <img
                        src={activeReaction.iconUrl}
                        alt="emoji"
                        className="w-10 h-10 object-contain drop-shadow"
                      />
                    ) : (
                      <span>{activeReaction.emoji}</span>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* شارة كتم المايك */}
            {seat.isMuted && (
              <div className="absolute -bottom-0.5 -right-0.5 w-4.5 h-4.5 rounded-full bg-rose-600 border-1.5 border-[#0B0D17] flex items-center justify-center shadow">
                <MicOff className="w-2.5 h-2.5 text-white stroke-[2.8]" />
              </div>
            )}

            {/* شارة التحدث */}
            {seat.isSpeaking && (
              <div className="absolute -bottom-0.5 -left-0.5 w-4.5 h-4.5 rounded-full bg-emerald-500 border-1.5 border-[#0B0D17] flex items-center justify-center shadow">
                <Mic className="w-2.5 h-2.5 text-white stroke-[2.8]" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. الرقم عند المقعد الفارغ، أو اسم المستخدم عند صعوده للمايك */}
      {isEmpty ? (
        <span className="text-[11px] sm:text-xs font-mono font-bold text-slate-300 leading-none mt-1">
          {seat.id}
        </span>
      ) : (
        <span
          className="text-[10px] sm:text-[11px] font-bold text-amber-200 leading-none mt-1 max-w-[62px] truncate text-center"
          title={seat.userName}
        >
          {seat.userName}
        </span>
      )}
    </div>
  );
};
