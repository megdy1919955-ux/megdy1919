import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Ban, 
  CheckCircle2, 
  Search, 
  Filter, 
  UserX, 
  RefreshCw, 
  Clock, 
  Radio, 
  MessageSquare, 
  Sparkles, 
  FileText,
  UserCheck,
  Eye,
  Sliders,
  Award
} from 'lucide-react';
import { 
  ModerationReport, 
  getModerationReports, 
  resolveModerationReport, 
  logAuditEvent 
} from '../lib/adminRoleService';

interface ModeratorDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
}

export const ModeratorDashboardModal: React.FC<ModeratorDashboardModalProps> = ({
  isOpen,
  onClose,
  userId = 'MOD330'
}) => {
  const [activeTab, setActiveTab] = useState<'reports' | 'banned_users' | 'room_monitoring' | 'audit_actions'>('reports');
  const [reportsList, setReportsList] = useState<ModerationReport[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Quick action modal state
  const [selectedReport, setSelectedReport] = useState<ModerationReport | null>(null);

  useEffect(() => {
    if (isOpen) {
      setReportsList(getModerationReports());
    }
    const handleUpdate = () => {
      setReportsList(getModerationReports());
    };
    window.addEventListener('moderation_reports_updated', handleUpdate);
    return () => window.removeEventListener('moderation_reports_updated', handleUpdate);
  }, [isOpen]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleApplyPenalty = (reportId: string, penalty: ModerationReport['penaltyApplied']) => {
    resolveModerationReport(reportId, penalty, userId);
    showToast(`✅ تم تطبيق الإجراء (${penalty}) وإغلاق البلاغ بنجاح`);
    setSelectedReport(null);
  };

  const filteredReports = reportsList.filter(
    (r) =>
      r.reportedUserName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.reportedUserId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.reason.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 text-right select-none" dir="rtl">
      <div className="relative w-full max-w-4xl h-[94vh] bg-slate-950 border-2 border-emerald-500/40 rounded-3xl shadow-[0_0_60px_rgba(16,185,129,0.3)] overflow-hidden text-white animate-in fade-in zoom-in duration-200 flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.5)] border border-emerald-400/40">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">لوحة تحكم المراقب العام والدعم الفني</h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-400/40">
                  صلاحية الرقابة 🛡️
                </span>
              </div>
              <p className="text-[11px] text-slate-300">مراقبة البلاغات والشكاوي، إدارة الحظر، وحماية بيئة الرومات</p>
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
            { id: 'reports', title: 'البلاغات والشكاوي الواردة', icon: AlertTriangle, count: reportsList.filter((r) => r.status === 'pending').length },
            { id: 'banned_users', title: 'سجل الحسابات المحظورة', icon: Ban },
            { id: 'room_monitoring', title: 'المراقبة الحية للغرف', icon: Radio },
            { id: 'audit_actions', title: 'سجل الإجراءات الرقابية', icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-600/30 text-emerald-300 border-b-2 border-emerald-400'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.title}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 custom-scrollbar">
          
          {/* TAB 1: REPORTS */}
          {activeTab === 'reports' && (
            <div className="space-y-4">
              
              {/* Search Bar */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="البحث باسم المستخدم أو رقم المعرف أو سبب البلاغ..."
                    className="w-full pl-3 pr-9 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Reports List */}
              <div className="space-y-3">
                {filteredReports.map((report) => {
                  const isPending = report.status === 'pending';
                  return (
                    <div
                      key={report.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        isPending
                          ? 'bg-slate-900/90 border-amber-500/40 shadow-sm'
                          : 'bg-slate-900/50 border-slate-800/80 opacity-75'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${isPending ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
                          <h4 className="text-xs font-black text-white">
                            بلاغ ضد: <strong className="text-rose-400 font-bold">{report.reportedUserName}</strong> (ID: {report.reportedUserId})
                          </h4>
                          <span className="text-[10px] text-slate-400 font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                            {report.id}
                          </span>
                        </div>

                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border self-start sm:self-auto ${
                          isPending ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        }`}>
                          {isPending ? 'قيد المتابعة والتدقيق ⚠️' : `تم اتخاذ إجراء: ${report.penaltyApplied || 'تم الحسم'}`}
                        </span>
                      </div>

                      {/* Details & Reason */}
                      <div className="my-2.5 p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 text-xs space-y-1">
                        <p className="text-slate-200">
                          <strong className="text-slate-400">السبب المدون:</strong> {report.reason}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1">
                          <span>المبلغ: <strong className="text-slate-300">{report.reporterName}</strong> ({report.reporterId})</span>
                          {report.roomTitle && <span>الروم: <strong className="text-blue-300">{report.roomTitle}</strong></span>}
                          <span>التوقيت: <span className="font-mono text-slate-400">{report.createdAt}</span></span>
                        </div>
                      </div>

                      {/* Action Buttons if Pending */}
                      {isPending && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                          <button
                            onClick={() => handleApplyPenalty(report.id, 'warning')}
                            className="py-2 px-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold rounded-xl border border-amber-500/30 transition-all cursor-pointer text-center"
                          >
                            ⚠️ إرسال تحذير رسمي
                          </button>
                          <button
                            onClick={() => handleApplyPenalty(report.id, 'kick_room')}
                            className="py-2 px-3 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 text-xs font-bold rounded-xl border border-indigo-500/30 transition-all cursor-pointer text-center"
                          >
                            🚪 طرد من الغرفة
                          </button>
                          <button
                            onClick={() => handleApplyPenalty(report.id, 'ban_24h')}
                            className="py-2 px-3 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold rounded-xl border border-rose-500/30 transition-all cursor-pointer text-center"
                          >
                            ⏳ حظر مؤقت (24 ساعة)
                          </button>
                          <button
                            onClick={() => handleApplyPenalty(report.id, 'ban_permanent')}
                            className="py-2 px-3 bg-rose-600 hover:bg-rose-500 text-white text-xs font-black rounded-xl transition-all cursor-pointer text-center shadow-md"
                          >
                            🚫 حظر نهائي وشامل
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* TAB 2: BANNED USERS */}
          {activeTab === 'banned_users' && (
            <div className="space-y-3">
              <div className="p-4 bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/30 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-rose-400 font-black text-xs">
                  <Ban className="w-4 h-4" />
                  <span>إدارة قائمة الحسابات المحظورة والمقيدة</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  يمكنك فك الحظر، تعديل مدة العقوبة، ومراجعة سجل الإساءات السابقة لأي مستخدم مخالف.
                </p>
              </div>

              <div className="space-y-2.5">
                {[
                  { id: 'USER_8819', name: 'أحمد التميمي', reason: 'إساءة استخدام المايك في الرومات العامة', banType: 'حظر 24 ساعة', date: '2026-02-27' },
                  { id: 'USER_4102', name: 'سلطان مجهول', reason: 'ترويج روابط خارجية احتيالية', banType: 'حظر دائم', date: '2026-02-26' },
                ].map((u) => (
                  <div key={u.id} className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-2xl flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white flex items-center gap-2">
                        <span>{u.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono bg-slate-950 px-1.5 py-0.2 rounded">ID: {u.id}</span>
                        <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full border border-rose-500/30 font-bold">
                          {u.banType}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-1">السبب: {u.reason}</span>
                    </div>

                    <button
                      onClick={() => showToast(`تم إلغاء الحظر عن ${u.name} بنجاح ✓`)}
                      className="py-1.5 px-3 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      فك الحظر
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ROOM MONITORING */}
          {activeTab === 'room_monitoring' && (
            <div className="space-y-3">
              <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-white flex items-center gap-2">
                    <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <span>الغرف الصوتية النشطة حالياً (Live Rooms Monitor)</span>
                  </h4>
                  <span className="text-[10px] text-emerald-400 font-mono">14 غرفة مفتوحة</span>
                </div>

                <div className="space-y-2">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white block">🎙️ جلسة الأساطير والطرب الخليجي</span>
                      <span className="text-[10px] text-slate-400">المالك: فهد العتيبي | 45 مستمع | 8 مايكات نشطة</span>
                    </div>
                    <button
                      onClick={() => showToast('جاري دخول الغرفة بصفة مراقب عام متخفي 🛡️')}
                      className="py-1.5 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      مراقبة الغرفة
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: AUDIT ACTIONS */}
          {activeTab === 'audit_actions' && (
            <div className="space-y-3">
              <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-3">
                <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>سجل الإجراءات والعقوبات الصادرة</span>
                </h4>
                <div className="space-y-2">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-xs">
                    <div className="flex items-center justify-between font-bold text-white">
                      <span>حظر مؤقت 24 ساعة لـ (عصام الغامدي)</span>
                      <span className="text-[10px] font-mono text-slate-400">2026-02-27 11:30</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">بواسطة المراقب: عبدالرحمن الدعم (MOD330) - السبب: تجاوز في المايك</p>
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
              className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-full shadow-lg border border-white/20 z-50 flex items-center gap-1.5"
            >
              <span>{toastMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
