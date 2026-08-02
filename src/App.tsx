/**
 * تطبيق سوبر ليجند (Super Legend)
 * Copyright (c) 2026 Super Legend. All Rights Reserved.
 * جميع الحقوق محفوظة بالكامل للمالك والمطور. وتعتبر كافة الأكواد، التصاميم، الهياكل، والعلامة التجارية ملكية خاصة وحصرية له، ولا يجوز نسخها أو استخدامها دون إذن خطي مسبق.
 */

import React, { useState } from 'react';
import { ProfileScreen } from './components/ProfileScreen';
import { Smartphone, Monitor, ShieldCheck } from 'lucide-react';

export default function App() {
  const [viewMode, setViewMode] = useState<'mobile' | 'full'>('mobile');

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center">
      {/* Dev Preview Mode Toggle Header */}
      <header className="w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-4 py-2 flex items-center justify-between text-xs sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-extrabold text-slate-200 dir-rtl">منصة سوبر ليجند (Super Legend)</span>
          <span className="hidden sm:inline-block text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20 font-bold">
            جميع الحقوق محفوظة © 2026
          </span>
        </div>

        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setViewMode('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              viewMode === 'mobile' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>عرض الهاتف</span>
          </button>
          <button
            onClick={() => setViewMode('full')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              viewMode === 'full' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>عرض كامل</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full flex-1 flex justify-center items-start p-0 sm:p-4">
        {viewMode === 'mobile' ? (
          <div className="w-full max-w-[440px] my-0 sm:my-4 bg-[#F4F5F9] dark:bg-[#0F0F17] sm:rounded-[36px] sm:shadow-2xl sm:ring-1 sm:ring-slate-800 overflow-hidden min-h-[840px] border-x border-slate-800/40">
            <ProfileScreen />
          </div>
        ) : (
          <div className="w-full bg-[#F4F5F9] dark:bg-[#0F0F17] min-h-screen">
            <ProfileScreen />
          </div>
        )}
      </main>

      {/* Outer App Footer */}
      <footer className="w-full py-3 px-4 bg-slate-950 border-t border-slate-800/60 text-center text-[11px] text-slate-400 flex items-center justify-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>
          تطبيق <strong>سوبر ليجند (Super Legend)</strong> © 2026 - جميع حقوق الملكية الفكرية والأكواد والتصاميم محفوظة للمالك والمطور.
        </span>
      </footer>
    </div>
  );
}

