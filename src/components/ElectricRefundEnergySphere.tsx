import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefundDrawResult } from '../lib/refundVaultService';
import { playElectricExplosionSound } from '../lib/electricSoundService';

export interface ElectricOrbState {
  isActive: boolean;
  isExploding: boolean;
  showResult: boolean;
  tapCount: number;
  accumulatedCoins: number;
  accumulatedSpent?: number;
  lastDrawResult: RefundDrawResult | null;
  hasMegaJackpot: boolean;
  hasBigWin: boolean;
  maxMultiplier: number;
  giftName: string;
  giftIcon: string;
}

interface ElectricRefundEnergySphereProps {
  orbState: ElectricOrbState | null;
  onDismiss: () => void;
}

// Generate realistic jagged lightning arc between two angles along or across circular paths
function generateCircularLightningArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
  segments: number = 6,
  jitterAmount: number = 4
): string {
  const points: [number, number][] = [];
  const angleStep = (endAngle - startAngle) / segments;

  for (let i = 0; i <= segments; i++) {
    const angle = startAngle + angleStep * i;
    const radialJitter = (Math.random() - 0.5) * jitterAmount;
    const curR = Math.max(r * 0.2, Math.min(r * 0.94, r + radialJitter));
    const px = cx + Math.cos(angle) * curR;
    const py = cy + Math.sin(angle) * curR;
    points.push([px, py]);
  }

  return points
    .map((p, idx) => (idx === 0 ? `M ${p[0].toFixed(1)} ${p[1].toFixed(1)}` : `L ${p[0].toFixed(1)} ${p[1].toFixed(1)}`))
    .join(' ');
}

// Generate cross-diameter branched thunder lightning bolt
function generateInternalCrossBolt(
  cx: number,
  cy: number,
  r: number,
  angle: number,
  segments: number = 6,
  jitter: number = 8
): { main: string; branch: string } {
  const startX = cx + Math.cos(angle) * (r * 0.85);
  const startY = cy + Math.sin(angle) * (r * 0.85);
  const endX = cx + Math.cos(angle + Math.PI) * (r * 0.85);
  const endY = cy + Math.sin(angle + Math.PI) * (r * 0.85);

  const dx = (endX - startX) / segments;
  const dy = (endY - startY) / segments;
  const normalX = -dy;
  const normalY = dx;
  const len = Math.hypot(normalX, normalY) || 1;

  const points: [number, number][] = [[startX, startY]];
  let branchPath = '';

  for (let i = 1; i < segments; i++) {
    const curX = startX + dx * i;
    const curY = startY + dy * i;
    const offset = (Math.random() - 0.5) * jitter * 2;
    let px = curX + (normalX / len) * offset;
    let py = curY + (normalY / len) * offset;

    const dist = Math.hypot(px - cx, py - cy);
    if (dist > r * 0.92) {
      const scale = (r * 0.92) / dist;
      px = cx + (px - cx) * scale;
      py = cy + (py - cy) * scale;
    }
    points.push([px, py]);

    if (i === 3) {
      const bAngle = angle + 1.2;
      const bEndX = px + Math.cos(bAngle) * (r * 0.35);
      const bEndY = py + Math.sin(bAngle) * (r * 0.35);
      branchPath = `M ${px.toFixed(1)} ${py.toFixed(1)} L ${(px + bEndX) / 2 + (Math.random() - 0.5) * 5} ${(py + bEndY) / 2 + (Math.random() - 0.5) * 5} L ${bEndX.toFixed(1)} ${bEndY.toFixed(1)}`;
    }
  }
  points.push([endX, endY]);

  const main = points
    .map((p, idx) => (idx === 0 ? `M ${p[0].toFixed(1)} ${p[1].toFixed(1)}` : `L ${p[0].toFixed(1)} ${p[1].toFixed(1)}`))
    .join(' ');

  return { main, branch: branchPath };
}

