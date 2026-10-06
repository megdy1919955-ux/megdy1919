/**
 * خدمة إدارة حسابات ومصادقة المستخدم السحابية (Firebase Cloud Auth & Firestore Service)
 * ربط كلي وحقيقي عبر Firebase Authentication وقاعدة البيانات السحابية Cloud Firestore
 * تعتمد كلياً على المعرف الفريد UID السحابي مع إلغاء كافة البيانات والرموز المحلية المكشوفة
 * تطبيق النجم (Al-Najm Live)
 */

import { auth, db } from './firebase';
import {
  onAuthStateChanged,
  signOut,
  updateProfile,
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { setActiveAppRole } from './roleService';

export interface AuthUserData {
  id: string; // المعرف الرقمي للحساب (7 أرقام)
  uid: string; // المعرف السحابي المشفر الفريد من Firebase Auth UID
  name: string;
  avatar: string;
  email?: string;
  phone?: string;
  age?: number;
  country?: string;
  bio?: string;
  coins: number;
  diamonds: number;
  level: number;
  vipTier: string;
  superLegendLevel: string;
  isOwner: boolean;
  role: 'super_admin' | 'regular_user';
  loginType: 'phone' | 'email' | 'google' | 'guest';
  createdAt: string;
  lastLoginAt?: string;
}

let cachedCurrentUser: AuthUserData | null = null;
let isAuthInitializedState = false;
const authSubscribers = new Set<(user: AuthUserData | null) => void>();
const authReadySubscribers = new Set<(ready: boolean) => void>();

/**
 * فحص هل تم الانتهاء من فحص حالة الجلسة الأولية من Firebase
 */
export function isAuthReady(): boolean {
  return isAuthInitializedState;
}

/**
 * الاشتراك في حدث جاهزية جلسة Firebase
 */
export function subscribeToAuthReady(callback: (ready: boolean) => void): () => void {
  authReadySubscribers.add(callback);
  callback(isAuthInitializedState);
  return () => {
    authReadySubscribers.delete(callback);
  };
}

/**
 * جلب بيانات المستخدم المسجل حالياً من الذاكرة الحية
 */
export function getCurrentAuthUser(): AuthUserData | null {
  return cachedCurrentUser;
}

/**
 * الاشتراك التفاعلي المباشر في حالة المصادقة من Firebase
 */
export function subscribeToAuthUser(callback: (user: AuthUserData | null) => void): () => void {
  authSubscribers.add(callback);
  callback(cachedCurrentUser);
  return () => {
    authSubscribers.delete(callback);
  };
}

function notifySubscribers(user: AuthUserData | null) {
  cachedCurrentUser = user;
  authSubscribers.forEach((cb) => {
    try {
      cb(user);
    } catch (e) {
      console.error('Error notifying auth subscriber:', e);
    }
  });

  // تحديث الصلاحية العامة في التطبيق ديناميكياً بناءً على بيانات السحابة المحفوظة بـ Firestore
  if (user) {
    if (user.role === 'super_admin' || user.isOwner) {
      setActiveAppRole('developer');
    } else {
      setActiveAppRole('guest');
    }
  }

  // إطلاق أحداث التحديث العامة
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('najm_auth_state_changed', { detail: user }));
    if (user) {
      window.dispatchEvent(new Event('user_profile_updated'));
      window.dispatchEvent(new CustomEvent('user_coins_updated', { detail: { coins: user.coins } }));
    }
  }
}

/**
 * مزامنة مستخدم Firebase Auth مع قاعدة بيانات Cloud Firestore بناءً على UID
 */
export async function syncUserWithFirestore(
  firebaseUser: FirebaseUser,
  extra?: {
    displayName?: string;
    age?: number;
    loginType?: 'email' | 'phone' | 'google' | 'guest';
    avatar?: string;
  }
): Promise<AuthUserData> {
  const userDocRef = doc(db, 'users', firebaseUser.uid);
  const snap = await getDoc(userDocRef);

  if (snap.exists()) {
    const data = snap.data() as AuthUserData;
    const updated: AuthUserData = {
      ...data,
      uid: firebaseUser.uid,
      lastLoginAt: new Date().toISOString()
    };

    // تحديث وقت الدخول في Firestore
    updateDoc(userDocRef, { lastLoginAt: updated.lastLoginAt }).catch(() => {});
    notifySubscribers(updated);
    return updated;
  }

  // حساب جديد كلياً: إنشاء مستند سحابي في Firestore
  const generatedId = Math.floor(1000000 + Math.random() * 9000000).toString();
  const defaultAvatars = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
  ];
  const chosenAvatar = extra?.avatar || firebaseUser.photoURL || defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];

  let name = extra?.displayName?.trim() || firebaseUser.displayName?.trim();
  if (!name) {
    if (firebaseUser.email) {
      name = firebaseUser.email.split('@')[0];
    } else {
      name = `نجم_${generatedId.slice(-4)}`;
    }
  }

  const newAccount: AuthUserData = {
    id: generatedId,
    uid: firebaseUser.uid,
    name,
    avatar: chosenAvatar,
    email: firebaseUser.email || undefined,
    phone: firebaseUser.phoneNumber || undefined,
    age: extra?.age || 24,
    country: 'اليمن',
    bio: 'مرحباً بكم في حسابي على تطبيق النجم! ✨',
    coins: 50000, // رصيد كوينز ترحيبي
    diamonds: 0,
    level: 1,
    vipTier: 'VIP1',
    superLegendLevel: 'SL1',
    isOwner: false,
    role: 'regular_user',
    loginType: extra?.loginType || 'email',
    createdAt: new Date().toISOString().split('T')[0],
    lastLoginAt: 'الآن'
  };

  await setDoc(userDocRef, newAccount);
  notifySubscribers(newAccount);
  return newAccount;
}

/**
 * الاستماع الدائم لحالة المصادقة من خوادم Firebase
 */
if (typeof window !== 'undefined') {
  onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      try {
        await syncUserWithFirestore(firebaseUser);
      } catch (err) {
        console.warn('Failed to sync auth user from Firestore:', err);
      }
    } else {
      notifySubscribers(null);
    }

    if (!isAuthInitializedState) {
      isAuthInitializedState = true;
      authReadySubscribers.forEach((cb) => {
        try {
          cb(true);
        } catch (e) {
          console.error('Error notifying auth ready subscriber:', e);
        }
      });
    }
  });
}

/**
 * تحديث بيانات البروفايل في السحابة ومزامنتها في Firestore
 */
export async function updateUserCloudProfile(updates: Partial<AuthUserData>): Promise<void> {
  const current = cachedCurrentUser;
  if (!current || !auth.currentUser) return;

  const merged = { ...current, ...updates };
  const userDocRef = doc(db, 'users', auth.currentUser.uid);
  await updateDoc(userDocRef, updates as any);

  if (updates.name && auth.currentUser) {
    updateProfile(auth.currentUser, { displayName: updates.name }).catch(() => {});
  }

  notifySubscribers(merged);
}

/**
 * تسجيل الخروج الرسمي من خوادم Firebase
 */
export async function logoutUserSession(): Promise<void> {
  try {
    await signOut(auth);
  } catch (e) {
    console.error('Failed to sign out from Firebase:', e);
  }
  notifySubscribers(null);
}

// دالة توافقية مع الأنظمة الداخلية
export function setAuthUserSession(user: AuthUserData): void {
  notifySubscribers(user);
}
