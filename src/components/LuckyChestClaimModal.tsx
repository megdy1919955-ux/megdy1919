import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Sparkles,
  Trophy,
  Coins,
  Crown,
  CheckCircle2,
  Users,
  Flame,
  Award,
  ChevronRight
} from 'lucide-react';
import { LuckyChestConfig } from './LuckyChestModal';
import { ThreeDLuckyChest } from './ThreeDLuckyChest';

interface LuckyChestClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  chest: LuckyChestConfig | null;
  currentUserId?: string;
  currentUserName?: string;
  currentUserAvatar?: string;
  onClaimPrize?: (chestId: string, wonAmount: number) => void;
  onTriggerToast?: (msg: string) => void;
}


export const LuckyChestClaimModal: React.FC<LuckyChestClaimModalProps> = ({
  isOpen,
  onClose,
  chest,
  currentUserId = '88492011',
  currentUserName = 'عابر سبيل',
  currentUserAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
  onClaimPrize,
  onTriggerToast
}) => {
  const [hasClaimed, setHasClaimed] = useState(false);
  const [wonAmount, setWonAmount] = useState<number>(0);
  const [isOpening, setIsOpening] = useState(false);

  useEffect(() => {
    if (chest && isOpen) {
      const alreadyClaimed = chest.claimedBy.find((c) => c.userId === currentUserId);
      if (alreadyClaimed) {
        setHasClaimed(true);
        setWonAmount(alreadyClaimed.wonAmount);
      } else {
        setHasClaimed(false);
        setWonAmount(0);
      }
    }
  }, [chest, isOpen, currentUserId]);

  if (!isOpen || !chest) return null;

  const isSuper = chest.type === 'super';

  const handleOpenChest = () => {
    if (hasClaimed || isOpening) return;

    setIsOpening(true);

    setTimeout(() => {
      // Calculate realistic random reward from chest pool
      const avgPortion = Math.floor(chest.totalCoins / (chest.portions || 10));
      const variance = Math.floor(avgPortion * 0.4);
      const calculatedWin = Math.max(50, avgPortion + (Math.floor(Math.random() * variance * 2) - variance));

      setWonAmount(calculatedWin);
      setHasClaimed(true);
      setIsOpening(false);

      // Record to locally claimed chests so it disappears instantly
      try {
        const saved = JSON.parse(localStorage.getItem('claimed_lucky_chest_ids') || '[]');
        if (!saved.includes(chest.id)) {
          saved.push(chest.id);
          localStorage.setItem('claimed_lucky_chest_ids', JSON.stringify(saved));
        }
      } catch (e) {}

      window.dispatchEvent(new Event('lucky_chest_updated'));
      onClaimPrize?.(chest.id, calculatedWin);
      onTriggerToast?.(`تهانينا! لقد انقضضت على صندوق الحظ وفزت بـ +${calculatedWin.toLocaleString()} كوينز! 🎉🪙`);

      // إظهار المبلغ المكتسب واختفاء الكرت تلقائياً بعد لحظة قراءة واضحة وسلسة
      setTimeout(() => {
        onClose();
      }, 1300);
    }, 650);
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-70 bg-transparent flex items-center justify-center p-4 pointer-events-auto select-none dir-rtl"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 30 }}
          transition={{ type: 'spring', damping: 24, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-sm bg-gradient-to-b from-[#8C0C46] via-[#63062F] to-[#360219] border-2 border-amber-400/60 rounded-3xl p-5 text-white shadow-2xl text-center space-y-4 relative overflow-hidden"
        >
          {/* Top Sparkling Ambient Background */}
          <div className="absolute -top-12 -left-12 w-36 h-36 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-36 h-36 bg-pink-500/20 rounded-full blur-2xl pointer-events-none" />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3.5 left-3.5 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer z-20"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* Sender Header Profile */}
          <div className="flex flex-col items-center gap-1.5 pt-1">
            <div className="relative">
              <img
                src={chest.senderAvatar}
                alt={chest.senderName}
                className="w-13 h-13 rounded-full border-2 border-amber-400 object-cover shadow-lg"
              />
              <span className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 font-black text-[9px] px-1.5 py-0.2 rounded-full shadow-sm">
                {chest.senderVip}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-amber-200">{chest.senderName}</span>
              <span className="text-[10px] text-pink-200">أرسل {isSuper ? 'صندوق حظ سوبر 👑' : 'صندوق حظ 🎁'}</span>
            </div>
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-black/40 border border-amber-400/30 text-amber-300 text-xs font-black font-mono">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span>إجمالي الجائزة: {chest.totalCoins.toLocaleString()} كوينز</span>
            </div>
          </div>

          {/* 3D Chest Interactive Animation Area */}
          <div className="py-3 relative flex flex-col items-center justify-center">
            <motion.div
              animate={
                isOpening
                  ? { scale: [1, 1.2, 0.95, 1.15, 1], rotate: [0, -10, 10, -6, 6, 0] }
                  : hasClaimed
                  ? { scale: 1.05, y: -2 }
                  : { scale: [1, 1.06, 1], y: [0, -4, 0] }
              }
              transition={{ repeat: isOpening ? 0 : Infinity, duration: isOpening ? 0.8 : 2.2 }}
              onClick={handleOpenChest}
              className="relative cursor-pointer transition-transform active:scale-95 flex flex-col items-center"
            >
              <ThreeDLuckyChest
                isOpen={hasClaimed || isOpening}
                isSuper={isSuper}
                isReady={!hasClaimed}
                size="lg"
              />

              {!hasClaimed && !isOpening && (
                <span className="text-[11px] font-black text-amber-300 -mt-1 animate-pulse drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]">
                  انقر للفتح والانقضاض! ✨
                </span>
              )}
            </motion.div>

            {/* Sparkle particle hints */}
            <div className="absolute top-2 right-10 text-amber-300 text-sm animate-bounce pointer-events-none">✦</div>
            <div className="absolute bottom-2 left-10 text-pink-300 text-sm animate-bounce delay-300 pointer-events-none">★</div>
          </div>

          {/* Win Result or Action Button */}
          {hasClaimed ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-3 bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 border border-amber-400/60 rounded-2xl space-y-1 shadow-inner"
            >
              <span className="text-[11px] font-extrabold text-amber-200 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                تهانينا! لقد حصلت على:
              </span>
              <div className="text-2xl font-black text-amber-300 font-mono drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]">
                +{wonAmount.toLocaleString()} كوينز 🪙
              </div>
              <span className="text-[9.5px] text-emerald-300 font-bold block">
                تمت إضافة الكوينز مباشرة إلى رصيد حسابك ✨
              </span>
            </motion.div>
          ) : (
            <button
              type="button"
              disabled={isOpening}
              onClick={handleOpenChest}
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#FFF0A0] via-[#FEE488] to-[#ECC860] hover:brightness-110 active:scale-98 text-[#7A0639] text-base font-black shadow-xl shadow-amber-400/30 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#7A0639]" />
              <span>{isOpening ? 'جاري الفتح...' : 'انقضاض على الصندوق الآن 💰'}</span>
            </button>
          )}

          {/* Claimers & Portion Stats */}
          <div className="space-y-1.5 pt-1 text-right">
            <div className="flex items-center justify-between text-[11px] font-bold text-pink-200">
              <span>الفائزون بالانقضاض ({chest.claimedBy.length}/{chest.portions})</span>
              <span className="text-amber-300 font-mono">
                متبقي {Math.max(0, chest.portions - chest.claimedBy.length)} أجزاء
              </span>
            </div>

            <div className="max-h-28 overflow-y-auto space-y-1.5 p-2 bg-black/40 rounded-2xl border border-white/10 custom-scrollbar">
              {chest.claimedBy.length === 0 ? (
                <div className="text-center py-2 text-[10.5px] text-pink-200/60">
                  كن أول من ينقض على هذا الصندوق ويربح الكوينز! ⚡
                </div>
              ) : (
                chest.claimedBy.map((claimer, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs py-1 px-2 rounded-xl bg-white/5 border border-white/5"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={claimer.avatar}
                        alt={claimer.userName}
                        className="w-6 h-6 rounded-full border border-amber-400/50 object-cover"
                      />
                      <span className="font-bold text-slate-200 truncate text-[11px]">
                        {claimer.userName}
                      </span>
                    </div>
                    <span className="text-amber-300 font-mono font-black text-[11px]">
                      +{claimer.wonAmount.toLocaleString()} 🪙
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
