/**
 * Gift CMS (Content Management System) & Real-Time Sync Service
 * Super Legend App - 2026
 */

import { canManageGifts } from './roleService';
import { tempMediaCacheManager } from './tempMediaCacheManager';
import { persistentMediaStorage } from './persistentMediaStorage';

export interface GiftItem {
  id: string;
  name: string;
  price: number;
  icon: string; // Image URL (http/https/data:image), Transparent WebM (data:video/webm or .webm URL), GIF, SVG, or Lottie JSON path
  videoUrl?: string; // Dedicated Transparent WebM or MP4 video URL
  thumbnailUrl?: string; // Fallback static thumbnail image URL
  mediaKey?: string; // Permanent Phone/Device IndexedDB Media Vault key
  soundMediaKey?: string; // Permanent Phone/Device IndexedDB Audio key
  iconMediaKey?: string; // Permanent Phone/Device IndexedDB Icon key
  category: 'الفعالية' | 'رائج' | 'استرداد' | 'الدولة/المنطقة' | 'مخصصة' | 'الامتيازات' | 'مداعبة' | 'الكل';
  subCategory?: string;
  badge?: string; // e.g. "برج الاسد", "LV1", "Top1", "JACKPOT", "حظ", "VIP"
  hasSound?: boolean;
  soundUrl?: string; // Custom audio URL or base64 data:audio
  soundPreset?: 'fanfare' | 'lion_roar' | 'jackpot_bells' | 'magic_sparkle' | 'supercar' | 'laser' | 'applause' | 'kiss' | 'boom';
  soundVolume?: number; // 0.1 to 1.0
  hasGlobalBroadcast?: boolean;
  isLucky?: boolean;
  isRefund?: boolean;
  placement?: 'center' | 'top' | 'mics' | 'bottom' | 'fullscreen';
  renderLayer?: 'behind_mics' | 'above_mics'; // طبقة العرض: خلف المايكات والشات (فوق الخلفية) أو فوق المايكات
  displayPosition?: 'above' | 'below' | 'center'; // موضع الظهور عند إدراج الهدية: فوق أو تحت أو بالوسط
  scale?: number;
  blendMode?: 'screen' | 'lighten' | 'normal';
  durationSeconds?: number;
  lottieData?: string; // Optional embedded Lottie JSON data
  isCustomUploaded?: boolean;
  updatedAt?: number;
}

export function isMediaUrl(src?: string): boolean {
  if (!src) return false;
  const s = src.trim().toLowerCase();
  return (
    s.startsWith('http://') ||
    s.startsWith('https://') ||
    s.startsWith('blob:') ||
    s.startsWith('data:') ||
    s.startsWith('/')
  );
}

export function isWebMVideo(src?: string): boolean {
  if (!src) return false;
  const lower = src.toLowerCase().trim();
  return lower.startsWith('data:video/webm') || lower.endsWith('.webm') || lower.includes('.webm?') || lower.includes('format=webm');
}

export function isVideoResource(src?: string): boolean {
  if (!src) return false;
  const lower = src.toLowerCase().trim();
  return (
    lower.startsWith('blob:') ||
    lower.startsWith('data:video/') ||
    lower.endsWith('.webm') ||
    lower.endsWith('.mp4') ||
    lower.endsWith('.mov') ||
    lower.endsWith('.m4v') ||
    lower.includes('.webm?') ||
    lower.includes('.mp4?') ||
    lower.includes('.mov?') ||
    lower.includes('format=webm') ||
    lower.includes('format=mp4') ||
    lower.includes('video')
  );
}

export function isImageResource(src?: string): boolean {
  if (!src) return false;
  const lower = src.toLowerCase().trim();
  if (isVideoResource(src)) return false;
  return (
    lower.startsWith('http://') ||
    lower.startsWith('https://') ||
    lower.startsWith('data:image/') ||
    lower.startsWith('/') ||
    lower.endsWith('.png') ||
    lower.endsWith('.jpg') ||
    lower.endsWith('.jpeg') ||
    lower.endsWith('.gif') ||
    lower.endsWith('.webp') ||
    lower.endsWith('.svg') ||
    lower.includes('.png?') ||
    lower.includes('.jpg?') ||
    lower.includes('.webp?') ||
    lower.includes('.gif?')
  );
}

export function getCleanGiftEmoji(giftName: string = '', icon?: string): string {
  // If icon is an actual short emoji string (e.g. "🎁", "🏎️", "🦁") and NOT a URL / blob / data
  if (icon && !isMediaUrl(icon) && icon.length <= 8) {
    return icon;
  }
  // Try to find emoji inside giftName (like "سيارة الأفعى الذهبية 🏎️" -> "🏎️")
  if (giftName) {
    const emojiMatch = giftName.match(/(\p{Emoji_Presentation}|\p{Extended_Pictographic})/u);
    if (emojiMatch) return emojiMatch[0];
  }
  return '🎁';
}

export type CmsRole = 'Developer' | 'Designer' | 'Admin' | 'User';

