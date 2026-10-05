/**
 * خدمة إدارة جلسة الغرفة الصوتية ونشاط الخلفية والإحالة
 * Room Session & Background Activity Management Service
 * Super Legend App (c) 2026
 */

export interface ActiveRoomSession {
  roomId: string;
  roomTitle: string;
  hostName: string;
  roomAvatar?: string;
  isOwner?: boolean;
  ownerId?: string;
  listenerCount?: number;
  isMinimized: boolean;
  isMuted?: boolean;
}

let activeSession: ActiveRoomSession | null = null;
const listeners = new Set<(session: ActiveRoomSession | null) => void>();

export function getActiveRoomSession(): ActiveRoomSession | null {
  return activeSession;
}

export function setActiveRoomSession(session: ActiveRoomSession | null): void {
  if (
    activeSession &&
    session &&
    activeSession.roomId === session.roomId &&
    activeSession.roomTitle === session.roomTitle &&
    activeSession.hostName === session.hostName &&
    activeSession.roomAvatar === session.roomAvatar &&
    activeSession.isMinimized === session.isMinimized &&
    activeSession.isMuted === session.isMuted &&
    activeSession.isOwner === session.isOwner
  ) {
    return; // No meaningful change, avoid trigger loops
  }
  activeSession = session;
  notifySubscribers();
  if (typeof window !== 'undefined') {
    queueMicrotask(() => {
      window.dispatchEvent(new CustomEvent('room_session_changed', { detail: { session } }));
    });
  }
}

export function minimizeRoomSession(): void {
  if (activeSession) {
    activeSession = {
      ...activeSession,
      isMinimized: true,
    };
    notifySubscribers();
    if (typeof window !== 'undefined') {
      queueMicrotask(() => {
        window.dispatchEvent(new CustomEvent('room_session_changed', { detail: { session: activeSession } }));
        window.dispatchEvent(new CustomEvent('room_minimized', { detail: { session: activeSession } }));
      });
    }
  }
}

export function maximizeRoomSession(): void {
  if (activeSession) {
    activeSession = {
      ...activeSession,
      isMinimized: false,
    };
    notifySubscribers();
    if (typeof window !== 'undefined') {
      queueMicrotask(() => {
        window.dispatchEvent(new CustomEvent('room_session_changed', { detail: { session: activeSession } }));
        window.dispatchEvent(new CustomEvent('room_maximized', { detail: { session: activeSession } }));
      });
    }
  }
}

export function toggleRoomSessionMute(): boolean {
  if (activeSession) {
    const newMuted = !activeSession.isMuted;
    activeSession = {
      ...activeSession,
      isMuted: newMuted,
    };
    notifySubscribers();
    if (typeof window !== 'undefined') {
      queueMicrotask(() => {
        window.dispatchEvent(new CustomEvent('room_session_changed', { detail: { session: activeSession } }));
        window.dispatchEvent(new CustomEvent('room_mute_toggled', { detail: { isMuted: newMuted } }));
      });
    }
    return newMuted;
  }
  return false;
}

export function exitRoomSession(): void {
  const previousRoomId = activeSession?.roomId;
  if (previousRoomId) {
    setRoomLiveStatus(previousRoomId, false);
  }
  activeSession = null;
  notifySubscribers();
  if (typeof window !== 'undefined') {
    queueMicrotask(() => {
      window.dispatchEvent(new CustomEvent('room_session_changed', { detail: { session: null } }));
      window.dispatchEvent(new CustomEvent('room_exited', { detail: { roomId: previousRoomId } }));
    });
  }
}

export function dissolveRoomSession(roomId?: string): void {
  const targetId = roomId || activeSession?.roomId;
  if (targetId) {
    setRoomLiveStatus(targetId, false);
  }
  activeSession = null;
  notifySubscribers();
  if (typeof window !== 'undefined') {
    queueMicrotask(() => {
      // Notify all listeners that room was dissolved and everyone is ejected by the room owner
      window.dispatchEvent(new CustomEvent('room_dissolved_by_owner', { detail: { roomId: targetId } }));
      window.dispatchEvent(new CustomEvent('room_session_changed', { detail: { session: null } }));
    });
  }
}

