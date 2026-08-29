import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ArrowRight,
  Shield, 
  Users, 
  Crown, 
  Trophy, 
  Swords, 
  Sparkles, 
  Radio, 
  Gamepad2, 
  MessageSquare, 
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Flame,
  Volume2,
  Megaphone,
  Award,
  History,
  Calendar,
  Sparkle,
  Lock,
  Check,
  KeyRound,
  Plus,
  Share2,
  Search,
  CheckCircle2,
  SlidersHorizontal,
  Info,
  UserCheck
} from 'lucide-react';
import { CastleEmblem, getCastleTierByLevel } from './family/CastleEmblem';
import { CastleEvolutionModal } from './family/CastleEvolutionModal';
import { FamilyMembersModal, FamilyMember } from './family/FamilyMembersModal';
import { TarafLogo } from './common/TarafLogo';

interface FamilyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRoom?: (roomId: string) => void;
}

export const FamilyModal: React.FC<FamilyModalProps> = ({ isOpen, onClose, onSelectRoom }) => {
  // Family state
  const [familyLevel, setFamilyLevel] = useState<number>(12);
  const [familyExp, setFamilyExp] = useState<number>(78500);
  const [nextLevelExp, setNextLevelExp] = useState<number>(100000);
  const [showCastleModal, setShowCastleModal] = useState<boolean>(false);
  const [showMembersModal, setShowMembersModal] = useState<boolean>(false);
  const [isStatsCollapsed, setIsStatsCollapsed] = useState<boolean>(false);

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

  const castleTier = getCastleTierByLevel(familyLevel);

  // Supervisors & Admins Data (المشرفين والإدارة) - will be displayed in the horizontal scroll bar
  const supervisors = [
    {
      id: 'sup-1',
      rank: 1,
      name: 'الأمير أسامة (الرئيس)',
      role: 'قائد العائلة وحامي القلعة',
      roleBadge: 'قائد القلعة',
      level: 'VIP8',
      avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=150',
      exp: '124.5K',
      isOnline: true,
      crownColor: 'from-amber-500 to-yellow-300'
    },
    {
      id: 'sup-2',
      rank: 2,
      name: 'سارة الكابيتانو',
      role: 'نائب القائد وإدارة الفرسان',
      roleBadge: 'نائب القائد',
      level: 'VIP6',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      exp: '98.2K',
      isOnline: true,
      crownColor: 'from-slate-400 to-slate-200'
    },
    {
      id: 'sup-3',
      rank: 3,
      name: 'فارس الليل',
      role: 'كبير المشرفين ومنسق الغرف',
      roleBadge: 'مشرف أول',
      level: 'VIP5',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      exp: '76.1K',
      isOnline: true,
      crownColor: 'from-amber-600 to-amber-400'
    },
    {
      id: 'sup-4',
      rank: 4,
      name: 'نور الهدى',
      role: 'مشرفة الفعاليات والمسابقات',
      roleBadge: 'مشرف فعاليات',
      level: 'VIP4',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
      exp: '54.0K',
      isOnline: false,
      crownColor: 'from-purple-500 to-indigo-400'
    }
  ];

  // Family Rooms (الرومات العائلية)
  const familyRooms = [
    {
      id: 'room-1',
      title: 'وكالة شحن فرندلى1 وتسجيل الفرسان...',
      category: 'دردشة',
      categoryColor: 'from-amber-600 to-yellow-500',
      listeners: 18,
      isLocked: false,
      hostName: 'الأمير أسامة',
      hostAvatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=150',
      bgImage: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=400',
      tagText: 'دردشة الفرسان'
    },
    {
      id: 'room-2',
      title: 'وَكّالَةُ آلَطَيّارَ وَأَوُشَآ - ألعاب وسهر',
      category: 'لعبة',
      categoryColor: 'from-amber-700 to-amber-500',
      listeners: 12,
      isLocked: false,
      hostName: 'سارة الكابيتانو',
      hostAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      bgImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=400',
      tagText: 'تحديات وألعاب'
    },
    {
      id: 'room-3',
      title: 'شحن وشراء تارجت مصر 48 - قلعة ترف',
      category: 'مسابقات',
      categoryColor: 'from-yellow-600 to-amber-600',
      listeners: 8,
      isLocked: false,
      hostName: 'فارس الليل',
      hostAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      bgImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400',
      tagText: 'مسابقات وجوائز'
    },
    {
      id: 'room-4',
      title: 'رُولِيت لَمَّآضِهِ فريندلى1 الملكي 🔒',
      category: 'روليت',
      categoryColor: 'from-purple-700 to-indigo-600',
      listeners: 14,
      isLocked: true,
      hostName: 'نور الهدى',
      hostAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
      bgImage: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&q=80&w=400',
      tagText: 'روليت VIP'
    },
    {
      id: 'room-5',
      title: 'كل ما هو اسوانى وطرب جميل... 💖✨',
      category: 'طرب',
      categoryColor: 'from-emerald-700 to-teal-600',
      listeners: 9,
      isLocked: false,
      hostName: 'الربان حازم',
      hostAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=120',
      bgImage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=400',
      tagText: 'صوتيات وطرب'
    },
    {
      id: 'room-6',
      title: '• وگأْلَGEЛA♪ للموآهب والبثوث المباشرة',
      category: 'إذاعة',
      categoryColor: 'from-blue-700 to-indigo-600',
      listeners: 6,
      isLocked: false,
      hostName: 'مريم الأسطورة',
      hostAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
      bgImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      tagText: 'إذاعة ومواهب'
    },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: '100%' }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 320 }}
        className="fixed inset-0 z-50 bg-[#FBF9F4] text-slate-900 flex flex-col pointer-events-auto select-none overflow-hidden"
        dir="rtl"
      >
        {/* TOP ROYAL APP BAR (شريط العنوان الملكي مع زر الرجوع) */}
        <header className="sticky top-0 z-40 bg-gradient-to-r from-[#FFFDF9] via-[#FAF5E8] to-[#FFFDF9] border-b border-[#E8DFC8] px-4 py-3 flex items-center justify-between shadow-[0_2px_12px_rgba(180,160,130,0.1)]">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-2xl bg-white/90 border border-[#E8DFC8] shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-center justify-center text-[#5C3F13] hover:text-[#B38022] hover:bg-white active:scale-95 transition-all cursor-pointer"
              title="رجوع"
            >
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </button>

            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base sm:text-lg font-black text-[#5C3F13] tracking-tight">
                  عائلة الفرسان الذهبية ☯
                </h1>
                <span className="bg-gradient-to-r from-[#B38022] to-[#5C3F13] text-[#FFF9E6] text-[9px] font-black px-2 py-0.5 rounded-full font-mono shadow-xs">
                  Lv.{familyLevel}
                </span>
              </div>
              <p className="text-[10px] text-[#A89478] font-bold">
                منظومة القلعة العائلية الملكية • ترف شات
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCastleModal(true)}
              className="px-3 py-1.5 bg-gradient-to-r from-[#FAF5E8] to-[#F1E6CD] border border-[#DFC386] rounded-xl text-[#755013] font-black text-xs shadow-xs hover:shadow-md active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Crown className="w-4 h-4 text-[#B38022] fill-[#B38022]" />
              <span className="hidden sm:inline">تطور القلعة</span>
              <span className="sm:hidden">القلعة</span>
            </button>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-white/80 border border-[#E8DFC8] text-[#755013] hover:text-[#B38022] flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* MAIN SCROLLABLE CONTINUOUS PAGE */}
        <main className="flex-1 overflow-y-auto no-scrollbar pb-16">
          <div className="w-full max-w-4xl mx-auto p-3 sm:p-5 space-y-4 sm:space-y-5">
            
            {/* 1. HERO BANNER & FAMILY IDENTITY & CASTLE EVOLUTION CARD */}
            <section className="relative bg-gradient-to-b from-[#FFFDF9] via-[#FAF5E8] to-[#F5EEDC] border-2 border-[#DFC386] rounded-3xl p-4 sm:p-6 shadow-[0_8px_30px_rgba(180,140,60,0.18)] overflow-hidden">
              {/* Background Champagne Shimmer */}
              <div className="absolute top-0 right-0 left-0 h-32 bg-gradient-to-b from-[#DFC386]/20 via-[#EAD39B]/10 to-transparent pointer-events-none" />
              <div className="absolute -top-10 -left-10 w-48 h-48 bg-[#DFC386]/15 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6">
                
                {/* Family Avatar Crest & Basic Info */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-right">
                  
                  {/* Diamond Crest Avatar Frame */}
                  <div className="relative w-24 h-24 sm:w-32 sm:h-32 shrink-0 flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#755013] via-[#DFC386] to-[#C59A4E] rotate-45 rounded-3xl p-1 shadow-[0_8px_24px_rgba(180,140,60,0.35)]">
                      <div className="w-full h-full bg-[#1A1309] rounded-2xl flex items-center justify-center overflow-hidden border-2 border-[#DFC386]/70">
                        <img 
                          src="https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&q=80&w=400" 
                          alt="Family Cover" 
                          className="w-full h-full object-cover -rotate-45 scale-135"
                        />
                      </div>
                    </div>

                    {/* Floating Level Tag */}
                    <div className="absolute -bottom-2 bg-gradient-to-r from-[#B38022] via-[#EAD39B] to-[#755013] text-[#2A1B0A] font-black text-xs px-3.5 py-0.5 rounded-full border-2 border-white shadow-md z-10 font-mono">
                      friendly 1 ☯
                    </div>
                  </div>

                  <div className="space-y-1.5 mt-2 sm:mt-0">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <h2 className="text-lg sm:text-2xl font-black text-[#5C3F13] tracking-tight">
                        عائلة الفرسان الذهبية
                      </h2>
                      <span className="bg-[#5C3F13] text-[#FFF9E6] text-[10px] font-black px-2 py-0.5 rounded-md font-mono">
                        TOP 3
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs">
                      <span className="font-mono font-bold text-[#8C7355] bg-white/80 px-2.5 py-0.5 rounded-full border border-[#E8DFC8]">
                        ID: 33883
                      </span>
                      <span className="font-bold text-[#8C7355] bg-white/80 px-2.5 py-0.5 rounded-full border border-[#E8DFC8]">
                        تأسست: 2024
                      </span>
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        891 عضو نشط
                      </span>
                    </div>

                    {/* Slogan */}
                    <p className="text-xs text-[#755013] font-bold bg-white/90 border border-[#DFC386]/60 rounded-xl px-3 py-1.5 shadow-xs max-w-sm mt-1">
                      ☯ البقاء ليس للأقوى بل للأحن والأوفى ☯
                    </p>
                  </div>
                </div>

                {/* CASTLE PROGRESSION & EVOLUTION PREVIEW */}
                <div 
                  onClick={() => setShowCastleModal(true)}
                  className="w-full md:w-80 bg-white/95 border-2 border-[#DFC386] rounded-2xl p-3.5 sm:p-4 shadow-[0_4px_18px_rgba(180,140,60,0.18)] hover:border-[#B38022] hover:shadow-[0_6px_24px_rgba(180,140,60,0.28)] transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 text-xs font-black text-[#5C3F13]">
                      <Crown className="w-4 h-4 text-[#B38022] fill-[#B38022]" />
                      <span>شعار القلعة التطورية</span>
                    </div>
                    <span className="text-[10px] font-bold text-[#B38022] group-hover:underline flex items-center gap-0.5">
                      <span>عرض التطور</span>
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  <div className="flex items-center gap-3.5 py-1">
                    <div className="relative group-hover:scale-110 transition-transform duration-300">
                      <CastleEmblem level={familyLevel} size="md" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-black text-[#755013] truncate">{castleTier.name}</h4>
                      <span className="text-[10px] text-[#A89478] font-bold block">{castleTier.levelRange} • الرتبة {castleTier.tier}/5</span>
                      
                      {/* EXP Bar */}
                      <div className="mt-1.5">
                        <div className="flex items-center justify-between text-[9px] font-mono text-[#8C7355] mb-0.5">
                          <span>EXP للترقية</span>
                          <span className="font-bold text-[#755013]">{Math.round((familyExp / nextLevelExp) * 100)}%</span>
                        </div>
                        <div className="w-full bg-[#EDE2CE] h-2 rounded-full overflow-hidden p-0.5">
                          <div 
                            className="h-full bg-gradient-to-r from-[#D9A036] via-[#B38022] to-[#755013] rounded-full"
                            style={{ width: `${(familyExp / nextLevelExp) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-[#E8DFC8] flex items-center justify-between text-[10px] text-[#8C7355] font-bold">
                    <span>الترقية القادمة: سعة 2500 عضو</span>
                    <span className="text-[#B38022]">Lv.{familyLevel + 1}</span>
                  </div>
                </div>

              </div>

              {/* COLLAPSIBLE STATS STRIP (الإحصائيات مع إمكانية الطي والفتح بالضغط) */}
              <div className="mt-4 pt-3 border-t border-[#DFC386]/60">
                <button
                  onClick={() => setIsStatsCollapsed(!isStatsCollapsed)}
                  className="w-full flex items-center justify-between py-1.5 px-2 rounded-xl hover:bg-white/60 text-[#5C3F13] font-black text-xs transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-1.5">
                    <Trophy className="w-4 h-4 text-[#B38022]" />
                    <span>إحصائيات ومعارك العائلة</span>
                    <span className="text-[10px] font-bold text-[#8C7355] bg-white px-2 py-0.2 rounded-full border border-[#E8DFC8]">
                      {isStatsCollapsed ? 'اضغط للعرض 📊' : 'اضغط للطي 📁'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[#8C7355]">
                    {isStatsCollapsed ? (
                      <ChevronDown className="w-4 h-4 text-[#B38022]" />
                    ) : (
                      <ChevronUp className="w-4 h-4 text-[#B38022]" />
                    )}
                  </div>
                </button>

                {/* Animated Collapsible Stats Grid */}
                <AnimatePresence>
                  {!isStatsCollapsed && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-2.5 overflow-hidden"
                    >
                      <div className="bg-white/90 border border-[#E8DFC8] rounded-2xl p-2.5 text-center shadow-xs">
                        <span className="text-[10px] font-bold text-[#8C7355] block">نقاط معارك العائلة</span>
                        <span className="text-sm font-black text-[#755013] font-mono mt-0.5 block flex items-center justify-center gap-1">
                          <Swords className="w-3.5 h-3.5 text-[#B38022]" />
                          482,900
                        </span>
                      </div>

                      <div className="bg-white/90 border border-[#E8DFC8] rounded-2xl p-2.5 text-center shadow-xs">
                        <span className="text-[10px] font-bold text-[#8C7355] block">الترتيب اليومي</span>
                        <span className="text-sm font-black text-amber-600 font-mono mt-0.5 block flex items-center justify-center gap-1">
                          <Trophy className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          #3 TOP29
                        </span>
                      </div>

                      <div className="bg-white/90 border border-[#E8DFC8] rounded-2xl p-2.5 text-center shadow-xs">
                        <span className="text-[10px] font-bold text-[#8C7355] block">المساهمة الشهرية</span>
                        <span className="text-sm font-black text-red-600 font-mono mt-0.5 block flex items-center justify-center gap-1">
                          <Flame className="w-3.5 h-3.5 fill-red-500 text-red-500" />
                          200,092,680
                        </span>
                      </div>

                      <div className="bg-white/90 border border-[#E8DFC8] rounded-2xl p-2.5 text-center shadow-xs">
                        <span className="text-[10px] font-bold text-[#8C7355] block">نسبة التفاعل</span>
                        <span className="text-sm font-black text-emerald-600 mt-0.5 block flex items-center justify-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                          ممتاز (Top 1%)
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </section>

            {/* 2. FAMILY PINNED ANNOUNCEMENT */}
            <section className="bg-gradient-to-r from-[#FAF4E6] via-[#FFFDF9] to-[#FAF4E6] border border-[#DFC386]/80 rounded-2xl p-3 sm:p-4 shadow-[0_2px_10px_rgba(180,140,60,0.08)] flex items-start gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-[#755013] to-[#B38022] text-[#FFF9E6] flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                <Megaphone className="w-4 h-4 sm:w-5 sm:h-5 text-amber-200" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-[#5C3F13] flex items-center gap-1.5">
                    <span>إعلان وتوجيهات قائد العائلة</span>
                    <span className="text-[9px] font-bold text-[#A89478] bg-white px-2 py-0.2 rounded-full border border-[#E8DFC8]">
                      مثبت
                    </span>
                  </h4>
                  <span className="text-[10px] text-[#A89478] font-mono">اليوم 14:30</span>
                </div>
                <p className="text-xs text-[#755013] font-semibold mt-1 leading-relaxed">
                  تصفية اسبوعية لكل من لا يتواجد في الرومات أو لم يسجل حضوره في القلعة. نرجو من الجميع التواجد في رومات العائلة الرسمية لدعم ترفيع القلعة للمستوى 13 ☯
                </p>
              </div>
            </section>

            {/* 3. CLICKABLE FAMILY MEMBERS & KNIGHTS BANNER */}
            <section 
              onClick={() => setShowMembersModal(true)}
              className="bg-gradient-to-r from-[#FFFDF9] via-[#FAF6ED] to-[#FFFDF9] border-2 border-[#DFC386] hover:border-[#B38022] rounded-2xl px-4 py-3 shadow-[0_4px_16px_rgba(180,140,60,0.12)] hover:shadow-[0_6px_22px_rgba(180,140,60,0.22)] transition-all cursor-pointer group flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#755013] via-[#A8792A] to-[#B38022] text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                  <Users className="w-5 h-5 text-amber-200" />
                </div>
                <div className="flex items-center gap-2 flex-wrap min-w-0">
                  <h3 className="text-sm sm:text-base font-black text-[#5C3F13] group-hover:text-[#B38022] transition-colors whitespace-nowrap">
                    أعضاء وفرسان العائلة
                  </h3>
                  <span className="text-xs font-mono font-bold text-[#8C7355] bg-white px-2 py-0.5 rounded-lg border border-[#DFC386]/60 shrink-0">
                    891 / 980
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 bg-[#FAF4E6] border border-[#DFC386] px-3.5 py-1.5 rounded-xl text-[#755013] group-hover:bg-[#755013] group-hover:text-white font-black text-xs transition-all shadow-xs shrink-0">
                <span>عرض القائمة</span>
                <ChevronLeft className="w-4 h-4" />
              </div>
            </section>

            {/* 4. SUPERVISORS & LEADERSHIP IN HORIZONTAL BAR (ظهور المشرفين في المكان الأفقي) */}
            <section className="space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#755013] to-[#B38022] flex items-center justify-center text-white shadow-xs">
                    <Shield className="w-4 h-4 text-amber-200" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-[#5C3F13]">
                      مشرفو وإدارة القلعة ({supervisors.length})
                    </h3>
                    <p className="text-[10px] text-[#A89478] font-bold">قيادة العائلة ومسؤولو الرومات والتنظيم</p>
                  </div>
                </div>

                <span className="text-[10px] font-bold text-[#B38022] bg-[#FAF5E8] px-2.5 py-0.5 rounded-full border border-[#DFC386]/60">
                  إدارة معتمدة
                </span>
              </div>

              {/* Horizontal Scrollable Row of Supervisors */}
              <div className="bg-white/90 border border-[#DFC386]/70 rounded-2xl p-3 shadow-xs overflow-hidden">
                <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1 px-1">
                  {supervisors.map((sup) => (
                    <motion.div 
                      key={sup.id}
                      whileHover={{ scale: 1.04 }}
                      className="flex flex-col items-center shrink-0 w-24 sm:w-28 bg-[#FAF6ED] border border-[#DFC386]/60 hover:border-[#B38022] rounded-2xl p-2 text-center group cursor-pointer shadow-xs hover:shadow-md transition-all"
                    >
                      {/* Avatar with Role Crown / Halo */}
                      <div className="relative w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr from-[#B38022] via-[#EAD39B] to-[#755013] shadow-md group-hover:scale-105 transition-transform">
                        <img 
                          src={sup.avatar} 
                          alt={sup.name} 
                          className="w-full h-full rounded-full object-cover" 
                        />
                        {/* Online Indicator */}
                        <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs ${
                          sup.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                        }`} />
                        {/* Crown Tag for Rank 1 */}
                        {sup.rank === 1 && (
                          <span className="absolute -top-1.5 -right-1 bg-amber-500 text-white p-0.5 rounded-full shadow-xs">
                            <Crown className="w-3 h-3 fill-white" />
                          </span>
                        )}
                      </div>

                      {/* Supervisor Name */}
                      <span className="text-[11px] font-black text-[#5C3F13] truncate w-full text-center mt-1.5">
                        {sup.name}
                      </span>

                      {/* Supervisor Role Badge */}
                      <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-md mt-0.5 border truncate w-full text-center ${
                        sup.rank === 1 
                          ? 'bg-amber-100 text-amber-900 border-amber-300' 
                          : sup.rank === 2 
                          ? 'bg-slate-100 text-slate-800 border-slate-300' 
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                        {sup.roleBadge}
                      </span>

                      {/* EXP points */}
                      <span className="text-[8px] font-mono text-[#8C7355] mt-0.5">
                        EXP {sup.exp}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* 5. FAMILY ROOMS SECTION (عمودين شاشة جنب شاشة - 2 COLUMNS STRICTLY) */}
            <section className="space-y-3 pt-1">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#755013] to-[#B38022] flex items-center justify-center text-white shadow-xs">
                    <Volume2 className="w-4 h-4 text-amber-200" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-[#5C3F13]">
                      غرف ورومات العائلة الصوتية ({familyRooms.length})
                    </h3>
                    <p className="text-[10px] text-[#A89478] font-bold">
                      بثوث صوتية مباشرة • عمودين جنب إلى جنب
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[#8C7355] font-bold bg-[#FAF5E8] px-2.5 py-1 rounded-full border border-[#DFC386]/60">
                    {familyRooms.length} غرف نشطة
                  </span>
                </div>
              </div>

              {/* STRICT 2-COLUMN GRID (عمودين شاشة جنب شاشة على جميع المقاسات) */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5">
                {familyRooms.map((room) => {
                  const isLocked = room.isLocked || (room.id === 'room-1' && globalLockData.isLocked);

                  return (
                    <motion.div
                      key={room.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
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
                      className="bg-white border-2 border-[#E8DFC8] hover:border-[#B38022] rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_4px_16px_rgba(180,140,60,0.12)] hover:shadow-[0_8px_24px_rgba(180,140,60,0.22)] transition-all cursor-pointer group flex flex-col"
                    >
                      {/* Room Poster Header */}
                      <div className="relative h-28 sm:h-36 w-full overflow-hidden bg-slate-900">
                        <img 
                          src={room.bgImage} 
                          alt={room.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        {/* Top Category Tag & Lock Status */}
                        <div className="absolute top-2 left-2 right-2 flex items-center justify-between gap-1">
                          {isLocked ? (
                            <span className="bg-rose-600 text-white font-black text-[8px] sm:text-[9px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-md border border-rose-300 animate-pulse shrink-0">
                              <Lock className="w-2.5 h-2.5 stroke-[2.5]" />
                              <span>مقفل</span>
                            </span>
                          ) : (
                            <span className="bg-emerald-600/90 text-white font-black text-[8px] sm:text-[9px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-md backdrop-blur-xs shrink-0">
                              <Radio className="w-2.5 h-2.5" />
                              <span>مباشر</span>
                            </span>
                          )}

                          <span className={`bg-gradient-to-r ${room.categoryColor} text-white font-black text-[8px] sm:text-[10px] px-2 py-0.5 rounded-full shadow-md truncate max-w-[80px] sm:max-w-none`}>
                            {room.tagText}
                          </span>
                        </div>

                        {/* Bottom Bar: Host Avatar & Listeners count */}
                        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white">
                          <div className="flex items-center gap-1 min-w-0">
                            <img 
                              src={room.hostAvatar} 
                              alt={room.hostName} 
                              className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover border border-white/80 shadow-xs shrink-0"
                            />
                            <span className="text-[9px] sm:text-[11px] font-bold truncate max-w-[60px] sm:max-w-[100px] drop-shadow-md">
                              {room.hostName}
                            </span>
                          </div>

                          {/* Listeners Badge */}
                          <div className="bg-black/60 backdrop-blur-md px-1.5 py-0.2 sm:px-2 sm:py-0.5 rounded-full text-[8px] sm:text-[10px] text-emerald-400 font-mono font-bold border border-white/20 flex items-center gap-0.5 shadow-xs shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                            <span>{room.listeners}</span>
                          </div>
                        </div>
                      </div>

                      {/* Room Card Bottom Content */}
                      <div className="p-2.5 sm:p-3 bg-gradient-to-b from-[#FFFDF9] to-[#FAF5E8] flex-1 flex flex-col justify-between">
                        <h4 className="text-[11px] sm:text-xs font-black text-[#5C3F13] group-hover:text-[#B38022] transition-colors line-clamp-2 leading-relaxed text-right min-h-[32px]">
                          {room.title}
                        </h4>

                        <div className="mt-2 pt-1.5 border-t border-[#E8DFC8]/80 flex items-center justify-between">
                          <span className="text-[9px] text-[#A89478] font-bold truncate max-w-[65px] sm:max-w-none">
                            روم الفرسان
                          </span>

                          <button className="px-2 sm:px-3 py-0.5 sm:py-1 bg-gradient-to-r from-[#755013] to-[#B38022] text-white font-black text-[9px] sm:text-[10px] rounded-lg sm:rounded-xl shadow-xs group-hover:brightness-110 transition-all flex items-center gap-0.5 cursor-pointer">
                            <span>دخول</span>
                            <ChevronLeft className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </section>

          </div>
        </main>

        {/* CASTLE EVOLUTION MODAL */}
        <CastleEvolutionModal
          isOpen={showCastleModal}
          onClose={() => setShowCastleModal(false)}
          currentFamilyLevel={familyLevel}
          currentExp={familyExp}
          nextLevelExp={nextLevelExp}
        />

        {/* FULL FAMILY MEMBERS & ONLINE LIST MODAL */}
        <FamilyMembersModal
          isOpen={showMembersModal}
          onClose={() => setShowMembersModal(false)}
        />

        {/* PIN CODE INPUT MODAL FOR LOCKED ROOMS */}
        <AnimatePresence>
          {showPinModal && (
            <div 
              className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 pointer-events-auto"
              dir="rtl"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-sm bg-gradient-to-b from-[#FFFDF9] via-[#FAF6ED] to-[#F3EBD8] border-2 border-[#DFC386] rounded-3xl p-5 text-slate-900 shadow-2xl relative space-y-4"
              >
                <button
                  onClick={() => {
                    setShowPinModal(false);
                    setEnteredPin('');
                    setPinError('');
                  }}
                  className="absolute top-3 left-3 p-1.5 rounded-full bg-slate-200/80 text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-3 border-b border-[#DFC386]/60 pb-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#755013] to-[#B38022] text-white flex items-center justify-center shrink-0 shadow-md">
                    <Lock className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-[#5C3F13]">غرفة عائلية مقفلة 🔒</h3>
                    <p className="text-[11px] text-[#8C7355] font-semibold">أدخل الرمز السري المكون من 6 أرقام للدخول</p>
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
                    className="w-full bg-white border-2 border-[#DFC386] rounded-2xl px-4 py-3 text-center text-xl font-mono font-bold tracking-widest text-[#755013] focus:outline-none focus:border-[#B38022] shadow-inner"
                    autoFocus
                  />
                  {pinError && (
                    <p className="text-xs font-bold text-rose-600 text-center">{pinError}</p>
                  )}
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={handleVerifyPin}
                    className="flex-1 py-3 bg-gradient-to-r from-[#755013] via-[#A8792A] to-[#755013] hover:opacity-95 text-white font-black text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
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
                    className="px-4 py-3 bg-[#EDE2CE] hover:bg-[#E2D4BD] text-[#755013] font-bold text-xs rounded-xl cursor-pointer"
                  >
                    إلغاء
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};
export default FamilyModal;
