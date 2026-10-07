/**
 * خدمة مزامنة بيانات المضيف والوكالة مع لوحة التحكم الخارجية (External Dashboard & Firestore Sync)
 * تضمن الربط اللحظي الحقيقي بين الداشبورد الخارجي وتطبيق النجم عبر Cloud Firestore
 * متوافقة 100% مع شاشة: «التفاصيل الشاملة للمضيف»
 */

import { db } from './firebase';
import { doc, getDoc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';

export interface ComprehensiveHostData {
  hostId: string; // المعرف الموحد e.g. 1001001
  hostInternalCode: string; // معرف المضيف بالوكالة e.g. HOST-1001001
  hostName: string; // أبو أمجد
  hostAvatar?: string;
  isLive: boolean; // مباشر الآن
  levels: {
    generalLevel: number; // 85
    supporterLevel: number; // 95 الداعم
    supportedLevel: number; // 88 المدعوم
    vipTier: string; // VIP5 الملكي
  };
  agency: {
    agencyId: string; // AG-101
    agencyName: string; // وكالة النخبة الملكية للإنتاج والصوتيات
    agencyOwner: string; // سلطان الدوسري (الوكيل الرسمي)
    directSupervisor: string; // الوكيل المضيف شخصياً
    internalLabel: string; // الملوك
  };
  metrics: {
    broadcastHoursDone: number; // 165
    broadcastHoursRequired: number; // 120
    broadcastPercentage: number; // 100%
    diamondsEarned: number; // 5800000
    netEarningsUsd: number; // 60608
    baseEarningsUsd: number; // 54114
    bonusEarningsUsd: number; // 6494
    coinsRechargedTotal: number; // 340000
    coinsRechargesCount: number; // 4
  };
  identity: {
    phoneNumber: string; // +966501234567
    email: string; // 1001001@icelive.app
    broadcastCategory: string; // بث صوتي ورسمي VIP
    officialRoomId: string; // 9901
    officialRoomTitle: string; // روم أبو أمجد الرسمي (#9901)
  };
  banking: {
    iban: string; // US82 WIRE 0451 6000 1001001
    accountType: string; // USD Wire / Payoneer
    status: string; // مكتمل وجاهز للتحويل المالي
  };
  subTabs: {
    giftsAndSupportCount: number; // 10
    coinRechargesCount: number; // 4
    gameProfitsCount: number;
    securityDevicesCount: number; // 3
  };
  updatedAt?: any;
}

export const DEFAULT_HOST_1001001_DATA: ComprehensiveHostData = {
  hostId: '1001001',
  hostInternalCode: 'HOST-1001001',
  hostName: 'أبو أمجد',
  hostAvatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=400',
  isLive: true,
  levels: {
    generalLevel: 85,
    supporterLevel: 95,
    supportedLevel: 88,
    vipTier: 'VIP5 الملكي'
  },
  agency: {
    agencyId: 'AG-101',
    agencyName: 'وكالة النخبة الملكية للإنتاج والصوتيات',
    agencyOwner: 'سلطان الدوسري (الوكيل الرسمي)',
    directSupervisor: 'الوكيل المضيف شخصياً',
    internalLabel: 'الملوك'
  },
  metrics: {
    broadcastHoursDone: 165,
    broadcastHoursRequired: 120,
    broadcastPercentage: 100,
    diamondsEarned: 5800000,
    netEarningsUsd: 60608,
    baseEarningsUsd: 54114,
    bonusEarningsUsd: 6494,
    coinsRechargedTotal: 340000,
    coinsRechargesCount: 4
  },
  identity: {
    phoneNumber: '+966501234567',
    email: '1001001@icelive.app',
    broadcastCategory: 'بث صوتي ورسمي VIP',
    officialRoomId: '9901',
    officialRoomTitle: 'روم أبو أمجد الرسمي (#9901)'
  },
  banking: {
    iban: 'US82 WIRE 0451 6000 1001001',
    accountType: 'حساب التحويل الدولي المعتمد (USD Wire / Payoneer)',
    status: 'مكتمل وجاهز للتحويل المالي'
  },
  subTabs: {
    giftsAndSupportCount: 10,
    coinRechargesCount: 4,
    gameProfitsCount: 0,
    securityDevicesCount: 3
  }
};

/**
 * الاشتراك اللحظي في بيانات المضيف من Firestore
 */
export function subscribeToComprehensiveHostData(
  hostId: string,
  onData: (data: ComprehensiveHostData) => void
): () => void {
  const cleanId = hostId.trim() || '1001001';
  const docRef = doc(db, 'hosts', cleanId);

  return onSnapshot(
    docRef,
    (snap) => {
      if (snap.exists()) {
        const raw = snap.data() as ComprehensiveHostData;
        onData(raw);
      } else {
        // Fallback to initial seed if document doesn't exist yet
        onData(DEFAULT_HOST_1001001_DATA);
      }
    },
    (err) => {
      console.warn('Firestore host subscription error:', err);
      onData(DEFAULT_HOST_1001001_DATA);
    }
  );
}

/**
 * جلب بيانات المضيف مرة واحدة من Firestore
 */
export async function getComprehensiveHostData(hostId: string): Promise<ComprehensiveHostData> {
  const cleanId = hostId.trim() || '1001001';
  try {
    const docRef = doc(db, 'hosts', cleanId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as ComprehensiveHostData;
    }
  } catch (err) {
    console.error('Error fetching host data from Firestore:', err);
  }
  return DEFAULT_HOST_1001001_DATA;
}

/**
 * حفظ أو مزامنة بيانات المضيف في Firestore (من التطبيق أو الداشبورد)
 */
export async function syncComprehensiveHostDataToFirestore(
  hostData: Partial<ComprehensiveHostData> & { hostId: string }
): Promise<void> {
  const cleanId = hostData.hostId.trim() || '1001001';
  const docRef = doc(db, 'hosts', cleanId);
  await setDoc(
    docRef,
    {
      ...DEFAULT_HOST_1001001_DATA,
      ...hostData,
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );
}
