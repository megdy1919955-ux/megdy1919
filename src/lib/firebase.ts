import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  initializeFirestore,
  memoryLocalCache
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App instance safely
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with robust memory caching to prevent any IndexedDB closing/hidden errors in iframes & background tabs
const rawDbId = (firebaseConfig as { firestoreDatabaseId?: string }).firestoreDatabaseId;
const dbId = rawDbId && rawDbId !== '(default)' ? rawDbId : undefined;

let db: ReturnType<typeof getFirestore>;
try {
  db = initializeFirestore(
    app,
    {
      experimentalAutoDetectLongPolling: true,
      localCache: memoryLocalCache()
    },
    dbId
  );
} catch (e) {
  // Fallback to getFirestore with explicit databaseId
  db = dbId ? getFirestore(app, dbId) : getFirestore(app);
}

const auth = getAuth(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write'
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): FirestoreErrorInfo {
  const err = error as { code?: string; message?: string };
  const errMessage = error instanceof Error ? error.message : String(err?.message || error);

  // If client is offline, closing, hidden or unavailable, log softly without breaking the application
  if (
    errMessage.includes('unavailable') ||
    errMessage.includes('offline') ||
    errMessage.includes('Could not reach Cloud Firestore') ||
    errMessage.includes('closing') ||
    errMessage.includes('hidden') ||
    errMessage.includes('connection is closing') ||
    err?.code === 'unavailable'
  ) {
    console.warn(`[Firestore Status] Operation: ${operationType} on path: ${path}. Operating smoothly with local state.`);
  } else {
    console.error(`[Firestore Error] Operation: ${operationType} on path: ${path}`, err);
  }

  const errInfo: FirestoreErrorInfo = {
    error: errMessage,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email
      })) || []
    },
    operationType,
    path
  };

  return errInfo;
}

export { app, db, auth };