export const CMS_ROLES: { id: CmsRole; label: string; icon: string; description: string }[] = [
  { id: 'Developer', label: 'مطور (Developer)', icon: '💻', description: 'صلاحيات كاملة لإدارة الأكواد والملفات والهدايا' },
  { id: 'Designer', label: 'مصمم (Designer)', icon: '🎨', description: 'صلاحيات رفع وتعديل التصاميم والمؤثرات البصرية والصوتية' },
  { id: 'Admin', label: 'مسؤول (Admin)', icon: '🛡️', description: 'صلاحيات تعديل الأسعار والأسماء وفئات الهدايا' },
  { id: 'User', label: 'مستخدم عادي (User)', icon: '👤', description: 'واجهة المتجر العادية (بدون أزرار التعديل أو الإضافة)' }
];

export const GIFT_SOUND_PRESETS: { id: string; name: string; icon: string; desc: string }[] = [
  { id: 'fanfare', name: 'نغمة ملوكية أسطورية (Fanfare)', icon: '🎺', desc: 'نغمة احتفالية قوية مناسبة للهدايا الفاخرة' },
  { id: 'lion_roar', name: 'زئير الأسد الملكي (Lion Roar)', icon: '🦁', desc: 'صوت زئير مرعب وفخم لفعاليات الأسد' },
  { id: 'jackpot_bells', name: 'رنين الجاكبوت الذهبي (Jackpot)', icon: '🔔', desc: 'أصوات كوينز وأجراس الجاكبوت' },
  { id: 'magic_sparkle', name: 'بريق سحري ونجوم (Magic)', icon: '✨', desc: 'نغمات بلورية ساحرة للهدايا الرومانسية' },
  { id: 'supercar', name: 'محرك سيارة خارقة (Supercar)', icon: '🏎️', desc: 'صوت تسارع محرك سيارة رياضية فارهة' },
  { id: 'laser', name: 'طاقة ليزر وبلازما (Laser)', icon: '⚡', desc: 'صوت شعاع طاقة فضائي' },
  { id: 'applause', name: 'تصفيق جماهيري حار (Applause)', icon: '👏', desc: 'تصفيق وهتاف الجمهور' },
  { id: 'kiss', name: 'قبلة وقلوب حب (Kiss)', icon: '💖', desc: 'صوت قبلة رومانسي لطيف' },
  { id: 'boom', name: 'انفجار أسطوري مدوي (Boom)', icon: '💥', desc: 'صوت انفجار عميق للهدايا الخارقة' }
];

export interface GiftTestVideoPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  videoUrl: string;
  thumbnailUrl?: string;
  soundPreset: 'fanfare' | 'lion_roar' | 'jackpot_bells' | 'magic_sparkle' | 'supercar' | 'laser' | 'applause' | 'kiss' | 'boom';
  placement: 'center' | 'top' | 'mics' | 'bottom' | 'fullscreen';
  scale: number;
  blendMode: 'screen' | 'lighten' | 'normal';
}

export const GIFT_TEST_VIDEO_PRESETS: GiftTestVideoPreset[] = [
  {
    id: 'test_lion_flame',
    name: 'زئير الأسد الملكي الأسطوري 🦁',
    description: 'دخولية أسد ملكي يركض ويزأر بملء الشاشة مع دمج Screen ومؤثر زئير مدوي',
    icon: '🦁',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-bright-golden-sparkles-floating-in-the-dark-41662-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=400&q=80',
    soundPreset: 'lion_roar',
    placement: 'center',
    scale: 1.1,
    blendMode: 'screen'
  },
  {
    id: 'test_supercar',
    name: 'سيارة لامبورغيني خارقة 🏎️',
    description: 'دخولية سيارة رياضية ذهبية فارهة مع خطوط ضوئية ومحرك تسارع',
    icon: '🏎️',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-car-lights-moving-fast-in-a-city-43282-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=400&q=80',
    soundPreset: 'supercar',
    placement: 'center',
    scale: 1.0,
    blendMode: 'screen'
  },
  {
    id: 'test_fire_dragon',
    name: 'تنين اللهب الأسطوري 🐉',
    description: 'تنين مجنح ينفث كرات اللهب والشرارات النارية حول المايكات',
    icon: '🐉',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fire-particles-in-the-dark-41719-large.mp4',
    soundPreset: 'boom',
    placement: 'mics',
    scale: 1.1,
    blendMode: 'screen'
  },
  {
    id: 'test_royal_crown',
    name: 'التاج الإمبراطوري المرصع 👑',
    description: 'تاج ملكي ذهبي مع وميض ألماسي متلألئ وشلال كوينز',
    icon: '👑',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-golden-light-effects-with-sparkles-42774-large.mp4',
    soundPreset: 'fanfare',
    placement: 'top',
    scale: 1.0,
    blendMode: 'screen'
  },
  {
    id: 'test_fireworks',
    name: 'ألعاب نارية ومفرقعات كبرى 🎆',
    description: 'احتفال ألعاب نارية صاخبة تملأ شاشة الروم بأكملها',
    icon: '🎆',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-exploding-fireworks-in-the-night-sky-40455-large.mp4',
    soundPreset: 'applause',
    placement: 'fullscreen',
    scale: 1.0,
    blendMode: 'screen'
  },
  {
    id: 'test_cosmic_portal',
    name: 'بوابة الفضاء والنجوم 🌌',
    description: 'ثقب كوني وبوابة طاقة مشعة بالنيون الأزرق والبنفسجي',
    icon: '🌌',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-purple-and-blue-light-particles-in-motion-41668-large.mp4',
    soundPreset: 'magic_sparkle',
    placement: 'center',
    scale: 1.15,
    blendMode: 'screen'
  }
];

