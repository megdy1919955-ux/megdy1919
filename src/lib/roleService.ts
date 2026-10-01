/**
 * خدمة إدارة الأدوار والصلاحيات الفورية وحماية الأمان (Unified App & Room Role Service)
 * نظام أمني شامل لقفل واجهات التحكم وتعديلات الهدايا وحصرها بـ (المبرمج) مع نظام تخويل مرن
 */

export type AppRole = 'developer' | 'owner' | 'moderator' | 'guest';

export interface RoleInfo {
  id: AppRole;
  title: string;
  subtitle: string;
  badge: string;
  icon: string;
  color: string;
  bgGradient: string;
  borderColor: string;
  permissions: string[];
}

export const APP_ROLES: RoleInfo[] = [
  {
    id: 'developer',
    title: 'المبرمج (Developer)',
    subtitle: 'صلاحيات المطور الكاملة (Root) - التحكم بالمنظومة والخصائص والجذور',
    badge: 'ROOT / DEV 💻',
    icon: '💻',
    color: 'text-cyan-300',
    bgGradient: 'from-cyan-950/90 via-blue-950/80 to-slate-950/90',
    borderColor: 'border-cyan-400/60',
    permissions: [
      'تعديل وإدارة كافة الهدايا في CMS Studio',
      'التحكم الكامل بشريط أسفل الشاشة والإيموجي',
      'تخويل وسحب الصلاحيات من باقي الأدوار',
      'لوحة المطورين Dev Panel وفحص السيرفر'
    ]
  },
  {
    id: 'owner',
    title: 'مالك الروم (Room Owner)',
    subtitle: 'السيادة الكاملة على الغرفة، وتخويل وإلغاء صلاحيات المشرفين وحظر الأعضاء',
    badge: 'ROOM OWNER 👑',
    icon: '👑',
    color: 'text-amber-300',
    bgGradient: 'from-amber-950/90 via-yellow-950/80 to-slate-950/90',
    borderColor: 'border-amber-400/60',
    permissions: [
      'منح وسحب صلاحيات المشرفين (الطرد، المايكات، الموسيقى)',
      'التحكم بعدد وتوزيع المايكات وقفل الغرفة',
      'طرد المخالفين وإلغاء الطرد من قائمة المحظورين',
      'تشغيل وإيقاف عداد الجولات والمسابقات'
    ]
  },
  {
    id: 'moderator',
    title: 'مشرف في الروم (Moderator)',
    subtitle: 'صلاحيات المشرف تُمنح وتُدار حصراً من صاحب الروم فقط',
    badge: 'ADMIN 🛡️',
    icon: '🛡️',
    color: 'text-purple-300',
    bgGradient: 'from-purple-950/90 via-indigo-950/80 to-slate-950/90',
    borderColor: 'border-purple-400/60',
    permissions: [
      'صلاحية طرد المخالفين (فقط إذا منحها مالك الروم)',
      'قبول ورفض طلبات الصعود للمايك',
      'كتم الميكروفون عن المستخدمين المخالفين',
      'مساعدة مالك الروم في ضبط النظام والهدوء'
    ]
  },
  {
    id: 'guest',
    title: 'مستخدم عادي (Regular User)',
    subtitle: 'تجربة المستخدم العادي للمشاهدة والاستماع وإرسال الهدايا والمشاركة',
    badge: 'USER 👤',
    icon: '👤',
    color: 'text-slate-300',
    bgGradient: 'from-slate-900/90 via-gray-900/80 to-slate-950/90',
    borderColor: 'border-slate-600/50',
    permissions: [
      'طلب الصعود للمايك عبر طابور الانتظار',
      'إرسال الهدايا للمايكات والحضور',
      'الاستماع والمشاركة في الدردشة العامة'
    ]
  }
];

const ACTIVE_ROLE_STORAGE_KEY = 'super_legend_active_app_role';
const BOTTOM_BAR_AUTH_STORAGE_KEY = 'super_legend_auth_bottom_bar_roles';
const GIFT_CMS_AUTH_STORAGE_KEY = 'super_legend_auth_gift_cms_roles';

/**
 * الحصول على الدور النشط حالياً
 */
export function getActiveAppRole(): AppRole {
  if (typeof window === 'undefined') return 'developer';
  try {
    const saved = localStorage.getItem(ACTIVE_ROLE_STORAGE_KEY) as AppRole;
    if (saved && APP_ROLES.some((r) => r.id === saved)) {
      return saved;
    }
  } catch (e) {
    // fallback
  }
  return 'developer'; // الافتراضي هو المبرمج لاختبار كافة الصلاحيات
}

/**
 * تعيين الدور النشط مع البث لجميع المكونات
 */
