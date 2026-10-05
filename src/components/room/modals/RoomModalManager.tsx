import React, { lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mic, Sparkles, Check, Users, Lock, LogOut, User, Radio, Gamepad2, ShieldCheck, MessageSquare } from 'lucide-react';
import type { ChatMessage } from '../roomTypes';
import type { MainRoomCustomizerConfig } from '../../../types/roomCustomizer';
import type { MicRequestItem } from '../../MicRequestQueueModal';
import type { PKSupporter } from '../../TeamBattleResultModal';
import type { NormalRoundResultData } from '../../NormalRoundResultModal';
import type { LuckyChestConfig } from '../../LuckyChestModal';
import type { ElectricOrbState } from '../../ElectricRefundEnergySphere';
import type { RefundDrawResult } from '../../../lib/refundVaultService';

// Dynamic Lazy Imports - Code Splitting / Lazy Loading on demand
const QuickMicOptionsModal = lazy(() => import('../../QuickMicOptionsModal').then(m => ({ default: m.QuickMicOptionsModal })));
const ProfessionalGiftPanel = lazy(() => import('../../ProfessionalGiftPanel').then(m => ({ default: m.ProfessionalGiftPanel })));
const MusicPlayerModal = lazy(() => import('../../MusicPlayerModal').then(m => ({ default: m.MusicPlayerModal })));
const EffectsAndSoundModal = lazy(() => import('../../audio').then(m => ({ default: m.EffectsAndSoundModal })));
const MovableEmojiLottiePicker = lazy(() => import('../../MovableEmojiLottiePicker').then(m => ({ default: m.MovableEmojiLottiePicker })));
const ModeratorStatsModal = lazy(() => import('../../moderator').then(m => ({ default: m.ModeratorStatsModal })));
const DigitalCounterControlModal = lazy(() => import('../../counter').then(m => ({ default: m.DigitalCounterControlModal })));
const RoomBackgroundStoreModal = lazy(() => import('../../wallpaper').then(m => ({ default: m.RoomBackgroundStoreModal })));
const TeamBattleModal = lazy(() => import('../../TeamBattleModal').then(m => ({ default: m.TeamBattleModal })));
const TeamBattleResultModal = lazy(() => import('../../TeamBattleResultModal').then(m => ({ default: m.TeamBattleResultModal })));
const NormalRoundResultModal = lazy(() => import('../../NormalRoundResultModal').then(m => ({ default: m.NormalRoundResultModal })));
const RoomTopOptionsController = lazy(() => import('../RoomTopOptionsController').then(m => ({ default: m.RoomTopOptionsController })));
const RoomInfoModalContainer = lazy(() => import('../RoomInfoModalContainer').then(m => ({ default: m.RoomInfoModalContainer })));
const RoomExitSection = lazy(() => import('./RoomExitSection').then(m => ({ default: m.RoomExitSection })));
const SeatActionModal = lazy(() => import('../../SeatActionModal').then(m => ({ default: m.SeatActionModal })));
const MicRequestQueueModal = lazy(() => import('../../MicRequestQueueModal').then(m => ({ default: m.MicRequestQueueModal })));
const CinemaYouTubePickerModal = lazy(() => import('../../CinemaYouTubePickerModal').then(m => ({ default: m.CinemaYouTubePickerModal })));
const LuckyChestModal = lazy(() => import('../../LuckyChestModal').then(m => ({ default: m.LuckyChestModal })));
const LuckyChestClaimModal = lazy(() => import('../../LuckyChestClaimModal').then(m => ({ default: m.LuckyChestClaimModal })));
const YoHoRoomMessagesModal = lazy(() => import('../../NajmRoomMessagesModal').then(m => ({ default: m.YoHoRoomMessagesModal })));
const YoHoRoomToolsAndGamesModal = lazy(() => import('../../NajmRoomToolsAndGamesModal').then(m => ({ default: m.YoHoRoomToolsAndGamesModal })));
const FamilyModal = lazy(() => import('../../FamilyModal').then(m => ({ default: m.FamilyModal })));
const SuperLegendModal = lazy(() => import('../../SuperLegendModal').then(m => ({ default: m.SuperLegendModal })));
const HostProfileModal = lazy(() => import('../../HostProfileModal').then(m => ({ default: m.HostProfileModal })));
const AdvancedUserProfileModal = lazy(() => import('../../AdvancedUserProfileModal').then(m => ({ default: m.AdvancedUserProfileModal })));
const UserProfileModal = lazy(() => import('../../UserProfileModal').then(m => ({ default: m.UserProfileModal })));
const DevConfigModal = lazy(() => import('../../DevConfigModal').then(m => ({ default: m.DevConfigModal })));
const LuckyRefundModal = lazy(() => import('../../LuckyRefundModal').then(m => ({ default: m.LuckyRefundModal })));

export interface RoomModalManagerProps {
  // Seat Action Modal
  showSeatActionModal: boolean;
  setShowSeatActionModal: (v: boolean) => void;
  selectedSeatForAction: number | null;
  setSelectedSeatForAction: (v: number | null) => void;
  allMicSeats: Array<{
    id: number;
    userId: string;
    userName: string;
    avatar?: string;
    isMuted?: boolean;
    isMutedByAdmin?: boolean;
    isLocked?: boolean;
    isEmpty?: boolean;
    isSpeaking?: boolean;
    isHost?: boolean;
    isInvitationPending?: boolean;
  }>;
  handleAcceptHostInvitation: () => void;
  handleRejectHostInvitation: () => void;
  isCurrentAdmin: boolean;
  currentUserRole: string;
  isOwner: boolean;
  CURRENT_USER_PROFILE_ID: string;
  handleTakeSeat: (seatId: number) => void;
  handleToggleLockSeat: (seatId: number) => void;
  handleToggleMuteSeat: (seatId: number, byAdmin?: boolean, silent?: boolean) => void;
  handleRequestMicFromUser: () => void;
  setTargetInviteSeatId: (seatId: number | null) => void;
  setShowAudienceModal: (v: boolean) => void;
  handleRemoveFromMic: (seatId: number, modName?: string) => void;
  setSelectedUserForProfile: (u: any) => void;
  setShowAdvancedProfileModal: (v: boolean) => void;

  // Mic Requests Queue Modal
  showMicRequestsModal: boolean;
  setShowMicRequestsModal: (v: boolean) => void;
  micRequests: MicRequestItem[];
  handleApproveMicRequest: (req: MicRequestItem) => void;
  handleRejectMicRequest: (reqId: string) => void;
  handleApproveAllMicRequests: () => void;
  handleClearAllMicRequests: () => void;

  // Invitee Mic Prompt Card
  pendingHostInvitation: { seatId: number; inviterName: string } | null;

  // Quick Mic Options
  showQuickMicOptionsModal: boolean;
  setShowQuickMicOptionsModal: (v: boolean) => void;
  selectedSeatForQuickMic?: number | null;
  myUserName: string;
  myUserAvatar: string;
  myUserId: string;
  myOccupiedSeat: any;
  handleLeaveSeat: (seatId?: number) => void;
  authUser: any;
  myVipLevel: string;
  setSelectedGiftTargetSeatIds: (ids: number[]) => void;
  setShowGiftDrawer: (v: boolean) => void;

  // Mic Mode Control Modal
  showMicControlModal: boolean;
  setShowMicControlModal: (v: boolean) => void;
  isCounterRunning: boolean;
  isCounterPaused: boolean;
  activeMicCount: number;
  onAttemptToChangeMicLayout: (cnt: number) => void;
  requireMicRequest: boolean;
  setRequireMicRequest: (v: boolean) => void;

  // Music Player Modal
  showMusicPlayerModal: boolean;
  setShowMusicPlayerModal: (v: boolean) => void;
  setToastNotification: (msg: string | null) => void;

  // Sound Effects Modal
  showSoundEffectsModal: boolean;
  setShowSoundEffectsModal: (v: boolean) => void;
  setIsSmartBalanceEnabled: (v: boolean) => void;

  // Dev Config Modal
  showDevConfigModal: boolean;
  setShowDevConfigModal: (v: boolean) => void;

  // Top Options Menu Modal
  showTopOptionsMenuModal: boolean;
  setShowTopOptionsMenuModal: (v: boolean) => void;
  currentAppRole: string;
  isRoomLocked: boolean;
  setRoomLockStatus: (locked: boolean, passcode?: string) => void;
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  isChatLocked: boolean;
  setIsChatLocked: (v: boolean) => void;
  setShowRoomBackgroundStoreModal: (v: boolean) => void;
  isIncognito: boolean;
  setIsIncognito: (v: boolean) => void;
  showCountersOnMics: boolean;
  stopCounter: () => void;
  setShowCountersOnMics: (v: boolean) => void;
  hostSeat: any;
  setNormalRoundResultData: (data: NormalRoundResultData) => void;
  setShowNormalRoundResultModal: (v: boolean) => void;
  setSeatCounters: React.Dispatch<React.SetStateAction<Record<number, number>>>;
  setIsCounterRunning: (v: boolean) => void;
  setIsCounterPaused: (v: boolean) => void;
  setRoomUptimeSeconds: (v: number) => void;
  setShowRoomInfoModal: (v: boolean) => void;
  showTeamBattleModal: boolean;
  setShowTeamBattleModal: (v: boolean) => void;
  showModeratorStatsModal: boolean;
  setShowModeratorStatsModal: (v: boolean) => void;
  setShowRoomSupportModal: (v: boolean) => void;

  // Moderator Stats Modal
  currentRoomTitle: string;

