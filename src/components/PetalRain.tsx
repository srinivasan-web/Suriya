import { useEffect, useState } from "react";

interface Petal {
  id: number;
  left: number;
  duration: number;
  delay: number;
  size: number;
  palette: "primary" | "rose" | "gold" | "accent";
  drift: number;
}

// Map each petal to a pair of theme tokens so colors follow the active theme.
const PALETTE_STOPS: Record<Petal["palette"], [string, string]> = {
  primary: ["hsl(var(--primary-glow))", "hsl(var(--primary))"],
  rose: ["hsl(var(--rose))", "hsl(var(--primary))"],
  gold: ["hsl(var(--gold-soft))", "hsl(var(--gold))"],
  accent: ["hsl(var(--accent))", "hsl(var(--primary))"],
};

const PALETTES: Petal["palette"][] = ["primary", "rose", "gold", "accent"];

const PetalRain = ({ count = 18 }: { count?: number }) => {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    setPetals(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        duration: 12 + Math.random() * 14,
        delay: Math.random() * 20,
        size: 10 + Math.random() * 16,
        palette: PALETTES[i % PALETTES.length],
        drift: -150 + Math.random() * 300,
      })),
    );
  }, [count]);

  return (
    <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden" aria-hidden>
      {petals.map((p) => {
        const [light, deep] = PALETTE_STOPS[p.palette];
        return (
          <span
            key={p.id}
            className="absolute animate-petal-fall"
            style={{
              left: `${p.left}%`,
              top: 0,
              width: p.size,
              height: p.size * 0.8,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              ["--drift" as string]: `${p.drift}px`,
            }}
          >
            <svg viewBox="0 0 24 24" className="h-full w-full opacity-70">
              <defs>
                <radialGradient id={`petal-${p.id}`} cx="50%" cy="40%" r="60%">
                  <stop offset="0%" stopColor={light} />
                  <stop offset="100%" stopColor={deep} />
                </radialGradient>
              </defs>
              <path
                d="M12 2 C 6 8, 6 16, 12 22 C 18 16, 18 8, 12 2 Z"
                fill={`url(#petal-${p.id})`}
              />
            </svg>
          </span>
        );
      })}
    </div>
  );
};

export default PetalRain;
