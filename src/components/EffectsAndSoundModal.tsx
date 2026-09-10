import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Sparkles,
  Gift,
  Crown,
  Trophy,
  Smile,
  Globe,
  Radio,
  ChevronsUpDown,
  Volume2,
  VolumeX,
  Mic,
  Wifi,
  SlidersHorizontal,
  RotateCcw,
  Check,
  AlertCircle,
  Zap,
  Flame,
  ShieldCheck,
  Music,
  Gauge
} from 'lucide-react';

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

  // خيارات إضافية لتوازن الصوت
  smartBalance?: boolean;
  audioBalance?: number;
}

const DEFAULT_CONFIG: RoomEffectsAndSoundConfig = {
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

interface EffectsAndSoundModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerToast?: (msg: string) => void;
  onSettingsChanged?: (config: RoomEffectsAndSoundConfig) => void;
}

export const EffectsAndSoundModal: React.FC<EffectsAndSoundModalProps> = ({
  isOpen,
  onClose,
  onTriggerToast,
  onSettingsChanged
}) => {
  const [config, setConfig] = useState<RoomEffectsAndSoundConfig>(getStoredEffectsAndSoundConfig);
  const [activeTab, setActiveTab] = useState<'all' | 'effects' | 'sound' | 'balance'>('all');

  useEffect(() => {
    if (isOpen) {
      setConfig(getStoredEffectsAndSoundConfig());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggle = (key: keyof RoomEffectsAndSoundConfig, labelArabic: string) => {
    const nextVal = !config[key];
    const newConfig = { ...config, [key]: nextVal };
    setConfig(newConfig);
    saveEffectsAndSoundConfig(newConfig);
    onSettingsChanged?.(newConfig);

    const statusText = nextVal ? 'تشغيل ✅' : 'إيقاف ❌';
    onTriggerToast?.(`${labelArabic}: ${statusText}`);
  };

  const handleResetDefaults = () => {
    setConfig(DEFAULT_CONFIG);
    saveEffectsAndSoundConfig(DEFAULT_CONFIG);
    onSettingsChanged?.(DEFAULT_CONFIG);
    onTriggerToast?.('تمت إعادة ضبط جميع إعدادات التأثير والصوت للوضع الافتراضي 🔄');
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 bg-transparent flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-auto select-none cursor-default"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md bg-[#0F172A] border-t sm:border border-slate-700/80 rounded-t-[32px] sm:rounded-3xl shadow-2xl text-white flex flex-col max-h-[82vh] overflow-hidden dir-rtl"
        >
          {/* Header Bar */}
          <div className="relative px-5 pt-4 pb-3.5 bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <SlidersHorizontal className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-base font-black text-white flex items-center gap-2">
                  تحويل التأثير والصوت
                </h2>
                <p className="text-[11px] text-indigo-300 font-bold">
                  التحكم الكامل في مؤثرات الغرفة، الصوتيات وتوفير البيانات
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Filter Tabs */}
          <div className="flex items-center gap-1.5 px-4 pt-2.5 pb-1 bg-slate-950/50 border-b border-slate-800/60 shrink-0 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              الكل (11 إعداد)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('effects')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'effects'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              إعدادات المؤثرات (8)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('sound')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'sound'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
              إعدادات الصوت (3)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('balance')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'balance'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Gauge className="w-3.5 h-3.5 text-pink-400" />
              توازن الصوت الذكي
            </button>
          </div>

          {/* Scrollable List Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar">
            {/* ========================================================================= */}
            {/* 1. SECTION: إعدادات المؤثرات (EFFECTS SETTINGS)                           */}
            {/* ========================================================================= */}
            {(activeTab === 'all' || activeTab === 'effects') && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    إعدادات المؤثرات
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                    8 خيارات تحكم
                  </span>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl divide-y divide-slate-800/80 overflow-hidden shadow-md">
                  {/* 1. الأني ميشن الفاز */}
                  <div className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-800/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
                        <Flame className="w-4.5 h-4.5" />
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                          1. الأني ميشن الفاز
                        </h4>
                        <p className="text-[10.5px] text-slate-400 font-medium leading-tight">
                          تشغيل تأثيرات وحركات الفازات وصناديق الهدايا
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggle('vaseAnimation', 'الأني ميشن الفاز')}
                      className={`w-12 h-6.5 rounded-full transition-colors relative cursor-pointer p-0.5 shrink-0 ${
                        config.vaseAnimation
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-500 shadow-sm shadow-amber-500/30'
                          : 'bg-slate-700'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform transform ${
                          config.vaseAnimation ? '-translate-x-5.5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* 2. المؤثرات البصرية للهدية */}
                  <div className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-800/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-500/20 to-rose-600/20 border border-pink-500/30 flex items-center justify-center text-pink-400 shrink-0 shadow-inner">
                        <Gift className="w-4.5 h-4.5" />
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                          2. المؤثرات البصرية للهدية
                        </h4>
                        <p className="text-[10.5px] text-slate-400 font-medium leading-tight">
                          عرض الرسوم المتحركة ثلاثية الأبعاد وحركة طيران الهدايا
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggle('giftVisualEffects', 'المؤثرات البصرية للهدية')}
                      className={`w-12 h-6.5 rounded-full transition-colors relative cursor-pointer p-0.5 shrink-0 ${
                        config.giftVisualEffects
                          ? 'bg-gradient-to-r from-pink-500 to-rose-500 shadow-sm shadow-pink-500/30'
                          : 'bg-slate-700'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform transform ${
                          config.giftVisualEffects ? '-translate-x-5.5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* 3. المؤثرات البصرية للدخول */}
                  <div className="p-3.5 flex flex-col gap-2 hover:bg-slate-800/30 transition-colors">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 shadow-inner">
                          <Crown className="w-4.5 h-4.5" />
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                            3. المؤثرات البصرية للدخول
                          </h4>
                          <p className="text-[10.5px] text-slate-400 font-medium leading-tight">
                            عرض مراكب وتأثيرات دخول الأعضاء المميزين
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggle('entranceVisualEffects', 'المؤثرات البصرية للدخول')}
                        className={`w-12 h-6.5 rounded-full transition-colors relative cursor-pointer p-0.5 shrink-0 ${
                          config.entranceVisualEffects
                            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 shadow-sm shadow-indigo-500/30'
                            : 'bg-slate-700'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform transform ${
                            config.entranceVisualEffects ? '-translate-x-5.5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    {/* تنبيه VIP 11 فما فوق (Notice Required) */}
                    <div className="mt-1 bg-amber-500/10 border border-amber-500/30 rounded-xl p-2 flex items-start gap-2 text-amber-300">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                      <span className="text-[10px] font-bold leading-relaxed">
                        تنبيه: لا يمكن إخفاء الدخوليات لـ VIP 11 فما فوق
                      </span>
                    </div>
                  </div>

                  {/* 4. تأثير المكافأة */}
                  <div className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-800/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-inner">
                        <Trophy className="w-4.5 h-4.5" />
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                          4. تأثير المكافأة
                        </h4>
                        <p className="text-[10.5px] text-slate-400 font-medium leading-tight">
                          إظهار ومضات جوائز ومكافآت الغرفة والألعاب
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggle('rewardEffect', 'تأثير المكافأة')}
                      className={`w-12 h-6.5 rounded-full transition-colors relative cursor-pointer p-0.5 shrink-0 ${
                        config.rewardEffect
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-sm shadow-emerald-500/30'
                          : 'bg-slate-700'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform transform ${
                          config.rewardEffect ? '-translate-x-5.5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* 5. الايموجي للتعليق */}
                  <div className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-800/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-600/20 border border-yellow-500/30 flex items-center justify-center text-yellow-400 shrink-0 shadow-inner">
                        <Smile className="w-4.5 h-4.5" />
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                          5. الايموجي للتعليق
                        </h4>
                        <p className="text-[10.5px] text-slate-400 font-medium leading-tight">
                          عرض الرموز التعبيرية والتفاعلات المصاحبة للرسائل
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggle('commentEmoji', 'الايموجي للتعليق')}
                      className={`w-12 h-6.5 rounded-full transition-colors relative cursor-pointer p-0.5 shrink-0 ${
                        config.commentEmoji
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500 shadow-sm shadow-yellow-500/30'
                          : 'bg-slate-700'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform transform ${
                          config.commentEmoji ? '-translate-x-5.5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* 6. إشعار عالمي */}
                  <div className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-800/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 shadow-inner">
                        <Globe className="w-4.5 h-4.5" />
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                          6. إشعار عالمي
                        </h4>
                        <p className="text-[10.5px] text-slate-400 font-medium leading-tight">
                          إظهار إشعارات الهدايا الفاخرة المتبادلة عبر التطبيق
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggle('globalNotification', 'إشعار عالمي')}
                      className={`w-12 h-6.5 rounded-full transition-colors relative cursor-pointer p-0.5 shrink-0 ${
                        config.globalNotification
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 shadow-sm shadow-blue-500/30'
                          : 'bg-slate-700'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform transform ${
                          config.globalNotification ? '-translate-x-5.5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* 7. قناة الهدايا */}
                  <div className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-800/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 shadow-inner">
                        <Radio className="w-4.5 h-4.5" />
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                          7. قناة الهدايا
                        </h4>
                        <p className="text-[10.5px] text-slate-400 font-medium leading-tight">
                          عرض شريط بث وتدفق إهداءات الغرفة المباشر
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggle('giftChannel', 'قناة الهدايا')}
                      className={`w-12 h-6.5 rounded-full transition-colors relative cursor-pointer p-0.5 shrink-0 ${
                        config.giftChannel
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-sm shadow-purple-500/30'
                          : 'bg-slate-700'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform transform ${
                          config.giftChannel ? '-translate-x-5.5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* 8. ارفع لأعلى وأسفل لتغيير الغرفة */}
                  <div className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-800/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500/20 to-emerald-600/20 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0 shadow-inner">
                        <ChevronsUpDown className="w-4.5 h-4.5" />
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                          8. ارفع لأعلى وأسفل لتغيير الغرفة
                        </h4>
                        <p className="text-[10.5px] text-slate-400 font-medium leading-tight">
                          السحب العمودي للتنقل السريع بين الغرف المتاحة
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggle('swipeToChangeRoom', 'ارفع لأعلى وأسفل لتغيير الغرفة')}
                      className={`w-12 h-6.5 rounded-full transition-colors relative cursor-pointer p-0.5 shrink-0 ${
                        config.swipeToChangeRoom
                          ? 'bg-gradient-to-r from-teal-500 to-emerald-500 shadow-sm shadow-teal-500/30'
                          : 'bg-slate-700'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform transform ${
                          config.swipeToChangeRoom ? '-translate-x-5.5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* 2. SECTION: إعدادات الصوت (SOUND SETTINGS)                               */}
            {/* ========================================================================= */}
            {(activeTab === 'all' || activeTab === 'sound') && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-black text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Volume2 className="w-4 h-4 text-cyan-400" />
                    إعدادات الصوت
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                    3 خيارات تحكم
                  </span>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl divide-y divide-slate-800/80 overflow-hidden shadow-md">
                  {/* 9. صوت الهدية */}
                  <div className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-800/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 shadow-inner">
                        <Volume2 className="w-4.5 h-4.5" />
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                          9. صوت الهدية
                        </h4>
                        <p className="text-[10.5px] text-slate-400 font-medium leading-tight">
                          تشغيل النغمات والمؤثرات الصوتية عند إرسال واستقبال الهدايا
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggle('giftSound', 'صوت الهدية')}
                      className={`w-12 h-6.5 rounded-full transition-colors relative cursor-pointer p-0.5 shrink-0 ${
                        config.giftSound
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-500 shadow-sm shadow-cyan-500/30'
                          : 'bg-slate-700'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform transform ${
                          config.giftSound ? '-translate-x-5.5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* 10. إلغاء ضوضاء الميكروفون */}
                  <div className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-800/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-inner">
                        <ShieldCheck className="w-4.5 h-4.5" />
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                          10. إلغاء ضوضاء الميكروفون
                        </h4>
                        <p className="text-[10.5px] text-slate-400 font-medium leading-tight">
                          عزل الضوضاء المحيطة وتحسين وضوح ونقاء الصوت على المايك
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggle('micNoiseCancellation', 'إلغاء ضوضاء الميكروفون')}
                      className={`w-12 h-6.5 rounded-full transition-colors relative cursor-pointer p-0.5 shrink-0 ${
                        config.micNoiseCancellation
                          ? 'bg-gradient-to-r from-emerald-500 to-green-500 shadow-sm shadow-emerald-500/30'
                          : 'bg-slate-700'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform transform ${
                          config.micNoiseCancellation ? '-translate-x-5.5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* 11. توفير البيانات */}
                  <div className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-800/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
                        <Wifi className="w-4.5 h-4.5" />
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                          11. توفير البيانات
                        </h4>
                        <p className="text-[10.5px] text-slate-400 font-medium leading-tight">
                          تقليل استهلاك الإنترنت وتسريع تحميل الصوت في الشبكات الضعيفة
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggle('dataSaver', 'توفير البيانات')}
                      className={`w-12 h-6.5 rounded-full transition-colors relative cursor-pointer p-0.5 shrink-0 ${
                        config.dataSaver
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-sm shadow-amber-500/30'
                          : 'bg-slate-700'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform transform ${
                          config.dataSaver ? '-translate-x-5.5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* 3. SECTION: توازن الصوت الذكي (SMART AUDIO BALANCE)                       */}
            {/* ========================================================================= */}
            {(activeTab === 'all' || activeTab === 'balance') && (
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-black text-pink-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Gauge className="w-4 h-4 text-pink-400" />
                    توازن الصوت والتحكم الذكي
                  </span>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-4 shadow-md">
                  {/* Smart Balance Auto-Ducking */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                        التحكم الذكي بالتوازن (Smart Balance)
                      </h4>
                      <p className="text-[10px] text-slate-400 font-medium">
                        خفض الموسيقى تلقائياً لمنع التداخل أثناء حديث المذيعين
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggle('smartBalance', 'التحكم الذكي بالتوازن')}
                      className={`w-12 h-6.5 rounded-full transition-colors relative cursor-pointer p-0.5 shrink-0 ${
                        config.smartBalance
                          ? 'bg-gradient-to-r from-pink-500 to-purple-600 shadow-sm shadow-pink-500/30'
                          : 'bg-slate-700'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform transform ${
                          config.smartBalance ? '-translate-x-5.5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Audio Balance Slider */}
                  <div className="pt-2 border-t border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <Volume2 className="w-3.5 h-3.5 text-blue-400" />
                        توزيع مستوى الصوت (المايك vs الموسيقى)
                      </span>
                      <span className="text-[10.5px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                        {(config.audioBalance ?? 50) < 50
                          ? `المايك ${100 - (config.audioBalance ?? 50)}%`
                          : (config.audioBalance ?? 50) > 50
                          ? `الموسيقى ${config.audioBalance ?? 50}%`
                          : 'توازن 50/50 ⚖️'}
                      </span>
                    </div>

                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={config.audioBalance ?? 50}
                      onChange={(e) => {
                        const newBal = Number(e.target.value);
                        const newCfg = { ...config, audioBalance: newBal };
                        setConfig(newCfg);
                        saveEffectsAndSoundConfig(newCfg);
                        onSettingsChanged?.(newCfg);
                      }}
                      className="w-full accent-indigo-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                    />

                    <div className="flex justify-between text-[9.5px] font-bold text-slate-400 px-0.5">
                      <span className="flex items-center gap-1 text-cyan-400">
                        <Mic className="w-3 h-3" /> صوت المايك أعلى
                      </span>
                      <span className="text-slate-300">متوازن 50/50 ⚖️</span>
                      <span className="flex items-center gap-1 text-purple-400">
                        صوت الموسيقى أعلى <Music className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="py-2.5 px-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              إعادة الضبط
            </button>

            <button
              type="button"
              onClick={() => {
                onTriggerToast?.('تم حفظ إعدادات التأثير والصوت بنجاح ✨');
                onClose();
              }}
              className="py-2.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:brightness-110 text-white text-xs font-black shadow-lg shadow-indigo-500/25 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <Check className="w-4 h-4" />
              حفظ وإغلاق
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
