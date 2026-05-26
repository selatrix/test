import { memo } from 'react';
import { motion } from 'framer-motion';
import type { Transition } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useRhythmEngine } from '../hooks/useRhythmEngine';

const BEAT_SPRING: Transition = { type: 'spring', stiffness: 480, damping: 32 };
const SNAP: Transition = { type: 'tween', duration: 0.06, ease: 'easeOut' };
const HEAD_IDLE: Transition = { duration: 7.5, repeat: Infinity, ease: 'easeInOut' };

export const InkCharacter = memo(() => {
  const { isPlaying, currentBeat, isMeasure } = useRhythmEngine();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const b4 = currentBeat % 4;

  const headTilt = [0, 2.8, -1.2, -3.5][b4] ?? 0;
  const bodyY = [0, -7, 4, 6][b4] ?? 0;

  const glowFilter = isPlaying && isMeasure
    ? 'drop-shadow(0 0 14px rgba(180, 60, 255, 0.55)) drop-shadow(0 0 32px rgba(0, 240, 255, 0.35))'
    : 'none';

  return (
    <div
      className="gpu"
      style={{
        position: 'fixed',
        bottom: 0,
        right: isHome ? 'clamp(8px, 2.5vw, 32px)' : '8px',
        width: isHome ? 'clamp(175px, 39vw, 330px)' : 'clamp(110px, 17vw, 170px)',
        aspectRatio: '100 / 148',
        zIndex: 18,
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      <div className={!isPlaying ? 'ink-idle-float' : undefined} style={{ width: '100%', height: '100%' }}>
        <motion.div
          animate={isPlaying ? { y: bodyY } : { y: 0 }}
          transition={isPlaying ? BEAT_SPRING : { duration: 0.45 }}
          style={{ width: '100%', height: '100%' }}
        >
          <svg
            viewBox="0 0 100 148"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              width: '100%',
              height: '100%',
              filter: glowFilter,
              transition: 'filter 0.7s ease',
            }}
          >
            <defs>
              <clipPath id="vp"><rect width="100" height="148" /></clipPath>
            </defs>
            <g clipPath="url(#vp)">

              {/* HEAD GROUP */}
              <motion.g
                animate={isPlaying ? { rotate: headTilt } : { rotate: [0, 1, 0, -1, 0] }}
                transition={isPlaying ? BEAT_SPRING : HEAD_IDLE}
                style={{ transformOrigin: '50px 57px' }}
              >
                {/* Hair - Classic Lain bowl cut + side locks */}
                <path d="M25 29 Q15 48 18 85 Q22 115 35 125" stroke="#fff" strokeWidth="19" strokeLinecap="round"/>
                <path d="M75 29 Q85 48 82 85 Q78 115 65 125" stroke="#fff" strokeWidth="19" strokeLinecap="round"/>

                {/* Hair front bangs */}
                <path d="M26 26 Q50 12 74 27" stroke="#fff" strokeWidth="13" strokeLinecap="round"/>
                <path d="M29 19 Q37 13 46 20" stroke="#fff" strokeWidth="9" strokeLinecap="round"/>
                <path d="M54 19 Q63 13 71 20" stroke="#fff" strokeWidth="9" strokeLinecap="round"/>

                {/* Side hair strands */}
                <path d="M23 38 Q17 62 21 98" stroke="#fff" strokeWidth="11" strokeLinecap="round"/>
                <path d="M77 38 Q83 62 79 98" stroke="#fff" strokeWidth="11" strokeLinecap="round"/>

                {/* Face */}
                <ellipse cx="50" cy="54" rx="19.5" ry="27" stroke="#fff" strokeWidth="2.2"/>

                {/* Eyes - Exact Lain style (large, slightly hollow) */}
                <motion.g
                  animate={isMeasure && isPlaying ? { scaleY: [1, 0.06, 1] } : { scaleY: 1 }}
                  transition={{ duration: 0.13 }}
                  style={{ transformOrigin: '37.5px 51px' }}
                >
                  <ellipse cx="37.5" cy="51" rx="6.2" ry="8.8" stroke="#fff" strokeWidth="1.8"/>
                  <circle cx="38.5" cy="49.5" r="2.4" fill="#fff"/>
                </motion.g>

                <motion.g
                  animate={isMeasure && isPlaying ? { scaleY: [1, 0.06, 1] } : { scaleY: 1 }}
                  transition={{ duration: 0.13 }}
                  style={{ transformOrigin: '62.5px 51px' }}
                >
                  <ellipse cx="62.5" cy="51" rx="6.2" ry="8.8" stroke="#fff" strokeWidth="1.8"/>
                  <circle cx="61.5" cy="49.5" r="2.4" fill="#fff"/>
                </motion.g>

                {/* Eyebrows */}
                <path d="M30 37 Q37 33 44 35" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/>
                <path d="M56 35 Q63 33 70 37" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/>

                {/* Mouth - subtle Lain expression */}
                <motion.path
                  d={isMeasure && isPlaying ? "M39 71 Q50 74 61 71" : "M40 71 Q50 73 60 71"}
                  stroke="#fff"
                  strokeWidth="1.15"
                  strokeLinecap="round"
                  transition={SNAP}
                />

                {/* Neck */}
                <rect x="43" y="79" width="14" height="19" stroke="#fff" strokeWidth="2" rx="5"/>
              </motion.g>

              {/* MIC - Minimal wired style */}
              <motion.g
                animate={isPlaying ? { rotate: [4, 19, -7, -19][b4] ?? 0 } : { rotate: [-7, 6, -7] }}
                transition={isPlaying ? SNAP : { duration: 3.2, repeat: Infinity }}
                style={{ transformOrigin: '79px 107px' }}
              >
                <circle cx="80" cy="71" r="7.8" stroke="#fff" strokeWidth="1.9"/>
                <circle cx="80" cy="71" r="4.8" stroke="#fff" strokeWidth="1"/>
                <line x1="80" y1="78" x2="80" y2="99" stroke="#fff" strokeWidth="2.1" strokeLinecap="round"/>
                <path d="M72 101 Q71 108 75 113 Q80 116 85 113 Q89 108 88 101 Z" stroke="#fff" strokeWidth="1.6"/>
              </motion.g>

            </g>
          </svg>
        </motion.div>
      </div>
    </div>
  );
});
