import React, { useState, useEffect, useRef, Suspense } from 'react';
import { 
  X, ChevronRight, Search, 
  Sparkles, RefreshCw
} from 'lucide-react';
import { PullToRefreshIndicator } from '../PullToRefreshIndicator';
import { motion, AnimatePresence } from 'motion/react';
import { 
  getBroadcastersCount, 
  getBroadcastersList, 
  getAgencyInvitations, 
  subscribeToAgencyInvitations, 
  sendNewInvitation,
  BroadcasterMember,
  AgencyInvitation
} from '../../lib/agencyInvitationService';
import {
  MyAgencyView,
  RecordsView,
  ChangeAgencyView,
  TransferRequestView,
  TransferHistoryView,
  TransferFaqView,
  SupportersView,
  EarningsDetailsView,
  WalletView
} from './SubViews';
import { MainView } from './MainView';
import { fetchBroadcasterServerStats, HostServerStats } from '../../lib/serverRewardsService';

export interface BroadcasterCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  direction?: 'rtl' | 'ltr';
  userName?: string;
  userAvatar?: string;
  userId?: string;
  agencyGid?: string;
}

export type SubViewType = 
  | 'main' 
  | 'my_agency' 
  | 'records' 
  | 'wallet' 
  | 'change_agency' 
  | 'transfer_request'
  | 'transfer_history'
  | 'transfer_faq'
  | 'supporters' 
  | 'new_users' 
  | 'new_users_rules'
  | 'earnings_details' 
  | 'contracts' 
  | 'my_broadcasters' 
  | 'invite' 
  | 'invite_history';

