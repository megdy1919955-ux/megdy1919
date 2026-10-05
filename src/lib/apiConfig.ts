/**
 * إعدادات وتكوين السيرفر المركزي ولوحة التحكم الخارجية
 * Central API & External Dashboard Configuration
 */

export const CENTRAL_SERVER_BASE_URL = 'https://ais-pre-yydiy2t46my4qfhvewinjh-733635939731.europe-west2.run.app';
export const EXTERNAL_DASHBOARD_URL = 'https://ais-pre-yydiy2t46my4qfhvewinjh-733635939731.europe-west2.run.app/admin/';

/**
 * الحصول على الرابط المعتمد لاستدعاء الـ API
 * يضمن العمل في متصفح الويب، محاكي الجوال، وتطبيق أندرويد (Capacitor)
 */
export function getApiUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  // في تطبيق الأندرويد/الجوال الأصلي (Capacitor أو بيئة غير مستضافة على السيرفر نفسه)
  if (
    typeof window !== 'undefined' &&
    (window.location.protocol === 'capacitor:' ||
     window.location.protocol === 'file:' ||
     window.location.hostname === 'localhost' && window.location.port !== '3000')
  ) {
    return `${CENTRAL_SERVER_BASE_URL}${cleanPath}`;
  }

  // في بيئة الويب المباشرة مع البروكسي المحلي أو النسبي
  return cleanPath;
}

/**
 * فحص الاتصال الحي المباشر بالخادم المركزي ولوحة التحكم
 */
export async function checkCentralServerConnection(): Promise<{
  connected: boolean;
  status: string;
  baseUrl: string;
  dashboardUrl: string;
  details?: any;
}> {
  try {
    const res = await fetch(getApiUrl('/api/health'));
    if (res.ok) {
      const data = await res.json();
      return {
        connected: true,
        status: data.status || 'online',
        baseUrl: CENTRAL_SERVER_BASE_URL,
        dashboardUrl: EXTERNAL_DASHBOARD_URL,
        details: data
      };
    }
  } catch (err: any) {
    console.warn('Central server ping warning:', err);
  }
  return {
    connected: false,
    status: 'offline',
    baseUrl: CENTRAL_SERVER_BASE_URL,
    dashboardUrl: EXTERNAL_DASHBOARD_URL
  };
}
