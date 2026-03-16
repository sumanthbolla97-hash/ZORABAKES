import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAwzWKftZEKb33cir-YLQbSwTuI4X3wz1Q",
  authDomain: "zorabakesdb.firebaseapp.com",
  databaseURL: "https://zorabakesdb-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "zorabakesdb",
  storageBucket: "zorabakesdb.firebasestorage.app",
  messagingSenderId: "229567713462",
  appId: "1:229567713462:web:e8f7d97ac95cdd19d99617",
  measurementId: "G-Z222ZPRXE0"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Analytics only in browser environment
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out", error);
    throw error;
  }
};
