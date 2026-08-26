/**
 * الأيقونة الدائرية العائمة للغرفة الصوتية (Floating Circular Room Bubble)
 * تظهر عند اختيار "احتفاظ" لوضع الروم في الخلفية وتطفو بسلاسة فائقة فوق كل شيء في التطبيق (z-[99999])
 * مقيدة تماماً بحواف الشاشة ولا يمكن أن تخرج عنها مع إمكانية الضغط للعودة الفورية للروم ملء الشاشة
 * Super Legend App (c) 2026
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MicOff,
  X
} from 'lucide-react';
import {
  ActiveRoomSession,
  maximizeRoomSession,
  exitRoomSession,
  subscribeToRoomSession
} from '../lib/roomSessionService';

interface FloatingRoomWidgetProps {
  onExpand?: () => void;
  onExit?: () => void;
}

export const FloatingRoomWidget: React.FC<FloatingRoomWidgetProps> = ({
  onExpand,
  onExit
}) => {
  const [session, setSession] = useState<ActiveRoomSession | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const containerBoundaryRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    const unsub = subscribeToRoomSession((current) => {
      setSession(current);
      if (current) {
        setIsMuted(Boolean(current.isMuted));
      }
    });
    return unsub;
  }, []);

  if (!session || !session.isMinimized) {
    return null;
  }

  const handleReturnToRoom = () => {
    if (isDraggingRef.current) return;
    maximizeRoomSession();
    if (onExpand) onExpand();
  };

  const handleExitRoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    exitRoomSession();
    if (onExit) onExit();
  };

  return (
    <>
      {/* Full-Screen Drag Constraints Overlay - strictly prevents bubble from leaving screen edges */}
      <div
        ref={containerBoundaryRef}
        className="fixed inset-3 pointer-events-none z-[99998]"
        aria-hidden="true"
      />

      <AnimatePresence>
        {/* Floating Circular Bubble Container */}
        <motion.div
          key="floating-room-bubble"
          drag
          dragConstraints={containerBoundaryRef}
          dragElastic={0}
          dragMomentum={false}
          onDragStart={() => {
            isDraggingRef.current = true;
          }}
          onDragEnd={() => {
            setTimeout(() => {
              isDraggingRef.current = false;
            }, 120);
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', damping: 24, stiffness: 320 }}
          style={{
            touchAction: 'none',
            willChange: 'transform'
          }}
          className="fixed bottom-24 right-4 sm:right-6 z-[99999] pointer-events-auto touch-none select-none cursor-grab active:cursor-grabbing"
          dir="rtl"
        >
          <div
            onClick={handleReturnToRoom}
            className="relative group cursor-pointer"
          >
            {/* Animated Halo Glow Ring */}
            <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-400 to-amber-400 opacity-75 blur-[4px] group-hover:opacity-100 animate-spin [animation-duration:8s] pointer-events-none" />

            {/* Outer Border Frame */}
            <div className="relative w-15 h-15 sm:w-16 sm:h-16 rounded-full p-[2px] bg-gradient-to-tr from-emerald-400 via-teal-300 to-amber-300 shadow-[0_8px_25px_rgba(16,185,129,0.5)] group-active:scale-95 transition-transform duration-150">
              {/* Inner Circular Avatar Container */}
              <div className="w-full h-full rounded-full overflow-hidden relative bg-[#0F141F] flex items-center justify-center border-2 border-[#0B0E17]">
                <img
                  src={
                    session.roomAvatar ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
                  }
                  alt={session.roomTitle}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200 pointer-events-none"
                />

                {/* Dark subtle overlay for live audio waves */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end items-center pb-1 pointer-events-none">
                  {/* Real-time Audio Waveform in the circle */}
                  <div className="flex items-center gap-0.5 h-2.5">
                    <span className="w-0.5 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-0.5 h-3 bg-emerald-300 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-0.5 h-2 bg-teal-300 rounded-full animate-bounce [animation-delay:300ms]" />
                    <span className="w-0.5 h-2.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:450ms]" />
                  </div>
                </div>

                {/* Live Badge Ring */}
                <div className="absolute top-0.5 right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#0B0E17] flex items-center justify-center shadow-xs pointer-events-none">
                  <span className="w-1 h-1 rounded-full bg-white animate-ping" />
                </div>

                {/* Mute indicator overlay */}
                {isMuted && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[0.5px]">
                    <MicOff className="w-4 h-4 text-rose-400 drop-shadow-md" />
                  </div>
                )}
              </div>
            </div>

            {/* Quick Exit (X) Button touching the circle edge */}
            <button
              onClick={handleExitRoom}
              onPointerDown={(e) => e.stopPropagation()}
              className="absolute -top-0.5 -left-0.5 w-4.5 h-4.5 rounded-full bg-rose-600 hover:bg-rose-500 border border-white text-white flex items-center justify-center shadow-md transition-all active:scale-90 cursor-pointer z-20"
              title="مغادرة الروم"
            >
              <X className="w-2.5 h-2.5 stroke-[3]" />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};
