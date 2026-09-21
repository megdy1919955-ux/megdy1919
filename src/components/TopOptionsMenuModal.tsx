import React, { useState, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { buildTopMenuItems, TopMenuItem } from './room/topOptions/topOptionsMenuTypes';

const RoomPasscodeDialog = lazy(() =>
  import('./room/topOptions/RoomPasscodeDialog').then((m) => ({ default: m.RoomPasscodeDialog }))
);

export interface TopOptionsMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserRole?: 'owner' | 'host' | 'moderator' | 'guest';
  currentAppRole?: string;
  isOwner?: boolean;
  isVIP?: boolean;
  userVipLevel?: number;
  isRoomLocked?: boolean;
  onToggleLockRoom?: (passcode?: string) => void;
  onClearChat?: () => void;
  isChatLocked?: boolean;
  onToggleLockChat?: () => void;
  onOpenWallpapers?: () => void;
  isIncognito?: boolean;
  onToggleIncognito?: () => void;
  isCountersVisible?: boolean;
  isCounterActive?: boolean;
  onOpenLeaderboard?: () => void;
  onOpenRoomMode?: () => void;
  onOpenMusic?: () => void;
  onOpenSoundEffects?: () => void;
  onOpenMicMode?: () => void;
  onStartTeamBattle?: () => void;
  onStartRoomPK?: () => void;
  onOpenModeratorStats?: () => void;
  onOpenRoomStats?: () => void;
  onOpenRoomInfo?: () => void;
  onTriggerToast?: (msg: string) => void;
}

