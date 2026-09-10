import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldAlert,
  UserMinus,
  Ban,
  MicOff,
  Search,
  Filter,
  Trash2,
  X,
  PlusCircle,
  Crown,
  Clock,
  ArrowLeft,
  Users,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { ModeratorActionLog, SupervisorStatsSummary } from '../types/moderatorStats';
import {
  getModeratorActionLogs,
  getModeratorsSummary,
  recordModeratorAction,
  clearModeratorLogs,
  subscribeToModeratorStats
} from '../lib/moderatorStatsService';
import { getSecretWindowTheme, getComputedModalStyle } from '../lib/secretCustomizerService';
import { WindowThemeConfig } from '../types/secretCustomizer';

interface ModeratorStatsModalProps {
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
    // Filter by type
    if (filterType === 'kick' && log.actionType !== 'kick_room' && log.actionType !== 'ban_user') return false;
    if (filterType === 'drop' && log.actionType !== 'drop_mic') return false;
    if (filterType === 'mute' && log.actionType !== 'mute_seat' && log.actionType !== 'lock_seat') return false;

    // Filter by search query
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

          {/* Tab 1: Live Feed */}
          {activeTab === 'feed' && (
            <div className="flex-1 flex flex-col min-h-0 pt-3">
              {/* Search & Filter Row */}
              <div className="flex items-center gap-2 pb-2.5 shrink-0">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="بحث باسم المشرف أو العضو..."
                    className="w-full bg-slate-900/90 border border-white/10 rounded-xl pr-8 pl-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer"
                    >
                      ×
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0 overflow-x-auto">
                  <button
                    onClick={() => setFilterType('all')}
                    className={`px-2 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                      filterType === 'all'
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-900 border border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    الكل
                  </button>
                  <button
                    onClick={() => setFilterType('kick')}
                    className={`px-2 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer flex items-center gap-0.5 ${
                      filterType === 'kick'
                        ? 'bg-rose-500 text-white'
                        : 'bg-slate-900 border border-white/10 text-rose-300/80 hover:text-white'
                    }`}
                  >
                    <Ban className="w-2.5 h-2.5" />
                    <span>طرد 🚪</span>
                  </button>
                  <button
                    onClick={() => setFilterType('drop')}
                    className={`px-2 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer flex items-center gap-0.5 ${
                      filterType === 'drop'
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-900 border border-white/10 text-amber-300/80 hover:text-white'
                    }`}
                  >
                    <UserMinus className="w-2.5 h-2.5" />
                    <span>تنزيل ⬇️</span>
                  </button>
                </div>
              </div>

              {/* Feed List Items */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {filteredLogs.length === 0 ? (
                  <div className="text-center py-10 text-slate-500 space-y-2">
                    <ShieldAlert className="w-8 h-8 mx-auto text-slate-600 opacity-60" />
                    <p className="text-xs font-bold">لا توجد عمليات مسجلة مطابقة للبحث</p>
                  </div>
                ) : (
                  filteredLogs.map((log) => {
                    const isKick = log.actionType === 'kick_room' || log.actionType === 'ban_user';
                    const isDrop = log.actionType === 'drop_mic';

                    return (
                      <div
                        key={log.id}
                        className={`p-2.5 rounded-2xl border transition-all ${
                          isKick
                            ? 'bg-rose-950/20 border-rose-500/30 hover:border-rose-500/50'
                            : isDrop
                            ? 'bg-amber-950/20 border-amber-500/30 hover:border-amber-500/50'
                            : 'bg-slate-900/60 border-slate-700/50 hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          {/* Moderator & Target Profile */}
                          <div className="flex items-center gap-2">
                            {/* Moderator Avatar */}
                            <div className="relative">
                              <img
                                src={
                                  log.moderatorAvatar ||
                                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
                                }
                                alt={log.moderatorName}
                                className="w-8 h-8 rounded-full object-cover border border-amber-400/60 shadow-xs"
                              />
                              <span className="absolute -bottom-1 -right-1 text-[9px] bg-amber-500 text-slate-950 rounded-full px-1 font-black">
                                🛡️
                              </span>
                            </div>

                            <ArrowLeft className="w-3 h-3 text-slate-500 shrink-0" />

                            {/* Target User Avatar */}
                            <div className="relative">
                              <img
                                src={
                                  log.targetUserAvatar ||
                                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
                                }
                                alt={log.targetUserName}
                                className="w-8 h-8 rounded-full object-cover border border-slate-600 shadow-xs"
                              />
                            </div>

                            {/* Action Description */}
                            <div className="pr-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-xs font-black text-white">
                                  {log.description}
                                </span>
                              </div>
                              {log.reason && (
                                <p className="text-[10px] text-slate-400 font-medium">
                                  السبب: {log.reason}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Action Badge & Timestamp */}
                          <div className="flex flex-col items-end gap-1 shrink-0">
                            <span
                              className={`text-[9.5px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 ${
                                isKick
                                  ? 'bg-rose-500/20 text-rose-300 border border-rose-400/40'
                                  : isDrop
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                                  : 'bg-indigo-500/20 text-indigo-300 border border-indigo-400/40'
                              }`}
                            >
                              {isKick && <Ban className="w-2.5 h-2.5" />}
                              {isDrop && <UserMinus className="w-2.5 h-2.5" />}
                              {log.actionTitle}
                            </span>
                            <span className="text-[9px] text-slate-500 font-mono">
                              {formatTimestamp(log.timestamp)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* Tab 2: Supervisors Breakdown */}
          {activeTab === 'supervisors' && (
            <div className="flex-1 overflow-y-auto space-y-2.5 pt-3 pr-1 custom-scrollbar">
              {summaries.map((sup, idx) => (
                <div
                  key={sup.moderatorName}
                  className="p-3 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-amber-400/40 transition-all flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="relative">
                        <img
                          src={sup.moderatorAvatar}
                          alt={sup.moderatorName}
                          className="w-10 h-10 rounded-full object-cover border-2 border-amber-400/60 shadow-md"
                        />
                        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-slate-950 text-amber-300 font-black text-[10px] flex items-center justify-center border border-amber-400/50">
                          {idx + 1}
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-black text-white">{sup.moderatorName}</h4>
                          {sup.role === 'owner' ? (
                            <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-amber-500 text-slate-950 font-black flex items-center gap-0.5">
                              <Crown className="w-2.5 h-2.5" />
                              مالك الغرفة
                            </span>
                          ) : (
                            <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 font-bold">
                              مشرف معتمد
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 font-mono">
                          إجمالي الإجراءات: {sup.totalActions} عملية
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <div className="text-center px-2 py-1 rounded-xl bg-rose-950/40 border border-rose-500/20">
                        <span className="text-[11px] font-black text-rose-300 font-mono block">
                          {sup.totalKicks}
                        </span>
                        <span className="text-[8.5px] text-rose-400 font-bold">طرد</span>
                      </div>

                      <div className="text-center px-2 py-1 rounded-xl bg-amber-950/40 border border-amber-500/20">
                        <span className="text-[11px] font-black text-amber-300 font-mono block">
                          {sup.totalMicDrops}
                        </span>
                        <span className="text-[8.5px] text-amber-400 font-bold">تنزيل مايك</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer Controls */}
          <div className="pt-3 border-t border-white/10 mt-2 flex items-center justify-between gap-2 shrink-0">
            {/* Quick Action Simulation Buttons for Testing */}
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

            {/* Clear Logs Button (For Owner) */}
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
