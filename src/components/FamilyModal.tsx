import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Shield, 
  Users, 
  Crown, 
  Trophy, 
  Swords, 
  Sparkles, 
  Radio, 
  Gamepad2, 
  MessageSquare, 
  ChevronRight,
  Flame,
  Volume2,
  Megaphone,
  Award,
  History,
  Calendar,
  Sparkle,
  Lock,
  Check,
  KeyRound
} from 'lucide-react';

interface FamilyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRoom?: (roomId: string) => void;
}

export const FamilyModal: React.FC<FamilyModalProps> = ({ isOpen, onClose, onSelectRoom }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'rooms'>('profile');

  // Global Lock state listener
  const [globalLockData, setGlobalLockData] = useState<{ isLocked: boolean; password?: string }>(() => {
    const saved = localStorage.getItem('global_room_lock_status');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return { isLocked: false, password: '' };
  });

  const [showPinModal, setShowPinModal] = useState<boolean>(false);
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');
  const [pendingRoomId, setPendingRoomId] = useState<string | null>(null);

  useEffect(() => {
    const syncLock = () => {
      const saved = localStorage.getItem('global_room_lock_status');
      if (saved) {
        try {
          setGlobalLockData(JSON.parse(saved));
        } catch (e) {}
      }
    };
    window.addEventListener('room_lock_updated', syncLock);
    window.addEventListener('storage', syncLock);
    return () => {
      window.removeEventListener('room_lock_updated', syncLock);
      window.removeEventListener('storage', syncLock);
    };
  }, []);

  const handleVerifyPin = () => {
    if (!enteredPin || enteredPin.length !== 6) {
      setPinError('يرجى إدخال الرمز المكون من 6 أرقام بالضبط 🔢');
      return;
    }
    const correctPassword = globalLockData.password || '123456';
    if (enteredPin === correctPassword) {
      setShowPinModal(false);
      setEnteredPin('');
      setPinError('');
      if (pendingRoomId && onSelectRoom) {
        onSelectRoom(pendingRoomId);
      }
      onClose();
    } else {
      setPinError('الرمز السري غير صحيح! ❌ يرجى المحاولة مجدداً');
    }
  };

  if (!isOpen) return null;

  // Image 1: Prominent Family Members
  const prominentMembers = [
    { rank: 1, name: 'الأمير أسامة (الرئيس)', role: 'قائد العائلة', level: 'VIP8', avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=150', exp: '124.5K' },
    { rank: 2, name: 'سارة الكابيتانو', role: 'نائب القائد', level: 'VIP6', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150', exp: '98.2K' },
    { rank: 3, name: 'فارس الليل', role: 'عضو أسطوري', level: 'VIP5', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150', exp: '76.1K' },
    { rank: 4, name: 'نور الهدى', role: 'عضو نشط', level: 'VIP4', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150', exp: '54.0K' },
  ];

  // Image 2: Avatars List for Members Section (891/980 members)
  const familyMemberAvatars = [
    { id: 1, name: 'ماما جنات', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120', status: 'active' },
    { id: 2, name: 'الربان حازم', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=120', status: 'active' },
    { id: 3, name: 'مريم الأسطورة', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120', status: 'active' },
    { id: 4, name: 'أحمد كابيتانو', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120', status: 'active' },
    { id: 5, name: 'أميرة الشوق', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=120', status: 'inactive' },
    { id: 6, name: 'عاشق القلم', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120', status: 'inactive' },
  ];

  // Image 3: Family Rooms Grid Data
  const familyRooms = [
    {
      id: 'room-1',
      title: 'وكالة شحن فرندلى1 وتسجيل...',
      category: 'دردشة',
      categoryColor: 'bg-emerald-500',
      listeners: 12,
      bgImage: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=400',
      tagText: 'دردشة'
    },
    {
      id: 'room-2',
      title: 'وَكّالَةُ آلَطَيّارَ وَأَوُشَآ',
      category: 'لعبة',
      categoryColor: 'bg-amber-500',
      listeners: 6,
      bgImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=400',
      tagText: 'لعبة'
    },
    {
      id: 'room-3',
      title: 'شحن وشراء تارجت مصر 48...',
      category: 'لعبة',
      categoryColor: 'bg-orange-500',
      listeners: 3,
      bgImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400',
      tagText: 'لعبة'
    },
    {
      id: 'room-4',
      title: 'رُولِيت لَمَّآضِهِ فريندلى1 لتس...',
      category: 'روليت',
      categoryColor: 'bg-purple-600',
      listeners: 13,
      bgImage: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&q=80&w=400',
      tagText: 'روليت'
    },
    {
      id: 'room-5',
      title: 'كل ما هو اسوانى جميل... 💖✨',
      category: 'دردشة',
      categoryColor: 'bg-emerald-500',
      listeners: 2,
      bgImage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=400',
      tagText: 'دردشة'
    },
    {
      id: 'room-6',
      title: '• وگأْلَGEЛA♪ للموآهب ...',
      category: 'إذاعة',
      categoryColor: 'bg-indigo-600',
      listeners: 3,
      bgImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      tagText: 'إذاعة'
    },
  ];

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm pointer-events-auto cursor-default select-none" 
        dir="rtl" 
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md bg-[#0F1420] text-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col pointer-events-auto border border-amber-500/30"
        >
          {/* Top Bar Navigation Tabs */}
          <div className="bg-[#161C2C] border-b border-white/10 px-4 py-2.5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5 text-xs font-bold">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ملف الأسرة
              </button>
              <button
                onClick={() => setActiveTab('rooms')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'rooms'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                غرفة عائلية ({familyRooms.length})
              </button>
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                نظرة عامة
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* TAB 1: FULL FAMILY PROFILE (Design from Image 2) */}
          {activeTab === 'profile' && (
            <div className="flex-1 overflow-y-auto no-scrollbar pb-6">
              {/* Golden Crown Diamond Header Banner */}
              <div className="relative w-full h-64 bg-gradient-to-b from-amber-950/60 via-[#181108] to-[#0F1420] p-4 flex flex-col items-center justify-center overflow-hidden border-b border-amber-500/20">
                {/* Golden Rays Background Effect */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/20 via-transparent to-transparent pointer-events-none" />
                
                {/* Top Title Bar */}
                <div className="absolute top-3 right-4 flex items-center gap-2 text-amber-200 font-bold text-sm">
                  <span>friendly 1 ☯</span>
                  <ChevronRight className="w-4 h-4 text-amber-400" />
                </div>

                {/* Eagle Crest Diamond Frame */}
                <div className="relative mt-4 w-36 h-36 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-tr from-amber-600 via-amber-300 to-yellow-500 rotate-45 rounded-2xl p-1 shadow-[0_0_30px_rgba(245,158,11,0.4)]">
                    <div className="w-full h-full bg-[#120C06] rounded-xl flex items-center justify-center overflow-hidden border border-amber-300/50">
                      <img 
                        src="https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&q=80&w=300" 
                        alt="Family Crest" 
                        className="w-full h-full object-cover -rotate-45 scale-125"
                      />
                    </div>
                  </div>

                  {/* Level Crown Badge overlay */}
                  <div className="absolute -bottom-2 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-slate-950 font-black text-xs px-3 py-0.5 rounded-full border border-white shadow-lg z-10 flex items-center gap-1">
                    <span>friendly 1 ☯</span>
                  </div>
                </div>

                {/* Family ID */}
                <div className="mt-4 font-mono text-xs text-amber-300/80 font-bold">
                  ID: 33883
                </div>

                {/* Level Crest Left Emblem */}
                <div className="absolute bottom-2 left-4 w-12 h-12 bg-gradient-to-tr from-amber-500 to-yellow-300 rounded-2xl rotate-45 p-0.5 shadow-md">
                  <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center -rotate-45">
                    <Crown className="w-6 h-6 text-amber-400" />
                  </div>
                </div>
              </div>

              <div className="px-5 pt-4 space-y-5">
                {/* 1. Family Bio (السيرة الذاتية للعائلة) */}
                <div className="space-y-1.5">
                  <h3 className="text-xs font-bold text-slate-400">السيرة الذاتية للعائلة</h3>
                  <div className="p-3 bg-[#171E2E] border border-amber-500/20 rounded-2xl text-center text-amber-200 text-xs font-semibold leading-relaxed shadow-sm">
                    ☯ البقاء ليس للأقوى بل للأحن والأوفى ☯
                  </div>
                </div>

                {/* 2. Family Members (أعضاء الأسرة 891/980) */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-extrabold text-white flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-amber-400" />
                      <span>أعضاء الأسرة 891/980</span>
                    </h3>
                  </div>

                  {/* Active vs Inactive Pills */}
                  <div className="bg-[#172033] border border-cyan-500/30 rounded-xl p-2.5 text-center text-xs text-cyan-200 font-bold flex items-center justify-center gap-2">
                    <span className="text-emerald-400">المستخدمون النشطون 608</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400">المستخدمون غير النشطين 283</span>
                  </div>

                  {/* Horizontal Scroll / Grid of Member Avatars */}
                  <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-2 px-1">
                    {familyMemberAvatars.map((m) => (
                      <div key={m.id} className="flex flex-col items-center shrink-0 w-14">
                        <div className="relative w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 to-purple-500 shadow-md">
                          <img src={m.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120'} alt={m.name} className="w-full h-full rounded-full object-cover" />
                          <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${
                            m.status === 'active' ? 'bg-emerald-500' : 'bg-slate-500'
                          }`} />
                        </div>
                        <span className="text-[10px] text-slate-300 font-bold truncate w-full text-center mt-1">
                          {m.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Family Announcement (إعلان عائلي) */}
                <div className="space-y-1.5">
                  <h3 className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                    <Megaphone className="w-4 h-4 text-amber-400" />
                    <span>إعلان عائلي</span>
                  </h3>
                  <div className="p-3.5 bg-[#171E2E] border border-white/10 rounded-2xl text-xs text-slate-200 leading-relaxed font-medium">
                    تصفية اسبوعية للى مش شغال ومش بيفتح والى حاطت صورة مغلق والروم المغلق طرد وشكرا ☯
                  </div>
                </div>

                {/* 4. Contribution Log (سجل المساهمات) */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                    <History className="w-4 h-4 text-amber-400" />
                    <span>سجل المساهمات</span>
                  </h3>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-[#171E2E] border border-white/5 rounded-xl text-xs">
                      <div className="flex items-center gap-2 text-slate-300 font-bold">
                        <Calendar className="w-4 h-4 text-amber-400" />
                        <span>البيانات التاريخية</span>
                      </div>
                      <div className="flex items-center gap-2 font-mono font-black text-amber-300">
                        <span className="text-red-500 flex items-center gap-0.5">
                          <Flame className="w-3.5 h-3.5 fill-red-500" />
                          923444579
                        </span>
                        <span className="bg-amber-500/20 text-amber-300 text-[10px] px-2 py-0.5 rounded-md border border-amber-500/30">
                          TOP29
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-[#171E2E] border border-white/5 rounded-xl text-xs">
                      <div className="flex items-center gap-2 text-slate-300 font-bold">
                        <Award className="w-4 h-4 text-purple-400" />
                        <span>البيانات الشهرية</span>
                      </div>
                      <div className="flex items-center gap-2 font-mono font-black text-amber-300">
                        <span className="text-red-500 flex items-center gap-0.5">
                          <Flame className="w-3.5 h-3.5 fill-red-500" />
                          200092680
                        </span>
                        <span className="bg-amber-500/20 text-amber-300 text-[10px] px-2 py-0.5 rounded-md border border-amber-500/30">
                          TOP29
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AVAILABLE FAMILY ROOMS (Design from Image 3 - غرفة عائلية) */}
          {activeTab === 'rooms' && (
            <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-sm font-extrabold text-amber-300 flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-amber-400" />
                  <span>غرفة عائلية (غرف العائلة المتاحة)</span>
                </h3>
                <span className="text-xs text-slate-400 font-mono">friendly 1 ☯</span>
              </div>

              {/* 2-Column Grid of Room Cards matching Image 3 */}
              <div className="grid grid-cols-2 gap-3">
                {familyRooms.map((room) => {
                  const isLocked = (room as any).isLocked || (room.id === 'room-1' && globalLockData.isLocked);
                  return (
                    <motion.div
                      key={room.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        if (isLocked) {
                          setPendingRoomId(room.id);
                          setShowPinModal(true);
                          setEnteredPin('');
                          setPinError('');
                        } else {
                          if (onSelectRoom) onSelectRoom(room.id);
                          onClose();
                        }
                      }}
                      className="relative bg-[#171E2E] border border-amber-500/20 rounded-2xl overflow-hidden flex flex-col shadow-lg cursor-pointer group"
                    >
                      {/* Room Poster Thumbnail */}
                      <div className="relative h-36 w-full overflow-hidden bg-slate-900">
                        <img 
                          src={room.bgImage || 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&q=80&w=300'} 
                          alt={room.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        />

                        {/* Lock Overlay Badge if Room is Locked (مؤشر القفل في غرف العائلة) */}
                        {isLocked && (
                          <div className="absolute top-2 left-2 z-20 bg-rose-600/90 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/50 shadow-md backdrop-blur-xs flex items-center gap-1 text-[9px] font-black animate-pulse" title="الغرفة مقفلة برمز سري 🔒">
                            <Lock className="w-3 h-3 text-amber-400 stroke-[2.5]" />
                            <span>مقفل</span>
                          </div>
                        )}

                        {/* Top Overlay Badge & Listeners Count */}
                        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none">
                          {/* Active Listener Count */}
                          <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] text-emerald-400 font-mono font-bold border border-white/10">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                            <span>{room.listeners}</span>
                          </div>

                          {/* Category Tag Badge */}
                          <div className={`px-2 py-0.5 rounded-full text-[10px] font-black text-white ${room.categoryColor} shadow-md`}>
                            {room.tagText}
                          </div>
                        </div>
                      </div>

                      {/* Room Title */}
                      <div className="p-2.5 bg-[#121826] flex items-center justify-between gap-1">
                        <span className="text-xs font-bold text-slate-100 truncate w-full text-right dir-rtl flex items-center gap-1">
                          <span className="truncate">{room.title}</span>
                          {isLocked && <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0 stroke-[2.5]" />}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: OVERVIEW & PROMINENT MEMBERS (Design from Image 1) */}
          {activeTab === 'overview' && (
            <div className="flex-1 overflow-y-auto no-scrollbar">
              {/* Header Banner */}
              <div className="relative bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 p-6 text-white text-center overflow-hidden shrink-0 border-b border-purple-500/20">
                {/* Shield Crest */}
                <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-tr from-amber-400 via-purple-500 to-indigo-600 p-1 shadow-lg mb-3 relative flex items-center justify-center">
                  <div className="w-full h-full bg-purple-950 rounded-xl flex items-center justify-center border border-amber-300/40">
                    <Shield className="w-10 h-10 text-amber-300 fill-amber-300/30" />
                  </div>
                  <span className="absolute -bottom-2 bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 font-black text-xs px-3 py-0.5 rounded-full border border-white shadow-md">
                    Lv.12
                  </span>
                </div>

                <h2 className="text-2xl font-black tracking-tight text-white">عائلة الفرسان</h2>
                <div className="flex items-center justify-center gap-3 text-xs text-purple-200 mt-2 font-semibold">
                  <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-full border border-white/10">
                    <Trophy className="w-3.5 h-3.5 text-amber-300" />
                    <span>الترتيب اليومي: #3</span>
                  </span>
                  <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-full border border-white/10">
                    <Users className="w-3.5 h-3.5 text-purple-300" />
                    <span>48 / 50 عضو</span>
                  </span>
                </div>
              </div>

              {/* Family Stats & Members */}
              <div className="p-5 space-y-4">
                {/* Battle Points & Level Progress */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#171E2E] border border-purple-500/30 p-3.5 rounded-2xl text-center">
                    <div className="text-xs text-purple-300 font-bold flex items-center justify-center gap-1">
                      <Swords className="w-3.5 h-3.5" />
                      <span>نقاط معارك العائلة</span>
                    </div>
                    <div className="text-lg font-black text-amber-300 mt-1 font-mono">482,900</div>
                  </div>
                  <div className="bg-[#171E2E] border border-indigo-500/30 p-3.5 rounded-2xl text-center">
                    <div className="text-xs text-indigo-300 font-bold flex items-center justify-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>مستوى التفاعل</span>
                    </div>
                    <div className="text-lg font-black text-emerald-400 mt-1">ممتاز (Top 1%)</div>
                  </div>
                </div>

                {/* Top Family Members Header */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                      <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span>أعضاء العائلة البارزون</span>
                    </h3>
                  </div>

                  <div className="space-y-2">
                    {prominentMembers.map((member) => (
                      <div
                        key={member.rank}
                        className="flex items-center justify-between p-3 rounded-2xl bg-[#171E2E] border border-white/5"
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-5 text-center font-black text-xs ${
                            member.rank === 1 ? 'text-amber-400' : member.rank === 2 ? 'text-slate-300' : 'text-amber-600'
                          }`}>
                            #{member.rank}
                          </span>
                          <img src={member.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120'} alt={member.name} className="w-10 h-10 rounded-full object-cover border-2 border-amber-500/30 shadow-xs" />
                          <div>
                            <div className="text-xs font-bold text-white flex items-center gap-1.5">
                              <span>{member.name}</span>
                              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-black px-1.5 py-0.2 rounded">
                                {member.level}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5">{member.role}</div>
                          </div>
                        </div>
                        <div className="text-left font-mono font-bold text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-lg">
                          {member.exp}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Footer Button */}
          <div className="p-3 bg-[#121724] border-t border-white/10 flex gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('rooms')}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs shadow-md hover:brightness-110 transition-all cursor-pointer text-center"
            >
              عرض جميع غرف العائلة ({familyRooms.length})
            </button>
          </div>
        </motion.div>

        {/* PIN CODE INPUT DIALOG FOR LOCKED FAMILY ROOMS */}
        <AnimatePresence>
          {showPinModal && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 pointer-events-auto" dir="rtl" onClick={(e) => e.stopPropagation()}>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white shadow-2xl relative space-y-4"
              >
                <button
                  onClick={() => {
                    setShowPinModal(false);
                    setEnteredPin('');
                    setPinError('');
                  }}
                  className="absolute top-3 left-3 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                    <Lock className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-white">غرفة عائلية مقفلة 🔒</h3>
                    <p className="text-[11px] text-slate-400">أدخل الرمز السري المكون من 6 أرقام للدخول</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <input
                    type="password"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    placeholder="رمز الدخول (6 أرقام)..."
                    value={enteredPin}
                    onChange={(e) => {
                      const onlyDigits = e.target.value.replace(/\D/g, '');
                      setEnteredPin(onlyDigits);
                      setPinError('');
                    }}
                    className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-4 py-3 text-center text-xl font-mono font-bold tracking-widest text-amber-400 focus:outline-none focus:border-amber-500/80"
                    autoFocus
                  />
                  {pinError && (
                    <p className="text-xs font-bold text-rose-400 text-center">{pinError}</p>
                  )}
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={handleVerifyPin}
                    className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>تأكيد ودخول الروم</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowPinModal(false);
                      setEnteredPin('');
                      setPinError('');
                    }}
                    className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    إلغاء
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </AnimatePresence>
  );
};
