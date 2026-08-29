import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Crown, 
  Sparkles, 
  Shield, 
  ChevronRight, 
  ChevronLeft, 
  Users, 
  Radio, 
  CheckCircle2, 
  Award, 
  Flame,
  ArrowUpRight
} from 'lucide-react';
import { CASTLE_TIERS, CastleEmblem, getCastleTierByLevel } from './CastleEmblem';

interface CastleEvolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFamilyLevel: number;
  currentExp: number;
  nextLevelExp: number;
}

export const CastleEvolutionModal: React.FC<CastleEvolutionModalProps> = ({
  isOpen,
  onClose,
  currentFamilyLevel = 12,
  currentExp = 78500,
  nextLevelExp = 100000
}) => {
  const currentTier = getCastleTierByLevel(currentFamilyLevel);
  const [selectedTierIndex, setSelectedTierIndex] = useState<number>(() => {
    return Math.max(0, currentTier.tier - 1);
  });

  if (!isOpen) return null;

  const selectedTier = CASTLE_TIERS[selectedTierIndex];
  const progressPercent = Math.min(100, Math.round((currentExp / nextLevelExp) * 100));

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 pointer-events-auto select-none"
        dir="rtl"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg bg-gradient-to-b from-[#FFFDF9] via-[#FAF6ED] to-[#F3EBD8] border-2 border-[#EAD39B] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header Bar */}
          <div className="bg-gradient-to-r from-[#755013] via-[#A8792A] to-[#755013] px-5 py-3.5 flex items-center justify-between text-white shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center">
                <Crown className="w-4 h-4 text-amber-200 fill-amber-200" />
              </div>
              <div>
                <h3 className="font-black text-sm text-white">نظام تطور قلعة العائلة الملكية</h3>
                <p className="text-[10px] text-amber-200 font-medium">كلما ارتفع مستوى العائلة، كَبُرَت القلعة وازدادت هيبتها</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-5 overflow-y-auto no-scrollbar space-y-5">
            {/* Current Level Status Card */}
            <div className="bg-white/90 border border-[#DFC386]/60 rounded-2xl p-4 shadow-[0_4px_16px_rgba(180,140,60,0.12)] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <CastleEmblem level={currentFamilyLevel} size="md" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-[#5C3F13]">مستوى قلعة عائلتك الحالي:</span>
                    <span className="bg-gradient-to-r from-[#B38022] to-[#5C3F13] text-white font-mono font-black text-[10px] px-2 py-0.5 rounded-full">
                      Lv.{currentFamilyLevel}
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-[#755013] mt-0.5">{currentTier.name}</h4>
                  <span className="text-[10px] text-[#A89478] font-bold">الرتبة {currentTier.tier} من 5</span>
                </div>
              </div>

              {/* EXP Progress */}
              <div className="text-left w-32 shrink-0">
                <div className="text-[10px] font-bold text-[#5C3F13] flex items-center justify-between mb-1">
                  <span>خبرة القلعة</span>
                  <span className="font-mono text-[#B38022]">{progressPercent}%</span>
                </div>
                <div className="w-full bg-[#EADCC2] h-2 rounded-full overflow-hidden p-0.5">
                  <div 
                    className="h-full bg-gradient-to-r from-[#D9A036] to-[#755013] rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="text-[9px] font-mono text-[#8C7355] block mt-0.5 text-center">
                  {currentExp.toLocaleString()} / {nextLevelExp.toLocaleString()} EXP
                </span>
              </div>
            </div>

            {/* Castle Tier Selector Tabs */}
            <div className="flex items-center gap-1.5 bg-[#EDE2CE] p-1.5 rounded-2xl overflow-x-auto no-scrollbar border border-[#DFC386]/50">
              {CASTLE_TIERS.map((tier, idx) => {
                const isSelected = selectedTierIndex === idx;
                const isUnlocked = currentFamilyLevel >= tier.minLevel;
                return (
                  <button
                    key={tier.tier}
                    onClick={() => setSelectedTierIndex(idx)}
                    className={`flex-1 min-w-[72px] py-2 px-1 rounded-xl text-center flex flex-col items-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-b from-[#755013] to-[#4D3208] text-white shadow-md scale-102 font-black'
                        : isUnlocked
                        ? 'bg-white/70 hover:bg-white text-[#5C3F13] font-bold'
                        : 'bg-white/30 text-[#A89478] font-medium opacity-75'
                    }`}
                  >
                    <span className="text-[9px] font-mono tracking-wider opacity-80">{tier.levelRange}</span>
                    <span className="text-[11px] truncate w-full mt-0.5">{tier.name.split(' ')[0]}</span>
                    {isUnlocked && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Selected Castle Stage Showcase */}
            <div className="relative bg-gradient-to-b from-white to-[#FAF4E6] border-2 border-[#DFC386] rounded-3xl p-6 shadow-[0_6px_24px_rgba(180,140,60,0.15)] flex flex-col items-center text-center overflow-hidden">
              {/* Background Castle Crest Watermark */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-400/10 via-transparent to-transparent pointer-events-none" />

              {/* Tier Badge */}
              <div className="bg-gradient-to-r from-[#B38022] via-[#DFC386] to-[#755013] text-white font-black text-xs px-4 py-1 rounded-full shadow-sm flex items-center gap-1.5 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-amber-200 fill-amber-200" />
                <span>رتبة القلعة {selectedTier.tier}: {selectedTier.name} ({selectedTier.levelRange})</span>
              </div>

              {/* Large Dynamic 3D Castle Visualizer */}
              <div className="my-3 relative">
                <CastleEmblem level={selectedTier.minLevel} size="xl" />
              </div>

              {/* Description */}
              <p className="text-xs text-[#5C3F13] font-semibold max-w-sm mt-2 leading-relaxed">
                {selectedTier.description}
              </p>

              {/* Stats & Unlocks Grid */}
              <div className="w-full grid grid-cols-2 gap-2.5 mt-5">
                <div className="bg-white/80 border border-[#E8DFC8] rounded-xl p-2.5 text-center shadow-xs">
                  <div className="text-[10px] text-[#8C7355] font-bold flex items-center justify-center gap-1">
                    <Users className="w-3 h-3 text-[#B38022]" />
                    <span>الحد الأقصى للأعضاء</span>
                  </div>
                  <div className="text-sm font-black text-[#5C3F13] mt-0.5 font-mono">
                    {selectedTier.maxMembers} عضو
                  </div>
                </div>

                <div className="bg-white/80 border border-[#E8DFC8] rounded-xl p-2.5 text-center shadow-xs">
                  <div className="text-[10px] text-[#8C7355] font-bold flex items-center justify-center gap-1">
                    <Radio className="w-3 h-3 text-[#B38022]" />
                    <span>الغرف العائلية المسموحة</span>
                  </div>
                  <div className="text-sm font-black text-[#5C3F13] mt-0.5 font-mono">
                    {selectedTier.maxRooms} غرف نشطة
                  </div>
                </div>
              </div>

              {/* Unlocked Perks List */}
              <div className="w-full mt-4 bg-[#F8F1E1] border border-[#DFC386]/60 rounded-2xl p-3 text-right">
                <h5 className="text-[11px] font-black text-[#5C3F13] mb-2 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-[#B38022]" />
                  <span>المزايا والخصائص المفتوحة في هذا المستوى:</span>
                </h5>
                <div className="space-y-1.5">
                  {selectedTier.buffs.map((buff, i) => (
                    <div key={i} className="flex items-center gap-2 text-[11px] text-[#5C3F13] font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{buff}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* How to level up the Castle Tips */}
            <div className="bg-[#FAF5E8] border border-[#E8DFC8] rounded-2xl p-3.5 flex items-center gap-3 text-xs text-[#5C3F13]">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#755013] to-[#B38022] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Flame className="w-5 h-5 text-amber-200 fill-amber-200" />
              </div>
              <div className="flex-1">
                <span className="font-black block text-[#755013]">كيف تطور قلعة العائلة؟</span>
                <span className="text-[10px] text-[#8C7355] font-medium leading-relaxed block mt-0.5">
                  تفاعل الأعضاء، إرسال الهدايا، وفتح الرومات الصوتية يمنح العائلة نقاط خبرة EXP ترفع من رتبة ومبنى القلعة تلقائياً.
                </span>
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="p-4 bg-[#EDE2CE] border-t border-[#DFC386]/60 flex items-center justify-between gap-3">
            <button
              onClick={onClose}
              className="w-full py-3 bg-gradient-to-r from-[#755013] via-[#A8792A] to-[#755013] hover:opacity-95 text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>إغلاق</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