const STORAGE_KEY = 'super_legend_gifts_database_v2';
const ROLE_STORAGE_KEY = 'super_legend_cms_active_role';
const SYNC_CHANNEL_NAME = 'super_legend_gifts_cms_sync_channel';

// Initial Comprehensive Default Gifts Database
export const DEFAULT_GIFTS_DATABASE: GiftItem[] = [
  // 1. الفعالية / برج الأسد / الفعاليات
  {
    id: 'lion_emperor_overlay',
    name: 'زئير الأسد الملكي 🦁',
    price: 1000000,
    icon: '🦁',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-bright-golden-sparkles-floating-in-the-dark-41662-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=400&q=80',
    placement: 'center',
    scale: 1.15,
    blendMode: 'screen',
    durationSeconds: 6.0,
    category: 'الفعالية',
    subCategory: 'حدث برج الاسد',
    badge: 'ملك الغرفة',
    hasSound: true,
    soundPreset: 'lion_roar',
    hasGlobalBroadcast: true
  },
  {
    id: '1',
    name: 'شعلة الأسد 🦁',
    price: 50,
    icon: '🔥',
    category: 'الفعالية',
    subCategory: 'حدث برج الاسد',
    badge: 'برج الاسد',
    hasSound: true,
    soundPreset: 'lion_roar',
    hasGlobalBroadcast: true
  },
  {
    id: '2',
    name: 'خاتم برج الأسد ♌',
    price: 10000,
    icon: '🔮',
    category: 'الفعالية',
    subCategory: 'حدث برج الاسد',
    badge: 'برج الاسد',
    hasSound: true,
    soundPreset: 'magic_sparkle',
    hasGlobalBroadcast: true
  },
  {
    id: '3',
    name: 'سيارة الأفعى الذهبية 🏎️',
    price: 500000,
    icon: '🏎️',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-car-lights-moving-fast-in-a-city-43282-large.mp4',
    placement: 'center',
    scale: 1.0,
    blendMode: 'screen',
    category: 'الفعالية',
    subCategory: 'حدث برج الاسد',
    badge: 'برج الاسد',
    hasSound: true,
    soundPreset: 'supercar',
    hasGlobalBroadcast: true
  },
  {
    id: '4',
    name: 'المحارب الأسطوري ⚔️',
    price: 250000,
    icon: '🛡️',
    category: 'الفعالية',
    subCategory: 'حدث برج الاسد',
    badge: 'برج الاسد',
    hasSound: true,
    soundPreset: 'fanfare',
    hasGlobalBroadcast: true
  },
  {
    id: '5',
    name: 'الأسد الملكي الشامخ 🦁',
    price: 99999,
    icon: '🦁',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-bright-golden-sparkles-floating-in-the-dark-41662-large.mp4',
    placement: 'center',
    scale: 1.05,
    blendMode: 'screen',
    category: 'الفعالية',
    subCategory: 'حدث برج الاسد',
    badge: 'برج الاسد',
    hasSound: true,
    soundPreset: 'lion_roar',
    hasGlobalBroadcast: true
  },
  {
    id: '6',
    name: 'أمير الصحراء 👳‍♂️',
    price: 20000,
    icon: '👳‍♂️',
    category: 'الفعالية',
    subCategory: 'حدث برج الاسد',
    badge: 'برج الاسد',
    hasSound: true,
    soundPreset: 'fanfare',
    hasGlobalBroadcast: true
  },
  {
    id: '7',
    name: 'طائرة الفضاء الملكية 🚀',
    price: 2000000,
    icon: '🚀',
    category: 'الفعالية',
    subCategory: 'حدث برج الاسد',
    badge: 'برج الاسد',
    hasSound: true,
    soundPreset: 'laser',
    hasGlobalBroadcast: true
  },
  {
    id: '8',
    name: 'عشاق الأبدية 💖',
    price: 5000000,
    icon: '👩‍❤️‍👨',
    category: 'الفعالية',
    subCategory: 'رحلة رومانسية',
    badge: 'برج الاسد',
    hasSound: true,
    soundPreset: 'kiss',
    hasGlobalBroadcast: true
  },

  // 2. رائج (Trending)
  {
    id: '9',
    name: 'المجرة الكونية 🌌',
    price: 777,
    icon: '🌌',
    category: 'رائج',
    badge: 'رائج',
    hasSound: true,
    soundPreset: 'magic_sparkle',
    hasGlobalBroadcast: true
  },
  {
    id: '10',
    name: 'الأسد الذهبي المتلألئ 🦁',
    price: 77777,
    icon: '🦁',
    category: 'رائج',
    badge: 'رائج',
    hasSound: true,
    soundPreset: 'lion_roar',
    hasGlobalBroadcast: true
  },
  {
    id: '11',
    name: 'أحد أساطير الحب 📜',
    price: 20000,
    icon: '📜',
    category: 'رائج',
    badge: 'رائج',
    hasSound: true,
    soundPreset: 'magic_sparkle',
    hasGlobalBroadcast: true
  },
  {
    id: '12',
    name: 'القصر الكريستالي 🏰',
    price: 999900,
    icon: '🏰',
    category: 'رائج',
    badge: 'رائج',
    hasSound: true,
    soundPreset: 'fanfare',
    hasGlobalBroadcast: true
  },
  {
    id: '13',
    name: 'السيارة الذهبية الفارهة 🚘',
    price: 150000,
    icon: '🏎️',
    category: 'رائج',
    badge: 'رائج',
    hasSound: true,
    soundPreset: 'supercar',
    hasGlobalBroadcast: true
  },
  {
    id: '14',
    name: 'زجاجة العطور الفاخرة 🍾',
    price: 1777,
    icon: '🍾',
    category: 'رائج',
    hasSound: true,
    soundPreset: 'magic_sparkle',
    hasGlobalBroadcast: false
  },
  {
    id: '15',
    name: 'ملك العرش 👑',
    price: 77777,
    icon: '🤴',
    category: 'رائج',
    badge: 'رائج',
    hasSound: true,
    soundPreset: 'fanfare',
    hasGlobalBroadcast: true
  },
  {
    id: '16',
    name: 'البطة السعيدة 🐥',
    price: 300,
    icon: '🐥',
    category: 'رائج',
    hasSound: true,
    soundPreset: 'magic_sparkle'
  },

  // 3. استرداد / Lucky Refund (Lucky Cashback & Jackpot Treasury)
  {
    id: '17',
    name: 'البطيخة السعيدة 🍉',
    price: 2000,
    icon: '🍉',
    category: 'استرداد',
    badge: 'استرداد',
    isLucky: true,
    isRefund: true,
    hasSound: true,
    soundPreset: 'jackpot_bells'
  },
  {
    id: '18',
    name: 'الآيس كريم المثلج 🍦',
    price: 400,
    icon: '🍦',
    category: 'استرداد',
    badge: 'استرداد',
    isLucky: true,
    isRefund: true,
    hasSound: true,
    soundPreset: 'jackpot_bells'
  },
  {
    id: '19',
    name: 'السيارة الذهب الأسطورية 🏎️',
    price: 10000,
    icon: '🏎️',
    category: 'استرداد',
    badge: 'استرداد',
    isLucky: true,
    isRefund: true,
    hasSound: true,
    soundPreset: 'supercar',
    hasGlobalBroadcast: true
  },
  {
    id: '20',
    name: 'حقيبة الأموال الملكية 💰',
    price: 5000,
    icon: '💰',
    category: 'استرداد',
    badge: 'استرداد',
    isLucky: true,
    isRefund: true,
    hasSound: true,
    soundPreset: 'jackpot_bells'
  },
  {
    id: '21',
    name: 'أجراس الحظ الذهبية 🔔',
    price: 800,
    icon: '🔔',
    category: 'استرداد',
    badge: 'استرداد',
    isLucky: true,
    isRefund: true,
    hasSound: true,
    soundPreset: 'jackpot_bells'
  },
  {
    id: '22',
    name: 'صندوق الكنز السحري 📦',
    price: 24000,
    icon: '📦',
    category: 'استرداد',
    badge: 'استرداد',
    isLucky: true,
    isRefund: true,
    hasSound: true,
    soundPreset: 'jackpot_bells',
    hasGlobalBroadcast: true
  },
  {
    id: '23',
    name: 'الكرة البلورية الأسطورية 🔮',
    price: 4000,
    icon: '🔮',
    category: 'استرداد',
    badge: 'استرداد',
    isLucky: true,
    isRefund: true,
    hasSound: true,
    soundPreset: 'magic_sparkle'
  },
  {
    id: '24',
    name: 'نجمة الجاكبوت الخارقة ⭐️',
    price: 500,
    icon: '⭐️',
    category: 'استرداد',
    badge: 'استرداد',
    isLucky: true,
    isRefund: true,
    hasSound: true,
    soundPreset: 'jackpot_bells'
  },
  {
    id: 'refund_gold_bar',
    name: 'سبيكة الذهب الخالص 🪙',
    price: 15000,
    icon: '🪙',
    category: 'استرداد',
    badge: 'استرداد',
    isLucky: true,
    isRefund: true,
    hasSound: true,
    soundPreset: 'jackpot_bells',
    hasGlobalBroadcast: true
  },
  {
    id: 'refund_phoenix_flame',
    name: 'طائر الفينيق الماسي 🦅',
    price: 50000,
    icon: '🦅',
    category: 'استرداد',
    badge: 'استرداد',
    isLucky: true,
    isRefund: true,
    hasSound: true,
    soundPreset: 'fanfare',
    hasGlobalBroadcast: true
  },

  // 4. الدولة / المنطقة (Country Flags & Monuments)
  {
    id: '25',
    name: 'علم دولة قطر 🇶🇦',
    price: 20000,
    icon: '🇶🇦',
    category: 'الدولة/المنطقة',
    hasSound: true,
    soundPreset: 'fanfare',
    hasGlobalBroadcast: true
  },
  {
    id: '26',
    name: 'علم المملكة العربية السعودية 🇸🇦',
    price: 20000,
    icon: '🇸🇦',
    category: 'الدولة/المنطقة',
    hasSound: true,
    soundPreset: 'fanfare',
    hasGlobalBroadcast: true
  },
  {
    id: '27',
    name: 'علم سلطنة عمان 🇴🇲',
    price: 20000,
    icon: '🇴🇲',
    category: 'الدولة/المنطقة',
    hasSound: true,
    soundPreset: 'fanfare',
    hasGlobalBroadcast: true
  },
  {
    id: '28',
    name: 'بوابة الشمس الأسطورية ☀️',
    price: 2000000,
    icon: '🪐',
    category: 'الدولة/المنطقة',
    hasSound: true,
    soundPreset: 'fanfare',
    hasGlobalBroadcast: true
  },
  {
    id: '29',
    name: 'علم دولة الإمارات 🇦🇪',
    price: 20000,
    icon: '🇦🇪',
    category: 'الدولة/المنطقة',
    hasSound: true,
    soundPreset: 'fanfare',
    hasGlobalBroadcast: true
  },
  {
    id: '30',
    name: 'علم الجمهورية اللبنانية 🇱🇧',
    price: 20000,
    icon: '🇱🇧',
    category: 'الدولة/المنطقة',
    hasSound: true,
    soundPreset: 'fanfare',
    hasGlobalBroadcast: true
  },
  {
    id: '31',
    name: 'علم الجمهورية العربية السورية 🇸🇾',
    price: 20000,
    icon: '🇸🇾',
    category: 'الدولة/المنطقة',
    hasSound: true,
    soundPreset: 'fanfare',
    hasGlobalBroadcast: true
  },
  {
    id: '32',
    name: 'علم جمهورية مصر العربية 🇪🇬',
    price: 20000,
    icon: '🇪🇬',
    category: 'الدولة/المنطقة',
    hasSound: true,
    soundPreset: 'fanfare',
    hasGlobalBroadcast: true
  },

  // 5. مخصصة (Custom Frames / Badges)
  {
    id: '33',
    name: 'اقهريهم 💃',
    price: 20000,
    icon: '💃',
    category: 'مخصصة',
    badge: 'Top3',
    hasSound: true,
    soundPreset: 'magic_sparkle',
    hasGlobalBroadcast: true
  },
  {
    id: '34',
    name: 'سوري وكيان 💑',
    price: 20000,
    icon: '💑',
    category: 'مخصصة',
    badge: 'Top2',
    hasSound: true,
    soundPreset: 'kiss',
    hasGlobalBroadcast: true
  },
  {
    id: '35',
    name: 'نسيم ونورة 👑',
    price: 20000,
    icon: '👑',
    category: 'مخصصة',
    badge: 'Top1',
    hasSound: true,
    soundPreset: 'fanfare',
    hasGlobalBroadcast: true
  },
  {
    id: '36',
    name: 'إحنا دولة 🦁',
    price: 20000,
    icon: '🦁',
    category: 'مخصصة',
    badge: 'LV1',
    hasSound: true,
    soundPreset: 'lion_roar',
    hasGlobalBroadcast: true
  },
  {
    id: '37',
    name: 'فيرساتشي الذهبي 👑',
    price: 20000,
    icon: '✨',
    category: 'مخصصة',
    badge: 'LV1',
    hasSound: true,
    soundPreset: 'fanfare',
    hasGlobalBroadcast: true
  },

  // 6. مداعبة (Teasing / Fun)
  {
    id: '38',
    name: 'مسدس الماء 🔫',
    price: 100,
    icon: '🔫',
    category: 'مداعبة',
    hasSound: true,
    soundPreset: 'laser'
  },
  {
    id: '39',
    name: 'المطرقة المضحكة 🔨',
    price: 200,
    icon: '🔨',
    category: 'مداعبة',
    hasSound: true,
    soundPreset: 'boom'
  },
  {
    id: '40',
    name: 'قنبلة الضحك 💣',
    price: 500,
    icon: '💣',
    category: 'مداعبة',
    hasSound: true,
    soundPreset: 'boom'
  },

  // 7. الامتيازات (Privileges / VIP)
  {
    id: '41',
    name: 'تاج الإمبراطورية 👑',
    price: 1000000,
    icon: '👑',
    category: 'الامتيازات',
    badge: 'VIP',
    hasSound: true,
    soundPreset: 'fanfare',
    hasGlobalBroadcast: true
  },
  {
    id: '42',
    name: 'جناح النسر الماسي 🦅',
    price: 888888,
    icon: '🦅',
    category: 'الامتيازات',
    badge: 'Top1',
    hasSound: true,
    soundPreset: 'magic_sparkle',
    hasGlobalBroadcast: true
  },
  {
    id: '43',
    name: 'يخت الملوك العائم 🛥️',
    price: 1500000,
    icon: '🛥️',
    category: 'الامتيازات',
    badge: 'VIP',
    hasSound: true,
    soundPreset: 'supercar',
    hasGlobalBroadcast: true
  }
];

