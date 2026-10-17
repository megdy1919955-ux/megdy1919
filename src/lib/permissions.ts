/**
 * ═══════════════════════════════════════════════════════════
 * 🎯 نظام الصلاحيات الموحّد — Al-Najm (النجم)
 * ═══════════════════════════════════════════════════════════
 * 
 * يحدد:
 * 1. الأدوار (6 أدوار)
 * 2. الصلاحيات لكل دور (10 صلاحيات)
 * 3. نطاق الرؤية (View Scope)
 * 4. التسلسل الهرمي (من يستدعي من)
 * 5. دوال مساعدة للفحص السريع
 * 
 * @version 1.0.0
 * @date 2026-01-06
 * @author Al-Najm Team
 */

// ═══════════════════════════════════════════════════════════
// 1️⃣ الأدوار (Roles)
// ═══════════════════════════════════════════════════════════

export type Role =
  | 'manager'       // 👑 مدير الوكالات (MGR-9901)
  | 'delegate'      // 👔 مندوب (DEL-401)
  | 'agency_owner'  // 🏢 وكالة (AG-101)
  | 'broker'        // 🤝 وسيط (BRK-101-01)
  | 'host'          // 🎙️ مضيف (HOST-101-01)
  | 'user';         // 👤 مستخدم عادي

export const ROLES: Record<Role, { label: string; labelAr: string; icon: string }> = {
  manager:      { label: 'Manager',       labelAr: 'مدير الوكالات',  icon: '👑' },
  delegate:     { label: 'Delegate',      labelAr: 'مندوب',           icon: '👔' },
  agency_owner: { label: 'Agency Owner',  labelAr: 'وكالة',           icon: '🏢' },
  broker:       { label: 'Broker',        labelAr: 'وسيط',            icon: '🤝' },
  host:         { label: 'Host',          labelAr: 'مضيف',            icon: '🎙️' },
  user:         { label: 'User',          labelAr: 'مستخدم',          icon: '👤' },
};

// ═══════════════════════════════════════════════════════════
// 2️⃣ نطاق الرؤية (View Scope)
// ═══════════════════════════════════════════════════════════

export type ViewScope =
  | 'all'           // يرى كل شيء (manager)
  | 'own_agencies'  // يرى وكالاته فقط (delegate)
  | 'own_agency'    // يرى وكالته فقط (agency_owner)
  | 'own_hosts'     // يرى مضيفيه فقط (broker)
  | 'self';         // يرى نفسه فقط (host/user)

// ═══════════════════════════════════════════════════════════
// 3️⃣ واجهة الصلاحيات (Permission Set)
// ═══════════════════════════════════════════════════════════

export interface PermissionSet {
  // ── الدعوات (Invitations) ──
  canInviteDelegates: boolean;   // استدعاء مندوبين
  canInviteAgencies: boolean;    // استدعاء وكالات
  canInviteBrokers: boolean;     // استدعاء وسطاء
  canInviteHosts: boolean;       // استدعاء مضيفين

  // ── الإجراءات (Actions) ──
  canUnban: boolean;             // فك الحظر
  canApproveRequests: boolean;   // اعتماد الطلبات
  canOpenMonthlyTarget: boolean; // فتح التارجت الشهري
  canEditCommissions: boolean;   // تعديل العمولات
  canAssignBrokers: boolean;     // تعيين وسطاء

  // ── النطاق (Scope) ──
  viewScope: ViewScope;
}

// ═══════════════════════════════════════════════════════════
// 4️⃣ جدول الصلاحيات (Permissions Matrix)
// ═══════════════════════════════════════════════════════════

