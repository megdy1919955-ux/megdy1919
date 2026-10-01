import React from 'react';
import {
  Sparkles,
  Gift,
  Crown,
  Trophy,
  Smile,
  Globe,
  Radio,
  ChevronsUpDown,
  AlertCircle,
  Flame
} from 'lucide-react';
import { RoomEffectsAndSoundConfig } from './audioTypes';

export interface VisualEffectsSettingsTabProps {
  config: RoomEffectsAndSoundConfig;
  onToggle: (key: keyof RoomEffectsAndSoundConfig, labelArabic: string) => void;
}

/**
 * تبويب إعدادات المؤثرات البصرية للروم (8 عناصر)
 * الفازات، الهدايا، الدخوليات، المكافآت، الإيموجي، الإشعار العالمي، قناة الهدايا، وسحب تغيير الغرفة
 */
export const VisualEffectsSettingsTab: React.FC<VisualEffectsSettingsTabProps> = ({
  config,
  onToggle
}) => {
  return (
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
            onClick={() => onToggle('vaseAnimation', 'الأني ميشن الفاز')}
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
            onClick={() => onToggle('giftVisualEffects', 'المؤثرات البصرية للهدية')}
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
              onClick={() => onToggle('entranceVisualEffects', 'المؤثرات البصرية للدخول')}
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

          {/* تنبيه VIP 11 فما فوق */}
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
            onClick={() => onToggle('rewardEffect', 'تأثير المكافأة')}
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
            onClick={() => onToggle('commentEmoji', 'الايموجي للتعليق')}
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
            onClick={() => onToggle('globalNotification', 'إشعار عالمي')}
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
            onClick={() => onToggle('giftChannel', 'قناة الهدايا')}
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
            onClick={() => onToggle('swipeToChangeRoom', 'ارفع لأعلى وأسفل لتغيير الغرفة')}
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
  );
};
