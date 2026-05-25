import { useState, useEffect, createContext, useContext, useRef, ReactNode } from 'react';

const TARGET_VOL = 0.72;

type RhythmContextType = {
  isPlaying:   boolean;
  hasStarted:  boolean;
  start:       () => void;
  stop:        () => void;
  currentBeat: number;
  isMeasure:   boolean;
  bpm:         number;
};

const RhythmContext = createContext<RhythmContextType | null>(null);

export const useRhythmEngine = () => {
  const ctx = useContext(RhythmContext);
  if (!ctx) throw new Error('useRhythmEngine must be used within RhythmProvider');
  return ctx;
};

export const RhythmProvider = ({ children }: { children: ReactNode }) => {
  const [isPlaying,   setIsPlaying]   = useState(false);
  const [hasStarted,  setHasStarted]  = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  const bpm = 140;

  const audioRef    = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<number | null>(null);
  const beatRef     = useRef(0);
  const fadeRef     = useRef<number | null>(null);

  /* ─── Init audio ─── */
  useEffect(() => {
    const audio = new Audio('/bg-music.mp3');
    audio.loop   = true;
    audio.volume = TARGET_VOL;
    audioRef.current = audio;
    return () => { audio.pause(); audio.src = ''; };
  }, []);

  /* ─── Tab visibility: smooth volume fade ─── */
  useEffect(() => {
    const fadeTo = (target: number) => {
      const audio = audioRef.current;
      if (!audio) return;
      if (fadeRef.current) clearInterval(fadeRef.current);
      fadeRef.current = window.setInterval(() => {
        const diff = target - audio.volume;
        if (Math.abs(diff) < 0.025) {
          audio.volume = Math.max(0, Math.min(1, target));
          clearInterval(fadeRef.current!);
          fadeRef.current = null;
        } else {
          audio.volume = Math.max(0, Math.min(1, audio.volume + diff * 0.18));
        }
      }, 24);
    };

    const onVis = () => fadeTo(document.hidden ? 0 : TARGET_VOL);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      document.removeEventListener('visibilitychange', onVis);
      if (fadeRef.current) clearInterval(fadeRef.current);
    };
  }, []);

  /* ─── Start ─── */
  const start = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 0;
      audio.volume      = TARGET_VOL;
      audio.play().catch(() => {});
    }
    setIsPlaying(true);
    setHasStarted(true);
    beatRef.current = 0;

    const msPerBeat = (60 / bpm) * 1000;
    const tick = () => {
      beatRef.current += 1;
      setCurrentBeat(beatRef.current);
      intervalRef.current = window.setTimeout(tick, msPerBeat);
    };
    intervalRef.current = window.setTimeout(tick, msPerBeat);
  };

  /* ─── Stop ─── */
  const stop = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
    if (intervalRef.current) clearTimeout(intervalRef.current);
  };

  useEffect(() => () => { stop(); }, []);

  const isMeasure = isPlaying && currentBeat % 4 === 0;

  return (
    <RhythmContext.Provider value={{ isPlaying, hasStarted, start, stop, currentBeat, isMeasure, bpm }}>
      {children}
    </RhythmContext.Provider>
  );
};
