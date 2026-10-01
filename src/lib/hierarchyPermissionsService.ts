import { RolesSummary, HierarchyPermissionsResponse, DEFAULT_LOCKED_ROLES_SUMMARY } from '../types/hierarchyPermissions';

/**
 * خدمة جلب صلاحيات الهيكل الإداري من السيرفر المركزي
 * Endpoint: GET /api/hierarchy/permissions/:userId
 */
export async function fetchHierarchyPermissions(userId: string): Promise<RolesSummary> {
  if (!userId || !userId.trim()) {
    return DEFAULT_LOCKED_ROLES_SUMMARY;
  }

  const cleanId = userId.trim();

  try {
    const res = await fetch(`/api/hierarchy/permissions/${encodeURIComponent(cleanId)}`);
    if (res.ok) {
      const data: HierarchyPermissionsResponse = await res.json();
      if (data && data.rolesSummary) {
        return data.rolesSummary;
      }
    }
  } catch (error) {
    console.warn('[HierarchyPermissions] Central server request error:', error);
  }

  // في حال تعذر الوصول اللحظي للشبكة، الاعتماد على القفل التام للحماية
  return DEFAULT_LOCKED_ROLES_SUMMARY;
}
