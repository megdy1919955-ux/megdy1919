import React, { useState } from 'react';
import { 
  X, ChevronLeft, ArrowLeft, Search, UserPlus, 
  Sparkles, CheckCircle2, DollarSign, Award, Clock,
  Radio, Calendar, ChevronRight, TrendingUp, Gem, 
  ShieldCheck, HelpCircle, FileText, Check, Copy, Share2,
  Trash2, AlertCircle, Users, BarChart3, Wallet
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface BrokerCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  direction?: 'rtl' | 'ltr';
  agencyGid?: string;
  agencyName?: string;
  brokerId?: string;
  brokerName?: string;
  commissionRate?: string;
  isAgencyOwner?: boolean;
}

export interface BrokerHostItem {
  id: string;
  name: string;
  avatar: string;
  joinDate: string;
  diamonds: string;
  rawDiamonds: number;
  liveDuration: string;
  liveDays: string;
  isClosed: boolean;
  targetAchieved: boolean;
  completionRate: string;
  calculatedCommission: string;
}

export interface BrokerItem {
  id: string;
  name: string;
  avatar: string;
  joinedAt: string;
  hostsCount: number;
  monthlyDiamonds: string;
  commissionRate: string;
  status: 'active' | 'inactive';
  phone?: string;
}

export const BrokerCenterModal: React.FC<BrokerCenterModalProps> = ({
  isOpen,
  onClose,
  direction = 'rtl',
  agencyGid = '30032',
  agencyName = 'وكالة الأساطير الذهبية',
  brokerId = '83534797',
  brokerName = '🔱 وسيط بغداد المعتمد',
  commissionRate = '15%',
  isAgencyOwner = false
}) => {
  // Navigation tabs for Broker View: 'stats' | 'hosts' | 'wallet' | 'invite' | 'earnings' | 'guidelines'
  const [activeTab, setActiveTab] = useState<'stats' | 'hosts' | 'wallet' | 'invite' | 'earnings' | 'guidelines'>('stats');

  // Navigation views for Agency Owner View: 'menu' | 'my_brokers' | 'broker_hosts' | 'invite' | 'remove' | 'guidelines'
  const [agencyView, setAgencyView] = useState<'menu' | 'my_brokers' | 'broker_hosts' | 'invite' | 'remove' | 'guidelines'>('menu');

  // Search & Filter in Hosts
  const [hostSearchQuery, setHostSearchQuery] = useState('');
  const [hostFilter, setHostFilter] = useState<'all' | 'active' | 'closed'>('all');

  // Search & Filter in Brokers (for Agency Owner)
  const [brokerSearchQuery, setBrokerSearchQuery] = useState('');
  const [selectedBrokerForHosts, setSelectedBrokerForHosts] = useState<BrokerItem | null>(null);

  // Invite Host Form State
  const [inviteHostId, setInviteHostId] = useState('');
  const [inviteCustomNote, setInviteCustomNote] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Agency Owner Invite & Remove States
  const [inviteBrokerIdInput, setInviteBrokerIdInput] = useState('');
  const [inviteCommissionInput, setInviteCommissionInput] = useState('10');
  const [selectedBrokerToRemove, setSelectedBrokerToRemove] = useState('');
  const [targetBrokerForHosts, setTargetBrokerForHosts] = useState('agency_direct');

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Agency Brokers List (for Agency Owner)
  const [brokersList, setBrokersList] = useState<BrokerItem[]>([
    {
      id: '83534797',
      name: '🔱 وسيط بغداد المعتمد',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      joinedAt: '2026-04-10',
      hostsCount: 42,
      monthlyDiamonds: '1,008,299',
      commissionRate: '15%',
      status: 'active',
      phone: '+964 770 123 4567'
    },
    {
      id: '81190421',
      name: '⭐ وسيط الرياض الملكي',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
      joinedAt: '2026-05-18',
      hostsCount: 28,
      monthlyDiamonds: '650,400',
      commissionRate: '12%',
      status: 'active',
      phone: '+966 50 123 4567'
    },
    {
      id: '89934120',
      name: '💎 وسيط القاهرة الدولي',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      joinedAt: '2026-05-20',
      hostsCount: 35,
      monthlyDiamonds: '520,100',
      commissionRate: '12%',
      status: 'active',
      phone: '+20 100 123 4567'
    },
    {
      id: '87720914',
      name: '🔥 وسيط دبي المميز',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      joinedAt: '2026-06-01',
      hostsCount: 19,
      monthlyDiamonds: '290,000',
      commissionRate: '10%',
      status: 'active',
      phone: '+971 55 444 3322'
    },
    {
      id: '82231908',
      name: '💫 وسيط مسقط الفضي',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
      joinedAt: '2026-06-12',
      hostsCount: 12,
      monthlyDiamonds: '180,000',
      commissionRate: '8%',
      status: 'active',
      phone: '+968 91 234 567'
    },
    {
      id: '86641920',
      name: '🌟 وسيط الكويت الذهبي',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      joinedAt: '2026-06-25',
      hostsCount: 16,
      monthlyDiamonds: '245,000',
      commissionRate: '10%',
      status: 'active',
      phone: '+965 99 888 777'
    }
  ]);

  // Comprehensive Host List for the Broker (42 hosts simulation)
  const [brokerHosts, setBrokerHosts] = useState<BrokerHostItem[]>([
    {
      id: '82846546',
      name: '👑 الملكة سارة',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      joinDate: '2026-07-14 18:22:04',
      diamonds: '420,800',
      rawDiamonds: 420800,
      liveDuration: '52 ساعة',
      liveDays: '24 يوم',
      isClosed: true,
      targetAchieved: true,
      completionRate: 'تسكير هدف الشهر 🎯',
      calculatedCommission: '63,120 💎'
    },
    {
      id: '78427093',
      name: 'طرب بغداد 🎵',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      joinDate: '2026-07-19 21:05:11',
      diamonds: '298,299',
      rawDiamonds: 298299,
      liveDuration: '44 ساعة',
      liveDays: '20 يوم',
      isClosed: true,
      targetAchieved: true,
      completionRate: 'تسكير هدف الشهر 🎯',
      calculatedCommission: '44,744 💎'
    },
    {
      id: '89124401',
      name: 'زهرة الرافدين 🌸',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
      joinDate: '2026-05-12 11:30:00',
      diamonds: '140,000',
      rawDiamonds: 140000,
      liveDuration: '28 ساعة',
      liveDays: '15 يوم',
      isClosed: true,
      targetAchieved: true,
      completionRate: 'تسكير هدف الشهر 🎯',
      calculatedCommission: '21,000 💎'
    },
    {
      id: '81156183',
      name: 'صوت دجلة 🎤',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
      joinDate: '2026-08-01 16:45:20',
      diamonds: '89,200',
      rawDiamonds: 89200,
      liveDuration: '24 ساعة',
      liveDays: '12 يوم',
      isClosed: false,
      targetAchieved: false,
      completionRate: '75% من التارغت',
      calculatedCommission: '13,380 💎'
    },
    {
      id: '86654120',
      name: 'عازف القانون 🎻',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
      joinDate: '2026-06-18 19:10:00',
      diamonds: '60,000',
      rawDiamonds: 60000,
      liveDuration: '20 ساعة',
      liveDays: '10 يوم',
      isClosed: true,
      targetAchieved: true,
      completionRate: 'تسكير هدف الشهر 🎯',
      calculatedCommission: '9,000 💎'
    },
    {
      id: '84419082',
      name: 'أمير النغم 🎼',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200',
      joinDate: '2026-07-01 14:15:00',
      diamonds: '55,400',
      rawDiamonds: 55400,
      liveDuration: '18 ساعة',
      liveDays: '9 يوم',
      isClosed: false,
      targetAchieved: false,
      completionRate: '60% من التارغت',
      calculatedCommission: '8,310 💎'
    },
    {
      id: '87731290',
      name: 'نور البصرة ✨',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
      joinDate: '2026-06-25 22:00:00',
      diamonds: '48,000',
      rawDiamonds: 48000,
      liveDuration: '16 ساعة',
      liveDays: '8 يوم',
      isClosed: true,
      targetAchieved: true,
      completionRate: 'تسكير هدف الشهر 🎯',
      calculatedCommission: '7,200 💎'
    },
    {
      id: '89912044',
      name: 'قيصر الشرق 👑',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
      joinDate: '2026-07-28 17:30:00',
      diamonds: '32,000',
      rawDiamonds: 32000,
      liveDuration: '14 ساعة',
      liveDays: '7 يوم',
      isClosed: false,
      targetAchieved: false,
      completionRate: '45% من التارغت',
      calculatedCommission: '4,800 💎'
    }
  ]);

  if (!isOpen) return null;

  // Aggregate stats calculations for Broker
  const totalHostsCount = 42;
  const totalDiamonds = '1,008,299';
  const totalBrokerCommissionDiamonds = '151,244';
  const totalBrokerCommissionUsd = '$151.24';
  const closedTargetsCount = 18;

  // Filter hosts based on query and status
  const filteredHosts = brokerHosts.filter(host => {
    const matchesSearch = host.name.toLowerCase().includes(hostSearchQuery.toLowerCase()) || 
                          host.id.includes(hostSearchQuery);
    if (!matchesSearch) return false;
    if (hostFilter === 'active') return !host.isClosed;
    if (hostFilter === 'closed') return host.isClosed;
    return true;
  });

  // Filter brokers for Agency Owner view
  const filteredBrokers = brokersList.filter(b => 
    b.name.toLowerCase().includes(brokerSearchQuery.toLowerCase()) || b.id.includes(brokerSearchQuery)
  );

  const handleSendHostInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteHostId.trim()) {
      showToast('⚠️ يرجى إدخال معرّف ID المذيع أولاً');
      return;
    }

    const newHost: BrokerHostItem = {
      id: inviteHostId.trim(),
      name: `مذيع جديد (${inviteHostId.trim()})`,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      joinDate: new Date().toLocaleString('sv-SE'),
      diamonds: '0',
      rawDiamonds: 0,
      liveDuration: '0 ساعة',
      liveDays: '0 يوم',
      isClosed: false,
      targetAchieved: false,
      completionRate: '0% (جديد)',
      calculatedCommission: '0 💎'
    };

    setBrokerHosts([newHost, ...brokerHosts]);
    showToast(`🚀 تم إرسال دعوة الانضمام للوكالة تحت إشرافك للمذيع ID: ${inviteHostId.trim()}`);
    setInviteHostId('');
    setInviteCustomNote('');
    setActiveTab('hosts');
  };

  const handleCopyLink = () => {
    const inviteLink = `https://superlegend.app/invite?broker=${brokerId}&agency=${agencyGid}`;
    navigator.clipboard?.writeText(inviteLink);
    setCopiedLink(true);
    showToast('✅ تم نسخ رابط دعوة المذيعين الخاص بالوسيط');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleSendBrokerInviteAgency = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteBrokerIdInput.trim()) {
      showToast('⚠️ يرجى إدخال معرّف المستخدم المراد تعيينه كوسيط');
      return;
    }
    const newBroker: BrokerItem = {
      id: inviteBrokerIdInput.trim(),
      name: `وسيط جديد (${inviteBrokerIdInput.trim()})`,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      joinedAt: new Date().toISOString().split('T')[0],
      hostsCount: 0,
      monthlyDiamonds: '0',
      commissionRate: `${inviteCommissionInput}%`,
      status: 'active'
    };
    setBrokersList([newBroker, ...brokersList]);
    showToast(`✅ تم تعيين المستخدم ${inviteBrokerIdInput.trim()} كوسيط جديد بعمولة ${inviteCommissionInput}%`);
    setInviteBrokerIdInput('');
    setAgencyView('my_brokers');
  };

  const handleExecuteRemoveBroker = () => {
    if (!selectedBrokerToRemove) {
      showToast('⚠️ يرجى اختيار الوسيط المراد إزالته');
      return;
    }
    setBrokersList(brokersList.filter(b => b.id !== selectedBrokerToRemove));
    showToast(`✅ تم إزالة الوسيط بنجاح ونقل مذيعيه إلى الوكالة`);
    setSelectedBrokerToRemove('');
    setAgencyView('my_brokers');
  };

  // =========================================================================
  // VIEW RENDER: AGENCY OWNER VIEW (إذا فُتحت من داخل وكالتي لإدارة وسطاء الوكالة)
  // =========================================================================
  if (isAgencyOwner) {
    return (
      <div dir="rtl" className="select-none font-sans">
        <AnimatePresence>
          {toastMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="fixed top-12 left-1/2 -translate-x-1/2 z-[180] bg-slate-900/95 text-white px-5 py-2.5 rounded-full text-xs font-black shadow-2xl border border-teal-400/30 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-teal-300 animate-pulse" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AGENCY OWNER - MENU HUB */}
        {agencyView === 'menu' && (
          <div className="fixed inset-0 z-[120] bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-sm sm:max-w-md bg-white rounded-[28px] p-5 text-slate-900 shadow-2xl space-y-4 select-none relative"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-lg">
                    🤝
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">مركز إدارة الوسطاء</h3>
                    <span className="text-[10px] text-slate-500 font-bold block">{agencyName} (GID: {agencyGid})</span>
                  </div>
                </div>
                <button onClick={onClose} className="p-1.5 bg-slate-100 rounded-full text-slate-600 hover:bg-slate-200 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2.5">
                <button
                  onClick={() => setAgencyView('my_brokers')}
                  className="w-full p-3.5 bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200/80 rounded-2xl flex items-center justify-between hover:bg-teal-100/70 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
                      <Users className="w-5 h-5" />
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-slate-900 block">وسطائي المعتمدين</span>
                      <span className="text-[10px] text-teal-700 font-bold block">السعة الحالية: {brokersList.length} / 10 وسطاء</span>
                    </div>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-teal-600 group-hover:-translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => setAgencyView('invite')}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between hover:bg-slate-100 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                      <UserPlus className="w-5 h-5" />
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-slate-900 block">تعيين وسيط جديد بالوكالة</span>
                      <span className="text-[10px] text-slate-500 font-bold block">منح صلاحية وسيط وتحديد نسبة العمولة</span>
                    </div>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:-translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => setAgencyView('remove')}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between hover:bg-rose-50 hover:border-rose-200 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-xs">
                      <Trash2 className="w-5 h-5" />
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-slate-900 block">إزالة وسيط وتحويل مذيعيه</span>
                      <span className="text-[10px] text-rose-600 font-bold block">إنهاء صلاحية وسيط ونقل مذيعيه</span>
                    </div>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:-translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* AGENCY OWNER - BROKERS LIST FULL SCREEN */}
        {agencyView === 'my_brokers' && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed inset-0 z-[130] bg-[#f4f6f9] text-slate-900 flex flex-col w-full h-full overflow-hidden"
          >
            <div className="bg-white border-b border-slate-200/90 px-4 sm:px-6 py-3 flex items-center justify-between shrink-0 shadow-xs z-10">
              <button 
                onClick={() => setAgencyView('menu')}
                className="p-2 -mr-1 rounded-full hover:bg-slate-100 text-slate-700 transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5 rotate-180 text-slate-800" />
                <span>رجوع</span>
              </button>
              <div className="text-center">
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-tight">وسطاء الوكالة</h2>
                <span className="text-[11px] text-teal-700 font-bold block mt-0.5 font-mono">{brokersList.length} / 10 وسطاء معتمدين</span>
              </div>
              <button onClick={onClose} className="p-2 -ml-1 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer">
                <X className="w-5 h-5 stroke-[2.2]" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto w-full px-3.5 sm:px-6 py-3.5 custom-scrollbar">
              <div className="max-w-2xl mx-auto space-y-3 pb-24">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text"
                    value={brokerSearchQuery}
                    onChange={(e) => setBrokerSearchQuery(e.target.value)}
                    placeholder="بحث باسم الوسيط أو الـ ID..."
                    className="w-full pl-3 pr-9 py-2.5 bg-white border border-slate-200/90 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-teal-500 shadow-2xs"
                  />
                </div>

                <div className="space-y-3">
                  {filteredBrokers.map((broker) => (
                    <div 
                      key={broker.id}
                      onClick={() => {
                        setSelectedBrokerForHosts(broker);
                        setAgencyView('broker_hosts');
                      }}
                      className="bg-white rounded-2xl p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.05)] border border-slate-200/90 space-y-3 cursor-pointer hover:bg-slate-50 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3.5">
                          <img src={broker.avatar} alt={broker.name} className="w-12 h-12 rounded-full object-cover border border-slate-100" />
                          <div>
                            <h4 className="text-sm sm:text-base font-black text-slate-900 leading-tight">{broker.name}</h4>
                            <span className="text-xs font-mono text-slate-500 font-bold block mt-0.5" dir="ltr">ID: {broker.id}</span>
                          </div>
                        </div>
                        <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full font-black font-mono">
                          عمولة: {broker.commissionRate}
                        </span>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                        <span className="text-teal-800 flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-teal-600" />
                          المذيعين: <strong className="font-mono text-sm">{broker.hostsCount} مذيع</strong>
                        </span>
                        <span className="text-slate-500 font-mono text-[11px]">إنتاج: {broker.monthlyDiamonds} 💎</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* AGENCY OWNER - BROKER HOSTS VIEW */}
        {agencyView === 'broker_hosts' && selectedBrokerForHosts && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed inset-0 z-[140] bg-[#f4f6f9] text-slate-900 flex flex-col w-full h-full overflow-hidden"
          >
            <div className="bg-white border-b border-slate-200/90 px-4 sm:px-6 py-3 flex items-center justify-between shrink-0 shadow-xs z-10">
              <button 
                onClick={() => setAgencyView('my_brokers')}
                className="p-2 -mr-1 rounded-full hover:bg-slate-100 text-slate-700 transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5 rotate-180 text-slate-800" />
                <span>رجوع للوسطاء</span>
              </button>
              <div className="text-center">
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-tight">مذيعو {selectedBrokerForHosts.name}</h2>
                <span className="text-[11px] text-teal-700 font-bold block mt-0.5 font-mono">{selectedBrokerForHosts.hostsCount} مذيع</span>
              </div>
              <button onClick={onClose} className="p-2 -ml-1 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer">
                <X className="w-5 h-5 stroke-[2.2]" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto w-full px-3.5 sm:px-6 py-3.5 custom-scrollbar">
              <div className="max-w-2xl mx-auto space-y-3 pb-24">
                {brokerHosts.map(host => (
                  <div key={host.id} className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/90 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={host.avatar} alt={host.name} className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <h4 className="text-sm font-black text-slate-900">{host.name}</h4>
                          <span className="text-xs font-mono text-slate-400">ID: {host.id}</span>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-black text-amber-600">{host.diamonds} 💎</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* AGENCY OWNER - INVITE MODAL */}
        {agencyView === 'invite' && (
          <div className="fixed inset-0 z-[120] bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="w-full max-w-sm sm:max-w-md bg-white rounded-[28px] p-5 text-slate-900 shadow-2xl space-y-4 select-none relative"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <button onClick={() => setAgencyView('menu')} className="p-1 rounded-full hover:bg-slate-100 text-slate-600 text-xs font-bold flex items-center gap-1">
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                  <span>رجوع</span>
                </button>
                <h3 className="text-sm font-black text-slate-900">تعيين وسيط جديد بالوكالة</h3>
                <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
              </div>

              <form onSubmit={handleSendBrokerInviteAgency} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">معرف المستخدم (User ID):</label>
                  <input 
                    type="text" 
                    value={inviteBrokerIdInput} 
                    onChange={e => setInviteBrokerIdInput(e.target.value)} 
                    placeholder="مثال: 83534797" 
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-center font-mono text-sm font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">نسبة العمولة الممنوحة:</label>
                  <select 
                    value={inviteCommissionInput} 
                    onChange={e => setInviteCommissionInput(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  >
                    <option value="5">5% (المستوى البرونزي)</option>
                    <option value="10">10% (المستوى الذهبي)</option>
                    <option value="15">15% (المستوى الماسي)</option>
                  </select>
                </div>
                <button type="submit" className="w-full py-2.5 bg-teal-600 text-white font-black text-xs rounded-xl shadow-xs cursor-pointer">
                  منح صلاحية وسيط بالوكالة
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {/* AGENCY OWNER - REMOVE MODAL */}
        {agencyView === 'remove' && (
          <div className="fixed inset-0 z-[120] bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="w-full max-w-sm sm:max-w-md bg-white rounded-[28px] p-5 text-slate-900 shadow-2xl space-y-4 select-none relative"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <button onClick={() => setAgencyView('menu')} className="p-1 rounded-full hover:bg-slate-100 text-slate-600 text-xs font-bold flex items-center gap-1">
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                  <span>رجوع</span>
                </button>
                <h3 className="text-sm font-black text-slate-900">إزالة وسيط من الوكالة</h3>
                <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
              </div>

              <div className="space-y-3">
                <select 
                  value={selectedBrokerToRemove} 
                  onChange={e => setSelectedBrokerToRemove(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                >
                  <option value="">-- اختر الوسيط المراد إزالته --</option>
                  {brokersList.map(b => (
                    <option key={b.id} value={b.id}>{b.name} (ID: {b.id})</option>
                  ))}
                </select>
                <button onClick={handleExecuteRemoveBroker} className="w-full py-2.5 bg-rose-600 text-white font-black text-xs rounded-xl shadow-xs cursor-pointer">
                  تأكيد سحب الصلاحية
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // VIEW RENDER: BROKER VIEW (الافتراضي عند الدخول من صفحة أنا عبر كرت مركز الوسطاء)
  // =========================================================================
  return (
    <div dir="rtl" className="select-none font-sans">
      {/* Toast Feedback */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-12 left-1/2 -translate-x-1/2 z-[180] bg-slate-900/95 text-white px-5 py-2.5 rounded-full text-xs font-black shadow-2xl border border-teal-400/30 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-teal-300 animate-pulse" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FULL SCREEN MODAL CONTAINER */}
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 35 }}
        transition={{ duration: 0.22 }}
        className="fixed inset-0 z-[130] bg-[#f4f6f9] text-slate-900 flex flex-col w-full h-full overflow-hidden"
      >
        {/* ========================================================= */}
        {/* 1. TOP STICKY BAR */}
        {/* ========================================================= */}
        <div className="bg-white border-b border-slate-200/90 px-4 sm:px-6 py-3 flex items-center justify-between shrink-0 shadow-xs z-20">
          <button 
            onClick={onClose}
            className="p-2 -mr-1 rounded-full hover:bg-slate-100 text-slate-700 transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 rotate-180 text-slate-800" />
            <span>رجوع</span>
          </button>

          <div className="text-center">
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-tight flex items-center justify-center gap-1.5">
              <span>مركز الوسطاء</span>
              <span className="text-[10px] bg-teal-50 text-teal-800 border border-teal-300/80 px-2 py-0.5 rounded-full font-bold">
                صلاحية وسيط 💎
              </span>
            </h2>
            <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-slate-500 mt-0.5">
              <span>صلاحية ممنوحة من:</span>
              <strong className="text-teal-700">{agencyName}</strong>
              <span className="text-slate-400 font-mono">(GID: {agencyGid})</span>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 -ml-1 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
            title="إغلاق"
          >
            <X className="w-5 h-5 stroke-[2.2]" />
          </button>
        </div>

        {/* ========================================================= */}
        {/* 2. SCROLLABLE CONTAINER (يرتفع للأعلى بسلاسة ليشمل الشاشة كاملة) */}
        {/* ========================================================= */}
        <div className="flex-1 overflow-y-auto w-full px-3.5 sm:px-6 py-3.5 custom-scrollbar">
          <div className="max-w-2xl mx-auto space-y-3.5 pb-24">

            {/* A. البانر الملكي لملف الوسيط والصلاحية الممنوحة من الوكالة */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#0D404C] via-[#104D5B] to-[#0A333D] text-white rounded-3xl p-4 sm:p-5 shadow-[0_4px_20px_rgba(16,77,91,0.3)] border border-teal-500/30 space-y-4">
              {/* شارة التوثيق العلوية */}
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10.5px] font-black bg-teal-900/80 border border-teal-400/50 text-teal-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-300" />
                  <span>صلاحية وسيط رسمي معتمد (من وكالتي)</span>
                </div>

                <span className="text-xs font-mono font-black bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2.5 py-0.5 rounded-full">
                  عمولتي: {commissionRate}
                </span>
              </div>

              {/* بيانات الوسيط */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-3.5">
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-teal-400 to-cyan-300 p-[2px] shadow-md">
                    <img 
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80" 
                      alt={brokerName}
                      className="w-full h-full rounded-[14px] object-cover bg-slate-900"
                    />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-white leading-tight">
                      {brokerName}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-mono text-teal-200 font-bold" dir="ltr">
                        ID: {brokerId}
                      </span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.2 rounded-md font-bold">
                        نشط وموثق ✓
                      </span>
                    </div>
                  </div>
                </div>

                {/* زر نسخ رابط الدعوة السريع */}
                <button
                  onClick={handleCopyLink}
                  className="bg-white/10 hover:bg-white/20 active:scale-95 text-teal-100 border border-teal-400/30 px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                >
                  <Copy className="w-3.5 h-3.5 text-teal-300" />
                  <span>{copiedLink ? 'تم النسخ' : 'رابط الدعوة'}</span>
                </button>
              </div>

              {/* شبكة الإحصائيات المحسوبة للوسيط من الوكالة (4 كروت رئيسية) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-teal-700/40 text-center">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2.5 border border-white/10">
                  <span className="text-[10px] text-teal-200 font-bold block">مذيعي التابعين لي</span>
                  <div className="text-base sm:text-lg font-black text-white font-mono mt-0.5">
                    {totalHostsCount} مذيع
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2.5 border border-white/10">
                  <span className="text-[10px] text-teal-200 font-bold block">إنتاج الماس الشهر</span>
                  <div className="text-base sm:text-lg font-black text-amber-300 font-mono mt-0.5 flex items-center justify-center gap-1">
                    <span>{totalDiamonds}</span>
                    <span className="text-xs">💎</span>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2.5 border border-white/10">
                  <span className="text-[10px] text-teal-200 font-bold block">عمولتي المستحقة (15%)</span>
                  <div className="text-base sm:text-lg font-black text-emerald-300 font-mono mt-0.5">
                    {totalBrokerCommissionDiamonds} 💎
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2.5 border border-white/10">
                  <span className="text-[10px] text-teal-200 font-bold block">تسكيرات التارغت</span>
                  <div className="text-base sm:text-lg font-black text-cyan-200 font-mono mt-0.5">
                    {closedTargetsCount} تسكيرة
                  </div>
                </div>
              </div>
            </div>

            {/* B. شريط التبويبات للوسيط (الإحصائيات / مذيعي / محفظتي / دعوة مذيع / كشف العمولات / الشروط) */}
            <div className="bg-white rounded-2xl p-1.5 border border-slate-200/90 shadow-2xs grid grid-cols-3 sm:grid-cols-6 gap-1 text-center text-xs font-bold">
              {/* 1. الإحصائيات (الأول بجوار مذيعي ومربوط مع إحصائيات الوكالة) */}
              <button
                onClick={() => setActiveTab('stats')}
                className={`py-2 px-1 rounded-xl transition-all flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
                  activeTab === 'stats'
                    ? 'bg-[#104D5B] text-white font-black shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>الإحصائيات</span>
              </button>

              {/* 2. مذيعي */}
              <button
                onClick={() => setActiveTab('hosts')}
                className={`py-2 px-1 rounded-xl transition-all flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
                  activeTab === 'hosts'
                    ? 'bg-[#104D5B] text-white font-black shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Radio className="w-3.5 h-3.5" />
                <span>مذيعي ({brokerHosts.length})</span>
              </button>

              {/* 3. محفظتي */}
              <button
                onClick={() => setActiveTab('wallet')}
                className={`py-2 px-1 rounded-xl transition-all flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
                  activeTab === 'wallet'
                    ? 'bg-[#104D5B] text-white font-black shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Wallet className="w-3.5 h-3.5" />
                <span>محفظتي</span>
              </button>

              {/* 4. دعوة مذيع */}
              <button
                onClick={() => setActiveTab('invite')}
                className={`py-2 px-1 rounded-xl transition-all flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
                  activeTab === 'invite'
                    ? 'bg-[#104D5B] text-white font-black shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>دعوة مذيع</span>
              </button>

              {/* 5. كشف العمولات */}
              <button
                onClick={() => setActiveTab('earnings')}
                className={`py-2 px-1 rounded-xl transition-all flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
                  activeTab === 'earnings'
                    ? 'bg-[#104D5B] text-white font-black shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>كشف العمولات</span>
              </button>

              {/* 6. شروط الوكالة */}
              <button
                onClick={() => setActiveTab('guidelines')}
                className={`py-2 px-1 rounded-xl transition-all flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
                  activeTab === 'guidelines'
                    ? 'bg-[#104D5B] text-white font-black shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>شروط الوكالة</span>
              </button>
            </div>

            {/* ========================================================= */}
            {/* TAB 0: AGENCY STATS (إحصائيات الوكالة المربوطة بالزر الأول) */}
            {/* ========================================================= */}
            {activeTab === 'stats' && (
              <div className="space-y-3">
                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 bg-white border border-slate-200/80 p-1 rounded-xl text-xs font-bold shadow-2xs">
                  <button
                    onClick={() => setHostFilter('all')}
                    className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                      hostFilter === 'all' 
                        ? 'bg-[#104D5B] text-white shadow-xs font-black' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    الكل ({brokerHosts.length})
                  </button>
                  <button
                    onClick={() => setHostFilter('active')}
                    className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                      hostFilter === 'active' 
                        ? 'bg-emerald-600 text-white shadow-xs font-black' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    النشطين ({brokerHosts.filter(h => !h.isClosed).length})
                  </button>
                  <button
                    onClick={() => setHostFilter('closed')}
                    className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                      hostFilter === 'closed' 
                        ? 'bg-slate-900 text-white shadow-xs font-black' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    التسكيرات ({brokerHosts.filter(h => h.isClosed).length})
                  </button>
                </div>

                {/* بطاقة إحصائيات الوكالة المطابقة للصورة المرفقة */}
                <div className="bg-white rounded-3xl p-5 shadow-[0_2px_14px_rgba(0,0,0,0.04)] border border-slate-200/80 space-y-3" dir="rtl">
                  <div className="text-right">
                    <h3 className="text-sm sm:text-base font-black text-slate-800 tracking-tight">
                      إحصائيات الوكالة
                    </h3>
                  </div>

                  <div className="divide-y divide-slate-100 text-xs sm:text-sm font-bold">
                    {/* 1. إجمالي الماسات لهذا الشهر */}
                    <div className="py-2.5 sm:py-3 flex items-center justify-between">
                      <span className="font-mono font-black text-sm sm:text-base text-slate-900" dir="ltr">
                        779,950
                      </span>
                      <span className="text-slate-600 font-medium">
                        إجمالي الماسات لهذا الشهر
                      </span>
                    </div>

                    {/* 2. حصة الوكالة */}
                    <div className="py-2.5 sm:py-3 flex items-center justify-between">
                      <span className="font-mono font-black text-sm sm:text-base text-slate-900" dir="ltr">
                        50%
                      </span>
                      <span className="text-slate-600 font-medium">
                        حصة الوكالة
                      </span>
                    </div>

                    {/* 3. الماسات لنفس الفترة من الشهر الماضي */}
                    <div className="py-2.5 sm:py-3 flex items-center justify-between">
                      <span className="font-mono font-black text-sm sm:text-base text-slate-900" dir="ltr">
                        50
                      </span>
                      <span className="text-slate-600 font-medium">
                        الماسات لنفس الفترة من الشهر الماضي
                      </span>
                    </div>

                    {/* 4. إجمالي الماسات الشهر الماضي */}
                    <div className="py-2.5 sm:py-3 flex items-center justify-between">
                      <span className="font-mono font-black text-sm sm:text-base text-slate-900" dir="ltr">
                        50
                      </span>
                      <span className="text-slate-600 font-medium">
                        إجمالي الماسات الشهر الماضي
                      </span>
                    </div>

                    {/* 5. مقابل نفس الفترة من الشهر الماضي */}
                    <div className="py-2.5 sm:py-3 flex items-center justify-between">
                      <span className="font-mono font-black text-xs sm:text-sm text-emerald-600" dir="ltr">
                        1,559,800.00%
                      </span>
                      <span className="text-slate-600 font-medium">
                        مقابل نفس الفترة من الشهر الماضي
                      </span>
                    </div>

                    {/* 6. مقابل الشهر الماضي */}
                    <div className="py-2.5 sm:py-3 flex items-center justify-between">
                      <span className="font-mono font-black text-xs sm:text-sm text-emerald-600" dir="ltr">
                        1,559,800.00%
                      </span>
                      <span className="text-slate-600 font-medium">
                        مقابل الشهر الماضي
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB 1: HOSTS LIST (مذيعي التابعين للوسيط) */}
            {/* ========================================================= */}
            {activeTab === 'hosts' && (
              <div className="space-y-3">
                {/* Search & Filter Bar */}
                <div className="space-y-2">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text"
                      value={hostSearchQuery}
                      onChange={(e) => setHostSearchQuery(e.target.value)}
                      placeholder="بحث عن مذيع باسمه أو الـ ID..."
                      className="w-full pl-3 pr-9 py-2.5 bg-white border border-slate-200/90 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-teal-500 shadow-2xs transition-all"
                    />
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1.5 bg-white border border-slate-200/80 p-1 rounded-xl text-xs font-bold shadow-2xs">
                    <button
                      onClick={() => setHostFilter('all')}
                      className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                        hostFilter === 'all' 
                          ? 'bg-[#104D5B] text-white shadow-xs font-black' 
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      الكل ({brokerHosts.length})
                    </button>
                    <button
                      onClick={() => setHostFilter('active')}
                      className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                        hostFilter === 'active' 
                          ? 'bg-emerald-600 text-white shadow-xs font-black' 
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      النشطين ({brokerHosts.filter(h => !h.isClosed).length})
                    </button>
                    <button
                      onClick={() => setHostFilter('closed')}
                      className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                        hostFilter === 'closed' 
                          ? 'bg-slate-900 text-white shadow-xs font-black' 
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      التسكيرات ({brokerHosts.filter(h => h.isClosed).length})
                    </button>
                  </div>
                </div>

                {/* Hosts List */}
                <div className="space-y-3 pt-1">
                  {filteredHosts.map((host) => (
                    <div 
                      key={host.id} 
                      className="bg-white rounded-2xl p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.05)] border border-slate-200/90 space-y-3 relative"
                    >
                      {/* Top Row */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3.5">
                          <img 
                            src={host.avatar} 
                            alt={host.name} 
                            className="w-12 h-12 rounded-full object-cover border border-slate-100 shadow-xs"
                          />
                          <div>
                            <h4 className="text-sm sm:text-base font-black text-slate-900 leading-tight">
                              {host.name}
                            </h4>
                            <span className="text-xs font-mono text-slate-500 font-bold block mt-0.5" dir="ltr">
                              ID: {host.id}
                            </span>
                          </div>
                        </div>

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
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-xs font-black">نشط ويبيث ✓</span>
                          </div>
                        )}
                      </div>

                      {/* Performance Breakdown */}
                      <div className="pt-3 border-t border-slate-100 space-y-2 text-xs font-bold">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600 text-xs">وقت الانضمام للوسيط:</span>
                          <span className="text-slate-800 font-mono text-xs font-bold" dir="ltr">
                            {host.joinDate}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-slate-600 text-xs">الماس المستلم شهرياً:</span>
                          <div className="flex items-center gap-1" dir="ltr">
                            <span className="text-slate-900 font-mono font-black text-sm">
                              {host.diamonds}
                            </span>
                            <span className="text-blue-500 text-xs">💎</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 flex items-center justify-between">
                            <span className="text-slate-600 text-[11px]">مدة البث (الساعات):</span>
                            <span className="text-sky-600 font-black text-xs font-mono">
                              {host.liveDuration}
                            </span>
                          </div>

                          <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 flex items-center justify-between">
                            <span className="text-slate-600 text-[11px]">أيام البث الفعلية:</span>
                            <span className="text-indigo-600 font-black text-xs font-mono">
                              {host.liveDays}
                            </span>
                          </div>
                        </div>

                        {/* Commission highlight for this specific host */}
                        <div className="flex items-center justify-between bg-teal-50/80 border border-teal-200/80 p-2 rounded-xl text-teal-900">
                          <span className="text-[11px] font-bold">عمولة الوسيط المحسوبة من هذا المذيع (15%):</span>
                          <span className="text-xs font-mono font-black text-teal-800">
                            {host.calculatedCommission}
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="pt-1">
                          <div className="flex items-center justify-between text-xs pb-1">
                            <span className="text-slate-500">حالة التارغت:</span>
                            <span className={`font-black ${host.targetAchieved ? 'text-emerald-600' : 'text-amber-600'}`}>
                              {host.completionRate}
                            </span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${host.targetAchieved ? 'bg-emerald-500' : 'bg-amber-500'}`}
                              style={{ width: host.targetAchieved ? '100%' : '75%' }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredHosts.length === 0 && (
                  <div className="text-center py-16 text-slate-400 text-sm font-bold bg-white rounded-2xl border border-dashed border-slate-200">
                    لا يوجد مذيعين يطابقون خيارات البحث المحددة
                  </div>
                )}
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB: WALLET (محفظتي للوسيط) */}
            {/* ========================================================= */}
            {activeTab === 'wallet' && (
              <div className="space-y-4">
                {/* بطاقة رصيد المحفظة الرئيسية */}
                <div className="rounded-3xl bg-white p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-4 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto shadow-xs">
                    <Wallet className="w-7 h-7" />
                  </div>
                  
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-500">رصيد محفظة الوسيط المتاح للسحب</span>
                    <div className="font-mono font-black text-3xl sm:text-4xl text-[#104D5B]">
                      {totalBrokerCommissionUsd}
                    </div>
                    <div className="text-xs font-bold text-teal-700 flex items-center justify-center gap-1">
                      <span>{totalBrokerCommissionDiamonds} ماسة عمولة مستحقة</span>
                      <span>💎</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 pt-2">
                    <button 
                      onClick={() => showToast('جاري استبدال عمولات الماس إلى رصيد نقدي...')}
                      className="py-3 px-3 bg-teal-50 border border-teal-200/80 text-teal-800 rounded-2xl text-xs font-black hover:bg-teal-100/50 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Gem className="w-4 h-4 text-teal-600" />
                      <span>استبدال الماس 💎</span>
                    </button>
                    <button 
                      onClick={() => showToast('تم إرسال طلب سحب العمولات إلى حسابك.')}
                      className="py-3 px-3 bg-[#104D5B] hover:bg-[#0c3d49] text-white rounded-2xl text-xs font-black shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <DollarSign className="w-4 h-4 text-emerald-300" />
                      <span>سحب الأرباح 💳</span>
                    </button>
                  </div>
                </div>

                {/* تفاصيل وحركات المحفظة */}
                <div className="rounded-3xl bg-white p-5 border border-slate-200/90 shadow-sm space-y-3">
                  <h4 className="text-xs font-black text-slate-800 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-teal-600" />
                    <span>سجل حركات عمولات الوساطة</span>
                  </h4>

                  <div className="divide-y divide-slate-100 text-xs font-medium">
                    <div className="py-2.5 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-800 block">عمولة وساطة شهرية (15%)</span>
                        <span className="text-[10px] text-slate-400">اليوم 14:30 • من إنتاج المذيعين</span>
                      </div>
                      <span className="font-mono font-black text-emerald-600 text-xs" dir="ltr">
                        +{totalBrokerCommissionDiamonds} 💎
                      </span>
                    </div>
                    <div className="py-2.5 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-800 block">مكافأة تسكير تارجت المذيعين</span>
                        <span className="text-[10px] text-slate-400">أمس 18:00 • من الوكالة</span>
                      </div>
                      <span className="font-mono font-black text-emerald-600 text-xs" dir="ltr">
                        +50,000 💎
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB 2: INVITE HOST (دعوة واستقطاب مذيع جديد تحت الوسيط) */}
            {/* ========================================================= */}
            {activeTab === 'invite' && (
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-4">
                <div className="text-center space-y-1.5">
                  <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto text-2xl shadow-xs">
                    🎙️
                  </div>
                  <h3 className="text-base font-black text-slate-900">
                    دعوة مذيع جديد للانضمام تحت إشرافك
                  </h3>
                  <p className="text-slate-500 text-xs font-medium">
                    يتم تسجيل المذيع ضمن وكالة <strong className="text-teal-800">{agencyName}</strong> ويُحسب تلقائياً تحت معرف الوسيط الخاص بك.
                  </p>
                </div>

                <form onSubmit={handleSendHostInvite} className="space-y-3.5 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      معرّف المذيع (User ID):
                    </label>
                    <input 
                      type="text"
                      value={inviteHostId}
                      onChange={(e) => setInviteHostId(e.target.value)}
                      placeholder="أدخل معرّف ID المذيع (مثال: 81156183)"
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-center font-mono text-sm font-bold text-slate-900 focus:bg-white focus:border-teal-500 focus:outline-none shadow-xs transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      رسالة ترحيبية / ملاحظة للمذيع (اختياري):
                    </label>
                    <textarea 
                      value={inviteCustomNote}
                      onChange={(e) => setInviteCustomNote(e.target.value)}
                      rows={2}
                      placeholder="يسرني دعوتك للانضمام إلى فريق مذيعي النخبة مع توفير الدعم وساعات البث..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="p-3 bg-teal-50/80 border border-teal-200/80 rounded-2xl space-y-1 text-xs text-teal-900">
                    <div className="font-black flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-teal-600" />
                      <span>مميزات المذيع المنضم عبر الوسيط:</span>
                    </div>
                    <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-0.5 pt-1">
                      <li>تأكيد فوري للعقد الرسمي في الوكالة المعتمدة.</li>
                      <li>متابعة مباشرة لساعات البث والتارغت الشهري.</li>
                      <li>حساب عمولة الوسيط بنسبة {commissionRate} بشكل آلي دون الخصم من أرباح المذيع.</li>
                    </ul>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#104D5B] hover:bg-[#0c3d49] active:scale-98 text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    إرسال دعوة الانضمام الرسمية للمذيع
                  </button>
                </form>
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB 3: COMMISSION & EARNINGS BREAKDOWN (كشف حساب العمولات) */}
            {/* ========================================================= */}
            {activeTab === 'earnings' && (
              <div className="space-y-3.5">
                <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-3.5">
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    <span>كشف حساب عمولات الوساطة لهذا الشهر</span>
                  </h3>

                  <div className="p-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                      <span>إجمالي عمولاتي المستحقة من الوكالة:</span>
                      <span className="text-emerald-700 font-mono font-black text-base">{totalBrokerCommissionDiamonds} 💎</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                      <span>القيمة التقديرية بالدولار:</span>
                      <span className="text-slate-900 font-mono font-black text-sm">{totalBrokerCommissionUsd}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 pt-1 border-t border-emerald-200/60">
                      <span>نسبة العمولة المعتمدة:</span>
                      <span className="text-teal-800 font-mono font-black">{commissionRate}</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <span className="text-slate-700 font-bold block">تفاصيل حسب المذيعين الأعلى إنتاجاً:</span>
                    <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
                      {brokerHosts.slice(0, 5).map(host => (
                        <div key={host.id} className="p-3 flex items-center justify-between hover:bg-slate-50">
                          <div className="flex items-center gap-2.5">
                            <img src={host.avatar} alt={host.name} className="w-8 h-8 rounded-full object-cover" />
                            <div>
                              <span className="text-xs font-black text-slate-900 block">{host.name}</span>
                              <span className="text-[10px] text-slate-400 font-mono">إنتاج: {host.diamonds} 💎</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-mono font-black text-emerald-600 block">{host.calculatedCommission}</span>
                            <span className="text-[9px] text-slate-400">عمولة 15%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB 4: GUIDELINES & POLICY (شروط وتوجيهات الوسيط مع الوكالة) */}
            {/* ========================================================= */}
            {activeTab === 'guidelines' && (
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-4 text-xs">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <ShieldCheck className="w-5 h-5 text-teal-600" />
                  <h3 className="text-sm font-black text-slate-900">
                    لائحة وتوجيهات الوسيط المعتمد من الوكالة
                  </h3>
                </div>

                <div className="space-y-3 text-slate-700 leading-relaxed font-medium text-[11.5px]">
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                    <span className="font-black text-teal-900 text-xs block">1. الصلاحية والتبعية للوكالة المعتمدة</span>
                    <p className="text-slate-600">
                      يعد مركز الوسطاء صلاحية رسمية ممنوحة من قِبل وكالة معتمدة (وكالتي). يلتزم الوسيط بسياسات الوكالة في استقطاب المذيعين وإدارتهم.
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                    <span className="font-black text-emerald-900 text-xs block">2. آلية احتساب ساعات البث والتارغت</span>
                    <p className="text-slate-600">
                      تُحسب إحصائيات المذيعين التابعين للوسيط فورياً، وتُعتمد الساعات والأيام وفق تقارير البث المباشر المعتمدة في النظام.
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                    <span className="font-black text-amber-900 text-xs block">3. آلية استلام العمولات</span>
                    <p className="text-slate-600">
                      تُحول عمولة الوسيط المتفق عليها ({commissionRate}) تلقائياً إلى رصيد محفظة الوسيط مع نهاية كل دورة شهرية.
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BrokerCenterModal;
