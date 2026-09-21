/**
 * خدمة إدارة هدية رفع خلفية مخصصة من الجوال الممنوحة من الإدارة
 * تمنحها الإدارة بصلاحية محددة البداية والنهاية، وتلغى الخلفية عند انتهاء المدة
 */

export interface CustomWallpaperGiftGrant {
  isGranted: boolean;
  grantedAt: string; // ISO String
  expiresAt: string; // ISO String
  durationDays: number;
  grantedBy: string;
  grantId: string;
}

const STORAGE_KEY = 'admin_custom_wallpaper_gift_grant';
export const DEFAULT_ROOM_WALLPAPER_URL = 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=800';

/**
 * جلب بيانات الهدية الإدارية الحالية مع التحقق التلقائي من الصلاحية
 */
export function getCustomWallpaperGiftGrant(): CustomWallpaperGiftGrant | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const grant = JSON.parse(raw) as CustomWallpaperGiftGrant;
    if (!grant || !grant.isGranted) return null;

    // فحص تاريخ الانتهاء
    const now = new Date().getTime();
    const expiry = new Date(grant.expiresAt).getTime();

    if (now >= expiry) {
      // انتهت الصلاحية تلقائياً
      revokeCustomWallpaperGift();
      return null;
    }

    return grant;
  } catch (e) {
    console.warn('Failed to load custom wallpaper gift grant', e);
    return null;
  }
}

/**
 * التحقق مما إذا كانت هدية رفع الخلفية نشطة وسارية المفعول
 */
export function isCustomWallpaperGrantActive(): boolean {
  const grant = getCustomWallpaperGiftGrant();
  return grant !== null && grant.isGranted;
}

/**
 * حساب الوقت المتبقي لهدية الإدارة بتنسيق مفهوم
 */
export function getGrantRemainingTime(grant: CustomWallpaperGiftGrant | null): {
  days: number;
  hours: number;
  isExpired: boolean;
  formattedExpiresAt: string;
  formattedGrantedAt: string;
} {
  if (!grant || !grant.isGranted) {
    return {
      days: 0,
      hours: 0,
      isExpired: true,
      formattedExpiresAt: '',
      formattedGrantedAt: ''
    };
  }

  const now = new Date().getTime();
  const expiry = new Date(grant.expiresAt).getTime();
  const diffMs = expiry - now;

  if (diffMs <= 0) {
    return {
      days: 0,
      hours: 0,
      isExpired: true,
      formattedExpiresAt: new Date(grant.expiresAt).toLocaleDateString('ar-EG'),
      formattedGrantedAt: new Date(grant.grantedAt).toLocaleDateString('ar-EG')
    };
  }

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  return {
    days,
    hours,
    isExpired: false,
    formattedExpiresAt: new Date(grant.expiresAt).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }),
    formattedGrantedAt: new Date(grant.grantedAt).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  };
}

/**
 * منح الهدية من الإدارة لفترة محددة (بالأيام)
 */
export function grantCustomWallpaperGift(durationDays: number = 7, grantedBy: string = 'إدارة التطبيق'): CustomWallpaperGiftGrant {
  const now = new Date();
  const expiryDate = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);

  const grant: CustomWallpaperGiftGrant = {
    isGranted: true,
    grantedAt: now.toISOString(),
    expiresAt: expiryDate.toISOString(),
    durationDays,
    grantedBy,
    grantId: `grant-${Date.now()}`
  };

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(grant));
    } catch (e) {}
  }

  return grant;
}

/**
 * إلغاء هدية الخلفية وحذف الخلفيات المخصصة عند انتهاء المدة
 */
export function revokeCustomWallpaperGift(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    // إزالة الخلفيات المخصصة المحفوظة
    localStorage.removeItem('najm_custom_user_wallpapers');
    localStorage.removeItem('yoho_custom_user_wallpapers');
  } catch (e) {}
}
