import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Share2,
  Settings,
  Mic,
  MicOff,
  Gift,
  Gamepad2,
  Smile,
  Send,
  Crown,
  Copy,
  Plus,
  Sparkles,
  Coins,
  Power,
  MoreHorizontal,
  Users,
  Grid,
  Mail,
  MessageSquare,
  Pin,
  Pencil,
  ShieldCheck,
  Star,
  Scroll,
  Trophy,
  BarChart2,
  Flame
} from 'lucide-react';
import { FamilyModal } from './FamilyModal';
import { SuperLegendModal } from './SuperLegendModal';
import { RoomInfoModal } from './RoomInfoModal';
import { ProfessionalGiftPanel, GiftItem } from './ProfessionalGiftPanel';

interface VoiceRoomScreenProps {
  roomTitle?: string;
  hostName?: string;
  roomId?: string;
  onClose: () => void;
  onOpenRecharge?: () => void;
}

interface MicSeat {
  id: number;
  userName: string;
  avatar?: string;
  isHost?: boolean;
  isMuted?: boolean;
  isSpeaking?: boolean;
  isEmpty?: boolean;
}

interface ChatMessage {
  id: string;
  userName: string;
  text: string;
  userColor?: string;
}

interface FloatingEffect {
  id: string;
  emoji: string;
  x: number;
}

