import React, { lazy, Suspense } from 'react';

const TopOptionsMenuModal = lazy(() =>
  import('../TopOptionsMenuModal').then((m) => ({ default: m.TopOptionsMenuModal }))
);

export interface RoomTopOptionsControllerProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserRole: string;
  currentAppRole: string;
  isOwner: boolean;
  isVIP?: boolean;
  userVipLevel?: number;
  isRoomLocked: boolean;
  onToggleLockRoom: (passcode?: string) => void;
  onClearChat: () => void;
  isChatLocked: boolean;
  onToggleLockChat: () => void;
  onOpenWallpapers: () => void;
  isIncognito: boolean;
  onToggleIncognito: () => void;
  isCountersVisible: boolean;
  isCounterActive: boolean;
  onOpenLeaderboard: () => void;
  onOpenRoomMode: () => void;
  onOpenMusic: () => void;
  onOpenSoundEffects: () => void;
  onOpenMicMode: () => void;
  onStartTeamBattle: () => void;
  onStartRoomPK: () => void;
  onOpenModeratorStats: () => void;
  onTriggerToast: (msg: string) => void;
}

/**
 * وحدة التحكم المنفصلة بقائمة خيارات الروم العلوية (الثلاث نقاط)
 * تفصل كود نافذة الخيارات العلوية بالكامل عن شاشة الروم لتقليل حجم الكود وتخفيف الأداء
 */
export const RoomTopOptionsController: React.FC<RoomTopOptionsControllerProps> = ({
  isOpen,
  onClose,
  currentUserRole,
  currentAppRole,
  isOwner,
  isVIP = true,
  userVipLevel = 8,
  isRoomLocked,
  onToggleLockRoom,
  onClearChat,
  isChatLocked,
  onToggleLockChat,
  onOpenWallpapers,
  isIncognito,
  onToggleIncognito,
  isCountersVisible,
  isCounterActive,
  onOpenLeaderboard,
  onOpenRoomMode,
  onOpenMusic,
  onOpenSoundEffects,
  onOpenMicMode,
  onStartTeamBattle,
  onStartRoomPK,
  onOpenModeratorStats,
  onTriggerToast
}) => {
  if (!isOpen) return null;

  return (
    <Suspense fallback={null}>
      <TopOptionsMenuModal
        isOpen={isOpen}
        onClose={onClose}
        currentUserRole={currentUserRole as any}
        currentAppRole={currentAppRole}
        isOwner={isOwner}
        isVIP={isVIP}
        userVipLevel={userVipLevel}
        isRoomLocked={isRoomLocked}
        onToggleLockRoom={onToggleLockRoom}
        onClearChat={onClearChat}
        isChatLocked={isChatLocked}
        onToggleLockChat={onToggleLockChat}
        onOpenWallpapers={onOpenWallpapers}
        isIncognito={isIncognito}
        onToggleIncognito={onToggleIncognito}
        isCountersVisible={isCountersVisible}
        isCounterActive={isCounterActive}
        onOpenLeaderboard={onOpenLeaderboard}
        onOpenRoomMode={onOpenRoomMode}
        onOpenMusic={onOpenMusic}
        onOpenSoundEffects={onOpenSoundEffects}
        onOpenMicMode={onOpenMicMode}
        onStartTeamBattle={onStartTeamBattle}
        onStartRoomPK={onStartRoomPK}
        onOpenModeratorStats={onOpenModeratorStats}
        onTriggerToast={onTriggerToast}
      />
    </Suspense>
  );
};

export default RoomTopOptionsController;
