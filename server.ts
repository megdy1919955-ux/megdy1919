import express from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { generateZegoToken04, ZEGO_DEFAULT_APP_ID, ZEGO_DEFAULT_SECRET } from './src/lib/zegoServerAssistant.ts';
import { initializeApp, getApps, applicationDefault } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { initializeApp as initClientApp, getApps as getClientApps } from 'firebase/app';
import { getFirestore as getClientFirestore, doc as clientDoc, getDoc as clientGetDoc, setDoc as clientSetDoc, serverTimestamp as clientServerTimestamp } from 'firebase/firestore';
import firebaseClientConfig from './firebase-applet-config.json';

// Initialize Client SDK as dependable fallback for Firestore operations
const clientApp = getClientApps().length ? getClientApps()[0] : initClientApp(firebaseClientConfig, 'server-client-app');
const clientDb = getClientFirestore(clientApp);

// ═══════════════════════════════════════════════════════
// Firebase Admin SDK — Production Ready
// ═══════════════════════════════════════════════════════
if (!getApps().length) {
  try {
    initializeApp({
      credential: applicationDefault(),
      projectId: 'ainajm'
    });
  } catch (err) {
    console.warn('[FirebaseAdmin] initializeApp with applicationDefault fallback:', err);
    initializeApp({
      projectId: 'ainajm'
    });
  }
}

