/**
 * Synthesized Web Audio Service for Electric Refund Energy Sphere
 * Super Legend App - 2026
 *
 * Provides real-time synthesized audio for:
 * - High-voltage electric charge & zap on every rapid tap (rising pitch)
 * - Plasma electric humming and crackle
 * - Massive supernova explosion blast and celebratory coin cascade
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  } catch {
    return null;
  }
}

/**
 * Play a crisp electric zap & energy pulse on each rapid tap.
 * Pitch dynamically increases with charge level (1 to 15+).
 */
export function playElectricChargeZap(chargeLevel: number = 1): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    
    // Frequency climbs from ~280Hz up to ~1100Hz based on consecutive rapid taps
    const baseFreq = 280 + Math.min(chargeLevel * 45, 820);

    // 1. Primary Zap Oscillator (Sawtooth for sharp electric bite)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 2.2, now + 0.08);

    // Bandpass filter for high-voltage spark texture
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(baseFreq * 1.5, now);
    filter.Q.setValueAtTime(3.5, now);

    // Quick sharp envelope (0.12s)
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.13);

    // 2. Harmonic Sine Shimmer
    const sineOsc = ctx.createOscillator();
    const sineGain = ctx.createGain();
    sineOsc.type = 'sine';
    sineOsc.frequency.setValueAtTime(baseFreq * 2, now);
    sineOsc.frequency.linearRampToValueAtTime(baseFreq * 3, now + 0.1);

    sineGain.gain.setValueAtTime(0.12, now);
    sineGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    sineOsc.connect(sineGain);
    sineGain.connect(ctx.destination);

    sineOsc.start(now);
    sineOsc.stop(now + 0.11);
  } catch {
    // Ignore audio glitches safely
  }
}

/**
 * Play a thunderous electric explosion with coin sparkle cascade on detonation!
 */
export function playElectricExplosionSound(isMega: boolean = false): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;

    // 1. Deep Sub-Bass Explosion Shockwave
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(140, now);
    subOsc.frequency.exponentialRampToValueAtTime(32, now + 0.5);

    subGain.gain.setValueAtTime(0.35, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    subOsc.connect(subGain);
    subGain.connect(ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 0.65);

    // 2. Noise Burst / Electric Thunder
    const bufferSize = ctx.sampleRate * 0.4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(1800, now);
    noiseFilter.frequency.exponentialRampToValueAtTime(160, now + 0.38);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.22, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    whiteNoise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    whiteNoise.start(now);
    whiteNoise.stop(now + 0.42);

    // 3. Celebratory Winning Coin Arpeggio Chords
    const chordFreqs = isMega
      ? [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98] // C Major Mega Sparkle
      : [587.33, 739.99, 880.00, 1174.66]; // D Major Radiant Sparkle

    chordFreqs.forEach((freq, idx) => {
      const delay = 0.12 + idx * 0.07;
      const coinOsc = ctx.createOscillator();
      const coinGain = ctx.createGain();

      coinOsc.type = 'triangle';
      coinOsc.frequency.setValueAtTime(freq, now + delay);

      coinGain.gain.setValueAtTime(0.001, now + delay);
      coinGain.gain.linearRampToValueAtTime(0.18, now + delay + 0.02);
      coinGain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.45);

      coinOsc.connect(coinGain);
      coinGain.connect(ctx.destination);

      coinOsc.start(now + delay);
      coinOsc.stop(now + delay + 0.5);
    });
  } catch {
    // Ignore audio errors safely
  }
}
