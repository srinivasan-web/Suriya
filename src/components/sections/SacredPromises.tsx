import { motion } from "framer-motion";
import { Heart, Infinity, Sparkles, Stars, UsersRound } from "lucide-react";
import OrnamentalDivider from "../OrnamentalDivider";

const promises = [
  {
    icon: Heart,
    title: "Love That Listens",
    text: "A lifetime of choosing each other softly, in laughter, patience, and every little ordinary day.",
  },
  {
    icon: UsersRound,
    title: "Families Become One",
    text: "Two homes, two stories, and many blessings gather together to celebrate one beautiful beginning.",
  },
  {
    icon: Stars,
    title: "Forever In Bloom",
    text: "From this sacred moment, every dream grows brighter with love, trust, and togetherness.",
  },
];

const blessingLines = [
  "May every sunrise bring them closer.",
  "May every prayer become a blessing.",
  "May every step be held by love.",
  "May their forever stay gentle and golden.",
];

const SacredPromises = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-dreamy py-20 sm:py-28 md:py-40">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-gold/20 blur-[90px] sm:h-96 sm:w-96" />
        <div className="absolute -left-20 bottom-16 h-64 w-64 rounded-full bg-primary/18 blur-[90px]" />
        <div className="absolute -right-20 top-40 h-64 w-64 rounded-full bg-sage/20 blur-[90px]" />
      </div>

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="font-script text-2xl text-primary sm:text-3xl">made for forever</p>
          <h2 className="mt-2 font-display text-4xl leading-tight sm:text-5xl md:text-7xl">
            Sacred Promises
          </h2>
          <OrnamentalDivider className="mt-6 sm:mt-8" />
          <p className="mx-auto mt-6 max-w-2xl font-display text-xl italic leading-relaxed text-muted-foreground sm:text-2xl">
            A marriage is not only one beautiful day. It is every tomorrow saying, I am still here, still yours, still choosing us.
          </p>
        </motion.div>

        <div className="relative mx-auto mt-12 max-w-5xl sm:mt-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto grid min-h-[18rem] max-w-3xl place-items-center rounded-[2rem] border border-gold/25 bg-background/55 px-6 py-10 shadow-bloom backdrop-blur-xl sm:min-h-[22rem]"
          >
            <svg viewBox="0 0 700 320" className="absolute inset-0 h-full w-full opacity-80">
              <defs>
                <linearGradient id="promiseGradient" x1="0%" y1="50%" x2="100%" y2="50%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="50%" stopColor="hsl(var(--gold))" />
                  <stop offset="100%" stopColor="hsl(var(--primary))" />
                </linearGradient>
                <filter id="promiseGlow">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <motion.path
                d="M 110 160 C 170 55, 300 55, 350 160 C 400 265, 530 265, 590 160 C 530 55, 400 55, 350 160 C 300 265, 170 265, 110 160"
                fill="none"
                stroke="url(#promiseGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                filter="url(#promiseGlow)"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 3, ease: "easeInOut" }}
              />
            </svg>

            <motion.div
              animate={{ y: [-8, 8, -8], rotate: [-2, 2, -2] }}
              transition={{ duration: 7, repeat: 999999, ease: "easeInOut" }}
              className="relative grid h-36 w-36 place-items-center rounded-full border border-gold/35 bg-background/80 shadow-gold backdrop-blur-xl sm:h-44 sm:w-44"
            >
              <span className="absolute inset-4 rounded-full bg-gradient-gold opacity-25 blur-lg" />
              <Infinity className="relative h-16 w-16 text-gold sm:h-20 sm:w-20" />
              <span className="absolute bottom-8 font-script text-2xl text-primary sm:text-3xl">
                forever
              </span>
            </motion.div>

            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem]">
              {Array.from({ length: 16 }).map((_, index) => (
                <motion.span
                  key={index}
                  className="absolute text-primary/55"
                  style={{
                    left: `${6 + ((index * 31) % 88)}%`,
                    top: `${12 + ((index * 19) % 74)}%`,
                  }}
                  animate={{
                    opacity: [0, 0.8, 0],
                    y: [18, -34],
                    scale: [0.7, 1.1, 0.8],
                  }}
                  transition={{
                    duration: 5 + (index % 5),
                    delay: index * 0.28,
                    repeat: 999999,
                    ease: "easeInOut",
                  }}
                >
                  <Heart className="h-4 w-4" fill="currentColor" />
                </motion.span>
              ))}
            </div>
          </motion.div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {promises.map(({ icon: Icon, title, text }, index) => (
              <motion.article
                key={title}
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="relative overflow-hidden rounded-3xl border border-primary/15 bg-card/75 p-6 shadow-soft backdrop-blur-xl"
              >
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,hsl(var(--gold)/0.14),transparent_48%,hsl(var(--primary)/0.12))]" />
                <div className="relative">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-gradient-gold text-foreground shadow-gold">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 font-display text-2xl text-foreground">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{text}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-3"
        >
          {blessingLines.map((line) => (
            <span
              key={line}
              className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-background/55 px-4 py-2 font-display text-sm italic text-foreground/75 shadow-soft backdrop-blur-xl sm:text-base"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              {line}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default SacredPromises;
