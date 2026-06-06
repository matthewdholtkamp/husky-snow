import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const requiredEnv = (key: keyof ImportMetaEnv): string => {
  const value = import.meta.env[key];
  if (!value) {
    console.warn(`Missing Firebase environment variable: ${key}`);
  }
  return value || '';
};

const firebaseConfig = {
  apiKey: requiredEnv('VITE_FIREBASE_API_KEY'),
  authDomain: requiredEnv('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: requiredEnv('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: requiredEnv('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: requiredEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: requiredEnv('VITE_FIREBASE_APP_ID'),
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || undefined,
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (e: unknown) {
  console.error('Fatal Error: Failed to initialize Firebase from Vite environment variables.', e);
}

export { app, auth, db };

const APP_DATA_PREFIX = 'husky-snow-rpg-data';
export const getGameCollectionPath = () => `/artifacts/${APP_DATA_PREFIX}/public/data/games`;
export const getGameDocPath = (gameId: string) => `${getGameCollectionPath()}/${gameId}`;
export const getMessagesColPath = (gameId: string) => `${getGameDocPath(gameId)}/messages`;
