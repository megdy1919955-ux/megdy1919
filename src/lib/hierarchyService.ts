/**
 * خريطة الهندسة المعمارية لتوزيع الآيديات والتسلسل الهرمي (Architecture Hierarchy & ID Mapping System)
 * المعرف الأساسي الموحد (Primary User ID) يبدأ من #1001001
 * الكود الوظيفي الصلاحياتي (Role Code) المتوارث هرمياً
 */

export interface RolesSummary {
  isManager: boolean;
  isSuperAdmin: boolean;
  isDelegate: boolean;
  isAgent: boolean;
  isRechargeAgent: boolean;
  isBroker: boolean;
  isHost: boolean;
  isThemeAdmin: boolean;
}

export const DEFAULT_ROLES_SUMMARY: RolesSummary = {
  isManager: false,
  isSuperAdmin: false,
  isDelegate: false,
  isAgent: false,
  isRechargeAgent: false,
  isBroker: false,
  isHost: false,
  isThemeAdmin: false
};

export interface HierarchyEntity {
  userId: string;          // المعرف الأساسي الموحد (مثلاً 1001001)
  name: string;            // الاسم
  roleCode: string;        // الكود الوظيفي الصلاحياتي (MGR-9901, DEL-401, AG-101, BRK-101-01, HOST-101-01)
  roleTitle: string;       // المسمى الوظيفي
  level: 1 | 2 | 3 | 4 | 5; // المستوى الهرمي
  avatar?: string;
  agency?: string;
  parentUserId?: string;   // معرف الأب المباشر
  parentRoleCode?: string; // كود الأب الصلاحياتي
  parentDelegate?: string; // كود المندوب المشرف
  parentAgency?: string;   // كود الوكالة المشرفة
  parentManager?: string;  // كود مدير الإدارة الأعلى
}

// المستوى 1: سوبر أدمن / مدير الإدارة
export const LEVEL_1_MANAGERS: HierarchyEntity[] = [
  {
    userId: '1001001',
    name: 'أبو أمجد (الملك سلطان الفاتح)',
    roleCode: 'MGR-9901',
    roleTitle: 'سوبر أدمن / مدير الإدارة',
    agency: 'الإدارة العامة العليا',
    level: 1,
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=400'
  },
  {
    userId: '1001002',
    name: 'فهد الكعبي',
    roleCode: 'MGR-9902',
    roleTitle: 'نائب المدير العام',
    agency: 'الإدارة العامة العليا',
    level: 1,
    parentUserId: '1001001',
    parentRoleCode: 'MGR-9901',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
  }
];

// المستوى 2: مندوب الوكالات المعتمد
export const LEVEL_2_DELEGATES: HierarchyEntity[] = [
  {
    userId: 'DEL-401',
    name: 'تركي بن خالد',
    roleCode: 'DEL-401',
    roleTitle: 'مندوب الوكالات المعتمد',
    agency: 'المشرف على وكالة النخبة AG-101',
    level: 2,
    parentUserId: '1001001',
    parentRoleCode: 'MGR-9901',
    parentManager: 'MGR-9901',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  },
  {
    userId: '1001004',
    name: 'تركي بن خالد',
    roleCode: 'DEL-401',
    roleTitle: 'مندوب الوكالات المعتمد',
    agency: 'المشرف على وكالة النخبة AG-101',
    level: 2,
    parentUserId: '1001001',
    parentRoleCode: 'MGR-9901',
    parentManager: 'MGR-9901',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  },
  {
    userId: '1001005',
    name: 'عبدالله آل سعود',
    roleCode: 'DEL-402',
    roleTitle: 'مندوب الخليج العربي / المغرب العربي',
    level: 2,
    parentUserId: '1001001',
    parentRoleCode: 'MGR-9901',
    parentManager: 'MGR-9901',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    userId: '1001006',
    name: 'سلطان القحطاني',
    roleCode: 'DEL-403',
    roleTitle: 'مندوب مصر وشمال أفريقيا',
    level: 2,
    parentUserId: '1001001',
    parentRoleCode: 'MGR-9901',
    parentManager: 'MGR-9901',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
  },
  {
    userId: '1001007',
    name: 'مندوب المغرب العربي',
    roleCode: 'DEL-402',
    roleTitle: 'مندوب المغرب العربي',
    level: 2,
    parentUserId: '1001001',
    parentRoleCode: 'MGR-9901',
    parentManager: 'MGR-9901',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80'
  }
];

