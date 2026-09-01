import React, { useState } from 'react';
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
  Info
} from 'lucide-react';

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
  const [currentSubView, setCurrentSubView] = useState<'main' | 'invite_agency' | 'my_agencies' | 'commissions' | 'invite_history' | 'rules'>('main');
  const [activeAlert, setActiveAlert] = useState<string | null>(null);
  const [copiedInviteCode, setCopiedInviteCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [searchAgencyQuery, setSearchAgencyQuery] = useState('');

  // Form State for Inviting an Agency
  const [candidateUserId, setCandidateUserId] = useState('');
  const [candidateAgencyName, setCandidateAgencyName] = useState('');
  const [candidatePhone, setCandidatePhone] = useState('');
  const [candidateCountry, setCandidateCountry] = useState('المملكة العربية السعودية');

  // Recruited Agencies Data (الوكالات المستدعاة من قبل المندوب)
  const [recruitedAgencies, setRecruitedAgencies] = useState([
    {
      id: 'AG-9011',
      name: 'وكالة الصقور الملكية',
      ownerName: 'فيصل القحطاني',
      ownerId: '88721094',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      joinDate: '2026-06-12',
      hostsCount: 42,
      monthlyDiamonds: '1,450,000 💎',
      monthlyRevenue: '$ 14,500',
      repCommission: '$ 1,812.50',
      status: 'active'
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
      status: 'active'
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
      status: 'active'
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
      status: 'active'
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

  const getSubViewTitle = () => {
    switch (currentSubView) {
      case 'invite_agency': return 'استدعاء وكيل رسمي جديد';
      case 'my_agencies': return `وكالاتي الرسمية المستدعاة (${recruitedAgencies.length})`;
      case 'commissions': return 'سجل الأرباح والعمولات المعتمدة';
      case 'invite_history': return 'سجل طلبات الاستدعاء والتوثيق';
      case 'rules': return 'شروط وصلاحيات مندوب الوكالات';
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
        {/* Left Side: Back Button if in subview */}
        <div className="flex items-center gap-2">
          {currentSubView !== 'main' ? (
            <button 
              onClick={() => setCurrentSubView('main')}
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

        {/* Title */}
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-[#96743A]" />
          <h1 className="text-base sm:text-lg font-black text-[#5C3F13] tracking-tight font-serif">
            {getSubViewTitle()}
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
                    <div className="p-2 rounded-xl bg-[#FAF8F3] border border-[#EAE0CD]">
                      <span className="text-[10px] text-[#8C6B38] block">المذيعين بالوكالة</span>
                      <span className="font-black font-mono text-[#5C3F13]">{ag.hostsCount} مذيع</span>
                    </div>
                    <div className="p-2 rounded-xl bg-[#FAF8F3] border border-[#EAE0CD]">
                      <span className="text-[10px] text-[#8C6B38] block">إجمالي دخل الوكالة</span>
                      <span className="font-black font-mono text-[#B38022]">{ag.monthlyRevenue}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-emerald-50/80 border border-emerald-200">
                      <span className="text-[10px] text-emerald-800 block">عمولتك (12.5%)</span>
                      <span className="font-black font-mono text-emerald-700">{ag.repCommission}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[10px] text-[#8C6B38]">
                    <span>تاريخ الاستدعاء: {ag.joinDate}</span>
                    <span className="font-mono font-bold text-[#7A5210]">الماس الشهري: {ag.monthlyDiamonds}</span>
                  </div>
                </div>
              ))}
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

    </div>
  );
};