export const PERMISSIONS: Record<Role, PermissionSet> = {
  // 👑 مدير الوكالات — كل الصلاحيات
  manager: {
    canInviteDelegates: true,
    canInviteAgencies: true,
    canInviteBrokers: true,
    canInviteHosts: true,
    canUnban: true,
    canApproveRequests: true,
    canOpenMonthlyTarget: true,
    canEditCommissions: true,
    canAssignBrokers: true,
    viewScope: 'all',
  },

  // 👔 مندوب — يستدعي وكالات فقط
  delegate: {
    canInviteDelegates: false,
    canInviteAgencies: true,
    canInviteBrokers: false,
    canInviteHosts: false,
    canUnban: false,
    canApproveRequests: false,
    canOpenMonthlyTarget: false,
    canEditCommissions: false,
    canAssignBrokers: false,
    viewScope: 'own_agencies',
  },

  // 🏢 وكالة — يستدعي وسطاء ومضيفين
  agency_owner: {
    canInviteDelegates: false,
    canInviteAgencies: false,
    canInviteBrokers: true,
    canInviteHosts: true,
    canUnban: false,
    canApproveRequests: true,
    canOpenMonthlyTarget: true,
    canEditCommissions: true,
    canAssignBrokers: true,
    viewScope: 'own_agency',
  },

  // 🤝 وسيط — يستدعي مضيفين فقط
  broker: {
    canInviteDelegates: false,
    canInviteAgencies: false,
    canInviteBrokers: false,
    canInviteHosts: true,
    canUnban: false,
    canApproveRequests: false,
    canOpenMonthlyTarget: false,
    canEditCommissions: false,
    canAssignBrokers: false,
    viewScope: 'own_hosts',
  },

  // 🎙️ مضيف — لا يستدعي أحداً
  host: {
    canInviteDelegates: false,
    canInviteAgencies: false,
    canInviteBrokers: false,
    canInviteHosts: false,
    canUnban: false,
    canApproveRequests: false,
    canOpenMonthlyTarget: false,
    canEditCommissions: false,
    canAssignBrokers: false,
    viewScope: 'self',
  },

  // 👤 مستخدم — لا صلاحيات
  user: {
    canInviteDelegates: false,
    canInviteAgencies: false,
    canInviteBrokers: false,
    canInviteHosts: false,
    canUnban: false,
    canApproveRequests: false,
    canOpenMonthlyTarget: false,
    canEditCommissions: false,
    canAssignBrokers: false,
    viewScope: 'self',
  },
};

// ═══════════════════════════════════════════════════════════
// 5️⃣ التسلسل الهرمي (Hierarchy)
// ═══════════════════════════════════════════════════════════
// من يستطيع استدعاء من؟

export const HIERARCHY: Record<Role, Role[]> = {
  manager:      ['delegate', 'agency_owner', 'broker', 'host'],
  delegate:     ['agency_owner'],
  agency_owner: ['broker', 'host'],
  broker:       ['host'],
  host:         [],
  user:         [],
};

// ═══════════════════════════════════════════════════════════
// 6️⃣ دوال مساعدة (Helpers)
// ═══════════════════════════════════════════════════════════

/**
 * الحصول على صلاحيات دور معيّن
 */
export function getPermissions(role: Role | string | null | undefined): PermissionSet {
  if (!role || !(role in PERMISSIONS)) {
    return PERMISSIONS.user;
  }
  return PERMISSIONS[role as Role];
}

/**
 * فحص صلاحية محددة لدور
 * @example can('manager', 'canUnban') → true
 */
export function can(
  role: Role | string | null | undefined,
  action: keyof PermissionSet
): boolean {
  const perms = getPermissions(role);
  const value = perms[action];
  return typeof value === 'boolean' ? value : false;
}

/**
 * الحصول على نطاق رؤية الدور
 */
export function getViewScope(role: Role | string | null | undefined): ViewScope {
  return getPermissions(role).viewScope;
}

/**
 * فحص: هل يمكن للدور X استدعاء الدور Y؟
 * @example canInvite('agency_owner', 'host') → true
 */
export function canInvite(
  inviterRole: Role | string | null | undefined,
  targetRole: Role
): boolean {
  if (!inviterRole) return false;
  const allowed = HIERARCHY[inviterRole as Role] || [];
  return allowed.includes(targetRole);
}

/**
 * فحص: هل الدور X أعلى من الدور Y في التسلسل؟
 */
export function isHigherThan(
  role1: Role | string | null | undefined,
  role2: Role
): boolean {
  if (!role1) return false;
  return canInvite(role1, role2);
}

/**
 * الحصول على كل الأدوار التي يستطيع الدور استدعاءها
 */
export function getInvitableRoles(role: Role | string | null | undefined): Role[] {
  if (!role) return [];
  return HIERARCHY[role as Role] || [];
}

/**
 * فحص: هل الدور إداري؟
 */
export function isAdminRole(role: Role | string | null | undefined): boolean {
  return role === 'manager' || role === 'delegate' || role === 'agency_owner';
}

