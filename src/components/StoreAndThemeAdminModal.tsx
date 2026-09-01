import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Palette, 
  ShoppingBag, 
  Sparkles, 
  Crown, 
  Star, 
  CheckCircle2, 
  Layers, 
  Image as ImageIcon, 
  Upload, 
  Eye, 
  Plus, 
  Trash2, 
  RotateCcw,
  Tag,
  Sliders,
  Award,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Zap,
  Gift,
  Flame,
  Check,
  Diamond,
  FolderOpen
} from 'lucide-react';

interface StoreAndThemeAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
  isSuperAdmin?: boolean;
}

export const StoreAndThemeAdminModal: React.FC<StoreAndThemeAdminModalProps> = ({
  isOpen,
  onClose,
  userId = 'TH7700',
  isSuperAdmin = true
}) => {
  const [activeTab, setActiveTab] = useState<'vip_frames' | 'store_items' | 'room_themes' | 'leaderboard' | 'wallpapers'>('vip_frames');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Form State for VIP Items Upload
  const [newVipTitle, setNewVipTitle] = useState('');
  const [newVipLevel, setNewVipLevel] = useState('VIP 1');
  const [newVipPrice, setNewVipPrice] = useState('50,000');
  const [newVipImage, setNewVipImage] = useState<string | null>(null);
  const [newVipDays, setNewVipDays] = useState('30');
  const [newVipType, setNewVipType] = useState<'frame' | 'entry' | 'badge' | 'mic_effect'>('frame');

  // VIP List
  const [vipItems, setVipItems] = useState([
    {
      id: 'vip_crown_legend',
      name: 'تاج أسطورة VIP الملكي',
      level: 'VIP 10',
      type: 'إطار ملف وشات',
      price: '150,000 💎',
      image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=200',
      active: true,
      downloads: 480
    },
    {
      id: 'vip_lamborghini_entry',
      name: 'دخولية اللامبورغيني الذهبية',
      level: 'VIP 7',
      type: 'دخولية روم متحركة',
      price: '100,000 💎',
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=200',
      active: true,
      downloads: 620
    },
    {
      id: 'vip_dragon_wings',
      name: 'أجنحة التنين الإمبراطوري',
      level: 'VIP 5',
      type: 'إطار ملف شخصي',
      price: '75,000 💎',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=200',
      active: true,
      downloads: 310
    },
    {
      id: 'vip_diamond_aura',
      name: 'هالة الألماس المشعة للمايك',
      level: 'VIP 3',
      type: 'تأثير مقعد المايك',
      price: '40,000 💎',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200',
      active: false,
      downloads: 140
    }
  ]);

  // Store Items List
  const [storeItems, setStoreItems] = useState([
    {
      id: 'gift_castle',
      name: 'قلعة الملوك 🏰',
      category: 'هدايا مميزة',
      price: '99,999 💎',
      published: true,
      icon: '🏰'
    },
    {
      id: 'bubble_gold_chat',
      name: 'فقاعة شات الذهب الخالص',
      category: 'فقاعات المحادثة',
      price: '12,000 💎',
      published: true,
      icon: '💬'
    },
    {
      id: 'badge_top_supporter',
      name: 'شارة الداعم الملكي الأول',
      category: 'شارات الشرف',
      price: '25,000 💎',
      published: true,
      icon: '🎖️'
    }
  ]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleAddVipItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVipTitle.trim()) {
      showToast('⚠️ يرجى كتابة اسم عنصر الـ VIP');
      return;
    }

    const newItem = {
      id: `vip_${Date.now()}`,
      name: newVipTitle,
      level: newVipLevel,
      type: newVipType === 'frame' ? 'إطار ملف شخصي' : newVipType === 'entry' ? 'دخولية روم متحركة' : newVipType === 'badge' ? 'شارة VIP' : 'تأثير مقعد المايك',
      price: `${newVipPrice} 💎`,
      image: newVipImage || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=200',
      active: true,
      downloads: 0
    };

    setVipItems([newItem, ...vipItems]);
    setNewVipTitle('');
    setNewVipImage(null);
    showToast('✅ تم رفع عنصر الـ VIP ونشره في المتجر بنجاح!');
  };

  const toggleVipStatus = (id: string) => {
    setVipItems(items => items.map(it => it.id === id ? { ...it, active: !it.active } : it));
    showToast('تم تحديث حالة الظهور في المتجر');
  };

  const deleteVipItem = (id: string) => {
    setVipItems(items => items.filter(it => it.id !== id));
    showToast('تم حذف العنصر من قائمة المتجر');
  };

  return (
    <div 
      className="fixed inset-0 z-[100] w-full h-full min-h-screen bg-[#F7F4EE] flex flex-col overflow-y-auto select-none font-sans"
      dir="rtl"
    >
      {/* Toast Alert matching Broadcaster Center Gold Banner */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-14 left-1/2 -translate-x-1/2 z-[110] bg-gradient-to-r from-[#7A5210] via-[#A87B28] to-[#5C3C0B] text-white px-5 py-2.5 rounded-full text-xs font-black shadow-[0_10px_30px_rgba(122,82,16,0.4)] border border-[#FFE29A]/50 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-200 animate-pulse" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Header Bar (Frosted Glass with Warm Gold Accents matching Broadcaster Center) */}
      <div className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl px-4 py-3 flex items-center justify-between border-b border-[#E8DFC8] shadow-[0_4px_20px_rgba(180,160,130,0.08)]">
        {/* Left Side: Back / Admin Badge */}
        <div className="flex items-center gap-2">
          <div className="px-2.5 py-1 rounded-full bg-[#FAF5E8] border border-[#E2B755]/50 text-[#7A5210] text-[11px] font-black flex items-center gap-1 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#B38022]" />
            <span>صلاحية إداري الثيمات والمتجر</span>
          </div>
        </div>

        {/* Title */}
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-[#96743A]" />
          <h1 className="text-base sm:text-lg font-black text-[#5C3F13] tracking-tight font-serif">
            إدارة المتجر وثيمات التطبيق
          </h1>
        </div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="p-1.5 hover:bg-[#F5EFE0] active:scale-95 rounded-full text-[#8C6B38] hover:text-[#5C3F13] transition-all cursor-pointer"
          title="إغلاق"
        >
          <X className="w-5 h-5 stroke-[2.4]" />
        </button>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-lg mx-auto p-4 space-y-4 pb-16 flex-1">

        {/* ========================================================= */}
        {/* 1. HERO BOX: Ultra-Realistic Frosted Glass & Gold Card */}
        {/* ========================================================= */}
        <div className="relative overflow-hidden rounded-[32px] bg-white/85 backdrop-blur-2xl border border-white/95 p-4 sm:p-5 shadow-[0_20px_50px_rgba(180,160,130,0.18),0_4px_12px_rgba(0,0,0,0.03),inset_0_2px_4px_rgba(255,255,255,1)]">
          {/* Subtle gold decoration background */}
          <div className="absolute top-3 left-3 opacity-20 text-[#96743A]">
            <Crown className="w-8 h-8" />
          </div>

          <div className="flex items-center justify-between relative z-10">
            {/* Admin Avatar & Role Info */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-13 h-13 rounded-full p-[2.5px] bg-gradient-to-tr from-[#FFF2B8] via-[#E2B755] to-[#7A5210] shadow-[0_4px_10px_rgba(179,128,34,0.3)]">
                  <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#7A5210] via-[#C99836] to-[#FFE29A] flex items-center justify-center text-white text-xl border border-white/80 font-black shadow-inner">
                    🎨
                  </div>
                </div>
                <div className="absolute -inset-0.5 rounded-full border border-[#E2B755]/40 pointer-events-none" />
              </div>

              <div className="text-right">
                <div className="text-base font-black text-[#5C3F13] leading-tight flex items-center gap-1.5">
                  <span>استوديو الثيمات والـ VIP</span>
                  <span className="text-[10px] bg-gradient-to-r from-[#B38022] to-[#7A5210] text-white px-2 py-0.5 rounded-full font-black">
                    معتمد 🔱
                  </span>
                </div>
                <div className="text-xs font-bold font-mono text-[#8C6B38] mt-0.5" dir="ltr">
                  ADMIN ID: {userId}
                </div>
              </div>
            </div>

            {/* Quick Upload Action */}
            <button 
              onClick={() => setActiveTab('vip_frames')}
              className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#B38022] via-[#C99836] to-[#7A5210] text-white text-xs font-black shadow-[0_4px_12px_rgba(179,128,34,0.3)] hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center gap-1"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>رفع جديد</span>
            </button>
          </div>

          {/* Quick Metrics Bar in Gold styling */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-3.5 border-t border-[#E8DFC8]/60 text-center">
            <div className="bg-[#FAF6EC]/80 rounded-2xl p-2 border border-[#EAE0CD]/80">
              <span className="text-[10px] font-bold text-[#8C6B38] block">عناصر VIP المنشورة</span>
              <span className="text-sm font-black text-[#5C3F13] font-mono mt-0.5 block">{vipItems.length}</span>
            </div>
            <div className="bg-[#FAF6EC]/80 rounded-2xl p-2 border border-[#EAE0CD]/80">
              <span className="text-[10px] font-bold text-[#8C6B38] block">عناصر المتجر العام</span>
              <span className="text-sm font-black text-[#5C3F13] font-mono mt-0.5 block">{storeItems.length}</span>
            </div>
            <div className="bg-[#FAF6EC]/80 rounded-2xl p-2 border border-[#EAE0CD]/80">
              <span className="text-[10px] font-bold text-[#8C6B38] block">إجمالي التنزيلات</span>
              <span className="text-sm font-black text-[#B38022] font-mono mt-0.5 block">1,550</span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. NAVIGATION TABS (Golden Frosted Style) */}
        {/* ========================================================= */}
        <div className="flex items-center gap-1.5 p-1 bg-white/70 backdrop-blur-md rounded-2xl border border-[#EAE0CD] overflow-x-auto no-scrollbar shadow-2xs">
          {[
            { id: 'vip_frames', label: 'رفع صور الـ VIP', icon: Crown },
            { id: 'store_items', label: 'عناصر المتجر', icon: ShoppingBag },
            { id: 'room_themes', label: 'ثيمات الرومات', icon: Palette },
            { id: 'leaderboard', label: 'لوحة الشرف', icon: Award },
            { id: 'wallpapers', label: 'الخلفيات الرسمية', icon: ImageIcon },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-[#B38022] to-[#7A5210] text-white shadow-sm'
                    : 'text-[#7A5210] hover:bg-[#FAF5E8] opacity-80'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ========================================================= */}
        {/* TAB 1: رفع وإدارة صور الـ VIP (المطلوب الرئيسي من المستخدم) */}
        {/* ========================================================= */}
        {activeTab === 'vip_frames' && (
          <div className="space-y-4">
            
            {/* Upload VIP Form Card */}
            <div className="rounded-[28px] bg-white/90 backdrop-blur-xl border border-[#EAE0CD] p-4.5 shadow-[0_10px_30px_rgba(180,160,130,0.1)] space-y-3.5">
              <div className="flex items-center justify-between pb-2.5 border-b border-[#EAE0CD]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#FAF5E8] border border-[#E2B755]/50 flex items-center justify-center text-[#7A5210]">
                    <Upload className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-black text-[#5C3F13]">رفع صورة وعنصر VIP جديد للمتجر</h3>
                </div>
                <span className="text-[10px] text-[#8C6B38] font-bold">صلاحية السوبر أدمن ✓</span>
              </div>

              <form onSubmit={handleAddVipItem} className="space-y-3">
                
                {/* Image Upload Area */}
                <div>
                  <label className="block text-[11px] font-black text-[#5C3F13] mb-1">
                    صورة الـ VIP (إطار / دخولية / شارة / مقعد)
                  </label>
                  <div 
                    onClick={() => {
                      const sampleImages = [
                        'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=300',
                        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=300',
                        'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=300',
                        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=300'
                      ];
                      const chosen = sampleImages[Math.floor(Math.random() * sampleImages.length)];
                      setNewVipImage(chosen);
                      showToast('تم تحديد وتجهيز الصورة للرفع 🖼️');
                    }}
                    className="w-full h-28 rounded-2xl border-2 border-dashed border-[#D6C5A2] hover:border-[#B38022] bg-[#FAF8F3] hover:bg-white flex flex-col items-center justify-center p-3 cursor-pointer transition-all group"
                  >
                    {newVipImage ? (
                      <div className="flex items-center gap-3">
                        <img 
                          src={newVipImage} 
                          alt="VIP Preview" 
                          className="w-16 h-16 rounded-xl object-cover border-2 border-[#E2B755] shadow-md"
                        />
                        <div className="text-right">
                          <span className="text-xs font-black text-[#5C3F13] block">تم اختيار الصورة بنجاح ✓</span>
                          <span className="text-[10px] text-[#8C6B38]">اضغط لتغيير الصورة</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="w-10 h-10 rounded-full bg-[#FAF5E8] text-[#96743A] flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                          <Upload className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-black text-[#5C3F13]">اضغط لرفع صورة الـ VIP من الجهاز</span>
                        <span className="text-[10px] text-[#8C6B38]">يدعم PNG مفرغة، GIF متحركة، SVG و WEBP</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Grid Inputs */}
                <div className="grid grid-cols-2 gap-2.5">
                  {/* Name */}
                  <div>
                    <label className="block text-[11px] font-black text-[#5C3F13] mb-1">اسم العنصر</label>
                    <input
                      type="text"
                      placeholder="مثال: إطار التاج الذهبي الملكي"
                      value={newVipTitle}
                      onChange={(e) => setNewVipTitle(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white border border-[#D6C5A2] text-xs text-[#5C3F13] font-bold focus:outline-none focus:border-[#B38022]"
                    />
                  </div>

                  {/* VIP Level */}
                  <div>
                    <label className="block text-[11px] font-black text-[#5C3F13] mb-1">مستوى الـ VIP المطلوب</label>
                    <select
                      value={newVipLevel}
                      onChange={(e) => setNewVipLevel(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white border border-[#D6C5A2] text-xs text-[#5C3F13] font-bold focus:outline-none focus:border-[#B38022]"
                    >
                      <option value="VIP 1">VIP 1 (برونزي)</option>
                      <option value="VIP 2">VIP 2 (فضي)</option>
                      <option value="VIP 3">VIP 3 (ذهبي)</option>
                      <option value="VIP 5">VIP 5 (بلاتيني)</option>
                      <option value="VIP 7">VIP 7 (ألماسي)</option>
                      <option value="VIP 10">VIP 10 (أسطوري)</option>
                    </select>
                  </div>

                  {/* Type */}
                  <div>
                    <label className="block text-[11px] font-black text-[#5C3F13] mb-1">نوع عنصر الـ VIP</label>
                    <select
                      value={newVipType}
                      onChange={(e) => setNewVipType(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl bg-white border border-[#D6C5A2] text-xs text-[#5C3F13] font-bold focus:outline-none focus:border-[#B38022]"
                    >
                      <option value="frame">إطار ملف شخصي وشات 🖼️</option>
                      <option value="entry">دخولية روم متحركة 🚗</option>
                      <option value="badge">شارة VIP حصرية 🎖️</option>
                      <option value="mic_effect">تأثير مقعد المايك ✨</option>
                    </select>
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-[11px] font-black text-[#5C3F13] mb-1">السعر بالماس 💎</label>
                    <input
                      type="text"
                      placeholder="مثال: 50,000"
                      value={newVipPrice}
                      onChange={(e) => setNewVipPrice(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white border border-[#D6C5A2] text-xs text-[#5C3F13] font-mono font-bold focus:outline-none focus:border-[#B38022]"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#B38022] via-[#C99836] to-[#7A5210] text-white font-black text-xs shadow-md hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>رفع وتأكيد النشر إلى متجر التطبيق 🚀</span>
                </button>
              </form>
            </div>

            {/* Current VIP Items List */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-black text-[#5C3F13]">عناصر الـ VIP المعروضة بالمتجر ({vipItems.length})</span>
                <span className="text-[10px] text-[#8C6B38] font-bold">تحديث لحظي للمستخدمين</span>
              </div>

              {vipItems.map((item) => (
                <div 
                  key={item.id}
                  className="p-3.5 bg-white/90 backdrop-blur-md rounded-2xl border border-[#EAE0CD] flex items-center justify-between shadow-2xs hover:border-[#D6C5A2] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-12 h-12 rounded-xl object-cover border border-[#E2B755]/50 shadow-sm"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-black text-[#5C3F13]">{item.name}</h4>
                        <span className="text-[9px] bg-[#FAF5E8] border border-[#E2B755] text-[#7A5210] px-1.5 py-0.2 rounded font-black">
                          {item.level}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] text-[#8C6B38]">
                        <span>{item.type}</span>
                        <span>•</span>
                        <span className="font-mono font-bold text-[#B38022]">{item.price}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Toggle publish button */}
                    <button
                      onClick={() => toggleVipStatus(item.id)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-black cursor-pointer transition-all ${
                        item.active 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-300' 
                          : 'bg-slate-100 text-slate-500 border border-slate-300'
                      }`}
                    >
                      {item.active ? 'معروض ✓' : 'مخفي'}
                    </button>

                    {/* Delete button */}
                    <button
                      onClick={() => deleteVipItem(item.id)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="حذف من المتجر"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: عناصر المتجر العام */}
        {/* ========================================================= */}
        {activeTab === 'store_items' && (
          <div className="space-y-3">
            <div className="p-4 bg-white/90 rounded-2xl border border-[#EAE0CD] space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-[#5C3F13]">إدارة هدايا وشارات المتجر</h4>
                <button
                  onClick={() => showToast('اختر ملف الهدية أو الشارة الجديدة 🎁')}
                  className="px-3 py-1.5 rounded-xl bg-[#FAF5E8] border border-[#E2B755] text-[#7A5210] font-black text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إضافة عنصر</span>
                </button>
              </div>

              <div className="space-y-2">
                {storeItems.map((st) => (
                  <div key={st.id} className="p-3 bg-[#FAF8F3] rounded-xl border border-[#EAE0CD] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{st.icon}</span>
                      <div>
                        <h5 className="text-xs font-black text-[#5C3F13]">{st.name}</h5>
                        <span className="text-[10px] text-[#8C6B38]">{st.category} • {st.price}</span>
                      </div>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                      منشور بالمتجر
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: ثيمات الرومات */}
        {/* ========================================================= */}
        {activeTab === 'room_themes' && (
          <div className="space-y-3">
            <div className="p-4 bg-white/90 rounded-2xl border border-[#EAE0CD] space-y-3">
              <h4 className="text-xs font-black text-[#5C3F13]">ثيمات وتصاميم الغرف الصوتية</h4>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { name: 'الثيم الملكي الذهبي 👑', color: 'from-[#B38022] to-[#7A5210]' },
                  { name: 'النيون السيبراني ⚡', color: 'from-cyan-600 to-purple-600' },
                  { name: 'شفق الغروب 🌅', color: 'from-rose-600 to-orange-500' },
                  { name: 'القصر الزمردي 💎', color: 'from-emerald-600 to-teal-500' },
                ].map((th, idx) => (
                  <div key={idx} className="p-3 bg-[#FAF8F3] rounded-xl border border-[#EAE0CD] text-center space-y-2">
                    <div className={`h-12 rounded-lg bg-gradient-to-r ${th.color} shadow-sm`} />
                    <span className="text-xs font-bold text-[#5C3F13] block">{th.name}</span>
                    <button 
                      onClick={() => showToast(`تم تعيين وتحديث ${th.name}`)}
                      className="w-full py-1 bg-white border border-[#D6C5A2] text-[#7A5210] font-bold text-[10px] rounded-lg hover:bg-[#FAF5E8] cursor-pointer"
                    >
                      تطبيق للغرف
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: لوحة الشرف */}
        {/* ========================================================= */}
        {activeTab === 'leaderboard' && (
          <div className="p-4 bg-white/90 rounded-2xl border border-[#EAE0CD] space-y-3">
            <div className="flex items-center gap-2 text-[#7A5210] font-black text-xs">
              <Award className="w-4 h-4 text-[#B38022]" />
              <span>تخصيص لوحة الشرف وأطر المتصدرين</span>
            </div>
            <p className="text-xs text-[#8C6B38] leading-relaxed">
              يمكنك تخصيص إطارات المراكز الثلاثة الأولى (Top 1, 2, 3)، وتحديد ألوان وتدرجات بطاقات الداعمين الكبار في شاشات الروم.
            </p>
            <button
              onClick={() => showToast('تم تطبيق القالب الذهبي للائحة الشرف 🏆')}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#B38022] to-[#7A5210] text-white font-black text-xs shadow-sm cursor-pointer"
            >
              حفظ القالب الملكي الفاخر
            </button>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: الخلفيات الرسمية */}
        {/* ========================================================= */}
        {activeTab === 'wallpapers' && (
          <div className="p-4 bg-white/90 rounded-2xl border border-[#EAE0CD] space-y-3">
            <h4 className="text-xs font-black text-[#5C3F13]">خلفيات الرومات الرسمية المعتمدة</h4>
            <div className="grid grid-cols-2 gap-2">
              <div 
                className="h-24 rounded-xl overflow-hidden bg-cover bg-center border border-[#D6C5A2] relative flex items-end p-2 cursor-pointer"
                style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=300)' }}
                onClick={() => showToast('خلفية القاعة الملكية مفعلة')}
              >
                <div className="absolute inset-0 bg-black/30" />
                <span className="relative z-10 text-[10px] font-black text-white">قاعة الأساطير الذهبية</span>
              </div>
              <div 
                className="h-24 rounded-xl overflow-hidden bg-cover bg-center border border-[#D6C5A2] relative flex items-end p-2 cursor-pointer"
                style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=300)' }}
                onClick={() => showToast('خلفية النجوم الساحرة مفعلة')}
              >
                <div className="absolute inset-0 bg-black/30" />
                <span className="relative z-10 text-[10px] font-black text-white">فضاء النجوم المتلألئة</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
