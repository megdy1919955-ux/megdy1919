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
  Award
} from 'lucide-react';

interface ThemeAdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
}

export const ThemeAdminDashboardModal: React.FC<ThemeAdminDashboardModalProps> = ({
  isOpen,
  onClose,
  userId = 'TH7700'
}) => {
  const [activeTab, setActiveTab] = useState<'room_themes' | 'leaderboard' | 'store_items' | 'wallpapers'>('room_themes');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const THEMES_PRESETS = [
    { id: 'royal_gold', name: 'الثيم الملكي الذهبي (Royal Gold)', color: 'from-amber-600 to-yellow-500', active: true, price: 'مجاني' },
    { id: 'cyber_neon', name: 'النيون السيبراني (Cyber Neon)', color: 'from-cyan-600 to-purple-600', active: true, price: '2,500 💎' },
    { id: 'sunset_glow', name: 'شفق الغروب الساحر (Sunset Glow)', color: 'from-rose-600 to-orange-500', active: false, price: '1,800 💎' },
    { id: 'emerald_palace', name: 'القصر الزمردي (Emerald Palace)', color: 'from-emerald-600 to-teal-500', active: true, price: '3,000 💎' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 text-right select-none" dir="rtl">
      <div className="relative w-full max-w-2xl bg-slate-950 border-2 border-pink-500/40 rounded-3xl shadow-[0_0_50px_rgba(236,72,153,0.3)] overflow-hidden text-white animate-in fade-in zoom-in duration-200 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-gradient-to-r from-pink-950 via-slate-900 to-purple-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-pink-600 text-white shadow-[0_0_15px_rgba(236,72,153,0.5)] border border-pink-400/40">
              <Palette className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">لوحة تحكم إداري الثيمات والمتجر</h3>
                <span className="text-[10px] bg-pink-500/20 text-pink-300 font-extrabold px-2.5 py-0.5 rounded-full border border-pink-400/40">
                  استوديو التصميم 🎨
                </span>
              </div>
              <p className="text-[11px] text-slate-300">إدارة تصاميم الغرف الصوتية، لوحات الشرف، وخلفيات المتجر</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-4 pt-3 border-b border-slate-800/80 bg-slate-900/60 overflow-x-auto no-scrollbar">
          {[
            { id: 'room_themes', title: 'ثيمات الغرف الصوتية', icon: Palette },
            { id: 'leaderboard', title: 'تصاميم لوحة الشرف', icon: Crown },
            { id: 'store_items', title: 'عناصر المتجر والمظهر', icon: ShoppingBag },
            { id: 'wallpapers', title: 'خلفيات الغرف الرسمية', icon: ImageIcon },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-t-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-pink-600/30 text-pink-300 border-b-2 border-pink-400'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.title}</span>
              </button>
            );
          })}
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 custom-scrollbar">
          
          {/* Tab 1: Room Themes */}
          {activeTab === 'room_themes' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-white">قائمة الثيمات المعتمدة للغرف</h4>
                <button
                  onClick={() => showToast('تم فتح محرر إنشاء ثيم روم جديد ✨')}
                  className="py-1.5 px-3 bg-pink-600 hover:bg-pink-500 text-white text-xs font-black rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إضافة ثيم جديد</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {THEMES_PRESETS.map((th) => (
                  <div key={th.id} className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${th.color} border border-white/20 shadow-md`} />
                      <div>
                        <h5 className="text-xs font-bold text-white">{th.name}</h5>
                        <span className="text-[10px] text-slate-400">السعر في المتجر: {th.price}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        th.active ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {th.active ? 'مفعل بالمتجر ✓' : 'معطل مؤقتاً'}
                      </span>
                      <button
                        onClick={() => showToast(`تم تعديل إعدادات الثيم: ${th.name}`)}
                        className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
                        title="تعديل الثيم"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: Leaderboard */}
          {activeTab === 'leaderboard' && (
            <div className="space-y-3">
              <div className="p-4 bg-gradient-to-r from-amber-950/40 via-slate-900 to-purple-950/40 border border-amber-500/30 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-amber-300 font-black text-xs">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <span>تخصيص لوحة الشرف (Leaderboard Customizer)</span>
                </div>
                <p className="text-xs text-slate-300">
                  يمكنك ضبط إطارات المراكز الثلاثة الأولى (Top 1, 2, 3)، ألوان التدرج اللوني لكروت الدعم، وخلفية بطاقات المشاهير.
                </p>
                <button
                  onClick={() => showToast('تم تحديث إطارات المراكز الأولى بنجاح 👑')}
                  className="mt-2 py-2 px-4 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-slate-950 font-black text-xs rounded-xl shadow-md cursor-pointer transition-all"
                >
                  حفظ وتطبيق القالب الذهبي الفاخر
                </button>
              </div>
            </div>
          )}

          {/* Tab 3: Store Items */}
          {activeTab === 'store_items' && (
            <div className="space-y-3">
              <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-3">
                <h4 className="text-xs font-black text-white">إطارات الملفات الشخصية والدخوليات</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center space-y-1.5">
                    <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-xl shadow-md">
                      👑
                    </div>
                    <span className="text-[11px] font-bold text-white block">تاج الأسطورة الملكي</span>
                    <span className="text-[10px] text-amber-400 font-mono">15,000 💎</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center space-y-1.5">
                    <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-xl shadow-md">
                      🏎️
                    </div>
                    <span className="text-[11px] font-bold text-white block">سيارة الفيراري النيون</span>
                    <span className="text-[10px] text-amber-400 font-mono">50,000 💎</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-dashed border-slate-700 hover:border-pink-500 transition-colors flex flex-col items-center justify-center cursor-pointer min-h-[90px]"
                    onClick={() => showToast('اختر ملف العنصر الجديد لرفعه للمتجر 📦')}
                  >
                    <Plus className="w-5 h-5 text-slate-400 mb-1" />
                    <span className="text-[10px] text-slate-400 font-bold">إضافة عنصر للمتجر</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Wallpapers */}
          {activeTab === 'wallpapers' && (
            <div className="space-y-3">
              <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-3">
                <h4 className="text-xs font-black text-white">خلفيات الغرف الرسمية المتاحة لجميع الغرف</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative rounded-xl overflow-hidden border border-slate-700 h-24 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=600)' }}>
                    <div className="absolute inset-0 bg-black/40 flex items-end p-2">
                      <span className="text-[10px] font-black text-white">خلفية النيون الساحر</span>
                    </div>
                  </div>
                  <div className="relative rounded-xl overflow-hidden border border-slate-700 h-24 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=600)' }}>
                    <div className="absolute inset-0 bg-black/40 flex items-end p-2">
                      <span className="text-[10px] font-black text-white">قاعة الأساطير الذهبية</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Toast Notification */}
        <AnimatePresence>
          {toastMsg && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-pink-600 text-white font-bold text-xs px-4 py-2 rounded-full shadow-lg border border-white/20 z-50 flex items-center gap-1.5"
            >
              <span>{toastMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
