import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, X, Users } from 'lucide-react';
import { LeaderboardThemeConfig } from '../../types/leaderboardTheme';
import { isDeveloper } from '../../lib/roleService';
import { UserProfileData } from '../AdvancedUserProfileModal';

export interface RoomLeaderboardStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAppRole?: string;
  leaderboardTheme: LeaderboardThemeConfig;
  onSelectUserProfile: (user: UserProfileData) => void;
  onOpenFamilyModal: () => void;
  totalRoomSupportDiamonds?: number;
  initialTab?: 'diamonds' | 'club' | 'charm';
  onResetStats?: () => void;
  roomId?: string;
}

export const RoomLeaderboardStatsModal: React.FC<RoomLeaderboardStatsModalProps> = React.memo(({
  isOpen,
  onClose,
  currentAppRole,
  leaderboardTheme,
  onSelectUserProfile,
  onOpenFamilyModal,
  totalRoomSupportDiamonds = 0,
  initialTab = 'diamonds',
  onResetStats,
  roomId
}) => {
  const [statsMainTab, setStatsMainTab] = useState<'diamonds' | 'club' | 'charm'>(initialTab);
  const [statsTimeFilter, setStatsTimeFilter] = useState<'24h' | 'all' | 'weekly'>('24h');
  const [realSupporters, setRealSupporters] = useState<any[]>([]);

  // Reset tab and filter on open, and load real supporters
  useEffect(() => {
    if (isOpen) {
      setStatsMainTab(initialTab);
      setStatsTimeFilter('24h');
      try {
        const key = `room_supporters_leaderboard_${roomId || 'default'}`;
        const raw = localStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            setRealSupporters(parsed);
            return;
          }
        }
      } catch (e) {}
      setRealSupporters([]);
    }
  }, [isOpen, initialTab, roomId]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-transparent flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-auto cursor-default select-none"
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
          >
            {/* Header & Main Tabs Row (Fixed Top Section) */}
            <div className="space-y-2 shrink-0">
              <div className="flex items-center justify-between pb-1 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Trophy
                    className="w-5 h-5"
                    style={{ color: leaderboardTheme.headerIconColor || '#fbbf24' }}
                  />
                  <h2
                    className="text-base font-black"
                    style={{ color: leaderboardTheme.headerTitleColor || '#fde047' }}
                  >
                    إحصائيات ولوحة متصدري الغرفة
                  </h2>
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
                  onClick={() => {
                    setStatsMainTab('diamonds');
                    setStatsTimeFilter('24h');
                  }}
                  style={{
                    background: statsMainTab === 'diamonds' ? leaderboardTheme.diamondsTabGradient : 'transparent',
                    color: statsMainTab === 'diamonds' ? leaderboardTheme.diamondsTabTextColor : leaderboardTheme.inactiveTabTextColor
                  }}
                  className={`py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    statsMainTab === 'diamonds' ? 'shadow-md scale-[1.02]' : 'hover:text-white'
                  }`}
                >
                  💎 المساهمات
                </button>

                <button
                  onClick={() => {
                    setStatsMainTab('club');
                    setStatsTimeFilter('24h');
                  }}
                  style={{
                    background: statsMainTab === 'club' ? leaderboardTheme.clubTabGradient : 'transparent',
                    color: statsMainTab === 'club' ? leaderboardTheme.clubTabTextColor : leaderboardTheme.inactiveTabTextColor
                  }}
                  className={`py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    statsMainTab === 'club' ? 'shadow-md scale-[1.02]' : 'hover:text-white'
                  }`}
                >
                  🛡️ النادي
                </button>

                <button
                  onClick={() => {
                    setStatsMainTab('charm');
                    setStatsTimeFilter('24h');
                  }}
                  style={{
                    background: statsMainTab === 'charm' ? leaderboardTheme.charmTabGradient : 'transparent',
                    color: statsMainTab === 'charm' ? leaderboardTheme.charmTabTextColor : leaderboardTheme.inactiveTabTextColor
                  }}
                  className={`py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    statsMainTab === 'charm' ? 'shadow-md scale-[1.02]' : 'hover:text-white'
                  }`}
                >
                  ✨ الجاذبية
                </button>
              </div>

              {/* Sub-time filters row */}
              <div className="flex items-center justify-center gap-2 pt-1">
                {statsMainTab === 'club' ? (
                  <>
                    <button
                      onClick={() => setStatsTimeFilter('24h')}
                      style={{
                        backgroundColor: statsTimeFilter === '24h' ? leaderboardTheme.filterActiveBg : leaderboardTheme.filterInactiveBg,
                        color: statsTimeFilter === '24h' ? leaderboardTheme.filterActiveText : '#94a3b8'
                      }}
                      className="px-3 py-1 rounded-full text-[11px] font-black transition-all cursor-pointer"
                    >
                      24 ساعة
                    </button>
                    <button
                      onClick={() => setStatsTimeFilter('weekly')}
                      style={{
                        backgroundColor: statsTimeFilter === 'weekly' ? leaderboardTheme.filterActiveBg : leaderboardTheme.filterInactiveBg,
                        color: statsTimeFilter === 'weekly' ? leaderboardTheme.filterActiveText : '#94a3b8'
                      }}
                      className="px-3 py-1 rounded-full text-[11px] font-black transition-all cursor-pointer"
                    >
                      أسبوعي
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setStatsTimeFilter('24h')}
                      style={{
                        backgroundColor: statsTimeFilter === '24h' ? leaderboardTheme.filterActiveBg : leaderboardTheme.filterInactiveBg,
                        color: statsTimeFilter === '24h' ? leaderboardTheme.filterActiveText : '#94a3b8'
                      }}
                      className="px-3 py-1 rounded-full text-[11px] font-black transition-all cursor-pointer"
                    >
                      24 ساعة
                    </button>
                    <button
                      onClick={() => setStatsTimeFilter('all')}
                      style={{
                        backgroundColor: statsTimeFilter === 'all' ? leaderboardTheme.filterActiveBg : leaderboardTheme.filterInactiveBg,
                        color: statsTimeFilter === 'all' ? leaderboardTheme.filterActiveText : '#94a3b8'
                      }}
                      className="px-3 py-1 rounded-full text-[11px] font-black transition-all cursor-pointer"
                    >
                      الإجمالي
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Swipe Container for Leaderboard List (Fixed Flex-1 Scrollable Center Area) */}
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={(_e, info) => {
                const threshold = 35;
                const velocityThreshold = 120;
                const tabsOrder: ('diamonds' | 'club' | 'charm')[] = ['diamonds', 'club', 'charm'];
                const currentIdx = tabsOrder.indexOf(statsMainTab);

                if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
                  if (currentIdx < tabsOrder.length - 1) {
                    setStatsMainTab(tabsOrder[currentIdx + 1]);
                    setStatsTimeFilter('24h');
                  }
                } else if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
                  if (currentIdx > 0) {
                    setStatsMainTab(tabsOrder[currentIdx - 1]);
                    setStatsTimeFilter('24h');
                  }
                }
              }}
              className="flex-1 min-h-0 overflow-y-auto no-scrollbar touch-pan-y cursor-grab active:cursor-grabbing my-2 pr-0.5"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={statsMainTab + statsTimeFilter}
                  initial={{ opacity: 0, x: statsMainTab === 'diamonds' ? 25 : statsMainTab === 'charm' ? -25 : 0 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: statsMainTab === 'diamonds' ? -25 : statsMainTab === 'charm' ? 25 : 0 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="space-y-2"
                >
                  {/* 1. DIAMONDS LEADERBOARD LIST */}
                  {statsMainTab === 'diamonds' && (
                    realSupporters.length === 0 ? (
                      <div className="py-14 flex flex-col items-center justify-center text-center space-y-2.5 text-slate-400">
                        <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-2xl border border-white/10 shadow-inner">
                          💎
                        </div>
                        <p className="text-xs font-black text-slate-200">
                          لا يوجد داعمون مسجلون في المتصدرين حالياً
                        </p>
                        <p className="text-[10px] text-slate-400 max-w-xs leading-relaxed">
                          يتم تسجيل الداعمين الحقيقيين فور إرسال الهدايا والدعم داخل الغرفة
                        </p>
                      </div>
                    ) : (
                      realSupporters.map((item) => (
                        <div
                          key={`diamonds-${item.rank}-${item.userId || item.name}`}
                          onClick={() => {
                            onClose();
                            onSelectUserProfile({
                              id: item.userId || `sup-dia-${item.rank}`,
                              name: item.name,
                              avatar: item.avatar,
                              userId: item.userId || `9920${item.rank}`,
                              country: 'السعودية',
                              countryFlag: '🇸🇦'
                            });
                          }}
                          style={{
                            backgroundColor: leaderboardTheme.cardBg,
                            borderColor: leaderboardTheme.cardBorderColor
                          }}
                          className="p-2.5 border rounded-2xl flex items-center justify-between text-xs transition-all cursor-pointer hover:scale-[1.01] relative overflow-visible shadow-sm"
                        >
                          <div className="flex items-center gap-2 overflow-visible max-w-[72%] relative z-10">
                            {/* Rank Badge (#1 Gold, #2 Silver, #3 Bronze) */}
                            <div
                              className={`w-7 h-7 shrink-0 rounded-xl flex items-center justify-center font-black text-xs shadow-md border ${
                                item.rank === 1
                                  ? 'bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 border-amber-200 ring-2 ring-amber-400/50'
                                  : item.rank === 2
                                  ? 'bg-gradient-to-tr from-slate-300 to-slate-100 text-slate-950 border-slate-200 ring-1 ring-slate-300'
                                  : item.rank === 3
                                  ? 'bg-gradient-to-tr from-amber-700 to-amber-500 text-white border-amber-600'
                                  : 'bg-white/10 text-slate-300 border-white/5'
                              }`}
                            >
                              {item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : item.rank === 3 ? '🥉' : item.rank}
                            </div>

                            {/* Themed Avatar Frame (Top 1, 2, 3 with custom upload / preset support) */}
                            {(() => {
                              const frameConfig =
                                item.rank === 1
                                  ? leaderboardTheme.rank1Frame
                                  : item.rank === 2
                                  ? leaderboardTheme.rank2Frame
                                  : item.rank === 3
                                  ? leaderboardTheme.rank3Frame
                                  : null;

                              if (!frameConfig || item.rank > 3) {
                                return (
                                  <img
                                    src={item.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'}
                                    alt={item.name}
                                    className="w-8 h-8 rounded-full object-cover border border-white/20 shrink-0"
                                  />
                                );
                              }

                              if (frameConfig.type === 'custom_upload' && frameConfig.customImageUrl) {
                                return (
                                  <div className="relative shrink-0 flex items-center justify-center mr-1 z-20 overflow-visible w-9 h-9">
                                    <img
                                      src={frameConfig.customImageUrl}
                                      alt="Custom Frame"
                                      className="absolute inset-0 w-full h-full object-contain pointer-events-none z-30 scale-135"
                                    />
                                    <img
                                      src={item.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'}
                                      alt={item.name}
                                      className="w-7 h-7 rounded-full object-cover relative z-10"
                                    />
                                  </div>
                                );
                              }

                              return (
                                <div className="relative shrink-0 flex items-center justify-center mr-1 z-20 overflow-visible">
                                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[13px] filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] z-30 select-none pointer-events-none">
                                    {frameConfig.crownEmoji || (item.rank === 1 ? '👑' : item.rank === 2 ? '💎' : '✨')}
                                  </span>
                                  <div
                                    className={`p-[2.5px] rounded-full bg-gradient-to-tr ${
                                      frameConfig.borderGradient ||
                                      (item.rank === 1
                                        ? 'from-amber-600 via-yellow-300 to-amber-500'
                                        : item.rank === 2
                                        ? 'from-slate-400 via-white to-slate-300'
                                        : 'from-amber-800 via-amber-500 to-yellow-600')
                                    } relative z-20`}
                                    style={{
                                      boxShadow: `0 0 16px ${
                                        frameConfig.glowColor ||
                                        (item.rank === 1 ? 'rgba(251,191,36,0.85)' : item.rank === 2 ? 'rgba(226,232,240,0.8)' : 'rgba(217,119,6,0.8)')
                                      }`
                                    }}
                                  >
                                    <div className="p-[1px] bg-[#121827] rounded-full">
                                      <img
                                        src={item.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'}
                                        alt={item.name}
                                        className="w-8 h-8 rounded-full object-cover"
                                      />
                                    </div>
                                  </div>
                                  <span
                                    className={`absolute -bottom-1 -right-0.5 text-[8px] rounded-full px-1 font-black shadow-md leading-tight z-30 pointer-events-none ${
                                      frameConfig.badgeBg && frameConfig.badgeBg.startsWith('from-')
                                        ? `bg-gradient-to-r ${frameConfig.badgeBg}`
                                        : ''
                                    }`}
                                    style={{
                                      background:
                                        frameConfig.badgeBg && !frameConfig.badgeBg.startsWith('from-')
                                          ? frameConfig.badgeBg
                                          : undefined,
                                      color:
                                        frameConfig.badgeTextColor ||
                                        (item.rank === 1 ? '#020617' : item.rank === 2 ? '#0f172a' : '#ffffff')
                                    }}
                                  >
                                    {frameConfig.starBadgeEmoji || (item.rank === 1 ? '★' : '✦')}
                                  </span>
                                </div>
                              );
                            })()}

                            {/* Single Line User Metadata: Name, Level, VIP, N-Level */}
                            <div className="flex items-center gap-1.5 truncate overflow-hidden min-w-0">
                              <span
                                className="font-black truncate text-[11px]"
                                style={{ color: leaderboardTheme.cardNameColor }}
                              >
                                {item.name}
                              </span>
                              <span
                                className="text-white text-[8px] font-black px-1.5 py-0.2 rounded-md shrink-0"
                                style={{ backgroundColor: leaderboardTheme.cardMetaLevelBg }}
                              >
                                Lv.{item.level}
                              </span>
                              <span
                                className="text-slate-950 text-[8px] font-black px-1.5 py-0.2 rounded-md shrink-0"
                                style={{ backgroundColor: leaderboardTheme.cardMetaVipBg }}
                              >
                                {item.vip}
                              </span>
                              <span
                                className="text-white text-[8px] font-black px-1.5 py-0.2 rounded-md shrink-0"
                                style={{ backgroundColor: leaderboardTheme.cardMetaNLevelBg }}
                              >
                                {item.nLevel}
                              </span>
                            </div>
                          </div>

                          {/* Value */}
                          <span
                            className="font-mono font-black text-xs dir-ltr shrink-0 pr-1"
                            style={{ color: leaderboardTheme.cardStatsNumberColor }}
                          >
                            {item.val}
                          </span>
                        </div>
                      ))
                    )
                  )}

                  {/* 2. CLUB RANKING LIST */}
                  {statsMainTab === 'club' && (
                    <div className="py-14 flex flex-col items-center justify-center text-center space-y-2.5 text-slate-400">
                      <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-2xl border border-white/10 shadow-inner">
                        🛡️
                      </div>
                      <p className="text-xs font-black text-slate-200">
                        لا توجد أندية أو عائلات متصدرة حالياً
                      </p>
                      <p className="text-[10px] text-slate-400 max-w-xs leading-relaxed">
                        تظهر إحصائيات الأندية والعائلات هنا فور مشاركتهم الفعالة في الغرفة
                      </p>
                    </div>
                  )}

                  {/* 3. CHARM RANKING LIST */}
                  {statsMainTab === 'charm' && (
                    <div className="py-14 flex flex-col items-center justify-center text-center space-y-2.5 text-slate-400">
                      <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-2xl border border-white/10 shadow-inner">
                        ✨
                      </div>
                      <p className="text-xs font-black text-slate-200">
                        لا توجد نقاط جاذبية مسجلة حالياً
                      </p>
                      <p className="text-[10px] text-slate-400 max-w-xs leading-relaxed">
                        يتم احتساب نقاط الجاذبية لمستلمي الهدايا الحقيقيين على المايكات
                      </p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Bottom Action / Footer Bar (Real Zeroed Out Clean Numbers) */}
            <div className="pt-2 border-t border-white/10 shrink-0">
              {statsMainTab === 'diamonds' && (
                <div className="flex items-center justify-between px-2 py-1 text-xs">
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="text-xs select-none">💎</span>
                    <span
                      className="font-black text-xs dir-ltr"
                      style={{ color: leaderboardTheme.cardStatsNumberColor || '#38bdf8' }}
                    >
                      {(totalRoomSupportDiamonds || 0).toLocaleString()} 💎
                    </span>
                  </div>
                  {onResetStats && (totalRoomSupportDiamonds || 0) > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('هل أنت متأكد من رغبتك في تصفير إحصائيات الدعم في الغرفة؟')) {
                          onResetStats();
                        }
                      }}
                      className="text-[10px] text-rose-400 hover:text-rose-300 font-bold px-2 py-0.5 rounded-lg bg-rose-500/10 border border-rose-500/20 cursor-pointer transition-colors"
                    >
                      تصفير السجل 🧹
                    </button>
                  )}
                </div>
              )}

              {statsMainTab === 'club' && (
                <div className="space-y-1.5">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenFamilyModal();
                    }}
                    className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-xs rounded-xl shadow-md hover:brightness-110 cursor-pointer transition-all flex items-center justify-center gap-1.5"
                  >
                    <Users className="w-4 h-4" />
                    <span>انضم الآن إلى النادي العائلي 🛡️</span>
                  </button>
                  <div className="flex items-center justify-center gap-1.5 text-xs font-mono">
                    <span className="text-xs select-none">🛡️</span>
                    <span
                      className="font-black text-xs dir-ltr"
                      style={{ color: leaderboardTheme.cardStatsNumberColor || '#38bdf8' }}
                    >
                      0 نقطة
                    </span>
                  </div>
                </div>
              )}

              {statsMainTab === 'charm' && (
                <div className="flex items-center justify-center gap-1.5 text-xs font-mono py-1">
                  <span className="text-xs select-none">✨</span>
                  <span
                    className="font-black text-xs dir-ltr"
                    style={{ color: leaderboardTheme.cardStatsNumberColor || '#38bdf8' }}
                  >
                    0 نقطة جاذبية
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});

RoomLeaderboardStatsModal.displayName = 'RoomLeaderboardStatsModal';
