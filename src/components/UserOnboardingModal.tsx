/**
 * شاشة تهيئة وتخصيص بيانات المستخدمين الجدد (New User Onboarding Flow)
 * تظهر للمرة الأولى فقط بعد تسجيل الدخول عبر Google.
 * تحظر الانتقال إلى الشاشة الرئيسية حتى يتم حفظ:
 * 1. الاسم المستعار المفضل
 * 2. العمر
 * 3. الدولة
 * يتم ربط الحساب بمعرّف تسلسلي فريد يبدأ من 1001001.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Crown,
  Sparkles,
  Check,
  ArrowRight,
  Globe,
  Calendar,
  User,
  ShieldCheck,
  IdCard,
  Mail,
  Camera
} from 'lucide-react';
import { NajmLogo } from './common/NajmLogo';
import { AuthUserData, completeUserOnboarding } from '../lib/authService';

interface UserOnboardingModalProps {
  user: AuthUserData;
  onComplete: (updatedUser: AuthUserData) => void;
}

const ARAB_AND_GLOBAL_COUNTRIES = [
  { code: 'YE', name: 'اليمن', flag: '🇾🇪' },
  { code: 'SA', name: 'المملكة العربية السعودية', flag: '🇸🇦' },
  { code: 'AE', name: 'الإمارات العربية المتحدة', flag: '🇦🇪' },
  { code: 'EG', name: 'مصر', flag: '🇪🇬' },
  { code: 'KW', name: 'الكويت', flag: '🇰🇼' },
  { code: 'QA', name: 'قطر', flag: '🇶🇦' },
  { code: 'OM', name: 'سلطنة عمان', flag: '🇴🇲' },
  { code: 'BH', name: 'البحرين', flag: '🇧🇭' },
  { code: 'IQ', name: 'العراق', flag: '🇮🇶' },
  { code: 'JO', name: 'الأردن', flag: '🇯🇴' },
  { code: 'SY', name: 'سوريا', flag: '🇸🇾' },
  { code: 'LB', name: 'لبنان', flag: '🇱🇧' },
  { code: 'PS', name: 'فلسطين', flag: '🇵🇸' },
  { code: 'DZ', name: 'الجزائر', flag: '🇩🇿' },
  { code: 'MA', name: 'المغرب', flag: '🇲🇦' },
  { code: 'TN', name: 'تونس', flag: '🇹🇳' },
  { code: 'SD', name: 'السودان', flag: '🇸🇩' },
  { code: 'LY', name: 'ليبيا', flag: '🇱🇾' },
  { code: 'OTHER', name: 'دولة أخرى', flag: '🌍' }
];

export const UserOnboardingModal: React.FC<UserOnboardingModalProps> = ({
  user,
  onComplete
}) => {
  const [nickname, setNickname] = useState(user.name || '');
  const [age, setAge] = useState<number | ''>(24);
  const [country, setCountry] = useState<string>(user.country || 'اليمن');
  const [avatar, setAvatar] = useState<string>(user.avatar);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // قائمة بأعمار شائعة للاختيار السريع
  const quickAges = [18, 20, 22, 24, 26, 28, 30, 32, 35, 40, 45, 50];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = nickname.trim();
    if (!cleanName || cleanName.length < 2) {
      setErrorMessage('يرجى كتابة اسم مستعار صحيح (حرفين على الأقل)');
      return;
    }
    if (!age || Number(age) < 13 || Number(age) > 100) {
      setErrorMessage('يرجى تحديد عمر مناسب بين 13 و 100 عام');
      return;
    }
    if (!country) {
      setErrorMessage('يرجى اختيار دولتك من القائمة');
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const updated = await completeUserOnboarding({
        userId: user.id,
        name: cleanName,
        age: Number(age),
        country,
        avatar
      });
      setIsSubmitting(false);
      onComplete(updated);
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err?.message || 'حدث خطأ أثناء حفظ البيانات، يرجى المحاولة ثانية');
    }
  };

  return (
    <div
      className="fixed inset-0 z-[999999] bg-[#070A12]/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 text-slate-100 overflow-y-auto"
      dir="rtl"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full max-w-lg bg-gradient-to-b from-[#131929] via-[#0E1320] to-[#0A0D16] border border-amber-500/30 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col my-auto relative"
      >
        {/* Glowing Top Aura */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500" />
        <div className="absolute top-0 right-1/4 w-32 h-32 bg-amber-500/10 blur-3xl pointer-events-none rounded-full" />

        {/* Header Section */}
        <div className="p-5 pt-6 pb-4 text-center border-b border-slate-800/80 relative">
          <div className="flex justify-center mb-3">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-yellow-500/10 border border-amber-400/40 flex items-center justify-center shadow-lg shadow-amber-500/10">
                <NajmLogo className="w-12 h-12" />
              </div>
              <div className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 p-1 rounded-full shadow-md">
                <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
              </div>
            </div>
          </div>

          <h2 className="text-xl font-black text-white tracking-wide flex items-center justify-center gap-2">
            مرحباً بك في تطبيق النجم
            <span className="text-amber-400">⭐</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
            الرجاء تهيئة وتأكيد بيانات حسابك الملكي للانضمام لمجتمع الغرف الصوتية
          </p>

          {/* Sequential User ID & Google Email Strip */}
          <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2">
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500/15 to-yellow-500/10 border border-amber-400/30 px-3 py-1 rounded-full text-[11px] font-bold text-amber-300">
              <IdCard className="w-3.5 h-3.5 text-amber-400" />
              <span>معرّف حسابك الملكي:</span>
              <span className="font-mono text-white text-xs font-black tracking-wider">
                #{user.id}
              </span>
            </div>

            {user.email && (
              <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700 px-3 py-1 rounded-full text-[11px] text-slate-300 font-medium truncate max-w-[210px]">
                <Mail className="w-3 h-3 text-emerald-400 shrink-0" />
                <span className="truncate font-mono text-[10px]" dir="ltr">
                  {user.email}
                </span>
                <span className="text-emerald-400 font-bold text-[10px]">✓</span>
              </div>
            )}
          </div>
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div className="mx-5 mt-4 p-3 rounded-2xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs font-bold text-center animate-shake">
            {errorMessage}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Avatar and Nickname Section */}
          <div className="flex items-center gap-3.5 bg-slate-900/60 border border-slate-800 p-3 rounded-2xl">
            {/* Avatar with Camera badge */}
            <div className="relative shrink-0">
              <img
                src={avatar}
                alt="Avatar"
                className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-400/60 shadow-md"
              />
              <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 p-1 rounded-lg shadow-sm">
                <Camera className="w-3 h-3" />
              </div>
            </div>

            {/* Nickname input */}
            <div className="flex-1 min-w-0">
              <label className="text-[11px] font-bold text-amber-300/90 flex items-center gap-1.5 mb-1">
                <User className="w-3.5 h-3.5 text-amber-400" />
                الاسم المستعار (اسمك في الرومات):
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="اكتب اسمك المفضل..."
                maxLength={30}
                required
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-amber-400 font-bold transition-all"
              />
            </div>
          </div>

          {/* Age Selection */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                تحديد العمر:
              </label>
              <span className="text-xs font-black font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-lg border border-amber-400/20">
                {age ? `${age} سنة` : 'غير محدد'}
              </span>
            </div>

            {/* Quick age chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {quickAges.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAge(a)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all shrink-0 cursor-pointer ${
                    age === a
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 scale-105'
                      : 'bg-slate-900 border border-slate-700/70 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>

            {/* Custom Age Input */}
            <input
              type="number"
              min={13}
              max={100}
              value={age}
              onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
              placeholder="أو اكتب عمرك رقماً..."
              className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-400 font-mono"
            />
          </div>

          {/* Country Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              الدولة (علم الدولة سيظهر في بروفايلك):
            </label>
            <div className="relative">
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
                className="w-full bg-slate-900/90 border border-slate-700/90 rounded-2xl px-3.5 py-3 text-sm text-white font-bold outline-none focus:border-amber-400 appearance-none cursor-pointer"
              >
                {ARAB_AND_GLOBAL_COUNTRIES.map((c) => (
                  <option key={c.code} value={c.name} className="bg-slate-900 text-white py-2">
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                ▼
              </div>
            </div>
          </div>

          {/* Live Profile Card Preview */}
          <div className="bg-gradient-to-r from-amber-500/10 via-slate-900/80 to-slate-900/80 border border-amber-500/20 rounded-2xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full overflow-hidden border border-amber-400/60 shrink-0">
                <img src={avatar} alt="Preview" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="text-xs font-black text-white flex items-center gap-1.5">
                  <span>{nickname.trim() || 'اسمك المستعار'}</span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-mono">
                    #{user.id}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                  <span>{country}</span>
                  <span>•</span>
                  <span>{age ? `${age} سنة` : 'العمر'}</span>
                </div>
              </div>
            </div>
            <div className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
              معاينة فورية ✓
            </div>
          </div>

          {/* Action Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !nickname.trim() || !age || !country}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 active:scale-[0.98] text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>إتمام التهيئة وبدء الاستخدام الملكي</span>
                <ArrowRight className="w-4 h-4 rotate-180" />
              </>
            )}
          </button>

          <p className="text-[10px] text-slate-500 text-center leading-relaxed">
            * لن تظهر هذه الشاشة مرة أخرى بعد حفظ بياناتك. يمكنك تعديل بياناتك لاحقاً من قسم الإعدادات.
          </p>
        </form>
      </motion.div>
    </div>
  );
};
