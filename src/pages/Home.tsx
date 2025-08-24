import { useEffect, useState } from "react";
import { getMeals } from "../firebase/functions/meals";
import type { Meal } from "../firebase/types";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";

export default function Home() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadMeals() {
      try {
        const data = await getMeals();
        setMeals(data);
      } catch (err) {
        setError("Kunne ikke hente måltider");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadMeals();
  }, []);

  return (
    <div className="container">
      <div style={{ marginBottom: "var(--spacing-xl)" }}>
        <h1>Dine måltider</h1>
        <button onClick={() => navigate("/meal/new")} style={{ marginBottom: "var(--spacing-lg)" }}>
          ➕ Legg til nytt måltid
        </button>
      </div>

      {loading && (
        <div className="loading-container">
          <LoadingSpinner />
          <p>Laster måltider...</p>
        </div>
      )}

      {error && (
        <div
          style={{
            padding: "var(--spacing-md)",
            backgroundColor: "var(--color-danger)",
            color: "white",
            borderRadius: "var(--radius-md)",
            marginBottom: "var(--spacing-lg)",
          }}>
          {error}
        </div>
      )}

      {meals.length === 0 && !loading && (
        <div className="card" style={{ textAlign: "center" }}>
          <h3>Ingen måltider enda</h3>
          <p>Start med å legge til ditt første måltid!</p>
        </div>
      )}

      <div className="grid">
        {meals.map((meal) => (
          <div
            key={meal.id}
            className="card"
            onClick={() => navigate(`/meal/${meal.id}`)}
            style={{ cursor: "pointer" }}>
            <h3 style={{ marginBottom: "var(--spacing-sm)" }}>{meal.name}</h3>
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

            <div
              style={{
                display: "flex",
                gap: "var(--spacing-md)",
                fontSize: "var(--font-size-sm)",
              }}>
              <span>🍽️ {meal.foods.length} matvarer</span>
              <span>🔥 {meal.foods.reduce((sum, food) => sum + food.macros.kcal, 0)} kcal</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
