// Service for Room Kick and Ban management (24 hours duration, VIP immunity, Owner-granted moderator permissions)

export interface RoomBannedUser {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  vipLevel: number;
  vipLabel?: string;
  bannedAt: number; // timestamp in ms
  bannedUntil: number; // timestamp in ms (bannedAt + 24 * 60 * 60 * 1000)
  bannedBy: string; // Actor name
  bannedByRole: 'owner' | 'moderator' | 'developer';
  reason?: string;
}

const STORAGE_PREFIX = 'super_legend_room_banned_';
const MOD_KICK_PERM_KEY = 'super_legend_mod_kick_perm_';
const BAN_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Extracts numeric VIP level from any user object
 * Returns 0 if no VIP
 */
export function extractVipLevel(user: {
  vip?: string | number;
  vipLevel?: number;
  badges?: Array<{ id?: string; label?: string }>;
} | null | undefined): number {
  if (!user) return 0;
  if (typeof user.vipLevel === 'number') return user.vipLevel;
  if (typeof user.vip === 'number') return user.vip;
  if (typeof user.vip === 'string') {
    const match = user.vip.match(/\d+/);
    if (match) return parseInt(match[0], 10);
  }
  if (user.badges && Array.isArray(user.badges)) {
    for (const b of user.badges) {
      if (b.label && b.label.includes('VIP')) {
        const match = b.label.match(/\d+/);
        if (match) return parseInt(match[0], 10);
      }
    }
  }
  return 0;
}

/**
 * Checks if target user is immune from being kicked
 * RULE: VIP 5 and above (VIP 5, 6, 7, 8, 9, 10...) cannot be kicked!
 * Only VIP < 5 (VIP 0, 1, 2, 3, 4) can be kicked.
 */
export function isUserImmuneFromKick(user: {
  vip?: string | number;
  vipLevel?: number;
  badges?: Array<{ id?: string; label?: string }>;
  isHost?: boolean;
  name?: string;
} | number | null | undefined): { immune: boolean; reason?: string; vipLevel: number } {
  if (user === null || user === undefined) return { immune: false, vipLevel: 0 };
  if (typeof user === 'number') {
    return {
      immune: user >= 5,
      reason: user >= 5 ? `عضو محمي (VIP ${user}) 👑: يمنع نظام الغرفة طرد الأعضاء ذوي رتبة VIP 5 فما فوق!` : undefined,
      vipLevel: user
    };
  }

  const isHost = Boolean(user.isHost || user.name?.includes('مالك') || user.name?.includes('المضيف'));
  if (isHost) {
    return { immune: true, reason: 'لا يمكن طرد مالك الغرفة أو المضيف 👑', vipLevel: 10 };
  }

  const vipLevel = extractVipLevel(user);
  if (vipLevel >= 5) {
    return {
      immune: true,
      reason: `عضو محمي (VIP ${vipLevel}) 👑: يمنع نظام الغرفة طرد الأعضاء ذوي رتبة VIP 5 فما فوق!`,
      vipLevel
    };
  }

  return { immune: false, vipLevel };
}

/**
 * Get the list of currently banned users for a room
 * Automatically filters out any entries older than 24 hours
 */
