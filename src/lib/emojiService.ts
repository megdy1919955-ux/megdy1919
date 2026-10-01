/**
 * Emoji CMS & Real-time Server Sync Service
 * Super Legend App - 2026
 *
 * يوفر نظام إدارة ومزامنة حية لمربعات الإيموجي مع السيرفر (Firestore) ولوحة التحكم (Dashboard).
 * كود مستقل تماماً يدعم التحديثات اللحظية والتخزين المؤقت الفوري بدون أي تأخير.
 */

import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';

export type EmojiCategory =
  | 'free'
  | 'emoji'
  | 'featured'
  | 'custom'
  | 'vip'
  | 'events'
  | 'classic'
  | 'energy'
  | 'games';

export interface EmojiTabConfig {
  id: EmojiCategory;
  label: string;
}

export const EMOJI_TABS: EmojiTabConfig[] = [
  { id: 'emoji', label: 'Emoji' },
  { id: 'free', label: 'مجاني' },
  { id: 'featured', label: 'مميزة' },
  { id: 'custom', label: 'مخصص' },
  { id: 'vip', label: 'VIP' },
  { id: 'events', label: 'الفعاليات' },
];

export interface EmojiSlotItem {
  id: string; // المعرف الفريد للمربع مثل: slot_1, slot_2
  slotIndex: number; // رقم ترتيب المربع (0, 1, 2...)
  emoji: string; // رمز الإيموجي الأساسي (أيقونة، تعبير، أو رمز)
  name: string; // الاسم بالعربي
  iconUrl?: string; // صورة أو أنيميشن مخصص في حال رفعه من الداشبورد
  category: EmojiCategory; // التصنيف
  badge?: string; // شارة مثل: VIP, HOT, NEW
  isVip?: boolean;
  animationType?: 'float' | 'bounce' | 'pulse' | 'firework' | 'spin';
  updatedAt?: string;
}

export interface SyncSignalMeta {
  id: string;
  version: number;
  updatedAt: string;
}

const CACHE_STORAGE_KEY = 'super_legend_room_emojis_cache_v3';
const CACHE_VERSION_KEY = 'super_legend_room_emojis_version_v3';
const EMOJI_COLLECTION = 'app_emojis';
const META_COLLECTION = 'app_meta';
const EMOJIS_SIGNAL_DOC = 'emojis_sync';

