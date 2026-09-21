/**
 * Gift On-Demand Loading and Local Device Cache Service
 * خدمة تحميل الهدايا عند الطلب والتخزين المؤقت في جوال المستخدم
 */

import { GiftItem } from './giftCmsService';

const LOCAL_STORAGE_KEY = 'super_legend_cached_gifts_v2';

function getInitialLoadedGifts(): string[] {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    // Ignore storage parse errors
  }
  return [];
}

// Memory cache for fully loaded gift IDs (loaded from localStorage on startup)
const loadedGiftIds = new Set<string>(getInitialLoadedGifts());

// Keep decoded images hot in memory so they never re-render or re-fetch
const memoryImageCache = new Map<string, HTMLImageElement>();

// Track loading progress (0 - 100) per gift ID
type ProgressListener = (giftId: string, progress: number, isLoaded: boolean) => void;
const listeners = new Set<ProgressListener>();
const progressMap = new Map<string, number>();

function persistLoadedGiftIds() {
  try {
    const list = Array.from(loadedGiftIds).slice(-200); // Keep up to 200 cached gift IDs
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    // LocalStorage quota or access error
  }
}

export function isGiftLoaded(giftId: string): boolean {
  return loadedGiftIds.has(giftId);
}

export function getGiftLoadingProgress(giftId: string): number {
  if (loadedGiftIds.has(giftId)) return 100;
  return progressMap.get(giftId) || 0;
}

export function subscribeToGiftLoading(listener: ProgressListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notifyProgress(giftId: string, progress: number, isLoaded: boolean) {
  progressMap.set(giftId, progress);
  if (isLoaded) {
    loadedGiftIds.add(giftId);
    persistLoadedGiftIds();
  }
  listeners.forEach((l) => l(giftId, progress, isLoaded));
}

/**
 * تحميل الهدية عند الطلب مع حفظها في ذاكرة الجوال المؤقتة
 */
export function loadGiftOnDemand(gift: GiftItem): Promise<boolean> {
  const giftId = gift.id;

  if (loadedGiftIds.has(giftId)) {
    return Promise.resolve(true);
  }

  const mediaSrc = gift.videoUrl || gift.icon;

  return new Promise((resolve) => {
    let currentProgress = 15;
    notifyProgress(giftId, currentProgress, false);

    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 25) + 20;
      if (currentProgress >= 90) {
        currentProgress = 90;
        clearInterval(interval);
      }
      notifyProgress(giftId, currentProgress, false);
    }, 35);

    const finishLoading = (success: boolean) => {
      clearInterval(interval);
      notifyProgress(giftId, 100, true);
      resolve(success);
    };

    if (!mediaSrc || (!mediaSrc.startsWith('http') && !mediaSrc.startsWith('blob:') && !mediaSrc.startsWith('data:'))) {
      // It's an emoji or local symbol
      setTimeout(() => finishLoading(true), 80);
      return;
    }

    if (mediaSrc.includes('video') || mediaSrc.endsWith('.webm') || mediaSrc.endsWith('.mp4')) {
      const video = document.createElement('video');
      video.preload = 'auto';
      video.src = mediaSrc;
      video.oncanplaythrough = () => finishLoading(true);
      video.onerror = () => finishLoading(true); // Fallback gracefully
      setTimeout(() => finishLoading(true), 1000); // Safety timeout
    } else {
      if (memoryImageCache.has(mediaSrc)) {
        finishLoading(true);
        return;
      }
      const img = new Image();
      img.src = mediaSrc;
      img.onload = () => {
        memoryImageCache.set(mediaSrc, img);
        finishLoading(true);
      };
      img.onerror = () => finishLoading(true); // Fallback gracefully
      setTimeout(() => finishLoading(true), 800); // Safety timeout
    }
  });
}

/**
 * عدد الهدايا المحفوظة في ذاكرة الجوال
 */
export function getCachedGiftsCount(): number {
  return loadedGiftIds.size;
}

/**
 * إزالة الهدية من كاش وذاكرة الهاتف فور حذفها من الداشبورد
 */
export function evictCachedGift(giftId: string): void {
  loadedGiftIds.delete(giftId);
  progressMap.delete(giftId);
  persistLoadedGiftIds();
  // مسح أي وسائط محفوظة في ذاكرة الـ RAM تخص هذه الهدية
  for (const [key] of memoryImageCache.entries()) {
    if (key.includes(giftId)) {
      memoryImageCache.delete(key);
    }
  }
  listeners.forEach((l) => l(giftId, 0, false));
}

