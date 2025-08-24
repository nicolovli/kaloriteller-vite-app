import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getMeal, updateMeal } from "../firebase/functions/meals";
import type { Meal, FoodItem } from "../firebase/types";

export default function EditMeal() {
  const { mealId } = useParams<{ mealId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [meal, setMeal] = useState<Meal | null>(null);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      if (!mealId) return;
      const m = await getMeal(mealId);
      if (m) {
        setMeal(m);
        setName(m.name);
        setDate(m.date.slice(0, 10));
        setFoods(m.foods);
      }
      setLoading(false);
    }
    load();
  }, [mealId]);

  // Handle food added from search
  useEffect(() => {
    const state = location.state as any;
    if (state && state.addFood) {
      setFoods((prev) => [...prev, state.addFood]);
    }
  }, [location]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealId) return;
    setSaving(true);
    await updateMeal(mealId, { name, date, foods });
    setSaving(false);
    navigate(`/meal/${mealId}`);
  };

  const handleCancel = () => {
    navigate("/");
  };

  const handleAmountChange = (idx: number, value: number) => {
    setFoods((prev) => prev.map((f, i) => (i === idx ? { ...f, amount: value } : f)));
  };

  const handleRemoveFood = (idx: number) => {
    setFoods((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAddFoodNavigate = () => {
    navigate("/food/search", {
      state: { fromMeal: true, returnTo: `/meal/${mealId}/edit` },
    });
  };

  if (loading) return <div className="container">Laster måltid...</div>;
  if (!meal) return <div className="container">Fant ikke måltidet</div>;

  return (
    <div className="container">
      <div className="card no-hover">
        <h2>Rediger måltid</h2>
        <form
          onSubmit={handleSave}
          style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Navn på måltid"
            required
          />
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          <div>
            <strong>Matvarer:</strong>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {foods.map((f, idx) => (
                <li
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--spacing-md)",
                    marginBottom: "var(--spacing-xs)",
                  }}>
                  <span style={{ minWidth: 100 }}>{f.name}</span>
                  <input
                    type="number"
                    min={0}
                    value={f.amount}
                    onChange={(e) => handleAmountChange(idx, parseFloat(e.target.value))}
                    style={{ width: 70, textAlign: "right" }}
                  />
                  <span>{f.unit}</span>
                  <button
                    type="button"
                    style={{
                      backgroundColor: "var(--color-error)",
                      color: "white",
                      border: "none",
                      borderRadius: 4,
                      padding: "2px 8px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleRemoveFood(idx)}>
                    Fjern
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="secondary"
              onClick={handleAddFoodNavigate}
              style={{ marginTop: 8 }}>
              Legg til matvare
            </button>
          </div>
          <div style={{ display: "flex", gap: "var(--spacing-md)" }}>
            <button type="submit" disabled={saving}>
              {saving ? "Lagrer..." : "Lagre endringer"}
            </button>
            <button type="button" className="secondary" onClick={handleCancel}>
              Avbryt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
