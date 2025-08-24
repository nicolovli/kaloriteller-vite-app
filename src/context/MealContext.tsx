import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { FoodItem } from "../firebase/types";

interface MealContextType {
  name: string;
  setName: (name: string) => void;
  foods: FoodItem[];
  setFoods: (foods: FoodItem[]) => void;
  addFood: (food: FoodItem) => void;
  resetMeal: () => void;
}

const MealContext = createContext<MealContextType | undefined>(undefined);

export function MealProvider({ children }: { children: ReactNode }) {
  const [name, setName] = useState("");
  const [foods, setFoods] = useState<FoodItem[]>([]);

  const addFood = (food: FoodItem) => {
    setFoods((prev) => [...prev, food]);
  };

  const resetMeal = () => {
    setName("");
    setFoods([]);
  };

  return (
    <MealContext.Provider value={{ name, setName, foods, setFoods, addFood, resetMeal }}>
      {children}
    </MealContext.Provider>
  );
}

export function useMeal() {
  const context = useContext(MealContext);
  if (!context) throw new Error("useMeal må brukes innenfor MealProvider");
  return context;
}
