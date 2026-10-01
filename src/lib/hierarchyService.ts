/**
 * خريطة الهندسة المعمارية لتوزيع الآيديات والتسلسل الهرمي (Architecture Hierarchy & ID Mapping System)
 * مطابقة 100% لبيانات السيرفر المعتمدة الرسمية
 * المالك / المدير العام: MGR-9901 (#1001001) إدارة أبو أمجد
 * المندوب: DEL-401 (#1001004) عبدالله الشهري
 * الوكالة: AG-101 (المالك: #1001010) وكالة النخبة الملكية
 * الوسيط: BRK-101-1 (#1001016) تركي الشمري
 * المذيع المعتمد: HOST-101-01 (#1001022) سارة الرياض
 */

export interface HierarchyEntity {
  id: string;              // الرقم الوظيفي الهرمي (MGR-9901, DEL-401, AG-101, BRK-101-1, HOST-101-01)
  userId: string;          // معرف المستخدم الموحد في التطبيق
  name: string;            // الاسم
  roleTitle: string;       // المسمى الوظيفي
  level: 1 | 2 | 3 | 4 | 5; // المستوى الهرمي
  avatar?: string;
  agencyId?: string;       // [مفتاح ربط] الوكالة التابع لها
  brokerId?: string | null;// [مفتاح ربط] الوسيط المشرف
  delegateId?: string;     // [مفتاح ربط] المندوب المشرف
  managerId?: string;      // [مفتاح ربط] المدير المشرف
  commissionRate?: number; // نسبة العمولة (%)
  commission?: number;     // نسبة الوكالة (%)
  profitSharePercent?: number; // حصة المدير العامة (%)
  clan?: string;           // العشيرة (تظهر بجانب الاسم)
  userLevel?: number;      // الليفل العام للحساب
  supporterLevel?: number; // ليفل الداعم (رتبة الشحن والدعم)
  receiverLevel?: number;  // ليفل المدعوم (رتبة استلام البث)
  vipTier?: string | null; // شارة الـ VIP (مثل VIP5)
  isVip?: boolean;         // حالة الـ VIP
  hoursAchieved?: number;  // ساعات البث المنجزة
  monthlyRevenue?: number; // ألماسات البث المستلمة
  roleCode?: string;       // متوافق مع الاستخدامات السابقة
}

// المستوى 1: المدير العام وإدارة أبو أمجد
export const LEVEL_1_MANAGERS: HierarchyEntity[] = [
  {
    id: 'MGR-9901',
    roleCode: 'MGR-9901',
    userId: '1001001',
    name: 'إدارة أبو أمجد',
    roleTitle: 'المدير العام والمالك',
    profitSharePercent: 55.0,
    level: 1,
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'MGR-9902',
    roleCode: 'MGR-9902',
    userId: '1001002',
    name: 'فهد الكعبي',
    roleTitle: 'نائب المدير العام',
    profitSharePercent: 15.0,
    level: 1,
    managerId: 'MGR-9901',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
  }
];

// المستوى 2: المناديب الرسميون
export const LEVEL_2_DELEGATES: HierarchyEntity[] = [
  {
    id: 'DEL-401',
    roleCode: 'DEL-401',
    userId: '1001004',
    name: 'عبدالله الشهري',
    roleTitle: 'مندوب رسمي معتمد',
    managerId: 'MGR-9901',
    commissionRate: 15.0,
    level: 2,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'DEL-402',
    roleCode: 'DEL-402',
    userId: '1001005',
    name: 'عبدالله آل سعود',
    roleTitle: 'مندوب الخليج العربي',
    managerId: 'MGR-9901',
    commissionRate: 14.0,
    level: 2,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  }
];

// المستوى 3: الوكالات والوكلاء الرسميون
export const LEVEL_3_AGENTS: HierarchyEntity[] = [
  {
    id: 'AG-101',
    roleCode: 'AG-101',
    userId: '1001010',
    name: 'وكالة النخبة الملكية',
    roleTitle: 'وكيل رسمي معتمد',
    managerId: 'MGR-9901',
    delegateId: 'DEL-401',
    commission: 14.5,
    level: 3,
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'AG-102',
    roleCode: 'AG-102',
    userId: '1001012',
    name: 'وكالة صدى الخليج',
    roleTitle: 'وكيل رسمي معتمد',
    managerId: 'MGR-9901',
    delegateId: 'DEL-401',
    commission: 14.0,
    level: 3,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  }
];

// المستوى 4: الوسطاء المعتمدون
export const LEVEL_4_BROKERS: HierarchyEntity[] = [
  {
    id: 'BRK-101-1',
    roleCode: 'BRK-101-1',
    userId: '1001016',
    name: 'تركي الشمري',
    roleTitle: 'وسيط معتمد',
    agencyId: 'AG-101',
    commissionRate: 4.0,
    level: 4,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  }
];

// المستوى 5: المذيعون والمضيفون المعتمدون
export const LEVEL_5_HOSTS: HierarchyEntity[] = [
  {
    id: 'HOST-101-01',
    roleCode: 'HOST-101-01',
    userId: '1001022',
    name: 'سارة الرياض',
    roleTitle: 'مذيعة معتمدة',
    agencyId: 'AG-101',
    brokerId: 'BRK-101-1',
    clan: 'عشيرة الصقور 🦅',
    userLevel: 42,
    supporterLevel: 38,
    receiverLevel: 52,
    vipTier: 'VIP5',
    isVip: true,
    hoursAchieved: 145,
    monthlyRevenue: 3400000,
    level: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'HOST-101-02',
    roleCode: 'HOST-101-02',
    userId: '1001023',
    name: 'صوت البادية',
    roleTitle: 'مذيع معتمد',
    agencyId: 'AG-101',
    brokerId: 'BRK-101-1',
    clan: 'عشيرة النشامى ⚔️',
    userLevel: 35,
    supporterLevel: 25,
    receiverLevel: 40,
    vipTier: 'VIP3',
    isVip: true,
    hoursAchieved: 95,
    monthlyRevenue: 1850000,
    level: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
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
 * البحث عن حساب وموقعه في الشجرة الهرمية بالـ ID أو الكود الوظيفي
 */
export function getHierarchyEntityById(idOrRoleCode: string): HierarchyEntity | undefined {
  if (!idOrRoleCode) return undefined;
  const clean = idOrRoleCode.trim().toUpperCase();
  return ALL_HIERARCHY_ENTITIES.find(
    (e) => (e.userId && e.userId.toUpperCase() === clean) || 
           (e.id && e.id.toUpperCase() === clean) || 
           (e.roleCode && e.roleCode.toUpperCase() === clean)
  );
}

/**
 * البحث عن مذيع معتمد مرتبط بوكالة بناءً على معرف المستخدم (User ID)
 */
export function getBroadcasterProfileByUserId(userId: string): HierarchyEntity | undefined {
  if (!userId) return undefined;
  const clean = userId.trim();
  
  // فحص الكيانات المسجلة محلياً في الذاكرة
  const found = LEVEL_5_HOSTS.find((h) => h.userId === clean);
  if (found) return found;

  // فحص ما إذا كان هناك تسجيل ديناميكي في التخزين المحلي (مثلاً بعد قبول طلب الانضمام)
  try {
    const customHost = localStorage.getItem(`najm_broadcaster_profile_${clean}`);
    if (customHost) {
      return JSON.parse(customHost);
    }
  } catch {}

  return undefined;
}

/**
 * معرف السوبر أدمن والمدير العام المعتمد
 */
export const PRIMARY_SUPER_ADMIN_ID = '1001001';
