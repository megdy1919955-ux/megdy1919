import express from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { generateZegoToken04, ZEGO_DEFAULT_APP_ID, ZEGO_DEFAULT_SECRET } from './src/lib/zegoServerAssistant';

interface ClientConnection {
  ws: WebSocket;
  roomId?: string;
  peerId?: string;
  userName?: string;
  userAvatar?: string;
  seatId?: number | null;
  isMuted?: boolean;
}

const clients = new Map<WebSocket, ClientConnection>();

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
      time: new Date().toISOString()
    });
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

  // ZEGOCLOUD Configuration and Token Generation Endpoints
  app.get('/api/zego/config', (req, res) => {
    const appId = Number(process.env.ZEGO_APP_ID) || ZEGO_DEFAULT_APP_ID;
    const serverSecret = process.env.ZEGO_SERVER_SECRET || ZEGO_DEFAULT_SECRET;
    const serverUrl = process.env.ZEGO_SERVER_URL || `wss://webliveroom${appId}-api.coolzcloud.com/ws`;
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
      const isConfigured = Boolean(appId && secret);
      if (!isConfigured) {
        return res.json({
          available: false,
          token: null,
          message: 'ZEGOCLOUD is not configured with ZEGO_SERVER_SECRET and ZEGO_APP_ID'
        });
      }

      const userId = (req.query.userId as string) || `user_${Math.floor(Math.random() * 100000)}`;
      const roomId = (req.query.roomId as string) || 'default_room';
      const serverUrl = process.env.ZEGO_SERVER_URL || `wss://webliveroom${appId}-api.coolzcloud.com/ws`;

      // Privilege 1 = LoginRoom, 2 = PublishStream. Both set to 1 (allow).
      const payloadObj = {
        room_id: roomId,
        privilege: {
          1: 1,
          2: 1
        },
        stream_id_list: []
      };
      const payload = JSON.stringify(payloadObj);

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
      console.error('Failed to generate ZEGOCLOUD Token04:', err);
      res.status(500).json({ available: false, error: err.message || 'Token generation failed' });
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

          case 'update_seat': {
            clientData.seatId = payload.seatId;
            clientData.isMuted = payload.isMuted;
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
        broadcastToRoom(clientData.roomId, ws, {
          type: 'peer_left',
          payload: {
            peerId: clientData.peerId,
            userName: clientData.userName,
            seatId: clientData.seatId
          }
        });
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
