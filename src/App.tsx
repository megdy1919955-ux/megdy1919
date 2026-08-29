/**
 * تطبيق ترف شات (Taraf Chat)
 * Copyright (c) 2026 Taraf Chat. All Rights Reserved.
 * جميع حقوق الملكية الفكرية والعلامة التجارية مسجلة ومحفوظة بالكامل للمالك والمطور. وتعتبر كافة الأكواد، التصاميم، الهياكل، والشعار الرسمي "ترف (TARAF)" ملكية خاصة وحصرية له، ولا يجوز نسخها أو استخدامها دون إذن خطي مسبق.
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

