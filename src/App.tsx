/**
 * تطبيق النجم (Al-Najm Voice Chat)
 * Copyright (c) 2026 Al-Najm. All Rights Reserved.
 * ملف إدارة الشاشات والتنقلات الرئيسية (Root Application Router & Shell)
 * مرتبط كلياً بـ Firebase Authentication وقاعدة بيانات Cloud Firestore
 * يعالج مشكلة اضطراب التنقلات وتأكيد الرجوع وإغلاق التطبيق في هواتف الأندرويد
 */

import React, { useState, useEffect, Suspense } from 'react';
import { FullscreenToggle } from './components/FullscreenToggle';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ExitAppConfirmModal } from './components/ExitAppConfirmModal';
import { ProfileShellSkeleton } from './components/common/ProfileShellSkeleton';
import {
  getCurrentAuthUser,
  subscribeToAuthUser,
  subscribeToAuthReady,
  isAuthReady,
  AuthUserData
} from './lib/authService';
import { App as CapApp } from '@capacitor/app';
import { backNavigation } from './lib/backNavigation';

const ProfileScreen = React.lazy(() =>
  import('./components/ProfileScreen').then((m) => ({ default: m.ProfileScreen }))
);
const LoginScreen = React.lazy(() =>
  import('./components/LoginScreen').then((m) => ({ default: m.LoginScreen }))
);

export default function App() {
  const [currentUser, setCurrentUser] = useState<AuthUserData | null>(() => getCurrentAuthUser());
  const [authInitialized, setAuthInitialized] = useState<boolean>(() => isAuthReady());

  useEffect(() => {
    // 1. الاشتراك الفوري في جاهزية التحقق السحابي لمنع وميض الشاشات أو اضطراب التنقل
    const unsubReady = subscribeToAuthReady((ready) => {
      setAuthInitialized(ready);
    });

    // 2. الاشتراك التفاعلي المباشر في بيانات المستخدم الموثق عبر Firebase Auth
    const unsubUser = subscribeToAuthUser((user) => {
      setCurrentUser(user);
    });

    // 3. ربط زر الرجوع الفعلي وإيماءة سحب الرجوع في نظام أندرويد عبر Capacitor
    let removeCapListener: (() => void) | null = null;
    CapApp.addListener('backButton', () => {
      backNavigation.goBack();
    }).then((sub) => {
      removeCapListener = () => {
        sub.remove();
      };
    }).catch(() => {});

    // دالة استدعاء مباشرة من ملف MainActivity.java عند ضغط زر الرجوع بالجوال
    (window as any).handleAndroidHardwareBack = () => {
      backNavigation.goBack();
      return true;
    };

    return () => {
      unsubReady();
      unsubUser();
      if (removeCapListener) removeCapListener();
      delete (window as any).handleAndroidHardwareBack;
    };
  }, []);

  return (
    <ErrorBoundary>
      <div className="w-full min-h-screen min-h-[100dvh] h-full bg-[#0F0F17] text-slate-100 flex flex-col select-none overflow-x-hidden relative">
        <FullscreenToggle />

        {/* أثناء التحقق الأولي من جلسة Firebase السحابية: منع الوميض والتنقل المضطرب */}
        {!authInitialized ? (
          <div className="min-h-screen flex flex-col items-center justify-center bg-[#0F0F17] text-slate-200 gap-3">
            <div className="w-10 h-10 border-3 border-amber-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-bold text-slate-400 font-mono">
              جاري التحقق من الحساب والمزامنة السحابية...
            </span>
          </div>
        ) : !currentUser ? (
          /* إذا لم يكن المستخدم مسجلاً تظهر له شاشة تسجيل الدخول الموثقة */
          <Suspense
            fallback={
              <div className="min-h-screen flex items-center justify-center text-amber-400 font-bold">
                جاري تشغيل التطبيق...
              </div>
            }
          >
            <LoginScreen onLoginSuccess={(user) => setCurrentUser(user)} />
          </Suspense>
        ) : (
          /* عند وجود جلسة موثقة يتم عرض واجهة التطبيق الرئيسية والغرف والمحادثات */
          <Suspense fallback={<ProfileShellSkeleton />}>
            <ProfileScreen />
          </Suspense>
        )}

        {/* نافذة تأكيد إغلاق التطبيق عند آخر رجوع */}
        <ExitAppConfirmModal />
      </div>
    </ErrorBoundary>
  );
}
