import React from 'react';
import { motion } from 'motion/react';
import { Gamepad2, Coins, Gem, Sparkles, Trophy, Flame, Play, Star } from 'lucide-react';

export const GamesScreen: React.FC = () => {
  const games = [
    {
      id: 'cat',
      title: 'القط الجشع (GREEDY CAT)',
      desc: 'اطعم القط وتوقع الجوائز لمضاعفة الألماس x100',
      emoji: '🐱',
      bg: 'from-emerald-500 to-teal-700',
      players: '12.4K يلعبون الآن',
      badge: 'الأكثر شعبية',
    },
    {
      id: 'horse',
      title: 'سباق الخيل (Horse Racing)',
      desc: 'توقع الفائز بالسباق واربح ملايين الكوينز',
      emoji: '🏇',
      bg: 'from-amber-700 to-yellow-900',
      players: '8.1K يلعبون الآن',
      badge: 'مباشر',
    },
    {
      id: 'chicken',
      title: 'تحدي الدجاجة (Chicken Cross)',
      desc: 'اعبر الطريق بحذر للوصول إلى الصندوق الذهبي',
      emoji: '🐔',
      bg: 'from-sky-500 to-blue-700',
      players: '5.2K يلعبون الآن',
      badge: 'جديد',
    },
    {
      id: 'fishing',
      title: 'صيد الأسماك (FISHING)',
      desc: 'اصطد القرش الذهبي للحصول على الجائزة الكبرى',
      emoji: '🦈',
      bg: 'from-blue-600 to-indigo-900',
      players: '15.9K يلعبون الآن',
      badge: 'جائزة كبرى',
    },
    {
      id: 'olympus',
      title: 'أوليمبوس المحظوظ (LUCKY OLYMPUS)',
      desc: 'عجلة الحظ الملكية ومضاعفات البرق x500',
      emoji: '⚡',
      bg: 'from-purple-600 to-pink-800',
      players: '9.8K يلعبون الآن',
      badge: 'x500',
    },
  ];

  return (
    <div className="space-y-4 pb-20 pt-2 px-4">
      {/* Wallet Balance Bar */}
      <div className="p-3.5 bg-slate-900 rounded-2xl text-white flex items-center justify-between border border-slate-800 shadow-md">
        <div className="flex items-center gap-2">
          <Gamepad2 className="w-6 h-6 text-amber-400" />
          <span className="text-xs font-black">صالة الألعاب والتحديات</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-800 px-2.5 py-1 rounded-xl border border-slate-700">
            <Coins className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-xs font-mono font-bold text-amber-300">1,250,000</span>
          </div>
          <div className="flex items-center gap-1 bg-slate-800 px-2.5 py-1 rounded-xl border border-slate-700">
            <Gem className="w-3.5 h-3.5 text-sky-400 fill-sky-400" />
            <span className="text-xs font-mono font-bold text-sky-300">8,450</span>
          </div>
        </div>
      </div>

      {/* Featured Games Grid */}
      <div className="space-y-3">
        {games.map((game) => (
          <motion.div
            key={game.id}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className={`p-4 rounded-3xl bg-gradient-to-r ${game.bg} text-white shadow-md relative overflow-hidden flex items-center justify-between cursor-pointer`}
          >
            <div className="space-y-1.5 max-w-[70%]">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{game.emoji}</span>
                <span className="text-xs font-black bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full text-amber-200 border border-white/20">
                  {game.badge}
                </span>
              </div>
              <h3 className="text-sm font-black">{game.title}</h3>
              <p className="text-[11px] text-white/80 font-medium">{game.desc}</p>
              <div className="text-[10px] text-amber-300 font-bold pt-0.5">{game.players}</div>
            </div>

            <button className="px-4 py-2.5 rounded-2xl bg-white text-slate-950 font-black text-xs shadow-lg flex items-center gap-1.5 hover:bg-amber-300 cursor-pointer shrink-0">
              <Play className="w-4 h-4 fill-slate-950" />
              <span>العب الآن</span>
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
