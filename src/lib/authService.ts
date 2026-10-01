/**
 * خدمة إدارة حسابات ومصادقة المستخدم (Authentication & User Session Service)
 * تدفق تسجيل الدخول عبر Google مع شاشة التهيئة والتخصيص (Onboarding Flow)
 * وتخصيص معرف المستخدم التسلسلي (Sequential User ID) يبدأ من 1001001
 * تطبيق النجم (Al-Najm)
 */

import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  limit,
  runTransaction
} from 'firebase/firestore';
import { auth, db } from './firebase';
import { OWNER_DEV_ID } from './adminRoleService';
import { setActiveAppRole } from './roleService';

export { OWNER_DEV_ID };

export interface AuthUserData {
  id: string; // المعرف التسلسلي الدائم يبدأ من 1001001
  name: string; // الاسم المستعار المفضل
  avatar: string;
  email?: string; // بريد Google كمعرف أمان رئيسي
  phone?: string;
  country?: string; // الدولة
  age?: number; // العمر
  gender?: 'male' | 'female'; // الجنس
  hasCompletedOnboarding?: boolean; // اكتمال شاشة التهيئة الأولى
  googleUid?: string; // معرّف Google في Firebase Auth
  bio?: string;
  coins: number;
  diamonds: number;
  level: number;
  sender_exp?: number;
  sender_level?: number;
  receiver_exp?: number;
  receiver_level?: number;
  vipTier: string;
  superLegendLevel: string;
  isOwner: boolean;
  role: 'super_admin' | 'regular_user';
  loginType: 'phone' | 'email' | 'google' | 'guest';
  createdAt: string;
  lastLoginAt?: string;
}

const AUTH_USER_STORAGE_KEY = 'najm_authenticated_user_v1';
const SAVED_DEVICE_ACCOUNTS_KEY = 'najm_device_accounts_list_v1';

// الحساب الافتراضي للمالك والمطور (أبو أمجد) - أول معرّف في النظام
export const OWNER_USER_ACCOUNT: AuthUserData = {
  id: '1001001',
  name: 'أبو أمجد',
  avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=400',
  email: 'megdy1919@gmail.com',
  phone: '+967 770000000',
  country: 'اليمن',
  age: 32,
  gender: 'male',
  hasCompletedOnboarding: true,
  bio: 'مدير الإدارة ومدير الوكالة الرسمية 👑 ⭐',
  coins: 100000000,
  diamonds: 8377,
  level: 88,
  sender_exp: 2475000,
  sender_level: 100,
  receiver_exp: 1914000,
  receiver_level: 88,
  vipTier: 'VIP8',
  superLegendLevel: 'SL3',
  isOwner: true,
  role: 'super_admin',
  loginType: 'google',
  createdAt: '2026-01-01',
  lastLoginAt: 'الآن'
};

export const OWNER_ACCESS_PIN = '1919';

/**
 * التحقق من صلاحية المالك والمطور الرئيسي
 */
export function isOwnerEmailOrId(email?: string | null, id?: string | null): boolean {
  if (id && (id === OWNER_DEV_ID || id === '1001001')) return true;
  if (!email) return false;
  const clean = email.trim().toLowerCase();
  return (
    clean === 'megdy1919@gmail.com' ||
    clean === 'megdy1919955@gmail.com' ||
    clean.includes('megdy1919')
  );
}

export function verifyOwnerCredentials(pinOrEmail: string): boolean {
  const clean = pinOrEmail.trim().toLowerCase();
  return (
    clean === OWNER_ACCESS_PIN ||
    clean === 'megdy1919@gmail.com' ||
    clean === 'megdy1919955@gmail.com' ||
    clean === '1001001' ||
    clean === 'mgr-9901' ||
    clean === '9901-mgr' ||
    clean === OWNER_DEV_ID.toLowerCase()
  );
}

/**
 * توليد المعرف التسلسلي الجديد للمستخدمين الجدد يبدأ من 1001001
 * الحساب الأول (المالك والمطور): 1001001
 * الحسابات التالية: 1001002, 1001003, ...
 */
