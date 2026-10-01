import { LeaderboardThemeConfig, FramePresetOption } from '../types/leaderboardTheme';

export const FRAME_PRESETS: FramePresetOption[] = [
  {
    id: 'gold_royalty',
    name: 'تاج الملك الذهبي الفاخر 👑',
    crownEmoji: '👑',
    borderGradient: 'from-amber-500 via-yellow-300 to-amber-600',
    glowColor: 'rgba(251,191,36,0.85)',
    starBadgeEmoji: '★',
    badgeBg: 'from-amber-400 to-yellow-300',
    badgeTextColor: '#020617',
    previewColor: '#fbbf24'
  },
  {
    id: 'diamond_crystal',
    name: 'الماسي الكريستالي المتلألئ 💎',
    crownEmoji: '💎',
    borderGradient: 'from-cyan-400 via-white to-blue-500',
    glowColor: 'rgba(56,189,248,0.85)',
    starBadgeEmoji: '✦',
    badgeBg: 'from-cyan-400 to-blue-300',
    badgeTextColor: '#020617',
    previewColor: '#38bdf8'
  },
  {
    id: 'fiery_dragon',
    name: 'التنين الناري الياقوتي 🔥',
    crownEmoji: '🔥',
    borderGradient: 'from-red-600 via-amber-400 to-rose-600',
    glowColor: 'rgba(244,63,94,0.9)',
    starBadgeEmoji: '⚡',
    badgeBg: 'from-rose-500 to-amber-400',
    badgeTextColor: '#ffffff',
    previewColor: '#f43f5e'
  },
  {
    id: 'cyber_neon',
    name: 'السايبر والنيون المستقبلي ⚡',
    crownEmoji: '⚡',
    borderGradient: 'from-cyan-400 via-fuchsia-500 to-emerald-400',
    glowColor: 'rgba(168,85,247,0.9)',
    starBadgeEmoji: '🔮',
    badgeBg: 'from-fuchsia-500 to-cyan-400',
    badgeTextColor: '#ffffff',
    previewColor: '#a855f7'
  },
  {
    id: 'emerald_emperor',
    name: 'الإمبراطور الزمردي 🛡️',
    crownEmoji: '⚜️',
    borderGradient: 'from-emerald-400 via-teal-200 to-emerald-600',
    glowColor: 'rgba(52,211,153,0.85)',
    starBadgeEmoji: '❇️',
    badgeBg: 'from-emerald-400 to-teal-300',
    badgeTextColor: '#020617',
    previewColor: '#34d399'
  },
  {
    id: 'silver_knight',
    name: 'الفارس الفضي الأسطوري ⚔️',
    crownEmoji: '✨',
    borderGradient: 'from-slate-300 via-white to-slate-400',
    glowColor: 'rgba(226,232,240,0.85)',
    starBadgeEmoji: '✦',
    badgeBg: 'from-slate-200 to-white',
    badgeTextColor: '#0f172a',
    previewColor: '#e2e8f0'
  },
  {
    id: 'bronze_champion',
    name: 'البرونزي الشامخ 🥉',
    crownEmoji: '✨',
    borderGradient: 'from-amber-800 via-amber-500 to-yellow-600',
    glowColor: 'rgba(217,119,6,0.85)',
    starBadgeEmoji: '✦',
    badgeBg: 'from-amber-700 to-amber-500',
    badgeTextColor: '#ffffff',
    previewColor: '#b45309'
  },
  {
    id: 'romantic_heart',
    name: 'قلب الحب والرومانسية 💖',
    crownEmoji: '💖',
    borderGradient: 'from-pink-500 via-rose-300 to-purple-600',
    glowColor: 'rgba(244,114,182,0.9)',
    starBadgeEmoji: '♥',
    badgeBg: 'from-pink-500 to-rose-400',
    badgeTextColor: '#ffffff',
    previewColor: '#f472b6'
  }
];

