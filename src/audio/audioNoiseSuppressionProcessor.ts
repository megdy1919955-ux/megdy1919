/**
 * AudioNoiseSuppressionProcessor:
 * Advanced Client-side Digital Signal Processing (DSP) & Acoustic Noise Cancellation
 * Cleans up microphone audio before transmitting to server and peers:
 *  1. Low-Rumble & Wind Cancellation (High-Pass Biquad Filter @ 135Hz)
 *  2. High-Frequency Hiss & Electric Sizzle Removal (Low-Pass Biquad Filter @ 3600Hz)
 *  3. Human Speech Formant & Intelligibility Boost (Vocal Peaking Filters @ 550Hz and 2400Hz)
 *  4. Adaptive Real-time Noise Gate & Downward Expander (Smoothly mutes ambient background noise when not talking)
 *  5. Studio Dynamics Compressor & Peak Limiter (Prevents clipping & loud spikes, evens vocal volume)
 */

export interface NoiseProcessorOptions {
  gateThreshold?: number; // RMS threshold above which gate opens (default: 0.012)
  gateCloseThreshold?: number; // RMS threshold below which gate closes
  speechHoldMs?: number; // Natural syllable hold duration in ms (default: 110ms)
  speechReleaseMs?: number; // Smooth fade-out duration in ms (default: 30ms)
  onGateStateChange?: (isOpen: boolean, audioLevel: number) => void;
}

export class AudioNoiseSuppressionProcessor {
  private audioCtx: AudioContext | null = null;
  private rawStream: MediaStream;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  
  private highpassFilter1: BiquadFilterNode | null = null;
  private highpassFilter2: BiquadFilterNode | null = null;
  private lowpassFilter1: BiquadFilterNode | null = null;
  private lowpassFilter2: BiquadFilterNode | null = null;
  private vocalBodyFilter: BiquadFilterNode | null = null;
  private vocalPresenceFilter: BiquadFilterNode | null = null;
  private gateGainNode: GainNode | null = null;
  private compressorNode: DynamicsCompressorNode | null = null;
  private scriptProcessor: ScriptProcessorNode | null = null;
  private destinationNode: MediaStreamAudioDestinationNode | null = null;
  private dummySilentGain: GainNode | null = null;

  private isEnabled: boolean = true;
  private openThreshold: number;
  private closeThreshold: number;
  private speechHoldMs: number;
  private speechReleaseMs: number;
  private onGateStateChange?: (isOpen: boolean, audioLevel: number) => void;

  private lastSpeechTimestamp: number = 0;
  private isCurrentlyOpen: boolean = false;
  private processedStream: MediaStream | null = null;
  private currentVolumeLevel: number = 0;
  private adaptiveNoiseFloor: number = 0.008;

  constructor(rawStream: MediaStream, enabled: boolean = true, options?: NoiseProcessorOptions) {
    this.rawStream = rawStream;
    this.isEnabled = enabled;
    this.openThreshold = options?.gateThreshold ?? 0.012;
    this.closeThreshold = options?.gateCloseThreshold ?? (this.openThreshold * 0.65);
    this.speechHoldMs = options?.speechHoldMs ?? 110;
    this.speechReleaseMs = options?.speechReleaseMs ?? 30;
    this.onGateStateChange = options?.onGateStateChange;

    this.initPipeline();
  }

  private initPipeline(): void {
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

      if (!AudioContextClass) {
        console.warn('Web Audio API is not supported in this environment');
        this.processedStream = this.rawStream;
        return;
      }

      this.audioCtx = new AudioContextClass({ latencyHint: 'playback' });
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().catch(() => {});
      }

      this.sourceNode = this.audioCtx.createMediaStreamSource(this.rawStream);

      // Cascaded High-Pass Filter @ 135Hz
      this.highpassFilter1 = this.audioCtx.createBiquadFilter();
      this.highpassFilter1.type = 'highpass';
      this.highpassFilter1.frequency.value = 135;
      this.highpassFilter1.Q.value = 0.707;

      this.highpassFilter2 = this.audioCtx.createBiquadFilter();
      this.highpassFilter2.type = 'highpass';
      this.highpassFilter2.frequency.value = 135;
      this.highpassFilter2.Q.value = 0.707;

      // Cascaded Low-Pass Filter @ 3600Hz
      this.lowpassFilter1 = this.audioCtx.createBiquadFilter();
      this.lowpassFilter1.type = 'lowpass';
      this.lowpassFilter1.frequency.value = 3600;
      this.lowpassFilter1.Q.value = 0.707;

