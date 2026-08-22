import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Award, Crown, Check, Sparkles, Shield, Star, Lock } from 'lucide-react';
import { BadgeInfo } from '../types';

interface BadgesCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  badges: BadgeInfo[];
  onSelectBadge: (badge: BadgeInfo) => void;
}

export const BadgesCenterModal: React.FC<BadgesCenterModalProps> = ({ isOpen, onClose, badges, onSelectBadge }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'vip' | 'achievement'>('all');

  if (!isOpen) return null;

  const allBadges: BadgeInfo[] = [
    ...badges,
    {
      id: 'top_supporter',
      code: 'TOP1',
      title: 'كبير الداعمين',
      category: 'wealth',
      bgColor: 'from-amber-500 to-yellow-300',
      textColor: 'text-slate-950',
      borderColor: 'border-yellow-200',
      description: 'وسام أفضل داعم شهري في الغرف المباشرة',
      levelProgress: 100
    },
    {
      id: 'star_broadcaster',
      code: 'STAR',
      title: 'نجم البث المباشر',
      category: 'charm',
      bgColor: 'from-pink-500 to-rose-400',
      textColor: 'text-white',
      borderColor: 'border-pink-200',
      description: 'وسام التميز وصنّاع المحتوى الأكثر تفاعلاً',
      levelProgress: 88
    },
    {
      id: 'veteran_member',
      code: '3Y',
      title: 'عضوية 3 سنوات',
      category: 'level',
      bgColor: 'from-blue-600 to-indigo-600',
      textColor: 'text-white',
      borderColor: 'border-blue-200',
      description: 'شارة الوفاء للمستخدمين الأوفياء للتطبيق',
      levelProgress: 100
    }
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
          <div className="relative bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 p-6 text-slate-950 text-center overflow-hidden shrink-0 shadow-md">
            <button
              onClick={onClose}
              className="absolute top-4 left-4 p-2 rounded-full bg-slate-950/10 hover:bg-slate-950/20 text-slate-950 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-950 text-amber-300 flex items-center justify-center shadow-lg mb-2.5 border-2 border-yellow-200">
              <Award className="w-9 h-9 fill-amber-300 text-amber-300" />
            </div>

            <h2 className="text-2xl font-black tracking-tight">مركز الشارات والأوسمة</h2>
            <p className="text-xs text-slate-900/80 font-bold mt-1">عرض وتخصيص الشارات المرتداة على ملفك الشخصي</p>
          </div>

          {/* Category Selector */}
          <div className="flex border-b border-slate-100 px-4 pt-3 gap-2 bg-slate-50 shrink-0">
            <button
              onClick={() => setActiveCategory('all')}
              className={`pb-2.5 px-3 text-xs font-black border-b-2 transition-all cursor-pointer ${
                activeCategory === 'all'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              كل الشارات
            </button>
            <button
              onClick={() => setActiveCategory('vip')}
              className={`pb-2.5 px-3 text-xs font-black border-b-2 transition-all cursor-pointer ${
                activeCategory === 'vip'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              VIP وسوبر ليجند
            </button>
            <button
              onClick={() => setActiveCategory('achievement')}
              className={`pb-2.5 px-3 text-xs font-black border-b-2 transition-all cursor-pointer ${
                activeCategory === 'achievement'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              الإنجازات والنشاط
            </button>
          </div>

          {/* Badges List */}
          <div className="p-5 space-y-3 overflow-y-auto flex-1 no-scrollbar">
            {allBadges.map((badge) => (
              <motion.div
                key={badge.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  onSelectBadge(badge);
                  onClose();
                }}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-amber-300 transition-all cursor-pointer shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className={`px-3 py-1.5 rounded-xl text-xs font-black shadow-sm flex items-center gap-1 bg-gradient-to-r ${badge.bgColor} ${badge.textColor}`}>
                    {badge.code === 'VIP8' && <Crown className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />}
                    <span>{badge.code}</span>
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-slate-900">{badge.title}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{badge.description}</div>
                  </div>
                </div>
                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200/60 shrink-0">
                  معاينة
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
