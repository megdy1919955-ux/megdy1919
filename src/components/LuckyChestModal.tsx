import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Crown,
  Sparkles,
  Gift,
  Coins,
  Check,
  Flame,
  Star,
  Users,
  Clock,
  ChevronRight,
  Award
} from 'lucide-react';
import { ThreeDLuckyChest } from './ThreeDLuckyChest';

export type LuckyChestType = 'normal' | 'super' | 'bag';

export interface LuckyChestConfig {
  id: string;
  type: LuckyChestType;
  coins: number;
  portions: number;
  eligibility: 'unlimited' | 'club_member' | 'new_user';
  drawTime: 'instant' | '5m' | '10m';
  senderName: string;
  senderAvatar: string;
  senderVip: string;
  senderLevel: string;
  createdAt: number;
  totalCoins: number;
  remainingPortions: number;
  roomId?: string;
  roomTitle?: string;
  claimedBy: Array<{
    userId: string;
    userName: string;
    avatar: string;
    wonAmount: number;
    claimedAt: number;
  }>;
}

interface LuckyChestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendChest: (config: Omit<LuckyChestConfig, 'id' | 'createdAt' | 'remainingPortions' | 'claimedBy'>) => void;
  userCoins?: string | number;
  onTriggerToast?: (msg: string) => void;
}

