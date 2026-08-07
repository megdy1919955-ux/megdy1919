import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Crown,
  ShieldCheck,
  UserCheck,
  Mic,
  MicOff,
  Music,
  UserPlus,
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
  Sparkles
} from 'lucide-react';

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
  onRoleChange?: (role: 'owner' | 'host' | 'moderator' | 'guest') => void;
  onOpenSettings?: () => void;
}

export const RoomInfoModal: React.FC<RoomInfoModalProps> = ({
  isOpen,
  onClose,
  roomTitle = 'غرفة الأساطير الذهبية 👑',
  roomId = '997812',
  hostAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  hostName = 'الأمير أسامة',
  userRole = 'owner',
  onRoleChange,
  onOpenSettings
}) => {
  // Current active role
  const [currentRole, setCurrentRole] = useState<'owner' | 'host' | 'moderator' | 'guest'>(userRole);
  const [activeTab, setActiveTab] = useState<'admins' | 'announcement'>('admins');

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

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
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
        seatPriority: true
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
        seatPriority: true
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
        seatPriority: true
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
            seatPriority: 'أولوية المقاعد'
          };
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

  const isOwner = currentRole === 'owner';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-transparent flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-auto cursor-default select-none" onClick={onClose}>
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md bg-[#111625]/95 backdrop-blur-xl border-t-2 sm:border-2 border-amber-500/50 rounded-t-3xl sm:rounded-3xl p-4 text-white shadow-2xl max-h-[90vh] flex flex-col justify-between overflow-hidden dir-rtl pointer-events-auto"
        >
          {/* Top Header Card & Role Switcher */}
          <div className="space-y-3 shrink-0">
            {/* Simulation Role Selector Pill (Visible ONLY for Room Owner) */}
            {userRole === 'owner' && (
              <div className="bg-[#1A2234] p-2 rounded-2xl border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[10px] font-black text-slate-300 flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                    <span>اختر الرتبة لمعاينة وتخصيص الصلاحيات بالكامل:</span>
                  </span>
                </div>

                {/* 3 Separated Role Buttons: Owner, Host, Moderator */}
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => handleSelectRole('owner')}
                    className={`py-1.5 px-1 rounded-xl text-[10px] font-black transition-all cursor-pointer text-center flex items-center justify-center gap-1 ${
                      currentRole === 'owner'
                        ? 'bg-amber-500 text-slate-950 shadow-md ring-1 ring-amber-300'
                        : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span>👑</span>
                    <span>المالك</span>
                  </button>

                  <button
                    onClick={() => handleSelectRole('host')}
                    className={`py-1.5 px-1 rounded-xl text-[10px] font-black transition-all cursor-pointer text-center flex items-center justify-center gap-1 ${
                      currentRole === 'host'
                        ? 'bg-cyan-500 text-slate-950 shadow-md ring-1 ring-cyan-300'
                        : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span>🎙️</span>
                    <span>المضيف</span>
                  </button>

                  <button
                    onClick={() => handleSelectRole('moderator')}
                    className={`py-1.5 px-1 rounded-xl text-[10px] font-black transition-all cursor-pointer text-center flex items-center justify-center gap-1 ${
                      currentRole === 'moderator'
                        ? 'bg-purple-600 text-white shadow-md ring-1 ring-purple-300'
                        : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span>🛡️</span>
                    <span>المشرف</span>
                  </button>
                </div>

                {/* Role Specific Description Banner */}
                <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-[10px] text-slate-300">
                  {currentRole === 'owner' && (
                    <div className="flex items-start gap-1.5">
                      <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span><strong>صلاحيات المالك:</strong> السلطة الكاملة للغرفة، إدارة وتعيين المضيفين والمشرفين وتعديل كافة الصلاحيات.</span>
                    </div>
                  )}
                  {currentRole === 'host' && (
                    <div className="flex items-start gap-1.5">
                      <Mic className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span><strong>صلاحيات المضيف (Host):</strong> إدارة استيج البث الصوتي، فتح وإغلاق المايكات، وتشغيل الموسيقى والدي جي والتفاعل.</span>
                    </div>
                  )}
                  {currentRole === 'moderator' && (
                    <div className="flex items-start gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                      <span><strong>صلاحيات المشرف (Moderator):</strong> الإشراف على الحضور والدردشة، كتم وحظر الحسابات المخالفة، وتنظيم المقاعد.</span>
                    </div>
                  )}
                  {currentRole === 'guest' && (
                    <div className="flex items-start gap-1.5">
                      <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span><strong>رؤية الضيف (Guest):</strong> استعراض طاقم إدارة الغرفة والمعلومات فقط دون إمكانية التعديل.</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Room Info Main Card */}
            <div className="flex items-start justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={hostAvatar}
                    alt={roomTitle}
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-amber-400 shadow-md"
                  />
                  <span className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 text-[9px] font-black px-1 rounded-md shadow-xs">
                    VIP
                  </span>
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-base font-black text-amber-200">{roomTitle}</h2>
                    <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded-full">
                      مستوى 12
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-300 font-mono">
                    <span>معرف الغرفة: <strong className="text-cyan-300">{roomId}</strong></span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-emerald-400 font-bold">
                      <Radio className="w-3 h-3 animate-pulse" /> مباشر
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-full bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Direct Section Header */}
            <div className="flex items-center justify-between bg-[#1A2234] px-3 py-2 rounded-2xl border border-white/10 text-xs font-black text-amber-300">
              <span className="flex items-center gap-1.5">
                <Info className="w-4 h-4 text-amber-400" />
                <span>تفاصيل وإعلانات الغرفة</span>
              </span>
              <span className="text-[10px] text-slate-400 font-normal">إدارة ومعلومات مباشرة</span>
            </div>
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
          <div className="overflow-y-auto no-scrollbar my-3 space-y-3 flex-1 min-h-[260px] pr-0.5">
            {/* 1. DIRECTLY INTEGRATED ROOM ANNOUNCEMENT CARD */}
            <div className="bg-gradient-to-r from-[#1A2234] via-slate-900 to-purple-950/60 border border-purple-500/40 rounded-2xl p-3 space-y-2 shadow-lg relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-purple-300 flex items-center gap-1.5">
                  <Megaphone className="w-4 h-4 text-purple-400" />
                  <span>إعلان وتنبيـه الغرفة</span>
                </span>

                {/* Edit button ONLY visible for Owner */}
                {isOwner && !isEditingAnnouncement && (
                  <button
                    onClick={() => {
                      setTempAnnouncementText(announcement);
                      setIsEditingAnnouncement(true);
                    }}
                    className="bg-purple-600/30 text-purple-200 border border-purple-500/50 px-2.5 py-1 rounded-xl text-[10px] font-black flex items-center gap-1 hover:bg-purple-600/50 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>تعديل الإعلان</span>
                  </button>
                )}
              </div>

              {/* Announcement Editable Content for Owner OR Read-Only for Others */}
              {isOwner && isEditingAnnouncement ? (
                <div className="space-y-2">
                  <textarea
                    value={tempAnnouncementText}
                    onChange={(e) => setTempAnnouncementText(e.target.value)}
                    rows={3}
                    className="w-full bg-slate-950/80 border border-purple-500/60 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-1 focus:ring-purple-400 resize-none dir-rtl"
                    placeholder="أدخل نص إعلان الغرفة هنا..."
                  />
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setIsEditingAnnouncement(false)}
                      className="px-3 py-1 bg-white/10 text-slate-300 text-[11px] font-bold rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
                    >
                      إلغاء
                    </button>
                    <button
                      onClick={handleSaveAnnouncement}
                      className="px-3 py-1 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-[11px] font-black rounded-lg shadow-sm hover:brightness-110 transition-all cursor-pointer flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>حفظ الإعلان</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-950/60 p-2.5 rounded-xl border border-white/5 text-slate-200 text-xs leading-relaxed font-bold dir-rtl">
                  {announcement}
                </div>
              )}

              {!isOwner && (
                <span className="text-[9px] text-slate-400 font-bold block text-left">
                  🔒 يمكن لمالك الغرفة فقط تعديل هذا الإعلان
                </span>
              )}
            </div>

            {/* 2. ADMINS & MODERATORS LIST (EXCLUDING OWNER TO PREVENT DUPLICATION) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-black text-amber-300 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                  <span>{isOwner ? 'إدارة طاقم المشرفين والمضيفين' : 'طاقم مشرفي ومضييفي الغرفة'}</span>
                </span>

                {isOwner && (
                  <button
                    onClick={() => showToast('✓ تم فتح قائمة اختيار مشرف جديد!')}
                    className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded-xl text-[10px] font-black flex items-center gap-1 hover:bg-amber-500/30 transition-colors cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>إضافة مشرف جديد</span>
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {adminsList
                  .filter((admin) => admin.role !== 'owner') // Exclude owner card from supervisors list to prevent duplication
                  .map((admin) => {
                    return (
                      <div
                        key={admin.id}
                        className="bg-[#1A2234] border border-white/10 rounded-2xl p-3 space-y-2.5 hover:border-amber-500/30 transition-colors"
                      >
                        {/* Admin Header Info */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="relative">
                              <img
                                src={admin.avatar}
                                alt={admin.name}
                                className="w-10 h-10 rounded-full object-cover border-2 border-amber-400/60"
                              />
                              {admin.isOnline && (
                                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-[#1A2234]" />
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
                          <div className="pt-2 border-t border-white/10 space-y-1.5">
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
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* 3. ROOM INTEREST TAGS */}
            <div className="bg-[#1A2234] border border-white/10 rounded-2xl p-3 space-y-2">
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
  );
};
