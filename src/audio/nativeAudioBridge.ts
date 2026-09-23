import { AudioStreamMode } from './types';

export const SAVED_AUDIO_STREAM_MODE_KEY = 'najm_room_audio_stream_mode';

export function getSavedAudioStreamMode(): AudioStreamMode {
  return 'media'; // Strictly unified Media Stream (Normal Mode / STREAM_MUSIC) for all users
}

export function saveAudioStreamMode(_mode: AudioStreamMode): void {
  try {
    localStorage.setItem(SAVED_AUDIO_STREAM_MODE_KEY, 'media');
  } catch {}
}

/**
 * Notifies Native Android WebView Bridge or Wrapper if present
 * Enforces Audio Mode to MODE_NORMAL (0) and sets volume controls to STREAM_MUSIC (3)
 */
export function notifyNativeAndroidAudioMode(_mode?: AudioStreamMode): void {
  try {
    const win = window as any;
    const androidMode = 'NORMAL';
    const streamType = 'STREAM_MUSIC';

    if (typeof win.AndroidAudioBridge?.setAudioMode === 'function') {
      win.AndroidAudioBridge.setAudioMode(androidMode);
    }
    if (typeof win.AndroidAudioBridge?.setVolumeControlStream === 'function') {
      win.AndroidAudioBridge.setVolumeControlStream(streamType);
    }
    if (typeof win.Android?.setAudioMode === 'function') {
      win.Android.setAudioMode(androidMode);
    }
    if (typeof win.Android?.setSpeakerphoneOn === 'function') {
      win.Android.setSpeakerphoneOn(true);
    }
    if (typeof win.ReactNativeWebView?.postMessage === 'function') {
      win.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'SET_AUDIO_MODE',
        mode: androidMode,
        streamType: streamType
      }));
    }
    window.dispatchEvent(new CustomEvent('native_audio_mode_changed', {
      detail: { mode: androidMode, streamType }
    }));
  } catch (err) {
    console.warn('Native audio mode notification warning:', err);
  }
}

/**
 * Configure MediaSession metadata & playbackState to inform Android/iOS OS
 * that this session is MEDIA PLAYBACK (binding hardware volume buttons to Media Volume)
 */
export function syncMediaSessionState(roomTitle: string = 'غرفة صوتية مباشرة', isPlaying: boolean = true) {
  if (typeof navigator !== 'undefined' && 'mediaSession' in navigator) {
    try {
      if (isPlaying) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: roomTitle,
          artist: 'بث صوتي وسائط (Media Stream) 🎵',
          album: 'الوسائط والسبيكر الخارجي',
          artwork: [
            { src: '/al_najm_logo.png', sizes: '192x192', type: 'image/png' },
            { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }
          ]
        });
        navigator.mediaSession.playbackState = 'playing';

        navigator.mediaSession.setActionHandler('play', () => {});
        navigator.mediaSession.setActionHandler('pause', () => {});
      } else {
        navigator.mediaSession.playbackState = 'none';
      }
    } catch {
      // Ignore in non-supporting browsers
    }
  }
}
