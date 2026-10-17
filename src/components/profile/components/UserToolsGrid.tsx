import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft } from 'lucide-react';
import { RoyalThemeStyles } from '../ProfileThemeConfig';
import {
  VipCenter3DIcon,
  Genius3DIcon,
  FriendlyPoints3DIcon,
  InviteCenter3DIcon,
  InviteCard3DIcon,
  Mall3DIcon
} from '../RealisticIcons';

export interface GameItem {
  id: string;
  title: string;
  bg: string;
  emoji: string;
}

export interface UserToolsGridProps {
  curRoyal: RoyalThemeStyles;
  gamesList: GameItem[];
  onOpenGamesTab: () => void;
  onOpenVipCenter: () => void;
  onOpenGenius: () => void;
  onOpenFriendlyPoints: () => void;
  onOpenInviteCenter: () => void;
  onOpenInviteCard: () => void;
  onOpenMall: () => void;
}

export const UserToolsGrid: React.FC<UserToolsGridProps> = ({
  curRoyal,
  gamesList,
  onOpenGamesTab,
  onOpenVipCenter,
  onOpenGenius,
  onOpenFriendlyPoints,
  onOpenInviteCenter,
  onOpenInviteCard,
  onOpenMall
}) => {
  return (
    <div className="space-y-3.5" dir="rtl">
      {/* Mini Games Strip */}
      <div className={`relative p-[2px] rounded-2xl ${curRoyal.outerBorder} ${curRoyal.shadow} transition-all duration-300`}>
        <div className={`${curRoyal.innerBg} rounded-[14px] p-2.5 sm:p-3 flex items-center gap-2 border ${curRoyal.innerBorder} transition-all duration-300`}>
          <ChevronLeft className={`w-4 h-4 ${curRoyal.chevron} shrink-0`} />
          <div className="flex items-center gap-3 flex-1 overflow-x-auto no-scrollbar py-1">
            {gamesList.map((game) => (
              <div
                key={game.id}
                onClick={onOpenGamesTab}
                className="shrink-0 w-16 text-center cursor-pointer group"
              >
                <div className={`relative w-14 h-14 mx-auto rounded-2xl ${curRoyal.plinthBg} flex items-center justify-center text-2xl group-hover:scale-105 transition-all`}>
                  {game.emoji}
                </div>
                <span className={`text-[10px] font-black ${curRoyal.titleText} block mt-1.5 truncate text-center transition-colors`}>
                  {game.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* شبكة الخدمات الملكية المخصصة (واحد يمين وواحد شمال) */}
      <div className="grid grid-cols-2 gap-x-2.5 gap-y-3.5 pt-1.5 pb-1.5" dir="rtl">
        {/* الصف 1 يمين: مركز VIP */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={onOpenVipCenter}
          className={`relative p-[2px] rounded-2xl ${curRoyal.outerBorder} ${curRoyal.shadow} active:scale-95 transition-all duration-300 cursor-pointer group text-right w-full`}
        >
          <div className="absolute -top-2.5 right-4 z-20">
            <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[9px] font-black ${curRoyal.pillBadge} border font-mono tracking-wider transition-all duration-300`}>
              VIP 8
            </span>
          </div>
          <div className={`${curRoyal.innerBg} rounded-[14px] p-2.5 sm:p-3 flex items-center justify-between border ${curRoyal.innerBorder} group-hover:bg-white/90 transition-all duration-300 w-full h-full`}>
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className={`relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl ${curRoyal.plinthBg} flex items-center justify-center shrink-0`}>
                <VipCenter3DIcon className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className={`text-xs font-black ${curRoyal.titleText} transition-colors truncate`}>
                  مركز VIP
                </h4>
                <span className={`text-[9.5px] sm:text-[10px] ${curRoyal.subText} font-bold block mt-0.5 truncate`}>
                  المزايا والامتيازات
                </span>
              </div>
            </div>
            <ChevronLeft className={`w-4 h-4 ${curRoyal.chevron} transition-transform group-hover:-translate-x-0.5 shrink-0 mr-0.5`} />
          </div>
        </motion.button>

        {/* الصف 1 شمال: جينيس */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={onOpenGenius}
          className={`relative p-[2px] rounded-2xl ${curRoyal.outerBorder} ${curRoyal.shadow} active:scale-95 transition-all duration-300 cursor-pointer group text-right w-full`}
        >
          <div className="absolute -top-2.5 right-4 z-20">
            <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[9px] font-black ${curRoyal.pillBadge} border font-sans tracking-wide transition-all duration-300`}>
              Genius
            </span>
          </div>
          <div className={`${curRoyal.innerBg} rounded-[14px] p-2.5 sm:p-3 flex items-center justify-between border ${curRoyal.innerBorder} group-hover:bg-white/90 transition-all duration-300 w-full h-full`}>
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className={`relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl ${curRoyal.plinthBg} flex items-center justify-center shrink-0`}>
                <Genius3DIcon className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className={`text-xs font-black ${curRoyal.titleText} transition-colors truncate`}>
                  جينيس
                </h4>
                <span className={`text-[9.5px] sm:text-[10px] ${curRoyal.subText} font-bold block mt-0.5 truncate`}>
                  الأرقام القياسية
                </span>
              </div>
            </div>
            <ChevronLeft className={`w-4 h-4 ${curRoyal.chevron} transition-transform group-hover:-translate-x-0.5 shrink-0 mr-0.5`} />
          </div>
        </motion.button>

        {/* الصف 2 يمين: نقاط ودية */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={onOpenFriendlyPoints}
          className={`relative p-[2px] rounded-2xl ${curRoyal.outerBorder} ${curRoyal.shadow} active:scale-95 transition-all duration-300 cursor-pointer group text-right w-full`}
        >
          <div className="absolute -top-2.5 right-4 z-20">
            <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[9px] font-black ${curRoyal.pillBadge} border font-mono tracking-wider transition-all duration-300`}>
              2963
            </span>
          </div>
          <div className={`${curRoyal.innerBg} rounded-[14px] p-2.5 sm:p-3 flex items-center justify-between border ${curRoyal.innerBorder} group-hover:bg-white/90 transition-all duration-300 w-full h-full`}>
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className={`relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl ${curRoyal.plinthBg} flex items-center justify-center shrink-0`}>
                <FriendlyPoints3DIcon className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className={`text-xs font-black ${curRoyal.titleText} transition-colors truncate`}>
                  نقاط ودية
                </h4>
                <span className={`text-[9.5px] sm:text-[10px] ${curRoyal.subText} font-bold block mt-0.5 truncate`}>
                  رصيد التفاعل
                </span>
              </div>
            </div>
            <ChevronLeft className={`w-4 h-4 ${curRoyal.chevron} transition-transform group-hover:-translate-x-0.5 shrink-0 mr-0.5`} />
          </div>
        </motion.button>

        {/* الصف 2 شمال: مركز الدعوة */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={onOpenInviteCenter}
          className={`relative p-[2px] rounded-2xl ${curRoyal.outerBorder} ${curRoyal.shadow} active:scale-95 transition-all duration-300 cursor-pointer group text-right w-full`}
        >
          <div className="absolute -top-2.5 right-4 z-20">
            <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[9px] font-black ${curRoyal.pillBadge} border font-sans tracking-wide transition-all duration-300`}>
              ادع واربح
            </span>
          </div>
          <div className={`${curRoyal.innerBg} rounded-[14px] p-2.5 sm:p-3 flex items-center justify-between border ${curRoyal.innerBorder} group-hover:bg-white/90 transition-all duration-300 w-full h-full`}>
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className={`relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl ${curRoyal.plinthBg} flex items-center justify-center shrink-0`}>
                <InviteCenter3DIcon className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className={`text-xs font-black ${curRoyal.titleText} transition-colors truncate`}>
                  مركز الدعوة
                </h4>
                <span className={`text-[9.5px] sm:text-[10px] ${curRoyal.subText} font-bold block mt-0.5 truncate`}>
                  مكافآت الانضمام
                </span>
              </div>
            </div>
            <ChevronLeft className={`w-4 h-4 ${curRoyal.chevron} transition-transform group-hover:-translate-x-0.5 shrink-0 mr-0.5`} />
          </div>
        </motion.button>

        {/* الصف 3 يمين: بطاقة الدعوة */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={onOpenInviteCard}
          className={`relative p-[2px] rounded-2xl ${curRoyal.outerBorder} ${curRoyal.shadow} active:scale-95 transition-all duration-300 cursor-pointer group text-right w-full`}
        >
          <div className="absolute -top-2.5 right-4 z-20">
            <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[9px] font-black ${curRoyal.pillBadge} border font-sans tracking-wide transition-all duration-300`}>
              مشاركة
            </span>
          </div>
          <div className={`${curRoyal.innerBg} rounded-[14px] p-2.5 sm:p-3 flex items-center justify-between border ${curRoyal.innerBorder} group-hover:bg-white/90 transition-all duration-300 w-full h-full`}>
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className={`relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl ${curRoyal.plinthBg} flex items-center justify-center shrink-0`}>
                <InviteCard3DIcon className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className={`text-xs font-black ${curRoyal.titleText} transition-colors truncate`}>
                  بطاقة الدعوة
                </h4>
                <span className={`text-[9.5px] sm:text-[10px] ${curRoyal.subText} font-bold block mt-0.5 truncate`}>
                  كود الدعوة الملكي
                </span>
              </div>
            </div>
            <ChevronLeft className={`w-4 h-4 ${curRoyal.chevron} transition-transform group-hover:-translate-x-0.5 shrink-0 mr-0.5`} />
          </div>
        </motion.button>

        {/* الصف 3 شمال: المركز التجاري */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={onOpenMall}
          className={`relative p-[2px] rounded-2xl ${curRoyal.outerBorder} ${curRoyal.shadow} active:scale-95 transition-all duration-300 cursor-pointer group text-right w-full`}
        >
          <div className="absolute -top-2.5 right-4 z-20">
            <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[9px] font-black ${curRoyal.pillBadge} border font-sans tracking-wide transition-all duration-300`}>
              المتجر
            </span>
          </div>
          <div className={`${curRoyal.innerBg} rounded-[14px] p-2.5 sm:p-3 flex items-center justify-between border ${curRoyal.innerBorder} group-hover:bg-white/90 transition-all duration-300 w-full h-full`}>
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className={`relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl ${curRoyal.plinthBg} flex items-center justify-center shrink-0`}>
                <Mall3DIcon className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className={`text-xs font-black ${curRoyal.titleText} transition-colors truncate`}>
                  المركز التجاري
                </h4>
                <span className={`text-[9.5px] sm:text-[10px] ${curRoyal.subText} font-bold block mt-0.5 truncate`}>
                  الهدايا والعناصر
                </span>
              </div>
            </div>
            <ChevronLeft className={`w-4 h-4 ${curRoyal.chevron} transition-transform group-hover:-translate-x-0.5 shrink-0 mr-0.5`} />
          </div>
        </motion.button>
      </div>
    </div>
  );
};

export default UserToolsGrid;