// قائمة المربعات الافتراضية مطابقة تماماً لشاشات التطبيقات الصوتية الاحترافية
export const DEFAULT_EMOJI_SLOTS: EmojiSlotItem[] = [
  // 1. تصنيف مجاني (Free) - المطابق للصورة تماماً
  { id: 'slot_free_1', slotIndex: 1, emoji: '😷❤️', name: 'حب', category: 'free', animationType: 'pulse' },
  { id: 'slot_free_2', slotIndex: 2, emoji: '😚❤️', name: 'الحق قبلة', category: 'free', animationType: 'float' },
  { id: 'slot_free_3', slotIndex: 3, emoji: '🥰', name: 'Love', category: 'free', animationType: 'pulse' },
  { id: 'slot_free_4', slotIndex: 4, emoji: '🎲', name: 'حجر النرد', category: 'free', animationType: 'spin' },
  { id: 'slot_free_5', slotIndex: 5, emoji: '😭', name: '$Sad$', category: 'free', animationType: 'bounce' },
  { id: 'slot_free_6', slotIndex: 6, emoji: '😉', name: '$Wink$', category: 'free', animationType: 'pulse' },
  { id: 'slot_free_7', slotIndex: 7, emoji: '😎', name: 'موضه', category: 'free', animationType: 'pulse' },
  { id: 'slot_free_8', slotIndex: 8, emoji: '😚', name: 'قبلة اليسار', category: 'free', animationType: 'float' },
  { id: 'slot_free_9', slotIndex: 9, emoji: '🤲❤️', name: 'flying kiss', category: 'free', animationType: 'float' },
  { id: 'slot_free_10', slotIndex: 10, emoji: '🥱', name: 'sleepy', category: 'free', animationType: 'pulse' },
  { id: 'slot_free_11', slotIndex: 11, emoji: '🕶️', name: 'Really !', category: 'free', animationType: 'pulse' },
  { id: 'slot_free_12', slotIndex: 12, emoji: '😂', name: '$Laughing$', category: 'free', animationType: 'bounce' },
  { id: 'slot_free_13', slotIndex: 13, emoji: '🌹', name: 'وردة', category: 'free', animationType: 'float' },
  { id: 'slot_free_14', slotIndex: 14, emoji: '👏', name: 'تصفيق', category: 'free', animationType: 'bounce' },
  { id: 'slot_free_15', slotIndex: 15, emoji: '🔥', name: 'نار', category: 'free', animationType: 'firework' },
  { id: 'slot_free_16', slotIndex: 16, emoji: '💯', name: 'كامل', category: 'free', animationType: 'bounce' },

  // 2. تصنيف Emoji
  { id: 'slot_em_1', slotIndex: 17, emoji: '😍', name: 'عشق', category: 'emoji', animationType: 'pulse' },
  { id: 'slot_em_2', slotIndex: 18, emoji: '🤩', name: 'مبهر', category: 'emoji', animationType: 'spin' },
  { id: 'slot_em_3', slotIndex: 19, emoji: '😜', name: 'مرح', category: 'emoji', animationType: 'bounce' },
  { id: 'slot_em_4', slotIndex: 20, emoji: '🥺', name: 'رجاء', category: 'emoji', animationType: 'float' },
  { id: 'slot_em_5', slotIndex: 21, emoji: '😇', name: 'بريء', category: 'emoji', animationType: 'pulse' },
  { id: 'slot_em_6', slotIndex: 22, emoji: '🤫', name: 'هدوء', category: 'emoji', animationType: 'pulse' },
  { id: 'slot_em_7', slotIndex: 23, emoji: '🥳', name: 'حفلة', category: 'emoji', animationType: 'firework' },
  { id: 'slot_em_8', slotIndex: 24, emoji: '🤤', name: 'لذيذ', category: 'emoji', animationType: 'bounce' },
  { id: 'slot_em_9', slotIndex: 25, emoji: '🥶', name: 'متجمد', category: 'emoji', animationType: 'bounce' },
  { id: 'slot_em_10', slotIndex: 26, emoji: '🤯', name: 'صدمة', category: 'emoji', animationType: 'pulse' },
  { id: 'slot_em_11', slotIndex: 27, emoji: '🤠', name: 'راعي بقر', category: 'emoji', animationType: 'bounce' },
  { id: 'slot_em_12', slotIndex: 28, emoji: '😈', name: 'شيطاني', category: 'emoji', animationType: 'pulse' },

  // 3. تصنيف مميزة (Featured)
  { id: 'slot_feat_1', slotIndex: 29, emoji: '🚀', name: 'صاروخ', category: 'featured', animationType: 'float' },
  { id: 'slot_feat_2', slotIndex: 30, emoji: '⚡', name: 'برق طاقة', category: 'featured', animationType: 'pulse' },
  { id: 'slot_feat_3', slotIndex: 31, emoji: '💥', name: 'انفجار', category: 'featured', animationType: 'pulse' },
  { id: 'slot_feat_4', slotIndex: 32, emoji: '🌟', name: 'نجمة', category: 'featured', animationType: 'spin' },
  { id: 'slot_feat_5', slotIndex: 33, emoji: '💎', name: 'ألماسة', category: 'featured', animationType: 'spin' },
  { id: 'slot_feat_6', slotIndex: 34, emoji: '🎈', name: 'بالون', category: 'featured', animationType: 'float' },
  { id: 'slot_feat_7', slotIndex: 35, emoji: '🎯', name: 'الهدف', category: 'featured', animationType: 'pulse' },
  { id: 'slot_feat_8', slotIndex: 36, emoji: '🏎️', name: 'سباق', category: 'featured', animationType: 'bounce' },

  // 4. تصنيف مخصص (Custom)
  { id: 'slot_cust_1', slotIndex: 37, emoji: '🎤', name: 'مايك ذهبي', category: 'custom', animationType: 'pulse' },
  { id: 'slot_cust_2', slotIndex: 38, emoji: '🎧', name: 'دي جي', category: 'custom', animationType: 'bounce' },
  { id: 'slot_cust_3', slotIndex: 39, emoji: '🎸', name: 'جيتار', category: 'custom', animationType: 'bounce' },
  { id: 'slot_cust_4', slotIndex: 40, emoji: '🥁', name: 'طبول', category: 'custom', animationType: 'pulse' },
  { id: 'slot_cust_5', slotIndex: 41, emoji: '☕', name: 'قهوة المزاج', category: 'custom', animationType: 'float' },
  { id: 'slot_cust_6', slotIndex: 42, emoji: '🍫', name: 'شوكولاتة', category: 'custom', animationType: 'pulse' },
  { id: 'slot_cust_7', slotIndex: 43, emoji: '🎵', name: 'نغمة روم', category: 'custom', animationType: 'float' },
  { id: 'slot_cust_8', slotIndex: 44, emoji: '🍕', name: 'بيتزا بارتي', category: 'custom', animationType: 'bounce' },

  // 5. تصنيف VIP الملكي (VIP)
  { id: 'slot_vip_1', slotIndex: 45, emoji: '👑', name: 'تاج الملك', category: 'vip', badge: 'VIP', isVip: true, animationType: 'pulse' },
  { id: 'slot_vip_2', slotIndex: 46, emoji: '🦁', name: 'أسد أسطوري', category: 'vip', badge: 'VIP', isVip: true, animationType: 'bounce' },
  { id: 'slot_vip_3', slotIndex: 47, emoji: '🦅', name: 'صقر ذهبي', category: 'vip', badge: 'VIP', isVip: true, animationType: 'float' },
  { id: 'slot_vip_4', slotIndex: 48, emoji: '🏆', name: 'كأس البطولة', category: 'vip', badge: 'VIP', isVip: true, animationType: 'pulse' },
  { id: 'slot_vip_5', slotIndex: 49, emoji: '🪐', name: 'كوكب زحل', category: 'vip', badge: 'VIP', isVip: true, animationType: 'spin' },
  { id: 'slot_vip_6', slotIndex: 50, emoji: '🏰', name: 'قصر ملكي', category: 'vip', badge: 'VIP', isVip: true, animationType: 'pulse' },
  { id: 'slot_vip_7', slotIndex: 51, emoji: '💰', name: 'حقيبة ذهب', category: 'vip', badge: 'VIP', isVip: true, animationType: 'bounce' },
  { id: 'slot_vip_8', slotIndex: 52, emoji: '🛥️', name: 'يخت فاخر', category: 'vip', badge: 'VIP', isVip: true, animationType: 'float' },

  // 6. تصنيف الفعاليات (Events)
  { id: 'slot_ev_1', slotIndex: 53, emoji: '🎪', name: 'سيرك الحفل', category: 'events', animationType: 'bounce' },
  { id: 'slot_ev_2', slotIndex: 54, emoji: '🎭', name: 'مسرح النجوم', category: 'events', animationType: 'pulse' },
  { id: 'slot_ev_3', slotIndex: 55, emoji: '🎟️', name: 'تذكرة الحظ', category: 'events', animationType: 'float' },
  { id: 'slot_ev_4', slotIndex: 56, emoji: '🎡', name: 'عجلة الحظ', category: 'events', animationType: 'spin' },
  { id: 'slot_ev_5', slotIndex: 57, emoji: '🎆', name: 'ألعاب نارية', category: 'events', animationType: 'firework' },
  { id: 'slot_ev_6', slotIndex: 58, emoji: '🪅', name: 'بينياتا', category: 'events', animationType: 'bounce' },
  { id: 'slot_ev_7', slotIndex: 59, emoji: '🎁', name: 'صندوق الهدايا', category: 'events', animationType: 'pulse' },
  { id: 'slot_ev_8', slotIndex: 60, emoji: '🎊', name: 'كونفيتي', category: 'events', animationType: 'firework' }
];

