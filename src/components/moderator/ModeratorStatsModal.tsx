import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldAlert,
  UserMinus,
  Ban,
  MicOff,
  Trash2,
  X,
  Clock,
  Users,
} from 'lucide-react';
import { ModeratorActionLog, SupervisorStatsSummary } from '../../types/moderatorStats';
import {
  getModeratorActionLogs,
  getModeratorsSummary,
  recordModeratorAction,
  clearModeratorLogs,
  subscribeToModeratorStats
} from '../../lib/moderatorStatsService';
import { getSecretWindowTheme, getComputedModalStyle } from '../../lib/secretCustomizerService';
import { WindowThemeConfig } from '../../types/secretCustomizer';
import { ModeratorAuditFeedTab } from './ModeratorAuditFeedTab';
import { ModeratorSupervisorsTab } from './ModeratorSupervisorsTab';

export interface ModeratorStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserRole?: 'owner' | 'host' | 'moderator' | 'guest';
  roomTitle?: string;
  onTriggerToast?: (msg: string) => void;
}

export const ModeratorStatsModal: React.FC<ModeratorStatsModalProps> = ({
  isOpen,
  onClose,
  currentUserRole = 'owner',
  roomTitle = 'روم السهرة والصوتيات 🌟',
  onTriggerToast
}) => {
  const [logs, setLogs] = useState<ModeratorActionLog[]>(() => getModeratorActionLogs());
  const [activeTab, setActiveTab] = useState<'feed' | 'supervisors'>('feed');
  const [filterType, setFilterType] = useState<'all' | 'kick' | 'drop' | 'mute'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [theme] = useState<WindowThemeConfig>(() => getSecretWindowTheme('top_options'));

  useEffect(() => {
    const unsub = subscribeToModeratorStats((updated) => {
      setLogs(updated);
    });
    return unsub;
  }, []);

  if (!isOpen) return null;

  const isOwner = currentUserRole === 'owner';
  const summaries: SupervisorStatsSummary[] = getModeratorsSummary(logs);

  const totalKicks = logs.filter((l) => l.actionType === 'kick_room' || l.actionType === 'ban_user').length;
  const totalDrops = logs.filter((l) => l.actionType === 'drop_mic').length;
  const totalMutes = logs.filter((l) => l.actionType === 'mute_seat' || l.actionType === 'lock_seat').length;

  const filteredLogs = logs.filter((log) => {
    if (filterType === 'kick' && log.actionType !== 'kick_room' && log.actionType !== 'ban_user') return false;
    if (filterType === 'drop' && log.actionType !== 'drop_mic') return false;
    if (filterType === 'mute' && log.actionType !== 'mute_seat' && log.actionType !== 'lock_seat') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchMod = log.moderatorName.toLowerCase().includes(q);
      const matchTarget = log.targetUserName.toLowerCase().includes(q);
      const matchDesc = log.description.toLowerCase().includes(q);
      if (!matchMod && !matchTarget && !matchDesc) return false;
    }
    return true;
  });

  const formatTimestamp = (ts: number) => {
    const diff = Date.now() - ts;
    const minutes = Math.floor(diff / (1000 * 60));
    if (minutes < 1) return 'الآن';
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `منذ ${hours} ساعة`;
    const d = new Date(ts);
    return `${d.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}`;
  };

  const handleSimulateQuickAction = (type: 'kick' | 'drop') => {
    if (type === 'kick') {
      const targets = ['روح', 'سلطان', 'نواف', 'ريم', 'فارس'];
      const target = targets[Math.floor(Math.random() * targets.length)];
      recordModeratorAction({
        moderatorName: 'المشرف عابر',
        moderatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
        moderatorRole: 'moderator',
        targetUserName: target,
        actionType: 'kick_room',
        actionTitle: 'طرد من الغرفة',
        description: `المشرف عابر قام بطرد ${target} من الغرفة`,
        reason: 'مخالفة آداب الروم'
      });
      onTriggerToast?.(`🚪 تم تسجيل: المشرف عابر قام بطرد ${target} من الغرفة`);
    } else {
      const targets = ['روح', 'خالد العتيبي', 'أصيل', 'ماجد', 'سارة'];
      const target = targets[Math.floor(Math.random() * targets.length)];
      const seatNum = Math.floor(Math.random() * 8) + 1;
      recordModeratorAction({
        moderatorName: 'المشرف عابر',
        moderatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
        moderatorRole: 'moderator',
        targetUserName: target,
        targetSeatId: seatNum,
        actionType: 'drop_mic',
        actionTitle: 'إنزال من المايك',
        description: `المشرف عابر قام بإنزال ${target} من المايك #${seatNum}`,
        reason: 'إفساح المقعد للمتحدثين'
      });
      onTriggerToast?.(`⬇️ تم تسجيل: المشرف عابر قام بإنزال ${target} من المايك #${seatNum}`);
    }
  };

  const handleClear = () => {
    if (window.confirm('هل أنت متأكد من رغبتك في تصفير سجل إحصائيات المشرفين؟')) {
      clearModeratorLogs();
      onTriggerToast?.('تم مسح وتصفير سجل إحصائيات المشرفين 🧹');
    }
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[70] bg-transparent flex items-center justify-center p-3 sm:p-4 pointer-events-auto select-none dir-rtl"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 15 }}
          transition={{ type: 'spring', stiffness: 340, damping: 26 }}
          onClick={(e) => e.stopPropagation()}
          style={getComputedModalStyle(theme)}
          className="w-full max-w-lg rounded-3xl p-4 sm:p-5 shadow-2xl relative overflow-hidden flex flex-col max-h-[85vh] border border-amber-500/20 bg-slate-950 text-white"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-rose-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <ShieldAlert className="w-5 h-5 text-slate-950 stroke-[2.4]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="text-base sm:text-lg font-black text-amber-300 tracking-tight">
                    إحصائيات وسجل المشرفين
                  </h2>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                    Live Audit 🛡️
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium line-clamp-1">
                  رصد عمليات الطرد وتنزيل المايكات للمشرفين في: {roomTitle}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Counter Summary Cards */}
          <div className="grid grid-cols-3 gap-2 py-3 shrink-0">
            {/* Kicks Card */}
            <div className="bg-gradient-to-br from-rose-950/60 to-rose-900/30 border border-rose-500/30 rounded-2xl p-2.5 flex flex-col items-center justify-center text-center shadow-md relative overflow-hidden">
              <div className="flex items-center gap-1 text-rose-400 mb-1">
                <Ban className="w-3.5 h-3.5" />
                <span className="text-[11px] font-extrabold">طرد الأعضاء</span>
              </div>
              <span className="text-xl sm:text-2xl font-black font-mono text-rose-200">
                {totalKicks}
              </span>
              <span className="text-[9px] text-rose-400/80 font-bold">عملية طرد</span>
            </div>

            {/* Mic Drops Card */}
            <div className="bg-gradient-to-br from-amber-950/60 to-amber-900/30 border border-amber-500/30 rounded-2xl p-2.5 flex flex-col items-center justify-center text-center shadow-md relative overflow-hidden">
              <div className="flex items-center gap-1 text-amber-400 mb-1">
                <UserMinus className="w-3.5 h-3.5" />
                <span className="text-[11px] font-extrabold">تنزيل من المايك</span>
              </div>
              <span className="text-xl sm:text-2xl font-black font-mono text-amber-200">
                {totalDrops}
              </span>
              <span className="text-[9px] text-amber-400/80 font-bold">إنزال للمقعد</span>
            </div>

            {/* Mutes Card */}
            <div className="bg-gradient-to-br from-indigo-950/60 to-indigo-900/30 border border-indigo-500/30 rounded-2xl p-2.5 flex flex-col items-center justify-center text-center shadow-md relative overflow-hidden">
              <div className="flex items-center gap-1 text-indigo-400 mb-1">
                <MicOff className="w-3.5 h-3.5" />
                <span className="text-[11px] font-extrabold">كتم وقفل</span>
              </div>
              <span className="text-xl sm:text-2xl font-black font-mono text-indigo-200">
                {totalMutes}
              </span>
              <span className="text-[9px] text-indigo-400/80 font-bold">إجراء كتم</span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 bg-slate-900/90 p-1 rounded-2xl border border-white/10 shrink-0">
            <button
              onClick={() => setActiveTab('feed')}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'feed'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>سجل العمليات اللحظي ({filteredLogs.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('supervisors')}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'supervisors'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>ترتيب المشرفين ({summaries.length})</span>
            </button>
          </div>

          {/* Tab 1: Live Feed Tab Component */}
          {activeTab === 'feed' && (
            <ModeratorAuditFeedTab
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filterType={filterType}
              setFilterType={setFilterType}
              filteredLogs={filteredLogs}
              formatTimestamp={formatTimestamp}
            />
          )}

          {/* Tab 2: Supervisors Breakdown Tab Component */}
          {activeTab === 'supervisors' && (
            <ModeratorSupervisorsTab summaries={summaries} />
          )}

          {/* Footer Controls */}
          <div className="pt-3 border-t border-white/10 mt-2 flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleSimulateQuickAction('drop')}
                className="px-2.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 text-[10.5px] font-black flex items-center gap-1 transition-all cursor-pointer"
                title="تسجيل عملية تنزيل من المايك فورية للمشرف عابر"
              >
                <UserMinus className="w-3 h-3" />
                <span>+ تجربة تنزيل مايك</span>
              </button>

              <button
                onClick={() => handleSimulateQuickAction('kick')}
                className="px-2.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/40 text-rose-300 text-[10.5px] font-black flex items-center gap-1 transition-all cursor-pointer"
                title="تسجيل عملية طرد فورية للمشرف عابر"
              >
                <Ban className="w-3 h-3" />
                <span>+ تجربة طرد</span>
              </button>
            </div>

            {isOwner && (
              <button
                onClick={handleClear}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-300 border border-white/10 transition-all cursor-pointer"
                title="تصفير ومسح السجل"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ModeratorStatsModal;
