import React from 'react';
import { motion } from 'motion/react';
import { StatItem } from '../../types';
import { Visitors3DIcon, Friends3DIcon, Following3DIcon, Likes3DIcon } from './RealisticIcons';
import { RoyalThemeStyles } from './ProfileThemeConfig';

interface ProfileStatsProps {
  stats: {
    visitors: number;
    friends: number;
    followers: number;
    likes: number;
  };
  curRoyal: RoyalThemeStyles;
  onOpenStatModal: (stat: StatItem['id']) => void;
}

export const ProfileStats: React.FC<ProfileStatsProps> = ({
  stats,
  curRoyal,
  onOpenStatModal
}) => {
  return (
    <div className="grid grid-cols-4 gap-2 text-center mt-5 mb-2 px-1" dir="rtl">
      {/* 1. Visitors / الزوار */}
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onOpenStatModal('visitors')}
        className={`relative p-[1.5px] rounded-2xl ${curRoyal.outerBorder} ${curRoyal.shadow} transition-all duration-300 cursor-pointer group`}
      >
        <div className={`${curRoyal.innerBg} rounded-[14.5px] p-2 sm:p-2.5 flex flex-col items-center justify-center border ${curRoyal.innerBorder} h-full transition-all duration-300`}>
          <div className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${curRoyal.plinthBg} flex items-center justify-center mb-1 group-hover:scale-105 transition-all shrink-0`}>
            <Visitors3DIcon className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div className={`text-sm sm:text-base font-black ${curRoyal.titleText} font-mono leading-tight tracking-tight drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]`}>
            {stats.visitors.toLocaleString('en-US')}
          </div>
          <div className={`text-[10px] sm:text-[11px] ${curRoyal.subText} font-black mt-0.5 whitespace-nowrap transition-colors`}>
            الزوار
          </div>
        </div>
      </motion.div>

      {/* 2. Friends / الأصدقاء */}
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onOpenStatModal('friends')}
        className={`relative p-[1.5px] rounded-2xl ${curRoyal.outerBorder} ${curRoyal.shadow} transition-all duration-300 cursor-pointer group`}
      >
        <div className={`${curRoyal.innerBg} rounded-[14.5px] p-2 sm:p-2.5 flex flex-col items-center justify-center border ${curRoyal.innerBorder} h-full transition-all duration-300`}>
          <div className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${curRoyal.plinthBg} flex items-center justify-center mb-1 group-hover:scale-105 transition-all shrink-0`}>
            <Friends3DIcon className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div className={`text-sm sm:text-base font-black ${curRoyal.titleText} font-mono leading-tight tracking-tight drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]`}>
            {stats.friends.toLocaleString('en-US')}
          </div>
          <div className={`text-[10px] sm:text-[11px] ${curRoyal.subText} font-black mt-0.5 whitespace-nowrap transition-colors`}>
            الأصدقاء
          </div>
        </div>
      </motion.div>

      {/* 3. Following / تمت متابعتهم */}
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onOpenStatModal('following')}
        className={`relative p-[1.5px] rounded-2xl ${curRoyal.outerBorder} ${curRoyal.shadow} transition-all duration-300 cursor-pointer group`}
      >
        <div className={`${curRoyal.innerBg} rounded-[14.5px] p-2 sm:p-2.5 flex flex-col items-center justify-center border ${curRoyal.innerBorder} h-full transition-all duration-300`}>
          <div className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${curRoyal.plinthBg} flex items-center justify-center mb-1 group-hover:scale-105 transition-all shrink-0`}>
            <Following3DIcon className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div className={`text-sm sm:text-base font-black ${curRoyal.titleText} font-mono leading-tight tracking-tight drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]`}>
            {stats.followers.toLocaleString('en-US')}
          </div>
          <div className={`text-[10px] sm:text-[11px] ${curRoyal.subText} font-black mt-0.5 whitespace-nowrap transition-colors`}>
            تمت متابعتهم
          </div>
        </div>
      </motion.div>

      {/* 4. Likes / المعجبين */}
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onOpenStatModal('likes')}
        className={`relative p-[1.5px] rounded-2xl ${curRoyal.outerBorder} ${curRoyal.shadow} transition-all duration-300 cursor-pointer group`}
      >
        <div className={`${curRoyal.innerBg} rounded-[14.5px] p-2 sm:p-2.5 flex flex-col items-center justify-center border ${curRoyal.innerBorder} h-full transition-all duration-300`}>
          <div className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${curRoyal.plinthBg} flex items-center justify-center mb-1 group-hover:scale-105 transition-all shrink-0`}>
            <Likes3DIcon className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div className={`text-sm sm:text-base font-black ${curRoyal.titleText} font-mono leading-tight tracking-tight drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]`}>
            {stats.likes.toLocaleString('en-US')}
          </div>
          <div className={`text-[10px] sm:text-[11px] ${curRoyal.subText} font-black mt-0.5 whitespace-nowrap transition-colors`}>
            المعجبين
          </div>
        </div>
      </motion.div>
    </div>
  );
};
