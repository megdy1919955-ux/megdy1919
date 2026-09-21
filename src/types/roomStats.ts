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
  supporters: RoomSupporter[];
  charmReceivers: RoomCharmReceiver[];
  clubMembers: RoomClubMember[];
  updatedAt: number;
}
