import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Music2, Volume2, SkipForward } from "lucide-react";

const PLAYLIST = [
  {
    title: "Mudhal Nee Mudivum Nee",
    url: "https://soundcloud.com/arjungowtham/mudhalneemudivumnee?in=sandeepunnikuttan17/sets/love-and-romantic-tamil-songs&si=fbe12f97401241c9a0bdb7de54a98b7c&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing",
  },
  {
    title: "En Jeevan",
    url: "https://soundcloud.com/maheshprasad/en-jeevan-theri-vijay-samantha-atlee-gvprakash-kumar?in=tia-669334887/sets/tamil-love-songs&si=d5d7082f6a6f49668a78ad1efbab794e&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing",
  },
  {
    title: "Manasellam Mazhaiye",
    url: "https://soundcloud.com/karthik-7/manasellam-mazhaiye_saguni?in=tia-669334887/sets/tamil-love-songs&si=55e8de62f69f4bf18f1ee9822812795f&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing",
  },
  {
    title: "Oh Oh",
    url: "https://soundcloud.com/maheshprasad/thangamagan-oh-oh-anirudh-ravichander-dhanush?in=tia-669334887/sets/tamil-love-songs&si=82aea86969ff4ddeae02dc4a1f96c07a&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing",
  },
] as const;

const getSoundCloudPlayerUrl = (trackUrl: string, autoPlay = true) =>
  `https://w.soundcloud.com/player/?${new URLSearchParams({
    url: trackUrl,
    auto_play: String(autoPlay),
    buying: "false",
    sharing: "false",
    download: "false",
    show_artwork: "false",
    show_comments: "false",
    show_playcount: "false",
    show_user: "false",
    hide_related: "true",
    visual: "false",
    color: "#b98b45",
  }).toString()}`;

const SOUNDCLOUD_WIDGET_SCRIPT = "https://w.soundcloud.com/player/api.js";

const BAR_COUNT = 5;

type SoundCloudWidget = {
  bind: (event: string, handler: () => void) => void;
  unbind: (event: string) => void;
  load: (url: string, options?: Record<string, string | boolean | number>) => void;
  play: () => void;
  pause: () => void;
  setVolume: (volume: number) => void;
};

declare global {
  interface Window {
    SC?: {
      Widget: {
        (iframe: HTMLIFrameElement): SoundCloudWidget;
        Events: {
          READY: string;
          PLAY: string;
          PAUSE: string;
          FINISH: string;
        };
      };
    };
  }
}

