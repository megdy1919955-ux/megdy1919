import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, X, Check, Package, Sparkles, Eye, Car, Mic, Palette, Type, Award } from 'lucide-react';
import { 
  RoyalHonorAvatarFrame, 
  Noble3AvatarFrame, 
  KnightSapphireAvatarFrame, 
  ImperialCrownAvatarFrame, 
  RoyalPinkChatBubble, 
  NobleSlateChatBubble, 
  DiamondCoralChatBubble 
} from './profile/AppearanceAssets';

interface AppearanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  avatarUrl?: string;
  userName?: string;
  onEquipFrame?: (frameId: string) => void;
  onEquipBubble?: (bubbleId: string) => void;
}

export const AppearanceModal: React.FC<AppearanceModalProps> = ({ 
  isOpen, 
  onClose,
  avatarUrl = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
  userName = "عابر سبيل",
  onEquipFrame,
  onEquipBubble
}) => {
  const [activeTab, setActiveTab] = useState<string>('frames');
  const [equippedFrameId, setEquippedFrameId] = useState<string>('frame_royal');
  const [equippedBubbleId, setEquippedBubbleId] = useState<string>('bubble_coral');
  const [previewFrameId, setPreviewFrameId] = useState<string | null>(null);
  const [previewBubbleId, setPreviewBubbleId] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories = [
    { id: 'frames', label: 'مربع صورتي' },
    { id: 'bubbles', label: 'فقاعة' },
    { id: 'vehicles', label: 'سيارتي' },
    { id: 'profile_deco', label: 'تزيين ملف التعريف' },
    { id: 'mic_wave', label: 'موجة الميكروفون' },
    { id: 'color_id', label: 'معرّف اللون' },
    { id: 'color_title', label: 'لقب ملون' },
    { id: 'custom_mic', label: 'الميكروفون الخاصة بي' },
  ];

  // 1. بيانات إطارات الصور (Avatar Frames - Image 1)
  const framesList = [
    {
      id: 'frame_royal',
      name: 'إطار الشرف الملكي والماسي',
      deadlineDate: '03:00:00 2038/01/01',
      component: (
        <RoyalHonorAvatarFrame className="w-24 h-24">
          <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
        </RoyalHonorAvatarFrame>
      )
    },
    {
      id: 'frame_noble_3',
      name: 'إطار NOBLE 3 الفضي والزمردي',
      deadlineDate: '03:00:00 2026/09/01',
      component: (
        <Noble3AvatarFrame className="w-24 h-24">
          <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
        </Noble3AvatarFrame>
      )
    },
    {
      id: 'frame_knight_sapphire',
      name: 'إطار الفارس والياقوت الأزرق',
      deadlineDate: '13:46:42 2026/09/03',
      component: (
        <KnightSapphireAvatarFrame className="w-24 h-24">
          <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
        </KnightSapphireAvatarFrame>
      )
    },
    {
      id: 'frame_imperial_crown',
      name: 'إطار التاج الإمبراطوري والأسود',
      deadlineDate: '13:46:26 2026/08/29',
      component: (
        <ImperialCrownAvatarFrame className="w-24 h-24">
          <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
        </ImperialCrownAvatarFrame>
      )
    }
  ];

  // 2. بيانات فقاعات الدردشة (Chat Bubbles - Image 2)
  const bubblesList = [
    {
      id: 'bubble_pink',
      name: 'فقاعة الأجنحة الذهبية والوردي',
      deadlineDate: '13:46:26 2026/08/29',
      component: <RoyalPinkChatBubble text="Hello" />
    },
    {
      id: 'bubble_noble',
      name: 'فقاعة NOBLE الفارس الرمادية',
      deadlineDate: '03:00:00 2026/09/01',
      component: <NobleSlateChatBubble text="Hello" />
    },
    {
      id: 'bubble_coral',
      name: 'فقاعة الألماس الذهبية',
      deadlineDate: '13:46:42 2026/09/03',
      component: <DiamondCoralChatBubble text="Hello" />
    }
  ];

  // 3. المركبات وسيارات الدخول (Vehicles)
  const vehiclesList = [
    {
      id: 'veh_rolls',
      name: 'سيارة رولز رويس الفانتوم الذهبية',
      deadlineDate: '03:00:00 2028/01/01',
      icon: '🏎️',
      color: 'from-amber-500 to-yellow-300'
    },
    {
      id: 'veh_dragon',
      name: 'تنين اللهب الإمبراطوري المجنح',
      deadlineDate: '12:00:00 2026/12/31',
      icon: '🐉',
      color: 'from-rose-600 to-red-500'
    },
    {
      id: 'veh_yacht',
      name: 'يخت النجم الملكي فائق الفخامة',
      deadlineDate: '15:30:00 2026/10/15',
      icon: '🛥️',
      color: 'from-sky-500 to-blue-600'
    }
  ];

  const handleEquipFrame = (id: string) => {
    if (equippedFrameId === id) {
      setEquippedFrameId('');
      if (onEquipFrame) onEquipFrame('');
    } else {
      setEquippedFrameId(id);
      if (onEquipFrame) onEquipFrame(id);
    }
  };

  const handleEquipBubble = (id: string) => {
    if (equippedBubbleId === id) {
      setEquippedBubbleId('');
      if (onEquipBubble) onEquipBubble('');
    } else {
      setEquippedBubbleId(id);
      if (onEquipBubble) onEquipBubble(id);
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
          className="w-full max-w-md h-full sm:h-[92vh] max-h-[900px] bg-[#F8FAFC] rounded-none sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col relative text-slate-900 border-0 sm:border border-slate-200"
        >
          {/* Top Navigation Bar */}
          <div className="relative px-4 pt-4 pb-2 flex items-center justify-between shrink-0 bg-white border-b border-slate-100 z-20">
            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <h1 className="text-base sm:text-lg font-black tracking-wide text-slate-900">مظهري</h1>

            <button
              className="p-2 rounded-full text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="خزانة المظهر"
            >
              <Package className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          {/* Horizontal Scrollable Categories Tabs */}
          <div className="flex items-center gap-4 px-4 overflow-x-auto no-scrollbar bg-white border-b border-slate-200/80 shrink-0 z-20">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`pb-3 pt-2.5 text-xs sm:text-sm font-black whitespace-nowrap transition-all relative cursor-pointer ${
                  activeTab === cat.id
                    ? 'text-slate-950'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <span>{cat.label}</span>
                {activeTab === cat.id && (
                  <motion.div
                    layoutId="appearance_tab_indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#10B981] rounded-full"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Scrollable Items Grid */}
          <div className="flex-1 overflow-y-auto p-4 bg-[#F1F5F9] no-scrollbar">
            {/* 1. مربع صورتي (Avatar Frames Tab) */}
            {activeTab === 'frames' && (
              <div className="grid grid-cols-2 gap-3.5">
                {framesList.map((frame) => {
                  const isEquipped = equippedFrameId === frame.id;
                  const isPreviewing = previewFrameId === frame.id;

                  return (
                    <motion.div
                      key={frame.id}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white rounded-2xl p-3 shadow-xs border border-slate-200/80 flex flex-col items-center justify-between relative group"
                    >
                      {/* Top Pill: جرب الآن */}
                      <div className="w-full flex items-center justify-between mb-1">
                        <button
                          onClick={() => setPreviewFrameId(isPreviewing ? null : frame.id)}
                          className="bg-[#10B981]/10 hover:bg-[#10B981]/20 text-[#10B981] text-[10px] font-black px-2.5 py-0.5 rounded-full transition-colors cursor-pointer"
                        >
                          {isPreviewing ? 'إلغاء المعاينة' : 'جرب الآن'}
                        </button>
                        {isEquipped && (
                          <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>

                      {/* Frame Visual Preview */}
                      <div className="my-3 flex items-center justify-center">
                        {frame.component}
                      </div>

                      {/* Expiration Deadline Information */}
                      <div className="w-full text-center space-y-0.5 mb-3">
                        <div className="text-[10px] text-slate-400 font-bold">الموعد النهائي:</div>
                        <div className="text-[10px] font-bold text-slate-600 font-mono tracking-tight dir-ltr">
                          {frame.deadlineDate}
                        </div>
                      </div>

                      {/* Action Button: ركوب الخيل / ارتداء / تفريغ */}
                      <button
                        onClick={() => handleEquipFrame(frame.id)}
                        className={`w-full py-2 rounded-xl text-xs font-black transition-all cursor-pointer shadow-xs ${
                          isEquipped
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-[#10B981] hover:bg-[#059669] text-white'
                        }`}
                      >
                        {isEquipped ? 'تفريغ' : 'ركوب الخيل'}
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* 2. فقاعة (Chat Bubbles Tab) */}
            {activeTab === 'bubbles' && (
              <div className="grid grid-cols-2 gap-3.5">
                {bubblesList.map((bubble) => {
                  const isEquipped = equippedBubbleId === bubble.id;

                  return (
                    <motion.div
                      key={bubble.id}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white rounded-2xl p-3 shadow-xs border border-slate-200/80 flex flex-col items-center justify-between relative group"
                    >
                      {/* Top Check Indicator if equipped */}
                      <div className="w-full flex items-center justify-end mb-1 h-5">
                        {isEquipped && (
                          <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>

                      {/* Bubble Visual Preview */}
                      <div className="my-5 w-full flex items-center justify-center">
                        {bubble.component}
                      </div>

                      {/* Expiration Deadline Information */}
                      <div className="w-full text-center space-y-0.5 mb-3">
                        <div className="text-[10px] text-slate-400 font-bold">الموعد النهائي:</div>
                        <div className="text-[10px] font-bold text-slate-600 font-mono tracking-tight dir-ltr">
                          {bubble.deadlineDate}
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => handleEquipBubble(bubble.id)}
                        className={`w-full py-2 rounded-xl text-xs font-black transition-all cursor-pointer shadow-xs ${
                          isEquipped
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-[#10B981] hover:bg-[#059669] text-white'
                        }`}
                      >
                        {isEquipped ? 'تفريغ' : 'ركوب الخيل'}
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* 3. سيارتي (Vehicles Tab) */}
            {activeTab === 'vehicles' && (
              <div className="grid grid-cols-2 gap-3.5">
                {vehiclesList.map((veh) => (
                  <motion.div
                    key={veh.id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-2xl p-3 shadow-xs border border-slate-200/80 flex flex-col items-center justify-between relative"
                  >
                    <div className="w-full flex items-center justify-between mb-1">
                      <span className="bg-[#10B981]/10 text-[#10B981] text-[10px] font-black px-2.5 py-0.5 rounded-full">
                        جرب الآن
                      </span>
                    </div>

                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-tr ${veh.color} flex items-center justify-center text-4xl shadow-md my-2`}>
                      {veh.icon}
                    </div>

                    <div className="text-center font-black text-xs text-slate-800 mb-1">{veh.name}</div>

                    <div className="w-full text-center space-y-0.5 mb-3">
                      <div className="text-[10px] text-slate-400 font-bold">الموعد النهائي:</div>
                      <div className="text-[10px] font-bold text-slate-600 font-mono dir-ltr">
                        {veh.deadlineDate}
                      </div>
                    </div>

                    <button className="w-full py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white text-xs font-black shadow-xs cursor-pointer">
                      ركوب الخيل
                    </button>
                  </motion.div>
                ))}
              </div>
            )}

            {/* 4. تزيين ملف التعريف & Other Tabs */}
            {['profile_deco', 'mic_wave', 'color_id', 'color_title', 'custom_mic'].includes(activeTab) && (
              <div className="text-center py-12 px-4 space-y-3">
                <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto text-3xl">
                  ✨
                </div>
                <h3 className="text-sm font-black text-slate-900">
                  عناصر {categories.find((c) => c.id === activeTab)?.label}
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  يمكنك الحصول على هذه الديكورات الحصرية من خلال فعاليات الغرف، متجر الهدايا، ومكافآت الترقية للمستويات العليا.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