export async function allocateNextSequentialUserId(): Promise<string> {
  const counterRef = doc(db, 'app_meta', 'user_id_sequence');
  try {
    const nextVal = await runTransaction(db, async (transaction) => {
      const snap = await transaction.get(counterRef);
      let nextId = 1001002;
      if (snap.exists()) {
        const last = snap.data()?.lastAssignedId;
        if (typeof last === 'number' && last >= 1001001) {
          nextId = last + 1;
        }
      }
      transaction.set(
        counterRef,
        {
          id: 'user_id_sequence',
          lastAssignedId: nextId,
          version: 1,
          updatedAt: new Date().toISOString()
        },
        { merge: true }
      );
      return nextId;
    });

    localStorage.setItem('najm_last_assigned_seq_id', nextVal.toString());
    return nextVal.toString();
  } catch (err) {
    console.warn('[Sequential ID Transaction fallback]:', err);
    const localLast = localStorage.getItem('najm_last_assigned_seq_id');
    const parsed = localLast ? parseInt(localLast, 10) : 1001001;
    const nextVal = isNaN(parsed) ? 1001002 : Math.max(parsed + 1, 1001002);
    localStorage.setItem('najm_last_assigned_seq_id', nextVal.toString());
    return nextVal.toString();
  }
}

/**
 * البحث عن حساب المستخدم في Firestore بواسطة البريد الإلكتروني الخاص بـ Google
 */
export async function findUserByGoogleEmail(email: string): Promise<AuthUserData | null> {
  const cleanEmail = email.trim().toLowerCase();
  if (isOwnerEmailOrId(cleanEmail, null)) {
    return OWNER_USER_ACCOUNT;
  }

  try {
    const usersCol = collection(db, 'users');
    const q = query(usersCol, where('email', '==', cleanEmail), limit(1));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const docData = snap.docs[0].data();
      const userId = snap.docs[0].id;
      return {
        id: userId,
        name: docData.name,
        avatar: docData.avatar,
        email: docData.email,
        phone: docData.phone,
        country: docData.country,
        age: docData.age,
        hasCompletedOnboarding: docData.hasCompletedOnboarding === true,
        googleUid: docData.googleUid,
        bio: docData.bio,
        coins: typeof docData.coins === 'number' ? docData.coins : 50000,
        diamonds: typeof docData.diamonds === 'number' ? docData.diamonds : 100,
        level: typeof docData.level === 'number' ? docData.level : 1,
        sender_exp: typeof docData.sender_exp === 'number' ? docData.sender_exp : 0,
        sender_level: typeof docData.sender_level === 'number' ? docData.sender_level : 1,
        receiver_exp: typeof docData.receiver_exp === 'number' ? docData.receiver_exp : 0,
        receiver_level: typeof docData.receiver_level === 'number' ? docData.receiver_level : 1,
        vipTier: docData.vipTier || 'VIP1',
        superLegendLevel: docData.superLegendLevel || 'SL1',
        isOwner: false,
        role: docData.role || 'regular_user',
        loginType: 'google',
        createdAt: docData.createdAt || new Date().toISOString().split('T')[0],
        lastLoginAt: 'الآن'
      };
    }
  } catch (err) {
    console.warn('[findUserByGoogleEmail error]:', err);
  }

  // فحص الحسابات المحفوظة محلياً على هذا الجهاز
  const saved = getSavedDeviceAccounts();
  const match = saved.find((acc) => acc.email?.toLowerCase() === cleanEmail);
  if (match) {
    return match;
  }

  return null;
}

/**
 * جلب بيانات المستخدم المسجل حالياً من التخزين المحلي
 */
