// src/pages/FoodSearch.tsx
import { useEffect, useState } from "react";
import { getFoods, getFoodByBarcode } from "../firebase/functions/foods";
import type { Food } from "../firebase/types";
import type { FoodItem } from "../firebase/types";
import { useMeal } from "../context/MealContext";
import { useNavigate, useLocation } from "react-router-dom";
import BarcodeScanner from "../components/BarcodeScanner";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";

export default function FoodSearch() {
  const [foods, setFoods] = useState<(Food & { id: string })[]>([]);
  const [search, setSearch] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const { addFood } = useMeal();
  const navigate = useNavigate();
  const location = useLocation();

  const fromMeal = location.state?.fromMeal === true;
  const returnTo = location.state?.returnTo || "/";

  const editingExistingMeal = typeof returnTo === "string" && returnTo.includes("/edit");

  useEffect(() => {
    async function loadFoods() {
      try {
        const allFoods = await getFoods();
        setFoods(allFoods);
      } catch (err) {
        console.error("Feil ved henting av matvarer:", err);
        setErrorMsg("Kunne ikke hente matvarer. Prøv igjen senere.");
      } finally {
        setLoading(false);
      }
    }

    loadFoods();
  }, []);

  const filteredFoods = foods.filter((food) =>
    food.name.toLowerCase().includes(search.toLowerCase())
  );

  const makeFoodItem = (food: Food): FoodItem => ({
    foodId: food.barcode || food.name,
    name: food.name,
    amount: 100,
    unit: "g",
    macros: food.macros,
  });

  const handleAddFood = (food: Food) => {
    if (editingExistingMeal) {
      navigate(returnTo, { state: { addFood: makeFoodItem(food) } });
    } else {
      addFood(makeFoodItem(food));
      navigate(returnTo);
    }
  };

  const handleBarcodeDetected = async (barcode: string) => {
    setShowScanner(false);
    try {
      const foundFood = await getFoodByBarcode(barcode);
      if (foundFood) {
        if (fromMeal) {
          handleAddFood(foundFood);
        } else {
          navigate(`/food/${foundFood.id}`);
        }
      } else {
        navigate("/food/add", {
          state: {
            fromMeal,
            returnTo,
            prefillBarcode: barcode,
          },
        });
      }
    } catch (err) {
      console.error("Feil ved strekkodesøk:", err);
      setErrorMsg("Noe gikk galt ved søk med strekkode.");
    }
  };

  return (
    <div className="container">
      <div style={{ marginBottom: "var(--spacing-xl)" }}>
        {fromMeal && (
          <button
            onClick={() => navigate(returnTo)}
            className="secondary"
            style={{ marginBottom: "var(--spacing-md)" }}>
            ← Tilbake til måltid
          </button>
        )}

        <h1>Søk etter matvarer</h1>

        <div
          style={{
            display: "flex",
            gap: "var(--spacing-md)",
            marginBottom: "var(--spacing-lg)",
          }}>
          <input
            type="text"
            value={search}
            placeholder="Søk etter mat..."
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1 }}
          />

          {!showScanner && (
            <button className="secondary" onClick={() => setShowScanner(true)}>
              📷 Skann
            </button>
          )}
        </div>
      </div>

      {loading && (
        <div className="loading-container">
          <LoadingSpinner />
          <p>Laster matvarer...</p>
        </div>
      )}

      {errorMsg && (
        <div
          style={{
            padding: "var(--spacing-md)",
            backgroundColor: "var(--color-danger)",
            color: "white",
            borderRadius: "var(--radius-md)",
            marginBottom: "var(--spacing-lg)",
          }}>
          {errorMsg}
        </div>
      )}

      {showScanner ? (
        <div className="card">
          <BarcodeScanner
            onDetected={handleBarcodeDetected}
            onCancel={() => setShowScanner(false)}
          />
        </div>
      ) : (
        <>
          <div className="grid">
            {filteredFoods.map((food) => (
              <div key={food.id} className="card">
                <h3 style={{ marginBottom: "var(--spacing-sm)" }}>{food.name}</h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--spacing-sm)",
                  }}>
                  <div
                    style={{
                      color: "var(--color-text-light)",
                      fontSize: "var(--font-size-sm)",
                    }}>
                    {food.macros.kcal} kcal per 100g
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "var(--spacing-md)",
                      fontSize: "var(--font-size-sm)",
                      color: "var(--color-text-light)",
                    }}>
                    <span>Protein: {food.macros.protein}g</span>
                    <span>Karbo: {food.macros.carbs}g</span>
                    <span>Fett: {food.macros.fat}g</span>
                  </div>
                  {fromMeal ? (
                    <button onClick={() => handleAddFood(food)}>Legg til</button>
                  ) : (
                    <button onClick={() => navigate(`/food/${food.id}`)}>Se detaljer</button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            style={{
              marginTop: "var(--spacing-xl)",
              width: "100%",
            }}
            onClick={() =>
              navigate("/food/add", {
                state: { fromMeal, returnTo },
              })
            }>
            ➕ Legg til matvare manuelt
          </button>
        </>
      )}
    </div>
  );
}
