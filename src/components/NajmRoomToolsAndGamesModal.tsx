import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Volume2,
  VolumeX,
  SlidersHorizontal,
  Share2,
  Gift,
  Sparkles,
  Dices,
  Trophy,
  Coins,
  Gem,
  Play,
  Check,
  Copy,
  Users,
  Radio,
  Flame,
  Link as LinkIcon
} from 'lucide-react';
import { ThreeDLuckyChest } from './ThreeDLuckyChest';

export interface NajmRoomToolsAndGamesModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomId?: string;
  roomTitle?: string;
  isSpeakerMuted?: boolean;
  onToggleSpeaker?: () => void;
  onOpenSoundEffects?: () => void;
  onOpenMusicPlayer?: () => void;
  onOpenLuckyBox?: () => void;
  onOpenDailyTasks?: () => void;
  onOpenInteractiveTools?: () => void;
  onOpenCinemaWatchParty?: () => void;
  onTriggerToast?: (msg: string) => void;
  onTestEntrance?: (vipLevel: number | string, userName?: string) => void;
  currentUserRole?: 'owner' | 'host' | 'moderator' | 'guest';
  currentAppRole?: string;
  isOwner?: boolean;
}

export type YoHoRoomToolsAndGamesModalProps = NajmRoomToolsAndGamesModalProps;

