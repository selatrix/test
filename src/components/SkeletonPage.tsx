import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Bar = ({ w, h = 8, delay = 0, dim = 0.1 }: { w: string; h?: number; delay?: number; dim?: number }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: dim }}
    transition={{ delay, duration: 0.5 }}
    style={{ width: w, height: h, border: '1px dashed rgba(255,255,255,0.22)', flexShrink: 0 }}
  />
);

export const SkeletonPage = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.4 }}
    style={{
      flex: 1, zIndex: 20, position: 'relative',
      padding: 'clamp(1.2rem, 4vw, 2.5rem) clamp(1rem, 5vw, 3rem)',
      display: 'flex', flexDirection: 'column', gap: '1rem',
    }}
  >
    {/* Title skeleton */}
    <Bar w="clamp(140px, 36%, 260px)" h={38} dim={0.12} />
    <Bar w="clamp(80px, 18%, 130px)"  h={7}  dim={0.07} delay={0.04} />

    <div style={{ height: '0.8rem' }} />

    {/* Card grid skeleton */}
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(160px, 36%, 240px), 1fr))',
      gap: '0.6rem', maxWidth: '42rem',
    }}>
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.06, duration: 0.4 }}
          style={{ border: '1px dashed rgba(255,255,255,0.1)', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
        >
          <Bar w="55%" h={20} dim={0.11} />
          <Bar w="100%" h={5} dim={0.06} delay={0.05} />
          <Bar w="85%"  h={5} dim={0.06} delay={0.07} />
          <Bar w="45%"  h={5} dim={0.04} delay={0.09} />
        </motion.div>
      ))}
    </div>

    {/* Prompt */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.45 }}
      style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.9rem', flexWrap: 'wrap' }}
    >
      <motion.span
        animate={{ opacity: [0.18, 0.4, 0.18] }}
        transition={{ duration: 2.8, repeat: Infinity }}
        style={{ fontFamily: 'var(--mono)', fontSize: 'clamp(0.52rem, 1.2vw, 0.65rem)', letterSpacing: '0.3em', color: '#282828' }}
      >
        START FROM HOME FIRST
      </motion.span>
      <Link
        to="/"
        style={{
          fontFamily: 'var(--pixel)', fontSize: 'clamp(0.6rem, 1.4vw, 0.72rem)',
          letterSpacing: '0.18em', color: '#2a2a2a', textDecoration: 'none',
          border: '1px dashed #222222', padding: '0.3rem 0.65rem',
          display: 'inline-block',
        }}
      >
        ← HOME
      </Link>
    </motion.div>
  </motion.div>
);
