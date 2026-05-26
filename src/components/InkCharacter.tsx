import { memo } from 'react';
import { motion } from 'framer-motion';
import type { Transition } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useRhythmEngine } from '../hooks/useRhythmEngine';

const BEAT_SPRING: Transition = {
  type: 'spring',
  stiffness: 120,
  damping: 20,
};

const HEAD_IDLE: Transition = {
  duration: 8,
  repeat: Infinity,
  ease: 'easeInOut',
};

export const InkCharacter = memo(() => {
  const { isPlaying, currentBeat, isMeasure } = useRhythmEngine();
  const location = useLocation();

  const isHome = location.pathname === '/';
  const b4 = currentBeat % 4;

  const headTilt = [0, 1.2, -0.5, -1.4][b4] ?? 0;
  const bodyY = [0, -4, 1, 2][b4] ?? 0;

  const glowFilter = isPlaying && isMeasure
    ? 'drop-shadow(0 0 8px rgba(255,255,255,0.45)) drop-shadow(0 0 18px rgba(0,255,255,0.22))'
    : 'none';

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        right: isHome ? 'clamp(12px, 2vw, 32px)' : '8px',
        width: isHome
          ? 'clamp(180px, 36vw, 300px)'
          : 'clamp(120px, 18vw, 170px)',
        aspectRatio: '100 / 145',
        zIndex: 18,
        pointerEvents: 'none',
        userSelect: 'none',
        transition:
          'right 0.7s cubic-bezier(0.34,1.56,0.64,1), width 0.7s',
      }}
    >
      <motion.div
        animate={isPlaying ? { y: bodyY } : { y: [0, -1, 0] }}
        transition={isPlaying ? BEAT_SPRING : HEAD_IDLE}
        style={{ width: '100%', height: '100%' }}
      >
        <svg
          viewBox="0 0 100 145"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            opacity: 0.92,
            mixBlendMode: 'screen',
            filter: `${glowFilter} blur(0.15px)`,
            transition: 'filter 0.5s ease',
          }}
        >
          <motion.g
            animate={isPlaying
              ? { rotate: headTilt }
              : { rotate: [0, 0.5, 0, -0.5, 0] }}
            transition={isPlaying ? BEAT_SPRING : HEAD_IDLE}
            style={{ transformOrigin: '50px 56px' }}
          >
            {/* Hair outline */}
            <path
              d="M 20,28 C 10,42 4,66 5,98 C 6,118 10,134 14,144"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />

            <path
              d="M 80,28 C 90,42 96,66 95,98 C 94,118 90,134 86,144"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Face */}
            <path
              d="M 22,42 C 22,20 30,12 50,12 C 70,12 78,20 78,42 C 78,66 66,82 50,82 C 34,82 22,66 22,42 Z"
              stroke="white"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Messy bangs */}
            <path
              d="M 28,12 C 26,24 24,42 24,58"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
            />

            <path
              d="M 36,12 C 34,26 34,46 36,64"
              stroke="white"
              strokeWidth="1.2"
              strokeLinecap="round"
            />

            <path
              d="M 46,12 C 46,32 46,56 48,74"
              stroke="white"
              strokeWidth="1.6"
              strokeLinecap="round"
            />

            <path
              d="M 58,12 C 60,28 60,48 60,70"
              stroke="white"
              strokeWidth="1.3"
              strokeLinecap="round"
            />

            <path
              d="M 70,12 C 72,28 74,48 76,62"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
            />

            {/* Left eye */}
            <motion.g
              animate={isMeasure && isPlaying
                ? { scaleY: [1, 0.08, 1] }
                : { scaleY: 1 }}
              transition={{ duration: 0.16 }}
              style={{ transformOrigin: '38px 48px' }}
            >
              <ellipse
                cx="38"
                cy="48"
                rx="8"
                ry="10"
                stroke="white"
                strokeWidth="1.2"
              />

              <circle
                cx="38"
                cy="50"
                r="2.5"
                fill="white"
              />

              <circle
                cx="39"
                cy="49"
                r="1"
                fill="black"
              />
            </motion.g>

            {/* Right eye */}
            <motion.g
              animate={isMeasure && isPlaying
                ? { scaleY: [1, 0.08, 1] }
                : { scaleY: 1 }}
              transition={{ duration: 0.16 }}
              style={{ transformOrigin: '62px 48px' }}
            >
              <ellipse
                cx="62"
                cy="48"
                rx="8"
                ry="10"
                stroke="white"
                strokeWidth="1.2"
              />

              <circle
                cx="62"
                cy="50"
                r="2.5"
                fill="white"
              />

              <circle
                cx="63"
                cy="49"
                r="1"
                fill="black"
              />
            </motion.g>

            {/* Mouth */}
            <line
              x1="46"
              y1="68"
              x2="54"
              y2="68"
              stroke="white"
              strokeWidth="1"
              strokeLinecap="round"
            />

            {/* Neck */}
            <line
              x1="44"
              y1="82"
              x2="42"
              y2="94"
              stroke="white"
              strokeWidth="1"
              strokeLinecap="round"
            />

            <line
              x1="56"
              y1="82"
              x2="58"
              y2="94"
              stroke="white"
              strokeWidth="1"
              strokeLinecap="round"
            />

            {/* Oversized shoulders */}
            <path
              d="M 36,94 C 18,98 8,116 4,138"
              stroke="white"
              strokeWidth="1.4"
              strokeLinecap="round"
            />

            <path
              d="M 64,94 C 82,98 92,116 96,138"
              stroke="white"
              strokeWidth="1.4"
              strokeLinecap="round"
            />

            {/* Sweater */}
            <path
              d="M 28,98 C 30,122 30,136 34,144"
              stroke="white"
              strokeWidth="1.2"
              strokeLinecap="round"
            />

            <path
              d="M 72,98 C 70,122 70,136 66,144"
              stroke="white"
              strokeWidth="1.2"
              strokeLinecap="round"
            />

            <path
              d="M 38,94 C 44,98 56,98 62,94"
              stroke="white"
              strokeWidth="1"
              strokeLinecap="round"
            />

            {/* Wired cables */}
            <motion.path
              d="M 84,88 C 96,104 94,122 88,145"
              stroke="#00ffff"
              strokeWidth="1"
              opacity="0.45"
              strokeLinecap="round"
              animate={isPlaying
                ? { pathOffset: [0, 0.08, 0] }
                : { pathOffset: 0 }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />

            <motion.path
              d="M 12,84 C 4,102 6,124 14,145"
              stroke="#00ffff"
              strokeWidth="1"
              opacity="0.35"
              strokeLinecap="round"
              animate={isPlaying
                ? { pathOffset: [0, -0.08, 0] }
                : { pathOffset: 0 }}
              transition={{ duration: 3.2, repeat: Infinity }}
            />

            {/* Digital noise lines */}
            {isMeasure && isPlaying && (
              <>
                <line
                  x1="8"
                  y1="36"
                  x2="22"
                  y2="36"
                  stroke="#00ffff"
                  strokeWidth="0.8"
                  opacity="0.5"
                />

                <line
                  x1="78"
                  y1="58"
                  x2="92"
                  y2="58"
                  stroke="#00ffff"
                  strokeWidth="0.8"
                  opacity="0.5"
                />

                <line
                  x1="12"
                  y1="112"
                  x2="24"
                  y2="112"
                  stroke="#00ffff"
                  strokeWidth="0.8"
                  opacity="0.4"
                />
              </>
            )}
          </motion.g>
        </svg>
      </motion.div>
    </div>
  );
});

// Add this CSS to your global styles:
// @keyframes crtFlicker {
//   0% { opacity: 0.92; }
//   50% { opacity: 0.88; }
//   100% { opacity: 0.92; }
// }
//
// svg {
//   animation: crtFlicker 4s infinite ease-in-out;
// }
