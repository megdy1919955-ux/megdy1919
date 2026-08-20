import React, { useState } from 'react';
import { X, Sparkles, Check, Wallet, ShieldCheck, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { RECHARGE_PACKAGES } from '../data/mockData';
import { RechargePackage, User } from '../types';
import { soundEffects } from '../lib/soundEffects';

interface RechargeModalProps {
  currentUser: User;
  onClose: () => void;
  onSuccessRecharge: (coinsAdded: number) => void;
}

export const RechargeModal: React.FC<RechargeModalProps> = ({
  currentUser,
  onClose,
  onSuccessRecharge
}) => {
  const [selectedPkg, setSelectedPkg] = useState<RechargePackage>(RECHARGE_PACKAGES[1]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleConfirmRecharge = () => {
    setIsProcessing(true);
    soundEffects.playDiceRoll();

    setTimeout(() => {
      setIsProcessing(false);
      const totalCoins = selectedPkg.coins + selectedPkg.bonusCoins;
      onSuccessRecharge(totalCoins);
      setSuccessMsg(`تم شحن ${totalCoins.toLocaleString()} كوينز بنجاح! 🎉`);
      soundEffects.playVictoryFanfare();

      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#eab308', '#ca8a04', '#facc15', '#ffffff']
      });

      setTimeout(() => {
        onClose();
      }, 1800);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg p-5 text-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              🪙
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">متجر شحن كوينز سوبر ليجند</h3>
              <p className="text-[11px] text-slate-400">عروض مضاعفة وهدايا ذهبية فورية</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Balance Banner */}
        <div className="my-3.5 p-3 rounded-2xl bg-gradient-to-r from-amber-950/60 via-slate-950 to-slate-950 border border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-slate-300">رصيدك الحالي:</span>
          </div>
          <span className="text-sm font-black text-amber-400 font-mono">
            {currentUser.coins.toLocaleString()} 🪙
          </span>
        </div>

        {/* Package Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto p-1">
          {RECHARGE_PACKAGES.map((pkg) => {
            const isSelected = selectedPkg.id === pkg.id;
            return (
              <div
                key={pkg.id}
                onClick={() => setSelectedPkg(pkg)}
                className={`relative p-3 rounded-2xl border cursor-pointer transition transform active:scale-95 flex flex-col justify-between ${
                  isSelected
                    ? 'border-amber-400 bg-amber-500/10 shadow-lg shadow-amber-500/10'
                    : 'border-slate-800 bg-slate-950/70 hover:border-slate-700'
                }`}
              >
                {pkg.discountBadge && (
                  <span className="absolute -top-2 left-2 bg-gradient-to-r from-rose-600 to-amber-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                    {pkg.discountBadge}
                  </span>
                )}

                <div>
                  <div className="flex items-center gap-1 text-sm font-extrabold text-amber-400 font-mono">
                    <span>🪙</span> {pkg.coins.toLocaleString()}
                  </div>
                  {pkg.bonusCoins > 0 && (
                    <div className="text-[10px] text-emerald-400 font-bold mt-0.5">
                      +{pkg.bonusCoins.toLocaleString()} بونص مجاني
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-black text-white">${pkg.priceUSD}</span>
                  {isSelected && <Check className="w-4 h-4 text-amber-400 stroke-[3]" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="mt-3 p-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center rounded-xl animate-bounce">
            {successMsg}
          </div>
        )}

        {/* Checkout Button */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>دفع آمن ومعتمد 100%</span>
          </div>

          <button
            onClick={handleConfirmRecharge}
            disabled={isProcessing}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl font-black text-xs shadow-lg transition cursor-pointer ${
              isProcessing
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 shadow-amber-500/20 hover:scale-105'
            }`}
          >
            <Zap className="w-3.5 h-3.5 stroke-[3]" />
            <span>{isProcessing ? 'جاري التنفيذ...' : `شحن الآن ($${selectedPkg.priceUSD})`}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
