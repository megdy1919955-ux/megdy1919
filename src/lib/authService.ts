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
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  runTransaction
} from 'firebase/firestore';
import { setActiveAppRole } from './roleService';

export interface AuthUserData {
  id: string; // المعرف الرقمي للحساب (7 أرقام)
  uid: string; // المعرف السحابي المشفر الفريد من Firebase Auth UID
  name: string;
  avatar: string;
  displayName?: string;
  photoURL?: string;
  email?: string;
  phone?: string | null;
  age?: number | null;
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
  createdAt: any;
  updatedAt?: any;
  lastLoginAt?: string;
  isProfileComplete?: boolean;
  followersCount?: number;
  followingCount?: number;
  sentGiftsCount?: number;
  receivedGiftsCount?: number;
}

export const AUTH_USER_STORAGE_KEY = 'super_legend_auth_user_session';

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
 * جلب بيانات المستخدم المسجل حالياً من الذاكرة الحية أو التخزين الآمن
 */
export function getCurrentAuthUser(): AuthUserData | null {
  if (cachedCurrentUser) return cachedCurrentUser;
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(AUTH_USER_STORAGE_KEY);
    if (raw) {
      const parsed: AuthUserData = JSON.parse(raw);
      cachedCurrentUser = parsed;
      return parsed;
    }
  } catch (e) {
    console.error('Failed to get current auth user:', e);
  }
  // إزالة إرجاع OWNER_USER_ACCOUNT تلقائياً! 
  // إذا لم يكن هناك جلسة، يرجع null ليتجه المستخدم لشاشة الدخول النظيفة
  return null;
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
  if (user) {
    setAuthUserSession(user);
  } else {
    cachedCurrentUser = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_USER_STORAGE_KEY);
      localStorage.removeItem('user_profile_data');
      localStorage.removeItem('user_wallet_coins');
      setActiveAppRole('guest');
      window.dispatchEvent(new CustomEvent('najm_auth_state_changed', { detail: null }));
      window.dispatchEvent(new Event('user_profile_updated'));
      window.dispatchEvent(new CustomEvent('user_coins_updated', { detail: { coins: 0 } }));
    }
    authSubscribers.forEach((cb) => {
      try {
        cb(null);
      } catch (e) {
        console.error('Error notifying auth subscriber:', e);
      }
    });
  }
}

// الـ UID الثابت للمطور في Firebase أو الإيميل
export const DEVELOPER_UID = '0OW7yfypGLgOgwbBHOVtpV8FJ3A3';
export const OWNER_DEV_ID = '1001001';

/**
 * دالة توليد المعرف الرقمي التسلسلي الحقيقي من Firestore بدون تكرار
 * يبدأ من 1001001 للمالك/المطور ويصعد ديناميكياً (1001002, 1001003...)
 * معتمدة كلياً على Transactions السحابية الذرية لمنع تداخل الحسابات نهائياً
 */
export async function getNextSequentialUserId(isOwner: boolean): Promise<string> {
  if (isOwner) {
    return '1001001';
  }

  const counterRef = doc(db, 'counters', 'user_sequence');
  try {
    const nextId = await runTransaction(db, async (transaction) => {
      const counterSnap = await transaction.get(counterRef);
      const BASE_START_ID = 1001001;

      if (!counterSnap.exists()) {
        const initialNext = BASE_START_ID + 1; // 1001002
        transaction.set(counterRef, {
          lastId: initialNext,
          updatedAt: serverTimestamp()
        });
        return initialNext.toString();
      }

      const currentLast = Number(counterSnap.data()?.lastId) || BASE_START_ID;
      const nextVal = currentLast + 1;
      transaction.update(counterRef, {
        lastId: nextVal,
        updatedAt: serverTimestamp()
      });
      return nextVal.toString();
    });

    return nextId;
  } catch (err) {
    console.warn('Falling back from transaction counter:', err);
    return (1001001 + Math.floor(Math.random() * 899999)).toString();
  }
}

/**
 * دالة تسجيل الدخول عبر Google الرسمية من Firebase مع حماية ومقاومة لانقطاع IndexedDB في المتصفح
 */
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  try {
    return await signInWithPopup(auth, provider);
  } catch (error: any) {
    const errorMsg = String(error?.message || '');
    // معالجة الخطأ العابر لـ IndexedDB في متصفحات الجوال عند فتح النافذة المنبثقة
    if (
      errorMsg.includes('Database is closing') ||
      errorMsg.includes('closing/hidden') ||
      error?.code === 'auth/internal-error'
    ) {
      console.warn('Transient IndexedDB connection reset detected during popup. Retrying Google Sign-In...', error);
      await new Promise((res) => setTimeout(res, 400));
      return await signInWithPopup(auth, provider);
    }
    throw error;
  }
};

