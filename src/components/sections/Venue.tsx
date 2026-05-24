import { motion } from "framer-motion";
import { Clock, Landmark, MapPin, Navigation } from "lucide-react";
import OrnamentalDivider from "../OrnamentalDivider";
import venueExteriorClose from "@/assets/venue-exterior-close.jpg";
import venueExteriorWide from "@/assets/venue-exterior-wide.jpg";
import venueHallInterior from "@/assets/venue-hall-interior.jpg";

const venueName = "Sri Kumaran Kalyana Mandabam";
const mapUrl =
  "https://maps.app.goo.gl/t6RyqhN4PXTajvJi9?g_st=aw";

const venueDetails = [
  {
    icon: Landmark,
    label: "Marriage",
    name: venueName,
    address: venueName,
    time: "Jun 17, 2026, 10:00 AM onwards",
  },
];

const venuePhotos = [
  {
    src: venueExteriorClose,
    alt: "Entrance sign at Sri Kumaran Kalyana Mandabam",
    caption: "Venue Entrance",
    className: "aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5]",
  },
  {
    src: venueExteriorWide,
    alt: "Exterior view of Sri Kumaran Kalyana Mandabam",
    caption: "Exterior View",
    className: "aspect-[4/3]",
  },
  {
    src: venueHallInterior,
    alt: "Interior hall at Sri Kumaran Kalyana Mandabam",
    caption: "Celebration Hall",
    className: "aspect-[4/3]",
  },
];

const Venue = () => {
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
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="grid gap-4 sm:grid-cols-2 sm:gap-5"
          >
            {venuePhotos.map((photo, index) => (
              <motion.figure
                key={photo.caption}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className={`group relative overflow-hidden rounded-[1.5rem] border border-gold/30 bg-card shadow-bloom ${
                  index === 0 ? "sm:row-span-2" : ""
                }`}
              >
                <div className={photo.className}>
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/55 via-transparent to-transparent" />
                <figcaption className="absolute bottom-4 left-4 right-4 rounded-full bg-background/82 px-4 py-2 text-center text-xs uppercase tracking-[0.22em] text-foreground shadow-soft backdrop-blur">
                  {photo.caption}
                </figcaption>
              </motion.figure>
            ))}
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
              We would be honored by your presence as Suriya Kumar and Kaviya begin their forever at Sri Kumaran Kalyana Mandabam with sacred rituals, family blessings, and love.
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
              href={mapUrl}
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
