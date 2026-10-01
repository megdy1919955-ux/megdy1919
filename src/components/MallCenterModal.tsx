import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, Sparkles, Gift, ShoppingBag, Car, Smile, MessageSquare, 
  Layers, Plus, Ticket, Eye, Check, X, Send, Coins, Crown, Flame, Star, Play
} from 'lucide-react';

interface MallCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  userAvatar?: string;
  userName?: string;
  coinsBalance?: number;
  onRechargeClick?: () => void;
}

export const MallCenterModal: React.FC<MallCenterModalProps> = ({
  isOpen,
  onClose,
  userAvatar = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
  userName = "عابر سبيل",
  coinsBalance = 30,
  onRechargeClick
}) => {
  const [activeTab, setActiveTab] = useState<'emojis' | 'vehicles' | 'frames' | 'bubbles'>('emojis');
  const [userCoins, setUserCoins] = useState<number>(coinsBalance);
  const [userCoupons, setUserCoupons] = useState<number>(0);
  const [previewItem, setPreviewItem] = useState<{
    id: string;
    title: string;
    type: 'frame' | 'vehicle' | 'bubble' | 'emoji';
    imageOrSvg: string;
  } | null>(null);
  const [purchaseSuccessItem, setPurchaseSuccessItem] = useState<string | null>(null);
  const [giftTargetModalItem, setGiftTargetModalItem] = useState<{ id: string; name: string } | null>(null);
  const [friendIdToSend, setFriendIdToSend] = useState('');
  const [giftSentSuccess, setGiftSentSuccess] = useState(false);

  if (!isOpen) return null;

  // 1. بيانات الرموز التعبيرية (Emojis - 7 Days)
  const emojisList = [
    {
      id: 'emoji_khaliji_pack',
      title: 'باقة الشخصيات الخليجية والمرحة',
      days: '7 أيام',
      price: '25,000',
      priceNum: 25000,
      image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=200',
      tag: '🔥 الأكثر طلباً',
      icons: ['😎', '🧔🏻‍♂️', '☕️', '🇶🇦', '✨']
    },
    {
      id: 'emoji_royal_lion',
      title: 'تعبيرات الأسد الملكي والضحك',
      days: '7 أيام',
      price: '5,000',
      priceNum: 5000,
      image: 'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?auto=format&fit=crop&q=80&w=200',
      tag: 'جديد',
      icons: ['🦁', '👑', '🔥', '💪', '🏆']
    },
    {
      id: 'emoji_comedy_actor',
      title: 'ملصقات نجوم الكوميديا والسينما',
      days: '7 أيام',
      price: '25,000',
      priceNum: 25000,
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      tag: 'مميز',
      icons: ['😂', '🎭', '👏', '🍿', '💃']
    },
    {
      id: 'emoji_romance_pack',
      title: 'حزمة القلوب والمشاعر الرومانسية',
      days: '7 أيام',
      price: '5,000',
      priceNum: 5000,
      image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=200',
      tag: 'رومانسي',
      icons: ['💖', '🌹', '💌', '🥰', '🕊️']
    },
    {
      id: 'emoji_anime_reactions',
      title: 'تعبيرات أنمي تشيبي الحصرية',
      days: '7 أيام',
      price: '10,000',
      priceNum: 10000,
      image: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80&w=200',
      tag: 'أنمي',
      icons: ['🐱', '🌸', '🥺', '⚡️', '🎉']
    },
  ];

  // 2. بيانات مول السيارات والمركبات (Vehicles - 14 Days)
  const vehiclesList = [
    {
      id: 'veh_snow_rabbits',
      title: 'موكب الأرانب الثلجية الملكي',
      days: '14 يوماً',
      price: '80,000',
      priceNum: 80000,
      image: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&q=80&w=200',
      badge: '❄️ شتوي فاخر'
    },
    {
      id: 'veh_white_porsche',
      title: 'بورش GT3 بيضاء ناصعة',
      days: '14 يوماً',
      price: '100,000',
      priceNum: 100000,
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=200',
      badge: '🏎️ سوبركار'
    },
    {
      id: 'veh_pink_lambo',
      title: 'لامبورغيني وردية نيون خارقة',
      days: '14 يوماً',
      price: '100,000',
      priceNum: 100000,
      image: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&q=80&w=200',
      badge: '💖 VIP حصري'
    },
    {
      id: 'veh_cyber_future',
      title: 'مركبة المستقبل النيون الفضائية',
      days: '14 يوماً',
      price: '70,000',
      priceNum: 70000,
      image: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&q=80&w=200',
      badge: '⚡ سايبر'
    },
    {
      id: 'veh_gold_classic',
      title: 'رولز رويس كلاسيكية ذهبية',
      days: '14 يوماً',
      price: '80,000',
      priceNum: 80000,
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=200',
      badge: '👑 ملوكي'
    },
    {
      id: 'veh_military_jeep',
      title: 'جيب رانجلر بوليسي مدرع',
      days: '14 يوماً',
      price: '50,000',
      priceNum: 50000,
      image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=200',
      badge: '🛡️ حربي'
    },
    {
      id: 'veh_legend_eagle',
      title: 'النسر الإمبراطوري الذهبي المجنح',
      days: '14 يوماً',
      price: '60,000',
      priceNum: 60000,
      image: 'https://images.unsplash.com/photo-1611689342806-0863700ce8e4?auto=format&fit=crop&q=80&w=200',
      badge: '🦅 أسطوري'
    },
    {
      id: 'veh_love_angels',
      title: 'عربة ملائكة الحب والزهور',
      days: '14 يوماً',
      price: '50,000',
      priceNum: 50000,
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=200',
      badge: '🕊️ حب وسلام'
    }
  ];

  // 3. بيانات الإطارات (Avatar Frames - 14 Days)
  const framesList = [
    {
      id: 'frame_ice_castle',
      title: 'إطار القصر الجليدي الأزرق',
      days: '14 يوماً',
      price: '200,000',
      priceNum: 200000,
      color: 'border-sky-400',
      ringGradient: 'from-cyan-300 via-sky-400 to-blue-600',
      badge: '❄️ صقيع ماسي'
    },
    {
      id: 'frame_royal_pink_rose',
      title: 'إطار الورد الملكي الزهري',
      days: '14 يوماً',
      price: '100,000',
      priceNum: 100000,
      color: 'border-rose-400',
      ringGradient: 'from-pink-300 via-rose-400 to-red-500',
      badge: '🌹 ورد جوري'
    },
    {
      id: 'frame_blue_tornado',
      title: 'إطار التورنادو الأزرق العاصف',
      days: '14 يوماً',
      price: '100,000',
      priceNum: 100000,
      color: 'border-blue-500',
      ringGradient: 'from-blue-400 via-indigo-500 to-cyan-400',
      badge: '🌪️ إعصار'
    },
    {
      id: 'frame_red_black_dragon',
      title: 'إطار التنين الأحمر والأسود الناري',
      days: '14 يوماً',
      price: '100,000',
      priceNum: 100000,
      color: 'border-red-600',
      ringGradient: 'from-red-500 via-amber-600 to-slate-900',
      badge: '🐉 تنين النار'
    },
    {
      id: 'frame_spring_window',
      title: 'إطار نافذة الورود والربيع',
      days: '14 يوماً',
      price: '50,000',
      priceNum: 50000,
      color: 'border-emerald-400',
      ringGradient: 'from-lime-300 via-emerald-400 to-teal-600',
      badge: '🌿 ربيع'
    },
    {
      id: 'frame_diamond_imperial_crown',
      title: 'إطار الألماس والتاج الملكي الفاخر',
      days: '14 يوماً',
      price: '999,999',
      priceNum: 999999,
      color: 'border-amber-300',
      ringGradient: 'from-yellow-200 via-amber-400 to-yellow-500',
      badge: '👑 أسطورة'
    },
    {
      id: 'frame_billiard_table',
      title: 'إطار طاولة البلياردو الاحترافي',
      days: '14 يوماً',
      price: '50,000',
      priceNum: 50000,
      color: 'border-emerald-600',
      ringGradient: 'from-emerald-400 via-green-600 to-amber-600',
      badge: '🎱 بلياردو'
    },
    {
      id: 'frame_gold_birthday',
      title: 'إطار أعياد الميلاد والذهب الساطع',
      days: '14 يوماً',
      price: '50,000',
      priceNum: 50000,
      color: 'border-yellow-400',
      ringGradient: 'from-yellow-300 via-amber-400 to-orange-500',
      badge: '🎂 احتفال'
    }
  ];

  // 4. بيانات فقاعات الدردشة (Chat Bubbles - 14 Days)
  const bubblesList = [
    {
      id: 'bubble_royal_palace',
      title: 'فقاعة القلعة الملكية الفاخرة',
      days: '14 يوماً',
      price: '999,999',
      priceNum: 999999,
      bgGradient: 'from-[#3a2208] via-[#241403] to-[#120a01]',
      borderColor: 'border-amber-400',
      textColor: 'text-amber-200',
      iconEmoji: '🏰'
    },
    {
      id: 'bubble_rainbow_glow',
      title: 'فقاعة قوس قزح اللامع والسحاب',
      days: '14 يوماً',
      price: '100,000',
      priceNum: 100000,
      bgGradient: 'from-indigo-900 via-purple-900 to-pink-900',
      borderColor: 'border-purple-400',
      textColor: 'text-pink-200',
      iconEmoji: '🌈'
    },
    {
      id: 'bubble_golden_falcon',
      title: 'الفقاعة الذهبية مع الصقر العربي',
      days: '14 يوماً',
      price: '90,000',
      priceNum: 90000,
      bgGradient: 'from-[#2e2007] via-[#1a1202] to-[#0d0901]',
      borderColor: 'border-yellow-500',
      textColor: 'text-yellow-200',
      iconEmoji: '🦅'
    },
    {
      id: 'bubble_desert_stars',
      title: 'الفقاعة الرملية ونجوم الليل',
      days: '14 يوماً',
      price: '50,000',
      priceNum: 50000,
      bgGradient: 'from-amber-950 via-slate-900 to-slate-950',
      borderColor: 'border-amber-500/50',
      textColor: 'text-amber-100',
      iconEmoji: '✨'
    },
    {
      id: 'bubble_pink_ribbon',
      title: 'الفقاعة الوردية بالفيونكات الحريرية',
      days: '14 يوماً',
      price: '50,000',
      priceNum: 50000,
      bgGradient: 'from-rose-950 via-pink-950 to-slate-950',
      borderColor: 'border-pink-400',
      textColor: 'text-pink-100',
      iconEmoji: '🎀'
    },
    {
      id: 'bubble_sapphire_frost',
      title: 'الفقاعة السماوية والياقوت الأزرق',
      days: '14 يوماً',
      price: '50,000',
      priceNum: 50000,
      bgGradient: 'from-sky-950 via-blue-950 to-slate-950',
      borderColor: 'border-sky-400',
      textColor: 'text-sky-100',
      iconEmoji: '💎'
    },
  ];

  const handleBuyItem = (item: { id: string; title: string; priceNum: number }) => {
    if (userCoins < item.priceNum) {
      // Prompt recharge or show alert
      if (onRechargeClick) {
        onRechargeClick();
      } else {
        alert('رصيدك من العملات الذهبية غير كافٍ. يرجى الشحن أولاً!');
      }
      return;
    }
    setUserCoins(prev => prev - item.priceNum);
    setPurchaseSuccessItem(item.title);
    setTimeout(() => setPurchaseSuccessItem(null), 3000);
  };

  const handleSendGift = () => {
    if (!friendIdToSend) return;
    setGiftSentSuccess(true);
    setTimeout(() => {
      setGiftSentSuccess(false);
      setGiftTargetModalItem(null);
      setFriendIdToSend('');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md overflow-hidden font-sans" dir="rtl">
      {/* Fullscreen Royal Glass Container */}
      <div className="relative w-full max-w-lg h-full sm:h-[92vh] sm:rounded-3xl bg-gradient-to-b from-[#161005] via-[#0d0a03] to-[#070501] border border-amber-500/30 flex flex-col overflow-hidden shadow-2xl">
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 inset-x-0 h-72 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/20 via-yellow-600/10 to-transparent pointer-events-none" />
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        {/* Top Navigation Bar */}
        <div className="relative z-10 px-4 py-3.5 flex items-center justify-between border-b border-amber-500/20 bg-slate-950/50 backdrop-blur-md">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/5 border border-amber-500/30 text-amber-300 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all cursor-pointer shadow-sm"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="text-center">
            <h2 className="text-base sm:text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-300 tracking-wide flex items-center justify-center gap-1.5 font-serif">
              <span>المركز التجاري</span>
              <ShoppingBag className="w-4 h-4 text-amber-400" />
            </h2>
            <p className="text-[10px] text-amber-200/60 font-bold">المتجر الملكي للإطارات والسيارات والفقاعات والملصقات</p>
          </div>

          <button
            onClick={onRechargeClick}
            className="px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-xs flex items-center gap-1 shadow-md hover:opacity-95 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>شحن</span>
          </button>
        </div>

        {/* Wallet & Coupons Banner */}
        <div className="relative z-10 px-4 py-2.5 bg-slate-950/60 border-b border-amber-500/20 flex items-center justify-between">
          
          {/* Coins Balance Box */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 border border-yellow-200 flex items-center justify-center shadow-sm">
              <Coins className="w-4 h-4 text-slate-950" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">رصيد العملات</span>
              <span className="text-sm font-black text-amber-400 font-mono">
                {userCoins.toLocaleString('en-US')}
              </span>
            </div>
          </div>

          {/* Coupons Banner */}
          <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/30 px-3 py-1 rounded-xl">
            <Ticket className="w-4 h-4 text-amber-400" />
            <div className="text-right">
              <span className="text-[10px] text-slate-300 font-bold">قسائم: </span>
              <span className="text-xs font-black text-amber-300 font-mono">{userCoupons}</span>
            </div>
            <button 
              onClick={() => {
                setUserCoupons(prev => prev + 1);
                alert('تمت المطالبة بقسيمة الخصم الملكية بنجاح!');
              }}
              className="mr-1 text-[9px] bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded-lg hover:bg-amber-400 cursor-pointer shadow-2xs"
            >
              مطالبة
            </button>
          </div>

        </div>

        {/* 4 Main Categories Tabs */}
        <div className="relative z-10 px-3 pt-2 pb-1 grid grid-cols-4 gap-1 bg-slate-950/40 border-b border-white/5 text-center">
          {[
            { id: 'emojis', label: 'رمز تعبيري', icon: Smile },
            { id: 'vehicles', label: 'مول السيارات', icon: Car },
            { id: 'frames', label: 'إطارات', icon: Layers },
            { id: 'bubbles', label: 'فقاعة', icon: MessageSquare },
          ].map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 text-xs font-black rounded-xl transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md scale-102 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="truncate w-full">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Products Grid */}
        <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-3 pb-8">
          
          {/* 1. TAB: EMOJIS (رمز تعبيري) */}
          {activeTab === 'emojis' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {emojisList.map((emoji) => (
                <div
                  key={emoji.id}
                  className="rounded-2xl bg-gradient-to-b from-[#241a06] to-[#120d03] border border-amber-500/30 p-3 flex flex-col justify-between shadow-md hover:border-amber-400/60 transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <div className="relative w-16 h-16 rounded-xl bg-slate-950 border border-amber-500/20 overflow-hidden shrink-0 shadow-inner flex items-center justify-center">
                      <img src={emoji.image} alt={emoji.title} className="w-full h-full object-cover" />
                      <span className="absolute bottom-0 inset-x-0 bg-slate-950/80 text-[8px] text-amber-300 font-bold text-center py-0.2 font-mono">
                        {emoji.days}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded border border-amber-500/30 font-bold">
                          {emoji.tag}
                        </span>
                        <div className="flex items-center gap-1 text-amber-400 font-mono font-black text-xs">
                          <Coins className="w-3 h-3" />
                          <span>{emoji.price}</span>
                        </div>
                      </div>

                      <h4 className="text-xs font-black text-white group-hover:text-amber-200 transition-colors mt-1 line-clamp-1">
                        {emoji.title}
                      </h4>

                      <div className="flex items-center gap-1 mt-2 text-base">
                        {emoji.icons.map((ic, i) => (
                          <span key={i} className="hover:scale-125 transition-transform cursor-pointer">
                            {ic}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleBuyItem(emoji)}
                    className="w-full mt-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-xs shadow-sm hover:opacity-95 cursor-pointer flex items-center justify-center gap-1"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>يشترى</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* 2. TAB: VEHICLES (مول السيارات) */}
          {activeTab === 'vehicles' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {vehiclesList.map((veh) => (
                <div
                  key={veh.id}
                  className="rounded-2xl bg-gradient-to-b from-[#241a06] to-[#120d03] border border-amber-500/30 p-3 flex flex-col justify-between shadow-md hover:border-amber-400/60 transition-all group"
                >
                  <div>
                    {/* Header with Badge & Price */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[9px] bg-white/10 text-amber-300 px-2 py-0.5 rounded-full border border-white/10 font-bold">
                        {veh.badge}
                      </span>
                      <div className="flex items-center gap-1 text-amber-400 font-mono font-black text-xs">
                        <Coins className="w-3 h-3" />
                        <span>{veh.price}</span>
                      </div>
                    </div>

                    {/* Vehicle Image Container */}
                    <div className="relative w-full h-28 rounded-xl bg-slate-950/80 border border-amber-500/20 overflow-hidden shadow-inner flex items-center justify-center p-2">
                      <img src={veh.image} alt={veh.title} className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300" />
                      <span className="absolute bottom-1.5 left-2 bg-slate-950/90 text-amber-300 text-[9px] font-mono px-1.5 py-0.5 rounded border border-amber-400/30">
                        {veh.days}
                      </span>
                    </div>

                    <h4 className="text-xs font-black text-white group-hover:text-amber-200 transition-colors mt-2 truncate text-right">
                      {veh.title}
                    </h4>
                  </div>

                  {/* Actions (Try, Buy, Send) */}
                  <div className="grid grid-cols-3 gap-1.5 mt-3">
                    <button
                      onClick={() => setPreviewItem({
                        id: veh.id,
                        title: veh.title,
                        type: 'vehicle',
                        imageOrSvg: veh.image
                      })}
                      className="py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 font-bold text-[11px] flex items-center justify-center gap-1 cursor-pointer transition-all border border-white/10"
                    >
                      <Eye className="w-3 h-3" />
                      <span>محاولة</span>
                    </button>

                    <button
                      onClick={() => handleBuyItem(veh)}
                      className="py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-[11px] flex items-center justify-center gap-1 cursor-pointer shadow-sm hover:opacity-95"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>يشترى</span>
                    </button>

                    <button
                      onClick={() => setGiftTargetModalItem({ id: veh.id, name: veh.title })}
                      className="py-1.5 rounded-xl bg-rose-600/30 hover:bg-rose-600/40 text-rose-300 border border-rose-500/40 font-bold text-[11px] flex items-center justify-center gap-1 cursor-pointer transition-all"
                    >
                      <Send className="w-3 h-3" />
                      <span>إرسال</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 3. TAB: FRAMES (إطارات) */}
          {activeTab === 'frames' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {framesList.map((frame) => (
                <div
                  key={frame.id}
                  className="rounded-2xl bg-gradient-to-b from-[#241a06] to-[#120d03] border border-amber-500/30 p-3 flex flex-col justify-between shadow-md hover:border-amber-400/60 transition-all group"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[9px] bg-white/10 text-amber-300 px-2 py-0.5 rounded-full border border-white/10 font-bold">
                        {frame.badge}
                      </span>
                      <div className="flex items-center gap-1 text-amber-400 font-mono font-black text-xs">
                        <Coins className="w-3 h-3" />
                        <span>{frame.price}</span>
                      </div>
                    </div>

                    {/* Frame Preview Display on Avatar */}
                    <div className="relative w-full py-4 rounded-xl bg-slate-950/80 border border-amber-500/20 flex flex-col items-center justify-center shadow-inner">
                      <div className={`relative w-16 h-16 rounded-full p-1 bg-gradient-to-tr ${frame.ringGradient} shadow-[0_0_15px_rgba(245,158,11,0.4)]`}>
                        <img src={userAvatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                      </div>
                      <span className="mt-2 text-[9px] font-mono text-slate-400">
                        صلاحية: {frame.days}
                      </span>
                    </div>

                    <h4 className="text-xs font-black text-white group-hover:text-amber-200 transition-colors mt-2 truncate text-right">
                      {frame.title}
                    </h4>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-3 gap-1.5 mt-3">
                    <button
                      onClick={() => setPreviewItem({
                        id: frame.id,
                        title: frame.title,
                        type: 'frame',
                        imageOrSvg: frame.ringGradient
                      })}
                      className="py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 font-bold text-[11px] flex items-center justify-center gap-1 cursor-pointer transition-all border border-white/10"
                    >
                      <Eye className="w-3 h-3" />
                      <span>جرب الآن</span>
                    </button>

                    <button
                      onClick={() => handleBuyItem(frame)}
                      className="py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-[11px] flex items-center justify-center gap-1 cursor-pointer shadow-sm hover:opacity-95"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>يشترى</span>
                    </button>

                    <button
                      onClick={() => setGiftTargetModalItem({ id: frame.id, name: frame.title })}
                      className="py-1.5 rounded-xl bg-rose-600/30 hover:bg-rose-600/40 text-rose-300 border border-rose-500/40 font-bold text-[11px] flex items-center justify-center gap-1 cursor-pointer transition-all"
                    >
                      <Send className="w-3 h-3" />
                      <span>إرسال</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 4. TAB: CHAT BUBBLES (فقاعة) */}
          {activeTab === 'bubbles' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {bubblesList.map((bubble) => (
                <div
                  key={bubble.id}
                  className="rounded-2xl bg-gradient-to-b from-[#241a06] to-[#120d03] border border-amber-500/30 p-3 flex flex-col justify-between shadow-md hover:border-amber-400/60 transition-all group"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] text-amber-300 font-bold flex items-center gap-1">
                        <span>{bubble.iconEmoji}</span>
                        <span className="text-[9px] text-slate-400">{bubble.days}</span>
                      </span>
                      <div className="flex items-center gap-1 text-amber-400 font-mono font-black text-xs">
                        <Coins className="w-3 h-3" />
                        <span>{bubble.price}</span>
                      </div>
                    </div>

                    {/* Chat Bubble Render with "Hello" */}
                    <div className="relative w-full py-4 px-3 rounded-xl bg-slate-950/80 border border-amber-500/20 flex items-center justify-center shadow-inner">
                      <div className={`p-3 rounded-2xl bg-gradient-to-r ${bubble.bgGradient} border-2 ${bubble.borderColor} shadow-md flex items-center gap-2 max-w-full`}>
                        <span className="text-xs font-black font-mono text-white tracking-wide">Hello 👋</span>
                        <span className="text-xs">{bubble.iconEmoji}</span>
                      </div>
                    </div>

                    <h4 className="text-xs font-black text-white group-hover:text-amber-200 transition-colors mt-2 truncate text-right">
                      {bubble.title}
                    </h4>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <button
                      onClick={() => handleBuyItem(bubble)}
                      className="py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-xs flex items-center justify-center gap-1 cursor-pointer shadow-sm hover:opacity-95"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>يشترى</span>
                    </button>

                    <button
                      onClick={() => setGiftTargetModalItem({ id: bubble.id, name: bubble.title })}
                      className="py-1.5 rounded-xl bg-rose-600/30 hover:bg-rose-600/40 text-rose-300 border border-rose-500/40 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>إرسال</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Purchase Notification Toast */}
        <AnimatePresence>
          {purchaseSuccessItem && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-6 inset-x-6 z-50 bg-emerald-600 text-white p-3 rounded-2xl shadow-2xl flex items-center justify-between border border-emerald-400 font-bold text-xs"
            >
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 bg-white text-emerald-600 rounded-full p-0.5 shrink-0" />
                <span>تم شراء "{purchaseSuccessItem}" بنجاح وإضافته إلى حقيبتك ومظهرك!</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Preview Simulation Modal */}
        <AnimatePresence>
          {previewItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-50 p-5 flex flex-col justify-center items-center"
            >
              <div className="w-full max-w-sm bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/40 rounded-3xl p-5 shadow-2xl space-y-4 text-center">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="text-sm font-black text-amber-300">
                    معاينة فورية: {previewItem.title}
                  </h3>
                  <button
                    onClick={() => setPreviewItem(null)}
                    className="w-7 h-7 rounded-full bg-white/5 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="py-6 flex flex-col items-center justify-center">
                  {previewItem.type === 'frame' ? (
                    <div className={`relative w-28 h-28 rounded-full p-2 bg-gradient-to-tr ${previewItem.imageOrSvg} shadow-[0_0_30px_rgba(245,158,11,0.6)]`}>
                      <img src={userAvatar} alt="Preview Avatar" className="w-full h-full rounded-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-48 h-32 rounded-2xl overflow-hidden shadow-2xl border border-amber-500/40">
                      <img src={previewItem.imageOrSvg} alt="Preview Item" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <span className="text-xs font-black text-amber-200 mt-4 block">
                    {userName}
                  </span>
                  <span className="text-[10px] text-slate-400">تأثير الظهور الملكي في الغرفة والملف</span>
                </div>

                <button
                  onClick={() => setPreviewItem(null)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs hover:opacity-95 cursor-pointer shadow-md"
                >
                  إغلاق المعاينة
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Send Gift to Friend Modal */}
        <AnimatePresence>
          {giftTargetModalItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-50 p-5 flex flex-col justify-center items-center"
            >
              <div className="w-full max-w-sm bg-gradient-to-b from-slate-900 to-slate-950 border border-rose-500/40 rounded-3xl p-5 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="text-sm font-black text-rose-300 flex items-center gap-2">
                    <Gift className="w-4 h-4 text-rose-400" />
                    <span>إهداء: {giftTargetModalItem.name}</span>
                  </h3>
                  <button
                    onClick={() => setGiftTargetModalItem(null)}
                    className="w-7 h-7 rounded-full bg-white/5 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {giftSentSuccess ? (
                  <div className="py-6 text-center text-emerald-400 font-bold text-xs space-y-2">
                    <Check className="w-10 h-10 mx-auto bg-emerald-500/20 rounded-full p-2" />
                    <p>تم إرسال الهدية بنجاح إلى الصديق مع رسالة تهنئة ملكية!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-300 block text-right">
                      أدخل معرّف الصديق (User ID):
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: 216625600"
                      value={friendIdToSend}
                      onChange={(e) => setFriendIdToSend(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white font-mono text-center focus:border-rose-500 outline-none"
                    />

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        onClick={handleSendGift}
                        disabled={!friendIdToSend}
                        className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-black text-xs hover:opacity-95 cursor-pointer shadow-md disabled:opacity-50"
                      >
                        إرسال الهدية الآن
                      </button>
                      <button
                        onClick={() => setGiftTargetModalItem(null)}
                        className="px-4 py-2.5 rounded-xl bg-white/10 text-slate-300 text-xs font-bold hover:bg-white/15 cursor-pointer"
                      >
                        إلغاء
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
