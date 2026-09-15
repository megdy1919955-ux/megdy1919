import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Zap, 
  RotateCcw, 
  BarChart3, 
  CheckCircle2, 
  Search, 
  Sparkles, 
  DollarSign, 
  AlertCircle,
  Coins,
  ChevronDown
} from 'lucide-react';

interface RechargeAgencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserCoins?: number;
}

interface RechargeHistoryItem {
  id: string;
  recipientName: string;
  recipientId: string;
  recipientAvatar: string;
  badge?: {
    icon: string;
    label?: string;
  };
  coins: number;
  date: string;
  time: string;
  status: 'success';
}

const INITIAL_HISTORY: RechargeHistoryItem[] = [
  {
    id: 'tx-1',
    recipientName: 'أميرة الشوق',
    recipientId: '44882190',
    recipientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    badge: { icon: '💎' },
    coins: 500000,
    date: '2026-09-04',
    time: '14:15',
    status: 'success',
  },
  {
    id: 'tx-2',
    recipientName: 'البرنس محمد',
    recipientId: '99482103',
    recipientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    badge: { icon: '👑' },
    coins: 1000000,
    date: '2026-09-04',
    time: '11:30',
    status: 'success',
  },
  {
    id: 'tx-3',
    recipientName: 'سارة الذهبية',
    recipientId: '10982341',
    recipientAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    badge: { icon: '✨' },
    coins: 750000,
    date: '2026-09-04',
    time: '09:45',
    status: 'success',
  },
  {
    id: 'tx-4',
    recipientName: 'صقر قريش',
    recipientId: '55667788',
    recipientAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    badge: { icon: '🦅' },
    coins: 2000000,
    date: '2026-09-04',
    time: '08:20',
    status: 'success',
  },
];

const CURRENCIES = [
  { id: 'yer', name: 'ريال يمني', symbol: 'ر.ي', flag: '🇾🇪' },
  { id: 'sar', name: 'ريال سعودي', symbol: 'ر.س', flag: '🇸🇦' },
  { id: 'usd', name: 'دولار أمريكي', symbol: '$', flag: '🇺🇸' },
];

