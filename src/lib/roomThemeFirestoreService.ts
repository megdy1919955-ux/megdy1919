import { doc, getDoc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { MainRoomCustomizerConfig } from '../types/roomCustomizer';
import { DEFAULT_MAIN_ROOM_CONFIG } from './roomCustomizerService';

export interface RoomFirestoreData {
  roomId: string;
  ownerId: string;
  ownerName?: string;
  roomTitle?: string;
  wallpaperUrl: string;
  wallpaperName?: string;
  themeConfig?: MainRoomCustomizerConfig;
  createdAt?: string;
  updatedAt?: string;
}

const DEFAULT_WALLPAPER_URL = 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=1200';
const DEFAULT_WALLPAPER_NAME = 'القصر الملكي البنفسجي 🏰';

function getLocalCacheKey(roomId: string): string {
  return `room_theme_firestore_cache_${roomId}`;
}

/**
 * Retrieve cached room theme & wallpaper synchronously
 */
export function getRoomThemeFromCache(roomId: string): RoomFirestoreData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(getLocalCacheKey(roomId));
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Failed to read room theme cache:', e);
  }
  return null;
}

/**
 * Save room data to local storage cache for instant offline rendering
 */
export function setRoomThemeToCache(roomId: string, data: RoomFirestoreData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(getLocalCacheKey(roomId), JSON.stringify(data));
  } catch (e) {
    console.warn('Failed to write room theme cache:', e);
  }
}

/**
 * Fetch room theme & wallpaper directly from Firestore
 */
export async function fetchRoomThemeFromFirestore(roomId: string): Promise<RoomFirestoreData | null> {
  const path = `rooms/${roomId}`;
  try {
    const docRef = doc(db, 'rooms', roomId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data() as RoomFirestoreData;
      setRoomThemeToCache(roomId, data);
      return data;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return getRoomThemeFromCache(roomId);
  }
}

/**
 * Save / Update room theme and background wallpaper in Firestore.
 * Strictly checks that isOwner is true before allowing mutation.
 */
export async function saveRoomThemeAndWallpaperToFirestore({
  roomId,
  isOwner,
  ownerId = '88492011',
  ownerName = 'أميرة الشرق',
  roomTitle,
  wallpaperUrl,
  wallpaperName,
  themeConfig
}: {
  roomId: string;
  isOwner: boolean;
  ownerId?: string;
  ownerName?: string;
  roomTitle?: string;
  wallpaperUrl?: string;
  wallpaperName?: string;
  themeConfig?: MainRoomCustomizerConfig;
}): Promise<{ success: boolean; error?: string; data?: RoomFirestoreData }> {
  // STRICT PERMISSION CHECK: Only Room Owner is authorized to save/modify room theme & background
  if (!isOwner) {
    return {
      success: false,
      error: 'عذراً، صلاحية تعديل وحفظ ثيم وخلفية الغرفة الصوتية في قاعدة البيانات مقتصرة حصرياً على صاحب الغرفة (المالك) فقط 👑'
    };
  }

  const path = `rooms/${roomId}`;
  const now = new Date().toISOString();

  // Get existing cached data or default fallback
  const existing = getRoomThemeFromCache(roomId);

  const payload: RoomFirestoreData = {
    roomId,
    ownerId: ownerId || existing?.ownerId || '88492011',
    ownerName: ownerName || existing?.ownerName || 'أميرة الشرق',
    roomTitle: roomTitle !== undefined ? roomTitle : (existing?.roomTitle || 'روم السهرة والنغم 🎵'),
    wallpaperUrl: wallpaperUrl !== undefined ? wallpaperUrl : (existing?.wallpaperUrl || DEFAULT_WALLPAPER_URL),
    wallpaperName: wallpaperName !== undefined ? wallpaperName : (existing?.wallpaperName || DEFAULT_WALLPAPER_NAME),
    themeConfig: themeConfig !== undefined ? themeConfig : (existing?.themeConfig || DEFAULT_MAIN_ROOM_CONFIG),
    updatedAt: now,
    createdAt: existing?.createdAt || now
  };

  try {
    const docRef = doc(db, 'rooms', roomId);
    await setDoc(docRef, {
      ...payload,
      lastModified: serverTimestamp()
    }, { merge: true });

    // Update local cache
    setRoomThemeToCache(roomId, payload);

    // Dispatch global events for instant reactivity across all listening components
    if (typeof window !== 'undefined') {
      if (payload.themeConfig) {
        window.dispatchEvent(
          new CustomEvent('main_room_theme_updated', {
            detail: { config: payload.themeConfig, roomId }
          })
        );
      }
      if (payload.wallpaperUrl) {
        window.dispatchEvent(
          new CustomEvent('room_wallpaper_updated', {
            detail: { wallpaperUrl: payload.wallpaperUrl, wallpaperName: payload.wallpaperName, roomId }
          })
        );
      }
    }

    return { success: true, data: payload };
  } catch (error) {
    const errorDetails = handleFirestoreError(error, OperationType.WRITE, path);
    // Still update local cache for resilience
    setRoomThemeToCache(roomId, payload);
    return {
      success: false,
      error: errorDetails.message,
      data: payload
    };
  }
}

/**
 * Real-time subscription to room theme and wallpaper document in Firestore
 */
export function subscribeToRoomThemeFromFirestore(
  roomId: string,
  onUpdate: (data: RoomFirestoreData) => void,
  onError?: (err: unknown) => void
): () => void {
  const path = `rooms/${roomId}`;
  const docRef = doc(db, 'rooms', roomId);

  const unsubscribe = onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as RoomFirestoreData;
        setRoomThemeToCache(roomId, data);
        onUpdate(data);
      } else {
        // If room document does not exist yet, supply defaults
        const cached = getRoomThemeFromCache(roomId);
        if (cached) {
          onUpdate(cached);
        }
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
      if (onError) onError(error);
      const cached = getRoomThemeFromCache(roomId);
      if (cached) {
        onUpdate(cached);
      }
    }
  );

  return unsubscribe;
}
