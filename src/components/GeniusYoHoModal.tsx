import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Trophy, Shield, Crown, Sparkles, HelpCircle, Star, Flame, Eye, ChevronLeft, Gem, Users, Award, X } from 'lucide-react';

interface GeniusYoHoModalProps {
  isOpen: boolean;
  onClose: () => void;
  userAvatar?: string;
  userName?: string;
}

export const GeniusYoHoModal: React.FC<GeniusYoHoModalProps> = ({
  isOpen,
  onClose,
  userAvatar = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
  userName = "عابر سبيل"
}) => {
  const [activeRegion, setActiveRegion] = useState<string>('middle_east');
  const [activeCategory, setActiveCategory] = useState<'pk' | 'host' | 'agency'>('pk');
  const [showRulesModal, setShowRulesModal] = useState(false);

  if (!isOpen) return null;

  const regions = [
    { id: 'middle_east', name: 'الشرق الأوسط', icon: '⭐️' },
    { id: 'yemen', name: 'اليمن', flag: '🇾🇪' },
    { id: 'tunisia', name: 'تونس', flag: '🇹🇳' },
    { id: 'syria', name: 'سوريا', flag: '🇸🇾' },
    { id: 'egypt', name: 'مصر', flag: '🇪🇬' },
    { id: 'saudi', name: 'السعودية', flag: '🇸🇦' },
    { id: 'iraq', name: 'العراق', flag: '🇮🇶' },
    { id: 'morocco', name: 'المغرب', flag: '🇲🇦' },
  ];

  const categories = [
    { id: 'pk', label: 'فرق الـPK المميزه' },
    { id: 'host', label: 'ماس المضيف الشهري' },
    { id: 'agency', label: 'ماس الوكالة الشهري' },
  ];

  // Podium Data (Top 3)
  const topPodium = {
    rank1: {
      name: 'Mayouch',
      diamonds: '0****4 💎',
      date: '2025-12-22',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
      title: 'بطل جينيس الأسطوري'
    },
    rank2: {
      name: 'h_i_n_d...',
      diamonds: '0****2 💎',
      date: '2025-12-04',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300',
      title: 'وصيف العرش'
    },
    rank3: {
      name: 'AYEED 👑',
      diamonds: '0****3 💎',
      date: '2025-12-28',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
      title: 'فارس المنافسة'
    }
  };

  // Rankings 4 to 10
  const rankingList = [
    {
      rank: 4,
      name: 'أحنا دوله',
      diamonds: '0****2 💎',
      date: 'حصل عليها في 05-12-2025',
      avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=150',
      tag: '🦁 فريق النخبة'
    },
    {
      rank: 5,
      name: '🥂 Hazet',
      diamonds: '0****1 💎',
      date: 'حصل عليها في 28-12-2024',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
      tag: '🔥 محارب ذهبي'
    },
    {
      rank: 6,
      name: '🥂 Hind',
      diamonds: '0****1 💎',
      date: 'حصل عليها في 12-02-2025',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=150',
      tag: '🌸 نجمة التألق'
    },
    {
      rank: 7,
      name: 'Souzy',
      diamonds: '0****1 💎',
      date: 'حصل عليها في 05-09-2024',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150',
      tag: '✨ متألق دائم'
    },
    {
      rank: 8,
      name: 'الزعيم كينغ',
      diamonds: '0****1 💎',
      date: 'حصل عليها في 18-08-2024',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
      tag: '👑 قائد الكتيبة'
    },
    {
      rank: 9,
      name: 'Princess Noor',
      diamonds: '0****1 💎',
      date: 'حصل عليها في 01-08-2024',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150',
      tag: '💎 الماس نقي'
    },
    {
      rank: 10,
      name: 'فارس الظلام',
      diamonds: '0****1 💎',
      date: 'حصل عليها في 20-07-2024',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=150',
      tag: '⚡ الفارس الأول'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md overflow-hidden font-sans" dir="rtl">
      {/* Fullscreen Royal Glass Container */}
      <div className="relative w-full max-w-lg h-full sm:h-[92vh] sm:rounded-3xl bg-gradient-to-b from-[#180e29] via-[#0f091c] to-[#08050e] border border-amber-500/30 flex flex-col overflow-hidden shadow-2xl">
        
        {/* Background Royal Ambient Light & Stars */}
        <div className="absolute top-0 inset-x-0 h-96 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-600/25 via-purple-900/20 to-transparent pointer-events-none" />
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        {/* Top Header Bar */}
        <div className="relative z-10 px-4 py-3.5 flex items-center justify-between border-b border-amber-500/20 bg-slate-950/40 backdrop-blur-md">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/5 border border-amber-500/30 text-amber-300 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all cursor-pointer shadow-sm"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="text-center">
            <h2 className="text-base sm:text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-300 tracking-wider flex items-center justify-center gap-1.5 font-serif">
              <span>جينيس YoHo</span>
              <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
            </h2>
            <p className="text-[10px] text-amber-200/60 font-bold">لوحة أبطال الأرقام القياسية والتصنيف الماسي</p>
          </div>

          <button
            onClick={() => setShowRulesModal(true)}
            className="px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 hover:bg-amber-500/25 text-xs font-black flex items-center gap-1 cursor-pointer transition-all shadow-xs"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>قواعد</span>
          </button>
        </div>

        {/* Regions Horizontal Tab Strip */}
        <div className="relative z-10 px-3 py-2 bg-slate-950/60 border-b border-white/5 overflow-x-auto no-scrollbar flex items-center gap-2">
          {regions.map((region) => {
            const isSelected = activeRegion === region.id;
            return (
              <button
                key={region.id}
                onClick={() => setActiveRegion(region.id)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.4)] font-black scale-105'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                }`}
              >
                <span>{region.flag || region.icon}</span>
                <span>{region.name}</span>
              </button>
            );
          })}
        </div>

        {/* Categories 3-Way Tabs */}
        <div className="relative z-10 px-4 pt-2.5 pb-1 flex items-center justify-around">
          {categories.map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`relative px-3 py-1.5 text-xs transition-all cursor-pointer font-bold ${
                  isSelected
                    ? 'text-amber-300 font-black text-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{cat.label}</span>
                {isSelected && (
                  <motion.div
                    layoutId="geniusTabIndicator"
                    className="absolute -bottom-1 inset-x-2 h-0.5 bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.8)]"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Main Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-3.5 py-2 space-y-4 pb-28">
          
          {/* Top 3 Podium Cards (المنصة الثلاثية الملكية) */}
          <div className="relative pt-6 pb-2">
            <div className="grid grid-cols-3 gap-2 items-end">
              
              {/* Rank 2 - Left (Ruby/Pink Royal Shield) */}
              <motion.div 
                whileHover={{ scale: 1.03 }}
                className="relative rounded-2xl bg-gradient-to-b from-[#3a1528] via-[#240d1a] to-[#160810] border border-rose-500/40 p-2.5 text-center flex flex-col items-center shadow-lg"
              >
                {/* Shield Badge Header */}
                <div className="absolute -top-3.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-black text-[10px] px-2 py-0.5 rounded-full border border-white/40 shadow-md">
                  #2 الوصيف
                </div>
                
                {/* Avatar with Pink Crown Ring */}
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full p-0.5 bg-gradient-to-tr from-rose-400 via-pink-300 to-rose-600 shadow-[0_0_15px_rgba(244,63,94,0.4)] mt-2">
                  <img src={topPodium.rank2.avatar} alt="Rank 2" className="w-full h-full rounded-full object-cover" />
                  <div className="absolute -bottom-1 inset-x-0 bg-rose-600/90 text-white text-[8px] font-bold rounded-full py-0.2">
                    🥈 2nd
                  </div>
                </div>

                <div className="mt-2 w-full">
                  <h4 className="text-xs font-black text-rose-200 truncate">{topPodium.rank2.name}</h4>
                  <div className="text-[10px] font-mono font-black text-amber-400 mt-0.5">{topPodium.rank2.diamonds}</div>
                  <span className="text-[8px] text-slate-400 block mt-0.5">{topPodium.rank2.date}</span>
                </div>
              </motion.div>

              {/* Rank 1 - Center (Imperial Gold & Lion Crest - Highest Elevation) */}
              <motion.div 
                whileHover={{ scale: 1.04 }}
                className="relative rounded-3xl bg-gradient-to-b from-[#4d3608] via-[#332205] to-[#1f1402] border-2 border-amber-400/80 p-3 text-center flex flex-col items-center shadow-[0_0_25px_rgba(245,158,11,0.35)] -translate-y-3 z-10"
              >
                {/* Crown Topper */}
                <div className="absolute -top-6 w-10 h-10 flex items-center justify-center">
                  <Crown className="w-8 h-8 text-amber-300 fill-amber-400 drop-shadow-[0_2px_8px_rgba(245,158,11,0.8)] animate-bounce" />
                </div>

                <div className="absolute -top-2 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full border border-yellow-200 shadow-md">
                  👑 بطل جينيس #1
                </div>

                {/* Avatar with Golden Wings & Radiant Border */}
                <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-full p-1 bg-gradient-to-tr from-yellow-300 via-amber-400 to-yellow-100 shadow-[0_0_20px_rgba(245,158,11,0.6)] mt-3">
                  <img src={topPodium.rank1.avatar} alt="Rank 1" className="w-full h-full rounded-full object-cover border-2 border-amber-200" />
                  <div className="absolute -bottom-1.5 inset-x-0 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-[9px] font-black rounded-full py-0.5 shadow-sm border border-yellow-200">
                    🥇 1st Place
                  </div>
                </div>

                <div className="mt-2.5 w-full">
                  <h4 className="text-sm font-black text-amber-200 truncate font-serif">{topPodium.rank1.name}</h4>
                  <div className="text-xs font-mono font-black text-yellow-300 mt-0.5 drop-shadow-xs">{topPodium.rank1.diamonds}</div>
                  <span className="text-[9px] text-amber-200/70 block mt-0.5 font-bold">{topPodium.rank1.date}</span>
                </div>
              </motion.div>

              {/* Rank 3 - Right (Sapphire/Cyan Royal Shield) */}
              <motion.div 
                whileHover={{ scale: 1.03 }}
                className="relative rounded-2xl bg-gradient-to-b from-[#0e273d] via-[#091a29] to-[#05101a] border border-sky-500/40 p-2.5 text-center flex flex-col items-center shadow-lg"
              >
                {/* Shield Badge Header */}
                <div className="absolute -top-3.5 bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-black text-[10px] px-2 py-0.5 rounded-full border border-white/40 shadow-md">
                  #3 الفارس
                </div>

                {/* Avatar with Sapphire Ring */}
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full p-0.5 bg-gradient-to-tr from-cyan-400 via-sky-300 to-blue-600 shadow-[0_0_15px_rgba(56,189,248,0.4)] mt-2">
                  <img src={topPodium.rank3.avatar} alt="Rank 3" className="w-full h-full rounded-full object-cover" />
                  <div className="absolute -bottom-1 inset-x-0 bg-sky-600/90 text-white text-[8px] font-bold rounded-full py-0.2">
                    🥉 3rd
                  </div>
                </div>

                <div className="mt-2 w-full">
                  <h4 className="text-xs font-black text-sky-200 truncate">{topPodium.rank3.name}</h4>
                  <div className="text-[10px] font-mono font-black text-amber-400 mt-0.5">{topPodium.rank3.diamonds}</div>
                  <span className="text-[8px] text-slate-400 block mt-0.5">{topPodium.rank3.date}</span>
                </div>
              </motion.div>

            </div>
          </div>

          {/* Leaderboard List (Ranks 4 to 10) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-2 pt-2">
              <span className="text-xs font-black text-amber-300/90 flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5" />
                <span>قائمة المتصدرين الكبرى</span>
              </span>
              <span className="text-[10px] text-slate-400 font-bold">تحديث دوري فوري</span>
            </div>

            {rankingList.map((item) => (
              <motion.div
                key={item.rank}
                whileHover={{ scale: 1.01 }}
                className="rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-purple-950/40 border border-white/10 hover:border-amber-500/30 p-2.5 sm:p-3 flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Rank Number Badge */}
                  <div className="w-7 h-7 rounded-xl bg-slate-950 border border-amber-500/20 text-amber-400 font-black text-xs font-mono flex items-center justify-center shadow-inner shrink-0">
                    {item.rank}
                  </div>

                  {/* Avatar */}
                  <div className="relative w-11 h-11 rounded-full p-0.5 bg-gradient-to-tr from-amber-400/60 to-purple-500/60 shrink-0">
                    <img src={item.avatar} alt={item.name} className="w-full h-full rounded-full object-cover" />
                  </div>

                  {/* Name and Metadata */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs sm:text-sm font-black text-white group-hover:text-amber-300 transition-colors truncate">
                        {item.name}
                      </h4>
                      <span className="text-[9px] bg-white/5 border border-white/10 px-1.5 py-0.2 rounded-md text-amber-200/80 font-bold shrink-0">
                        {item.tag}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5 truncate">
                      {item.date}
                    </span>
                  </div>
                </div>

                {/* Diamond Count Score */}
                <div className="text-left shrink-0 pl-1">
                  <div className="text-xs sm:text-sm font-black text-amber-400 font-mono">
                    {item.diamonds}
                  </div>
                  <span className="text-[9px] text-slate-400 font-bold">ألماس تم جمعه</span>
                </div>
              </motion.div>
            ))}
          </div>

        </div>

        {/* Floating User Standing Footer Bar (الشريط السفلي لمركز المستخدم) */}
        <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-slate-950 via-[#130b20] to-[#130b20]/90 border-t border-amber-500/30 backdrop-blur-xl z-20 flex items-center justify-between shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 to-yellow-200 shrink-0 shadow-md">
              <img src={userAvatar} alt="My Avatar" className="w-full h-full rounded-full object-cover" />
              <span className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 font-black text-[9px] px-1 rounded-full border border-white font-mono">
                +100
              </span>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-white">{userName}</span>
                <span className="text-[9px] text-amber-300 bg-amber-500/20 px-1.5 py-0.2 rounded border border-amber-400/30 font-bold">
                  أرقام الدورة القياسية
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                216625600 إلى المخططات
              </span>
            </div>
          </div>

          <div className="text-left">
            <div className="text-xs font-black text-amber-400 font-mono">0 💎</div>
            <span className="text-[9px] text-slate-400">رصيدك الحالي</span>
          </div>
        </div>

        {/* Rules Modal Overlay */}
        <AnimatePresence>
          {showRulesModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-50 p-5 flex flex-col justify-center items-center"
            >
              <div className="w-full max-w-sm bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/40 rounded-3xl p-5 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="text-sm font-black text-amber-300 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-amber-400" />
                    <span>قواعد تصنيف جينيس YoHo</span>
                  </h3>
                  <button
                    onClick={() => setShowRulesModal(false)}
                    className="w-7 h-7 rounded-full bg-white/5 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-xs text-slate-300 space-y-2.5 leading-relaxed">
                  <p>• يتم احتساب المراكز بناءً على مجموع النقاط والألماس المحقق في جولات PK المعتمدة طوال الشهر.</p>
                  <p>• يحصل أصحاب المراكز الثلاثة الأولى على دروع وأوسمة شرف حصرية تظهر في جميع الغرف والملفات الشخصية.</p>
                  <p>• يتم تصفير الجولة الدورية كل بداية شهر ميلادي مع توثيق أسماء الأبطال في قاعة المشاهير الملكية.</p>
                </div>

                <button
                  onClick={() => setShowRulesModal(false)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs hover:opacity-95 cursor-pointer shadow-md"
                >
                  فهمت ذلك
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