// Helper to generate a vertical jagged lightning path from (startX, startY) down to (endX, endY)
function generateVerticalJaggedPath(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  width: number,
  segments: number = 14,
  jitter: number = 28,
  minXRatio: number = 0.05,
  maxXRatio: number = 0.95
): { path: string; points: [number, number][] } {
  const dy = (endY - startY) / segments;
  const points: [number, number][] = [[startX, startY]];

  let curX = startX;
  let curY = startY;

  for (let i = 1; i < segments; i++) {
    curY = startY + i * dy;
    const progress = i / segments;
    const targetX = startX + (endX - startX) * progress;
    const offset = (Math.random() - 0.5) * jitter * 2;
    curX = Math.max(width * minXRatio, Math.min(width * maxXRatio, targetX + offset));
    points.push([curX, curY]);
  }
  points.push([endX, endY]);

  const path = points
    .map((p, idx) => (idx === 0 ? `M ${p[0].toFixed(1)} ${p[1].toFixed(1)}` : `L ${p[0].toFixed(1)} ${p[1].toFixed(1)}`))
    .join(' ');

  return { path, points };
}

/**
 * Generate 3 Tiers of Screen Lightning:
 * - Tier 1 (Level 1 / بداية الضعفين 2x - 3.5x): برق واحد عمودي يضرب من أعلى الشاشة إلى أسفلها
 * - Tier 2 (Level 2 / المستوى الثاني 3.5x - 8x مع كبر الدائرة): برق رئيسي ينشق من وسطه (من نصه) فرع إضافي يمتد حتى أسفل الشاشة (برقان متفرعان)
 * - Tier 3 (Level 3 / أعلى قمة 8x+ أو Mega Jackpot): برق ينشق من نصه فرع، ومن تحت النص قليل فرع آخر (ثلاثة بروق متفرعة بالكامل تمتد إلى أسفل الشاشة)
 */
function generateTieredScreenLightning(
  width: number,
  height: number,
  tier: 1 | 2 | 3
): { mainBolts: string[]; subBranches: string[] } {
  const mainBolts: string[] = [];
  const subBranches: string[] = [];

  const topOriginX = width * 0.50 + (Math.random() * 20 - 10);
  const bottomMainX = width * 0.50 + (Math.random() * 30 - 15);

  // Main Central Lightning Bolt (ينزل من أعلى الشاشة إلى أسفلها)
  const { path: mainPath, points: mainPoints } = generateVerticalJaggedPath(
    topOriginX,
    0,
    bottomMainX,
    height,
    width,
    16,
    30,
    0.25,
    0.75
  );
  mainBolts.push(mainPath);

  // Micro lightning crackles along main trunk
  for (let i = 2; i < mainPoints.length - 2; i += 3) {
    const pt = mainPoints[i];
    const bDir = i % 2 === 0 ? 1 : -1;
    const bLen = 30 + Math.random() * 40;
    const bEndX = pt[0] + bDir * bLen;
    const bEndY = pt[1] + 25 + Math.random() * 30;
    subBranches.push(`M ${pt[0].toFixed(1)} ${pt[1].toFixed(1)} Q ${(pt[0] + bEndX) / 2 + (Math.random() - 0.5) * 8} ${(pt[1] + bEndY) / 2 + (Math.random() - 0.5) * 8} ${bEndX.toFixed(1)} ${bEndY.toFixed(1)}`);
  }

  // TIER 2: فرع أول ينشق من منتصف البرق (نصه) ويمتد إلى أسفل الشاشة
  if (tier >= 2) {
    const midIndex = Math.floor(mainPoints.length * 0.5); // عند النصف تماماً
    const midPoint = mainPoints[midIndex] || [width * 0.5, height * 0.5];

    // Branch 1: ينطلق من منتصف البرق ويتجه نحو يسار/يمين أسفل الشاشة
    const branch1TargetX = width * 0.22 + (Math.random() * 25 - 12);
    const { path: branch1Path, points: b1Points } = generateVerticalJaggedPath(
      midPoint[0],
      midPoint[1],
      branch1TargetX,
      height,
      width,
      10,
      25,
      0.08,
      0.45
    );
    mainBolts.push(branch1Path);

    // Micro spark off branch 1
    if (b1Points.length > 4) {
      const p = b1Points[3];
      subBranches.push(`M ${p[0].toFixed(1)} ${p[1].toFixed(1)} L ${p[0] - 25} ${p[1] + 20}`);
    }
  }

  // TIER 3: فرع ثانٍ ينشق من تحت النص قليلاً ويمتد إلى أسفل الشاشة
  if (tier >= 3) {
    const lowerIndex = Math.floor(mainPoints.length * 0.72); // من تحت النص قليلاً
    const lowerPoint = mainPoints[lowerIndex] || [width * 0.5, height * 0.72];

    // Branch 2: ينطلق من تحت النص ويتجه نحو الجهة المقابلة أسفل الشاشة
    const branch2TargetX = width * 0.78 + (Math.random() * 25 - 12);
    const { path: branch2Path, points: b2Points } = generateVerticalJaggedPath(
      lowerPoint[0],
      lowerPoint[1],
      branch2TargetX,
      height,
      width,
      8,
      22,
      0.55,
      0.92
    );
    mainBolts.push(branch2Path);

    // Micro spark off branch 2
    if (b2Points.length > 3) {
      const p = b2Points[2];
      subBranches.push(`M ${p[0].toFixed(1)} ${p[1].toFixed(1)} L ${p[0] + 25} ${p[1] + 20}`);
    }
  }

  return { mainBolts, subBranches };
}

