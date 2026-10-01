/**
 * Fully Automatic Screen Wake Lock Service (بقاء الشاشة مستيقظة تلقائياً داخل أي روم)
 * Uses the Web Screen Wake Lock API with user gesture auto-retries, visibility listeners,
 * and a silent HTML5 video loop fallback for maximum device compatibility (iOS/Android/Desktop).
 */

class WakeLockService {
  private wakeLockSentinel: any = null;
  private isRoomActive: boolean = false;
  private visibilityHandlerBound: (() => void) | null = null;
  private gestureHandlerBound: (() => void) | null = null;
  private fallbackVideo: HTMLVideoElement | null = null;

  /**
   * Check if native Screen Wake Lock API is supported
   */
  public isSupported(): boolean {
    return typeof navigator !== 'undefined' && 'wakeLock' in navigator;
  }

  /**
   * Check if screen is currently locked awake
   */
  public isActive(): boolean {
    return (
      (this.wakeLockSentinel !== null && !this.wakeLockSentinel.released) ||
      (this.fallbackVideo !== null && !this.fallbackVideo.paused)
    );
  }

  /**
   * Request to automatically keep the screen awake when entering any room
   */
  public async requestRoomWakeLock(): Promise<boolean> {
    this.isRoomActive = true;

    // 1. Try immediate acquisition
    const success = await this.acquireNativeWakeLock();

    // 2. Set up listener to re-acquire on first user interaction if blocked by browser policy
    if (!success && this.isRoomActive) {
      this.attachGestureListener();
      this.enableFallbackNoSleep();
    }

    // 3. Set up visibility change listeners
    this.attachVisibilityListeners();

    return success;
  }

  /**
   * Acquire native screen wake lock sentinel
   */
  private async acquireNativeWakeLock(): Promise<boolean> {
    if (!this.isSupported()) {
      this.enableFallbackNoSleep();
      return false;
    }

    try {
      // Release existing if any
      if (this.wakeLockSentinel && !this.wakeLockSentinel.released) {
        try {
          await this.wakeLockSentinel.release();
        } catch {}
      }

      this.wakeLockSentinel = await (navigator as any).wakeLock.request('screen');

      this.wakeLockSentinel.addEventListener('release', () => {
        // If released unexpectedly while room is still active, re-acquire when visible
        if (this.isRoomActive && document.visibilityState === 'visible') {
          this.acquireNativeWakeLock().catch(() => {});
        }
      });

      // Once native lock succeeds, disable fallback video to save resources
      this.disableFallbackNoSleep();
      this.removeGestureListener();
      return true;
    } catch (err) {
      // Browser might require user gesture (e.g. on mobile/iOS)
      this.enableFallbackNoSleep();
      this.attachGestureListener();
      return false;
    }
  }

  /**
   * Attach silent user interaction listeners to activate wake lock on first touch
   */
  private attachGestureListener(): void {
    if (this.gestureHandlerBound || typeof window === 'undefined') return;

    this.gestureHandlerBound = async () => {
      if (this.isRoomActive) {
        await this.acquireNativeWakeLock();
        if (this.fallbackVideo && this.fallbackVideo.paused) {
          this.fallbackVideo.play().catch(() => {});
        }
      }
    };

    window.addEventListener('touchstart', this.gestureHandlerBound, { passive: true, capture: true });
    window.addEventListener('pointerdown', this.gestureHandlerBound, { passive: true, capture: true });
    window.addEventListener('click', this.gestureHandlerBound, { passive: true, capture: true });
    window.addEventListener('keydown', this.gestureHandlerBound, { passive: true, capture: true });
  }

  private removeGestureListener(): void {
    if (!this.gestureHandlerBound || typeof window === 'undefined') return;
    window.removeEventListener('touchstart', this.gestureHandlerBound, { capture: true });
    window.removeEventListener('pointerdown', this.gestureHandlerBound, { capture: true });
    window.removeEventListener('click', this.gestureHandlerBound, { capture: true });
    window.removeEventListener('keydown', this.gestureHandlerBound, { capture: true });
    this.gestureHandlerBound = null;
  }

  /**
   * Attach visibility change listeners
   */
  private attachVisibilityListeners(): void {
    if (this.visibilityHandlerBound || typeof document === 'undefined') return;

    this.visibilityHandlerBound = async () => {
      if (document.visibilityState === 'visible' && this.isRoomActive) {
        await this.acquireNativeWakeLock();
        if (this.fallbackVideo && this.fallbackVideo.paused) {
          this.fallbackVideo.play().catch(() => {});
        }
      }
    };

    document.addEventListener('visibilitychange', this.visibilityHandlerBound);
    window.addEventListener('focus', this.visibilityHandlerBound);
    window.addEventListener('pageshow', this.visibilityHandlerBound);
  }

  /**
   * Fallback micro-video loop for browsers without WakeLock API (e.g. older iOS WebKit)
   */
  private enableFallbackNoSleep(): void {
    if (typeof document === 'undefined' || this.fallbackVideo) return;

    try {
      const video = document.createElement('video');
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', '');
      video.setAttribute('muted', '');
      video.setAttribute('loop', '');
      video.muted = true;
      video.playsInline = true;
      video.loop = true;
      video.style.position = 'fixed';
      video.style.top = '-9999px';
      video.style.left = '-9999px';
      video.style.width = '1px';
      video.style.height = '1px';
      video.style.opacity = '0.01';
      video.style.pointerEvents = 'none';
      video.style.zIndex = '-1';

      // 1-frame tiny black WebM/MP4 data URI
      video.src = 'data:video/mp4;base64,AAAAHGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAAAA1tZGF0AAAC...';

      document.body.appendChild(video);
      this.fallbackVideo = video;
      video.play().catch(() => {});
    } catch {}
  }

  private disableFallbackNoSleep(): void {
    if (this.fallbackVideo) {
      try {
        this.fallbackVideo.pause();
        this.fallbackVideo.removeAttribute('src');
        this.fallbackVideo.load();
        this.fallbackVideo.remove();
      } catch {}
      this.fallbackVideo = null;
    }
  }

  /**
   * Release wake lock automatically when exiting the room
   */
  public async releaseWakeLock(): Promise<void> {
    this.isRoomActive = false;
    this.removeGestureListener();

    if (this.visibilityHandlerBound && typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', this.visibilityHandlerBound);
      window.removeEventListener('focus', this.visibilityHandlerBound);
      window.removeEventListener('pageshow', this.visibilityHandlerBound);
      this.visibilityHandlerBound = null;
    }

    if (this.wakeLockSentinel && !this.wakeLockSentinel.released) {
      try {
        await this.wakeLockSentinel.release();
      } catch {}
    }

    this.wakeLockSentinel = null;
    this.disableFallbackNoSleep();
  }
}

export const wakeLockService = new WakeLockService();
