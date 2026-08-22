import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Crown, Gift, MessageCircle, AtSign, UserPlus, UserCheck, ShieldCheck, Sparkles, Mic, MicOff, Wrench } from 'lucide-react';
import { BadgeItem } from './VoiceRoomScreen';
import { isDeveloper } from '../lib/roleService';
import { getSecretWindowTheme, getComputedModalStyle } from '../lib/secretCustomizerService';
import { SecretWindowCustomizerModal } from './SecretWindowCustomizerModal';
import { WindowThemeConfig } from '../types/secretCustomizer';

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
  onToggleHostMute?: () => void;
  onSendGift?: () => void;
  onMentionHost?: () => void;
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
  currentAppRole = 'developer',
  isHostMuted = false,
  canControlMic = false,
  onToggleHostMute,
  onSendGift,
  onMentionHost
}) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [showToast, setShowToast] = useState<string | null>(null);
  const [currentBadges, setCurrentBadges] = useState<BadgeItem[]>(badges);
  const [theme, setTheme] = useState<WindowThemeConfig>(() => getSecretWindowTheme('host_profile'));
  const [showSecretCustomizer, setShowSecretCustomizer] = useState(false);

  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ windowId: string; theme: WindowThemeConfig }>;
      if (customEvent.detail?.windowId === 'host_profile') {
        setTheme(customEvent.detail.theme);
      }
    };
    window.addEventListener('window_customizer_updated', handleUpdate);
    return () => window.removeEventListener('window_customizer_updated', handleUpdate);
  }, []);

  const isDevUser = isDeveloper(currentAppRole);

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 2500);
  };

  if (!isOpen) return null;

  return (
    <>
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 bg-transparent flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-auto cursor-default select-none"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 80, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 80, opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          style={getComputedModalStyle(theme)}
          className="w-full max-w-sm rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden text-white relative flex flex-col dir-rtl pointer-events-auto transition-all border"
          dir="rtl"
        >
          {/* Header Ambient Glow Banner */}
          <div className="h-28 bg-gradient-to-b from-amber-500/20 via-purple-900/30 to-black/40 relative flex items-center justify-between px-4 pt-3">
            <span className="text-xs font-black text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-full flex items-center gap-1">
              <Crown className="w-3.5 h-3.5 fill-amber-400 text-amber-300" />
              <span>معاينة بروفايل المضيف</span>
            </span>

            <div className="flex items-center gap-1.5">
              {/* Developer Secret Customizer Button */}
              {isDevUser && (
                <button
                  type="button"
                  onClick={() => setShowSecretCustomizer(true)}
                  className="p-1.5 rounded-full bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/40 border border-cyan-400/50 shadow-[0_0_8px_rgba(6,182,212,0.4)] transition-colors cursor-pointer"
                  title="تخصيص سري للمبرمج"
                >
                  <Wrench className="w-3.5 h-3.5 text-cyan-300" />
                </button>
              )}

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Profile Picture & Info */}
          <div className="px-5 pb-5 -mt-14 flex flex-col items-center text-center space-y-3 relative z-10">
            {/* Clear Profile Picture without clipping */}
            <div className="relative group">
              <div className="w-22 h-22 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-purple-500 to-cyan-400 shadow-[0_0_25px_rgba(245,158,11,0.5)] relative">
                <img
                  src={hostAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'}
                  alt={hostName}
                  className="w-full h-full object-cover rounded-full bg-slate-900"
                />
              </div>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 p-1 rounded-full shadow-md border border-amber-300">
                <Crown className="w-4 h-4 fill-slate-950" />
              </div>
            </div>

            {/* Host Name & ID */}
            <div className="space-y-1">
              <h3 className="text-lg font-black text-white flex items-center justify-center gap-1.5">
                <span>{hostName}</span>
                <ShieldCheck className="w-4 h-4 text-cyan-400 fill-cyan-400/20 shrink-0" />
              </h3>
              <div className="flex items-center justify-center gap-2 text-xs font-mono text-slate-400">
                <span>ID: {hostId}</span>
                <span className="text-slate-600">•</span>
                <span className="text-amber-400 font-bold">مضيف الغرفة الصوتية</span>
              </div>
            </div>

            {/* BADGES & MEDALS LIST (CONDITIONAL RENDERING) */}
            {/* Strictly if badges exist and length > 0, render badges row; otherwise hide completely */}
            {currentBadges && currentBadges.length > 0 && (
              <div className="w-full pt-2 pb-2 space-y-1.5 border-y border-white/10 my-1">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold px-1">
                  <span className="flex items-center gap-1 text-amber-300 font-black">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>الشارات والألقاب المكتسبة ({currentBadges.length})</span>
                  </span>
                  <button
                    onClick={() => setCurrentBadges(currentBadges.length > 0 ? [] : badges)}
                    className="text-[9px] text-slate-500 hover:text-slate-300 underline cursor-pointer"
                    title="تبديل إخفاء/إظهار الشارات للتجربة"
                  >
                    {currentBadges.length > 0 ? 'إخفاء الشارات' : 'إظهار الشارات'}
                  </button>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-1.5 max-h-24 overflow-y-auto custom-scrollbar p-1">
                  {currentBadges.map((b) => (
                    <span
                      key={b.id}
                      className={`text-[10px] px-2.5 py-1 rounded-full font-black flex items-center gap-1 shadow-md shrink-0 border border-white/10 ${b.bgClass}`}
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
                  className={`py-2 px-1 rounded-xl font-black text-xs flex flex-col items-center justify-center gap-1 transition-all cursor-pointer border ${
                    isHostMuted
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-lg shadow-rose-500/10'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                  }`}
                  title={isHostMuted ? 'فتح مايك المضيف' : 'كتم مايك المضيف'}
                >
                  {isHostMuted ? <MicOff className="w-4 h-4 text-rose-400 stroke-[2.4]" /> : <Mic className="w-4 h-4 text-emerald-400 stroke-[2.4]" />}
                  <span className="text-[10px]">{isHostMuted ? 'إلغاء الكتم' : 'كتم المايك'}</span>
                </button>
              )}

              {/* Follow Button */}
              <button
                onClick={() => {
                  setIsFollowing(!isFollowing);
                  triggerToast(isFollowing ? 'تم إلغاء المتابعة' : 'تمت متابعة المضيف بنجاح! ❤️');
                }}
                className={`py-2 px-1 rounded-xl font-black text-xs flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  isFollowing
                    ? 'bg-slate-800 text-slate-300 border border-slate-700'
                    : 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-lg shadow-amber-500/20 hover:brightness-110'
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
                className="py-2 px-1 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-black text-xs flex flex-col items-center justify-center gap-1 shadow-lg shadow-pink-500/20 hover:brightness-110 transition-all cursor-pointer"
              >
                <Gift className="w-4 h-4 fill-white" />
                <span className="text-[10px]">إرسال هدية</span>
              </button>

              {/* Direct Chat / PM Button */}
              <button
                onClick={() => {
                  triggerToast('تم فتح محادثة خاصة مع المضيف 💬');
                }}
                className="py-2 px-1 rounded-xl bg-[#1D273D] border border-white/10 text-cyan-300 font-bold text-xs flex flex-col items-center justify-center gap-1 hover:bg-[#25324D] transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="text-[10px]">خاص</span>
              </button>

              {/* Mention @ Button */}
              <button
                onClick={() => {
                  onClose();
                  onMentionHost?.();
                }}
                className="py-2 px-1 rounded-xl bg-[#1D273D] border border-white/10 text-amber-300 font-bold text-xs flex flex-col items-center justify-center gap-1 hover:bg-[#25324D] transition-all cursor-pointer"
              >
                <AtSign className="w-4 h-4" />
                <span className="text-[10px]">إشارة @</span>
              </button>
            </div>
          </div>

          {/* Toast Notification Banner */}
          {showToast && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 text-[11px] font-black px-3 py-1.5 rounded-full shadow-lg z-50 animate-bounce">
              {showToast}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>

    {/* Secret Customizer Modal for Host Profile */}
    <SecretWindowCustomizerModal
      isOpen={showSecretCustomizer}
      onClose={() => setShowSecretCustomizer(false)}
      windowId="host_profile"
      onThemeChanged={(newTheme) => setTheme(newTheme)}
    />
    </>
  );
};
