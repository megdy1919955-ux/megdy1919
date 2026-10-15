import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Search, 
  Sparkles, 
  Shield, 
  Crown, 
  Users, 
  Flame, 
  Plus, 
  ArrowRight, 
  ChevronLeft, 
  Award, 
  CheckCircle2, 
  Check, 
  Copy, 
  Castle, 
  Swords, 
  Trophy, 
  Send,
  Star
} from 'lucide-react';
import { db, auth } from '../../lib/firebase';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';

export interface FamilyItem {
  id: string;
  name: string;
  leaderName: string;
  level: number;
  exp: number;
  membersCount: number;
  maxMembers: number;
  castleEmblem: string;
  castleTier: 'bronze' | 'silver' | 'gold' | 'diamond' | 'royal';
  description: string;
  isOpenJoin: boolean;
  tag: string;
}

export interface ExploreFamiliesModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
  userName?: string;
  userAvatar?: string;
  onJoinedFamily?: (familyId: string, familyName: string) => void;
}

const DEFAULT_FAMILIES: FamilyItem[] = [
  {
    id: 'fam-star-1',
    name: 'عائلة فرسان المجد',
    leaderName: 'أحمد النجم الملكي 👑',
    level: 12,
    exp: 78500,
    membersCount: 48,
    maxMembers: 50,
    castleEmblem: '🏰',
    castleTier: 'royal',
    description: 'العائلة الملكية الأولى في المنصة. ترفيع مستمر للقلعة، فعاليات صوتية يومية، وجولات دعم حماسية.',
    isOpenJoin: true,
    tag: 'FURS'
  },
  {
    id: 'fam-star-2',
    name: 'عائلة صقور الجزيرة',
    leaderName: 'منصور الصقر 🦅',
    level: 9,
    exp: 45000,
    membersCount: 36,
    maxMembers: 50,
    castleEmblem: '🦅',
    castleTier: 'gold',
    description: 'عائلة تجمع نخبة المتحدثين وصناع المحتوى. احترام، محبة، ومساندة في كافة الرومات.',
    isOpenJoin: true,
    tag: 'SAQR'
  },
  {
    id: 'fam-star-3',
    name: 'عائلة عرش الملوك',
    leaderName: 'الملك سلطان ⚔️',
    level: 15,
    exp: 150000,
    membersCount: 50,
    maxMembers: 50,
    castleEmblem: '👑',
    castleTier: 'diamond',
    description: 'قلعة الأساطير الذهبية. أعلى تصنيف في دوري العائلات الشهري لثلاثة مواسم متتالية.',
    isOpenJoin: false,
    tag: 'KING'
  },
  {
    id: 'fam-star-4',
    name: 'عائلة نخبة النجوم',
    leaderName: 'سارة الأمير ✨',
    level: 7,
    exp: 28000,
    membersCount: 24,
    maxMembers: 50,
    castleEmblem: '⭐',
    castleTier: 'silver',
    description: 'بيئة عائلية دافئة وداعمة للمواهب الجديدة وغناء الطرب والقصائد.',
    isOpenJoin: true,
    tag: 'STAR'
  }
];

const CASTLE_EMBLEMS = [
  { id: 'castle_royal', emoji: '🏰', label: 'قلعة المجد' },
  { id: 'crown_gold', emoji: '👑', label: 'تاج الملوك' },
  { id: 'eagle_glory', emoji: '🦅', label: 'صقر العزة' },
  { id: 'swords_knight', emoji: '⚔️', label: 'سيوف الفرسان' },
  { id: 'lion_brave', emoji: '🦁', label: 'عرين الأسد' },
  { id: 'diamond_star', emoji: '💎', label: 'الماسة النقية' }
];

