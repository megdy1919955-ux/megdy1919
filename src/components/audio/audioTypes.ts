export interface RoomEffectsAndSoundConfig {
  // إعدادات المؤثرات (8 عناصر)
  vaseAnimation: boolean; // 1. الأني ميشن الفاز
  giftVisualEffects: boolean; // 2. المؤثرات البصرية للهدية
  entranceVisualEffects: boolean; // 3. المؤثرات البصرية للدخول
  rewardEffect: boolean; // 4. تأثير المكافأة
  commentEmoji: boolean; // 5. الايموجي للتعليق
  globalNotification: boolean; // 6. إشعار عالمي
  giftChannel: boolean; // 7. قناة الهدايا
  swipeToChangeRoom: boolean; // 8. ارفع لأعلى وأسفل لتغيير الغرفة

  // إعدادات الصوت (3 عناصر)
  giftSound: boolean; // 9. صوت الهدية
  micNoiseCancellation: boolean; // 10. إلغاء ضوضاء الميكروفون
  dataSaver: boolean; // 11. توفير البيانات

  // خيارات إضافية لتوازن ونمط مسار الصوت
  audioStreamMode?: 'media' | 'communication'; // مسار الصوت: وسائط (Media Stream) أو مكالمة (Call Stream)
  smartBalance?: boolean;
  audioBalance?: number;
}

export const DEFAULT_CONFIG: RoomEffectsAndSoundConfig = {
  vaseAnimation: true,
  giftVisualEffects: true,
  entranceVisualEffects: true,
  rewardEffect: true,
  commentEmoji: true,
  globalNotification: true,
  giftChannel: true,
  swipeToChangeRoom: true,
  giftSound: true,
  micNoiseCancellation: true,
  dataSaver: false,
  audioStreamMode: 'media', // Default to Media Stream (Normal Mode / STREAM_MUSIC)
  smartBalance: true,
  audioBalance: 50
};

export const getStoredEffectsAndSoundConfig = (): RoomEffectsAndSoundConfig => {
  try {
    const saved = localStorage.getItem('super_legend_room_effects_sound_settings');
    if (saved) {
      return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error('Failed to parse effects & sound config', e);
  }
  return DEFAULT_CONFIG;
};

export const saveEffectsAndSoundConfig = (config: RoomEffectsAndSoundConfig) => {
  try {
    localStorage.setItem('super_legend_room_effects_sound_settings', JSON.stringify(config));
    window.dispatchEvent(new CustomEvent('room_effects_sound_updated', { detail: config }));
  } catch (e) {
    console.error('Failed to save effects & sound config', e);
  }
};
