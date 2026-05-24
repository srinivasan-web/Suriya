import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Clock, Landmark, MapPin, Navigation, Route } from "lucide-react";
import OrnamentalDivider from "../OrnamentalDivider";

const venueDetails = [
  {
    icon: Landmark,
    label: "Marriage",
    name: "Marriage",
    address: "Arulmigu Pazhaniandavar Thirukovil",
    time: "Jun 17, 2026, 10:00 AM onwards",
  },
];

const Venue = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative overflow-hidden bg-background py-20 sm:py-28 md:py-40">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,hsl(var(--gold)/0.18),transparent_36%),radial-gradient(ellipse_at_bottom_right,hsl(var(--primary)/0.16),transparent_42%)]" />

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 text-center sm:mb-16"
        >
          <p className="font-script text-2xl text-primary sm:text-3xl">join us here</p>
          <h2 className="mt-2 font-display text-4xl sm:text-5xl md:text-7xl">Sacred Destination</h2>
          <OrnamentalDivider className="mt-6 sm:mt-8" />
        </motion.div>

        <div className="grid gap-8 sm:gap-12 lg:grid-cols-2 lg:items-center">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-gold/30 bg-[linear-gradient(135deg,hsl(var(--ivory)),hsl(var(--gold)/0.18),hsl(var(--primary)/0.16))] shadow-bloom sm:aspect-square lg:aspect-[4/5]"
          >
            <div className="absolute inset-0 opacity-[0.16]">
              <svg viewBox="0 0 560 700" className="h-full w-full">
                <g stroke="hsl(var(--foreground))" strokeWidth="1">
                  {Array.from({ length: 12 }).map((_, index) => (
                    <line key={`h-${index}`} x1="0" y1={index * 64} x2="560" y2={index * 64} />
                  ))}
                  {Array.from({ length: 10 }).map((_, index) => (
                    <line key={`v-${index}`} x1={index * 64} y1="0" x2={index * 64} y2="700" />
                  ))}
                </g>
              </svg>
            </div>

            <div className="absolute inset-0">
              <svg viewBox="0 0 560 700" className="h-full w-full">
                <defs>
                  <linearGradient id="venueRouteGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="hsl(var(--primary))" />
                    <stop offset="48%" stopColor="hsl(var(--gold))" />
                    <stop offset="100%" stopColor="hsl(var(--foreground))" />
                  </linearGradient>
                  <filter id="routeGlow">
                    <feGaussianBlur stdDeviation="5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                <g opacity="0.24" fill="none" stroke="hsl(var(--foreground))" strokeLinecap="round">
                  <path d="M 58 122 C 134 88, 182 122, 254 86 S 390 84, 500 128" strokeWidth="7" />
                  <path d="M 68 612 C 154 544, 232 566, 318 510 S 442 404, 510 424" strokeWidth="10" />
                  <path d="M 88 302 C 168 298, 204 246, 276 270 S 414 340, 500 286" strokeWidth="5" />
                </g>

                <motion.path
                  d="M 92 584 C 116 492, 212 500, 232 404 C 252 308, 382 362, 402 236 C 414 158, 468 132, 502 96"
                  fill="none"
                  stroke="url(#venueRouteGradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray="18 16"
                  filter="url(#routeGlow)"
                  initial={{ pathLength: 0 }}
                  animate={inView ? { pathLength: 1 } : {}}
                  transition={{ duration: 3.1, ease: "easeInOut" }}
                />

                {inView && (
                  <circle r="9" fill="hsl(var(--foreground))">
                    <animate
                      attributeName="opacity"
                      values="0;1;1"
                      keyTimes="0;0.18;1"
                      dur="3.1s"
                      fill="freeze"
                    />
                    <animateMotion
                      dur="3.1s"
                      fill="freeze"
                      path="M 92 584 C 116 492, 212 500, 232 404 C 252 308, 382 362, 402 236 C 414 158, 468 132, 502 96"
                    />
                  </circle>
                )}
              </svg>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.2, ease: "backOut" }}
              className="absolute bottom-[13%] left-[13%]"
            >
              <div className="relative grid h-16 w-16 place-items-center rounded-full bg-primary text-primary-foreground shadow-bloom">
                <span className="absolute inset-0 rounded-full bg-primary/30 animate-glow-pulse" />
                <Navigation className="relative h-6 w-6" />
              </div>
              <p className="mt-3 rounded-full bg-background/80 px-3 py-1 text-xs uppercase tracking-[0.18em] text-foreground shadow-soft backdrop-blur">
                Start
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.72 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 2.7, ease: "backOut" }}
              className="absolute right-[8%] top-[7%]"
            >
              <div className="relative grid h-20 w-20 place-items-center rounded-full bg-gradient-gold text-foreground shadow-gold">
                <span className="absolute inset-0 rounded-full bg-gold/35 animate-glow-pulse" />
                <MapPin className="relative h-9 w-9" fill="currentColor" />
              </div>
              <p className="mt-3 rounded-full bg-background/85 px-3 py-1 text-xs uppercase tracking-[0.18em] text-foreground shadow-soft backdrop-blur">
              Pazhaniandavar Thirukovil
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute bottom-5 left-5 right-5 rounded-2xl border border-gold/35 bg-background/82 p-4 shadow-soft backdrop-blur-md sm:p-5"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-gold text-foreground">
                  <Route className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-display text-xl leading-tight text-foreground sm:text-2xl">
                    Live Route Preview
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.24em] text-foreground/60">
                    Google map style tracking
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6 sm:space-y-7"
          >
            <h3 className="font-display text-3xl sm:text-4xl md:text-5xl">Forever Begins Here</h3>
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              We would be honored by your presence as Suriya Kumar and Kaviya begin their forever with sacred rituals, family blessings, and love.
            </p>

            <div className="space-y-4">
              {venueDetails.map(({ icon: Icon, label, name, address, time }, index) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.15 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="relative overflow-hidden rounded-3xl border border-primary/15 bg-card/70 p-5 shadow-soft backdrop-blur-xl sm:p-6"
                >
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,hsl(var(--gold)/0.12),transparent_54%,hsl(var(--primary)/0.12))]" />
                  <div className="relative flex items-start gap-4">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-gold text-foreground shadow-gold">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] text-primary">{label}</p>
                      <p className="mt-2 font-display text-2xl leading-tight text-foreground sm:text-3xl">
                        {name}
                      </p>
                      <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground sm:text-base">
                        <Navigation className="h-4 w-4 text-gold" />
                        {address}
                      </p>
                      <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground sm:text-base">
                        <Clock className="h-4 w-4 text-gold" />
                        {time}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <a
              href="https://www.google.com/maps/search/?api=1&query=Arulmigu%20Pazhaniandavar%20Thirukovil"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 rounded-full bg-gradient-gold px-6 py-3.5 font-display text-base text-foreground shadow-gold transition-transform duration-500 hover:scale-105 sm:px-8 sm:py-4 sm:text-lg"
            >
              Open in Maps
              <span className="transition-transform duration-500 group-hover:translate-x-1">-&gt;</span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Venue;
