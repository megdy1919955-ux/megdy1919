import React, { Suspense } from 'react';
import { UserProfileData, StatItem, BadgeInfo } from '../../../types';
import { LazyModalSkeleton } from '../../common/LazyModalSkeleton';
import { ErrorBoundary } from '../../ErrorBoundary';
import { FloatingRoomWidget } from '../../FloatingRoomWidget';
import { DownloadApkModal } from '../../DownloadApkModal';
import { 
  exitRoomSession, 
  minimizeRoomSession, 
  maximizeRoomSession 
} from '../../../lib/roomSessionService';
import {
  getVisitorsList,
  getFriendsList,
  getFollowingList,
  getLikesList
} from '../../../lib/friendService';
import type { ServiceType } from '../../ServicesModal';

// On-Demand Lazy Loaded Modal Components
const StatDetailModal = React.lazy(() => import('../../StatDetailModal').then(m => ({ default: m.StatDetailModal || (m as any).default })));
const BadgeDetailModal = React.lazy(() => import('../../BadgeDetailModal').then(m => ({ default: m.BadgeDetailModal || (m as any).default })));
const EditProfileModal = React.lazy(() => import('../../EditProfileModal').then(m => ({ default: m.EditProfileModal || (m as any).default })));
const UserLevelModal = React.lazy(() => import('../../UserLevelModal').then(m => ({ default: m.UserLevelModal || (m as any).default })));
const FamilyModal = React.lazy(() => import('../../FamilyModal').then(m => ({ default: m.FamilyModal || (m as any).default })));
const BadgesCenterModal = React.lazy(() => import('../../BadgesCenterModal').then(m => ({ default: m.BadgesCenterModal || (m as any).default })));
const AppearanceModal = React.lazy(() => import('../../AppearanceModal').then(m => ({ default: m.AppearanceModal || (m as any).default })));
const ServicesModal = React.lazy(() => import('../../ServicesModal').then(m => ({ default: m.ServicesModal || (m as any).default })));
const RechargeAgencyModal = React.lazy(() => import('../../RechargeAgencyModal').then(m => ({ default: m.RechargeAgencyModal || (m as any).default })));
const RechargeModal = React.lazy(() => import('../../RechargeModal').then(m => ({ default: m.RechargeModal || (m as any).default })));
const SuperLegendModal = React.lazy(() => import('../../SuperLegendModal').then(m => ({ default: m.SuperLegendModal || (m as any).default })));
const SettingsModal = React.lazy(() => import('../../SettingsModal').then(m => ({ default: m.SettingsModal || (m as any).default })));
const CustomerServiceModal = React.lazy(() => import('../../CustomerServiceModal').then(m => ({ default: m.CustomerServiceModal || (m as any).default })));
const UserProfileModal = React.lazy(() => import('../../UserProfileModal').then(m => ({ default: m.UserProfileModal || (m as any).default })));
const VipCenterModal = React.lazy(() => import('../../VipCenterModal').then(m => ({ default: m.VipCenterModal || (m as any).default })));
const AgencyModal = React.lazy(() => import('../../AgencyModal').then(m => ({ default: m.AgencyModal || (m as any).default })));
const BrokerCenterModal = React.lazy(() => import('../../BrokerCenterModal').then(m => ({ default: m.BrokerCenterModal || (m as any).default })));
const OfficialAgencyManagerModal = React.lazy(() => import('../../OfficialAgencyManagerModal').then(m => ({ default: m.OfficialAgencyManagerModal || (m as any).default })));
const AgencyRepresentativeModal = React.lazy(() => import('../../AgencyRepresentativeModal').then(m => ({ default: m.AgencyRepresentativeModal || (m as any).default })));
const ModeratorDashboardModal = React.lazy(() => import('../../ModeratorDashboardModal').then(m => ({ default: m.ModeratorDashboardModal || (m as any).default })));
const BroadcasterCenterModal = React.lazy(() => import('../../BroadcasterCenterModal').then(m => ({ default: m.BroadcasterCenterModal || (m as any).default })));
const GeniusNajmModal = React.lazy(() => import('../../GeniusNajmModal').then(m => ({ default: m.GeniusNajmModal || (m as any).default })));
const FriendlyPointsModal = React.lazy(() => import('../../FriendlyPointsModal').then(m => ({ default: m.FriendlyPointsModal || (m as any).default })));
const MallCenterModal = React.lazy(() => import('../../MallCenterModal').then(m => ({ default: m.MallCenterModal || (m as any).default })));
const JoinAgencyModal = React.lazy(() => import('../../agency/JoinAgencyModal').then(m => ({ default: m.JoinAgencyModal || (m as any).default })));
const ExploreFamiliesModal = React.lazy(() => import('../../family/ExploreFamiliesModal').then(m => ({ default: m.ExploreFamiliesModal || (m as any).default })));
const AgencyHostCenterModal = React.lazy(() => import('../../AgencyHostCenterModal').then(m => ({ default: m.AgencyHostCenterModal || (m as any).default })));
const VoiceRoomScreen = React.lazy(() => import('../../VoiceRoomScreen'));

