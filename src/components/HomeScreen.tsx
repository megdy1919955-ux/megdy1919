import React, { useState } from 'react';
import { Flame, Users, Sparkles, Radio, Plus, Search } from 'lucide-react';
import { VoiceRoom, User } from '../types';
import { MOCK_ROOMS } from '../data/mockData';

interface HomeScreenProps {
  currentUser: User;
  onSelectRoom: (room: VoiceRoom) => void;
  onCreateRoom: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  currentUser,
  onSelectRoom,
  onCreateRoom
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['الكل', 'طرب وسوالف', 'موسيقى وغناء', 'شعر وأدب', 'ألعاب وجوائز', 'VIP'];

  const filteredRooms = MOCK_ROOMS.filter((room) => {
    const matchesCategory = selectedCategory === 'الكل' || room.tag === selectedCategory;
    const matchesSearch =
      room.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.host.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-4 pb-20 max-w-7xl mx-auto px-4 pt-3">
      {/* Search & Create Bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ابحث عن غرفة أو أسطورة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl pr-9 pl-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
          />
        </div>
        <button
          onClick={onCreateRoom}
          className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 px-3.5 py-2.5 rounded-2xl font-black text-xs shadow-lg shadow-amber-500/20 hover:scale-105 transition cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>إنشاء روم</span>
        </button>
      </div>

      {/* Hero Banner / Super Legend Championship */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-900/60 via-purple-950/80 to-slate-900 border border-amber-500/30 p-5 shadow-2xl">
        <div className="relative z-10 max-w-md">
          <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-xs font-black mb-2 border border-amber-500/40">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            بطولة سوبر ليجند الأسبوعية 🏆
          </div>
          <h2 className="text-xl font-black text-white leading-snug">
            تحدي المجد الأسطوري: جوائز كبرى بقيمة <span className="text-amber-400">1,000,000</span> كوينز!
          </h2>
          <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
            انضم الآن إلى أكثر الغرف الصوتية تفاعلاً وتنافس مع كبار الأساطير على قمة الترتيب.
          </p>
        </div>
        <div className="absolute left-3 -bottom-2 text-7xl opacity-20 select-none">
          👑
        </div>
      </div>

      {/* Categories Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              selectedCategory === cat
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Live Voice Rooms Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
            <h3 className="font-extrabold text-sm text-white">الغرف الصوتية الحية</h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">{filteredRooms.length} غرفة نشطة</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredRooms.map((room) => (
            <div
              key={room.id}
              onClick={() => onSelectRoom(room)}
              className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 rounded-3xl p-4 cursor-pointer transition transform hover:-translate-y-1 shadow-lg group relative overflow-hidden"
            >
              {/* Top Tag & Country */}
              <div className="flex items-center justify-between mb-3">
                <span className="bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                  {room.tag}
                </span>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <span>{room.country}</span>
                  <span>{room.countryFlag}</span>
                </div>
              </div>

              {/* Host Avatar & Room Title */}
              <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                  <img
                    src={room.host.avatar}
                    alt={room.host.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-amber-400 group-hover:scale-105 transition"
                  />
                  <span className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 font-mono text-[9px] font-black px-1 rounded-full">
                    VIP{room.host.vipLevel}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-white truncate group-hover:text-amber-400 transition">
                    {room.title}
                  </h4>
                  <p className="text-xs text-slate-400 truncate mt-0.5">{room.host.name}</p>
                </div>
              </div>

              {/* Stats Footer */}
              <div className="flex items-center justify-between pt-2.5 border-t border-slate-800/80 text-xs">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <Flame className="w-3.5 h-3.5" />
                    {room.hotScore.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <Users className="w-3.5 h-3.5" />
                    {room.listenersCount}
                  </span>
                </div>

                {room.luckyChest.active && (
                  <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                    🎁 كنز نشط
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
