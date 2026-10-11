/**
 * شاشة القوائم المتكاملة لملف المستخدم (Full-Screen Profile Lists & Social Hub)
 * تشمل القوائم الأربع: الزوار، الأصدقاء، تمت متابعتهم، والمعجبون
 * - شاشة كاملة (Full-Screen) مع إمكانية التنقل بالضغط أو السحب (Swipe / Tabs)
 * - جلب الحسابات الحقيقية من قاعدة بيانات Firestore
 * - عرض تفاصيل الحساب: الصورة، الاسم الرسمي، الـ ID الرقمي، الليفل، والشارات (VIP/SL)
 * - إزالة مربعات البحث الفرعية للتصفح المباشر والسلس
 * - مؤشر تحميل أنيق (Shimmer Loader) وزر عودة سريع
 * تطبيق النجم (Al-Najm Live)
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  Crown,
  Clock,
  UserPlus,
  UserCheck,
  MessageCircle,
  Heart,
  Eye,
  Users,
  UserMinus,
  Sparkles,
  Gift
} from 'lucide-react';
import { StatItem } from '../types';
import { getCurrentAuthUser } from '../lib/authService';
import {
  getFriendsList,
  getFollowingList,
  getVisitorsList,
  getLikesList,
  followUser,
  unfollowUser
} from '../lib/friendService';

type TabType = 'visitors' | 'friends' | 'followers' | 'likes';

interface SocialAccountItem {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  level: number;
  vipTier: string;
  superLegendLevel?: string;
  isOwner?: boolean;
  isFollowing?: boolean;
  isMutualFriend?: boolean;
  timeAgo?: string;
  actionNote?: string;
  giftIcon?: string;
}

interface StatDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeStat: StatItem['id'] | null;
  profile?: any;
  dashboardBadges?: any;
  visitors?: any[];
  friends?: any[];
  followers?: any[];
  likes?: any[];
}

// القوائم تبدأ من الصفر تماماً وتعتمد على السجلات الفعلية للمستخدم
const FALLBACK_ACCOUNTS: Record<TabType, SocialAccountItem[]> = {
  visitors: [],
  friends: [],
  followers: [],
  likes: []
};

const TABS_CONFIG: { id: TabType; title: string; icon: React.ReactNode }[] = [
  { id: 'visitors', title: 'الزوار', icon: <Eye className="w-4 h-4" /> },
  { id: 'friends', title: 'الأصدقاء', icon: <Users className="w-4 h-4" /> },
  { id: 'followers', title: 'تمت متابعتهم', icon: <UserCheck className="w-4 h-4" /> },
  { id: 'likes', title: 'المعجبون', icon: <Heart className="w-4 h-4" /> }
];

export const StatDetailModal: React.FC<StatDetailModalProps> = ({
  isOpen,
  onClose,
  activeStat,
  profile
}) => {
  // التبويب النشط حالياً
  const [currentTab, setCurrentTab] = useState<TabType>(() => {
    if (activeStat === 'visitors' || activeStat === 'friends' || activeStat === 'followers' || activeStat === 'likes') {
      return activeStat;
    }
    return 'visitors';
  });

  const [loading, setLoading] = useState(false);
  const [dataCache, setDataCache] = useState<Record<TabType, SocialAccountItem[]>>(FALLBACK_ACCOUNTS);
  const [followState, setFollowState] = useState<Record<string, boolean>>({});

  // للتحكم في إيماءات السحب (Swipe Gestures)
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // تحديث التبويب إذا تم فتحه من بطاقة معينة
  useEffect(() => {
    if (activeStat && (activeStat === 'visitors' || activeStat === 'friends' || activeStat === 'followers' || activeStat === 'likes')) {
      setCurrentTab(activeStat);
    }
  }, [activeStat]);

  // جلب البيانات الحقيقية من friendService معزولة برقم الـ ID الخاص بالحساب
  useEffect(() => {
    if (!isOpen) return;

    const targetUid = profile?.userId || profile?.id;

    const loadRealAccounts = () => {
      const realFriends = getFriendsList(targetUid).map((f) => ({
        id: f.id,
        userId: f.userId,
        name: f.name,
        avatar: f.avatar,
        level: f.level || 1,
        vipTier: f.vipTier || 'VIP1',
        isFollowing: true,
        isMutualFriend: true,
        actionNote: f.status === 'in_room' ? 'في الغرفة الصوتية 🎧' : 'متصل الآن 🟢'
      }));

      const realFollowers = getFollowingList(targetUid).map((fl) => ({
        id: fl.id,
        userId: fl.userId,
        name: fl.name,
        avatar: fl.avatar,
        level: fl.level,
        vipTier: fl.vipTier,
        isFollowing: true,
        actionNote: 'تتابعه'
      }));

      const realVisitors = getVisitorsList(targetUid).map((v) => ({
        id: v.id,
        userId: v.userId,
        name: v.name,
        avatar: v.avatar,
        level: v.level,
        vipTier: v.vipTier,
        timeAgo: v.timeAgo,
        isFollowing: false
      }));

      const realLikes = getLikesList(targetUid).map((l) => ({
        id: l.id,
        userId: l.userId,
        name: l.name,
        avatar: l.avatar,
        level: l.level,
        vipTier: l.vipTier,
        timeAgo: l.timeAgo,
        actionNote: l.actionNote,
        giftIcon: l.giftIcon
      }));

      setDataCache({
        visitors: realVisitors,
        friends: realFriends,
        followers: realFollowers,
        likes: realLikes
      });
      setLoading(false);
    };

    loadRealAccounts();

    const handleEventUpdate = (e?: Event) => {
      const customEvent = e as CustomEvent;
      const eventUid = customEvent?.detail?.userId;
      if (!eventUid || !targetUid || eventUid === targetUid) {
        loadRealAccounts();
      }
    };

    window.addEventListener('social_stats_updated', handleEventUpdate);
    window.addEventListener('friends_updated', handleEventUpdate);
    window.addEventListener('following_updated', handleEventUpdate);
    window.addEventListener('visitors_updated', handleEventUpdate);
    window.addEventListener('likes_updated', handleEventUpdate);

    return () => {
      window.removeEventListener('social_stats_updated', handleEventUpdate);
      window.removeEventListener('friends_updated', handleEventUpdate);
      window.removeEventListener('following_updated', handleEventUpdate);
      window.removeEventListener('visitors_updated', handleEventUpdate);
      window.removeEventListener('likes_updated', handleEventUpdate);
    };
  }, [isOpen, profile?.userId]);

  if (!isOpen) return null;

  // التنقل بالسحب (Swipe)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    const currentIndex = TABS_CONFIG.findIndex((t) => t.id === currentTab);

    // في الواجهة العربية RTL: السحب لليمين يعني التبويب السابق، والسحب لليسار يعني التبويب التالي
    if (distance > minSwipeDistance && currentIndex < TABS_CONFIG.length - 1) {
      setCurrentTab(TABS_CONFIG[currentIndex + 1].id);
    } else if (distance < -minSwipeDistance && currentIndex > 0) {
      setCurrentTab(TABS_CONFIG[currentIndex - 1].id);
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  // تبديل المتابعة الفعلي
  const handleToggleFollow = (user: SocialAccountItem, initialFollowing: boolean) => {
    const isNowFollowing = followState[user.id] !== undefined ? !followState[user.id] : !initialFollowing;
    setFollowState((prev) => ({ ...prev, [user.id]: isNowFollowing }));
    const targetUid = profile?.userId || profile?.id;
    if (isNowFollowing) {
      followUser(
        {
          id: user.id,
          userId: user.userId,
          name: user.name,
          avatar: user.avatar,
          level: user.level,
          vipTier: user.vipTier
        },
        targetUid
      );
    } else {
      unfollowUser(user.userId || user.id, targetUid);
    }
  };

  const currentList = dataCache[currentTab] || [];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[10000] bg-[#0B0B12] text-slate-100 flex flex-col overflow-hidden select-none"
        dir="rtl"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* ========================================================================= */}
        {/* Header: شريط العنوان والرجوع السريع                                      */}
        {/* ========================================================================= */}
        <div className="bg-[#12121E] border-b border-white/5 pt-12 pb-3 px-4 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 active:scale-95 flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer"
              title="رجوع للبروفايل"
            >
              <ArrowRight className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <span>القوائم الاجتماعية</span>
                <span className="text-[11px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-mono font-bold">
                  {currentList.length} حساب
                </span>
              </h2>
              <p className="text-[11px] text-slate-400 font-medium">
                {profile?.name ? `حساب: ${profile.name}` : 'تطبيق النجم Live'}
              </p>
            </div>
          </div>

          {/* User ID Badge in Header */}
          <div className="text-left bg-white/5 border border-white/10 px-3 py-1 rounded-2xl flex items-center gap-1.5 font-mono text-xs text-amber-400 font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>ID:{profile?.userId || '1001001'}</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Tab Navigation: التبويبات الأربعة مع دعم النقر والتنقل السلس               */}
        {/* ========================================================================= */}
        <div className="bg-[#151524] px-2 py-2 border-b border-white/5 shrink-0">
          <div className="grid grid-cols-4 gap-1.5 max-w-lg mx-auto">
            {TABS_CONFIG.map((tab) => {
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setCurrentTab(tab.id)}
                  className={`relative py-2.5 px-1 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    isActive
                      ? 'text-white font-black'
                      : 'text-slate-400 hover:text-slate-200 font-bold'
                  }`}
                >
                  {/* Active Capsule Glow */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute inset-0 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-2xl shadow-lg shadow-amber-500/25"
                      transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                    />
                  )}

                  <span className={`relative z-10 flex items-center justify-center ${isActive ? 'text-slate-950' : 'text-slate-400'}`}>
                    {tab.icon}
                  </span>
                  <span className={`relative z-10 text-xs truncate max-w-full ${isActive ? 'text-slate-950 font-black' : 'text-slate-300'}`}>
                    {tab.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Content Body: عرض الحسابات أو مؤشر التحميل (Shimmer)                      */}
        {/* ========================================================================= */}
        <div className="flex-1 overflow-y-auto px-4 py-3 divide-y divide-white/5 space-y-2">
          {loading ? (
            /* مؤشر تحميل أنيق (Shimmer Loader) لمنع أي تعليق في الواجهة */
            <div className="space-y-3 pt-2">
              {[1, 2, 3, 4, 5, 6].map((idx) => (
                <div
                  key={idx}
                  className="bg-[#141422] border border-white/5 rounded-2xl p-3.5 flex items-center justify-between animate-pulse"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white/10" />
                    <div className="space-y-2">
                      <div className="w-28 h-3.5 bg-white/10 rounded-md" />
                      <div className="w-16 h-2.5 bg-white/5 rounded-md" />
                    </div>
                  </div>
                  <div className="w-16 h-8 bg-white/10 rounded-xl" />
                </div>
              ))}
            </div>
          ) : currentList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-slate-500">
                <Users className="w-8 h-8" />
              </div>
              <p className="text-sm text-slate-400 font-bold">لا توجد حسابات مسجلة في هذه القائمة حالياً</p>
              <p className="text-xs text-slate-500">سيتم تحديث القائمة تلقائياً عند تفاعل المستخدمين مع حسابك</p>
            </div>
          ) : (
            currentList.map((user) => {
              const isFollowing =
                followState[user.id] !== undefined ? followState[user.id] : user.isFollowing;

              return (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#141422] hover:bg-[#181829] border border-white/5 hover:border-amber-500/30 rounded-2xl p-3 flex items-center justify-between gap-3 transition-all mt-2 shadow-xs"
                >
                  {/* User Profile Card Information */}
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-amber-500/40 shadow-xs"
                      />
                      {user.vipTier && (
                        <span className="absolute -bottom-1 -right-1 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded-full flex items-center gap-0.5 border border-slate-900 shadow-xs">
                          <Crown className="w-2.5 h-2.5 fill-slate-950" /> {user.vipTier}
                        </span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-black text-sm text-white truncate">{user.name}</span>
                        
                        {/* Level Badge */}
                        <span className="text-[9px] bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-mono font-black px-1.5 py-0.5 rounded-md">
                          Lv.{user.level}
                        </span>

                        {/* Super Legend Badge */}
                        {user.superLegendLevel && (
                          <span className="text-[9px] bg-gradient-to-r from-amber-600 to-yellow-600 text-slate-950 font-black px-1.5 py-0.5 rounded-md">
                            {user.superLegendLevel}
                          </span>
                        )}

                        {/* Owner Badge if applicable */}
                        {user.isOwner && (
                          <span className="text-[8px] bg-red-600/30 border border-red-500/50 text-red-300 font-bold px-1.5 py-0.5 rounded-md">
                            المطور 👑
                          </span>
                        )}
                      </div>

                      {/* User Numeric ID & Action Note / Time */}
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400 font-mono">
                        <span className="text-amber-400/90 font-bold">ID: {user.userId}</span>
                        {user.timeAgo && (
                          <span className="flex items-center gap-1 text-slate-500 font-sans">
                            <Clock className="w-3 h-3 text-slate-500" />
                            {user.timeAgo}
                          </span>
                        )}
                        {user.actionNote && (
                          <span className="text-emerald-400/90 font-sans font-medium truncate">
                            • {user.actionNote}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="shrink-0 flex items-center gap-1.5">
                    {/* زر خاص بقائمة المعجبين: عرض أيقونة الهدية أو التفاعل */}
                    {currentTab === 'likes' && user.giftIcon && (
                      <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-sm">
                        {user.giftIcon}
                      </div>
                    )}

                    {/* زر خاص بقائمة الأصدقاء: بدء محادثة مباشرة */}
                    {currentTab === 'friends' ? (
                      <button
                        type="button"
                        onClick={() => {
                          window.dispatchEvent(
                            new CustomEvent('open_direct_chat_with_user', {
                              detail: { userId: user.userId, name: user.name, avatar: user.avatar }
                            })
                          );
                          onClose();
                        }}
                        className="px-3.5 py-2 text-xs font-black bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white rounded-xl shadow-xs transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>محادثة</span>
                      </button>
                    ) : (
                      /* زر المتابعة التفاعلي (متابعة / إلغاء متابعة) */
                      <button
                        type="button"
                        onClick={() => handleToggleFollow(user, user.isFollowing || false)}
                        className={`px-3.5 py-2 text-xs font-black rounded-xl transition-all flex items-center gap-1 cursor-pointer active:scale-95 ${
                          isFollowing
                            ? 'bg-white/10 hover:bg-white/15 text-slate-300 border border-white/10'
                            : 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 shadow-md font-black hover:opacity-95'
                        }`}
                      >
                        {isFollowing ? (
                          <>
                            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                            <span>تتابعه</span>
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-3.5 h-3.5" />
                            <span>متابعة</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Footer info pill */}
        <div className="bg-[#12121E] border-t border-white/5 px-4 py-2.5 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
          <span>اسحب لليمين أو اليسار للتنقل بين القوائم</span>
          <button
            type="button"
            onClick={onClose}
            className="text-amber-400 hover:text-amber-300 font-bold cursor-pointer"
          >
            إغلاق وعودة
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