export const BroadcasterCenterModal: React.FC<BroadcasterCenterModalProps> = ({
  isOpen,
  onClose,
  direction = 'rtl',
  userName = 'أبو مجد(M✈️)',
  userAvatar = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
  userId = '82639599',
  agencyGid = 'AG-101'
}) => {
  const [currentSubView, setCurrentSubView] = useState<SubViewType>('main');
  const [searchTerm, setSearchTerm] = useState('');
  const [inviteId, setInviteId] = useState('');
  const [inviteMessage, setInviteMessage] = useState('يسرنا دعوتك للانضمام كمذيع رسمي في فريقنا.');
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);
  const [activeAlert, setActiveAlert] = useState<string | null>(null);

  const [broadcasterCount, setBroadcasterCount] = useState(getBroadcastersCount());
  const [broadcastersList, setBroadcastersList] = useState<BroadcasterMember[]>(getBroadcastersList());
  const [, setInvitationsList] = useState<AgencyInvitation[]>(getAgencyInvitations());

  // حالة إحصائيات المضيف المحسوبة والمدفوعة من السيرفر المركزي
  const [hostStats, setHostStats] = useState<HostServerStats>({
    userId,
    userName,
    diamondsEarned: 0,
    exchangeRateDiamondsPerUsd: 13500,
    earningsUsd: 0,
    qualifiedDays: 0,
    qualifiedDaysTarget: 15,
    streamHours: 0,
    streamHoursTarget: 30,
    monthlySalaryTargetUsd: 0,
    bestAchievementDiamonds: 0,
    hostLevel: 'LV.0',
    nextLevelTargetUsd: 0,
    neededDiamondsForNextLevel: 10000,
    isLive: false,
    updatedAt: Date.now()
  });

  // Pull-to-refresh state
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshSuccess, setRefreshSuccess] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const isPulling = useRef(false);

  // تحديث فوري ولحظي لكافة بيانات المذيع من السيرفر المركزي
  const refreshFromServer = async () => {
    try {
      const stats = await fetchBroadcasterServerStats(userId);
      if (stats) {
        setHostStats(stats);
      }
      setBroadcasterCount(getBroadcastersCount());
      setBroadcastersList(getBroadcastersList());
      setInvitationsList(getAgencyInvitations());
    } catch (err) {
      console.warn('Error refreshing broadcaster center data:', err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      refreshFromServer();
    }
  }, [isOpen, userId]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    setPullDistance(50);
    await refreshFromServer();
    setRefreshSuccess(true);
    setTimeout(() => {
      setRefreshSuccess(false);
      setPullDistance(0);
      setIsRefreshing(false);
    }, 700);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (containerRef.current && containerRef.current.scrollTop <= 2) {
      touchStartY.current = e.touches[0].clientY;
      isPulling.current = true;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPulling.current || isRefreshing) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - touchStartY.current;
    if (diff > 0 && containerRef.current && containerRef.current.scrollTop <= 2) {
      const distance = Math.min(85, diff * 0.45);
      setPullDistance(distance);
    } else {
      setPullDistance(0);
    }
  };

  const handleTouchEnd = async () => {
    if (!isPulling.current) return;
    isPulling.current = false;
    if (pullDistance > 45 && !isRefreshing) {
      setIsRefreshing(true);
      setPullDistance(55);
      await refreshFromServer();
      setRefreshSuccess(true);
      setTimeout(() => {
        setRefreshSuccess(false);
        setPullDistance(0);
        setIsRefreshing(false);
      }, 700);
    } else {
      setPullDistance(0);
    }
  };

  useEffect(() => {
    let isCurrent = true;
    const syncHostStats = async () => {
      const stats = await fetchBroadcasterServerStats(userId);
      if (isCurrent && stats) {
        setHostStats(stats);
      }
    };
    syncHostStats();

    const handleStatsUpdated = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.hostStats) {
        setHostStats((prev) => ({
          ...prev,
          ...customEvent.detail.hostStats
        }));
      }
    };

    window.addEventListener('broadcaster_stats_updated', handleStatsUpdated);
    window.addEventListener('user_diamonds_updated', syncHostStats);
    window.addEventListener('dashboard_config_updated', syncHostStats);
    window.addEventListener('agency_targets_tiers_updated', syncHostStats);

    return () => {
      isCurrent = false;
      window.removeEventListener('broadcaster_stats_updated', handleStatsUpdated);
      window.removeEventListener('user_diamonds_updated', syncHostStats);
      window.removeEventListener('dashboard_config_updated', syncHostStats);
      window.removeEventListener('agency_targets_tiers_updated', syncHostStats);
    };
  }, [userId]);

  useEffect(() => {
    const updateData = () => {
      setBroadcasterCount(getBroadcastersCount());
      setBroadcastersList(getBroadcastersList());
      setInvitationsList(getAgencyInvitations());
    };
    updateData();
    const unsub = subscribeToAgencyInvitations(updateData);
    return unsub;
  }, []);

  if (!isOpen) return null;

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteId.trim()) return;

    sendNewInvitation({
      hostId: inviteId.trim(),
      inviterType: 'agency',
      message: inviteMessage,
      agencyGid: agencyGid || 'AG-101',
      agencyName: userName
    });

    setInviteSuccess(`تم إرسال الدعوة وشروط الانضمام بنجاح إلى المذيع (ID: ${inviteId.trim()}).`);
    setInviteId('');
    setTimeout(() => {
      setInviteSuccess(null);
    }, 4000);
  };

  const showAlert = (msg: string) => {
    setActiveAlert(msg);
    setTimeout(() => setActiveAlert(null), 3000);
  };

  const getSubViewTitle = () => {
    switch (currentSubView) {
      case 'main': return 'مركز المذيعين';
      case 'my_agency': return 'وكالتي';
      case 'records': return 'سجل البث';
      case 'wallet': return 'محفظتي';
      case 'change_agency': return 'تغيير الوكالة';
      case 'transfer_request': return 'طلب التحويل';
      case 'transfer_history': return 'سجل التحويل';
      case 'transfer_faq': return 'تعليقات على التحويل';
      case 'supporters': return 'داعمي';
      case 'earnings_details': return 'قسيمة الراتب';
      case 'my_broadcasters': return `المذيع الخاص بي (${broadcasterCount})`;
      case 'invite': return 'دعوة المذيعين';
      case 'invite_history': return 'سجل الدعوات';
      default: return 'مركز المذيعين';
    }
  };

  const handleBackNavigation = () => {
    if (['transfer_request', 'transfer_history', 'transfer_faq'].includes(currentSubView)) {
      setCurrentSubView('change_agency');
    } else {
      setCurrentSubView('main');
    }
  };

  return (
    <div 
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="fixed inset-0 z-[100] w-full h-full min-h-screen bg-gradient-to-b from-[#FFFFFF] via-[#F8FAFC] to-[#EDF2F7] flex flex-col overflow-y-auto select-none font-sans"
      dir="rtl"
    >
      {/* Toast Alert */}
      <AnimatePresence>
        {activeAlert && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-14 left-1/2 -translate-x-1/2 z-[110] bg-slate-900 text-white px-5 py-2.5 rounded-full text-xs font-black shadow-[0_10px_30px_rgba(0,0,0,0.25)] border border-slate-700 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-slate-300 animate-pulse" />
            <span>{activeAlert}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Header Bar (Frosted White & Dark White) */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl px-4 py-3 flex items-center justify-between border-b border-slate-200 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        {/* Left Side: Back Button */}
        <div className="flex items-center gap-2">
          {currentSubView !== 'main' ? (
            <button 
              onClick={handleBackNavigation}
              className="p-1.5 hover:bg-slate-100 active:scale-95 rounded-full text-slate-800 transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
            >
              <ChevronRight className="w-5 h-5" />
              <span>رجوع</span>
            </button>
          ) : (
            <div className="w-6" />
          )}
        </div>

        {/* Title */}
        <div className="flex items-center gap-2">
          <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight font-serif">
            {getSubViewTitle()}
          </h1>
        </div>

        {/* Actions: Refresh & Close Buttons */}
        <div className="flex items-center gap-1.5">
          <button 
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="p-1.5 hover:bg-slate-100 active:scale-95 rounded-full text-slate-500 hover:text-slate-900 transition-all cursor-pointer"
            title="تحديث البيانات اللحظية من السيرفر"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-amber-500' : ''}`} />
          </button>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 active:scale-95 rounded-full text-slate-400 hover:text-slate-900 transition-all cursor-pointer"
            title="إغلاق"
          >
            <X className="w-5 h-5 stroke-[2.4]" />
          </button>
        </div>
      </div>

      {/* Pull to refresh visual indicator */}
      <PullToRefreshIndicator 
        pullDistance={pullDistance}
        isRefreshing={isRefreshing}
        refreshSuccess={refreshSuccess}
      />

      <Suspense fallback={
        <div className="w-full flex-1 flex items-center justify-center py-20 text-slate-400">
          <RefreshCw className="w-6 h-6 animate-spin text-slate-500" />
        </div>
      }>
        {/* Main View */}
        {currentSubView === 'main' && (
          <MainView 
            userName={userName}
            userAvatar={userAvatar}
            userId={userId}
            hostStats={hostStats}
            onNavigate={setCurrentSubView}
            showAlert={showAlert}
          />
        )}

        {/* SUB-VIEWS IMPLEMENTATIONS */}

        {/* 1. وكالتي */}
        {currentSubView === 'my_agency' && (
          <MyAgencyView 
            onNavigate={setCurrentSubView} 
            showAlert={showAlert} 
            agencyGid={agencyGid}
            agencyName={userName}
            currentUserId={userId}
            currentUserName={userName}
          />
        )}

        {/* 2. سجلات البث المباشر */}
        {currentSubView === 'records' && (
          <RecordsView 
            onNavigate={setCurrentSubView} 
            showAlert={showAlert} 
            currentUserId={userId}
            currentUserName={userName}
            currentUserAvatar={userAvatar}
            hostStats={hostStats}
          />
        )}

        {/* 3. محفظتي */}
        {currentSubView === 'wallet' && (
          <WalletView 
            onNavigate={setCurrentSubView} 
            showAlert={showAlert} 
            hostStats={hostStats}
            currentUserId={userId}
            currentUserName={userName}
          />
        )}

        {/* 4. تغيير الوكالة */}
        {currentSubView === 'change_agency' && (
          <ChangeAgencyView onNavigate={setCurrentSubView} showAlert={showAlert} />
        )}

        {/* 4.1 طلب التحويل */}
        {currentSubView === 'transfer_request' && (
          <TransferRequestView 
            onNavigate={setCurrentSubView} 
            showAlert={showAlert}
            currentUserId={userId}
            currentUserName={userName}
            currentUserAvatar={userAvatar}
            agencyGid={agencyGid}
            agencyName={userName}
            hostStats={hostStats}
          />
        )}

        {/* 4.2 سجل التحويل */}
        {currentSubView === 'transfer_history' && (
          <TransferHistoryView 
            onNavigate={setCurrentSubView} 
            showAlert={showAlert}
            currentUserId={userId}
            currentUserName={userName}
            currentUserAvatar={userAvatar}
            agencyGid={agencyGid}
          />
        )}

        {/* 4.3 تعليقات على التحويل */}
        {currentSubView === 'transfer_faq' && (
          <TransferFaqView onNavigate={setCurrentSubView} showAlert={showAlert} />
        )}

        {/* 5. داعمي */}
        {currentSubView === 'supporters' && (
          <SupportersView 
            onNavigate={setCurrentSubView} 
            showAlert={showAlert} 
            currentUserId={userId}
            currentUserName={userName}
          />
        )}

        {/* 7. Download the invoice / تفاصيل الأرباح / قسيمة الراتب */}
        {currentSubView === 'earnings_details' && (
          <EarningsDetailsView 
            onNavigate={setCurrentSubView} 
            showAlert={showAlert} 
            hostStats={hostStats}
            currentUserId={userId}
            currentUserName={userName}
          />
        )}

        {/* Sub-view: My Broadcasters list (for agency leader view) */}
        {currentSubView === 'my_broadcasters' && (
          <div className="w-full max-w-md mx-auto p-4 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute top-3.5 right-3.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="البحث باسم المذيع أو ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:border-slate-400 shadow-2xs"
              />
            </div>

            <div className="space-y-2.5">
              {broadcastersList.filter(b => b.name.includes(searchTerm) || b.id.includes(searchTerm)).map((host) => (
                <div key={host.id} className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                  <div className="text-left space-y-0.5">
                    <div className="font-mono font-black text-xs text-slate-900">{host.diamonds} 💎</div>
                    <div className="text-[10px] text-slate-500 font-bold">{host.days} يوم / {host.hours}</div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="text-right">
                      <div className="text-xs font-black text-slate-900 flex items-center justify-end gap-1">
                        {host.name}
                        {host.role && (
                          <span className="text-[9px] bg-slate-100 text-slate-700 border border-slate-300 px-1.5 py-0.5 rounded font-bold">
                            {host.role === 'broker' ? 'وسيط' : 'مذيع'}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] font-mono text-slate-500">ID:{host.id}</div>
                    </div>
                    <img src={host.avatar} alt={host.name} className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-xs" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sub-view: Invite */}
        {currentSubView === 'invite' && (
          <div className="w-full max-w-md mx-auto p-4 space-y-4">
            <form onSubmit={handleSendInvite} className="bg-white rounded-3xl p-5 border border-slate-200 space-y-4 shadow-xs">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 text-white flex items-center justify-center mx-auto text-xl font-bold shadow-sm">
                  🎙️
                </div>
                <h3 className="text-sm font-black text-slate-900 font-serif">دعوة مذيع بالـ ID</h3>
                <p className="text-xs text-slate-500 font-medium">أدخل معرّف المذيع لإرسال رسالة دعوة وشروط الانضمام الرسمية إلى رسائله</p>
              </div>

              {inviteSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-2xl text-center animate-fade-in leading-relaxed">
                  {inviteSuccess}
                </div>
              )}

              <div className="space-y-1.5 text-right">
                <label className="text-xs font-bold text-slate-700 block">
                  معرّف المذيع (ID):
                </label>
                <input 
                  type="text" 
                  placeholder="مثال: 81156183"
                  value={inviteId}
                  onChange={(e) => setInviteId(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-slate-400 focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-1.5 text-right">
                <label className="text-xs font-bold text-slate-700 block">
                  نص رسالة الدعوة:
                </label>
                <textarea 
                  rows={3}
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 focus:outline-none focus:border-slate-400 focus:bg-white resize-none"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] text-slate-600 text-right leading-relaxed font-medium">
                ℹ️ عند الإرسال، ستصل رسالة رسمية للوكالة ورسالة من الوكيل مع نموذج بنود وشروط التعاقد التي يوافق عليها المضيف للانضمام للوكالة.
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 active:scale-98 text-white font-black text-xs rounded-2xl shadow-sm transition-all cursor-pointer border border-slate-700"
              >
                إرسال الدعوة للمذيع
              </button>
            </form>
          </div>
        )}
      </Suspense>

    </div>
  );
};

export default BroadcasterCenterModal;
