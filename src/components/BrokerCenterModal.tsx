import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Search,
  Settings,
  History,
  HelpCircle,
  Users,
  Mic,
  RefreshCw,
  Wallet,
  Megaphone,
  Share2,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Send,
  Building,
  Sparkles,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Clock,
  Calendar,
  DollarSign,
  Radio,
  ClipboardList,
  Scale,
  Award,
  ShieldCheck,
  SlidersHorizontal,
  UserCheck
} from 'lucide-react';

interface BrokerCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  direction?: 'rtl' | 'ltr';
}

// Dummy host list for the broker
interface HostItem {
  id: string;
  name: string;
  avatar: string;
  joinedAt: string;
  monthlyDiamonds: number;
  monthlyPercentage: string;
  streamMinutes: number;
  targetMinutes: number;
  streamDays: number;
  targetDays: number;
  isDaysComplete: boolean;
  isMinutesComplete: boolean;
  hasDrop: boolean;
  earningsThisMonth: number;
}

const INITIAL_HOSTS: HostItem[] = [
  {
    id: '83534797',
    name: '🔱👑ملك الدوله👑🔱',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    joinedAt: '2026-02-01T15:01:12Z',
    monthlyDiamonds: 1008299,
    monthlyPercentage: '%3,823.34',
    streamMinutes: 6537,
    targetMinutes: 420,
    streamDays: 16,
    targetDays: 7,
    isDaysComplete: true,
    isMinutesComplete: true,
    hasDrop: false,
    earningsThisMonth: 6.0,
  },
  {
    id: '93138402',
    name: '🦅WESAM🦅',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    joinedAt: '2026-04-08T20:33:13Z',
    monthlyDiamonds: 700,
    monthlyPercentage: '%1,300.00',
    streamMinutes: 1451,
    targetMinutes: 420,
    streamDays: 4,
    targetDays: 7,
    isDaysComplete: false,
    isMinutesComplete: true,
    hasDrop: false,
    earningsThisMonth: 0.0,
  },
  {
    id: '95770929',
    name: 'محمد',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    joinedAt: '2026-06-06T18:40:15Z',
    monthlyDiamonds: 0,
    monthlyPercentage: '%0.00',
    streamMinutes: 0,
    targetMinutes: 420,
    streamDays: 0,
    targetDays: 7,
    isDaysComplete: false,
    isMinutesComplete: false,
    hasDrop: true,
    earningsThisMonth: 0.0,
  },
  {
    id: '94726307',
    name: 'المطنوخ',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    joinedAt: '2026-05-30T20:59:03Z',
    monthlyDiamonds: 0,
    monthlyPercentage: '%0.00',
    streamMinutes: 0,
    targetMinutes: 420,
    streamDays: 0,
    targetDays: 7,
    isDaysComplete: false,
    isMinutesComplete: false,
    hasDrop: false,
    earningsThisMonth: 0.0,
  },
  {
    id: '90782114',
    name: 'ذياب',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    joinedAt: '2026-05-30T00:55:02Z',
    monthlyDiamonds: 0,
    monthlyPercentage: '%0.00',
    streamMinutes: 0,
    targetMinutes: 420,
    streamDays: 0,
    targetDays: 7,
    isDaysComplete: false,
    isMinutesComplete: false,
    hasDrop: false,
    earningsThisMonth: 0.0,
  },
  {
    id: '92245274',
    name: 'مجنون',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    joinedAt: '2026-05-27T21:59:28Z',
    monthlyDiamonds: 0,
    monthlyPercentage: '%0.00',
    streamMinutes: 0,
    targetMinutes: 420,
    streamDays: 0,
    targetDays: 7,
    isDaysComplete: false,
    isMinutesComplete: false,
    hasDrop: false,
    earningsThisMonth: 0.0,
  },
  {
    id: '93669954',
    name: 'عاشق في دنيا المستحيل',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    joinedAt: '2026-05-21T21:48:57Z',
    monthlyDiamonds: 0,
    monthlyPercentage: '%0.00',
    streamMinutes: 0,
    targetMinutes: 420,
    streamDays: 0,
    targetDays: 7,
    isDaysComplete: false,
    isMinutesComplete: false,
    hasDrop: false,
    earningsThisMonth: 0.0,
  },
  {
    id: '78978695',
    name: 'الـMـــــزوون',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    joinedAt: '2026-05-15T14:20:00Z',
    monthlyDiamonds: 125000,
    monthlyPercentage: '%250.00',
    streamMinutes: 1200,
    targetMinutes: 420,
    streamDays: 10,
    targetDays: 7,
    isDaysComplete: true,
    isMinutesComplete: true,
    hasDrop: false,
    earningsThisMonth: 1.5,
  },
  {
    id: '79191412',
    name: 'صدام MÁ',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    joinedAt: '2026-05-10T12:00:00Z',
    monthlyDiamonds: 450000,
    monthlyPercentage: '%450.00',
    streamMinutes: 3400,
    targetMinutes: 420,
    streamDays: 14,
    targetDays: 7,
    isDaysComplete: true,
    isMinutesComplete: true,
    hasDrop: false,
    earningsThisMonth: 3.0,
  },
  {
    id: '88029042',
    name: 'مـ👑ـرآد 2025',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    joinedAt: '2026-05-01T10:00:00Z',
    monthlyDiamonds: 89000,
    monthlyPercentage: '%120.00',
    streamMinutes: 850,
    targetMinutes: 420,
    streamDays: 8,
    targetDays: 7,
    isDaysComplete: true,
    isMinutesComplete: true,
    hasDrop: false,
    earningsThisMonth: 0.8,
  },
  {
    id: '88216266',
    name: 'الولهان MÁ',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    joinedAt: '2026-04-20T18:00:00Z',
    monthlyDiamonds: 310000,
    monthlyPercentage: '%310.00',
    streamMinutes: 2800,
    targetMinutes: 420,
    streamDays: 12,
    targetDays: 7,
    isDaysComplete: true,
    isMinutesComplete: true,
    hasDrop: false,
    earningsThisMonth: 2.2,
  },
  {
    id: '88265801',
    name: 'العدنيه MÁ',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    joinedAt: '2026-04-15T15:00:00Z',
    monthlyDiamonds: 520000,
    monthlyPercentage: '%520.00',
    streamMinutes: 4100,
    targetMinutes: 420,
    streamDays: 15,
    targetDays: 7,
    isDaysComplete: true,
    isMinutesComplete: true,
    hasDrop: false,
    earningsThisMonth: 4.1,
  },
  {
    id: '88724970',
    name: 'منصور برشى',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    joinedAt: '2026-04-01T11:00:00Z',
    monthlyDiamonds: 95000,
    monthlyPercentage: '%150.00',
    streamMinutes: 900,
    targetMinutes: 420,
    streamDays: 7,
    targetDays: 7,
    isDaysComplete: true,
    isMinutesComplete: true,
    hasDrop: false,
    earningsThisMonth: 0.9,
  }
];

