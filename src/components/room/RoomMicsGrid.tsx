import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Plus, Mic, MicOff } from 'lucide-react';
import { MicSeat, formatCounterNumber, getRibbonMilestoneTheme, SpeakingAuraType } from './roomTypes';
import { MainRoomCustomizerConfig } from '../../types/roomCustomizer';
import { hexToRgba } from '../../lib/roomCustomizerService';
import { LottieReactionPlayer } from '../LottieReactionPlayer';

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
  if (count === 20) return 'space-y-3 sm:space-y-3.5';
  if (count >= 9) return 'space-y-[15px] sm:space-y-4';
  if (count >= 5) return 'space-y-[22px] sm:space-y-6';
  return 'space-y-2 sm:space-y-2.5';
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
  onSeatClick: (seatId: number) => void;
  onOpenUserProfile?: (userData: any) => void;
}

export const RoomMicsGrid: React.FC<RoomMicsGridProps> = ({
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
    <div className={`w-full max-w-full px-2 pt-1 pb-1 flex flex-col justify-center select-none ${getMicRowSpacingClass(activeMicCount)}`}>
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
          <div key={rowIndex} className={`grid ${gridColsClass} justify-center items-center relative z-10`}>
            {rowSeats.map((seat) => {
              const isSeatHost = seat.isHost || (seat.id === 1 && !seat.isEmpty && seat.userName === 'أميرة الشرق');
              const isSpeaking = seat.isSpeaking && !seat.isMuted;
              const auraStyle = getSpeakingAuraStyles(seat.speakingAura || 'default');
              const seatTeam = isTeamBattleActive ? getTeamForSeat(seat.id, activeMicCount, ownerJoinedTeam) : null;
              const isRedTeamSeat = seatTeam === 'red';
              const isBlueTeamSeat = seatTeam === 'blue';

              const dynamicPulseDuration = config.speakingPulseSpeed || 1.2;
              const dynamicScaleTarget = config.speakingScaleMultiplier || 1.15;
              const dynamicGlowColor = config.speakingGlowColor || '#22c55e';
              const dynamicGlowIntensity = config.speakingGlowIntensity ?? 24;
              const dynamicRingColor = config.speakingRingColor || '#4ade80';
              const dynamicRingWidth = config.speakingRingWidth || 2.5;

              return (
                <div
                  key={seat.id}
                  id={`mic-seat-${seat.id}`}
                  onClick={() => onSeatClick(seat.id)}
                  className="flex flex-col items-center space-y-0.5 cursor-pointer group my-0"
                >
                  <div className="relative">
                    {/* Custom Chair Frame Integration */}
                    {config.customChairFrameUrl && (
                      <div
                        className={`absolute -inset-1.5 ${seatShapeRounded} pointer-events-none z-0 overflow-hidden`}
                        style={{ opacity: (config.customChairFrameOpacity ?? 85) / 100 }}
                      >
                        <img
                          src={config.customChairFrameUrl}
                          alt="chair"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {seat.isEmpty ? (
                      <div
                        style={
                          isRedTeamSeat || isBlueTeamSeat
                            ? undefined
                            : seat.isLocked
                            ? {
                                backgroundColor: hexToRgba(
                                  config.lockedSeatBgColor || '#0f172a',
                                  (config.lockedSeatOpacity ?? 40) / 100
                                ),
                                borderColor: config.lockedSeatBorderColor || '#cbd5e1'
                              }
                            : {
                                backgroundColor: hexToRgba(
                                  config.emptySeatBgColor || '#000000',
                                  (config.emptySeatOpacity ?? 25) / 100
                                ),
                                borderColor: config.emptySeatBorderColor || '#ffffff',
                                borderWidth: `${config.emptySeatBorderWidth || 1.5}px`
                              }
                        }
                        className={`${circleSizeClass} ${seatShapeRounded} border ${
                          isRedTeamSeat
                            ? 'border-2 border-red-500/90 bg-gradient-to-b from-rose-950/80 via-red-950/90 to-amber-950/80 shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                            : isBlueTeamSeat
                            ? 'border-2 border-cyan-400/90 bg-gradient-to-b from-sky-950/80 via-indigo-950/90 to-blue-950/80 shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                            : seat.isLocked
                            ? 'border-dashed text-white shadow-[0_0_12px_rgba(255,255,255,0.15)]'
                            : seat.isMuted
                            ? 'border-dashed text-white shadow-[0_0_12px_rgba(255,255,255,0.15)]'
                            : 'border-dashed text-white'
                        } backdrop-blur-xs flex items-center justify-center shadow-2xs transition-all group-hover:scale-105 relative`}
                      >
                        {seat.isLocked ? (
                          <Lock
                            className={`${iconSizeClass} stroke-[2.2]`}
                            style={{ color: config.lockedSeatLockColor || '#f8fafc' }}
                          />
                        ) : (
                          <Plus
                            className={`${iconSizeClass} stroke-[2.5]`}
                            style={{ color: config.emptySeatPlusColor || '#ffffff' }}
                          />
                        )}

                        {seat.isMutedByAdmin && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                            className="absolute -bottom-0.5 -right-0.5 w-4.5 h-4.5 rounded-full flex items-center justify-center border-1.5 border-[#0B0E17] bg-rose-600 text-white shadow-md z-30 ring-1.5 ring-rose-500/70"
                            title="المقعد مكتوم بواسطة الإدارة 🔇"
                          >
                            <MicOff className="w-2.5 h-2.5 stroke-[2.8]" />
                          </motion.div>
                        )}
                      </div>
                    ) : (
                      <div className="relative flex items-center justify-center">
                        {seat.isInvitationPending && (
                          <motion.div
                            animate={{ scale: [1, 1.16, 1], opacity: [0.9, 0.4, 0.9] }}
                            transition={{ repeat: Infinity, duration: 1.3, ease: 'easeInOut' }}
                            className={`absolute -inset-1.5 ${seatShapeRounded} rounded-full bg-amber-400/35 border-2 border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.95)] pointer-events-none z-0`}
                          />
                        )}

                        {isSpeaking && (
                          <>
                            <motion.div
                              animate={{ scale: [1, dynamicScaleTarget, 1], opacity: [0.35, 0.95, 0.35] }}
                              transition={{ repeat: Infinity, duration: dynamicPulseDuration, ease: 'easeInOut' }}
                              className={`absolute -inset-1 ${seatShapeRounded} pointer-events-none z-0`}
                              style={{
                                boxShadow: `0 0 ${dynamicGlowIntensity}px ${dynamicGlowColor}`,
                                border: `${dynamicRingWidth}px solid ${dynamicRingColor}`
                              }}
                            />
                            <motion.div
                              animate={{ scale: auraStyle.scale2, opacity: auraStyle.opacity2 }}
                              transition={{ repeat: Infinity, duration: 1.6, ease: 'easeOut', delay: 0.2 }}
                              className={`absolute -inset-2 ${seatShapeRounded} pointer-events-none z-0 ${auraStyle.ring2Class}`}
                            />
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ repeat: Infinity, duration: 5, ease: 'linear' }}
                              className={`absolute -inset-1.5 ${seatShapeRounded} pointer-events-none z-0 ${auraStyle.ring3Class}`}
                            />
                          </>
                        )}

                        <div
                          className={`${circleSizeClass} rounded-full p-0.5 bg-gradient-to-tr ${
                            seat.isInvitationPending
                              ? 'from-amber-400 via-yellow-300 to-amber-500 shadow-[0_0_18px_rgba(251,191,36,0.95)] ring-2 ring-amber-400'
                              : isSpeaking
                              ? auraStyle.avatarBorderClass
                              : isRedTeamSeat
                              ? 'from-red-500 via-rose-600 to-amber-500 shadow-[0_0_15px_rgba(239,68,68,0.8)] ring-2 ring-rose-500/60'
                              : isBlueTeamSeat
                              ? 'from-cyan-400 via-blue-500 to-indigo-500 shadow-[0_0_15px_rgba(6,182,212,0.8)] ring-2 ring-cyan-400/60'
                              : Boolean(recentlyUpdatedSeatCounters[seat.id])
                              ? 'from-amber-400 via-yellow-300 to-rose-500 ring-2 ring-amber-400 shadow-[0_0_18px_rgba(251,191,36,0.9)]'
                              : isSeatHost
                              ? 'from-amber-400/90 via-emerald-400/90 to-cyan-400/90 shadow-sm'
                              : 'from-cyan-400/90 to-emerald-400/90 shadow-xs'
                          } relative transition-transform group-hover:scale-105 z-10`}
                        >
                          <AnimatePresence>
                            {recentlyUpdatedSeatCounters[seat.id] && (
                              <motion.div
                                key={recentlyUpdatedSeatCounters[seat.id].id}
                                initial={{ opacity: 0, y: 0, scale: 0.7 }}
                                animate={{
                                  opacity: [0, 1, 1, 0],
                                  y: [-2, -22, -32],
                                  scale: [0.7, 1.15, 0.95],
                                }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 2.2, ease: "easeOut" }}
                                className="absolute -top-7 left-1/2 -translate-x-1/2 z-50 pointer-events-none flex items-center gap-1 bg-gradient-to-r from-amber-500 via-pink-600 to-rose-600 px-2 py-0.5 rounded-full shadow-[0_0_12px_rgba(251,191,36,0.9)] border border-amber-300 whitespace-nowrap"
                              >
                                <span className="text-[10px]">{recentlyUpdatedSeatCounters[seat.id].giftIcon}</span>
                                <span className="font-mono font-black text-[10px] text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)]">
                                  +{formatCounterNumber(recentlyUpdatedSeatCounters[seat.id].amount)}
                                </span>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {isTeamBattleActive && (isRedTeamSeat || isBlueTeamSeat) && (
                            <div
                              className={`absolute -top-1.5 ${
                                isRedTeamSeat ? '-right-1' : '-left-1'
                              } z-30 px-1.5 py-0.2 rounded-full text-[8.5px] font-black shadow-md flex items-center gap-0.5 border ${
                                isRedTeamSeat
                                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white border-rose-300 ring-1 ring-red-500/50'
                                  : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-cyan-300 ring-1 ring-cyan-400/50'
                              }`}
                            >
                              {isRedTeamSeat ? '🚩 أحمر' : 'أزرق 🚩'}
                            </div>
                          )}

                          <img
                            src={seat.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'}
                            alt={seat.userName}
                            className="w-full h-full object-cover rounded-full relative z-10"
                          />

                          {seat.isLocked && !(
                            isSeatHost ||
                            isOwner ||
                            isCurrentAdmin ||
                            currentUserRole === 'owner' ||
                            currentUserRole === 'moderator' ||
                            currentUserRole === 'host' ||
                            seat.userName?.includes('أميرة') ||
                            seat.userName?.includes('سارة') ||
                            seat.userName?.includes('المضيف') ||
                            seat.isHost
                          ) && (
                            <div className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 rounded-full flex items-center justify-center border border-[#0B0E17] bg-indigo-600 text-white shadow-xs z-20" title="المقعد مقفل 🔒">
                              <Lock className="w-2.5 h-2.5 stroke-[2.5]" />
                            </div>
                          )}

                          {seat.isMutedByAdmin && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                              className="absolute -bottom-0.5 -right-0.5 w-4.5 h-4.5 rounded-full flex items-center justify-center border-1.5 border-[#0B0E17] bg-rose-600 text-white shadow-md z-30 ring-1.5 ring-rose-500/70"
                              title="تم كتم المايك بواسطة الإدارة 🔇"
                            >
                              <MicOff className="w-2.5 h-2.5 stroke-[2.8]" />
                            </motion.div>
                          )}

                          {seat.isInvitationPending && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: [1, 1.18, 1] }}
                              transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
                              className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center border-1.5 border-[#0B0E17] bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 text-slate-950 shadow-[0_0_12px_rgba(251,191,36,0.95)] z-30 ring-1.5 ring-amber-300"
                              title="المايك أصفر: بانتظار موافقة المضيف على البقاء في المايك 🎙️"
                            >
                              <Mic className="w-3 h-3 stroke-[3]" />
                            </motion.div>
                          )}

                          {seat.isPendingAudioAcceptance && !seat.isMutedByAdmin && !seat.isInvitationPending && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ repeat: Infinity, duration: 1.5 }}
                              className="absolute -bottom-0.5 -right-0.5 w-4.5 h-4.5 rounded-full flex items-center justify-center border-1.5 border-[#0B0E17] bg-amber-500 text-slate-950 shadow-md z-30 ring-1.5 ring-amber-400/80"
                              title="بانتظار موافقة المضيف لفتح الصوت 🎙️"
                            >
                              <MicOff className="w-2.5 h-2.5 stroke-[2.8]" />
                            </motion.div>
                          )}

                          {activeSeatReactions[seat.id] && (
                            <AnimatePresence>
                              <motion.div
                                initial={{ opacity: 0, scale: 0.2, y: 12 }}
                                animate={{ opacity: 1, scale: 1.25, y: -4 }}
                                exit={{ opacity: 0, scale: 0.3, y: -15 }}
                                transition={{ type: "spring", stiffness: 380, damping: 22 }}
                                className="absolute inset-0 z-40 rounded-full flex items-center justify-center pointer-events-none"
                              >
                                <LottieReactionPlayer
                                  emoji={activeSeatReactions[seat.id].emoji}
                                  emojiType={activeSeatReactions[seat.id].emojiType}
                                  lottieAssetPath={activeSeatReactions[seat.id].lottieAssetPath}
                                  glowColor={activeSeatReactions[seat.id].glowColor}
                                />
                              </motion.div>
                            </AnimatePresence>
                          )}
                        </div>
                      </div>
                    )}

                    {/* DIGITAL COUNTER REALISTIC RIBBON BADGE */}
                    {(isTeamBattleActive ? teamBattleStatus === 'running' : showCountersOnMics) && !seat.isEmpty && !seat.isInvitationPending && (() => {
                      const seatVal = seatCounters[seat.id] || 0;
                      const milestoneTheme = getRibbonMilestoneTheme(seatVal);
                      const isRecentlyUpdated = Boolean(recentlyUpdatedSeatCounters[seat.id]);
                      return (
                        <motion.div
                          animate={isRecentlyUpdated ? { scale: [1, 1.25, 1], y: [0, -3, 0] } : { scale: 1, y: 0 }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                          className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 z-30 pointer-events-none select-none"
                          title={`عداد المايك ${seat.id}: ${milestoneTheme.name}`}
                        >
                          <div className={`relative flex items-center justify-center px-3.5 py-0 min-w-[42px] h-[14px] ${isRecentlyUpdated ? 'drop-shadow-[0_0_8px_rgba(251,191,36,0.95)]' : ''}`}>
                            <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none" viewBox="0 0 72 18" preserveAspectRatio="none">
                              <defs>
                                <linearGradient id={`ribbonGrad-${seat.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                  {milestoneTheme.gradientStops.map((s, idx) => (
                                    <stop key={idx} offset={s.offset} stopColor={s.stopColor} />
                                  ))}
                                </linearGradient>

                                <linearGradient id={`ribbonGloss-${seat.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.65" />
                                  <stop offset="60%" stopColor="#ffffff" stopOpacity="0.15" />
                                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
                                </linearGradient>

                                <filter id={`ribbonShadow-${seat.id}`} x="-20%" y="-20%" width="140%" height="140%">
                                  <feDropShadow dx="0" dy="1.2" stdDeviation="1.0" floodColor={milestoneTheme.shadowColor} floodOpacity="0.75" />
                                </filter>
                              </defs>

                              <path
                                d="M 13,2.5 Q 36,1.2 59,2.5 L 68,1 L 63.5,9 L 69,17 Q 36,18.2 13,17 L 3,17 L 8.5,9 L 4,1 Z"
                                fill={`url(#ribbonGrad-${seat.id})`}
                                filter={`url(#ribbonShadow-${seat.id})`}
                                stroke={milestoneTheme.strokeColor}
                                strokeWidth="0.75"
                              />

                              <path d="M 13,2.5 L 13,17 L 10,9 Z" fill={milestoneTheme.foldColor} opacity="0.5" />
                              <path d="M 59,2.5 L 59,17 L 62,9 Z" fill={milestoneTheme.foldColor} opacity="0.5" />

                              <path
                                d="M 13,2.8 Q 36,1.5 59,2.8 L 59,6 Q 36,4.8 13,6 Z"
                                fill={`url(#ribbonGloss-${seat.id})`}
                              />
                            </svg>

                            <span className="relative z-10 font-black font-mono text-[9.5px] leading-none text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)] tracking-tight">
                              {formatCounterNumber(seatVal)}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })()}
                  </div>

                  {seat.isEmpty ? (
                    <div className="flex items-center justify-center gap-0.5 bg-transparent mt-0.5">
                      <span className="text-[11px] sm:text-[12px] font-black text-white font-mono drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)] leading-none bg-transparent select-none">
                        {seat.id}
                      </span>
                    </div>
                  ) : (
                    <div className="mt-0.5 px-1.5 py-0.2 bg-transparent text-center max-w-[76px] sm:max-w-[84px] truncate flex items-center justify-center gap-0.5">
                      <span
                        className={`text-[9.5px] font-bold truncate block leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)] ${
                          seat.isInvitationPending ? 'text-amber-300' : 'text-white'
                        }`}
                      >
                        {seat.userName}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
