export type IconThemeStyle =
  | 'gold_luxury'
  | 'neon_cyan'
  | 'ruby_flame'
  | 'emerald_nature'
  | 'violet_magic'
  | 'cyberpunk'
  | 'white_minimal'
  | 'custom';

export type IconShapeStyle = 'circle' | 'squircle' | 'rounded_xl' | 'pill';
export type IconAnimationStyle = 'none' | 'pulse' | 'glow' | 'bounce';

export interface WindowThemeConfig {
  windowId: string;
  windowName: string;
  windowIcon?: string;
  
  // Background & Surface
  bgColor: string;
  bgOpacity: number; // 10 to 100
  bgBrightness: number; // 50 to 150
  bgGradient?: string;
  backdropBlur: number; // 0 to 30px
  
  // Typography & Content Colors
  textColor: string;
  titleColor: string;
  accentColor: string;
  subtextColor: string;
  
  // Border & Glow
  borderColor: string;
  borderWidth: number; // 0 to 6px
  borderRadius: number; // 8 to 40px
  glowIntensity: number; // 0 to 45px
  glowColor: string;
  
  // Card & Container Items
  cardBgColor: string;
  cardBgOpacity: number; // 10 to 100
  cardBorderColor: string;
  cardTextColor?: string;
  
  // Icon Styling
  iconStyle: IconThemeStyle;
  iconColor: string;
  iconBgColor: string;
  iconShape: IconShapeStyle;
  iconAnimation: IconAnimationStyle;
  
  // Optional CSS overrides
  customCss?: string;
  lastUpdated?: number;
}

export interface PresetThemePackage {
  id: string;
  name: string;
  previewGradient: string;
  config: Partial<WindowThemeConfig>;
}
