import { memo } from 'react';
import { motion } from 'framer-motion';
import type { Transition } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useRhythmEngine } from '../hooks/useRhythmEngine';

const BEAT_SPRING: Transition = { type: 'spring', stiffness: 520, damping: 28 };
const SNAP: Transition = { type: 'tween', duration: 0.055, ease: 'easeOut' };
const HEAD_IDLE: Transition = { duration: 6.8, repeat: Infinity, ease: 'easeInOut' };
const MIC_IDLE: Transition = { duration: 3.1, repeat: Infinity, ease: 'easeInOut' };

export const InkCharacter = memo(() => {
  const { isPlaying, currentBeat, isMeasure } = useRhythmEngine();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const b4 = currentBeat % 4;

  const micRot = [4, 18, -6, -22][b4] ?? 0;
  const headTilt = [0, 3.5, -1.5, -4][b4] ?? 0;
  const bodyY = [0, -8, 5, 7][b4] ?? 0;

  const glowFilter = isPlaying && isMeasure
    ? 'drop-shadow(0 0 12px rgba(255,60,120,0.5)) drop-shadow(0 0 28px rgba(0,220,255,0.35))'
    : 'none';

  return (
    <div
      className="gpu"
      style={{
        position: 'fixed',
        bottom: 0,
        right: isHome ? 'clamp(6px, 2vw, 28px)' : '6px',
        width: isHome ? 'clamp(170px, 38vw, 320px)' : 'clamp(105px, 16vw, 165px)',
        aspectRatio: '100 / 145',
        zIndex: 18,
        pointerEvents: 'none',
        userSelect: 'none',
        transition: 'right 0.65s cubic-bezier(0.34,1.56,0.64,1), width 0.65s',
      }}
    >
      <div className={!isPlaying ? 'ink-idle-float' : undefined} style={{ width: '100%', height: '100%' }}>
        <motion.div
          animate={isPlaying ? { y: bodyY } : { y: 0 }}
          transition={isPlaying ? BEAT_SPRING : { duration: 0.4 }}
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
              transition: 'filter 0.6s ease',
            }}
          >
            <defs>
              <clipPath id="vp"><rect width="100" height="145"/></clipPath>
            </defs>
            <g clipPath="url(#vp)">

              {/* ── HEAD GROUP ── */}
              <motion.g
                animate={isPlaying
                  ? { rotate: headTilt }
                  : { rotate: [0, 1.2, 0, -1.2, 0] }}
                transition={isPlaying ? BEAT_SPRING : HEAD_IDLE}
                style={{ transformOrigin: '50px 58px' }}
              >
                {/* Hair Back */}
                <path d="M22 32 Q12 55 15 92 Q18 118 28 132" stroke="#0a0a0a" strokeWidth="22" strokeLinecap="round"/>
                <path d="M78 32 Q88 55 85 92 Q82 118 72 132" stroke="#0a0a0a" strokeWidth="22" strokeLinecap="round"/>

                {/* Hair Front + Bangs */}
                <path d="M28 28 Q50 8 72 28 Q75 45 68 52" fill="#111" stroke="#0a0a0a" strokeWidth="4"/>
                <path d="M32 19 Q38 12 45 18" fill="none" stroke="#0a0a0a" strokeWidth="11" strokeLinecap="round"/>
                <path d="M55 19 Q62 12 68 18" fill="none" stroke="#0a0a0a" strokeWidth="11" strokeLinecap="round"/>

                {/* Side Locks */}
                <path d="M22 38 Q16 65 19 98" stroke="#0a0a0a" strokeWidth="13" strokeLinecap="round"/>
                <path d="M78 38 Q84 65 81 98" stroke="#0a0a0a" strokeWidth="13" strokeLinecap="round"/>

                {/* Face */}
                <ellipse cx="50" cy="52" rx="19" ry="26" fill="#f8f0e8" stroke="#111" strokeWidth="1.8"/>

                {/* Eyes - Lain's signature empty stare */}
                <motion.g
                  animate={isMeasure && isPlaying ? { scaleY: [1, 0.08, 1] } : { scaleY: 1 }}
                  transition={{ duration: 0.14 }}
                  style={{ transformOrigin: '38px 50px' }}
                >
                  <ellipse cx="38" cy="49" rx="5.5" ry="8" fill="#111"/>
                  <circle cx="39" cy="47" r="2.2" fill="#ff3366"/>
                </motion.g>

                <motion.g
                  animate={isMeasure && isPlaying ? { scaleY: [1, 0.08, 1] } : { scaleY: 1 }}
                  transition={{ duration: 0.14 }}
                  style={{ transformOrigin: '62px 50px' }}
                >
                  <ellipse cx="62" cy="49" rx="5.5" ry="8" fill="#111"/>
                  <circle cx="61" cy="47" r="2.2" fill="#ff3366"/>
                </motion.g>

                {/* Mouth - subtle, almost emotionless */}
                <motion.path
                  d={isMeasure && isPlaying
                    ? "M40 70 Q50 74 60 70"
                    : "M41 69 Q50 72 59 69"}
                  stroke="#111"
                  strokeWidth="1.1"
                  strokeLinecap="round"
                  transition={SNAP}
                />

                {/* Neck */}
                <rect x="44" y="78" width="12" height="18" fill="#f8f0e8" stroke="#111" strokeWidth="1.5" rx="4"/>
              </motion.g>

              {/* ── MIC GROUP (slightly more retro/wired feel) ── */}
              <motion.g
                animate={isPlaying ? { rotate: micRot } : { rotate: [-6, 5, -6] }}
                transition={isPlaying ? SNAP : MIC_IDLE}
                style={{ transformOrigin: '79px 108px' }}
              >
                <circle cx="80" cy="72" r="7.5" fill="#1a1a1a" stroke="#ddd" strokeWidth="1.8"/>
                <circle cx="80" cy="72" r="4.5" fill="#111"/>
                
                <line x1="80" y1="79" x2="80" y2="98" stroke="#ddd" strokeWidth="2.2" strokeLinecap="round"/>
                
                <path d="M73 100 Q72 107 76 112 Q80 115 84 112 Q88 107 87 100 Z" 
                      fill="#1a1a1a" stroke="#ddd" strokeWidth="1.4"/>
              </motion.g>

            </g>
          </svg>
        </motion.div>
      </div>
    </div>
  );
});