      this.lowpassFilter2 = this.audioCtx.createBiquadFilter();
      this.lowpassFilter2.type = 'lowpass';
      this.lowpassFilter2.frequency.value = 3600;
      this.lowpassFilter2.Q.value = 0.707;

      // Vocal Body Formant @ 550Hz
      this.vocalBodyFilter = this.audioCtx.createBiquadFilter();
      this.vocalBodyFilter.type = 'peaking';
      this.vocalBodyFilter.frequency.value = 550;
      this.vocalBodyFilter.Q.value = 1.0;
      this.vocalBodyFilter.gain.value = 2.5;

      // Vocal Presence Formant @ 2400Hz
      this.vocalPresenceFilter = this.audioCtx.createBiquadFilter();
      this.vocalPresenceFilter.type = 'peaking';
      this.vocalPresenceFilter.frequency.value = 2400;
      this.vocalPresenceFilter.Q.value = 1.2;
      this.vocalPresenceFilter.gain.value = 4.5;

      // Studio Noise Gate Gain Node
      this.gateGainNode = this.audioCtx.createGain();
      this.gateGainNode.gain.value = this.isEnabled ? 0.0 : 1.0;

      // Intelligent VAD
      this.scriptProcessor = this.audioCtx.createScriptProcessor(256, 1, 1);
      this.scriptProcessor.onaudioprocess = (event) => {
        if (!this.isEnabled) {
          if (this.gateGainNode && this.audioCtx) {
            this.gateGainNode.gain.setValueAtTime(1.0, this.audioCtx.currentTime);
          }
          this.isCurrentlyOpen = true;
          return;
        }

        const inputData = event.inputBuffer.getChannelData(0);
        let sumSquares = 0;
        let peak = 0;
        let zeroCrossings = 0;
        const len = inputData.length;

        for (let i = 0; i < len; i++) {
          const sample = inputData[i];
          const absVal = Math.abs(sample);
          if (absVal > peak) peak = absVal;
          sumSquares += sample * sample;
          if (i > 0 && ((inputData[i] >= 0 && inputData[i - 1] < 0) || (inputData[i] < 0 && inputData[i - 1] >= 0))) {
            zeroCrossings++;
          }
        }

        const rms = Math.sqrt(sumSquares / len);
        const crestFactor = rms > 0.0001 ? peak / rms : 1.0;
        const zcr = zeroCrossings / len;
        const now = performance.now();

        if (rms < this.adaptiveNoiseFloor) {
          this.adaptiveNoiseFloor = this.adaptiveNoiseFloor * 0.95 + rms * 0.05;
        } else {
          this.adaptiveNoiseFloor = this.adaptiveNoiseFloor * 0.998 + rms * 0.002;
        }
        this.adaptiveNoiseFloor = Math.max(0.002, Math.min(0.06, this.adaptiveNoiseFloor));

        const dynamicOpenThreshold = Math.max(this.openThreshold, this.adaptiveNoiseFloor * 2.3 + 0.007);
        const dynamicCloseThreshold = dynamicOpenThreshold * 0.65;

        const isVoiceCandidate =
          rms >= dynamicOpenThreshold &&
          (crestFactor >= 2.3 || rms >= dynamicOpenThreshold * 1.4) &&
          (zcr >= 0.015 && zcr <= 0.65);

        if (isVoiceCandidate) {
          this.lastSpeechTimestamp = now;
          if (!this.isCurrentlyOpen) {
            this.isCurrentlyOpen = true;
            if (this.gateGainNode && this.audioCtx) {
              this.gateGainNode.gain.setTargetAtTime(1.0, this.audioCtx.currentTime, 0.003);
            }
          }
        } else if (this.isCurrentlyOpen && rms >= dynamicCloseThreshold) {
          this.lastSpeechTimestamp = now;
        }

        const elapsedSinceSpeech = now - this.lastSpeechTimestamp;

        if (this.isCurrentlyOpen && elapsedSinceSpeech > this.speechHoldMs) {
          this.isCurrentlyOpen = false;
          if (this.gateGainNode && this.audioCtx) {
            this.gateGainNode.gain.setTargetAtTime(0.0, this.audioCtx.currentTime, 0.015);
          }
        }

        if (this.isCurrentlyOpen) {
          this.currentVolumeLevel = Math.min(100, Math.round((rms / 0.16) * 100));
          this.onGateStateChange?.(true, this.currentVolumeLevel);
        } else {
          this.currentVolumeLevel = 0;
          this.onGateStateChange?.(false, 0);
        }
      };

