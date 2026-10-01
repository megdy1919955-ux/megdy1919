import React from 'react';
import { motion } from 'motion/react';
import { getSpeakingAuraStyles, SpeakingAuraType } from './roomTypes';

export interface SpeakingAuraProps {
  isSpeaking: boolean;
  theme?: string;
  seatShapeRounded?: string;
  dynamicScaleTarget?: number;
  jitterDistance?: number;
  dynamicPulseDuration?: number;
  dynamicGlowIntensity?: number;
  dynamicGlowColor?: string;
  dynamicRingWidth?: number;
  dynamicRingColor?: string;
  normLevel?: number;
}

export const SpeakingAura: React.FC<SpeakingAuraProps> = ({
  isSpeaking,
  theme = 'default',
  seatShapeRounded = 'rounded-full',
  dynamicScaleTarget = 1.08,
  jitterDistance = 0.5,
  dynamicPulseDuration = 0.8,
  dynamicGlowIntensity = 10,
  dynamicGlowColor = 'rgba(52, 211, 153, 0.6)',
  dynamicRingWidth = 2,
  dynamicRingColor = '#34d399',
  normLevel = 0.5,
}) => {
  if (!isSpeaking) return null;

  const auraStyle = getSpeakingAuraStyles(theme as SpeakingAuraType);

  return (
    <>
      {/* 1. Subtle Vibrating Core Ring */}
      <motion.div
        animate={{
          scale: [1, dynamicScaleTarget, 1.01, dynamicScaleTarget, 1],
          x: [-jitterDistance, jitterDistance, -jitterDistance * 0.5, jitterDistance * 0.5, 0],
          y: [jitterDistance * 0.5, -jitterDistance * 0.5, -jitterDistance, jitterDistance, 0],
          opacity: [0.75, 0.95, 0.8, 0.95, 0.75],
        }}
        transition={{
          repeat: Infinity,
          duration: dynamicPulseDuration,
          ease: 'easeInOut',
        }}
        className={`absolute -inset-1 ${seatShapeRounded} pointer-events-none z-0 overflow-visible`}
        style={{
          boxShadow: `0 0 ${dynamicGlowIntensity}px ${dynamicGlowColor}`,
          border: `${dynamicRingWidth}px solid ${dynamicRingColor}`,
        }}
      />

      {/* 2. Expanding Secondary Echo Ring */}
      <motion.div
        animate={{
          scale: [1, Math.max(1.15, dynamicScaleTarget * 1.08), 1],
          opacity: [0.65, 0.12, 0.65],
        }}
        transition={{
          repeat: Infinity,
          duration: Math.max(0.85, 1.25 - normLevel * 0.2),
          ease: 'easeOut',
        }}
        className={`absolute -inset-1 ${seatShapeRounded} pointer-events-none z-0 overflow-visible`}
        style={{
          border: `${Math.max(0.75, dynamicRingWidth * 0.8)}px solid ${dynamicRingColor}`,
          boxShadow: `0 0 ${Math.round(dynamicGlowIntensity * 0.5)}px ${dynamicGlowColor}`,
        }}
      />

      {/* 3. Delicate Soft Rotating Shimmer Ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 5, ease: 'linear' }}
        className={`absolute -inset-1.5 ${seatShapeRounded} pointer-events-none z-0 overflow-visible ${auraStyle.ring3Class}`}
      />
    </>
  );
};

export default React.memo(SpeakingAura);
