import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Users,
  Building2,
  Crown,
  Sparkles,
  Award,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Zap,
  Copy,
  Check,
  QrCode,
  Share2,
  ArrowUpRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Percent,
  DollarSign,
  Search,
  UserPlus,
  ExternalLink,
  Info,
  Calendar,
  Radio,
  Filter,
  ArrowRight,
  Lock,
  Unlock,
  ShieldAlert
} from 'lucide-react';

// Target Levels definition set by management (50 levels)
// Scaled incrementally from Level 1 (50,000 diamonds) up to Level 50 (50,000,000 diamonds)
const TARGET_LEVELS = Array.from({ length: 50 }, (_, i) => {
  const level = i + 1;
  // Gradual progressive diamond target curve
  const targetDiamonds = level <= 5 
    ? level * 50000 
    : level <= 10 
      ? 250000 + (level - 5) * 75000 
      : level <= 20 
        ? 625000 + (level - 10) * 150000 
        : level <= 35 
          ? 2125000 + (level - 20) * 350000 
          : 7375000 + (level - 35) * 800000;

  return {
    level,
    name: `المستوى ${level}`,
    targetDiamonds,
    label: `تارغت المستوى ${level}`
  };
});

// Helper to compute host target tier progression among 50 levels
function getHostTargetProgress(rawDiamonds: string | number | undefined, broadcastDays: number = 0, isClosed: boolean = false) {
  let diamonds = 0;
  if (typeof rawDiamonds === 'number') {
    diamonds = rawDiamonds;
  } else if (typeof rawDiamonds === 'string') {
    diamonds = parseInt(rawDiamonds.replace(/[^\d]/g, ''), 10) || 0;
  }

  const maxLevelObj = TARGET_LEVELS[TARGET_LEVELS.length - 1];

  // If host is explicitly closed or reached maximum level
  if (isClosed && diamonds >= maxLevelObj.targetDiamonds) {
    const prevThreshold = TARGET_LEVELS[TARGET_LEVELS.length - 2].targetDiamonds;
    const tierSpan = maxLevelObj.targetDiamonds - prevThreshold;
    return {
      currentLevel: 50,
      levelName: 'المستوى 50',
      isMaxLevel: true,
      currentProgressInLevel: 100,
      currentDiamondsInLevel: tierSpan,
      targetDiamondsInLevel: tierSpan,
      totalDiamonds: diamonds,
      nextLevelDiamonds: maxLevelObj.targetDiamonds,
      statusLabel: 'تم إنجاز التارغت الأقصى (المستوى 50) بنجاح ✓'
    };
  }

  let currentTierIndex = 0;
  for (let i = 0; i < TARGET_LEVELS.length; i++) {
    if (diamonds >= TARGET_LEVELS[i].targetDiamonds) {
      currentTierIndex = i + 1;
    } else {
      break;
    }
  }

  // If reached max level (50)
  if (currentTierIndex >= TARGET_LEVELS.length) {
    const prevThreshold = TARGET_LEVELS[TARGET_LEVELS.length - 2].targetDiamonds;
    const tierSpan = maxLevelObj.targetDiamonds - prevThreshold;
    return {
      currentLevel: 50,
      levelName: 'المستوى 50',
      isMaxLevel: true,
      currentProgressInLevel: 100,
      currentDiamondsInLevel: tierSpan,
      targetDiamondsInLevel: tierSpan,
      totalDiamonds: diamonds,
      nextLevelDiamonds: maxLevelObj.targetDiamonds,
      statusLabel: 'تم تسكير المستوى 50 بالكامل ✓'
    };
  }

  const prevThreshold = currentTierIndex === 0 ? 0 : TARGET_LEVELS[currentTierIndex - 1].targetDiamonds;
  const nextTarget = TARGET_LEVELS[currentTierIndex].targetDiamonds;
  const targetSpan = nextTarget - prevThreshold;
  const earnedInCurrentTier = Math.max(0, diamonds - prevThreshold);
  const percentage = Math.min(100, Math.round((earnedInCurrentTier / targetSpan) * 100));

  return {
    currentLevel: currentTierIndex + 1,
    levelName: TARGET_LEVELS[currentTierIndex].name,
    isMaxLevel: false,
    currentProgressInLevel: percentage,
    currentDiamondsInLevel: earnedInCurrentTier,
    targetDiamondsInLevel: targetSpan,
    totalDiamonds: diamonds,
    nextLevelDiamonds: nextTarget,
    statusLabel: `${percentage}% من تارغت ${TARGET_LEVELS[currentTierIndex].name}`
  };
}

export interface AgencyHost {
  id: string;
  name: string;
  avatar: string;
  joinDate: string;
  monthlyDiamonds: string;
  diamonds?: string;
  broadcastDays: number;
  requiredDays: number;
  isCompleted: boolean;
  liveHours?: string;
  liveDuration?: string;
  liveDays?: string;
  calculatedCommission?: string;
  completionRate?: string;
  targetPercentage?: number;
  targetAchieved?: boolean;
  isClosed?: boolean;
  tier?: string;
  // Ban / Lock status and permissions
  isBanned?: boolean;
  banReason?: string;
  banType?: 'regular' | 'promotion' | 'policy';
  banDate?: string;
  bannedBy?: string;
  canUnban?: boolean;
}

export interface RecruitedAgency {
  id: string;
  name: string;
  ownerName: string;
  ownerId: string;
  avatar: string;
  joinDate: string;
  hostsCount: number;
  monthlyDiamonds: string;
  monthlyRevenue: string;
  repCommission: string;
  status: string;
  hosts: AgencyHost[];
}

interface AgencyRepresentativeModalProps {
  isOpen: boolean;
  onClose: () => void;
  repId?: string;
  repName?: string;
  repAvatar?: string;
  isSuperAdmin?: boolean;
}

