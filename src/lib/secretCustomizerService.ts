import type { CSSProperties } from 'react';
import { WindowThemeConfig, PresetThemePackage } from '../types/secretCustomizer';

const STORAGE_PREFIX = 'super_legend_window_customizer_v2_';

export const WINDOW_REGISTRY: Record<string, { name: string; icon: string }> = {
  leaderboard: { name: 'لوحة الإحصائيات والمتصدرين', icon: '🏆' },
  top_options: { name: 'قائمة الثلاث نقاط العلوية (خيارات الروم)', icon: '⚙️' },
  bottom_bar: { name: 'شريط الأيقونات وأزرار التحكم السفلية', icon: '🎛️' },
  user_profile: { name: 'الملف الشخصي للمستخدم (البروفايل المتقدم)', icon: '👤' },
  host_profile: { name: 'نافذة بطاقة المضيف وصاحب الروم', icon: '👑' },
  room_info: { name: 'معلومات الغرفة وإدارة الطاقم', icon: 'ℹ️' },
  gift_panel: { name: 'لوحة الهدايا والماسات الاحترافية', icon: '🎁' },
  family_modal: { name: 'نافذة النادي والعائلة الملكية', icon: '🛡️' },
  music_player: { name: 'مشغل الموسيقى والمؤثرات الصوتية', icon: '🎵' }
};

