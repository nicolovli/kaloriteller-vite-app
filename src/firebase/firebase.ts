import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCA51639pQ8860OykJyEO7m_S2oj56uEZM",
  authDomain: "makroteller.firebaseapp.com",
  projectId: "makroteller",
  storageBucket: "makroteller.firebasestorage.app",
  messagingSenderId: "138469209744",
  appId: "1:138469209744:web:9c656efed1b98d2ebfca15",
  measurementId: "G-WL5YBK105S",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider();

export const signInWithGoogle = () => signInWithPopup(auth, provider);
