import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Web config values are public by design (they ship in the JS bundle).
// Env vars take precedence when present (e.g. Vercel project settings);
// the inline values guarantee deploys work even if env vars are missing.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyAtXA0E1TgOPmYZ4tZqfb1E3sQWavbkxU4',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'cn-roadmap.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'cn-roadmap',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'cn-roadmap.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '268955849454',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:268955849454:web:0c249a846fc487478019ff',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-375X0KQHT1',
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()
