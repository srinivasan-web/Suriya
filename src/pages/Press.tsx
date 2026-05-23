import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Download, Mail, ArrowRight, Package } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import JSZip from "jszip";

import OrnamentalDivider from "@/components/OrnamentalDivider";
import ShareCard from "@/components/ShareCard";

import logo from "@/assets/press-logo.png";
import hero from "@/assets/hero-couple.jpg";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import florals from "@/assets/florals.jpg";

const PRESS_EMAIL = "press@aaravandpriya.com";
const SITE_URL = "https://ethereal-events.lovable.app";

const photos = [
  { src: hero, name: "hero-couple.jpg", label: "Hero portrait" },
  { src: gallery1, name: "gallery-1.jpg", label: "Engagement still" },
  { src: gallery2, name: "gallery-2.jpg", label: "Sangeet evening" },
  { src: gallery3, name: "gallery-3.jpg", label: "Ceremony detail" },
  { src: gallery4, name: "gallery-4.jpg", label: "Reception glow" },
  { src: florals, name: "florals.jpg", label: "Floral motif" },
];

const facts = [
  { label: "Couple", value: "Aarav & Priya" },
  { label: "Engagement", value: "12 Feb 2026" },
  { label: "Wedding", value: "17 Jun 2026" },
  { label: "Location", value: "India" },
  { label: "Hashtag", value: "#AaravWedsPriya" },
  { label: "Palette", value: "Gold • Blush • Ivory" },
];