/**
 * معالجة نتائج توثيق Google ومزامنة بيانات المستخدم سحابياً مع Firestore
 */
export const handleGoogleAuthResult = async (user: any): Promise<{ user: AuthUserData; isNewUser: boolean }> => {
  try {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    const isOwner = user.uid === DEVELOPER_UID || user.email === 'megdy1919@gmail.com' || user.isOwner === true;
    let generatedId = '1001001';
    if (!isOwner) {
      if (userSnap.exists() && userSnap.data()?.id) {
        generatedId = userSnap.data().id;
      } else {
        generatedId = await getNextSequentialUserId(false);
      }
    }

    if (!userSnap.exists()) {
      const cleanName = user.displayName || 'مستخدم جديد';
      const cleanAvatar =
        user.photoURL ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200';

      // مستخدم جديد -> إنشاء مستند بدون قيم undefined
      const newUserPayload: AuthUserData = {
        id: generatedId,
        uid: user.uid,
        name: cleanName,
        displayName: cleanName,
        photoURL: cleanAvatar,
        avatar: cleanAvatar,
        email: user.email || '',
        phone: user.phoneNumber || null, // تجنب undefined نهائياً
        age: null,
        country: 'اليمن',
        bio: 'مرحباً بكم في حسابي على تطبيق النجم! ✨',
        coins: isOwner ? 5000000 : 50000,
        diamonds: isOwner ? 500000 : 0,
        level: isOwner ? 100 : 1,
        vipTier: isOwner ? 'VIP7' : 'VIP1',
        superLegendLevel: isOwner ? 'SL7' : 'SL1',
        role: isOwner ? 'super_admin' : 'regular_user',
        isOwner,
        loginType: 'google',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastLoginAt: 'الآن',
        isProfileComplete: isOwner ? true : false
      };

      await setDoc(userRef, newUserPayload);
      notifySubscribers(newUserPayload);
      return { user: newUserPayload, isNewUser: !isOwner };
    } else {
      // مستخدم مسجل مسبقاً -> جلب بياناته
      const existingData = userSnap.data() as AuthUserData;
      const normalizedUser: AuthUserData = {
        ...existingData,
        id: isOwner ? '1001001' : (existingData.id || generatedId),
        role: isOwner ? 'super_admin' : (existingData.role || 'regular_user'),
        isOwner: isOwner ? true : (existingData.isOwner || false),
        name: existingData.name || existingData.displayName || 'نجم النجوم',
        avatar:
          existingData.avatar ||
          existingData.photoURL ||
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
        coins: existingData.coins ?? (isOwner ? 5000000 : 50000),
        diamonds: existingData.diamonds ?? 0,
        level: existingData.level ?? (isOwner ? 100 : 1),
        vipTier: existingData.vipTier || (isOwner ? 'VIP7' : 'VIP1'),
        superLegendLevel: existingData.superLegendLevel || (isOwner ? 'SL7' : 'SL1')
      };
      notifySubscribers(normalizedUser);
      return { user: normalizedUser, isNewUser: isOwner ? false : !existingData.isProfileComplete };
    }
  } catch (error) {
    console.error('Error during Google Auth Firestore Sync:', error);
    throw error;
  }
};

/**
 * إكمال بيانات الملف الشخصي (الاسم المستعار، العمر، الدولة) للمستخدمين الجدد
 */
