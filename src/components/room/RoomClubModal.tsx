import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, X, Users, Gift, Crown, CheckCircle2, LogOut } from 'lucide-react';
import { RoomClubMember } from '../../types/roomStats';

export interface RoomClubModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomTitle: string;
  clubMembers: RoomClubMember[];
  currentUserId: string;
  currentUserName: string;
  currentUserAvatar: string;
  onJoinClub: () => void;
  onLeaveClub: () => void;
}

export const RoomClubModal: React.FC<RoomClubModalProps> = ({
  isOpen,
  onClose,
  roomTitle,
  clubMembers,
  currentUserId,
  currentUserName,
  currentUserAvatar,
  onJoinClub,
  onLeaveClub
}) => {
  const isMember = clubMembers.some((m) => m.userId === currentUserId || m.name === currentUserName);
  const [activeTab, setActiveTab] = useState<'info' | 'members'>('info');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-sm bg-[#0e1626] border border-cyan-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] text-slate-100"
          dir="rtl"
        >
          {/* Header */}
          <div className="p-4 bg-gradient-to-b from-cyan-950/60 to-transparent flex items-center justify-between border-b border-white/10 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center text-white shadow-md">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white">نادي الغرفة</h3>
                <p className="text-[10px] text-cyan-300 font-bold truncate max-w-[190px]">
                  {roomTitle || 'غرفة الصوت الحية'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Sub tabs */}
          <div className="flex border-b border-white/10 bg-slate-900/60 p-1 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('info')}
              className={`flex-1 py-1.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'info'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Gift className="w-3.5 h-3.5" />
              <span>المميزات والاشتراك</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('members')}
              className={`flex-1 py-1.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'members'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>أعضاء النادي ({clubMembers.length})</span>
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {activeTab === 'info' && (
              <div className="space-y-4">
                {/* Hero Club Banner */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-900/50 via-purple-900/30 to-slate-900/60 border border-purple-500/30 text-center space-y-2 relative overflow-hidden">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-2xl shadow-lg border border-yellow-200">
                    🛡️
                  </div>
                  <h4 className="text-sm font-black text-amber-200">
                    نادي {roomTitle || 'الغرفة'}
                  </h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed max-w-xs mx-auto">
                    انضم الآن لتكون عضواً مميزاً في مجتمع الغرفة، وتحصل على هدايا ومكافآت مخصصة من صاحب الغرفة!
                  </p>

                  {isMember && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-black text-[10px] mt-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>أنت عضو رسمي في نادي الغرفة</span>
                    </div>
                  )}
                </div>

                {/* Features List */}
                <div className="space-y-2 bg-white/5 p-3 rounded-2xl border border-white/10">
                  <h5 className="font-black text-slate-200 flex items-center gap-1.5 text-[11px]">
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                    <span>مزايا عضوية النادي:</span>
                  </h5>
                  <ul className="space-y-1.5 text-[10px] text-slate-300 pr-1">
                    <li className="flex items-center gap-1.5">
                      <span className="text-cyan-400">✦</span>
                      <span>الحصول على هدايا مخصصة يحددها صاحب الغرفة.</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="text-cyan-400">✦</span>
                      <span>شارة النادي الحصرية تظهر بجانب اسمك ومشاركاتك.</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="text-cyan-400">✦</span>
                      <span>أولوية الترحيب والدخول المميز في الغرفة.</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="text-cyan-400">✦</span>
                      <span>الاشتراك حالياً متاح مجاناً وبدون أي رسوم.</span>
                    </li>
                  </ul>
                </div>

                {/* Action button */}
                <div className="pt-2">
                  {!isMember ? (
                    <button
                      type="button"
                      onClick={onJoinClub}
                      className="w-full py-3 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:brightness-110 active:scale-98 text-white font-black text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Shield className="w-4 h-4" />
                      <span>الانضمام إلى نادي الغرفة الآن (مجاناً)</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={onLeaveClub}
                      className="w-full py-2.5 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-black text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>مغادرة النادي</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'members' && (
              <div className="space-y-2">
                {clubMembers.length === 0 ? (
                  <div className="py-12 flex flex-col items-center justify-center text-center space-y-2 text-slate-400">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-2xl border border-white/10">
                      🛡️
                    </div>
                    <p className="text-xs font-black text-slate-200">
                      لا يوجد أعضاء في النادي حتى الآن
                    </p>
                    <p className="text-[10px] text-slate-400 max-w-xs">
                      كن أول المنضمين إلى نادي الغرفة واحصل على التميز!
                    </p>
                  </div>
                ) : (
                  clubMembers.map((member, idx) => (
                    <div
                      key={member.userId || idx}
                      className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={member.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'}
                          alt={member.name}
                          className="w-8 h-8 rounded-full object-cover border border-cyan-400/40"
                        />
                        <div>
                          <p className="text-[11px] font-black text-white truncate max-w-[140px]">
                            {member.name}
                          </p>
                          <span className="text-[8.5px] text-cyan-300 flex items-center gap-1">
                            <Shield className="w-2.5 h-2.5" />
                            <span>عضو معتمد</span>
                          </span>
                        </div>
                      </div>
                      <span className="text-[9px] text-slate-400 font-mono">
                        {new Date(member.joinedAt || Date.now()).toLocaleDateString('ar-SA')}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