export interface ModalsContainerProps {
  profile: UserProfileData;
  setProfile: React.Dispatch<React.SetStateAction<UserProfileData>>;
  coinsBalance: number;
  diamondsBalance: number;
  dashboardBadges: {
    showVipBadge: boolean;
    vipLevel?: string;
    vipDesignStyle?: string;
    showSupporterBadge: boolean;
    supporterLevel: number;
    showCharmBadge: boolean;
    charmLevel: number;
  };
  adminRole: string;
  isOwner: boolean;
  userAgencyStatus: 'none' | 'pending' | 'active' | 'approved' | 'rejected';
  setUserAgencyStatus: (status: 'none' | 'pending' | 'active' | 'approved' | 'rejected') => void;
  pendingAgencyInfo: { agencyId?: string; agencyName?: string };
  setPendingAgencyInfo: React.Dispatch<React.SetStateAction<{ agencyId?: string; agencyName?: string }>>;
  userFamilyId: string | null;
  setUserFamilyId: (id: string | null) => void;
  userFamilyName: string | null;
  setUserFamilyName: (name: string | null) => void;
  // Modal visibility states
  isRechargeModalOpen: boolean;
  setIsRechargeModalOpen: (v: boolean) => void;
  activeStatModal: StatItem['id'] | null;
  setActiveStatModal: (v: StatItem['id'] | null) => void;
  selectedBadge: BadgeInfo | null;
  setSelectedBadge: (v: BadgeInfo | null) => void;
  isEditModalOpen: boolean;
  setIsEditModalOpen: (v: boolean) => void;
  isUserProfileModalOpen: boolean;
  setIsUserProfileModalOpen: (v: boolean) => void;
  isSettingsModalOpen: boolean;
  setIsSettingsModalOpen: (v: boolean) => void;
  isCustomerServiceModalOpen: boolean;
  setIsCustomerServiceModalOpen: (v: boolean) => void;
  isDownloadApkOpen: boolean;
  setIsDownloadApkOpen: (v: boolean) => void;
  isSuperLegendModalOpen: boolean;
  setIsSuperLegendModalOpen: (v: boolean) => void;
  isLevelModalOpen: boolean;
  setIsLevelModalOpen: (v: boolean) => void;
  isFamilyModalOpen: boolean;
  setIsFamilyModalOpen: (v: boolean) => void;
  isBadgesCenterModalOpen: boolean;
  setIsBadgesCenterModalOpen: (v: boolean) => void;
  isAppearanceModalOpen: boolean;
  setIsAppearanceModalOpen: (v: boolean) => void;
  isVipCenterModalOpen: boolean;
  setIsVipCenterModalOpen: (v: boolean) => void;
  isAgencyModalOpen: boolean;
  setIsAgencyModalOpen: (v: boolean) => void;
  isRechargeAgencyModalOpen: boolean;
  setIsRechargeAgencyModalOpen: (v: boolean) => void;
  isOfficialAgencyManagerModalOpen: boolean;
  setIsOfficialAgencyManagerModalOpen: (v: boolean) => void;
  isAgencyRepModalOpen: boolean;
  setIsAgencyRepModalOpen: (v: boolean) => void;
  isModeratorModalOpen: boolean;
  setIsModeratorModalOpen: (v: boolean) => void;
  isBrokerCenterModalOpen: boolean;
  setIsBrokerCenterModalOpen: (v: boolean) => void;
  isBroadcasterCenterModalOpen: boolean;
  setIsBroadcasterCenterModalOpen: (v: boolean) => void;
  isGeniusModalOpen: boolean;
  setIsGeniusModalOpen: (v: boolean) => void;
  isFriendlyPointsModalOpen: boolean;
  setIsFriendlyPointsModalOpen: (v: boolean) => void;
  isMallModalOpen: boolean;
  setIsMallModalOpen: (v: boolean) => void;
  isJoinAgencyModalOpen: boolean;
  setIsJoinAgencyModalOpen: (v: boolean) => void;
  isExploreFamiliesModalOpen: boolean;
  setIsExploreFamiliesModalOpen: (v: boolean) => void;
  isAgencyHostCenterModalOpen: boolean;
  setIsAgencyHostCenterModalOpen: (v: boolean) => void;
  activeServiceModal: ServiceType | null;
  setActiveServiceModal: (v: ServiceType | null) => void;
  // Global Voice Room
  activeVoiceRoom: any;
  setActiveVoiceRoom: (room: any) => void;
  isRoomMinimized: boolean;
  setIsRoomMinimized: (minimized: boolean) => void;
  handleSaveProfile: (updated: Partial<UserProfileData>) => void;
  handleFamilyClick: () => void;
}

