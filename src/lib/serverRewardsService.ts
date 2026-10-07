/**
 * خدمة معالجة الهدايا، الألماس، والرواتب المركزية القائمة على السيرفر
 * Server-Driven Gifts, Diamonds, and Broadcaster Performance Service
 * تطبيق النجم (Al-Najm)
 */

import { getApiUrl } from './apiConfig';

export interface UserWalletData {
  userId: string;
  userName?: string;
  coins: number;
  diamonds: number;
  totalDiamondsEarned: number;
  isHost?: boolean;
  updatedAt?: number;
}

export interface HostServerStats {
  userId: string;
  userName?: string;
  diamondsEarned: number;
  exchangeRateDiamondsPerUsd: number; // مثلاً 1000 ماسة = 1 دولار
  earningsUsd: number;
  qualifiedDays: number;
  qualifiedDaysTarget: number; // 15 days as configured by dashboard
  streamHours: number;
  streamHoursTarget: number;
  monthlySalaryTargetUsd: number;
  bestAchievementDiamonds: number;
  hostLevel: string;
  nextLevelTargetUsd: number;
  neededDiamondsForNextLevel: number;
  isLive: boolean;
  updatedAt?: number;
}

export interface MobileMeResponse {
  status: string;
  sourceOfTruth: string;
  hostId: string;
  profile: {
    userId: string;
    name: string;
    avatar: string;
    bio: string;
    gender: string;
    age: number;
    country: string;
    auditStatus: 'approved' | 'pending' | 'rejected';
    pendingName?: string | null;
    pendingAvatar?: string | null;
  };
  wallet: {
    coins: number;
    diamonds: number;
    totalDiamondsEarned: number;
  };
  badges: {
    level: number;
    vipLevel: string;
    showVipBadge: boolean;
    showSupporterBadge: boolean;
    showCharmBadge: boolean;
    vipDesignStyle: string;
    supporterBadgeDesign?: string;
    charmBadgeDesign?: string;
    badgeDecisionByDashboard: boolean;
    supporterLevel?: number;
    charmLevel?: number;
  };
  hostStats: HostServerStats & { isHost: boolean };
  dashboardControls: {
    qualifiedDaysTarget: number;
    exchangeRateDiamondsPerUsd: number;
    streamHoursTarget: number;
    badges: any;
  };
}

export interface GiftSignalParams {
  senderId: string;
  senderName: string;
  recipientId: string;
  recipientName: string;
  giftId: string;
  giftName: string;
  giftValue: number;
  quantity?: number;
  roomId?: string;
}

/**
 * 🌟 1. الحاكم الأوحد لصفحة «أنا»:
 * جلب بيانات المستخدم والمضيف الكاملة حصراً من السيرفر المركزي
 * الرابط: GET /api/hosts/{hostId}/mobile-me
 */
export async function fetchMobileMe(hostId: string): Promise<MobileMeResponse | null> {
  const cleanId = (hostId || '1001001').trim();
  try {
    const res = await fetch(getApiUrl(`/api/hosts/${encodeURIComponent(cleanId)}/mobile-me`));
    if (res.ok) {
      const data: MobileMeResponse = await res.json();
      if (data && data.status === 'success') {
        return data;
      }
    }
  } catch (err) {
    console.warn('Failed to fetch mobile-me from central server:', err);
  }
  return null;
}

/**
 * 🌟 2. الحاكم الأوحد لدعم الرومات:
 * إرسال أي دعم أو هدية فوراً إلى:
 * الرابط: POST /api/hosts/{hostId}/receive-support
 */
