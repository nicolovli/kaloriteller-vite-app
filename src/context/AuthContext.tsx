import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import type { User } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  loginAsGuest: () => Promise<void>; // 👈 Ny funksjon
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  loginAsGuest: async () => {}, // placeholder
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);

      if (user) {
        const userRef = doc(db, "users", user.uid);
        await setDoc(
          userRef,
          {
            uid: user.uid,
            name: user.displayName || "Guest",
            email: user.email || null,
            photoURL: user.photoURL || null,
            createdAt: new Date().toISOString(),
            isAnonymous: user.isAnonymous, // 👈 nytt felt
          },
          { merge: true }
        );
      }
    });

    return () => unsub();
  }, []);

  // 👇 Fortsett som gjest-funksjon
  const loginAsGuest = async () => {
    try {
      await signInAnonymously(auth);
    } catch (error) {
      console.error("Guest login failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginAsGuest }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