// In-memory runtime cache for zero-latency synchronous access
let inMemoryGiftsCache: GiftItem[] = DEFAULT_GIFTS_DATABASE;
let isCacheInitialized = false;

// IndexedDB Helper Configuration for Large Media & Gift Assets
const IDB_NAME = 'super_legend_gifts_idb';
const IDB_VERSION = 1;
const IDB_STORE_NAME = 'gifts_store';

function openGiftsIndexedDB(): Promise<IDBDatabase | null> {
  if (typeof window === 'undefined' || !('indexedDB' in window)) {
    return Promise.resolve(null);
  }
  return new Promise((resolve) => {
    try {
      const request = indexedDB.open(IDB_NAME, IDB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(IDB_STORE_NAME)) {
          db.createObjectStore(IDB_STORE_NAME, { keyPath: 'id' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => {
        console.warn('Gifts IndexedDB open failed, using memory/storage fallback');
        resolve(null);
      };
    } catch {
      resolve(null);
    }
  });
}

async function saveGiftsToIndexedDB(gifts: GiftItem[]): Promise<void> {
  try {
    const db = await openGiftsIndexedDB();
    if (!db) return;
    const tx = db.transaction(IDB_STORE_NAME, 'readwrite');
    const store = tx.objectStore(IDB_STORE_NAME);
    store.clear();
    for (const gift of gifts) {
      store.put(gift);
    }
  } catch (err) {
    console.warn('Failed saving gifts to IndexedDB:', err);
  }
}

async function loadGiftsFromIndexedDB(): Promise<GiftItem[] | null> {
  try {
    // 1. Preload all device media files from phone IndexedDB vault
    await persistentMediaStorage.preloadAllDeviceMedia();

    const db = await openGiftsIndexedDB();
    if (!db) return null;
    return new Promise((resolve) => {
      const tx = db.transaction(IDB_STORE_NAME, 'readonly');
      const store = tx.objectStore(IDB_STORE_NAME);
      const request = store.getAll();
      request.onsuccess = async () => {
        const results = request.result;
        if (Array.isArray(results) && results.length > 0) {
          const rehydratedGifts: GiftItem[] = [];
          for (const rawGift of results as GiftItem[]) {
            const gift = { ...rawGift };
            
            // Rehydrate video URL from phone/device memory vault if mediaKey exists or if videoUrl was a stale blob:
            const videoKey = gift.mediaKey || `media_${gift.id}_video`;
            const liveVideoUrl = await persistentMediaStorage.getMediaObjectUrl(videoKey);
            if (liveVideoUrl) {
              gift.videoUrl = liveVideoUrl;
              if (!gift.icon || gift.icon.startsWith('blob:') || !isMediaUrl(gift.icon)) {
                gift.icon = liveVideoUrl;
              }
            } else if (gift.videoUrl && gift.videoUrl.startsWith('blob:')) {
              // Stale blob without vault record, check if icon has fallback
              if (gift.thumbnailUrl) {
                gift.icon = gift.thumbnailUrl;
              }
            }

            // Rehydrate sound URL from phone/device memory vault
            const soundKey = gift.soundMediaKey || `media_${gift.id}_sound`;
            const liveSoundUrl = await persistentMediaStorage.getMediaObjectUrl(soundKey);
            if (liveSoundUrl) {
              gift.soundUrl = liveSoundUrl;
            }

            // Rehydrate icon URL from phone/device memory vault
            const iconKey = gift.iconMediaKey || `media_${gift.id}_icon`;
            const liveIconUrl = await persistentMediaStorage.getMediaObjectUrl(iconKey);
            if (liveIconUrl && !gift.videoUrl) {
              gift.icon = liveIconUrl;
            }

            rehydratedGifts.push(gift);
          }
          resolve(rehydratedGifts);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

// Initialize in-memory cache synchronously from localStorage if possible
function initGiftsCacheSynchronously(): void {
  if (isCacheInitialized || typeof window === 'undefined') return;
  isCacheInitialized = true;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        inMemoryGiftsCache = parsed.map((g: GiftItem) => {
          if (g.category === 'استرداد') {
            return {
              ...g,
              badge: 'استرداد',
              isRefund: true,
              isLucky: true
            };
          }
          return g;
        });
      }
    }
  } catch {
    inMemoryGiftsCache = DEFAULT_GIFTS_DATABASE;
  }

  // Asynchronously load full gifts & rehydrate all videos from device IndexedDB (preserves large custom uploads permanently)
  loadGiftsFromIndexedDB().then((idbGifts) => {
    if (idbGifts && idbGifts.length > 0) {
      inMemoryGiftsCache = idbGifts;
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('gifts_database_updated', { detail: idbGifts }));
      }
    }
  });
}

// Run initial cache setup
if (typeof window !== 'undefined') {
  initGiftsCacheSynchronously();
}

let syncBroadcastChannel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    syncBroadcastChannel = new BroadcastChannel(SYNC_CHANNEL_NAME);
  }
} catch (e) {
  console.warn('BroadcastChannel not supported', e);
}

/**
 * Get current stored gifts database from memory cache, IndexedDB, or fallback to defaults
 */
export function getGiftsDatabase(): GiftItem[] {
  if (!isCacheInitialized) {
    initGiftsCacheSynchronously();
  }
  return inMemoryGiftsCache && inMemoryGiftsCache.length > 0 ? inMemoryGiftsCache : DEFAULT_GIFTS_DATABASE;
}

/**
 * Save updated gifts array with safe quota management and broadcast to all listeners
 */
export function setGiftsDatabase(gifts: GiftItem[]): void {
  if (typeof window === 'undefined') return;

  // 1. Update in-memory runtime cache instantly
  inMemoryGiftsCache = gifts;
  isCacheInitialized = true;

  // 2. Persist full database to IndexedDB asynchronously (handles large video & audio data without limits)
  saveGiftsToIndexedDB(gifts).catch(() => {});

  // 3. Persist to localStorage with intelligent quota handling
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gifts));
  } catch {
    // Quota exceeded: store a lightweight metadata version in localStorage while IndexedDB keeps the full media
    try {
      const lightweightGifts = gifts.map((g) => ({
        ...g,
        icon: g.icon && g.icon.startsWith('data:') && g.icon.length > 1024 ? '🎁' : g.icon,
        videoUrl: g.videoUrl && g.videoUrl.startsWith('data:') && g.videoUrl.length > 1024 ? undefined : g.videoUrl,
        soundUrl: g.soundUrl && g.soundUrl.startsWith('data:') && g.soundUrl.length > 1024 ? undefined : g.soundUrl,
        lottieData: g.lottieData && g.lottieData.length > 1024 ? undefined : g.lottieData,
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lightweightGifts));
    } catch {
      // If even lightweight exceeds remaining quota, quietly proceed since IndexedDB & inMemoryCache hold the data
    }
  }

  // 4. Broadcast window custom event for same-window listeners
  window.dispatchEvent(new CustomEvent('gifts_database_updated', { detail: gifts }));

  // 5. Broadcast across windows / tabs if BroadcastChannel available
  if (syncBroadcastChannel) {
    try {
      // Send lightweight broadcast if payload is massive
      syncBroadcastChannel.postMessage({ type: 'GIFTS_UPDATED', payload: gifts, timestamp: Date.now() });
    } catch {
      // Fallback
    }
  }
}

