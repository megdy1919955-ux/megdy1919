/**
 * خدمة المحفظة المركزية الموحدة (Central Wallet Service)
 * تضمن استقرار وتخزين رصيد الكوينز في:
 * 1. Firebase Firestore السحابية (دائم لا يضيع بالتحديث)
 * 2. سيرفر Node.js المركزي (Server-authoritative)
 * 3. التخزين المحلي والأحداث اللحظية (WebSockets / CustomEvents)
 */

import { doc, updateDoc, increment, serverTimestamp, addDoc, collection } from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from './firebase';
import { getApiUrl } from './apiConfig';

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
