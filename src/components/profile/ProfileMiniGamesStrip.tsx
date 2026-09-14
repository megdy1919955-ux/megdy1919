import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { RoyalThemeStyles } from './ProfileThemeConfig';

export interface MiniGameItem {
  id: string;
  title: string;
  bg: string;
  emoji: string;
}

interface ProfileMiniGamesStripProps {
  gamesList: MiniGameItem[];
  curRoyal: RoyalThemeStyles;
  onSelectGame: () => void;
}

export const ProfileMiniGamesStrip: React.FC<ProfileMiniGamesStripProps> = ({
  gamesList,
  curRoyal,
  onSelectGame
}) => {
  return (
    <div className={`relative p-[2px] rounded-2xl ${curRoyal.outerBorder} ${curRoyal.shadow} transition-all duration-300`}>
      {/* Dev Badge #4 */}
      <span className="absolute -top-2.5 left-2 z-50 w-6 h-6 rounded-full bg-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-lg border-2 border-white pointer-events-none select-none">
        #4
      </span>

      <div className={`${curRoyal.innerBg} rounded-[14px] p-2.5 sm:p-3 flex items-center gap-2 border ${curRoyal.innerBorder} transition-all duration-300`}>
        <ChevronLeft className={`w-4 h-4 ${curRoyal.chevron} shrink-0`} />
        <div className="flex items-center gap-3 flex-1 overflow-x-auto no-scrollbar py-1">
          {gamesList.map((game) => (
            <div
              key={game.id}
              onClick={onSelectGame}
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
  );
};
