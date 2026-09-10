import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Crown, Gift, MessageCircle, AtSign, UserPlus, UserCheck, ShieldCheck, Sparkles, Mic, MicOff, User, ChevronLeft, Heart } from 'lucide-react';
import { BadgeItem } from './room';
import { FriendlyPointsModal } from './FriendlyPointsModal';

interface HostProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  hostName: string;
  hostAvatar: string;
  hostId?: string;
  badges?: BadgeItem[];
  currentAppRole?: string;
  isHostMuted?: boolean;
  canControlMic?: boolean;
  friendlyPoints?: number;
  onToggleHostMute?: () => void;
  onSendGift?: () => void;
  onMentionHost?: () => void;
  onOpenFullProfile?: () => void;
  onOpenFriendlyPoints?: () => void;
}

export const HostProfileModal: React.FC<HostProfileModalProps> = ({
  isOpen,
  onClose,
  hostName,
  hostAvatar,
  hostId = '8849201',
  badges = [
    { id: 'b1', label: 'مالك الغرفة', icon: '👑', bgClass: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black' },
    { id: 'b2', label: 'VIP 10', icon: '💎', bgClass: 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold' },
    { id: 'b3', label: 'سوبر أسطورة', icon: '🔥', bgClass: 'bg-gradient-to-r from-red-500 to-amber-500 text-white font-bold' },
    { id: 'b4', label: 'زعيم العائلة', icon: '🛡️', bgClass: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold' },
    { id: 'b5', label: 'بطل الأسبوع', icon: '🏆', bgClass: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold' }
  ],
  isHostMuted = false,
  canControlMic = false,
  friendlyPoints = 2963,
  onToggleHostMute,
  onSendGift,
  onMentionHost,
  onOpenFullProfile,
  onOpenFriendlyPoints
}) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [showToast, setShowToast] = useState<string | null>(null);
  const [showFriendlyPointsModal, setShowFriendlyPointsModal] = useState(false);
  const [currentBadges, setCurrentBadges] = useState<BadgeItem[]>(badges);

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 2500);
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[70] bg-transparent flex items-end justify-center p-0 pointer-events-auto cursor-default select-none"
        onClick={onClose}
      >
        <AnimatePresence>
          <motion.div
            key="host-profile-panel"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-full sm:max-w-md bg-white rounded-t-xl rounded-b-none shadow-[0_-10px_35px_rgba(0,0,0,0.15)] overflow-hidden text-slate-900 relative flex flex-col dir-rtl pointer-events-auto transition-all border-t border-slate-200"
            dir="rtl"
          >
          {/* Header Banner */}
          <div className="h-20 bg-gradient-to-r from-amber-100 via-amber-50 to-orange-50 relative flex items-center justify-between px-4 pt-2 border-b border-amber-200/50">
            <span className="text-xs font-black text-amber-900 bg-amber-200/60 border border-amber-300 px-2.5 py-1 rounded-full flex items-center gap-1">
              <Crown className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
              <span>معاينة بروفايل المضيف</span>
            </span>

            <div className="flex items-center gap-2">
              {/* Friendly Points Heart Badge */}
              <button
                type="button"
                onClick={() => {
                  if (onOpenFriendlyPoints) {
                    onOpenFriendlyPoints();
                  } else {
                    setShowFriendlyPointsModal(true);
                  }
                }}
                className="flex items-center gap-1 bg-white/90 hover:bg-white border border-rose-200/80 px-2 py-1 rounded-full shadow-2xs cursor-pointer transition-all active:scale-95 group"
                title="نقاط ودية ورصيد التفاعل"
              >
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black text-rose-600 font-mono">{friendlyPoints}</span>
              </button>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer border border-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Profile Picture & Info */}
          <div className="px-5 pb-5 -mt-10 flex flex-col items-center text-center space-y-3 relative z-10">
            {/* Clear Profile Picture without clipping */}
            <div 
              onClick={() => onOpenFullProfile?.()}
              className="relative group cursor-pointer transition-transform active:scale-95"
              title="اضغط لفتح الملف الشخصي الكامل"
            >
              <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-rose-400 to-cyan-400 shadow-md ring-4 ring-white relative group-hover:ring-amber-300 transition-all">
                <img
                  src={hostAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'}
                  alt={hostName}
                  className="w-full h-full object-cover rounded-full bg-slate-100"
                />
              </div>
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-amber-500 text-white p-1 rounded-full shadow-md border border-white">
                <Crown className="w-3.5 h-3.5 fill-white" />
              </div>
            </div>

            {/* Host Name & ID */}
            <div className="space-y-0.5 flex flex-col items-center">
              <h3 
                onClick={() => onOpenFullProfile?.()}
                className="text-base font-black text-slate-900 flex items-center justify-center gap-1.5 cursor-pointer hover:text-amber-600 transition-colors"
                title="اضغط لفتح الملف الشخصي الكامل"
              >
                <span>{hostName}</span>
                <ShieldCheck className="w-4 h-4 text-cyan-600 fill-cyan-100 shrink-0" />
              </h3>
              <div className="flex items-center justify-center gap-2 text-xs font-mono text-slate-500">
                <span>ID: {hostId}</span>
                <span className="text-slate-300">•</span>
                <span className="text-amber-600 font-bold">مضيف الغرفة الصوتية</span>
              </div>

              {/* RECTANGULAR FULL PROFILE BUTTON */}
              <button
                type="button"
                onClick={() => onOpenFullProfile?.()}
                className="inline-flex items-center justify-center gap-1 px-3.5 py-1 bg-slate-900 hover:bg-slate-800 text-amber-300 rounded-lg text-[11px] font-black shadow-xs hover:shadow transition-all cursor-pointer active:scale-95 border border-slate-700/50 mt-1.5"
                title="فتح الملف الشخصي الكامل للمضيف"
              >
                <User className="w-3 h-3 text-amber-400" />
                <span>فتح الملف الشخصي</span>
                <ChevronLeft className="w-2.5 h-2.5 text-slate-400" />
              </button>
            </div>

            {/* BADGES & MEDALS LIST */}
            {currentBadges && currentBadges.length > 0 && (
              <div className="w-full pt-2 pb-2 space-y-1.5 border-y border-slate-100 my-1">
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold px-1">
                  <span className="flex items-center gap-1 text-amber-700 font-black">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>الشارات والألقاب المكتسبة ({currentBadges.length})</span>
                  </span>
                  <button
                    onClick={() => setCurrentBadges(currentBadges.length > 0 ? [] : badges)}
                    className="text-[9px] text-slate-400 hover:text-slate-600 underline cursor-pointer"
                    title="تبديل إخفاء/إظهار الشارات للتجربة"
                  >
                    {currentBadges.length > 0 ? 'إخفاء الشارات' : 'إظهار الشارات'}
                  </button>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-1.5 max-h-24 overflow-y-auto custom-scrollbar p-1">
                  {currentBadges.map((b) => (
                    <span
                      key={b.id}
                      className={`text-[10px] px-2.5 py-1 rounded-full font-black flex items-center gap-1 shadow-2xs shrink-0 border border-slate-200 ${b.bgClass}`}
                    >
                      {b.icon && <span className="text-[11px]">{b.icon}</span>}
                      <span>{b.label}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Action Buttons */}
            <div className={`grid ${canControlMic ? 'grid-cols-5' : 'grid-cols-4'} gap-2 w-full pt-1`}>
              {/* Host Mute Control (Only for Room Owner) */}
              {canControlMic && (
                <button
                  onClick={() => {
                    onToggleHostMute?.();
                    triggerToast(isHostMuted ? 'تم فتح مايك المضيف 🎙️' : 'تم كتم مايك المضيف 🔇');
                  }}
                  className={`py-2 px-1 rounded-lg font-black text-xs flex flex-col items-center justify-center gap-1 transition-all cursor-pointer border ${
                    isHostMuted
                      ? 'bg-rose-50 text-rose-600 border-rose-300'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  }`}
                  title={isHostMuted ? 'فتح مايك المضيف' : 'كتم مايك المضيف'}
                >
                  {isHostMuted ? <MicOff className="w-4 h-4 text-rose-600 stroke-[2.4]" /> : <Mic className="w-4 h-4 text-emerald-600 stroke-[2.4]" />}
                  <span className="text-[10px]">{isHostMuted ? 'إلغاء الكتم' : 'كتم المايك'}</span>
                </button>
              )}

              {/* Follow Button */}
              <button
                onClick={() => {
                  setIsFollowing(!isFollowing);
                  triggerToast(isFollowing ? 'تم إلغاء المتابعة' : 'تمت متابعة المضيف بنجاح! ❤️');
                }}
                className={`py-2 px-1 rounded-lg font-black text-xs flex flex-col items-center justify-center gap-1 transition-all cursor-pointer border ${
                  isFollowing
                    ? 'bg-slate-100 text-slate-700 border-slate-300'
                    : 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 border-amber-400 shadow-xs hover:brightness-105'
                }`}
              >
                {isFollowing ? <UserCheck className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                <span className="text-[10px]">{isFollowing ? 'مُتابَع' : 'متابعة'}</span>
              </button>

              {/* Gift Button */}
              <button
                onClick={() => {
                  onClose();
                  onSendGift?.();
                }}
                className="py-2 px-1 rounded-lg bg-gradient-to-r from-pink-500 to-rose-600 text-white font-black text-xs flex flex-col items-center justify-center gap-1 shadow-xs hover:brightness-105 transition-all cursor-pointer border border-pink-500"
              >
                <Gift className="w-4 h-4 fill-white" />
                <span className="text-[10px]">إرسال هدية</span>
              </button>

              {/* Direct Chat / PM Button */}
              <button
                onClick={() => {
                  triggerToast('تم فتح محادثة خاصة مع المضيف 💬');
                }}
                className="py-2 px-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs flex flex-col items-center justify-center gap-1 hover:bg-slate-100 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-cyan-600" />
                <span className="text-[10px]">خاص</span>
              </button>

              {/* Mention @ Button */}
              <button
                onClick={() => {
                  onClose();
                  onMentionHost?.();
                }}
                className="py-2 px-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs flex flex-col items-center justify-center gap-1 hover:bg-slate-100 transition-all cursor-pointer"
              >
                <AtSign className="w-4 h-4 text-amber-600" />
                <span className="text-[10px]">إشارة @</span>
              </button>
            </div>
          </div>

          {/* Toast Notification Banner */}
          {showToast && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[11px] font-black px-3 py-1.5 rounded-full shadow-lg z-50 animate-bounce">
              {showToast}
            </div>
          )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* FRIENDLY POINTS / INTERACTION BALANCE MODAL */}
      {showFriendlyPointsModal && (
        <FriendlyPointsModal
          isOpen={showFriendlyPointsModal}
          onClose={() => setShowFriendlyPointsModal(false)}
          userName={hostName}
          userAvatar={hostAvatar}
          points={friendlyPoints}
        />
      )}
    </>
  );
};

