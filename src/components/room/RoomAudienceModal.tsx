import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, X, Crown, Shield, Mic, Headphones, Search, Sparkles } from 'lucide-react';

export interface RoomAttendee {
  id: string;
  name: string;
  avatar: string;
  role: 'owner' | 'moderator' | 'vip' | 'listener';
  seatId?: number;
  isMuted?: boolean;
  level?: number;
  vipLevel?: number;
  friendlyPoints?: number;
  country?: string;
}

export interface RoomAudienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  attendees: RoomAttendee[];
  isRoomOwner?: boolean;
  isCurrentAdmin?: boolean;
  onSelectUser?: (user: RoomAttendee) => void;
  onInviteToMic?: (user: RoomAttendee) => void;
}

/**
 * نافذة الحضور المنفصلة كلياً عن الروم (RoomAudienceModal)
 * تُحمّل كسولاً عند النقر على أيقونة الحضور فقط (Lazy Loaded).
 * تعرض العدد والبيانات الحقيقية للمتواجدين دون أي أرقام وهمية.
 */
export const RoomAudienceModal: React.FC<RoomAudienceModalProps> = ({
  isOpen,
  onClose,
  attendees,
  isRoomOwner = false,
  isCurrentAdmin = false,
  onSelectUser,
  onInviteToMic
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'mics' | 'listeners'>('all');

  if (!isOpen) return null;

  // الفلترة الحقيقية للأعضاء المتواجدين
  const filteredAttendees = attendees.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase().trim());
    if (!matchesSearch) return false;

    if (activeTab === 'mics') {
      return Boolean(user.seatId && user.seatId > 0);
    }
    if (activeTab === 'listeners') {
      return !user.seatId || user.seatId === 0;
    }
    return true;
  });

  const micCount = attendees.filter((u) => Boolean(u.seatId && u.seatId > 0)).length;
  const listenerCount = attendees.filter((u) => !u.seatId || u.seatId === 0).length;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 select-none"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-[#131A2A] text-white rounded-t-2xl sm:rounded-2xl border-t sm:border border-amber-500/30 shadow-2xl flex flex-col max-h-[80vh] overflow-hidden"
        dir="rtl"
      >
        {/* 1. Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 shrink-0 bg-[#0F1422]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
              <Users className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-amber-300">المتواجدون في الروم</h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-mono font-black border border-amber-400/30">
                  {attendees.length} عضو حقيقي
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">
                قائمة الحضور المتواجدين حالياً في الغرفة
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            title="إغلاق"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2. Tabs Bar */}
        <div className="flex items-center gap-1.5 px-4 pt-2.5 pb-2 shrink-0 border-b border-white/5 bg-[#121827]">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'all'
                ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            الكل ({attendees.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('mics')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'mics'
                ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Mic className="w-3 h-3" />
            <span>على المايك ({micCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('listeners')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'listeners'
                ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Headphones className="w-3 h-3" />
            <span>مستمعين ({listenerCount})</span>
          </button>
        </div>

        {/* 3. Search Box (إذا كان هناك أكثر من عضو) */}
        {attendees.length > 3 && (
          <div className="px-4 py-2 shrink-0 bg-[#0F1422]">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن عضو..."
                className="w-full bg-[#1A2234] border border-white/10 rounded-xl pr-8 pl-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400/50"
              />
            </div>
          </div>
        )}

        {/* 4. Real Attendees List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5 divide-y divide-white/5">
          {filteredAttendees.length === 0 ? (
            <div className="py-10 text-center flex flex-col items-center justify-center text-slate-400 space-y-2">
              <Users className="w-8 h-8 text-slate-600" />
              <p className="text-xs font-bold">لا يوجد أعضاء مطابقين للبحث</p>
            </div>
          ) : (
            filteredAttendees.map((user) => {
              const isOwner = user.role === 'owner' || user.seatId === 1;
              const isMod = user.role === 'moderator';
              const isOnMic = Boolean(user.seatId && user.seatId > 0);

              return (
                <div
                  key={user.id}
                  onClick={() => {
                    onSelectUser?.(user);
                  }}
                  className="pt-1.5 first:pt-0 flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-all cursor-pointer group"
                >
                  {/* User Profile Info */}
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative shrink-0">
                      <img
                        src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-white/10 group-hover:border-amber-400/80 transition-colors"
                      />
                      {isOwner && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-xs">
                          <Crown className="w-2.5 h-2.5 fill-current" />
                        </div>
                      )}
                      {isMod && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-xs">
                          <Shield className="w-2.5 h-2.5 fill-current" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-white truncate max-w-[130px] sm:max-w-[160px] group-hover:text-amber-300 transition-colors">
                          {user.name}
                        </span>
                        {isOwner && (
                          <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 text-[9px] font-black border border-amber-400/40">
                            مالك
                          </span>
                        )}
                        {isMod && (
                          <span className="px-1.5 py-0.2 rounded-full bg-blue-500/20 text-blue-300 text-[9px] font-black border border-blue-400/40">
                            مشرف
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
                        {isOnMic ? (
                          <span className="flex items-center gap-1 text-emerald-400 font-bold">
                            <Mic className="w-2.5 h-2.5" />
                            <span>على المايك #{user.seatId}</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-slate-400">
                            <Headphones className="w-2.5 h-2.5" />
                            <span>مستمع بالشات</span>
                          </span>
                        )}
                        {user.vipLevel && (
                          <span className="text-amber-400 font-black">VIP{user.vipLevel}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Actions: Invite to mic if viewer is owner/admin and user is a listener */}
                  <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                    {(isRoomOwner || isCurrentAdmin) && !isOnMic && (
                      <button
                        type="button"
                        onClick={() => onInviteToMic?.(user)}
                        className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg text-[10px] font-black transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
                        title="دعوة للصعود إلى المايك"
                      >
                        <Mic className="w-3 h-3 text-amber-400" />
                        <span>دعوة</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => onSelectUser?.(user)}
                      className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                      title="عرض البروفايل"
                    >
                      بروفايل
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* 5. Footer info */}
        <div className="p-2.5 bg-[#0F1422] border-t border-white/10 text-center shrink-0">
          <p className="text-[10px] text-slate-400">
            اضغط على أي مستخدم لعرض بطاقته التعريفية أو التفاعل معه 🌟
          </p>
        </div>
      </motion.div>
    </div>
  );
};
export default RoomAudienceModal;
