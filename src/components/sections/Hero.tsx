import { motion } from "framer-motion";
import { CalendarHeart, Heart, MapPin, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-couple.jpg";
import OrnamentalDivider from "../OrnamentalDivider";
import Countdown from "../Countdown";

const WEDDING_DATE = new Date("2026-06-17T00:00:00");

const floatingHearts = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  left: 4 + ((i * 43) % 92),
  top: 10 + ((i * 29) % 78),
  size: 10 + (i % 5) * 3,
  duration: 9 + (i % 7),
  delay: (i % 8) * 0.55,
  drift: i % 2 === 0 ? 28 : -28,
}));

const quickDetails = [
  { icon: CalendarHeart, label: "17 June 2026" },
  { icon: MapPin, label: "Pattukkottai & Ponnavarayan Kottai" },
  { icon: Sparkles, label: "Wedding & Reception" },
];

const loveNotes = [
  "A promise written in smiles",
  "A bond blessed by every heartbeat",
  "A forever beginning with family and love",
];

const Hero = () => {
  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Dreamy floral archway at golden hour"
          className="h-full w-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_22%,hsl(var(--primary-glow)/0.16),transparent_36%),linear-gradient(180deg,hsl(var(--foreground)/0.14),transparent_34%,hsl(var(--background)/0.94))]" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/70 md:from-background/55 md:to-background/45" />
        <div className="absolute inset-0 bg-[linear-gradient(105deg,transparent_0%,hsl(var(--gold)/0.16)_46%,transparent_58%)] animate-cinematic-sweep" />
      </div>

      <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-background/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
        <div className="cinematic-grain absolute inset-0 opacity-[0.16] mix-blend-soft-light" />
        {floatingHearts.map((heart) => (
          <motion.span
            key={heart.id}
            initial={{ opacity: 0, y: 20, rotate: -8 }}
            animate={{
              opacity: [0, 0.72, 0],
              y: [-12, -92],
              x: [0, heart.drift, 0],
              rotate: [-10, 8, -6],
            }}
            transition={{
              duration: heart.duration,
              delay: heart.delay,
              repeat: 999999,
              ease: "easeInOut",
            }}
            className="absolute text-primary-glow/70 drop-shadow-[0_0_16px_hsl(var(--primary-glow)/0.55)]"
            style={{
              left: `${heart.left}%`,
              top: `${heart.top}%`,
              width: heart.size,
              height: heart.size,
            }}
          >
            <Heart className="h-full w-full" fill="currentColor" strokeWidth={1.2} />
          </motion.span>
        ))}
        <motion.div
          animate={{ opacity: [0.35, 0.68, 0.35], scale: [1, 1.04, 1] }}
          transition={{ duration: 7, repeat: 999999, ease: "easeInOut" }}
          className="absolute left-1/2 top-[18%] h-[28rem] w-[28rem] -translate-x-1/2 rounded-[45%] border border-gold/25 blur-[1px]"
        />
      </div>

      <motion.div
        className="relative z-20 flex min-h-[100svh] flex-col items-center justify-center px-4 pb-28 pt-20 text-center sm:px-6"
      >
        <motion.p
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          className="font-script text-xl text-primary drop-shadow-sm sm:text-2xl md:text-3xl"
        >
          together forever
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 50, filter: "blur(15px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
          className="mt-3 max-w-[11ch] font-display text-[3.25rem] leading-[0.9] text-foreground drop-shadow-[0_8px_26px_hsl(var(--background)/0.5)] sm:mt-4 sm:text-7xl md:max-w-none md:text-8xl lg:text-[10rem]"
        >
          Suriya Kumar<span className="font-script text-gold-gradient italic">,<br/>
          &</span> <br/>Kaviya
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1.4, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 origin-center"
        >
          <OrnamentalDivider />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-2xl font-display text-base italic text-muted-foreground sm:mt-8 sm:text-xl md:text-2xl"
        >
          Two hearts found their rhythm, and every tomorrow now begins with love. <br />
          <span className="font-sans text-[0.65rem] uppercase tracking-[0.35em] text-foreground/60 sm:text-sm sm:tracking-[0.4em]">
            17 - June - 2026
          </span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.48, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 flex max-w-4xl flex-wrap items-center justify-center gap-2 sm:gap-3"
        >
          {loveNotes.map((note, index) => (
            <motion.span
              key={note}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1.65 + index * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex max-w-[16rem] items-center gap-2 rounded-full border border-gold/30 bg-background/50 px-3.5 py-2 text-center font-display text-sm italic text-foreground/75 shadow-soft backdrop-blur-xl sm:max-w-none sm:px-4 sm:text-base"
            >
              <Heart className="h-3.5 w-3.5 shrink-0 text-primary" fill="currentColor" />
              {note}
            </motion.span>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 flex max-w-3xl flex-wrap items-center justify-center gap-2 sm:gap-3"
        >
          {quickDetails.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-background/55 px-3 py-2 text-[0.63rem] uppercase tracking-[0.18em] text-foreground/70 shadow-soft backdrop-blur-xl sm:px-4 sm:text-xs"
            >
              <Icon className="h-3.5 w-3.5 text-primary" />
              {label}
            </span>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.4, delay: 1.85, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 sm:mt-10"
        >
          <Countdown target={WEDDING_DATE} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 2.05, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href="#rsvp"
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-gold px-6 py-3 font-display text-base text-foreground shadow-gold transition-transform duration-500 hover:scale-105 sm:px-8 sm:py-3.5 sm:text-lg"
          >
            RSVP with Love
            <Heart className="h-4 w-4 transition-transform group-hover:scale-125" fill="currentColor" />
          </a>
          <a
            href="#story"
            className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-background/55 px-6 py-3 font-display text-base text-foreground/80 shadow-soft backdrop-blur-xl transition hover:border-primary hover:text-primary sm:px-8 sm:py-3.5 sm:text-lg"
          >
            Watch the Story
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
