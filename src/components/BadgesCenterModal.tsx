import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, HelpCircle, X, Check, Award, Sparkles, Shield, Lock } from 'lucide-react';
import { 
  Badge100Shield, 
  Noble3HorseBadge, 
  NobleWolfBadge, 
  ThumbsUpMedal, 
  DoubleExpBadge, 
  AnniversaryBadge, 
  RamadanLanternBadge 
} from './profile/AppearanceAssets';

interface BadgesCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  avatarUrl?: string;
  badges?: any[];
  onSelectBadge?: (badge: any) => void;
}

export const BadgesCenterModal: React.FC<BadgesCenterModalProps> = ({ 
  isOpen, 
  onClose,
  userName = "(عابر سبيل)",
  avatarUrl = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
  onSelectBadge
}) => {
  const [activeTab, setActiveTab] = useState<'achievements' | 'honorary' | 'activity' | 'games'>('honorary');
  const [equippedSlots, setEquippedSlots] = useState<{ slot1: string; slot2: string; slot3: string }>({
    slot1: 'noble_4',
    slot2: 'badge_100',
    slot3: 'noble_5'
  });
  const [selectedBadge, setSelectedBadge] = useState<any | null>(null);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [isEquipMode, setIsEquipMode] = useState(false);

  if (!isOpen) return null;

  const allBadges = [
    {
      id: 'medal_excellent',
      name: 'ميدالية ممتازة',
      category: 'honorary',
      component: <ThumbsUpMedal type="excellent" className="w-14 h-14" />,
      desc: 'ميدالية التميز الفائق لأفضل التفاعلات والمشاركات البارزة في التطبيق.',
      points: '+5 نقاط إنجاز',
      unlocked: true,
      obtainedDate: '2026/08/15'
    },
    {
      id: 'medal_great',
      name: 'ميدالية رائعة',
      category: 'honorary',
      component: <ThumbsUpMedal type="great" className="w-14 h-14" />,
      desc: 'ميدالية التقدير الملكي الممنوحة للمستخدمين المتميزين.',
      points: '+4 نقاط إنجاز',
      unlocked: true,
      obtainedDate: '2026/08/10'
    },
    {
      id: 'medal_good',
      name: 'ميدالية جيدة',
      category: 'honorary',
      component: <ThumbsUpMedal type="good" className="w-14 h-14" />,
      desc: 'شارة الإشادة الأولى بالنشاط والتفاعل المستمر.',
      points: '+3 نقاط إنجاز',
      unlocked: true,
      obtainedDate: '2026/08/01'
    },
    {
      id: 'noble_3',
      name: 'noble 3',
      category: 'honorary',
      component: <Noble3HorseBadge className="w-14 h-14" />,
      desc: 'شارة النبلاء رتبة NOBLE 3 الفضية مع إكليل الغار والفروسية.',
      points: '+8 نقاط إنجاز',
      unlocked: true,
      obtainedDate: '2026/08/20'
    },
    {
      id: 'double_exp',
      name: 'Gấp Đôi Kinh Nghiệm',
      category: 'honorary',
      component: <DoubleExpBadge className="w-14 h-14" />,
      desc: 'وسام مضاعفة الخبرة والسرعة المكتسبة في الأحداث الكبرى.',
      points: '+6 نقاط إنجاز',
      unlocked: true,
      obtainedDate: '2026/08/18'
    },
    {
      id: 'anniversary_celeb',
      name: 'Anniversary Celebration rece...',
      category: 'honorary',
      component: <AnniversaryBadge className="w-14 h-14" />,
      desc: 'وسام الاحتفال بالذكرى السنوية الخاصة بتطبيق ترف شات.',
      points: '+10 نقاط إنجاز',
      unlocked: true,
      obtainedDate: '2026/07/28'
    },
    {
      id: 'ramadan_lantern',
      name: 'وسام الفانوس الملكي',
      category: 'honorary',
      component: <RamadanLanternBadge className="w-14 h-14" />,
      desc: 'وسام الهلال الذهبي والفانوس الزمردي للأعياد والمناسبات المباركة.',
      points: '+7 نقاط إنجاز',
      unlocked: true,
      obtainedDate: '2026/04/10'
    },
    {
      id: 'noble_5',
      name: 'NOBLE 5',
      category: 'honorary',
      component: <NobleWolfBadge level={5} className="w-14 h-14" />,
      desc: 'شارة النبلاء العليا رتبة NOBLE 5 الزمردية مع رأس الذئب المتوهج.',
      points: '+15 نقطة إنجاز',
      unlocked: true,
      obtainedDate: '2026/08/25'
    },
    {
      id: 'noble_4',
      name: 'NOBLE 4',
      category: 'honorary',
      component: <NobleWolfBadge level={4} className="w-14 h-14" />,
      desc: 'شارة النبلاء رتبة NOBLE 4 الزمردية مع أجنحة الشرف والنجوم الأربعة.',
      points: '+12 نقطة إنجاز',
      unlocked: true,
      obtainedDate: '2026/08/22'
    },
    {
      id: 'badge_100',
      name: 'شارة المستوى 100',
      category: 'achievements',
      component: <Badge100Shield className="w-14 h-14" />,
      desc: 'شارة بلوغ المستوى 100 في ترف شات.',
      points: '+20 نقطة إنجاز',
      unlocked: true,
      obtainedDate: '2026/08/26'
    }
  ];

  const getBadgeById = (id: string) => allBadges.find((b) => b.id === id);

  const filteredBadges = allBadges.filter((badge) => {
    if (activeTab === 'honorary') return badge.category === 'honorary';
    if (activeTab === 'achievements') return badge.category === 'achievements' || badge.id.startsWith('noble');
    if (activeTab === 'activity') return badge.id.includes('medal') || badge.id === 'anniversary_celeb';
    if (activeTab === 'games') return badge.id === 'double_exp' || badge.id.includes('medal');
    return true;
  });

  const handleToggleEquipSlot = (badgeId: string) => {
    if (equippedSlots.slot1 === badgeId) {
      setEquippedSlots({ ...equippedSlots, slot1: '' });
    } else if (equippedSlots.slot2 === badgeId) {
      setEquippedSlots({ ...equippedSlots, slot2: '' });
    } else if (equippedSlots.slot3 === badgeId) {
      setEquippedSlots({ ...equippedSlots, slot3: '' });
    } else {
      if (!equippedSlots.slot1) setEquippedSlots({ ...equippedSlots, slot1: badgeId });
      else if (!equippedSlots.slot2) setEquippedSlots({ ...equippedSlots, slot2: badgeId });
      else setEquippedSlots({ ...equippedSlots, slot3: badgeId });
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md" dir="rtl">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className="w-full max-w-md h-full sm:h-[92vh] max-h-[900px] bg-[#140D05] rounded-none sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col relative text-white border-0 sm:border border-amber-950/60"
        >
          {/* Top Header Bar */}
          <div className="relative px-4 pt-4 pb-2 flex items-center justify-between shrink-0 z-20">
            <button
              onClick={onClose}
              className="p-2 rounded-full text-white/90 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <h1 className="text-base sm:text-lg font-black tracking-wide text-white">الشارات</h1>

            <button
              onClick={() => setShowHelpModal(true)}
              className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Container */}
          <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col">
            {/* Showcase Stage (Podium) with Warm Ambient Glow */}
            <div className="relative pt-3 pb-8 px-4 overflow-hidden bg-gradient-to-b from-[#2E1A0A] via-[#241306] to-[#140D05] shrink-0 text-center">
              {/* Starry Nebula Background */}
              <div className="absolute inset-0 bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:16px_16px] opacity-25" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-44 bg-amber-600/15 blur-3xl pointer-events-none rounded-full" />

              {/* User Avatar Circle */}
              <div className="relative inline-block mx-auto mb-2 z-10">
                <div className="w-16 h-16 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-600 shadow-[0_0_16px_rgba(245,158,11,0.5)]">
                  <img
                    src={avatarUrl}
                    alt={userName}
                    className="w-full h-full rounded-full object-cover border-2 border-[#1E1107]"
                  />
                </div>
              </div>

              {/* User Name & Achievement Points */}
              <div className="z-10 relative space-y-0.5">
                <div className="text-xs sm:text-sm font-black text-white">{userName}</div>
                <div className="text-xs font-black text-[#F59E0B] tracking-wide flex items-center justify-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 fill-[#F59E0B]" />
                  <span>نقاط الإنجاز: 21</span>
                </div>
              </div>

              {/* Wooden & Gold Tiered Podium Stage with 3 Displayed Badges */}
              <div className="relative mt-4 max-w-[320px] mx-auto z-10">
                {/* 3 Badges Floating on Podium */}
                <div className="flex items-end justify-center gap-4 relative z-20 pb-3">
                  {/* Slot 1 (Left): NOBLE 4 */}
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    onClick={() => {
                      const b = getBadgeById(equippedSlots.slot1);
                      if (b) setSelectedBadge(b);
                    }}
                    className="w-16 h-16 flex items-center justify-center cursor-pointer relative group"
                  >
                    {equippedSlots.slot1 ? (
                      getBadgeById(equippedSlots.slot1)?.component || <NobleWolfBadge level={4} className="w-14 h-14" />
                    ) : (
                      <div className="w-12 h-12 rounded-2xl border-2 border-dashed border-amber-500/40 flex items-center justify-center text-amber-500/60 text-xs">
                        فارغ
                      </div>
                    )}
                  </motion.div>

                  {/* Slot 2 (Center - Elevated): 100 Shield */}
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    onClick={() => {
                      const b = getBadgeById(equippedSlots.slot2);
                      if (b) setSelectedBadge(b);
                    }}
                    className="w-18 h-18 -translate-y-2 flex items-center justify-center cursor-pointer relative group"
                  >
                    {equippedSlots.slot2 ? (
                      getBadgeById(equippedSlots.slot2)?.component || <Badge100Shield className="w-16 h-16" />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl border-2 border-dashed border-amber-500/40 flex items-center justify-center text-amber-500/60 text-xs">
                        فارغ
                      </div>
                    )}
                  </motion.div>

                  {/* Slot 3 (Right): NOBLE 5 */}
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    onClick={() => {
                      const b = getBadgeById(equippedSlots.slot3);
                      if (b) setSelectedBadge(b);
                    }}
                    className="w-16 h-16 flex items-center justify-center cursor-pointer relative group"
                  >
                    {equippedSlots.slot3 ? (
                      getBadgeById(equippedSlots.slot3)?.component || <NobleWolfBadge level={5} className="w-14 h-14" />
                    ) : (
                      <div className="w-12 h-12 rounded-2xl border-2 border-dashed border-amber-500/40 flex items-center justify-center text-amber-500/60 text-xs">
                        فارغ
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* Round 3D Wooden & Gold Podium Base Graphic */}
                <div className="w-full h-8 bg-gradient-to-r from-[#5C320A] via-[#8C531B] to-[#5C320A] rounded-full border-t-2 border-amber-300 shadow-[0_8px_20px_rgba(0,0,0,0.6)] relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
                  <div className="w-full h-[1px] bg-amber-200/50" />
                </div>
              </div>

              {/* Side Ornate Button: ارتداء الشارة */}
              <div className="mt-4 flex justify-center z-10 relative">
                <button
                  onClick={() => setIsEquipMode(!isEquipMode)}
                  className={`px-5 py-1.5 rounded-full text-xs font-black border transition-all cursor-pointer shadow-md flex items-center gap-1.5 ${
                    isEquipMode
                      ? 'bg-emerald-600 text-white border-emerald-300'
                      : 'bg-gradient-to-r from-[#4A2609] via-[#63360E] to-[#4A2609] text-amber-200 border-amber-400/60 hover:border-amber-300'
                  }`}
                >
                  <Award className="w-3.5 h-3.5 text-amber-300" />
                  <span>{isEquipMode ? 'حفظ التخصيص' : 'ارتداء الشارة'}</span>
                </button>
              </div>
            </div>

            {/* Category Tabs (إنجازات / فخري / نشاط / الألعاب) */}
            <div className="flex items-center justify-around border-b border-amber-900/40 px-2 shrink-0 bg-[#1A1007] z-20">
              <button
                onClick={() => setActiveTab('achievements')}
                className={`pb-2.5 pt-3 px-3 text-xs sm:text-sm font-black transition-all relative cursor-pointer ${
                  activeTab === 'achievements'
                    ? 'text-amber-200'
                    : 'text-amber-100/50 hover:text-amber-100/80'
                }`}
              >
                <span>إنجازات</span>
                {activeTab === 'achievements' && (
                  <motion.div
                    layoutId="badge_tab_indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full"
                  />
                )}
              </button>

              <button
                onClick={() => setActiveTab('honorary')}
                className={`pb-2.5 pt-3 px-3 text-xs sm:text-sm font-black transition-all relative cursor-pointer ${
                  activeTab === 'honorary'
                    ? 'text-amber-200'
                    : 'text-amber-100/50 hover:text-amber-100/80'
                }`}
              >
                <span>فخري</span>
                {activeTab === 'honorary' && (
                  <motion.div
                    layoutId="badge_tab_indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full"
                  />
                )}
              </button>

              <button
                onClick={() => setActiveTab('activity')}
                className={`pb-2.5 pt-3 px-3 text-xs sm:text-sm font-black transition-all relative cursor-pointer ${
                  activeTab === 'activity'
                    ? 'text-amber-200'
                    : 'text-amber-100/50 hover:text-amber-100/80'
                }`}
              >
                <span>نشاط</span>
                {activeTab === 'activity' && (
                  <motion.div
                    layoutId="badge_tab_indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full"
                  />
                )}
              </button>

              <button
                onClick={() => setActiveTab('games')}
                className={`pb-2.5 pt-3 px-3 text-xs sm:text-sm font-black transition-all relative cursor-pointer ${
                  activeTab === 'games'
                    ? 'text-amber-200'
                    : 'text-amber-100/50 hover:text-amber-100/80'
                }`}
              >
                <span>الألعاب</span>
                {activeTab === 'games' && (
                  <motion.div
                    layoutId="badge_tab_indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full"
                  />
                )}
              </button>
            </div>

            {/* Badges 3-Column Luxury Grid */}
            <div className="flex-1 p-4 bg-[#140D05]">
              <div className="grid grid-cols-3 gap-2.5">
                {filteredBadges.map((badge) => {
                  const isEquippedInPodium = 
                    equippedSlots.slot1 === badge.id || 
                    equippedSlots.slot2 === badge.id || 
                    equippedSlots.slot3 === badge.id;

                  return (
                    <motion.div
                      key={badge.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => {
                        if (isEquipMode) {
                          handleToggleEquipSlot(badge.id);
                        } else {
                          setSelectedBadge(badge);
                        }
                      }}
                      className={`relative rounded-2xl p-2.5 flex flex-col items-center justify-between text-center border transition-all cursor-pointer ${
                        isEquippedInPodium
                          ? 'bg-gradient-to-b from-[#381F0B] to-[#241306] border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                          : 'bg-[#211409]/80 border-amber-900/40 hover:border-amber-700/60'
                      }`}
                    >
                      {/* Equipped Status Indicator */}
                      {isEquippedInPodium && (
                        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-[10px] font-black shadow-xs">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}

                      {/* Badge Icon */}
                      <div className="my-1.5 flex items-center justify-center">
                        {badge.component}
                      </div>

                      {/* Badge Title */}
                      <div className="w-full">
                        <span className="text-[11px] font-black text-amber-100/90 truncate block">
                          {badge.name}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Badge Detail Modal */}
          <AnimatePresence>
            {selectedBadge && (
              <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-[#241306] rounded-3xl p-6 max-w-xs w-full text-center text-white shadow-2xl relative border border-amber-500/40 space-y-3"
                >
                  <button
                    onClick={() => setSelectedBadge(null)}
                    className="absolute top-4 left-4 p-1.5 rounded-full bg-white/10 text-white/70 hover:bg-white/20"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="flex justify-center mb-2">
                    {selectedBadge.component}
                  </div>

                  <h3 className="text-base font-black text-amber-300">{selectedBadge.name}</h3>
                  <div className="inline-block bg-amber-500/20 text-amber-300 text-xs font-black px-3 py-1 rounded-full border border-amber-500/40">
                    {selectedBadge.points}
                  </div>

                  <p className="text-xs text-amber-100/80 leading-relaxed font-medium">
                    {selectedBadge.desc}
                  </p>

                  <div className="pt-2 flex gap-2">
                    <button
                      onClick={() => {
                        handleToggleEquipSlot(selectedBadge.id);
                        setSelectedBadge(null);
                      }}
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs shadow-md"
                    >
                      {equippedSlots.slot1 === selectedBadge.id || equippedSlots.slot2 === selectedBadge.id || equippedSlots.slot3 === selectedBadge.id
                        ? 'إلغاء التثبيت من المنصة'
                        : 'تثبيت على المنصة'}
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Help Info Modal */}
          <AnimatePresence>
            {showHelpModal && (
              <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-[#241306] rounded-3xl p-6 max-w-sm w-full text-white shadow-2xl relative border border-amber-500/40 space-y-4"
                >
                  <button
                    onClick={() => setShowHelpModal(false)}
                    className="absolute top-4 left-4 p-1.5 rounded-full bg-white/10 text-white/70 hover:bg-white/20"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-amber-300">قواعد الشارات والأوسمة</h3>
                      <p className="text-xs text-amber-200/60">نظام نقاط الإنجاز ومنصة العرض</p>
                    </div>
                  </div>

                  <div className="space-y-2.5 text-xs text-amber-100/90">
                    <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-800/60 flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>تمنحك كل شارة يتم فتحها نقاط إنجاز تُظهر مكانتك الرفيعة في التطبيق.</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-800/60 flex items-start gap-2">
                      <Shield className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>يمكنك تثبيت حتى 3 شارات مفضلة على المنصة لتظهر في ملفك الشخصي.</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowHelpModal(false)}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs shadow-md"
                  >
                    إغلاق
                  </button>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
