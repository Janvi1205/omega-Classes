// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Helper to clean env values that may accidentally contain quotes or commas
function cleanEnv(v: unknown): string | undefined {
  if (v == null) return undefined;
  const s = String(v).trim();
  // strip leading/trailing quotes and trailing commas
  return s.replace(/^['"]+|[,\s]*['"]+$/g, "").replace(/,+$/g, "");
}

const firebaseConfig = {
  apiKey: cleanEnv(import.meta.env.VITE_FIREBASE_API_KEY) || "",
  authDomain: cleanEnv(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN) || "",
  projectId: cleanEnv(import.meta.env.VITE_FIREBASE_PROJECT_ID) || "",
  storageBucket: cleanEnv(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET) || "",
  messagingSenderId: cleanEnv(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID) || "",
  appId: cleanEnv(import.meta.env.VITE_FIREBASE_APP_ID) || "",
  measurementId: cleanEnv(import.meta.env.VITE_FIREBASE_MEASUREMENT_ID) || "",
};

if (import.meta.env.DEV) {
  if (!firebaseConfig.apiKey) {
    console.warn("VITE_FIREBASE_API_KEY is missing or invalid. Check your .env.local (no quotes).");
  }
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