export const ExploreFamiliesModal: React.FC<ExploreFamiliesModalProps> = ({
  isOpen,
  onClose,
  userId = '1001001',
  userName = 'المستخدم',
  userAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  onJoinedFamily
}) => {
  const [activeTab, setActiveTab] = useState<'explore' | 'create'>('explore');
  const [families, setFamilies] = useState<FamilyItem[]>(DEFAULT_FAMILIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [isJoining, setIsJoining] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Create Family Form State
  const [newFamilyName, setNewFamilyName] = useState('');
  const [newFamilyTag, setNewFamilyTag] = useState('');
  const [newFamilyDesc, setNewFamilyDesc] = useState('');
  const [selectedEmblem, setSelectedEmblem] = useState(CASTLE_EMBLEMS[0].emoji);
  const [isCreating, setIsCreating] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 1. Live Firestore Sync for Families
  useEffect(() => {
    if (!isOpen) return;

    try {
      const familiesCol = collection(db, 'families');
      const unsub = onSnapshot(
        familiesCol,
        (snap) => {
          if (!snap.empty) {
            const loaded = snap.docs.map((dSnap) => {
              const d = dSnap.data();
              return {
                id: dSnap.id,
                name: d.name || d.familyName || 'عائلة النجم',
                leaderName: d.leaderName || d.ownerName || 'قائد العائلة',
                level: Number(d.level || d.familyLevel || 1),
                exp: Number(d.exp || d.familyExp || 0),
                membersCount: Number(d.membersCount || 1),
                maxMembers: Number(d.maxMembers || 50),
                castleEmblem: d.castleEmblem || d.emblem || '🏰',
                castleTier: (d.castleTier as any) || 'gold',
                description: d.description || 'عائلة رسمية متحدة تدعم بعضها في المنصة.',
                isOpenJoin: Boolean(d.isOpenJoin ?? true),
                tag: d.tag || d.familyTag || 'NAJM'
              } as FamilyItem;
            });

            // Merge with defaults
            const map = new Map<string, FamilyItem>();
            DEFAULT_FAMILIES.forEach((f) => map.set(f.id, f));
            loaded.forEach((f) => map.set(f.id, f));
            setFamilies(Array.from(map.values()));
          }
        },
        (err) => {
          console.warn('[ExploreFamiliesModal] Families snapshot error:', err);
        }
      );

      return () => unsub();
    } catch (e) {
      console.warn('[ExploreFamiliesModal] Init error:', e);
    }
  }, [isOpen]);

  // Handle Joining a Family
  const handleJoinFamily = async (fam: FamilyItem) => {
    if (fam.membersCount >= fam.maxMembers) {
      showToast('⚠️ العائلة مكتملة الأعضاء حالياً (50/50)');
      return;
    }

    setIsJoining(fam.id);
    try {
      const currentUid = auth.currentUser?.uid || userId;

      // 1. Add user to family members subcollection in Firestore
      const memberDocRef = doc(db, 'families', fam.id, 'members', String(currentUid));
      await setDoc(memberDocRef, {
        id: currentUid,
        userId: currentUid,
        userGid: userId,
        name: userName,
        avatar: userAvatar,
        role: 'member',
        title: 'عضو القلعة',
        contributionToday: 0,
        contributionTotal: 50,
        activityScore: 100,
        level: 1,
        isOnline: true,
        joinedAt: serverTimestamp()
      }, { merge: true });

      // 2. Update family members count
      try {
        await updateDoc(doc(db, 'families', fam.id), {
          membersCount: fam.membersCount + 1,
          updatedAt: serverTimestamp()
        });
      } catch (e) {
        // Doc might not exist yet if using fallback, create it
        await setDoc(doc(db, 'families', fam.id), {
          id: fam.id,
          name: fam.name,
          level: fam.level,
          membersCount: fam.membersCount + 1,
          maxMembers: fam.maxMembers,
          castleEmblem: fam.castleEmblem,
          tag: fam.tag,
          leaderName: fam.leaderName,
          description: fam.description
        }, { merge: true });
      }

      // 3. Update user document with familyId
      try {
        await updateDoc(doc(db, 'users', currentUid), {
          familyId: fam.id,
          familyName: fam.name,
          familyRole: 'member',
          familyTag: fam.tag
        });
      } catch (err) {
        await setDoc(doc(db, 'users', currentUid), {
          familyId: fam.id,
          familyName: fam.name,
          familyRole: 'member',
          familyTag: fam.tag
        }, { merge: true });
      }

      // 4. Update localStorage and dispatch event
      localStorage.setItem('user_family_id', fam.id);
      localStorage.setItem('user_family_name', fam.name);
      localStorage.setItem('user_family_role', 'member');

      window.dispatchEvent(new CustomEvent('family_status_changed', {
        detail: { familyId: fam.id, familyName: fam.name, role: 'member' }
      }));

      showToast(`🎉 تهانينا! أصبحت الآن فرداً من ${fam.name}`);

      setTimeout(() => {
        if (onJoinedFamily) {
          onJoinedFamily(fam.id, fam.name);
        }
        onClose();
      }, 700);
    } catch (e) {
      console.error('[ExploreFamiliesModal] Failed to join family:', e);
      showToast('حدث خطأ أثناء الانضمام للعائلة.');
    } finally {
      setIsJoining(null);
    }
  };

  // Handle Creating a New Family
  const handleCreateFamily = async () => {
    if (!newFamilyName.trim()) {
      showToast('⚠️ يرجى إدخال اسم العائلة');
      return;
    }

    setIsCreating(true);
    try {
      const currentUid = auth.currentUser?.uid || userId;
      const newFamId = `fam-${Date.now().toString().slice(-6)}`;
      const tag = newFamilyTag.trim() || 'ROYAL';

      // 1. Create family in Firestore
      await setDoc(doc(db, 'families', newFamId), {
        id: newFamId,
        name: newFamilyName.trim(),
        tag: tag.toUpperCase(),
        description: newFamilyDesc.trim() || 'عائلة ملكية جديدة في تطبيق النجم.',
        castleEmblem: selectedEmblem,
        level: 1,
        exp: 100,
        nextLevelExp: 5000,
        membersCount: 1,
        maxMembers: 50,
        ownerId: currentUid,
        leaderName: userName,
        isOpenJoin: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // 2. Add creator as owner in members subcollection
      await setDoc(doc(db, 'families', newFamId, 'members', String(currentUid)), {
        id: currentUid,
        userId: currentUid,
        userGid: userId,
        name: userName,
        avatar: userAvatar,
        role: 'owner',
        title: 'مؤسس القلعة 👑',
        contributionToday: 100,
        contributionTotal: 500,
        activityScore: 100,
        level: 1,
        isOnline: true,
        joinedAt: serverTimestamp()
      });

      // 3. Update user document
      try {
        await updateDoc(doc(db, 'users', currentUid), {
          familyId: newFamId,
          familyName: newFamilyName.trim(),
          familyRole: 'owner',
          familyTag: tag.toUpperCase()
        });
      } catch (e) {
        await setDoc(doc(db, 'users', currentUid), {
          familyId: newFamId,
          familyName: newFamilyName.trim(),
          familyRole: 'owner',
          familyTag: tag.toUpperCase()
        }, { merge: true });
      }

      // 4. Persistence & event
      localStorage.setItem('user_family_id', newFamId);
      localStorage.setItem('user_family_name', newFamilyName.trim());
      localStorage.setItem('user_family_role', 'owner');

      window.dispatchEvent(new CustomEvent('family_status_changed', {
        detail: { familyId: newFamId, familyName: newFamilyName.trim(), role: 'owner' }
      }));

      showToast(`🏰 تم تأسيس ${newFamilyName} والقلعة بنجاح! مبروك يا قائد!`);

      setTimeout(() => {
        if (onJoinedFamily) {
          onJoinedFamily(newFamId, newFamilyName.trim());
        }
        onClose();
      }, 700);
    } catch (e) {
      console.error('[ExploreFamiliesModal] Create family error:', e);
      showToast('حدث خطأ أثناء تأسيس العائلة.');
    } finally {
      setIsCreating(false);
    }
  };

  // Filtered families
  const filteredFamilies = families.filter((f) => {
    return (
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.leaderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.id.includes(searchQuery)
    );
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md" dir="rtl">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 z-60 bg-gradient-to-r from-amber-600 to-yellow-600 text-slate-950 font-black text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-2xl border border-amber-300 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-white animate-spin" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        className="relative w-full max-w-2xl bg-gradient-to-b from-[#1E1711] via-[#14100C] to-[#0D0A08] text-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.85),0_0_25px_rgba(217,119,6,0.25)] border border-amber-600/30 overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="relative px-5 py-4 border-b border-amber-600/20 bg-gradient-to-r from-amber-950/60 via-slate-950/80 to-amber-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-[1px] shadow-lg shadow-amber-500/20">
              <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center text-lg">
                🏰
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-amber-100 tracking-wide">
                  بوابة العائلات والقبائل الملكية
                </h3>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-bold">
                  القلاع والتحالفات
                </span>
              </div>
              <p className="text-[11px] text-amber-200/70 font-medium">
                انضم إلى عائلة لتشارك في ترفيع القلعة، دوري البطولات، وحماية الرومات
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 pt-3 flex items-center gap-2 border-b border-amber-600/15 bg-slate-950/40">
          <button
            onClick={() => setActiveTab('explore')}
            className={`pb-2.5 px-4 text-xs font-black transition-all relative flex items-center gap-1.5 ${
              activeTab === 'explore'
                ? 'text-amber-300'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🏰 استكشاف العائلات المتاحة</span>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded-full font-mono">
              {families.length}
            </span>
            {activeTab === 'explore' && (
              <motion.div
                layoutId="family_tab_active"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 to-yellow-300"
              />
            )}
          </button>

          <button
            onClick={() => setActiveTab('create')}
            className={`pb-2.5 px-4 text-xs font-black transition-all relative flex items-center gap-1.5 ${
              activeTab === 'create'
                ? 'text-amber-300'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>👑 تأسيس عائلة وقلعة جديدة</span>
            {activeTab === 'create' && (
              <motion.div
                layoutId="family_tab_active"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 to-yellow-300"
              />
            )}
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 no-scrollbar">

          {/* ═══════════════════════════════════════════════════════════════════
              TAB 1: EXPLORE FAMILIES
              ═══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'explore' && (
            <>
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث باسم العائلة، القائد، أو رمز التاج..."
                  className="w-full bg-slate-950/80 border border-amber-900/40 focus:border-amber-500 text-white placeholder-slate-500 rounded-2xl px-4 py-3 pr-10 text-xs sm:text-sm font-medium outline-none transition-all shadow-inner"
                />
                <Search className="w-4 h-4 text-slate-400 absolute top-3.5 right-3.5" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute top-3.5 left-3.5 text-xs text-slate-400 hover:text-white"
                  >
                    مسح
                  </button>
                )}
              </div>

              {/* Families Cards */}
              <div className="space-y-3">
                {filteredFamilies.map((fam, idx) => (
                  <motion.div
                    key={`family-${fam.id}-${idx}`}
                    whileHover={{ scale: 1.008 }}
                    className="p-4 rounded-2xl bg-gradient-to-b from-[#1B140E] to-[#120D09] border border-amber-800/30 hover:border-amber-500/60 shadow-md transition-all relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        {/* Castle Emblem */}
                        <div className="relative shrink-0">
                          <div className="w-13 h-13 rounded-2xl bg-gradient-to-b from-amber-700/40 to-stone-900 border border-amber-400/50 flex items-center justify-center text-2xl shadow-inner">
                            {fam.castleEmblem}
                          </div>
                          <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full text-[8.5px] font-black bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 border border-slate-950 shadow-xs font-mono">
                            Lv.{fam.level}
                          </span>
                        </div>

                        {/* Details */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-black text-amber-100 truncate">
                              {fam.name}
                            </h4>
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-500/15 text-amber-300 border border-amber-500/30 font-mono">
                              [{fam.tag}]
                            </span>
                          </div>

                          <span className="text-[11px] text-amber-200/70 font-medium block mt-0.5">
                            القائد: {fam.leaderName}
                          </span>

                          <p className="text-[11px] text-slate-300 mt-1.5 leading-relaxed line-clamp-2">
                            {fam.description}
                          </p>

                          {/* Stats Badges */}
                          <div className="flex items-center gap-3 mt-2 text-[10.5px] font-bold">
                            <span className="flex items-center gap-1 text-slate-300">
                              <Users className="w-3.5 h-3.5 text-amber-400" />
                              <span>{fam.membersCount} / {fam.maxMembers} عضو</span>
                            </span>

                            <span className="flex items-center gap-1 text-amber-300">
                              <Trophy className="w-3.5 h-3.5 text-yellow-400" />
                              <span>الخبرة: {fam.exp.toLocaleString()}</span>
                            </span>

                            <span className="flex items-center gap-1 text-emerald-400">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span>{fam.isOpenJoin ? 'انضمام فوري' : 'بالطلب'}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Join Action Button */}
                      <button
                        onClick={() => handleJoinFamily(fam)}
                        disabled={isJoining === fam.id || fam.membersCount >= fam.maxMembers}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 hover:from-amber-500 hover:to-yellow-500 text-slate-950 text-xs font-black shadow-lg shadow-amber-600/25 active:scale-95 transition-all shrink-0 flex items-center gap-1.5 self-center disabled:opacity-50"
                      >
                        <span>{isJoining === fam.id ? 'جاري الانضمام...' : 'انضم الآن'}</span>
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))}

                {filteredFamilies.length === 0 && (
                  <div className="text-center py-8 text-slate-400">
                    <Castle className="w-10 h-10 mx-auto text-amber-700/60 mb-2" />
                    <p className="text-xs font-bold">لم يتم العثور على عائلة تطابق البحث</p>
                    <p className="text-[11px] text-slate-500 mt-1">يمكنك تأسيس عائلتك الخاصة الآن من التبويب أعلاه!</p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              TAB 2: CREATE NEW FAMILY
              ═══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'create' && (
            <div className="space-y-4 py-1">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/40 via-slate-950 to-amber-950/20 border border-amber-600/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-[2px]">
                    <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center text-2xl">
                      {selectedEmblem}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-amber-200">
                      تأسيس عائلة وقلعة جديدة
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      ستصبح مؤسس وقائد العائلة الرسمي، مع إمكانية تعيين مشرفين ودعوة أعضاء
                    </p>
                  </div>
                </div>

                <div className="space-y-3.5 text-xs">
                  {/* Family Name */}
                  <div>
                    <label className="block text-slate-300 font-bold mb-1.5">
                      اسم العائلة الرسمي *
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: عائلة صقور المجد"
                      value={newFamilyName}
                      onChange={(e) => setNewFamilyName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-white text-xs outline-none"
                    />
                  </div>

                  {/* Family Tag */}
                  <div>
                    <label className="block text-slate-300 font-bold mb-1.5">
                      رمز وتاج العائلة المختصر (TAG)
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: SAQR (3-5 أحرف)"
                      maxLength={5}
                      value={newFamilyTag}
                      onChange={(e) => setNewFamilyTag(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-white text-xs outline-none uppercase font-mono"
                    />
                  </div>

                  {/* Emblem Selection */}
                  <div>
                    <label className="block text-slate-300 font-bold mb-1.5">
                      اختر شعار القلعة والدرع
                    </label>
                    <div className="grid grid-cols-6 gap-2">
                      {CASTLE_EMBLEMS.map((emblem) => (
                        <button
                          key={emblem.id}
                          type="button"
                          onClick={() => setSelectedEmblem(emblem.emoji)}
                          className={`p-2.5 rounded-xl text-center transition-all ${
                            selectedEmblem === emblem.emoji
                              ? 'bg-amber-500/30 border-2 border-amber-400 shadow-md scale-105'
                              : 'bg-slate-950 border border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <span className="text-xl block">{emblem.emoji}</span>
                          <span className="text-[9px] text-slate-400 block mt-1 truncate">
                            {emblem.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-slate-300 font-bold mb-1.5">
                      رسالة وقوانين العائلة (اختياري)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="اكتب شعار العائلة أو ترحيباً بالأعضاء الجدد..."
                      value={newFamilyDesc}
                      onChange={(e) => setNewFamilyDesc(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl p-3 text-white text-xs outline-none resize-none"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-600/30 text-[11px] text-amber-200/90 leading-relaxed flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>تأسيس العائلة مجاني ومتاح كـ ميزة شرفية للمستخدمين المتميزين في النجم.</span>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mt-5">
                  <button
                    onClick={handleCreateFamily}
                    disabled={isCreating || !newFamilyName.trim()}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
                  >
                    <Crown className="w-4 h-4" />
                    <span>{isCreating ? 'جاري تأسيس القلعة...' : 'تأسيس العائلة والقلعة الآن 🏰'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
};

export default ExploreFamiliesModal;
