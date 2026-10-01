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
  activeSession = null;
  notifySubscribers();
  if (typeof window !== 'undefined') {
    queueMicrotask(() => {
      window.dispatchEvent(new CustomEvent('room_session_changed', { detail: { session: null } }));
      window.dispatchEvent(new CustomEvent('room_exited'));
    });
  }
}

export function dissolveRoomSession(roomId?: string): void {
  activeSession = null;
  notifySubscribers();
  if (typeof window !== 'undefined') {
    queueMicrotask(() => {
      // Notify all listeners that room was dissolved and everyone is ejected by the room owner
      window.dispatchEvent(new CustomEvent('room_dissolved_by_owner', { detail: { roomId } }));
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
