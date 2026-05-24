import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Check, Moon, Sun, MonitorSmartphone } from "lucide-react";

type ThemeId = "ivory" | "midnight" | "rose" | "emerald" | "sapphire";
type Selection = ThemeId | "auto";

interface ThemeOption {
  id: ThemeId;
  name: string;
  tagline: string;
  isDark: boolean;
  swatch: [string, string, string];
}

const THEMES: ThemeOption[] = [
  { id: "ivory",    name: "Ivory Blush",    tagline: "Soft daylight",  isDark: false, swatch: ["hsl(340 70% 88%)", "hsl(35 70% 90%)", "hsl(38 60% 70%)"] },
  { id: "midnight", name: "Midnight Gold",  tagline: "Cinematic dark", isDark: true,  swatch: ["hsl(230 30% 12%)", "hsl(38 30% 25%)", "hsl(42 85% 65%)"] },
  { id: "rose",     name: "Rose Dusk",      tagline: "Romantic glow",  isDark: false, swatch: ["hsl(345 80% 88%)", "hsl(20 75% 85%)", "hsl(345 75% 62%)"] },
  { id: "emerald",  name: "Emerald Royal",  tagline: "Regal & fresh",  isDark: false, swatch: ["hsl(150 45% 88%)", "hsl(160 55% 50%)", "hsl(42 80% 60%)"] },
  { id: "sapphire", name: "Sapphire Night", tagline: "Starlit royal",  isDark: true,  swatch: ["hsl(220 50% 10%)", "hsl(270 50% 30%)", "hsl(200 95% 70%)"] },
];

const STORAGE_KEY = "wedding-theme";
const DARK_QUERY = "(prefers-color-scheme: dark)";

const applyTheme = (id: ThemeId) => {
  const theme = THEMES.find((t) => t.id === id) ?? THEMES[3];
  const root = document.documentElement;
  if (id === "ivory") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", id);
  root.classList.toggle("dark", theme.isDark);
};

const systemTheme = (): ThemeId =>
  typeof window !== "undefined" && window.matchMedia(DARK_QUERY).matches ? "midnight" : "ivory";

const ThemeSwitcher = () => {
  const [open, setOpen] = useState(false);
  const [selection, setSelection] = useState<Selection>("auto");

  // Initial load + listen for OS theme changes while in "auto" mode.
  useEffect(() => {
    const saved = (localStorage.getItem(STORAGE_KEY) as Selection | null) ?? "auto";
    setSelection(saved);
    applyTheme(saved === "auto" ? systemTheme() : saved);

    const mql = window.matchMedia(DARK_QUERY);
    const onChange = () => {
      const current = (localStorage.getItem(STORAGE_KEY) as Selection | null) ?? "auto";
      if (current === "auto") applyTheme(systemTheme());
    };
    // Safari < 14 fallback
    if (mql.addEventListener) mql.addEventListener("change", onChange);
    else mql.addListener(onChange);
    return () => {
      if (mql.removeEventListener) mql.removeEventListener("change", onChange);
      else mql.removeListener(onChange);
    };
  }, []);

  const select = (id: Selection) => {
    setSelection(id);
    localStorage.setItem(STORAGE_KEY, id);
    applyTheme(id === "auto" ? systemTheme() : id);
  };

  const resolvedId: ThemeId = selection === "auto" ? systemTheme() : selection;
  const activeTheme = THEMES.find((t) => t.id === resolvedId) ?? THEMES[0];

  const toggleDark = () => {
    select(activeTheme.isDark ? "ivory" : "midnight");
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 sm:bottom-8 sm:left-8">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.92 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-16 left-0 w-64 origin-bottom-left rounded-2xl border border-border/60 bg-card/85 p-3 shadow-bloom backdrop-blur-xl sm:w-72"
          >
            <div className="mb-2 flex items-center justify-between px-2 pt-1">
              <p className="font-display text-sm italic text-foreground/70">Choose your mood</p>
              <button
                onClick={toggleDark}
                aria-label="Toggle dark mode"
                className="grid h-7 w-7 place-items-center rounded-full border border-border/60 bg-secondary/60 text-foreground/80 transition-colors hover:text-primary"
              >
                {activeTheme.isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
              </button>
            </div>

            <ul className="flex flex-col gap-1">
              {/* Auto / system option */}
              <li>
                <button
                  onClick={() => select("auto")}
                  className={`group flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors ${
                    selection === "auto" ? "bg-primary/10" : "hover:bg-secondary/60"
                  }`}
                >
                  <span className="relative grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full ring-1 ring-border/60 bg-gradient-to-br from-secondary to-card">
                    <MonitorSmartphone className="h-4 w-4 text-foreground/80" />
                  </span>
                  <span className="flex flex-col">
                    <span className="font-display text-base leading-tight text-foreground">Auto</span>
                    <span className="text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
                      Follow system
                    </span>
                  </span>
                  {selection === "auto" && <Check className="ml-auto h-4 w-4 text-primary" />}
                </button>
              </li>

              {THEMES.map((t) => {
                const selected = selection === t.id;
                return (
                  <li key={t.id}>
                    <button
                      onClick={() => select(t.id)}
                      className={`group flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors ${
                        selected ? "bg-primary/10" : "hover:bg-secondary/60"
                      }`}
                    >
                      <span
                        className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full ring-1 ring-border/60"
                        style={{
                          background: `conic-gradient(from 220deg, ${t.swatch[0]}, ${t.swatch[1]}, ${t.swatch[2]}, ${t.swatch[0]})`,
                        }}
                      >
                        {selected && (
                          <span className="absolute inset-0 grid place-items-center bg-foreground/15 backdrop-blur-[1px]">
                            <Check className="h-4 w-4 text-foreground" />
                          </span>
                        )}
                      </span>
                      <span className="flex flex-col">
                        <span className="font-display text-base leading-tight text-foreground">{t.name}</span>
                        <span className="text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
                          {t.tagline}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setOpen((v) => !v)}
        aria-label="Change theme"
        className="relative grid h-12 w-12 place-items-center rounded-full border border-border/60 bg-card/80 text-foreground shadow-soft backdrop-blur-xl transition-colors hover:text-primary sm:h-14 sm:w-14"
      >
        <span
          aria-hidden
          className="absolute inset-0 -z-10 rounded-full opacity-70 blur-md"
          style={{
            background: `conic-gradient(from 0deg, ${activeTheme.swatch[0]}, ${activeTheme.swatch[1]}, ${activeTheme.swatch[2]}, ${activeTheme.swatch[0]})`,
          }}
        />
        <Palette className="h-5 w-5 sm:h-6 sm:w-6" />
      </motion.button>
    </div>
  );
};

export default ThemeSwitcher;
