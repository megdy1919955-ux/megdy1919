import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, X, Shield, Sparkles, Diamond, ArrowRight, Loader2 } from 'lucide-react';
import { LeaderboardThemeConfig } from '../../types/leaderboardTheme';
import { UserProfileData } from '../AdvancedUserProfileModal';
import { RoomClubModal } from './RoomClubModal';
import { RoomStatsData } from '../../types/roomStats';
import {
  fetchLiveRoomStats,
  getLocalRoomStats,
  joinRoomClub,
  leaveRoomClub
} from '../../services/roomStatsService';

export interface RoomLeaderboardStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAppRole?: string;
  leaderboardTheme: LeaderboardThemeConfig;
  onSelectUserProfile: (user: UserProfileData) => void;
  onOpenFamilyModal?: () => void;
  totalRoomSupportDiamonds?: number;
  initialTab?: 'diamonds' | 'club' | 'charm';
  onResetStats?: () => void;
  roomId?: string;
  roomTitle?: string;
  currentUserId?: string;
  currentUserName?: string;
  currentUserAvatar?: string;
  currentUserLevel?: number | string;
  currentUserVip?: string;
}

export const RoomLeaderboardStatsModal: React.FC<RoomLeaderboardStatsModalProps> = React.memo(({
  isOpen,
  onClose,
  leaderboardTheme,
  onSelectUserProfile,
  initialTab = 'diamonds',
  roomId = 'default-room',
  roomTitle = 'غرفة الصوت الحية',
  currentUserId = 'user_me',
  currentUserName = 'أنا',
  currentUserAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100',
  currentUserLevel = 1,
  currentUserVip = 'VIP1'
}) => {
  const [statsMainTab, setStatsMainTab] = useState<'diamonds' | 'club' | 'charm'>(initialTab);
  const [statsTimeFilter, setStatsTimeFilter] = useState<'24h' | 'all'>('24h');
  const [statsData, setStatsData] = useState<RoomStatsData>(() => getLocalRoomStats(roomId));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showClubModal, setShowClubModal] = useState<boolean>(false);
  const [visibleCount, setVisibleCount] = useState<number>(10);

  // Lazy loading from Firebase server when modal opens
  const loadStats = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchLiveRoomStats(roomId);
      setStatsData(data);
    } catch {
      setStatsData(getLocalRoomStats(roomId));
    } finally {
      setIsLoading(false);
    }
  }, [roomId]);

  useEffect(() => {
    if (isOpen) {
      setStatsMainTab(initialTab);
      setVisibleCount(10);
      loadStats();
    }
  }, [isOpen, initialTab, loadStats]);

  // Reset pagination count when switching tabs or time filters
  const handleTimeFilterChange = (filter: '24h' | 'all') => {
    setStatsTimeFilter(filter);
    setVisibleCount(10);
  };

  const handleMainTabChange = (tab: 'diamonds' | 'club' | 'charm') => {
    setStatsMainTab(tab);
    setVisibleCount(10);
  };

  // Progressive infinite scroll: loads 10 by 10 up to 30 automatically as user scrolls
  const handleListScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (target.scrollTop + target.clientHeight >= target.scrollHeight - 40) {
      setVisibleCount((prev) => Math.min(30, prev + 10));
    }
  };

  // Club Join / Leave
  const handleJoinClub = async () => {
    const updated = await joinRoomClub(roomId, {
      userId: currentUserId,
      name: currentUserName,
      avatar: currentUserAvatar
    });
    setStatsData(updated);
  };

  const handleLeaveClub = async () => {
    const updated = await leaveRoomClub(roomId, currentUserId);
    setStatsData(updated);
  };

  const isClubMember = (statsData.clubMembers || []).some(
    (m) => m.userId === currentUserId || m.name === currentUserName
  );

  // Active lists filtered: 24h vs all-time (30 participants only)
  const activeSupporters =
    statsTimeFilter === '24h'
      ? (statsData.supporters24h || [])
      : (statsData.supporters || []).slice(0, 30);

  const activeCharmReceivers =
    statsTimeFilter === '24h'
      ? (statsData.charmReceivers24h || [])
      : (statsData.charmReceivers || []).slice(0, 30);

  const displayedSupporters = activeSupporters.slice(0, visibleCount);
  const displayedCharmReceivers = activeCharmReceivers.slice(0, visibleCount);

  if (!isOpen) return null;

  return (
    <>
      <AnimatePresence>
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-auto cursor-default select-none"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: '100%', opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: leaderboardTheme.modalBgCustomCss || undefined,
              borderColor: leaderboardTheme.modalBorderColor,
              boxShadow: leaderboardTheme.modalGlowEffect || `0 0 35px ${leaderboardTheme.modalBorderColor}40`
            }}
            className={`w-full max-w-md ${!leaderboardTheme.modalBgCustomCss ? leaderboardTheme.modalBg : ''} border-t-2 sm:border-2 rounded-t-3xl sm:rounded-3xl p-4 text-white shadow-2xl h-[85vh] min-h-[85vh] max-h-[85vh] flex flex-col justify-between pointer-events-auto overflow-hidden sm:mb-4`}
            dir="rtl"
          >
            {/* Header & Main Tabs Row */}
            <div className="space-y-2 shrink-0">
              <div className="flex items-center justify-between pb-1 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Trophy
                    className="w-5 h-5 text-amber-400"
                    style={{ color: leaderboardTheme.headerIconColor || '#fbbf24' }}
                  />
                  <div>
                    <h2
                      className="text-sm font-black text-amber-300"
                      style={{ color: leaderboardTheme.headerTitleColor || '#fde047' }}
                    >
                      إحصائيات ولوحة متصدري الغرفة
                    </h2>
                    <p className="text-[10px] text-slate-400 font-bold truncate max-w-[200px]">
                      {roomTitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={onClose}
                    className="p-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 3 Main Tabs: المساهمات (Diamonds), النادي (Club), الجاذبية (Charm) */}
              <div
                className="grid grid-cols-3 gap-1 p-1 rounded-2xl border border-white/10 text-center"
                style={{ backgroundColor: leaderboardTheme.tabsContainerBg }}
              >
                <button
                  type="button"
                  onClick={() => handleMainTabChange('diamonds')}
                  style={{
                    background: statsMainTab === 'diamonds' ? leaderboardTheme.diamondsTabGradient : 'transparent',
                    color: statsMainTab === 'diamonds' ? leaderboardTheme.diamondsTabTextColor : leaderboardTheme.inactiveTabTextColor
                  }}
                  className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    statsMainTab === 'diamonds' ? 'shadow-md scale-[1.02]' : 'hover:text-white'
                  }`}
                >
                  <Diamond className="w-3.5 h-3.5" />
                  <span>المساهمات</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleMainTabChange('club')}
                  style={{
                    background: statsMainTab === 'club' ? leaderboardTheme.clubTabGradient : 'transparent',
                    color: statsMainTab === 'club' ? leaderboardTheme.clubTabTextColor : leaderboardTheme.inactiveTabTextColor
                  }}
                  className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    statsMainTab === 'club' ? 'shadow-md scale-[1.02]' : 'hover:text-white'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>النادي</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleMainTabChange('charm')}
                  style={{
                    background: statsMainTab === 'charm' ? leaderboardTheme.charmTabGradient : 'transparent',
                    color: statsMainTab === 'charm' ? leaderboardTheme.charmTabTextColor : leaderboardTheme.inactiveTabTextColor
                  }}
                  className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    statsMainTab === 'charm' ? 'shadow-md scale-[1.02]' : 'hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>الجاذبية</span>
                </button>
              </div>

              {/* Sub-time filters row: 24 ساعة | الإجمالي (نظيف وبدون نصوص توضيحية زائدة) */}
              {(statsMainTab === 'diamonds' || statsMainTab === 'charm') && (
                <div className="flex items-center justify-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleTimeFilterChange('24h')}
                    className={`px-4 py-1 rounded-full text-xs font-black transition-all cursor-pointer ${
                      statsTimeFilter === '24h'
                        ? 'bg-cyan-500 text-white shadow-xs'
                        : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    24 ساعة
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTimeFilterChange('all')}
                    className={`px-4 py-1 rounded-full text-xs font-black transition-all cursor-pointer ${
                      statsTimeFilter === 'all'
                        ? 'bg-cyan-500 text-white shadow-xs'
                        : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    الإجمالي
                  </button>
                </div>
              )}
            </div>

            {/* Main Content Area with progressive scroll */}
            <div
              onScroll={handleListScroll}
              className="flex-1 overflow-y-auto px-1 py-2 my-1"
            >
              {isLoading ? (
                <div className="h-full flex flex-col items-center justify-center py-16 space-y-2 text-slate-400">
                  <Loader2 className="w-7 h-7 animate-spin text-cyan-400" />
                  <p className="text-xs font-bold">جاري تحميل إحصائيات الغرفة من السيرفر...</p>
                </div>
              ) : (
                <>
                  {/* TAB 1: المساهمات (الداعمين الحقيقيين) */}
                  {statsMainTab === 'diamonds' && (
                    <div className="space-y-2">
                      {activeSupporters.length === 0 ? (
                        <div className="py-16 flex flex-col items-center justify-center text-center space-y-3">
                          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
                            <span className="text-3xl">💎</span>
                          </div>
                          <div className="space-y-1">
                            <h3 className="text-sm font-black text-slate-200">
                              {statsTimeFilter === '24h'
                                ? 'لا يوجد داعمون نشطون خلال آخر 24 ساعة'
                                : 'لا يوجد داعمون مسجلون في الغرفة حالياً'}
                            </h3>
                          </div>
                        </div>
                      ) : (
                        <>
                          {displayedSupporters.map((item, idx) => {
                            const isMe = item.userId === currentUserId || item.name === currentUserName || item.name === 'أنا' || item.name.includes('(أنا)');
                            const displayLevel = isMe ? (currentUserLevel || item.level) : item.level;
                            const displayVip = isMe ? (currentUserVip || item.vip) : item.vip;
                            const displayName = isMe ? currentUserName : item.name;
                            const displayAvatar = isMe && currentUserAvatar ? currentUserAvatar : item.avatar;

                            return (
                              <div
                                key={item.userId || idx}
                                onClick={() =>
                                  onSelectUserProfile({
                                    id: item.userId,
                                    userId: item.userId,
                                    name: displayName,
                                    avatar: displayAvatar,
                                    bio: isMe ? 'أهلاً بكم في ملفي الشخصي في تطبيق النجم 🌟' : 'داعم الغرفة',
                                    isVerified: true,
                                    level: parseInt(String(displayLevel)) || 1,
                                    vip: displayVip,
                                    followersCount: 0,
                                    followingCount: 0,
                                    sentGiftsCount: item.amount,
                                    receivedGiftsCount: 0
                                  })
                                }
                                className="flex items-center justify-between p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all cursor-pointer"
                              >
                                <div className="flex items-center gap-3">
                                  <span
                                    className={`w-6 text-center font-black text-xs ${
                                      idx === 0
                                        ? 'text-amber-400 text-sm'
                                        : idx === 1
                                        ? 'text-slate-300'
                                        : idx === 2
                                        ? 'text-amber-600'
                                        : 'text-slate-500'
                                    }`}
                                  >
                                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                                  </span>
                                  <img
                                    src={displayAvatar}
                                    alt={displayName}
                                    className="w-10 h-10 rounded-full object-cover border border-cyan-400/30"
                                  />
                                  <div>
                                    <h4 className="text-xs font-black text-white truncate max-w-[130px]">
                                      {displayName}
                                    </h4>
                                    <div className="flex items-center gap-1 mt-0.5">
                                      <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 font-bold">
                                        Lv.{displayLevel}
                                      </span>
                                      {displayVip && (
                                        <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-bold">
                                          {displayVip}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-left font-mono">
                                  <span className="text-xs font-black text-cyan-300">
                                    {item.amount.toLocaleString()} 💎
                                  </span>
                                </div>
                              </div>
                            );
                          })}

                          {/* مؤشر تدريجي عند وجود المزيد أثناء التمرير */}
                          {activeSupporters.length > visibleCount && (
                            <div className="py-2 text-center text-[10px] text-slate-400 font-bold">
                              اسحب للأعلى لتحميل المزيد...
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}

                  {/* TAB 2: نادي الغرفة */}
                  {statsMainTab === 'club' && (
                    <div className="space-y-4">
                      {/* Club Showcase Card */}
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/70 via-slate-900 to-purple-950/50 border border-indigo-500/30 text-center space-y-2.5 relative overflow-hidden">
                        <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center text-2xl shadow-lg border border-cyan-300">
                          🛡️
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-white">نادي {roomTitle}</h4>
                          <p className="text-[11px] text-cyan-200 mt-0.5">
                            المجتمع الرسمي المخصص لأعضاء وداعمي الغرفة
                          </p>
                        </div>

                        <div className="flex items-center justify-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setShowClubModal(true)}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 active:scale-95 text-white font-black text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>فتح نافذة النادي والمميزات</span>
                            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                          </button>
                        </div>
                      </div>

                      {/* Club summary info */}
                      <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                          <span>حالة العضوية الحالية:</span>
                          {isClubMember ? (
                            <span className="text-emerald-300 font-black flex items-center gap-1">
                              <span>مشترك بالنادي</span>
                              <span>🛡️</span>
                            </span>
                          ) : (
                            <span className="text-slate-400">غير مشترك</span>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                          <span>إجمالي أعضاء النادي:</span>
                          <span className="text-white font-black font-mono">
                            {(statsData.clubMembers || []).length} عضو
                          </span>
                        </div>

                        {!isClubMember ? (
                          <button
                            type="button"
                            onClick={handleJoinClub}
                            className="w-full mt-2 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-200 text-xs font-black transition-all cursor-pointer"
                          >
                            + الانضمام للنادي مجاناً
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={handleLeaveClub}
                            className="w-full mt-2 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-[11px] font-bold transition-all cursor-pointer"
                          >
                            مغادرة النادي
                          </button>
                        )}
                      </div>

                      {/* Members list */}
                      {(statsData.clubMembers || []).length > 0 && (
                        <div className="space-y-1.5">
                          <h5 className="text-[11px] font-black text-slate-300 pr-1">
                            أعضاء النادي المسجلون:
                          </h5>
                          {statsData.clubMembers.map((m, idx) => (
                            <div
                              key={m.userId || idx}
                              className="p-2 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between"
                            >
                              <div className="flex items-center gap-2">
                                <img
                                  src={m.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'}
                                  alt={m.name}
                                  className="w-7 h-7 rounded-full object-cover border border-cyan-400/40"
                                />
                                <span className="text-xs font-black text-white truncate max-w-[150px]">
                                  {m.name}
                                </span>
                              </div>
                              <span className="text-[9px] text-cyan-300 font-bold">عضو 🛡️</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 3: الجاذبية (مستلمي الهدايا على المايك) */}
                  {statsMainTab === 'charm' && (
                    <div className="space-y-2">
                      {activeCharmReceivers.length === 0 ? (
                        <div className="py-14 flex flex-col items-center justify-center text-center space-y-3">
                          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
                            <span className="text-3xl">✨</span>
                          </div>
                          <div className="space-y-1">
                            <h3 className="text-sm font-black text-slate-200">
                              {statsTimeFilter === '24h'
                                ? 'لا توجد نقاط جاذبية مسجلة خلال آخر 24 ساعة'
                                : 'لا توجد نقاط جاذبية مسجلة في الغرفة حالياً'}
                            </h3>
                          </div>
                        </div>
                      ) : (
                        <>
                          {displayedCharmReceivers.map((item, idx) => {
                            const isMe = item.userId === currentUserId || item.name === currentUserName || item.name === 'أنا' || item.name.includes('(أنا)');
                            const displayLevel = isMe ? (currentUserLevel || item.level) : item.level;
                            const displayVip = isMe ? (currentUserVip || item.vip) : item.vip;
                            const displayName = isMe ? currentUserName : item.name;
                            const displayAvatar = isMe && currentUserAvatar ? currentUserAvatar : item.avatar;

                            return (
                              <div
                                key={item.userId || idx}
                                onClick={() =>
                                  onSelectUserProfile({
                                    id: item.userId,
                                    userId: item.userId,
                                    name: displayName,
                                    avatar: displayAvatar,
                                    bio: isMe ? 'أهلاً بكم في ملفي الشخصي في تطبيق النجم 🌟' : 'مستلم الدعم في الغرفة',
                                    isVerified: true,
                                    level: parseInt(String(displayLevel)) || 1,
                                    vip: displayVip,
                                    followersCount: 0,
                                    followingCount: 0,
                                    sentGiftsCount: 0,
                                    receivedGiftsCount: item.charmPoints
                                  })
                                }
                                className="flex items-center justify-between p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all cursor-pointer"
                              >
                                <div className="flex items-center gap-3">
                                  <span
                                    className={`w-6 text-center font-black text-xs ${
                                      idx === 0
                                        ? 'text-amber-400 text-sm'
                                        : idx === 1
                                        ? 'text-slate-300'
                                        : idx === 2
                                        ? 'text-amber-600'
                                        : 'text-slate-500'
                                    }`}
                                  >
                                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                                  </span>
                                  <img
                                    src={displayAvatar}
                                    alt={displayName}
                                    className="w-10 h-10 rounded-full object-cover border border-purple-400/30"
                                  />
                                  <div>
                                    <h4 className="text-xs font-black text-white truncate max-w-[130px]">
                                      {displayName}
                                    </h4>
                                    <div className="flex items-center gap-1 mt-0.5">
                                      <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-purple-500/20 text-purple-300 font-bold">
                                        Lv.{displayLevel}
                                      </span>
                                      {displayVip && (
                                        <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-bold">
                                          {displayVip}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-left font-mono">
                                  <span className="text-xs font-black text-purple-300">
                                    {item.charmPoints.toLocaleString()} ✨
                                  </span>
                                </div>
                              </div>
                            );
                          })}

                          {activeCharmReceivers.length > visibleCount && (
                            <div className="py-2 text-center text-[10px] text-slate-400 font-bold">
                              اسحب للأعلى لتحميل المزيد...
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Bottom Footer Bar: إجمالي الروم الصافي بدون أي نصوص توضيحية زائدة */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-center shrink-0">
              <div className="flex items-center gap-1.5 font-mono font-black text-cyan-300 text-xs">
                <span>💎</span>
                <span>{statsData.totalDiamonds.toLocaleString()}</span>
                <span className="text-[10px] text-slate-400 font-sans font-normal">إجمالي دعم الغرفة</span>
                <span>💎</span>
              </div>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>

      {/* Standalone Room Club Modal */}
      {showClubModal && (
        <RoomClubModal
          isOpen={showClubModal}
          onClose={() => setShowClubModal(false)}
          roomTitle={roomTitle}
          clubMembers={statsData.clubMembers || []}
          currentUserId={currentUserId}
          currentUserName={currentUserName}
          currentUserAvatar={currentUserAvatar}
          onJoinClub={handleJoinClub}
          onLeaveClub={handleLeaveClub}
        />
      )}
    </>
  );
});

RoomLeaderboardStatsModal.displayName = 'RoomLeaderboardStatsModal';
