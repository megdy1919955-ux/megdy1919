// Service to manage user friendships and friend requests in Al-Najm with per-user LocalStorage isolation
import { getCurrentAuthUser } from './authService';

export interface FriendUserItem {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  status?: string;
  level?: number;
  vipTier?: string;
  isOnline?: boolean;
}

export interface FriendRequestItem {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  targetId: string;
  targetName: string;
  targetAvatar: string;
  timestamp: string;
  status: 'pending' | 'accepted' | 'declined';
  customMessage?: string;
}

export interface FollowingUserItem {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  level: number;
  vipTier: string;
  isFollowing: boolean;
  actionNote?: string;
}

export interface VisitorUserItem {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  level: number;
  vipTier: string;
  timeAgo: string;
}

export interface LikeUserItem {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  level: number;
  vipTier: string;
  timeAgo: string;
  actionNote?: string;
  giftIcon?: string;
}

const BASE_FRIENDS_KEY = 'najm_friends_list';
const BASE_REQUESTS_KEY = 'najm_friend_requests';
const BASE_FOLLOWING_KEY = 'najm_following_list';
const BASE_VISITORS_KEY = 'najm_visitors_list';
const BASE_LIKES_KEY = 'najm_likes_list';

/**
 * استخراج معرف المستخدم النشط حالياً لضمان عزل البيانات بدقة تامة لكل حساب
 */
export const getActiveUserId = (explicitUserId?: string): string => {
  if (explicitUserId && typeof explicitUserId === 'string' && explicitUserId.trim()) {
    return explicitUserId.trim();
  }
  const authUser = getCurrentAuthUser();
  if (authUser?.id) return String(authUser.id);
  if (authUser?.uid) return String(authUser.uid);
  try {
    const savedProfile = localStorage.getItem('user_profile_data');
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      if (parsed.id) return String(parsed.id);
    }
  } catch (_) {}
  return 'default_user';
};

/**
 * تكوين مفتاح التخزين المخصص للحساب المحدد
 */
export const getUserStorageKey = (baseKey: string, userId?: string): string => {
  const uid = getActiveUserId(userId);
  return `${baseKey}_${uid}`;
};

// ====================================================
// 1. إدارة الأصدقاء (Friends Management)
// ====================================================

export const getFriendsList = (userId?: string): FriendUserItem[] => {
  try {
    const scopedKey = getUserStorageKey(BASE_FRIENDS_KEY, userId);
    let raw = localStorage.getItem(scopedKey);

    // التحقق من المفتاح القديم العام وترحيله بأمان للمستخدم النشط إن لم يوجد
    if (!raw) {
      const legacyRaw = localStorage.getItem(BASE_FRIENDS_KEY) || localStorage.getItem('super_legend_friends_list');
      if (legacyRaw) {
        raw = legacyRaw;
        localStorage.setItem(scopedKey, legacyRaw);
      }
    }

    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const cleaned = parsed.filter((f) => f && f.id && !['f1', 'f2', 'f3', 'f4'].includes(f.id));
        if (cleaned.length !== parsed.length) {
          localStorage.setItem(scopedKey, JSON.stringify(cleaned));
        }
        return cleaned;
      }
    }
  } catch (_) {}
  return [];
};

export const saveFriendsList = (friends: FriendUserItem[], userId?: string) => {
  try {
    const uid = getActiveUserId(userId);
    const scopedKey = getUserStorageKey(BASE_FRIENDS_KEY, uid);
    localStorage.setItem(scopedKey, JSON.stringify(friends));
    window.dispatchEvent(new CustomEvent('friends_updated', { detail: { friends, userId: uid } }));
    window.dispatchEvent(new CustomEvent('social_stats_updated', { detail: { userId: uid } }));
  } catch (_) {}
};

export const isUserFriend = (targetUserId: string, targetUserName?: string, currentUserId?: string): boolean => {
  if (!targetUserId && !targetUserName) return false;
  const friends = getFriendsList(currentUserId);
  return friends.some(
    (f) =>
      (targetUserId && (f.userId === targetUserId || f.id === targetUserId)) ||
      (targetUserName && f.name.trim().toLowerCase() === targetUserName.trim().toLowerCase())
  );
};

