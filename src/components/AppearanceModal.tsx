import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Sparkles, Check, Crown, Flame, Zap } from 'lucide-react';

interface AppearanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  avatarUrl: string;
}

export const AppearanceModal: React.FC<AppearanceModalProps> = ({ isOpen, onClose, avatarUrl }) => {
  const [activeCategory, setActiveCategory] = useState<'frames' | 'entry' | 'vehicles'>('frames');
  const [equippedFrameId, setEquippedFrameId] = useState<string>('gold_royal');

  if (!isOpen) return null;

  const framesList = [
    { id: 'gold_royal', name: 'الإطار الملكي الذهبي', color: 'from-amber-400 via-yellow-300 to-amber-500', isEquipped: equippedFrameId === 'gold_royal' },
    { id: 'neon_cyber', name: 'إطار السايبر اللامع', color: 'from-cyan-400 via-sky-300 to-blue-600', isEquipped: equippedFrameId === 'neon_cyber' },
    { id: 'ruby_dragon', name: 'إطار التنين القرمزي', color: 'from-rose-500 via-pink-400 to-red-600', isEquipped: equippedFrameId === 'ruby_dragon' },
    { id: 'emerald_wolf', name: 'إطار الذئب الزمردي', color: 'from-emerald-400 via-teal-300 to-green-600', isEquipped: equippedFrameId === 'emerald_wolf' },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/60 backdrop-blur-xs" dir="rtl">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Modal Header */}
          <div className="relative bg-gradient-to-r from-sky-500 via-cyan-400 to-blue-600 p-6 text-white text-center overflow-hidden shrink-0 shadow-md">
            <button
              onClick={onClose}
              className="absolute top-4 left-4 p-2 rounded-full bg-black/20 hover:bg-black/30 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Avatar Preview */}
            <div className="relative w-20 h-20 mx-auto mb-2">
              <div className="w-full h-full rounded-full p-1 bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 shadow-lg animate-pulse">
                <img src={avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'} alt="Preview" className="w-full h-full rounded-full object-cover border-2 border-white" />
              </div>
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-sky-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full border border-white shadow-xs">
                المعاينة
              </span>
            </div>

            <h2 className="text-2xl font-black tracking-tight">تخصيص المظهر والمتجر</h2>
            <p className="text-xs text-sky-100 font-medium mt-1">اختر إطارات الصورة، مؤثرات الدخول، وديكورات الحساب</p>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-slate-100 px-4 pt-3 gap-2 bg-slate-50 shrink-0">
            <button
              onClick={() => setActiveCategory('frames')}
              className={`pb-2.5 px-3 text-xs font-black border-b-2 transition-all cursor-pointer ${
                activeCategory === 'frames'
                  ? 'border-sky-500 text-sky-600'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              إطارات الصورة
            </button>
            <button
              onClick={() => setActiveCategory('entry')}
              className={`pb-2.5 px-3 text-xs font-black border-b-2 transition-all cursor-pointer ${
                activeCategory === 'entry'
                  ? 'border-sky-500 text-sky-600'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              مؤثرات الدخول
            </button>
            <button
              onClick={() => setActiveCategory('vehicles')}
              className={`pb-2.5 px-3 text-xs font-black border-b-2 transition-all cursor-pointer ${
                activeCategory === 'vehicles'
                  ? 'border-sky-500 text-sky-600'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              المركبات الفاخرة
            </button>
          </div>

          {/* List of Appearance Items */}
          <div className="p-5 space-y-3 overflow-y-auto flex-1 no-scrollbar">
            {framesList.map((frame) => (
              <div
                key={frame.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr ${frame.color} flex items-center justify-center shrink-0`}>
                    <img src={avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'} alt="Frame item" className="w-10 h-10 rounded-full object-cover border border-white" />
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-slate-900">{frame.name}</div>
                    <div className="text-[11px] text-emerald-600 font-bold mt-0.5">مفعل بملفك الشخصي</div>
                  </div>
                </div>

                <button
                  onClick={() => setEquippedFrameId(frame.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    frame.isEquipped
                      ? 'bg-emerald-500 text-white shadow-xs'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  {frame.isEquipped ? 'مُرتدى' : 'ارتداء'}
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
