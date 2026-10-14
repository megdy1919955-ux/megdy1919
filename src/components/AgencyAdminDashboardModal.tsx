import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Building2, 
  Users, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  Search, 
  Filter, 
  ChevronLeft, 
  FileText, 
  DollarSign, 
  Star, 
  Download, 
  RefreshCw, 
  Sparkles,
  Layers,
  BarChart3,
  Sliders,
  Save,
  Plus,
  Trash2,
  Mail
} from 'lucide-react';
import { 
  fetchDashboardConfig, 
  updateDashboardConfig, 
  fetchAgencyTargetsTiers, 
  updateAgencyTargetsTiers, 
  AgencyTargetTier 
} from '../lib/serverRewardsService';
import { db, auth } from '../lib/firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  getDocs,
  serverTimestamp
} from 'firebase/firestore';

interface AgencyAdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
}

export const AgencyAdminDashboardModal: React.FC<AgencyAdminDashboardModalProps> = ({
  isOpen,
  onClose,
  userId = 'AG9901'
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'agencies' | 'requests' | 'targets' | 'exchange_control'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'verified' | 'pending'>('all');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Exchange rate & controls state
  const [exchangeRateInput, setExchangeRateInput] = useState<number>(13500);
  const [qualifiedDaysInput, setQualifiedDaysInput] = useState<number>(15);
  const [streamHoursInput, setStreamHoursInput] = useState<number>(30);
  const [isSavingConfig, setIsSavingConfig] = useState(false);

  // Targets tiers state
  const [tiersList, setTiersList] = useState<AgencyTargetTier[]>([]);
  const [isSavingTiers, setIsSavingTiers] = useState(false);

  // ✅ Live data from Firestore
  const [agenciesList, setAgenciesList] = useState<any[]>([]);
  const [requestsList, setRequestsList] = useState<any[]>([]);
  const [liveStats, setLiveStats] = useState({
    totalAgencies: 0,
    activeHosts: 0,
    totalBrokers: 0,
    totalDiamonds: 0
  });
  const [isLoadingData, setIsLoadingData] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchDashboardConfig().then((cfg) => {
        if (cfg) {
          if (cfg.exchangeRateDiamondsPerUsd) setExchangeRateInput(cfg.exchangeRateDiamondsPerUsd);
          if (cfg.qualifiedDaysTarget) setQualifiedDaysInput(cfg.qualifiedDaysTarget);
          if (cfg.streamHoursTarget) setStreamHoursInput(cfg.streamHoursTarget);
        }
      });
      fetchAgencyTargetsTiers().then((tiers) => {
        if (tiers && tiers.length > 0) {
          setTiersList(tiers);
        }
      });
    }

    const handleTiersUpdated = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && Array.isArray(customEvent.detail)) {
        setTiersList(customEvent.detail);
      }
    };
    window.addEventListener('agency_targets_tiers_updated', handleTiersUpdated);
    return () => window.removeEventListener('agency_targets_tiers_updated', handleTiersUpdated);
  }, [isOpen]);

  // ✅ Live listen: agencies + hosts + brokers + requests
  useEffect(() => {
    if (!isOpen) return;
    
    setIsLoadingData(true);
    
    // 1️⃣ agencies
    const unsubAgencies = onSnapshot(
      collection(db, 'agencies'),
      (snap) => {
        const list = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            name: data.agencyName || data.name || `وكالة #${d.id}`,
            agentName: data.ownerName || 'غير محدد',
            agentId: data.ownerId || '—',
            status: data.status || 'pending',
            broadcastersCount: data.hosts || data.broadcastersCount || 0,
            brokersCount: data.brokersCount || 0,
            monthlyTargetDiamonds: (data.targetDiamonds || 0).toLocaleString('en-US'),
            currentDiamonds: (data.achievedDiamonds || 0).toLocaleString('en-US'),
            targetCompletion: data.targetDiamonds 
              ? Math.round(((data.achievedDiamonds || 0) / data.targetDiamonds) * 100)
              : 0,
            commissionRate: `${data.commission || 10}%`,
            joinedDate: data.createdAt || new Date().toISOString().split('T')[0]
          };
        });
        setAgenciesList(list);
        setLiveStats((prev) => ({
          ...prev,
          totalAgencies: snap.size
        }));
      },
      (err) => console.warn('Agencies listen error:', err)
    );
    
    // 2️⃣ hosts (for stats)
    const unsubHosts = onSnapshot(
      collection(db, 'hosts'),
      (snap) => {
        let totalDiamonds = 0;
        snap.docs.forEach((d) => {
          const data = d.data();
          totalDiamonds += (data.metrics?.diamondsEarned || data.diamonds || 0);
        });
        setLiveStats((prev) => ({
          ...prev,
          activeHosts: snap.size,
          totalDiamonds
        }));
      },
      (err) => console.warn('Hosts listen error:', err)
    );
    
    // 3️⃣ brokers
    const unsubBrokers = onSnapshot(
      collection(db, 'brokers'),
      (snap) => {
        setLiveStats((prev) => ({
          ...prev,
          totalBrokers: snap.size
        }));
      },
      (err) => console.warn('Brokers listen error:', err)
    );
    
    // 4️⃣ agency_requests
    const unsubRequests = onSnapshot(
      collection(db, 'agency_requests'),
      (snap) => {
        const list = snap.docs
          .filter((d) => {
            const status = d.data().status;
            return status === 'pending' || status === 'pending_head_approval';
          })
          .map((d) => ({
            id: d.id,
            applicantName: d.data().applicantName || 'غير محدد',
            applicantId: d.data().applicantId || '—',
            proposedAgencyName: d.data().proposedAgencyName || 'وكالة جديدة',
            createdAt: d.data().createdAt || new Date().toISOString()
          }));
        setRequestsList(list);
      },
      (err) => console.warn('Requests listen error:', err)
    );
    
    setIsLoadingData(false);
    
    return () => {
      unsubAgencies();
      unsubHosts();
      unsubBrokers();
      unsubRequests();
    };
  }, [isOpen]);

  const handleTierChange = (index: number, field: keyof AgencyTargetTier, value: any) => {
    setTiersList((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleAddTierRow = () => {
    const nextIdx = tiersList.length + 1;
    const lastTier = tiersList[tiersList.length - 1];
    const newTier: AgencyTargetTier = {
      id: `T${nextIdx}`,
      levelName: `LV.${nextIdx}`,
      targetDiamonds: (lastTier?.targetDiamonds || 0) * 2 || 10000,
      requiredDays: qualifiedDaysInput || 15,
      requiredHours: streamHoursInput || 30,
      salaryUsd: (lastTier?.salaryUsd || 0) * 2 || 20,
      agencyCommissionPercent: 15
    };
    setTiersList((prev) => [...prev, newTier]);
  };

  const handleRemoveTierRow = (index: number) => {
    setTiersList((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSaveTiers = async () => {
    setIsSavingTiers(true);
    const ok = await updateAgencyTargetsTiers(tiersList, {
      defaultDaysTarget: qualifiedDaysInput,
      defaultHoursTarget: streamHoursInput,
      exchangeRateDiamondsPerUsd: exchangeRateInput
    });
    setIsSavingTiers(false);
    if (ok) {
      showToast('تم تحديث جدول تارجتات الوكالات والشروط على السيرفر المركزي بنجاح! 🎯');
    } else {
      showToast('تعذر حفظ جدول التارجتات في السيرفر، يرجى التحقق من الاتصال');
    }
  };

  const handleSaveExchangeConfig = async () => {
    setIsSavingConfig(true);
    const ok = await updateDashboardConfig({
      exchangeRateDiamondsPerUsd: Number(exchangeRateInput),
      qualifiedDaysTarget: Number(qualifiedDaysInput),
      streamHoursTarget: Number(streamHoursInput)
    });
    setIsSavingConfig(false);
    if (ok) {
      showToast(`تم حفظ وتطبيق سعر الصرف (${Number(exchangeRateInput).toLocaleString()} 💎 = 1$) بنجاح على السيرفر! 🚀`);
    } else {
      showToast('تعذر الحفظ في السيرفر، يرجى المحاولة ثانية');
    }
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  if (!isOpen) return null;

  // ✅ Firestore-driven data (لا MOCK)
  const displayAgencies = agenciesList;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 text-right select-none" dir="rtl">
      <div className="relative w-full max-w-2xl bg-slate-950 border-2 border-blue-500/40 rounded-3xl shadow-[0_0_50px_rgba(59,130,246,0.3)] overflow-hidden text-white animate-in fade-in zoom-in duration-200 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)] border border-blue-400/40">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">لوحة تحكم إداري الوكالات</h3>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 font-extrabold px-2.5 py-0.5 rounded-full border border-blue-400/40">
                  صلاحية خاصة 🏛️
                </span>
              </div>
              <p className="text-[11px] text-slate-300">متابعة واعتماد الوكالات، مراقبة التارغت والوسطاء</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-4 pt-3 border-b border-slate-800/80 bg-slate-900/60 overflow-x-auto no-scrollbar">
          {[
            { id: 'overview', title: 'نظرة عامة وإحصائيات', icon: BarChart3 },
            { id: 'exchange_control', title: 'سعر الصرف والتحكم المركزي', icon: DollarSign },
            { id: 'agencies', title: 'دليل الوكالات المعتمدة', icon: Building2 },
            { id: 'requests', title: 'طلبات التوثيق والاعتماد', icon: FileText },
            { id: 'targets', title: 'مراقبة التارغت الشهري', icon: TrendingUp },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-t-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600/30 text-blue-300 border-b-2 border-blue-400'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.title}</span>
              </button>
            );
          })}
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 custom-scrollbar">
          
          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Quick Stat Cards — LIVE */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 bg-slate-900/80 border border-blue-500/30 rounded-2xl">
                  <span className="text-[10px] text-slate-400 font-bold block">إجمالي الوكالات</span>
                  <span className="text-xl font-black text-blue-400 font-mono">
                    {agenciesList.length} وكالة
                  </span>
                </div>
                <div className="p-3 bg-slate-900/80 border border-emerald-500/30 rounded-2xl">
                  <span className="text-[10px] text-slate-400 font-bold block">المذيعين النشطين</span>
                  <span className="text-xl font-black text-emerald-400 font-mono">
                    {liveStats.activeHosts} مذيع
                  </span>
                </div>
                <div className="p-3 bg-slate-900/80 border border-purple-500/30 rounded-2xl">
                  <span className="text-[10px] text-slate-400 font-bold block">الوسطاء المعتمدين</span>
                  <span className="text-xl font-black text-purple-400 font-mono">
                    {liveStats.totalBrokers} وسيط
                  </span>
                </div>
                <div className="p-3 bg-slate-900/80 border border-amber-500/30 rounded-2xl">
                  <span className="text-[10px] text-slate-400 font-bold block">إجمالي تداول الماس</span>
                  <span className="text-xl font-black text-amber-400 font-mono">
                    {(liveStats.totalDiamonds / 1_000_000).toFixed(1)}M 💎
                  </span>
                </div>
              </div>

              {/* Agency Highlights Banner */}
              <div className="p-4 bg-gradient-to-r from-blue-900/40 via-slate-900 to-indigo-900/40 border border-blue-500/40 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-blue-300 font-black text-xs">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span>تنبيهات الإدارة والاعتماد الفوري</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  بصفتك إداري الوكالات المعتمد، يمكنك مراجعة طلبات فتح الوكالات الجديدة، توثيق العقود، والتحقق من التزام الوكلاء بنسب العمولات والحد الأدنى لساعات البث.
                </p>
              </div>

              {/* Agencies Performance Table Preview — LIVE */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-3">
                <h4 className="text-xs font-black text-white flex items-center justify-between">
                  <span>أعلى الوكالات أداءً هذا الشهر</span>
                  <span className="text-[10px] text-slate-400 font-normal">محدث لحظياً ⚡</span>
                </h4>
                
                {isLoadingData ? (
                  <div className="text-center py-6">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  </div>
                ) : displayAgencies.length === 0 ? (
                  <div className="text-center py-6 text-slate-500 text-xs font-bold">
                    لا توجد وكالات في Firestore حتى الآن
                  </div>
                ) : (
                  <div className="space-y-2">
                    {displayAgencies
                      .slice()
                      .sort((a, b) => parseInt(String(b.currentDiamonds).replace(/,/g, '') || '0') - parseInt(String(a.currentDiamonds).replace(/,/g, '') || '0'))
                      .slice(0, 5)
                      .map((ag) => (
                        <div key={ag.id} className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-xl flex items-center justify-between text-xs">
                          <div>
                            <div className="font-bold text-white flex items-center gap-1.5">
                              <span>{ag.name}</span>
                              <span className="text-[9px] bg-blue-950 text-blue-300 px-1.5 py-0.2 rounded border border-blue-800">
                                GID: {ag.id}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400">
                              الوكيل: {ag.agentName} | المذيعين: {ag.broadcastersCount} | الوسطاء: {ag.brokersCount}
                            </span>
                          </div>
                          <div className="text-left">
                            <span className="font-mono font-black text-amber-400 block">{ag.currentDiamonds} 💎</span>
                            <span className="text-[10px] text-emerald-400 font-bold">إنجاز {ag.targetCompletion}%</span>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 2: Agencies List */}
          {activeTab === 'agencies' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="البحث باسم الوكالة أو معرّف الوكيل..."
                    className="w-full pl-3 pr-9 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                {agenciesList
                  .filter((ag) => 
                    ag.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                    ag.id.includes(searchQuery) ||
                    ag.agentName.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((ag) => (
                    <div key={ag.id} className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-sm font-black text-white">{ag.name}</h4>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            الوكيل المسؤول: <strong className="text-slate-200">{ag.agentName}</strong> (ID: {ag.agentId})
                          </p>
                        </div>
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                          ag.status === 'verified' || ag.status === 'active'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {ag.status === 'verified' || ag.status === 'active' ? 'معتمدة ونشطة ✓' : 'قيد المراجعة ⏳'}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 bg-slate-950 p-2.5 rounded-xl text-center text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 block">المذيعين</span>
                          <span className="font-bold text-white font-mono">{ag.broadcastersCount}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">نسبة العمولة</span>
                          <span className="font-bold text-blue-400 font-mono">{ag.commissionRate}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">تارغت الشهر</span>
                          <span className="font-bold text-amber-400 font-mono">{ag.monthlyTargetDiamonds}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => showToast(`تم تصدير كشف حساب ${ag.name} بنجاح 📄`)}
                          className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>تصدير كشف الحساب</span>
                        </button>
                        <button
                          onClick={() => showToast(`تم إرسال إشعار رسمي للوكيل ${ag.agentName} 📩`)}
                          className="py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>مراسلة الوكيل</span>
                        </button>
                      </div>
                    </div>
                  ))}

                {agenciesList.length === 0 && !isLoadingData && (
                  <div className="text-center py-12 text-slate-400 text-xs font-bold">
                    لا توجد وكالات في Firestore
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 3: Requests */}
          {activeTab === 'requests' && (
            <div className="space-y-3">
              {requestsList.length === 0 ? (
                <div className="text-center py-16 bg-slate-900/60 rounded-2xl border border-dashed border-slate-800">
                  <FileText className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                  <div className="text-xs font-bold text-slate-400">لا توجد طلبات توثيق حالياً</div>
                </div>
              ) : (
                requestsList.map((req) => (
                  <div key={req.id} className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                        <h4 className="text-xs font-black text-white">
                          طلب توثيق وكالة جديدة (GID: {req.id.slice(-5)})
                        </h4>
                      </div>
                      <span className="text-[10px] text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30 font-bold">
                        قيد المراجعة
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">
                      مقدم الطلب: <strong>{req.applicantName}</strong> (ID: {req.applicantId}) — 
                      اسم الوكالة المقترح: <strong>{req.proposedAgencyName}</strong>
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={async () => {
                          try {
                            await updateDoc(doc(db, 'agency_requests', req.id), {
                              status: 'approved',
                              approvedBy: auth.currentUser?.uid || 'admin',
                              approvedAt: serverTimestamp()
                            });
                            showToast(`✅ تمت الموافقة واعتماد الوكالة ${req.proposedAgencyName}`);
                          } catch (e: any) {
                            showToast(`⚠️ فشل: ${e.message}`);
                          }
                        }}
                        className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>اعتماد وتوثيق الوكالة</span>
                      </button>
                      <button
                        onClick={async () => {
                          try {
                            await updateDoc(doc(db, 'agency_requests', req.id), {
                              status: 'rejected',
                              rejectedBy: auth.currentUser?.uid || 'admin',
                              rejectedAt: serverTimestamp()
                            });
                            showToast('❌ تم رفض الطلب');
                          } catch (e: any) {
                            showToast(`⚠️ فشل: ${e.message}`);
                          }
                        }}
                        className="py-2 px-4 bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 text-xs font-bold rounded-xl border border-rose-500/40 transition-all cursor-pointer"
                      >
                        رفض
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Tab 4: Targets & Tiers Management */}
          {activeTab === 'targets' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                      <TrendingUp className="w-5 h-5" />
                    </span>
                    <div>
                      <h4 className="text-sm font-black text-white">جدول تارجتات الوكالات والشروط والأيام (المعتمد على السيرفر)</h4>
                      <p className="text-[11px] text-slate-400">
                        يتم جلب هذه البيانات من السيرفر، وأي تعديل يُرسل لمسار <code className="text-purple-300 font-mono">POST /api/agency-targets-tiers</code> ليحدث مركز المذيعين لحظياً.
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono bg-purple-500/20 text-purple-300 px-2.5 py-1 rounded-full border border-purple-500/30 font-bold">
                    {tiersList.length} مستويات نشطة
                  </span>
                </div>

                {/* Tiers Interactive Table */}
                <div className="overflow-x-auto border border-slate-800 rounded-2xl bg-slate-950">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 font-bold">
                        <th className="py-2.5 px-3">المستوى</th>
                        <th className="py-2.5 px-3">الماس المطلوب 💎</th>
                        <th className="py-2.5 px-3">الأيام المؤهلة 📅</th>
                        <th className="py-2.5 px-3">الساعات المطلوبة ⏳</th>
                        <th className="py-2.5 px-3">الراتب الأساسي ($)</th>
                        <th className="py-2.5 px-3">عمولة الوكالة (%)</th>
                        <th className="py-2.5 px-2 text-center">إجراء</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono font-bold text-slate-200">
                      {tiersList.map((tier, idx) => (
                        <tr key={tier.id || idx} className="hover:bg-slate-900/50 transition-colors">
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={tier.levelName}
                              onChange={(e) => handleTierChange(idx, 'levelName', e.target.value)}
                              className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-center text-amber-300 font-black text-xs"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="number"
                              value={tier.targetDiamonds}
                              step="5000"
                              onChange={(e) => handleTierChange(idx, 'targetDiamonds', Number(e.target.value))}
                              className="w-28 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white font-mono text-xs text-left"
                              dir="ltr"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="number"
                              value={tier.requiredDays}
                              min="1"
                              max="31"
                              onChange={(e) => handleTierChange(idx, 'requiredDays', Number(e.target.value))}
                              className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-blue-300 text-center text-xs"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="number"
                              value={tier.requiredHours}
                              min="1"
                              max="200"
                              onChange={(e) => handleTierChange(idx, 'requiredHours', Number(e.target.value))}
                              className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-cyan-300 text-center text-xs"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="number"
                              value={tier.salaryUsd}
                              min="0"
                              step="5"
                              onChange={(e) => handleTierChange(idx, 'salaryUsd', Number(e.target.value))}
                              className="w-20 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-emerald-400 font-mono text-xs text-left"
                              dir="ltr"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="number"
                              value={tier.agencyCommissionPercent || 10}
                              min="1"
                              max="100"
                              onChange={(e) => handleTierChange(idx, 'agencyCommissionPercent', Number(e.target.value))}
                              className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-purple-300 text-center text-xs"
                            />
                          </td>
                          <td className="py-2 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveTierRow(idx)}
                              className="p-1 text-rose-400 hover:text-rose-200 hover:bg-rose-500/20 rounded-lg transition-colors cursor-pointer"
                              title="حذف هذا المستوى"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Table Bottom Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={handleAddTierRow}
                    className="w-full sm:w-auto px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-emerald-400" />
                    <span>إضافة مستوى تارغت جديد ➕</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveTiers}
                    disabled={isSavingTiers}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-emerald-600 hover:opacity-95 active:scale-95 text-white font-black text-xs shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSavingTiers ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>جاري الحفظ على السيرفر...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>حفظ وتحديث جدول التارجتات في السيرفر المركزي (POST) 🚀</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: Exchange Rate & Controls */}
          {activeTab === 'exchange_control' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      <DollarSign className="w-5 h-5" />
                    </span>
                    <div>
                      <h4 className="text-sm font-black text-white">التحكم المركزي بسعر صرف الألماس والرواتب</h4>
                      <p className="text-[11px] text-slate-400">أي تعديل هنا يتم حفظه مباشرة في السيرفر وتحديث شاشات المذيعين لحظياً</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-500/30 font-bold">
                    نشط على السيرفر
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                  {/* Exchange rate input */}
                  <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                    <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                      <span>سعر الصرف (عدد الماسات لكل 1 دولار):</span>
                      <span className="text-amber-400 font-mono font-black">{exchangeRateInput.toLocaleString()} 💎</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="number"
                        min="100"
                        step="100"
                        value={exchangeRateInput}
                        onChange={(e) => setExchangeRateInput(Number(e.target.value))}
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-hidden focus:border-blue-400 text-left"
                        dir="ltr"
                      />
                      <span className="text-xs font-bold text-slate-400">💎 / $1</span>
                    </div>
                    {/* Quick Presets */}
                    <div className="flex items-center gap-1.5 pt-1">
                      <span className="text-[10px] text-slate-400 font-bold">خيارات سريعة:</span>
                      {[
                        { label: '13,500 (المعتمد)', val: 13500 },
                        { label: '10,000', val: 10000 },
                        { label: '15,000', val: 15000 },
                      ].map((preset) => (
                        <button
                          key={preset.val}
                          type="button"
                          onClick={() => setExchangeRateInput(preset.val)}
                          className={`text-[10px] px-2 py-0.5 rounded-lg border font-bold transition-all cursor-pointer ${
                            exchangeRateInput === preset.val
                              ? 'bg-amber-500/30 border-amber-400 text-amber-200'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Qualified days target */}
                  <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                    <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                      <span>أيام البث المؤهلة (تذكير الأيام):</span>
                      <span className="text-blue-400 font-mono font-black">{qualifiedDaysInput} يوماً</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="number"
                        min="1"
                        max="31"
                        value={qualifiedDaysInput}
                        onChange={(e) => setQualifiedDaysInput(Number(e.target.value))}
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-hidden focus:border-blue-400 text-left"
                        dir="ltr"
                      />
                      <span className="text-xs font-bold text-slate-400">يوماً / شهر</span>
                    </div>
                    <p className="text-[10px] text-slate-400">المعيار المعتمد رسمياً: 15 يوماً مؤهلة</p>
                  </div>
                </div>

                {/* Save Button */}
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleSaveExchangeConfig}
                    disabled={isSavingConfig}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 hover:opacity-95 active:scale-95 text-white font-black text-xs shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSavingConfig ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>جاري الحفظ على السيرفر...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>حفظ وتطبيق التغييرات على السيرفر المركزي 🚀</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Toast Notification */}
        <AnimatePresence>
          {toastMsg && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white font-bold text-xs px-4 py-2 rounded-full shadow-lg border border-white/20 z-50 flex items-center gap-1.5"
            >
              <span>{toastMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