export function setActiveAppRole(role: AppRole): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ACTIVE_ROLE_STORAGE_KEY, role);
    
    // مزامنة دور الـ CMS القديم
    const cmsMap: Record<AppRole, string> = {
      developer: 'Developer',
      owner: 'Developer',
      moderator: 'Admin',
      guest: 'User'
    };
    localStorage.setItem('super_legend_cms_active_role', cmsMap[role] || 'Developer');

    window.dispatchEvent(
      new CustomEvent('app_role_changed', {
        detail: {
          role,
          roleInfo: APP_ROLES.find((r) => r.id === role)
        }
      })
    );
  } catch (e) {
    console.error('Error setting app role:', e);
  }
}

/**
 * التحقق هل المستخدم الحالي هو المبرمج
 */
export function isDeveloper(role?: AppRole | string): boolean {
  const current = role || getActiveAppRole();
  return current === 'developer';
}

/**
 * الحصول على الأدوار المخولة برؤية شريط أسفل الشاشة (الإيموجي والتحكم)
 * الافتراضي: المبرمج فقط ['developer']
 */
export function getAuthorizedRolesForBottomBar(): AppRole[] {
  if (typeof window === 'undefined') return ['developer'];
  try {
    const saved = localStorage.getItem(BOTTOM_BAR_AUTH_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // نضمن دائماً وجود المبرمج
        return Array.from(new Set(['developer', ...parsed]));
      }
    }
  } catch (e) {
    // fallback
  }
  return ['developer']; // حصرياً للمبرمج افتراضياً
}

/**
 * الحصول على الأدوار المخولة بإدارة وتعديل الهدايا (Gift CMS)
 * الافتراضي: المبرمج فقط ['developer']
 */
export function getAuthorizedRolesForGiftCms(): AppRole[] {
  if (typeof window === 'undefined') return ['developer'];
  try {
    const saved = localStorage.getItem(GIFT_CMS_AUTH_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // نضمن دائماً وجود المبرمج
        return Array.from(new Set(['developer', ...parsed]));
      }
    }
  } catch (e) {
    // fallback
  }
  return ['developer']; // حصرياً للمبرمج افتراضياً
}

/**
 * التحقق هل الدور الحالي مخول برؤية واستخدام شريط أسفل الشاشة (الإيموجي والتحكم)
 * متاح دائماً لجميع المستخدمين كحق أساسي
 */
export function canAccessBottomControlBar(role?: AppRole): boolean {
  return true;
}

/**
 * التحقق هل الدور الحالي مخول بتعديل وإدارة الهدايا
 */
export function canManageGifts(role?: AppRole): boolean {
  const current = role || getActiveAppRole();
  if (current === 'developer') return true;
  const authorized = getAuthorizedRolesForGiftCms();
  return authorized.includes(current);
}

/**
 * تخويل دور معين لميزة محددة (Bottom Bar أو Gift CMS)
 */
export function grantRolePermission(feature: 'bottom_bar' | 'gift_cms', targetRole: AppRole): void {
  if (typeof window === 'undefined') return;
  try {
    if (feature === 'bottom_bar') {
      const current = getAuthorizedRolesForBottomBar();
      const updated = Array.from(new Set([...current, targetRole]));
      localStorage.setItem(BOTTOM_BAR_AUTH_STORAGE_KEY, JSON.stringify(updated));
    } else {
      const current = getAuthorizedRolesForGiftCms();
      const updated = Array.from(new Set([...current, targetRole]));
      localStorage.setItem(GIFT_CMS_AUTH_STORAGE_KEY, JSON.stringify(updated));
    }
    window.dispatchEvent(new CustomEvent('app_permissions_updated', { detail: { feature, targetRole, action: 'grant' } }));
  } catch (e) {
    console.error('Error granting permission:', e);
  }
}

/**
 * سحب تخويل دور معين لميزة محددة
 */
export function revokeRolePermission(feature: 'bottom_bar' | 'gift_cms', targetRole: AppRole): void {
  if (typeof window === 'undefined' || targetRole === 'developer') return; // لا يمكن سحب صلاحية المبرمج
  try {
    if (feature === 'bottom_bar') {
      const current = getAuthorizedRolesForBottomBar();
      const updated = current.filter((r) => r !== targetRole);
      localStorage.setItem(BOTTOM_BAR_AUTH_STORAGE_KEY, JSON.stringify(updated));
    } else {
      const current = getAuthorizedRolesForGiftCms();
      const updated = current.filter((r) => r !== targetRole);
      localStorage.setItem(GIFT_CMS_AUTH_STORAGE_KEY, JSON.stringify(updated));
    }
    window.dispatchEvent(new CustomEvent('app_permissions_updated', { detail: { feature, targetRole, action: 'revoke' } }));
  } catch (e) {
    console.error('Error revoking permission:', e);
  }
}
