import { db, auth } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import type { UserProfile } from "../types";

export async function getUserProfile(): Promise<UserProfile | null> {
  const user = auth.currentUser;
  if (!user) return null;
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return snap.data() as UserProfile;
}

export async function updateUserProfile(data: Partial<UserProfile>) {
  const user = auth.currentUser;
  if (!user) throw new Error("Bruker er ikke innlogget.");
  const ref = doc(db, "users", user.uid);
  await updateDoc(ref, data);
}