  // YoHo Bottom Tools Modal
  showYoHoBottomToolsModal: boolean;
  setShowYoHoBottomToolsModal: (v: boolean) => void;
  roomId?: string;
  isRoomSpeakerMuted: boolean;
  setIsRoomSpeakerMuted: (v: boolean) => void;
  voiceEngineRef: React.MutableRefObject<any>;
  isNoiseSuppressionEnabled: boolean;
  handleToggleNoiseSuppression: () => void;
  audioStreamMode: 'standard' | 'high_quality' | 'ultra_hd';
  handleToggleAudioStreamMode: () => void;
  setShowLuckyChestModal: (v: boolean) => void;
  setIsCinemaWatchMode: (v: boolean) => void;
  setShowCinemaVideoPickerModal: (v: boolean) => void;
  triggerRoomEntrance: (data: any) => void;
  triggerBatchRoomEntrance: (count: number) => void;
  currentUserName: string;

  // Cinema YouTube Picker Modal
  showCinemaVideoPickerModal: boolean;
  selectedCinemaVideo: any;
  videoSuggestions: any[];
  setSelectedCinemaVideo: (v: any) => void;
  updateRoomCinemaInFirestore: (roomId: string, data: any) => Promise<void>;
  handleSuggestVideo: (url: string) => void;
  handleAcceptSuggestion: (id: string) => void;
  handleDeleteSuggestion: (id: string) => void;

  // Lucky Chest Modal & Claim
  showLuckyChestModal: boolean;
  handleSendLuckyChest: (type: any, count: number) => void;
  userCoins: number;
  showLuckyChestClaimModal: boolean;
  setShowLuckyChestClaimModal: (v: boolean) => void;
  selectedChestForClaim: any;
  hostName: string;
  handleClaimLuckyChestPrize: (chestId: string) => void;

  // Room Background Store Modal
  showRoomBackgroundStoreModal: boolean;
  currentRoomBgUrl: string;
  setCurrentRoomBgUrl: (v: string) => void;
  setCurrentRoomBgName: (v: string) => void;
  saveRoomStateToCache: (roomId: string | undefined, data: any) => void;
  preloadWallpaperSilently: (url: string, name: string) => void;

  // Messages & Direct Chat Modal
  showYoHoMessagesModal: boolean;
  setShowYoHoMessagesModal: (v: boolean) => void;
  privateChatTargetUser: any;
  setPrivateChatTargetUser: (v: any) => void;

  // Digital Counter Control Modal
  showCounterControlModal: boolean;
  setShowCounterControlModal: (v: boolean) => void;
  selectedSeatForCounterControl: number | null;
  seatCounters: Record<number, number>;

  // Team Battle Modal
  setIsTeamBattleActive: (v: boolean) => void;
  setTeamBattleStatus: (v: any) => void;
  setTeamBattleTimer: (v: number) => void;
  setOwnerJoinedTeam: (v: any) => void;
  setRedTeamScore: (v: number) => void;
  setBlueTeamScore: (v: number) => void;
  setPkTopSupportersMap: (v: any) => void;

  // Normal Round & Team Battle Results
  showNormalRoundResultModal: boolean;
  normalRoundResultData: NormalRoundResultData | null;
  showTeamBattleResultModal: boolean;
  setShowTeamBattleResultModal: (v: boolean) => void;
  pkResultData: {
    redScore: number;
    blueScore: number;
    winner: 'red' | 'blue' | 'draw';
    topSupporter?: PKSupporter;
  };

  // Room Info Modal Container
  showRoomInfoModal: boolean;
  currentRoomAvatar?: string;
  setCurrentUserRole: (v: string) => void;
  setShowSettingsDrawer: (v: boolean) => void;
  setCurrentRoomTitle: (v: string) => void;
  saveRoomThemeAndWallpaperToFirestore: (data: any) => Promise<void>;
  setCurrentRoomAvatar: (v: string) => void;

  // Room Exit Modal
  showRoomExitModal: boolean;
  setShowRoomExitModal: (v: boolean) => void;
  handleKeepInBackground: () => void;
  handleSoloExit: () => void;
  handleDissolveRoom: () => void;

  // Full User Profile Modal
  showFullUserProfileModal: boolean;
  setShowFullUserProfileModal: (v: boolean) => void;
  fullProfileUser: any;

  // Advanced User Profile Modal
  showAdvancedProfileModal: boolean;
  selectedUserForProfile: any;
  handleKickFromRoom: (u: any) => void;
  setInputMessage: (v: string) => void;
  setShowChatInputModal: (v: boolean) => void;
  setFullProfileUser: (u: any) => void;

  // Audience & Invites Modal
  showAudienceModal: boolean;
  targetInviteSeatId: number | null;
  availableAudienceForInvite: any[];
  invitedUserIds: string[];
  handleDirectInviteToMic: (user: any, seatId: number | null) => void;
  handleUserExitRoom: (userId: string, userName: string) => void;

  // Family & Super Legend Modals
  showFamilyModal: boolean;
  setShowFamilyModal: (v: boolean) => void;
  showSuperLegendModal: boolean;
  setShowSuperLegendModal: (v: boolean) => void;
  onOpenRecharge?: () => void;

  // Host Profile Modal
  showHostProfileModal: boolean;
  setShowHostProfileModal: (v: boolean) => void;

  // Emoji Picker & Gifts Panel
  showEmojiPicker: boolean;
  setShowEmojiPicker: (v: boolean) => void;
  handleSendEmojiReaction: (reaction: any) => void;
  showGiftDrawer: boolean;
  userCoinsBalance: number;
  selectedGiftTargetSeatIds: number[];
  handleSendGift: (
    title: string,
    icon: string,
    val: number,
    name: string,
    target: string,
    seatIds: number[],
    videoUrl?: string,
    giftObj?: any
  ) => void;
  activeSeats: any[];

  // Lucky Refund Jackpots
  activeRefundDrawResult: RefundDrawResult | null;
  setActiveRefundDrawResult: (v: any) => void;

  // Settings & Games Drawer
  showSettingsDrawer: boolean;
  showGamesDrawer: boolean;
  setShowGamesDrawer: (v: boolean) => void;
}

