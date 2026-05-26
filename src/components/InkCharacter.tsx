import { memo } from 'react';
import { motion } from 'framer-motion';
import type { Transition } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useRhythmEngine } from '../hooks/useRhythmEngine';

const BEAT_SPRING: Transition = { type: 'spring', stiffness: 520, damping: 28 };
const SNAP: Transition = { type: 'tween', duration: 0.055, ease: 'easeOut' };
const HEAD_IDLE: Transition = { duration: 5.2, repeat: Infinity, ease: 'easeInOut' };
const MIC_IDLE: Transition = { duration: 2.6, repeat: Infinity, ease: 'easeInOut' };

export const LainCharacter = memo(() => {
  const { isPlaying, currentBeat, isMeasure } = useRhythmEngine();
  const location = useLocation();
  const isHome = location.pathname === '/';

  const b4 = currentBeat % 4;
  const micRot = [5, 32, -4, -32][b4] ?? 0;
  const headTilt = [0, 3.5, -1.5, -3.5][b4] ?? 0;
  const bodyY = [0, -14, 5, 9][b4] ?? 0;

  const glowFilter = isPlaying && isMeasure
    ? 'drop-shadow(0 0 12px rgba(255,255,255,0.7)) drop-shadow(0 0 28px rgba(0,255,255,0.45))'
    : 'none';

  return (
    <div
      className="gpu"
      style={{
        position: 'fixed',
        bottom: 0,
        right: isHome ? 'clamp(8px, 3vw, 32px)' : '8px',
        width: isHome ? 'clamp(180px, 42vw, 340px)' : 'clamp(110px, 18vw, 175px)',
        aspectRatio: '100 / 145',
        zIndex: 18,
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      <div className={!isPlaying ? 'ink-idle-float' : undefined} style={{ width: '100%', height: '100%' }}>
        <motion.div
          animate={isPlaying ? { y: bodyY } : { y: 0 }}
          transition={isPlaying ? BEAT_SPRING : { duration: 0.3 }}
          style={{ width: '100%', height: '100%' }}
        >
          <svg
            viewBox="0 0 100 145"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              width: '100%',
              height: '100%',
              filter: glowFilter,
              transition: 'filter 0.5s ease',
            }}
          >
            <defs>
              <clipPath id="clip"><rect width="100" height="145" /></clipPath>
            </defs>

            <g clipPath="url(#clip)">
              {/* === HEAD GROUP === */}
              <motion.g
                animate={isPlaying ? { rotate: headTilt } : { rotate: [0, 1.8, 0, -1.8, 0] }}
                transition={isPlaying ? BEAT_SPRING : HEAD_IDLE}
                style={{ transformOrigin: '50px 48px' }}
              >
                {/* Hair Back */}
                <path d="M25 32 Q15 55 22 82 Q28 95 35 98" stroke="#fff" strokeWidth="19" strokeLinecap="round" />
                <path d="M75 32 Q85 55 78 82 Q72 95 65 98" stroke="#fff" strokeWidth="19" strokeLinecap="round" />

                {/* Main Hair */}
                <path d="M28 28 Q35 15 50 13 Q68 16 74 30 Q80 48 73 68 Q65 78 50 80 Q35 77 26 55 Z" 
                      fill="#0a0a0a" stroke="#fff" strokeWidth="4.5" />

                {/* Bangs */}
                <path d="M32 24 Q38 14 47 13" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
                <path d="M47 20 Q52 12 58 15" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
                <path d="M58 20 Q65 14 72 26" stroke="#fff" strokeWidth="3.8" strokeLinecap="round" />

                {/* Side Strands */}
                <path d="M23 38 Q19 52 20 82" stroke="#fff" strokeWidth="8" strokeLinecap="round" />
                <path d="M77 38 Q81 52 80 82" stroke="#fff" strokeWidth="8" strokeLinecap="round" />

                {/* Face */}
                <ellipse cx="50" cy="48" rx="18.5" ry="24" fill="#e8d5c0" stroke="#fff" strokeWidth="2.2" />

                {/* Eyes */}
                <ellipse cx="39" cy="46" rx="5.2" ry="7.5" fill="#111" stroke="#fff" strokeWidth="1.1" />
                <ellipse cx="61" cy="46" rx="5.2" ry="7.5" fill="#111" stroke="#fff" strokeWidth="1.1" />

                {/* Eye Highlights */}
                <circle cx="37" cy="44" r="1.8" fill="#fff" />
                <circle cx="59" cy="44" r="1.8" fill="#fff" />

                {/* X Clips */}
                <path d="M29 37 L34 43 M29 43 L34 37" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M66 37 L71 43 M66 43 L71 37" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />

                {/* Mouth */}
                <path d="M41 63 Q50 67 59 63" stroke="#111" strokeWidth="1.3" strokeLinecap="round" />

                {/* Neck */}
                <rect x="42" y="71" width="16" height="17" rx="7" fill="#e8d5c0" stroke="#fff" strokeWidth="2" />
              </motion.g>

              {/* === BODY === */}
              <g>
                {/* Hoodie */}
                <path d="M30 85 Q25 100 28 122 Q32 130 40 132" fill="#111" stroke="#fff" strokeWidth="4" />
                <path d="M70 85 Q75 100 72 122 Q68 130 60 132" fill="#111" stroke="#fff" strokeWidth="4" />

                {/* Main Hoodie Body */}
                <path d="M32 85 Q30 105 35 125 Q38 132 50 132 Q65 132 69 123 Q73 105 70 85 Z" 
                      fill="#0f0f0f" stroke="#fff" strokeWidth="3.8" />

                {/* Hood */}
                <path d="M33 80 Q40 72 50 70 Q61 72 69 80" fill="#111" stroke="#fff" strokeWidth="3.5" />

                {/* Drawstrings */}
                <path d="M41 84 Q39 95 38 115" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M59 84 Q61 95 62 115" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />

                {/* Skirt */}
                <path d="M33 125 Q35 135 37 137 L63 137 Q68 135 70 125" fill="#111" stroke="#fff" strokeWidth="3.5" />

                {/* Legs */}
                <rect x="39" y="135" width="8" height="24" rx="3.5" fill="#111" stroke="#fff" strokeWidth="2.5" />
                <rect x="53" y="135" width="8" height="24" rx="3.5" fill="#111" stroke="#fff" strokeWidth="2.5" />

                {/* Shoes */}
                <rect x="35.5" y="157" width="13" height="7" rx="2" fill="#111" stroke="#fff" strokeWidth="2.2" />
                <rect x="51.5" y="157" width="13" height="7" rx="2" fill="#111" stroke="#fff" strokeWidth="2.2" />
              </g>

              {/* === MIC === */}
              <motion.g
                animate={isPlaying ? { rotate: micRot } : { rotate: [-8, 4, -8] }}
                transition={isPlaying ? SNAP : MIC_IDLE}
                style={{ transformOrigin: '81px 105px' }}
              >
                <circle cx="81" cy="71" r="7.8" stroke="#fff" strokeWidth="1.7" />
                <circle cx="81" cy="71" r="5" stroke="#fff" strokeWidth="0.9" opacity="0.6" />
                <line x1="81" y1="78" x2="81" y2="98" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                <path d="M73 99 Q72 107 76 112 Q81 115 87 112 Q91 106 88 99 Z" 
                      fill="#111" stroke="#fff" strokeWidth="1.5" />
              </motion.g>
            </g>
          </svg>
        </motion.div>
      </div>
    </div>
  );
});
