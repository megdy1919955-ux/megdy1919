/**
 * خدمة إدارة صلاحيات الإداريين والسوبر أدمن الديناميكية (Dynamic Admin & Super Admin Role Service)
 * تتحكم في ظهور الأزرار الإدارية في "صفحة أنا" وحصر لوحة السوبر أدمن بالمالك والمبرمج فقط (YE1330000)
 */

export type AdminRole = 
  | 'super_admin'     // المبرمج / المالك العام (Owner)
  | 'agency_admin'    // مدير الوكالات (Agency Manager)
  | 'theme_admin'     // مدير الثيمات والمتجر (Themes & Store Manager)
  | 'official_agent'  // وكيل رسمي (Official Agent)
  | 'broker'          // وسيط معتمد (Certified Broker)
  | 'moderator'       // المراقب العام / الدعم والرقابة (General Moderator)
  | 'regular_user';   // مستخدم عادي (بدون أزرار إدارية)

export interface BroadcasterItem {
  id: string;
  name: string;
  avatar: string;
  diamondsEarned: number;
  streamHours: number;
  status: 'live' | 'offline';
  joinedDate: string;
}

export interface SubBrokerItem {
  id: string;
  name: string;
  avatar: string;
  agencyGid: string;
  agencyName: string;
  recruitedBroadcastersCount: number;
  totalAgencyContribution: number; // diamonds/coins generated for agency
  brokerEarnings: number; // in USD / coins
  commissionRate: number; // percentage, e.g. 15%
  joinedDate: string;
  status: 'active' | 'suspended';
  broadcastersList?: BroadcasterItem[];
}

export interface OfficialAgentItem {
  id: string;
  name: string;
  avatar: string;
  agencyGid: string;
  agencyName: string;
  country: string;
  adminSupervisorId: string; // The Admin who recruited/supervises this agent (e.g. "AG9901")
  totalBroadcasters: number;
  monthlyRevenueUsd: number;
  totalDiamondsGenerated: number;
  monthlyTargetDiamonds: number;
  agentCommissionRate: number; // percentage, e.g. 25%
  status: 'active' | 'suspended';
  joinedDate: string;
  brokersList: SubBrokerItem[];
}

export interface AssignedAdmin {
  id: string;          // User ID (e.g. "YE1330000", "AG9901")
  name: string;        // Display Name
  avatar?: string;
  role: AdminRole;
  agencyGid?: string;  // If role is agent/broker
  agencyName?: string;
  canInviteAgents?: boolean; // هل يملك صلاحية دعوة وكلاء رسميين
  monthlyTargetAgents?: number; // تارغت عدد الوكالات المستهدفة
  expiresAt?: string;  // Optional expiration date
  assignedAt: string;
  assignedBy: string;  // "YE1330000 (المالك)"
  notes?: string;
  status: 'active' | 'suspended';
}