export const RoomModalManager: React.FC<RoomModalManagerProps> = (props) => {
  const {
    showSeatActionModal, setShowSeatActionModal, selectedSeatForAction, setSelectedSeatForAction,
    allMicSeats, handleAcceptHostInvitation, handleRejectHostInvitation, isCurrentAdmin,
    currentUserRole, isOwner, CURRENT_USER_PROFILE_ID, handleTakeSeat, handleToggleLockSeat,
    handleToggleMuteSeat, handleRequestMicFromUser, setTargetInviteSeatId, setShowAudienceModal,
    handleRemoveFromMic, setSelectedUserForProfile, setShowAdvancedProfileModal, showMicRequestsModal,
    setShowMicRequestsModal, micRequests, handleApproveMicRequest, handleRejectMicRequest,
    handleApproveAllMicRequests, handleClearAllMicRequests, pendingHostInvitation,
    showQuickMicOptionsModal, setShowQuickMicOptionsModal, selectedSeatForQuickMic,
    myUserName, myUserAvatar, myUserId, myOccupiedSeat, handleLeaveSeat, authUser,
    myVipLevel, setSelectedGiftTargetSeatIds, setShowGiftDrawer, showMicControlModal,
    setShowMicControlModal, isCounterRunning, isCounterPaused, activeMicCount,
    onAttemptToChangeMicLayout, requireMicRequest, setRequireMicRequest, showMusicPlayerModal,
    setShowMusicPlayerModal, setToastNotification, showSoundEffectsModal, setShowSoundEffectsModal,
    setIsSmartBalanceEnabled, showDevConfigModal, setShowDevConfigModal, showTopOptionsMenuModal,
    setShowTopOptionsMenuModal, currentAppRole, isRoomLocked, setRoomLockStatus, setChatMessages,
    isChatLocked, setIsChatLocked, setShowRoomBackgroundStoreModal, isIncognito, setIsIncognito,
    showCountersOnMics, stopCounter, setShowCountersOnMics, hostSeat, setNormalRoundResultData,
    setShowNormalRoundResultModal, setSeatCounters, setIsCounterRunning, setIsCounterPaused,
    setRoomUptimeSeconds, setShowRoomInfoModal, showTeamBattleModal, setShowTeamBattleModal,
    showModeratorStatsModal, setShowModeratorStatsModal, setShowRoomSupportModal, currentRoomTitle,
    showYoHoBottomToolsModal, setShowYoHoBottomToolsModal,
    roomId, isRoomSpeakerMuted, setIsRoomSpeakerMuted, voiceEngineRef, isNoiseSuppressionEnabled,
    handleToggleNoiseSuppression, audioStreamMode, handleToggleAudioStreamMode, setShowLuckyChestModal,
    setIsCinemaWatchMode, setShowCinemaVideoPickerModal, triggerRoomEntrance, triggerBatchRoomEntrance,
    currentUserName, showCinemaVideoPickerModal, selectedCinemaVideo, videoSuggestions,
    setSelectedCinemaVideo, updateRoomCinemaInFirestore, handleSuggestVideo, handleAcceptSuggestion,
    handleDeleteSuggestion, showLuckyChestModal, handleSendLuckyChest, userCoins,
    showLuckyChestClaimModal, setShowLuckyChestClaimModal, selectedChestForClaim, hostName,
    handleClaimLuckyChestPrize, showRoomBackgroundStoreModal, currentRoomBgUrl, setCurrentRoomBgUrl,
    setCurrentRoomBgName, saveRoomStateToCache, preloadWallpaperSilently, showYoHoMessagesModal,
    setShowYoHoMessagesModal, privateChatTargetUser, setPrivateChatTargetUser, showCounterControlModal,
    setShowCounterControlModal, selectedSeatForCounterControl, seatCounters, setIsTeamBattleActive,
    setTeamBattleStatus, setTeamBattleTimer, setOwnerJoinedTeam, setRedTeamScore, setBlueTeamScore,
    setPkTopSupportersMap, showNormalRoundResultModal, normalRoundResultData, showTeamBattleResultModal,
    setShowTeamBattleResultModal, pkResultData, showRoomInfoModal, currentRoomAvatar,
    setCurrentUserRole, setShowSettingsDrawer, setCurrentRoomTitle, saveRoomThemeAndWallpaperToFirestore,
    setCurrentRoomAvatar, showRoomExitModal, setShowRoomExitModal, handleKeepInBackground,
    handleSoloExit, handleDissolveRoom, showFullUserProfileModal, setShowFullUserProfileModal,
    fullProfileUser, showAdvancedProfileModal, selectedUserForProfile, handleKickFromRoom,
    setInputMessage, setShowChatInputModal, setFullProfileUser, showAudienceModal, targetInviteSeatId,
    availableAudienceForInvite, invitedUserIds, handleDirectInviteToMic, handleUserExitRoom,
    showFamilyModal, setShowFamilyModal, showSuperLegendModal, setShowSuperLegendModal,
    onOpenRecharge, showHostProfileModal, setShowHostProfileModal, showEmojiPicker,
    setShowEmojiPicker, handleSendEmojiReaction, showGiftDrawer, userCoinsBalance,
    selectedGiftTargetSeatIds, handleSendGift, activeSeats, activeRefundDrawResult,
    setActiveRefundDrawResult, showSettingsDrawer, showGamesDrawer, setShowGamesDrawer
  } = props;

  return (
    <>
      {/* 1. SEAT ACTION MODAL */}
      {showSeatActionModal && (
        <Suspense fallback={null}>
          <SeatActionModal
            isOpen={showSeatActionModal}
            onClose={() => {
              setShowSeatActionModal(false);
              setSelectedSeatForAction(null);
            }}
            seatId={selectedSeatForAction}
            seatUserName={
              selectedSeatForAction
                ? allMicSeats.find((s) => s.id === selectedSeatForAction)?.userName
                : undefined
            }
            isSeatLocked={
              selectedSeatForAction
                ? allMicSeats.find((s) => s.id === selectedSeatForAction)?.isLocked
                : false
            }
            isSeatMuted={
              selectedSeatForAction
                ? allMicSeats.find((s) => s.id === selectedSeatForAction)?.isMuted
                : false
            }
            isInvitationPending={
              selectedSeatForAction
                ? Boolean(allMicSeats.find((s) => s.id === selectedSeatForAction)?.isInvitationPending)
                : false
            }
            onAcceptInvitation={() => {
              handleAcceptHostInvitation();
              setShowSeatActionModal(false);
            }}
            onCancelInvitation={() => {
              handleRejectHostInvitation();
              setShowSeatActionModal(false);
            }}
            isCurrentAdmin={isOwner || currentUserRole === 'moderator'}
            isRoomOwner={isOwner}
            currentUserSeatId={
              myOccupiedSeat?.id ||
              allMicSeats.find((s) => !s.isEmpty && (s.userId === CURRENT_USER_PROFILE_ID || s.userId === myUserId || Boolean(s.userName?.includes('أنا'))))?.id
            }
            onTakeSeat={(seatId) => handleTakeSeat(seatId)}
            onToggleLockSeat={(seatId) => handleToggleLockSeat(seatId)}
            onToggleMuteSeat={(seatId) => handleToggleMuteSeat(seatId, true)}
            onRequestMic={() => handleRequestMicFromUser()}
            onInviteAudience={(seatId) => {
              setTargetInviteSeatId(seatId);
              setSelectedSeatForAction(seatId);
              setShowSeatActionModal(false);
              setShowAudienceModal(true);
            }}
            onRemoveFromMic={(seatId) => handleRemoveFromMic(seatId)}
            onViewProfile={(seatId) => {
              const targetSeat = allMicSeats.find((s) => s.id === seatId);
              if (targetSeat) {
                const isMe =
                  targetSeat.userId === myUserId ||
                  targetSeat.userId === CURRENT_USER_PROFILE_ID ||
                  (Boolean(authUser?.id) && targetSeat.userId === authUser?.id) ||
                  targetSeat.userName === myUserName ||
                  (targetSeat.isHost && isOwner);

                if (isMe) {
                  setSelectedUserForProfile({
                    id: myUserId,
                    userId: myUserId,
                    name: myUserName,
                    avatar: myUserAvatar,
                    country: authUser?.country || 'اليمن',
                    countryFlag: authUser?.country === 'السعودية' ? '🇸🇦' : '🇾🇪',
                    isHost: Boolean(currentUserRole === 'host' || isOwner),
                    isMuted: targetSeat.isMuted,
                    isMutedByAdmin: targetSeat.isMutedByAdmin,
                    seatId: targetSeat.id,
                    vip: myVipLevel,
                    vipLevel: (authUser as any)?.vipLevel || (authUser as any)?.vip || 8,
                    level: authUser?.level || 1,
                    bio: authUser?.bio || 'أهلاً بكم في ملفي الشخصي في تطبيق النجم 🌟',
                    badges: [
                      { id: 'b1', label: isOwner ? 'المالك والمبرمج 👑' : (currentUserRole === 'host' ? 'المضيف 👑' : 'متحدث المايك'), icon: '👑', bgClass: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black' },
                      { id: 'b2', label: myVipLevel, icon: '💎', bgClass: 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold' }
                    ]
                  });
                } else {
                  setSelectedUserForProfile({
                    id: targetSeat.userId || `user_${targetSeat.id}`,
                    userId: targetSeat.userId || `user_${targetSeat.id}`,
                    name: targetSeat.userName,
                    avatar: targetSeat.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
                    country: 'اليمن',
                    countryFlag: '🇾🇪',
                    isHost: targetSeat.isHost,
                    isMuted: targetSeat.isMuted,
                    isMutedByAdmin: targetSeat.isMutedByAdmin,
                    seatId: targetSeat.id,
                    vip: targetSeat.vipLevel || 'VIP 3',
                    level: 1,
                    bio: 'مستخدم مميز في تطبيق النجم 🌟'
                  });
                }
                setShowAdvancedProfileModal(true);
              }
            }}
          />
        </Suspense>
      )}

      {/* 2. MIC REQUEST QUEUE MODAL */}
      {showMicRequestsModal && (
        <Suspense fallback={null}>
          <MicRequestQueueModal
            isOpen={showMicRequestsModal}
            onClose={() => setShowMicRequestsModal(false)}
            requests={micRequests}
            userRole={currentUserRole}
            isCurrentAdmin={isCurrentAdmin}
            onApproveRequest={handleApproveMicRequest}
            onRejectRequest={handleRejectMicRequest}
            onApproveAll={handleApproveAllMicRequests}
            onClearAll={handleClearAllMicRequests}
          />
        </Suspense>
      )}

      {/* 3. INVITEE MIC PROMPT CARD */}
      <AnimatePresence>
        {pendingHostInvitation && (
          <div
            className="fixed top-16 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-sm pointer-events-auto select-none"
            dir="rtl"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: -20 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="bg-[#101728]/95 backdrop-blur-md border-2 border-amber-400 rounded-2xl p-4 text-white shadow-[0_12px_40px_rgba(0,0,0,0.9)] flex flex-col gap-3.5"
            >
              <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                  <div className="w-11 h-11 rounded-full bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center text-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.6)]">
                    <Mic className="w-5 h-5 animate-pulse" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 p-0.5 rounded-full ring-2 ring-[#101728]">
                    <Sparkles className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                </div>
                <div className="text-right min-w-0 flex-1">
                  <h4 className="text-sm font-black text-white flex items-center gap-1.5 flex-wrap">
                    <span>لقد دعاك {pendingHostInvitation.inviterName} إلى المايك</span>
                    <span className="text-amber-400 font-bold text-xs font-mono">#{pendingHostInvitation.seatId}</span>
                  </h4>
                  <p className="text-xs text-slate-300 font-medium mt-1 leading-relaxed">
                    صورتك متواجدة على المايك مع إشارة المايك الصفراء 🟡 لا يصدر صوت إلا عند الضغط على موافق.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1 border-t border-white/10">
                <button
                  type="button"
                  onClick={handleAcceptHostInvitation}
                  className="flex-1 py-2.5 px-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:brightness-110 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>موافق (بدء التحدث وبث الصوت 🎙️)</span>
                </button>
                <button
                  type="button"
                  onClick={handleRejectHostInvitation}
                  className="flex-1 py-2.5 px-4 bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 hover:text-rose-200 font-bold text-xs rounded-xl border border-rose-500/30 flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95"
                >
                  <X className="w-4 h-4 stroke-[2.5]" />
                  <span>رفض</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. QUICK MIC & HOST OPTIONS MODAL */}
      {showQuickMicOptionsModal && (
        <Suspense fallback={null}>
          <QuickMicOptionsModal
            isOpen={showQuickMicOptionsModal}
            onClose={() => setShowQuickMicOptionsModal(false)}
            seatId={myOccupiedSeat?.id || selectedSeatForAction || selectedSeatForQuickMic || undefined}
            userName={myUserName}
            avatar={myUserAvatar}
            userId={myUserId}
            isHost={Boolean(currentUserRole === 'host' || isOwner)}
            isMuted={
              myOccupiedSeat
                ? Boolean(myOccupiedSeat.isMuted)
                : Boolean(selectedSeatForAction ? allMicSeats.find((s) => s.id === selectedSeatForAction)?.isMuted : false)
            }
            canControlMic={true}
            isCurrentAdmin={isCurrentAdmin}
            onToggleMute={() => {
              const activeSeatId = myOccupiedSeat?.id || selectedSeatForAction || selectedSeatForQuickMic;
              if (activeSeatId) {
                handleToggleMuteSeat(activeSeatId, undefined, true);
              }
            }}
            onLeaveSeat={() => handleLeaveSeat(myOccupiedSeat?.id || selectedSeatForAction || selectedSeatForQuickMic || undefined)}
            onOpenDataStats={() => {
              setShowQuickMicOptionsModal(false);
              const activeSeatId = myOccupiedSeat?.id || selectedSeatForAction || selectedSeatForQuickMic;
              const mySeatObj = myOccupiedSeat || (activeSeatId ? allMicSeats.find((s) => s.id === activeSeatId) : null);
              setSelectedUserForProfile({
                id: myUserId,
                name: myUserName,
                avatar: myUserAvatar,
                userId: myUserId,
                country: authUser?.country || 'اليمن',
                countryFlag: authUser?.country === 'السعودية' ? '🇸🇦' : '🇾🇪',
                isHost: Boolean(currentUserRole === 'host' || isOwner),
                isMuted: mySeatObj ? mySeatObj.isMuted : false,
                isMutedByAdmin: mySeatObj ? mySeatObj.isMutedByAdmin : false,
                seatId: activeSeatId || 1,
                vip: myVipLevel,
                vipLevel: (authUser as any)?.vipLevel || (authUser as any)?.vip || 8,
                level: authUser?.level || 1,
                bio: authUser?.bio || 'أهلاً بكم في ملفي الشخصي في سوبر ليجند 🌟',
                badges: [
                  { id: 'b1', label: isOwner ? 'المالك والمبرمج 👑' : (currentUserRole === 'host' ? 'المضيف 👑' : 'متحدث المايك'), icon: '👑', bgClass: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black' },
                  { id: 'b2', label: myVipLevel, icon: '💎', bgClass: 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold' },
                  { id: 'b3', label: 'سوبر أسطورة', icon: '🔥', bgClass: 'bg-gradient-to-r from-red-500 to-amber-500 text-white font-bold' }
                ],
                cpRelation: {
                  partnerName: 'أميرة الشرق 👑',
                  partnerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
                  level: 25,
                  intimacyPoints: '128,900',
                  title: 'الشريك الماسي 💖'
                }
              });
              setShowAdvancedProfileModal(true);
            }}
            onSendGift={() => {
              const activeSeatId = myOccupiedSeat?.id || selectedSeatForAction || selectedSeatForQuickMic || 1;
              setSelectedGiftTargetSeatIds([activeSeatId]);
              setShowQuickMicOptionsModal(false);
              setShowGiftDrawer(true);
            }}
          />
        </Suspense>
      )}

      {/* 5. DYNAMIC MIC CONTROL PANEL MODAL (Owner only) */}
      <AnimatePresence>
        {showMicControlModal && isOwner && (
          <div
            className="fixed inset-0 z-50 bg-transparent flex items-center justify-center p-3 pointer-events-auto cursor-default select-none"
            onClick={() => setShowMicControlModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-[#121929] border border-slate-700/60 rounded-3xl overflow-hidden shadow-2xl text-white space-y-3.5 pb-4 pointer-events-auto"
              dir="rtl"
            >
              <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-3.5 text-center relative shadow-md">
                <h2 className="text-base font-black text-white tracking-wide">وضع الميكروفون</h2>
                <button
                  onClick={() => setShowMicControlModal(false)}
                  className="absolute top-3 left-3 p-1 rounded-full bg-black/20 hover:bg-black/40 text-white/90 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="px-3.5 space-y-3">
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-2.5 text-[11px] text-amber-300 font-bold leading-snug space-y-1">
                  <div className="flex items-center gap-1 text-amber-200">
                    <span>نصائح:</span>
                    <span>1. المقعد الممتاز مناسب فقط للوضع mic-9؛</span>
                  </div>
                  <div className="text-amber-300/90 pr-11">
                    2. لا يدعم الوضع mic-9 ألعاب العملات الفضية؛
                  </div>
                </div>

                <div className={`grid grid-cols-3 gap-2.5 max-h-[380px] overflow-y-auto pr-0.5 custom-scrollbar transition-all ${
                  isCounterRunning && !isCounterPaused ? 'opacity-40 grayscale pointer-events-none select-none' : 'opacity-100'
                }`}>
                  {[2, 5, 8, 9, 12, 15, 20].map((preset) => {
                    const isSelected = activeMicCount === preset;
                    return (
                      <button
                        key={preset}
                        disabled={isCounterRunning && !isCounterPaused}
                        onClick={() => onAttemptToChangeMicLayout(preset)}
                        className="flex flex-col items-center gap-1 group cursor-pointer disabled:cursor-not-allowed"
                      >
                        <div
                          className={`relative w-full aspect-[4/3] rounded-2xl p-1.5 transition-all flex flex-col items-center justify-center gap-1 overflow-hidden ${
                            isSelected
                              ? 'bg-[#182338] border-2 border-emerald-400 shadow-[0_0_18px_rgba(16,185,129,0.35)]'
                              : 'bg-[#151E2E] border border-white/10 hover:border-emerald-500/40 hover:bg-[#1A263B]'
                          }`}
                        >
                          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/15 via-purple-900/20 to-slate-950/90 pointer-events-none" />
                          {isSelected && (
                            <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center shadow-xs">
                              <Check className="w-2.5 h-2.5 text-slate-950 stroke-[3]" />
                            </div>
                          )}
                          <span className="font-mono font-black text-sm text-white group-hover:text-emerald-300 transition-colors">
                            {preset}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold">ميكروفون</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-300">
                    يلزمك أن تطلب أن تكون على الميكروفون.
                  </span>
                  <button
                    onClick={() => setRequireMicRequest(!requireMicRequest)}
                    className={`w-10 h-5.5 rounded-full p-0.5 transition-colors cursor-pointer relative shrink-0 ${
                      requireMicRequest ? 'bg-emerald-500' : 'bg-slate-700'
                    }`}
                  >
                    <div
                      className={`w-4.5 h-4.5 rounded-full bg-white shadow-sm transition-transform ${
                        requireMicRequest ? 'translate-x-0' : '-translate-x-4.5'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. MUSIC PLAYER MODAL */}
      {showMusicPlayerModal && (
        <Suspense fallback={null}>
          <MusicPlayerModal
            isOpen={showMusicPlayerModal}
            onClose={() => setShowMusicPlayerModal(false)}
            currentUserRole={currentUserRole}
            canControl={isOwner || currentUserRole === 'host' || currentUserRole === 'moderator'}
            isMicSpeaking={allMicSeats.some((s) => !s.isEmpty && !s.isMuted && s.isSpeaking)}
            onToastNotification={(msg) => {
              setToastNotification(msg);
              setTimeout(() => setToastNotification(null), 3000);
            }}
          />
        </Suspense>
      )}

      {/* 7. SOUND EFFECTS MODAL */}
      {showSoundEffectsModal && (
        <Suspense fallback={null}>
          <EffectsAndSoundModal
            isOpen={showSoundEffectsModal}
            onClose={() => setShowSoundEffectsModal(false)}
            onTriggerToast={(msg) => {
              setToastNotification(msg);
              setTimeout(() => setToastNotification(null), 3000);
            }}
            onSettingsChanged={(cfg) => {
              if (cfg.smartBalance !== undefined) {
                setIsSmartBalanceEnabled(cfg.smartBalance);
              }
            }}
          />
        </Suspense>
      )}

      {/* 8. DEV CONFIG MODAL */}
      {showDevConfigModal && (
        <Suspense fallback={null}>
          <DevConfigModal
            isOpen={showDevConfigModal}
            onClose={() => setShowDevConfigModal(false)}
          />
        </Suspense>
      )}

      {/* 9. TOP OPTIONS MENU CONTROLLER */}
      {showTopOptionsMenuModal && (
        <Suspense fallback={null}>
          <RoomTopOptionsController
            isOpen={showTopOptionsMenuModal}
            onClose={() => setShowTopOptionsMenuModal(false)}
            currentUserRole={currentUserRole}
            currentAppRole={currentAppRole}
            isOwner={isOwner}
            isVIP={true}
            userVipLevel={8}
            isRoomLocked={isRoomLocked}
            onToggleLockRoom={(passcode) => {
              setRoomLockStatus(!isRoomLocked, passcode);
            }}
            onClearChat={() => {
              setChatMessages([]);
              setToastNotification('تم مسح جميع رسائل الدردشة 🧹');
              setTimeout(() => setToastNotification(null), 3000);
            }}
            isChatLocked={isChatLocked}
            onToggleLockChat={() => {
              setIsChatLocked(!isChatLocked);
              setToastNotification(!isChatLocked ? 'تم قفل الدردشة في الغرفة 🚫' : 'تم فتح الدردشة في الغرفة 💬');
              setTimeout(() => setToastNotification(null), 3000);
            }}
            onOpenWallpapers={() => setShowRoomBackgroundStoreModal(true)}
            isIncognito={isIncognito}
            onToggleIncognito={() => {
              if (!isRoomLocked) {
                setToastNotification('يجب إغلاق الغرفة أولاً لاستخدام ميزة الإخفاء');
                setTimeout(() => setToastNotification(null), 3000);
                return;
              }
              const nextState = !isIncognito;
              setIsIncognito(nextState);
              setToastNotification(nextState ? 'تم تفعيل خاصية إخفاء الغرفة عن الجميع (تختفي من قائمة الرومات) 🥷🔒' : 'تم تعطيل وضع الإخفاء وإظهار الغرفة 👁️');
              setTimeout(() => setToastNotification(null), 3000);
            }}
            isCountersVisible={isCounterRunning && !isCounterPaused && showCountersOnMics}
            isCounterActive={isCounterRunning && !isCounterPaused}
            onOpenLeaderboard={() => {
              if (isCounterRunning && !isCounterPaused) {
                stopCounter();
                setShowCountersOnMics(false);
                const seatScoresList: Array<{ seatId: number; userName: string; avatar?: string; score: number }> = [];
                let totalScore = 0;
                allMicSeats.forEach((seat) => {
                  const val = seatCounters[seat.id] || 0;
                  totalScore += val;
                  if (val > 0 || !seat.isEmpty) {
                    seatScoresList.push({
                      seatId: seat.id,
                      userName: seat.userName,
                      avatar: seat.avatar,
                      score: val
                    });
                  }
                });
                seatScoresList.sort((a, b) => b.score - a.score);
                const topItem = seatScoresList[0] || {
                  seatId: 1,
                  userName: hostSeat?.userName || 'مالك الروم',
                  avatar: hostSeat?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
                  score: 0
                };
                setNormalRoundResultData({
                  topSeatName: topItem.userName,
                  topSeatAvatar: topItem.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
                  topSeatNumber: topItem.seatId,
                  topSeatScore: topItem.score,
                  totalRoundScore: totalScore,
                  seatScores: seatScoresList
                });
                setShowNormalRoundResultModal(true);
                setToastNotification('تم إيقاف العداد وإظهار نتيجة النجم الأكثر دعماً للجولة العادية 🏆');
                setTimeout(() => setToastNotification(null), 3500);
              } else {
                setSeatCounters({});
                setIsCounterRunning(true);
                setIsCounterPaused(false);
                setShowCountersOnMics(true);
                setRoomUptimeSeconds(0);
                setToastNotification('تم تشغيل العداد الرقمي المباشر وبدء جولة جديدة من الصفر 🔢✨');
                setTimeout(() => setToastNotification(null), 3000);
              }
            }}
            onOpenRoomMode={() => setShowRoomInfoModal(true)}
            onOpenMusic={() => setShowMusicPlayerModal(true)}
            onOpenSoundEffects={() => setShowSoundEffectsModal(true)}
            onOpenMicMode={() => {
              if (isOwner) {
                setShowMicControlModal(true);
              } else {
                setToastNotification('تغيير وضع المايك متاح لمضيف الغرفة فقط 🎙️');
                setTimeout(() => setToastNotification(null), 3000);
              }
            }}
            onStartTeamBattle={() => {
              if (!isOwner) {
                setToastNotification('عذراً، بدء معركة الفريق متاح حصرياً لمالك الغرفة (Room Owner) فقط 👑');
                setTimeout(() => setToastNotification(null), 3000);
                return;
              }
              const allowedMicCounts = [2, 5, 8, 9];
              if (!allowedMicCounts.includes(activeMicCount)) {
                setToastNotification('لا يمكن تشغيل التحدي بهذا العدد من المايكات');
                setTimeout(() => setToastNotification(null), 3000);
                return;
              }
              setShowTeamBattleModal(true);
            }}
            onStartRoomPK={() => {
              setToastNotification('تم فتح تحدي الغُرَف PK 🥊🔥');
              setTimeout(() => setToastNotification(null), 3000);
            }}
            onOpenModeratorStats={() => {
              setShowTopOptionsMenuModal(false);
              setShowModeratorStatsModal(true);
            }}
            onOpenRoomStats={() => {
              setShowTopOptionsMenuModal(false);
              setShowRoomSupportModal(true);
            }}
            onOpenRoomInfo={() => {
              setShowTopOptionsMenuModal(false);
              setShowRoomInfoModal(true);
            }}
            onTriggerToast={(msg) => {
              setToastNotification(msg);
              setTimeout(() => setToastNotification(null), 3200);
            }}
          />
        </Suspense>
      )}

      {/* 10. MODERATOR AUDIT & STATS MODAL */}
      {showModeratorStatsModal && (
        <Suspense fallback={null}>
          <ModeratorStatsModal
            isOpen={showModeratorStatsModal}
            onClose={() => setShowModeratorStatsModal(false)}
            currentUserRole={currentUserRole}
            roomTitle={currentRoomTitle}
            onTriggerToast={(msg) => {
              setToastNotification(msg);
              setTimeout(() => setToastNotification(null), 3200);
            }}
          />
        </Suspense>
      )}

      {/* 11. YOHO BOTTOM TOOLS & GAMES MODAL */}
      {showYoHoBottomToolsModal && (
        <Suspense fallback={null}>
          <YoHoRoomToolsAndGamesModal
            isOpen={showYoHoBottomToolsModal}
            onClose={() => setShowYoHoBottomToolsModal(false)}
            roomId={roomId}
            roomTitle={currentRoomTitle}
            currentUserRole={currentUserRole}
            currentAppRole={currentAppRole}
            isOwner={isOwner}
            isSpeakerMuted={isRoomSpeakerMuted}
            onToggleSpeaker={() => {
              const nextState = !isRoomSpeakerMuted;
              setIsRoomSpeakerMuted(nextState);
              if (voiceEngineRef.current) {
                voiceEngineRef.current.setSpeakerMuted(nextState);
              }
              setToastNotification(nextState ? 'تم إيقاف مكبر الصوت 🔇' : 'تم تشغيل مكبر الصوت 🔊');
              setTimeout(() => setToastNotification(null), 3000);
            }}
            isNoiseSuppressionEnabled={isNoiseSuppressionEnabled}
            onToggleNoiseSuppression={handleToggleNoiseSuppression}
            audioStreamMode={audioStreamMode}
            onToggleAudioStreamMode={handleToggleAudioStreamMode}
            onOpenSoundEffects={() => setShowSoundEffectsModal(true)}
            onOpenMusicPlayer={() => setShowMusicPlayerModal(true)}
            onOpenLuckyBox={() => setShowLuckyChestModal(true)}
            onOpenCinemaWatchParty={() => {
              if (isOwner) {
                setIsCinemaWatchMode(true);
                setShowCinemaVideoPickerModal(true);
                setToastNotification('تم فتح نافذة سينما الروم وتشغيل الفيديوهات 🎬🍿');
                setTimeout(() => setToastNotification(null), 3200);
              } else {
                setShowCinemaVideoPickerModal(true);
                setToastNotification('خاصية تشغيل الفيديو لمالك الغرفة فقط 👑 - يمكنك اقتراح مقاطع لعرضها 💡');
                setTimeout(() => setToastNotification(null), 3500);
              }
            }}
            onTriggerToast={(msg) => {
              setToastNotification(msg);
              setTimeout(() => setToastNotification(null), 3200);
            }}
            onTestEntrance={(vipLevel, userName) => {
              triggerRoomEntrance({
                userName: userName || currentUserName || 'تـTarfsرف ☕',
                vipLevel: vipLevel,
                actionText: 'انضم إلى الغرفة',
              });
            }}
            onTestBatchEntrance={(count) => {
              triggerBatchRoomEntrance(count || 10);
            }}
          />
        </Suspense>
      )}

      {/* 12. CINEMA VIDEO PICKER */}
      {showCinemaVideoPickerModal && (
        <Suspense fallback={null}>
          <CinemaYouTubePickerModal
            isOpen={showCinemaVideoPickerModal}
            onClose={() => setShowCinemaVideoPickerModal(false)}
            isOwner={isOwner}
            currentUserRole={currentUserRole}
            currentUserName={
              currentUserRole === 'host'
                ? 'المضيف (أنا)'
                : currentUserRole === 'owner'
                ? (hostSeat?.userName || 'مالك الغرفة')
                : currentUserRole === 'moderator'
                ? 'المشرف (أنا)'
                : 'عضو الغرفة (أنا)'
            }
            currentUserId={hostSeat?.userId || 'user_current'}
            currentUserAvatar={hostSeat?.avatar}
            currentVideoId={selectedCinemaVideo?.youtubeId}
            suggestions={videoSuggestions}
            onSelectVideo={(video) => {
              setSelectedCinemaVideo(video);
              setIsCinemaWatchMode(true);
              updateRoomCinemaInFirestore(roomId || 'default-room', {
                videoId: video.id,
                youtubeId: video.youtubeId,
                title: video.title,
                author: video.author,
                thumbnail: video.thumbnail,
                isPlaying: true,
                updatedBy: myUserName,
                updatedAt: Date.now()
              }).catch(() => {});
            }}
            onSuggestVideo={handleSuggestVideo}
            onAcceptSuggestion={handleAcceptSuggestion}
            onDeleteSuggestion={handleDeleteSuggestion}
            onTriggerToast={(msg) => {
              setToastNotification(msg);
              setTimeout(() => setToastNotification(null), 3200);
            }}
          />
        </Suspense>
      )}

      {/* 13. LUCKY CHEST MODAL */}
      {showLuckyChestModal && (
        <Suspense fallback={null}>
          <LuckyChestModal
            isOpen={showLuckyChestModal}
            onClose={() => setShowLuckyChestModal(false)}
            onSendChest={handleSendLuckyChest}
            userCoins={userCoins}
            onTriggerToast={(msg) => {
              setToastNotification(msg);
              setTimeout(() => setToastNotification(null), 3500);
            }}
          />
        </Suspense>
      )}

      {/* 14. LUCKY CHEST CLAIM MODAL */}
      {showLuckyChestClaimModal && (
        <Suspense fallback={null}>
          <LuckyChestClaimModal
            isOpen={showLuckyChestClaimModal}
            onClose={() => setShowLuckyChestClaimModal(false)}
            chest={selectedChestForClaim}
            currentUserId={hostSeat?.userId || '88492011'}
            currentUserName={hostSeat?.userName || hostName || 'عابر سبيل'}
            currentUserAvatar={hostSeat?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'}
            onClaimPrize={handleClaimLuckyChestPrize}
            onTriggerToast={(msg) => {
              setToastNotification(msg);
              setTimeout(() => setToastNotification(null), 3500);
            }}
          />
        </Suspense>
      )}

      {/* 15. ROOM BACKGROUND STORE MODAL */}
      {showRoomBackgroundStoreModal && (
        <Suspense fallback={null}>
          <RoomBackgroundStoreModal
            isOpen={showRoomBackgroundStoreModal}
            onClose={() => setShowRoomBackgroundStoreModal(false)}
            activeBackgroundUrl={currentRoomBgUrl}
            roomId={roomId}
            isOwner={isOwner}
            ownerId={hostSeat?.userId || '88492011'}
            ownerName={hostSeat?.userName || hostName}
            roomTitle={currentRoomTitle}
            currentAppRole={currentAppRole}
            onSelectBackground={(bgUrl, bgName) => {
              setCurrentRoomBgUrl(bgUrl);
              setCurrentRoomBgName(bgName);
              saveRoomStateToCache(roomId, {
                wallpaperUrl: bgUrl,
                wallpaperName: bgName
              });
              preloadWallpaperSilently(bgUrl, bgName);
              setToastNotification(`تم تغيير خلفية الغرفة إلى "${bgName}" 🎨✨`);
              setTimeout(() => setToastNotification(null), 3000);
            }}
            isUnlockedViaGiftOrStore={true}
          />
        </Suspense>
      )}

      {/* 16. YOHO ROOM DIRECT MESSAGES MODAL */}
      {showYoHoMessagesModal && (
        <Suspense fallback={null}>
          <YoHoRoomMessagesModal
            isOpen={showYoHoMessagesModal}
            onClose={() => {
              setShowYoHoMessagesModal(false);
              setPrivateChatTargetUser(null);
            }}
            targetUser={privateChatTargetUser}
            onOpenUserProfile={(userData) => {
              setSelectedUserForProfile(userData);
              setShowAdvancedProfileModal(true);
            }}
          />
        </Suspense>
      )}

      {/* 17. DIGITAL COUNTER CONTROL MODAL */}
      {showCounterControlModal && (
        <Suspense fallback={null}>
          <DigitalCounterControlModal
            isOpen={showCounterControlModal}
            onClose={() => setShowCounterControlModal(false)}
            seatId={selectedSeatForCounterControl}
            seatUserName={
              selectedSeatForCounterControl
                ? allMicSeats.find((s) => s.id === selectedSeatForCounterControl)?.userName || `المقعد #${selectedSeatForCounterControl}`
                : ''
            }
            currentValue={
              selectedSeatForCounterControl ? seatCounters[selectedSeatForCounterControl] || 0 : 0
            }
            onUpdateCounter={(seatId, newValue) => {
              setSeatCounters((prev) => ({ ...prev, [seatId]: newValue }));
            }}
            onResetCounter={(seatId) => {
              setSeatCounters((prev) => ({ ...prev, [seatId]: 0 }));
            }}
            onTriggerToast={(msg) => {
              setToastNotification(msg);
              setTimeout(() => setToastNotification(null), 3200);
            }}
            isCounterRunning={isCounterRunning}
            isCounterPaused={isCounterPaused}
            onToggleCounterRunning={() => {
              if (isCounterRunning && !isCounterPaused) {
                stopCounter();
                setToastNotification('تم إيقاف العداد بنجاح ⏸️');
              } else {
                setIsCounterRunning(true);
                setIsCounterPaused(false);
                setShowCountersOnMics(true);
                setRoomUptimeSeconds(0);
                setToastNotification('تم تشغيل العداد بنجاح ▶️');
              }
              setTimeout(() => setToastNotification(null), 3000);
            }}
          />
        </Suspense>
      )}

      {/* 18. TEAM BATTLE MODAL */}
      {showTeamBattleModal && (
        <Suspense fallback={null}>
          <TeamBattleModal
            isOpen={showTeamBattleModal}
            onClose={() => setShowTeamBattleModal(false)}
            activeMicCount={activeMicCount}
            onConfirmStart={(config) => {
              const allowedMicCounts = [2, 4, 5, 6, 8, 9, 10, 12, 15, 20];
              if (!allowedMicCounts.includes(activeMicCount)) {
                setToastNotification('لا يمكن تشغيل التحدي بهذا العدد من المايكات');
                setTimeout(() => setToastNotification(null), 3000);
                return;
              }
              setIsTeamBattleActive(true);
              setTeamBattleStatus('preparation');
              setTeamBattleTimer(config.durationMinutes * 60);
              setOwnerJoinedTeam(config.joinedTeam);
              setRedTeamScore(0);
              setBlueTeamScore(0);
              setSeatCounters({});
              setPkTopSupportersMap({});
              setToastNotification(`تم إعداد معركة الفريق (${config.durationMinutes} دقيقة). اضغط "بدء المعركة" للانطلاق ⚔️🔥`);
              setTimeout(() => setToastNotification(null), 3500);
            }}
            onTriggerToast={(msg) => {
              setToastNotification(msg);
              setTimeout(() => setToastNotification(null), 3200);
            }}
          />
        </Suspense>
      )}

      {/* 19. NORMAL ROUND RESULT MODAL */}
      {showNormalRoundResultModal && (
        <Suspense fallback={null}>
          <NormalRoundResultModal
            isOpen={showNormalRoundResultModal}
            onClose={() => {
              setShowNormalRoundResultModal(false);
              setSeatCounters({});
            }}
            resultData={normalRoundResultData}
          />
        </Suspense>
      )}

      {/* 20. TEAM BATTLE RESULT MODAL */}
      {showTeamBattleResultModal && (
        <Suspense fallback={null}>
          <TeamBattleResultModal
            isOpen={showTeamBattleResultModal}
            onClose={() => setShowTeamBattleResultModal(false)}
            redScore={pkResultData.redScore}
            blueScore={pkResultData.blueScore}
            winner={pkResultData.winner}
            topSupporter={pkResultData.topSupporter}
          />
        </Suspense>
      )}

      {/* 21. ROOM INFO & MANAGEMENT MODAL */}
      {showRoomInfoModal && (
        <Suspense fallback={null}>
          <RoomInfoModalContainer
            isOpen={showRoomInfoModal}
            onClose={() => setShowRoomInfoModal(false)}
            roomTitle={currentRoomTitle}
            roomId={roomId}
            hostAvatar={currentRoomAvatar || hostSeat?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
            hostName={hostSeat?.userName || 'مالك الغرفة'}
            currentUserRole={currentUserRole}
            isRoomOwner={currentUserRole === 'owner' && isOwner}
            currentAppRole={currentAppRole}
            agencyName="وكالة أبو أمجد لتسجيل المضيفين"
            agencyOwnerName="أبو أمجد 👑"
            agencyGid="88902"
            onRoleChange={(role) => setCurrentUserRole(role)}
            onOpenSettings={() => setShowSettingsDrawer(true)}
            onUpdateRoomTitle={(newTitle) => {
              if (currentUserRole !== 'owner' || !isOwner) {
                setToastNotification('🔒 غير مصرح: تعديل اسم الروم متاح فقط لصاحب الروم (المالك)، ولا يحق للمشرف أو المضيف تعديله');
                setTimeout(() => setToastNotification(null), 3000);
                return;
              }
              setCurrentRoomTitle(newTitle);
              try {
                localStorage.setItem(`super_legend_room_title_${roomId}`, newTitle);
              } catch (e) {}
              saveRoomThemeAndWallpaperToFirestore({
                roomId,
                isOwner: isOwner,
                roomTitle: newTitle
              }).catch(() => {});
              setToastNotification(`تم تغيير اسم الروم إلى "${newTitle}" بنجاح 🏷️👑`);
              setTimeout(() => setToastNotification(null), 3000);
            }}
            onUpdateRoomAvatar={(newAvatarUrl) => {
              if (currentUserRole !== 'owner' || !isOwner) {
                setToastNotification('🔒 غير مصرح: تعديل صورة الروم متاح فقط لصاحب الروم (المالك)، ولا يحق للمشرف أو المضيف تعديلها');
                setTimeout(() => setToastNotification(null), 3000);
                return;
              }
              setCurrentRoomAvatar(newAvatarUrl);
              try {
                localStorage.setItem(`super_legend_room_avatar_${roomId}`, newAvatarUrl);
              } catch (e) {}
              saveRoomThemeAndWallpaperToFirestore({
                roomId,
                isOwner: isOwner,
                roomAvatar: newAvatarUrl
              }).catch(() => {});
              setToastNotification(`تم تحديث صورة الغرفة بنجاح وتطبيقها خارج وداخل الروم 📸👑`);
              setTimeout(() => setToastNotification(null), 3000);
            }}
          />
        </Suspense>
      )}

      {/* 22. ROOM EXIT MODAL */}
      {showRoomExitModal && (
        <Suspense fallback={null}>
          <RoomExitSection
            isOpen={showRoomExitModal}
            onClose={() => setShowRoomExitModal(false)}
            onKeepInBackground={handleKeepInBackground}
            onExit={handleSoloExit}
            onDissolveAll={handleDissolveRoom}
            isOwner={isOwner}
            roomTitle={currentRoomTitle}
            hostName={hostSeat?.userName || hostName}
            onTriggerToast={(msg) => {
              setToastNotification(msg);
              setTimeout(() => setToastNotification(null), 3000);
            }}
          />
        </Suspense>
      )}

      {/* 23. FULL USER PROFILE MODAL */}
      {showFullUserProfileModal && fullProfileUser && (
        <Suspense fallback={null}>
          <UserProfileModal
            isOpen={showFullUserProfileModal}
            onClose={() => setShowFullUserProfileModal(false)}
            userProfile={{
              id: fullProfileUser.id,
              userId: fullProfileUser.userId || fullProfileUser.id,
              name: fullProfileUser.name,
              avatarUrl: fullProfileUser.avatar,
              country: fullProfileUser.country || 'اليمن',
              countryFlag: fullProfileUser.countryFlag || '🇾🇪',
              bio: fullProfileUser.bio || 'أهلاً بكم في ملفي الشخصي في سوبر ليجند 🌟',
              vipLevel: fullProfileUser.vipLevel || (fullProfileUser.isHost ? 'VIP8' : 'VIP6'),
              superLegendLevel: fullProfileUser.superLegendLevel || 'SL1',
              stats: { friends: 120, followers: 5365, visitors: 892 }
            } as any}
          />
        </Suspense>
      )}

      {/* 24. ADVANCED USER PROFILE MODAL */}
      {showAdvancedProfileModal && selectedUserForProfile && (
        <Suspense fallback={null}>
          <AdvancedUserProfileModal
            isOpen={showAdvancedProfileModal}
            onClose={() => setShowAdvancedProfileModal(false)}
            user={selectedUserForProfile}
            isCurrentAdmin={isCurrentAdmin}
            isRoomOwner={isOwner}
            currentAppRole={currentAppRole}
            onSendGift={(u) => {
              const targetSeatId = (u as any)?.seatId || selectedUserForProfile?.seatId || 1;
              setSelectedGiftTargetSeatIds([targetSeatId]);
              setShowAdvancedProfileModal(false);
              setShowGiftDrawer(true);
            }}
            onMentionUser={(u) => {
              setInputMessage(`@${u.name} `);
              setShowChatInputModal(true);
              setToastNotification(`🔔 تم إرسال إشارة تذكير إلى @${u.name} على الشات`);
              setTimeout(() => setToastNotification(null), 3000);
            }}
            onToggleMuteUser={(u) => {
              if (u.seatId) handleToggleMuteSeat(u.seatId, u.isMutedByAdmin !== undefined ? u.isMutedByAdmin : true);
            }}
            onManageSeat={(u) => {
              const targetSeatId =
                u.seatId || allMicSeats.find((s) => !s.isEmpty && (s.userName === u.name || s.userId === u.userId))?.id;
              if (targetSeatId) {
                const modName = isOwner ? 'المالك' : 'المشرف';
                handleRemoveFromMic(targetSeatId, modName);
                setToastNotification(`🪑 تم إنزال ${u.name} من المقعد بنجاح`);
                setTimeout(() => setToastNotification(null), 3000);
              }
            }}
            onKickFromRoom={(u) => handleKickFromRoom(u)}
            onOpenAdminControls={() => setShowRoomInfoModal(true)}
            onOpenPrivateChat={(u) => {
              setPrivateChatTargetUser(u || selectedUserForProfile);
              setShowAdvancedProfileModal(false);
              setShowYoHoMessagesModal(true);
            }}
            onOpenFullProfile={(u) => {
              setFullProfileUser(u);
              setShowAdvancedProfileModal(false);
              setShowFullUserProfileModal(true);
            }}
          />
        </Suspense>
      )}

      {/* 25. AUDIENCE / INVITE LIST MODAL */}
      <AnimatePresence>
        {showAudienceModal && (() => {
          const effectiveInviteSeatId = targetInviteSeatId ?? selectedSeatForAction;
          const canEscalateToMic = isOwner || isCurrentAdmin || currentUserRole === 'owner' || currentUserRole === 'moderator';
          return (
            <div
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center p-0 sm:p-4 pointer-events-auto cursor-default select-none"
              onClick={() => {
                setShowAudienceModal(false);
                setTargetInviteSeatId(null);
                setSelectedSeatForAction(null);
              }}
            >
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md bg-[#121827] border-t-2 border-indigo-500/60 sm:border-2 rounded-t-3xl sm:rounded-3xl p-4 space-y-3 text-white shadow-2xl max-h-[80vh] flex flex-col pointer-events-auto"
                dir="rtl"
              >
                <div className="flex items-center justify-between pb-2 border-b border-white/10 shrink-0">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-400" />
                    <div>
                      <h2 className="text-base font-black text-indigo-300">
                        دعوة شخص للمايك {effectiveInviteSeatId ? `#${effectiveInviteSeatId}` : ''} 🎙️
                      </h2>
                      <p className="text-[10px] text-slate-400 font-medium">
                        المتواجدون بالشات والغرفة فقط (غير متواجدين على المايكات)
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAudienceModal(false);
                      setTargetInviteSeatId(null);
                      setSelectedSeatForAction(null);
                    }}
                    className="p-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="bg-[#1A2234] border border-white/10 rounded-xl p-2 flex items-center justify-between gap-2 shrink-0">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Mic className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="text-xs font-bold text-slate-300">المايك المحدد:</span>
                    <span className="text-xs font-black text-amber-300 bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 rounded-lg whitespace-nowrap">
                      {effectiveInviteSeatId ? `مايك #${effectiveInviteSeatId}` : 'أول مايك متاح'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 overflow-x-auto max-w-[170px] custom-scrollbar py-0.5" title="اضغط لاختيار مايك محدد">
                    {allMicSeats.slice(0, activeMicCount).filter(s => s.isEmpty || s.id === effectiveInviteSeatId).map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          setTargetInviteSeatId(s.id);
                          setSelectedSeatForAction(s.id);
                        }}
                        className={`text-[10px] px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer shrink-0 ${
                          effectiveInviteSeatId === s.id
                            ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                            : 'bg-white/10 text-slate-300 hover:bg-white/20'
                        }`}
                      >
                        #{s.id}
                      </button>
                    ))}
                  </div>
                </div>

                {!canEscalateToMic && (
                  <div className="bg-amber-500/15 border border-amber-500/30 rounded-xl p-2.5 flex items-center gap-2 text-amber-300 text-[11px] shrink-0 font-medium">
                    <Lock className="w-4 h-4 shrink-0 text-amber-400" />
                    <span>تنبيه: المضيف العادي لا يحق له تصعيد أي شخص إلى المايك. هذه الصلاحية للمشرف الذي لديه صلاحية أو صاحب الروم فقط.</span>
                  </div>
                )}

                <div className="overflow-y-auto space-y-2 flex-1 pr-1 custom-scrollbar">
                  {availableAudienceForInvite.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 space-y-2">
                      <Users className="w-8 h-8 mx-auto text-slate-600 opacity-50" />
                      <p className="text-xs font-bold">لا يوجد أعضاء في الشات خارج المايكات حالياً</p>
                      <p className="text-[10px] text-slate-500">جميع المتواجدين إما على المايكات أو المضيف</p>
                    </div>
                  ) : (
                    availableAudienceForInvite.map((usr) => {
                      const isInvited = Boolean(invitedUserIds?.includes(usr.id));

                      const handleSendInvite = () => {
                        if (!canEscalateToMic) {
                          setToastNotification('عذراً! المضيف العادي لا يحق له تصعيد أي شخص إلى المايك. هذه الصلاحية للمشرف أو صاحب الروم فقط 🛑');
                          setTimeout(() => setToastNotification(null), 3200);
                          return;
                        }
                        handleDirectInviteToMic(usr, effectiveInviteSeatId);
                      };

                      return (
                        <div
                          key={usr.id}
                          className="p-2.5 bg-[#1A2234] border border-white/10 hover:border-amber-500/60 rounded-2xl flex items-center justify-between transition-all hover:scale-[1.01] hover:bg-[#202B42]"
                        >
                          <div
                            onClick={canEscalateToMic ? handleSendInvite : () => {
                              setToastNotification('عذراً! المضيف العادي لا يحق له تصعيد أي شخص إلى المايك. هذه الصلاحية للمشرف أو صاحب الروم فقط 🛑');
                              setTimeout(() => setToastNotification(null), 3200);
                            }}
                            className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer"
                          >
                            <img
                              src={usr.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'}
                              alt={usr.name}
                              className="w-10 h-10 rounded-full object-cover border border-indigo-400/50 shrink-0"
                            />
                            <div className="flex flex-col min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="font-extrabold text-xs text-white truncate">{usr.name}</span>
                                <span className="text-[9px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 rounded font-bold shrink-0">
                                  {usr.role}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 mt-0.5 text-[9px] text-slate-400 font-mono">
                                <span className="text-purple-300 font-bold">{usr.level}</span>
                                <span>•</span>
                                <span className="text-amber-300 font-bold">{usr.vip}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {canEscalateToMic ? (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSendInvite();
                                }}
                                className={`text-[11px] px-3 py-1.5 rounded-xl font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-md ${
                                  isInvited
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-emerald-500/10'
                                    : 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-110 text-slate-950 font-black'
                                }`}
                              >
                                <Mic className="w-3.5 h-3.5" />
                                <span>{isInvited ? 'تمت الدعوة ✓' : (effectiveInviteSeatId ? `دعوة للمايك #${effectiveInviteSeatId}` : 'دعوة للمايك')}</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setToastNotification('عذراً! المضيف العادي لا يحق له تصعيد أي شخص إلى المايك. هذه الصلاحية للمشرف أو صاحب الروم فقط 🛑');
                                  setTimeout(() => setToastNotification(null), 3200);
                                }}
                                className="text-[10px] px-2.5 py-1.5 rounded-xl font-bold flex items-center gap-1 bg-white/5 border border-white/10 text-slate-400 hover:text-slate-300 hover:bg-white/10 cursor-pointer"
                              >
                                <Lock className="w-3 h-3 text-slate-400" />
                                <span>صلاحية مشرف/مالك</span>
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowAudienceModal(false);
                                const isMe = usr.id === myUserId || usr.name === myUserName;
                                if (isMe) {
                                  setSelectedUserForProfile({
                                    id: myUserId,
                                    userId: myUserId,
                                    name: myUserName,
                                    avatar: myUserAvatar,
                                    country: authUser?.country || 'اليمن',
                                    countryFlag: authUser?.country === 'السعودية' ? '🇸🇦' : '🇾🇪',
                                    isHost: Boolean(currentUserRole === 'host' || isOwner),
                                    vip: myVipLevel,
                                    vipLevel: (authUser as any)?.vipLevel || (authUser as any)?.vip || 8,
                                    level: authUser?.level || 1,
                                    bio: authUser?.bio || 'أهلاً بكم في ملفي الشخصي في تطبيق النجم 🌟'
                                  });
                                } else {
                                  setSelectedUserForProfile({
                                    id: usr.id,
                                    userId: usr.id,
                                    name: usr.name,
                                    avatar: usr.avatar,
                                    country: 'اليمن',
                                    countryFlag: '🇾🇪',
                                    isHost: false,
                                    vip: usr.vip || 'VIP 3',
                                    level: usr.level || 1
                                  });
                                }
                                setShowAdvancedProfileModal(true);
                              }}
                              className="p-1.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 rounded-xl transition-all cursor-pointer flex items-center"
                            >
                              <User className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUserExitRoom(usr.id, usr.name);
                              }}
                              className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 border border-rose-500/20 rounded-xl transition-all cursor-pointer flex items-center gap-1 text-[10px]"
                            >
                              <LogOut className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">خروج</span>
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* 26. FAMILY MODAL */}
      {showFamilyModal && (
        <Suspense fallback={null}>
          <FamilyModal
            isOpen={showFamilyModal}
            onClose={() => setShowFamilyModal(false)}
          />
        </Suspense>
      )}

      {/* 27. SUPER LEGEND MODAL */}
      {showSuperLegendModal && (
        <Suspense fallback={null}>
          <SuperLegendModal
            isOpen={showSuperLegendModal}
            onClose={() => setShowSuperLegendModal(false)}
            onOpenRecharge={onOpenRecharge}
          />
        </Suspense>
      )}

      {/* 28. HOST PROFILE QUICK VIEW MODAL */}
      {showHostProfileModal && (
        <Suspense fallback={null}>
          <HostProfileModal
            isOpen={showHostProfileModal}
            onClose={() => setShowHostProfileModal(false)}
            hostName={hostSeat?.userName || 'أميرة الشرق 👑'}
            hostAvatar={hostSeat?.avatar}
            hostId={roomId}
            isHostMuted={hostSeat?.isMuted}
            canControlMic={currentUserRole === 'owner'}
            currentAppRole={currentAppRole}
            onToggleHostMute={() => {
              if (hostSeat?.id) handleToggleMuteSeat(hostSeat.id);
            }}
            onSendGift={() => {
              setSelectedGiftTargetSeatIds([hostSeat?.id || 1]);
              setShowHostProfileModal(false);
              setShowGiftDrawer(true);
            }}
            onMentionHost={() => {
              setInputMessage(`@${hostSeat?.userName || 'أميرة الشرق'} `);
              setShowChatInputModal(true);
            }}
            onOpenFullProfile={() => {
              setFullProfileUser({
                id: roomId || '8849201',
                userId: roomId || '8849201',
                name: hostSeat?.userName || 'أميرة الشرق 👑',
                avatar: hostSeat?.avatar,
                country: 'اليمن',
                countryFlag: '🇾🇪',
                isHost: true,
                isAdmin: true
              });
              setShowHostProfileModal(false);
              setShowFullUserProfileModal(true);
            }}
          />
        </Suspense>
      )}

      {/* 29. MOVABLE EMOJI / LOTTIE PICKER */}
      {showEmojiPicker && (
        <Suspense fallback={null}>
          <MovableEmojiLottiePicker
            isOpen={showEmojiPicker}
            onClose={() => setShowEmojiPicker(false)}
            onSendEmojiReaction={handleSendEmojiReaction}
          />
        </Suspense>
      )}

      {/* 30. PROFESSIONAL GIFTS PANEL */}
      {showGiftDrawer && (
        <Suspense fallback={null}>
          <ProfessionalGiftPanel
            roomId={roomId}
            isOpen={showGiftDrawer}
            onClose={() => {
              setShowGiftDrawer(false);
            }}
            userCoins={userCoinsBalance}
            initialSelectedSeatIds={selectedGiftTargetSeatIds}
            onOpenRecharge={onOpenRecharge}
            onSendGift={(gift, quantity, targetName, targetSeatIds) => {
              const totalVal = gift.price * quantity;
              handleSendGift(
                `${gift.name} (x${quantity}) [إلى: ${targetName}]`,
                gift.icon,
                totalVal,
                gift.name,
                targetName,
                targetSeatIds,
                gift.videoUrl,
                gift,
                quantity
              );
            }}
            seats={activeSeats}
          />
        </Suspense>
      )}

      {/* 31. LUCKY REFUND JACKPOT MODAL */}
      {activeRefundDrawResult && (
        <Suspense fallback={null}>
          <LuckyRefundModal
            result={activeRefundDrawResult}
            onClose={() => setActiveRefundDrawResult(null)}
            onConfirmCollect={() => setActiveRefundDrawResult(null)}
          />
        </Suspense>
      )}

      {/* 32. MINI-GAMES DRAWER */}
      <AnimatePresence>
        {showGamesDrawer && (
          <div
            className="fixed inset-0 z-50 bg-transparent flex items-end justify-center pointer-events-auto cursor-default select-none"
            onClick={() => setShowGamesDrawer(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-[#121827] border-t-2 border-indigo-500/60 rounded-t-3xl p-4 space-y-4 text-white pointer-events-auto shadow-2xl"
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Gamepad2 className="w-5 h-5 text-indigo-400" />
                  <h2 className="text-base font-black text-indigo-300">الألعاب التفاعلية بالروم</h2>
                </div>
                <button
                  onClick={() => setShowGamesDrawer(false)}
                  className="p-1.5 rounded-full bg-white/10 text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-4 rounded-2xl border border-white/20 text-center space-y-2 cursor-pointer hover:scale-102 transition-transform">
                  <div className="text-3xl">🎲</div>
                  <h3 className="text-sm font-black">LUDO التنافسية</h3>
                  <p className="text-[10px] text-indigo-100 font-bold">العب مع أعضاء المايك الآن</p>
                </div>

                <div className="bg-gradient-to-br from-amber-600 to-orange-600 p-4 rounded-2xl border border-white/20 text-center space-y-2 cursor-pointer hover:scale-102 transition-transform">
                  <div className="text-3xl">🎡</div>
                  <h3 className="text-sm font-black">عجلة الحظ الملكية</h3>
                  <p className="text-[10px] text-amber-100 font-bold">اربح ملايين الكوينز</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 33. ROOM SETTINGS DRAWER */}
      <AnimatePresence>
        {showSettingsDrawer && (
          <div
            className="fixed inset-0 z-50 bg-transparent flex items-end justify-center pointer-events-auto cursor-default select-none"
            onClick={() => setShowSettingsDrawer(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-[#121827] border-t-2 border-slate-700 rounded-t-3xl p-4 space-y-3 text-white pointer-events-auto shadow-2xl"
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <h2 className="text-base font-black text-amber-300">إعدادات الغرفة</h2>
                <button
                  onClick={() => setShowSettingsDrawer(false)}
                  className="p-1.5 rounded-full bg-white/10 text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">

                {isOwner && (
                  <button
                    onClick={() => {
                      if (isCounterRunning && !isCounterPaused) {
                        setToastNotification('يجب إيقاف العداد أولاً لتعديل وضع المايكات 🛑');
                        setTimeout(() => setToastNotification(null), 3000);
                      }
                      setShowSettingsDrawer(false);
                      setShowMicControlModal(true);
                    }}
                    className={`w-full p-3 border rounded-2xl flex items-center justify-between text-xs font-bold transition-colors shadow-sm cursor-pointer ${
                      isCounterRunning && !isCounterPaused
                        ? 'bg-slate-800/60 border-slate-700 text-slate-400 opacity-70'
                        : 'bg-[#1A2234] border-emerald-500/30 hover:bg-slate-700/80 text-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-xl border flex items-center justify-center ${
                        isCounterRunning && !isCounterPaused
                          ? 'bg-slate-700/40 border-slate-600/50 text-slate-400'
                          : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                      }`}>
                        <Radio className="w-4 h-4" />
                      </div>
                      <span className="font-extrabold text-xs">وضع الميكروفون</span>
                      {isCounterRunning && !isCounterPaused && (
                        <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded-md">مغلق (العداد يعمل) 🔒</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 bg-emerald-950/70 border border-emerald-500/40 px-2.5 py-1 rounded-full">
                      <span className="text-emerald-300 font-mono font-black text-xs">{activeMicCount}</span>
                      <span className="text-emerald-400 text-[10px] font-bold">ميكروفون</span>
                    </div>
                  </button>
                )}

                {(isOwner || isCurrentAdmin) && (
                  <button
                    onClick={() => {
                      setIsChatLocked(!isChatLocked);
                      setToastNotification(!isChatLocked ? 'تم قفل الدردشة بالروم بنجاح 🔒' : 'تم فتح الدردشة للجميع 🔓');
                      setTimeout(() => setToastNotification(null), 2500);
                    }}
                    className={`w-full p-3 border rounded-2xl flex items-center justify-between text-xs font-bold transition-all cursor-pointer shadow-sm ${
                      isChatLocked
                        ? 'bg-rose-950/60 border-rose-500/50 text-rose-200'
                        : 'bg-[#1A2234] border-slate-700 text-slate-100 hover:bg-slate-700/80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                        isChatLocked ? 'bg-rose-500/20 border border-rose-500/40 text-rose-400' : 'bg-amber-500/20 border border-amber-500/40 text-amber-400'
                      }`}>
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <span className="font-extrabold text-xs">حالة الدردشة العامة</span>
                    </div>
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black border ${
                      isChatLocked
                        ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                        : 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                    }`}>
                      {isChatLocked ? (
                        <>
                          <Lock className="w-3 h-3 stroke-[2.5]" />
                          <span>مقفلة (للمشرفين والمايكات)</span>
                        </>
                      ) : (
                        <span>مفتوحة للجميع 🔓</span>
                      )}
                    </div>
                  </button>
                )}

                <button className="w-full p-3 bg-[#1A2234] rounded-2xl flex items-center justify-between text-xs font-bold hover:bg-slate-700">
                  <span>جودة الصوت المباشر</span>
                  <span className="text-amber-300">HD فائقة النقاء</span>
                </button>
                <button
                  onClick={() => {
                    setShowSettingsDrawer(false);
                    setShowRoomExitModal(true);
                  }}
                  className="w-full p-3 bg-red-600/80 rounded-2xl text-center text-xs font-black text-white hover:bg-red-600 cursor-pointer"
                >
                  مغادرة وإغلاق الغرفة
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default RoomModalManager;