// حالة المحرك الصامت في الذاكرة (Zero Impact Singleton)
let _isSignalListenerActive = false;
let _hasPendingServerUpdate = false;
let _latestServerVersion = 0;
let _signalUnsubscribe: (() => void) | null = null;

/**
 * الحصول على رقم الإصدار المخزن في جهاز المستخدم
 */
export function getLocalCacheVersion(): number {
  if (typeof window === 'undefined') return 0;
  try {
    const raw = localStorage.getItem(CACHE_VERSION_KEY);
    return raw ? parseInt(raw, 10) || 0 : 0;
  } catch {
    return 0;
  }
}

/**
 * تحديث رقم الإصدار في جهاز المستخدم
 */
export function setLocalCacheVersion(version: number): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CACHE_VERSION_KEY, version.toString());
  } catch (e) {
    console.warn('Failed to save emoji version to local cache', e);
  }
}

/**
 * جلب الإيموجي من ذاكرة الجوال فوراً (0 ملي ثانية) بدون لمس الشبكة
 */
export function getEmojisFromCache(): EmojiSlotItem[] {
  if (typeof window === 'undefined') return DEFAULT_EMOJI_SLOTS;
  try {
    const raw = localStorage.getItem(CACHE_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to parse cached emojis, using fallback', e);
  }
  return DEFAULT_EMOJI_SLOTS;
}

/**
 * حفظ الإيموجي في ذاكرة الجوال المحلية
 */
export function setEmojisToCache(emojis: EmojiSlotItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(emojis));
  } catch (e) {
    console.warn('Failed to write emojis cache', e);
  }
}

