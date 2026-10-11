// Service to manage user friendships and friend requests in Super Legend
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

const STORAGE_FRIENDS_KEY = 'najm_friends_list';
const STORAGE_REQUESTS_KEY = 'najm_friend_requests';
const STORAGE_FOLLOWING_KEY = 'najm_following_list';
const STORAGE_VISITORS_KEY = 'najm_visitors_list';
const STORAGE_LIKES_KEY = 'najm_likes_list';

// القائمة الافتراضية فارغة تماماً (تصفير كامل للبيانات التجريبية القديمة)
const INITIAL_FRIENDS: FriendUserItem[] = [];

export const getFriendsList = (): FriendUserItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_FRIENDS_KEY) || localStorage.getItem('super_legend_friends_list');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // تنظيف أي حسابات تجريبية قديمة كانت مسجلة بالمعرفات الوهمية f1..f4
        const cleaned = parsed.filter((f) => f && f.id && !['f1', 'f2', 'f3', 'f4'].includes(f.id));
        if (cleaned.length !== parsed.length) {
          localStorage.setItem(STORAGE_FRIENDS_KEY, JSON.stringify(cleaned));
        }
        return cleaned;
      }
    }
  } catch (_) {}
  return [];
};

export const saveFriendsList = (friends: FriendUserItem[]) => {
  try {
    localStorage.setItem(STORAGE_FRIENDS_KEY, JSON.stringify(friends));
    window.dispatchEvent(new CustomEvent('friends_updated', { detail: friends }));
  } catch (_) {}
};

export const isUserFriend = (userId: string, userName?: string): boolean => {
  if (!userId && !userName) return false;
  const friends = getFriendsList();
  return friends.some(
    (f) =>
      (userId && (f.userId === userId || f.id === userId)) ||
      (userName && f.name.trim().toLowerCase() === userName.trim().toLowerCase())
  );
};

export const getFriendRequests = (): FriendRequestItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_REQUESTS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (_) {}
  return [];
};

export const saveFriendRequests = (requests: FriendRequestItem[]) => {
  try {
    localStorage.setItem(STORAGE_REQUESTS_KEY, JSON.stringify(requests));
    window.dispatchEvent(new CustomEvent('friend_requests_updated', { detail: requests }));
  } catch (_) {}
};

