/**
 * خدمة المزامنة السحابية الحية للمستخدمين والرصيد (Live User & Balance Cloud Sync Service)
 * مرتبطة مباشرة بـ Firebase Firestore بمشروع (ainajm)
 * تطبيق النجم (Al-Najm)
 */

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  increment
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { getCurrentAuthUser, setAuthUserSession, AuthUserData, OWNER_USER_ACCOUNT, OWNER_DEV_ID } from './authService';

export interface SyncedUserProfile {
  id: string;
  name: string;
  avatar: string;
  email?: string;
  phone?: string;
  coins: number;
  diamonds: number;
  level: number;
  sender_exp?: number;
  sender_level?: number;
  receiver_exp?: number;
  receiver_level?: number;
  vipTier: string;
  role: 'super_admin' | 'regular_user';
  updatedAt: string;
  createdAt?: string;
}

const USERS_COLLECTION = 'users';

let activeUnsubscribe: (() => void) | null = null;
let currentSyncedUserId: string | null = null;

/**
 * تهيئة المستخدم في Firestore إذا لم يكن موجوداً، أو مزامنته فوراً
 */
export async function ensureUserInFirestore(user: AuthUserData): Promise<void> {
  const userRef = doc(db, USERS_COLLECTION, user.id);
  const path = `${USERS_COLLECTION}/${user.id}`;

  try {
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      const initialPayload: SyncedUserProfile = {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        email: user.email || '',
        phone: user.phone || '',
        coins: user.coins ?? 100000000,
        diamonds: user.diamonds ?? 8377,
        level: user.level ?? 88,
        vipTier: user.vipTier || 'VIP8',
        role: user.role || 'regular_user',
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };
      await setDoc(userRef, initialPayload, { merge: true });
      console.log(`[Firestore Sync] User ${user.id} initialized successfully in cloud.`);
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.includes('permission') || msg.includes('insufficient') || msg.includes('PERMISSION_DENIED')) {
      console.warn(`[Firestore Rules Note] Permission denied on ${path}. Please update Firestore rules in Firebase console.`);
      return;
    }
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * بدء الاستماع الحي (Real-time Listener) لتغييرات رصيد وبيانات المستخدم
 * أي تعديل في فايربيس كونسول أو لوحة التحكم الخارجية ينعكس في التطبيق فوراً
 */
export function startLiveUserSync(
  userId?: string,
  onUpdateCallback?: (profile: SyncedUserProfile) => void
): () => void {
  const current = getCurrentAuthUser();
  const targetId = userId || current?.id || OWNER_DEV_ID;

  // تجنب تكرار الاستماع لنفس المستخدم إذا كان نشطاً بالفعل
  if (currentSyncedUserId === targetId && activeUnsubscribe) {
    return activeUnsubscribe;
  }

  if (activeUnsubscribe) {
    activeUnsubscribe();
    activeUnsubscribe = null;
  }

  currentSyncedUserId = targetId;
  const userRef = doc(db, USERS_COLLECTION, targetId);
  const path = `${USERS_COLLECTION}/${targetId}`;

  // تأكد من وجود وثيقة المستخدم في الخلفية
  if (current) {
    ensureUserInFirestore(current).catch(() => {});
  }

  activeUnsubscribe = onSnapshot(
    userRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as SyncedUserProfile;
        const freshCoins = typeof data.coins === 'number' ? data.coins : Number(data.coins) || 0;

        // تحديث الجلسة المحلية بهدوء
        const localUser = getCurrentAuthUser();
        if (localUser && localUser.id === targetId) {
          const updatedUser: AuthUserData = {
            ...localUser,
            name: data.name || localUser.name,
            avatar: data.avatar || localUser.avatar,
            coins: freshCoins,
            diamonds: typeof data.diamonds === 'number' ? data.diamonds : localUser.diamonds,
            level: typeof data.level === 'number' ? data.level : (typeof data.sender_level === 'number' ? data.sender_level : localUser.level),
            sender_exp: typeof data.sender_exp === 'number' ? data.sender_exp : localUser.sender_exp,
            sender_level: typeof data.sender_level === 'number' ? data.sender_level : localUser.sender_level,
            receiver_exp: typeof data.receiver_exp === 'number' ? data.receiver_exp : localUser.receiver_exp,
            receiver_level: typeof data.receiver_level === 'number' ? data.receiver_level : localUser.receiver_level,
            vipTier: data.vipTier || localUser.vipTier,
            role: data.role || localUser.role
          };
          setAuthUserSession(updatedUser);
        }

        // إشعار كافة أجزاء التطبيق بتحديث الرصيد اللحظي
        localStorage.setItem('user_wallet_coins', freshCoins.toString());
        window.dispatchEvent(
          new CustomEvent('user_coins_updated', {
            detail: { coins: freshCoins, userId: targetId }
          })
        );

        if (onUpdateCallback) {
          onUpdateCallback({ ...data, coins: freshCoins });
        }
      } else {
        // إذا لم تكن الوثيقة موجودة بعد، قم بإنشائها
        const fallback = current || OWNER_USER_ACCOUNT;
        ensureUserInFirestore(fallback).catch(() => {});
      }
    },
    (error) => {
      const msg = error instanceof Error ? error.message : String(error);
      if (
        msg.includes('permission') ||
        msg.includes('insufficient') ||
        msg.includes('PERMISSION_DENIED') ||
        msg.includes('closing') ||
        msg.includes('hidden') ||
        msg.includes('unavailable')
      ) {
        console.warn(`[Firestore Listener Notice] ${msg} on ${path}. Continuing with local profile state.`);
        return;
      }
      handleFirestoreError(error, OperationType.GET, path);
    }
  );

  return () => {
    if (activeUnsubscribe) {
      activeUnsubscribe();
      activeUnsubscribe = null;
      currentSyncedUserId = null;
    }
  };
}

