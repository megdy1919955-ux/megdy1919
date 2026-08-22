import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Palette,
  X,
  Check,
  RotateCcw,
  Sparkles,
  Upload,
  Crown,
  Layers,
  Flame,
  ShieldCheck,
  Eye,
  Sliders
} from 'lucide-react';
import { LeaderboardThemeConfig, TopRankFrameConfig } from '../types/leaderboardTheme';
import { PRESET_THEMES, FRAME_PRESETS, saveLeaderboardTheme, resetLeaderboardTheme } from '../lib/leaderboardThemeService';

interface LeaderboardThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: LeaderboardThemeConfig;
  onThemeChange: (theme: LeaderboardThemeConfig) => void;
}

export const LeaderboardThemeModal: React.FC<LeaderboardThemeModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onThemeChange
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'colors' | 'frames'>('presets');
  const [localTheme, setLocalTheme] = useState<LeaderboardThemeConfig>(currentTheme);
  const [selectedRankForFrame, setSelectedRankForFrame] = useState<'rank1' | 'rank2' | 'rank3'>('rank1');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fileInputRef1 = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);
  const fileInputRef3 = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleApplyPreset = (preset: LeaderboardThemeConfig) => {
    const updated = { ...preset };
    setLocalTheme(updated);
    onThemeChange(updated);
    showToast(`تم تطبيق ثيم: ${preset.name}`);
  };

  const handleColorChange = (key: keyof LeaderboardThemeConfig, value: string) => {
    const updated = { ...localTheme, [key]: value, isPreset: false };
    setLocalTheme(updated);
    onThemeChange(updated);
  };

  const handleFramePresetSelect = (rankKey: 'rank1' | 'rank2' | 'rank3', presetId: string) => {
    const preset = FRAME_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    const frameConfig: TopRankFrameConfig = {
      type: 'preset',
      presetId: preset.id,
      glowColor: preset.glowColor,
      crownEmoji: preset.crownEmoji,
      borderGradient: preset.borderGradient,
      starBadgeEmoji: preset.starBadgeEmoji,
      badgeBg: preset.badgeBg,
      badgeTextColor: preset.badgeTextColor
    };

    const updatedKey = rankKey === 'rank1' ? 'rank1Frame' : rankKey === 'rank2' ? 'rank2Frame' : 'rank3Frame';
    const updated = {
      ...localTheme,
      [updatedKey]: frameConfig,
      isPreset: false
    };
    setLocalTheme(updated);
    onThemeChange(updated);
    showToast(`تم تغيير إطار المركز ${rankKey === 'rank1' ? 'الأول 👑' : rankKey === 'rank2' ? 'الثاني 🥈' : 'الثالث 🥉'}`);
  };

  const handleCustomFrameUpload = (
    rankKey: 'rank1' | 'rank2' | 'rank3',
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('⚠️ حجم الصورة يجب ألا يتجاوز 5 ميغابايت');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (!dataUrl) return;

      const currentFrame =
        rankKey === 'rank1' ? localTheme.rank1Frame : rankKey === 'rank2' ? localTheme.rank2Frame : localTheme.rank3Frame;

      const updatedFrame: TopRankFrameConfig = {
        ...currentFrame,
        type: 'custom_upload',
        customImageUrl: dataUrl
      };

      const updatedKey = rankKey === 'rank1' ? 'rank1Frame' : rankKey === 'rank2' ? 'rank2Frame' : 'rank3Frame';
      const updated = {
        ...localTheme,
        [updatedKey]: updatedFrame,
        isPreset: false
      };
      setLocalTheme(updated);
      onThemeChange(updated);
      showToast(`تم رفع وتطبيق إطار مخصص للمركز ${rankKey === 'rank1' ? 'الأول' : rankKey === 'rank2' ? 'الثاني' : 'الثالث'} بنجاح! 🖼️`);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveAndClose = () => {
    saveLeaderboardTheme(localTheme);
    showToast('💾 تم حفظ وتثبيت إعدادات الثيم في الغرفة!');
    setTimeout(() => {
      onClose();
    }, 400);
  };

  const handleReset = () => {
    const def = resetLeaderboardTheme();
    setLocalTheme(def);
    onThemeChange(def);
    showToast('🔄 تم استعادة الثيم الافتراضي بنجاح');
  };

  const getRankFrameInfo = (rankKey: 'rank1' | 'rank2' | 'rank3') => {
    return rankKey === 'rank1' ? localTheme.rank1Frame : rankKey === 'rank2' ? localTheme.rank2Frame : localTheme.rank3Frame;
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 pointer-events-auto cursor-default select-none animate-fadeIn"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-[#0F172A] border-2 border-cyan-500/70 rounded-3xl p-4 sm:p-5 text-white shadow-[0_0_50px_rgba(6,182,212,0.3)] max-h-[90vh] flex flex-col justify-between overflow-hidden"
      >
        {/* Header */}
        <div className="space-y-3 shrink-0 pb-3 border-b border-cyan-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-md text-slate-950">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-black text-cyan-300">محرر ثيمات لوحة المتصدرين</h2>
                  <span className="text-[10px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 px-2 py-0.5 rounded-full">
                    خاص بالمبرمج 💻
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">تخصيص كامل للألوان، الإطارات والخلفيات لنافذة إحصائيات الروم</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="grid grid-cols-3 gap-1.5 bg-[#1E293B] p-1 rounded-2xl border border-white/10 text-center">
            <button
              onClick={() => setActiveTab('presets')}
              className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'presets'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>الثيمات الجاهزة</span>
            </button>

            <button
              onClick={() => setActiveTab('colors')}
              className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'colors'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>تخصيص الألوان</span>
            </button>

            <button
              onClick={() => setActiveTab('frames')}
              className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'frames'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>إطارات المراكز 1-3</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto no-scrollbar py-3 space-y-4 pr-0.5">
          {/* TAB 1: PRESETS */}
          {activeTab === 'presets' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-300 px-1 font-bold">
                <span>اختر قالباً فاخراً معداً مسبقاً:</span>
                <span className="text-cyan-400 text-[11px]">{PRESET_THEMES.length} ثيمات متوفرة</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {PRESET_THEMES.map((preset) => {
                  const isSelected = localTheme.id === preset.id;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => handleApplyPreset(preset)}
                      className={`p-3 rounded-2xl border-2 transition-all cursor-pointer text-right relative overflow-hidden flex flex-col justify-between ${
                        isSelected
                          ? 'border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)] scale-[1.02]'
                          : 'border-white/10 hover:border-cyan-500/40 bg-[#1E293B]'
                      }`}
                      style={{
                        background: preset.modalBgCustomCss || preset.modalBg
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className="font-black text-xs"
                          style={{ color: preset.headerTitleColor }}
                        >
                          {preset.name}
                        </span>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>

                      {/* Mini Live Preview inside card */}
                      <div className="space-y-1.5 p-2 rounded-xl bg-black/40 border border-white/10">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-slate-300 font-bold">1. الأمير أسامة 👑</span>
                          <span
                            className="font-mono font-black"
                            style={{ color: preset.cardStatsNumberColor }}
                          >
                            18.5M 💎
                          </span>
                        </div>
                        <div
                          className="h-1.5 rounded-full w-full"
                          style={{
                            background: preset.diamondsTabGradient
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: DETAILED COLOR PICKERS */}
          {activeTab === 'colors' && (
            <div className="space-y-3.5 text-xs">
              <div className="bg-[#1E293B] p-3 rounded-2xl border border-white/10 space-y-3">
                <h3 className="font-black text-cyan-300 flex items-center gap-1.5">
                  <Layers className="w-4 h-4" />
                  <span>ألوان الخلفية والإطار الخارجي</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-300 font-medium block">لون إطار النافذة المضيء:</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={localTheme.modalBorderColor}
                        onChange={(e) => handleColorChange('modalBorderColor', e.target.value)}
                        className="w-8 h-8 rounded-lg border border-white/20 cursor-pointer bg-transparent"
                      />
                      <input
                        type="text"
                        value={localTheme.modalBorderColor}
                        onChange={(e) => handleColorChange('modalBorderColor', e.target.value)}
                        className="flex-1 bg-slate-900 border border-white/10 rounded-lg px-2 py-1 text-slate-200 font-mono text-[11px]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-300 font-medium block">لون عنوان النافذة (العريض):</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={localTheme.headerTitleColor}
                        onChange={(e) => handleColorChange('headerTitleColor', e.target.value)}
                        className="w-8 h-8 rounded-lg border border-white/20 cursor-pointer bg-transparent"
                      />
                      <input
                        type="text"
                        value={localTheme.headerTitleColor}
                        onChange={(e) => handleColorChange('headerTitleColor', e.target.value)}
                        className="flex-1 bg-slate-900 border border-white/10 rounded-lg px-2 py-1 text-slate-200 font-mono text-[11px]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistics & Values Customizer */}
              <div className="bg-[#1E293B] p-3 rounded-2xl border border-white/10 space-y-3">
                <h3 className="font-black text-amber-300 flex items-center gap-1.5">
                  <Flame className="w-4 h-4" />
                  <span>أرقام وإحصائيات الداعمين والبطاقات</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-300 font-medium block">لون خط الأرقام والإحصائيات:</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={localTheme.cardStatsNumberColor}
                        onChange={(e) => handleColorChange('cardStatsNumberColor', e.target.value)}
                        className="w-8 h-8 rounded-lg border border-white/20 cursor-pointer bg-transparent"
                      />
                      <input
                        type="text"
                        value={localTheme.cardStatsNumberColor}
                        onChange={(e) => handleColorChange('cardStatsNumberColor', e.target.value)}
                        className="flex-1 bg-slate-900 border border-white/10 rounded-lg px-2 py-1 text-slate-200 font-mono text-[11px]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-300 font-medium block">لون أسماء الأعضاء المتصدرين:</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={localTheme.cardNameColor}
                        onChange={(e) => handleColorChange('cardNameColor', e.target.value)}
                        className="w-8 h-8 rounded-lg border border-white/20 cursor-pointer bg-transparent"
                      />
                      <input
                        type="text"
                        value={localTheme.cardNameColor}
                        onChange={(e) => handleColorChange('cardNameColor', e.target.value)}
                        className="flex-1 bg-slate-900 border border-white/10 rounded-lg px-2 py-1 text-slate-200 font-mono text-[11px]"
                      />
                    </div>
                  </div>
                </div>

                {/* Card Background Color */}
                <div className="space-y-1 pt-1">
                  <label className="text-[11px] text-slate-300 font-medium block">خلفية كروت المتصدرين:</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={localTheme.cardBg}
                      onChange={(e) => handleColorChange('cardBg', e.target.value)}
                      className="w-8 h-8 rounded-lg border border-white/20 cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={localTheme.cardBg}
                      onChange={(e) => handleColorChange('cardBg', e.target.value)}
                      className="flex-1 bg-slate-900 border border-white/10 rounded-lg px-2 py-1 text-slate-200 font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons & Tabs Theme */}
              <div className="bg-[#1E293B] p-3 rounded-2xl border border-white/10 space-y-2">
                <h3 className="font-black text-pink-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>تدرجات أزرار المساهمات والنادي والجاذبية</span>
                </h3>

                <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                  <div className="p-2 rounded-xl bg-slate-900/80 border border-cyan-500/30">
                    <span className="font-bold text-cyan-300 block mb-1">💎 المساهمات</span>
                    <div
                      className="h-4 rounded-lg w-full"
                      style={{ background: localTheme.diamondsTabGradient }}
                    />
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900/80 border border-purple-500/30">
                    <span className="font-bold text-purple-300 block mb-1">🛡️ النادي</span>
                    <div
                      className="h-4 rounded-lg w-full"
                      style={{ background: localTheme.clubTabGradient }}
                    />
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900/80 border border-pink-500/30">
                    <span className="font-bold text-pink-300 block mb-1">✨ الجاذبية</span>
                    <div
                      className="h-4 rounded-lg w-full"
                      style={{ background: localTheme.charmTabGradient }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FRAMES (TOP 1, 2, 3 & UPLOAD FROM PHONE) */}
          {activeTab === 'frames' && (
            <div className="space-y-4 text-xs">
              {/* Rank Selector */}
              <div className="flex items-center justify-center gap-2 bg-[#1E293B] p-1.5 rounded-2xl border border-white/10">
                <button
                  onClick={() => setSelectedRankForFrame('rank1')}
                  className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer flex items-center gap-1 ${
                    selectedRankForFrame === 'rank1'
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-300 text-slate-950 shadow-md ring-2 ring-amber-300'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <span>👑 المركز الأول</span>
                </button>

                <button
                  onClick={() => setSelectedRankForFrame('rank2')}
                  className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer flex items-center gap-1 ${
                    selectedRankForFrame === 'rank2'
                      ? 'bg-gradient-to-r from-slate-200 to-slate-400 text-slate-950 shadow-md ring-2 ring-white'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <span>💎 المركز الثاني</span>
                </button>

                <button
                  onClick={() => setSelectedRankForFrame('rank3')}
                  className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer flex items-center gap-1 ${
                    selectedRankForFrame === 'rank3'
                      ? 'bg-gradient-to-r from-amber-700 to-amber-500 text-white shadow-md ring-2 ring-amber-600'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <span>🥉 المركز الثالث</span>
                </button>
              </div>

              {/* Current Frame Live Preview */}
              {(() => {
                const currentFrame = getRankFrameInfo(selectedRankForFrame);
                return (
                  <div className="bg-[#1E293B] p-3.5 rounded-2xl border border-cyan-500/30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0 flex items-center justify-center mr-2">
                        {currentFrame.type === 'custom_upload' && currentFrame.customImageUrl ? (
                          <div className="relative w-12 h-12 flex items-center justify-center">
                            <img
                              src={currentFrame.customImageUrl}
                              alt="Custom Frame"
                              className="absolute inset-0 w-full h-full object-contain pointer-events-none z-20 scale-125"
                            />
                            <img
                              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
                              alt="Avatar"
                              className="w-9 h-9 rounded-full object-cover relative z-10"
                            />
                          </div>
                        ) : (
                          <>
                            <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-sm z-30 filter drop-shadow">
                              {currentFrame.crownEmoji || '👑'}
                            </span>
                            <div
                              className={`p-[2.5px] rounded-full bg-gradient-to-tr ${currentFrame.borderGradient || 'from-amber-600 via-yellow-300 to-amber-500'}`}
                              style={{
                                boxShadow: `0 0 16px ${currentFrame.glowColor || 'rgba(251,191,36,0.85)'}`
                              }}
                            >
                              <div className="p-[1px] bg-[#121827] rounded-full">
                                <img
                                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
                                  alt="Avatar"
                                  className="w-9 h-9 rounded-full object-cover"
                                />
                              </div>
                            </div>
                            <span className="absolute -bottom-1 -right-0.5 text-[8px] bg-amber-400 text-slate-950 rounded-full px-1 font-black shadow-md z-30">
                              {currentFrame.starBadgeEmoji || '★'}
                            </span>
                          </>
                        )}
                      </div>

                      <div>
                        <span className="font-black text-slate-100 text-xs block">
                          معاينة إطار المركز {selectedRankForFrame === 'rank1' ? 'الأول' : selectedRankForFrame === 'rank2' ? 'الثاني' : 'الثالث'}
                        </span>
                        <span className="text-[11px] text-cyan-300 font-bold">
                          {currentFrame.type === 'custom_upload' ? 'إطار مخصص مرفوع من الهاتف 📱' : 'إطار قالب فاخر جاهز'}
                        </span>
                      </div>
                    </div>

                    {/* Upload from Phone Button */}
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        ref={
                          selectedRankForFrame === 'rank1'
                            ? fileInputRef1
                            : selectedRankForFrame === 'rank2'
                            ? fileInputRef2
                            : fileInputRef3
                        }
                        className="hidden"
                        onChange={(e) => handleCustomFrameUpload(selectedRankForFrame, e)}
                      />
                      <button
                        onClick={() => {
                          if (selectedRankForFrame === 'rank1') fileInputRef1.current?.click();
                          else if (selectedRankForFrame === 'rank2') fileInputRef2.current?.click();
                          else fileInputRef3.current?.click();
                        }}
                        className="px-3 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-xs rounded-xl shadow-md hover:brightness-110 cursor-pointer transition-all flex items-center gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>رفع إطار من الهاتف</span>
                      </button>
                    </div>
                  </div>
                );
              })()}

              {/* Choose from Pre-configured Luxury Frames */}
              <div className="space-y-2">
                <span className="font-bold text-slate-300 text-xs block px-1">
                  أو اختر من تشكيلة الإطارات الملكية الجاهزة:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {FRAME_PRESETS.map((preset) => {
                    const currentFrame = getRankFrameInfo(selectedRankForFrame);
                    const isSelected = currentFrame.type === 'preset' && currentFrame.presetId === preset.id;
                    return (
                      <div
                        key={preset.id}
                        onClick={() => handleFramePresetSelect(selectedRankForFrame, preset.id)}
                        className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-2.5 ${
                          isSelected
                            ? 'bg-cyan-500/20 border-cyan-400 ring-1 ring-cyan-400 shadow-md'
                            : 'bg-[#1E293B] border-white/10 hover:border-cyan-500/30'
                        }`}
                      >
                        <div
                          className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-sm shadow-md bg-gradient-to-tr ${preset.borderGradient}`}
                        >
                          <span>{preset.crownEmoji}</span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <span className="font-bold text-[11px] text-slate-200 truncate block">
                            {preset.name}
                          </span>
                        </div>

                        {isSelected && (
                          <div className="w-4 h-4 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-cyan-500/30 shrink-0 space-y-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveAndClose}
              className="flex-1 py-2.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-slate-950 font-black text-xs rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:brightness-110 cursor-pointer transition-all flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>حفظ وتثبيت الثيم في الغرفة</span>
            </button>

            <button
              onClick={handleReset}
              title="استعادة الافتراضي"
              className="p-2.5 rounded-xl bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 transition-all cursor-pointer flex items-center justify-center"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Floating Toast Notification */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 border-2 border-cyan-400 text-cyan-200 px-4 py-2 rounded-2xl shadow-2xl text-xs font-black backdrop-blur-xl flex items-center gap-2 whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
