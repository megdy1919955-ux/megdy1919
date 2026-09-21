import { RoomStatsData, RoomSupporter, RoomCharmReceiver, RoomClubMember } from '../types/roomStats';

const LOCAL_STORAGE_PREFIX = 'real_room_stats_v2_';

/**
 * Ensures any mock residue from older versions (such as 48.5M) is purged
 */
function cleanLegacyMockData(roomId: string) {
  try {
    const legacyDiamondsKey = `room_total_support_diamonds_${roomId}`;
    const legacySaved = localStorage.getItem(legacyDiamondsKey);
    if (legacySaved) {
      const parsed = parseInt(legacySaved, 10);
      if (parsed >= 40000000) {
        localStorage.setItem(legacyDiamondsKey, '0');
      }
    }
  } catch (e) {
    // ignore
  }
}

/**
 * Retrieve local cached stats or empty real state
 */
export function getLocalRoomStats(roomId: string): RoomStatsData {
  cleanLegacyMockData(roomId);
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PREFIX + roomId);
    if (raw) {
      const parsed = JSON.parse(raw) as RoomStatsData;
      if (parsed && typeof parsed.totalDiamonds === 'number') {
        if (parsed.totalDiamonds >= 40000000) {
          parsed.totalDiamonds = 0;
          parsed.supporters = [];
        }
        return parsed;
      }
    }
  } catch (e) {
    // ignore
  }

  return {
    roomId,
    totalDiamonds: 0,
    supporters: [],
    charmReceivers: [],
    clubMembers: [],
    updatedAt: Date.now()
  };
}

/**
 * Save stats to local cache
 */
export function saveLocalRoomStats(roomId: string, data: RoomStatsData) {
  try {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + roomId, JSON.stringify(data));
    localStorage.setItem(`room_total_support_diamonds_${roomId}`, data.totalDiamonds.toString());
  } catch (e) {
    // ignore
  }
}

/**
 * Fetch live room stats from the server (called ON-DEMAND when user opens modal)
 */
export async function fetchLiveRoomStats(roomId: string): Promise<RoomStatsData> {
  cleanLegacyMockData(roomId);
  try {
    const res = await fetch(`/api/rooms/${encodeURIComponent(roomId)}/stats`);
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data.totalDiamonds === 'number') {
        saveLocalRoomStats(roomId, data);
        return data;
      }
    }
  } catch (e) {
    // Server fetch error, fallback to local storage
  }

  return getLocalRoomStats(roomId);
}

/**
 * Record a support transaction (gift sent from supporter to mic receiver)
 */
