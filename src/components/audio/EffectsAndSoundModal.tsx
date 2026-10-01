import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Sparkles,
  Volume2,
  SlidersHorizontal,
  RotateCcw,
  Check,
  Gauge
} from 'lucide-react';
import {
  RoomEffectsAndSoundConfig,
  DEFAULT_CONFIG,
  getStoredEffectsAndSoundConfig,
  saveEffectsAndSoundConfig
} from './audioTypes';
import { VisualEffectsSettingsTab } from './VisualEffectsSettingsTab';
import { SoundAndBalanceSettingsTab } from './SoundAndBalanceSettingsTab';

export interface EffectsAndSoundModalProps {
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

  const handleBalanceChange = (newBal: number) => {
    const newCfg = { ...config, audioBalance: newBal };
    setConfig(newCfg);
    saveEffectsAndSoundConfig(newCfg);
    onSettingsChanged?.(newCfg);
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
            {/* Tab 1: Visual Effects */}
            {(activeTab === 'all' || activeTab === 'effects') && (
              <VisualEffectsSettingsTab config={config} onToggle={handleToggle} />
            )}

            {/* Tab 2: Sound & Balance */}
            {(activeTab === 'all' || activeTab === 'sound') && (
              <SoundAndBalanceSettingsTab
                config={config}
                onToggle={handleToggle}
                onBalanceChange={handleBalanceChange}
                showOnlyBalance={false}
              />
            )}

            {/* Tab 3: Dedicated Balance View */}
            {activeTab === 'balance' && (
              <SoundAndBalanceSettingsTab
                config={config}
                onToggle={handleToggle}
                onBalanceChange={handleBalanceChange}
                showOnlyBalance={true}
              />
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

export default EffectsAndSoundModal;
