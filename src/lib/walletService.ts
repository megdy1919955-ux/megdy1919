/**
 * خدمة المحفظة المركزية الموحدة (Central Wallet Service)
 * تضمن استقرار وتخزين رصيد الكوينز والألماس في:
 * 1. Firebase Firestore السحابية (دائم لا يضيع بالتحديث)
 * 2. سيرفر Node.js المركزي (Server-authoritative)
 * 3. التخزين المحلي والأحداث اللحظية (WebSockets / CustomEvents)
 */

import { doc, updateDoc, increment, serverTimestamp, addDoc, collection, onSnapshot, getDoc } from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from './firebase';
import { getApiUrl } from './apiConfig';

export interface UserWalletData {
  coins: number;
  diamonds: number;
  totalDiamondsEarned: number;
  totalCoinsSpent: number;
}

export interface RechargeOptions {
  uid?: string;
  paymentMethod?: string;
  packageId?: string;
}

export interface DeductOptions {
  uid?: string;
  reason?: string;
}

/**
 * الحصول على الرصيد المخزن محلياً كـ fallback
 */
export const getCachedCoins = (): number => {
  try {
    const saved = localStorage.getItem('user_wallet_coins');
    if (saved) {
      if (saved === '100000000') {
        localStorage.setItem('user_wallet_coins', '0');
        return 0;
      }
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed >= 0) return parsed;
    }
  } catch {}
  return 0;
};

/**
 * كائن WalletService المطلوب من المستخدم:
 * يدعم الاستماع المباشر وتحديث الرصيد في Firestore والسيرفر المركزي
 */
export const WalletService = {
  // الاستماع المباشر للرصيد الحقيقي للمستخدم من فايربيس
  subscribeToUserWallet(userId: string, callback: (wallet: UserWalletData) => void) {
    if (!userId) return () => {};
    const targetId = userId || auth.currentUser?.uid;
    if (!targetId) return () => {};

    const userRef = doc(db, 'users', targetId);
    return onSnapshot(
      userRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const wallet: UserWalletData = {
            coins: typeof data.coins === 'number' ? data.coins : 0,
            diamonds: typeof data.diamonds === 'number' ? data.diamonds : 0,
            totalDiamondsEarned: typeof data.totalDiamondsEarned === 'number' ? data.totalDiamondsEarned : 0,
            totalCoinsSpent: typeof data.totalCoinsSpent === 'number' ? data.totalCoinsSpent : 0
          };

          // تحديث التخزين المحلي وإطلاق الحدث اللحظي لتحديث كافة الشاشات المفتوحة
          try {
            localStorage.setItem('user_wallet_coins', wallet.coins.toString());
          } catch {}

          window.dispatchEvent(
            new CustomEvent('user_coins_updated', {
              detail: { coins: wallet.coins, diamonds: wallet.diamonds, userId: targetId }
            })
          );

          callback(wallet);
        }
      },
      (error) => {
        console.warn('خطأ في الاستماع للرصيد اللحظي من فايربيس:', error);
      }
    );
  },

  // خصم أو إضافة الكونزات أو الألماس (في فايربيس والسيرفر المركزي)
  async updateBalance(userId: string, type: 'coins' | 'diamonds', amount: number): Promise<{ success: boolean; error?: string }> {
    try {
      const targetId = userId || auth.currentUser?.uid;
      if (!targetId) return { success: false, error: 'المعرف غير محدد' };

      const userRef = doc(db, 'users', targetId);
      const updateData: Record<string, any> = {};

      if (type === 'coins') {
        updateData.coins = increment(amount);
        if (amount < 0) updateData.totalCoinsSpent = increment(Math.abs(amount));
      } else if (type === 'diamonds') {
        updateData.diamonds = increment(amount);
        if (amount > 0) updateData.totalDiamondsEarned = increment(amount);
      }

      // محاولة التحديث المباشر في Firestore
      try {
        await updateDoc(userRef, updateData);
      } catch (fErr) {
        console.warn('تنبيه أمان فايربيس، جاري المزامنة عبر السيرفر المركزي:', fErr);
      }

      // المزامنة مع السيرفر المركزي Node.js لضمان استقرار الرصيد
      try {
        await fetch(getApiUrl(`/api/users/${encodeURIComponent(targetId)}/update-balance`), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type, amount })
        });
      } catch (sErr) {
        console.warn('تنبيه مزامنة السيرفر المركزي:', sErr);
      }

      return { success: true };
    } catch (error: any) {
      console.error('خطأ في تحديث الرصيد الحقيقي:', error);
      return { success: false, error: error?.message || 'خطأ غير معروف في تحديث الرصيد' };
    }
  }
};

