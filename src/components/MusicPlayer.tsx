import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Music2, Volume2, SkipForward } from "lucide-react";

const PLAYLIST = [
  {
    source: "soundcloud",
    title: "Mudhal Nee Mudivum Nee",
    url: "https://soundcloud.com/arjungowtham/mudhalneemudivumnee?in=sandeepunnikuttan17/sets/love-and-romantic-tamil-songs&si=fbe12f97401241c9a0bdb7de54a98b7c&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing",
  },
  {
    source: "soundcloud",
    title: "En Jeevan",
    url: "https://soundcloud.com/maheshprasad/en-jeevan-theri-vijay-samantha-atlee-gvprakash-kumar?in=tia-669334887/sets/tamil-love-songs&si=d5d7082f6a6f49668a78ad1efbab794e&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing",
  },
  {
    source: "soundcloud",
    title: "Manasellam Mazhaiye",
    url: "https://soundcloud.com/karthik-7/manasellam-mazhaiye_saguni?in=tia-669334887/sets/tamil-love-songs&si=55e8de62f69f4bf18f1ee9822812795f&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing",
  },
  {
    source: "soundcloud",
    title: "Oh Oh",
    url: "https://soundcloud.com/maheshprasad/thangamagan-oh-oh-anirudh-ravichander-dhanush?in=tia-669334887/sets/tamil-love-songs&si=82aea86969ff4ddeae02dc4a1f96c07a&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing",
  },
  {
    source: "youtube",
    title: "Wedding Music 1",
    videoId: "7ydI06TnEJs",
  },
  {
    source: "youtube",
    title: "Wedding Music 2",
    videoId: "YlMAhUrXFiM",
  },
  {
    source: "youtube",
    title: "Wedding Music 3",
    videoId: "7B_1oIBvWqI",
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
const YOUTUBE_IFRAME_API_SCRIPT = "https://www.youtube.com/iframe_api";
const BAR_COUNT = 5;
const FULL_VOLUME = 100;
const AUTOPLAY_RETRY_DELAYS = [0, 150, 350, 700, 1200, 2000, 3200, 5000];
const YOUTUBE_ENDED = 0;
const YOUTUBE_PLAYING = 1;
const YOUTUBE_PAUSED = 2;

type Track = (typeof PLAYLIST)[number];

type SoundCloudTrack = Extract<Track, { source: "soundcloud" }>;
type YouTubeTrack = Extract<Track, { source: "youtube" }>;

type SoundCloudWidget = {
  bind: (event: string, handler: () => void) => void;
  unbind: (event: string) => void;
  load: (url: string, options?: Record<string, string | boolean | number>) => void;
  play: () => void;
  pause: () => void;
  setVolume: (volume: number) => void;
};

type YouTubePlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  loadVideoById: (options: { videoId: string; startSeconds?: number }) => void;
  setVolume: (volume: number) => void;
  destroy: () => void;
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
    YT?: {
      Player: new (
        element: HTMLElement,
        options: {
          width: string;
          height: string;
          videoId: string;
          playerVars: Record<string, string | number>;
          events: {
            onReady: () => void;
            onStateChange: (event: { data: number }) => void;
            onError: () => void;
          };
        }
      ) => YouTubePlayer;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

const isSoundCloudTrack = (track: Track): track is SoundCloudTrack =>
  track.source === "soundcloud";

const isYouTubeTrack = (track: Track): track is YouTubeTrack => track.source === "youtube";

const soundCloudOptions = (autoPlay: boolean) => ({
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

const MusicPlayer = () => {
  const soundCloudIframeRef = useRef<HTMLIFrameElement | null>(null);
  const soundCloudWidgetRef = useRef<SoundCloudWidget | null>(null);
  const youtubeHostRef = useRef<HTMLDivElement | null>(null);
  const youtubePlayerRef = useRef<YouTubePlayer | null>(null);
  const rafRef = useRef<number | null>(null);
  const autoplayRetryRef = useRef<number | null>(null);
  const currentTrackIndexRef = useRef(0);
  const playbackStartedRef = useRef(false);
  const userPausedRef = useRef(false);

  const [playing, setPlaying] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [waitingForGesture, setWaitingForGesture] = useState(false);
  const [levels, setLevels] = useState<number[]>(() => Array(BAR_COUNT).fill(0.2));
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  const currentTrack = PLAYLIST[currentTrackIndex];
  const firstSoundCloudTrack = PLAYLIST.find(isSoundCloudTrack);
  const firstYouTubeTrack = PLAYLIST.find(isYouTubeTrack);

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

  const clearAutoplayRetry = () => {
    if (autoplayRetryRef.current) {
      window.clearTimeout(autoplayRetryRef.current);
      autoplayRetryRef.current = null;
    }
  };

  const primePlayback = () => {
    userPausedRef.current = false;
    setWaitingForGesture(false);
    startPlayback();
  };

  const markPlaying = () => {
    playbackStartedRef.current = true;
    userPausedRef.current = false;
    clearAutoplayRetry();
    setPlaying(true);
    setWaitingForGesture(false);
    if (!rafRef.current) tick();
  };

  const markPaused = () => {
    playbackStartedRef.current = false;
    setPlaying(false);
    setWaitingForGesture(!userPausedRef.current);
    stopBars();
  };

  const pauseInactivePlayer = (source: Track["source"]) => {
    if (source !== "soundcloud") soundCloudWidgetRef.current?.pause();
    if (source !== "youtube") youtubePlayerRef.current?.pauseVideo();
  };

  const startPlayback = () => {
    const track = PLAYLIST[currentTrackIndexRef.current];
    if (userPausedRef.current) return false;

    try {
      if (isSoundCloudTrack(track)) {
        const widget = soundCloudWidgetRef.current;
        if (!widget) {
          setWaitingForGesture(true);
          return false;
        }
        pauseInactivePlayer(track.source);
        widget.setVolume(FULL_VOLUME);
        widget.play();
      } else {
        const player = youtubePlayerRef.current;
        if (!player) {
          setWaitingForGesture(true);
          return false;
        }
        pauseInactivePlayer(track.source);
        player.setVolume(FULL_VOLUME);
        player.playVideo();
      }

      if (!rafRef.current) tick();
      return true;
    } catch {
      setWaitingForGesture(true);
      return false;
    }
  };

  const loadTrack = (trackIndex: number, autoPlay = playing) => {
    const nextIndex = (trackIndex + PLAYLIST.length) % PLAYLIST.length;
    const nextTrack = PLAYLIST[nextIndex];

    currentTrackIndexRef.current = nextIndex;
    setCurrentTrackIndex(nextIndex);
    setWaitingForGesture(false);
    pauseInactivePlayer(nextTrack.source);

    if (isSoundCloudTrack(nextTrack)) {
      const widget = soundCloudWidgetRef.current;
      if (!widget) {
        setWaitingForGesture(true);
        return;
      }

      widget.setVolume(FULL_VOLUME);
      widget.load(nextTrack.url, soundCloudOptions(autoPlay));
      if (autoPlay) {
        userPausedRef.current = false;
        widget.play();
        if (!rafRef.current) tick();
      } else {
        widget.pause();
        stopBars();
      }
      return;
    }

    const player = youtubePlayerRef.current;
    if (!player) {
      setWaitingForGesture(true);
      return;
    }

    player.setVolume(FULL_VOLUME);
    player.loadVideoById({ videoId: nextTrack.videoId, startSeconds: 0 });

    if (autoPlay) {
      userPausedRef.current = false;
      player.playVideo();
      if (!rafRef.current) tick();
    } else {
      player.pauseVideo();
      stopBars();
    }
  };

  const playNext = () => {
    userPausedRef.current = false;
    loadTrack(currentTrackIndexRef.current + 1, true);
  };

  useEffect(() => {
    const iframe = soundCloudIframeRef.current;
    const youtubeHost = youtubeHostRef.current;
    if (!iframe || !youtubeHost || !firstSoundCloudTrack || !firstYouTubeTrack) return;

    const events: (keyof WindowEventMap)[] = [
      "click",
      "mousedown",
      "mousemove",
      "pointerdown",
      "pointermove",
      "touchstart",
      "keydown",
      "scroll",
      "wheel",
      "focus",
    ];

    const unlock = () => {
      primePlayback();
    };

    const removeListeners = () => {
      events.forEach((eventName) => window.removeEventListener(eventName, unlock));
    };

    const scheduleAutoplayRetry = (attempt = 1) => {
      clearAutoplayRetry();
      if (attempt > AUTOPLAY_RETRY_DELAYS.length || playbackStartedRef.current || userPausedRef.current) {
        return;
      }

      autoplayRetryRef.current = window.setTimeout(() => {
        primePlayback();
        scheduleAutoplayRetry(attempt + 1);
      }, AUTOPLAY_RETRY_DELAYS[attempt - 1]);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && !playbackStartedRef.current) {
        primePlayback();
        scheduleAutoplayRetry();
      }
    };

    const setupSoundCloud = () => {
      if (!window.SC || soundCloudWidgetRef.current) return;

      const widget = window.SC.Widget(iframe);
      soundCloudWidgetRef.current = widget;
      widget.bind(window.SC.Widget.Events.READY, () => {
        widget.setVolume(FULL_VOLUME);
        primePlayback();
        scheduleAutoplayRetry();
      });
      widget.bind(window.SC.Widget.Events.PLAY, () => {
        if (isSoundCloudTrack(PLAYLIST[currentTrackIndexRef.current])) markPlaying();
      });
      widget.bind(window.SC.Widget.Events.PAUSE, () => {
        if (isSoundCloudTrack(PLAYLIST[currentTrackIndexRef.current])) markPaused();
      });
      widget.bind(window.SC.Widget.Events.FINISH, () => {
        if (isSoundCloudTrack(PLAYLIST[currentTrackIndexRef.current])) {
          playbackStartedRef.current = false;
          userPausedRef.current = false;
          loadTrack(currentTrackIndexRef.current + 1, true);
        }
      });
    };

    const setupYouTube = () => {
      if (!window.YT || youtubePlayerRef.current) return;

      youtubePlayerRef.current = new window.YT.Player(youtubeHost, {
        width: "200",
        height: "200",
        videoId: firstYouTubeTrack.videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          modestbranding: 1,
          origin: window.location.origin,
          playsinline: 1,
          rel: 0,
        },
        events: {
          onReady: () => {
            youtubePlayerRef.current?.setVolume(FULL_VOLUME);
            if (isYouTubeTrack(PLAYLIST[currentTrackIndexRef.current])) {
              primePlayback();
              scheduleAutoplayRetry();
            }
          },
          onStateChange: ({ data }) => {
            if (!isYouTubeTrack(PLAYLIST[currentTrackIndexRef.current])) return;

            if (data === YOUTUBE_PLAYING) {
              markPlaying();
              return;
            }

            if (data === YOUTUBE_PAUSED) {
              markPaused();
              return;
            }

            if (data === YOUTUBE_ENDED) {
              playbackStartedRef.current = false;
              userPausedRef.current = false;
              loadTrack(currentTrackIndexRef.current + 1, true);
            }
          },
          onError: () => {
            if (!isYouTubeTrack(PLAYLIST[currentTrackIndexRef.current])) return;
            playbackStartedRef.current = false;
            setPlaying(false);
            setWaitingForGesture(true);
            stopBars();
          },
        },
      });
    };

    let soundCloudScript = document.querySelector<HTMLScriptElement>(
      `script[src="${SOUNDCLOUD_WIDGET_SCRIPT}"]`
    );
    if (soundCloudScript) {
      setupSoundCloud();
    } else {
      soundCloudScript = document.createElement("script");
      soundCloudScript.src = SOUNDCLOUD_WIDGET_SCRIPT;
      soundCloudScript.async = true;
      soundCloudScript.addEventListener("load", setupSoundCloud);
      document.body.appendChild(soundCloudScript);
    }
    setupSoundCloud();

    let youtubeScript = document.querySelector<HTMLScriptElement>(
      `script[src="${YOUTUBE_IFRAME_API_SCRIPT}"]`
    );
    const existingYouTubeCallback = window.onYouTubeIframeAPIReady;

    if (window.YT?.Player) {
      setupYouTube();
    } else {
      window.onYouTubeIframeAPIReady = () => {
        existingYouTubeCallback?.();
        setupYouTube();
      };

      if (!youtubeScript) {
        youtubeScript = document.createElement("script");
        youtubeScript.src = YOUTUBE_IFRAME_API_SCRIPT;
        youtubeScript.async = true;
        document.body.appendChild(youtubeScript);
      }
    }
    setupYouTube();

    events.forEach((eventName) => window.addEventListener(eventName, unlock, { passive: true }));
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.setTimeout(() => {
      primePlayback();
      scheduleAutoplayRetry();
    }, 0);

    return () => {
      removeListeners();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearAutoplayRetry();
      soundCloudScript?.removeEventListener("load", setupSoundCloud);
      window.onYouTubeIframeAPIReady = existingYouTubeCallback;
      soundCloudWidgetRef.current?.unbind(window.SC?.Widget.Events.READY ?? "ready");
      soundCloudWidgetRef.current?.unbind(window.SC?.Widget.Events.PLAY ?? "play");
      soundCloudWidgetRef.current?.unbind(window.SC?.Widget.Events.PAUSE ?? "pause");
      soundCloudWidgetRef.current?.unbind(window.SC?.Widget.Events.FINISH ?? "finish");
      soundCloudWidgetRef.current?.pause();
      youtubePlayerRef.current?.pauseVideo();
      youtubePlayerRef.current?.destroy();
      soundCloudWidgetRef.current = null;
      youtubePlayerRef.current = null;
      stopBars();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = () => {
    try {
      if (playing) {
        userPausedRef.current = true;
        playbackStartedRef.current = false;
        clearAutoplayRetry();
        soundCloudWidgetRef.current?.pause();
        youtubePlayerRef.current?.pauseVideo();
        setPlaying(false);
        setWaitingForGesture(false);
        stopBars();
      } else {
        userPausedRef.current = false;
        startPlayback();
      }
    } catch (err) {
      console.error("Music playback failed", err);
      setWaitingForGesture(true);
    }
  };

  return (
    <>
      {firstSoundCloudTrack && (
        <iframe
          ref={soundCloudIframeRef}
          title="SoundCloud music player"
          src={getSoundCloudPlayerUrl(firstSoundCloudTrack.url)}
          allow="autoplay; encrypted-media"
          aria-hidden="true"
          className="pointer-events-none absolute h-px w-px opacity-0"
        />
      )}

      <div
        ref={youtubeHostRef}
        aria-hidden="true"
        className="pointer-events-none fixed -bottom-[240px] -right-[240px] h-[200px] w-[200px] opacity-0"
      />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, delay: 1.8, ease: [0.22, 1, 0.36, 1] }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        className="fixed bottom-3 right-3 z-50 sm:bottom-6 sm:right-6"
      >
        <div className="relative flex items-center gap-1.5 rounded-full glass-card px-2 py-2 shadow-bloom backdrop-blur-xl sm:gap-3 sm:px-3 sm:py-3">
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
            className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-gold text-background transition-transform duration-300 hover:scale-110 active:scale-95 sm:h-11 sm:w-11"
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
              <Pause className="relative h-3.5 w-3.5 sm:h-4 sm:w-4" fill="currentColor" />
            ) : waitingForGesture ? (
              <Volume2 className="relative h-3.5 w-3.5 sm:h-4 sm:w-4" />
            ) : (
              <Play className="relative ml-0.5 h-3.5 w-3.5 sm:h-4 sm:w-4" fill="currentColor" />
            )}
          </button>

          <button
            type="button"
            onClick={playNext}
            aria-label="Play next song"
            className="relative flex h-8 w-8 items-center justify-center rounded-full border border-primary/30 text-foreground/80 transition hover:border-primary/60 hover:text-foreground active:scale-95 sm:h-11 sm:w-11"
          >
            <SkipForward className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="currentColor" />
          </button>

          <div className="flex h-5 items-end gap-[2px] pr-1 sm:h-8 sm:gap-[3px] sm:pr-2">
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
