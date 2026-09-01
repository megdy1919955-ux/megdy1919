import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Crown, Clock, Search, Check, UserPlus, MessageCircle } from 'lucide-react';
import { StatItem, VisitorUser, FriendUser, FollowerUser, LikeActivity } from '../types';
import { isVideoResource, isMediaUrl, getCleanGiftEmoji } from '../lib/giftCmsService';
import { Visitors3DIcon, Friends3DIcon, Following3DIcon, Likes3DIcon } from './profile/RealisticIcons';

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
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen || !activeStat) return null;

  const getHeaderInfo = () => {
    switch (activeStat) {
      case 'visitors':
        return { 
          title: 'سجل الزوار', 
          count: '1,420 زائر', 
          subtitle: 'قائمة بالمستخدمين الذين زاروا ملفك الشخصي مؤخراً',
          icon: <Visitors3DIcon className="w-8 h-8" />
        };
      case 'friends':
        return { 
          title: 'قائمة الأصدقاء', 
          count: '385 صديق', 
          subtitle: 'الأصدقاء المقربون والمشتركون في ترف شات',
          icon: <Friends3DIcon className="w-8 h-8" />
        };
      case 'followers':
        return { 
          title: 'المتابعون', 
          count: '4,920 متابع', 
          subtitle: 'المستخدمون الذين قاموا بمتابعة حسابك',
          icon: <Following3DIcon className="w-8 h-8" />
        };
      case 'likes':
        return { 
          title: 'المعجبون والإعجابات', 
          count: '12.8K إعجاب', 
          subtitle: 'سجل الهدايا والإعجابات الواردة لملفك',
          icon: <Likes3DIcon className="w-8 h-8" />
        };
      default:
        return { 
          title: 'تفاصيل الإحصائيات', 
          count: '', 
          subtitle: '',
          icon: <Visitors3DIcon className="w-8 h-8" />
        };
    }
  };

  const { title, count, subtitle, icon } = getHeaderInfo();

  // Search filtering
  const filteredVisitors = visitors.filter(v => v.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredFriends = friends.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredFollowers = followers.filter(fl => fl.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredLikes = likes.filter(l => l.userName.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4 pointer-events-auto select-none"
        dir="rtl"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 60, scale: 0.96 }}
          transition={{ type: 'spring', damping: 26, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg bg-gradient-to-b from-[#FFFDF9] via-[#FAF6ED] to-[#F3EBD8] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden border-2 border-[#EAD39B] max-h-[85vh] flex flex-col"
        >
          {/* Royal Gold Header */}
          <div className="bg-gradient-to-r from-[#755013] via-[#A8792A] to-[#755013] p-4 px-5 text-white flex items-center justify-between shadow-md shrink-0 border-b border-[#DFC386]">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center shrink-0 shadow-inner">
                {icon}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-black text-base text-white truncate">{title}</h3>
                  {count && (
                    <span className="bg-white/20 text-amber-200 text-xs font-mono font-black px-2.5 py-0.5 rounded-full border border-white/20">
                      {count}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-amber-100/90 font-medium truncate mt-0.5">
                  {subtitle}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0 mr-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Search Subheader */}
          <div className="p-3.5 bg-[#FAF5E8] border-b border-[#DFC386]/60 shrink-0">
            <div className="relative">
              <input
                type="text"
                placeholder="بحث بالاسم أو الرتبة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border-2 border-[#DFC386] rounded-xl pr-9 pl-4 py-2 text-xs text-[#5C3F13] placeholder-[#A89478] font-bold focus:outline-none focus:border-[#B38022] shadow-xs"
              />
              <Search className="w-4 h-4 absolute right-3 top-2.5 text-[#A89478]" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute left-3 top-2.5 text-[#A89478] hover:text-[#5C3F13] text-xs font-bold"
                >
                  مسح
                </button>
              )}
            </div>
          </div>

          {/* Body Content */}
          <div className="p-3 sm:p-4 overflow-y-auto no-scrollbar flex-1 space-y-2.5">
            {activeStat === 'visitors' && (
              filteredVisitors.length === 0 ? (
                <div className="text-center py-12 text-[#8C7355] text-xs font-bold">لم يتم العثور على زوار مطابقين للبحث</div>
              ) : (
                filteredVisitors.map((v) => (
                  <div 
                    key={v.id} 
                    className="bg-white border border-[#DFC386]/70 hover:border-[#B38022] rounded-2xl p-3 flex items-center justify-between gap-3 shadow-xs hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative shrink-0">
                        <img 
                          src={v.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120'} 
                          alt={v.name} 
                          className="w-11 h-11 rounded-full object-cover border-2 border-[#DFC386]" 
                        />
                        {v.isVIP && (
                          <span className="absolute -bottom-1 -right-1 bg-gradient-to-r from-amber-500 to-yellow-400 text-[8px] text-slate-950 font-black px-1.5 py-0.2 rounded-full flex items-center gap-0.5 border border-white shadow-xs">
                            <Crown className="w-2.5 h-2.5 fill-slate-950" /> VIP
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-xs sm:text-sm text-[#5C3F13] truncate">{v.name}</span>
                          {v.level && (
                            <span className="text-[9px] bg-[#755013] text-[#FFF9E6] font-black px-1.5 py-0.2 rounded font-mono">
                              Lv.{v.level}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-[#8C7355] font-semibold mt-0.5">
                          <Clock className="w-3 h-3 text-[#A89478]" />
                          <span>زائر • {v.timeAgo}</span>
                        </div>
                      </div>
                    </div>
                    <button className="px-3.5 py-1.5 text-xs font-black bg-gradient-to-r from-[#755013] to-[#B38022] hover:opacity-95 text-white rounded-xl shadow-xs transition-all flex items-center gap-1 shrink-0 cursor-pointer">
                      <UserPlus className="w-3.5 h-3.5" /> 
                      <span>متابعة</span>
                    </button>
                  </div>
                ))
              )
            )}

            {activeStat === 'friends' && (
              filteredFriends.length === 0 ? (
                <div className="text-center py-12 text-[#8C7355] text-xs font-bold">لم يتم العثور على أصدقاء مطابقين للبحث</div>
              ) : (
                filteredFriends.map((f) => (
                  <div 
                    key={f.id} 
                    className="bg-white border border-[#DFC386]/70 hover:border-[#B38022] rounded-2xl p-3 flex items-center justify-between gap-3 shadow-xs hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative shrink-0">
                        <img 
                          src={f.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120'} 
                          alt={f.name} 
                          className="w-11 h-11 rounded-full object-cover border-2 border-[#DFC386]" 
                        />
                        <span
                          className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
                            f.status === 'online'
                              ? 'bg-emerald-500'
                              : f.status === 'in_room'
                              ? 'bg-purple-500 animate-pulse'
                              : 'bg-slate-400'
                          }`}
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-xs sm:text-sm text-[#5C3F13] truncate">{f.name}</span>
                          {f.vipTier && (
                            <span className="text-[9px] bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black px-1.5 py-0.2 rounded-full border border-white">
                              {f.vipTier}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-[#8C7355] font-semibold block truncate mt-0.5">
                          {f.status === 'in_room'
                            ? 'في غرفة الصوت الآن 🎧'
                            : f.status === 'online'
                            ? 'متصل الآن 🟢'
                            : 'غير متصل'}
                        </span>
                      </div>
                    </div>
                    <button className="px-3.5 py-1.5 text-xs font-black bg-[#FAF5E8] border border-[#DFC386] text-[#755013] hover:bg-[#755013] hover:text-white rounded-xl shadow-xs transition-all flex items-center gap-1 shrink-0 cursor-pointer">
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>محادثة</span>
                    </button>
                  </div>
                ))
              )
            )}

            {activeStat === 'likes' && (
              filteredLikes.length === 0 ? (
                <div className="text-center py-12 text-[#8C7355] text-xs font-bold">لم يتم العثور على إعجابات مطابقة للبحث</div>
              ) : (
                filteredLikes.map((l) => (
                  <div 
                    key={l.id} 
                    className="bg-white border border-[#DFC386]/70 hover:border-[#B38022] rounded-2xl p-3 flex items-center justify-between gap-3 shadow-xs hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img 
                        src={l.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120'} 
                        alt={l.userName} 
                        className="w-11 h-11 rounded-full object-cover border-2 border-[#DFC386] shrink-0" 
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-xs sm:text-sm text-[#5C3F13] truncate">{l.userName}</span>
                          <span className="text-xs text-rose-600 font-bold">{l.action}</span>
                        </div>
                        <span className="text-[10px] text-[#8C7355] font-semibold block mt-0.5">{l.timeAgo}</span>
                      </div>
                    </div>
                    {l.giftIcon && (
                      <div className="w-10 h-10 rounded-xl bg-[#FAF5E8] border border-[#DFC386] flex items-center justify-center text-xl shadow-xs overflow-hidden shrink-0">
                        {isVideoResource(l.giftIcon) ? (
                          <video src={l.giftIcon} autoPlay loop muted playsInline className="w-8 h-8 object-contain" />
                        ) : isMediaUrl(l.giftIcon) ? (
                          <img src={l.giftIcon} alt="gift" className="w-8 h-8 object-contain" />
                        ) : (
                          <span>{getCleanGiftEmoji('', l.giftIcon)}</span>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )
            )}

            {activeStat === 'followers' && (
              filteredFollowers.length === 0 ? (
                <div className="text-center py-12 text-[#8C7355] text-xs font-bold">لم يتم العثور على متابعين مطابقين للبحث</div>
              ) : (
                filteredFollowers.map((fl) => (
                  <div 
                    key={fl.id} 
                    className="bg-white border border-[#DFC386]/70 hover:border-[#B38022] rounded-2xl p-3 flex items-center justify-between gap-3 shadow-xs hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img 
                        src={fl.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120'} 
                        alt={fl.name} 
                        className="w-11 h-11 rounded-full object-cover border-2 border-[#DFC386] shrink-0" 
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-xs sm:text-sm text-[#5C3F13] truncate">{fl.name}</span>
                          <span className="text-[9px] bg-[#755013] text-[#FFF9E6] font-black px-1.5 py-0.2 rounded font-mono">
                            Lv.{fl.level}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#8C7355] font-semibold block mt-0.5">
                          {fl.isFollowingBack ? 'يتابعك • صديق مشترك 🤝' : 'متابع جديد ✨'}
                        </span>
                      </div>
                    </div>
                    <button
                      className={`px-3.5 py-1.5 text-xs font-black rounded-xl transition-all flex items-center gap-1 shrink-0 cursor-pointer ${
                        fl.isFollowingBack
                          ? 'bg-[#FAF5E8] border border-[#DFC386] text-[#755013]'
                          : 'bg-gradient-to-r from-[#755013] to-[#B38022] text-white shadow-xs'
                      }`}
                    >
                      {fl.isFollowingBack ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" /> 
                          <span>أصدقاء</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-3.5 h-3.5" /> 
                          <span>رد المتابعة</span>
                        </>
                      )}
                    </button>
                  </div>
                ))
              )
            )}
          </div>

          {/* Footer */}
          <div className="p-3.5 bg-[#FAF5E8] border-t border-[#DFC386]/60 flex items-center justify-between text-xs text-[#5C3F13] shrink-0">
            <span className="font-bold">تطبيق ترف شات - الإحصائيات الملكية</span>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gradient-to-r from-[#755013] via-[#A8792A] to-[#755013] hover:opacity-95 text-white font-black text-xs rounded-xl shadow-md cursor-pointer"
            >
              إغلاق
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
