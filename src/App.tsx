import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { BottomNavigation, TabType } from './components/BottomNavigation';
import { HomeScreen } from './components/HomeScreen';
import { ExploreScreen } from './components/ExploreScreen';
import { GamesScreen } from './components/GamesScreen';
import { MessagesScreen } from './components/MessagesScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { VoiceRoomView } from './components/VoiceRoomView';
import { RechargeModal } from './components/RechargeModal';
import { VipCenterModal } from './components/VipCenterModal';
import { CURRENT_USER, MOCK_ROOMS } from './data/mockData';
import { User, VoiceRoom } from './types';

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User>(CURRENT_USER);
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [activeRoom, setActiveRoom] = useState<VoiceRoom | null>(null);

  // Modals
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [showVipModal, setShowVipModal] = useState(false);

  const handleSuccessRecharge = (coinsAdded: number) => {
    setCurrentUser((prev) => ({
      ...prev,
      coins: prev.coins + coinsAdded
    }));
  };

  const handleCreateRoom = () => {
    // Create new room owned by current user
    const newRoom: VoiceRoom = {
      id: 'room_' + Date.now(),
      title: `👑 مجلس ${currentUser.name} الرسمي`,
      description: 'أهلاً بكم في غرفتي الصوتية، حوارات ومسابقات وسهرات طربية ممتعة.',
      host: currentUser,
      tag: 'طرب وسوالف',
      country: currentUser.country,
      countryFlag: currentUser.countryFlag,
      bgTheme: 'from-amber-950 via-slate-900 to-purple-950',
      listenersCount: 1,
      hotScore: 5000,
      isPrivate: false,
      announcement: '📢 مرحباً بجميع الأصدقاء والزوار الكرام في غرفتنا الصوتية!',
      luckyChest: {
        active: true,
        poolCoins: 3000,
        remainingSeconds: 60,
        totalContributors: 5
      },
      pkBattle: {
        active: false,
        blueTeam: { host: currentUser, score: 0, supporters: 0 },
        redTeam: { host: currentUser, score: 0, supporters: 0 },
        remainingSeconds: 0
      }
    };
    setActiveRoom(newRoom);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Cairo',sans-serif]">
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        onOpenRecharge={() => setShowRechargeModal(true)}
        onOpenVip={() => setShowVipModal(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomeScreen
            currentUser={currentUser}
            onSelectRoom={(room) => setActiveRoom(room)}
            onCreateRoom={handleCreateRoom}
          />
        )}
        {activeTab === 'explore' && (
          <ExploreScreen
            currentUser={currentUser}
            onOpenRecharge={() => setShowRechargeModal(true)}
          />
        )}
        {activeTab === 'games' && (
          <GamesScreen
            currentUser={currentUser}
            onOpenRecharge={() => setShowRechargeModal(true)}
          />
        )}
        {activeTab === 'messages' && <MessagesScreen />}
        {activeTab === 'profile' && (
          <ProfileScreen
            currentUser={currentUser}
            onOpenRecharge={() => setShowRechargeModal(true)}
            onOpenVip={() => setShowVipModal(true)}
          />
        )}
      </main>

      {/* Bottom Tab Bar */}
      <BottomNavigation
        activeTab={activeTab}
        onChangeTab={(tab) => setActiveTab(tab)}
      />

      {/* Voice Room View Modal (When user joins or creates a room) */}
      {activeRoom && (
        <VoiceRoomView
          room={activeRoom}
          currentUser={currentUser}
          onClose={() => setActiveRoom(null)}
          onOpenRecharge={() => setShowRechargeModal(true)}
        />
      )}

      {/* Recharge Modal */}
      {showRechargeModal && (
        <RechargeModal
          currentUser={currentUser}
          onClose={() => setShowRechargeModal(false)}
          onSuccessRecharge={handleSuccessRecharge}
        />
      )}

      {/* VIP Center Modal */}
      {showVipModal && (
        <VipCenterModal
          currentUser={currentUser}
          onClose={() => setShowVipModal(false)}
          onOpenRecharge={() => setShowRechargeModal(true)}
        />
      )}
    </div>
  );
};

export default App;