export async function sendReceiveSupport(
  hostId: string,
  params: {
    senderId: string;
    senderName: string;
    giftId: string;
    giftName: string;
    giftValue: number;
    quantity?: number;
    roomId?: string;
  }
): Promise<{
  success: boolean;
  recipientDiamonds?: number;
  hostEarningsUsd?: number;
  senderRemainingCoins?: number;
  error?: string;
}> {
  const cleanHostId = (hostId || '1001001').trim();
  try {
    const res = await fetch(getApiUrl(`/api/hosts/${encodeURIComponent(cleanHostId)}/receive-support`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });

    if (res.ok) {
      const data = await res.json();
      if (data.status === 'success') {
        // إشعار التطبيق لحظياً بتحديث الألماس القادم من السيرفر
        window.dispatchEvent(
          new CustomEvent('user_diamonds_updated', {
            detail: {
              userId: cleanHostId,
              diamonds: data.recipientDiamonds
            }
          })
        );

        window.dispatchEvent(
          new CustomEvent('broadcaster_stats_updated', {
            detail: {
              userId: cleanHostId,
              hostStats: {
                diamondsEarned: data.recipientDiamonds,
                earningsUsd: data.hostEarningsUsd,
                qualifiedDaysTarget: data.qualifiedDaysTarget
              }
            }
          })
        );

        return {
          success: true,
          recipientDiamonds: data.recipientDiamonds,
          hostEarningsUsd: data.hostEarningsUsd,
          senderRemainingCoins: data.senderRemainingCoins
        };
      }
    }
  } catch (err: any) {
    console.warn('Failed to execute receive-support on central server:', err);
  }

  return { success: false, error: 'Failed to process support on central server' };
}

/**
 * 🌟 3. طلب تعديل الاسم والصورة مع المراجعة والاعتماد بالداشبورد
 * الرابط: POST /api/users/{userId}/update-profile-request
 */
export async function requestProfileUpdate(
  userId: string,
  update: { name?: string; avatar?: string; bio?: string }
): Promise<{
  success: boolean;
  auditStatus: 'approved' | 'pending' | 'rejected';
  message: string;
  profile?: any;
}> {
  const cleanId = (userId || '1001001').trim();
  try {
    const res = await fetch(getApiUrl(`/api/users/${encodeURIComponent(cleanId)}/update-profile-request`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(update)
    });

    if (res.ok) {
      const data = await res.json();
      if (data.status === 'success') {
        window.dispatchEvent(
          new CustomEvent('profile_update_requested', {
            detail: data
          })
        );
        return {
          success: true,
          auditStatus: data.auditStatus,
          message: data.message,
          profile: data.profile
        };
      }
    }
  } catch (err) {
    console.warn('Failed to send profile update request to server:', err);
  }

  return {
    success: false,
    auditStatus: 'rejected',
    message: 'تعذر الاتصال بالسيرفر المركزي لمراجعة البيانات.'
  };
}

/**
 * التوافقية السابقة: إرسال إشارة الهدية
 */
export async function sendGiftSignalToServer(params: GiftSignalParams): Promise<{
  success: boolean;
  senderCoins?: number;
  recipientDiamonds?: number;
  isHost?: boolean;
  hostStats?: any;
  error?: string;
}> {
  // توجيه تلقائي لنظام receive-support الحاكم
  const supportRes = await sendReceiveSupport(params.recipientId, {
    senderId: params.senderId,
    senderName: params.senderName,
    giftId: params.giftId,
    giftName: params.giftName,
    giftValue: params.giftValue,
    quantity: params.quantity,
    roomId: params.roomId
  });

  return {
    success: supportRes.success,
    senderCoins: supportRes.senderRemainingCoins,
    recipientDiamonds: supportRes.recipientDiamonds,
    hostStats: supportRes.hostEarningsUsd ? { earningsUsd: supportRes.hostEarningsUsd } : undefined
  };
}

/**
 * جلب رصيد الألماس والمحفظة للمستخدم من السيرفر المركزي
 */
export async function fetchUserWallet(userId: string): Promise<UserWalletData | null> {
  const me = await fetchMobileMe(userId);
  if (me && me.wallet) {
    return {
      userId,
      coins: me.wallet.coins,
      diamonds: me.wallet.diamonds,
      totalDiamondsEarned: me.wallet.totalDiamondsEarned
    };
  }
  return null;
}

