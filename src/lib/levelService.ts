/**
 * نظام المستويات الحقيقي المرتبط بالسيرفر (Real-time Level & EXP Engine)
 * يدعم مستويين منفصلين ومستقلين:
 * 1. مستوى الداعم (Supporter / Sender Level): يزيد بنقاط sender_exp عند إرسال الهدايا والدعم.
 * 2. مستوى المدعوم / الجاذبية (Receiver / Charm Level): يزيد بنقاط receiver_exp عند استلام الهدايا من الآخرين.
 * تطبيق النجم (Al-Najm)
 */

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  onSnapshot
} from 'firebase/firestore';
import { db } from './firebase';
import { getCurrentAuthUser, setAuthUserSession, AuthUserData, OWNER_DEV_ID } from './authService';
import { modifyUserCoins } from './userSyncService';

export interface LevelCalculationResult {
  level: number;
  currentLevelMinExp: number;
  nextLevelExp: number;
  progressPercent: number; // 0 to 100
  expInCurrentLevel: number;
  expNeededForNextLevel: number;
  totalExp: number;
}

export interface LevelTierInfo {
  tierName: string;
  tierCode: string;
  badgeBg: string;
  badgeBorder: string;
  textColor: string;
  icon: string;
  description: string;
}

export interface UserVipDesign {
  vipTier?: string;
  vipLevel?: number;
  hasVip: boolean;
  vipText?: string;
  vipIcon?: string;
  vipBg?: string;
  vipBorder?: string;
  vipColor?: string;
  vipImage?: string;
}

export interface UserLevelSnapshot {
  userId: string;
  senderExp: number;
  senderLevel: number;
  senderCalc: LevelCalculationResult;
  senderTier: LevelTierInfo;
  receiverExp: number;
  receiverLevel: number;
  receiverCalc: LevelCalculationResult;
  receiverTier: LevelTierInfo;
  horizontalScale?: number; // مقياس العرض الأفقي المحدد من الخادم / لوحة البيانات
  badgeScale?: number;
  vipDesign?: UserVipDesign;
  age?: number; // العمر المعتمد من السيرفر
  gender?: 'male' | 'female'; // الجنس المعتمد من السيرفر
}

export interface GiftSupportEventParams {
  senderId: string;
  senderName?: string;
  receiverId?: string; // معرّف المستلم (صاحب المقعد أو مالك الروم)
  receiverName?: string;
  giftId: string;
  giftName: string;
  giftIcon?: string;
  giftValue: number; // قيمة الهدية الواحدة بالكوينز
  quantity: number; // عدد الهدايا المرسلة (الكومبو)
  roomId?: string;
}

export interface SupportEventResult {
  success: boolean;
  totalCost: number;
  expGained: number;
  sender: {
    id: string;
    newExp: number;
    newLevel: number;
    leveledUp: boolean;
  };
  receiver?: {
    id: string;
    newExp: number;
    newLevel: number;
    leveledUp: boolean;
    diamondsGained: number;
  };
}

/**
 * معادلة حساب النقاط التراكمية المطلوبة للوصول إلى المستوى L:
 * المستوى 1 = 0 نقطة
 * المستوى 2 = 500 نقطة
 * المستوى L = 250 * (L - 1)^2 + 250 * (L - 1)
 */
export function getRequiredExpForLevel(level: number): number {
  if (level <= 1) return 0;
  const l = Math.max(1, Math.floor(level));
  return Math.floor(250 * (l - 1) * (l - 1) + 250 * (l - 1));
}

/**
 * حساب المستوى الدقيق، النقاط المطلوبة، ونسبة التقدم الحقيقية بناءً على مجموع النقاط
 */
