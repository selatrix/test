import { memo } from 'react';
import { motion } from 'framer-motion';
import type { Transition } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useRhythmEngine } from '../hooks/useRhythmEngine';

const BEAT_SPRING: Transition = { type: 'spring', stiffness: 520, damping: 28 };
const SNAP:        Transition = { type: 'tween',  duration: 0.055, ease: 'easeOut' };
const HEAD_IDLE:   Transition = { duration: 5.2, repeat: Infinity, ease: 'easeInOut' };
const MIC_IDLE:    Transition = { duration: 2.6, repeat: Infinity, ease: 'easeInOut' };

export const InkCharacter = memo(() => {
  const { isPlaying, currentBeat, isMeasure } = useRhythmEngine();
  const location = useLocation();
  const isHome   = location.pathname === '/';
  const b4       = currentBeat % 4;

  const micRot   = [5, 32, -4, -32][b4] ?? 0;
  const headTilt = [0, 4, -1, -4][b4] ?? 0;
  const bodyY    = [0, -16, 6, 10][b4] ?? 0;

  /* Glow only on measure — minimises GPU filter repaints */
  const glowFilter = isPlaying && isMeasure
    ? 'drop-shadow(0 0 10px rgba(255,255,255,0.65)) drop-shadow(0 0 24px rgba(0,255,255,0.42))'
    : 'none';

  return (
    <div
      className="gpu"
      style={{
        position:    'fixed',
        bottom:      0,
        right:       isHome ? 'clamp(6px, 2vw, 28px)' : '6px',
        width:       isHome ? 'clamp(170px, 38vw, 320px)' : 'clamp(105px, 16vw, 165px)',
        aspectRatio: '100 / 140',
        zIndex:      18,
        pointerEvents: 'none',
        userSelect:    'none',
        transition:    'right 0.65s cubic-bezier(0.34,1.56,0.64,1), width 0.65s',
      }}
    >
      {/* Idle float: CSS keyframe — zero JS cost */}
      <div
        className={!isPlaying ? 'ink-idle-float' : undefined}
        style={{ width: '100%', height: '100%' }}
      >
        {/* Beat Y bounce — only when playing */}
        <motion.div
          animate={isPlaying ? { y: bodyY } : { y: 0 }}
          transition={isPlaying ? BEAT_SPRING : { duration: 0.3 }}
          style={{ width: '100%', height: '100%' }}
        >
          <svg
            viewBox="0 0 100 140"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              width: '100%', height: '100%',
              filter:     glowFilter,
              transition: 'filter 0.5s ease',
              overflow:   'hidden',
            }}
          >
            <defs>
              <clipPath id="vp"><rect width="100" height="140"/></clipPath>
            </defs>
            <g clipPath="url(#vp)">

              {/* ── HEAD GROUP ── */}
              <motion.g
                animate={isPlaying
                  ? { rotate: headTilt }
                  : { rotate: [0, 1.8, 0, -1.8, 0] }}
                transition={isPlaying ? BEAT_SPRING : HEAD_IDLE}
                style={{ transformOrigin: '50px 58px' }}
              >
                {/* Hair back */}
                <path d="M 22,28 C 8,46 3,68 3,90 C 3,110 6,124 10,137"
                  stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
                <path d="M 78,28 C 92,46 97,68 97,90 C 97,110 94,124 90,137"
                  stroke="white" strokeWidth="2.2" strokeLinecap="round"/>

                {/* Face */}
                <path
                  d="M 16,46 C 16,22 24,10 50,10 C 76,10 84,22 84,46 C 84,68 74,80 50,80 C 26,80 16,68 16,46 Z"
                  stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>

                {/* Bangs */}
                <path d="M 30,10 C 28,22 26,36 24,52" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
                <path d="M 42,10 C 40,22 38,36 36,50" stroke="white" strokeWidth="1.1" strokeLinecap="round"/>
                <path d="M 58,10 C 60,22 62,36 64,50" stroke="white" strokeWidth="1.1" strokeLinecap="round"/>
                <path d="M 70,10 C 72,22 74,36 76,52" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>

                {/* Eyebrows */}
                <path d="M 19,34 C 26,27 35,27 41,31" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
                <path d="M 59,31 C 65,27 74,27 81,34" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>

                {/* Left eye */}
                <motion.g
                  animate={isMeasure && isPlaying ? { scaleY: [1, 0.05, 1] } : { scaleY: 1 }}
                  transition={{ duration: 0.12 }}
                  style={{ transformOrigin: '34px 46px' }}
                >
                  <circle cx="34" cy="46" r="10" stroke="white" strokeWidth="1.4"/>
                  <circle cx="34" cy="46" r="6"  stroke="white" strokeWidth="1.2"/>
                  <path d="M 29,39 C 32,36 37,37 39,40" stroke="white" strokeWidth="1" strokeLinecap="round"/>
                </motion.g>

                {/* Right eye */}
                <motion.g
                  animate={isMeasure && isPlaying ? { scaleY: [1, 0.05, 1] } : { scaleY: 1 }}
                  transition={{ duration: 0.12 }}
                  style={{ transformOrigin: '66px 46px' }}
                >
                  <circle cx="66" cy="46" r="10" stroke="white" strokeWidth="1.4"/>
                  <circle cx="66" cy="46" r="6"  stroke="white" strokeWidth="1.2"/>
                  <path d="M 61,39 C 64,36 69,37 71,40" stroke="white" strokeWidth="1" strokeLinecap="round"/>
                </motion.g>

                {/* Mouth */}
                <motion.path
                  d={isMeasure && isPlaying
                    ? 'M 36,68 C 43,77 57,77 64,68'
                    : 'M 38,68 C 44,75 56,75 62,68'}
                  stroke="white" strokeWidth="1.1" strokeLinecap="round"
                  transition={SNAP}
                />

                {/* Blush on measure */}
                {isMeasure && isPlaying && (
                  <>
                    <line x1="13" y1="60" x2="21" y2="62" stroke="#00ffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.7"/>
                    <line x1="13" y1="65" x2="21" y2="67" stroke="#00ffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
                    <line x1="79" y1="60" x2="87" y2="62" stroke="#00ffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.7"/>
                    <line x1="79" y1="65" x2="87" y2="67" stroke="#00ffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
                  </>
                )}

                {/* Neck */}
                <line x1="42" y1="80" x2="40" y2="94" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
                <line x1="58" y1="80" x2="60" y2="94" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>

                {/* Shoulders */}
                <path d="M 32,94 C 18,100 10,112 6,126" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M 68,94 C 82,100 90,112 94,126" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M 40,94 C 44,100 50,102 56,100 C 60,98 60,96 60,94"
                  stroke="white" strokeWidth="1.1" strokeLinecap="round"/>
              </motion.g>

              {/* ── MIC GROUP ── */}
              <motion.g
                animate={isPlaying
                  ? { rotate: micRot }
                  : { rotate: [-8, 4, -8] }}
                transition={isPlaying ? SNAP : MIC_IDLE}
                style={{ transformOrigin: '80px 106px' }}
              >
                <circle cx="80" cy="70" r="8"   stroke="white" strokeWidth="1.5"/>
                <circle cx="80" cy="70" r="5.5" stroke="white" strokeWidth="0.8" opacity="0.5"/>
                <line x1="80" y1="78" x2="80" y2="96" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                <line x1="77" y1="82" x2="83" y2="82" stroke="white" strokeWidth="0.7" strokeLinecap="round" opacity="0.5"/>
                <line x1="77" y1="87" x2="83" y2="87" stroke="white" strokeWidth="0.7" strokeLinecap="round" opacity="0.5"/>
                <line x1="77" y1="92" x2="83" y2="92" stroke="white" strokeWidth="0.7" strokeLinecap="round" opacity="0.5"/>
                <path d="M 74,94 C 72,100 72,108 76,112 C 78,115 82,115 84,112 C 88,108 88,100 86,94 Z"
                  stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M 72,100 C 68,98 67,104 67,109 C 67,113 70,115 73,113"
                  stroke="white" strokeWidth="1.0" strokeLinecap="round"/>
                <path d="M 74,94 C 72,88 74,82 78,82 C 82,82 84,88 82,94"
                  stroke="white" strokeWidth="1.0" strokeLinecap="round" strokeLinejoin="round"/>
              </motion.g>

            </g>
          </svg>
        </motion.div>
      </div>
    </div>
  );
});
