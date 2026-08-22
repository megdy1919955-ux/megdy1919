import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  SlidersHorizontal,
  Volume2,
  Gauge,
  RotateCcw,
  Volume1,
  Mic,
  Music
} from 'lucide-react';

interface SoundEffectsBalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSmartBalanceEnabled?: boolean;
  onToggleSmartBalance?: (enabled: boolean) => void;
  onTriggerToast?: (msg: string) => void;
}

export const SoundEffectsBalanceModal: React.FC<SoundEffectsBalanceModalProps> = ({
  isOpen,
  onClose,
  isSmartBalanceEnabled: initialSmartBalance = true,
  onToggleSmartBalance,
  onTriggerToast
}) => {
  const [smartBalance, setSmartBalance] = useState<boolean>(initialSmartBalance);
  const [audioBalance, setAudioBalance] = useState<number>(50); // 0 = Mic 100%, 50 = Balanced, 100 = Music 100%

  if (!isOpen) return null;

  const handleSmartBalanceToggle = () => {
    const nextVal = !smartBalance;
    setSmartBalance(nextVal);
    if (onToggleSmartBalance) onToggleSmartBalance(nextVal);
    if (onTriggerToast) {
      onTriggerToast(
        nextVal
          ? 'تم تفعيل التحكم الذكي بالتوازن ⚡ (خفض الموسيقى تلقائياً عند حديث المذيع)'
          : 'تم إيقاف التحكم الذكي (التحكم العادي اليدوي 🎚️)'
      );
    }
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 bg-black/65 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 pointer-events-auto select-none"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 15 }}
          transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-sm bg-[#0F1626] border border-blue-500/30 rounded-3xl shadow-2xl text-white relative overflow-hidden dir-rtl flex flex-col"
        >
          {/* Header Bar */}
          <div className="p-4 bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900 border-b border-blue-500/20 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <SlidersHorizontal className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                  تأثير الصوت
                </h3>
                <p className="text-[10px] text-blue-300/80 font-bold">
                  توازن الصوت والتحكم الذكي للمذيعين
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-4 space-y-4">
            {/* 1. التحكم الذكي بالتوازن (Smart Balance) */}
            <div className="bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/80 border border-blue-500/40 rounded-2xl p-3.5 shadow-md flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Gauge className={`w-4 h-4 ${smartBalance ? 'text-amber-400 animate-pulse' : 'text-slate-400'}`} />
                  <span className="text-xs font-black text-white">
                    التحكم الذكي بالتوازن (Smart Balance)
                  </span>
                </div>
                <p className="text-[10px] text-slate-300 font-medium leading-relaxed">
                  {smartBalance
                    ? 'التحكم الذكي مفعّل ⚡ (خفض الموسيقى تلقائياً لمنع التداخل أثناء حديث المذيع)'
                    : 'التحكم العادي 🎚️ (ضبط يدوي ثابت للمستويات)'}
                </p>
              </div>

              {/* Toggle Switch */}
              <button
                onClick={handleSmartBalanceToggle}
                className={`w-12 h-6.5 rounded-full transition-colors relative cursor-pointer p-0.5 shrink-0 ${
                  smartBalance ? 'bg-gradient-to-r from-blue-500 to-indigo-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform transform ${
                    smartBalance ? '-translate-x-5.5 bg-amber-300' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* 2. توازن الصوت (Audio Balance Slider) */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-blue-300 flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-blue-400" />
                  توازن الصوت (Audio Balance)
                </span>
                <span className="text-[10.5px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                  {audioBalance < 50
                    ? `المايك ${100 - audioBalance}%`
                    : audioBalance > 50
                    ? `الموسيقى ${audioBalance}%`
                    : 'توازن 50/50 ⚖️'}
                </span>
              </div>

              {/* Range Slider */}
              <div className="space-y-1.5">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={audioBalance}
                  onChange={(e) => setAudioBalance(Number(e.target.value))}
                  className="w-full accent-blue-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[9.5px] font-bold text-slate-400 px-0.5">
                  <span className="flex items-center gap-1">
                    <Mic className="w-3 h-3 text-blue-400" /> صوت المايك أعلى
                  </span>
                  <span>متوازن ⚖️</span>
                  <span className="flex items-center gap-1">
                    صوت الموسيقى أعلى <Music className="w-3 h-3 text-purple-400" />
                  </span>
                </div>
              </div>

              {/* Quick Balance Presets */}
              <div className="grid grid-cols-3 gap-1.5 pt-1">
                <button
                  onClick={() => {
                    setAudioBalance(20);
                    if (onTriggerToast) onTriggerToast('تم الضبط: التركيز على صوت المايك 🎙️');
                  }}
                  className={`py-1.5 px-2 rounded-xl text-[10px] font-black border transition-all cursor-pointer ${
                    audioBalance === 20
                      ? 'bg-blue-500/30 text-blue-300 border-blue-400'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                  }`}
                >
                  صوت المايك
                </button>
                <button
                  onClick={() => {
                    setAudioBalance(50);
                    if (onTriggerToast) onTriggerToast('تم الضبط: توازن متساوي 50/50 ⚖️');
                  }}
                  className={`py-1.5 px-2 rounded-xl text-[10px] font-black border transition-all cursor-pointer ${
                    audioBalance === 50
                      ? 'bg-indigo-500/30 text-indigo-300 border-indigo-400'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                  }`}
                >
                  توازن 50/50
                </button>
                <button
                  onClick={() => {
                    setAudioBalance(80);
                    if (onTriggerToast) onTriggerToast('تم الضبط: التركيز على الموسيقى 🎵');
                  }}
                  className={`py-1.5 px-2 rounded-xl text-[10px] font-black border transition-all cursor-pointer ${
                    audioBalance === 80
                      ? 'bg-purple-500/30 text-purple-300 border-purple-400'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                  }`}
                >
                  الموسيقى
                </button>
              </div>
            </div>
          </div>

          {/* Footer Bar */}
          <div className="p-3.5 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between gap-2 shrink-0">
            <button
              onClick={() => {
                setAudioBalance(50);
                setSmartBalance(true);
                if (onTriggerToast) onTriggerToast('تمت إعادة الضبط للوضع الافتراضي 🔄');
              }}
              className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              إعادة ضبط
            </button>

            <button
              onClick={() => {
                if (onTriggerToast) onTriggerToast('تم حفظ إعدادات توازن الصوت بنجاح ✅');
                onClose();
              }}
              className="py-2 px-5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-black shadow-md cursor-pointer transition-all"
            >
              تم والحفظ
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
