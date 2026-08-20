import React from 'react';
import { Home, Compass, Gamepad2, MessageSquare, User as UserIcon } from 'lucide-react';

export type TabType = 'home' | 'explore' | 'games' | 'messages' | 'profile';

interface BottomNavigationProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  unreadCount?: number;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onChangeTab,
  unreadCount = 3
}) => {
  const navItems = [
    { id: 'home' as TabType, label: 'الرئيسية', icon: Home },
    { id: 'explore' as TabType, label: 'استكشف', icon: Compass },
    { id: 'games' as TabType, label: 'الألعاب', icon: Gamepad2 },
    { id: 'messages' as TabType, label: 'الرسائل', icon: MessageSquare, badge: unreadCount },
    { id: 'profile' as TabType, label: 'حسابي', icon: UserIcon }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-2 py-2 max-w-lg mx-auto sm:max-w-full">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition relative cursor-pointer ${
                isActive
                  ? 'text-amber-400 font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-slate-900">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-1">{item.label}</span>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-0.5"></div>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
