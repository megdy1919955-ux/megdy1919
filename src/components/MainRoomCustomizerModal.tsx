import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Sliders,
  Sparkles,
  Radio,
  Palette,
  Eye,
  RotateCcw,
  Check,
  Upload,
  Lock,
  Layers,
  Sun,
  ShieldCheck,
  Flame,
  Zap,
  Activity,
  Moon,
  Contrast,
  Crown,
  CloudCheck
} from 'lucide-react';
import {
  MainRoomCustomizerConfig,
  SpeakingWaveformStyle,
  SeatShapeType
} from '../types/roomCustomizer';
import {
  getMainRoomCustomizerConfig,
  saveMainRoomCustomizerConfig,
  resetMainRoomCustomizerConfig,
  ROOM_PRESET_THEMES,
  PRESET_CHAIR_GRAPHICS,
  DEFAULT_MAIN_ROOM_CONFIG
} from '../lib/roomCustomizerService';
import {
  saveRoomThemeAndWallpaperToFirestore,
  fetchRoomThemeFromFirestore
} from '../lib/roomThemeFirestoreService';

interface MainRoomCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigChange?: (config: MainRoomCustomizerConfig) => void;
  roomId?: string;
  isOwner?: boolean;
  ownerId?: string;
  ownerName?: string;
  roomTitle?: string;
  wallpaperUrl?: string;
  wallpaperName?: string;
  initialConfig?: MainRoomCustomizerConfig;
}

