import { motion } from 'framer-motion';
import { PageWrapper } from '../components/PageWrapper';
import { SkeletonPage } from '../components/SkeletonPage';
import { useRhythmEngine } from '../hooks/useRhythmEngine';

const ROBLOX_GAMES = [
  { id: 1, title: 'GAME_01', desc: 'your roblox game description here.', plays: '—', color: '#00ffff', url: '' },
  { id: 2, title: 'GAME_02', desc: 'your roblox game description here.', plays: '—', color: '#ff00ff', url: '' },
  { id: 3, title: 'GAME_03', desc: 'your roblox game description here.', plays: '—', color: '#aaff00', url: '' },
  { id: 4, title: 'GAME_04', desc: 'your roblox game description here.', plays: '—', color: '#ff6600', url: '' },
];

const EASE = [0.22, 1, 0.36, 1] as const;

export const MyGames = () => {
  const { currentBeat, isPlaying, isMeasure, hasStarted } = useRhythmEngine();
  const b4         = currentBeat % 4;
  const mutedColor = isPlaying ? '#505050' : '#1e1e1e';

  if (!hasStarted) return <SkeletonPage />;

  return (
    <PageWrapper>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.8rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
        <motion.h1
          style={{
            fontFamily: 'var(--pixel)', fontSize: 'clamp(1.6rem, 5.5vw, 3.5rem)',
            letterSpacing: '0.08em', color: isPlaying ? '#00ffff' : '#2e2e2e', transition: 'color 0.8s',
          }}
          animate={isPlaying && isMeasure
            ? { textShadow: ['3px 3px 0 #ff00ff', '-3px -3px 0 #ff00ff', '3px 3px 0 #ff00ff'] }
            : { textShadow: 'none' }}
          transition={{ duration: 0.16 }}
        >MY_GAMES</motion.h1>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 'clamp(0.5rem, 1.1vw, 0.62rem)', letterSpacing: '0.2em', color: isPlaying ? '#2a2a2a' : '#181818', transition: 'color 0.8s' }}>
          ROBLOX
        </span>
      </div>
      <p style={{ fontFamily: 'var(--mono)', fontSize: 'clamp(0.5rem, 1.1vw, 0.62rem)', letterSpacing: '0.2em', color: mutedColor, marginBottom: '1.6rem', transition: 'color 0.8s' }}>
        games i've built on roblox studio
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(220px, 40%, 320px), 1fr))',
          gap: '0.65rem',
          maxWidth: '42rem',
        }}
      >
        {ROBLOX_GAMES.map((game, i) => {
          const beatPulse = isPlaying && b4 === i;
          const Wrapper   = game.url ? 'a' : 'div';
          const linkProps = game.url
            ? { href: game.url, target: '_blank', rel: 'noopener noreferrer' }
            : {};

          return (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: beatPulse && isMeasure ? -4 : 0 }}
              transition={{
                opacity: { delay: i * 0.06, duration: 0.45, ease: EASE as any },
                y: { duration: 0.14 },
              }}
              whileHover={{
                y: -8, scale: 1.02,
                boxShadow: `0 14px 44px ${game.color}22, 0 0 0 1px ${game.color}44`,
                borderColor: `${game.color}55`,
                transition: { duration: 0.22, ease: EASE as any },
              }}
              style={{
                border: `1px solid ${beatPulse ? game.color + '44' : '#1a1a1a'}`,
                background: 'rgba(0,0,0,0.35)',
                boxShadow: beatPulse ? `0 0 20px ${game.color}18` : 'none',
                transition: 'border-color 0.1s, box-shadow 0.1s',
                cursor: game.url ? 'pointer' : 'default',
              }}
            >
              {/* @ts-ignore */}
              <Wrapper {...linkProps} style={{ display: 'block', padding: 'clamp(0.85rem, 2.5vw, 1.2rem)', textDecoration: 'none', color: 'inherit' }}>
                <motion.h2
                  animate={{ color: beatPulse ? game.color : (isPlaying ? '#ffffff' : '#2a2a2a') }}
                  transition={{ duration: 0.1 }}
                  style={{ fontFamily: 'var(--pixel)', fontSize: 'clamp(1rem, 3vw, 1.6rem)', letterSpacing: '0.05em', marginBottom: '0.35rem' }}
                >{game.title}</motion.h2>

                <motion.div animate={{ background: beatPulse ? game.color + '44' : '#161616' }} transition={{ duration: 0.1 }} style={{ height: 1, marginBottom: '0.55rem' }} />

                <p style={{ fontFamily: 'var(--mono)', fontSize: 'clamp(0.56rem, 1.3vw, 0.7rem)', color: mutedColor, lineHeight: 1.7, marginBottom: '0.75rem', transition: 'color 0.8s' }}>
                  {game.desc}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #151515', paddingTop: '0.55rem' }}>
                  <motion.span
                    animate={{ color: beatPulse ? game.color : '#222222' }}
                    transition={{ duration: 0.1 }}
                    style={{ fontFamily: 'var(--mono)', fontSize: 'clamp(0.48rem, 1vw, 0.56rem)', letterSpacing: '0.15em' }}
                  >VISITS: {game.plays}</motion.span>
                  <motion.span
                    animate={beatPulse ? { x: [0, 4, 0] } : { x: 0 }}
                    transition={{ duration: 0.18 }}
                    style={{ fontFamily: 'var(--mono)', fontSize: 'clamp(0.48rem, 1vw, 0.56rem)', letterSpacing: '0.12em', color: isPlaying ? '#2a2a2a' : '#181818', transition: 'color 0.8s' }}
                  >{game.url ? '▶ PLAY' : '▶ SOON'}</motion.span>
                </div>
              {/* @ts-ignore */}
              </Wrapper>
            </motion.div>
          );
        })}
      </div>
    </PageWrapper>
  );
};
