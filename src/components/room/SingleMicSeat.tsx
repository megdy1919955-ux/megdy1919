import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Plus, Mic, MicOff } from 'lucide-react';
import { MicSeat, formatCounterNumber, getRibbonMilestoneTheme } from './roomTypes';
import { MainRoomCustomizerConfig } from '../../types/roomCustomizer';
import { hexToRgba } from '../../lib/roomCustomizerService';
import { LottieReactionPlayer } from '../LottieReactionPlayer';
import { getSpeakingAuraStyles } from './RoomMicsGrid';

export interface SingleMicSeatProps {
  seat: MicSeat;
  circleSizeClass: string;
  iconSizeClass: string;
  seatShapeRounded: string;
  config: MainRoomCustomizerConfig;
  isRedTeamSeat: boolean;
  isBlueTeamSeat: boolean;
  isTeamBattleActive: boolean;
  teamBattleStatus: 'idle' | 'preparation' | 'running' | 'ended';
  showCountersOnMics: boolean;
  seatCounterValue: number;
  recentCounterUpdate?: any;
  activeReaction?: any;
  hostVipLevel?: number | string;
  isOwner?: boolean;
  isCurrentAdmin?: boolean;
  currentUserRole?: string;
  sessionTimerNode?: React.ReactNode;
  isTimerSeat?: boolean;
  onSeatClick: (seatId: number) => void;
}

