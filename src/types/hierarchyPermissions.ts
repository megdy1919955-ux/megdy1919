/**
 * واجهة ونموذج ملخص الأدوار والصلاحيات (Hierarchy Permissions Summary Contract)
 * مطابقة لمواصفات السيرفر المركزي API:
 * GET /api/hierarchy/permissions/:userId
 */

export interface RolesSummary {
  isSuperAdmin: boolean; // المشرف الرئيسي / المالك (أبو أمجد MGR-9901 / 1001001)
  isManager: boolean;    // مديرو الوكالات (المستوى 1)
  isDelegate: boolean;   // مندوبو الوكالات (المستوى 2 - DEL-401)
  isAgent: boolean;      // وكلاء الوكالات الرسمية (المستوى 3 - AG-101)
  isBroker: boolean;     // وسطاء الوكالات المعتمدون (المستوى 4 - BRK-101-1)
  isHost: boolean;       // المذيعون المعتمدون المرتبطون بوكالة (المستوى 5 - HOST-101-01)
}

export interface HierarchyPermissionsResponse {
  userId: string;
  rolesSummary: RolesSummary;
  details?: {
    roleCode?: string;
    roleTitle?: string;
    agencyId?: string;
    delegateId?: string;
    managerId?: string;
    brokerId?: string | null;
  };
}

// الصلاحيات الافتراضية للمستخدم العادي (جميعها مغلقة ومخفية تماماً)
export const DEFAULT_LOCKED_ROLES_SUMMARY: RolesSummary = {
  isSuperAdmin: false,
  isManager: false,
  isDelegate: false,
  isAgent: false,
  isBroker: false,
  isHost: false
};
