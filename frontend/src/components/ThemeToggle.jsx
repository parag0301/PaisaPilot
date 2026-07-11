import { useEffect, useState } from "react";
import "./ThemeToggle.css";

function ThemeToggle({ compact = false }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  function handleThemeChange() {
    setTheme(theme === "light" ? "dark" : "light");
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className={`theme-toggle ${compact ? "theme-toggle-compact" : ""}`}
      onClick={handleThemeChange}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span className="theme-icon">{isDark ? "☀️" : "🌙"}</span>
      {!compact && <span>{isDark ? "Light Mode" : "Dark Mode"}</span>}
    </button>
  );
}

export default ThemeToggle;