/**
 * شحن الكوينز وتثبيته في Firebase والسيرفر المركزي في آن واحد
 */
export async function rechargeUserCoins(
  userId: string,
  amount: number,
  options?: RechargeOptions
): Promise<number> {
  const cleanUserId = (userId || '1001001').trim();
  const rechargeAmount = Math.max(0, Math.round(amount));
  if (rechargeAmount <= 0) return getCachedCoins();

  // 1. حساب الرصيد الجديد محلياً
  const currentCoins = getCachedCoins();
  const nextCoins = currentCoins + rechargeAmount;
  try {
    localStorage.setItem('user_wallet_coins', nextCoins.toString());
  } catch {}

  // 2. إطلاق الحدث اللحظي لتحديث كل الشاشات المفتوحة (الروم والبروفايل)
  window.dispatchEvent(
    new CustomEvent('user_coins_updated', {
      detail: { coins: nextCoins, userId: cleanUserId, added: rechargeAmount, source: 'recharge' }
    })
  );

  // 3. التثبيت في قاعدة بيانات Firebase Firestore السحابية
  const targetUid = options?.uid || auth.currentUser?.uid;
  if (targetUid) {
    try {
      const userRef = doc(db, 'users', targetUid);
      await updateDoc(userRef, {
        coins: increment(rechargeAmount),
        lastRechargeAt: serverTimestamp()
      });

      // حفظ إيصال الشحن في الأرشيف
      await addDoc(collection(db, 'users', targetUid, 'recharge_records'), {
        amount: rechargeAmount,
        paymentMethod: options?.paymentMethod || 'card',
        timestamp: serverTimestamp(),
        packageId: options?.packageId || 'custom'
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/${targetUid}`);
    }
  }

  // 4. التثبيت في السيرفر المركزي Node.js لضمان عدم رجوع الرصيد للصفر عند التحديث
  try {
    const res = await fetch(getApiUrl(`/api/users/${encodeURIComponent(cleanUserId)}/recharge`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: rechargeAmount,
        paymentMethod: options?.paymentMethod || 'card',
        packageId: options?.packageId || 'custom'
      })
    });
    if (res.ok) {
      const data = await res.json();
      if (typeof data.coins === 'number') {
        localStorage.setItem('user_wallet_coins', data.coins.toString());
        return data.coins;
      }
    }
  } catch (err) {
    console.warn('Central server recharge sync warning:', err);
  }

  return nextCoins;
}

/**
 * خصم الكوينز عند إرسال الهدايا وتثبيته في Firestore والسيرفر المركزي
 */
export async function deductUserCoins(
  userId: string,
  amount: number,
  options?: DeductOptions
): Promise<number> {
  const cleanUserId = (userId || '1001001').trim();
  const deductAmount = Math.max(0, Math.round(amount));
  if (deductAmount <= 0) return getCachedCoins();

  const currentCoins = getCachedCoins();
  const nextCoins = Math.max(0, currentCoins - deductAmount);
  try {
    localStorage.setItem('user_wallet_coins', nextCoins.toString());
  } catch {}

  window.dispatchEvent(
    new CustomEvent('user_coins_updated', {
      detail: { coins: nextCoins, userId: cleanUserId, deducted: deductAmount, source: 'deduct' }
    })
  );

  // تحديث Firebase Firestore
  const targetUid = options?.uid || auth.currentUser?.uid;
  if (targetUid) {
    try {
      const userRef = doc(db, 'users', targetUid);
      await updateDoc(userRef, {
        coins: increment(-deductAmount),
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/${targetUid}`);
    }
  }

  // تحديث السيرفر المركزي
  try {
    fetch(getApiUrl(`/api/users/${encodeURIComponent(cleanUserId)}/deduct`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: deductAmount,
        reason: options?.reason || 'gift_sent'
      })
    }).catch(() => {});
  } catch {}

  return nextCoins;
}
