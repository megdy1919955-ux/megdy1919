/**
 * ═══════════════════════════════════════════════════════════
 * 👑 VIP Subscription & Expiration Service — Al-Najm (النجم)
 * ═══════════════════════════════════════════════════════════
 * Handles:
 * 1. Temporary VIP by date with duration (2, 5, 7, 10 days, etc.)
 * 2. Permanent VIP for Owner/SuperAdmin (VIP10 permanent)
 * 3. Fallback to previousVipLevel upon expiration
 * 4. Helper formatting and calculations
 */

export interface VipData {
  vipTier?: string;          // e.g. 'VIP10', 'VIP7', 'VIP1'
  vipLevel?: string;         // e.g. 'VIP10'
  previousVipLevel?: string; // e.g. 'VIP0'
  vipActivatedAt?: string | null;
  vipExpiresAt?: string | number | null;
  vipDurationDays?: number;
  vipSource?: 'owner' | 'recharge' | 'gift' | 'admin' | 'subscription';
  isVipPermanent?: boolean;
}

export function getCurrentVip(user: any): string {
  if (!user) return 'VIP0';

  // 1. المالك = دائم
  if (
    user.isOwner === true ||
    user.isVipPermanent === true ||
    user.role === 'owner' ||
    user.role === 'super_admin' ||
    user.uid === '0OW7yfypGLgOgwbBHOVtpV8FJ3A3' ||
    user.id === '1001001' ||
    user.userId === '1001001'
  ) {
    return user.vipTier || user.vipLevel || 'VIP10';
  }

  // 2. فحص الانتهاء
  const now = new Date();
  const rawExpires = user.vipExpiresAt;
  const expiresAt = rawExpires?.toDate?.() || (rawExpires ? new Date(rawExpires) : null);

  if (expiresAt && now > expiresAt) {
    // ⚠️ VIP منتهي → يرجع للمستوى السابق
    return user.previousVipLevel || 'VIP0';
  }

  // 3. VIP نشط
  return user.vipTier || user.vipLevel || 'VIP0';
}

export function isVipExpired(user: any): boolean {
  if (!user) return true;
  if (
    user.isOwner === true ||
    user.isVipPermanent === true ||
    user.role === 'owner' ||
    user.role === 'super_admin' ||
    user.uid === '0OW7yfypGLgOgwbBHOVtpV8FJ3A3' ||
    user.id === '1001001' ||
    user.userId === '1001001'
  ) {
    return false;
  }

  const now = new Date();
  const rawExpires = user.vipExpiresAt;
  const expiresAt = rawExpires?.toDate?.() || (rawExpires ? new Date(rawExpires) : null);

  return expiresAt ? now > expiresAt : true;
}

export function getVipRemainingDays(user: any): number {
  if (!user) return 0;
  if (user.isOwner || user.isVipPermanent) return 999;

  const now = new Date();
  const rawExpires = user.vipExpiresAt;
  const expiresAt = rawExpires?.toDate?.() || (rawExpires ? new Date(rawExpires) : null);
  if (!expiresAt) return 0;

  const diffMs = expiresAt.getTime() - now.getTime();
  if (diffMs <= 0) return 0;
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export function formatVipExpirationText(user: any): string {
  if (!user) return 'غير مفعل';
  if (user.isOwner || user.isVipPermanent) return 'عضوية دائمة 👑';

  const now = new Date();
  const rawExpires = user.vipExpiresAt;
  const expiresAt = rawExpires?.toDate?.() || (rawExpires ? new Date(rawExpires) : null);
  if (!expiresAt) return 'غير مفعل';

  if (now > expiresAt) {
    return 'منتهية الصلاحية';
  }

  const remainingDays = getVipRemainingDays(user);
  return `متبقي ${remainingDays} يوم (حتى ${expiresAt.toLocaleDateString('ar-EG')})`;
}
