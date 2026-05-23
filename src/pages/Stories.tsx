import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, ExternalLink, Star, Quote } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import OrnamentalDivider from "@/components/OrnamentalDivider";
import ShareCard from "@/components/ShareCard";

const SITE_URL = "https://ethereal-events.lovable.app";

type Story = {
  id: string;
  couple_names: string;
  story: string;
  testimonial_quote: string;
  photo_url: string | null;
  wedding_date: string | null;
  location: string | null;
  link_back_url: string | null;
  rating: number;
  featured: boolean;
};

const Stories = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("couple_stories")
        .select("*")
        .eq("published", true)
        .order("display_order", { ascending: true });
      setStories((data as Story[]) ?? []);
      setLoading(false);
    })();
  }, []);

  const avgRating = stories.length
    ? Number(
        (stories.reduce((s, x) => s + (x.rating ?? 5), 0) / stories.length).toFixed(2)
      )
    : 5;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Aarav & Priya Wedding Invitation Experience",
    description:
      "A cinematic, scroll-driven digital wedding invitation experience used by real couples.",
    brand: { "@type": "Brand", name: "Aarav & Priya" },
    aggregateRating: stories.length
      ? {
          "@type": "AggregateRating",
          ratingValue: avgRating,
          reviewCount: stories.length,
        }
      : undefined,
    review: stories.map((s) => ({
      "@type": "Review",
      author: { "@type": "Person", name: s.couple_names },
      datePublished: s.wedding_date ?? undefined,
      reviewBody: s.testimonial_quote,
      reviewRating: {
        "@type": "Rating",
        ratingValue: s.rating ?? 5,
        bestRating: 5,
      },
    })),
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background">
      <Helmet>
        <title>Couple Stories & Testimonials — Aarav & Priya</title>
        <meta
          name="description"
          content="Real couples who used the Aarav & Priya wedding invitation experience. Stories, photos, and links back to their celebrations."
        />
        <link rel="canonical" href={`${SITE_URL}/stories`} />
        <meta property="og:title" content="Couple Stories — Aarav & Priya" />
        <meta property="og:description" content="Real couples and their invitation experiences." />
        <meta property="og:url" content={`${SITE_URL}/stories`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/20 blur-[140px]" />
        <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-gold-soft/30 blur-[140px]" />
      </div>

      <section className="container max-w-5xl px-6 pb-16 pt-28 sm:pt-36">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to invitation
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 text-center"
        >
          <p className="font-display text-xs tracking-[0.4em] text-primary uppercase">
            Real Celebrations
          </p>
          <h1 className="mt-3 font-display text-4xl sm:text-6xl">Couple Stories</h1>
          <p className="mx-auto mt-5 max-w-2xl text-muted-foreground">
            Couples around the world have used this invitation experience for their own
            celebrations. Here are a few of them.
          </p>
          <OrnamentalDivider className="my-10" />
        </motion.div>

        {loading ? (
          <div className="grid gap-8 md:grid-cols-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-72 animate-pulse rounded-3xl bg-card/50" />
            ))}
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {stories.map((s, i) => (
              <motion.article
                key={s.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="group overflow-hidden rounded-3xl border border-primary/20 bg-card/60 backdrop-blur-md transition hover:border-primary/40"
              >
                {s.photo_url && (
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={s.photo_url}
                      alt={`${s.couple_names} wedding`}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-6 sm:p-8">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="font-display text-2xl">{s.couple_names}</h2>
                    <div className="flex">
                      {Array.from({ length: s.rating ?? 5 }).map((_, k) => (
                        <Star key={k} className="h-4 w-4 fill-primary text-primary" />
                      ))}
                    </div>
                  </div>
                  {(s.wedding_date || s.location) && (
                    <p className="mt-1 text-xs tracking-[0.2em] text-muted-foreground uppercase">
                      {s.wedding_date && new Date(s.wedding_date).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                      {s.wedding_date && s.location ? " · " : ""}
                      {s.location}
                    </p>
                  )}
                  <Quote className="mt-5 h-5 w-5 text-primary/60" />
                  <p className="mt-2 font-display text-lg leading-snug">"{s.testimonial_quote}"</p>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{s.story}</p>
                  {s.link_back_url && (
                    <a
                      href={s.link_back_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                    >
                      Visit their invitation <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        )}

        <div className="mt-16 text-center">
          <h2 className="font-display text-2xl">Want to be featured?</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            If you used this invitation for your wedding, we'd love to add your story.
          </p>
          <Link
            to="/press/request"
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-primary/40 px-5 py-2.5 text-sm hover:bg-primary/10"
          >
            Submit your story
          </Link>
          <div className="mt-10">
            <ShareCard
              url={`${SITE_URL}/stories`}
              title="Couple Stories — Aarav & Priya"
              text="Real couples and their invitation experiences ✨"
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Stories;
