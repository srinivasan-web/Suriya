import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Music2, Volume2 } from "lucide-react";

const TRACK_URL =
  "https://cdn.pixabay.com/download/audio/2022/10/18/audio_31c2f1d4e0.mp3?filename=romantic-piano-115128.mp3";

const BAR_COUNT = 5;

const MusicPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);

  const [playing, setPlaying] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [waitingForGesture, setWaitingForGesture] = useState(false);
  const [levels, setLevels] = useState<number[]>(() => Array(BAR_COUNT).fill(0.2));

  const ensureAudioGraph = async () => {
    if (!audioRef.current) return;
    if (!ctxRef.current) {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new Ctx();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.82;
      const source = ctx.createMediaElementSource(audioRef.current);
      source.connect(analyser);
      analyser.connect(ctx.destination);
      ctxRef.current = ctx;
      analyserRef.current = analyser;
    }
    if (ctxRef.current.state === "suspended") {
      await ctxRef.current.resume();
    }
  };

  const tick = () => {
    const analyser = analyserRef.current;
    if (!analyser) return;
    const data = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(data);

    const step = Math.floor(data.length / BAR_COUNT);
    const next = Array.from({ length: BAR_COUNT }, (_, i) => {
      const slice = data.slice(i * step, (i + 1) * step);
      const avg = slice.reduce((a, b) => a + b, 0) / (slice.length || 1);
      return Math.max(0.15, Math.min(1, avg / 180));
    });
    setLevels(next);
    rafRef.current = requestAnimationFrame(tick);
  };

  const startPlayback = async () => {
    const audio = audioRef.current;
    if (!audio) return false;
    try {
      await ensureAudioGraph();
      audio.volume = 0.42;
      await audio.play();
      setPlaying(true);
      setWaitingForGesture(false);
      if (!rafRef.current) tick();
      return true;
    } catch {
      setWaitingForGesture(true);
      return false;
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.42;
    audio.load();
    const events: (keyof WindowEventMap)[] = [
      "pointerdown",
      "touchstart",
      "keydown",
      "scroll",
      "wheel",
    ];

    const unlock = async () => {
      const started = await startPlayback();
      if (started) removeListeners();
    };

    const removeListeners = () => {
      events.forEach((e) => window.removeEventListener(e, unlock));
    };

    unlock();
    audio.addEventListener("canplay", unlock);
    audio.addEventListener("playing", () => {
      setPlaying(true);
      setWaitingForGesture(false);
      if (!rafRef.current) tick();
    });
    events.forEach((e) => window.addEventListener(e, unlock, { passive: true }));

    return () => {
      removeListeners();
      audio.removeEventListener("canplay", unlock);
      audio.pause();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ctxRef.current?.close().catch(() => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      if (playing) {
        audio.pause();
        setPlaying(false);
        setWaitingForGesture(false);
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
        setLevels(Array(BAR_COUNT).fill(0.2));
      } else {
        await startPlayback();
      }
    } catch (err) {
      console.error("Music playback failed", err);
      setWaitingForGesture(true);
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={TRACK_URL}
        autoPlay
        loop
        preload="auto"
        crossOrigin="anonymous"
        playsInline
        aria-hidden="true"
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
              {playing ? "Now playing" : waitingForGesture ? "Tap for music" : "Auto music"}
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
};

export default MusicPlayer;
