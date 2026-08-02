import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Award, Shield, Crown, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import { BadgeInfo } from '../types';

interface BadgeDetailModalProps {
  badge: BadgeInfo | null;
  onClose: () => void;
}

export const BadgeDetailModal: React.FC<BadgeDetailModalProps> = ({ badge, onClose }) => {
  if (!badge) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 dir-rtl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-sm bg-[#1E1E2D] rounded-[28px] p-6 shadow-2xl border border-white/10 text-white relative overflow-hidden"
        >
          {/* Background Glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/0 rounded-full blur-2xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badge Display Big Header */}
          <div className="flex flex-col items-center text-center mt-2">
            <div className={`p-4 rounded-2xl bg-gradient-to-r ${badge.bgColor} shadow-lg ring-4 ring-white/10 mb-4 transform hover:scale-105 transition-transform`}>
              <span className="text-3xl font-black tracking-wider drop-shadow-md px-2">
                {badge.code}
              </span>
            </div>

            <h3 className="font-extrabold text-xl text-white mb-1 flex items-center gap-1.5">
              <span>{badge.title}</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed max-w-xs mt-2 px-2 bg-white/5 py-3 rounded-2xl border border-white/5">
              {badge.description}
            </p>
          </div>

          {/* Progress Bar */}
          {badge.levelProgress !== undefined && (
            <div className="mt-5 bg-black/30 p-3.5 rounded-2xl border border-white/5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-1.5">
                <span>تقدم المستويات</span>
                <span className="text-amber-400">{badge.levelProgress}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-white/5">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-500"
                  style={{ width: `${badge.levelProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Perks List */}
          <div className="mt-4 space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">مميزات الشارة:</h4>
            <div className="flex items-center gap-2 text-xs text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>إظهار شارة مميزة بجانب الاسم في جميع المحادثات</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>أولوية الدخول وتجربة بصرية فريدة للغرف</span>
            </div>
          </div>

          {/* Action button */}
          <button
            onClick={onClose}
            className="w-full mt-6 py-3 rounded-2xl font-bold text-sm bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 transition-all shadow-lg shadow-amber-500/20 active:scale-95"
          >
            حسناً، فهمت
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