export interface AgencyApplication {
  id: string;
  applicantId: string;
  applicantName: string;
  applicantAvatar?: string;
  agencyName: string;
  proposedGid: string;
  country: string;
  broadcastersExpected: number;
  idProofUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export interface StoreItemEntity {
  id: string;
  name: string;
  category: 'badge' | 'frame' | 'bubble' | 'vehicle';
  price: number; // in diamonds / coins
  durationDays: number;
  icon: string;
  previewUrl?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  isActive: boolean;
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  category: 'role' | 'agency' | 'theme' | 'moderation' | 'finance';
  actorId: string;
  actorName: string;
  targetId?: string;
  details: string;
  timestamp: string;
}

export interface ModerationReport {
  id: string;
  reportedUserId: string;
  reportedUserName: string;
  reporterId: string;
  reporterName: string;
  roomId?: string;
  roomTitle?: string;
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  penaltyApplied?: 'warning' | 'kick_room' | 'ban_24h' | 'ban_permanent';
  createdAt: string;
}

export const OWNER_DEV_ID = 'YE1330000';
export const OFFICIAL_SUPER_ADMIN_IDS = [OWNER_DEV_ID, '1001001', 'MGR-9901'];

const ADMIN_ROLES_STORAGE_KEY = 'super_legend_assigned_admins_v4';
const AGENCY_REQUESTS_KEY = 'super_legend_agency_requests_v3';
const STORE_ITEMS_KEY = 'super_legend_store_items_v3';
const AUDIT_LOGS_KEY = 'super_legend_audit_logs_v3';
const MODERATION_REPORTS_KEY = 'super_legend_moderation_reports_v3';
const CURRENT_ACTIVE_USER_ID_KEY = 'super_legend_current_active_user_id';

// قائمة الكوادر الإدارية المعتمدة وفق الخريطة الهندسية المعمارية
const DEFAULT_ASSIGNED_ADMINS: AssignedAdmin[] = [
  {
    id: '1001001',
    name: 'المبرمج والمالك العام (MGR-9901)',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=400',
    role: 'super_admin',
    assignedAt: '2026-01-01',
    assignedBy: 'النظام الجذري (Root)',
    notes: 'المعرف الموحد 1001001 - الكود الوظيفي MGR-9901 - صلاحيات السوبر أدمن والمالك الشاملة والسيادية',
    status: 'active'
  },
  {
    id: OWNER_DEV_ID,
    name: 'المبرمج والمطور الحصري (YE1330000)',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=400',
    role: 'super_admin',
    assignedAt: '2026-01-01',
    assignedBy: 'النظام الجذري (Root)',
    notes: 'معرف التطوير المباشر YE1330000',
    status: 'active'
  },
  {
    id: 'MGR-9901',
    name: 'مدير الإدارة العام (MGR-9901)',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=400',
    role: 'super_admin',
    assignedAt: '2026-01-01',
    assignedBy: 'النظام الجذري (Root)',
    notes: 'رمز الصلاحيات MGR-9901 (الحساب 1001001)',
    status: 'active'
  },
  {
    id: '1001002',
    name: 'فهد الكعبي (MGR-9902)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    role: 'agency_admin',
    assignedAt: '2026-02-10',
    assignedBy: '1001001',
    notes: 'المستوى 1: نائب المدير العام MGR-9902 - مراجعة وقبول/رفض الوكالات',
    status: 'active'
  },
  {
    id: 'MGR-9902',
    name: 'فهد الكعبي (نائب المدير العام)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    role: 'agency_admin',
    assignedAt: '2026-02-10',
    assignedBy: '1001001',
    notes: 'كود الدور MGR-9902',
    status: 'active'
  },
  {
    id: '1001003',
    name: 'سارة آل ثاني (MGR-9903)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    role: 'theme_admin',
    assignedAt: '2026-02-15',
    assignedBy: '1001001',
    notes: 'المستوى 1: المشرف العام التقني MGR-9903 - إدارة المتجر والثيمات',
    status: 'active'
  },
  {
    id: 'MGR-9903',
    name: 'سارة آل ثاني (المشرف العام)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    role: 'theme_admin',
    assignedAt: '2026-02-15',
    assignedBy: '1001001',
    notes: 'كود الدور MGR-9903',
    status: 'active'
  },
  {
    id: '1001004',
    name: 'تركي بن خالد (DEL-401)',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    role: 'agency_admin',
    assignedAt: '2026-02-18',
    assignedBy: '1001001',
    notes: 'المستوى 2: مندوب الشرق الأوسط DEL-401 استقطاب الوكالات ومتابعة التراخيص',
    status: 'active'
  },
  {
    id: 'DEL-401',
    name: 'تركي بن خالد (مندوب الشرق الأوسط)',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    role: 'agency_admin',
    assignedAt: '2026-02-18',
    assignedBy: '1001001',
    notes: 'كود الدور DEL-401 (الحساب 1001004)',
    status: 'active'
  },
  {
    id: '1001005',
    name: 'عبدالله آل سعود (DEL-402)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'agency_admin',
    assignedAt: '2026-02-20',
    assignedBy: '1001001',
    notes: 'المستوى 2: مندوب الخليج والمغرب العربي DEL-402',
    status: 'active'
  },
  {
    id: 'DEL-402',
    name: 'عبدالله آل سعود (مندوب الخليج والمغرب)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'agency_admin',
    assignedAt: '2026-02-20',
    assignedBy: '1001001',
    notes: 'كود الدور DEL-402 (الحساب 1001005)',
    status: 'active'
  },
  {
    id: '1001006',
    name: 'سلطان القحطاني (DEL-403)',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    role: 'agency_admin',
    assignedAt: '2026-02-22',
    assignedBy: '1001001',
    notes: 'المستوى 2: مندوب مصر وشمال أفريقيا DEL-403',
    status: 'active'
  },
  {
    id: 'DEL-403',
    name: 'سلطان القحطاني (مندوب مصر وشمال أفريقيا)',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    role: 'agency_admin',
    assignedAt: '2026-02-22',
    assignedBy: '1001001',
    notes: 'كود الدور DEL-403 (الحساب 1001006)',
    status: 'active'
  },
  {
    id: '1001010',
    name: 'سلطان الدوسري (AG-101)',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    role: 'official_agent',
    agencyGid: 'AG-101',
    agencyName: 'وكالة النخبة الملكية',
    assignedAt: '2026-02-23',
    assignedBy: '1001004',
    notes: 'المستوى 3: وكيل رسمي AG-101 تابع للمندوب DEL-401',
    status: 'active'
  },
  {
    id: 'AG-101',
    name: 'وكالة النخبة الملكية (AG-101)',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    role: 'official_agent',
    agencyGid: 'AG-101',
    agencyName: 'وكالة النخبة الملكية',
    assignedAt: '2026-02-23',
    assignedBy: 'DEL-401',
    notes: 'كود الوكالة AG-101 (الحساب 1001010)',
    status: 'active'
  },
  {
    id: '1001011',
    name: 'فهد بني (AG-104)',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    role: 'official_agent',
    agencyGid: 'AG-104',
    agencyName: 'وكالة الأساطير الذهبية',
    assignedAt: '2026-02-24',
    assignedBy: '1001004',
    notes: 'المستوى 3: وكيل رسمي AG-104 تابع للمندوب DEL-401',
    status: 'active'
  },
  {
    id: 'AG-104',
    name: 'وكالة الأساطير الذهبية (AG-104)',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    role: 'official_agent',
    agencyGid: 'AG-104',
    agencyName: 'وكالة الأساطير الذهبية',
    assignedAt: '2026-02-24',
    assignedBy: 'DEL-401',
    notes: 'كود الوكالة AG-104 (الحساب 1001011)',
    status: 'active'
  },
  {
    id: '1001016',
    name: 'تركي الشمري (BRK-101-01)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'broker',
    agencyGid: 'AG-101',
    agencyName: 'وكالة النخبة الملكية',
    assignedAt: '2026-02-25',
    assignedBy: '1001010',
    notes: 'المستوى 4: وسيط معتمد BRK-101-01 تحت وكالة النخبة AG-101',
    status: 'active'
  },
  {
    id: 'BRK-101-01',
    name: 'تركي الشمري (وسيط BRK-101-01)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'broker',
    agencyGid: 'AG-101',
    agencyName: 'وكالة النخبة الملكية',
    assignedAt: '2026-02-25',
    assignedBy: 'AG-101',
    notes: 'كود الوسيط BRK-101-01 (الحساب 1001016)',
    status: 'active'
  },
  {
    id: '1001017',
    name: 'عبدالله القحطاني (BRK-101-02)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'broker',
    agencyGid: 'AG-101',
    agencyName: 'وكالة النخبة الملكية',
    assignedAt: '2026-02-25',
    assignedBy: '1001010',
    notes: 'المستوى 4: وسيط معتمد BRK-101-02 تحت وكالة النخبة AG-101',
    status: 'active'
  },
  {
    id: 'BRK-101-02',
    name: 'عبدالله القحطاني (وسيط BRK-101-02)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'broker',
    agencyGid: 'AG-101',
    agencyName: 'وكالة النخبة الملكية',
    assignedAt: '2026-02-25',
    assignedBy: 'AG-101',
    notes: 'كود الوسيط BRK-101-02 (الحساب 1001017)',
    status: 'active'
  },
  {
    id: 'AG9901',
    name: 'سالم الكعبي (مدير الوكالات)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    role: 'agency_admin',
    assignedAt: '2026-02-10',
    assignedBy: OWNER_DEV_ID,
    notes: 'مراجعة وقبول/رفض الوكالات ومتابعة أداء وتارغت الوكلاء',
    status: 'active'
  },
  {
    id: '30032',
    name: 'فهد العتيبي (وكيل رسمي)',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    role: 'official_agent',
    agencyGid: '30032',
    agencyName: 'وكالة الأساطير الذهبية',
    assignedAt: '2026-02-20',
    assignedBy: OWNER_DEV_ID,
    notes: 'وكيل معتمد لديه وسطاء ومذيعين وعقود بث',
    status: 'active'
  }
];

const DEFAULT_AGENCY_REQUESTS: AgencyApplication[] = [
  {
    id: 'REQ_77102',
    applicantId: '994101',
    applicantName: 'خالد بن ناصر',
    applicantAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200',
    agencyName: 'وكالة الرواد لايف الخليجية',
    proposedGid: '77192',
    country: 'المملكة العربية السعودية 🇸🇦',
    broadcastersExpected: 35,
    status: 'pending',
    submittedAt: '2026-02-26 14:30'
  },
  {
    id: 'REQ_88204',
    applicantId: '551900',
    applicantName: 'طارق الشمري',
    applicantAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    agencyName: 'وكالة الصقور الدولية',
    proposedGid: '55120',
    country: 'الكويت 🇰🇼',
    broadcastersExpected: 20,
    status: 'pending',
    submittedAt: '2026-02-25 18:15'
  }
];

const DEFAULT_STORE_ITEMS: StoreItemEntity[] = [
  {
    id: 'badge_legend_king',
    name: 'وسام الملك الأسطوري',
    category: 'badge',
    price: 15000,
    durationDays: 30,
    icon: '👑',
    rarity: 'legendary',
    isActive: true,
    createdAt: '2026-02-01'
  },
  {
    id: 'frame_cyber_dragon',
    name: 'إطار التنين السيبراني المتوهج',
    category: 'frame',
    price: 25000,
    durationDays: 30,
    icon: '🐉',
    rarity: 'epic',
    isActive: true,
    createdAt: '2026-02-10'
  },
  {
    id: 'bubble_gold_sparkle',
    name: 'فقاعة الدردشة الذهبية المشعة',
    category: 'bubble',
    price: 8000,
    durationDays: 15,
    icon: '💬',
    rarity: 'rare',
    isActive: true,
    createdAt: '2026-02-12'
  },
  {
    id: 'vehicle_ferrari_neon',
    name: 'سيارة الفيراري النيون الملكية',
    category: 'vehicle',
    price: 50000,
    durationDays: 30,
    icon: '🏎️',
    rarity: 'legendary',
    isActive: true,
    createdAt: '2026-02-15'
  }
];

const DEFAULT_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'LOG_001',
    action: 'تعيين إداري وكالات',
    category: 'role',
    actorId: OWNER_DEV_ID,
    actorName: 'المبرمج والمالك العام 👑',
    targetId: 'AG9901',
    details: 'تم تفويض سالم الكعبي بصلاحية مدير الوكالات',
    timestamp: '2026-02-10 10:00'
  },
  {
    id: 'LOG_002',
    action: 'اعتماد وكالة رسمية',
    category: 'agency',
    actorId: 'AG9901',
    actorName: 'سالم الكعبي (مدير الوكالات)',
    targetId: '30032',
    details: 'تم توثيق وكالة الأساطير الذهبية وتعيين فهد العتيبي وكيلاً رسمياً',
    timestamp: '2026-02-20 16:45'
  },
  {
    id: 'LOG_003',
    action: 'حظر حساب مخالف بالرومات',
    category: 'moderation',
    actorId: 'MOD330',
    actorName: 'عبدالرحمن الدعم (المراقب العام)',
    targetId: 'USER_8819',
    details: 'تم حظر المستخدم لمدة 24 ساعة بسبب مخالفة ضوابط البث الصوتي',
    timestamp: '2026-02-24 21:10'
  }
];

