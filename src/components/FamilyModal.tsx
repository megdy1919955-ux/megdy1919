import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, Users, Crown, Trophy, Swords, Sparkles, ChevronLeft } from 'lucide-react';

interface FamilyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FamilyModal: React.FC<FamilyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const familyMembers = [
    { rank: 1, name: 'الأمير أسامة (الرئيس)', role: 'قائد العائلة', level: 'VIP8', avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=150', exp: '124.5K' },
    { rank: 2, name: 'سارة الكابيتانو', role: 'نائب القائد', level: 'VIP6', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150', exp: '98.2K' },
    { rank: 3, name: 'فارس الليل', role: 'عضو أسطوري', level: 'VIP5', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150', exp: '76.1K' },
    { rank: 4, name: 'نور الهدى', role: 'عضو نشط', level: 'VIP4', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150', exp: '54.0K' },
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
          {/* Header Banner */}
          <div className="relative bg-gradient-to-r from-purple-800 via-indigo-700 to-slate-900 p-6 text-white text-center overflow-hidden shrink-0">
            <button
              onClick={onClose}
              className="absolute top-4 left-4 p-2 rounded-full bg-black/20 hover:bg-black/30 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Shield Crest */}
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-tr from-amber-400 via-purple-500 to-indigo-600 p-1 shadow-lg mb-3 relative flex items-center justify-center">
              <div className="w-full h-full bg-purple-950 rounded-xl flex items-center justify-center border border-amber-300/40">
                <Shield className="w-10 h-10 text-amber-300 fill-amber-300/30" />
              </div>
              <span className="absolute -bottom-2 bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 font-black text-xs px-3 py-0.5 rounded-full border border-white shadow-md">
                Lv.12
              </span>
            </div>

            <h2 className="text-2xl font-black tracking-tight">عائلة الفرسان</h2>
            <div className="flex items-center justify-center gap-3 text-xs text-purple-200 mt-2 font-semibold">
              <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-full border border-white/10">
                <Trophy className="w-3.5 h-3.5 text-amber-300" />
                <span>الترتيب اليومي: #3</span>
              </span>
              <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-full border border-white/10">
                <Users className="w-3.5 h-3.5 text-purple-300" />
                <span>48 / 50 عضو</span>
              </span>
            </div>
          </div>

          {/* Family Stats & Members */}
          <div className="p-5 space-y-4 overflow-y-auto flex-1 no-scrollbar">
            {/* Battle Points & Level Progress */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-purple-50 border border-purple-100 p-3.5 rounded-2xl text-center">
                <div className="text-xs text-purple-600 font-bold flex items-center justify-center gap-1">
                  <Swords className="w-3.5 h-3.5" />
                  <span>نقاط معارك العائلة</span>
                </div>
                <div className="text-lg font-black text-purple-950 mt-1">482,900</div>
              </div>
              <div className="bg-indigo-50 border border-indigo-100 p-3.5 rounded-2xl text-center">
                <div className="text-xs text-indigo-600 font-bold flex items-center justify-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>مستوى التفاعل</span>
                </div>
                <div className="text-lg font-black text-indigo-950 mt-1">ممتاز (Top 1%)</div>
              </div>
            </div>

            {/* Top Family Members Header */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                  <Crown className="w-4 h-4 text-amber-500 fill-amber-400" />
                  <span>أعضاء العائلة البارزون</span>
                </h3>
                <span className="text-xs text-purple-600 font-bold cursor-pointer hover:underline">عرض الكل</span>
              </div>

              <div className="space-y-2">
                {familyMembers.map((member) => (
                  <div
                    key={member.rank}
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-5 text-center font-black text-xs ${
                        member.rank === 1 ? 'text-amber-500' : member.rank === 2 ? 'text-slate-400' : 'text-amber-700'
                      }`}>
                        #{member.rank}
                      </span>
                      <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-xs" />
                      <div>
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{member.name}</span>
                          <span className="bg-amber-100 text-amber-800 text-[9px] font-black px-1.5 py-0.2 rounded">
                            {member.level}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{member.role}</div>
                      </div>
                    </div>
                    <div className="text-left font-mono font-bold text-xs text-purple-700 bg-purple-50 px-2 py-1 rounded-lg">
                      {member.exp}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex gap-2">
              <button className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-xs shadow-md hover:opacity-95 transition-all cursor-pointer">
                دعوة صديق للعائلة
              </button>
              <button className="py-3 px-4 rounded-2xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-colors cursor-pointer">
                غرفة العائلة
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
