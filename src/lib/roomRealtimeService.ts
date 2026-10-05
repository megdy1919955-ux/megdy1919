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
  where,
  writeBatch,
  updateDoc
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, IS_CLOUD_SYNC_DISABLED } from './firebase';
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
  type: 'gift' | 'reaction' | 'entrance' | 'room_dissolved' | 'vip_announcement';
  senderId?: string;
  senderName: string;
  senderAvatar?: string;
  targetName?: string;
  content: string;
  metadata?: any;
  timestamp: number;
}

/**
 * Recursively sanitize objects to remove `undefined` fields before sending to Firestore.
 * Prevents: "FirebaseError: Function addDoc() called with invalid data. Unsupported field value: undefined"
 */
export function sanitizeFirestoreData<T extends Record<string, any>>(data: T): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        result[key] = sanitizeFirestoreData(value);
      } else if (Array.isArray(value)) {
        result[key] = value.map((item) =>
          item !== null && typeof item === 'object' ? sanitizeFirestoreData(item) : item
        );
      } else {
        result[key] = value;
      }
    }
  }
  return result;
}

// 1. REAL-TIME CHAT MESSAGES
export function subscribeToRoomMessages(
  roomId: string,
  onMessages: (messages: ChatMessage[]) => void,
  sinceTimestamp?: number
): () => void {
  const safeRoomId = roomId || 'default-room';
  const joinTimestamp = sinceTimestamp ?? Date.now();
  if (IS_CLOUD_SYNC_DISABLED) {
    if (typeof window === 'undefined') return () => {};
    const handleLocalMsg = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.message && customEvent.detail?.roomId === safeRoomId) {
        onMessages([customEvent.detail.message]);
      }
    };
    window.addEventListener('local_room_chat_message', handleLocalMsg);
    return () => window.removeEventListener('local_room_chat_message', handleLocalMsg);
  }

  const path = `rooms/${safeRoomId}/messages`;
  try {
    const messagesRef = collection(db, 'rooms', safeRoomId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'), limit(100));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const msgs: ChatMessage[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          const msgTimestamp = typeof data.timestamp === 'number' ? data.timestamp : 0;
          // Filter to only include messages sent from the user's entry timestamp onwards
          if (msgTimestamp >= joinTimestamp) {
            msgs.push({
              id: data.msgId || docSnap.id,
              userId: data.userId,
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
          }
        });
        onMessages(msgs);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      }
    );

    return unsubscribe;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
    return () => {};
  }
}

export async function sendRoomChatMessage(
  roomId: string,
  message: {
    msgId?: string;
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
  const safeRoomId = roomId || 'default-room';
  if (IS_CLOUD_SYNC_DISABLED) {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('local_room_chat_message', {
          detail: {
            roomId: safeRoomId,
            message: {
              ...message,
              id: message.msgId || `local-msg-${Date.now()}`
            }
          }
        })
      );
    }
    return;
  }

  const path = `rooms/${safeRoomId}/messages`;
  try {
    const messagesRef = collection(db, 'rooms', safeRoomId, 'messages');
    const cleanData = sanitizeFirestoreData({
      ...message,
      roomId: safeRoomId,
      timestamp: Date.now()
    });
    await addDoc(messagesRef, cleanData);
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }
}

// 2. REAL-TIME MIC SEATS
export function subscribeToRoomSeats(
  roomId: string,
  onSeatsUpdate: (seats: Record<number, RealtimeSeatData>) => void
): () => void {
  const safeRoomId = roomId || 'default-room';
  if (IS_CLOUD_SYNC_DISABLED) {
    if (typeof window === 'undefined') return () => {};
    const handleLocalSeats = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.seats && customEvent.detail?.roomId === safeRoomId) {
        onSeatsUpdate(customEvent.detail.seats);
      }
    };
    window.addEventListener('local_room_seats_update', handleLocalSeats);
    return () => window.removeEventListener('local_room_seats_update', handleLocalSeats);
  }

  const path = `rooms/${safeRoomId}/seats`;
  try {
    const seatsRef = collection(db, 'rooms', safeRoomId, 'seats');
    const unsubscribe = onSnapshot(
      seatsRef,
      (snapshot) => {
        const seatsMap: Record<number, RealtimeSeatData> = {};
        snapshot.forEach((docSnap) => {
          const cleanId = docSnap.id.replace(/^seat_/, '');
          const seatId = parseInt(cleanId, 10);
          if (!isNaN(seatId)) {
            seatsMap[seatId] = docSnap.data() as RealtimeSeatData;
          }
        });
        onSeatsUpdate(seatsMap);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      }
    );

    return unsubscribe;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
    return () => {};
  }
}