export const GLOBAL_THEME_PRESETS: PresetThemePackage[] = [
  {
    id: 'black_obsidian',
    name: 'الأوبسيديان الأسود الملكي',
    previewGradient: 'from-slate-950 via-zinc-900 to-black',
    config: {
      bgColor: '#090d16',
      bgOpacity: 95,
      bgBrightness: 100,
      bgGradient: 'linear-gradient(135deg, #090d16 0%, #0d121f 50%, #151d30 100%)',
      backdropBlur: 20,
      textColor: '#f8fafc',
      titleColor: '#fbbf24',
      accentColor: '#38bdf8',
      subtextColor: '#94a3b8',
      borderColor: '#38bdf8',
      borderWidth: 2,
      borderRadius: 24,
      glowIntensity: 25,
      glowColor: 'rgba(56, 189, 248, 0.4)',
      cardBgColor: '#161f33',
      cardBgOpacity: 85,
      cardBorderColor: 'rgba(255, 255, 255, 0.1)',
      iconStyle: 'neon_cyan',
      iconColor: '#38bdf8',
      iconBgColor: '#1e293b',
      iconShape: 'circle',
      iconAnimation: 'pulse'
    }
  },
  {
    id: 'royal_gold',
    name: 'الذهب الإمبراطوري الفاخر',
    previewGradient: 'from-amber-700 via-amber-500 to-yellow-300',
    config: {
      bgColor: '#171206',
      bgOpacity: 96,
      bgBrightness: 110,
      bgGradient: 'linear-gradient(135deg, #1c1505 0%, #2a2007 50%, #140f03 100%)',
      backdropBlur: 24,
      textColor: '#fef3c7',
      titleColor: '#facc15',
      accentColor: '#f59e0b',
      subtextColor: '#d97706',
      borderColor: '#eab308',
      borderWidth: 2,
      borderRadius: 28,
      glowIntensity: 30,
      glowColor: 'rgba(234, 179, 8, 0.55)',
      cardBgColor: '#2b2108',
      cardBgOpacity: 90,
      cardBorderColor: 'rgba(234, 179, 8, 0.3)',
      iconStyle: 'gold_luxury',
      iconColor: '#fbbf24',
      iconBgColor: '#3b2c07',
      iconShape: 'circle',
      iconAnimation: 'glow'
    }
  },
  {
    id: 'cyberpunk_neon',
    name: 'سايبربانك نيون المستقبلي',
    previewGradient: 'from-fuchsia-600 via-purple-600 to-cyan-400',
    config: {
      bgColor: '#0c051f',
      bgOpacity: 94,
      bgBrightness: 115,
      bgGradient: 'linear-gradient(135deg, #0d0421 0%, #190a3d 50%, #03142e 100%)',
      backdropBlur: 22,
      textColor: '#ffffff',
      titleColor: '#00f0ff',
      accentColor: '#ff007f',
      subtextColor: '#c084fc',
      borderColor: '#ff007f',
      borderWidth: 2,
      borderRadius: 20,
      glowIntensity: 35,
      glowColor: 'rgba(255, 0, 127, 0.5)',
      cardBgColor: '#1d0c45',
      cardBgOpacity: 85,
      cardBorderColor: 'rgba(0, 240, 255, 0.3)',
      iconStyle: 'cyberpunk',
      iconColor: '#00f0ff',
      iconBgColor: '#270e5c',
      iconShape: 'squircle',
      iconAnimation: 'glow'
    }
  },
  {
    id: 'ruby_flame',
    name: 'الياقوت القرمزي الحارق',
    previewGradient: 'from-rose-900 via-red-600 to-amber-500',
    config: {
      bgColor: '#1c070c',
      bgOpacity: 95,
      bgBrightness: 105,
      bgGradient: 'linear-gradient(135deg, #1c070c 0%, #2e0d16 50%, #120407 100%)',
      backdropBlur: 20,
      textColor: '#ffe4e6',
      titleColor: '#fb7185',
      accentColor: '#f43f5e',
      subtextColor: '#fda4af',
      borderColor: '#f43f5e',
      borderWidth: 2,
      borderRadius: 24,
      glowIntensity: 28,
      glowColor: 'rgba(244, 63, 94, 0.5)',
      cardBgColor: '#300f19',
      cardBgOpacity: 85,
      cardBorderColor: 'rgba(244, 63, 94, 0.35)',
      iconStyle: 'ruby_flame',
      iconColor: '#f43f5e',
      iconBgColor: '#451221',
      iconShape: 'circle',
      iconAnimation: 'pulse'
    }
  },
  {
    id: 'emerald_imperial',
    name: 'الزمرد الإمبراطوري المشع',
    previewGradient: 'from-emerald-950 via-emerald-600 to-teal-400',
    config: {
      bgColor: '#041712',
      bgOpacity: 95,
      bgBrightness: 105,
      bgGradient: 'linear-gradient(135deg, #031410 0%, #072b22 50%, #031410 100%)',
      backdropBlur: 20,
      textColor: '#ecfdf5',
      titleColor: '#34d399',
      accentColor: '#10b981',
      subtextColor: '#6ee7b7',
      borderColor: '#10b981',
      borderWidth: 2,
      borderRadius: 24,
      glowIntensity: 26,
      glowColor: 'rgba(16, 185, 129, 0.45)',
      cardBgColor: '#09362b',
      cardBgOpacity: 85,
      cardBorderColor: 'rgba(52, 211, 153, 0.3)',
      iconStyle: 'emerald_nature',
      iconColor: '#34d399',
      iconBgColor: '#0e4a3c',
      iconShape: 'rounded_xl',
      iconAnimation: 'glow'
    }
  },
  {
    id: 'amethyst_twilight',
    name: 'شفق الجمشت الأرجواني',
    previewGradient: 'from-purple-950 via-violet-700 to-indigo-500',
    config: {
      bgColor: '#100824',
      bgOpacity: 95,
      bgBrightness: 105,
      bgGradient: 'linear-gradient(135deg, #0d061f 0%, #1e1040 50%, #0d061f 100%)',
      backdropBlur: 22,
      textColor: '#f5f3ff',
      titleColor: '#c084fc',
      accentColor: '#a855f7',
      subtextColor: '#d8b4fe',
      borderColor: '#a855f7',
      borderWidth: 2,
      borderRadius: 26,
      glowIntensity: 28,
      glowColor: 'rgba(168, 85, 247, 0.5)',
      cardBgColor: '#24144d',
      cardBgOpacity: 85,
      cardBorderColor: 'rgba(168, 85, 247, 0.3)',
      iconStyle: 'violet_magic',
      iconColor: '#c084fc',
      iconBgColor: '#321c6b',
      iconShape: 'circle',
      iconAnimation: 'pulse'
    }
  },
  {
    id: 'frosted_glass',
    name: 'الزجاج الصقيعي النقي (Ultra Frost)',
    previewGradient: 'from-slate-800 via-slate-700 to-cyan-500',
    config: {
      bgColor: '#0f172a',
      bgOpacity: 70,
      bgBrightness: 110,
      bgGradient: 'linear-gradient(135deg, rgba(15, 23, 42, 0.6) 0%, rgba(30, 41, 59, 0.6) 100%)',
      backdropBlur: 28,
      textColor: '#ffffff',
      titleColor: '#e2e8f0',
      accentColor: '#38bdf8',
      subtextColor: '#94a3b8',
      borderColor: 'rgba(255, 255, 255, 0.25)',
      borderWidth: 1.5,
      borderRadius: 28,
      glowIntensity: 20,
      glowColor: 'rgba(255, 255, 255, 0.2)',
      cardBgColor: '#1e293b',
      cardBgOpacity: 55,
      cardBorderColor: 'rgba(255, 255, 255, 0.15)',
      iconStyle: 'white_minimal',
      iconColor: '#ffffff',
      iconBgColor: 'rgba(255, 255, 255, 0.12)',
      iconShape: 'circle',
      iconAnimation: 'none'
    }
  }
];

