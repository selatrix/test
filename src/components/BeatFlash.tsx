import { motion, AnimatePresence } from 'framer-motion';
import { useRhythmEngine } from '../hooks/useRhythmEngine';

export const BeatFlash = () => {
  const { currentBeat, isPlaying, isMeasure } = useRhythmEngine();

  if (!isPlaying) return null;

  return (
    <AnimatePresence>
      <motion.div
        key={`flash-${currentBeat}`}
        initial={{ opacity: isMeasure ? 0.09 : 0.03 }}
        animate={{ opacity: 0 }}
        transition={{ duration: isMeasure ? 0.38 : 0.2, ease: 'easeOut' }}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 8,
          pointerEvents: 'none',
          backgroundColor: isMeasure ? '#00ffff' : '#ffffff',
        }}
      />
    </AnimatePresence>
  );
};