export async function updateRoomSeatInFirestore(
  roomId: string,
  seatId: number,
  seatData: Partial<RealtimeSeatData>
): Promise<void> {
  const safeRoomId = roomId || 'default-room';
  if (IS_CLOUD_SYNC_DISABLED) {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('local_room_seats_update', {
          detail: {
            roomId: safeRoomId,
            seats: {
              [seatId]: {
                ...seatData,
                id: seatId,
                updatedAt: Date.now()
              } as RealtimeSeatData
            }
          }
        })
      );
    }
    return;
  }

  const path = `rooms/${safeRoomId}/seats/${seatId}`;
  try {
    const seatDocRef = doc(db, 'rooms', safeRoomId, 'seats', seatId.toString());
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
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

/**
 * Toggle seat mute in Firestore - updates only the isMuted field without rewriting entire user data
 */
export const toggleSeatMuteInFirestore = async (
  roomId: string,
  seatId: number,
  isMuted: boolean
): Promise<void> => {
  const safeRoomId = roomId || 'default-room';
  if (IS_CLOUD_SYNC_DISABLED) {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('local_room_seats_update', {
          detail: {
            roomId: safeRoomId,
            seats: {
              [seatId]: {
                id: seatId,
                isMuted: isMuted,
                updatedAt: Date.now()
              }
            }
          }
        })
      );
    }
    return;
  }

  const path = `rooms/${safeRoomId}/seats/seat_${seatId}`;
  try {
    const seatRef = doc(db, `rooms/${safeRoomId}/seats`, `seat_${seatId}`);
    // تحديث حقل الكتم فقط بدون إعادة كتابة بيانات المستخدم كاملة
    try {
      await updateDoc(seatRef, {
        isMuted: isMuted
      });
    } catch {
      const altRef = doc(db, 'rooms', safeRoomId, 'seats', seatId.toString());
      try {
        await updateDoc(altRef, {
          isMuted: isMuted
        });
      } catch {
        await setDoc(seatRef, { isMuted: isMuted, updatedAt: Date.now() }, { merge: true });
      }
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
};

export async function vacateRoomSeatInFirestore(
  roomId: string,
  seatId: number
): Promise<void> {
  const safeRoomId = roomId || 'default-room';
  if (IS_CLOUD_SYNC_DISABLED) {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('local_room_seats_update', {
          detail: {
            roomId: safeRoomId,
            seats: {
              [seatId]: {
                id: seatId,
                isEmpty: true,
                userId: '',
                userName: '',
                avatar: '',
                isMuted: true,
                isSpeaking: false,
                cameraEnabled: false,
                updatedAt: Date.now()
              } as RealtimeSeatData
            }
          }
        })
      );
    }
    return;
  }

  const path = `rooms/${safeRoomId}/seats/${seatId}`;
  try {
    const emptySeatPayload: RealtimeSeatData = {
      id: seatId,
      isEmpty: true,
      userId: '',
      userName: '',
      avatar: '',
      isMuted: true,
      isSpeaking: false,
      cameraEnabled: false,
      updatedAt: Date.now()
    };
    const seatDocRef = doc(db, 'rooms', safeRoomId, 'seats', seatId.toString());
    const altSeatDocRef = doc(db, 'rooms', safeRoomId, 'seats', `seat_${seatId}`);
    await Promise.allSettled([
      setDoc(seatDocRef, emptySeatPayload),
      setDoc(altSeatDocRef, emptySeatPayload)
    ]);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

/**
 * Switch a user from currentSeatId to newSeatId in a single batch/atomic operation
 */
export async function switchRoomSeatInFirestore(
  roomId: string,
  currentSeatId: number,
  newSeatId: number,
  userData?: Partial<RealtimeSeatData>
): Promise<void> {
  const safeRoomId = roomId || 'default-room';
  if (IS_CLOUD_SYNC_DISABLED) {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('local_room_seats_update', {
          detail: {
            roomId: safeRoomId,
            seats: {
              [currentSeatId]: {
                id: currentSeatId,
                isEmpty: true,
                userId: '',
                userName: '',
                avatar: '',
                isMuted: true,
                isSpeaking: false,
                cameraEnabled: false,
                updatedAt: Date.now()
              } as RealtimeSeatData,
              [newSeatId]: {
                id: newSeatId,
                isEmpty: false,
                ...userData,
                updatedAt: Date.now()
              } as RealtimeSeatData
            }
          }
        })
      );
    }
    return;
  }

  const path = `rooms/${safeRoomId}/seats`;
  try {
    const batch = writeBatch(db);
    const oldSeatDocRef = doc(db, 'rooms', safeRoomId, 'seats', currentSeatId.toString());
    const altOldSeatDocRef = doc(db, 'rooms', safeRoomId, 'seats', `seat_${currentSeatId}`);
    const newSeatDocRef = doc(db, 'rooms', safeRoomId, 'seats', newSeatId.toString());

    const emptyOldPayload = {
      id: currentSeatId,
      isEmpty: true,
      userId: '',
      userName: '',
      avatar: '',
      isMuted: true,
      isSpeaking: false,
      cameraEnabled: false,
      updatedAt: Date.now()
    };

    batch.set(oldSeatDocRef, emptyOldPayload, { merge: true });
    batch.set(altOldSeatDocRef, emptyOldPayload, { merge: true });

    batch.set(
      newSeatDocRef,
      {
        id: newSeatId,
        isEmpty: false,
        ...userData,
        updatedAt: Date.now()
      },
      { merge: true }
    );

    await batch.commit();
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

// 3. REAL-TIME SYNCHRONIZED CINEMA / VIDEO WATCH TOGETHER
export function subscribeToRoomCinema(
  roomId: string,
  onCinemaChange: (cinema: RealtimeCinemaState | null) => void
): () => void {
  if (IS_CLOUD_SYNC_DISABLED) {
    if (typeof window === 'undefined') return () => {};
    const handleLocalCinema = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.roomId === roomId) {
        onCinemaChange(customEvent.detail.cinema ?? null);
      }
    };
    window.addEventListener('local_room_cinema_update', handleLocalCinema);
    return () => window.removeEventListener('local_room_cinema_update', handleLocalCinema);
  }

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
        handleFirestoreError(error, OperationType.GET, `rooms/${roomId || 'default-room'}/cinema/current`);
      }
    );

    return unsubscribe;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, `rooms/${roomId || 'default-room'}/cinema/current`);
    return () => {};
  }
}

