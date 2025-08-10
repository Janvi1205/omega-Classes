// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD5VhK2uKi-0_OOaDpAzF_vKRTRwJCv-Zo",
  authDomain: "flipcardapp-aebc3.firebaseapp.com",
  projectId: "flipcardapp-aebc3",
  storageBucket: "flipcardapp-aebc3.firebasestorage.app",
  messagingSenderId: "532025045750",
  appId: "1:532025045750:web:e68301e4e13602d3f672d7",
  measurementId: "G-NXP657LHKZ",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
