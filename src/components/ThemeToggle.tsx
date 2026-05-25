import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

function apply(theme: Theme) {
  const root = document.documentElement;
  if (theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
  try { localStorage.setItem("theme", theme); } catch {}
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light");
  useEffect(() => {
    const saved = (typeof localStorage !== "undefined" && localStorage.getItem("theme")) as Theme | null;
    const initial: Theme = saved ?? "light";
    setTheme(initial);
    apply(initial);
  }, []);
  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    apply(next);
  };
  return { theme, toggle };
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggle } = useTheme();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Changer de thème"
      className={`p-2 rounded-lg hover:bg-foreground/5 transition border border-transparent hover:border-foreground/10 ${className}`}
    >
      {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}