export const SingleMicSeat: React.FC<SingleMicSeatProps> = React.memo(({
  seat,
  circleSizeClass,
  iconSizeClass,
  seatShapeRounded,
  config,
  isRedTeamSeat,
  isBlueTeamSeat,
  isTeamBattleActive,
  teamBattleStatus,
  showCountersOnMics,
  seatCounterValue,
  recentCounterUpdate,
  activeReaction,
  hostVipLevel = 6,
  isOwner = false,
  isCurrentAdmin = false,
  currentUserRole = 'guest',
  sessionTimerNode,
  isTimerSeat = false,
  onSeatClick,
}) => {
  const isSeatHost = seat.isHost || (seat.id === 1 && !seat.isEmpty && (seat.userName?.includes('أميرة') || seat.userName?.includes('المضيف')));
  const rawVip = seat.vipLevel ?? (isSeatHost ? hostVipLevel : undefined);
  const seatVipNum = typeof rawVip === 'number' ? rawVip : parseInt(rawVip?.toString().match(/\d+/)?.[0] || '0', 10);
  const isVip8Plus = seatVipNum >= 8;
  const isSpeaking = seat.isSpeaking && !seat.isMuted;
  const auraStyle = getSpeakingAuraStyles(seat.speakingAura || 'default');

  const dynamicPulseDuration = config.speakingPulseSpeed || 1.2;
  const dynamicScaleTarget = config.speakingScaleMultiplier || 1.15;
  const dynamicGlowColor = config.speakingGlowColor || '#22c55e';
  const dynamicGlowIntensity = config.speakingGlowIntensity ?? 24;
  const dynamicRingColor = config.speakingRingColor || '#4ade80';
  const dynamicRingWidth = config.speakingRingWidth || 2.5;

  return (
    <div
      id={`mic-seat-${seat.id}`}
      onClick={() => onSeatClick(seat.id)}
      className="flex flex-col items-center space-y-0.5 cursor-pointer group my-0 relative overflow-visible"
    >
      <div className="relative overflow-visible">
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
          <div className="relative flex items-center justify-center overflow-visible">
            {seat.isInvitationPending && (
              <motion.div
                animate={{ scale: [1, 1.16, 1], opacity: [0.9, 0.4, 0.9] }}
                transition={{ repeat: Infinity, duration: 1.3, ease: 'easeInOut' }}
                className={`absolute -inset-1.5 ${seatShapeRounded} rounded-full bg-amber-400/35 border-2 border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.95)] pointer-events-none z-0 overflow-visible`}
              />
            )}

            {isSpeaking && (
              <>
                <motion.div
                  animate={{ scale: [1, dynamicScaleTarget, 1], opacity: [0.35, 0.95, 0.35] }}
                  transition={{ repeat: Infinity, duration: dynamicPulseDuration, ease: 'easeInOut' }}
                  className={`absolute -inset-1 ${seatShapeRounded} pointer-events-none z-0 overflow-visible`}
                  style={{
                    boxShadow: `0 0 ${dynamicGlowIntensity}px ${dynamicGlowColor}`,
                    border: `${dynamicRingWidth}px solid ${dynamicRingColor}`
                  }}
                />
                <motion.div
                  animate={{ scale: auraStyle.scale2, opacity: auraStyle.opacity2 }}
                  transition={{ repeat: Infinity, duration: 1.6, ease: 'easeOut', delay: 0.2 }}
                  className={`absolute -inset-2 ${seatShapeRounded} pointer-events-none z-0 overflow-visible ${auraStyle.ring2Class}`}
                />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 5, ease: 'linear' }}
                  className={`absolute -inset-1.5 ${seatShapeRounded} pointer-events-none z-0 overflow-visible ${auraStyle.ring3Class}`}
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
                  : Boolean(recentCounterUpdate)
                  ? 'from-amber-400 via-yellow-300 to-rose-500 ring-2 ring-amber-400 shadow-[0_0_18px_rgba(251,191,36,0.9)]'
                  : isSeatHost
                  ? 'from-amber-400/90 via-emerald-400/90 to-cyan-400/90 shadow-sm'
                  : 'from-cyan-400/90 to-emerald-400/90 shadow-xs'
              } relative transition-transform group-hover:scale-105 z-10 overflow-visible`}
            >
              <AnimatePresence>
                {recentCounterUpdate && (
                  <motion.div
                    key={recentCounterUpdate.id}
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
                    <span className="text-[10px]">{recentCounterUpdate.giftIcon}</span>
                    <span className="font-mono font-black text-[10px] text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)]">
                      +{formatCounterNumber(recentCounterUpdate.amount)}
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

              {activeReaction && (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.2, y: 12 }}
                    animate={{ opacity: 1, scale: 1.25, y: -4 }}
                    exit={{ opacity: 0, scale: 0.3, y: -15 }}
                    transition={{ type: "spring", stiffness: 380, damping: 22 }}
                    className="absolute inset-0 z-40 rounded-full flex items-center justify-center pointer-events-none"
                  >
                    <LottieReactionPlayer
                      emoji={activeReaction.emoji}
                      emojiType={activeReaction.emojiType}
                      lottieAssetPath={activeReaction.lottieAssetPath}
                      glowColor={activeReaction.glowColor}
                    />
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </div>
        )}

        {/* DIGITAL COUNTER REALISTIC RIBBON BADGE */}
        {(isTeamBattleActive ? teamBattleStatus === 'running' : showCountersOnMics) && !seat.isEmpty && !seat.isInvitationPending && (() => {
          const seatVal = seatCounterValue || 0;
          const milestoneTheme = getRibbonMilestoneTheme(seatVal);
          const isRecentlyUpdated = Boolean(recentCounterUpdate);
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
        <div className="mt-0.5 px-0.5 py-0.2 bg-transparent text-center max-w-[76px] sm:max-w-[84px] flex flex-col items-center justify-center">
          <div className="max-w-full truncate flex items-center justify-center">
            <span
              className={`text-[9.5px] truncate block leading-tight ${
                isSeatHost
                  ? isVip8Plus
                    ? 'text-red-500 font-black drop-shadow-[0_1px_3px_rgba(239,68,68,0.8)]'
                    : 'text-white font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)]'
                  : seat.isInvitationPending
                  ? 'text-amber-300 font-bold'
                  : 'text-white font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)]'
              }`}
            >
              {seat.userName}
            </span>
          </div>
        </div>
      )}

      {/* SESSION TIMER COMPONENT */}
      {isTimerSeat && sessionTimerNode && (
        <div className="absolute top-full mt-0.5 left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none select-none z-40 whitespace-nowrap">
          {sessionTimerNode}
        </div>
      )}
    </div>
  );
});

SingleMicSeat.displayName = 'SingleMicSeat';
