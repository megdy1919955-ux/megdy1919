/**
 * RoomChatSignaling:
 * Lightweight WebSocket messaging client dedicated to in-room real-time text chat,
 * badges, bubble skins, and user presence notifications.
 * Fully decoupled from WebRTC voice streaming.
 */

export interface ChatSignalingConfig {
  roomId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  seatId?: number | null;
}

export class RoomChatSignaling {
  public myPeerId: string;
  private ws: WebSocket | null = null;
  private roomId: string;
  private userName: string;
  private userAvatar: string;
  private seatId: number | null = null;
  private isDestroyed = false;
  private reconnectTimeout: any = null;

  public onChatMessage?: (msg: any) => void;

  constructor(config: ChatSignalingConfig) {
    this.roomId = config.roomId;
    this.userName = config.userName;
    this.userAvatar = config.userAvatar;
    this.seatId = config.seatId ?? null;
    this.myPeerId = config.userId || `usr_${Math.random().toString(36).substring(2, 9)}`;
  }

  public connect(): void {
    if (this.isDestroyed) return;
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws/audio-room`;
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.sendMessage({
          type: 'join_room',
          roomId: this.roomId,
          payload: {
            peerId: this.myPeerId,
            userName: this.userName,
            userAvatar: this.userAvatar,
            seatId: this.seatId,
            isMuted: true
          }
        });
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'chat_broadcast' && data.payload) {
            this.onChatMessage?.(data.payload);
          }
        } catch {}
      };

      this.ws.onclose = () => {
        if (!this.isDestroyed) {
          this.reconnectTimeout = setTimeout(() => this.connect(), 2000);
        }
      };

      this.ws.onerror = () => {
        // Silently handled on close
      };
    } catch (e) {
      console.warn('RoomChatSignaling connection attempt:', e);
    }
  }

  public updateSeat(seatId: number | null): void {
    this.seatId = seatId;
    this.sendMessage({
      type: 'seat_update',
      roomId: this.roomId,
      payload: {
        peerId: this.myPeerId,
        seatId
      }
    });
  }

  public sendChat(text: string, badges?: any[], bubbleSkin?: string, msgId?: string): void {
    this.sendMessage({
      type: 'chat_message',
      roomId: this.roomId,
      payload: {
        id: msgId || `chat-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        senderPeerId: this.myPeerId,
        userName: this.userName,
        avatar: this.userAvatar,
        userAvatar: this.userAvatar,
        text,
        timestamp: Date.now(),
        seatId: this.seatId,
        badges,
        bubbleSkin
      }
    });
  }

  private sendMessage(msg: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(msg));
    }
  }

  public destroy(): void {
    this.isDestroyed = true;
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    if (this.ws) {
      try {
        this.ws.close();
      } catch {}
      this.ws = null;
    }
  }
}