export const RechargeAgencyModal: React.FC<RechargeAgencyModalProps> = ({
  isOpen,
  onClose,
  currentUserCoins = 29081000,
}) => {
  // Navigation: 'main' | 'recharge' | 'history' | 'stats'
  const [currentView, setCurrentView] = useState<'main' | 'recharge' | 'history' | 'stats'>('main');

  // Agency balance state
  const [agencyBalance, setAgencyBalance] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('recharge_agency_balance');
      if (saved) {
        const val = parseInt(saved, 10);
        if (!isNaN(val)) return val;
      }
    } catch {}
    return 29081000;
  });

  // History state
  const [history, setHistory] = useState<RechargeHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('recharge_agency_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_HISTORY;
  });

  // Recharge Form State
  const [recipientId, setRecipientId] = useState('');
  const [verifiedUser, setVerifiedUser] = useState<{ id: string; name: string } | null>(null);
  const [coinsToSend, setCoinsToSend] = useState<string>('');
  const [selectedCurrency, setSelectedCurrency] = useState(CURRENCIES[0]);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [paidAmount, setPaidAmount] = useState<string>('');
  const [rechargeSuccessMessage, setRechargeSuccessMessage] = useState<string | null>(null);

  // History Stats Card Carousel Index (0: اليوم, 1: هذا الشهر)
  const [historyCardIndex, setHistoryCardIndex] = useState(0);

  // Save changes
  useEffect(() => {
    localStorage.setItem('recharge_agency_balance', agencyBalance.toString());
  }, [agencyBalance]);

  useEffect(() => {
    localStorage.setItem('recharge_agency_history', JSON.stringify(history));
  }, [history]);

  // Handle Verify ID
  const handleVerifyId = () => {
    const id = recipientId.trim();
    if (!id) return;
    if (id === '9845231') {
      setVerifiedUser({ id: '9845231', name: 'شحن لحسابي' });
    } else {
      setVerifiedUser({ id, name: `مستخدم (${id})` });
    }
  };

  // Quick select coins
  const quickPacks = [16000, 32000, 80000];

  // Numeric parse
  const parsedCoins = parseInt(coinsToSend, 10) || 0;
  const remainingBalance = agencyBalance - parsedCoins;

  // Execute Recharge
  const handleConfirmRecharge = () => {
    if (!recipientId.trim()) {
      alert('يرجى إدخال معرف المستلم (ID)');
      return;
    }
    if (parsedCoins <= 0) {
      alert('يرجى إدخال عدد كوينز صحيح');
      return;
    }
    if (parsedCoins > agencyBalance) {
      alert('عفواً، رصيد الوكالة الحالي لا يكفي لإتمام هذه الشحنة');
      return;
    }

    // Deduct from balance
    const newBal = agencyBalance - parsedCoins;
    setAgencyBalance(newBal);

    // Create history item
    const newItem: RechargeHistoryItem = {
      id: `tx-${Date.now()}`,
      recipientName: verifiedUser ? verifiedUser.name : `مستخدم ${recipientId}`,
      recipientId: recipientId.trim(),
      recipientAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      badge: { icon: '⚡' },
      coins: parsedCoins,
      date: new Date().toISOString().slice(0, 10),
      time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      status: 'success',
    };

    setHistory([newItem, ...history]);
    setRechargeSuccessMessage(`تم شحن ${parsedCoins.toLocaleString()} كوينز إلى ID: ${recipientId} بنجاح!`);
    setCoinsToSend('');
    setPaidAmount('');

    setTimeout(() => {
      setRechargeSuccessMessage(null);
    }, 4000);
  };

  // Daily totals
  const todayTotalCoins = history.reduce((sum, item) => sum + item.coins, 0);
  const todayCount = history.length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs font-sans overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.98 }}
        className="w-full h-full sm:h-[92vh] max-w-lg bg-[#FAFBFC] sm:rounded-[28px] shadow-2xl flex flex-col overflow-hidden text-right border border-amber-400/40 relative"
        dir="rtl"
      >
        {/* ================= HEADER ================= */}
        <div className="bg-white/95 px-5 py-4 border-b border-amber-100 flex items-center justify-between shadow-2xs z-20 shrink-0">
          <div className="flex items-center gap-2.5">
            {currentView !== 'main' ? (
              <button
                onClick={() => setCurrentView('main')}
                className="flex items-center gap-1.5 text-xs font-black text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-full border border-amber-200 transition-all cursor-pointer"
              >
                <span>رجوع للقائمة الرئيسية</span>
                <ChevronLeft className="w-4 h-4 rotate-180" />
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-amber-950 font-black shadow-xs">
                  <Zap className="w-4 h-4 fill-amber-950" />
                </div>
                <h3 className="text-base font-black text-slate-800">وكالة شحن كوينز</h3>
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ================= BODY CONTENT ================= */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
          
          {/* VIEW 1: MAIN DASHBOARD */}
          {currentView === 'main' && (
            <div className="space-y-4">
              {/* TOP BIG BANNER: الرصيد الحالي المتوفر في الوكالة */}
              <div className="bg-white rounded-[24px] p-6 text-center border-[2.5px] border-[#FDB022] shadow-[0_4px_24px_rgba(253,176,34,0.15)] relative overflow-hidden">
                <div className="text-[13px] font-bold text-slate-500 mb-2">
                  الرصيد الحالي المتوفر في الوكالة
                </div>

                <div className="text-3xl sm:text-4xl font-black text-[#E08A00] font-mono tracking-tight flex items-center justify-center gap-2">
                  <span>{agencyBalance.toLocaleString('en-US')}</span>
                  <span className="text-xl sm:text-2xl font-bold font-sans">كوينز</span>
                </div>

                <div className="mt-4 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#F0F5FD] text-[#0A66C2] text-xs font-bold border border-[#D0E2FF]">
                  <span>🪙</span>
                  <span>رصيد كوينز معتمد في خزينة الوكالة</span>
                  <span>🏛️</span>
                </div>
              </div>

              {/* 3 ACTION RECTANGLES / SQUARES GRID */}
              <div className="grid grid-cols-2 gap-3.5 pt-2">
                {/* 1. إعادة شحن */}
                <div
                  onClick={() => setCurrentView('recharge')}
                  className="bg-white rounded-[24px] p-5 border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-md hover:border-amber-200 transition-all cursor-pointer flex flex-col items-center justify-center text-center group"
                >
                  <div className="w-14 h-14 rounded-[20px] bg-[#FFF8E6] border border-[#FDE599] flex items-center justify-center text-[#F59E0B] mb-3 group-hover:scale-110 transition-transform shadow-xs">
                    <Zap className="w-7 h-7 fill-[#F59E0B]" />
                  </div>
                  <h4 className="text-sm font-black text-slate-800 group-hover:text-amber-600 transition-colors">
                    إعادة شحن
                  </h4>
                  <p className="text-[11px] text-slate-400 font-bold mt-1">
                    شحن فوري بالـ ID
                  </p>
                </div>

                {/* 2. سجل التعبئة */}
                <div
                  onClick={() => setCurrentView('history')}
                  className="bg-white rounded-[24px] p-5 border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-md hover:border-amber-200 transition-all cursor-pointer flex flex-col items-center justify-center text-center group"
                >
                  <div className="w-14 h-14 rounded-[20px] bg-[#FFF8E6] border border-[#FDE599] flex items-center justify-center text-[#F59E0B] mb-3 group-hover:scale-110 transition-transform shadow-xs">
                    <RotateCcw className="w-7 h-7 stroke-[2.5]" />
                  </div>
                  <h4 className="text-sm font-black text-slate-800 group-hover:text-amber-600 transition-colors">
                    سجل التعبئة
                  </h4>
                  <p className="text-[11px] text-slate-400 font-bold mt-1">
                    العمليات الناجحة
                  </p>
                </div>

                {/* 3. الإحصائيات (Full width or Col 2) */}
                <div
                  onClick={() => setCurrentView('stats')}
                  className="col-span-1 col-start-2 bg-white rounded-[24px] p-5 border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-md hover:border-amber-200 transition-all cursor-pointer flex flex-col items-center justify-center text-center group"
                >
                  <div className="w-14 h-14 rounded-[20px] bg-[#FFF8E6] border border-[#FDE599] flex items-center justify-center text-[#F59E0B] mb-3 group-hover:scale-110 transition-transform shadow-xs">
                    <BarChart3 className="w-7 h-7 stroke-[2.5]" />
                  </div>
                  <h4 className="text-sm font-black text-slate-800 group-hover:text-amber-600 transition-colors">
                    الإحصائيات
                  </h4>
                  <p className="text-[11px] text-slate-400 font-bold mt-1">
                    حركة ونشاط الوكالة
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: RECHARGE FORM (إعادة شحن للمستخدمين) */}
          {currentView === 'recharge' && (
            <div className="space-y-4">
              {/* Header Title inside card */}
              <div className="flex items-center gap-2 text-amber-700 font-black text-sm px-1">
                <Zap className="w-4 h-4 fill-amber-600 text-amber-600" />
                <span>إعادة شحن للمستخدمين</span>
              </div>

              {rechargeSuccessMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-emerald-800 text-xs font-bold animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{rechargeSuccessMessage}</span>
                </div>
              )}

              <div className="bg-white rounded-[24px] p-4 sm:p-5 border border-slate-100 shadow-sm space-y-4">
                {/* 1. معرف المستلم (ID) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5 text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1">
                      <span>👤</span>
                      <span>معرف المستلم (ID):</span>
                    </span>
                    <button
                      onClick={() => {
                        setRecipientId('9845231');
                        setVerifiedUser({ id: '9845231', name: 'شحن لحسابي' });
                      }}
                      className="text-amber-600 hover:text-amber-700 text-[11px] underline cursor-pointer"
                    >
                      شحن لحسابي (9845231)
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleVerifyId}
                      className="px-4 py-2.5 bg-[#FF9800] hover:bg-[#F57C00] text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-xs transition-all cursor-pointer shrink-0"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>فحص</span>
                    </button>
                    <input
                      type="text"
                      placeholder="أدخل رقم الـ ID (مثال: 82190)"
                      value={recipientId}
                      onChange={(e) => {
                        setRecipientId(e.target.value);
                        setVerifiedUser(null);
                      }}
                      className="flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-mono text-left focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {verifiedUser && (
                    <div className="mt-1.5 text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>المستلم المعتمد: {verifiedUser.name}</span>
                    </div>
                  )}
                </div>

                {/* 2. الكوينزات المراد شحنها إلى العميل */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <span>📤</span>
                      <span>الكوينزات المراد شحنها إلى العميل (المبلغ المرسل):</span>
                    </span>
                    <span className="text-[10px] bg-[#FFF8E6] text-amber-800 px-2 py-0.5 rounded-full border border-amber-200 font-bold flex items-center gap-1">
                      <span>كوينز معتمد</span>
                      <span>🏛️</span>
                    </span>
                  </div>

                  <div className="relative">
                    <input
                      type="number"
                      placeholder="أدخل عدد الكوينزات (مثال: 16000)"
                      value={coinsToSend}
                      onChange={(e) => setCoinsToSend(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-mono text-left focus:outline-none focus:border-amber-400 pl-16"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-amber-600 flex items-center gap-1">
                      <span>🪙</span>
                      <span>كوينز</span>
                    </span>
                  </div>

                  {/* كميات شائعة */}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[11px] text-slate-400 font-bold shrink-0">كميات شائعة:</span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        onClick={() => setCoinsToSend('16000')}
                        className="px-2.5 py-1 rounded-full text-xs font-bold border border-slate-200 hover:border-amber-400 bg-white text-slate-700 flex items-center gap-1 cursor-pointer"
                      >
                        <span>16,000</span>
                        <span className="text-amber-500">★ شائع</span>
                      </button>
                      <button
                        onClick={() => setCoinsToSend('32000')}
                        className="px-2.5 py-1 rounded-full text-xs font-bold border border-slate-200 hover:border-amber-400 bg-white text-slate-700 cursor-pointer"
                      >
                        32,000
                      </button>
                      <button
                        onClick={() => setCoinsToSend('80000')}
                        className="px-2.5 py-1 rounded-full text-xs font-bold border border-slate-200 hover:border-amber-400 bg-white text-slate-700 cursor-pointer"
                      >
                        80,000
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3. نوع العملة والمبلغ المدفوع (قابل للتعديل الحر) */}
                <div>
                  <div className="text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <span>💳</span>
                    <span>نوع العملة والمبلغ المدفوع (قابل للتعديل الحر):</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mb-1.5">
                    اختر العملة وأدخل المبلغ المطلوب
                  </div>

                  <div className="grid grid-cols-2 gap-2 relative">
                    {/* Currency Selector */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 flex items-center justify-between cursor-pointer"
                      >
                        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isCurrencyDropdownOpen ? 'rotate-180' : ''}`} />
                        <div className="flex items-center gap-1.5">
                          <span>{selectedCurrency.name}</span>
                          <span className="text-sm">{selectedCurrency.flag}</span>
                        </div>
                      </button>

                      {/* Dropdown menu */}
                      {isCurrencyDropdownOpen && (
                        <div className="absolute top-full right-0 left-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-30 overflow-hidden py-1">
                          {CURRENCIES.map((curr) => (
                            <button
                              key={curr.id}
                              type="button"
                              onClick={() => {
                                setSelectedCurrency(curr);
                                setIsCurrencyDropdownOpen(false);
                              }}
                              className={`w-full px-3 py-2 text-xs font-bold flex items-center justify-between hover:bg-amber-50 cursor-pointer ${
                                selectedCurrency.id === curr.id ? 'bg-amber-500 text-white hover:bg-amber-600' : 'text-slate-700'
                              }`}
                            >
                              <span className="text-[10px] font-mono">{curr.symbol}</span>
                              <div className="flex items-center gap-1.5">
                                <span>{curr.name}</span>
                                <span>{curr.flag}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Paid Amount Input */}
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="المبلغ المدفوع"
                        value={paidAmount}
                        onChange={(e) => setPaidAmount(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-mono text-left focus:outline-none focus:border-amber-400 pl-10"
                      />
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400 font-mono">
                        {selectedCurrency.symbol}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 4. ملاحظة حركة رصيد الكوينز في وكالتك */}
                <div className="bg-[#F8FAFC] rounded-2xl p-4 border border-slate-100 space-y-2.5 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                    <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-[10px] font-black">
                      !
                    </span>
                    <span>ملاحظة حركة رصيد الكوينز في وكالتك:</span>
                  </div>

                  <div className="flex items-center justify-between font-mono font-bold text-slate-700 pt-1">
                    <span>{agencyBalance.toLocaleString('en-US')} كوينز</span>
                    <span className="font-sans text-slate-500">الرصيد الحالي قبل الخصم:</span>
                  </div>

                  <div className="flex items-center justify-between font-mono font-bold text-rose-600">
                    <span>-{parsedCoins.toLocaleString('en-US')} كوينز</span>
                    <span className="font-sans text-rose-600">الكوينز المخصومة للتعبئة:</span>
                  </div>

                  <div className="flex items-center justify-between font-mono font-bold text-emerald-700 border-t border-slate-200/80 pt-2">
                    <span>{Math.max(0, remainingBalance).toLocaleString('en-US')} كوينز</span>
                    <span className="font-sans text-emerald-800 font-bold">الرصيد المتبقي بعد الخصم:</span>
                  </div>
                </div>

                {/* 5. زر التأكيد الرئيسي */}
                <button
                  onClick={handleConfirmRecharge}
                  className="w-full py-3.5 rounded-2xl bg-[#FF9800] hover:bg-[#F57C00] text-white font-black text-sm shadow-[0_4px_16px_rgba(255,152,0,0.35)] flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99]"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>تأكيد العملية وشحن الرصيد فوراً</span>
                </button>
              </div>
            </div>
          )}

          {/* VIEW 3: HISTORY & STATS (سجل التعبئة / الإحصائيات) */}
          {(currentView === 'history' || currentView === 'stats') && (
            <div className="space-y-4">
              {/* Header Title inside view */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2 text-amber-700 font-black text-sm">
                  <RotateCcw className="w-4 h-4 stroke-[2.5]" />
                  <span>سجل التعبئة (العمليات الناجحة)</span>
                </div>
              </div>

              {/* HORIZONTAL SCROLLABLE / TOGGLEABLE STATS CARDS */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-1">
                  <div className="flex items-center gap-1 text-amber-600">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>إحصائيات العمليات والتعبئة (اسحب لليمين واليسار):</span>
                  </div>

                  {/* Navigation arrows for cards */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setHistoryCardIndex(0)}
                      className={`w-6 h-6 rounded-md flex items-center justify-center border text-xs cursor-pointer ${
                        historyCardIndex === 0 ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-slate-400 border-slate-200'
                      }`}
                    >
                      ‹
                    </button>
                    <button
                      onClick={() => setHistoryCardIndex(1)}
                      className={`w-6 h-6 rounded-md flex items-center justify-center border text-xs cursor-pointer ${
                        historyCardIndex === 1 ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-slate-400 border-slate-200'
                      }`}
                    >
                      ›
                    </button>
                  </div>
                </div>

                {/* Cards Container */}
                {historyCardIndex === 0 ? (
                  /* CARD SET 1: إحصائيات اليوم */
                  <div className="grid grid-cols-2 gap-3 animate-fade-in">
                    {/* إجمالي الكوينزات تعبئة اليوم */}
                    <div className="bg-white rounded-[22px] p-4 border-[2px] border-[#FDB022] shadow-sm flex flex-col justify-between">
                      <div className="text-[11px] font-bold text-slate-600 mb-1">
                        إجمالي الكوينزات تعبئة اليوم
                      </div>
                      <div className="text-xl sm:text-2xl font-black text-[#027A48] font-mono flex items-center gap-1.5 my-1">
                        <span>🪙</span>
                        <span>{todayTotalCoins.toLocaleString('en-US')}</span>
                      </div>
                      <div className="text-[10px] text-[#027A48] font-bold flex items-center gap-1">
                        <span>✓ كوينزات اليوم</span>
                      </div>
                    </div>

                    {/* عدد العمليات لهذا اليوم */}
                    <div className="bg-white rounded-[22px] p-4 border-[2px] border-[#FDB022] shadow-sm flex flex-col justify-between">
                      <div className="text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                        <span>📅</span>
                        <span>عدد العمليات لهذا اليوم</span>
                      </div>
                      <div className="text-2xl sm:text-3xl font-black text-slate-800 font-mono my-1 flex items-baseline gap-1">
                        <span>{todayCount}</span>
                        <span className="text-sm font-sans font-bold">عمليات</span>
                      </div>
                      <div className="text-[10px] text-amber-700 font-bold flex items-center gap-1">
                        <span>✓ معروضة أدناه</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* CARD SET 2: إحصائيات هذا الشهر */
                  <div className="grid grid-cols-2 gap-3 animate-fade-in">
                    {/* إجمالي التعبئة لهذا الشهر */}
                    <div className="bg-white rounded-[22px] p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
                      <div className="text-[11px] font-bold text-slate-600 mb-1">
                        إجمالي التعبئة لهذا الشهر
                      </div>
                      <div className="text-xl sm:text-2xl font-black text-[#027A48] font-mono flex items-center gap-1.5 my-1">
                        <span>🪙</span>
                        <span>9,531,000</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-bold">
                        انقر لعرض الشهر
                      </div>
                    </div>

                    {/* عدد العمليات لهذا الشهر */}
                    <div className="bg-white rounded-[22px] p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
                      <div className="text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                        <span>📈</span>
                        <span>عدد العمليات لهذا الشهر</span>
                      </div>
                      <div className="text-2xl sm:text-3xl font-black text-slate-800 font-mono my-1 flex items-baseline gap-1">
                        <span>12</span>
                        <span className="text-sm font-sans font-bold">عمليات</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-bold">
                        انقر لعرض الشهر
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* TRANSACTIONS SECTION */}
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-1">
                  <div className="flex items-center gap-1.5 text-[#027A48]">
                    <span>إجمالي الشحن اليوم:</span>
                    <span>🪙 {todayTotalCoins.toLocaleString('en-US')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setHistory(INITIAL_HISTORY)}
                      className="px-2 py-0.5 rounded-lg border border-slate-200 text-[10px] text-slate-500 hover:bg-slate-100 cursor-pointer"
                    >
                      عرض الكل ({history.length})
                    </button>
                    <span className="text-slate-800">عمليات اليوم ({history.length} عملية)</span>
                  </div>
                </div>

                {/* Transactions List */}
                <div className="space-y-2.5">
                  {history.map((tx) => (
                    <div
                      key={tx.id}
                      className="bg-white rounded-[22px] p-3.5 border border-slate-100 shadow-2xs flex items-center justify-between hover:shadow-xs transition-all"
                    >
                      {/* Coins amount on the Left */}
                      <div className="text-left flex flex-col items-start gap-1">
                        <div className="text-sm sm:text-base font-black text-[#027A48] font-mono flex items-center gap-1">
                          <span>🪙</span>
                          <span>{tx.coins.toLocaleString('en-US')}+</span>
                        </div>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9.5px] font-bold bg-[#ECFDF3] text-[#027A48] border border-[#A6F4C5]">
                          <span>✓</span>
                          <span>حالة العملية: ناجحة</span>
                        </span>
                      </div>

                      {/* User Info on the Right */}
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {tx.badge && <span className="text-xs">{tx.badge.icon}</span>}
                            <span className="text-xs font-black text-slate-800">{tx.recipientName}</span>
                          </div>
                          <div className="text-[11px] font-bold text-[#E08A00] font-mono mt-0.5">
                            ID: {tx.recipientId}
                          </div>
                          <div className="text-[9.5px] text-slate-400 font-mono mt-0.5">
                            {tx.date} • {tx.time}
                          </div>
                        </div>

                        <img
                          src={tx.recipientAvatar}
                          alt={tx.recipientName}
                          referrerPolicy="no-referrer"
                          className="w-11 h-11 rounded-full object-cover border-2 border-amber-300 shadow-2xs shrink-0"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
};