/**
 * فحص: هل الدور مالي (يستطيع رؤية الأرباح والعمولات)؟
 */
export function isFinancialRole(role: Role | string | null | undefined): boolean {
  return role === 'manager' || role === 'delegate' || role === 'agency_owner' || role === 'broker';
}

/**
 * فحص: هل الدور مُضيف أو أعلى (لاستخدام شاشات المضيف)؟
 */
export function isHostOrHigher(role: Role | string | null | undefined): boolean {
  if (!role) return false;
  return ['manager', 'delegate', 'agency_owner', 'broker', 'host'].includes(role);
}

// ═══════════════════════════════════════════════════════════
// 7️⃣ دوال الفلترة (Filtering)
// ═══════════════════════════════════════════════════════════

export interface UserContext {
  uid: string;
  role: Role;
  primaryId?: string;    // MGR-9901, DEL-401, AG-101, BRK-101-01, HOST-101-01
  subId?: string;
  parentId?: string;     // ID الأب في الهرمية
  agencyId?: string;
  brokerId?: string;
  delegateId?: string;
}

/**
 * الحصول على شروط الاستعلام حسب نطاق الرؤية
 */
export function getQueryFilters(user: UserContext): Record<string, string | undefined> {
  const scope = getViewScope(user.role);

  switch (scope) {
    case 'all':
      return {}; // لا فلتر

    case 'own_agencies':
      return { delegateId: user.primaryId };

    case 'own_agency':
      return { agencyId: user.primaryId || user.agencyId };

    case 'own_hosts':
      return { brokerId: user.primaryId };

    case 'self':
    default:
      return { uid: user.uid };
  }
}

/**
 * فحص: هل يمكن للمستخدم رؤية مستخدم آخر؟
 */
export function canViewUser(
  viewer: UserContext,
  target: { uid: string; agencyId?: string; brokerId?: string; delegateId?: string }
): boolean {
  const scope = getViewScope(viewer.role);

  switch (scope) {
    case 'all':
      return true;

    case 'own_agencies':
      return target.delegateId === viewer.primaryId;

    case 'own_agency':
      return target.agencyId === (viewer.primaryId || viewer.agencyId);

    case 'own_hosts':
      return target.brokerId === viewer.primaryId;

    case 'self':
    default:
      return viewer.uid === target.uid;
  }
}

// ═══════════════════════════════════════════════════════════
// 8️⃣ Constants للاستخدام السريع
// ═══════════════════════════════════════════════════════════

export const ALL_ROLES: Role[] = ['manager', 'delegate', 'agency_owner', 'broker', 'host', 'user'];

export const INVITABLE_BY_MANAGER: Role[] = ['delegate', 'agency_owner', 'broker', 'host'];
export const INVITABLE_BY_DELEGATE: Role[] = ['agency_owner'];
export const INVITABLE_BY_AGENCY: Role[] = ['broker', 'host'];
export const INVITABLE_BY_BROKER: Role[] = ['host'];

export const DEFAULT_ROLE: Role = 'user';

// ═══════════════════════════════════════════════════════════
// 9️⃣ Validation (فحص صحة البيانات)
// ═══════════════════════════════════════════════════════════

/**
 * فحص: هل القيمة دور صالح؟
 */
export function isValidRole(value: unknown): value is Role {
  return typeof value === 'string' && ALL_ROLES.includes(value as Role);
}

/**
 * تحويل آمن لدور
 */
export function toRole(value: unknown): Role {
  return isValidRole(value) ? value : DEFAULT_ROLE;
}

// ═══════════════════════════════════════════════════════════
// 🔟 توليد الرموز الهرمية آلياً (Automatic Code Generation)
// ═══════════════════════════════════════════════════════════
export {
  generateDelegateCode,
  generateAgencyCode,
  generateBrokerCode,
  generateHostCode,
} from './hierarchyService';

// ═══════════════════════════════════════════════════════════
// 1️⃣1️⃣ Export Default
// ═══════════════════════════════════════════════════════════

export default {
  PERMISSIONS,
  HIERARCHY,
  ROLES,
  ALL_ROLES,
  getPermissions,
  can,
  getViewScope,
  canInvite,
  isHigherThan,
  getInvitableRoles,
  isAdminRole,
  isFinancialRole,
  isHostOrHigher,
  getQueryFilters,
  canViewUser,
  isValidRole,
  toRole,
};

