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
}

export const RoomLeaderboardStatsModal: React.FC<RoomLeaderboardStatsModalProps> = React.memo(({
  isOpen,
  onClose,
  currentAppRole,
  leaderboardTheme,
  onSelectUserProfile,
  onOpenFamilyModal,
  initialTab = 'diamonds'
}) => {
  const [statsMainTab, setStatsMainTab] = useState<'diamonds' | 'club' | 'charm'>(initialTab);
  const [statsTimeFilter, setStatsTimeFilter] = useState<'24h' | 'all' | 'weekly'>('24h');

  // Reset tab and filter on open
  useEffect(() => {
    if (isOpen) {
      setStatsMainTab(initialTab);
      setStatsTimeFilter('24h');
    }
  }, [isOpen, initialTab]);

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
                    (statsTimeFilter === '24h' ? [
                      { rank: 1, name: 'الأمير أسامة (الرئيس)', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100', level: '88', vip: 'VIP8', nLevel: 'N.15', val: '18,500,000 💎' },
                      { rank: 2, name: 'سارة الكابيتانو', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=100', level: '75', vip: 'VIP6', nLevel: 'N.12', val: '12,200,000 💎' },
                      { rank: 3, name: 'صقر الشام', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100', level: '64', vip: 'VIP5', nLevel: 'N.10', val: '9,300,000 💎' },
                      { rank: 4, name: 'الملك الكويتي', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100', level: '52', vip: 'VIP4', nLevel: 'N.8', val: '5,100,000 💎' },
                      { rank: 5, name: 'الدكتورة هناء', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100', level: '48', vip: 'VIP3', nLevel: 'N.6', val: '3,400,000 💎' }
                    ] : [
                      { rank: 1, name: 'السلطان قابوس', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100', level: '99', vip: 'VIP9', nLevel: 'N.20', val: '120,500,000 💎' },
                      { rank: 2, name: 'الأمير أسامة (الرئيس)', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100', level: '88', vip: 'VIP8', nLevel: 'N.15', val: '95,000,000 💎' },
                      { rank: 3, name: 'شيخ الشباب', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100', level: '82', vip: 'VIP7', nLevel: 'N.14', val: '68,200,000 💎' },
                      { rank: 4, name: 'لورد بغداد', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100', level: '71', vip: 'VIP6', nLevel: 'N.11', val: '42,000,000 💎' }
                    ]).map((item) => (
                      <div
                        key={`diamonds-${statsTimeFilter}-${item.rank}-${item.name}`}
                        onClick={() => {
                          onClose();
                          onSelectUserProfile({
                            id: `sup-dia-${item.rank}`,
                            name: item.name,
                            avatar: item.avatar,
                            userId: `9920${item.rank}`,
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
                  )}

                  {/* 2. CLUB RANKING LIST */}
                  {statsMainTab === 'club' && (
                    (statsTimeFilter === '24h' ? [
                      { rank: 1, name: 'نادي الفرسان الذهب', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100', level: '80', vip: 'VIP8', nLevel: 'N.16', val: '240,000 نقطة' },
                      { rank: 2, name: 'نادي الملوك والعظماء', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100', level: '72', vip: 'VIP7', nLevel: 'N.14', val: '180,000 نقطة' },
                      { rank: 3, name: 'نادي النجوم الأسطوري', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=100', level: '65', vip: 'VIP5', nLevel: 'N.11', val: '135,000 نقطة' }
                    ] : [
                      { rank: 1, name: 'نادي الصقور العالمية', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100', level: '90', vip: 'VIP9', nLevel: 'N.18', val: '1,250,000 نقطة' },
                      { rank: 2, name: 'نادي الفرسان الذهب', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100', level: '80', vip: 'VIP8', nLevel: 'N.16', val: '980,000 نقطة' },
                      { rank: 3, name: 'نادي عشاق الطرب', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100', level: '68', vip: 'VIP6', nLevel: 'N.12', val: '740,000 نقطة' }
                    ]).map((item) => (
                      <div
                        key={`club-${statsTimeFilter}-${item.rank}-${item.name}`}
                        style={{
                          backgroundColor: leaderboardTheme.cardBg,
                          borderColor: leaderboardTheme.cardBorderColor
                        }}
                        className="p-2.5 border rounded-2xl flex items-center justify-between text-xs transition-colors relative overflow-visible shadow-sm"
                      >
                        <div className="flex items-center gap-2 overflow-visible max-w-[72%] relative z-10">
                          <div
                            className={`w-7 h-7 shrink-0 rounded-xl flex items-center justify-center font-black text-xs shadow-md border ${
                              item.rank === 1
                                ? 'bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 border-amber-200'
                                : item.rank === 2
                                ? 'bg-gradient-to-tr from-slate-300 to-slate-100 text-slate-950 border-slate-200'
                                : 'bg-gradient-to-tr from-amber-700 to-amber-500 text-white border-amber-600'
                            }`}
                          >
                            {item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : '🥉'}
                          </div>

                          {/* Themed Avatar Frame */}
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

                        <span
                          className="font-mono font-black text-xs dir-ltr shrink-0 pr-1"
                          style={{ color: leaderboardTheme.cardStatsNumberColor }}
                        >
                          {item.val}
                        </span>
                      </div>
                    ))
                  )}

                  {/* 3. CHARM RANKING LIST */}
                  {statsMainTab === 'charm' && (
                    (statsTimeFilter === '24h' ? [
                      { rank: 1, name: 'وردة الأمل', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=100', level: '70', vip: 'VIP7', nLevel: 'N.13', val: '2,850,000 ✨' },
                      { rank: 2, name: 'ليلى الملكة', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100', level: '66', vip: 'VIP6', nLevel: 'N.11', val: '1,920,000 ✨' },
                      { rank: 3, name: 'نغم السعادة', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100', level: '59', vip: 'VIP5', nLevel: 'N.9', val: '1,410,000 ✨' },
                      { rank: 4, name: 'شمس الأصيل', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100', level: '45', vip: 'VIP3', nLevel: 'N.6', val: '890,000 ✨' }
                    ] : [
                      { rank: 1, name: 'أميرة القلوب', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=100', level: '92', vip: 'VIP9', nLevel: 'N.19', val: '28,500,000 ✨' },
                      { rank: 2, name: 'وردة الأمل', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100', level: '70', vip: 'VIP7', nLevel: 'N.13', val: '19,200,000 ✨' },
                      { rank: 3, name: 'ملكة الشرق', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100', level: '68', vip: 'VIP6', nLevel: 'N.12', val: '14,800,000 ✨' }
                    ]).map((item) => (
                      <div
                        key={`charm-${statsTimeFilter}-${item.rank}-${item.name}`}
                        onClick={() => {
                          onClose();
                          onSelectUserProfile({
                            id: `sup-ch-${item.rank}`,
                            name: item.name,
                            avatar: item.avatar,
                            userId: `9920${item.rank}`,
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
                          <div
                            className={`w-7 h-7 shrink-0 rounded-xl flex items-center justify-center font-black text-xs shadow-md border ${
                              item.rank === 1
                                ? 'bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 border-amber-200'
                                : item.rank === 2
                                ? 'bg-gradient-to-tr from-slate-300 to-slate-100 text-slate-950 border-slate-200'
                                : item.rank === 3
                                ? 'bg-gradient-to-tr from-amber-700 to-amber-500 text-white border-amber-600'
                                : 'bg-white/10 text-slate-300 border-white/5'
                            }`}
                          >
                            {item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : item.rank === 3 ? '🥉' : item.rank}
                          </div>

                          {/* Themed Avatar Frame */}
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

                        <span
                          className="font-mono font-black text-xs dir-ltr shrink-0 pr-1"
                          style={{ color: leaderboardTheme.cardStatsNumberColor }}
                        >
                          {item.val}
                        </span>
                      </div>
                    ))
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Bottom Action / Footer Bar (Compact Minimalist Numbers & Indicators) */}
            <div className="pt-2 border-t border-white/10 shrink-0">
              {statsMainTab === 'diamonds' && (
                <div className="flex items-center justify-center gap-1.5 text-xs font-mono py-1">
                  <span className="text-xs select-none">💎</span>
                  <span
                    className="font-black text-xs dir-ltr"
                    style={{ color: leaderboardTheme.cardStatsNumberColor || '#38bdf8' }}
                  >
                    {statsTimeFilter === '24h' ? '40M' : '325.7M'}
                  </span>
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
                      {statsTimeFilter === '24h' ? '555K' : '2.97M'}
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
                    {statsTimeFilter === '24h' ? '7.07M' : '62.5M'}
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
