import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Coins, Gem, Check, Copy, User, AlertCircle, ShieldCheck } from 'lucide-react';
import { WalletService } from '../lib/walletService';

interface RechargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
  userName?: string;
  currentCoins?: number;
  currentDiamonds?: number;
  onContactSupport?: () => void;
  onRechargeSuccess?: (added: number) => void;
}

export const RechargeModal: React.FC<RechargeModalProps> = ({
  isOpen,
  onClose,
  userId = '1001001',
  userName = 'عابر سبيل',
  currentCoins = 0,
  currentDiamonds = 0,
  onContactSupport
}) => {
  const [copiedId, setCopiedId] = useState(false);
  const [liveCoins, setLiveCoins] = useState(currentCoins);
  const [liveDiamonds, setLiveDiamonds] = useState(currentDiamonds);

  // تحديث الأرصدة الحية مباشرة من Firestore
  useEffect(() => {
    setLiveCoins(currentCoins);
  }, [currentCoins]);

  useEffect(() => {
    setLiveDiamonds(currentDiamonds);
  }, [currentDiamonds]);

  useEffect(() => {
    if (!isOpen || !userId) return;
    const unsub = WalletService.subscribeToUserWallet(userId, (w) => {
      if (typeof w.coins === 'number') setLiveCoins(w.coins);
      if (typeof w.diamonds === 'number') setLiveDiamonds(w.diamonds);
    });
    return () => unsub();
  }, [isOpen, userId]);

  if (!isOpen) return null;

  const handleCopyId = () => {
    navigator.clipboard?.writeText(userId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-xs" dir="rtl">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col relative"
        >
          {/* Header Bar */}
          <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 p-4 text-slate-950 flex items-center justify-between shrink-0 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-slate-950 text-amber-300 flex items-center justify-center border border-amber-200/50 shadow-sm">
                <Coins className="w-6 h-6 fill-amber-300" />
              </div>
              <div>
                <h2 className="text-base font-black">محفظة الرصيد</h2>
                <p className="text-[11px] font-bold text-slate-900/80">الرصيد الفعلي المعتمد في السحابة</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-slate-950/20 hover:bg-slate-950/30 text-slate-950 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Body */}
          <div className="p-4 space-y-4 overflow-y-auto flex-1 no-scrollbar">
            {/* Current Balance Showcase (Live Real-Time from Firebase) */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* Coins Balance */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-100/70 border border-amber-200/80 shadow-xs">
                <div className="flex items-center gap-1.5 text-amber-900 text-xs font-black mb-1">
                  <Coins className="w-4 h-4 text-amber-600 fill-amber-500" />
                  <span>رصيد الكوينز الحالي</span>
                </div>
                <div className="text-2xl font-black font-mono text-amber-700 tracking-tight">
                  {liveCoins.toLocaleString('en-US')}
                </div>
                <span className="text-[10px] text-amber-800/80 font-bold block mt-0.5">معتمد ومحمي سحابياً</span>
              </div>

              {/* Diamonds Balance */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-sky-50 to-indigo-100/70 border border-sky-200/80 shadow-xs">
                <div className="flex items-center gap-1.5 text-sky-900 text-xs font-black mb-1">
                  <Gem className="w-4 h-4 text-sky-600 fill-sky-500" />
                  <span>رصيد الألماس الحالي</span>
                </div>
                <div className="text-2xl font-black font-mono text-sky-700 tracking-tight">
                  {liveDiamonds.toLocaleString('en-US')}
                </div>
                <span className="text-[10px] text-sky-800/80 font-bold block mt-0.5">أرباح ودعم المضيفين</span>
              </div>
            </div>

            {/* Simple Insufficient Balance Notice if Coins <= 0 */}
            {liveCoins <= 0 && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200/80 flex items-center justify-center gap-2 text-rose-700 text-xs font-bold text-center">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>عذراً، لا يتوفر لديك رصيد كافٍ حالياً.</span>
              </div>
            )}

            {/* User ID Box */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-md">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-slate-300">معرف الحساب (ID):</span>
                </div>
                <button
                  onClick={handleCopyId}
                  className="flex items-center gap-1 text-[11px] font-black bg-amber-400 hover:bg-amber-300 text-slate-950 px-2.5 py-1 rounded-xl transition-all cursor-pointer shadow-xs"
                >
                  {copiedId ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-slate-950" />
                      <span>تم النسخ!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>نسخ الـ ID</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-slate-950/80 border border-amber-400/40 rounded-xl p-3 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">{userName}</span>
                <span className="font-mono text-lg font-black text-amber-300 tracking-wider">
                  {userId}
                </span>
              </div>
            </div>

            {/* Security Guarantee Note */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center gap-2 text-[11px] font-medium text-slate-600">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>الرصيد متزامن لحظياً وبأعلى معايير الأمان مع قاعدة بيانات Firebase.</span>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-slate-900 text-white font-black text-xs hover:bg-slate-800 cursor-pointer transition-all shadow-sm"
            >
              إغلاق النافذة
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default RechargeModal;
