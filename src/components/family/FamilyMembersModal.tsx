import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Users, 
  Search, 
  Crown, 
  Shield, 
  Sparkles, 
  CheckCircle2, 
  Circle, 
  Award, 
  Flame, 
  UserCheck, 
  ChevronLeft,
  SlidersHorizontal,
  ExternalLink,
  MessageCircle
} from 'lucide-react';

export interface FamilyMember {
  id: string | number;
  name: string;
  role: string;
  roleType: 'leader' | 'co_leader' | 'supervisor' | 'gold' | 'elite' | 'member';
  level: string;
  avatar: string;
  status: 'online' | 'offline' | 'in_room';
  currentRoom?: string;
  points: string;
  contributions: number;
  joinedDate: string;
}

interface FamilyMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMember?: (member: FamilyMember) => void;
  onSelectRoom?: (roomId: string) => void;
}

export const FamilyMembersModal: React.FC<FamilyMembersModalProps> = ({
  isOpen,
  onClose,
  onSelectMember,
  onSelectRoom
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'online' | 'admins' | 'vip'>('all');

  // Rich list of family members with detailed status
  const allMembers: FamilyMember[] = [
    {
      id: 'm1',
      name: 'الأمير أسامة (الرئيس)',
      role: 'قائد العائلة وحامي القلعة',
      roleType: 'leader',
      level: 'VIP8',
      avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=150',
      status: 'online',
      currentRoom: 'وكالة شحن فرندلى1',
      points: '124,500',
      contributions: 52000000,
      joinedDate: '2024/01/10'
    },
    {
      id: 'm2',
      name: 'سارة الكابيتانو',
      role: 'نائب القائد وإدارة الفرسان',
      roleType: 'co_leader',
      level: 'VIP6',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      status: 'in_room',
      currentRoom: 'وَكّالَةُ آلَطَيّارَ',
      points: '98,200',
      contributions: 38400000,
      joinedDate: '2024/02/01'
    },
    {
      id: 'm3',
      name: 'فارس الليل',
      role: 'كبير المشرفين ومنسق الغرف',
      roleType: 'supervisor',
      level: 'VIP5',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      status: 'online',
      currentRoom: 'شحن وتارجت مصر',
      points: '76,100',
      contributions: 29100000,
      joinedDate: '2024/02/15'
    },
    {
      id: 'm4',
      name: 'نور الهدى',
      role: 'مشرفة الفعاليات والمسابقات',
      roleType: 'supervisor',
      level: 'VIP4',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
      status: 'offline',
      points: '54,000',
      contributions: 19800000,
      joinedDate: '2024/03/05'
    },
    {
      id: 'm5',
      name: 'ماما جنات',
      role: 'عضو ذهبي أسطوري',
      roleType: 'gold',
      level: 'VIP5',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120',
      status: 'online',
      points: '44,200',
      contributions: 16500000,
      joinedDate: '2024/03/12'
    },
    {
      id: 'm6',
      name: 'الربان حازم',
      role: 'عضو نخبة الفرسان',
      roleType: 'elite',
      level: 'VIP3',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=120',
      status: 'online',
      currentRoom: 'طرب اسوانى أصيل',
      points: '29,800',
      contributions: 11200000,
      joinedDate: '2024/03/20'
    },
    {
      id: 'm7',
      name: 'مريم الأسطورة',
      role: 'عضو ذهبي مميز',
      roleType: 'gold',
      level: 'VIP5',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
      status: 'online',
      points: '41,000',
      contributions: 15400000,
      joinedDate: '2024/04/01'
    },
    {
      id: 'm8',
      name: 'الملك طارق',
      role: 'عضو ذهبي نشط',
      roleType: 'gold',
      level: 'VIP4',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=120',
      status: 'online',
      points: '22,000',
      contributions: 8900000,
      joinedDate: '2024/04/10'
    },
    {
      id: 'm9',
      name: 'أحمد كابيتانو',
      role: 'عضو فعال',
      roleType: 'member',
      level: 'VIP2',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120',
      status: 'in_room',
      points: '18,500',
      contributions: 6400000,
      joinedDate: '2024/04/18'
    },
    {
      id: 'm10',
      name: 'زهرة اللوتس',
      role: 'عضو نشط',
      roleType: 'member',
      level: 'VIP3',
      avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=120',
      status: 'online',
      points: '15,300',
      contributions: 5100000,
      joinedDate: '2024/05/02'
    },
    {
      id: 'm11',
      name: 'أميرة الشوق',
      role: 'عضو',
      roleType: 'member',
      level: 'VIP1',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=120',
      status: 'offline',
      points: '12,100',
      contributions: 3200000,
      joinedDate: '2024/05/14'
    },
    {
      id: 'm12',
      name: 'عاشق القلم',
      role: 'عضو',
      roleType: 'member',
      level: 'VIP2',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120',
      status: 'offline',
      points: '9,400',
      contributions: 2400000,
      joinedDate: '2024/05/20'
    }
  ];

  if (!isOpen) return null;

  // Filter members
  const filtered = allMembers.filter((m) => {
    const matchQuery = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       m.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       m.level.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchQuery) return false;

    if (activeTab === 'online') {
      return m.status === 'online' || m.status === 'in_room';
    }
    if (activeTab === 'admins') {
      return m.roleType === 'leader' || m.roleType === 'co_leader' || m.roleType === 'supervisor';
    }
    if (activeTab === 'vip') {
      return m.roleType === 'gold' || m.roleType === 'elite' || m.level.includes('VIP5') || m.level.includes('VIP6') || m.level.includes('VIP8');
    }
    return true;
  });

  const onlineCount = allMembers.filter(m => m.status === 'online' || m.status === 'in_room').length;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, x: '100%' }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="fixed inset-0 z-[85] bg-[#FAF6ED] flex flex-col pointer-events-auto select-none overflow-hidden"
        dir="rtl"
      >
        {/* Fullscreen Header */}
        <header className="bg-gradient-to-r from-[#755013] via-[#A8792A] to-[#755013] px-4 sm:px-6 py-4 flex items-center justify-between text-white shadow-lg shrink-0 border-b border-[#DFC386]">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 text-white transition-all cursor-pointer flex items-center justify-center border border-white/20 shadow-xs"
              title="رجوع"
            >
              <ChevronLeft className="w-6 h-6 rotate-180" />
            </button>
            
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center shadow-xs">
                <Users className="w-5 h-5 text-amber-200" />
              </div>
              <div>
                <h2 className="font-black text-base sm:text-lg text-white flex items-center gap-2">
                  <span>أعضاء وفرسان العائلة</span>
                  <span className="bg-white/20 text-amber-200 text-xs font-black px-2.5 py-0.5 rounded-full font-mono">
                    891 عضو
                  </span>
                </h2>
                <p className="text-xs text-amber-200/90 font-medium">
                  {onlineCount} فرسان متواجدين حالياً في القلعة والرومات
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 text-white transition-all cursor-pointer border border-white/20"
          >
            <X className="w-6 h-6" />
          </button>
        </header>

        {/* Content Container */}
        <div className="flex-1 flex flex-col max-w-4xl w-full mx-auto overflow-hidden">
          {/* Search Bar & Filter Tabs */}
          <div className="p-3 sm:p-4 bg-[#FAF5E8] border-b border-[#DFC386]/60 space-y-3 shrink-0">
            {/* Search Input */}
            <div className="relative w-full">
              <input
                type="text"
                placeholder="ابحث بالاسم، الرتبة أو المستوى..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border-2 border-[#DFC386] rounded-2xl pr-10 pl-4 py-2.5 text-xs sm:text-sm text-[#5C3F13] placeholder-[#A89478] font-bold focus:outline-none focus:border-[#B38022] shadow-xs"
              />
              <Search className="w-5 h-5 text-[#A89478] absolute right-3.5 top-3" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-3.5 top-3 text-[#A89478] hover:text-[#5C3F13] text-xs font-bold"
                >
                  مسح
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 bg-[#EDE2CE] p-1.5 rounded-2xl overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveTab('all')}
                className={`flex-1 min-w-[75px] py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-gradient-to-r from-[#755013] to-[#B38022] text-white shadow-sm'
                    : 'text-[#5C3F13] hover:bg-white/60'
                }`}
              >
                الكل (891)
              </button>
              <button
                onClick={() => setActiveTab('online')}
                className={`flex-1 min-w-[110px] py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'online'
                    ? 'bg-gradient-to-r from-[#755013] to-[#B38022] text-white shadow-sm'
                    : 'text-[#5C3F13] hover:bg-white/60'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>متواجد الآن ({onlineCount})</span>
              </button>
              <button
                onClick={() => setActiveTab('admins')}
                className={`flex-1 min-w-[80px] py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'admins'
                    ? 'bg-gradient-to-r from-[#755013] to-[#B38022] text-white shadow-sm'
                    : 'text-[#5C3F13] hover:bg-white/60'
                }`}
              >
                الإدارة (4)
              </button>
              <button
                onClick={() => setActiveTab('vip')}
                className={`flex-1 min-w-[80px] py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'vip'
                    ? 'bg-gradient-to-r from-[#755013] to-[#B38022] text-white shadow-sm'
                    : 'text-[#5C3F13] hover:bg-white/60'
                }`}
              >
                النخبة VIP
              </button>
            </div>
          </div>

          {/* Members List */}
          <div className="flex-1 overflow-y-auto no-scrollbar p-3 sm:p-5 space-y-2.5">
            {filtered.length === 0 ? (
              <div className="text-center py-16 space-y-2">
                <Users className="w-12 h-12 text-[#C59A4E] mx-auto opacity-50" />
                <p className="text-sm font-bold text-[#8C7355]">لم يتم العثور على أعضاء مطابقين للبحث</p>
              </div>
            ) : (
              filtered.map((member) => {
                const isOnline = member.status === 'online' || member.status === 'in_room';

                return (
                  <motion.div
                    key={member.id}
                    whileHover={{ scale: 1.008 }}
                    onClick={() => onSelectMember && onSelectMember(member)}
                    className="bg-white border-2 border-[#DFC386]/70 hover:border-[#B38022] rounded-2xl p-3.5 sm:p-4 shadow-xs hover:shadow-md transition-all flex items-center justify-between gap-3 cursor-pointer"
                  >
                    {/* Left: Avatar & Names */}
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="relative w-13 h-13 shrink-0">
                        <div className={`w-full h-full rounded-full p-0.5 ${
                          member.roleType === 'leader'
                            ? 'bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-700 shadow-md'
                            : member.roleType === 'co_leader'
                            ? 'bg-gradient-to-tr from-slate-400 via-amber-300 to-slate-600'
                            : 'bg-gradient-to-tr from-[#DFC386] to-[#755013]'
                        }`}>
                          <img 
                            src={member.avatar} 
                            alt={member.name} 
                            className="w-full h-full rounded-full object-cover"
                          />
                        </div>

                        {/* Online / In Room Status Badge */}
                        <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs ${
                          member.status === 'in_room'
                            ? 'bg-purple-500 ring-1 ring-purple-300 animate-pulse'
                            : member.status === 'online'
                            ? 'bg-emerald-500'
                            : 'bg-slate-400'
                        }`} />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-xs sm:text-sm font-black text-[#5C3F13] truncate max-w-[150px] sm:max-w-[220px]">
                            {member.name}
                          </h4>
                          <span className="bg-[#755013] text-[#FFF9E6] text-[9px] font-black px-2 py-0.5 rounded font-mono shrink-0">
                            {member.level}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="text-[11px] text-[#8C7355] font-semibold truncate">
                            {member.role}
                          </span>
                          {member.status === 'in_room' && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onSelectRoom) {
                                  onSelectRoom(member.currentRoom === 'وَكّالَةُ آلَطَيّارَ' ? 'room-2' : 'room-1');
                                  onClose();
                                }
                              }}
                              className="text-[10px] font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 px-2 py-0.5 rounded-full border border-purple-200 truncate max-w-[140px] flex items-center gap-1 transition-all cursor-pointer"
                              title="اضغط للدخول إلى روم العضو مباشرة"
                            >
                              <span>🎙️ {member.currentRoom}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Contributions & Action */}
                    <div className="text-left shrink-0">
                      <span className="text-[10px] font-bold text-[#A89478] block">نقاط المساهمة</span>
                      <span className="text-xs sm:text-sm font-black text-[#755013] font-mono flex items-center justify-end gap-1">
                        <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        {member.points}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block ${
                        isOnline 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-slate-50 text-slate-500 border border-slate-200'
                      }`}>
                        {member.status === 'in_room' ? 'في الروم' : isOnline ? 'متواجد الآن' : 'غير متصل'}
                      </span>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Footer Summary */}
          <div className="p-4 bg-[#FAF5E8] border-t border-[#DFC386]/60 flex items-center justify-between text-xs sm:text-sm text-[#5C3F13] shrink-0">
            <span className="font-black">إجمالي فرسان القلعة: 891 عضو</span>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-gradient-to-r from-[#755013] via-[#A8792A] to-[#755013] hover:opacity-95 text-white font-black text-xs sm:text-sm rounded-2xl shadow-md cursor-pointer"
            >
              إغلاق
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