interface InvitationLog {
  id: string;
  userId: string;
  userName: string;
  avatar: string;
  date: string;
  status: 'rejected' | 'operation_rejected' | 'accepted' | 'pending';
}

const INITIAL_INVITATIONS: InvitationLog[] = [
  { id: '1', userId: '89589900', userName: 'يـامـاش ᴮ¹', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', date: '2026-08-17T22:26:12Z', status: 'rejected' },
  { id: '2', userId: '89881622', userName: 'تينه 🌵', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', date: '2026-08-11T04:12:44Z', status: 'operation_rejected' },
  { id: '3', userId: '82022690', userName: 'topies Aka👑 🇺🇸', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', date: '2026-06-07T20:10:36Z', status: 'rejected' },
  { id: '4', userId: '95770929', userName: 'محمد', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', date: '2026-06-06T18:39:25Z', status: 'accepted' },
  { id: '5', userId: '90407471', userName: 'بنت اليمن', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80', date: '2026-06-06T01:54:19Z', status: 'rejected' },
  { id: '6', userId: '90608414', userName: 'يحسدوك', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&auto=format&fit=crop&q=80', date: '2026-06-05T18:13:03Z', status: 'operation_rejected' },
  { id: '7', userId: '91148323', userName: 'الفارس', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80', date: '2026-06-05T18:11:56Z', status: 'rejected' },
  { id: '8', userId: '92137130', userName: 'دعـشوشـه Aʳ 👑', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80', date: '2026-06-05T16:48:12Z', status: 'rejected' },
  { id: '9', userId: '81846235', userName: 'Canaan', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80', date: '2026-05-30T22:17:08Z', status: 'operation_rejected' },
  { id: '10', userId: '88335415', userName: 'Gfhj Yfu', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80', date: '2026-05-30T22:16:43Z', status: 'rejected' },
];

export const BrokerCenterModal: React.FC<BrokerCenterModalProps> = ({
  isOpen,
  onClose,
  direction = 'rtl',
}) => {
  // Views navigation
  const [currentView, setCurrentView] = useState<
    | 'main'
    | 'host_stats'
    | 'my_invited_hosts'
    | 'invitation_log'
    | 'wallet_withdraw'
    | 'transfer_hosts'
    | 'monthly_earnings'
    | 'my_agency'
    | 'agency_announcement'
    | 'host_management'
  >('main');

  // Performance analytics collapsible state
  const [isAnalyticsExpanded, setIsAnalyticsExpanded] = useState(true);

  // Sub-states & modals
  const [isInviteSheetOpen, setIsInviteSheetOpen] = useState(false);
  const [isInviteIdModalOpen, setIsInviteIdModalOpen] = useState(false);
  const [inviteIdInput, setInviteIdInput] = useState('');
  const [inviteFeedback, setInviteFeedback] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Host stats filter tab
  const [hostStatsTab, setHostStatsTab] = useState<'all' | 'incomplete' | 'drop'>('all');

  // Transfer hosts selection
  const [transferSearch, setTransferSearch] = useState('');
  const [selectedHostsForTransfer, setSelectedHostsForTransfer] = useState<string[]>([]);
  const [isTransferSuccess, setIsTransferSuccess] = useState(false);

  // Invitation logs filter
  const [invitationFilter, setInvitationFilter] = useState<'all' | 'accepted' | 'rejected' | 'operation_rejected'>('all');

  // Wallet state
  const [withdrawTargetId, setWithdrawTargetId] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [walletBalance, setWalletBalance] = useState<number>(4.0);
  const [yohoCoinsBalance, setYohoCoinsBalance] = useState<number>(0);
  const [withdrawHistory, setWithdrawHistory] = useState<{ date: string; amount: number; target: string; status: string }[]>([]);
  const [showWithdrawHistory, setShowWithdrawHistory] = useState(false);

  // Agency announcement state
  const [agencyAnnouncementText, setAgencyAnnouncementText] = useState(
    'مرحباً بجميع المذيعين والوسطاء المعتمدين في وكالة AbuAmjad (GID: 30032). نرجو الالتزام بساعات البث المعتمدة وتحقيق التارغت الشهري، والعمولات يتم تحويلها تلقائياً للمحفظة فور تدقيق الحسابات.'
  );

  // Data lists in state
  const [hostsList, setHostsList] = useState<HostItem[]>(INITIAL_HOSTS);
  const [invitationsList, setInvitationsList] = useState<InvitationLog[]>(INITIAL_INVITATIONS);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Handle direct ID invitation
  const handleSendInviteById = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteIdInput.trim()) return;

    const newInv: InvitationLog = {
      id: Date.now().toString(),
      userId: inviteIdInput.trim(),
      userName: `مذيع جديد (${inviteIdInput.trim()})`,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      date: new Date().toISOString(),
      status: 'pending',
    };

    setInvitationsList([newInv, ...invitationsList]);
    setInviteFeedback(`تم إرسال دعوة الانضمام بنجاح للمستخدم (ID: ${inviteIdInput.trim()})`);
    setTimeout(() => {
      setInviteFeedback(null);
      setIsInviteIdModalOpen(false);
      setIsInviteSheetOpen(false);
      setInviteIdInput('');
      showToast('تمت إضافة الدعوة إلى سجل الدعوات');
    }, 1500);
  };

  // Handle share invite link
  const handleShareInvite = () => {
    const inviteLink = `https://superlegend.app/invite?agency=30032&broker=83534797`;
    navigator.clipboard.writeText(inviteLink);
    setIsInviteSheetOpen(false);
    showToast('تم نسخ رابط الدعوة الخاص بك بنجاح!');
  };

  // Handle Transfer to Agency Manager
  const handleToggleHostTransfer = (id: string) => {
    setSelectedHostsForTransfer((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleExecuteTransfer = () => {
    if (selectedHostsForTransfer.length === 0) {
      showToast('يرجى تحديد مضيف واحد على الأقل للنقل');
      return;
    }
    // Remove transferred hosts
    setHostsList((prev) => prev.filter((h) => !selectedHostsForTransfer.includes(h.id)));
    setIsTransferSuccess(true);
    setTimeout(() => {
      setIsTransferSuccess(false);
      showToast(`تم نقل ${selectedHostsForTransfer.length} مضيف إلى مدير الوكالة بنجاح`);
      setSelectedHostsForTransfer([]);
      setCurrentView('main');
    }, 1500);
  };

  // Handle Withdraw
  const handleExecuteWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(withdrawAmount);
    if (!withdrawTargetId.trim()) {
      showToast('يرجى إدخال معرف إعادة الشحن');
      return;
    }
    if (isNaN(amt) || amt <= 0) {
      showToast('يرجى إدخال مبلغ سحب صحيح');
      return;
    }
    if (amt > walletBalance) {
      showToast('رصيد المحفظة غير كافٍ');
      return;
    }

    setWalletBalance((prev) => prev - amt);
    setWithdrawHistory([
      {
        date: new Date().toLocaleDateString('ar-EG'),
        amount: amt,
        target: withdrawTargetId,
        status: 'ناجح (تحويل فوري)',
      },
      ...withdrawHistory,
    ]);
    setWithdrawAmount('');
    showToast(`تم تحويل ${amt}$ بنجاح إلى المعرف ${withdrawTargetId}`);
  };

  // Filtered lists
  const filteredHostsByTab = hostsList.filter((host) => {
    if (hostStatsTab === 'incomplete') return !host.isDaysComplete || !host.isMinutesComplete;
    if (hostStatsTab === 'drop') return host.hasDrop;
    return true;
  });

  const filteredInvitations = invitationsList.filter((inv) => {
    if (invitationFilter === 'all') return true;
    return inv.status === invitationFilter;
  });

  const filteredTransferHosts = hostsList.filter(
    (h) =>
      h.name.toLowerCase().includes(transferSearch.toLowerCase()) ||
      h.id.includes(transferSearch)
  );

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-90 w-full h-full bg-[#EEF2F6] flex flex-col overflow-y-auto select-none font-sans text-slate-800"
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-100 bg-[#0E3D48] text-white px-4 py-2.5 rounded-full text-xs font-bold shadow-2xl flex items-center gap-2 border border-teal-600/40"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 1. MAIN VIEW: مركز الإدارة - الداشبورد (التصميم الجديد المخصص والمحمي بالكامل) */}
      {/* ========================================================================= */}
      {currentView === 'main' && (
        <div className="flex-1 pb-10">
          {/* Header Bar */}
          <div className="sticky top-0 z-40 bg-[#EEF2F6] px-4 py-3.5 flex items-center justify-between border-b border-slate-200/80 shadow-2xs backdrop-blur-md">
            <button
              onClick={onClose}
              className="p-1 hover:bg-slate-200/70 rounded-full text-slate-600 transition-colors cursor-pointer"
              title="رجوع / إغلاق"
            >
              <ChevronRight className="w-6 h-6 stroke-[2.5]" />
            </button>
            <h1 className="text-base font-black text-slate-900 tracking-tight">مركز الإدارة - الداشبورد</h1>
            <button
              onClick={onClose}
              className="p-1 hover:bg-slate-200/70 rounded-full text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-3.5 space-y-3.5 max-w-lg mx-auto">
            {/* Top Profile Petrol-Teal Pill Card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0D404C] via-[#104D5B] to-[#125867] text-white px-4 py-3 shadow-md flex items-center justify-between border border-teal-800/40">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
                    alt="Avatar"
                    className="w-11 h-11 rounded-full object-cover border-2 border-white/90 shadow-sm"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#104D5B]" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-black text-white tracking-wide">
                      👑 ملك الدولة 👑
                    </span>
                    <span className="text-xs font-bold text-amber-200">( 🇾🇪 )</span>
                  </div>
                  <p className="text-[11px] text-teal-100/90 font-mono mt-0.5 font-bold">
                    UID:83534797
                  </p>
                </div>
              </div>
            </div>

            {/* Dual Profit Cards (Side by Side matching layout) */}
            <div className="grid grid-cols-2 gap-3">
              {/* Card 1: أرباح الشهر الحالي (Deep Petrol Teal) */}
              <div className="rounded-2xl bg-gradient-to-b from-[#104D5B] to-[#165F6F] text-white p-3.5 shadow-md flex flex-col justify-between border border-teal-700/40 min-h-[115px]">
                <div className="text-xs font-bold text-teal-100 text-center">أرباح الشهر الحالي</div>
                <div className="text-2xl font-black font-mono text-white text-center my-1">
                  $ 4
                </div>
                <button
                  onClick={() => setCurrentView('monthly_earnings')}
                  className="w-full bg-white/15 hover:bg-white/25 text-[11px] text-white font-bold py-1 px-2 rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer border border-white/20"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>استعراض التفاصيل</span>
                </button>
              </div>

              {/* Card 2: أرباح الأمس (Sunset Orange/Peach) */}
              <div className="rounded-2xl bg-gradient-to-b from-[#F7BD7A] via-[#F4A763] to-[#F09252] text-slate-900 p-3.5 shadow-md flex flex-col justify-between border border-amber-300/40 min-h-[115px]">
                <div className="text-xs font-black text-amber-950 text-center">أرباح الأمس</div>
                <div className="text-2xl font-black font-mono text-amber-950 text-center my-1">
                  0
                </div>
                <button
                  onClick={() => setCurrentView('monthly_earnings')}
                  className="w-full bg-black/10 hover:bg-black/15 text-[11px] text-amber-950 font-black py-1 px-2 rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer border border-black/10"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>استعراض التفاصيل</span>
                </button>
              </div>
            </div>

            {/* تحليلات الأداء (Performance Analytics) */}
            <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/80 space-y-3">
              <button
                onClick={() => setIsAnalyticsExpanded(!isAnalyticsExpanded)}
                className="w-full flex items-center justify-between text-slate-800 cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-teal-600 stroke-[2.5]" />
                  <h2 className="text-sm font-black text-slate-900">تحليلات الأداء</h2>
                </div>
                <div className="text-slate-400 hover:text-slate-600">
                  {isAnalyticsExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {isAnalyticsExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="divide-y divide-slate-100 text-xs overflow-hidden"
                  >
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                        <span>إجمالي الماسات لهذا الشهر</span>
                        <span className="text-sky-500 text-xs">💎</span>
                      </div>
                      <span className="font-mono font-black text-slate-900 text-sm">779,950</span>
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                        <span>حصة الوكالة</span>
                        <span className="text-sky-500 text-xs">💎</span>
                      </div>
                      <span className="font-mono font-black text-slate-900 text-sm">50%</span>
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                        <span>الماسات نفس الفترة من الشهر الماضي</span>
                        <span className="text-sky-500 text-xs">💎</span>
                      </div>
                      <span className="font-mono font-black text-slate-900 text-sm">50</span>
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                        <span>إجمالي الماسات الشهر الماضي</span>
                        <span className="text-slate-500 text-xs">👤</span>
                      </div>
                      <span className="font-mono font-black text-slate-900 text-sm">50</span>
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <span className="text-slate-700 font-bold">مقابل نفس الفترة من الشهر الماضي</span>
                      <span className="font-mono font-black text-emerald-600 text-xs">1,559,800.00%</span>
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <span className="text-slate-700 font-bold">مقابل الشهر الماضي</span>
                      <span className="font-mono font-black text-emerald-600 text-xs">1,559,800.00%</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* إحصائيات المضيفين (Host Statistics with Circular Gauges) */}
            <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-black text-slate-900">إحصائيات المضيفين</h2>
                <button
                  onClick={() => {
                    setHostStatsTab('all');
                    setCurrentView('host_stats');
                  }}
                  className="text-xs text-slate-400 hover:text-teal-700 flex items-center gap-0.5 font-bold cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>عرض التفاصيل</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {/* Item 1: Circular Gauge 75% Incomplete Days */}
                <div
                  onClick={() => {
                    setHostStatsTab('incomplete');
                    setCurrentView('host_stats');
                  }}
                  className="p-3 bg-slate-50/70 hover:bg-slate-100/80 rounded-2xl border border-slate-100 flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {/* Gauge ring */}
                    <div className="relative w-12 h-12 flex items-center justify-center">
                      <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-orange-100"
                          strokeWidth="3.5"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-orange-500"
                          strokeDasharray="75, 100"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <span className="absolute text-[11px] font-black text-slate-800 font-mono">
                        75%
                      </span>
                    </div>
                    <span className="text-xs font-bold text-slate-800 leading-snug">
                      2 المضيفين لم تستكمل أيام البث المطلوبة
                    </span>
                  </div>
                </div>

                {/* Item 2: Circular Gauge 60% Diamonds Drop */}
                <div
                  onClick={() => {
                    setHostStatsTab('drop');
                    setCurrentView('host_stats');
                  }}
                  className="p-3 bg-slate-50/70 hover:bg-slate-100/80 rounded-2xl border border-slate-100 flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {/* Gauge ring */}
                    <div className="relative w-12 h-12 flex items-center justify-center">
                      <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-teal-100"
                          strokeWidth="3.5"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-[#104D5B]"
                          strokeDasharray="60, 100"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <span className="absolute text-[11px] font-black text-slate-800 font-mono">
                        60%
                      </span>
                    </div>
                    <span className="text-xs font-bold text-slate-800 leading-snug">
                      0 من المضيفين شهدت انخفاضًا كبيرًا (-20.00%) في الماسات
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* مركز المهام (Tasks Center Card) */}
            <div className="space-y-2">
              <h2 className="text-sm font-black text-slate-900 px-1">مركز المهام</h2>

              <div className="bg-[#FFF3E2] border border-[#FADBB3] rounded-2xl p-4 relative overflow-hidden shadow-xs">
                <div className="flex items-center justify-between text-xs font-bold text-amber-950">
                  <span className="font-black text-amber-950">توظيف مضيفين الجدد:</span>
                  <ChevronLeft className="w-4 h-4 text-amber-600" />
                </div>
                <p className="text-[11px] text-amber-900/90 mt-1 font-bold">
                  قم بتوظيف 1 من المضيفين الجدد الصالحين هذا الشهر
                </p>

                {/* Progress bar with shield level badge */}
                <div className="relative mt-4 mb-3">
                  <div className="w-full bg-[#E8B67D] h-2 rounded-full overflow-hidden">
                    <div className="w-[10%] h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" />
                  </div>
                  <div className="absolute -top-3 left-0 bg-[#FF6F3D] text-white text-[10px] font-black w-6 h-6 rounded-lg flex items-center justify-center border-2 border-white shadow-sm rotate-3">
                    🛡️
                  </div>
                  <div className="flex justify-between text-[10px] font-black text-amber-900 mt-1.5 px-0.5">
                    <span>0</span>
                    <span>1</span>
                  </div>
                </div>

                {/* Milestone Avatars & Reward Badges */}
                <div className="flex items-center justify-between pt-2 border-t border-amber-200/60">
                  {/* Avatars with numbers */}
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <img
                        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
                        alt="0"
                        className="w-7 h-7 rounded-full border border-amber-300 object-cover"
                      />
                      <span className="absolute -bottom-1 -right-1 bg-amber-500 text-white text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
                        0
                      </span>
                    </div>
                    <div className="relative">
                      <img
                        src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80"
                        alt="1"
                        className="w-7 h-7 rounded-full border border-amber-300 object-cover"
                      />
                      <span className="absolute -bottom-1 -right-1 bg-amber-600 text-white text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
                        1
                      </span>
                    </div>
                    <div className="relative">
                      <img
                        src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80"
                        alt="Diamond"
                        className="w-7 h-7 rounded-full border border-amber-300 object-cover"
                      />
                      <span className="absolute -bottom-1 -right-1 bg-sky-500 text-white text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
                        💎
                      </span>
                    </div>
                  </div>

                  {/* Rewards badges */}
                  <div className="flex items-center gap-1.5">
                    <span className="w-8 h-8 rounded-xl bg-amber-100/90 border border-amber-200 flex items-center justify-center text-sm shadow-2xs">
                      🦅
                    </span>
                    <span className="w-8 h-8 rounded-xl bg-amber-100/90 border border-amber-200 flex items-center justify-center text-sm shadow-2xs">
                      👑
                    </span>
                    <span className="w-8 h-8 rounded-xl bg-amber-100/90 border border-amber-200 flex items-center justify-center text-sm shadow-2xs">
                      🏆
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* بدء بث جديد - دعوة (Petrol Teal Action Banner) */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsInviteSheetOpen(true)}
              className="w-full bg-gradient-to-r from-[#0C3B46] via-[#104D5B] to-[#125867] hover:from-[#09323C] hover:to-[#0D4450] rounded-2xl px-4 py-3.5 flex items-center justify-between text-white shadow-md shadow-teal-950/20 transition-all cursor-pointer border border-teal-700/50"
            >
              <ChevronLeft className="w-5 h-5 text-teal-200" />
              <div className="flex items-center gap-3">
                <span className="text-sm font-black tracking-wide">بدء بث جديد - دعوة</span>
                {/* Broadcast Live Tower Icon */}
                <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white text-lg">
                  📡
                </div>
              </div>
            </motion.button>

            {/* مجموعة الأدوات الخاصة بي (شبكة مستطيلات منقسمة يمين وشمال: 2 في كل صف) */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] font-bold text-teal-700 bg-teal-50 border border-teal-200/60 px-2.5 py-0.5 rounded-full">
                  8 أدوات إدارية
                </span>
                <h2 className="text-sm font-black text-slate-900 text-right">
                  مجموعة الأدوات الخاصة بي
                </h2>
              </div>

              {/* 2-Column Rectangular Cards (Split screen half right & half left) */}
              <div className="grid grid-cols-2 gap-2.5" dir="rtl">
                {/* 1. قائمة المضيفين */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    setHostStatsTab('all');
                    setCurrentView('host_stats');
                  }}
                  className="bg-white hover:bg-slate-50 border border-slate-200/90 rounded-2xl p-3 flex items-center justify-between shadow-2xs transition-all cursor-pointer group text-right"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white text-lg shadow-2xs shrink-0 group-hover:scale-105 transition-transform">
                      📋
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-black text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                        قائمة المضيفين
                      </h4>
                      <span className="text-[10px] text-slate-400 font-bold block truncate">
                        البيانات والحالة
                      </span>
                    </div>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors shrink-0 mr-0.5" />
                </motion.button>

                {/* 2. المذيعين الخاصين بي */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setCurrentView('my_invited_hosts')}
                  className="bg-white hover:bg-slate-50 border border-slate-200/90 rounded-2xl p-3 flex items-center justify-between shadow-2xs transition-all cursor-pointer group text-right"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white text-lg shadow-2xs shrink-0 group-hover:scale-105 transition-transform">
                      🎙️
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-black text-slate-900 group-hover:text-purple-600 transition-colors truncate">
                        المذيع الخاص بي
                      </h4>
                      <span className="text-[10px] text-slate-400 font-bold block truncate">
                        المذيعين التابعين
                      </span>
                    </div>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-slate-300 group-hover:text-purple-500 transition-colors shrink-0 mr-0.5" />
                </motion.button>

                {/* 3. إدارة الدعوة */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setCurrentView('invitation_log')}
                  className="bg-white hover:bg-slate-50 border border-slate-200/90 rounded-2xl p-3 flex items-center justify-between shadow-2xs transition-all cursor-pointer group text-right"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white text-lg shadow-2xs shrink-0 group-hover:scale-105 transition-transform">
                      📑
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-black text-slate-900 group-hover:text-amber-600 transition-colors truncate">
                        إدارة الدعوة
                      </h4>
                      <span className="text-[10px] text-slate-400 font-bold block truncate">
                        سجل الدعوات
                      </span>
                    </div>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-slate-300 group-hover:text-amber-500 transition-colors shrink-0 mr-0.5" />
                </motion.button>

                {/* 4. محفظتي */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setCurrentView('wallet_withdraw')}
                  className="bg-white hover:bg-slate-50 border border-slate-200/90 rounded-2xl p-3 flex items-center justify-between shadow-2xs transition-all cursor-pointer group text-right"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white text-lg shadow-2xs shrink-0 group-hover:scale-105 transition-transform">
                      👛
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-black text-slate-900 group-hover:text-emerald-600 transition-colors truncate">
                        محفظتي
                      </h4>
                      <span className="text-[10px] text-slate-400 font-bold block truncate">
                        الأرباح والسحب
                      </span>
                    </div>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors shrink-0 mr-0.5" />
                </motion.button>

                {/* 5. إعلان الوكالة */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setCurrentView('agency_announcement')}
                  className="bg-white hover:bg-slate-50 border border-slate-200/90 rounded-2xl p-3 flex items-center justify-between shadow-2xs transition-all cursor-pointer group text-right"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white text-lg shadow-2xs shrink-0 group-hover:scale-105 transition-transform">
                      💎
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-black text-slate-900 group-hover:text-cyan-600 transition-colors truncate">
                        إعلان الوكالة
                      </h4>
                      <span className="text-[10px] text-slate-400 font-bold block truncate">
                        نشر التحديثات
                      </span>
                    </div>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-slate-300 group-hover:text-cyan-500 transition-colors shrink-0 mr-0.5" />
                </motion.button>

                {/* 6. نقل المذيع إلى مدير وكالة */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setCurrentView('transfer_hosts')}
                  className="bg-white hover:bg-slate-50 border border-slate-200/90 rounded-2xl p-3 flex items-center justify-between shadow-2xs transition-all cursor-pointer group text-right"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-600 flex items-center justify-center text-white text-lg shadow-2xs shrink-0 group-hover:scale-105 transition-transform">
                      📢
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-black text-slate-900 group-hover:text-rose-600 transition-colors truncate">
                        نقل إلى مدير وكالة
                      </h4>
                      <span className="text-[10px] text-slate-400 font-bold block truncate">
                        تحويل الصلاحيات
                      </span>
                    </div>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-slate-300 group-hover:text-rose-500 transition-colors shrink-0 mr-0.5" />
                </motion.button>

                {/* 7. نقل المضيفين */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setCurrentView('transfer_hosts')}
                  className="bg-white hover:bg-slate-50 border border-slate-200/90 rounded-2xl p-3 flex items-center justify-between shadow-2xs transition-all cursor-pointer group text-right"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-500 to-purple-600 flex items-center justify-center text-white text-lg shadow-2xs shrink-0 group-hover:scale-105 transition-transform">
                      ⚖️
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-black text-slate-900 group-hover:text-violet-600 transition-colors truncate">
                        نقل المضيفين
                      </h4>
                      <span className="text-[10px] text-slate-400 font-bold block truncate">
                        نقل المضيف لوكالة
                      </span>
                    </div>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-slate-300 group-hover:text-violet-500 transition-colors shrink-0 mr-0.5" />
                </motion.button>

                {/* 8. إدارة المضيفين */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setCurrentView('my_agency')}
                  className="bg-white hover:bg-slate-50 border border-slate-200/90 rounded-2xl p-3 flex items-center justify-between shadow-2xs transition-all cursor-pointer group text-right"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-[#104D5B] flex items-center justify-center text-white text-lg shadow-2xs shrink-0 group-hover:scale-105 transition-transform">
                      👥
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-black text-slate-900 group-hover:text-teal-700 transition-colors truncate">
                        إدارة المضيفين
                      </h4>
                      <span className="text-[10px] text-slate-400 font-bold block truncate">
                        التحكم والمتابعة
                      </span>
                    </div>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-slate-300 group-hover:text-teal-700 transition-colors shrink-0 mr-0.5" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. VIEW: إحصائيات المضيف التفصيلية */}
      {/* ========================================================================= */}
      {currentView === 'host_stats' && (
        <div className="flex-1 pb-10">
          <div className="sticky top-0 z-40 bg-white px-4 py-3.5 flex items-center justify-between border-b border-slate-200/80 shadow-2xs">
            <button
              onClick={() => setCurrentView('main')}
              className="p-1 hover:bg-slate-100 rounded-full text-slate-600 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-6 h-6 stroke-[2.2]" />
            </button>
            <h1 className="text-base font-black text-slate-900">إحصائيات المضيفين</h1>
            <div className="w-6" />
          </div>

          <div className="p-4 max-w-lg mx-auto space-y-4">
            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              <button
                onClick={() => setHostStatsTab('all')}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  hostStatsTab === 'all'
                    ? 'bg-[#104D5B] text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                الكل
              </button>

              <button
                onClick={() => setHostStatsTab('incomplete')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  hostStatsTab === 'incomplete'
                    ? 'bg-[#104D5B] text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                لم يتم إكمال طلب البث المباشر
              </button>

              <button
                onClick={() => setHostStatsTab('drop')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  hostStatsTab === 'drop'
                    ? 'bg-[#104D5B] text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                انخفاض ملحوظ
              </button>
            </div>

            {/* Host Cards List */}
            <div className="space-y-3">
              {filteredHostsByTab.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center text-slate-400 border border-slate-200/80">
                  <p className="text-xs font-bold">لا توجد بيانات مطابقة لهذا الفلتر</p>
                </div>
              ) : (
                filteredHostsByTab.map((host) => (
                  <div
                    key={host.id}
                    className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/80 space-y-3"
                  >
                    {/* Top Row: Avatar + Name + ID */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={host.avatar}
                          alt={host.name}
                          className="w-12 h-12 rounded-full object-cover border border-slate-100"
                        />
                        <div>
                          <h3 className="text-xs font-black text-slate-900">{host.name}</h3>
                          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                            ID:{host.id}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Joined Date */}
                    <div className="text-[11px] font-mono text-emerald-600 font-bold">
                      وقت الانضمام: {host.joinedAt}
                    </div>

                    {/* Diamonds Stats */}
                    <div className="text-xs">
                      <span className="text-slate-600 font-medium">الماس المستلم شهريًا: </span>
                      <span className="text-sky-500 font-bold">💎 {host.monthlyDiamonds.toLocaleString()}</span>
                      <span className="text-[11px] text-emerald-600 font-bold mr-3">
                        نفس الفترة: {host.monthlyPercentage}
                      </span>
                    </div>

                    {/* Streaming Minutes Target */}
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-50">
                      <div>
                        <span className="text-slate-500">مدة البث: </span>
                        <span className="font-mono font-bold text-emerald-600">
                          {host.streamMinutes}/{host.targetMinutes} دقائق
                        </span>
                      </div>
                      <span
                        className={`text-[11px] font-black ${
                          host.isMinutesComplete ? 'text-teal-600' : 'text-red-500'
                        }`}
                      >
                        {host.isMinutesComplete ? 'مكتمل' : 'فشل'}
                      </span>
                    </div>

                    {/* Streaming Days Target */}
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-500">أيام البث: </span>
                        <span className="font-mono font-bold text-emerald-600">
                          {host.streamDays}/{host.targetDays} أيام
                        </span>
                      </div>
                      <span
                        className={`text-[11px] font-black ${
                          host.isDaysComplete ? 'text-teal-600' : 'text-red-500'
                        }`}
                      >
                        {host.isDaysComplete ? 'مكتمل' : 'فشل'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. VIEW: المذيعون الذين دعوتهم (المذيع الخاص بي) */}
      {/* ========================================================================= */}
      {currentView === 'my_invited_hosts' && (
        <div className="flex-1 pb-10">
          <div className="sticky top-0 z-40 bg-white px-4 py-3.5 flex items-center justify-between border-b border-slate-200/80 shadow-2xs">
            <button
              onClick={() => setCurrentView('main')}
              className="p-1 hover:bg-slate-100 rounded-full text-slate-600 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-6 h-6 stroke-[2.2]" />
            </button>
            <h1 className="text-base font-black text-slate-900">المذيعون الذين دعوتهم</h1>
            <div className="w-6" />
          </div>

          <div className="p-4 max-w-lg mx-auto space-y-3">
            <div className="text-xs text-slate-600 font-black px-1">
              {hostsList.length} من المستخدمين إجمالاً
            </div>

            <div className="space-y-2.5">
              {hostsList.map((host) => (
                <div
                  key={host.id}
                  className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/80 space-y-2"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={host.avatar}
                      alt={host.name}
                      className="w-12 h-12 rounded-full object-cover border border-slate-100"
                    />
                    <div>
                      <h3 className="text-xs font-black text-slate-900">{host.name}</h3>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">ID:{host.id}</p>
                    </div>
                  </div>

                  <div className="text-[11px] font-mono text-emerald-600 font-bold">
                    وقت الانضمام: {host.joinedAt}
                  </div>

                  <div className="text-xs text-slate-600 font-medium">
                    الماس المستلم شهريًا: <span className="text-sky-500 font-bold">💎 {host.monthlyDiamonds.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. VIEW: إدارة الدعوات / سجل الدعوات */}
      {/* ========================================================================= */}
      {currentView === 'invitation_log' && (
        <div className="flex-1 pb-10">
          <div className="sticky top-0 z-40 bg-white px-4 py-3.5 flex items-center justify-between border-b border-slate-200/80 shadow-2xs">
            <button
              onClick={() => setCurrentView('main')}
              className="p-1 hover:bg-slate-100 rounded-full text-slate-600 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-6 h-6 stroke-[2.2]" />
            </button>
            <h1 className="text-base font-black text-slate-900">إدارة وسجل الدعوات</h1>
            <div className="w-6" />
          </div>

          <div className="p-4 max-w-lg mx-auto space-y-3">
            {/* Status Dropdown selector */}
            <div className="bg-white rounded-2xl p-2.5 shadow-xs border border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-600 font-black">الحالة:</span>
              <select
                value={invitationFilter}
                onChange={(e) => setInvitationFilter(e.target.value as any)}
                className="text-xs font-bold text-slate-800 bg-transparent outline-none cursor-pointer"
              >
                <option value="all">الكل</option>
                <option value="accepted">تم انضمام المذيع</option>
                <option value="rejected">مرفوض</option>
                <option value="operation_rejected">تم رفض العملية</option>
              </select>
            </div>

            {/* List */}
            <div className="space-y-2">
              {filteredInvitations.map((inv) => (
                <div
                  key={inv.id}
                  className="bg-white rounded-2xl p-3.5 shadow-xs border border-slate-200/80 flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <span
                      className={`text-[10px] font-black px-2.5 py-0.5 rounded-full inline-block ${
                        inv.status === 'accepted'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-red-50 text-red-500'
                      }`}
                    >
                      {inv.status === 'accepted'
                        ? 'تم انضمام المذيع'
                        : inv.status === 'operation_rejected'
                        ? 'تم رفض العملية'
                        : 'مرفوض'}
                    </span>
                    <div className="text-[10px] text-slate-400 font-mono">{inv.date}</div>
                  </div>

                  <div className="flex items-center gap-2.5 text-left">
                    <div className="text-right">
                      <h4 className="text-xs font-black text-slate-800">{inv.userName}</h4>
                      <p className="text-[10px] text-slate-400 font-mono">ID:{inv.userId}</p>
                    </div>
                    <img
                      src={inv.avatar}
                      alt={inv.userName}
                      className="w-10 h-10 rounded-full object-cover border border-slate-100"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. VIEW: محفظتي والسحب */}
      {/* ========================================================================= */}
      {currentView === 'wallet_withdraw' && (
        <div className="flex-1 pb-10">
          <div className="sticky top-0 z-40 bg-white px-4 py-3.5 flex items-center justify-between border-b border-slate-200/80 shadow-2xs">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentView('main')}
                className="p-1 hover:bg-slate-100 rounded-full text-slate-600 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-6 h-6 stroke-[2.2]" />
              </button>
            </div>
            <h1 className="text-base font-black text-slate-900">محفظتي وسحب الأرباح</h1>
            <div className="flex items-center gap-2 text-slate-600">
              <button
                onClick={() => setShowWithdrawHistory(!showWithdrawHistory)}
                className="p-1.5 hover:bg-slate-100 rounded-full cursor-pointer"
                title="سجل التحويلات"
              >
                <History className="w-5 h-5" />
              </button>
              <button
                onClick={() => showToast('إعدادات المحفظة مؤمنة بالكامل')}
                className="p-1.5 hover:bg-slate-100 rounded-full cursor-pointer"
                title="الإعدادات"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-4 max-w-lg mx-auto space-y-4">
            {/* Wallet Balance Card */}
            <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span className="flex items-center gap-1">
                  محفظة الأرباح <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <span className="text-xs text-slate-400 font-medium">الرصيد القابل للسحب</span>
                  <div className="text-2xl font-black font-mono text-emerald-600 mt-0.5">
                    {walletBalance.toFixed(2)} $
                  </div>
                </div>

                <div className="border-r border-slate-100">
                  <span className="text-xs text-slate-400 font-medium">رصيد عملات يوهو</span>
                  <div className="text-2xl font-black font-mono text-sky-500 mt-0.5 flex items-center justify-center gap-1">
                    {yohoCoinsBalance} <span className="text-amber-500 text-lg">🪙</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Withdraw Form */}
            <form onSubmit={handleExecuteWithdraw} className="space-y-4">
              {/* Withdraw Method Card */}
              <div>
                <span className="text-xs font-bold text-slate-600 px-1 block mb-2">سحب إلى</span>
                <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/80 flex items-center justify-between">
                  <ChevronLeft className="w-4 h-4 text-slate-400" />
                  <div className="text-right">
                    <div className="text-xs font-black text-slate-900">Recharge ID</div>
                    <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                      تحويل فوري فائق السرعة بدون رسوم معاملات
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-lg shadow-2xs">
                    🪙
                  </div>
                </div>
              </div>

              {/* Recharge ID Input */}
              <div>
                <label className="text-xs font-bold text-slate-600 px-1 block mb-1.5">
                  معرّف إعادة الشحن
                </label>
                <input
                  type="text"
                  placeholder="أدخل معرّف إعادة الشحن للمستلم"
                  value={withdrawTargetId}
                  onChange={(e) => setWithdrawTargetId(e.target.value)}
                  className="w-full bg-white rounded-2xl p-3.5 text-xs text-slate-800 placeholder-slate-400 border border-slate-200 outline-none focus:border-teal-600 shadow-2xs font-mono"
                />
              </div>

              {/* Amount Input */}
              <div>
                <label className="text-xs font-bold text-slate-600 px-1 block mb-1.5">
                  مبلغ السحب
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full bg-white rounded-2xl p-3.5 pr-8 text-xs font-black text-slate-800 placeholder-slate-400 border border-slate-200 outline-none focus:border-teal-600 shadow-2xs font-mono"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    $
                  </span>
                </div>
                <div className="text-[11px] text-teal-700 font-bold mt-1.5 px-1 flex items-center gap-1">
                  <span>المبلغ المتوقع بعملات يوهو:</span>
                  <span className="font-mono">{parseFloat(withdrawAmount || '0') * 700}</span>
                  <span>🪙</span>
                </div>
              </div>

              {/* Withdraw Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#104D5B] to-[#165F6F] hover:from-[#0C3B46] hover:to-[#125867] text-white font-black text-xs py-3.5 rounded-2xl transition-all cursor-pointer shadow-md mt-2"
              >
                تأكيد السحب الفوري
              </button>
            </form>

            {/* Withdraw History Dialog */}
            {showWithdrawHistory && (
              <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/80 space-y-3">
                <h3 className="text-xs font-black text-slate-800">سجل التحويلات السابقة</h3>
                {withdrawHistory.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-3">لا توجد عمليات سحب سابقة</p>
                ) : (
                  <div className="space-y-2">
                    {withdrawHistory.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs p-2.5 bg-slate-50 rounded-xl border border-slate-100"
                      >
                        <div>
                          <span className="font-bold text-slate-700">إلى ID: {item.target}</span>
                          <span className="text-[10px] text-slate-400 block">{item.date}</span>
                        </div>
                        <div className="text-left">
                          <span className="font-mono font-black text-emerald-600">{item.amount}$</span>
                          <span className="text-[10px] text-emerald-600 block">{item.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. VIEW: إعلان الوكالة */}
      {/* ========================================================================= */}
      {currentView === 'agency_announcement' && (
        <div className="flex-1 pb-10">
          <div className="sticky top-0 z-40 bg-white px-4 py-3.5 flex items-center justify-between border-b border-slate-200/80 shadow-2xs">
            <button
              onClick={() => setCurrentView('main')}
              className="p-1 hover:bg-slate-100 rounded-full text-slate-600 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-6 h-6 stroke-[2.2]" />
            </button>
            <h1 className="text-base font-black text-slate-900">إعلان وتوجيهات الوكالة</h1>
            <div className="w-6" />
          </div>

          <div className="p-4 max-w-lg mx-auto space-y-4">
            <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/80 space-y-3">
              <div className="flex items-center gap-2 text-teal-700">
                <Megaphone className="w-5 h-5" />
                <h3 className="text-xs font-black">تعميم رسمي من إدارة الوكالة</h3>
              </div>
              <p className="text-xs leading-relaxed text-slate-700 font-medium whitespace-pre-line bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                {agencyAnnouncementText}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. VIEW: نقل المضيف إلى مدير الوكالة */}
      {/* ========================================================================= */}
      {currentView === 'transfer_hosts' && (
        <div className="flex-1 pb-10">
          <div className="sticky top-0 z-40 bg-white px-4 py-3.5 flex items-center justify-between border-b border-slate-200/80 shadow-2xs">
            <button
              onClick={() => setCurrentView('main')}
              className="p-1 hover:bg-slate-100 rounded-full text-slate-600 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-6 h-6 stroke-[2.2]" />
            </button>
            <h1 className="text-base font-black text-slate-900">نقل المضيف إلى مدير الوكالة</h1>
            <div className="w-6" />
          </div>

          <div className="p-4 max-w-lg mx-auto space-y-4">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="ابحث بالاسم أو ID المضيف..."
                value={transferSearch}
                onChange={(e) => setTransferSearch(e.target.value)}
                className="w-full bg-white rounded-2xl p-3 pr-10 text-xs text-slate-800 placeholder-slate-400 border border-slate-200 outline-none focus:border-teal-600 shadow-2xs"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>

            {/* Selected Count */}
            <div className="flex items-center justify-between text-xs px-1 text-slate-600 font-bold">
              <span>المحدد للنقل: {selectedHostsForTransfer.length}</span>
              <button
                onClick={() =>
                  setSelectedHostsForTransfer(
                    selectedHostsForTransfer.length === filteredTransferHosts.length
                      ? []
                      : filteredTransferHosts.map((h) => h.id)
                  )
                }
                className="text-teal-700 hover:underline cursor-pointer"
              >
                {selectedHostsForTransfer.length === filteredTransferHosts.length
                  ? 'إلغاء التحديد'
                  : 'تحديد الكل'}
              </button>
            </div>

            {/* List */}
            <div className="space-y-2 max-h-[55vh] overflow-y-auto">
              {filteredTransferHosts.map((host) => {
                const isSelected = selectedHostsForTransfer.includes(host.id);
                return (
                  <div
                    key={host.id}
                    onClick={() => handleToggleHostTransfer(host.id)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-teal-50 border-teal-500 shadow-xs'
                        : 'bg-white border-slate-200/80 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          isSelected
                            ? 'bg-teal-600 border-teal-600 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <img
                        src={host.avatar}
                        alt={host.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-100"
                      />
                      <div>
                        <h4 className="text-xs font-black text-slate-800">{host.name}</h4>
                        <p className="text-[10px] text-slate-400 font-mono">ID:{host.id}</p>
                      </div>
                    </div>

                    <div className="text-left">
                      <span className="text-xs font-bold text-sky-600">
                        💎 {host.monthlyDiamonds.toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Execute Button */}
            <button
              onClick={handleExecuteTransfer}
              disabled={selectedHostsForTransfer.length === 0}
              className={`w-full py-3.5 rounded-2xl text-xs font-black transition-all cursor-pointer shadow-md ${
                selectedHostsForTransfer.length === 0
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#104D5B] to-[#165F6F] hover:from-[#0C3B46] hover:to-[#125867] text-white'
              }`}
            >
              تأكيد نقل {selectedHostsForTransfer.length} مضيف إلى مدير الوكالة
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. VIEW: وكالتي وإدارة المضيفين */}
      {/* ========================================================================= */}
      {currentView === 'my_agency' && (
        <div className="flex-1 pb-10">
          <div className="sticky top-0 z-40 bg-white px-4 py-3.5 flex items-center justify-between border-b border-slate-200/80 shadow-2xs">
            <button
              onClick={() => setCurrentView('main')}
              className="p-1 hover:bg-slate-100 rounded-full text-slate-600 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-6 h-6 stroke-[2.2]" />
            </button>
            <h1 className="text-base font-black text-slate-900">وكالتي وإدارة الفريق</h1>
            <div className="w-6" />
          </div>

          <div className="p-4 max-w-lg mx-auto space-y-4">
            <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-slate-900">معلومات الوكالة</h3>
                <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded-full">
                  وكالة معتمدة
                </span>
              </div>
              <div className="divide-y divide-slate-100 text-xs">
                <div className="flex justify-between py-2">
                  <span className="text-slate-500 font-medium">اسم الوكالة</span>
                  <span className="font-bold text-slate-800">AbuAmjad</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-500 font-medium">معرف الوكالة (GID)</span>
                  <span className="font-mono font-bold text-slate-800">30032</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-500 font-medium">نسبة مشاركة الأرباح</span>
                  <span className="font-mono font-bold text-emerald-600">50%</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-500 font-medium">عدد المذيعين الفعلي</span>
                  <span className="font-mono font-bold text-slate-800">{hostsList.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9. VIEW: تفاصيل الأرباح الشهرية */}
      {/* ========================================================================= */}
      {currentView === 'monthly_earnings' && (
        <div className="flex-1 pb-10">
          <div className="sticky top-0 z-40 bg-white px-4 py-3.5 flex items-center justify-between border-b border-slate-200/80 shadow-2xs">
            <button
              onClick={() => setCurrentView('main')}
              className="p-1 hover:bg-slate-100 rounded-full text-slate-600 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-6 h-6 stroke-[2.2]" />
            </button>
            <h1 className="text-base font-black text-slate-900">تفاصيل الأرباح الشهرية</h1>
            <div className="w-6" />
          </div>

          <div className="p-4 max-w-lg mx-auto space-y-4">
            <div className="bg-gradient-to-r from-[#104D5B] to-[#165F6F] rounded-2xl p-4 text-white shadow-md text-center">
              <span className="text-xs text-teal-100 font-bold">إجمالي أرباح الوسيط لهذا الشهر</span>
              <div className="text-3xl font-black font-mono mt-1 text-white">4.00 $</div>
              <span className="text-[10px] text-teal-200 block mt-1">تضاف للمحفظة فور تدقيق الحسابات</span>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-black text-slate-800 px-1">عائدات المذيعين</h3>
              {hostsList.map((host) => (
                <div
                  key={host.id}
                  className="bg-white rounded-2xl p-3.5 shadow-xs border border-slate-200/80 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={host.avatar}
                      alt={host.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-100"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900">{host.name}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">ID:{host.id}</span>
                    </div>
                  </div>
                  <div className="text-left">
                    <span className="font-mono font-black text-emerald-600 text-sm">
                      {host.earningsThisMonth.toFixed(2)} $
                    </span>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      💎 {host.monthlyDiamonds.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BOTTOM SHEET: دعوة المذيعين */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isInviteSheetOpen && (
          <div className="fixed inset-0 z-100 flex items-end justify-center bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-lg bg-white rounded-t-3xl p-5 space-y-4 shadow-2xl text-slate-800"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-black text-slate-900">خيارات دعوة المذيعين</h3>
                <button
                  onClick={() => setIsInviteSheetOpen(false)}
                  className="p-1 hover:bg-slate-100 rounded-full text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2.5">
                <button
                  onClick={() => {
                    setIsInviteSheetOpen(false);
                    setIsInviteIdModalOpen(true);
                  }}
                  className="w-full bg-[#E8F4F8] hover:bg-[#D5ECF4] text-slate-800 font-black text-xs py-3.5 px-4 rounded-2xl flex items-center justify-between transition-colors cursor-pointer border border-[#D0E8F2]"
                >
                  <ChevronLeft className="w-4 h-4 text-slate-400" />
                  <div className="flex items-center gap-2.5">
                    <span className="text-slate-800">دعوة مستخدم بواسطة المعرّف (ID)</span>
                    <Send className="w-4 h-4 text-teal-700" />
                  </div>
                </button>

                <button
                  onClick={handleShareInvite}
                  className="w-full bg-gradient-to-r from-[#104D5B] to-[#165F6F] hover:from-[#0C3B46] hover:to-[#125867] text-white font-black text-xs py-3.5 px-4 rounded-2xl flex items-center justify-between transition-colors cursor-pointer shadow-md"
                >
                  <ChevronLeft className="w-4 h-4 text-teal-200" />
                  <div className="flex items-center gap-2.5">
                    <span>مشاركة رابط دعوة الوكالة</span>
                    <Share2 className="w-4 h-4" />
                  </div>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL: دعوة عبر المعرف ID */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isInviteIdModalOpen && (
          <div className="fixed inset-0 z-110 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm bg-white rounded-3xl p-5 space-y-4 shadow-2xl border border-slate-100"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900">دعوة مذيع بالمعرّف</h3>
                <button
                  onClick={() => setIsInviteIdModalOpen(false)}
                  className="p-1 hover:bg-slate-100 rounded-full text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSendInviteById} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    أدخل معرّف المستخدم (ID)
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: 95770929"
                    value={inviteIdInput}
                    onChange={(e) => setInviteIdInput(e.target.value)}
                    className="w-full bg-slate-50 rounded-2xl p-3 text-xs text-slate-800 placeholder-slate-400 border border-slate-200 outline-none focus:border-teal-600 font-mono"
                    autoFocus
                  />
                </div>

                {inviteFeedback && (
                  <div className="text-[11px] text-emerald-600 font-bold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>{inviteFeedback}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#104D5B] to-[#165F6F] hover:from-[#0C3B46] hover:to-[#125867] text-white font-black text-xs py-3 rounded-2xl transition-all cursor-pointer shadow-md"
                >
                  إرسال الدعوة الآن
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
