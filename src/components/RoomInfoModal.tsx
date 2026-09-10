import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Crown,
  ShieldCheck,
  UserCheck,
  Mic,
  MicOff,
  Music,
  Settings,
  Radio,
  Users,
  Info,
  Edit3,
  Check,
  Megaphone,
  Sliders,
  Eye,
  Lock,
  Sparkles,
  Camera,
  Image as ImageIcon,
  Upload,
  RefreshCw,
  Ban,
  Clock,
  Unlock,
  UserX,
  HelpCircle
} from 'lucide-react';
import { getSecretWindowTheme, getComputedModalStyle } from '../lib/secretCustomizerService';
import { WindowThemeConfig } from '../types/secretCustomizer';
import {
  RoomBannedUser,
  getRoomBannedUsers,
  removeRoomBannedUser,
  formatRemainingBanTime,
  getModeratorKickPermission,
  setModeratorKickPermission
} from '../lib/roomKickService';

export interface AdminUser {
  id: string;
  name: string;
  avatar: string;
  role: 'owner' | 'host' | 'moderator';
  roleTitle: string;
  level: string;
  vip: string;
  nLevel: string;
  isOnline: boolean;
  permissions: {
    micsControl: boolean;
    musicControl: boolean;
    attendanceControl: boolean;
    seatPriority: boolean;
    kickControl?: boolean;
  };
}

interface RoomInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomTitle?: string;
  roomId?: string;
  hostAvatar?: string;
  hostName?: string;
  userRole?: 'owner' | 'host' | 'moderator' | 'guest';
  currentAppRole?: string;
  isRoomOwner?: boolean;
  agencyName?: string;
  agencyOwnerName?: string;
  agencyGid?: string;
  onRoleChange?: (role: 'owner' | 'host' | 'moderator' | 'guest') => void;
  onOpenSettings?: () => void;
  onUpdateRoomTitle?: (newTitle: string) => void;
  onUpdateRoomAvatar?: (newAvatarUrl: string) => void;
}