/**
 * 🛰️ الإشارة الصامتة في الخلفية (Silent Background Signal Engine)
 * يستمع في الخلفية بدون علم المستخدم وبدون استهلاك للإنترنت أو البطارية.
 * يراقب فقط وثيقة وحيدة صغيرة جداً تحتوي على رقم الإصدار (Version).
 */
export function initSilentEmojiSignalEngine(
  onSignalReceived?: (hasUpdate: boolean, version: number) => void
): () => void {
  if (typeof window === 'undefined' || !db || _isSignalListenerActive) {
    return () => {};
  }

  _isSignalListenerActive = true;

  try {
    const signalDocRef = doc(db, META_COLLECTION, EMOJIS_SIGNAL_DOC);
    _signalUnsubscribe = onSnapshot(
      signalDocRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as SyncSignalMeta;
          const serverVer = data.version || 0;
          _latestServerVersion = serverVer;
          const localVer = getLocalCacheVersion();

          if (serverVer > localVer) {
            // توجد تغييرات جديدة جاهزة بالسيرفر!
            _hasPendingServerUpdate = true;
            onSignalReceived?.(true, serverVer);
          } else {
            _hasPendingServerUpdate = false;
            onSignalReceived?.(false, localVer);
          }
        }
      },
      (error) => {
        console.warn('Silent emoji signal listener failed gracefully', error);
      }
    );

    return () => {
      if (_signalUnsubscribe) {
        _signalUnsubscribe();
        _signalUnsubscribe = null;
      }
      _isSignalListenerActive = false;
    };
  } catch (err) {
    console.warn('Silent signal init error', err);
    _isSignalListenerActive = false;
    return () => {};
  }
}

/**
 * ⚡ التحديث التلقائي الصامت "عند الطلب" (On-Demand Hydration)
 * يتم استدعاؤه تلقائياً عند ضغط المستخدم على زر الإيموجي في الروم:
 * 1. إذا لم يكن هناك أي تعديل في السيرفر: يقرأ من ذاكرة الجوال فوراً (0ms).
 * 2. إذا وجد إشارة تحديث قادمة من الداشبورد: يسحب المربعات الجديدة من السيرفر في الخفاء،
 *    ويخزنها في ذاكرة الجوال ويحدّث العرض تلقائياً وبسلاسة تامة.
 */
export async function getOrHydrateEmojisOnDemand(): Promise<EmojiSlotItem[]> {
  const cachedList = getEmojisFromCache();
  const localVer = getLocalCacheVersion();

  // إذا لم تكن هناك إشارة تحديث وكان الكاش موجوداً، نكتفي بالذاكرة المحلية فوراً
  if (!_hasPendingServerUpdate && cachedList.length > 0 && localVer > 0 && _latestServerVersion <= localVer) {
    return cachedList;
  }

  // يوجد تحديث جديد بالسيرفر أو الكاش فارغ: نجلب التحديث الصامت
  if (!db) {
    return cachedList;
  }

  try {
    const q = query(collection(db, EMOJI_COLLECTION), orderBy('slotIndex', 'asc'));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const list: EmojiSlotItem[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as EmojiSlotItem;
        list.push({
          ...data,
          id: docSnap.id
        });
      });

      list.sort((a, b) => a.slotIndex - b.slotIndex);
      // حفظ في ذاكرة الجوال تلقائياً
      setEmojisToCache(list);
      if (_latestServerVersion > 0) {
        setLocalCacheVersion(_latestServerVersion);
      } else {
        setLocalCacheVersion(Date.now());
      }
      _hasPendingServerUpdate = false;
      return list;
    } else {
      // السيرفر فارغ: نعتمد الافتراضيات
      return cachedList;
    }
  } catch (err) {
    console.warn('Silent on-demand fetch failed, falling back to cached', err);
    return cachedList;
  }
}

/**
 * إرسال إشارة التحديث من الداشبورد إلى السيرفر (Broadcast Server Signal)
 * عندما تقوم الداشبورد بتعديل أو حفظ أي مربع، ترفع رقم الإصدار في السيرفر
 */
