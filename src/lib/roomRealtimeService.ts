/**
 * Real-time Room Sync Service via Firebase Firestore
 * Provides global real-time synchronization between all mobile devices:
 * - Live Chat Messages (instant sync across phones)
 * - Mic Seats & Presence (who sits where, speaking animation)
 * - Synchronized Cinema Video (Watch Together in real-time)
 * - WebRTC Audio Signaling (real voice streaming between devices)
 * - Room Gifts & Reactions
 */

import {
  collection,
  doc,
  setDoc,
  addDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  serverTimestamp,
  getDocs,
  where
} from 'firebase/firestore';
import { db } from './firebase';
import { ChatMessage } from '../components/room/roomTypes';
import { CinemaVideoItem } from '../components/CinemaYouTubePickerModal';

export interface RealtimeSeatData {
  id: number;
  userId?: string;
  userName: string;
  avatar?: string;
  vipLevel?: string | number;
  isHost?: boolean;
  isMuted?: boolean;
  isSpeaking?: boolean;
  audioLevel?: number;
  isEmpty: boolean;
  isLocked?: boolean;
  peerId?: string;
  cameraEnabled?: boolean;
  updatedAt: number;
}

export interface RealtimeCinemaState {
  videoId?: string;
  youtubeId?: string;
  title?: string;
  author?: string;
  thumbnail?: string;
  isPlaying: boolean;
  currentTime?: number;
  updatedBy?: string;
  updatedAt: number;
}

export interface RealtimeSignalPacket {
  id?: string;
  fromPeerId: string;
  toPeerId: string;
  type: 'offer' | 'answer' | 'ice-candidate';
  payload: string; // JSON string
  timestamp: number;
}

export interface RealtimeRoomEvent {
  id?: string;
  type: 'gift' | 'reaction' | 'entrance';
  senderName: string;
  senderAvatar?: string;
  targetName?: string;
  content: string;
  metadata?: any;
  timestamp: number;
}

// 1. REAL-TIME CHAT MESSAGES
export function subscribeToRoomMessages(
  roomId: string,
  onMessages: (messages: ChatMessage[]) => void
): () => void {
  try {
    const messagesRef = collection(db, 'rooms', roomId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'), limit(100));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const msgs: ChatMessage[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          msgs.push({
            id: docSnap.id,
            userName: data.userName || 'مستخدم',
            avatar: data.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
            text: data.text || '',
            userColor: data.userColor || 'text-amber-300 font-bold',
            bubbleSkin: data.bubbleSkin || 'default',
            isHost: Boolean(data.isHost),
            heartLevel: data.heartLevel,
            crownLevel: data.crownLevel,
            vipLevel: data.vipLevel || 'VIP5',
            replyTo: data.replyTo,
            badges: data.badges
          });
        });
        onMessages(msgs);
      },
      (error) => {
        console.warn('Firestore room messages listener error:', error);
      }
    );

    return unsubscribe;
  } catch (err) {
    console.error('Failed to subscribe to room messages:', err);
    return () => {};
  }
}

export async function sendRoomChatMessage(
  roomId: string,
  message: {
    userId: string;
    userName: string;
    avatar: string;
    text: string;
    userColor?: string;
    bubbleSkin?: string;
    isHost?: boolean;
    vipLevel?: string | number;
    replyTo?: { id: string; userName: string; text: string };
    badges?: any[];
  }
): Promise<void> {
  try {
    const messagesRef = collection(db, 'rooms', roomId, 'messages');
    await addDoc(messagesRef, {
      ...message,
      roomId,
      timestamp: Date.now()
    });
  } catch (err) {
    console.error('Failed to send room chat message to Firestore:', err);
  }
}

// 2. REAL-TIME MIC SEATS
export function subscribeToRoomSeats(
  roomId: string,
  onSeatsUpdate: (seats: Record<number, RealtimeSeatData>) => void
): () => void {
  try {
    const seatsRef = collection(db, 'rooms', roomId, 'seats');
    const unsubscribe = onSnapshot(
      seatsRef,
      (snapshot) => {
        const seatsMap: Record<number, RealtimeSeatData> = {};
        snapshot.forEach((docSnap) => {
          const seatId = parseInt(docSnap.id, 10);
          if (!isNaN(seatId)) {
            seatsMap[seatId] = docSnap.data() as RealtimeSeatData;
          }
        });
        onSeatsUpdate(seatsMap);
      },
      (error) => {
        console.warn('Firestore room seats listener error:', error);
      }
    );

    return unsubscribe;
  } catch (err) {
    console.error('Failed to subscribe to room seats:', err);
    return () => {};
  }
}

