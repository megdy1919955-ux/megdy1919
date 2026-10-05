import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc
} from 'firebase/firestore';
import { db, IS_CLOUD_SYNC_DISABLED, OperationType, handleFirestoreError } from '../lib/firebase';
import { sanitizeFirestoreData } from '../lib/roomRealtimeService';
import {
  RoomStatsData,
  RoomSupporter,
  RoomCharmReceiver,
  RoomClubMember
} from '../types/roomStats';

const LOCAL_STORAGE_PREFIX = 'real_room_stats_v3_';
const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

/**
 * Clean mock residue or old artifacts
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
 * Retrieve local cached room stats
 */
export function getLocalRoomStats(roomId: string): RoomStatsData {
  const safeRoomId = roomId || 'default-room';
  cleanLegacyMockData(safeRoomId);
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PREFIX + safeRoomId);
    if (raw) {
      const parsed = JSON.parse(raw) as RoomStatsData;
      if (parsed && typeof parsed.totalDiamonds === 'number') {
        return {
          roomId: safeRoomId,
          totalDiamonds: parsed.totalDiamonds,
          supporters: Array.isArray(parsed.supporters) ? parsed.supporters.slice(0, 30) : [],
          supporters24h: Array.isArray(parsed.supporters24h) ? parsed.supporters24h : [],
          charmReceivers: Array.isArray(parsed.charmReceivers) ? parsed.charmReceivers.slice(0, 30) : [],
          charmReceivers24h: Array.isArray(parsed.charmReceivers24h) ? parsed.charmReceivers24h : [],
          clubMembers: Array.isArray(parsed.clubMembers) ? parsed.clubMembers : [],
          updatedAt: parsed.updatedAt || Date.now()
        };
      }
    }
  } catch (e) {
    // ignore
  }

  return {
    roomId: safeRoomId,
    totalDiamonds: 0,
    supporters: [],
    supporters24h: [],
    charmReceivers: [],
    charmReceivers24h: [],
    clubMembers: [],
    updatedAt: Date.now()
  };
}

/**
 * Save stats to local storage cache
 */
export function saveLocalRoomStats(roomId: string, data: RoomStatsData) {
  const safeRoomId = roomId || 'default-room';
  try {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + safeRoomId, JSON.stringify(data));
    localStorage.setItem(`room_total_support_diamonds_${safeRoomId}`, data.totalDiamonds.toString());
  } catch (e) {
    // ignore
  }
}

/**
 * Fetch live room stats ON-DEMAND from Firebase Firestore.
 * Implements 24-hour rolling reset per account & strictly top 30 for All-Time.
 */
