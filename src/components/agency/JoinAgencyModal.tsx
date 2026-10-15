import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Search, 
  Sparkles, 
  ShieldCheck, 
  Building2, 
  Users, 
  Award, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Send, 
  TrendingUp, 
  Radio, 
  ChevronLeft,
  Copy,
  Check,
  AlertCircle,
  HelpCircle,
  Flame,
  Star,
  ExternalLink
} from 'lucide-react';
import { db, auth } from '../../lib/firebase';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp 
} from 'firebase/firestore';

export interface AgencyItem {
  id: string;
  agencyGid: string;
  name: string;
  ownerName: string;
  avatar: string;
  hostsCount: number;
  hostShareRate: number; // e.g. 85 for 85%
  isOfficial: boolean;
  tier: 'diamond' | 'gold' | 'silver';
  description: string;
  supportHours: string;
}

export interface JoinAgencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
  userName?: string;
  userAvatar?: string;
  agencyStatus?: 'none' | 'pending' | 'approved' | 'active';
  pendingAgencyInfo?: {
    agencyId?: string;
    agencyName?: string;
    appliedAt?: string;
  };
  onSuccessJoin?: (agencyId: string, agencyName: string) => void;
  onCancelPending?: () => void;
  onOpenHostCenter?: (agencyGid: string, agencyName: string) => void;
}

const DEFAULT_AGENCIES: AgencyItem[] = [
  {
    id: 'def-ag-30032',
    agencyGid: '30032',
    name: 'وكالة شحن النجم الرسمية',
    ownerName: 'أحمد النجم (الوكيل الرسمي)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    hostsCount: 142,
    hostShareRate: 85,
    isOfficial: true,
    tier: 'diamond',
    description: 'الوكالة الرسمية الأولى للمنصة. دعم بوانص وماسات شهرية وتوثيق فوري للمذيعين النشطين.',
    supportHours: '24/7 متواصل'
  },
  {
    id: 'def-ag-55001',
    agencyGid: '55001',
    name: 'وكالة الصقور الملكية',
    ownerName: 'منصور الهاشمي',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    hostsCount: 98,
    hostShareRate: 82,
    isOfficial: true,
    tier: 'gold',
    description: 'بيئة احترافية لصناع المحتوى الصوتي وبثوث الألعاب. جوائز ومكافآت وصول التارجت.',
    supportHours: '18 ساعة يومياً'
  },
  {
    id: 'def-ag-77002',
    agencyGid: '77002',
    name: 'وكالة الأساطير الذهبية',
    ownerName: 'فيصل العتيبي',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    hostsCount: 185,
    hostShareRate: 90,
    isOfficial: true,
    tier: 'diamond',
    description: 'أعلى نسبة أرباح للمذيعين في المنصة 90%. دعم مالي مباشر في جولات التحدي PK.',
    supportHours: '24/7 متواصل'
  },
  {
    id: 'def-ag-88003',
    agencyGid: '88003',
    name: 'وكالة فرسان العرب',
    ownerName: 'سامي الشمري',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80',
    hostsCount: 76,
    hostShareRate: 80,
    isOfficial: true,
    tier: 'silver',
    description: 'وكالة متخصصة في تدريب وتطوير المذيعين المبتدئين حتى تحقيق الاحتراف.',
    supportHours: '12 ساعة يومياً'
  }
];