export function calculateLevelFromExp(rawExp: number): LevelCalculationResult {
  const totalExp = Math.max(0, Math.floor(Number(rawExp) || 0));

  // إيجاد المستوى الحالي
  let level = 1;
  // صيغة عكسية تقريبية لبداية البحث السريع
  // 250 * x^2 + 250 * x - totalExp = 0 => x ~= (-250 + sqrt(62500 + 1000 * totalExp)) / 500
  if (totalExp > 0) {
    const approx = (-250 + Math.sqrt(62500 + 1000 * totalExp)) / 500;
    level = Math.max(1, Math.floor(approx) + 1);
  }

  // ضبط دقيق لحدود المستوى
  while (getRequiredExpForLevel(level + 1) <= totalExp) {
    level++;
  }
  while (level > 1 && getRequiredExpForLevel(level) > totalExp) {
    level--;
  }

  const currentLevelMinExp = getRequiredExpForLevel(level);
  const nextLevelExp = getRequiredExpForLevel(level + 1);
  const levelSpan = Math.max(1, nextLevelExp - currentLevelMinExp);
  const expInCurrentLevel = Math.max(0, totalExp - currentLevelMinExp);
  const progressPercent = Math.min(100, Math.max(0, Math.round((expInCurrentLevel / levelSpan) * 100)));
  const expNeededForNextLevel = Math.max(0, nextLevelExp - totalExp);

  return {
    level,
    currentLevelMinExp,
    nextLevelExp,
    progressPercent,
    expInCurrentLevel,
    expNeededForNextLevel,
    totalExp
  };
}

/**
 * رتب وشارات مستوى الداعم (Supporter / Sender Tiers)
 */
export function getSupporterTierInfo(level: number): LevelTierInfo {
  if (level >= 100) {
    return {
      tierName: 'سوبر ليجند أسطوري',
      tierCode: `SL${Math.min(10, Math.floor((level - 100) / 10) + 1)}`,
      badgeBg: 'bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-700',
      badgeBorder: 'border-amber-300/80 shadow-amber-500/30',
      textColor: 'text-amber-100',
      icon: '👑',
      description: 'أعلى رتبة دعم ملكية أسطورية في تطبيق النجم'
    };
  }
  if (level >= 75) {
    return {
      tierName: 'داعم إمبراطوري ماسي',
      tierCode: 'VIP8',
      badgeBg: 'bg-gradient-to-r from-purple-700 via-pink-600 to-indigo-800',
      badgeBorder: 'border-purple-300/70 shadow-purple-500/30',
      textColor: 'text-purple-100',
      icon: '💎',
      description: 'رتبة كبار الداعمين الماسيين'
    };
  }
  if (level >= 50) {
    return {
      tierName: 'داعم بلاتيني',
      tierCode: 'VIP5',
      badgeBg: 'bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700',
      badgeBorder: 'border-cyan-300/70 shadow-cyan-500/20',
      textColor: 'text-cyan-100',
      icon: '⚡',
      description: 'نخبة كبار الدعم'
    };
  }
  if (level >= 25) {
    return {
      tierName: 'داعم ذهبي',
      tierCode: 'VIP3',
      badgeBg: 'bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-700',
      badgeBorder: 'border-amber-300/60 shadow-amber-500/20',
      textColor: 'text-amber-100',
      icon: '⭐',
      description: 'داعم ذهبي متألق في الرومات'
    };
  }
  if (level >= 10) {
    return {
      tierName: 'داعم فضي',
      tierCode: 'VIP1',
      badgeBg: 'bg-gradient-to-r from-slate-600 via-slate-500 to-slate-700',
      badgeBorder: 'border-slate-300/60 shadow-slate-500/10',
      textColor: 'text-slate-100',
      icon: '🛡️',
      description: 'داعم فضي متميز'
    };
  }
  return {
    tierName: 'داعم برونزي',
    tierCode: 'Lv.1',
    badgeBg: 'bg-gradient-to-r from-amber-800 via-orange-900 to-slate-800',
    badgeBorder: 'border-amber-600/40',
    textColor: 'text-amber-200',
    icon: '✨',
    description: 'نجم جديد في مسيرة الدعم'
  };
}

/**
 * رتب وشارات مستوى المدعوم / الجاذبية (Receiver / Charm Tiers)
 */
