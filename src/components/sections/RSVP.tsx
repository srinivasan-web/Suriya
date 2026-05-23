import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import OrnamentalDivider from "../OrnamentalDivider";
import { toast } from "sonner";

const RSVP = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    guests: "1",
    attending: "yes",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) {
      toast.error("Please tell us your name");
      return;
    }
    setSubmitted(true);
    toast.success("Thank you! We can't wait to celebrate with you");
  };

  return (
    <section className="relative overflow-hidden bg-background py-20 sm:py-28 md:py-48">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/3 top-1/4 h-96 w-96 rounded-[45%] border border-primary/20 blur-[80px]" />
        <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-[42%] border border-gold-soft/40 blur-[80px]" />
      </div>

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 text-center sm:mb-16"
        >
          <p className="font-script text-2xl text-primary sm:text-3xl">will you be there?</p>
          <h2 className="mt-2 font-display text-4xl sm:text-5xl md:text-7xl">RSVP</h2>
          <OrnamentalDivider className="mt-6 sm:mt-8" />
          <p className="mx-auto mt-5 max-w-xl text-sm text-muted-foreground sm:mt-6 sm:text-base">
            Your presence would mean the world. Kindly respond by January 20, 2026.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-2xl"
        >
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="glass-card relative overflow-hidden rounded-3xl p-12 text-center shadow-bloom"
              >
                {Array.from({ length: 20 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ y: -20, x: 0, opacity: 0, rotate: 0 }}
                    animate={{
                      y: [0, 400],
                      x: [0, (Math.random() - 0.5) * 300],
                      opacity: [0, 1, 0],
                      rotate: 360,
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      delay: Math.random() * 1,
                      ease: "easeOut",
                    }}
                    className="pointer-events-none absolute"
                    style={{ left: `${Math.random() * 100}%`, top: 0 }}
                  >
                    <div className="h-3 w-3 rounded-full bg-primary" />
                  </motion.div>
                ))}
                <div className="mx-auto h-16 w-16 rounded-full bg-gradient-petal shadow-bloom" />
                <h3 className="mt-6 font-display text-4xl">Thank you!</h3>
                <p className="mt-4 text-muted-foreground">
                  We've received your response, {form.name}. <br />
                  See you on the dance floor.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card space-y-5 rounded-3xl p-6 shadow-soft sm:space-y-6 sm:p-8 md:p-12"
              >
                <div>
                  <label className="font-display text-sm uppercase tracking-[0.2em] text-foreground/70">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your beautiful name"
                    className="mt-2 w-full rounded-xl border border-border bg-background/50 px-5 py-4 font-display text-lg outline-none transition-all duration-300 placeholder:text-muted-foreground/50 focus:border-primary focus:bg-background focus:shadow-soft"
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="font-display text-sm uppercase tracking-[0.2em] text-foreground/70">
                      Will you attend?
                    </label>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {["yes", "no"].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setForm({ ...form, attending: opt })}
                          className={`rounded-xl border px-4 py-3 font-display text-lg capitalize transition-all duration-300 ${
                            form.attending === opt
                              ? "border-primary bg-gradient-petal shadow-soft"
                              : "border-border bg-background/50 hover:border-primary/50"
                          }`}
                        >
                          {opt === "yes" ? "Joyfully" : "Regrets"}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="font-display text-sm uppercase tracking-[0.2em] text-foreground/70">
                      Number of Guests
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={form.guests}
                      onChange={(e) => setForm({ ...form, guests: e.target.value })}
                      className="mt-2 w-full rounded-xl border border-border bg-background/50 px-5 py-3 font-display text-lg outline-none transition-all duration-300 focus:border-primary focus:bg-background focus:shadow-soft"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-display text-sm uppercase tracking-[0.2em] text-foreground/70">
                    A message for the couple
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={4}
                    placeholder="Share your wishes, blessings, or a memory..."
                    className="mt-2 w-full resize-none rounded-xl border border-border bg-background/50 px-5 py-4 outline-none transition-all duration-300 placeholder:text-muted-foreground/50 focus:border-primary focus:bg-background focus:shadow-soft"
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative w-full overflow-hidden rounded-full bg-gradient-gold py-4 font-display text-lg text-foreground shadow-gold sm:py-5 sm:text-xl"
                >
                  <span className="relative z-10">Send with Love</span>
                  <span className="absolute inset-0 bg-gradient-petal opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default RSVP;
