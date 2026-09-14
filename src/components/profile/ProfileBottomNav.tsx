import React from 'react';
import { Home, Compass, Star, MessageSquare, User } from 'lucide-react';

export type NavTab = 'home' | 'explore' | 'games' | 'messages' | 'profile';

interface ProfileBottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const ProfileBottomNav: React.FC<ProfileBottomNavProps> = ({
  activeTab,
  onTabChange
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-4 py-2 flex items-center justify-around z-40 max-w-md mx-auto shadow-lg" dir="rtl">
      {/* 1. Far Right: Home / الرئيسية */}
      <button
        onClick={() => onTabChange('home')}
        className={`flex flex-col items-center gap-0.5 cursor-pointer transition-all ${
          activeTab === 'home' ? 'text-slate-950 font-black' : 'text-slate-400 hover:text-slate-700 font-medium'
        }`}
      >
        <div className="p-1 transition-all">
          <Home className={`w-6 h-6 ${activeTab === 'home' ? 'fill-slate-950 text-slate-950' : ''}`} />
        </div>
        <span className="text-[10px] leading-none">الرئيسية</span>
      </button>

      {/* 2. 2nd from Right: Explore / استكشاف */}
      <button
        onClick={() => onTabChange('explore')}
        className={`flex flex-col items-center gap-0.5 cursor-pointer transition-all ${
          activeTab === 'explore' ? 'text-slate-950 font-black' : 'text-slate-400 hover:text-slate-700 font-medium'
        }`}
      >
        <div className="p-1 transition-all">
          <Compass className={`w-6 h-6 ${activeTab === 'explore' ? 'text-slate-950 stroke-[2.5]' : ''}`} />
        </div>
        <span className="text-[10px] leading-none">استكشاف</span>
      </button>

      {/* 3. 3rd from Right: Moments/Favorites / لحظات */}
      <button
        onClick={() => onTabChange('games')}
        className={`flex flex-col items-center gap-0.5 cursor-pointer transition-all ${
          activeTab === 'games' ? 'text-slate-950 font-black' : 'text-slate-400 hover:text-slate-700 font-medium'
        }`}
      >
        <div className="p-1 transition-all">
          <Star className={`w-6 h-6 ${activeTab === 'games' ? 'text-slate-950 fill-slate-950' : ''}`} />
        </div>
        <span className="text-[10px] leading-none">لحظات</span>
      </button>

      {/* 4. 4th from Right: Messages / المحادثات with Red Notification Badge */}
      <button
        onClick={() => onTabChange('messages')}
        className={`flex flex-col items-center gap-0.5 cursor-pointer transition-all relative ${
          activeTab === 'messages' ? 'text-slate-950 font-black' : 'text-slate-400 hover:text-slate-700 font-medium'
        }`}
      >
        <div className="p-1 transition-all relative">
          <MessageSquare className={`w-6 h-6 ${activeTab === 'messages' ? 'fill-slate-950 text-slate-950' : ''}`} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white font-mono text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white animate-pulse">
            3
          </span>
        </div>
        <span className="text-[10px] leading-none">المحادثات</span>
      </button>

      {/* 5. Far Left: Profile / أنا */}
      <button
        onClick={() => onTabChange('profile')}
        className={`flex flex-col items-center gap-0.5 cursor-pointer transition-all ${
          activeTab === 'profile' ? 'text-slate-950 font-black' : 'text-slate-400 hover:text-slate-700 font-medium'
        }`}
      >
        <div className="p-1 transition-all">
          <User className={`w-6 h-6 ${activeTab === 'profile' ? 'fill-slate-950 text-slate-950' : ''}`} />
        </div>
        <span className="text-[10px] leading-none">أنا</span>
      </button>
    </div>
  );
};
