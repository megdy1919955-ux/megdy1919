import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  ShieldCheck,
  Building2,
  UserCheck,
  ChevronLeft,
  Search,
  Plus,
  Crown,
  DollarSign,
  TrendingUp,
  Radio,
  Clock,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Lock,
  Unlock,
  Eye,
  Percent,
  X,
  Layers,
  Award,
  ArrowRight
} from 'lucide-react';
import {
  AssignedAdmin,
  AdminRole,
  OfficialAgentItem,
  SubBrokerItem,
  BroadcasterItem,
  getAllAssignedAdmins,
  saveAssignedAdmins,
  assignAdminRole,
  toggleAdminStatus,
  revokeAdminRole,
  getAllOfficialAgents,
  saveOfficialAgents,
  getAgentsForAdmin,
  getAgentByGid,
  getBrokerById,
  addNewAgentToAdmin,
  addNewBrokerToAgent,
  calculateAdminAggregatedStats,
  calculateAgentAggregatedStats,
  calculateBrokerAggregatedStats,
  OWNER_DEV_ID
} from '../lib/adminRoleService';

interface Props {
  onBackToMenu?: () => void;
  showToast: (msg: string) => void;
}

type NavigationLevel = 
  | { type: 'ADMINS_LIST' }
  | { type: 'ADMIN_DETAIL'; adminId: string }
  | { type: 'AGENT_DETAIL'; adminId: string; agencyGid: string }
  | { type: 'BROKER_DETAIL'; adminId: string; agencyGid: string; brokerId: string };

