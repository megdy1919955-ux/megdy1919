import React from 'react';
import { motion } from 'motion/react';
import { Globe, Heart, MessageCircle, Share2, Sparkles, TrendingUp, Award, Flame } from 'lucide-react';

export const ExploreScreen: React.FC = () => {
  const posts = [
    {
      id: '1',
      author: 'الأميرة ريم',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      time: 'منذ 15 دقيقة',
      location: 'الرياض، المملكة العربية السعودية 🇸🇦',
      content: 'مساء الورد والياسمين على جميع الأصدقاء في روم الأساطير ✨ يسعد مساكم جميعاً!',
      likes: 342,
      comments: 28,
      tag: '#لحظات_السعودية',
    },
    {
      id: '2',
      author: 'الشيخ خالد',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      time: 'منذ ساعة',
      location: 'دبي، الإمارات العربية المتحدة 🇦🇪',
      content: 'تحدي المعارك اليوم الساعة 9 مساءً. ننتظر حضوركم ودعمكم المستمر للروم الملكية 🏆',
      likes: 810,
      comments: 94,
      tag: '#معارك_دبي',
    },
  ];

  return (
    <div className="space-y-4 pb-20 pt-2 px-4">
      {/* World Explorer Header */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-sky-600 via-indigo-600 to-blue-700 text-white shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
            <Globe className="w-7 h-7 text-sky-200 animate-spin-slow" />
          </div>
          <div>
            <h2 className="text-lg font-black">عالمي (Explore World)</h2>
            <p className="text-xs text-sky-100 font-medium">اكتشف أحدث منشورات ولحظات المستخدمين حول العالم</p>
          </div>
        </div>
      </div>

      {/* Country Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {[
          { name: 'الكل 🌐', active: true },
          { name: 'السعودية 🇸🇦', active: false },
          { name: 'الإمارات 🇦🇪', active: false },
          { name: 'مصر 🇪🇬', active: false },
          { name: 'الكويت 🇰🇼', active: false },
          { name: 'المغرب 🇲🇦', active: false },
        ].map((item, idx) => (
          <button
            key={idx}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
              item.active
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200/60 hover:bg-slate-50'
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>

      {/* Posts Stream */}
      <div className="space-y-3">
        {posts.map((post) => (
          <div key={post.id} className="p-4 bg-white rounded-2xl border border-slate-100 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={post.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'} alt={post.author} className="w-10 h-10 rounded-full object-cover border-2 border-sky-400" />
                <div>
                  <h3 className="text-xs font-black text-slate-900">{post.author}</h3>
                  <div className="text-[10px] text-slate-400 font-medium">{post.location} • {post.time}</div>
                </div>
              </div>
              <span className="text-[10px] font-extrabold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100">
                {post.tag}
              </span>
            </div>

            <p className="text-xs text-slate-700 font-bold leading-relaxed">{post.content}</p>

            <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-slate-500 text-xs font-bold">
              <button className="flex items-center gap-1.5 hover:text-rose-500 cursor-pointer">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                <span>{post.likes}</span>
              </button>
              <button className="flex items-center gap-1.5 hover:text-sky-600 cursor-pointer">
                <MessageCircle className="w-4 h-4 text-slate-400" />
                <span>{post.comments} تعليق</span>
              </button>
              <button className="flex items-center gap-1.5 hover:text-indigo-600 cursor-pointer">
                <Share2 className="w-4 h-4 text-slate-400" />
                <span>مشاركة</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
