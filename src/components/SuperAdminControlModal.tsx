import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Crown, 
  Key, 
  Building2, 
  Palette, 
  Shield, 
  BarChart3, 
  ArrowLeft,
  ChevronLeft,
  Search, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Users, 
  Sparkles, 
  Lock, 
  Unlock, 
  Eye, 
  DollarSign, 
  TrendingUp, 
  FileText, 
  ShoppingBag, 
  Car, 
  MessageSquare, 
  Award, 
  Calendar, 
  AlertTriangle, 
  Radio, 
  Plus,
  ArrowRightLeft,
  Check,
  Send,
  Zap,
  Globe,
  Sliders
} from 'lucide-react';
import { 
  AdminRole, 
  AssignedAdmin, 
  getAllAssignedAdmins, 
  assignAdminRole, 
  revokeAdminRole, 
  toggleAdminStatus, 
  subscribeToAdminRoles, 
  OWNER_DEV_ID,
  setTestingUserId,
  AgencyApplication,
  getAgencyRequests,
  approveAgencyRequest,
  rejectAgencyRequest,
  StoreItemEntity,
  getStoreItems,
  saveStoreItem,
  deleteStoreItem,
  AuditLogEntry,
  getAuditLogs,
  logAuditEvent,
  getModerationReports,
  resolveModerationReport,
  ModerationReport
} from '../lib/adminRoleService';
import { ManageAdminsHierarchyView } from './ManageAdminsHierarchyView';
import { OfficialAgenciesManagement } from './OfficialAgenciesManagement';

interface SuperAdminControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId: string;
  onOpenAgencyModal?: () => void;
  onOpenThemeModal?: () => void;
  onOpenModeratorModal?: () => void;
}

type ActiveSection = 
  | 'menu_hub'
  | 'master_dashboard'
  | 'manage_admins'
  | 'manage_agencies'
  | 'manage_store_themes'
  | 'security_audit'
  | 'system_analytics';

