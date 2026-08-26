import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SalarySlipModal } from './SalarySlipModal';
import { AgencyInfoModal } from './AgencyInfoModal';
import { BroadcasterCenterModal } from './BroadcasterCenterModal';
import { BrokerCenterModal } from './BrokerCenterModal';
import { TransferRecordModal } from './TransferRecordModal';
import { HostStatisticsModal } from './HostStatisticsModal';
import { 
  X, 
  ChevronUp, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight,
  Users, 
  Calendar, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Award,
  Wallet,
  ArrowLeftRight,
  Star,
  UserCheck,
  Download,
  Megaphone,
  PhoneCall,
  Clock,
  Eye,
  RefreshCw,
  Check,
  Copy,
  Sparkles,
  ShieldCheck,
  Mail,
  Coins,
  Mic,
  FileDown,
  UserPlus,
  Settings2,
  Sliders,
  RotateCcw,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Grid,
  Crown,
  Heart,
  Zap,
  Gift,
  HelpCircle,
  BarChart3,
  Layers,
  ArrowRightLeft
} from 'lucide-react';

interface AgencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  userAvatar?: string;
  userName?: string;
  agencyGid?: string;
}

export interface ToolItem {
  id: string;
  title: string;
  iconName: string;
  visible: boolean;
  badge?: string;
}

const AVAILABLE_ICONS: { [key: string]: React.ElementType } = {
  Users,
  Mic,
  UserCheck,
  Wallet,
  RefreshCw,
  FileDown,
  Megaphone,
  Star,
  ShieldCheck,
  DollarSign,
  Award,
  Crown,
  Heart,
  Zap,
  Gift,
  Coins,
  Mail,
  BarChart3,
  FileText,
  Clock,
  PhoneCall,
  Sparkles
};

const DEFAULT_TOOLS: ToolItem[] = [
  { id: 'agency_info', title: 'معلومات الوكالة', iconName: 'Users', visible: true },
  { id: 'broadcasters_center', title: 'مركز المذيعين', iconName: 'Mic', visible: true },
  { id: 'agents_center', title: 'مركز الوسطاء', iconName: 'UserCheck', visible: true },
  { id: 'wallet', title: 'محفظتي', iconName: 'Wallet', visible: true },
  { id: 'transfer_logs', title: 'سجل التحويل', iconName: 'RefreshCw', visible: true },
  { id: 'download_invoice', title: 'Download the invoice', iconName: 'FileDown', visible: true },
  { id: 'agency_announcement', title: 'إعلان الوكالة', iconName: 'Megaphone', visible: true },
];

