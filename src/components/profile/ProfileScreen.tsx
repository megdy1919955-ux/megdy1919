import React, { useState, useEffect, useRef, Suspense, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check } from 'lucide-react';
import { PullToRefreshIndicator } from '../PullToRefreshIndicator';
import { UserProfileData, StatItem, BadgeInfo } from '../../types';
import { lazyWithRetry } from '../../lib/lazyWithRetry';
import { db, auth } from '../../lib/firebase';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { INITIAL_USER_PROFILE } from '../../data/mockData';
import { getSocialStats } from '../../lib/friendService';
import { RoyalThemeMode, ROYAL_THEMES } from './ProfileThemeConfig';
import { LazyScreenSkeleton } from '../common/LazyScreenSkeleton';
import type { ServiceType } from '../ServicesModal';
import type { RoomData } from '../HomeScreen';
import { 
  getAdminRoleForUser, 
  isOwnerOrSuperAdmin, 
  AdminRole 
} from '../../lib/adminRoleService';
import { 
  RolesSummary, 
  DEFAULT_ROLES_SUMMARY, 
  fetchUserHierarchyPermissions 
} from '../../lib/hierarchyService';
import { syncUserServerInvitations } from '../../lib/agencyInvitationService';
import { backNavigation } from '../../lib/backNavigation';
import { getCurrentAuthUser } from '../../lib/authService';
import { fetchMobileMe } from '../../lib/serverRewardsService';
import { 
  Role, 
  toRole,
  getCurrentVip,
  isVipExpired
} from '../../lib/permissions';

// Lazy-loaded subcomponents for Profile
const HeroHeader = React.lazy(() => import('./components/HeroHeader'));
const CurrencyCards = React.lazy(() => import('./components/CurrencyCards'));
const SuperLegendBanner = React.lazy(() => import('./components/SuperLegendBanner'));
const FamilyCard = React.lazy(() => import('./components/FamilyCard'));
const AdminCards = React.lazy(() => import('./components/AdminCards'));
const UserToolsGrid = React.lazy(() => import('./components/UserToolsGrid'));
const BottomNav = React.lazy(() => import('./components/BottomNav'));
const ModalsContainer = React.lazy(() => import('./modals/ModalsContainer'));

// Tabs / screens loaded on demand
const HomeScreen = lazyWithRetry(() => import('../HomeScreen'), 'HomeScreen');
const ExploreScreen = lazyWithRetry(() => import('../ExploreScreen'), 'ExploreScreen');
const GamesScreen = lazyWithRetry(() => import('../GamesScreen'), 'GamesScreen');
const MessagesScreen = lazyWithRetry(() => import('../MessagesScreen'), 'MessagesScreen');