export function subscribeToRoomSession(callback: (session: ActiveRoomSession | null) => void): () => void {
  listeners.add(callback);
  const current = activeSession;
  queueMicrotask(() => {
    if (listeners.has(callback)) {
      try {
        callback(current);
      } catch (e) {
        console.error('Error executing initial room session callback:', e);
      }
    }
  });
  return () => {
    listeners.delete(callback);
  };
}

function notifySubscribers(): void {
  const current = activeSession;
  queueMicrotask(() => {
    listeners.forEach((cb) => {
      try {
        cb(current);
      } catch (e) {
        console.error('Error notifying room session subscriber:', e);
      }
    });
  });
}

// ================= LIVE ROOM STATE TRACKING =================

const liveRoomsMap = new Map<string, boolean>();
const liveRoomsListeners = new Set<(roomId: string, isLive: boolean) => void>();

export function isRoomLive(roomId: string): boolean {
  if (activeSession && activeSession.roomId === roomId) {
    return true;
  }
  if (liveRoomsMap.has(roomId)) {
    return Boolean(liveRoomsMap.get(roomId));
  }
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(`super_legend_room_live_${roomId}`);
      if (stored !== null) {
        return stored === 'true';
      }
    } catch (e) {}
  }
  return false;
}

export function setRoomLiveStatus(
  roomId: string,
  isLive: boolean,
  meta?: { ownerId?: string; ownerName?: string; listenerCount?: number }
): void {
  liveRoomsMap.set(roomId, isLive);

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(`super_legend_room_live_${roomId}`, isLive ? 'true' : 'false');
      if (meta) {
        localStorage.setItem(`super_legend_room_live_meta_${roomId}`, JSON.stringify(meta));
      } else if (!isLive) {
        localStorage.removeItem(`super_legend_room_live_meta_${roomId}`);
      }
    } catch (e) {}

    queueMicrotask(() => {
      window.dispatchEvent(
        new CustomEvent('room_live_status_changed', {
          detail: { roomId, isLive, meta }
        })
      );
    });
  }

  liveRoomsListeners.forEach((cb) => {
    try {
      cb(roomId, isLive);
    } catch (e) {
      console.error('Error notifying live room listener:', e);
    }
  });
}

export function subscribeToRoomLiveStatus(
  roomId: string,
  callback: (isLive: boolean, meta?: any) => void
): () => void {
  const handler = (targetRoomId: string, isLive: boolean) => {
    if (targetRoomId === roomId) {
      callback(isLive);
    }
  };
  liveRoomsListeners.add(handler);

  // Trigger initial callback state immediately
  callback(isRoomLive(roomId));

  const handleWindowChange = (e: Event) => {
    const custom = e as CustomEvent;
    if (custom.detail?.roomId === roomId) {
      callback(Boolean(custom.detail.isLive), custom.detail.meta);
    }
  };

  const handleSessionChange = (e: Event) => {
    const custom = e as CustomEvent;
    const session = custom.detail?.session as ActiveRoomSession | null;
    if (session && session.roomId === roomId) {
      callback(true);
    } else if (!session && (!activeSession || activeSession.roomId === roomId)) {
      callback(isRoomLive(roomId));
    }
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('room_live_status_changed', handleWindowChange);
    window.addEventListener('room_session_changed', handleSessionChange);
  }

  return () => {
    liveRoomsListeners.delete(handler);
    if (typeof window !== 'undefined') {
      window.removeEventListener('room_live_status_changed', handleWindowChange);
      window.removeEventListener('room_session_changed', handleSessionChange);
    }
  };
}

