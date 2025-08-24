import { Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Navigation } from "./components/Navigation";
import { useAuth } from "./context/AuthContext";
import { LoadingSpinner } from "./components/ui/LoadingSpinner";

// Pages
import Home from "./pages/Home";
import HomePage from "./pages/HomePage";
import CreateMeal from "./pages/CreateMeal";
import MealDetail from "./pages/MealDetail";
import LoginPage from "./pages/LoginPage";
import FoodSearch from "./pages/FoodSearch";
import FoodDetail from "./pages/FoodDetail";
import AddFood from "./pages/AddFood";
import EditMeal from "./pages/EditMeal";
import UserProfilePage from "./pages/UserProfile";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <LoadingSpinner />
        <p>Laster...</p>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <ErrorBoundary>
      <div className="app">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/meals" element={<Home />} />
            <Route path="/meal/new" element={<CreateMeal />} />
            <Route path="/meal/:mealId" element={<MealDetail />} />
            <Route path="/meal/:mealId/edit" element={<EditMeal />} />
            <Route path="/food/search" element={<FoodSearch />} />
            <Route path="/food/:foodId" element={<FoodDetail />} />
            <Route path="/food/add" element={<AddFood />} />
            <Route path="/profile" element={<UserProfilePage />} />
          </Routes>
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;
