/**
 * خدمة الذاكرة المؤقتة الذكية لمودالات ومستطيلات الروم (Room Modals & Stats Cache)
 * 1. عدم تحميل أي مودال أو نافذة إلا عند طلبها فقط (Strict Lazy Loading on demand).
 * 2. الاحتفاظ بمحتوى وواجهات المودال في ذاكرة الجوال (Client-side Memory Cache) بعد فتحه أول مرة ليكون فتحه تالياً فورياً بـ 0ms.
 * 3. في حال احتواء المودال على بيانات إحصائية (Stats/Counters)، يتم جلب أحدث الأرقام من السيرفر/فايرستور عند فتحه مع استخدام البيانات المحفوظة ريثما يكتمل الجلب.
 */

// ذاكرة الجوال المؤقتة السريعة أثناء الجلسة (In-Memory Modal Cache)
const modalLoadedCache = new Set<string>();

// ذاكرة التخزين المحلي لإحصائيات الغرفة السريعة (Stats Cache in LocalStorage)
const STATS_CACHE_PREFIX = 'room_stats_cache_';

export function markModalLoadedInClient(modalKey: string): void {
  modalLoadedCache.add(modalKey);
}

export function isModalLoadedInClient(modalKey: string): boolean {
  return modalLoadedCache.has(modalKey);
}

/**
 * حفظ واسترجاع الإحصائيات المؤقتة للروم في ذاكرة الجوال
 */
export function getCachedRoomStats<T>(statKey: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(`${STATS_CACHE_PREFIX}${statKey}`);
    if (raw) {
      return JSON.parse(raw) as T;
    }
  } catch (e) {
    console.warn('[StatsCache] Failed to parse cached stats', e);
  }
  return fallback;
}

export function saveCachedRoomStats<T>(statKey: string, data: T): void {
  try {
    localStorage.setItem(`${STATS_CACHE_PREFIX}${statKey}`, JSON.stringify(data));
  } catch (e) {
    console.warn('[StatsCache] Failed to save stats cache', e);
  }
}
