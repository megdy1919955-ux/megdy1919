import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Coins, Gem, Check, CreditCard, Smartphone, Sparkles, Zap, ShieldCheck, RefreshCw } from 'lucide-react';

interface RechargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessRecharge: (coinsAdded: number) => void;
}

export const RechargeModal: React.FC<RechargeModalProps> = ({
  isOpen,
  onClose,
  onSuccessRecharge,
}) => {
  const [activeTab, setActiveTab] = useState<'buy_coins' | 'exchange_diamonds'>('buy_coins');
  const [selectedPackage, setSelectedPackage] = useState<string>('pkg_2');
  const [selectedPayment, setSelectedPayment] = useState<string>('mada');
  const [diamondsToExchange, setDiamondsToExchange] = useState<number>(1000);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showToast, setShowToast] = useState(false);

  if (!isOpen) return null;

  const coinPackages = [
    { id: 'pkg_1', coins: 1000, bonus: 0, priceSAR: '3.75 ر.س', priceUSD: '$0.99', popular: false },
    { id: 'pkg_2', coins: 5000, bonus: 500, priceSAR: '18.75 ر.س', priceUSD: '$4.99', popular: true, tag: 'الأكثر مبيعاً 🔥' },
    { id: 'pkg_3', coins: 20000, bonus: 3500, priceSAR: '74.99 ر.س', priceUSD: '$19.99', popular: false, tag: '+18% بونص' },
    { id: 'pkg_4', coins: 50000, bonus: 12000, priceSAR: '187.50 ر.س', priceUSD: '$49.99', popular: false, tag: 'عرض ملكي 👑' },
    { id: 'pkg_5', coins: 150000, bonus: 45000, priceSAR: '562.50 ر.س', priceUSD: '$149.99', popular: false, tag: 'بونص ضخم x2' },
  ];

  const paymentMethods = [
    { id: 'mada', name: 'مدى mada', icon: '💳', bg: 'bg-emerald-50 border-emerald-200' },
    { id: 'apple', name: 'Apple Pay', icon: '🍎', bg: 'bg-slate-900 text-white border-slate-800' },
    { id: 'stc', name: 'STC Pay', icon: '📱', bg: 'bg-purple-50 border-purple-200' },
    { id: 'card', name: 'بطاقة ائتمان', icon: '💳', bg: 'bg-blue-50 border-blue-200' },
  ];

  const handleConfirmRecharge = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const pkg = coinPackages.find((p) => p.id === selectedPackage);
      const totalCoins = pkg ? pkg.coins + pkg.bonus : 5000;
      onSuccessRecharge(totalCoins);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        onClose();
      }, 1500);
    }, 1200);
  };

  const handleExchangeDiamonds = () => {
    if (diamondsToExchange <= 0) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      // 1 Diamond = 2 Coins exchange rate
      const coinsReceived = diamondsToExchange * 2;
      onSuccessRecharge(coinsReceived);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        onClose();
      }, 1500);
    }, 1000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-xs" dir="rtl">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col relative"
        >
          {/* Header Bar */}
          <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 p-4 text-slate-950 flex items-center justify-between shrink-0 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-slate-950 text-amber-300 flex items-center justify-center border border-amber-200/50 shadow-sm">
                <Coins className="w-6 h-6 fill-amber-300" />
              </div>
              <div>
                <h2 className="text-base font-black">مركز الشحن وتزويد الكوينز</h2>
                <p className="text-[11px] font-bold text-slate-900/80">شحن آمن وفوري لحسابك الملكي</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-slate-950/20 hover:bg-slate-950/30 text-slate-950 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center p-2 bg-slate-100 border-b border-slate-200 shrink-0">
            <button
              onClick={() => setActiveTab('buy_coins')}
              className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'buy_coins'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Coins className="w-4 h-4 text-amber-500" />
              <span>شحن باقات الكوينز</span>
            </button>
            <button
              onClick={() => setActiveTab('exchange_diamonds')}
              className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'exchange_diamonds'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <RefreshCw className="w-4 h-4 text-sky-500" />
              <span>تحويل الألماس لكوينز</span>
            </button>
          </div>

          {/* Toast Banner inside Modal */}
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-emerald-500 text-white text-center text-xs font-black flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>تمت عملية الشحن بنجاح وإضافة الكوينز لحسابك! 🎉</span>
            </motion.div>
          )}

          {/* Main Scrollable Body */}
          <div className="p-4 space-y-4 overflow-y-auto flex-1 no-scrollbar">
            {activeTab === 'buy_coins' ? (
              <>
                {/* Packages Selection */}
                <div>
                  <label className="text-xs font-black text-slate-800 block mb-2 flex items-center justify-between">
                    <span>اختر باقة الكوينز المناسبة:</span>
                    <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      توصيل فوري ⚡
                    </span>
                  </label>

                  <div className="space-y-2">
                    {coinPackages.map((pkg) => {
                      const isSelected = selectedPackage === pkg.id;
                      return (
                        <div
                          key={pkg.id}
                          onClick={() => setSelectedPackage(pkg.id)}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-400/30 shadow-xs'
                              : 'bg-white border-slate-200/80 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200">
                              <Coins className="w-6 h-6 fill-amber-500 text-amber-500" />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-sm font-black text-slate-900 font-mono">
                                  {pkg.coins.toLocaleString('ar-SA')} كوينز
                                </span>
                                {pkg.tag && (
                                  <span className="text-[9px] font-extrabold bg-rose-500 text-white px-1.5 py-0.2 rounded-md">
                                    {pkg.tag}
                                  </span>
                                )}
                              </div>
                              {pkg.bonus > 0 && (
                                <div className="text-[11px] text-emerald-600 font-bold mt-0.5">
                                  + {pkg.bonus.toLocaleString('ar-SA')} كوينز مجاناً كهدية!
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="text-left shrink-0">
                            <div className="text-xs font-black text-slate-900 font-mono">{pkg.priceSAR}</div>
                            <div className="text-[10px] text-slate-400 font-medium">{pkg.priceUSD}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Payment Methods */}
                <div>
                  <label className="text-xs font-black text-slate-800 block mb-2">طريقة الدفع:</label>
                  <div className="grid grid-cols-2 gap-2">
                    {paymentMethods.map((pm) => (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => setSelectedPayment(pm.id)}
                        className={`p-2.5 rounded-xl border text-right transition-all cursor-pointer flex items-center gap-2 ${
                          selectedPayment === pm.id
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs ring-2 ring-slate-800'
                            : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <span className="text-lg">{pm.icon}</span>
                        <span className="text-xs font-black">{pm.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Guarantee Security Note */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center gap-2 text-[11px] font-medium text-slate-600">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>معاملة مشفرة وآمنة 100% مدعومة ببوابات الدفع الرسمية.</span>
                </div>

                <button
                  onClick={handleConfirmRecharge}
                  disabled={isProcessing}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black text-sm shadow-md hover:opacity-95 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <span>جاري معالجة الشحن...</span>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 fill-slate-950" />
                      <span>تأكيد الشحن الفوري الآن</span>
                    </>
                  )}
                </button>
              </>
            ) : (
              /* Exchange Diamonds Tab */
              <div className="space-y-4 pt-1">
                <div className="p-4 bg-gradient-to-r from-sky-500 to-indigo-600 rounded-2xl text-white shadow-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-sky-100">رصيد الألماس المتوفر:</span>
                    <span className="text-sm font-black font-mono bg-white/20 px-2.5 py-0.5 rounded-full border border-white/20">
                      8,377 ألماس 💎
                    </span>
                  </div>
                  <p className="text-[11px] text-sky-100">سعر الصرف: 1 ألماس = 2 كوينز</p>
                </div>

                <div>
                  <label className="text-xs font-black text-slate-800 block mb-1.5">عدد الألماس للتحويل:</label>
                  <input
                    type="number"
                    value={diamondsToExchange}
                    onChange={(e) => setDiamondsToExchange(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-center space-y-1">
                  <span className="text-xs text-amber-900/70 font-bold block">ستحصل على:</span>
                  <div className="text-2xl font-black text-amber-600 font-mono">
                    {(diamondsToExchange * 2).toLocaleString('ar-SA')} كوينز ✨
                  </div>
                </div>

                <button
                  onClick={handleExchangeDiamonds}
                  disabled={isProcessing || diamondsToExchange <= 0}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-black text-sm shadow-md hover:opacity-95 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? 'جاري التحويل...' : 'تأكيد تحويل الألماس'}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
