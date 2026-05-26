import { motion } from 'framer-motion';
import type { Transition } from 'framer-motion';
import { useState } from 'react';
import { PageWrapper } from '../components/PageWrapper';
import { SkeletonPage } from '../components/SkeletonPage';
import { useRhythmEngine } from '../hooks/useRhythmEngine';
import { useContent } from '../hooks/useContent';

const EASE: Transition = { ease: 'easeOut', duration: 0.38 };

export const Projects = () => {
  const { currentBeat, isPlaying, isMeasure, hasStarted } = useRhythmEngine();
  const { projects: SECTIONS } = useContent();
  const [open, setOpen] = useState<string | null>('apps');
  const b4    = currentBeat % 4;
  const muted = isPlaying ? '#606060' : '#282828';

  if (!hasStarted) return <SkeletonPage />;

  return (
    <PageWrapper>
      <motion.h1
        style={{
          fontFamily: 'var(--pixel)', fontSize: 'clamp(2rem, 5vw, 3.8rem)',
          letterSpacing: '0.08em', color: isPlaying ? '#00ffff' : '#2e2e2e',
          marginBottom: '1.6rem', transition: 'color 0.8s',
        }}
        animate={isPlaying && isMeasure
          ? { textShadow: ['3px 3px 0 #ff00ff', '-3px -3px 0 #ff00ff', '3px 3px 0 #ff00ff'] }
          : { textShadow: 'none' }}
        transition={{ duration: 0.16 }}
      >MY_WORK</motion.h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', maxWidth: '52rem' }}>
        {SECTIONS.map((sec, si) => {
          const isOpen   = open === sec.key;
          const beatSync = isPlaying && b4 === si % 4;

          return (
            <motion.div
              key={sec.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...EASE, delay: si * 0.045 }}
            >
              {/* Accordion header */}
              <motion.button
                onClick={() => setOpen(isOpen ? null : sec.key)}
                whileHover={{
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  borderColor:     sec.color + '33',
                  transition:      { duration: 0.18 },
                }}
                animate={{
                  borderColor: beatSync ? sec.color + '55' : isOpen ? '#242424' : '#161616',
                  color:       isOpen ? (isPlaying ? sec.color : '#ffffff') : muted,
                  boxShadow:   beatSync && isOpen ? `0 0 18px ${sec.color}16` : 'none',
                }}
                transition={{ duration: 0.12 }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding:    'clamp(0.7rem, 1.5vw, 1rem) clamp(0.9rem, 2vw, 1.2rem)',
                  border:     '1px solid #161616',
                  background: isOpen ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.28)',
                  cursor:     'pointer', userSelect: 'none', textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.8rem', minWidth: 0 }}>
                  <span style={{ fontFamily: 'var(--pixel)', fontSize: 'clamp(1rem, 2vw, 1.4rem)', letterSpacing: '0.1em', flexShrink: 0 }}>
                    {sec.label}
                  </span>
                  <span style={{
                    fontFamily: 'var(--mono)', fontSize: 'clamp(0.6rem, 0.72vw, 0.72rem)', letterSpacing: '0.18em',
                    color:      beatSync ? sec.color : (isPlaying ? '#222' : '#1c1c1c'), transition: 'color 0.1s',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>{sec.tag}</span>
                </div>
                <motion.span
                  animate={{ rotate: isOpen ? 90 : 0 }}
                  transition={{ duration: 0.18 }}
                  style={{ fontFamily: 'var(--mono)', fontSize: 'clamp(0.7rem, 1vw, 0.85rem)', flexShrink: 0, marginLeft: '0.6rem' }}
                >▶</motion.span>
              </motion.button>

              {/* Expanded cards */}
              <motion.div
                initial={false}
                animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                style={{ overflow: 'hidden' }}
              >
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 240px), 1fr))',
                  gap: '0.45rem', padding: '0.45rem 0 0.7rem 0',
                }}>
                  {sec.items.map((item, ii) => {
                    const cp  = isPlaying && b4 === (si + ii) % 4;
                    const Tag = item.url ? 'a' : 'div';
                    const lp  = item.url ? { href: item.url, target: '_blank', rel: 'noopener noreferrer' } : {};

                    return (
                      <motion.div
                        key={`${sec.key}-${item.title}-${ii}`}
                        animate={{
                          borderColor: cp ? sec.color + '44' : '#161616',
                          boxShadow:   cp ? `0 0 16px ${sec.color}16` : 'none',
                          y:           cp && isMeasure ? -2 : 0,
                        }}
                        transition={{ duration: 0.1 }}
                        whileHover={{
                          y: -7, scale: 1.025,
                          boxShadow:   `0 12px 38px ${sec.color}1e, 0 0 0 1px ${sec.color}44`,
                          borderColor: sec.color + '55',
                          transition:  { duration: 0.2 },
                        }}
                        style={{
                          border:     '1px solid #161616',
                          background: 'rgba(0,0,0,0.28)',
                          cursor:     item.url ? 'pointer' : 'default',
                        }}
                      >
                        {/* @ts-ignore */}
                        <Tag {...lp} style={{ display: 'block', padding: 'clamp(0.8rem, 1.8vw, 1.1rem)', textDecoration: 'none', color: 'inherit' }}>
                          <motion.div
                            animate={{ color: cp ? sec.color : '#252525' }}
                            transition={{ duration: 0.1 }}
                            style={{ fontFamily: 'var(--mono)', fontSize: 'clamp(0.58rem, 0.7vw, 0.68rem)', letterSpacing: '0.18em', marginBottom: '0.4rem' }}
                          >[ {item.url ? item.badge : `${item.badge} · add url`} ]</motion.div>

                          <motion.h3
                            animate={{ color: cp ? sec.color : (isPlaying ? '#ffffff' : '#2a2a2a') }}
                            transition={{ duration: 0.1 }}
                            style={{ fontFamily: 'var(--pixel)', fontSize: 'clamp(1rem, 1.4vw, 1.25rem)', letterSpacing: '0.06em', marginBottom: '0.32rem' }}
                          >{item.title}</motion.h3>

                          <p style={{ fontFamily: 'var(--mono)', fontSize: 'clamp(0.72rem, 0.88vw, 0.86rem)', color: muted, lineHeight: 1.65, transition: 'color 0.8s' }}>
                            {item.desc}
                          </p>
                        {/* @ts-ignore */}
                        </Tag>
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
