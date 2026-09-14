import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Sparkles } from 'lucide-react';
import { UserLevel3DIcon, Badges3DIcon, Families3DIcon, Appearance3DIcon } from './RealisticIcons';
import { RoyalThemeStyles } from './ProfileThemeConfig';

interface ProfileActivitiesGridProps {
  curRoyal: RoyalThemeStyles;
  onOpenLevel: () => void;
  onOpenBadges: () => void;
  onOpenFamily: () => void;
  onOpenAppearance: () => void;
}

export const ProfileActivitiesGrid: React.FC<ProfileActivitiesGridProps> = ({
  curRoyal,
  onOpenLevel,
  onOpenBadges,
  onOpenFamily,
  onOpenAppearance
}) => {
  return (
    <div className="relative">
      {/* Dev Badge #3 */}
      <span className="absolute -top-2.5 left-2 z-50 w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shadow-lg border-2 border-white pointer-events-none select-none">
        #3
      </span>

      <div className="grid grid-cols-2 gap-2.5" dir="rtl">
      {/* Right Column Top: مستوى المستخدم */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.96 }}
        onClick={onOpenLevel}
        className={`relative p-[2px] rounded-2xl ${curRoyal.outerBorder} ${curRoyal.shadow} transition-all duration-300 cursor-pointer group text-right w-full`}
      >
        <div className={`${curRoyal.innerBg} rounded-[14px] p-2.5 sm:p-3 flex items-center justify-between border ${curRoyal.innerBorder} group-hover:bg-white/90 transition-all duration-300 h-full`}>
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`relative w-11 h-11 rounded-xl ${curRoyal.plinthBg} flex items-center justify-center shrink-0`}>
              <UserLevel3DIcon className="w-8 h-8" />
              <span className="absolute -bottom-1 -right-1 bg-gradient-to-r from-[#C89228] to-[#7E4F0B] text-[#FFF9E6] font-black text-[8px] px-1.5 py-0.2 rounded-full border border-white shadow-xs font-mono">
                113
              </span>
            </div>
            <div className="min-w-0">
              <h4 className={`text-xs font-black ${curRoyal.titleText} transition-colors truncate`}>
                مستوى المستخدم
              </h4>
              <span className={`text-[10px] ${curRoyal.subText} font-bold block truncate`}>
                المستوى 113 • 97%
              </span>
            </div>
          </div>
          <ChevronLeft className={`w-4 h-4 ${curRoyal.chevron} group-hover:-translate-x-0.5 transition-transform shrink-0 mr-0.5`} />
        </div>
      </motion.div>

      {/* Left Column Top: الشارات */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.96 }}
        onClick={onOpenBadges}
        className={`relative p-[2px] rounded-2xl ${curRoyal.outerBorder} ${curRoyal.shadow} transition-all duration-300 cursor-pointer group text-right w-full`}
      >
        <div className={`${curRoyal.innerBg} rounded-[14px] p-2.5 sm:p-3 flex items-center justify-between border ${curRoyal.innerBorder} group-hover:bg-white/90 transition-all duration-300 h-full`}>
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`relative w-11 h-11 rounded-xl ${curRoyal.plinthBg} flex items-center justify-center shrink-0`}>
              <Badges3DIcon className="w-8 h-8" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border border-white animate-pulse" />
            </div>
            <div className="min-w-0">
              <h4 className={`text-xs font-black ${curRoyal.titleText} transition-colors truncate`}>
                الشارات
              </h4>
              <span className={`text-[10px] ${curRoyal.subText} font-bold block truncate`}>
                الأوسمة والجوائز
              </span>
            </div>
          </div>
          <ChevronLeft className={`w-4 h-4 ${curRoyal.chevron} group-hover:-translate-x-0.5 transition-transform shrink-0 mr-0.5`} />
        </div>
      </motion.div>

      {/* Right Column Bottom: العائلات */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.96 }}
        onClick={onOpenFamily}
        className={`relative p-[2px] rounded-2xl ${curRoyal.outerBorder} ${curRoyal.shadow} transition-all duration-300 cursor-pointer group text-right w-full`}
      >
        <div className={`${curRoyal.innerBg} rounded-[14px] p-2.5 sm:p-3 flex items-center justify-between border ${curRoyal.innerBorder} group-hover:bg-white/90 transition-all duration-300 h-full`}>
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`relative w-11 h-11 rounded-xl ${curRoyal.plinthBg} flex items-center justify-center shrink-0`}>
              <Families3DIcon className="w-8 h-8" />
              <span className="absolute -bottom-1 -right-1 bg-gradient-to-r from-[#B38022] to-[#5C3F13] text-[#FFF9E6] font-black text-[8px] px-1.5 py-0.2 rounded-full border border-white shadow-xs font-mono">
                Lv12
              </span>
            </div>
            <div className="min-w-0">
              <h4 className={`text-xs font-black ${curRoyal.titleText} transition-colors truncate`}>
                العائلات
              </h4>
              <span className={`text-[10px] ${curRoyal.subText} font-bold block truncate`}>
                عائلة فرسان المجد
              </span>
            </div>
          </div>
          <ChevronLeft className={`w-4 h-4 ${curRoyal.chevron} group-hover:-translate-x-0.5 transition-transform shrink-0 mr-0.5`} />
        </div>
      </motion.div>

      {/* Left Column Bottom: مظهري */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.96 }}
        onClick={onOpenAppearance}
        className={`relative p-[2px] rounded-2xl ${curRoyal.outerBorder} ${curRoyal.shadow} transition-all duration-300 cursor-pointer group text-right w-full`}
      >
        <div className={`${curRoyal.innerBg} rounded-[14px] p-2.5 sm:p-3 flex items-center justify-between border ${curRoyal.innerBorder} group-hover:bg-white/90 transition-all duration-300 h-full`}>
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`relative w-11 h-11 rounded-xl ${curRoyal.plinthBg} flex items-center justify-center shrink-0`}>
              <Appearance3DIcon className="w-8 h-8" />
              <span className="absolute -top-1 -left-1 w-3.5 h-3.5 bg-gradient-to-tr from-amber-400 to-yellow-200 rounded-full border border-white flex items-center justify-center shadow-xs">
                <Sparkles className="w-2 h-2 text-[#5C3F13] fill-[#5C3F13]" />
              </span>
            </div>
            <div className="min-w-0">
              <h4 className={`text-xs font-black ${curRoyal.titleText} transition-colors truncate`}>
                مظهري
              </h4>
              <span className={`text-[10px] ${curRoyal.subText} font-bold block truncate`}>
                الإطارات والدخوليات
              </span>
            </div>
          </div>
          <ChevronLeft className={`w-4 h-4 ${curRoyal.chevron} group-hover:-translate-x-0.5 transition-transform shrink-0 mr-0.5`} />
        </div>
      </motion.div>
    </div>
  </div>
  );
};
