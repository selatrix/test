import { motion } from 'framer-motion';
import type { Transition } from 'framer-motion';
import { PageWrapper } from '../components/PageWrapper';
import { SkeletonPage } from '../components/SkeletonPage';
import { useRhythmEngine } from '../hooks/useRhythmEngine';
import { useContent } from '../hooks/useContent';

const EASE: Transition = { ease: 'easeOut', duration: 0.4 };

export const MyGames = () => {
  const { currentBeat, isPlaying, isMeasure, hasStarted } = useRhythmEngine();
  const { games: ROBLOX_GAMES } = useContent();
  const b4    = currentBeat % 4;
  const muted = isPlaying ? '#606060' : '#282828';

  if (!hasStarted) return <SkeletonPage />;

  return (
    <PageWrapper>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
        <motion.h1
          style={{
            fontFamily: 'var(--pixel)', fontSize: 'clamp(2rem, 5vw, 3.8rem)',
            letterSpacing: '0.08em', color: isPlaying ? '#00ffff' : '#2e2e2e', transition: 'color 0.8s',
          }}
          animate={isPlaying && isMeasure
            ? { textShadow: ['3px 3px 0 #ff00ff', '-3px -3px 0 #ff00ff', '3px 3px 0 #ff00ff'] }
            : { textShadow: 'none' }}
          transition={{ duration: 0.16 }}
        >MY_GAMES</motion.h1>
        <span style={{
          fontFamily: 'var(--mono)', fontSize: 'clamp(0.6rem, 0.8vw, 0.76rem)',
          letterSpacing: '0.2em', color: isPlaying ? '#2a2a2a' : '#1c1c1c', transition: 'color 0.8s',
        }}>ROBLOX</span>
      </div>

      <p style={{
        fontFamily: 'var(--mono)', fontSize: 'clamp(0.72rem, 0.9vw, 0.88rem)',
        letterSpacing: '0.18em', color: muted, marginBottom: '2rem', transition: 'color 0.8s',
      }}>
        games i've built on roblox studio
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
        gap: '0.75rem',
        maxWidth: '52rem',
      }}>
        {ROBLOX_GAMES.map((game, i) => {
          const bp  = isPlaying && b4 === i % 4;
          const Tag = game.url ? 'a' : 'div';
          const lp  = game.url ? { href: game.url, target: '_blank', rel: 'noopener noreferrer' } : {};

          return (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: bp && isMeasure ? -4 : 0 }}
              transition={{ ...EASE, delay: i * 0.055 }}
              whileHover={{
                y: -8, scale: 1.02,
                boxShadow: `0 14px 44px ${game.color}20, 0 0 0 1px ${game.color}44`,
                borderColor: `${game.color}55`,
                transition: { duration: 0.2 },
              }}
              style={{
                border:     `1px solid ${bp ? game.color + '44' : '#1a1a1a'}`,
                background: 'rgba(0,0,0,0.35)',
                boxShadow:  bp ? `0 0 20px ${game.color}18` : 'none',
                transition: 'border-color 0.1s, box-shadow 0.1s',
                cursor:     game.url ? 'pointer' : 'default',
              }}
            >
              {/* @ts-ignore */}
              <Tag {...lp} style={{ display: 'block', padding: 'clamp(1rem, 2.5vw, 1.4rem)', textDecoration: 'none', color: 'inherit' }}>
                <motion.h2
                  animate={{ color: bp ? game.color : (isPlaying ? '#ffffff' : '#2a2a2a') }}
                  transition={{ duration: 0.1 }}
                  style={{ fontFamily: 'var(--pixel)', fontSize: 'clamp(1.2rem, 2vw, 1.7rem)', letterSpacing: '0.05em', marginBottom: '0.4rem' }}
                >{game.title}</motion.h2>

                <motion.div
                  animate={{ background: bp ? game.color + '40' : '#181818' }}
                  transition={{ duration: 0.1 }}
                  style={{ height: 1, marginBottom: '0.6rem' }}
                />

                <p style={{
                  fontFamily: 'var(--mono)', fontSize: 'clamp(0.75rem, 0.95vw, 0.9rem)',
                  color: muted, lineHeight: 1.7, marginBottom: '0.85rem', transition: 'color 0.8s',
                }}>{game.desc}</p>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #181818', paddingTop: '0.6rem' }}>
                  <motion.span
                    animate={{ color: bp ? game.color : '#252525' }}
                    transition={{ duration: 0.1 }}
                    style={{ fontFamily: 'var(--mono)', fontSize: 'clamp(0.62rem, 0.75vw, 0.74rem)', letterSpacing: '0.14em' }}
                  >VISITS: {game.plays}</motion.span>
                  <motion.span
                    animate={bp ? { x: [0, 4, 0] } : { x: 0 }}
                    transition={{ duration: 0.16 }}
                    style={{ fontFamily: 'var(--mono)', fontSize: 'clamp(0.62rem, 0.75vw, 0.74rem)', letterSpacing: '0.12em', color: isPlaying ? '#2a2a2a' : '#1c1c1c', transition: 'color 0.8s' }}
                  >{game.url ? '▶ PLAY' : '▶ SOON'}</motion.span>
                </div>
              {/* @ts-ignore */}
              </Tag>
            </motion.div>
          );
        })}
      </div>
    </PageWrapper>
  );
};
