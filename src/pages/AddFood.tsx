// src/pages/AddFood.tsx
import { useState } from "react";
import { createFood } from "../firebase/functions/foods";
import type { Food } from "../firebase/types";
import { useNavigate, useLocation } from "react-router-dom";

export default function AddFood() {
  const navigate = useNavigate();
  const location = useLocation();

  const fromMeal = location.state?.fromMeal === true;
  const returnTo = location.state?.returnTo || "/";
  const prefillBarcode = location.state?.prefillBarcode || "";

  const [name, setName] = useState("");
  const [barcode, setBarcode] = useState(prefillBarcode);
  const [kcal, setKcal] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const newFood: Food = {
        foodId: crypto.randomUUID(),
        name,
        macros: {
          kcal: Number(kcal),
          protein: Number(protein),
          carbs: Number(carbs),
          fat: Number(fat),
        },
      };

      const trimmedBarcode = barcode.trim();
      if (trimmedBarcode !== "") {
        newFood.barcode = trimmedBarcode;
      }

      const foodId = await createFood(newFood);

      if (fromMeal) {
        navigate(returnTo);
      } else {
        navigate(`/food/${foodId}`);
      }
    } catch (err) {
      console.error("Feil ved lagring av matvare:", err);
      setError("Kunne ikke lagre matvaren. Sjekk feltene og prøv igjen.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", padding: "1rem" }}>
      {fromMeal && (
        <button type="button" onClick={() => navigate(returnTo)} style={{ marginBottom: "1rem" }}>
          ← Tilbake til måltid
        </button>
      )}

      <h2>Legg til ny matvare</h2>

      {error && (
        <div
          style={{
            color: "white",
            background: "#e74c3c",
            padding: "0.75rem",
            borderRadius: "5px",
            marginBottom: "1rem",
          }}>
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <input
          type="text"
          placeholder="Navn"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Strekkode (valgfritt)"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
        />

        <input
          type="number"
          placeholder="Kcal"
          value={kcal}
          onChange={(e) => setKcal(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Protein (g)"
          value={protein}
          onChange={(e) => setProtein(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Karbohydrater (g)"
          value={carbs}
          onChange={(e) => setCarbs(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Fett (g)"
          value={fat}
          onChange={(e) => setFat(e.target.value)}
          required
        />

        <button type="submit" disabled={isSaving}>
          {isSaving ? "Lagrer..." : "Lagre matvare"}
        </button>
      </form>
    </div>
  );
}
