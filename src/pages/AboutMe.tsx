import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PageWrapper } from '../components/PageWrapper';
import { SkeletonPage } from '../components/SkeletonPage';
import { useRhythmEngine } from '../hooks/useRhythmEngine';

const BIO = `> id        : ink
> class     : coder / artist / gamer
> status    : perpetually online
> location  : internet

  i build cool stuff. rhythm games are
  my lifeblood. i love creating worlds,
  writing code, and drawing characters
  that live inside my head.`;

const STATS = [
  { label: 'CODING', val: 85, color: '#00ffff' },
  { label: 'RHYTHM', val: 99, color: '#ff00ff' },
  { label: 'ART',    val: 60, color: '#ffff00' },
  { label: 'SLEEP',  val: 12, color: '#ff4444' },
];

const ITEMS = [
  'Mechanical Keyboard',
  'Wacom Tablet',
  'Too much coffee',
  'Cat  (Mythical Rarity)',
];

const EASE = [0.22, 1, 0.36, 1] as const;

export const AboutMe = () => {
  const { currentBeat, isPlaying, isMeasure, hasStarted } = useRhythmEngine();
  const [typed, setTyped] = useState('');
  const b4          = currentBeat % 4;
  const mutedColor  = isPlaying ? '#505050' : '#1e1e1e';
  const borderColor = isPlaying ? (isMeasure ? '#2a2a2a' : '#1a1a1a') : '#181818';

  useEffect(() => {
    if (!hasStarted) return;
    let i = 0;
    const t = setInterval(() => {
      setTyped(BIO.slice(0, i));
      i++;
      if (i > BIO.length) clearInterval(t);
    }, 20);
    return () => clearInterval(t);
  }, [hasStarted]);

  if (!hasStarted) return <SkeletonPage />;

  return (
    <PageWrapper>
      <motion.h1
        style={{
          fontFamily: 'var(--pixel)', fontSize: 'clamp(1.6rem, 5.5vw, 3.5rem)',
          letterSpacing: '0.08em', color: isPlaying ? '#00ffff' : '#2e2e2e',
          marginBottom: '1.8rem', transition: 'color 0.8s',
        }}
        animate={isPlaying && isMeasure
          ? { textShadow: ['2px 2px 0 #ff00ff', '-2px -2px 0 #ff00ff', '2px 2px 0 #ff00ff'] }
          : { textShadow: 'none' }}
        transition={{ duration: 0.16 }}
      >
        PLAYER.EXE
      </motion.h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(240px, 42%, 400px), 1fr))',
          gap: 'clamp(1rem, 3vw, 2rem)',
          maxWidth: '56rem',
        }}
      >
        {/* Terminal bio */}
        <motion.div
          animate={{ borderColor, boxShadow: isPlaying && isMeasure ? '0 0 22px rgba(0,255,255,0.07)' : 'none' }}
          transition={{ duration: 0.2 }}
          style={{ border: '1px solid #181818', padding: 'clamp(0.9rem, 2.5vw, 1.4rem)', background: 'rgba(0,0,0,0.4)' }}
        >
          <p style={{
            fontFamily: 'var(--mono)', fontSize: 'clamp(0.58rem, 1.4vw, 0.76rem)',
            lineHeight: 1.9, whiteSpace: 'pre-wrap',
            color: isPlaying ? '#444' : '#1e1e1e', transition: 'color 0.8s',
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          {STATS.map(({ label, val, color }, si) => {
            const active = isPlaying && b4 === si;
            return (
              <div key={label}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  fontFamily: 'var(--mono)', fontSize: 'clamp(0.56rem, 1.2vw, 0.7rem)',
                  letterSpacing: '0.18em', marginBottom: '0.26rem',
                }}>
                  <span style={{ color: mutedColor, transition: 'color 0.8s' }}>{label}</span>
                  <motion.span
                    animate={{ color: active ? color : (isPlaying ? '#ffffff' : '#1e1e1e') }}
                    transition={{ duration: 0.1 }}
                  >{val}%</motion.span>
                </div>
                <div style={{ height: 2, background: '#111', borderRadius: 1 }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${val}%`, boxShadow: active ? `0 0 12px ${color}` : 'none' }}
                    transition={{ width: { duration: 1.1, delay: 0.2, ease: EASE as any }, boxShadow: { duration: 0.12 } }}
                    style={{ height: '100%', borderRadius: 1, backgroundColor: isPlaying ? color : '#242424', transition: 'background-color 0.8s' }}
                  />
                </div>
              </div>
            );
          })}

          {/* Inventory */}
          <div style={{
            marginTop: '0.3rem', padding: 'clamp(0.7rem, 2vw, 1rem)',
            border: `1px solid ${borderColor}`, background: 'rgba(0,0,0,0.3)', transition: 'border-color 0.2s',
          }}>
            <p style={{
              fontFamily: 'var(--mono)', fontSize: 'clamp(0.48rem, 1vw, 0.6rem)',
              letterSpacing: '0.28em', color: isPlaying ? '#333' : '#181818',
              marginBottom: '0.6rem', transition: 'color 0.8s',
            }}>INVENTORY</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.38rem' }}>
              {ITEMS.map((item, i) => (
                <motion.li
                  key={item}
                  animate={isPlaying && b4 === i ? { x: [0, 5, 0], color: '#00ffff' } : { color: mutedColor }}
                  transition={{ duration: 0.18 }}
                  style={{ fontFamily: 'var(--mono)', fontSize: 'clamp(0.56rem, 1.2vw, 0.7rem)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <motion.span
                    animate={{ color: isPlaying && b4 === i ? '#00ffff' : (isPlaying ? '#2a2a2a' : '#181818') }}
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
