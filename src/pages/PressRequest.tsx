import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowLeft, Send, CheckCircle2 } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import OrnamentalDivider from "@/components/OrnamentalDivider";

const SITE_URL = "https://ethereal-events.lovable.app";

const INCLUDE_OPTIONS = [
  "Photos",
  "Our love story",
  "Venue details",
  "Invitation walkthrough",
  "Quotes / interview",
  "Behind-the-scenes",
];

const schema = z.object({
  publication_name: z.string().trim().min(1, "Required").max(200),
  contact_name: z.string().trim().min(1, "Required").max(120),
  email: z.string().trim().email("Invalid email").max(255),
  website_url: z
    .string()
    .trim()
    .max(500)
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  audience_size: z
    .union([z.coerce.number().int().min(0).max(1_000_000_000), z.literal("")])
    .optional(),
  audience_description: z.string().trim().max(1000).optional().or(z.literal("")),
  target_publish_date: z.string().optional().or(z.literal("")),
  what_to_include: z.array(z.string()).max(12),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
});

const initial = {
  publication_name: "",
  contact_name: "",
  email: "",
  website_url: "",
  audience_size: "",
  audience_description: "",
  target_publish_date: "",
  what_to_include: [] as string[],
  message: "",
};

const PressRequest = () => {
  const [form, setForm] = useState(initial);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const update = <K extends keyof typeof initial>(k: K, v: (typeof initial)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const toggleInclude = (opt: string) =>
    setForm((f) => ({
      ...f,
      what_to_include: f.what_to_include.includes(opt)
        ? f.what_to_include.filter((x) => x !== opt)
        : [...f.what_to_include, opt],
    }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form.");
      return;
    }
    setSubmitting(true);
    const v = parsed.data;
    const { error } = await supabase.from("feature_requests").insert({
      publication_name: v.publication_name,
      contact_name: v.contact_name,
      email: v.email,
      website_url: v.website_url || null,
      audience_size: v.audience_size === "" || v.audience_size === undefined ? null : Number(v.audience_size),
      audience_description: v.audience_description || null,
      target_publish_date: v.target_publish_date || null,
      what_to_include: v.what_to_include,
      message: v.message || null,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Something went wrong. Please email press@aaravandpriya.com.");
      return;
    }
    setDone(true);
    toast.success("Thank you — we'll be in touch within a few days 💌");
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background">
      <Helmet>
        <title>Request to Feature — Aarav & Priya</title>
        <meta
          name="description"
          content="Wedding blogs and editors — submit your publication, audience, and what you'd like to feature."
        />
        <link rel="canonical" href={`${SITE_URL}/press/request`} />
        <meta property="og:title" content="Request to Feature — Aarav & Priya" />
        <meta property="og:url" content={`${SITE_URL}/press/request`} />
      </Helmet>

      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/3 h-96 w-96 rounded-full bg-primary/20 blur-[140px]" />
        <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-gold-soft/30 blur-[140px]" />
      </div>

      <div className="container max-w-2xl px-6 pb-24 pt-28 sm:pt-36">
        <Link
          to="/press"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to press kit
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 text-center"
        >
          <p className="font-display text-xs tracking-[0.4em] text-primary uppercase">For Editors</p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl">Request to Feature</h1>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            Tell us about your publication and what you'd like to include. We try to respond within a
            week.
          </p>
          <OrnamentalDivider className="my-8" />
        </motion.div>

        {done ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl border border-primary/30 bg-card/70 p-10 text-center backdrop-blur-md"
          >
            <CheckCircle2 className="mx-auto h-10 w-10 text-primary" />
            <h2 className="mt-4 font-display text-2xl">Thank you 💌</h2>
            <p className="mt-3 text-muted-foreground">
              Your request reached us. We'll get back to you at <strong>{form.email}</strong> within a
              few days.
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary/40 px-5 py-2 text-sm hover:bg-primary/10"
            >
              Back to invitation
            </Link>
          </motion.div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-5 rounded-3xl border border-primary/20 bg-card/60 p-6 backdrop-blur-md sm:p-8"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Publication name *">
                <input
                  required
                  maxLength={200}
                  value={form.publication_name}
                  onChange={(e) => update("publication_name", e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="Your name *">
                <input
                  required
                  maxLength={120}
                  value={form.contact_name}
                  onChange={(e) => update("contact_name", e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="Email *">
                <input
                  type="email"
                  required
                  maxLength={255}
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="Website">
                <input
                  type="url"
                  placeholder="https://"
                  maxLength={500}
                  value={form.website_url}
                  onChange={(e) => update("website_url", e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="Audience size (monthly)">
                <input
                  type="number"
                  min={0}
                  value={form.audience_size}
                  onChange={(e) => update("audience_size", e.target.value as never)}
                  className={inputCls}
                />
              </Field>
              <Field label="Target publish date">
                <input
                  type="date"
                  value={form.target_publish_date}
                  onChange={(e) => update("target_publish_date", e.target.value)}
                  className={inputCls}
                />
              </Field>
            </div>

            <Field label="Audience description">
              <textarea
                rows={2}
                maxLength={1000}
                placeholder="Who reads you? Newlyweds, planners, photographers…"
                value={form.audience_description}
                onChange={(e) => update("audience_description", e.target.value)}
                className={inputCls}
              />
            </Field>

            <div>
              <label className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
                What would you like to include?
              </label>
              <div className="mt-3 flex flex-wrap gap-2">
                {INCLUDE_OPTIONS.map((opt) => {
                  const active = form.what_to_include.includes(opt);
                  return (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => toggleInclude(opt)}
                      className={`rounded-full border px-4 py-1.5 text-sm transition ${
                        active
                          ? "border-primary bg-primary/15 text-foreground"
                          : "border-primary/30 text-muted-foreground hover:border-primary/60 hover:text-foreground"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            <Field label="Anything else?">
              <textarea
                rows={4}
                maxLength={2000}
                placeholder="Angle of the story, deadline, format…"
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                className={inputCls}
              />
            </Field>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
            >
              <Send className="h-4 w-4" />
              {submitting ? "Sending…" : "Send request"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
};

const inputCls =
  "w-full rounded-xl border border-primary/20 bg-background/60 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition focus:border-primary";

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="block">
    <span className="mb-1.5 block text-xs tracking-[0.2em] text-muted-foreground uppercase">
      {label}
    </span>
    {children}
  </label>
);

export default PressRequest;
