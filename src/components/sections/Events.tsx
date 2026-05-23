import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useReducedMotion, useMotionValue, useMotionValueEvent, MotionValue } from "framer-motion";
import OrnamentalDivider from "../OrnamentalDivider";
import { useIsMobile } from "@/hooks/use-mobile";
import coupleImg from "@/assets/couple-walking.png";
import { CalendarDays, Clock, MapPin, Sparkles } from "lucide-react";

type EventCard = {
  name: string;
  tagline: string;
  date: string;
  time: string;
  venue: string;
  icon: string;
  accent: string;
};

const engagement: EventCard = {
  name: "Engagement",
  tagline: "where the promise began",
  date: "Feb 12, 2026",
  time: "6:00 PM onwards",
  venue: "The Lotus Garden",
  icon: "💍",
  accent: "from-primary/40 via-rose/30 to-gold-soft/30",
};

const marriage: EventCard = {
  name: "Marriage",
  tagline: "two souls, one forever",
  date: "Jun 17, 2026",
  time: "10:00 AM onwards",
  venue: "Arulmigu Pazhaniandavar Thirukovil",
  icon: "🔥",
  accent: "from-gold/50 via-rose/40 to-primary/40",
};

// Lightweight device-capability detector.
// Returns a "tier" used to scale particle counts, blurs and effect layers.
const useDeviceTier = () => {
  const [tier, setTier] = useState<"low" | "mid" | "high">("high");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const nav = navigator as Navigator & {
      deviceMemory?: number;
      connection?: { saveData?: boolean; effectiveType?: string };
    };
    const cores = nav.hardwareConcurrency ?? 4;
    const memory = nav.deviceMemory ?? 4;
    const saveData = nav.connection?.saveData ?? false;
    const slowNet = /(^|-)2g$/.test(nav.connection?.effectiveType ?? "");
    const small = window.innerWidth < 640;

    if (saveData || slowNet || cores <= 2 || memory <= 2) setTier("low");
    else if (small || cores <= 4 || memory <= 4) setTier("mid");
    else setTier("high");
  }, []);

  return tier;
};

