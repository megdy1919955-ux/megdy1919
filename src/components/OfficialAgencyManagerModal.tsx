import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Building2,
  Users,
  ShieldCheck,
  Crown,
  Sparkles,
  Award,
  ChevronLeft,
  ChevronRight,
  Zap,
  Copy,
  Check,
  Share2,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Percent,
  DollarSign,
  Search,
  UserPlus,
  Sliders,
  ToggleLeft,
  ToggleRight,
  Lock,
  Unlock,
  Settings,
  Plus,
  Trash2,
  Info
} from 'lucide-react';

interface OfficialAgencyManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  managerId?: string;
  managerName?: string;
  managerAvatar?: string;
  isSuperAdmin?: boolean;
}

export const OfficialAgencyManagerModal: React.FC<OfficialAgencyManagerModalProps> = ({
  isOpen,
  onClose,
  managerId = 'MGR-7700',
  managerName = 'سالم الكعبي (رئيس الوكالات والمندوبين)',
  managerAvatar = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  isSuperAdmin = true
}) => {
  const [activeTab, setActiveTab] = useState<'representatives' | 'agencies' | 'pending_invites' | 'invite_agency' | 'financials'>('representatives');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State for Direct Agency Recruitment by Manager
  const [newAgencyName, setNewAgencyName] = useState('');
  const [newAgencyOwnerId, setNewAgencyOwnerId] = useState('');
  const [newAgencyCountry, setNewAgencyCountry] = useState('المملكة العربية السعودية');
  const [newAgencyTarget, setNewAgencyTarget] = useState('10,000,000');

  // Form State for Adding a New Representative
  const [newRepUserId, setNewRepUserId] = useState('');
  const [newRepName, setNewRepName] = useState('');
  const [newRepCommission, setNewRepCommission] = useState('12.5%');

  // Representatives State (المندوبين التابعين لمدير الوكالات)
  const [representatives, setRepresentatives] = useState([
    {
      id: 'REP-9921',
      name: 'أحمد السعدون',
      userId: '88102933',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      canInviteAgencies: true, // الصلاحية مفتوحة من المدير
      commissionRate: '12.5%',
      agenciesCount: 4,
      totalRevenueGenerated: '$ 41,700',
      repEarnings: '$ 5,212.50',
      status: 'active',
      joinDate: '2026-03-10'
    },
    {
      id: 'REP-7734',
      name: 'مشعل الشمري',
      userId: '99201488',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      canInviteAgencies: true,
      commissionRate: '10.0%',
      agenciesCount: 3,
      totalRevenueGenerated: '$ 28,400',
      repEarnings: '$ 2,840.00',
      status: 'active',
      joinDate: '2026-04-18'
    },
    {
      id: 'REP-6610',
      name: 'طارق الزهراني',
      userId: '77301944',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
      canInviteAgencies: false, // الصلاحية مغلقة ومقيدة من المدير
      commissionRate: '8.0%',
      agenciesCount: 1,
      totalRevenueGenerated: '$ 8,900',
      repEarnings: '$ 712.00',
      status: 'suspended',
      joinDate: '2026-06-01'
    }
  ]);

  // Official Agencies List
  const [agenciesList, setAgenciesList] = useState([
    {
      id: 'AG-9011',
      name: 'وكالة الصقور الملكية',
      ownerName: 'فيصل القحطاني',
      ownerId: '88721094',
      repName: 'أحمد السعدون (REP-9921)',
      repId: 'REP-9921',
      hostsCount: 42,
      monthlyDiamonds: '1,450,000 💎',
      monthlyRevenue: '$ 14,500',
      status: 'active'
    },
    {
      id: 'AG-8842',
      name: 'وكالة أساطير الخليج',
      ownerName: 'عبدالرحمن الدوسري',
      ownerId: '77215903',
      repName: 'أحمد السعدون (REP-9921)',
      repId: 'REP-9921',
      hostsCount: 29,
      monthlyDiamonds: '980,000 💎',
      monthlyRevenue: '$ 9,800',
      status: 'active'
    },
    {
      id: 'AG-8510',
      name: 'وكالة قصر النجوم',
      ownerName: 'سعود الهاجري',
      ownerId: '91004822',
      repName: 'مشعل الشمري (REP-7734)',
      repId: 'REP-7734',
      hostsCount: 18,
      monthlyDiamonds: '620,000 💎',
      monthlyRevenue: '$ 6,200',
      status: 'active'
    },
    {
      id: 'AG-8205',
      name: 'وكالة النور الذهبية',
      ownerName: 'خالد المطيري',
      ownerId: '83109455',
      repName: 'استدعاء مباشر من رئيس الوكالات 👑',
      repId: 'DIRECT-MGR',
      hostsCount: 35,
      monthlyDiamonds: '1,120,000 💎',
      monthlyRevenue: '$ 11,200',
      status: 'active'
    }
  ]);

  // Pending Agency Requests from Representatives
  const [pendingRequests, setPendingRequests] = useState([
    {
      id: 'REQ-1092',
      agencyName: 'وكالة الفرسان الذهبية',
      candidateName: 'سلطان الشمري',
      candidateUserId: '99218044',
      repId: 'REP-9921',
      repName: 'أحمد السعدون',
      country: 'المملكة العربية السعودية',
      requestDate: '2026-08-28 14:30'
    },
    {
      id: 'REQ-1099',
      agencyName: 'وكالة بريق الماس العالمية',
      candidateName: 'بندر العتيبي',
      candidateUserId: '77419920',
      repId: 'REP-7734',
      repName: 'مشعل الشمري',
      country: 'الإمارات العربية المتحدة',
      requestDate: '2026-08-30 09:15'
    }
  ]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Toggle Representative's Authority to Recruit Agencies
  const toggleRepAuthority = (repId: string) => {
    setRepresentatives(reps => reps.map(r => {
      if (r.id === repId) {
        const updatedStatus = !r.canInviteAgencies;
        showToast(updatedStatus 
          ? `✅ تم فتح صلاحية استدعاء الوكالات للمندوب (${r.name})` 
          : `🔒 تم إغلاق وتقييد صلاحية الاستدعاء عن المندوب (${r.name})`
        );
        return { ...r, canInviteAgencies: updatedStatus };
      }
      return r;
    }));
  };

  // Change Representative Commission
  const updateRepCommission = (repId: string, newRate: string) => {
    setRepresentatives(reps => reps.map(r => r.id === repId ? { ...r, commissionRate: newRate } : r));
    showToast(`تم تعديل نسبة عمولة المندوب إلى ${newRate}`);
  };

  // Approve Pending Agency from Rep
  const handleApproveAgencyRequest = (reqId: string) => {
    const req = pendingRequests.find(r => r.id === reqId);
    if (!req) return;

    const newAg = {
      id: `AG-${Date.now().toString().slice(-4)}`,
      name: req.agencyName,
      ownerName: req.candidateName,
      ownerId: req.candidateUserId,
      repName: `${req.repName} (${req.repId})`,
      repId: req.repId,
      hostsCount: 0,
      monthlyDiamonds: '0 💎',
      monthlyRevenue: '$ 0.00',
      status: 'active'
    };

    setAgenciesList([newAg, ...agenciesList]);
    setPendingRequests(pendingRequests.filter(r => r.id !== reqId));
    showToast(`✅ تم اعتماد وتوثيق (${req.agencyName}) رسميًا كوكالة معتمدة`);
  };

  // Reject Pending Agency
  const handleRejectAgencyRequest = (reqId: string) => {
    setPendingRequests(pendingRequests.filter(r => r.id !== reqId));
    showToast('❌ تم رفض طلب توثيق الوكالة');
  };

  // Add New Representative
  const handleAddRepresentative = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRepUserId.trim() || !newRepName.trim()) {
      showToast('⚠️ يرجى إدخال معرف المندوب واسمه الكامل');
      return;
    }

    const newRep = {
      id: `REP-${Date.now().toString().slice(-4)}`,
      name: newRepName,
      userId: newRepUserId,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      canInviteAgencies: true,
      commissionRate: newRepCommission,
      agenciesCount: 0,
      totalRevenueGenerated: '$ 0.00',
      repEarnings: '$ 0.00',
      status: 'active',
      joinDate: '2026-08-30'
    };

    setRepresentatives([newRep, ...representatives]);
    setNewRepUserId('');
    setNewRepName('');
    showToast(`🎉 تم تعيين المندوب (${newRep.name}) وفتح صلاحية الاستدعاء له بنجاح`);
  };

  // Manager Direct Agency Recruitment
  const handleManagerDirectRecruit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgencyName.trim() || !newAgencyOwnerId.trim()) {
      showToast('⚠️ يرجى إدخال اسم الوكالة ومعرف صاحبها');
      return;
    }

    const newAg = {
      id: `AG-${Date.now().toString().slice(-4)}`,
      name: newAgencyName,
      ownerName: `مالك الوكالة (${newAgencyOwnerId})`,
      ownerId: newAgencyOwnerId,
      repName: 'استدعاء مباشر من رئيس الوكالات 👑',
      repId: 'DIRECT-MGR',
      hostsCount: 0,
      monthlyDiamonds: '0 💎',
      monthlyRevenue: '$ 0.00',
      status: 'active'
    };

    setAgenciesList([newAg, ...agenciesList]);
    setNewAgencyName('');
    setNewAgencyOwnerId('');
    showToast(`🚀 تم استدعاء وتوثيق الوكالة (${newAg.name}) مباشرة بقرار إداري`);
  };

  return (
    <div 
      className="fixed inset-0 z-[100] w-full h-full min-h-screen bg-[#F7F4EE] flex flex-col overflow-y-auto select-none font-sans"
      dir="rtl"
    >
      {/* Toast Alert matching Broadcaster Center Gold Banner */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-14 left-1/2 -translate-x-1/2 z-[110] bg-gradient-to-r from-[#7A5210] via-[#A87B28] to-[#5C3C0B] text-white px-5 py-2.5 rounded-full text-xs font-black shadow-[0_10px_30px_rgba(122,82,16,0.4)] border border-[#FFE29A]/50 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-200 animate-pulse" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Header Bar (Frosted Glass with Warm Gold Accents matching Broadcaster Center) */}
      <div className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl px-4 py-3 flex items-center justify-between border-b border-[#E8DFC8] shadow-[0_4px_20px_rgba(180,160,130,0.08)]">
        {/* Left Side Badge */}
        <div className="flex items-center gap-2">
          <div className="px-2.5 py-1 rounded-full bg-[#FAF5E8] border border-[#E2B755]/50 text-[#7A5210] text-[11px] font-black flex items-center gap-1 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#B38022]" />
            <span>الإدارة العليا للوكالات والمندوبين</span>
          </div>
        </div>

        {/* Title */}
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-[#96743A]" />
          <h1 className="text-base sm:text-lg font-black text-[#5C3F13] tracking-tight font-serif">
            مدير الوكالات الرسمية والمندوبين
          </h1>
        </div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="p-1.5 hover:bg-[#F5EFE0] active:scale-95 rounded-full text-[#8C6B38] hover:text-[#5C3F13] transition-all cursor-pointer"
          title="إغلاق"
        >
          <X className="w-5 h-5 stroke-[2.4]" />
        </button>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-lg mx-auto p-4 space-y-4 pb-16 flex-1">

        {/* ========================================================= */}
        {/* 1. HERO BOX: Ultra-Realistic Frosted Glass & Gold Card */}
        {/* ========================================================= */}
        <div className="relative overflow-hidden rounded-[32px] bg-white/85 backdrop-blur-2xl border border-white/95 p-4 sm:p-5 shadow-[0_20px_50px_rgba(180,160,130,0.18),0_4px_12px_rgba(0,0,0,0.03),inset_0_2px_4px_rgba(255,255,255,1)]">
          <div className="absolute top-3 left-3 opacity-20 text-[#96743A]">
            <Crown className="w-8 h-8" />
          </div>

          <div className="flex items-center justify-between relative z-10">
            {/* Manager Avatar & Title */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-13 h-13 rounded-full p-[2.5px] bg-gradient-to-tr from-[#FFF2B8] via-[#E2B755] to-[#7A5210] shadow-[0_4px_10px_rgba(179,128,34,0.3)]">
                  <img 
                    src={managerAvatar} 
                    alt={managerName} 
                    className="w-full h-full rounded-full object-cover bg-slate-900 border border-white/80"
                  />
                </div>
                <div className="absolute -inset-0.5 rounded-full border border-[#E2B755]/40 pointer-events-none" />
              </div>

              <div className="text-right">
                <div className="text-base font-black text-[#5C3F13] leading-tight flex items-center gap-1.5">
                  <span>{managerName}</span>
                  <span className="text-[10px] bg-gradient-to-r from-[#B38022] to-[#7A5210] text-white px-2 py-0.5 rounded-full font-black">
                    رئيس الوكالات 👑
                  </span>
                </div>
                <div className="text-xs font-bold font-mono text-[#8C6B38] mt-0.5" dir="ltr">
                  SUPERVISOR ID: {managerId}
                </div>
              </div>
            </div>

            {/* Quick Action */}
            <button 
              onClick={() => setActiveTab('invite_agency')}
              className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#B38022] via-[#C99836] to-[#7A5210] text-white text-xs font-black shadow-[0_4px_12px_rgba(179,128,34,0.3)] hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center gap-1"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>استدعاء وكالة</span>
            </button>
          </div>

          {/* Quick Metrics Bar in Gold styling */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-3.5 border-t border-[#E8DFC8]/60 text-center">
            <div 
              onClick={() => setActiveTab('representatives')}
              className="bg-[#FAF6EC]/80 rounded-2xl p-2 border border-[#EAE0CD]/80 cursor-pointer hover:bg-white transition-colors"
            >
              <span className="text-[10px] font-bold text-[#8C6B38] block">المندوبين المعتمدين</span>
              <span className="text-sm font-black text-[#5C3F13] font-mono mt-0.5 block">{representatives.length} مندوب</span>
            </div>
            <div 
              onClick={() => setActiveTab('agencies')}
              className="bg-[#FAF6EC]/80 rounded-2xl p-2 border border-[#EAE0CD]/80 cursor-pointer hover:bg-white transition-colors"
            >
              <span className="text-[10px] font-bold text-[#8C6B38] block">إجمالي الوكالات</span>
              <span className="text-sm font-black text-[#5C3F13] font-mono mt-0.5 block">{agenciesList.length} وكالة</span>
            </div>
            <div 
              onClick={() => setActiveTab('pending_invites')}
              className="bg-[#FAF6EC]/80 rounded-2xl p-2 border border-[#EAE0CD]/80 cursor-pointer hover:bg-white transition-colors"
            >
              <span className="text-[10px] font-bold text-[#8C6B38] block">طلبات الاعتماد المعلقة</span>
              <span className="text-sm font-black text-amber-700 font-mono mt-0.5 block">{pendingRequests.length} طلب</span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. NAVIGATION TABS (Golden Frosted Style) */}
        {/* ========================================================= */}
        <div className="flex items-center gap-1.5 p-1 bg-white/70 backdrop-blur-md rounded-2xl border border-[#EAE0CD] overflow-x-auto no-scrollbar shadow-2xs">
          {[
            { id: 'representatives', label: 'المندوبين والصلاحيات', icon: Users },
            { id: 'pending_invites', label: `طلبات التوثيق (${pendingRequests.length})`, icon: Clock },
            { id: 'agencies', label: 'الوكالات الرسمية', icon: Building2 },
            { id: 'invite_agency', label: 'استدعاء وكالة مباشرة', icon: UserPlus },
            { id: 'financials', label: 'الأرباح والعمولات', icon: DollarSign },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-[#B38022] to-[#7A5210] text-white shadow-sm'
                    : 'text-[#7A5210] hover:bg-[#FAF5E8] opacity-80'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ========================================================= */}
        {/* TAB 1: إدارة المندوبين وفتح الصلاحيات والعمولات (القلب النابض) */}
        {/* ========================================================= */}
        {activeTab === 'representatives' && (
          <div className="space-y-4">
            
            {/* Add New Representative Form */}
            <div className="p-4 rounded-[28px] bg-white/95 backdrop-blur-xl border border-[#EAE0CD] shadow-[0_10px_30px_rgba(180,160,130,0.1)] space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#EAE0CD]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#FAF5E8] border border-[#E2B755]/50 flex items-center justify-center text-[#7A5210]">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-black text-[#5C3F13]">تعيين مندوب وكالات جديد ومنحه الصلاحية</h3>
                </div>
                <span className="text-[10px] text-[#8C6B38] font-bold">خاص بمدير الوكالات ✓</span>
              </div>

              <form onSubmit={handleAddRepresentative} className="space-y-2.5">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-black text-[#5C3F13] mb-1">اسم المندوب:</label>
                    <input
                      type="text"
                      placeholder="مثال: فهد الدوسري"
                      value={newRepName}
                      onChange={(e) => setNewRepName(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-[#FAF8F3] border border-[#D6C5A2] text-xs text-[#5C3F13] font-bold focus:outline-none focus:border-[#B38022]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-[#5C3F13] mb-1">معرف المستخدم (User ID):</label>
                    <input
                      type="text"
                      placeholder="مثال: 99401288"
                      value={newRepUserId}
                      onChange={(e) => setNewRepUserId(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-[#FAF8F3] border border-[#D6C5A2] text-xs text-[#5C3F13] font-mono font-bold focus:outline-none focus:border-[#B38022]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-black text-[#5C3F13] mb-1">نسبة أرباح المندوب:</label>
                    <select
                      value={newRepCommission}
                      onChange={(e) => setNewRepCommission(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-[#FAF8F3] border border-[#D6C5A2] text-xs text-[#5C3F13] font-bold focus:outline-none focus:border-[#B38022]"
                    >
                      <option value="8.0%">8.0% من دخل الوكالات</option>
                      <option value="10.0%">10.0% من دخل الوكالات</option>
                      <option value="12.5%">12.5% (النسبة القياسية)</option>
                      <option value="15.0%">15.0% (مندوب متميز)</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#B38022] via-[#C99836] to-[#7A5210] text-white font-black text-xs shadow-md hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>إضافة وتفعيل المندوب 🚀</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* List of Representatives with Authority Controls */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-black text-[#5C3F13]">قائمة المندوبين والتحكم بالصلاحيات ({representatives.length})</span>
                <span className="text-[10px] text-[#8C6B38] font-bold">تعديل فوري للصلاحيات</span>
              </div>

              {representatives.map((rep) => (
                <div 
                  key={rep.id}
                  className="p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-[#EAE0CD] shadow-2xs space-y-3 hover:border-[#D6C5A2] transition-all"
                >
                  {/* Rep Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-[#EAE0CD]">
                    <div className="flex items-center gap-3">
                      <img 
                        src={rep.avatar} 
                        alt={rep.name} 
                        className="w-12 h-12 rounded-full object-cover border border-[#E2B755]/50 shadow-sm"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-black text-[#5C3F13]">{rep.name}</h4>
                          <span className="text-[9px] bg-[#FAF5E8] border border-[#E2B755] text-[#7A5210] px-1.5 py-0.2 rounded font-black font-mono">
                            {rep.id}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#8C6B38] font-bold block mt-0.5">
                          ID المستخدم: {rep.userId} • انضم: {rep.joinDate}
                        </span>
                      </div>
                    </div>

                    {/* Authority Toggle Status */}
                    <button
                      onClick={() => toggleRepAuthority(rep.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer transition-all flex items-center gap-1.5 shadow-2xs ${
                        rep.canInviteAgencies
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                          : 'bg-rose-50 text-rose-800 border border-rose-300 hover:bg-rose-100'
                      }`}
                      title="اضغط لتغيير الصلاحية"
                    >
                      {rep.canInviteAgencies ? (
                        <>
                          <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                          <span>الصلاحية مفتوحة ✓</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5 text-rose-600" />
                          <span>الصلاحية مغلقة 🔒</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Rep Stats & Commission Controls */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 rounded-xl bg-[#FAF8F3] border border-[#EAE0CD]">
                      <span className="text-[10px] text-[#8C6B38] block">الوكالات المستدعاة</span>
                      <span className="font-black font-mono text-[#5C3F13]">{rep.agenciesCount} وكالة</span>
                    </div>
                    <div className="p-2 rounded-xl bg-[#FAF8F3] border border-[#EAE0CD]">
                      <span className="text-[10px] text-[#8C6B38] block">الدخل المحقق</span>
                      <span className="font-black font-mono text-[#B38022]">{rep.totalRevenueGenerated}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-[#FAF8F3] border border-[#EAE0CD]">
                      <span className="text-[10px] text-[#8C6B38] block">أرباح المندوب</span>
                      <span className="font-black font-mono text-emerald-700">{rep.repEarnings}</span>
                    </div>
                  </div>

                  {/* Commission Rate Dropdown */}
                  <div className="flex items-center justify-between pt-1 border-t border-[#EAE0CD]/60 text-xs">
                    <div className="flex items-center gap-1 text-[11px] text-[#7A5210] font-bold">
                      <Percent className="w-3.5 h-3.5 text-[#B38022]" />
                      <span>نسبة أرباح المندوب الحالية:</span>
                    </div>
                    <select
                      value={rep.commissionRate}
                      onChange={(e) => updateRepCommission(rep.id, e.target.value)}
                      className="p-1 rounded-lg bg-[#FAF8F3] border border-[#D6C5A2] text-xs text-[#5C3F13] font-bold focus:outline-none focus:border-[#B38022]"
                    >
                      <option value="8.0%">8.0%</option>
                      <option value="10.0%">10.0%</option>
                      <option value="12.5%">12.5% (افتراضي)</option>
                      <option value="15.0%">15.0%</option>
                      <option value="20.0%">20.0% (VIP)</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: طلبات توثيق واعتماد الوكالات من المندوبين */}
        {/* ========================================================= */}
        {activeTab === 'pending_invites' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h4 className="text-xs font-black text-[#5C3F13]">طلبات فتح الوكالات المرفوعة من المندوبين ({pendingRequests.length})</h4>
              <span className="text-[10px] text-[#8C6B38]">تحتاج اعتماد رئيس الوكالات</span>
            </div>

            {pendingRequests.length === 0 ? (
              <div className="p-8 bg-white rounded-2xl border border-[#EAE0CD] text-center text-xs text-[#8C6B38]">
                لا توجد طلبات معلقة حاليًا. جميع الطلبات تم توثيقها بنجاح ✨
              </div>
            ) : (
              pendingRequests.map((req) => (
                <div key={req.id} className="p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-[#EAE0CD] shadow-2xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#EAE0CD]">
                    <div>
                      <h4 className="text-xs font-black text-[#5C3F13]">{req.agencyName}</h4>
                      <span className="text-[10px] text-[#8C6B38]">المرشح: {req.candidateName} (ID: {req.candidateUserId})</span>
                    </div>
                    <span className="text-[9px] bg-amber-50 text-amber-800 border border-amber-300 font-black px-2 py-0.5 rounded-full">
                      طلب اعتماد ⏳
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-[#7A5210] bg-[#FAF8F3] p-2.5 rounded-xl border border-[#EAE0CD]">
                    <div>
                      <span className="text-[10px] text-[#8C6B38] block">المندوب المستدعي:</span>
                      <span className="font-bold">{req.repName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#8C6B38] block">الدولة:</span>
                      <span className="font-bold">{req.country}</span>
                    </div>
                  </div>

                  {/* Actions: Approve / Reject */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleApproveAgencyRequest(req.id)}
                      className="flex-1 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs shadow-sm hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>اعتماد وتوثيق الوكالة رسميًا ✓</span>
                    </button>
                    <button
                      onClick={() => handleRejectAgencyRequest(req.id)}
                      className="px-3 py-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-300 font-black text-xs hover:bg-rose-100 transition-all cursor-pointer"
                    >
                      رفض
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: الوكالات الرسمية المعتمدة */}
        {/* ========================================================= */}
        {activeTab === 'agencies' && (
          <div className="space-y-3">
            <div className="relative">
              <input
                type="text"
                placeholder="البحث عن وكالة، صاحب الوكالة، أو المندوب..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2.5 pr-9 rounded-xl bg-white border border-[#D6C5A2] text-xs text-[#5C3F13] font-bold focus:outline-none focus:border-[#B38022]"
              />
              <Search className="w-4 h-4 text-[#8C6B38] absolute right-3 top-3" />
            </div>

            <div className="space-y-2.5">
              {agenciesList
                .filter(ag => ag.name.includes(searchQuery) || ag.ownerName.includes(searchQuery) || ag.repName.includes(searchQuery))
                .map((ag) => (
                  <div key={ag.id} className="p-3.5 bg-white rounded-2xl border border-[#EAE0CD] space-y-2 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-black text-[#5C3F13]">{ag.name}</h4>
                        <span className="text-[10px] text-[#8C6B38]">المالك: {ag.ownerName} (ID: {ag.ownerId})</span>
                      </div>
                      <span className="text-[9px] bg-emerald-50 text-emerald-800 border border-emerald-300 font-black px-2 py-0.5 rounded-full">
                        {ag.id} • نشطة
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] bg-[#FAF8F3] p-2 rounded-xl border border-[#EAE0CD]">
                      <span className="text-[#8C6B38]">المندوب: <strong className="text-[#5C3F13]">{ag.repName}</strong></span>
                      <span className="font-mono font-black text-[#B38022]">{ag.monthlyRevenue}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: استدعاء وكالة مباشرة من رئيس الوكالات */}
        {/* ========================================================= */}
        {activeTab === 'invite_agency' && (
          <div className="p-4.5 rounded-[28px] bg-white/95 backdrop-blur-xl border border-[#EAE0CD] shadow-[0_10px_30px_rgba(180,160,130,0.12)] space-y-3.5">
            <div className="flex items-center gap-2 pb-3 border-b border-[#EAE0CD]">
              <div className="w-8 h-8 rounded-xl bg-[#FAF5E8] border border-[#E2B755]/50 flex items-center justify-center text-[#7A5210]">
                <Crown className="w-4 h-4 text-[#B38022]" />
              </div>
              <div>
                <h3 className="text-xs font-black text-[#5C3F13]">استدعاء مباشر وتوثيق فوري لوكالة رسمية</h3>
                <span className="text-[10px] text-[#8C6B38]">بصفتك رئيس الوكالات (يتم التوثيق بدون الحاجة لمراجعة)</span>
              </div>
            </div>

            <form onSubmit={handleManagerDirectRecruit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-black text-[#5C3F13] mb-1">اسم الوكالة الرسمية الجديدة:</label>
                <input
                  type="text"
                  placeholder="مثال: وكالة النجوم الملكية"
                  value={newAgencyName}
                  onChange={(e) => setNewAgencyName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#FAF8F3] border border-[#D6C5A2] text-xs text-[#5C3F13] font-bold focus:outline-none focus:border-[#B38022]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black text-[#5C3F13] mb-1">معرف المستخدم (User ID) لصاحب الوكالة:</label>
                <input
                  type="text"
                  placeholder="مثال: 88109432"
                  value={newAgencyOwnerId}
                  onChange={(e) => setNewAgencyOwnerId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#FAF8F3] border border-[#D6C5A2] text-xs text-[#5C3F13] font-mono font-bold focus:outline-none focus:border-[#B38022]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-black text-[#5C3F13] mb-1">الدولة:</label>
                  <select
                    value={newAgencyCountry}
                    onChange={(e) => setNewAgencyCountry(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#FAF8F3] border border-[#D6C5A2] text-xs text-[#5C3F13] font-bold focus:outline-none focus:border-[#B38022]"
                  >
                    <option value="المملكة العربية السعودية">المملكة العربية السعودية</option>
                    <option value="الإمارات العربية المتحدة">الإمارات العربية المتحدة</option>
                    <option value="الكويت">الكويت</option>
                    <option value="قطر">قطر</option>
                    <option value="مصر">مصر</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-black text-[#5C3F13] mb-1">التارغت الشهري (ماسة):</label>
                  <input
                    type="text"
                    value={newAgencyTarget}
                    onChange={(e) => setNewAgencyTarget(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#FAF8F3] border border-[#D6C5A2] text-xs text-[#5C3F13] font-mono font-bold focus:outline-none focus:border-[#B38022]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#B38022] via-[#C99836] to-[#7A5210] text-white font-black text-xs shadow-md hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Crown className="w-4 h-4 text-amber-200" />
                <span>اعتماد وتوثيق الوكالة فوريًا 🚀</span>
              </button>
            </form>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: الأرباح والعمولات العامة */}
        {/* ========================================================= */}
        {activeTab === 'financials' && (
          <div className="space-y-3">
            <div className="p-4 rounded-[28px] bg-gradient-to-tr from-[#7A5210] via-[#A87B28] to-[#5C3C0B] text-white shadow-lg space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="opacity-90">إجمالي إيرادات كافة الوكالات الرسمية:</span>
                <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-black">التقرير الشامل 📊</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black font-mono" dir="ltr">$ 41,700.00</span>
                <span className="text-xs font-mono text-amber-200">💎 4,170,000 ماسة</span>
              </div>
              <div className="pt-2 border-t border-white/20 flex items-center justify-between text-[11px] opacity-90">
                <span>عمولات المندوبين المحولة: $ 5,212.50</span>
                <span>صافي أرباح إدارة الوكالات: $ 36,487.50</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
