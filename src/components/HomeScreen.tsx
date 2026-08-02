import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { VoiceRoomScreen } from './VoiceRoomScreen';
import {
  Search,
  Crown,
  Menu,
  Star,
  Sparkles,
  Calendar,
  X,
  Mic,
  Gift,
  Film,
  Gamepad2,
  Disc,
  Volume2
} from 'lucide-react';

interface RoomData {
  id: string;
  title: string;
  host: string;
  listenersCount: number;
  image: string;
  badge?: {
    type: 'text' | 'icon';
    content: string;
    bgColor: string;
    textColor?: string;
  };
  hasPlusAvatar?: boolean;
  avatars: string[];
}

interface HomeScreenProps {
  onOpenRecharge?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onOpenRecharge }) => {
  const [activeTopTab, setActiveTopTab] = useState<'related' | 'popular' | 'nearby'>('popular');
  const [selectedRoomModal, setSelectedRoomModal] = useState<RoomData | null>(null);
  const [activeVoiceRoom, setActiveVoiceRoom] = useState<RoomData | null>(null);

  // Exact room data matching the user's uploaded reference screenshot
  const roomList: RoomData[] = [
    {
      id: 'room-1',
      title: 'إعتزل ما يؤذيك.',
      host: 'طبيبة القلوب',
      listenersCount: 6,
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      badge: {
        type: 'text',
        content: 'عشوائي',
        bgColor: 'bg-[#00b0ff]',
        textColor: 'text-white'
      },
      hasPlusAvatar: false,
      avatars: [
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=100',
        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100'
      ]
    },
    {
      id: 'room-2',
      title: 'سَنُقْرِئُكَ فَلَا تَنَسَىٰ ۝ إِلَّا مَا شَاءَ...',
      host: 'وكالة الجابري',
      listenersCount: 4,
      image: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&q=80&w=400',
      badge: {
        type: 'icon',
        content: 'film',
        bgColor: 'bg-gradient-to-tr from-purple-600 to-indigo-500',
        textColor: 'text-amber-300'
      },
      hasPlusAvatar: true,
      avatars: [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100'
      ]
    },
    {
      id: 'room-3',
      title: 'وكاله ZEUS لتسجيل المضيفين',
      host: 'وكالة زيوس ZEUS',
      listenersCount: 3,
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=400',
      badge: {
        type: 'text',
        content: 'دردشة',
        bgColor: 'bg-[#00E676]',
        textColor: 'text-slate-950'
      },
      hasPlusAvatar: true,
      avatars: [
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=100',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100'
      ]
    },
    {
      id: 'room-4',
      title: 'يااااارب',
      host: 'أمل العاطفة',
      listenersCount: 3,
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400',
      badge: {
        type: 'icon',
        content: 'game',
        bgColor: 'bg-gradient-to-tr from-amber-500 to-orange-500',
        textColor: 'text-white'
      },
      hasPlusAvatar: false,
      avatars: [
        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100'
      ]
    },
    {
      id: 'room-5',
      title: '... | وكالة القبطان',
      host: 'القبطان MA',
      listenersCount: 28,
      image: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80&w=400',
      badge: {
        type: 'text',
        content: 'DJ',
        bgColor: 'bg-cyan-500',
        textColor: 'text-slate-950'
      },
      hasPlusAvatar: true,
      avatars: [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=100',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100'
      ]
    },
    {
      id: 'room-6',
      title: 'مشرفة وكآلة آلعهد لتس...',
      host: 'العهـد للمضيفين',
      listenersCount: 12,
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
      badge: {
        type: 'text',
        content: 'دردشة',
        bgColor: 'bg-[#00E676]',
        textColor: 'text-slate-950'
      },
      hasPlusAvatar: true,
      avatars: [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=100',
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=100',
        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8faf8] text-slate-900 pb-28 font-sans select-none relative" dir="rtl">
      {/* 1. TOP HEADER BAR WITH SOFT GRADIENT */}
      <div className="bg-gradient-to-b from-[#e1f3e7] via-[#ebf7ef] to-[#f8faf8] px-4 pt-3 pb-2">
        <div className="flex items-center justify-between">
          {/* Tabs: Related | Popular | Nearby */}
          <div className="flex items-center gap-6 text-sm font-extrabold">
            <button
              onClick={() => setActiveTopTab('related')}
              className={`cursor-pointer transition-colors relative pb-1 ${
                activeTopTab === 'related' ? 'text-slate-900 font-black text-base' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              متعلق
              {activeTopTab === 'related' && (
                <span className="absolute bottom-0 right-0 left-0 h-1 bg-slate-950 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTopTab('popular')}
              className={`cursor-pointer transition-colors relative pb-1 ${
                activeTopTab === 'popular' ? 'text-slate-950 font-black text-lg' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              شعبي
              {activeTopTab === 'popular' && (
                <span className="absolute bottom-0 right-0 left-0 h-1 bg-[#101828] rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTopTab('nearby')}
              className={`cursor-pointer transition-colors relative pb-1 ${
                activeTopTab === 'nearby' ? 'text-slate-900 font-black text-base' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              المجاورون
              {activeTopTab === 'nearby' && (
                <span className="absolute bottom-0 right-0 left-0 h-1 bg-slate-950 rounded-full" />
              )}
            </button>
          </div>

          {/* Left Side Icons: Hexagon Logo, Search, VIP Crown */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-green-400 text-white flex items-center justify-center shadow-xs cursor-pointer">
              <div className="w-4 h-4 rounded-xs border-2 border-white rotate-45 flex items-center justify-center">
                <span className="w-1.5 h-1.5 bg-white rounded-full" />
              </div>
            </div>

            <button className="w-8 h-8 flex items-center justify-center text-slate-800 hover:text-black cursor-pointer transition-colors">
              <Search className="w-5 h-5 stroke-[2.5]" />
            </button>

            <button
              onClick={onOpenRecharge}
              className="w-8 h-8 flex items-center justify-center text-amber-500 hover:scale-105 cursor-pointer transition-transform"
              title="شحن الكوينز"
            >
              <Crown className="w-6 h-6 fill-amber-400 text-amber-600 drop-shadow-xs" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-3 space-y-3 pt-1">
        {/* 2. TOP CAROUSEL BANNER */}
        <div
          onClick={onOpenRecharge}
          className="relative rounded-3xl bg-gradient-to-r from-[#2c1300] via-[#5c3708] to-[#1f0d01] text-white p-4 shadow-md border border-amber-500/40 overflow-hidden cursor-pointer group"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(251,191,36,0.35),transparent_70%)] pointer-events-none" />

          <div className="relative z-10 flex items-center justify-between">
            <div className="space-y-1 max-w-[62%]">
              <div className="text-[10px] font-mono font-bold text-amber-200/90 dir-ltr text-right">
                -00:00 7\28 (UTC+2) 24:00 7\31
              </div>
              <h2 className="text-xl font-black text-amber-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] tracking-tight">
                مسابقة هدايا الحظ 🎁
              </h2>
              <p className="text-[11px] text-amber-100 font-bold leading-tight">
                اربح ملايين الكوينز والصناديق الملكية الفاخرة!
              </p>
            </div>

            <div className="relative shrink-0">
              <div className="w-20 h-20 bg-gradient-to-tr from-amber-500 via-yellow-300 to-amber-200 rounded-2xl p-0.5 shadow-xl flex items-center justify-center transform group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-slate-950/90 rounded-2xl p-2 flex flex-col items-center justify-center text-center">
                  <Gift className="w-8 h-8 text-amber-300 fill-amber-400 animate-bounce" />
                  <span className="text-[9px] font-black text-amber-300 mt-0.5">جوائز كبرى</span>
                </div>
              </div>
              <Sparkles className="w-5 h-5 text-amber-300 absolute -top-2 -right-2 animate-pulse" />
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5 mt-3">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((dot) => (
              <span
                key={dot}
                className={`rounded-full transition-all ${
                  dot === 0 ? 'w-5 h-1.5 bg-white shadow-xs' : 'w-1.5 h-1.5 bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>

        {/* 3. FILTER CHIPS ROW */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5" dir="rtl">
          <button className="p-2.5 rounded-2xl bg-white border border-slate-200/80 text-slate-700 hover:bg-slate-50 cursor-pointer shrink-0 shadow-2xs">
            <Menu className="w-4 h-4" />
          </button>

          <button className="px-3.5 py-1.5 rounded-2xl bg-white border border-slate-200/80 text-slate-800 text-xs font-black shrink-0 flex items-center gap-1.5 hover:bg-slate-50 cursor-pointer shadow-2xs">
            <span>مصر</span>
            <span className="text-sm">🇪🇬</span>
          </button>

          <button className="px-3.5 py-1.5 rounded-2xl bg-white border border-slate-200/80 text-slate-800 text-xs font-black shrink-0 flex items-center gap-1.5 hover:bg-slate-50 cursor-pointer shadow-2xs">
            <span>الإمارات العربية المتحدة</span>
            <span className="text-sm">🇦🇪</span>
          </button>

          <button className="px-3.5 py-1.5 rounded-2xl bg-[#dff5df] text-[#15803d] border border-emerald-300/60 text-xs font-black shrink-0 flex items-center gap-1.5 cursor-pointer shadow-2xs">
            <Star className="w-3.5 h-3.5 fill-[#15803d]" />
            <span>التوصيات</span>
          </button>
        </div>

        {/* 4. ROOMS GRID MATCHING SCREENSHOT EXACTLY */}
        <div className="grid grid-cols-2 gap-3">
          {roomList.map((room) => (
            <div key={room.id} className="flex flex-col space-y-1">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedRoomModal(room)}
                className="relative h-48 w-full bg-slate-900 rounded-3xl overflow-hidden shadow-xs border border-slate-100 cursor-pointer group"
              >
                {/* Room Image */}
                <img
                  src={room.image}
                  alt={room.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Dark Bottom Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-black/20 to-transparent" />

                {/* BOTTOM LEFT WIDGET: Overlapping Avatars + Attendance Number + Cyan Signal Indicator */}
                <div className="absolute bottom-2 left-2 flex flex-col items-start gap-1 z-10">
                  {/* Overlapping Avatars Row */}
                  <div className="flex items-center -space-x-2 space-x-reverse">
                    {room.hasPlusAvatar && (
                      <div className="w-6 h-6 rounded-full bg-white/80 backdrop-blur-xs border border-slate-900 text-slate-950 font-black text-[10px] flex items-center justify-center z-20 shadow-xs">
                        +
                      </div>
                    )}
                    {room.avatars.map((av, idx) => (
                      <img
                        key={idx}
                        src={av}
                        alt="listener"
                        className="w-6 h-6 rounded-full border border-slate-900 object-cover shadow-xs"
                      />
                    ))}
                  </div>

                  {/* Attendance Count & Cyan Signal Bars */}
                  <div className="flex items-center gap-1 text-white font-mono font-black text-xs drop-shadow-md">
                    <span>{room.listenersCount}</span>
                    {/* Vibrant Cyan Equalizer Signal Indicator */}
                    <div className="flex items-end gap-0.5 h-3 px-0.5">
                      <span className="w-0.5 h-1.5 bg-[#00E676] rounded-xs animate-pulse" />
                      <span className="w-0.5 h-2.5 bg-[#00E676] rounded-xs" />
                      <span className="w-0.5 h-3 bg-[#00E676] rounded-xs animate-pulse" />
                    </div>
                  </div>
                </div>

                {/* BOTTOM RIGHT TAG BADGE */}
                {room.badge && (
                  <div className="absolute bottom-2.5 right-2.5 z-10">
                    {room.badge.type === 'text' ? (
                      <span
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-black shadow-md ${room.badge.bgColor} ${room.badge.textColor || 'text-white'}`}
                      >
                        {room.badge.content}
                      </span>
                    ) : (
                      <div
                        className={`w-8 h-8 rounded-full ${room.badge.bgColor} p-1.5 shadow-md flex items-center justify-center text-white border border-white/30`}
                      >
                        {room.badge.content === 'film' ? (
                          <Film className="w-4 h-4 fill-amber-300 text-amber-300" />
                        ) : (
                          <Gamepad2 className="w-4 h-4 text-white" />
                        )}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>

              {/* ROOM TITLE DIRECTLY BELOW CARD */}
              <h3 className="text-xs font-extrabold text-slate-900 px-1 truncate dir-rtl leading-tight">
                {room.title}
              </h3>
            </div>
          ))}
        </div>

        {/* 5. EGYPTIAN PHARAOH LUXURY BANNER AT BOTTOM */}
        <div className="relative rounded-3xl bg-gradient-to-r from-[#190d03] via-[#3d2407] to-[#140a02] text-white p-3.5 border border-amber-500/30 shadow-md overflow-hidden flex items-center justify-between">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 shrink-0 shadow-sm">
            <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-amber-400" />
            </div>
          </div>

          <div className="text-right flex-1 px-3">
            <div className="text-xs font-black text-amber-300">من باشا مصر 🦅</div>
            <p className="text-[10px] text-amber-100/80 font-bold line-clamp-1">
              إلى الداعم المتألق أخي وصديقي الروسي...
            </p>
          </div>

          <div className="w-10 h-10 rounded-full border-2 border-amber-400 overflow-hidden shrink-0 shadow-xs">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
              alt="Basha"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* 6. FLOATING DAILY CHECK-IN ACTION WIDGET */}
      <div className="fixed bottom-16 left-3 z-30">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onOpenRecharge}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 via-orange-400 to-yellow-300 p-1 shadow-2xl flex items-center justify-center cursor-pointer border-2 border-white relative animate-bounce"
        >
          <div className="w-full h-full bg-gradient-to-b from-amber-400 via-orange-500 to-amber-600 rounded-full flex flex-col items-center justify-center text-white text-center shadow-inner">
            <Calendar className="w-7 h-7 stroke-[2.5]" />
          </div>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white ring-1 ring-red-400" />
        </motion.button>
      </div>

      {/* ROOM LIVE MODAL POPUP */}
      <AnimatePresence>
        {selectedRoomModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm" dir="rtl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-sm bg-slate-900 text-white rounded-3xl p-5 shadow-2xl border border-amber-500/30 space-y-4 text-center relative overflow-hidden"
            >
              <button
                onClick={() => setSelectedRoomModal(null)}
                className="absolute top-3 left-3 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-20 h-20 mx-auto rounded-full border-4 border-amber-400 overflow-hidden shadow-lg">
                <img
                  src={selectedRoomModal.image}
                  alt={selectedRoomModal.host}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-black text-amber-300">{selectedRoomModal.title}</h3>
                <p className="text-xs text-slate-300 font-bold">المضيف: {selectedRoomModal.host}</p>
              </div>

              <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/80 flex items-center justify-around text-xs font-mono">
                <div>
                  <span className="text-slate-400 block text-[10px]">المستمعون</span>
                  <span className="text-amber-400 font-black">{selectedRoomModal.listenersCount}</span>
                </div>
                <div className="h-6 w-px bg-slate-700" />
                <div>
                  <span className="text-slate-400 block text-[10px]">جودة الصوت</span>
                  <span className="text-emerald-400 font-black">عالية HD 🎙️</span>
                </div>
              </div>

              <button
                onClick={() => {
                  const currentRoom = selectedRoomModal;
                  setSelectedRoomModal(null);
                  setActiveVoiceRoom(currentRoom);
                }}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-sm rounded-2xl shadow-lg hover:opacity-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <Mic className="w-4 h-4 fill-slate-950" />
                <span>دخول الميكروفون والبث المباشر</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FULL SCREEN VOICE ROOM INTERIOR */}
      {activeVoiceRoom && (
        <VoiceRoomScreen
          roomTitle={activeVoiceRoom.title}
          hostName={activeVoiceRoom.host}
          roomId="77989080"
          onClose={() => setActiveVoiceRoom(null)}
          onOpenRecharge={onOpenRecharge}
        />
      )}
    </div>
  );
};
