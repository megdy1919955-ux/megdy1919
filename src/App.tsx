/**
 * تطبيق النجم (Al-Najm Voice Chat)
 * Copyright (c) 2026 Al-Najm. All Rights Reserved.
 * الروم الصوتي الكامل مع كافة أدوات المايكات، الدردشة، الفعاليات، الهدايا، والمقاعد
 */

import React, { Suspense } from 'react';
import { FullscreenToggle } from './components/FullscreenToggle';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ExitAppConfirmModal } from './components/ExitAppConfirmModal';
import { VoiceRoomScreen } from './components/VoiceRoomScreen';
import { getCurrentAuthUser } from './lib/authService';

export default function App() {
  const authUser = getCurrentAuthUser();

  return (
    <ErrorBoundary>
      <div className="w-full min-h-screen min-h-[100dvh] h-full bg-[#0F0F17] text-slate-100 flex flex-col select-none overflow-x-hidden relative">
        <FullscreenToggle />

        {/* عرض الغرفة الصوتية مباشرة بكامل أدواتها ومقاعدها */}
        <Suspense
          fallback={
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B0D13] text-amber-400 gap-3">
              <div className="w-10 h-10 border-4 border-amber-400/20 border-t-amber-400 rounded-full animate-spin"></div>
              <span className="font-bold text-sm tracking-wide">جاري تحميل وتجهيز الغرفة الصوتية بكافة تفاصيلها...</span>
            </div>
          }
        >
          <VoiceRoomScreen
            roomTitle="روم صقر اليمن 🦅 - سوالف وتر"
            roomAvatar="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400"
            hostName={authUser?.name || "أميرة الشرق 👑"}
            roomId="7798my-r"
            isOwner={true}
            currentUserId={authUser?.id || "88492011"}
            currentUserName={authUser?.name || "صقر العرب 👑 (المالك)"}
            currentUserAvatar={authUser?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200"}
            currentUserVip={authUser?.vipTier || "VIP8"}
            onClose={() => {}}
            onMinimize={() => {}}
            onOpenRecharge={() => {}}
            onNavigateToRoom={(room) => console.log('Navigate to room:', room)}
          />
        </Suspense>

        <ExitAppConfirmModal />
      </div>
    </ErrorBoundary>
  );
}
