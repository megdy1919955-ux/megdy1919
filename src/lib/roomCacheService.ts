/**
 * خدمة الحافظة المؤقتة للروم والخلفيات في جوال المستخدم
 * Local Cache & Silent Preloading Service for Voice Room & Wallpapers
 */

export interface RoomCachedState {
  roomId: string;
  roomTitle?: string;
  roomAvatar?: string;
  wallpaperUrl?: string;
  wallpaperName?: string;
  cachedAt: number;
  themeConfig?: any;
}

// Memory cache for preloaded images in the current session
const inMemoryPreloadedWallpapers = new Set<string>();

const CACHE_PREFIX = 'super_legend_room_cache_v2_';

/**
 * استرجاع بيانات الروم من الحافظة المؤقتة المحلية في هاتف المستخدم فوراً (Zero Latency)
 */
export function getCachedRoomState(roomId: string): RoomCachedState | null {
  try {
    const raw = localStorage.getItem(`${CACHE_PREFIX}${roomId}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      return parsed;
    }
  } catch (err) {
    console.warn('Failed to load room cached state:', err);
  }
  return null;
}

/**
 * حفظ هيكل الروم والخلفية الحالية في الحافظة المؤقتة لجوال المستخدم
 */
export function saveRoomStateToCache(
  roomId: string,
  data: Partial<RoomCachedState>
): void {
  try {
    const existing = getCachedRoomState(roomId) || {
      roomId,
      cachedAt: Date.now()
    };

    const updated: RoomCachedState = {
      ...existing,
      ...data,
      cachedAt: Date.now()
    };

    localStorage.setItem(`${CACHE_PREFIX}${roomId}`, JSON.stringify(updated));
  } catch (err) {
    console.warn('Failed to save room state to cache:', err);
  }
}

/**
 * فحص ما إذا كانت الخلفية محملة وموجودة مسبقاً في الذاكرة المؤقتة
 */
export function isWallpaperInCache(url?: string): boolean {
  if (!url) return false;
  return inMemoryPreloadedWallpapers.has(url);
}

/**
 * تحميل خلفية الروم في الخلفية بشكل خفي وصامت دون تعطيل واجهة المستخدم أو الصوت
 * Preload wallpaper image silently in background
 */
export function preloadWallpaperSilently(
  url: string,
  wallpaperName?: string
): Promise<boolean> {
  return new Promise((resolve) => {
    if (!url) {
      resolve(false);
      return;
    }

    if (inMemoryPreloadedWallpapers.has(url)) {
      resolve(true);
      return;
    }

    // Dispatch background caching started event
    window.dispatchEvent(
      new CustomEvent('room_wallpaper_caching_status', {
        detail: {
          status: 'caching',
          url,
          wallpaperName: wallpaperName || 'خلفية الروم'
        }
      })
    );

    const img = new Image();
    img.src = url;

    img.onload = () => {
      inMemoryPreloadedWallpapers.add(url);

      // Dispatch background caching ready event
      window.dispatchEvent(
        new CustomEvent('room_wallpaper_caching_status', {
          detail: {
            status: 'ready',
            url,
            wallpaperName: wallpaperName || 'خلفية الروم'
          }
        })
      );
      resolve(true);
    };

    img.onerror = () => {
      window.dispatchEvent(
        new CustomEvent('room_wallpaper_caching_status', {
          detail: {
            status: 'error',
            url,
            wallpaperName: wallpaperName || 'خلفية الروم'
          }
        })
      );
      resolve(false);
    };
  });
}