      // Studio Dynamics Compressor & Limiter
      this.compressorNode = this.audioCtx.createDynamicsCompressor();
      this.compressorNode.threshold.value = -24;
      this.compressorNode.knee.value = 8;
      this.compressorNode.ratio.value = 5.5;
      this.compressorNode.attack.value = 0.002;
      this.compressorNode.release.value = 0.06;

      this.destinationNode = this.audioCtx.createMediaStreamDestination();

      // Transmission Graph
      this.sourceNode.connect(this.highpassFilter1);
      this.highpassFilter1.connect(this.highpassFilter2);
      this.highpassFilter2.connect(this.vocalBodyFilter);
      this.vocalBodyFilter.connect(this.vocalPresenceFilter);
      this.vocalPresenceFilter.connect(this.lowpassFilter1);
      this.lowpassFilter1.connect(this.lowpassFilter2);
      this.lowpassFilter2.connect(this.gateGainNode);
      this.gateGainNode.connect(this.compressorNode);
      this.compressorNode.connect(this.destinationNode);

      // Sidechain Detector tap
      this.dummySilentGain = this.audioCtx.createGain();
      this.dummySilentGain.gain.value = 0.0;
      this.lowpassFilter2.connect(this.scriptProcessor);
      this.scriptProcessor.connect(this.dummySilentGain);
      this.dummySilentGain.connect(this.destinationNode);

      this.processedStream = this.destinationNode.stream;
    } catch (err) {
      console.error('Failed to initialize AudioNoiseSuppressionProcessor:', err);
      this.processedStream = this.rawStream;
    }
  }

  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    if (this.audioCtx && this.gateGainNode) {
      if (!enabled) {
        this.gateGainNode.gain.setValueAtTime(1.0, this.audioCtx.currentTime);
      }
    }
  }

  public getIsEnabled(): boolean {
    return this.isEnabled;
  }

  public getProcessedStream(): MediaStream {
    return this.processedStream || this.rawStream;
  }

  public getRawStream(): MediaStream {
    return this.rawStream;
  }

  public getCurrentVolumeLevel(): number {
    return this.currentVolumeLevel;
  }

  public isGateOpen(): boolean {
    return this.isEnabled ? this.isCurrentlyOpen : true;
  }

  public resume(): void {
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
  }

  public destroy(): void {
    try {
      if (this.dummySilentGain) {
        this.dummySilentGain.disconnect();
        this.dummySilentGain = null;
      }
      if (this.scriptProcessor) {
        this.scriptProcessor.disconnect();
        this.scriptProcessor.onaudioprocess = null;
        this.scriptProcessor = null;
      }
      if (this.sourceNode) {
        this.sourceNode.disconnect();
        this.sourceNode = null;
      }
      if (this.highpassFilter1) {
        this.highpassFilter1.disconnect();
        this.highpassFilter1 = null;
      }
      if (this.highpassFilter2) {
        this.highpassFilter2.disconnect();
        this.highpassFilter2 = null;
      }
      if (this.lowpassFilter1) {
        this.lowpassFilter1.disconnect();
        this.lowpassFilter1 = null;
      }
      if (this.lowpassFilter2) {
        this.lowpassFilter2.disconnect();
        this.lowpassFilter2 = null;
      }
      if (this.vocalBodyFilter) {
        this.vocalBodyFilter.disconnect();
        this.vocalBodyFilter = null;
      }
      if (this.vocalPresenceFilter) {
        this.vocalPresenceFilter.disconnect();
        this.vocalPresenceFilter = null;
      }
      if (this.gateGainNode) {
        this.gateGainNode.disconnect();
        this.gateGainNode = null;
      }
      if (this.compressorNode) {
        this.compressorNode.disconnect();
        this.compressorNode = null;
      }
      if (this.audioCtx && this.audioCtx.state !== 'closed') {
        this.audioCtx.close().catch(() => {});
        this.audioCtx = null;
      }
      this.processedStream = null;
    } catch (err) {
      console.warn('Error destroying AudioNoiseSuppressionProcessor:', err);
    }
  }
}

export const NOISE_SUPPRESSION_STORAGE_KEY = 'super_legend_mic_noise_suppression_enabled';

export function getSavedNoiseSuppressionState(): boolean {
  try {
    const saved = localStorage.getItem(NOISE_SUPPRESSION_STORAGE_KEY);
    if (saved !== null) {
      return saved === 'true';
    }
  } catch (e) {}
  return true;
}

export function saveNoiseSuppressionState(enabled: boolean): void {
  try {
    localStorage.setItem(NOISE_SUPPRESSION_STORAGE_KEY, enabled ? 'true' : 'false');
  } catch (e) {}
}
