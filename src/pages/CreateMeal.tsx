// src/pages/CreateMeal.tsx
import { useState } from "react";
import { createMeal } from "../firebase/functions/meals";
import { useNavigate } from "react-router-dom";
import { useMeal } from "../context/MealContext";

function getTodayDateTime() {
  const now = new Date();
  const date = now.toISOString().split("T")[0];
  const time = now.toTimeString().slice(0, 5); // "hh:mm"
  return { date, time };
}

export default function CreateMeal() {
  const { name, setName, foods, setFoods, resetMeal } = useMeal();
  const { date: defaultDate, time: defaultTime } = getTodayDateTime();
  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState(defaultTime);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const totalMacros = foods.reduce(
    (acc, food) => ({
      kcal: acc.kcal + food.macros.kcal * (food.amount / 100),
      protein: acc.protein + food.macros.protein * (food.amount / 100),
      carbs: acc.carbs + food.macros.carbs * (food.amount / 100),
      fat: acc.fat + food.macros.fat * (food.amount / 100),
    }),
    { kcal: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const fullDate = `${date}T${time}`;
      const mealId = await createMeal({ name, date: fullDate, foods });
      resetMeal();
      navigate(`/meal/${mealId}`);
    } catch (error) {
      console.error("Feil ved lagring av måltid:", error);
      alert("Kunne ikke lagre måltid. Prøv igjen.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container no-hover">
      <div style={{ marginBottom: "var(--spacing-xl)" }}>
        <h1>Opprett nytt måltid</h1>
      </div>

      <div className="card no-hover">
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}>
          <div>
            <input
              type="text"
              placeholder="Navn på måltid"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: "var(--spacing-md)",
              marginBottom: "var(--spacing-md)",
            }}>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "var(--spacing-xs)",
                  color: "var(--color-text-light)",
                  fontSize: "var(--font-size-sm)",
                }}>
                Dato
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{ width: "100%" }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "var(--spacing-xs)",
                  color: "var(--color-text-light)",
                  fontSize: "var(--font-size-sm)",
                }}>
                Tid
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                style={{ width: "100%" }}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/food/search", {
                state: { fromMeal: true, returnTo: "/meal/new" },
              })
            }>
            Søk etter matvarer
          </button>

          {foods.length > 0 && (
            <div className="card no-hover" style={{ marginTop: "var(--spacing-md)" }}>
              <h3 style={{ marginBottom: "var(--spacing-md)" }}>Matvarer i måltidet</h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--spacing-sm)",
                }}>
                {foods.map((food, index) => (
                  <div
                    key={food.foodId}
                    style={{
                      padding: "var(--spacing-sm)",
                      backgroundColor: "var(--color-background)",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--color-border)",
                    }}>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr auto auto",
                        gap: "var(--spacing-md)",
                        alignItems: "center",
                      }}>
                      <div style={{ fontWeight: 500 }}>{food.name}</div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "var(--spacing-xs)",
                        }}>
                        <input
                          type="number"
                          value={food.amount}
                          min="0"
                          style={{
                            width: "80px",
                            textAlign: "right",
                            padding: "4px 8px",
                          }}
                          onChange={(e) => {
                            const updatedFoods = [...foods];
                            updatedFoods[index].amount = parseFloat(e.target.value);
                            setFoods(updatedFoods);
                          }}
                        />
                        <span
                          style={{
                            color: "var(--color-text-light)",
                            minWidth: "20px",
                          }}>
                          {food.unit}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          const updatedFoods = foods.filter((_, i) => i !== index);
                          setFoods(updatedFoods);
                        }}
                        style={{
                          padding: "4px 12px",
                          backgroundColor: "var(--color-error)",
                          color: "white",
                          border: "none",
                          borderRadius: "var(--radius-sm)",
                          cursor: "pointer",
                        }}>
                        Fjern
                      </button>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "var(--spacing-md)",
                        color: "var(--color-text-light)",
                        fontSize: "var(--font-size-sm)",
                        marginTop: "var(--spacing-xs)",
                      }}>
                      <span>{Math.round(food.macros.kcal * (food.amount / 100))} kcal</span>
                      <span>Protein: {Math.round(food.macros.protein * (food.amount / 100))}g</span>
                      <span>Karbo: {Math.round(food.macros.carbs * (food.amount / 100))}g</span>
                      <span>Fett: {Math.round(food.macros.fat * (food.amount / 100))}g</span>
                    </div>
                  </div>
                ))}
              </div>

              <div
                style={{
                  marginTop: "var(--spacing-lg)",
                  paddingTop: "var(--spacing-md)",
                  borderTop: "1px solid var(--color-border)",
                }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--spacing-lg)",
                    color: "var(--color-text-light)",
                  }}>
                  <span style={{ fontWeight: 500, color: "var(--color-text)" }}>
                    Totale næringsverdier:
                  </span>
                  <span>{Math.round(totalMacros.kcal)} kcal</span>
                  <span>Protein: {Math.round(totalMacros.protein)}g</span>
                  <span>Karbo: {Math.round(totalMacros.carbs)}g</span>
                  <span>Fett: {Math.round(totalMacros.fat)}g</span>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={!name || foods.length === 0 || isLoading}
            style={{ marginTop: "var(--spacing-md)" }}>
            {isLoading ? "Lagrer..." : "Lagre måltid"}
          </button>
        </form>
      </div>
    </div>
  );
}
