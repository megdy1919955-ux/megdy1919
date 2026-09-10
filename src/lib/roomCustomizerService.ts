import { MainRoomCustomizerConfig } from '../types/roomCustomizer';

const STORAGE_KEY = 'super_legend_main_room_customizer_v1';

export const DEFAULT_MAIN_ROOM_CONFIG: MainRoomCustomizerConfig = {
  id: 'default_legend_dark',
  name: 'الوضع الليلي الافتراضي (Dark Nebula)',
  isPreset: true,

  // 1. المايكات والتوهج الصوتي
  speakingGlowColor: '#22c55e', // أخضر زمردي
  speakingGlowIntensity: 24,
  speakingRingColor: '#4ade80',
  speakingRingWidth: 2.5,
  speakingWaveformStyle: 'audio_ripple',
  speakingPulseSpeed: 1.2,
  speakingScaleMultiplier: 1.15,

  // 2. المقاعد والمايكات
  seatShape: 'circle',
  emptySeatBgColor: '#000000',
  emptySeatOpacity: 25,
  emptySeatBorderColor: '#ffffff',
  emptySeatBorderWidth: 1.5,
  emptySeatBorderDashed: true,
  emptySeatPlusColor: '#ffffff',

  lockedSeatBgColor: '#0f172a',
  lockedSeatOpacity: 40,
  lockedSeatBorderColor: '#cbd5e1',
  lockedSeatLockColor: '#f8fafc',

  occupiedSeatBorderColor: '#38bdf8',
  occupiedSeatGlowColor: '#0284c7',
  occupiedSeatGlowIntensity: 12,

  seatNumberBadgeBg: '#0f172a',
  seatNumberBadgeColor: '#38bdf8',
  seatNameTextColor: '#ffffff',
  customChairFrameOpacity: 85,

  // 3. الشريط العلوي
  topBarBgColor: '#0d121f',
  topBarOpacity: 80,
  topBarBorderColor: 'rgba(255,255,255,0.1)',
  topBarBackdropBlur: 16,

  roomTitleColor: '#ffffff',
  roomIdBadgeBg: '#1e293b',
  roomIdBadgeColor: '#94a3b8',
  ownerTagBg: 'linear-gradient(to right, #eab308, #d97706)',
  ownerTagColor: '#020617',

  topAudiencePillBg: '#1a2132',
  topAudiencePillBorder: 'rgba(255,255,255,0.1)',
  topAudienceTextColor: '#ffffff',

  topMoreBtnBg: '#1a2132',
  topMoreBtnColor: '#e2e8f0',
  topPowerBtnBg: '#1a2132',
  topPowerBtnColor: '#e2e8f0',

  // 4. الشريط السفلي
  bottomBarBgColor: '#0d121f',
  bottomBarOpacity: 90,
  bottomBarBorderColor: 'rgba(255,255,255,0.15)',
  bottomBarBackdropBlur: 20,

  bottomButtonsBg: '#1a2234',
  bottomButtonsColor: '#cbd5e1',
  bottomButtonsBorder: 'rgba(255,255,255,0.08)',
  bottomGiftGlowColor: '#ec4899',
  bottomGiftGlowIntensity: 22,

  // 5. تخصيص إضاءة وتعتيم خلفية الروم وتظليل المايكات (الوضع الطبيعي النقي 100% بدون أي حجب)
  roomOverlayDarkness: 0, // 0% بدون أي تظليل افتراضي لتظهر الخلفية بألوانها الطبيعية الأصلية
  roomBackdropBlur: 0, // 0 بكسل ضبابية لتبقى الخلفية نقية وحادة
  roomAmbientGlowColor: '#3b82f6',
  roomAmbientGlowIntensity: 0, // 0% بدون أي توهج ضبابي يحجب الخلفية
  activeWallpaperBrightness: 100, // 100% السطوع الطبيعي
  activeWallpaperDimming: 0, // 0% بدون تعتيم إضافي
  activeWallpaperOpacity: 100, // 100% إظهار كامل
  activeWallpaperContrast: 100 // 100% تباين متوازن
};

export const PRESET_CHAIR_GRAPHICS = [
  {
    id: 'none',
    name: 'بدون إطار مدمج',
    url: ''
  },
  {
    id: 'gold_throne',
    name: 'عرش الذهب الملكي 👑',
    url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=250'
  },
  {
    id: 'cyber_pod',
    name: 'كبسولة السايبر المستقبلية 🛸',
    url: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80&w=250'
  },
  {
    id: 'ruby_chair',
    name: 'المقعد المخملي الياقوتي 💎',
    url: 'https://images.unsplash.com/photo-1580481077197-2a4b8686127b?auto=format&fit=crop&q=80&w=250'
  },
  {
    id: 'neon_hex',
    name: 'هيكل النيون الفضائي ⚡',
    url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=250'
  }
];

