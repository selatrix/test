import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useRhythmEngine } from '../hooks/useRhythmEngine';

export const Nav = () => {
  const location = useLocation();
  const { currentBeat, isPlaying, isMeasure } = useRhythmEngine();

  const links = [
    { path: '/',         label: 'HOME'     },
    { path: '/about-me', label: 'ABOUT'    },
    { path: '/my-games', label: 'GAMES'    },
    { path: '/projects', label: 'PROJECTS' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0" style={{ zIndex: 50 }}>

      {/* Beat pulse line — single 2px line, very minimal */}
      <motion.div
        animate={isPlaying ? {
          opacity: isMeasure ? [0, 0.9, 0] : [0, 0.35, 0],
          scaleX:  isMeasure ? [0.2, 1, 0.5] : [0.1, 0.7, 0.1],
          backgroundColor: isMeasure ? '#00ffff' : '#ffffff',
        } : { opacity: 0, scaleX: 0 }}
        transition={{ duration: isMeasure ? 0.42 : 0.22, ease: 'easeOut' }}
        key={currentBeat}
        style={{
          height: 1.5,
          background: '#00ffff',
          transformOrigin: 'center',
        }}
      />

      {/* Nav link row */}
      <div
        className="flex justify-end items-center"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.9), transparent)',
          padding: 'clamp(0.5rem, 1.8vw, 0.9rem) clamp(1rem, 4vw, 2.2rem)',
          gap:     'clamp(1rem, 3.5vw, 2.4rem)',
        }}
      >
        <AnimatePresence>
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <motion.div
                key={link.path}
                animate={isPlaying && isActive && isMeasure ? { y: -1.5 } : { y: 0 }}
                transition={{ duration: 0.08 }}
              >
                <Link
                  to={link.path}
                  style={{
                    position:      'relative',
                    display:       'inline-block',
                    fontFamily:    'var(--pixel)',
                    fontSize:      'clamp(0.82rem, 2.2vw, 1.2rem)',
                    letterSpacing: '0.14em',
                    color: isActive
                      ? (isPlaying ? (isMeasure ? '#00ffff' : '#ffffff') : '#ffffff')
                      : (isPlaying ? '#3a3a3a' : '#252525'),
                    transition:    'color 0.2s ease',
                    textShadow: isPlaying && isActive && isMeasure
                      ? '0 0 12px rgba(0,255,255,0.6)'
                      : 'none',
                  }}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-underline"
                      style={{
                        position:   'absolute',
                        bottom:     -3,
                        left:       0,
                        right:      0,
                        height:     1,
                        background: isPlaying ? '#00ffff' : '#333333',
                        transition: 'background 0.4s ease',
                      }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </nav>
  );
};
