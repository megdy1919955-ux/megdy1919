/**
 * Gift Cashback & Dedicated Treasury System (نظام استرداد الهدايا والخزينة المستقلة)
 * Super Legend App - 2026
 *
 * ⚠️ تنبيه هام: هذا النظام خاص بـ "استرداد الهدايا (Gift Cashback)" وهو نظام منفصل تماماً
 * ومستقل عن أي لعبة أخرى (كالجاك بوت Jackpot). الخزينة والمنطق البرمجي هنا خاصان بخصم
 * وإرجاع مبالغ الهدايا فقط.
 *
 * 1. الخزينة المستقلة: gift_cashback_treasury
 * 2. تغذية الخزينة: اقتطاع نسبة متبقية من قيمة الهدية (100% - نسبة المستلم العشوائية).
 *    - نسبة المستلم: شائعة (25%-30%)، متوسطة (50%)، نادرة (70%)، نادرة جداً (100%).
 * 3. صرف الاسترداد:
 *    - استرداد جزئي (عشوائي): 10%، 20%، 30%، أو 40% من قيمة الهدية.
 *    - استرداد مضاعف (نادر جداً وبشرط امتلاء الخزينة): 2x، 3x، أو 5x.
 * 4. حماية الخزينة (Zero-Loss Logic): يمنع صرف أي استرداد يتجاوز رصيد الخزينة المتاح.
 */

import { GiftItem } from './giftCmsService';

// Dedicated isolated storage key for Gift Cashback Treasury
const CASHBACK_TREASURY_KEY = 'gift_cashback_treasury';
const LEGACY_VAULT_KEY = 'super_legend_refund_vault_balance_v1';
const RECENT_WINNERS_KEY = 'gift_cashback_recent_winners_v1';

// Initial Treasury baseline: 1,850,000 Coins
const INITIAL_TREASURY_BALANCE = 1850000;
// Minimum Safe Reserve to protect treasury from depletion
const MIN_SAFE_RESERVE = 100000;

export type RefundWinTier = 'minor' | 'medium' | 'big' | 'mega_jackpot';

export interface RefundDrawResult {
  id: string;
  giftId: string;
  giftName: string;
  giftIcon: string;
  giftPrice: number;
  quantity: number;
  totalCost: number;
  recipientRate: number;        // نسبة المستلم (25%-30%, 50%, 70%, 100%)
  recipientCoins: number;       // المبلغ الذي استلمه المضيف
  treasuryShare: number;        // حصة الخزينة من الهدية (100% - نسبة المستلم)
  refundCoins: number;          // مبلغ الاسترداد المرجوع للداعم
  multiplier: number;           // نسبة أو مضاعف الاسترداد (0.1x, 0.2x, 0.3x, 0.4x, 2x, 3x, 5x)
  winTier: RefundWinTier;
  tierLabel: string;
  vaultContribution: number;    // نفس treasuryShare للتوافق
  vaultBalanceBefore: number;   // رصيد الخزينة قبل العملية
  vaultBalanceAfter: number;    // رصيد الخزينة بعد العملية
  senderName: string;
  recipientName: string;
  timestamp: string;
}

export interface RefundWinner {
  id: string;
  senderName: string;
  giftName: string;
  giftIcon: string;
  refundCoins: number;
  multiplier: number;
  winTier: RefundWinTier;
  timeAgo: string;
}

// In-memory state for Gift Cashback Treasury
let currentCashbackTreasury = INITIAL_TREASURY_BALANCE;
let recentCashbackWinners: RefundWinner[] = [
  {
    id: 'w-1',
    senderName: 'الملك الكويتي 👑',
    giftName: 'صندوق الكنز السحري 📦',
    giftIcon: '📦',
    refundCoins: 14400,
    multiplier: 0.40,
    winTier: 'minor',
    timeAgo: 'منذ دقيقتين'
  },
  {
    id: 'w-2',
    senderName: 'أميرة الشرق ✨',
    giftName: 'السيارة الذهب الأسطورية 🏎️',
    giftIcon: '🏎️',
    refundCoins: 50000,
    multiplier: 5.0,
    winTier: 'mega_jackpot',
    timeAgo: 'منذ 5 دقائق'
  },
  {
    id: 'w-3',
    senderName: 'صقر الشمال 🦅',
    giftName: 'حقيبة الأموال 💰',
    giftIcon: '💰',
    refundCoins: 6000,
    multiplier: 3.0,
    winTier: 'big',
    timeAgo: 'منذ 9 دقائق'
  }
];