export function getCharmTierInfo(level: number): LevelTierInfo {
  if (level >= 100) {
    return {
      tierName: 'إمبراطور الجاذبية والمسرح',
      tierCode: 'CH10',
      badgeBg: 'bg-gradient-to-r from-rose-600 via-fuchsia-500 to-purple-700',
      badgeBorder: 'border-rose-300/80 shadow-rose-500/30',
      textColor: 'text-rose-100',
      icon: '💖',
      description: 'أعلى مستوى جاذبية وشعبية على مستوى التطبيق'
    };
  }
  if (level >= 75) {
    return {
      tierName: 'أسطورة السحر والجمهور',
      tierCode: 'CH8',
      badgeBg: 'bg-gradient-to-r from-pink-600 via-rose-500 to-indigo-700',
      badgeBorder: 'border-pink-300/70 shadow-pink-500/20',
      textColor: 'text-pink-100',
      icon: '🦄',
      description: 'نجم جماهيري محبوب ذو جاذبية خارقة'
    };
  }
  if (level >= 50) {
    return {
      tierName: 'محبوب الجماهير',
      tierCode: 'CH5',
      badgeBg: 'bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600',
      badgeBorder: 'border-rose-300/60 shadow-rose-500/20',
      textColor: 'text-rose-100',
      icon: '🌸',
      description: 'شعبية واسعة ومستوى استقبال هدايا متقدم'
    };
  }
  if (level >= 25) {
    return {
      tierName: 'نجم المسرح الصوتي',
      tierCode: 'CH3',
      badgeBg: 'bg-gradient-to-r from-fuchsia-600 via-pink-600 to-rose-600',
      badgeBorder: 'border-fuchsia-300/50',
      textColor: 'text-fuchsia-100',
      icon: '✨',
      description: 'جاذبية مميزة وحضور صوتي لامع'
    };
  }
  if (level >= 10) {
    return {
      tierName: 'موهبة متألقة',
      tierCode: 'CH1',
      badgeBg: 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600',
      badgeBorder: 'border-indigo-300/50',
      textColor: 'text-indigo-100',
      icon: '💫',
      description: 'موهبة صاعدة في استقبال الدعم'
    };
  }
  return {
    tierName: 'مبتدئ الجاذبية',
    tierCode: 'Lv.1',
    badgeBg: 'bg-gradient-to-r from-purple-900 via-slate-800 to-indigo-900',
    badgeBorder: 'border-purple-600/40',
    textColor: 'text-purple-200',
    icon: '🌱',
    description: 'بداية مشوار النجومية والجاذبية'
  };
}

/**
 * معالجة حدث دعم الهدايا الحقيقي وربطه بالسيرفر (Real-time Gift Support Event):
 * 1. حساب قيمة الهدية وخصم الكوينز من الداعم
 * 2. زيادة sender_exp وتحديث sender_level للداعم في Firestore
 * 3. زيادة receiver_exp وتحديث receiver_level وإضافة الماس diamonds للمستلم في Firestore
 * 4. إشعار الواجهات الحية والتطبيق فورا
 */
