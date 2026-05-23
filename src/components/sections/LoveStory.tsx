import { motion } from "framer-motion";
import OrnamentalDivider from "../OrnamentalDivider";

const moments = [
  {
    year: "2019",
    title: "First Glance",
    text: "A college library. A borrowed book. A hello that lingered too long.",
  },
  {
    year: "2021",
    title: "Falling, Slowly",
    text: "Endless walks under monsoon skies. Conversations that turned into us.",
  },
  {
    year: "2023",
    title: "The Question",
    text: "On a quiet rooftop in Udaipur, beneath a sky full of fairy lights.",
  },
  {
    year: "2026",
    title: "Forever Begins",
    text: "And now, we'd love for you to walk with us into the next chapter.",
  },
];

const LoveStory = () => {
  return (
    <section className="relative bg-gradient-radial py-20 sm:py-28 md:py-48">
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 text-center sm:mb-20"
        >
          <p className="font-script text-2xl text-primary sm:text-3xl">our story</p>
          <h2 className="mt-2 font-display text-4xl sm:text-5xl md:text-7xl">A Love in Chapters</h2>
          <OrnamentalDivider className="mt-6 sm:mt-8" />
        </motion.div>

        <div className="relative mx-auto max-w-4xl">
          {/* Vertical timeline line — left on mobile, center on md+ */}
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="absolute left-4 top-0 h-full w-px origin-top bg-gradient-to-b from-transparent via-gold to-transparent md:left-1/2 md:-translate-x-1/2"
          />

          {moments.map((m, i) => {
            const isLeft = i % 2 === 0;
            return (
              <motion.div
                key={m.year}
                initial={{ opacity: 0, x: isLeft ? -40 : 40, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                className={`relative mb-10 flex items-center sm:mb-16 md:mb-20 ${
                  isLeft ? "md:justify-start" : "md:justify-end"
                }`}
              >
                {/* Timeline dot */}
                <div className="absolute left-4 -translate-x-1/2 md:left-1/2">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3, ease: "backOut" }}
                    className="relative"
                  >
                    <div className="absolute inset-0 rounded-full bg-primary/40 blur-md animate-glow-pulse" />
                    <div className="relative h-3 w-3 rounded-full bg-gradient-gold ring-4 ring-background sm:h-4 sm:w-4" />
                  </motion.div>
                </div>

                <div
                  className={`w-full pl-10 text-left md:w-[calc(50%-2rem)] md:pl-0 ${
                    isLeft ? "md:pr-8 md:text-right" : "md:pl-8 md:text-left"
                  }`}
                >
                  <div className="glass-card rounded-2xl p-5 shadow-soft sm:p-6 md:p-8">
                    <p className="font-script text-xl text-primary sm:text-2xl">{m.year}</p>
                    <h3 className="mt-1 font-display text-xl sm:text-2xl md:text-3xl">{m.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:mt-3 md:text-base">
                      {m.text}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LoveStory;