export async function recordGiftSupport(
  roomId: string,
  params: {
    senderId: string;
    senderName: string;
    senderAvatar: string;
    senderLevel?: string;
    senderVip?: string;
    senderNLevel?: string;
    recipientId?: string;
    recipientName?: string;
    recipientAvatar?: string;
    recipientLevel?: string;
    recipientVip?: string;
    recipientNLevel?: string;
    giftValue: number;
  }
): Promise<RoomStatsData> {
  cleanLegacyMockData(roomId);
  const current = getLocalRoomStats(roomId);

  // Update total diamonds
  current.totalDiamonds += params.giftValue;

  // 1. Update or add supporter
  const existingSupIdx = current.supporters.findIndex((s) => s.userId === params.senderId);
  if (existingSupIdx >= 0) {
    current.supporters[existingSupIdx].amount += params.giftValue;
    current.supporters[existingSupIdx].val = `${current.supporters[existingSupIdx].amount.toLocaleString()} 💎`;
    current.supporters[existingSupIdx].name = params.senderName || current.supporters[existingSupIdx].name;
    current.supporters[existingSupIdx].avatar = params.senderAvatar || current.supporters[existingSupIdx].avatar;
    current.supporters[existingSupIdx].updatedAt = Date.now();
  } else {
    current.supporters.push({
      rank: 0,
      userId: params.senderId,
      name: params.senderName,
      avatar: params.senderAvatar,
      level: params.senderLevel || '1',
      vip: params.senderVip || 'VIP1',
      nLevel: params.senderNLevel || 'N.1',
      amount: params.giftValue,
      val: `${params.giftValue.toLocaleString()} 💎`,
      updatedAt: Date.now()
    });
  }

  // Sort and re-rank supporters
  current.supporters.sort((a, b) => b.amount - a.amount);
  current.supporters.forEach((s, idx) => {
    s.rank = idx + 1;
  });

  // 2. Update charm receiver if recipient is provided
  if (params.recipientId && params.recipientName && params.recipientName !== 'الجميع') {
    const existingCharmIdx = current.charmReceivers.findIndex((c) => c.userId === params.recipientId);
    if (existingCharmIdx >= 0) {
      current.charmReceivers[existingCharmIdx].charmPoints += params.giftValue;
      current.charmReceivers[existingCharmIdx].val = `${current.charmReceivers[existingCharmIdx].charmPoints.toLocaleString()} ✨`;
      current.charmReceivers[existingCharmIdx].updatedAt = Date.now();
    } else {
      current.charmReceivers.push({
        rank: 0,
        userId: params.recipientId,
        name: params.recipientName,
        avatar: params.recipientAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100',
        level: params.recipientLevel || '1',
        vip: params.recipientVip || 'VIP1',
        nLevel: params.recipientNLevel || 'N.1',
        charmPoints: params.giftValue,
        val: `${params.giftValue.toLocaleString()} ✨`,
        updatedAt: Date.now()
      });
    }

    // Sort and re-rank charm receivers
    current.charmReceivers.sort((a, b) => b.charmPoints - a.charmPoints);
    current.charmReceivers.forEach((c, idx) => {
      c.rank = idx + 1;
    });
  }

  current.updatedAt = Date.now();
  saveLocalRoomStats(roomId, current);

  // Send to server in background
  try {
    fetch(`/api/rooms/${encodeURIComponent(roomId)}/stats/record`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    }).catch(() => {});
  } catch (e) {
    // ignore
  }

  return current;
}

/**
 * Join Room Club
 */
export async function joinRoomClub(
  roomId: string,
  user: { userId: string; name: string; avatar: string }
): Promise<RoomStatsData> {
  const current = getLocalRoomStats(roomId);
  const exists = current.clubMembers.some((m) => m.userId === user.userId);
  if (!exists) {
    current.clubMembers.unshift({
      userId: user.userId,
      name: user.name,
      avatar: user.avatar,
      joinedAt: Date.now(),
      role: 'member'
    });
    saveLocalRoomStats(roomId, current);

    try {
      fetch(`/api/rooms/${encodeURIComponent(roomId)}/club/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      }).catch(() => {});
    } catch (e) {
      // ignore
    }
  }

  return current;
}

/**
 * Leave Room Club
 */
export async function leaveRoomClub(roomId: string, userId: string): Promise<RoomStatsData> {
  const current = getLocalRoomStats(roomId);
  current.clubMembers = current.clubMembers.filter((m) => m.userId !== userId);
  saveLocalRoomStats(roomId, current);

  try {
    fetch(`/api/rooms/${encodeURIComponent(roomId)}/club/leave`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    }).catch(() => {});
  } catch (e) {
    // ignore
  }

  return current;
}

/**
 * Reset Room Stats (0 total diamonds, empty lists)
 */
export async function resetRoomStats(roomId: string): Promise<RoomStatsData> {
  const fresh: RoomStatsData = {
    roomId,
    totalDiamonds: 0,
    supporters: [],
    charmReceivers: [],
    clubMembers: getLocalRoomStats(roomId).clubMembers, // preserve club members
    updatedAt: Date.now()
  };

  saveLocalRoomStats(roomId, fresh);
  try {
    localStorage.setItem(`room_total_support_diamonds_${roomId}`, '0');
    localStorage.removeItem(`room_supporters_leaderboard_${roomId}`);
  } catch (e) {}

  try {
    fetch(`/api/rooms/${encodeURIComponent(roomId)}/stats/reset`, {
      method: 'POST'
    }).catch(() => {});
  } catch (e) {
    // ignore
  }

  return fresh;
}