export const SuperAdminControlModal: React.FC<SuperAdminControlModalProps> = ({
  isOpen,
  onClose,
  currentUserId,
  onOpenAgencyModal,
  onOpenThemeModal,
  onOpenModeratorModal
}) => {
  const [activeSection, setActiveSection] = useState<ActiveSection>('manage_agencies');

  // Data states
  const [adminsList, setAdminsList] = useState<AssignedAdmin[]>([]);
  const [agencyRequests, setAgencyRequests] = useState<AgencyApplication[]>([]);
  const [storeItems, setStoreItems] = useState<StoreItemEntity[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [reportsList, setReportsList] = useState<ModerationReport[]>([]);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [adminRoleFilter, setAdminRoleFilter] = useState<string>('all');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // New Admin Form
  const [newUserId, setNewUserId] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState<AdminRole>('agency_admin');
  const [newUserAgencyGid, setNewUserAgencyGid] = useState('');
  const [newUserAgencyName, setNewUserAgencyName] = useState('');
  const [newUserExpiresAt, setNewUserExpiresAt] = useState('');
  const [newUserNotes, setNewUserNotes] = useState('');

  // New Store Item Form
  const [showAddStoreModal, setShowAddStoreModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<'badge' | 'frame' | 'bubble' | 'vehicle'>('badge');
  const [newItemPrice, setNewItemPrice] = useState('5000');
  const [newItemDuration, setNewItemDuration] = useState('30');
  const [newItemIcon, setNewItemIcon] = useState('👑');
  const [newItemRarity, setNewItemRarity] = useState<'common' | 'rare' | 'epic' | 'legendary'>('rare');

  // Broadcast state
  const [broadcastMsg, setBroadcastMsg] = useState('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const loadAllData = () => {
    setAdminsList(getAllAssignedAdmins());
    setAgencyRequests(getAgencyRequests());
    setStoreItems(getStoreItems());
    setAuditLogs(getAuditLogs());
    setReportsList(getModerationReports());
  };

  useEffect(() => {
    if (isOpen) {
      loadAllData();
      setActiveSection('menu_hub');
    }
    const unsubscribe = subscribeToAdminRoles(() => loadAllData());
    const handleReq = () => loadAllData();
    const handleItems = () => loadAllData();
    const handleLogs = () => loadAllData();
    const handleReports = () => loadAllData();

    window.addEventListener('agency_requests_updated', handleReq);
    window.addEventListener('store_items_updated', handleItems);
    window.addEventListener('audit_logs_updated', handleLogs);
    window.addEventListener('moderation_reports_updated', handleReports);

    return () => {
      unsubscribe();
      window.removeEventListener('agency_requests_updated', handleReq);
      window.removeEventListener('store_items_updated', handleItems);
      window.removeEventListener('audit_logs_updated', handleLogs);
      window.removeEventListener('moderation_reports_updated', handleReports);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Strict check: Only owner/developer (YE1330000) can access
  const isOwner = currentUserId?.trim().toUpperCase() === OWNER_DEV_ID;

  if (!isOwner) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 text-right" dir="rtl">
        <div className="bg-slate-900 border border-rose-500/40 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 text-white shadow-2xl">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/40">
            <Lock className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-black text-white">منطقة محمية ومشفرة</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            هذه اللوحة حصرية للمالك والمبرمج العام فقط (ID: {OWNER_DEV_ID}). لا تملك صلاحية الدخول.
          </p>
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    );
  }

  // Handle Admin Creation
  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserId.trim() || !newUserName.trim()) {
      showToast('⚠️ يرجى إدخال المعرف والاسم');
      return;
    }
    assignAdminRole({
      id: newUserId.trim(),
      name: newUserName.trim(),
      role: newUserRole,
      agencyGid: newUserAgencyGid.trim() || undefined,
      agencyName: newUserAgencyName.trim() || undefined,
      expiresAt: newUserExpiresAt.trim() || undefined,
      notes: newUserNotes.trim() || undefined
    });
    showToast(`✅ تم منح رتبة (${newUserRole}) لـ ${newUserName} بنجاح!`);
    setNewUserId('');
    setNewUserName('');
    setNewUserAgencyGid('');
    setNewUserAgencyName('');
    setNewUserExpiresAt('');
    setNewUserNotes('');
  };

  // Handle Revoke
  const handleRevokeAdmin = (id: string, name: string) => {
    if (id.toUpperCase() === OWNER_DEV_ID) {
      showToast('⚠️ لا يمكن سحب صلاحيات المالك والمبرمج!');
      return;
    }
    if (window.confirm(`هل أنت متأكد من سحب صلاحيات ${name} (ID: ${id})؟`)) {
      revokeAdminRole(id);
      showToast(`تم سحب الصلاحيات من ${name}`);
    }
  };

  // Handle Store Item Save
  const handleSaveStoreItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    const item: StoreItemEntity = {
      id: `${newItemCategory}_${Date.now().toString(36)}`,
      name: newItemName.trim(),
      category: newItemCategory,
      price: parseInt(newItemPrice) || 5000,
      durationDays: parseInt(newItemDuration) || 30,
      icon: newItemIcon.trim() || '👑',
      rarity: newItemRarity,
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0]
    };
    saveStoreItem(item);
    showToast(`✅ تم إضافة (${item.name}) إلى المتجر بنجاح`);
    setShowAddStoreModal(false);
    setNewItemName('');
  };

  // Handle Broadcast Message
  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMsg.trim()) return;
    logAuditEvent({
      actorId: OWNER_DEV_ID,
      actorName: 'المالك العام',
      action: 'إرسال إشعار عام لكافة المستخدمين',
      category: 'moderation',
      details: broadcastMsg
    });
    showToast('📢 تم بث الإشعار العام لجميع المستخدمين بنجاح!');
    setBroadcastMsg('');
  };

  // Definition of the 6 required cards exactly matching user requirements
  const sixRectangles = [
    {
      id: 'master_dashboard' as ActiveSection,
      arabicTitle: 'لوحة التحكم الشاملة - سوبر أدمن',
      englishTitle: 'Full Control & Master Dashboard',
      icon: Crown,
      badgeText: 'MASTER ROOT',
      glowColor: 'from-amber-500/20 to-yellow-500/10 border-amber-500/40',
      iconBg: 'bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950',
    },
    {
      id: 'manage_admins' as ActiveSection,
      arabicTitle: 'إدارة الإداريين وصلاحيات طاقم العمل',
      englishTitle: 'Assign, Revoke, Manage Admins',
      icon: Key,
      badgeText: `${adminsList.length} إداري`,
      glowColor: 'from-blue-500/20 to-indigo-500/10 border-blue-500/40',
      iconBg: 'bg-gradient-to-tr from-blue-600 to-indigo-500 text-white',
    },
    {
      id: 'manage_agencies' as ActiveSection,
      arabicTitle: 'إدارة الوكالات الرسمية والمندوبين',
      englishTitle: 'Official Agencies & Representatives Hub',
      icon: Building2,
      badgeText: `${agencyRequests.filter(r => r.status === 'pending').length} طلب معلق`,
      glowColor: 'from-purple-500/20 to-fuchsia-500/10 border-purple-500/40',
      iconBg: 'bg-gradient-to-tr from-purple-500 to-fuchsia-600 text-white',
    },
    {
      id: 'manage_store_themes' as ActiveSection,
      arabicTitle: 'إدارة المتجر وثيمات التطبيق',
      englishTitle: 'Store, Themes, UI Customization',
      icon: Palette,
      badgeText: `${storeItems.length} عنصر`,
      glowColor: 'from-pink-500/20 to-rose-500/10 border-pink-500/40',
      iconBg: 'bg-gradient-to-tr from-pink-600 to-rose-500 text-white',
    },
    {
      id: 'security_audit' as ActiveSection,
      arabicTitle: 'الرقابة الأمنية وسجل الحسابات',
      englishTitle: 'Reports, Bans, System Logs',
      icon: Shield,
      badgeText: `${reportsList.filter(r => r.status === 'pending').length} بلاغ نشط`,
      glowColor: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/40',
      iconBg: 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white',
    },
    {
      id: 'system_analytics' as ActiveSection,
      arabicTitle: 'إدارة الإحصائيات والأرقام العامة',
      englishTitle: 'Analytics & System Statistics',
      icon: BarChart3,
      badgeText: 'Live Feed',
      glowColor: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/40',
      iconBg: 'bg-gradient-to-tr from-cyan-600 to-blue-600 text-white',
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-right select-none overflow-hidden" dir="rtl">
      
      {/* Top Status & App Bar - Full Screen Immersive Header */}
      <div className="w-full bg-slate-950/95 border-b border-slate-800/80 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between z-20 shrink-0 shadow-lg">
        <div className="flex items-center gap-3">
          {activeSection !== 'menu_hub' ? (
            <button
              onClick={() => setActiveSection('menu_hub')}
              className="flex items-center gap-1.5 text-xs font-black text-amber-300 bg-slate-900/90 hover:bg-slate-800 border border-amber-500/30 px-3 py-1.5 rounded-xl cursor-pointer transition-all shadow-sm"
            >
              <ChevronLeft className="w-4 h-4 rotate-180" />
              <span>رجوع للقائمة</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 font-mono text-xs text-amber-400 font-bold bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
              <span>ROOT ID: {OWNER_DEV_ID}</span>
            </div>
          )}
        </div>

        <div className="text-center">
          <h1 className="text-base sm:text-lg font-black text-white tracking-wide flex items-center justify-center gap-2">
            <span>{activeSection === 'menu_hub' ? 'لوحة تحكم السوبر أدمن - المالك الأساسي' : sixRectangles.find(r => r.id === activeSection)?.arabicTitle}</span>
            <Crown className="w-4 h-4 text-amber-400 fill-amber-400 inline" />
          </h1>
          <p className="text-[11px] text-slate-400 font-mono">
            {activeSection === 'menu_hub' ? 'نظام إدارة الصلاحيات الشامل' : sixRectangles.find(r => r.id === activeSection)?.englishTitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="p-2 bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-500/40 rounded-xl transition-all cursor-pointer"
            title="إغلاق اللوحة"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Full-Screen Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-8 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-2xl mx-auto space-y-4 pb-12">
          
          {/* ========================================================================= */}
          {/* 1. THE 6 METALLIC GLOSSY RECTANGLES VIEW (MAIN HUB MATCHING USER'S IMAGE) */}
          {/* ========================================================================= */}
          {activeSection === 'menu_hub' && (
            <div className="space-y-3.5">
              
              {/* The 6 Stacked Glossy Rectangles exactly as ordered */}
              {sixRectangles.map((card) => {
                const IconComponent = card.icon;
                return (
                  <motion.div
                    key={card.id}
                    whileHover={{ scale: 1.015, y: -2 }}
                    whileTap={{ scale: 0.985 }}
                    onClick={() => setActiveSection(card.id)}
                    className={`relative overflow-hidden rounded-[24px] p-5 cursor-pointer transition-all duration-200 border border-slate-700/60 shadow-xl group bg-gradient-to-b from-slate-800/90 via-slate-900/95 to-slate-950 ${card.glowColor}`}
                  >
                    {/* Glossy specular top reflection shine */}
                    <div className="absolute inset-x-0 top-0 h-[35%] bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-t-[24px]" />
                    
                    {/* Card Content Layout */}
                    <div className="relative flex items-center justify-between gap-4">
                      
                      {/* Left: Glowing Green Dot Indicator */}
                      <div className="flex items-center gap-2">
                        <div className="w-3.5 h-3.5 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399,0_0_4px_#10b981] animate-pulse" />
                      </div>

                      {/* Center/Right Texts */}
                      <div className="flex-1 text-right">
                        <h3 className="text-sm sm:text-base font-black text-white tracking-wide group-hover:text-amber-200 transition-colors drop-shadow-sm">
                          {card.arabicTitle}
                        </h3>
                        <p className="text-[11px] sm:text-xs text-slate-300 font-mono tracking-wider mt-0.5 font-medium">
                          {card.englishTitle}
                        </p>
                      </div>

                      {/* Right: Metallic Glow Icon Box */}
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md border border-white/20 shrink-0 ${card.iconBg}`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. RECTANGLE 1: FULL CONTROL & MASTER DASHBOARD (لوحة التحكم الشاملة) */}
          {/* ========================================================================= */}
          {activeSection === 'master_dashboard' && (
            <div className="space-y-4">
              
              {/* Sovereign Controls Card */}
              <div className="p-4 bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 border-2 border-amber-500/40 rounded-3xl space-y-3">
                <div className="flex items-center gap-2 text-amber-300 font-black text-xs">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <span>التحكم السيادي العام للمالك والمبرمج</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  أنت مسجل حالياً بالمعرف السيادي المعتمد: <strong className="text-amber-300 font-mono">{OWNER_DEV_ID}</strong>. لديك كامل الصلاحيات لتعطيل الخدمات، ضخ الكوينز، وبث التنبيهات الشاملة.
                </p>

                {/* Quick Master Switches */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={() => showToast('⚡ تم مسح الذاكرة المؤقتة وتحديث خوادم الرومات بنجاح')}
                    className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-700 rounded-xl text-xs font-bold text-slate-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                    <span>تحديث الكاش</span>
                  </button>
                  <button
                    onClick={() => showToast('🛡️ وضع الصيانة: النظام يعمل بكفاءة 100%')}
                    className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-700 rounded-xl text-xs font-bold text-slate-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5 text-emerald-400" />
                    <span>حالة الخوادم</span>
                  </button>
                </div>
              </div>

              {/* Master Broadcast Message */}
              <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-2.5">
                <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                  <Send className="w-4 h-4 text-blue-400" />
                  <span>إرسال إشعار منبثق فوري لجميع المستخدمين</span>
                </h4>
                <form onSubmit={handleSendBroadcast} className="space-y-2">
                  <textarea
                    value={broadcastMsg}
                    onChange={(e) => setBroadcastMsg(e.target.value)}
                    placeholder="اكتب نص الإشعار العام (مثلاً: تحديث جديد، مسابقة كبرى...)"
                    rows={2}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none"
                  />
                  <button
                    type="submit"
                    className="w-full py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs rounded-xl shadow-md cursor-pointer transition-all"
                  >
                    إرسال البث لجميع المستخدمين 📢
                  </button>
                </form>
              </div>

              {/* System Quick Stats Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-right space-y-1">
                  <span className="text-[10px] text-slate-400">إجمالي الإداريين المعينين</span>
                  <p className="text-base font-black text-white font-mono">{adminsList.length}</p>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-right space-y-1">
                  <span className="text-[10px] text-slate-400">طلبات الوكالات المعلقة</span>
                  <p className="text-base font-black text-amber-400 font-mono">
                    {agencyRequests.filter(r => r.status === 'pending').length}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. RECTANGLE 2: ASSIGN, REVOKE, MANAGE ADMINS (إدارة الإداريين والتتبع الهرمي) */}
          {/* ========================================================================= */}
          {activeSection === 'manage_admins' && (
            <ManageAdminsHierarchyView
              onBackToMenu={() => setActiveSection('menu_hub')}
              showToast={showToast}
            />
          )}

          {/* ========================================================================= */}
          {/* 4. RECTANGLE 3: OFFICIAL AGENCIES & REPRESENTATIVES HUB (إدارة الوكالات الرسمية والمندوبين) */}
          {/* ========================================================================= */}
          {activeSection === 'manage_agencies' && (
            <OfficialAgenciesManagement
              onBackToMenu={() => setActiveSection('menu_hub')}
              showToast={showToast}
            />
          )}

          {/* ========================================================================= */}
          {/* 5. RECTANGLE 4: STORE, THEMES, UI CUSTOMIZATION (إدارة المتجر والثيمات) */}
          {/* ========================================================================= */}
          {activeSection === 'manage_store_themes' && (
            <div className="space-y-4">
              
              {/* Add Store Item Button & Modal */}
              <div className="p-4 bg-gradient-to-br from-pink-950/30 via-slate-900 to-slate-900 border-2 border-pink-500/40 rounded-3xl space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-pink-300 flex items-center gap-1.5">
                    <Palette className="w-4 h-4 text-pink-400" />
                    <span>عناصر المتجر وثيمات الرومات ({storeItems.length})</span>
                  </h4>
                  <button
                    onClick={() => setShowAddStoreModal(true)}
                    className="py-1.5 px-3 bg-pink-600 hover:bg-pink-500 text-white font-bold text-[11px] rounded-xl flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>إضافة عنصر</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {storeItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-1 relative group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xl">{item.icon}</span>
                        <span className="text-[9px] text-pink-300 bg-pink-950/80 px-1.5 py-0.2 rounded border border-pink-800 font-mono">
                          {item.price} 💰
                        </span>
                      </div>
                      <span className="font-black text-white block truncate">{item.name}</span>
                      <span className="text-[10px] text-slate-400 block">{item.category} • {item.durationDays} يوم</span>

                      <button
                        onClick={() => {
                          deleteStoreItem(item.id);
                          showToast(`تم حذف ${item.name}`);
                        }}
                        className="absolute top-2 left-2 text-rose-400 hover:text-rose-300 p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Store Item Modal popup */}
              <AnimatePresence>
                {showAddStoreModal && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-4 bg-slate-900 border-2 border-pink-500/50 rounded-3xl space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-white">إضافة عنصر جديد لمتجر التطبيق</h4>
                      <button onClick={() => setShowAddStoreModal(false)} className="text-slate-400 hover:text-white">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveStoreItem} className="space-y-2 text-xs">
                      <input
                        type="text"
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        placeholder="اسم العنصر (مثلاً: إطار التاج الإمبراطوري)..."
                        className="w-full px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-pink-500"
                        required
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={newItemCategory}
                          onChange={(e) => setNewItemCategory(e.target.value as any)}
                          className="w-full px-2 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                        >
                          <option value="badge">وسام (Badge)</option>
                          <option value="frame">إطار (Frame)</option>
                          <option value="bubble">فقاعة محادثة (Bubble)</option>
                          <option value="vehicle">سيارة ودخولية (Vehicle)</option>
                        </select>
                        <input
                          type="number"
                          value={newItemPrice}
                          onChange={(e) => setNewItemPrice(e.target.value)}
                          placeholder="السعر بالكوينز"
                          className="w-full px-2 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={newItemIcon}
                          onChange={(e) => setNewItemIcon(e.target.value)}
                          placeholder="الأيقونة أو الإيموجي (👑)"
                          className="w-full px-2 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-center"
                        />
                        <input
                          type="number"
                          value={newItemDuration}
                          onChange={(e) => setNewItemDuration(e.target.value)}
                          placeholder="المدة بالأيام (30)"
                          className="w-full px-2 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full py-2 bg-pink-600 hover:bg-pink-500 text-white font-black rounded-xl transition-all cursor-pointer"
                      >
                        حفظ ونشر في المتجر 🎨
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 6. RECTANGLE 5: REPORTS, BANS, SYSTEM LOGS (الرقابة الأمنية) */}
          {/* ========================================================================= */}
          {activeSection === 'security_audit' && (
            <div className="space-y-4">
              
              {/* Pending Reports */}
              <div className="p-4 bg-slate-900/90 border-2 border-emerald-500/40 rounded-3xl space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-emerald-300 flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span>البلاغات والشكاوي الأمنية ({reportsList.filter(r => r.status === 'pending').length})</span>
                  </h4>
                </div>

                <div className="space-y-2">
                  {reportsList.map((rep) => {
                    const isPending = rep.status === 'pending';
                    return (
                      <div
                        key={rep.id}
                        className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-black text-white">
                            ضد: <strong className="text-rose-400">{rep.reportedUserName}</strong> (ID: {rep.reportedUserId})
                          </span>
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                            isPending ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                          }`}>
                            {isPending ? 'معلق ⚠️' : `تم اتخاذ: ${rep.penaltyApplied}`}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-300 bg-slate-900 p-2 rounded-xl border border-slate-800">
                          <strong>السبب:</strong> {rep.reason}
                        </p>

                        {isPending && (
                          <div className="grid grid-cols-3 gap-1.5 pt-1">
                            <button
                              onClick={() => {
                                resolveModerationReport(rep.id, 'warning', OWNER_DEV_ID);
                                showToast('تم إرسال تحذير');
                              }}
                              className="py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl text-[10px] font-bold"
                            >
                              تحذير ⚠️
                            </button>
                            <button
                              onClick={() => {
                                resolveModerationReport(rep.id, 'kick_room', OWNER_DEV_ID);
                                showToast('تم طرد المستخدم');
                              }}
                              className="py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-xl text-[10px] font-bold"
                            >
                              طرد 🚪
                            </button>
                            <button
                              onClick={() => {
                                resolveModerationReport(rep.id, 'ban_permanent', OWNER_DEV_ID);
                                showToast('تم حظر المستخدم نهائياً');
                              }}
                              className="py-1 bg-rose-600 text-white rounded-xl text-[10px] font-bold"
                            >
                              حظر دائم 🚫
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* System Audit Logs */}
              <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-3xl space-y-2">
                <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  <span>أحدث سجلات التدقيق العام (Audit Logs)</span>
                </h4>
                <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar">
                  {auditLogs.slice(0, 8).map((log) => (
                    <div key={log.id} className="p-2 bg-slate-950 rounded-xl border border-slate-800/80 text-[11px]">
                      <div className="flex items-center justify-between text-slate-300 font-bold">
                        <span>{log.action}</span>
                        <span className="text-[9px] font-mono text-slate-500">{log.timestamp.split('T')[0]}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5">بواسطة: {log.actorName} ({log.actorId})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 7. RECTANGLE 6: ANALYTICS & SYSTEM STATISTICS (الإحصائيات والأرقام) */}
          {/* ========================================================================= */}
          {activeSection === 'system_analytics' && (
            <div className="space-y-4">
              
              {/* Live Metric KPIs */}
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="p-3.5 bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-900 border border-cyan-500/30 rounded-2xl space-y-1">
                  <span className="text-[10px] text-cyan-300 font-bold">الغرف النشطة حالياً</span>
                  <p className="text-xl font-black text-white font-mono flex items-center gap-1">
                    <span>18</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  </p>
                </div>

                <div className="p-3.5 bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 rounded-2xl space-y-1">
                  <span className="text-[10px] text-amber-300 font-bold">حجم التداول اليومي</span>
                  <p className="text-xl font-black text-white font-mono">1.4M 💰</p>
                </div>

                <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
                  <span className="text-[10px] text-slate-400">إجمالي الحسابات المسجلة</span>
                  <p className="text-xl font-black text-white font-mono">24,580</p>
                </div>

                <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
                  <span className="text-[10px] text-slate-400">الوكلاء والمذيعين النشطين</span>
                  <p className="text-xl font-black text-white font-mono">142</p>
                </div>
              </div>

              {/* Performance Indicator Card */}
              <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-3xl space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">استقرار الخوادم ومعدل الاستجابة</span>
                  <span className="text-emerald-400 font-mono font-black">99.98%</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div className="h-full bg-emerald-500 rounded-full w-[99%]" />
                </div>
                <span className="text-[10px] text-slate-400 block pt-1">
                  زمن الاستجابة الصوتي: 42ms | معدل نقل الهدايا ثلاثية الأبعاد: لحظي
                </span>
              </div>
            </div>
          )}

        </div>

        {/* Toast Alert Popup */}
        <AnimatePresence>
          {toastMsg && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 font-black text-xs px-4 py-2 rounded-full shadow-2xl border border-white/30 z-50 flex items-center gap-1.5 whitespace-nowrap"
            >
              <span>{toastMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