export const JoinAgencyModal: React.FC<JoinAgencyModalProps> = ({
  isOpen,
  onClose,
  userId = '1001001',
  userName = 'المستخدم',
  userAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  agencyStatus = 'none',
  pendingAgencyInfo,
  onSuccessJoin,
  onCancelPending,
  onOpenHostCenter
}) => {
  const [agencies, setAgencies] = useState<AgencyItem[]>(DEFAULT_AGENCIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'official' | 'high_rate'>('all');
  const [selectedAgencyToJoin, setSelectedAgencyToJoin] = useState<AgencyItem | null>(null);
  const [applicantNote, setApplicantNote] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedGid, setCopiedGid] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Direct GID Manual Search
  const [manualGidInput, setManualGidInput] = useState('');
  const [showManualGidForm, setShowManualGidForm] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 1. Live Firestore Sync for Agencies
  useEffect(() => {
    if (!isOpen) return;

    try {
      const agenciesCol = collection(db, 'agencies');
      const unsub = onSnapshot(
        agenciesCol,
        (snap) => {
          if (!snap.empty) {
            const loaded = snap.docs.map((docSnap) => {
              const d = docSnap.data();
              return {
                id: docSnap.id,
                agencyGid: d.agencyGid || d.gid || docSnap.id,
                name: d.name || d.agencyName || 'وكالة معتمدة',
                ownerName: d.ownerName || d.delegateName || 'إدارة الوكالة',
                avatar: d.avatar || d.logoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
                hostsCount: Number(d.hostsCount || d.totalHosts || 0),
                hostShareRate: Number(d.hostShareRate || d.commissionRate || 85),
                isOfficial: Boolean(d.isOfficial ?? true),
                tier: (d.tier as any) || 'diamond',
                description: d.description || 'وكالة رسمية معتمدة تدعم المذيعين والمواهب.',
                supportHours: d.supportHours || '24/7'
              } as AgencyItem;
            });
            // Merge loaded agencies with defaults without duplication
            const mergedMap = new Map<string, AgencyItem>();
            const seenGids = new Set<string>();
            const seenIds = new Set<string>();

            // Authoritative Firestore loaded agencies first
            loaded.forEach((a) => {
              const uniqueKey = a.id || a.agencyGid;
              mergedMap.set(uniqueKey, a);
              if (a.agencyGid) seenGids.add(a.agencyGid);
              if (a.id) seenIds.add(a.id);
            });

            // Fallback defaults added only if not already loaded from Firestore
            DEFAULT_AGENCIES.forEach((d) => {
              if (!seenGids.has(d.agencyGid) && !seenIds.has(d.id)) {
                mergedMap.set(d.id, d);
              }
            });

            setAgencies(Array.from(mergedMap.values()));
          }
        },
        (err) => {
          console.warn('[JoinAgencyModal] Firestore agencies error, using defaults:', err);
        }
      );

      return () => unsub();
    } catch (e) {
      console.warn('[JoinAgencyModal] Init error:', e);
    }
  }, [isOpen]);

  // Copy GID to clipboard
  const handleCopy = (gid: string) => {
    navigator.clipboard?.writeText(gid);
    setCopiedGid(gid);
    setTimeout(() => setCopiedGid(null), 2000);
  };

  // Submit Application to Firestore
  const handleSendJoinRequest = async () => {
    if (!selectedAgencyToJoin) return;
    setIsSubmitting(true);

    try {
      const currentUid = auth.currentUser?.uid || userId;
      const requestId = `req_${currentUid}_${selectedAgencyToJoin.agencyGid}`;

      // 1. Save in agency_requests collection
      await setDoc(doc(db, 'agency_requests', requestId), {
        id: requestId,
        userId: currentUid,
        userGid: userId,
        userName,
        userAvatar,
        agencyId: selectedAgencyToJoin.id,
        agencyGid: selectedAgencyToJoin.agencyGid,
        agencyName: selectedAgencyToJoin.name,
        status: 'pending',
        phone: applicantPhone.trim() || null,
        note: applicantNote.trim() || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // 2. Update user profile document in Firestore
      try {
        await updateDoc(doc(db, 'users', currentUid), {
          agencyStatus: 'pending',
          pendingAgencyId: selectedAgencyToJoin.agencyGid,
          pendingAgencyName: selectedAgencyToJoin.name,
          pendingAgencyAppliedAt: new Date().toISOString()
        });
      } catch (err) {
        // Doc might need setDoc merge if it doesn't exist
        await setDoc(doc(db, 'users', currentUid), {
          agencyStatus: 'pending',
          pendingAgencyId: selectedAgencyToJoin.agencyGid,
          pendingAgencyName: selectedAgencyToJoin.name,
          pendingAgencyAppliedAt: new Date().toISOString()
        }, { merge: true });
      }

      // 3. Local fallback persistence
      localStorage.setItem('user_agency_status', 'pending');
      localStorage.setItem('user_agency_info', JSON.stringify({
        pendingAgencyId: selectedAgencyToJoin.agencyGid,
        pendingAgencyName: selectedAgencyToJoin.name,
        appliedAt: new Date().toLocaleDateString('ar-SA')
      }));

      window.dispatchEvent(new CustomEvent('agency_status_changed', {
        detail: { status: 'pending', agencyGid: selectedAgencyToJoin.agencyGid }
      }));

      showToast(`تم إرسال طلب الانضمام إلى ${selectedAgencyToJoin.name} بنجاح! 🚀`);
      setSelectedAgencyToJoin(null);
      setApplicantNote('');
      setApplicantPhone('');

      if (onSuccessJoin) {
        onSuccessJoin(selectedAgencyToJoin.agencyGid, selectedAgencyToJoin.name);
      }
    } catch (e: any) {
      console.error('[JoinAgencyModal] Failed to send request:', e);
      showToast('حدث خطأ أثناء إرسال الطلب، تم الحفظ محلياً.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cancel Pending Request
  const handleCancelRequest = async () => {
    setIsSubmitting(true);
    try {
      const currentUid = auth.currentUser?.uid || userId;
      const targetGid = pendingAgencyInfo?.agencyId || '30032';
      const requestId = `req_${currentUid}_${targetGid}`;

      // 1. Remove or cancel request doc
      try {
        await deleteDoc(doc(db, 'agency_requests', requestId));
      } catch (err) {
        console.warn('[JoinAgencyModal] Request doc delete fallback:', err);
      }

      // 2. Reset user document status
      try {
        await updateDoc(doc(db, 'users', currentUid), {
          agencyStatus: 'none',
          pendingAgencyId: null,
          pendingAgencyName: null
        });
      } catch (e) {
        // Fallback
      }

      localStorage.setItem('user_agency_status', 'none');
      localStorage.removeItem('user_agency_info');

      window.dispatchEvent(new CustomEvent('agency_status_changed', {
        detail: { status: 'none' }
      }));

      showToast('تم إلغاء طلب الانضمام بنجاح. يمكنك التقديم على وكالة أخرى.');
      if (onCancelPending) {
        onCancelPending();
      }
    } catch (e) {
      console.error('[JoinAgencyModal] Cancel error:', e);
      showToast('حدث خطأ أثناء الإلغاء.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Instant simulation approve for testing/demo
  const handleSimulateApprove = async () => {
    const currentUid = auth.currentUser?.uid || userId;
    const targetGid = pendingAgencyInfo?.agencyId || selectedAgencyToJoin?.agencyGid || '30032';
    const targetName = pendingAgencyInfo?.agencyName || selectedAgencyToJoin?.name || 'وكالة شحن النجم الرسمية';

    try {
      await updateDoc(doc(db, 'users', currentUid), {
        agencyStatus: 'active',
        agencyId: targetGid,
        agencyName: targetName,
        pendingAgencyId: null,
        pendingAgencyName: null
      });
    } catch (e) {
      // Fallback
    }

    localStorage.setItem('user_agency_status', 'active');
    localStorage.setItem('user_agency_info', JSON.stringify({
      agencyId: targetGid,
      agencyName: targetName
    }));

    window.dispatchEvent(new CustomEvent('agency_status_changed', {
      detail: { status: 'active', agencyGid: targetGid, agencyName: targetName }
    }));

    showToast(`🎉 مبروك! تم قبولك رسمياً في ${targetName}`);
    if (onOpenHostCenter) {
      onOpenHostCenter(targetGid, targetName);
    }
    onClose();
  };

  // Filter Agencies
  const filteredAgencies = agencies.filter((item) => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.agencyGid.includes(searchQuery) ||
      item.ownerName.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedFilter === 'official') return item.isOfficial;
    if (selectedFilter === 'high_rate') return item.hostShareRate >= 85;
    return true;
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
            className="fixed top-6 z-60 bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-black text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-2xl border border-emerald-300 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        className="relative w-full max-w-2xl bg-gradient-to-b from-[#131B2E] via-[#0E1524] to-[#0A0E1A] text-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.8),0_0_25px_rgba(16,185,129,0.25)] border border-emerald-500/30 overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header with Royal Emerald Accent */}
        <div className="relative px-5 py-4 border-b border-emerald-500/20 bg-gradient-to-r from-emerald-950/60 via-slate-900/80 to-emerald-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-[1px] shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
                <Building2 className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white tracking-wide">
                  مركز الانضمام للوكالات المعتمدة
                </h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                  توثيق المذيعين
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                انضم كـ مذيع رسمي إلى إحدى وكالات النجم لتلقي الدعم والرواتب الشهرية
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

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 no-scrollbar">

          {/* ═══════════════════════════════════════════════════════════════════
              CASE 1: PENDING REQUEST STATE
              ═══════════════════════════════════════════════════════════════════ */}
          {agencyStatus === 'pending' ? (
            <div className="space-y-4 py-2">
              {/* Highlight Pending Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-950/50 via-slate-900 to-amber-950/30 border border-amber-500/40 text-center relative overflow-hidden shadow-lg">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
                
                <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-[2px] shadow-lg shadow-amber-500/30 mb-3">
                  <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
                    <Clock className="w-7 h-7 text-amber-400 animate-pulse" />
                  </div>
                </div>

                <h4 className="text-base sm:text-lg font-black text-amber-200 mb-1">
                  ⏳ طلب الانضمام قيد المراجعة والتدقيق
                </h4>
                <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                  تم استلام طلب انضمامك بنجاح وهو الآن أمام إدارة الوكالة لاعتماده وتفعيل مركز المذيعين الخاص بك.
                </p>

                {/* Applied Agency Details Card */}
                <div className="mt-4 p-3.5 rounded-xl bg-slate-950/80 border border-amber-400/30 flex items-center justify-between text-right max-w-md mx-auto">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-[1px]">
                      <div className="w-full h-full bg-slate-900 rounded-xl flex items-center justify-center font-black text-amber-300 text-sm">
                        🏢
                      </div>
                    </div>
                    <div>
                      <h5 className="text-sm font-black text-white">
                        {pendingAgencyInfo?.agencyName || 'وكالة شحن النجم الرسمية'}
                      </h5>
                      <span className="text-[11px] text-amber-400 font-mono font-bold block">
                        GID: {pendingAgencyInfo?.agencyId || '30032'}
                      </span>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                    قيد التدقيق
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
                  <button
                    onClick={handleCancelRequest}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto flex-1 px-4 py-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-500/40 text-xs font-black transition-colors flex items-center justify-center gap-1.5"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>إلغاء الطلب والتقديم لوكالة أخرى</span>
                  </button>

                  {/* Simulator button for fast test */}
                  <button
                    onClick={handleSimulateApprove}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-md shadow-emerald-500/30 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>قبول فوري تجريبي ⚡</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* ═══════════════════════════════════════════════════════════════════
               CASE 2: NONE STATE (Explore & Join Agencies)
               ═══════════════════════════════════════════════════════════════════ */
            <>
              {/* Feature Cards Banner */}
              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className="p-3 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-emerald-500/20">
                  <div className="w-8 h-8 mx-auto rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-1.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h5 className="text-[11px] font-black text-white">توثيق رسمي</h5>
                  <p className="text-[9.5px] text-slate-400 font-medium">شارة المذيع المعتمد</p>
                </div>

                <div className="p-3 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/20">
                  <div className="w-8 h-8 mx-auto rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-1.5">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <h5 className="text-[11px] font-black text-white">رواتب وماسات</h5>
                  <p className="text-[9.5px] text-slate-400 font-medium">أعلى نسبة أرباح 90%</p>
                </div>

                <div className="p-3 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-cyan-500/20">
                  <div className="w-8 h-8 mx-auto rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-1.5">
                    <Radio className="w-4 h-4" />
                  </div>
                  <h5 className="text-[11px] font-black text-white">دعم البثوث PK</h5>
                  <p className="text-[9.5px] text-slate-400 font-medium">كفالة جولات التحدي</p>
                </div>
              </div>

              {/* Search & Filter Bar */}
              <div className="space-y-2">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث باسم الوكالة أو رقم الـ GID المباشر..."
                    className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-emerald-500 text-white placeholder-slate-500 rounded-2xl px-4 py-3 pr-10 text-xs sm:text-sm font-medium outline-none transition-all shadow-inner"
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

                {/* Filter Chips */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
                  <button
                    onClick={() => setSelectedFilter('all')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 ${
                      selectedFilter === 'all'
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    جميع الوكالات ({agencies.length})
                  </button>

                  <button
                    onClick={() => setSelectedFilter('official')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1 ${
                      selectedFilter === 'official'
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>المعتمدة رسمياً</span>
                  </button>

                  <button
                    onClick={() => setSelectedFilter('high_rate')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1 ${
                      selectedFilter === 'high_rate'
                        ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>الأعلى نسبة (≥85%)</span>
                  </button>
                </div>
              </div>

              {/* Agencies List */}
              <div className="space-y-3">
                {filteredAgencies.map((agency, idx) => (
                  <motion.div
                    key={`agency-${agency.id || agency.agencyGid}-${idx}`}
                    whileHover={{ scale: 1.008 }}
                    className="p-4 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800/90 hover:border-emerald-500/50 shadow-md transition-all relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        {/* Avatar */}
                        <div className="relative shrink-0">
                          <img
                            src={agency.avatar}
                            alt={agency.name}
                            className="w-12 h-12 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-md"
                          />
                          {agency.isOfficial && (
                            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-950 flex items-center justify-center text-[8px] text-white">
                              ✓
                            </span>
                          )}
                        </div>

                        {/* Agency Details */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-black text-white truncate">
                              {agency.name}
                            </h4>
                            <span className="px-2 py-0.5 rounded-full text-[9.5px] font-mono font-black bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                              GID: {agency.agencyGid}
                            </span>
                          </div>

                          <span className="text-[11px] text-slate-400 font-medium block mt-0.5">
                            الوكيل: {agency.ownerName}
                          </span>

                          <p className="text-[11px] text-slate-300 mt-1.5 leading-relaxed line-clamp-2">
                            {agency.description}
                          </p>

                          {/* Stats Badges */}
                          <div className="flex items-center gap-3 mt-2.5 text-[10.5px] font-bold">
                            <span className="flex items-center gap-1 text-slate-400">
                              <Users className="w-3.5 h-3.5 text-cyan-400" />
                              <span>{agency.hostsCount} مذيع</span>
                            </span>
                            <span className="flex items-center gap-1 text-amber-300">
                              <Flame className="w-3.5 h-3.5 text-amber-400" />
                              <span>نسبة الأرباح {agency.hostShareRate}%</span>
                            </span>
                            <span className="flex items-center gap-1 text-emerald-400">
                              <Clock className="w-3.5 h-3.5" />
                              <span>دعم {agency.supportHours}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Join Button */}
                      <button
                        onClick={() => setSelectedAgencyToJoin(agency)}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-lg shadow-emerald-500/20 active:scale-95 transition-all shrink-0 flex items-center gap-1.5 self-center"
                      >
                        <span>طلب انضمام</span>
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))}

                {filteredAgencies.length === 0 && (
                  <div className="text-center py-8 text-slate-400">
                    <Building2 className="w-10 h-10 mx-auto text-slate-600 mb-2" />
                    <p className="text-xs font-bold">لم يتم العثور على وكالة تطابق البحث</p>
                    <p className="text-[11px] text-slate-500 mt-1">تأكد من كتابة الاسم أو رقم الـ GID الصحيح</p>
                  </div>
                )}
              </div>
            </>
          )}

        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            CONFIRM JOIN APPLICATION POPUP
            ═══════════════════════════════════════════════════════════════════ */}
        <AnimatePresence>
          {selectedAgencyToJoin && (
            <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm" dir="rtl">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full max-w-md bg-gradient-to-b from-[#131B2E] to-[#0A0E1A] text-white rounded-3xl p-5 border border-emerald-500/40 shadow-2xl relative"
              >
                <button
                  onClick={() => setSelectedAgencyToJoin(null)}
                  className="absolute top-4 left-4 w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={selectedAgencyToJoin.avatar}
                    alt={selectedAgencyToJoin.name}
                    className="w-12 h-12 rounded-2xl object-cover border border-emerald-400/50"
                  />
                  <div>
                    <h4 className="text-sm font-black text-white">
                      تقديم طلب إلى {selectedAgencyToJoin.name}
                    </h4>
                    <span className="text-[11px] text-emerald-400 font-mono font-bold">
                      GID: {selectedAgencyToJoin.agencyGid}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">
                      رقم الهاتف / الواتساب للتواصل (اختياري)
                    </label>
                    <input
                      type="text"
                      placeholder="05XXXXXXXX"
                      value={applicantPhone}
                      onChange={(e) => setApplicantPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-3 py-2 text-white text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-bold mb-1">
                      رسالة للمدير أو نبذة عن موهبتك / أوقات بثك (اختياري)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="مذيع بث صوتي يومي، ملتزم بجولات الـ PK..."
                      value={applicantNote}
                      onChange={(e) => setApplicantNote(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl p-3 text-white text-xs outline-none resize-none"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-[11px] text-emerald-300 leading-relaxed">
                    ✨ بعد إرسال الطلب، ستتمكن إدارة الوكالة من مراجعة حسابك وإضافتك رسمياً إلى قائمة مذيعي الوكالة.
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-2.5">
                  <button
                    onClick={handleSendJoinRequest}
                    disabled={isSubmitting}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'جاري الإرسال...' : 'تأكيد إرسال الطلب'}</span>
                  </button>

                  <button
                    onClick={() => setSelectedAgencyToJoin(null)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                  >
                    إلغاء
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </motion.div>
    </div>
  );
};

export default JoinAgencyModal;