const StoryCard = ({
  data,
  side,
  progress,
  spotlight,
  reveal,
  spotlightRange,
}: {
  data: EventCard;
  side: "left" | "right";
  progress: MotionValue<number>;
  spotlight: MotionValue<number>;
  reveal: [number, number];
  spotlightRange: [number, number, number];
}) => {
  const opacity = useTransform(progress, reveal, [0.4, 1]);
  const glow = useTransform(progress, reveal, [0.2, 1]);
  const scale = useTransform(progress, reveal, [0.96, 1]);
  const lift = useTransform(progress, reveal, [22, 0]);
  const rotate = useTransform(progress, reveal, [side === "left" ? -2.5 : 2.5, 0]);
  const shimmerX = useTransform(progress, reveal, ["-130%", "130%"]);
  const activeGlow = useTransform(spotlight, spotlightRange, [0, 1, 0]);
  const activeScale = useTransform(activeGlow, [0, 1], [1, 1.035]);
  const activeFilter = useTransform(
    activeGlow,
    [0, 1],
    ["brightness(1) saturate(1)", "brightness(1.22) saturate(1.32)"],
  );
  const activeShadow = useTransform(
    activeGlow,
    [0, 1],
    [
      "0 20px 60px -15px hsl(var(--primary) / 0.28)",
      "0 26px 90px -12px hsl(var(--gold) / 0.7), 0 0 44px hsl(var(--primary-glow) / 0.42)",
    ],
  );
  const badgeOpacity = useTransform(activeGlow, [0, 1], [0.55, 1]);
  const detailRows = [
    { icon: CalendarDays, label: data.date },
    { icon: Clock, label: data.time },
    { icon: MapPin, label: data.venue },
  ];

  return (
    <motion.div
      style={{ opacity, scale, y: lift, rotate }}
      className={`relative w-full max-w-md ${side === "left" ? "md:mr-auto" : "md:ml-auto"}`}
    >
      <motion.div
        style={{ opacity: glow }}
        className={`absolute -inset-8 rounded-[2.25rem] bg-gradient-to-br ${data.accent} blur-3xl`}
      />

      <motion.div
        style={{ scale: activeScale, filter: activeFilter, boxShadow: activeShadow }}
        whileHover={{ y: -8, scale: 1.045 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="group relative overflow-hidden rounded-3xl border border-white/35 bg-card/70 p-6 shadow-bloom backdrop-blur-2xl sm:rounded-[2rem] sm:p-8 md:p-10"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary-glow)/0.36),transparent_62%),linear-gradient(135deg,hsl(var(--background)/0.88),hsl(var(--gold)/0.12),hsl(var(--primary)/0.16))]" />
        <motion.div
          aria-hidden
          style={{ x: shimmerX }}
          className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 rotate-12 bg-gradient-to-r from-transparent via-white/45 to-transparent blur-lg"
        />
        <motion.div
          aria-hidden
          style={{ opacity: activeGlow }}
          className="pointer-events-none absolute -inset-1 rounded-[2rem] bg-[radial-gradient(ellipse_at_center,hsl(var(--gold)/0.56),hsl(var(--primary-glow)/0.28)_38%,transparent_72%)] blur-xl"
        />
        <motion.div
          aria-hidden
          style={{ opacity: activeGlow }}
          className="pointer-events-none absolute inset-0 rounded-3xl border-2 border-gold/80 sm:rounded-[2rem]"
        />
        <motion.div
          aria-hidden
          animate={{ opacity: [0.35, 0.8, 0.35], scale: [0.96, 1.06, 0.96] }}
          transition={{ duration: 4.5, repeat: 999999, ease: "easeInOut" }}
          className="pointer-events-none absolute right-5 top-5 h-24 w-24 rounded-[42%] border border-gold/35"
        />
        <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/35 sm:rounded-[2rem]" />

        <div className="relative">
          <div className="flex items-center gap-3 sm:gap-4">
            <motion.div
              animate={{ rotate: [0, -4, 4, 0], scale: [1, 1.08, 1] }}
              transition={{ duration: 5, repeat: 999999, ease: "easeInOut" }}
              className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-gold text-xl shadow-gold sm:h-16 sm:w-16 sm:text-2xl"
            >
              <motion.span
                aria-hidden
                animate={{ opacity: [0.55, 0, 0.55], scale: [1, 1.75, 1] }}
                transition={{ duration: 2.8, repeat: 999999, ease: "easeOut" }}
                className="absolute inset-0 rounded-full bg-gold/40"
              />
              <span className="relative">
                {data.icon}
              </span>
            </motion.div>
            <div>
              <p className="font-script text-lg text-primary sm:text-xl">{data.tagline}</p>
              <h3 className="font-display text-3xl leading-tight text-foreground sm:text-4xl">{data.name}</h3>
            </div>
          </div>

          <div className="my-5 h-px w-full bg-gradient-to-r from-transparent via-gold/80 to-transparent sm:my-6" />

          <div className="space-y-3">
            {detailRows.map(({ icon: Icon, label }, index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: side === "left" ? -16 : 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.18 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-3 rounded-2xl border border-primary/15 bg-background/45 px-3.5 py-3 shadow-soft backdrop-blur-md"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-petal text-foreground shadow-soft">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="font-display text-base text-foreground/85 sm:text-lg">{label}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            style={{ opacity: badgeOpacity }}
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2.6, repeat: 999999, ease: "easeInOut" }}
            className="mt-5 flex items-center justify-center gap-2 rounded-full border border-gold/25 bg-gold/10 px-4 py-2 text-[0.65rem] uppercase tracking-[0.25em] text-foreground/65"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Couple arrival glow
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Steps: 0 idle → 1 begin → 2 walking → 3 arriving → 4 fade
const useStoryStep = (progress: MotionValue<number>) => {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const unsub = progress.on("change", (v) => {
      if (v < 0.15) setStep(0);
      else if (v < 0.3) setStep(1);
      else if (v < 0.7) setStep(2);
      else if (v < 0.9) setStep(3);
      else setStep(4);
    });
    return () => unsub();
  }, [progress]);
  return step;
};

