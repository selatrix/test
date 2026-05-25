import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface PageWrapperProps {
  children: ReactNode;
}

const variants = {
  initial: { opacity: 0, y: 18, filter: 'blur(5px)' },
  animate: { opacity: 1, y: 0,  filter: 'blur(0px)' },
  exit:    { opacity: 0, y: -14, filter: 'blur(5px)' },
};

const transition = {
  duration: 0.42,
  ease: 'easeInOut' as const,
};

export const PageWrapper = ({ children }: PageWrapperProps) => (
  <motion.div
    variants={variants}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={transition}
    className="flex-1 z-20 relative"
    style={{ padding: 'clamp(1.2rem, 4vw, 2.5rem) clamp(1rem, 5vw, 3rem)' }}
  >
    {children}
  </motion.div>
);