export function getRoomBannedUsers(roomId: string = '997812'): RoomBannedUser[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${roomId}`);
    if (!raw) return [];
    const parsed: RoomBannedUser[] = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    const now = Date.now();
    // Filter only those whose 24-hour ban is still active
    const activeBans = parsed.filter((b) => b.bannedUntil > now);

    // If some bans expired, persist updated clean list
    if (activeBans.length !== parsed.length) {
      localStorage.setItem(`${STORAGE_PREFIX}${roomId}`, JSON.stringify(activeBans));
    }

    return activeBans;
  } catch (e) {
    console.error('Error reading banned users:', e);
    return [];
  }
}

/**
 * Add a user to the 24-hour room ban list
 */
export function addRoomBannedUser(
  bannedEntry: Omit<RoomBannedUser, 'bannedAt' | 'bannedUntil'>,
  roomId: string = '997812'
): RoomBannedUser {
  const now = Date.now();
  const entry: RoomBannedUser = {
    ...bannedEntry,
    bannedAt: now,
    bannedUntil: now + BAN_DURATION_MS
  };

  if (typeof window === 'undefined') return entry;
  try {
    const existing = getRoomBannedUsers(roomId);
    // Remove if already present, then prepend
    const updated = [entry, ...existing.filter((b) => b.id !== entry.id && b.userId !== entry.userId)];
    localStorage.setItem(`${STORAGE_PREFIX}${roomId}`, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('room_banned_list_updated', { detail: { roomId, list: updated } }));
  } catch (e) {
    console.error('Error adding banned user:', e);
  }
  return entry;
}

/**
 * Convenience helper to ban a user for 24 hours
 */
export function banUserFromRoom(
  params: {
    userId: string;
    name: string;
    avatar?: string;
    vipLevel?: number;
    vipLabel?: string;
    bannedBy: string;
    bannedByRole: 'owner' | 'moderator' | 'developer';
    reason?: string;
  },
  roomId: string = '997812'
): RoomBannedUser {
  return addRoomBannedUser(
    {
      id: `ban-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId: params.userId,
      name: params.name,
      avatar: params.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      vipLevel: params.vipLevel || 0,
      vipLabel: params.vipLabel,
      bannedBy: params.bannedBy,
      bannedByRole: params.bannedByRole,
      reason: params.reason
    },
    roomId
  );
}

/**
 * Remove/Cancel a ban (Only owner or developer has authority)
 * Allows the user to re-enter the room immediately
 */
export function removeRoomBannedUser(userIdOrId: string, roomId: string = '997812'): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const existing = getRoomBannedUsers(roomId);
    const updated = existing.filter((b) => b.id !== userIdOrId && b.userId !== userIdOrId);
    localStorage.setItem(`${STORAGE_PREFIX}${roomId}`, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('room_banned_list_updated', { detail: { roomId, list: updated } }));
    return true;
  } catch (e) {
    console.error('Error removing banned user:', e);
    return false;
  }
}

/**
 * Check if a user is currently banned from this room
 */
export function isUserBannedFromRoom(userIdOrName: string, roomId: string = '997812'): boolean {
  if (!userIdOrName) return false;
  const list = getRoomBannedUsers(roomId);
  const now = Date.now();
  return list.some((b) => (b.userId === userIdOrName || b.id === userIdOrName || b.name === userIdOrName) && b.bannedUntil > now);
}

/**
 * Check if moderator has kick permission (granted by room owner)
 */
export function getModeratorKickPermission(roomId: string = '997812'): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const raw = localStorage.getItem(`${MOD_KICK_PERM_KEY}${roomId}`);
    if (raw !== null) {
      return raw === 'true';
    }
  } catch (e) {}
  // Default to true so default moderators have kick active until owner toggles off
  return true;
}

/**
 * Set moderator kick permission (Owner only action)
 */
export function setModeratorKickPermission(allowed: boolean, roomId: string = '997812'): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${MOD_KICK_PERM_KEY}${roomId}`, allowed ? 'true' : 'false');
    window.dispatchEvent(new CustomEvent('room_mod_kick_perm_changed', { detail: { allowed, roomId } }));
  } catch (e) {}
}

/**
 * Format remaining ban duration in Arabic (e.g. "23 ساعة و 45 دقيقة")
 */
export function formatRemainingBanTime(bannedUntil: number): string {
  const diffMs = bannedUntil - Date.now();
  if (diffMs <= 0) return 'انتهت المهلة';

  const totalMinutes = Math.floor(diffMs / (60 * 1000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0 && minutes > 0) {
    return `${hours} ساعة و ${minutes} دقيقة`;
  } else if (hours > 0) {
    return `${hours} ساعة`;
  } else {
    return `${Math.max(1, minutes)} دقيقة`;
  }
}