const MusicPlayer = () => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const widgetRef = useRef<SoundCloudWidget | null>(null);
  const rafRef = useRef<number | null>(null);
  const currentTrackIndexRef = useRef(0);

  const [playing, setPlaying] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [waitingForGesture, setWaitingForGesture] = useState(false);
  const [levels, setLevels] = useState<number[]>(() => Array(BAR_COUNT).fill(0.2));
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  const currentTrack = PLAYLIST[currentTrackIndex];

  const tick = () => {
    const next = Array.from({ length: BAR_COUNT }, (_, i) => {
      const pulse = Math.sin(Date.now() / 180 + i * 0.9);
      return Math.max(0.2, Math.min(1, 0.55 + pulse * 0.35));
    });
    setLevels(next);
    rafRef.current = requestAnimationFrame(tick);
  };

  const stopBars = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setLevels(Array(BAR_COUNT).fill(0.2));
  };

  const startPlayback = () => {
    const widget = widgetRef.current;
    if (!widget) {
      setWaitingForGesture(true);
      return false;
    }
    try {
      widget.setVolume(42);
      widget.play();
      setPlaying(true);
      setWaitingForGesture(false);
      if (!rafRef.current) tick();
      return true;
    } catch {
      setWaitingForGesture(true);
      return false;
    }
  };

  const loadTrack = (trackIndex: number, autoPlay = playing) => {
    const widget = widgetRef.current;
    const nextIndex = (trackIndex + PLAYLIST.length) % PLAYLIST.length;
    const nextTrack = PLAYLIST[nextIndex];

    currentTrackIndexRef.current = nextIndex;
    setCurrentTrackIndex(nextIndex);
    setWaitingForGesture(false);

    if (!widget) {
      setWaitingForGesture(true);
      return;
    }

    widget.load(nextTrack.url, {
      auto_play: autoPlay,
      buying: false,
      sharing: false,
      download: false,
      show_artwork: false,
      show_comments: false,
      show_playcount: false,
      show_user: false,
      hide_related: true,
      visual: false,
      color: "#b98b45",
    });

    if (autoPlay && !rafRef.current) tick();
  };

  const playNext = () => {
    loadTrack(currentTrackIndexRef.current + 1, playing || waitingForGesture);
  };

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const events: (keyof WindowEventMap)[] = [
      "pointerdown",
      "touchstart",
      "keydown",
      "scroll",
      "wheel",
    ];

    const unlock = () => {
      const started = startPlayback();
      if (started) removeListeners();
    };

    const removeListeners = () => {
      events.forEach((e) => window.removeEventListener(e, unlock));
    };

    const setupWidget = () => {
      if (!window.SC || widgetRef.current) return;

      const widget = window.SC.Widget(iframe);
      widgetRef.current = widget;
      widget.bind(window.SC.Widget.Events.READY, () => {
        widget.setVolume(42);
        unlock();
      });
      widget.bind(window.SC.Widget.Events.PLAY, () => {
        setPlaying(true);
        setWaitingForGesture(false);
        if (!rafRef.current) tick();
      });
      widget.bind(window.SC.Widget.Events.PAUSE, () => {
        setPlaying(false);
        setWaitingForGesture(false);
        stopBars();
      });
      widget.bind(window.SC.Widget.Events.FINISH, () => {
        loadTrack(currentTrackIndexRef.current + 1, true);
      });
    };

    let script = document.querySelector<HTMLScriptElement>(
      `script[src="${SOUNDCLOUD_WIDGET_SCRIPT}"]`
    );

    if (script) {
      setupWidget();
    } else {
      script = document.createElement("script");
      script.src = SOUNDCLOUD_WIDGET_SCRIPT;
      script.async = true;
      script.addEventListener("load", setupWidget);
      document.body.appendChild(script);
    }

    events.forEach((e) => window.addEventListener(e, unlock, { passive: true }));

    return () => {
      removeListeners();
      script?.removeEventListener("load", setupWidget);
      widgetRef.current?.unbind(window.SC?.Widget.Events.READY ?? "ready");
      widgetRef.current?.unbind(window.SC?.Widget.Events.PLAY ?? "play");
      widgetRef.current?.unbind(window.SC?.Widget.Events.PAUSE ?? "pause");
      widgetRef.current?.unbind(window.SC?.Widget.Events.FINISH ?? "finish");
      widgetRef.current?.pause();
      stopBars();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = () => {
    const widget = widgetRef.current;
    if (!widget) {
      setWaitingForGesture(true);
      return;
    }
    try {
      if (playing) {
        widget.pause();
        setPlaying(false);
        setWaitingForGesture(false);
        stopBars();
      } else {
        startPlayback();
      }
    } catch (err) {
      console.error("Music playback failed", err);
      setWaitingForGesture(true);
    }
  };

  return (
    <>
      <iframe
        ref={iframeRef}
        title={currentTrack.title}
        src={getSoundCloudPlayerUrl(PLAYLIST[0].url)}
        allow="autoplay"
        aria-hidden="true"
        className="pointer-events-none absolute h-px w-px opacity-0"
      />
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, delay: 1.8, ease: [0.22, 1, 0.36, 1] }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6"
      >
        <div className="relative flex items-center gap-2 rounded-full glass-card px-2.5 py-2.5 shadow-bloom backdrop-blur-xl sm:gap-3 sm:px-3 sm:py-3">
        <AnimatePresence>
          {playing && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="pointer-events-none absolute -inset-1 rounded-full bg-gradient-petal opacity-60 blur-xl"
            />
          )}
        </AnimatePresence>

        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause ambient music" : "Play ambient music"}
          className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-gold text-background transition-transform duration-300 hover:scale-110 active:scale-95 sm:h-11 sm:w-11"
        >
          <AnimatePresence>
            {playing && (
              <motion.span
                key="ripple"
                initial={{ opacity: 0.6, scale: 1 }}
                animate={{ opacity: 0, scale: 1.8 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.6, repeat: 999999, ease: "easeOut" }}
                className="absolute inset-0 rounded-full bg-primary/40"
              />
            )}
          </AnimatePresence>
          {playing ? (
            <Pause className="relative h-4 w-4" fill="currentColor" />
          ) : waitingForGesture ? (
            <Volume2 className="relative h-4 w-4" />
          ) : (
            <Play className="relative ml-0.5 h-4 w-4" fill="currentColor" />
          )}
        </button>

        <button
          type="button"
          onClick={playNext}
          aria-label="Play next song"
          className="relative flex h-9 w-9 items-center justify-center rounded-full border border-primary/30 text-foreground/80 transition hover:border-primary/60 hover:text-foreground active:scale-95 sm:h-11 sm:w-11"
        >
          <SkipForward className="h-4 w-4" fill="currentColor" />
        </button>

        <div className="flex h-6 items-end gap-[2px] pr-1.5 sm:h-8 sm:gap-[3px] sm:pr-2">
          {levels.map((lvl, i) => (
            <motion.span
              key={i}
              animate={{
                height: `${Math.max(12, lvl * 100)}%`,
                opacity: playing ? 0.95 : 0.5,
              }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              style={{ height: "20%" }}
              className="w-[3px] rounded-full bg-gradient-to-t from-primary via-gold to-primary-glow"
            />
          ))}
        </div>

        <AnimatePresence>
          {(hovered || waitingForGesture) && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.3 }}
              className="absolute right-full mr-3 flex items-center gap-2 whitespace-nowrap rounded-full glass-card px-4 py-2 text-xs uppercase tracking-[0.25em] text-foreground/80"
            >
              <Music2 className="h-3 w-3" />
              {playing
                ? currentTrack.title
                : waitingForGesture
                  ? "Tap for music"
                  : `${currentTrack.title} ready`}
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
};

export default MusicPlayer;
