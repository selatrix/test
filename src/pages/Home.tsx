import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useRhythmEngine } from '../hooks/useRhythmEngine';

const EASE = [0.22, 1, 0.36, 1] as const;

export const Home = () => {
  const { isPlaying, start, isMeasure } = useRhythmEngine();
  const [flash,   setFlash]   = useState(false);
  const [entered, setEntered] = useState(false);

  const handleStart = () => {
    if (isPlaying) return;
    setFlash(true);
    setTimeout(() => setFlash(false), 380);
    setTimeout(() => start(), 80);
  };

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 120);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (isPlaying) return;
    const onKey = () => handleStart();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isPlaying]);

  return (
    <motion.div
      className="flex-1 z-20 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
      style={{
        minHeight:      'calc(100dvh - 64px)',
        padding:        'clamp(2.5rem, 9vw, 6rem) clamp(1.5rem, 5vw, 3.5rem)',
        cursor:         'none',
        display:        'flex',
        flexDirection:  'column',
        justifyContent: 'center',
      }}
      onClick={handleStart}
      onTouchEnd={(e) => { e.preventDefault(); handleStart(); }}
    >
      {/* Name */}
      <motion.h1
        initial={{ opacity: 0, x: -28 }}
        animate={isPlaying
          ? { opacity: 1, x: 0, textShadow: ['4px 0 0 #ff00ff,-4px 0 0 #00ffff', '-4px 0 0 #ff00ff,4px 0 0 #00ffff', '4px 0 0 #ff00ff,-4px 0 0 #00ffff'] }
          : { opacity: 1, x: 0, textShadow: 'none' }}
        transition={{
          opacity:    { delay: 0.08, duration: 0.5, ease: EASE },
          x:          { delay: 0.08, duration: 0.5, ease: EASE },
          textShadow: { duration: 0.18, repeat: isPlaying ? Infinity : 0 },
        }}
        style={{
          fontFamily: 'var(--pixel)',
          fontSize:   'clamp(5rem, 17vw, 14rem)',
          lineHeight: 0.9,
          color:      isPlaying ? '#ffffff' : '#2a2a2a',
          maxWidth:   '62vw',
          transition: 'color 0.9s',
        }}
      >
        ink
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, x: -14 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.18, duration: 0.45, ease: EASE }}
        style={{
          fontFamily:    'var(--mono)',
          fontSize:      'clamp(0.72rem, 1.5vw, 1.05rem)',
          letterSpacing: '0.28em',
          marginTop:     '0.8rem',
          marginBottom:  '2.8rem',
          color:         isPlaying ? '#3a3a3a' : '#1c1c1c',
          transition:    'color 0.9s',
        }}
      >
        coder · artist · gamer
      </motion.p>

      {/* TAP TO START */}
      <AnimatePresence>
        {!isPlaying && entered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ delay: 0.32, duration: 0.4, ease: EASE }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}
          >
            <motion.span
              animate={{ opacity: [0.12, 0.4, 0.12] }}
              transition={{ duration: 1.1, repeat: Infinity }}
              style={{ fontFamily: 'var(--pixel)', fontSize: 'clamp(0.7rem, 1.4vw, 0.95rem)', color: '#2e2e2e', letterSpacing: '0.05em' }}
            >[</motion.span>
            <motion.span
              animate={{ opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 1.1, repeat: Infinity, delay: 0.08 }}
              style={{ fontFamily: 'var(--pixel)', fontSize: 'clamp(0.7rem, 1.4vw, 0.95rem)', letterSpacing: '0.32em', color: '#2a2a2a' }}
            >TAP TO START</motion.span>
            <motion.span
              animate={{ opacity: [0.12, 0.4, 0.12] }}
              transition={{ duration: 1.1, repeat: Infinity }}
              style={{ fontFamily: 'var(--pixel)', fontSize: 'clamp(0.7rem, 1.4vw, 0.95rem)', color: '#2e2e2e', letterSpacing: '0.05em' }}
            >]</motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Measure radial glow */}
      <AnimatePresence>
        {isMeasure && isPlaying && (
          <motion.div
            key="mv"
            className="fixed inset-0 pointer-events-none"
            style={{ zIndex: 1, background: 'radial-gradient(ellipse at 28% 52%, rgba(0,255,255,0.04) 0%, transparent 60%)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.6 }}
          />
        )}
      </AnimatePresence>

      {/* Start flash */}
      <AnimatePresence>
        {flash && (
          <motion.div
            className="fixed inset-0 pointer-events-none"
            style={{ backgroundColor: '#ffffff', zIndex: 60 }}
            initial={{ opacity: 0.2 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.36 }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};