export function getCurrentAuthUser(): AuthUserData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(AUTH_USER_STORAGE_KEY);
    if (raw) {
      const user: AuthUserData = JSON.parse(raw);
      if (user.id === 'YE1330000' || user.name === '(عابرسبيل)') {
        user.id = '1001001';
        user.name = 'أبو أمجد';
        user.hasCompletedOnboarding = true;
        localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
      }
      return user;
    }
  } catch (e) {
    console.error('Failed to get current auth user:', e);
  }
  return null;
}

/**
 * جلب قائمة الحسابات المحفوظة على هذا الجوال
 */
export function getSavedDeviceAccounts(): AuthUserData[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SAVED_DEVICE_ACCOUNTS_KEY);
    if (raw) {
      const accounts: AuthUserData[] = JSON.parse(raw);
      if (Array.isArray(accounts)) {
        return accounts;
      }
    }
  } catch (e) {
    console.error('Failed to get device accounts:', e);
  }
  return [];
}

/**
 * حفظ الحساب في قائمة حسابات الجوال لسهولة استرجاعه
 */
export function saveAccountToDevice(account: AuthUserData): void {
  if (typeof window === 'undefined') return;
  try {
    const accounts = getSavedDeviceAccounts();
    const existingIndex = accounts.findIndex(
      (a) => (a.email && a.email === account.email) || a.id === account.id
    );

    const updatedAccount = {
      ...account,
      lastLoginAt: 'منذ لحظات'
    };

    let updatedList: AuthUserData[];
    if (existingIndex >= 0) {
      updatedList = [...accounts];
      updatedList[existingIndex] = updatedAccount;
    } else {
      updatedList = [updatedAccount, ...accounts];
    }

    localStorage.setItem(SAVED_DEVICE_ACCOUNTS_KEY, JSON.stringify(updatedList));
  } catch (e) {
    console.error('Failed to save account to device list:', e);
  }
}

/**
 * حفظ جلسة تسجيل الدخول وتحديث البروفايل ورصيد الكوينز والصلاحيات
 */
export function setAuthUserSession(user: AuthUserData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));

    // حفظ الحساب ضمن حسابات الجوال
    saveAccountToDevice(user);

    // مزامنة ملف البروفايل العام
    const profileToSave = {
      name: user.name,
      id: user.id,
      country: user.country || 'اليمن',
      age: user.age || 24,
      followers: user.isOwner ? 5365 : 12,
      following: user.isOwner ? 120 : 5,
      bio: user.bio || '',
      superLegendLevel: user.superLegendLevel || 'SL1',
      vipLevel: user.vipTier || 'VIP1',
      avatar: user.avatar,
      album: {}
    };
    localStorage.setItem('user_profile_data', JSON.stringify(profileToSave));

    // مزامنة محفظة الكوينز
    localStorage.setItem('user_wallet_coins', user.coins.toString());

    // مزامنة الصلاحية الإدارية
    if (user.isOwner || user.id === OWNER_DEV_ID || user.id === '1001001') {
      setActiveAppRole('developer');
      localStorage.setItem('super_legend_current_active_user_id', OWNER_DEV_ID);
    } else {
      setActiveAppRole('guest');
      localStorage.setItem('super_legend_current_active_user_id', user.id);
    }

    // إطلاق أحداث التحديث للنظام كاملاً
    window.dispatchEvent(new CustomEvent('najm_auth_state_changed', { detail: user }));
    window.dispatchEvent(new Event('user_profile_updated'));
    window.dispatchEvent(new CustomEvent('user_coins_updated', { detail: { coins: user.coins } }));
  } catch (e) {
    console.error('Failed to set auth user session:', e);
  }
}

/**
 * إكمال وحفظ بيانات التهيئة للمستخدم الجديد (Onboarding Completion)
 * تحفظ الاسم المستعار المفضل، العمر، والدولة وتعيين hasCompletedOnboarding = true
 */
