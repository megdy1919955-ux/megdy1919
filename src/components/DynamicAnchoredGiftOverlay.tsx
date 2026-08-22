import React, { useEffect, useRef, useState } from 'react';
import { isVideoResource, isMediaUrl, getCleanGiftEmoji } from '../lib/giftCmsService';

export interface DynamicFlyingGift {
  id: string;
  icon: string;
  targetElementId: string;
  fallbackTargetPct: { x: number; y: number };
  delay: number;
  renderLayer?: 'behind_mics' | 'above_mics';
  particles: {
    id: number;
    symbol: string;
    offsetX: number;
    offsetY: number;
    delay: number;
  }[];
}

interface DynamicAnchoredGiftOverlayProps {
  flyingGifts: DynamicFlyingGift[];
  containerRef: React.RefObject<HTMLDivElement | null>;
  onComplete: (id: string) => void;
}

interface SingleGiftFlightProps {
  gift: DynamicFlyingGift;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onComplete: (id: string) => void;
}

const SingleGiftFlight: React.FC<SingleGiftFlightProps> = ({ gift, containerRef, onComplete }) => {
  const [flightState, setFlightState] = useState<{
    phase: 'waiting' | 'flying' | 'done';
    x: number;
    y: number;
    scale: number;
    opacity: number;
    rotation: number;
  }>({
    phase: 'waiting',
    x: 0,
    y: 0,
    scale: 0.3,
    opacity: 0,
    rotation: 0,
  });

  const startTimeRef = useRef<number | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const completedRef = useRef<boolean>(false);
  const lockedTargetRef = useRef<{
    startX: number;
    startY: number;
    targetX: number;
    targetY: number;
    apexY: number;
    deltaX: number;
    deltaY: number;
    distance: number;
    travelDuration: number;
  } | null>(null);

  useEffect(() => {
    // Initialize & Lock Target and Start coordinates ONCE
    const resolveTarget = () => {
      const container = containerRef.current || document.getElementById('voice-room-container');
      const containerRect = container ? container.getBoundingClientRect() : {
        left: 0,
        top: 0,
        width: typeof window !== 'undefined' ? window.innerWidth : 390,
        height: typeof window !== 'undefined' ? window.innerHeight : 844,
      };

      // Start point: Launch directly from the Gift Box / Send Button at the bottom of the screen
      let startX = containerRect.width / 2;
      let startY = containerRect.height - 60;

      const sendBtnElem = document.getElementById('gift-send-btn');
      const giftBtnElem = document.getElementById('room-gift-button');
      const originElem = sendBtnElem || giftBtnElem;

      if (originElem) {
        const originRect = originElem.getBoundingClientRect();
        if (originRect.width > 0 && originRect.height > 0) {
          startX = (originRect.left + originRect.width / 2) - containerRect.left;
          startY = (originRect.top + originRect.height / 2) - containerRect.top;
        }
      }

      let targetX = (gift.fallbackTargetPct.x / 100) * containerRect.width;
      let targetY = (gift.fallbackTargetPct.y / 100) * containerRect.height;

      // Check DOM element once with exact center positioning over the mic seat
      const targetElem = document.getElementById(gift.targetElementId);
      if (targetElem) {
        const avatarElem = (targetElem.querySelector('.rounded-full') || targetElem) as HTMLElement;
        const targetRect = avatarElem.getBoundingClientRect();
        if (targetRect.width > 0 && targetRect.height > 0) {
          targetX = (targetRect.left + targetRect.width / 2) - containerRect.left;
          // Target placed precisely on the center of the mic avatar
          targetY = (targetRect.top + targetRect.height / 2) - containerRect.top;
        }
      }

      const deltaX = targetX - startX;
      const deltaY = targetY - startY;
      const distance = Math.max(100, Math.hypot(deltaX, deltaY));
      const travelDuration = 0.9;

      return {
        startX,
        startY,
        targetX,
        targetY,
        apexY: targetY - 20,
        deltaX,
        deltaY,
        distance,
        travelDuration,
      };
    };

    lockedTargetRef.current = resolveTarget();

    const animate = (timestamp: number) => {
      if (completedRef.current) return;

      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      if (!lockedTargetRef.current) {
        lockedTargetRef.current = resolveTarget();
      }

      const {
        startX,
        startY,
        targetX,
        targetY,
        deltaX,
        deltaY,
        travelDuration,
      } = lockedTargetRef.current;

      const elapsed = (timestamp - startTimeRef.current) / 1000;
      const effectiveElapsed = elapsed - gift.delay;

      if (effectiveElapsed < 0) {
        // Still waiting for delay
        setFlightState({
          phase: 'waiting',
          x: startX,
          y: startY,
          scale: 0.3,
          opacity: 0,
          rotation: 0,
        });
        animFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      if (effectiveElapsed <= travelDuration) {
        // Active Flight Phase: Smooth direct curved trajectory targeting the exact mic seat
        const p = Math.min(1, Math.max(0, effectiveElapsed / travelDuration));

        // Cubic Bézier control points:
        // P0: Start from bottom gift box / send button
        const p0x = startX;
        const p0y = startY;

        // P1: Direct launch upwards towards the target direction
        const p1x = startX + deltaX * 0.25;
        const p1y = startY + deltaY * 0.45;

        // P2: Gentle approach curving directly into the seat
        const p2x = startX + deltaX * 0.8;
        const p2y = targetY - 15;

        // P3: Exact Mic Seat center
        const p3x = targetX;
        const p3y = targetY;

        const u = 1 - p;
        const tt = p * p;
        const uu = u * u;
        const uuu = uu * u;
        const ttt = tt * p;

        const bezierX = uuu * p0x + 3 * uu * p * p1x + 3 * u * tt * p2x + ttt * p3x;
        const bezierY = uuu * p0y + 3 * uu * p * p1y + 3 * u * tt * p2y + ttt * p3y;

        const currentX = p >= 0.98 ? targetX : bezierX;
        const currentY = p >= 0.98 ? targetY : bezierY;

        // Opacity smoothly visible throughout flight
        let opacity = 1;
        if (p < 0.08) {
          opacity = p / 0.08;
        } else if (p > 0.92) {
          opacity = 1 - (p - 0.92) / 0.08;
        }

        // Scale curve: starts small, reaches full size, settles onto the mic
        let scale = 1.0;
        if (p < 0.2) {
          scale = 0.3 + (p / 0.2) * 0.85;
        } else if (p > 0.85) {
          scale = 1.15 - (p - 0.85) * 1.5;
        } else {
          scale = 1.15;
        }

        const bankAngle = deltaX > 20 ? 8 : deltaX < -20 ? -8 : 0;
        const rotation = Math.sin(p * Math.PI) * bankAngle;

        setFlightState({
          phase: 'flying',
          x: currentX,
          y: currentY,
          scale: Math.max(0.01, scale),
          opacity: Math.max(0, Math.min(1, opacity)),
          rotation,
        });

        animFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      // Complete & Cleanup cleanly upon arrival (No extra rising star or golden shockwave)
      completedRef.current = true;
      setFlightState({
        phase: 'done',
        x: targetX,
        y: targetY,
        scale: 0,
        opacity: 0,
        rotation: 0,
      });
      onComplete(gift.id);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [gift, containerRef, onComplete]);

  if (flightState.phase === 'done' || flightState.phase === 'waiting') {
    return null;
  }

  const { x, y, scale, opacity, rotation, phase } = flightState;

  return (
    <React.Fragment>
      {/* Active Flying Gift Node (100% Solid World-Space Anchor Tracking - Frameless & Background-free) */}
      {phase === 'flying' && opacity > 0 && (
        <div
          style={{
            transform: `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`,
            opacity,
            pointerEvents: 'none',
          }}
          className="absolute top-0 left-0 pointer-events-none select-none touch-none flex items-center justify-center transition-none will-change-transform"
          aria-hidden="true"
        >
          {isVideoResource(gift.icon) ? (
            <video
              src={gift.icon}
              autoPlay
              loop
              muted
              playsInline
              tabIndex={-1}
              style={{ pointerEvents: 'none', mixBlendMode: 'screen' }}
              className="w-14 h-14 sm:w-16 sm:h-16 object-contain pointer-events-none select-none filter drop-shadow-[0_8px_20px_rgba(0,0,0,0.85)] drop-shadow-[0_0_12px_rgba(251,191,36,0.5)]"
            />
          ) : isMediaUrl(gift.icon) ? (
            <img
              src={gift.icon}
              alt="gift"
              style={{ pointerEvents: 'none' }}
              className="w-12 h-12 sm:w-14 sm:h-14 object-contain pointer-events-none select-none filter drop-shadow-[0_8px_20px_rgba(0,0,0,0.85)] drop-shadow-[0_0_12px_rgba(251,191,36,0.5)]"
            />
          ) : (
            <span
              style={{ pointerEvents: 'none' }}
              className="text-4xl sm:text-5xl pointer-events-none select-none filter drop-shadow-[0_8px_20px_rgba(0,0,0,0.9)] drop-shadow-[0_0_15px_rgba(251,191,36,0.6)] animate-pulse"
            >
              {getCleanGiftEmoji('', gift.icon)}
            </span>
          )}
        </div>
      )}
    </React.Fragment>
  );
};

export const DynamicAnchoredGiftOverlay: React.FC<DynamicAnchoredGiftOverlayProps> = ({
  flyingGifts,
  containerRef,
  onComplete,
}) => {
  if (flyingGifts.length === 0) return null;

  return (
    <div
      className="absolute inset-0 pointer-events-none select-none touch-none overflow-hidden"
      style={{ pointerEvents: 'none' }}
      aria-hidden="true"
    >
      {flyingGifts.map((gift) => (
        <SingleGiftFlight
          key={gift.id}
          gift={gift}
          containerRef={containerRef}
          onComplete={onComplete}
        />
      ))}
    </div>
  );
};