export const TopOptionsMenuModal: React.FC<TopOptionsMenuModalProps> = ({
  isOpen,
  onClose,
  currentUserRole = 'owner',
  currentAppRole,
  isOwner: isOwnerProp = false,
  isVIP = true,
  userVipLevel = 8,
  isRoomLocked = false,
  onToggleLockRoom,
  onClearChat,
  isChatLocked = false,
  onToggleLockChat,
  onOpenWallpapers,
  isIncognito = false,
  onToggleIncognito,
  isCountersVisible = true,
  isCounterActive = false,
  onOpenLeaderboard,
  onOpenRoomMode,
  onOpenMusic,
  onOpenSoundEffects,
  onOpenMicMode,
  onStartTeamBattle,
  onStartRoomPK,
  onOpenModeratorStats,
  onOpenRoomStats,
  onOpenRoomInfo,
  onTriggerToast,
}) => {
  const [showPasscodeDialog, setShowPasscodeDialog] = useState(false);

  const isDev = currentAppRole === 'developer';
  const isRoomOwner = isDev || (currentAppRole !== 'guest' && currentAppRole !== 'moderator' && (isOwnerProp || currentAppRole === 'owner' || currentUserRole === 'owner'));
  const isModerator = !isDev && !isRoomOwner && (currentAppRole === 'moderator' || currentUserRole === 'moderator');
  const isRegularUser = !isDev && !isRoomOwner && !isModerator;

  // التحقق من فتح النافذة
  if (!isOpen) return null;

  const handlePasscodeSubmit = (code: string) => {
    if (!code || code.length !== 6) {
      onTriggerToast?.('يرجى إدخال رمز قفل مكون من 6 أرقام بالضبط 🔢');
      return;
    }
    onToggleLockRoom?.(code);
    setShowPasscodeDialog(false);
    onClose();
  };

  const handleItemClick = (item: TopMenuItem) => {
    let hasAccess = false;
    if (isDev) {
      hasAccess = true;
    } else {
      switch (item.permissionRole) {
        case 'owner':
          hasAccess = isRoomOwner;
          break;
        case 'admin':
          hasAccess = isRoomOwner || isModerator;
          break;
        case 'vip':
          hasAccess = isVIP || isRoomOwner;
          break;
        case 'speaker':
          hasAccess = !isRegularUser;
          break;
        case 'all':
        default:
          hasAccess = true;
          break;
      }
    }

    if (!hasAccess) {
      onTriggerToast?.(item.deniedMessage);
      return;
    }

    if (item.id === 'lock_room') {
      if (!isRoomLocked) {
        setShowPasscodeDialog(true);
        return;
      } else {
        onToggleLockRoom?.();
        onClose();
        return;
      }
    }

    if (item.id === 'mic_mode' && isCounterActive) {
      onTriggerToast?.('يجب إيقاف العداد أولاً لتعديل وضع المايكات 🛑');
      return;
    }

    if (item.id === 'incognito') {
      if (!isRoomLocked) {
        onTriggerToast?.('يجب إغلاق الغرفة أولاً لاستخدام ميزة الإخفاء');
        return;
      }
      if (userVipLevel < 6) {
        onTriggerToast?.('هذه الميزة لا تعمل إلا لمن يمتلك VIP 6 فما فوق');
        return;
      }
      if (item.action) {
        item.action();
      }
      onClose();
      return;
    }

    if (item.action) {
      item.action();
    }
    onClose();
  };

  const menuItems = buildTopMenuItems({
    isRoomLocked,
    onToggleLockRoom,
    onClearChat,
    isChatLocked,
    onToggleLockChat,
    onOpenWallpapers,
    isIncognito,
    onToggleIncognito,
    userVipLevel,
    isCountersVisible,
    onOpenLeaderboard,
    onOpenRoomMode,
    onOpenMusic,
    onOpenSoundEffects,
    onOpenMicMode,
    onStartTeamBattle,
    onStartRoomPK,
    onOpenModeratorStats,
    onOpenRoomStats,
    onOpenRoomInfo
  });

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 bg-transparent flex items-center justify-center p-4 pointer-events-auto cursor-default select-none"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: -10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: -10 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-sm rounded-3xl p-5 bg-white text-slate-900 shadow-[0_15px_50px_rgba(0,0,0,0.18)] relative overflow-hidden dir-rtl border border-slate-200/90 transition-all"
          dir="rtl"
        >
          {/* Top Header Actions */}
          <div className="flex items-center justify-between absolute top-3.5 inset-x-3.5 z-10">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                خيارات الغرفة
              </span>
            </div>

            {/* Top Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* PASSCODE MODAL INPUT FOR ROOM LOCK (محمل عند الطلب) */}
          {showPasscodeDialog ? (
            <Suspense fallback={<div className="py-8 text-center text-xs text-slate-400">جاري التحميل...</div>}>
              <RoomPasscodeDialog
                isOpen={showPasscodeDialog}
                onClose={() => setShowPasscodeDialog(false)}
                onSubmit={handlePasscodeSubmit}
              />
            </Suspense>
          ) : (
            /* 4-Column Options Grid */
            <div className="grid grid-cols-4 gap-y-5 gap-x-2 pt-9 pb-1">
              {menuItems
                .filter((item) => {
                  if (isDev) return true;
                  if (isModerator) {
                    return ['clear_chat', 'lock_chat', 'music', 'sound_effects'].includes(item.id);
                  }
                  if (item.id === 'wallpapers' || item.id === 'mic_mode' || item.id === 'leaderboard') {
                    return isRoomOwner;
                  }
                  return true;
                })
                .map((item) => {
                  const IconComponent = item.icon;
                  const isMicDisabled = item.id === 'mic_mode' && isCounterActive;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick(item)}
                      className={`flex flex-col items-center gap-1.5 group cursor-pointer transition-transform active:scale-95 ${
                        isMicDisabled ? 'opacity-50 grayscale cursor-not-allowed' : ''
                      }`}
                      title={isMicDisabled ? 'يجب إيقاف العداد أولاً لتعديل وضع المايكات' : item.title}
                    >
                      {/* Icon Container with rounded-2xl */}
                      <div className="relative">
                        <div
                          className={`w-13 h-13 flex items-center justify-center shadow-md rounded-2xl transition-all group-hover:scale-105 ${item.bgClass}`}
                        >
                          <IconComponent className="w-6 h-6 stroke-[2.2]" />
                        </div>

                        {/* Red Notification Badge Dot or Lock Icon */}
                        {isMicDisabled ? (
                          <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 font-black text-[9px] px-1 rounded-full border border-amber-300 shadow-xs z-10">
                            🔒
                          </span>
                        ) : item.badge ? (
                          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-rose-500 ring-2 ring-white animate-pulse z-10" />
                        ) : null}
                      </div>

                      {/* Label Text */}
                      <span className="text-[11px] font-bold leading-tight text-center tracking-tight text-slate-700 group-hover:text-slate-900 transition-colors">
                        {item.title}
                      </span>
                    </button>
                  );
                })}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TopOptionsMenuModal;
