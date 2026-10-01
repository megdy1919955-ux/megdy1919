import { AuthUserData, setAuthUserSession } from './authService';

/**
 * قائمة الشخصيات المعتمدة رسمياً في السيرفر للاختبار السريع عبر روابط URL المباشرة
 */
export const HIERARCHY_TEST_PERSONAS: Record<string, AuthUserData> = {
  // 1. المشرف العام والمالك (أبو أمجد MGR-9901)
  owner: {
    id: '1001001',
    name: 'أبو أمجد',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=400',
    email: 'megdy1919@gmail.com',
    phone: '+967 770000000',
    country: 'اليمن 🇾🇪',
    age: 32,
    gender: 'male',
    hasCompletedOnboarding: true,
    bio: 'المدير العام والمالك MGR-9901 👑',
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
  },

  // 2. نائب المدير العام (فهد الكعبي MGR-9902)
  manager: {
    id: '1001002',
    name: 'فهد الكعبي (MGR-9902)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    email: 'fahad.mgr@al-najm.live',
    phone: '+966 500000002',
    country: 'السعودية 🇸🇦',
    age: 35,
    gender: 'male',
    hasCompletedOnboarding: true,
    bio: 'نائب المدير العام ورئيس لجنة الاعتمادات 💎',
    coins: 80000000,
    diamonds: 50000,
    level: 70,
    vipTier: 'VIP6',
    superLegendLevel: 'SL2',
    isOwner: false,
    role: 'regular_user',
    loginType: 'phone',
    createdAt: '2026-02-10',
    lastLoginAt: 'الآن'
  },

  // 3. مندوب الوكالات المعتمد (عبدالله الشهري DEL-401)
  delegate: {
    id: '1001004',
    name: 'عبدالله الشهري (DEL-401)',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    email: 'delegate.del401@al-najm.live',
    phone: '+966 500000004',
    country: 'السعودية 🇸🇦',
    age: 30,
    gender: 'male',
    hasCompletedOnboarding: true,
    bio: 'مندوب وكالات معتمد DEL-401 - استدعاء وكلاء رسميين',
    coins: 40000000,
    diamonds: 30000,
    level: 55,
    vipTier: 'VIP5',
    superLegendLevel: 'SL2',
    isOwner: false,
    role: 'regular_user',
    loginType: 'phone',
    createdAt: '2026-02-18',
    lastLoginAt: 'الآن'
  },

  // 4. الوكيل الرسمي (سلطان الدوسري AG-101 - وكالتي)
  agent: {
    id: '1001010',
    name: 'سلطان الدوسري',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    email: 'agent.ag101@al-najm.live',
    phone: '+966 500000010',
    country: 'السعودية 🇸🇦',
    age: 34,
    gender: 'male',
    hasCompletedOnboarding: true,
    bio: 'الوكيل الرسمي - وكالة النخبة الملكية AG-101 💼',
    coins: 60000000,
    diamonds: 180000,
    level: 65,
    vipTier: 'VIP6',
    superLegendLevel: 'SL2',
    isOwner: false,
    role: 'regular_user',
    loginType: 'phone',
    createdAt: '2026-02-22',
    lastLoginAt: 'الآن'
  },

  // 5. الوسيط المعتمد (تركي الشمري BRK-101-1)
  broker: {
    id: '1001016',
    name: 'تركي الشمري (BRK-101-1)',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    email: 'broker.brk101@al-najm.live',
    phone: '+966 500000016',
    country: 'السعودية 🇸🇦',
    age: 28,
    gender: 'male',
    hasCompletedOnboarding: true,
    bio: 'وسيط معتمد BRK-101-1 تحت وكالة النخبة الملكية 🤝',
    coins: 25000000,
    diamonds: 45000,
    level: 45,
    vipTier: 'VIP4',
    superLegendLevel: 'SL1',
    isOwner: false,
    role: 'regular_user',
    loginType: 'phone',
    createdAt: '2026-02-25',
    lastLoginAt: 'الآن'
  },

  // 6. المذيعة المعتمدة (سارة الرياض HOST-101-01)
  host: {
    id: '1001022',
    name: 'سارة الرياض (HOST-101-01)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    email: 'host.sara@al-najm.live',
    phone: '+966 500000022',
    country: 'السعودية 🇸🇦',
    age: 24,
    gender: 'female',
    hasCompletedOnboarding: true,
    bio: 'مذيعة معتمدة لدى وكالة النخبة الملكية 🎙️✨',
    coins: 15000000,
    diamonds: 280000,
    level: 42,
    vipTier: 'VIP4',
    superLegendLevel: 'SL1',
    isOwner: false,
    role: 'regular_user',
    loginType: 'phone',
    createdAt: '2026-02-26',
    lastLoginAt: 'الآن'
  },

  // 7. المستخدم العادي (بدون أي رتبة - تختفي جميع البطاقات)
  user: {
    id: '99988877',
    name: 'مستخدم عادي (زائر)',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    email: 'user.normal@al-najm.live',
    phone: '+966 599888777',
    country: 'السعودية 🇸🇦',
    age: 23,
    gender: 'male',
    hasCompletedOnboarding: true,
    bio: 'مستخدم عادي في تطبيق النجم بدون رتب إدارية',
    coins: 5000,
    diamonds: 100,
    level: 4,
    vipTier: 'VIP1',
    superLegendLevel: 'SL1',
    isOwner: false,
    role: 'regular_user',
    loginType: 'phone',
    createdAt: '2026-03-01',
    lastLoginAt: 'الآن'
  }
};

/**
 * فحص معلمات الرابط URL وتطبيق جلسة الشخصية فوراً إن وجدت
 * تدعم الروابط المباشرة مثل:
 * ?user=agent أو ?role=delegate أو ?loginAs=user أو ?userId=1001010
 */
export function checkUrlPersonaSwitch(): AuthUserData | null {
  if (typeof window === 'undefined') return null;

  try {
    const params = new URLSearchParams(window.location.search);
    const key = (
      params.get('user') ||
      params.get('role') ||
      params.get('loginAs') ||
      params.get('persona') ||
      ''
    ).trim().toLowerCase();

    const specificId = params.get('userId')?.trim();

    let targetPersona: AuthUserData | undefined;

    if (specificId) {
      targetPersona = Object.values(HIERARCHY_TEST_PERSONAS).find((p) => p.id === specificId);
      if (!targetPersona) {
        // إنشاء بروفايل مخصص للمعرف المطلوب
        targetPersona = {
          id: specificId,
          name: `مستخدم #${specificId}`,
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          country: 'السعودية 🇸🇦',
          age: 25,
          gender: 'male',
          hasCompletedOnboarding: true,
          bio: `حساب تجريبي للمعرف ${specificId}`,
          coins: 10000,
          diamonds: 500,
          level: 10,
          vipTier: 'VIP1',
          superLegendLevel: 'SL1',
          isOwner: specificId === '1001001',
          role: specificId === '1001001' ? 'super_admin' : 'regular_user',
          loginType: 'phone',
          createdAt: new Date().toISOString().split('T')[0],
          lastLoginAt: 'الآن'
        };
      }
    } else if (key) {
      targetPersona = HIERARCHY_TEST_PERSONAS[key];
    }

    if (targetPersona) {
      setAuthUserSession(targetPersona);
      return targetPersona;
    }
  } catch (err) {
    console.warn('[checkUrlPersonaSwitch error]:', err);
  }

  return null;
}