export async function completeUserProfile(
  uid: string,
  data: { displayName: string; age: number; country?: string }
): Promise<AuthUserData> {
  const userRef = doc(db, 'users', uid);
  const updates: any = {
    displayName: data.displayName.trim(),
    name: data.displayName.trim(),
    age: data.age,
    country: data.country || 'اليمن',
    isProfileComplete: true,
    updatedAt: serverTimestamp()
  };
  await updateDoc(userRef, updates);
  if (auth.currentUser) {
    updateProfile(auth.currentUser, { displayName: data.displayName.trim() }).catch(() => {});
  }
  const snap = await getDoc(userRef);
  const updated = snap.data() as AuthUserData;
  notifySubscribers(updated);
  return updated;
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
    phone?: string;
  }
): Promise<AuthUserData> {
  const userDocRef = doc(db, 'users', firebaseUser.uid);
  const snap = await getDoc(userDocRef);

  if (snap.exists()) {
    const data = snap.data() as AuthUserData;
    const isOwner = firebaseUser.uid === DEVELOPER_UID || firebaseUser.email === 'megdy1919@gmail.com' || data.isOwner === true;
    const updated: AuthUserData = {
      ...data,
      id: isOwner ? '1001001' : (data.id || Math.floor(1000000 + Math.random() * 9000000).toString()),
      role: isOwner ? 'super_admin' : (data.role || 'regular_user'),
      isOwner: isOwner ? true : (data.isOwner || false),
      phone: extra?.phone || data.phone || firebaseUser.phoneNumber || undefined,
      uid: firebaseUser.uid,
      lastLoginAt: new Date().toISOString()
    };

    // تحديث وقت الدخول في Firestore
    updateDoc(userDocRef, { lastLoginAt: updated.lastLoginAt }).catch(() => {});
    notifySubscribers(updated);
    return updated;
  }

  // حساب جديد كلياً: إنشاء مستند سحابي في Firestore
  const isOwner = firebaseUser.uid === DEVELOPER_UID || firebaseUser.email === 'megdy1919@gmail.com';
  const generatedId = isOwner ? '1001001' : await getNextSequentialUserId(false);
  const defaultAvatars = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
  ];
  const chosenAvatar =
    extra?.avatar ||
    firebaseUser.photoURL ||
    defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];

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
    phone: extra?.phone || firebaseUser.phoneNumber || undefined,
    age: extra?.age || 24,
    country: 'اليمن',
    bio: 'مرحباً بكم في حسابي على تطبيق النجم! ✨',
    coins: 50000, // رصيد كوينز ترحيبي
    diamonds: 0,
    level: 1,
    vipTier: 'VIP1',
    superLegendLevel: 'SL1',
    isOwner,
    role: isOwner ? 'super_admin' : 'regular_user',
    loginType: extra?.loginType || 'email',
    createdAt: new Date().toISOString().split('T')[0],
    lastLoginAt: 'الآن',
    isProfileComplete: extra?.age ? true : false
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
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_USER_STORAGE_KEY);
      localStorage.removeItem('user_profile_data');
      localStorage.removeItem('user_wallet_coins');
    }
    await signOut(auth);
  } catch (e) {
    console.error('Failed to sign out from Firebase:', e);
  }
  notifySubscribers(null);
}

/**
 * حفظ جلسة المستخدم والتأكد من عدم تسريب شارات أو رصيد المالك للمستخدمين الجدد
 */
export function setAuthUserSession(user: AuthUserData): void {
  if (typeof window === 'undefined') return;
  try {
    cachedCurrentUser = user;

    // 1. مسح البيانات القديمة لعدم تسريب شارات أو رصيد المالك للحساب الجديد
    localStorage.removeItem('user_profile_data');
    localStorage.removeItem('user_wallet_coins');

    // 2. حفظ بيانات المستخدم الحقيقي الجديد
    localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));

    // 3. التحقق الصارم من كون المستخدم هو المالك (حسب UID المطور أو بريده الإلكتروني)
    const isRealOwner = user.uid === DEVELOPER_UID || user.email === 'megdy1919@gmail.com' || user.isOwner === true || user.id === '1001001';

    const profileToSave = {
      name: user.name || user.displayName || 'مستخدم جديد',
      id: isRealOwner ? '1001001' : (user.id || user.uid),
      country: user.country || 'اليمن',
      followers: isRealOwner ? 5365 : 0, // 0 للمستخدم الجديد وليست أرقام المالك
      following: isRealOwner ? 120 : 0,
      bio: user.bio || 'مرحباً بك في حسابي!',
      age: user.age || 22,
      superLegendLevel: isRealOwner ? user.superLegendLevel : 'SL1',
      vipLevel: isRealOwner ? user.vipTier : 'VIP0',
      avatar: user.avatar || user.photoURL,
      coins: isRealOwner ? user.coins : 0, // عدم إعطاء ملايين الكوينز للمستخدم الجديد
      diamonds: isRealOwner ? user.diamonds : 0
    };

    localStorage.setItem('user_profile_data', JSON.stringify(profileToSave));
    localStorage.setItem('user_wallet_coins', (profileToSave.coins || 0).toString());

    // 4. ضبط الدور الحقيقي
    if (isRealOwner) {
      setActiveAppRole('developer');
    } else {
      setActiveAppRole('guest');
    }

    // إخطار كافة المشتركين بالبيانات المحدثة
    authSubscribers.forEach((cb) => {
      try {
        cb(user);
      } catch (err) {
        console.error('Error notifying auth subscriber:', err);
      }
    });

    // إطلاق أحداث التحديث
    window.dispatchEvent(new CustomEvent('najm_auth_state_changed', { detail: user }));
    window.dispatchEvent(new Event('user_profile_updated'));
    window.dispatchEvent(new CustomEvent('user_coins_updated', { detail: { coins: profileToSave.coins || 0 } }));
  } catch (e) {
    console.error('Failed to set auth user session:', e);
  }
}

