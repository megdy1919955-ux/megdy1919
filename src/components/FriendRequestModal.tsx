import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, UserPlus, Check, MessageCircle, Sparkles, Clock, ShieldCheck, Heart } from 'lucide-react';
import {
  isUserFriend,
  sendFriendRequest,
  acceptFriendRequest,
  hasPendingFriendRequest
} from '../lib/friendService';

interface FriendRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: string;
    userId?: string;
    name: string;
    avatar: string;
    country?: string;
    vipTier?: string;
  } | null;
  onFriendshipApproved: (user: any) => void;
}

export const FriendRequestModal: React.FC<FriendRequestModalProps> = ({
  isOpen,
  onClose,
  user,
  onFriendshipApproved
}) => {
  const [requestSent, setRequestSent] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [customGreeting, setCustomGreeting] = useState('مرحباً، أود إضافتك إلى قائمة أصدقائي في سوبر ليجند 🌟');

  useEffect(() => {
    if (user) {
      const alreadyFriend = isUserFriend(user.userId || user.id, user.name);
      if (alreadyFriend) {
        setIsApproved(true);
        setRequestSent(true);
      } else {
        const pending = hasPendingFriendRequest(user.userId || user.id, user.name);
        setRequestSent(pending);
        setIsApproved(false);
      }
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const handleSend = () => {
    sendFriendRequest(user, customGreeting);
    setRequestSent(true);
  };

  const handleSimulateAccept = () => {
    acceptFriendRequest(user);
    setIsApproved(true);
  };

  const handleOpenChat = () => {
    onClose();
    onFriendshipApproved(user);
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 select-none dir-rtl"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-sm bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 relative flex flex-col"
        >
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 p-4 text-white relative">
            <button
              onClick={onClose}
              className="absolute top-3 left-3 w-7 h-7 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-amber-100" />
              <h3 className="text-sm font-black tracking-wide">طلب صداقة لتفعيل الدردشة</h3>
            </div>
            <p className="text-[11px] text-amber-100 mt-1">
              الدردشة الخاصة متاحة حصرياً بين الأصدقاء في سوبر ليجند 💬
            </p>
          </div>

          {/* User Card Info */}
          <div className="p-4 flex flex-col items-center text-center space-y-2">
            <div className="relative">
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'}
                alt={user.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-amber-400 shadow-md"
              />
              <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white p-1 rounded-full shadow-xs">
                <Heart className="w-3.5 h-3.5 fill-white" />
              </div>
            </div>

            <div>
              <h4 className="text-sm font-black text-slate-900">{user.name}</h4>
              <p className="text-[11px] text-slate-400 font-mono">ID: {user.userId || user.id}</p>
            </div>

            {/* Dynamic Status Display */}
            {isApproved ? (
              <div className="w-full bg-emerald-50 border border-emerald-200 rounded-2xl p-3 space-y-2 text-center">
                <div className="flex items-center justify-center gap-1.5 text-emerald-700 font-black text-xs">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                  <span>أنتم الآن أصدقاء! 🎉</span>
                </div>
                <p className="text-[11px] text-emerald-800">
                  تم قبول طلب الصداقة بنجاح. يمكنك الآن الدردشة الخاصة بحرية.
                </p>
                <button
                  onClick={handleOpenChat}
                  className="w-full py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-black rounded-xl shadow-md flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-98"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>دخول الدردشة الخاصة الآن 💬</span>
                </button>
              </div>
            ) : requestSent ? (
              <div className="w-full bg-amber-50 border border-amber-200 rounded-2xl p-3 space-y-2.5 text-center">
                <div className="flex items-center justify-center gap-1.5 text-amber-800 font-black text-xs">
                  <Clock className="w-4 h-4 text-amber-600 animate-spin" />
                  <span>تم إرسال طلب الصداقة بنجاح 📨</span>
                </div>
                <p className="text-[11px] text-amber-900 leading-relaxed font-medium">
                  طلب الصداقة قيد الانتظار لدى <b>{user.name}</b>. عند الموافقة سيتم تفعيل الدردشة فوراً.
                </p>

                {/* Instant Simulator Button */}
                <button
                  onClick={handleSimulateAccept}
                  className="w-full py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 text-xs font-black rounded-xl shadow-sm flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-98"
                >
                  <Sparkles className="w-3.5 h-3.5 text-slate-900" />
                  <span>محاكاة موافقة المستخدم الآن ⚡</span>
                </button>
              </div>
            ) : (
              <div className="w-full space-y-2.5 text-right">
                <p className="text-[11px] text-slate-600 text-center leading-relaxed">
                  أنت وهذا المستخدم لستما أصدقاء حتى الآن. قم بإرسال طلب صداقة للبدء بالدردشة الخاصة بعد موافقته.
                </p>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">
                    رسالة الترحيب مع الطلب:
                  </label>
                  <input
                    type="text"
                    value={customGreeting}
                    onChange={(e) => setCustomGreeting(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500"
                  />
                </div>
                <button
                  onClick={handleSend}
                  className="w-full py-2.5 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-600 hover:to-yellow-600 text-slate-950 text-xs font-black rounded-xl shadow-md flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-98"
                >
                  <UserPlus className="w-4 h-4 text-slate-950" />
                  <span>إرسال طلب الصداقة 🤝</span>
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
