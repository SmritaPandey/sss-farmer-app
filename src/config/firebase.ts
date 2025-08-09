import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, initializeAuth } from 'firebase/auth';

// TODO: Fill these with your Firebase web app credentials
export const firebaseConfig = {
  apiKey: 'AIzaSyDummy-Replace-With-Your-Actual-API-Key',
  authDomain: 'sss-farmer-app.firebaseapp.com',
  projectId: 'sss-farmer-app',
  storageBucket: 'sss-farmer-app.appspot.com',
  messagingSenderId: '123456789012',
  appId: '1:123456789012:web:abcdef1234567890abcdef',
};

const app = initializeApp(firebaseConfig);

// Initialize Auth with optional React Native persistence (works across SDK variants)
let auth: any;
try {
  let persistence: any = undefined;
  try {
    // Try to obtain getReactNativePersistence from firebase/auth (newer SDKs)
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const maybe = require('firebase/auth');
    if (typeof maybe.getReactNativePersistence === 'function') {
      persistence = maybe.getReactNativePersistence(AsyncStorage);
    }
  } catch {}
  if (!persistence) {
    try {
      // Fallback path used by older SDKs
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const rn = require('firebase/auth/react-native');
      if (typeof rn.getReactNativePersistence === 'function') {
        persistence = rn.getReactNativePersistence(AsyncStorage);
      }
    } catch {}
  }
  auth = initializeAuth(app, persistence ? { persistence } : undefined);
} catch (e) {
  // Fallback to regular auth if RN persistence isn't available
  auth = getAuth(app);
}

const db = getFirestore(app);

export { app, auth, db };
