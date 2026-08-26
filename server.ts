import express from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import path from 'path';
import { createServer as createViteServer } from 'vite';

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
            broadcastToRoom(clientData.roomId, ws, {
              type: 'peer_speaking_state',
              payload: {
                peerId: clientData.peerId,
                seatId: clientData.seatId,
                isSpeaking: payload.isSpeaking,
                audioLevel: payload.audioLevel || 0
              }
            });
            break;
          }

          case 'chat_message': {
            broadcastToRoom(clientData.roomId, null, {
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