export async function completeUserOnboarding(params: {
  userId: string;
  name: string;
  age: number;
  country: string;
  avatar?: string;
}): Promise<AuthUserData> {
  const current = getCurrentAuthUser();
  const userId = params.userId || current?.id;
  if (!userId) throw new Error('لا يوجد مستخدم نشط لتحديث بياناته');

  const userRef = doc(db, 'users', userId);
  const updatedFields = {
    name: params.name.trim(),
    age: Number(params.age),
    country: params.country,
    avatar:
      params.avatar ||
      current?.avatar ||
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
    hasCompletedOnboarding: true,
    updatedAt: new Date().toISOString()
  };

  try {
    await updateDoc(userRef, updatedFields);
  } catch (err) {
    console.warn('[Firestore updateDoc error on onboarding]:', err);
    try {
      await setDoc(userRef, { id: userId, ...updatedFields }, { merge: true });
    } catch (setErr) {
      console.warn('[Firestore setDoc error on onboarding]:', setErr);
    }
  }

  const updatedUser: AuthUserData = {
    ...(current || OWNER_USER_ACCOUNT),
    id: userId,
    name: params.name.trim(),
    age: Number(params.age),
    country: params.country,
    avatar: updatedFields.avatar,
    hasCompletedOnboarding: true
  };

  setAuthUserSession(updatedUser);
  return updatedUser;
}

/**
 * معالجة مستخدم Google ومزامنته مع قاعدة البيانات:
 * - اعتماد البريد الإلكتروني كمعرّف أمان رئيسي
 * - فحص ما إذا كان الحساب جديداً أو لم يستكمل التهيئة بعد
 * - تخصيص ID تسلسلي يبدأ من 1001001
 */
