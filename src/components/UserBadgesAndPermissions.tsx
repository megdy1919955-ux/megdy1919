import React, { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

export interface UserBadgesAndPermissionsProps {
  userId?: string;
  className?: string;
}

const BADGE_LABEL_MAP: Record<string, { label: string; icon: string }> = {
  developer: { label: 'المطور الأساسي', icon: '👑' },
  vip_gold: { label: 'VIP الذهبي', icon: '👑' },
  certified_host: { label: 'مذيع معتمد', icon: '🎙️' },
  super_admin: { label: 'مدير عام وسوبر أدمن', icon: '⚡' },
  agency_owner: { label: 'مالك وكالة رسمية', icon: '💼' },
  broker: { label: 'وسيط معتمد', icon: '🤝' },
  supporter_top1: { label: 'داعم أسطوري Top 1', icon: '🔥' },
  charm_star: { label: 'نجم الكاريزما', icon: '💎' }
};

export function UserBadgesAndPermissions({ userId, className = '' }: UserBadgesAndPermissionsProps) {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const effectiveUserId = userId || auth.currentUser?.uid || '1001001';

  useEffect(() => {
    if (!effectiveUserId) {
      setLoading(false);
      return;
    }

    try {
      const userRef = doc(db, 'users', effectiveUserId);
      const unsubscribe = onSnapshot(
        userRef,
        (docSnap) => {
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          }
          setLoading(false);
        },
        (err) => {
          console.warn('تنبيه أثناء جلب شارات وصلاحيات المستخدم من فايربيس:', err);
          setLoading(false);
        }
      );
      return () => unsubscribe();
    } catch {
      setLoading(false);
    }
  }, [effectiveUserId]);

  if (loading) {
    return <div className="text-xs text-gray-400 py-2">جاري تحميل الشارات...</div>;
  }

  // جلب الشارات والصلاحيات المرسلة من الداشبورد
  const badges: any[] = userData?.badges || []; // مثال: ['developer', 'vip_gold', 'certified_host']
  const displayId = userData?.displayId || userData?.customId || userData?.userId || effectiveUserId;
  const role = userData?.role || 'user';

  const getBadgeInfo = (badge: any) => {
    if (typeof badge === 'string') {
      const mapped = BADGE_LABEL_MAP[badge];
      return mapped || { label: badge, icon: '⭐' };
    }
    return {
      label: badge?.name || badge?.label || badge?.id || 'شارة',
      icon: badge?.icon || '⭐'
    };
  };

  return (
    <div className={`flex flex-col gap-2 p-3 bg-gray-900/60 rounded-xl border border-gray-800 dir-rtl text-right ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-amber-400 font-mono">ID: {displayId}</span>
        <span className="text-xs px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded-full font-bold">
          {role === 'admin' || role === 'super_admin'
            ? 'مدير عام 👑'
            : role === 'host'
            ? 'مذيع معتمد 🎙️'
            : role === 'agency'
            ? 'وكيل رسمي 💼'
            : 'مستخدم 🌟'}
        </span>
      </div>

      {/* عرض الشارات الحقيقية */}
      <div className="flex flex-wrap gap-1.5 mt-1">
        {badges.length === 0 ? (
          <span className="text-xs text-gray-500">لا توجد شارات نشطة حالياً</span>
        ) : (
          badges.map((badge, idx) => {
            const info = getBadgeInfo(badge);
            return (
              <span
                key={idx}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 shadow-sm"
              >
                <span>{info.icon}</span>
                <span>{info.label}</span>
              </span>
            );
          })
        )}
      </div>
    </div>
  );
}

export default UserBadgesAndPermissions;
