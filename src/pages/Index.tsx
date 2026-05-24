import Hero from "@/components/sections/Hero";
import Events from "@/components/sections/Events";
import Venue from "@/components/sections/Venue";
import SacredPromises from "@/components/sections/SacredPromises";
import RSVP from "@/components/sections/RSVP";
import Ending from "@/components/sections/Ending";
import PetalRain from "@/components/PetalRain";
import MusicPlayer from "@/components/MusicPlayer";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import ShareCard from "@/components/ShareCard";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background">
      <Helmet>
        <link rel="canonical" href="https://ethereal-events.lovable.app/" />
        <link rel="preconnect" href="https://w.soundcloud.com" />
        <link rel="preconnect" href="https://api.soundcloud.com" />
        <link rel="preconnect" href="https://i1.sndcdn.com" />
      </Helmet>
      <PetalRain count={26} />
      <Hero />
      <Events />
      <Venue />
      <SacredPromises />
  
      <div id="rsvp">
        <RSVP />
      </div>
      <Ending />

      <section className="relative bg-foreground py-16 text-background">
        <div className="container max-w-3xl px-6">
          <ShareCard
            url="https://ethereal-events.lovable.app/"
            title="Aarav & Priya - Wedding Invitation"
            text="You're invited to celebrate Aarav & Priya"
          />
          <nav className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs tracking-[0.3em] uppercase text-background/60">
            <Link to="/stories" className="transition hover:text-primary-glow">
              Couple Stories
            </Link>
            <span className="text-background/20">/</span>
            <Link to="/press" className="transition hover:text-primary-glow">
              Press Kit
            </Link>
            <span className="text-background/20">/</span>
            <Link to="/press/request" className="transition hover:text-primary-glow">
              Request to Feature
            </Link>
          </nav>
        </div>
      </section>

      <MusicPlayer />
      <ThemeSwitcher />
    </main>
  );
};

export default Index;
