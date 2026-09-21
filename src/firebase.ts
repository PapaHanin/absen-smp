import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
} from 'firebase/firestore';
import firebaseConfigDefault from '../firebase-applet-config.json';

const env = (import.meta as any).env || {};

const activeFirebaseConfig = {
  projectId: env.VITE_FIREBASE_PROJECT_ID || firebaseConfigDefault.projectId,
  appId: env.VITE_FIREBASE_APP_ID || firebaseConfigDefault.appId,
  apiKey: env.VITE_FIREBASE_API_KEY || firebaseConfigDefault.apiKey,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfigDefault.authDomain,
  firestoreDatabaseId: env.VITE_FIRESTORE_DATABASE_ID || (firebaseConfigDefault as any).firestoreDatabaseId,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || (firebaseConfigDefault as any).storageBucket,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || (firebaseConfigDefault as any).messagingSenderId,
};

const app = getApps().length > 0 ? getApp() : initializeApp(activeFirebaseConfig);

const rawDbId = activeFirebaseConfig.firestoreDatabaseId;
const databaseId = rawDbId && typeof rawDbId === 'string' && rawDbId.trim() !== '' && rawDbId.trim() !== '(default)'
  ? rawDbId.trim()
  : undefined;

// Standard Firestore initialization using databaseId from config if custom, otherwise default database
export const db = databaseId ? getFirestore(app, databaseId) : getFirestore(app);
export const auth = getAuth(app);

// Target Database ID for e-Rapor Merdeka (fallback to active db)
export const IIHH_BERES_DATABASE_ID = activeFirebaseConfig.firestoreDatabaseId || 'ai-studio-sdinpres2ulatan-260c789b-f4cb-4e09-95cf-3d9cb1f397a3';

// Storage key for user-configured IIH Beres database for SD Inpres 2 Ulatan
const LOCAL_STORAGE_IIHH_BERES_KEY = 'absensi_ulatan_iihh_beres_db_id';

/**
 * Returns the active IIH Beres database ID for SD Inpres 2 Ulatan.
 */
export function getCustomIIHHBeresDatabaseId(): string {
  return activeFirebaseConfig.firestoreDatabaseId || IIHH_BERES_DATABASE_ID;
}

/**
 * Updates the custom IIH Beres database ID in localStorage
 */
export function setCustomIIHHBeresDatabaseId(dbId: string): void {
  // no-op fallback
}

/**
 * Returns the Firestore instance for IIH Beres, pointing safely to primary active db.
 */
export function getIIHHBeresFirestoreInstance(): any {
  return db;
}

// Proxy/getter for backwards compatibility
export const iihhBeresDb = db;

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
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

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.warn('Firestore Operation Notice: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Validates connection to Firestore server
 */
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore offline notice: client operating in offline mode.');
    }
    return false;
  }
}

