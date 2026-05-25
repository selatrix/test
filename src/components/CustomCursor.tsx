import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

const LERP_SPEED = 0.15; // Smooth damping

export const CustomCursor = () => {
  const [displayPos, setDisplayPos] = useState({ x: 0, y: 0 });
  const [clicking, setClicking] = useState(false);
  const posRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      
      // Cancel previous RAF to avoid queue buildup
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      
      rafRef.current = requestAnimationFrame(() => {
        setDisplayPos(p => ({
          x: p.x + (posRef.current.x - p.x) * LERP_SPEED,
          y: p.y + (posRef.current.y - p.y) * LERP_SPEED,
        }));
      });
    };
    
    const onMouseDown = () => setClicking(true);
    const onMouseUp = () => setClicking(false);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('mouseup', onMouseUp, { passive: true });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
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
        x: displayPos.x - 16,
        y: displayPos.y - 16,
        willChange: 'transform',
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
          willChange: 'transform',
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
            willChange: 'transform',
          }}
        />
      </motion.div>
    </motion.div>
  );
};
