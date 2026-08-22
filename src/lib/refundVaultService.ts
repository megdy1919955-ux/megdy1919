/**
 * Refund Vault & Lucky Cashback Service
 * Super Legend App - 2026
 *
 * Manages the shared Refund Vault (خزينة الاسترداد),
 * calculates dynamic odds & cashback returns when sending Refund Gifts,
 * and broadcasts wins to the room and chat.
 */

import { GiftItem } from './giftCmsService';

const VAULT_STORAGE_KEY = 'super_legend_refund_vault_balance_v1';
const RECENT_WINNERS_KEY = 'super_legend_refund_recent_winners_v1';
const INITIAL_VAULT_BALANCE = 1854290; // Initial ~1.85M Coins in Vault

export type RefundWinTier = 'minor' | 'medium' | 'big' | 'mega_jackpot';

export interface RefundDrawResult {
  id: string;
  giftId: string;
  giftName: string;
  giftIcon: string;
  giftPrice: number;
  quantity: number;
  totalCost: number;
  refundCoins: number;
  multiplier: number; // e.g. 0.25x, 0.8x, 2.5x, 15x
  winTier: RefundWinTier;
  tierLabel: string;
  vaultContribution: number;
  vaultBalanceBefore: number;
  vaultBalanceAfter: number;
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

// In-memory reactive state
let currentVaultBalance = INITIAL_VAULT_BALANCE;
let recentWinners: RefundWinner[] = [
  {
    id: 'w-1',
    senderName: 'الملك الكويتي 👑',
    giftName: 'صندوق الكنز السحري 📦',
    giftIcon: '📦',
    refundCoins: 14400,
    multiplier: 0.60,
    winTier: 'medium',
    timeAgo: 'منذ دقيقتين'
  },
  {
    id: 'w-2',
    senderName: 'أميرة الشرق ✨',
    giftName: 'السيارة الذهب الأسطورية 🏎️',
    giftIcon: '🏎️',
    refundCoins: 15000,
    multiplier: 1.5,
    winTier: 'mega_jackpot',
    timeAgo: 'منذ 5 دقائق'
  },
  {
    id: 'w-3',
    senderName: 'صقر الشمال 🦅',
    giftName: 'حقيبة الأموال 💰',
    giftIcon: '💰',
    refundCoins: 2500,
    multiplier: 0.50,
    winTier: 'medium',
    timeAgo: 'منذ 9 دقائق'
  }
];

// Initialize from localStorage
if (typeof window !== 'undefined') {
  try {
    const savedVault = localStorage.getItem(VAULT_STORAGE_KEY);
    if (savedVault) {
      const parsed = parseInt(savedVault, 10);
      if (!isNaN(parsed) && parsed > 500000) {
        currentVaultBalance = parsed;
      }
    }
    const savedWinners = localStorage.getItem(RECENT_WINNERS_KEY);
    if (savedWinners) {
      const parsedW = JSON.parse(savedWinners);
      if (Array.isArray(parsedW) && parsedW.length > 0) {
        recentWinners = parsedW;
      }
    }
  } catch {
    // fallback to initial
  }
}

function saveVaultBalance(balance: number): void {
  currentVaultBalance = balance;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(VAULT_STORAGE_KEY, balance.toString());
      window.dispatchEvent(new CustomEvent('refund_vault_updated', { detail: balance }));
    } catch {
      // Ignore
    }
  }
}

function saveRecentWinners(winners: RefundWinner[]): void {
  recentWinners = winners.slice(0, 10);
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(RECENT_WINNERS_KEY, JSON.stringify(recentWinners));
      window.dispatchEvent(new CustomEvent('refund_winners_updated', { detail: recentWinners }));
    } catch {
      // Ignore
    }
  }
}

export function getRefundVaultBalance(): number {
  return currentVaultBalance;
}

export function getRecentRefundWinners(): RefundWinner[] {
  return recentWinners;
}

export function subscribeToRefundVault(callback: (balance: number) => void): () => void {
  const handler = (e: Event) => {
    const custom = e as CustomEvent<number>;
    callback(custom.detail ?? currentVaultBalance);
  };
  if (typeof window !== 'undefined') {
    window.addEventListener('refund_vault_updated', handler);
  }
  return () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('refund_vault_updated', handler);
    }
  };
}

