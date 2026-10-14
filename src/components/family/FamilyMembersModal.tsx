import React, { useState, useEffect } from 'react';
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
  MessageCircle,
  Plus,
  Trash2,
  UserPlus,
  ArrowUpCircle,
  MoreVertical,
  Check,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { db, auth } from '../../lib/firebase';
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  serverTimestamp
} from 'firebase/firestore';

export interface FamilyMember {
  id: string | number;
  userId?: string;
  name: string;
  role: string;
  roleType: 'leader' | 'co_leader' | 'supervisor' | 'gold' | 'elite' | 'member';
  level: string;
  avatar: string;
  status: 'online' | 'offline' | 'in_room';
  currentRoom?: string;
  points: string | number;
  contributions: number;
  joinedDate: string;
}

interface FamilyMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMember?: (member: FamilyMember) => void;
  onSelectRoom?: (roomId: string) => void;
  familyId?: string;
  familyName?: string;
}

// Initial seed members to populate Firestore on first setup
const INITIAL_SEED_MEMBERS: FamilyMember[] = [
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

export const FamilyMembersModal: React.FC<FamilyMembersModalProps> = ({
  isOpen,
  onClose,
  onSelectMember,
  onSelectRoom,
  familyId = 'fam-star-1',
  familyName = 'قلعة فرسان النجم'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'online' | 'admins' | 'vip'>('all');

  // Firestore live members state
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // Manage member modal state
  const [selectedMemberForAction, setSelectedMemberForAction] = useState<FamilyMember | null>(null);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New member form state
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRoleType, setNewMemberRoleType] = useState<FamilyMember['roleType']>('member');
  const [newMemberLevel, setNewMemberLevel] = useState('VIP2');
  const [newMemberPoints, setNewMemberPoints] = useState('15,000');

  // Auto clear notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Firestore Realtime Subscription & Auto-seeding
  useEffect(() => {
    if (!isOpen) return;

    setIsLoading(true);
    const membersCollectionRef = collection(db, 'families', familyId, 'members');

    const unsubscribe = onSnapshot(
      membersCollectionRef,
      async (snapshot) => {
        if (snapshot.empty) {
          // Seed the initial members to Firestore if collection is empty
          try {
            for (const seed of INITIAL_SEED_MEMBERS) {
              await setDoc(doc(db, 'families', familyId, 'members', String(seed.id)), {
                ...seed,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
              });
            }
          } catch (seedErr) {
            console.error('Error seeding initial family members to Firestore:', seedErr);
            // Fallback to local list in case of network or permissions error
            setMembers(INITIAL_SEED_MEMBERS);
            setIsLoading(false);
          }
          return;
        }

        const loadedMembers: FamilyMember[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          loadedMembers.push({
            id: docSnap.id,
            userId: data.userId || docSnap.id,
            name: data.name || 'فارس مجهول',
            role: data.role || 'عضو',
            roleType: data.roleType || 'member',
            level: data.level || 'VIP1',
            avatar: data.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
            status: data.status || 'offline',
            currentRoom: data.currentRoom,
            points: data.points ?? '10,000',
            contributions: data.contributions || 1000000,
            joinedDate: data.joinedDate || '2024/01/01'
          });
        });

        // Sort by role precedence and points
        const roleOrder: Record<string, number> = {
          leader: 1,
          co_leader: 2,
          supervisor: 3,
          gold: 4,
          elite: 5,
          member: 6
        };

        loadedMembers.sort((a, b) => {
          const orderA = roleOrder[a.roleType] || 99;
          const orderB = roleOrder[b.roleType] || 99;
          if (orderA !== orderB) return orderA - orderB;
          const numA = typeof a.points === 'number' ? a.points : parseInt(String(a.points).replace(/,/g, ''), 10) || 0;
          const numB = typeof b.points === 'number' ? b.points : parseInt(String(b.points).replace(/,/g, ''), 10) || 0;
          return numB - numA;
        });

        setMembers(loadedMembers);
        setIsLoading(false);
      },
      (error) => {
        console.error('Firestore onSnapshot error for family members:', error);
        // Fallback to initial seeds
        setMembers(INITIAL_SEED_MEMBERS);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [isOpen, familyId]);

  if (!isOpen) return null;

  // Filter members dynamically
  const filtered = members.filter((m) => {
    const matchQuery = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       m.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       m.level.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       (m.userId && m.userId.includes(searchQuery));
    
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

  const onlineCount = members.filter(m => m.status === 'online' || m.status === 'in_room').length;
  const adminsCount = members.filter(m => m.roleType === 'leader' || m.roleType === 'co_leader' || m.roleType === 'supervisor').length;
  const vipCount = members.filter(m => m.roleType === 'gold' || m.roleType === 'elite' || m.level.includes('VIP5') || m.level.includes('VIP6') || m.level.includes('VIP8')).length;

  // Change Role Action
  const handleUpdateRole = async (member: FamilyMember, newRoleType: FamilyMember['roleType']) => {
    try {
      setIsSubmitting(true);
      const roleTitles: Record<FamilyMember['roleType'], string> = {
        leader: 'قائد العائلة وحامي القلعة',
        co_leader: 'نائب القائد وإدارة الفرسان',
        supervisor: 'مشرف قلعة الفرسان',
        gold: 'عضو ذهبي أسطوري',
        elite: 'عضو نخبة الفرسان',
        member: 'عضو فعال في العائلة'
      };

      await updateDoc(doc(db, 'families', familyId, 'members', String(member.id)), {
        roleType: newRoleType,
        role: roleTitles[newRoleType],
        updatedAt: serverTimestamp()
      });

      setNotification({
        type: 'success',
        message: `تم تحديث رتبة (${member.name}) إلى "${roleTitles[newRoleType]}" بنجاح في Firestore!`
      });
      setSelectedMemberForAction(null);
    } catch (err: any) {
      console.error('Error updating member role:', err);
      setNotification({
        type: 'error',
        message: `تعذر تحديث الرتبة: ${err.message || 'خطأ غير متوقع'}`
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add Points Action
  const handleAddPoints = async (member: FamilyMember, addedPoints: number) => {
    try {
      setIsSubmitting(true);
      const currentPts = typeof member.points === 'number' 
        ? member.points 
        : parseInt(String(member.points).replace(/,/g, ''), 10) || 0;
      
      const updatedTotal = currentPts + addedPoints;
      const formattedPoints = updatedTotal.toLocaleString('en-US');

      await updateDoc(doc(db, 'families', familyId, 'members', String(member.id)), {
        points: formattedPoints,
        contributions: (member.contributions || 0) + (addedPoints * 100),
        updatedAt: serverTimestamp()
      });

      setNotification({
        type: 'success',
        message: `تمت إضافة +${addedPoints.toLocaleString('en-US')} نقطة للعضو (${member.name}) بنجاح!`
      });
      setSelectedMemberForAction(null);
    } catch (err: any) {
      console.error('Error updating points:', err);
      setNotification({
        type: 'error',
        message: `فشل تحديث النقاط: ${err.message || 'خطأ'}`
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Kick Member Action
  const handleKickMember = async (member: FamilyMember) => {
    if (!window.confirm(`هل أنت متأكد من استبعاد العضو (${member.name}) من العائلة نهائياً؟`)) {
      return;
    }

    try {
      setIsSubmitting(true);
      await deleteDoc(doc(db, 'families', familyId, 'members', String(member.id)));
      setNotification({
        type: 'success',
        message: `تم استبعاد العضو (${member.name}) من العائلة وحذفه من قاعدة البيانات.`
      });
      setSelectedMemberForAction(null);
    } catch (err: any) {
      console.error('Error kicking member:', err);
      setNotification({
        type: 'error',
        message: `فشل استبعاد العضو: ${err.message || 'خطأ'}`
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle Member Status (Online / In Room / Offline)
  const handleToggleStatus = async (member: FamilyMember) => {
    try {
      const nextStatus: Record<string, FamilyMember['status']> = {
        online: 'in_room',
        in_room: 'offline',
        offline: 'online'
      };
      const newStatus = nextStatus[member.status] || 'online';

      await updateDoc(doc(db, 'families', familyId, 'members', String(member.id)), {
        status: newStatus,
        currentRoom: newStatus === 'in_room' ? (member.currentRoom || 'غرفة ديوان الفرسان') : undefined,
        updatedAt: serverTimestamp()
      });

      setNotification({
        type: 'info',
        message: `تم تحديث حالة (${member.name}) إلى: ${newStatus === 'online' ? 'متواجد الآن' : newStatus === 'in_room' ? 'في الروم' : 'غير متصل'}`
      });
    } catch (err: any) {
      console.error('Error toggling status:', err);
    }
  };

  // Add New Member to Family
  const handleCreateNewMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) {
      setNotification({ type: 'error', message: 'يرجى إدخال اسم العضو الجديد' });
      return;
    }

    try {
      setIsSubmitting(true);
      const newId = `m_${Date.now()}`;
      const roleTitles: Record<FamilyMember['roleType'], string> = {
        leader: 'قائد العائلة وحامي القلعة',
        co_leader: 'نائب القائد وإدارة الفرسان',
        supervisor: 'مشرف قلعة الفرسان',
        gold: 'عضو ذهبي أسطوري',
        elite: 'عضو نخبة الفرسان',
        member: 'عضو فعال في العائلة'
      };

      const newMemberDoc: FamilyMember = {
        id: newId,
        userId: String(Math.floor(1001000 + Math.random() * 9000)),
        name: newMemberName.trim(),
        role: roleTitles[newMemberRoleType],
        roleType: newMemberRoleType,
        level: newMemberLevel,
        avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 50000000)}?auto=format&fit=crop&q=80&w=120`,
        status: 'online',
        points: newMemberPoints,
        contributions: parseInt(newMemberPoints.replace(/,/g, ''), 10) * 100 || 1500000,
        joinedDate: new Date().toISOString().split('T')[0].replace(/-/g, '/')
      };

      await setDoc(doc(db, 'families', familyId, 'members', newId), {
        ...newMemberDoc,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      setNotification({
        type: 'success',
        message: `تمت إضافة العضو الجديد (${newMemberDoc.name}) إلى العائلة بنجاح!`
      });

      setNewMemberName('');
      setShowAddMemberModal(false);
    } catch (err: any) {
      console.error('Error adding member:', err);
      setNotification({
        type: 'error',
        message: `فشلت إضافة العضو: ${err.message || 'خطأ'}`
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
                    {members.length} عضو
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    مباشر Firestore
                  </span>
                </h2>
                <p className="text-xs text-amber-200/90 font-medium">
                  {onlineCount} فرسان متواجدين حالياً في القلعة والرومات
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Add Member Button */}
            <button
              onClick={() => setShowAddMemberModal(true)}
              className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black px-3 py-2 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer border border-emerald-400/30"
              title="إضافة عضو جديد للعائلة"
            >
              <UserPlus className="w-4 h-4" />
              <span className="hidden sm:inline">إضافة عضو</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 text-white transition-all cursor-pointer border border-white/20"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </header>

        {/* Live Notification Banner */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`px-4 py-2.5 text-xs sm:text-sm font-bold flex items-center justify-between shadow-md z-10 shrink-0 ${
                notification.type === 'success' 
                  ? 'bg-emerald-600 text-white' 
                  : notification.type === 'error'
                  ? 'bg-rose-600 text-white'
                  : 'bg-amber-600 text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                {notification.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : notification.type === 'error' ? (
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                ) : (
                  <Sparkles className="w-4 h-4 shrink-0" />
                )}
                <span>{notification.message}</span>
              </div>
              <button 
                onClick={() => setNotification(null)}
                className="p-1 hover:bg-white/20 rounded-lg text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Container */}
        <div className="flex-1 flex flex-col max-w-4xl w-full mx-auto overflow-hidden">
          {/* Search Bar & Filter Tabs */}
          <div className="p-3 sm:p-4 bg-[#FAF5E8] border-b border-[#DFC386]/60 space-y-3 shrink-0">
            {/* Search Input */}
            <div className="relative w-full">
              <input
                type="text"
                placeholder="ابحث بالاسم، المعرف، الرتبة أو المستوى..."
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
                الكل ({members.length})
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
                الإدارة ({adminsCount})
              </button>
              <button
                onClick={() => setActiveTab('vip')}
                className={`flex-1 min-w-[80px] py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'vip'
                    ? 'bg-gradient-to-r from-[#755013] to-[#B38022] text-white shadow-sm'
                    : 'text-[#5C3F13] hover:bg-white/60'
                }`}
              >
                النخبة VIP ({vipCount})
              </button>
            </div>
          </div>

          {/* Members List */}
          <div className="flex-1 overflow-y-auto no-scrollbar p-3 sm:p-5 space-y-2.5">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-3">
                <RefreshCw className="w-8 h-8 text-[#A8792A] animate-spin" />
                <p className="text-sm font-bold text-[#755013]">جارٍ تحميل فرسان القلعة من Firestore...</p>
              </div>
            ) : filtered.length === 0 ? (
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
                    whileHover={{ scale: 1.006 }}
                    onClick={() => onSelectMember && onSelectMember(member)}
                    className="bg-white border-2 border-[#DFC386]/70 hover:border-[#B38022] rounded-2xl p-3.5 sm:p-4 shadow-xs hover:shadow-md transition-all flex items-center justify-between gap-3 cursor-pointer relative"
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
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleStatus(member);
                          }}
                          className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white shadow-xs cursor-pointer ${
                            member.status === 'in_room'
                              ? 'bg-purple-500 ring-2 ring-purple-300 animate-pulse'
                              : member.status === 'online'
                              ? 'bg-emerald-500'
                              : 'bg-slate-400'
                          }`}
                          title="اضغط لتبديل حالة التواجد (مباشر)"
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-xs sm:text-sm font-black text-[#5C3F13] truncate max-w-[140px] sm:max-w-[200px]">
                            {member.name}
                          </h4>
                          <span className="bg-[#755013] text-[#FFF9E6] text-[9px] font-black px-2 py-0.5 rounded font-mono shrink-0">
                            {member.level}
                          </span>
                          {member.userId && (
                            <span className="text-[10px] text-amber-800/80 font-mono font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                              ID: {member.userId}
                            </span>
                          )}
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
                              <span>🎙️ {member.currentRoom || 'غرفة العائلة'}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Contributions & Action */}
                    <div className="flex items-center gap-2.5 shrink-0">
                      <div className="text-left">
                        <span className="text-[10px] font-bold text-[#A89478] block">نقاط المساهمة</span>
                        <span className="text-xs sm:text-sm font-black text-[#755013] font-mono flex items-center justify-end gap-1">
                          <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          {typeof member.points === 'number' ? member.points.toLocaleString('en-US') : member.points}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block ${
                          isOnline 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-slate-50 text-slate-500 border border-slate-200'
                        }`}>
                          {member.status === 'in_room' ? 'في الروم' : isOnline ? 'متواجد الآن' : 'غير متصل'}
                        </span>
                      </div>

                      {/* Manage Member Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedMemberForAction(member);
                        }}
                        className="p-2 rounded-xl bg-[#FAF5E8] hover:bg-[#EDE2CE] text-[#755013] border border-[#DFC386] transition-all cursor-pointer active:scale-95"
                        title="إدارة العضو (ترقية / نقاط / طرد)"
                      >
                        <SlidersHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Footer Summary */}
          <div className="p-4 bg-[#FAF5E8] border-t border-[#DFC386]/60 flex items-center justify-between text-xs sm:text-sm text-[#5C3F13] shrink-0">
            <div className="flex items-center gap-3">
              <span className="font-black">إجمالي فرسان {familyName}: {members.length} عضو</span>
              <span className="text-xs text-amber-800 font-bold bg-amber-100/80 px-2.5 py-1 rounded-xl">
                {adminsCount} إداري • {vipCount} نخبة
              </span>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-gradient-to-r from-[#755013] via-[#A8792A] to-[#755013] hover:opacity-95 text-white font-black text-xs sm:text-sm rounded-2xl shadow-md cursor-pointer"
            >
              إغلاق
            </button>
          </div>
        </div>

        {/* Member Action / Management Modal */}
        <AnimatePresence>
          {selectedMemberForAction && (
            <div className="fixed inset-0 z-[95] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#FAF6ED] border-2 border-[#DFC386] rounded-3xl max-w-md w-full p-5 shadow-2xl space-y-4"
                dir="rtl"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#DFC386] pb-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={selectedMemberForAction.avatar} 
                      alt="" 
                      className="w-10 h-10 rounded-full border-2 border-[#B38022] object-cover" 
                    />
                    <div>
                      <h3 className="font-black text-sm text-[#5C3F13]">إدارة العضو: {selectedMemberForAction.name}</h3>
                      <p className="text-[11px] text-[#8C7355] font-semibold">{selectedMemberForAction.role} ({selectedMemberForAction.level})</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedMemberForAction(null)}
                    className="p-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Role Promotion / Demotion */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-[#5C3F13] flex items-center gap-1.5">
                    <Crown className="w-4 h-4 text-amber-600" />
                    <span>تغيير الرتبة الإدارية (Firestore):</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { type: 'leader', label: '👑 قائد' },
                      { type: 'co_leader', label: '🛡️ نائب' },
                      { type: 'supervisor', label: '⚡ مشرف' },
                      { type: 'gold', label: '⭐ ذهبي' },
                      { type: 'elite', label: '💎 نخبة' },
                      { type: 'member', label: '👤 عضو' }
                    ].map((r) => (
                      <button
                        key={r.type}
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => handleUpdateRole(selectedMemberForAction, r.type as FamilyMember['roleType'])}
                        className={`py-2 px-2.5 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                          selectedMemberForAction.roleType === r.type
                            ? 'bg-[#755013] text-white border-[#755013] shadow-xs'
                            : 'bg-white hover:bg-[#EDE2CE] text-[#5C3F13] border-[#DFC386]'
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Add Contribution Points */}
                <div className="space-y-2 pt-2 border-t border-[#DFC386]/60">
                  <label className="text-xs font-black text-[#5C3F13] flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-amber-600" />
                    <span>مكافأة نقاط مساهمة فورية:</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[500, 2000, 10000].map((pts) => (
                      <button
                        key={pts}
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => handleAddPoints(selectedMemberForAction, pts)}
                        className="py-2 bg-gradient-to-r from-amber-500 to-yellow-600 text-white rounded-xl text-xs font-black shadow-xs hover:brightness-105 active:scale-95 cursor-pointer"
                      >
                        +{pts.toLocaleString('en-US')} نقطة
                      </button>
                    ))}
                  </div>
                </div>

                {/* Danger Zone: Kick */}
                <div className="pt-2 border-t border-[#DFC386]/60">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleKickMember(selectedMemberForAction)}
                    className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>استبعاد العضو من العائلة (طرد نهائي)</span>
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Add New Member Modal */}
        <AnimatePresence>
          {showAddMemberModal && (
            <div className="fixed inset-0 z-[95] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#FAF6ED] border-2 border-[#DFC386] rounded-3xl max-w-md w-full p-5 shadow-2xl space-y-4"
                dir="rtl"
              >
                <div className="flex items-center justify-between border-b border-[#DFC386] pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <UserPlus className="w-5 h-5" />
                    </div>
                    <h3 className="font-black text-sm text-[#5C3F13]">إضافة فارس جديد للعائلة</h3>
                  </div>
                  <button
                    onClick={() => setShowAddMemberModal(false)}
                    className="p-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleCreateNewMember} className="space-y-3.5">
                  <div>
                    <label className="text-xs font-bold text-[#5C3F13] block mb-1">اسم الفارس / المذيع:</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: الفارس الأسطوري"
                      value={newMemberName}
                      onChange={(e) => setNewMemberName(e.target.value)}
                      className="w-full bg-white border border-[#DFC386] rounded-xl px-3 py-2 text-xs sm:text-sm text-[#5C3F13] font-bold focus:outline-none focus:border-[#755013]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-[#5C3F13] block mb-1">الرتبة في العائلة:</label>
                      <select
                        value={newMemberRoleType}
                        onChange={(e) => setNewMemberRoleType(e.target.value as FamilyMember['roleType'])}
                        className="w-full bg-white border border-[#DFC386] rounded-xl px-2.5 py-2 text-xs text-[#5C3F13] font-bold focus:outline-none"
                      >
                        <option value="member">عضو عادي</option>
                        <option value="elite">نخبة الفرسان</option>
                        <option value="gold">عضو ذهبي</option>
                        <option value="supervisor">مشرف القلعة</option>
                        <option value="co_leader">نائب القائد</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#5C3F13] block mb-1">مستوى الـ VIP:</label>
                      <select
                        value={newMemberLevel}
                        onChange={(e) => setNewMemberLevel(e.target.value)}
                        className="w-full bg-white border border-[#DFC386] rounded-xl px-2.5 py-2 text-xs text-[#5C3F13] font-bold focus:outline-none"
                      >
                        <option value="VIP1">VIP1</option>
                        <option value="VIP2">VIP2</option>
                        <option value="VIP3">VIP3</option>
                        <option value="VIP4">VIP4</option>
                        <option value="VIP5">VIP5</option>
                        <option value="VIP6">VIP6</option>
                        <option value="VIP8">VIP8</option>
                        <option value="VIP10">VIP10 الأسطوري</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#5C3F13] block mb-1">نقاط المساهمة المبدئية:</label>
                    <input
                      type="text"
                      value={newMemberPoints}
                      onChange={(e) => setNewMemberPoints(e.target.value)}
                      placeholder="15,000"
                      className="w-full bg-white border border-[#DFC386] rounded-xl px-3 py-2 text-xs font-mono font-bold text-[#5C3F13] focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddMemberModal(false)}
                      className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-black"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-105 text-white rounded-xl text-xs font-black shadow-md"
                    >
                      {isSubmitting ? 'جارٍ الحفظ...' : 'حفظ في Firestore'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};
