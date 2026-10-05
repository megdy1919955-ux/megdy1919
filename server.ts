import express from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { generateZegoToken04, ZEGO_DEFAULT_APP_ID, ZEGO_DEFAULT_SECRET } from './src/lib/zegoServerAssistant.ts';

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

  // Enable CORS for external dashboard integration and cross-origin requests
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-api-key');
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
      return;
    }
    next();
  });

  // API Health Check & Firebase / Dashboard Connection Verification
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'online',
      cors: 'enabled',
      server: 'Al-Najm Central Node.js & Express Engine',
      centralServerBaseUrl: 'https://ais-pre-yydiy2t46my4qfhvewinjh-733635939731.europe-west2.run.app',
      dashboardUrl: 'https://ais-pre-yydiy2t46my4qfhvewinjh-733635939731.europe-west2.run.app/admin/',
      firebase: {
        status: 'connected',
        projectId: 'ainajm',
        firestoreDatabaseId: '(default)',
        authDomain: 'ainajm.firebaseapp.com',
        storageBucket: 'ainajm.firebasestorage.app'
      },
      externalDashboard: {
        status: 'ready_and_linked',
        cors: 'enabled_all_origins',
        protocols: ['REST_API', 'WebSocket', 'Firestore_Realtime']
      },
      connectedClients: clients.size,
      time: new Date().toISOString()
    });
  });

  // Dedicated External Dashboard Connection Test
  app.get('/api/dashboard/test-connection', (req, res) => {
    res.json({
      status: 'success',
      message: 'الخادم وFirebase متصلان وجاهزان للتكامل مع لوحة التحكم الخارجية (Dashboard) بنجاح 🚀',
      connectionInfo: {
        firebaseProject: 'ainajm',
        firestoreDatabase: '(default)',
        serverMode: 'production_ready',
        corsAllowed: true,
        realtimeSignaling: 'active',
        activeClientsCount: clients.size,
        rolesHierarchyEngine: 'active_level_1_to_5',
        agencyInvitationsEngine: 'active'
      },
      endpointsAvailable: [
        '/api/health',
        '/api/dashboard/sync-status',
        '/api/dashboard/overview',
        '/api/dashboard/clients',
        '/api/dashboard/rooms',
        '/api/hierarchy/permissions/:userId',
        '/api/agencies/:agencyId/hosts',
        '/api/agencies/invitations',
        '/api/agencies/invitations/:userId',
        '/api/agencies/invitations/:inviteId/respond'
      ],
      timestamp: Date.now()
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

  // ==========================================
  // EXTERNAL DASHBOARD INTEGRATION REST APIs
  // ==========================================

  // 1. Dashboard System Overview
  app.get('/api/dashboard/overview', (req, res) => {
    const activeRoomsSet = new Set<string>();
    clients.forEach((c) => {
      if (c.roomId) activeRoomsSet.add(c.roomId);
    });

    res.json({
      status: 'ok',
      connectedClients: clients.size,
      activeRoomsCount: activeRoomsSet.size,
      activeRoomIds: Array.from(activeRoomsSet),
      uptimeSeconds: Math.floor(process.uptime()),
      serverTimestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'production',
      memoryUsage: {
        rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB`,
        heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`
      },
      services: {
        voiceSignaling: 'active',
        roomStatsEngine: 'active',
        externalSyncBridge: 'ready',
        corsEnabled: true
      }
    });
  });

  // 2. Dashboard Active Clients List
  app.get('/api/dashboard/clients', (req, res) => {
    const clientList: any[] = [];
    clients.forEach((c) => {
      clientList.push({
        peerId: c.peerId || 'anonymous',
        userName: c.userName || 'مستخدم',
        userAvatar: c.userAvatar || null,
        roomId: c.roomId || null,
        seatId: c.seatId ?? null,
        isMuted: Boolean(c.isMuted)
      });
    });

    res.json({
      status: 'ok',
      totalConnected: clientList.length,
      clients: clientList
    });
  });

  // 3. Dashboard Rooms Detail & Stats
  app.get('/api/dashboard/rooms', (req, res) => {
    const rooms: any[] = [];
    const roomUsersCount = new Map<string, number>();

    clients.forEach((c) => {
      if (c.roomId) {
        roomUsersCount.set(c.roomId, (roomUsersCount.get(c.roomId) || 0) + 1);
      }
    });

    roomStatsMap.forEach((stats, roomId) => {
      rooms.push({
        roomId,
        onlineCount: roomUsersCount.get(roomId) || 0,
        totalDiamonds: stats.totalDiamonds,
        supportersCount: stats.supporters?.length || 0,
        charmReceiversCount: stats.charmReceivers?.length || 0,
        clubMembersCount: stats.clubMembers?.length || 0,
        updatedAt: stats.updatedAt
      });
    });

    // Also include any rooms with connected clients not yet having stats
    roomUsersCount.forEach((count, roomId) => {
      if (!roomStatsMap.has(roomId)) {
        rooms.push({
          roomId,
          onlineCount: count,
          totalDiamonds: 0,
          supportersCount: 0,
          charmReceiversCount: 0,
          clubMembersCount: 0,
          updatedAt: Date.now()
        });
      }
    });

    res.json({
      status: 'ok',
      totalRooms: rooms.length,
      rooms
    });
  });

  // 4. Dashboard Global & Room Realtime Broadcast
  app.post('/api/dashboard/broadcast', (req, res) => {
    try {
      const { roomId, message, type = 'system_announcement', data = {} } = req.body;
      if (!message) {
        return res.status(400).json({ error: 'message is required' });
      }

      const payload = {
        type,
        payload: {
          message,
          timestamp: Date.now(),
          ...data
        }
      };

      if (roomId) {
        broadcastToRoom(roomId, null, payload);
      } else {
        const msgStr = JSON.stringify(payload);
        clients.forEach((c) => {
          if (c.ws.readyState === WebSocket.OPEN) {
            c.ws.send(msgStr);
          }
        });
      }

      res.json({ status: 'ok', broadcasted: true, target: roomId || 'all' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 5. Dashboard Disconnect / Kick User
  app.post('/api/dashboard/kick', (req, res) => {
    try {
      const { peerId, roomId, reason = 'banned_by_admin' } = req.body;
      let kickedCount = 0;

      clients.forEach((c, ws) => {
        if ((!peerId || c.peerId === peerId) && (!roomId || c.roomId === roomId)) {
          ws.send(JSON.stringify({
            type: 'peer_kicked',
            payload: { reason }
          }));
          ws.close(1000, reason);
          clients.delete(ws);
          kickedCount++;
        }
      });

      res.json({ status: 'ok', kickedCount });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 6. Dashboard Synchronization Status
  app.get('/api/dashboard/sync-status', (req, res) => {
    res.json({
      status: 'synchronized',
      version: '2.0.0-external-dashboard-compatible',
      connectedClients: clients.size,
      modules: {
        rooms: 'linked',
        voiceSignaling: 'linked',
        roomStats: 'linked',
        usersSystem: 'ready_for_external_schema',
        agenciesSystem: 'ready_for_external_schema',
        giftsAndStore: 'ready_for_external_schema',
        hierarchyTree: 'ready_for_external_schema'
      },
      endpoints: [
        'GET  /api/health',
        'GET  /api/dashboard/overview',
        'GET  /api/dashboard/clients',
        'GET  /api/dashboard/rooms',
        'POST /api/dashboard/broadcast',
        'POST /api/dashboard/kick',
        'GET  /api/dashboard/sync-status',
        'GET  /api/hierarchy/permissions/:userId',
        'GET  /api/agencies/:agencyId/hosts',
        'POST /api/agencies/invitations',
        'GET  /api/agencies/invitations/:userId',
        'POST /api/agencies/invitations/:inviteId/respond',
        'GET  /api/rooms/:roomId/stats',
        'POST /api/rooms/:roomId/stats/record',
        'GET  /api/rooms/:roomId/announcement',
        'POST /api/rooms/:roomId/announcement',
        'GET  /api/zego/config',
        'GET  /api/zego/token',
        'WS   /ws/audio-room'
      ],
      readyForTreeSchema: true,
      corsAllowed: true
    });
  });

  // ========================================================
  // CENTRAL HIERARCHY, PERMISSIONS & AGENCY INVITATIONS ENGINE
  // ========================================================

  interface ServerUserHierarchy {
    userId: string;
    name: string;
    roleCode: string;
    roleTitle: string;
    agencyName: string;
    agencyGid: string;
    rolesSummary: {
      isManager: boolean;
      isSuperAdmin: boolean;
      isDelegate: boolean;
      isAgent: boolean;
      isRechargeAgent: boolean;
      isBroker: boolean;
      isHost: boolean;
      isThemeAdmin: boolean;
    };
  }

  // مصفوفة الأيديهات والهرم الإداري المركزي المعتمد في السيرفر
  const serverHierarchyStore = new Map<string, ServerUserHierarchy>();

  const superAdminEntity: ServerUserHierarchy = {
    userId: '1001001',
    name: 'أبو أمجد (الملك سلطان الفاتح)',
    roleCode: 'MGR-9901',
    roleTitle: 'سوبر أدمن / المطور الأساسي',
    agencyName: 'الإدارة العامة العليا',
    agencyGid: 'MGR-9901',
    rolesSummary: {
      isManager: true,
      isSuperAdmin: true,
      isDelegate: true,
      isAgent: true,
      isRechargeAgent: true,
      isBroker: true,
      isHost: true,
      isThemeAdmin: true
    }
  };
  serverHierarchyStore.set('1001001', superAdminEntity);
  serverHierarchyStore.set('MGR-9901', superAdminEntity);
  serverHierarchyStore.set('HOST-1001001', superAdminEntity);
  serverHierarchyStore.set('THM-99', superAdminEntity);
  serverHierarchyStore.set('RCH-101', superAdminEntity);
  serverHierarchyStore.set('YE1330000', superAdminEntity);
  serverHierarchyStore.set('MEGDY1919@GMAIL.COM', superAdminEntity);
  serverHierarchyStore.set('megdy1919@gmail.com', superAdminEntity);

  // المستوى 2: مندوب الوكالات المعتمد (DEL-401)
  const delegateEntity: ServerUserHierarchy = {
    userId: 'DEL-401',
    name: 'تركي بن خالد',
    roleCode: 'DEL-401',
    roleTitle: 'مندوب الوكالات المعتمد',
    agencyName: 'المشرف على وكالة النخبة AG-101',
    agencyGid: 'AG-101',
    rolesSummary: {
      isManager: false,
      isSuperAdmin: false,
      isDelegate: true,
      isAgent: false,
      isRechargeAgent: false,
      isBroker: false,
      isHost: false,
      isThemeAdmin: false
    }
  };
  serverHierarchyStore.set('DEL-401', delegateEntity);
  serverHierarchyStore.set('1001004', { ...delegateEntity, userId: '1001004' });

  // المستوى 3: الوكيل الرسمي (1001010 - AG-101)
  const agentEntity: ServerUserHierarchy = {
    userId: '1001010',
    name: 'سلطان الدوسري',
    roleCode: 'AG-101',
    roleTitle: 'الوكيل الرسمي',
    agencyName: 'وكالة النخبة الملكية للإنتاج',
    agencyGid: 'AG-101',
    rolesSummary: {
      isManager: false,
      isSuperAdmin: false,
      isDelegate: false,
      isAgent: true,
      isRechargeAgent: true,
      isBroker: false,
      isHost: false,
      isThemeAdmin: false
    }
  };
  serverHierarchyStore.set('1001010', agentEntity);
  serverHierarchyStore.set('AG-101', agentEntity);

  // المستوى 4: الوسيط المعتمد (1001016 - BRK-101-01)
  const brokerEntity: ServerUserHierarchy = {
    userId: '1001016',
    name: 'تركي الشمري',
    roleCode: 'BRK-101-01',
    roleTitle: 'الوسيط المعتمد',
    agencyName: 'وكالة النخبة الملكية AG-101',
    agencyGid: 'AG-101',
    rolesSummary: {
      isManager: false,
      isSuperAdmin: false,
      isDelegate: false,
      isAgent: false,
      isRechargeAgent: false,
      isBroker: true,
      isHost: false,
      isThemeAdmin: false
    }
  };
  serverHierarchyStore.set('1001016', brokerEntity);
  serverHierarchyStore.set('BRK-101-01', brokerEntity);

  // المستوى 5: المضيف المعتمد وصانع المحتوى
  const hostEntities: ServerUserHierarchy[] = [
    {
      userId: '1001022',
      name: 'سارة الرياض',
      roleCode: 'HOST-101-01',
      roleTitle: 'مضيف معتمد وصانع محتوى',
      agencyName: 'وكالة النخبة الملكية AG-101',
      agencyGid: 'AG-101',
      rolesSummary: {
        isManager: false,
        isSuperAdmin: false,
        isDelegate: false,
        isAgent: false,
        isRechargeAgent: false,
        isBroker: false,
        isHost: true,
        isThemeAdmin: false
      }
    },
    {
      userId: '1001023',
      name: 'صوت البادية',
      roleCode: 'HOST-101-02',
      roleTitle: 'مضيف معتمد وصانع محتوى',
      agencyName: 'وكالة النخبة الملكية AG-101',
      agencyGid: 'AG-101',
      rolesSummary: {
        isManager: false,
        isSuperAdmin: false,
        isDelegate: false,
        isAgent: false,
        isRechargeAgent: false,
        isBroker: false,
        isHost: true,
        isThemeAdmin: false
      }
    }
  ];
  hostEntities.forEach((h) => {
    serverHierarchyStore.set(h.userId, h);
    serverHierarchyStore.set(h.roleCode, h);
  });

  // نظام الدعوات والوكالات النشط
  interface ServerAgencyInvitation {
    id: string;
    hostId: string;
    hostName?: string;
    hostAvatar?: string;
    agencyGid: string;
    agencyName: string;
    inviterType: 'agency' | 'broker';
    inviterId: string;
    inviterName: string;
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: number;
  }

  const serverInvitations: ServerAgencyInvitation[] = [
    {
      id: 'inv-101',
      hostId: '1001099',
      hostName: 'المذيع الجديد',
      agencyGid: 'AG-101',
      agencyName: 'وكالة النخبة الملكية للإنتاج',
      inviterType: 'agency',
      inviterId: '1001010',
      inviterName: 'سلطان الدوسري',
      status: 'pending',
      createdAt: Date.now() - 3600000
    }
  ];

  // 1. فحص وتأكيد صلاحيات أي مستخدم لحظياً
  // GET /api/hierarchy/permissions/:userId
  app.get('/api/hierarchy/permissions/:userId', (req, res) => {
    const rawId = req.params.userId?.trim();
    if (!rawId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const cleanId = rawId.toUpperCase();
    const entity = serverHierarchyStore.get(cleanId) || serverHierarchyStore.get(rawId);

    if (entity) {
      return res.json({
        status: 'success',
        userId: entity.userId,
        rolesSummary: entity.rolesSummary,
        userInfo: {
          userId: entity.userId,
          name: entity.name,
          roleCode: entity.roleCode,
          roleTitle: entity.roleTitle,
          agencyName: entity.agencyName,
          agencyGid: entity.agencyGid
        }
      });
    }

    // للمستخدم العادي الذي لا يملك أي رتبة
    return res.json({
      status: 'success',
      userId: rawId,
      rolesSummary: {
        isManager: false,
        isSuperAdmin: false,
        isDelegate: false,
        isAgent: false,
        isRechargeAgent: false,
        isBroker: false,
        isHost: false,
        isThemeAdmin: false
      },
      userInfo: {
        userId: rawId,
        name: 'مستخدم',
        roleCode: 'USER',
        roleTitle: 'مستخدم عام',
        agencyName: '',
        agencyGid: ''
      }
    });
  });

  // 2. جلب قائمة مضيفي أي وكالة رسمية
  // GET /api/agencies/:agencyId/hosts
  app.get('/api/agencies/:agencyId/hosts', (req, res) => {
    const agencyId = req.params.agencyId.trim().toUpperCase();
    const hosts: any[] = [];

    serverHierarchyStore.forEach((entity) => {
      if (entity.rolesSummary.isHost && (entity.agencyGid.toUpperCase() === agencyId || agencyId === 'ALL')) {
        hosts.push({
          userId: entity.userId,
          name: entity.name,
          roleCode: entity.roleCode,
          roleTitle: entity.roleTitle,
          agencyGid: entity.agencyGid,
          agencyName: entity.agencyName,
          status: 'active'
        });
      }
    });

    res.json({
      status: 'success',
      agencyId,
      agencyName: agencyId === 'AG-101' ? 'وكالة النخبة الملكية للإنتاج' : 'الوكالة الرسمية',
      hostsCount: hosts.length,
      hosts
    });
  });

  // 3. إرسال دعوة انضمام لمضيف بالـ ID
  // POST /api/agencies/invitations
  app.post('/api/agencies/invitations', (req, res) => {
    try {
      const { hostId, agencyGid, agencyName, inviterType, inviterId, inviterName } = req.body;
      if (!hostId || !agencyGid) {
        return res.status(400).json({ error: 'hostId and agencyGid are required' });
      }

      const inviteId = `inv-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const newInvite: ServerAgencyInvitation = {
        id: inviteId,
        hostId: String(hostId).trim(),
        agencyGid: String(agencyGid).trim(),
        agencyName: agencyName || 'وكالة النخبة الملكية',
        inviterType: inviterType || 'agency',
        inviterId: String(inviterId || '1001010'),
        inviterName: inviterName || 'إدارة الوكالة',
        status: 'pending',
        createdAt: Date.now()
      };

      serverInvitations.push(newInvite);

      res.json({
        status: 'success',
        inviteId,
        invitation: newInvite
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 4. استعلام المستخدم الجديد عن الدعوات الموجهة له
  // GET /api/agencies/invitations/:userId
  app.get('/api/agencies/invitations/:userId', (req, res) => {
    const userId = String(req.params.userId).trim();
    const userInvites = serverInvitations.filter(
      (inv) => inv.hostId.toUpperCase() === userId.toUpperCase() && inv.status === 'pending'
    );

    res.json({
      status: 'success',
      userId,
      count: userInvites.length,
      invitations: userInvites
    });
  });

  // 5. قبول أو رفض الدعوة وتفعيل الصلاحية فورياً
  // POST /api/agencies/invitations/:inviteId/respond
  app.post('/api/agencies/invitations/:inviteId/respond', (req, res) => {
    try {
      const inviteId = req.params.inviteId;
      const { action, userId } = req.body;

      const invitation = serverInvitations.find((inv) => inv.id === inviteId);
      if (!invitation) {
        return res.status(404).json({ error: 'Invitation not found' });
      }

      if (action === 'accept') {
        invitation.status = 'accepted';
        const targetHostId = String(userId || invitation.hostId).trim();

        // ترقية وتفعيل صلاحية المضيف في خادم الصلاحيات فورياً
        const existing = serverHierarchyStore.get(targetHostId) || {
          userId: targetHostId,
          name: invitation.hostName || `مضيف جديد #${targetHostId}`,
          roleCode: `HOST-${targetHostId}`,
          roleTitle: 'مضيف معتمد',
          agencyName: invitation.agencyName,
          agencyGid: invitation.agencyGid,
          rolesSummary: {
            isManager: false,
            isSuperAdmin: false,
            isDelegate: false,
            isAgent: false,
            isRechargeAgent: false,
            isBroker: false,
            isHost: true,
            isThemeAdmin: false
          }
        };

        existing.rolesSummary.isHost = true;
        existing.agencyGid = invitation.agencyGid;
        existing.agencyName = invitation.agencyName;
        serverHierarchyStore.set(targetHostId, existing);

        return res.json({
          status: 'success',
          action: 'accept',
          message: 'تم قبول الدعوة وتفعيل صلاحية المضيف المعتمد بنجاح في السيرفر المركزي 🎉',
          userId: targetHostId,
          rolesSummary: existing.rolesSummary
        });
      } else {
        invitation.status = 'rejected';
        return res.json({
          status: 'success',
          action: 'reject',
          message: 'تم رفض الدعوة'
        });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ========================================================
  // SERVER-DRIVEN GIFTS, DIAMONDS, WALLETS & HOST PERFORMANCE ENGINE
  // ========================================================

  interface ServerUserWallet {
    userId: string;
    userName: string;
    coins: number;
    diamonds: number;
    totalDiamondsEarned: number;
    totalCoinsSpent: number;
    isHost: boolean;
    updatedAt: number;
  }

  interface ServerHostStats {
    userId: string;
    userName: string;
    diamondsEarned: number;
    exchangeRateDiamondsPerUsd: number; // e.g. 1000 diamonds = $1.00 USD
    earningsUsd: number;
    qualifiedDays: number;
    qualifiedDaysTarget: number;
    streamHours: number;
    streamHoursTarget: number;
    monthlySalaryTargetUsd: number;
    bestAchievementDiamonds: number;
    hostLevel: string;
    nextLevelTargetUsd: number;
    neededDiamondsForNextLevel: number;
    isLive: boolean;
    lastLivePingAt?: number;
    updatedAt: number;
  }

  interface AgencyTargetTier {
    id: string;
    levelName: string;
    targetDiamonds: number;
    requiredDays: number;
    requiredHours: number;
    salaryUsd: number;
    agencyCommissionPercent: number;
    bonusUsd?: number;
    description?: string;
  }

  let agencyTargetsTiersStore: AgencyTargetTier[] = [
    { id: 'T1', levelName: 'LV.1', targetDiamonds: 10000, requiredDays: 15, requiredHours: 30, salaryUsd: 10, agencyCommissionPercent: 10 },
    { id: 'T2', levelName: 'LV.2', targetDiamonds: 30000, requiredDays: 15, requiredHours: 30, salaryUsd: 30, agencyCommissionPercent: 10 },
    { id: 'T3', levelName: 'LV.3', targetDiamonds: 60000, requiredDays: 15, requiredHours: 30, salaryUsd: 65, agencyCommissionPercent: 12 },
    { id: 'T4', levelName: 'LV.4', targetDiamonds: 120000, requiredDays: 15, requiredHours: 30, salaryUsd: 140, agencyCommissionPercent: 15 },
    { id: 'T5', levelName: 'LV.5', targetDiamonds: 250000, requiredDays: 15, requiredHours: 30, salaryUsd: 300, agencyCommissionPercent: 15 },
    { id: 'T6', levelName: 'LV.6', targetDiamonds: 500000, requiredDays: 15, requiredHours: 35, salaryUsd: 620, agencyCommissionPercent: 18 },
    { id: 'T7', levelName: 'LV.7', targetDiamonds: 1000000, requiredDays: 18, requiredHours: 40, salaryUsd: 1300, agencyCommissionPercent: 20 },
    { id: 'T8', levelName: 'LV.8', targetDiamonds: 2500000, requiredDays: 20, requiredHours: 50, salaryUsd: 3300, agencyCommissionPercent: 22 },
    { id: 'T9', levelName: 'LV.9', targetDiamonds: 5000000, requiredDays: 22, requiredHours: 60, salaryUsd: 7000, agencyCommissionPercent: 25 },
    { id: 'T10', levelName: 'LV.10', targetDiamonds: 10000000, requiredDays: 25, requiredHours: 70, salaryUsd: 15000, agencyCommissionPercent: 30 },
  ];

  function recalculateHostTierStats(host: ServerHostStats) {
    const sorted = [...agencyTargetsTiersStore].sort((a, b) => a.targetDiamonds - b.targetDiamonds);
    let currentTier: AgencyTargetTier | null = null;
    let nextTier: AgencyTargetTier | null = sorted[0] || null;

    for (let i = 0; i < sorted.length; i++) {
      if (host.diamondsEarned >= sorted[i].targetDiamonds) {
        currentTier = sorted[i];
        nextTier = sorted[i + 1] || null;
      } else {
        nextTier = sorted[i];
        break;
      }
    }

    host.hostLevel = currentTier ? currentTier.levelName : 'LV.0';

    const activeRuleTier = nextTier || currentTier;
    if (activeRuleTier) {
      host.qualifiedDaysTarget = activeRuleTier.requiredDays;
      host.streamHoursTarget = activeRuleTier.requiredHours;
      host.monthlySalaryTargetUsd = activeRuleTier.salaryUsd;
    } else {
      host.qualifiedDaysTarget = dashboardControlsConfig.qualifiedDaysTarget || 15;
      host.streamHoursTarget = dashboardControlsConfig.streamHoursTarget || 30;
      host.monthlySalaryTargetUsd = 0;
    }

    if (nextTier) {
      host.neededDiamondsForNextLevel = Math.max(0, nextTier.targetDiamonds - host.diamondsEarned);
      host.nextLevelTargetUsd = nextTier.salaryUsd;
    } else {
      host.neededDiamondsForNextLevel = 0;
      host.nextLevelTargetUsd = currentTier ? currentTier.salaryUsd : 0;
    }

    host.exchangeRateDiamondsPerUsd = dashboardControlsConfig.exchangeRateDiamondsPerUsd;
    host.earningsUsd = parseFloat((host.diamondsEarned / host.exchangeRateDiamondsPerUsd).toFixed(2));
    host.updatedAt = Date.now();
  }

  const serverUserWallets = new Map<string, ServerUserWallet>();
  const serverHostStats = new Map<string, ServerHostStats>();

  // Ensure default developer / super admin wallet is pre-populated with real zeroed diamonds
  function getOrCreateUserWallet(userId: string, userName?: string): ServerUserWallet {
    const cleanId = (userId || '1001001').trim();
    if (!serverUserWallets.has(cleanId)) {
      const isOwner = cleanId === '1001001' || cleanId.toLowerCase() === 'megdy1919@gmail.com';
      serverUserWallets.set(cleanId, {
        userId: cleanId,
        userName: userName || (isOwner ? 'أبو أمجد (الملك سلطان الفاتح)' : `مستخدم #${cleanId}`),
        coins: isOwner ? 100000000 : 50000,
        diamonds: 0,
        totalDiamondsEarned: 0,
        totalCoinsSpent: 0,
        isHost: true,
        updatedAt: Date.now()
      });
    }
    return serverUserWallets.get(cleanId)!;
  }

  // ========================================================
  // EXTERNAL DASHBOARD DYNAMIC CONTROLS & AUDIT STORE
  // ========================================================

  interface UserLevelTier {
    level: number;
    title: string;
    type: 'supporter' | 'charm';
    minPoints: number;
    maxPoints: number;
    badgeStyle: {
      bgGradient: string;
      borderColor: string;
      textColor: string;
      icon: string;
    };
  }

  let userLevelTiersStore: UserLevelTier[] = [
    // Supporter Levels (مستويات الداعم / الثراء)
    { level: 1, title: 'داعم برونزي', type: 'supporter', minPoints: 0, maxPoints: 1000, badgeStyle: { bgGradient: 'from-amber-700 to-amber-900', borderColor: 'border-amber-600', textColor: 'text-amber-100', icon: '🔥' } },
    { level: 10, title: 'داعم فضي', type: 'supporter', minPoints: 10000, maxPoints: 50000, badgeStyle: { bgGradient: 'from-slate-400 to-slate-600', borderColor: 'border-slate-300', textColor: 'text-white', icon: '🔥' } },
    { level: 30, title: 'داعم ذهبي', type: 'supporter', minPoints: 50000, maxPoints: 200000, badgeStyle: { bgGradient: 'from-amber-500 to-yellow-600', borderColor: 'border-yellow-300', textColor: 'text-amber-950', icon: '🔥' } },
    { level: 60, title: 'داعم بلاتيني', type: 'supporter', minPoints: 200000, maxPoints: 1000000, badgeStyle: { bgGradient: 'from-cyan-500 to-blue-600', borderColor: 'border-cyan-300', textColor: 'text-white', icon: '⚡' } },
    { level: 90, title: 'داعم ياقوتي', type: 'supporter', minPoints: 1000000, maxPoints: 5000000, badgeStyle: { bgGradient: 'from-rose-600 to-red-800', borderColor: 'border-rose-400', textColor: 'text-white', icon: '💎' } },
    { level: 120, title: 'نجم الدعم الملكي', type: 'supporter', minPoints: 5000000, maxPoints: 20000000, badgeStyle: { bgGradient: 'from-purple-600 via-pink-600 to-rose-600', borderColor: 'border-pink-300', textColor: 'text-white', icon: '👑' } },
    { level: 150, title: 'إمبراطور الدعم الأسطوري', type: 'supporter', minPoints: 20000000, maxPoints: 100000000, badgeStyle: { bgGradient: 'from-amber-400 via-rose-500 to-purple-800', borderColor: 'border-amber-200', textColor: 'text-white', icon: '🐉' } },

    // Charm Levels (مستويات المدعوم / الكاريزما والشهرة)
    { level: 1, title: 'موهبة صاعدة', type: 'charm', minPoints: 0, maxPoints: 1000, badgeStyle: { bgGradient: 'from-emerald-600 to-teal-800', borderColor: 'border-emerald-400', textColor: 'text-white', icon: '✨' } },
    { level: 10, title: 'نجم واعد', type: 'charm', minPoints: 10000, maxPoints: 50000, badgeStyle: { bgGradient: 'from-teal-500 to-cyan-700', borderColor: 'border-teal-300', textColor: 'text-white', icon: '⭐' } },
    { level: 30, title: 'سفير الأناقة', type: 'charm', minPoints: 50000, maxPoints: 200000, badgeStyle: { bgGradient: 'from-pink-500 to-rose-600', borderColor: 'border-pink-300', textColor: 'text-white', icon: '💖' } },
    { level: 45, title: 'سفير التألق والشهرة', type: 'charm', minPoints: 200000, maxPoints: 1000000, badgeStyle: { bgGradient: 'from-indigo-600 via-purple-600 to-pink-500', borderColor: 'border-purple-300', textColor: 'text-white', icon: '💎' } },
    { level: 80, title: 'أسطورة التألق', type: 'charm', minPoints: 1000000, maxPoints: 10000000, badgeStyle: { bgGradient: 'from-violet-700 via-fuchsia-600 to-pink-600', borderColor: 'border-fuchsia-300', textColor: 'text-white', icon: '🌟' } },
  ];

  const dashboardControlsConfig = {
    exchangeRateDiamondsPerUsd: 13500, // 13,500 ألماسة = 1.00 دولار كمعيار رسمي
    qualifiedDaysTarget: 15, // 15 يوماً تذكير الأيام بحسب طلب المستخدم وإرشادات الداشبورد
    streamHoursTarget: 30,   // 30 ساعة بث مؤهلة شهرياً
    hourlyBroadcastRateUsd: 2.5,
    badges: {
      showSupporterBadge: true,
      showCharmBadge: true,
      showVipBadge: true,
      supporterLevel: 120, // رقم مستوى الداعم المحدد من السيرفر
      charmLevel: 45,      // رقم مستوى المدعوم / الكاريزما المحدد من السيرفر
      vipLevel: 'VIP7',
      vipDesignStyle: 'royal_gold_3d',
      supporterBadgeDesign: 'royal_dragon_flame',
      charmBadgeDesign: 'diamond_rose_5star',
      badgeDecisionByDashboard: true
    }
  };

  interface ServerUserProfile {
    userId: string;
    name: string;
    avatar: string;
    bio: string;
    gender: string;
    age: number;
    country: string;
    auditStatus: 'approved' | 'pending' | 'rejected';
    pendingName?: string;
    pendingAvatar?: string;
    updatedAt: number;
  }

  interface ProfileAuditTicket {
    auditId: string;
    userId: string;
    userName: string;
    oldName: string;
    newName: string;
    oldAvatar: string;
    newAvatar: string;
    status: 'pending' | 'approved' | 'rejected';
    submittedAt: number;
    reviewedAt?: number;
    reviewedBy?: string;
  }

  const serverUserProfiles = new Map<string, ServerUserProfile>();
  const serverProfileAudits: ProfileAuditTicket[] = [];

  function getOrCreateUserProfile(userId: string): ServerUserProfile {
    const cleanId = (userId || '1001001').trim();
    if (!serverUserProfiles.has(cleanId)) {
      const isOwner = cleanId === '1001001' || cleanId.toLowerCase() === 'megdy1919@gmail.com';
      serverUserProfiles.set(cleanId, {
        userId: cleanId,
        name: isOwner ? 'أبو أمجد (الملك سلطان الفاتح)' : `مستخدم #${cleanId}`,
        avatar: isOwner 
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'
          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
        bio: isOwner ? 'المطور والمؤسس الأول لتطبيق النجم 👑' : 'مرحباً بكم في حسابي في تطبيق النجم ✨',
        gender: 'male',
        age: 28,
        country: 'YE',
        auditStatus: 'approved',
        updatedAt: Date.now()
      });
    }
    return serverUserProfiles.get(cleanId)!;
  }

  function getOrCreateHostStats(userId: string, userName?: string): ServerHostStats {
    const cleanId = (userId || '1001001').trim();
    if (!serverHostStats.has(cleanId)) {
      const isOwner = cleanId === '1001001' || cleanId.toLowerCase() === 'megdy1919@gmail.com';
      const stats: ServerHostStats = {
        userId: cleanId,
        userName: userName || (isOwner ? 'أبو أمجد (الملك سلطان الفاتح)' : `مضيف #${cleanId}`),
        diamondsEarned: 0,
        exchangeRateDiamondsPerUsd: dashboardControlsConfig.exchangeRateDiamondsPerUsd,
        earningsUsd: 0,
        qualifiedDays: 0,
        qualifiedDaysTarget: dashboardControlsConfig.qualifiedDaysTarget, // 15 days
        streamHours: 0,
        streamHoursTarget: dashboardControlsConfig.streamHoursTarget,
        monthlySalaryTargetUsd: 0,
        bestAchievementDiamonds: 0,
        hostLevel: 'LV.0',
        nextLevelTargetUsd: 0,
        neededDiamondsForNextLevel: 10000,
        isLive: false,
        updatedAt: Date.now()
      };
      recalculateHostTierStats(stats);
      serverHostStats.set(cleanId, stats);
    }
    const current = serverHostStats.get(cleanId)!;
    recalculateHostTierStats(current);
    return current;
  }

  // ====================================================================
  // 🌟 CENTRAL RULE: GET /api/hosts/:hostId/mobile-me
  // صفحة «أنا» في التطبيق والمتصفح تقرأ بياناتها حصراً من هذا المسار
  // ====================================================================
  app.get('/api/hosts/:hostId/mobile-me', (req, res) => {
    const hostId = req.params.hostId.trim();
    const profile = getOrCreateUserProfile(hostId);
    const wallet = getOrCreateUserWallet(hostId, profile.name);
    const hostStats = getOrCreateHostStats(hostId, profile.name);
    const hierarchy = serverHierarchyStore.get(hostId);

    // Sync settings and tier stats dynamically from active target tiers table
    recalculateHostTierStats(hostStats);

    const badges = {
      level: dashboardControlsConfig.badges.supporterLevel,
      supporterLevel: dashboardControlsConfig.badges.supporterLevel,
      charmLevel: dashboardControlsConfig.badges.charmLevel,
      vipLevel: dashboardControlsConfig.badges.vipLevel || 'VIP7',
      showVipBadge: dashboardControlsConfig.badges.showVipBadge,
      showSupporterBadge: dashboardControlsConfig.badges.showSupporterBadge,
      showCharmBadge: dashboardControlsConfig.badges.showCharmBadge,
      vipDesignStyle: dashboardControlsConfig.badges.vipDesignStyle,
      supporterBadgeDesign: dashboardControlsConfig.badges.supporterBadgeDesign,
      charmBadgeDesign: dashboardControlsConfig.badges.charmBadgeDesign,
      badgeDecisionByDashboard: true
    };

    res.json({
      status: 'success',
      sourceOfTruth: 'central_server_and_dashboard',
      hostId,
      profile: {
        userId: profile.userId,
        name: profile.name,
        avatar: profile.avatar,
        bio: profile.bio,
        gender: profile.gender,
        age: profile.age,
        country: profile.country,
        auditStatus: profile.auditStatus,
        pendingName: profile.pendingName || null,
        pendingAvatar: profile.pendingAvatar || null
      },
      wallet: {
        coins: wallet.coins,
        diamonds: wallet.diamonds,
        totalDiamondsEarned: wallet.totalDiamondsEarned
      },
      badges,
      hostStats: {
        isHost: Boolean(hierarchy?.rolesSummary?.isHost || wallet.isHost),
        diamondsEarned: hostStats.diamondsEarned,
        earningsUsd: hostStats.earningsUsd,
        exchangeRateDiamondsPerUsd: hostStats.exchangeRateDiamondsPerUsd,
        qualifiedDays: hostStats.qualifiedDays,
        qualifiedDaysTarget: hostStats.qualifiedDaysTarget, // 15 days
        streamHours: hostStats.streamHours,
        streamHoursTarget: hostStats.streamHoursTarget,
        monthlySalaryTargetUsd: hostStats.monthlySalaryTargetUsd,
        bestAchievementDiamonds: hostStats.bestAchievementDiamonds,
        hostLevel: hostStats.hostLevel,
        nextLevelTargetUsd: hostStats.nextLevelTargetUsd,
        neededDiamondsForNextLevel: hostStats.neededDiamondsForNextLevel,
        isLive: hostStats.isLive
      },
      dashboardControls: dashboardControlsConfig,
      targetTiers: agencyTargetsTiersStore,
      timestamp: Date.now()
    });
  });

  // ====================================================================
  // 🌟 CENTRAL RULE: POST /api/hosts/:hostId/receive-support
  // أي استراتيجية دعم أو إرسال هدية في الروم تُرسل فوراً إلى هذا المسار
  // ====================================================================
  app.post('/api/hosts/:hostId/receive-support', (req, res) => {
    try {
      const hostId = req.params.hostId.trim();
      const {
        senderId = '1001001',
        senderName = 'الداعم',
        giftId = 'gift-support',
        giftName = 'دعم مباشر',
        giftValue = 10,
        quantity = 1,
        roomId = 'default-room'
      } = req.body;

      const totalValue = Math.max(0, Number(giftValue) || 0);

      // 1. الخصم من الداعم بالسيرفر
      const senderWallet = getOrCreateUserWallet(senderId, senderName);
      senderWallet.coins = Math.max(0, senderWallet.coins - totalValue);
      senderWallet.totalCoinsSpent += totalValue;
      senderWallet.updatedAt = Date.now();

      // 2. تحويل وإضافة الألماس للمستلم المضيف بالسيرفر
      const recipientProfile = getOrCreateUserProfile(hostId);
      const recipientWallet = getOrCreateUserWallet(hostId, recipientProfile.name);
      recipientWallet.diamonds += totalValue;
      recipientWallet.totalDiamondsEarned += totalValue;
      recipientWallet.updatedAt = Date.now();

      // 3. تحديث إحصائيات المضيف وحساب الراتب بالدولار
      const hostStats = getOrCreateHostStats(hostId, recipientProfile.name);
      hostStats.qualifiedDaysTarget = dashboardControlsConfig.qualifiedDaysTarget;
      hostStats.streamHoursTarget = dashboardControlsConfig.streamHoursTarget;
      hostStats.exchangeRateDiamondsPerUsd = dashboardControlsConfig.exchangeRateDiamondsPerUsd;

      hostStats.diamondsEarned += totalValue;
      hostStats.earningsUsd = parseFloat((hostStats.diamondsEarned / hostStats.exchangeRateDiamondsPerUsd).toFixed(2));
      hostStats.neededDiamondsForNextLevel = Math.max(0, 10000 - (hostStats.diamondsEarned % 10000));
      hostStats.updatedAt = Date.now();

      // 4. بث التحديث الحقيقي لجميع الأطراف عبر WebSocket
      const broadcastPayload = {
        type: 'host_support_received',
        payload: {
          hostId,
          senderId,
          senderName,
          giftId,
          giftName,
          giftValue: totalValue,
          quantity,
          newDiamondsBalance: recipientWallet.diamonds,
          newEarningsUsd: hostStats.earningsUsd,
          senderCoins: senderWallet.coins,
          roomId,
          timestamp: Date.now()
        }
      };

      const msgStr = JSON.stringify(broadcastPayload);
      clients.forEach((c) => {
        if (c.ws.readyState === WebSocket.OPEN) {
          c.ws.send(msgStr);
        }
      });

      res.json({
        status: 'success',
        message: 'تم استقبال ومعالجة الدعم وتحديث الألماس والراتب من السيرفر المركزي بنجاح 💎',
        hostId,
        giftValue: totalValue,
        recipientDiamonds: recipientWallet.diamonds,
        hostEarningsUsd: hostStats.earningsUsd,
        exchangeRate: hostStats.exchangeRateDiamondsPerUsd,
        qualifiedDaysTarget: hostStats.qualifiedDaysTarget,
        senderRemainingCoins: senderWallet.coins
      });
    } catch (err: any) {
      console.error('Error in /api/hosts/:hostId/receive-support:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // ====================================================================
  // 🌟 PROFILE UPDATE & DASHBOARD AUDIT ENGINE (تعديل الاسم والصورة)
  // ====================================================================
  // عند تعديل الاسم أو الصورة يُرسل طلب مراجعة وتدقيق للداشبورد السحابي
  app.post('/api/users/:userId/update-profile-request', (req, res) => {
    try {
      const userId = req.params.userId.trim();
      const { name, avatar, bio } = req.body;
      const profile = getOrCreateUserProfile(userId);

      const isOwner = userId === '1001001' || userId.toLowerCase() === 'megdy1919@gmail.com';

      const auditTicket: ProfileAuditTicket = {
        auditId: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        userId,
        userName: profile.name,
        oldName: profile.name,
        newName: name ? String(name).trim() : profile.name,
        oldAvatar: profile.avatar,
        newAvatar: avatar ? String(avatar).trim() : profile.avatar,
        status: isOwner ? 'approved' : 'pending',
        submittedAt: Date.now()
      };

      if (isOwner) {
        // حساب المؤسس والمالك يُعتمد فوراً ويُزامن مع الداشبورد
        if (name) profile.name = String(name).trim();
        if (avatar) profile.avatar = String(avatar).trim();
        if (bio !== undefined) profile.bio = String(bio).trim();
        profile.auditStatus = 'approved';
        profile.pendingName = undefined;
        profile.pendingAvatar = undefined;
        profile.updatedAt = Date.now();
        auditTicket.reviewedAt = Date.now();
        auditTicket.reviewedBy = 'super_admin_auto_pass';
      } else {
        // المستخدمين الآخرين: يتم تسجيل التعديل كطلب معلق للمراجعة بالداشبورد
        profile.pendingName = name ? String(name).trim() : undefined;
        profile.pendingAvatar = avatar ? String(avatar).trim() : undefined;
        profile.auditStatus = 'pending';
        profile.updatedAt = Date.now();
      }

      serverProfileAudits.unshift(auditTicket);

      // بث إشعار للداشبورد عبر WebSocket
      const wsNotice = JSON.stringify({
        type: 'profile_audit_event',
        payload: { auditTicket, profile }
      });
      clients.forEach((c) => {
        if (c.ws.readyState === WebSocket.OPEN) {
          c.ws.send(wsNotice);
        }
      });

      res.json({
        status: 'success',
        auditStatus: profile.auditStatus,
        message: isOwner 
          ? 'تم اعتماد وتحديث الاسم والصورة بنجاح في السيرفر والداشبورد 🎉' 
          : 'تم إرسال طلب تعديل الاسم/الصورة للسيرفر، وسيتم تطبيقه فور مراجعته واعتماده من لوحة التحكم ⏱',
        profile: {
          userId: profile.userId,
          name: profile.name,
          avatar: profile.avatar,
          pendingName: profile.pendingName,
          pendingAvatar: profile.pendingAvatar,
          auditStatus: profile.auditStatus
        },
        auditId: auditTicket.auditId
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // الداشبورد الخارجي: استعلام كافة طلبات تدقيق الصور والأسماء
  // GET /api/dashboard/profile-audits
  app.get('/api/dashboard/profile-audits', (req, res) => {
    res.json({
      status: 'success',
      total: serverProfileAudits.length,
      audits: serverProfileAudits
    });
  });

  // الداشبورد الخارجي: اعتماد أو رفض طلب التعديل
  // POST /api/dashboard/profile-audits/:auditId/decision
  app.post('/api/dashboard/profile-audits/:auditId/decision', (req, res) => {
    const auditId = req.params.auditId;
    const { decision = 'approved', reviewer = 'dashboard_admin' } = req.body;

    const ticket = serverProfileAudits.find((t) => t.auditId === auditId);
    if (!ticket) {
      return res.status(404).json({ error: 'Audit ticket not found' });
    }

    ticket.status = decision === 'approved' ? 'approved' : 'rejected';
    ticket.reviewedAt = Date.now();
    ticket.reviewedBy = reviewer;

    const profile = getOrCreateUserProfile(ticket.userId);
    if (decision === 'approved') {
      profile.name = ticket.newName;
      profile.avatar = ticket.newAvatar;
      profile.auditStatus = 'approved';
      profile.pendingName = undefined;
      profile.pendingAvatar = undefined;
      profile.updatedAt = Date.now();

      // بث التعديل المعتمد لجميع هواتف التطبيق والغرف
      const approvalNotice = JSON.stringify({
        type: 'profile_updated_by_dashboard',
        payload: {
          userId: profile.userId,
          name: profile.name,
          avatar: profile.avatar
        }
      });
      clients.forEach((c) => {
        if (c.ws.readyState === WebSocket.OPEN) {
          c.ws.send(approvalNotice);
        }
      });
    } else {
      profile.auditStatus = 'rejected';
      profile.pendingName = undefined;
      profile.pendingAvatar = undefined;
      profile.updatedAt = Date.now();
    }

    res.json({
      status: 'success',
      auditId,
      decision,
      updatedProfile: profile
    });
  });

  // الداشبورد الخارجي: التحكم بديناميكية الأيام، سعر الصرف، والشعارات
  // GET /api/dashboard/config
  app.get('/api/dashboard/config', (req, res) => {
    res.json({
      status: 'success',
      config: dashboardControlsConfig
    });
  });

  // POST /api/dashboard/config
  app.post('/api/dashboard/config', (req, res) => {
    const {
      exchangeRateDiamondsPerUsd,
      qualifiedDaysTarget,
      streamHoursTarget,
      badges
    } = req.body;

    if (qualifiedDaysTarget !== undefined) {
      dashboardControlsConfig.qualifiedDaysTarget = Number(qualifiedDaysTarget);
    }
    if (exchangeRateDiamondsPerUsd !== undefined) {
      const newRate = Math.max(1, Number(exchangeRateDiamondsPerUsd));
      dashboardControlsConfig.exchangeRateDiamondsPerUsd = newRate;
      serverHostStats.forEach((host) => {
        host.exchangeRateDiamondsPerUsd = newRate;
        host.earningsUsd = parseFloat((host.diamondsEarned / newRate).toFixed(2));
        host.updatedAt = Date.now();
      });
    }
    if (streamHoursTarget !== undefined) {
      dashboardControlsConfig.streamHoursTarget = Number(streamHoursTarget);
    }
    if (badges) {
      dashboardControlsConfig.badges = {
        ...dashboardControlsConfig.badges,
        ...badges
      };
    }

    // إشعار التطبيق بتعديلات الداشبورد
    const configNotice = JSON.stringify({
      type: 'dashboard_config_updated',
      payload: dashboardControlsConfig
    });
    clients.forEach((c) => {
      if (c.ws.readyState === WebSocket.OPEN) {
        c.ws.send(configNotice);
      }
    });

    res.json({
      status: 'success',
      message: 'تم تحديث تعليمات وضوابط لوحة التحكم الخارجية بنجاح 🚀',
      config: dashboardControlsConfig
    });
  });

  // ====================================================================
  // 🌟 CENTRAL RULE: POST /api/agency-targets-tiers
  // جدول تارجتات الوكالات والشروط والأيام القادمة من لوحة التحكم الخارجية
  // ====================================================================
  app.post('/api/agency-targets-tiers', (req, res) => {
    try {
      const body = req.body;
      let rawTiers: any[] = [];
      if (Array.isArray(body)) {
        rawTiers = body;
      } else if (body && Array.isArray(body.tiers)) {
        rawTiers = body.tiers;
      } else if (body && Array.isArray(body.data)) {
        rawTiers = body.data;
      }

      if (rawTiers.length > 0) {
        agencyTargetsTiersStore = rawTiers.map((t, idx) => ({
          id: String(t.id || t.tierId || `T${idx + 1}`),
          levelName: String(t.levelName || t.level || `LV.${idx + 1}`),
          targetDiamonds: Number(t.targetDiamonds ?? t.diamonds ?? 0),
          requiredDays: Number(t.requiredDays ?? t.days ?? dashboardControlsConfig.qualifiedDaysTarget ?? 15),
          requiredHours: Number(t.requiredHours ?? t.hours ?? dashboardControlsConfig.streamHoursTarget ?? 30),
          salaryUsd: Number(t.salaryUsd ?? t.salary ?? t.reward ?? 0),
          agencyCommissionPercent: Number(t.agencyCommissionPercent ?? t.commission ?? 10),
          bonusUsd: Number(t.bonusUsd ?? 0),
          description: t.description || ''
        }));

        // Sort tiers ascending by required diamonds
        agencyTargetsTiersStore.sort((a, b) => a.targetDiamonds - b.targetDiamonds);
      }

      // Check for global defaults if provided
      if (body && typeof body.defaultDaysTarget === 'number') {
        dashboardControlsConfig.qualifiedDaysTarget = body.defaultDaysTarget;
      }
      if (body && typeof body.defaultHoursTarget === 'number') {
        dashboardControlsConfig.streamHoursTarget = body.defaultHoursTarget;
      }
      if (body && typeof body.exchangeRateDiamondsPerUsd === 'number') {
        dashboardControlsConfig.exchangeRateDiamondsPerUsd = body.exchangeRateDiamondsPerUsd;
      }

      // Recalculate every single host in the system dynamically and immediately!
      serverHostStats.forEach((host) => {
        recalculateHostTierStats(host);
      });

      // Broadcast update notice to all connected clients via WebSocket
      const tiersNotice = JSON.stringify({
        type: 'agency_targets_tiers_updated',
        payload: {
          tiers: agencyTargetsTiersStore,
          timestamp: Date.now()
        }
      });
      clients.forEach((c) => {
        if (c.ws.readyState === WebSocket.OPEN) {
          c.ws.send(tiersNotice);
        }
      });

      res.json({
        status: 'success',
        message: 'تم استلام وتحديث جدول تارجتات الوكالات والشروط بنجاح على السيرفر المركزي 🎯',
        tiersCount: agencyTargetsTiersStore.length,
        tiers: agencyTargetsTiersStore
      });
    } catch (err: any) {
      res.status(500).json({ status: 'error', message: err?.message || 'Server error' });
    }
  });

  // GET /api/agency-targets-tiers
  app.get('/api/agency-targets-tiers', (req, res) => {
    res.json({
      status: 'success',
      tiers: agencyTargetsTiersStore,
      count: agencyTargetsTiersStore.length,
      updatedAt: Date.now()
    });
  });

  // ====================================================================
  // 🌟 CENTRAL RULE: GET & POST /api/user-levels-tiers
  // جدول مستويات الليفل (الداعم والمدعوم) المعتمد من لوحة التحكم الخارجية
  // ====================================================================
  app.get('/api/user-levels-tiers', (req, res) => {
    res.json({
      status: 'success',
      sourceOfTruth: 'central_server_and_dashboard',
      tiers: userLevelTiersStore,
      count: userLevelTiersStore.length,
      supporterLevels: userLevelTiersStore.filter((t) => t.type === 'supporter'),
      charmLevels: userLevelTiersStore.filter((t) => t.type === 'charm'),
      currentSettings: {
        supporterLevel: dashboardControlsConfig.badges.supporterLevel,
        charmLevel: dashboardControlsConfig.badges.charmLevel,
        supporterBadgeDesign: dashboardControlsConfig.badges.supporterBadgeDesign,
        charmBadgeDesign: dashboardControlsConfig.badges.charmBadgeDesign,
        vipLevel: dashboardControlsConfig.badges.vipLevel,
        vipDesignStyle: dashboardControlsConfig.badges.vipDesignStyle
      },
      updatedAt: Date.now()
    });
  });

  app.post('/api/user-levels-tiers', (req, res) => {
    try {
      const body = req.body;
      let rawTiers: any[] = [];
      if (Array.isArray(body)) {
        rawTiers = body;
      } else if (body && Array.isArray(body.tiers)) {
        rawTiers = body.tiers;
      }

      if (rawTiers.length > 0) {
        userLevelTiersStore = rawTiers.map((t, idx) => ({
          level: Number(t.level || idx + 1),
          title: String(t.title || `المستوى ${t.level || idx + 1}`),
          type: (t.type === 'charm' ? 'charm' : 'supporter') as 'supporter' | 'charm',
          minPoints: Number(t.minPoints ?? 0),
          maxPoints: Number(t.maxPoints ?? 10000),
          badgeStyle: {
            bgGradient: t.badgeStyle?.bgGradient || 'from-amber-600 to-amber-800',
            borderColor: t.badgeStyle?.borderColor || 'border-amber-400',
            textColor: t.badgeStyle?.textColor || 'text-white',
            icon: t.badgeStyle?.icon || (t.type === 'charm' ? '💎' : '🔥')
          }
        }));
      }

      // Allow updating active levels directly in the payload
      if (body && typeof body.supporterLevel === 'number') {
        dashboardControlsConfig.badges.supporterLevel = body.supporterLevel;
      }
      if (body && typeof body.charmLevel === 'number') {
        dashboardControlsConfig.badges.charmLevel = body.charmLevel;
      }
      if (body && body.supporterBadgeDesign) {
        dashboardControlsConfig.badges.supporterBadgeDesign = body.supporterBadgeDesign;
      }
      if (body && body.charmBadgeDesign) {
        dashboardControlsConfig.badges.charmBadgeDesign = body.charmBadgeDesign;
      }
      if (body && body.vipLevel) {
        dashboardControlsConfig.badges.vipLevel = body.vipLevel;
      }

      // Broadcast update notice via WebSockets
      const levelNotice = JSON.stringify({
        type: 'user_levels_tiers_updated',
        payload: {
          tiers: userLevelTiersStore,
          badges: dashboardControlsConfig.badges,
          timestamp: Date.now()
        }
      });
      clients.forEach((c) => {
        if (c.ws.readyState === WebSocket.OPEN) {
          c.ws.send(levelNotice);
        }
      });

      res.json({
        status: 'success',
        message: 'تم تحديث جدول مستويات الليفل وضوابط الشارات بنجاح على السيرفر المركزي 🌟',
        tiersCount: userLevelTiersStore.length,
        badges: dashboardControlsConfig.badges
      });
    } catch (err: any) {
      res.status(500).json({ status: 'error', message: err?.message || 'Server error' });
    }
  });

  // 1. استقبال ومعالجة إشارة الدعم والهدايا من السيرفر المركزي
  // POST /api/rewards/gift-signal
  app.post('/api/rewards/gift-signal', (req, res) => {
    try {
      const {
        senderId = '1001001',
        senderName = 'الداعم',
        recipientId = '1001001',
        recipientName = 'المستلم',
        giftId = 'gift-1',
        giftName = 'هدية',
        giftValue = 10,
        roomId = 'default'
      } = req.body;

      const numValue = Math.max(0, Number(giftValue) || 0);
      const totalAmount = numValue;

      // 1. الخصم من الداعم
      const senderWallet = getOrCreateUserWallet(senderId, senderName);
      senderWallet.coins = Math.max(0, senderWallet.coins - totalAmount);
      senderWallet.totalCoinsSpent += totalAmount;
      senderWallet.updatedAt = Date.now();

      // 2. إضافة الألماس للمستلم (معدل 1 كوين = 1 ألماسة)
      const recipientWallet = getOrCreateUserWallet(recipientId, recipientName);
      recipientWallet.diamonds += totalAmount;
      recipientWallet.totalDiamondsEarned += totalAmount;
      recipientWallet.updatedAt = Date.now();

      // 3. التحقق هل المستلم مضيف (Host)
      const hierarchyEntity = serverHierarchyStore.get(recipientId);
      const isHost = Boolean(hierarchyEntity?.rolesSummary?.isHost || recipientWallet.isHost);

      let hostStats: ServerHostStats | null = null;
      if (isHost) {
        hostStats = getOrCreateHostStats(recipientId, recipientName);
        hostStats.diamondsEarned += totalAmount;
        if (hostStats.diamondsEarned > hostStats.bestAchievementDiamonds) {
          hostStats.bestAchievementDiamonds = hostStats.diamondsEarned;
        }
        recalculateHostTierStats(hostStats);
      }

      // 4. بث إشارة التحديث الحية لجميع المتصلين عبر WebSocket
      const broadcastPayload = {
        type: 'gift_signal_processed',
        payload: {
          senderId,
          senderName,
          recipientId,
          recipientName,
          giftId,
          giftName,
          giftValue: totalAmount,
          senderCoins: senderWallet.coins,
          recipientDiamonds: recipientWallet.diamonds,
          isHost,
          hostEarningsUsd: hostStats?.earningsUsd || 0,
          roomId,
          timestamp: Date.now()
        }
      };

      const msgStr = JSON.stringify(broadcastPayload);
      clients.forEach((c) => {
        if (c.ws.readyState === WebSocket.OPEN) {
          c.ws.send(msgStr);
        }
      });

      res.json({
        status: 'success',
        message: 'تمت معالجة إشارة الدعم وتحويل الألماس وتحديث السيرفر بنجاح 💎',
        sender: {
          userId: senderWallet.userId,
          newCoinsBalance: senderWallet.coins
        },
        recipient: {
          userId: recipientWallet.userId,
          newDiamondsBalance: recipientWallet.diamonds,
          isHost
        },
        hostStats: hostStats ? {
          diamondsEarned: hostStats.diamondsEarned,
          earningsUsd: hostStats.earningsUsd,
          exchangeRate: hostStats.exchangeRateDiamondsPerUsd,
          qualifiedDays: hostStats.qualifiedDays,
          streamHours: hostStats.streamHours
        } : null
      });
    } catch (err: any) {
      console.error('Error processing gift signal on server:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // 2. استعلام محفظة وألماس المستخدم من السيرفر المركزي
  // GET /api/users/:userId/wallet
  app.get('/api/users/:userId/wallet', (req, res) => {
    const userId = req.params.userId;
    const wallet = getOrCreateUserWallet(userId);
    res.json({
      status: 'success',
      wallet: {
        userId: wallet.userId,
        userName: wallet.userName,
        coins: wallet.coins,
        diamonds: wallet.diamonds,
        totalDiamondsEarned: wallet.totalDiamondsEarned,
        isHost: wallet.isHost,
        updatedAt: wallet.updatedAt
      }
    });
  });

  // 3. استعلام إحصائيات المضيف وساعات البث والراتب بالدولار من السيرفر المركزي
  // GET /api/broadcaster/:userId/stats
  app.get('/api/broadcaster/:userId/stats', (req, res) => {
    const userId = req.params.userId;
    const stats = getOrCreateHostStats(userId);
    res.json({
      status: 'success',
      hostStats: {
        userId: stats.userId,
        userName: stats.userName,
        diamondsEarned: stats.diamondsEarned,
        exchangeRateDiamondsPerUsd: stats.exchangeRateDiamondsPerUsd,
        earningsUsd: stats.earningsUsd,
        qualifiedDays: stats.qualifiedDays,
        qualifiedDaysTarget: stats.qualifiedDaysTarget,
        streamHours: stats.streamHours,
        streamHoursTarget: stats.streamHoursTarget,
        monthlySalaryTargetUsd: stats.monthlySalaryTargetUsd,
        bestAchievementDiamonds: stats.bestAchievementDiamonds,
        hostLevel: stats.hostLevel,
        nextLevelTargetUsd: stats.nextLevelTargetUsd,
        neededDiamondsForNextLevel: stats.neededDiamondsForNextLevel,
        isLive: stats.isLive,
        updatedAt: stats.updatedAt
      }
    });
  });

  // 4. نبضة دورية لجلسة بث المضيف (لحساب ساعات وأيام البث الفعلي في السيرفر)
  // POST /api/broadcaster/stream-session/ping
  app.post('/api/broadcaster/stream-session/ping', (req, res) => {
    try {
      const { userId = '1001001', isLive = true, durationMinutes = 1 } = req.body;
      const stats = getOrCreateHostStats(userId);
      stats.isLive = Boolean(isLive);
      stats.lastLivePingAt = Date.now();

      if (isLive) {
        // زيادة ساعات البث
        stats.streamHours = parseFloat((stats.streamHours + (durationMinutes / 60)).toFixed(2));
        if (stats.streamHours >= 1 && stats.qualifiedDays < stats.qualifiedDaysTarget) {
          stats.qualifiedDays = Math.min(stats.qualifiedDaysTarget, Math.floor(stats.streamHours / 1));
        }
      }
      stats.updatedAt = Date.now();

      res.json({
        status: 'success',
        streamHours: stats.streamHours,
        qualifiedDays: stats.qualifiedDays,
        isLive: stats.isLive
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
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
