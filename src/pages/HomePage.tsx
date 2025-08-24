import React, { useEffect, useState } from "react";
import { getMeals } from "../firebase/functions/meals";
import type { Meal } from "../firebase/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LabelList,
} from "recharts";
import { useNavigate } from "react-router-dom";

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

export default function HomePage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
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

  // Filter meals for selected date
  const mealsForDay = meals.filter((meal) => meal.date.startsWith(selectedDate));

  // Sum macros for the day
  const totalMacros = mealsForDay.reduce(
    (acc, meal) => {
      meal.foods.forEach((food) => {
        acc.kcal += food.macros.kcal * (food.amount / 100);
        acc.protein += food.macros.protein * (food.amount / 100);
        acc.carbs += food.macros.carbs * (food.amount / 100);
        acc.fat += food.macros.fat * (food.amount / 100);
      });
      return acc;
    },
    { kcal: 0, protein: 0, carbs: 0, fat: 0 }
  );

  // Prepare data for chart
  const chartData = [
    { name: "Kcal", value: Math.round(totalMacros.kcal) },
    { name: "Protein (g)", value: Math.round(totalMacros.protein) },
    { name: "Karbo (g)", value: Math.round(totalMacros.carbs) },
    { name: "Fett (g)", value: Math.round(totalMacros.fat) },
  ];

  return (
    <div className="container">
      <h1>Daglig oversikt</h1>
      <div style={{ marginBottom: "var(--spacing-lg)" }}>
        <label htmlFor="date">Velg dag: </label>
        <input
          id="date"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>
      {loading ? (
        <p>Laster måltider...</p>
      ) : error ? (
        <div style={{ color: "var(--color-error)" }}>{error}</div>
      ) : (
        <>
          <div style={{ width: "100%", maxWidth: 500, margin: "0 auto" }}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#3b82f6">
                  <LabelList dataKey="value" position="top" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Meals for the day */}
          <div style={{ marginTop: "var(--spacing-2xl)" }}>
            <h2>Dagens måltider</h2>
            {mealsForDay.length === 0 ? (
              <div className="card" style={{ textAlign: "center" }}>
                <h3>Ingen måltider denne dagen</h3>
                <p>Start med å legge til et måltid!</p>
              </div>
            ) : (
              <div className="grid">
                {mealsForDay.map((meal) => (
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
                      <span>
                        🔥{" "}
                        {meal.foods.reduce(
                          (sum, food) => sum + food.macros.kcal * (food.amount / 100),
                          0
                        )}{" "}
                        kcal
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
