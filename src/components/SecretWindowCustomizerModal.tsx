import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Palette,
  Sparkles,
  Sliders,
  Sun,
  Droplets,
  Zap,
  RotateCcw,
  Check,
  Shapes,
  Maximize2,
  Eye,
  ShieldCheck,
  Flame,
  Crown,
  Heart,
  Layers,
  Wrench
} from 'lucide-react';
import {
  WindowThemeConfig,
  IconThemeStyle,
  IconShapeStyle,
  IconAnimationStyle
} from '../types/secretCustomizer';
import {
  WINDOW_REGISTRY,
  GLOBAL_THEME_PRESETS,
  getSecretWindowTheme,
  saveSecretWindowTheme,
  resetSecretWindowTheme,
  getComputedModalStyle,
  getComputedCardStyle
} from '../lib/secretCustomizerService';

interface SecretWindowCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  windowId: string;
  onThemeChanged?: (theme: WindowThemeConfig) => void;
}

export const SecretWindowCustomizerModal: React.FC<SecretWindowCustomizerModalProps> = ({
  isOpen,
  onClose,
  windowId,
  onThemeChanged
}) => {
  const [currentTab, setCurrentTab] = useState<'colors' | 'shapes' | 'preview'>('colors');
  const [theme, setTheme] = useState<WindowThemeConfig>(() => getSecretWindowTheme(windowId));
  const [savedNotice, setSavedNotice] = useState<boolean>(false);

  // Sync theme whenever windowId changes or modal opens
  useEffect(() => {
    if (isOpen && windowId) {
      const loaded = getSecretWindowTheme(windowId);
      setTheme(loaded);
    }
  }, [isOpen, windowId]);

  if (!isOpen) return null;

  const windowMeta = WINDOW_REGISTRY[windowId] || { name: 'نافذة مخصصة', icon: '⚙️' };

  const handleUpdateTheme = (updater: (prev: WindowThemeConfig) => WindowThemeConfig) => {
    const next = updater(theme);
    setTheme(next);
    saveSecretWindowTheme(windowId, next);
    onThemeChanged?.(next);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 1500);
  };

  const handleApplyPreset = (presetConfig: Partial<WindowThemeConfig>) => {
    handleUpdateTheme((prev) => ({
      ...prev,
      ...presetConfig
    }));
  };

  const handleReset = () => {
    const res = resetSecretWindowTheme(windowId);
    setTheme(res);
    onThemeChanged?.(res);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 1500);
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-auto select-none"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 100, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 100, opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg bg-[#0c101d] border-2 border-cyan-500/50 rounded-t-3xl sm:rounded-3xl text-white shadow-[0_0_50px_rgba(6,182,212,0.3)] h-[88vh] max-h-[90vh] flex flex-col justify-between overflow-hidden relative"
        >
          {/* Header */}
          <div className="p-4 pb-3 border-b border-white/10 shrink-0 bg-[#121829]/90 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-black shadow-lg">
                  <Wrench className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">{windowMeta.icon}</span>
                    <h2 className="text-sm font-black text-cyan-300">
                      تخصيص سري مستقل: {windowMeta.name}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <span className="bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-bold">
                      خاص بالمبرمج فقط
                    </span>
                    <span>معرف النافذة: <code className="text-cyan-400 font-mono">{windowId}</code></span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {savedNotice && (
                  <span className="text-[10px] text-emerald-400 font-black bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                    <Check className="w-3 h-3" />
                    حُفظ تلقائياً
                  </span>
                )}
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="grid grid-cols-3 gap-1 bg-[#1A2234] p-1 rounded-2xl border border-white/10 text-center mt-3">
              <button
                onClick={() => setCurrentTab('colors')}
                className={`py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  currentTab === 'colors'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md scale-[1.02]'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>الألوان والسطوع</span>
              </button>

              <button
                onClick={() => setCurrentTab('shapes')}
                className={`py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  currentTab === 'shapes'
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md scale-[1.02]'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Shapes className="w-3.5 h-3.5" />
                <span>الأشكال والأيقونات</span>
              </button>

              <button
                onClick={() => setCurrentTab('preview')}
                className={`py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  currentTab === 'preview'
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-md scale-[1.02]'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>معاينة حية</span>
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
            {/* TAB 1: COLORS, OPACITY & BRIGHTNESS */}
            {currentTab === 'colors' && (
              <div className="space-y-4">
                {/* 1-Click Themes Presets */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-slate-300 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>ثيمات جاهزة بنقرة واحدة:</span>
                    </span>
                    <span className="text-[10px] text-slate-400">تطبيق فوري</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {GLOBAL_THEME_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => handleApplyPreset(preset.config)}
                        className="p-2.5 rounded-2xl border border-white/10 bg-[#151c2e] hover:border-cyan-400/50 transition-all text-right flex flex-col gap-1.5 cursor-pointer group"
                      >
                        <div
                          className={`h-4 w-full rounded-lg bg-gradient-to-r ${preset.previewGradient} shadow-inner`}
                        />
                        <span className="text-[11px] font-black text-slate-200 group-hover:text-cyan-300 truncate">
                          {preset.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Precision Sliders (Brightness, Opacity, Glow) */}
                <div className="p-3.5 bg-[#141b2d] border border-cyan-500/20 rounded-2xl space-y-3.5">
                  <h3 className="text-xs font-black text-cyan-300 flex items-center gap-1.5 pb-1 border-b border-white/10">
                    <Sliders className="w-4 h-4" />
                    <span>أشرطة التحكم بالسطوع والشفافية والتوهج (Sliders)</span>
                  </h3>

                  {/* 1. Brightness Slider */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-bold flex items-center gap-1">
                        <Sun className="w-3.5 h-3.5 text-amber-400" />
                        <span>سطوع وإضاءة الألوان (Brightness):</span>
                      </span>
                      <span className="font-mono font-black text-amber-300 text-xs dir-ltr">
                        {theme.bgBrightness}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={50}
                      max={150}
                      step={2}
                      value={theme.bgBrightness}
                      onChange={(e) =>
                        handleUpdateTheme((prev) => ({
                          ...prev,
                          bgBrightness: Number(e.target.value)
                        }))
                      }
                      className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
                    />
                    <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                      <span>50% خافت</span>
                      <span>100% طبيعي</span>
                      <span>150% ساطع جداً</span>
                    </div>
                  </div>

                  {/* 2. Background Opacity Slider */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-bold flex items-center gap-1">
                        <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                        <span>شفافية خلفية النافذة (Opacity):</span>
                      </span>
                      <span className="font-mono font-black text-cyan-300 text-xs dir-ltr">
                        {theme.bgOpacity}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={100}
                      step={2}
                      value={theme.bgOpacity}
                      onChange={(e) =>
                        handleUpdateTheme((prev) => ({
                          ...prev,
                          bgOpacity: Number(e.target.value)
                        }))
                      }
                      className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
                    />
                    <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                      <span>10% زجاجي شفاف</span>
                      <span>75% شبه شفاف</span>
                      <span>100% معتم بالكامل</span>
                    </div>
                  </div>

                  {/* 3. Glow & Radiance Slider */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-bold flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-purple-400" />
                        <span>شدة التوهج والنيون (Glow Radius):</span>
                      </span>
                      <span className="font-mono font-black text-purple-300 text-xs dir-ltr">
                        {theme.glowIntensity}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={45}
                      step={1}
                      value={theme.glowIntensity}
                      onChange={(e) =>
                        handleUpdateTheme((prev) => ({
                          ...prev,
                          glowIntensity: Number(e.target.value)
                        }))
                      }
                      className="w-full accent-purple-500 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
                    />
                  </div>

                  {/* 4. Card Opacity Slider */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-bold flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-emerald-400" />
                        <span>شفافية البطاقات الداخلية (Card Opacity):</span>
                      </span>
                      <span className="font-mono font-black text-emerald-300 text-xs dir-ltr">
                        {theme.cardBgOpacity}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={100}
                      step={2}
                      value={theme.cardBgOpacity}
                      onChange={(e) =>
                        handleUpdateTheme((prev) => ({
                          ...prev,
                          cardBgOpacity: Number(e.target.value)
                        }))
                      }
                      className="w-full accent-emerald-400 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
                    />
                  </div>
                </div>

                {/* Color Pickers Matrix */}
                <div className="p-3.5 bg-[#141b2d] border border-white/10 rounded-2xl space-y-3">
                  <h3 className="text-xs font-black text-slate-200 flex items-center gap-1.5 pb-1 border-b border-white/10">
                    <Palette className="w-4 h-4 text-cyan-400" />
                    <span>تخصيص الألوان المباشرة (Hex Colors)</span>
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Background Color */}
                    <div className="flex items-center justify-between bg-[#1b233a] p-2 rounded-xl border border-white/5">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-slate-200">لون الخلفية</span>
                        <span className="text-[9px] text-slate-400 font-mono">{theme.bgColor}</span>
                      </div>
                      <input
                        type="color"
                        value={theme.bgColor}
                        onChange={(e) =>
                          handleUpdateTheme((prev) => ({
                            ...prev,
                            bgColor: e.target.value,
                            bgGradient: undefined
                          }))
                        }
                        className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                    </div>

                    {/* Border Color */}
                    <div className="flex items-center justify-between bg-[#1b233a] p-2 rounded-xl border border-white/5">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-slate-200">لون الإطار</span>
                        <span className="text-[9px] text-slate-400 font-mono">{theme.borderColor}</span>
                      </div>
                      <input
                        type="color"
                        value={theme.borderColor}
                        onChange={(e) =>
                          handleUpdateTheme((prev) => ({
                            ...prev,
                            borderColor: e.target.value
                          }))
                        }
                        className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                    </div>

                    {/* Title Color */}
                    <div className="flex items-center justify-between bg-[#1b233a] p-2 rounded-xl border border-white/5">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-slate-200">لون العنوان</span>
                        <span className="text-[9px] text-slate-400 font-mono">{theme.titleColor}</span>
                      </div>
                      <input
                        type="color"
                        value={theme.titleColor}
                        onChange={(e) =>
                          handleUpdateTheme((prev) => ({
                            ...prev,
                            titleColor: e.target.value
                          }))
                        }
                        className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                    </div>

                    {/* Text Color */}
                    <div className="flex items-center justify-between bg-[#1b233a] p-2 rounded-xl border border-white/5">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-slate-200">لون النصوص</span>
                        <span className="text-[9px] text-slate-400 font-mono">{theme.textColor}</span>
                      </div>
                      <input
                        type="color"
                        value={theme.textColor}
                        onChange={(e) =>
                          handleUpdateTheme((prev) => ({
                            ...prev,
                            textColor: e.target.value
                          }))
                        }
                        className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                    </div>

                    {/* Accent Color */}
                    <div className="flex items-center justify-between bg-[#1b233a] p-2 rounded-xl border border-white/5">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-slate-200">لون التمييز والأزرار</span>
                        <span className="text-[9px] text-slate-400 font-mono">{theme.accentColor}</span>
                      </div>
                      <input
                        type="color"
                        value={theme.accentColor}
                        onChange={(e) =>
                          handleUpdateTheme((prev) => ({
                            ...prev,
                            accentColor: e.target.value
                          }))
                        }
                        className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                    </div>

                    {/* Card Background Color */}
                    <div className="flex items-center justify-between bg-[#1b233a] p-2 rounded-xl border border-white/5">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-slate-200">لون خلفية البطاقات</span>
                        <span className="text-[9px] text-slate-400 font-mono">{theme.cardBgColor}</span>
                      </div>
                      <input
                        type="color"
                        value={theme.cardBgColor}
                        onChange={(e) =>
                          handleUpdateTheme((prev) => ({
                            ...prev,
                            cardBgColor: e.target.value
                          }))
                        }
                        className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: SHAPES & ICONS */}
            {currentTab === 'shapes' && (
              <div className="space-y-4">
                {/* Icon Theme Style */}
                <div className="p-3.5 bg-[#141b2d] border border-white/10 rounded-2xl space-y-2.5">
                  <h3 className="text-xs font-black text-slate-200 flex items-center gap-1.5 pb-1 border-b border-white/10">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>طابع وتأثير أيقونات النافذة:</span>
                  </h3>

                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'gold_luxury', label: '👑 ذهبي ملكي', color: '#fbbf24' },
                      { id: 'neon_cyan', label: '⚡ نيون سماوي', color: '#38bdf8' },
                      { id: 'ruby_flame', label: '🔥 ياقوت حارق', color: '#f43f5e' },
                      { id: 'emerald_nature', label: '💎 زمرد إمبراطوري', color: '#34d399' },
                      { id: 'violet_magic', label: '🔮 بنفسجي أسطوري', color: '#c084fc' },
                      { id: 'white_minimal', label: '⚪ أبيض بسيط نقي', color: '#ffffff' }
                    ].map((st) => (
                      <button
                        key={st.id}
                        onClick={() =>
                          handleUpdateTheme((prev) => ({
                            ...prev,
                            iconStyle: st.id as IconThemeStyle,
                            iconColor: st.color
                          }))
                        }
                        className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-right flex items-center justify-between cursor-pointer ${
                          theme.iconStyle === st.id
                            ? 'bg-purple-600/30 border-purple-400 text-white shadow-md'
                            : 'bg-[#1b233a] border-white/5 text-slate-300 hover:bg-[#222c48]'
                        }`}
                      >
                        <span>{st.label}</span>
                        <div
                          className="w-3.5 h-3.5 rounded-full border border-white/20"
                          style={{ backgroundColor: st.color }}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Icon Button Shape */}
                <div className="p-3.5 bg-[#141b2d] border border-white/10 rounded-2xl space-y-2.5">
                  <h3 className="text-xs font-black text-slate-200 flex items-center gap-1.5 pb-1 border-b border-white/10">
                    <Shapes className="w-4 h-4 text-cyan-400" />
                    <span>شكل أزرار وأيقونات العناصر:</span>
                  </h3>

                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'circle', label: 'دائري', shape: 'rounded-full' },
                      { id: 'squircle', label: 'منحني', shape: 'rounded-2xl' },
                      { id: 'rounded_xl', label: 'ناعم', shape: 'rounded-xl' },
                      { id: 'pill', label: 'كبسولة', shape: 'rounded-3xl' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() =>
                          handleUpdateTheme((prev) => ({
                            ...prev,
                            iconShape: item.id as IconShapeStyle
                          }))
                        }
                        className={`p-2 border text-center text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${item.shape} ${
                          theme.iconShape === item.id
                            ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-md font-black'
                            : 'bg-[#1b233a] border-white/10 text-slate-300 hover:bg-[#222c48]'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white/20 ${item.shape}`} />
                        <span className="text-[10px]">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Border Radius & Thickness Sliders */}
                <div className="p-3.5 bg-[#141b2d] border border-white/10 rounded-2xl space-y-3">
                  <h3 className="text-xs font-black text-slate-200 flex items-center gap-1.5 pb-1 border-b border-white/10">
                    <Maximize2 className="w-4 h-4 text-amber-400" />
                    <span>انحناء الزوايا وسماكة الإطار</span>
                  </h3>

                  {/* Radius Slider */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-bold">انحناء زوايا النافذة (Border Radius):</span>
                      <span className="font-mono font-black text-amber-300 text-xs dir-ltr">
                        {theme.borderRadius}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min={8}
                      max={40}
                      step={2}
                      value={theme.borderRadius}
                      onChange={(e) =>
                        handleUpdateTheme((prev) => ({
                          ...prev,
                          borderRadius: Number(e.target.value)
                        }))
                      }
                      className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
                    />
                  </div>

                  {/* Border Width Slider */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-bold">سماكة الإطار (Border Width):</span>
                      <span className="font-mono font-black text-cyan-300 text-xs dir-ltr">
                        {theme.borderWidth}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={6}
                      step={1}
                      value={theme.borderWidth}
                      onChange={(e) =>
                        handleUpdateTheme((prev) => ({
                          ...prev,
                          borderWidth: Number(e.target.value)
                        }))
                      }
                      className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: LIVE PREVIEW & AUTO-SAVE */}
            {currentTab === 'preview' && (
              <div className="space-y-4">
                <div className="text-xs text-slate-300 font-bold flex items-center justify-between">
                  <span>معاينة حية وتطبيق مباشر للنافذة:</span>
                  <span className="text-[10px] text-emerald-400 font-bold">● متزامن لحظياً</span>
                </div>

                {/* Simulated Preview Box */}
                <div
                  style={getComputedModalStyle(theme)}
                  className="p-4 space-y-3 transition-all relative overflow-hidden"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{windowMeta.icon}</span>
                      <h4
                        className="text-xs font-black"
                        style={{ color: theme.titleColor }}
                      >
                        {windowMeta.name}
                      </h4>
                    </div>
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                      style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: theme.textColor }}
                    >
                      ✕
                    </div>
                  </div>

                  {/* Sample Card */}
                  <div
                    style={getComputedCardStyle(theme)}
                    className="p-2.5 rounded-2xl border flex items-center justify-between text-xs transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-7 h-7 flex items-center justify-center font-black text-xs ${
                          theme.iconShape === 'circle'
                            ? 'rounded-full'
                            : theme.iconShape === 'squircle'
                            ? 'rounded-xl'
                            : theme.iconShape === 'pill'
                            ? 'rounded-2xl'
                            : 'rounded-lg'
                        }`}
                        style={{
                          backgroundColor: theme.accentColor,
                          color: '#020617'
                        }}
                      >
                        ★
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-xs" style={{ color: theme.textColor }}>
                          عنصر تجريبي متقدم
                        </span>
                        <span className="text-[9px]" style={{ color: theme.subtextColor }}>
                          مستوى السطوع: {theme.bgBrightness}% | الشفافية: {theme.bgOpacity}%
                        </span>
                      </div>
                    </div>
                    <span
                      className="font-mono font-black text-xs dir-ltr"
                      style={{ color: theme.accentColor }}
                    >
                      99,999 💎
                    </span>
                  </div>

                  {/* Sample Action Button */}
                  <button
                    style={{
                      backgroundColor: theme.accentColor,
                      color: '#020617'
                    }}
                    className="w-full py-2 font-black text-xs rounded-xl shadow-md cursor-pointer transition-transform active:scale-98"
                  >
                    زر إجراء تفاعلي
                  </button>
                </div>

                <div className="p-3 bg-cyan-950/30 border border-cyan-500/30 rounded-2xl text-[11px] text-cyan-200 space-y-1">
                  <p className="font-black flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                    <span>استقلالية تامة وحفظ لحظي</span>
                  </p>
                  <p className="text-slate-400 text-[10px]">
                    أي تعديل تقوم به هنا يُحفظ تلقائياً في ذاكرة المتصفح للنافذة الحالية فقط، ولا يؤثر على باقي نوافذ الروم.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-3 border-t border-white/10 shrink-0 bg-[#121829]/95 flex items-center justify-between gap-2">
            <button
              onClick={handleReset}
              className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>استعادة الافتراضي</span>
            </button>

            <button
              onClick={onClose}
              className="flex-1 py-2 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-slate-950 font-black text-xs hover:brightness-110 cursor-pointer shadow-md transition-all text-center flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>حفظ وإغلاق لوحة التخصيص</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
