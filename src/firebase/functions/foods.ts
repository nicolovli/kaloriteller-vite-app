// src/firebase/foods.ts
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import type { Food } from "../types";

// Opprett ny matvare
export async function createFood(food: Food) {
  const user = auth.currentUser;
  if (!user) throw new Error("Du må være innlogget");
  if (food.barcode === undefined) {
    delete food.barcode;
  }

  const ref = collection(db, "foods");
  const docRef = await addDoc(ref, {
    ...food,
    userId: user?.uid ?? null,
    favoriteBy: [],
  });
  return docRef.id;
}

// Hent alle matvarer
export async function getFoods(): Promise<(Food & { id: string })[]> {
  const ref = collection(db, "foods");
  const snapshot = await getDocs(ref);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Food),
  }));
}

// Hent én matvare
export async function getFood(foodId: string): Promise<(Food & { id: string }) | null> {
  const ref = doc(db, "foods", foodId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Food) };
}

// Oppdater matvare
export async function updateFood(foodId: string, data: Partial<Food>) {
  const ref = doc(db, "foods", foodId);
  await updateDoc(ref, data);
}

export async function getFoodByBarcode(barcode: string) {
  const q = query(collection(db, "foods"), where("barcode", "==", barcode));
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as any;
  }
  return null;
}
