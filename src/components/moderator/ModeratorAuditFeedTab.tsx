import React from 'react';
import { Search, Ban, UserMinus, ShieldAlert, ArrowLeft } from 'lucide-react';
import { ModeratorActionLog } from '../../types/moderatorStats';

export interface ModeratorAuditFeedTabProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterType: 'all' | 'kick' | 'drop' | 'mute';
  setFilterType: (type: 'all' | 'kick' | 'drop' | 'mute') => void;
  filteredLogs: ModeratorActionLog[];
  formatTimestamp: (ts: number) => string;
}

/**
 * تبويب سجل الرصد اللحظي لعمليات المشرفين (طرد، تنزيل مايك، كتم)
 * مع شريط البحث والفرز السريع
 */
export const ModeratorAuditFeedTab: React.FC<ModeratorAuditFeedTabProps> = ({
  searchQuery,
  setSearchQuery,
  filterType,
  setFilterType,
  filteredLogs,
  formatTimestamp,
}) => {
  return (
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
  );
};