const WalkingCouple = ({
  progress,
  tier,
  reduced,
  speed,
  lean,
  gait,
}: {
  progress: MotionValue<number>;
  tier: "low" | "mid" | "high";
  reduced: boolean;
  speed?: MotionValue<number>;
  lean?: MotionValue<number>;
  gait?: MotionValue<number>;
}) => {
  // Scroll-tied left position (0% → 100%) so the couple walks as you scroll.
  const left = useTransform(progress, [0.05, 0.95], ["2%", "98%"]);
  const opacity = useTransform(progress, [0, 0.08, 0.92, 1], [0, 1, 1, 0]);

  const particleCount = tier === "low" ? 0 : tier === "mid" ? 5 : 10;
  const petalCount = tier === "low" ? 0 : tier === "mid" ? 3 : 5;
  const useHeavyBlur = tier !== "low";

  // Stride-driven bob: vertical bounce keyed to gait phase, scaled by speed.
  const fallbackGait = useMotionValue(0);
  const fallbackSpeed = useMotionValue(0.5);
  const fallbackLean = useMotionValue(0);
  const g = gait ?? fallbackGait;
  const s = speed ?? fallbackSpeed;
  const l = lean ?? fallbackLean;

  // y bob: two bounces per stride, amplitude grows with speed
  const bobY = useTransform([g, s], ([gv, sv]: number[]) =>
    reduced ? 0 : -Math.abs(Math.sin(gv * Math.PI * 2)) * (1.5 + sv * 3)
  );
  // sway: gentle side roll opposite phase
  const sway = useTransform([g, s], ([gv, sv]: number[]) =>
    reduced ? 0 : Math.sin(gv * Math.PI * 2) * (0.6 + sv * 1.4)
  );
  // lean forward/back from acceleration + idle micro-lean
  const tilt = useTransform([l, s], ([lv, sv]: number[]) =>
    reduced ? 0 : Math.max(-4, Math.min(4, lv)) + Math.sin(performance.now() * 0.0008) * (1 - sv) * 0.8
  );
  const shadowScale = useTransform(g, (gv) =>
    reduced ? 1 : 1 - Math.abs(Math.sin(gv * Math.PI * 2)) * 0.15
  );

  return (
    <motion.div
      style={{ left, opacity }}
      className="absolute top-1/2 -translate-x-1/2 -translate-y-[78%] z-20 will-change-transform"
    >
      <motion.div style={{ y: bobY, rotate: tilt, x: sway }} className="relative">
        {/* Halo — softened on low tier */}
        {useHeavyBlur && (
          <motion.div
            animate={reduced ? undefined : { opacity: [0.6, 1, 0.6], scale: [0.95, 1.08, 0.95] }}
            transition={{ duration: 5, repeat: 999999, ease: "easeInOut" }}
            className="absolute left-1/2 top-1/2 -z-10 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-radial from-gold/50 via-primary/25 to-transparent blur-3xl md:h-64 md:w-64"
          />
        )}

        <img
          src={coupleImg}
          alt="Bride and groom walking hand in hand"
          className="relative h-32 w-auto select-none drop-shadow-[0_18px_24px_hsl(var(--primary)/0.4)] sm:h-40 md:h-56"
          draggable={false}
          loading="lazy"
          decoding="async"
        />

        {/* Floor shadow — squashes with each footfall */}
        <motion.div
          style={{ scaleX: shadowScale }}
          className="mx-auto -mt-2 h-2 w-20 rounded-[50%] bg-foreground/30 blur-md sm:w-28 md:w-36"
        />

        {/* Particles — only on mid/high */}
        {particleCount > 0 && (
          <div className="pointer-events-none absolute inset-0">
            {Array.from({ length: particleCount }).map((_, i) => (
              <motion.span
                key={i}
                className="absolute h-1 w-1 rounded-full bg-gold shadow-[0_0_6px_hsl(var(--gold))]"
                initial={{ x: `${15 + (i * 70) / particleCount}%`, y: "95%", opacity: 0 }}
                animate={{ y: ["95%", "10%"], opacity: [0, 1, 0] }}
                transition={{
                  duration: 6 + (i % 3),
                  repeat: 999999,
                  delay: (i * 0.5) % 4,
                  ease: "easeOut",
                }}
              />
            ))}
          </div>
        )}

        {petalCount > 0 && (
          <div className="pointer-events-none absolute -inset-8">
            {Array.from({ length: petalCount }).map((_, i) => (
              <motion.span
                key={`p-${i}`}
                className="absolute h-1.5 w-1.5 rounded-full bg-rose/80 blur-[1px]"
                initial={{ x: `${(i * 100) / petalCount}%`, y: "60%", opacity: 0 }}
                animate={{ x: [`${(i * 100) / petalCount}%`, `${((i + 1) * 100) / petalCount}%`], y: ["60%", "15%"], opacity: [0, 0.7, 0] }}
                transition={{ duration: 8 + (i % 3), repeat: 999999, delay: i * 0.8, ease: "easeInOut" }}
              />
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

const PathTrail = ({ progress }: { progress: MotionValue<number> }) => {
  // Path is drawn in lockstep with scroll progress.
  const pathLength = useTransform(progress, [0.05, 0.9], [0, 1]);

  return (
    <div className="relative h-40 w-full sm:h-52 md:h-64">
      <div className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <svg
        viewBox="0 0 1000 120"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient id="path-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
            <stop offset="50%" stopColor="hsl(var(--gold))" stopOpacity="1" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        <motion.path
          d="M 20 80 Q 250 30, 500 60 T 980 50"
          stroke="url(#path-grad)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          style={{ pathLength }}
        />
      </svg>
    </div>
  );
};

const StoryStepIndicator = ({ step }: { step: number }) => {
  const steps = ["Idle", "Begin", "Walking", "Arriving", "United"];
  return (
    <div className="mt-6 flex items-center justify-center gap-1.5 sm:gap-2">
      {steps.map((label, i) => (
        <div key={label} className="flex items-center gap-1.5 sm:gap-2">
          <motion.div
            animate={{
              scale: step === i ? 1.3 : 1,
              backgroundColor:
                step >= i ? "hsl(var(--gold))" : "hsl(var(--muted-foreground) / 0.3)",
            }}
            transition={{ duration: 0.4 }}
            className="h-2 w-2 rounded-full sm:h-2.5 sm:w-2.5"
          />
          <span
            className={`hidden text-[0.6rem] uppercase tracking-[0.2em] sm:inline ${
              step === i ? "text-primary" : "text-muted-foreground/60"
            }`}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  );
};

const Events = () => {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = !!useReducedMotion();
  const isMobile = useIsMobile();
  const tier = useDeviceTier();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Lighter spring on low-end so layout work stays cheap.
  const springConfig =
    tier === "low"
      ? { stiffness: 60, damping: 30, mass: 0.8 }
      : { stiffness: 35, damping: 28, mass: 1.2 };
  const progress = useSpring(scrollYProgress, springConfig);

  // Auto-walk: a stride-based loop with acceleration, cruise, deceleration,
  // and a brief "arrival pause" before quietly resetting. Also publishes a
  // live speed value (0..1) and a micro-lean angle for body language.
  const auto = useMotionValue(0);
  const walk = useMotionValue(0);
  const speed = useMotionValue(0);
  const lean = useMotionValue(0);
  const gait = useMotionValue(0); // 0..1 step phase, advances with distance
  useEffect(() => {
    if (reduced) {
      auto.set(0.5);
      return;
    }
    const period = tier === "low" ? 26000 : tier === "mid" ? 21000 : 17000;
    // Seamless automatic stroll. Phases (fractions of period):
    //  0.00–0.06  hidden reset at start (figure faded out via opacity ramp)
    //  0.06–0.24  ease-in from rest
    //  0.24–0.74  long smooth cruise with subtle organic sway
    //  0.74–0.90  ease-out into arrival
    //  0.90–1.00  united / hold (figure fades out, ready to loop)
    let raf = 0;
    const start = performance.now();
    let prev = 0;
    let prevTs = start;
    let strideAcc = 0;

    const easeIn = (x: number) => x * x * (3 - 2 * x); // smoothstep
    const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);

    const tick = (now: number) => {
      const t = ((now - start) % period) / period;
      let p: number;
      if (t < 0.06) {
        p = 0;
      } else if (t < 0.24) {
        p = easeIn((t - 0.06) / 0.18) * 0.22;
      } else if (t < 0.74) {
        const k = (t - 0.24) / 0.5;
        // smooth cruise with a barely-there organic drift
        p = 0.22 + k * 0.58 + Math.sin(k * Math.PI * 2) * 0.006;
      } else if (t < 0.9) {
        p = 0.8 + easeOut((t - 0.74) / 0.16) * 0.2;
      } else {
        p = 1;
      }
      auto.set(p);

      const dt = Math.max(now - prevTs, 1);
      const dp = p - prev;
      const v = Math.min(1, (Math.abs(dp) * 1000 / dt) * 8);
      const smoothed = speed.get() * 0.85 + v * 0.15;
      speed.set(smoothed);
      lean.set(lean.get() * 0.9 + (v - smoothed) * 18);

      strideAcc += Math.max(0, dp) * (tier === "low" ? 16 : 22);
      gait.set(strideAcc % 1);

      prev = p;
      prevTs = now;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [auto, speed, lean, gait, reduced, tier]);

  // Drive the walk purely from the automatic loop — scroll no longer steers it.
  useMotionValueEvent(auto, "change", (v) => walk.set(v));
  const walkProgress = useSpring(walk, springConfig);

  const cameraY = useTransform(progress, [0, 0.5, 1], [40, 0, -20]);
  const dim = useTransform(progress, [0.2, 0.5, 0.8], [0, 0.25, 0]);
  const step = useStoryStep(walkProgress);

  const showHeavyBg = tier !== "low";

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-gradient-sunset py-16 sm:py-24 md:py-48"
    >
      {showHeavyBg && (
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-primary/20 blur-[100px] animate-float-slow sm:h-96 sm:w-96" />
          <div
            className="absolute -right-20 bottom-20 h-72 w-72 rounded-full bg-gold-soft/30 blur-[100px] animate-float-slow sm:h-96 sm:w-96"
            style={{ animationDelay: "3s" }}
          />
        </div>
      )}

      <motion.div
        style={{ opacity: dim }}
        className="pointer-events-none absolute inset-0 bg-foreground/30"
      />

      <div className="container relative z-10 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 text-center sm:mb-16 md:mb-20"
        >
          <p className="font-script text-2xl text-primary sm:text-3xl">our story unfolds</p>
          <h2 className="mt-2 font-display text-3xl sm:text-5xl md:text-7xl">From Promise to Forever</h2>
          <OrnamentalDivider className="mt-6 sm:mt-8" />
          <p className="mx-auto mt-5 max-w-xl text-[0.6rem] uppercase tracking-[0.3em] text-muted-foreground sm:mt-6 sm:text-sm sm:tracking-[0.35em]">
            scroll gently · walk with us
          </p>
          <StoryStepIndicator step={step} />
        </motion.div>

        <motion.div style={{ y: reduced ? 0 : cameraY }} className="relative">
          <div className="grid gap-10 sm:gap-12 md:grid-cols-2 md:gap-8">
            <StoryCard
              data={engagement}
              side="left"
              progress={progress}
              spotlight={walkProgress}
              reveal={[0, 0.25]}
              spotlightRange={[0.04, 0.18, 0.42]}
            />
            <StoryCard
              data={marriage}
              side="right"
              progress={progress}
              spotlight={walkProgress}
              reveal={[0.6, 0.95]}
              spotlightRange={[0.58, 0.82, 0.99]}
            />
          </div>

          {/* Desktop & tablet pathway */}
          <div className="relative mt-10 hidden sm:block">
            <PathTrail progress={walkProgress} />
            <WalkingCouple progress={walkProgress} tier={tier} reduced={reduced} speed={speed} lean={lean} gait={gait} />
          </div>

          {/* Mobile: compact horizontal walk between stacked cards */}
          <div className="relative my-8 block sm:hidden">
            <div className="relative h-28">
              <PathTrail progress={walkProgress} />
              <WalkingCouple progress={walkProgress} tier={tier} reduced={reduced} speed={speed} lean={lean} gait={gait} />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Events;