export async function updateRoomSeatInFirestore(
  roomId: string,
  seatId: number,
  seatData: Partial<RealtimeSeatData>
): Promise<void> {
  try {
    const seatDocRef = doc(db, 'rooms', roomId, 'seats', seatId.toString());
    await setDoc(
      seatDocRef,
      {
        ...seatData,
        id: seatId,
        updatedAt: Date.now()
      },
      { merge: true }
    );
  } catch (err) {
    console.error(`Failed to update seat ${seatId} in Firestore:`, err);
  }
}

export async function vacateRoomSeatInFirestore(
  roomId: string,
  seatId: number
): Promise<void> {
  try {
    const seatDocRef = doc(db, 'rooms', roomId, 'seats', seatId.toString());
    await setDoc(seatDocRef, {
      id: seatId,
      isEmpty: true,
      userId: '',
      userName: '',
      avatar: '',
      isMuted: true,
      isSpeaking: false,
      cameraEnabled: false,
      updatedAt: Date.now()
    });
  } catch (err) {
    console.error(`Failed to vacate seat ${seatId}:`, err);
  }
}

// 3. REAL-TIME SYNCHRONIZED CINEMA / VIDEO WATCH TOGETHER
export function subscribeToRoomCinema(
  roomId: string,
  onCinemaChange: (cinema: RealtimeCinemaState | null) => void
): () => void {
  try {
    const cinemaDocRef = doc(db, 'rooms', roomId, 'cinema', 'current');
    const unsubscribe = onSnapshot(
      cinemaDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          onCinemaChange(docSnap.data() as RealtimeCinemaState);
        } else {
          onCinemaChange(null);
        }
      },
      (error) => {
        console.warn('Firestore cinema listener error:', error);
      }
    );

    return unsubscribe;
  } catch (err) {
    console.error('Failed to subscribe to room cinema:', err);
    return () => {};
  }
}

export async function updateRoomCinemaInFirestore(
  roomId: string,
  cinemaState: RealtimeCinemaState | null
): Promise<void> {
  try {
    const cinemaDocRef = doc(db, 'rooms', roomId, 'cinema', 'current');
    if (!cinemaState) {
      await deleteDoc(cinemaDocRef);
    } else {
      await setDoc(cinemaDocRef, {
        ...cinemaState,
        updatedAt: Date.now()
      });
    }
  } catch (err) {
    console.error('Failed to update room cinema in Firestore:', err);
  }
}

// 4. REAL-TIME WEBRTC AUDIO & VIDEO SIGNALING
export function subscribeToRoomSignals(
  roomId: string,
  myPeerId: string,
  onSignal: (signal: RealtimeSignalPacket) => void
): () => void {
  try {
    const signalsRef = collection(db, 'rooms', roomId, 'signals');
    const q = query(
      signalsRef,
      where('toPeerId', '==', myPeerId),
      orderBy('timestamp', 'asc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const data = change.doc.data() as RealtimeSignalPacket;
            onSignal({ ...data, id: change.doc.id });
            // Clean up consumed signal after processing to keep collection lightweight
            deleteDoc(change.doc.ref).catch(() => {});
          }
        });
      },
      (error) => {
        console.warn('Firestore WebRTC signals listener error:', error);
      }
    );

    return unsubscribe;
  } catch (err) {
    console.error('Failed to subscribe to WebRTC signals:', err);
    return () => {};
  }
}

export async function sendRoomSignalInFirestore(
  roomId: string,
  signal: RealtimeSignalPacket
): Promise<void> {
  try {
    const signalsRef = collection(db, 'rooms', roomId, 'signals');
    await addDoc(signalsRef, {
      ...signal,
      timestamp: Date.now()
    });
  } catch (err) {
    console.error('Failed to send WebRTC signal to Firestore:', err);
  }
}

// 5. REAL-TIME ROOM EVENTS (GIFTS, REACTIONS, ENTRANCE)
export function subscribeToRoomEvents(
  roomId: string,
  onEvent: (event: RealtimeRoomEvent) => void
): () => void {
  try {
    const eventsRef = collection(db, 'rooms', roomId, 'events');
    const minTimestamp = Date.now() - 10000;
    const q = query(
      eventsRef,
      where('timestamp', '>=', minTimestamp),
      orderBy('timestamp', 'asc'),
      limit(20)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            onEvent(change.doc.data() as RealtimeRoomEvent);
          }
        });
      },
      (error) => {
        console.warn('Firestore room events listener error:', error);
      }
    );

    return unsubscribe;
  } catch (err) {
    console.error('Failed to subscribe to room events:', err);
    return () => {};
  }
}

export async function sendRoomEventToFirestore(
  roomId: string,
  event: RealtimeRoomEvent
): Promise<void> {
  try {
    const eventsRef = collection(db, 'rooms', roomId, 'events');
    await addDoc(eventsRef, {
      ...event,
      timestamp: Date.now()
    });
  } catch (err) {
    console.error('Failed to send room event to Firestore:', err);
  }
}
