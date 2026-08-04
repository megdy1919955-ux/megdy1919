import React, { useState } from 'react';
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
  ShieldAlert
} from 'lucide-react';

export interface BadgeItem {
  id: string;
  label: string;
  bgClass: string;
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
  seatId?: number;
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
  isCurrentAdmin?: boolean;
  onSendGift?: (user: UserProfileData) => void;
  onMentionUser?: (user: UserProfileData) => void;
  onToggleMuteUser?: (user: UserProfileData) => void;
  onManageSeat?: (user: UserProfileData) => void;
  onKickFromRoom?: (user: UserProfileData) => void;
  onOpenAdminControls?: (user: UserProfileData) => void;
  onOpenPrivateChat?: (user: UserProfileData) => void;
}

export const AdvancedUserProfileModal: React.FC<AdvancedUserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  isCurrentAdmin = true,
  onSendGift,
  onMentionUser,
  onToggleMuteUser,
  onManageSeat,
  onKickFromRoom,
  onOpenAdminControls,
  onOpenPrivateChat
}) => {
  const [isFollowing, setIsFollowing] = useState(true);
  const [copiedId, setCopiedId] = useState(false);
  const [isMuted, setIsMuted] = useState(user?.isMuted || false);
  const [isTextChatMuted, setIsTextChatMuted] = useState(false);
  const [isAdminRank, setIsAdminRank] = useState(user?.isAdmin || false);
  const [showAdminPermissionsModal, setShowAdminPermissionsModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-end justify-center sm:items-center p-0 sm:p-3"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-[310px] bg-white text-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl relative flex flex-col dir-rtl select-none pb-1 mt-10"
          dir="rtl"
        >
          {/* TOP CONTROLS ROW & OVERLAPPING AVATAR */}
          <div className="pt-2 px-3 flex items-center justify-between relative z-20 min-h-[36px]">
            {/* Top Left Action Icons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => triggerToast('تم تقديم بلاغ / معلومات ℹ️')}
                className="w-6 h-6 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                title="معلومات / بلاغ"
              >
                <AlertCircle className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenPrivateChat?.(user);
                }}
                className="w-6 h-6 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                title="محادثة صوتية / رسالة"
              >
                <MessageCircle className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* OVERLAPPING AVATAR STRADDLING TOP EDGE (50% OVERLAP OUTSIDE & INSIDE) */}
            <div className="absolute left-1/2 -translate-x-1/2 -top-8 z-30 flex flex-col items-center">
              <div className="relative">
                <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 via-rose-400 to-cyan-400 shadow-md">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover rounded-full bg-slate-100"
                  />
                </div>
                {user.isHost && (
                  <div className="absolute -top-1 -right-1 bg-amber-500 text-white p-0.5 rounded-full shadow-xs border border-white">
                    <Crown className="w-3 h-3 fill-white" />
                  </div>
                )}
              </div>
            </div>

            {/* Top Right Gold Crest Rank Badge */}
            <div className="flex flex-col items-center">
              <div className="w-7 h-7 bg-gradient-to-tr from-amber-400 via-yellow-400 to-amber-500 rounded-lg p-0.5 shadow-xs flex items-center justify-center text-white relative">
                <Crown className="w-4 h-4 fill-white stroke-amber-600" />
              </div>
              <span className="text-[9px] font-black text-amber-600 font-mono -mt-0.5">2936</span>
            </div>
          </div>

          {/* USER INFO & CONTENT (Tight Paddings & Margins) */}
          <div className="flex flex-col items-center pt-5 px-3 space-y-1 relative z-10">
            {/* USER NAME */}
            <h3 className="text-sm font-black text-slate-900 tracking-wide text-center">
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

            {/* LEVEL BADGES HORIZONTAL ROW */}
            <div className="flex flex-wrap items-center justify-center gap-0.5 pt-0.5 max-w-full scale-95">
              <span className="px-1.5 py-0.2 bg-gradient-to-r from-blue-500 to-pink-500 text-white text-[9px] font-black rounded-full shadow-xs">
                Ya III
              </span>
              <span className="px-1.5 py-0.2 bg-amber-500 text-white text-[9px] font-black rounded-full flex items-center gap-0.5 shadow-xs">
                <span>53</span>
                <span>🏆</span>
              </span>
              <span className="px-1.5 py-0.2 bg-orange-500 text-white text-[9px] font-black rounded-full flex items-center gap-0.5 shadow-xs">
                <span>16</span>
                <span>🧡</span>
              </span>
              <span className="px-1.5 py-0.2 bg-pink-500 text-white text-[9px] font-black rounded-full flex items-center gap-0.5 shadow-xs">
                <span>113</span>
                <span>👑</span>
              </span>
              <span className="px-1.5 py-0.2 bg-cyan-600 text-white text-[9px] font-black rounded-full flex items-center gap-0.5 shadow-xs">
                <span>25</span>
                <span>♂️</span>
              </span>
              <span className="px-1.5 py-0.2 bg-slate-800 text-amber-400 text-[9px] font-black rounded-full shadow-xs">
                VIP6
              </span>
              <span className="px-1.5 py-0.2 bg-emerald-700 text-white text-[9px] font-black rounded-full shadow-xs">
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
                <div className="w-7 h-7 rounded-full bg-gradient-to-b from-emerald-600 via-teal-700 to-emerald-900 p-0.5 shadow-xs flex items-center justify-center border border-amber-300">
                  <ShieldCheck className="w-4 h-4 text-amber-300" />
                </div>
                <span className="text-[8px] font-black text-emerald-800">Noble 4</span>
              </div>

              {/* Medal 2 */}
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-b from-cyan-400 via-blue-600 to-indigo-800 p-0.5 shadow-md flex items-center justify-center border border-white">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-[8px] font-black text-blue-700">100</span>
              </div>

              {/* Medal 3 */}
              <div className="flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-gradient-to-b from-emerald-600 via-teal-700 to-emerald-900 p-0.5 shadow-xs flex items-center justify-center border border-amber-300">
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
                      src={cp.avatar}
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

            {/* ADMIN ACTIONS BAR (شريط الإدارة السفلي) */}
            {isCurrentAdmin && (
              <div className="w-full pt-1.5 border-t border-slate-100 mt-1">
                <div className="grid grid-cols-5 gap-0.5 text-center">
                  {/* 1. Admin */}
                  <button
                    onClick={() => {
                      triggerToast('تم فتح صلاحيات الإداري 🛡️');
                      onOpenAdminControls?.(user);
                    }}
                    className="flex flex-col items-center justify-center p-1 rounded-lg hover:bg-slate-100 transition-colors text-slate-700 cursor-pointer"
                  >
                    <Settings className="w-4 h-4 text-slate-600" />
                    <span className="text-[9px] font-bold mt-0.5 text-slate-600">الإداري</span>
                  </button>

                  {/* 2. Mute Mic */}
                  <button
                    onClick={() => {
                      setIsMuted(!isMuted);
                      triggerToast(isMuted ? 'تم فتح الميكروفون 🎙️' : 'تم إغلاق الميكروفون 🔇');
                      onToggleMuteUser?.(user);
                    }}
                    className="flex flex-col items-center justify-center p-1 rounded-lg hover:bg-slate-100 transition-colors text-slate-700 cursor-pointer"
                  >
                    {isMuted ? <Mic className="w-4 h-4 text-emerald-600" /> : <MicOff className="w-4 h-4 text-slate-600" />}
                    <span className="text-[9px] font-bold mt-0.5 text-slate-600">
                      {isMuted ? 'فتح ميك' : 'إغلاق الميك...'}
                    </span>
                  </button>

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
      </div>
    </AnimatePresence>
  );
};