export async function processGiftSupportEvent(
  params: GiftSupportEventParams
): Promise<SupportEventResult> {
  const {
    senderId,
    receiverId,
    giftName,
    giftValue,
    quantity,
    roomId
  } = params;

  const totalCost = Math.max(0, Math.floor(giftValue * quantity));
  const expGained = totalCost; // 1 كوينز دعم = 1 نقطة خبرة EXP حقيقية

  // 1. خصم الكوينز من رصيد الداعم
  if (totalCost > 0) {
    await modifyUserCoins(senderId, -totalCost);
  }

  // 2. تحديث الداعم في Firestore
  const senderDocRef = doc(db, 'users', senderId);
  let senderOldExp = 0;
  let senderOldLevel = 1;

  try {
    const sSnap = await getDoc(senderDocRef);
    if (sSnap.exists()) {
      const sData = sSnap.data();
      senderOldExp = Number(sData.sender_exp) || 0;
      senderOldLevel = Number(sData.sender_level) || calculateLevelFromExp(senderOldExp).level;
    }
  } catch (err) {
    console.warn('[Support Engine] Failed reading sender doc:', err);
  }

  const senderNewExp = senderOldExp + expGained;
  const senderCalc = calculateLevelFromExp(senderNewExp);
  const senderNewLevel = senderCalc.level;
  const senderLeveledUp = senderNewLevel > senderOldLevel;

  // حفظ التحديثات السحابية للداعم
  try {
    await setDoc(
      senderDocRef,
      {
        sender_exp: increment(expGained),
        sender_level: senderNewLevel,
        level: senderNewLevel, // مزامنة المستوى العام مع مستوى الداعم
        updatedAt: new Date().toISOString()
      },
      { merge: true }
    );
  } catch (err) {
    console.warn('[Support Engine] Failed updating sender in Firestore:', err);
  }

  // تحديث الجلسة المحلية للداعم إذا كان هو المستخدم النشط
  const currentAuth = getCurrentAuthUser();
  if (currentAuth && currentAuth.id === senderId) {
    const updatedSenderUser: AuthUserData = {
      ...currentAuth,
      sender_exp: senderNewExp,
      sender_level: senderNewLevel,
      level: senderNewLevel,
      coins: Math.max(0, (currentAuth.coins || 0) - totalCost)
    };
    setAuthUserSession(updatedSenderUser);
  }

  // 3. تحديث المدعوم / المستلم في Firestore (إن وجد)
  let receiverResult: SupportEventResult['receiver'] = undefined;

  if (receiverId && receiverId !== senderId) {
    const receiverDocRef = doc(db, 'users', receiverId);
    let receiverOldExp = 0;
    let receiverOldLevel = 1;

    try {
      const rSnap = await getDoc(receiverDocRef);
      if (rSnap.exists()) {
        const rData = rSnap.data();
        receiverOldExp = Number(rData.receiver_exp) || 0;
        receiverOldLevel = Number(rData.receiver_level) || calculateLevelFromExp(receiverOldExp).level;
      }
    } catch (err) {
      console.warn('[Support Engine] Failed reading receiver doc:', err);
    }

    const receiverNewExp = receiverOldExp + expGained;
    const receiverCalc = calculateLevelFromExp(receiverNewExp);
    const receiverNewLevel = receiverCalc.level;
    const receiverLeveledUp = receiverNewLevel > receiverOldLevel;
    // 50% من قيمة الدعم تتحول إلى ألماس للمستلم
    const diamondsGained = Math.max(1, Math.floor(expGained * 0.5));

    try {
      await setDoc(
        receiverDocRef,
        {
          receiver_exp: increment(expGained),
          receiver_level: receiverNewLevel,
          diamonds: increment(diamondsGained),
          updatedAt: new Date().toISOString()
        },
        { merge: true }
      );
    } catch (err) {
      console.warn('[Support Engine] Failed updating receiver in Firestore:', err);
    }

    // تحديث الجلسة المحلية إذا كان المستلم هو المستخدم الحالي
    if (currentAuth && currentAuth.id === receiverId) {
      const updatedReceiverUser: AuthUserData = {
        ...currentAuth,
        receiver_exp: receiverNewExp,
        receiver_level: receiverNewLevel,
        diamonds: (currentAuth.diamonds || 0) + diamondsGained
      };
      setAuthUserSession(updatedReceiverUser);
    }

    receiverResult = {
      id: receiverId,
      newExp: receiverNewExp,
      newLevel: receiverNewLevel,
      leveledUp: receiverLeveledUp,
      diamondsGained
    };
  }

  // 4. إطلاق أحداث التحديث المباشر للواجهات في كامل التطبيق
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('support_event_processed', {
        detail: {
          senderId,
          receiverId,
          giftName,
          giftValue,
          quantity,
          totalCost,
          expGained,
          senderNewExp,
          senderNewLevel,
          senderLeveledUp,
          receiverResult,
          roomId
        }
      })
    );
  }

  return {
    success: true,
    totalCost,
    expGained,
    sender: {
      id: senderId,
      newExp: senderNewExp,
      newLevel: senderNewLevel,
      leveledUp: senderLeveledUp
    },
    receiver: receiverResult
  };
}

