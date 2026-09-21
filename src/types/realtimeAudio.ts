export interface RealtimePeerAudioState {
  peerId: string;
  userName: string;
  userAvatar: string;
  seatId?: number | null;
  isSpeaking: boolean;
  isMuted: boolean;
  audioLevel: number;
}

export interface RealtimeRoomPresence {
  peerId: string;
  userName: string;
  userAvatar: string;
  seatId?: number | null;
  isMuted: boolean;
  isSpeaking: boolean;
  joinedAt: number;
}

export interface RealtimeChatMessagePayload {
  id: string;
  userName: string;
  avatar?: string;
  userAvatar: string;
  text: string;
  timestamp: number;
  userColor?: string;
  seatId?: number | null;
  badges?: any[];
  bubbleSkin?: string;
}

export interface RealtimeNetworkQuality {
  pingMs: number;
  qualityScore: 'excellent' | 'good' | 'fair' | 'poor';
  engineMode: 'zegocloud' | 'agora' | 'webrtc';
  bitrateKbps?: number;
}