export const DEFAULT_LEADERBOARD_THEME: LeaderboardThemeConfig = {
  id: 'default_neon',
  name: 'الثيم الافتراضي (النيون والظلال العميقة)',
  isPreset: true,
  modalBg: 'bg-[#121827]/95',
  modalBgCustomCss: 'linear-gradient(180deg, #121827 0%, #0d121d 100%)',
  modalBorderColor: '#06b6d4',
  modalGlowEffect: '0 0 35px rgba(6, 182, 212, 0.25)',

  headerTitleColor: '#fde047',
  headerIconColor: '#fbbf24',
  swipeBannerBg: 'rgba(255, 255, 255, 0.05)',
  swipeBannerTextColor: '#cbd5e1',

  tabsContainerBg: '#1A2234',
  diamondsTabGradient: 'linear-gradient(135deg, #06b6d4 0%, #2563eb 100%)',
  diamondsTabTextColor: '#020617',
  clubTabGradient: 'linear-gradient(135deg, #a855f7 0%, #4f46e5 100%)',
  clubTabTextColor: '#ffffff',
  charmTabGradient: 'linear-gradient(135deg, #ec4899 0%, #e11d48 100%)',
  charmTabTextColor: '#ffffff',
  inactiveTabTextColor: '#cbd5e1',

  filterActiveBg: '#06b6d4',
  filterActiveText: '#020617',
  filterInactiveBg: 'rgba(255, 255, 255, 0.05)',

  cardBg: '#1A2234',
  cardBorderColor: 'rgba(255, 255, 255, 0.1)',
  cardHoverBorderColor: 'rgba(6, 182, 212, 0.4)',
  cardNameColor: '#f1f5f9',
  cardStatsNumberColor: '#67e8f9',
  cardMetaLevelBg: '#9333ea',
  cardMetaVipBg: '#f59e0b',
  cardMetaNLevelBg: '#059669',

  rank1Frame: {
    type: 'preset',
    presetId: 'gold_royalty',
    glowColor: 'rgba(251,191,36,0.85)',
    crownEmoji: '👑',
    borderGradient: 'from-amber-600 via-yellow-300 to-amber-500',
    starBadgeEmoji: '★',
    badgeBg: 'from-amber-400 to-yellow-300',
    badgeTextColor: '#020617'
  },
  rank2Frame: {
    type: 'preset',
    presetId: 'diamond_crystal',
    glowColor: 'rgba(226,232,240,0.8)',
    crownEmoji: '💎',
    borderGradient: 'from-slate-400 via-white to-slate-300',
    starBadgeEmoji: '✦',
    badgeBg: 'from-slate-200 to-white',
    badgeTextColor: '#0f172a'
  },
  rank3Frame: {
    type: 'preset',
    presetId: 'bronze_champion',
    glowColor: 'rgba(217,119,6,0.8)',
    crownEmoji: '✨',
    borderGradient: 'from-amber-800 via-amber-500 to-yellow-600',
    starBadgeEmoji: '✦',
    badgeBg: 'from-amber-700 to-amber-500',
    badgeTextColor: '#ffffff'
  },

  summaryBoxBg: 'rgba(15, 23, 42, 0.8)',
  summaryBoxBorder: 'rgba(6, 182, 212, 0.2)',
  summaryLabelColor: '#cbd5e1',
  summaryValueColor: '#67e8f9',
  actionButtonGradient: 'linear-gradient(90deg, #06b6d4 0%, #2563eb 50%, #4f46e5 100%)',
  actionButtonTextColor: '#020617'
};

