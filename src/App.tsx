/**
 * تطبيق سوبر ليجند (Super Legend)
 * Copyright (c) 2026 Super Legend. All Rights Reserved.
 * جميع الحقوق محفوظة بالكامل للمالك والمطور. وتعتبر كافة الأكواد، التصاميم، الهياكل، والعلامة التجارية ملكية خاصة وحصرية له، ولا يجوز نسخها أو استخدامها دون إذن خطي مسبق.
 */

import React from 'react';
import { ProfileScreen } from './components/ProfileScreen';
import { FullscreenToggle } from './components/FullscreenToggle';

export default function App() {
  return (
    <div className="w-full min-h-screen min-h-[100dvh] h-full bg-[#0F0F17] text-slate-100 flex flex-col select-none overflow-x-hidden relative">
      <FullscreenToggle />
      <ProfileScreen />
    </div>
  );
}

