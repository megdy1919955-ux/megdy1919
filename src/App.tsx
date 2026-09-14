/**
 * تطبيق النجم (Al-Najm Voice Chat)
 * Copyright (c) 2026 Al-Najm. All Rights Reserved.
 * جميع حقوق الملكية الفكرية والعلامة التجارية مسجلة ومحفوظة بالكامل للمالك والمطور. وتعتبر كافة الأكواد، التصاميم، الهياكل، والشعار الرسمي "النجم (Al-Najm)" ملكية خاصة وحصرية له، ولا يجوز نسخها أو استخدامها دون إذن خطي مسبق.
 */

import React from 'react';
import { ProfileScreen } from './components/ProfileScreen';
import { FullscreenToggle } from './components/FullscreenToggle';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <div className="w-full min-h-screen min-h-[100dvh] h-full bg-[#0F0F17] text-slate-100 flex flex-col select-none overflow-x-hidden relative">
        <FullscreenToggle />
        <ProfileScreen />
      </div>
    </ErrorBoundary>
  );
}