/**
 * جلب إحصائيات المضيف وساعات البث والراتب المحول بالدولار من السيرفر
 */
export async function fetchBroadcasterServerStats(userId: string): Promise<HostServerStats | null> {
  const me = await fetchMobileMe(userId);
  if (me && me.hostStats) {
    return me.hostStats;
  }
  return null;
}

/**
 * نبضة دورية لجلسة البث في السيرفر
 */
export async function pingBroadcasterStreamSession(
  userId: string,
  isLive: boolean = true,
  durationMinutes: number = 1
): Promise<{ streamHours: number; qualifiedDays: number } | null> {
  if (!userId) return null;
  try {
    const res = await fetch(getApiUrl('/api/broadcaster/stream-session/ping'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, isLive, durationMinutes })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.status === 'success') {
        window.dispatchEvent(
          new CustomEvent('broadcaster_stream_ping', {
            detail: {
              userId,
              streamHours: data.streamHours,
              qualifiedDays: data.qualifiedDays
            }
          })
        );
        return {
          streamHours: data.streamHours,
          qualifiedDays: data.qualifiedDays
        };
      }
    }
  } catch (err) {
    console.warn('Failed to ping stream session to server:', err);
  }
  return null;
}

/**
 * جلب إعدادات وضوابط لوحة التحكم الخارجية وسعر الصرف من السيرفر
 */
export async function fetchDashboardConfig(): Promise<any> {
  try {
    const res = await fetch(getApiUrl('/api/dashboard/config'));
    if (res.ok) {
      const data = await res.json();
      return data.config;
    }
  } catch (err) {
    console.warn('Failed to fetch dashboard config from server:', err);
  }
  return null;
}

/**
 * تحديث إعدادات وضوابط لوحة التحكم الخارجية وسعر الصرف في السيرفر
 */
export async function updateDashboardConfig(config: {
  exchangeRateDiamondsPerUsd?: number;
  qualifiedDaysTarget?: number;
  streamHoursTarget?: number;
  badges?: any;
}): Promise<boolean> {
  try {
    const res = await fetch(getApiUrl('/api/dashboard/config'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });
    if (res.ok) {
      const data = await res.json();
      window.dispatchEvent(new CustomEvent('dashboard_config_updated', { detail: data.config }));
      return true;
    }
  } catch (err) {
    console.warn('Failed to update dashboard config on server:', err);
  }
  return false;
}

export interface AgencyTargetTier {
  id: string;
  levelName: string;
  targetDiamonds: number;
  requiredDays: number;
  requiredHours: number;
  salaryUsd: number;
  agencyCommissionPercent?: number;
  bonusUsd?: number;
  description?: string;
}

/**
 * جلب جدول تارجتات الوكالات والشروط والأيام من السيرفر المركزي
 * GET /api/agency-targets-tiers
 */
export async function fetchAgencyTargetsTiers(): Promise<AgencyTargetTier[]> {
  try {
    const res = await fetch(getApiUrl('/api/agency-targets-tiers'));
    if (res.ok) {
      const data = await res.json();
      return data.tiers || [];
    }
  } catch (err) {
    console.warn('Failed to fetch agency targets tiers:', err);
  }
  return [];
}

/**
 * تحديث جدول تارجتات الوكالات والشروط والأيام في السيرفر المركزي
 * POST /api/agency-targets-tiers
 */
export async function updateAgencyTargetsTiers(
  tiers: AgencyTargetTier[],
  globalSettings?: { defaultDaysTarget?: number; defaultHoursTarget?: number; exchangeRateDiamondsPerUsd?: number }
): Promise<boolean> {
  try {
    const res = await fetch(getApiUrl('/api/agency-targets-tiers'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tiers, ...(globalSettings || {}) })
    });
    if (res.ok) {
      const data = await res.json();
      window.dispatchEvent(new CustomEvent('agency_targets_tiers_updated', { detail: data.tiers }));
      return true;
    }
  } catch (err) {
    console.warn('Failed to update agency targets tiers on server:', err);
  }
  return false;
}