/**
 * Check if a gift qualifies for Refund Vault processing
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
 * Execute the dynamic lucky draw calculation for a refund gift
 */
export function processRefundGiftDraw(
  gift: GiftItem,
  quantity: number,
  senderName: string = 'الداعم',
  recipientName: string = 'المضيف'
): RefundDrawResult {
  const totalCost = gift.price * quantity;
  const vaultBefore = currentVaultBalance;

  // 1. Vault Contribution (15% goes into the collective treasury)
  const contribution = Math.max(1, Math.round(totalCost * 0.15));
  let updatedVault = vaultBefore + contribution;

  // 2. High-Morale Balanced RNG Draw:
  // - 55% Regular High Cashback (استرداد جزئي محفز: 40% - 70% من قيمة الهدية)
  // - 28% Excellent Return / Full Recovery (استرداد ممتاز واسترجاع كامل: 80% - 130%)
  // - 13% Big Win & Multiplier Boost (مضاعفة وربح كبير: 180% - 320% = 1.8x إلى 3.2x)
  // - 4% Mega Jackpot Treasury Breaker (الجائزة الكبرى كسر الخزينة: 400% - 800% = 4x إلى 8x)
  const rng = Math.random() * 100;

  let multiplier = 0.50;
  let winTier: RefundWinTier = 'minor';
  let tierLabel = 'استرداد كوينز جزئي 🔄';

  if (rng < 55) {
    // Regular High Cashback (40% - 70%)
    multiplier = parseFloat((0.40 + Math.random() * 0.30).toFixed(2));
    winTier = 'minor';
    tierLabel = 'استرداد كوينز محفز (40%-70%) 🔄';
  } else if (rng < 83) {
    // Excellent Return / Full Recovery (80% - 130%)
    multiplier = parseFloat((0.80 + Math.random() * 0.50).toFixed(2));
    winTier = 'medium';
    tierLabel = 'مردود ممتاز واسترجاع مبارك ✨';
  } else if (rng < 96) {
    // Big Win (180% - 320% / 1.8x - 3.2x)
    multiplier = parseFloat((1.80 + Math.random() * 1.40).toFixed(2));
    winTier = 'big';
    tierLabel = 'مضاعفة وربح كبير 🌟';
  } else {
    // Mega Jackpot (400% - 800% / 4x - 8x)
    multiplier = parseFloat((4.00 + Math.random() * 4.00).toFixed(2));
    winTier = 'mega_jackpot';
    tierLabel = '👑 الجائزة الكبرى كسر الخزينة JACKPOT 🎰';
  }

  // Calculate raw refund coins
  let refundCoins = Math.max(1, Math.round(totalCost * multiplier));

  // If Big Win or Mega Jackpot exceeds the gift value, deduct the surplus from vault safely
  if (refundCoins > totalCost) {
    const surplusPayout = refundCoins - totalCost;
    const safeDeduction = Math.min(surplusPayout, Math.round(updatedVault * 0.08));
    updatedVault = Math.max(600000, updatedVault - safeDeduction);
  }

  saveVaultBalance(updatedVault);

  const result: RefundDrawResult = {
    id: `draw_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    giftId: gift.id,
    giftName: gift.name,
    giftIcon: gift.icon,
    giftPrice: gift.price,
    quantity,
    totalCost,
    refundCoins,
    multiplier,
    winTier,
    tierLabel,
    vaultContribution: contribution,
    vaultBalanceBefore: vaultBefore,
    vaultBalanceAfter: updatedVault,
    senderName,
    recipientName,
    timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
  };

  // Add to recent winners ticker if medium or above
  if (winTier !== 'minor') {
    const newWinner: RefundWinner = {
      id: result.id,
      senderName,
      giftName: gift.name,
      giftIcon: gift.icon,
      refundCoins,
      multiplier,
      winTier,
      timeAgo: 'الآن'
    };
    saveRecentWinners([newWinner, ...recentWinners]);
  }

  return result;
}