// Initialize from isolated localStorage key
if (typeof window !== 'undefined') {
  try {
    const savedTreasury = localStorage.getItem(CASHBACK_TREASURY_KEY) || localStorage.getItem(LEGACY_VAULT_KEY);
    if (savedTreasury) {
      const parsed = parseInt(savedTreasury, 10);
      if (!isNaN(parsed) && parsed > 50000) {
        currentCashbackTreasury = parsed;
      }
    }
    const savedWinners = localStorage.getItem(RECENT_WINNERS_KEY);
    if (savedWinners) {
      const parsedW = JSON.parse(savedWinners);
      if (Array.isArray(parsedW) && parsedW.length > 0) {
        recentCashbackWinners = parsedW;
      }
    }
  } catch {
    // fallback to initial
  }
}

/**
 * Save updated Gift Cashback Treasury balance securely
 */
function saveCashbackTreasuryBalance(balance: number): void {
  currentCashbackTreasury = Math.max(0, balance);
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(CASHBACK_TREASURY_KEY, currentCashbackTreasury.toString());
      localStorage.setItem(LEGACY_VAULT_KEY, currentCashbackTreasury.toString());
      // Broadcast isolated event
      window.dispatchEvent(new CustomEvent('gift_cashback_treasury_updated', { detail: currentCashbackTreasury }));
      window.dispatchEvent(new CustomEvent('refund_vault_updated', { detail: currentCashbackTreasury }));
    } catch {
      // Ignore
    }
  }
}

function saveRecentWinners(winners: RefundWinner[]): void {
  recentCashbackWinners = winners.slice(0, 10);
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(RECENT_WINNERS_KEY, JSON.stringify(recentCashbackWinners));
      window.dispatchEvent(new CustomEvent('refund_winners_updated', { detail: recentCashbackWinners }));
    } catch {
      // Ignore
    }
  }
}

export function getRefundVaultBalance(): number {
  return currentCashbackTreasury;
}

export function getGiftCashbackTreasuryBalance(): number {
  return currentCashbackTreasury;
}

export function getRecentRefundWinners(): RefundWinner[] {
  return recentCashbackWinners;
}

export function subscribeToRefundVault(callback: (balance: number) => void): () => void {
  const handler = (e: Event) => {
    const custom = e as CustomEvent<number>;
    callback(custom.detail ?? currentCashbackTreasury);
  };
  if (typeof window !== 'undefined') {
    window.addEventListener('gift_cashback_treasury_updated', handler);
    window.addEventListener('refund_vault_updated', handler);
  }
  return () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('gift_cashback_treasury_updated', handler);
      window.removeEventListener('refund_vault_updated', handler);
    }
  };
}

/**
 * Check if a gift qualifies for Gift Cashback processing
 */
export function isRefundGift(gift: GiftItem): boolean {
  if (!gift) return false;
  return (
    gift.category === 'استرداد' ||
    gift.isLucky === true ||
    (gift.badge && (gift.badge.includes('استرداد') || gift.badge.includes('حظ') || gift.badge.includes('JACKPOT')))
  );
}

/**
 * Calculate random recipient share according to specification:
 * - شائعة: 25% - 30%
 * - متوسطة: 50%
 * - نادرة: 70%
 * - نادرة جداً: 100%
 */
function calculateRecipientRate(): number {
  const rand = Math.random() * 100;
  if (rand < 66) {
    // شائعة: 25% - 30%
    return parseFloat((0.25 + Math.random() * 0.05).toFixed(2));
  } else if (rand < 88) {
    // متوسطة: 50%
    return 0.50;
  } else if (rand < 97) {
    // نادرة: 70%
    return 0.70;
  } else {
    // نادرة جداً: 100%
    return 1.00;
  }
}

/**
 * Execute the Gift Cashback & Dedicated Treasury calculation
 * Strictly adhering to the Zero-Loss logic and dedicated treasury rules.
 */
