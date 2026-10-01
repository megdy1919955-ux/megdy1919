import React from 'react';
import {
  Volume2,
  ShieldCheck,
  Wifi,
  Gauge,
  Mic,
  Music,
  Radio
} from 'lucide-react';
import { RoomEffectsAndSoundConfig } from './audioTypes';

export interface SoundAndBalanceSettingsTabProps {
  config: RoomEffectsAndSoundConfig;
  onToggle: (key: keyof RoomEffectsAndSoundConfig, labelArabic: string) => void;
  onBalanceChange: (balance: number) => void;
  showOnlyBalance?: boolean;
}

/**
 * تبويب إعدادات الصوت وتوفير البيانات وتوازن الصوت الذكي
 * صوت الهدية، عزل الضوضاء، وضع توفير البيانات، وموزع الصوت بين المايك والموسيقى
 */
export const SoundAndBalanceSettingsTab: React.FC<SoundAndBalanceSettingsTabProps> = ({
  config,
  onToggle,
  onBalanceChange,
  showOnlyBalance = false
}) => {
  return (
    <div className="space-y-4">
      {/* Sound Settings Section */}
      {!showOnlyBalance && (
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
                onClick={() => onToggle('giftSound', 'صوت الهدية')}
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
                onClick={() => onToggle('micNoiseCancellation', 'إلغاء ضوضاء الميكروفون')}
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
                onClick={() => onToggle('dataSaver', 'توفير البيانات')}
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

            {/* 12. نمط مسار الصوت: وسائط موحد للجميع (Media Stream) */}
            <div className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-800/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-indigo-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 shadow-inner">
                  <Radio className="w-4.5 h-4.5" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      12. مسار الصوت (Audio Stream)
                    </h4>
                    <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                      وسائط 🎵 (موحد للجميع)
                    </span>
                  </div>
                  <p className="text-[10.5px] text-slate-400 font-medium leading-tight">
                    مسار الصوت مضبوط تلقائياً على وضع الوسائط (Media Stream) لجميع المستخدمين لضمان أعلى جودة نقاء وتحكم مباشر بأزرار وسائط الهاتف.
                  </p>
                </div>
              </div>

              <span className="text-[10.5px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                وسائط ✓
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Smart Balance & Slider Section */}
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
              onClick={() => onToggle('smartBalance', 'التحكم الذكي بالتوازن')}
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
              onChange={(e) => onBalanceChange(Number(e.target.value))}
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
    </div>
  );
};
