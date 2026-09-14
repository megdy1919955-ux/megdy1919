import React, { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export interface SideGiftEvent {
  id: string;
  senderName: string;
  senderId?: string;
  senderAvatar?: string;
  actionType: 'gift' | 'refund_win' | 'jackpot';
  giftName: string;
  giftIcon?: string;
  quantity?: number;
  targetName?: string;
  targetId?: string;
  coinsWon?: number;
  timestamp: number;
  isReturned?: boolean;
}

interface SideGiftStreamProps {
  events: SideGiftEvent[];
  onExpireEvent: (id: string) => void;
  sessionTimerNode?: React.ReactNode;
  onOpenUserProfile?: (userData: any) => void;
  currentUserId?: string;
  currentUserName?: string;
  userCoinsBalance?: number;
  onReturnRose?: (event: SideGiftEvent) => void;
}

/**
 * أيقونة وردة واقعية فائقة الجودة وعالية الدقة (Realistic Luxury Rose Vector)
 * مصممة بطبقات تدرج مخملية واقعية مع بتلات وظلال وأوراق خضراء طبيعية
 */
export const RealisticRoseIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] shrink-0 select-none pointer-events-none`}
  >
    <defs>
      <linearGradient id="rose-petal-dark" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#e11d48" />
        <stop offset="50%" stopColor="#be123c" />
        <stop offset="100%" stopColor="#4c0519" />
      </linearGradient>
      <linearGradient id="rose-petal-bright" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ff4370" />
        <stop offset="60%" stopColor="#e11d48" />
        <stop offset="100%" stopColor="#9f1239" />
      </linearGradient>
      <linearGradient id="rose-petal-glow" x1="20%" y1="0%" x2="80%" y2="100%">
        <stop offset="0%" stopColor="#fecdd3" />
        <stop offset="40%" stopColor="#fb7185" />
        <stop offset="100%" stopColor="#e11d48" />
      </linearGradient>
      <linearGradient id="rose-leaf-stem" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4ade80" />
        <stop offset="50%" stopColor="#22c55e" />
        <stop offset="100%" stopColor="#14532d" />
      </linearGradient>
    </defs>

    {/* Green Base Stem & Foliage */}
    <path
      d="M18 25C17.5 28 17 31 16.5 34C17.8 34 18.8 31 19.5 26Z"
      fill="#15803d"
    />
    <path
      d="M11 25C8 21.5 7 17.5 9 14C12.5 15.5 14 19 13.5 23.5Z"
      fill="url(#rose-leaf-stem)"
    />
    <path
      d="M25 25C28 21.5 29 17.5 27 14C23.5 15.5 22 19 22.5 23.5Z"
      fill="url(#rose-leaf-stem)"
    />

    {/* Outer Petal Base */}
    <path
      d="M18 7C12.5 7 7.5 11 8.5 17C9.5 23 14.5 26 18 26C21.5 26 26.5 23 27.5 17C28.5 11 23.5 7 18 7Z"
      fill="url(#rose-petal-dark)"
    />

    {/* Middle Curved Petals */}
    <path
      d="M11.5 13C12.5 9.5 17 8.5 19 10.5C22 12.5 22.5 17 20.5 21C18 24 13.5 22.5 11.5 18C10.5 15.5 10.5 14 11.5 13Z"
      fill="url(#rose-petal-bright)"
    />
    <path
      d="M24.5 13C23.5 9.5 19 8.5 17 10.5C14 12.5 13.5 17 15.5 21C18 24 22.5 22.5 24.5 18C25.5 15.5 25.5 14 24.5 13Z"
      fill="url(#rose-petal-dark)"
    />

    {/* Front Inner Overlapping Petal */}
    <path
      d="M13.5 16.5C14.5 13.5 18 12.5 20.5 14C22.5 15.5 22.5 19.5 20 22C17.5 24.5 14.5 22.5 13.5 19C13 17.8 13.2 17.2 13.5 16.5Z"
      fill="url(#rose-petal-bright)"
    />

    {/* Center Swirl & Highlighted Bud Petal */}
    <path
      d="M16 13.5C16.5 11.8 19.5 11.8 20.2 13.5C20.8 15.2 18.5 17.2 17 16.2C16.2 15.6 15.8 14.5 16 13.5Z"
      fill="url(#rose-petal-glow)"
    />
    <circle cx="18" cy="14" r="2.2" fill="#be123c" />
  </svg>
);

export const SideGiftStream: React.FC<SideGiftStreamProps> = ({
  events,
  onExpireEvent,
  sessionTimerNode,
  onOpenUserProfile,
  currentUserId,
  currentUserName,
  userCoinsBalance = 0,
  onReturnRose
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const startYRef = useRef(0);
  const startScrollTopRef = useRef(0);
  const hasMovedRef = useRef(false);
  const userScrolledAwayRef = useRef(false);

  // Stable reference to onExpireEvent to prevent timer reset cycles
  const onExpireRef = useRef(onExpireEvent);
  useEffect(() => {
    onExpireRef.current = onExpireEvent;
  }, [onExpireEvent]);

  // Auto-expire gift & win notifications:
  // - Regular gifts (الهدية العادية): disappear after 1 full minute (60 seconds = 60,000 ms)
  // - Lucky wins / refunds (الفوز بهدايا الحظ): stay visible for up to 2 full minutes (120 seconds = 120,000 ms)
  useEffect(() => {
    if (events.length === 0) return;

    const now = Date.now();
    const timers = events.map((ev) => {
      const isWin = ev.actionType === 'refund_win' || ev.actionType === 'jackpot';
      const lifespan = isWin ? 120000 : 60000;
      const evTime = ev.timestamp || now;
      const remainingTime = Math.max(200, lifespan - (now - evTime));
      return setTimeout(() => {
        onExpireRef.current?.(ev.id);
      }, remainingTime);
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [events]);

  // When new events arrive, smoothly auto-scroll upwards from bottom to top unless user has manually scrolled away
  useEffect(() => {
    if (scrollRef.current && events.length > 0 && !userScrolledAwayRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [events.length]);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const isNearBottom = scrollHeight - clientHeight - scrollTop < 35;
    userScrolledAwayRef.current = !isNearBottom;
  }, []);

  // Pointer drag interactions to allow swiping/dragging up and down smoothly
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    isDraggingRef.current = true;
    hasMovedRef.current = false;
    startYRef.current = e.clientY;
    startScrollTopRef.current = scrollRef.current.scrollTop;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !scrollRef.current) return;
    const deltaY = e.clientY - startYRef.current;
    if (Math.abs(deltaY) > 3) {
      hasMovedRef.current = true;
    }
    scrollRef.current.scrollTop = startScrollTopRef.current - deltaY;
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
    setTimeout(() => {
      hasMovedRef.current = false;
    }, 100);
  };

  if (events.length === 0 && !sessionTimerNode) return null;

  return (
    <div
      id="side-gift-stream-container"
      className="absolute top-0 left-1.5 bottom-2 z-20 pointer-events-none flex flex-col items-start w-[96px] max-w-[96px] select-none overflow-hidden"
    >
      {/* 1. FLOATING BROADCAST CLOCK AT THE TOP (العداد / المؤقت يطفو فوق القائمة، والمستطيلات تمر وتختفي تحته بدون تغطية) */}
      {sessionTimerNode && (
        <div className="pt-1 pb-1 px-0.5 pointer-events-auto shrink-0 select-none drop-shadow-md z-30 relative bg-gradient-to-b from-slate-950/95 via-slate-950/80 to-transparent w-full">
          {sessionTimerNode}
        </div>
      )}

      {/* 2. INDEPENDENTLY SCROLLABLE & DRAGGABLE STREAM (تتحرك من الأسفل للأعلى وتمر وتختفي تحت المؤقت والمايكات) */}
      <div
        ref={scrollRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onScroll={handleScroll}
        className="flex-1 min-h-0 w-full overflow-y-auto overflow-x-hidden no-scrollbar touch-pan-y overscroll-contain flex flex-col gap-1 pointer-events-auto pr-0.5 cursor-grab active:cursor-grabbing relative z-10"
        style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}
      >
        {/* Elastic flex spacer that keeps items aligned at the bottom when few, without breaking upward scrolling */}
        <div className="flex-1 min-h-0 shrink-0 pointer-events-none" />

        <AnimatePresence initial={false}>
          {events.map((ev) => {
            const isLuckyGift = ev.actionType === 'refund_win' || ev.actionType === 'jackpot';
            const isJackpot = ev.actionType === 'jackpot';

            // Check if user is the recipient (المدعوم المستلم فقط)
            const isRecipient =
              !isLuckyGift &&
              Boolean(
                (ev.targetId && currentUserId && ev.targetId === currentUserId) ||
                (ev.targetName && currentUserName && (
                  ev.targetName === currentUserName ||
                  ev.targetName.includes('أنا') ||
                  (currentUserName.includes('أنا') && ev.targetName.includes('أنا'))
                ))
              );

            // استثناء دعم الذات (Self-Gifting Exception):
            // عند قيام المستخدم بدعم حسابه الشخصي (إرسال هدية لنفسه)، لا تظهر له أيقونة الوردة إطلاقاً
            const isSelfGift = Boolean(
              (ev.senderId && ev.targetId && ev.senderId === ev.targetId) ||
              (ev.senderName && ev.targetName && ev.senderName === ev.targetName) ||
              (ev.senderName?.includes('أنا') && ev.targetName?.includes('أنا')) ||
              (currentUserId && ev.senderId === currentUserId && ev.targetId === currentUserId) ||
              (currentUserName && ev.senderName === currentUserName && ev.targetName === currentUserName) ||
              (currentUserId && ev.senderId === currentUserId && (ev.targetName?.includes('أنا') || ev.targetId === currentUserId))
            );

            // خيار الوردة يظهر للمستلم فقط على الهدايا العادية بشرط عدم دعم الذات وعدم الرد المسبق
            const canShowRoseReturn =
              !isLuckyGift &&
              !isSelfGift &&
              ev.actionType === 'gift' &&
              isRecipient &&
              !ev.isReturned;

            return (
              <motion.div
                key={ev.id}
                layout="position"
                initial={{ opacity: 0, y: 15, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.88, transition: { duration: 0.2 } }}
                transition={{ type: 'spring', damping: 24, stiffness: 320 }}
                onClick={() => {
                  if (hasMovedRef.current) return;
                  if (onOpenUserProfile) {
                    onOpenUserProfile({
                      id: ev.senderId || ev.id,
                      name: ev.senderName,
                      customBio: isLuckyGift ? `فائز بـ ${ev.coinsWon?.toLocaleString()} كوينز` : `الداعم ${ev.senderName}`
                    });
                  }
                }}
                className={`w-full flex items-center justify-between gap-1 px-1.5 py-1 rounded-lg border backdrop-blur-md shadow-md cursor-pointer active:scale-95 pointer-events-auto shrink-0 relative overflow-hidden select-none transition-colors ${
                  isJackpot
                    ? 'bg-gradient-to-r from-amber-950/95 via-yellow-950/90 to-slate-950/95 border-amber-400/90 text-amber-100 shadow-amber-500/20'
                    : isLuckyGift
                    ? 'bg-gradient-to-r from-purple-950/95 via-pink-950/90 to-slate-950/95 border-purple-400/80 text-purple-100 shadow-purple-500/20'
                    : canShowRoseReturn
                    ? 'bg-gradient-to-r from-[#20101b]/95 via-[#1a1c2d]/95 to-[#1c132b]/95 border-rose-400/80 text-slate-100 shadow-[0_0_10px_rgba(244,63,94,0.25)] hover:border-rose-300'
                    : 'bg-gradient-to-r from-[#111726]/95 via-[#182033]/95 to-[#1c132b]/95 border-amber-400/60 text-slate-100 shadow-slate-950/60 hover:border-amber-400'
                }`}
                title={
                  isLuckyGift
                    ? `${ev.senderName} ربح ${ev.coinsWon?.toLocaleString()} كوينز`
                    : `${ev.senderName} أهدى ${ev.targetName || 'الروم'} [${ev.giftName}]`
                }
              >
                {/* Top micro shimmer accent */}
                <div
                  className={`absolute top-0 inset-x-0 h-0.5 pointer-events-none bg-gradient-to-r ${
                    canShowRoseReturn
                      ? 'from-transparent via-rose-400/80 to-transparent'
                      : 'from-transparent via-amber-400/60 to-transparent'
                  }`}
                />

                {/* Text Column: Supporter Name Top, Supported Recipient/Coins Won Bottom */}
                <div className="flex flex-col min-w-0 flex-1 leading-tight text-right overflow-hidden">
                  <span
                    className={`text-[9px] font-black truncate drop-shadow-xs ${
                      canShowRoseReturn ? 'text-rose-200' : 'text-amber-300'
                    }`}
                  >
                    {ev.senderName}
                  </span>

                  <div className="text-[8px] text-slate-200 truncate font-semibold leading-none mt-0.5">
                    {isLuckyGift ? (
                      <span className="text-emerald-300 font-mono font-bold">
                        +{ev.coinsWon?.toLocaleString('en-US')} 🪙
                      </span>
                    ) : (
                      <span className="text-amber-100/90 truncate font-bold">
                        {ev.targetName ? `أهدى ${ev.targetName}` : 'أهدى الروم'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Gift/Win Icon and Quantity */}
                <div className="flex flex-col items-center justify-center shrink-0 leading-none pl-0.5">
                  {isLuckyGift ? (
                    <span className="text-xs drop-shadow-xs">🎯</span>
                  ) : (
                    ev.giftIcon && <span className="text-xs drop-shadow-xs">{ev.giftIcon}</span>
                  )}
                  {!isLuckyGift && ev.quantity && ev.quantity > 1 && (
                    <span className="text-[7.5px] font-black text-amber-300 font-mono tracking-tighter bg-amber-500/20 border border-amber-400/50 px-0.5 py-0.2 rounded mt-0.5">
                      x{ev.quantity}
                    </span>
                  )}
                </div>

                {/* Quick Return Rose Button:
                    - ثبات تام داخل المستطيل المخصص لها دون أي حركة تنطط أو تحريك
                    - تصميم أيقونة وردة واقعية وعالية الجودة
                    - خلفية بلون مميز وجذاب يلفت الانتباه بشكل أنيق
                    - لا تظهر عند دعم الذات */}
                {canShowRoseReturn && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onReturnRose?.(ev);
                    }}
                    title="رد سريع بوردة للداعم (100 كوينز) 🌹"
                    className="shrink-0 flex items-center justify-center w-5.5 h-5.5 rounded-md bg-gradient-to-tr from-rose-600 via-rose-500 to-pink-500 border border-rose-200/90 shadow-[0_0_8px_rgba(244,63,94,0.7)] cursor-pointer hover:brightness-110 active:scale-95 transition-all select-none relative z-10"
                  >
                    <RealisticRoseIcon className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Already Returned Indicator */}
                {isRecipient && ev.isReturned && (
                  <span
                    className="shrink-0 px-1 py-0.5 rounded-md bg-emerald-950/90 border border-emerald-400/80 text-emerald-300 text-[6.5px] font-black shadow-xs select-none"
                    title="تم الرد بوردة 🌹"
                  >
                    تم الرد
                  </span>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
