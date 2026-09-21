/**
 * تطبيق النجم (Al-Najm Voice Chat)
 * Copyright (c) 2026 Al-Najm. All Rights Reserved.
 * جميع حقوق الملكية الفكرية والعلامة التجارية مسجلة ومحفوظة بالكامل للمالك والمطور. وتعتبر كافة الأكواد، التصاميم، الهياكل، والشعار الرسمي "النجم (Al-Najm)" ملكية خاصة وحصرية له، ولا يجوز نسخها أو استخدامها دون إذن خطي مسبق.
 */

import React, { useState, useEffect, Suspense } from 'react';
import { FullscreenToggle } from './components/FullscreenToggle';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ExitAppConfirmModal } from './components/ExitAppConfirmModal';
import { ProfileShellSkeleton } from './components/common/ProfileShellSkeleton';
import { getCurrentAuthUser, AuthUserData } from './lib/authService';

const ProfileScreen = React.lazy(() => import('./components/ProfileScreen').then(m => ({ default: m.ProfileScreen })));
const LoginScreen = React.lazy(() => import('./components/LoginScreen').then(m => ({ default: m.LoginScreen })));

export default function App() {
  const [currentUser, setCurrentUser] = useState<AuthUserData | null>(() => getCurrentAuthUser());

  useEffect(() => {
    const handleAuthChange = (e: CustomEvent<AuthUserData | null>) => {
      setCurrentUser(e.detail);
    };

    window.addEventListener('najm_auth_state_changed' as any, handleAuthChange);
    return () => {
      window.removeEventListener('najm_auth_state_changed' as any, handleAuthChange);
    };
  }, []);

  return (
    <ErrorBoundary>
      <div className="w-full min-h-screen min-h-[100dvh] h-full bg-[#0F0F17] text-slate-100 flex flex-col select-none overflow-x-hidden relative">
        <FullscreenToggle />

        {/* إذا لم يسجل المستخدم الدخول بعد، تظهر له أول شاشة ترحيبية وتسجيل الدخول */}
        {!currentUser ? (
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-amber-400 font-bold">جاري تشغيل التطبيق...</div>}>
            <LoginScreen onLoginSuccess={(user) => setCurrentUser(user)} />
          </Suspense>
        ) : (
          <Suspense fallback={<ProfileShellSkeleton />}>
            <ProfileScreen />
          </Suspense>
        )}

        <ExitAppConfirmModal />
      </div>
    </ErrorBoundary>
  );
}

