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
  Heart
} from 'lucide-react';
import { UserProfileData, StatItem, BadgeInfo } from '../types';
import { INITIAL_USER_PROFILE, MOCK_VISITORS, MOCK_FRIENDS, MOCK_FOLLOWERS, MOCK_LIKES } from '../data/mockData';
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
  Mall3DIcon
} from './profile/RealisticIcons';
import { RechargeModal } from './RechargeModal';
import { SuperLegendModal } from './SuperLegendModal';
import { SettingsModal } from './SettingsModal';
import { TarafLogo } from './common/TarafLogo';
import { CustomerServiceModal } from './CustomerServiceModal';
import { DevPanelModal } from './DevPanelModal';
import { UserProfileModal } from './UserProfileModal';
import { VipCenterModal } from './VipCenterModal';
import { AgencyModal } from './AgencyModal';
import { BrokerCenterModal } from './BrokerCenterModal';
import { SuperAdminControlModal } from './SuperAdminControlModal';
import { AgencyAdminDashboardModal } from './AgencyAdminDashboardModal';
import { ThemeAdminDashboardModal } from './ThemeAdminDashboardModal';
import { ModeratorDashboardModal } from './ModeratorDashboardModal';
import { BroadcasterCenterModal } from './BroadcasterCenterModal';
import { HomeScreen } from './HomeScreen';
import { ExploreScreen } from './ExploreScreen';
import { GamesScreen } from './GamesScreen';
import { MessagesScreen } from './MessagesScreen';
import { FloatingRoomWidget } from './FloatingRoomWidget';
import { subscribeToRoomSession, maximizeRoomSession, ActiveRoomSession } from '../lib/roomSessionService';
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
          setProfile((prev) => ({
            ...prev,
            name: parsed.name || prev.name,
            bio: parsed.bio || prev.bio,
            country: parsed.country || prev.country,
            avatarUrl: parsed.avatar || parsed.avatarUrl || prev.avatarUrl,
          }));
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
  const [activeTab, setActiveTab] = useState<'home' | 'explore' | 'games' | 'messages' | 'profile'>('profile');
  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState(false);
  const [coinsBalance, setCoinsBalance] = useState<number>(52500);
  const [diamondsBalance, setDiamondsBalance] = useState<number>(8377);

  // Services Row Modals State
  const [isUserProfileModalOpen, setIsUserProfileModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isCustomerServiceModalOpen, setIsCustomerServiceModalOpen] = useState(false);
  const [isDevPanelModalOpen, setIsDevPanelModalOpen] = useState(false);
  const [isSuperAdminModalOpen, setIsSuperAdminModalOpen] = useState(false);
  const [isAgencyAdminModalOpen, setIsAgencyAdminModalOpen] = useState(false);
  const [isThemeAdminModalOpen, setIsThemeAdminModalOpen] = useState(false);
  const [isModeratorModalOpen, setIsModeratorModalOpen] = useState(false);
  const [isBrokerCenterModalOpen, setIsBrokerCenterModalOpen] = useState(false);
  const [isSuperLegendModalOpen, setIsSuperLegendModalOpen] = useState(false);
  const [isLevelModalOpen, setIsLevelModalOpen] = useState(false);
  const [isFamilyModalOpen, setIsFamilyModalOpen] = useState(false);
  const [isBadgesCenterModalOpen, setIsBadgesCenterModalOpen] = useState(false);
  const [isAppearanceModalOpen, setIsAppearanceModalOpen] = useState(false);
  const [isVipCenterModalOpen, setIsVipCenterModalOpen] = useState(false);
  const [isAgencyModalOpen, setIsAgencyModalOpen] = useState(false);
  const [isBroadcasterCenterModalOpen, setIsBroadcasterCenterModalOpen] = useState(false);
  const [minimizedRoomSession, setMinimizedRoomSession] = useState<ActiveRoomSession | null>(null);
  
  // Dynamic Role State
  const [adminRole, setAdminRole] = useState<AdminRole>(() => getAdminRoleForUser(profile.userId));

  useEffect(() => {
    setAdminRole(getAdminRoleForUser(profile.userId));
    const unsubscribe = subscribeToAdminRoles(() => {
      setAdminRole(getAdminRoleForUser(profile.userId));
    });
    const handlePersonaSwitched = () => {
      setAdminRole(getAdminRoleForUser(profile.userId));
    };
    window.addEventListener('testing_user_switched', handlePersonaSwitched);
    return () => {
      unsubscribe();
      window.removeEventListener('testing_user_switched', handlePersonaSwitched);
    };
  }, [profile.userId]);

  const isOwner = isOwnerOrSuperAdmin(profile.userId);

  useEffect(() => {
    const unsub = subscribeToRoomSession((session) => {
      setMinimizedRoomSession(session && session.isMinimized ? session : null);
    });
    return unsub;
  }, []);
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
        <HomeScreen onOpenRecharge={() => setIsRechargeModalOpen(true)} />
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

            {/* Statistics 4 Columns Row - Cute Small Square Cards in Dark-White (أيقونات صغيرة مربعة بلون أبيض غامق وأرقام إنجليزية) */}
            <div className="grid grid-cols-4 gap-2 text-center mt-5 mb-2 px-1">
              {/* 1. Visitors / الزوار */}
              <div
                onClick={() => setActiveStatModal('visitors')}
                className="bg-[#E9EEF4] border border-[#CBD5E1] hover:bg-[#DEE6F0] rounded-2xl p-2.5 flex flex-col items-center justify-center transition-all cursor-pointer active:scale-95 shadow-xs group"
              >
                <div className="w-6 h-6 rounded-full bg-slate-300/70 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                  <Eye className="w-3.5 h-3.5 text-slate-700" />
                </div>
                <div className="text-sm sm:text-base font-black text-slate-900 font-mono leading-tight tracking-tight">
                  {profile.stats.visitors.toLocaleString('en-US')}
                </div>
                <div className="text-[10px] text-slate-600 font-bold mt-0.5 whitespace-nowrap">الزوار</div>
              </div>

              {/* 2. Friends / أصدقاء */}
              <div
                onClick={() => setActiveStatModal('friends')}
                className="bg-[#E9EEF4] border border-[#CBD5E1] hover:bg-[#DEE6F0] rounded-2xl p-2.5 flex flex-col items-center justify-center transition-all cursor-pointer active:scale-95 shadow-xs group"
              >
                <div className="w-6 h-6 rounded-full bg-slate-300/70 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                  <Users className="w-3.5 h-3.5 text-slate-700" />
                </div>
                <div className="text-sm sm:text-base font-black text-slate-900 font-mono leading-tight tracking-tight">
                  {profile.stats.friends.toLocaleString('en-US')}
                </div>
                <div className="text-[10px] text-slate-600 font-bold mt-0.5 whitespace-nowrap">أصدقاء</div>
              </div>

              {/* 3. Followers / تمت المتابعة */}
              <div
                onClick={() => setActiveStatModal('followers')}
                className="bg-[#E9EEF4] border border-[#CBD5E1] hover:bg-[#DEE6F0] rounded-2xl p-2.5 flex flex-col items-center justify-center transition-all cursor-pointer active:scale-95 shadow-xs group"
              >
                <div className="w-6 h-6 rounded-full bg-slate-300/70 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                  <UserCheck className="w-3.5 h-3.5 text-slate-700" />
                </div>
                <div className="text-sm sm:text-base font-black text-slate-900 font-mono leading-tight tracking-tight">
                  {profile.stats.followers.toLocaleString('en-US')}
                </div>
                <div className="text-[10px] text-slate-600 font-bold mt-0.5 whitespace-nowrap">تمت المتابعة</div>
              </div>

              {/* 4. Likes / المعجبون */}
              <div
                onClick={() => setActiveStatModal('likes')}
                className="bg-[#E9EEF4] border border-[#CBD5E1] hover:bg-[#DEE6F0] rounded-2xl p-2.5 flex flex-col items-center justify-center transition-all cursor-pointer active:scale-95 shadow-xs group"
              >
                <div className="w-6 h-6 rounded-full bg-rose-200/70 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                  <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-500/40" />
                </div>
                <div className="text-sm sm:text-base font-black text-slate-900 font-mono leading-tight tracking-tight">
                  {profile.stats.likes.toLocaleString('en-US')}
                </div>
                <div className="text-[10px] text-slate-600 font-bold mt-0.5 whitespace-nowrap">المعجبون</div>
              </div>
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
            <div className="grid grid-cols-2 gap-3">
              {/* Recharge / Coins Card (Appears on the RIGHT in RTL - English Numbers) */}
              <div
                onClick={() => setIsRechargeModalOpen(true)}
                className="bg-gradient-to-b from-white via-amber-50/30 to-amber-100/20 rounded-2xl p-3.5 shadow-xs border border-amber-200/60 flex items-center justify-between cursor-pointer hover:shadow-md hover:border-amber-300/80 transition-all group"
              >
                <ChevronLeft className="w-4 h-4 text-amber-300 shrink-0 group-hover:-translate-x-0.5 transition-transform" />
                <div className="text-center flex-1 px-2">
                  <div className="text-xl font-black text-amber-600 tracking-tight leading-none drop-shadow-[0_1px_2px_rgba(217,119,6,0.25)] font-mono">
                    {coinsBalance.toLocaleString('en-US')}
                  </div>
                  <div className="text-xs text-amber-900/60 font-bold mt-1">
                    شحن
                  </div>
                </div>
                {/* 3D Shiny Gold Coin Icon Container */}
                <div className="relative w-11 h-11 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 p-0.5 shadow-[0_0_12px_rgba(245,158,11,0.35)] border border-yellow-200 shrink-0 flex items-center justify-center">
                  <svg className="w-8 h-8 drop-shadow-md" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="18" cy="18" r="16" fill="url(#gold_coin_outer)" stroke="#FEF3C7" strokeWidth="1.5"/>
                    <circle cx="18" cy="18" r="12" fill="url(#gold_coin_inner)" stroke="#D97706" strokeWidth="1"/>
                    <path d="M18 10L20.2 14.8L25.5 15.4L21.5 19L22.6 24.2L18 21.5L13.4 24.2L14.5 19L10.5 15.4L15.8 14.8L18 10Z" fill="url(#gold_coin_star)"/>
                    <defs>
                      <linearGradient id="gold_coin_outer" x1="4" y1="4" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#FBBF24"/>
                        <stop offset="0.5" stopColor="#F59E0B"/>
                        <stop offset="1" stopColor="#B45309"/>
                      </linearGradient>
                      <linearGradient id="gold_coin_inner" x1="8" y1="8" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#FEF08A"/>
                        <stop offset="0.5" stopColor="#F59E0B"/>
                        <stop offset="1" stopColor="#92400E"/>
                      </linearGradient>
                      <linearGradient id="gold_coin_star" x1="12" y1="10" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#FFFBEB"/>
                        <stop offset="1" stopColor="#FBBF24"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>

              {/* Diamonds Card (Appears on the LEFT in RTL - English Numbers) */}
              <div
                onClick={() => setIsRechargeModalOpen(true)}
                className="bg-gradient-to-b from-white via-sky-50/30 to-sky-100/20 rounded-2xl p-3.5 shadow-xs border border-sky-200/60 flex items-center justify-between cursor-pointer hover:shadow-md hover:border-sky-300/80 transition-all group"
              >
                <ChevronLeft className="w-4 h-4 text-sky-300 shrink-0 group-hover:-translate-x-0.5 transition-transform" />
                <div className="text-center flex-1 px-2">
                  <div className="text-xl font-black text-sky-600 tracking-tight leading-none drop-shadow-[0_1px_2px_rgba(2,132,199,0.25)] font-mono">
                    {diamondsBalance.toLocaleString('en-US')}
                  </div>
                  <div className="text-xs text-sky-900/60 font-bold mt-1">
                    ألماس
                  </div>
                </div>
                {/* Crystal Glowing Diamond Icon Container */}
                <div className="relative w-11 h-11 rounded-full bg-gradient-to-tr from-blue-600 via-sky-400 to-cyan-300 p-0.5 shadow-[0_0_14px_rgba(56,189,248,0.45)] border border-sky-200 shrink-0 flex items-center justify-center">
                  <svg className="w-8 h-8 drop-shadow-md" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L28 14L18 30L8 14L18 6Z" fill="url(#diamond_base)"/>
                    <path d="M18 6L28 14H8L18 6Z" fill="url(#diamond_top)"/>
                    <path d="M18 6L14 14H22L18 6Z" fill="url(#diamond_center_top)"/>
                    <path d="M18 30L8 14H18V30Z" fill="url(#diamond_left_bottom)"/>
                    <path d="M18 30L28 14H18V30Z" fill="url(#diamond_right_bottom)"/>
                    {/* Glint Sparkle */}
                    <circle cx="23" cy="11" r="1.5" fill="white" opacity="0.9"/>
                    <defs>
                      <linearGradient id="diamond_base" x1="8" y1="6" x2="28" y2="30" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#38BDF8"/>
                        <stop offset="0.5" stopColor="#0284C7"/>
                        <stop offset="1" stopColor="#0369A1"/>
                      </linearGradient>
                      <linearGradient id="diamond_top" x1="8" y1="6" x2="28" y2="14" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#E0F2FE"/>
                        <stop offset="1" stopColor="#38BDF8"/>
                      </linearGradient>
                      <linearGradient id="diamond_center_top" x1="14" y1="6" x2="22" y2="14" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FFFFFF"/>
                    <stop offset="1" stopColor="#7DD3FC"/>
                  </linearGradient>
                  <linearGradient id="diamond_left_bottom" x1="8" y1="14" x2="18" y2="30" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#0284C7"/>
                    <stop offset="1" stopColor="#0C4A6E"/>
                  </linearGradient>
                  <linearGradient id="diamond_right_bottom" x1="18" y1="14" x2="28" y2="30" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#38BDF8"/>
                    <stop offset="1" stopColor="#0284C7"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>

        {/* 4 Rectangular Action Cards arranged 2 on the right and 2 on the left (2x2 grid) with Luxury Gold / Champagne Broadcaster Center styling */}
        <div className="grid grid-cols-2 gap-2.5" dir="rtl">
          {/* Right Column Top: مستوى المستخدم */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setIsLevelModalOpen(true)}
            className="bg-white/80 backdrop-blur-md hover:bg-white/95 border border-[#E8DFC8]/90 rounded-2xl p-2.5 sm:p-3 flex items-center justify-between shadow-[0_4px_16px_rgba(180,160,130,0.12),inset_0_1px_2px_rgba(255,255,255,1)] hover:shadow-[0_6px_20px_rgba(180,160,130,0.22)] active:scale-95 transition-all cursor-pointer group text-right"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {/* 3D Inner Embossed Plinth */}
              <div className="relative w-11 h-11 rounded-xl bg-gradient-to-b from-white/95 to-[#FAF5E8] border border-[#E8DFC8] shadow-[0_2px_6px_rgba(0,0,0,0.03),inset_0_1px_2px_rgba(255,255,255,1)] flex items-center justify-center shrink-0">
                <UserLevel3DIcon className="w-8 h-8" />
                <span className="absolute -bottom-1 -right-1 bg-gradient-to-r from-[#C89228] to-[#7E4F0B] text-[#FFF9E6] font-black text-[8px] px-1.5 py-0.2 rounded-full border border-white shadow-xs font-mono">
                  25
                </span>
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-black text-[#5C3F13] group-hover:text-[#B38022] transition-colors truncate">
                  مستوى المستخدم
                </h4>
                <span className="text-[10px] text-[#A89478] font-bold block truncate">
                  المستوى 25 • 82%
                </span>
              </div>
            </div>
            <ChevronLeft className="w-4 h-4 text-[#D1C2A5] group-hover:text-[#B38022] transition-colors shrink-0 mr-0.5" />
          </motion.button>

          {/* Left Column Top: الشارات */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setIsBadgesCenterModalOpen(true)}
            className="bg-white/80 backdrop-blur-md hover:bg-white/95 border border-[#E8DFC8]/90 rounded-2xl p-2.5 sm:p-3 flex items-center justify-between shadow-[0_4px_16px_rgba(180,160,130,0.12),inset_0_1px_2px_rgba(255,255,255,1)] hover:shadow-[0_6px_20px_rgba(180,160,130,0.22)] active:scale-95 transition-all cursor-pointer group text-right"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {/* 3D Inner Embossed Plinth */}
              <div className="relative w-11 h-11 rounded-xl bg-gradient-to-b from-white/95 to-[#FAF5E8] border border-[#E8DFC8] shadow-[0_2px_6px_rgba(0,0,0,0.03),inset_0_1px_2px_rgba(255,255,255,1)] flex items-center justify-center shrink-0">
                <Badges3DIcon className="w-8 h-8" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border border-white animate-pulse" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-black text-[#5C3F13] group-hover:text-[#B38022] transition-colors truncate">
                  الشارات
                </h4>
                <span className="text-[10px] text-[#A89478] font-bold block truncate">
                  الأوسمة والجوائز
                </span>
              </div>
            </div>
            <ChevronLeft className="w-4 h-4 text-[#D1C2A5] group-hover:text-[#B38022] transition-colors shrink-0 mr-0.5" />
          </motion.button>

          {/* Right Column Bottom: العائلات */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setIsFamilyModalOpen(true)}
            className="bg-white/80 backdrop-blur-md hover:bg-white/95 border border-[#E8DFC8]/90 rounded-2xl p-2.5 sm:p-3 flex items-center justify-between shadow-[0_4px_16px_rgba(180,160,130,0.12),inset_0_1px_2px_rgba(255,255,255,1)] hover:shadow-[0_6px_20px_rgba(180,160,130,0.22)] active:scale-95 transition-all cursor-pointer group text-right"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {/* 3D Inner Embossed Plinth */}
              <div className="relative w-11 h-11 rounded-xl bg-gradient-to-b from-white/95 to-[#FAF5E8] border border-[#E8DFC8] shadow-[0_2px_6px_rgba(0,0,0,0.03),inset_0_1px_2px_rgba(255,255,255,1)] flex items-center justify-center shrink-0">
                <Families3DIcon className="w-8 h-8" />
                <span className="absolute -bottom-1 -right-1 bg-gradient-to-r from-[#B38022] to-[#5C3F13] text-[#FFF9E6] font-black text-[8px] px-1.5 py-0.2 rounded-full border border-white shadow-xs font-mono">
                  Lv12
                </span>
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-black text-[#5C3F13] group-hover:text-[#B38022] transition-colors truncate">
                  العائلات
                </h4>
                <span className="text-[10px] text-[#A89478] font-bold block truncate">
                  عائلة فرسان المجد
                </span>
              </div>
            </div>
            <ChevronLeft className="w-4 h-4 text-[#D1C2A5] group-hover:text-[#B38022] transition-colors shrink-0 mr-0.5" />
          </motion.button>

          {/* Left Column Bottom: مظهري */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setIsAppearanceModalOpen(true)}
            className="bg-white/80 backdrop-blur-md hover:bg-white/95 border border-[#E8DFC8]/90 rounded-2xl p-2.5 sm:p-3 flex items-center justify-between shadow-[0_4px_16px_rgba(180,160,130,0.12),inset_0_1px_2px_rgba(255,255,255,1)] hover:shadow-[0_6px_20px_rgba(180,160,130,0.22)] active:scale-95 transition-all cursor-pointer group text-right"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {/* 3D Inner Embossed Plinth */}
              <div className="relative w-11 h-11 rounded-xl bg-gradient-to-b from-white/95 to-[#FAF5E8] border border-[#E8DFC8] shadow-[0_2px_6px_rgba(0,0,0,0.03),inset_0_1px_2px_rgba(255,255,255,1)] flex items-center justify-center shrink-0">
                <Appearance3DIcon className="w-8 h-8" />
                <span className="absolute -top-1 -left-1 w-3.5 h-3.5 bg-gradient-to-tr from-amber-400 to-yellow-200 rounded-full border border-white flex items-center justify-center shadow-xs">
                  <Sparkles className="w-2 h-2 text-[#5C3F13] fill-[#5C3F13]" />
                </span>
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-black text-[#5C3F13] group-hover:text-[#B38022] transition-colors truncate">
                  مظهري
                </h4>
                <span className="text-[10px] text-[#A89478] font-bold block truncate">
                  الإطارات والدخوليات
                </span>
              </div>
            </div>
            <ChevronLeft className="w-4 h-4 text-[#D1C2A5] group-hover:text-[#B38022] transition-colors shrink-0 mr-0.5" />
          </motion.button>
        </div>

        {/* Mini Games Strip */}
        <div className="bg-white rounded-2xl p-3 shadow-xs border border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <ChevronLeft className="w-4 h-4 text-slate-300 shrink-0" />
          <div className="flex items-center gap-2 flex-1 overflow-x-auto no-scrollbar py-1">
            {gamesList.map((game) => (
              <div
                key={game.id}
                className="shrink-0 w-16 text-center cursor-pointer group"
              >
                <div className={`w-14 h-14 mx-auto rounded-2xl ${game.bg} flex items-center justify-center text-2xl shadow-xs group-hover:scale-105 transition-transform`}>
                  {game.emoji}
                </div>
                <span className="text-[9px] font-extrabold text-slate-600 block mt-1 truncate">
                  {game.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* قائمة الخيارات والخدمات */}
        <div className="bg-white border border-slate-200 rounded-3xl p-2 space-y-1 shadow-xs" dir="rtl">
          
          {/* الأزرار الديناميكية المشروطة بالصلاحيات (تظهر حصراً لأصحاب الصلاحية وتختفي تماماً عن المستخدم العادي) */}
          
          {/* 1. إداري الوكالات (Agency Admin) */}
          {adminRole === 'agency_admin' && (
            <motion.div 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsAgencyAdminModalOpen(true)}
              className="my-1.5 bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 border-2 border-blue-500/60 rounded-2xl p-3.5 flex items-center justify-between shadow-lg cursor-pointer hover:border-blue-400 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 border border-blue-400 flex items-center justify-center text-white shadow-md text-lg">
                  🏛️
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-white tracking-wide">لوحة إدارة الوكالات</span>
                    <span className="text-[9px] text-blue-200 bg-blue-500/30 px-2 py-0.5 rounded-md border border-blue-400/40 font-bold">
                      إداري وكالات 🏛️
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-300">متابعة واعتماد الوكالات، مراقبة التارغت والوسطاء</span>
                </div>
              </div>
              <span className="text-xs font-bold text-blue-100 bg-blue-600/70 px-3 py-1.5 rounded-xl border border-blue-400/50 flex items-center gap-1 shadow-inner group-hover:bg-blue-600 transition-all">
                دخول <ChevronLeft className="w-3.5 h-3.5" />
              </span>
            </motion.div>
          )}

          {/* 2. إداري الثيمات والمتجر (Theme Admin) */}
          {adminRole === 'theme_admin' && (
            <motion.div 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsThemeAdminModalOpen(true)}
              className="my-1.5 bg-gradient-to-r from-slate-950 via-slate-900 to-pink-950 border-2 border-pink-500/60 rounded-2xl p-3.5 flex items-center justify-between shadow-lg cursor-pointer hover:border-pink-400 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-600 border border-pink-400 flex items-center justify-center text-white shadow-md text-lg">
                  🎨
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-white tracking-wide">لوحة إدارة الثيمات والمتجر</span>
                    <span className="text-[9px] text-pink-200 bg-pink-500/30 px-2 py-0.5 rounded-md border border-pink-400/40 font-bold">
                      إداري ثيمات 🎨
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-300">تصاميم الغرف الصوتية، لوحات الشرف، وعناصر المتجر</span>
                </div>
              </div>
              <span className="text-xs font-bold text-pink-100 bg-pink-600/70 px-3 py-1.5 rounded-xl border border-pink-400/50 flex items-center gap-1 shadow-inner group-hover:bg-pink-600 transition-all">
                دخول <ChevronLeft className="w-3.5 h-3.5" />
              </span>
            </motion.div>
          )}

          {/* 3. الوكيل الرسمي (Official Agent) أو السوبر أدمن */}
          {(adminRole === 'official_agent' || adminRole === 'super_admin') && (
            <motion.div 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsAgencyModalOpen(true)}
              className="my-1.5 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border-2 border-indigo-500/60 rounded-2xl p-3.5 flex items-center justify-between shadow-lg cursor-pointer hover:border-indigo-400 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 border border-indigo-400 flex items-center justify-center text-white shadow-md text-lg">
                  💼
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-white tracking-wide">وكالتي</span>
                    <span className="text-[9px] text-indigo-200 bg-indigo-500/30 px-2 py-0.5 rounded-md border border-indigo-400/40 font-bold">
                      وكيل معتمد 💼
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-300">إدارة المذيعين، الوسطاء، العقود والرواتب</span>
                </div>
              </div>
              <span className="text-xs font-bold text-indigo-100 bg-indigo-600/70 px-3 py-1.5 rounded-xl border border-indigo-400/50 flex items-center gap-1 shadow-inner group-hover:bg-indigo-600 transition-all">
                دخول <ChevronLeft className="w-3.5 h-3.5" />
              </span>
            </motion.div>
          )}

          {/* 4. الوسيط المعتمد (Broker) */}
          {adminRole === 'broker' && (
            <motion.div 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsBrokerCenterModalOpen(true)}
              className="my-1.5 bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 border-2 border-emerald-500/60 rounded-2xl p-3.5 flex items-center justify-between shadow-lg cursor-pointer hover:border-emerald-400 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 border border-emerald-400 flex items-center justify-center text-white shadow-md text-lg">
                  🤝
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-white tracking-wide">مركز الوساطة والتوظيف</span>
                    <span className="text-[9px] text-emerald-200 bg-emerald-500/30 px-2 py-0.5 rounded-md border border-emerald-400/40 font-bold">
                      وسيط معتمد 🤝
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-300">استقطاب المذيعين، متابعة ساعات البث والعمولات</span>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-100 bg-emerald-600/70 px-3 py-1.5 rounded-xl border border-emerald-400/50 flex items-center gap-1 shadow-inner group-hover:bg-emerald-600 transition-all">
                دخول <ChevronLeft className="w-3.5 h-3.5" />
              </span>
            </motion.div>
          )}

          {/* 5. المراقب العام والدعم الفني (Moderator) */}
          {adminRole === 'moderator' && (
            <motion.div 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsModeratorModalOpen(true)}
              className="my-1.5 bg-gradient-to-r from-slate-950 via-slate-900 to-teal-950 border-2 border-teal-500/60 rounded-2xl p-3.5 flex items-center justify-between shadow-lg cursor-pointer hover:border-teal-400 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-600 border border-teal-400 flex items-center justify-center text-white shadow-md text-lg">
                  🛡️
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-white tracking-wide">لوحة المراقب العام والدعم</span>
                    <span className="text-[9px] text-teal-200 bg-teal-500/30 px-2 py-0.5 rounded-md border border-teal-400/40 font-bold">
                      مراقب عام 🛡️
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-300">متابعة البلاغات، إدارة الحظر، والمراقبة الحية للغرف</span>
                </div>
              </div>
              <span className="text-xs font-bold text-teal-100 bg-teal-600/70 px-3 py-1.5 rounded-xl border border-teal-400/50 flex items-center gap-1 shadow-inner group-hover:bg-teal-600 transition-all">
                دخول <ChevronLeft className="w-3.5 h-3.5" />
              </span>
            </motion.div>
          )}

          {/* للمستخدم العادي (regular_user): تظهر قائمته نقية وبدون أي أزرار إدارية إطلاقاً */}

          {/* 2. شبكة الخدمات الملكية المخصصة (واحد يمين وواحد شمال) بأيقونات واقعية 3D وتنسيق مركز المذيعين */}
          <div className="grid grid-cols-2 gap-2.5 py-1" dir="rtl">
            {/* الصف 1 يمين: مركز VIP */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setIsVipCenterModalOpen(true)}
              className="bg-white/80 backdrop-blur-md hover:bg-white/95 border border-[#E8DFC8]/90 rounded-2xl p-2.5 sm:p-3 flex items-center justify-between shadow-[0_4px_16px_rgba(180,160,130,0.12),inset_0_1px_2px_rgba(255,255,255,1)] hover:shadow-[0_6px_20px_rgba(180,160,130,0.22)] active:scale-95 transition-all cursor-pointer group text-right"
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                {/* 3D Inner Embossed Plinth */}
                <div className="relative w-11 h-11 rounded-xl bg-gradient-to-b from-white/95 to-[#FAF5E8] border border-[#E8DFC8] shadow-[0_2px_6px_rgba(0,0,0,0.03),inset_0_1px_2px_rgba(255,255,255,1)] flex items-center justify-center shrink-0">
                  <VipCenter3DIcon className="w-8 h-8" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-black text-[#5C3F13] group-hover:text-[#B38022] transition-colors truncate">
                      مركز VIP
                    </h4>
                    <span className="text-[9px] font-black bg-gradient-to-r from-[#F5D061] to-[#C89228] text-[#3B2610] px-1.5 py-0.2 rounded-md border border-[#E8DFC8] shadow-2xs font-mono">
                      VIP8
                    </span>
                  </div>
                  <span className="text-[10px] text-[#A89478] font-bold block mt-0.5 truncate">
                    المزايا والامتيازات
                  </span>
                </div>
              </div>
              <ChevronLeft className="w-4 h-4 text-[#D1C2A5] group-hover:text-[#B38022] transition-colors shrink-0 mr-0.5" />
            </motion.button>

            {/* الصف 1 شمال: جينيس */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveServiceModal('genius')}
              className="bg-white/80 backdrop-blur-md hover:bg-white/95 border border-[#E8DFC8]/90 rounded-2xl p-2.5 sm:p-3 flex items-center justify-between shadow-[0_4px_16px_rgba(180,160,130,0.12),inset_0_1px_2px_rgba(255,255,255,1)] hover:shadow-[0_6px_20px_rgba(180,160,130,0.22)] active:scale-95 transition-all cursor-pointer group text-right"
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                {/* 3D Inner Embossed Plinth */}
                <div className="relative w-11 h-11 rounded-xl bg-gradient-to-b from-white/95 to-[#FAF5E8] border border-[#E8DFC8] shadow-[0_2px_6px_rgba(0,0,0,0.03),inset_0_1px_2px_rgba(255,255,255,1)] flex items-center justify-center shrink-0">
                  <Genius3DIcon className="w-8 h-8" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-black text-[#5C3F13] group-hover:text-[#B38022] transition-colors truncate">
                      جينيس
                    </h4>
                    <span className="text-[9px] font-black bg-[#FAF5E8] text-[#7E4F0B] px-1.5 py-0.2 rounded-md border border-[#E8DFC8] shadow-2xs">
                      Genius
                    </span>
                  </div>
                  <span className="text-[10px] text-[#A89478] font-bold block mt-0.5 truncate">
                    الذكاء والتحليلات
                  </span>
                </div>
              </div>
              <ChevronLeft className="w-4 h-4 text-[#D1C2A5] group-hover:text-[#B38022] transition-colors shrink-0 mr-0.5" />
            </motion.button>

            {/* الصف 2 يمين: نقاط ودية */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveServiceModal('friendly_points')}
              className="bg-white/80 backdrop-blur-md hover:bg-white/95 border border-[#E8DFC8]/90 rounded-2xl p-2.5 sm:p-3 flex items-center justify-between shadow-[0_4px_16px_rgba(180,160,130,0.12),inset_0_1px_2px_rgba(255,255,255,1)] hover:shadow-[0_6px_20px_rgba(180,160,130,0.22)] active:scale-95 transition-all cursor-pointer group text-right"
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                {/* 3D Inner Embossed Plinth */}
                <div className="relative w-11 h-11 rounded-xl bg-gradient-to-b from-white/95 to-[#FAF5E8] border border-[#E8DFC8] shadow-[0_2px_6px_rgba(0,0,0,0.03),inset_0_1px_2px_rgba(255,255,255,1)] flex items-center justify-center shrink-0">
                  <FriendlyPoints3DIcon className="w-8 h-8" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-black text-[#5C3F13] group-hover:text-[#B38022] transition-colors truncate">
                      نقاط ودية
                    </h4>
                    <span className="text-[9px] font-black bg-[#FAF5E8] text-[#7E4F0B] px-1.5 py-0.2 rounded-md border border-[#E8DFC8] shadow-2xs font-mono">
                      2922
                    </span>
                  </div>
                  <span className="text-[10px] text-[#A89478] font-bold block mt-0.5 truncate">
                    رصيد التفاعل والصداقة
                  </span>
                </div>
              </div>
              <ChevronLeft className="w-4 h-4 text-[#D1C2A5] group-hover:text-[#B38022] transition-colors shrink-0 mr-0.5" />
            </motion.button>

            {/* الصف 2 شمال: مركز الدعوة */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveServiceModal('invitations')}
              className="bg-white/80 backdrop-blur-md hover:bg-white/95 border border-[#E8DFC8]/90 rounded-2xl p-2.5 sm:p-3 flex items-center justify-between shadow-[0_4px_16px_rgba(180,160,130,0.12),inset_0_1px_2px_rgba(255,255,255,1)] hover:shadow-[0_6px_20px_rgba(180,160,130,0.22)] active:scale-95 transition-all cursor-pointer group text-right"
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                {/* 3D Inner Embossed Plinth */}
                <div className="relative w-11 h-11 rounded-xl bg-gradient-to-b from-white/95 to-[#FAF5E8] border border-[#E8DFC8] shadow-[0_2px_6px_rgba(0,0,0,0.03),inset_0_1px_2px_rgba(255,255,255,1)] flex items-center justify-center shrink-0">
                  <InviteCenter3DIcon className="w-8 h-8" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-black text-[#5C3F13] group-hover:text-[#B38022] transition-colors truncate">
                      مركز الدعوة
                    </h4>
                    <span className="text-[9px] font-black bg-gradient-to-r from-[#F5D061]/20 to-[#C89228]/20 text-[#7E4F0B] px-1.5 py-0.2 rounded-md border border-[#E8DFC8] shadow-2xs">
                      ادع واربح
                    </span>
                  </div>
                  <span className="text-[10px] text-[#A89478] font-bold block mt-0.5 truncate">
                    مكافآت الانضمام
                  </span>
                </div>
              </div>
              <ChevronLeft className="w-4 h-4 text-[#D1C2A5] group-hover:text-[#B38022] transition-colors shrink-0 mr-0.5" />
            </motion.button>

            {/* الصف 3 يمين: بطاقة الدعوة */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveServiceModal('invite_card')}
              className="bg-white/80 backdrop-blur-md hover:bg-white/95 border border-[#E8DFC8]/90 rounded-2xl p-2.5 sm:p-3 flex items-center justify-between shadow-[0_4px_16px_rgba(180,160,130,0.12),inset_0_1px_2px_rgba(255,255,255,1)] hover:shadow-[0_6px_20px_rgba(180,160,130,0.22)] active:scale-95 transition-all cursor-pointer group text-right"
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                {/* 3D Inner Embossed Plinth */}
                <div className="relative w-11 h-11 rounded-xl bg-gradient-to-b from-white/95 to-[#FAF5E8] border border-[#E8DFC8] shadow-[0_2px_6px_rgba(0,0,0,0.03),inset_0_1px_2px_rgba(255,255,255,1)] flex items-center justify-center shrink-0">
                  <InviteCard3DIcon className="w-8 h-8" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-black text-[#5C3F13] group-hover:text-[#B38022] transition-colors truncate">
                      بطاقة الدعوة
                    </h4>
                    <span className="text-[9px] font-black bg-[#FAF5E8] text-[#7E4F0B] px-1.5 py-0.2 rounded-md border border-[#E8DFC8] shadow-2xs">
                      مشاركة
                    </span>
                  </div>
                  <span className="text-[10px] text-[#A89478] font-bold block mt-0.5 truncate">
                    كود الدعوة الملكي
                  </span>
                </div>
              </div>
              <ChevronLeft className="w-4 h-4 text-[#D1C2A5] group-hover:text-[#B38022] transition-colors shrink-0 mr-0.5" />
            </motion.button>

            {/* الصف 3 شمال: المركز التجاري */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveServiceModal('mall')}
              className="bg-white/80 backdrop-blur-md hover:bg-white/95 border border-[#E8DFC8]/90 rounded-2xl p-2.5 sm:p-3 flex items-center justify-between shadow-[0_4px_16px_rgba(180,160,130,0.12),inset_0_1px_2px_rgba(255,255,255,1)] hover:shadow-[0_6px_20px_rgba(180,160,130,0.22)] active:scale-95 transition-all cursor-pointer group text-right"
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                {/* 3D Inner Embossed Plinth */}
                <div className="relative w-11 h-11 rounded-xl bg-gradient-to-b from-white/95 to-[#FAF5E8] border border-[#E8DFC8] shadow-[0_2px_6px_rgba(0,0,0,0.03),inset_0_1px_2px_rgba(255,255,255,1)] flex items-center justify-center shrink-0">
                  <Mall3DIcon className="w-8 h-8" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-black text-[#5C3F13] group-hover:text-[#B38022] transition-colors truncate">
                      المركز التجاري
                    </h4>
                    <span className="text-[9px] font-black bg-[#FAF5E8] text-[#7E4F0B] px-1.5 py-0.2 rounded-md border border-[#E8DFC8] shadow-2xs">
                      المتجر
                    </span>
                  </div>
                  <span className="text-[10px] text-[#A89478] font-bold block mt-0.5 truncate">
                    الهدايا والعناصر
                  </span>
                </div>
              </div>
              <ChevronLeft className="w-4 h-4 text-[#D1C2A5] group-hover:text-[#B38022] transition-colors shrink-0 mr-0.5" />
            </motion.button>
          </div>

          {/* 7. مركز الإدارة - الداشبورد (مركز الوسطاء بالشكل المخصص الجديد) */}
          <div 
            onClick={() => setIsBrokerCenterModalOpen(true)}
            className="relative my-2 p-[2px] rounded-2xl bg-gradient-to-r from-[#0D404C] via-[#104D5B] to-[#165F6F] shadow-md cursor-pointer group transition-all"
          >
            <div className="bg-gradient-to-r from-teal-50/90 via-sky-50/80 to-slate-50/90 rounded-[14px] p-3 flex items-center justify-between border border-teal-200/80 group-hover:bg-white transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0D404C] via-[#104D5B] to-[#165F6F] flex items-center justify-center text-white shadow-md text-lg">
                  📊
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-slate-900 tracking-wide">مركز الإدارة - الداشبورد</span>
                    <span className="text-[9px] bg-[#104D5B] text-white font-extrabold px-2 py-0.5 rounded-full shadow-2xs">
                      مركز الوسطاء ✨
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold">دعوة المذيعين، تحليلات الأداء، وإدارة المهام</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-black text-[#104D5B] bg-white/90 border border-teal-200 px-2.5 py-1 rounded-xl shadow-2xs group-hover:bg-[#104D5B] group-hover:text-white transition-all">
                <span>دخول</span>
                <ChevronLeft className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* 8. مركز المذيعين (محتوى داخل إطار مستطيل مميز وجذاب للغاية) */}
          <div 
            onClick={() => setIsBroadcasterCenterModalOpen(true)}
            className="relative my-2 p-[2px] rounded-2xl bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500 shadow-md cursor-pointer group transition-all"
          >
            <div className="bg-gradient-to-r from-rose-50/90 via-purple-50/80 to-indigo-50/90 rounded-[14px] p-3 flex items-center justify-between border border-rose-200/80 group-hover:bg-white transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 via-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md text-lg">
                  🎤
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-slate-900 tracking-wide">مركز المذيعين</span>
                    <span className="text-[9px] bg-rose-600 text-white font-extrabold px-2 py-0.5 rounded-full shadow-2xs">
                      مُميّز ✨
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold">إحصائيات البث، الأرباح، والعقود</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-black text-rose-600 bg-white/90 border border-rose-200 px-2.5 py-1 rounded-xl shadow-2xs group-hover:bg-rose-600 group-hover:text-white transition-all">
                <span>دخول</span>
                <ChevronLeft className="w-4 h-4" />
              </div>
            </div>
          </div>



        </div>

        {/* Copyright Notice */}
        <div className="text-center py-4 text-[10px] text-slate-400 font-medium flex flex-col items-center justify-center gap-1.5 border-t border-slate-200/50 mt-2">
          <div className="flex items-center gap-2">
            <TarafLogo size="sm" className="scale-75" />
            <span className="font-extrabold text-[#5C3F13] text-xs">تطبيق ترف شات (Taraf Chat)</span>
          </div>
          <span className="text-[10px] text-slate-400">
            جميع حقوق الملكية الفكرية والعلامة التجارية مسجلة ومحفوظة © 2026 للمالك والمطور
          </span>
        </div>

      </div>
      </>
      )}

      {/* Floating Room Capsule across other tabs when active & minimized */}
      {activeTab !== 'home' && minimizedRoomSession && (
        <FloatingRoomWidget
          onExpand={() => {
            setActiveTab('home');
            maximizeRoomSession();
          }}
        />
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
        onSuccessRecharge={(addedCoins) => setCoinsBalance((prev) => prev + addedCoins)}
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
        onOpenDevPanel={() => setIsDevPanelModalOpen(true)}
        userId={profile.userId}
        devId="YE1330000"
      />

      <DevPanelModal
        isOpen={isDevPanelModalOpen}
        onClose={() => setIsDevPanelModalOpen(false)}
        userId={profile.userId}
        devId="YE1330000"
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
        level={25}
      />

      <FamilyModal
        isOpen={isFamilyModalOpen}
        onClose={() => setIsFamilyModalOpen(false)}
      />

      <BadgesCenterModal
        isOpen={isBadgesCenterModalOpen}
        onClose={() => setIsBadgesCenterModalOpen(false)}
        badges={profile.badges}
        onSelectBadge={(badge) => setSelectedBadge(badge)}
      />

      <AppearanceModal
        isOpen={isAppearanceModalOpen}
        onClose={() => setIsAppearanceModalOpen(false)}
        avatarUrl={profile.avatarUrl}
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

      {/* لوحة إداري الثيمات والمتجر */}
      <ThemeAdminDashboardModal
        isOpen={isThemeAdminModalOpen}
        onClose={() => setIsThemeAdminModalOpen(false)}
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

      <ServicesModal
        activeService={activeServiceModal}
        onClose={() => setActiveServiceModal(null)}
      />
    </div>
  );
};

