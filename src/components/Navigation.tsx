import { NavLink, useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

function SunIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}
function MoonIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ color: "var(--color-text)" }}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
    </svg>
  );
}
function HouseIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ color: "var(--color-text)" }}>
      <path d="M3 12L12 3l9 9" />
      <path d="M9 21V9h6v12" />
      <path d="M21 21H3" />
    </svg>
  );
}

export const Navigation = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const navItems = [
    { to: "/meals", label: "Måltider" },
    { to: "/meal/new", label: "Nytt måltid" },
    { to: "/food/search", label: "Matvarer" },
  ];

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        padding: "var(--spacing-md)",
        backgroundColor: "var(--color-surface)",
        borderBottom: "1px solid var(--color-border)",
      }}>
      <button
        onClick={() => {
          navigate("/");
        }}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          marginRight: "var(--spacing-xl)",
        }}
        aria-label="Gå til hjemsiden"
        title="Hjem">
        <HouseIcon />
      </button>
      <div style={{ display: "flex", gap: "var(--spacing-xl)", justifyContent: "center", flex: 1 }}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
            {item.label}
          </NavLink>
        ))}
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: "var(--spacing-md)",
        }}>
        <button
          onClick={toggleTheme}
          style={{
            background: "none",
            border: "none",
            fontSize: "1.25rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
          }}
          aria-label="Toggle theme">
          {theme === "light" ? <MoonIcon /> : <SunIcon />}
        </button>
        {user && <span>{user.displayName}</span>}
        <button
          onClick={() => auth.signOut()}
          style={{
            padding: "var(--spacing-xs) var(--spacing-sm)",
            backgroundColor: "var(--color-primary)",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "var(--radius-md)",
            cursor: "pointer",
          }}>
          Logg ut
        </button>
      </div>
    </nav>
  );
};
