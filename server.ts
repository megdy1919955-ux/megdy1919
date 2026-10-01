import express from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { AccessToken } from 'livekit-server-sdk';
import { generateZegoToken04, ZEGO_DEFAULT_APP_ID, ZEGO_DEFAULT_SECRET } from './src/audio/zegoServerAssistant';

const LIVEKIT_DEFAULT_URL = process.env.LIVEKIT_URL || 'wss://ai-najm-iu3onztq.livekit.cloud';
const LIVEKIT_DEFAULT_API_KEY = process.env.LIVEKIT_API_KEY || 'APIKFNSQVK84kTA';
const LIVEKIT_DEFAULT_API_SECRET = process.env.LIVEKIT_API_SECRET || 'f7V0rIyeawpRYiAV7UG05SExgLLnedk0xts65F6mLhfC';

interface ClientConnection {
  ws: WebSocket;
  roomId?: string;
  peerId?: string;
  userName?: string;
  userAvatar?: string;
  seatId?: number | null;
  isMuted?: boolean;
}

interface ActiveLiveRoom {
  id: string;
  title: string;
  host: string;
  ownerId: string;
  image: string;
  listenersCount: number;
  countryName: string;
  countryCode: string;
  flag: string;
  badge?: {
    type: 'text' | 'icon';
    content: string;
    bgColor: string;
    textColor?: string;
  };
  hasPlusAvatar?: boolean;
  topTag?: string;
  avatars: string[];
  startedAt: number;
  isOwner?: boolean;
  isLocked?: boolean;
  password?: string;
}

const clients = new Map<WebSocket, ClientConnection>();
const activeLiveRooms = new Map<string, ActiveLiveRoom>();

