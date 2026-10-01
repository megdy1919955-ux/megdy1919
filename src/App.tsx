/**
 * تطبيق النجم (Al-Najm Voice Chat)
 * Copyright (c) 2026 Al-Najm. All Rights Reserved.
 * جميع حقوق الملكية الفكرية والعلامة التجارية مسجلة ومحفوظة بالكامل للمالك والمطور.
 */

import React, { useState, useEffect, Suspense } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';
import { FullscreenToggle } from './components/FullscreenToggle';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ExitAppConfirmModal } from './components/ExitAppConfirmModal';
import { ProfileShellSkeleton } from './components/common/ProfileShellSkeleton';
import {
  getCurrentAuthUser,
  AuthUserData,
  handleFirebaseUserLogin,
  checkFirebaseRedirectResult
} from './lib/authService';
import { checkUrlPersonaSwitch } from './lib/urlPersonaService';
import { startLiveUserSync } from './lib/userSyncService';
import { NajmLogo } from './components/common/NajmLogo';
import { UserOnboardingModal } from './components/UserOnboardingModal';

const ProfileScreen = React.lazy(() => import('./components/ProfileScreen').then(m => ({ default: m.ProfileScreen })));
const LoginScreen = React.lazy(() => import('./components/LoginScreen').then(m => ({ default: m.LoginScreen })));

export default function App() {
  const [currentUser, setCurrentUser] = useState<AuthUserData | null>(() => {
    const urlPersona = checkUrlPersonaSwitch();
    if (urlPersona) return urlPersona;
    return getCurrentAuthUser();
  });
  // إذا كان هناك مستخدم محفوظ محلياً نبدأ مباشرة، وإلا ننتظر تأكيد الجلسة من Firebase
  const [isCheckingSession, setIsCheckingSession] = useState<boolean>(() => {
    const urlPersona = checkUrlPersonaSwitch();
    return !urlPersona && !getCurrentAuthUser();
  });

  // التحقق التلقائي من الجلسة ومصادقة Firebase Auth (Session Check)
  useEffect(() => {
    let isMounted = true;

    // فحص الرابط المباشر لتسجيل الدخول الفوري للشخصية
    const switchedUser = checkUrlPersonaSwitch();
    if (switchedUser) {
      setCurrentUser(switchedUser);
      setIsCheckingSession(false);
      return;
    }

    // 1. فحص نتيجة إعادة التوجيه لـ Google إن وجدت
    checkFirebaseRedirectResult().then((redirectUser) => {
      if (!isMounted) return;
      if (redirectUser) {
        setCurrentUser(redirectUser);
        setIsCheckingSession(false);
      }
    });

    // 2. مراقبة حالة Firebase Auth الرسمية
    const unsubscribeAuth = onAuthStateChanged(auth, async (fbUser) => {
      if (!isMounted) return;

      if (fbUser) {
        try {
          const user = await handleFirebaseUserLogin(fbUser);
          if (isMounted) {
            setCurrentUser(user);
            setIsCheckingSession(false);
          }
        } catch (e) {
          console.warn('[App Auth] Error syncing Firebase user:', e);
          if (isMounted) setIsCheckingSession(false);
        }
      } else {
        // لا يوجد مستخدم مسجل في Firebase Auth
        const local = getCurrentAuthUser();
        if (isMounted) {
          if (local && local.loginType !== 'google') {
            // جلسة هاتف أو رمز مطور محلية
            setCurrentUser(local);
          } else if (local && local.loginType === 'google') {
            // جلسة جوجل غير نشطة في فايربيس
            setCurrentUser(null);
          } else {
            setCurrentUser(null);
          }
          setIsCheckingSession(false);
        }
      }
    });

    // 3. الاستماع لأحداث تحديث الجلسة في التطبيق
    const handleAuthChange = (e: CustomEvent<AuthUserData | null>) => {
      if (isMounted) {
        setCurrentUser(e.detail);
        setIsCheckingSession(false);
      }
    };
    window.addEventListener('najm_auth_state_changed' as any, handleAuthChange);

    return () => {
      isMounted = false;
      unsubscribeAuth();
      window.removeEventListener('najm_auth_state_changed' as any, handleAuthChange);
    };
  }, []);

  // المزامنة الحية المباشرة مع Firebase لبيانات المستخدم ورصيد الكوينز
  useEffect(() => {
    if (currentUser?.id) {
      const unsubscribe = startLiveUserSync(currentUser.id, (freshProfile) => {
        setCurrentUser((prev) =>
          prev ? { ...prev, coins: freshProfile.coins, diamonds: freshProfile.diamonds } : null
        );
      });
      return () => {
        unsubscribe();
      };
    }
  }, [currentUser?.id]);

  return (
    <ErrorBoundary>
      <div className="w-full min-h-screen min-h-[100dvh] h-full bg-[#0F0F17] text-slate-100 flex flex-col select-none overflow-x-hidden relative">
        <FullscreenToggle />

        {/* أثناء التحقق الأولي من الجلسة للمستخدمين الجدد */}
        {isCheckingSession && !currentUser ? (
          <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B0F19] text-center p-6 gap-4">
            <div className="w-24 h-24 relative flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-amber-500/20 blur-xl animate-pulse" />
              <NajmLogo className="w-20 h-20 relative z-10" />
            </div>
            <div className="flex flex-col items-center gap-2">
              <h2 className="text-xl font-black text-amber-400">تطبيق النجم الصوتي</h2>
              <p className="text-xs text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                جاري التحقق من الجلسة وتسجيل الدخول...
              </p>
            </div>
          </div>
        ) : !currentUser ? (
          /* المستخدم غير مسجل الدخول -> توجيهه لشاشة تسجيل الدخول */
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-amber-400 font-bold">جاري تشغيل التطبيق...</div>}>
            <LoginScreen onLoginSuccess={(user) => setCurrentUser(user)} />
          </Suspense>
        ) : !currentUser.hasCompletedOnboarding ? (
          /* شاشة تهيئة البيانات للمستخدم الجديد (حظر الانتقال للشاشة الرئيسية حتى استكمال البيانات وحفظها) */
          <UserOnboardingModal
            user={currentUser}
            onComplete={(completedUser) => {
              setCurrentUser(completedUser);
            }}
          />
        ) : (
          /* المستخدم لديه جلسة نشطة ومكتمل التهيئة -> نقله مباشرة للشاشة الرئيسية بدون أي مطالبة بالتسجيل */
          <Suspense fallback={<ProfileShellSkeleton />}>
            <ProfileScreen />
          </Suspense>
        )}

        <ExitAppConfirmModal />
      </div>
    </ErrorBoundary>
  );
}
