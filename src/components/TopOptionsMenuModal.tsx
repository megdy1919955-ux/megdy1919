import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Lock,
  Unlock,
  Eraser,
  MessageSquareLock,
  MessageSquare,
  Image as ImageIcon,
  Palette,
  EyeOff,
  Eye,
  BarChart3,
  Home,
  Headphones,
  SlidersHorizontal,
  Armchair,
  Swords,
  Zap,
  Sparkles,
  ShieldAlert,
  X,
  KeyRound,
  Check
} from 'lucide-react';

interface TopOptionsMenuModalProps {
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
  onOpenCustomTheme?: () => void;
  onOpenModeratorStats?: () => void;
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
  onOpenCustomTheme,
  onOpenModeratorStats,
  onTriggerToast,
}) => {
  const [showPasscodeDialog, setShowPasscodeDialog] = useState(false);
  const [passcode, setPasscode] = useState('');

  const isDev = currentAppRole === 'developer';
  const isRoomOwner = isDev || (currentAppRole !== 'guest' && currentAppRole !== 'moderator' && (isOwnerProp || currentAppRole === 'owner' || currentUserRole === 'owner'));
  const isModerator = !isDev && !isRoomOwner && (currentAppRole === 'moderator' || currentUserRole === 'moderator');
  const isRegularUser = !isDev && !isRoomOwner && !isModerator;

  // إخفاء القائمة كلياً للمستخدم العادي (تظهر فقط للمشرف وصاحب الروم والمبرمج)
  if (!isOpen || currentUserRole === 'host' || isRegularUser) return null;

  const handlePasscodeSubmit = () => {
    if (!passcode || passcode.length !== 6) {
      onTriggerToast?.('يرجى إدخال رمز قفل مكون من 6 أرقام بالضبط 🔢');
      return;
    }
    onToggleLockRoom?.(passcode);
    setShowPasscodeDialog(false);
    setPasscode('');
    onClose();
  };

  const handleItemClick = (item: {
    id: string;
    permissionRole: 'owner' | 'admin' | 'vip' | 'speaker' | 'all';
    action?: () => void;
    deniedMessage: string;
  }) => {
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
      // الشرط الأول: هل الغرفة مغلقة؟
      if (!isRoomLocked) {
        onTriggerToast?.('يجب إغلاق الغرفة أولاً لاستخدام ميزة الإخفاء');
        return;
      }

      // الشرط الثاني: هل المضيف يمتلك VIP 6 فما فوق؟
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

  const menuItems = [
    // Row 1
    {
      id: 'lock_room',
      title: isRoomLocked ? 'فتح الغرفة' : 'قفل',
      icon: isRoomLocked ? Unlock : Lock,
      bgClass: isRoomLocked ? 'bg-emerald-500 text-white shadow-emerald-500/30' : 'bg-rose-500 text-white shadow-rose-500/30',
      action: onToggleLockRoom,
      permissionRole: 'owner' as const,
      deniedMessage: 'خاصية قفل الغرفة متاحة للوكيل (صاحب الغرفة) فقط 🔒',
      badge: false,
    },
    {
      id: 'clear_chat',
      title: 'مسح الدردشة',
      icon: Eraser,
      bgClass: 'bg-rose-500 text-white shadow-rose-500/30',
      action: onClearChat,
      permissionRole: 'admin' as const,
      deniedMessage: 'مسح الدردشة متاح لمالك الغرفة والمشرفين فقط 🧹',
      badge: false,
    },
    {
      id: 'lock_chat',
      title: isChatLocked ? 'فتح الدردشة' : 'قفل الدردشة',
      icon: isChatLocked ? MessageSquare : MessageSquareLock,
      bgClass: isChatLocked ? 'bg-emerald-500 text-white shadow-emerald-500/30' : 'bg-sky-400 text-white shadow-sky-400/30',
      action: onToggleLockChat,
      permissionRole: 'admin' as const,
      deniedMessage: 'قفل الدردشة متاح لمالك الغرفة والمشرفين فقط 🚫',
      badge: false,
    },
    {
      id: 'wallpapers',
      title: 'خلفيات الروم',
      icon: ImageIcon,
      bgClass: 'bg-gradient-to-tr from-purple-600 to-indigo-500 text-white shadow-purple-500/30',
      action: onOpenWallpapers,
      permissionRole: 'owner' as const,
      deniedMessage: 'تغيير الخلفيات متاح للوكيل (صاحب الغرفة) فقط 🖼️',
      badge: false,
    },

    // Row 2
    {
      id: 'incognito',
      title: 'مخفي',
      icon: isIncognito ? Eye : EyeOff,
      bgClass: isIncognito
        ? 'bg-emerald-500 text-white shadow-emerald-500/30 ring-2 ring-emerald-300'
        : (!isRoomLocked || userVipLevel < 6)
        ? 'bg-slate-300 text-slate-500'
        : 'bg-pink-500 text-white shadow-pink-500/30',
      action: onToggleIncognito,
      permissionRole: 'all' as const,
      deniedMessage: 'تفعيل وضع التخفي متاح لمستخدمي VIP 6 وما فوق 💎',
      badge: isIncognito,
    },
    {
      id: 'leaderboard',
      title: isCountersVisible ? 'إخفاء العدادات' : 'لوحة النتيجة',
      icon: BarChart3,
      bgClass: isCountersVisible ? 'bg-emerald-500 text-white shadow-emerald-500/30' : 'bg-amber-500 text-white shadow-amber-500/30',
      action: onOpenLeaderboard,
      permissionRole: 'owner' as const,
      deniedMessage: 'إظهار وإخفاء العدادات من لوحة النتيجة متاح للوكيل (صاحب الغرفة) فقط 🔒',
      badge: isCountersVisible,
    },
    {
      id: 'room_mode',
      title: 'وضع الغرفة',
      icon: Home,
      bgClass: 'bg-indigo-500 text-white shadow-indigo-500/30',
      action: onOpenRoomMode,
      permissionRole: 'admin' as const,
      deniedMessage: 'إعدادات وضع الغرفة متاحة للمشرفين والمالك فقط 🏠',
      badge: false,
    },
    {
      id: 'music',
      title: 'موسيقى',
      icon: Headphones,
      bgClass: 'bg-indigo-600 text-white shadow-indigo-600/30',
      action: onOpenMusic,
      permissionRole: 'admin' as const,
      deniedMessage: 'تشغيل الموسيقى متاح للمشرفين والمالك وذوي الصلاحية فقط 🎵',
      badge: false,
    },

    // Row 3
    {
      id: 'sound_effects',
      title: 'تأثير الصوت',
      icon: SlidersHorizontal,
      bgClass: 'bg-blue-500 text-white shadow-blue-500/30',
      action: onOpenSoundEffects,
      permissionRole: 'speaker' as const,
      deniedMessage: 'التأثيرات الصوتية وتوازن الصوت متاحة للمضيفين والمتحدثين 🎙️',
      badge: false,
    },
    {
      id: 'mic_mode',
      title: 'وضع الميكروفون',
      icon: Armchair,
      bgClass: 'bg-cyan-500 text-white shadow-cyan-500/30',
      action: onOpenMicMode,
      permissionRole: 'owner' as const,
      deniedMessage: 'تغيير وضع المايك متاح لمالك الغرفة فقط 🎙️',
      badge: false,
    },
    {
      id: 'team_battle',
      title: 'معركة الفريق',
      icon: Swords,
      bgClass: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-purple-600/30',
      action: onStartTeamBattle,
      permissionRole: 'owner' as const,
      deniedMessage: 'بدء معركة الفريق متاح لمالك الغرفة فقط ⚔️👑',
      badge: false,
    },
    {
      id: 'room_pk',
      title: 'الغرَف PK',
      icon: Zap,
      bgClass: 'bg-gradient-to-tr from-pink-500 to-indigo-500 text-white shadow-pink-500/30',
      action: onStartRoomPK,
      permissionRole: 'admin' as const,
      deniedMessage: 'تحدي الغرف PK متاح للإدارة والمشرفين 🥊',
      badge: false,
    },

    // Row 4
    {
      id: 'moderator_stats',
      title: 'إحصائيات المشرفين',
      icon: ShieldAlert,
      bgClass: 'bg-gradient-to-tr from-amber-500 via-yellow-500 to-rose-500 text-slate-950 shadow-amber-500/30',
      action: onOpenModeratorStats,
      permissionRole: 'admin' as const,
      deniedMessage: 'إحصائيات وسجلات المشرفين متاحة لمالك الغرفة والمشرفين فقط 🛡️',
      badge: false,
    },
    {
      id: 'custom_theme',
      title: 'ثيم خاص',
      icon: Sparkles,
      bgClass: 'bg-orange-500 text-white shadow-orange-500/30',
      action: onOpenCustomTheme,
      permissionRole: 'owner' as const,
      deniedMessage: 'تطبيق الثيمات الخاصة متاح للوكيل (صاحب الغرفة) فقط 🔮',
      badge: true,
    },
  ];

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

          {/* PASSCODE MODAL INPUT FOR ROOM LOCK */}
          {showPasscodeDialog ? (
            <div className="py-2 space-y-4 mt-8">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 text-slate-900">
                <KeyRound className="w-6 h-6 text-amber-500 shrink-0" />
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">تثبيت رمز قفل الغرفة (Passcode)</h3>
                  <p className="text-[11px] text-slate-500">أدخل رمزاً سرياً لمنع الدخول بدون إذن المتطابق</p>
                </div>
              </div>

              <div className="space-y-2">
                <input
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  placeholder="رمز القفل المكون من 6 أرقام..."
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-center text-lg font-mono font-bold tracking-widest text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:bg-white"
                  autoFocus
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={handlePasscodeSubmit}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                >
                  <Check className="w-4 h-4" />
                  <span>تأكيد القفل 🔒</span>
                </button>
                <button
                  onClick={() => setShowPasscodeDialog(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-xl cursor-pointer transition-colors border border-slate-200"
                >
                  إلغاء
                </button>
              </div>
            </div>
          ) : (
            /* 4-Column Options Grid */
            <div className="grid grid-cols-4 gap-y-5 gap-x-2 pt-9 pb-1">
              {menuItems
                .filter((item) => {
                  // المبرمج لا توجد أمامه أي حواجز
                  if (isDev) return true;

                  // المشرف تظهر له فقط: مسح الدردشة، قفل الدردشة، الموسيقى، التأثيرات الصوتية
                  if (isModerator) {
                    return ['clear_chat', 'lock_chat', 'music', 'sound_effects'].includes(item.id);
                  }

                  // شرط إظهار أيقونة الخلفيات، الثيم الخاص، إخفاء العدادات، ووضع المايكات لصاحب الروم حصرياً
                  if (item.id === 'wallpapers' || item.id === 'custom_theme' || item.id === 'mic_mode' || item.id === 'leaderboard') {
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