export const MainRoomCustomizerModal: React.FC<MainRoomCustomizerModalProps> = ({
  isOpen,
  onClose,
  onConfigChange,
  roomId = '884920',
  isOwner = true,
  ownerId = '88492011',
  ownerName = 'أميرة الشرق',
  roomTitle = 'روم السهرة والنغم 🎵',
  wallpaperUrl = 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=1200',
  wallpaperName = 'القصر الملكي البنفسجي 🏰',
  initialConfig
}) => {
  const [activeTab, setActiveTab] = useState<'mics' | 'seats' | 'top_bar' | 'bottom_bar' | 'backdrop' | 'presets'>('backdrop');
  const [config, setConfig] = useState<MainRoomCustomizerConfig>(() => initialConfig || getMainRoomCustomizerConfig());
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSyncingFirestore, setIsSyncingFirestore] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialConfig) {
      setConfig(initialConfig);
    }
  }, [initialConfig]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const updateConfig = async (updates: Partial<MainRoomCustomizerConfig>) => {
    if (!isOwner) {
      showToast('عذراً، صلاحية تعديل وحفظ ثيم الغرفة محصورة لصاحب الغرفة (المالك) فقط 👑');
      return;
    }

    const updated = { ...config, ...updates, isPreset: false };
    setConfig(updated);
    saveMainRoomCustomizerConfig(updated);
    onConfigChange?.(updated);

    // Persist asynchronously to Firestore linked to roomId
    setIsSyncingFirestore(true);
    try {
      await saveRoomThemeAndWallpaperToFirestore({
        roomId,
        isOwner: true,
        ownerId,
        ownerName,
        roomTitle,
        wallpaperUrl,
        wallpaperName,
        themeConfig: updated
      });
    } catch (err) {
      console.warn('Firestore sync warning:', err);
    } finally {
      setIsSyncingFirestore(false);
    }
  };

  const handleApplyPreset = async (preset: MainRoomCustomizerConfig) => {
    if (!isOwner) {
      showToast('عذراً، صلاحية تعديل وتطبيق ثيم الغرفة محصورة لصاحب الغرفة (المالك) فقط 👑');
      return;
    }

    const updated = { ...preset };
    setConfig(updated);
    saveMainRoomCustomizerConfig(updated);
    onConfigChange?.(updated);
    showToast(`تم تطبيق وحفظ ثيم: ${preset.name} في قاعدة بيانات الروم [${roomId}] ✨`);

    setIsSyncingFirestore(true);
    try {
      await saveRoomThemeAndWallpaperToFirestore({
        roomId,
        isOwner: true,
        ownerId,
        ownerName,
        roomTitle,
        wallpaperUrl,
        wallpaperName,
        themeConfig: updated
      });
    } catch (err) {
      console.warn('Firestore sync warning:', err);
    } finally {
      setIsSyncingFirestore(false);
    }
  };

  const handleReset = async () => {
    if (!isOwner) {
      showToast('عذراً، استعادة الإعدادات محصورة لصاحب الغرفة (المالك) فقط 👑');
      return;
    }

    const reset = resetMainRoomCustomizerConfig();
    setConfig(reset);
    onConfigChange?.(reset);
    showToast('تمت استعادة إعدادات الروم الافتراضية وحفظها في قاعدة البيانات 🔄');

    setIsSyncingFirestore(true);
    try {
      await saveRoomThemeAndWallpaperToFirestore({
        roomId,
        isOwner: true,
        ownerId,
        ownerName,
        roomTitle,
        wallpaperUrl,
        wallpaperName,
        themeConfig: reset
      });
    } catch (err) {
      console.warn('Firestore reset sync warning:', err);
    } finally {
      setIsSyncingFirestore(false);
    }
  };

  const handleCustomChairUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast('⚠️ حجم الصورة يجب ألا يتجاوز 5 ميغابايت');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      updateConfig({ customChairFrameUrl: dataUrl });
      showToast('تم رفع وتثبيت صورة كرسي المقعد بنجاح 🪑');
    };
    reader.readAsDataURL(file);
  };

  const QUICK_PALETTES = [
    '#22c55e', '#38bdf8', '#06b6d4', '#f59e0b', '#ec4899', '#f43f5e',
    '#a855f7', '#6366f1', '#eab308', '#ffffff', '#1e293b', '#000000'
  ];

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 cursor-default select-none"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 26, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg bg-[#0d1322] border-t-2 sm:border-2 border-cyan-500/50 rounded-t-3xl sm:rounded-3xl shadow-[0_0_50px_rgba(6,182,212,0.3)] text-white p-4 h-[86vh] max-h-[86vh] flex flex-col justify-between overflow-hidden relative"
          dir="rtl"
        >
          {/* Top Header */}
          <div className="space-y-2 border-b border-cyan-500/20 pb-3 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-2xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 shadow-md text-white">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h2 className="text-base font-black text-white">تخصيص ثيم وإضاءة الغرفة 🎨</h2>
                    <span className="text-[9px] font-mono bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 px-2 py-0.5 rounded-full font-black flex items-center gap-1">
                      <Crown className="w-3 h-3 text-amber-300" />
                      <span>صاحب الغرفة فقط</span>
                    </span>
                    <span className="text-[9px] font-mono bg-slate-800 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                      ID: {roomId}
                    </span>
                  </div>
                  <p className="text-[10px] text-cyan-200/70 font-medium">
                    حفظ تلقائي وفوري في قاعدة البيانات السحابية مرتبط برقم الغرفة (room_id: {roomId})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleReset}
                  className="p-1.5 text-slate-400 hover:text-amber-400 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                  title="استعادة الإعدادات الافتراضية"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="grid grid-cols-6 gap-1 bg-[#070b14] p-1 rounded-2xl border border-white/10 text-center text-[10px] font-black">
              <button
                type="button"
                onClick={() => setActiveTab('mics')}
                className={`py-1.5 rounded-xl transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                  activeTab === 'mics'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Radio className="w-3.5 h-3.5" />
                <span className="truncate">المايكات</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('seats')}
                className={`py-1.5 rounded-xl transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                  activeTab === 'seats'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="truncate">المقاعد</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('top_bar')}
                className={`py-1.5 rounded-xl transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                  activeTab === 'top_bar'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span className="truncate">العلوي</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('bottom_bar')}
                className={`py-1.5 rounded-xl transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                  activeTab === 'bottom_bar'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span className="truncate">السفلي</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('backdrop')}
                className={`py-1.5 rounded-xl transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                  activeTab === 'backdrop'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span className="truncate">الإضاءة والتظليل</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('presets')}
                className={`py-1.5 rounded-xl transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                  activeTab === 'presets'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span className="truncate">الثيمات</span>
              </button>
            </div>
          </div>

          {/* Tab Content Area */}
          <div className="flex-1 overflow-y-auto no-scrollbar py-2.5 space-y-3.5 text-xs pr-1">
            {/* 1. MICS & SPEAKING GLOW TAB */}
            {activeTab === 'mics' && (
              <div className="space-y-3.5">
                {/* Live Speaking Simulation Box */}
                <div className="p-3.5 rounded-2xl bg-[#090d16] border border-cyan-500/30 flex items-center justify-between shadow-inner">
                  <div className="flex items-center gap-3">
                    {/* Animated Preview Mic Orb */}
                    <div className="relative flex items-center justify-center w-14 h-14">
                      {/* Glow rings */}
                      <motion.div
                        animate={{
                          scale: [1, config.speakingScaleMultiplier, 1],
                          opacity: [0.3, 0.9, 0.3]
                        }}
                        transition={{ repeat: Infinity, duration: config.speakingPulseSpeed, ease: 'easeInOut' }}
                        className="absolute inset-0 rounded-full"
                        style={{
                          boxShadow: `0 0 ${config.speakingGlowIntensity}px ${config.speakingGlowColor}`,
                          border: `${config.speakingRingWidth}px solid ${config.speakingRingColor}`
                        }}
                      />
                      <div className="w-11 h-11 rounded-full bg-slate-900 border-2 border-cyan-400 flex items-center justify-center relative z-10">
                        <Radio className="w-5 h-5 text-cyan-300 animate-pulse" />
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-black text-white">معاينة حية لتوهج التحدث</div>
                      <div className="text-[10px] text-cyan-300 font-mono">
                        {config.speakingWaveformStyle} • {config.speakingGlowIntensity}px Glow
                      </div>
                    </div>
                  </div>

                  <div className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black border border-emerald-500/40 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>تحدث نشط</span>
                  </div>
                </div>

                {/* Waveform Styles Grid */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-cyan-200 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>نمط الذبذبات وحلقات التوهج الصوتي:</span>
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'audio_ripple', label: 'أمواج دائرية 🌊' },
                      { id: 'neon_glow', label: 'نيون مشع ⚡' },
                      { id: 'fire_aura', label: 'توهج ناري 🔥' },
                      { id: 'ring_pulse', label: 'نبض كلاسيكي 💫' },
                      { id: 'cosmic_spark', label: 'شرار كوني ✨' },
                      { id: 'cyber_matrix', label: 'ماتريكس رقمي 🍃' }
                    ].map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => updateConfig({ speakingWaveformStyle: st.id as SpeakingWaveformStyle })}
                        className={`p-2 rounded-xl border text-center transition-all cursor-pointer font-black text-[10.5px] ${
                          config.speakingWaveformStyle === st.id
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-sm'
                            : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Glow Color Selector */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-black text-slate-200">لون توهج المايك المتحدث:</label>
                    <span className="font-mono text-[10px] text-cyan-300">{config.speakingGlowColor}</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {QUICK_PALETTES.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => updateConfig({ speakingGlowColor: c, speakingRingColor: c })}
                        style={{ backgroundColor: c }}
                        className={`w-6 h-6 rounded-full border cursor-pointer transition-transform hover:scale-115 ${
                          config.speakingGlowColor === c ? 'ring-2 ring-white scale-110 border-white' : 'border-black/30'
                        }`}
                      />
                    ))}
                    <input
                      type="color"
                      value={config.speakingGlowColor}
                      onChange={(e) => updateConfig({ speakingGlowColor: e.target.value, speakingRingColor: e.target.value })}
                      className="w-7 h-7 rounded-full bg-transparent border-0 cursor-pointer p-0"
                    />
                  </div>
                </div>

                {/* Glow Intensity Slider */}
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200">كثافة وحجم إشعاع التوهج (Glow Radius):</span>
                    <span className="font-mono font-black text-cyan-400">{config.speakingGlowIntensity} px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="1"
                    value={config.speakingGlowIntensity}
                    onChange={(e) => updateConfig({ speakingGlowIntensity: Number(e.target.value) })}
                    className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
                  />
                </div>

                {/* Pulse Speed & Ring Width Sliders */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold">سماكة الحلقة:</span>
                      <span className="font-mono text-cyan-400">{config.speakingRingWidth} px</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="6"
                      step="0.5"
                      value={config.speakingRingWidth}
                      onChange={(e) => updateConfig({ speakingRingWidth: Number(e.target.value) })}
                      className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
                    />
                  </div>

                  <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold">حجم التمدد (Scale):</span>
                      <span className="font-mono text-cyan-400">{config.speakingScaleMultiplier}x</span>
                    </div>
                    <input
                      type="range"
                      min="1.05"
                      max="1.35"
                      step="0.01"
                      value={config.speakingScaleMultiplier}
                      onChange={(e) => updateConfig({ speakingScaleMultiplier: Number(e.target.value) })}
                      className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 2. SEATS & CHAIRS CUSTOMIZATION TAB */}
            {activeTab === 'seats' && (
              <div className="space-y-3.5">
                {/* Seat Shapes Selector */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-cyan-200">شكل وهندسة المقاعد (Seat Geometry):</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { id: 'circle', label: 'دائري ⭕' },
                      { id: 'squircle', label: 'سكويركل 🔲' },
                      { id: 'rounded_rect', label: 'مستطيل ناعم ⏹️' },
                      { id: 'hexagon', label: 'مسدس 🛑' }
                    ].map((sh) => (
                      <button
                        key={sh.id}
                        type="button"
                        onClick={() => updateConfig({ seatShape: sh.id as SeatShapeType })}
                        className={`p-2 rounded-xl border text-center transition-all cursor-pointer font-bold text-[10.5px] ${
                          config.seatShape === sh.id
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-sm'
                            : 'bg-white/5 border-white/10 text-slate-300'
                        }`}
                      >
                        {sh.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Empty Seat Opacity & Colors */}
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200">شفافية المقاعد الفارغة (Opacity):</span>
                    <span className="font-mono font-black text-cyan-400">{config.emptySeatOpacity}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={config.emptySeatOpacity}
                    onChange={(e) => updateConfig({ emptySeatOpacity: Number(e.target.value) })}
                    className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
                  />

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">لون خلفية المقعد الفارغ:</label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="color"
                          value={config.emptySeatBgColor}
                          onChange={(e) => updateConfig({ emptySeatBgColor: e.target.value })}
                          className="w-7 h-7 rounded-lg bg-transparent border border-white/20 cursor-pointer"
                        />
                        <span className="font-mono text-[10px] text-slate-300">{config.emptySeatBgColor}</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">لون إطار المقعد الفارغ (+):</label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="color"
                          value={config.emptySeatBorderColor}
                          onChange={(e) => updateConfig({ emptySeatBorderColor: e.target.value, emptySeatPlusColor: e.target.value })}
                          className="w-7 h-7 rounded-lg bg-transparent border border-white/20 cursor-pointer"
                        />
                        <span className="font-mono text-[10px] text-slate-300">{config.emptySeatBorderColor}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Locked Seat Styling */}
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-300 flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" />
                      <span>تخصيص المايكات المقفلة 🔒:</span>
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">Locked Mics</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">لون خلفية القفل:</label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="color"
                          value={config.lockedSeatBgColor}
                          onChange={(e) => updateConfig({ lockedSeatBgColor: e.target.value })}
                          className="w-7 h-7 rounded-lg bg-transparent border border-white/20 cursor-pointer"
                        />
                        <span className="font-mono text-[10px]">{config.lockedSeatBgColor}</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">أيقونة وإطار القفل:</label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="color"
                          value={config.lockedSeatLockColor}
                          onChange={(e) => updateConfig({ lockedSeatLockColor: e.target.value, lockedSeatBorderColor: e.target.value })}
                          className="w-7 h-7 rounded-lg bg-transparent border border-white/20 cursor-pointer"
                        />
                        <span className="font-mono text-[10px]">{config.lockedSeatLockColor}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Custom Chair Background Integration */}
                <div className="p-3 rounded-2xl bg-[#070c18] border border-cyan-500/30 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyan-300 flex items-center gap-1 text-xs">
                      <Layers className="w-4 h-4" />
                      <span>دمج صورة وإطار الكرسي للمقاعد:</span>
                    </span>
                    {config.customChairFrameUrl && (
                      <button
                        type="button"
                        onClick={() => updateConfig({ customChairFrameUrl: '' })}
                        className="text-[10px] text-rose-400 hover:underline cursor-pointer"
                      >
                        إلغاء الإطار ✕
                      </button>
                    )}
                  </div>

                  {/* Preset Chair Graphics */}
                  <div className="grid grid-cols-3 gap-1.5">
                    {PRESET_CHAIR_GRAPHICS.map((g) => (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => updateConfig({ customChairFrameUrl: g.url })}
                        className={`p-1.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                          config.customChairFrameUrl === g.url
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        {g.url ? (
                          <img src={g.url} alt={g.name} className="w-8 h-8 rounded-full object-cover border border-white/20" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs">∅</div>
                        )}
                        <span className="text-[9px] font-black truncate max-w-[80px]">{g.name}</span>
                      </button>
                    ))}
                  </div>

                  {/* Upload from device */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleCustomChairUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-slate-950 font-black rounded-xl text-xs hover:brightness-110 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>رفع صورة كرسي مخصص من الجهاز</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 3. TOP BAR & ROOM HEADER TAB */}
            {activeTab === 'top_bar' && (
              <div className="space-y-3.5">
                {/* Top Bar Background & Opacity */}
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200">شفافية كبسولة الشريط العلوي:</span>
                    <span className="font-mono font-black text-cyan-400">{config.topBarOpacity}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={config.topBarOpacity}
                    onChange={(e) => updateConfig({ topBarOpacity: Number(e.target.value) })}
                    className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
                  />

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">لون كبسولة الشريط العلوي:</label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="color"
                          value={config.topBarBgColor}
                          onChange={(e) => updateConfig({ topBarBgColor: e.target.value })}
                          className="w-7 h-7 rounded-lg bg-transparent border border-white/20 cursor-pointer"
                        />
                        <span className="font-mono text-[10px]">{config.topBarBgColor}</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">لون إطار الشريط العلوي:</label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="color"
                          value={config.topBarBorderColor.startsWith('#') ? config.topBarBorderColor : '#38bdf8'}
                          onChange={(e) => updateConfig({ topBarBorderColor: e.target.value })}
                          className="w-7 h-7 rounded-lg bg-transparent border border-white/20 cursor-pointer"
                        />
                        <span className="font-mono text-[10px] text-slate-300">Border Color</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Room Title Text Color */}
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200">لون عنوان واسم الغرفة:</span>
                    <span className="font-mono text-cyan-400 text-[10px]">{config.roomTitleColor}</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {['#ffffff', '#fde047', '#38bdf8', '#4ade80', '#f472b6', '#c084fc'].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => updateConfig({ roomTitleColor: c })}
                        style={{ backgroundColor: c }}
                        className={`w-6 h-6 rounded-full border cursor-pointer ${
                          config.roomTitleColor === c ? 'ring-2 ring-cyan-400 border-white' : 'border-transparent'
                        }`}
                      />
                    ))}
                    <input
                      type="color"
                      value={config.roomTitleColor}
                      onChange={(e) => updateConfig({ roomTitleColor: e.target.value })}
                      className="w-7 h-7 rounded-full bg-transparent border-0 cursor-pointer p-0"
                    />
                  </div>
                </div>

                {/* Audience Pill & Action Buttons */}
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <span className="font-bold text-xs text-slate-200">أزرار المستمعين وقائمة الخيارات:</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">خلفية عداد الحضور:</label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="color"
                          value={config.topAudiencePillBg}
                          onChange={(e) => updateConfig({ topAudiencePillBg: e.target.value })}
                          className="w-7 h-7 rounded-lg bg-transparent border border-white/20 cursor-pointer"
                        />
                        <span className="font-mono text-[10px]">{config.topAudiencePillBg}</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">خلفية زر الخيارات (···):</label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="color"
                          value={config.topMoreBtnBg}
                          onChange={(e) => updateConfig({ topMoreBtnBg: e.target.value, topPowerBtnBg: e.target.value })}
                          className="w-7 h-7 rounded-lg bg-transparent border border-white/20 cursor-pointer"
                        />
                        <span className="font-mono text-[10px]">{config.topMoreBtnBg}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. BOTTOM BAR & CONTROLS TAB */}
            {activeTab === 'bottom_bar' && (
              <div className="space-y-3.5">
                {/* Bottom Bar Opacity & Background */}
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200">شفافية الشريط السفلي:</span>
                    <span className="font-mono font-black text-cyan-400">{config.bottomBarOpacity}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={config.bottomBarOpacity}
                    onChange={(e) => updateConfig({ bottomBarOpacity: Number(e.target.value) })}
                    className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
                  />

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">خلفية الشريط السفلي:</label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="color"
                          value={config.bottomBarBgColor}
                          onChange={(e) => updateConfig({ bottomBarBgColor: e.target.value })}
                          className="w-7 h-7 rounded-lg bg-transparent border border-white/20 cursor-pointer"
                        />
                        <span className="font-mono text-[10px]">{config.bottomBarBgColor}</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">أزرار التحكم الدائرية:</label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="color"
                          value={config.bottomButtonsBg}
                          onChange={(e) => updateConfig({ bottomButtonsBg: e.target.value })}
                          className="w-7 h-7 rounded-lg bg-transparent border border-white/20 cursor-pointer"
                        />
                        <span className="font-mono text-[10px]">{config.bottomButtonsBg}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Gift Button Glow Color */}
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200">توهج زر الهدية المركزي 🎁:</span>
                    <span className="font-mono font-black text-pink-400">{config.bottomGiftGlowIntensity} px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="45"
                    step="1"
                    value={config.bottomGiftGlowIntensity}
                    onChange={(e) => updateConfig({ bottomGiftGlowIntensity: Number(e.target.value) })}
                    className="w-full accent-pink-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
                  />
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    {['#ec4899', '#f59e0b', '#06b6d4', '#8b5cf6', '#10b981', '#ef4444'].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => updateConfig({ bottomGiftGlowColor: c })}
                        style={{ backgroundColor: c }}
                        className={`w-6 h-6 rounded-full border cursor-pointer ${
                          config.bottomGiftGlowColor === c ? 'ring-2 ring-white border-white' : 'border-transparent'
                        }`}
                      />
                    ))}
                    <input
                      type="color"
                      value={config.bottomGiftGlowColor}
                      onChange={(e) => updateConfig({ bottomGiftGlowColor: e.target.value })}
                      className="w-7 h-7 rounded-full bg-transparent border-0 cursor-pointer p-0"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 5. BACKDROP LIGHTING & MIC SHADING TAB */}
            {activeTab === 'backdrop' && (
              <div className="space-y-3.5">
                {/* MASTER BUTTON: Remove Shading & Restore Natural Background Color 100% */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-[#0a1818] to-slate-900 border-2 border-emerald-500/50 shadow-xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-emerald-300 text-xs flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span>التحكم السريع: الألوان الطبيعية الأصلية للخلفية</span>
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      config.roomOverlayDarkness === 0 && config.activeWallpaperDimming === 0
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                        : 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                    }`}>
                      {config.roomOverlayDarkness === 0 && config.activeWallpaperDimming === 0
                        ? 'طبيعية 100% (بدون تظليل)'
                        : `تظليل مفعّل (${config.roomOverlayDarkness}%)`}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      updateConfig({
                        roomOverlayDarkness: 0,
                        roomBackdropBlur: 0,
                        activeWallpaperDimming: 0,
                        activeWallpaperBrightness: 100,
                        activeWallpaperOpacity: 100,
                        activeWallpaperContrast: 100,
                        roomAmbientGlowIntensity: 0
                      });
                      showToast('تم إلغاء التظليل تماماً وعرض الخلفية بلونها الطبيعي الأصلي 100% 🌿');
                    }}
                    className="w-full py-2.5 px-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:brightness-110 active:scale-98 text-slate-950 font-black text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all border border-emerald-300"
                  >
                    <RotateCcw className="w-4 h-4 stroke-[2.5]" />
                    <span>إلغاء التظليل وجعل الخلفية بلونها الطبيعي 100%</span>
                  </button>
                  <p className="text-[10px] text-emerald-200/80 leading-relaxed text-center">
                    بنقرة واحدة: يتم إزالة أي حجب أو سواد لتظهر الخلفية بكامل ألوانها وجودتها الحقيقية.
                  </p>
                </div>

                {/* 1. Quick Shading Levels Buttons & Mic Area Darkening (أزرار تظليل وتعتيم الخلفية) */}
                <div className="p-3 rounded-2xl bg-[#090d16] border border-cyan-500/30 space-y-3 shadow-md">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                      <Moon className="w-4 h-4 text-cyan-400" />
                      <span>أزرار درجات التظليل السريعة (Shading Buttons):</span>
                    </span>
                    <span className="font-mono font-black text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded-lg border border-cyan-500/30">
                      {config.roomOverlayDarkness}%
                    </span>
                  </div>
                  
                  {/* Dedicated Direct Shading Buttons */}
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { label: 'طبيعي خالص (0%)', val: 0, desc: 'بدون تظليل' },
                      { label: 'تظليل خفيف (15%)', val: 15, desc: 'لمسة ناعمة' },
                      { label: 'تظليل هادئ (30%)', val: 30, desc: 'وضوح خفيف' },
                      { label: 'تظليل متوازن (45%)', val: 45, desc: 'متوسط' },
                      { label: 'تظليل داكن (65%)', val: 65, desc: 'إبراز المايكات' },
                      { label: 'تعتيم عالي (85%)', val: 85, desc: 'سينمائي' }
                    ].map((btn) => (
                      <button
                        key={btn.val}
                        type="button"
                        onClick={() => {
                          updateConfig({ roomOverlayDarkness: btn.val });
                          showToast(`تم ضبط التظليل: ${btn.label} 🎨`);
                        }}
                        className={`py-2 px-1 text-center rounded-xl border transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                          config.roomOverlayDarkness === btn.val
                            ? 'bg-gradient-to-b from-cyan-400 to-blue-600 text-slate-950 font-black border-cyan-300 shadow-md scale-102'
                            : 'bg-slate-900/90 text-slate-300 border-white/10 hover:bg-slate-800 hover:border-cyan-500/40'
                        }`}
                      >
                        <span className="text-[10px] font-extrabold">{btn.label}</span>
                        <span className="text-[8px] opacity-75">{btn.desc}</span>
                      </button>
                    ))}
                  </div>

                  {/* Manual Shading Slider */}
                  <div className="pt-2 border-t border-white/5 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-300">شريط التظليل اليدوي الدقيق:</span>
                      <span className="font-mono text-cyan-300">{config.roomOverlayDarkness}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={config.roomOverlayDarkness}
                      onChange={(e) => updateConfig({ roomOverlayDarkness: Number(e.target.value) })}
                      className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
                    />
                  </div>

                  {/* Backdrop Blur Slider */}
                  <div className="pt-2 border-t border-white/5 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-300 font-medium">ضبابية وتنعيم خلفية المايكات (Backdrop Blur):</span>
                      <span className="font-mono font-bold text-cyan-300">{config.roomBackdropBlur} px</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {[
                        { label: '0px (حادة)', val: 0 },
                        { label: '4px (خفيف)', val: 4 },
                        { label: '8px (متوسط)', val: 8 },
                        { label: '16px (ضبابي)', val: 16 }
                      ].map((bBtn) => (
                        <button
                          key={bBtn.val}
                          type="button"
                          onClick={() => updateConfig({ roomBackdropBlur: bBtn.val })}
                          className={`flex-1 py-1 text-[9px] font-bold rounded-lg border transition-all cursor-pointer ${
                            config.roomBackdropBlur === bBtn.val
                              ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                              : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                          }`}
                        >
                          {bBtn.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2. Active Room Wallpaper Lighting & Dimming (إضاءة وتعتيم خلفية صاحب الروم) */}
                <div className="p-3 rounded-2xl bg-[#090d16] border border-amber-500/30 space-y-3 shadow-md">
                  <div className="flex items-center justify-between text-xs pb-1 border-b border-amber-500/20">
                    <span className="font-bold text-amber-300 flex items-center gap-1.5">
                      <Sun className="w-4 h-4 text-amber-400" />
                      <span>التحكم بسطوع وإضاءة وتعتيم خلفية الروم:</span>
                    </span>
                    <span className="text-[9px] bg-amber-950/60 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30 font-medium">
                      الخلفية النشطة
                    </span>
                  </div>

                  {/* Wallpaper Brightness Buttons & Slider */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-200">سطوع وإضاءة الخلفية (Brightness):</span>
                      <span className="font-mono font-black text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-lg border border-amber-500/30">
                        {config.activeWallpaperBrightness}%
                      </span>
                    </div>
                    <div className="flex items-center gap-1 pb-1">
                      {[
                        { label: 'خافت 50%', val: 50 },
                        { label: 'طبيعي 100%', val: 100 },
                        { label: 'مشرق 130%', val: 130 },
                        { label: 'ساطع 160%', val: 160 },
                        { label: 'فائق 200%', val: 200 }
                      ].map((btn) => (
                        <button
                          key={btn.val}
                          type="button"
                          onClick={() => updateConfig({ activeWallpaperBrightness: btn.val })}
                          className={`flex-1 py-1 text-[9px] font-bold rounded-lg border transition-all cursor-pointer ${
                            config.activeWallpaperBrightness === btn.val
                              ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-sm'
                              : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                          }`}
                        >
                          {btn.label}
                        </button>
                      ))}
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="200"
                      step="5"
                      value={config.activeWallpaperBrightness}
                      onChange={(e) => updateConfig({ activeWallpaperBrightness: Number(e.target.value) })}
                      className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
                    />
                  </div>

                  {/* Wallpaper Dimming Slider */}
                  <div className="space-y-1.5 pt-2 border-t border-white/5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-200">تعتيم وتظليل الخلفية الإضافي (Dimming):</span>
                      <span className="font-mono font-black text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded-lg border border-purple-500/30">
                        {config.activeWallpaperDimming}%
                      </span>
                    </div>
                    <div className="flex items-center gap-1 pb-1">
                      {[
                        { label: '0% (طبيعي)', val: 0 },
                        { label: '20% (خفيف)', val: 20 },
                        { label: '45% (متوسط)', val: 45 },
                        { label: '70% (داكن)', val: 70 }
                      ].map((dBtn) => (
                        <button
                          key={dBtn.val}
                          type="button"
                          onClick={() => updateConfig({ activeWallpaperDimming: dBtn.val })}
                          className={`flex-1 py-1 text-[9px] font-bold rounded-lg border transition-all cursor-pointer ${
                            config.activeWallpaperDimming === dBtn.val
                              ? 'bg-purple-500 text-white border-purple-300 shadow-sm'
                              : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                          }`}
                        >
                          {dBtn.label}
                        </button>
                      ))}
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={config.activeWallpaperDimming}
                      onChange={(e) => updateConfig({ activeWallpaperDimming: Number(e.target.value) })}
                      className="w-full accent-purple-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
                    />
                  </div>

                  {/* Wallpaper Opacity / Visibility Slider */}
                  <div className="space-y-1.5 pt-2 border-t border-white/5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-200">إظهار وشفافية الخلفية (Visibility & Opacity):</span>
                      <span className="font-mono font-black text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-500/30">
                        {config.activeWallpaperOpacity}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={config.activeWallpaperOpacity}
                      onChange={(e) => updateConfig({ activeWallpaperOpacity: Number(e.target.value) })}
                      className="w-full accent-emerald-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
                    />
                  </div>

                  {/* Wallpaper Contrast Slider */}
                  <div className="space-y-1.5 pt-2 border-t border-white/5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-200 flex items-center gap-1">
                        <Contrast className="w-3.5 h-3.5 text-slate-400" />
                        <span>تباين الألوان (Contrast):</span>
                      </span>
                      <span className="font-mono font-bold text-slate-300">{config.activeWallpaperContrast}%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="150"
                      step="5"
                      value={config.activeWallpaperContrast}
                      onChange={(e) => updateConfig({ activeWallpaperContrast: Number(e.target.value) })}
                      className="w-full accent-slate-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                    />
                  </div>
                </div>

                {/* 3. Ambient Glow Lighting */}
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200">لون وشدة الإضاءة المحيطية العلوية:</span>
                    <span className="font-mono text-cyan-400">{config.roomAmbientGlowColor}</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {QUICK_PALETTES.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => updateConfig({ roomAmbientGlowColor: c })}
                        style={{ backgroundColor: c }}
                        className={`w-6 h-6 rounded-full border cursor-pointer ${
                          config.roomAmbientGlowColor === c ? 'ring-2 ring-white border-white' : 'border-transparent'
                        }`}
                      />
                    ))}
                    <input
                      type="color"
                      value={config.roomAmbientGlowColor}
                      onChange={(e) => updateConfig({ roomAmbientGlowColor: e.target.value })}
                      className="w-7 h-7 rounded-full bg-transparent border-0 cursor-pointer p-0"
                    />
                  </div>
                  <div className="pt-1.5">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-slate-400">شدة التوهج المحيطي:</span>
                      <span className="font-mono text-cyan-300">{config.roomAmbientGlowIntensity}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={config.roomAmbientGlowIntensity}
                      onChange={(e) => updateConfig({ roomAmbientGlowIntensity: Number(e.target.value) })}
                      className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 6. PRESETS TAB */}
            {activeTab === 'presets' && (
              <div className="space-y-2.5">
                <div className="text-[11px] font-bold text-cyan-200 mb-1">حزم ثيمات الروم المتكاملة (بنقرة واحدة):</div>
                <div className="grid grid-cols-1 gap-2">
                  {ROOM_PRESET_THEMES.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleApplyPreset(preset)}
                      className="p-3 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-cyan-500/30 hover:border-cyan-400 text-right flex items-center justify-between transition-all cursor-pointer group shadow-sm hover:scale-[1.01]"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-9 h-9 rounded-xl border border-white/20 flex items-center justify-center text-sm shadow-md"
                          style={{
                            backgroundColor: preset.speakingGlowColor,
                            boxShadow: `0 0 15px ${preset.speakingGlowColor}80`
                          }}
                        >
                          ✨
                        </div>
                        <div>
                          <div className="font-black text-xs text-white group-hover:text-cyan-300 transition-colors">
                            {preset.name}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {preset.speakingWaveformStyle} • {preset.seatShape}
                          </div>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 font-black text-[10px] border border-cyan-400/40">
                        تطبيق ⚡
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Footer with Status & Done */}
          <div className="border-t border-cyan-500/20 pt-2.5 flex items-center justify-between shrink-0">
            <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>
                {isSyncingFirestore
                  ? `جاري المزامنة مع قاعدة البيانات [${roomId}]... ⏳`
                  : `محفوظ في قاعدة البيانات السحابية لـ (room_id: ${roomId}) ☁️⚡`}
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-xs rounded-xl shadow-md hover:brightness-110 transition-all cursor-pointer"
            >
              تم وإغلاق
            </button>
          </div>

          {/* Toast */}
          {toastMessage && (
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-slate-950 border border-cyan-400 text-cyan-200 text-[11px] font-black px-4 py-1.5 rounded-full shadow-2xl z-50 animate-bounce">
              {toastMessage}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
