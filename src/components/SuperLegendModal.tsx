import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, MoreHorizontal, ChevronRight, Lock, Crown, ShieldAlert, Zap, EyeOff, Armchair, Sparkles, Gift, MessageSquare, Tag, Store, ShieldCheck, UserCheck, HeartHandshake, Mic, BadgeCheck, Users, Volume2, Shield, Eye, Flame, Car, Smile, Radio } from 'lucide-react';
import { SUPER_LEGEND_LEVELS } from '../data/superLegend';

interface SuperLegendModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRecharge?: () => void;
}

// Map perk titles to clean icons
const getPerkIcon = (title: string) => {
  if (title.includes('إطار ميكروفون')) return <Mic className="w-6 h-6 text-amber-300" />;
  if (title.includes('شارة')) return <BadgeCheck className="w-6 h-6 text-amber-300" />;
  if (title.includes('أصدقاء') || title.includes('متابعة')) return <Users className="w-6 h-6 text-amber-300" />;
  if (title.includes('فقاعة')) return <MessageSquare className="w-6 h-6 text-amber-300" />;
  if (title.includes('بيان الدخول') || title.includes('بانر')) return <Sparkles className="w-6 h-6 text-amber-300" />;
  if (title.includes('إخفاء')) return <EyeOff className="w-6 h-6 text-amber-300" />;
  if (title.includes('حصانة') || title.includes('حظر')) return <ShieldCheck className="w-6 h-6 text-amber-300" />;
  if (title.includes('خبرة') || title.includes('EXP')) return <Zap className="w-6 h-6 text-amber-300" />;
  if (title.includes('مركبة')) return <Car className="w-6 h-6 text-amber-300" />;
  if (title.includes('هدية')) return <Gift className="w-6 h-6 text-amber-300" />;
  if (title.includes('مقعد')) return <Armchair className="w-6 h-6 text-amber-300" />;
  if (title.includes('رمز')) return <Smile className="w-6 h-6 text-amber-300" />;
  if (title.includes('بث')) return <Radio className="w-6 h-6 text-amber-300" />;
  if (title.includes('الغامض')) return <EyeOff className="w-6 h-6 text-amber-300" />;
  return <Crown className="w-6 h-6 text-amber-300" />;
};

