import { motion } from 'framer-motion';
import { useState } from 'react';
import { PageWrapper } from '../components/PageWrapper';
import { SkeletonPage } from '../components/SkeletonPage';
import { useRhythmEngine } from '../hooks/useRhythmEngine';

const SECTIONS = [
  {
    key:   'apps',
    label: 'APPS',
    tag:   '.EXE / SOFTWARE',
    color: '#00ffff',
    items: [
      { title: 'APP_01', desc: 'your app description.', badge: 'DOWNLOAD', url: '' },
      { title: 'APP_02', desc: 'your app description.', badge: 'DOWNLOAD', url: '' },
    ],
  },
  {
    key:   'github',
    label: 'GITHUB',
    tag:   'OPEN SOURCE',
    color: '#aaff00',
    items: [
      { title: 'REPO_01', desc: 'your repo description.', badge: 'GITHUB', url: '' },
      { title: 'REPO_02', desc: 'your repo description.', badge: 'GITHUB', url: '' },
    ],
  },
  {
    key:   'sites',
    label: 'SITES',
    tag:   'WEB',
    color: '#ff00ff',
    items: [
      { title: 'SITE_01', desc: 'website you made.', badge: 'VISIT', url: '' },
      { title: 'SITE_02', desc: 'website you made.', badge: 'VISIT', url: '' },
    ],
  },
  {
    key:   'bots',
    label: 'BOTS',
    tag:   'DISCORD / TELEGRAM',
    color: '#7b68ee',
    items: [
      { title: 'BOT_01', desc: 'discord or telegram bot.', badge: 'INVITE', url: '' },
      { title: 'BOT_02', desc: 'discord or telegram bot.', badge: 'INVITE', url: '' },
    ],
  },
  {
    key:   'tools',
    label: 'TOOLS',
    tag:   '.PY / .BAT / SCRIPTS',
    color: '#ff9944',
    items: [
      { title: 'TOOL_01', desc: 'python, bat, or utility script.', badge: 'GET', url: '' },
      { title: 'TOOL_02', desc: 'python, bat, or utility script.', badge: 'GET', url: '' },
    ],
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;

export const Projects = () => {
  const { currentBeat, isPlaying, isMeasure, hasStarted } = useRhythmEngine();
  const [open, setOpen] = useState<string | null>('apps');
  const b4         = currentBeat % 4;
  const mutedColor = isPlaying ? '#505050' : '#1e1e1e';

  if (!hasStarted) return <SkeletonPage />;

  return (
    <PageWrapper>
      <motion.h1
        style={{
          fontFamily: 'var(--pixel)', fontSize: 'clamp(1.6rem, 5.5vw, 3.5rem)',
          letterSpacing: '0.08em', color: isPlaying ? '#00ffff' : '#2e2e2e',
          marginBottom: '1.4rem', transition: 'color 0.8s',
        }}
        animate={isPlaying && isMeasure
          ? { textShadow: ['3px 3px 0 #ff00ff', '-3px -3px 0 #ff00ff', '3px 3px 0 #ff00ff'] }
          : { textShadow: 'none' }}
        transition={{ duration: 0.16 }}
      >MY_WORK</motion.h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxWidth: '46rem' }}>
        {SECTIONS.map((sec, si) => {
          const isOpen   = open === sec.key;
          const beatSync = isPlaying && b4 === si % 4;

          return (
            <motion.div
              key={sec.key}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: si * 0.05, duration: 0.4, ease: EASE as any }}
            >
              {/* Accordion header */}
              <motion.button
                onClick={() => setOpen(isOpen ? null : sec.key)}
                whileHover={{
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  borderColor: sec.color + '33',
                  transition: { duration: 0.18, ease: EASE as any },
                }}
                animate={{
                  borderColor: beatSync ? sec.color + '55' : isOpen ? '#242424' : '#161616',
                  color:       isOpen ? (isPlaying ? sec.color : '#ffffff') : mutedColor,
                  boxShadow:   beatSync && isOpen ? `0 0 18px ${sec.color}18` : 'none',
                }}
                transition={{ duration: 0.12 }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: 'clamp(0.55rem, 1.6vw, 0.8rem) clamp(0.75rem, 2vw, 1rem)',
                  border: '1px solid #161616', background: isOpen ? 'rgba(255,255,255,0.022)' : 'rgba(0,0,0,0.28)',
                  cursor: 'pointer', userSelect: 'none', textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.7rem', minWidth: 0 }}>
                  <span style={{ fontFamily: 'var(--pixel)', fontSize: 'clamp(0.85rem, 2.3vw, 1.2rem)', letterSpacing: '0.1em', flexShrink: 0 }}>
                    {sec.label}
                  </span>
                  <span style={{
                    fontFamily: 'var(--mono)', fontSize: 'clamp(0.44rem, 0.95vw, 0.54rem)', letterSpacing: '0.18em',
                    color: beatSync ? sec.color : (isPlaying ? '#222' : '#181818'), transition: 'color 0.1s',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>{sec.tag}</span>
                </div>
                <motion.span
                  animate={{ rotate: isOpen ? 90 : 0 }}
                  transition={{ duration: 0.2, ease: EASE as any }}
                  style={{ fontFamily: 'var(--mono)', fontSize: 'clamp(0.6rem, 1.4vw, 0.75rem)', flexShrink: 0, marginLeft: '0.5rem' }}
                >▶</motion.span>
              </motion.button>

              {/* Cards */}
              <motion.div
                initial={false}
                animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.24, ease: EASE as any }}
                style={{ overflow: 'hidden' }}
              >
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(160px, 42%, 240px), 1fr))',
                  gap: '0.4rem', padding: '0.42rem 0 0.65rem 0',
                }}>
                  {sec.items.map((item, ii) => {
                    const cardPulse = isPlaying && b4 === (si + ii) % 4;
                    const Wrapper   = item.url ? 'a' : 'div';
                    const linkProps = item.url
                      ? { href: item.url, target: '_blank', rel: 'noopener noreferrer' }
                      : {};

                    return (
                      <motion.div
                        key={item.title}
                        animate={{
                          borderColor: cardPulse ? sec.color + '44' : '#161616',
                          boxShadow:   cardPulse ? `0 0 16px ${sec.color}18` : 'none',
                          y:           cardPulse && isMeasure ? -2 : 0,
                        }}
                        transition={{ duration: 0.1 }}
                        whileHover={{
                          y: -7, scale: 1.025,
                          boxShadow: `0 12px 40px ${sec.color}20, 0 0 0 1px ${sec.color}44`,
                          borderColor: sec.color + '55',
                          transition: { duration: 0.2, ease: EASE as any },
                        }}
                        style={{
                          border: '1px solid #161616',
                          background: 'rgba(0,0,0,0.28)',
                          cursor: item.url ? 'pointer' : 'default',
                        }}
                      >
                        {/* @ts-ignore */}
                        <Wrapper {...linkProps} style={{ display: 'block', padding: 'clamp(0.65rem, 1.8vw, 0.9rem)', textDecoration: 'none', color: 'inherit' }}>
                          <motion.div
                            animate={{ color: cardPulse ? sec.color : '#222' }}
                            transition={{ duration: 0.1 }}
                            style={{ fontFamily: 'var(--mono)', fontSize: 'clamp(0.44rem, 0.9vw, 0.52rem)', letterSpacing: '0.2em', marginBottom: '0.38rem' }}
                          >[ {item.url ? item.badge : item.badge + ' ·  add url'} ]</motion.div>

                          <motion.h3
                            animate={{ color: cardPulse ? sec.color : (isPlaying ? '#ffffff' : '#2a2a2a') }}
                            transition={{ duration: 0.1 }}
                            style={{ fontFamily: 'var(--pixel)', fontSize: 'clamp(0.8rem, 2vw, 1.05rem)', letterSpacing: '0.06em', marginBottom: '0.3rem' }}
                          >{item.title}</motion.h3>

                          <p style={{ fontFamily: 'var(--mono)', fontSize: 'clamp(0.52rem, 1.1vw, 0.63rem)', color: mutedColor, lineHeight: 1.6, transition: 'color 0.8s' }}>
                            {item.desc}
                          </p>
                        {/* @ts-ignore */}
                        </Wrapper>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </PageWrapper>
  );
};
