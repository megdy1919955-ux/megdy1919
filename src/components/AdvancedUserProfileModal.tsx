import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Crown,
  Gift,
  MessageCircle,
  UserPlus,
  UserCheck,
  ShieldCheck,
  Copy,
  Heart,
  MicOff,
  Mic,
  Armchair,
  LogOut,
  Bell,
  AlertCircle,
  Sparkles,
  Award,
  Settings,
  Flag,
  Check,
  Globe,
  Ban,
  UserMinus,
  MessageSquareOff,
  Lock,
  Unlock,
  ShieldAlert,
  Music,
  Users,
  ToggleLeft,
  ToggleRight,
  Sliders,
  User,
  ChevronLeft
} from 'lucide-react';

export interface BadgeItem {
  id: string;
  label: string;
  bgClass: string;
  icon?: string | React.ReactNode;
}

export interface UserProfileData {
  id: string;
  name: string;
  avatar: string;
  userId: string;
  country: string;
  countryFlag: string;
  badges?: BadgeItem[];
  isHost?: boolean;
  isAdmin?: boolean;
  isMuted?: boolean;
  isMutedByAdmin?: boolean;
  seatId?: number;
  cpRelation?: any;
  cpRelations?: Array<{
    id: string;
    avatar: string;
    level: string;
  }>;
}

interface AdvancedUserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfileData | null;
  currentAppRole?: string;
  isCurrentAdmin?: boolean;
  isRoomOwner?: boolean;
  onSendGift?: (user: UserProfileData) => void;
  onMentionUser?: (user: UserProfileData) => void;
  onToggleMuteUser?: (user: UserProfileData) => void;
  onManageSeat?: (user: UserProfileData) => void;
  onKickFromRoom?: (user: UserProfileData) => void;
  onOpenAdminControls?: (user: UserProfileData) => void;
  onOpenPrivateChat?: (user: UserProfileData) => void;
  onOpenFullProfile?: (user: UserProfileData) => void;
}