export const AgencyModal: React.FC<AgencyModalProps> = ({
  isOpen,
  onClose,
  userAvatar = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
  userName = 'AbuAmjad',
  agencyGid = '30032'
}) => {
  // اتجاه العرض (RTL: من اليمين لليسار | LTR: من اليسار لليمين)
  const [direction, setDirection] = useState<'rtl' | 'ltr'>(() => {
    return (localStorage.getItem('agency_display_direction') as 'rtl' | 'ltr') || 'rtl';
  });

  // إدارة الأدوات والعناصر
  const [toolsList, setToolsList] = useState<ToolItem[]>(() => {
    const saved = localStorage.getItem('agency_custom_tools');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved tools:', e);
      }
    }
    return DEFAULT_TOOLS;
  });

  // حفظ الأدوات المحدثة
  const saveTools = (newTools: ToolItem[]) => {
    setToolsList(newTools);
    localStorage.setItem('agency_custom_tools', JSON.stringify(newTools));
  };

  // تبديل اتجاه العرض (Flip display direction RTL ⇄ LTR)
  const toggleDirection = () => {
    const newDir = direction === 'rtl' ? 'ltr' : 'rtl';
    setDirection(newDir);
    localStorage.setItem('agency_display_direction', newDir);
  };

  // الحالات التفاعلية
  const [isStatsCollapsed, setIsStatsCollapsed] = useState(false);
  const [showEarningsDetails, setShowEarningsDetails] = useState(false);
  const [showHostStatsModal, setShowHostStatsModal] = useState(false);
  const [hostStatsInitialTab, setHostStatsInitialTab] = useState<'all' | 'incomplete' | 'dropped'>('all');
  const [showHostsIncompleteModal, setShowHostsIncompleteModal] = useState(false);
  const [showHostsDropModal, setShowHostsDropModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showRechargeAgentModal, setShowRechargeAgentModal] = useState(false);
  const [showManageToolsModal, setShowManageToolsModal] = useState(false);

  // حالة تعديل أداة معينة في نافذة الإدارة
  const [editingTool, setEditingTool] = useState<ToolItem | null>(null);
  const [showAddTool, setShowAddTool] = useState(false);
  const [newToolTitle, setNewToolTitle] = useState('');
  const [newToolIcon, setNewToolIcon] = useState('Sparkles');

  // أدواتي modals
  const [activeToolModal, setActiveToolModal] = useState<string | null>(null);

  const [copiedCode, setCopiedCode] = useState(false);

  // حالات المحفظة وسحب الأرباح
  const [withdrawAddress, setWithdrawAddress] = useState('TQn9Y2Kh...v98ZaL1');

  // حالات تحميل الفاتورة
  const [invoiceDownloading, setInvoiceDownloading] = useState(false);
  const [invoiceDownloaded, setInvoiceDownloaded] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // إحصائيات الوكالة المطابقة تماماً للصورة
  const agencyStats = [
    { label: 'إجمالي الماسات لهذا الشهر', value: '3,469,755', isNegative: false },
    { label: 'نسبة العمولة', value: '0.80', isNegative: false },
    { label: 'التقدم المتبقي للمستوى التالي', value: '46,530,245', isNegative: false },
    { label: 'الماسات لنفس الفترة من الشهر الماضي', value: '3,935,284', isNegative: false },
    { label: 'إجمالي الماسات الشهر الماضي', value: '4,895,304', isNegative: false },
    { label: 'مقابل نفس الفترة من الشهر الماضي', value: '-11.83%', isNegative: true },
    { label: 'مقابل الشهر الماضي', value: '-29.12%', isNegative: true },
  ];

  // المضيفون الذين شهدوا انخفاضاً بنسبة 20%
  const droppedHosts = [
    { id: 1, name: 'أميرة الصوت', uid: '9012384', lastMonth: '1,200,000', thisMonth: '640,000', change: '-46.6%' },
    { id: 2, name: 'نجم اليمن', uid: '6620194', lastMonth: '850,000', thisMonth: '399,155', change: '-53.0%' },
    { id: 3, name: 'فارس الليل', uid: '4451092', lastMonth: '620,000', thisMonth: '410,000', change: '-33.8%' },
    { id: 4, name: 'صوت الخليج', uid: '5598102', lastMonth: '900,000', thisMonth: '680,000', change: '-24.4%' },
    { id: 5, name: 'ملكة الإحساس', uid: '3321908', lastMonth: '1,500,000', thisMonth: '1,120,000', change: '-25.3%' },
    { id: 6, name: 'النسر الذهبي', uid: '7729011', lastMonth: '780,000', thisMonth: '590,000', change: '-24.3%' },
  ];

  // دالة تحريك العنصر لأعلى / لأسفل
  const moveTool = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= toolsList.length) return;
    const updated = [...toolsList];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    saveTools(updated);
  };

  // دالة تبديل رؤية العنصر
  const toggleToolVisibility = (id: string) => {
    const updated = toolsList.map(t => t.id === id ? { ...t, visible: !t.visible } : t);
    saveTools(updated);
  };

  // دالة تحديث أيقونة أو اسم أداة
  const handleUpdateTool = (id: string, newTitle: string, newIcon: string) => {
    const updated = toolsList.map(t => t.id === id ? { ...t, title: newTitle, iconName: newIcon } : t);
    saveTools(updated);
    setEditingTool(null);
  };

  // دالة إضافة أداة جديدة
  const handleAddTool = () => {
    if (!newToolTitle.trim()) return;
    const newTool: ToolItem = {
      id: `custom_tool_${Date.now()}`,
      title: newToolTitle.trim(),
      iconName: newToolIcon,
      visible: true,
    };
    saveTools([...toolsList, newTool]);
    setNewToolTitle('');
    setShowAddTool(false);
  };

  // دالة حذف أداة
  const handleDeleteTool = (id: string) => {
    const updated = toolsList.filter(t => t.id !== id);
    saveTools(updated);
  };

  // دالة إعادة التعيين للافتراضي
  const handleResetTools = () => {
    saveTools(DEFAULT_TOOLS);
  };

  const isRtl = direction === 'rtl';

  return (
    <div 
      className={`fixed inset-0 z-50 w-full h-full min-h-screen bg-[#F6F8FB] flex flex-col overflow-y-auto select-none transition-all duration-300 ${
        isRtl ? 'text-right' : 'text-left'
      }`} 
      dir={direction}
    >
      {/* Toast Notification */}
      {copiedCode && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-70 bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-bold shadow-2xl flex items-center gap-2 border border-slate-700 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>تم النسخ بنجاح!</span>
        </div>
      )}

      {/* Top App Bar (وكالتي) مع أزرار التحكم في قلب العرض وإدارة العناصر */}
      <div className="sticky top-0 z-30 bg-[#F6F8FB]/95 backdrop-blur-md px-4 py-3.5 flex items-center justify-between border-b border-slate-200/50">
        <div className="flex items-center gap-2.5">
          <h1 className="text-base font-black text-slate-900 tracking-tight">
            {isRtl ? 'وكالتي' : 'My Agency'}
          </h1>
          
          {/* شارة توضيح اتجاه العرض الحالي */}
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-bold border border-blue-100">
            {isRtl ? 'RTL (يمين ➜ يسار)' : 'LTR (يسار ➜ يمين)'}
          </span>
        </div>

        {/* أدوات التحكم العلوية: زر قلب العرض (Flip Display) + زر الإغلاق */}
        <div className="flex items-center gap-2">
          {/* زر قلب العرض من اليمين إلى اليسار والعكس (Flip Display) */}
          <button
            onClick={toggleDirection}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-600 border border-slate-200 hover:border-blue-300 rounded-full text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
            title={isRtl ? 'قلب العرض إلى اليسار (LTR)' : 'قلب العرض إلى اليمين (RTL)'}
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-[11px]">{isRtl ? 'قلب العرض (LTR)' : 'Flip to (RTL)'}</span>
          </button>

          {/* زر إغلاق */}
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-200/80 rounded-full text-slate-600 hover:text-slate-900 transition-colors cursor-pointer active:scale-95"
            title="إغلاق"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="w-full max-w-lg mx-auto p-4 space-y-5 pb-20 flex-1">
        
        {/* ========================================================= */}
        {/* 1. البطاقة العلوية (Top Gradient Card) */}
        {/* ========================================================= */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#44a4f8] via-[#4d86f7] to-[#6055ef] p-5 text-white shadow-[0_10px_25px_rgba(68,164,248,0.28)]">
          {/* خلفيات دوائر خفيفة */}
          <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="absolute -left-8 -bottom-8 w-40 h-40 bg-black/10 rounded-full blur-xl pointer-events-none" />

          {/* الصف العلوي: الاسم والمعرف مع الصورة على اليمين في RTL واليسار في LTR */}
          <div className="flex items-center justify-between relative z-10">
            {/* زر تفاصيل */}
            <button 
              onClick={() => setShowEarningsDetails(true)}
              className="bg-white/20 hover:bg-white/30 active:scale-95 transition-all backdrop-blur-md px-3.5 py-1.5 rounded-full text-[11px] font-bold text-white border border-white/25 shadow-xs cursor-pointer flex items-center gap-1"
            >
              <span>{isRtl ? 'تفاصيل' : 'Details'}</span>
              <ChevronLeft className={`w-3.5 h-3.5 ${isRtl ? '' : 'rotate-180'}`} />
            </button>

            {/* الاسم والمعرف والصورة */}
            <div className={`flex items-center gap-2.5 ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
              <div className={isRtl ? 'text-left' : 'text-right'}>
                <div className="text-sm font-black text-white leading-tight">{userName}</div>
                <div className="text-[11px] font-bold font-mono text-white/90">GID:{agencyGid}</div>
              </div>
              <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white/50 shadow-md bg-slate-900 shrink-0">
                <img 
                  src={userAvatar} 
                  alt={userName} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* الصف السفلي: الأرباح */}
          <div className="grid grid-cols-2 gap-4 mt-7 pt-1 text-center relative z-10">
            {/* أرباح الشهر الحالي */}
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight drop-shadow-xs">
                19.00
              </div>
              <div className="text-[11px] sm:text-xs font-medium text-white/90">
                {isRtl ? 'أرباح الشهر الحالي($)' : 'Current Month ($)'}
              </div>
            </div>

            {/* أرباح الأمس */}
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight drop-shadow-xs">
                0
              </div>
              <div className="text-[11px] sm:text-xs font-medium text-white/90">
                {isRtl ? 'أرباح الأمس($)' : "Yesterday's ($)"}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. قسم "إحصائيات الوكالة" (Agency Statistics Card) */}
        {/* ========================================================= */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-black text-slate-800">
              {isRtl ? 'إحصائيات الوكالة' : 'Agency Statistics'}
            </h2>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-slate-100/90 space-y-3.5">
            <div className="space-y-3.5">
              {(isStatsCollapsed ? agencyStats.slice(0, 3) : agencyStats).map((stat, idx) => (
                <div 
                  key={idx} 
                  className={`flex items-center justify-between text-xs py-0.5 border-b border-slate-50 last:border-0 ${
                    isRtl ? 'flex-row' : 'flex-row-reverse'
                  }`}
                >
                  {/* Metric Value */}
                  <span className={`font-mono font-extrabold text-sm ${
                    stat.isNegative 
                      ? 'text-[#F43F5E]' 
                      : 'text-slate-800'
                  }`}>
                    {stat.value}
                  </span>

                  {/* Label */}
                  <span className="text-slate-600 font-bold text-xs">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Toggle Collapse/Expand Button */}
            <div className="pt-2 flex justify-center items-center">
              <button 
                onClick={() => setIsStatsCollapsed(!isStatsCollapsed)}
                className="flex items-center gap-1 text-slate-400 hover:text-slate-600 text-xs font-bold transition-colors cursor-pointer py-1 px-3 rounded-full hover:bg-slate-50"
              >
                <span>{isStatsCollapsed ? (isRtl ? 'توسيع' : 'Expand') : (isRtl ? 'طي' : 'Collapse')}</span>
                {isStatsCollapsed ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : (
                  <ChevronUp className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 3. قسم "إحصائيات المضيف" (Host Statistics Card) */}
        {/* ========================================================= */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <h2 
              onClick={() => {
                setHostStatsInitialTab('all');
                setShowHostStatsModal(true);
              }}
              className="text-sm font-black text-slate-800 cursor-pointer hover:text-blue-600 transition-colors"
            >
              {isRtl ? 'إحصائيات المضيف' : 'Host Statistics'}
            </h2>
            <button 
              onClick={() => {
                setHostStatsInitialTab('all');
                setShowHostStatsModal(true);
              }}
              className="flex items-center gap-1 text-slate-400 hover:text-slate-600 text-xs font-semibold cursor-pointer transition-colors"
            >
              <span>{isRtl ? 'عرض التفاصيل' : 'View Details'}</span>
              {isRtl ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="space-y-2.5">
            {/* البند الأول: 0 المضيفين لم تستكمل أيام البث المطلوبة */}
            <div 
              onClick={() => {
                setHostStatsInitialTab('incomplete');
                setShowHostStatsModal(true);
              }}
              className="bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-slate-100/90 flex items-center justify-between cursor-pointer hover:border-slate-300 transition-all"
            >
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setHostStatsInitialTab('incomplete');
                  setShowHostStatsModal(true);
                }}
                className="bg-[#00C458] hover:bg-[#00B04F] active:scale-95 text-white font-black text-xs px-6 py-2 rounded-full shadow-[0_2px_8px_rgba(0,196,88,0.3)] transition-all cursor-pointer"
              >
                {isRtl ? 'عرض' : 'View'}
              </button>

              <span className="text-slate-800 font-bold text-xs">
                {isRtl ? '0 المضيفين لم تستكمل أيام البث المطلوبة' : '0 Hosts have not completed required broadcast days'}
              </span>
            </div>

            {/* البند الثاني: 6 من المضيفين شهدت انخفاضًا كبيرًا (-20.00%) في الماسات */}
            <div 
              onClick={() => {
                setHostStatsInitialTab('dropped');
                setShowHostStatsModal(true);
              }}
              className="bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-slate-100/90 flex items-center justify-between cursor-pointer hover:border-slate-300 transition-all"
            >
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setHostStatsInitialTab('dropped');
                  setShowHostStatsModal(true);
                }}
                className="bg-[#00C458] hover:bg-[#00B04F] active:scale-95 text-white font-black text-xs px-6 py-2 rounded-full shadow-[0_2px_8px_rgba(0,196,88,0.3)] transition-all cursor-pointer"
              >
                {isRtl ? 'عرض' : 'View'}
              </button>

              <span className="text-slate-800 font-bold text-xs leading-relaxed">
                {isRtl ? '6 من المضيفين شهدت انخفاضًا كبيرًا (-20.00%) في الماسات' : '6 Hosts experienced a high diamond drop (-20.00%)'}
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 4. قسم "مركز المهام" (Task Center) */}
        {/* ========================================================= */}
        <div className="space-y-2.5">
          <h2 className="text-sm font-black text-slate-800 px-1">
            {isRtl ? 'مركز المهام' : 'Task Center'}
          </h2>

          {/* بطاقة توظيف مضيفين جدد */}
          <div 
            onClick={() => setShowTaskModal(true)}
            className="bg-gradient-to-b from-[#FFF9EE] via-[#FFF3DC] to-[#FFF0D4] border border-[#FFE7B8] rounded-3xl p-5 shadow-[0_2px_12px_rgba(245,158,11,0.08)] space-y-4 cursor-pointer hover:border-amber-400 transition-all group"
          >
            {/* Header: Title and Arrow */}
            <div className="flex items-center justify-between">
              {isRtl ? (
                <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition-colors" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition-colors" />
              )}
              <h3 className="text-xs sm:text-sm font-black text-slate-900">
                {isRtl ? 'توظيف مضيفين جدد:' : 'Recruit New Hosts:'}
              </h3>
            </div>

            {/* Description */}
            <p className="text-[11px] sm:text-xs font-bold text-slate-600">
              {isRtl ? 'قم بتوظيف 1 من المضيفين الجدد الصالحين هذا الشهر' : 'Recruit 1 new qualified host this month'}
            </p>

            {/* Progress Slider Bar */}
            <div className="relative flex items-center justify-between pt-1">
              <span className="font-mono font-black text-xs text-slate-800">1</span>

              <div className="flex-1 mx-3 h-2 bg-[#F6E5C2] rounded-full overflow-hidden relative">
                <div className="w-0 h-full bg-amber-500 rounded-full" />
              </div>

              <div className="w-6 h-6 rounded-full bg-[#FFAA00] text-white flex items-center justify-center font-black text-xs shadow-xs font-mono">
                0
              </div>
            </div>

            {/* 3 Reward Badges */}
            <div className="flex items-center justify-end gap-2 pt-1">
              <div className="w-9 h-9 rounded-xl bg-white/80 border border-amber-200/80 flex items-center justify-center shadow-xs text-lg">
                🦅
              </div>
              <div className="w-9 h-9 rounded-xl bg-white/80 border border-amber-200/80 flex items-center justify-center shadow-xs text-xs font-black text-amber-600">
                <div className="text-center leading-none">
                  <span className="block text-[8px]">▲</span>
                  <span className="text-[9px] font-mono">LEVEL</span>
                </div>
              </div>
              <div className="w-9 h-9 rounded-xl bg-white/80 border border-amber-200/80 flex items-center justify-center shadow-xs text-lg">
                🦁
              </div>
            </div>
          </div>

          {/* بطاقة "دعوة المذيعين" */}
          <div 
            onClick={() => setShowInviteModal(true)}
            className="bg-gradient-to-r from-[#4fa0f9] via-[#5d8df8] to-[#6a6aef] text-white rounded-2xl p-4 flex items-center justify-between shadow-[0_4px_16px_rgba(79,160,249,0.25)] cursor-pointer hover:opacity-95 transition-all group"
          >
            {isRtl ? (
              <ChevronLeft className="w-4 h-4 text-white/80 group-hover:translate-x-[-2px] transition-transform" />
            ) : (
              <ChevronRight className="w-4 h-4 text-white/80 group-hover:translate-x-[2px] transition-transform" />
            )}
            <div className="flex items-center gap-3">
              <span className="text-xs sm:text-sm font-black tracking-wide">
                {isRtl ? 'دعوة المذيعين' : 'Invite Broadcasters'}
              </span>
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-xs">
                <Mail className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* بطاقة "إنشاء وكيل شحن (2/3)" */}
          <div 
            onClick={() => setShowRechargeAgentModal(true)}
            className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-between shadow-[0_2px_10px_rgba(0,0,0,0.03)] cursor-pointer hover:border-amber-300 transition-all group"
          >
            {isRtl ? (
              <ChevronLeft className="w-4 h-4 text-slate-300 group-hover:translate-x-[-2px] transition-transform" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-[2px] transition-transform" />
            )}
            <div className="flex items-center gap-3">
              <span className="text-xs sm:text-sm font-bold text-slate-400">
                {isRtl ? 'إنشاء وكيل شحن(2/3)' : 'Create Recharge Agent (2/3)'}
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 shadow-xs text-lg">
                🪙
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 5. قسم "أدواتي" مع زر إدارة العناصر والأيقونات */}
        {/* ========================================================= */}
        <div className="space-y-2.5 pt-2">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-black text-slate-800">
              {isRtl ? 'أدواتي' : 'My Tools'}
            </h2>

            {/* زر إدارة العناصر والأيقونات (Manage Items & Icons) */}
            <button
              onClick={() => setShowManageToolsModal(true)}
              className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50/80 hover:bg-blue-100/80 px-3 py-1 rounded-full border border-blue-200/60 transition-all cursor-pointer active:scale-95"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{isRtl ? 'إدارة العناصر والأيقونات' : 'Manage Items & Icons'}</span>
            </button>
          </div>
          
          {/* شبكة الأدوات القابلة للتخصيص والإدارة */}
          <div className="grid grid-cols-4 gap-2.5 text-center">
            {toolsList.filter(t => t.visible).map((tool) => {
              const IconComp = AVAILABLE_ICONS[tool.iconName] || Users;
              return (
                <button 
                  key={tool.id}
                  onClick={() => setActiveToolModal(tool.id)}
                  className="flex flex-col items-center justify-center gap-2 bg-white border border-slate-100 p-3 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md active:scale-95 hover:border-slate-300 transition-all cursor-pointer group"
                >
                  <div className="w-11 h-11 rounded-2xl bg-[#EEF2F6] group-hover:bg-blue-50 group-hover:text-blue-600 flex items-center justify-center text-slate-700 transition-colors">
                    <IconComp className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <span className="text-[11px] font-black text-slate-800 leading-tight">
                    {tool.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 🟢 نافذة إدارة العناصر والأيقونات (Manage Items & Icons Modal) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showManageToolsModal && (
          <div className="fixed inset-0 z-70 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4" dir={direction}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-5 space-y-4 shadow-2xl text-slate-900 max-h-[90vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Sliders className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">
                      {isRtl ? 'إدارة العناصر والأيقونات' : 'Manage Items & Icons'}
                    </h3>
                    <p className="text-[10px] text-slate-500">
                      {isRtl ? 'تخصيص الأيقونات، ترتيب العناصر، وإخفاء أو إضافة أدوات جديدة' : 'Customize icons, reorder items, hide or add new tools'}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowManageToolsModal(false)}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Actions (Flip direction & Reset) */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={toggleDirection}
                  className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold border border-blue-200 transition-colors cursor-pointer"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                  <span>{isRtl ? 'قلب اتجاه العرض (LTR)' : 'Flip to RTL (يمين)'}</span>
                </button>

                <button
                  onClick={handleResetTools}
                  className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold border border-slate-200 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{isRtl ? 'استعادة الافتراضي' : 'Reset Defaults'}</span>
                </button>
              </div>

              {/* List of Manageable Tools */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {toolsList.map((tool, index) => {
                  const IconComp = AVAILABLE_ICONS[tool.iconName] || Users;
                  return (
                    <div 
                      key={tool.id}
                      className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-2 ${
                        tool.visible 
                          ? 'bg-slate-50/80 border-slate-200' 
                          : 'bg-slate-100/50 border-slate-200 opacity-60'
                      }`}
                    >
                      {/* Icon + Title */}
                      <div className="flex items-center gap-3 min-w-0">
                        <button
                          onClick={() => setEditingTool(tool)}
                          className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 shadow-xs hover:border-blue-400 hover:scale-105 transition-all cursor-pointer"
                          title="تغيير الأيقونة"
                        >
                          <IconComp className="w-5 h-5" />
                        </button>
                        <div className="truncate">
                          <div className="text-xs font-black text-slate-800 truncate">{tool.title}</div>
                          <div className="text-[10px] text-slate-400 font-mono">الأيقونة: {tool.iconName}</div>
                        </div>
                      </div>

                      {/* Controls (Move Up, Move Down, Toggle Visibility, Edit, Delete) */}
                      <div className="flex items-center gap-1 shrink-0">
                        {/* Move Up */}
                        <button
                          onClick={() => moveTool(index, 'up')}
                          disabled={index === 0}
                          className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 disabled:opacity-30 hover:bg-slate-100 cursor-pointer disabled:cursor-not-allowed"
                          title="تحريك لأعلى"
                        >
                          <MoveUp className="w-3.5 h-3.5" />
                        </button>

                        {/* Move Down */}
                        <button
                          onClick={() => moveTool(index, 'down')}
                          disabled={index === toolsList.length - 1}
                          className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 disabled:opacity-30 hover:bg-slate-100 cursor-pointer disabled:cursor-not-allowed"
                          title="تحريك لأسفل"
                        >
                          <MoveDown className="w-3.5 h-3.5" />
                        </button>

                        {/* Edit Name & Icon */}
                        <button
                          onClick={() => setEditingTool(tool)}
                          className="p-1.5 rounded-lg bg-white border border-slate-200 text-blue-600 hover:bg-blue-50 cursor-pointer"
                          title="تعديل الاسم والأيقونة"
                        >
                          <Settings2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Toggle Visibility */}
                        <button
                          onClick={() => toggleToolVisibility(tool.id)}
                          className={`p-1.5 rounded-lg border cursor-pointer ${
                            tool.visible 
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                              : 'bg-rose-50 text-rose-600 border-rose-200'
                          }`}
                          title={tool.visible ? 'إخفاء العنصر' : 'إظهار العنصر'}
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Custom Tool */}
                        {tool.id.startsWith('custom_') && (
                          <button
                            onClick={() => handleDeleteTool(tool.id)}
                            className="p-1.5 rounded-lg bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 cursor-pointer"
                            title="حذف الأداة"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add New Tool Button & Form */}
              {showAddTool ? (
                <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-3 text-xs">
                  <span className="font-black text-blue-900 block">إضافة عنصر / أداة جديدة:</span>
                  <input 
                    type="text"
                    placeholder="اسم الأداة (مثال: بث مباشر خاص)"
                    value={newToolTitle}
                    onChange={(e) => setNewToolTitle(e.target.value)}
                    className="w-full p-2.5 bg-white border border-blue-200 rounded-xl text-xs font-bold outline-none focus:border-blue-500"
                  />
                  
                  {/* Select Icon */}
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block mb-1.5">اختر أيقونة العنصر:</span>
                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 bg-white rounded-xl border border-slate-200">
                      {Object.keys(AVAILABLE_ICONS).map((iconKey) => {
                        const IconComponent = AVAILABLE_ICONS[iconKey];
                        return (
                          <button
                            key={iconKey}
                            onClick={() => setNewToolIcon(iconKey)}
                            className={`p-2 rounded-lg border transition-all cursor-pointer ${
                              newToolIcon === iconKey 
                                ? 'bg-blue-600 text-white border-blue-600 scale-110 shadow-xs' 
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            <IconComponent className="w-4 h-4" />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={handleAddTool}
                      className="flex-1 py-2 bg-blue-600 text-white font-black text-xs rounded-xl hover:bg-blue-700 cursor-pointer shadow-xs"
                    >
                      حفظ وإضافة
                    </button>
                    <button
                      onClick={() => setShowAddTool(false)}
                      className="py-2 px-3 bg-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-300 cursor-pointer"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAddTool(true)}
                  className="w-full py-2.5 border-2 border-dashed border-blue-300 hover:border-blue-500 text-blue-600 bg-blue-50/50 rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isRtl ? 'إضافة أداة / عنصر جديد' : 'Add New Item / Tool'}</span>
                </button>
              )}

              {/* Save & Close Button */}
              <button 
                onClick={() => setShowManageToolsModal(false)}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-2xl shadow-md transition-all cursor-pointer"
              >
                {isRtl ? 'تم وحفظ التغييرات ✓' : 'Save & Done ✓'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🟡 نافذة تعديل أيقونة واسم أداة محددة */}
      <AnimatePresence>
        {editingTool && (
          <div className="fixed inset-0 z-80 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4" dir={direction}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-slate-200 rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl text-slate-900"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-xs font-black text-slate-900">تعديل العنصر والأيقونة</h3>
                <button onClick={() => setEditingTool(null)} className="p-1.5 bg-slate-100 rounded-full text-slate-600 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block mb-1">اسم الأداة:</span>
                  <input 
                    type="text" 
                    value={editingTool.title}
                    onChange={(e) => setEditingTool({ ...editingTool, title: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 font-bold block mb-1.5">اختر الأيقونة الجديدة:</span>
                  <div className="grid grid-cols-6 gap-1.5 max-h-36 overflow-y-auto p-1.5 bg-slate-50 rounded-xl border border-slate-200">
                    {Object.keys(AVAILABLE_ICONS).map((iconKey) => {
                      const IconComponent = AVAILABLE_ICONS[iconKey];
                      return (
                        <button
                          key={iconKey}
                          onClick={() => setEditingTool({ ...editingTool, iconName: iconKey })}
                          className={`p-2.5 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                            editingTool.iconName === iconKey 
                              ? 'bg-blue-600 text-white border-blue-600 scale-110 shadow-xs' 
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <IconComponent className="w-4 h-4" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <button 
                onClick={() => handleUpdateTool(editingTool.id, editingTool.title, editingTool.iconName)}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md cursor-pointer"
              >
                حفظ التعديل
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* باقي النوافذ التفاعلية (الأرباح، المضيفين، المهام، المحفظة، الفاتورة، إلخ) */}
      {/* ========================================================================= */}

      {/* قسيمة الراتب (تفاصيل الأرباح) المطابقة تماماً للتصميم المرفق */}
      <SalarySlipModal 
        isOpen={showEarningsDetails} 
        onClose={() => setShowEarningsDetails(false)} 
        direction={direction}
      />

      {/* إحصائيات المضيفين المطابقة تماماً لتطبيق YoHo */}
      <HostStatisticsModal
        isOpen={showHostStatsModal}
        onClose={() => setShowHostStatsModal(false)}
        direction={direction}
        initialTab={hostStatsInitialTab}
      />

      {/* المضيفين غير المستكملين */}
      <AnimatePresence>
        {showHostsIncompleteModal && (
          <div className="fixed inset-0 z-60 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4" dir={direction}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white border border-slate-100 rounded-3xl w-full max-w-md p-5 space-y-4 shadow-2xl text-slate-900 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-xs font-black text-slate-900">المضيفين الذين لم يستكملوا أيام البث</h3>
                <button onClick={() => setShowHostsIncompleteModal(false)} className="p-1.5 bg-slate-100 rounded-full text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-emerald-50 border border-emerald-100 p-3.5 rounded-2xl text-center space-y-1">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                <span className="text-xs font-black text-emerald-800 block">جميع المضيفين مستكملين للأيام بنجاح!</span>
                <p className="text-[10px] text-emerald-600">عدد غير المستكملين حالياً: 0 مضيف</p>
              </div>

              <button 
                onClick={() => setShowHostsIncompleteModal(false)}
                className="w-full py-2.5 bg-slate-900 text-white font-black text-xs rounded-xl"
              >
                إغلاق
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* المضيفين ذوي الانخفاض 20% */}
      <AnimatePresence>
        {showHostsDropModal && (
          <div className="fixed inset-0 z-60 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4" dir={direction}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white border border-slate-100 rounded-3xl w-full max-w-md p-5 space-y-4 shadow-2xl text-slate-900 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-xs font-black text-slate-900">المضيفين ذوي الانخفاض (&gt; 20%)</h3>
                  <p className="text-[10px] text-slate-500">متابعة الأداء الشهري للماسات</p>
                </div>
                <button onClick={() => setShowHostsDropModal(false)} className="p-1.5 bg-slate-100 rounded-full text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                {droppedHosts.map((h) => (
                  <div key={h.id} className="p-3 bg-[#F8FAFD] border border-slate-200/80 rounded-2xl flex items-center justify-between text-xs">
                    <div>
                      <div className="font-black text-slate-900">{h.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">UID: {h.uid}</div>
                    </div>
                    <div className="text-left">
                      <span className="text-rose-500 font-mono font-black block">{h.change}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{h.thisMonth} 💎</span>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => setShowHostsDropModal(false)}
                className="w-full py-2.5 bg-slate-900 text-white font-black text-xs rounded-xl"
              >
                إغلاق
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* نافذة مركز المهام */}
      <AnimatePresence>
        {showTaskModal && (
          <div className="fixed inset-0 z-60 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4" dir={direction}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white border border-slate-100 rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl text-slate-900"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-xs font-black text-slate-900">مهمة توظيف مضيفين جدد</h3>
                <button onClick={() => setShowTaskModal(false)} className="p-1.5 bg-slate-100 rounded-full text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 text-xs font-bold text-slate-700 bg-amber-50/60 p-3.5 rounded-2xl border border-amber-200">
                <p>قم بدعوة مضيف جديد وتحقيق شرط بث 15 يوم و30 ساعة للحصول على مكافآت الشارات والماسات.</p>
                <div className="pt-2 flex items-center gap-2 text-amber-800">
                  <span>🏆 الجائزة:</span>
                  <span className="font-mono font-black">+50,000 EXP وشارة النسر الذهبي</span>
                </div>
              </div>

              <button 
                onClick={() => {
                  setShowTaskModal(false);
                  setShowInviteModal(true);
                }}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-md cursor-pointer"
              >
                دعوة مضيف الآن
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* نافذة دعوة المذيعين */}
      <AnimatePresence>
        {showInviteModal && (
          <div className="fixed inset-0 z-60 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4" dir={direction}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white border border-slate-100 rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl text-slate-900"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-xs font-black text-slate-900">دعوة مذيعين لوكالتك</h3>
                <button onClick={() => setShowInviteModal(false)} className="p-1.5 bg-slate-100 rounded-full text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-[#F8FAFD] border border-slate-200 rounded-2xl space-y-1.5">
                  <span className="text-[10px] text-slate-500 font-bold block">رابط الدعوة الخاص بوكالتك:</span>
                  <div className="flex items-center justify-between bg-white border border-slate-200 p-2 rounded-xl">
                    <span className="text-xs font-mono font-bold text-slate-700 truncate">https://yoho.live/agency/join?gid=30032</span>
                    <button 
                      onClick={() => handleCopy('https://yoho.live/agency/join?gid=30032')}
                      className="p-1 text-blue-600 hover:text-blue-700 cursor-pointer"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-[#F8FAFD] border border-slate-200 rounded-2xl space-y-1.5">
                  <span className="text-[10px] text-slate-500 font-bold block">كود الوكالة المباشر:</span>
                  <div className="flex items-center justify-between bg-white border border-slate-200 p-2 rounded-xl">
                    <span className="text-sm font-mono font-black text-slate-900">30032</span>
                    <button 
                      onClick={() => handleCopy('30032')}
                      className="px-2.5 py-1 bg-blue-600 text-white rounded-lg text-xs font-bold cursor-pointer"
                    >
                      نسخ
                    </button>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setShowInviteModal(false)}
                className="w-full py-2.5 bg-slate-900 text-white font-black text-xs rounded-xl"
              >
                تم
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* نافذة إنشاء وكيل شحن */}
      <AnimatePresence>
        {showRechargeAgentModal && (
          <div className="fixed inset-0 z-60 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4" dir={direction}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white border border-slate-100 rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl text-slate-900"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-xs font-black text-slate-900">إنشاء وكيل شحن معتمد</h3>
                <button onClick={() => setShowRechargeAgentModal(false)} className="p-1.5 bg-slate-100 rounded-full text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200 space-y-2 text-xs">
                <div className="flex justify-between items-center font-bold">
                  <span className="text-slate-700">المستوى المكتمل:</span>
                  <span className="font-mono text-amber-700 font-black">2 / 3 وكلاء</span>
                </div>
                <div className="w-full bg-amber-200 h-2 rounded-full overflow-hidden">
                  <div className="w-[66%] bg-amber-500 h-full rounded-full" />
                </div>
                <p className="text-[10px] text-amber-800">متبقي وكيل واحد فقط لإطلاق ميزة الشحن المباشر للعملات بخصم 12%.</p>
              </div>

              <button 
                onClick={() => setShowRechargeAgentModal(false)}
                className="w-full py-2.5 bg-slate-900 text-white font-black text-xs rounded-xl"
              >
                إغلاق
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* نوافذ أدواتي المخصصة التفاعلية */}
      {/* 1. معلومات الوكالة */}
      <AgencyInfoModal
        isOpen={activeToolModal === 'agency_info'}
        onClose={() => setActiveToolModal(null)}
        direction={direction}
        agencyGid={agencyGid}
        agencyName={userName}
      />

      {/* 2. مركز المذيعين */}
      <BroadcasterCenterModal
        isOpen={activeToolModal === 'broadcasters_center'}
        onClose={() => setActiveToolModal(null)}
        direction={direction}
      />

      {/* 3. مركز الوسطاء */}
      <BrokerCenterModal
        isOpen={activeToolModal === 'agents_center'}
        onClose={() => setActiveToolModal(null)}
        direction={direction}
      />

      {/* 4. سجل التحويل */}
      <TransferRecordModal
        isOpen={activeToolModal === 'transfer_logs'}
        onClose={() => setActiveToolModal(null)}
        direction={direction}
      />

      <AnimatePresence>
        {activeToolModal === 'wallet' && (
          <div className="fixed inset-0 z-60 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4" dir={direction}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white border border-slate-100 rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl text-slate-900 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-xs font-black text-slate-900">محفظتي المالية</h3>
                <button onClick={() => setActiveToolModal(null)} className="p-1.5 bg-slate-100 rounded-full text-slate-600"><X className="w-4 h-4" /></button>
              </div>
              <div className="bg-gradient-to-br from-emerald-800 to-teal-900 text-white p-4 rounded-2xl text-center space-y-1">
                <span className="text-[10px] text-emerald-200">الرصيد القابل للسحب</span>
                <div className="text-3xl font-black font-mono text-amber-300">$19.00</div>
              </div>
              <div className="space-y-2">
                <input 
                  type="text" 
                  value={withdrawAddress} 
                  onChange={(e) => setWithdrawAddress(e.target.value)} 
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                  placeholder="عنوان USDT أو الحساب"
                />
                <button 
                  onClick={() => handleCopy('تم تقديم طلب السحب بنجاح')}
                  className="w-full py-2.5 bg-emerald-600 text-white font-black text-xs rounded-xl shadow-md cursor-pointer"
                >
                  سحب الرصيد ($19.00)
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {activeToolModal === 'download_invoice' && (
          <div className="fixed inset-0 z-60 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4" dir={direction}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white border border-slate-100 rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl text-slate-900 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-xs font-black text-slate-900">Download the invoice</h3>
                <button onClick={() => setActiveToolModal(null)} className="p-1.5 bg-slate-100 rounded-full text-slate-600"><X className="w-4 h-4" /></button>
              </div>
              <p className="text-xs text-slate-600 font-bold">تحميل الفاتورة الضريبية وكشف الحساب الرسمي لشهر أغسطس 2026 بصيغة PDF.</p>
              <button 
                onClick={() => {
                  setInvoiceDownloading(true);
                  setTimeout(() => {
                    setInvoiceDownloading(false);
                    setInvoiceDownloaded(true);
                  }, 1200);
                }}
                className="w-full py-2.5 bg-blue-600 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{invoiceDownloaded ? 'تم تحميل الفاتورة بنجاح ✓' : (invoiceDownloading ? 'جاري التحميل...' : 'Download Invoice (PDF)')}</span>
              </button>
            </motion.div>
          </div>
        )}

        {activeToolModal === 'agency_announcement' && (
          <div className="fixed inset-0 z-60 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4" dir={direction}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white border border-slate-100 rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl text-slate-900 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-xs font-black text-slate-900">إعلان الوكالة</h3>
                <button onClick={() => setActiveToolModal(null)} className="p-1.5 bg-slate-100 rounded-full text-slate-600"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs font-bold text-amber-900">
                📢 تنبيه هام لجميع المذيعين: مسابقة أفضل مذيع لشهر أغسطس تنطلق يوم الأحد القادم مع مكافآت ماسية كبرى.
              </div>
              <button onClick={() => setActiveToolModal(null)} className="w-full py-2.5 bg-slate-900 text-white font-black text-xs rounded-xl">إغلاق</button>
            </motion.div>
          </div>
        )}

        {/* Custom Tools Active Modal Fallback */}
        {activeToolModal && activeToolModal.startsWith('custom_') && (
          <div className="fixed inset-0 z-60 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4" dir={direction}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white border border-slate-100 rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl text-slate-900"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-xs font-black text-slate-900">
                  {toolsList.find(t => t.id === activeToolModal)?.title || 'أداة مخصصة'}
                </h3>
                <button onClick={() => setActiveToolModal(null)} className="p-1.5 bg-slate-100 rounded-full text-slate-600"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl text-center space-y-2">
                <Sparkles className="w-7 h-7 text-blue-600 mx-auto" />
                <div className="text-xs font-black text-blue-900">تم فتح الأداة المخصصة بنجاح</div>
                <p className="text-[10px] text-blue-700">هذه أداة مخصصة تمت إضافتها وتعيينها من خلال مركز إدارة العناصر والأيقونات.</p>
              </div>
              <button onClick={() => setActiveToolModal(null)} className="w-full py-2.5 bg-slate-900 text-white font-black text-xs rounded-xl">إغلاق</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default AgencyModal;