export const PRESET_THEMES: LeaderboardThemeConfig[] = [
  DEFAULT_LEADERBOARD_THEME,
  {
    id: 'royal_gold',
    name: 'الملكي الذهبي الفاخر (Royal Gold)',
    isPreset: true,
    modalBg: 'bg-[#181308]/95',
    modalBgCustomCss: 'radial-gradient(circle at 50% 0%, #382404 0%, #171004 80%, #0d0901 100%)',
    modalBorderColor: '#eab308',
    modalGlowEffect: '0 0 40px rgba(234, 179, 8, 0.35)',

    headerTitleColor: '#fef08a',
    headerIconColor: '#eab308',
    swipeBannerBg: 'rgba(234, 179, 8, 0.1)',
    swipeBannerTextColor: '#fde047',

    tabsContainerBg: '#251b0a',
    diamondsTabGradient: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)',
    diamondsTabTextColor: '#020617',
    clubTabGradient: 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)',
    clubTabTextColor: '#020617',
    charmTabGradient: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
    charmTabTextColor: '#020617',
    inactiveTabTextColor: '#fef08a',

    filterActiveBg: '#eab308',
    filterActiveText: '#020617',
    filterInactiveBg: 'rgba(234, 179, 8, 0.1)',

    cardBg: '#2a1f0d',
    cardBorderColor: 'rgba(234, 179, 8, 0.25)',
    cardHoverBorderColor: 'rgba(234, 179, 8, 0.6)',
    cardNameColor: '#fef9c3',
    cardStatsNumberColor: '#fde047',
    cardMetaLevelBg: '#854d0e',
    cardMetaVipBg: '#ca8a04',
    cardMetaNLevelBg: '#a16207',

    rank1Frame: {
      type: 'preset',
      presetId: 'gold_royalty',
      glowColor: 'rgba(250,204,21,0.95)',
      crownEmoji: '👑',
      borderGradient: 'from-amber-400 via-yellow-200 to-amber-500',
      starBadgeEmoji: '★',
      badgeBg: 'from-yellow-300 to-amber-400',
      badgeTextColor: '#020617'
    },
    rank2Frame: {
      type: 'preset',
      presetId: 'gold_royalty',
      glowColor: 'rgba(234,179,8,0.85)',
      crownEmoji: '⚜️',
      borderGradient: 'from-amber-300 via-yellow-100 to-amber-600',
      starBadgeEmoji: '✦',
      badgeBg: 'from-amber-200 to-yellow-400',
      badgeTextColor: '#020617'
    },
    rank3Frame: {
      type: 'preset',
      presetId: 'bronze_champion',
      glowColor: 'rgba(180,83,9,0.85)',
      crownEmoji: '✨',
      borderGradient: 'from-amber-700 via-yellow-600 to-amber-800',
      starBadgeEmoji: '✦',
      badgeBg: 'from-amber-700 to-amber-600',
      badgeTextColor: '#ffffff'
    },

    summaryBoxBg: 'rgba(37, 27, 10, 0.9)',
    summaryBoxBorder: 'rgba(234, 179, 8, 0.4)',
    summaryLabelColor: '#fef08a',
    summaryValueColor: '#fde047',
    actionButtonGradient: 'linear-gradient(90deg, #eab308 0%, #ca8a04 50%, #a16207 100%)',
    actionButtonTextColor: '#020617'
  },
  {
    id: 'violet_nebula',
    name: 'البنفسجي الإمبراطوري (Imperial Violet)',
    isPreset: true,
    modalBg: 'bg-[#170c2a]/95',
    modalBgCustomCss: 'radial-gradient(circle at 50% 0%, #3b0764 0%, #1e0936 70%, #0f031b 100%)',
    modalBorderColor: '#c084fc',
    modalGlowEffect: '0 0 40px rgba(192, 132, 252, 0.35)',

    headerTitleColor: '#f3e8ff',
    headerIconColor: '#c084fc',
    swipeBannerBg: 'rgba(192, 132, 252, 0.1)',
    swipeBannerTextColor: '#e9d5ff',

    tabsContainerBg: '#271146',
    diamondsTabGradient: 'linear-gradient(135deg, #c084fc 0%, #9333ea 100%)',
    diamondsTabTextColor: '#ffffff',
    clubTabGradient: 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)',
    clubTabTextColor: '#ffffff',
    charmTabGradient: 'linear-gradient(135deg, #e879f9 0%, #c026d3 100%)',
    charmTabTextColor: '#ffffff',
    inactiveTabTextColor: '#e9d5ff',

    filterActiveBg: '#c084fc',
    filterActiveText: '#1e0936',
    filterInactiveBg: 'rgba(192, 132, 252, 0.1)',

    cardBg: '#2a144b',
    cardBorderColor: 'rgba(192, 132, 252, 0.25)',
    cardHoverBorderColor: 'rgba(192, 132, 252, 0.6)',
    cardNameColor: '#faf5ff',
    cardStatsNumberColor: '#e879f9',
    cardMetaLevelBg: '#7e22ce',
    cardMetaVipBg: '#d946ef',
    cardMetaNLevelBg: '#9333ea',

    rank1Frame: {
      type: 'preset',
      presetId: 'cyber_neon',
      glowColor: 'rgba(216,70,239,0.95)',
      crownEmoji: '👑',
      borderGradient: 'from-fuchsia-400 via-purple-200 to-pink-500',
      starBadgeEmoji: '★',
      badgeBg: 'from-fuchsia-400 to-purple-300',
      badgeTextColor: '#020617'
    },
    rank2Frame: {
      type: 'preset',
      presetId: 'silver_knight',
      glowColor: 'rgba(192,132,252,0.85)',
      crownEmoji: '💎',
      borderGradient: 'from-purple-300 via-white to-fuchsia-300',
      starBadgeEmoji: '✦',
      badgeBg: 'from-purple-200 to-white',
      badgeTextColor: '#0f172a'
    },
    rank3Frame: {
      type: 'preset',
      presetId: 'romantic_heart',
      glowColor: 'rgba(168,85,247,0.85)',
      crownEmoji: '✨',
      borderGradient: 'from-purple-600 via-pink-400 to-purple-800',
      starBadgeEmoji: '✦',
      badgeBg: 'from-purple-600 to-pink-500',
      badgeTextColor: '#ffffff'
    },

    summaryBoxBg: 'rgba(39, 17, 70, 0.9)',
    summaryBoxBorder: 'rgba(192, 132, 252, 0.4)',
    summaryLabelColor: '#f3e8ff',
    summaryValueColor: '#e879f9',
    actionButtonGradient: 'linear-gradient(90deg, #c084fc 0%, #9333ea 50%, #6b21a8 100%)',
    actionButtonTextColor: '#ffffff'
  },
  {
    id: 'ruby_flame',
    name: 'الياقوت الناري المشتعل (Ruby Flame)',
    isPreset: true,
    modalBg: 'bg-[#1c080d]/95',
    modalBgCustomCss: 'radial-gradient(circle at 50% 0%, #4c0519 0%, #24050d 70%, #120106 100%)',
    modalBorderColor: '#f43f5e',
    modalGlowEffect: '0 0 40px rgba(244, 63, 94, 0.35)',

    headerTitleColor: '#ffe4e6',
    headerIconColor: '#f43f5e',
    swipeBannerBg: 'rgba(244, 63, 94, 0.1)',
    swipeBannerTextColor: '#fecdd3',

    tabsContainerBg: '#2f0b14',
    diamondsTabGradient: 'linear-gradient(135deg, #f43f5e 0%, #be123c 100%)',
    diamondsTabTextColor: '#ffffff',
    clubTabGradient: 'linear-gradient(135deg, #fb7185 0%, #e11d48 100%)',
    clubTabTextColor: '#ffffff',
    charmTabGradient: 'linear-gradient(135deg, #f43f5e 0%, #9f1239 100%)',
    charmTabTextColor: '#ffffff',
    inactiveTabTextColor: '#fecdd3',

    filterActiveBg: '#f43f5e',
    filterActiveText: '#ffffff',
    filterInactiveBg: 'rgba(244, 63, 94, 0.1)',

    cardBg: '#350d18',
    cardBorderColor: 'rgba(244, 63, 94, 0.25)',
    cardHoverBorderColor: 'rgba(244, 63, 94, 0.6)',
    cardNameColor: '#fff1f2',
    cardStatsNumberColor: '#fda4af',
    cardMetaLevelBg: '#be123c',
    cardMetaVipBg: '#e11d48',
    cardMetaNLevelBg: '#9f1239',

    rank1Frame: {
      type: 'preset',
      presetId: 'fiery_dragon',
      glowColor: 'rgba(244,63,94,0.95)',
      crownEmoji: '🔥',
      borderGradient: 'from-rose-500 via-amber-300 to-red-600',
      starBadgeEmoji: '★',
      badgeBg: 'from-rose-400 to-amber-300',
      badgeTextColor: '#020617'
    },
    rank2Frame: {
      type: 'preset',
      presetId: 'fiery_dragon',
      glowColor: 'rgba(251,113,133,0.85)',
      crownEmoji: '⚡',
      borderGradient: 'from-rose-400 via-white to-rose-600',
      starBadgeEmoji: '✦',
      badgeBg: 'from-rose-300 to-white',
      badgeTextColor: '#0f172a'
    },
    rank3Frame: {
      type: 'preset',
      presetId: 'bronze_champion',
      glowColor: 'rgba(190,18,60,0.85)',
      crownEmoji: '✨',
      borderGradient: 'from-red-800 via-rose-600 to-red-950',
      starBadgeEmoji: '✦',
      badgeBg: 'from-red-700 to-rose-600',
      badgeTextColor: '#ffffff'
    },

    summaryBoxBg: 'rgba(47, 11, 20, 0.9)',
    summaryBoxBorder: 'rgba(244, 63, 94, 0.4)',
    summaryLabelColor: '#ffe4e6',
    summaryValueColor: '#fda4af',
    actionButtonGradient: 'linear-gradient(90deg, #f43f5e 0%, #e11d48 50%, #9f1239 100%)',
    actionButtonTextColor: '#ffffff'
  },
  {
    id: 'emerald_glory',
    name: 'الزمرد الأخضر الأسطوري (Emerald Glory)',
    isPreset: true,
    modalBg: 'bg-[#081812]/95',
    modalBgCustomCss: 'radial-gradient(circle at 50% 0%, #064e3b 0%, #082f22 70%, #021a12 100%)',
    modalBorderColor: '#10b981',
    modalGlowEffect: '0 0 40px rgba(16, 185, 129, 0.35)',

    headerTitleColor: '#d1fae5',
    headerIconColor: '#10b981',
    swipeBannerBg: 'rgba(16, 185, 129, 0.1)',
    swipeBannerTextColor: '#a7f3d0',

    tabsContainerBg: '#0d3829',
    diamondsTabGradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    diamondsTabTextColor: '#020617',
    clubTabGradient: 'linear-gradient(135deg, #34d399 0%, #047857 100%)',
    clubTabTextColor: '#020617',
    charmTabGradient: 'linear-gradient(135deg, #6ee7b7 0%, #10b981 100%)',
    charmTabTextColor: '#020617',
    inactiveTabTextColor: '#a7f3d0',

    filterActiveBg: '#10b981',
    filterActiveText: '#020617',
    filterInactiveBg: 'rgba(16, 185, 129, 0.1)',

    cardBg: '#114432',
    cardBorderColor: 'rgba(16, 185, 129, 0.25)',
    cardHoverBorderColor: 'rgba(16, 185, 129, 0.6)',
    cardNameColor: '#ecfdf5',
    cardStatsNumberColor: '#6ee7b7',
    cardMetaLevelBg: '#059669',
    cardMetaVipBg: '#047857',
    cardMetaNLevelBg: '#065f46',

    rank1Frame: {
      type: 'preset',
      presetId: 'emerald_emperor',
      glowColor: 'rgba(16,185,129,0.95)',
      crownEmoji: '⚜️',
      borderGradient: 'from-emerald-400 via-teal-100 to-emerald-600',
      starBadgeEmoji: '★',
      badgeBg: 'from-emerald-300 to-teal-200',
      badgeTextColor: '#020617'
    },
    rank2Frame: {
      type: 'preset',
      presetId: 'emerald_emperor',
      glowColor: 'rgba(52,211,153,0.85)',
      crownEmoji: '💎',
      borderGradient: 'from-emerald-300 via-white to-emerald-500',
      starBadgeEmoji: '✦',
      badgeBg: 'from-emerald-200 to-white',
      badgeTextColor: '#0f172a'
    },
    rank3Frame: {
      type: 'preset',
      presetId: 'emerald_emperor',
      glowColor: 'rgba(5,150,105,0.85)',
      crownEmoji: '✨',
      borderGradient: 'from-teal-700 via-emerald-600 to-emerald-900',
      starBadgeEmoji: '✦',
      badgeBg: 'from-emerald-700 to-teal-600',
      badgeTextColor: '#ffffff'
    },

    summaryBoxBg: 'rgba(13, 56, 41, 0.9)',
    summaryBoxBorder: 'rgba(16, 185, 129, 0.4)',
    summaryLabelColor: '#d1fae5',
    summaryValueColor: '#6ee7b7',
    actionButtonGradient: 'linear-gradient(90deg, #10b981 0%, #059669 50%, #047857 100%)',
    actionButtonTextColor: '#020617'
  },
  {
    id: 'midnight_obsidian',
    name: 'حجر الأوبسيديان والفضة (Midnight Obsidian)',
    isPreset: true,
    modalBg: 'bg-[#0b0f19]/95',
    modalBgCustomCss: 'radial-gradient(circle at 50% 0%, #1e293b 0%, #0f172a 70%, #020617 100%)',
    modalBorderColor: '#94a3b8',
    modalGlowEffect: '0 0 35px rgba(148, 163, 184, 0.3)',

    headerTitleColor: '#f8fafc',
    headerIconColor: '#cbd5e1',
    swipeBannerBg: 'rgba(255, 255, 255, 0.05)',
    swipeBannerTextColor: '#94a3b8',

    tabsContainerBg: '#1e293b',
    diamondsTabGradient: 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)',
    diamondsTabTextColor: '#020617',
    clubTabGradient: 'linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%)',
    clubTabTextColor: '#020617',
    charmTabGradient: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)',
    charmTabTextColor: '#020617',
    inactiveTabTextColor: '#94a3b8',

    filterActiveBg: '#cbd5e1',
    filterActiveText: '#020617',
    filterInactiveBg: 'rgba(255, 255, 255, 0.05)',

    cardBg: '#182234',
    cardBorderColor: 'rgba(148, 163, 184, 0.2)',
    cardHoverBorderColor: 'rgba(203, 213, 225, 0.5)',
    cardNameColor: '#f8fafc',
    cardStatsNumberColor: '#e2e8f0',
    cardMetaLevelBg: '#475569',
    cardMetaVipBg: '#64748b',
    cardMetaNLevelBg: '#334155',

    rank1Frame: {
      type: 'preset',
      presetId: 'silver_knight',
      glowColor: 'rgba(248,250,252,0.95)',
      crownEmoji: '👑',
      borderGradient: 'from-slate-200 via-white to-slate-400',
      starBadgeEmoji: '★',
      badgeBg: 'from-white to-slate-300',
      badgeTextColor: '#020617'
    },
    rank2Frame: {
      type: 'preset',
      presetId: 'silver_knight',
      glowColor: 'rgba(203,213,225,0.85)',
      crownEmoji: '💎',
      borderGradient: 'from-slate-300 via-white to-slate-400',
      starBadgeEmoji: '✦',
      badgeBg: 'from-slate-200 to-white',
      badgeTextColor: '#0f172a'
    },
    rank3Frame: {
      type: 'preset',
      presetId: 'silver_knight',
      glowColor: 'rgba(148,163,184,0.85)',
      crownEmoji: '✨',
      borderGradient: 'from-slate-500 via-slate-300 to-slate-700',
      starBadgeEmoji: '✦',
      badgeBg: 'from-slate-500 to-slate-400',
      badgeTextColor: '#ffffff'
    },

    summaryBoxBg: 'rgba(30, 41, 59, 0.9)',
    summaryBoxBorder: 'rgba(148, 163, 184, 0.3)',
    summaryLabelColor: '#f8fafc',
    summaryValueColor: '#e2e8f0',
    actionButtonGradient: 'linear-gradient(90deg, #e2e8f0 0%, #cbd5e1 50%, #94a3b8 100%)',
    actionButtonTextColor: '#020617'
  }
];

const THEME_STORAGE_KEY = 'super_legend_leaderboard_custom_theme_v1';

export function getSavedLeaderboardTheme(): LeaderboardThemeConfig {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.id) {
        return { ...DEFAULT_LEADERBOARD_THEME, ...parsed };
      }
    }
  } catch (e) {
    console.error('Failed to load saved leaderboard theme:', e);
  }
  return DEFAULT_LEADERBOARD_THEME;
}

export function saveLeaderboardTheme(theme: LeaderboardThemeConfig): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(theme));
  } catch (e) {
    console.error('Failed to save leaderboard theme:', e);
  }
}

export function resetLeaderboardTheme(): LeaderboardThemeConfig {
  try {
    localStorage.removeItem(THEME_STORAGE_KEY);
  } catch (e) {
    console.error('Failed to reset leaderboard theme:', e);
  }
  return DEFAULT_LEADERBOARD_THEME;
}
