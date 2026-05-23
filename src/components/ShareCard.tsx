import { useState } from "react";
import { Copy, Check, Share2, Twitter, Facebook, Mail, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

type Props = {
  url?: string;
  title?: string;
  text?: string;
  className?: string;
};

const ShareCard = ({
  url = typeof window !== "undefined" ? window.location.href : "https://ethereal-events.lovable.app/",
  title = "Aarav & Priya - Wedding Invitation",
  text = "You're invited to celebrate Aarav & Priya",
  className = "",
}: Props) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Couldn't copy. Try long-pressing the link.");
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch {
        /* user cancelled */
      }
    } else {
      handleCopy();
    }
  };

  const enc = encodeURIComponent;
  const links = [
    { label: "Share", icon: Share2, action: handleNativeShare, href: undefined as string | undefined },
    { label: "X", icon: Twitter, href: `https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(text)}` },
    { label: "Facebook", icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}` },
    { label: "WhatsApp", icon: MessageCircle, href: `https://wa.me/?text=${enc(`${text} ${url}`)}` },
    { label: "Email", icon: Mail, href: `mailto:?subject=${enc(title)}&body=${enc(`${text}\n\n${url}`)}` },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`mx-auto flex max-w-md flex-col items-center gap-4 rounded-2xl border border-primary/20 bg-card/60 p-5 backdrop-blur-md ${className}`}
    >
      <p className="font-display text-sm tracking-[0.3em] text-muted-foreground uppercase">
        Share this invitation
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {links.map(({ label, icon: Icon, href, action }) =>
          href ? (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Share on ${label}`}
              className="group flex h-11 w-11 items-center justify-center rounded-full border border-primary/30 bg-background/60 text-foreground/80 transition hover:border-primary hover:bg-primary/10 hover:text-primary"
            >
              <Icon className="h-4 w-4 transition group-hover:scale-110" />
            </a>
          ) : (
            <button
              key={label}
              onClick={action}
              aria-label={label}
              className="group flex h-11 w-11 items-center justify-center rounded-full border border-primary/30 bg-background/60 text-foreground/80 transition hover:border-primary hover:bg-primary/10 hover:text-primary"
            >
              <Icon className="h-4 w-4 transition group-hover:scale-110" />
            </button>
          ),
        )}
      </div>

      <button
        onClick={handleCopy}
        className="flex w-full items-center justify-between gap-3 rounded-xl border border-primary/20 bg-background/40 px-4 py-2.5 text-left text-xs text-muted-foreground transition hover:border-primary/50 hover:text-foreground"
      >
        <span className="truncate font-mono">{url.replace(/^https?:\/\//, "")}</span>
        {copied ? (
          <Check className="h-4 w-4 shrink-0 text-primary" />
        ) : (
          <Copy className="h-4 w-4 shrink-0" />
        )}
      </button>
    </motion.div>
  );
};

export default ShareCard;
