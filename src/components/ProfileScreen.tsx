import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Copy,
  Check,
  Pencil,
  Settings,
  Headphones,
  ChevronLeft,
  Crown,
  ShoppingBag,
  Award,
  Star,
  Shield,
  Coins,
  Gem,
  Megaphone,
  BarChart2,
  ThumbsUp,
  Home,
  Compass,
  MessageSquare,
  User,
  Sparkles,
  Rocket,
  Ticket,
  Mic,
  Store,
  Gamepad2,
  Globe,
  Eye,
  Users,
  UserCheck,
  Heart,
  Sun,
  Moon,
  Palette
} from 'lucide-react';
import { UserProfileData, StatItem, BadgeInfo } from '../types';
import { INITIAL_USER_PROFILE, MOCK_VISITORS, MOCK_FRIENDS, MOCK_FOLLOWERS, MOCK_LIKES } from '../data/mockData';
import { RoyalThemeMode, ROYAL_THEMES } from './profile/ProfileThemeConfig';
import { ProfileHeader } from './profile/ProfileHeader';
import { ProfileStats } from './profile/ProfileStats';
import { ProfileWalletRow } from './profile/ProfileWalletRow';
import { ProfileActivitiesGrid } from './profile/ProfileActivitiesGrid';
import { ProfileMiniGamesStrip } from './profile/ProfileMiniGamesStrip';
import { ProfileServicesList } from './profile/ProfileServicesList';
import { ProfileBottomNav } from './profile/ProfileBottomNav';
import { StatDetailModal } from './StatDetailModal';
import { BadgeDetailModal } from './BadgeDetailModal';
import { EditProfileModal } from './EditProfileModal';
import { UserLevelModal } from './UserLevelModal';
import { FamilyModal } from './FamilyModal';
import { BadgesCenterModal } from './BadgesCenterModal';
import { AppearanceModal } from './AppearanceModal';
import { ServicesModal, ServiceType } from './ServicesModal';
import {
  UserLevel3DIcon,
  Badges3DIcon,
  Families3DIcon,
  Appearance3DIcon,
  VipCenter3DIcon,
  Genius3DIcon,
  FriendlyPoints3DIcon,
  InviteCenter3DIcon,
  InviteCard3DIcon,
  Mall3DIcon,
  Visitors3DIcon,
  Friends3DIcon,
  Following3DIcon,
  Likes3DIcon,
  OfficialAgency3DIcon,
  AgencyAdmin3DIcon,
  ThemeAdmin3DIcon,
  Broker3DIcon,
  Moderator3DIcon,
  TCoin3DIcon,
  Diamond3DIcon,
  BroadcasterCenter3DIcon,
  RechargeAgency3DIcon
} from './profile/RealisticIcons';
import { RechargeAgencyModal } from './RechargeAgencyModal';
import { RechargeModal } from './RechargeModal';
import { SuperLegendModal } from './SuperLegendModal';
import { SettingsModal } from './SettingsModal';
import { NajmLogo } from './common/NajmLogo';
import { CustomerServiceModal } from './CustomerServiceModal';
import { UserProfileModal } from './UserProfileModal';
import { VipCenterModal } from './VipCenterModal';
import { AgencyModal } from './AgencyModal';
import { BrokerCenterModal } from './BrokerCenterModal';
import { SuperAdminControlModal } from './SuperAdminControlModal';
import { AgencyAdminDashboardModal } from './AgencyAdminDashboardModal';
import { ThemeAdminDashboardModal } from './ThemeAdminDashboardModal';
import { StoreAndThemeAdminModal } from './StoreAndThemeAdminModal';
import { OfficialAgencyManagerModal } from './OfficialAgencyManagerModal';
import { AgencyRepresentativeModal } from './AgencyRepresentativeModal';
import { ModeratorDashboardModal } from './ModeratorDashboardModal';
import { BroadcasterCenterModal } from './BroadcasterCenterModal';
import { GeniusNajmModal } from './GeniusNajmModal';
import { FriendlyPointsModal } from './FriendlyPointsModal';
import { MallCenterModal } from './MallCenterModal';
import { HomeScreen, RoomData } from './HomeScreen';
import { ExploreScreen } from './ExploreScreen';
import { GamesScreen } from './GamesScreen';
import { MessagesScreen } from './MessagesScreen';
import { VoiceRoomScreen } from './VoiceRoomScreen';
import { FloatingRoomWidget } from './FloatingRoomWidget';
import { 
  subscribeToRoomSession, 
  maximizeRoomSession, 
  minimizeRoomSession, 
  exitRoomSession, 
  setActiveRoomSession, 
  ActiveRoomSession 
} from '../lib/roomSessionService';
import { 
  getAdminRoleForUser, 
  isOwnerOrSuperAdmin, 
  subscribeToAdminRoles, 
  OWNER_DEV_ID,
  AdminRole
} from '../lib/adminRoleService';

