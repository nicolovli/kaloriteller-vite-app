// src/pages/FoodDetail.tsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Food } from "../firebase/types";
import { getFood } from "../firebase/functions/foods";

export default function FoodDetail() {
  const { foodId } = useParams<{ foodId: string }>();
  const [food, setFood] = useState<(Food & { id: string }) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFood() {
      if (!foodId) return;
      try {
        const foodData = await getFood(foodId);
        setFood(foodData);
      } catch (error) {
        console.error("Error fetching food:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchFood();
  }, [foodId]);

  if (loading) {
    return <div className="container">Laster matvare...</div>;
  }
  if (!food) {
    return <div className="container">Fant ikke matvaren</div>;
  }

  return (
    <div className="container">
      <div className="card">
        <h2 style={{ marginBottom: "var(--spacing-lg)" }}>{food.name}</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "var(--spacing-lg)",
            marginBottom: "var(--spacing-xl)",
          }}>
          <div className="stat-card">
            <div className="stat-value">{Math.round(food.macros.kcal)}</div>
            <div className="stat-label">Kalorier per 100g</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{Math.round(food.macros.protein)}g</div>
            <div className="stat-label">Protein per 100g</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{Math.round(food.macros.carbs)}g</div>
            <div className="stat-label">Karbohydrater per 100g</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{Math.round(food.macros.fat)}g</div>
            <div className="stat-label">Fett per 100g</div>
          </div>
        </div>

        {food.barcode && (
          <div
            style={{
              marginTop: "var(--spacing-xl)",
              padding: "var(--spacing-md)",
              backgroundColor: "var(--color-background)",
              borderRadius: "var(--radius-md)",
              color: "var(--color-text-light)",
              fontSize: "var(--font-size-sm)",
            }}>
            <div>Strekkode: {food.barcode}</div>
          </div>
        )}
      </div>
    </div>
  );
}
