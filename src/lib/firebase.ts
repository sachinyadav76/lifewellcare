import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyBLMgKgegfPNpTZZkI5lygsl_mzdh4D9SU",
  authDomain: "lifewellcare-21ee1.firebaseapp.com",
  projectId: "lifewellcare-21ee1",
  storageBucket: "lifewellcare-21ee1.firebasestorage.app",
  messagingSenderId: "835672595682",
  appId: "1:835672595682:web:23fdd384582950b99712bb"
};

// Initialize Firebase
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