export async function fetchLiveRoomStats(roomId: string): Promise<RoomStatsData> {
  const safeRoomId = roomId || 'default-room';
  cleanLegacyMockData(safeRoomId);

  const localFallback = getLocalRoomStats(safeRoomId);
  if (IS_CLOUD_SYNC_DISABLED) {
    return localFallback;
  }

  const now = Date.now();
  const cutoff24h = now - TWENTY_FOUR_HOURS_MS;

  try {
    // 1. Fetch Room General Stats Doc
    const statsDocRef = doc(db, 'rooms', safeRoomId, 'stats', 'general');
    let totalDiamonds = localFallback.totalDiamonds;
    try {
      const statsSnap = await getDoc(statsDocRef);
      if (statsSnap.exists()) {
        const statsData = statsSnap.data();
        if (typeof statsData.totalDiamonds === 'number') {
          totalDiamonds = statsData.totalDiamonds;
        }
      }
    } catch (e) {
      console.warn('Could not read room general stats doc:', e);
    }

    // 2. Fetch Supporters from Firestore
    const supportersRef = collection(db, 'rooms', safeRoomId, 'supporters');
    const supportersSnap = await getDocs(supportersRef);

    const allTimeSupporters: RoomSupporter[] = [];
    const rollingSupporters24h: RoomSupporter[] = [];

    supportersSnap.forEach((docSnap) => {
      const data = docSnap.data();
      const userId = docSnap.id;
      const name = data.name || 'داعم';
      const avatar = data.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150';
      const level = String(data.level || '1');
      const vip = String(data.vip || 'VIP1');
      const nLevel = String(data.nLevel || 'N.1');
      const totalAmount = Number(data.totalAmount || 0);
      const history: Array<{ amount: number; timestamp: number }> = Array.isArray(data.history)
        ? data.history
        : [];

      // Add to all-time pool if they have support
      if (totalAmount > 0) {
        allTimeSupporters.push({
          rank: 0,
          userId,
          name,
          avatar,
          level,
          vip,
          nLevel,
          amount: totalAmount,
          val: `${totalAmount.toLocaleString()} 💎`,
          updatedAt: data.updatedAt || now
        });
      }

      // Calculate 24h support: Each account automatically decays to 0 after 24 hours
      const amount24h = history.reduce((sum, item) => {
        if (item && typeof item.amount === 'number' && item.timestamp >= cutoff24h) {
          return sum + item.amount;
        }
        return sum;
      }, 0);

      // Only include in 24h if they contributed within the last 24h
      if (amount24h > 0) {
        rollingSupporters24h.push({
          rank: 0,
          userId,
          name,
          avatar,
          level,
          vip,
          nLevel,
          amount: amount24h,
          val: `${amount24h.toLocaleString()} 💎`,
          updatedAt: data.updatedAt || now
        });
      }
    });

    // Sort All-Time Supporters and SLICE TO TOP 30 ONLY
    allTimeSupporters.sort((a, b) => b.amount - a.amount);
    const top30Supporters = allTimeSupporters.slice(0, 30).map((s, idx) => ({
      ...s,
      rank: idx + 1
    }));

    // Sort 24h Supporters
    rollingSupporters24h.sort((a, b) => b.amount - a.amount);
    const ranked24hSupporters = rollingSupporters24h.map((s, idx) => ({
      ...s,
      rank: idx + 1
    }));

    // 3. Fetch Charm Receivers from Firestore
    const charmRef = collection(db, 'rooms', safeRoomId, 'charm');
    const charmSnap = await getDocs(charmRef);

    const allTimeCharm: RoomCharmReceiver[] = [];
    const rollingCharm24h: RoomCharmReceiver[] = [];

    charmSnap.forEach((docSnap) => {
      const data = docSnap.data();
      const userId = docSnap.id;
      const name = data.name || 'مستلم الدعم';
      const avatar = data.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150';
      const level = String(data.level || '1');
      const vip = String(data.vip || 'VIP1');
      const nLevel = String(data.nLevel || 'N.1');
      const totalCharm = Number(data.totalCharm || 0);
      const history: Array<{ amount: number; timestamp: number }> = Array.isArray(data.history)
        ? data.history
        : [];

      if (totalCharm > 0) {
        allTimeCharm.push({
          rank: 0,
          userId,
          name,
          avatar,
          level,
          vip,
          nLevel,
          charmPoints: totalCharm,
          val: `${totalCharm.toLocaleString()} ✨`,
          updatedAt: data.updatedAt || now
        });
      }

      // Calculate 24h charm per recipient individually
      const points24h = history.reduce((sum, item) => {
        if (item && typeof item.amount === 'number' && item.timestamp >= cutoff24h) {
          return sum + item.amount;
        }
        return sum;
      }, 0);

      if (points24h > 0) {
        rollingCharm24h.push({
          rank: 0,
          userId,
          name,
          avatar,
          level,
          vip,
          nLevel,
          charmPoints: points24h,
          val: `${points24h.toLocaleString()} ✨`,
          updatedAt: data.updatedAt || now
        });
      }
    });

    // Sort All-Time Charm and SLICE TO TOP 30 ONLY
    allTimeCharm.sort((a, b) => b.charmPoints - a.charmPoints);
    const top30Charm = allTimeCharm.slice(0, 30).map((c, idx) => ({
      ...c,
      rank: idx + 1
    }));

    // Sort 24h Charm
    rollingCharm24h.sort((a, b) => b.charmPoints - a.charmPoints);
    const ranked24hCharm = rollingCharm24h.map((c, idx) => ({
      ...c,
      rank: idx + 1
    }));

    // 4. Fetch Club Members from Firestore
    const clubRef = collection(db, 'rooms', safeRoomId, 'clubMembers');
    const clubSnap = await getDocs(clubRef);
    const clubMembers: RoomClubMember[] = [];
    clubSnap.forEach((docSnap) => {
      const data = docSnap.data();
      clubMembers.push({
        userId: docSnap.id,
        name: data.name || 'عضو',
        avatar: data.avatar || '',
        joinedAt: data.joinedAt || now,
        role: data.role || 'member'
      });
    });

    const result: RoomStatsData = {
      roomId: safeRoomId,
      totalDiamonds,
      supporters: top30Supporters,
      supporters24h: ranked24hSupporters,
      charmReceivers: top30Charm,
      charmReceivers24h: ranked24hCharm,
      clubMembers: clubMembers.length > 0 ? clubMembers : localFallback.clubMembers,
      updatedAt: now
    };

    saveLocalRoomStats(safeRoomId, result);
    return result;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, `rooms/${safeRoomId}/supporters`);
    return localFallback;
  }
}

