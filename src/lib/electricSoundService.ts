/**
 * Realistic Acoustic Web Audio Service for Electric Refund Energy Sphere
 * Super Legend App - 2026
 *
 * Provides real-time synthesized audio for:
 * - High-voltage electric charge & zap on every rapid tap (rising pitch)
 * - Massive supernova explosion blast and celebratory coin cascade
 * - 100% safe audio context handling, zero console errors
 */

import { getSafeAudioContext, playRealisticSound } from './realisticAudioService';

/**
 * Play a crisp electric zap & energy pulse on each rapid tap.
 * Pitch dynamically increases with charge level (1 to 15+).
 */
export function playElectricChargeZap(chargeLevel: number = 1): void {
  try {
    const ctx = getSafeAudioContext();
    if (!ctx) {
      playRealisticSound('electric_zap', 0.6);
      return;
    }

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;
    const baseFreq = 280 + Math.min(chargeLevel * 45, 820);

    // Primary Zap with gentle bandpass filtering
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.8, now + 0.08);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(baseFreq * 1.2, now);
    filter.Q.setValueAtTime(2.0, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.16, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.11);
  } catch {
    // Fail silently without error
  }
}

/**
 * Play a thunderous electric explosion with celebratory realistic coin cascade on detonation
 */
export function playElectricExplosionSound(isMega: boolean = false): void {
  try {
    playRealisticSound('electric_explosion', 0.85);
    setTimeout(() => {
      playRealisticSound(isMega ? 'jackpot_bells' : 'bell', 0.8);
    }, 180);
  } catch {
    // Fail silently without error
  }
}
