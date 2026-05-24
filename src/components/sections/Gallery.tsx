import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState, useRef, MouseEvent } from "react";
import OrnamentalDivider from "../OrnamentalDivider";
import g1 from "@/assets/couple-walking.png";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";
import florals from "@/assets/florals.jpg";

const photos = [
  { src: g1, alt: "Couple laughing together", h: "tall", caption: "A moment of pure joy" },
  { src: g4, alt: "Bridal bouquet", h: "short", caption: "Petals & promises" },
  { src: g3, alt: "Mandap at twilight", h: "tall", caption: "Where vows take flight" },
  { src: g2, alt: "Hands with mehendi", h: "short", caption: "Threads of tradition" },
  { src: florals, alt: "Pastel floral arrangement", h: "tall", caption: "Blooms in soft light" },
];

const TiltCard = ({
  i,
  photo,
  onClick,
}: {
  i: number;
  photo: (typeof photos)[number];
  onClick: () => void;
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 120, damping: 14 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), { stiffness: 120, damping: 14 });
  const lx = useTransform(mx, [-0.5, 0.5], ["0%", "100%"]);

  const handleMove = (e: MouseEvent<HTMLButtonElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      initial={{ opacity: 0, y: 60, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 1.1,
        delay: (i % 3) * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
      className="group relative block w-full break-inside-avoid overflow-hidden rounded-2xl shadow-soft cursor-pointer mb-6"
    >
      <div className={`relative ${photo.h === "tall" ? "aspect-[3/4]" : "aspect-[4/3]"}`}>
        <motion.img
          src={photo.src}
          alt={photo.alt}
          loading="lazy"
          style={{ transitionDuration: "1400ms" }}
          className="h-full w-full object-cover transition-transform ease-out group-hover:scale-110"
        />
        {/* Soft dim on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-foreground/10 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

        {/* Light sweep */}
        <motion.div
          aria-hidden
          style={{ left: lx }}
          className="pointer-events-none absolute top-0 -translate-x-1/2 h-full w-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        >
          <div className="h-full w-full bg-gradient-to-r from-transparent via-white/40 to-transparent blur-2xl" />
        </motion.div>

        {/* Caption */}
        <div className="absolute inset-x-0 bottom-0 p-4 md:p-5 translate-y-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <p className="font-script text-lg text-background drop-shadow-lg">
            {photo.caption}
          </p>
        </div>

        {/* Edge glow */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/20" />
      </div>
    </motion.button>
  );
};

const Gallery = () => {
  const [active, setActive] = useState<number | null>(null);

  const next = () => setActive((a) => (a === null ? a : (a + 1) % photos.length));
  const prev = () =>
    setActive((a) => (a === null ? a : (a - 1 + photos.length) % photos.length));

  return (
    <section className="relative bg-gradient-dreamy py-20 sm:py-28 md:py-48">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 text-center sm:mb-20"
        >
          <p className="font-script text-2xl text-primary sm:text-3xl">moments captured</p>
          <h2 className="mt-2 font-display text-4xl sm:text-5xl md:text-7xl">Through Our Lens</h2>
          <OrnamentalDivider className="mt-6 sm:mt-8" />
        </motion.div>

        <div className="columns-1 gap-4 sm:columns-2 sm:gap-6 lg:columns-3">
          {photos.map((p, i) => (
            <TiltCard key={i} i={i} photo={p} onClick={() => setActive(i)} />
          ))}
        </div>
      </div>

      {/* Cinematic Lightbox */}
      <AnimatePresence>
        {active !== null && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(16px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/85 p-4 md:p-10"
          >
            {/* Floating particles */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              {Array.from({ length: 14 }).map((_, idx) => (
                <motion.span
                  key={idx}
                  className="absolute h-1.5 w-1.5 rounded-full bg-primary-glow/60 blur-[1px]"
                  initial={{
                    x: `${Math.random() * 100}%`,
                    y: "110%",
                    opacity: 0,
                  }}
                  animate={{
                    y: "-10%",
                    opacity: [0, 0.8, 0],
                  }}
                  transition={{
                    duration: 8 + Math.random() * 6,
                    repeat: 999999,
                    delay: Math.random() * 4,
                    ease: "linear",
                  }}
                />
              ))}
            </div>

            {/* Prev / Next */}
            <button
              type="button"
              aria-label="Previous"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full glass-card px-3 py-2 text-lg text-foreground transition-transform hover:scale-110 sm:left-4 sm:px-4 sm:py-3 md:left-8"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full glass-card px-3 py-2 text-lg text-foreground transition-transform hover:scale-110 sm:right-4 sm:px-4 sm:py-3 md:right-8"
            >
              ›
            </button>

            <AnimatePresence mode="wait">
              <motion.figure
                key={active}
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.92, opacity: 0, filter: "blur(20px)" }}
                animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                exit={{ scale: 0.95, opacity: 0, filter: "blur(16px)" }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="relative max-h-[88vh] max-w-[92vw]"
              >
                <motion.img
                  src={photos[active].src}
                  alt={photos[active].alt}
                  initial={{ scale: 1 }}
                  animate={{ scale: 1.08, x: -10, y: 6 }}
                  transition={{ duration: 12, ease: "linear" }}
                  className="max-h-[88vh] max-w-[92vw] rounded-2xl object-contain shadow-bloom"
                />
                <motion.figcaption
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="absolute inset-x-0 bottom-4 text-center font-script text-2xl text-background drop-shadow-lg"
                >
                  {photos[active].caption}
                </motion.figcaption>
              </motion.figure>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;
