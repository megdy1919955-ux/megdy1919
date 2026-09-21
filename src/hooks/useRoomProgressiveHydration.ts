import { useState, useEffect, useRef } from 'react';
import {
  getCachedRoomState,
  saveRoomStateToCache,
  preloadWallpaperSilently,
  isWallpaperInCache
} from '../lib/roomCacheService';

export interface ProgressiveHydrationState {
  isAudioReady: boolean;
  isSeatsReady: boolean;
  isChatReady: boolean;
  isProfilesHydrated: boolean;
  isTickersReady: boolean;
  isWallpaperReady: boolean;
  wallpaperCacheNotice: {
    status: 'caching' | 'ready' | null;
    text: string;
  } | null;
}

/**
 * هوك إدارة التحميل التدريجي فائق السرعة والخفة للروم:
 * 1. الصوت فوراً وبشكل لحظي (Phase 0: Audio Engine Starts First)
 * 2. هيكل المايكات والأشخاص المتواجدين (Phase 1: Seats & Mics Layout)
 * 3. الشات والرسائل التفاعلية (Phase 2: Live Room Chat)
 * 4. بروفايلات وأفاتارات الأشخاص في المقاعد (Phase 3: Seat Profiles Hydration)
 * 5. الأشرطة المتحركة والشرائط التفاعلية (Phase 4: Moving Tickers & Strips)
 * 6. خلفية الروم والفعاليات (Phase 5: Background Wallpaper & Lazy Secondary Modules)
 */
export function useRoomProgressiveHydration(
  roomId: string,
  targetWallpaperUrl: string,
  wallpaperName?: string
) {
  const [hydration, setHydration] = useState<ProgressiveHydrationState>(() => {
    // Check if wallpaper is already cached in memory
    const isCached = isWallpaperInCache(targetWallpaperUrl);
    return {
      isAudioReady: true, // أول شيء: الصوت ينطلق فوراً ⚡
      isSeatsReady: true, // ثانياً: هيكل المايكات يظهر فوراً مع الدخول 🎙️
      isChatReady: false, // ثالثاً: الشات يفتح بعد أجزاء بسيطة من الثانية 💬
      isProfilesHydrated: false, // رابعاً: صور البروفايلات في المايكات 👤
      isTickersReady: false, // خامساً: الأشرطة المتحركة أثناء الدخول 🎟️
      isWallpaperReady: isCached, // سادساً وأخيراً: خلفية الروم مع الحفظ المؤقت 🖼️
      wallpaperCacheNotice: null
    };
  });

  const activeWallpaperRef = useRef(targetWallpaperUrl);
  activeWallpaperRef.current = targetWallpaperUrl;

  // تسلسل التحميل التدريجي للمكونات وفق الطلب
  useEffect(() => {
    // الخطوة 3: تفعيل الشات بسرعة فائقة (~50ms)
    const chatTimer = setTimeout(() => {
      setHydration((prev) => ({ ...prev, isChatReady: true }));
    }, 50);

    // الخطوة 4: تفعيل البروفايلات على المقاعد (~120ms)
    const profilesTimer = setTimeout(() => {
      setHydration((prev) => ({ ...prev, isProfilesHydrated: true }));
    }, 120);

    // الخطوة 5: تفعيل الأشرطة المتحركة إذا وجدت (~220ms)
    const tickersTimer = setTimeout(() => {
      setHydration((prev) => ({ ...prev, isTickersReady: true }));
    }, 220);

    return () => {
      clearTimeout(chatTimer);
      clearTimeout(profilesTimer);
      clearTimeout(tickersTimer);
    };
  }, [roomId]);


  // 2. تحميل خلفية الروم في الخلفية كآخر مرحلة وتخزينها في الحافظة المؤقتة
  useEffect(() => {
    if (!targetWallpaperUrl) return;

    let isMounted = true;

    // استرجاع الحافظة المؤقتة للغرفة
    const cached = getCachedRoomState(roomId);
    if (cached?.wallpaperUrl === targetWallpaperUrl && isWallpaperInCache(targetWallpaperUrl)) {
      setHydration((prev) => ({ ...prev, isWallpaperReady: true }));
      return;
    }

    // تأخير تحميل الخلفية لتكون بعد الصوت والشات والبروفايلات
    const wallpaperDelayTimer = setTimeout(async () => {
      if (!isMounted) return;

      // إظهار تنبيه خفي بأن الخلفية يجري تحضيرها صامتاً
      setHydration((prev) => ({
        ...prev,
        wallpaperCacheNotice: {
          status: 'caching',
          text: 'جاري تجهيز وتثبيت خلفية الروم في الخلفية...'
        }
      }));

      // تحميل خفي صامت للصورة
      const success = await preloadWallpaperSilently(targetWallpaperUrl, wallpaperName);

      if (isMounted) {
        // حفظ في الحافظة المؤقتة لجوال المستخدم
        saveRoomStateToCache(roomId, {
          wallpaperUrl: targetWallpaperUrl,
          wallpaperName: wallpaperName || 'خلفية الروم'
        });

        setHydration((prev) => ({
          ...prev,
          isWallpaperReady: true,
          wallpaperCacheNotice: {
            status: 'ready',
            text: 'تم حفظ وتجهيز خلفية الروم في الذاكرة المؤقتة ✓'
          }
        }));

        // إخفاء التنبيه بعد ثانيتين
        setTimeout(() => {
          if (isMounted) {
            setHydration((prev) => ({ ...prev, wallpaperCacheNotice: null }));
          }
        }, 2200);
      }
    }, 480); // تبدأ بعد 480ms لضمان استقرار الصوت والمقاعد والشات أولاً

    return () => {
      isMounted = false;
      clearTimeout(wallpaperDelayTimer);
    };
  }, [roomId, targetWallpaperUrl, wallpaperName]);

  // 3. الاستماع لأحداث تحديث خلفية الروم
  useEffect(() => {
    const handleStatusUpdate = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.status === 'caching') {
        setHydration((prev) => ({
          ...prev,
          wallpaperCacheNotice: {
            status: 'caching',
            text: `جاري تحميل ${detail.wallpaperName || 'الخلفية الجديدة'} في الخلفية... 🎨`
          }
        }));
      } else if (detail?.status === 'ready') {
        setHydration((prev) => ({
          ...prev,
          isWallpaperReady: true,
          wallpaperCacheNotice: {
            status: 'ready',
            text: `تم حفظ ${detail.wallpaperName || 'الخلفية'} في الحافظة المؤقتة ✓`
          }
        }));
        setTimeout(() => {
          setHydration((prev) => ({ ...prev, wallpaperCacheNotice: null }));
        }, 2200);
      }
    };

    window.addEventListener('room_wallpaper_caching_status', handleStatusUpdate);
    return () => {
      window.removeEventListener('room_wallpaper_caching_status', handleStatusUpdate);
    };
  }, []);

  return hydration;
}
