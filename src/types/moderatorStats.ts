export type ModeratorActionType =
  | 'kick_room'
  | 'drop_mic'
  | 'mute_seat'
  | 'lock_seat'
  | 'ban_user';

export interface ModeratorActionLog {
  id: string;
  timestamp: number;
  moderatorName: string;
  moderatorAvatar?: string;
  moderatorRole: 'owner' | 'moderator' | 'admin';
  targetUserName: string;
  targetUserAvatar?: string;
  targetSeatId?: number;
  actionType: ModeratorActionType;
  actionTitle: string;
  description: string; // e.g. "المشرف عابر قام بطرد روح من الغرفة" or "المشرف عابر نزل روح من المايك #3"
  reason?: string;
}

export interface SupervisorStatsSummary {
  moderatorName: string;
  moderatorAvatar: string;
  role: 'owner' | 'moderator' | 'admin';
  totalKicks: number;
  totalMicDrops: number;
  totalMutes: number;
  totalActions: number;
  lastActive: number;
}