export const sendFriendRequest = (
  target: { id: string; userId?: string; name: string; avatar: string },
  customMessage?: string
): FriendRequestItem => {
  const requests = getFriendRequests();
  const targetId = target.userId || target.id;

  // Check if already sent
  const existing = requests.find((r) => r.targetId === targetId && r.status === 'pending');
  if (existing) return existing;

  const newReq: FriendRequestItem = {
    id: `req-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    senderId: 'my_user_profile',
    senderName: 'المشرف (أنا)',
    senderAvatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=400',
    targetId,
    targetName: target.name,
    targetAvatar: target.avatar,
    timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    status: 'pending',
    customMessage: customMessage || 'مرحباً، أود إضافتك إلى قائمة أصدقائي في سوبر ليجند 🌟'
  };

  const updated = [newReq, ...requests];
  saveFriendRequests(updated);
  return newReq;
};

export const acceptFriendRequest = (
  target: { id: string; userId?: string; name: string; avatar: string }
): void => {
  const targetId = target.userId || target.id;
  const friends = getFriendsList();

  if (!friends.some((f) => f.userId === targetId || f.id === targetId || f.name === target.name)) {
    const newFriend: FriendUserItem = {
      id: target.id,
      userId: target.userId || target.id,
      name: target.name,
      avatar: target.avatar,
      status: 'online',
      level: 25,
      vipTier: 'VIP6',
      isOnline: true
    };
    saveFriendsList([newFriend, ...friends]);
  }

  // Update request status if any
  const requests = getFriendRequests();
  const updatedReqs = requests.map((r) =>
    r.targetId === targetId ? { ...r, status: 'accepted' as const } : r
  );
  saveFriendRequests(updatedReqs);
};

export const hasPendingFriendRequest = (userId: string, userName?: string): boolean => {
  const requests = getFriendRequests();
  return requests.some(
    (r) =>
      r.status === 'pending' &&
      ((userId && r.targetId === userId) || (userName && r.targetName === userName))
  );
};

// ----------------------------------------------------
// 2. إدارة المتابعين وتمت متابعتهم (Following / Followers)
// ----------------------------------------------------
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

export const getFollowingList = (): FollowingUserItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_FOLLOWING_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.filter((f) => f && f.id && !['fl1', 'fl2', 'fl3', 'fl4'].includes(f.id));
      }
    }
  } catch (_) {}
  return [];
};

export const saveFollowingList = (list: FollowingUserItem[]) => {
  try {
    localStorage.setItem(STORAGE_FOLLOWING_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('following_updated', { detail: list }));
    window.dispatchEvent(new CustomEvent('social_stats_updated'));
  } catch (_) {}
};

export const followUser = (user: { id: string; userId?: string; name: string; avatar: string; level?: number; vipTier?: string }) => {
  const list = getFollowingList();
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
    saveFollowingList(updated);
    return updated;
  }
  return list;
};

export const unfollowUser = (userId: string) => {
  const list = getFollowingList();
  const updated = list.filter((u) => u.userId !== userId && u.id !== userId);
  saveFollowingList(updated);
  return updated;
};

export const isUserFollowed = (userId: string): boolean => {
  const list = getFollowingList();
  return list.some((u) => u.userId === userId || u.id === userId);
};

// ----------------------------------------------------
// 3. إدارة الزوار (Visitors)
// ----------------------------------------------------
export interface VisitorUserItem {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  level: number;
  vipTier: string;
  timeAgo: string;
}

export const getVisitorsList = (): VisitorUserItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_VISITORS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.filter((v) => v && v.id && !['v1', 'v2', 'v3', 'v4', 'v5'].includes(v.id));
      }
    }
  } catch (_) {}
  return [];
};

export const saveVisitorsList = (list: VisitorUserItem[]) => {
  try {
    localStorage.setItem(STORAGE_VISITORS_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('visitors_updated', { detail: list }));
    window.dispatchEvent(new CustomEvent('social_stats_updated'));
  } catch (_) {}
};

export const recordProfileVisit = (visitor: { id: string; userId?: string; name: string; avatar: string; level?: number; vipTier?: string }) => {
  const list = getVisitorsList();
  const targetId = visitor.userId || visitor.id;
  const filtered = list.filter((v) => v.userId !== targetId && v.id !== targetId);
  const newItem: VisitorUserItem = {
    id: visitor.id || `visit-${Date.now()}`,
    userId: targetId,
    name: visitor.name,
    avatar: visitor.avatar,
    level: visitor.level || 1,
    vipTier: visitor.vipTier || 'VIP1',
    timeAgo: 'الآن'
  };
  const updated = [newItem, ...filtered].slice(0, 50);
  saveVisitorsList(updated);
};

// ----------------------------------------------------
// 4. إدارة المعجبين والتفاعلات (Likes / Fans)
// ----------------------------------------------------
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

export const getLikesList = (): LikeUserItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_LIKES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.filter((l) => l && l.id && !['l1', 'l2', 'l3'].includes(l.id));
      }
    }
  } catch (_) {}
  return [];
};

export const saveLikesList = (list: LikeUserItem[]) => {
  try {
    localStorage.setItem(STORAGE_LIKES_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('likes_updated', { detail: list }));
    window.dispatchEvent(new CustomEvent('social_stats_updated'));
  } catch (_) {}
};

export const recordLike = (like: { id?: string; userId: string; name: string; avatar: string; level?: number; vipTier?: string; actionNote?: string; giftIcon?: string }) => {
  const list = getLikesList();
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
  saveLikesList(updated);
};

// إحصائيات واقعية حقيقية تبدأ من 0 وتتفاعل لحظياً مع المستخدم
export const getSocialStats = () => {
  return {
    visitors: getVisitorsList().length,
    friends: getFriendsList().length,
    followers: getFollowingList().length,
    likes: getLikesList().length
  };
};

