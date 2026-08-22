import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App instance safely
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with robust local caching and correct firestoreDatabaseId
const dbId = (firebaseConfig as { firestoreDatabaseId?: string }).firestoreDatabaseId;

let db: ReturnType<typeof getFirestore>;
try {
  db = initializeFirestore(
    app,
    {
      experimentalAutoDetectLongPolling: true,
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager()
      })
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

export interface FirestoreErrorDetails {
  code: string;
  message: string;
  operation: OperationType;
  path: string;
}

export function handleFirestoreError(
  error: unknown,
  operation: OperationType,
  path: string
): FirestoreErrorDetails {
  const err = error as { code?: string; message?: string };
  const details: FirestoreErrorDetails = {
    code: err.code || 'unknown',
    message: err.message || 'An unexpected database error occurred',
    operation,
    path
  };

  console.error(`[Firestore Error] Operation: ${operation} on path: ${path}`, details);
  return details;
}

export { app, db, auth };