export async function handleFirebaseUserLogin(fbUser: FirebaseUser): Promise<AuthUserData> {
  const realEmail = fbUser.email?.trim().toLowerCase() || '';
  const isOwner = isOwnerEmailOrId(realEmail, fbUser.uid);

  // 1. حساب المالك والمطور الرئيسي (أبو أمجد)
  if (isOwner) {
    const ownerData: AuthUserData = {
      ...OWNER_USER_ACCOUNT,
      googleUid: fbUser.uid,
      hasCompletedOnboarding: true
    };
    // حفظ وثيقة المالك في Firestore
    try {
      await setDoc(doc(db, 'users', '1001001'), {
        ...ownerData,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch {}
    setAuthUserSession(ownerData);
    return ownerData;
  }

  // 2. البحث عما إذا كان هذا البريد مسجلاً مسبقاً في قاعدة البيانات
  const existingUser = await findUserByGoogleEmail(realEmail);
  if (existingUser) {
    // تم العثور على حساب مسبق
    const userToSave: AuthUserData = {
      ...existingUser,
      googleUid: fbUser.uid,
      lastLoginAt: 'الآن'
    };

    try {
      await setDoc(
        doc(db, 'users', existingUser.id),
        {
          googleUid: fbUser.uid,
          lastLoginAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        { merge: true }
      );
    } catch {}

    setAuthUserSession(userToSave);
    return userToSave;
  }

  // 3. حساب جديد بالكامل -> تخصيص ID تسلسلي جديد يبدأ من 1001001
  const newSequentialId = await allocateNextSequentialUserId();
  const defaultName = fbUser.displayName?.trim() || realEmail.split('@')[0] || `نجم_${newSequentialId.slice(-4)}`;
  const defaultAvatar =
    fbUser.photoURL ||
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200';

  const newUserData: AuthUserData = {
    id: newSequentialId, // المعرف التسلسلي الجديد
    name: defaultName,
    avatar: defaultAvatar,
    email: realEmail, // معرّف الأمان الرئيسي
    googleUid: fbUser.uid,
    country: 'اليمن',
    age: 24,
    hasCompletedOnboarding: false, // يجب إكمال شاشة التهيئة للمرة الأولى!
    coins: 50000,
    diamonds: 100,
    level: 1,
    sender_exp: 0,
    sender_level: 1,
    receiver_exp: 0,
    receiver_level: 1,
    vipTier: 'VIP1',
    superLegendLevel: 'SL1',
    isOwner: false,
    role: 'regular_user',
    loginType: 'google',
    createdAt: new Date().toISOString().split('T')[0],
    lastLoginAt: 'الآن'
  };

  // حفظ الحساب الأولي في Firestore
  try {
    await setDoc(doc(db, 'users', newSequentialId), {
      ...newUserData,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.warn('[Firestore Initial User setDoc error]:', err);
  }

  setAuthUserSession(newUserData);
  return newUserData;
}

/**
 * موفر مصادقة Google الرسمي
 */
export const googleAuthProvider = new GoogleAuthProvider();
googleAuthProvider.setCustomParameters({
  prompt: 'select_account'
});

/**
 * تسجيل الدخول المباشر بحساب Google بالمعرف والبريد الحقيقي
 * يُستخدم كمسار مباشر أو عند عدم إضافة نطاق المعاينة إلى Authorized Domains في Firebase Console
 */
export async function signInWithGoogleAccountEmail(
  email: string,
  displayName?: string,
  photoURL?: string
): Promise<AuthUserData> {
  const cleanEmail = email.trim().toLowerCase();
  const isOwner = isOwnerEmailOrId(cleanEmail, null);

  if (isOwner) {
    const ownerData: AuthUserData = {
      ...OWNER_USER_ACCOUNT,
      hasCompletedOnboarding: true
    };
    try {
      await setDoc(doc(db, 'users', '1001001'), {
        ...ownerData,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch {}
    setAuthUserSession(ownerData);
    return ownerData;
  }

  // البحث عما إذا كان هذا البريد مسجلاً مسبقاً
  const existingUser = await findUserByGoogleEmail(cleanEmail);
  if (existingUser) {
    const userToSave: AuthUserData = {
      ...existingUser,
      lastLoginAt: 'الآن'
    };
    setAuthUserSession(userToSave);
    return userToSave;
  }

  // حساب جديد -> تخصيص ID تسلسلي
  const newSequentialId = await allocateNextSequentialUserId();
  const realName = displayName?.trim() || cleanEmail.split('@')[0] || `نجم_${newSequentialId.slice(-4)}`;
  const realAvatar =
    photoURL ||
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200';

  const newUserData: AuthUserData = {
    id: newSequentialId,
    name: realName,
    avatar: realAvatar,
    email: cleanEmail,
    country: 'اليمن',
    age: 24,
    hasCompletedOnboarding: false, // تفعيل شاشة التهيئة للمستخدم الجديد
    coins: 50000,
    diamonds: 100,
    level: 1,
    vipTier: 'VIP1',
    superLegendLevel: 'SL1',
    isOwner: false,
    role: 'regular_user',
    loginType: 'google',
    createdAt: new Date().toISOString().split('T')[0],
    lastLoginAt: 'الآن'
  };

  try {
    await setDoc(doc(db, 'users', newSequentialId), {
      ...newUserData,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.warn('[Firestore setDoc error]', err);
  }

  setAuthUserSession(newUserData);
  return newUserData;
}

/**
 * تنفيذ تسجيل الدخول الحقيقي عبر Google Identity و Firebase Auth
 */
export async function signInWithGoogleReal(): Promise<AuthUserData> {
  try {
    const result = await signInWithPopup(auth, googleAuthProvider);
    return await handleFirebaseUserLogin(result.user);
  } catch (err: any) {
    if (err?.code === 'auth/unauthorized-domain' || err?.message?.includes('unauthorized-domain')) {
      const currentHost = typeof window !== 'undefined' ? window.location.hostname : '';
      const customErr: any = new Error(
        `نطاق التشغيل الحالي (${currentHost}) غير مصرح به في Firebase Console.`
      );
      customErr.code = 'auth/unauthorized-domain';
      customErr.domain = currentHost;
      throw customErr;
    } else if (err?.code === 'auth/popup-blocked') {
      try {
        await signInWithRedirect(auth, googleAuthProvider);
        throw new Error('REDIRECT_INITIATED');
      } catch (redirectErr) {
        throw new Error('يرجى السماح بالنوافذ المنبثقة (Popups) لتسجيل الدخول عبر Google');
      }
    } else if (err?.code === 'auth/popup-closed-by-user') {
      throw new Error('تم إلغاء نافذة اختيار الحساب');
    } else if (err?.code === 'auth/cancelled-popup-request') {
      throw new Error('تم إلغاء الطلب، يرجى إعادة الضغط على الزر');
    } else if (err?.message === 'REDIRECT_INITIATED') {
      throw err;
    }
    console.error('Google Sign-In Error:', err);
    throw new Error(err?.message || 'تعذر تسجيل الدخول عبر Google، يرجى المحاولة ثانية');
  }
}

/**
 * فحص نتيجة إعادة التوجيه لـ Google إن تمت
 */
export async function checkFirebaseRedirectResult(): Promise<AuthUserData | null> {
  try {
    const result = await getRedirectResult(auth);
    if (result?.user) {
      return await handleFirebaseUserLogin(result.user);
    }
  } catch (err) {
    console.warn('Redirect auth check warning:', err);
  }
  return null;
}

/**
 * تسجيل الخروج الرسمي من Firebase والتطبيق
 */
export async function logoutUserSession(): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    await firebaseSignOut(auth);
  } catch (e) {
    console.warn('Firebase signOut error:', e);
  }
  try {
    localStorage.removeItem(AUTH_USER_STORAGE_KEY);
    localStorage.removeItem('user_profile_data');
    localStorage.removeItem('user_wallet_coins');
    localStorage.removeItem('super_legend_current_active_user_id');
    window.dispatchEvent(new CustomEvent('najm_auth_state_changed', { detail: null }));
  } catch (e) {
    console.error('Failed to logout user session:', e);
  }
}

/**
 * تسجيل أو إنشاء حساب للمسارات الأخرى (مثل رقم الهاتف أو الضيف)
 */
export function createNewAccount(params: {
  loginType: 'phone' | 'email' | 'google' | 'guest';
  contact: string;
  displayName?: string;
  avatar?: string;
}): AuthUserData {
  const cleanContact = params.contact.trim().toLowerCase();
  const isOwnerEmail = isOwnerEmailOrId(cleanContact, null);

  if (isOwnerEmail) {
    const owner = {
      ...OWNER_USER_ACCOUNT,
      hasCompletedOnboarding: true,
      loginType: params.loginType
    };
    setAuthUserSession(owner);
    return owner;
  }

  // مستخدم جديد من الجوال / رقم الهاتف: توليد معرّف تسلسلي تقريبي أو استدعاء الترقيم
  const randomSuffix = Math.floor(1000000 + Math.random() * 9000000);
  const newId = randomSuffix.toString();

  const defaultAvatars = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
  ];
  const chosenAvatar = params.avatar || defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];

  let name = params.displayName?.trim();
  if (!name) {
    if (params.loginType === 'phone') {
      name = `نجم_${newId.slice(-4)}`;
    } else if (params.loginType === 'email') {
      name = cleanContact.split('@')[0] || `عضو_${newId.slice(-4)}`;
    } else {
      name = `ضيف_${newId.slice(-4)}`;
    }
  }

  const newAccount: AuthUserData = {
    id: newId,
    name,
    avatar: chosenAvatar,
    email: params.loginType === 'email' ? params.contact : undefined,
    phone: params.loginType === 'phone' ? params.contact : undefined,
    country: 'اليمن',
    age: 24,
    hasCompletedOnboarding: true,
    bio: 'مرحباً بكم في حسابي على تطبيق النجم! ✨',
    coins: 50000,
    diamonds: 0,
    level: 1,
    vipTier: 'VIP1',
    superLegendLevel: 'SL1',
    isOwner: false,
    role: 'regular_user',
    loginType: params.loginType,
    createdAt: new Date().toISOString().split('T')[0],
    lastLoginAt: 'الآن'
  };

  setAuthUserSession(newAccount);
  return newAccount;
}