/**
 * تعديل رصيد الكوينز (خصم أو إضافة) بشكل ذري وسحابي
 * @param delta قيمة موجبة للإيداع والشحن، سالبة للشراء وإرسال الهدايا
 */
export async function modifyUserCoins(userId: string, delta: number): Promise<number> {
  const userRef = doc(db, USERS_COLLECTION, userId);
  const path = `${USERS_COLLECTION}/${userId}`;

  // تحديث محلي سريع مسبق لتجنب أي تأخير بصري
  const localUser = getCurrentAuthUser();
  if (localUser && localUser.id === userId) {
    const optimisticCoins = Math.max(0, (localUser.coins || 0) + delta);
    setAuthUserSession({ ...localUser, coins: optimisticCoins });
  }

  try {
    await updateDoc(userRef, {
      coins: increment(delta),
      updatedAt: new Date().toISOString()
    });

    const snap = await getDoc(userRef);
    const updatedCoins = snap.data()?.coins ?? 0;
    return updatedCoins;
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.includes('permission') || msg.includes('insufficient') || msg.includes('PERMISSION_DENIED')) {
      console.warn(`[Firestore Rules Note] Write permission denied on ${path}. Updating local state.`);
      return localUser?.coins || 0;
    }

    // في حالة عدم وجود الوثيقة مسبقاً، ننشئها ونضع الرصيد الجديد
    try {
      const fallbackUser = localUser || OWNER_USER_ACCOUNT;
      const initialCoins = Math.max(0, (fallbackUser.coins || 0) + delta);
      await setDoc(
        userRef,
        {
          id: userId,
          name: fallbackUser.name,
          avatar: fallbackUser.avatar,
          coins: initialCoins,
          diamonds: fallbackUser.diamonds || 0,
          level: fallbackUser.level || 1,
          vipTier: fallbackUser.vipTier || 'VIP1',
          role: fallbackUser.role || 'regular_user',
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString()
        },
        { merge: true }
      );
      return initialCoins;
    } catch (innerError) {
      const innerMsg = innerError instanceof Error ? innerError.message : String(innerError);
      if (innerMsg.includes('permission') || innerMsg.includes('insufficient') || innerMsg.includes('PERMISSION_DENIED')) {
        return localUser?.coins || 0;
      }
      handleFirestoreError(innerError, OperationType.WRITE, path);
      return localUser?.coins || 0;
    }
  }
}

/**
 * تعيين رصيد الكوينز مباشرة بقيمة محددة (للشحن من لوحة التحكم أو الإدارة)
 */
export async function setUserExactCoins(userId: string, exactCoins: number): Promise<void> {
  const userRef = doc(db, USERS_COLLECTION, userId);
  const path = `${USERS_COLLECTION}/${userId}`;

  try {
    await setDoc(
      userRef,
      {
        id: userId,
        coins: Math.max(0, exactCoins),
        updatedAt: new Date().toISOString()
      },
      { merge: true }
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.includes('permission') || msg.includes('insufficient') || msg.includes('PERMISSION_DENIED')) {
      console.warn(`[Firestore Rules Note] Permission denied for setUserExactCoins on ${path}.`);
      return;
    }
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
