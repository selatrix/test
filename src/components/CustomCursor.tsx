import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [clicking, setClicking] = useState(false);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    const onMouseDown = () => setClicking(true);
    const onMouseUp = () => setClicking(false);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 99999,
        x: position.x - 16,
        y: position.y - 16,
      }}
    >
      {/* Outer ring */}
      <motion.div
        animate={{
          scale: clicking ? 0.8 : 1,
          borderColor: clicking ? '#00ffff' : '#ffffff'
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 20 }}
        style={{
          width: 32,
          height: 32,
          border: '2px solid white',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Inner dot */}
        <motion.div
          animate={{
            scale: clicking ? 1.5 : 1,
            backgroundColor: clicking ? '#00ffff' : '#ffffff'
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
          style={{
            width: 4,
            height: 4,
            backgroundColor: 'white',
            borderRadius: '50%',
          }}
        />
      </motion.div>
    </motion.div>
  );
};