export const SuperLegendModal: React.FC<SuperLegendModalProps> = ({ isOpen, onClose, onOpenRecharge }) => {
  const [selectedLevelNum, setSelectedLevelNum] = useState<number>(1);

  if (!isOpen) return null;

  const currentLevelObj = SUPER_LEGEND_LEVELS.find((l) => l.level === selectedLevelNum) || SUPER_LEGEND_LEVELS[0];

  // User's current level (e.g. SL3 unlocked)
  const userUnlockedLevel = 3;

  // Flatten all perks up to level 10 to show in grid
  const allFlattenedPerks = SUPER_LEGEND_LEVELS.flatMap((lvl) =>
    lvl.perks.map((p) => ({
      ...p,
      levelNum: lvl.level,
      levelName: `Super Legend ${lvl.level}`,
      levelCode: `Super Legend ${lvl.level} (SL${lvl.level})`,
      isUnlocked: lvl.level <= selectedLevelNum
    }))
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-transparent pointer-events-auto cursor-default select-none" dir="rtl" onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md max-h-[85vh] h-[85vh] bg-[#0A1618]/95 backdrop-blur-xl text-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-amber-500/30 relative pointer-events-auto"
        >
          {/* Cosmic Background Effect */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-900/30 via-[#0A1618] to-slate-950 pointer-events-none" />
          <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-teal-500/10 via-amber-500/5 to-transparent pointer-events-none" />

          {/* Top Header */}
          <div className="relative z-10 px-4 pt-4 pb-2 flex items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="p-1.5 text-slate-300 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              <h2 className="text-lg font-black tracking-wide text-amber-100 flex items-center gap-1.5">
                <span>سوبر ليجند</span>
                <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button className="p-1.5 text-amber-400 hover:text-amber-300 transition-colors cursor-pointer">
                <Trophy className="w-5 h-5 fill-amber-400/20" />
              </button>
              <button className="p-1.5 text-slate-300 hover:text-white transition-colors cursor-pointer">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Levels Horizontal Selector (1 to 10 ONLY) */}
          <div className="relative z-10 py-3 px-2 flex items-center gap-3 overflow-x-auto no-scrollbar border-b border-white/5 bg-black/20">
            {SUPER_LEGEND_LEVELS.map((lvl) => {
              const isSelected = selectedLevelNum === lvl.level;
              return (
                <button
                  key={lvl.level}
                  onClick={() => setSelectedLevelNum(lvl.level)}
                  className={`shrink-0 px-3 py-1 flex flex-col items-center relative transition-all cursor-pointer ${
                    isSelected ? 'text-amber-300 font-black scale-105' : 'text-slate-400 font-semibold hover:text-slate-200'
                  }`}
                >
                  <span className="text-xs sm:text-sm whitespace-nowrap">Super Legend {lvl.level}</span>
                  {isSelected && (
                    <motion.div
                      layoutId="superLegendLevelTab"
                      className="w-6 h-0.5 bg-amber-400 rounded-full mt-1 shadow-[0_0_8px_#f59e0b]"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Badge Emblem Hero Showcase */}
          <div className="relative z-10 py-4 px-4 flex flex-col items-center justify-center border-b border-white/5 bg-gradient-to-b from-teal-950/20 to-transparent">
            {/* Crest Badge Circle */}
            <motion.div
              key={currentLevelObj.level}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="w-20 h-20 rounded-2xl bg-gradient-to-b from-amber-500/20 via-amber-400/10 to-teal-900/30 border-2 border-amber-400/50 flex items-center justify-center text-4xl shadow-xl shadow-amber-500/10 relative my-1"
            >
              <span className="drop-shadow-md">{currentLevelObj.badgeIcon}</span>
              <span className="absolute -bottom-2 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full border border-white/80 shadow-md">
                SL {currentLevelObj.level}
              </span>
            </motion.div>

            <h3 className="text-xl font-black text-amber-200 mt-2 font-serif tracking-wide">
              {currentLevelObj.name}
            </h3>

            <p className="text-xs text-slate-400 mt-0.5 font-medium flex items-center gap-1">
              {currentLevelObj.level <= userUnlockedLevel ? (
                <span className="text-emerald-400 font-bold">مفتوح (تم الفتح حتى Super Legend {userUnlockedLevel})</span>
              ) : (
                <span className="text-slate-400 flex items-center gap-1">
                  <span>مغلق</span>
                  <Lock className="w-3 h-3 text-slate-400" />
                </span>
              )}
            </p>

            {/* Perks Count Label */}
            <div className="mt-3 text-xs text-amber-300/80 font-bold tracking-wider flex items-center gap-1">
              <span>امتيازاتي</span>
              <span className="text-slate-400 font-mono">({allFlattenedPerks.filter(p => p.levelNum <= selectedLevelNum).length}/{allFlattenedPerks.length})</span>
            </div>
          </div>

          {/* Grid of Perks */}
          <div className="relative z-10 flex-1 overflow-y-auto p-4 custom-scrollbar">
            <div className="grid grid-cols-3 gap-3">
              {allFlattenedPerks.map((perk, idx) => {
                const isUnlockedForSelected = perk.levelNum <= selectedLevelNum;
                return (
                  <div
                    key={`${perk.levelNum}_${perk.id}_${idx}`}
                    className={`relative rounded-2xl p-3 border flex flex-col items-center text-center transition-all ${
                      isUnlockedForSelected
                        ? 'bg-gradient-to-b from-[#18292B] to-[#111E20] border-amber-500/30 shadow-md'
                        : 'bg-[#111A1C] border-white/5 opacity-60'
                    }`}
                  >
                    {/* Icon Box */}
                    <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-2 shadow-inner relative ${
                      isUnlockedForSelected
                        ? 'bg-gradient-to-b from-[#2A3F42] to-[#182729] border-amber-400/40'
                        : 'bg-[#1A2527] border-white/10'
                    }`}>
                      {getPerkIcon(perk.title)}
                    </div>

                    {/* Title */}
                    <span className="text-[11px] font-bold text-slate-200 line-clamp-2 leading-tight min-h-[28px] flex items-center justify-center">
                      {perk.title}
                    </span>

                    {/* Level Tag & Lock */}
                    <div className="mt-2 flex items-center gap-1 text-[10px] font-mono text-slate-400">
                      <span>{perk.levelCode}</span>
                      {!isUnlockedForSelected && <Lock className="w-3 h-3 text-slate-400" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Footer Action Bar */}
          <div className="relative z-20 p-4 bg-[#0A1214] border-t border-amber-500/20 flex items-center justify-between gap-3 shadow-2xl">
            {/* Recharge Button */}
            <button
              onClick={() => {
                if (onOpenRecharge) {
                  onClose();
                  onOpenRecharge();
                }
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-slate-950 font-black text-xs shadow-lg hover:brightness-105 active:scale-95 transition-all shrink-0 cursor-pointer"
            >
              إعادة الشحن
            </button>

            {/* EXP Progress Info */}
            <div className="flex-1 space-y-1 text-right">
              <div className="flex items-center justify-between text-xs font-black text-amber-200">
                <span>0/240</span>
                <span>النقاط خبرة السوبر ليجند</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden border border-white/10">
                <div className="h-full w-0 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full" />
              </div>

              <div className="text-[9px] text-slate-400 truncate">
                أكمل مهمة الاحتفاظ لهذا الشهر للحفاظ على مستواك الحالي: <span className="text-amber-300 font-bold">Super Legend 3</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

