/**
 * خدمة إدارة حسابات ومصادقة المستخدم (Authentication & User Session Service)
 * تدعم تسجيل الدخول برقم الجوال، البريد الإلكتروني، جوجل، والدخول كـ ضيف
 * تطبيق النجم (Al-Najm)
 */

import { OWNER_DEV_ID } from './adminRoleService';
import { setActiveAppRole } from './roleService';

export interface AuthUserData {
  id: string;
  name: string;
  avatar: string;
  email?: string;
  phone?: string;
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

const AUTH_USER_STORAGE_KEY = 'najm_authenticated_user_v1';
const SAVED_DEVICE_ACCOUNTS_KEY = 'najm_device_accounts_list_v1';

// الحساب الافتراضي للمالك والمطور
export const OWNER_USER_ACCOUNT: AuthUserData = {
  id: OWNER_DEV_ID,
  name: '(عابرسبيل)',
  avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=400',
  email: 'megdy1919@gmail.com',
  phone: '+967 770000000',
  country: 'اليمن',
  bio: 'المالك والمطور الرسمي لتطبيق النجم الصوتي 👑 ⭐',
  coins: 100000000,
  diamonds: 8377,
  level: 88,
  vipTier: 'VIP8',
  superLegendLevel: 'SL3',
  isOwner: true,
  role: 'super_admin',
  loginType: 'google',
  createdAt: '2026-01-01',
  lastLoginAt: 'الآن'
};

/**
 * جلب بيانات المستخدم المسجل حالياً
 */
export function getCurrentAuthUser(): AuthUserData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(AUTH_USER_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to get current auth user:', e);
  }
  return null;
}

/**
 * جلب قائمة الحسابات المحفوظة على هذا الجوال (Device Google & Login Accounts)
 * إذا كان المستخدم قد سجل مسبقاً، يتعرف عليه تلقائياً مع إتاحة الحسابات المسجلة
 */
export function getSavedDeviceAccounts(): AuthUserData[] {
  if (typeof window === 'undefined') return [OWNER_USER_ACCOUNT];
  try {
    const raw = localStorage.getItem(SAVED_DEVICE_ACCOUNTS_KEY);
    if (raw) {
      const accounts: AuthUserData[] = JSON.parse(raw);
      // التأكد دائماً من وجود حساب المالك ضمن الحسابات المتاحة
      if (!accounts.some(a => a.email === OWNER_USER_ACCOUNT.email || a.id === OWNER_USER_ACCOUNT.id)) {
        return [OWNER_USER_ACCOUNT, ...accounts];
      }
      return accounts;
    }
  } catch (e) {
    console.error('Failed to get device accounts:', e);
  }

  // حسابات مقترحة افتراضية متصلة بالجوال للمستخدم لتسهيل التجربة
  const defaultAccounts: AuthUserData[] = [
    OWNER_USER_ACCOUNT,
    {
      id: '8492015',
      name: 'صقر قريش',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      email: 'saqr.live@gmail.com',
      country: 'اليمن',
      bio: 'عاشق الغرف الصوتية والشيلات ⭐',
      coins: 250000,
      diamonds: 140,
      level: 18,
      vipTier: 'VIP2',
      superLegendLevel: 'SL1',
      isOwner: false,
      role: 'regular_user',
      loginType: 'google',
      createdAt: '2026-02-10',
      lastLoginAt: 'أمس'
    }
  ];

  try {
    localStorage.setItem(SAVED_DEVICE_ACCOUNTS_KEY, JSON.stringify(defaultAccounts));
  } catch {}

  return defaultAccounts;
}

/**
 * حفظ الحساب في قائمة حسابات الجوال لسهولة استرجاعه والتعرف عليه لاحقاً
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
 * حفظ جلسة تسجيل الدخول وتحديث البروفايل
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
      followers: user.isOwner ? 5365 : 12,
      following: user.isOwner ? 120 : 5,
      bio: user.bio || '',
      superLegendLevel: user.superLegendLevel,
      vipLevel: user.vipTier,
      avatar: user.avatar,
      album: {}
    };
    localStorage.setItem('user_profile_data', JSON.stringify(profileToSave));

    // مزامنة محفظة الكوينز
    localStorage.setItem('user_wallet_coins', user.coins.toString());

    // مزامنة الصلاحية الإدارية
    if (user.isOwner || user.id === OWNER_DEV_ID) {
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
 * تسجيل الخروج من التطبيق
 */
export function logoutUserSession(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(AUTH_USER_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('najm_auth_state_changed', { detail: null }));
  } catch (e) {
    console.error('Failed to logout user session:', e);
  }
}

/**
 * إنشاء حساب جديد وتوليد معرف (ID) فريد للمستخدم أو الصديق
 */
export function createNewAccount(params: {
  loginType: 'phone' | 'email' | 'google' | 'guest';
  contact: string; // phone or email or guest name
  displayName?: string;
  avatar?: string;
}): AuthUserData {
  const cleanContact = params.contact.trim().toLowerCase();

  // التحقق إن كان هذا هو حساب المالك والمطور الرئيسي
  const isOwnerEmail = cleanContact.includes('megdy1919@gmail.com');
  const isOwnerId = cleanContact === OWNER_DEV_ID.toLowerCase();

  if (isOwnerEmail || isOwnerId) {
    const owner = {
      ...OWNER_USER_ACCOUNT,
      loginType: params.loginType
    };
    setAuthUserSession(owner);
    return owner;
  }

  // مستخدم جديد / صديق: توليد آيدي عشوائي مكون من 7 أرقام (مثال: 4829104)
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
    } else if (params.loginType === 'email' || params.loginType === 'google') {
      name = cleanContact.split('@')[0] || `عضو_${newId.slice(-4)}`;
    } else {
      name = `ضيف_${newId.slice(-4)}`;
    }
  }

  const newAccount: AuthUserData = {
    id: newId,
    name,
    avatar: chosenAvatar,
    email: params.loginType === 'email' || params.loginType === 'google' ? params.contact : undefined,
    phone: params.loginType === 'phone' ? params.contact : undefined,
    country: 'اليمن',
    bio: 'مرحباً بكم في حسابي على تطبيق النجم! ✨',
    coins: 50000, // رصيد كوينز ترحيبي مجاني لأصدقائك لتجربة الرومات والهدايا
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
