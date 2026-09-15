/**
 * خريطة الهندسة المعمارية لتوزيع الآيديات والتسلسل الهرمي (Architecture Hierarchy & ID Mapping System)
 * المعرف الأساسي الموحد (Primary User ID) يبدأ من #1001001
 * الكود الوظيفي الصلاحياتي (Role Code) المتوارث هرمياً
 */

export interface HierarchyEntity {
  userId: string;          // المعرف الأساسي الموحد (مثلاً 1001001)
  name: string;            // الاسم
  roleCode: string;        // الكود الوظيفي الصلاحياتي (MGR-9901, DEL-401, AG-101, BRK-101-01, HOST-101-01)
  roleTitle: string;       // المسمى الوظيفي
  level: 1 | 2 | 3 | 4 | 5; // المستوى الهرمي
  avatar?: string;
  parentUserId?: string;   // معرف الأب المباشر
  parentRoleCode?: string; // كود الأب الصلاحياتي
  parentDelegate?: string; // كود المندوب المشرف
  parentAgency?: string;   // كود الوكالة المشرفة
  parentManager?: string;  // كود مدير الإدارة الأعلى
}

// المستوى 1: الإدارة العليا (Super Admins / Directors)
export const LEVEL_1_MANAGERS: HierarchyEntity[] = [
  {
    userId: '1001001',
    name: 'أحمد المنصوري',
    roleCode: 'MGR-9901',
    roleTitle: 'مدير الإدارة العام',
    level: 1,
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=400'
  },
  {
    userId: '1001002',
    name: 'فهد الكعبي',
    roleCode: 'MGR-9902',
    roleTitle: 'نائب المدير العام',
    level: 1,
    parentUserId: '1001001',
    parentRoleCode: 'MGR-9901',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
  },
  {
    userId: '1001003',
    name: 'سارة آل ثاني',
    roleCode: 'MGR-9903',
    roleTitle: 'المشرف العام التقني',
    level: 1,
    parentUserId: '1001001',
    parentRoleCode: 'MGR-9901',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
  }
];

// المستوى 2: المناديب الرسميون (Official Delegates)
export const LEVEL_2_DELEGATES: HierarchyEntity[] = [
  {
    userId: '1001004',
    name: 'تركي بن خالد',
    roleCode: 'DEL-401',
    roleTitle: 'مندوب الشرق الأوسط',
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
    userId: '1001022',
    name: 'سارة الرياض',
    roleCode: 'HOST-101-01',
    roleTitle: 'مضيفة معتمدة',
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