export const NajmRoomToolsAndGamesModal: React.FC<NajmRoomToolsAndGamesModalProps> = ({
  isOpen,
  onClose,
  roomId = '884920',
  roomTitle = 'وكالة شحن سوريا ألمانيا',
  isSpeakerMuted = false,
  onToggleSpeaker,
  onOpenSoundEffects,
  onOpenMusicPlayer,
  onOpenLuckyBox,
  onOpenDailyTasks,
  onOpenInteractiveTools,
  onOpenCinemaWatchParty,
  onTriggerToast,
  onTestEntrance,
  currentUserRole = 'guest',
  currentAppRole,
  isOwner = false,
}) => {
  const isDev = currentAppRole === 'developer';
  const isRoomOwner = isDev || (currentAppRole !== 'guest' && currentAppRole !== 'moderator' && (isOwner || currentAppRole === 'owner' || currentUserRole === 'owner'));
  const isModerator = !isDev && !isRoomOwner && (currentAppRole === 'moderator' || currentUserRole === 'moderator');
  const isRegularUser = !isDev && !isRoomOwner && !isModerator;

  // Local state for interactive sub-views (Game Launchers, Lucky Box, Share, Daily Tasks, Interactive Tools)
  const [activeSubModal, setActiveSubModal] = useState<string | null>(null);
  const [activeGameTitle, setActiveGameTitle] = useState<string>('');
  const [speakerMutedLocal, setSpeakerMutedLocal] = useState<boolean>(isSpeakerMuted);
  const [copiedLink, setCopiedLink] = useState(false);
  const [luckyBoxOpened, setLuckyBoxOpened] = useState(false);
  const [luckyReward, setLuckyReward] = useState<{ amount: number; type: 'coins' | 'diamonds' } | null>(null);
  const [claimedTasks, setClaimedTasks] = useState<Record<string, boolean>>({});
  const [diceResult, setDiceResult] = useState<number | null>(null);
  const [coinFlipResult, setCoinFlipResult] = useState<'heads' | 'tails' | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  if (!isOpen) return null;

  const handleGameClick = (title: string, gameKey: string) => {
    setActiveGameTitle(title);
    setActiveSubModal(`game_${gameKey}`);
  };

  const handleSpeakerToggle = () => {
    const nextState = !speakerMutedLocal;
    setSpeakerMutedLocal(nextState);
    if (onToggleSpeaker) {
      onToggleSpeaker();
    }
    const msg = nextState ? 'تم كتم مكبر الصوت للغرفة 🔇' : 'تم تشغيل مكبر الصوت للغرفة 🔊';
    onTriggerToast?.(msg);
  };

  const handleCopyLink = () => {
    const roomUrl = `${window.location.origin}/room/${roomId}`;
    navigator.clipboard?.writeText(roomUrl);
    setCopiedLink(true);
    onTriggerToast?.('تم نسخ رابط الغرفة إلى الحافظة بنجاح 📋');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleOpenLuckyBox = () => {
    if (luckyBoxOpened) {
      setLuckyBoxOpened(false);
      setLuckyReward(null);
      return;
    }
    const prizes = [
      { amount: 5000, type: 'coins' as const },
      { amount: 15000, type: 'coins' as const },
      { amount: 50000, type: 'coins' as const },
      { amount: 200, type: 'diamonds' as const },
      { amount: 1000, type: 'diamonds' as const },
      { amount: 5000, type: 'diamonds' as const },
    ];
    const picked = prizes[Math.floor(Math.random() * prizes.length)];
    setLuckyReward(picked);
    setLuckyBoxOpened(true);
    onTriggerToast?.(`مبروك! ربحت ${picked.amount.toLocaleString()} ${picked.type === 'diamonds' ? 'ألماسة 💎' : 'كوينز 🪙'}`);
  };

  const handleRollDice = () => {
    setIsRolling(true);
    setTimeout(() => {
      setDiceResult(Math.floor(Math.random() * 6) + 1);
      setIsRolling(false);
    }, 600);
  };

  const handleFlipCoin = () => {
    setIsRolling(true);
    setTimeout(() => {
      setCoinFlipResult(Math.random() > 0.5 ? 'heads' : 'tails');
      setIsRolling(false);
    }, 600);
  };

  const handleClaimTask = (taskId: string, rewardText: string) => {
    setClaimedTasks((prev) => ({ ...prev, [taskId]: true }));
    onTriggerToast?.(`تم استلام مكافأة المهمة: ${rewardText} ✨`);
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 bg-transparent flex items-end justify-center pointer-events-auto select-none cursor-default"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md bg-white rounded-t-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[85vh] text-slate-900 border-t border-slate-100"
          dir="rtl"
        >
          {/* Top Sheet Drag Indicator */}
          <div className="w-full flex items-center justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-slate-300" />
          </div>

          <div className="overflow-y-auto px-5 pt-2 pb-6 space-y-6 custom-scrollbar">
            {isRegularUser ? (
              /* ========================================================================= */
              /* للمستخدم العادي فقط: يظهر فقط الصندوق، مكبر الصوت، التأثيرات الصوتية،   */
              /* مشاركة الغرفة، مشاركة، المهام اليومية                                    */
              /* ========================================================================= */
              <div className="space-y-4 pt-1">
                <div className="space-y-0.5">
                  <h2 className="text-base font-black text-slate-900 tracking-tight text-right">
                    أدوات الغرفة
                  </h2>
                  <p className="text-xs text-slate-500 font-medium text-right">
                    أدوات وميزات الغرفة الصوتية المتاحة
                  </p>
                </div>

                {/* شبكة الأدوات للمستخدم العادي (6 عناصر متناسقة) */}
                <div className="grid grid-cols-3 gap-y-5 gap-x-3 pt-2 pb-2">
                  {/* 1. الصندوق */}
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenLuckyBox?.();
                    }}
                    className="flex flex-col items-center gap-1.5 group cursor-pointer active:scale-95 transition-transform"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-500/15 via-rose-500/10 to-amber-400/15 border border-pink-500/25 shadow-xs flex items-center justify-center relative overflow-hidden group-hover:border-pink-500/50 transition-colors">
                      <ThreeDLuckyChest size="sm" />
                      <div className="absolute -top-1 -right-1 text-xs">✨</div>
                    </div>
                    <span className="text-xs font-bold text-slate-700 group-hover:text-pink-600 transition-colors">
                      الصندوق
                    </span>
                  </button>

                  {/* 2. أيقونة مكبر الصوت */}
                  <button
                    type="button"
                    onClick={handleSpeakerToggle}
                    className="flex flex-col items-center gap-1.5 group cursor-pointer active:scale-95 transition-transform"
                  >
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-md transition-colors ${
                        speakerMutedLocal
                          ? 'bg-slate-600 shadow-slate-600/20'
                          : 'bg-gradient-to-tr from-sky-400 to-blue-500 shadow-sky-400/25'
                      }`}
                    >
                      {speakerMutedLocal ? (
                        <VolumeX className="w-6 h-6" />
                      ) : (
                        <Volume2 className="w-6 h-6" />
                      )}
                    </div>
                    <span className="text-xs font-bold text-slate-700 group-hover:text-sky-600 transition-colors text-center leading-tight">
                      {speakerMutedLocal ? 'تشغيل مكبر الصوت' : 'إيقاف مكبر الصوت'}
                    </span>
                  </button>

                  {/* 3. التأثيرات الصوتية */}
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenSoundEffects?.();
                    }}
                    className="flex flex-col items-center gap-1.5 group cursor-pointer active:scale-95 transition-transform"
                  >
                    <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-slate-600 via-slate-700 to-indigo-800 shadow-md shadow-slate-700/20 flex items-center justify-center text-white">
                      <SlidersHorizontal className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-slate-700 group-hover:text-indigo-600 transition-colors text-center leading-tight">
                      التأثيرات الصوتية
                    </span>
                  </button>

                  {/* 4. مشاركة الغرفة */}
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="flex flex-col items-center gap-1.5 group cursor-pointer active:scale-95 transition-transform"
                  >
                    <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 shadow-md shadow-emerald-500/25 flex items-center justify-center text-white">
                      <Copy className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-slate-700 group-hover:text-emerald-600 transition-colors">
                      مشاركة الغرفة
                    </span>
                  </button>

                  {/* 5. مشاركة */}
                  <button
                    type="button"
                    onClick={() => setActiveSubModal('share')}
                    className="flex flex-col items-center gap-1.5 group cursor-pointer active:scale-95 transition-transform"
                  >
                    <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-purple-500 via-indigo-600 to-purple-700 shadow-md shadow-purple-500/25 flex items-center justify-center text-white">
                      <Share2 className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-slate-700 group-hover:text-purple-600 transition-colors">
                      مشاركة
                    </span>
                  </button>

                  {/* 6. المهام اليومية */}
                  <button
                    type="button"
                    onClick={() => setActiveSubModal('daily_tasks')}
                    className="flex flex-col items-center gap-1.5 group cursor-pointer active:scale-95 transition-transform"
                  >
                    <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-400 via-teal-400 to-emerald-400 shadow-md shadow-teal-400/20 flex items-center justify-center text-slate-950">
                      <span className="text-2xl filter drop-shadow-xs">🪔</span>
                    </div>
                    <span className="text-xs font-bold text-slate-700 group-hover:text-teal-600 transition-colors">
                      المهام اليومية
                    </span>
                  </button>

                  {/* 7. بنر الدخول VIP */}
                  <button
                    type="button"
                    onClick={() => setActiveSubModal('vip_entrance')}
                    className="flex flex-col items-center gap-1.5 group cursor-pointer active:scale-95 transition-transform"
                  >
                    <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-500 to-amber-600 shadow-md shadow-amber-500/30 flex items-center justify-center text-slate-950">
                      <span className="text-2xl filter drop-shadow-xs">🪽</span>
                    </div>
                    <span className="text-xs font-bold text-slate-700 group-hover:text-amber-600 transition-colors">
                      بنر الدخول VIP
                    </span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* ========================================================================= */}
                {/* SECTION 1: الألعاب التفاعلية (Interactive Games)                           */}
                {/* ========================================================================= */}
                <div className="space-y-3">
                  <div className="space-y-0.5">
                    <h2 className="text-base font-black text-slate-900 tracking-tight text-right">
                      الألعاب التفاعلية
                    </h2>
                    <p className="text-xs text-slate-500 font-medium text-right">
                      يمكن لأصحاب الغرف الحصول على مكافآت إضافية إذا كانت الألعاب مع 💰 مفتوحة.
                    </p>
                  </div>

                  {/* 4-Columns Grid */}
                  <div className="grid grid-cols-4 gap-3 pt-1">
                    {/* 1. Ludo (Top Right) */}
                    <button
                      type="button"
                      onClick={() => handleGameClick('Ludo الملكي', 'ludo')}
                      className="flex flex-col items-center gap-1.5 group cursor-pointer active:scale-95 transition-transform"
                    >
                      <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 p-0.5 shadow-md flex items-center justify-center overflow-visible">
                        <div className="absolute -top-1.5 -right-1 bg-amber-400 border border-white text-slate-950 text-[9px] font-black px-1 py-0.2 rounded-full shadow-xs flex items-center gap-0.5 z-10">
                          <span>💰</span>
                        </div>
                        <div className="w-full h-full rounded-2xl bg-gradient-to-br from-blue-400 via-sky-500 to-indigo-700 flex flex-col items-center justify-center text-white overflow-hidden relative">
                          <div className="text-xl">🕌</div>
                          <span className="text-[10px] font-black tracking-wider text-amber-300 drop-shadow-sm font-sans uppercase">
                            LUDO
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                        Ludo
                      </span>
                    </button>

                    {/* 2. صيد (Fishing) */}
                    <button
                      type="button"
                      onClick={() => handleGameClick('صيد الأسماك والقرش الذهبي', 'fishing')}
                      className="flex flex-col items-center gap-1.5 group cursor-pointer active:scale-95 transition-transform"
                    >
                      <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-400 to-blue-500 p-0.5 shadow-md flex items-center justify-center overflow-visible">
                        <div className="absolute -top-1.5 -right-1 bg-amber-400 border border-white text-slate-950 text-[9px] font-black px-1 py-0.2 rounded-full shadow-xs flex items-center gap-0.5 z-10">
                          <span>💰</span>
                        </div>
                        <div className="w-full h-full rounded-2xl bg-gradient-to-b from-sky-400 via-cyan-500 to-blue-600 flex flex-col items-center justify-center text-white overflow-hidden relative">
                          <div className="text-2xl filter drop-shadow-sm">🐟</div>
                          <div className="absolute bottom-0 inset-x-0 h-2 bg-blue-700/50 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-orange-400" />
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-700 group-hover:text-cyan-600 transition-colors">
                        صيد
                      </span>
                    </button>

                    {/* 3. الدومينو (Domino) */}
                    <button
                      type="button"
                      onClick={() => handleGameClick('دومينو التحدي المباشر', 'domino')}
                      className="flex flex-col items-center gap-1.5 group cursor-pointer active:scale-95 transition-transform"
                    >
                      <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-400 to-emerald-600 p-0.5 shadow-md flex items-center justify-center overflow-visible">
                        <div className="absolute -top-1.5 -right-1 bg-amber-400 border border-white text-slate-950 text-[9px] font-black px-1 py-0.2 rounded-full shadow-xs flex items-center gap-0.5 z-10">
                          <span>💰</span>
                        </div>
                        <div className="w-full h-full rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-teal-700 flex flex-col items-center justify-center text-white overflow-hidden relative">
                          <div className="text-xl">🁡🁣</div>
                          <span className="text-[8px] font-black text-amber-200 uppercase font-mono">DOMINO</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-700 group-hover:text-emerald-600 transition-colors">
                        الدومينو
                      </span>
                    </button>

                    {/* 4. الفائز الرهيب (Lucky Wheel) */}
                    <button
                      type="button"
                      onClick={() => handleGameClick('عجلة الفائز الرهيب', 'lucky_wheel')}
                      className="flex flex-col items-center gap-1.5 group cursor-pointer active:scale-95 transition-transform"
                    >
                      <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-600 p-0.5 shadow-md flex items-center justify-center overflow-visible">
                        <div className="w-full h-full rounded-2xl bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-700 flex flex-col items-center justify-center text-white overflow-hidden relative">
                          <div className="w-9 h-9 rounded-full border-2 border-amber-300 bg-gradient-to-tr from-yellow-400 via-rose-500 to-purple-600 flex items-center justify-center shadow-inner animate-spin-slow">
                            <div className="w-3 h-3 rounded-full bg-amber-300 border border-white shadow-xs" />
                          </div>
                          <div className="absolute top-1 text-[8px] text-amber-300">▼</div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-700 group-hover:text-purple-600 transition-colors">
                        الفائز الرهيب
                      </span>
                    </button>

                    {/* 5. ONO (Cards) */}
                    <button
                      type="button"
                      onClick={() => handleGameClick('لعبة بطاقات ONO', 'ono')}
                      className="flex flex-col items-center gap-1.5 group cursor-pointer active:scale-95 transition-transform"
                    >
                      <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 p-0.5 shadow-md flex items-center justify-center overflow-visible">
                        <div className="w-full h-full rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 flex flex-col items-center justify-center text-white overflow-hidden relative">
                          <div className="text-lg">🃏🎴</div>
                          <span className="text-[10px] font-black tracking-widest text-yellow-300 bg-red-600 px-1 rounded-sm shadow-xs">
                            ONO
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-700 group-hover:text-purple-600 transition-colors">
                        ONO
                      </span>
                    </button>

                    {/* 6. مشاهدة فيديو (Watch Video / Cinema Mode) - تظهر لصاحب الروم فقط والمبرمج */}
                    {(isRoomOwner || isDev) && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          if (onOpenCinemaWatchParty) {
                            onOpenCinemaWatchParty();
                          } else {
                            handleGameClick('مشاهدة فيديو وسينما الروم', 'video');
                          }
                        }}
                        className="flex flex-col items-center gap-1.5 group cursor-pointer active:scale-95 transition-transform"
                      >
                        <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 p-0.5 shadow-md flex items-center justify-center overflow-visible">
                          <div className="w-full h-full rounded-2xl bg-gradient-to-br from-purple-700 via-indigo-800 to-slate-900 flex flex-col items-center justify-center text-white overflow-hidden relative">
                            <div className="text-xl">🎬</div>
                            <div className="w-4 h-4 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center text-[8px] font-bold shadow-xs">
                              ▶
                            </div>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-slate-700 group-hover:text-purple-600 transition-colors">
                          مشاهدة فيديو
                        </span>
                      </button>
                    )}

                    {/* 7. مقهى الكاذب (Liar's Cafe) */}
                    <button
                      type="button"
                      onClick={() => handleGameClick('مقهى الكاذب (Liar\'s Cafe)', 'liar_cafe')}
                      className="flex flex-col items-center gap-1.5 group cursor-pointer active:scale-95 transition-transform"
                    >
                      <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-700 p-0.5 shadow-md flex items-center justify-center overflow-visible">
                        <div className="absolute -top-1 -left-1 w-3 h-3 bg-red-500 border-2 border-white rounded-full z-20 shadow-xs" />
                        <div className="absolute -top-1.5 -right-1 bg-amber-400 border border-white text-slate-950 text-[9px] font-black px-1 py-0.2 rounded-full shadow-xs flex items-center gap-0.5 z-10">
                          <span>💰</span>
                        </div>
                        <div className="w-full h-full rounded-2xl bg-gradient-to-br from-rose-700 via-red-800 to-amber-900 flex flex-col items-center justify-center text-white overflow-hidden relative">
                          <div className="text-xl">🐰🎲</div>
                          <span className="text-[7.5px] font-black text-amber-300 leading-tight">
                            LIAR'S CAFE
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-700 group-hover:text-rose-600 transition-colors">
                        مقهى الكاذب
                      </span>
                    </button>

                    {/* 8. الكاروم (Carrom) */}
                    <button
                      type="button"
                      onClick={() => handleGameClick('لعبة الكاروم (CARROM)', 'carrom')}
                      className="flex flex-col items-center gap-1.5 group cursor-pointer active:scale-95 transition-transform"
                    >
                      <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 to-rose-700 p-0.5 shadow-md flex items-center justify-center overflow-visible">
                        <div className="absolute -top-1 -left-1 w-3 h-3 bg-red-500 border-2 border-white rounded-full z-20 shadow-xs" />
                        <div className="absolute -top-1.5 -right-1 bg-amber-400 border border-white text-slate-950 text-[9px] font-black px-1 py-0.2 rounded-full shadow-xs flex items-center gap-0.5 z-10">
                          <span>💰</span>
                        </div>
                        <div className="w-full h-full rounded-2xl bg-gradient-to-br from-amber-700 via-yellow-800 to-stone-900 flex flex-col items-center justify-center text-white overflow-hidden relative">
                          <div className="text-xl">🎯</div>
                          <span className="text-[8px] font-black text-amber-200 uppercase font-sans">
                            CARROM
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-700 group-hover:text-amber-700 transition-colors">
                        الكاروم
                      </span>
                    </button>
                  </div>
                </div>

                {/* ========================================================================= */}
                {/* SECTION 2: الأدوات الأساسية (Essential Tools)                              */}
                {/* ========================================================================= */}
                <div className="space-y-3 pt-2">
                  <h2 className="text-base font-black text-slate-900 tracking-tight text-right">
                    الأدوات الأساسية
                  </h2>

                  {/* 4-Columns Grid */}
                  <div className="grid grid-cols-4 gap-3 pt-1">
                    {/* 1. صندوق حظ (Lucky Box / Treasure Chest) */}
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenLuckyBox?.();
                      }}
                      className="flex flex-col items-center gap-1.5 group cursor-pointer active:scale-95 transition-transform"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-500/15 via-rose-500/10 to-amber-400/15 border border-pink-500/25 shadow-xs flex items-center justify-center relative overflow-hidden group-hover:border-pink-500/50 transition-colors">
                        <ThreeDLuckyChest size="sm" />
                        <div className="absolute -top-1 -right-1 text-xs">✨</div>
                      </div>
                      <span className="text-xs font-bold text-slate-700 group-hover:text-pink-600 transition-colors">
                        صندوق حظ
                      </span>
                    </button>

                    {/* 2. إيقاف / تشغيل مكبر الصوت (Speaker Audio Control) */}
                    <button
                      type="button"
                      onClick={handleSpeakerToggle}
                      className="flex flex-col items-center gap-1.5 group cursor-pointer active:scale-95 transition-transform"
                    >
                      <div
                        className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-md transition-colors ${
                          speakerMutedLocal
                            ? 'bg-slate-600 shadow-slate-600/20'
                            : 'bg-gradient-to-tr from-sky-400 to-blue-500 shadow-sky-400/25'
                        }`}
                      >
                        {speakerMutedLocal ? (
                          <VolumeX className="w-6 h-6" />
                        ) : (
                          <Volume2 className="w-6 h-6" />
                        )}
                      </div>
                      <span className="text-xs font-bold text-slate-700 group-hover:text-sky-600 transition-colors text-center leading-tight">
                        {speakerMutedLocal ? 'تشغيل مكبر الصوت' : 'إيقاف مكبر الصوت'}
                      </span>
                    </button>

                    {/* 3. التأثير والصوت (Sound & Effects Settings) */}
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenSoundEffects?.();
                      }}
                      className="flex flex-col items-center gap-1.5 group cursor-pointer active:scale-95 transition-transform"
                    >
                      <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-slate-600 via-slate-700 to-indigo-800 shadow-md shadow-slate-700/20 flex items-center justify-center text-white">
                        <SlidersHorizontal className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold text-slate-700 group-hover:text-indigo-600 transition-colors text-center leading-tight">
                        التأثير والصوت
                      </span>
                    </button>

                    {/* 4. مشاركة الغرفة (Copy Room Link) */}
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="flex flex-col items-center gap-1.5 group cursor-pointer active:scale-95 transition-transform"
                    >
                      <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 shadow-md shadow-emerald-500/25 flex items-center justify-center text-white">
                        <Copy className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold text-slate-700 group-hover:text-emerald-600 transition-colors text-center leading-tight">
                        مشاركة الغرفة
                      </span>
                    </button>

                    {/* 5. مشاركة (Share Room) */}
                    <button
                      type="button"
                      onClick={() => setActiveSubModal('share')}
                      className="flex flex-col items-center gap-1.5 group cursor-pointer active:scale-95 transition-transform"
                    >
                      <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-purple-500 via-indigo-600 to-purple-700 shadow-md shadow-purple-500/25 flex items-center justify-center text-white">
                        <Share2 className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold text-slate-700 group-hover:text-purple-600 transition-colors">
                        مشاركة
                      </span>
                    </button>

                    {/* 6. المهام اليومية (Daily Tasks) */}
                    <button
                      type="button"
                      onClick={() => setActiveSubModal('daily_tasks')}
                      className="flex flex-col items-center gap-1.5 group cursor-pointer active:scale-95 transition-transform"
                    >
                      <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-400 via-teal-400 to-emerald-400 shadow-md shadow-teal-400/20 flex items-center justify-center text-slate-950">
                        <span className="text-2xl filter drop-shadow-xs">🪔</span>
                      </div>
                      <span className="text-xs font-bold text-slate-700 group-hover:text-teal-600 transition-colors">
                        المهام اليومية
                      </span>
                    </button>

                    {/* 7. أدوات تفاعلية (Interactive Tools) */}
                    <button
                      type="button"
                      onClick={() => setActiveSubModal('interactive_tools')}
                      className="flex flex-col items-center gap-1.5 group cursor-pointer active:scale-95 transition-transform"
                    >
                      <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-500 shadow-md shadow-rose-500/20 flex items-center justify-center text-white">
                        <Dices className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold text-slate-700 group-hover:text-rose-600 transition-colors">
                        أدوات تفاعلية
                      </span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* ========================================================================= */}
        {/* SUB-MODALS: Interactive popups for all tools and games                    */}
        {/* ========================================================================= */}

        {/* 1. Game Player Launcher Sub-Modal */}
        {activeSubModal && activeSubModal.startsWith('game_') && (
          <div
            className="fixed inset-0 z-60 bg-black/75 flex items-center justify-center p-4"
            onClick={() => setActiveSubModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl p-5 text-white space-y-4 shadow-2xl text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 mx-auto flex items-center justify-center text-3xl shadow-lg shadow-indigo-500/30">
                🎮
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-black text-amber-300">{activeGameTitle}</h3>
                <p className="text-xs text-slate-300">
                  صالة الألعاب التفاعلية الجماعية المباشرة داخل الروم. العب وتحدَّ أصدقاء المايك الآن!
                </p>
              </div>

              <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700 flex items-center justify-between text-xs font-bold">
                <div className="flex items-center gap-1.5 text-amber-400">
                  <Coins className="w-4 h-4 fill-amber-400" />
                  <span>رسوم الدخول: 100 كوينز</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <Trophy className="w-4 h-4" />
                  <span>الجائزة: 10,000 كوينز</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => setActiveSubModal(null)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  onClick={() => {
                    setActiveSubModal(null);
                    onTriggerToast?.(`تم بدء ${activeGameTitle}! استمتع باللعب 🎲✨`);
                  }}
                  className="flex-2 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:brightness-110 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-amber-500/20 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>بدء اللعبة الآن</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* 2. Lucky Box (صندوق حظ) Sub-Modal */}
        {activeSubModal === 'lucky_box' && (
          <div
            className="fixed inset-0 z-60 bg-black/75 flex items-center justify-center p-4"
            onClick={() => setActiveSubModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-gradient-to-b from-pink-950 via-slate-900 to-slate-950 border border-pink-500/40 rounded-3xl p-5 text-white space-y-4 shadow-2xl text-center"
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-1.5 text-pink-300 font-black text-sm">
                  <Gift className="w-4 h-4 text-pink-400" />
                  <span>صندوق الحظ السحري 🎁</span>
                </div>
                <button onClick={() => setActiveSubModal(null)} className="p-1 text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Box Animation / Illustration */}
              <div className="py-4 flex justify-center">
                <motion.div
                  animate={{ scale: luckyBoxOpened ? [1, 1.15, 1] : [1, 1.05, 1] }}
                  transition={{ repeat: luckyBoxOpened ? 0 : Infinity, duration: 2 }}
                  onClick={handleOpenLuckyBox}
                  className="cursor-pointer flex flex-col items-center select-none"
                >
                  <ThreeDLuckyChest isOpen={luckyBoxOpened} size="lg" />
                </motion.div>
              </div>

              {luckyReward ? (
                <div className="p-3 bg-pink-500/20 border border-pink-400/40 rounded-2xl text-center space-y-1">
                  <span className="text-xs font-bold text-pink-200">تهانينا! حصلت على جائزة الحظ:</span>
                  <div className="text-xl font-black text-amber-300">
                    +{luckyReward.amount.toLocaleString()} {luckyReward.type === 'diamonds' ? 'ألماسة 💎' : 'كوينز 🪙'}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-300">
                  اضغط على الصندوق لفتحه واستلام هديتك اليومية من الكوينز والماسات المجانية!
                </p>
              )}

              <button
                onClick={handleOpenLuckyBox}
                className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-600 hover:brightness-110 text-white font-black rounded-xl text-xs shadow-lg shadow-pink-500/30 cursor-pointer"
              >
                {luckyBoxOpened ? 'افتح صندوقاً آخر 🎲' : 'افتح الصندوق الآن 🎁'}
              </button>
            </motion.div>
          </div>
        )}

        {/* 3. Share Room (مشاركة) Sub-Modal */}
        {activeSubModal === 'share' && (
          <div
            className="fixed inset-0 z-60 bg-black/75 flex items-center justify-center p-4"
            onClick={() => setActiveSubModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl p-5 text-white space-y-4 shadow-2xl text-center"
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-1.5 text-purple-300 font-black text-sm">
                  <Share2 className="w-4 h-4 text-purple-400" />
                  <span>مشاركة الغرفة 📢</span>
                </div>
                <button onClick={() => setActiveSubModal(null)} className="p-1 text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-black text-slate-100">{roomTitle}</h4>
                <p className="text-xs text-slate-400">ID الغرفة: {roomId}</p>
              </div>

              {/* Copy Link Input */}
              <div className="flex items-center gap-2 p-2 bg-slate-800 rounded-xl border border-slate-700">
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}/room/${roomId}`}
                  className="flex-1 bg-transparent text-xs text-slate-300 font-mono focus:outline-none truncate"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'تم النسخ' : 'نسخ'}</span>
                </button>
              </div>

              {/* Social Channels Grid */}
              <div className="grid grid-cols-4 gap-2 pt-2">
                {[
                  { name: 'واتساب', icon: '💬', bg: 'bg-emerald-600' },
                  { name: 'تليجرام', icon: '✈️', bg: 'bg-sky-500' },
                  { name: 'سناب شات', icon: '👻', bg: 'bg-amber-400 text-slate-950' },
                  { name: 'تيك توك', icon: '🎵', bg: 'bg-slate-950 border border-slate-700' }
                ].map((s) => (
                  <button
                    key={s.name}
                    onClick={() => {
                      handleCopyLink();
                      onTriggerToast?.(`جاري المشاركة عبر ${s.name}... 📲`);
                    }}
                    className="flex flex-col items-center gap-1 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    <div className={`w-9 h-9 rounded-full ${s.bg} flex items-center justify-center text-base shadow-sm`}>
                      {s.icon}
                    </div>
                    <span className="text-[10px] font-bold text-slate-300">{s.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* 4. Daily Tasks (المهام اليومية) Sub-Modal */}
        {activeSubModal === 'daily_tasks' && (
          <div
            className="fixed inset-0 z-60 bg-black/75 flex items-center justify-center p-4"
            onClick={() => setActiveSubModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-slate-900 border border-teal-500/40 rounded-3xl p-5 text-white space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2 text-teal-300 font-black text-sm">
                  <span className="text-xl">🪔</span>
                  <span>المهام والمكافآت اليومية</span>
                </div>
                <button onClick={() => setActiveSubModal(null)} className="p-1 text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                {[
                  { id: 't1', title: 'البقاء في الغرفة 10 دقائق', reward: '500 كوينز 🪙', progress: '10/10' },
                  { id: 't2', title: 'إرسال هدية لأحد أعضاء المايك', reward: '50 ألماسة 💎', progress: '1/1' },
                  { id: 't3', title: 'الصعود والتحدث على المايك', reward: '1,000 كوينز 🪙', progress: '1/1' },
                  { id: 't4', title: 'مشاركة رابط الغرفة مع صديق', reward: '250 كوينز 🪙', progress: '0/1' }
                ].map((task) => {
                  const isClaimed = claimedTasks[task.id];
                  return (
                    <div
                      key={task.id}
                      className="p-3 bg-slate-800/90 border border-slate-700 rounded-2xl flex items-center justify-between gap-2 text-xs"
                    >
                      <div className="space-y-0.5 min-w-0">
                        <h5 className="font-bold text-slate-100 truncate">{task.title}</h5>
                        <span className="text-[10px] text-amber-300 font-mono">{task.reward}</span>
                      </div>

                      <button
                        onClick={() => handleClaimTask(task.id, task.reward)}
                        disabled={isClaimed}
                        className={`px-3 py-1.5 rounded-xl font-bold text-[10px] shrink-0 transition-all cursor-pointer ${
                          isClaimed
                            ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-teal-400 to-emerald-500 text-slate-950 hover:brightness-110 shadow-sm'
                        }`}
                      >
                        {isClaimed ? 'تم الاستلام ✓' : 'استلام 🎁'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}

        {/* 5. Interactive Tools (أدوات تفاعلية) Sub-Modal */}
        {activeSubModal === 'interactive_tools' && (
          <div
            className="fixed inset-0 z-60 bg-black/75 flex items-center justify-center p-4"
            onClick={() => setActiveSubModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-slate-900 border border-rose-500/40 rounded-3xl p-5 text-white space-y-4 shadow-2xl text-center"
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-1.5 text-rose-300 font-black text-sm">
                  <Dices className="w-4 h-4 text-rose-400" />
                  <span>الأدوات التفاعلية الجماعية 🎲</span>
                </div>
                <button onClick={() => setActiveSubModal(null)} className="p-1 text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Dice Roll Tool */}
                <div className="p-3 bg-slate-800 rounded-2xl border border-slate-700 space-y-2 flex flex-col items-center">
                  <span className="text-xs font-bold text-slate-200">رمي النرد 🎲</span>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-2xl font-black shadow-md">
                    {isRolling ? '🌀' : diceResult || '🎲'}
                  </div>
                  <button
                    onClick={handleRollDice}
                    disabled={isRolling}
                    className="w-full py-1.5 bg-rose-600 hover:bg-rose-500 rounded-xl text-[10px] font-bold cursor-pointer"
                  >
                    ارمِ النرد
                  </button>
                </div>

                {/* Coin Flip Tool */}
                <div className="p-3 bg-slate-800 rounded-2xl border border-slate-700 space-y-2 flex flex-col items-center">
                  <span className="text-xs font-bold text-slate-200">قرعة العملة 🪙</span>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-400 to-amber-500 text-slate-950 flex items-center justify-center text-lg font-black shadow-md">
                    {isRolling ? '🔄' : coinFlipResult === 'heads' ? '👑 ملك' : coinFlipResult === 'tails' ? '🦅 كتابة' : '🪙'}
                  </div>
                  <button
                    onClick={handleFlipCoin}
                    disabled={isRolling}
                    className="w-full py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 rounded-xl text-[10px] font-bold cursor-pointer"
                  >
                    ارمِ العملة
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-slate-400">
                تظهر نتائج القرعة والرمي فوراً لجميع أعضاء الغرفة مباشرة.
              </p>
            </motion.div>
          </div>
        )}

        {/* 6. VIP Room Entrance Showcase & Simulator */}
        {activeSubModal === 'vip_entrance' && (
          <div
            className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4"
            onClick={() => setActiveSubModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-slate-900 border border-amber-500/40 rounded-3xl p-5 text-white space-y-4 shadow-2xl text-center"
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-1.5 text-amber-300 font-black text-sm">
                  <span>🪽</span>
                  <span>معاينة شريط دخول الغرفة الملكي VIP</span>
                </div>
                <button onClick={() => setActiveSubModal(null)} className="p-1 text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-300 font-medium">
                اختر نوع الـ VIP لتشغيل شريط الدخول الفاخر والأجنحة الكريستالية عند ساعة العداد فوراً:
              </p>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    onTestEntrance?.(6, 'تـTarfsرف ☕');
                    setActiveSubModal(null);
                    onClose();
                  }}
                  className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 border border-amber-400/60 hover:border-amber-300 flex items-center justify-between text-xs font-black transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">👑</span>
                    <div className="text-right">
                      <div className="text-yellow-300">VIP 6 - ذهبي ملكي وكوبالت أزرق</div>
                      <div className="text-[10px] text-yellow-200/70 font-normal">مطابق تماماً لصورة الروم (تـTarfsرف ☕)</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-mono">تشغيل</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onTestEntrance?.(10, 'القيصر الأسطوري 🌌');
                    setActiveSubModal(null);
                    onClose();
                  }}
                  className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20 border border-pink-400/60 hover:border-pink-300 flex items-center justify-between text-xs font-black transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">💎</span>
                    <div className="text-right">
                      <div className="text-pink-300">VIP 10 - ماسي كوني ساطع</div>
                      <div className="text-[10px] text-pink-200/70 font-normal">أجنحة شمسية مشعة وألوان متغيرة</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white text-[10px] font-mono">تشغيل</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onTestEntrance?.(8, 'الفارس الياقوتي ⚔️');
                    setActiveSubModal(null);
                    onClose();
                  }}
                  className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-rose-500/20 via-red-500/20 to-purple-500/20 border border-rose-400/60 hover:border-rose-300 flex items-center justify-between text-xs font-black transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🔥</span>
                    <div className="text-right">
                      <div className="text-rose-300">VIP 8 - ياقوتي إمبراطوري</div>
                      <div className="text-[10px] text-rose-200/70 font-normal">أجنحة نارية حمراء وبنفسجية مهيبة</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-mono">تشغيل</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onTestEntrance?.(3, 'أمير الزبرجد 🌿');
                    setActiveSubModal(null);
                    onClose();
                  }}
                  className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-500/20 border border-emerald-400/60 hover:border-emerald-300 flex items-center justify-between text-xs font-black transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🍃</span>
                    <div className="text-right">
                      <div className="text-emerald-300">VIP 3 - زمردي أرستقراطي</div>
                      <div className="text-[10px] text-emerald-200/70 font-normal">أجنحة بلورية خضراء زمردية وفضية</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-mono">تشغيل</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </AnimatePresence>
  );
};

export const YoHoRoomToolsAndGamesModal = NajmRoomToolsAndGamesModal;
export default NajmRoomToolsAndGamesModal;
