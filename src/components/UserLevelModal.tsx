import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, Lock, Sparkles, Gift, Crown, HelpCircle, X, Shield, Star, Award, Zap } from 'lucide-react';
import { 
  Badge100Shield, 
  Badge150Shield, 
  Badge180Shield 
} from './profile/AppearanceAssets';

interface UserLevelModalProps {
  isOpen: boolean;
  onClose: () => void;
  level?: number;
  userName?: string;
  avatarUrl?: string;
}

export const UserLevelModal: React.FC<UserLevelModalProps> = ({ 
  isOpen, 
  onClose, 
  level = 113,
  userName = "عابر سبيل",
  avatarUrl = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150"
}) => {
  const [activeTab, setActiveTab] = useState<'historical' | 'annual' | 'splendor'>('historical');
  const [showHowToModal, setShowHowToModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState<any | null>(null);

  if (!isOpen) return null;

  const currentExp = 1541939;
  const nextLevelExp = 1582000;
  const expNeeded = 40061;
  const progressPercent = Math.min(100, Math.round(((nextLevelExp - expNeeded) / nextLevelExp) * 100));

  // شارات المستوى
  const badgeRewards = [
    {
      id: 'badge_100',
      title: 'شارة المستوى 100',
      unlocked: true,
      component: <Badge100Shield className="w-14 h-14" />,
      unlockText: 'فتح المستوى 100',
      duration: 'الحصول بشكل دائم',
      desc: 'شارة أسطورية مجنحة بالكرستال الأزرق تمنح لرواد المستوى 100.'
    },
    {
      id: 'badge_150',
      title: 'شارة المستوى 150',
      unlocked: false,
      component: <Badge150Shield className="w-14 h-14" />,
      unlockText: 'فتح المستوى 150',
      duration: 'الحصول بشكل دائم',
      desc: 'شارة إشعاع بنفسجي خارقة مخصصة لنخبة الداعمين بالمستوى 150.'
    },
    {
      id: 'badge_180',
      title: 'شارة المستوى 180',
      unlocked: false,
      component: <Badge180Shield className="w-14 h-14" />,
      unlockText: 'فتح المستوى 180',
      duration: 'الحصول بشكل دائم',
      desc: 'وسام الياقوت الإمبراطوري المتوهج لأعلى رتب النجم.'
    }
  ];

  // مكافآت VIP
  const vipRewards = [
    {
      id: 'vip_425',
      title: 'تنين الذهب VIP 10',
      unlocked: false,
      icon: (
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-300 flex items-center justify-center text-2xl shadow-md border-2 border-yellow-200">
          🐉
        </div>
      ),
      unlockText: 'فتح المستوى 425',
      duration: '7 يوم (أيام)',
      desc: 'بطاقة تجربة VIP 10 مع ميزات الدخول الملكي وإخفاء التواجد.'
    },
    {
      id: 'vip_475',
      title: 'تنين الإمبراطور VIP 10',
      unlocked: false,
      icon: (
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-600 via-amber-400 to-yellow-300 flex items-center justify-center text-2xl shadow-md border-2 border-yellow-200">
          👑
        </div>
      ),
      unlockText: 'فتح المستوى 475',
      duration: '7 يوم (أيام)',
      desc: 'شارة وتأثير دخول إمبراطوري خاص بملفات النخبة.'
    },
    {
      id: 'vip_500',
      title: 'الملاك السماوي VIP 11',
      unlocked: false,
      icon: (
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 via-indigo-400 to-purple-500 flex items-center justify-center text-2xl shadow-md border-2 border-sky-200">
          🪽
        </div>
      ),
      unlockText: 'فتح المستوى 500',
      duration: '7 يوم (أيام)',
      desc: 'عضوية VIP 11 الحصرية لأساطير التطبيق مع كامل المزايا.'
    }
  ];

  // مكافآت مخصصة
  const customRewards = [
    {
      id: 'custom_id_100',
      title: 'معرّف مميز Special ID',
      unlocked: true,
      icon: (
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-700 flex flex-col items-center justify-center text-white shadow-md border border-emerald-300 font-mono">
          <span className="text-[10px] font-black tracking-widest text-emerald-200">ID</span>
          <span className="text-xs font-black">SPECIAL</span>
        </div>
      ),
      unlockText: 'فتح المستوى 100',
      duration: '180 يوم (أيام)',
      desc: 'إمكانية اختيار وتثبيت معرّف ID رقمي مميز وقصير.'
    },
    {
      id: 'custom_banner_150',
      title: 'بطاقة تعريف فاخرة',
      unlocked: false,
      icon: (
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-500 to-rose-500 flex items-center justify-center text-white shadow-md border border-pink-300 text-2xl">
          🎨
        </div>
      ),
      unlockText: 'فتح المستوى 150',
      duration: '180 يوم (أيام)',
      desc: 'ثيم متحرك مخصص لخلفية الملف الشخصي ورسائل الغرف.'
    },
    {
      id: 'custom_id_150',
      title: 'معرّف ماسي 5 أرقام',
      unlocked: false,
      icon: (
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 flex flex-col items-center justify-center text-slate-950 shadow-md border border-yellow-200 font-mono">
          <span className="text-[10px] font-black tracking-widest text-amber-900">ID</span>
          <span className="text-xs font-black">DIAMOND</span>
        </div>
      ),
      unlockText: 'فتح المستوى 150',
      duration: '180 يوم (أيام)',
      desc: 'حجز ID ماسي مميز من 5 أرقام بتنسيق ملكي.'
    }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md" dir="rtl">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className="w-full max-w-md h-full sm:h-[92vh] max-h-[900px] bg-[#0E1528] rounded-none sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col relative text-white border-0 sm:border border-slate-800"
        >
          {/* Top Bar */}
          <div className="relative px-4 pt-4 pb-2 flex items-center justify-between shrink-0 z-20">
            <button
              onClick={onClose}
              className="p-2 rounded-full text-white/90 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            <h1 className="text-base sm:text-lg font-black tracking-wide text-white">مستوى المستخدم</h1>
            <div className="w-10" />
          </div>

          {/* Navigation Tabs (مستوى الدعم التاريخي / مستوى الدعم السنوي / روعة) */}
          <div className="flex items-center justify-around border-b border-white/10 px-2 shrink-0 z-20">
            <button
              onClick={() => setActiveTab('historical')}
              className={`pb-2.5 px-3 text-xs sm:text-sm font-black transition-all relative cursor-pointer ${
                activeTab === 'historical'
                  ? 'text-white'
                  : 'text-white/60 hover:text-white/80'
              }`}
            >
              <span>مستوى الدعم التاريخي</span>
              {activeTab === 'historical' && (
                <motion.div
                  layoutId="level_tab_indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full"
                />
              )}
            </button>

            <button
              onClick={() => setActiveTab('annual')}
              className={`pb-2.5 px-3 text-xs sm:text-sm font-black transition-all relative cursor-pointer ${
                activeTab === 'annual'
                  ? 'text-white'
                  : 'text-white/60 hover:text-white/80'
              }`}
            >
              <span>مستوى الدعم السنوي</span>
              {activeTab === 'annual' && (
                <motion.div
                  layoutId="level_tab_indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full"
                />
              )}
            </button>

            <button
              onClick={() => setActiveTab('splendor')}
              className={`pb-2.5 px-3 text-xs sm:text-sm font-black transition-all relative cursor-pointer ${
                activeTab === 'splendor'
                  ? 'text-white'
                  : 'text-white/60 hover:text-white/80'
              }`}
            >
              <span>روعة</span>
              {activeTab === 'splendor' && (
                <motion.div
                  layoutId="level_tab_indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full"
                />
              )}
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col">
            {/* Hero Cosmic Starry Stage */}
            <div className="relative pt-6 pb-6 px-6 overflow-hidden bg-gradient-to-b from-[#111A3A] via-[#161742] to-[#120F2D] shrink-0 text-center">
              {/* Stars & Aurora Lights Overlay */}
              <div className="absolute inset-0 bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-purple-500/20 blur-3xl pointer-events-none rounded-full" />

              {/* Avatar Center with Lv Badge */}
              <div className="relative inline-block mx-auto mb-4">
                <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-b from-amber-300 via-purple-400 to-indigo-600 shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                  <img
                    src={avatarUrl}
                    alt={userName}
                    className="w-full h-full rounded-full object-cover border-2 border-slate-900"
                  />
                </div>

                {/* Royal Purple Level Ribbon Badge */}
                <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-700 text-amber-300 font-black text-xs px-3.5 py-0.5 rounded-full border border-amber-400/80 shadow-lg flex items-center gap-1 whitespace-nowrap">
                  <Crown className="w-3 h-3 text-amber-300 fill-amber-300" />
                  <span className="font-mono tracking-wide">Lv.{level}</span>
                </div>
              </div>

              {/* Level Progress Bar Section */}
              <div className="max-w-xs mx-auto mt-2 space-y-1.5">
                {/* Level Numbers and Progress Track */}
                <div className="relative pt-4">
                  {/* Current Exp Floating Capsule */}
                  <div 
                    className="absolute top-0 bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-full shadow-md font-mono border border-white -translate-x-1/2"
                    style={{ left: `${progressPercent}%` }}
                  >
                    {currentExp.toLocaleString('en-US')}
                  </div>

                  {/* The Bar Track */}
                  <div className="w-full h-2.5 bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-white/20">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 rounded-full relative"
                    >
                      <span className="absolute inset-0 bg-white/30 animate-pulse rounded-full" />
                    </motion.div>
                  </div>
                </div>

                {/* Bar Labels (Lv.113 on right in RTL, Lv.114 on left in RTL) */}
                <div className="flex items-center justify-between text-[11px] font-black text-white/90 px-0.5 font-mono">
                  <span>Lv.{level}</span>
                  <span>Lv.{level + 1}</span>
                </div>

                {/* Subtitle */}
                <div className="text-[11px] text-white/80 font-bold mt-1">
                  يلزم <span className="text-amber-300 font-mono font-black">{expNeeded.toLocaleString('en-US')}</span> من نقاط الخبرة للترقية
                </div>
              </div>
            </div>

            {/* White Curved Sheet Content (مكافآت المستوى) */}
            <div className="flex-1 bg-white text-slate-900 rounded-t-3xl p-5 space-y-6 -mt-2 shadow-2xl">
              <h2 className="text-base font-black text-slate-950 flex items-center justify-between">
                <span>مكافآت المستوى</span>
                <span className="text-xs font-bold text-slate-400">المزايا الحصرية المكتسبة</span>
              </h2>

              {/* 1. قسم الشارات (Badges) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-black text-sm text-slate-900">
                    <Shield className="w-4 h-4 text-amber-500" />
                    <span>شارة</span>
                  </div>
                  <button 
                    onClick={() => {}} 
                    className="text-xs font-bold text-slate-500 hover:text-amber-600 flex items-center gap-0.5"
                  >
                    <span>المزيد</span>
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  {badgeRewards.map((badge) => (
                    <motion.div
                      key={badge.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setSelectedReward(badge)}
                      className={`relative rounded-2xl p-2.5 flex flex-col items-center justify-between text-center border transition-all cursor-pointer ${
                        badge.unlocked
                          ? 'bg-gradient-to-b from-amber-50/60 to-yellow-100/30 border-amber-200/80 shadow-xs'
                          : 'bg-slate-50/80 border-slate-200/80'
                      }`}
                    >
                      {/* Lock Icon if locked */}
                      {!badge.unlocked && (
                        <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xs">
                          <Lock className="w-3 h-3" />
                        </div>
                      )}

                      <div className="my-1.5 flex items-center justify-center">
                        {badge.component}
                      </div>

                      <div className="w-full space-y-0.5 mt-1">
                        <div className="text-[10px] font-black text-slate-700 truncate">
                          {badge.duration}
                        </div>
                        <div className="text-[9px] font-bold text-slate-500 truncate">
                          {badge.unlockText}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* 2. قسم VIP */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-black text-sm text-slate-900">
                    <Crown className="w-4 h-4 text-amber-500" />
                    <span>VIP</span>
                  </div>
                  <button 
                    onClick={() => {}} 
                    className="text-xs font-bold text-slate-500 hover:text-amber-600 flex items-center gap-0.5"
                  >
                    <span>المزيد</span>
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  {vipRewards.map((vip) => (
                    <motion.div
                      key={vip.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setSelectedReward(vip)}
                      className="relative rounded-2xl p-2.5 flex flex-col items-center justify-between text-center bg-slate-50/80 border border-slate-200/80 transition-all cursor-pointer"
                    >
                      <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xs">
                        <Lock className="w-3 h-3" />
                      </div>

                      <div className="my-1.5 flex items-center justify-center">
                        {vip.icon}
                      </div>

                      <div className="w-full space-y-0.5 mt-1">
                        <div className="text-[10px] font-black text-slate-700 truncate">
                          {vip.duration}
                        </div>
                        <div className="text-[9px] font-bold text-slate-500 truncate">
                          {vip.unlockText}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* 3. قسم مكافآت مخصصة */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-black text-sm text-slate-900">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>مكافآت مخصصة</span>
                  </div>
                  <button 
                    onClick={() => {}} 
                    className="text-xs font-bold text-slate-500 hover:text-amber-600 flex items-center gap-0.5"
                  >
                    <span>المزيد</span>
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2.5 pb-4">
                  {customRewards.map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setSelectedReward(item)}
                      className={`relative rounded-2xl p-2.5 flex flex-col items-center justify-between text-center border transition-all cursor-pointer ${
                        item.unlocked
                          ? 'bg-gradient-to-b from-emerald-50/60 to-teal-100/30 border-emerald-200/80 shadow-xs'
                          : 'bg-slate-50/80 border-slate-200/80'
                      }`}
                    >
                      {!item.unlocked && (
                        <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xs">
                          <Lock className="w-3 h-3" />
                        </div>
                      )}

                      <div className="my-1.5 flex items-center justify-center">
                        {item.icon}
                      </div>

                      <div className="w-full space-y-0.5 mt-1">
                        <div className="text-[10px] font-black text-slate-700 truncate">
                          {item.duration}
                        </div>
                        <div className="text-[9px] font-bold text-slate-500 truncate">
                          {item.unlockText}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Floating Green Action Button (كيف ترفع المستوى؟) */}
          <div className="p-4 bg-white border-t border-slate-100 shrink-0 shadow-lg">
            <button
              onClick={() => setShowHowToModal(true)}
              className="w-full py-3.5 rounded-full bg-[#10B981] hover:bg-[#059669] active:scale-[0.98] text-white font-black text-sm sm:text-base shadow-[0_4px_16px_rgba(16,185,129,0.35)] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <HelpCircle className="w-5 h-5" />
              <span>كيف ترفع المستوى؟</span>
            </button>
          </div>

          {/* Reward Detail Modal */}
          <AnimatePresence>
            {selectedReward && (
              <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white rounded-3xl p-6 max-w-xs w-full text-center text-slate-900 shadow-2xl relative border border-slate-100"
                >
                  <button
                    onClick={() => setSelectedReward(null)}
                    className="absolute top-4 left-4 p-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="flex justify-center mb-3">
                    {selectedReward.component || selectedReward.icon}
                  </div>

                  <h3 className="text-base font-black text-slate-900">{selectedReward.title}</h3>
                  <div className="inline-block bg-amber-100 text-amber-900 text-xs font-black px-3 py-1 rounded-full my-2">
                    {selectedReward.unlockText} • {selectedReward.duration}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium mb-4">
                    {selectedReward.desc}
                  </p>

                  <button
                    onClick={() => setSelectedReward(null)}
                    className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-black text-xs hover:bg-slate-800"
                  >
                    إغلاق
                  </button>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* How to Level Up Explanation Modal */}
          <AnimatePresence>
            {showHowToModal && (
              <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white rounded-3xl p-6 max-w-sm w-full text-slate-900 shadow-2xl relative border border-slate-100 space-y-4"
                >
                  <button
                    onClick={() => setShowHowToModal(false)}
                    className="absolute top-4 left-4 p-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-black">
                      <Zap className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-900">طرق رفع مستوى المستخدم</h3>
                      <p className="text-xs text-slate-500">طرق كسب نقاط الخبرة (EXP)</p>
                    </div>
                  </div>

                  <div className="space-y-2.5 text-xs text-slate-700">
                    <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5">
                      <Gift className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-emerald-950 font-black block">إرسال الهدايا والدعم</strong>
                        <span>كل 1 عملة يتم إرسالها في الرومات تمنحك 1 نقطة خبرة (EXP).</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-2.5">
                      <Crown className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-amber-950 font-black block">البقاء في الغرف الصوتية</strong>
                        <span>التواجد على المايك والتفاعل اليومي يمنح نقاط خبرة مستمرة.</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-sky-50 border border-sky-200 flex items-start gap-2.5">
                      <Star className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-sky-950 font-black block">المهام اليومية والألعاب</strong>
                        <span>إكمال المهام اليومية والمشاركة في الألعاب المصغرة يضاعف نقاطك.</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowHowToModal(false)}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md"
                  >
                    فهمت ذلك
                  </button>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
