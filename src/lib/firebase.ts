import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, collection, addDoc, serverTimestamp, doc, getDocFromServer, disableNetwork } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, (firebaseConfig as any).firestoreDatabaseId);
export const auth = getAuth();

export { collection, addDoc, serverTimestamp };

// Error handling interface from instructions
interface FirestoreErrorInfo {
  error: string;
  operationType: 'create' | 'update' | 'delete' | 'list' | 'get' | 'write';
  path: string | null;
  authInfo: {
    userId: string;
    email: string;
    emailVerified: boolean;
    isAnonymous: boolean;
    providerInfo: { providerId: string; displayName: string; email: string; }[];
  }
}

export function handleFirestoreError(error: any, operation: FirestoreErrorInfo['operationType'], path: string | null = null) {
  const authInfo = auth.currentUser ? {
    userId: auth.currentUser.uid,
    email: auth.currentUser.email || '',
    emailVerified: auth.currentUser.emailVerified,
    isAnonymous: auth.currentUser.isAnonymous,
    providerInfo: auth.currentUser.providerData.map(p => ({
      providerId: p.providerId,
      displayName: p.displayName || '',
      email: p.email || '',
    })),
  } : {
    userId: 'unauthenticated',
    email: '',
    emailVerified: false,
    isAnonymous: true,
    providerInfo: [],
  };

  const errorInfo: FirestoreErrorInfo = {
    error: error.message || String(error),
    operationType: operation,
    path,
    authInfo,
  };

  throw new Error(JSON.stringify(errorInfo));
}

export let isFirestoreAvailable = true;

// CRITICAL CONSTRAINT: Test connection on boot with a responsive timeout
async function testConnection() {
  try {
    // 1.5-second timeout to prevent 10s hangs in offline/unprovisioned states
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Firebase connection timeout")), 1500)
    );
    await Promise.race([
      getDocFromServer(doc(db, 'test', 'connection')),
      timeoutPromise
    ]);
    console.log("[Firebase] Successfully connected to remote Firestore backend.");
  } catch (error) {
    isFirestoreAvailable = false;
    if (error instanceof Error) {
      console.warn("[Firebase] Offline or unconfigured. Continuing in graceful backup mode:", error.message);
    } else {
      console.warn("[Firebase] Offline or unconfigured. Continuing in graceful backup mode.");
    }
    // Instantly put Firebase in offline mode to prevent background 10s reach warnings/reconnections!
    try {
      await disableNetwork(db);
      console.log("[Firebase] Network disabled. Operating in fully offline/graceful mode.");
    } catch (e) {
      console.error("[Firebase] Error disabling network during boot:", e);
    }
  }
}
testConnection();
