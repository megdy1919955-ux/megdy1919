import {
  Lock,
  Unlock,
  Eraser,
  MessageSquareLock,
  MessageSquare,
  Image as ImageIcon,
  EyeOff,
  Eye,
  BarChart3,
  Home,
  Headphones,
  SlidersHorizontal,
  Armchair,
  Swords,
  Zap,
  ShieldAlert,
  Trophy,
  Users,
  type LucideIcon
} from 'lucide-react';

export interface TopMenuItem {
  id: string;
  title: string;
  icon: LucideIcon;
  bgClass: string;
  action?: () => void;
  permissionRole: 'owner' | 'admin' | 'vip' | 'speaker' | 'all';
  deniedMessage: string;
  badge: boolean;
}

export interface BuildTopMenuItemsParams {
  isRoomLocked: boolean;
  onToggleLockRoom?: (passcode?: string) => void;
  onClearChat?: () => void;
  isChatLocked: boolean;
  onToggleLockChat?: () => void;
  onOpenWallpapers?: () => void;
  isIncognito: boolean;
  onToggleIncognito?: () => void;
  userVipLevel: number;
  isCountersVisible: boolean;
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
}

export function buildTopMenuItems(params: BuildTopMenuItemsParams): TopMenuItem[] {
  const {
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
  } = params;

  return [
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
      id: 'room_stats',
      title: 'إحصائيات الروم',
      icon: Trophy,
      bgClass: 'bg-gradient-to-tr from-amber-400 to-yellow-500 text-slate-950 shadow-amber-500/30',
      action: onOpenRoomStats,
      permissionRole: 'all' as const,
      deniedMessage: '',
      badge: false,
    },
    {
      id: 'room_info_profile',
      title: 'معلومات الروم',
      icon: Users,
      bgClass: 'bg-gradient-to-tr from-teal-500 to-emerald-600 text-white shadow-teal-500/30',
      action: onOpenRoomInfo,
      permissionRole: 'all' as const,
      deniedMessage: '',
      badge: false,
    },
  ];
}
