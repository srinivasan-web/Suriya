import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { CalendarHeart, Heart, Sparkles } from "lucide-react";
import galleryOne from "@/assets/gallery-1.jpg";
import galleryThree from "@/assets/gallery-3.jpg";

const filmScenes = [
  { src: galleryOne, alt: "Couple laughing together", position: "center" },
  { src: galleryThree, alt: "Wedding mandap glowing at twilight", position: "center" },
];

const sparkleTrail = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  left: 3 + ((i * 37) % 94),
  top: 10 + ((i * 17) % 78),
  size: 3 + (i % 4),
  delay: (i % 10) * 0.45,
  duration: 5 + (i % 6),
}));

const Ending = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1.08, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.28, 0.82, 1], [0, 1, 1, 0.36]);
  const contentY = useTransform(scrollYProgress, [0, 0.55, 1], [62, 0, -30]);

  return (
    <section ref={ref} className="relative h-[150vh] overflow-hidden bg-foreground">
      <motion.div className="sticky top-0 h-screen w-full overflow-hidden" style={{ opacity }}>
        <motion.div className="absolute inset-0" style={{ scale }}>
          {filmScenes.map((scene, index) => (
            <img
              key={scene.src}
              src={scene.src}
              alt={scene.alt}
              className="ending-video-scene absolute inset-0 h-full w-full object-cover"
              style={{
                objectPosition: scene.position,
                animationDelay: `${index * 6 - 1.2}s`,
              }}
              loading={index === 0 ? "eager" : "lazy"}
            />
          ))}
        </motion.div>

        <div className="absolute inset-0 bg-[linear-gradient(180deg,hsl(var(--foreground)/0.42),transparent_28%,hsl(var(--foreground)/0.9)),linear-gradient(90deg,hsl(var(--foreground)/0.72),transparent_44%,hsl(var(--foreground)/0.68))]" />
        <div className="cinematic-grain absolute inset-0 opacity-[0.17] mix-blend-soft-light" />
        <div className="ending-light-sweep pointer-events-none absolute inset-y-0 -left-1/3 w-2/3 bg-gradient-to-r from-transparent via-gold/25 to-transparent blur-2xl" />
        <div className="ending-light-sweep pointer-events-none absolute inset-y-0 -right-1/2 w-2/3 bg-gradient-to-l from-transparent via-primary-glow/18 to-transparent blur-2xl [animation-delay:4s]" />

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {sparkleTrail.map((sparkle) => (
            <span
              key={sparkle.id}
              className="ending-star-drift absolute rounded-full bg-gold shadow-[0_0_14px_hsl(var(--gold)/0.75)]"
              style={{
                left: `${sparkle.left}%`,
                top: `${sparkle.top}%`,
                width: sparkle.size,
                height: sparkle.size,
                animationDelay: `${sparkle.delay}s`,
                animationDuration: `${sparkle.duration}s`,
              }}
            />
          ))}
        </div>

       

        <motion.div
          style={{ y: contentY }}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center px-5 pb-40 text-center text-background sm:px-6 sm:pb-36 md:pb-28"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, filter: "blur(12px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 rounded-full border border-background/20 bg-background/10 px-4 py-2 text-[0.65rem] uppercase tracking-[0.28em] text-background/78 backdrop-blur-md"
          >
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            cinematic finale
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
            className="mt-7 font-script text-2xl text-primary-glow sm:text-3xl md:text-4xl"
          >
            and so, our forever begins
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 50, filter: "blur(15px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, delay: 0.34, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 max-w-4xl font-display text-4xl leading-[0.95] drop-shadow-[0_18px_30px_hsl(var(--foreground)/0.8)] sm:mt-6 sm:text-6xl md:text-8xl lg:text-9xl"
          >
            With love,
            <br />
            <span className="font-script text-gold-soft italic color  ">Suriya Kumar & Kaviya</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex flex-col items-center gap-4 text-background/78 sm:mt-12"
          >
            <div className="h-px w-28 bg-gradient-to-r from-transparent via-gold to-transparent sm:w-40" />
            <div className="flex flex-wrap items-center justify-center gap-3 text-[0.65rem] uppercase tracking-[0.24em] sm:text-xs">
              <span className="inline-flex items-center gap-2">
                <CalendarHeart className="h-4 w-4 text-gold" />
                17 - 06 - 2026
              </span>
              <span className="text-background/35">/</span>
              <span className="inline-flex items-center gap-2">
                <Heart className="h-4 w-4 text-primary-glow" fill="currentColor" />
                Save the date
              </span>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Ending;
