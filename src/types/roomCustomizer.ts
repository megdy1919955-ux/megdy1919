/**
 * أنواع وبيانات محرك التخصيص الشامل للروم الرئيسي (Room Customization Engine)
 * خاص بالمبرمج فقط ومستقل تماماً عن إعدادات النوافذ الأخرى
 */

export type SpeakingWaveformStyle = 'ring_pulse' | 'neon_glow' | 'audio_ripple' | 'fire_aura' | 'cosmic_spark' | 'cyber_matrix';

export type SeatShapeType = 'circle' | 'squircle' | 'rounded_rect' | 'hexagon' | 'diamond_shield';

export interface MainRoomCustomizerConfig {
  id: string;
  name: string;
  isPreset?: boolean;

  // 1. تخصيص المايكات والذبذبات والتوهج الصوتي (Audio Glow & Waveforms)
  speakingGlowColor: string;
  speakingGlowIntensity: number; // 0 to 60 px
  speakingRingColor: string;
  speakingRingWidth: number; // 1 to 8 px
  speakingWaveformStyle: SpeakingWaveformStyle;
  speakingPulseSpeed: number; // 0.5s to 3s (duration)
  speakingScaleMultiplier: number; // 1.05 to 1.4

  // 2. تخصيص المقاعد والمايكات المفتوحة والمقفلة
  seatShape: SeatShapeType;
  emptySeatBgColor: string;
  emptySeatOpacity: number; // 0 to 100%
  emptySeatBorderColor: string;
  emptySeatBorderWidth: number; // 1 to 6 px
  emptySeatBorderDashed: boolean;
  emptySeatPlusColor: string;
  
  lockedSeatBgColor: string;
  lockedSeatOpacity: number; // 0 to 100%
  lockedSeatBorderColor: string;
  lockedSeatLockColor: string;

  occupiedSeatBorderColor: string;
  occupiedSeatGlowColor: string;
  occupiedSeatGlowIntensity: number; // 0 to 40 px
  
  seatNumberBadgeBg: string;
  seatNumberBadgeColor: string;
  seatNameTextColor: string;

  // خيار دمج صورة خلفية كرسي المقعد (Custom Chair Frame / Image)
  customChairFrameUrl?: string;
  customChairFrameOpacity: number; // 0 to 100%

  // 3. تخصيص عناصر الشريط العلوي وعنوان الروم
  topBarBgColor: string;
  topBarOpacity: number; // 0 to 100%
  topBarBorderColor: string;
  topBarBackdropBlur: number; // 0 to 30 px
  
  roomTitleColor: string;
  roomIdBadgeBg: string;
  roomIdBadgeColor: string;
  ownerTagBg: string;
  ownerTagColor: string;
  
  topAudiencePillBg: string;
  topAudiencePillBorder: string;
  topAudienceTextColor: string;
  
  topMoreBtnBg: string;
  topMoreBtnColor: string;
  topPowerBtnBg: string;
  topPowerBtnColor: string;

  // 4. تخصيص شريط التحكم السفلي والأيقونات
  bottomBarBgColor: string;
  bottomBarOpacity: number; // 0 to 100%
  bottomBarBorderColor: string;
  bottomBarBackdropBlur: number; // 0 to 30 px
  
  bottomButtonsBg: string;
  bottomButtonsColor: string;
  bottomButtonsBorder: string;
  bottomGiftGlowColor: string;
  bottomGiftGlowIntensity: number; // 0 to 40 px

  // 5. تخصيص إضاءة وتعتيم خلفية الروم وتظليل المايكات (Active Wallpaper Lighting & Mic Overlay)
  roomOverlayDarkness: number; // 0 to 100% (درجة تظليل وتعتيم خلفية المايكات)
  roomBackdropBlur: number; // 0 to 40 px (ضبابية تظليل خلفية المايكات)
  roomAmbientGlowColor: string;
  roomAmbientGlowIntensity: number; // 0 to 100%
  
  // التحكم الكامل بإضاءة وتعتيم وشفافية خلفية الروم الحالية (التي أعدها صاحب الروم)
  activeWallpaperBrightness: number; // 10% to 200% (رفع الإضاءة أو خفضها)
  activeWallpaperDimming: number; // 0% to 100% (تعتيم وتظليل الخلفية)
  activeWallpaperOpacity: number; // 0% to 100% (إظهار أو إخفاء وشفافية الخلفية)
  activeWallpaperContrast: number; // 50% to 150% (تباين الخلفية)
}