// المستوى 3: الوكلاء الرسميون (Official Agents & Agencies)
export const LEVEL_3_AGENTS: HierarchyEntity[] = [
  {
    userId: '1001010',
    name: 'سلطان الدوسري',
    roleCode: 'AG-101',
    roleTitle: 'وكيل رسمي (وكالة النخبة الملكية)',
    level: 3,
    parentUserId: '1001004',
    parentRoleCode: 'DEL-401',
    parentDelegate: 'DEL-401',
    parentAgency: 'AG-101',
    parentManager: 'MGR-9901',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80'
  },
  {
    userId: '1001011',
    name: 'فهد بني',
    roleCode: 'AG-104',
    roleTitle: 'وكيل رسمي (وكالة الأساطير الذهبية)',
    level: 3,
    parentUserId: '1001004',
    parentRoleCode: 'DEL-401',
    parentDelegate: 'DEL-401',
    parentAgency: 'AG-104',
    parentManager: 'MGR-9901',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
  },
  {
    userId: '1001012',
    name: 'فيصل المطيري',
    roleCode: 'AG-102',
    roleTitle: 'وكيل رسمي (وكالة صدى الخليج)',
    level: 3,
    parentUserId: '1001005',
    parentRoleCode: 'DEL-402',
    parentDelegate: 'DEL-402',
    parentAgency: 'AG-102',
    parentManager: 'MGR-9901',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    userId: '1001013',
    name: 'محمود عبد الرازق',
    roleCode: 'AG-103',
    roleTitle: 'وكيل رسمي (وكالة الأهرام للبث المباشر)',
    level: 3,
    parentUserId: '1001006',
    parentRoleCode: 'DEL-403',
    parentDelegate: 'DEL-403',
    parentAgency: 'AG-103',
    parentManager: 'MGR-9901',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  },
  {
    userId: '1001014',
    name: 'ماجد العسيري',
    roleCode: 'AG-105',
    roleTitle: 'وكيل رسمي (وكالة الصقور الملكية)',
    level: 3,
    parentUserId: '1001007',
    parentRoleCode: 'DEL-402',
    parentDelegate: 'DEL-402',
    parentAgency: 'AG-105',
    parentManager: 'MGR-9901',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
  },
  {
    userId: '1001015',
    name: 'سعد الشهراني',
    roleCode: 'AG-106',
    roleTitle: 'وكيل رسمي (وكالة المجد الفضائية)',
    level: 3,
    parentUserId: '1001005',
    parentRoleCode: 'DEL-402',
    parentDelegate: 'DEL-402',
    parentAgency: 'AG-106',
    parentManager: 'MGR-9901',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80'
  }
];

// المستوى 4: الوسطاء المعتمدون (Certified Brokers)
export const LEVEL_4_BROKERS: HierarchyEntity[] = [
  {
    userId: '1001016',
    name: 'تركي الشمري',
    roleCode: 'BRK-101-01',
    roleTitle: 'وسيط رخصة النخبة 1',
    level: 4,
    parentUserId: '1001010',
    parentRoleCode: 'AG-101',
    parentAgency: 'AG-101',
    parentDelegate: 'DEL-401',
    parentManager: 'MGR-9901',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    userId: '1001017',
    name: 'عبدالله القحطاني',
    roleCode: 'BRK-101-02',
    roleTitle: 'وسيط رخصة النخبة 2',
    level: 4,
    parentUserId: '1001010',
    parentRoleCode: 'AG-101',
    parentAgency: 'AG-101',
    parentDelegate: 'DEL-401',
    parentManager: 'MGR-9901',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    userId: '1001018',
    name: 'محمد الدوسري',
    roleCode: 'BRK-102-01',
    roleTitle: 'وسيط صدى الخليج',
    level: 4,
    parentUserId: '1001012',
    parentRoleCode: 'AG-102',
    parentAgency: 'AG-102',
    parentDelegate: 'DEL-402',
    parentManager: 'MGR-9901',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  },
  {
    userId: '1001019',
    name: 'وسيط رخصة الصقور',
    roleCode: 'BRK-105-01',
    roleTitle: 'وسيط رخصة الصقور',
    level: 4,
    parentUserId: '1001014',
    parentRoleCode: 'AG-105',
    parentAgency: 'AG-105',
    parentDelegate: 'DEL-402',
    parentManager: 'MGR-9901',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
  }
];

