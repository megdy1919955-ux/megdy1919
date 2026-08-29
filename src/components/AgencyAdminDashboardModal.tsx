import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Building2, 
  Users, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  Search, 
  Filter, 
  ChevronLeft, 
  FileText, 
  DollarSign, 
  Star, 
  Download, 
  RefreshCw, 
  PhoneCall, 
  Mail, 
  Sparkles,
  Layers,
  BarChart3
} from 'lucide-react';

interface AgencyAdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
}

export const AgencyAdminDashboardModal: React.FC<AgencyAdminDashboardModalProps> = ({
  isOpen,
  onClose,
  userId = 'AG9901'
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'agencies' | 'requests' | 'targets'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'verified' | 'pending'>('all');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const MOCK_AGENCIES_DATA = [
    {
      id: '30032',
      name: 'وكالة الأساطير الذهبية (Super Legend VIP)',
      agentName: 'فهد العتيبي',
      agentId: '30032',
      status: 'verified',
      broadcastersCount: 42,
      brokersCount: 5,
      monthlyTargetDiamonds: '12,500,000',
      currentDiamonds: '14,820,000',
      targetCompletion: 118,
      commissionRate: '12%',
      joinedDate: '2026-01-15'
    },
    {
      id: '88410',
      name: 'وكالة نجوم الخليج العالمية',
      agentName: 'سلطان الدوسري',
      agentId: '88410',
      status: 'verified',
      broadcastersCount: 28,
      brokersCount: 3,
      monthlyTargetDiamonds: '8,000,000',
      currentDiamonds: '7,450,000',
      targetCompletion: 93,
      commissionRate: '10%',
      joinedDate: '2026-01-20'
    },
    {
      id: '55120',
      name: 'وكالة الصقور للبث الصوتي',
      agentName: 'عمر القحطاني',
      agentId: '55120',
      status: 'pending',
      broadcastersCount: 15,
      brokersCount: 2,
      monthlyTargetDiamonds: '5,000,000',
      currentDiamonds: '4,100,000',
      targetCompletion: 82,
      commissionRate: '10%',
      joinedDate: '2026-02-05'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 text-right select-none" dir="rtl">
      <div className="relative w-full max-w-2xl bg-slate-950 border-2 border-blue-500/40 rounded-3xl shadow-[0_0_50px_rgba(59,130,246,0.3)] overflow-hidden text-white animate-in fade-in zoom-in duration-200 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)] border border-blue-400/40">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">لوحة تحكم إداري الوكالات</h3>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 font-extrabold px-2.5 py-0.5 rounded-full border border-blue-400/40">
                  صلاحية خاصة 🏛️
                </span>
              </div>
              <p className="text-[11px] text-slate-300">متابعة واعتماد الوكالات، مراقبة التارغت والوسطاء</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-4 pt-3 border-b border-slate-800/80 bg-slate-900/60 overflow-x-auto no-scrollbar">
          {[
            { id: 'overview', title: 'نظرة عامة وإحصائيات', icon: BarChart3 },
            { id: 'agencies', title: 'دليل الوكالات المعتمدة', icon: Building2 },
            { id: 'requests', title: 'طلبات التوثيق والاعتماد', icon: FileText },
            { id: 'targets', title: 'مراقبة التارغت الشهري', icon: TrendingUp },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-t-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600/30 text-blue-300 border-b-2 border-blue-400'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.title}</span>
              </button>
            );
          })}
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 custom-scrollbar">
          
          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Quick Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 bg-slate-900/80 border border-blue-500/30 rounded-2xl">
                  <span className="text-[10px] text-slate-400 font-bold block">إجمالي الوكالات</span>
                  <span className="text-xl font-black text-blue-400 font-mono">18 وكالة</span>
                </div>
                <div className="p-3 bg-slate-900/80 border border-emerald-500/30 rounded-2xl">
                  <span className="text-[10px] text-slate-400 font-bold block">المذيعين النشطين</span>
                  <span className="text-xl font-black text-emerald-400 font-mono">340 مذيع</span>
                </div>
                <div className="p-3 bg-slate-900/80 border border-purple-500/30 rounded-2xl">
                  <span className="text-[10px] text-slate-400 font-bold block">الوسطاء المعتمدين</span>
                  <span className="text-xl font-black text-purple-400 font-mono">48 وسيط</span>
                </div>
                <div className="p-3 bg-slate-900/80 border border-amber-500/30 rounded-2xl">
                  <span className="text-[10px] text-slate-400 font-bold block">إجمالي تداول الماس</span>
                  <span className="text-xl font-black text-amber-400 font-mono">68.4M 💎</span>
                </div>
              </div>

              {/* Agency Highlights Banner */}
              <div className="p-4 bg-gradient-to-r from-blue-900/40 via-slate-900 to-indigo-900/40 border border-blue-500/40 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-blue-300 font-black text-xs">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span>تنبيهات الإدارة والاعتماد الفوري</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  بصفتك إداري الوكالات المعتمد، يمكنك مراجعة طلبات فتح الوكالات الجديدة، توثيق العقود، والتحقق من التزام الوكلاء بنسب العمولات والحد الأدنى لساعات البث.
                </p>
              </div>

              {/* Agencies Performance Table Preview */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-3">
                <h4 className="text-xs font-black text-white flex items-center justify-between">
                  <span>أعلى الوكالات أداءً هذا الشهر</span>
                  <span className="text-[10px] text-slate-400 font-normal">محدث لحظياً ⚡</span>
                </h4>
                <div className="space-y-2">
                  {MOCK_AGENCIES_DATA.map((ag) => (
                    <div key={ag.id} className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span>{ag.name}</span>
                          <span className="text-[9px] bg-blue-950 text-blue-300 px-1.5 py-0.2 rounded border border-blue-800">
                            GID: {ag.id}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          الوكيل: {ag.agentName} | المذيعين: {ag.broadcastersCount} | الوسطاء: {ag.brokersCount}
                        </span>
                      </div>
                      <div className="text-left">
                        <span className="font-mono font-black text-amber-400 block">{ag.currentDiamonds} 💎</span>
                        <span className="text-[10px] text-emerald-400 font-bold">إنجاز {ag.targetCompletion}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Agencies List */}
          {activeTab === 'agencies' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="البحث باسم الوكالة أو معرّف الوكيل..."
                    className="w-full pl-3 pr-9 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                {MOCK_AGENCIES_DATA.filter((ag) => ag.name.includes(searchQuery) || ag.id.includes(searchQuery)).map((ag) => (
                  <div key={ag.id} className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-black text-white">{ag.name}</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          الوكيل المسؤول: <strong className="text-slate-200">{ag.agentName}</strong> (ID: {ag.agentId})
                        </p>
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        معتمدة ونشطة ✓
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 bg-slate-950 p-2.5 rounded-xl text-center text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block">المذيعين</span>
                        <span className="font-bold text-white font-mono">{ag.broadcastersCount}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">نسبة العمولة</span>
                        <span className="font-bold text-blue-400 font-mono">{ag.commissionRate}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">تارغت الشهر</span>
                        <span className="font-bold text-amber-400 font-mono">{ag.monthlyTargetDiamonds}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => showToast(`تم تصدير كشف حساب ${ag.name} بنجاح 📄`)}
                        className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>تصدير كشف الحساب</span>
                      </button>
                      <button
                        onClick={() => showToast(`تم إرسال إشعار رسمي للوكيل ${ag.agentName} 📩`)}
                        className="py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>مراسلة الوكيل</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Requests */}
          {activeTab === 'requests' && (
            <div className="space-y-3">
              <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <h4 className="text-xs font-black text-white">طلب توثيق وكالة جديدة (GID: 77192)</h4>
                  </div>
                  <span className="text-[10px] text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30 font-bold">
                    قيد المراجعة
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  مقدم الطلب: <strong>خالد بن ناصر</strong> (ID: 994101) - اسم الوكالة المقترح: <strong>وكالة الرواد لايف</strong>
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => showToast('تمت الموافقة واعتماد الوكالة رسمياً 🌟')}
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>اعتماد وتوثيق الوكالة</span>
                  </button>
                  <button
                    onClick={() => showToast('تم رفض الطلب وإبلاغ صاحب الحساب')}
                    className="py-2 px-4 bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 text-xs font-bold rounded-xl border border-rose-500/40 transition-all cursor-pointer"
                  >
                    رفض
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Targets */}
          {activeTab === 'targets' && (
            <div className="space-y-3">
              <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-3">
                <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>متابعة التارغت والحوافز الشهرية (فبراير 2026)</span>
                </h4>
                <div className="space-y-2">
                  <div className="p-3 bg-slate-950 rounded-xl space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-300">تارغت الوكالات العام للشبكة</span>
                      <span className="text-amber-400 font-mono">42.5M / 50.0M 💎 (85%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full" style={{ width: '85%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Toast Notification */}
        <AnimatePresence>
          {toastMsg && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white font-bold text-xs px-4 py-2 rounded-full shadow-lg border border-white/20 z-50 flex items-center gap-1.5"
            >
              <span>{toastMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