export const VoiceRoomScreen: React.FC<VoiceRoomScreenProps> = ({
  roomTitle = 'روم صقر اليمن 🦅 - سوالف وتر',
  hostName = 'أميرة الشرق',
  roomId = '7798my-r',
  onClose,
  onOpenRecharge
}) => {
  // Mic Seats setup matching screenshot:
  // Seat 1: Host Top Center ("1. أميرة الشرق")
  // Seat 2 to 6: First Row ("2. سارة الك...", "3. خالد...", "4. ريما...", "5. خالي", "6. خالي")
  // Seat 7 to 12: Second Row ("7. خالي", "8. خالي", "9. خالي", "10. خالي", "11. خالي", "12. خالي")
  const [hostSeat, setHostSeat] = useState<MicSeat>({
    id: 1,
    userName: 'أميرة الشرق',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    isHost: true,
    isMuted: false,
    isSpeaking: true
  });

  const [row1Seats, setRow1Seats] = useState<MicSeat[]>([
    {
      id: 2,
      userName: 'سارة الك...',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
      isMuted: false,
      isSpeaking: true,
      isEmpty: false
    },
    {
      id: 3,
      userName: 'خالد...',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      isMuted: true,
      isSpeaking: false,
      isEmpty: false
    },
    {
      id: 4,
      userName: 'ريما...',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
      isMuted: false,
      isSpeaking: false,
      isEmpty: false
    },
    {
      id: 5,
      userName: '',
      isEmpty: true
    },
    {
      id: 6,
      userName: '',
      isEmpty: true
    }
  ]);

  const [row2Seats, setRow2Seats] = useState<MicSeat[]>([
    { id: 7, userName: '', isEmpty: true },
    { id: 8, userName: '', isEmpty: true },
    { id: 9, userName: '', isEmpty: true },
    { id: 10, userName: '', isEmpty: true },
    { id: 11, userName: '', isEmpty: true },
    { id: 12, userName: '', isEmpty: true }
  ]);

  // User Mic & Balance
  const [isMyMicMuted, setIsMyMicMuted] = useState(false);
  const [userCoins, setUserCoins] = useState('40M');

  // Chat Feed State matching screenshot
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      userName: 'مريم العتيبي',
      text: 'أحلى روم صوتية اليوم 🎵',
      userColor: 'text-amber-300'
    },
    {
      id: 'm2',
      userName: 'أصيل العدني',
      text: 'أهلاً بالجميع، سهرة ممتعة ✨',
      userColor: 'text-amber-300'
    },
    {
      id: 'm3',
      userName: 'صقر الشام',
      text: 'منورين يا شباب الصوت ممتاز جداً 🎙️',
      userColor: 'text-amber-300'
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [showChatInputModal, setShowChatInputModal] = useState(false);

  // Floating Effects
  const [floatingEffects, setFloatingEffects] = useState<FloatingEffect[]>([]);
  const [activeGiftBanner, setActiveGiftBanner] = useState<{
    sender: string;
    giftName: string;
    giftIcon: string;
    target: string;
  } | null>(null);

  // Drawers & Modals
  const [showGiftDrawer, setShowGiftDrawer] = useState(false);
  const [showGamesDrawer, setShowGamesDrawer] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);
  const [showFamilyModal, setShowFamilyModal] = useState(false);
  const [showSuperLegendModal, setShowSuperLegendModal] = useState(false);
  const [showRoomSupportModal, setShowRoomSupportModal] = useState(false);
  const [showRoomInfoModal, setShowRoomInfoModal] = useState(false);

  // Tabbed Statistics Panel State
  const [statsMainTab, setStatsMainTab] = useState<'diamonds' | 'club' | 'charm'>('diamonds');
  const [statsTimeFilter, setStatsTimeFilter] = useState<'24h' | 'all' | 'weekly'>('24h');

  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Toggle seat occupation
  const handleSeatClick = (seatId: number, isRow1: boolean) => {
    if (isRow1) {
      setRow1Seats((prev) =>
        prev.map((seat) => {
          if (seat.id === seatId) {
            if (seat.isEmpty) {
              return {
                ...seat,
                isEmpty: false,
                userName: 'أنا (انضمام)',
                avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
                isMuted: isMyMicMuted,
                isSpeaking: true
              };
            } else if (seat.userName === 'أنا (انضمام)') {
              return { ...seat, isEmpty: true, userName: '' };
            }
          }
          return seat;
        })
      );
    } else {
      setRow2Seats((prev) =>
        prev.map((seat) => {
          if (seat.id === seatId) {
            if (seat.isEmpty) {
              return {
                ...seat,
                isEmpty: false,
                userName: 'أنا (انضمام)',
                avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
                isMuted: isMyMicMuted,
                isSpeaking: true
              };
            } else if (seat.userName === 'أنا (انضمام)') {
              return { ...seat, isEmpty: true, userName: '' };
            }
          }
          return seat;
        })
      );
    }
  };

  // Send message
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim()) return;

    setChatMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        userName: 'أنا (الزائر)',
        text: inputMessage,
        userColor: 'text-amber-300'
      }
    ]);
    setInputMessage('');
    setShowChatInputModal(false);
  };

  const handleSendGift = (giftName: string, giftIcon: string) => {
    setActiveGiftBanner({
      sender: 'أنا (الزائر)',
      giftName,
      giftIcon,
      target: hostSeat.userName
    });

    setChatMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        userName: 'أنا (الزائر)',
        text: `أرسل ${giftName} ${giftIcon} إلى ${hostSeat.userName}`,
        userColor: 'text-pink-400'
      }
    ]);

    // Keep gift panel persistent (do not auto-close on gift send)

    setTimeout(() => {
      setActiveGiftBanner(null);
    }, 4000);
  };

  const handleSendReaction = (emoji: string) => {
    const newEffect: FloatingEffect = {
      id: Date.now().toString() + Math.random(),
      emoji,
      x: Math.floor(Math.random() * 60) + 20
    };
    setFloatingEffects((prev) => [...prev, newEffect]);

    setTimeout(() => {
      setFloatingEffects((prev) => prev.filter((item) => item.id !== newEffect.id));
    }, 2200);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#0B0E17] text-white font-sans flex flex-col justify-between overflow-hidden select-none"
      dir="rtl"
    >
      {/* GLOW ATMOSPHERE BACKGROUND */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,rgba(30,27,75,0.6),transparent_70%)] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* 1. TOP HEADER BAR */}
      <div className="relative z-20 pt-3 px-3 pb-2 space-y-2">
        {/* Row 1 Header Icons & Room Title Pill */}
        <div className="flex items-center justify-between gap-2">
          {/* Right Section (in RTL: 1st in DOM): Room Title & Host Avatar Capsule (Clickable for Room Admin & Info Panel) */}
          <div
            onClick={() => setShowRoomInfoModal(true)}
            className="bg-[#1A2132]/90 border border-white/10 rounded-full py-1 pr-1.5 pl-4 flex items-center gap-2 max-w-[62%] shadow-md cursor-pointer hover:border-amber-400/50 hover:bg-[#20293f] transition-all active:scale-95"
            title="انقر لعرض معلومات الغرفة ولوحة المسؤولين"
          >
            {/* Host Avatar on Right Edge */}
            <div className="w-8 h-8 rounded-full border border-cyan-400 overflow-hidden shrink-0">
              <img
                src={hostSeat.avatar}
                alt={hostSeat.userName}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col min-w-0">
              <span className="text-xs font-black text-white truncate leading-tight flex items-center gap-1">
                <span>{roomTitle}</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400 truncate flex items-center gap-1">
                <span>ID: {roomId}</span>
                <span className="text-[9px] text-amber-300 font-bold bg-amber-500/10 px-1 rounded">مسؤول</span>
              </span>
            </div>
          </div>

          {/* Left Section (in RTL: 2nd in DOM): Listener Count, Menu, Power */}
          <div className="flex items-center gap-1.5">
            {/* Listener Count Pill */}
            <div className="bg-[#1A2132] border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold text-slate-200 shadow-sm">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-mono text-xs">18</span>
            </div>

            {/* More Options Button */}
            <button
              onClick={() => setShowSettingsDrawer(true)}
              className="w-9 h-9 rounded-full bg-[#1A2132] hover:bg-slate-700/50 border border-white/10 flex items-center justify-center text-slate-200 cursor-pointer relative"
            >
              <MoreHorizontal className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 ring-2 ring-[#0B0E17]" />
            </button>

            {/* Power/Close Button */}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-[#1A2132] hover:bg-red-900/40 border border-white/10 flex items-center justify-center text-slate-200 cursor-pointer transition-colors shadow-md"
            >
              <Power className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Row 2 Sub-Header Quick Badges (Positioned slightly higher, reversed order, and logic mapped) */}
        <div className="flex flex-row-reverse items-center justify-between gap-1 -mt-1 pt-0 pb-0.5">
          {/* 1. Right: Family / الأسرة Badge -> Opens FamilyModal */}
          <button
            onClick={() => setShowFamilyModal(true)}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-purple-100 px-1.5 py-0.5 rounded-full border border-purple-300/40 flex items-center gap-0.5 text-[8px] font-black shadow-2xs hover:border-purple-300 transition-colors cursor-pointer"
            title="عائلة المستخدم والقبيلة"
          >
            <Users className="w-2.5 h-2.5 text-purple-200" />
            <span>العائلة</span>
          </button>

          {/* 2. Star / الأساطير Badge -> Opens SuperLegendModal (Top Supporters) */}
          <button
            onClick={() => setShowSuperLegendModal(true)}
            className="bg-[#151D2C] border border-amber-500/40 px-1.5 py-0.5 rounded-full flex items-center gap-0.5 text-[8px] font-black text-amber-300 shadow-2xs hover:border-amber-400 transition-colors cursor-pointer"
            title="قائمة كبار الداعمين والأساطير"
          >
            <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
            <span>الأساطير</span>
          </button>

          {/* 3. Gift Log Badge -> Opens Gift Drawer */}
          <button
            onClick={() => setShowGiftDrawer(true)}
            className="bg-[#151D2C] border border-white/10 px-1.5 py-0.5 rounded-full flex items-center gap-0.5 text-[8px] font-black text-pink-300 shadow-2xs hover:border-pink-500/50 transition-colors cursor-pointer"
            title="سجل الهدايا المرسلة"
          >
            <Gift className="w-2.5 h-2.5 text-pink-400" />
            <span>السجل</span>
          </button>

          {/* 4. Left: Diamond / Total Room Support -> Opens Room Support Stats Modal */}
          <button
            onClick={() => setShowRoomSupportModal(true)}
            className="bg-[#151D2C] border border-cyan-500/40 px-1.5 py-0.5 rounded-full flex items-center gap-0.5 text-[8px] font-mono font-black text-cyan-300 shadow-2xs cursor-pointer hover:border-cyan-400 transition-colors"
            title="إحصائيات الدعم الكلي في هذه الغرفة"
          >
            <span className="text-[9px]">💎</span>
            <span>{userCoins}</span>
          </button>
        </div>
      </div>

      {/* 2. MIC ARRANGEMENT SECTION (Compacted for optimal screen balance) */}
      <div className="relative z-20 px-2 py-1 space-y-2">
        {/* SEAT #1: HOST MIC (CENTER TOP PROMINENT) */}
        <div className="flex flex-col items-center justify-center pt-0.5">
          <div className="relative cursor-pointer group">
            {/* Glowing Ring Effect */}
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-amber-400 blur-xs opacity-80 animate-pulse" />

            {/* Avatar Circle Container */}
            <div className="relative w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr from-cyan-400 via-emerald-400 to-amber-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              {/* Crown sitting on top */}
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-10">
                <Crown className="w-5 h-5 text-amber-300 fill-amber-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
              </div>

              <img
                src={hostSeat.avatar}
                alt={hostSeat.userName}
                className="w-full h-full object-cover rounded-full"
              />

              {/* Green Active Mic Badge at Bottom Right */}
              <div className="absolute bottom-0 right-0 w-4.5 h-4.5 rounded-full bg-emerald-500 border border-[#0B0E17] flex items-center justify-center text-slate-950 shadow-xs">
                <Mic className="w-2.5 h-2.5 stroke-[3]" />
              </div>
            </div>
          </div>

          {/* Brown Gold Name Badge Pill */}
          <div className="mt-1 bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 border border-amber-500/40 px-2.5 py-0.2 rounded-full text-center shadow-xs">
            <span className="text-[10px] font-black text-amber-200">
              {hostSeat.isEmpty ? hostSeat.id : hostSeat.userName}
            </span>
          </div>
        </div>

        {/* ROW 1: GUEST MICS (SEATS 2 TO 6 - HORIZONTAL 5 MICS) */}
        <div className="grid grid-cols-5 gap-1 px-1">
          {row1Seats.map((seat) => (
            <div
              key={seat.id}
              onClick={() => handleSeatClick(seat.id, true)}
              className="flex flex-col items-center space-y-0.5 cursor-pointer group"
            >
              <div className="relative">
                {seat.isEmpty ? (
                  /* Dashed Gold Circle Empty Seat */
                  <div className="w-8.5 h-8.5 rounded-full border-2 border-dashed border-amber-500/50 bg-[#121824]/60 flex items-center justify-center transition-transform group-hover:scale-105">
                    <Plus className="w-3.5 h-3.5 text-amber-400 stroke-[2.5]" />
                  </div>
                ) : (
                  /* Occupied Mic Seat */
                  <div className="w-8.5 h-8.5 rounded-full p-0.5 bg-gradient-to-tr from-cyan-400 to-emerald-400 relative transition-transform group-hover:scale-105 shadow-xs">
                    <img
                      src={seat.avatar}
                      alt={seat.userName}
                      className="w-full h-full object-cover rounded-full"
                    />
                    {/* Mic Icon Badge */}
                    <div
                      className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center border border-[#0B0E17] shadow-2xs ${
                        seat.isMuted ? 'bg-red-500 text-white' : 'bg-emerald-500 text-slate-950'
                      }`}
                    >
                      {seat.isMuted ? (
                        <MicOff className="w-2 h-2 stroke-[2.5]" />
                      ) : (
                        <Mic className="w-2 h-2 stroke-[3]" />
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Label */}
              <span className="text-[9px] font-bold text-slate-200 truncate max-w-[48px] text-center leading-tight">
                {seat.isEmpty ? seat.id : seat.userName}
              </span>
            </div>
          ))}
        </div>

        {/* ROW 2: SMALLER EMPTY MICS (SEATS 7 TO 12 - HORIZONTAL 6 MICS) */}
        <div className="grid grid-cols-6 gap-1 px-1">
          {row2Seats.map((seat) => (
            <div
              key={seat.id}
              onClick={() => handleSeatClick(seat.id, false)}
              className="flex flex-col items-center space-y-0.5 cursor-pointer group"
            >
              <div className="relative">
                {seat.isEmpty ? (
                  <div className="w-7 h-7 rounded-full border border-dashed border-amber-500/40 bg-[#121824]/50 flex items-center justify-center transition-transform group-hover:scale-105">
                    <Plus className="w-3 h-3 text-amber-400/80 stroke-[2]" />
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-full p-0.5 bg-gradient-to-tr from-cyan-400 to-indigo-500 relative shadow-2xs">
                    <img
                      src={seat.avatar}
                      alt={seat.userName}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                )}
              </div>

              <span className="text-[8px] font-bold text-slate-300 truncate max-w-[40px] text-center leading-tight">
                {seat.isEmpty ? seat.id : seat.userName}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* FLOATING GIFT BANNER OVERLAY */}
      <AnimatePresence>
        {activeGiftBanner && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="absolute top-1/3 left-4 right-4 z-40 bg-gradient-to-r from-amber-600/90 via-purple-700/90 to-amber-600/90 border-2 border-amber-300 p-3 rounded-2xl shadow-[0_0_30px_rgba(245,158,11,0.6)] backdrop-blur-md flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="text-4xl animate-bounce">{activeGiftBanner.giftIcon}</span>
              <div>
                <div className="text-xs font-black text-amber-200">
                  {activeGiftBanner.sender} 🌟
                </div>
                <div className="text-sm font-black text-white">
                  أرسل <span className="text-amber-300 font-mono font-black">{activeGiftBanner.giftName}</span> إلى {activeGiftBanner.target}
                </div>
              </div>
            </div>
            <Sparkles className="w-8 h-8 text-amber-300 animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING EMOJI ANIMATIONS */}
      {floatingEffects.map((effect) => (
        <motion.div
          key={effect.id}
          initial={{ opacity: 1, y: 0, scale: 0.8 }}
          animate={{ opacity: 0, y: -220, scale: 1.5 }}
          transition={{ duration: 2, ease: 'easeOut' }}
          className="absolute bottom-24 text-3xl pointer-events-none z-30"
          style={{ right: `${effect.x}%` }}
        >
          {effect.emoji}
        </motion.div>
      ))}

      {/* 4. LIVE CHAT MESSAGES AREA WITH MOVING HOST ANNOUNCEMENT INSIDE CHAT */}
      <div className="flex-1 px-3 py-1 flex flex-col justify-end overflow-hidden relative z-20">
        <div className="max-h-48 overflow-y-auto space-y-1.5 no-scrollbar pr-1">
          {/* MOVING HOST ANNOUNCEMENT BOARD INSIDE CHAT STREAM */}
          <div className="bg-gradient-to-r from-amber-950/80 via-amber-900/90 to-amber-950/80 border border-amber-500/50 rounded-2xl p-2.5 mb-2 shadow-lg backdrop-blur-md relative overflow-hidden">
            <div className="flex items-center justify-between gap-1 border-b border-amber-500/30 pb-1 mb-1">
              <div className="flex items-center gap-1.5 text-amber-300 font-black text-[11px]">
                <Crown className="w-4 h-4 fill-amber-400 text-amber-300 animate-bounce" />
                <span>[دخول المضيف] لوحة إعلانات ودليل الغرفة</span>
              </div>
              <span className="text-[10px] bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full font-black shadow-xs">
                أميرة الشرق 👑
              </span>
            </div>

            {/* MOVING TICKER TEXT INSIDE CHAT */}
            <div className="overflow-hidden relative w-full h-5 flex items-center">
              <motion.div
                animate={{ x: ['100%', '-100%'] }}
                transition={{ repeat: Infinity, duration: 15, ease: 'linear' }}
                className="whitespace-nowrap text-[11px] font-bold text-amber-100 flex items-center gap-2 absolute"
              >
                <span>📜 <b>دليل واستخدام الغرفة:</b> أهلاً ومرحباً بالجميع! يرجى الالتزام بالاحترام المتبادل على المايكات، ويمنع استخدام الكلمات غير اللائقة. استمتعوا بالأمسية الموسيقية 🎵</span>
              </motion.div>
            </div>
          </div>

          {/* REGULAR CHAT MESSAGES */}
          {chatMessages.map((msg) => (
            <div key={msg.id} className="text-xs">
              <div className="bg-[#121827]/80 border border-white/5 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-sm max-w-[90%]">
                <span className={`font-black ${msg.userColor || 'text-amber-300'}`}>
                  {msg.userName}:
                </span>
                <span className="text-slate-100 font-bold text-xs">{msg.text}</span>
              </div>
            </div>
          ))}
          <div ref={chatBottomRef} />
        </div>
      </div>

      {/* 5. BOTTOM CONTROL DOCK BAR */}
      <div className="relative z-30 px-3 py-3 bg-[#0D121F]/90 border-t border-white/10 backdrop-blur-md flex items-center justify-between gap-1">
        {/* Far Right (1st in DOM): Chat Input Popup Toggle Button */}
        <button
          onClick={() => setShowChatInputModal(true)}
          className="w-10 h-10 rounded-full bg-[#1A2234] hover:bg-[#25314A] text-slate-300 flex items-center justify-center cursor-pointer transition-colors shadow-md relative"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-[#0D121F]" />
        </button>

        {/* 2nd from Right (2nd in DOM): Mic Toggle Button */}
        <button
          onClick={() => setIsMyMicMuted(!isMyMicMuted)}
          className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-colors shadow-md ${
            isMyMicMuted ? 'bg-red-500/80 text-white' : 'bg-[#1A2234] text-slate-300 hover:bg-[#25314A]'
          }`}
        >
          {isMyMicMuted ? (
            <MicOff className="w-5 h-5 stroke-[2.5]" />
          ) : (
            <Mic className="w-5 h-5 stroke-[2.5]" />
          )}
        </button>

        {/* 3rd from Right (3rd in DOM): Emoji Button */}
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="w-10 h-10 rounded-full bg-[#1A2234] hover:bg-[#25314A] text-yellow-300 flex items-center justify-center cursor-pointer transition-colors shadow-md relative"
        >
          <Smile className="w-5 h-5" />
        </button>

        {/* Center (4th in DOM): Prominent Glowing Gift Box Button */}
        <button
          onClick={() => setShowGiftDrawer(true)}
          className="w-13 h-13 rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-amber-400 p-0.5 flex items-center justify-center cursor-pointer shadow-[0_0_20px_rgba(236,72,153,0.8)] transition-transform hover:scale-110 -translate-y-1 animate-pulse"
        >
          <div className="w-full h-full rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
            <Gift className="w-6 h-6 text-white fill-white" />
          </div>
        </button>

        {/* 3rd from Left (5th in DOM): Envelope Mail Button */}
        <button className="w-10 h-10 rounded-full bg-[#1A2234] hover:bg-[#25314A] text-slate-300 flex items-center justify-center cursor-pointer transition-colors shadow-md">
          <Mail className="w-5 h-5" />
        </button>

        {/* 2nd from Left (6th in DOM): Gamepad Games Button (Pink Glow) */}
        <button
          onClick={() => setShowGamesDrawer(true)}
          className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-600 via-purple-600 to-pink-500 text-white flex items-center justify-center cursor-pointer shadow-[0_0_12px_rgba(236,72,153,0.5)] transition-transform hover:scale-105"
        >
          <Gamepad2 className="w-5 h-5" />
        </button>

        {/* Far Left (7th in DOM): Grid Menu Button */}
        <button
          onClick={() => setShowSettingsDrawer(true)}
          className="w-10 h-10 rounded-full bg-[#1A2234] hover:bg-[#25314A] text-slate-300 flex items-center justify-center cursor-pointer transition-colors shadow-md"
        >
          <Grid className="w-5 h-5" />
        </button>
      </div>

      {/* CHAT INPUT MODAL POPUP */}
      <AnimatePresence>
        {showChatInputModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-end justify-center p-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              dir="rtl"
              className="w-full max-w-md bg-[#121827] border border-white/20 p-3 rounded-2xl shadow-2xl"
            >
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                {/* Right side: Close (X) button & Yellow Send button */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowChatInputModal(false)}
                    className="p-2 text-slate-400 hover:text-white rounded-xl bg-[#1A2132] hover:bg-red-950/40 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs cursor-pointer shadow-md hover:brightness-105"
                  >
                    إرسال
                  </button>
                </div>

                {/* Left side: Message Input Box */}
                <input
                  type="text"
                  autoFocus
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="إرسال رسالة للشات..."
                  className="flex-1 bg-[#1A2132] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                />
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EMOJI QUICK PICKER POPUP */}
      <AnimatePresence>
        {showEmojiPicker && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-16 right-16 z-40 bg-[#121827] border border-white/20 p-2 rounded-2xl shadow-xl flex items-center gap-2"
          >
            {['💖', '🔥', '🦅', '👑', '👏', '🎉', '🌹'].map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  handleSendReaction(emoji);
                  setShowEmojiPicker(false);
                }}
                className="text-2xl hover:scale-125 transition-transform p-1 cursor-pointer"
              >
                {emoji}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* PROFESSIONAL GIFTS PANEL */}
      <ProfessionalGiftPanel
        isOpen={showGiftDrawer}
        onClose={() => setShowGiftDrawer(false)}
        userCoins={userCoins}
        onOpenRecharge={onOpenRecharge}
        onSendGift={(gift, quantity, targetName) => {
          handleSendGift(`${gift.name} (x${quantity}) [إلى: ${targetName}]`, gift.icon);
        }}
        seats={[...row1Seats, ...row2Seats]}
      />

      {/* MINI-GAMES DRAWER */}
      <AnimatePresence>
        {showGamesDrawer && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-end justify-center">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="w-full max-w-md bg-[#121827] border-t-2 border-indigo-500/60 rounded-t-3xl p-4 space-y-4 text-white"
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Gamepad2 className="w-5 h-5 text-indigo-400" />
                  <h2 className="text-base font-black text-indigo-300">الألعاب التفاعلية بالروم</h2>
                </div>
                <button
                  onClick={() => setShowGamesDrawer(false)}
                  className="p-1.5 rounded-full bg-white/10 text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-4 rounded-2xl border border-white/20 text-center space-y-2 cursor-pointer hover:scale-102 transition-transform">
                  <div className="text-3xl">🎲</div>
                  <h3 className="text-sm font-black">LUDO التنافسية</h3>
                  <p className="text-[10px] text-indigo-100 font-bold">العب مع أعضاء المايك الآن</p>
                </div>

                <div className="bg-gradient-to-br from-amber-600 to-orange-600 p-4 rounded-2xl border border-white/20 text-center space-y-2 cursor-pointer hover:scale-102 transition-transform">
                  <div className="text-3xl">🎡</div>
                  <h3 className="text-sm font-black">عجلة الحظ الملكية</h3>
                  <p className="text-[10px] text-amber-100 font-bold">اربح ملايين الكوينز</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ROOM SETTINGS DRAWER */}
      <AnimatePresence>
        {showSettingsDrawer && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-end justify-center">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="w-full max-w-md bg-[#121827] border-t-2 border-slate-700 rounded-t-3xl p-4 space-y-3 text-white"
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <h2 className="text-base font-black text-amber-300">إعدادات الغرفة</h2>
                <button
                  onClick={() => setShowSettingsDrawer(false)}
                  className="p-1.5 rounded-full bg-white/10 text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                <button className="w-full p-3 bg-[#1A2234] rounded-2xl flex items-center justify-between text-xs font-bold hover:bg-slate-700">
                  <span>قفل المايكات الفارغة</span>
                  <span className="text-emerald-400">مفتوح</span>
                </button>
                <button className="w-full p-3 bg-[#1A2234] rounded-2xl flex items-center justify-between text-xs font-bold hover:bg-slate-700">
                  <span>جودة الصوت المباشر</span>
                  <span className="text-amber-300">HD فائقة النقاء</span>
                </button>
                <button
                  onClick={() => {
                    setShowSettingsDrawer(false);
                    onClose();
                  }}
                  className="w-full p-3 bg-red-600/80 rounded-2xl text-center text-xs font-black text-white hover:bg-red-600 cursor-pointer"
                >
                  مغادرة وإغلاق الغرفة
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TABBED STATISTICS PANEL (Diamond Badge / Support Stats Click) */}
      <AnimatePresence>
        {showRoomSupportModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-end justify-center p-0 sm:p-4">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="w-full max-w-md bg-[#121827] border-t-2 border-cyan-500/60 rounded-t-3xl sm:rounded-3xl p-4 space-y-3.5 text-white shadow-2xl max-h-[85vh] flex flex-col justify-between"
            >
              {/* Header & Main Tabs Row */}
              <div className="space-y-3 shrink-0">
                <div className="flex items-center justify-between pb-1 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-400" />
                    <h2 className="text-base font-black text-amber-300">إحصائيات ولوحة متصدري الغرفة</h2>
                  </div>
                  <button
                    onClick={() => setShowRoomSupportModal(false)}
                    className="p-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* 3 Main Tabs: المساهمات (Diamonds), النادي (Club), الجاذبية (Charm) */}
                <div className="grid grid-cols-3 gap-1 bg-[#1A2234] p-1 rounded-2xl border border-white/10 text-center">
                  <button
                    onClick={() => {
                      setStatsMainTab('diamonds');
                      setStatsTimeFilter('24h');
                    }}
                    className={`py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      statsMainTab === 'diamonds'
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md scale-[1.02]'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    💎 المساهمات
                  </button>

                  <button
                    onClick={() => {
                      setStatsMainTab('club');
                      setStatsTimeFilter('24h');
                    }}
                    className={`py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      statsMainTab === 'club'
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md scale-[1.02]'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    🛡️ النادي
                  </button>

                  <button
                    onClick={() => {
                      setStatsMainTab('charm');
                      setStatsTimeFilter('24h');
                    }}
                    className={`py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      statsMainTab === 'charm'
                        ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-md scale-[1.02]'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    ✨ الجاذبية
                  </button>
                </div>

                {/* Sub-time filters row */}
                <div className="flex items-center justify-center gap-2 pt-0.5">
                  {statsMainTab === 'club' ? (
                    <>
                      <button
                        onClick={() => setStatsTimeFilter('24h')}
                        className={`px-3 py-1 rounded-full text-[11px] font-black transition-all cursor-pointer ${
                          statsTimeFilter === '24h'
                            ? 'bg-purple-600 text-white ring-1 ring-purple-300'
                            : 'bg-white/5 text-slate-400 hover:text-white'
                        }`}
                      >
                        24 ساعة
                      </button>
                      <button
                        onClick={() => setStatsTimeFilter('weekly')}
                        className={`px-3 py-1 rounded-full text-[11px] font-black transition-all cursor-pointer ${
                          statsTimeFilter === 'weekly'
                            ? 'bg-purple-600 text-white ring-1 ring-purple-300'
                            : 'bg-white/5 text-slate-400 hover:text-white'
                        }`}
                      >
                        أسبوعي
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setStatsTimeFilter('24h')}
                        className={`px-3 py-1 rounded-full text-[11px] font-black transition-all cursor-pointer ${
                          statsTimeFilter === '24h'
                            ? statsMainTab === 'diamonds' ? 'bg-cyan-500 text-slate-950 font-black' : 'bg-pink-600 text-white'
                            : 'bg-white/5 text-slate-400 hover:text-white'
                        }`}
                      >
                        24 ساعة
                      </button>
                      <button
                        onClick={() => setStatsTimeFilter('all')}
                        className={`px-3 py-1 rounded-full text-[11px] font-black transition-all cursor-pointer ${
                          statsTimeFilter === 'all'
                            ? statsMainTab === 'diamonds' ? 'bg-cyan-500 text-slate-950 font-black' : 'bg-pink-600 text-white'
                            : 'bg-white/5 text-slate-400 hover:text-white'
                        }`}
                      >
                        الإجمالي
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Leaderboard List Content */}
              <div className="overflow-y-auto no-scrollbar space-y-2 pr-0.5 my-1 flex-1 min-h-[220px]">
                {/* 1. DIAMONDS LEADERBOARD LIST */}
                {statsMainTab === 'diamonds' && (
                  (statsTimeFilter === '24h' ? [
                    { rank: 1, name: 'الأمير أسامة (الرئيس)', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100', level: '88', vip: 'VIP8', nLevel: 'N.15', val: '18,500,000 💎' },
                    { rank: 2, name: 'سارة الكابيتانو', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=100', level: '75', vip: 'VIP6', nLevel: 'N.12', val: '12,200,000 💎' },
                    { rank: 3, name: 'صقر الشام', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100', level: '64', vip: 'VIP5', nLevel: 'N.10', val: '9,300,000 💎' },
                    { rank: 4, name: 'الملك الكويتي', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100', level: '52', vip: 'VIP4', nLevel: 'N.8', val: '5,100,000 💎' },
                    { rank: 5, name: 'الدكتورة هناء', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100', level: '48', vip: 'VIP3', nLevel: 'N.6', val: '3,400,000 💎' }
                  ] : [
                    { rank: 1, name: 'السلطان قابوس', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100', level: '99', vip: 'VIP9', nLevel: 'N.20', val: '120,500,000 💎' },
                    { rank: 2, name: 'الأمير أسامة (الرئيس)', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100', level: '88', vip: 'VIP8', nLevel: 'N.15', val: '95,000,000 💎' },
                    { rank: 3, name: 'شيخ الشباب', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100', level: '82', vip: 'VIP7', nLevel: 'N.14', val: '68,200,000 💎' },
                    { rank: 4, name: 'لورد بغداد', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100', level: '71', vip: 'VIP6', nLevel: 'N.11', val: '42,000,000 💎' }
                  ]).map((item) => (
                    <div
                      key={item.rank}
                      className="p-2 bg-[#1A2234] border border-white/10 rounded-2xl flex items-center justify-between text-xs hover:border-cyan-500/40 transition-colors"
                    >
                      <div className="flex items-center gap-2 overflow-hidden max-w-[70%]">
                        {/* Rank Badge (#1 Gold, #2 Silver, #3 Bronze) */}
                        <div
                          className={`w-7 h-7 shrink-0 rounded-xl flex items-center justify-center font-black text-xs shadow-md border ${
                            item.rank === 1
                              ? 'bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 border-amber-200 ring-2 ring-amber-400/50'
                              : item.rank === 2
                              ? 'bg-gradient-to-tr from-slate-300 to-slate-100 text-slate-950 border-slate-200 ring-1 ring-slate-300'
                              : item.rank === 3
                              ? 'bg-gradient-to-tr from-amber-700 to-amber-500 text-white border-amber-600'
                              : 'bg-white/10 text-slate-300 border-white/5'
                          }`}
                        >
                          {item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : item.rank === 3 ? '🥉' : item.rank}
                        </div>

                        {/* Avatar */}
                        <img
                          src={item.avatar}
                          alt={item.name}
                          className="w-8 h-8 rounded-full object-cover border border-cyan-400/50 shrink-0"
                        />

                        {/* Single Line User Metadata: Name, Level, VIP, N-Level */}
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="font-black text-slate-100 truncate text-[11px]">{item.name}</span>
                          <span className="bg-purple-600/90 text-white text-[8px] font-black px-1.5 py-0.2 rounded-md shrink-0">
                            Lv.{item.level}
                          </span>
                          <span className="bg-amber-500/90 text-slate-950 text-[8px] font-black px-1.5 py-0.2 rounded-md shrink-0">
                            {item.vip}
                          </span>
                          <span className="bg-emerald-600/90 text-white text-[8px] font-black px-1.5 py-0.2 rounded-md shrink-0">
                            {item.nLevel}
                          </span>
                        </div>
                      </div>

                      {/* Value */}
                      <span className="font-mono font-black text-cyan-300 text-xs dir-ltr shrink-0 pr-1">
                        {item.val}
                      </span>
                    </div>
                  ))
                )}

                {/* 2. CLUB RANKING LIST */}
                {statsMainTab === 'club' && (
                  (statsTimeFilter === '24h' ? [
                    { rank: 1, name: 'نادي الفرسان الذهب', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100', level: '80', vip: 'VIP8', nLevel: 'N.16', val: '240,000 نقطة' },
                    { rank: 2, name: 'نادي الملوك والعظماء', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100', level: '72', vip: 'VIP7', nLevel: 'N.14', val: '180,000 نقطة' },
                    { rank: 3, name: 'نادي النجوم الأسطوري', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=100', level: '65', vip: 'VIP5', nLevel: 'N.11', val: '135,000 نقطة' }
                  ] : [
                    { rank: 1, name: 'نادي الصقور العالمية', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100', level: '90', vip: 'VIP9', nLevel: 'N.18', val: '1,250,000 نقطة' },
                    { rank: 2, name: 'نادي الفرسان الذهب', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100', level: '80', vip: 'VIP8', nLevel: 'N.16', val: '980,000 نقطة' },
                    { rank: 3, name: 'نادي عشاق الطرب', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100', level: '68', vip: 'VIP6', nLevel: 'N.12', val: '740,000 نقطة' }
                  ]).map((item) => (
                    <div
                      key={item.rank}
                      className="p-2 bg-[#1A2234] border border-white/10 rounded-2xl flex items-center justify-between text-xs hover:border-purple-500/40 transition-colors"
                    >
                      <div className="flex items-center gap-2 overflow-hidden max-w-[70%]">
                        <div
                          className={`w-7 h-7 shrink-0 rounded-xl flex items-center justify-center font-black text-xs shadow-md border ${
                            item.rank === 1
                              ? 'bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 border-amber-200'
                              : item.rank === 2
                              ? 'bg-gradient-to-tr from-slate-300 to-slate-100 text-slate-950 border-slate-200'
                              : 'bg-gradient-to-tr from-amber-700 to-amber-500 text-white border-amber-600'
                          }`}
                        >
                          {item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : '🥉'}
                        </div>

                        <img
                          src={item.avatar}
                          alt={item.name}
                          className="w-8 h-8 rounded-full object-cover border border-purple-400/50 shrink-0"
                        />

                        <div className="flex items-center gap-1.5 truncate">
                          <span className="font-black text-slate-100 truncate text-[11px]">{item.name}</span>
                          <span className="bg-purple-600/90 text-white text-[8px] font-black px-1.5 py-0.2 rounded-md shrink-0">
                            Lv.{item.level}
                          </span>
                          <span className="bg-amber-500/90 text-slate-950 text-[8px] font-black px-1.5 py-0.2 rounded-md shrink-0">
                            {item.vip}
                          </span>
                          <span className="bg-emerald-600/90 text-white text-[8px] font-black px-1.5 py-0.2 rounded-md shrink-0">
                            {item.nLevel}
                          </span>
                        </div>
                      </div>

                      <span className="font-mono font-black text-purple-300 text-xs dir-ltr shrink-0 pr-1">
                        {item.val}
                      </span>
                    </div>
                  ))
                )}

                {/* 3. CHARM RANKING LIST */}
                {statsMainTab === 'charm' && (
                  (statsTimeFilter === '24h' ? [
                    { rank: 1, name: 'وردة الأمل', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=100', level: '70', vip: 'VIP7', nLevel: 'N.13', val: '2,850,000 ✨' },
                    { rank: 2, name: 'ليلى الملكة', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100', level: '66', vip: 'VIP6', nLevel: 'N.11', val: '1,920,000 ✨' },
                    { rank: 3, name: 'نغم السعادة', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100', level: '59', vip: 'VIP5', nLevel: 'N.9', val: '1,410,000 ✨' },
                    { rank: 4, name: 'شمس الأصيل', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100', level: '45', vip: 'VIP3', nLevel: 'N.6', val: '890,000 ✨' }
                  ] : [
                    { rank: 1, name: 'أميرة القلوب', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=100', level: '92', vip: 'VIP9', nLevel: 'N.19', val: '28,500,000 ✨' },
                    { rank: 2, name: 'وردة الأمل', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100', level: '70', vip: 'VIP7', nLevel: 'N.13', val: '19,200,000 ✨' },
                    { rank: 3, name: 'ملكة الشرق', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100', level: '68', vip: 'VIP6', nLevel: 'N.12', val: '14,800,000 ✨' }
                  ]).map((item) => (
                    <div
                      key={item.rank}
                      className="p-2 bg-[#1A2234] border border-white/10 rounded-2xl flex items-center justify-between text-xs hover:border-pink-500/40 transition-colors"
                    >
                      <div className="flex items-center gap-2 overflow-hidden max-w-[70%]">
                        <div
                          className={`w-7 h-7 shrink-0 rounded-xl flex items-center justify-center font-black text-xs shadow-md border ${
                            item.rank === 1
                              ? 'bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 border-amber-200'
                              : item.rank === 2
                              ? 'bg-gradient-to-tr from-slate-300 to-slate-100 text-slate-950 border-slate-200'
                              : item.rank === 3
                              ? 'bg-gradient-to-tr from-amber-700 to-amber-500 text-white border-amber-600'
                              : 'bg-white/10 text-slate-300 border-white/5'
                          }`}
                        >
                          {item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : item.rank === 3 ? '🥉' : item.rank}
                        </div>

                        <img
                          src={item.avatar}
                          alt={item.name}
                          className="w-8 h-8 rounded-full object-cover border border-pink-400/50 shrink-0"
                        />

                        <div className="flex items-center gap-1.5 truncate">
                          <span className="font-black text-slate-100 truncate text-[11px]">{item.name}</span>
                          <span className="bg-purple-600/90 text-white text-[8px] font-black px-1.5 py-0.2 rounded-md shrink-0">
                            Lv.{item.level}
                          </span>
                          <span className="bg-amber-500/90 text-slate-950 text-[8px] font-black px-1.5 py-0.2 rounded-md shrink-0">
                            {item.vip}
                          </span>
                          <span className="bg-emerald-600/90 text-white text-[8px] font-black px-1.5 py-0.2 rounded-md shrink-0">
                            {item.nLevel}
                          </span>
                        </div>
                      </div>

                      <span className="font-mono font-black text-pink-300 text-xs dir-ltr shrink-0 pr-1">
                        {item.val}
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* Bottom Action / Footer Bar */}
              <div className="pt-2 border-t border-white/10 shrink-0 space-y-2">
                {statsMainTab === 'diamonds' && (
                  <>
                    <div className="flex items-center justify-between text-xs bg-slate-900/80 px-3 py-1.5 rounded-xl border border-cyan-500/20">
                      <span className="font-bold text-slate-300 text-[11px]">إجمالي الألماس والدعم بالروم:</span>
                      <span className="font-mono font-black text-cyan-300 dir-ltr text-xs">
                        {statsTimeFilter === '24h' ? '40,000,000 💎' : '325,700,000 💎'}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setShowRoomSupportModal(false);
                        onOpenRecharge?.();
                      }}
                      className="w-full py-2.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-slate-950 font-black text-xs rounded-xl shadow-md hover:brightness-110 cursor-pointer transition-all"
                    >
                      شحن ماسات وإرسال هدايا الآن 💎
                    </button>
                  </>
                )}

                {statsMainTab === 'club' && (
                  <button
                    onClick={() => {
                      setShowRoomSupportModal(false);
                      setShowFamilyModal(true);
                    }}
                    className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-xs rounded-xl shadow-md hover:brightness-110 cursor-pointer transition-all flex items-center justify-center gap-1.5"
                  >
                    <Users className="w-4 h-4" />
                    <span>انضم الآن إلى النادي العائلي 🛡️</span>
                  </button>
                )}

                {statsMainTab === 'charm' && (
                  <button
                    onClick={() => {
                      setShowRoomSupportModal(false);
                      setShowGiftDrawer(true);
                    }}
                    className="w-full py-2.5 bg-gradient-to-r from-pink-500 via-rose-600 to-purple-600 text-white font-black text-xs rounded-xl shadow-md hover:brightness-110 cursor-pointer transition-all flex items-center justify-center gap-1.5"
                  >
                    <Gift className="w-4 h-4" />
                    <span>إرسال هدايا وزيادة نقاط الجاذبية ✨</span>
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FAMILY MODAL */}
      <FamilyModal
        isOpen={showFamilyModal}
        onClose={() => setShowFamilyModal(false)}
      />

      {/* SUPER LEGEND MODAL */}
      <SuperLegendModal
        isOpen={showSuperLegendModal}
        onClose={() => setShowSuperLegendModal(false)}
        onOpenRecharge={onOpenRecharge}
      />

      {/* ROOM INFO & ADMIN PANEL MODAL */}
      <RoomInfoModal
        isOpen={showRoomInfoModal}
        onClose={() => setShowRoomInfoModal(false)}
        roomTitle={roomTitle}
        roomId={roomId}
        hostAvatar={hostSeat.avatar}
        hostName={hostSeat.userName}
        onOpenSettings={() => setShowSettingsDrawer(true)}
      />
    </div>
  );
};

