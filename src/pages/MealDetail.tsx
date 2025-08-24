// src/pages/MealDetail.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMeal, deleteMeal } from "../firebase/functions/meals";
import type { Meal } from "../firebase/types";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";

export default function MealDetail() {
  const { mealId } = useParams<{ mealId: string }>();
  const navigate = useNavigate();
  const [meal, setMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMeal() {
      if (!mealId) return;
      try {
        const fetchedMeal = await getMeal(mealId);
        setMeal(fetchedMeal);
      } finally {
        setLoading(false);
      }
    }
    loadMeal();
  }, [mealId]);

  const handleDelete = async () => {
    if (!meal) return;
    if (window.confirm("Er du sikker på at du vil slette dette måltidet?")) {
      await deleteMeal(meal.id!);
      navigate("/");
    }
  };

  const handleEdit = () => {
    if (!meal) return;
    navigate(`/meal/${meal.id}/edit`);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <LoadingSpinner />
        <p>Laster måltid...</p>
      </div>
    );
  }

  if (!meal) {
    return <div className="container">Fant ikke måltidet</div>;
  }

  const totalMacros = meal.foods.reduce(
    (acc, food) => ({
      kcal: acc.kcal + food.macros.kcal * (food.amount / 100),
      protein: acc.protein + food.macros.protein * (food.amount / 100),
      carbs: acc.carbs + food.macros.carbs * (food.amount / 100),
      fat: acc.fat + food.macros.fat * (food.amount / 100),
    }),
    { kcal: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return (
    <div className="container">
      <button
        className="secondary"
        onClick={() => navigate(-1)}
        style={{ marginBottom: "var(--spacing-lg)" }}>
        ← Tilbake
      </button>

      <div className="card no-hover">
        <h2 style={{ marginBottom: "var(--spacing-sm)" }}>{meal.name}</h2>
        <div
          style={{ display: "flex", gap: "var(--spacing-md)", marginBottom: "var(--spacing-md)" }}>
          <button className="secondary" onClick={handleEdit}>
            Rediger
          </button>
          <button style={{ backgroundColor: "var(--color-error)" }} onClick={handleDelete}>
            Slett
          </button>
        </div>
        <p
          style={{
            color: "var(--color-text-light)",
            fontSize: "var(--font-size-sm)",
            marginBottom: "var(--spacing-md)",
          }}>
          {new Date(meal.date).toLocaleString("no-NO", {
            dateStyle: "long",
            timeStyle: "short",
          })}
        </p>

        {/* Foods list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-sm)" }}>
          {meal.foods.map((food) => (
            <div
              key={food.foodId}
              style={{
                padding: "var(--spacing-sm)",
                backgroundColor: "var(--color-background)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
              }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "var(--spacing-xs)",
                }}>
                <span style={{ fontWeight: 500 }}>{food.name}</span>
                <span style={{ color: "var(--color-text-light)", fontSize: "var(--font-size-sm)" }}>
                  {food.amount} {food.unit}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "var(--spacing-md)",
                  fontSize: "var(--font-size-sm)",
                  color: "var(--color-text-light)",
                }}>
                <span>{Math.round(food.macros.kcal * (food.amount / 100))} kcal</span>
                <span>Protein: {Math.round(food.macros.protein * (food.amount / 100))}g</span>
                <span>Karbo: {Math.round(food.macros.carbs * (food.amount / 100))}g</span>
                <span>Fett: {Math.round(food.macros.fat * (food.amount / 100))}g</span>
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div
          style={{
            marginTop: "var(--spacing-lg)",
            paddingTop: "var(--spacing-md)",
            borderTop: "1px solid var(--color-border)",
            display: "flex",
            gap: "var(--spacing-lg)",
            alignItems: "center",
            color: "var(--color-text-light)",
            fontSize: "var(--font-size-sm)",
          }}>
          <span style={{ fontWeight: 500, color: "var(--color-text)" }}>Totalt:</span>
          <span>{Math.round(totalMacros.kcal)} kcal</span>
          <span>Protein: {Math.round(totalMacros.protein)}g</span>
          <span>Karbo: {Math.round(totalMacros.carbs)}g</span>
          <span>Fett: {Math.round(totalMacros.fat)}g</span>
        </div>
      </div>
    </div>
  );
}
