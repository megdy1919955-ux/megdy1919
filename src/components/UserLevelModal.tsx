import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, Zap, Award, CheckCircle2, Lock, Gift, Crown, Flame } from 'lucide-react';
import { SUPER_LEGEND_LEVELS } from '../data/superLegend';

interface UserLevelModalProps {
  isOpen: boolean;
  onClose: () => void;
  level: number;
}

export const UserLevelModal: React.FC<UserLevelModalProps> = ({ isOpen, onClose, level }) => {
  const [activeTab, setActiveTab] = useState<'normal' | 'superLegend'>('normal');
  const [selectedSuperLevel, setSelectedSuperLevel] = useState<number>(1);

  if (!isOpen) return null;

  const expCurrent = 8450;
  const expTarget = 10000;
  const progressPercentage = Math.min(100, Math.round((expCurrent / expTarget) * 100));

  const levelPerks = [
    { lvl: 25, title: 'إطار المستوى الذهبي', desc: 'إطار حصري حول الصورة الشخصية', unlocked: true },
    { lvl: 25, title: 'تمييز التعليقات', desc: 'لون خاص للتعليقات في الغرف الصوتية', unlocked: true },
    { lvl: 26, title: 'تأثير دخول خاص', desc: 'مؤثر بصرية ملونة عند دخول أي روم', unlocked: false },
    { lvl: 30, title: 'شارة الأسطورة', desc: 'شارة أسطورية تظهر بجانب اسمك', unlocked: false },
  ];

  const dailyTasks = [
    { title: 'تسجيل دخول يومي', exp: '+100 EXP', completed: true },
    { title: 'إرسال هدايا بقيمة 50 ألماس', exp: '+300 EXP', completed: true },
    { title: 'التواجد في غرفة صوتية لمدة 15 دقيقة', exp: '+250 EXP', completed: false },
    { title: 'المشاركة في لعبة مصغرة', exp: '+150 EXP', completed: false },
  ];

  const currentSuperLegend = SUPER_LEGEND_LEVELS.find((s) => s.level === selectedSuperLevel) || SUPER_LEGEND_LEVELS[0];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/60 backdrop-blur-xs" dir="rtl">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header with Level Badge Banner */}
          <div className="relative bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 p-6 text-white text-center overflow-hidden shrink-0">
            <button
              onClick={onClose}
              className="absolute top-4 left-4 p-2 rounded-full bg-black/20 hover:bg-black/30 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-20 h-20 mx-auto rounded-full bg-white/20 backdrop-blur-md border-4 border-white/40 flex items-center justify-center shadow-inner mb-3 relative">
              {activeTab === 'superLegend' ? (
                <span className="text-4xl animate-bounce">{currentSuperLegend.badgeIcon}</span>
              ) : (
                <Star className="w-10 h-10 text-yellow-300 fill-yellow-300 animate-pulse" />
              )}
              <span className="absolute -bottom-1 bg-amber-400 text-slate-950 font-black text-xs px-2.5 py-0.5 rounded-full border border-white shadow-md">
                {activeTab === 'superLegend' ? `SL.${selectedSuperLevel}` : `Lv.${level}`}
              </span>
            </div>

            <h2 className="text-2xl font-black tracking-tight">
              {activeTab === 'superLegend' ? 'مستويات سوبر ليجند' : 'مستوى المستخدم'}
            </h2>
            <p className="text-xs text-rose-100 mt-1 font-medium">
              {activeTab === 'superLegend'
                ? 'استكشف مميزات ورتب سوبر ليجند الخارقة!'
                : 'كلما ارتفع مستواك، زادت مزاياك وحصلت على مكافآت أضخم!'}
            </p>

            {/* Navigation Tabs */}
            <div className="flex bg-black/20 p-1 rounded-xl mt-4 max-w-xs mx-auto border border-white/20">
              <button
                onClick={() => setActiveTab('normal')}
                className={`flex-1 py-1.5 text-xs font-black rounded-lg transition-all ${
                  activeTab === 'normal'
                    ? 'bg-white text-rose-600 shadow-md'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                المستويات العامة
              </button>
              <button
                onClick={() => setActiveTab('superLegend')}
                className={`flex-1 py-1.5 text-xs font-black rounded-lg transition-all flex items-center justify-center gap-1 ${
                  activeTab === 'superLegend'
                    ? 'bg-amber-400 text-slate-950 shadow-md'
                    : 'text-amber-200 hover:text-white'
                }`}
              >
                <Crown className="w-3.5 h-3.5 fill-amber-400" />
                <span>Super Legend</span>
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-5 space-y-5 overflow-y-auto flex-1 no-scrollbar">
            {activeTab === 'normal' ? (
              <>
                {/* EXP Progress Box */}
                <div className="bg-rose-50/60 border border-rose-100 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1 text-rose-600">
                      <Zap className="w-4 h-4 text-amber-500 fill-amber-400" />
                      <span>التقدم الحالي</span>
                    </span>
                    <span className="font-mono text-slate-900">{expCurrent} / {expTarget} EXP</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-3.5 bg-rose-200/60 rounded-full overflow-hidden p-0.5 border border-rose-200">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercentage}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full relative"
                    >
                      <span className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
                    </motion.div>
                  </div>

                  <div className="text-[11px] text-slate-500 text-left font-medium">
                    متبقي <strong className="text-rose-600">{expTarget - expCurrent} EXP</strong> للوصول إلى المستوى {level + 1}
                  </div>
                </div>

                {/* Daily EXP Tasks */}
                <div>
                  <h3 className="text-sm font-black text-slate-900 mb-3 flex items-center gap-1.5">
                    <Gift className="w-4 h-4 text-pink-500" />
                    <span>مهام زيادة الخبرة اليومية</span>
                  </h3>
                  <div className="space-y-2">
                    {dailyTasks.map((task, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold"
                      >
                        <div className="flex items-center gap-2">
                          {task.completed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-slate-300 shrink-0" />
                          )}
                          <span className={task.completed ? 'text-slate-400 line-through' : 'text-slate-800'}>
                            {task.title}
                          </span>
                        </div>
                        <span className="text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
                          {task.exp}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Level Perks */}
                <div>
                  <h3 className="text-sm font-black text-slate-900 mb-3 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>مزايا المستويات</span>
                  </h3>
                  <div className="space-y-2.5">
                    {levelPerks.map((perk, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
                          perk.unlocked
                            ? 'bg-amber-50/40 border-amber-200/60 text-slate-800'
                            : 'bg-slate-50 border-slate-100 opacity-60 text-slate-500'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            perk.unlocked ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-200 text-slate-500'
                          }`}>
                            {perk.unlocked ? <Star className="w-4 h-4 fill-slate-950" /> : <Lock className="w-4 h-4" />}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                              <span>{perk.title}</span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 font-mono">
                                Lv.{perk.lvl}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">{perk.desc}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              /* SUPER LEGEND TAB CONTENT */
              <div className="space-y-4">
                {/* Horizontal Level Picker */}
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                  {SUPER_LEGEND_LEVELS.map((sl) => (
                    <button
                      key={sl.level}
                      onClick={() => setSelectedSuperLevel(sl.level)}
                      className={`flex-shrink-0 px-3.5 py-2 rounded-2xl border text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                        selectedSuperLevel === sl.level
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 border-amber-300 shadow-md scale-105'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-sm">{sl.badgeIcon}</span>
                      <span>{sl.name}</span>
                    </button>
                  ))}
                </div>

                {/* Selected Level Header Card */}
                <div className="bg-gradient-to-br from-slate-900 via-amber-950 to-slate-900 text-white rounded-2xl p-4 border border-amber-500/30 shadow-lg relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-2xl shadow-inner">
                        {currentSuperLegend.badgeIcon}
                      </div>
                      <div>
                        <h4 className="font-black text-amber-300 text-base">{currentSuperLegend.name}</h4>
                        <span className="text-[11px] text-amber-200/80">المستوى {currentSuperLegend.level} من 10</span>
                      </div>
                    </div>
                    <div className="bg-amber-400/20 border border-amber-400/40 text-amber-300 px-3 py-1 rounded-full text-xs font-black flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span>سوبر أسطوري</span>
                    </div>
                  </div>
                </div>

                {/* Perks List */}
                <div>
                  <h3 className="text-xs font-black text-slate-900 mb-2.5 flex items-center gap-1">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>مزايا ومكافآت {currentSuperLegend.name}</span>
                  </h3>

                  <div className="space-y-2">
                    {currentSuperLegend.perks.map((perk) => (
                      <div
                        key={perk.id}
                        className="bg-amber-50/50 border border-amber-200/60 rounded-xl p-3 flex items-center justify-between gap-3 shadow-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 font-black flex items-center justify-center text-xs shrink-0">
                            {perk.id}
                          </div>
                          <div>
                            <div className="text-xs font-black text-slate-900">{perk.title}</div>
                            <div className="text-[10px] font-bold text-amber-700">{perk.desc}</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-md">
                          مفعل ✨
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