export function processRefundGiftDraw(
  gift: GiftItem,
  quantity: number,
  senderName: string = 'الداعم',
  recipientName: string = 'المضيف'
): RefundDrawResult {
  const totalCost = gift.price * quantity;
  const treasuryBefore = currentCashbackTreasury;

  // ================= 1. تغذية خزينة الاسترداد (Cashback Treasury Inflow) =================
  // نسبة المستلم عشوائية: شائعة (25%-30%)، متوسطة (50%)، نادرة (70%)، نادرة جداً (100%)
  const recipientRate = calculateRecipientRate();
  const recipientCoins = Math.round(totalCost * recipientRate);

  // نسبة الخزينة: المتبقي من قيمة الهدية (100% - نسبة المستلم)
  const treasuryShare = Math.max(0, totalCost - recipientCoins);

  // الرصيد المؤقت بعد إضافة حصة الهدية
  const treasuryWithInflow = treasuryBefore + treasuryShare;

  // ================= 2. آلية صرف الاسترداد للداعم (Cashback Output Logic) =================
  // شرط الاسترداد: توفر رصيد كافٍ يفوق حد الأمان
  const availableLiquidity = Math.max(0, treasuryWithInflow - MIN_SAFE_RESERVE);

  let multiplier = 0.20;
  let winTier: RefundWinTier = 'minor';
  let tierLabel = 'استرداد كوينز جزئي 🔄';

  // التحقق من إمكانية صرف الاسترداد المضاعف (مكافأة نادرة جداً وبشرط امتلاء الخزينة بمبلغ كبير جداً)
  // شروط المضاعف:
  // - الخزينة ممتلئة بمبلغ كبير (مثلاً فوق 300,000 وتغطي 8 أضعاف تكلفة الهدية على الأقل)
  const canAffordGrandMultiplier = availableLiquidity >= totalCost * 6 && currentCashbackTreasury >= 300000;
  const canAffordMediumMultiplier = availableLiquidity >= totalCost * 3.5 && currentCashbackTreasury >= 200000;

  const multiplierRng = Math.random() * 100;

  if (canAffordGrandMultiplier && multiplierRng < 1.0) {
    // استرداد مضاعف أسطوري 5 أضعاف (5x) - نادر جداً (~1%)
    multiplier = 5.0;
    winTier = 'mega_jackpot';
    tierLabel = '👑 استرداد مضاعف أسطوري (5 أضعاف 5x)';
  } else if (canAffordGrandMultiplier && multiplierRng < 3.0) {
    // استرداد مضاعف 3 أضعاف (3x) - نادر جداً (~2%)
    multiplier = 3.0;
    winTier = 'big';
    tierLabel = '🌟 استرداد مضاعف كبير (3 أضعاف 3x)';
  } else if (canAffordMediumMultiplier && multiplierRng < 7.0) {
    // استرداد مضاعف ضعفين (2x) - نادر (~4%)
    multiplier = 2.0;
    winTier = 'medium';
    tierLabel = '✨ استرداد مضاعف مبارك (ضعف المبلغ 2x)';
  } else {
    // استرداد جزئي عشوائي: (10%، 20%، 30%، أو 40%) من قيمة الهدية
    const partialOptions = [0.10, 0.20, 0.30, 0.40];
    const randomIndex = Math.floor(Math.random() * partialOptions.length);
    multiplier = partialOptions[randomIndex];
    winTier = 'minor';
    tierLabel = `استرداد كوينز جزئي (${Math.round(multiplier * 100)}%) 🔄`;
  }

  // حساب قيمة الاسترداد المطلوب صرفه
  let candidateRefundCoins = Math.round(totalCost * multiplier);

  // ================= 3. حماية الخزينة وضمان عدم الخسارة (Zero-Loss Logic) =================
  // يمنع النظام صرف أي استرداد (جزئي أو مضاعف) إذا كان رصيد الخزينة < قيمة الاسترداد المطلوب
  let finalRefundCoins = candidateRefundCoins;

  if (finalRefundCoins > availableLiquidity) {
    // في حال عدم كفاية السيولة للمضاعف، يتم التراجع للاسترداد الجزئي الآمن المتاح
    if (multiplier > 0.40) {
      multiplier = 0.20;
      winTier = 'minor';
      tierLabel = 'استرداد كوينز جزئي (20%) 🔄';
      candidateRefundCoins = Math.round(totalCost * multiplier);
    }
    // قفل المبلغ بما لا يتجاوز السيولة المتاحة لضمان عدم الخسارة نهائياً
    finalRefundCoins = Math.min(candidateRefundCoins, availableLiquidity);
  }

  // تطبيق معادلة الخزينة: رصيد الخزينة = الرصيد السابق + حصة الخزينة من الهدية - مبلغ الاسترداد المرجوع للداعم
  const updatedTreasury = Math.max(0, treasuryWithInflow - finalRefundCoins);

  // حفظ الرصيد الجديد للخزينة
  saveCashbackTreasuryBalance(updatedTreasury);

  const result: RefundDrawResult = {
    id: `cashback_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    giftId: gift.id,
    giftName: gift.name,
    giftIcon: gift.icon,
    giftPrice: gift.price,
    quantity,
    totalCost,
    recipientRate,
    recipientCoins,
    treasuryShare,
    refundCoins: finalRefundCoins,
    multiplier,
    winTier,
    tierLabel,
    vaultContribution: treasuryShare,
    vaultBalanceBefore: treasuryBefore,
    vaultBalanceAfter: updatedTreasury,
    senderName,
    recipientName,
    timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
  };

  // تسجيل الرابحين للمكافآت المضاعفة
  if (winTier !== 'minor' && finalRefundCoins > 0) {
    const newWinner: RefundWinner = {
      id: result.id,
      senderName,
      giftName: gift.name,
      giftIcon: gift.icon,
      refundCoins: finalRefundCoins,
      multiplier,
      winTier,
      timeAgo: 'الآن'
    };
    saveRecentWinners([newWinner, ...recentCashbackWinners]);
  }

  return result;
}

