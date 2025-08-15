// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyD5VhK2uKi-0_OOaDpAzF_vKRTRwJCv-Zo",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "flipcardapp-aebc3.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "flipcardapp-aebc3",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "flipcardapp-aebc3.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "532025045750",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:532025045750:web:e68301e4e13602d3f672d7",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-NXP657LHKZ",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
