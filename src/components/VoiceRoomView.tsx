import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Gift as GiftIcon,
  Smile,
  Send,
  X,
  Users,
  Trophy,
  Flame,
  Music,
  Share2,
  Settings,
  Sparkles,
  Lock,
  Radio,
  Swords,
  Crown
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { VoiceRoom, User, MicSeat, Gift, ChatMessage } from '../types';
import { MOCK_USERS, MOCK_GIFTS } from '../data/mockData';
import { soundEffects } from '../lib/soundEffects';

interface VoiceRoomViewProps {
  room: VoiceRoom;
  currentUser: User;
  onClose: () => void;
  onOpenRecharge: () => void;
}

export const VoiceRoomView: React.FC<VoiceRoomViewProps> = ({
  room,
  currentUser,
  onClose,
  onOpenRecharge
}) => {
  // Mic Seats state
  const [seats, setSeats] = useState<MicSeat[]>([
    { seatIndex: 0, user: room.host, isMuted: false, isLocked: false, isSpeaking: true, audioLevel: 75, giftScore: 12400 },
    { seatIndex: 1, user: MOCK_USERS[2], isMuted: false, isLocked: false, isSpeaking: false, audioLevel: 0, giftScore: 8900 },
    { seatIndex: 2, user: MOCK_USERS[3], isMuted: true, isLocked: false, isSpeaking: false, audioLevel: 0, giftScore: 3400 },
    { seatIndex: 3, user: null, isMuted: false, isLocked: false, isSpeaking: false, audioLevel: 0, giftScore: 0 },
    { seatIndex: 4, user: null, isMuted: false, isLocked: false, isSpeaking: false, audioLevel: 0, giftScore: 0 },
    { seatIndex: 5, user: null, isMuted: false, isLocked: false, isSpeaking: false, audioLevel: 0, giftScore: 0 },
    { seatIndex: 6, user: null, isMuted: false, isLocked: false, isSpeaking: false, audioLevel: 0, giftScore: 0 },
    { seatIndex: 7, user: null, isMuted: false, isLocked: false, isSpeaking: false, audioLevel: 0, giftScore: 0 }
  ]);

  // Current user seat index (null if in audience)
  const [mySeatIndex, setMySeatIndex] = useState<number | null>(null);
  const [myMicMuted, setMyMicMuted] = useState<boolean>(false);
  const [isRoomMuted, setIsRoomMuted] = useState<boolean>(false);

  // Chat messages
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      userId: 'sys',
      userName: 'النظام',
      userAvatar: '',
      role: 'system',
      vipLevel: 0,
      legendLevel: 0,
      text: room.announcement,
      type: 'system',
      timestamp: 'الآن'
    },
    {
      id: 'm2',
      userId: MOCK_USERS[2].id,
      userName: MOCK_USERS[2].name,
      userAvatar: MOCK_USERS[2].avatar,
      role: MOCK_USERS[2].role,
      vipLevel: MOCK_USERS[2].vipLevel,
      legendLevel: MOCK_USERS[2].legendLevel,
      text: 'منورين جميعاً في سهرة سوبر ليجند الملكية 👑✨',
      type: 'chat',
      timestamp: '19:42'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Lucky chest
  const [chestTimer, setChestTimer] = useState(room.luckyChest.remainingSeconds || 90);
  const [chestPool, setChestPool] = useState(room.luckyChest.poolCoins || 5000);
  const [chestClaimed, setChestClaimed] = useState(false);

  // Modals & Trays
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [showToolsModal, setShowToolsModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState<User | null>(room.host);
  const [activeGiftAnimation, setActiveGiftAnimation] = useState<{
    gift: Gift;
    sender: string;
    receiver: string;
    count: number;
  } | null>(null);

  // Background Theme
  const [currentBg, setCurrentBg] = useState(room.bgTheme);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simulate lucky chest countdown
  useEffect(() => {
    if (chestTimer <= 0) return;
    const interval = setInterval(() => {
      setChestTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [chestTimer]);

  // Simulate audio level pulse for speaking seats
  useEffect(() => {
    const interval = setInterval(() => {
      setSeats((prev) =>
        prev.map((seat) => {
          if (!seat.user || seat.isMuted) {
            return { ...seat, isSpeaking: false, audioLevel: 0 };
          }
          // Random fluctuation
          const isSpk = Math.random() > 0.35;
          return {
            ...seat,
            isSpeaking: isSpk,
            audioLevel: isSpk ? Math.floor(40 + Math.random() * 60) : 0
          };
        })
      );
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  // Handle taking a seat
  const handleTakeSeat = (seatIdx: number) => {
    const target = seats[seatIdx];
    if (target.isLocked) return;

    if (target.user && target.user.id === currentUser.id) {
      // Leave seat
      setSeats((prev) =>
        prev.map((s, idx) => (idx === seatIdx ? { ...s, user: null, isSpeaking: false } : s))
      );
      setMySeatIndex(null);
      return;
    }

    if (target.user && target.user.id !== currentUser.id) {
      // Choose as gift recipient
      setSelectedRecipient(target.user);
      setShowGiftModal(true);
      return;
    }

    // Take empty seat
    setSeats((prev) =>
      prev.map((s, idx) => {
        if (s.user?.id === currentUser.id) return { ...s, user: null };
        if (idx === seatIdx) return { ...s, user: currentUser, isMuted: myMicMuted, isSpeaking: !myMicMuted };
        return s;
      })
    );
    setMySeatIndex(seatIdx);
    soundEffects.playMicToggle(true);
  };

  // Toggle my mic
  const toggleMyMic = () => {
    const newMuted = !myMicMuted;
    setMyMicMuted(newMuted);
    soundEffects.playMicToggle(!newMuted);
    if (mySeatIndex !== null) {
      setSeats((prev) =>
        prev.map((s, idx) => (idx === mySeatIndex ? { ...s, isMuted: newMuted } : s))
      );
    }
  };

  // Send text message
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      role: currentUser.role,
      vipLevel: currentUser.vipLevel,
      legendLevel: currentUser.legendLevel,
      text: inputText.trim(),
      type: 'chat',
      timestamp: 'الآن'
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
  };

  // Send Gift
  const handleSendGift = (gift: Gift, count: number = 1) => {
    const totalCost = gift.price * count;
    if (currentUser.coins < totalCost) {
      onOpenRecharge();
      return;
    }

    currentUser.coins -= totalCost;
    soundEffects.playGiftSound();

    // Trigger visual confetti / animation
    if (gift.animationType === 'confetti') {
      confetti({
        particleCount: 80 * count,
        spread: 70,
        origin: { y: 0.6 }
      });
    } else {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#eab308', '#ec4899', '#3b82f6', '#10b981']
      });
    }

    setActiveGiftAnimation({
      gift,
      sender: currentUser.name,
      receiver: selectedRecipient ? selectedRecipient.name : room.host.name,
      count
    });

    setTimeout(() => {
      setActiveGiftAnimation(null);
    }, 3500);

    // Add to chat feed
    const giftMsg: ChatMessage = {
      id: 'g_' + Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      role: currentUser.role,
      vipLevel: currentUser.vipLevel,
      legendLevel: currentUser.legendLevel,
      text: `أرسل ${count > 1 ? count + 'x ' : ''}${gift.nameAr} إلى ${selectedRecipient?.name || room.host.name}`,
      type: 'gift',
      timestamp: 'الآن',
      giftData: {
        giftName: gift.nameAr,
        giftIcon: gift.icon,
        count,
        targetUserName: selectedRecipient?.name || room.host.name
      }
    };

    setMessages((prev) => [...prev, giftMsg]);
    setShowGiftModal(false);
  };

  // Claim lucky chest
  const handleClaimChest = () => {
    if (chestTimer > 0 || chestClaimed) return;
    const reward = Math.floor(chestPool * 0.4 + Math.random() * 200);
    currentUser.coins += reward;
    setChestClaimed(true);
    soundEffects.playVictoryFanfare();
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.4 }
    });

    setMessages((prev) => [
      ...prev,
      {
        id: 'chest_' + Date.now(),
        userId: 'sys',
        userName: 'صندوق الحظ 🎁',
        userAvatar: '',
        role: 'system',
        vipLevel: 0,
        legendLevel: 0,
        text: `مبروك! فتح ${currentUser.name} صندوق الحظ وحصل على ${reward} كوينز ذهبية! 🪙✨`,
        type: 'system',
        timestamp: 'الآن'
      }
    ]);
  };

  const themes = [
    { id: 't1', name: 'الملكي البنفسجي', class: 'from-purple-950 via-slate-900 to-indigo-950' },
    { id: 't2', name: 'الذهبي الأسطوري', class: 'from-amber-950 via-slate-900 to-yellow-950' },
    { id: 't3', name: 'الزمرد الأخضر', class: 'from-emerald-950 via-slate-900 to-teal-950' },
    { id: 't4', name: 'الياقوت الأحمر', class: 'from-rose-950 via-slate-900 to-red-950' },
    { id: 't5', name: 'الليث الليلي', class: 'from-slate-950 via-slate-900 to-zinc-950' }
  ];

  return (
    <div className={`fixed inset-0 z-50 bg-gradient-to-b ${currentBg} text-white flex flex-col justify-between select-none overflow-hidden`}>
      {/* Top Header Bar */}
      <div className="p-3 flex items-center justify-between border-b border-white/10 bg-black/30 backdrop-blur-md">
        {/* Room Info */}
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <img
              src={room.host.avatar}
              alt={room.host.name}
              className="w-11 h-11 rounded-full object-cover border-2 border-amber-400"
            />
            <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 text-[10px] font-black px-1 rounded-full">
              مضيف
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-bold text-sm text-white line-clamp-1 max-w-[160px] sm:max-w-xs">
                {room.title}
              </h2>
              <span className="text-xs">{room.countryFlag}</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-300">
              <span className="flex items-center gap-0.5 text-amber-400">
                <Flame className="w-3 h-3" /> {room.hotScore.toLocaleString()}
              </span>
              <span className="flex items-center gap-0.5 text-slate-400">
                <Users className="w-3 h-3" /> {room.listenersCount}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Theme selector */}
          <button
            onClick={() => setShowThemeModal(true)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer text-amber-300"
            title="تغيير ثيم الروم"
          >
            <Sparkles className="w-4 h-4" />
          </button>

          {/* Sound Mute */}
          <button
            onClick={() => setIsRoomMuted(!isRoomMuted)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
            title="كتم صوت الروم"
          >
            {isRoomMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-slate-200" />}
          </button>

          {/* Close / Minimize */}
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 transition cursor-pointer"
            title="مغادرة الروم"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* PK Battle Banner (If Active) */}
      {room.pkBattle?.active && (
        <div className="mx-3 mt-2 bg-slate-900/80 border border-amber-500/30 rounded-xl p-2.5 backdrop-blur-md shadow-lg">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <div className="flex items-center gap-1.5 text-blue-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
              الفريق الأزرق ({room.pkBattle.blueTeam.score.toLocaleString()})
            </div>
            <div className="flex items-center gap-1 bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-mono font-bold">
              <Swords className="w-3.5 h-3.5 text-amber-400" />
              02:45
            </div>
            <div className="flex items-center gap-1.5 text-rose-400 font-bold">
              ({room.pkBattle.redTeam.score.toLocaleString()}) الفريق الأحمر
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            </div>
          </div>
          {/* Score progress bar */}
          <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden flex">
            <div
              className="bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-500"
              style={{ width: '42%' }}
            ></div>
            <div
              className="bg-gradient-to-l from-rose-600 to-orange-400 transition-all duration-500"
              style={{ width: '58%' }}
            ></div>
          </div>
        </div>
      )}

      {/* Lucky Chest Floating Widget */}
      {room.luckyChest.active && (
        <div className="mx-3 mt-2">
          <div
            onClick={handleClaimChest}
            className={`flex items-center justify-between p-2 rounded-xl transition cursor-pointer ${
              chestTimer === 0
                ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 animate-bounce shadow-lg shadow-amber-500/30 font-bold'
                : 'bg-amber-500/10 border border-amber-500/30 text-amber-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">🎁</span>
              <div>
                <div className="text-xs font-extrabold flex items-center gap-1">
                  صندوق الكنز الأسطوري
                  {chestTimer === 0 && <span className="bg-slate-950 text-amber-400 text-[10px] px-1.5 rounded">جاهز للفتح!</span>}
                </div>
                <div className="text-[11px] opacity-80">
                  مجموع الجوائز: {chestPool.toLocaleString()} كوينز 🪙
                </div>
              </div>
            </div>
            <div className="text-xs font-mono font-bold bg-black/30 px-2.5 py-1 rounded-lg">
              {chestTimer > 0 ? `${Math.floor(chestTimer / 60)}:${String(chestTimer % 60).padStart(2, '0')}` : 'افتح الآن ⚡'}
            </div>
          </div>
        </div>
      )}

      {/* Mic Seats Grid */}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col justify-start">
        <div className="grid grid-cols-4 gap-y-4 gap-x-3 max-w-md mx-auto w-full my-auto">
          {seats.map((seat, index) => {
            const hasUser = !!seat.user;
            const isMe = seat.user?.id === currentUser.id;

            return (
              <div key={index} className="flex flex-col items-center">
                <div
                  onClick={() => handleTakeSeat(index)}
                  className={`relative w-16 h-16 rounded-full flex items-center justify-center cursor-pointer transition transform active:scale-95 ${
                    hasUser
                      ? seat.isSpeaking
                        ? 'ring-4 ring-amber-400 ring-offset-2 ring-offset-slate-950 animate-pulse'
                        : 'ring-2 ring-purple-500/60'
                      : 'bg-white/5 border border-dashed border-white/20 hover:border-amber-400/60 hover:bg-white/10'
                  }`}
                >
                  {hasUser ? (
                    <>
                      <img
                        src={seat.user?.avatar}
                        alt={seat.user?.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                      {/* Host Crown */}
                      {index === 0 && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-base filter drop-shadow">
                          👑
                        </div>
                      )}
                      {/* Speaking audio wave indicator */}
                      {seat.isSpeaking && (
                        <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 p-1 rounded-full text-[10px] shadow">
                          <Radio className="w-3 h-3 animate-spin" />
                        </div>
                      )}
                      {/* Mute badge */}
                      {seat.isMuted && (
                        <div className="absolute -bottom-1 -left-1 bg-rose-600 text-white p-1 rounded-full text-[10px] shadow">
                          <MicOff className="w-3 h-3" />
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      {seat.isLocked ? (
                        <Lock className="w-5 h-5 text-slate-500" />
                      ) : (
                        <>
                          <Mic className="w-5 h-5 text-slate-400" />
                          <span className="text-[10px] font-bold text-slate-400 mt-0.5">{index + 1}</span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Name and VIP Tag */}
                <div className="mt-1.5 text-center max-w-[70px]">
                  {hasUser ? (
                    <>
                      <p className="text-[11px] font-bold text-slate-200 truncate">
                        {isMe ? 'أنت' : seat.user?.name}
                      </p>
                      <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1 rounded font-mono">
                        VIP {seat.user?.vipLevel}
                      </span>
                    </>
                  ) : (
                    <span className="text-[10px] text-slate-500 font-bold">
                      {seat.isLocked ? 'مقفل' : `مايك ${index + 1}`}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fullscreen Gift Animation Overlay (When triggered) */}
      {activeGiftAnimation && (
        <div className="absolute inset-0 z-50 pointer-events-none flex flex-col items-center justify-center bg-black/40 backdrop-blur-xs animate-gift-float">
          <div className="text-7xl filter drop-shadow-2xl mb-2 animate-bounce">
            {activeGiftAnimation.gift.icon}
          </div>
          <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 text-slate-950 font-black px-6 py-2 rounded-full shadow-2xl text-center border-2 border-white">
            <p className="text-sm">
              ✨ {activeGiftAnimation.sender} أرسل {activeGiftAnimation.count}x {activeGiftAnimation.gift.nameAr} إلى {activeGiftAnimation.receiver}! 👑
            </p>
          </div>
        </div>
      )}

      {/* Live Chat Message Stream */}
      <div className="h-44 px-3 overflow-y-auto space-y-1.5 mask-gradient-top">
        {messages.map((msg) => (
          <div key={msg.id} className="text-xs">
            {msg.type === 'system' ? (
              <div className="bg-white/5 border border-white/10 text-amber-300 p-2 rounded-xl text-[11px] leading-relaxed">
                📢 {msg.text}
              </div>
            ) : msg.type === 'gift' ? (
              <div className="bg-gradient-to-r from-amber-900/60 to-purple-900/60 border border-amber-500/40 p-1.5 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg">{msg.giftData?.giftIcon}</span>
                  <span className="text-amber-200 font-bold">{msg.userName}:</span>
                  <span className="text-white">{msg.text}</span>
                </div>
                <span className="text-[10px] text-amber-400 font-mono font-bold">
                  +{msg.giftData?.count}
                </span>
              </div>
            ) : (
              <div className="bg-black/30 backdrop-blur-sm p-1.5 rounded-xl inline-flex items-center gap-1.5 max-w-full">
                <span className="bg-purple-600/80 text-[9px] font-bold px-1 py-0.5 rounded text-white">
                  V{msg.vipLevel}
                </span>
                <span className="font-bold text-amber-300 truncate max-w-[90px]">{msg.userName}:</span>
                <span className="text-slate-100">{msg.text}</span>
              </div>
            )}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Bottom Bar Controls */}
      <div className="p-3 bg-black/50 backdrop-blur-md border-t border-white/10 flex items-center justify-between gap-2">
        {/* Chat input form */}
        <form onSubmit={handleSendMessage} className="flex-1 flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1.5">
          <input
            type="text"
            placeholder="اكتب رسالة في الروم..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none"
          />
          <button type="submit" className="text-amber-400 hover:text-amber-300 cursor-pointer p-1">
            <Send className="w-4 h-4 rotate-180" />
          </button>
        </form>

        {/* Sound Effects Board Button */}
        <button
          onClick={() => setShowToolsModal(true)}
          className="p-2.5 rounded-full bg-indigo-600/80 hover:bg-indigo-600 text-white transition cursor-pointer shadow-lg"
          title="المؤثرات الصوتية والألعاب"
        >
          <Music className="w-4 h-4" />
        </button>

        {/* Mic toggle (if seated) */}
        {mySeatIndex !== null && (
          <button
            onClick={toggleMyMic}
            className={`p-2.5 rounded-full transition cursor-pointer shadow-lg ${
              myMicMuted
                ? 'bg-rose-600 text-white hover:bg-rose-700'
                : 'bg-emerald-600 text-white hover:bg-emerald-700 animate-pulse'
            }`}
            title="تبديل المايك"
          >
            {myMicMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
        )}

        {/* Gift Button */}
        <button
          onClick={() => setShowGiftModal(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 cursor-pointer transition transform active:scale-95"
        >
          <GiftIcon className="w-4 h-4 stroke-[2.5]" />
          <span>إرسال هدية</span>
        </button>
      </div>

      {/* Sound Effects & Interactive Tools Modal */}
      {showToolsModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md p-5 text-white">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Music className="w-5 h-5 text-amber-400" />
                المؤثرات الصوتية والتفاعل الحي 🎙️
              </h3>
              <button onClick={() => setShowToolsModal(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 my-4">
              <button
                onClick={() => soundEffects.playApplause()}
                className="p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-2xl flex flex-col items-center gap-2 cursor-pointer transition active:scale-95"
              >
                <span className="text-2xl">👏</span>
                <span className="text-xs font-bold">تصفيق حار</span>
              </button>
              <button
                onClick={() => soundEffects.playVictoryFanfare()}
                className="p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-2xl flex flex-col items-center gap-2 cursor-pointer transition active:scale-95"
              >
                <span className="text-2xl">🎺</span>
                <span className="text-xs font-bold">لحن النصر</span>
              </button>
              <button
                onClick={() => soundEffects.playDiceRoll()}
                className="p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-2xl flex flex-col items-center gap-2 cursor-pointer transition active:scale-95"
              >
                <span className="text-2xl">🎲</span>
                <span className="text-xs font-bold">رمي النرد</span>
              </button>
            </div>

            <div className="bg-slate-800/50 p-3 rounded-2xl flex items-center justify-between text-xs text-slate-300">
              <span>رصيدك الحالي:</span>
              <span className="font-bold text-amber-400 font-mono">{currentUser.coins.toLocaleString()} كوينز</span>
            </div>
          </div>
        </div>
      )}

      {/* Theme Selector Modal */}
      {showThemeModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md p-5 text-white">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                تخصيص ثيم وخلفية الغرفة 🎨
              </h3>
              <button onClick={() => setShowThemeModal(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 my-4">
              {themes.map((t) => (
                <div
                  key={t.id}
                  onClick={() => {
                    setCurrentBg(t.class);
                    setShowThemeModal(false);
                  }}
                  className={`p-3 rounded-xl cursor-pointer flex items-center justify-between border ${
                    currentBg === t.class ? 'border-amber-400 bg-white/10' : 'border-slate-700 bg-slate-800/50 hover:bg-slate-800'
                  }`}
                >
                  <span className="text-sm font-bold">{t.name}</span>
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${t.class} border border-white/20`}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Gift Sending Tray / Modal */}
      {showGiftModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end justify-center">
          <div className="bg-slate-900 border-t border-slate-700 rounded-t-3xl w-full max-w-lg p-4 text-white animate-in slide-in-from-bottom duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">إرسال إلى:</span>
                <select
                  value={selectedRecipient?.id || room.host.id}
                  onChange={(e) => {
                    const found = MOCK_USERS.find((u) => u.id === e.target.value);
                    if (found) setSelectedRecipient(found);
                  }}
                  className="bg-slate-800 border border-slate-700 text-xs font-bold rounded-lg px-2 py-1 text-amber-300 focus:outline-none"
                >
                  <option value={room.host.id}>👑 {room.host.name} (المضيف)</option>
                  {seats
                    .filter((s) => s.user && s.user.id !== currentUser.id && s.user.id !== room.host.id)
                    .map((s) => (
                      <option key={s.seatIndex} value={s.user?.id}>
                        🎤 {s.user?.name} (مايك {s.seatIndex + 1})
                      </option>
                    ))}
                </select>
              </div>

              <button onClick={() => setShowGiftModal(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Gifts Grid */}
            <div className="grid grid-cols-4 gap-2.5 my-3 max-h-64 overflow-y-auto p-1">
              {MOCK_GIFTS.map((g) => (
                <div
                  key={g.id}
                  onClick={() => handleSendGift(g, 1)}
                  className="p-2 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-400/80 rounded-2xl flex flex-col items-center justify-between cursor-pointer transition transform active:scale-95 group"
                >
                  <span className="text-3xl my-1 group-hover:scale-110 transition">{g.icon}</span>
                  <p className="text-[11px] font-bold text-slate-200 truncate w-full text-center">{g.nameAr}</p>
                  <div className="flex items-center gap-1 text-[10px] text-amber-400 font-mono font-bold mt-1">
                    <span>🪙</span> {g.price.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            {/* Balance & Fast Multipliers */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <div className="text-xs">
                  <span className="text-slate-400">الرصيد: </span>
                  <span className="font-extrabold text-amber-400 font-mono">{currentUser.coins.toLocaleString()} 🪙</span>
                </div>
                <button
                  onClick={onOpenRecharge}
                  className="text-[11px] text-cyan-400 hover:underline font-bold"
                >
                  شحن +
                </button>
              </div>

              <div className="flex items-center gap-1">
                {[1, 10, 66, 99].map((qty) => (
                  <button
                    key={qty}
                    onClick={() => handleSendGift(MOCK_GIFTS[0], qty)}
                    className="px-2 py-1 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 text-xs font-bold rounded-lg border border-slate-700 transition"
                  >
                    x{qty}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
