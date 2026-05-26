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
  const isHome = location.pathname === '/';
  const b4     = currentBeat % 4;

  const micRot   = [5, 32, -4, -32][b4] ?? 0;
  const headTilt = [0, 4, -1, -4][b4]   ?? 0;
  const bodyY    = [0, -16, 6, 10][b4]  ?? 0;

  const glowFilter = isPlaying && isMeasure
    ? 'drop-shadow(0 0 10px rgba(255,255,255,0.65)) drop-shadow(0 0 24px rgba(0,255,255,0.42))'
    : 'none';

  return (
    <div
      className="gpu"
      style={{
        position:      'fixed',
        bottom:        0,
        right:         isHome ? 'clamp(6px, 2vw, 28px)' : '6px',
        width:         isHome ? 'clamp(170px, 38vw, 320px)' : 'clamp(105px, 16vw, 165px)',
        aspectRatio:   '100 / 140',
        zIndex:        18,
        pointerEvents: 'none',
        userSelect:    'none',
        transition:    'right 0.65s cubic-bezier(0.34,1.56,0.64,1), width 0.65s',
      }}
    >
      <div
        className={!isPlaying ? 'ink-idle-float' : undefined}
        style={{ width: '100%', height: '100%' }}
      >
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
              width:      '100%',
              height:     '100%',
              filter:     glowFilter,
              transition: 'filter 0.5s ease',
              overflow:   'hidden',
            }}
          >
            <defs>
              <clipPath id="vp"><rect width="100" height="140" /></clipPath>
            </defs>

            <g clipPath="url(#vp)">

              {/* ── HEAD GROUP (tilts on beat) ── */}
              <motion.g
                animate={isPlaying
                  ? { rotate: headTilt }
                  : { rotate: [0, 1.8, 0, -1.8, 0] }}
                transition={isPlaying ? BEAT_SPRING : HEAD_IDLE}
                style={{ transformOrigin: '50px 55px' }}
              >
                {/* ── HAIR BACK (behind face) ── */}
                {/* Left back — long straight, wispy ends */}
                <path d="M 46,12 C 34,12 20,18 12,32 C 6,44 4,62 4,80 C 4,96 6,110 6,124 C 6,130 5,136 4,142"
                  stroke="white" strokeWidth="3.2" strokeLinecap="round" />
                <path d="M 36,11 C 24,16 12,28 8,44 C 4,60 4,78 4,94 C 4,108 5,120 4,132"
                  stroke="white" strokeWidth="2.2" strokeLinecap="round" opacity="0.75" />
                <path d="M 28,14 C 16,22 8,38 6,56 C 4,72 5,90 5,106"
                  stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.45" />
                {/* left wispy tips */}
                <path d="M 6,122 C 2,128 0,136 3,140" stroke="white" strokeWidth="0.9" strokeLinecap="round" opacity="0.6" />
                <path d="M 5,116 C 0,124 -1,134 2,140" stroke="white" strokeWidth="0.7" strokeLinecap="round" opacity="0.4" />

                {/* Right back */}
                <path d="M 54,12 C 66,12 80,18 88,32 C 94,44 96,62 96,80 C 96,96 94,110 94,124 C 94,130 95,136 96,142"
                  stroke="white" strokeWidth="3.2" strokeLinecap="round" />
                <path d="M 64,11 C 76,16 88,28 92,44 C 96,60 96,78 96,94 C 96,108 95,120 96,132"
                  stroke="white" strokeWidth="2.2" strokeLinecap="round" opacity="0.75" />
                <path d="M 72,14 C 84,22 92,38 94,56 C 96,72 95,90 95,106"
                  stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.45" />
                {/* right wispy tips */}
                <path d="M 94,122 C 98,128 100,136 97,140" stroke="white" strokeWidth="0.9" strokeLinecap="round" opacity="0.6" />
                <path d="M 95,116 C 100,124 101,134 98,140" stroke="white" strokeWidth="0.7" strokeLinecap="round" opacity="0.4" />

                {/* ── FACE — V-shape: wide temples, sharp pointed chin ── */}
                <path
                  d="M 20,38
                     C 18,18 28,6 50,6
                     C 72,6 82,18 80,38
                     C 80,54 76,68 68,78
                     C 62,86 55,91 50,91
                     C 45,91 38,86 32,78
                     C 24,68 20,54 20,38 Z"
                  stroke="white" strokeWidth="1.3" strokeLinejoin="round" />

                {/* ── EARS ── */}
                <path d="M 20,42 C 14,42 12,49 14,54 C 15,57 19,58 20,54"
                  stroke="white" strokeWidth="1.0" strokeLinecap="round" />
                <path d="M 80,42 C 86,42 88,49 86,54 C 85,57 81,58 80,54"
                  stroke="white" strokeWidth="1.0" strokeLinecap="round" />

                {/* ── HAIR TOP CAP + SHINE ── */}
                <path d="M 20,36 C 18,14 28,4 50,4 C 72,4 82,14 80,36"
                  stroke="white" strokeWidth="3.0" strokeLinecap="round" />
                {/* shine streak */}
                <path d="M 36,6 C 34,14 33,22 34,30"
                  stroke="white" strokeWidth="1.3" strokeLinecap="round" opacity="0.5" />

                {/* ── BANGS — dense straight fringe, like screenshot ── */}
                {/* straight-across fringe, slight taper on each strand */}
                <path d="M 22,20 C 21,28 20,36 19,46" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M 26,14 C 25,24 24,34 23,46" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
                <path d="M 31,10 C 30,20 29,32 28,44" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M 36,7  C 35,18 34,30 33,43" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
                <path d="M 41,5  C 40,16 39,28 38,42" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M 46,4  C 45,15 44,27 43,41" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M 50,4  C 50,15 50,27 50,41" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M 54,4  C 55,15 56,27 57,41" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M 59,5  C 60,16 61,28 62,42" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M 64,7  C 65,18 66,30 67,43" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
                <path d="M 69,10 C 70,20 71,32 72,44" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M 74,14 C 75,24 76,34 77,46" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
                <path d="M 78,20 C 79,28 80,36 81,46" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                {/* fine wisps */}
                <path d="M 43,5  C 43,14 42,24 41,36" stroke="white" strokeWidth="0.7" strokeLinecap="round" opacity="0.4" />
                <path d="M 57,5  C 57,14 58,24 59,36" stroke="white" strokeWidth="0.7" strokeLinecap="round" opacity="0.4" />

                {/* face-frame side strands */}
                <path d="M 22,22 C 18,34 16,52 16,68 C 16,80 18,92 20,104"
                  stroke="white" strokeWidth="1.3" strokeLinecap="round" opacity="0.85" />
                <path d="M 78,22 C 82,34 84,52 84,68 C 84,80 82,92 80,104"
                  stroke="white" strokeWidth="1.3" strokeLinecap="round" opacity="0.85" />

                {/* ── EYEBROWS ── */}
                <path d="M 17,34 C 22,27 32,26 38,29" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M 62,29 C 68,26 78,27 83,34" stroke="white" strokeWidth="1.8" strokeLinecap="round" />

                {/* ── LEFT EYE — tall oval with heavy lash, lash spikes, iris, highlights ── */}
                <motion.g
                  animate={isMeasure && isPlaying ? { scaleY: [1, 0.05, 1] } : { scaleY: 1 }}
                  transition={{ duration: 0.12 }}
                  style={{ transformOrigin: '30px 50px' }}
                >
                  {/* eye outline — tall oval */}
                  <path d="M 19,50 C 19,42 22,38 30,38 C 38,38 41,42 41,50 C 41,58 38,63 30,63 C 22,63 19,58 19,50 Z"
                    stroke="white" strokeWidth="1.1" />
                  {/* thick upper lash bar */}
                  <path d="M 19,44 C 22,38 38,38 41,44"
                    stroke="white" strokeWidth="3.0" strokeLinecap="round" />
                  {/* upper lash spikes */}
                  <line x1="20" y1="42" x2="17" y2="37" stroke="white" strokeWidth="1.0" strokeLinecap="round" />
                  <line x1="23" y1="39" x2="21" y2="34" stroke="white" strokeWidth="1.0" strokeLinecap="round" />
                  <line x1="27" y1="38" x2="26" y2="33" stroke="white" strokeWidth="1.0" strokeLinecap="round" />
                  <line x1="31" y1="38" x2="31" y2="33" stroke="white" strokeWidth="1.0" strokeLinecap="round" />
                  <line x1="35" y1="39" x2="36" y2="34" stroke="white" strokeWidth="1.0" strokeLinecap="round" />
                  <line x1="39" y1="42" x2="41" y2="37" stroke="white" strokeWidth="1.0" strokeLinecap="round" />
                  {/* thin lower lash line */}
                  <path d="M 20,58 C 23,63 37,63 40,58"
                    stroke="white" strokeWidth="0.8" strokeLinecap="round" />
                  {/* lower lash spikes */}
                  <line x1="23" y1="62" x2="22" y2="65" stroke="white" strokeWidth="0.7" strokeLinecap="round" />
                  <line x1="27" y1="63" x2="26" y2="66" stroke="white" strokeWidth="0.7" strokeLinecap="round" />
                  <line x1="31" y1="64" x2="31" y2="67" stroke="white" strokeWidth="0.7" strokeLinecap="round" />
                  <line x1="35" y1="63" x2="35" y2="66" stroke="white" strokeWidth="0.7" strokeLinecap="round" />
                  <line x1="38" y1="62" x2="39" y2="65" stroke="white" strokeWidth="0.7" strokeLinecap="round" />
                  {/* iris */}
                  <circle cx="30" cy="51" r="6.5" stroke="white" strokeWidth="1.2" />
                  {/* pupil */}
                  <circle cx="30" cy="51" r="3.5" stroke="white" strokeWidth="0.9" opacity="0.8" />
                  {/* highlights */}
                  <ellipse cx="26.5" cy="47" rx="2.5" ry="2.0" fill="white" opacity="0.95" />
                  <circle  cx="33"   cy="54" r="1.1"             fill="white" opacity="0.7"  />
                  {/* iris bottom reflection */}
                  <path d="M 25,57 C 27,59 33,59 35,57" stroke="white" strokeWidth="0.6" strokeLinecap="round" opacity="0.35" />
                </motion.g>

                {/* ── RIGHT EYE ── */}
                <motion.g
                  animate={isMeasure && isPlaying ? { scaleY: [1, 0.05, 1] } : { scaleY: 1 }}
                  transition={{ duration: 0.12 }}
                  style={{ transformOrigin: '70px 50px' }}
                >
                  <path d="M 59,50 C 59,42 62,38 70,38 C 78,38 81,42 81,50 C 81,58 78,63 70,63 C 62,63 59,58 59,50 Z"
                    stroke="white" strokeWidth="1.1" />
                  <path d="M 59,44 C 62,38 78,38 81,44"
                    stroke="white" strokeWidth="3.0" strokeLinecap="round" />
                  <line x1="60" y1="42" x2="57" y2="37" stroke="white" strokeWidth="1.0" strokeLinecap="round" />
                  <line x1="63" y1="39" x2="61" y2="34" stroke="white" strokeWidth="1.0" strokeLinecap="round" />
                  <line x1="67" y1="38" x2="66" y2="33" stroke="white" strokeWidth="1.0" strokeLinecap="round" />
                  <line x1="71" y1="38" x2="71" y2="33" stroke="white" strokeWidth="1.0" strokeLinecap="round" />
                  <line x1="75" y1="39" x2="76" y2="34" stroke="white" strokeWidth="1.0" strokeLinecap="round" />
                  <line x1="79" y1="42" x2="81" y2="37" stroke="white" strokeWidth="1.0" strokeLinecap="round" />
                  <path d="M 60,58 C 63,63 77,63 80,58"
                    stroke="white" strokeWidth="0.8" strokeLinecap="round" />
                  <line x1="63" y1="62" x2="62" y2="65" stroke="white" strokeWidth="0.7" strokeLinecap="round" />
                  <line x1="67" y1="63" x2="66" y2="66" stroke="white" strokeWidth="0.7" strokeLinecap="round" />
                  <line x1="71" y1="64" x2="71" y2="67" stroke="white" strokeWidth="0.7" strokeLinecap="round" />
                  <line x1="75" y1="63" x2="75" y2="66" stroke="white" strokeWidth="0.7" strokeLinecap="round" />
                  <line x1="78" y1="62" x2="79" y2="65" stroke="white" strokeWidth="0.7" strokeLinecap="round" />
                  <circle cx="70" cy="51" r="6.5" stroke="white" strokeWidth="1.2" />
                  <circle cx="70" cy="51" r="3.5" stroke="white" strokeWidth="0.9" opacity="0.8" />
                  <ellipse cx="66.5" cy="47" rx="2.5" ry="2.0" fill="white" opacity="0.95" />
                  <circle  cx="73"   cy="54" r="1.1"             fill="white" opacity="0.7"  />
                  <path d="M 65,57 C 67,59 73,59 75,57" stroke="white" strokeWidth="0.6" strokeLinecap="round" opacity="0.35" />
                </motion.g>

                {/* ── NOSE — tiny ── */}
                <path d="M 50,68 C 51,70 52,71 52,71" stroke="white" strokeWidth="0.9" strokeLinecap="round" opacity="0.6" />

                {/* ── BLUSH — always visible hatch lines ── */}
                <line x1="12" y1="62" x2="26" y2="62" stroke="white" strokeWidth="0.85" strokeLinecap="round" opacity="0.40" />
                <line x1="12" y1="64" x2="26" y2="64" stroke="white" strokeWidth="0.85" strokeLinecap="round" opacity="0.35" />
                <line x1="12" y1="66" x2="25" y2="66" stroke="white" strokeWidth="0.85" strokeLinecap="round" opacity="0.28" />
                <line x1="13" y1="68" x2="24" y2="68" stroke="white" strokeWidth="0.85" strokeLinecap="round" opacity="0.18" />
                <line x1="74" y1="62" x2="88" y2="62" stroke="white" strokeWidth="0.85" strokeLinecap="round" opacity="0.40" />
                <line x1="74" y1="64" x2="88" y2="64" stroke="white" strokeWidth="0.85" strokeLinecap="round" opacity="0.35" />
                <line x1="75" y1="66" x2="88" y2="66" stroke="white" strokeWidth="0.85" strokeLinecap="round" opacity="0.28" />
                <line x1="76" y1="68" x2="87" y2="68" stroke="white" strokeWidth="0.85" strokeLinecap="round" opacity="0.18" />

                {/* extra cyan blush on measure */}
                {isMeasure && isPlaying && (
                  <>
                    <line x1="12" y1="62" x2="26" y2="62" stroke="#00ffff" strokeWidth="1.0" strokeLinecap="round" opacity="0.55" />
                    <line x1="12" y1="65" x2="25" y2="65" stroke="#00ffff" strokeWidth="1.0" strokeLinecap="round" opacity="0.38" />
                    <line x1="74" y1="62" x2="88" y2="62" stroke="#00ffff" strokeWidth="1.0" strokeLinecap="round" opacity="0.55" />
                    <line x1="75" y1="65" x2="88" y2="65" stroke="#00ffff" strokeWidth="1.0" strokeLinecap="round" opacity="0.38" />
                  </>
                )}

                {/* ── MOUTH ── */}
                <motion.path
                  d={isMeasure && isPlaying
                    ? 'M 40,78 C 45,84 55,84 60,78'
                    : 'M 42,77 C 46,82 54,82 58,77'}
                  stroke="white" strokeWidth="1.1" strokeLinecap="round"
                  transition={SNAP}
                />
                {/* upper lip hint */}
                <path d="M 43,75 C 47,73 53,73 57,75" stroke="white" strokeWidth="0.7" strokeLinecap="round" opacity="0.55" />

                {/* ── NECK ── */}
                <line x1="43" y1="91" x2="41" y2="104" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
                <line x1="57" y1="91" x2="59" y2="104" stroke="white" strokeWidth="1.2" strokeLinecap="round" />

                {/* ── SHOULDERS ── */}
                <path d="M 30,104 C 16,110 8,122 4,136"  stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M 70,104 C 84,110 92,122 96,136" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M 41,104 C 45,109 55,109 59,104" stroke="white" strokeWidth="1.0" strokeLinecap="round" />

              </motion.g>

              {/* ── MIC GROUP ── */}
              <motion.g
                animate={isPlaying
                  ? { rotate: micRot }
                  : { rotate: [-8, 4, -8] }}
                transition={isPlaying ? SNAP : MIC_IDLE}
                style={{ transformOrigin: '78px 108px' }}
              >
                {/* mic head */}
                <circle cx="78" cy="72" r="8"   stroke="white" strokeWidth="1.5" />
                <circle cx="78" cy="72" r="5.5" stroke="white" strokeWidth="0.8" opacity="0.5" />
                {/* grille lines */}
                <line x1="72" y1="70" x2="84" y2="70" stroke="white" strokeWidth="0.6" strokeLinecap="round" opacity="0.4" />
                <line x1="72" y1="73" x2="84" y2="73" stroke="white" strokeWidth="0.6" strokeLinecap="round" opacity="0.4" />
                {/* handle */}
                <line x1="78" y1="80" x2="78" y2="98" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                {/* grip rings */}
                <line x1="75" y1="84" x2="81" y2="84" stroke="white" strokeWidth="0.7" strokeLinecap="round" opacity="0.45" />
                <line x1="75" y1="89" x2="81" y2="89" stroke="white" strokeWidth="0.7" strokeLinecap="round" opacity="0.45" />
                <line x1="75" y1="94" x2="81" y2="94" stroke="white" strokeWidth="0.7" strokeLinecap="round" opacity="0.45" />
                {/* hand */}
                <path d="M 72,96 C 70,102 70,110 74,114 C 76,117 80,117 82,114 C 86,110 86,102 84,96 Z"
                  stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 70,102 C 66,100 65,106 65,111 C 65,115 68,117 71,115"
                  stroke="white" strokeWidth="1.0" strokeLinecap="round" />
                <path d="M 72,96 C 70,90 72,84 76,84 C 80,84 82,90 80,96"
                  stroke="white" strokeWidth="1.0" strokeLinecap="round" strokeLinejoin="round" />
              </motion.g>

            </g>
          </svg>
        </motion.div>
      </div>
    </div>
  );
});
