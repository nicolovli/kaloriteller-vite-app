// src/firebase/meals.ts
import {
  addDoc,
  collection,
  serverTimestamp,
  query,
  where,
  orderBy,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import type { CreateMealData } from "../types";

export async function createMeal(data: CreateMealData): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error("Du må være innlogget for å lagre måltid.");

  // Hvis ingen dato er gitt, bruk i dag:
  const date = data.date ?? new Date().toISOString().split("T")[0];

  const mealDoc = {
    userId: user.uid,
    name: data.name,
    date,
    timestamp: serverTimestamp(),
    foods: data.foods,
  };

  const ref = await addDoc(collection(db, "meals"), mealDoc);
  return ref.id; // returns new mealId
}

export async function getMeals(): Promise<Meal[]> {
  const user = auth.currentUser;
  if (!user) throw new Error("Bruker er ikke innlogget.");

  const q = query(
    collection(db, "meals"),
    where("userId", "==", user.uid),
    orderBy("date", "desc")
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      userId: data.userId,
      date: data.date,
      timestamp: data.timestamp,
      updatedAt: data.updatedAt,
      foods: data.foods,
    };
  });
}

import { getDoc } from "firebase/firestore";
import type { Meal } from "../types";

export async function getMeal(mealId: string): Promise<Meal | null> {
  const ref = doc(db, "meals", mealId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;

  return {
    id: snap.id,
    ...(snap.data() as Omit<Meal, "id">),
  };
}

export async function updateMeal(mealId: string, data: Partial<CreateMealData>) {
  const user = auth.currentUser;
  if (!user) throw new Error("Bruker er ikke innlogget.");

  const ref = doc(db, "meals", mealId);
  await updateDoc(ref, {
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteMeal(mealId: string) {
  const user = auth.currentUser;
  if (!user) throw new Error("Bruker er ikke innlogget.");
  const ref = doc(db, "meals", mealId);
  await deleteDoc(ref);
}