/**
 * Record a gift transaction in the room, uploading to Firebase Firestore in real-time.
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
  const safeRoomId = roomId || 'default-room';
  cleanLegacyMockData(safeRoomId);

  const now = Date.now();
  const current = getLocalRoomStats(safeRoomId);
  current.totalDiamonds += params.giftValue;

  // Local optimistic update for instant feedback
  const existingSupIdx = current.supporters.findIndex((s) => s.userId === params.senderId);
  if (existingSupIdx >= 0) {
    current.supporters[existingSupIdx].amount += params.giftValue;
    current.supporters[existingSupIdx].val = `${current.supporters[existingSupIdx].amount.toLocaleString()} 💎`;
    current.supporters[existingSupIdx].name = params.senderName || current.supporters[existingSupIdx].name;
    current.supporters[existingSupIdx].avatar = params.senderAvatar || current.supporters[existingSupIdx].avatar;
    current.supporters[existingSupIdx].updatedAt = now;
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
      updatedAt: now
    });
  }
  current.supporters.sort((a, b) => b.amount - a.amount);
  current.supporters = current.supporters.slice(0, 30);
  current.supporters.forEach((s, idx) => {
    s.rank = idx + 1;
  });

  // Local charm recipient update
  if (params.recipientId && params.recipientName && params.recipientName !== 'الجميع') {
    const existingCharmIdx = current.charmReceivers.findIndex((c) => c.userId === params.recipientId);
    if (existingCharmIdx >= 0) {
      current.charmReceivers[existingCharmIdx].charmPoints += params.giftValue;
      current.charmReceivers[existingCharmIdx].val = `${current.charmReceivers[existingCharmIdx].charmPoints.toLocaleString()} ✨`;
      current.charmReceivers[existingCharmIdx].updatedAt = now;
    } else {
      current.charmReceivers.push({
        rank: 0,
        userId: params.recipientId,
        name: params.recipientName,
        avatar: params.recipientAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
        level: params.recipientLevel || '1',
        vip: params.recipientVip || 'VIP1',
        nLevel: params.recipientNLevel || 'N.1',
        charmPoints: params.giftValue,
        val: `${params.giftValue.toLocaleString()} ✨`,
        updatedAt: now
      });
    }
    current.charmReceivers.sort((a, b) => b.charmPoints - a.charmPoints);
    current.charmReceivers = current.charmReceivers.slice(0, 30);
    current.charmReceivers.forEach((c, idx) => {
      c.rank = idx + 1;
    });
  }

  current.updatedAt = now;
  saveLocalRoomStats(safeRoomId, current);

  // Sync with Firebase Firestore asynchronously
  if (!IS_CLOUD_SYNC_DISABLED) {
    (async () => {
      try {
        // 1. Update general stats total
        const statsRef = doc(db, 'rooms', safeRoomId, 'stats', 'general');
        const statsSnap = await getDoc(statsRef);
        const prevTotal = statsSnap.exists() ? (statsSnap.data().totalDiamonds || 0) : 0;
        await setDoc(statsRef, sanitizeFirestoreData({
          totalDiamonds: prevTotal + params.giftValue,
          updatedAt: now
        }), { merge: true });

        // 2. Update Supporter doc in rooms/{roomId}/supporters/{senderId}
        const supRef = doc(db, 'rooms', safeRoomId, 'supporters', params.senderId);
        const supSnap = await getDoc(supRef);
        const newDonation = { amount: params.giftValue, timestamp: now };

        if (supSnap.exists()) {
          const supData = supSnap.data();
          const prevHistory = Array.isArray(supData.history) ? supData.history : [];
          // Retain recent transactions
          const cleanHistory = [...prevHistory.filter((h: any) => h && h.timestamp > now - 7 * TWENTY_FOUR_HOURS_MS), newDonation];
          await setDoc(supRef, sanitizeFirestoreData({
            userId: params.senderId,
            name: params.senderName || supData.name,
            avatar: params.senderAvatar || supData.avatar,
            level: params.senderLevel || supData.level || '1',
            vip: params.senderVip || supData.vip || 'VIP1',
            nLevel: params.senderNLevel || supData.nLevel || 'N.1',
            totalAmount: (supData.totalAmount || 0) + params.giftValue,
            history: cleanHistory,
            lastDonatedAt: now,
            updatedAt: now
          }), { merge: true });
        } else {
          await setDoc(supRef, sanitizeFirestoreData({
            userId: params.senderId,
            name: params.senderName,
            avatar: params.senderAvatar,
            level: params.senderLevel || '1',
            vip: params.senderVip || 'VIP1',
            nLevel: params.senderNLevel || 'N.1',
            totalAmount: params.giftValue,
            history: [newDonation],
            lastDonatedAt: now,
            updatedAt: now
          }));
        }

        // 3. Update Charm doc in rooms/{roomId}/charm/{recipientId}
        if (params.recipientId && params.recipientName && params.recipientName !== 'الجميع') {
          const charmDocRef = doc(db, 'rooms', safeRoomId, 'charm', params.recipientId);
          const charmDocSnap = await getDoc(charmDocRef);
          const newCharm = { amount: params.giftValue, timestamp: now };

          if (charmDocSnap.exists()) {
            const cData = charmDocSnap.data();
            const prevHistory = Array.isArray(cData.history) ? cData.history : [];
            const cleanHistory = [...prevHistory.filter((h: any) => h && h.timestamp > now - 7 * TWENTY_FOUR_HOURS_MS), newCharm];
            await setDoc(charmDocRef, sanitizeFirestoreData({
              userId: params.recipientId,
              name: params.recipientName || cData.name,
              avatar: params.recipientAvatar || cData.avatar,
              level: params.recipientLevel || cData.level || '1',
              vip: params.recipientVip || cData.vip || 'VIP1',
              nLevel: params.recipientNLevel || cData.nLevel || 'N.1',
              totalCharm: (cData.totalCharm || 0) + params.giftValue,
              history: cleanHistory,
              lastReceivedAt: now,
              updatedAt: now
            }), { merge: true });
          } else {
            await setDoc(charmDocRef, sanitizeFirestoreData({
              userId: params.recipientId,
              name: params.recipientName,
              avatar: params.recipientAvatar || '',
              level: params.recipientLevel || '1',
              vip: params.recipientVip || 'VIP1',
              nLevel: params.recipientNLevel || 'N.1',
              totalCharm: params.giftValue,
              history: [newCharm],
              lastReceivedAt: now,
              updatedAt: now
            }));
          }
        }
      } catch (err) {
        console.warn('Error syncing gift support to Firestore:', err);
      }
    })();
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
  const safeRoomId = roomId || 'default-room';
  const current = getLocalRoomStats(safeRoomId);
  const exists = current.clubMembers.some((m) => m.userId === user.userId);
  if (!exists) {
    const newMember: RoomClubMember = {
      userId: user.userId,
      name: user.name,
      avatar: user.avatar,
      joinedAt: Date.now(),
      role: 'member'
    };
    current.clubMembers.unshift(newMember);
    saveLocalRoomStats(safeRoomId, current);

    if (!IS_CLOUD_SYNC_DISABLED) {
      try {
        const memberRef = doc(db, 'rooms', safeRoomId, 'clubMembers', user.userId);
        await setDoc(memberRef, sanitizeFirestoreData(newMember));
      } catch (e) {
        console.warn('Club join firestore error:', e);
      }
    }
  }

  return current;
}

/**
 * Leave Room Club
 */
export async function leaveRoomClub(roomId: string, userId: string): Promise<RoomStatsData> {
  const safeRoomId = roomId || 'default-room';
  const current = getLocalRoomStats(safeRoomId);
  current.clubMembers = current.clubMembers.filter((m) => m.userId !== userId);
  saveLocalRoomStats(safeRoomId, current);

  if (!IS_CLOUD_SYNC_DISABLED) {
    try {
      const memberRef = doc(db, 'rooms', safeRoomId, 'clubMembers', userId);
      await deleteDoc(memberRef);
    } catch (e) {
      console.warn('Club leave firestore error:', e);
    }
  }

  return current;
}

/**
 * Reset Room Stats (if needed by owner)
 */
export async function resetRoomStats(roomId: string): Promise<RoomStatsData> {
  const safeRoomId = roomId || 'default-room';
  const fresh: RoomStatsData = {
    roomId: safeRoomId,
    totalDiamonds: 0,
    supporters: [],
    supporters24h: [],
    charmReceivers: [],
    charmReceivers24h: [],
    clubMembers: getLocalRoomStats(safeRoomId).clubMembers,
    updatedAt: Date.now()
  };

  saveLocalRoomStats(safeRoomId, fresh);
  return fresh;
}