export const ProfileScreen: React.FC = () => {
  // State Management
  const [profile, setProfile] = useState<UserProfileData>(() => {
    const authUser = getCurrentAuthUser();
    const isOwnerUser = authUser?.id === '1001001' || (authUser as any)?.uid === '0OW7yfypGLgOgwbBHOVtpV8FJ3A3' || (authUser as any)?.isOwner;
    const initialVip = isOwnerUser ? 'VIP10' : getCurrentVip(authUser);
    if (authUser && authUser.id) {
      return {
        ...INITIAL_USER_PROFILE,
        userId: authUser.id,
        name: authUser.name || 'مستخدم النجم',
        avatarUrl: authUser.avatar || INITIAL_USER_PROFILE.avatarUrl,
        coins: authUser.coins || 0,
        diamonds: authUser.diamonds || 0,
        vipLevel: initialVip,
        role: (authUser.role as any) || (isOwnerUser ? 'super_admin' : 'user')
      };
    }
    const saved = localStorage.getItem('user_profile_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_USER_PROFILE,
          ...parsed,
          avatarUrl: parsed.avatar || parsed.avatarUrl || INITIAL_USER_PROFILE.avatarUrl
        };
      } catch (e) {
        return INITIAL_USER_PROFILE;
      }
    }
    return INITIAL_USER_PROFILE;
  });

  const [activeTab, setActiveTab] = useState<'home' | 'explore' | 'games' | 'messages' | 'profile'>('profile');
  const [coinsBalance, setCoinsBalance] = useState<number>(() => profile.coins || 0);
  const [diamondsBalance, setDiamondsBalance] = useState<number>(() => profile.diamonds || 0);
  const [userAgencyStatus, setUserAgencyStatus] = useState<'none' | 'pending' | 'active' | 'approved' | 'rejected'>('none');
  const [pendingAgencyInfo, setPendingAgencyInfo] = useState<{ agencyId?: string; agencyName?: string }>({});
  const [userFamilyId, setUserFamilyId] = useState<string | null>(null);
  const [userFamilyName, setUserFamilyName] = useState<string | null>(null);

  // Admin roles & hierarchy
  const [adminRole, setAdminRole] = useState<AdminRole>(() => getAdminRoleForUser(profile.userId));
  const [rolesSummary, setRolesSummary] = useState<RolesSummary>(DEFAULT_ROLES_SUMMARY);
  const [userHierarchyCode, setUserHierarchyCode] = useState<string | null>(() => (profile.userId === '1001001' || profile.role === 'owner' || profile.role === 'super_admin') ? 'MGR-9901' : null);

  // Social Stats
  const [socialStats, setSocialStats] = useState(() => getSocialStats(profile.userId));

  // Dynamic Dashboard Badges
  const [dashboardBadges, setDashboardBadges] = useState<{
    showVipBadge: boolean;
    vipLevel?: string;
    vipDesignStyle?: string;
    showSupporterBadge: boolean;
    supporterLevel: number;
    showCharmBadge: boolean;
    charmLevel: number;
  }>({
    showVipBadge: true,
    vipLevel: profile.vipLevel || 'VIP10',
    vipDesignStyle: 'royal_gold_3d',
    showSupporterBadge: true,
    supporterLevel: 10,
    showCharmBadge: true,
    charmLevel: 8
  });

  // Pull-to-refresh state
  const [isProfileRefreshing, setIsProfileRefreshing] = useState(false);
  const [profilePullDistance, setProfilePullDistance] = useState(0);
  const [profileRefreshSuccess, setProfileRefreshSuccess] = useState(false);
  const profileTouchStartY = useRef(0);
  const isProfilePulling = useRef(false);

  // Modals Visibility
  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState(false);
  const [activeStatModal, setActiveStatModal] = useState<StatItem['id'] | null>(null);
  const [selectedBadge, setSelectedBadge] = useState<BadgeInfo | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUserProfileModalOpen, setIsUserProfileModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isCustomerServiceModalOpen, setIsCustomerServiceModalOpen] = useState(false);
  const [isDownloadApkOpen, setIsDownloadApkOpen] = useState(false);
  const [isSuperLegendModalOpen, setIsSuperLegendModalOpen] = useState(false);
  const [isLevelModalOpen, setIsLevelModalOpen] = useState(false);
  const [isFamilyModalOpen, setIsFamilyModalOpen] = useState(false);
  const [isBadgesCenterModalOpen, setIsBadgesCenterModalOpen] = useState(false);
  const [isAppearanceModalOpen, setIsAppearanceModalOpen] = useState(false);
  const [isVipCenterModalOpen, setIsVipCenterModalOpen] = useState(false);
  const [isAgencyModalOpen, setIsAgencyModalOpen] = useState(false);
  const [isRechargeAgencyModalOpen, setIsRechargeAgencyModalOpen] = useState(false);
  const [isOfficialAgencyManagerModalOpen, setIsOfficialAgencyManagerModalOpen] = useState(false);
  const [isAgencyRepModalOpen, setIsAgencyRepModalOpen] = useState(false);
  const [isModeratorModalOpen, setIsModeratorModalOpen] = useState(false);
  const [isBrokerCenterModalOpen, setIsBrokerCenterModalOpen] = useState(false);
  const [isBroadcasterCenterModalOpen, setIsBroadcasterCenterModalOpen] = useState(false);
  const [isGeniusModalOpen, setIsGeniusModalOpen] = useState(false);
  const [isFriendlyPointsModalOpen, setIsFriendlyPointsModalOpen] = useState(false);
  const [isMallModalOpen, setIsMallModalOpen] = useState(false);
  const [isJoinAgencyModalOpen, setIsJoinAgencyModalOpen] = useState(false);
  const [isExploreFamiliesModalOpen, setIsExploreFamiliesModalOpen] = useState(false);
  const [isAgencyHostCenterModalOpen, setIsAgencyHostCenterModalOpen] = useState(false);
  const [activeServiceModal, setActiveServiceModal] = useState<ServiceType | null>(null);

  // Global persistent room
  const [activeVoiceRoom, setActiveVoiceRoom] = useState<RoomData | null>(null);
  const [isRoomMinimized, setIsRoomMinimized] = useState(false);

  // Royal Theme
  const [royalTheme, setRoyalTheme] = useState<RoyalThemeMode>(() => {
    return (localStorage.getItem('app_royal_theme') as RoyalThemeMode) || 'gold';
  });
  const curRoyal = ROYAL_THEMES[royalTheme];

  const cycleRoyalTheme = () => {
    setRoyalTheme((prev) => {
      const next: RoyalThemeMode = prev === 'gold' ? 'white' : prev === 'white' ? 'dark' : 'gold';
      localStorage.setItem('app_royal_theme', next);
      return next;
    });
  };

  // Toast for ID Copy
  const [copiedId, setCopiedId] = useState(false);
  const handleCopyId = () => {
    navigator.clipboard.writeText(profile.userId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2500);
  };

  const isOwner = useMemo(() => isOwnerOrSuperAdmin(profile.userId) || profile.role === 'owner' || profile.role === 'super_admin' || profile.userId === '1001001', [profile.userId, profile.role]);

  // السيرفر المركزي هو المرجع الحصري لإدارة وتوزيع الصلاحيات (Roles Summary Engine)
  useEffect(() => {
    let isCurrent = true;
    const syncServerPermissions = async () => {
      const targetId = profile.userId || '1001001';
      try {
        const perms = await fetchUserHierarchyPermissions(targetId);
        if (isCurrent && perms) {
          console.log('[ProfileScreen] syncServerPermissions result:', perms);
          setRolesSummary(perms);
        }
        await syncUserServerInvitations(targetId);
      } catch (err) {
        console.error('Failed to sync server permissions:', err);
      }
    };

    syncServerPermissions();

    const handlePermissionsUpdated = () => {
      syncServerPermissions();
    };

    window.addEventListener('hierarchy_permissions_updated', handlePermissionsUpdated);
    window.addEventListener('agency_invitations_updated', handlePermissionsUpdated);
    return () => {
      isCurrent = false;
      window.removeEventListener('hierarchy_permissions_updated', handlePermissionsUpdated);
      window.removeEventListener('agency_invitations_updated', handlePermissionsUpdated);
    };
  }, [profile.userId]);

  // الصلاحيات الفعالة الشاملة مع منح المالك/السوبر أدمن كافة البطاقات تلقائياً
  const effectiveRolesSummary = useMemo<RolesSummary>(() => {
    if (isOwner || profile.userId === '1001001' || profile.role === 'owner' || profile.role === 'super_admin' || rolesSummary.isSuperAdmin) {
      return {
        isManager: true,
        isSuperAdmin: true,
        isDelegate: true,
        isAgent: true,
        isRechargeAgent: true,
        isBroker: true,
        isHost: true,
        isThemeAdmin: true,
        ...rolesSummary
      };
    }
    return rolesSummary;
  }, [isOwner, profile.userId, profile.role, rolesSummary]);

  const userRole: Role = toRole(effectiveRolesSummary?.role || profile.role || 'user');

  // Firestore Real-Time Listener on users/{uid}
  useEffect(() => {
    const authUid = auth.currentUser?.uid;
    const targetUid = authUid || (isOwner ? '0OW7yfypGLgOgwbBHOVtpV8FJ3A3' : (profile.userId || '1001001'));
    const unsubUser = onSnapshot(doc(db, 'users', targetUid), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data.coins !== undefined) setCoinsBalance(Number(data.coins));
        if (data.diamonds !== undefined) setDiamondsBalance(Number(data.diamonds));
        if (data.agencyStatus) setUserAgencyStatus(data.agencyStatus);
        if (data.pendingAgencyId || data.pendingAgencyName) {
          setPendingAgencyInfo({ agencyId: data.pendingAgencyId, agencyName: data.pendingAgencyName });
        }
        if (data.familyId) setUserFamilyId(data.familyId);
        if (data.familyName) setUserFamilyName(data.familyName);
        if (data.functionalRoleCode || data.hierarchyId) {
          setUserHierarchyCode(data.functionalRoleCode || data.hierarchyId);
        } else if (isOwner || profile.userId === '1001001') {
          setUserHierarchyCode('MGR-9901');
        }
        if (data.role && data.role !== profile.role) {
          setProfile((prev) => ({ ...prev, role: data.role }));
        }
        if (data.isOwner) {
          setAdminRole('super_admin');
        }

        // 👑 تحديث مستوى VIP الحقيقي وفحص الانتهاء التلقائي (patch 7b)
        const activeVip = getCurrentVip(data);
        if (activeVip) {
          setProfile((prev) => ({ ...prev, vipLevel: activeVip }));
          setDashboardBadges((prev) => ({ ...prev, vipLevel: activeVip }));
        }

        // Automatic healing/synchronization for official owner documents (patch 6b-2 / patch 7b)
        if (isOwner && (targetUid === '0OW7yfypGLgOgwbBHOVtpV8FJ3A3' || authUid === '0OW7yfypGLgOgwbBHOVtpV8FJ3A3')) {
          const needsHealing = 
            data.role !== 'super_admin' || 
            !data.functionalRoleCode || 
            typeof data.totalCoinsSpent !== 'number' ||
            data.vipTier !== 'VIP10' ||
            data.vipLevel !== 'VIP10' ||
            data.isVipPermanent !== true;

          if (needsHealing) {
            updateDoc(doc(db, 'users', '0OW7yfypGLgOgwbBHOVtpV8FJ3A3'), {
              role: 'super_admin',
              functionalRoleCode: 'MGR-9901',
              totalCoinsSpent: 252000,
              roles: ['SUPER_ADMIN', 'AGENCY MANAGER'],
              roleTitle: 'مدير عام الوكالات والمشرف الإداري الرئيسي',
              vipTier: 'VIP10',
              vipLevel: 'VIP10',
              previousVipLevel: data.previousVipLevel || 'VIP0',
              vipExpiresAt: null,
              vipActivatedAt: data.vipActivatedAt || new Date().toISOString(),
              vipDurationDays: 0,
              vipSource: 'owner',
              isVipPermanent: true
            }).catch(() => {});
          }
        }
      }
    }, (err) => console.warn('User snapshot error:', err));

    return () => unsubUser();
  }, [profile.userId, isOwner]);

  // Sync mobile-me server data
  useEffect(() => {
    fetchMobileMe(profile.userId).then((meData) => {
      if (meData?.wallet) {
        if (meData.wallet.coins !== undefined) setCoinsBalance(meData.wallet.coins);
        if (meData.wallet.diamonds !== undefined) setDiamondsBalance(meData.wallet.diamonds);
      } else if (meData?.profile) {
        const p = meData.profile as any;
        if (p.coins !== undefined) setCoinsBalance(p.coins);
        if (p.diamonds !== undefined) setDiamondsBalance(p.diamonds);
      }
    }).catch(() => {});
  }, [profile.userId]);

  // Pull-to-refresh handlers
  const handleProfileTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      profileTouchStartY.current = e.touches[0].clientY;
      isProfilePulling.current = true;
    }
  };

  const handleProfileTouchMove = (e: React.TouchEvent) => {
    if (!isProfilePulling.current || isProfileRefreshing) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - profileTouchStartY.current;
    if (diff > 0) {
      setProfilePullDistance(Math.min(diff * 0.45, 90));
    }
  };

  const handleProfileTouchEnd = async () => {
    if (!isProfilePulling.current) return;
    isProfilePulling.current = false;
    if (profilePullDistance > 55 && !isProfileRefreshing) {
      await handleProfileManualRefresh();
    }
    setProfilePullDistance(0);
  };

  const handleProfileManualRefresh = async () => {
    setIsProfileRefreshing(true);
    setProfileRefreshSuccess(false);
    try {
      const meData = await fetchMobileMe(profile.userId);
      if (meData?.profile) {
        const p = meData.profile as any;
        if (p.coins !== undefined) setCoinsBalance(p.coins);
        if (p.diamonds !== undefined) setDiamondsBalance(p.diamonds);
      }
      setSocialStats(getSocialStats(profile.userId));
      setProfileRefreshSuccess(true);
    } finally {
      setTimeout(() => {
        setIsProfileRefreshing(false);
        setProfileRefreshSuccess(false);
      }, 700);
    }
  };

  // Host center click routing
  const handleHostCenterClick = () => {
    if (isOwner || profile.userId === '1001001') {
      setIsBroadcasterCenterModalOpen(true);
      return;
    }
    if (userAgencyStatus === 'pending') {
      setIsJoinAgencyModalOpen(true);
    } else if (userAgencyStatus === 'active' || userAgencyStatus === 'approved') {
      setIsBroadcasterCenterModalOpen(true);
    } else {
      setIsJoinAgencyModalOpen(true);
    }
  };

  const handleFamilyClick = () => {
    if (userFamilyId) {
      setIsFamilyModalOpen(true);
    } else {
      setIsExploreFamiliesModalOpen(true);
    }
  };

  const handleOpenRoom = (room: RoomData) => {
    setActiveVoiceRoom(room);
    setIsRoomMinimized(false);
  };

  const handleSaveProfile = (updated: Partial<UserProfileData>) => {
    const newProfile = { ...profile, ...updated };
    setProfile(newProfile);
    localStorage.setItem('user_profile_data', JSON.stringify({
      ...newProfile,
      avatar: newProfile.avatarUrl
    }));
  };

  // Badge styles
  const getSupporterBadgeStyle = () => {
    const level = dashboardBadges.supporterLevel;
    if (level >= 90) return 'bg-gradient-to-r from-red-700 via-rose-600 to-amber-500 text-white border-amber-300';
    if (level >= 50) return 'bg-gradient-to-r from-purple-700 via-pink-600 to-amber-400 text-white border-purple-300';
    return 'bg-gradient-to-r from-amber-600 to-yellow-500 text-white border-amber-300';
  };

  const getCharmBadgeStyle = () => {
    const level = dashboardBadges.charmLevel;
    if (level >= 90) return 'bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 text-white border-cyan-300';
    if (level >= 50) return 'bg-gradient-to-r from-teal-600 via-emerald-600 to-blue-600 text-white border-teal-300';
    return 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-blue-300';
  };

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
        <Suspense fallback={<LazyScreenSkeleton title="الرئيسية" />}>
          <HomeScreen 
            onOpenRecharge={() => setIsRechargeModalOpen(true)} 
            onOpenRoom={handleOpenRoom}
          />
        </Suspense>
      )}
      {activeTab === 'explore' && (
        <Suspense fallback={<LazyScreenSkeleton title="استكشاف الغرف والمواهب" />}>
          <ExploreScreen />
        </Suspense>
      )}
      {activeTab === 'games' && (
        <Suspense fallback={<LazyScreenSkeleton title="ألعاب ومسابقات النجم" />}>
          <GamesScreen />
        </Suspense>
      )}
      {activeTab === 'messages' && (
        <Suspense fallback={<LazyScreenSkeleton title="الرسائل والمحادثات" />}>
          <MessagesScreen />
        </Suspense>
      )}

      {/* Profile View (Renders when activeTab === 'profile') */}
      {activeTab === 'profile' && (
        <div 
          onTouchStart={handleProfileTouchStart}
          onTouchMove={handleProfileTouchMove}
          onTouchEnd={handleProfileTouchEnd}
          className="relative w-full"
        >
          {/* Pull to refresh visual indicator */}
          <PullToRefreshIndicator 
            pullDistance={profilePullDistance}
            isRefreshing={isProfileRefreshing}
            refreshSuccess={profileRefreshSuccess}
          />

          {/* Hero Header */}
          <Suspense fallback={<div className="h-64 bg-slate-100 animate-pulse" />}>
            <HeroHeader
              profile={profile}
              royalTheme={royalTheme}
              cycleRoyalTheme={cycleRoyalTheme}
              curRoyal={curRoyal}
              isProfileRefreshing={isProfileRefreshing}
              handleProfileManualRefresh={handleProfileManualRefresh}
              dashboardBadges={dashboardBadges}
              getSupporterBadgeStyle={getSupporterBadgeStyle}
              getCharmBadgeStyle={getCharmBadgeStyle}
              copiedId={copiedId}
              handleCopyId={handleCopyId}
              userHierarchyCode={userHierarchyCode}
              userRole={userRole}
              isOwner={isOwner}
              rolesSummary={effectiveRolesSummary}
              socialStats={socialStats}
              onOpenSettings={() => setIsSettingsModalOpen(true)}
              onOpenCustomerService={() => setIsCustomerServiceModalOpen(true)}
              onOpenDownloadApk={() => setIsDownloadApkOpen(true)}
              onOpenUserProfile={() => setIsUserProfileModalOpen(true)}
              onOpenEditProfile={() => setIsEditModalOpen(true)}
              onOpenVipCenter={() => setIsVipCenterModalOpen(true)}
              onOpenLevelModal={() => setIsLevelModalOpen(true)}
              onOpenSuperLegend={() => setIsSuperLegendModalOpen(true)}
              onSelectStat={(statId) => setActiveStatModal(statId)}
            />
          </Suspense>

          {/* Main Content Area */}
          <div className="max-w-md mx-auto px-4 space-y-3.5 mt-3">
            {/* Super Legend Banner */}
            <Suspense fallback={<div className="h-14 bg-amber-950/20 rounded-2xl animate-pulse" />}>
              <SuperLegendBanner onOpenSuperLegend={() => setIsSuperLegendModalOpen(true)} />
            </Suspense>

            {/* Currency Row (Coins & Diamonds) */}
            <Suspense fallback={<div className="h-20 bg-slate-100 rounded-2xl animate-pulse" />}>
              <CurrencyCards
                coinsBalance={coinsBalance}
                diamondsBalance={diamondsBalance}
                curRoyal={curRoyal}
              />
            </Suspense>

            {/* 4 Action Cards (User Level, Badges, Families, Appearance) */}
            <Suspense fallback={<div className="h-32 bg-slate-100 rounded-2xl animate-pulse" />}>
              <FamilyCard
                curRoyal={curRoyal}
                userFamilyId={userFamilyId}
                userFamilyName={userFamilyName}
                onOpenLevelModal={() => setIsLevelModalOpen(true)}
                onOpenBadgesCenter={() => setIsBadgesCenterModalOpen(true)}
                onFamilyClick={handleFamilyClick}
                onOpenAppearance={() => setIsAppearanceModalOpen(true)}
              />
            </Suspense>

            {/* Mini Games Strip & User Tools Services */}
            <Suspense fallback={<div className="h-40 bg-slate-100 rounded-2xl animate-pulse" />}>
              <UserToolsGrid
                curRoyal={curRoyal}
                gamesList={gamesList}
                onOpenGamesTab={() => setActiveTab('games')}
                onOpenVipCenter={() => setIsVipCenterModalOpen(true)}
                onOpenGenius={() => setIsGeniusModalOpen(true)}
                onOpenFriendlyPoints={() => setIsFriendlyPointsModalOpen(true)}
                onOpenInviteCenter={() => setActiveServiceModal('invitations')}
                onOpenInviteCard={() => setActiveServiceModal('invite_card')}
                onOpenMall={() => setIsMallModalOpen(true)}
              />
            </Suspense>

            {/* Role & Admin Cards */}
            <div className={`${curRoyal.listWrapper} rounded-3xl p-2 space-y-1 shadow-xs transition-all duration-300`} dir="rtl">
              <Suspense fallback={<div className="h-24 bg-slate-100 rounded-2xl animate-pulse" />}>
                <AdminCards
                  adminRole={adminRole}
                  rolesSummary={effectiveRolesSummary}
                  userAgencyStatus={userAgencyStatus}
                  pendingAgencyInfo={pendingAgencyInfo}
                  isOwner={isOwner || effectiveRolesSummary.isSuperAdmin}
                  isSuperAdmin={isOwner || effectiveRolesSummary.isSuperAdmin}
                  onOpenBrokerCenter={() => setIsBrokerCenterModalOpen(true)}
                  onOpenModerator={() => setIsModeratorModalOpen(true)}
                  onOpenOfficialAgencyManager={() => setIsOfficialAgencyManagerModalOpen(true)}
                  onOpenAgencyRep={() => setIsAgencyRepModalOpen(true)}
                  onOpenAgency={() => setIsAgencyModalOpen(true)}
                  onOpenRechargeAgency={() => setIsRechargeAgencyModalOpen(true)}
                  onHostCenterClick={handleHostCenterClick}
                />
              </Suspense>
            </div>
          </div>
        </div>
      )}

      {/* Fixed Bottom Navigation Bar */}
      <Suspense fallback={null}>
        <BottomNav
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
        />
      </Suspense>

      {/* Modals & Dialogs Container */}
      <Suspense fallback={null}>
        <ModalsContainer
          profile={profile}
          setProfile={setProfile}
          coinsBalance={coinsBalance}
          diamondsBalance={diamondsBalance}
          dashboardBadges={dashboardBadges}
          adminRole={adminRole}
          isOwner={isOwner}
          userAgencyStatus={userAgencyStatus}
          setUserAgencyStatus={setUserAgencyStatus}
          pendingAgencyInfo={pendingAgencyInfo}
          setPendingAgencyInfo={setPendingAgencyInfo}
          userFamilyId={userFamilyId}
          setUserFamilyId={setUserFamilyId}
          userFamilyName={userFamilyName}
          setUserFamilyName={setUserFamilyName}
          isRechargeModalOpen={isRechargeModalOpen}
          setIsRechargeModalOpen={setIsRechargeModalOpen}
          activeStatModal={activeStatModal}
          setActiveStatModal={setActiveStatModal}
          selectedBadge={selectedBadge}
          setSelectedBadge={setSelectedBadge}
          isEditModalOpen={isEditModalOpen}
          setIsEditModalOpen={setIsEditModalOpen}
          isUserProfileModalOpen={isUserProfileModalOpen}
          setIsUserProfileModalOpen={setIsUserProfileModalOpen}
          isSettingsModalOpen={isSettingsModalOpen}
          setIsSettingsModalOpen={setIsSettingsModalOpen}
          isCustomerServiceModalOpen={isCustomerServiceModalOpen}
          setIsCustomerServiceModalOpen={setIsCustomerServiceModalOpen}
          isDownloadApkOpen={isDownloadApkOpen}
          setIsDownloadApkOpen={setIsDownloadApkOpen}
          isSuperLegendModalOpen={isSuperLegendModalOpen}
          setIsSuperLegendModalOpen={setIsSuperLegendModalOpen}
          isLevelModalOpen={isLevelModalOpen}
          setIsLevelModalOpen={setIsLevelModalOpen}
          isFamilyModalOpen={isFamilyModalOpen}
          setIsFamilyModalOpen={setIsFamilyModalOpen}
          isBadgesCenterModalOpen={isBadgesCenterModalOpen}
          setIsBadgesCenterModalOpen={setIsBadgesCenterModalOpen}
          isAppearanceModalOpen={isAppearanceModalOpen}
          setIsAppearanceModalOpen={setIsAppearanceModalOpen}
          isVipCenterModalOpen={isVipCenterModalOpen}
          setIsVipCenterModalOpen={setIsVipCenterModalOpen}
          isAgencyModalOpen={isAgencyModalOpen}
          setIsAgencyModalOpen={setIsAgencyModalOpen}
          isRechargeAgencyModalOpen={isRechargeAgencyModalOpen}
          setIsRechargeAgencyModalOpen={setIsRechargeAgencyModalOpen}
          isOfficialAgencyManagerModalOpen={isOfficialAgencyManagerModalOpen}
          setIsOfficialAgencyManagerModalOpen={setIsOfficialAgencyManagerModalOpen}
          isAgencyRepModalOpen={isAgencyRepModalOpen}
          setIsAgencyRepModalOpen={setIsAgencyRepModalOpen}
          isModeratorModalOpen={isModeratorModalOpen}
          setIsModeratorModalOpen={setIsModeratorModalOpen}
          isBrokerCenterModalOpen={isBrokerCenterModalOpen}
          setIsBrokerCenterModalOpen={setIsBrokerCenterModalOpen}
          isBroadcasterCenterModalOpen={isBroadcasterCenterModalOpen}
          setIsBroadcasterCenterModalOpen={setIsBroadcasterCenterModalOpen}
          isGeniusModalOpen={isGeniusModalOpen}
          setIsGeniusModalOpen={setIsGeniusModalOpen}
          isFriendlyPointsModalOpen={isFriendlyPointsModalOpen}
          setIsFriendlyPointsModalOpen={setIsFriendlyPointsModalOpen}
          isMallModalOpen={isMallModalOpen}
          setIsMallModalOpen={setIsMallModalOpen}
          isJoinAgencyModalOpen={isJoinAgencyModalOpen}
          setIsJoinAgencyModalOpen={setIsJoinAgencyModalOpen}
          isExploreFamiliesModalOpen={isExploreFamiliesModalOpen}
          setIsExploreFamiliesModalOpen={setIsExploreFamiliesModalOpen}
          isAgencyHostCenterModalOpen={isAgencyHostCenterModalOpen}
          setIsAgencyHostCenterModalOpen={setIsAgencyHostCenterModalOpen}
          activeServiceModal={activeServiceModal}
          setActiveServiceModal={setActiveServiceModal}
          activeVoiceRoom={activeVoiceRoom}
          setActiveVoiceRoom={setActiveVoiceRoom}
          isRoomMinimized={isRoomMinimized}
          setIsRoomMinimized={setIsRoomMinimized}
          handleSaveProfile={handleSaveProfile}
          handleFamilyClick={handleFamilyClick}
        />
      </Suspense>
    </div>
  );
};

export default ProfileScreen;
