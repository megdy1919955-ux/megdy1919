import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Wrench, RefreshCw, Save, Check, Sparkles, Zap, Globe, FolderCheck, Sun, Smartphone, ShieldCheck } from 'lucide-react';
import {
  EmojiLottieConfig,
  getStoredEmojiConfigs,
  saveStoredEmojiConfigs,
  DEFAULT_EMOJI_CONFIGS,
  precacheAllLottieAssets
} from '../lib/lottieCache';
import { wakeLockService } from '../lib/wakeLockService';
import { LottieReactionPlayer } from './LottieReactionPlayer';

interface DevConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DevConfigModal: React.FC<DevConfigModalProps> = ({ isOpen, onClose }) => {
  const [configs, setConfigs] = useState<Record<string, EmojiLottieConfig>>(() => getStoredEmojiConfigs());
  const [selectedEmoji, setSelectedEmoji] = useState<string>('😂');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isWakeLockSupported] = useState<boolean>(() => wakeLockService.isSupported());

  if (!isOpen) return null;

  // Helper to infer category automatically from emoji symbol or path
  const inferCategory = (emojiStr: string, assetPath?: string): 'laugh' | 'cry' | 'heart' | 'fire' | 'party' | 'shock' | 'rose' => {
    if (assetPath) {
      const p = assetPath.toLowerCase();
      if (p.includes('laugh') || p.includes('joy') || p.includes('lol')) return 'laugh';
      if (p.includes('cry') || p.includes('tear') || p.includes('sad')) return 'cry';
      if (p.includes('heart') || p.includes('love')) return 'heart';
      if (p.includes('fire') || p.includes('flame')) return 'fire';
      if (p.includes('party') || p.includes('celebrat')) return 'party';
      if (p.includes('shock') || p.includes('surprise')) return 'shock';
      if (p.includes('rose') || p.includes('flower')) return 'rose';
    }
    if (['😂', '🤣', '😆', '😅', '🤪', '🥳', '😜', '😁', '😸', '😹', '😎', '🤩', '🤭', '😋', '🤡', '😏'].includes(emojiStr)) return 'laugh';
    if (['😭', '😢', '🥺', '💔', '😿', '💧', '🌧️', '🤐', '🥱', '😴'].includes(emojiStr)) return 'cry';
    if (['💖', '❤️', '💕', '🥰', '😍', '💓', '💗', '💞', '💌', '👑', '💯', '⭐', '💫'].includes(emojiStr)) return 'heart';
    if (['🔥', '⚡', '🚀', '💥', '✨', '🎆', '🌟'].includes(emojiStr)) return 'fire';
    if (['👏', '🙌', '👍', '🎉', '🎈', '🎊', '🎯', '🎶', '🎤', '🎺', '🥁', '💪', '🏆', '🦁', '🦅'].includes(emojiStr)) return 'party';
    if (['😱', '🤯', '💩', '👻', '🤖', '🙈', '🙉', '🙊', '👽', '👾', '🫡'].includes(emojiStr)) return 'shock';
    if (['🌹', '💐', '🌸', '🌺'].includes(emojiStr)) return 'rose';
    return 'laugh';
  };

  const activeConfig = configs[selectedEmoji] || {
    emoji: selectedEmoji,
    category: inferCategory(selectedEmoji),
    lottieAssetPath: `emojis/custom_${selectedEmoji}.json`,
    glowColor: '#F59E0B',
    speed: 1.0,
  };

  const isNetworkUrl = activeConfig.lottieAssetPath.startsWith('http://') || activeConfig.lottieAssetPath.startsWith('https://');

  const handleUpdateActiveField = (field: keyof EmojiLottieConfig, value: any) => {
    let updatedCategory = activeConfig.category;
    if (field === 'lottieAssetPath') {
      updatedCategory = inferCategory(selectedEmoji, value);
    }
    setConfigs((prev) => ({
      ...prev,
      [selectedEmoji]: {
        ...activeConfig,
        category: updatedCategory,
        [field]: value,
      },
    }));
  };

  const handleSelectEmoji = (emoji: string) => {
    setSelectedEmoji(emoji);
    if (!configs[emoji]) {
      const autoCat = inferCategory(emoji);
      setConfigs((prev) => ({
        ...prev,
        [emoji]: {
          emoji,
          category: autoCat,
          lottieAssetPath: `emojis/custom_${emoji}.json`,
          glowColor: '#F59E0B',
          speed: 1.0,
        },
      }));
    }
  };

  const handleSave = () => {
    saveStoredEmojiConfigs(configs);
    precacheAllLottieAssets(configs);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleResetDefaults = () => {
    setConfigs(DEFAULT_EMOJI_CONFIGS);
    saveStoredEmojiConfigs(DEFAULT_EMOJI_CONFIGS);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-transparent pointer-events-auto cursor-default select-none" onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-slate-100 pointer-events-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-slate-950/80 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  Developer Config & Lottie Manager
                  <span className="px-2 py-0.5 text-xs rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    Admin
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Pre-cache assets & map dynamic Lottie JSON / Network URLs to seat reactions
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/50 hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            {/* Emoji Selection Grid */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Select Emoji To Edit Mapping
              </label>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                {Object.keys(configs).map((emoji) => {
                  const isSelected = emoji === selectedEmoji;
                  return (
                    <button
                      key={emoji}
                      onClick={() => handleSelectEmoji(emoji)}
                      className={`aspect-square rounded-2xl border flex items-center justify-center text-2xl transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/30 scale-105 shadow-lg'
                          : 'bg-slate-800/40 border-slate-700/60 hover:border-slate-500'
                      }`}
                    >
                      {emoji}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Config & Preview Split */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950/50 p-5 rounded-2xl border border-slate-800/80">
              {/* Left Column: Form Controls */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-400">
                      Lottie Path or Network URL
                    </label>
                    <span className="text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1 font-mono font-medium bg-slate-800 text-slate-300">
                      {isNetworkUrl ? (
                        <>
                          <Globe className="w-3 h-3 text-cyan-400" />
                          <span>Network URL (http/s)</span>
                        </>
                      ) : (
                        <>
                          <FolderCheck className="w-3 h-3 text-amber-400" />
                          <span>Local Asset</span>
                        </>
                      )}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={activeConfig.lottieAssetPath}
                    onChange={(e) => handleUpdateActiveField('lottieAssetPath', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-amber-400 font-mono text-xs"
                    placeholder="https://assets.lottiefiles.com/.../data.json or emojis/laugh.json"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Supports local relative paths (`emojis/laugh.json`) or HTTP/HTTPS URLs (`https://...`).
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Animation Category
                  </label>
                  <select
                    value={activeConfig.category}
                    onChange={(e) => handleUpdateActiveField('category', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-amber-400"
                  >
                    <option value="laugh">Laugh (Joy tears & open mouth)</option>
                    <option value="cry">Cry (Waterfall tears)</option>
                    <option value="heart">Heart (Pulsing glow heart)</option>
                    <option value="fire">Fire (Flame pulse)</option>
                    <option value="party">Party (Celebration burst)</option>
                    <option value="shock">Shock (Surprise aura)</option>
                    <option value="rose">Rose (Petals blooming)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Mic Seat Glow Theme
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={activeConfig.glowColor}
                      onChange={(e) => handleUpdateActiveField('glowColor', e.target.value)}
                      className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={activeConfig.glowColor}
                      onChange={(e) => handleUpdateActiveField('glowColor', e.target.value)}
                      className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 uppercase font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Live Seat Avatar Preview */}
              <div className="flex flex-col items-center justify-center p-4 bg-slate-900/80 rounded-2xl border border-slate-800">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  Live Mic Seat Preview ({selectedEmoji})
                </span>

                <div className="relative w-24 h-24 rounded-full bg-slate-800 border-2 border-slate-700 p-1 flex items-center justify-center shadow-inner">
                  {/* Avatar Base Mockup */}
                  <div className="w-full h-full rounded-full bg-gradient-to-tr from-purple-600 to-amber-500 flex items-center justify-center text-white font-bold text-xl">
                    👑
                  </div>

                  {/* Lottie Reaction Player Overlay (Live re-render) */}
                  <div className="absolute inset-0 z-20">
                    <LottieReactionPlayer
                      key={`${selectedEmoji}_${activeConfig.lottieAssetPath}_${activeConfig.category}_${activeConfig.glowColor}`}
                      emoji={selectedEmoji}
                      emojiType={activeConfig.category}
                      lottieAssetPath={activeConfig.lottieAssetPath}
                    />
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 mt-3 text-center">
                  Live real-time preview updating on keypress & precached.
                </p>
              </div>
            </div>

            {/* Screen Always On / Wake Lock Automatic Indicator */}
            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-500/20 text-amber-400 border border-amber-500/40">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-100">إبقاء الشاشة مستيقظة تلقائياً (Auto Screen Wake Lock)</span>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      تلقائي دائم ⚡
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    يعمل تلقائياً في الخلفية فور دخول أي غرفة صوتية بدون الحاجة لأي تدخل أو أزرار تحكم من المستخدم.
                    {isWakeLockSupported ? ' (Screen Wake Lock API + Auto Gesture Recovery)' : ' (الوضع الاحتياطي للمتصفح)'}
                  </p>
                </div>
              </div>
            </div>

            {/* Zero-latency Precache Badge */}
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-3 text-emerald-300 text-xs">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>0 Latency Pre-cache Active:</strong> All selected Lottie animations and network URLs are cached in client memory for instant playback on seats.
              </span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between px-6 py-4 bg-slate-950/80 border-t border-slate-800">
            <button
              onClick={handleResetDefaults}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Defaults
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-slate-400 hover:text-white text-xs font-medium cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                {savedSuccess ? <Check className="w-4 h-4 text-emerald-950" /> : <Save className="w-4 h-4" />}
                {savedSuccess ? 'Saved & Precached!' : 'Save & Precache'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

