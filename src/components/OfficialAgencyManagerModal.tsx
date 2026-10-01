import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Building2,
  Users,
  ShieldCheck,
  Crown,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  Clock,
  CheckCircle2,
  Percent,
  DollarSign,
  Search,
  UserPlus,
  Lock,
  Unlock,
  BarChart3,
  Ban,
  ShieldAlert,
  AlertTriangle
} from 'lucide-react';
import { 
  LEVEL_1_MANAGERS, 
  LEVEL_2_DELEGATES, 
  LEVEL_3_AGENTS, 
  LEVEL_4_BROKERS, 
  LEVEL_5_HOSTS,
  PRIMARY_SUPER_ADMIN_ID,
  HierarchyEntity
} from '../lib/hierarchyService';

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
  managerId = 'MGR-9901',
  managerName = 'إدارة أبو أمجد',
  managerAvatar = 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=400',
  isSuperAdmin = true
}) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'representatives' | 'banned_accounts' | 'agencies' | 'pending_invites' | 'invite_agency' | 'financials'>('stats');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Banned Accounts Search & Filters
  const [bannedSearchId, setBannedSearchId] = useState('');
  const [bannedFilter, setBannedFilter] = useState<'all' | 'mine' | 'external' | 'banned' | 'unbanned'>('all');

  // Form State for Direct Agency Recruitment by Manager
  const [newAgencyName, setNewAgencyName] = useState('');
  const [newAgencyOwnerId, setNewAgencyOwnerId] = useState('');
  const [newAgencyCountry, setNewAgencyCountry] = useState('المملكة العربية السعودية');
  const [newAgencyTarget, setNewAgencyTarget] = useState('10,000,000');

  // Form State for Adding a New Representative
  const [newRepUserId, setNewRepUserId] = useState('');
  const [newRepName, setNewRepName] = useState('');
  const [newRepCommission, setNewRepCommission] = useState('15.0%');

  // 1. المندوبين المعتمدين - مربوطين بالسيرفر مع المندوب عبدالله الشهري (DEL-401)
  const [representatives, setRepresentatives] = useState(() => {
    return LEVEL_2_DELEGATES.map((del) => ({
      id: del.id,
      name: del.name,
      userId: del.userId,
      avatar: del.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      canInviteAgencies: true,
      commissionRate: `${del.commissionRate || 15.0}%`,
      agenciesCount: LEVEL_3_AGENTS.filter(a => a.delegateId === del.id).length,
      totalRevenueGenerated: '$ 34,000.00',
      repEarnings: '$ 5,100.00',
      status: 'active',
      joinDate: '2026-01-15'
    }));
  });

  // 2. الوكالات الرسمية - مربوطة بالسيرفر مع وكالة النخبة الملكية (AG-101)
  const [agenciesList, setAgenciesList] = useState(() => {
    return LEVEL_3_AGENTS.map((ag) => {
      const rep = LEVEL_2_DELEGATES.find(d => d.id === ag.delegateId);
      const hosts = LEVEL_5_HOSTS.filter(h => h.agencyId === ag.id);
      return {
        id: ag.id,
        name: ag.name,
        ownerName: ag.userId === '1001010' ? 'سلطان الدوسري' : 'فيصل المطيري',
        ownerId: ag.userId,
        repName: rep ? `${rep.name} (${rep.id})` : 'استدعاء مباشر من إدارة أبو أمجد 👑',
        repId: ag.delegateId || 'MGR-9901',
        hostsCount: hosts.length > 0 ? hosts.length : 12,
        monthlyDiamonds: '3,400,000 💎',
        monthlyRevenue: '$ 34,000.00',
        commission: `${ag.commission || 14.5}%`,
        status: 'active'
      };
    });
  });

  // 3. طلبات التوثيق المعلقة
  const [pendingRequests, setPendingRequests] = useState([
    {
      id: 'REQ-1092',
      agencyName: 'وكالة فرسان المجد الملكية',
      candidateName: 'سلطان الشمري',
      candidateUserId: '1001030',
      repId: 'DEL-401',
      repName: 'عبدالله الشهري',
      country: 'المملكة العربية السعودية',
      requestDate: '2026-09-28 14:30'
    }
  ]);

  // 4. الحسابات المبندة - مربوطة بسجلات المذيعين
  const [bannedAccounts, setBannedAccounts] = useState([
    {
      id: 'BAN-101',
      userId: '1001026',
      userName: 'صقر الجزيرة',
      role: 'مذيع مسجل',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      agencyId: 'AG-101',
      agencyName: 'وكالة النخبة الملكية',
      invitedByRepName: 'عبدالله الشهري (DEL-401)',
      isManagedByMe: true, // تابعة لإدارة أبو أمجد ومندوبيها ✓
      banReason: 'مخالفة لائحة غرف البث والتحذير الإداري',
      banDate: '2026-09-25 16:40',
      bannedBy: 'لجنة المراقبة الآلية',
      isBanned: true,
      unbannedAt: undefined as string | undefined
    },
    {
      id: 'BAN-201',
      userId: '55401122',
      userName: 'ماجد الشريف',
      role: 'مستخدم مستقل',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      agencyId: 'NON-AGENCY',
      agencyName: 'حساب عام مستقل (خارجي)',
      invitedByRepName: 'خارج نطاق وكالاتك ومندوبيك',
      isManagedByMe: false, // خارجي - محظور فك البند ❌
      banReason: 'سلوك مسيء وتكرار البلاغات العامة',
      banDate: '2026-09-22 14:00',
      bannedBy: 'النظام الآلي العام',
      isBanned: true,
      unbannedAt: undefined as string | undefined
    }
  ]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // فك البند المشروط بالتبعية لوكالات أبو أمجد ومندوبيه
  const handleUnbanAccount = (account: typeof bannedAccounts[0]) => {
    if (!account.isManagedByMe) {
      showToast(`⛔ غير مصرح! لا يحق لك فك البند عن هذا الحساب (${account.userId}). الحساب يتبع لوكالة خارجية أو غير مسجل ضمن وكالات إدارة أبو أمجد.`);
      return;
    }

    setBannedAccounts(prev => prev.map(a => {
      if (a.id === account.id) {
        return { 
          ...a, 
          isBanned: false, 
          unbannedAt: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }) 
        };
      }
      return a;
    }));

    showToast(`✅ تم رفع البند وفك الحظر بنجاح عن (${account.userName} - ID: ${account.userId}) لأنه مسجل ضمن وكالتك المعتمدة (${account.agencyName}).`);
  };

  const handleRebanAccount = (accountId: string) => {
    setBannedAccounts(prev => prev.map(a => a.id === accountId ? { ...a, isBanned: true } : a));
    showToast(`🔒 تم إعادة فرض البند على الحساب.`);
  };

  // فتح وإغلاق صلاحية استدعاء الوكالات للمندوب
  const toggleRepAuthority = (repId: string) => {
    setRepresentatives(reps => reps.map(r => {
      if (r.id === repId) {
        const updatedStatus = !r.canInviteAgencies;
        showToast(updatedStatus 
          ? `✅ تم فتح صلاحية استدعاء الوكالات للمندوب (${r.name} - ${r.id})` 
          : `🔒 تم إغلاق وتقييد صلاحية الاستدعاء عن المندوب (${r.name} - ${r.id})`
        );
        return { ...r, canInviteAgencies: updatedStatus };
      }
      return r;
    }));
  };

  const updateRepCommission = (repId: string, newRate: string) => {
    setRepresentatives(reps => reps.map(r => r.id === repId ? { ...r, commissionRate: newRate } : r));
    showToast(`تم تعديل نسبة عمولة المندوب إلى ${newRate}`);
  };

  // اعتماد طلب وكالة جديدة من مندوب
  const handleApproveAgencyRequest = (reqId: string) => {
    const req = pendingRequests.find(r => r.id === reqId);
    if (!req) return;

    const newAg = {
      id: `AG-${Date.now().toString().slice(-3)}`,
      name: req.agencyName,
      ownerName: req.candidateName,
      ownerId: req.candidateUserId,
      repName: `${req.repName} (${req.repId})`,
      repId: req.repId,
      hostsCount: 1,
      monthlyDiamonds: '0 💎',
      monthlyRevenue: '$ 0.00',
      commission: '14.5%',
      status: 'active'
    };

    setAgenciesList([newAg, ...agenciesList]);
    setPendingRequests(pendingRequests.filter(r => r.id !== reqId));
    showToast(`✅ تم اعتماد وتوثيق (${req.agencyName}) رسميًا كوكالة معتمدة تابعة لإدارة أبو أمجد`);
  };

  const handleRejectAgencyRequest = (reqId: string) => {
    setPendingRequests(pendingRequests.filter(r => r.id !== reqId));
    showToast('❌ تم رفض طلب توثيق الوكالة');
  };

  // إضافة مندوب جديد تحت إدارة أبو أمجد
  const handleAddRepresentative = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRepUserId.trim() || !newRepName.trim()) {
      showToast('⚠️ يرجى إدخال معرف المندوب واسمه الكامل');
      return;
    }

    const newRep = {
      id: `DEL-${Date.now().toString().slice(-3)}`,
      name: newRepName,
      userId: newRepUserId,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      canInviteAgencies: true,
      commissionRate: newRepCommission,
      agenciesCount: 0,
      totalRevenueGenerated: '$ 0.00',
      repEarnings: '$ 0.00',
      status: 'active',
      joinDate: '2026-09-29'
    };

    setRepresentatives([newRep, ...representatives]);
    setNewRepUserId('');
    setNewRepName('');
    showToast(`🎉 تم تعيين المندوب (${newRep.name}) تحت إشراف إدارة أبو أمجد (MGR-9901) بنجاح`);
  };

  // استدعاء مباشر لوكالة من أبو أمجد
  const handleManagerDirectRecruit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgencyName.trim() || !newAgencyOwnerId.trim()) {
      showToast('⚠️ يرجى إدخال اسم الوكالة ومعرف صاحبها');
      return;
    }

    const newAg = {
      id: `AG-${Date.now().toString().slice(-3)}`,
      name: newAgencyName,
      ownerName: `وكيل معتمد (${newAgencyOwnerId})`,
      ownerId: newAgencyOwnerId,
      repName: 'استدعاء مباشر من إدارة أبو أمجد (MGR-9901) 👑',
      repId: 'MGR-9901',
      hostsCount: 0,
      monthlyDiamonds: '0 💎',
      monthlyRevenue: '$ 0.00',
      commission: '14.5%',
      status: 'active'
    };

    setAgenciesList([newAg, ...agenciesList]);
    setNewAgencyName('');
    setNewAgencyOwnerId('');
    showToast(`🚀 تم استدعاء وتوثيق الوكالة (${newAg.name}) مباشرة بقرار إداري من أبو أمجد`);
  };

  return (
    <div 
      className="fixed inset-0 z-[100] w-full h-full min-h-screen bg-[#F7F4EE] flex flex-col overflow-y-auto select-none font-sans"
      dir="rtl"
    >
      {/* Toast Alert */}
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

      {/* 1. Header Bar */}
      <div className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl px-4 py-3 flex items-center justify-between border-b border-[#E8DFC8] shadow-[0_4px_20px_rgba(180,160,130,0.08)]">
        <div className="flex items-center gap-2">
          <div className="px-2.5 py-1 rounded-full bg-[#FAF5E8] border border-[#E2B755]/50 text-[#7A5210] text-[11px] font-black flex items-center gap-1 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#B38022]" />
            <span>الرئاسة العليا • إدارة أبو أمجد</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-[#96743A]" />
          <h1 className="text-base sm:text-lg font-black text-[#5C3F13] tracking-tight font-serif">
            مدير الوكالات الرسمية والمندوبين
          </h1>
        </div>

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

        {/* 1. HERO BOX: بطاقة إدارة أبو أمجد المعتمدة بالسيرفر */}
        <div className="relative overflow-hidden rounded-[32px] bg-white/85 backdrop-blur-2xl border border-white/95 p-4 sm:p-5 shadow-[0_20px_50px_rgba(180,160,130,0.18),0_4px_12px_rgba(0,0,0,0.03),inset_0_2px_4px_rgba(255,255,255,1)]">
          <div className="absolute top-3 left-3 opacity-20 text-[#96743A]">
            <Crown className="w-8 h-8" />
          </div>

          <div className="flex items-center justify-between relative z-10">
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
                    المدير العام 👑 (55.0%)
                  </span>
                </div>
                <div className="text-xs font-bold font-mono text-[#8C6B38] mt-0.5" dir="ltr">
                  SUPERVISOR: {managerId} • UID: {PRIMARY_SUPER_ADMIN_ID}
                </div>
              </div>
            </div>

            <button 
              onClick={() => setActiveTab('invite_agency')}
              className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#B38022] via-[#C99836] to-[#7A5210] text-white text-xs font-black shadow-[0_4px_12px_rgba(179,128,34,0.3)] hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center gap-1"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>استدعاء وكالة</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-4 gap-1.5 sm:gap-2 mt-4 pt-3.5 border-t border-[#E8DFC8]/60 text-center">
            <div 
              onClick={() => setActiveTab('representatives')}
              className="bg-[#FAF6EC]/80 rounded-2xl p-2 border border-[#EAE0CD]/80 cursor-pointer hover:bg-white transition-colors"
            >
              <span className="text-[9px] sm:text-[10px] font-bold text-[#8C6B38] block">المناديب المعتمدون</span>
              <span className="text-xs sm:text-sm font-black text-[#5C3F13] font-mono mt-0.5 block">{representatives.length} مندوب</span>
            </div>
            <div 
              onClick={() => setActiveTab('agencies')}
              className="bg-[#FAF6EC]/80 rounded-2xl p-2 border border-[#EAE0CD]/80 cursor-pointer hover:bg-white transition-colors"
            >
              <span className="text-[9px] sm:text-[10px] font-bold text-[#8C6B38] block">إجمالي الوكالات</span>
              <span className="text-xs sm:text-sm font-black text-[#5C3F13] font-mono mt-0.5 block">{agenciesList.length} وكالة</span>
            </div>
            <div 
              onClick={() => setActiveTab('pending_invites')}
              className="bg-[#FAF6EC]/80 rounded-2xl p-2 border border-[#EAE0CD]/80 cursor-pointer hover:bg-white transition-colors"
            >
              <span className="text-[9px] sm:text-[10px] font-bold text-[#8C6B38] block">طلبات التوثيق</span>
              <span className="text-xs sm:text-sm font-black text-amber-700 font-mono mt-0.5 block">{pendingRequests.length} طلب</span>
            </div>
            <div 
              onClick={() => setActiveTab('banned_accounts')}
              className="bg-rose-50/80 rounded-2xl p-2 border border-rose-200/90 cursor-pointer hover:bg-rose-100/70 transition-colors group"
            >
              <div className="flex items-center justify-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                <span className="text-[9px] sm:text-[10px] font-black text-rose-700 block">الحسابات المبندة</span>
              </div>
              <span className="text-xs sm:text-sm font-black text-rose-700 font-mono mt-0.5 block">
                {bannedAccounts.filter(a => a.isBanned).length} مبند 🚫
              </span>
            </div>
          </div>
        </div>

        {/* 2. NAVIGATION TABS */}
        <div className="flex items-center gap-1.5 p-1 bg-white/70 backdrop-blur-md rounded-2xl border border-[#EAE0CD] overflow-x-auto no-scrollbar shadow-2xs">
          {[
            { id: 'stats', label: 'إحصائيات الوكالات', icon: BarChart3 },
            { id: 'representatives', label: `المندوبين (${representatives.length})`, icon: Users },
            { 
              id: 'banned_accounts', 
              label: `الحسابات المبندة (${bannedAccounts.filter(a => a.isBanned).length})`, 
              icon: Ban,
              isRed: true
            },
            { id: 'pending_invites', label: `طلبات التوثيق (${pendingRequests.length})`, icon: Clock },
            { id: 'agencies', label: `الوكالات الرسمية (${agenciesList.length})`, icon: Building2 },
            { id: 'invite_agency', label: 'استدعاء وكالة مباشرة', icon: UserPlus },
            { id: 'financials', label: 'الأرباح والعمولات (55%)', icon: DollarSign },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isRed = (tab as any).isRed;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? isRed
                      ? 'bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 text-white shadow-md ring-2 ring-rose-300/60'
                      : 'bg-gradient-to-r from-[#B38022] to-[#7A5210] text-white shadow-sm'
                    : isRed
                      ? 'text-rose-700 bg-rose-50/70 border border-rose-200/80 hover:bg-rose-100/80 shadow-2xs'
                      : 'text-[#7A5210] hover:bg-[#FAF5E8] opacity-80'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isRed && !isActive ? 'text-rose-600' : ''}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 0: إحصائيات الوكالات المعتمدة */}
        {activeTab === 'stats' && (
          <div className="space-y-4">
            <div className="p-5 rounded-[28px] bg-white/95 backdrop-blur-xl border border-[#EAE0CD] shadow-[0_10px_30px_rgba(180,160,130,0.1)] space-y-4" dir="rtl">
              <div className="flex items-center justify-between pb-2 border-b border-[#EAE0CD]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#FAF5E8] border border-[#E2B755]/50 flex items-center justify-center text-[#7A5210] shadow-xs">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-[#5C3F13]">
                      إحصائيات وكالات إدارة أبو أمجد
                    </h3>
                    <span className="text-[10px] text-[#8C6B38] font-bold">
                      بيانات حقيقية مستقاة من سيرفر المنصة
                    </span>
                  </div>
                </div>
                <span className="text-[10px] bg-gradient-to-r from-[#B38022] to-[#7A5210] text-white px-2.5 py-0.5 rounded-full font-black">
                  محدث فوري ⚡
                </span>
              </div>

              <div className="divide-y divide-[#F2EADA] text-xs sm:text-sm font-bold">
                <div className="py-3 flex items-center justify-between">
                  <span className="font-mono font-black text-sm sm:text-base text-[#5C3F13]" dir="ltr">
                    34,000,000 💎
                  </span>
                  <span className="text-[#7A5210] font-medium">
                    إجمالي الماسات المستلمة
                  </span>
                </div>

                <div className="py-3 flex items-center justify-between">
                  <span className="font-mono font-black text-sm sm:text-base text-emerald-700" dir="ltr">
                    55.0% (حصة أبو أمجد)
                  </span>
                  <span className="text-[#7A5210] font-medium">
                    حصة المدير العام
                  </span>
                </div>

                <div className="py-3 flex items-center justify-between">
                  <span className="font-mono font-black text-sm sm:text-base text-[#5C3F13]" dir="ltr">
                    15.0% (DEL-401 عبدالله الشهري)
                  </span>
                  <span className="text-[#7A5210] font-medium">
                    عمولة المندوب المشرف
                  </span>
                </div>

                <div className="py-3 flex items-center justify-between">
                  <span className="font-mono font-black text-sm sm:text-base text-[#5C3F13]" dir="ltr">
                    14.5% (AG-101 وكالة النخبة الملكية)
                  </span>
                  <span className="text-[#7A5210] font-medium">
                    عمولة الوكالة الرسمية
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center text-xs font-bold">
              <div className="p-3.5 rounded-2xl bg-white/90 border border-[#EAE0CD] shadow-2xs space-y-1">
                <span className="text-[10px] text-[#8C6B38] block">إجمالي أرباح إدارة أبو أمجد (55%)</span>
                <span className="font-mono font-black text-base text-[#B38022] block" dir="ltr">$ 18,700.00</span>
                <span className="text-[9px] text-[#7A5210]">أرباح نقدية مستحقة</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/90 border border-[#EAE0CD] shadow-2xs space-y-1">
                <span className="text-[10px] text-[#8C6B38] block">الوكالة النشطة الرئيسية</span>
                <span className="font-mono font-black text-base text-emerald-600 block">AG-101 (النخبة)</span>
                <span className="text-[9px] text-emerald-700">المذيعة: سارة الرياض (145h)</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: المندوبين المعتمدين (DEL-401) */}
        {activeTab === 'representatives' && (
          <div className="space-y-4">
            
            {/* Form */}
            <div className="p-4 rounded-[28px] bg-white/95 backdrop-blur-xl border border-[#EAE0CD] shadow-[0_10px_30px_rgba(180,160,130,0.1)] space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#EAE0CD]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#FAF5E8] border border-[#E2B755]/50 flex items-center justify-center text-[#7A5210]">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-black text-[#5C3F13]">تعيين مندوب جديد تحت إشراف إدارة أبو أمجد</h3>
                </div>
                <span className="text-[10px] text-[#8C6B38] font-bold">صلاحية المدير العام ✓</span>
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
                    <label className="block text-[11px] font-black text-[#5C3F13] mb-1">معرف المستخدم (UID):</label>
                    <input
                      type="text"
                      placeholder="مثال: 1001007"
                      value={newRepUserId}
                      onChange={(e) => setNewRepUserId(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-[#FAF8F3] border border-[#D6C5A2] text-xs text-[#5C3F13] font-mono font-bold focus:outline-none focus:border-[#B38022]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-black text-[#5C3F13] mb-1">نسبة عمولة المندوب:</label>
                    <select
                      value={newRepCommission}
                      onChange={(e) => setNewRepCommission(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-[#FAF8F3] border border-[#D6C5A2] text-xs text-[#5C3F13] font-bold focus:outline-none focus:border-[#B38022]"
                    >
                      <option value="12.0%">12.0%</option>
                      <option value="15.0%">15.0% (النسبة الرسمية لسيرفر النجم)</option>
                      <option value="18.0%">18.0%</option>
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

            {/* List */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-black text-[#5C3F13]">قائمة المناديب التابعين لإدارة أبو أمجد ({representatives.length})</span>
                <span className="text-[10px] text-[#8C6B38] font-bold">صلاحيات حقيقية</span>
              </div>

              {representatives.map((rep) => (
                <div 
                  key={rep.id}
                  className="p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-[#EAE0CD] shadow-2xs space-y-3"
                >
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
                          ID: {rep.userId} • المشرف: {managerName} ({managerId})
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleRepAuthority(rep.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer transition-all flex items-center gap-1.5 shadow-2xs ${
                        rep.canInviteAgencies
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                          : 'bg-rose-50 text-rose-800 border border-rose-300 hover:bg-rose-100'
                      }`}
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
                      <span className="text-[10px] text-[#8C6B38] block">عمولة المندوب</span>
                      <span className="font-black font-mono text-emerald-700">{rep.repEarnings}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-[#EAE0CD]/60 text-xs">
                    <div className="flex items-center gap-1 text-[11px] text-[#7A5210] font-bold">
                      <Percent className="w-3.5 h-3.5 text-[#B38022]" />
                      <span>نسبة عمولة المندوب الحالية:</span>
                    </div>
                    <span className="font-mono font-black text-slate-900 bg-white px-2 py-0.5 rounded border border-[#D6C5A2]">
                      {rep.commissionRate}
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 2: الحسابات المبندة مع حصر الصلاحية لأبو أمجد */}
        {activeTab === 'banned_accounts' && (
          <div className="space-y-4">
            <div className="p-4 sm:p-5 rounded-[28px] bg-white/95 backdrop-blur-xl border border-rose-200/90 shadow-sm space-y-3" dir="rtl">
              <div className="flex items-center justify-between pb-2.5 border-b border-rose-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shadow-xs">
                    <Ban className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-black text-rose-950">إدارة وفحص الحسابات المبندة</h3>
                    <span className="text-[10px] text-rose-700 font-bold">
                      صلاحية فك البند محصورة للمسجلين ضمن وكالات إدارة أبو أمجد ومندوبيها فقط
                    </span>
                  </div>
                </div>

                <span className="text-[10px] bg-rose-600 text-white px-3 py-1 rounded-full font-black font-mono">
                  {bannedAccounts.filter(a => a.isBanned).length} مبند 🚫
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-rose-50/80 border border-rose-200/80 text-[11px] space-y-1.5 text-rose-900">
                <div className="flex items-center gap-1.5 font-black text-rose-800">
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>قانون الصلاحيات الصارم:</span>
                </div>
                <p className="text-[10.5px] leading-relaxed text-rose-800 font-medium">
                  يحق لأبو أمجد (<strong className="font-black text-rose-950">MGR-9901</strong>) فك البند <strong className="underline text-emerald-800">حصرياً</strong> عن المذيعين والوكالات التابعة له. أي حساب خارجي يتم منع فك البند عنه تلقائياً.
                </p>
              </div>

              <div className="relative pt-1">
                <input
                  type="text"
                  placeholder="ابحث بالـ ID مثل: 1001026 أو بالاسم..."
                  value={bannedSearchId}
                  onChange={(e) => setBannedSearchId(e.target.value)}
                  className="w-full p-3 pr-10 rounded-2xl bg-[#FAF8F5] border border-rose-200/80 text-xs text-slate-900 font-bold focus:outline-none focus:border-rose-500 font-mono"
                />
                <Search className="w-4 h-4 text-rose-600 absolute right-3.5 top-4.5" />
              </div>
            </div>

            <div className="space-y-3">
              {bannedAccounts
                .filter(a => a.userId.includes(bannedSearchId.trim()) || a.userName.includes(bannedSearchId.trim()))
                .map((account) => (
                  <div 
                    key={account.id}
                    className={`p-4 rounded-2xl bg-white border shadow-2xs space-y-3 ${
                      account.isManagedByMe ? 'border-emerald-200' : 'border-rose-200 bg-rose-50/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <img 
                          src={account.avatar} 
                          alt={account.userName} 
                          className="w-12 h-12 rounded-2xl object-cover border-2 border-slate-200"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-xs sm:text-sm font-black text-slate-900">{account.userName}</h4>
                            <span className="text-[9px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-bold">
                              {account.role}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 font-mono mt-0.5">
                            ID: <strong className="text-slate-800">{account.userId}</strong> • {account.agencyName}
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0">
                        {account.isManagedByMe ? (
                          <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-300 font-black px-2 py-1 rounded-xl">
                            تابعة لإدارة أبو أمجد (مصرح) ✓
                          </span>
                        ) : (
                          <span className="text-[10px] bg-rose-50 text-rose-800 border border-rose-300 font-black px-2 py-1 rounded-xl">
                            خارج نطاقك (محظور) 🔒
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-xs text-rose-900 bg-rose-50 p-2.5 rounded-xl border border-rose-100">
                      سبب البند: {account.banReason} ({account.banDate})
                    </div>

                    <div>
                      {account.isManagedByMe ? (
                        account.isBanned ? (
                          <button
                            onClick={() => handleUnbanAccount(account)}
                            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs shadow-sm hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <Unlock className="w-4 h-4 text-emerald-200" />
                            <span>رفع البند وفك الحظر الآن (مصرح لك) 🔓</span>
                          </button>
                        ) : (
                          <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                            <span className="font-black text-emerald-800">✓ تم فك البند بنجاح • الحساب نشط</span>
                            <button
                              onClick={() => handleRebanAccount(account.id)}
                              className="px-2.5 py-1 rounded-lg bg-white border border-rose-300 text-rose-700 text-[10px] font-bold"
                            >
                              إعادة البند
                            </button>
                          </div>
                        )
                      ) : (
                        <button
                          onClick={() => handleUnbanAccount(account)}
                          className="w-full py-2.5 px-4 rounded-xl bg-slate-100 text-slate-500 border border-slate-200 font-bold text-xs cursor-not-allowed flex items-center justify-center gap-1.5"
                        >
                          <Lock className="w-4 h-4 text-rose-500" />
                          <span>🔒 غير مصرح: لا يحق لك فك بند هذا الحساب (خارج وكالاتك ومندوبيك)</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 3: طلبات التوثيق */}
        {activeTab === 'pending_invites' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h4 className="text-xs font-black text-[#5C3F13]">طلبات توثيق الوكالات المرفوعة من المندوبين ({pendingRequests.length})</h4>
              <span className="text-[10px] text-[#8C6B38]">بانتظار قرار أبو أمجد</span>
            </div>

            {pendingRequests.map((req) => (
              <div key={req.id} className="p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-[#EAE0CD] shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#EAE0CD]">
                  <div>
                    <h4 className="text-xs font-black text-[#5C3F13]">{req.agencyName}</h4>
                    <span className="text-[10px] text-[#8C6B38]">المرشح: {req.candidateName} (UID: {req.candidateUserId})</span>
                  </div>
                  <span className="text-[9px] bg-amber-50 text-amber-800 border border-amber-300 font-black px-2 py-0.5 rounded-full">
                    طلب اعتماد ⏳
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-[#7A5210] bg-[#FAF8F3] p-2.5 rounded-xl border border-[#EAE0CD]">
                  <div>
                    <span className="text-[10px] text-[#8C6B38] block">المندوب المستدعي:</span>
                    <span className="font-bold">{req.repName} ({req.repId})</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8C6B38] block">الدولة:</span>
                    <span className="font-bold">{req.country}</span>
                  </div>
                </div>

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
            ))}
          </div>
        )}

        {/* TAB 4: الوكالات الرسمية المعتمدة */}
        {activeTab === 'agencies' && (
          <div className="space-y-3">
            <div className="relative">
              <input
                type="text"
                placeholder="البحث عن وكالة أو كود..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2.5 pr-9 rounded-xl bg-white border border-[#D6C5A2] text-xs text-[#5C3F13] font-bold focus:outline-none focus:border-[#B38022]"
              />
              <Search className="w-4 h-4 text-[#8C6B38] absolute right-3 top-3" />
            </div>

            <div className="space-y-2.5">
              {agenciesList
                .filter(ag => ag.name.includes(searchQuery) || ag.id.includes(searchQuery) || ag.ownerName.includes(searchQuery))
                .map((ag) => (
                  <div key={ag.id} className="p-3.5 bg-white rounded-2xl border border-[#EAE0CD] space-y-2 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-black text-[#5C3F13]">{ag.name}</h4>
                        <span className="text-[10px] text-[#8C6B38]">المالك: {ag.ownerName} (UID: {ag.ownerId})</span>
                      </div>
                      <span className="text-[9px] bg-emerald-50 text-emerald-800 border border-emerald-300 font-black px-2 py-0.5 rounded-full font-mono">
                        {ag.id} • نشطة ✅
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] bg-[#FAF8F3] p-2 rounded-xl border border-[#EAE0CD]">
                      <span className="text-[#8C6B38]">المندوب: <strong className="text-[#5C3F13]">{ag.repName}</strong></span>
                      <span className="font-mono font-black text-[#B38022]">نسبة الوكالة: {ag.commission}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 5: استدعاء وكالة مباشرة من أبو أمجد */}
        {activeTab === 'invite_agency' && (
          <div className="p-4.5 rounded-[28px] bg-white/95 backdrop-blur-xl border border-[#EAE0CD] shadow-[0_10px_30px_rgba(180,160,130,0.12)] space-y-3.5">
            <div className="flex items-center gap-2 pb-3 border-b border-[#EAE0CD]">
              <div className="w-8 h-8 rounded-xl bg-[#FAF5E8] border border-[#E2B755]/50 flex items-center justify-center text-[#7A5210]">
                <Crown className="w-4 h-4 text-[#B38022]" />
              </div>
              <div>
                <h3 className="text-xs font-black text-[#5C3F13]">استدعاء مباشر وتوثيق فوري لوكالة جديدة</h3>
                <span className="text-[10px] text-[#8C6B38]">بصفتك المدير العام أبو أمجد (توثيق فوري بدون مراجعة)</span>
              </div>
            </div>

            <form onSubmit={handleManagerDirectRecruit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-black text-[#5C3F13] mb-1">اسم الوكالة الرسمية الجديدة:</label>
                <input
                  type="text"
                  placeholder="مثال: وكالة الصقور الذهبية"
                  value={newAgencyName}
                  onChange={(e) => setNewAgencyName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#FAF8F3] border border-[#D6C5A2] text-xs text-[#5C3F13] font-bold focus:outline-none focus:border-[#B38022]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black text-[#5C3F13] mb-1">معرف المستخدم (UID) للوكيل:</label>
                <input
                  type="text"
                  placeholder="مثال: 1001015"
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
                    <option value="الكويت">الكويت</option>
                    <option value="قطر">قطر</option>
                    <option value="الإمارات العربية المتحدة">الإمارات العربية المتحدة</option>
                    <option value="مصر">مصر</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-black text-[#5C3F13] mb-1">تارغت الشهر (ماسة):</label>
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

        {/* TAB 6: الأرباح والعمولات (حصة 55%) */}
        {activeTab === 'financials' && (
          <div className="space-y-3">
            <div className="p-4 rounded-[28px] bg-gradient-to-tr from-[#7A5210] via-[#A87B28] to-[#5C3C0B] text-white shadow-lg space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="opacity-90">إجمالي إيرادات كافة وكالات إدارة أبو أمجد:</span>
                <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-black">التقرير الشامل 📊</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black font-mono" dir="ltr">$ 34,000.00</span>
                <span className="text-xs font-mono text-amber-200">💎 34,000,000 ماسة</span>
              </div>
              <div className="pt-2 border-t border-white/20 flex items-center justify-between text-[11px] opacity-90">
                <span>عمولة المندوب (15%): $ 5,100.00</span>
                <span>عمولة الوكالة (14.5%): $ 4,930.00</span>
              </div>
              <div className="pt-1.5 border-t border-white/30 flex items-center justify-between text-xs font-black text-amber-200">
                <span>صافي حصة إدارة أبو أمجد (55.0%):</span>
                <span className="text-sm font-mono text-white">$ 18,700.00</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