// المستوى 5: المضيفون، المذيعون، وعامة مستخدمي التطبيق (Hosts & Broadcasters)
export const LEVEL_5_HOSTS: HierarchyEntity[] = [
  {
    userId: '1001001',
    name: 'أبو أمجد (المؤسس والمضيف)',
    roleCode: 'HOST-1001001',
    roleTitle: 'المضيف المعتمد وصانع المحتوى',
    agency: 'وكالة النخبة الملكية AG-101',
    level: 5,
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=400'
  },
  {
    userId: '1001022',
    name: 'سارة الرياض',
    roleCode: 'HOST-101-01',
    roleTitle: 'مضيفة معتمدة',
    agency: 'وكالة النخبة الملكية AG-101',
    level: 5,
    parentUserId: '1001016',
    parentRoleCode: 'BRK-101-01',
    parentAgency: 'AG-101',
    parentDelegate: 'DEL-401',
    parentManager: 'MGR-9901',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
  },
  {
    userId: '1001023',
    name: 'صوت البادية',
    roleCode: 'HOST-101-02',
    roleTitle: 'مضيف معتمد',
    agency: 'وكالة النخبة الملكية AG-101',
    level: 5,
    parentUserId: '1001016',
    parentRoleCode: 'BRK-101-01',
    parentAgency: 'AG-101',
    parentDelegate: 'DEL-401',
    parentManager: 'MGR-9901',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    userId: '1001024',
    name: 'كروان النخبة',
    roleCode: 'HOST-101-03',
    roleTitle: 'مضيف معتمد',
    agency: 'وكالة النخبة الملكية AG-101',
    level: 5,
    parentUserId: '1001016',
    parentRoleCode: 'BRK-101-01',
    parentAgency: 'AG-101',
    parentDelegate: 'DEL-401',
    parentManager: 'MGR-9901',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    userId: '1001025',
    name: 'ليالي نجد',
    roleCode: 'HOST-101-04',
    roleTitle: 'مضيفة معتمدة',
    agency: 'وكالة النخبة الملكية AG-101',
    level: 5,
    parentUserId: '1001017',
    parentRoleCode: 'BRK-101-02',
    parentAgency: 'AG-101',
    parentDelegate: 'DEL-401',
    parentManager: 'MGR-9901',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'
  },
  {
    userId: '1001026',
    name: 'صقر الجزيرة',
    roleCode: 'HOST-101-05',
    roleTitle: 'مضيف معتمد',
    agency: 'وكالة النخبة الملكية AG-101',
    level: 5,
    parentUserId: '1001017',
    parentRoleCode: 'BRK-101-02',
    parentAgency: 'AG-101',
    parentDelegate: 'DEL-401',
    parentManager: 'MGR-9901',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  }
];

// دمج كل الكيانات المعتمدة في الخريطة الهندسية الشاملة
export const ALL_HIERARCHY_ENTITIES: HierarchyEntity[] = [
  ...LEVEL_1_MANAGERS,
  ...LEVEL_2_DELEGATES,
  ...LEVEL_3_AGENTS,
  ...LEVEL_4_BROKERS,
  ...LEVEL_5_HOSTS
];

/**
 * البحث عن حساب وموقعه في الشجرة الهرمية
 */
export function getHierarchyEntityById(idOrRoleCode: string): HierarchyEntity | undefined {
  if (!idOrRoleCode) return undefined;
  const clean = idOrRoleCode.trim().toUpperCase();
  return ALL_HIERARCHY_ENTITIES.find(
    (e) => e.userId.toUpperCase() === clean || e.roleCode.toUpperCase() === clean
  );
}

/**
 * معرف السوبر أدمن المعتمد الجديد (الأساسي رقم 1)
 */
export const PRIMARY_SUPER_ADMIN_ID = '1001001';

import { getApiUrl } from './apiConfig';

/**
 * استدعاء وفحص صلاحيات المستخدم الحالي من السيرفر المركزي
 * الرابط: GET /api/hierarchy/permissions/:userId
 */
export async function fetchUserHierarchyPermissions(userId: string): Promise<RolesSummary> {
  if (!userId) return DEFAULT_ROLES_SUMMARY;
  try {
    const res = await fetch(getApiUrl(`/api/hierarchy/permissions/${encodeURIComponent(userId.trim())}`));
    if (res.ok) {
      const data = await res.json();
      if (data && data.rolesSummary) {
        return data.rolesSummary;
      }
    }
  } catch (err) {
    console.error('Error fetching hierarchy permissions from server:', err);
  }

  // الاحتياط المحلي في حال عدم الاتصال المؤقت بالشبكة
  const cleanId = userId.trim().toUpperCase();
  if (
    cleanId === '1001001' || 
    cleanId === 'MGR-9901' || 
    cleanId === 'HOST-1001001' || 
    cleanId === 'MEGDY1919@GMAIL.COM' || 
    cleanId === 'YE1330000' ||
    cleanId === '0OW7YFYPGLGOGWBBHOVTPV8FJ3A3'
  ) {
    return {
      isManager: true,
      isSuperAdmin: true,
      isDelegate: true,
      isAgent: true,
      isRechargeAgent: true,
      isBroker: true,
      isHost: true,
      isThemeAdmin: true
    };
  }
  if (cleanId === 'DEL-401' || cleanId === '1001004') {
    return { ...DEFAULT_ROLES_SUMMARY, isDelegate: true };
  }
  if (cleanId === '1001010' || cleanId === 'AG-101') {
    return { ...DEFAULT_ROLES_SUMMARY, isAgent: true, isRechargeAgent: true };
  }
  if (cleanId === '1001016' || cleanId === 'BRK-101-01') {
    return { ...DEFAULT_ROLES_SUMMARY, isBroker: true };
  }
  if (cleanId === '1001022' || cleanId === '1001023' || cleanId === 'HOST-101-01' || cleanId === 'HOST-101-02') {
    return { ...DEFAULT_ROLES_SUMMARY, isHost: true };
  }
  if (cleanId === 'RCH-101') {
    return { ...DEFAULT_ROLES_SUMMARY, isRechargeAgent: true };
  }
  if (cleanId === 'THM-99') {
    return { ...DEFAULT_ROLES_SUMMARY, isThemeAdmin: true };
  }
  return DEFAULT_ROLES_SUMMARY;
}