export function getDefaultThemeForWindow(windowId: string): WindowThemeConfig {
  const meta = WINDOW_REGISTRY[windowId] || { name: 'نافذة مخصصة', icon: '⚙️' };
  
  // Specific defaults tailored per window
  let basePreset = GLOBAL_THEME_PRESETS[0].config;
  if (windowId === 'leaderboard') {
    basePreset = GLOBAL_THEME_PRESETS[1].config; // Royal Gold
  } else if (windowId === 'top_options') {
    basePreset = GLOBAL_THEME_PRESETS[5].config; // Amethyst
  } else if (windowId === 'gift_panel') {
    basePreset = GLOBAL_THEME_PRESETS[2].config; // Cyberpunk Neon
  } else if (windowId === 'user_profile' || windowId === 'host_profile') {
    basePreset = GLOBAL_THEME_PRESETS[0].config; // Black Obsidian
  }

  return {
    windowId,
    windowName: meta.name,
    windowIcon: meta.icon,
    bgColor: basePreset.bgColor || '#090d16',
    bgOpacity: basePreset.bgOpacity ?? 95,
    bgBrightness: basePreset.bgBrightness ?? 100,
    bgGradient: basePreset.bgGradient,
    backdropBlur: basePreset.backdropBlur ?? 20,
    textColor: basePreset.textColor || '#f8fafc',
    titleColor: basePreset.titleColor || '#fbbf24',
    accentColor: basePreset.accentColor || '#38bdf8',
    subtextColor: basePreset.subtextColor || '#94a3b8',
    borderColor: basePreset.borderColor || '#38bdf8',
    borderWidth: basePreset.borderWidth ?? 2,
    borderRadius: basePreset.borderRadius ?? 24,
    glowIntensity: basePreset.glowIntensity ?? 25,
    glowColor: basePreset.glowColor || 'rgba(56, 189, 248, 0.4)',
    cardBgColor: basePreset.cardBgColor || '#161f33',
    cardBgOpacity: basePreset.cardBgOpacity ?? 85,
    cardBorderColor: basePreset.cardBorderColor || 'rgba(255, 255, 255, 0.1)',
    cardTextColor: basePreset.textColor || '#ffffff',
    iconStyle: basePreset.iconStyle || 'neon_cyan',
    iconColor: basePreset.iconColor || '#38bdf8',
    iconBgColor: basePreset.iconBgColor || '#1e293b',
    iconShape: basePreset.iconShape || 'circle',
    iconAnimation: basePreset.iconAnimation || 'none',
    customCss: '',
    lastUpdated: Date.now()
  };
}

export function getSecretWindowTheme(windowId: string): WindowThemeConfig {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${windowId}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...getDefaultThemeForWindow(windowId), ...parsed };
    }
  } catch (err) {
    console.warn(`[Customizer] Failed to read theme for window ${windowId}:`, err);
  }
  return getDefaultThemeForWindow(windowId);
}

export function saveSecretWindowTheme(windowId: string, theme: WindowThemeConfig): void {
  try {
    const updatedTheme = { ...theme, lastUpdated: Date.now() };
    localStorage.setItem(`${STORAGE_PREFIX}${windowId}`, JSON.stringify(updatedTheme));
    
    // Dispatch instant live event
    window.dispatchEvent(
      new CustomEvent('window_customizer_updated', {
        detail: { windowId, theme: updatedTheme }
      })
    );
  } catch (err) {
    console.warn(`[Customizer] Failed to save theme for window ${windowId}:`, err);
  }
}

export function resetSecretWindowTheme(windowId: string): WindowThemeConfig {
  const defaultTheme = getDefaultThemeForWindow(windowId);
  saveSecretWindowTheme(windowId, defaultTheme);
  return defaultTheme;
}

/**
 * Compute CSS styles from WindowThemeConfig for container, cards, and text
 */
export function getComputedModalStyle(theme: WindowThemeConfig): CSSProperties {
  const opacityRatio = (theme.bgOpacity ?? 95) / 100;
  const brightnessRatio = (theme.bgBrightness ?? 100) / 100;
  
  let backgroundStyle: string;
  if (theme.bgGradient) {
    backgroundStyle = theme.bgGradient;
  } else {
    // Hex to rgba
    backgroundStyle = hexToRgba(theme.bgColor, opacityRatio);
  }

  const glowShadow =
    theme.glowIntensity > 0
      ? `0 0 ${theme.glowIntensity}px ${theme.glowColor || theme.borderColor}`
      : 'none';

  return {
    background: backgroundStyle,
    borderColor: theme.borderColor,
    borderWidth: `${theme.borderWidth}px`,
    borderRadius: `${theme.borderRadius}px`,
    backdropFilter: `blur(${theme.backdropBlur}px) brightness(${brightnessRatio})`,
    WebkitBackdropFilter: `blur(${theme.backdropBlur}px) brightness(${brightnessRatio})`,
    boxShadow: glowShadow,
    color: theme.textColor
  };
}

export function getComputedCardStyle(theme: WindowThemeConfig): CSSProperties {
  const opacityRatio = (theme.cardBgOpacity ?? 85) / 100;
  return {
    backgroundColor: hexToRgba(theme.cardBgColor, opacityRatio),
    borderColor: theme.cardBorderColor,
    color: theme.cardTextColor || theme.textColor
  };
}

export function hexToRgba(hex: string, alpha = 1): string {
  if (!hex || typeof hex !== 'string') return `rgba(18, 24, 39, ${alpha})`;
  if (hex.startsWith('rgba') || hex.startsWith('rgb')) return hex;
  
  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(c => c + c).join('');
  }
  if (cleanHex.length !== 6) return `rgba(18, 24, 39, ${alpha})`;
  
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