export const ManageAdminsHierarchyView: React.FC<Props> = ({ onBackToMenu, showToast }) => {
  // Navigation State
  const [navLevel, setNavLevel] = useState<NavigationLevel>({ type: 'ADMINS_LIST' });

  // Data States
  const [admins, setAdmins] = useState<AssignedAdmin[]>([]);
  const [officialAgents, setOfficialAgents] = useState<OfficialAgentItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  // Modals
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);
  const [isInviteAgentOpen, setIsInviteAgentOpen] = useState(false);
  const [isAddBrokerOpen, setIsAddBrokerOpen] = useState(false);

  // Form States - Add Admin
  const [newAdminId, setNewAdminId] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminAvatar, setNewAdminAvatar] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<AdminRole>('agency_admin');
  const [newAdminCanInvite, setNewAdminCanInvite] = useState(true);
  const [newAdminTargetAgents, setNewAdminTargetAgents] = useState(10);
  const [newAdminNotes, setNewAdminNotes] = useState('');

  // Form States - Invite Agent
  const [inviteAgentId, setInviteAgentId] = useState('');
  const [inviteAgentName, setInviteAgentName] = useState('');
  const [inviteAgentAvatar, setInviteAgentAvatar] = useState('');
  const [inviteAgencyGid, setInviteAgencyGid] = useState('');
  const [inviteAgencyName, setInviteAgencyName] = useState('');
  const [inviteCountry, setInviteCountry] = useState('المملكة العربية السعودية 🇸🇦');
  const [inviteTargetDiamonds, setInviteTargetDiamonds] = useState(10000000);
  const [inviteCommissionRate, setInviteCommissionRate] = useState(25);

  // Form States - Add Broker
  const [brokerId, setBrokerId] = useState('');
  const [brokerName, setBrokerName] = useState('');
  const [brokerAvatar, setBrokerAvatar] = useState('');
  const [brokerCommission, setBrokerCommission] = useState(15);

  // Load Data
  const refreshData = () => {
    setAdmins(getAllAssignedAdmins());
    setOfficialAgents(getAllOfficialAgents());
  };

  useEffect(() => {
    refreshData();
    window.addEventListener('admin_roles_updated', refreshData);
    window.addEventListener('hierarchical_agents_updated', refreshData);
    return () => {
      window.removeEventListener('admin_roles_updated', refreshData);
      window.removeEventListener('hierarchical_agents_updated', refreshData);
    };
  }, []);

  // Handlers
  const handleAssignAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminId.trim() || !newAdminName.trim()) {
      showToast('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    assignAdminRole({
      id: newAdminId.trim(),
      name: newAdminName.trim(),
      avatar: newAdminAvatar.trim() || undefined,
      role: newAdminRole,
      notes: newAdminNotes.trim() || 'تم التعيين عبر لوحة السوبر أدمن'
    });

    // Update in list
    const updated = getAllAssignedAdmins().map((a) => {
      if (a.id === newAdminId.trim()) {
        return {
          ...a,
          canInviteAgents: newAdminCanInvite,
          monthlyTargetAgents: newAdminTargetAgents
        };
      }
      return a;
    });
    saveAssignedAdmins(updated);

    showToast(`تم منح الصلاحية بنجاح لـ ${newAdminName}`);
    setIsAddAdminOpen(false);
    setNewAdminId('');
    setNewAdminName('');
    setNewAdminAvatar('');
    setNewAdminNotes('');
    refreshData();
  };

  const handleInviteAgentSubmit = (e: React.FormEvent, supervisorId: string) => {
    e.preventDefault();
    if (!inviteAgentId.trim() || !inviteAgentName.trim() || !inviteAgencyGid.trim() || !inviteAgencyName.trim()) {
      showToast('يرجى إكمال بيانات الوكيل والوكالة');
      return;
    }

    addNewAgentToAdmin({
      adminSupervisorId: supervisorId,
      applicantId: inviteAgentId.trim(),
      applicantName: inviteAgentName.trim(),
      applicantAvatar: inviteAgentAvatar.trim() || undefined,
      agencyGid: inviteAgencyGid.trim(),
      agencyName: inviteAgencyName.trim(),
      country: inviteCountry,
      monthlyTargetDiamonds: Number(inviteTargetDiamonds) || 5000000,
      agentCommissionRate: Number(inviteCommissionRate) || 25
    });

    showToast(`تم توثيق وكالة ${inviteAgencyName} وتعيين الوكيل بنجاح`);
    setIsInviteAgentOpen(false);
    setInviteAgentId('');
    setInviteAgentName('');
    setInviteAgentAvatar('');
    setInviteAgencyGid('');
    setInviteAgencyName('');
    refreshData();
  };

  const handleAddBrokerSubmit = (e: React.FormEvent, agencyGid: string) => {
    e.preventDefault();
    if (!brokerId.trim() || !brokerName.trim()) {
      showToast('يرجى إدخال معرّف واسم منسق الوكالات');
      return;
    }

    const res = addNewBrokerToAgent(agencyGid, {
      brokerId: brokerId.trim(),
      brokerName: brokerName.trim(),
      brokerAvatar: brokerAvatar.trim() || undefined,
      commissionRate: Number(brokerCommission) || 15
    });

    if (res) {
      showToast(`تم تعيين منسق الوكالات ${brokerName} بنجاح`);
      setIsAddBrokerOpen(false);
      setBrokerId('');
      setBrokerName('');
      setBrokerAvatar('');
      refreshData();
    } else {
      showToast('فشل إضافة منسق الوكالات، تأكد من صحة رقم الوكالة');
    }
  };

  // Filtered Admins
  const filteredAdmins = admins.filter((admin) => {
    const matchesSearch = 
      admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || admin.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Current entity lookups based on navigation
  const currentAdminId = navLevel.type !== 'ADMINS_LIST' ? navLevel.adminId : null;
  const currentAdmin = currentAdminId ? admins.find((a) => a.id.toUpperCase() === currentAdminId.toUpperCase()) : null;
  const currentAdminStats = currentAdminId ? calculateAdminAggregatedStats(currentAdminId) : null;

  const currentAgencyGid = (navLevel.type === 'AGENT_DETAIL' || navLevel.type === 'BROKER_DETAIL') ? navLevel.agencyGid : null;
  const currentAgentStats = currentAgencyGid ? calculateAgentAggregatedStats(currentAgencyGid) : null;

  const currentBrokerId = navLevel.type === 'BROKER_DETAIL' ? navLevel.brokerId : null;
  const currentBrokerStats = currentBrokerId ? calculateBrokerAggregatedStats(currentBrokerId) : null;

  return (
    <div className="space-y-6 text-right select-none" dir="rtl">
      
      {/* ========================================================================= */}
      {/* 1. TOP BREADCRUMB & LEVEL NAVIGATION BAR */}
      {/* ========================================================================= */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-xl flex flex-wrap items-center justify-between gap-3 backdrop-blur-md">
        
        {/* Breadcrumb Trail */}
        <div className="flex items-center flex-wrap gap-2 text-xs font-bold">
          <button
            onClick={() => setNavLevel({ type: 'ADMINS_LIST' })}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              navLevel.type === 'ADMINS_LIST'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>طاقم الإداريين</span>
          </button>

          {navLevel.type !== 'ADMINS_LIST' && currentAdmin && (
            <>
              <ChevronLeft className="w-4 h-4 text-slate-500 rotate-180" />
              <button
                onClick={() => setNavLevel({ type: 'ADMIN_DETAIL', adminId: currentAdmin.id })}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  navLevel.type === 'ADMIN_DETAIL'
                    ? 'bg-blue-500 text-white font-black shadow-md shadow-blue-500/20'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <img
                  src={currentAdmin.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'}
                  alt={currentAdmin.name}
                  className="w-4 h-4 rounded-full object-cover border border-white/40"
                />
                <span>{currentAdmin.name}</span>
                <span className="text-[10px] opacity-75">({currentAdmin.id})</span>
              </button>
            </>
          )}

          {(navLevel.type === 'AGENT_DETAIL' || navLevel.type === 'BROKER_DETAIL') && currentAgentStats?.agent && (
            <>
              <ChevronLeft className="w-4 h-4 text-slate-500 rotate-180" />
              <button
                onClick={() => setNavLevel({ type: 'AGENT_DETAIL', adminId: navLevel.adminId, agencyGid: currentAgentStats.agent!.agencyGid })}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  navLevel.type === 'AGENT_DETAIL'
                    ? 'bg-emerald-500 text-white font-black shadow-md shadow-emerald-500/20'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>{currentAgentStats.agent.agencyName}</span>
                <span className="text-[10px] opacity-80">GID: {currentAgentStats.agent.agencyGid}</span>
              </button>
            </>
          )}

          {navLevel.type === 'BROKER_DETAIL' && currentBrokerStats?.broker && (
            <>
              <ChevronLeft className="w-4 h-4 text-slate-500 rotate-180" />
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500 text-white font-black shadow-md shadow-purple-500/20">
                <UserCheck className="w-3.5 h-3.5" />
                <span>منسق الوكالات: {currentBrokerStats.broker.name}</span>
              </div>
            </>
          )}
        </div>

        {/* Back Step Button */}
        {navLevel.type !== 'ADMINS_LIST' && (
          <button
            onClick={() => {
              if (navLevel.type === 'BROKER_DETAIL') {
                setNavLevel({ type: 'AGENT_DETAIL', adminId: navLevel.adminId, agencyGid: navLevel.agencyGid });
              } else if (navLevel.type === 'AGENT_DETAIL') {
                setNavLevel({ type: 'ADMIN_DETAIL', adminId: navLevel.adminId });
              } else {
                setNavLevel({ type: 'ADMINS_LIST' });
              }
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>رجوع خطوة</span>
          </button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. LEVEL 1: ALL ADMINS LIST & ADD ADMIN ACTION */}
      {/* ========================================================================= */}
      {navLevel.type === 'ADMINS_LIST' && (
        <div className="space-y-5">
          
          {/* Header Bar with Action & Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <span>قائمة الإداريين وطاقم الإشراف</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                اضغط على صورة أو اسم أي إداري لمتابعة وكالاته وإحصائياته الهرمية
              </p>
            </div>

            <button
              onClick={() => setIsAddAdminOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إعطاء صلاحية لإداري جديد</span>
            </button>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="ابحث بالاسم أو معرف الإداري (ID)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-800 focus:border-amber-500/50 rounded-xl pr-10 pl-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-all"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-slate-900/80 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2.5 outline-none cursor-pointer"
            >
              <option value="all">جميع الأدوار</option>
              <option value="agency_admin">مدير وكالات (Agency Manager)</option>
              <option value="moderator">مراقب عام (Moderator)</option>
              <option value="theme_admin">مدير المتجر والثيمات</option>
              <option value="super_admin">سوبر أدمن</option>
            </select>
          </div>

          {/* Admins Grid / Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAdmins.map((admin) => {
              const isOwner = admin.id.toUpperCase() === OWNER_DEV_ID;
              const stats = calculateAdminAggregatedStats(admin.id);

              return (
                <motion.div
                  key={admin.id}
                  whileHover={{ y: -2 }}
                  className="bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-4 shadow-lg transition-all group flex flex-col justify-between gap-4"
                >
                  {/* Top Part: Clickable Avatar & Info */}
                  <div className="flex items-start justify-between gap-3">
                    <div
                      onClick={() => setNavLevel({ type: 'ADMIN_DETAIL', adminId: admin.id })}
                      className="flex items-center gap-3 cursor-pointer group/avatar flex-1"
                    >
                      <div className="relative">
                        <img
                          src={admin.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'}
                          alt={admin.name}
                          className="w-13 h-13 rounded-2xl object-cover border-2 border-slate-700 group-hover/avatar:border-amber-400 transition-all shadow-md"
                        />
                        {isOwner && (
                          <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-[10px] shadow-sm">
                            👑
                          </div>
                        )}
                        <span className={`absolute -bottom-1 -left-1 w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${
                          admin.status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'
                        }`} />
                      </div>

                      <div>
                        <h3 className="text-sm font-black text-white group-hover/avatar:text-amber-300 transition-colors flex items-center gap-2">
                          <span>{admin.name}</span>
                          {isOwner && <span className="text-[10px] text-amber-400 font-mono font-normal">(ROOT)</span>}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 font-mono text-xs text-slate-400">
                          <span>ID: {admin.id}</span>
                          <span className="text-slate-600">•</span>
                          <span className="text-[11px] text-amber-400/90 font-sans">
                            {admin.role === 'super_admin' ? 'مالك ومطور 👑' :
                             admin.role === 'agency_admin' ? 'مدير وكالات 🏛️' :
                             admin.role === 'moderator' ? 'مراقب عام 🛡️' :
                             admin.role === 'theme_admin' ? 'مدير ثيمات 🎨' : admin.role}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status badge */}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      admin.status === 'active'
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                        : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                    }`}>
                      {admin.status === 'active' ? 'نشط' : 'معلق'}
                    </span>
                  </div>

                  {/* Middle Summary Stats (Hierarchy Preview) */}
                  <div
                    onClick={() => setNavLevel({ type: 'ADMIN_DETAIL', adminId: admin.id })}
                    className="bg-slate-950/70 rounded-xl p-3 border border-slate-800/80 cursor-pointer hover:bg-slate-900/60 transition-colors"
                  >
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block">الوكلاء تحته</span>
                        <span className="font-bold font-mono text-white text-sm">
                          {stats.totalAgents} وكيل
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">المنسقين</span>
                        <span className="font-bold font-mono text-purple-400 text-sm">
                          {stats.totalBrokers} منسق
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">إجمالي الدخل</span>
                        <span className="font-bold font-mono text-emerald-400 text-sm">
                          ${(stats.totalRevenueUsd).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
                    <button
                      onClick={() => setNavLevel({ type: 'ADMIN_DETAIL', adminId: admin.id })}
                      className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer transition-colors text-[11px]"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>عرض التتبع الهرمي والوكلاء</span>
                    </button>

                    {!isOwner && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            toggleAdminStatus(admin.id);
                            showToast('تم تعديل حالة الإداري');
                            refreshData();
                          }}
                          className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg transition-colors cursor-pointer"
                          title={admin.status === 'active' ? 'تجميد الصلاحية' : 'تفعيل الصلاحية'}
                        >
                          {admin.status === 'active' ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5 text-emerald-400" />}
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`هل أنت متأكد من سحب الصلاحية الإدارية من ${admin.name}؟`)) {
                              revokeAdminRole(admin.id);
                              showToast('تم سحب الصلاحية الإدارية');
                              refreshData();
                            }
                          }}
                          className="p-1.5 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 rounded-lg transition-colors cursor-pointer"
                          title="سحب الصلاحية نهائياً"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. LEVEL 2: ADMIN DETAIL & HIS OFFICIAL AGENTS */}
      {/* ========================================================================= */}
      {navLevel.type === 'ADMIN_DETAIL' && currentAdmin && currentAdminStats && (
        <div className="space-y-6">
          
          {/* Admin Profile Overview Card */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
              
              {/* Avatar + Admin Info */}
              <div className="flex items-center gap-4">
                <img
                  src={currentAdmin.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'}
                  alt={currentAdmin.name}
                  className="w-18 h-18 sm:w-20 sm:h-20 rounded-3xl object-cover border-2 border-amber-500/40 shadow-xl"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-black text-white">{currentAdmin.name}</h2>
                    <span className="text-xs bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-bold">
                      {currentAdmin.role === 'super_admin' ? 'المالك العام 👑' : 'مدير وكالات معتمد 🏛️'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono mt-1">
                    معرف المستخدم (ID): <span className="text-amber-400 font-bold">{currentAdmin.id}</span>
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    تاريخ التعيين: {currentAdmin.assignedAt} • عُيّن بواسطة: {currentAdmin.assignedBy}
                  </p>
                </div>
              </div>

              {/* Action Button: Invite New Official Agent */}
              <div className="flex items-center gap-3 w-full md:w-auto">
                <button
                  onClick={() => setIsInviteAgentOpen(true)}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-black text-xs rounded-2xl shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ دعوة وكيل رسمي جديد تحت إدارته</span>
                </button>
              </div>
            </div>

            {/* Performance Statistics Grid for This Admin */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
              <div className="bg-slate-950/60 rounded-2xl p-3.5 border border-slate-800">
                <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>الوكالات المعتمدة</span>
                </span>
                <span className="text-lg font-black font-mono text-white block mt-1">
                  {currentAdminStats.totalAgents} وكالة
                </span>
              </div>

              <div className="bg-slate-950/60 rounded-2xl p-3.5 border border-slate-800">
                <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-purple-400" />
                  <span>إجمالي منسقي الوكالات</span>
                </span>
                <span className="text-lg font-black font-mono text-purple-300 block mt-1">
                  {currentAdminStats.totalBrokers} منسق
                </span>
              </div>

              <div className="bg-slate-950/60 rounded-2xl p-3.5 border border-slate-800">
                <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-pink-400" />
                  <span>إجمالي المذيعين</span>
                </span>
                <span className="text-lg font-black font-mono text-pink-300 block mt-1">
                  {currentAdminStats.totalBroadcasters} مذيع
                </span>
              </div>

              <div className="bg-slate-950/60 rounded-2xl p-3.5 border border-slate-800">
                <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  <span>إجمالي دخل الوكالات</span>
                </span>
                <span className="text-lg font-black font-mono text-emerald-400 block mt-1">
                  ${currentAdminStats.totalRevenueUsd.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Section: Official Agents List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-400" />
                <span>الوكلاء الرسميون المسجلون تحت هذا الإداري ({currentAdminStats.agents.length})</span>
              </h3>
              <span className="text-xs text-slate-400">
                اضغط على صورة أو اسم أي وكيل للاطلاع على المنسقين وإحصائياته
              </span>
            </div>

            {currentAdminStats.agents.length === 0 ? (
              <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-3xl p-8 text-center text-slate-400">
                <Building2 className="w-10 h-10 mx-auto text-slate-600 mb-2" />
                <p className="text-xs">لا يوجد وكلاء رسميون مسجلون تحت هذا الإداري بعد</p>
                <button
                  onClick={() => setIsInviteAgentOpen(true)}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs text-amber-400 font-bold hover:underline cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>دعوة أول وكيل رسمي الآن</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentAdminStats.agents.map((agent) => (
                  <motion.div
                    key={agent.agencyGid}
                    whileHover={{ y: -2 }}
                    onClick={() => setNavLevel({ type: 'AGENT_DETAIL', adminId: currentAdmin.id, agencyGid: agent.agencyGid })}
                    className="bg-slate-900/90 border border-slate-800 hover:border-blue-500/50 rounded-2xl p-4 shadow-lg transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={agent.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200'}
                          alt={agent.name}
                          className="w-13 h-13 rounded-2xl object-cover border border-slate-700 group-hover:border-blue-400 transition-all shadow-md"
                        />
                        <div>
                          <h4 className="text-sm font-black text-white group-hover:text-blue-300 transition-colors">
                            {agent.agencyName}
                          </h4>
                          <p className="text-xs text-slate-300 font-medium mt-0.5">
                            الوكيل: <span className="text-amber-300 font-bold">{agent.name}</span>
                          </p>
                          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400 mt-1">
                            <span className="text-blue-400 font-bold">GID: {agent.agencyGid}</span>
                            <span>•</span>
                            <span>{agent.country}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-left">
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                          دخل: ${(agent.monthlyRevenueUsd).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Agent Sub Stats */}
                    <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800/80 text-center text-xs bg-slate-950/60 rounded-xl p-2.5">
                      <div>
                        <span className="text-[10px] text-slate-400 block">المنسقين</span>
                        <span className="font-bold font-mono text-white text-xs">{agent.brokersList?.length || 0} منسق</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">المذيعين</span>
                        <span className="font-bold font-mono text-purple-300 text-xs">{agent.totalBroadcasters} مذيع</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">الألماسات</span>
                        <span className="font-bold font-mono text-emerald-400 text-xs">{(agent.totalDiamondsGenerated / 1000000).toFixed(1)}M 💎</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. LEVEL 3: AGENT DETAIL & HIS SUB-AGENTS / BROKERS */}
      {/* ========================================================================= */}
      {navLevel.type === 'AGENT_DETAIL' && currentAgentStats && currentAgentStats.agent && (
        <div className="space-y-6">
          {(() => {
            const agent = currentAgentStats.agent;
            return (
              <>
                {/* Agency Master Banner */}
                <div className="bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
                  <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                    
                    <div className="flex items-center gap-4">
                      <img
                        src={agent.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200'}
                        alt={agent.name}
                        className="w-18 h-18 sm:w-20 sm:h-20 rounded-3xl object-cover border-2 border-emerald-500/40 shadow-xl"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-lg sm:text-xl font-black text-white">{agent.agencyName}</h2>
                          <span className="text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold">
                            وكالة موثقة ✅
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1">
                          الوكيل المعتمد: <span className="text-amber-400 font-bold">{agent.name}</span> (ID: {agent.id})
                        </p>
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                          رقم الوكالة: <span className="text-blue-400 font-bold">GID {agent.agencyGid}</span> • {agent.country}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsAddBrokerOpen(true)}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-black text-xs rounded-2xl shadow-lg shadow-purple-500/25 transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ إضافة منسق وكالات جديد</span>
                    </button>
                  </div>

                  {/* Financial & Activity Stats for this Agency */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
                    <div className="bg-slate-950/60 rounded-2xl p-3.5 border border-slate-800">
                      <span className="text-[11px] text-slate-400 block">إجمالي الدخل الشامل</span>
                      <span className="text-lg font-black font-mono text-emerald-400 block mt-1">
                        ${currentAgentStats.monthlyRevenueUsd.toLocaleString()}
                      </span>
                    </div>

                    <div className="bg-slate-950/60 rounded-2xl p-3.5 border border-slate-800">
                      <span className="text-[11px] text-slate-400 block">صافي أرباح الوكيل</span>
                      <span className="text-lg font-black font-mono text-amber-400 block mt-1">
                        ${currentAgentStats.netCommissionUsd.toLocaleString()}
                      </span>
                    </div>

                    <div className="bg-slate-950/60 rounded-2xl p-3.5 border border-slate-800">
                      <span className="text-[11px] text-slate-400 block">عدد المنسقين النشطين</span>
                      <span className="text-lg font-black font-mono text-purple-300 block mt-1">
                        {currentAgentStats.totalBrokers} منسق
                      </span>
                    </div>

                    <div className="bg-slate-950/60 rounded-2xl p-3.5 border border-slate-800">
                      <span className="text-[11px] text-slate-400 block">إجمالي المذيعين</span>
                      <span className="text-lg font-black font-mono text-pink-300 block mt-1">
                        {currentAgentStats.totalBroadcasters} مذيع
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sub-Agents / Brokers List */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-white flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-purple-400" />
                      <span>منسقو الوكالات المعتمدون ({agent.brokersList?.length || 0})</span>
                    </h3>
                    <span className="text-xs text-slate-400">
                      اضغط على صورة أو اسم المنسق لرؤية حجم شغله والمذيعين تحته
                    </span>
                  </div>

                  {(!agent.brokersList || agent.brokersList.length === 0) ? (
                    <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-3xl p-8 text-center text-slate-400">
                      <UserCheck className="w-10 h-10 mx-auto text-slate-600 mb-2" />
                      <p className="text-xs">لا يوجد منسقون مسجلون في هذه الوكالة حتى الآن</p>
                      <button
                        onClick={() => setIsAddBrokerOpen(true)}
                        className="mt-3 inline-flex items-center gap-1.5 text-xs text-purple-400 font-bold hover:underline cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>إضافة أول منسق وكالات الآن</span>
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {agent.brokersList.map((broker) => (
                        <motion.div
                          key={broker.id}
                          whileHover={{ y: -2 }}
                          onClick={() => setNavLevel({ 
                            type: 'BROKER_DETAIL', 
                            adminId: navLevel.adminId, 
                            agencyGid: agent.agencyGid, 
                            brokerId: broker.id 
                          })}
                          className="bg-slate-900/90 border border-slate-800 hover:border-purple-500/50 rounded-2xl p-4 shadow-lg transition-all cursor-pointer group"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={broker.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'}
                                alt={broker.name}
                                className="w-13 h-13 rounded-2xl object-cover border border-slate-700 group-hover:border-purple-400 transition-all shadow-md"
                              />
                              <div>
                                <h4 className="text-sm font-black text-white group-hover:text-purple-300 transition-colors">
                                  {broker.name}
                                </h4>
                                <p className="text-xs text-slate-400 font-mono mt-0.5">
                                  ID: <span className="text-amber-400 font-bold">{broker.id}</span>
                                </p>
                                <p className="text-[11px] text-slate-500 mt-1">
                                  تاريخ التكليف: {broker.joinedDate}
                                </p>
                              </div>
                            </div>

                            <div className="text-left">
                              <span className="text-[10px] bg-purple-500/10 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full font-bold">
                                عمولته: ${broker.brokerEarnings.toLocaleString()}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-800/80 text-center text-xs bg-slate-950/60 rounded-xl p-2.5">
                            <div>
                              <span className="text-[10px] text-slate-400 block">المذيعين المستقطبين</span>
                              <span className="font-bold font-mono text-white text-xs">{broker.recruitedBroadcastersCount} مذيع</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 block">مساهمته في الوكالة</span>
                              <span className="font-bold font-mono text-emerald-400 text-xs">{(broker.totalAgencyContribution / 1000000).toFixed(1)}M 💎</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            );
          })()}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. LEVEL 4: BROKER DETAIL & FULL WORKLOAD / STATS */}
      {/* ========================================================================= */}
      {navLevel.type === 'BROKER_DETAIL' && currentBrokerStats && currentBrokerStats.broker && (
        <div className="space-y-6">
          {(() => {
            const broker = currentBrokerStats.broker;
            return (
              <>
                {/* Broker Header Card */}
                <div className="bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
                  <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                    
                    <div className="flex items-center gap-4">
                      <img
                        src={broker.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'}
                        alt={broker.name}
                        className="w-18 h-18 sm:w-20 sm:h-20 rounded-3xl object-cover border-2 border-purple-500/40 shadow-xl"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-lg sm:text-xl font-black text-white">{broker.name}</h2>
                          <span className="text-xs bg-purple-500/10 text-purple-300 border border-purple-500/30 px-2.5 py-0.5 rounded-full font-bold">
                            منسق وكالات معتمد 🌟
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1">
                          تابع لوكالة: <span className="text-amber-400 font-bold">{broker.agencyName}</span> (GID: {broker.agencyGid})
                        </p>
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                          معرف المنسق: <span className="text-blue-400 font-bold">{broker.id}</span> • نسبة العمولة: {broker.commissionRate}%
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Broker Performance Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
                    <div className="bg-slate-950/60 rounded-2xl p-3.5 border border-slate-800">
                      <span className="text-[11px] text-slate-400 block">إجمالي مساهمته بالوكالة</span>
                      <span className="text-lg font-black font-mono text-emerald-400 block mt-1">
                        {(broker.totalAgencyContribution / 1000000).toFixed(2)}M 💎
                      </span>
                    </div>

                    <div className="bg-slate-950/60 rounded-2xl p-3.5 border border-slate-800">
                      <span className="text-[11px] text-slate-400 block">صافي أرباح المنسق</span>
                      <span className="text-lg font-black font-mono text-amber-400 block mt-1">
                        ${broker.brokerEarnings.toLocaleString()}
                      </span>
                    </div>

                    <div className="bg-slate-950/60 rounded-2xl p-3.5 border border-slate-800">
                      <span className="text-[11px] text-slate-400 block">المذيعين المستقطبين</span>
                      <span className="text-lg font-black font-mono text-purple-300 block mt-1">
                        {broker.recruitedBroadcastersCount} مذيع
                      </span>
                    </div>

                    <div className="bg-slate-950/60 rounded-2xl p-3.5 border border-slate-800">
                      <span className="text-[11px] text-slate-400 block">ساعات البث الإجمالية</span>
                      <span className="text-lg font-black font-mono text-pink-300 block mt-1">
                        {currentBrokerStats.totalStreamHours} ساعة ⏱️
                      </span>
                    </div>
                  </div>
                </div>

                {/* Broadcaster Roster Under This Broker */}
                <div className="space-y-4">
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <Radio className="w-4 h-4 text-pink-400" />
                    <span>قائمة المذيعين التابعين لهذا المنسق ({currentBrokerStats.broadcastersList.length})</span>
                  </h3>

                  {currentBrokerStats.broadcastersList.length === 0 ? (
                    <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-3xl p-8 text-center text-slate-400 text-xs">
                      لا يوجد مذيعون مسجلون تحت هذا المنسق حتى الآن
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {currentBrokerStats.broadcastersList.map((br) => (
                        <div
                          key={br.id}
                          className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-md"
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <img
                                src={br.avatar}
                                alt={br.name}
                                className="w-11 h-11 rounded-xl object-cover border border-slate-700"
                              />
                              {br.status === 'live' && (
                                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                                  <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
                                </span>
                              )}
                            </div>
                            <div>
                              <h5 className="text-xs font-bold text-white">{br.name}</h5>
                              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                                {br.streamHours} ساعة بث
                              </p>
                            </div>
                          </div>

                          <div className="text-left">
                            <span className="text-xs font-mono font-bold text-emerald-400 block">
                              {(br.diamondsEarned / 1000).toFixed(0)}k 💎
                            </span>
                            <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                              br.status === 'live' ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-800 text-slate-400'
                            }`}>
                              {br.status === 'live' ? 'مباشر الآن' : 'غير متصل'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            );
          })()}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: ADD / ASSIGN ADMIN ROLE */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isAddAdminOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 text-right shadow-2xl space-y-4"
              dir="rtl"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                  <span>منح صلاحية إدارية جديدة</span>
                </h3>
                <button
                  onClick={() => setIsAddAdminOpen(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAssignAdminSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    معرف المستخدم (User ID) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: AG9901 أو 994012"
                    value={newAdminId}
                    onChange={(e) => setNewAdminId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    اسم الإداري / اللقب *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: سالم الكعبي (مدير الوكالات)"
                    value={newAdminName}
                    onChange={(e) => setNewAdminName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    رابط الصورة الشخصية (اختياري)
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newAdminAvatar}
                    onChange={(e) => setNewAdminAvatar(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    الدور الإداري الممنوح
                  </label>
                  <select
                    value={newAdminRole}
                    onChange={(e) => setNewAdminRole(e.target.value as AdminRole)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="agency_admin">مدير الوكالات (Agency Manager) - يتيح دعوة وكلاء ومتابعة أدائهم</option>
                    <option value="moderator">المراقب العام (General Moderator)</option>
                    <option value="theme_admin">مدير الثيمات والمتجر (Store & Themes)</option>
                  </select>
                </div>

                {/* Option to permit inviting official agents */}
                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">صلاحية دعوة وكلاء رسميين</span>
                    <span className="text-[11px] text-slate-400">تمنح الإداري حق استقطاب واعتماد وكلاء جدد تحت إدارته</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={newAdminCanInvite}
                    onChange={(e) => setNewAdminCanInvite(e.target.checked)}
                    className="w-4 h-4 accent-amber-500 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    ملاحظات الصلاحية
                  </label>
                  <textarea
                    rows={2}
                    placeholder="مثال: مسؤول وكالات الخليج والشرق الأوسط..."
                    value={newAdminNotes}
                    onChange={(e) => setNewAdminNotes(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 outline-none focus:border-amber-500 resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsAddAdminOpen(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg cursor-pointer"
                  >
                    تأكيد ومنح الصلاحية
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 2: INVITE / ADD OFFICIAL AGENT UNDER ADMIN */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isInviteAgentOpen && currentAdmin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 text-right shadow-2xl space-y-4"
              dir="rtl"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-400" />
                    <span>دعوة وتوثيق وكيل رسمي جديد</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    تحت إشراف الإداري: <span className="text-amber-400 font-bold">{currentAdmin.name}</span>
                  </p>
                </div>
                <button
                  onClick={() => setIsInviteAgentOpen(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={(e) => handleInviteAgentSubmit(e, currentAdmin.id)} className="space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      معرف الوكيل (User ID) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: 30032"
                      value={inviteAgentId}
                      onChange={(e) => setInviteAgentId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      اسم الوكيل *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: فهد العتيبي"
                      value={inviteAgentName}
                      onChange={(e) => setInviteAgentName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      رقم الوكالة (Agency GID) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: 30032"
                      value={inviteAgencyGid}
                      onChange={(e) => setInviteAgencyGid(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      اسم الوكالة الرسمي *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: وكالة الأساطير الذهبية"
                      value={inviteAgencyName}
                      onChange={(e) => setInviteAgencyName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      الدولة / المنطقة
                    </label>
                    <input
                      type="text"
                      value={inviteCountry}
                      onChange={(e) => setInviteCountry(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      نسبة عمولة الوكيل (%)
                    </label>
                    <input
                      type="number"
                      min="5"
                      max="50"
                      value={inviteCommissionRate}
                      onChange={(e) => setInviteCommissionRate(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    رابط صورة الوكيل (اختياري)
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={inviteAgentAvatar}
                    onChange={(e) => setInviteAgentAvatar(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsInviteAgentOpen(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs rounded-xl shadow-lg cursor-pointer"
                  >
                    توثيق الوكالة وتعيين الوكيل
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 3: ADD BROKER UNDER AGENCY */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isAddBrokerOpen && currentAgentStats?.agent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 text-right shadow-2xl space-y-4"
              dir="rtl"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-purple-400" />
                    <span>إضافة منسق وكالات معتمد جديد</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    تحت وكالة: <span className="text-emerald-400 font-bold">{currentAgentStats.agent.agencyName}</span> (GID: {currentAgentStats.agent.agencyGid})
                  </p>
                </div>
                <button
                  onClick={() => setIsAddBrokerOpen(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={(e) => handleAddBrokerSubmit(e, currentAgentStats.agent!.agencyGid)} className="space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      معرف المنسق (User ID) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: 994012"
                      value={brokerId}
                      onChange={(e) => setBrokerId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      اسم منسق الوكالات *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: ماجد بن خالد"
                      value={brokerName}
                      onChange={(e) => setBrokerName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    نسبة عمولة المنسق (%)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="30"
                    value={brokerCommission}
                    onChange={(e) => setBrokerCommission(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    رابط صورة المنسق (اختياري)
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={brokerAvatar}
                    onChange={(e) => setBrokerAvatar(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 outline-none focus:border-purple-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsAddBrokerOpen(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-black text-xs rounded-xl shadow-lg cursor-pointer"
                  >
                    اعتماد وتعيين المنسق
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
