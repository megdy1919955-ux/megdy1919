import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mic, Check, UserX, Sparkles, Hand, Users, ShieldCheck } from 'lucide-react';

export interface MicRequestItem {
  id: string;
  userName: string;
  avatar: string;
  level: string;
  vip: string;
  timeAgo: string;
}

interface MicRequestQueueModalProps {
  isOpen: boolean;
  onClose: () => void;
  requests: MicRequestItem[];
  userRole?: 'owner' | 'host' | 'moderator' | 'guest';
  isCurrentAdmin?: boolean;
  onApproveRequest: (request: MicRequestItem) => void;
  onRejectRequest: (requestId: string) => void;
  onApproveAll?: () => void;
  onClearAll?: () => void;
}

export const MicRequestQueueModal: React.FC<MicRequestQueueModalProps> = ({
  isOpen,
  onClose,
  requests,
  userRole = 'owner',
  isCurrentAdmin = true,
  onApproveRequest,
  onRejectRequest,
  onApproveAll,
  onClearAll
}) => {
  if (!isOpen) return null;

  // Strict role check: Only Owner and Moderator/Admin can approve or reject mic queue requests.
  // Host role is restricted from accepting/rejecting queue requests.
  const canManageRequests = userRole === 'owner' || userRole === 'moderator' || (isCurrentAdmin && userRole !== 'host');

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:p-4 bg-transparent transition-all pointer-events-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md bg-[#121827] border-t-2 border-cyan-500/60 border-x border-b border-cyan-500/20 rounded-t-[2.5rem] sm:rounded-3xl p-4 space-y-3 text-white shadow-[0_-12px_60px_rgba(0,0,0,0.85)] max-h-[80vh] flex flex-col dir-rtl"
          dir="rtl"
        >
          {/* BottomSheet Drag Indicator Pill */}
          <div className="pb-1 flex justify-center shrink-0">
            <div className="w-10 h-1 rounded-full bg-white/25" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                <Hand className="w-4 h-4 animate-bounce" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-black text-white">طلبات الصعود للمايك</h2>
                  <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold">
                    {requests.length} طلب
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">قائمة الجمهور المتقدمين لطلب الميكروفون</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Role Status & Quick Global Action Controls */}
          {requests.length > 0 && (
            canManageRequests ? (
              <div className="flex items-center justify-between gap-2 bg-[#1A2234] p-2 rounded-2xl border border-white/5 shrink-0">
                <button
                  onClick={onApproveAll}
                  className="flex-1 py-2 px-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>قبول الجميع ({requests.length})</span>
                </button>

                <button
                  onClick={onClearAll}
                  className="py-2 px-3 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <UserX className="w-3.5 h-3.5 text-rose-400" />
                  <span>مسح القائمة</span>
                </button>
              </div>
            ) : (
              <div className="bg-amber-500/10 border border-amber-500/30 p-2.5 rounded-2xl shrink-0 flex items-center justify-between text-amber-300 text-[11px] font-bold">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>وضع المضيف (Host): مشاهدة الطلبات المعلقة فقط. القبول والرفض محصور لمالك الروم والمشرفين 🛡️</span>
                </div>
              </div>
            )
          )}

          {/* Requests List */}
          <div className="overflow-y-auto space-y-2 flex-1 pr-1 custom-scrollbar">
            {requests.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
                  <Mic className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-slate-300">لا توجد طلبات صعود معلقة حالياً</p>
                <p className="text-[10px] text-slate-500">ستظهر الطلبات هنا عندما يطلب المستمعون المايك ✋</p>
              </div>
            ) : (
              requests.map((req) => (
                <div
                  key={req.id}
                  className="p-3 bg-[#1A2234] border border-white/10 hover:border-cyan-500/40 rounded-2xl flex items-center justify-between gap-2 transition-all"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={req.avatar}
                      alt={req.userName}
                      className="w-10 h-10 rounded-full object-cover border border-cyan-400/50 shrink-0"
                    />
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="font-extrabold text-xs text-white truncate">{req.userName}</span>
                        <span className="text-[9px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-1.5 py-0.2 rounded font-bold shrink-0">
                          {req.vip}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5 text-[9.5px] text-slate-400">
                        <span className="text-amber-400 font-mono font-bold">{req.level}</span>
                        <span>•</span>
                        <span className="text-slate-400">{req.timeAgo}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions: Approve & Reject (Rendered only for Owner and Admin/Moderator) */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {canManageRequests ? (
                      <>
                        <button
                          onClick={() => onApproveRequest(req)}
                          className="py-1.5 px-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1 shadow-md transition-all cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>قبول</span>
                        </button>

                        <button
                          onClick={() => onRejectRequest(req.id)}
                          className="p-1.5 bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-white/10 rounded-xl transition-all cursor-pointer"
                          title="رفض الطلب"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <div className="px-2.5 py-1 bg-slate-800/80 border border-slate-700/60 text-slate-400 font-bold text-[10px] rounded-xl shrink-0 flex items-center gap-1">
                        <span>بانتظار الموافقة 🔒</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
