import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, X, ThumbsUp, ShieldAlert, Award, Sparkles, Clock, 
  HelpCircle, History, AlertTriangle, CheckCircle2, ArrowUpRight, 
  ChevronLeft, Gift, UserPlus, Zap, Crown, Flame 
} from 'lucide-react';

interface FriendlyPointsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userAvatar?: string;
  userName?: string;
}

export const FriendlyPointsModal: React.FC<FriendlyPointsModalProps> = ({
  isOpen,
  onClose,
  userAvatar = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
  userName = "عابر سبيل"
}) => {
  const [activeTab, setActiveTab] = useState<'add_points' | 'negative_points' | 'rewards'>('add_points');
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  if (!isOpen) return null;

  // 5 Tiers
  const tiers = [
    { id: 'bad', name: 'سيئ', range: '0-99', color: 'text-slate-400', icon: '👎' },
    { id: 'average', name: 'متوسط', range: '150-399', color: 'text-amber-400', icon: '👌' },
    { id: 'good', name: 'جيد', range: '400-699', color: 'text-emerald-400', icon: '👍' },
    { id: 'great', name: 'عظيم', range: '700-1099', color: 'text-sky-400', icon: '🌟' },
    { id: 'excellent', name: 'ممتاز', range: '+1100', color: 'text-yellow-400', icon: '👑', active: true },
  ];

  // Tasks for "إضافة نقطة"
  const addPointTasks = [
    {
      id: 1,
      title: 'دعوة مستخدمين جدد إلى الميكروفون بنجاح',
      progress: '0/10',
      pts: '+2 نقطة لكل دعوة',
      icon: UserPlus,
      completed: false
    },
    {
      id: 2,
      title: 'تقديم أو تلقي هدايا للمستخدمين الجدد لأول مرة كل يوم',
      progress: '0/21',
      pts: '+5 نقاط يومياً',
      icon: Gift,
      completed: false
    },
    {
      id: 3,
      title: 'ترقية مستوى الثروة وشارات التميز',
      progress: 'مستمر',
      pts: '+10 نقاط لكل مستوى',
      icon: Zap,
      completed: false
    },
    {
      id: 4,
      title: 'بعد استكمال أي إعادة شحن، قم بتسجيل الدخول كل يوم',
      progress: '1/1',
      pts: '+5 نقاط يومية',
      icon: CheckCircle2,
      completed: true
    }
  ];

  // Negative Points / Penalties
  const negativePointsRules = [
    {
      id: 1,
      title: 'طرد المستخدم بنقاط ودية >205 خارج الغرفة بدون سبب عادل',
      penalty: '-5 نقاط',
      desc: 'حماية المستخدمين الملتزمين من الطرد العشوائي'
    },
    {
      id: 2,
      title: 'تم حظر الحساب أو حظر الجهاز من الإدارة',
      penalty: '-12 نقطة',
      formula: 'أيام الحظر × 12 نقطة',
      desc: 'عقوبة فورية على مخالفة شروط المجتمع وسياسة الاستخدام'
    },
    {
      id: 3,
      title: 'حظر الميزة (حظر مايك، حظر رسائل، أو حظر شحن)',
      penalty: '-10 نقاط',
      formula: 'أيام الحظر × 10 نقاط',
      desc: 'يتم احتساب الخصم تلقائياً طوال فترة المنع'
    },
    {
      id: 4,
      title: 'تم رفض الاسم المستعار أو الصورة الرمزية لمخالفتها',
      penalty: '-5 نقاط',
      formula: 'عدد مرات الرفض × 5 نقاط',
      desc: 'يرجى الالتزام بالصور والأسماء اللائقة وغير المسيئة'
    }
  ];

  // Rewards and Tier Privileges Table
  const tierRewardsTable = [
    {
      range: '0-99',
      levelName: 'سيئ ❌',
      privileges: 'ممنوع الاستيلاء على المظاريف الحمراء، وممنوع الدردشة على الشاشة العامة في الغرفة',
      color: 'border-rose-500/40 bg-rose-950/20 text-rose-300'
    },
    {
      range: '100-199',
      levelName: 'مقيد ⚠️',
      privileges: 'ممنوع الاستيلاء على المظاريف الحمراء وصناديق الحظ',
      color: 'border-orange-500/40 bg-orange-950/20 text-orange-300'
    },
    {
      range: '200-399',
      levelName: 'متوسط ⚖️',
      privileges: 'الاستخدام الطبيعي دون مميزات إضافية',
      color: 'border-amber-500/40 bg-amber-950/20 text-amber-300'
    },
    {
      range: '400-699',
      levelName: 'جيد 👍',
      privileges: 'ميدالية التفاعل الجيد + إطار صورة رمزية فضي مميز',
      color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300'
    },
    {
      range: '700-1099',
      levelName: 'عظيم 🌟',
      privileges: 'ميدالية النجم الرائع + إطار صورة رمزية ذهبي + أولوية الصعود للمايك',
      color: 'border-sky-500/40 bg-sky-950/20 text-sky-300'
    },
    {
      range: '+1100',
      levelName: 'ممتاز 👑',
      privileges: 'ميدالية الشرف الملكية + إطار صورة رمزية بلاتيني ممتاز + رسالة رسمية شاملة لأول ترقية لإخبار المستخدمين حول العالم',
      color: 'border-yellow-400/80 bg-gradient-to-r from-amber-950/40 to-yellow-950/30 text-yellow-300 font-bold shadow-md'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md overflow-hidden font-sans" dir="rtl">
      {/* Fullscreen Royal Glass Container */}
      <div className="relative w-full max-w-lg h-full sm:h-[92vh] sm:rounded-3xl bg-gradient-to-b from-[#1b1406] via-[#0f0b03] to-[#080601] border border-amber-500/30 flex flex-col overflow-hidden shadow-2xl">
        
        {/* Background Royal Ambient Light */}
        <div className="absolute top-0 inset-x-0 h-80 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/25 via-yellow-700/15 to-transparent pointer-events-none" />
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        {/* Top Header Bar */}
        <div className="relative z-10 px-4 py-3.5 flex items-center justify-between border-b border-amber-500/20 bg-slate-950/50 backdrop-blur-md">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/5 border border-amber-500/30 text-amber-300 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all cursor-pointer shadow-sm"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="text-center">
            <h2 className="text-base sm:text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-300 tracking-wide flex items-center justify-center gap-1.5 font-serif">
              <span>نقطة ودية</span>
              <ThumbsUp className="w-4 h-4 text-amber-400 fill-amber-400" />
            </h2>
            <p className="text-[10px] text-amber-200/60 font-bold">مؤشر السمعة الملكي ونقاط الثقة والتفاعل</p>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowHistoryModal(true)}
              className="w-8 h-8 rounded-full bg-white/5 border border-amber-500/20 text-amber-300 hover:bg-white/10 flex items-center justify-center cursor-pointer transition-all shadow-2xs"
              title="سجل النقاط"
            >
              <History className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowHelpModal(true)}
              className="w-8 h-8 rounded-full bg-white/5 border border-amber-500/20 text-amber-300 hover:bg-white/10 flex items-center justify-center cursor-pointer transition-all shadow-2xs"
              title="تعليمات"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Score & Tier Visual Card */}
        <div className="relative z-10 px-4 pt-4 pb-2">
          <div className="rounded-3xl bg-gradient-to-b from-[#3a2806] via-[#241903] to-[#140d01] border-2 border-amber-400/60 p-4 shadow-[0_0_25px_rgba(245,158,11,0.25)] relative overflow-hidden">
            
            {/* Ambient Sparkles */}
            <div className="absolute top-2 left-3 flex items-center gap-1 text-amber-300/80 text-[11px] font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
              <span>أكثر من 100% مستخدم</span>
            </div>

            {/* Main Score Number */}
            <div className="text-center pt-3 pb-2">
              <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-amber-300 to-amber-500 font-mono tracking-tight drop-shadow-[0_2px_12px_rgba(245,158,11,0.6)]">
                2963
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-black mt-1">
                <Crown className="w-3.5 h-3.5 text-amber-300 fill-amber-400" />
                <span>الرتبة: ممتاز (النخبة الملكية)</span>
              </div>
            </div>

            {/* 5 Tiers Stepper */}
            <div className="grid grid-cols-5 gap-1 pt-3 border-t border-amber-500/20 text-center">
              {tiers.map((tier) => (
                <div key={tier.id} className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-md transition-transform ${
                    tier.active 
                      ? 'bg-gradient-to-tr from-amber-400 to-yellow-300 border-2 border-white scale-110 shadow-[0_0_10px_rgba(245,158,11,0.8)]' 
                      : 'bg-white/5 border border-white/10 text-slate-400'
                  }`}>
                    {tier.icon}
                  </div>
                  <span className={`text-[10px] font-black mt-1 ${tier.active ? 'text-amber-300 font-bold' : 'text-slate-400'}`}>
                    {tier.name}
                  </span>
                  <span className="text-[8px] text-slate-400 font-mono">
                    {tier.range}
                  </span>
                </div>
              ))}
            </div>

            {/* Countdown Progress Bar */}
            <div className="mt-3.5 pt-2.5 border-t border-amber-500/20 flex items-center justify-between text-[10px] text-amber-200/80 font-bold">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>18 ساعة 22 دقيقة 31 ثانية للانتقال إلى يوم جديد</span>
              </div>
              <span className="text-emerald-400 font-black">حالة آمنة</span>
            </div>

          </div>
        </div>

        {/* 3 Main Tabs */}
        <div className="relative z-10 px-4 pt-2 pb-1 grid grid-cols-3 gap-1 bg-slate-950/40 border-b border-white/5">
          <button
            onClick={() => setActiveTab('add_points')}
            className={`py-2 text-xs font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'add_points'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <span>إضافة نقطة</span>
          </button>

          <button
            onClick={() => setActiveTab('negative_points')}
            className={`py-2 text-xs font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'negative_points'
                ? 'bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <span>نقاط سلبية</span>
          </button>

          <button
            onClick={() => setActiveTab('rewards')}
            className={`py-2 text-xs font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'rewards'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <span>المكافأة / المستوى</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 pb-8">
          
          {/* TAB 1: إضافة نقطة (Tasks) */}
          {activeTab === 'add_points' && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-black text-amber-300 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>المهام اليومية لرفع النقاط الودية</span>
                </span>
                <span className="text-[10px] text-slate-400">تجدد يومياً</span>
              </div>

              {addPointTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-amber-950/20 border border-amber-500/20 flex items-center justify-between shadow-sm hover:border-amber-400/40 transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0 group-hover:scale-105 transition-transform">
                      <task.icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-black text-slate-100 group-hover:text-amber-200 transition-colors">
                        {task.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20 font-mono">
                          {task.pts}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono font-bold">
                          التقدم: {task.progress}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0 ${
                      task.completed
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-sm hover:opacity-95'
                    }`}
                  >
                    {task.completed ? 'مكتمل ✓' : 'ذهاب'}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: نقاط سلبية (Penalties) */}
          {activeTab === 'negative_points' && (
            <div className="space-y-2.5">
              <div className="p-3 rounded-2xl bg-rose-950/30 border border-rose-500/30 text-rose-200 text-xs font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>احرص على تجنب المخالفات للحفاظ على عضويتك الملكية ومزاياك الخاصة</span>
              </div>

              {negativePointsRules.map((rule) => (
                <div
                  key={rule.id}
                  className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-rose-950/20 border border-rose-500/20 flex items-start justify-between shadow-sm hover:border-rose-400/40 transition-all"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0 mt-0.5">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-black text-rose-200">
                        {rule.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {rule.desc}
                      </p>
                      {rule.formula && (
                        <span className="inline-block mt-1 text-[9px] font-mono text-rose-400/90 bg-rose-500/10 px-1.5 py-0.2 rounded border border-rose-500/20">
                          {rule.formula}
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-xl bg-rose-600/30 border border-rose-500/40 text-rose-300 font-mono font-black text-xs shrink-0">
                    {rule.penalty}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: المكافأة / المستوى (Tier Level Rewards Table) */}
          {activeTab === 'rewards' && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-black text-amber-300 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  <span>جدول الامتيازات والمكافآت حسب الرتبة</span>
                </span>
                <span className="text-[10px] text-amber-400 font-mono font-bold">6 مستويات</span>
              </div>

              <div className="space-y-2">
                {tierRewardsTable.map((tierRow, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-2xl border ${tierRow.color} transition-all shadow-sm`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black">{tierRow.levelName}</span>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.2 rounded-full bg-white/10 border border-white/15">
                          {tierRow.range} نقطة
                        </span>
                      </div>
                      {tierRow.range === '+1100' && (
                        <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full border border-yellow-200 shadow-xs">
                          رتبتك الحالية ✨
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-200/90 leading-relaxed">
                      {tierRow.privileges}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Help Modal Overlay */}
        <AnimatePresence>
          {showHelpModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-50 p-5 flex flex-col justify-center items-center"
            >
              <div className="w-full max-w-sm bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/40 rounded-3xl p-5 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="text-sm font-black text-amber-300 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-amber-400" />
                    <span>ما هي النقاط الودية؟</span>
                  </h3>
                  <button
                    onClick={() => setShowHelpModal(false)}
                    className="w-7 h-7 rounded-full bg-white/5 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-xs text-slate-300 space-y-2.5 leading-relaxed">
                  <p>• النقاط الودية هي مقياس تقييم مستوى النشاط، السمعة الإيجابية، والتفاعل داخل المنصة.</p>
                  <p>• كلما ارتفعت نقاطك (أعلى من 1100 نقطة) تحصل على إطارات حصرية، وسام ممتاز، وحرية كاملة في الغرف.</p>
                  <p>• انخفاض النقاط لأقل من 100 نقطة يقيد القدرة على الدردشة وفتح المظاريف الحمراء.</p>
                </div>

                <button
                  onClick={() => setShowHelpModal(false)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs hover:opacity-95 cursor-pointer shadow-md"
                >
                  حسناً، فهمت
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* History Modal Overlay */}
        <AnimatePresence>
          {showHistoryModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-50 p-5 flex flex-col justify-center items-center"
            >
              <div className="w-full max-w-sm bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/40 rounded-3xl p-5 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="text-sm font-black text-amber-300 flex items-center gap-2">
                    <History className="w-4 h-4 text-amber-400" />
                    <span>سجل تغير النقاط الودية</span>
                  </h3>
                  <button
                    onClick={() => setShowHistoryModal(false)}
                    className="w-7 h-7 rounded-full bg-white/5 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {[
                    { title: 'تسجيل دخول يومي بعد الشحن', pts: '+5', date: 'اليوم 14:20', color: 'text-emerald-400' },
                    { title: 'تقديم هدايا لمستخدم جديد', pts: '+5', date: 'أمس 22:15', color: 'text-emerald-400' },
                    { title: 'دعوة مستخدم للمايك بنجاح', pts: '+2', date: 'أمس 18:04', color: 'text-emerald-400' },
                  ].map((log, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-white">{log.title}</div>
                        <div className="text-[10px] text-slate-400">{log.date}</div>
                      </div>
                      <span className={`font-mono font-black ${log.color}`}>{log.pts}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs hover:opacity-95 cursor-pointer shadow-md"
                >
                  إغلاق
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