export const AgencyRepresentativeModal: React.FC<AgencyRepresentativeModalProps> = ({
  isOpen,
  onClose,
  repId = 'REP-9921',
  repName = 'المندوب الرسمي للوكالات',
  repAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  isSuperAdmin = true
}) => {
  const [currentSubView, setCurrentSubView] = useState<'main' | 'invite_agency' | 'my_agencies' | 'commissions' | 'invite_history' | 'rules' | 'agency_hosts'>('main');
  const [selectedAgencyForHosts, setSelectedAgencyForHosts] = useState<RecruitedAgency | null>(null);
  const [hostSearchQuery, setHostSearchQuery] = useState('');
  const [hostFilter, setHostFilter] = useState<'all' | 'active' | 'closed'>('active');
  const [activeAlert, setActiveAlert] = useState<string | null>(null);
  const [copiedInviteCode, setCopiedInviteCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [searchAgencyQuery, setSearchAgencyQuery] = useState('');

  // Ban Modal & Representative Unban Permission states
  const [selectedHostForBanModal, setSelectedHostForBanModal] = useState<AgencyHost | null>(null);
  // صلاحية فك البند الممنوحة للمندوب من رئيس الوكالة أو المبرمج السوبر أدمن
  const [repHasUnbanPermission, setRepHasUnbanPermission] = useState<boolean>(true);
  const [unbanNotes, setUnbanNotes] = useState<string>('');
  const [isProcessingUnban, setIsProcessingUnban] = useState<boolean>(false);

  // Reset to main view whenever modal is reopened
  useEffect(() => {
    if (isOpen) {
      setCurrentSubView('main');
      setSelectedAgencyForHosts(null);
      setHostSearchQuery('');
      setHostFilter('active');
      setSelectedHostForBanModal(null);
    }
  }, [isOpen]);

  // Form State for Inviting an Agency
  const [candidateUserId, setCandidateUserId] = useState('');
  const [candidateAgencyName, setCandidateAgencyName] = useState('');
  const [candidatePhone, setCandidatePhone] = useState('');
  const [candidateCountry, setCandidateCountry] = useState('المملكة العربية السعودية');

  // Recruited Agencies Data (الوكالات المستدعاة من قبل المندوب مع تفاصيل المذيعين الكاملة)
  const [recruitedAgencies, setRecruitedAgencies] = useState<RecruitedAgency[]>([
    {
      id: 'AG-9011',
      name: 'وكالة الصقور الملكية',
      ownerName: 'فيصل القحطاني',
      ownerId: '88721094',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      joinDate: '2026-06-12',
      hostsCount: 8,
      monthlyDiamonds: '1,450,000 💎',
      monthlyRevenue: '$ 14,500',
      repCommission: '$ 1,812.50',
      status: 'active',
      hosts: [
        {
          id: '81156183',
          name: 'صوت دجلة 🎤',
          avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
          joinDate: '2026-08-01 16:45:20',
          monthlyDiamonds: '89,200',
          diamonds: '89,200',
          liveDuration: '24 ساعة',
          liveDays: '12 يوم',
          broadcastDays: 12,
          requiredDays: 16,
          isCompleted: false,
          isClosed: false,
          calculatedCommission: '11,150',
          completionRate: '75% من التارغت',
          targetPercentage: 75,
          targetAchieved: false,
          isBanned: false
        },
        {
          id: '84419082',
          name: 'أمير النغم 🎼',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          joinDate: '2026-07-01 14:15:00',
          monthlyDiamonds: '55,400',
          diamonds: '55,400',
          liveDuration: '18 ساعة',
          liveDays: '9 يوم',
          broadcastDays: 9,
          requiredDays: 15,
          isCompleted: false,
          isClosed: false,
          calculatedCommission: '6,925',
          completionRate: '60% من التارغت',
          targetPercentage: 60,
          targetAchieved: false,
          // Banned Example 1: Regular ban (مبند - بند عادي)
          isBanned: true,
          banReason: 'مخالفة معايير محتوى البث المباشر (تكرار تشغيل مقاطع غير مرخصة أثناء البث)',
          banType: 'regular',
          banDate: '2026-08-28 14:30',
          bannedBy: 'قسم الرقابة والإشراف الآلي',
          canUnban: true
        },
        {
          id: '66920188',
          name: 'فهد البصري ⚔️',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
          joinDate: '2026-07-15 19:30:10',
          monthlyDiamonds: '42,800',
          diamonds: '42,800',
          liveDuration: '16 ساعة',
          liveDays: '8 يوم',
          broadcastDays: 8,
          requiredDays: 16,
          isCompleted: false,
          isClosed: false,
          calculatedCommission: '5,350',
          completionRate: '50% من التارغت',
          targetPercentage: 50,
          targetAchieved: false,
          // Banned Example 2: Promotional ban (بند ترويج)
          isBanned: true,
          banReason: 'ترويج روابط ومنصات خارجية مخالفة للوائح الوكالات الرسمية والمنصة',
          banType: 'promotion',
          banDate: '2026-08-29 21:10',
          bannedBy: 'إدارة أمن وحماية الوكالات',
          canUnban: true
        },
        {
          id: '99120411',
          name: 'سارة الكابيتانو 👑',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          joinDate: '2026-06-15 11:20:45',
          monthlyDiamonds: '450,000',
          diamonds: '450,000',
          liveDuration: '72 ساعة',
          liveDays: '24 يوم',
          broadcastDays: 24,
          requiredDays: 20,
          isCompleted: true,
          isClosed: true,
          calculatedCommission: '56,250',
          completionRate: '100% تسكير التارغت',
          targetPercentage: 100,
          targetAchieved: true
        },
        {
          id: '88410293',
          name: 'صقر الشام 🦅',
          avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
          joinDate: '2026-06-18 18:12:00',
          monthlyDiamonds: '320,000',
          diamonds: '320,000',
          liveDuration: '65 ساعة',
          liveDays: '21 يوم',
          broadcastDays: 21,
          requiredDays: 20,
          isCompleted: true,
          isClosed: true,
          calculatedCommission: '40,000',
          completionRate: '100% تسكير التارغت',
          targetPercentage: 100,
          targetAchieved: true
        },
        {
          id: '77102944',
          name: 'ريما الأسطورة 🌟',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
          joinDate: '2026-06-20 15:40:12',
          monthlyDiamonds: '280,000',
          diamonds: '280,000',
          liveDuration: '60 ساعة',
          liveDays: '20 يوم',
          broadcastDays: 20,
          requiredDays: 20,
          isCompleted: true,
          isClosed: true,
          calculatedCommission: '35,000',
          completionRate: '100% تسكير التارغت',
          targetPercentage: 100,
          targetAchieved: true
        },
        {
          id: '88129034',
          name: 'شيخ الشباب 💎',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          joinDate: '2026-06-01 10:00:30',
          monthlyDiamonds: '250,000',
          diamonds: '250,000',
          liveDuration: '58 ساعة',
          liveDays: '20 يوم',
          broadcastDays: 20,
          requiredDays: 20,
          isCompleted: true,
          isClosed: true,
          calculatedCommission: '31,250',
          completionRate: '100% تسكير التارغت',
          targetPercentage: 100,
          targetAchieved: true
        },
        {
          id: '77920144',
          name: 'نغم السعادة 🎵',
          avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
          joinDate: '2026-06-05 13:22:15',
          monthlyDiamonds: '210,000',
          diamonds: '210,000',
          liveDuration: '52 ساعة',
          liveDays: '20 يوم',
          broadcastDays: 20,
          requiredDays: 20,
          isCompleted: true,
          isClosed: true,
          calculatedCommission: '26,250',
          completionRate: '100% تسكير التارغت',
          targetPercentage: 100,
          targetAchieved: true
        }
      ]
    },
    {
      id: 'AG-8842',
      name: 'وكالة أساطير الخليج',
      ownerName: 'عبدالرحمن الدوسري',
      ownerId: '77215903',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
      joinDate: '2026-05-28',
      hostsCount: 29,
      monthlyDiamonds: '980,000 💎',
      monthlyRevenue: '$ 9,800',
      repCommission: '$ 1,225.00',
      status: 'active',
      hosts: [
        {
          id: '88129034',
          name: 'شيخ الشباب 💎',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          joinDate: '2026-06-01',
          monthlyDiamonds: '380,000 💎',
          broadcastDays: 22,
          requiredDays: 20,
          isCompleted: true,
          liveHours: '66 ساعة'
        },
        {
          id: '77920144',
          name: 'نغم السعادة 🎵',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
          joinDate: '2026-06-05',
          monthlyDiamonds: '290,000 💎',
          broadcastDays: 20,
          requiredDays: 20,
          isCompleted: true,
          liveHours: '61 ساعة'
        },
        {
          id: '66491023',
          name: 'جووري 🌹',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
          joinDate: '2026-06-12',
          monthlyDiamonds: '180,000 💎',
          broadcastDays: 16,
          requiredDays: 20,
          isCompleted: false,
          liveHours: '48 ساعة'
        },
        {
          id: '55810294',
          name: 'ساحر القوافي 📜',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
          joinDate: '2026-06-20',
          monthlyDiamonds: '130,000 💎',
          broadcastDays: 12,
          requiredDays: 20,
          isCompleted: false,
          liveHours: '36 ساعة'
        }
      ]
    },
    {
      id: 'AG-8510',
      name: 'وكالة قصر النجوم',
      ownerName: 'سعود الهاجري',
      ownerId: '91004822',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      joinDate: '2026-05-14',
      hostsCount: 18,
      monthlyDiamonds: '620,000 💎',
      monthlyRevenue: '$ 6,200',
      repCommission: '$ 775.00',
      status: 'active',
      hosts: [
        {
          id: '91024881',
          name: 'شمس الأصيل ☀️',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          joinDate: '2026-05-20',
          monthlyDiamonds: '310,000 💎',
          broadcastDays: 21,
          requiredDays: 20,
          isCompleted: true,
          liveHours: '64 ساعة'
        },
        {
          id: '88201944',
          name: 'أميرة القلوب 💖',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
          joinDate: '2026-05-25',
          monthlyDiamonds: '210,000 💎',
          broadcastDays: 20,
          requiredDays: 20,
          isCompleted: true,
          liveHours: '60 ساعة'
        },
        {
          id: '77310492',
          name: 'أثير الصمت 🌙',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          joinDate: '2026-06-02',
          monthlyDiamonds: '100,000 💎',
          broadcastDays: 9,
          requiredDays: 20,
          isCompleted: false,
          liveHours: '28 ساعة'
        }
      ]
    },
    {
      id: 'AG-8205',
      name: 'وكالة النور الذهبية',
      ownerName: 'خالد المطيري',
      ownerId: '83109455',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      joinDate: '2026-04-30',
      hostsCount: 35,
      monthlyDiamonds: '1,120,000 💎',
      monthlyRevenue: '$ 11,200',
      repCommission: '$ 1,400.00',
      status: 'active',
      hosts: [
        {
          id: '83109922',
          name: 'وردة الأمل 🌺',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
          joinDate: '2026-05-02',
          monthlyDiamonds: '490,000 💎',
          broadcastDays: 25,
          requiredDays: 20,
          isCompleted: true,
          liveHours: '75 ساعة'
        },
        {
          id: '77201984',
          name: 'ليلى الملكة 👑',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          joinDate: '2026-05-08',
          monthlyDiamonds: '360,000 💎',
          broadcastDays: 22,
          requiredDays: 20,
          isCompleted: true,
          liveHours: '68 ساعة'
        },
        {
          id: '66910482',
          name: 'سلطان القلوب 💫',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
          joinDate: '2026-05-15',
          monthlyDiamonds: '270,000 💎',
          broadcastDays: 18,
          requiredDays: 20,
          isCompleted: false,
          liveHours: '52 ساعة'
        }
      ]
    }
  ]);

  // Invitations History
  const [invitationsHistory, setInvitationsHistory] = useState([
    {
      id: 'INV-1092',
      targetName: 'سلطان الشمري (طلب فتح وكالة الفرسان)',
      targetId: '99218044',
      date: '2026-08-28 14:30',
      status: 'pending_head_approval',
      statusText: 'بانتظار توثيق رئيس الوكالات ⏳'
    },
    {
      id: 'INV-1088',
      targetName: 'ماجد الحربي (وكالة المجد)',
      targetId: '88102399',
      date: '2026-08-20 11:15',
      status: 'approved',
      statusText: 'تم التوثيق والاعتماد رسميًا ✅'
    },
    {
      id: 'INV-1075',
      targetName: 'ياسر العتيبي (وكالة بريق الماس)',
      targetId: '77491022',
      date: '2026-08-10 09:40',
      status: 'approved',
      statusText: 'تم التوثيق والاعتماد رسميًا ✅'
    }
  ]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setActiveAlert(msg);
    setTimeout(() => setActiveAlert(null), 3000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(`REP-${repId}-OFFICIAL`);
    setCopiedInviteCode(true);
    showToast('✅ تم نسخ كود استدعاء الوكلاء الرسمي');
    setTimeout(() => setCopiedInviteCode(false), 2500);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://app.superlegend.live/agency-invite?rep=${repId}&ref=official_agency_manager`);
    setCopiedLink(true);
    showToast('✅ تم نسخ رابط دعوة وتوثيق الوكالات');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // فك البند للمذيع (خاضع لسلطة المندوب على الوكالات المستدعاة وصلاحية الإدارة)
  const handleUnbanHost = (hostId: string) => {
    if (!selectedAgencyForHosts) return;

    // التحقق هل الوكالة مستدعاة من قبل المندوب
    const isAgencyRecruitedByRep = recruitedAgencies.some(ag => ag.id === selectedAgencyForHosts.id);
    if (!isAgencyRecruitedByRep && !isSuperAdmin) {
      showToast('⛔ لا يحق لك فك البند: هذا الحساب ليس تحت سلطتك أو في وكالاتك المستدعاة');
      return;
    }

    // التحقق من وجود صلاحية فك البند
    if (!repHasUnbanPermission && !isSuperAdmin) {
      showToast('⚠️ ليس لديك صلاحية فك البند. يرجى طلب الصلاحية من رئيس الوكالة أو السوبر أدمن');
      return;
    }

    setIsProcessingUnban(true);
    setTimeout(() => {
      // تحديث حالة المذيع في الوكالة
      setRecruitedAgencies(prevAgencies => 
        prevAgencies.map(ag => {
          if (ag.id !== selectedAgencyForHosts.id) return ag;
          const updatedHosts = ag.hosts.map(h => {
            if (h.id === hostId) {
              return {
                ...h,
                isBanned: false,
                banReason: undefined,
                banType: undefined,
                canUnban: false
              };
            }
            return h;
          });
          return {
            ...ag,
            hosts: updatedHosts
          };
        })
      );

      // تحديث الوكالة المحددة حالياً
      setSelectedAgencyForHosts(prev => {
        if (!prev) return null;
        return {
          ...prev,
          hosts: prev.hosts.map(h => h.id === hostId ? { ...h, isBanned: false, banReason: undefined } : h)
        };
      });

      setIsProcessingUnban(false);
      setSelectedHostForBanModal(null);
      setUnbanNotes('');
      showToast(`✅ تم فك البند بنجاح عن المذيع ID: ${hostId}`);
    }, 600);
  };

  const handleSendAgencyInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateUserId.trim() || !candidateAgencyName.trim()) {
      showToast('⚠️ يرجى إدخال معرف المستخدم واسم الوكالة');
      return;
    }

    const newInvite = {
      id: `INV-${Date.now().toString().slice(-4)}`,
      targetName: `${candidateAgencyName} (${candidateUserId})`,
      targetId: candidateUserId,
      date: 'الآن - 2026-08-30',
      status: 'pending_head_approval',
      statusText: 'تم الإرسال لرئيس الوكالات للاعتماد ⏳'
    };

    setInvitationsHistory([newInvite, ...invitationsHistory]);
    setCandidateUserId('');
    setCandidateAgencyName('');
    setCandidatePhone('');
    showToast('🚀 تم إرسال طلب استدعاء الوكالة لرئيس الوكالات الرسمية بنجاح');
  };

  const handleBack = () => {
    if (currentSubView === 'agency_hosts') {
      setCurrentSubView('my_agencies');
    } else {
      setCurrentSubView('main');
    }
  };

  const getSubViewTitle = () => {
    switch (currentSubView) {
      case 'invite_agency': return 'استدعاء وكيل رسمي جديد';
      case 'my_agencies': return `وكالاتي الرسمية المستدعاة (${recruitedAgencies.length})`;
      case 'commissions': return 'سجل الأرباح والعمولات المعتمدة';
      case 'invite_history': return 'سجل طلبات الاستدعاء والتوثيق';
      case 'rules': return 'شروط وصلاحيات مندوب الوكالات';
      case 'agency_hosts': return `مذيعي ${selectedAgencyForHosts?.name || 'الوكالة'}`;
      default: return 'مركز مندوب الوكالات الرسمية';
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[100] w-full h-full min-h-screen bg-[#F7F4EE] flex flex-col overflow-y-auto select-none font-sans"
      dir="rtl"
    >
      {/* Toast Alert matching Broadcaster Center Gold Banner */}
      <AnimatePresence>
        {activeAlert && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-14 left-1/2 -translate-x-1/2 z-[110] bg-gradient-to-r from-[#7A5210] via-[#A87B28] to-[#5C3C0B] text-white px-5 py-2.5 rounded-full text-xs font-black shadow-[0_10px_30px_rgba(122,82,16,0.4)] border border-[#FFE29A]/50 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-200 animate-pulse" />
            <span>{activeAlert}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Header Bar (Frosted Glass with Warm Gold Accents matching Broadcaster Center) */}
      <div className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl px-4 py-3 flex items-center justify-between border-b border-[#E8DFC8] shadow-[0_4px_20px_rgba(180,160,130,0.08)]">
        {/* Right Side in RTL: Back Button or Shield Badge */}
        <div className="flex items-center gap-2">
          {currentSubView === 'agency_hosts' ? (
            <button 
              onClick={handleBack}
              className="flex items-center gap-1.5 text-xs font-black text-slate-700 hover:text-slate-900 cursor-pointer active:scale-95 transition-transform"
            >
              <ArrowRight className="w-4 h-4" />
              <span>رجوع</span>
            </button>
          ) : currentSubView !== 'main' ? (
            <button 
              onClick={handleBack}
              className="p-1.5 hover:bg-[#F5EFE0] active:scale-95 rounded-full text-[#7A5210] transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
            >
              <ChevronRight className="w-5 h-5" />
              <span>رجوع</span>
            </button>
          ) : (
            <div className="px-2.5 py-1 rounded-full bg-[#FAF5E8] border border-[#E2B755]/50 text-[#7A5210] text-[11px] font-black flex items-center gap-1 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#B38022]" />
              <span>إشراف رئيس الوكالات (سالم الكعبي)</span>
            </div>
          )}
        </div>

        {/* Center: Title */}
        {currentSubView === 'agency_hosts' ? (
          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5">
              <h1 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                مركز المذيعين
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-teal-50 text-teal-700 border border-teal-200 flex items-center gap-1">
                <span>مندوب</span>
                <span>💎</span>
              </span>
            </div>
            {selectedAgencyForHosts && (
              <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-slate-500 mt-0.5">
                <span>صلاحية ممنوحة من:</span>
                <strong className="text-teal-700 font-black">{selectedAgencyForHosts.name}</strong>
                <span className="text-slate-400 font-mono font-bold">(GID: {selectedAgencyForHosts.id})</span>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#96743A]" />
            <h1 className="text-base sm:text-lg font-black text-[#5C3F13] tracking-tight font-serif">
              {getSubViewTitle()}
            </h1>
          </div>
        )}

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="p-1.5 hover:bg-slate-100 active:scale-95 rounded-full text-slate-500 hover:text-slate-900 transition-all cursor-pointer"
          title="إغلاق"
        >
          <X className="w-5 h-5 stroke-[2.2]" />
        </button>
      </div>

      {/* Main View Matching Exact Ultra-Realistic Frosted Glass & Gold Aesthetic */}
      {currentSubView === 'main' && (
        <div className="w-full max-w-lg mx-auto p-4 space-y-3.5 pb-16 flex-1">

          {/* ========================================================= */}
          {/* 1. HERO BOX: Ultra-Realistic Frosted Glass & Gold Card */}
          {/* ========================================================= */}
          <div className="relative overflow-hidden rounded-[32px] bg-white/85 backdrop-blur-2xl border border-white/95 p-4 sm:p-5 shadow-[0_20px_50px_rgba(180,160,130,0.18),0_4px_12px_rgba(0,0,0,0.03),inset_0_2px_4px_rgba(255,255,255,1)]">
            <div className="absolute top-3 left-3 opacity-20 text-[#96743A]">
              <Crown className="w-8 h-8" />
            </div>

            {/* Top Row: Rep Profile Info + Invite Button */}
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-13 h-13 rounded-full p-[2.5px] bg-gradient-to-tr from-[#FFF2B8] via-[#E2B755] to-[#7A5210] shadow-[0_4px_10px_rgba(179,128,34,0.3)]">
                    <img 
                      src={repAvatar} 
                      alt={repName} 
                      className="w-full h-full rounded-full object-cover bg-slate-900 border border-white/80"
                    />
                  </div>
                  <div className="absolute -inset-0.5 rounded-full border border-[#E2B755]/40 pointer-events-none" />
                </div>

                <div className="text-right">
                  <div className="text-base font-black text-[#5C3F13] leading-tight flex items-center gap-1.5">
                    <span>{repName}</span>
                    <span className="text-[10px] bg-gradient-to-r from-[#B38022] to-[#7A5210] text-white px-2 py-0.5 rounded-full font-black">
                      مندوب معتمد 🔱
                    </span>
                  </div>
                  <div className="text-xs font-bold font-mono text-[#8C6B38] mt-0.5" dir="ltr">
                    ID: {repId}
                  </div>
                </div>
              </div>

              {/* Quick Invite Button */}
              <button 
                onClick={() => setCurrentSubView('invite_agency')}
                className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#B38022] via-[#C99836] to-[#7A5210] text-white text-xs font-black shadow-[0_4px_12px_rgba(179,128,34,0.3)] hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center gap-1"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>استدعاء وكيل</span>
              </button>
            </div>

            {/* Rep Metrics Bar in Gold styling */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-3.5 border-t border-[#E8DFC8]/60 text-center">
              <div 
                onClick={() => setCurrentSubView('my_agencies')}
                className="bg-[#FAF6EC]/80 rounded-2xl p-2 border border-[#EAE0CD]/80 cursor-pointer hover:bg-white transition-colors"
              >
                <span className="text-[10px] font-bold text-[#8C6B38] block">الوكالات المستدعاة</span>
                <span className="text-sm font-black text-[#5C3F13] font-mono mt-0.5 block">{recruitedAgencies.length} وكالة</span>
              </div>
              <div 
                onClick={() => setCurrentSubView('commissions')}
                className="bg-[#FAF6EC]/80 rounded-2xl p-2 border border-[#EAE0CD]/80 cursor-pointer hover:bg-white transition-colors"
              >
                <span className="text-[10px] font-bold text-[#8C6B38] block">نسبة مشاركة الأرباح</span>
                <span className="text-sm font-black text-[#B38022] font-mono mt-0.5 block">12.5%</span>
              </div>
              <div 
                onClick={() => setCurrentSubView('commissions')}
                className="bg-[#FAF6EC]/80 rounded-2xl p-2 border border-[#EAE0CD]/80 cursor-pointer hover:bg-white transition-colors"
              >
                <span className="text-[10px] font-bold text-[#8C6B38] block">إجمالي أرباح المندوب</span>
                <span className="text-sm font-black text-emerald-600 font-mono mt-0.5 block">$ 5,212</span>
              </div>
            </div>

            {/* Authority notice from Head of Agencies */}
            <div className="mt-3 p-2.5 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50/60 border border-amber-200/80 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-2 text-[#7A5210]">
                <Info className="w-4 h-4 text-[#B38022] shrink-0" />
                <span className="font-bold">الصلاحية ونسب الأرباح مفتوحة ومعتمدة من رئيس الوكالات الرسمية</span>
              </div>
              <span className="text-[10px] bg-amber-200/70 text-amber-900 font-black px-2 py-0.5 rounded-md">
                توثيق رسمي ✓
              </span>
            </div>
          </div>

          {/* ========================================================= */}
          {/* 2. RECRUITMENT & INVITATION CODE CARD (Warm Frosted Style) */}
          {/* ========================================================= */}
          <div className="rounded-[28px] bg-white/90 backdrop-blur-xl border border-[#EAE0CD] p-4 shadow-[0_10px_30px_rgba(180,160,130,0.1)] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#FAF5E8] border border-[#E2B755]/50 flex items-center justify-center text-[#7A5210]">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-[#5C3F13]">كود ورابط استدعاء الوكالات</h3>
                  <span className="text-[10px] text-[#8C6B38] font-bold">يمنح الوكيل المستدعى التوثيق المباشر تحت إشرافك</span>
                </div>
              </div>
              <button 
                onClick={handleCopyLink}
                className="p-2 rounded-xl bg-[#FAF5E8] border border-[#E2B755]/50 text-[#7A5210] hover:bg-white transition-all cursor-pointer"
                title="مشاركة الرابط"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* Code Box */}
            <div className="p-3 bg-[#FAF8F3] rounded-2xl border border-[#EAE0CD] flex items-center justify-between">
              <div className="text-right">
                <span className="text-[10px] text-[#8C6B38] font-bold block">كود المندوب الخاص بك:</span>
                <span className="text-sm font-black font-mono text-[#5C3F13]" dir="ltr">
                  REP-{repId}-OFFICIAL
                </span>
              </div>
              <button
                onClick={handleCopyCode}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#B38022] to-[#7A5210] text-white font-black text-xs flex items-center gap-1.5 shadow-2xs hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              >
                {copiedInviteCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedInviteCode ? 'تم النسخ' : 'نسخ الكود'}</span>
              </button>
            </div>
          </div>

          {/* ========================================================= */}
          {/* 3. MAIN ACTION GRID (4 Royal Action Cards) */}
          {/* ========================================================= */}
          <div className="grid grid-cols-2 gap-2.5">
            
            {/* Card 1: استدعاء وكيل رسمي جديد */}
            <div 
              onClick={() => setCurrentSubView('invite_agency')}
              className="p-3.5 rounded-2xl bg-white/90 backdrop-blur-md border border-[#EAE0CD] hover:border-[#B38022] shadow-2xs cursor-pointer group transition-all space-y-2"
            >
              <div className="w-9 h-9 rounded-xl bg-[#FAF5E8] border border-[#E2B755]/50 flex items-center justify-center text-[#7A5210] group-hover:scale-105 transition-transform">
                <UserPlus className="w-5 h-5 text-[#B38022]" />
              </div>
              <div>
                <h4 className="text-xs font-black text-[#5C3F13] flex items-center justify-between">
                  <span>استدعاء وكيل جديد</span>
                  <ChevronLeft className="w-3.5 h-3.5 text-[#8C6B38] group-hover:-translate-x-0.5 transition-transform" />
                </h4>
                <span className="text-[10px] text-[#8C6B38] font-bold block mt-0.5">
                  إرسال طلب فتح وكالة جديدة
                </span>
              </div>
            </div>

            {/* Card 2: وكالاتي المستدعاة */}
            <div 
              onClick={() => setCurrentSubView('my_agencies')}
              className="p-3.5 rounded-2xl bg-white/90 backdrop-blur-md border border-[#EAE0CD] hover:border-[#B38022] shadow-2xs cursor-pointer group transition-all space-y-2"
            >
              <div className="w-9 h-9 rounded-xl bg-[#FAF5E8] border border-[#E2B755]/50 flex items-center justify-center text-[#7A5210] group-hover:scale-105 transition-transform">
                <Building2 className="w-5 h-5 text-[#B38022]" />
              </div>
              <div>
                <h4 className="text-xs font-black text-[#5C3F13] flex items-center justify-between">
                  <span>وكالاتي المستدعاة</span>
                  <span className="text-[10px] font-mono bg-[#FAF5E8] px-1.5 py-0.2 rounded text-[#7A5210] font-black">{recruitedAgencies.length}</span>
                </h4>
                <span className="text-[10px] text-[#8C6B38] font-bold block mt-0.5">
                  أداء ومبيعات ومذيعي الوكالات
                </span>
              </div>
            </div>

            {/* Card 3: سجل الأرباح والعمولات */}
            <div 
              onClick={() => setCurrentSubView('commissions')}
              className="p-3.5 rounded-2xl bg-white/90 backdrop-blur-md border border-[#EAE0CD] hover:border-[#B38022] shadow-2xs cursor-pointer group transition-all space-y-2"
            >
              <div className="w-9 h-9 rounded-xl bg-[#FAF5E8] border border-[#E2B755]/50 flex items-center justify-center text-[#7A5210] group-hover:scale-105 transition-transform">
                <TrendingUp className="w-5 h-5 text-[#B38022]" />
              </div>
              <div>
                <h4 className="text-xs font-black text-[#5C3F13] flex items-center justify-between">
                  <span>سجل الأرباح والعمولات</span>
                  <ChevronLeft className="w-3.5 h-3.5 text-[#8C6B38] group-hover:-translate-x-0.5 transition-transform" />
                </h4>
                <span className="text-[10px] text-[#8C6B38] font-bold block mt-0.5">
                  مشاركة الأرباح من رئيس الوكالات
                </span>
              </div>
            </div>

            {/* Card 4: سجل الدعوات والتوثيق */}
            <div 
              onClick={() => setCurrentSubView('invite_history')}
              className="p-3.5 rounded-2xl bg-white/90 backdrop-blur-md border border-[#EAE0CD] hover:border-[#B38022] shadow-2xs cursor-pointer group transition-all space-y-2"
            >
              <div className="w-9 h-9 rounded-xl bg-[#FAF5E8] border border-[#E2B755]/50 flex items-center justify-center text-[#7A5210] group-hover:scale-105 transition-transform">
                <Clock className="w-5 h-5 text-[#B38022]" />
              </div>
              <div>
                <h4 className="text-xs font-black text-[#5C3F13] flex items-center justify-between">
                  <span>سجل الاستدعاء والتوثيق</span>
                  <ChevronLeft className="w-3.5 h-3.5 text-[#8C6B38] group-hover:-translate-x-0.5 transition-transform" />
                </h4>
                <span className="text-[10px] text-[#8C6B38] font-bold block mt-0.5">
                  حالة قبول طلبات الوكلاء
                </span>
              </div>
            </div>

          </div>

          {/* ========================================================= */}
          {/* 4. RULES & GUIDELINES BANNER */}
          {/* ========================================================= */}
          <div 
            onClick={() => setCurrentSubView('rules')}
            className="p-3 bg-gradient-to-r from-[#FFFDF9] via-[#FAF5E8] to-[#FFF9ED] rounded-2xl border border-[#E8DFC8] flex items-center justify-between cursor-pointer hover:border-[#B38022] transition-all shadow-2xs"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#FAF5E8] border border-[#E2B755]/50 flex items-center justify-center text-[#7A5210]">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-black text-[#5C3F13] block">لوائح وشروط مندوب الوكالات المعتمدة</span>
                <span className="text-[10px] text-[#8C6B38]">صادرة وموقعة من رئيس الوكالات الرسمية</span>
              </div>
            </div>
            <ChevronLeft className="w-4 h-4 text-[#8C6B38]" />
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-VIEW 1: استدعاء وكيل رسمي جديد */}
      {/* ========================================================= */}
      {currentSubView === 'invite_agency' && (
        <div className="w-full max-w-lg mx-auto p-4 space-y-4 pb-16 flex-1">
          <div className="p-4.5 rounded-[28px] bg-white/95 backdrop-blur-xl border border-[#EAE0CD] shadow-[0_10px_30px_rgba(180,160,130,0.12)] space-y-3.5">
            <div className="flex items-center gap-2 pb-3 border-b border-[#EAE0CD]">
              <div className="w-8 h-8 rounded-xl bg-[#FAF5E8] border border-[#E2B755]/50 flex items-center justify-center text-[#7A5210]">
                <UserPlus className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black text-[#5C3F13]">نموذج استدعاء وكالة رسمية جديدة</h3>
                <span className="text-[10px] text-[#8C6B38]">سيتم توجيه الطلب مباشرة إلى رئيس الوكالات للموافقة والتوثيق</span>
              </div>
            </div>

            <form onSubmit={handleSendAgencyInvite} className="space-y-3">
              <div>
                <label className="block text-[11px] font-black text-[#5C3F13] mb-1">معرف المستخدم (User ID) لصاحب الوكالة:</label>
                <input
                  type="text"
                  placeholder="مثال: 95481023"
                  value={candidateUserId}
                  onChange={(e) => setCandidateUserId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#FAF8F3] border border-[#D6C5A2] text-xs text-[#5C3F13] font-mono font-bold focus:outline-none focus:border-[#B38022]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black text-[#5C3F13] mb-1">اسم الوكالة المقترح:</label>
                <input
                  type="text"
                  placeholder="مثال: وكالة النخبة الذهبية"
                  value={candidateAgencyName}
                  onChange={(e) => setCandidateAgencyName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#FAF8F3] border border-[#D6C5A2] text-xs text-[#5C3F13] font-bold focus:outline-none focus:border-[#B38022]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-black text-[#5C3F13] mb-1">الدولة:</label>
                  <select
                    value={candidateCountry}
                    onChange={(e) => setCandidateCountry(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#FAF8F3] border border-[#D6C5A2] text-xs text-[#5C3F13] font-bold focus:outline-none focus:border-[#B38022]"
                  >
                    <option value="المملكة العربية السعودية">المملكة العربية السعودية</option>
                    <option value="الإمارات العربية المتحدة">الإمارات العربية المتحدة</option>
                    <option value="الكويت">الكويت</option>
                    <option value="قطر">قطر</option>
                    <option value="مصر">مصر</option>
                    <option value="العراق">العراق</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-black text-[#5C3F13] mb-1">رقم الهاتف / الواتساب:</label>
                  <input
                    type="text"
                    placeholder="+966 5X XXX XXXX"
                    value={candidatePhone}
                    onChange={(e) => setCandidatePhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#FAF8F3] border border-[#D6C5A2] text-xs text-[#5C3F13] font-mono font-bold focus:outline-none focus:border-[#B38022]"
                  />
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#FAF5E8] border border-[#E2B755]/40 text-[10px] text-[#7A5210] font-bold leading-relaxed">
                ℹ️ بمجرد إرسال الطلب، يحصل الوكيل على إشعار بالدعوة، ويتم إدراج الوكالة مباشرة تحت شجرة أرباحك وعمولاتك بعد توثيق رئيس الوكالات.
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#B38022] via-[#C99836] to-[#7A5210] text-white font-black text-xs shadow-md hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>إرسال طلب الاستدعاء والتوثيق الرسمي 🚀</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-VIEW 2: وكالاتي الرسمية المستدعاة */}
      {/* ========================================================= */}
      {currentSubView === 'my_agencies' && (
        <div className="w-full max-w-lg mx-auto p-4 space-y-3 pb-16 flex-1">
          {/* Search bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="البحث عن وكالة أو ID صاحب الوكالة..."
              value={searchAgencyQuery}
              onChange={(e) => setSearchAgencyQuery(e.target.value)}
              className="w-full p-2.5 pr-9 rounded-xl bg-white border border-[#D6C5A2] text-xs text-[#5C3F13] font-bold focus:outline-none focus:border-[#B38022]"
            />
            <Search className="w-4 h-4 text-[#8C6B38] absolute right-3 top-3" />
          </div>

          <div className="space-y-3">
            {recruitedAgencies
              .filter(ag => ag.name.includes(searchAgencyQuery) || ag.ownerId.includes(searchAgencyQuery))
              .map((ag) => (
                <div
                  key={ag.id}
                  className="p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-[#EAE0CD] shadow-2xs space-y-3 hover:border-[#D6C5A2] transition-all"
                >
                  <div className="flex items-center justify-between pb-2.5 border-b border-[#EAE0CD]">
                    <div className="flex items-center gap-3">
                      <img 
                        src={ag.avatar} 
                        alt={ag.name} 
                        className="w-12 h-12 rounded-full object-cover border border-[#E2B755]/50 shadow-sm"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-black text-[#5C3F13]">{ag.name}</h4>
                          <span className="text-[9px] bg-[#FAF5E8] border border-[#E2B755] text-[#7A5210] px-1.5 py-0.2 rounded font-black">
                            {ag.id}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#8C6B38] font-bold block mt-0.5">
                          صاحب الوكالة: {ag.ownerName} (ID: {ag.ownerId})
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-300 font-black px-2 py-0.5 rounded-full">
                      موثقة ونشطة ✓
                    </span>
                  </div>

                  {/* Financial & Performance Stats Grid */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    {/* قسم/أيقونة المذيعين بالوكالة (تفاعلي يفتح شاشة مذيعي الوكالة) */}
                    <div 
                      onClick={() => {
                        setSelectedAgencyForHosts(ag);
                        setCurrentSubView('agency_hosts');
                      }}
                      className="p-2.5 rounded-xl bg-gradient-to-b from-[#FAF5E8] to-[#F5EFE0] hover:bg-white border border-[#E2B755] hover:border-[#B38022] cursor-pointer transition-all shadow-2xs group/hosts active:scale-95"
                      title="اضغط لعرض تفاصيل مذيعي الوكالة"
                    >
                      <div className="flex items-center justify-center gap-1 text-[10px] text-[#7A5210] font-black">
                        <Users className="w-3.5 h-3.5 text-[#B38022]" />
                        <span>المذيعين بالوكالة</span>
                      </div>
                      <span className="font-black font-mono text-sm text-[#5C3F13] block mt-0.5">{ag.hostsCount} مذيع</span>
                      <span className="text-[8.5px] bg-gradient-to-r from-[#B38022] to-[#7A5210] text-white font-extrabold px-1.5 py-0.5 rounded-full inline-block mt-1 shadow-2xs group-hover/hosts:scale-105 transition-transform">
                        عرض المذيعين 👈
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-[#FAF8F3] border border-[#EAE0CD] flex flex-col justify-center">
                      <span className="text-[10px] text-[#8C6B38] block">إجمالي دخل الوكالة</span>
                      <span className="font-black font-mono text-[#B38022] text-xs mt-0.5">{ag.monthlyRevenue}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-emerald-50/80 border border-emerald-200 flex flex-col justify-center">
                      <span className="text-[10px] text-emerald-800 block">عمولتك (12.5%)</span>
                      <span className="font-black font-mono text-emerald-700 text-xs mt-0.5">{ag.repCommission}</span>
                    </div>
                  </div>

                  {/* زر مخصص لاستعراض مذيعي الوكالة */}
                  <button
                    onClick={() => {
                      setSelectedAgencyForHosts(ag);
                      setCurrentSubView('agency_hosts');
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#FAF5E8] via-[#FFFDF7] to-[#FAF5E8] border border-[#E2B755]/70 hover:border-[#B38022] hover:bg-white text-[#7A5210] font-black text-xs flex items-center justify-between transition-all cursor-pointer shadow-2xs group active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-[#FAF5E8] border border-[#E2B755]/60 flex items-center justify-center text-[#B38022] group-hover:scale-105 transition-transform">
                        <Users className="w-3.5 h-3.5" />
                      </div>
                      <span>مذيعي الوكالة ({ag.hostsCount} مذيع)</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-[#B38022]">
                      <span>عرض التفاصيل وأيام البث</span>
                      <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    </div>
                  </button>

                  <div className="flex items-center justify-between pt-1 text-[10px] text-[#8C6B38] border-t border-[#EAE0CD]/60">
                    <span>تاريخ الاستدعاء: {ag.joinDate}</span>
                    <span className="font-mono font-bold text-[#7A5210]">الماس الشهري: {ag.monthlyDiamonds}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-VIEW: شاشة تفاصيل مذيعي الوكالة (مطابقة لتصميم مركز المذيعين للوسيط) */}
      {/* ========================================================= */}
      {currentSubView === 'agency_hosts' && selectedAgencyForHosts && (
        <div className="w-full max-w-lg mx-auto p-3.5 sm:p-4 space-y-3 pb-20 flex-1">
          {/* بطاقة توضيح سلطة المندوب وصلاحية فك البند */}
          <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <div>
                  <span className="text-xs font-black text-slate-800 block leading-none">
                    وكالة مستدعاة تحت سلطتك
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    {selectedAgencyForHosts.name} (كود: {selectedAgencyForHosts.id})
                  </span>
                </div>
              </div>

              {/* حالة صلاحية فك البند من الإدارة */}
              <button
                onClick={() => {
                  setRepHasUnbanPermission(!repHasUnbanPermission);
                  showToast(!repHasUnbanPermission 
                    ? 'تم تفعيل صلاحية فك البند (من رئيس الوكالة / السوبر أدمن)' 
                    : 'تم إيقاف صلاحية فك البند للمندوب');
                }}
                className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border transition-all cursor-pointer flex items-center gap-1 shadow-2xs ${
                  repHasUnbanPermission
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}
                title="اضغط لتجربة التبديل بين وجود الصلاحية أو سحبها"
              >
                <ShieldCheck className="w-3 h-3" />
                <span>{repHasUnbanPermission ? 'صلاحية فك البند: مفعلة' : 'صلاحية فك البند: مسحوبة'}</span>
              </button>
            </div>
          </div>

          {/* شريط البحث وتصفية المذيعين المطابق للصورة */}
          <div className="space-y-2">
            {/* أزرار التصفية: الكل - النشطين - التسكيرات */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-200/80 p-1 rounded-xl text-xs font-bold shadow-2xs">
              <button
                onClick={() => setHostFilter('all')}
                className={`flex-1 py-2 rounded-lg text-center transition-all cursor-pointer ${
                  hostFilter === 'all'
                    ? 'bg-[#104D5B] text-white shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                الكل ({selectedAgencyForHosts.hosts.length})
              </button>
              <button
                onClick={() => setHostFilter('active')}
                className={`flex-1 py-2 rounded-lg text-center transition-all cursor-pointer ${
                  hostFilter === 'active'
                    ? 'bg-emerald-600 text-white shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                النشطين ({selectedAgencyForHosts.hosts.filter(h => !h.isClosed).length})
              </button>
              <button
                onClick={() => setHostFilter('closed')}
                className={`flex-1 py-2 rounded-lg text-center transition-all cursor-pointer ${
                  hostFilter === 'closed'
                    ? 'bg-slate-900 text-white shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                التسكيرات ({selectedAgencyForHosts.hosts.filter(h => h.isClosed).length})
              </button>
            </div>

            {/* حقل البحث */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="بحث عن مذيع باسمه أو الـ ID..."
                value={hostSearchQuery}
                onChange={(e) => setHostSearchQuery(e.target.value)}
                className="w-full pl-3 pr-9 py-2.5 bg-white border border-slate-200/90 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-teal-500 shadow-2xs transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* قائمة كروت المذيعين المطابقة 100% للتصميم المرفق */}
          <div className="space-y-3 pt-1">
            {selectedAgencyForHosts.hosts
              .filter(host => {
                const matchesQuery = 
                  host.name.toLowerCase().includes(hostSearchQuery.toLowerCase()) || 
                  host.id.includes(hostSearchQuery);
                const matchesFilter = 
                  hostFilter === 'all' ? true :
                  hostFilter === 'active' ? !host.isClosed :
                  host.isClosed;
                return matchesQuery && matchesFilter;
              })
              .map((host) => {
                const targetInfo = getHostTargetProgress(host.monthlyDiamonds || host.diamonds, host.broadcastDays, host.isClosed);
                return (
                <div
                  key={host.id}
                  className="bg-white rounded-2xl p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.05)] border border-slate-200/90 space-y-3 relative"
                >
                  {/* Top Row: Left Status Pill & Ban Lock Indicator | Right Broadcaster Info */}
                  <div className="flex items-center justify-between">
                    {/* Left: Status Pill + Ban Lock Button (مربع القفل الصغير) */}
                    <div className="flex items-center gap-1.5">
                      {/* زر إشارة القفل الصغير الخاص بالبند */}
                      {host.isBanned ? (
                        <button
                          onClick={() => setSelectedHostForBanModal(host)}
                          className="w-7 h-7 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95 group relative"
                          title="حساب المذيع مبند - اضغط لمعرفة سبب البند وفك البند"
                        >
                          <Lock className="w-3.5 h-3.5 animate-bounce" />
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 absolute -top-0.5 -right-0.5 ring-2 ring-white"></span>
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedHostForBanModal(host)}
                          className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-all cursor-pointer active:scale-95"
                          title="حالة الحساب: غير مبند (نظامي)"
                        >
                          <Unlock className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Status Pill on the Left */}
                      {host.isClosed ? (
                        <div className="px-3 py-1.5 rounded-xl bg-slate-900 text-white flex items-center gap-1.5 shadow-xs">
                          <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                          <div className="text-right">
                            <span className="text-[10px] font-black block leading-none">مغلق</span>
                            <span className="text-[8px] text-slate-300 font-mono block mt-0.5">تسكير الهدف</span>
                          </div>
                        </div>
                      ) : (
                        <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center gap-1.5 shadow-xs">
                          <span className="text-xs font-black">✓ نشط ويبث</span>
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        </div>
                      )}
                    </div>

                    {/* Broadcaster Avatar & Name & ID on the Right */}
                    <div className="flex items-center gap-3.5">
                      <div className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {host.isBanned && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-rose-100 text-rose-700 border border-rose-200">
                              مبند
                            </span>
                          )}
                          <h4 className="text-sm sm:text-base font-black text-slate-900 leading-tight">
                            {host.name}
                          </h4>
                        </div>
                        <div className="flex items-center justify-end gap-1 mt-0.5">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(host.id);
                              showToast(`تم نسخ ID المذيع: ${host.id}`);
                            }}
                            className="text-slate-400 hover:text-teal-600 p-0.5 rounded cursor-pointer"
                            title="نسخ معرف ID"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-mono text-slate-500 font-bold block" dir="ltr">
                            ID: {host.id}
                          </span>
                        </div>
                      </div>

                      <div className="relative">
                        <img 
                          src={host.avatar} 
                          alt={host.name} 
                          className="w-12 h-12 rounded-full object-cover border border-slate-100 shadow-xs"
                        />
                        {host.isBanned && (
                          <div className="absolute -bottom-1 -left-1 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center border-2 border-white shadow-xs">
                            <Lock className="w-2.5 h-2.5" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Performance Breakdown */}
                  <div className="pt-3 border-t border-slate-100 space-y-2.5 text-xs font-bold">
                    {/* وقت الانضمام للوكالة */}
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 text-xs">وقت الانضمام للوكالة:</span>
                      <span className="text-slate-800 font-mono text-xs font-bold" dir="ltr">
                        {host.joinDate}
                      </span>
                    </div>

                    {/* الماس المستلم شهرياً */}
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 text-xs">الماس المستلم شهرياً:</span>
                      <div className="flex items-center gap-1" dir="ltr">
                        <span className="text-slate-900 font-mono font-black text-sm">
                          {host.monthlyDiamonds || host.diamonds}
                        </span>
                        <span className="text-blue-500 text-xs">💎</span>
                      </div>
                    </div>

                    {/* شبكة الساعات والأيام */}
                    <div className="grid grid-cols-2 gap-2 pt-0.5">
                      <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 flex items-center justify-between">
                        <span className="text-slate-600 text-[11px]">مدة البث (الساعات):</span>
                        <span className="text-sky-600 font-black text-xs font-mono">
                          {host.liveHours || host.liveDuration || '24 ساعة'}
                        </span>
                      </div>

                      <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 flex items-center justify-between">
                        <span className="text-slate-600 text-[11px]">أيام البث الفعلية:</span>
                        <span className="text-indigo-600 font-black text-xs font-mono">
                          {host.liveDays || `${host.broadcastDays} يوم`}
                        </span>
                      </div>
                    </div>

                    {/* شريط ومستويات التارغت الـ 50 المعتمدة من الإدارة (مع تمرير أفقي) */}
                    <div className="bg-slate-50/80 border border-slate-200/90 rounded-2xl p-3 space-y-2">
                      {/* رأس التارغت: المستوى الحالي ومؤشر الإنجاز */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-600 text-white flex items-center justify-center text-[10px] font-black shadow-2xs">
                            {targetInfo.currentLevel}
                          </span>
                          <div>
                            <span className="text-[11px] font-black text-slate-800 block leading-tight">
                              تارغت {targetInfo.levelName} (من 50 مستوى)
                            </span>
                            <span className="text-[9px] text-slate-500 block font-normal">
                              معتمد من إدارة الوكالات
                            </span>
                          </div>
                        </div>

                        <div className="text-left">
                          <span className={`text-xs font-black font-mono block ${
                            targetInfo.isMaxLevel ? 'text-emerald-600' : 'text-amber-600'
                          }`}>
                            {targetInfo.isMaxLevel ? '100%' : `${targetInfo.currentProgressInLevel}%`}
                          </span>
                          <span className="text-[9px] text-slate-500 font-mono block" dir="ltr">
                            {targetInfo.currentDiamondsInLevel.toLocaleString()} / {targetInfo.targetDiamondsInLevel.toLocaleString()} 💎
                          </span>
                        </div>
                      </div>

                      {/* شريط التقدم الديناميكي: يتصفر ويعود للامتلاء عند كل مستوى جديد */}
                      <div className="relative">
                        <div className="w-full h-2 bg-slate-200/80 rounded-full overflow-hidden shadow-inner">
                          <div 
                            className={`h-full rounded-full transition-all duration-700 ease-out ${
                              targetInfo.isMaxLevel 
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-500' 
                                : targetInfo.currentProgressInLevel >= 80 
                                  ? 'bg-gradient-to-r from-amber-500 to-emerald-500'
                                  : 'bg-gradient-to-r from-amber-500 to-amber-600'
                            }`}
                            style={{ width: `${targetInfo.currentProgressInLevel}%` }}
                          />
                        </div>
                      </div>

                      {/* شريط تمرير أفقي لمستويات التارغت الـ 50 */}
                      <div className="pt-1.5 space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-slate-500 px-0.5">
                          <span className="font-bold flex items-center gap-1 text-slate-600">
                            <span>مستويات التارغت الـ 50</span>
                            <span className="text-[9px] text-slate-400">(اسحب أفقياً ↔)</span>
                          </span>
                          <span className="font-mono text-[9px] font-bold text-amber-700">
                            المستوى الحالي: {targetInfo.currentLevel} / 50
                          </span>
                        </div>

                        <div 
                          className="flex items-center gap-1.5 overflow-x-auto pb-1.5 pt-0.5 scrollbar-thin scrollbar-thumb-amber-300 scrollbar-track-slate-100"
                          style={{ WebkitOverflowScrolling: 'touch' }}
                        >
                          {TARGET_LEVELS.map((lvl) => {
                            const isReached = targetInfo.currentLevel > lvl.level || (targetInfo.currentLevel === lvl.level && targetInfo.isMaxLevel);
                            const isCurrent = targetInfo.currentLevel === lvl.level && !targetInfo.isMaxLevel;
                            return (
                              <div 
                                key={lvl.level}
                                className={`px-2 py-1 rounded-lg text-center shrink-0 transition-all cursor-default ${
                                  isReached 
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs'
                                    : isCurrent 
                                      ? 'bg-gradient-to-b from-amber-100 to-amber-200 text-amber-950 border border-amber-400 font-black shadow-xs ring-1 ring-amber-300 scale-105'
                                      : 'bg-white text-slate-400 border border-slate-200/80 hover:border-slate-300'
                                }`}
                              >
                                <span className="text-[10px] block leading-none font-bold whitespace-nowrap">
                                  {isReached ? `✓ م${lvl.level}` : isCurrent ? `★ م${lvl.level}` : `م${lvl.level}`}
                                </span>
                                <span className="text-[8px] font-mono opacity-80 block mt-0.5 whitespace-nowrap" dir="ltr">
                                  {(lvl.targetDiamonds / 1000).toLocaleString()}K
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
              })}

            {selectedAgencyForHosts.hosts.length === 0 && (
              <div className="text-center py-16 text-slate-400 text-sm font-bold bg-white rounded-2xl border border-dashed border-slate-200">
                لا يوجد مذيعين مسجلين في هذه الوكالة حالياً
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-VIEW 3: سجل الأرباح والعمولات المعتمدة */}
      {/* ========================================================= */}
      {currentSubView === 'commissions' && (
        <div className="w-full max-w-lg mx-auto p-4 space-y-4 pb-16 flex-1">
          {/* Big Revenue Box */}
          <div className="p-4 rounded-[28px] bg-gradient-to-tr from-[#7A5210] via-[#A87B28] to-[#5C3C0B] text-white shadow-lg space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="opacity-90">إجمالي الأرباح المستحقة للمندوب:</span>
              <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-black">معتمد رسميًا 🔱</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black font-mono" dir="ltr">$ 5,212.50</span>
              <span className="text-xs font-mono text-amber-200">💎 2,606,250 ماسة</span>
            </div>
            <div className="pt-2 border-t border-white/20 flex items-center justify-between text-[11px] opacity-90">
              <span>نسبة عمولة الاستدعاء: <strong>12.5%</strong></span>
              <span>المصدر: إشراف رئيس الوكالات (سالم الكعبي)</span>
            </div>
          </div>

          {/* Breakdown by Agency */}
          <div className="space-y-2">
            <h4 className="text-xs font-black text-[#5C3F13] px-1">تفاصيل عمولات الوكالات المستدعاة لهذا الشهر:</h4>
            {recruitedAgencies.map((ag) => (
              <div key={ag.id} className="p-3 bg-white rounded-xl border border-[#EAE0CD] flex items-center justify-between text-xs">
                <div>
                  <span className="font-black text-[#5C3F13] block">{ag.name}</span>
                  <span className="text-[10px] text-[#8C6B38]">إجمالي دخل الوكالة: {ag.monthlyRevenue}</span>
                </div>
                <div className="text-left">
                  <span className="font-black font-mono text-emerald-600 block">{ag.repCommission}</span>
                  <span className="text-[9px] text-emerald-800 font-bold bg-emerald-50 px-1.5 py-0.2 rounded">محولة وموثقة ✓</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-VIEW 4: سجل طلبات الاستدعاء والتوثيق */}
      {/* ========================================================= */}
      {currentSubView === 'invite_history' && (
        <div className="w-full max-w-lg mx-auto p-4 space-y-3 pb-16 flex-1">
          <div className="flex items-center justify-between px-1">
            <h4 className="text-xs font-black text-[#5C3F13]">سجل طلبات الاستدعاء والتوثيق ({invitationsHistory.length})</h4>
            <span className="text-[10px] text-[#8C6B38]">تحديث لحظي لحالة الطلب</span>
          </div>

          <div className="space-y-2.5">
            {invitationsHistory.map((inv) => (
              <div key={inv.id} className="p-3.5 bg-white rounded-2xl border border-[#EAE0CD] space-y-2 shadow-2xs">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-black text-[#5C3F13]">{inv.targetName}</span>
                  <span className="font-mono text-[10px] text-[#8C6B38]">{inv.id}</span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-[#8C6B38]">{inv.date}</span>
                  <span className={`px-2 py-0.5 rounded-full font-bold ${
                    inv.status === 'approved' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}>
                    {inv.statusText}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-VIEW 5: اللوائح والشروط */}
      {/* ========================================================= */}
      {currentSubView === 'rules' && (
        <div className="w-full max-w-lg mx-auto p-4 space-y-3 pb-16 flex-1">
          <div className="p-4 rounded-2xl bg-white border border-[#EAE0CD] space-y-3 text-xs leading-relaxed text-[#5C3F13]">
            <div className="flex items-center gap-2 pb-2 border-b border-[#EAE0CD]">
              <ShieldCheck className="w-5 h-5 text-[#B38022]" />
              <h3 className="font-black text-sm">لائحة وضوابط مندوب الوكالات الرسمية</h3>
            </div>

            <div className="space-y-2 text-[11px] text-[#7A5210]">
              <p>1. يحق للمندوب استدعاء أصحاب الوكالات الرسمية الجدد وتزويدهم بكود الاستدعاء المعتمد.</p>
              <p>2. لا تصبح الوكالة رسمية وفعالة إلا بعد اعتماد وتوثيق رئيس الوكالات الرسمية (سالم الكعبي).</p>
              <p>3. يتم احتساب عمولة المندوب تلقائياً من دخل وأرباح الوكالة وفق النسبة المعتمدة (12.5%).</p>
              <p>4. يحق لرئيس الوكالات تعديل أو منح مكافآت إضافية للمندوبين المتميزين عند تحقيق التارغت المطلوب.</p>
            </div>

            <button
              onClick={() => setCurrentSubView('main')}
              className="w-full py-2 rounded-xl bg-gradient-to-r from-[#B38022] to-[#7A5210] text-white font-black text-xs cursor-pointer shadow-sm"
            >
              فهمت وموافق على اللوائح
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* POPUP MODAL: نافذة تفاصيل البند وأسباب المنع وفك البند بالصلاحية */}
      {/* ========================================================= */}
      <AnimatePresence>
        {selectedHostForBanModal && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl border border-slate-200 text-slate-800 space-y-4 overflow-hidden relative"
              dir="rtl"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-2xl flex items-center justify-center ${
                    selectedHostForBanModal.isBanned 
                      ? 'bg-rose-100 text-rose-600' 
                      : 'bg-emerald-100 text-emerald-600'
                  }`}>
                    {selectedHostForBanModal.isBanned ? (
                      <ShieldAlert className="w-5 h-5" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-slate-900 leading-tight">
                      {selectedHostForBanModal.isBanned ? 'بيانات وإجراءات بند المذيع' : 'حالة حساب المذيع'}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {selectedHostForBanModal.name} (ID: {selectedHostForBanModal.id})
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedHostForBanModal(null)}
                  className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Host Quick Info */}
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <img 
                  src={selectedHostForBanModal.avatar} 
                  alt={selectedHostForBanModal.name}
                  className="w-11 h-11 rounded-full object-cover border border-slate-200"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs text-slate-900 truncate block">
                      {selectedHostForBanModal.name}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      selectedHostForBanModal.isBanned 
                        ? 'bg-rose-100 text-rose-700' 
                        : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {selectedHostForBanModal.isBanned ? 'مبند حالياً' : 'نظامي ونشط'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                    <span>الوكالة: {selectedAgencyForHosts?.name || 'الوكالة المستدعاة'}</span>
                    <span className="font-mono">ID: {selectedHostForBanModal.id}</span>
                  </div>
                </div>
              </div>

              {/* Ban Details Section if Banned */}
              {selectedHostForBanModal.isBanned ? (
                <div className="space-y-3">
                  {/* سبب البند المعتمد */}
                  <div className="p-3.5 bg-rose-50/70 border border-rose-200/80 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-rose-900 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-rose-600" />
                        سبب البند المحدد:
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-800">
                        {selectedHostForBanModal.banType === 'promotion' 
                          ? 'بند ترويج روابط' 
                          : selectedHostForBanModal.banType === 'policy' 
                            ? 'بند سياسات عامة' 
                            : 'بند بث عادي'}
                      </span>
                    </div>

                    <p className="text-xs text-rose-800 leading-relaxed font-medium bg-white/80 p-2.5 rounded-xl border border-rose-100">
                      {selectedHostForBanModal.banReason || 'تم البند بناء على مخالفة لوائح البث المباشر أو ترويج منصات خارجية.'}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-rose-700/80 pt-1 border-t border-rose-100">
                      <span>تاريخ البند: {selectedHostForBanModal.banDate || '2026-08-28 14:30'}</span>
                      <span>بواسطة: {selectedHostForBanModal.bannedBy || 'إدارة الرقابة'}</span>
                    </div>
                  </div>

                  {/* شروط وسلطة فك البند */}
                  <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-2 text-xs">
                    <span className="font-black text-amber-900 block text-[11px]">
                      ضوابط فك البند المعتمدة من الإدارة:
                    </span>
                    <ul className="text-[10px] text-amber-800 space-y-1 list-disc list-inside">
                      <li>يحق للمندوب فك البند فقط إذا كان المذيع تابعاً لإحدى الوكالات المستدعاة من قبله.</li>
                      <li>يلزم توفر الصلاحية الممنوحة من رئيس الوكالة الرسمية أو المبرمج السوبر أدمن.</li>
                      <li>لا يجوز ولا يمكن فك البند لأي حساب أو وكالة خارج سلطة هذا المندوب.</li>
                    </ul>

                    <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-700">حالة صلاحيتك الآن:</span>
                      <span className={`font-black px-2 py-0.5 rounded-md ${
                        repHasUnbanPermission 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {repHasUnbanPermission ? 'لديك صلاحية معتمدة لفك البند' : 'ليس لديك صلاحية لفك البند'}
                      </span>
                    </div>
                  </div>

                  {/* إجراء فك البند */}
                  {repHasUnbanPermission ? (
                    <div className="space-y-2 pt-1">
                      <button
                        onClick={() => handleUnbanHost(selectedHostForBanModal.id)}
                        disabled={isProcessingUnban}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-[0.99] disabled:opacity-50"
                      >
                        {isProcessingUnban ? (
                          <span>جاري فك البند والتحديث...</span>
                        ) : (
                          <>
                            <Unlock className="w-4 h-4" />
                            <span>تأكيد فك البند واستعادة الحساب للبث</span>
                          </>
                        )}
                      </button>
                      <p className="text-[9px] text-center text-slate-400">
                        سيتم توثيق فك البند باسم المندوب في السجلات الرسمية
                      </p>
                    </div>
                  ) : (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-center space-y-1.5">
                      <p className="text-xs font-bold text-rose-700">
                        ⛔ ليس لديك صلاحية فك البند حالياً
                      </p>
                      <p className="text-[10px] text-rose-600">
                        يرجى مراجعة رئيس الوكالة الرسمية (سالم الكعبي) أو المبرمج السوبر أدمن لمنحك صلاحية فك البند.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                /* إذا كان الحساب غير مبند */
                <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="text-xs font-black text-emerald-900">
                    حساب المذيع سليم وغير مبند
                  </h4>
                  <p className="text-[11px] text-emerald-700 leading-relaxed">
                    المذيع يبث بشكل نظامي ويحقق متطلبات التارغت بنجاح دون أي تقييد أو مخالفات مسجلة.
                  </p>
                  <button
                    onClick={() => setSelectedHostForBanModal(null)}
                    className="mt-2 px-5 py-1.5 rounded-xl bg-emerald-600 text-white font-black text-xs cursor-pointer shadow-xs hover:bg-emerald-700"
                  >
                    إغلاق النافذة
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