export const AdvancedUserProfileModal: React.FC<AdvancedUserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  currentAppRole = 'developer',
  isCurrentAdmin = false,
  isRoomOwner = false,
  onSendGift,
  onMentionUser,
  onToggleMuteUser,
  onManageSeat,
  onKickFromRoom,
  onOpenAdminControls,
  onOpenPrivateChat,
  onOpenFullProfile
}) => {
  const [isFollowing, setIsFollowing] = useState(true);
  const [copiedId, setCopiedId] = useState(false);
  const [isMuted, setIsMuted] = useState(user?.isMuted || false);
  const [isTextChatMuted, setIsTextChatMuted] = useState(false);
  const [isAdminRank, setIsAdminRank] = useState(user?.isAdmin || false);
  const [showAdminPermissionsModal, setShowAdminPermissionsModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync isMuted state with user prop changes
  useEffect(() => {
    if (user) {
      setIsMuted(Boolean(user.isMuted));
    }
  }, [user, user?.isMuted]);

  // Admin Permissions Switches (شبكة الصلاحيات الفردية)
  const [micControl, setMicControl] = useState(true);
  const [musicControl, setMusicControl] = useState(true);
  const [audienceControl, setAudienceControl] = useState(true);
  const [seatPriority, setSeatPriority] = useState(false);

  if (!isOpen || !user) return null;

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2200);
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(user.userId || user.id);
    setCopiedId(true);
    triggerToast('تم نسخ الـ ID بنجاح 📋');
    setTimeout(() => setCopiedId(false), 2000);
  };

  const cpList = user.cpRelations || [
    {
      id: 'cp1',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      level: 'LV3'
    },
    {
      id: 'cp2',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      level: 'LV4'
    }
  ];

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 bg-transparent flex items-end justify-center p-0 pointer-events-auto cursor-default"
        onClick={onClose}
      >
        {showAdminPermissionsModal ? (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-full sm:max-w-md bg-white text-slate-900 rounded-t-xl rounded-b-none shadow-[0_-10px_35px_rgba(0,0,0,0.15)] p-3.5 flex flex-col dir-rtl select-none border-t border-slate-200 relative z-50 max-h-[60vh] overflow-y-auto"
            dir="rtl"
          >
            {/* 1. ADMIN PERMISSIONS HEADER WITH USER INFO & BADGES */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2 bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent p-2 rounded-lg border border-amber-200/60">
              <div className="flex items-center gap-2">
                <div 
                  className="relative cursor-pointer transition-transform active:scale-95 group"
                  onClick={() => onOpenFullProfile?.(user)}
                  title="عرض الملف الشخصي الكامل"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-amber-400 shadow-xs group-hover:border-amber-500"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white p-0.5 rounded-full shadow-xs">
                    <ShieldCheck className="w-3 h-3" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <div 
                    className="flex items-center gap-1 cursor-pointer"
                    onClick={() => onOpenFullProfile?.(user)}
                    title="عرض الملف الشخصي الكامل"
                  >
                    <span className="text-xs font-black text-slate-900 hover:text-amber-600 transition-colors">({user.name})</span>
                    <span className="px-1.5 py-0.2 bg-slate-900 text-amber-400 text-[8px] font-black rounded-full">
                      VIP6
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[9px] font-bold text-slate-500">
                    <span className="bg-amber-100 text-amber-800 px-1 rounded">53 🏆</span>
                    <span className="bg-pink-100 text-pink-700 px-1 rounded">113 👑</span>
                    <span className="text-slate-400 font-mono">ID:{user.userId || user.id}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowAdminPermissionsModal(false)}
                className="text-[10px] text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-full font-black cursor-pointer transition-all border border-slate-200"
              >
                رجوع ↩️
              </button>
            </div>

            <div className="flex items-center gap-1.5 mb-2 px-1">
              <Sliders className="w-3.5 h-3.5 text-amber-600" />
              <h4 className="text-[11px] font-black text-slate-800">شبكة أذونات وصلاحيات الإداري الفردية</h4>
            </div>

            {/* 2. PERMISSIONS GRID */}
            <div className="grid grid-cols-2 gap-1.5 mb-2.5">
              {/* Mic Control */}
              <button
                onClick={() => {
                  const nextVal = !micControl;
                  setMicControl(nextVal);
                  triggerToast(nextVal ? 'تم تفعيل التحكم بالمايكات 🎙️' : 'تم تعطيل التحكم بالمايكات 🔇');
                }}
                className={`flex flex-col p-2 rounded-lg border text-right transition-all cursor-pointer ${
                  micControl
                    ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 shadow-2xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 opacity-80'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <Mic className={`w-3.5 h-3.5 ${micControl ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span className={`text-[8px] font-black px-1.5 py-0.2 rounded-full ${micControl ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                    {micControl ? 'مُفعّل' : 'معطّل'}
                  </span>
                </div>
                <span className="text-[10px] font-black leading-tight">التحكم بالمايكات</span>
                <span className="text-[8px] text-slate-500 font-bold mt-0.5">Mic Control</span>
              </button>

              {/* Music Control */}
              <button
                onClick={() => {
                  const nextVal = !musicControl;
                  setMusicControl(nextVal);
                  triggerToast(nextVal ? 'تم تفعيل تشغيل الموسيقى 🎵' : 'تم تعطيل تشغيل الموسيقى 🔇');
                }}
                className={`flex flex-col p-2 rounded-lg border text-right transition-all cursor-pointer ${
                  musicControl
                    ? 'bg-purple-50/80 border-purple-300 text-purple-950 shadow-2xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 opacity-80'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <Music className={`w-3.5 h-3.5 ${musicControl ? 'text-purple-600' : 'text-slate-400'}`} />
                  <span className={`text-[8px] font-black px-1.5 py-0.2 rounded-full ${musicControl ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                    {musicControl ? 'مُفعّل' : 'معطّل'}
                  </span>
                </div>
                <span className="text-[10px] font-black leading-tight">تشغيل الموسيقى</span>
                <span className="text-[8px] text-slate-500 font-bold mt-0.5">Music Control</span>
              </button>

              {/* Audience Management */}
              <button
                onClick={() => {
                  const nextVal = !audienceControl;
                  setAudienceControl(nextVal);
                  triggerToast(nextVal ? 'تم تفعيل إدارة الحضور 👥' : 'تم تعطيل إدارة الحضور ❌');
                }}
                className={`flex flex-col p-2 rounded-lg border text-right transition-all cursor-pointer ${
                  audienceControl
                    ? 'bg-blue-50/80 border-blue-300 text-blue-950 shadow-2xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 opacity-80'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <Users className={`w-3.5 h-3.5 ${audienceControl ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span className={`text-[8px] font-black px-1.5 py-0.2 rounded-full ${audienceControl ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                    {audienceControl ? 'مُفعّل' : 'معطّل'}
                  </span>
                </div>
                <span className="text-[10px] font-black leading-tight">إدارة الحضور</span>
                <span className="text-[8px] text-slate-500 font-bold mt-0.5">Audience Mgmt</span>
              </button>

              {/* Seat Priority */}
              <button
                onClick={() => {
                  const nextVal = !seatPriority;
                  setSeatPriority(nextVal);
                  triggerToast(nextVal ? 'تم تفعيل أولوية المقاعد 🪑' : 'تم تعطيل أولوية المقاعد');
                }}
                className={`flex flex-col p-2 rounded-lg border text-right transition-all cursor-pointer ${
                  seatPriority
                    ? 'bg-amber-50/80 border-amber-300 text-amber-950 shadow-2xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 opacity-80'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <Armchair className={`w-3.5 h-3.5 ${seatPriority ? 'text-amber-600' : 'text-slate-400'}`} />
                  <span className={`text-[8px] font-black px-1.5 py-0.2 rounded-full ${seatPriority ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                    {seatPriority ? 'مُفعّل' : 'معطّل'}
                  </span>
                </div>
                <span className="text-[10px] font-black leading-tight">أولوية المقاعد</span>
                <span className="text-[8px] text-slate-500 font-bold mt-0.5">Seat Priority</span>
              </button>
            </div>

            {/* 3. QUICK ROOM ADMIN ACTIONS */}
            <div className="space-y-1 text-xs border-t border-slate-100 pt-2">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 px-1 mb-0.5">
                <span>إجراءات فورية أخرى</span>
              </div>

              {/* Toggle Room Admin Designation */}
              <button
                onClick={() => {
                  setIsAdminRank(!isAdminRank);
                  triggerToast(isAdminRank ? 'تم إلغاء رتبة الإداري' : 'تم تحديث الصلاحيات في قاعدة البيانات ⚡');
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  isAdminRank
                    ? 'bg-amber-50 border-amber-300 text-amber-900'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                  <span className="font-black text-[10px]">منح رتبة مشرف الغرفة</span>
                </div>
                <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded-full ${isAdminRank ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  {isAdminRank ? 'نشط' : 'معطّل'}
                </span>
              </button>

              {/* Action: Kick Seat */}
              <div className="grid grid-cols-2 gap-1">
                <button
                  onClick={() => {
                    triggerToast('تم إنزال المستخدم من المقعد 🪑');
                    onManageSeat?.(user);
                  }}
                  className="flex items-center justify-center gap-1 p-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-[10px] font-black transition-all cursor-pointer"
                >
                  <UserMinus className="w-3.5 h-3.5 text-slate-600" />
                  <span>إنزال المقعد</span>
                </button>

                <button
                  onClick={() => {
                    triggerToast('تم طرد المستخدم من الغرفة 🚪');
                    onKickFromRoom?.(user);
                    onClose();
                  }}
                  className="flex items-center justify-center gap-1 p-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-[10px] font-black transition-all cursor-pointer"
                >
                  <Ban className="w-3.5 h-3.5 text-rose-600" />
                  <span>حظر / طرد</span>
                </button>
              </div>
            </div>

            {/* 4. BACK TO USER PROFILE BUTTON */}
            <div className="pt-2 border-t border-slate-100 mt-2 flex justify-center">
              <button
                onClick={() => setShowAdminPermissionsModal(false)}
                className="w-full py-1.5 bg-gradient-to-r from-slate-900 to-slate-800 text-amber-300 rounded-lg text-xs font-black hover:opacity-95 transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1"
              >
                <span>حفظ وتطبيق الصلاحيات</span>
                <Check className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-full sm:max-w-md bg-white text-slate-900 rounded-t-xl rounded-b-none shadow-[0_-10px_35px_rgba(0,0,0,0.15)] relative flex flex-col dir-rtl select-none pb-3 border-t border-slate-200/90 max-h-[60vh] overflow-visible mt-8"
            dir="rtl"
          >
            {/* TOP CONTROLS ROW & OVERLAPPING AVATAR */}
            <div className="pt-2 px-3 flex items-center justify-between relative z-20 min-h-[36px] overflow-visible">
              {/* Top Left Action Icons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => triggerToast('تم تقديم بلاغ / معلومات ℹ️')}
                  className="w-6.5 h-6.5 rounded-full border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all cursor-pointer shadow-2xs"
                  title="معلومات / بلاغ"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onOpenPrivateChat?.(user);
                  }}
                  className="w-6.5 h-6.5 rounded-full border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all cursor-pointer shadow-2xs"
                  title="محادثة صوتية / رسالة"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* OVERLAPPING AVATAR STRADDLING TOP EDGE (50% OVERLAP OUTSIDE & INSIDE - UNCLIPPED) */}
              <div className="absolute left-1/2 -translate-x-1/2 -top-8 z-30 flex flex-col items-center overflow-visible">
                <div 
                  onClick={() => onOpenFullProfile?.(user)}
                  className="relative overflow-visible cursor-pointer transition-transform active:scale-95 group"
                  title="اضغط لفتح الملف الشخصي الكامل"
                >
                  <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 via-rose-400 to-cyan-400 shadow-md ring-4 ring-white overflow-visible group-hover:ring-amber-300 transition-all">
                    <img
                      src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'}
                      alt={user.name}
                      className="w-full h-full object-cover rounded-full bg-slate-100"
                    />
                  </div>
                  {user.isHost && (
                    <div className="absolute -top-1 -right-1 bg-amber-500 text-white p-0.5 rounded-full shadow-xs border border-white z-10">
                      <Crown className="w-3 h-3 fill-white" />
                    </div>
                  )}
                </div>
              </div>

              {/* Top Right Gold Crest Rank Badge */}
              <div className="flex flex-col items-center">
                <div className="w-7 h-7 bg-gradient-to-tr from-amber-400 via-yellow-400 to-amber-500 rounded-md p-0.5 shadow-2xs flex items-center justify-center text-white relative">
                  <Crown className="w-4 h-4 fill-white stroke-amber-600" />
                </div>
                <span className="text-[9px] font-black text-amber-600 font-mono -mt-0.5">2936</span>
              </div>
            </div>

            {/* USER INFO & CONTENT */}
            <div className="flex flex-col items-center pt-5 px-3 space-y-1 relative z-10">
              {/* USER NAME */}
              <h3 
                onClick={() => onOpenFullProfile?.(user)}
                className="text-sm font-black text-slate-900 tracking-wide text-center cursor-pointer hover:text-amber-600 transition-colors"
                title="اضغط لفتح الملف الشخصي الكامل"
              >
                ({user.name})
              </h3>

              {/* ID & COUNTRY ROW */}
              <div className="flex items-center gap-1 text-[11px] text-slate-500 font-bold">
                <span className="text-slate-500">{user.country || 'اليمن'}</span>
                <span className="text-slate-300">•</span>
                <button
                  onClick={handleCopyId}
                  className="flex items-center gap-0.5 text-slate-500 hover:text-slate-800 transition-colors font-mono cursor-pointer"
                >
                  <span>ID:{user.userId || user.id}</span>
                  <Copy className="w-2.5 h-2.5 text-slate-400" />
                </button>
              </div>

              {/* RECTANGULAR FULL PROFILE BUTTON */}
              <button
                type="button"
                onClick={() => onOpenFullProfile?.(user)}
                className="inline-flex items-center justify-center gap-1 px-3 py-1 bg-slate-900 hover:bg-slate-800 text-amber-300 rounded-lg text-[10px] font-black shadow-xs hover:shadow transition-all cursor-pointer active:scale-95 border border-slate-700/50 mt-0.5 mb-1"
                title="فتح الملف الشخصي الكامل"
              >
                <User className="w-3 h-3 text-amber-400" />
                <span>فتح الملف الشخصي</span>
                <ChevronLeft className="w-2.5 h-2.5 text-slate-400" />
              </button>

              {/* LEVEL BADGES HORIZONTAL ROW */}
              <div className="flex flex-wrap items-center justify-center gap-0.5 pt-0.5 max-w-full scale-95">
                <span className="px-1.5 py-0.2 bg-gradient-to-r from-blue-500 to-pink-500 text-white text-[9px] font-black rounded-full shadow-2xs">
                  Ya III
                </span>
                <span className="px-1.5 py-0.2 bg-amber-500 text-white text-[9px] font-black rounded-full flex items-center gap-0.5 shadow-2xs">
                  <span>53</span>
                  <span>🏆</span>
                </span>
                <span className="px-1.5 py-0.2 bg-orange-500 text-white text-[9px] font-black rounded-full flex items-center gap-0.5 shadow-2xs">
                  <span>16</span>
                  <span>🧡</span>
                </span>
                <span className="px-1.5 py-0.2 bg-pink-500 text-white text-[9px] font-black rounded-full flex items-center gap-0.5 shadow-2xs">
                  <span>113</span>
                  <span>👑</span>
                </span>
                <span className="px-1.5 py-0.2 bg-cyan-600 text-white text-[9px] font-black rounded-full flex items-center gap-0.5 shadow-2xs">
                  <span>25</span>
                  <span>♂️</span>
                </span>
                <span className="px-1.5 py-0.2 bg-slate-800 text-amber-400 text-[9px] font-black rounded-full shadow-2xs">
                  VIP6
                </span>
                <span className="px-1.5 py-0.2 bg-emerald-700 text-white text-[9px] font-black rounded-full shadow-2xs">
                  N3
                </span>
              </div>

              {/* NATIONAL TAG */}
              <div className="pt-0.5">
                <span className="px-2 py-0.2 bg-pink-50 text-pink-600 border border-pink-200 text-[9px] font-black rounded-full flex items-center gap-1">
                  <Flag className="w-2.5 h-2.5 text-pink-500 fill-pink-500" />
                  <span>وطني</span>
                </span>
              </div>

              {/* ORNATE CREST MEDALS ROW */}
              <div className="flex items-center justify-center gap-2.5 pt-0.5">
                {/* Medal 1 */}
                <div className="flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-b from-emerald-600 via-teal-700 to-emerald-900 p-0.5 shadow-2xs flex items-center justify-center border border-amber-300">
                    <ShieldCheck className="w-4 h-4 text-amber-300" />
                  </div>
                  <span className="text-[8px] font-black text-emerald-800">Noble 4</span>
                </div>

                {/* Medal 2 */}
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-b from-cyan-400 via-blue-600 to-indigo-800 p-0.5 shadow-2xs flex items-center justify-center border border-white">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-[8px] font-black text-blue-700">100</span>
                </div>

                {/* Medal 3 */}
                <div className="flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-b from-emerald-600 via-teal-700 to-emerald-900 p-0.5 shadow-2xs flex items-center justify-center border border-amber-300">
                    <ShieldCheck className="w-4 h-4 text-amber-300" />
                  </div>
                  <span className="text-[8px] font-black text-emerald-800">Noble 5</span>
                </div>
              </div>

              {/* CP RELATIONSHIPS SECTION (علاقاتي) */}
              <div className="w-full pt-1 space-y-0.5">
                <h4 className="text-[11px] font-black text-slate-800 text-center">علاقاتي</h4>
                <div className="flex items-center justify-center gap-2">
                  {cpList.map((cp) => (
                    <div
                      key={cp.id}
                      className="w-16 bg-gradient-to-b from-pink-400 via-pink-500 to-rose-600 text-white rounded-lg p-1 flex flex-col items-center shadow-xs relative group hover:scale-105 transition-transform"
                    >
                      <img
                        src={cp.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'}
                        alt="CP"
                        className="w-8 h-8 rounded-full object-cover border border-white/80 shadow-2xs"
                      />
                      <div className="mt-0.5 text-center">
                        <div className="text-[9px] font-black leading-none">CP</div>
                        <div className="text-[8px] font-bold text-pink-100">{cp.level}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ADMIN ACTIONS BAR */}
              {(isCurrentAdmin || isRoomOwner) && (
                <div className="w-full pt-1.5 border-t border-slate-100 mt-1">
                  <div className="grid grid-cols-5 gap-0.5 text-center">
                    {/* 1. Admin */}
                    <button
                      onClick={() => {
                        triggerToast('تم فتح صلاحيات الإداري الفردية 🛡️');
                        setShowAdminPermissionsModal(true);
                        onOpenAdminControls?.(user);
                      }}
                      className="flex flex-col items-center justify-center p-1 rounded-lg hover:bg-slate-100 transition-colors text-slate-700 cursor-pointer"
                    >
                      <Settings className="w-4 h-4 text-slate-600" />
                      <span className="text-[9px] font-bold mt-0.5 text-slate-600">الإداري</span>
                    </button>

                    {/* 2. Dedicated Mute/Unmute Mic Control */}
                    {(() => {
                      const isSelf = user?.id === 'my_user_profile' || user?.name?.includes('أنا') || user?.name?.includes('المشرف (أنا)');
                      const isTargetRoomOwner = Boolean(user?.isHost || user?.seatId === 1 || user?.name?.includes('المضيف') || user?.name?.includes('مالك الغرفة'));
                      const isModRestricted = isTargetRoomOwner && !isRoomOwner && !isSelf;

                      return (
                        <button
                          onClick={() => {
                            if (isModRestricted) {
                              triggerToast('لا تملك صلاحية تعديل أو إلغاء كتم ميكروفون مالك الغرفة 👑');
                              return;
                            }
                            const nextMuted = !isMuted;
                            setIsMuted(nextMuted);
                            triggerToast(
                              isSelf
                                ? (nextMuted ? 'تم كتم ميكروفونك 🔇' : 'تم فتح ميكروفونك 🎙️')
                                : (nextMuted ? 'تم كتم ميكروفون المستخدم 🔇' : 'تم فتح ميكروفون المستخدم 🎙️')
                            );
                            if (user) {
                              onToggleMuteUser?.({ ...user, isMuted: nextMuted, isMutedByAdmin: nextMuted });
                            }
                          }}
                          className={`flex flex-col items-center justify-center p-1 rounded-lg transition-all ${
                            isModRestricted
                              ? 'opacity-60 bg-slate-100 border border-slate-300 text-slate-400 cursor-not-allowed'
                              : isMuted
                              ? 'bg-rose-500/20 text-rose-600 font-black border border-rose-300 ring-1 ring-rose-400/30 cursor-pointer hover:bg-rose-500/30'
                              : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 border border-emerald-300/60 font-bold cursor-pointer'
                          }`}
                          title={
                            isModRestricted
                              ? 'محمي بصلاحيات مالك الغرفة 👑'
                              : isMuted
                              ? (isSelf ? 'إلغاء كتم ميكروفوني' : 'إلغاء كتم المايك')
                              : (isSelf ? 'كتم ميكروفوني' : 'كتم مايك المشارك')
                          }
                        >
                          {isMuted ? (
                            <MicOff className="w-4 h-4 text-rose-600 stroke-[2.4]" />
                          ) : (
                            <Mic className="w-4 h-4 text-emerald-600 stroke-[2.4]" />
                          )}
                          <span className="text-[9px] font-black mt-0.5 whitespace-nowrap">
                            {isMuted ? 'إلغاء الكتم' : 'كتم المايك'}
                          </span>
                        </button>
                      );
                    })()}

                    {/* 3. Private Chat */}
                    <button
                      onClick={() => {
                        onClose();
                        onOpenPrivateChat?.(user);
                      }}
                      className="flex flex-col items-center justify-center p-1 rounded-lg hover:bg-slate-100 transition-colors text-slate-700 cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4 text-slate-600" />
                      <span className="text-[9px] font-bold mt-0.5 text-slate-600">دردشة</span>
                    </button>

                    {/* 4. Seat Management */}
                    <button
                      onClick={() => {
                        triggerToast('تحكم المقعد 🪑');
                        onManageSeat?.(user);
                      }}
                      className="flex flex-col items-center justify-center p-1 rounded-lg hover:bg-slate-100 transition-colors text-slate-700 cursor-pointer"
                    >
                      <Armchair className="w-4 h-4 text-slate-600" />
                      <span className="text-[9px] font-bold mt-0.5 text-slate-600">مقعد</span>
                    </button>

                    {/* 5. Room Management */}
                    <button
                      onClick={() => {
                        triggerToast('تحكم الغرفة 🚪');
                        onKickFromRoom?.(user);
                      }}
                      className="flex flex-col items-center justify-center p-1 rounded-lg hover:bg-slate-100 transition-colors text-slate-700 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-slate-600" />
                      <span className="text-[9px] font-bold mt-0.5 text-slate-600">غرفة</span>
                    </button>
                  </div>
                </div>
              )}

              {/* PRIMARY FOOTER INTERACTION BAR */}
              <div className="w-full pt-1.5 border-t border-slate-200 mt-1 grid grid-cols-3 gap-0 divide-x divide-x-reverse divide-slate-200">
                {/* Follow Button */}
                <button
                  onClick={() => {
                    setIsFollowing(!isFollowing);
                    triggerToast(isFollowing ? 'تم إلغاء المتابعة' : 'تمت المتابعة بنجاح! ❤️');
                  }}
                  className="py-1.5 flex items-center justify-center gap-0.5 text-slate-700 font-black text-[11px] hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  {isFollowing ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-slate-500" />
                      <span>تمت المتابعة</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5 text-amber-500" />
                      <span className="text-amber-600">متابعة</span>
                    </>
                  )}
                </button>

                {/* Send Gift Button */}
                <button
                  onClick={() => {
                    onClose();
                    onSendGift?.(user);
                  }}
                  className="py-1.5 flex items-center justify-center gap-0.5 text-pink-600 font-black text-[11px] hover:bg-pink-50 transition-colors cursor-pointer"
                >
                  <Gift className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
                  <span>إرسال هدايا</span>
                </button>

                {/* Mention / Reminder Button */}
                <button
                  onClick={() => {
                    onClose();
                    onMentionUser?.(user);
                  }}
                  className="py-1.5 flex items-center justify-center gap-0.5 text-blue-600 font-black text-[11px] hover:bg-blue-50 transition-colors cursor-pointer"
                >
                  <Bell className="w-3.5 h-3.5 text-blue-500" />
                  <span>تذكير</span>
                </button>
              </div>
            </div>

            {/* TOAST BANNER */}
            {toastMessage && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[11px] font-black px-3 py-1.5 rounded-full shadow-xl z-50 animate-bounce">
                {toastMessage}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
};