async function startServer() {
  const app = express();
  const server = createServer(app);
  const wss = new WebSocketServer({ server, path: '/ws/audio-room' });

  app.use(express.json());

  // API Health Check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      connectedClients: clients.size,
      activeRooms: activeLiveRooms.size,
      time: new Date().toISOString()
    });
  });

  // GET /api/hierarchy/permissions/:userId
  // نقطة نهاية السيرفر المركزي لفحص صلاحيات الرتب الإدارية وإرجاع rolesSummary
  app.get('/api/hierarchy/permissions/:userId', (req, res) => {
    const rawId = (req.params.userId || '').trim().toUpperCase();

    // 1. المشرف الرئيسي والمالك (MGR-9901 / 1001001 أبو أمجد أو YE1330000)
    const isSuperAdmin = rawId === '1001001' || rawId === 'MGR-9901' || rawId === 'YE1330000';

    // 2. مديرو الوكالات الرسمية (المستوى 1: MGR-9901, MGR-9902, 1001001, 1001002)
    const isManager = isSuperAdmin || rawId === '1001002' || rawId === 'MGR-9902';

    // 3. مندوبو الوكالات (المستوى 2: DEL-401, DEL-402, 1001004, 1001005)
    const isDelegate = isSuperAdmin || rawId === '1001004' || rawId === 'DEL-401' || rawId === '1001005' || rawId === 'DEL-402';

    // 4. وكلاء الوكالات الرسمية (المستوى 3: AG-101, AG-102, 1001010, 1001012, 30032)
    const isAgent = isSuperAdmin || rawId === '1001010' || rawId === 'AG-101' || rawId === '1001012' || rawId === 'AG-102' || rawId === '30032';

    // 5. وسطاء الوكالات المعتمدون (المستوى 4: BRK-101-1, BRK-101-01, BRK-101-02, 1001016, 1001017)
    const isBroker = isSuperAdmin || rawId === '1001016' || rawId === 'BRK-101-1' || rawId === 'BRK-101-01' || rawId === '1001017' || rawId === 'BRK-101-02';

    // 6. المذيعون المعتمدون المرتبطون بوكالة (المستوى 5: HOST-101-01, 1001022, 1001023)
    const isHost = isSuperAdmin || isAgent || rawId === '1001022' || rawId === 'HOST-101-01' || rawId === '1001023' || rawId === 'HOST-101-02';

    const responsePayload = {
      userId: req.params.userId,
      rolesSummary: {
        isSuperAdmin,
        isManager,
        isDelegate,
        isAgent,
        isBroker,
        isHost
      }
    };

    res.json(responsePayload);
  });

  // GET live active broadcast rooms (فقط الغرف المفتوحة حالياً وفيها متواجدون)
  app.get('/api/rooms/live', (req, res) => {
    // تحديث عدد المتواجدين الفعلي من اتصالات الويب سوكيت الحالية
    const result: ActiveLiveRoom[] = [];
    for (const [roomId, room] of activeLiveRooms.entries()) {
      const occupants = Array.from(clients.values()).filter(
        (c) => c.roomId === roomId && c.ws.readyState === WebSocket.OPEN
      );
      if (occupants.length > 0) {
        room.listenersCount = occupants.length;
        room.avatars = occupants
          .map((o) => o.userAvatar)
          .filter((av): av is string => Boolean(av))
          .slice(0, 4);
        result.push(room);
      } else {
        // خالية تماماً من المضيفين والمتواجدين -> حذفها واختفاؤها من الرئيسية
        activeLiveRooms.delete(roomId);
      }
    }
    res.json({ rooms: result });
  });

  // In-memory persistent room stats store
  interface ServerRoomSupporter {
    rank: number;
    userId: string;
    name: string;
    avatar: string;
    level: string;
    vip: string;
    nLevel: string;
    amount: number;
    val: string;
    updatedAt: number;
  }

  interface ServerRoomCharmReceiver {
    rank: number;
    userId: string;
    name: string;
    avatar: string;
    level: string;
    vip: string;
    nLevel: string;
    charmPoints: number;
    val: string;
    updatedAt: number;
  }

  interface ServerRoomClubMember {
    userId: string;
    name: string;
    avatar: string;
    joinedAt: number;
    role: 'member' | 'vip' | 'manager';
  }

  interface ServerRoomStats {
    roomId: string;
    totalDiamonds: number;
    supporters: ServerRoomSupporter[];
    charmReceivers: ServerRoomCharmReceiver[];
    clubMembers: ServerRoomClubMember[];
    updatedAt: number;
  }

  const roomStatsMap = new Map<string, ServerRoomStats>();

  const getOrCreateRoomStats = (roomId: string): ServerRoomStats => {
    let stats = roomStatsMap.get(roomId);
    if (!stats) {
      stats = {
        roomId,
        totalDiamonds: 0,
        supporters: [],
        charmReceivers: [],
        clubMembers: [],
        updatedAt: Date.now()
      };
      roomStatsMap.set(roomId, stats);
    }
    return stats;
  };

  // GET live room stats on-demand (only loaded when user requests it)
  app.get('/api/rooms/:roomId/stats', (req, res) => {
    const roomId = req.params.roomId;
    const stats = getOrCreateRoomStats(roomId);
    res.json(stats);
  });

  // POST record support / gift in room
  app.post('/api/rooms/:roomId/stats/record', (req, res) => {
    const roomId = req.params.roomId;
    const stats = getOrCreateRoomStats(roomId);
    const {
      senderId,
      senderName,
      senderAvatar,
      senderLevel,
      senderVip,
      senderNLevel,
      recipientId,
      recipientName,
      recipientAvatar,
      recipientLevel,
      recipientVip,
      recipientNLevel,
      giftValue
    } = req.body;

    const val = Number(giftValue) || 0;
    if (val > 0) {
      stats.totalDiamonds += val;

      // Update supporter
      const existingSup = stats.supporters.find((s) => s.userId === senderId);
      if (existingSup) {
        existingSup.amount += val;
        existingSup.val = `${existingSup.amount.toLocaleString()} 💎`;
        existingSup.name = senderName || existingSup.name;
        existingSup.avatar = senderAvatar || existingSup.avatar;
        existingSup.updatedAt = Date.now();
      } else {
        stats.supporters.push({
          rank: 0,
          userId: senderId || `user_${Date.now()}`,
          name: senderName || 'داعم',
          avatar: senderAvatar || '',
          level: senderLevel || '1',
          vip: senderVip || 'VIP1',
          nLevel: senderNLevel || 'N.1',
          amount: val,
          val: `${val.toLocaleString()} 💎`,
          updatedAt: Date.now()
        });
      }

      stats.supporters.sort((a, b) => b.amount - a.amount);
      stats.supporters.forEach((s, idx) => {
        s.rank = idx + 1;
      });

      // Update charm receiver if target is a mic occupant
      if (recipientId && recipientName && recipientName !== 'الجميع') {
        const existingCharm = stats.charmReceivers.find((c) => c.userId === recipientId);
        if (existingCharm) {
          existingCharm.charmPoints += val;
          existingCharm.val = `${existingCharm.charmPoints.toLocaleString()} ✨`;
          existingCharm.updatedAt = Date.now();
        } else {
          stats.charmReceivers.push({
            rank: 0,
            userId: recipientId,
            name: recipientName,
            avatar: recipientAvatar || '',
            level: recipientLevel || '1',
            vip: recipientVip || 'VIP1',
            nLevel: recipientNLevel || 'N.1',
            charmPoints: val,
            val: `${val.toLocaleString()} ✨`,
            updatedAt: Date.now()
          });
        }

        stats.charmReceivers.sort((a, b) => b.charmPoints - a.charmPoints);
        stats.charmReceivers.forEach((c, idx) => {
          c.rank = idx + 1;
        });
      }

      stats.updatedAt = Date.now();
    }

    res.json(stats);
  });

  // POST join room club
  app.post('/api/rooms/:roomId/club/join', (req, res) => {
    const roomId = req.params.roomId;
    const stats = getOrCreateRoomStats(roomId);
    const { userId, name, avatar } = req.body;
    if (userId && !stats.clubMembers.some((m) => m.userId === userId)) {
      stats.clubMembers.unshift({
        userId,
        name: name || 'عضو النادي',
        avatar: avatar || '',
        joinedAt: Date.now(),
        role: 'member'
      });
      stats.updatedAt = Date.now();
    }
    res.json({ success: true, clubMembers: stats.clubMembers });
  });

  // POST leave room club
  app.post('/api/rooms/:roomId/club/leave', (req, res) => {
    const roomId = req.params.roomId;
    const stats = getOrCreateRoomStats(roomId);
    const { userId } = req.body;
    if (userId) {
      stats.clubMembers = stats.clubMembers.filter((m) => m.userId !== userId);
      stats.updatedAt = Date.now();
    }
    res.json({ success: true, clubMembers: stats.clubMembers });
  });

  // POST reset room stats
  app.post('/api/rooms/:roomId/stats/reset', (req, res) => {
    const roomId = req.params.roomId;
    const stats = getOrCreateRoomStats(roomId);
    stats.totalDiamonds = 0;
    stats.supporters = [];
    stats.charmReceivers = [];
    stats.updatedAt = Date.now();
    res.json({ success: true, stats });
  });

  // Room Host Welcome Announcement Store
  interface ServerRoomAnnouncement {
    hostName: string;
    noticeText: string;
    updatedAt: number;
  }

  const roomAnnouncementMap = new Map<string, ServerRoomAnnouncement>();

  app.get('/api/rooms/:roomId/announcement', (req, res) => {
    const roomId = req.params.roomId;
    const current = roomAnnouncementMap.get(roomId) || {
      hostName: 'صاحب الروم',
      noticeText: 'مرحباً في رومي الخاص، يسعدني تشريفكم وحضوركم جميعاً!',
      updatedAt: Date.now()
    };
    res.json(current);
  });

  app.post('/api/rooms/:roomId/announcement', (req, res) => {
    const roomId = req.params.roomId;
    const { hostName, noticeText } = req.body;
    const entry: ServerRoomAnnouncement = {
      hostName: hostName || 'صاحب الروم',
      noticeText: noticeText || 'مرحباً في رومي الخاص',
      updatedAt: Date.now()
    };
    roomAnnouncementMap.set(roomId, entry);
    res.json({ success: true, announcement: entry });
  });

  // Disconnect Clean-up Endpoint (Supports navigator.sendBeacon & Keepalive Fetch on app close)
  app.post('/api/rooms/:roomId/leave', express.json(), express.text(), (req, res) => {
    try {
      const roomId = req.params.roomId;
      let bodyData = req.body;
      if (typeof bodyData === 'string') {
        try {
          bodyData = JSON.parse(bodyData);
        } catch {}
      }

      const userId = bodyData?.userId || bodyData?.peerId;
      const seatId = bodyData?.seatId;

      if (roomId && userId) {
        // Find active WS connection and clean up
        let foundClient: ClientConnection | null = null;
        for (const [ws, c] of clients.entries()) {
          if (c.roomId === roomId && (c.peerId === userId || c.userName === bodyData?.userName)) {
            foundClient = c;
            const vacatedSeat = c.seatId || seatId;
            broadcastToRoom(roomId, null, {
              type: 'peer_left',
              payload: {
                peerId: c.peerId || userId,
                userName: c.userName || 'مستخدم',
                seatId: vacatedSeat
              }
            });
            if (vacatedSeat) {
              broadcastToRoom(roomId, null, {
                type: 'peer_seat_updated',
                payload: {
                  peerId: c.peerId || userId,
                  seatId: null,
                  userName: c.userName,
                  isMuted: true
                }
              });
            }
            try {
              ws.close();
            } catch {}
            clients.delete(ws);
            break;
          }
        }

        // Even if WS is already closed, broadcast the clean-up event to prevent ghost seat occupation
        if (!foundClient && seatId) {
          broadcastToRoom(roomId, null, {
            type: 'peer_seat_updated',
            payload: {
              peerId: userId,
              seatId: null,
              isMuted: true
            }
          });
        }

        // Clean up or decrement active live room
        const activeOccupants = Array.from(clients.values()).filter(
          (c) => c.roomId === roomId && c.peerId !== userId && c.ws.readyState === WebSocket.OPEN
        );
        if (activeOccupants.length === 0) {
          activeLiveRooms.delete(roomId);
        } else {
          const roomObj = activeLiveRooms.get(roomId);
          if (roomObj) {
            roomObj.listenersCount = activeOccupants.length;
            roomObj.avatars = activeOccupants
              .map((o) => o.userAvatar)
              .filter((a): a is string => Boolean(a))
              .slice(0, 4);
          }
        }
      }

      res.json({ success: true, message: 'Session cleaned up cleanly' });
    } catch (err: any) {
      console.warn('[Server] Room leave endpoint error:', err?.message || err);
      res.json({ success: false, error: err?.message });
    }
  });

  // ZEGOCLOUD Configuration and Token Generation Endpoints
  app.get('/api/zego/config', (req, res) => {
    const appId = Number(process.env.ZEGO_APP_ID) || ZEGO_DEFAULT_APP_ID;
    const serverSecret = process.env.ZEGO_SERVER_SECRET || ZEGO_DEFAULT_SECRET;
    const serverUrl = process.env.ZEGO_SERVER_URL || `wss://webliveroom${appId}-api.zegocloud.com/ws`;
    const isConfigured = Boolean(appId && serverSecret);
    res.json({
      appId,
      server: serverUrl,
      isConfigured
    });
  });

  app.get('/api/zego/token', (req, res) => {
    try {
      const appId = Number(process.env.ZEGO_APP_ID) || ZEGO_DEFAULT_APP_ID;
      const secret = process.env.ZEGO_SERVER_SECRET || ZEGO_DEFAULT_SECRET;
      const isConfigured = Boolean(appId && secret && secret.length >= 16);

      if (!isConfigured) {
        return res.json({
          available: false,
          token: null,
          message: 'ZEGOCLOUD is not configured with valid AppID and ServerSecret.'
        });
      }

      const userId = (req.query.userId as string) || `user_${Math.floor(Math.random() * 100000)}`;
      const roomId = (req.query.roomId as string) || 'default_room';
      const serverUrl = process.env.ZEGO_SERVER_URL || `wss://webliveroom${appId}-api.zegocloud.com/ws`;

      // Official ZEGOCLOUD Token04 standard:
      // An empty payload ('') provides full room login and publishing capabilities
      // without requiring custom privilege activation through ZEGOCLOUD customer support.
      const payload = typeof req.query.payload === 'string' ? req.query.payload : '';

      const token = generateZegoToken04(appId, userId, secret, 86400, payload);

      res.json({
        available: true,
        appId,
        userId,
        roomId,
        server: serverUrl,
        token
      });
    } catch (err: any) {
      console.warn('ZEGOCLOUD Token04 generation warning:', err?.message || err);
      res.json({ available: false, token: null, error: err.message || 'Token generation unavailable' });
    }
  });

  // LiveKit Cloud Configuration & Token Generation Endpoints
  app.get('/api/livekit/config', (req, res) => {
    res.json({
      url: LIVEKIT_DEFAULT_URL,
      available: Boolean(LIVEKIT_DEFAULT_URL && LIVEKIT_DEFAULT_API_KEY && LIVEKIT_DEFAULT_API_SECRET)
    });
  });

  app.get('/api/livekit/token', async (req, res) => {
    try {
      const room = (req.query.room as string) || (req.query.roomId as string) || 'default-room';
      const identity = (req.query.identity as string) || (req.query.userId as string) || `user_${Math.floor(Math.random() * 100000)}`;
      const name = (req.query.name as string) || (req.query.userName as string) || identity;

      if (!LIVEKIT_DEFAULT_API_KEY || !LIVEKIT_DEFAULT_API_SECRET) {
        return res.status(500).json({
          available: false,
          error: 'LiveKit API credentials are not configured.'
        });
      }

      // Create an Access Token for LiveKit WebRTC Voice Room
      const at = new AccessToken(LIVEKIT_DEFAULT_API_KEY, LIVEKIT_DEFAULT_API_SECRET, {
        identity,
        name,
        ttl: '24h'
      });

      at.addGrant({
        room,
        roomJoin: true,
        canPublish: true,
        canSubscribe: true,
        canPublishData: true
      });

      const token = await at.toJwt();

      res.json({
        available: true,
        serverUrl: LIVEKIT_DEFAULT_URL,
        room,
        identity,
        name,
        token
      });
    } catch (err: any) {
      console.warn('[LiveKit Token Error]:', err?.message || err);
      res.status(500).json({
        available: false,
        error: err?.message || 'Failed to generate LiveKit token'
      });
    }
  });

  // Explicit PWA Service Worker & Manifest routes for 100% Android & iOS standalone compliance
  app.get('/sw.js', (req, res) => {
    res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
    res.setHeader('Service-Worker-Allowed', '/');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    const swPath = path.join(process.cwd(), process.env.NODE_ENV === 'production' ? 'dist' : 'public', 'sw.js');
    res.sendFile(swPath);
  });

  app.get('/manifest.json', (req, res) => {
    res.setHeader('Content-Type', 'application/manifest+json; charset=UTF-8');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    const manifestPath = path.join(process.cwd(), process.env.NODE_ENV === 'production' ? 'dist' : 'public', 'manifest.json');
    res.sendFile(manifestPath);
  });

  // WebSocket signaling & real-time broadcast engine
  wss.on('connection', (ws: WebSocket) => {
    const clientData: ClientConnection = { ws };
    clients.set(ws, clientData);

    ws.on('message', (data: string | Buffer) => {
      try {
        const message = JSON.parse(data.toString());
        const { type, roomId, payload } = message;

        switch (type) {
          case 'join_room': {
            clientData.roomId = roomId;
            clientData.peerId = payload.peerId;
            clientData.userName = payload.userName || 'مستخدم جديد';
            clientData.userAvatar = payload.userAvatar;
            clientData.seatId = payload.seatId || null;
            clientData.isMuted = payload.isMuted ?? true;

            // Auto-register/Update live room metadata when a user enters
            if (roomId) {
              const existingLive = activeLiveRooms.get(roomId);
              const customTitle = payload.roomTitle || (existingLive ? existingLive.title : `روم ${payload.userName} 🎙️👑`);
              const customAvatar = payload.roomAvatar || (existingLive ? existingLive.image : (payload.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'));
              const ownerId = payload.ownerId || (existingLive ? existingLive.ownerId : payload.peerId);
              const hostName = payload.hostName || (existingLive ? existingLive.host : payload.userName);

              const currentOccupants = Array.from(clients.values()).filter(
                (c) => c.roomId === roomId && c.ws.readyState === WebSocket.OPEN
              );

              activeLiveRooms.set(roomId, {
                id: roomId,
                title: customTitle,
                host: hostName,
                ownerId: ownerId,
                image: customAvatar,
                listenersCount: Math.max(1, currentOccupants.length),
                countryName: payload.countryName || (existingLive?.countryName || 'اليمن'),
                countryCode: payload.countryCode || (existingLive?.countryCode || 'YE'),
                flag: payload.flag || (existingLive?.flag || '🇾🇪'),
                isLocked: payload.isLocked ?? existingLive?.isLocked ?? false,
                password: payload.password ?? existingLive?.password,
                topTag: payload.topTag || existingLive?.topTag || 'بث مباشر 🔥',
                badge: payload.badge || existingLive?.badge || {
                  type: 'text',
                  content: 'مباشر LIVE',
                  bgColor: 'bg-emerald-600',
                  textColor: 'text-white'
                },
                avatars: [
                  ...currentOccupants.map((o) => o.userAvatar).filter((a): a is string => Boolean(a)),
                  payload.userAvatar
                ].filter(Boolean).slice(0, 4),
                startedAt: existingLive?.startedAt || Date.now()
              });
            }

            // Notify existing peers in room
            broadcastToRoom(roomId, ws, {
              type: 'peer_joined',
              payload: {
                peerId: clientData.peerId,
                userName: clientData.userName,
                userAvatar: clientData.userAvatar,
                seatId: clientData.seatId,
                isMuted: clientData.isMuted
              }
            });

            // Lightweight chat presence announcement (إشعار الدخول الخفيف في الشات)
            broadcastToRoom(roomId, null, {
              type: 'chat_broadcast',
              payload: {
                id: `sys-join-${Date.now()}-${clientData.peerId}`,
                userName: 'نظام الروم',
                text: `انضم ${clientData.userName} إلى قائمة المستمعين 🎙️`,
                isSystem: true,
                timestamp: Date.now()
              }
            });

            // Send full list of active peers in the room to newly joined user
            const activePeers = Array.from(clients.values())
              .filter((c) => c.roomId === roomId && c.peerId && c.ws !== ws && c.ws.readyState === WebSocket.OPEN)
              .map((c) => ({
                peerId: c.peerId,
                userName: c.userName,
                userAvatar: c.userAvatar,
                seatId: c.seatId,
                isMuted: c.isMuted
              }));

            ws.send(JSON.stringify({
              type: 'room_presence_sync',
              payload: { peers: activePeers }
            }));
            break;
          }

          case 'leave_room': {
            if (clientData.roomId && clientData.peerId) {
              const previousSeat = clientData.seatId;
              broadcastToRoom(clientData.roomId, ws, {
                type: 'peer_left',
                payload: {
                  peerId: clientData.peerId,
                  userName: clientData.userName,
                  seatId: previousSeat
                }
              });

              if (previousSeat) {
                broadcastToRoom(clientData.roomId, ws, {
                  type: 'peer_seat_updated',
                  payload: {
                    peerId: clientData.peerId,
                    seatId: null,
                    userName: clientData.userName,
                    isMuted: true
                  }
                });
              }

              // Update activeLiveRoom count or delete if empty
              const remainingPeers = Array.from(clients.values()).filter(
                (c) => c.roomId === clientData.roomId && c.peerId !== clientData.peerId && c.ws.readyState === WebSocket.OPEN
              );
              if (remainingPeers.length === 0) {
                activeLiveRooms.delete(clientData.roomId);
              } else {
                const roomObj = activeLiveRooms.get(clientData.roomId);
                if (roomObj) {
                  roomObj.listenersCount = remainingPeers.length;
                  roomObj.avatars = remainingPeers
                    .map((p) => p.userAvatar)
                    .filter((a): a is string => Boolean(a))
                    .slice(0, 4);
                }
              }
              clientData.seatId = null;
            }
            break;
          }

          case 'update_room_info': {
            if (roomId && activeLiveRooms.has(roomId)) {
              const currentRoom = activeLiveRooms.get(roomId)!;
              if (payload.title) currentRoom.title = payload.title;
              if (payload.avatar) currentRoom.image = payload.avatar;
              if (payload.isLocked !== undefined) currentRoom.isLocked = payload.isLocked;
              broadcastToRoom(roomId, ws, {
                type: 'room_info_changed',
                payload: {
                  title: currentRoom.title,
                  avatar: currentRoom.image,
                  isLocked: currentRoom.isLocked
                }
              });
            }
            break;
          }

          case 'seat_update':
          case 'update_seat': {
            clientData.seatId = payload.seatId;
            clientData.isMuted = payload.isMuted ?? clientData.isMuted;
            broadcastToRoom(clientData.roomId, ws, {
              type: 'peer_seat_updated',
              payload: {
                peerId: clientData.peerId,
                seatId: payload.seatId,
                userName: clientData.userName,
                userAvatar: clientData.userAvatar,
                isMuted: payload.isMuted
              }
            });
            break;
          }

          case 'speaking_state': {
            if (payload.seatId) {
              clientData.seatId = payload.seatId;
            }
            const activeSeatId = payload.seatId || clientData.seatId;
            broadcastToRoom(clientData.roomId, ws, {
              type: 'peer_speaking_state',
              payload: {
                peerId: clientData.peerId,
                seatId: activeSeatId,
                isSpeaking: payload.isSpeaking,
                audioLevel: payload.audioLevel || 0
              }
            });
            break;
          }

          case 'chat_message': {
            // Exclude the sender client (ws) to prevent duplicate echo in chat
            broadcastToRoom(clientData.roomId, ws, {
              type: 'chat_broadcast',
              payload: payload
            });
            break;
          }

          // WebRTC P2P Audio Signaling (Offer / Answer / ICE Candidates)
          case 'webrtc_signal': {
            const { targetPeerId, signalData } = payload;
            const targetClient = Array.from(clients.values()).find(
              (c) => c.peerId === targetPeerId && c.ws.readyState === WebSocket.OPEN
            );

            if (targetClient) {
              targetClient.ws.send(JSON.stringify({
                type: 'webrtc_signal',
                payload: {
                  fromPeerId: clientData.peerId,
                  signalData,
                  userName: clientData.userName,
                  seatId: clientData.seatId
                }
              }));
            }
            break;
          }

          default:
            break;
        }
      } catch (err) {
        console.error('Error handling WebSocket message:', err);
      }
    });

    ws.on('close', () => {
      if (clientData.roomId && clientData.peerId) {
        const previousSeat = clientData.seatId;
        broadcastToRoom(clientData.roomId, ws, {
          type: 'peer_left',
          payload: {
            peerId: clientData.peerId,
            userName: clientData.userName,
            seatId: previousSeat
          }
        });

        if (previousSeat) {
          broadcastToRoom(clientData.roomId, ws, {
            type: 'peer_seat_updated',
            payload: {
              peerId: clientData.peerId,
              seatId: null,
              userName: clientData.userName,
              isMuted: true
            }
          });
        }

        // Update active live room count or remove if empty
        const remainingPeers = Array.from(clients.values()).filter(
          (c) => c.roomId === clientData.roomId && c.peerId !== clientData.peerId && c.ws.readyState === WebSocket.OPEN
        );
        if (remainingPeers.length === 0) {
          activeLiveRooms.delete(clientData.roomId);
        } else {
          const roomObj = activeLiveRooms.get(clientData.roomId);
          if (roomObj) {
            roomObj.listenersCount = remainingPeers.length;
            roomObj.avatars = remainingPeers
              .map((p) => p.userAvatar)
              .filter((a): a is string => Boolean(a))
              .slice(0, 4);
          }
        }
      }
      clients.delete(ws);
    });

    ws.on('error', (err) => {
      console.warn('WebSocket connection error:', err.message);
      clients.delete(ws);
    });
  });

  function broadcastToRoom(roomId?: string, senderWs?: WebSocket | null, data?: any) {
    if (!roomId) return;
    const msgString = JSON.stringify(data);
    clients.forEach((client) => {
      if (client.roomId === roomId && client.ws.readyState === WebSocket.OPEN) {
        if (!senderWs || client.ws !== senderWs) {
          client.ws.send(msgString);
        }
      }
    });
  }

  // Explicit route to serve standalone admin control panel directly without redirects
  app.get(['/admin', '/admin/', '/admin/index.html'], (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'admin', 'index.html'));
  });
  app.use('/admin', express.static(path.join(process.cwd(), 'public', 'admin')));

  // Vite middleware in dev or static files in prod
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const PORT = 3000;
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`🎙️ Realtime Voice Room & Audio Signaling Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