/**
 * الاشتراك في التحديثات الحية لمستويات المستخدم (Supporter & Charm Real-time Listener)
 */
export function listenToUserLevels(
  userId: string,
  onUpdate: (snapshot: UserLevelSnapshot) => void
): () => void {
  const userDocRef = doc(db, 'users', userId);

  const unsubscribe = onSnapshot(
    userDocRef,
    (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        const sExp = Number(data.sender_exp) || (userId === OWNER_DEV_ID || userId === '1001001' ? 2475000 : 0);
        const sLevel = Number(data.sender_level) || calculateLevelFromExp(sExp).level;
        const sCalc = calculateLevelFromExp(sExp);
        const sTier = getSupporterTierInfo(sLevel);

        const rExp = Number(data.receiver_exp) || (userId === OWNER_DEV_ID || userId === '1001001' ? 1914000 : 0);
        const rLevel = Number(data.receiver_level) || calculateLevelFromExp(rExp).level;
        const rCalc = calculateLevelFromExp(rExp);
        const rTier = getCharmTierInfo(rLevel);

        const horizontalScale = typeof data.horizontal_scale === 'number'
          ? data.horizontal_scale
          : (typeof data.level_scale === 'number' ? data.level_scale : 0.5);
        const badgeScale = typeof data.badge_scale === 'number' ? data.badge_scale : 0.5;

        // قراءة بيانات وتصميم الـ VIP المرفوع من لوحة التحكم / السيرفر
        const rawVip = data.vipTier ?? data.vipLevel ?? data.vip ?? data.vip_tier ?? data.vip_level;
        let vipTierStr = '';
        let vipLevelNum = 0;
        if (typeof rawVip === 'number' && rawVip > 0) {
          vipLevelNum = rawVip;
          vipTierStr = `VIP${rawVip}`;
        } else if (typeof rawVip === 'string' && rawVip.trim() && rawVip.toLowerCase() !== 'none' && rawVip !== '0') {
          vipTierStr = rawVip.trim();
          const match = vipTierStr.match(/\d+/);
          vipLevelNum = match ? parseInt(match[0], 10) : 1;
        }

        const hasVip = Boolean(vipTierStr);
        const vipDesign: UserVipDesign = {
          vipTier: vipTierStr,
          vipLevel: vipLevelNum,
          hasVip,
          vipText: data.vip_text || data.vipText || vipTierStr,
          vipIcon: data.vip_icon || data.vipIcon,
          vipBg: data.vip_bg || data.vipBg || data.vip_badge_bg,
          vipBorder: data.vip_border || data.vipBorder || data.vip_badge_border,
          vipColor: data.vip_color || data.vipColor || data.vip_badge_text,
          vipImage: data.vip_image || data.vipImage || data.vip_badge_image
        };

        const userAge = typeof data.age === 'number' ? data.age : (userId === OWNER_DEV_ID || userId === '1001001' ? 32 : 25);
        const userGender: 'male' | 'female' = data.gender === 'female' ? 'female' : 'male';

        onUpdate({
          userId,
          senderExp: sExp,
          senderLevel: sLevel,
          senderCalc: sCalc,
          senderTier: sTier,
          receiverExp: rExp,
          receiverLevel: rLevel,
          receiverCalc: rCalc,
          receiverTier: rTier,
          horizontalScale,
          badgeScale,
          vipDesign,
          age: userAge,
          gender: userGender
        });
      }
    },
    (err) => {
      console.warn('[listenToUserLevels error]:', err);
    }
  );

  return unsubscribe;
}