const DEFAULT_MODERATION_REPORTS: ModerationReport[] = [
  {
    id: 'REP_991',
    reportedUserId: 'USER_7741',
    reportedUserName: 'عصام الغامدي',
    reporterId: 'USER_1120',
    reporterName: 'سارة خالد',
    roomId: 'room_101',
    roomTitle: 'جلسة الأساطير والطرب 🎙️',
    reason: 'استخدام لغة غير لائقة وتجاوز شروط المحادثة بالمايك',
    status: 'pending',
    createdAt: '2026-02-27 11:20'
  },
  {
    id: 'REP_992',
    reportedUserId: 'USER_6620',
    reportedUserName: 'حساب غير موثق',
    reporterId: 'USER_3310',
    reporterName: 'بندر الشريف',
    roomId: 'room_204',
    roomTitle: 'تحدي الداعمين VIP',
    reason: 'إرسال روابط خارجية غير مصرح بها في الشات',
    status: 'pending',
    createdAt: '2026-02-27 13:45'
  }
];

/**
 * الحصول على قائمة جميع الإداريين والوكلاء المعينين
 */
export function getAllAssignedAdmins(): AssignedAdmin[] {
  if (typeof window === 'undefined') return DEFAULT_ASSIGNED_ADMINS;
  try {
    const raw = localStorage.getItem(ADMIN_ROLES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const hasOwner = parsed.some((a) => a.id === OWNER_DEV_ID);
        if (!hasOwner) {
          return [DEFAULT_ASSIGNED_ADMINS[0], ...parsed];
        }
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load assigned admins:', e);
  }
  return DEFAULT_ASSIGNED_ADMINS;
}

/**
 * حفظ قائمة الإداريين
 */
export function saveAssignedAdmins(admins: AssignedAdmin[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ADMIN_ROLES_STORAGE_KEY, JSON.stringify(admins));
    window.dispatchEvent(new CustomEvent('admin_roles_updated', { detail: admins }));
  } catch (e) {
    console.error('Failed to save assigned admins:', e);
  }
}

/**
 * تسجيل حركة في سجل العمليات الكبرى (Audit Logs)
 */
