import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  Search, 
  Plus, 
  CheckCircle2, 
  Clock, 
  ChevronLeft, 
  ChevronRight,
  ChevronDown, 
  ChevronUp, 
  ArrowLeft, 
  ArrowRight,
  DollarSign, 
  FileText, 
  Sparkles, 
  X, 
  TrendingUp, 
  TrendingDown, 
  UserCheck, 
  Lock, 
  Unlock, 
  Crown, 
  Info, 
  Eye, 
  UserPlus, 
  ShieldCheck, 
  Globe,
  UserCheck2,
  Share2,
  History,
  ArrowRightLeft,
  Tv,
  Radio,
  Copy,
  Check,
  Calendar,
  Shield,
  Edit,
  Edit3,
  Maximize2,
  Minimize2,
  ExternalLink,
  Layers,
  Sparkle,
  FileSpreadsheet,
  Download,
  Coins,
  HelpCircle,
  UserMinus,
  BookOpen,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface OfficialAgenciesManagementProps {
  onBackToMenu: () => void;
  showToast: (msg: string) => void;
}

export const OfficialAgenciesManagement: React.FC<OfficialAgenciesManagementProps> = ({
  onBackToMenu,
  showToast
}) => {
  // State for Hierarchy Tree View vs Direct View
  const [viewMode, setViewMode] = useState<'main' | 'tree'>('main');
  const [showStatsExpansion, setShowStatsExpansion] = useState(false);
  const [searchAdminId, setSearchAdminId] = useState('AG9901');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFrozen, setIsFrozen] = useState(false);

  // Manager Details Modal Specific States (تفاصيل ونشاط مدير الوكالات)
  const [managerDetailsTab, setManagerDetailsTab] = useState<'reps' | 'performance' | 'profile'>('reps');
  const [repSearchQuery, setRepSearchQuery] = useState('');
  const [expandedRepAgencies, setExpandedRepAgencies] = useState<{ [key: string]: boolean }>({});
  const [showAddDelegateModal, setShowAddDelegateModal] = useState(false);
  const [showAddAgencyToRepModal, setShowAddAgencyToRepModal] = useState<string | null>(null);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);

  // Delegates list (المندوبين الخاصين بالمدير حسب الخريطة الهندسية المعمارية)
  const [delegatesList, setDelegatesList] = useState([
    {
      id: 'DEL-401',
      primaryUserId: '1001004',
      name: 'تركي بن خالد (مندوب الشرق الأوسط)',
      title: '(مندوب معتمد 🌟 DEL-401)',
      status: 'مندوب نشط',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      joinDate: '01-03-2026',
      invitedBy: 'أحمد المنصوري (MGR-9901 / #1001001)',
      invitedAgenciesCount: 2,
      totalDiamonds: '18,500,000',
      commissionRate: '15.00%',
      agenciesIncome: '$24,500',
      isLocked: false,
      agencies: [
        { name: 'وكالة النخبة الملكية (AG-101)', gid: 'AG-101', agentId: '1001010', hosts: 18, income: '$14,200', diamonds: '10,800,000' },
        { name: 'وكالة الأساطير الذهبية (AG-104)', gid: 'AG-104', agentId: '1001011', hosts: 14, income: '$10,300', diamonds: '7,700,000' }
      ]
    },
    {
      id: 'DEL-402',
      primaryUserId: '1001005',
      name: 'عبدالله آل سعود (مندوب الخليج والمغرب)',
      title: '(مندوب أول 👑 DEL-402)',
      status: 'مندوب نشط',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      joinDate: '15-03-2026',
      invitedBy: 'أحمد المنصوري (MGR-9901 / #1001001)',
      invitedAgenciesCount: 3,
      totalDiamonds: '21,200,000',
      commissionRate: '14.00%',
      agenciesIncome: '$26,800',
      isLocked: false,
      agencies: [
        { name: 'وكالة صدى الخليج (AG-102)', gid: 'AG-102', agentId: '1001012', hosts: 12, income: '$10,400', diamonds: '7,900,000' },
        { name: 'وكالة الصقور الملكية (AG-105)', gid: 'AG-105', agentId: '1001014', hosts: 9, income: '$8,200', diamonds: '6,800,000' },
        { name: 'وكالة المجد الفضائية (AG-106)', gid: 'AG-106', agentId: '1001015', hosts: 8, income: '$8,200', diamonds: '6,500,000' }
      ]
    },
    {
      id: 'DEL-403',
      primaryUserId: '1001006',
      name: 'سلطان القحطاني (مندوب مصر وشمال أفريقيا)',
      title: '(مندوب استقطاب 🚀 DEL-403)',
      status: 'مندوب نشط',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      joinDate: '01-04-2026',
      invitedBy: 'أحمد المنصوري (MGR-9901 / #1001001)',
      invitedAgenciesCount: 1,
      totalDiamonds: '9,800,000',
      commissionRate: '12.00%',
      agenciesIncome: '$12,400',
      isLocked: false,
      agencies: [
        { name: 'وكالة الأهرام للبث المباشر (AG-103)', gid: 'AG-103', agentId: '1001013', hosts: 11, income: '$12,400', diamonds: '9,800,000' }
      ]
    }
  ]);

  // Fullscreen States & Handlers (فتح شاشة كاملة عند الضغط على أيقونة)
  const [isManagerModalFullScreen, setIsManagerModalFullScreen] = useState(false);
  const [fullscreenAgency, setFullscreenAgency] = useState<{
    name: string;
    gid: string;
    agentName: string;
    hosts: number;
    brokers: string;
    totalDiamonds: string;
    income: string;
    profitIncome: string;
    growth: string;
    country: string;
    logoEmoji?: string;
    logoGradient?: string;
    isLocked?: boolean;
    establishedDate?: string;
    level?: string;
    commissionRate?: string;
    topHosts?: Array<{ name: string; id: string; diamonds: string; avatar: string }>;
  } | null>(null);
  const [fullscreenAgencyTab, setFullscreenAgencyTab] = useState<'overview' | 'hosts' | 'brokers' | 'stats'>('overview');
  const [fullscreenImage, setFullscreenImage] = useState<{ url: string; title: string; subtitle?: string; badge?: string } | null>(null);

  const handleOpenAgencyFullscreen = (agencyData: any) => {
    setFullscreenAgency(agencyData);
    setFullscreenAgencyTab('overview');
    showToast(`📱 تم فتح الشاشة الكاملة: ${agencyData.name}`);
  };

  const handleOpenManagerFullscreen = () => {
    setShowDetailsModal(true);
    setIsManagerModalFullScreen(true);
    showToast(`👑 تم فتح تفاصيل مدير الوكالات بشاشة كاملة`);
  };

  // Agency Reps Modal
  const [showRepDetailsModal, setShowRepDetailsModal] = useState(false);
  const [showAddManagerModal, setShowAddManagerModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Salary Slip Modal State (قسيمة الراتب - مطابقة للصورة المرفقة)
  const [showSalarySlipModal, setShowSalarySlipModal] = useState(false);
  const [selectedSalarySlipAgency, setSelectedSalarySlipAgency] = useState<{
    name: string;
    gid: string;
    agentName: string;
    month: string;
    totalSalary: string;
    frozenProfits: string;
    baseCommission: string;
    unlockedCommission: string;
    agencyDiamondsReceived: string;
    agencyCommissionRate: string;
    brokerShare: string;
    sentSalaryCoins: string;
    coinTransfers: Array<{ amount: number; time: string }>;
    hostDataFile: string;
    logoEmoji?: string;
    logoGradient?: string;
  } | null>(null);

  const handleOpenSalarySlip = (agencyData: any) => {
    setSelectedSalarySlipAgency(agencyData);
    setShowSalarySlipModal(true);
    showToast(`📄 تم فتح قسيمة الراتب: ${agencyData.name}`);
  };

  // Host Center Modals (الصور المرفقة: مركز المذيعين & my anchor & دعوة مذيع & سجل الدعوات & نقل مضيف)
  const [showHostCenterModal, setShowHostCenterModal] = useState(false);
  const [showMyAnchorModal, setShowMyAnchorModal] = useState(false);
  const [showInviteHostModal, setShowInviteHostModal] = useState(false);
  const [showInviteHistoryModal, setShowInviteHistoryModal] = useState(false);
  const [showTransferHostModal, setShowTransferHostModal] = useState(false);

  // Sub-modal specific states
  const [inviteHostUserId, setInviteHostUserId] = useState('');
  const [historyFilter, setHistoryFilter] = useState<'all' | 'pending' | 'joined' | 'expired'>('all');
  const [historySearchQuery, setHistorySearchQuery] = useState('');
  const [transferHostId, setTransferHostId] = useState('87377569');
  const [transferBrokerId, setTransferBrokerId] = useState('871023');
  const [transferDate, setTransferDate] = useState('2026/09/01');

  const [selectedAgencyForHosts, setSelectedAgencyForHosts] = useState({
    name: 'وكالة الأساطير الذهبية',
    gid: '30032',
    hostsCount: 28
  });

  // Hosts list data (as shown in Screenshot_20260829_152758_Chrome.jpg)
  const [hostsList] = useState([
    {
      id: '83534797',
      name: '🔱الملك👑الدوله🔱(🇪🇬🤨)',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      isClosed: true,
      joinDate: '2026-02-01T15:01:12Z',
      diamonds: '1,008,299',
      liveDuration: '38ساعات',
      liveDays: '16أيام'
    },
    {
      id: '85430392',
      name: 'زهرة بيضاء؟',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      isClosed: false,
      joinDate: '2026-02-01T14:52:39Z',
      diamonds: '0',
      liveDuration: '0ساعات',
      liveDays: '0أيام'
    },
    {
      id: '79900240',
      name: '🎼 Má نادر',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      isClosed: false,
      joinDate: '2026-02-01T14:34:39Z',
      diamonds: '0',
      liveDuration: '0ساعات',
      liveDays: '0أيام'
    },
    {
      id: '78498351',
      name: 'حبيبتي',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      isClosed: false,
      joinDate: '2026-02-01T13:21:47Z',
      diamonds: '7,700',
      liveDuration: '0ساعات',
      liveDays: '3أيام'
    },
    {
      id: '81156183',
      name: '🌹 walidi Má 🌹',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      isClosed: false,
      joinDate: '2026-02-01T12:10:05Z',
      diamonds: '50',
      liveDuration: '4ساعات',
      liveDays: '1أيام'
    },
    {
      id: '87377569',
      name: '⚔️ القيادة ⚔️',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      isClosed: false,
      joinDate: '2026-02-01T11:05:14Z',
      diamonds: '2,000,131',
      liveDuration: '29ساعات',
      liveDays: '8أيام'
    },
    {
      id: '93627993',
      name: 'سالم',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
      isClosed: false,
      joinDate: '2026-02-01T09:40:22Z',
      diamonds: '125,600',
      liveDuration: '82ساعات',
      liveDays: '17أيام'
    },
    {
      id: '82846546',
      name: 'جووري',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      isClosed: false,
      joinDate: '2025-12-22T17:00:07Z',
      diamonds: '109,650',
      liveDuration: '10ساعات',
      liveDays: '4أيام'
    },
    {
      id: '81087015',
      name: 'ألكـAl-Kaserـاسـرر',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      isClosed: false,
      joinDate: '2026-02-01T10:15:30Z',
      diamonds: '38,740',
      liveDuration: '63ساعات',
      liveDays: '10أيام'
    }
  ]);

  // Tree View Agency Expansion states
  const [expandedAgencies, setExpandedAgencies] = useState<{ [key: string]: boolean }>({
    '30032': true
  });

  const toggleAgencyExpand = (gid: string) => {
    setExpandedAgencies(prev => ({ ...prev, [gid]: !prev[gid] }));
  };

  const handleOpenHostCenter = (agencyName: string, gid: string, hostsCount: number) => {
    setSelectedAgencyForHosts({ name: agencyName, gid, hostsCount });
    setShowHostCenterModal(true);
  };

  // Salary Slip Sub-Modals (الصور 1 و 2 و 3 من قسيمة الراتب)
  const [showBaseCommissionModal, setShowBaseCommissionModal] = useState(false);
  const [showUnlockedCommissionModal, setShowUnlockedCommissionModal] = useState(false);
  const [showBrokerSideSplitModal, setShowBrokerSideSplitModal] = useState(false);

  // Month / Date Machine State (آلة التواريخ وتقليب الأشهر لقسيمة الراتب والشاشات الفرعية)
  const [selectedSlipMonth, setSelectedSlipMonth] = useState('2026/08');
  const [showMonthPickerDropdown, setShowMonthPickerDropdown] = useState(false);

  const availableSlipMonths = [
    '2026/08',
    '2026/07',
    '2026/06',
    '2026/05',
    '2026/04',
    '2026/03',
    '2026/02',
    '2026/01',
    '2025/12',
    '2025/11',
    '2025/10',
    '2025/09'
  ];

  // Dynamic salary data by month
  const salaryDataByMonth: Record<string, {
    totalSalary: string;
    frozenProfits: string;
    baseCommission: string;
    unlockedCommission: string;
    agencyDiamondsReceived: string;
    agencyCommissionRate: string;
    brokerShare: string;
    sentSalaryCoins: string;
    coinTransfers: Array<{ amount: number; time: string }>;
    hostDataFile: string;
    hosts: Array<{
      id: string;
      name: string;
      avatar: string;
      contributionCommission: string;
      levelCommission: string;
      lostCommission: string;
      deductionReason: string;
    }>;
    unlockedDetails: {
      totalUnlocked: string;
      diamondsReceived: string;
      levelRange: string;
      activeRate: string;
    };
    brokerSplit: {
      totalShare: string;
      brokers: Array<{
        id: string;
        name: string;
        avatar: string;
        profitShare: string;
        shareAmount: string;
        isClosed?: boolean;
      }>;
    };
  }> = {
    '2026/08': {
      totalSalary: '50',
      frozenProfits: '$0.00',
      baseCommission: '63',
      unlockedCommission: '12',
      agencyDiamondsReceived: '3,469,755',
      agencyCommissionRate: '0.8',
      brokerShare: '30',
      sentSalaryCoins: '20',
      coinTransfers: [
        { amount: 10, time: '2026-08-27T04:42:03Z' },
        { amount: 10, time: '2026-08-27T04:42:02Z' }
      ],
      hostDataFile: 'salary_30032_2026-08-01.xlsx',
      hosts: [
        {
          id: '82846546',
          name: 'جووري',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
          contributionCommission: '0$',
          levelCommission: '1$',
          lostCommission: '0$',
          deductionReason: 'أيام البث لم يتحقق'
        },
        {
          id: '78427093',
          name: '彡ساحر القوافي 彡',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
          contributionCommission: '0$',
          levelCommission: '0$',
          lostCommission: '0$',
          deductionReason: 'أيام البث,مدة البث لم يتحقق'
        }
      ],
      unlockedDetails: {
        totalUnlocked: '12',
        diamondsReceived: '3,469,755',
        levelRange: '0-4999999',
        activeRate: '0.8'
      },
      brokerSplit: {
        totalShare: '$30',
        brokers: [
          { id: '87377569', name: '⚔️ القيادة ⚔️', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', profitShare: '75%', shareAmount: '26$' },
          { id: '83534797', name: '🔱ملك👑الدوله🔱(🇪🇬😉)', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80', profitShare: '50%', shareAmount: '4$', isClosed: true },
          { id: '78343200', name: '🔱ملك👑الدوله🔱(🇪🇬😉)', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', profitShare: '75%', shareAmount: '0$' },
          { id: '78498351', name: 'حبيبتي', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', profitShare: '0%', shareAmount: '0$' },
          { id: '81087015', name: 'ألكـAl-Kaserـاسـرر', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80', profitShare: '25%', shareAmount: '0$' },
          { id: '81360134', name: 'A', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80', profitShare: '50%', shareAmount: '0$' }
        ]
      }
    },
    '2026/07': {
      totalSalary: '68',
      frozenProfits: '$0.00',
      baseCommission: '85',
      unlockedCommission: '17',
      agencyDiamondsReceived: '4,120,500',
      agencyCommissionRate: '0.8',
      brokerShare: '42',
      sentSalaryCoins: '35',
      coinTransfers: [
        { amount: 20, time: '2026-07-28T05:15:10Z' },
        { amount: 15, time: '2026-07-28T05:15:08Z' }
      ],
      hostDataFile: 'salary_30032_2026-07-01.xlsx',
      hosts: [
        {
          id: '82846546',
          name: 'جووري',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
          contributionCommission: '2$',
          levelCommission: '3$',
          lostCommission: '0$',
          deductionReason: 'مكتمل الشروط'
        },
        {
          id: '78427093',
          name: '彡ساحر القوافي 彡',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
          contributionCommission: '1$',
          levelCommission: '2$',
          lostCommission: '0$',
          deductionReason: 'أيام البث لم يتحقق'
        }
      ],
      unlockedDetails: {
        totalUnlocked: '17',
        diamondsReceived: '4,120,500',
        levelRange: '0-4999999',
        activeRate: '0.8'
      },
      brokerSplit: {
        totalShare: '$42',
        brokers: [
          { id: '87377569', name: '⚔️ القيادة ⚔️', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', profitShare: '75%', shareAmount: '35$' },
          { id: '83534797', name: '🔱ملك👑الدوله🔱(🇪🇬😉)', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80', profitShare: '50%', shareAmount: '7$', isClosed: true }
        ]
      }
    },
    '2026/06': {
      totalSalary: '94',
      frozenProfits: '$0.00',
      baseCommission: '118',
      unlockedCommission: '24',
      agencyDiamondsReceived: '5,890,200',
      agencyCommissionRate: '0.9',
      brokerShare: '55',
      sentSalaryCoins: '50',
      coinTransfers: [
        { amount: 50, time: '2026-06-27T03:30:14Z' }
      ],
      hostDataFile: 'salary_30032_2026-06-01.xlsx',
      hosts: [
        {
          id: '82846546',
          name: 'جووري',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
          contributionCommission: '4$',
          levelCommission: '5$',
          lostCommission: '0$',
          deductionReason: 'مكتمل الشروط'
        }
      ],
      unlockedDetails: {
        totalUnlocked: '24',
        diamondsReceived: '5,890,200',
        levelRange: '5000000-9999999',
        activeRate: '0.9'
      },
      brokerSplit: {
        totalShare: '$55',
        brokers: [
          { id: '87377569', name: '⚔️ القيادة ⚔️', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', profitShare: '75%', shareAmount: '45$' },
          { id: '83534797', name: '🔱ملك👑الدوله🔱(🇪🇬😉)', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80', profitShare: '50%', shareAmount: '10$' }
        ]
      }
    }
  };

  const currentMonthData = salaryDataByMonth[selectedSlipMonth] || {
    totalSalary: '45',
    frozenProfits: '$0.00',
    baseCommission: '56',
    unlockedCommission: '11',
    agencyDiamondsReceived: '2,900,000',
    agencyCommissionRate: '0.8',
    brokerShare: '25',
    sentSalaryCoins: '15',
    coinTransfers: [
      { amount: 15, time: `${selectedSlipMonth.replace('/', '-')}-27T04:00:00Z` }
    ],
    hostDataFile: `salary_30032_${selectedSlipMonth.replace('/', '-')}-01.xlsx`,
    hosts: [
      {
        id: '82846546',
        name: 'جووري',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        contributionCommission: '0$',
        levelCommission: '1$',
        lostCommission: '0$',
        deductionReason: 'أيام البث لم يتحقق'
      }
    ],
    unlockedDetails: {
      totalUnlocked: '11',
      diamondsReceived: '2,900,000',
      levelRange: '0-4999999',
      activeRate: '0.8'
    },
    brokerSplit: {
      totalShare: '$25',
      brokers: [
        { id: '87377569', name: '⚔️ القيادة ⚔️', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', profitShare: '75%', shareAmount: '20$' }
      ]
    }
  };

  const handlePreviousMonth = () => {
    const currentIndex = availableSlipMonths.indexOf(selectedSlipMonth);
    if (currentIndex < availableSlipMonths.length - 1) {
      const prevMonth = availableSlipMonths[currentIndex + 1];
      setSelectedSlipMonth(prevMonth);
      showToast(`📅 تم الانتقال للشهر السابق: ${prevMonth}`);
    }
  };

  const handleNextMonth = () => {
    const currentIndex = availableSlipMonths.indexOf(selectedSlipMonth);
    if (currentIndex > 0) {
      const nextMonth = availableSlipMonths[currentIndex - 1];
      setSelectedSlipMonth(nextMonth);
      showToast(`📅 تم الانتقال للشهر التالي: ${nextMonth}`);
    }
  };

  const handleSelectMonth = (month: string) => {
    setSelectedSlipMonth(month);
    setShowMonthPickerDropdown(false);
    showToast(`📅 تم اختيار التاريخ: ${month}`);
  };

  // =========================================================================
  // BROKER HUB & MANAGEMENT MODAL STATES (الصور المرفقة 1 إلى 5)
  // =========================================================================
  const [showBrokersMenuModal, setShowBrokersMenuModal] = useState(false);
  const [showMyBrokersModal, setShowMyBrokersModal] = useState(false);
  const [showInviteBrokerModal, setShowInviteBrokerModal] = useState(false);
  const [showRemoveBrokerModal, setShowRemoveBrokerModal] = useState(false);
  const [showBrokerPoliciesModal, setShowBrokerPoliciesModal] = useState(false);
  const [showManageSingleBrokerModal, setShowManageSingleBrokerModal] = useState(false);
  const [selectedBrokerForManage, setSelectedBrokerForManage] = useState<any>(null);
  const [showBrokerProfileModal, setShowBrokerProfileModal] = useState(false);
  const [selectedBrokerForProfile, setSelectedBrokerForProfile] = useState<any>(null);
  const [brokerSearchQuery, setBrokerSearchQuery] = useState('');
  const [inviteBrokerUserId, setInviteBrokerUserId] = useState('');

  const [selectedAgencyForBrokers, setSelectedAgencyForBrokers] = useState({
    name: 'وكالة الأساطير الذهبية',
    gid: '30032',
    totalBrokers: 11
  });

  // Brokers list data (مطابقة تامة للخريطة الهندسية المعمارية وتوزيع الوسطاء)
  const [brokersList, setBrokersList] = useState([
    {
      id: '1001016',
      brokerCode: 'BRK-101-01',
      name: 'تركي الشمري (BRK-101-01)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      isClosed: false,
      joinDate: '2026-02-15T10:00:00Z',
      profitShare: 15.00,
      invitedHostsCount: 3,
      newHostsCount: 1,
      monthlyDiamonds: '6,200,000',
      invitedHosts: [
        {
          id: '1001022',
          name: 'سارة الرياض 🌟 (HOST-1001022)',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
          joinDate: '2026-02-19T14:30:00Z',
          monthlyDiamonds: '2,800,000'
        },
        {
          id: '1001023',
          name: 'صوت البادية 🎤 (HOST-1001023)',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          joinDate: '2026-02-20T18:00:00Z',
          monthlyDiamonds: '2,100,000'
        },
        {
          id: '1001024',
          name: 'كروان النخبة 🎵 (HOST-1001024)',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          joinDate: '2026-02-22T12:00:00Z',
          monthlyDiamonds: '1,300,000'
        }
      ]
    },
    {
      id: '1001017',
      brokerCode: 'BRK-101-02',
      name: 'عبدالله القحطاني (BRK-101-02)',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      isClosed: false,
      joinDate: '2026-02-18T11:20:00Z',
      profitShare: 15.00,
      invitedHostsCount: 2,
      newHostsCount: 1,
      monthlyDiamonds: '4,600,000',
      invitedHosts: [
        {
          id: '1001025',
          name: 'ليالي نجد 🌙 (HOST-1001025)',
          avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
          joinDate: '2026-02-21T16:00:00Z',
          monthlyDiamonds: '2,400,000'
        },
        {
          id: '1001026',
          name: 'صقر الجزيرة 🦅 (HOST-1001026)',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
          joinDate: '2026-02-23T19:30:00Z',
          monthlyDiamonds: '2,200,000'
        }
      ]
    },
    {
      id: '83534797',
      name: '🔱ملك👑الدوله🔱(🇪🇬😉)',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      isClosed: true,
      joinDate: '2026-02-13T13:26:16Z',
      profitShare: 50.00,
      invitedHostsCount: 28,
      newHostsCount: 1,
      monthlyDiamonds: '779,950',
      invitedHosts: [
        {
          id: '95770929',
          name: 'محمد',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          joinDate: '2026-06-06T18:40:15Z',
          monthlyDiamonds: '0'
        },
        {
          id: '94726307',
          name: 'المطنوخ',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          joinDate: '2026-05-30T20:59:03Z',
          monthlyDiamonds: '0'
        },
        {
          id: '90782114',
          name: 'ذياب',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
          joinDate: '2026-05-30T00:55:02Z',
          monthlyDiamonds: '0'
        },
        {
          id: '89932144',
          name: 'مجنون',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
          joinDate: '2026-05-28T14:10:00Z',
          monthlyDiamonds: '12,400'
        },
        {
          id: '91882341',
          name: 'ساهر الليل',
          avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
          joinDate: '2026-05-25T11:20:00Z',
          monthlyDiamonds: '48,500'
        },
        {
          id: '96541209',
          name: 'أميرة الورد',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
          joinDate: '2026-05-20T09:15:30Z',
          monthlyDiamonds: '135,000'
        },
        {
          id: '92154388',
          name: 'الصقر الجارح',
          avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
          joinDate: '2026-05-15T16:45:10Z',
          monthlyDiamonds: '280,000'
        },
        {
          id: '91124450',
          name: 'البرنس',
          avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
          joinDate: '2026-05-10T08:12:00Z',
          monthlyDiamonds: '304,050'
        }
      ]
    },
    {
      id: '78343200',
      name: '👑ملك👑الدوله🔱(🇪🇬😉)',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      isClosed: false,
      joinDate: '2026-02-12T12:05:18Z',
      profitShare: 75.00,
      invitedHostsCount: 2,
      newHostsCount: 0,
      monthlyDiamonds: '146,881'
    },
    {
      id: '78498351',
      name: 'حبيبتي',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      isClosed: false,
      joinDate: '2026-02-03T12:06:29Z',
      profitShare: 0.00,
      invitedHostsCount: 9,
      newHostsCount: 0,
      monthlyDiamonds: '129,100'
    },
    {
      id: '81156183',
      name: '🌹 walidi Má 🌹',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      isClosed: false,
      joinDate: '2026-02-01T12:10:05Z',
      profitShare: 30.00,
      invitedHostsCount: 5,
      newHostsCount: 0,
      monthlyDiamonds: '95,400'
    },
    {
      id: '87377569',
      name: '⚔️ القيادة ⚔️',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
      isClosed: false,
      joinDate: '2026-02-01T11:05:14Z',
      profitShare: 40.00,
      invitedHostsCount: 14,
      newHostsCount: 2,
      monthlyDiamonds: '512,300'
    },
    {
      id: '93627993',
      name: 'سالم',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
      isClosed: false,
      joinDate: '2026-02-01T09:40:22Z',
      profitShare: 25.00,
      invitedHostsCount: 6,
      newHostsCount: 1,
      monthlyDiamonds: '210,000'
    },
    {
      id: '81087015',
      name: 'ألكـAl-Kaserـاسـرر',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      isClosed: false,
      joinDate: '2026-02-01T10:15:30Z',
      profitShare: 35.00,
      invitedHostsCount: 8,
      newHostsCount: 1,
      monthlyDiamonds: '185,000'
    }
  ]);

  const handleOpenBrokersMenu = (agencyName: string, gid: string, totalBrokers: number = 11) => {
    setSelectedAgencyForBrokers({ name: agencyName, gid, totalBrokers });
    setShowBrokersMenuModal(true);
  };

  const handleRemoveBroker = (brokerId: string, brokerName: string) => {
    setBrokersList(prev => prev.filter(b => b.id !== brokerId));
    showToast(`🗑️ تمت إزالة الوسيط ${brokerName} بنجاح`);
  };

  const handleSendBrokerInvite = () => {
    if (!inviteBrokerUserId.trim()) {
      showToast('⚠️ يرجى إدخال معرف المستخدم (User ID) للوسيط');
      return;
    }
    const newBroker = {
      id: inviteBrokerUserId.trim(),
      name: `وسيط معتمد (${inviteBrokerUserId.trim()})`,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      isClosed: false,
      joinDate: new Date().toISOString(),
      profitShare: 30.00,
      invitedHostsCount: 0,
      newHostsCount: 0,
      monthlyDiamonds: '0'
    };
    setBrokersList(prev => [newBroker, ...prev]);
    showToast(`✅ تم إرسال طلب اعتماد الوسيط ID: ${inviteBrokerUserId} بنجاح`);
    setInviteBrokerUserId('');
    setShowInviteBrokerModal(false);
  };

  return (
    <div className="w-full min-h-screen bg-[#070b14] text-white p-3 sm:p-5 font-sans select-none" dir="rtl">
      
      {/* ========================================================================= */}
      {/* 1. TOP HEADER - EXACT MATCH FROM SCREENSHOTS */}
      {/* ========================================================================= */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-4">
        {/* Crown Icon Left */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 p-[2px] shadow-[0_0_15px_rgba(245,158,11,0.3)] flex items-center justify-center">
          <div className="w-full h-full bg-[#161208] rounded-full flex items-center justify-center">
            <Crown className="w-6 h-6 text-amber-400 fill-amber-400" />
          </div>
        </div>

        {/* Center Title & Subtitle */}
        <div className="text-center">
          <h1 className="text-base sm:text-lg font-black text-white flex items-center justify-center gap-1.5">
            <span>إدارة الوكالات الرسمية والمندوبين</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </h1>
          <p className="text-[11px] font-semibold text-slate-400 mt-0.5 tracking-tight font-mono">
            Official Agencies & Representatives Hub
          </p>
        </div>

        {/* Back Button Right */}
        <button
          onClick={viewMode === 'tree' ? () => setViewMode('main') : onBackToMenu}
          className="px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:bg-slate-800 text-slate-200 text-xs font-black flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
        >
          <span>الرجوع</span>
          <span className="text-amber-400 text-sm font-bold">➔</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* VIEW MODE: TREE HIERARCHY (الصورة رقم 3) */}
      {/* ========================================================================= */}
      {viewMode === 'tree' ? (
        <div className="space-y-4 max-w-xl mx-auto">
          
          {/* Sub Header for Hierarchy */}
          <div className="flex items-center justify-between bg-[#0e1626] border border-slate-800 p-3 rounded-2xl">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-black text-white">شجرة التتبع الهرمي والوكلاء</h3>
                <p className="text-[10px] text-slate-400">إدارة شبكة الوكالات التابعة للمدير</p>
              </div>
            </div>
            <button
              onClick={() => setViewMode('main')}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1 cursor-pointer hover:bg-slate-800"
            >
              <span>الرجوع</span>
              <span className="text-amber-400">➔</span>
            </button>
          </div>

          {/* Manager Summary Card in Hierarchy View */}
          <div className="bg-white rounded-3xl p-4 text-slate-900 shadow-xl space-y-3">
            {/* Top Badges */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-start gap-1">
                <span className="px-3 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                  نشط
                </span>
                <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  ID: AG9901
                </span>
              </div>

              <div className="px-3 py-1 rounded-xl bg-blue-50 text-blue-700 text-xs font-black border border-blue-200 flex items-center gap-1">
                <span>ارتفاع الوكالات (+46.00%)</span>
                <TrendingUp className="w-3.5 h-3.5" />
              </div>

              <div className="px-3 py-1 rounded-xl bg-amber-50 text-amber-800 text-xs font-black border border-amber-200 flex items-center gap-1">
                <Crown className="w-3.5 h-3.5 text-amber-600" />
                <span>مدير عام معتمد</span>
              </div>
            </div>

            {/* Profile Row */}
            <div className="flex items-center gap-3 pt-1">
              <div 
                onClick={handleOpenManagerFullscreen}
                className="relative cursor-pointer group"
                title="اضغط لفتح الشاشة الكاملة"
              >
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                  alt="سالم الكعبي"
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-400 shadow-md group-hover:scale-105 transition-transform"
                />
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                <span className="absolute inset-0 rounded-2xl bg-black/25 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                  <Maximize2 className="w-4 h-4" />
                </span>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h2 
                    onClick={handleOpenManagerFullscreen}
                    className="text-sm font-black text-slate-900 cursor-pointer hover:text-amber-600 transition-colors"
                  >
                    سالم الكعبي (مدير الوكالات)
                  </h2>
                  <Info 
                    onClick={handleOpenManagerFullscreen}
                    className="w-3.5 h-3.5 text-slate-400 hover:text-amber-600 cursor-pointer" 
                  />
                </div>
                <div className="text-[11px] font-bold text-slate-600 flex items-center gap-1 mt-0.5">
                  <span>مدير وكالات معتمد</span>
                  <span>🔱</span>
                  <span>مدير وكالات</span>
                </div>
                <div className="text-[10px] text-slate-500 flex items-center gap-2 mt-1">
                  <span>🇸🇦 الرياض</span>
                  <span>•</span>
                  <span>الوكالات التابعة: 2</span>
                </div>
              </div>
            </div>

            {/* Collapse toggle */}
            <button
              onClick={() => setShowStatsExpansion(!showStatsExpansion)}
              className="w-full py-1 text-center text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1 pt-2 border-t border-slate-100 cursor-pointer"
            >
              <span>{showStatsExpansion ? 'طي الإحصائيات' : 'عرض وتوسيع الإحصائيات'}</span>
              {showStatsExpansion ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {/* Search Box in Hierarchy View */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="...ابحث بالـ ID أو معرف GID أو اسم الوكيل أو اسم الوكالة"
              className="w-full bg-white text-slate-900 py-3 pr-10 pl-4 rounded-2xl text-xs font-bold placeholder-slate-400 shadow-md border border-slate-200 focus:outline-none text-right"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          </div>

          {/* Hierarchy Roles Guide Banner (التفريق بين مندوب المدير ووسيط الوكيل) */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-blue-500/10 to-purple-500/10 border border-amber-500/30 text-slate-200 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-black text-amber-300 flex items-center gap-1.5 text-xs">
                <Crown className="w-4 h-4 text-amber-400" />
                <span>الهيكل الإداري والتتبع الهرمي للوكالات</span>
              </span>
              <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-bold">توضيح الأدوار والصلاحيات</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
              <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/20 text-amber-100 flex items-start gap-2">
                <Users className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-300 block font-black">المندوب (تابع لمدير الوكالات):</strong>
                  <span className="text-[10px] text-amber-200/80 leading-relaxed">مندوب خاص بالإدارة مسؤول عن استدعاء واستقطاب الوكالات الرسمية ومتابعة تراخيصها.</span>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-500/20 text-blue-100 flex items-start gap-2">
                <UserCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-blue-300 block font-black">الوسيط (تابع للوكيل المعتمد):</strong>
                  <span className="text-[10px] text-blue-200/80 leading-relaxed">وسيط خاص بالوكالة مسؤول عن استقطاب وإدارة المضيفين والمذيعين، وله حصة وسيط (Broker Split).</span>
                </div>
              </div>
            </div>
          </div>

          {/* Agencies List Title Bar */}
          <div className="flex items-center justify-between text-xs font-black text-amber-400 px-1">
            <div className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>الوكالات الرسمية التابعة للإداري</span>
            </div>
            <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-xl text-[11px] font-mono text-amber-300">
              2 من 2 وكالات
            </span>
          </div>

          {/* Agency Card 1: وكالة الأساطير الذهبية */}
          <div className="bg-white rounded-3xl p-4 text-slate-900 shadow-xl space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div 
                  onClick={() => handleOpenAgencyFullscreen({
                    name: 'وكالة الأساطير الذهبية',
                    gid: '30032',
                    agentName: 'فهد العتيبي (الوكيل الذهبي)',
                    hosts: 28,
                    brokers: '6 / 11 وسيط',
                    totalDiamonds: '3,469,755',
                    income: '$48,500',
                    profitIncome: '$19,400',
                    growth: '+12.4%',
                    country: 'المملكة العربية السعودية',
                    logoEmoji: '🏢',
                    logoGradient: 'from-indigo-500 via-purple-500 to-pink-400',
                    commissionRate: '0.80',
                    level: 'المستوى الذهبي 🌟'
                  })}
                  className="relative cursor-pointer group"
                  title="اضغط لفتح الشاشة الكاملة للوكالة"
                >
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-purple-500 via-indigo-500 to-pink-400 p-[2px] shadow group-hover:scale-105 transition-transform">
                    <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-400 flex items-center justify-center">
                        <span className="text-xl">🏢</span>
                      </div>
                    </div>
                  </div>
                  {/* Green status indicator dot at bottom left */}
                  <span className="absolute -bottom-0.5 -left-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                  <span className="absolute inset-0 rounded-2xl bg-black/25 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                    <Maximize2 className="w-4 h-4" />
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 
                      onClick={() => handleOpenAgencyFullscreen({
                        name: 'وكالة الأساطير الذهبية',
                        gid: '30032',
                        agentName: 'فهد العتيبي (الوكيل الذهبي)',
                        hosts: 28,
                        brokers: '6 / 11 وسيط',
                        totalDiamonds: '3,469,755',
                        income: '$48,500',
                        profitIncome: '$19,400',
                        growth: '+12.4%',
                        country: 'المملكة العربية السعودية',
                        logoEmoji: '🏢',
                        logoGradient: 'from-indigo-500 via-purple-500 to-pink-400',
                        commissionRate: '0.80',
                        level: 'المستوى الذهبي 🌟'
                      })}
                      className="text-sm font-black text-slate-900 cursor-pointer hover:text-amber-600 transition-colors"
                    >
                      وكالة الأساطير الذهبية
                    </h3>
                    <Info 
                      onClick={() => handleOpenAgencyFullscreen({
                        name: 'وكالة الأساطير الذهبية',
                        gid: '30032',
                        agentName: 'فهد العتيبي (الوكيل الذهبي)',
                        hosts: 28,
                        brokers: '6 / 11 وسيط',
                        totalDiamonds: '3,469,755',
                        income: '$48,500',
                        profitIncome: '$19,400',
                        growth: '+12.4%',
                        country: 'المملكة العربية السعودية',
                        logoEmoji: '🏢',
                        logoGradient: 'from-indigo-500 via-purple-500 to-pink-400',
                        commissionRate: '0.80',
                        level: 'المستوى الذهبي 🌟'
                      })}
                      className="w-3.5 h-3.5 text-slate-400 hover:text-amber-600 cursor-pointer" 
                    />
                  </div>
                  <p className="text-xs font-bold text-amber-700 mt-0.5">
                    الوكيل: <span className="text-amber-800 font-black">فهد العتيبي (الوكيل الذهبي)</span>
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1.5">
                <div className="flex items-center gap-1">
                  <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-black border border-blue-200 flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" />
                    <span>ارتفاع</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-black border border-emerald-300">
                    وكالة معتمدة
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => handleOpenSalarySlip({
                      name: 'وكالة الأساطير الذهبية',
                      gid: '30032',
                      agentName: 'فهد العتيبي (الوكيل الذهبي)',
                      month: '2026/08',
                      totalSalary: '50',
                      frozenProfits: '$0.00',
                      baseCommission: '63',
                      unlockedCommission: '12',
                      agencyDiamondsReceived: '3,469,755',
                      agencyCommissionRate: '0.8',
                      brokerShare: '30',
                      sentSalaryCoins: '20',
                      coinTransfers: [
                        { amount: 1, time: '2026-08-27T04:42:03Z' },
                        { amount: 3, time: '2026-08-23T04:35:21Z' },
                        { amount: 1, time: '2026-08-18T04:29:42Z' },
                        { amount: 5, time: '2026-08-15T04:26:42Z' },
                        { amount: 4, time: '2026-08-09T04:15:54Z' },
                        { amount: 1, time: '2026-08-08T04:15:52Z' },
                        { amount: 1, time: '2026-08-06T04:10:19Z' },
                      ],
                      hostDataFile: 'salary_30032_2026-08-01.xlsx',
                      logoEmoji: '🏢',
                      logoGradient: 'from-indigo-500 via-purple-500 to-pink-400'
                    })}
                    className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 rounded-lg text-[10px] font-black text-amber-900 flex items-center gap-1 cursor-pointer border border-amber-300 shadow-sm"
                  >
                    <FileText className="w-3 h-3 text-amber-700" />
                    <span>قسيمة الراتب</span>
                  </button>
                  <button 
                    onClick={() => {
                      showToast('تم تعديل قفل الوكالة');
                    }}
                    className="p-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 border border-slate-300 cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* GID and Country */}
            <div className="grid grid-cols-2 gap-2 text-xs py-1 border-y border-slate-100 font-bold">
              <div>
                <span className="text-slate-400 block text-[10px]">GID:</span>
                <span className="text-slate-900 font-mono text-sm font-black">30032</span>
              </div>
              <div className="text-left">
                <span className="text-slate-400 block text-[10px]">الدولة:</span>
                <span className="text-slate-800 text-xs font-black">المملكة العربية السعودية</span>
              </div>
            </div>

            {/* Rows for Hosts and Brokers */}
            <div className="space-y-1.5 text-xs font-bold">
              <div 
                onClick={() => handleOpenHostCenter('وكالة الأساطير الذهبية', '30032', 28)}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-amber-50/70 border border-slate-200 hover:border-amber-300 cursor-pointer transition-all active:scale-[0.99]"
              >
                <span className="text-slate-700 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-amber-600" />
                  <span>عدد المضيفين (مركز المذيعين):</span>
                </span>
                <div className="flex items-center gap-1 text-slate-900 font-mono font-black">
                  <span className="text-emerald-700">28 مضيف</span>
                  <ChevronLeft className="w-4 h-4 text-slate-400" />
                </div>
              </div>

              <div 
                onClick={() => handleOpenBrokersMenu('وكالة الأساطير الذهبية', '30032', 11)}
                className="flex items-center justify-between p-2.5 rounded-xl bg-blue-50/70 hover:bg-blue-100/80 border border-blue-200 hover:border-blue-400 cursor-pointer transition-all active:scale-[0.99] shadow-sm"
              >
                <div>
                  <span className="text-slate-800 flex items-center gap-1.5 text-xs font-black">
                    <UserCheck className="w-4 h-4 text-blue-600" />
                    <span>الوسطاء التابعين للوكيل:</span>
                  </span>
                  <span className="text-[10px] text-blue-700 font-medium">إدارة المذيعين والمضيفين • حصة الوسيط</span>
                </div>
                <div className="flex items-center gap-1 text-slate-900 font-mono font-black">
                  <span className="text-emerald-700">{brokersList.length}</span>
                  <span className="text-slate-500">/ 11 وسيط</span>
                  <ChevronLeft className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Income breakdown */}
            <div className="space-y-1.5 pt-1 font-bold">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-700 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  <span>إجمالي دخل الماسات:</span>
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-blue-600 font-mono font-black text-sm">$48,500</span>
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-md text-[10px] font-mono font-black flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" />
                    <span>+12.4% ارتفاع</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-700">إجمالي دخل الأرباح:</span>
                <span className="text-emerald-600 font-mono font-black text-sm">$19,400</span>
              </div>
            </div>

            {/* Expanded Detailed Statistics - EXACT MATCH FROM SCREENSHOT */}
            {expandedAgencies['30032'] && (
              <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs font-bold animate-in fade-in duration-200">
                {/* إجمالي الماسات لهذا الشهر */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-700">إجمالي الماسات لهذا الشهر</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-900 font-mono font-black text-sm">3,469,755</span>
                    <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-black border border-blue-200 flex items-center gap-0.5">
                      <TrendingUp className="w-3 h-3" />
                      <span>ارتفاع</span>
                    </span>
                  </div>
                </div>

                {/* نسبة العمولة */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-700">نسبة العمولة</span>
                  <span className="text-slate-900 font-mono font-black text-sm">0.8</span>
                </div>

                {/* التقدم المتبقي للمستوى التالي */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-700">التقدم المتبقي للمستوى التالي</span>
                  <span className="text-slate-900 font-mono font-black text-sm">46,530,245</span>
                </div>

                {/* الماسات لنفس الفترة من الشهر الماضي */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-700">الماسات لنفس الفترة من الشهر الماضي</span>
                  <span className="text-slate-900 font-mono font-black text-sm">2,350,110</span>
                </div>

                {/* إجمالي الماسات الشهر الماضي */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-700">إجمالي الماسات الشهر الماضي</span>
                  <span className="text-slate-900 font-mono font-black text-sm">2,980,450</span>
                </div>

                {/* مقابل نفس الفترة من الشهر الماضي */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-700">مقابل نفس الفترة من الشهر الماضي</span>
                  <span className="px-3 py-1 bg-sky-50 text-sky-600 border border-sky-200 rounded-full text-xs font-mono font-black flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>+47.64%</span>
                  </span>
                </div>

                {/* مقابل الشهر الماضي */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-700">مقابل الشهر الماضي</span>
                  <span className="px-3 py-1 bg-sky-50 text-sky-600 border border-sky-200 rounded-full text-xs font-mono font-black flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>+16.42%</span>
                  </span>
                </div>
              </div>
            )}

            {/* Expand / Collapse toggle */}
            <button
              onClick={() => toggleAgencyExpand('30032')}
              className="w-full py-1 text-center text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1 pt-2 border-t border-slate-100 cursor-pointer"
            >
              <span>{expandedAgencies['30032'] ? 'طي' : 'توسيع'}</span>
              {expandedAgencies['30032'] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {/* Agency Card 2: وكالة المجد */}
          <div className="bg-white rounded-3xl p-4 text-slate-900 shadow-xl space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div 
                  onClick={() => handleOpenAgencyFullscreen({
                    name: 'وكالة المجد',
                    gid: '77192',
                    agentName: 'خالد الزهراني',
                    hosts: 19,
                    brokers: '4 / 8 وسيط',
                    totalDiamonds: '2,890,110',
                    income: '$36,200',
                    profitIncome: '$14,800',
                    growth: '-8.98%',
                    country: 'المملكة العربية السعودية',
                    logoEmoji: '🏢',
                    logoGradient: 'from-amber-300 via-rose-400 to-pink-500',
                    commissionRate: '0.75',
                    level: 'المستوى الفضي 🥈'
                  })}
                  className="relative cursor-pointer group"
                  title="اضغط لفتح الشاشة الكاملة للوكالة"
                >
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-400 to-pink-500 p-[2px] shadow group-hover:scale-105 transition-transform">
                    <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-amber-300 via-rose-400 to-pink-500 flex items-center justify-center">
                        <span className="text-xl">🏢</span>
                      </div>
                    </div>
                  </div>
                  {/* Green status indicator dot at bottom left */}
                  <span className="absolute -bottom-0.5 -left-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                  <span className="absolute inset-0 rounded-2xl bg-black/25 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                    <Maximize2 className="w-4 h-4" />
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 
                      onClick={() => handleOpenAgencyFullscreen({
                        name: 'وكالة المجد',
                        gid: '77192',
                        agentName: 'خالد الزهراني',
                        hosts: 19,
                        brokers: '4 / 8 وسيط',
                        totalDiamonds: '2,890,110',
                        income: '$36,200',
                        profitIncome: '$14,800',
                        growth: '-8.98%',
                        country: 'المملكة العربية السعودية',
                        logoEmoji: '🏢',
                        logoGradient: 'from-amber-300 via-rose-400 to-pink-500',
                        commissionRate: '0.75',
                        level: 'المستوى الفضي 🥈'
                      })}
                      className="text-sm font-black text-slate-900 cursor-pointer hover:text-amber-600 transition-colors"
                    >
                      وكالة المجد
                    </h3>
                    <Info 
                      onClick={() => handleOpenAgencyFullscreen({
                        name: 'وكالة المجد',
                        gid: '77192',
                        agentName: 'خالد الزهراني',
                        hosts: 19,
                        brokers: '4 / 8 وسيط',
                        totalDiamonds: '2,890,110',
                        income: '$36,200',
                        profitIncome: '$14,800',
                        growth: '-8.98%',
                        country: 'المملكة العربية السعودية',
                        logoEmoji: '🏢',
                        logoGradient: 'from-amber-300 via-rose-400 to-pink-500',
                        commissionRate: '0.75',
                        level: 'المستوى الفضي 🥈'
                      })}
                      className="w-3.5 h-3.5 text-slate-400 hover:text-amber-600 cursor-pointer" 
                    />
                  </div>
                  <p className="text-xs font-bold text-amber-700 mt-0.5">
                    الوكيل: <span className="text-amber-800 font-black">خالد الزهراني</span>
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1.5">
                <div className="flex items-center gap-1">
                  <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 text-[10px] font-black border border-rose-200 flex items-center gap-0.5">
                    <TrendingDown className="w-3 h-3" />
                    <span>انخفاض</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-black border border-emerald-300">
                    وكالة معتمدة
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => handleOpenSalarySlip({
                      name: 'وكالة المجد',
                      gid: '77192',
                      agentName: 'خالد الزهراني',
                      month: '2026/08',
                      totalSalary: '42',
                      frozenProfits: '$0.00',
                      baseCommission: '55',
                      unlockedCommission: '13',
                      agencyDiamondsReceived: '2,890,110',
                      agencyCommissionRate: '0.75',
                      brokerShare: '25',
                      sentSalaryCoins: '16',
                      coinTransfers: [
                        { amount: 2, time: '2026-08-25T11:20:00Z' },
                        { amount: 4, time: '2026-08-20T09:15:00Z' },
                        { amount: 5, time: '2026-08-14T08:10:00Z' },
                        { amount: 5, time: '2026-08-05T07:05:00Z' },
                      ],
                      hostDataFile: 'salary_77192_2026-08-01.xlsx',
                      logoEmoji: '🏢',
                      logoGradient: 'from-amber-300 via-rose-400 to-pink-500'
                    })}
                    className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 rounded-lg text-[10px] font-black text-amber-900 flex items-center gap-1 cursor-pointer border border-amber-300 shadow-sm"
                  >
                    <FileText className="w-3 h-3 text-amber-700" />
                    <span>قسيمة الراتب</span>
                  </button>
                  <button 
                    onClick={() => {
                      showToast('تم تعديل قفل الوكالة');
                    }}
                    className="p-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 border border-slate-300 cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* GID and Country */}
            <div className="grid grid-cols-2 gap-2 text-xs py-1 border-y border-slate-100 font-bold">
              <div>
                <span className="text-slate-400 block text-[10px]">GID:</span>
                <span className="text-slate-900 font-mono text-sm font-black">77192</span>
              </div>
              <div className="text-left">
                <span className="text-slate-400 block text-[10px]">الدولة:</span>
                <span className="text-slate-800 text-xs font-black">المملكة العربية السعودية</span>
              </div>
            </div>

            {/* Rows for Hosts and Brokers */}
            <div className="space-y-1.5 text-xs font-bold">
              <div 
                onClick={() => handleOpenHostCenter('وكالة المجد', '77192', 19)}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-amber-50/70 border border-slate-200 hover:border-amber-300 cursor-pointer transition-all active:scale-[0.99]"
              >
                <span className="text-slate-700 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-amber-600" />
                  <span>عدد المضيفين (مركز المذيعين):</span>
                </span>
                <div className="flex items-center gap-1 text-slate-900 font-mono font-black">
                  <span className="text-emerald-700">19 مضيف</span>
                  <ChevronLeft className="w-4 h-4 text-slate-400" />
                </div>
              </div>

              <div 
                onClick={() => handleOpenBrokersMenu('وكالة المجد', '77192', 8)}
                className="flex items-center justify-between p-2.5 rounded-xl bg-blue-50/70 hover:bg-blue-100/80 border border-blue-200 hover:border-blue-400 cursor-pointer transition-all active:scale-[0.99] shadow-sm"
              >
                <div>
                  <span className="text-slate-800 flex items-center gap-1.5 text-xs font-black">
                    <UserCheck className="w-4 h-4 text-blue-600" />
                    <span>الوسطاء التابعين للوكيل:</span>
                  </span>
                  <span className="text-[10px] text-blue-700 font-medium">إدارة المذيعين والمضيفين • حصة الوسيط</span>
                </div>
                <div className="flex items-center gap-1 text-slate-900 font-mono font-black">
                  <span className="text-emerald-700">4</span>
                  <span className="text-slate-500">/ 8 وسيط</span>
                  <ChevronLeft className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Income breakdown */}
            <div className="space-y-1.5 pt-1 font-bold">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-700 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  <span>إجمالي دخل الماسات:</span>
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-blue-600 font-mono font-black text-sm">$36,200</span>
                  <span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-md text-[10px] font-mono font-black flex items-center gap-0.5">
                    <TrendingDown className="w-3 h-3" />
                    <span>-3.8% انخفاض</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-700">إجمالي دخل الأرباح:</span>
                <span className="text-emerald-600 font-mono font-black text-sm">$14,480</span>
              </div>
            </div>

            {/* Expanded Detailed Statistics */}
            {expandedAgencies['77192'] && (
              <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs font-bold animate-in fade-in duration-200">
                {/* إجمالي الماسات لهذا الشهر */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-700">إجمالي الماسات لهذا الشهر</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-900 font-mono font-black text-sm">2,840,120</span>
                    <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 text-[10px] font-black border border-rose-200 flex items-center gap-0.5">
                      <TrendingDown className="w-3 h-3" />
                      <span>انخفاض</span>
                    </span>
                  </div>
                </div>

                {/* نسبة العمولة */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-700">نسبة العمولة</span>
                  <span className="text-slate-900 font-mono font-black text-sm">0.75</span>
                </div>

                {/* التقدم المتبقي للمستوى التالي */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-700">التقدم المتبقي للمستوى التالي</span>
                  <span className="text-slate-900 font-mono font-black text-sm">12,159,880</span>
                </div>

                {/* الماسات لنفس الفترة من الشهر الماضي */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-700">الماسات لنفس الفترة من الشهر الماضي</span>
                  <span className="text-slate-900 font-mono font-black text-sm">3,120,400</span>
                </div>

                {/* إجمالي الماسات الشهر الماضي */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-700">إجمالي الماسات الشهر الماضي</span>
                  <span className="text-slate-900 font-mono font-black text-sm">3,450,900</span>
                </div>

                {/* مقابل نفس الفترة من الشهر الماضي */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-700">مقابل نفس الفترة من الشهر الماضي</span>
                  <span className="px-3 py-1 bg-rose-50 text-rose-600 border border-rose-200 rounded-full text-xs font-mono font-black flex items-center gap-1">
                    <TrendingDown className="w-3.5 h-3.5" />
                    <span>-8.98%</span>
                  </span>
                </div>

                {/* مقابل الشهر الماضي */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-700">مقابل الشهر الماضي</span>
                  <span className="px-3 py-1 bg-rose-50 text-rose-600 border border-rose-200 rounded-full text-xs font-mono font-black flex items-center gap-1">
                    <TrendingDown className="w-3.5 h-3.5" />
                    <span>-17.70%</span>
                  </span>
                </div>
              </div>
            )}

            {/* Expand / Collapse toggle */}
            <button
              onClick={() => toggleAgencyExpand('77192')}
              className="w-full py-1 text-center text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1 pt-2 border-t border-slate-100 cursor-pointer"
            >
              <span>{expandedAgencies['77192'] ? 'طي' : 'توسيع'}</span>
              {expandedAgencies['77192'] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {/* Bottom Bar: Return or Freeze */}
          <div className="bg-[#0e1626] border border-slate-800 rounded-2xl p-3 flex items-center justify-between">
            <button
              onClick={() => setViewMode('main')}
              className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white"
            >
              <Eye className="w-4 h-4 text-amber-400" />
              <span>عرض التتبع الهرمي والوكلاء</span>
            </button>

            <button
              onClick={() => {
                setIsFrozen(!isFrozen);
                showToast(isFrozen ? 'تم إلغاء التجميد' : 'تم تجميد الحساب');
              }}
              className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>

        </div>
      ) : (
        /* ========================================================================= */
        /* VIEW MODE: MAIN OFFICIAL HUB (الصور رقم 1 و 2) */
        /* ========================================================================= */
        <div className="space-y-4 max-w-xl mx-auto">
          
          {/* 1. Yellow Big Button: "إضافة مدير وكالات جديد +" */}
          <button
            onClick={() => setShowAddManagerModal(true)}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-sm shadow-[0_4px_20px_rgba(245,158,11,0.35)] flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
          >
            <UserPlus className="w-5 h-5 stroke-[2.5]" />
            <span>إضافة مدير وكالات جديد +</span>
          </button>

          {/* 2. Dark Manager Dropdown Selector: "مدير الوكالات: 👑 (ID: 1001001 / MGR-9901) أحمد المنصوري" */}
          <div className="w-full bg-[#0d1527] border border-slate-800 rounded-2xl p-3 flex items-center justify-between text-xs font-bold text-slate-200">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-[11px]">مدير عام الإدارة:</span>
              <span className="text-white font-black">أحمد المنصوري (MGR-9901)</span>
              <span className="font-mono text-amber-300" dir="ltr">(ID: 1001001)</span>
              <span className="text-amber-400">👑</span>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </div>

          {/* 3. Small ID input row with Search icon on right and "تأكيد" on left */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchAdminId}
                onChange={(e) => setSearchAdminId(e.target.value)}
                placeholder="1001001 أو MGR-9901"
                className="w-full bg-white text-slate-900 py-2.5 pr-10 pl-4 rounded-2xl text-xs font-black font-mono shadow border border-slate-200 focus:outline-none text-right"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>
            <button
              onClick={() => showToast(`تم تأكيد معرف الإداري: ${searchAdminId}`)}
              className="px-6 py-2.5 rounded-2xl bg-white text-slate-950 font-black text-xs shadow hover:bg-slate-100 cursor-pointer active:scale-95 transition-all"
            >
              تأكيد
            </button>
          </div>

          {/* 4. Wide Search Bar: "(ID)... ابحث بالاسم أو معرف الإداري" */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="... (ID) ابحث بالاسم أو معرف الإداري (1001001 / MGR-9901)"
              className="w-full bg-white text-slate-900 py-3 pr-10 pl-4 rounded-2xl text-xs font-bold placeholder-slate-400 shadow border border-slate-200 focus:outline-none text-right"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          </div>

          {/* 5. MAIN MANAGER WHITE CARD (الصورة 1 و 2) */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 text-slate-900 shadow-2xl space-y-3.5">
            
            {/* Top Badges */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-start gap-1">
                <span className="px-3.5 py-0.5 rounded-full bg-teal-700 text-white text-[11px] font-black flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                  نشط
                </span>
                <span className="text-[11px] font-mono font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200">
                  ID: 1001001 • MGR-9901
                </span>
              </div>

              <div className="px-3.5 py-1.5 rounded-xl bg-blue-50 text-blue-700 text-xs font-black border border-blue-200 flex items-center gap-1 shadow-sm">
                <span>ارتفاع الوكالات (+46.00%)</span>
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex items-center gap-3.5 pt-1">
              <div 
                onClick={handleOpenManagerFullscreen}
                className="relative cursor-pointer group"
                title="اضغط لفتح الشاشة الكاملة للمدير"
              >
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                  alt="سالم الكعبي"
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400 shadow-md group-hover:scale-105 transition-transform"
                />
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                <span className="absolute inset-0 rounded-2xl bg-black/25 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                  <Maximize2 className="w-5 h-5" />
                </span>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h2 
                    onClick={handleOpenManagerFullscreen}
                    className="text-base font-black text-slate-900 cursor-pointer hover:text-amber-600 transition-colors"
                  >
                    أحمد المنصوري (MGR-9901)
                  </h2>
                  <Info 
                    onClick={handleOpenManagerFullscreen}
                    className="w-4 h-4 text-slate-400 hover:text-amber-600 cursor-pointer" 
                  />
                </div>
                <div className="text-xs font-bold text-slate-600 flex items-center gap-1 mt-0.5">
                  <span>مدير عام الوكالات والإدارة</span>
                  <span>🔱</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 font-black">#1001001</span>
                </div>
                <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-1">
                  <span>🇸🇦 الرياض</span>
                  <span>•</span>
                  <span>انضم: 2026-02-10</span>
                </div>
              </div>
            </div>

            {/* EXPANDABLE STATS ACCORDION (كما في الصورة 2) */}
            <AnimatePresence>
              {showStatsExpansion && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 pt-2 border-t border-slate-100 overflow-hidden"
                >
                  {/* Card: إجمالي الألماسات لهذا الشهر */}
                  <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-200 flex items-center justify-between">
                    <span className="text-xs font-black text-slate-800">إجمالي الألماسات لهذا الشهر</span>
                    <div className="flex items-center gap-2" dir="ltr">
                      <span className="text-blue-700 font-mono font-black text-sm flex items-center gap-1">
                        <span>💎</span>
                        <span>5,948,082</span>
                      </span>
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-md text-[10px] font-mono font-black flex items-center gap-0.5">
                        <TrendingUp className="w-3 h-3" />
                        +46%
                      </span>
                    </div>
                  </div>

                  {/* Card: نسبة العمولة */}
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-black text-slate-800">نسبة العمولة</span>
                    <span className="text-slate-900 font-mono font-black text-sm" dir="ltr">0.80</span>
                  </div>

                  {/* Card: التقدم المتبقي للمستوى التالي */}
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-black text-slate-800">التقدم المتبقي للمستوى التالي</span>
                    <span className="text-slate-900 font-mono font-black text-sm" dir="ltr">44,051,918</span>
                  </div>

                  {/* Card: الألماسات لنفس فترة من هذا الشهر الماضي */}
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-black text-slate-800">الألماسات لنفس فترة من هذا الشهر الماضي</span>
                    <div className="flex items-center gap-2" dir="ltr">
                      <span className="text-slate-900 font-mono font-black text-sm">4,074,134</span>
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-md text-[10px] font-mono font-black flex items-center gap-0.5">
                        <TrendingUp className="w-3 h-3" />
                        +46.00%
                      </span>
                    </div>
                  </div>

                  {/* Card: إجمالي الألماسات الشهر الماضي */}
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-black text-slate-800">إجمالي الألماسات الشهر الماضي</span>
                    <div className="flex items-center gap-2" dir="ltr">
                      <span className="text-slate-900 font-mono font-black text-sm">4,895,304</span>
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-md text-[10px] font-mono font-black flex items-center gap-0.5">
                        <TrendingUp className="w-3 h-3" />
                        +21.51%
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Toggle Button for Stats */}
            <button
              onClick={() => setShowStatsExpansion(!showStatsExpansion)}
              className="w-full py-1 text-center text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1 pt-1 cursor-pointer"
            >
              <span>{showStatsExpansion ? 'طي الإحصائيات' : 'عرض وتوسيع الإحصائيات'}</span>
              {showStatsExpansion ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {/* Main Stats List */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs font-bold text-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-slate-800 font-black text-xs">وقت الانضمام:</span>
                <span className="text-slate-500 font-mono text-[11px]" dir="ltr">2026-02-10T12:00:00Z</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-800 font-black text-xs">مشاركة الأرباح:</span>
                <span className="text-slate-900 font-mono font-black text-sm" dir="ltr">55.00%</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-800 font-black text-xs">عدد الوكلاء المدعوين:</span>
                <span className="text-slate-900 font-mono font-black text-sm" dir="ltr">14</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-800 font-black text-xs">الوكلاء الجدد:</span>
                <span className="text-slate-900 font-mono font-black text-sm" dir="ltr">3</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-800 font-black text-xs flex items-center gap-1">
                  <span>إجمالي دخل الألماسات في الوكالة:</span>
                  <span>💎</span>
                </span>
                <span className="text-blue-600 font-mono font-black text-sm" dir="ltr">$ 4,700</span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-800 font-black text-xs">إجمالي دخل الوكالة العام:</span>
                <span className="text-emerald-600 font-mono font-black text-xl" dir="ltr">$ 80,000</span>
              </div>

              {/* Mandoob / Reps Row (المندوبين التابعين لمدير الوكالات وتفاصيلهم) */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 shadow-sm">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-slate-900 font-black text-xs block">المندوبين الخاصين بالإدارة</span>
                    <span className="text-slate-500 font-medium text-[10px]">تابعون لمدير الوكالات (استدعاء الوكالات الرسمية) • <strong className="text-amber-800">3 مندوبين</strong></span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setShowDetailsModal(true);
                    setManagerDetailsTab('reps');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs border border-amber-400 flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-sm"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>تفاصيل المندوبين</span>
                </button>
              </div>
            </div>

            {/* Bottom 2 Action Buttons (تم إلغاء زر تفاصيل المكرر ودمجه في تفاصيل المندوب) */}
            <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-slate-100">
              
              {/* Button 1: View Hierarchy Tree */}
              <button
                onClick={() => setViewMode('tree')}
                className="py-3 px-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white text-xs font-black flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95 transition-all"
              >
                <Eye className="w-4 h-4 text-amber-400" />
                <span>عرض التتبع الهرمي للوكالات</span>
              </button>

              {/* Button 2: Freeze / Suspend */}
              <button
                onClick={() => {
                  setIsFrozen(!isFrozen);
                  showToast(isFrozen ? 'تم إلغاء تجميد الحساب بنجاح' : 'تم إيقاف وتجميد حساب الإدارة');
                }}
                className={`py-3 px-3 rounded-2xl border text-xs font-black flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95 transition-all ${
                  isFrozen
                    ? 'bg-rose-100 border-rose-300 text-rose-800'
                    : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                }`}
              >
                <Lock className="w-4 h-4" />
                <span>{isFrozen ? 'مجمّد حالياً (فك القفل)' : 'إيقاف / تجميد'}</span>
              </button>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: MANDOOBIN (المندوبين الخاصين) DETAILS */}
      {/* ========================================================================= */}
      {showRepDetailsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" dir="rtl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-white rounded-3xl p-5 text-slate-900 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-600" />
                <h3 className="text-sm font-black text-slate-900">المندوبين الخاصين (استدعاء الوكالات)</h3>
              </div>
              <button onClick={() => setShowRepDetailsModal(false)} className="p-1 rounded-full hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="space-y-2.5 max-h-80 overflow-y-auto custom-scrollbar">
              {[
                { name: 'محمد المنصوري', id: 'REP-101', count: 6, totalDiamonds: '$ 24,000' },
                { name: 'ياسر العتيبي', id: 'REP-102', count: 5, totalDiamonds: '$ 32,500' },
                { name: 'طارق الحربي', id: 'REP-103', count: 3, totalDiamonds: '$ 18,200' },
              ].map((mandoob) => (
                <div key={mandoob.id} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                  <div>
                    <strong className="text-xs font-black text-slate-900 block">{mandoob.name}</strong>
                    <span className="text-[10px] text-slate-500 font-mono">معرف: {mandoob.id} • استدعى: {mandoob.count} وكالات</span>
                  </div>
                  <span className="text-xs font-mono font-black text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                    {mandoob.totalDiamonds}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowRepDetailsModal(false)}
              className="w-full py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl"
            >
              إغلاق
            </button>
          </motion.div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: ADD NEW MANAGER */}
      {/* ========================================================================= */}
      {showAddManagerModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" dir="rtl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-white rounded-3xl p-5 text-slate-900 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-amber-600" />
                <h3 className="text-sm font-black text-slate-900">إضافة مدير وكالات رسمي جديد</h3>
              </div>
              <button onClick={() => setShowAddManagerModal(false)} className="p-1 rounded-full hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-bold">
              <div>
                <label className="block text-slate-600 mb-1">معرف المستخدم (UID):</label>
                <input type="text" placeholder="مثال: 82639599" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">اسم المدير الكامل:</label>
                <input type="text" placeholder="مثال: سالم الكعبي" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">معرف الإدارة المقترح (ID):</label>
                <input type="text" defaultValue="AG9902" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono" />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">نسبة مشاركة الأرباح (%):</label>
                <input type="number" defaultValue={55} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono" />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => {
                  showToast('✅ تم إنشاء وتعيين مدير الوكالات الجديد بنجاح!');
                  setShowAddManagerModal(false);
                }}
                className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow"
              >
                تأكيد التعيين +
              </button>
              <button
                onClick={() => setShowAddManagerModal(false)}
                className="px-4 py-3 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
              >
                إلغاء
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: MANAGER DETAILS (تفاصيل ونشاط مدير الوكالات - الصور المرفقة 1 & 2) */}
      {/* ========================================================================= */}
      {showDetailsModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto" dir="rtl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`w-full ${
              isManagerModalFullScreen 
                ? 'max-w-6xl h-[95vh] rounded-[32px]' 
                : 'max-w-xl max-h-[92vh] rounded-[32px]'
            } bg-white p-5 sm:p-6 text-slate-900 shadow-2xl space-y-4 my-auto overflow-y-auto custom-scrollbar transition-all duration-300`}
          >
            {/* Header: Exact match with screenshot + Fullscreen Toggle */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
              {/* Left Close (X), Fullscreen Toggle and ID badge */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                  title="إغلاق"
                >
                  <X className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsManagerModalFullScreen(!isManagerModalFullScreen)}
                  className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                  title={isManagerModalFullScreen ? 'تصغير النافذة' : 'شاشة كاملة'}
                >
                  {isManagerModalFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <div className="px-3 py-1.5 rounded-2xl bg-amber-100/80 border border-amber-300 text-amber-900 text-[11px] font-mono font-black text-center leading-tight">
                  <span className="block text-[9px] text-amber-700">ID:</span>
                  <span>AG9901</span>
                </div>
              </div>

              {/* Center Title & Subtitle */}
              <div className="text-center flex-1">
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  تفاصيل ونشاط مدير الوكالات
                </h2>
                <p className="text-xs text-amber-600 font-bold mt-0.5">
                  سالم الكعبي (مدير الوكالات) <span className="text-[11px] font-medium">(مدير وكالات معتمد 🔱 مدير وكالات)</span>
                </p>
              </div>

              {/* Right Document Icon */}
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center shadow-sm">
                <FileText className="w-6 h-6 text-amber-600" />
              </div>
            </div>

            {/* 3 Top Tabs Navigation */}
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100/90 rounded-2xl text-xs font-black">
              <button
                onClick={() => setManagerDetailsTab('reps')}
                className={`py-2.5 px-1 rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-all ${
                  managerDetailsTab === 'reps'
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span className="truncate">المندوبين الخاصين بالمدير</span>
                <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center ${
                  managerDetailsTab === 'reps' ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  3
                </span>
              </button>

              <button
                onClick={() => setManagerDetailsTab('performance')}
                className={`py-2.5 px-1 rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-all ${
                  managerDetailsTab === 'performance'
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>الأداء والشهور</span>
              </button>

              <button
                onClick={() => setManagerDetailsTab('profile')}
                className={`py-2.5 px-1 rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-all ${
                  managerDetailsTab === 'profile'
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>الملف والبيانات الرسمية</span>
              </button>
            </div>

            {/* TAB 1: المندوبين الخاصين بالمدير (SCREENSHOT 1) */}
            {managerDetailsTab === 'reps' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                {/* Yellow Feature Banner */}
                <div className="p-4 rounded-3xl bg-amber-50/80 border border-amber-200 space-y-3 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow flex-shrink-0">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-black text-amber-950">
                        صلاحية مدير الوكالات بإضافة المندوبين
                      </h4>
                      <p className="text-[11px] leading-relaxed text-amber-900/90 font-medium">
                        يحق لمدير الوكالات (سالم الكعبي (مدير الوكالات)) إضافة وتعيين مندوبين خاصين به لاستدعاء وإضافة وكالات جديدة معتمدة تحت إشرافه، مع تتبع إحصائيات كل مندوب والوكالات المستدعاة من قبله.
                      </p>
                    </div>
                  </div>

                  {/* Add New Delegate Button */}
                  <button
                    onClick={() => setShowAddDelegateModal(true)}
                    className="w-full py-3 bg-amber-500 hover:bg-amber-600 active:scale-98 text-white font-black text-xs rounded-2xl shadow flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>إضافة مندوب جديد</span>
                  </button>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={repSearchQuery}
                    onChange={(e) => setRepSearchQuery(e.target.value)}
                    placeholder="ابحث في المندوبين بالاسم، المعرف، الجوال..."
                    className="w-full pl-3 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-all font-medium"
                  />
                  {repSearchQuery && (
                    <button
                      onClick={() => setRepSearchQuery('')}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Delegates List (3 Delegates from Screenshot 1) */}
                <div className="space-y-3.5 max-h-[50vh] overflow-y-auto custom-scrollbar pr-0.5">
                  {delegatesList
                    .filter(d => 
                      d.name.includes(repSearchQuery) || 
                      d.id.toLowerCase().includes(repSearchQuery.toLowerCase())
                    )
                    .map((delegate) => (
                      <div
                        key={delegate.id}
                        className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 space-y-3 hover:border-amber-300 transition-colors"
                      >
                        {/* Delegate Header Info */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h4 className="text-xs font-black text-slate-900">
                                {delegate.name} <span className="text-amber-600 font-bold">{delegate.title}</span>
                              </h4>
                            </div>

                            <div className="flex items-center gap-2 pt-0.5">
                              <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black">
                                {delegate.status}
                              </span>
                              <span className="px-2 py-0.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-mono font-black">
                                كود: {delegate.id}
                              </span>
                              {delegate.primaryUserId && (
                                <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-mono font-bold">
                                  UID: #{delegate.primaryUserId}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Avatar */}
                          <div className="w-12 h-12 rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex-shrink-0">
                            <img
                              src={delegate.avatar}
                              alt={delegate.name}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        </div>

                        {/* Invitation and Join Date Box */}
                        <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50/70 p-2 rounded-2xl border border-slate-100">
                          <div className="text-center p-1.5 bg-amber-50/80 border border-amber-200 rounded-xl">
                            <span className="text-[10px] text-amber-800 block">مدعو ومعتمد من قبل:</span>
                            <span className="font-bold text-amber-950 text-[10px] block truncate">
                              👑 {delegate.invitedBy}
                            </span>
                          </div>
                          <div className="text-center p-1.5 bg-white border border-slate-100 rounded-xl flex flex-col justify-center">
                            <span className="text-[10px] text-slate-500 block">انضم بتاريخ:</span>
                            <span className="font-mono font-bold text-slate-700 text-[10px] block" dir="ltr">
                              {delegate.joinDate}
                            </span>
                          </div>
                        </div>

                        {/* Action buttons row */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => showToast(`الملف الشخصي للمندوب: ${delegate.name}`)}
                            className="flex-1 py-1.5 px-2 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 rounded-xl text-xs font-black flex items-center justify-center gap-1 cursor-pointer transition-all active:scale-95"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>الملف الشخصي</span>
                          </button>

                          <button
                            onClick={() => setShowAddAgencyToRepModal(delegate.id)}
                            className="flex-1 py-1.5 px-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-black flex items-center justify-center gap-1 cursor-pointer transition-all active:scale-95"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>إضافة وكالة</span>
                          </button>

                          <button
                            onClick={() => {
                              setDelegatesList(prev => prev.map(d => d.id === delegate.id ? { ...d, isLocked: !d.isLocked } : d));
                              showToast(delegate.isLocked ? 'تم فتح الحساب' : 'تم قفل الحساب');
                            }}
                            className={`p-2 rounded-xl border text-xs font-bold flex items-center justify-center cursor-pointer transition-all ${
                              delegate.isLocked ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                            }`}
                          >
                            <Lock className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* 4-Grid Stats (عدد الوكالات، إجمالي الماسات، دخل الوكالات، عمولة المندوب) */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {/* عدد الوكالات المستدعاة */}
                          <div className="p-2.5 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-1">
                            <span className="text-[10px] text-slate-500 block">عدد الوكالات المستدعاة</span>
                            <span className="text-slate-900 font-mono font-black text-xs block">
                              {delegate.invitedAgenciesCount} وكالات
                            </span>
                          </div>

                          {/* إجمالي ألماسات الوكالات */}
                          <div className="p-2.5 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-1">
                            <span className="text-[10px] text-slate-500 block">إجمالي ألماسات الوكالات</span>
                            <span className="text-blue-600 font-mono font-black text-xs block flex items-center gap-1" dir="ltr">
                              <span>💎</span>
                              <span>{delegate.totalDiamonds}</span>
                            </span>
                          </div>

                          {/* إجمالي دخل الوكالات */}
                          <div className="p-2.5 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-1">
                            <span className="text-[10px] text-slate-500 block">إجمالي دخل الوكالات</span>
                            <span className="text-emerald-600 font-mono font-black text-xs block" dir="ltr">
                              {delegate.agenciesIncome}
                            </span>
                          </div>

                          {/* نسبة عمولة المندوب */}
                          <div className="p-2.5 rounded-2xl bg-amber-50/50 border border-amber-100 space-y-1">
                            <span className="text-[10px] text-slate-500 block">نسبة عمولة المندوب</span>
                            <span className="text-amber-600 font-mono font-black text-xs block" dir="ltr">
                              {delegate.commissionRate}
                            </span>
                          </div>
                        </div>

                        {/* Accordion toggle: الوكالات التي تم استدعاؤها وإضافتها */}
                        <div className="border-t border-slate-100 pt-2">
                          <button
                            onClick={() => setExpandedRepAgencies(prev => ({ ...prev, [delegate.id]: !prev[delegate.id] }))}
                            className="w-full flex items-center justify-between text-xs font-bold text-slate-700 hover:text-amber-700 p-1 cursor-pointer transition-colors"
                          >
                            <span className="flex items-center gap-1.5 text-[11px]">
                              <span>🏛️</span>
                              <span>الوكالات التي تم استدعاؤها وإضافتها بواسطة هذا المندوب ({delegate.invitedAgenciesCount}):</span>
                            </span>
                            <span className="text-sky-600 text-[11px] flex items-center gap-0.5">
                              <span>عرض قائمة الوكالات</span>
                              {expandedRepAgencies[delegate.id] ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </span>
                          </button>

                          {/* Expanded Agencies List */}
                          {expandedRepAgencies[delegate.id] && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="space-y-1.5 pt-2"
                            >
                              {delegate.agencies.map((agency, idx) => (
                                <div
                                  key={idx}
                                  className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between"
                                >
                                  <div>
                                    <strong className="text-slate-900 block text-[11px] font-black">{agency.name}</strong>
                                    <span className="text-[10px] text-slate-500 font-mono">
                                      كود الوكالة: {agency.gid} {agency.agentId ? `(المعرف: #${agency.agentId})` : ''} • {agency.hosts} مضيف
                                    </span>
                                  </div>
                                  <div className="text-left" dir="ltr">
                                    <span className="text-emerald-600 font-mono font-black text-xs block">{agency.income}</span>
                                    <span className="text-[10px] text-blue-600 font-mono font-bold">💎 {agency.diamonds}</span>
                                  </div>
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* TAB 2: الأداء والشهور */}
            {managerDetailsTab === 'performance' && (
              <div className="space-y-3 animate-in fade-in duration-200 max-h-[50vh] overflow-y-auto custom-scrollbar">
                <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-2xl flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">إجمالي الماسات التراكمية:</span>
                  <span className="font-mono font-black text-blue-700 text-sm">💎 38,500,000</span>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-black text-slate-800">سجل الأداء الشهري للوكالات المعتمدة:</h4>
                  {[
                    { month: 'أغسطس 2026 (الشهر الحالي)', diamonds: '3,469,755', profit: '$19,400', rate: '+16.42%', positive: true, agencies: 14 },
                    { month: 'يوليو 2026', diamonds: '2,980,450', profit: '$16,500', rate: '+12.10%', positive: true, agencies: 12 },
                    { month: 'يونيو 2026', diamonds: '2,450,100', profit: '$14,200', rate: '+8.40%', positive: true, agencies: 10 },
                    { month: 'مايو 2026', diamonds: '2,100,000', profit: '$12,800', rate: '+5.20%', positive: true, agencies: 8 },
                  ].map((row, idx) => (
                    <div key={idx} className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-slate-900">{row.month}</span>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold flex items-center gap-0.5 ${
                          row.positive ? 'bg-sky-50 text-sky-700 border border-sky-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          <TrendingUp className="w-3 h-3" />
                          {row.rate}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center text-[11px] bg-slate-50 p-2 rounded-xl">
                        <div>
                          <span className="text-[9px] text-slate-500 block">الماسات</span>
                          <span className="font-mono font-black text-slate-800">{row.diamonds}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-500 block">الأرباح</span>
                          <span className="font-mono font-black text-emerald-600">{row.profit}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-500 block">الوكالات</span>
                          <span className="font-mono font-black text-amber-600">{row.agencies}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: الملف والبيانات الرسمية (SCREENSHOT 2) */}
            {managerDetailsTab === 'profile' && (
              <div className="space-y-3 animate-in fade-in duration-200 max-h-[50vh] overflow-y-auto custom-scrollbar">
                
                {/* Profile Card Header with Avatar and Edit Button */}
                <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-sm flex items-center justify-between gap-3">
                  {/* Edit Button Left */}
                  <button
                    onClick={() => setShowEditProfileModal(true)}
                    className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-2xl text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-sm"
                  >
                    <Edit3 className="w-4 h-4 text-amber-700" />
                    <span>تعديل البيانات</span>
                  </button>

                  {/* Profile Info Center and Avatar Right */}
                  <div className="flex items-center gap-3 text-right">
                    <div className="space-y-1">
                      <h3 className="text-sm font-black text-slate-900">
                        سالم الكعبي
                      </h3>
                      <p className="text-xs font-bold text-slate-700">
                        (مدير الوكالات)
                      </p>
                      <p className="text-[11px] text-amber-600 font-black">
                        مدير وكالات معتمد 🔱 مدير وكالات
                      </p>
                      <div className="flex items-center gap-1.5 pt-0.5 justify-end">
                        <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black">
                          حساب إداري موثق
                        </span>
                        <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-mono text-[10px] font-bold">
                          ID: AG9901
                        </span>
                      </div>
                    </div>

                    {/* Avatar */}
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-md flex-shrink-0">
                      <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80"
                        alt="سالم الكعبي"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                </div>

                {/* Form Fields List (Screenshot 2 exact fields) */}
                <div className="space-y-2 text-xs font-bold">
                  {/* معرف المدير (ID) */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-3 flex items-center justify-between shadow-sm">
                    <span className="text-slate-600">معرف المدير والكود الوظيفي:</span>
                    <div className="flex items-center gap-1.5" dir="ltr">
                      <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 rounded-lg font-mono font-black text-xs">
                        MGR-9901
                      </span>
                      <span className="px-2.5 py-0.5 bg-slate-100 text-slate-800 rounded-lg font-mono font-black text-xs">
                        #1001001
                      </span>
                    </div>
                  </div>

                  {/* رقم الهاتف */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-3 flex items-center justify-between shadow-sm">
                    <span className="text-slate-600">رقم الهاتف:</span>
                    <span className="font-mono text-slate-900 font-black text-xs tracking-wider" dir="ltr">
                      +966 55 123 4567
                    </span>
                  </div>

                  {/* رقم الهوية الوطنية / الإقامة */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-3 flex items-center justify-between shadow-sm">
                    <span className="text-slate-600">رقم الهوية الوطنية / الإقامة:</span>
                    <span className="font-mono text-slate-900 font-black text-xs" dir="ltr">
                      1098765432
                    </span>
                  </div>

                  {/* بلد الإقامة */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-3 flex items-center justify-between shadow-sm">
                    <span className="text-slate-600">بلد الإقامة:</span>
                    <span className="text-slate-900 font-black text-xs">
                      المملكة العربية السعودية
                    </span>
                  </div>

                  {/* المدينة */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-3 flex items-center justify-between shadow-sm">
                    <span className="text-slate-600">المدينة:</span>
                    <span className="text-slate-900 font-black text-xs">
                      الرياض
                    </span>
                  </div>

                  {/* البريد الإلكتروني */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-3 flex items-center justify-between shadow-sm">
                    <span className="text-slate-600">البريد الإلكتروني:</span>
                    <span className="font-mono text-slate-900 font-black text-xs" dir="ltr">
                      salem.alkaabi@agency.net
                    </span>
                  </div>

                  {/* نسبة مشاركة الأرباح */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-3 flex items-center justify-between shadow-sm">
                    <span className="text-slate-600">نسبة مشاركة الأرباح:</span>
                    <span className="font-mono text-emerald-600 font-black text-sm" dir="ltr">
                      55.00%
                    </span>
                  </div>

                  {/* تاريخ الانضمام */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-3 flex items-center justify-between shadow-sm">
                    <span className="text-slate-600">تاريخ الانضمام:</span>
                    <span className="font-mono text-slate-800 font-bold text-xs" dir="ltr">
                      2026-02-10T12:00:00Z
                    </span>
                  </div>
                </div>

              </div>
            )}

            {/* Bottom Full Width Dark Close Button */}
            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="w-full py-3.5 bg-slate-900 hover:bg-black text-white font-black text-sm rounded-2xl shadow-lg cursor-pointer active:scale-98 transition-all"
              >
                إغلاق
              </button>
            </div>

          </motion.div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3.1: ADD DELEGATE MODAL (إضافة مندوب جديد للمدير) */}
      {/* ========================================================================= */}
      {showAddDelegateModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4" dir="rtl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-white rounded-3xl p-5 text-slate-900 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-amber-600" />
                <h3 className="text-sm font-black text-slate-900">إضافة مندوب استقطاب وتعيين للوكالات</h3>
              </div>
              <button onClick={() => setShowAddDelegateModal(false)} className="p-1 rounded-full hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-bold">
              <div>
                <label className="block text-slate-600 mb-1">اسم المندوب الكامل:</label>
                <input type="text" placeholder="مثال: فهد الدوسري" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">معرف المندوب (ID):</label>
                <input type="text" defaultValue={`DEL-${Math.floor(100 + Math.random() * 900)}`} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono" />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">نسبة العمولة (%):</label>
                <input type="text" defaultValue="12.00%" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono" />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">المشرف المعتمد:</label>
                <input type="text" disabled value="أحمد المنصوري (MGR-9901 - المعرف: 1001001)" className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-700 font-bold" />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => {
                  showToast('✅ تم إضافة المندوب بنجاح واعتماده تحت إدارة أحمد المنصوري (MGR-9901)');
                  setShowAddDelegateModal(false);
                }}
                className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-white font-black text-xs rounded-xl shadow"
              >
                تأكيد الإضافة +
              </button>
              <button
                onClick={() => setShowAddDelegateModal(false)}
                className="px-4 py-3 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
              >
                إلغاء
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3.2: ADD AGENCY FOR DELEGATE (إضافة وكالة عبر المندوب) */}
      {/* ========================================================================= */}
      {showAddAgencyToRepModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4" dir="rtl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-white rounded-3xl p-5 text-slate-900 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-600" />
                <h3 className="text-sm font-black text-slate-900">ربط وإضافة وكالة جديدة للمندوب</h3>
              </div>
              <button onClick={() => setShowAddAgencyToRepModal(null)} className="p-1 rounded-full hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-bold">
              <div>
                <label className="block text-slate-600 mb-1">معرف الوكالة (GID):</label>
                <input type="text" placeholder="مثال: 55432" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono" />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">اسم الوكالة:</label>
                <input type="text" placeholder="مثال: وكالة الأفق الذهبي" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">معرف الوكيل الرئيسي:</label>
                <input type="text" placeholder="مثال: 98124500" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono" />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => {
                  showToast('✅ تم تسجيل وربط الوكالة بالمندوب المعتمد بنجاح');
                  setShowAddAgencyToRepModal(null);
                }}
                className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-white font-black text-xs rounded-xl shadow"
              >
                تأكيد ربط الوكالة +
              </button>
              <button
                onClick={() => setShowAddAgencyToRepModal(null)}
                className="px-4 py-3 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
              >
                إلغاء
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3.3: EDIT MANAGER PROFILE (تعديل بيانات المدير) */}
      {/* ========================================================================= */}
      {showEditProfileModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4" dir="rtl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-white rounded-3xl p-5 text-slate-900 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Edit className="w-5 h-5 text-amber-600" />
                <h3 className="text-sm font-black text-slate-900">تعديل بيانات مدير الوكالات</h3>
              </div>
              <button onClick={() => setShowEditProfileModal(false)} className="p-1 rounded-full hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-bold">
              <div>
                <label className="block text-slate-600 mb-1">الاسم الكامل:</label>
                <input type="text" defaultValue="أحمد المنصوري (MGR-9901)" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">رقم الهاتف:</label>
                <input type="text" defaultValue="+966 55 123 4567" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono" dir="ltr" />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">البريد الإلكتروني:</label>
                <input type="email" defaultValue="salem.alkaabi@agency.net" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono" dir="ltr" />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">المدينة:</label>
                <input type="text" defaultValue="الرياض" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => {
                  showToast('✅ تم حفظ وتحديث بيانات سالم الكعبي بنجاح');
                  setShowEditProfileModal(false);
                }}
                className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-white font-black text-xs rounded-xl shadow"
              >
                حفظ التغييرات
              </button>
              <button
                onClick={() => setShowEditProfileModal(false)}
                className="px-4 py-3 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
              >
                إلغاء
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: HOST CENTER (مركز المذيعين - الصورة 1 المرفقة) */}
      {/* ========================================================================= */}
      {showHostCenterModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4" dir="rtl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-sm sm:max-w-md bg-white rounded-[32px] p-6 text-slate-900 shadow-2xl space-y-6 select-none relative"
          >
            {/* Header: Title and Close (X) on left */}
            <div className="flex items-center justify-between relative pt-1">
              <button 
                onClick={() => setShowHostCenterModal(false)} 
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-6 h-6 stroke-[2.5]" />
              </button>
              
              <h2 className="text-xl font-black text-slate-900 text-center flex-1 pr-6">
                مركز المذيعين
              </h2>
            </div>

            {/* White Rounded Card with 4 Navigation Options */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.06)] overflow-hidden divide-y divide-slate-100">
              
              {/* Item 1: المذيع الخاص بي (with green count 28) */}
              <div 
                onClick={() => {
                  setShowHostCenterModal(false);
                  setShowMyAnchorModal(true);
                }}
                className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors group"
              >
                <span className="text-base sm:text-lg font-black text-slate-900">
                  المذيع الخاص بي
                </span>
                
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500 font-mono font-black text-lg sm:text-xl">
                    {selectedAgencyForHosts.hostsCount}
                  </span>
                  <ChevronLeft className="w-5 h-5 text-slate-300 group-hover:text-slate-500 transition-colors" />
                </div>
              </div>

              {/* Item 2: دعوة المذيعين */}
              <div 
                onClick={() => {
                  setShowHostCenterModal(false);
                  setShowInviteHostModal(true);
                }}
                className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors group"
              >
                <span className="text-base sm:text-lg font-black text-slate-900">
                  دعوة المذيعين
                </span>
                
                <ChevronLeft className="w-5 h-5 text-slate-300 group-hover:text-slate-500 transition-colors" />
              </div>

              {/* Item 3: سجل الدعوات */}
              <div 
                onClick={() => {
                  setShowHostCenterModal(false);
                  setShowInviteHistoryModal(true);
                }}
                className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors group"
              >
                <span className="text-base sm:text-lg font-black text-slate-900">
                  سجل الدعوات
                </span>
                
                <ChevronLeft className="w-5 h-5 text-slate-300 group-hover:text-slate-500 transition-colors" />
              </div>

              {/* Item 4: نقل المضيف إلى وسيط */}
              <div 
                onClick={() => {
                  setShowHostCenterModal(false);
                  setShowTransferHostModal(true);
                }}
                className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors group"
              >
                <span className="text-base sm:text-lg font-black text-slate-900">
                  نقل المضيف إلى وسيط
                </span>
                
                <ChevronLeft className="w-5 h-5 text-slate-300 group-hover:text-slate-500 transition-colors" />
              </div>

            </div>

            {/* Bottom Agency Metadata Bar: GID & Agency Name */}
            <div className="text-center text-slate-400 text-xs sm:text-sm font-bold pt-2">
              <span>{selectedAgencyForHosts.name}</span>
              <span className="mx-2">•</span>
              <span className="font-mono">GID: {selectedAgencyForHosts.gid}</span>
            </div>

          </motion.div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: MY ANCHOR (قائمة المذيعين الخاصين بي - الصورة 2 المرفقة) */}
      {/* ========================================================================= */}
      {showMyAnchorModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4" dir="rtl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-sm sm:max-w-md h-[92vh] max-h-[850px] bg-[#f8fafc] rounded-[32px] p-4 sm:p-5 text-slate-900 shadow-2xl flex flex-col select-none relative"
          >
            {/* Header: "my anchor" and Close (X) */}
            <div className="flex items-center justify-between pb-3 px-1 border-b border-slate-200/80">
              <button 
                onClick={() => {
                  setShowMyAnchorModal(false);
                  setShowHostCenterModal(true);
                }}
                className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1 text-xs font-bold"
              >
                <ArrowLeft className="w-4 h-4 rotate-180" />
                <span>رجوع</span>
              </button>

              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                my anchor
              </h2>

              <button 
                onClick={() => setShowMyAnchorModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            {/* Scrollable Hosts List (طابق تصميم وبيانات الصورة 2 بدقة) */}
            <div className="flex-1 overflow-y-auto space-y-3.5 pt-3 pr-0.5 pl-0.5 custom-scrollbar">
              {hostsList.map((host) => (
                <div 
                  key={host.id} 
                  className="bg-white rounded-3xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.05)] border border-slate-100 space-y-2 relative"
                >
                  {/* Top Row: User Avatar, Name, ID, and Closed Tag if any */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img 
                        src={host.avatar} 
                        alt={host.name} 
                        className="w-12 h-12 rounded-full object-cover border border-slate-100 shadow-sm"
                      />
                      <div>
                        <h4 className="text-sm font-black text-slate-900 leading-tight">
                          {host.name}
                        </h4>
                        <span className="text-[11px] font-mono text-slate-500 font-bold block mt-0.5" dir="ltr">
                          ID: {host.id}
                        </span>
                      </div>
                    </div>

                    {/* Black badge "مغلق off" if host is closed */}
                    {host.isClosed && (
                      <div className="w-11 h-11 rounded-full bg-black text-white flex flex-col items-center justify-center text-[9px] font-black leading-tight shadow">
                        <span>مغلق</span>
                        <span className="text-[8px] opacity-80 uppercase">off</span>
                      </div>
                    )}
                  </div>

                  {/* Details block: Join Date, Diamonds, Live Duration, Live Days */}
                  <div className="pt-2 border-t border-slate-100/80 space-y-1.5 text-xs font-bold">
                    
                    {/* وقت الانضمام (Green monospace date) */}
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">وقت الانضمام:</span>
                      <span className="text-emerald-500 font-mono text-[11px] font-black" dir="ltr">
                        {host.joinDate}
                      </span>
                    </div>

                    {/* الماس المستلم شهريا: 💎 1,008,299 */}
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">الماس المستلم شهرياً:</span>
                      <div className="flex items-center gap-1" dir="ltr">
                        <span className="text-slate-900 font-mono font-black text-xs sm:text-sm">
                          {host.diamonds}
                        </span>
                        <span className="text-blue-500 text-xs">💎</span>
                      </div>
                    </div>

                    {/* مدة البث: 38ساعات (Sky blue text) */}
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">مدة البث:</span>
                      <span className="text-sky-500 font-black text-xs">
                        {host.liveDuration}
                      </span>
                    </div>

                    {/* أيام البث: 16أيام (Sky blue text) */}
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">أيام البث:</span>
                      <span className="text-sky-500 font-black text-xs">
                        {host.liveDays}
                      </span>
                    </div>

                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Footer Info */}
            <div className="pt-3 border-t border-slate-200/80 text-center text-slate-400 text-xs font-bold">
              <span>إجمالي المذيعين: {hostsList.length} مذيع</span>
              <span className="mx-2">•</span>
              <span className="font-mono">وكالة الأساطير الذهبية</span>
            </div>

          </motion.div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 6: INVITE HOST BY ID (دعوة مذيع بالـ ID - الصورة المرفقة 1) */}
      {/* ========================================================================= */}
      {showInviteHostModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4" dir="rtl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-sm sm:max-w-md bg-white rounded-[32px] p-5 sm:p-6 text-slate-900 shadow-2xl space-y-4 select-none relative"
          >
            {/* Top Close Button & Green Icon */}
            <div className="flex items-center justify-between">
              <button 
                onClick={() => {
                  setShowInviteHostModal(false);
                  setShowHostCenterModal(true);
                }} 
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-6 h-6 stroke-[2.5]" />
              </button>
            </div>

            {/* Center UserPlus Icon Badge */}
            <div className="flex flex-col items-center justify-center -mt-6 space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100/90 text-emerald-600 flex items-center justify-center shadow-inner">
                <UserPlus className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-black text-slate-900 text-center">
                دعوة مذيع بالـ ID
              </h2>
              <p className="text-slate-500 text-xs font-bold text-center">
                <span>{selectedAgencyForHosts.name}</span>
                <span className="mx-1.5">•</span>
                <span>معرف الوكالة GID: <strong className="text-slate-700">{selectedAgencyForHosts.gid}</strong></span>
              </p>
            </div>

            {/* Agency GID Display Row */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-black text-slate-700 block">
                معرف الوكالة (GID):
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(selectedAgencyForHosts.gid);
                    showToast(`✅ تم نسخ معرف الوكالة GID: ${selectedAgencyForHosts.gid}`);
                  }}
                  className="bg-[#0f9d75] hover:bg-[#0c8261] text-white px-3.5 py-3 rounded-2xl text-xs font-black flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                >
                  <Copy className="w-4 h-4" />
                  <span>نسخ GID</span>
                </button>
                <div className="flex-1 bg-white border border-slate-200 rounded-2xl py-2.5 px-4 text-center font-mono font-black text-2xl text-emerald-600 tracking-wider shadow-sm">
                  {selectedAgencyForHosts.gid}
                </div>
              </div>
            </div>

            {/* Host User ID Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-700 block">
                معرف المذيع المراد دعوته (User ID):
              </label>
              <input 
                type="text"
                value={inviteHostUserId}
                onChange={(e) => setInviteHostUserId(e.target.value)}
                placeholder="أدخل رقم ID المذيع (مثال: 90887123)"
                className="w-full bg-white border border-slate-200 rounded-2xl py-3 px-4 text-center font-mono text-sm sm:text-base font-bold placeholder:text-slate-400 text-slate-900 focus:border-emerald-500 focus:outline-none shadow-sm transition-all"
              />
            </div>

            {/* Instruction Guidelines Card */}
            <div className="bg-[#f0fdf9] border border-[#a7f3d0] rounded-2xl p-3.5 text-xs text-slate-700 space-y-2">
              <div className="flex items-center gap-1.5 text-emerald-800 font-black">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>آلية دعوة واعتماد المذيع عبر الـ ID:</span>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-[11px] leading-relaxed text-slate-600 font-medium">
                <li>إرسال طلب دعوة مباشر إلى رقم الـ ID الخاص بالمذيع.</li>
                <li>أو يقوم المذيع بإدخال معرف وكالتك <strong className="text-emerald-700 font-mono">GID: {selectedAgencyForHosts.gid}</strong> في صفحة انضمام الوكالة داخل حسابه.</li>
                <li>بمجرد موافقة المذيع، يظهر مباشرة في قائمة «المذيع الخاص بي».</li>
              </ol>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => {
                  setShowInviteHostModal(false);
                  setShowHostCenterModal(true);
                }}
                className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs sm:text-sm transition-colors"
              >
                إلغاء
              </button>

              <button
                onClick={() => {
                  if (!inviteHostUserId.trim()) {
                    showToast('⚠️ يرجى إدخال رقم ID المذيع أولاً');
                    return;
                  }
                  showToast(`🚀 تم إرسال طلب الدعوة بنجاح إلى المذيع ID: ${inviteHostUserId}`);
                  setInviteHostUserId('');
                  setShowInviteHostModal(false);
                  setShowInviteHistoryModal(true);
                }}
                className={`flex-1 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all ${
                  inviteHostUserId.trim() 
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                إرسال الدعوة للمذيع (ID)
              </button>
            </div>

          </motion.div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 7: HOST INVITATION HISTORY (سجل دعوات المذيعين - الصورة المرفقة 2) */}
      {/* ========================================================================= */}
      {showInviteHistoryModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4" dir="rtl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-sm sm:max-w-md h-[90vh] max-h-[800px] bg-white rounded-[32px] p-5 sm:p-6 text-slate-900 shadow-2xl flex flex-col select-none relative"
          >
            {/* Top Row: Close Button (left) and Yellow Clock Badge (right) */}
            <div className="flex items-center justify-between pb-1">
              <button 
                onClick={() => {
                  setShowInviteHistoryModal(false);
                  setShowHostCenterModal(true);
                }} 
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-6 h-6 stroke-[2.5]" />
              </button>

              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shadow-inner">
                <Clock className="w-6 h-6" />
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className="text-center -mt-8 pb-3">
              <h2 className="text-xl font-black text-slate-900">
                سجل دعوات المذيعين
              </h2>
              <p className="text-slate-500 text-xs font-bold mt-0.5">
                <span>{selectedAgencyForHosts.name}</span>
                <span className="mx-1.5">•</span>
                <span className="font-mono">GID: {selectedAgencyForHosts.gid}</span>
              </p>
            </div>

            {/* Filter Tabs: الكل | قيد الانتظار | تم الانضمام | منتهية */}
            <div className="flex items-center justify-center gap-1.5 pb-3">
              {[
                { key: 'all', label: 'الكل' },
                { key: 'pending', label: 'قيد الانتظار' },
                { key: 'joined', label: 'تم الانضمام' },
                { key: 'expired', label: 'منتهية' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setHistoryFilter(tab.key as any)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                    historyFilter === tab.key
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Input with Search Icon on right */}
            <div className="relative pb-3">
              <input
                type="text"
                value={historySearchQuery}
                onChange={(e) => setHistorySearchQuery(e.target.value)}
                placeholder="...بحث برقم ID أو اسم المذيع"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-2.5 pr-10 pl-4 text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
            </div>

            {/* History List */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-0.5 custom-scrollbar">
              {[
                { id: '87377569', name: 'أمير الطرب ⭐️', date: '2026-08-25 14:30', status: 'joined' },
                { id: '90123456', name: 'سارة لايف 🎤', date: '2026-08-26 19:15', status: 'joined' },
                { id: '77654321', name: 'كابتن ماجد 🎮', date: '2026-08-27 10:00', status: 'pending' },
                { id: '88234190', name: 'روان لايف 🌸', date: '2026-08-27 22:45', status: 'pending' },
                { id: '65432190', name: 'صقر قريش 🦅', date: '2026-08-20 11:20', status: 'expired' }
              ]
                .filter(item => {
                  if (historyFilter !== 'all' && item.status !== historyFilter) return false;
                  if (historySearchQuery.trim()) {
                    return item.name.includes(historySearchQuery) || item.id.includes(historySearchQuery);
                  }
                  return true;
                })
                .map((invite) => (
                  <div 
                    key={invite.id}
                    className="bg-white border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-2xl p-3 flex items-center justify-between"
                  >
                    {/* Status Badge & Share Action (Left in RTL) */}
                    <div className="flex items-center gap-2">
                      {invite.status === 'pending' && (
                        <button 
                          onClick={() => showToast(`🔗 تم نسخ رابط دعوة ${invite.name}`)}
                          className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                          title="مشاركة الرابط"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      )}

                      {invite.status === 'joined' && (
                        <span className="bg-[#e6fcf5] text-emerald-700 text-[11px] font-black px-3 py-1.5 rounded-full">
                          تم الانضمام
                        </span>
                      )}

                      {invite.status === 'pending' && (
                        <span className="bg-[#fef9c3] text-amber-800 text-[11px] font-black px-3 py-1.5 rounded-full">
                          قيد الانتظار
                        </span>
                      )}

                      {invite.status === 'expired' && (
                        <span className="bg-slate-100 text-slate-500 text-[11px] font-black px-3 py-1.5 rounded-full">
                          منتهية
                        </span>
                      )}
                    </div>

                    {/* Invitee Info (Right in RTL) */}
                    <div className="text-right">
                      <h4 className="text-xs sm:text-sm font-black text-slate-900">
                        {invite.name}
                      </h4>
                      <p className="text-[11px] font-mono text-slate-400 font-bold mt-0.5 flex items-center gap-1.5 justify-end">
                        <span>{invite.date}</span>
                        <span>•</span>
                        <span>ID: {invite.id}</span>
                      </p>
                    </div>
                  </div>
                ))}
            </div>

            {/* Bottom Row Buttons */}
            <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  setShowInviteHistoryModal(false);
                  setShowHostCenterModal(true);
                }}
                className="px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs sm:text-sm transition-colors"
              >
                إغلاق
              </button>

              <button
                onClick={() => {
                  setShowInviteHistoryModal(false);
                  setShowInviteHostModal(true);
                }}
                className="flex-1 py-2.5 rounded-2xl bg-[#0f9d75] hover:bg-[#0c8261] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                <UserPlus className="w-4 h-4" />
                <span>إرسال دعوة جديدة</span>
              </button>
            </div>

          </motion.div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 8: TRANSFER HOST TO BROKER (نقل مضيف إلى وسيط بالـ ID - الصورة المرفقة 3) */}
      {/* ========================================================================= */}
      {showTransferHostModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4" dir="rtl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-sm sm:max-w-md h-[92vh] max-h-[820px] bg-white rounded-[32px] p-5 sm:p-6 text-slate-900 shadow-2xl flex flex-col select-none relative"
          >
            {/* Header: Close Button on left and Purple Icon on right */}
            <div className="flex items-center justify-between pb-1">
              <button 
                onClick={() => {
                  setShowTransferHostModal(false);
                  setShowHostCenterModal(true);
                }} 
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-6 h-6 stroke-[2.5]" />
              </button>

              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center shadow-inner">
                <ArrowRightLeft className="w-6 h-6" />
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className="text-center -mt-8 pb-3">
              <h2 className="text-xl font-black text-slate-900">
                نقل مضيف إلى وسيط بالـ ID
              </h2>
              <p className="text-slate-500 text-xs font-bold mt-0.5">
                <span>{selectedAgencyForHosts.name}</span>
                <span className="mx-1.5">•</span>
                <span className="font-mono">GID: {selectedAgencyForHosts.gid}</span>
              </p>
            </div>

            {/* Form Fields Scroll Area */}
            <div className="flex-1 overflow-y-auto space-y-3.5 pr-0.5 custom-scrollbar">
              
              {/* Field 1: Host ID */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-700">
                    معرف المضيف (Host ID):
                  </label>
                  {transferHostId === '87377569' && (
                    <span className="text-[11px] font-bold text-emerald-600">
                      ✓ ⚔️ القيادة ⚔️ (2,000,131 ماسة)
                    </span>
                  )}
                </div>
                
                <input 
                  type="text"
                  value={transferHostId}
                  onChange={(e) => setTransferHostId(e.target.value)}
                  placeholder="أدخل رقم ID المضيف"
                  className="w-full bg-white border border-slate-200 rounded-2xl py-2.5 px-4 text-center font-mono text-base font-bold text-slate-900 focus:border-purple-500 focus:outline-none shadow-sm transition-all"
                />

                {/* Quick select chips for Host */}
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] text-slate-400 font-bold block">اختيار سريع:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { id: '83534797', name: '👑 الملك 🔱' },
                      { id: '85430392', name: 'زهرة بيض' },
                      { id: '79900240', name: 'Má نادر' },
                      { id: '78498351', name: 'حبيبتي' }
                    ].map(item => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setTransferHostId(item.id)}
                        className={`text-[11px] px-2.5 py-1 rounded-xl font-bold transition-all ${
                          transferHostId === item.id 
                            ? 'bg-purple-100 text-purple-700 border border-purple-300' 
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {item.id} ({item.name})
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Field 2: Broker ID */}
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-black text-slate-700 block">
                  معرف الوسيط المستلم (Broker ID):
                </label>
                
                <input 
                  type="text"
                  value={transferBrokerId}
                  onChange={(e) => setTransferBrokerId(e.target.value)}
                  placeholder="أدخل رقم ID الوسيط المستلم"
                  className="w-full bg-white border border-slate-200 rounded-2xl py-2.5 px-4 text-center font-mono text-base font-bold text-slate-900 focus:border-purple-500 focus:outline-none shadow-sm transition-all"
                />

                {/* Quick select chips for Brokers */}
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] text-slate-400 font-bold block">وسطاء الوكالة:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { id: '83534797', name: '👑 الملك 🔱' },
                      { id: '78343200', name: '👑 الملك 🔱' },
                      { id: '78498351', name: 'حبيبتي' },
                      { id: '81156183', name: 'walid 🌹' }
                    ].map(item => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setTransferBrokerId(item.id)}
                        className={`text-[11px] px-2.5 py-1 rounded-xl font-bold transition-all ${
                          transferBrokerId === item.id 
                            ? 'bg-purple-100 text-purple-700 border border-purple-300' 
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {item.id} ({item.name})
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Field 3: Effective Transfer Date */}
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-black text-slate-700 block">
                  تاريخ سريان النقل:
                </label>
                <div className="relative">
                  <input 
                    type="text"
                    value={transferDate}
                    onChange={(e) => setTransferDate(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-2xl py-2.5 px-4 text-center font-mono font-black text-sm text-slate-800 focus:border-purple-500 focus:outline-none shadow-sm"
                  />
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
                </div>
              </div>

              {/* Transfer Rules Info Box */}
              <div className="bg-purple-50/70 border border-purple-200/80 rounded-2xl p-3 flex items-center justify-between text-purple-950 text-xs font-bold">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-purple-600" />
                  <span>ضوابط النقل بالـ ID:</span>
                </div>
                <span className="text-[10px] text-purple-700 font-medium">ساري أول الشهر القادم</span>
              </div>

            </div>

            {/* Bottom Row Buttons */}
            <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  setShowTransferHostModal(false);
                  setShowHostCenterModal(true);
                }}
                className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs sm:text-sm transition-colors"
              >
                إلغاء
              </button>

              <button
                onClick={() => {
                  if (!transferHostId.trim() || !transferBrokerId.trim()) {
                    showToast('⚠️ يرجى تحديد معرف المضيف والوسيط المستلم');
                    return;
                  }
                  showToast(`✅ تم جدولة نقل المضيف ID: ${transferHostId} إلى الوسيط ID: ${transferBrokerId} بنجاح!`);
                  setShowTransferHostModal(false);
                  setShowHostCenterModal(true);
                }}
                className="flex-1 py-3 rounded-2xl bg-[#9333ea] hover:bg-[#7e22ce] text-white font-black text-xs sm:text-sm shadow-md transition-all text-center"
              >
                تأكيد النقل بالـ ID
              </button>
            </div>

          </motion.div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FULLSCREEN AGENCY VIEW (شاشة تفاصيل الوكالة كاملة عند الضغط على الأيقونة) */}
      {/* ========================================================================= */}
      {fullscreenAgency && (
        <div className="fixed inset-0 z-50 bg-[#070d19] text-slate-100 flex flex-col overflow-hidden animate-in fade-in duration-200" dir="rtl">
          {/* Top Bar */}
          <div className="h-16 px-4 sm:px-6 bg-[#0c1424] border-b border-slate-800 flex items-center justify-between shrink-0 shadow-lg">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setFullscreenAgency(null)}
                className="px-3.5 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border border-slate-700 cursor-pointer active:scale-95"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>إغلاق الشاشة الكاملة</span>
              </button>

              <div className="h-5 w-[1px] bg-slate-700 hidden sm:block"></div>

              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-black text-amber-400 font-mono">GID: {fullscreenAgency.gid}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedAgencyForHosts({
                    name: fullscreenAgency.name,
                    gid: fullscreenAgency.gid,
                    hostsCount: fullscreenAgency.hosts
                  });
                  setShowHostCenterModal(true);
                }}
                className="px-3.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95"
              >
                <Tv className="w-4 h-4" />
                <span className="hidden sm:inline">فتح مركز المذيعين</span>
                <span className="sm:hidden">المذيعين</span>
              </button>

              <button
                onClick={() => {
                  showToast(`🔒 تم تغيير حالة قفل الوكالة: ${fullscreenAgency.name}`);
                  setFullscreenAgency({
                    ...fullscreenAgency,
                    isLocked: !fullscreenAgency.isLocked
                  });
                }}
                className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  fullscreenAgency.isLocked
                    ? 'bg-rose-500/20 border-rose-500/50 text-rose-400'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                }`}
                title={fullscreenAgency.isLocked ? 'إلغاء التجميد' : 'تجميد الوكالة'}
              >
                {fullscreenAgency.isLocked ? <Lock className="w-4 h-4 text-rose-400" /> : <Unlock className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setFullscreenAgency(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 max-w-6xl w-full mx-auto custom-scrollbar">
            {/* HERO AGENCY BANNER */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0f1b33] via-[#142343] to-[#0f1b33] border border-slate-700/80 p-6 sm:p-8 shadow-2xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex flex-col sm:flex-row items-center text-center sm:text-right gap-5">
                  {/* Glowing Agency Logo/Avatar */}
                  <div 
                    onClick={() => setFullscreenImage({
                      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
                      title: fullscreenAgency.name,
                      subtitle: `الوكيل: ${fullscreenAgency.agentName}`,
                      badge: `GID: ${fullscreenAgency.gid}`
                    })}
                    className="relative group cursor-pointer"
                    title="اضغط لتكبير الشعار"
                  >
                    <div className={`w-24 h-24 rounded-3xl bg-gradient-to-tr ${fullscreenAgency.logoGradient || 'from-indigo-500 via-purple-500 to-pink-400'} p-1 shadow-[0_0_30px_rgba(147,51,234,0.4)] group-hover:scale-105 transition-transform`}>
                      <div className="w-full h-full bg-[#0a101f] rounded-[22px] flex items-center justify-center">
                        <span className="text-4xl">{fullscreenAgency.logoEmoji || '🏢'}</span>
                      </div>
                    </div>
                    <span className="absolute -bottom-1 -left-1 w-5 h-5 bg-emerald-500 border-4 border-[#0c1424] rounded-full"></span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <h1 className="text-xl sm:text-2xl font-black text-white">{fullscreenAgency.name}</h1>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black flex items-center gap-1">
                        <Crown className="w-3 h-3 text-amber-400" />
                        {fullscreenAgency.level || 'المستوى الذهبي 🌟'}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-black">
                        وكالة معتمدة رسمياً
                      </span>
                    </div>

                    <p className="text-sm font-bold text-amber-400 flex items-center justify-center sm:justify-start gap-1">
                      <span>الوكيل المسؤول:</span>
                      <span className="text-white font-black">{fullscreenAgency.agentName}</span>
                    </p>

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-400">
                      <span>🇸🇦 {fullscreenAgency.country || 'المملكة العربية السعودية'}</span>
                      <span>•</span>
                      <span>المدير المشرف: سالم الكعبي (AG9901)</span>
                      <span>•</span>
                      <span>تاريخ الاعتماد: 2026-02-01</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
                  <button
                    onClick={() => {
                      setSelectedAgencyForHosts({
                        name: fullscreenAgency.name,
                        gid: fullscreenAgency.gid,
                        hostsCount: fullscreenAgency.hosts
                      });
                      setShowHostCenterModal(true);
                    }}
                    className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
                  >
                    <Tv className="w-4 h-4" />
                    <span>عرض مركز المذيعين ({fullscreenAgency.hosts} مذيع)</span>
                  </button>

                  <button
                    onClick={() => setShowDetailsModal(true)}
                    className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <FileText className="w-4 h-4 text-amber-400" />
                    <span>ملف الإداري المشرف</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 4 PRIMARY STATS METRIC CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: إجمالي الماسات */}
              <div className="bg-[#0e172a] border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between text-slate-400 text-xs font-bold mb-2">
                  <span>إجمالي الماسات</span>
                  <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400">💎</span>
                </div>
                <div className="text-xl sm:text-2xl font-black font-mono text-white" dir="ltr">
                  {fullscreenAgency.totalDiamonds}
                </div>
                <div className="flex items-center gap-1.5 mt-2 text-xs font-bold text-emerald-400">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{fullscreenAgency.growth || '+12.4%'} مقارنة بالشهر السابق</span>
                </div>
              </div>

              {/* Card 2: صافي الدخل */}
              <div className="bg-[#0e172a] border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between text-slate-400 text-xs font-bold mb-2">
                  <span>صافي الدخل التقديري</span>
                  <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400">💰</span>
                </div>
                <div className="text-xl sm:text-2xl font-black font-mono text-amber-400" dir="ltr">
                  {fullscreenAgency.income || '$48,500'}
                </div>
                <div className="flex items-center gap-1.5 mt-2 text-xs font-bold text-slate-400">
                  <span>عمولة الوكالة: {fullscreenAgency.commissionRate || '0.80'}%</span>
                </div>
              </div>

              {/* Card 3: المضيفين النشطين */}
              <div className="bg-[#0e172a] border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between text-slate-400 text-xs font-bold mb-2">
                  <span>المضيفين النشطين</span>
                  <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400">🎙️</span>
                </div>
                <div className="text-xl sm:text-2xl font-black font-mono text-purple-400">
                  {fullscreenAgency.hosts} مضيف معتمد
                </div>
                <div className="flex items-center gap-1.5 mt-2 text-xs font-bold text-purple-300">
                  <span>380 ساعة بث إجمالية هذا الشهر</span>
                </div>
              </div>

              {/* Card 4: الوسطاء التابعين */}
              <div className="bg-[#0e172a] border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between text-slate-400 text-xs font-bold mb-2">
                  <span>الوسطاء المعتمدين</span>
                  <span className="p-2 rounded-xl bg-teal-500/10 text-teal-400">👔</span>
                </div>
                <div className="text-xl sm:text-2xl font-black font-mono text-teal-400">
                  {fullscreenAgency.brokers || '6 / 11'}
                </div>
                <div className="flex items-center gap-1.5 mt-2 text-xs font-bold text-teal-300">
                  <span>جميع الوسطاء نشطين بنسبة 100%</span>
                </div>
              </div>
            </div>

            {/* FULLSCREEN TABS NAVIGATION */}
            <div className="bg-[#0e172a] border border-slate-800 rounded-3xl p-2 flex items-center gap-2">
              <button
                onClick={() => setFullscreenAgencyTab('overview')}
                className={`flex-1 py-3 px-3 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  fullscreenAgencyTab === 'overview'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>نظرة عامة والنمو</span>
              </button>

              <button
                onClick={() => setFullscreenAgencyTab('hosts')}
                className={`flex-1 py-3 px-3 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  fullscreenAgencyTab === 'hosts'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Tv className="w-4 h-4" />
                <span>المذيعين والمضيفين ({hostsList.length})</span>
              </button>

              <button
                onClick={() => setFullscreenAgencyTab('brokers')}
                className={`flex-1 py-3 px-3 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  fullscreenAgencyTab === 'brokers'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>الوسطاء المعتمدين ({delegatesList.length})</span>
              </button>

              <button
                onClick={() => setFullscreenAgencyTab('stats')}
                className={`flex-1 py-3 px-3 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  fullscreenAgencyTab === 'stats'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>السجلات والوثائق الرسمية</span>
              </button>
            </div>

            {/* TAB CONTENT: Overview */}
            {fullscreenAgencyTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-200">
                {/* Financial breakdown */}
                <div className="bg-[#0e172a] border border-slate-800 rounded-3xl p-5 space-y-4">
                  <h3 className="text-sm font-black text-amber-400 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    <span>تفاصيل الإيرادات وتوزيع الأرباح</span>
                  </h3>
                  <div className="space-y-2.5 text-xs">
                    <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-300">إجمالي الأرباح الخام للوكالة:</span>
                      <span className="font-mono font-black text-white text-sm">$48,500.00</span>
                    </div>
                    <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-300">نسبة مشاركة المدير (سالم الكعبي):</span>
                      <span className="font-mono font-black text-amber-400 text-sm">20.00% ($9,700)</span>
                    </div>
                    <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-300">نسبة الوكيل المباشر (فهد العتيبي):</span>
                      <span className="font-mono font-black text-emerald-400 text-sm">40.00% ($19,400)</span>
                    </div>
                    <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-300">حصة المذيعين والمضيفين:</span>
                      <span className="font-mono font-black text-purple-400 text-sm">40.00% ($19,400)</span>
                    </div>
                  </div>
                </div>

                {/* Top Highlights */}
                <div className="bg-[#0e172a] border border-slate-800 rounded-3xl p-5 space-y-4">
                  <h3 className="text-sm font-black text-purple-400 flex items-center gap-2">
                    <Crown className="w-4 h-4" />
                    <span>أفضل المذيعين أداءً في هذه الوكالة</span>
                  </h3>
                  <div className="space-y-2.5">
                    {hostsList.slice(0, 3).map((host, idx) => (
                      <div key={idx} className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img src={host.avatar} alt={host.name} className="w-10 h-10 rounded-xl object-cover border border-purple-500/50" />
                          <div>
                            <div className="text-xs font-black text-white">{host.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono">ID: {host.id}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-black font-mono text-amber-400 flex items-center gap-1 justify-end">
                            <span>💎</span>
                            <span>{host.diamonds}</span>
                          </div>
                          <div className="text-[10px] text-slate-400">{host.liveDuration} بث</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: Hosts */}
            {fullscreenAgencyTab === 'hosts' && (
              <div className="bg-[#0e172a] border border-slate-800 rounded-3xl p-5 space-y-4 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="text-sm font-black text-white">قائمة المذيعين والمضيفين التابعين للوكالة</h3>
                    <p className="text-xs text-slate-400 mt-0.5">يمكنك متابعة الماسات وساعات البث وفتح الملفات</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedAgencyForHosts({
                        name: fullscreenAgency.name,
                        gid: fullscreenAgency.gid,
                        hostsCount: fullscreenAgency.hosts
                      });
                      setShowHostCenterModal(true);
                    }}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer shadow"
                  >
                    <Tv className="w-4 h-4" />
                    <span>إدارة المذيعين في مركز المضيفين</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {hostsList.map((host) => (
                    <div key={host.id} className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img 
                          src={host.avatar} 
                          alt={host.name} 
                          onClick={() => setFullscreenImage({ url: host.avatar, title: host.name, subtitle: `ID: ${host.id}`, badge: 'مذيع نشط' })}
                          className="w-12 h-12 rounded-2xl object-cover border-2 border-purple-500 cursor-pointer hover:scale-105 transition-transform" 
                        />
                        <div>
                          <div className="text-xs font-black text-white">{host.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">ID: {host.id}</div>
                          <div className="text-[10px] text-purple-400 font-bold mt-1">بث: {host.liveDuration} • {host.liveDays}</div>
                        </div>
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-black font-mono text-amber-400" dir="ltr">💎 {host.diamonds}</div>
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold mt-1.5 ${host.isClosed ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                          {host.isClosed ? 'مغلق' : 'نشط'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: Brokers */}
            {fullscreenAgencyTab === 'brokers' && (
              <div className="bg-[#0e172a] border border-slate-800 rounded-3xl p-5 space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h3 className="text-sm font-black text-white">الوسطاء والمندوبين المعتمدين</h3>
                  <button
                    onClick={() => {
                      setShowDetailsModal(true);
                      setManagerDetailsTab('reps');
                    }}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black cursor-pointer shadow"
                  >
                    <span>عرض في قائمة المندوبين</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {delegatesList.map((del) => (
                    <div key={del.id} className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img 
                          src={del.avatar} 
                          alt={del.name} 
                          onClick={() => setFullscreenImage({ url: del.avatar, title: del.name, subtitle: del.title, badge: `ID: ${del.id}` })}
                          className="w-12 h-12 rounded-2xl object-cover border-2 border-amber-400 cursor-pointer hover:scale-105 transition-transform" 
                        />
                        <div>
                          <div className="text-xs font-black text-white">{del.name}</div>
                          <div className="text-[10px] text-amber-400 font-bold">{del.title}</div>
                          <div className="text-[10px] text-slate-400 mt-1">الوكالات المدعوة: {del.invitedAgenciesCount}</div>
                        </div>
                      </div>
                      <div className="text-left font-mono">
                        <div className="text-xs font-black text-emerald-400" dir="ltr">{del.agenciesIncome}</div>
                        <div className="text-[10px] text-slate-400 mt-1">{del.commissionRate} عمولة</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: Official Docs */}
            {fullscreenAgencyTab === 'stats' && (
              <div className="bg-[#0e172a] border border-slate-800 rounded-3xl p-5 space-y-4 animate-in fade-in duration-200">
                <h3 className="text-sm font-black text-white">السجلات والوثائق الرسمية والترخيص</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-2">
                    <FileText className="w-8 h-8 text-amber-400 mx-auto" />
                    <div className="text-xs font-black text-white">ترخيص الوكالة الرسمي</div>
                    <div className="text-[10px] text-slate-400 font-mono">LIC-2026-SA-30032</div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">ساري المفعول</span>
                  </div>

                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-2">
                    <ShieldCheck className="w-8 h-8 text-blue-400 mx-auto" />
                    <div className="text-xs font-black text-white">عقد الشراكة المالي</div>
                    <div className="text-[10px] text-slate-400 font-mono">CTR-AG-9901-30032</div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-bold">معتمد إلكترونياً</span>
                  </div>

                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-2">
                    <Globe className="w-8 h-8 text-purple-400 mx-auto" />
                    <div className="text-xs font-black text-white">نطاق البث الجغرافي</div>
                    <div className="text-[10px] text-slate-400">الشرق الأوسط والخليج العربي</div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 text-[10px] font-bold">إقليمي رسمي</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SALARY SLIP MODAL (قسيمة الراتب - مطابقة تامة للصورة المرفقة) */}
      {/* ========================================================================= */}
      {showSalarySlipModal && selectedSalarySlipAgency && (
        <div 
          onClick={() => setShowSalarySlipModal(false)}
          className="fixed inset-0 z-50 bg-[#060b13]/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          dir="rtl"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md my-auto space-y-3 font-sans"
          >
            {/* 1. Header Bar Card */}
            <div className="bg-white rounded-2xl p-3 shadow-lg flex items-center justify-between">
              <button
                onClick={() => setShowSalarySlipModal(false)}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer transition-colors"
                title="رجوع"
              >
                <ArrowRight className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-slate-900 font-black text-base">
                <FileText className="w-5 h-5 text-amber-500" />
                <span>قسيمة الراتب</span>
              </div>

              <button
                onClick={() => setShowSalarySlipModal(false)}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer transition-colors"
                title="إغلاق"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 2. Agency Identification Card */}
            <div className="bg-white rounded-3xl p-4 shadow-lg flex items-center justify-between">
              <div className="text-right flex-1 pr-1 space-y-1">
                <h2 className="text-base font-black text-slate-900 leading-tight">
                  {selectedSalarySlipAgency.name}
                </h2>
                <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5 flex-wrap">
                  <span>الوكيل المسؤول:</span>
                  <span className="text-[#d97706] font-black">
                    {selectedSalarySlipAgency.agentName}
                  </span>
                  <span className="text-slate-300">|</span>
                  <span className="font-mono text-slate-900 font-black text-xs">
                    GID: {selectedSalarySlipAgency.gid}
                  </span>
                </div>
              </div>

              <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-sm shrink-0 border border-slate-100 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-[2px]">
                <img 
                  src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80" 
                  alt={selectedSalarySlipAgency.name} 
                  className="w-full h-full object-cover rounded-[14px]" 
                />
                <div className="absolute bottom-1 left-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />
              </div>
            </div>

            {/* 3. Month / Date Selector Card */}
            <div className="relative">
              <div 
                onClick={() => setShowMonthPickerDropdown(!showMonthPickerDropdown)}
                className="bg-white rounded-2xl px-4 py-3 shadow-lg flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors border border-transparent hover:border-amber-200"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black font-mono text-slate-900">
                    {selectedSlipMonth}
                  </span>
                  <span className="text-[11px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-bold">
                    الشهر المحدد
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextMonth();
                    }}
                    title="الشهر التالي"
                    className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-amber-100 hover:text-amber-700 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePreviousMonth();
                    }}
                    title="الشهر السابق"
                    className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-amber-100 hover:text-amber-700 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-1 text-amber-500 pr-1">
                    <Calendar className="w-4 h-4 text-amber-500" />
                    <ChevronDown className={`w-4 h-4 text-slate-700 transition-transform duration-200 ${showMonthPickerDropdown ? 'rotate-180' : ''}`} />
                  </div>
                </div>
              </div>

              {/* Month Dropdown Menu */}
              {showMonthPickerDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-30 max-h-56 overflow-y-auto grid grid-cols-2 gap-1.5">
                  {availableSlipMonths.map((month) => {
                    const isSelected = month === selectedSlipMonth;
                    return (
                      <button
                        key={month}
                        type="button"
                        onClick={() => handleSelectMonth(month)}
                        className={`px-3 py-2 rounded-xl text-xs font-mono font-black flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500 text-white shadow-md'
                            : 'bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-700'
                        }`}
                      >
                        <span>{month}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 4. Total Salary Big Card */}
            <div className="bg-white rounded-3xl p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-black text-slate-800">إجمالي الراتب:</span>
                <div className="text-3xl sm:text-4xl font-black font-mono text-[#00d29f] flex items-center gap-2" dir="ltr">
                  <span>$</span>
                  <span>{currentMonthData.totalSalary}</span>
                </div>
              </div>

              <div className="space-y-1 text-left pt-2 border-t border-slate-100">
                <p className="text-[11px] font-medium text-slate-500">
                  إجمالي الراتب=العمولة الأساسية-العمولة المفكوكة
                </p>
                <p className="text-xs font-black text-[#ef4444] font-mono">
                  أرباح مجمدة {currentMonthData.frozenProfits || '$0.00'}
                </p>
              </div>
            </div>

            {/* 5. Card: العمولة الأساسية */}
            <div 
              onClick={() => setShowBaseCommissionModal(true)}
              className="bg-white rounded-2xl p-3.5 shadow-lg flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-slate-400 cursor-pointer" />
                <span className="text-xs font-black text-slate-800">العمولة الأساسية:</span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowBaseCommissionModal(true);
                }}
                className="px-3.5 py-1 rounded-full bg-sky-50 hover:bg-sky-100 text-sky-600 border border-sky-100 text-xs font-black cursor-pointer transition-colors shadow-sm"
              >
                عرض المضيفين
              </button>

              <div className="flex items-center gap-1">
                <ChevronLeft className="w-4 h-4 text-slate-400" />
                <span className="text-base font-black font-mono text-sky-500 flex items-center gap-1" dir="ltr">
                  <span>$</span>
                  <span>{currentMonthData.baseCommission}</span>
                </span>
              </div>
            </div>

            {/* 6. Card: العمولة المفكوكة */}
            <div 
              onClick={() => setShowUnlockedCommissionModal(true)}
              className="bg-white rounded-2xl p-4 shadow-lg space-y-3 cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-slate-400 cursor-pointer" />
                  <span className="text-xs font-black text-slate-800">العمولة المفكوكة:</span>
                </div>
                <span 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowUnlockedCommissionModal(true);
                  }}
                  className="px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-xs font-bold shadow-sm hover:bg-emerald-100 cursor-pointer"
                >
                  عرض التفاصيل
                </span>
                <div className="flex items-center gap-1">
                  <ChevronLeft className="w-4 h-4 text-slate-400" />
                  <span className="text-base font-black font-mono text-sky-500 flex items-center gap-1" dir="ltr">
                    <span>$</span>
                    <span>{currentMonthData.unlockedCommission}</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-600 font-bold">ماس الوكالة المستلم:</span>
                <span className="text-sky-500 font-black font-mono text-sm" dir="ltr">
                  {currentMonthData.agencyDiamondsReceived}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 font-bold">سعر عمولة الوكالة:</span>
                <span className="text-sky-500 font-black font-mono text-sm" dir="ltr">
                  {currentMonthData.agencyCommissionRate}
                </span>
              </div>
            </div>

            {/* 7. Card: حصة الوسيط */}
            <div 
              onClick={() => setShowBrokerSideSplitModal(true)}
              className="bg-white rounded-2xl p-3.5 shadow-lg flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-slate-400 cursor-pointer" />
                <span className="text-xs font-black text-slate-800">حصة الوسيط:</span>
              </div>

              <span 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowBrokerSideSplitModal(true);
                }}
                className="px-3 py-0.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/70 text-[11px] font-bold font-sans shadow-sm cursor-pointer"
              >
                Broker side split
              </span>

              <div className="flex items-center gap-1">
                <ChevronLeft className="w-4 h-4 text-slate-400" />
                <span className="text-base font-black font-mono text-sky-500 flex items-center gap-1" dir="ltr">
                  <span>$</span>
                  <span>{currentMonthData.brokerShare}</span>
                </span>
              </div>
            </div>

            {/* 8. Card: الراتب المرسل */}
            <div className="bg-white rounded-2xl p-4 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-slate-400 cursor-pointer" />
                  <span className="text-xs font-black text-slate-800">الراتب المرسل:</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-black font-mono text-sky-500">
                    {currentMonthData.sentSalaryCoins}
                  </span>
                  <div className="w-5 h-5 rounded-full bg-amber-500 text-amber-950 flex items-center justify-center font-black text-[11px] shadow-sm font-mono">
                    ¥
                  </div>
                </div>
              </div>

              {/* Transfers list */}
              <div className="space-y-2.5 pt-1">
                {currentMonthData.coinTransfers?.map((transfer: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-black text-slate-900 text-sm">{transfer.amount}</span>
                      <div className="w-4 h-4 rounded-full bg-amber-500 text-amber-950 flex items-center justify-center font-black text-[9px] shadow-sm font-mono">
                        ¥
                      </div>
                    </div>
                    <span className="font-mono text-slate-700 text-xs font-medium" dir="ltr">
                      {transfer.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 9. Card: تنزيل بيانات المضيف */}
            <div className="bg-white rounded-2xl p-3.5 shadow-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-500 shrink-0">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-slate-900 block">تنزيل بيانات المضيف</span>
                  <span className="text-[11px] font-mono text-slate-400 block mt-0.5" dir="ltr">
                    {currentMonthData.hostDataFile}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <ChevronLeft className="w-4 h-4 text-slate-400" />
                <button
                  onClick={() => {
                    showToast(`📥 جاري تحميل كشف البيانات: ${currentMonthData.hostDataFile}`);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 text-xs font-black flex items-center gap-1 cursor-pointer transition-colors shadow-sm active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>تنزيل</span>
                </button>
              </div>
            </div>

            {/* 10. Footer Hash */}
            <p className="text-xs text-slate-400 font-mono text-center pt-2 pb-6">
              c91a5254eb052791e77e525771abe56f
            </p>
          </motion.div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. SUB-MODAL: العمولة الأساسية والمضيفين (مطابقة تامة للصورة 1) */}
      {/* ========================================================================= */}
      {showBaseCommissionModal && (
        <div 
          className="fixed inset-0 z-50 bg-[#060b13]/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          dir="rtl"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md my-auto space-y-3 font-sans"
          >
            {/* 1. Header Bar Card */}
            <div className="bg-white rounded-2xl p-3 shadow-lg flex items-center justify-between">
              <button
                onClick={() => setShowBaseCommissionModal(false)}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer transition-colors"
                title="رجوع"
              >
                <ArrowRight className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-slate-900 font-black text-sm sm:text-base">
                <FileText className="w-5 h-5 text-sky-500" />
                <span>العمولة الأساسية والمضيفين</span>
              </div>

              <button
                onClick={() => setShowBaseCommissionModal(false)}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer transition-colors"
                title="إغلاق"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 2. Month Selector Card with machine controls */}
            <div className="relative">
              <div 
                onClick={() => setShowMonthPickerDropdown(!showMonthPickerDropdown)}
                className="bg-white rounded-2xl px-4 py-3 shadow-lg flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors border border-transparent hover:border-amber-200"
              >
                <span className="text-sm font-black font-mono text-slate-900">
                  {selectedSlipMonth}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextMonth();
                    }}
                    title="الشهر التالي"
                    className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-amber-100 hover:text-amber-700 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePreviousMonth();
                    }}
                    title="الشهر السابق"
                    className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-amber-100 hover:text-amber-700 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <ChevronDown className={`w-4 h-4 text-slate-700 transition-transform duration-200 ${showMonthPickerDropdown ? 'rotate-180' : ''}`} />
                </div>
              </div>

              {showMonthPickerDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-30 max-h-56 overflow-y-auto grid grid-cols-2 gap-1.5">
                  {availableSlipMonths.map((month) => {
                    const isSelected = month === selectedSlipMonth;
                    return (
                      <button
                        key={month}
                        type="button"
                        onClick={() => handleSelectMonth(month)}
                        className={`px-3 py-2 rounded-xl text-xs font-mono font-black flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500 text-white shadow-md'
                            : 'bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-700'
                        }`}
                      >
                        <span>{month}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 3. Total Base Commission Card */}
            <div className="bg-white rounded-3xl p-5 shadow-lg space-y-2">
              <span className="text-sm font-black text-slate-800 block text-right">العمولة الأساسية:</span>
              <div className="text-3xl sm:text-4xl font-black font-mono text-[#00d29f] flex items-center gap-2 text-right" dir="ltr">
                <span>$</span>
                <span>{currentMonthData.baseCommission}</span>
              </div>
            </div>

            {/* 4. Dynamic Host Cards */}
            {currentMonthData.hosts?.map((host) => (
              <div key={host.id} className="bg-white rounded-3xl p-4 shadow-lg space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="text-right">
                    <h3 className="text-base font-black text-slate-900">{host.name}</h3>
                    <span className="text-xs font-mono text-slate-600 font-bold block mt-0.5">ID: {host.id}</span>
                  </div>
                  <img 
                    src={host.avatar} 
                    alt={host.name} 
                    className="w-13 h-13 rounded-2xl object-cover shadow-sm border border-slate-100" 
                  />
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-bold">عمولة المساهمة:</span>
                    <span className="text-sky-500 font-mono font-black text-sm" dir="ltr">{host.contributionCommission}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-bold">عمولة المستوى:</span>
                    <span className="text-sky-500 font-mono font-black text-sm" dir="ltr">{host.levelCommission}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-bold">العمولة المفقودة:</span>
                    <span className="text-sky-500 font-mono font-black text-sm" dir="ltr">{host.lostCommission}</span>
                  </div>
                  <div className="pt-1 text-right text-[11px] font-medium text-slate-500">
                    <span>سبب (أسباب) الخصم: {host.deductionReason}</span>
                  </div>
                </div>
              </div>
            ))}

            {/* 6. Footer No More & Hash */}
            <div className="text-center pt-2 pb-6 space-y-1">
              <span className="text-xs text-slate-400 font-bold block">No more</span>
              <p className="text-xs text-slate-400 font-mono">
                5bf091baba51f03547dd5ff59aca09a5
              </p>
            </div>
          </motion.div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. SUB-MODAL: العمولة المفكوكة (مطابقة تامة للصورة 2) */}
      {/* ========================================================================= */}
      {showUnlockedCommissionModal && (
        <div 
          className="fixed inset-0 z-50 bg-[#060b13]/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          dir="rtl"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md my-auto space-y-3 font-sans"
          >
            {/* 1. Header Bar Card */}
            <div className="bg-white rounded-2xl p-3 shadow-lg flex items-center justify-between">
              <button
                onClick={() => setShowUnlockedCommissionModal(false)}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer transition-colors"
                title="رجوع"
              >
                <ArrowRight className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-slate-900 font-black text-sm sm:text-base">
                <Unlock className="w-5 h-5 text-emerald-500" />
                <span>العمولة المفكوكة</span>
              </div>

              <button
                onClick={() => setShowUnlockedCommissionModal(false)}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer transition-colors"
                title="إغلاق"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 2. Month Selector Card */}
            <div className="relative">
              <div 
                onClick={() => setShowMonthPickerDropdown(!showMonthPickerDropdown)}
                className="bg-white rounded-2xl px-4 py-3 shadow-lg flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors border border-transparent hover:border-amber-200"
              >
                <span className="text-sm font-black font-mono text-slate-900">
                  {selectedSlipMonth}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextMonth();
                    }}
                    title="الشهر التالي"
                    className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-amber-100 hover:text-amber-700 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePreviousMonth();
                    }}
                    title="الشهر السابق"
                    className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-amber-100 hover:text-amber-700 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <ChevronDown className={`w-4 h-4 text-slate-700 transition-transform duration-200 ${showMonthPickerDropdown ? 'rotate-180' : ''}`} />
                </div>
              </div>

              {showMonthPickerDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-30 max-h-56 overflow-y-auto grid grid-cols-2 gap-1.5">
                  {availableSlipMonths.map((month) => {
                    const isSelected = month === selectedSlipMonth;
                    return (
                      <button
                        key={month}
                        type="button"
                        onClick={() => handleSelectMonth(month)}
                        className={`px-3 py-2 rounded-xl text-xs font-mono font-black flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500 text-white shadow-md'
                            : 'bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-700'
                        }`}
                      >
                        <span>{month}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 3. Total Unlocked Commission Big Card */}
            <div className="bg-white rounded-3xl p-5 shadow-lg space-y-3">
              <span className="text-sm font-black text-slate-800 block text-right">العمولة المفكوكة:</span>
              <div className="text-3xl sm:text-4xl font-black font-mono text-[#00d29f] flex items-center gap-2 text-right" dir="ltr">
                <span>$</span>
                <span>{currentMonthData.unlockedDetails?.totalUnlocked || currentMonthData.unlockedCommission}</span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 pt-2 border-t border-slate-100 text-left">
                العمولة المفكوكة=العمولة الأساسية *(1-سعر العمولة)
              </p>
            </div>

            {/* 4. Tier & Diamonds Info Card (Cream / Pale Yellow) */}
            <div className="bg-[#fef9c3]/70 border border-amber-200/60 rounded-3xl p-4 shadow-md space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700">إجمالي الماس المستلم:</span>
                <span className="text-sky-500 font-black font-mono text-sm flex items-center gap-1" dir="ltr">
                  <span>{currentMonthData.unlockedDetails?.diamondsReceived || currentMonthData.agencyDiamondsReceived}</span>
                  <span>💎</span>
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700">المستوى المقابل:</span>
                <span className="text-sky-500 font-mono font-black text-sm" dir="ltr">
                  {currentMonthData.unlockedDetails?.levelRange || '0-4999999'}
                </span>
              </div>
            </div>

            {/* 5. Commission Rates Table Card */}
            <div className="bg-white rounded-3xl p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-600 pb-2 border-b border-slate-100">
                <span>إجمالي الماس المستلم</span>
                <span>سعر العمولة</span>
              </div>

              {/* Row 1: 0-4999999 */}
              <div className={`flex items-center justify-between text-sm font-black font-mono ${currentMonthData.unlockedDetails?.activeRate === '0.8' ? 'text-sky-500 bg-sky-50/70 p-2 rounded-xl' : 'text-slate-700'}`}>
                <span dir="ltr">0-4999999</span>
                <span>0.8</span>
              </div>

              {/* Row 2: 5000000-9999999 */}
              <div className={`flex items-center justify-between text-sm font-black font-mono ${currentMonthData.unlockedDetails?.activeRate === '0.9' ? 'text-sky-500 bg-sky-50/70 p-2 rounded-xl' : 'text-slate-700'}`}>
                <span dir="ltr">5000000-9999999</span>
                <span>0.9</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. SUB-MODAL: حصة الوسيط Broker side split (مطابقة تامة للصورة 3) */}
      {/* ========================================================================= */}
      {showBrokerSideSplitModal && (
        <div 
          className="fixed inset-0 z-50 bg-[#060b13]/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          dir="rtl"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md my-auto space-y-3 font-sans pb-6"
          >
            {/* 1. Header Bar Card */}
            <div className="bg-white rounded-2xl p-3 shadow-lg flex items-center justify-between">
              <button
                onClick={() => setShowBrokerSideSplitModal(false)}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer transition-colors"
                title="رجوع"
              >
                <ArrowRight className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-slate-900 font-black text-sm sm:text-base">
                <Users className="w-5 h-5 text-amber-500" />
                <span>حصة الوسيط (Broker side split)</span>
              </div>

              <button
                onClick={() => setShowBrokerSideSplitModal(false)}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer transition-colors"
                title="إغلاق"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 2. Month Selector Card */}
            <div className="relative">
              <div 
                onClick={() => setShowMonthPickerDropdown(!showMonthPickerDropdown)}
                className="bg-white rounded-2xl px-4 py-3 shadow-lg flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors border border-transparent hover:border-amber-200"
              >
                <span className="text-sm font-black font-mono text-slate-900">
                  {selectedSlipMonth}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextMonth();
                    }}
                    title="الشهر التالي"
                    className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-amber-100 hover:text-amber-700 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePreviousMonth();
                    }}
                    title="الشهر السابق"
                    className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-amber-100 hover:text-amber-700 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <ChevronDown className={`w-4 h-4 text-slate-700 transition-transform duration-200 ${showMonthPickerDropdown ? 'rotate-180' : ''}`} />
                </div>
              </div>

              {showMonthPickerDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-30 max-h-56 overflow-y-auto grid grid-cols-2 gap-1.5">
                  {availableSlipMonths.map((month) => {
                    const isSelected = month === selectedSlipMonth;
                    return (
                      <button
                        key={month}
                        type="button"
                        onClick={() => handleSelectMonth(month)}
                        className={`px-3 py-2 rounded-xl text-xs font-mono font-black flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500 text-white shadow-md'
                            : 'bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-700'
                        }`}
                      >
                        <span>{month}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 3. Total Broker Split Big Card */}
            <div className="bg-white rounded-3xl p-5 shadow-lg flex items-center justify-between">
              <div className="text-right space-y-1">
                <span className="text-sm font-black text-slate-800 block">الحصة الكلية:</span>
                <span className="text-[11px] font-medium text-slate-400 block">إجمالي حصص الوسطاء والشركاء</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-2xl sm:text-3xl font-black font-mono text-sky-500" dir="ltr">
                  {currentMonthData.brokerSplit?.totalShare || `$${currentMonthData.brokerShare}`}
                </span>
                <div className="w-10 h-10 rounded-full bg-sky-50 text-sky-500 border border-sky-100 flex items-center justify-center shadow-sm">
                  <Coins className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* 4. Broker Cards List */}
            {currentMonthData.brokerSplit?.brokers?.map((broker) => (
              <div key={broker.id} className="bg-white rounded-3xl p-4 shadow-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-right">
                    <h3 className="text-base font-black text-slate-900">{broker.name}</h3>
                    <span className="text-xs font-mono text-slate-600 font-bold block mt-0.5">ID: {broker.id}</span>
                  </div>
                  <div className="relative">
                    <img 
                      src={broker.avatar} 
                      alt={broker.name} 
                      className="w-12 h-12 rounded-full object-cover shadow-sm border border-slate-100" 
                    />
                    {broker.isClosed && (
                      <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 bg-slate-900/90 text-white text-[9px] font-black rounded-full shadow">
                        مغلق off
                      </span>
                    )}
                  </div>
                </div>
                <div className="space-y-2 text-xs pt-1 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-bold">مشاركة الأرباح:</span>
                    <span className="text-[#00d29f] font-mono font-black text-sm">{broker.profitShare}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-bold">مبلغ المشاركة:</span>
                    <span className="text-sky-500 font-mono font-black text-sm" dir="ltr">{broker.shareAmount}</span>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. BROKER HUB / MAIN MENU MODAL (الصورة المرفقة رقم 1) */}
      {/* ========================================================================= */}
      {showBrokersMenuModal && (
        <div 
          onClick={() => setShowBrokersMenuModal(false)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          dir="rtl"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm my-auto text-slate-900 flex flex-col items-center"
          >
            {/* White Floating Card - Exact from Screenshot 1 */}
            <div className="w-full bg-white rounded-[28px] overflow-hidden shadow-2xl border border-slate-100 p-2">
              
              {/* Header inside card */}
              <div className="flex items-center justify-between p-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-black text-slate-800">مركز إدارة الوسطاء</span>
                </div>
                <button
                  onClick={() => setShowBrokersMenuModal(false)}
                  className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Row 1: وسطائي */}
              <button
                onClick={() => {
                  setShowBrokersMenuModal(false);
                  setShowMyBrokersModal(true);
                }}
                className="w-full p-4 flex items-center justify-between hover:bg-slate-50 active:bg-slate-100 cursor-pointer transition-colors text-right"
              >
                <div className="flex items-center gap-2">
                  <ChevronLeft className="w-4 h-4 text-slate-300" />
                  <div className="flex items-center gap-1 font-mono font-bold text-sm">
                    <span className="text-emerald-500">{brokersList.length}</span>
                    <span className="text-slate-400">/ {selectedAgencyForBrokers.totalBrokers}</span>
                  </div>
                </div>
                <span className="text-base font-black text-slate-800">وسطائي</span>
              </button>

              <div className="border-t border-slate-100 mx-3" />

              {/* Row 2: دعوة الوسطاء */}
              <button
                onClick={() => {
                  setShowBrokersMenuModal(false);
                  setShowInviteBrokerModal(true);
                }}
                className="w-full p-4 flex items-center justify-between hover:bg-slate-50 active:bg-slate-100 cursor-pointer transition-colors text-right"
              >
                <ChevronLeft className="w-4 h-4 text-slate-300" />
                <span className="text-base font-black text-slate-800">دعوة الوسطاء</span>
              </button>

              <div className="border-t border-slate-100 mx-3" />

              {/* Row 3: إزالة الوسيط */}
              <button
                onClick={() => {
                  setShowBrokersMenuModal(false);
                  setShowRemoveBrokerModal(true);
                }}
                className="w-full p-4 flex items-center justify-between hover:bg-slate-50 active:bg-slate-100 cursor-pointer transition-colors text-right"
              >
                <ChevronLeft className="w-4 h-4 text-slate-300" />
                <span className="text-base font-black text-slate-800">إزالة الوسيط</span>
              </button>

              <div className="border-t border-slate-100 mx-3" />

              {/* Row 4: التوجيه */}
              <button
                onClick={() => {
                  setShowBrokersMenuModal(false);
                  setShowBrokerPoliciesModal(true);
                }}
                className="w-full p-4 flex items-center justify-between hover:bg-slate-50 active:bg-slate-100 cursor-pointer transition-colors text-right"
              >
                <ChevronLeft className="w-4 h-4 text-slate-300" />
                <span className="text-base font-black text-slate-800">التوجيه</span>
              </button>
            </div>

            {/* Footer Agency Info below card */}
            <p className="text-slate-400 text-xs font-bold text-center mt-3 font-mono">
              GID: {selectedAgencyForBrokers.gid} • {selectedAgencyForBrokers.name}
            </p>
          </motion.div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. "وسطائي" MY BROKERS LIST SCREEN (الصورة المرفقة رقم 2) */}
      {/* ========================================================================= */}
      {showMyBrokersModal && (
        <div 
          onClick={() => setShowMyBrokersModal(false)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          dir="rtl"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl my-auto text-slate-900 flex flex-col max-h-[92vh]"
          >
            {/* Top Navigation Bar */}
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => {
                    setShowMyBrokersModal(false);
                    setShowBrokersMenuModal(true);
                  }}
                  className="w-8 h-8 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 flex items-center justify-center cursor-pointer transition-colors shadow-sm"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <div>
                  <h2 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                    <span>وسطائي</span>
                    <span className="text-xs text-emerald-600 font-mono">({brokersList.length})</span>
                  </h2>
                  <span className="text-[10px] text-slate-400 font-mono">{selectedAgencyForBrokers.name} • GID: {selectedAgencyForBrokers.gid}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    setShowMyBrokersModal(false);
                    setShowInviteBrokerModal(true);
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-black flex items-center gap-1 cursor-pointer shadow-sm transition-transform active:scale-95"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>دعوة</span>
                </button>
                <button
                  onClick={() => setShowMyBrokersModal(false)}
                  className="w-8 h-8 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="p-4 overflow-y-auto space-y-3.5 flex-1">
              
              {/* Pink Notification Banner - Exact from Screenshot 2 */}
              <div className="p-3 bg-rose-50/70 border border-rose-100/80 rounded-2xl text-center shadow-sm">
                <p className="text-xs font-bold text-rose-500 leading-relaxed">
                  بمجرد انضمام وسيط إلى وكالتك، يمكنه دعوة المذيعين مباشرة إلى وكالتك.
                </p>
              </div>

              {/* Search Bar - Exact from Screenshot 2 */}
              <div className="flex items-center gap-2">
                <div className="flex-1 relative flex items-center">
                  <input
                    type="text"
                    value={brokerSearchQuery}
                    onChange={(e) => setBrokerSearchQuery(e.target.value)}
                    placeholder="ID"
                    className="w-full py-2.5 pr-9 pl-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-mono placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-right"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute right-3 pointer-events-none" />
                </div>
                <button
                  onClick={() => {
                    if (brokerSearchQuery) {
                      showToast(`🔍 جاري تصفية الوسطاء برقم المعرف: ${brokerSearchQuery}`);
                    }
                  }}
                  className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs cursor-pointer border border-slate-200 transition-colors"
                >
                  تأكيد
                </button>
              </div>

              {/* Brokers Count Header Bar with Help Question Icon */}
              <div className="flex items-center justify-between px-1 text-xs">
                <button
                  onClick={() => setShowBrokerPoliciesModal(true)}
                  className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer transition-colors"
                  title="سياسات وتوجيهات الوسطاء"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                </button>
                
                <div className="flex items-center gap-1.5 font-bold">
                  <span className="text-slate-800 text-xs">عدد الوسطاء:</span>
                  <div className="flex items-center gap-0.5 font-mono text-sm">
                    <span className="text-emerald-500 font-black">{brokersList.length}</span>
                    <span className="text-slate-900 font-black">/ {selectedAgencyForBrokers.totalBrokers}</span>
                  </div>
                </div>
              </div>

              {/* Brokers Cards List */}
              <div className="space-y-3">
                {brokersList
                  .filter(b => !brokerSearchQuery || b.id.includes(brokerSearchQuery) || b.name.includes(brokerSearchQuery))
                  .map((broker) => (
                    <div
                      key={broker.id}
                      onClick={() => {
                        setSelectedBrokerForProfile(broker);
                        setShowBrokerProfileModal(true);
                      }}
                      className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-2 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
                    >
                      {/* Top Row: Avatar + Name/ID + Management Button */}
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                          {/* Avatar with potential "مغلق off" circular badge */}
                          <div className="relative w-12 h-12 shrink-0">
                            <img
                              src={broker.avatar}
                              alt={broker.name}
                              className="w-full h-full rounded-full object-cover border border-slate-200 group-hover:ring-2 ring-blue-400 transition-all"
                            />
                            {broker.isClosed && (
                              <div className="absolute inset-0 bg-black/85 rounded-full flex flex-col items-center justify-center text-white text-[9px] font-black leading-tight border border-black shadow-inner">
                                <span>مغلق</span>
                                <span className="font-mono text-[8px]">off</span>
                              </div>
                            )}
                          </div>

                          <div>
                            <h4 className="text-xs font-black text-slate-900 leading-snug group-hover:text-blue-600 transition-colors flex items-center gap-1.5">
                              <span>{broker.name}</span>
                              <ChevronLeft className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-500 transition-colors" />
                            </h4>
                            <span className="text-[11px] text-slate-500 font-mono font-bold block mt-0.5" dir="ltr">
                              ID: {broker.id}
                            </span>
                          </div>
                        </div>

                        {/* Green Manage Button - Exact from Screenshot 2 */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBrokerForManage(broker);
                            setShowManageSingleBrokerModal(true);
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs cursor-pointer shadow-sm transition-transform active:scale-95"
                        >
                          إدارة
                        </button>
                      </div>

                      {/* Details lines with Cyan Values - Exact from Screenshot 2 */}
                      <div className="space-y-1 text-xs pt-1">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600 font-bold">وقت الانضمام:</span>
                          <span className="text-cyan-500 font-mono font-bold text-[11px]" dir="ltr">
                            {broker.joinDate}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-slate-600 font-bold">مشاركة الأرباح:</span>
                          <span className="text-cyan-500 font-mono font-bold text-xs" dir="ltr">
                            {broker.profitShare.toFixed(2)}%
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-slate-600 font-bold">عدد المذيعين المدعوين:</span>
                          <span className="text-cyan-500 font-mono font-bold text-xs" dir="ltr">
                            {broker.invitedHostsCount}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-slate-600 font-bold">المذيعون الجدد:</span>
                          <span className="text-cyan-500 font-mono font-bold text-xs" dir="ltr">
                            {broker.newHostsCount}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-slate-600 font-bold">إجمالي الماس الشهري المستلم:</span>
                          <span className="text-cyan-500 font-mono font-bold text-xs flex items-center gap-1" dir="ltr">
                            <span>💎</span>
                            <span>{broker.monthlyDiamonds}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                {brokersList.length === 0 && (
                  <div className="p-8 text-center text-slate-400 space-y-2">
                    <UserCheck className="w-10 h-10 text-slate-300 mx-auto" />
                    <p className="text-xs font-bold">لا يوجد وسطاء حالياً في هذه الوكالة</p>
                  </div>
                )}
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  setShowMyBrokersModal(false);
                  setShowBrokersMenuModal(true);
                }}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs cursor-pointer transition-colors"
              >
                العودة للقائمة
              </button>
              <button
                onClick={() => setShowMyBrokersModal(false)}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs cursor-pointer transition-colors"
              >
                إغلاق
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. "دعوة وسيط بال ID" MODAL (الصورة المرفقة رقم 3) */}
      {/* ========================================================================= */}
      {showInviteBrokerModal && (
        <div 
          onClick={() => setShowInviteBrokerModal(false)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          dir="rtl"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl p-5 my-auto text-slate-900 space-y-4"
          >
            {/* Top Close Button & Icon Header */}
            <div className="flex items-start justify-between">
              <button
                onClick={() => setShowInviteBrokerModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-500 shadow-sm mx-auto">
                <UserPlus className="w-6 h-6" />
              </div>

              <div className="w-8 h-8" />
            </div>

            {/* Title & Subtitle */}
            <div className="text-center space-y-1">
              <h2 className="text-base font-black text-slate-900">دعوة وسيط بال ID</h2>
              <p className="text-xs text-slate-400 font-bold">
                {selectedAgencyForBrokers.name} • معرف الوكالة GID: <span className="font-mono text-slate-600">{selectedAgencyForBrokers.gid}</span>
              </p>
            </div>

            {/* Field 1: معرف الوكالة (GID) */}
            <div className="space-y-1.5 text-right">
              <label className="text-xs font-bold text-slate-700 block">معرف الوكالة (GID):</label>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText?.(selectedAgencyForBrokers.gid);
                    showToast(`📋 تم نسخ GID الوكالة: ${selectedAgencyForBrokers.gid}`);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-sm transition-transform active:scale-95"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>نسخ GID</span>
                </button>
                <span className="text-xl font-black font-mono text-blue-600 tracking-wider">
                  {selectedAgencyForBrokers.gid}
                </span>
              </div>
            </div>

            {/* Field 2: معرف المستخدم للوسيط (User ID) */}
            <div className="space-y-1.5 text-right">
              <label className="text-xs font-bold text-slate-700 block">معرف المستخدم للوسيط (User ID):</label>
              <input
                type="text"
                value={inviteBrokerUserId}
                onChange={(e) => setInviteBrokerUserId(e.target.value)}
                placeholder="أدخل رقم ID الوسيط (مثال: 871023)"
                className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-right"
              />
            </div>

            {/* Instructions Light Cyan Card - Exact from Screenshot 3 */}
            <div className="p-3.5 rounded-2xl bg-cyan-50/70 border border-cyan-100/90 text-right space-y-1.5">
              <div className="flex items-center gap-1.5 text-cyan-800 text-xs font-black">
                <Sparkles className="w-4 h-4 text-cyan-600" />
                <span>تعليمات اعتماد الوسيط عبر ال ID:</span>
              </div>
              <p className="text-[11px] text-cyan-900/80 leading-relaxed font-medium">
                يقوم صاحب الوكالة بإرسال طلب الاعتماد إلى User ID للوسيط، أو يقوم الوسيط بالانضمام للوكالة باستخدام GID: {selectedAgencyForBrokers.gid}، ويتم إدراجه فوراً في جدول حساب نسبة الأرباح وقسيمة الرواتب.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                onClick={handleSendBrokerInvite}
                disabled={!inviteBrokerUserId.trim()}
                className={`w-full py-3 rounded-2xl font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow transition-transform active:scale-95 ${
                  inviteBrokerUserId.trim()
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>إرسال الدعوة للوسيط (ID)</span>
              </button>

              <button
                onClick={() => setShowInviteBrokerModal(false)}
                className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs cursor-pointer transition-colors"
              >
                إلغاء
              </button>
            </div>

          </motion.div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. "إدارة وإزالة الوسطاء" MODAL (الصورة المرفقة رقم 4) */}
      {/* ========================================================================= */}
      {showRemoveBrokerModal && (
        <div 
          onClick={() => setShowRemoveBrokerModal(false)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          dir="rtl"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl p-5 my-auto text-slate-900 space-y-4 max-h-[90vh] flex flex-col"
          >
            {/* Header: Title + UserMinus Icon + Close Button */}
            <div className="flex items-start justify-between pb-2 border-b border-slate-100">
              <button
                onClick={() => setShowRemoveBrokerModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center flex-1 pr-2">
                <h2 className="text-base font-black text-slate-900">إدارة وإزالة الوسطاء</h2>
                <p className="text-xs text-slate-400 font-bold">{selectedAgencyForBrokers.name}</p>
              </div>

              <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 shadow-sm shrink-0">
                <UserMinus className="w-5 h-5" />
              </div>
            </div>

            {/* Scrollable List of Brokers with Remove Button */}
            <div className="space-y-2 overflow-y-auto flex-1 pr-0.5">
              {brokersList.map((broker) => (
                <div
                  key={broker.id}
                  className="p-3 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-between hover:border-rose-200 transition-colors"
                >
                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveBroker(broker.id, broker.name)}
                    className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-black text-xs flex items-center gap-1 cursor-pointer transition-colors active:scale-95"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>إزالة</span>
                  </button>

                  {/* Broker Avatar + Name & ID */}
                  <div className="flex items-center gap-2.5">
                    <div className="text-right">
                      <h4 className="text-xs font-black text-slate-900 leading-snug">{broker.name}</h4>
                      <span className="text-[11px] text-slate-500 font-mono font-bold block" dir="ltr">
                        ID: {broker.id}
                      </span>
                    </div>
                    <img
                      src={broker.avatar}
                      alt={broker.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                    />
                  </div>
                </div>
              ))}

              {brokersList.length === 0 && (
                <div className="p-6 text-center text-slate-400 space-y-2">
                  <p className="text-xs font-bold">تمت إزالة جميع الوسطاء من القائمة</p>
                </div>
              )}
            </div>

            {/* Bottom Close Button */}
            <div className="pt-2">
              <button
                onClick={() => setShowRemoveBrokerModal(false)}
                className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs cursor-pointer transition-colors"
              >
                إغلاق
              </button>
            </div>

          </motion.div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. "توجيهات وسياسات مركز الوسطاء" MODAL (الصورة المرفقة رقم 5) */}
      {/* ========================================================================= */}
      {showBrokerPoliciesModal && (
        <div 
          onClick={() => setShowBrokerPoliciesModal(false)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          dir="rtl"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl p-5 my-auto text-slate-900 space-y-4 max-h-[90vh] flex flex-col"
          >
            {/* Header: Title + BookOpen Icon + Close Button */}
            <div className="flex items-start justify-between pb-2 border-b border-slate-100">
              <button
                onClick={() => setShowBrokerPoliciesModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center flex-1 pr-2">
                <h2 className="text-base font-black text-slate-900">توجيهات وسياسات مركز الوسطاء</h2>
                <p className="text-xs text-slate-400 font-bold">نظام إدارة الوكالات والوسطاء المعتمد</p>
              </div>

              <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500 shadow-sm shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
            </div>

            {/* 3 Structured Policy Cards - Exact from Screenshot 5 */}
            <div className="space-y-3 overflow-y-auto flex-1 text-right">
              
              {/* Card 1: ما هو دور الوسيط في الوكالة؟ */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-2">
                <h3 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>1. ما هو دور الوسيط في الوكالة؟</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  الوسيط هو شريك يساعد الوكالة في استقطاب وإدارة المضيفين والمذيعين، ويتم تحديد نسبة ربح متفق عليها من عمولة الوكالة الإجمالية.
                </p>
              </div>

              {/* Card 2: كيفية احتساب وتوزيع حصة الوسيط */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-2">
                <h3 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>2. كيفية احتساب وتوزيع حصة الوسيط</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  يتم حساب حصة الوسيط شهرياً بناءً على إجمالي الماسات المحققة والنسبة المقررة في قسيمة الراتب، وتُحول تلقائياً إلى حساب الوسيط المعتمد.
                </p>
              </div>

              {/* Card 3: شروط استمرار اعتماد الوسيط */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-2">
                <h3 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>3. شروط استمرار اعتماد الوسيط</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  يجب أن يلتزم الوسطاء بمعايير البث الرسمية، وتحقيق الحد الأدنى من الأهداف الشهرية النشطة لتجنب تجميد الحساب أو الإزالة.
                </p>
              </div>

            </div>

            {/* Bottom Orange Button: فهمت ذلك */}
            <div className="pt-2">
              <button
                onClick={() => setShowBrokerPoliciesModal(false)}
                className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs cursor-pointer shadow transition-transform active:scale-95"
              >
                فهمت ذلك
              </button>
            </div>

          </motion.div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. MANAGE INDIVIDUAL BROKER MODAL (تعديل نسبة الربح والحالة) */}
      {/* ========================================================================= */}
      {showManageSingleBrokerModal && selectedBrokerForManage && (
        <div 
          onClick={() => setShowManageSingleBrokerModal(false)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          dir="rtl"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl p-5 my-auto text-slate-900 space-y-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <button
                onClick={() => setShowManageSingleBrokerModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="text-center flex-1">
                <h3 className="text-sm font-black text-slate-900">إدارة إعدادات الوسيط</h3>
                <span className="text-[11px] text-slate-500 font-mono">ID: {selectedBrokerForManage.id}</span>
              </div>
              <div className="w-8 h-8" />
            </div>

            {/* Broker Summary Card */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
              <img
                src={selectedBrokerForManage.avatar}
                alt={selectedBrokerForManage.name}
                className="w-12 h-12 rounded-full object-cover border border-slate-300"
              />
              <div className="flex-1">
                <h4 className="text-xs font-black text-slate-900">{selectedBrokerForManage.name}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  المذيعين المدعوين: <strong className="text-blue-600 font-mono">{selectedBrokerForManage.invitedHostsCount}</strong>
                </p>
              </div>
            </div>

            {/* Profit Share Setting */}
            <div className="space-y-2 text-right">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">نسبة مشاركة الأرباح:</span>
                <span className="text-sm font-mono font-black text-emerald-600">
                  {selectedBrokerForManage.profitShare.toFixed(1)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={selectedBrokerForManage.profitShare}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setSelectedBrokerForManage({ ...selectedBrokerForManage, profitShare: val });
                  setBrokersList(prev => prev.map(b => b.id === selectedBrokerForManage.id ? { ...b, profitShare: val } : b));
                }}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Toggle Status: Open / Closed */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-black text-slate-900 block">حالة حساب الوسيط:</span>
                <span className="text-[10px] text-slate-500 font-bold">
                  {selectedBrokerForManage.isClosed ? 'مغلق حالياً (لا يستقبل مذيعين)' : 'نشط ومعتمد'}
                </span>
              </div>
              <button
                onClick={() => {
                  const newClosed = !selectedBrokerForManage.isClosed;
                  setSelectedBrokerForManage({ ...selectedBrokerForManage, isClosed: newClosed });
                  setBrokersList(prev => prev.map(b => b.id === selectedBrokerForManage.id ? { ...b, isClosed: newClosed } : b));
                  showToast(newClosed ? 'تم إغلاق حساب الوسيط' : 'تم تفعيل حساب الوسيط');
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black cursor-pointer shadow-sm transition-all ${
                  selectedBrokerForManage.isClosed
                    ? 'bg-rose-500 text-white'
                    : 'bg-emerald-500 text-white'
                }`}
              >
                {selectedBrokerForManage.isClosed ? 'مغلق (off)' : 'نشط (on)'}
              </button>
            </div>

            {/* Save Button */}
            <button
              onClick={() => {
                showToast(`✅ تم حفظ إعدادات الوسيط ${selectedBrokerForManage.name} بنجاح`);
                setShowManageSingleBrokerModal(false);
              }}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs cursor-pointer shadow transition-transform active:scale-95"
            >
              حفظ التعديلات
            </button>
          </motion.div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. BROKER PROFILE & INVITED HOSTS MODAL (الصورة المرفقة للمذيعين المدعوين) */}
      {/* ========================================================================= */}
      {showBrokerProfileModal && selectedBrokerForProfile && (
        <div 
          onClick={() => setShowBrokerProfileModal(false)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
          dir="rtl"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#f4f6f9] rounded-[32px] overflow-hidden shadow-2xl my-auto text-slate-900 flex flex-col max-h-[94vh] border border-slate-200"
          >
            {/* Top Navigation Bar */}
            <div className="p-4 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-10">
              <button
                onClick={() => setShowBrokerProfileModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
                title="إغلاق"
              >
                <X className="w-4 h-4" />
              </button>
              
              <h2 className="text-sm font-black text-slate-900 flex-1 text-center pr-2">
                {selectedBrokerForProfile.name}
              </h2>

              <div className="w-8 h-8" />
            </div>

            {/* Scrollable Content */}
            <div className="p-4 overflow-y-auto space-y-4 flex-1">
              
              {/* 1. Main Broker Card - Exact from Screenshot */}
              <div className="bg-white rounded-3xl p-4 shadow-sm space-y-3 border border-slate-100/90">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    {/* Broker Avatar with "مغلق off" badge if closed */}
                    <div className="relative w-14 h-14 shrink-0">
                      <img
                        src={selectedBrokerForProfile.avatar}
                        alt={selectedBrokerForProfile.name}
                        className="w-full h-full rounded-full object-cover border border-slate-200 shadow-sm"
                      />
                      {selectedBrokerForProfile.isClosed && (
                        <div className="absolute inset-0 bg-black/85 rounded-full flex flex-col items-center justify-center text-white text-[9px] font-black leading-tight border border-black shadow-inner">
                          <span>مغلق</span>
                          <span className="font-mono text-[8px]">off</span>
                        </div>
                      )}
                    </div>

                    <div className="text-right">
                      <h3 className="text-sm font-black text-slate-900 leading-snug">{selectedBrokerForProfile.name}</h3>
                      <span className="text-xs text-slate-500 font-mono font-bold block mt-0.5" dir="ltr">
                        ID: {selectedBrokerForProfile.id}
                      </span>
                    </div>
                  </div>

                  {/* Green "إدارة" Button */}
                  <button
                    onClick={() => {
                      setSelectedBrokerForManage(selectedBrokerForProfile);
                      setShowManageSingleBrokerModal(true);
                    }}
                    className="px-4 py-1.5 rounded-full bg-[#00d29f] hover:bg-[#00ba8d] text-white font-black text-xs cursor-pointer shadow-sm transition-transform active:scale-95"
                  >
                    إدارة
                  </button>
                </div>

                {/* Details list */}
                <div className="space-y-1.5 text-xs pt-0.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-bold">وقت الانضمام:</span>
                    <span className="text-[#00d29f] font-mono font-black text-xs" dir="ltr">
                      {selectedBrokerForProfile.joinDate}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-bold">مشاركة الأرباح:</span>
                    <span className="text-sky-500 font-mono font-black text-xs" dir="ltr">
                      {typeof selectedBrokerForProfile.profitShare === 'number'
                        ? selectedBrokerForProfile.profitShare.toFixed(2) + '%'
                        : selectedBrokerForProfile.profitShare}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-bold">عدد المذيعين المدعوين:</span>
                    <span className="text-sky-500 font-mono font-black text-xs" dir="ltr">
                      {selectedBrokerForProfile.invitedHostsCount || selectedBrokerForProfile.invitedHosts?.length || 28}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-bold">المذيعون الجدد:</span>
                    <span className="text-sky-500 font-mono font-black text-xs" dir="ltr">
                      {selectedBrokerForProfile.newHostsCount ?? 1}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-bold">إجمالي الماس الشهري المستلم:</span>
                    <span className="text-sky-500 font-mono font-black text-xs flex items-center gap-1" dir="ltr">
                      <span>💎</span>
                      <span>{selectedBrokerForProfile.monthlyDiamonds || '779,950'}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. Section Header: المذيعون المدعوين */}
              <div className="flex items-center justify-between px-1 pt-1">
                <span className="text-xs text-slate-400 font-bold font-mono">
                  {selectedAgencyForBrokers.name}
                </span>
                <h3 className="text-sm font-black text-slate-900">
                  المذيعون المدعوين ({(selectedBrokerForProfile.invitedHosts || []).length || 8})
                </h3>
              </div>

              {/* 3. List of Hosted Members (المذيعون المدعوين) */}
              <div className="space-y-3">
                {(selectedBrokerForProfile.invitedHosts || [
                  {
                    id: '95770929',
                    name: 'محمد',
                    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
                    joinDate: '2026-06-06T18:40:15Z',
                    monthlyDiamonds: '0'
                  },
                  {
                    id: '94726307',
                    name: 'المطنوخ',
                    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                    joinDate: '2026-05-30T20:59:03Z',
                    monthlyDiamonds: '0'
                  },
                  {
                    id: '90782114',
                    name: 'ذياب',
                    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
                    joinDate: '2026-05-30T00:55:02Z',
                    monthlyDiamonds: '0'
                  },
                  {
                    id: '89932144',
                    name: 'مجنون',
                    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
                    joinDate: '2026-05-28T14:10:00Z',
                    monthlyDiamonds: '12,400'
                  },
                  {
                    id: '91882341',
                    name: 'ساهر الليل',
                    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
                    joinDate: '2026-05-25T11:20:00Z',
                    monthlyDiamonds: '48,500'
                  },
                  {
                    id: '96541209',
                    name: 'أميرة الورد',
                    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
                    joinDate: '2026-05-20T09:15:30Z',
                    monthlyDiamonds: '135,000'
                  },
                  {
                    id: '92154388',
                    name: 'الصقر الجارح',
                    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
                    joinDate: '2026-05-15T16:45:10Z',
                    monthlyDiamonds: '280,000'
                  },
                  {
                    id: '91124450',
                    name: 'البرنس',
                    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
                    joinDate: '2026-05-10T08:12:00Z',
                    monthlyDiamonds: '304,050'
                  }
                ]).map((host: any) => (
                  <div 
                    key={host.id}
                    className="bg-white rounded-3xl p-4 shadow-sm space-y-2.5 border border-slate-100/90 hover:border-slate-200 transition-all"
                  >
                    {/* Top Row: Name/ID + Avatar */}
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="text-right">
                        <h4 className="text-sm font-black text-slate-900">{host.name}</h4>
                        <span className="text-xs font-mono text-slate-500 font-bold block mt-0.5" dir="ltr">
                          ID: {host.id}
                        </span>
                      </div>
                      <img
                        src={host.avatar}
                        alt={host.name}
                        className="w-13 h-13 rounded-full object-cover shadow-sm border border-slate-100"
                      />
                    </div>

                    {/* Bottom Details: Join Date & Monthly Diamonds */}
                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600 font-bold">وقت الانضمام:</span>
                        <span className="text-[#00d29f] font-mono font-black text-xs" dir="ltr">
                          {host.joinDate}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600 font-bold">الماس المستلم شهريًا:</span>
                        <span className="text-sky-500 font-mono font-black text-xs flex items-center gap-1" dir="ltr">
                          <span>{host.monthlyDiamonds}</span>
                          <span>💎</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* Bottom Close Bar */}
            <div className="p-3.5 bg-white border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  setShowBrokerProfileModal(false);
                  setShowMyBrokersModal(true);
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-colors"
              >
                العودة لقائمة الوسطاء
              </button>
              <button
                onClick={() => setShowBrokerProfileModal(false)}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs cursor-pointer transition-colors"
              >
                إغلاق
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FULLSCREEN IMAGE / AVATAR LIGHTBOX VIEWER */}
      {/* ========================================================================= */}
      {fullscreenImage && (
        <div 
          onClick={() => setFullscreenImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 cursor-pointer"
          dir="rtl"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            onClick={(e) => e.stopPropagation()}
            className="max-w-md w-full bg-[#0d1527] border border-slate-700 rounded-3xl p-5 text-center space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-black text-amber-400">{fullscreenImage.badge || 'عرض شاشة كاملة'}</span>
              <button
                onClick={() => setFullscreenImage(null)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative mx-auto w-64 h-64 rounded-3xl overflow-hidden border-4 border-amber-400/80 shadow-2xl">
              <img src={fullscreenImage.url} alt={fullscreenImage.title} className="w-full h-full object-cover" />
            </div>

            <div>
              <h3 className="text-base font-black text-white">{fullscreenImage.title}</h3>
              {fullscreenImage.subtitle && (
                <p className="text-xs text-slate-400 mt-1">{fullscreenImage.subtitle}</p>
              )}
            </div>

            <button
              onClick={() => setFullscreenImage(null)}
              className="w-full py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs cursor-pointer shadow"
            >
              إغلاق الشاشة
            </button>
          </motion.div>
        </div>
      )}

    </div>
  );
};
