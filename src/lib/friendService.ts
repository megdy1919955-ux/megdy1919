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

const STORAGE_FRIENDS_KEY = 'super_legend_friends_list';
const STORAGE_REQUESTS_KEY = 'super_legend_friend_requests';

// Default initial friends for testing
const INITIAL_FRIENDS: FriendUserItem[] = [
  {
    id: 'f1',
    userId: '8841001',
    name: 'أميرة الشرق',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    status: 'in_room',
    level: 53,
    vipTier: 'VIP8',
    isOnline: true
  },
  {
    id: 'f2',
    userId: '8842002',
    name: 'سارة الك...',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
    status: 'online',
    level: 18,
    vipTier: 'VIP6',
    isOnline: true
  },
  {
    id: 'f3',
    userId: '77989081',
    name: 'تت_larit_رف',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    status: 'online',
    level: 30,
    vipTier: 'VIP8',
    isOnline: true
  },
  {
    id: 'f4',
    userId: '77989082',
    name: 'رفيييق',
    avatar: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=300',
    status: 'in_room',
    level: 25,
    vipTier: 'VIP6',
    isOnline: true
  }
];

export const getFriendsList = (): FriendUserItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_FRIENDS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (_) {}
  return INITIAL_FRIENDS;
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