export const ModalsContainer: React.FC<ModalsContainerProps> = ({
  profile,
  setProfile,
  coinsBalance,
  diamondsBalance,
  dashboardBadges,
  adminRole,
  isOwner,
  userAgencyStatus,
  setUserAgencyStatus,
  pendingAgencyInfo,
  setPendingAgencyInfo,
  userFamilyId,
  setUserFamilyId,
  userFamilyName,
  setUserFamilyName,
  isRechargeModalOpen,
  setIsRechargeModalOpen,
  activeStatModal,
  setActiveStatModal,
  selectedBadge,
  setSelectedBadge,
  isEditModalOpen,
  setIsEditModalOpen,
  isUserProfileModalOpen,
  setIsUserProfileModalOpen,
  isSettingsModalOpen,
  setIsSettingsModalOpen,
  isCustomerServiceModalOpen,
  setIsCustomerServiceModalOpen,
  isDownloadApkOpen,
  setIsDownloadApkOpen,
  isSuperLegendModalOpen,
  setIsSuperLegendModalOpen,
  isLevelModalOpen,
  setIsLevelModalOpen,
  isFamilyModalOpen,
  setIsFamilyModalOpen,
  isBadgesCenterModalOpen,
  setIsBadgesCenterModalOpen,
  isAppearanceModalOpen,
  setIsAppearanceModalOpen,
  isVipCenterModalOpen,
  setIsVipCenterModalOpen,
  isAgencyModalOpen,
  setIsAgencyModalOpen,
  isRechargeAgencyModalOpen,
  setIsRechargeAgencyModalOpen,
  isOfficialAgencyManagerModalOpen,
  setIsOfficialAgencyManagerModalOpen,
  isAgencyRepModalOpen,
  setIsAgencyRepModalOpen,
  isModeratorModalOpen,
  setIsModeratorModalOpen,
  isBrokerCenterModalOpen,
  setIsBrokerCenterModalOpen,
  isBroadcasterCenterModalOpen,
  setIsBroadcasterCenterModalOpen,
  isGeniusModalOpen,
  setIsGeniusModalOpen,
  isFriendlyPointsModalOpen,
  setIsFriendlyPointsModalOpen,
  isMallModalOpen,
  setIsMallModalOpen,
  isJoinAgencyModalOpen,
  setIsJoinAgencyModalOpen,
  isExploreFamiliesModalOpen,
  setIsExploreFamiliesModalOpen,
  isAgencyHostCenterModalOpen,
  setIsAgencyHostCenterModalOpen,
  activeServiceModal,
  setActiveServiceModal,
  activeVoiceRoom,
  setActiveVoiceRoom,
  isRoomMinimized,
  setIsRoomMinimized,
  handleSaveProfile,
  handleFamilyClick
}) => {
  return (
    <>
      {/* Official Agency Wallet & Recharge Modal */}
      {isRechargeModalOpen && (
        <Suspense fallback={<LazyModalSkeleton title="المحفظة الرسمية ووكلاء الشحن" />}>
          <RechargeModal
            isOpen={isRechargeModalOpen}
            onClose={() => setIsRechargeModalOpen(false)}
            userId={profile.userId}
            userName={profile.name}
            currentCoins={coinsBalance}
            currentDiamonds={diamondsBalance}
            onContactSupport={() => {
              setIsRechargeModalOpen(false);
              setIsCustomerServiceModalOpen(true);
            }}
          />
        </Suspense>
      )}

      {/* Modals & Dialogs */}
      {activeStatModal !== null && (
        <Suspense fallback={<LazyModalSkeleton title="تفاصيل البيانات" />}>
          <StatDetailModal
            isOpen={activeStatModal !== null}
            onClose={() => setActiveStatModal(null)}
            activeStat={activeStatModal}
            visitors={getVisitorsList(profile.userId)}
            friends={getFriendsList(profile.userId)}
            followers={getFollowingList(profile.userId)}
            likes={getLikesList(profile.userId)}
            profile={profile}
            dashboardBadges={dashboardBadges}
          />
        </Suspense>
      )}

      {selectedBadge !== null && (
        <Suspense fallback={<LazyModalSkeleton title="تفاصيل الشارة" />}>
          <BadgeDetailModal badge={selectedBadge} onClose={() => setSelectedBadge(null)} />
        </Suspense>
      )}

      {isEditModalOpen && (
        <Suspense fallback={<LazyModalSkeleton title="تعديل الملف الشخصي" />}>
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
        </Suspense>
      )}

      {/* User Profile Detail Modal */}
      {isUserProfileModalOpen && (
        <Suspense fallback={<LazyModalSkeleton title="الملف الشخصي" />}>
          <UserProfileModal
            isOpen={isUserProfileModalOpen}
            onClose={() => setIsUserProfileModalOpen(false)}
            onOpenFamily={handleFamilyClick}
            userProfile={profile}
          />
        </Suspense>
      )}

      {/* Services Modals */}
      {isSettingsModalOpen && (
        <Suspense fallback={<LazyModalSkeleton title="الإعدادات" />}>
          <SettingsModal
            isOpen={isSettingsModalOpen}
            onClose={() => setIsSettingsModalOpen(false)}
            onOpenCustomerService={() => setIsCustomerServiceModalOpen(true)}
          />
        </Suspense>
      )}

      {isCustomerServiceModalOpen && (
        <Suspense fallback={<LazyModalSkeleton title="خدمة العملاء والدعم الفني" />}>
          <CustomerServiceModal
            isOpen={isCustomerServiceModalOpen}
            onClose={() => setIsCustomerServiceModalOpen(false)}
          />
        </Suspense>
      )}

      {/* نافذة تنزيل وتثبيت تطبيق الأندرويد APK */}
      <DownloadApkModal
        isOpen={isDownloadApkOpen}
        onClose={() => setIsDownloadApkOpen(false)}
      />

      {isSuperLegendModalOpen && (
        <Suspense fallback={<LazyModalSkeleton title="سوبر ليجند" />}>
          <SuperLegendModal
            isOpen={isSuperLegendModalOpen}
            onClose={() => setIsSuperLegendModalOpen(false)}
            onOpenRecharge={() => setIsRechargeModalOpen(true)}
          />
        </Suspense>
      )}

      {isLevelModalOpen && (
        <Suspense fallback={<LazyModalSkeleton title="مستوى ورتبة المستخدم" />}>
          <UserLevelModal
            isOpen={isLevelModalOpen}
            onClose={() => setIsLevelModalOpen(false)}
            level={profile.level || 1}
            userName={profile.name || "(عابر سبيل)"}
            avatarUrl={profile.avatarUrl}
          />
        </Suspense>
      )}

      {isFamilyModalOpen && (
        <Suspense fallback={<LazyModalSkeleton title="العائلة والقبيلة" />}>
          <FamilyModal
            isOpen={isFamilyModalOpen}
            onClose={() => setIsFamilyModalOpen(false)}
          />
        </Suspense>
      )}

      {isBadgesCenterModalOpen && (
        <Suspense fallback={<LazyModalSkeleton title="مركز الشارات الملكية" />}>
          <BadgesCenterModal
            isOpen={isBadgesCenterModalOpen}
            onClose={() => setIsBadgesCenterModalOpen(false)}
            userName={profile.name || "(عابر سبيل)"}
            avatarUrl={profile.avatarUrl}
            badges={profile.badges}
            userId={profile.userId || '1001001'}
            onSelectBadge={(badge) => setSelectedBadge(badge)}
          />
        </Suspense>
      )}

      {isAppearanceModalOpen && (
        <Suspense fallback={<LazyModalSkeleton title="المظهر والخلفيات" />}>
          <AppearanceModal
            isOpen={isAppearanceModalOpen}
            onClose={() => setIsAppearanceModalOpen(false)}
            avatarUrl={profile.avatarUrl}
            userName={profile.name || "عابر سبيل"}
          />
        </Suspense>
      )}

      {isVipCenterModalOpen && (
        <Suspense fallback={<LazyModalSkeleton title="مركز VIP الملكي" />}>
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
        </Suspense>
      )}

      {isAgencyModalOpen && (
        <Suspense fallback={<LazyModalSkeleton title="مركز الوكالة" />}>
          <AgencyModal
            isOpen={isAgencyModalOpen}
            onClose={() => setIsAgencyModalOpen(false)}
            userAvatar={profile.avatarUrl}
            userName={profile.name}
            agencyGid={(profile as any).agencyId || (profile as any).agencyGid || 'AG-101'}
          />
        </Suspense>
      )}

      {/* مودال وكالة شحن */}
      {isRechargeAgencyModalOpen && (
        <Suspense fallback={<LazyModalSkeleton title="وكالة الشحن المعتمدة" />}>
          <RechargeAgencyModal
            isOpen={isRechargeAgencyModalOpen}
            onClose={() => setIsRechargeAgencyModalOpen(false)}
            currentUserCoins={coinsBalance}
          />
        </Suspense>
      )}

      {/* مركز ولوحة مدير الوكالات الرسمية والمندوبين */}
      {isOfficialAgencyManagerModalOpen && (
        <Suspense fallback={<LazyModalSkeleton title="مدير الوكالات الرسمية" />}>
          <OfficialAgencyManagerModal
            isOpen={isOfficialAgencyManagerModalOpen}
            onClose={() => setIsOfficialAgencyManagerModalOpen(false)}
            managerId={profile.userId || '1001001'}
            managerName={profile.nickname || profile.name}
            managerAvatar={profile.avatarUrl}
            hierarchyCode="MGR-9901"
            isSuperAdmin={isOwner || adminRole === 'super_admin'}
          />
        </Suspense>
      )}

      {/* مركز ولوحة مندوب الوكالات الرسمية */}
      {isAgencyRepModalOpen && (
        <Suspense fallback={<LazyModalSkeleton title="مندوب الوكالات الرسمية" />}>
          <AgencyRepresentativeModal
            isOpen={isAgencyRepModalOpen}
            onClose={() => setIsAgencyRepModalOpen(false)}
            repId={profile.userId || '1001001'}
            repName={profile.nickname || profile.name}
            repAvatar={profile.avatarUrl}
            hierarchyCode="DEL-401"
            isSuperAdmin={isOwner || adminRole === 'super_admin'}
          />
        </Suspense>
      )}

      {/* لوحة المراقب العام والدعم */}
      {isModeratorModalOpen && (
        <Suspense fallback={<LazyModalSkeleton title="لوحة المراقب العام" />}>
          <ModeratorDashboardModal
            isOpen={isModeratorModalOpen}
            onClose={() => setIsModeratorModalOpen(false)}
            userId={profile.userId}
          />
        </Suspense>
      )}

      {/* مركز الوساطة والتوظيف للوسطاء */}
      {isBrokerCenterModalOpen && (
        <Suspense fallback={<LazyModalSkeleton title="مركز الوسطاء والتوظيف" />}>
          <BrokerCenterModal
            isOpen={isBrokerCenterModalOpen}
            onClose={() => setIsBrokerCenterModalOpen(false)}
          />
        </Suspense>
      )}

      {/* مركز المذيعين */}
      {isBroadcasterCenterModalOpen && (
        <Suspense fallback={<LazyModalSkeleton title="مركز المذيعين" />}>
          <BroadcasterCenterModal
            isOpen={isBroadcasterCenterModalOpen}
            onClose={() => setIsBroadcasterCenterModalOpen(false)}
            userName={profile.name}
            userAvatar={profile.avatarUrl}
            userId={profile.userId}
          />
        </Suspense>
      )}

      {/* تميز النجم */}
      {(isGeniusModalOpen || activeServiceModal === 'genius') && (
        <Suspense fallback={<LazyModalSkeleton title="تميز النجم الذكي" />}>
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
        </Suspense>
      )}

      {/* نقاط ودية */}
      {(isFriendlyPointsModalOpen || activeServiceModal === 'friendly_points') && (
        <Suspense fallback={<LazyModalSkeleton title="نقاط ودية ومكافآت" />}>
          <FriendlyPointsModal
            isOpen={isFriendlyPointsModalOpen || activeServiceModal === 'friendly_points'}
            onClose={() => {
              setIsFriendlyPointsModalOpen(false);
              if (activeServiceModal === 'friendly_points') setActiveServiceModal(null);
            }}
            currentUserName={profile.name}
            currentUserAvatar={profile.avatarUrl}
          />
        </Suspense>
      )}

      {/* المركز التجاري */}
      {(isMallModalOpen || activeServiceModal === 'mall') && (
        <Suspense fallback={<LazyModalSkeleton title="المركز التجاري الملكي" />}>
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
        </Suspense>
      )}

      {/* بوابة الانضمام للوكالات المعتمدة */}
      {isJoinAgencyModalOpen && (
        <Suspense fallback={<LazyModalSkeleton title="مركز الانضمام للوكالات" />}>
          <JoinAgencyModal
            isOpen={isJoinAgencyModalOpen}
            onClose={() => setIsJoinAgencyModalOpen(false)}
            userId={profile.userId}
            userName={profile.name}
            userAvatar={profile.avatarUrl}
            agencyStatus={userAgencyStatus}
            pendingAgencyInfo={pendingAgencyInfo}
            onSuccessJoin={(agId, agName) => {
              setUserAgencyStatus('pending');
              setPendingAgencyInfo({ agencyId: agId, agencyName: agName });
            }}
            onCancelPending={() => {
              setUserAgencyStatus('none');
              setPendingAgencyInfo({});
            }}
            onOpenHostCenter={(agId, agName) => {
              setUserAgencyStatus('active');
              setProfile((prev) => ({ ...prev, agencyId: agId, agencyName: agName } as any));
              setIsBroadcasterCenterModalOpen(true);
            }}
          />
        </Suspense>
      )}

      {/* بوابة استكشاف وتأسيس العائلات */}
      {isExploreFamiliesModalOpen && (
        <Suspense fallback={<LazyModalSkeleton title="استكشاف العائلات" />}>
          <ExploreFamiliesModal
            isOpen={isExploreFamiliesModalOpen}
            onClose={() => setIsExploreFamiliesModalOpen(false)}
            userId={profile.userId}
            userName={profile.name}
            userAvatar={profile.avatarUrl}
            onJoinedFamily={(famId, famName) => {
              setUserFamilyId(famId);
              setUserFamilyName(famName);
              setIsFamilyModalOpen(true);
            }}
          />
        </Suspense>
      )}

      {/* مركز المضيفين الخاص بالوكالة */}
      {isAgencyHostCenterModalOpen && (
        <Suspense fallback={<LazyModalSkeleton title="مركز المضيفين" />}>
          <AgencyHostCenterModal
            isOpen={isAgencyHostCenterModalOpen}
            onClose={() => setIsAgencyHostCenterModalOpen(false)}
            agencyGid={(profile as any).agencyId || pendingAgencyInfo.agencyId || (profile as any).agencyGid || 'AG-101'}
            agencyName={(profile as any).agencyName || pendingAgencyInfo.agencyName || 'وكالة النخبة الملكية'}
            direction="rtl"
          />
        </Suspense>
      )}

      {activeServiceModal !== null && activeServiceModal !== 'genius' && activeServiceModal !== 'friendly_points' && activeServiceModal !== 'mall' && (
        <Suspense fallback={<LazyModalSkeleton title="الخدمة المطلوبة" />}>
          <ServicesModal
            activeService={activeServiceModal}
            onClose={() => setActiveServiceModal(null)}
          />
        </Suspense>
      )}

      {/* GLOBAL PERSISTENT VOICE ROOM */}
      {activeVoiceRoom && (
        <div
          id="global-voice-room-container"
          className={
            isRoomMinimized
              ? 'opacity-0 pointer-events-none invisible fixed inset-0 -z-50'
              : 'opacity-100 pointer-events-auto visible fixed inset-0 z-50'
          }
        >
          <ErrorBoundary fallback={<LazyModalSkeleton title="جاري تحضير الغرفة الصوتية..." />}>
            <Suspense fallback={<LazyModalSkeleton title="جاري الدخول إلى الغرفة الصوتية..." />}>
              <VoiceRoomScreen
                key={activeVoiceRoom.id}
                roomTitle={activeVoiceRoom.title}
                hostName={activeVoiceRoom.host}
                roomId={activeVoiceRoom.id}
                ownerId={activeVoiceRoom.ownerId}
                isOwner={Boolean(
                  activeVoiceRoom.id === 'my-own-room-7798' ||
                  (activeVoiceRoom.ownerId && activeVoiceRoom.ownerId === (profile?.userId || '1001001'))
                )}
                currentUserId={profile?.userId || '1001001'}
                currentUserName={profile?.name || 'مستخدم النجم'}
                currentUserAvatar={profile?.avatarUrl}
                currentUserVip={profile?.vipTier || 'VIP6'}
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
            </Suspense>
          </ErrorBoundary>
        </div>
      )}

      {/* GLOBAL FLOATING CIRCULAR ROOM BUBBLE */}
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
    </>
  );
};

export default ModalsContainer;
