import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const calc = (target: Date): TimeLeft => {
  const diff = Math.max(0, target.getTime() - Date.now());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
};

const FlipDigit = ({ value }: { value: string }) => (
  <div className="relative h-[1.2em] w-[0.7em] overflow-hidden">
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span
        key={value}
        initial={{ y: "-100%", opacity: 0, rotateX: -90 }}
        animate={{ y: "0%", opacity: 1, rotateX: 0 }}
        exit={{ y: "100%", opacity: 0, rotateX: 90 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 flex items-center justify-center"
        style={{ transformOrigin: "center", backfaceVisibility: "hidden" }}
      >
        {value}
      </motion.span>
    </AnimatePresence>
  </div>
);

const FlipUnit = ({ value, label }: { value: number; label: string }) => {
  const padded = value.toString().padStart(2, "0");
  return (
    <div className="flex flex-col items-center gap-1.5 sm:gap-2">
      <div className="relative">
        <div className="glass-card flex items-center justify-center rounded-xl px-2 py-2 shadow-soft sm:rounded-2xl sm:px-3 sm:py-3 md:px-5 md:py-4">
          <div className="flex font-display text-2xl text-foreground tracking-tight leading-none sm:text-4xl md:text-6xl">
            <FlipDigit value={padded[0]} />
            <FlipDigit value={padded[1]} />
          </div>
          <div className="pointer-events-none absolute left-2 right-2 top-1/2 h-px bg-foreground/10" />
        </div>
        <div className="pointer-events-none absolute -inset-1 rounded-2xl bg-gradient-petal opacity-30 blur-xl -z-10" />
      </div>
      <span className="text-[0.55rem] uppercase tracking-[0.25em] text-foreground/60 sm:text-[0.6rem] sm:tracking-[0.3em] md:text-xs">
        {label}
      </span>
    </div>
  );
};

const Countdown = ({ target }: { target: Date }) => {
  const [time, setTime] = useState<TimeLeft>(() => calc(target));

  useEffect(() => {
    const id = setInterval(() => setTime(calc(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  return (
    <div className="flex items-center gap-1.5 sm:gap-3 md:gap-5">
      <FlipUnit value={time.days} label="Days" />
      <span className="font-display text-xl text-foreground/40 sm:text-3xl md:text-5xl">:</span>
      <FlipUnit value={time.hours} label="Hours" />
      <span className="font-display text-xl text-foreground/40 sm:text-3xl md:text-5xl">:</span>
      <FlipUnit value={time.minutes} label="Min" />
      <span className="font-display text-xl text-foreground/40 sm:text-3xl md:text-5xl">:</span>
      <FlipUnit value={time.seconds} label="Sec" />
    </div>
  );
};

export default Countdown;
