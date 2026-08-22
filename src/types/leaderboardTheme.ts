export interface TopRankFrameConfig {
  type: 'preset' | 'custom_upload';
  presetId: string;
  customImageUrl?: string;
  glowColor: string;
  crownEmoji: string;
  borderGradient: string;
  starBadgeEmoji: string;
  badgeBg: string;
  badgeTextColor: string;
}

export interface LeaderboardThemeConfig {
  id: string;
  name: string;
  isPreset?: boolean;
  // Modal Background & Border
  modalBg: string; // e.g. "bg-[#121827]/95" or custom style/gradient
  modalBgCustomCss?: string;
  modalBorderColor: string;
  modalGlowEffect?: string;

  // Typography & Headers
  headerTitleColor: string;
  headerIconColor: string;
  swipeBannerBg: string;
  swipeBannerTextColor: string;

  // Tabs Customization
  tabsContainerBg: string;
  diamondsTabGradient: string;
  diamondsTabTextColor: string;
  clubTabGradient: string;
  clubTabTextColor: string;
  charmTabGradient: string;
  charmTabTextColor: string;
  inactiveTabTextColor: string;

  // Filter Pill Badges (24h / Weekly / All)
  filterActiveBg: string;
  filterActiveText: string;
  filterInactiveBg: string;

  // Rank Cards
  cardBg: string;
  cardBorderColor: string;
  cardHoverBorderColor: string;
  cardNameColor: string;
  cardStatsNumberColor: string; // Statistics font color
  cardMetaLevelBg: string;
  cardMetaVipBg: string;
  cardMetaNLevelBg: string;

  // Frames for Top 1, 2, 3
  rank1Frame: TopRankFrameConfig;
  rank2Frame: TopRankFrameConfig;
  rank3Frame: TopRankFrameConfig;

  // Summary and Action Footer
  summaryBoxBg: string;
  summaryBoxBorder: string;
  summaryLabelColor: string;
  summaryValueColor: string;
  actionButtonGradient: string;
  actionButtonTextColor: string;
}

export interface FramePresetOption {
  id: string;
  name: string;
  crownEmoji: string;
  borderGradient: string;
  glowColor: string;
  starBadgeEmoji: string;
  badgeBg: string;
  badgeTextColor: string;
  previewColor: string;
}