export const ROOM_PRESET_THEMES: MainRoomCustomizerConfig[] = [
  {
    ...DEFAULT_MAIN_ROOM_CONFIG,
    id: 'preset_cyber_neon',
    name: 'السايبر نيون المستقبلي (Cyberpunk Neon ⚡)',
    speakingGlowColor: '#06b6d4',
    speakingGlowIntensity: 35,
    speakingRingColor: '#22d3ee',
    speakingWaveformStyle: 'neon_glow',
    speakingScaleMultiplier: 1.2,
    seatShape: 'hexagon',
    emptySeatBgColor: '#082f49',
    emptySeatOpacity: 45,
    emptySeatBorderColor: '#06b6d4',
    emptySeatPlusColor: '#22d3ee',
    lockedSeatBgColor: '#1e1b4b',
    lockedSeatBorderColor: '#818cf8',
    occupiedSeatBorderColor: '#06b6d4',
    occupiedSeatGlowColor: '#0891b2',
    occupiedSeatGlowIntensity: 25,
    topBarBgColor: '#030712',
    topBarOpacity: 90,
    topBarBorderColor: '#06b6d4',
    roomTitleColor: '#38bdf8',
    bottomBarBgColor: '#030712',
    bottomBarOpacity: 95,
    bottomBarBorderColor: '#06b6d4',
    bottomButtonsBg: '#0f172a',
    bottomButtonsColor: '#38bdf8',
    bottomGiftGlowColor: '#06b6d4',
    bottomGiftGlowIntensity: 30,
    roomOverlayDarkness: 0,
    roomAmbientGlowColor: '#06b6d4',
    roomAmbientGlowIntensity: 0
  },
  {
    ...DEFAULT_MAIN_ROOM_CONFIG,
    id: 'preset_royal_gold',
    name: 'الذهب والملكيات الفاخرة (Royal Gold 👑)',
    speakingGlowColor: '#f59e0b',
    speakingGlowIntensity: 32,
    speakingRingColor: '#fbbf24',
    speakingWaveformStyle: 'fire_aura',
    speakingScaleMultiplier: 1.18,
    seatShape: 'circle',
    emptySeatBgColor: '#451a03',
    emptySeatOpacity: 35,
    emptySeatBorderColor: '#f59e0b',
    emptySeatPlusColor: '#fde047',
    lockedSeatBgColor: '#291400',
    lockedSeatBorderColor: '#b45309',
    occupiedSeatBorderColor: '#fbbf24',
    occupiedSeatGlowColor: '#f59e0b',
    occupiedSeatGlowIntensity: 22,
    topBarBgColor: '#1a1003',
    topBarOpacity: 92,
    topBarBorderColor: '#f59e0b',
    roomTitleColor: '#fef08a',
    bottomBarBgColor: '#1a1003',
    bottomBarOpacity: 95,
    bottomBarBorderColor: '#f59e0b',
    bottomButtonsBg: '#2e1c07',
    bottomButtonsColor: '#fde047',
    bottomGiftGlowColor: '#f59e0b',
    bottomGiftGlowIntensity: 35,
    roomOverlayDarkness: 0,
    roomAmbientGlowColor: '#d97706',
    roomAmbientGlowIntensity: 0
  },
  {
    ...DEFAULT_MAIN_ROOM_CONFIG,
    id: 'preset_ruby_velvet',
    name: 'الياقوت والورود المخملية (Ruby Velvet 🌹)',
    speakingGlowColor: '#f43f5e',
    speakingGlowIntensity: 30,
    speakingRingColor: '#fb7185',
    speakingWaveformStyle: 'audio_ripple',
    speakingScaleMultiplier: 1.16,
    seatShape: 'squircle',
    emptySeatBgColor: '#4c0519',
    emptySeatOpacity: 40,
    emptySeatBorderColor: '#fb7185',
    emptySeatPlusColor: '#ffe4e6',
    lockedSeatBgColor: '#2a0410',
    lockedSeatBorderColor: '#e11d48',
    occupiedSeatBorderColor: '#f43f5e',
    occupiedSeatGlowColor: '#e11d48',
    occupiedSeatGlowIntensity: 20,
    topBarBgColor: '#1c030c',
    topBarOpacity: 92,
    topBarBorderColor: '#f43f5e',
    roomTitleColor: '#ffe4e6',
    bottomBarBgColor: '#1c030c',
    bottomBarOpacity: 95,
    bottomBarBorderColor: '#f43f5e',
    bottomButtonsBg: '#3b071a',
    bottomButtonsColor: '#fda4af',
    bottomGiftGlowColor: '#f43f5e',
    bottomGiftGlowIntensity: 32,
    roomOverlayDarkness: 0,
    roomAmbientGlowColor: '#e11d48',
    roomAmbientGlowIntensity: 0
  },
  {
    ...DEFAULT_MAIN_ROOM_CONFIG,
    id: 'preset_emerald_matrix',
    name: 'الماتريكس والزمرد الرقمي (Emerald Matrix 🍃)',
    speakingGlowColor: '#10b981',
    speakingGlowIntensity: 34,
    speakingRingColor: '#34d399',
    speakingWaveformStyle: 'cyber_matrix',
    speakingScaleMultiplier: 1.22,
    seatShape: 'hexagon',
    emptySeatBgColor: '#022c22',
    emptySeatOpacity: 40,
    emptySeatBorderColor: '#10b981',
    emptySeatPlusColor: '#6ee7b7',
    lockedSeatBgColor: '#064e3b',
    lockedSeatBorderColor: '#059669',
    occupiedSeatBorderColor: '#10b981',
    occupiedSeatGlowColor: '#059669',
    occupiedSeatGlowIntensity: 22,
    topBarBgColor: '#022c22',
    topBarOpacity: 92,
    topBarBorderColor: '#10b981',
    roomTitleColor: '#a7f3d0',
    bottomBarBgColor: '#022c22',
    bottomBarOpacity: 95,
    bottomBarBorderColor: '#10b981',
    bottomButtonsBg: '#064e3b',
    bottomButtonsColor: '#a7f3d0',
    bottomGiftGlowColor: '#10b981',
    bottomGiftGlowIntensity: 30,
    roomOverlayDarkness: 0,
    roomAmbientGlowColor: '#059669',
    roomAmbientGlowIntensity: 0
  }
];

