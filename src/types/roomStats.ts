export interface RoomSupporter {
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

export interface RoomCharmReceiver {
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

export interface RoomClubMember {
  userId: string;
  name: string;
  avatar: string;
  joinedAt: number;
  role: 'member' | 'vip' | 'manager';
}

export interface RoomStatsData {
  roomId: string;
  totalDiamonds: number;
  supporters: RoomSupporter[]; // All-time cumulative (top 30 only)
  supporters24h: RoomSupporter[]; // Rolling 24-hour active supporters (expires per person individually)
  charmReceivers: RoomCharmReceiver[]; // All-time cumulative (top 30 only)
  charmReceivers24h: RoomCharmReceiver[]; // Rolling 24-hour active charm receivers (expires per person individually)
  clubMembers: RoomClubMember[];
  updatedAt: number;
}