export const ElectricRefundEnergySphere: React.FC<ElectricRefundEnergySphereProps> = ({
  orbState,
  onDismiss
}) => {
  const [flyingSparks, setFlyingSparks] = useState<Array<{ id: number; angle: number; distance: number; size: number; color: string }>>([]);
  const [displayedCoins, setDisplayedCoins] = useState<number>(0);
  const [lightningTick, setLightningTick] = useState<number>(0);

  // Screen-wide lightning state (supports local explosion & global room-wide broadcast)
  const [roomLightning, setRoomLightning] = useState<{
    visible: boolean;
    tier: 1 | 2 | 3;
    mainBolts: string[];
    subBranches: string[];
  } | null>(null);

  const prevExplodingRef = useRef<boolean>(false);

  // Fast realistic high-frequency electrical thunder jitter loop
  useEffect(() => {
    if (!orbState?.isActive || orbState.showResult) return;
    const interval = setInterval(() => {
      setLightningTick((t) => (t + 1) % 300);
    }, 40);
    return () => clearInterval(interval);
  }, [orbState?.isActive, orbState?.showResult]);

  // Global Room-Wide Event Listener: Enables all members in the room to see the tiered lightning flash ONLY when a 2x+ profit occurs
  useEffect(() => {
    const handleGlobalRoomLightning = (e: Event) => {
      const customEvent = e as CustomEvent<{
        origin?: string;
        tier?: 1 | 2 | 3;
        hasMegaJackpot?: boolean;
        hasBigWin?: boolean;
        isDoubleProfitOrMore?: boolean;
      }>;

      // Ignore event if originated from the local supporter instance (already rendered locally)
      if (customEvent.detail?.origin === 'supporter_self') return;

      // STRICT RULE: If not 2x profit or more, do NOT show screen lightning
      if (customEvent.detail?.isDoubleProfitOrMore === false) return;

      const strikeTier: 1 | 2 | 3 = customEvent.detail?.tier ?? 1;
      const isMega = customEvent.detail?.hasMegaJackpot ?? false;

      // Play explosion thunder sound for the room
      playElectricExplosionSound(isMega);

      const winW = typeof window !== 'undefined' ? window.innerWidth : 400;
      const winH = typeof window !== 'undefined' ? window.innerHeight : 800;
      const strike = generateTieredScreenLightning(winW, winH, strikeTier);

      setRoomLightning({
        visible: true,
        tier: strikeTier,
        mainBolts: strike.mainBolts,
        subBranches: strike.subBranches
      });

      // Clear lightning after animation duration (700ms)
      setTimeout(() => {
        setRoomLightning(null);
      }, 700);
    };

    window.addEventListener('electric_room_lightning_strike', handleGlobalRoomLightning);
    return () => {
      window.removeEventListener('electric_room_lightning_strike', handleGlobalRoomLightning);
    };
  }, []);

  // Supporter Explosion & Lightning Handler (triggers on showResult/lightning after 7s suspense)
  const hasTriggeredLightningRef = useRef<boolean>(false);

  useEffect(() => {
    if (!orbState) {
      hasTriggeredLightningRef.current = false;
      return;
    }

    // Trigger Screen Lightning ONCE when showResult becomes true (after the exact 7 seconds suspense)
    if (orbState.showResult && !hasTriggeredLightningRef.current) {
      hasTriggeredLightningRef.current = true;

      // 1. CALCULATE PROFIT RATIO (المبلغ المسترد مقارنة بالمبلغ المنفق)
      const totalSpent = orbState.accumulatedSpent || orbState.lastDrawResult?.totalCost || 0;
      const totalRefund = orbState.accumulatedCoins || orbState.lastDrawResult?.refundCoins || 0;
      
      let profitRatio = 1;
      if (totalSpent > 0) {
        profitRatio = totalRefund / totalSpent;
      } else if (orbState.lastDrawResult?.multiplier) {
        profitRatio = orbState.lastDrawResult.multiplier;
      } else if (orbState.maxMultiplier) {
        profitRatio = orbState.maxMultiplier;
      }

      const isMega = orbState.hasMegaJackpot || orbState.lastDrawResult?.winTier === 'mega_jackpot';
      
      // STRICT CHECK: البرق يظهر إذا كان الربح ضعفَي المبلغ المنفق فما فوق (>= 2x)
      const isDoubleProfitOrMore = isMega || profitRatio >= 2.0 || (orbState.maxMultiplier >= 2.0);

      if (isDoubleProfitOrMore) {
        // Calculate Tier (1, 2, or 3) based on exact user specification:
        // - Tier 1: استرداد ضعفين إلى ثلاثة أضعاف (2x - 3.99x) -> لمعة واحدة بفرع واحد مباشر
        // - Tier 2: أربعة إلى خمسة أضعاف أو أكثر (4x - 7.99x) -> يخرج فرعان متفرعان
        // - Tier 3: جائزة كبرى أو 8 أضعاف فما فوق (8x+ أو Mega Jackpot) -> تلمع ثلاثة فروع كاملة
        let calculatedTier: 1 | 2 | 3 = 1;

        if (isMega || profitRatio >= 8.0) {
          calculatedTier = 3;
        } else if (profitRatio >= 4.0) {
          calculatedTier = 2;
        } else {
          calculatedTier = 1;
        }

        // Play electric explosion thunder sound
        playElectricExplosionSound(isMega);

        // Generate and display the tiered lightning locally
        const winW = typeof window !== 'undefined' ? window.innerWidth : 400;
        const winH = typeof window !== 'undefined' ? window.innerHeight : 800;
        const strike = generateTieredScreenLightning(winW, winH, calculatedTier);

        setRoomLightning({
          visible: true,
          tier: calculatedTier,
          mainBolts: strike.mainBolts,
          subBranches: strike.subBranches
        });

        // Broadcast event to other members in the room (marked with origin: 'supporter_self')
        window.dispatchEvent(
          new CustomEvent('electric_room_lightning_strike', {
            detail: {
              origin: 'supporter_self',
              isDoubleProfitOrMore: true,
              tier: calculatedTier,
              hasMegaJackpot: isMega,
              hasBigWin: orbState.hasBigWin
            }
          })
        );

        setTimeout(() => {
          setRoomLightning(null);
        }, 700);
      }
    }

    if (!orbState.showResult) {
      hasTriggeredLightningRef.current = false;
    }
  }, [orbState?.showResult]);

  // Initial immediate explosion sparks when sphere explodes upon stop tapping
  useEffect(() => {
    if (orbState?.isExploding && !orbState?.showResult && orbState.tapCount >= 5) {
      const sparks = Array.from({ length: 26 }).map((_, i) => ({
        id: Date.now() + i,
        angle: (i / 26) * 360 + (Math.random() * 10 - 5),
        distance: 60 + Math.random() * 80,
        size: 3.5 + Math.random() * 4,
        color: i % 3 === 0 ? '#FFFFFF' : i % 3 === 1 ? '#70D6FF' : '#38BDF8'
      }));
      setFlyingSparks(sparks);
    }
  }, [orbState?.isExploding, orbState?.showResult, orbState?.tapCount]);

  // Smooth counter animation for final payout reveal (after the 7-second cooldown)
  useEffect(() => {
    if (orbState?.showResult && (orbState.accumulatedCoins > 0)) {
      const target = orbState.accumulatedCoins;
      const duration = 400;
      const startTime = performance.now();
      const startVal = Math.floor(target * 0.5);
      let animId: number | null = null;

      const animateCount = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(startVal + (target - startVal) * ease);
        setDisplayedCoins(current);

        if (progress < 1) {
          animId = requestAnimationFrame(animateCount);
        } else {
          setDisplayedCoins(target);
        }
      };

      animId = requestAnimationFrame(animateCount);
      return () => {
        if (animId !== null) cancelAnimationFrame(animId);
      };
    }
  }, [orbState?.showResult, orbState?.accumulatedCoins]);

  // STRICT RULE: Sphere DOES NOT appear on tap 1, 2, 3, or 4.
  // It ONLY appears starting from tap 5 (الضغطة الخامسة فما فوق) for the supporter!
  const tapCount = orbState?.tapCount ?? 0;
  const isSupporterSphereVisible = Boolean(orbState?.isActive) && tapCount >= 5;

  const accumulatedCoins = orbState?.accumulatedCoins ?? 0;
  const isExploding = orbState?.isExploding ?? false;
  const showResult = orbState?.showResult ?? false;

  const tapsOverFive = Math.max(0, tapCount - 5);
  const baseSize = 125 + Math.min(tapsOverFive, 15) * 1.5;
  const currentScale = isExploding ? 2.0 : 1;
  const boilIntensity = Math.min(1, 0.45 + tapsOverFive * 0.1);

  return (
    <div
      className="fixed inset-0 z-[120] pointer-events-none flex items-center justify-center select-none"
      dir="rtl"
    >
      {/* 0. FULL-SCREEN TIERED LIGHTNING STRIKE (يظهر فقط إذا كان الربح ضعفَي المبلغ المنفق 2x فما فوق) */}
      <AnimatePresence>
        {roomLightning?.visible && (
          <motion.div
            key="room-wide-lightning-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.6, 1, 0.3, 0.95, 0] }}
            transition={{ duration: 0.7, times: [0, 0.08, 0.2, 0.35, 0.5, 0.7, 1], ease: 'easeOut' }}
            className="absolute inset-0 w-full h-full pointer-events-none z-40 overflow-hidden"
          >
            {/* Ambient Cyan/White Sky Flash Overlay */}
            <div className="absolute inset-0 bg-cyan-200/25 backdrop-brightness-135 mix-blend-screen" />

            {/* Realistic Lightning SVG */}
            <svg
              className="w-full h-full overflow-visible pointer-events-none"
              viewBox={`0 0 ${typeof window !== 'undefined' ? window.innerWidth : 400} ${typeof window !== 'undefined' ? window.innerHeight : 800}`}
            >
              <defs>
                <filter id="lightning-tiered-glow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="3.5" result="blur1" />
                  <feGaussianBlur stdDeviation="7" result="blur2" />
                  <feMerge>
                    <feMergeNode in="blur2" />
                    <feMergeNode in="blur1" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* RENDER THE TIERED MAIN LIGHTNING BOLTS (1, 2, or 3 based on level) */}
              {roomLightning.mainBolts.map((boltPath, bIdx) => (
                <g key={`lightning-bolt-group-${bIdx}`}>
                  {/* Outer Sky-Blue Aura */}
                  <path
                    d={boltPath}
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="8"
                    opacity="0.75"
                    filter="url(#lightning-tiered-glow)"
                    strokeLinecap="round"
                  />
                  {/* Mid Cyan Core */}
                  <path
                    d={boltPath}
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="4.5"
                    opacity="0.9"
                    filter="url(#lightning-tiered-glow)"
                    strokeLinecap="round"
                  />
                  {/* Inner White-Hot Lightning Core */}
                  <path
                    d={boltPath}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="2.4"
                    opacity="1"
                    strokeLinecap="round"
                  />
                </g>
              ))}

              {/* RENDER LATERAL SUB-BRANCHES */}
              {roomLightning.subBranches.map((subPath, sIdx) => (
                <path
                  key={`lightning-sub-branch-${sIdx}`}
                  d={subPath}
                  fill="none"
                  stroke="#a5f3fc"
                  strokeWidth="1.8"
                  filter="url(#lightning-tiered-glow)"
                  opacity="0.85"
                  strokeLinecap="round"
                />
              ))}
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. ULTRA-REALISTIC BOILING THUNDER SPHERE (تظهر للداعم فقط وبدءاً من الضغطة الخامسة tap >= 5) */}
      <AnimatePresence mode="wait">
        {isSupporterSphereVisible && !showResult && (
          <motion.div
            key="compact-thunder-orb"
            initial={{ scale: 0.25, opacity: 0 }}
            animate={{
              scale: currentScale,
              opacity: 1,
              rotate: [0, 1.2, -1.2, 0]
            }}
            exit={{ scale: 2.3, opacity: 0, filter: 'brightness(3.5)' }}
            transition={{
              scale: { type: 'spring', stiffness: 450, damping: 24 },
              rotate: { repeat: Infinity, duration: 0.18, ease: 'linear' }
            }}
            className="relative flex items-center justify-center pointer-events-none"
            style={{ width: baseSize, height: baseSize }}
          >
            {/* REALISTIC 3D SAPPHIRE GLASS SPHERE */}
            <div
              className="relative rounded-full flex items-center justify-center overflow-hidden transition-all duration-150"
              style={{
                width: baseSize,
                height: baseSize,
                background: 'radial-gradient(circle at 48% 48%, #ffffff 0%, #bbf2ff 14%, #38bdf8 38%, #0284c7 62%, #0f2b5c 85%, #050d24 100%)',
                boxShadow: '0 0 22px rgba(56, 189, 248, 0.85), inset 0 0 22px rgba(255, 255, 255, 0.95), inset 0 0 8px rgba(14, 165, 233, 0.9)'
              }}
            >
              {/* Circular Boiling Energy Swirl 1 */}
              <motion.div
                animate={{ rotate: [0, 360], scale: [0.95, 1.08, 0.95] }}
                transition={{ repeat: Infinity, duration: 0.8 / boilIntensity, ease: 'linear' }}
                className="absolute inset-1 rounded-full opacity-70 pointer-events-none"
                style={{
                  background: 'conic-gradient(from 0deg, rgba(255,255,255,0.9) 0deg, rgba(56,189,248,0.7) 90deg, rgba(3,105,161,0.2) 180deg, rgba(255,255,255,0.95) 270deg, rgba(56,189,248,0.8) 360deg)',
                  mixBlendMode: 'overlay'
                }}
              />

              {/* Circular Boiling Energy Swirl 2 */}
              <motion.div
                animate={{ rotate: [360, 0], scale: [1.05, 0.92, 1.05] }}
                transition={{ repeat: Infinity, duration: 1.1 / boilIntensity, ease: 'linear' }}
                className="absolute inset-2 rounded-full opacity-50 pointer-events-none"
                style={{
                  background: 'conic-gradient(from 180deg, rgba(165,243,252,0.8) 0deg, transparent 120deg, rgba(255,255,255,0.9) 240deg, transparent 360deg)',
                  mixBlendMode: 'screen'
                }}
              />

              {/* Central Glowing Thunder Core */}
              <motion.div
                animate={{
                  scale: [1, 1.25, 0.9, 1],
                  opacity: [0.85, 1, 0.8, 0.85]
                }}
                transition={{ repeat: Infinity, duration: 0.4, ease: 'easeInOut' }}
                className="absolute w-7 h-7 rounded-full bg-white blur-[2.5px] shadow-[0_0_16px_#38bdf8] pointer-events-none"
              />

              {/* CIRCULAR & CROSSING THUNDERBOLT SVG */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-10"
                viewBox={`0 0 ${baseSize} ${baseSize}`}
              >
                <defs>
                  <filter id="thunder-glow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="1.5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {(() => {
                  const cx = baseSize / 2;
                  const cy = baseSize / 2;
                  const radius = baseSize / 2;
                  const elements: React.ReactNode[] = [];

                  // 1. Concentric Circular Lightning Orbits
                  const orbits = [
                    { rRatio: 0.78, segments: 8, start: lightningTick * 0.15, span: Math.PI * 1.1, width: '1.4' },
                    { rRatio: 0.55, segments: 7, start: -lightningTick * 0.2 + Math.PI, span: Math.PI * 1.3, width: '1.6' },
                    { rRatio: 0.38, segments: 6, start: lightningTick * 0.25 + 1.5, span: Math.PI * 0.9, width: '1.3' }
                  ];

                  orbits.forEach((orb, idx) => {
                    const arcPath = generateCircularLightningArc(
                      cx,
                      cy,
                      radius * orb.rRatio,
                      orb.start,
                      orb.start + orb.span,
                      orb.segments,
                      4
                    );
                    elements.push(
                      <path
                        key={`orbit-arc-${idx}`}
                        d={arcPath}
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth={orb.width}
                        filter="url(#thunder-glow)"
                        opacity={0.88 + Math.random() * 0.12}
                        strokeLinecap="round"
                      />
                    );
                  });

                  // 2. High-Voltage Thunder Bolts crossing through center
                  const boltAngles = [
                    (lightningTick * 18) * (Math.PI / 180),
                    (lightningTick * 18 + 70) * (Math.PI / 180),
                    (lightningTick * 18 + 140) * (Math.PI / 180)
                  ];

                  boltAngles.forEach((bAngle, bIdx) => {
                    const { main, branch } = generateInternalCrossBolt(cx, cy, radius, bAngle, 6, 8);
                    elements.push(
                      <path
                        key={`cross-bolt-${bIdx}`}
                        d={main}
                        fill="none"
                        stroke={bIdx === 0 ? '#ffffff' : '#cffafe'}
                        strokeWidth={bIdx === 0 ? '1.8' : '1.3'}
                        filter="url(#thunder-glow)"
                        opacity={0.85 + Math.random() * 0.15}
                        strokeLinecap="round"
                      />
                    );
                    if (branch) {
                      elements.push(
                        <path
                          key={`cross-bolt-branch-${bIdx}`}
                          d={branch}
                          fill="none"
                          stroke="#7dd3fc"
                          strokeWidth="1.0"
                          filter="url(#thunder-glow)"
                          opacity={0.75}
                          strokeLinecap="round"
                        />
                      );
                    }
                  });

                  return elements;
                })()}
              </svg>

              {/* Specular 3D Reflection Glare */}
              <div className="absolute top-2 left-3 w-8 h-4 bg-white/85 rounded-full blur-[1px] -rotate-35 pointer-events-none" />
              <div className="absolute bottom-2 right-3 w-4 h-2 bg-sky-200/40 rounded-full blur-[0.8px] -rotate-30 pointer-events-none" />

              {/* ULTRA-COMPACT CENTER COINS PILL */}
              <motion.div
                key={`center-coins-${tapCount}`}
                initial={{ scale: 0.85, opacity: 0.95 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 600, damping: 18 }}
                className="relative z-20 px-2 py-0.5 rounded-full border border-cyan-200/90 bg-black/60 backdrop-blur-xs shadow-sm flex items-center gap-1"
                style={{
                  boxShadow: '0 1px 6px rgba(0,0,0,0.6), 0 0 6px rgba(56,189,248,0.9)'
                }}
              >
                <span className="text-xs sm:text-sm font-mono font-black tracking-tight text-cyan-100 drop-shadow-[0_0_4px_rgba(56,189,248,1)]">
                  +{accumulatedCoins.toLocaleString('en-US')}
                </span>
                <span className="text-xs">🪙</span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. LOCAL SPARK BURST ON EXPLOSION (فقط إذا كانت الدائرة مفعلة tap >= 5) */}
      <AnimatePresence>
        {isExploding && isSupporterSphereVisible && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
            {/* Center Flash */}
            <motion.div
              initial={{ scale: 0.1, opacity: 1 }}
              animate={{ scale: 2.8, opacity: 0 }}
              transition={{ duration: 0.65, ease: 'easeOut' }}
              className="absolute w-32 h-32 rounded-full bg-radial from-white via-cyan-300 to-transparent shadow-[0_0_60px_#38bdf8]"
            />

            {/* Flying Mini Sparks */}
            {flyingSparks.map((spark) => {
              const rad = (spark.angle * Math.PI) / 180;
              const tx = Math.cos(rad) * spark.distance;
              const ty = Math.sin(rad) * spark.distance;

              return (
                <motion.div
                  key={spark.id}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{ x: tx, y: ty, opacity: 0, scale: 0.2 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="absolute rounded-full shadow-md"
                  style={{
                    width: spark.size,
                    height: spark.size,
                    backgroundColor: spark.color,
                    boxShadow: `0 0 8px ${spark.color}`
                  }}
                />
              );
            })}
          </div>
        )}
      </AnimatePresence>

      {/* 3. FINAL COMPACT AMOUNT RIBBON AFTER EXPLOSION (يظهر للداعم بعد السبع ثواني لعرض إجمالي ما كسبه) */}
      <AnimatePresence>
        {showResult && (isSupporterSphereVisible || (Boolean(orbState?.isActive) && (orbState?.accumulatedCoins ?? 0) > 0)) && (
          <motion.div
            key="electric-compact-ribbon"
            initial={{ scale: 0.5, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -10 }}
            transition={{ type: 'spring', damping: 16, stiffness: 400 }}
            className="pointer-events-auto cursor-pointer relative"
            onClick={onDismiss}
          >
            {/* Outer Soft Glow Halo */}
            <div className="absolute -inset-1 rounded-full opacity-80 blur-xs bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 animate-pulse" />

            {/* Ultra-Clean Glowing Amount Pill Ribbon */}
            <div className="relative px-4 py-1.5 rounded-full border border-cyan-300 bg-slate-950/90 shadow-[0_0_15px_rgba(56,189,248,0.8)] backdrop-blur-md flex items-center justify-center gap-1">
              <span className="text-base sm:text-lg font-mono font-black tracking-tight text-cyan-200 drop-shadow-[0_0_6px_rgba(56,189,248,1)]">
                +{displayedCoins.toLocaleString('en-US')}
              </span>
              <span className="text-base animate-bounce">🪙</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