export function getMainRoomCustomizerConfig(): MainRoomCustomizerConfig {
  if (typeof window === 'undefined') return DEFAULT_MAIN_ROOM_CONFIG;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const resolved: MainRoomCustomizerConfig = {
        ...DEFAULT_MAIN_ROOM_CONFIG,
        ...parsed,
        // دائماً عند فتح البرنامج تكون الصيغة الافتراضية: ألوان طبيعية 100% (إلغاء التظليل والتعتيم تماماً)
        roomOverlayDarkness: 0,
        activeWallpaperDimming: 0,
        activeWallpaperBrightness: 100,
        roomAmbientGlowIntensity: 0,
        roomBackdropBlur: 0
      };
      // حفظ الصيغة الافتراضية في التخزين المحلي لضمان عدم عودة التظليل القديم أبداً
      if (parsed.roomOverlayDarkness !== 0 || parsed.activeWallpaperDimming !== 0) {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(resolved));
        } catch {}
      }
      return resolved;
    }
  } catch (e) {
    console.warn('Error reading main room customizer config:', e);
  }
  return DEFAULT_MAIN_ROOM_CONFIG;
}

export function saveMainRoomCustomizerConfig(config: MainRoomCustomizerConfig): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    window.dispatchEvent(
      new CustomEvent('main_room_theme_updated', {
        detail: { config }
      })
    );
  } catch (e) {
    console.error('Error saving main room customizer config:', e);
  }
}

export function resetMainRoomCustomizerConfig(): MainRoomCustomizerConfig {
  if (typeof window === 'undefined') return DEFAULT_MAIN_ROOM_CONFIG;
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(
      new CustomEvent('main_room_theme_updated', {
        detail: { config: DEFAULT_MAIN_ROOM_CONFIG }
      })
    );
  } catch (e) {
    console.error('Error resetting main room customizer config:', e);
  }
  return DEFAULT_MAIN_ROOM_CONFIG;
}

export function hexToRgba(hex: string, alpha: number): string {
  if (!hex) return `rgba(0, 0, 0, ${alpha})`;
  if (hex.startsWith('rgba') || hex.startsWith('rgb')) return hex;
  
  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map((c) => c + c).join('');
  }
  
  const num = parseInt(cleanHex, 16);
  if (isNaN(num)) return `rgba(0, 0, 0, ${alpha})`;
  
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(1, alpha))})`;
}
