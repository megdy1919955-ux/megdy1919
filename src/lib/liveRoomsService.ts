/**
 * Live Room Realtime Signaling & State Service (خدمة إشارات الرومات والبث الحي المستقلة)
 * Decoupled Signals Pattern: كل مكوّن يرسل ويستقبل إشارات خفيفة بدون أي ترابط ثقيل.
 * Al-Najm (Super Legend) Voice App (c) 2026
 */

export interface ActiveLiveRoomDTO {
  id: string;
  title: string;
  host: string;
  ownerId: string;
  image: string;
  listenersCount: number;
  countryName: string;
  countryCode: string;
  flag: string;
  isOwner?: boolean;
  isLocked?: boolean;
  password?: string;
  badge?: {
    type: 'text' | 'icon';
    content: string;
    bgColor: string;
    textColor?: string;
  };
  hasPlusAvatar?: boolean;
  topTag?: string;
  avatars: string[];
  startedAt?: number;
}

// مفتاح التخزين المخصص للروم الخاص بالمستخدم لتعديل اسمه وصورته
export const getMyCustomRoomConfigKey = (userId: string) => `najm_my_room_cfg_${userId}`;

export interface MyCustomRoomConfig {
  title: string;
  image?: string;
}

export function getMyCustomRoomConfig(userId: string, defaultName: string): MyCustomRoomConfig {
  if (typeof window === 'undefined') return { title: `روم ${defaultName} 🎙️👑` };
  try {
    const raw = localStorage.getItem(getMyCustomRoomConfigKey(userId));
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.title) return parsed;
    }
  } catch {}
  return { title: `روم ${defaultName} 🎙️👑` };
}

export function saveMyCustomRoomConfig(userId: string, config: MyCustomRoomConfig): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(getMyCustomRoomConfigKey(userId), JSON.stringify(config));
    window.dispatchEvent(new CustomEvent('my_room_config_updated', { detail: { userId, config } }));
  } catch {}
}

/**
 * جلب قائمة الرومات النشطة الحية حالياً من السيرفر
 */
export async function fetchLiveRoomsFromServer(): Promise<ActiveLiveRoomDTO[]> {
  try {
    const res = await fetch('/api/rooms/live', {
      headers: { 'Accept': 'application/json' },
      cache: 'no-store'
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.rooms) ? data.rooms : [];
  } catch (err) {
    console.warn('[LiveRoomsService] fetch error:', err);
    return [];
  }
}

/**
 * إشارة اشتراك خفيفة في تحديثات الرومات الحية (Event-Driven Listener)
 */
export function subscribeToLiveRooms(callback: (rooms: ActiveLiveRoomDTO[]) => void): () => void {
  let isSubscribed = true;

  const handleUpdate = (e: any) => {
    if (!isSubscribed) return;
    if (e?.detail?.rooms) {
      callback(e.detail.rooms);
    } else {
      fetchLiveRoomsFromServer().then((fresh) => {
        if (isSubscribed) callback(fresh);
      });
    }
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('live_rooms_updated', handleUpdate);
  }

  // الجلب الأولي
  fetchLiveRoomsFromServer().then((initial) => {
    if (isSubscribed) callback(initial);
  });

  // فحص دوري خفيف كل 4 ثوانٍ للتأكد من مواكبة السيرفر
  const intervalId = setInterval(() => {
    fetchLiveRoomsFromServer().then((fresh) => {
      if (isSubscribed) callback(fresh);
    });
  }, 4000);

  return () => {
    isSubscribed = false;
    clearInterval(intervalId);
    if (typeof window !== 'undefined') {
      window.removeEventListener('live_rooms_updated', handleUpdate);
    }
  };
}
