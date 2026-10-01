/**
 * خدمة صندوق الهدايا والتحميل عند الطلب والتخزين بذاكرة الجوال
 * Gift Box On-Demand & Device Storage Service - Super Legend 2026
 *
 * 1. عزل تام عن شاشة الروم لتخفيف الحمل إلى أدنى حد ممكن (Feather-light room architecture).
 * 2. التحميل عند الطلب (On-Demand Hydration): لا يتم استدعاء الهدايا إلا عند فتح الصندوق.
 * 3. التخزين بذاكرة هاتف المستخدم (Device Storage): حفظ فوري ودائم لضمان استجابة 0ms.
 * 4. رسائل خفية وتحديث صامت (Silent Background Sync): عند تعديل الهدايا من الداشبورد الخارجي
 *    بالكمبيوتر، يستقبل هاتف المستخدم إشعاراً خفياً ويحدّث الهدايا في الذاكرة بصمت دون إزعاج.
 */

import { GiftItem, DEFAULT_GIFTS_DATABASE, getGiftsDatabase, setGiftsDatabase } from './giftCmsService';

export interface GiftBoxCategoryTab {
  id: string;
  label: string;
  icon?: string;
}

export const GIFT_BOX_CATEGORIES: GiftBoxCategoryTab[] = [
  { id: 'رائج', label: 'رائج' },
  { id: 'الفعالية', label: 'الفعاليات' },
  { id: 'فاخرة', label: 'فاخرة' },
  { id: 'تفاعلية', label: 'تفاعلية' },
  { id: 'استرداد', label: 'استرداد' },
  { id: 'الكل', label: 'الكل' }
];

const DEVICE_STORAGE_KEY = 'super_legend_room_gift_box_v1';
const SILENT_GIFT_CHANNEL = 'super_legend_gift_box_silent_sync';

/**
 * جلب الهدايا فوراً من ذاكرة الهاتف (Instant Device Storage Read - 0ms Latency)
 */
export function getGiftsFromDeviceMemory(): GiftItem[] {
  if (typeof window === 'undefined') return DEFAULT_GIFTS_DATABASE;

  try {
    const cached = localStorage.getItem(DEVICE_STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('[GiftBoxService] Failed to read from device memory, falling back:', err);
  }

  // إذا لم تكن موجودة، نجلب من قاعدة الهدايا ونخزنها بذاكرة الهاتف
  const fallback = getGiftsDatabase();
  saveGiftsToDeviceMemory(fallback);
  return fallback;
}

/**
 * حفظ الهدايا في ذاكرة هاتف المستخدم (Device Storage Write)
 */
export function saveGiftsToDeviceMemory(gifts: GiftItem[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(DEVICE_STORAGE_KEY, JSON.stringify(gifts));
  } catch (err) {
    console.warn('[GiftBoxService] Failed to write to device memory:', err);
  }
}

/**
 * تحميل الهدايا عند الطلب (On-Demand Hydration)
 * - يتحقق من وجود تحديثات حديثة من السيرفر أو الداشبورد الخارجي
 * - يحدث الذاكرة المحلية بصمت
 */
export async function getOrHydrateGiftsOnDemand(): Promise<GiftItem[]> {
  // 1. قراءة فورية من ذاكرة الهاتف
  const localGifts = getGiftsFromDeviceMemory();

  try {
    // 2. محاكاة فحص التحديثات الخفية من السيرفر السحابي (Cloud Sync Check)
    const serverDb = getGiftsDatabase();
    if (serverDb && serverDb.length > 0) {
      saveGiftsToDeviceMemory(serverDb);
      return serverDb;
    }
  } catch (err) {
    console.error('[GiftBoxService] On-Demand Hydration error:', err);
  }

  return localGifts;
}

/**
 * بث رسالة خفية عند تعديل الهدايا من الداشبورد الخارجي
 */
export function broadcastSilentGiftUpdate(updatedGifts: GiftItem[]): void {
  saveGiftsToDeviceMemory(updatedGifts);
  setGiftsDatabase(updatedGifts);

  // إرسال عبر قنوات البث المتعددة
  if (typeof window !== 'undefined') {
    try {
      if ('BroadcastChannel' in window) {
        const channel = new BroadcastChannel(SILENT_GIFT_CHANNEL);
        channel.postMessage({ type: 'SILENT_GIFT_UPDATE', timestamp: Date.now(), gifts: updatedGifts });
        channel.close();
      }
    } catch {
      // Fallback
    }

    // إرسال حدث مخصص للمتصفح الحالي
    window.dispatchEvent(
      new CustomEvent('silent_gift_box_updated', { detail: updatedGifts })
    );
  }
}

/**
 * مستمع الرسائل الخفية في هاتف المستخدم (Silent Background Listener)
 * يستقبل التعديل الصامت القادم من الداشبورد الخارجي، ويحدث ذاكرة الهاتف بدون إعادة تحميل الروم
 */
export function setupGiftDashboardSilentListener(
  onGiftsUpdated: (gifts: GiftItem[]) => void
): () => void {
  if (typeof window === 'undefined') return () => {};

  let channel: BroadcastChannel | null = null;
  try {
    if ('BroadcastChannel' in window) {
      channel = new BroadcastChannel(SILENT_GIFT_CHANNEL);
      channel.onmessage = (event) => {
        if (event.data?.type === 'SILENT_GIFT_UPDATE' && Array.isArray(event.data.gifts)) {
          saveGiftsToDeviceMemory(event.data.gifts);
          onGiftsUpdated(event.data.gifts);
        }
      };
    }
  } catch {
    // Channel not supported
  }

  const handleCustomEvent = (e: Event) => {
    const customEvt = e as CustomEvent<GiftItem[]>;
    if (customEvt.detail && Array.isArray(customEvt.detail)) {
      onGiftsUpdated(customEvt.detail);
    }
  };

  const handleStorageEvent = (e: StorageEvent) => {
    if (e.key === DEVICE_STORAGE_KEY && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        if (Array.isArray(parsed)) {
          onGiftsUpdated(parsed);
        }
      } catch {
        // Ignore
      }
    }
  };

  window.addEventListener('silent_gift_box_updated', handleCustomEvent);
  window.addEventListener('storage', handleStorageEvent);

  return () => {
    if (channel) {
      channel.close();
    }
    window.removeEventListener('silent_gift_box_updated', handleCustomEvent);
    window.removeEventListener('storage', handleStorageEvent);
  };
}
