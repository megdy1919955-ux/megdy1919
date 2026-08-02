import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Eye, Users, Heart, UserCheck, Crown, Shield, Clock, Search, Gift, Check, UserPlus } from 'lucide-react';
import { StatItem, VisitorUser, FriendUser, FollowerUser, LikeActivity } from '../types';

interface StatDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeStat: StatItem['id'] | null;
  visitors: VisitorUser[];
  friends: FriendUser[];
  followers: FollowerUser[];
  likes: LikeActivity[];
}

export const StatDetailModal: React.FC<StatDetailModalProps> = ({
  isOpen,
  onClose,
  activeStat,
  visitors,
  friends,
  followers,
  likes,
}) => {
  if (!isOpen || !activeStat) return null;

  const getTitle = () => {
    switch (activeStat) {
      case 'visitors':
        return { text: 'الزوار (1,420)', icon: Eye, color: 'text-amber-500' };
      case 'friends':
        return { text: 'الأصدقاء (385)', icon: Users, color: 'text-indigo-500' };
      case 'likes':
        return { text: 'الإعجابات والإنعام (12.8K)', icon: Heart, color: 'text-rose-500' };
      case 'followers':
        return { text: 'المتابعون (4,920)', icon: UserCheck, color: 'text-emerald-500' };
      default:
        return { text: 'تفاصيل الإحصائيات', icon: Eye, color: 'text-blue-500' };
    }
  };

  const { text, icon: Icon, color } = getTitle();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 dir-rtl">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-lg bg-white dark:bg-[#181824] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 max-h-[85vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 px-6 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#1E1E2D]/50">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">{text}</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Filter/Search Subheader */}
          <div className="px-6 pt-3 pb-2 bg-white dark:bg-[#181824]">
            <div className="relative">
              <input
                type="text"
                placeholder="بحث في القائمة..."
                className="w-full py-2 pr-9 pl-4 text-xs rounded-xl bg-slate-100 dark:bg-[#252538] text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50"
              />
              <Search className="w-4 h-4 absolute right-3 top-2.5 text-slate-400" />
            </div>
          </div>

          {/* Body Content */}
          <div className="p-4 px-6 overflow-y-auto flex-1 space-y-3 divide-y divide-slate-100 dark:divide-slate-800/50">
            {activeStat === 'visitors' &&
              visitors.map((v) => (
                <div key={v.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img src={v.avatar} alt={v.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-400/30" />
                      {v.isVIP && (
                        <span className="absolute -bottom-1 -right-1 bg-amber-500 text-[9px] text-white font-black px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-xs">
                          <Crown className="w-2.5 h-2.5" /> VIP
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-slate-100">{v.name}</span>
                        {v.level && (
                          <span className="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 font-extrabold px-1.5 py-0.5 rounded-md">
                            Lv.{v.level}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>زائر • {v.timeAgo}</span>
                      </div>
                    </div>
                  </div>
                  <button className="px-3 py-1.5 text-xs font-bold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors flex items-center gap-1">
                    <UserPlus className="w-3.5 h-3.5" /> متابعة
                  </button>
                </div>
              ))}

            {activeStat === 'friends' &&
              friends.map((f) => (
                <div key={f.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img src={f.avatar} alt={f.name} className="w-12 h-12 rounded-full object-cover" />
                      <span
                        className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-[#181824] ${
                          f.status === 'online'
                            ? 'bg-emerald-500'
                            : f.status === 'in_room'
                            ? 'bg-purple-500 animate-pulse'
                            : 'bg-slate-400'
                        }`}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-slate-100">{f.name}</span>
                        {f.vipTier && (
                          <span className="text-[10px] bg-purple-500/10 text-purple-600 dark:text-purple-400 font-extrabold px-1.5 py-0.5 rounded-md">
                            {f.vipTier}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {f.status === 'in_room'
                          ? 'في غرفة الصوت الان 🎧'
                          : f.status === 'online'
                          ? 'متصل الآن'
                          : 'غير متصل'}
                      </span>
                    </div>
                  </div>
                  <button className="px-3 py-1.5 text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 transition-colors">
                    محادثة
                  </button>
                </div>
              ))}

            {activeStat === 'likes' &&
              likes.map((l) => (
                <div key={l.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img src={l.userAvatar} alt={l.userName} className="w-11 h-11 rounded-full object-cover" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-slate-900 dark:text-slate-100">{l.userName}</span>
                        <span className="text-xs text-rose-500 font-medium">{l.action}</span>
                      </div>
                      <span className="text-[11px] text-slate-400">{l.timeAgo}</span>
                    </div>
                  </div>
                  {l.giftIcon && (
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-xl shadow-xs">
                      {l.giftIcon}
                    </div>
                  )}
                </div>
              ))}

            {activeStat === 'followers' &&
              followers.map((fl) => (
                <div key={fl.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img src={fl.avatar} alt={fl.name} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-slate-100">{fl.name}</span>
                        <span className="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 font-extrabold px-1.5 py-0.5 rounded-md">
                          Lv.{fl.level}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {fl.isFollowingBack ? 'يتابعك • صديق مشترك' : 'متابع جديد'}
                      </span>
                    </div>
                  </div>
                  <button
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors flex items-center gap-1 ${
                      fl.isFollowingBack
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    {fl.isFollowingBack ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> أصدقاء
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5" /> رد المتابعة
                      </>
                    )}
                  </button>
                </div>
              ))}
          </div>

          {/* Footer close button */}
          <div className="p-4 bg-slate-50 dark:bg-[#1E1E2D]/80 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl font-bold text-sm bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
            >
              إغلاق
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