export const ProfileScreen: React.FC = () => {
  // State Management
  const [profile, setProfile] = useState<UserProfileData>(() => {
    const saved = localStorage.getItem('user_profile_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_USER_PROFILE,
          name: parsed.name || INITIAL_USER_PROFILE.name,
          bio: parsed.bio || INITIAL_USER_PROFILE.bio,
          country: parsed.country || INITIAL_USER_PROFILE.country,
          avatarUrl: parsed.avatar || parsed.avatarUrl || INITIAL_USER_PROFILE.avatarUrl,
        };
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_USER_PROFILE;
  });

  const handleSaveProfile = (updatedData: any) => {
    const newProfile = {
      ...profile,
      name: updatedData.name ?? profile.name,
      bio: updatedData.bio ?? profile.bio,
      country: updatedData.country ?? profile.country,
      avatarUrl: updatedData.avatar ?? updatedData.avatarUrl ?? profile.avatarUrl,
    };
    const dataToSave = {
      name: newProfile.name,
      id: newProfile.userId,
      country: newProfile.country,
      followers: 5365,
      following: 120,
      bio: newProfile.bio,
      superLegendLevel: 'SL3',
      vipLevel: 'VIP6',
      avatar: newProfile.avatarUrl,
      album: updatedData.album || {}
    };
    localStorage.setItem('user_profile_data', JSON.stringify(dataToSave));
    setProfile(newProfile);
    window.dispatchEvent(new Event('user_profile_updated'));
  };

  useEffect(() => {
    const syncProfile = () => {
      const saved = localStorage.getItem('user_profile_data');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          queueMicrotask(() => {
            setProfile((prev) => ({
              ...prev,
              name: parsed.name || prev.name,
              bio: parsed.bio || prev.bio,
              country: parsed.country || prev.country,
              avatarUrl: parsed.avatar || parsed.avatarUrl || prev.avatarUrl,
            }));
          });
        } catch (e) {
          console.error(e);
        }
      }
    };

    window.addEventListener('user_profile_updated', syncProfile);
    window.addEventListener('storage', syncProfile);
    return () => {
      window.removeEventListener('user_profile_updated', syncProfile);
      window.removeEventListener('storage', syncProfile);
    };
  }, []);
  const [copiedId, setCopiedId] = useState(false);
  const [activeStatModal, setActiveStatModal] = useState<StatItem['id'] | null>(null);
  const [selectedBadge, setSelectedBadge] = useState<BadgeInfo | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'explore' | 'games' | 'messages' | 'profile'>('home');
  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState(false);
  const [coinsBalance, setCoinsBalance] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('user_wallet_coins');
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed > 0) return Math.max(parsed, 100000000);
      }
    } catch {}
    return 100000000;
  });
  const [diamondsBalance, setDiamondsBalance] = useState<number>(8377);

  // Synchronize coinsBalance with global user_coins_updated event
  useEffect(() => {
    const handleCoinsUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (typeof customEvent.detail?.coins === 'number') {
        queueMicrotask(() => {
          setCoinsBalance(customEvent.detail.coins);
        });
      }
    };
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'user_wallet_coins' && e.newValue) {
        const parsed = parseInt(e.newValue, 10);
        if (!isNaN(parsed)) {
          queueMicrotask(() => {
            setCoinsBalance(parsed);
          });
        }
      }
    };
    window.addEventListener('user_coins_updated', handleCoinsUpdate);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('user_coins_updated', handleCoinsUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  // Services Row Modals State
  const [isUserProfileModalOpen, setIsUserProfileModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isCustomerServiceModalOpen, setIsCustomerServiceModalOpen] = useState(false);
  const [isSuperAdminModalOpen, setIsSuperAdminModalOpen] = useState(false);
  const [isAgencyAdminModalOpen, setIsAgencyAdminModalOpen] = useState(false);
  const [isThemeAdminModalOpen, setIsThemeAdminModalOpen] = useState(false);
  const [isOfficialAgencyManagerModalOpen, setIsOfficialAgencyManagerModalOpen] = useState(false);
  const [isAgencyRepModalOpen, setIsAgencyRepModalOpen] = useState(false);
  const [isModeratorModalOpen, setIsModeratorModalOpen] = useState(false);
  const [isBrokerCenterModalOpen, setIsBrokerCenterModalOpen] = useState(false);
  const [isSuperLegendModalOpen, setIsSuperLegendModalOpen] = useState(false);
  const [isLevelModalOpen, setIsLevelModalOpen] = useState(false);
  const [isFamilyModalOpen, setIsFamilyModalOpen] = useState(false);
  const [isBadgesCenterModalOpen, setIsBadgesCenterModalOpen] = useState(false);
  const [isAppearanceModalOpen, setIsAppearanceModalOpen] = useState(false);
  const [isVipCenterModalOpen, setIsVipCenterModalOpen] = useState(false);
  const [isAgencyModalOpen, setIsAgencyModalOpen] = useState(false);
  const [isRechargeAgencyModalOpen, setIsRechargeAgencyModalOpen] = useState(false);
  const [isBroadcasterCenterModalOpen, setIsBroadcasterCenterModalOpen] = useState(false);
  const [isGeniusModalOpen, setIsGeniusModalOpen] = useState(false);
  const [isFriendlyPointsModalOpen, setIsFriendlyPointsModalOpen] = useState(false);
  const [isMallModalOpen, setIsMallModalOpen] = useState(false);
  const [minimizedRoomSession, setMinimizedRoomSession] = useState<ActiveRoomSession | null>(null);
  const [activeVoiceRoom, setActiveVoiceRoom] = useState<RoomData | null>(null);
  const [isRoomMinimized, setIsRoomMinimized] = useState<boolean>(false);

  useEffect(() => {
    const unsub = subscribeToRoomSession((session) => {
      queueMicrotask(() => {
        setMinimizedRoomSession(session && session.isMinimized ? session : null);
        if (!session) {
          setActiveVoiceRoom(null);
          setIsRoomMinimized(false);
        } else {
          setIsRoomMinimized(Boolean(session.isMinimized));
        }
      });
    });
    return unsub;
  }, []);

  const handleOpenRoom = (room: RoomData) => {
    setActiveVoiceRoom(room);
    setIsRoomMinimized(false);
    queueMicrotask(() => {
      setActiveRoomSession({
        roomId: room.id,
        roomTitle: room.title,
        hostName: room.host,
        roomAvatar: room.image,
        isOwner: Boolean(room.isOwner || room.ownerId === profile.userId),
        isMinimized: false,
      });
    });
  };
  
  // Royal Theme State: Click 1 -> White (الأبيض اللؤلؤي) | Click 2 -> Night (الليلي الملكي) | Click 3 -> Gold (الملكي الذهبي)
  const [royalTheme, setRoyalTheme] = useState<RoyalThemeMode>(() => {
    try {
      const saved = localStorage.getItem('app_royal_theme');
      if (saved === 'white' || saved === 'dark' || saved === 'gold') return saved as RoyalThemeMode;
    } catch {}
    return 'gold';
  });

  const cycleRoyalTheme = () => {
    setRoyalTheme((prev) => {
      const next: RoyalThemeMode = prev === 'gold' ? 'white' : prev === 'white' ? 'dark' : 'gold';
      try {
        localStorage.setItem('app_royal_theme', next);
      } catch {}
      return next;
    });
  };

  const curRoyal = ROYAL_THEMES[royalTheme];

  // Dynamic Role State
  const [adminRole, setAdminRole] = useState<AdminRole>(() => getAdminRoleForUser(profile.userId));

  useEffect(() => {
    setAdminRole(getAdminRoleForUser(profile.userId));
    const unsubscribe = subscribeToAdminRoles(() => {
      queueMicrotask(() => {
        setAdminRole(getAdminRoleForUser(profile.userId));
      });
    });
    const handlePersonaSwitched = () => {
      queueMicrotask(() => {
        setAdminRole(getAdminRoleForUser(profile.userId));
      });
    };
    window.addEventListener('testing_user_switched', handlePersonaSwitched);
    return () => {
      unsubscribe();
      window.removeEventListener('testing_user_switched', handlePersonaSwitched);
    };
  }, [profile.userId]);

  const isOwner = isOwnerOrSuperAdmin(profile.userId);
  const [activeServiceModal, setActiveServiceModal] = useState<ServiceType | null>(null);

  // Copy ID functionality
  const handleCopyId = () => {
    navigator.clipboard.writeText(profile.userId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Mini Games Data for Horizontal Strip
  const gamesList = [
    { id: 'cat', title: 'GREEDY CAT', bg: 'bg-emerald-500', emoji: '🐱' },
    { id: 'horse', title: 'Horse Racing', bg: 'bg-amber-800', emoji: '🏇' },
    { id: 'chicken', title: 'Chicken Cross', bg: 'bg-sky-400', emoji: '🐔' },
    { id: 'fishing', title: 'FISHING', bg: 'bg-blue-600', emoji: '🦈' },
    { id: 'olympus', title: 'LUCKY OLYMPUS', bg: 'bg-purple-600', emoji: '⚡' },
    { id: 'yummy', title: 'YUMMY', bg: 'bg-pink-600', emoji: '🍔' },
  ];

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#F3F6F9] text-slate-800 font-sans pb-24 select-none relative overflow-x-hidden w-full max-w-full"
    >
      {/* Toast Notification for ID Copy */}
      <AnimatePresence>
        {copiedId && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#1E293B] text-white px-4 py-2.5 rounded-full text-xs font-bold shadow-2xl flex items-center gap-2 border border-slate-700/80"
          >
            <Check className="w-4 h-4 text-emerald-400" />
            <span>تم نسخ المعرف (ID: {profile.userId}) بنجاح!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Screen Routing Content */}
      {activeTab === 'home' && (
        <HomeScreen 
          onOpenRecharge={() => setIsRechargeModalOpen(true)} 
          onOpenRoom={handleOpenRoom}
        />
      )}
      {activeTab === 'explore' && <ExploreScreen />}
      {activeTab === 'games' && <GamesScreen />}
      {activeTab === 'messages' && <MessagesScreen />}

      {/* Profile View (Renders when activeTab === 'profile') */}
      {activeTab === 'profile' && (
        <>
              {/* Top Header Background with Soft Pastel Tint */}
              <div className="bg-gradient-to-b from-[#E2F1ED] via-[#EDF5F2] to-[#F3F6F9] px-4 pt-3 pb-2">
            {/* Top Header Controls: Settings & Headphones Icons on the right, Super Admin button in center/left if owner, 7:35 on the left */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsSettingsModalOpen(true)}
                  className="p-2 rounded-full bg-white/80 shadow-xs hover:bg-white text-slate-700 transition-all cursor-pointer"
                  title="الإعدادات"
                >
                  <Settings className="w-5 h-5 text-slate-700" />
                </button>
                <button
                  onClick={() => setIsCustomerServiceModalOpen(true)}
                  className="p-2 rounded-full bg-white/80 shadow-xs hover:bg-white text-slate-700 transition-all cursor-pointer"
                  title="خدمة العملاء والإنصات"
                >
                  <Headphones className="w-5 h-5 text-slate-700" />
                </button>

                {/* زر تبديل النمط الملكي الموحد (زر واحد: ضغطة 1 -> أبيض نقي | ضغطة 2 -> ليلي فاخر | ضغطة 3 -> ذهبي ملكي) */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={cycleRoyalTheme}
                  className={`px-2.5 py-1.5 rounded-full text-xs font-black shadow-xs border flex items-center gap-1.5 cursor-pointer transition-all duration-300 ${
                    royalTheme === 'gold'
                      ? 'bg-gradient-to-r from-[#FFFDF9] via-[#FAF5E8] to-[#FFF9ED] border-[#DFC386] text-[#7E4F0B] shadow-[0_2px_8px_rgba(180,140,50,0.2)] hover:border-[#B38022]'
                      : royalTheme === 'white'
                      ? 'bg-white border-slate-300 text-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:border-slate-400'
                      : 'bg-gradient-to-r from-[#1E293B] to-[#0F172A] border-slate-700 text-amber-300 shadow-[0_2px_8px_rgba(0,0,0,0.3)] hover:border-slate-600'
                  }`}
                  title={
                    royalTheme === 'gold'
                      ? 'النمط الذهبي الملكي (انقر للتحويل إلى اللون الأبيض)'
                      : royalTheme === 'white'
                      ? 'النمط الأبيض النقي (انقر للتحويل إلى اللون الليلي)'
                      : 'النمط الليلي الفاخر (انقر للتحويل إلى اللون الذهبي)'
                  }
                >
                  {royalTheme === 'gold' && <Sparkles className="w-3.5 h-3.5 text-[#B38022] fill-[#B38022]" />}
                  {royalTheme === 'white' && <Sun className="w-3.5 h-3.5 text-slate-700" />}
                  {royalTheme === 'dark' && <Moon className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />}
                  <span className="text-[11px] font-bold">
                    {royalTheme === 'gold' ? 'الملكي الذهبي' : royalTheme === 'white' ? 'الأبيض اللؤلؤي' : 'الليلي الملكي'}
                  </span>
                </motion.button>

                {/* زر السوبر أدمن (المبرمج / المالك): مشروط حصراً بـ currentUser.id === ownerId ومخفي تماماً عن غيره */}
                {isOwner && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsSuperAdminModalOpen(true)}
                    className="px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-slate-950 text-xs font-black shadow-md border border-amber-200 flex items-center gap-1.5 cursor-pointer animate-pulse"
                    title="لوحة تحكم السوبر أدمن (المالك والمبرمج)"
                  >
                    <Crown className="w-4 h-4 fill-slate-950 text-slate-950" />
                    <span>لوحة السوبر أدمن 👑</span>
                  </motion.button>
                )}
              </div>
              <span className="text-xs font-mono font-medium text-slate-500">7:35</span>
            </div>

            {/* User Info Row (Avatar on FAR RIGHT, Name & ID in center, Arrow on FAR LEFT) */}
            <div className="flex items-center justify-between mt-2">
              {/* Avatar Image on FAR RIGHT */}
              <div className="relative shrink-0 cursor-pointer" onClick={() => setIsUserProfileModalOpen(true)}>
                <img
                  src={profile.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'}
                  alt={profile.name}
                  className="w-20 h-20 sm:w-22 sm:h-22 rounded-full object-cover border-3 border-white shadow-md"
                />
                {/* Pencil Edit Icon Badge */}
                <div 
                  onClick={(e) => { e.stopPropagation(); setIsEditModalOpen(true); }}
                  className="absolute bottom-0 left-0 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-md cursor-pointer hover:scale-110 transition-transform"
                  title="تعديل الملف الشخصي"
                >
                  <Pencil className="w-3 h-3 text-white fill-white" />
                </div>
              </div>

              {/* User Info (Name, Badges, ID) - Center/Right aligned */}
              <div className="flex-1 mr-3 text-right flex flex-col justify-center space-y-1.5">
                {/* User Name in Red */}
                <h1 
                  onClick={() => setIsUserProfileModalOpen(true)}
                  className="text-xl sm:text-2xl font-black text-[#E53E3E] tracking-tight cursor-pointer hover:underline"
                >
                  {profile.name}
                </h1>

                {/* Badges and ID Row (Badges on right, ID after them in RTL) */}
                <div className="flex items-center gap-2 flex-wrap">
                  {/* VIP8 Badge */}
                  <span
                    onClick={() => setIsVipCenterModalOpen(true)}
                    className="bg-gradient-to-r from-amber-600 via-amber-800 to-slate-900 text-amber-300 px-2 py-0.5 rounded-full text-[10px] font-black border border-amber-400/60 shadow-xs cursor-pointer flex items-center gap-0.5"
                  >
                    <Crown className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span>{profile.vipLevel || 'VIP8'}</span>
                  </span>

                  {/* Super Legend SL1 Badge */}
                  <span
                    onClick={() => setIsSuperLegendModalOpen(true)}
                    className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-800 text-amber-100 px-2 py-0.5 rounded-full text-[10px] font-black border border-amber-300/60 shadow-xs cursor-pointer flex items-center gap-0.5"
                  >
                    <span className="text-xs">🐺</span>
                    <span>SL1</span>
                  </span>

                  {/* ID + Copy Icon (ID on right, Copy icon on left in RTL) */}
                  <button
                    onClick={handleCopyId}
                    className="flex items-center gap-1 text-xs text-slate-500 font-mono hover:text-slate-800 transition-colors"
                    title="نسخ المعرف"
                  >
                    <span className="font-semibold">ID:{profile.userId}</span>
                    {copiedId ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Left Arrow Icon on FAR LEFT */}
              <button className="text-slate-400 hover:text-slate-600 transition-colors p-1">
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>

            {/* Statistics 4 Columns Row - Royal Luxury Cards (الزوار - الأصدقاء - تمت متابعتهم - المعجبين) */}
            <div className="grid grid-cols-4 gap-2 text-center mt-5 mb-2 px-1" dir="rtl">
              {/* 1. Visitors / الزوار */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveStatModal('visitors')}
                className={`relative p-[1.5px] rounded-2xl ${curRoyal.outerBorder} ${curRoyal.shadow} transition-all duration-300 cursor-pointer group`}
              >
                <div className={`${curRoyal.innerBg} rounded-[14.5px] p-2 sm:p-2.5 flex flex-col items-center justify-center border ${curRoyal.innerBorder} h-full transition-all duration-300`}>
                  {/* 3D Realistic Icon Container on Embossed Plinth */}
                  <div className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${curRoyal.plinthBg} flex items-center justify-center mb-1 group-hover:scale-105 transition-all shrink-0`}>
                    <Visitors3DIcon className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <div className={`text-sm sm:text-base font-black ${curRoyal.titleText} font-mono leading-tight tracking-tight drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]`}>
                    {profile.stats.visitors.toLocaleString('en-US')}
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
                onClick={() => setActiveStatModal('friends')}
                className={`relative p-[1.5px] rounded-2xl ${curRoyal.outerBorder} ${curRoyal.shadow} transition-all duration-300 cursor-pointer group`}
              >
                <div className={`${curRoyal.innerBg} rounded-[14.5px] p-2 sm:p-2.5 flex flex-col items-center justify-center border ${curRoyal.innerBorder} h-full transition-all duration-300`}>
                  {/* 3D Realistic Icon Container on Embossed Plinth */}
                  <div className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${curRoyal.plinthBg} flex items-center justify-center mb-1 group-hover:scale-105 transition-all shrink-0`}>
                    <Friends3DIcon className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <div className={`text-sm sm:text-base font-black ${curRoyal.titleText} font-mono leading-tight tracking-tight drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]`}>
                    {profile.stats.friends.toLocaleString('en-US')}
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
                onClick={() => setActiveStatModal('followers')}
                className={`relative p-[1.5px] rounded-2xl ${curRoyal.outerBorder} ${curRoyal.shadow} transition-all duration-300 cursor-pointer group`}
              >
                <div className={`${curRoyal.innerBg} rounded-[14.5px] p-2 sm:p-2.5 flex flex-col items-center justify-center border ${curRoyal.innerBorder} h-full transition-all duration-300`}>
                  {/* 3D Realistic Icon Container on Embossed Plinth */}
                  <div className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${curRoyal.plinthBg} flex items-center justify-center mb-1 group-hover:scale-105 transition-all shrink-0`}>
                    <Following3DIcon className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <div className={`text-sm sm:text-base font-black ${curRoyal.titleText} font-mono leading-tight tracking-tight drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]`}>
                    {profile.stats.followers.toLocaleString('en-US')}
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
                onClick={() => setActiveStatModal('likes')}
                className={`relative p-[1.5px] rounded-2xl ${curRoyal.outerBorder} ${curRoyal.shadow} transition-all duration-300 cursor-pointer group`}
              >
                <div className={`${curRoyal.innerBg} rounded-[14.5px] p-2 sm:p-2.5 flex flex-col items-center justify-center border ${curRoyal.innerBorder} h-full transition-all duration-300`}>
                  {/* 3D Realistic Icon Container on Embossed Plinth */}
                  <div className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${curRoyal.plinthBg} flex items-center justify-center mb-1 group-hover:scale-105 transition-all shrink-0`}>
                    <Likes3DIcon className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <div className={`text-sm sm:text-base font-black ${curRoyal.titleText} font-mono leading-tight tracking-tight drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]`}>
                    {profile.stats.likes.toLocaleString('en-US')}
                  </div>
                  <div className={`text-[10px] sm:text-[11px] ${curRoyal.subText} font-black mt-0.5 whitespace-nowrap transition-colors`}>
                    المعجبين
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="max-w-md mx-auto px-4 space-y-3.5 mt-3">
            {/* Super Legend Banner */}
            <div
              onClick={() => setIsSuperLegendModalOpen(true)}
              className="relative rounded-2xl bg-gradient-to-r from-[#2B2313] via-[#3D3017] to-[#1F190D] p-3 text-white overflow-hidden shadow-md flex items-center justify-between border border-amber-500/30 cursor-pointer hover:border-amber-400 transition-all group"
            >
              {/* Sparkles Overlay Background */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:12px_12px]" />

              {/* Tag on Left */}
              <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full z-10 shadow-sm flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-slate-950 fill-slate-950" />
                <span>مستوى جديد</span>
              </span>

              {/* Banner Title Center / Right */}
              <div className="z-10 flex items-center gap-1.5">
                <ChevronLeft className="w-4 h-4 text-amber-400 group-hover:-translate-x-0.5 transition-transform" />
                <span className="text-sm sm:text-base font-black tracking-wider text-amber-300 italic font-serif uppercase flex items-center gap-1">
                  <span>SUPER LEGEND</span>
                  <span className="text-xs">👑</span>
                </span>
              </div>
            </div>

            {/* Currency Row (2 Horizontal Cards: Recharge on Right, Diamonds on Left - English Numbers Only) */}
            <div className="grid grid-cols-2 gap-3" dir="rtl">
              {/* Recharge / Coins Card (Appears on the RIGHT in RTL - English Numbers) */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setIsRechargeModalOpen(true)}
                className={`relative p-[2px] rounded-2xl ${curRoyal.outerBorder} ${curRoyal.shadow} transition-all duration-300 cursor-pointer group w-full`}
              >
                <div className={`${curRoyal.innerBg} rounded-[14px] p-2.5 sm:p-3 flex flex-col justify-between h-full border ${curRoyal.innerBorder} group-hover:bg-white/90 transition-all duration-300`}>
                  {/* Top Header: T-Coin Icon + Label & Arrow */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <TCoin3DIcon className="w-5 h-5 shrink-0" />
                      <span className={`text-xs font-black ${curRoyal.coinsText} transition-colors`}>
                        شحن
                      </span>
                    </div>
                    <ChevronLeft className={`w-4 h-4 ${curRoyal.chevron} group-hover:-translate-x-0.5 transition-transform shrink-0`} />
                  </div>
                  {/* Numbers taking full natural width */}
                  <div className={`text-lg sm:text-xl font-black ${curRoyal.coinsText} font-mono leading-tight tracking-tight mt-1.5 drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)] truncate`}>
                    {coinsBalance.toLocaleString('en-US')}
                  </div>
                </div>
              </motion.div>

              {/* Diamonds Card (Appears on the LEFT in RTL - English Numbers) */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setIsRechargeModalOpen(true)}
                className={`relative p-[2px] rounded-2xl ${curRoyal.outerBorder} ${curRoyal.shadow} transition-all duration-300 cursor-pointer group w-full`}
              >
                <div className={`${curRoyal.innerBg} rounded-[14px] p-2.5 sm:p-3 flex flex-col justify-between h-full border ${curRoyal.innerBorder} group-hover:bg-white/90 transition-all duration-300`}>
                  {/* Top Header: Diamond Icon + Label & Arrow */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Diamond3DIcon className="w-5 h-5 shrink-0" />
                      <span className={`text-xs font-black ${curRoyal.diamondsText} transition-colors`}>
                        الماسة
                      </span>
                    </div>
                    <ChevronLeft className={`w-4 h-4 ${curRoyal.diamondsText} group-hover:-translate-x-0.5 transition-transform shrink-0`} />
                  </div>
                  {/* Numbers taking full natural width */}
                  <div className={`text-lg sm:text-xl font-black ${curRoyal.diamondsText} font-mono leading-tight tracking-tight mt-1.5 drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)] truncate`}>
                    {diamondsBalance.toLocaleString('en-US')}
                  </div>
                </div>
              </motion.div>
            </div>

        {/* 4 Rectangular Action Cards arranged 2 on the right and 2 on the left (2x2 grid) with Luxury Gold / Pearl White / Obsidian Night styling */}
        <div className="grid grid-cols-2 gap-2.5" dir="rtl">
          {/* Right Column Top: مستوى المستخدم */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setIsLevelModalOpen(true)}
            className={`relative p-[2px] rounded-2xl ${curRoyal.outerBorder} ${curRoyal.shadow} transition-all duration-300 cursor-pointer group text-right w-full`}
          >
            <div className={`${curRoyal.innerBg} rounded-[14px] p-2.5 sm:p-3 flex items-center justify-between border ${curRoyal.innerBorder} group-hover:bg-white/90 transition-all duration-300 h-full`}>
              <div className="flex items-center gap-2.5 min-w-0">
                {/* 3D Inner Embossed Plinth */}
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
            onClick={() => setIsBadgesCenterModalOpen(true)}
            className={`relative p-[2px] rounded-2xl ${curRoyal.outerBorder} ${curRoyal.shadow} transition-all duration-300 cursor-pointer group text-right w-full`}
          >
            <div className={`${curRoyal.innerBg} rounded-[14px] p-2.5 sm:p-3 flex items-center justify-between border ${curRoyal.innerBorder} group-hover:bg-white/90 transition-all duration-300 h-full`}>
              <div className="flex items-center gap-2.5 min-w-0">
                {/* 3D Inner Embossed Plinth */}
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
            onClick={() => setIsFamilyModalOpen(true)}
            className={`relative p-[2px] rounded-2xl ${curRoyal.outerBorder} ${curRoyal.shadow} transition-all duration-300 cursor-pointer group text-right w-full`}
          >
            <div className={`${curRoyal.innerBg} rounded-[14px] p-2.5 sm:p-3 flex items-center justify-between border ${curRoyal.innerBorder} group-hover:bg-white/90 transition-all duration-300 h-full`}>
              <div className="flex items-center gap-2.5 min-w-0">
                {/* 3D Inner Embossed Plinth */}
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
            onClick={() => setIsAppearanceModalOpen(true)}
            className={`relative p-[2px] rounded-2xl ${curRoyal.outerBorder} ${curRoyal.shadow} transition-all duration-300 cursor-pointer group text-right w-full`}
          >
            <div className={`${curRoyal.innerBg} rounded-[14px] p-2.5 sm:p-3 flex items-center justify-between border ${curRoyal.innerBorder} group-hover:bg-white/90 transition-all duration-300 h-full`}>
              <div className="flex items-center gap-2.5 min-w-0">
                {/* 3D Inner Embossed Plinth */}
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

        {/* Mini Games Strip */}
        <div className={`relative p-[2px] rounded-2xl ${curRoyal.outerBorder} ${curRoyal.shadow} transition-all duration-300`}>
          <div className={`${curRoyal.innerBg} rounded-[14px] p-2.5 sm:p-3 flex items-center gap-2 border ${curRoyal.innerBorder} transition-all duration-300`}>
            <ChevronLeft className={`w-4 h-4 ${curRoyal.chevron} shrink-0`} />
            <div className="flex items-center gap-3 flex-1 overflow-x-auto no-scrollbar py-1">
              {gamesList.map((game) => (
                <div
                  key={game.id}
                  onClick={() => setActiveTab('games')}
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

        {/* قائمة الخيارات والخدمات */}
        <div className={`${curRoyal.listWrapper} rounded-3xl p-2 space-y-1 shadow-xs transition-all duration-300`} dir="rtl">
          
          {/* الأزرار الديناميكية المشروطة بالصلاحيات (تظهر حصراً لأصحاب الصلاحية وتختفي تماماً عن المستخدم العادي) */}
          
          {/* 1. إداري الوكالات (Agency Admin) */}
          {adminRole === 'agency_admin' && (
            <motion.div 
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsAgencyAdminModalOpen(true)}
              className="relative my-3 p-[2px] rounded-2xl bg-gradient-to-r from-sky-600 via-indigo-600 to-blue-700 shadow-[0_4px_18px_rgba(2,132,199,0.25)] cursor-pointer group text-right transition-all duration-300"
            >
              {/* شارة بارزة للأعلى: نصفها خارج ونصفها داخل المستطيل */}
              <div className="absolute -top-2.5 right-4 z-20">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9.5px] font-black bg-gradient-to-r from-sky-700 via-blue-600 to-indigo-700 text-white border border-sky-300/80 shadow-[0_2px_8px_rgba(2,132,199,0.4)] font-sans tracking-wide">
                  <Sparkles className="w-3 h-3 text-cyan-200 fill-cyan-200 animate-pulse" />
                  <span>لوحة إدارة الوكالات</span>
                </span>
              </div>

              <div className="bg-gradient-to-br from-sky-950 via-slate-900 to-slate-950 text-white rounded-[14px] p-3 sm:p-3.5 flex items-center justify-between border border-sky-400/40 group-hover:border-sky-300 transition-all duration-300 relative overflow-hidden">
                <div className="flex items-center gap-2.5 min-w-0 flex-1 relative z-10">
                  {/* 3D Inner Embossed Plinth */}
                  <div className="relative w-12 h-12 rounded-xl bg-gradient-to-b from-sky-900/90 to-slate-950 border border-sky-400/60 shadow-[0_2px_10px_rgba(0,0,0,0.4),inset_0_1px_2px_rgba(255,255,255,0.2)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <AgencyAdmin3DIcon className="w-8 h-8" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-black text-white group-hover:text-sky-300 transition-colors truncate">
                        لوحة إدارة الوكالات
                      </h4>
                      <span className="text-[9.5px] font-black bg-sky-500/20 text-sky-200 border border-sky-400/40 px-2 py-0.5 rounded-full shadow-2xs">
                        إداري وكالات 🏛️
                      </span>
                    </div>
                    <span className="text-[10.5px] text-sky-100/85 font-bold block mt-0.5 truncate">
                      متابعة واعتماد الوكالات، مراقبة التارغت والوسطاء
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-black text-slate-950 bg-gradient-to-r from-sky-300 to-cyan-200 border border-sky-200 px-3 py-1.5 rounded-xl shadow-2xs group-hover:scale-105 active:scale-95 transition-all shrink-0 mr-2 relative z-10">
                  <span>دخول</span>
                  <ChevronLeft className="w-4 h-4 text-slate-950" />
                </div>
              </div>
            </motion.div>
          )}

          {/* 2. إداري الثيمات والمتجر (Theme Admin) */}
          {adminRole === 'theme_admin' && (
            <motion.div 
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsThemeAdminModalOpen(true)}
              className="relative my-3 p-[2px] rounded-2xl bg-gradient-to-r from-[#7E22CE] via-[#D946EF] to-[#6366F1] shadow-[0_4px_18px_rgba(147,51,234,0.28)] cursor-pointer group text-right transition-all duration-300"
            >
              {/* شارة بارزة للأعلى: نصفها خارج ونصفها داخل المستطيل */}
              <div className="absolute -top-2.5 right-4 z-20">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9.5px] font-black bg-gradient-to-r from-purple-700 via-fuchsia-600 to-indigo-700 text-white border border-purple-300/80 shadow-[0_2px_8px_rgba(147,51,234,0.4)] font-sans tracking-wide">
                  <Sparkles className="w-3 h-3 text-amber-300 fill-amber-300 animate-pulse" />
                  <span>لوحة الثيمات والمتجر</span>
                </span>
              </div>

              <div className="bg-gradient-to-br from-purple-950 via-slate-900 to-slate-950 text-white rounded-[14px] p-3 sm:p-3.5 flex items-center justify-between border border-purple-400/40 group-hover:border-purple-300 transition-all duration-300 relative overflow-hidden">
                <div className="flex items-center gap-2.5 min-w-0 flex-1 relative z-10">
                  {/* 3D Inner Embossed Plinth */}
                  <div className="relative w-12 h-12 rounded-xl bg-gradient-to-b from-purple-900/90 to-slate-950 border border-purple-400/60 shadow-[0_2px_10px_rgba(0,0,0,0.4),inset_0_1px_2px_rgba(255,255,255,0.2)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <ThemeAdmin3DIcon className="w-8 h-8" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-black text-white group-hover:text-purple-300 transition-colors truncate">
                        لوحة إدارة الثيمات والمتجر
                      </h4>
                      <span className="text-[9.5px] font-black bg-purple-500/20 text-purple-200 border border-purple-400/40 px-2 py-0.5 rounded-full shadow-2xs">
                        إداري ثيمات 🎨
                      </span>
                    </div>
                    <span className="text-[10.5px] text-purple-100/85 font-bold block mt-0.5 truncate">
                      تصاميم الغرف الصوتية، لوحات الشرف، وعناصر المتجر
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-black text-slate-950 bg-gradient-to-r from-purple-300 to-fuchsia-200 border border-purple-200 px-3 py-1.5 rounded-xl shadow-2xs group-hover:scale-105 active:scale-95 transition-all shrink-0 mr-2 relative z-10">
                  <span>دخول</span>
                  <ChevronLeft className="w-4 h-4 text-slate-950" />
                </div>
              </div>
            </motion.div>
          )}



          {/* 4. الوسيط المعتمد (Broker) */}
          {adminRole === 'broker' && (
            <motion.div 
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsBrokerCenterModalOpen(true)}
              className="relative my-3 p-[2px] rounded-2xl bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-700 shadow-[0_4px_18px_rgba(13,148,136,0.25)] cursor-pointer group text-right transition-all duration-300"
            >
              {/* شارة بارزة للأعلى: نصفها خارج ونصفها داخل المستطيل */}
              <div className="absolute -top-2.5 right-4 z-20">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9.5px] font-black bg-gradient-to-r from-teal-800 via-teal-700 to-cyan-800 text-white border border-teal-300/80 shadow-[0_2px_8px_rgba(13,148,136,0.4)] font-sans tracking-wide">
                  <Sparkles className="w-3 h-3 text-teal-200 fill-teal-200 animate-pulse" />
                  <span>لوحة الوسيط المعتمد</span>
                </span>
              </div>

              <div className="bg-gradient-to-br from-teal-950 via-slate-900 to-slate-950 text-white rounded-[14px] p-3 sm:p-3.5 flex items-center justify-between border border-teal-400/40 group-hover:border-teal-300 transition-all duration-300 relative overflow-hidden">
                <div className="flex items-center gap-2.5 min-w-0 flex-1 relative z-10">
                  {/* 3D Inner Embossed Plinth */}
                  <div className="relative w-12 h-12 rounded-xl bg-gradient-to-b from-teal-900/90 to-slate-950 border border-teal-400/60 shadow-[0_2px_10px_rgba(0,0,0,0.4),inset_0_1px_2px_rgba(255,255,255,0.2)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Broker3DIcon className="w-8 h-8" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-black text-white group-hover:text-teal-300 transition-colors truncate">
                        مركز الوساطة والتوظيف
                      </h4>
                      <span className="text-[9.5px] font-black bg-teal-500/20 text-teal-200 border border-teal-400/40 px-2 py-0.5 rounded-full shadow-2xs">
                        وسيط معتمد 🤝
                      </span>
                    </div>
                    <span className="text-[10.5px] text-teal-100/85 font-bold block mt-0.5 truncate">
                      استقطاب المذيعين، متابعة ساعات البث والعمولات
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-black text-slate-950 bg-gradient-to-r from-teal-300 to-emerald-200 border border-teal-200 px-3 py-1.5 rounded-xl shadow-2xs group-hover:scale-105 active:scale-95 transition-all shrink-0 mr-2 relative z-10">
                  <span>دخول</span>
                  <ChevronLeft className="w-4 h-4 text-slate-950" />
                </div>
              </div>
            </motion.div>
          )}

          {/* 5. المراقب العام والدعم الفني (Moderator) */}
          {adminRole === 'moderator' && (
            <motion.div 
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsModeratorModalOpen(true)}
              className="relative my-3 p-[2px] rounded-2xl bg-gradient-to-r from-amber-600 via-orange-600 to-rose-700 shadow-[0_4px_18px_rgba(217,119,6,0.25)] cursor-pointer group text-right transition-all duration-300"
            >
              {/* شارة بارزة للأعلى: نصفها خارج ونصفها داخل المستطيل */}
              <div className="absolute -top-2.5 right-4 z-20">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9.5px] font-black bg-gradient-to-r from-amber-700 via-orange-600 to-rose-700 text-white border border-amber-300/80 shadow-[0_2px_8px_rgba(217,119,6,0.4)] font-sans tracking-wide">
                  <Sparkles className="w-3 h-3 text-amber-200 fill-amber-200 animate-pulse" />
                  <span>لوحة الرقابة والدعم العام</span>
                </span>
              </div>

              <div className="bg-gradient-to-br from-amber-950 via-slate-900 to-slate-950 text-white rounded-[14px] p-3 sm:p-3.5 flex items-center justify-between border border-amber-400/40 group-hover:border-amber-300 transition-all duration-300 relative overflow-hidden">
                <div className="flex items-center gap-2.5 min-w-0 flex-1 relative z-10">
                  {/* 3D Inner Embossed Plinth */}
                  <div className="relative w-12 h-12 rounded-xl bg-gradient-to-b from-amber-900/90 to-slate-950 border border-amber-400/60 shadow-[0_2px_10px_rgba(0,0,0,0.4),inset_0_1px_2px_rgba(255,255,255,0.2)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Moderator3DIcon className="w-8 h-8" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-black text-white group-hover:text-amber-300 transition-colors truncate">
                        لوحة المراقب العام والدعم
                      </h4>
                      <span className="text-[9.5px] font-black bg-amber-500/20 text-amber-200 border border-amber-400/40 px-2 py-0.5 rounded-full shadow-2xs">
                        مراقب عام 🛡️
                      </span>
                    </div>
                    <span className="text-[10.5px] text-amber-100/85 font-bold block mt-0.5 truncate">
                      متابعة البلاغات، إدارة الحظر، والمراقبة الحية للغرف
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-black text-slate-950 bg-gradient-to-r from-amber-300 to-yellow-200 border border-amber-200 px-3 py-1.5 rounded-xl shadow-2xs group-hover:scale-105 active:scale-95 transition-all shrink-0 mr-2 relative z-10">
                  <span>دخول</span>
                  <ChevronLeft className="w-4 h-4 text-slate-950" />
                </div>
              </div>
            </motion.div>
          )}

          {/* للمستخدم العادي (regular_user): تظهر قائمته نقية وبدون أي أزرار إدارية إطلاقاً */}

          {/* 2. شبكة الخدمات الملكية المخصصة (واحد يمين وواحد شمال) بالألوان الملكية المتغيرة مع شارات بارزة أعلى الحافة */}
          <div className="grid grid-cols-2 gap-x-2.5 gap-y-3.5 pt-3 pb-1.5" dir="rtl">
            {/* الصف 1 يمين: مركز VIP */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setIsVipCenterModalOpen(true)}
              className={`relative p-[2px] rounded-2xl ${curRoyal.outerBorder} ${curRoyal.shadow} active:scale-95 transition-all duration-300 cursor-pointer group text-right w-full`}
            >
              {/* شارة بارزة للأعلى: نصفها خارج ونصفها داخل المستطيل */}
              <div className="absolute -top-2.5 right-4 z-20">
                <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[9px] font-black ${curRoyal.pillBadge} border font-mono tracking-wider transition-all duration-300`}>
                  VIP 8
                </span>
              </div>
              <div className={`${curRoyal.innerBg} rounded-[14px] p-2.5 sm:p-3 flex items-center justify-between border ${curRoyal.innerBorder} group-hover:bg-white/90 transition-all duration-300 w-full h-full`}>
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  {/* 3D Inner Embossed Plinth */}
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
              onClick={() => setIsGeniusModalOpen(true)}
              className={`relative p-[2px] rounded-2xl ${curRoyal.outerBorder} ${curRoyal.shadow} active:scale-95 transition-all duration-300 cursor-pointer group text-right w-full`}
            >
              {/* شارة بارزة للأعلى: نصفها خارج ونصفها داخل المستطيل */}
              <div className="absolute -top-2.5 right-4 z-20">
                <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[9px] font-black ${curRoyal.pillBadge} border font-sans tracking-wide transition-all duration-300`}>
                  Genius
                </span>
              </div>
              <div className={`${curRoyal.innerBg} rounded-[14px] p-2.5 sm:p-3 flex items-center justify-between border ${curRoyal.innerBorder} group-hover:bg-white/90 transition-all duration-300 w-full h-full`}>
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  {/* 3D Inner Embossed Plinth */}
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
              onClick={() => setIsFriendlyPointsModalOpen(true)}
              className={`relative p-[2px] rounded-2xl ${curRoyal.outerBorder} ${curRoyal.shadow} active:scale-95 transition-all duration-300 cursor-pointer group text-right w-full`}
            >
              {/* شارة بارزة للأعلى: نصفها خارج ونصفها داخل المستطيل */}
              <div className="absolute -top-2.5 right-4 z-20">
                <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[9px] font-black ${curRoyal.pillBadge} border font-mono tracking-wider transition-all duration-300`}>
                  2963
                </span>
              </div>
              <div className={`${curRoyal.innerBg} rounded-[14px] p-2.5 sm:p-3 flex items-center justify-between border ${curRoyal.innerBorder} group-hover:bg-white/90 transition-all duration-300 w-full h-full`}>
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  {/* 3D Inner Embossed Plinth */}
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
              onClick={() => setActiveServiceModal('invitations')}
              className={`relative p-[2px] rounded-2xl ${curRoyal.outerBorder} ${curRoyal.shadow} active:scale-95 transition-all duration-300 cursor-pointer group text-right w-full`}
            >
              {/* شارة بارزة للأعلى: نصفها خارج ونصفها داخل المستطيل */}
              <div className="absolute -top-2.5 right-4 z-20">
                <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[9px] font-black ${curRoyal.pillBadge} border font-sans tracking-wide transition-all duration-300`}>
                  ادع واربح
                </span>
              </div>
              <div className={`${curRoyal.innerBg} rounded-[14px] p-2.5 sm:p-3 flex items-center justify-between border ${curRoyal.innerBorder} group-hover:bg-white/90 transition-all duration-300 w-full h-full`}>
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  {/* 3D Inner Embossed Plinth */}
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
              onClick={() => setActiveServiceModal('invite_card')}
              className={`relative p-[2px] rounded-2xl ${curRoyal.outerBorder} ${curRoyal.shadow} active:scale-95 transition-all duration-300 cursor-pointer group text-right w-full`}
            >
              {/* شارة بارزة للأعلى: نصفها خارج ونصفها داخل المستطيل */}
              <div className="absolute -top-2.5 right-4 z-20">
                <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[9px] font-black ${curRoyal.pillBadge} border font-sans tracking-wide transition-all duration-300`}>
                  مشاركة
                </span>
              </div>
              <div className={`${curRoyal.innerBg} rounded-[14px] p-2.5 sm:p-3 flex items-center justify-between border ${curRoyal.innerBorder} group-hover:bg-white/90 transition-all duration-300 w-full h-full`}>
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  {/* 3D Inner Embossed Plinth */}
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
              onClick={() => setIsMallModalOpen(true)}
              className={`relative p-[2px] rounded-2xl ${curRoyal.outerBorder} ${curRoyal.shadow} active:scale-95 transition-all duration-300 cursor-pointer group text-right w-full`}
            >
              {/* شارة بارزة للأعلى: نصفها خارج ونصفها داخل المستطيل */}
              <div className="absolute -top-2.5 right-4 z-20">
                <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[9px] font-black ${curRoyal.pillBadge} border font-sans tracking-wide transition-all duration-300`}>
                  المتجر
                </span>
              </div>
              <div className={`${curRoyal.innerBg} rounded-[14px] p-2.5 sm:p-3 flex items-center justify-between border ${curRoyal.innerBorder} group-hover:bg-white/90 transition-all duration-300 w-full h-full`}>
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  {/* 3D Inner Embossed Plinth */}
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

          {/* 6.5 إدارة المتجر وثيمات التطبيق (المستطيل البنفسجي الياقوتي الفاخر مع الشارة البارزة للأعلى) */}
          {(adminRole === 'theme_admin' || adminRole === 'super_admin' || isOwner) && (
            <motion.div 
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsThemeAdminModalOpen(true)}
              className="relative my-3 p-[2px] rounded-2xl bg-gradient-to-r from-[#7E22CE] via-[#D946EF] to-[#6366F1] shadow-[0_4px_18px_rgba(147,51,234,0.28)] cursor-pointer group transition-all duration-300"
            >
              {/* شارة بارزة للأعلى: نصفها خارج ونصفها داخل المستطيل */}
              <div className="absolute -top-2.5 right-4 z-20">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9.5px] font-black bg-gradient-to-r from-purple-700 via-fuchsia-600 to-indigo-700 text-white border border-purple-300/80 shadow-[0_2px_8px_rgba(147,51,234,0.4)] font-sans tracking-wide">
                  <Sparkles className="w-3 h-3 text-amber-300 fill-amber-300 animate-pulse" />
                  <span>إداري الثيمات والمتجر</span>
                </span>
              </div>

              <div className="bg-gradient-to-r from-[#FAF5FF] via-[#FDF4FF] to-[#F5F3FF] rounded-[14px] p-3 flex items-center justify-between border border-[#E9D5FF]/90 group-hover:bg-white transition-all relative overflow-hidden">
                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#6B21A8] via-[#A855F7] to-[#F472B6] flex items-center justify-center text-white shadow-[0_2px_8px_rgba(147,51,234,0.35)] text-lg border border-white/80 shrink-0 group-hover:scale-105 transition-transform">
                    🎨
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-[#4C1D95] tracking-wide">إدارة المتجر وثيمات التطبيق</span>
                      <span className="text-[9px] bg-gradient-to-r from-[#7E22CE] to-[#6366F1] text-white font-extrabold px-2 py-0.5 rounded-full shadow-2xs">
                        إداري ثيمات 🎨
                      </span>
                    </div>
                    <span className="text-[10px] text-[#7E22CE] font-bold block mt-0.5">رفع صور VIP، إدارة عناصر المتجر، وثيمات الغرف</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-black text-[#6B21A8] bg-white/95 border border-[#D8B4FE]/60 px-3 py-1.5 rounded-xl shadow-2xs group-hover:bg-gradient-to-r group-hover:from-[#7E22CE] group-hover:to-[#6366F1] group-hover:text-white group-hover:border-transparent transition-all shrink-0 relative z-10">
                  <span>إدارة</span>
                  <ChevronLeft className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          )}

          {/* 6.7 مدير الوكالات الرسمية والمندوبين (المستطيل الماسي السيان الملكي الفاخر مع الشارة البارزة للأعلى) */}
          <motion.div 
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsOfficialAgencyManagerModalOpen(true)}
            className="relative my-3 p-[2px] rounded-2xl bg-gradient-to-r from-[#0369A1] via-[#0284C7] to-[#0D9488] shadow-[0_4px_20px_rgba(2,132,199,0.3)] cursor-pointer group transition-all duration-300"
          >
            {/* شارة بارزة للأعلى: نصفها خارج ونصفها داخل المستطيل */}
            <div className="absolute -top-2.5 right-4 z-20">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9.5px] font-black bg-gradient-to-r from-sky-700 via-cyan-600 to-teal-700 text-white border border-cyan-300/80 shadow-[0_2px_8px_rgba(2,132,199,0.4)] font-sans tracking-wide">
                <Sparkles className="w-3 h-3 text-cyan-200 fill-cyan-200 animate-pulse" />
                <span>الرئاسة الرسمية للوكالات</span>
              </span>
            </div>

            <div className="bg-gradient-to-r from-[#F0F9FF] via-[#E0F2FE] to-[#F0FDFA] rounded-[14px] p-3 flex items-center justify-between border border-[#BAE6FD]/90 group-hover:bg-white transition-all relative overflow-hidden">
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#0369A1] via-[#0284C7] to-[#38BDF8] flex items-center justify-center text-white shadow-[0_2px_8px_rgba(2,132,199,0.35)] text-lg border border-white/80 shrink-0 group-hover:scale-105 transition-transform">
                  👑
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-[#0C4A6E] tracking-wide">مدير الوكالات الرسمية والمندوبين</span>
                    <span className="text-[9px] bg-gradient-to-r from-[#0284C7] to-[#0D9488] text-white font-extrabold px-2 py-0.5 rounded-full shadow-2xs">
                      رئيس الوكالات 💎
                    </span>
                  </div>
                  <span className="text-[10px] text-[#0369A1] font-bold block mt-0.5">استدعاء وكالات رسمية، تعيين المندوبين، وفتح وإغلاق الصلاحيات</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-black text-[#0369A1] bg-white/95 border border-[#7DD3FC]/60 px-3 py-1.5 rounded-xl shadow-2xs group-hover:bg-gradient-to-r group-hover:from-[#0284C7] group-hover:to-[#0D9488] group-hover:text-white group-hover:border-transparent transition-all shrink-0 relative z-10">
                <span>إدارة</span>
                <ChevronLeft className="w-4 h-4" />
              </div>
            </div>
          </motion.div>

          {/* 6.8 مندوب وكالات (المستطيل الفضي البلاتيني الفاخر مع الشارة البارزة للأعلى) */}
          <motion.div 
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsAgencyRepModalOpen(true)}
            className="relative my-3 p-[2px] rounded-2xl bg-gradient-to-r from-[#334155] via-[#64748B] to-[#94A3B8] shadow-[0_4px_18px_rgba(71,85,105,0.28)] cursor-pointer group transition-all duration-300"
          >
            {/* شارة بارزة للأعلى: نصفها خارج ونصفها داخل المستطيل */}
            <div className="absolute -top-2.5 right-4 z-20">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9.5px] font-black bg-gradient-to-r from-slate-700 via-slate-800 to-zinc-800 text-white border border-slate-400/80 shadow-[0_2px_8px_rgba(71,85,105,0.4)] font-sans tracking-wide">
                <Sparkles className="w-3 h-3 text-amber-300 fill-amber-300 animate-pulse" />
                <span>لوحة المندوب المعتمد</span>
              </span>
            </div>

            <div className="bg-gradient-to-r from-[#F8FAFC] via-[#F1F5F9] to-[#E2E8F0] rounded-[14px] p-3 flex items-center justify-between border border-[#CBD5E1]/90 group-hover:bg-white transition-all relative overflow-hidden">
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#334155] via-[#64748B] to-[#94A3B8] flex items-center justify-center text-white shadow-[0_2px_8px_rgba(71,85,105,0.35)] text-lg border border-white/80 shrink-0 group-hover:scale-105 transition-transform">
                  🏛️
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-[#1E293B] tracking-wide">مندوب وكالات</span>
                    <span className="text-[9px] bg-gradient-to-r from-[#475569] to-[#334155] text-white font-extrabold px-2 py-0.5 rounded-full shadow-2xs">
                      استدعاء وكلاء 🔱
                    </span>
                  </div>
                  <span className="text-[10px] text-[#475569] font-bold block mt-0.5">صلاحية استدعاء وكلاء رسميين ومتابعة الأرباح والعمولات</span>
                </div>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAgencyRepModalOpen(true);
                }}
                className="flex items-center gap-1.5 text-xs font-black text-[#334155] bg-white/95 border border-[#94A3B8]/60 px-3 py-1.5 rounded-xl shadow-2xs group-hover:bg-gradient-to-r group-hover:from-[#475569] group-hover:to-[#334155] group-hover:text-white group-hover:border-transparent transition-all shrink-0 relative z-10 cursor-pointer active:scale-95"
              >
                <span>إدارة</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          {/* وكالتي (الوكيل الرسمي أو السوبر أدمن) - إدارة المذيعين والوسطاء والعقود - تم نقله ليكون فوق مركز الوسطاء */}
          {(adminRole === 'official_agent' || adminRole === 'super_admin') && (
            <motion.div 
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsAgencyModalOpen(true)}
              className="relative my-2.5 p-[2px] rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#10B981] via-[#F59E0B] to-[#D4AF37] bg-[length:200%_auto] animate-[gradient_4s_linear_infinite] shadow-[0_4px_20px_rgba(16,185,129,0.25),0_0_12px_rgba(212,175,55,0.35)] cursor-pointer group text-right transition-all duration-300"
            >
              {/* شارة تمييز أعلى زاوية المستطيل */}
              <div className="absolute -top-2.5 right-4 z-20">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9.5px] font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white border border-emerald-300/80 shadow-[0_2px_8px_rgba(16,185,129,0.4)] font-sans tracking-wide">
                  <Sparkles className="w-3 h-3 text-amber-300 fill-amber-300 animate-pulse" />
                  <span>لوحة الوكالة الرسمية</span>
                </span>
              </div>

              <div className="bg-gradient-to-br from-[#064E3B]/95 via-[#065F46] to-[#042F2C] text-white rounded-[14px] p-3 sm:p-3.5 flex items-center justify-between border border-emerald-400/40 group-hover:border-emerald-300 group-hover:from-[#065F46] group-hover:to-[#022c22] transition-all duration-300 relative overflow-hidden">
                {/* خلفية جمالية خافتة بتدرج لوني */}
                <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-emerald-400/10 rounded-full blur-xl pointer-events-none" />
                <div className="absolute -left-6 -top-6 w-24 h-24 bg-amber-400/10 rounded-full blur-xl pointer-events-none" />

                <div className="flex items-center gap-3 min-w-0 flex-1 relative z-10">
                  {/* 3D Inner Embossed Plinth مع حواف زمردية وذهبية فاخرة */}
                  <div className="relative w-12 h-12 rounded-xl bg-gradient-to-b from-emerald-900/90 to-slate-950 border border-emerald-400/60 shadow-[0_2px_10px_rgba(0,0,0,0.4),inset_0_1px_2px_rgba(255,255,255,0.2)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <OfficialAgency3DIcon className="w-8 h-8" />
                    <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border border-emerald-950 shadow-xs flex items-center justify-center text-[7px] font-black text-slate-950">
                      ★
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-white group-hover:text-amber-300 transition-colors truncate tracking-wide drop-shadow-xs">
                        وكالتي
                      </h4>
                      <span className="text-[9.5px] font-black bg-gradient-to-r from-amber-400/25 to-amber-500/30 text-amber-200 border border-amber-400/50 px-2 py-0.5 rounded-full shadow-2xs font-mono">
                        وكيل معتمد 💼
                      </span>
                    </div>
                    <span className="text-[10.5px] text-emerald-100/85 font-bold block mt-0.5 truncate">
                      إدارة المذيعين، الوسطاء، العقود والرواتب
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-black text-slate-950 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 border border-amber-200 px-3 py-1.5 rounded-xl shadow-[0_2px_8px_rgba(245,158,11,0.3)] group-hover:scale-105 active:scale-95 transition-all shrink-0 mr-2 relative z-10">
                  <span>إدارة</span>
                  <ChevronLeft className="w-4 h-4 text-slate-950" />
                </div>
              </div>
            </motion.div>
          )}

          {/* وكالة شحن (وكيل شحن معتمد - نفس الطول والعرض والتصميم والمميزات تحت وكالتي مباشرة) */}
          {(adminRole === 'official_agent' || adminRole === 'super_admin') && (
            <motion.div 
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsRechargeAgencyModalOpen(true)}
              className="relative my-2.5 p-[2px] rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#10B981] via-[#F59E0B] to-[#D4AF37] bg-[length:200%_auto] animate-[gradient_4s_linear_infinite] shadow-[0_4px_20px_rgba(16,185,129,0.25),0_0_12px_rgba(212,175,55,0.35)] cursor-pointer group text-right transition-all duration-300"
            >
              {/* شارة تمييز أعلى زاوية المستطيل */}
              <div className="absolute -top-2.5 right-4 z-20">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9.5px] font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white border border-emerald-300/80 shadow-[0_2px_8px_rgba(16,185,129,0.4)] font-sans tracking-wide">
                  <Sparkles className="w-3 h-3 text-amber-300 fill-amber-300 animate-pulse" />
                  <span>لوحة وكالة الشحن المعتمدة</span>
                </span>
              </div>

              <div className="bg-gradient-to-br from-[#064E3B]/95 via-[#065F46] to-[#042F2C] text-white rounded-[14px] p-3 sm:p-3.5 flex items-center justify-between border border-emerald-400/40 group-hover:border-emerald-300 group-hover:from-[#065F46] group-hover:to-[#022c22] transition-all duration-300 relative overflow-hidden">
                {/* خلفية جمالية خافتة بتدرج لوني */}
                <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-emerald-400/10 rounded-full blur-xl pointer-events-none" />
                <div className="absolute -left-6 -top-6 w-24 h-24 bg-amber-400/10 rounded-full blur-xl pointer-events-none" />

                <div className="flex items-center gap-3 min-w-0 flex-1 relative z-10">
                  {/* 3D Realistic Icon Container */}
                  <div className="relative w-12 h-12 rounded-xl bg-gradient-to-b from-emerald-900/90 to-slate-950 border border-emerald-400/60 shadow-[0_2px_10px_rgba(0,0,0,0.4),inset_0_1px_2px_rgba(255,255,255,0.2)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <RechargeAgency3DIcon className="w-8 h-8" />
                    <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border border-emerald-950 shadow-xs flex items-center justify-center text-[7px] font-black text-slate-950">
                      ⚡
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-white group-hover:text-amber-300 transition-colors truncate tracking-wide drop-shadow-xs">
                        وكالة شحن
                      </h4>
                      <span className="text-[9.5px] font-black bg-gradient-to-r from-amber-400/25 to-amber-500/30 text-amber-200 border border-amber-400/50 px-2 py-0.5 rounded-full shadow-2xs font-mono">
                        وكيل شحن معتمد ⚡
                      </span>
                    </div>
                    <span className="text-[10.5px] text-emerald-100/85 font-bold block mt-0.5 truncate">
                      إعادة شحن الكوينزات، سجل التعبئة، والعمليات
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-black text-slate-950 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 border border-amber-200 px-3 py-1.5 rounded-xl shadow-[0_2px_8px_rgba(245,158,11,0.3)] group-hover:scale-105 active:scale-95 transition-all shrink-0 mr-2 relative z-10">
                  <span>إدارة</span>
                  <ChevronLeft className="w-4 h-4 text-slate-950" />
                </div>
              </div>
            </motion.div>
          )}

          {/* 7. مركز الوسطاء (صلاحية وسيط معتمد ممنوحة من وكالتي لحساب ومتابعة المذيعين وعمولات الوساطة) */}
          <motion.div 
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsBrokerCenterModalOpen(true)}
            className="relative my-3 p-[2px] rounded-2xl bg-gradient-to-r from-[#0D404C] via-[#104D5B] to-[#165F6F] shadow-[0_4px_18px_rgba(16,77,91,0.28)] cursor-pointer group transition-all duration-300"
          >
            {/* شارة بارزة للأعلى: نصفها خارج ونصفها داخل المستطيل */}
            <div className="absolute -top-2.5 right-4 z-20">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9.5px] font-black bg-gradient-to-r from-teal-800 via-teal-700 to-cyan-800 text-white border border-teal-300/80 shadow-[0_2px_8px_rgba(16,77,91,0.4)] font-sans tracking-wide">
                <Sparkles className="w-3 h-3 text-teal-300 fill-teal-300 animate-pulse" />
                <span>لوحة الوسيط المعتمد (من وكالتي)</span>
              </span>
            </div>

            <div className="bg-gradient-to-r from-teal-50/90 via-sky-50/80 to-slate-50/90 rounded-[14px] p-3 flex items-center justify-between border border-teal-200/80 group-hover:bg-white transition-all relative overflow-hidden">
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#0D404C] via-[#104D5B] to-[#165F6F] flex items-center justify-center text-white shadow-md text-lg shrink-0 group-hover:scale-105 transition-transform">
                  🤝
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-slate-900 tracking-wide">مركز الوسطاء</span>
                    <span className="text-[9px] bg-[#104D5B] text-white font-extrabold px-2 py-0.5 rounded-full shadow-2xs">
                      صلاحية وسيط 💎
                    </span>
                  </div>
                  <span className="text-[10px] text-[#104D5B] font-bold block mt-0.5">صلاحية ممنوحة من وكالتي لمتابعة المذيعين التابعين لي، ساعات البث، والعمولات المحسوبة</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-black text-[#104D5B] bg-white/90 border border-teal-200 px-3 py-1.5 rounded-xl shadow-2xs group-hover:bg-[#104D5B] group-hover:text-white transition-all shrink-0 relative z-10">
                <span>إدارة</span>
                <ChevronLeft className="w-4 h-4" />
              </div>
            </div>
          </motion.div>

          {/* 8. مركز المذيعين (بتصميم فاخر وألوان جذابة خفيفة تجمع بين الوردي الناعم واللافندر الهادئ) */}
          <motion.div 
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsBroadcasterCenterModalOpen(true)}
            className="relative my-3 p-[2px] rounded-2xl bg-gradient-to-r from-rose-300/85 via-fuchsia-200/80 to-purple-300/85 shadow-[0_4px_18px_rgba(244,63,94,0.12),0_1px_3px_rgba(0,0,0,0.04)] cursor-pointer group transition-all duration-300"
          >
            {/* شارة بارزة للأعلى: نصفها خارج ونصفها داخل المستطيل */}
            <div className="absolute -top-2.5 right-4 z-20">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9.5px] font-black bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 text-white border border-rose-200/60 shadow-[0_2px_8px_rgba(244,63,94,0.25)] font-sans tracking-wide">
                <Sparkles className="w-3 h-3 text-amber-200 fill-amber-200 animate-pulse" />
                <span>لوحة مركز المذيعين</span>
              </span>
            </div>

            <div className="bg-gradient-to-r from-[#FFF5F7] via-[#FAF5FF] to-[#F5F3FF] rounded-[14px] p-3 flex items-center justify-between border border-rose-200/70 group-hover:border-rose-300/90 group-hover:from-white group-hover:to-[#FFF5F7] transition-all relative overflow-hidden">
              {/* لمسات إضاءة خلفية ناعمة وخفيفة */}
              <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-rose-300/15 rounded-full blur-xl pointer-events-none" />
              <div className="absolute -left-6 -top-6 w-24 h-24 bg-purple-300/15 rounded-full blur-xl pointer-events-none" />

              <div className="flex items-center gap-3 relative z-10">
                {/* 3D Realistic Icon Container بتدرج خفيف ومتناسق وألوان فاخرة ناعمة */}
                <div className="relative w-11 h-11 rounded-xl bg-gradient-to-b from-white via-rose-50/70 to-purple-50/90 border border-rose-200/80 shadow-[0_2px_10px_rgba(244,63,94,0.10),inset_0_1px_2px_rgba(255,255,255,1)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <BroadcasterCenter3DIcon className="w-7 h-7 sm:w-8 sm:h-8" />
                  <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-gradient-to-tr from-amber-400 via-amber-300 to-yellow-200 rounded-full border border-white shadow-2xs flex items-center justify-center text-[7.5px] font-black text-amber-950">
                    ★
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-slate-900 group-hover:text-rose-950 transition-colors tracking-wide">
                      مركز المذيعين
                    </span>
                    <span className="text-[9px] bg-gradient-to-r from-rose-100 to-pink-100 text-rose-700 border border-rose-200/80 font-extrabold px-2 py-0.5 rounded-full shadow-2xs font-mono">
                      مُميّز ✨
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-600 font-bold block mt-0.5 group-hover:text-slate-700">
                    إحصائيات البث، الأرباح، والعقود
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-black text-rose-700 bg-white/95 border border-rose-200/90 px-3 py-1.5 rounded-xl shadow-2xs group-hover:bg-gradient-to-r group-hover:from-rose-500 group-hover:to-pink-600 group-hover:text-white group-hover:border-transparent group-hover:shadow-[0_2px_8px_rgba(244,63,94,0.3)] transition-all shrink-0 relative z-10">
                <span>إدارة</span>
                <ChevronLeft className="w-4 h-4" />
              </div>
            </div>
          </motion.div>



        </div>

        {/* Copyright Notice */}
        <div className="text-center py-4 text-[10px] text-slate-400 font-medium flex flex-col items-center justify-center gap-1.5 border-t border-slate-200/50 mt-2">
          <div className="flex items-center gap-2">
            <NajmLogo size="sm" className="scale-75" />
            <span className="font-extrabold text-[#5C3F13] text-xs">تطبيق النجم (Al-Najm)</span>
          </div>
          <span className="text-[10px] text-slate-400">
            جميع حقوق الملكية الفكرية والعلامة التجارية مسجلة ومحفوظة © 2026 للمالك والمطور
          </span>
        </div>

      </div>
      </>
      )}

      {/* Fixed Bottom Navigation Bar (RTL Order from Right to Left) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-4 py-2 flex items-center justify-around z-40 max-w-md mx-auto shadow-lg" dir="rtl">
        {/* 1. Far Right (أقصى اليمين): Home / الرئيسية */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-0.5 cursor-pointer transition-all ${
            activeTab === 'home' ? 'text-slate-950 font-black' : 'text-slate-400 hover:text-slate-700 font-medium'
          }`}
        >
          <div className="p-1 transition-all">
            <Home className={`w-6 h-6 ${activeTab === 'home' ? 'fill-slate-950 text-slate-950' : ''}`} />
          </div>
          <span className="text-[10px] leading-none">الرئيسية</span>
        </button>

        {/* 2. 2nd from Right (الثاني من اليمين): Explore / استكشاف */}
        <button
          onClick={() => setActiveTab('explore')}
          className={`flex flex-col items-center gap-0.5 cursor-pointer transition-all ${
            activeTab === 'explore' ? 'text-slate-950 font-black' : 'text-slate-400 hover:text-slate-700 font-medium'
          }`}
        >
          <div className="p-1 transition-all">
            <Compass className={`w-6 h-6 ${activeTab === 'explore' ? 'text-slate-950 stroke-[2.5]' : ''}`} />
          </div>
          <span className="text-[10px] leading-none">استكشاف</span>
        </button>

        {/* 3. 3rd from Right (الثالث من اليمين): Moments/Favorites / لحظات */}
        <button
          onClick={() => setActiveTab('games')}
          className={`flex flex-col items-center gap-0.5 cursor-pointer transition-all ${
            activeTab === 'games' ? 'text-slate-950 font-black' : 'text-slate-400 hover:text-slate-700 font-medium'
          }`}
        >
          <div className="p-1 transition-all">
            <Star className={`w-6 h-6 ${activeTab === 'games' ? 'text-slate-950 fill-slate-950' : ''}`} />
          </div>
          <span className="text-[10px] leading-none">لحظات</span>
        </button>

        {/* 4. 4th from Right (الرابع من اليمين): Messages / المحادثات with Red Notification Badge */}
        <button
          onClick={() => setActiveTab('messages')}
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

        {/* 5. Far Left (أقصى اليسار): Profile / أنا */}
        <button
          onClick={() => setActiveTab('profile')}
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

      {/* Recharge Top-Up Modal */}
      <RechargeModal
        isOpen={isRechargeModalOpen}
        onClose={() => setIsRechargeModalOpen(false)}
        onSuccessRecharge={(addedCoins) => {
          setCoinsBalance((prev) => {
            const next = prev + addedCoins;
            try {
              localStorage.setItem('user_wallet_coins', next.toString());
              window.dispatchEvent(
                new CustomEvent('user_coins_updated', {
                  detail: { coins: next }
                })
              );
            } catch {}
            return next;
          });
        }}
      />

      {/* Modals & Dialogs */}
      <StatDetailModal
        isOpen={activeStatModal !== null}
        onClose={() => setActiveStatModal(null)}
        activeStat={activeStatModal}
        visitors={MOCK_VISITORS}
        friends={MOCK_FRIENDS}
        followers={MOCK_FOLLOWERS}
        likes={MOCK_LIKES}
      />

      <BadgeDetailModal badge={selectedBadge} onClose={() => setSelectedBadge(null)} />

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profile={profile}
        currentUser={{
          name: profile.name,
          country: profile.country || 'اليمن',
          bio: profile.bio,
          avatar: profile.avatarUrl
        }}
        onSave={handleSaveProfile}
      />

      {/* User Profile Detail Modal */}
      <UserProfileModal
        isOpen={isUserProfileModalOpen}
        onClose={() => setIsUserProfileModalOpen(false)}
        onOpenFamily={() => setIsFamilyModalOpen(true)}
        userProfile={profile}
      />

      {/* Services Modals */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onOpenCustomerService={() => setIsCustomerServiceModalOpen(true)}
      />

      <CustomerServiceModal
        isOpen={isCustomerServiceModalOpen}
        onClose={() => setIsCustomerServiceModalOpen(false)}
      />

      <SuperLegendModal
        isOpen={isSuperLegendModalOpen}
        onClose={() => setIsSuperLegendModalOpen(false)}
        onOpenRecharge={() => setIsRechargeModalOpen(true)}
      />

      <UserLevelModal
        isOpen={isLevelModalOpen}
        onClose={() => setIsLevelModalOpen(false)}
        level={113}
        userName={profile.name || "(عابر سبيل)"}
        avatarUrl={profile.avatarUrl}
      />

      <FamilyModal
        isOpen={isFamilyModalOpen}
        onClose={() => setIsFamilyModalOpen(false)}
      />

      <BadgesCenterModal
        isOpen={isBadgesCenterModalOpen}
        onClose={() => setIsBadgesCenterModalOpen(false)}
        userName={profile.name || "(عابر سبيل)"}
        avatarUrl={profile.avatarUrl}
        badges={profile.badges}
        onSelectBadge={(badge) => setSelectedBadge(badge)}
      />

      <AppearanceModal
        isOpen={isAppearanceModalOpen}
        onClose={() => setIsAppearanceModalOpen(false)}
        avatarUrl={profile.avatarUrl}
        userName={profile.name || "عابر سبيل"}
      />

      <VipCenterModal
        isOpen={isVipCenterModalOpen}
        onClose={() => setIsVipCenterModalOpen(false)}
        profile={profile}
        onUpgrade={(newVipLevel) => {
          const updated = { ...profile, vipLevel: newVipLevel, vipTier: newVipLevel };
          setProfile(updated);
          localStorage.setItem('user_profile_data', JSON.stringify({
            ...updated,
            avatar: updated.avatarUrl
          }));
        }}
      />

      <AgencyModal
        isOpen={isAgencyModalOpen}
        onClose={() => setIsAgencyModalOpen(false)}
        userAvatar={profile.avatarUrl}
        userName={profile.name}
        agencyGid="30032"
      />

      {/* مودال وكالة شحن */}
      <RechargeAgencyModal
        isOpen={isRechargeAgencyModalOpen}
        onClose={() => setIsRechargeAgencyModalOpen(false)}
        currentUserCoins={coinsBalance}
      />

      {/* لوحة السوبر أدمن (المالك والمبرمج) - مشروطة حصراً به */}
      <SuperAdminControlModal
        isOpen={isSuperAdminModalOpen}
        onClose={() => setIsSuperAdminModalOpen(false)}
        currentUserId={profile.userId}
        onOpenAgencyModal={() => setIsAgencyAdminModalOpen(true)}
        onOpenThemeModal={() => setIsThemeAdminModalOpen(true)}
        onOpenModeratorModal={() => setIsModeratorModalOpen(true)}
      />

      {/* لوحة إداري الوكالات */}
      <AgencyAdminDashboardModal
        isOpen={isAgencyAdminModalOpen}
        onClose={() => setIsAgencyAdminModalOpen(false)}
      />

      {/* لوحة إداري الثيمات والمتجر ورفع الـ VIP المعتمدة */}
      <StoreAndThemeAdminModal
        isOpen={isThemeAdminModalOpen}
        onClose={() => setIsThemeAdminModalOpen(false)}
        userId={profile.userId}
        isSuperAdmin={isOwner || adminRole === 'super_admin'}
      />

      {/* مركز ولوحة مدير الوكالات الرسمية والمندوبين (فتح الصلاحيات والتوثيق) */}
      <OfficialAgencyManagerModal
        isOpen={isOfficialAgencyManagerModalOpen}
        onClose={() => setIsOfficialAgencyManagerModalOpen(false)}
        managerId={profile.userId}
        managerName={profile.nickname || profile.name}
        managerAvatar={profile.avatarUrl}
        isSuperAdmin={isOwner || adminRole === 'super_admin'}
      />

      {/* مركز ولوحة مندوب الوكالات الرسمية (استدعاء الوكلاء والعمولات) */}
      <AgencyRepresentativeModal
        isOpen={isAgencyRepModalOpen}
        onClose={() => setIsAgencyRepModalOpen(false)}
        repId={profile.userId}
        repName={profile.nickname || profile.name}
        repAvatar={profile.avatarUrl}
        isSuperAdmin={isOwner || adminRole === 'super_admin'}
      />

      {/* لوحة المراقب العام والدعم */}
      <ModeratorDashboardModal
        isOpen={isModeratorModalOpen}
        onClose={() => setIsModeratorModalOpen(false)}
        userId={profile.userId}
      />

      {/* مركز الوساطة والتوظيف للوسطاء */}
      <BrokerCenterModal
        isOpen={isBrokerCenterModalOpen}
        onClose={() => setIsBrokerCenterModalOpen(false)}
      />

      {/* مركز المذيعين - شاشة كاملة احترافية */}
      <BroadcasterCenterModal
        isOpen={isBroadcasterCenterModalOpen}
        onClose={() => setIsBroadcasterCenterModalOpen(false)}
        userName={profile.name}
        userAvatar={profile.avatarUrl}
        userId={profile.userId}
      />

      {/* تميز النجم - الذكاء والتحليلات ولوحة الشرف */}
      <GeniusNajmModal
        isOpen={isGeniusModalOpen || activeServiceModal === 'genius'}
        onClose={() => {
          setIsGeniusModalOpen(false);
          if (activeServiceModal === 'genius') setActiveServiceModal(null);
        }}
        currentUserName={profile.name}
        currentUserAvatar={profile.avatarUrl}
        currentUserId={profile.userId}
      />

      {/* نقاط ودية - الرصيد والمزايا والمهام */}
      <FriendlyPointsModal
        isOpen={isFriendlyPointsModalOpen || activeServiceModal === 'friendly_points'}
        onClose={() => {
          setIsFriendlyPointsModalOpen(false);
          if (activeServiceModal === 'friendly_points') setActiveServiceModal(null);
        }}
        currentUserName={profile.name}
        currentUserAvatar={profile.avatarUrl}
      />

      {/* المركز التجاري - المتجر الملكي (إطارات، سيارات، فقاعات، ملصقات) */}
      <MallCenterModal
        isOpen={isMallModalOpen || activeServiceModal === 'mall'}
        onClose={() => {
          setIsMallModalOpen(false);
          if (activeServiceModal === 'mall') setActiveServiceModal(null);
        }}
        userName={profile.name}
        userAvatar={profile.avatarUrl}
        coinsBalance={30}
        onRechargeClick={() => {
          setIsMallModalOpen(false);
          setIsRechargeModalOpen(true);
        }}
      />

      <ServicesModal
        activeService={activeServiceModal}
        onClose={() => setActiveServiceModal(null)}
      />

      {/* GLOBAL PERSISTENT VOICE ROOM (يبقى محملاً بالخلفية عند اختيار "احتفاظ" لضمان استمرار الصوت والميكروفون والتفاعل دون انقطاع) */}
      {activeVoiceRoom && (
        <div
          id="global-voice-room-container"
          className={
            isRoomMinimized
              ? 'opacity-0 pointer-events-none invisible fixed inset-0 -z-50'
              : 'opacity-100 pointer-events-auto visible fixed inset-0 z-50'
          }
        >
          <VoiceRoomScreen
            roomTitle={activeVoiceRoom.title}
            hostName={activeVoiceRoom.host}
            roomId={activeVoiceRoom.id}
            isOwner={Boolean(activeVoiceRoom.isOwner || activeVoiceRoom.ownerId === profile.userId)}
            currentUserName={profile.name}
            currentUserAvatar={profile.avatarUrl}
            currentUserVip={profile.vipTier || 'VIP6'}
            onClose={() => {
              queueMicrotask(() => {
                setActiveVoiceRoom(null);
                setIsRoomMinimized(false);
                exitRoomSession();
              });
            }}
            onMinimize={() => {
              queueMicrotask(() => {
                setIsRoomMinimized(true);
                minimizeRoomSession();
              });
            }}
            onOpenRecharge={() => {
              queueMicrotask(() => {
                setIsRechargeModalOpen(true);
              });
            }}
          />
        </div>
      )}

      {/* GLOBAL FLOATING CIRCULAR ROOM BUBBLE (تطفو فوق كل القوائم والشاشات بدون استثناء وعند النقر ترجع المستخدم فوراً للروم) */}
      {activeVoiceRoom && isRoomMinimized && (
        <FloatingRoomWidget
          onExpand={() => {
            setIsRoomMinimized(false);
            maximizeRoomSession();
          }}
          onExit={() => {
            setActiveVoiceRoom(null);
            setIsRoomMinimized(false);
            exitRoomSession();
          }}
        />
      )}
    </div>
  );
};

