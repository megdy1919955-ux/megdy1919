/**
 * ============================================================================
 * 🎙️ MODULAR AUDIO & VOICE ENGINE - UNIFIED SERVICE
 * المسار الأساسي الموحد لوحدة الصوت: src/audio/index.ts
 * ============================================================================
 * Features:
 *  - Isolated audio architecture: decoupled from UI and other system logic.
 *  - Exclusive ZEGOCLOUD Real-Time Engine (AppID: 2138622497) with auto-reconnect.
 *  - Zero WebRTC fallback.
 *  - Hardware-level Media Mode (STREAM_MUSIC) enforcement.
 *  - High-precision client-side DSP Noise Suppression & Acoustic Filtering.
 *  - Speech-recognition-powered Voice Remote Control.
 *  - Hot Module Replacement (HMR) boundary for instant fast-reload during edits.
 */

export * from './types';
export * from './nativeAudioBridge';
export * from './audioNoiseSuppressionProcessor';
export * from './zegoAudioService';
export * from './roomChatSignaling';
export * from './voiceRemoteService';
export * from './audioEngineService';
export * from './micLogicController';
export * from './presenceLifecycleService';
export * from './liveKitAudioEngine';
export * from './unifiedVoiceEngine';

// Fast Reload / HMR Self-Acceptance
// Allows Vite to hot-swap audio logic without re-rendering or rebuilding the whole app
if ((import.meta as any).hot) {
  (import.meta as any).hot.accept(() => {
    console.log('⚡ [HMR] Modular Audio Service updated cleanly.');
  });
}
