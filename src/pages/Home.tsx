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

  /* keyboard */
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
      exit={{ opacity: 0, filter: 'blur(4px)' }}
      transition={{ duration: 0.5, ease: EASE }}
      style={{
        minHeight:      'calc(100dvh - 64px)',
        padding:        'clamp(2rem, 8vw, 5rem) clamp(1.2rem, 5vw, 3rem)',
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
          opacity:    { delay: 0.1, duration: 0.55, ease: EASE },
          x:          { delay: 0.1, duration: 0.55, ease: EASE },
          textShadow: { duration: 0.18, repeat: isPlaying ? Infinity : 0 },
        }}
        style={{
          fontFamily: 'var(--pixel)',
          fontSize:   'clamp(4.5rem, 16vw, 13rem)',
          lineHeight: 0.9,
          color:      isPlaying ? '#ffffff' : '#2a2a2a',
          maxWidth:   '60vw',
          transition: 'color 0.9s',
        }}
      >
        ink
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.22, duration: 0.5, ease: EASE }}
        style={{
          fontFamily:    'var(--mono)',
          fontSize:      'clamp(0.58rem, 1.6vw, 0.88rem)',
          letterSpacing: '0.3em',
          marginTop:     '0.7rem',
          marginBottom:  '2.5rem',
          color:         isPlaying ? '#3a3a3a' : '#1c1c1c',
          transition:    'color 0.9s',
        }}
      >
        coder · artist · gamer
      </motion.p>

      {/* TAP TO START prompt */}
      <AnimatePresence>
        {!isPlaying && entered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6, filter: 'blur(4px)' }}
            transition={{ delay: 0.35, duration: 0.45, ease: EASE }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}
          >
            {/* Pulsing bracket */}
            <motion.span
              animate={{ opacity: [0.15, 0.45, 0.15] }}
              transition={{ duration: 1.1, repeat: Infinity }}
              style={{ fontFamily: 'var(--pixel)', fontSize: 'clamp(0.65rem, 1.6vw, 0.85rem)', color: '#303030', letterSpacing: '0.05em' }}
            >
              [
            </motion.span>
            <motion.span
              animate={{ opacity: [0.22, 0.65, 0.22] }}
              transition={{ duration: 1.1, repeat: Infinity, delay: 0.08 }}
              style={{ fontFamily: 'var(--pixel)', fontSize: 'clamp(0.65rem, 1.6vw, 0.85rem)', letterSpacing: '0.32em', color: '#2e2e2e' }}
            >
              TAP TO START
            </motion.span>
            <motion.span
              animate={{ opacity: [0.15, 0.45, 0.15] }}
              transition={{ duration: 1.1, repeat: Infinity }}
              style={{ fontFamily: 'var(--pixel)', fontSize: 'clamp(0.65rem, 1.6vw, 0.85rem)', color: '#303030', letterSpacing: '0.05em' }}
            >
              ]
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Measure radial glow */}
      <AnimatePresence>
        {isMeasure && isPlaying && (
          <motion.div
            key="mv"
            className="fixed inset-0 pointer-events-none"
            style={{ zIndex: 1, background: 'radial-gradient(ellipse at 30% 55%, rgba(0,255,255,0.045) 0%, transparent 62%)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.65 }}
          />
        )}
      </AnimatePresence>

      {/* Flash on start */}
      <AnimatePresence>
        {flash && (
          <motion.div
            className="fixed inset-0 pointer-events-none"
            style={{ backgroundColor: '#ffffff', zIndex: 60 }}
            initial={{ opacity: 0.22 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.38 }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};
