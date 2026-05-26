import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PageWrapper } from '../components/PageWrapper';
import { SkeletonPage } from '../components/SkeletonPage';
import { useRhythmEngine } from '../hooks/useRhythmEngine';
import { useContent } from '../hooks/useContent';

const EASE = [0.22, 1, 0.36, 1] as const;

export const AboutMe = () => {
  const { currentBeat, isPlaying, isMeasure, hasStarted } = useRhythmEngine();
  const { about } = useContent();
  const { bio: BIO, stats: STATS, inventory: ITEMS } = about;

  const [typed, setTyped] = useState('');
  const b4        = currentBeat % 4;
  const muted     = isPlaying ? '#606060' : '#282828';
  const borderCol = isPlaying ? (isMeasure ? '#2a2a2a' : '#1a1a1a') : '#181818';

  /* Re-run typewriter whenever bio text changes */
  useEffect(() => {
    if (!hasStarted) return;
    setTyped('');
    let i = 0;
    const t = setInterval(() => {
      setTyped(BIO.slice(0, i));
      i++;
      if (i > BIO.length) clearInterval(t);
    }, 18);
    return () => clearInterval(t);
  }, [hasStarted, BIO]);

  if (!hasStarted) return <SkeletonPage />;

  return (
    <PageWrapper>
      {/* Title */}
      <motion.h1
        style={{
          fontFamily: 'var(--pixel)', fontSize: 'clamp(2rem, 5vw, 3.8rem)',
          letterSpacing: '0.08em', color: isPlaying ? '#00ffff' : '#2e2e2e',
          marginBottom: '2rem', transition: 'color 0.8s',
        }}
        animate={isPlaying && isMeasure
          ? { textShadow: ['2px 2px 0 #ff00ff', '-2px -2px 0 #ff00ff', '2px 2px 0 #ff00ff'] }
          : { textShadow: 'none' }}
        transition={{ duration: 0.16 }}
      >PLAYER.EXE</motion.h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
        gap: 'clamp(1.2rem, 3vw, 2.4rem)',
        maxWidth: '64rem',
      }}>
        {/* Terminal bio */}
        <motion.div
          animate={{ borderColor: borderCol, boxShadow: isPlaying && isMeasure ? '0 0 24px rgba(0,255,255,0.07)' : 'none' }}
          transition={{ duration: 0.2 }}
          style={{ border: '1px solid #181818', padding: 'clamp(1rem, 2.5vw, 1.6rem)', background: 'rgba(0,0,0,0.4)' }}
        >
          <p style={{
            fontFamily: 'var(--mono)', fontSize: 'clamp(0.82rem, 1.1vw, 1rem)',
            lineHeight: 1.85, whiteSpace: 'pre-wrap',
            color: isPlaying ? '#555' : '#222', transition: 'color 0.8s',
          }}>
            {typed}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              style={{ color: isPlaying ? '#00ffff' : '#2a2a2a' }}
            >_</motion.span>
          </p>
        </motion.div>

        {/* Stats + inventory */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {STATS.map(({ label, val, color }, si) => {
            const active = isPlaying && b4 === si;
            return (
              <div key={label}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  fontFamily: 'var(--mono)', fontSize: 'clamp(0.72rem, 0.9vw, 0.88rem)',
                  letterSpacing: '0.16em', marginBottom: '0.28rem',
                }}>
                  <span style={{ color: muted, transition: 'color 0.8s' }}>{label}</span>
                  <motion.span
                    animate={{ color: active ? color : (isPlaying ? '#ffffff' : '#222') }}
                    transition={{ duration: 0.1 }}
                  >{val}%</motion.span>
                </div>
                <div style={{ height: 2, background: '#111', borderRadius: 1 }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${val}%`, boxShadow: active ? `0 0 14px ${color}` : 'none' }}
                    transition={{ width: { duration: 1.1, delay: 0.18, ease: EASE as unknown as string }, boxShadow: { duration: 0.12 } }}
                    style={{ height: '100%', borderRadius: 1, backgroundColor: isPlaying ? color : '#282828', transition: 'background-color 0.8s' }}
                  />
                </div>
              </div>
            );
          })}

          {/* Inventory */}
          <div style={{
            marginTop: '0.4rem', padding: 'clamp(0.85rem, 2vw, 1.2rem)',
            border: `1px solid ${borderCol}`, background: 'rgba(0,0,0,0.3)', transition: 'border-color 0.2s',
          }}>
            <p style={{
              fontFamily: 'var(--mono)', fontSize: 'clamp(0.6rem, 0.75vw, 0.72rem)',
              letterSpacing: '0.26em', color: isPlaying ? '#333' : '#1c1c1c',
              marginBottom: '0.65rem', transition: 'color 0.8s',
            }}>INVENTORY</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              {ITEMS.map((item, i) => (
                <motion.li
                  key={`${item}-${i}`}
                  animate={isPlaying && b4 === i ? { x: [0, 5, 0], color: '#00ffff' } : { color: muted }}
                  transition={{ duration: 0.18 }}
                  style={{ fontFamily: 'var(--mono)', fontSize: 'clamp(0.72rem, 0.9vw, 0.88rem)', display: 'flex', alignItems: 'center', gap: '0.55rem' }}
                >
                  <motion.span
                    animate={{ color: isPlaying && b4 === i ? '#00ffff' : (isPlaying ? '#2a2a2a' : '#1c1c1c') }}
                    transition={{ duration: 0.12 }}
                  >▸</motion.span>
                  {item}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};