export function logAuditEvent(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(AUDIT_LOGS_KEY);
    const logs: AuditLogEntry[] = raw ? JSON.parse(raw) : DEFAULT_AUDIT_LOGS;
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const newEntry: AuditLogEntry = {
      id: `LOG_${Date.now().toString(36).toUpperCase()}`,
      timestamp: formattedDate,
      ...entry
    };
    
    logs.unshift(newEntry);
    localStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify(logs.slice(0, 100)));
    window.dispatchEvent(new CustomEvent('audit_logs_updated', { detail: logs }));
  } catch (e) {
    console.error('Failed to log audit event:', e);
  }
}

export function getAuditLogs(): AuditLogEntry[] {
  if (typeof window === 'undefined') return DEFAULT_AUDIT_LOGS;
  try {
    const raw = localStorage.getItem(AUDIT_LOGS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEFAULT_AUDIT_LOGS;
}

/**
 * التحقق من الدور الإداري لمستخدم معين بناءً على معرّفه
 */
export function getAdminRoleForUser(userId: string): AdminRole {
  if (!userId) return 'regular_user';
  
  const cleanId = userId.trim().toUpperCase();
  // شرط المالك والمبرمج الحصري وكود MGR-9901 ومعرف 1001001
  if (OFFICIAL_SUPER_ADMIN_IDS.map(id => id.toUpperCase()).includes(cleanId)) {
    return 'super_admin';
  }

  const allAdmins = getAllAssignedAdmins();
  const matched = allAdmins.find(
    (a) => a.id.trim().toUpperCase() === cleanId && a.status === 'active'
  );

  if (matched) {
    return matched.role;
  }

  return 'regular_user';
}

/**
 * هل المستخدم هو المالك / المبرمج (السوبر أدمن)؟
 */
export function isOwnerOrSuperAdmin(userId: string): boolean {
  if (!userId) return false;
  const cleanId = userId.trim().toUpperCase();
  return OFFICIAL_SUPER_ADMIN_IDS.map(id => id.toUpperCase()).includes(cleanId);
}

/**
 * تعيين أو تحديث صلاحية إداري
 */
export function assignAdminRole(data: {
  id: string;
  name: string;
  avatar?: string;
  role: AdminRole;
  agencyGid?: string;
  agencyName?: string;
  expiresAt?: string;
  notes?: string;
}): AssignedAdmin {
  const allAdmins = getAllAssignedAdmins();
  const cleanId = data.id.trim();
  const now = new Date().toISOString().split('T')[0];

  const existingIndex = allAdmins.findIndex((a) => a.id.toUpperCase() === cleanId.toUpperCase());
  
  let newAdmin: AssignedAdmin;

  if (existingIndex >= 0) {
    newAdmin = {
      ...allAdmins[existingIndex],
      name: data.name || allAdmins[existingIndex].name,
      avatar: data.avatar || allAdmins[existingIndex].avatar,
      role: data.role,
      agencyGid: data.agencyGid || allAdmins[existingIndex].agencyGid,
      agencyName: data.agencyName || allAdmins[existingIndex].agencyName,
      expiresAt: data.expiresAt || allAdmins[existingIndex].expiresAt,
      notes: data.notes || allAdmins[existingIndex].notes,
      status: 'active'
    };
    allAdmins[existingIndex] = newAdmin;
  } else {
    newAdmin = {
      id: cleanId,
      name: data.name,
      avatar: data.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      role: data.role,
      agencyGid: data.agencyGid,
      agencyName: data.agencyName,
      expiresAt: data.expiresAt,
      assignedAt: now,
      assignedBy: `${OWNER_DEV_ID} (المالك والمبرمج)`,
      notes: data.notes || 'تم التعيين عبر لوحة تحكم السوبر أدمن',
      status: 'active'
    };
    allAdmins.push(newAdmin);
  }

  saveAssignedAdmins(allAdmins);
  logAuditEvent({
    action: `تعيين / تعديل صلاحية: ${data.role}`,
    category: 'role',
    actorId: OWNER_DEV_ID,
    actorName: 'المبرمج والمالك العام 👑',
    targetId: cleanId,
    details: `تم إعطاء صلاحية ${data.role} للمستخدم ${data.name} (ID: ${cleanId})`
  });

  return newAdmin;
}

/**
 * تعديل حالة الإداري (نشط / معلق)
 */
export function toggleAdminStatus(userId: string): void {
  if (userId.toUpperCase() === OWNER_DEV_ID) return;
  const allAdmins = getAllAssignedAdmins();
  const target = allAdmins.find((a) => a.id.toUpperCase() === userId.trim().toUpperCase());
  if (target) {
    target.status = target.status === 'active' ? 'suspended' : 'active';
    saveAssignedAdmins(allAdmins);
    logAuditEvent({
      action: `تغيير حالة حساب إداري إلى: ${target.status}`,
      category: 'role',
      actorId: OWNER_DEV_ID,
      actorName: 'المبرمج والمالك العام 👑',
      targetId: userId,
      details: `تم تعديل حالة ${target.name} إلى ${target.status}`
    });
  }
}

/**
 * سحب وإلغاء صلاحية إداري
 */
export function revokeAdminRole(userId: string): boolean {
  if (userId.toUpperCase() === OWNER_DEV_ID) return false;
  const allAdmins = getAllAssignedAdmins();
  const target = allAdmins.find((a) => a.id.toUpperCase() === userId.trim().toUpperCase());
  const filtered = allAdmins.filter((a) => a.id.toUpperCase() !== userId.trim().toUpperCase());
  saveAssignedAdmins(filtered);
  if (target) {
    logAuditEvent({
      action: 'سحب الصلاحية الإدارية',
      category: 'role',
      actorId: OWNER_DEV_ID,
      actorName: 'المبرمج والمالك العام 👑',
      targetId: userId,
      details: `تم سحب كافة الصلاحيات من ${target.name} (${userId})`
    });
  }
  return true;
}

/**
 * إدارة طلبات الوكالات الجديدة (Agency Applications)
 */
export function getAgencyRequests(): AgencyApplication[] {
  if (typeof window === 'undefined') return DEFAULT_AGENCY_REQUESTS;
  try {
    const raw = localStorage.getItem(AGENCY_REQUESTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEFAULT_AGENCY_REQUESTS;
}

export function approveAgencyRequest(requestId: string, reviewerId: string = OWNER_DEV_ID): void {
  const requests = getAgencyRequests();
  const target = requests.find((r) => r.id === requestId);
  if (target) {
    target.status = 'approved';
    target.reviewedBy = reviewerId;
    target.reviewedAt = new Date().toISOString().split('T')[0];
    localStorage.setItem(AGENCY_REQUESTS_KEY, JSON.stringify(requests));
    
    // Automatically promote applicant to Official Agent
    assignAdminRole({
      id: target.applicantId,
      name: target.applicantName,
      avatar: target.applicantAvatar,
      role: 'official_agent',
      agencyGid: target.proposedGid,
      agencyName: target.agencyName,
      notes: `تم اعتماد الوكالة بناءً على طلب رقم ${requestId}`
    });

    logAuditEvent({
      action: 'اعتماد وقبول طلب وكالة رسمية',
      category: 'agency',
      actorId: reviewerId,
      actorName: 'مدير الوكالات / المالك',
      targetId: target.proposedGid,
      details: `تم قبول طلب ${target.agencyName} برقم GID: ${target.proposedGid} للمستخدم ${target.applicantName}`
    });
    window.dispatchEvent(new CustomEvent('agency_requests_updated', { detail: requests }));
  }
}

export function rejectAgencyRequest(requestId: string, reason: string = 'عدم استيفاء الشروط', reviewerId: string = OWNER_DEV_ID): void {
  const requests = getAgencyRequests();
  const target = requests.find((r) => r.id === requestId);
  if (target) {
    target.status = 'rejected';
    target.rejectionReason = reason;
    target.reviewedBy = reviewerId;
    target.reviewedAt = new Date().toISOString().split('T')[0];
    localStorage.setItem(AGENCY_REQUESTS_KEY, JSON.stringify(requests));
    logAuditEvent({
      action: 'رفض طلب وكالة',
      category: 'agency',
      actorId: reviewerId,
      actorName: 'مدير الوكالات / المالك',
      targetId: target.proposedGid,
      details: `تم رفض طلب ${target.agencyName} بسبب: ${reason}`
    });
    window.dispatchEvent(new CustomEvent('agency_requests_updated', { detail: requests }));
  }
}

/**
 * إدارة عناصر المتجر (Store Items)
 */
export function getStoreItems(): StoreItemEntity[] {
  if (typeof window === 'undefined') return DEFAULT_STORE_ITEMS;
  try {
    const raw = localStorage.getItem(STORE_ITEMS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEFAULT_STORE_ITEMS;
}

export function saveStoreItem(item: StoreItemEntity): void {
  const items = getStoreItems();
  const idx = items.findIndex((i) => i.id === item.id);
  if (idx >= 0) {
    items[idx] = item;
  } else {
    items.unshift(item);
  }
  localStorage.setItem(STORE_ITEMS_KEY, JSON.stringify(items));
  logAuditEvent({
    action: 'إضافة / تعديل عنصر في المتجر',
    category: 'theme',
    actorId: OWNER_DEV_ID,
    actorName: 'مدير الثيمات / المالك',
    targetId: item.id,
    details: `تم حفظ العنصر: ${item.name} (${item.category}) بسعر ${item.price} كوينز`
  });
  window.dispatchEvent(new CustomEvent('store_items_updated', { detail: items }));
}

export function deleteStoreItem(itemId: string): void {
  const items = getStoreItems().filter((i) => i.id !== itemId);
  localStorage.setItem(STORE_ITEMS_KEY, JSON.stringify(items));
  logAuditEvent({
    action: 'حذف عنصر من المتجر',
    category: 'theme',
    actorId: OWNER_DEV_ID,
    actorName: 'مدير الثيمات / المالك',
    targetId: itemId,
    details: `تم حذف عنصر المتجر برمز: ${itemId}`
  });
  window.dispatchEvent(new CustomEvent('store_items_updated', { detail: items }));
}

/**
 * إدارة بلاغات الرقابة والإشراف (Moderation Reports)
 */
export function getModerationReports(): ModerationReport[] {
  if (typeof window === 'undefined') return DEFAULT_MODERATION_REPORTS;
  try {
    const raw = localStorage.getItem(MODERATION_REPORTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEFAULT_MODERATION_REPORTS;
}

export function resolveModerationReport(reportId: string, penalty: ModerationReport['penaltyApplied'], moderatorId: string = 'MOD330'): void {
  const reports = getModerationReports();
  const target = reports.find((r) => r.id === reportId);
  if (target) {
    target.status = 'resolved';
    target.penaltyApplied = penalty;
    localStorage.setItem(MODERATION_REPORTS_KEY, JSON.stringify(reports));
    logAuditEvent({
      action: `تنفيذ عقوبة رقابية: ${penalty}`,
      category: 'moderation',
      actorId: moderatorId,
      actorName: 'المراقب العام 🛡️',
      targetId: target.reportedUserId,
      details: `تم تطبيق إجراء ${penalty} على المستخدم ${target.reportedUserName} بسبب: ${target.reason}`
    });
    window.dispatchEvent(new CustomEvent('moderation_reports_updated', { detail: reports }));
  }
}

/**
 * اشتراك في تحديثات الصلاحيات
 */
export function subscribeToAdminRoles(callback: () => void): () => void {
  const handler = () => callback();
  window.addEventListener('admin_roles_updated', handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener('admin_roles_updated', handler);
    window.removeEventListener('storage', handler);
  };
}

/**
 * تبديل هوية المستخدم لاختبار الواجهة (Testing Persona Switcher)
 */
export function setTestingUserId(userId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CURRENT_ACTIVE_USER_ID_KEY, userId);
  
  const rawProfile = localStorage.getItem('user_profile_data');
  if (rawProfile) {
    try {
      const parsed = JSON.parse(rawProfile);
      parsed.userId = userId;
      localStorage.setItem('user_profile_data', JSON.stringify(parsed));
    } catch {}
  }
  
  window.dispatchEvent(new CustomEvent('testing_user_switched', { detail: { userId } }));
  window.dispatchEvent(new Event('user_profile_updated'));
}

const HIERARCHICAL_AGENTS_STORAGE_KEY = 'super_legend_hierarchical_agents_v4';

export const DEFAULT_OFFICIAL_AGENTS: OfficialAgentItem[] = [
  {
    id: '1001010',
    name: 'سلطان الدوسري (وكالة النخبة)',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
    agencyGid: 'AG-101',
    agencyName: 'وكالة النخبة الملكية',
    country: 'المملكة العربية السعودية 🇸🇦',
    adminSupervisorId: 'DEL-401',
    totalBroadcasters: 32,
    monthlyRevenueUsd: 54000,
    totalDiamondsGenerated: 10800000,
    monthlyTargetDiamonds: 12000000,
    agentCommissionRate: 25,
    status: 'active',
    joinedDate: '2026-02-10',
    brokersList: [
      {
        id: '1001016',
        name: 'تركي الشمري (BRK-101-01)',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        agencyGid: 'AG-101',
        agencyName: 'وكالة النخبة الملكية',
        recruitedBroadcastersCount: 18,
        totalAgencyContribution: 6200000,
        brokerEarnings: 9300,
        commissionRate: 15,
        joinedDate: '2026-02-15',
        status: 'active',
        broadcastersList: [
          {
            id: '1001022',
            name: 'سارة الرياض 🌟',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
            diamondsEarned: 2800000,
            streamHours: 130,
            status: 'live',
            joinedDate: '2026-02-19'
          },
          {
            id: '1001023',
            name: 'صوت البادية 🎤',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
            diamondsEarned: 2100000,
            streamHours: 105,
            status: 'offline',
            joinedDate: '2026-02-20'
          },
          {
            id: '1001024',
            name: 'كروان النخبة 🎵',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
            diamondsEarned: 1300000,
            streamHours: 78,
            status: 'live',
            joinedDate: '2026-02-22'
          }
        ]
      },
      {
        id: '1001017',
        name: 'عبدالله القحطاني (BRK-101-02)',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
        agencyGid: 'AG-101',
        agencyName: 'وكالة النخبة الملكية',
        recruitedBroadcastersCount: 14,
        totalAgencyContribution: 4600000,
        brokerEarnings: 6900,
        commissionRate: 15,
        joinedDate: '2026-02-18',
        status: 'active',
        broadcastersList: [
          {
            id: '1001025',
            name: 'ليالي نجد 🌙',
            avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
            diamondsEarned: 2400000,
            streamHours: 115,
            status: 'offline',
            joinedDate: '2026-02-21'
          },
          {
            id: '1001026',
            name: 'صقر الجزيرة 🦅',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
            diamondsEarned: 2200000,
            streamHours: 102,
            status: 'live',
            joinedDate: '2026-02-23'
          }
        ]
      }
    ]
  },
  {
    id: '1001011',
    name: 'فهد بني (وكالة الأساطير)',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
    agencyGid: 'AG-104',
    agencyName: 'وكالة الأساطير الذهبية',
    country: 'المملكة العربية السعودية 🇸🇦',
    adminSupervisorId: 'DEL-401',
    totalBroadcasters: 28,
    monthlyRevenueUsd: 48500,
    totalDiamondsGenerated: 9700000,
    monthlyTargetDiamonds: 10000000,
    agentCommissionRate: 25,
    status: 'active',
    joinedDate: '2026-02-15',
    brokersList: [
      {
        id: '994012',
        name: 'ماجد بن خالد',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
        agencyGid: 'AG-104',
        agencyName: 'وكالة الأساطير الذهبية',
        recruitedBroadcastersCount: 16,
        totalAgencyContribution: 5800000,
        brokerEarnings: 8700,
        commissionRate: 15,
        joinedDate: '2026-02-18',
        status: 'active',
        broadcastersList: [
          {
            id: 'BR_101',
            name: 'نغم الطرب 🎵',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
            diamondsEarned: 2400000,
            streamHours: 124,
            status: 'live',
            joinedDate: '2026-02-19'
          }
        ]
      }
    ]
  },
  {
    id: '30032',
    name: 'فهد العتيبي (الوكيل الذهبي)',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    agencyGid: '30032',
    agencyName: 'وكالة الأساطير الذهبية',
    country: 'المملكة العربية السعودية 🇸🇦',
    adminSupervisorId: 'AG9901',
    totalBroadcasters: 28,
    monthlyRevenueUsd: 48500,
    totalDiamondsGenerated: 9700000,
    monthlyTargetDiamonds: 10000000,
    agentCommissionRate: 25,
    status: 'active',
    joinedDate: '2026-02-15',
    brokersList: [
      {
        id: '994012',
        name: 'ماجد بن خالد',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
        agencyGid: '30032',
        agencyName: 'وكالة الأساطير الذهبية',
        recruitedBroadcastersCount: 16,
        totalAgencyContribution: 5800000,
        brokerEarnings: 8700,
        commissionRate: 15,
        joinedDate: '2026-02-18',
        status: 'active',
        broadcastersList: [
          {
            id: 'BR_101',
            name: 'نغم الطرب 🎵',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
            diamondsEarned: 2400000,
            streamHours: 124,
            status: 'live',
            joinedDate: '2026-02-19'
          },
          {
            id: 'BR_102',
            name: 'ريم القلوب 🌸',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
            diamondsEarned: 1950000,
            streamHours: 98,
            status: 'offline',
            joinedDate: '2026-02-20'
          },
          {
            id: 'BR_103',
            name: 'صقر الجنوب 🦅',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
            diamondsEarned: 1450000,
            streamHours: 85,
            status: 'live',
            joinedDate: '2026-02-22'
          }
        ]
      },
      {
        id: '883109',
        name: 'سلطان الدوسري',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200',
        agencyGid: '30032',
        agencyName: 'وكالة الأساطير الذهبية',
        recruitedBroadcastersCount: 12,
        totalAgencyContribution: 3900000,
        brokerEarnings: 5850,
        commissionRate: 15,
        joinedDate: '2026-02-20',
        status: 'active',
        broadcastersList: [
          {
            id: 'BR_104',
            name: 'صوت الخليج 🎤',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
            diamondsEarned: 2100000,
            streamHours: 110,
            status: 'offline',
            joinedDate: '2026-02-21'
          },
          {
            id: 'BR_105',
            name: 'أميرة الشات 👑',
            avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
            diamondsEarned: 1800000,
            streamHours: 92,
            status: 'live',
            joinedDate: '2026-02-23'
          }
        ]
      }
    ]
  },
  {
    id: '77192',
    name: 'خالد بن ناصر (وكيل الرواد)',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200',
    agencyGid: '77192',
    agencyName: 'وكالة الرواد لايف الخليجية',
    country: 'المملكة العربية السعودية 🇸🇦',
    adminSupervisorId: 'AG9901',
    totalBroadcasters: 22,
    monthlyRevenueUsd: 36200,
    totalDiamondsGenerated: 7240000,
    monthlyTargetDiamonds: 8000000,
    agentCommissionRate: 25,
    status: 'active',
    joinedDate: '2026-02-18',
    brokersList: [
      {
        id: '441029',
        name: 'منى القحطاني',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
        agencyGid: '77192',
        agencyName: 'وكالة الرواد لايف الخليجية',
        recruitedBroadcastersCount: 14,
        totalAgencyContribution: 4300000,
        brokerEarnings: 6450,
        commissionRate: 15,
        joinedDate: '2026-02-21',
        status: 'active',
        broadcastersList: [
          {
            id: 'BR_201',
            name: 'شوق الرياض ✨',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
            diamondsEarned: 2600000,
            streamHours: 130,
            status: 'live',
            joinedDate: '2026-02-22'
          },
          {
            id: 'BR_202',
            name: 'فارس الليل 🌙',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
            diamondsEarned: 1700000,
            streamHours: 88,
            status: 'offline',
            joinedDate: '2026-02-23'
          }
        ]
      }
    ]
  },
  {
    id: '55120',
    name: 'طارق الشمري (وكيل الصقور)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    agencyGid: '55120',
    agencyName: 'وكالة الصقور الدولية',
    country: 'الكويت 🇰🇼',
    adminSupervisorId: OWNER_DEV_ID,
    totalBroadcasters: 18,
    monthlyRevenueUsd: 29800,
    totalDiamondsGenerated: 5960000,
    monthlyTargetDiamonds: 6000000,
    agentCommissionRate: 25,
    status: 'active',
    joinedDate: '2026-02-20',
    brokersList: [
      {
        id: '662104',
        name: 'بندر العلي',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
        agencyGid: '55120',
        agencyName: 'وكالة الصقور الدولية',
        recruitedBroadcastersCount: 18,
        totalAgencyContribution: 5960000,
        brokerEarnings: 8940,
        commissionRate: 15,
        joinedDate: '2026-02-22',
        status: 'active',
        broadcastersList: [
          {
            id: 'BR_301',
            name: 'جوهرة الكويت 💎',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
            diamondsEarned: 3400000,
            streamHours: 140,
            status: 'live',
            joinedDate: '2026-02-23'
          }
        ]
      }
    ]
  }
];

export function getAllOfficialAgents(): OfficialAgentItem[] {
  if (typeof window === 'undefined') return DEFAULT_OFFICIAL_AGENTS;
  try {
    const raw = localStorage.getItem(HIERARCHICAL_AGENTS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEFAULT_OFFICIAL_AGENTS;
}

export function saveOfficialAgents(agents: OfficialAgentItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(HIERARCHICAL_AGENTS_STORAGE_KEY, JSON.stringify(agents));
    window.dispatchEvent(new CustomEvent('hierarchical_agents_updated', { detail: agents }));
  } catch (e) {
    console.error('Failed to save official agents:', e);
  }
}

/**
 * جلب جميع الوكلاء المعتمدين التابعين لإداري معين
 */
export function getAgentsForAdmin(adminId: string): OfficialAgentItem[] {
  const allAgents = getAllOfficialAgents();
  const cleanId = adminId?.trim().toUpperCase();
  if (cleanId === OWNER_DEV_ID) {
    return allAgents; // Super Admin sees all or direct agents
  }
  return allAgents.filter(
    (ag) => ag.adminSupervisorId?.trim().toUpperCase() === cleanId
  );
}

/**
 * جلب وكيل رسمي حسب رقم الوكالة GID
 */
export function getAgentByGid(agencyGid: string): OfficialAgentItem | undefined {
  const allAgents = getAllOfficialAgents();
  return allAgents.find((ag) => ag.agencyGid === agencyGid || ag.id === agencyGid);
}

/**
 * جلب وسيط معتمد بـ ID
 */
export function getBrokerById(brokerId: string): SubBrokerItem | undefined {
  const allAgents = getAllOfficialAgents();
  for (const agent of allAgents) {
    const found = agent.brokersList?.find((b) => b.id === brokerId);
    if (found) return found;
  }
  return undefined;
}

/**
 * دعوة / تعيين وكيل رسمي جديد تحت إشراف إداري محدد
 */
export function addNewAgentToAdmin(data: {
  adminSupervisorId: string;
  applicantId: string;
  applicantName: string;
  applicantAvatar?: string;
  agencyGid: string;
  agencyName: string;
  country?: string;
  monthlyTargetDiamonds?: number;
  agentCommissionRate?: number;
}): OfficialAgentItem {
  const allAgents = getAllOfficialAgents();
  const now = new Date().toISOString().split('T')[0];

  const newAgent: OfficialAgentItem = {
    id: data.applicantId.trim(),
    name: data.applicantName.trim(),
    avatar: data.applicantAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
    agencyGid: data.agencyGid.trim(),
    agencyName: data.agencyName.trim(),
    country: data.country || 'المملكة العربية السعودية 🇸🇦',
    adminSupervisorId: data.adminSupervisorId.trim(),
    totalBroadcasters: 0,
    monthlyRevenueUsd: 0,
    totalDiamondsGenerated: 0,
    monthlyTargetDiamonds: data.monthlyTargetDiamonds || 5000000,
    agentCommissionRate: data.agentCommissionRate || 25,
    status: 'active',
    joinedDate: now,
    brokersList: []
  };

  allAgents.unshift(newAgent);
  saveOfficialAgents(allAgents);

  // Also assign role in Admin roles list
  assignAdminRole({
    id: newAgent.id,
    name: newAgent.name,
    avatar: newAgent.avatar,
    role: 'official_agent',
    agencyGid: newAgent.agencyGid,
    agencyName: newAgent.agencyName,
    notes: `وكيل رسمي تابع للإداري (${data.adminSupervisorId})`
  });

  logAuditEvent({
    action: 'دعوة وتعيين وكيل رسمي جديد',
    category: 'agency',
    actorId: data.adminSupervisorId,
    actorName: 'إداري الوكالات',
    targetId: newAgent.agencyGid,
    details: `تم توثيق وكالة ${newAgent.agencyName} (GID: ${newAgent.agencyGid}) بإشراف الإداري ${data.adminSupervisorId}`
  });

  return newAgent;
}

/**
 * إضافة وسيط جديد تحت وكالة / وكيل رسمي
 */
export function addNewBrokerToAgent(agencyGid: string, data: {
  brokerId: string;
  brokerName: string;
  brokerAvatar?: string;
  commissionRate?: number;
}): SubBrokerItem | null {
  const allAgents = getAllOfficialAgents();
  const agent = allAgents.find((ag) => ag.agencyGid === agencyGid || ag.id === agencyGid);
  if (!agent) return null;

  const now = new Date().toISOString().split('T')[0];
  const newBroker: SubBrokerItem = {
    id: data.brokerId.trim(),
    name: data.brokerName.trim(),
    avatar: data.brokerAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
    agencyGid: agent.agencyGid,
    agencyName: agent.agencyName,
    recruitedBroadcastersCount: 0,
    totalAgencyContribution: 0,
    brokerEarnings: 0,
    commissionRate: data.commissionRate || 15,
    joinedDate: now,
    status: 'active',
    broadcastersList: []
  };

  agent.brokersList.unshift(newBroker);
  saveOfficialAgents(allAgents);

  // Register broker in admin role service
  assignAdminRole({
    id: newBroker.id,
    name: newBroker.name,
    avatar: newBroker.avatar,
    role: 'broker',
    agencyGid: agent.agencyGid,
    agencyName: agent.agencyName,
    notes: `وسيط معتمد تحت وكالة ${agent.agencyName}`
  });

  logAuditEvent({
    action: 'إضافة وسيط معتمد جديد',
    category: 'agency',
    actorId: agent.id,
    actorName: agent.name,
    targetId: newBroker.id,
    details: `تم تسجيل الوسيط ${newBroker.name} تحت وكالة ${agent.agencyName} (GID: ${agent.agencyGid})`
  });

  return newBroker;
}

/**
 * حساب الإحصائيات التراكمية الشاملة للإداري
 */
export function calculateAdminAggregatedStats(adminId: string) {
  const agents = getAgentsForAdmin(adminId);
  const totalAgents = agents.length;
  let totalBrokers = 0;
  let totalBroadcasters = 0;
  let totalDiamonds = 0;
  let totalRevenueUsd = 0;
  let totalTargetDiamonds = 0;

  for (const ag of agents) {
    totalBrokers += ag.brokersList?.length || 0;
    totalBroadcasters += ag.totalBroadcasters || 0;
    totalDiamonds += ag.totalDiamondsGenerated || 0;
    totalRevenueUsd += ag.monthlyRevenueUsd || 0;
    totalTargetDiamonds += ag.monthlyTargetDiamonds || 0;
  }

  const targetPercentage = totalTargetDiamonds > 0 ? Math.min(100, Math.round((totalDiamonds / totalTargetDiamonds) * 100)) : 100;

  return {
    totalAgents,
    totalBrokers,
    totalBroadcasters,
    totalDiamonds,
    totalRevenueUsd,
    targetPercentage,
    agents
  };
}

export function calculateAgentAggregatedStats(agencyGid: string) {
  const agent = getAgentByGid(agencyGid);
  if (!agent) {
    return {
      agent: null,
      totalBrokers: 0,
      totalBroadcasters: 0,
      totalDiamonds: 0,
      monthlyRevenueUsd: 0,
      netCommissionUsd: 0,
      targetProgress: 0
    };
  }

  const totalBrokers = agent.brokersList?.length || 0;
  let totalBroadcasters = agent.totalBroadcasters || 0;
  let totalDiamonds = agent.totalDiamondsGenerated || 0;

  // recalculate from brokers if available
  if (agent.brokersList && agent.brokersList.length > 0) {
    let brokerBroadcastersSum = 0;
    let brokerDiamondsSum = 0;
    for (const b of agent.brokersList) {
      brokerBroadcastersSum += b.recruitedBroadcastersCount;
      brokerDiamondsSum += b.totalAgencyContribution;
    }
    if (brokerBroadcastersSum > totalBroadcasters) totalBroadcasters = brokerBroadcastersSum;
    if (brokerDiamondsSum > totalDiamonds) totalDiamonds = brokerDiamondsSum;
  }

  const monthlyRevenueUsd = agent.monthlyRevenueUsd || Math.round(totalDiamonds / 200);
  const netCommissionUsd = Math.round(monthlyRevenueUsd * (agent.agentCommissionRate / 100));
  const targetProgress = agent.monthlyTargetDiamonds > 0 
    ? Math.min(100, Math.round((totalDiamonds / agent.monthlyTargetDiamonds) * 100)) 
    : 100;

  return {
    agent,
    totalBrokers,
    totalBroadcasters,
    totalDiamonds,
    monthlyRevenueUsd,
    netCommissionUsd,
    targetProgress
  };
}

export function calculateBrokerAggregatedStats(brokerId: string) {
  const broker = getBrokerById(brokerId);
  if (!broker) {
    return {
      broker: null,
      recruitedBroadcastersCount: 0,
      totalAgencyContribution: 0,
      brokerEarnings: 0,
      totalStreamHours: 0,
      broadcastersList: []
    };
  }

  let totalStreamHours = 0;
  if (broker.broadcastersList) {
    for (const br of broker.broadcastersList) {
      totalStreamHours += br.streamHours || 0;
    }
  }

  return {
    broker,
    recruitedBroadcastersCount: broker.recruitedBroadcastersCount,
    totalAgencyContribution: broker.totalAgencyContribution,
    brokerEarnings: broker.brokerEarnings,
    totalStreamHours,
    broadcastersList: broker.broadcastersList || []
  };
}

export function getTestingUserId(): string {
  if (typeof window === 'undefined') return OWNER_DEV_ID;
  return localStorage.getItem(CURRENT_ACTIVE_USER_ID_KEY) || OWNER_DEV_ID;
}