export const getFriendRequests = (userId?: string): FriendRequestItem[] => {
  try {
    const scopedKey = getUserStorageKey(BASE_REQUESTS_KEY, userId);
    let raw = localStorage.getItem(scopedKey);
    if (!raw) {
      const legacyRaw = localStorage.getItem(BASE_REQUESTS_KEY) || localStorage.getItem('super_legend_friend_requests');
      if (legacyRaw) {
        raw = legacyRaw;
        localStorage.setItem(scopedKey, legacyRaw);
      }
    }
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (_) {}
  return [];
};

export const saveFriendRequests = (requests: FriendRequestItem[], userId?: string) => {
  try {
    const uid = getActiveUserId(userId);
    const scopedKey = getUserStorageKey(BASE_REQUESTS_KEY, uid);
    localStorage.setItem(scopedKey, JSON.stringify(requests));
    window.dispatchEvent(new CustomEvent('friend_requests_updated', { detail: { requests, userId: uid } }));
  } catch (_) {}
};

export const sendFriendRequest = (
  target: { id: string; userId?: string; name: string; avatar: string },
  customMessage?: string,
  senderUserId?: string
): FriendRequestItem => {
  const currentUid = getActiveUserId(senderUserId);
  const requests = getFriendRequests(currentUid);
  const targetId = target.userId || target.id;

  const existing = requests.find((r) => r.targetId === targetId && r.status === 'pending');
  if (existing) return existing;

  const authUser = getCurrentAuthUser();
  const newReq: FriendRequestItem = {
    id: `req-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    senderId: currentUid,
    senderName: authUser?.name || 'مستخدم النجم',
    senderAvatar: authUser?.avatar || 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=400',
    targetId,
    targetName: target.name,
    targetAvatar: target.avatar,
    timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    status: 'pending',
    customMessage: customMessage || 'مرحباً، أود إضافتك إلى قائمة أصدقائي في تطبيق النجم 🌟'
  };

  const updated = [newReq, ...requests];
  saveFriendRequests(updated, currentUid);
  return newReq;
};

export const acceptFriendRequest = (
  target: { id: string; userId?: string; name: string; avatar: string },
  currentUserId?: string
): void => {
  const currentUid = getActiveUserId(currentUserId);
  const targetId = target.userId || target.id;
  const friends = getFriendsList(currentUid);

  if (!friends.some((f) => f.userId === targetId || f.id === targetId || f.name === target.name)) {
    const newFriend: FriendUserItem = {
      id: target.id,
      userId: target.userId || target.id,
      name: target.name,
      avatar: target.avatar,
      status: 'online',
      level: 1,
      vipTier: 'VIP1',
      isOnline: true
    };
    saveFriendsList([newFriend, ...friends], currentUid);
  }

  const requests = getFriendRequests(currentUid);
  const updatedReqs = requests.map((r) =>
    r.targetId === targetId ? { ...r, status: 'accepted' as const } : r
  );
  saveFriendRequests(updatedReqs, currentUid);
};

export const hasPendingFriendRequest = (userId: string, userName?: string, currentUserId?: string): boolean => {
  const requests = getFriendRequests(currentUserId);
  return requests.some(
    (r) =>
      r.status === 'pending' &&
      ((userId && r.targetId === userId) || (userName && r.targetName === userName))
  );
};

// ====================================================
// 2. إدارة المتابعة (Following / Followers)
// ====================================================

export const getFollowingList = (userId?: string): FollowingUserItem[] => {
  try {
    const scopedKey = getUserStorageKey(BASE_FOLLOWING_KEY, userId);
    let raw = localStorage.getItem(scopedKey);
    if (!raw) {
      const legacyRaw = localStorage.getItem(BASE_FOLLOWING_KEY);
      if (legacyRaw) {
        raw = legacyRaw;
        localStorage.setItem(scopedKey, legacyRaw);
      }
    }
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.filter((f) => f && f.id && !['fl1', 'fl2', 'fl3', 'fl4'].includes(f.id));
      }
    }
  } catch (_) {}
  return [];
};

export const saveFollowingList = (list: FollowingUserItem[], userId?: string) => {
  try {
    const uid = getActiveUserId(userId);
    const scopedKey = getUserStorageKey(BASE_FOLLOWING_KEY, uid);
    localStorage.setItem(scopedKey, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('following_updated', { detail: { list, userId: uid } }));
    window.dispatchEvent(new CustomEvent('social_stats_updated', { detail: { userId: uid } }));
  } catch (_) {}
};

export const followUser = (
  user: { id: string; userId?: string; name: string; avatar: string; level?: number; vipTier?: string },
  currentUserId?: string
) => {
  const uid = getActiveUserId(currentUserId);
  const list = getFollowingList(uid);
  const targetId = user.userId || user.id;

  if (!list.some((u) => u.userId === targetId || u.id === targetId)) {
    const newItem: FollowingUserItem = {
      id: user.id,
      userId: targetId,
      name: user.name,
      avatar: user.avatar,
      level: user.level || 1,
      vipTier: user.vipTier || 'VIP1',
      isFollowing: true,
      actionNote: 'تتابعه'
    };
    const updated = [newItem, ...list];
    saveFollowingList(updated, uid);
    return updated;
  }
  return list;
};

export const unfollowUser = (targetUserId: string, currentUserId?: string) => {
  const uid = getActiveUserId(currentUserId);
  const list = getFollowingList(uid);
  const updated = list.filter((u) => u.userId !== targetUserId && u.id !== targetUserId);
  saveFollowingList(updated, uid);
  return updated;
};

export const isUserFollowed = (targetUserId: string, currentUserId?: string): boolean => {
  const list = getFollowingList(currentUserId);
  return list.some((u) => u.userId === targetUserId || u.id === targetUserId);
};

// ====================================================
// 3. إدارة الزوار (Visitors)
// ====================================================

export const getVisitorsList = (userId?: string): VisitorUserItem[] => {
  try {
    const scopedKey = getUserStorageKey(BASE_VISITORS_KEY, userId);
    let raw = localStorage.getItem(scopedKey);
    if (!raw) {
      const legacyRaw = localStorage.getItem(BASE_VISITORS_KEY);
      if (legacyRaw) {
        raw = legacyRaw;
        localStorage.setItem(scopedKey, legacyRaw);
      }
    }
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.filter((v) => v && v.id && !['v1', 'v2', 'v3', 'v4', 'v5'].includes(v.id));
      }
    }
  } catch (_) {}
  return [];
};

export const saveVisitorsList = (list: VisitorUserItem[], userId?: string) => {
  try {
    const uid = getActiveUserId(userId);
    const scopedKey = getUserStorageKey(BASE_VISITORS_KEY, uid);
    localStorage.setItem(scopedKey, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('visitors_updated', { detail: { list, userId: uid } }));
    window.dispatchEvent(new CustomEvent('social_stats_updated', { detail: { userId: uid } }));
  } catch (_) {}
};

export const recordProfileVisit = (
  visitor: { id: string; userId?: string; name: string; avatar: string; level?: number; vipTier?: string },
  targetProfileUserId?: string
) => {
  const targetUid = getActiveUserId(targetProfileUserId);
  const list = getVisitorsList(targetUid);
  const visitorId = visitor.userId || visitor.id;

  // منع تسجيل زيارة المستخدم لملفه الشخصي نفسه
  if (visitorId === targetUid) return;

  const filtered = list.filter((v) => v.userId !== visitorId && v.id !== visitorId);
  const newItem: VisitorUserItem = {
    id: visitor.id || `visit-${Date.now()}`,
    userId: visitorId,
    name: visitor.name,
    avatar: visitor.avatar,
    level: visitor.level || 1,
    vipTier: visitor.vipTier || 'VIP1',
    timeAgo: 'الآن'
  };
  const updated = [newItem, ...filtered].slice(0, 50);
  saveVisitorsList(updated, targetUid);
};

// ====================================================
// 4. إدارة المعجبين والتفاعلات (Likes / Fans)
// ====================================================

export const getLikesList = (userId?: string): LikeUserItem[] => {
  try {
    const scopedKey = getUserStorageKey(BASE_LIKES_KEY, userId);
    let raw = localStorage.getItem(scopedKey);
    if (!raw) {
      const legacyRaw = localStorage.getItem(BASE_LIKES_KEY);
      if (legacyRaw) {
        raw = legacyRaw;
        localStorage.setItem(scopedKey, legacyRaw);
      }
    }
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.filter((l) => l && l.id && !['l1', 'l2', 'l3'].includes(l.id));
      }
    }
  } catch (_) {}
  return [];
};

export const saveLikesList = (list: LikeUserItem[], userId?: string) => {
  try {
    const uid = getActiveUserId(userId);
    const scopedKey = getUserStorageKey(BASE_LIKES_KEY, uid);
    localStorage.setItem(scopedKey, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('likes_updated', { detail: { list, userId: uid } }));
    window.dispatchEvent(new CustomEvent('social_stats_updated', { detail: { userId: uid } }));
  } catch (_) {}
};

export const recordLike = (
  like: { id?: string; userId: string; name: string; avatar: string; level?: number; vipTier?: string; actionNote?: string; giftIcon?: string },
  targetProfileUserId?: string
) => {
  const targetUid = getActiveUserId(targetProfileUserId);
  const list = getLikesList(targetUid);
  const newItem: LikeUserItem = {
    id: like.id || `like-${Date.now()}`,
    userId: like.userId,
    name: like.name,
    avatar: like.avatar,
    level: like.level || 1,
    vipTier: like.vipTier || 'VIP1',
    timeAgo: 'الآن',
    actionNote: like.actionNote || 'أعجب بملفك الشخصي ❤️',
    giftIcon: like.giftIcon || '❤️'
  };
  const updated = [newItem, ...list].slice(0, 50);
  saveLikesList(updated, targetUid);
};

// ====================================================
// 5. الإحصائيات الاجتماعية المعزولة بحساب المستخدم
// ====================================================

export const getSocialStats = (userId?: string) => {
  const uid = getActiveUserId(userId);
  return {
    visitors: getVisitorsList(uid).length,
    friends: getFriendsList(uid).length,
    followers: getFollowingList(uid).length,
    likes: getLikesList(uid).length
  };
};