export const RoomInfoModal: React.FC<RoomInfoModalProps> = ({
  isOpen,
  onClose,
  roomTitle = 'غرفة الأساطير الذهبية 👑',
  roomId = '997812',
  hostAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  hostName = 'الأمير أسامة',
  userRole = 'owner',
  currentAppRole = 'developer',
  isRoomOwner,
  agencyName = 'وكالة أبو أمجد لتسجيل المضيفين',
  agencyOwnerName = 'أبو أمجد 👑',
  agencyGid = '88902',
  onRoleChange,
  onOpenSettings,
  onUpdateRoomTitle,
  onUpdateRoomAvatar
}) => {
  // Current active role
  const [currentRole, setCurrentRole] = useState<'owner' | 'host' | 'moderator' | 'guest'>(userRole);
  const [activeTab, setActiveTab] = useState<'admins' | 'banned'>('admins');
  const [showPermissionsHelp, setShowPermissionsHelp] = useState(false);
  const [theme, setTheme] = useState<WindowThemeConfig>(() => getSecretWindowTheme('room_info'));

  // 24-Hour Banned Users List State
  const [bannedUsers, setBannedUsers] = useState<RoomBannedUser[]>(() => getRoomBannedUsers(roomId));

  useEffect(() => {
    const handleBannedUpdated = (e: Event) => {
      const custom = e as CustomEvent;
      if (custom.detail?.roomId === roomId || !custom.detail?.roomId) {
        setBannedUsers(getRoomBannedUsers(roomId));
      }
    };
    window.addEventListener('room_banned_list_updated', handleBannedUpdated);
    return () => {
      window.removeEventListener('room_banned_list_updated', handleBannedUpdated);
    };
  }, [roomId]);

  const handleUnbanUser = (targetUserId: string, targetName: string) => {
    if (!isOwner) {
      showToast('🔒 إلغاء الطرد متاح حصرياً لصاحب الروم (المالك) فقط');
      return;
    }
    removeRoomBannedUser(targetUserId, roomId);
    setBannedUsers(getRoomBannedUsers(roomId));
    showToast(`✓ تم إلغاء طرد ${targetName} من قبل المالك، ويحق له الآن العودة إلى الروم! 🎉`);
  };

  // Room Title & Avatar Editing States
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitleText, setTempTitleText] = useState(roomTitle);
  const [showAvatarPickerModal, setShowAvatarPickerModal] = useState(false);
  const [customAvatarUrlInput, setCustomAvatarUrlInput] = useState('');

  // Preset Luxury Avatars for Quick Pick
  const PRESET_ROOM_AVATARS = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=400',
  ];

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('⚠️ حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 5 ميغابايت');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          onUpdateRoomAvatar?.(result);
          setShowAvatarPickerModal(false);
          showToast('✓ تم تغيير صورة الغرفة بنجاح من جهازك! 📸👑');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    setTempTitleText(roomTitle);
  }, [roomTitle]);

  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ windowId: string; theme: WindowThemeConfig }>;
      if (customEvent.detail?.windowId === 'room_info') {
        setTheme(customEvent.detail.theme);
      }
    };
    window.addEventListener('window_customizer_updated', handleUpdate);
    return () => window.removeEventListener('window_customizer_updated', handleUpdate);
  }, []);

  React.useEffect(() => {
    setCurrentRole(userRole);
  }, [userRole]);

  const handleSelectRole = (role: 'owner' | 'host' | 'moderator' | 'guest') => {
    setCurrentRole(role);
    onRoleChange?.(role);
  };

  // Announcement State
  const [announcement, setAnnouncement] = useState<string>(
    'أهلاً وسهلاً بكم في غرفة الأساطير الذهبية! يرجى الالتزام بالقوانين وعدم الإساءة والترحيب بالجميع 🌸👑'
  );
  const [isEditingAnnouncement, setIsEditingAnnouncement] = useState(false);
  const [tempAnnouncementText, setTempAnnouncementText] = useState(announcement);

  // Strict Room Owner calculation: only true if user is owner role AND isRoomOwner
  const isOwner = Boolean((isRoomOwner !== undefined ? isRoomOwner : currentRole === 'owner') && currentRole === 'owner');

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveTitle = () => {
    if (!isOwner) {
      showToast('🔒 عذراً: تعديل اسم الغرفة متاح فقط لصاحب الروم (المالك)، ولا يحق للمشرف أو المضيف تعديل اسم الروم.');
      setIsEditingTitle(false);
      return;
    }
    if (!tempTitleText.trim()) {
      showToast('⚠️ يرجى إدخال اسم صحيح للغرفة');
      return;
    }
    onUpdateRoomTitle?.(tempTitleText.trim());
    setIsEditingTitle(false);
    showToast('✓ تم حفظ وتحديث اسم الغرفة بنجاح!');
  };

  // Room Admins & Hosts Mock Data
  const [adminsList, setAdminsList] = useState<AdminUser[]>([
    {
      id: '1',
      name: hostName,
      avatar: hostAvatar,
      role: 'owner',
      roleTitle: '👑 مالك الغرفة الرسمي',
      level: 'Lv.88',
      vip: 'VIP8',
      nLevel: 'N.15',
      isOnline: true,
      permissions: {
        micsControl: true,
        musicControl: true,
        attendanceControl: true,
        seatPriority: true
      }
    },
    {
      id: '2',
      name: 'أميرة الشرق 👑',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      role: 'host',
      roleTitle: '🎙️ مضيف رئيسي - استيج البث',
      level: 'Lv.80',
      vip: 'VIP7',
      nLevel: 'N.14',
      isOnline: true,
      permissions: {
        micsControl: true,
        musicControl: true,
        attendanceControl: true,
        seatPriority: true
      }
    },
    {
      id: '3',
      name: 'سارة الكابيتانو',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
      role: 'moderator',
      roleTitle: '🛡️ مشرف أول - إدارة الروم والحظر',
      level: 'Lv.75',
      vip: 'VIP6',
      nLevel: 'N.12',
      isOnline: true,
      permissions: {
        micsControl: true,
        musicControl: true,
        attendanceControl: true,
        seatPriority: true,
        kickControl: getModeratorKickPermission(roomId)
      }
    },
    {
      id: '4',
      name: 'صقر الشام',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      role: 'moderator',
      roleTitle: '🛡️ مشرف المايكات والحضور',
      level: 'Lv.64',
      vip: 'VIP5',
      nLevel: 'N.10',
      isOnline: true,
      permissions: {
        micsControl: true,
        musicControl: false,
        attendanceControl: true,
        seatPriority: true,
        kickControl: getModeratorKickPermission(roomId)
      }
    },
    {
      id: '5',
      name: 'الملك الكويتي',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
      role: 'host',
      roleTitle: '🎙️ مضيف الموسيقى والدي جي',
      level: 'Lv.52',
      vip: 'VIP4',
      nLevel: 'N.8',
      isOnline: false,
      permissions: {
        micsControl: false,
        musicControl: true,
        attendanceControl: false,
        seatPriority: true,
        kickControl: false
      }
    },
    {
      id: '6',
      name: 'فارس نجد 🇸🇦',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=200',
      role: 'moderator',
      roleTitle: '🛡️ مراقب عام وتنظيم الاستيج',
      level: 'Lv.70',
      vip: 'VIP6',
      nLevel: 'N.11',
      isOnline: true,
      permissions: {
        micsControl: true,
        musicControl: false,
        attendanceControl: true,
        seatPriority: true,
        kickControl: getModeratorKickPermission(roomId)
      }
    },
    {
      id: '7',
      name: 'ريم البوادي 🌸',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
      role: 'host',
      roleTitle: '🎙️ مذيعة الفعاليات والمسابقات',
      level: 'Lv.61',
      vip: 'VIP5',
      nLevel: 'N.9',
      isOnline: true,
      permissions: {
        micsControl: true,
        musicControl: true,
        attendanceControl: true,
        seatPriority: false,
        kickControl: false
      }
    },
    {
      id: '8',
      name: 'سلطان القلوب 💎',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200',
      role: 'moderator',
      roleTitle: '🛡️ مشرف الاستقبال والترحيب',
      level: 'Lv.58',
      vip: 'VIP4',
      nLevel: 'N.7',
      isOnline: false,
      permissions: {
        micsControl: false,
        musicControl: false,
        attendanceControl: true,
        seatPriority: true,
        kickControl: false
      }
    }
  ]);

  // Toggle permission for a specific moderator (Owner Only)
  const toggleModeratorPermission = (adminId: string, permKey: keyof AdminUser['permissions']) => {
    if (currentRole !== 'owner') return;

    setAdminsList(prev =>
      prev.map(admin => {
        if (admin.id === adminId) {
          const updatedValue = !admin.permissions[permKey];
          const permNames: Record<string, string> = {
            micsControl: 'التحكم بالمايكات',
            musicControl: 'التحكم بالموسيقى',
            attendanceControl: 'إدارة الحضور',
            seatPriority: 'أولوية المقاعد',
            kickControl: 'طرد وحظر الأعضاء (24 ساعة)'
          };
          if (permKey === 'kickControl') {
            setModeratorKickPermission(updatedValue, roomId);
          }
          showToast(
            `تم ${updatedValue ? 'تفعيل' : 'إلغاء'} صلاحية (${permNames[permKey]}) لـ ${admin.name}`
          );
          return {
            ...admin,
            permissions: {
              ...admin.permissions,
              [permKey]: updatedValue
            }
          };
        }
        return admin;
      })
    );
  };

  const handleSaveAnnouncement = () => {
    if (currentRole !== 'owner') return;
    setAnnouncement(tempAnnouncementText);
    setIsEditingAnnouncement(false);
    showToast('✓ تم تحديث إعلان الغرفة بنجاح!');
  };

  if (!isOpen) return null;

  return (
    <>
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-transparent flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-auto cursor-default select-none" onClick={onClose}>
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          style={getComputedModalStyle(theme)}
          className="w-full max-w-md rounded-t-3xl sm:rounded-3xl p-4 text-white shadow-2xl h-[88vh] sm:h-[85vh] max-h-[92vh] flex flex-col justify-between overflow-hidden dir-rtl pointer-events-auto transition-all border"
        >
          {/* Top Header Card */}
          <div className="space-y-3 shrink-0">
            {/* Room Info Main Card */}
            <div className="flex items-start justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-3">
                {/* Room Avatar with Owner-only Edit Trigger */}
                <div 
                  className={`relative group ${isOwner ? 'cursor-pointer' : ''}`}
                  onClick={() => {
                    if (isOwner) {
                      setShowAvatarPickerModal(true);
                    } else {
                      showToast('🔒 صورة الغرفة مخصصة ويمكن تغييرها من قبل صاحب الغرفة (المالك) فقط، ولا يحق للمضيف أو المشرف تعديلها');
                    }
                  }}
                  title={isOwner ? 'تغيير صورة الغرفة (خاص بصاحب الغرفة 👑)' : 'صورة الغرفة (تعديلها لصاحب الروم فقط 🔒)'}
                >
                  <img
                    src={hostAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'}
                    alt={roomTitle}
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-amber-400 shadow-md group-hover:scale-105 transition-transform"
                  />
                  {isOwner ? (
                    <div className="absolute -bottom-1 -left-1 bg-amber-500 text-slate-950 w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-900 shadow-md group-hover:scale-110 transition-transform">
                      <Camera className="w-2.5 h-2.5 stroke-[2.5]" />
                    </div>
                  ) : (
                    <span className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 text-[9px] font-black px-1 rounded-md shadow-xs">
                      VIP
                    </span>
                  )}
                </div>

                <div className="space-y-1 min-w-0 flex-1">
                  {!isEditingTitle ? (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h2 className="text-base font-black truncate max-w-[200px]" style={{ color: theme.titleColor }}>{roomTitle}</h2>
                      {isOwner ? (
                        <button
                          type="button"
                          onClick={() => {
                            setTempTitleText(roomTitle);
                            setIsEditingTitle(true);
                          }}
                          className="p-1 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/40 border border-amber-400/40 transition-colors cursor-pointer active:scale-95"
                          title="تعديل وتغيير اسم الغرفة (خاص بالمالك 👑)"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => showToast('🔒 عذراً: تعديل اسم الغرفة متاح لصاحب الروم فقط، ولا يحق للمشرف أو المضيف تعديل اسم الروم.')}
                          className="p-1 rounded-lg bg-amber-500/10 text-amber-400/90 hover:bg-amber-500/20 border border-amber-400/20 transition-colors cursor-pointer flex items-center gap-1 text-[10px]"
                          title="🔒 تعديل اسم الروم مخصص لمالك الغرفة فقط"
                        >
                          <Lock className="w-3 h-3 text-amber-400" />
                          <span className="text-[9px] text-amber-300/80 font-normal">اسم محمي</span>
                        </button>
                      )}
                      <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded-full">
                        مستوى 12
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 w-full my-0.5">
                      <input
                        type="text"
                        value={tempTitleText}
                        onChange={(e) => setTempTitleText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveTitle();
                          if (e.key === 'Escape') setIsEditingTitle(false);
                        }}
                        placeholder="اسم الغرفة الجديد..."
                        autoFocus
                        className="flex-1 min-w-0 bg-slate-900/90 border border-amber-400/70 rounded-xl px-2.5 py-1 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                      />
                      <button
                        type="button"
                        onClick={handleSaveTitle}
                        className="p-1.5 bg-emerald-500 text-slate-950 rounded-xl hover:bg-emerald-400 font-bold transition-all cursor-pointer shadow-xs active:scale-95 shrink-0"
                        title="حفظ الاسم الجديد"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingTitle(false)}
                        className="p-1.5 bg-white/10 text-slate-300 rounded-xl hover:bg-white/20 transition-all cursor-pointer active:scale-95 shrink-0"
                        title="إلغاء التعديل"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-[11px] text-slate-300 font-mono">
                    <span>معرف الغرفة: <strong className="text-cyan-300">{roomId}</strong></span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-emerald-400 font-bold">
                      <Radio className="w-3 h-3 animate-pulse" /> مباشر
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-full bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Segmented Navigation Tabs (Only visible to Room Owner) */}
            {isOwner && (
              <div className="flex items-center gap-1 bg-[#1A2234] p-1 rounded-2xl border border-white/10 text-xs font-black">
                <button
                  type="button"
                  onClick={() => setActiveTab('admins')}
                  className={`flex-1 py-1.5 px-2 rounded-xl text-center transition-all cursor-pointer flex items-center justify-center gap-1 text-[11px] font-bold ${
                    activeTab === 'admins'
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>طاقم المشرفين</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('banned')}
                  className={`flex-1 py-1.5 px-2 rounded-xl text-center transition-all cursor-pointer flex items-center justify-center gap-1 text-[11px] font-bold ${
                    activeTab === 'banned'
                      ? 'bg-gradient-to-r from-rose-600 to-red-700 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Ban className="w-3.5 h-3.5 text-rose-300" />
                  <span>المطرودين خلال 24 ساعة</span>
                  {bannedUsers.length > 0 && (
                    <span className="bg-rose-500 text-white text-[9px] font-mono px-1.5 py-0.2 rounded-full font-black">
                      {bannedUsers.length}
                    </span>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Toast Notification */}
          <AnimatePresence>
            {toastMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-emerald-500 text-slate-950 text-xs font-black p-2 rounded-xl text-center my-1.5 shadow-md"
              >
                {toastMessage}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Scrollable Content Area */}
          <div className="overflow-y-auto overscroll-contain my-3 space-y-3 flex-1 min-h-[320px] pr-0.5 scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {/* TAB 1: ADMINS & ANNOUNCEMENT */}
            {activeTab === 'admins' && (
              <div className="space-y-3">
                {/* 1. ROOM ANNOUNCEMENT BOX - مربع كبير ظاهر بالكامل فوق طاقم المشرفين */}
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-3.5 space-y-2.5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                        <Megaphone className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-black text-amber-300">إعلان وتنبيـه الغرفة</span>
                    </div>

                    {isOwner && !isEditingAnnouncement && (
                      <button
                        type="button"
                        onClick={() => {
                          setTempAnnouncementText(announcement);
                          setIsEditingAnnouncement(true);
                        }}
                        className="bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 px-2.5 py-1 rounded-xl text-[10px] font-black flex items-center gap-1 transition-all cursor-pointer active:scale-95"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>تعديل الإعلان</span>
                      </button>
                    )}
                  </div>

                  {/* Spacious Announcement Canvas */}
                  {isOwner && isEditingAnnouncement ? (
                    <div className="space-y-2">
                      <textarea
                        value={tempAnnouncementText}
                        onChange={(e) => setTempAnnouncementText(e.target.value)}
                        rows={4}
                        className="w-full bg-slate-950/80 border border-amber-500/50 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-1 focus:ring-amber-400 resize-none dir-rtl leading-relaxed"
                        placeholder="أدخل نص إعلان أو تنبيـه الغرفة هنا..."
                      />
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setIsEditingAnnouncement(false)}
                          className="px-3 py-1.5 bg-white/10 text-slate-300 text-[11px] font-bold rounded-xl hover:bg-white/20 transition-colors cursor-pointer"
                        >
                          إلغاء
                        </button>
                        <button
                          type="button"
                          onClick={handleSaveAnnouncement}
                          className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 text-[11px] font-black rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>حفظ الإعلان</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => {
                        if (isOwner) {
                          setTempAnnouncementText(announcement);
                          setIsEditingAnnouncement(true);
                        }
                      }}
                      className={`min-h-[70px] bg-slate-950/40 border border-white/5 rounded-xl p-3 flex items-start text-xs leading-relaxed dir-rtl ${
                        isOwner ? 'cursor-pointer hover:border-amber-500/30 transition-colors' : ''
                      }`}
                    >
                      {announcement.trim() ? (
                        <p className="text-slate-200 font-medium whitespace-pre-wrap">{announcement}</p>
                      ) : (
                        <p className="text-slate-500 italic text-[11px] m-auto text-center">
                          {isOwner ? 'مربع الإعلان خالي... انقر هنا لكتابة إعلان وتنبيـه للغرفة ✍️' : 'لا يوجد إعلان معلن في الغرفة حالياً'}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* 2. ADMINS & MODERATORS LIST */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-purple-400" />
                      <span className="text-xs font-black text-amber-300">
                        {isOwner ? 'إدارة طاقم المشرفين والمضيفين' : 'طاقم مشرفي ومضييفي الغرفة'}
                      </span>

                      {/* Question Mark Button (نظام صلاحية المشرفين) */}
                      <button
                        type="button"
                        onClick={() => setShowPermissionsHelp((prev) => !prev)}
                        className="w-5 h-5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 flex items-center justify-center transition-all cursor-pointer active:scale-95 ml-1"
                        title="نظام صلاحية المشرفين"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Permissions Notice Banner (Shown when clicking ?) */}
                  <AnimatePresence>
                    {showPermissionsHelp && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, y: -4 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -4 }}
                        className="overflow-hidden"
                      >
                        <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10.5px] leading-relaxed flex items-start justify-between gap-2 shadow-xs">
                          <div className="flex items-start gap-2">
                            <Crown className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-black block text-amber-200">نظام صلاحيات المشرفين 👑</span>
                              <span className="text-slate-300 text-[10px] leading-relaxed block mt-0.5">
                                صلاحيات المشرف (المايكات، الحضور، وصلاحية طرد الأعضاء) تُمنح وتُدار حصراً من صاحب الروم فقط.
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setShowPermissionsHelp(false)}
                            className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer shrink-0"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="space-y-2">
                    {adminsList
                      .filter((admin) => admin.role !== 'owner') // Exclude owner card from supervisors list to prevent duplication
                      .map((admin) => {
                        return (
                          <div
                            key={admin.id}
                            className="bg-white/[0.03] border border-white/8 rounded-2xl p-2.5 space-y-2 hover:border-white/15 transition-all"
                          >
                            {/* Admin Header Info */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2.5">
                                <div className="relative">
                                  <img
                                    src={admin.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'}
                                    alt={admin.name}
                                    className="w-10 h-10 rounded-full object-cover border-2 border-amber-400/60"
                                  />
                                  {admin.isOnline && (
                                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
                                  )}
                                </div>

                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-black text-slate-100 text-xs">{admin.name}</span>
                                    <ShieldCheck className="w-4 h-4 text-purple-400" />
                                  </div>
                                  <span className="text-[10px] text-amber-300 font-bold block">
                                    {admin.roleTitle}
                                  </span>
                                </div>
                              </div>

                              {/* Badges Row */}
                              <div className="flex items-center gap-1">
                                <span className="bg-purple-600/90 text-white text-[8px] font-black px-1.5 py-0.5 rounded-md">
                                  {admin.level}
                                </span>
                                <span className="bg-amber-500/90 text-slate-950 text-[8px] font-black px-1.5 py-0.5 rounded-md">
                                  {admin.vip}
                                </span>
                                <span className="bg-emerald-600/90 text-white text-[8px] font-black px-1.5 py-0.5 rounded-md">
                                  {admin.nLevel}
                                </span>
                              </div>
                            </div>

                            {/* Granular Permissions Section */}
                            {isOwner ? (
                              /* OWNER VIEW: Granular Interactive Permission Toggles for Moderators */
                              <div className="pt-2 border-t border-white/5 space-y-1.5">
                                <div className="flex items-center justify-between text-[10px] font-black text-amber-200">
                                  <span className="flex items-center gap-1">
                                    <Sliders className="w-3 h-3 text-amber-400" />
                                    <span>تخصيص صلاحيات المشرف:</span>
                                  </span>
                                  <span className="text-[9px] text-slate-400 font-normal">انقر لتفعيل/تعطيل الصلاحية</span>
                                </div>

                                <div className="grid grid-cols-2 gap-1.5">
                                  {/* 1. Mics Control Toggle */}
                                  <button
                                    type="button"
                                    onClick={() => toggleModeratorPermission(admin.id, 'micsControl')}
                                    className={`p-1.5 rounded-xl border text-[10px] font-black flex items-center justify-between transition-all cursor-pointer ${
                                      admin.permissions.micsControl
                                        ? 'bg-cyan-500/20 border-cyan-400/60 text-cyan-200'
                                        : 'bg-white/5 border-white/10 text-slate-400 opacity-60 hover:opacity-100'
                                    }`}
                                  >
                                    <span className="flex items-center gap-1">
                                      <Mic className="w-3 h-3" />
                                      <span>التحكم بالمايكات</span>
                                    </span>
                                    <span className={`text-[9px] px-1 rounded ${admin.permissions.micsControl ? 'bg-cyan-500 text-slate-950 font-black' : 'bg-slate-700 text-slate-300'}`}>
                                      {admin.permissions.micsControl ? 'مُفعّل' : 'معطّل'}
                                    </span>
                                  </button>

                                  {/* 2. Music Control Toggle */}
                                  <button
                                    type="button"
                                    onClick={() => toggleModeratorPermission(admin.id, 'musicControl')}
                                    className={`p-1.5 rounded-xl border text-[10px] font-black flex items-center justify-between transition-all cursor-pointer ${
                                      admin.permissions.musicControl
                                        ? 'bg-purple-500/20 border-purple-400/60 text-purple-200'
                                        : 'bg-white/5 border-white/10 text-slate-400 opacity-60 hover:opacity-100'
                                    }`}
                                  >
                                    <span className="flex items-center gap-1">
                                      <Music className="w-3 h-3" />
                                      <span>تشغيل الموسيقى</span>
                                    </span>
                                    <span className={`text-[9px] px-1 rounded ${admin.permissions.musicControl ? 'bg-purple-500 text-white font-black' : 'bg-slate-700 text-slate-300'}`}>
                                      {admin.permissions.musicControl ? 'مُفعّل' : 'معطّل'}
                                    </span>
                                  </button>

                                  {/* 3. Attendance Control Toggle */}
                                  <button
                                    type="button"
                                    onClick={() => toggleModeratorPermission(admin.id, 'attendanceControl')}
                                    className={`p-1.5 rounded-xl border text-[10px] font-black flex items-center justify-between transition-all cursor-pointer ${
                                      admin.permissions.attendanceControl
                                        ? 'bg-rose-500/20 border-rose-400/60 text-rose-200'
                                        : 'bg-white/5 border-white/10 text-slate-400 opacity-60 hover:opacity-100'
                                    }`}
                                  >
                                    <span className="flex items-center gap-1">
                                      <UserCheck className="w-3 h-3" />
                                      <span>إدارة الحضور</span>
                                    </span>
                                    <span className={`text-[9px] px-1 rounded ${admin.permissions.attendanceControl ? 'bg-rose-500 text-white font-black' : 'bg-slate-700 text-slate-300'}`}>
                                      {admin.permissions.attendanceControl ? 'مُفعّل' : 'معطّل'}
                                    </span>
                                  </button>

                                  {/* 4. Seat Priority Toggle */}
                                  <button
                                    type="button"
                                    onClick={() => toggleModeratorPermission(admin.id, 'seatPriority')}
                                    className={`p-1.5 rounded-xl border text-[10px] font-black flex items-center justify-between transition-all cursor-pointer ${
                                      admin.permissions.seatPriority
                                        ? 'bg-amber-500/20 border-amber-400/60 text-amber-200'
                                        : 'bg-white/5 border-white/10 text-slate-400 opacity-60 hover:opacity-100'
                                    }`}
                                  >
                                    <span className="flex items-center gap-1">
                                      👑 أولوية المقاعد
                                    </span>
                                    <span className={`text-[9px] px-1 rounded ${admin.permissions.seatPriority ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-700 text-slate-300'}`}>
                                      {admin.permissions.seatPriority ? 'مُفعّل' : 'معطّل'}
                                    </span>
                                  </button>

                                  {/* 5. Kick Control Toggle (Owner Grants Kick Permission to Moderator) */}
                                  <button
                                    type="button"
                                    onClick={() => toggleModeratorPermission(admin.id, 'kickControl')}
                                    className={`col-span-2 p-2 rounded-xl border text-[10px] font-black flex items-center justify-between transition-all cursor-pointer ${
                                      admin.permissions.kickControl
                                        ? 'bg-rose-500/20 border-rose-400/60 text-rose-200 shadow-xs'
                                        : 'bg-white/5 border-white/10 text-slate-400 opacity-60 hover:opacity-100'
                                    }`}
                                  >
                                    <span className="flex items-center gap-1.5">
                                      <Ban className="w-3.5 h-3.5 text-rose-400" />
                                      <span>صلاحية طرد وحظر الأعضاء (مهلة 24 ساعة)</span>
                                    </span>
                                    <span className={`text-[9.5px] px-2 py-0.5 rounded font-black ${admin.permissions.kickControl ? 'bg-rose-500 text-white' : 'bg-slate-700 text-slate-300'}`}>
                                      {admin.permissions.kickControl ? 'مُصرّح بالطرد ✓' : 'معطّل (سحب الصلاحية)'}
                                    </span>
                                  </button>
                                </div>
                              </div>
                            ) : (
                              /* MODERATOR / GUEST VIEW: Read-Only Badges Only (No Toggles) */
                              <div className="flex flex-wrap items-center gap-1.5 pt-1.5 border-t border-white/5 text-[9px] font-bold text-slate-300">
                                <span className="text-slate-400">الصلاحيات الممنوحة:</span>
                                {admin.permissions.micsControl && (
                                  <span className="bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-md border border-cyan-500/30 flex items-center gap-0.5">
                                    <Mic className="w-2.5 h-2.5" /> المايكات
                                  </span>
                                )}
                                {admin.permissions.musicControl && (
                                  <span className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-md border border-purple-500/30 flex items-center gap-0.5">
                                    <Music className="w-2.5 h-2.5" /> الموسيقى
                                  </span>
                                )}
                                {admin.permissions.attendanceControl && (
                                  <span className="bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-md border border-rose-500/30 flex items-center gap-0.5">
                                    <UserCheck className="w-2.5 h-2.5" /> الحضور
                                  </span>
                                )}
                                {admin.permissions.seatPriority && (
                                  <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-md border border-amber-500/30 flex items-center gap-0.5">
                                    👑 الأولوية
                                  </span>
                                )}
                                {admin.permissions.kickControl && (
                                  <span className="bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-md border border-rose-500/30 flex items-center gap-0.5">
                                    <Ban className="w-2.5 h-2.5" /> صلاحية الطرد 24س
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* 3. ROOM INTEREST TAGS */}
                <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-2.5 space-y-1.5">
                  <span className="font-black text-slate-200 text-xs block flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>اهتمامات ووسوم الغرفة</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {['🎭 طرب وسوالف', '🇸🇦 السعودية', '💎 كبار الداعمين', '👑 الأساطير', '🎵 دي جي'].map((tag, idx) => (
                      <span key={idx} className="bg-white/5 border border-white/10 text-slate-300 px-2.5 py-1 rounded-full text-[10px] font-bold">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

        {/* TAB 2: 24-HOUR BANNED USERS LIST (قائمة المطرودين حصرياً لمالك الروم) */}
        {isOwner && activeTab === 'banned' && (
          <div className="space-y-3">
            {/* Explanation Card */}
            <div className="p-2.5 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-xs flex items-start gap-2.5">
              <Ban className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="text-rose-200 font-bold text-[11px]">
                  قائمة المطرودين من الغرفة (مهلة الحظر 24 ساعة) 🚫
                </p>
                <p className="text-slate-300 text-[10px] leading-relaxed">
                  يستمر الطرد لمدة 24 ساعة ثم يُلغى تلقائياً من القائمة. في حال قام مالك الروم بإلغاء الطرد، يحق للشخص العودة للروم فوراً.
                </p>
              </div>
            </div>

            {bannedUsers.length === 0 ? (
              <div className="py-10 text-center text-slate-400 space-y-2">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-md">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-slate-200">لا يوجد أي أعضاء مطرودين حالياً</p>
                <p className="text-[10px] text-slate-400 max-w-[260px] mx-auto">
                  سجل المطرودين نظيف، وجميع الأعضاء المصرح لهم يمكنهم الدخول والمشاركة بحرية.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {bannedUsers.map((bUser) => (
                  <div
                    key={bUser.id}
                    className="bg-[#1A2234] border border-rose-500/25 rounded-2xl p-3 space-y-2.5 hover:border-rose-500/40 transition-colors shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={bUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'}
                          alt={bUser.name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-rose-500/60"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-black text-white">{bUser.name}</span>
                            {bUser.vipLabel && (
                              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-bold px-1.5 py-0.5 rounded">
                                {bUser.vipLabel}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
                            <span>ID: {bUser.userId}</span>
                            <span>•</span>
                            <span className="text-rose-400 font-bold">طرده: {bUser.bannedBy}</span>
                          </div>
                        </div>
                      </div>

                      {/* Remaining Countdown Timer */}
                      <div className="text-left">
                        <span className="text-[10px] bg-slate-900/80 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center gap-1 font-mono font-bold shadow-xs">
                          <Clock className="w-3 h-3 text-amber-400" />
                          <span>{formatRemainingBanTime(bUser.bannedUntil)}</span>
                        </span>
                      </div>
                    </div>

                    {/* Bottom Action / Unban */}
                    <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[9.5px] text-slate-400 font-medium">
                        مهلة الطرد: 24 ساعة (تلقائية)
                      </span>

                      {isOwner ? (
                        <button
                          type="button"
                          onClick={() => handleUnbanUser(bUser.id, bUser.name)}
                          className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 text-slate-950 text-[10.5px] font-black rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                        >
                          <Unlock className="w-3.5 h-3.5" />
                          <span>إلغاء الطرد والسماح بالعودة 🔓</span>
                        </button>
                      ) : (
                        <span className="text-[9.5px] text-amber-400/90 font-bold flex items-center gap-1">
                          <span>🔒</span>
                          <span>إلغاء الطرد متاح للمالك فقط</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

            {/* 4. ADVANCED ROOM SETTINGS BUTTON (OWNER ONLY) */}
            {isOwner && (
              <div className="bg-[#1A2234] border border-white/10 rounded-2xl p-3 flex items-center justify-between">
                <span className="font-bold text-slate-300 text-xs">إعدادات وإدارة الغرفة المتقدمة</span>
                <button
                  onClick={() => {
                    onClose();
                    onOpenSettings?.();
                  }}
                  className="bg-amber-500 text-slate-950 px-3 py-1.5 rounded-xl font-black text-[11px] flex items-center gap-1 hover:brightness-110 cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>الإعدادات</span>
                </button>
              </div>
            )}
          </div>

          {/* Bottom Action Bar */}
          <div className="pt-2 border-t border-white/10 shrink-0">
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs rounded-xl shadow-md hover:brightness-110 cursor-pointer transition-all"
            >
              إغلاق النافذة
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>

    {/* AVATAR PICKER MODAL (نافذة تغيير صورة الغرفة الحصرية لمالك الغرفة 👑) */}
    <AnimatePresence>
      {showAvatarPickerModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-transparent" dir="rtl">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-sm bg-[#131B2E] border border-amber-400/40 rounded-3xl p-4 text-white shadow-2xl space-y-4"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-amber-300">تغيير صورة الغرفة (خاص بالمالك 👑)</h3>
                  <p className="text-[10px] text-slate-400">ستظهر الصورة داخل الروم وخارج الروم في القائمة</p>
                </div>
              </div>
              <button
                onClick={() => setShowAvatarPickerModal(false)}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Current Active Preview */}
            <div className="flex flex-col items-center justify-center py-2 space-y-1.5">
              <div className="relative w-20 h-20 rounded-3xl border-3 border-amber-400 overflow-hidden shadow-lg p-0.5 bg-slate-900">
                <img
                  src={hostAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                  alt="Room Avatar"
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
              <span className="text-[10px] font-bold text-amber-200">الصورة الحالية للروم</span>
            </div>

            {/* Upload from Device Button */}
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs rounded-2xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 border border-emerald-400/40"
              >
                <Upload className="w-4 h-4" />
                <span>رفع صورة من الاستوديو / الهاتف</span>
              </button>
            </div>

            {/* Preset Library Grid */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-black text-slate-300 block">أو اختر من المعرض الملكي الفاخر:</span>
              <div className="grid grid-cols-5 gap-2 max-h-36 overflow-y-auto no-scrollbar p-1 bg-slate-950/50 rounded-2xl border border-white/5">
                {PRESET_ROOM_AVATARS.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      onUpdateRoomAvatar?.(url);
                      setShowAvatarPickerModal(false);
                      showToast('✓ تم تغيير وتطبيق صورة الغرفة بنجاح! 👑✨');
                    }}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer hover:scale-105 ${
                      hostAvatar === url ? 'border-amber-400 ring-2 ring-amber-400/50' : 'border-slate-700/60 hover:border-amber-300'
                    }`}
                  >
                    <img src={url} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                    {hostAvatar === url && (
                      <div className="absolute inset-0 bg-amber-500/30 flex items-center justify-center">
                        <Check className="w-4 h-4 text-white stroke-[3]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom URL Input Option */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-black text-slate-300 block">أو رابط صورة مباشر (URL):</span>
              <div className="flex gap-1.5">
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={customAvatarUrlInput}
                  onChange={(e) => setCustomAvatarUrlInput(e.target.value)}
                  className="flex-1 bg-slate-950/80 border border-slate-700 rounded-xl px-2.5 py-1.5 text-[11px] text-white focus:outline-none focus:border-amber-400"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customAvatarUrlInput.trim()) {
                      onUpdateRoomAvatar?.(customAvatarUrlInput.trim());
                      setCustomAvatarUrlInput('');
                      setShowAvatarPickerModal(false);
                      showToast('✓ تم تطبيق رابط الصورة الجديد للغرفة! 🌐');
                    } else {
                      showToast('⚠️ يرجى إدخال رابط صورة صالح');
                    }
                  }}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] rounded-xl transition-all cursor-pointer shrink-0"
                >
                  تطبيق
                </button>
              </div>
            </div>

            {/* Cancel Button */}
            <button
              type="button"
              onClick={() => setShowAvatarPickerModal(false)}
              className="w-full py-2 bg-white/10 hover:bg-white/20 text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
            >
              إلغاء
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
    </>
  );
};