export async function updateRoomCinemaInFirestore(
  roomId: string,
  cinemaState: RealtimeCinemaState | null
): Promise<void> {
  const safeRoomId = roomId || 'default-room';
  if (IS_CLOUD_SYNC_DISABLED) {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('local_room_cinema_update', {
          detail: {
            roomId: safeRoomId,
            cinema: cinemaState
          }
        })
      );
    }
    return;
  }
  const path = `rooms/${safeRoomId}/cinema/current`;
  try {
    const cinemaDocRef = doc(db, 'rooms', safeRoomId, 'cinema', 'current');
    if (!cinemaState) {
      await deleteDoc(cinemaDocRef);
    } else {
      await setDoc(cinemaDocRef, {
        ...cinemaState,
        updatedAt: Date.now()
      });
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

// 4. REAL-TIME WEBRTC AUDIO & VIDEO SIGNALING
export function subscribeToRoomSignals(
  roomId: string,
  myPeerId: string,
  onSignal: (signal: RealtimeSignalPacket) => void
): () => void {
  if (IS_CLOUD_SYNC_DISABLED) {
    return () => {};
  }

  const safeRoomId = roomId || 'default-room';
  const path = `rooms/${safeRoomId}/signals`;
  try {
    const signalsRef = collection(db, 'rooms', safeRoomId, 'signals');
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
        handleFirestoreError(error, OperationType.GET, path);
      }
    );

    return unsubscribe;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
    return () => {};
  }
}

export async function sendRoomSignalInFirestore(
  roomId: string,
  signal: RealtimeSignalPacket
): Promise<void> {
  if (IS_CLOUD_SYNC_DISABLED) {
    return;
  }

  const safeRoomId = roomId || 'default-room';
  const path = `rooms/${safeRoomId}/signals`;
  try {
    const signalsRef = collection(db, 'rooms', safeRoomId, 'signals');
    await addDoc(signalsRef, {
      ...signal,
      timestamp: Date.now()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }
}

// 5. REAL-TIME ROOM EVENTS (GIFTS, REACTIONS, ENTRANCE)
export function subscribeToRoomEvents(
  roomId: string,
  onEvent: (event: RealtimeRoomEvent) => void
): () => void {
  const safeRoomId = roomId || 'default-room';
  if (IS_CLOUD_SYNC_DISABLED) {
    if (typeof window === 'undefined') return () => {};
    const handleLocalEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.event && customEvent.detail?.roomId === safeRoomId) {
        onEvent(customEvent.detail.event);
      }
    };
    window.addEventListener('local_room_event', handleLocalEvent);
    return () => window.removeEventListener('local_room_event', handleLocalEvent);
  }

  const path = `rooms/${safeRoomId}/events`;
  try {
    const eventsRef = collection(db, 'rooms', safeRoomId, 'events');
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
        handleFirestoreError(error, OperationType.GET, path);
      }
    );

    return unsubscribe;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
    return () => {};
  }
}

export async function sendRoomEventToFirestore(
  roomId: string,
  event: RealtimeRoomEvent
): Promise<void> {
  const safeRoomId = roomId || 'default-room';
  if (IS_CLOUD_SYNC_DISABLED) {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('local_room_event', {
          detail: {
            roomId: safeRoomId,
            event: {
              ...event,
              id: `local-evt-${Date.now()}`
            }
          }
        })
      );
    }
    return;
  }

  const path = `rooms/${safeRoomId}/events`;
  try {
    const eventsRef = collection(db, 'rooms', safeRoomId, 'events');
    const cleanData = sanitizeFirestoreData({
      ...event,
      timestamp: event.timestamp || Date.now()
    });
    await addDoc(eventsRef, cleanData);
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }
}
