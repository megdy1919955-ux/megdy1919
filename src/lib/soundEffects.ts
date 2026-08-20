// Web Audio API synthesized sound generator for instant feedback

class SoundEffectsService {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Chime when mic clicked
  playMicToggle(active: boolean) {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(active ? 587.33 : 392.00, ctx.currentTime); // D5 or G4
      osc.frequency.exponentialRampToValueAtTime(active ? 880 : 261.63, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch {
      // Audio not permitted or supported
    }
  }

  // Coin / Gift sound
  playGiftSound() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C, E, G, C
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.06);
        gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.06 + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.06);
        osc.stop(ctx.currentTime + idx * 0.06 + 0.25);
      });
    } catch {}
  }

  // Win / Victory sound
  playVictoryFanfare() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const melody = [
        { f: 523.25, d: 0.12 },
        { f: 659.25, d: 0.12 },
        { f: 783.99, d: 0.15 },
        { f: 1046.50, d: 0.4 }
      ];
      let t = ctx.currentTime;
      melody.forEach((note) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(note.f, t);
        gain.gain.setValueAtTime(0.15, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + note.d);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + note.d);
        t += note.d * 0.9;
      });
    } catch {}
  }

  // Dice roll sound
  playDiceRoll() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      for (let i = 0; i < 6; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(200 + Math.random() * 300, ctx.currentTime + i * 0.05);
        gain.gain.setValueAtTime(0.1, ctx.currentTime + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.05 + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.05);
        osc.stop(ctx.currentTime + i * 0.05 + 0.05);
      }
    } catch {}
  }

  // Applause effect
  playApplause() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      for (let i = 0; i < 15; i++) {
        const noise = ctx.createBufferSource();
        const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let j = 0; j < data.length; j++) {
          data[j] = (Math.random() * 2 - 1) * 0.2;
        }
        noise.buffer = buffer;
        const gain = ctx.createGain();
        const startTime = ctx.currentTime + i * (0.04 + Math.random() * 0.03);
        gain.gain.setValueAtTime(0.15, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.08);
        noise.connect(gain);
        gain.connect(ctx.destination);
        noise.start(startTime);
      }
    } catch {}
  }
}

export const soundEffects = new SoundEffectsService();