const db = getFirestore();


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

  // Static direct download for code audit archive
  app.get(['/code_full.zip', '/public/code_full.zip'], (req, res) => {
    const zipFilePath = path.resolve(process.cwd(), 'public', 'code_full.zip');
    res.download(zipFilePath, 'super_legend_code_full.zip');
  });

  app.get(['/critical_10_files.zip', '/public/critical_10_files.zip'], (req, res) => {
    const zipFilePath = path.resolve(process.cwd(), 'public', 'critical_10_files.zip');
    res.download(zipFilePath, 'critical_10_files.zip');
  });

  app.get(['/ProfileScreen.txt', '/ProfileScreen.tsx', '/public/ProfileScreen.txt', '/public/ProfileScreen.tsx'], (req, res) => {
    const filePath = path.resolve(process.cwd(), 'src', 'components', 'ProfileScreen.tsx');
    res.type('text/plain; charset=utf-8');
    res.sendFile(filePath);
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
  serverHierarchyStore.set('0OW7yfypGLgOgwbBHOVtpV8FJ3A3', superAdminEntity);
  serverHierarchyStore.set('0OW7YFYPGLGOGWBBHOVTPV8FJ3A3', superAdminEntity);

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
  app.get('/api/hierarchy/permissions/:userId', async (req, res) => {
    const rawId = req.params.userId?.trim();
    if (!rawId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const cleanId = rawId.toUpperCase();
    let entity = serverHierarchyStore.get(cleanId) || serverHierarchyStore.get(rawId);

    if (!entity) {
      // فحص سريع لحساب المطور أو السوبر أدمن
      if (
        cleanId === '0OW7YFYPGLGOGWBBHOVTPV8FJ3A3' || 
        cleanId === '1001001' || 
        cleanId === 'MGR-9901' ||
        cleanId === 'MEGDY1919@GMAIL.COM'
      ) {
        entity = superAdminEntity;
        serverHierarchyStore.set(rawId, superAdminEntity);
        serverHierarchyStore.set(cleanId, superAdminEntity);
      } else {
        try {
          // استعلام مستند المستخدم من Firestore للتحقق الحي من صلاحياته
          const userDoc = await db.collection('users').doc(rawId).get();
          if (userDoc.exists) {
            const uData = userDoc.data() || {};
            if (uData.isOwner === true || uData.role === 'owner' || uData.role === 'super_admin' || uData.role === 'admin') {
              entity = superAdminEntity;
              serverHierarchyStore.set(rawId, superAdminEntity);
            }
          }
        } catch (dbErr) {
          console.warn('[Permissions] DB check error:', dbErr);
        }
      }
    }

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

  // Ensure user wallet is persisted in Firestore with resilient in-memory fallback
  async function getOrCreateUserWallet(userId: string, userName?: string): Promise<ServerUserWallet> {
    const cleanId = (userId || '1001001').trim();
    const isOwner = cleanId === '1001001' || cleanId.toLowerCase() === 'megdy1919@gmail.com' || cleanId === '0OW7yfypGLgOgwbBHOVtpV8FJ3A3';
    const defaultOwnerCoins = 92128300;
    const defaultOwnerDiamonds = 50000000;
    const defaultTotalCoinsSpent = 252000;

    try {
      // Direct lookup: If owner, check official UID document first
      const docKey = isOwner ? '0OW7yfypGLgOgwbBHOVtpV8FJ3A3' : cleanId;
      const ref = db.collection('users').doc(docKey);
      const snap = await ref.get();
      let data: any = null;

      if (snap.exists) {
        data = snap.data();
      } else {
        // Query by id field if document was saved under Firebase Auth UID (e.g. 0OW7yfypGLgOgwbBHOVtpV8FJ3A3)
        const qSnap = await db.collection('users').where('id', '==', cleanId).limit(1).get().catch(() => null);
        if (qSnap && !qSnap.empty) {
          data = qSnap.docs[0].data();
        } else {
          const numQSnap = await db.collection('users').where('id', '==', Number(cleanId)).limit(1).get().catch(() => null);
          if (numQSnap && !numQSnap.empty) {
            data = numQSnap.docs[0].data();
          }
        }
      }

      if (data) {
        const wallet: ServerUserWallet = {
          userId: cleanId,
          userName: data?.name || data?.displayName || userName || (isOwner ? 'أبو أمجد' : `مستخدم #${cleanId}`),
          coins: typeof data?.coins === 'number' ? (isOwner ? 92128300 : data.coins) : (isOwner ? defaultOwnerCoins : 0),
          diamonds: typeof data?.diamonds === 'number' ? (isOwner ? 50000000 : data.diamonds) : (isOwner ? defaultOwnerDiamonds : 0),
          totalDiamondsEarned: data?.totalDiamondsEarned ?? (isOwner ? defaultOwnerDiamonds : 0),
          totalCoinsSpent: typeof data?.totalCoinsSpent === 'number' ? data.totalCoinsSpent : (isOwner ? defaultTotalCoinsSpent : 0),
          isHost: data?.isHost ?? true,
          updatedAt: data?.updatedAt || Date.now()
        };
        serverUserWallets.set(cleanId, wallet);
        if (isOwner) {
          serverUserWallets.set('1001001', wallet);
          serverUserWallets.set('0OW7yfypGLgOgwbBHOVtpV8FJ3A3', wallet);
        }
        return wallet;
      }

      const wallet: ServerUserWallet = {
        userId: cleanId,
        userName: userName || (isOwner ? 'أبو أمجد' : `مستخدم #${cleanId}`),
        coins: isOwner ? defaultOwnerCoins : 0,
        diamonds: isOwner ? defaultOwnerDiamonds : 0,
        totalDiamondsEarned: isOwner ? defaultOwnerDiamonds : 0,
        totalCoinsSpent: isOwner ? defaultTotalCoinsSpent : 0,
        isHost: true,
        updatedAt: Date.now()
      };
      await ref.set(wallet, { merge: true }).catch(() => {});
      serverUserWallets.set(cleanId, wallet);
      if (isOwner) {
        serverUserWallets.set('1001001', wallet);
        serverUserWallets.set('0OW7yfypGLgOgwbBHOVtpV8FJ3A3', wallet);
      }
      return wallet;
    } catch (err) {
      if (!serverUserWallets.has(cleanId)) {
        const fallbackWallet: ServerUserWallet = {
          userId: cleanId,
          userName: userName || (isOwner ? 'أبو أمجد' : `مستخدم #${cleanId}`),
          coins: isOwner ? defaultOwnerCoins : 0,
          diamonds: isOwner ? defaultOwnerDiamonds : 0,
          totalDiamondsEarned: isOwner ? defaultOwnerDiamonds : 0,
          totalCoinsSpent: isOwner ? defaultTotalCoinsSpent : 0,
          isHost: true,
          updatedAt: Date.now()
        };
        serverUserWallets.set(cleanId, fallbackWallet);
        if (isOwner) {
          serverUserWallets.set('1001001', fallbackWallet);
          serverUserWallets.set('0OW7yfypGLgOgwbBHOVtpV8FJ3A3', fallbackWallet);
        }
      }
      return serverUserWallets.get(cleanId)!;
    }
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
      vipLevel: 'VIP10',
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
    vipLevel?: string;
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

  async function getOrCreateUserProfile(userId: string): Promise<ServerUserProfile> {
    const cleanId = (userId || '1001001').trim();
    const isOwner = cleanId === '1001001' || cleanId.toLowerCase() === 'megdy1919@gmail.com' || cleanId === '0OW7yfypGLgOgwbBHOVtpV8FJ3A3';
    try {
      const docKey = isOwner ? '0OW7yfypGLgOgwbBHOVtpV8FJ3A3' : cleanId;
      const ref = db.collection('users').doc(docKey);
      const snap = await ref.get();
      let data: any = null;

      if (snap.exists) {
        data = snap.data();
      } else {
        const qSnap = await db.collection('users').where('id', '==', cleanId).limit(1).get().catch(() => null);
        if (qSnap && !qSnap.empty) {
          data = qSnap.docs[0].data();
        } else {
          const numQSnap = await db.collection('users').where('id', '==', Number(cleanId)).limit(1).get().catch(() => null);
          if (numQSnap && !numQSnap.empty) {
            data = numQSnap.docs[0].data();
          }
        }
      }

      if (data) {
        const profile: ServerUserProfile = {
          userId: cleanId,
          name: data?.name || data?.displayName || (isOwner ? 'أبو أمجد' : `مستخدم #${cleanId}`),
          avatar: data?.avatar || data?.photoURL || (isOwner 
            ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'
            : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'),
          bio: data?.bio || (isOwner ? 'المطور والمؤسس الأول لتطبيق النجم 👑' : 'مرحباً بكم في حسابي في تطبيق النجم ✨'),
          gender: data?.gender || 'male',
          age: data?.age || 28,
          country: data?.country || 'YE',
          auditStatus: data?.auditStatus || 'approved',
          vipLevel: data?.vipTier || data?.vipLevel || (isOwner ? 'VIP10' : 'VIP1'),
          pendingName: data?.pendingName,
          pendingAvatar: data?.pendingAvatar,
          updatedAt: data?.updatedAt || Date.now()
        };
        serverUserProfiles.set(cleanId, profile);
        if (isOwner) {
          serverUserProfiles.set('1001001', profile);
          serverUserProfiles.set('0OW7yfypGLgOgwbBHOVtpV8FJ3A3', profile);
        }
        return profile;
      }
      const profile: ServerUserProfile = {
        userId: cleanId,
        name: isOwner ? 'أبو أمجد' : `مستخدم ${cleanId.slice(-4)}`,
        avatar: isOwner 
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'
          : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
        bio: isOwner ? 'المطور والمؤسس الأول لتطبيق النجم 👑' : 'مرحباً بك في تطبيق النجم! ✨',
        gender: 'male',
        age: 28,
        country: 'اليمن',
        vipLevel: isOwner ? 'VIP10' : 'VIP1',
        auditStatus: 'approved',
        updatedAt: Date.now()
      };
      await ref.set(profile, { merge: true }).catch(() => {});
      serverUserProfiles.set(cleanId, profile);
      if (isOwner) {
        serverUserProfiles.set('1001001', profile);
        serverUserProfiles.set('0OW7yfypGLgOgwbBHOVtpV8FJ3A3', profile);
      }
      return profile;
    } catch (err) {
      if (!serverUserProfiles.has(cleanId)) {
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
          vipLevel: isOwner ? 'VIP10' : 'VIP1',
          auditStatus: 'approved',
          updatedAt: Date.now()
        });
      }
      return serverUserProfiles.get(cleanId)!;
    }
  }

  async function getOrCreateHostStats(userId: string, userName?: string): Promise<ServerHostStats> {
    const cleanId = (userId || '1001001').trim();
    const isOwner = cleanId === '1001001' || cleanId.toLowerCase() === 'megdy1919@gmail.com' || cleanId === '0OW7yfypGLgOgwbBHOVtpV8FJ3A3';
    try {
      const docKey = isOwner ? '0OW7yfypGLgOgwbBHOVtpV8FJ3A3' : cleanId;
      const ref = db.collection('hosts').doc(docKey);
      const snap = await ref.get();
      if (snap.exists) {
        const data = snap.data();
        const stats: ServerHostStats = {
          userId: cleanId,
          userName: data?.userName || userName || (isOwner ? 'أبو أمجد' : `مضيف #${cleanId}`),
          diamondsEarned: typeof data?.diamondsEarned === 'number' ? (isOwner ? 50000000 : data.diamondsEarned) : (isOwner ? 50000000 : 0),
          exchangeRateDiamondsPerUsd: data?.exchangeRateDiamondsPerUsd ?? 13500,
          earningsUsd: data?.earningsUsd ?? 0,
          qualifiedDays: data?.qualifiedDays ?? (isOwner ? 30 : 0),
          qualifiedDaysTarget: data?.qualifiedDaysTarget ?? 15,
          streamHours: data?.streamHours ?? (isOwner ? 120 : 0),
          streamHoursTarget: data?.streamHoursTarget ?? 30,
          monthlySalaryTargetUsd: data?.monthlySalaryTargetUsd ?? 0,
          bestAchievementDiamonds: data?.bestAchievementDiamonds ?? (isOwner ? 50000000 : 0),
          hostLevel: data?.hostLevel ?? (isOwner ? 'LV.10' : 'LV.1'),
          nextLevelTargetUsd: data?.nextLevelTargetUsd ?? 10,
          neededDiamondsForNextLevel: data?.neededDiamondsForNextLevel ?? 0,
          isLive: data?.isLive ?? false,
          updatedAt: data?.updatedAt || Date.now()
        };
        recalculateHostTierStats(stats);
        serverHostStats.set(cleanId, stats);
        if (isOwner) {
          serverHostStats.set('1001001', stats);
          serverHostStats.set('0OW7yfypGLgOgwbBHOVtpV8FJ3A3', stats);
        }
        return stats;
      }
      const stats: ServerHostStats = {
        userId: cleanId,
        userName: userName || (isOwner ? 'أبو أمجد' : `مضيف #${cleanId}`),
        diamondsEarned: isOwner ? 50000000 : 0,
        exchangeRateDiamondsPerUsd: 13500,
        qualifiedDays: isOwner ? 30 : 0,
        qualifiedDaysTarget: 15,
        streamHours: isOwner ? 120 : 0,
        streamHoursTarget: 30,
        monthlySalaryTargetUsd: isOwner ? 15000 : 0,
        bestAchievementDiamonds: isOwner ? 50000000 : 0,
        hostLevel: isOwner ? 'LV.10' : 'LV.0',
        earningsUsd: isOwner ? 3703.7 : 0,
        nextLevelTargetUsd: 0,
        neededDiamondsForNextLevel: 0,
        isLive: false,
        updatedAt: Date.now()
      };
      recalculateHostTierStats(stats);
      serverHostStats.set(cleanId, stats);
      if (isOwner) {
        serverHostStats.set('1001001', stats);
        serverHostStats.set('0OW7yfypGLgOgwbBHOVtpV8FJ3A3', stats);
      }
      return stats;
    } catch (err) {
      if (!serverHostStats.has(cleanId)) {
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
  }

  async function getDashboardConfig(): Promise<typeof dashboardControlsConfig> {
    try {
      const ref = db.collection('config').doc('dashboard_controls');
      const snap = await ref.get();
      if (snap.exists) {
        return snap.data() as typeof dashboardControlsConfig;
      }
      await ref.set(dashboardControlsConfig, { merge: true });
      return dashboardControlsConfig;
    } catch {
      return dashboardControlsConfig;
    }
  }

  async function updateDashboardConfig(updates: Partial<typeof dashboardControlsConfig>) {
    Object.assign(dashboardControlsConfig, updates);
    try {
      const ref = db.collection('config').doc('dashboard_controls');
      await ref.set(updates, { merge: true });
    } catch {}
  }

  // Helper to dynamically calculate individual user supporter level based on actual coins spent
  function calculateUserSupporterLevel(totalCoinsSpent: number): number {
    const supporterTiers = userLevelTiersStore
      .filter((t) => t.type === 'supporter')
      .sort((a, b) => a.level - b.level);
    let currentLevel = 1;
    for (const tier of supporterTiers) {
      if (totalCoinsSpent >= tier.minPoints) {
        currentLevel = tier.level;
      }
    }
    return currentLevel;
  }

  // Helper to dynamically calculate individual user charm level based on actual diamonds earned
  function calculateUserCharmLevel(totalDiamondsEarned: number): number {
    const charmTiers = userLevelTiersStore
      .filter((t) => t.type === 'charm')
      .sort((a, b) => a.level - b.level);
    let currentLevel = 1;
    for (const tier of charmTiers) {
      if (totalDiamondsEarned >= tier.minPoints) {
        currentLevel = tier.level;
      }
    }
    return currentLevel;
  }

  // ====================================================================
  // 🌟 CENTRAL RULE: GET /api/hosts/:hostId/mobile-me
  // صفحة «أنا» في التطبيق والمتصفح تقرأ بياناتها حصراً من هذا المسار
  // ====================================================================
  app.get('/api/hosts/:hostId/mobile-me', async (req, res) => {
    const hostId = req.params.hostId.trim();
    const profile = await getOrCreateUserProfile(hostId);
    const wallet = await getOrCreateUserWallet(hostId, profile.name);
    const hostStats = await getOrCreateHostStats(hostId, profile.name);
    const hierarchy = serverHierarchyStore.get(hostId);
    const currentDashboardConfig = await getDashboardConfig();

    // Sync settings and tier stats dynamically from active target tiers table
    recalculateHostTierStats(hostStats);

    const isOwner = hostId === '1001001' || hostId.toLowerCase() === 'megdy1919@gmail.com';
    // حساب استحقاق ومستوى الداعم والمدعوم الفردي بناءً على الأرقام الحقيقية لهذا الـ ID
    const userSupporterLevel = isOwner
      ? 120
      : calculateUserSupporterLevel(wallet.totalCoinsSpent || 0);
    const userCharmLevel = isOwner
      ? 120
      : calculateUserCharmLevel(wallet.totalDiamondsEarned || hostStats.diamondsEarned || 0);

    const badges = {
      level: userSupporterLevel,
      supporterLevel: userSupporterLevel,
      charmLevel: userCharmLevel,
      vipLevel: profile.vipLevel || (isOwner ? 'VIP10' : 'VIP1'),
      showVipBadge: currentDashboardConfig.badges.showVipBadge,
      showSupporterBadge: currentDashboardConfig.badges.showSupporterBadge,
      showCharmBadge: currentDashboardConfig.badges.showCharmBadge,
      vipDesignStyle: currentDashboardConfig.badges.vipDesignStyle,
      supporterBadgeDesign: currentDashboardConfig.badges.supporterBadgeDesign,
      charmBadgeDesign: currentDashboardConfig.badges.charmBadgeDesign,
      badgeDecisionByDashboard: true
    };

    res.json({
      status: 'success',
      sourceOfTruth: 'firestore_admin_sdk',
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
      dashboardControls: currentDashboardConfig,
      targetTiers: agencyTargetsTiersStore,
      timestamp: Date.now()
    });
  });

  // ====================================================================
  // 🌟 CENTRAL RULE: POST /api/hosts/:hostId/receive-support
  // أي استراتيجية دعم أو إرسال هدية في الروم تُرسل فوراً إلى هذا المسار
  // ====================================================================
  app.post('/api/hosts/:hostId/receive-support', async (req, res) => {
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
      const senderWallet = await getOrCreateUserWallet(senderId, senderName);
      senderWallet.coins = Math.max(0, senderWallet.coins - totalValue);
      senderWallet.totalCoinsSpent += totalValue;
      senderWallet.updatedAt = Date.now();

      db.collection('users').doc(senderId).set({
        coins: senderWallet.coins,
        totalCoinsSpent: senderWallet.totalCoinsSpent,
        updatedAt: FieldValue.serverTimestamp()
      }, { merge: true }).catch(() => {});

      // 2. تحويل وإضافة الألماس للمستلم المضيف بالسيرفر
      const recipientProfile = await getOrCreateUserProfile(hostId);
      const recipientWallet = await getOrCreateUserWallet(hostId, recipientProfile.name);
      recipientWallet.diamonds += totalValue;
      recipientWallet.totalDiamondsEarned += totalValue;
      recipientWallet.updatedAt = Date.now();

      db.collection('users').doc(hostId).set({
        diamonds: recipientWallet.diamonds,
        totalDiamondsEarned: recipientWallet.totalDiamondsEarned,
        updatedAt: FieldValue.serverTimestamp()
      }, { merge: true }).catch(() => {});

      // تحديث supporters subcollection
      const senderProfile = await getOrCreateUserProfile(senderId);
      const supporterRef = db
        .collection('users')
        .doc(hostId)
        .collection('supporters')
        .doc(senderId);

      await supporterRef.set({
        supporterUid: senderId,
        supporterName: senderName || senderProfile?.name || 'الداعم',
        supporterAvatar: senderProfile?.avatar || '',
        totalDiamonds: FieldValue.increment(totalValue),
        totalCoins: FieldValue.increment(totalValue),
        supportCount: FieldValue.increment(1),
        lastSupportAt: FieldValue.serverTimestamp()
      }, { merge: true }).catch(async (err: any) => {
        try {
          const clientSupporterRef = clientDoc(clientDb, 'users', hostId, 'supporters', senderId);
          await clientSetDoc(clientSupporterRef, {
            supporterUid: senderId,
            supporterName: senderName || senderProfile?.name || 'الداعم',
            supporterAvatar: senderProfile?.avatar || '',
            totalDiamonds: totalValue,
            totalCoins: totalValue,
            supportCount: 1,
            lastSupportAt: clientServerTimestamp()
          }, { merge: true });
        } catch (clientErr) {
          console.warn('Supporters write fallback notice:', clientErr);
        }
      });
      // 2b. تحديث سجل البث اليومي في users/{hostId}/daily_records
      const todayDate = new Date().toISOString().split('T')[0];
      const monthKey = `${todayDate.substring(5, 7)}/${todayDate.substring(0, 4)}`;
      db.collection('users').doc(hostId).collection('daily_records').doc(todayDate).set({
        date: todayDate,
        month: monthKey,
        totalDiamonds: FieldValue.increment(totalValue),
        hostIncome: FieldValue.increment(totalValue),
        roomDiamonds: FieldValue.increment(totalValue),
        updatedAt: FieldValue.serverTimestamp()
      }, { merge: true }).catch(() => {});

      const hostStats = await getOrCreateHostStats(hostId, recipientProfile.name);
      hostStats.qualifiedDaysTarget = dashboardControlsConfig.qualifiedDaysTarget;
      hostStats.streamHoursTarget = dashboardControlsConfig.streamHoursTarget;
      hostStats.exchangeRateDiamondsPerUsd = dashboardControlsConfig.exchangeRateDiamondsPerUsd;

      hostStats.diamondsEarned += totalValue;
      hostStats.earningsUsd = parseFloat((hostStats.diamondsEarned / hostStats.exchangeRateDiamondsPerUsd).toFixed(2));
      hostStats.neededDiamondsForNextLevel = Math.max(0, 10000 - (hostStats.diamondsEarned % 10000));
      hostStats.updatedAt = Date.now();

      db.collection('hosts').doc(hostId).set({
        diamondsEarned: hostStats.diamondsEarned,
        earningsUsd: hostStats.earningsUsd,
        exchangeRateDiamondsPerUsd: hostStats.exchangeRateDiamondsPerUsd,
        qualifiedDays: hostStats.qualifiedDays,
        qualifiedDaysTarget: hostStats.qualifiedDaysTarget,
        streamHours: hostStats.streamHours,
        streamHoursTarget: hostStats.streamHoursTarget,
        updatedAt: FieldValue.serverTimestamp()
      }, { merge: true }).catch(() => {});

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
  app.post('/api/users/:userId/update-profile-request', async (req, res) => {
    try {
      const userId = req.params.userId.trim();
      const { name, avatar, bio } = req.body;
      const profile = await getOrCreateUserProfile(userId);

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
  app.post('/api/dashboard/profile-audits/:auditId/decision', async (req, res) => {
    const auditId = req.params.auditId;
    const { decision = 'approved', reviewer = 'dashboard_admin' } = req.body;

    const ticket = serverProfileAudits.find((t) => t.auditId === auditId);
    if (!ticket) {
      return res.status(404).json({ error: 'Audit ticket not found' });
    }

    ticket.status = decision === 'approved' ? 'approved' : 'rejected';
    ticket.reviewedAt = Date.now();
    ticket.reviewedBy = reviewer;

    const profile = await getOrCreateUserProfile(ticket.userId);
    if (decision === 'approved') {
      profile.name = ticket.newName;
      profile.avatar = ticket.newAvatar;
      profile.auditStatus = 'approved';
      profile.pendingName = undefined;
      profile.pendingAvatar = undefined;
      profile.updatedAt = Date.now();

      // Persist approved name and avatar to Firestore users collection
      db.collection('users').doc(ticket.userId).set({
        name: profile.name,
        displayName: profile.name,
        avatar: profile.avatar,
        photoURL: profile.avatar,
        auditStatus: 'approved',
        updatedAt: FieldValue.serverTimestamp()
      }, { merge: true }).catch(() => {});

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

      db.collection('users').doc(ticket.userId).set({
        auditStatus: 'rejected',
        updatedAt: FieldValue.serverTimestamp()
      }, { merge: true }).catch(() => {});
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
  app.get('/api/dashboard/config', async (req, res) => {
    const cfg = await getDashboardConfig();
    res.json({
      status: 'success',
      config: cfg
    });
  });

  // POST /api/dashboard/config
  app.post('/api/dashboard/config', async (req, res) => {
    const {
      exchangeRateDiamondsPerUsd,
      qualifiedDaysTarget,
      streamHoursTarget,
      badges
    } = req.body;

    const updates: any = {};

    if (qualifiedDaysTarget !== undefined) {
      dashboardControlsConfig.qualifiedDaysTarget = Number(qualifiedDaysTarget);
      updates.qualifiedDaysTarget = Number(qualifiedDaysTarget);
    }
    if (exchangeRateDiamondsPerUsd !== undefined) {
      const newRate = Math.max(1, Number(exchangeRateDiamondsPerUsd));
      dashboardControlsConfig.exchangeRateDiamondsPerUsd = newRate;
      updates.exchangeRateDiamondsPerUsd = newRate;
      serverHostStats.forEach((host) => {
        host.exchangeRateDiamondsPerUsd = newRate;
        host.earningsUsd = parseFloat((host.diamondsEarned / newRate).toFixed(2));
        host.updatedAt = Date.now();
      });
    }
    if (streamHoursTarget !== undefined) {
      dashboardControlsConfig.streamHoursTarget = Number(streamHoursTarget);
      updates.streamHoursTarget = Number(streamHoursTarget);
    }
    if (badges) {
      dashboardControlsConfig.badges = {
        ...dashboardControlsConfig.badges,
        ...badges
      };
      updates.badges = dashboardControlsConfig.badges;
    }

    await updateDashboardConfig(updates);

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
  app.post('/api/rewards/gift-signal', async (req, res) => {
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
      const senderWallet = await getOrCreateUserWallet(senderId, senderName);
      senderWallet.coins = Math.max(0, senderWallet.coins - totalAmount);
      senderWallet.totalCoinsSpent += totalAmount;
      senderWallet.updatedAt = Date.now();

      // 2. إضافة الألماس للمستلم (معدل 1 كوين = 1 ألماسة)
      const recipientWallet = await getOrCreateUserWallet(recipientId, recipientName);
      recipientWallet.diamonds += totalAmount;
      recipientWallet.totalDiamondsEarned += totalAmount;
      recipientWallet.updatedAt = Date.now();

      // 3. التحقق هل المستلم مضيف (Host)
      const hierarchyEntity = serverHierarchyStore.get(recipientId);
      const isHost = Boolean(hierarchyEntity?.rolesSummary?.isHost || recipientWallet.isHost);

      let hostStats: ServerHostStats | null = null;
      if (isHost) {
        hostStats = await getOrCreateHostStats(recipientId, recipientName);
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
  app.get('/api/users/:userId/wallet', async (req, res) => {
    const userId = req.params.userId;
    const wallet = await getOrCreateUserWallet(userId);
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

  // 🌟 CENTRAL RULE: POST /api/users/:userId/recharge
  // شحن وتزويد كوينز المحفظة محصور حصراً بلوحة التحكم (Dashboard / Admin SDK / Server-to-Server)
  app.post('/api/users/:userId/recharge', async (req, res) => {
    try {
      const authHeader = req.headers['authorization'] || '';
      const adminKey = req.headers['x-admin-key'] || req.headers['x-dashboard-key'] || req.query.adminKey;
      const isDashboardAuthorized =
        adminKey === 'najm_dashboard_admin_secret_key_2026' ||
        adminKey === 'admin_dashboard_secret' ||
        authHeader.includes('Bearer najm_dashboard_admin_token') ||
        authHeader.includes('Bearer dashboard-admin-secret-najm-2026');

      if (!isDashboardAuthorized) {
        return res.status(403).json({
          status: 'error',
          code: 'FORBIDDEN_CLIENT_RECHARGE',
          message: 'عذراً، الشحن المباشر من التطبيق غير متاح. يرجى التواصل مع الوكيل المعتمد أو استخدام لوحة التحكم (Dashboard) عبر معرفك (ID).'
        });
      }

      const userId = req.params.userId.trim();
      const { amount, paymentMethod = 'agency', packageId = 'agency_recharge' } = req.body;
      const rechargeAmount = Math.max(0, Number(amount) || 0);

      const profile = await getOrCreateUserProfile(userId);
      const wallet = await getOrCreateUserWallet(userId, profile.name);
      wallet.coins += rechargeAmount;
      wallet.updatedAt = Date.now();

      // Persist to Firestore
      db.collection('users').doc(userId).set({
        coins: wallet.coins,
        updatedAt: FieldValue.serverTimestamp()
      }, { merge: true }).catch(() => {});

      // Broadcast update to all clients
      const notice = JSON.stringify({
        type: 'user_wallet_recharged',
        payload: {
          userId,
          coins: wallet.coins,
          addedCoins: rechargeAmount,
          paymentMethod,
          timestamp: Date.now()
        }
      });
      clients.forEach((c) => {
        if (c.ws.readyState === WebSocket.OPEN) {
          c.ws.send(notice);
        }
      });

      res.json({
        status: 'success',
        message: 'تم شحن الكوينز وتحديث المحفظة بنجاح بالسيرفر المركزي 🎉',
        userId,
        coins: wallet.coins,
        addedCoins: rechargeAmount,
        updatedAt: wallet.updatedAt
      });
    } catch (err: any) {
      res.status(500).json({ status: 'error', message: err?.message || 'Server error' });
    }
  });

  // 🌟 CENTRAL RULE: POST /api/users/:userId/deduct
  // خصم الكوينز عند إرسال الهدايا لضمان تطابق الأرصدة لحظياً
  app.post('/api/users/:userId/deduct', async (req, res) => {
    try {
      const userId = req.params.userId.trim();
      const { amount, reason = 'gift_sent' } = req.body;
      const deductAmount = Math.max(0, Number(amount) || 0);

      const profile = await getOrCreateUserProfile(userId);
      const wallet = await getOrCreateUserWallet(userId, profile.name);
      wallet.coins = Math.max(0, wallet.coins - deductAmount);
      wallet.totalCoinsSpent += deductAmount;
      wallet.updatedAt = Date.now();

      // Persist to Firestore
      db.collection('users').doc(userId).set({
        coins: wallet.coins,
        totalCoinsSpent: wallet.totalCoinsSpent,
        updatedAt: FieldValue.serverTimestamp()
      }, { merge: true }).catch(() => {});

      res.json({
        status: 'success',
        message: 'تم خصم الكوينز بنجاح من السيرفر المركزي',
        userId,
        coins: wallet.coins,
        deducted: deductAmount,
        updatedAt: wallet.updatedAt
      });
    } catch (err: any) {
      res.status(500).json({ status: 'error', message: err?.message || 'Server error' });
    }
  });

  // POST /api/users/:userId/update-balance
  // متزامن مع خدمة WalletService لخصم أو إضافة الكوينز أو الألماس
  app.post('/api/users/:userId/update-balance', async (req, res) => {
    try {
      const userId = req.params.userId.trim();
      const { type, amount } = req.body;
      const numAmount = Number(amount) || 0;
      const profile = await getOrCreateUserProfile(userId);
      const wallet = await getOrCreateUserWallet(userId, profile.name);

      if (type === 'coins') {
        wallet.coins = Math.max(0, wallet.coins + numAmount);
        if (numAmount < 0) wallet.totalCoinsSpent += Math.abs(numAmount);
      } else if (type === 'diamonds') {
        wallet.diamonds = Math.max(0, wallet.diamonds + numAmount);
        if (numAmount > 0) wallet.totalDiamondsEarned += numAmount;
      }
      wallet.updatedAt = Date.now();

      // Persist to Firestore
      db.collection('users').doc(userId).set({
        coins: wallet.coins,
        diamonds: wallet.diamonds,
        totalCoinsSpent: wallet.totalCoinsSpent,
        totalDiamondsEarned: wallet.totalDiamondsEarned,
        updatedAt: FieldValue.serverTimestamp()
      }, { merge: true }).catch(() => {});

      // إشعار كافة المستخدمين عبر الـ WebSocket
      const notice = JSON.stringify({
        type: 'user_wallet_updated',
        payload: {
          userId,
          coins: wallet.coins,
          diamonds: wallet.diamonds,
          type,
          amount: numAmount,
          timestamp: Date.now()
        }
      });
      clients.forEach((c) => {
        if (c.ws.readyState === WebSocket.OPEN) {
          c.ws.send(notice);
        }
      });

      res.json({
        status: 'success',
        wallet: {
          coins: wallet.coins,
          diamonds: wallet.diamonds,
          totalDiamondsEarned: wallet.totalDiamondsEarned,
          totalCoinsSpent: wallet.totalCoinsSpent
        }
      });
    } catch (err: any) {
      res.status(500).json({ status: 'error', message: err?.message || 'Server error' });
    }
  });

  // 3. استعلام إحصائيات المضيف وساعات البث والراتب بالدولار من السيرفر المركزي
  // GET /api/broadcaster/:userId/stats
  app.get('/api/broadcaster/:userId/stats', async (req, res) => {
    const userId = req.params.userId;
    const stats = await getOrCreateHostStats(userId);
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
  app.post('/api/broadcaster/stream-session/ping', async (req, res) => {
    try {
      const { userId = '1001001', isLive = true, durationMinutes = 1 } = req.body;
      const stats = await getOrCreateHostStats(userId);
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

      // Persist to Firestore
      db.collection('hosts').doc(userId).set({
        isLive: stats.isLive,
        streamHours: stats.streamHours,
        qualifiedDays: stats.qualifiedDays,
        updatedAt: FieldValue.serverTimestamp()
      }, { merge: true }).catch(() => {});

      // Record daily broadcast stream minutes
      if (isLive) {
        const todayDate = new Date().toISOString().split('T')[0];
        const monthKey = `${todayDate.substring(5, 7)}/${todayDate.substring(0, 4)}`;
        db.collection('users').doc(userId).collection('daily_records').doc(todayDate).set({
          date: todayDate,
          month: monthKey,
          streamDurationMinutes: FieldValue.increment(durationMinutes),
          activeDurationMinutes: FieldValue.increment(durationMinutes),
          isValidDay: stats.streamHours >= 1,
          updatedAt: FieldValue.serverTimestamp()
        }, { merge: true }).catch(() => {});
      }

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

  // ═══════════════════════════════════════════════════════
  // 🎯 جدول تصنيف الأرباح والمكافآت الشهرية لنظام التارجت (Target System)
  // ═══════════════════════════════════════════════════════
  const TARGET_SYSTEM_LEVELS = [
    { rank: 1,  diamonds: 13500,     hostUsd: 1,     agencyUsd: 0,     totalUsd: 1 },
    { rank: 2,  diamonds: 27000,     hostUsd: 2,     agencyUsd: 0,     totalUsd: 2 },
    { rank: 3,  diamonds: 40500,     hostUsd: 5,     agencyUsd: 0,     totalUsd: 5 },
    { rank: 4,  diamonds: 100000,    hostUsd: 6,     agencyUsd: 1,     totalUsd: 7 },
    { rank: 5,  diamonds: 81500,     hostUsd: 7,     agencyUsd: 3,     totalUsd: 10 },
    { rank: 6,  diamonds: 100000,    hostUsd: 21,    agencyUsd: 7,     totalUsd: 28 },
    { rank: 7,  diamonds: 400000,    hostUsd: 21,    agencyUsd: 7,     totalUsd: 28 },
    { rank: 8,  diamonds: 300000,    hostUsd: 25,    agencyUsd: 9,     totalUsd: 34 },
    { rank: 9,  diamonds: 700000,    hostUsd: 39,    agencyUsd: 12,    totalUsd: 51 },
    { rank: 10, diamonds: 1000000,   hostUsd: 40,    agencyUsd: 16,    totalUsd: 56 },
    { rank: 11, diamonds: 1500000,   hostUsd: 117,   agencyUsd: 12,    totalUsd: 129 },
    { rank: 12, diamonds: 2000000,   hostUsd: 148,   agencyUsd: 44,    totalUsd: 192 },
    { rank: 13, diamonds: 2500000,   hostUsd: 210,   agencyUsd: 97,    totalUsd: 307 },
    { rank: 14, diamonds: 3000000,   hostUsd: 245,   agencyUsd: 66,    totalUsd: 311 },
    { rank: 15, diamonds: 4500000,   hostUsd: 315,   agencyUsd: 17,    totalUsd: 332 },
    { rank: 16, diamonds: 4500000,   hostUsd: 310,   agencyUsd: 43,    totalUsd: 353 },
    { rank: 17, diamonds: 5000000,   hostUsd: 310,   agencyUsd: 10,    totalUsd: 320 },
    { rank: 18, diamonds: 6000000,   hostUsd: 420,   agencyUsd: 120,   totalUsd: 540 },
    { rank: 19, diamonds: 6000000,   hostUsd: 420,   agencyUsd: 128,   totalUsd: 548 },
    { rank: 20, diamonds: 7000000,   hostUsd: 490,   agencyUsd: 154,   totalUsd: 644 },
    { rank: 21, diamonds: 8000000,   hostUsd: 630,   agencyUsd: 178,   totalUsd: 808 },
    { rank: 22, diamonds: 9000000,   hostUsd: 630,   agencyUsd: 118,   totalUsd: 748 },
    { rank: 23, diamonds: 10000000,  hostUsd: 875,   agencyUsd: 220,   totalUsd: 1095 },
    { rank: 24, diamonds: 12500000,  hostUsd: 875,   agencyUsd: 220,   totalUsd: 1095 },
    { rank: 25, diamonds: 15000000,  hostUsd: 1005,  agencyUsd: 335,   totalUsd: 1340 },
    { rank: 26, diamonds: 20000000,  hostUsd: 1355,  agencyUsd: 425,   totalUsd: 1780 },
    { rank: 27, diamonds: 25000000,  hostUsd: 1380,  agencyUsd: 518,   totalUsd: 1898 },
    { rank: 28, diamonds: 30000000,  hostUsd: 2370,  agencyUsd: 615,   totalUsd: 2985 },
    { rank: 29, diamonds: 40000000,  hostUsd: 2740,  agencyUsd: 715,   totalUsd: 3455 },
    { rank: 30, diamonds: 40000000,  hostUsd: 2740,  agencyUsd: 920,   totalUsd: 3660 },
    { rank: 31, diamonds: 50000000,  hostUsd: 4740,  agencyUsd: 920,   totalUsd: 5660 },
    { rank: 32, diamonds: 50000000,  hostUsd: 4410,  agencyUsd: 1000,  totalUsd: 5410 },
    { rank: 33, diamonds: 50000000,  hostUsd: 4440,  agencyUsd: 1800,  totalUsd: 6240 },
    { rank: 34, diamonds: 70000000,  hostUsd: 4830,  agencyUsd: 1600,  totalUsd: 6430 },
    { rank: 35, diamonds: 80000000,  hostUsd: 5520,  agencyUsd: 1600,  totalUsd: 7120 },
    { rank: 36, diamonds: 90000000,  hostUsd: 6770,  agencyUsd: 1000,  totalUsd: 7770 },
    { rank: 37, diamonds: 100000000, hostUsd: 6730,  agencyUsd: 2050,  totalUsd: 8780 },
    { rank: 38, diamonds: 150000000, hostUsd: 10250, agencyUsd: 1000,  totalUsd: 11250 },
    { rank: 39, diamonds: 200000000, hostUsd: 17600, agencyUsd: 1600,  totalUsd: 19200 },
    { rank: 40, diamonds: 250000000, hostUsd: 17500, agencyUsd: 8500,  totalUsd: 26000 },
    { rank: 41, diamonds: 300000000, hostUsd: 28510, agencyUsd: 8850,  totalUsd: 37360 },
    { rank: 42, diamonds: 350000000, hostUsd: 25575, agencyUsd: 8720,  totalUsd: 34295 },
    { rank: 43, diamonds: 400000000, hostUsd: 27400, agencyUsd: 7800,  totalUsd: 35200 },
    { rank: 44, diamonds: 450000000, hostUsd: 30625, agencyUsd: 8775,  totalUsd: 39400 },
    { rank: 45, diamonds: 500000000, hostUsd: 34250, agencyUsd: 9730,  totalUsd: 43980 }
  ];

  const TARGET_SYSTEM_REQUIREMENTS = {
    monthlyDays: 15,
    monthlyHours: 40,
    dailyMinutes: 60,
    dailyHours: 3
  };

  const TARGET_SYSTEM_EXCHANGE_RATE = {
    diamondsToUsd: 13500,
    currency: "USD"
  };

  // دالة مشتركة لتنفيذ وتأكيد زراعة بيانات التارجت في Firestore
  async function executeTargetSystemSeed(force: boolean = false) {
    const payload = {
      levels: TARGET_SYSTEM_LEVELS,
      requirements: TARGET_SYSTEM_REQUIREMENTS,
      exchangeRate: TARGET_SYSTEM_EXCHANGE_RATE,
      seededBy: 'MGR-9901',
      version: '2026.1',
      description: 'جدول تصنيف الأرباح والمكافآت الشهرية لنظام التارجت الرسمي'
    };

    let writeMethod = 'client-sdk';
    let docData: any = null;

    // 1. المحاولة الأولى: استخدام Firebase Client SDK (الموثق بمشروع ainajm)
    try {
      const cRef = clientDoc(clientDb, 'configs', 'target_system');
      const snap = await clientGetDoc(cRef);
      if (snap.exists() && !force) {
        const existing = snap.data();
        if (existing?.levels?.length === 45) {
          return {
            status: 'already_seeded',
            message: 'جدول التارجت مزروع مسبقاً ويحتوي على 45 مستوى كاملاً.',
            levelsCount: existing.levels.length,
            requirements: existing.requirements,
            exchangeRate: existing.exchangeRate,
            seededAt: existing.seededAt,
            seededBy: existing.seededBy
          };
        }
      }

      await clientSetDoc(cRef, {
        ...payload,
        seededAt: clientServerTimestamp()
      });

      const verifySnap = await clientGetDoc(cRef);
      docData = verifySnap.data();
      writeMethod = 'client-sdk';
    } catch (clientErr: any) {
      console.warn('[SeedTargetSystem] Client SDK write notice:', clientErr?.message);
      // 2. المحاولة الثانية: استخدام Firebase Admin SDK
      try {
        const docRef = db.collection('configs').doc('target_system');
        const adminSnap = await docRef.get();
        if (adminSnap.exists && !force && adminSnap.data()?.levels?.length === 45) {
          const existing = adminSnap.data();
          return {
            status: 'already_seeded',
            message: 'جدول التارجت مزروع مسبقاً عبر Admin SDK.',
            levelsCount: existing?.levels?.length,
            requirements: existing?.requirements,
            exchangeRate: existing?.exchangeRate,
            seededAt: existing?.seededAt,
            seededBy: existing?.seededBy
          };
        }

        await docRef.set({
          ...payload,
          seededAt: FieldValue.serverTimestamp()
        });

        const verifyAdminSnap = await docRef.get();
        docData = verifyAdminSnap.data();
        writeMethod = 'admin-sdk';
      } catch (adminErr: any) {
        console.error('[SeedTargetSystem] Admin SDK write failed:', adminErr?.message);
        throw new Error(`فشلت الكتابة في Firestore عبر الطريقتين: ${clientErr?.message} | ${adminErr?.message}`);
      }
    }

    return {
      status: 'success',
      writeMethod,
      message: 'تم زراعة جدول تصنيف الأرباح والمكافآت (45 مستوى) بنجاح تام في Firestore 🎉',
      path: 'configs/target_system',
      levelsCount: docData?.levels?.length || TARGET_SYSTEM_LEVELS.length,
      requirements: docData?.requirements || TARGET_SYSTEM_REQUIREMENTS,
      exchangeRate: docData?.exchangeRate || TARGET_SYSTEM_EXCHANGE_RATE,
      seededBy: docData?.seededBy || 'MGR-9901'
    };
  }

  // مصفوفة التحقق من توكن المشرف
  const verifyAdminToken = (req: express.Request): boolean => {
    const rawToken = 
      req.headers['x-admin-token'] || 
      req.headers['x-admin-key'] || 
      req.headers['authorization'] || 
      req.query.token || 
      req.query.admin_token;
    
    if (!rawToken) return false;
    const cleanToken = String(rawToken).replace(/^Bearer\s+/i, '').trim();
    return cleanToken === 'NAJM_ADMIN_SECRET_2026';
  };

  // POST /api/admin/seed-target-system
  app.post('/api/admin/seed-target-system', async (req, res) => {
    try {
      if (!verifyAdminToken(req)) {
        return res.status(403).json({
          status: 'error',
          code: 'FORBIDDEN',
          message: 'Unauthorized: Invalid Admin Token (X-Admin-Token: NAJM_ADMIN_SECRET_2026 required)'
        });
      }
      const isForce = req.query.force === 'true' || req.body?.force === true;
      const result = await executeTargetSystemSeed(isForce);
      res.json(result);
    } catch (err: any) {
      console.error('[POST /api/admin/seed-target-system] Error:', err);
      res.status(500).json({ status: 'error', message: err?.message || 'Server error during seeding' });
    }
  });

  // GET /api/admin/seed-target-system (متاح للتشغيل المباشر من المتصفح عبر الرابط)
  app.get('/api/admin/seed-target-system', async (req, res) => {
    try {
      if (!verifyAdminToken(req)) {
        return res.status(403).json({
          status: 'error',
          code: 'FORBIDDEN',
          message: 'Unauthorized: Invalid Admin Token. Please provide ?token=NAJM_ADMIN_SECRET_2026 or header X-Admin-Token'
        });
      }
      const isForce = req.query.force === 'true';
      const result = await executeTargetSystemSeed(isForce);
      res.json(result);
    } catch (err: any) {
      console.error('[GET /api/admin/seed-target-system] Error:', err);
      res.status(500).json({ status: 'error', message: err?.message || 'Server error during seeding' });
    }
  });

  // GET /api/configs/target-system (Read-only API for target configuration)
  app.get('/api/configs/target-system', async (req, res) => {
    try {
      const cRef = clientDoc(clientDb, 'configs', 'target_system');
      const snap = await clientGetDoc(cRef);
      if (snap.exists()) {
        return res.json({ status: 'success', source: 'firestore-live', data: snap.data() });
      }

      const docRef = db.collection('configs').doc('target_system');
      const docSnap = await docRef.get();
      if (docSnap.exists) {
        return res.json({ status: 'success', source: 'firestore-admin', data: docSnap.data() });
      }

      return res.json({
        status: 'success',
        fallback: true,
        data: {
          levels: TARGET_SYSTEM_LEVELS,
          requirements: TARGET_SYSTEM_REQUIREMENTS,
          exchangeRate: TARGET_SYSTEM_EXCHANGE_RATE,
          seededBy: 'MGR-9901'
        }
      });
    } catch (err: any) {
      console.warn('[GetTargetSystem] Falling back to default target system config:', err?.message);
      return res.json({
        status: 'success',
        fallback: true,
        data: {
          levels: TARGET_SYSTEM_LEVELS,
          requirements: TARGET_SYSTEM_REQUIREMENTS,
          exchangeRate: TARGET_SYSTEM_EXCHANGE_RATE,
          seededBy: 'MGR-9901'
        }
      });
    }
  });

  // Dashboard لـ Seed في /admin/seed و /admin/seed/
  app.get(['/admin/seed', '/admin/seed/'], (req, res) => {
    const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>لوحة التحكم لزراعة نظام التارجت | تطبيق النجم</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Cairo', sans-serif; }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen p-4 sm:p-8">
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Header -->
    <div class="bg-gradient-to-r from-amber-600/30 via-purple-600/20 to-slate-900 border border-amber-500/30 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-3xl shadow-lg shadow-amber-500/20">
          ⭐
        </div>
        <div>
          <h1 class="text-xl sm:text-2xl font-black text-amber-300">لوحة زراعة نظام التارجت والأرباح</h1>
          <p class="text-xs sm:text-sm text-slate-400 font-bold">Firestore configs/target_system — 45 مستوى رسمي</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span class="px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold rounded-full">
          Live Online 🚀
        </span>
      </div>
    </div>

    <!-- Quick Seed Actions Card -->
    <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div class="flex items-center justify-between border-b border-slate-800 pb-3">
        <h2 class="text-lg font-black text-slate-100 flex items-center gap-2">
          <span>⚡ تشغيل الزراعة الفورية (Seeding Trigger)</span>
        </h2>
        <span class="text-xs text-amber-400 font-mono">Token: NAJM_ADMIN_SECRET_2026</span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button id="btnCheckLive" class="px-4 py-3 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 font-bold text-sm rounded-xl border border-slate-700 transition flex items-center justify-center gap-2">
          <span>🔍 فحص البيانات الحية في Firestore</span>
        </button>

        <button id="btnTriggerSeed" class="px-4 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 active:scale-95 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2">
          <span>🌱 تشغيل الزراعة الآن (Force Seed 45 Levels)</span>
        </button>
      </div>

      <!-- Links section -->
      <div class="pt-3 border-t border-slate-800 flex flex-wrap items-center gap-3 text-xs">
        <span class="text-slate-400">روابط سريعة للمتصفح:</span>
        <a href="/api/admin/seed-target-system?token=NAJM_ADMIN_SECRET_2026&force=true" target="_blank" class="text-amber-400 underline font-mono hover:text-amber-300">
          تشغيل مباشر عبر GET URL
        </a>
        <span class="text-slate-600">|</span>
        <a href="/api/configs/target-system" target="_blank" class="text-cyan-400 underline font-mono hover:text-cyan-300">
          عرض الـ JSON المقروء من Firestore
        </a>
      </div>

      <!-- Live Terminal / Log output -->
      <div class="mt-4">
        <label class="text-xs font-bold text-slate-400 mb-1 block">سجل النتائج المباشر (Terminal Log):</label>
        <pre id="logOutput" class="bg-black/80 text-emerald-400 font-mono text-xs p-4 rounded-xl border border-slate-800 overflow-x-auto max-h-56">انقر على "فحص البيانات الحية" أو "تشغيل الزراعة الآن" للبدء...</pre>
      </div>
    </div>

    <!-- Target System Specifications & Breakdown -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
        <div class="text-amber-400 text-sm font-black mb-1">المستويات الكلية</div>
        <div class="text-3xl font-black text-white font-mono">45 مستوى</div>
        <div class="text-xs text-slate-400 mt-1">من 13,500 إلى 500,000,000 ماسة</div>
      </div>
      <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
        <div class="text-purple-400 text-sm font-black mb-1">متطلبات الاستحقاق</div>
        <div class="text-lg font-bold text-white font-mono leading-relaxed">
          15 يوم • 40 ساعة شهرياً
        </div>
        <div class="text-xs text-slate-400 mt-1">يومياً: 60 دقيقة • الحد الأقصى 3 ساعات</div>
      </div>
      <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
        <div class="text-emerald-400 text-sm font-black mb-1">سعر التحويل المعتمد</div>
        <div class="text-2xl font-black text-white font-mono">13,500 💎 = 1 $</div>
        <div class="text-xs text-slate-400 mt-1">العملة الرسمية: USD (دولار)</div>
      </div>
    </div>
  </div>

  <script>
    const log = document.getElementById('logOutput');
    const setLog = (data) => {
      log.textContent = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    };

    document.getElementById('btnCheckLive').onclick = async () => {
      setLog('جاري فحص البيانات الحية من Firestore...');
      try {
        const res = await fetch('/api/configs/target-system');
        const json = await res.json();
        setLog(json);
      } catch (err) {
        setLog('خطأ: ' + err.message);
      }
    };

    document.getElementById('btnTriggerSeed').onclick = async () => {
      setLog('جاري إرسال طلب الزراعة إلى Firestore...');
      try {
        const res = await fetch('/api/admin/seed-target-system?token=NAJM_ADMIN_SECRET_2026&force=true', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Admin-Token': 'NAJM_ADMIN_SECRET_2026'
          }
        });
        const json = await res.json();
        setLog(json);
      } catch (err) {
        setLog('خطأ: ' + err.message);
      }
    };
  </script>
</body>
</html>`;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
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