export const LuckyChestModal: React.FC<LuckyChestModalProps> = ({
  isOpen,
  onClose,
  onSendChest,
  userCoins = '40M',
  onTriggerToast
}) => {
  const [activeTab, setActiveTab] = useState<LuckyChestType>('normal');

  // Tab 1: صندوق الحظ (Normal Chest) State
  const [normalCoins, setNormalCoins] = useState<number>(9900);
  const [normalPortions, setNormalPortions] = useState<number>(10);
  const [normalEligibility, setNormalEligibility] = useState<'unlimited' | 'new_user'>('unlimited');
  const [normalDrawTime, setNormalDrawTime] = useState<'instant' | '5m' | '10m'>('instant');

  // Tab 2: صندوق الحظ السوبر (Super Chest) State
  const [superCoins, setSuperCoins] = useState<number>(99999);
  const [superEligibility, setSuperEligibility] = useState<'unlimited' | 'club_member' | 'new_user'>('unlimited');
  const [superDrawTime, setSuperDrawTime] = useState<'instant' | '5m' | '10m'>('instant');

  if (!isOpen) return null;

  const handleSend = () => {
    const isSuper = activeTab === 'super';
    const coins = isSuper ? superCoins : normalCoins;
    const portions = isSuper ? 20 : normalPortions;
    const eligibility = isSuper ? superEligibility : normalEligibility;
    const drawTime = isSuper ? superDrawTime : normalDrawTime;

    onSendChest({
      type: activeTab,
      coins,
      portions,
      eligibility,
      drawTime,
      senderName: 'عابر سبيل',
      senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      senderVip: 'VIP 6',
      senderLevel: 'Lv.113',
      totalCoins: coins
    });

    onClose();
    onTriggerToast?.(
      isSuper
        ? `تم إرسال صندوق الحظ السوبر الملكي بقيمة ${coins.toLocaleString()} كوينز لجميع الغرف! 👑🎁🔥`
        : `تم إرسال صندوق الحظ بقيمة ${coins.toLocaleString()} كوينز بنجاح! 🎁✨`
    );
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-60 bg-transparent flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-auto select-none dir-rtl"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md bg-gradient-to-b from-[#8C0C46] via-[#740738] to-[#4F0425] border-t-2 sm:border-2 border-pink-400/40 rounded-t-[36px] sm:rounded-3xl shadow-2xl text-white flex flex-col max-h-[85vh] overflow-hidden"
        >
          {/* Header Bar with X button and Title */}
          <div className="relative px-5 pt-4 pb-2 flex items-center justify-between shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>

            <h2 className="text-lg font-black text-white drop-shadow-md">
              إرسال صندوق حظ
            </h2>

            <div className="w-8 h-8" />
          </div>

          {/* Top 3 Navigation Tabs */}
          <div className="flex items-center justify-around px-4 pt-1 pb-3 border-b border-pink-500/20 shrink-0">
            {/* 1. صندوق الحظ (Lucky Chest) */}
            <button
              type="button"
              onClick={() => setActiveTab('normal')}
              className="relative py-1.5 px-3 flex flex-col items-center group cursor-pointer"
            >
              <span
                className={`text-sm font-black transition-all ${
                  activeTab === 'normal'
                    ? 'text-white scale-105 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]'
                    : 'text-pink-200/60 hover:text-pink-100'
                }`}
              >
                صندوق الحظ
              </span>
              {activeTab === 'normal' && (
                <motion.div
                  layoutId="luckyChestActiveTab"
                  className="w-8 h-1 rounded-full bg-white mt-1 shadow-[0_0_8px_rgba(255,255,255,0.9)]"
                />
              )}
            </button>

            {/* 2. صندوق الحظ السوبر (Super Lucky Chest) */}
            <button
              type="button"
              onClick={() => setActiveTab('super')}
              className="relative py-1.5 px-3 flex flex-col items-center group cursor-pointer"
            >
              <span
                className={`text-sm font-black transition-all ${
                  activeTab === 'super'
                    ? 'text-white scale-105 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]'
                    : 'text-pink-200/60 hover:text-pink-100'
                }`}
              >
                صندوق الحظ السوبر
              </span>
              {activeTab === 'super' && (
                <motion.div
                  layoutId="luckyChestActiveTab"
                  className="w-12 h-1 rounded-full bg-white mt-1 shadow-[0_0_8px_rgba(255,255,255,0.9)]"
                />
              )}
            </button>

            {/* 3. حقيبة الهدايا (Gift Bag) */}
            <button
              type="button"
              onClick={() => setActiveTab('bag')}
              className="relative py-1.5 px-3 flex items-center gap-1 group cursor-pointer"
            >
              <span
                className={`text-sm font-black transition-all ${
                  activeTab === 'bag'
                    ? 'text-white scale-105 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]'
                    : 'text-pink-200/60 hover:text-pink-100'
                }`}
              >
                حقيبة الهدايا
              </span>
              <span className="bg-rose-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full shadow-sm">
                جديد
              </span>
              {activeTab === 'bag' && (
                <motion.div
                  layoutId="luckyChestActiveTab"
                  className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]"
                />
              )}
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4.5 custom-scrollbar">
            {/* ========================================================================= */}
            {/* TAB 1: صندوق الحظ العادي (NORMAL LUCKY CHEST)                             */}
            {/* ========================================================================= */}
            {activeTab === 'normal' && (
              <div className="space-y-4">
                {/* 1. Coins Selection (عملات) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-pink-100">عملات</span>
                    <span className="text-[10px] text-pink-200/70">
                      رصيدك: <strong className="text-amber-300 font-mono">{userCoins}</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {[2900, 9900, 29900, 199900].map((amt) => {
                      const isSelected = normalCoins === amt;
                      return (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setNormalCoins(amt)}
                          className={`py-2.5 px-1 rounded-full text-xs font-black transition-all cursor-pointer text-center ${
                            isSelected
                              ? 'bg-[#FEE488] text-[#8C0C46] shadow-lg shadow-amber-400/30 scale-102 border border-amber-200'
                              : 'bg-[#56072A] text-pink-100 hover:bg-[#680933] border border-pink-500/20'
                          }`}
                        >
                          {amt.toLocaleString()}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Portions / Shares Selection (جزء) */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-pink-100">جزء</span>

                  <div className="grid grid-cols-4 gap-2">
                    {[6, 10, 15, 20].map((part) => {
                      const isSelected = normalPortions === part;
                      return (
                        <button
                          key={part}
                          type="button"
                          onClick={() => setNormalPortions(part)}
                          className={`py-2 px-1 rounded-full text-xs font-black transition-all cursor-pointer text-center ${
                            isSelected
                              ? 'bg-[#FEE488] text-[#8C0C46] shadow-lg shadow-amber-400/30 scale-102 border border-amber-200'
                              : 'bg-[#56072A] text-pink-100 hover:bg-[#680933] border border-pink-500/20'
                          }`}
                        >
                          {part}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Eligibility (الأهلية) */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-pink-100">الأهلية</span>

                  <div className="space-y-2">
                    {/* Option 1: Unlimited (غير محدود) */}
                    <div
                      onClick={() => setNormalEligibility('unlimited')}
                      className={`p-3 rounded-2xl cursor-pointer transition-all border ${
                        normalEligibility === 'unlimited'
                          ? 'bg-[#5B072D] border-pink-400/50 shadow-md'
                          : 'bg-[#470522] border-pink-500/15 opacity-80'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">غير محدود</span>
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center ${
                            normalEligibility === 'unlimited'
                              ? 'bg-amber-400 text-[#8C0C46]'
                              : 'border-2 border-pink-300/40'
                          }`}
                        >
                          {normalEligibility === 'unlimited' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>
                      <p className="text-[10px] text-pink-200/80 mt-1">
                        يمكن لجميع المستخدمين في الغرفة المشاركة مباشرة في الانقضاض
                      </p>
                    </div>

                    {/* Option 2: New User (مستخدم جديد) */}
                    <div
                      onClick={() => setNormalEligibility('new_user')}
                      className={`p-3 rounded-2xl cursor-pointer transition-all border ${
                        normalEligibility === 'new_user'
                          ? 'bg-[#5B072D] border-pink-400/50 shadow-md'
                          : 'bg-[#470522] border-pink-500/15 opacity-80'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">مستخدم جديد</span>
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center ${
                            normalEligibility === 'new_user'
                              ? 'bg-amber-400 text-[#8C0C46]'
                              : 'border-2 border-pink-300/40'
                          }`}
                        >
                          {normalEligibility === 'new_user' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Draw Time (وقت السحب) */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-pink-100">وقت السحب</span>

                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'instant', label: 'فورًا' },
                      { id: '5m', label: '5 دقيقة' },
                      { id: '10m', label: '10 دقيقة' }
                    ].map((timeItem) => {
                      const isSelected = normalDrawTime === timeItem.id;
                      return (
                        <button
                          key={timeItem.id}
                          type="button"
                          onClick={() => setNormalDrawTime(timeItem.id as any)}
                          className={`py-2 px-2 rounded-full text-xs font-black transition-all cursor-pointer text-center ${
                            isSelected
                              ? 'bg-[#FEE488] text-[#8C0C46] shadow-lg shadow-amber-400/30 scale-102 border border-amber-200'
                              : 'bg-[#56072A] text-pink-100 hover:bg-[#680933] border border-pink-500/20'
                          }`}
                        >
                          {timeItem.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 2: صندوق الحظ السوبر (SUPER LUCKY CHEST)                             */}
            {/* ========================================================================= */}
            {activeTab === 'super' && (
              <div className="space-y-4">
                {/* Royal Super Chest Banner Card (Matching Screenshot 2) */}
                <div className="relative rounded-2xl overflow-hidden p-3 bg-gradient-to-r from-amber-600/30 via-pink-600/30 to-amber-600/30 border border-amber-400/50 shadow-xl">
                  <div className="flex items-center gap-3">
                    {/* Glowing Chest Art */}
                    <div className="shrink-0 flex items-center justify-center">
                      <ThreeDLuckyChest isSuper={true} size="md" />
                    </div>

                    {/* Royal Wings Banner Header */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-amber-300">عابر سبيل..</span>
                        <span className="bg-amber-400 text-slate-950 font-black text-[8px] px-1 rounded">
                          VIP 6
                        </span>
                        <span className="bg-purple-600 text-white font-black text-[8px] px-1 rounded">
                          113 👑
                        </span>
                      </div>
                      <div className="text-[11px] font-extrabold text-amber-200 flex items-center gap-1">
                        <span>تم إرسال صندوق الحظ العالم:</span>
                        <span className="font-mono text-amber-300 font-black">{superCoins.toLocaleString()} 🪙</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 1. Coins Selection (عملات) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-pink-100">عملات</span>
                    <span className="text-[10px] text-pink-200/70">
                      رصيدك: <strong className="text-amber-300 font-mono">{userCoins}</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {[66666, 99999, 188888, 999999].map((amt) => {
                      const isSelected = superCoins === amt;
                      return (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setSuperCoins(amt)}
                          className={`py-2.5 px-1 rounded-full text-xs font-black transition-all cursor-pointer text-center ${
                            isSelected
                              ? 'bg-[#FEE488] text-[#8C0C46] shadow-lg shadow-amber-400/30 scale-102 border border-amber-200'
                              : 'bg-[#56072A] text-pink-100 hover:bg-[#680933] border border-pink-500/20'
                          }`}
                        >
                          {amt.toLocaleString()}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Eligibility (الأهلية) */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-pink-100">الأهلية</span>

                  <div className="space-y-2">
                    {/* Option 1: Unlimited (غير محدود) */}
                    <div
                      onClick={() => setSuperEligibility('unlimited')}
                      className={`p-3 rounded-2xl cursor-pointer transition-all border ${
                        superEligibility === 'unlimited'
                          ? 'bg-[#5B072D] border-pink-400/50 shadow-md'
                          : 'bg-[#470522] border-pink-500/15 opacity-80'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">غير محدود</span>
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center ${
                            superEligibility === 'unlimited'
                              ? 'bg-amber-400 text-[#8C0C46]'
                              : 'border-2 border-pink-300/40'
                          }`}
                        >
                          {superEligibility === 'unlimited' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>
                      <p className="text-[10px] text-pink-200/80 mt-1">
                        يمكن لجميع المستخدمين في الغرفة المشاركة مباشرة في الانقضاض
                      </p>
                    </div>

                    {/* Option 2: Room Club Member (عضو نادي الغرفة) */}
                    <div
                      onClick={() => setSuperEligibility('club_member')}
                      className={`p-3 rounded-2xl cursor-pointer transition-all border ${
                        superEligibility === 'club_member'
                          ? 'bg-[#5B072D] border-pink-400/50 shadow-md'
                          : 'bg-[#470522] border-pink-500/15 opacity-80'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">عضو نادي الغرفة</span>
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center ${
                            superEligibility === 'club_member'
                              ? 'bg-amber-400 text-[#8C0C46]'
                              : 'border-2 border-pink-300/40'
                          }`}
                        >
                          {superEligibility === 'club_member' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>
                    </div>

                    {/* Option 3: New User (مستخدم جديد) */}
                    <div
                      onClick={() => setSuperEligibility('new_user')}
                      className={`p-3 rounded-2xl cursor-pointer transition-all border ${
                        superEligibility === 'new_user'
                          ? 'bg-[#5B072D] border-pink-400/50 shadow-md'
                          : 'bg-[#470522] border-pink-500/15 opacity-80'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">مستخدم جديد</span>
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center ${
                            superEligibility === 'new_user'
                              ? 'bg-amber-400 text-[#8C0C46]'
                              : 'border-2 border-pink-300/40'
                          }`}
                        >
                          {superEligibility === 'new_user' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Draw Time (وقت السحب) */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-pink-100">وقت السحب</span>

                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'instant', label: 'فورًا' },
                      { id: '5m', label: '5 دقيقة' },
                      { id: '10m', label: '10 دقيقة' }
                    ].map((timeItem) => {
                      const isSelected = superDrawTime === timeItem.id;
                      return (
                        <button
                          key={timeItem.id}
                          type="button"
                          onClick={() => setSuperDrawTime(timeItem.id as any)}
                          className={`py-2 px-2 rounded-full text-xs font-black transition-all cursor-pointer text-center ${
                            isSelected
                              ? 'bg-[#FEE488] text-[#8C0C46] shadow-lg shadow-amber-400/30 scale-102 border border-amber-200'
                              : 'bg-[#56072A] text-pink-100 hover:bg-[#680933] border border-pink-500/20'
                          }`}
                        >
                          {timeItem.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 3: حقيبة الهدايا (GIFT BAG / INVENTORY)                                */}
            {/* ========================================================================= */}
            {activeTab === 'bag' && (
              <div className="py-6 text-center space-y-3">
                <div className="w-16 h-16 mx-auto rounded-3xl bg-pink-500/20 border border-pink-400/30 flex items-center justify-center text-3xl">
                  🎒
                </div>
                <h3 className="text-sm font-bold text-pink-100">حقيبة هدايا الحظ الخاصة بك</h3>
                <p className="text-xs text-pink-200/70 max-w-xs mx-auto">
                  يمكنك استخدام القسائم وصناديق الحظ المخزنة في حقيبتك لإرسالها للغرفة مباشرة مجاناً!
                </p>
                <div className="p-3 bg-[#56072A] border border-pink-500/20 rounded-2xl text-xs text-amber-300 font-bold">
                  لا توجد صناديق مخزنة حالياً في حقيبتك. يمكنك إرسال صندوق جديد الآن!
                </div>
              </div>
            )}
          </div>

          {/* Footer Submit Button & Note */}
          <div className="p-4 bg-[#3E031D] border-t border-pink-500/20 space-y-2 shrink-0">
            <button
              type="button"
              onClick={handleSend}
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#FFF0A0] via-[#FEE488] to-[#ECC860] hover:brightness-110 active:scale-98 text-[#7A0639] text-base font-black shadow-xl shadow-amber-400/25 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>إرسال</span>
            </button>

            <div className="text-center">
              <span className="text-[10.5px] text-pink-200/80 hover:text-white cursor-pointer transition-colors">
                {activeTab === 'super'
                  ? 'أي شخص يقوم بفتح صندوق الحظ السوبر سيحصل على ذهب معرفة المزيد >'
                  : 'لدى المستخدمين فرصة للحصول على كوينز بعد فتح الظرف الأحمر. معرفة المزيد >'}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