const Press = () => {
  const [zipping, setZipping] = useState(false);

  const downloadAll = async () => {
    try {
      setZipping(true);
      const zip = new JSZip();
      const folder = zip.folder("aarav-priya-press-kit")!;

      const fetchBlob = async (url: string) => (await fetch(url)).blob();
      await Promise.all([
        ...photos.map(async (p) => folder.file(`photos/${p.name}`, await fetchBlob(p.src))),
        (async () => folder.file("logo.png", await fetchBlob(logo)))(),
      ]);
      folder.file(
        "README.txt",
        `Aarav & Priya — Press Kit\n\nContact: ${PRESS_EMAIL}\nSite: ${SITE_URL}\n\nPlease credit "Aarav & Priya" when republishing.\n`
      );

      const blob = await zip.generateAsync({ type: "blob" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "aarav-priya-press-kit.zip";
      a.click();
      URL.revokeObjectURL(a.href);
      toast.success("Press kit downloaded ✨");
    } catch (e) {
      toast.error("Couldn't build the zip. Please try again.");
    } finally {
      setZipping(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background">
      <Helmet>
        <title>Press Kit — Aarav & Priya Wedding Invitation</title>
        <meta
          name="description"
          content="Logos, photos, story and contact for editors and wedding blogs covering Aarav & Priya's wedding invitation experience."
        />
        <link rel="canonical" href={`${SITE_URL}/press`} />
        <meta property="og:title" content="Press Kit — Aarav & Priya" />
        <meta property="og:description" content="Logos, photos, story and contact for wedding editors." />
        <meta property="og:url" content={`${SITE_URL}/press`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "Aarav & Priya — Press Kit",
          url: `${SITE_URL}/press`,
          about: { "@type": "Event", name: "Aarav & Priya Wedding", startDate: "2026-06-17" },
        })}</script>
      </Helmet>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-16 pt-28 sm:pt-36">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/4 top-1/3 h-96 w-96 rounded-full bg-primary/20 blur-[140px]" />
          <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-gold-soft/30 blur-[140px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="container max-w-4xl text-center"
        >
          <p className="font-display text-xs tracking-[0.4em] text-primary uppercase">For the Press</p>
          <h1 className="mt-4 font-display text-4xl sm:text-6xl md:text-7xl">
            Aarav <span className="text-primary">&</span> Priya
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
            A cinematic wedding invitation experience. Use the assets and story below to feature it
            on your blog, magazine, or roundup.
          </p>

          <OrnamentalDivider className="my-10" />

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={downloadAll}
              disabled={zipping}
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
            >
              <Package className="h-4 w-4" />
              {zipping ? "Building zip…" : "Download full press kit (.zip)"}
            </button>
            <Link
              to="/press/request"
              className="group inline-flex items-center gap-2 rounded-full border border-primary/40 px-6 py-3 text-sm font-medium text-foreground transition hover:border-primary hover:bg-primary/10"
            >
              Request to feature
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Story */}
      <section className="container max-w-3xl px-6 py-16">
        <h2 className="font-display text-3xl sm:text-4xl">The Story</h2>
        <div className="mt-6 space-y-5 text-muted-foreground leading-relaxed">
          <p>
            Aarav and Priya met in Bangalore on a rainy October evening — a chance encounter at a
            bookshop that turned into late-night conversations, long flights between cities, and a
            proposal under monsoon skies.
          </p>
          <p>
            Their wedding spans two events: an intimate engagement on{" "}
            <span className="text-foreground">12 February 2026</span> and the main ceremony on{" "}
            <span className="text-foreground">17 June 2026</span>. The digital invitation is designed
            as a walk through their love story — petals, candles, and a quiet score that follows the
            scroll.
          </p>
          <p>
            The site is built as an experiential, scroll-driven piece — not a form. Editors are
            welcome to embed screenshots, share the live link, or reach out for higher-resolution
            assets and quotes.
          </p>
        </div>
      </section>

      {/* Quick facts */}
      <section className="container max-w-5xl px-6 py-10">
        <h2 className="font-display text-3xl sm:text-4xl">Quick Facts</h2>
        <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {facts.map((f) => (
            <div
              key={f.label}
              className="rounded-2xl border border-primary/20 bg-card/60 p-5 backdrop-blur-sm"
            >
              <dt className="text-xs tracking-[0.25em] text-muted-foreground uppercase">{f.label}</dt>
              <dd className="mt-2 font-display text-lg text-foreground">{f.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Logo */}
      <section className="container max-w-5xl px-6 py-16">
        <h2 className="font-display text-3xl sm:text-4xl">Logo & Monogram</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="flex flex-col items-center justify-center rounded-2xl border border-primary/20 bg-background/60 p-10">
            <img src={logo} alt="Aarav & Priya monogram" width={320} height={320} loading="lazy" className="h-auto w-72" />
            <a
              href={logo}
              download="aarav-priya-logo.png"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary/40 px-5 py-2 text-sm transition hover:border-primary hover:bg-primary/10"
            >
              <Download className="h-4 w-4" /> PNG · transparent
            </a>
          </div>
          <div className="flex flex-col items-center justify-center rounded-2xl border border-primary/20 bg-foreground p-10">
            <img src={logo} alt="Aarav & Priya monogram on dark" width={320} height={320} loading="lazy" className="h-auto w-72 invert-0" />
            <a
              href={logo}
              download="aarav-priya-logo-dark.png"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-background/40 px-5 py-2 text-sm text-background transition hover:bg-background/10"
            >
              <Download className="h-4 w-4" /> PNG · for dark backgrounds
            </a>
          </div>
        </div>
      </section>

      {/* Photos */}
      <section className="container max-w-6xl px-6 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-3xl sm:text-4xl">Press Photos</h2>
          <p className="text-sm text-muted-foreground">Click any photo to download the original.</p>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {photos.map((p) => (
            <a
              key={p.name}
              href={p.src}
              download={p.name}
              className="group relative overflow-hidden rounded-2xl border border-primary/20"
            >
              <img
                src={p.src}
                alt={p.label}
                loading="lazy"
                className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-foreground/80 to-transparent p-4 text-background opacity-0 transition group-hover:opacity-100">
                <span className="text-xs">{p.label}</span>
                <Download className="h-4 w-4" />
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="container max-w-3xl px-6 py-16">
        <div className="rounded-3xl border border-primary/20 bg-card/60 p-8 text-center backdrop-blur-md sm:p-12">
          <Mail className="mx-auto h-8 w-8 text-primary" />
          <h2 className="mt-4 font-display text-3xl sm:text-4xl">Press Contact</h2>
          <p className="mt-3 text-muted-foreground">
            Questions, interview requests, or higher-resolution assets — we'd love to hear from you.
          </p>
          <a
            href={`mailto:${PRESS_EMAIL}`}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            <Mail className="h-4 w-4" /> {PRESS_EMAIL}
          </a>
          <div className="mt-8">
            <ShareCard
              url={`${SITE_URL}/press`}
              title="Aarav & Priya — Press Kit"
              text="Press kit for Aarav & Priya's wedding invitation experience"
            />
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link to="/" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
            ← Back to invitation
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Press;