/**
 * Save / Update a single gift
 */
export function saveOrUpdateGift(gift: GiftItem): GiftItem[] {
  const currentGifts = getGiftsDatabase();
  const existingIdx = currentGifts.findIndex((g) => g.id === gift.id);
  let updatedGifts: GiftItem[];

  const updatedGift: GiftItem = {
    ...gift,
    updatedAt: Date.now()
  };

  if (existingIdx >= 0) {
    updatedGifts = [...currentGifts];
    updatedGifts[existingIdx] = updatedGift;
  } else {
    updatedGifts = [updatedGift, ...currentGifts];
  }

  setGiftsDatabase(updatedGifts);
  return updatedGifts;
}

/**
 * Add a completely new gift
 */
export function addNewGift(newGiftData: Omit<GiftItem, 'id'>): GiftItem {
  const currentGifts = getGiftsDatabase();
  const newId = `gift_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const createdGift: GiftItem = {
    ...newGiftData,
    id: newId,
    updatedAt: Date.now()
  };

  const updatedGifts = [createdGift, ...currentGifts];
  setGiftsDatabase(updatedGifts);
  return createdGift;
}

/**
 * Delete a gift by ID
 */
export function deleteGift(giftId: string): GiftItem[] {
  const currentGifts = getGiftsDatabase();
  const updatedGifts = currentGifts.filter((g) => g.id !== giftId);
  setGiftsDatabase(updatedGifts);
  return updatedGifts;
}

/**
 * Reset all gifts to factory defaults
 */
export function resetGiftsDatabaseToDefault(): GiftItem[] {
  setGiftsDatabase(DEFAULT_GIFTS_DATABASE);
  return DEFAULT_GIFTS_DATABASE;
}

/**
 * Subscribe to real-time gift database updates
 */
export function subscribeToGifts(callback: (gifts: GiftItem[]) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleCustomEvent = (e: Event) => {
    const customEvent = e as CustomEvent<GiftItem[]>;
    if (customEvent.detail) {
      callback(customEvent.detail);
    } else {
      callback(getGiftsDatabase());
    }
  };

  const handleStorageEvent = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        if (Array.isArray(parsed)) callback(parsed);
      } catch (err) {
        callback(getGiftsDatabase());
      }
    }
  };

  const handleBroadcastMessage = (e: MessageEvent) => {
    if (e.data?.type === 'GIFTS_UPDATED' && Array.isArray(e.data.payload)) {
      callback(e.data.payload);
    }
  };

  window.addEventListener('gifts_database_updated', handleCustomEvent);
  window.addEventListener('storage', handleStorageEvent);
  if (syncBroadcastChannel) {
    syncBroadcastChannel.addEventListener('message', handleBroadcastMessage);
  }

  return () => {
    window.removeEventListener('gifts_database_updated', handleCustomEvent);
    window.removeEventListener('storage', handleStorageEvent);
    if (syncBroadcastChannel) {
      syncBroadcastChannel.removeEventListener('message', handleBroadcastMessage);
    }
  };
}

/**
 * Get current CMS User Role (Default is 'Developer' to give immediate full admin power)
 */
export function getCmsUserRole(): CmsRole {
  if (typeof window === 'undefined') return 'Developer';
  try {
    const saved = localStorage.getItem(ROLE_STORAGE_KEY) as CmsRole;
    if (saved && ['Developer', 'Designer', 'Admin', 'User'].includes(saved)) {
      return saved;
    }
  } catch (e) {
    // fallback
  }
  return 'Developer';
}

/**
 * Set active CMS User Role
 */
export function setCmsUserRole(role: CmsRole): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ROLE_STORAGE_KEY, role);
    window.dispatchEvent(new CustomEvent('cms_role_updated', { detail: role }));
  } catch (e) {
    console.error('Error saving CMS role', e);
  }
}

/**
 * Check if the role is allowed to view/edit CMS tools (Strict Developer-only lock by default)
 */
export function hasCmsPermission(role?: CmsRole | string): boolean {
  if (typeof window !== 'undefined') {
    return canManageGifts();
  }
  const activeRole = role || getCmsUserRole();
  return activeRole === 'Developer';
}

/**
 * Subscribe to CMS Role changes
 */
export function subscribeToCmsRole(callback: (role: CmsRole) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleRoleEvent = (e: Event) => {
    const customEvent = e as CustomEvent<CmsRole>;
    callback(customEvent.detail || getCmsUserRole());
  };

  window.addEventListener('cms_role_updated', handleRoleEvent);
  return () => {
    window.removeEventListener('cms_role_updated', handleRoleEvent);
  };
}

/**
 * Synthesizes & plays high-impact audio effects in browser via Web Audio API or custom audio element
 */
export function playGiftAudioEffect(gift: GiftItem): void {
  if (typeof window === 'undefined') return;
  if (!gift.hasSound) return;

  // 1. If custom audio URL exists, play via HTML5 Audio
  if (gift.soundUrl) {
    try {
      const audio = new Audio(gift.soundUrl);
      audio.volume = gift.soundVolume !== undefined ? gift.soundVolume : 0.8;
      audio.play().catch((err) => {
        console.warn('Audio play failed (maybe blocked by browser policy):', err);
        // Fallback to Web Audio synthesis
        synthesizeAudioPreset(gift.soundPreset || 'fanfare', gift.soundVolume);
      });
      return;
    } catch (e) {
      console.warn('Custom sound failed, using synthesizer', e);
    }
  }

  // 2. Synthesize audio preset using Web Audio API
  synthesizeAudioPreset(gift.soundPreset || 'fanfare', gift.soundVolume);
}

/**
 * Web Audio API procedural sound synthesizer for immediate lag-free sound effects
 */
function synthesizeAudioPreset(preset: string, volume = 0.8): void {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volume * 0.4, ctx.currentTime);
    masterGain.connect(ctx.destination);

    const now = ctx.currentTime;

    switch (preset) {
      case 'lion_roar': {
        // Low rumble frequency with noise
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 1.2);
        gain.gain.setValueAtTime(0.6, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 1.2);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now);
        osc.stop(now + 1.2);
        break;
      }
      case 'jackpot_bells': {
        // Rapid coin bell chimes
        [523.25, 659.25, 783.99, 1046.5, 1318.5, 1567.98].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const t = now + idx * 0.1;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t);
          gain.gain.setValueAtTime(0.5, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(t);
          osc.stop(t + 0.5);
        });
        break;
      }
      case 'magic_sparkle': {
        // Shimmering arpeggios
        [440, 554.37, 659.25, 880, 1108.73, 1318.51, 1760].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const t = now + idx * 0.08;
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, t);
          gain.gain.setValueAtTime(0.4, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(t);
          osc.stop(t + 0.6);
        });
        break;
      }
      case 'supercar': {
        // Accelerating pitch with harmonics
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(80, now);
        osc.frequency.exponentialRampToValueAtTime(520, now + 1.4);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 1.4);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now);
        osc.stop(now + 1.4);
        break;
      }
      case 'laser': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1800, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.4);
        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now);
        osc.stop(now + 0.4);
        break;
      }
      case 'kiss': {
        // Sweet pop sound
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.15);
        gain.gain.setValueAtTime(0.6, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now);
        osc.stop(now + 0.35);
        break;
      }
      case 'boom': {
        // Low sub bass boom
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.8);
        gain.gain.setValueAtTime(0.8, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now);
        osc.stop(now + 0.8);
        break;
      }
      case 'applause': {
        // Burst of celebratory high chords
        [400, 600, 800, 1000].forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(f, now + i * 0.05);
          gain.gain.setValueAtTime(0.3, now + i * 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(now + i * 0.05);
          osc.stop(now + 0.8);
        });
        break;
      }
      case 'fanfare':
      default: {
        // Royal fanfare triad: C5 - E5 - G5 - C6
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const t = now + idx * 0.12;
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, t);
          gain.gain.setValueAtTime(0.5, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.7);
          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(t);
          osc.stop(t + 0.7);
        });
        break;
      }
    }
  } catch (err) {
    console.warn('Audio synthesis error:', err);
  }
}
