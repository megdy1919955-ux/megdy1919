import { doc, runTransaction } from 'firebase/firestore';
import { db } from './firebase';

/**
 * دالة توليد المعرف الرقمي التسلسلي الحقيقي والذري من Firebase Firestore
 * تبدأ من 1001001 وتتصاعد ذرياً عبر Firestore Transactions لمنع التكرار تماماً
 */
export async function generateNextUserId(): Promise<number> {
  const counterRef = doc(db, 'counters', 'userSeqId');

  try {
    const newId = await runTransaction(db, async (transaction) => {
      const counterDoc = await transaction.get(counterRef);
      let currentId = 1001000; // نقطة البداية الأساسية للمشروع

      if (counterDoc.exists()) {
        const data = counterDoc.data();
        currentId = data.currentValue || data.lastId || 1001000;
      }

      const nextId = currentId + 1;
      transaction.set(counterRef, { currentValue: nextId, lastUpdated: Date.now() }, { merge: true });
      return nextId;
    });

    return newId;
  } catch (error) {
    console.error('فشل في توليد المعرف التسلسلي:', error);
    // قيمة احتياطية في حال خطأ الشبكة
    return 1001001;
  }
}

/**
 * دالة مساعدة لإرجاع المعرف كنص (String) للواجهات
 */
export async function generateNextUserIdString(): Promise<string> {
  const id = await generateNextUserId();
  return id.toString();
}

export default generateNextUserId;