export async function broadcastEmojiSignalUpdate(): Promise<void> {
  if (!db) return;
  try {
    const newVersion = Date.now();
    const signalDocRef = doc(db, META_COLLECTION, EMOJIS_SIGNAL_DOC);
    await setDoc(
      signalDocRef,
      {
        id: EMOJIS_SIGNAL_DOC,
        version: newVersion,
        updatedAt: new Date().toISOString()
      },
      { merge: true }
    );
    _latestServerVersion = newVersion;
    setLocalCacheVersion(newVersion);
  } catch (e) {
    console.warn('Failed to broadcast emoji signal update', e);
  }
}

/**
 * تحديث أو استبدال مربع إيموجي من لوحة التحكم وحفظه في السيرفر + إرسال الإشارة
 */
export async function updateEmojiSlotOnServer(
  slotId: string,
  updatedData: Partial<EmojiSlotItem>
): Promise<void> {
  const currentList = getEmojisFromCache();
  const existingIndex = currentList.findIndex((item) => item.id === slotId);

  const baseItem: EmojiSlotItem =
    existingIndex >= 0
      ? currentList[existingIndex]
      : {
          id: slotId,
          slotIndex: currentList.length + 1,
          emoji: '✨',
          name: 'إيموجي جديد',
          category: 'classic',
          animationType: 'float'
        };

  const updatedItem: EmojiSlotItem = {
    ...baseItem,
    ...updatedData,
    id: slotId,
    updatedAt: new Date().toISOString()
  };

  // 1. التحديث الفوري في الكاش المحلي
  let newList: EmojiSlotItem[];
  if (existingIndex >= 0) {
    newList = [...currentList];
    newList[existingIndex] = updatedItem;
  } else {
    newList = [...currentList, updatedItem];
  }
  newList.sort((a, b) => a.slotIndex - b.slotIndex);
  setEmojisToCache(newList);

  // 2. الحفظ الدائم في السيرفر (Firestore)
  if (db) {
    try {
      const docRef = doc(db, EMOJI_COLLECTION, slotId);
      await setDoc(docRef, updatedItem, { merge: true });
      // بث الإشارة التلقائية الصامتة لجميع المستخدمين
      await broadcastEmojiSignalUpdate();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `${EMOJI_COLLECTION}/${slotId}`);
      throw error;
    }
  }
}

/**
 * حفظ قائمة كاملة من المربعات إلى السيرفر دفعة واحدة وبث الإشارة الصامتة
 */
export async function saveAllEmojisToServer(emojis: EmojiSlotItem[]): Promise<void> {
  setEmojisToCache(emojis);

  if (!db) return;

  try {
    const promises = emojis.map((item) => {
      const docRef = doc(db, EMOJI_COLLECTION, item.id);
      return setDoc(
        docRef,
        {
          ...item,
          updatedAt: new Date().toISOString()
        },
        { merge: true }
      );
    });
    await Promise.all(promises);
    // بث الإشارة التلقائية
    await broadcastEmojiSignalUpdate();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, EMOJI_COLLECTION);
    throw error;
  }
}

/**
 * إعادة تعيين جميع المربعات إلى القيم الافتراضية
 */
export async function resetEmojisToDefaultOnServer(): Promise<void> {
  await saveAllEmojisToServer(DEFAULT_EMOJI_SLOTS);
}

/**
 * مستمع للرسائل القادمة من لوحة التحكم الخارجية (External Dashboard postMessage Listener)
 */
export function setupDashboardMessageListener(
  onExternalUpdate?: (updatedList: EmojiSlotItem[]) => void
): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleMessage = async (event: MessageEvent) => {
    try {
      const data = event.data;
      if (!data || typeof data !== 'object') return;

      if (data.source === 'super_legend_dashboard' || data.type === 'EMOJI_DASHBOARD_UPDATE') {
        if (data.action === 'UPDATE_SLOT' && data.slotId && data.payload) {
          await updateEmojiSlotOnServer(data.slotId, data.payload);
          if (onExternalUpdate) {
            onExternalUpdate(getEmojisFromCache());
          }
        } else if (data.action === 'SYNC_ALL' && Array.isArray(data.emojis)) {
          await saveAllEmojisToServer(data.emojis);
          if (onExternalUpdate) {
            onExternalUpdate(getEmojisFromCache());
          }
        }
      }
    } catch (e) {
      console.warn('Error processing dashboard message:', e);
    }
  };

  window.addEventListener('message', handleMessage);
  return () => window.removeEventListener('message', handleMessage);
}
