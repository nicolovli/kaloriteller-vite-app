// src/types.ts

export interface Macros {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface FoodItem {
  foodId: string;
  name: string;
  amount: number; // Mengde i valgt enhet
  unit: string; // f.eks. "g", "ml", "stk"
  macros: Macros;
}

export interface Food extends Omit<FoodItem, "amount" | "unit"> {
  barcode?: string;
  userId?: string;
  favoriteBy?: string[];
}

export interface Meal {
  id?: string; // Firestore-dokument-ID, valgfritt
  name: string;
  userId: string;
  date: string; // f.eks. "2025-06-26"
  timestamp?: any; // Firestore Timestamp
  updatedAt?: string;
  foods: FoodItem[];
}

export interface CreateMealData extends Omit<Meal, "id" | "userId" | "timestamp" | "updatedAt"> {}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  weight?: number;
  height?: number;
  createdAt?: string;
}
