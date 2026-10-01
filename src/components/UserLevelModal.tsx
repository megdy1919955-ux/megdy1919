/**
 * نافذة مستوى ورتبة المستخدم الحقيقية المرتبطة بالسيرفر (Real-time Level Modal)
 * تدعم مستويين منفصلين ومستقلين وفق متطلبات النظام:
 * 1. مستوى الداعم (Supporter / Sender Level): ينمو بنقاط sender_exp
 * 2. مستوى المدعوم / الجاذبية (Receiver / Charm Level): ينمو بنقاط receiver_exp
 * مع عرض شريط التقدم الفعلي، معادلة EXP، وشارات الرتب الحقيقية
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Crown,
  Sparkles,
  Heart,
  ChevronLeft,
  X,
  HelpCircle,
  Award,
  Shield,
  Zap,
  TrendingUp,
  Gift,
  Check,
  Lock
} from 'lucide-react';
import {
  calculateLevelFromExp,
  getRequiredExpForLevel,
  getSupporterTierInfo,
  getCharmTierInfo,
  listenToUserLevels,
  UserLevelSnapshot
} from '../lib/levelService';
import { getCurrentAuthUser, OWNER_DEV_ID } from '../lib/authService';
import { Badge100Shield, Badge150Shield, Badge180Shield } from './profile/AppearanceAssets';

interface UserLevelModalProps {
  isOpen: boolean;
  onClose: () => void;
  level?: number;
  userId?: string;
  userName?: string;
  avatarUrl?: string;
  senderExp?: number;
  receiverExp?: number;
  initialMode?: 'supporter' | 'charm';
}

export const UserLevelModal: React.FC<UserLevelModalProps> = ({
  isOpen,
  onClose,
  userId,
  userName = 'عابر سبيل',
  avatarUrl = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
  senderExp: initialSenderExp,
  receiverExp: initialReceiverExp,
  initialMode = 'supporter'
}) => {
  const currentAuth = getCurrentAuthUser();
  const effectiveUserId = userId || currentAuth?.id || OWNER_DEV_ID;

  // نمط المستوى المحدد: الداعم (sender) أو المدعوم والجاذبية (receiver)
  const [levelMode, setLevelMode] = useState<'supporter' | 'charm'>(initialMode);
  const [showHowToModal, setShowHowToModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState<any | null>(null);

  // مزامنة نمط المستوى المبدئي عند فتحه
  useEffect(() => {
    if (initialMode) {
      setLevelMode(initialMode);
    }
  }, [initialMode, isOpen]);

  // الحالة الحية للمستويات من السيرفر
  const isOwner = effectiveUserId === OWNER_DEV_ID || effectiveUserId === '1001001';
  const [liveLevels, setLiveLevels] = useState<{ senderExp: number; receiverExp: number }>(() => {
    const sExp = typeof initialSenderExp === 'number'
      ? initialSenderExp
      : (currentAuth?.sender_exp ?? (isOwner ? 2475000 : 0));
    const rExp = typeof initialReceiverExp === 'number'
      ? initialReceiverExp
      : (currentAuth?.receiver_exp ?? (isOwner ? 1914000 : 0));
    return { senderExp: sExp, receiverExp: rExp };
  });

  // الاستماع اللحظي لتحديثات المستويات السحابية
  useEffect(() => {
    if (!isOpen || !effectiveUserId) return;
    const unsubscribe = listenToUserLevels(effectiveUserId, (snapshot: UserLevelSnapshot) => {
      setLiveLevels({
        senderExp: snapshot.senderExp,
        receiverExp: snapshot.receiverExp
      });
    });
    return () => {
      unsubscribe();
    };
  }, [isOpen, effectiveUserId]);

  if (!isOpen) return null;

  // الحسابات الحقيقية بناءً على التبويب المحدد
  const isSupporter = levelMode === 'supporter';
  const activeExp = isSupporter ? liveLevels.senderExp : liveLevels.receiverExp;
  const calc = calculateLevelFromExp(activeExp);
  const tierInfo = isSupporter
    ? getSupporterTierInfo(calc.level)
    : getCharmTierInfo(calc.level);

  // شارات المستوى المقفلة والمفتوحة بناءً على المستوى الحقيقي
  const badgeRewards = [
    {
      id: 'badge_10',
      levelReq: 10,
      title: isSupporter ? 'شارة الداعم الفضي' : 'شارة الجاذبية الفضية',
      unlocked: calc.level >= 10,
      icon: isSupporter ? '🛡️' : '💫',
      duration: 'دائم',
      desc: isSupporter ? 'شارة تمنح للداعمين المتألقين من المستوى 10.' : 'وسام يمنح لنجوم الروم عند بلوغ مستوى جاذبية 10.'
    },
    {
      id: 'badge_25',
      levelReq: 25,
      title: isSupporter ? 'تاج الداعم الذهبي' : 'شارة السحر الملكي',
      unlocked: calc.level >= 25,
      icon: isSupporter ? '👑' : '✨',
      duration: 'دائم',
      desc: isSupporter ? 'تاج ذهبي ملكي يضيء في الرومات مع كل رسالة.' : 'شارة بريق وردية لأصحاب الحضور والجاذبية الملكية.'
    },
    {
      id: 'badge_50',
      levelReq: 50,
      title: isSupporter ? 'وسام البلاتينيوم' : 'شارة محبوب الجماهير',
      unlocked: calc.level >= 50,
      icon: isSupporter ? '⚡' : '🌸',
      duration: 'دائم',
      desc: isSupporter ? 'وسام إشعاع برّاق لكبار الداعمين من المستوى 50.' : 'شارة تميز للمواهب الصوتية ومحبوبي الجماهير.'
    },
    {
      id: 'badge_100',
      levelReq: 100,
      title: isSupporter ? 'شارة سوبر ليجند SL' : 'وسام إمبراطور المسرح',
      unlocked: calc.level >= 100,
      component: <Badge100Shield className="w-14 h-14" />,
      duration: 'دائم',
      desc: 'وسام أسطوري بأجنحة الكرستال تمنح لرواد المستوى 100 وما فوق.'
    },
    {
      id: 'badge_150',
      levelReq: 150,
      title: 'شارة الأسطورة الخارقة',
      unlocked: calc.level >= 150,
      component: <Badge150Shield className="w-14 h-14" />,
      duration: 'دائم',
      desc: 'شارة إشعاع بنفسجي أسطورية لنخبة التطبيق.'
    }
  ];

  return (
    <div
      className="fixed inset-0 z-[100000] bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 text-slate-100 select-none"
      dir="rtl"
    >
      <motion.div
        initial={{ opacity: 0, y: 80, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 80, scale: 0.96 }}
        transition={{ type: 'spring', damping: 26, stiffness: 320 }}
        className="w-full max-w-lg bg-[#0F1424] border border-amber-500/30 rounded-t-[32px] sm:rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[88vh]"
      >
        {/* Top Header Bar */}
        <div className="p-4 pb-3 flex items-center justify-between border-b border-slate-800 bg-[#0E1322]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowHowToModal(true)}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-amber-300 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
              title="كيفية زيادة المستوى"
            >
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">كيفية الترقية</span>
            </button>
          </div>

          <h2 className="text-base font-black text-white flex items-center gap-2">
            <span>نظام المستويات الحقيقي</span>
            <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30">
              Live Cloud
            </span>
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Level Mode Switcher Tabs (داعم vs مدعوم) */}
        <div className="p-3 bg-slate-900/90 border-b border-slate-800 grid grid-cols-2 gap-2">
          {/* Supporter / Sender Level Tab */}
          <button
            type="button"
            onClick={() => setLevelMode('supporter')}
            className={`py-3 px-3 rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2.5 text-right relative overflow-hidden ${
              levelMode === 'supporter'
                ? 'bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 font-bold border border-slate-700/60'
            }`}
          >
            <Crown className={`w-5 h-5 ${levelMode === 'supporter' ? 'text-slate-950 fill-slate-950' : 'text-amber-400'}`} />
            <div>
              <div className="text-xs font-black leading-tight">مستوى الداعم</div>
              <div className={`text-[10px] font-mono ${levelMode === 'supporter' ? 'text-slate-900 font-bold' : 'text-slate-400'}`}>
                Lv.{calculateLevelFromExp(liveLevels.senderExp).level} (إرسال الهدايا)
              </div>
            </div>
            {levelMode === 'supporter' && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-ping opacity-75" />
            )}
          </button>

          {/* Charm / Receiver Level Tab */}
          <button
            type="button"
            onClick={() => setLevelMode('charm')}
            className={`py-3 px-3 rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2.5 text-right relative overflow-hidden ${
              levelMode === 'charm'
                ? 'bg-gradient-to-r from-rose-500 via-pink-600 to-purple-600 text-white font-black shadow-lg shadow-rose-500/20'
                : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 font-bold border border-slate-700/60'
            }`}
          >
            <Heart className={`w-5 h-5 ${levelMode === 'charm' ? 'text-white fill-white' : 'text-rose-400'}`} />
            <div>
              <div className="text-xs font-black leading-tight">مستوى الجاذبية</div>
              <div className={`text-[10px] font-mono ${levelMode === 'charm' ? 'text-pink-100 font-bold' : 'text-slate-400'}`}>
                Lv.{calculateLevelFromExp(liveLevels.receiverExp).level} (استلام الهدايا)
              </div>
            </div>
            {levelMode === 'charm' && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-ping opacity-75" />
            )}
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col">
          {/* Cosmic Stage Banner */}
          <div className="relative pt-6 pb-6 px-6 overflow-hidden bg-gradient-to-b from-[#101833] via-[#14163B] to-[#0E1026] text-center border-b border-slate-800/80">
            {/* Ambient Background Aura */}
            <div
              className={`absolute top-0 left-1/2 -translate-x-1/2 w-72 h-36 blur-3xl pointer-events-none rounded-full opacity-40 ${
                isSupporter ? 'bg-amber-500/30' : 'bg-rose-500/30'
              }`}
            />

            {/* Avatar Center with Live Level Badge */}
            <div className="relative inline-block mx-auto mb-3">
              <div
                className={`w-20 h-20 rounded-full p-1 shadow-xl transition-all ${
                  isSupporter
                    ? 'bg-gradient-to-b from-amber-300 via-yellow-400 to-amber-600 shadow-amber-500/20'
                    : 'bg-gradient-to-b from-rose-300 via-pink-400 to-purple-600 shadow-rose-500/20'
                }`}
              >
                <img
                  src={avatarUrl}
                  alt={userName}
                  className="w-full h-full rounded-full object-cover border-2 border-slate-900"
                />
              </div>

              {/* Level Pill Badge */}
              <div
                className={`absolute -bottom-2.5 left-1/2 -translate-x-1/2 font-black text-xs px-3.5 py-0.5 rounded-full border shadow-lg flex items-center gap-1 whitespace-nowrap ${tierInfo.badgeBg} ${tierInfo.badgeBorder} ${tierInfo.textColor}`}
              >
                <span>{tierInfo.icon}</span>
                <span className="font-mono tracking-wide">Lv.{calc.level}</span>
              </div>
            </div>

            {/* Title & Tier info */}
            <div className="mt-4">
              <h3 className="text-base font-black text-white flex items-center justify-center gap-1.5">
                <span>{userName}</span>
                <span className="text-xs text-amber-300 font-bold font-mono">
                  ({tierInfo.tierName})
                </span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {isSupporter
                  ? 'مجموع دعمك التراكمي في الغرف الصوتية'
                  : 'مجموع الهدايا التي استلمتها من معجبيك وداعميك'}
              </p>
            </div>

            {/* Real Progress Bar Section */}
            <div className="max-w-xs mx-auto mt-4 space-y-2">
              <div className="relative pt-4">
                {/* Floating Current Exp Tag */}
                <div
                  className={`absolute top-0 font-black text-[9px] px-2 py-0.5 rounded-full shadow-md font-mono border border-white -translate-x-1/2 transition-all duration-500 ${
                    isSupporter
                      ? 'bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950'
                      : 'bg-gradient-to-r from-rose-400 to-pink-300 text-slate-950'
                  }`}
                  style={{ left: `${Math.min(95, Math.max(5, calc.progressPercent))}%` }}
                >
                  {calc.totalExp.toLocaleString('en-US')} EXP
                </div>

                {/* Progress Bar Track */}
                <div className="w-full h-3 bg-slate-900/90 rounded-full overflow-hidden p-0.5 border border-white/20 shadow-inner">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${calc.progressPercent}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className={`h-full rounded-full relative ${
                      isSupporter
                        ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-400'
                        : 'bg-gradient-to-r from-rose-500 via-pink-400 to-purple-400'
                    }`}
                  >
                    <span className="absolute inset-0 bg-white/30 animate-pulse rounded-full" />
                  </motion.div>
                </div>
              </div>

              {/* Progress Labels */}
              <div className="flex items-center justify-between text-xs font-black text-slate-300 px-1 font-mono">
                <span className="text-white">Lv.{calc.level}</span>
                <span className="text-amber-400 font-bold">{calc.progressPercent}%</span>
                <span className="text-slate-400">Lv.{calc.level + 1}</span>
              </div>

              {/* EXP Needed Note */}
              <div className="text-[11px] text-slate-300 font-medium bg-black/40 border border-slate-800 py-1.5 px-3 rounded-xl">
                يلزم{' '}
                <span className="text-amber-300 font-mono font-black">
                  {calc.expNeededForNextLevel.toLocaleString('en-US')}
                </span>{' '}
                نقطة خبرة للارتقاء للمستوى التالي
              </div>
            </div>
          </div>

          {/* Rewards and Badges List */}
          <div className="p-4 sm:p-5 space-y-4 bg-[#0A0D18] flex-1">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>شارة ومكافآت {isSupporter ? 'مستوى الداعم' : 'مستوى الجاذبية'}</span>
              </h4>
              <span className="text-xs text-slate-400 font-mono">
                {badgeRewards.filter((b) => b.unlocked).length} / {badgeRewards.length} مفتوحة
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {badgeRewards.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    badge.unlocked
                      ? 'bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border-amber-500/40 shadow-sm'
                      : 'bg-slate-900/60 border-slate-800 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center text-2xl border border-slate-800 shrink-0">
                      {badge.component || badge.icon}
                    </div>
                    <div>
                      <div className="text-xs font-black text-white flex items-center gap-1.5">
                        <span>{badge.title}</span>
                        {badge.unlocked && (
                          <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-bold">
                            مفتوح ✓
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                        {badge.desc}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 text-left">
                    {badge.unlocked ? (
                      <span className="text-[10px] text-amber-300 font-bold bg-amber-500/10 border border-amber-400/20 px-2 py-0.5 rounded-lg">
                        نشط
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded-lg font-mono">
                        <Lock className="w-2.5 h-2.5" />
                        Lv.{badge.levelReq}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* EXP Formula Information Card */}
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs space-y-2">
              <div className="font-black text-amber-300 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                <span>معادلة النقاط ونمو المستوى (Server EXP Engine)</span>
              </div>
              <div className="text-[11px] text-slate-400 leading-relaxed space-y-1">
                <p>
                  • <strong className="text-white">مستوى الداعم (Sender):</strong> كل 1 كوينز ترسله كهدية داخل الغرف الصوتية يمنحك 1 نقطة خبرة فورية في سيرفر Firebase.
                </p>
                <p>
                  • <strong className="text-white">مستوى الجاذبية (Charm):</strong> كل 1 كوينز قيمة هدايا تستلمها من المعجبين تزيد نقاط جاذبيتك التراكمية وتمنحك ألماساً في محفظتك.
                </p>
                <p className="text-emerald-400 font-bold text-[10px] pt-1">
                  ✓ يتم تحديث مستواك في كافة الرومات وحسابات المستخدمين بشكل لحظي ذري وآمن.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* How To Level Up Dialog */}
      <AnimatePresence>
        {showHowToModal && (
          <div className="fixed inset-0 z-[100005] bg-black/70 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-sm bg-[#131929] border border-amber-500/40 rounded-3xl p-5 text-right space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>طريقة زيادة المستوى</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setShowHowToModal(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                  <div className="font-black text-amber-300 mb-1">👑 لزيادة مستوى الداعم:</div>
                  <p>أرسل هدايا في الرومات الصوتية. كل كوينز تنفقه يرفع شريط خبرتك مباشرة.</p>
                </div>

                <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                  <div className="font-black text-rose-300 mb-1">💖 لزيادة مستوى الجاذبية:</div>
                  <p>اصعد على المايك واستقبل دعم وهدايا أصدقائك وجمهورك لترقية شارة جاذبيتك.</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowHowToModal(false)}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs cursor-pointer"
              >
                فهمت ذلك ✓
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
