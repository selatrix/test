import { motion, AnimatePresence } from 'framer-motion';
import { useRhythmEngine } from '../hooks/useRhythmEngine';

export const NowPlaying = () => {
  const { isPlaying, currentBeat, isMeasure, bpm } = useRhythmEngine();

  return (
    <AnimatePresence>
      {isPlaying && (
        <motion.div
          key="np"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -8 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'fixed',
            bottom: 'clamp(12px, 2.5vw, 20px)',
            left:   'clamp(12px, 2.5vw, 20px)',
            zIndex: 30,
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(5px, 1vw, 8px)',
          }}
        >
          {/* Pulsing dot */}
          <motion.div
            animate={{
              opacity: [1, 0.15, 1],
              boxShadow: isMeasure
                ? ['0 0 0px #00ffff', '0 0 8px #00ffff', '0 0 0px #00ffff']
                : ['0 0 0px #ffffff44', '0 0 4px #ffffff44', '0 0 0px #ffffff44'],
            }}
            transition={{ duration: 60 / bpm, repeat: Infinity, ease: 'linear' }}
            style={{
              width:        'clamp(5px, 1vw, 7px)',
              height:       'clamp(5px, 1vw, 7px)',
              borderRadius: '50%',
              border:       `1px solid ${isMeasure ? '#00ffff' : '#ffffff55'}`,
              flexShrink:   0,
              transition:   'border-color 0.15s',
            }}
          />

          {/* Beat ticks — 4 squares */}
          <div style={{ display: 'flex', gap: 3 }}>
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                animate={currentBeat % 4 === i
                  ? { backgroundColor: isMeasure ? '#00ffff' : '#ffffff', opacity: 1 }
                  : { backgroundColor: 'transparent', opacity: 0.25 }}
                transition={{ duration: 0.07 }}
                style={{
                  width:  'clamp(4px, 0.8vw, 6px)',
                  height: 'clamp(4px, 0.8vw, 6px)',
                  border: `1px solid ${currentBeat % 4 === i ? (isMeasure ? '#00ffff' : '#ffffff88') : '#ffffff22'}`,
                }}
              />
            ))}
          </div>

          {/* Label */}
          <span
            style={{
              fontFamily:    'var(--mono)',
              fontSize:      'clamp(0.5rem, 1.1vw, 0.6rem)',
              letterSpacing: '0.28em',
              color:         '#ffffff28',
            }}
          >
            NOW PLAYING
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
