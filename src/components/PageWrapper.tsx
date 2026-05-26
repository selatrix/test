import { motion } from 'framer-motion';
import type { Transition } from 'framer-motion';
import type { ReactNode } from 'react';

interface PageWrapperProps {
  children: ReactNode;
}

const variants = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0  },
  exit:    { opacity: 0, y: -10 },
};

/* No blur — blur forces full-subtree GPU compositing on every frame */
const transition: Transition = {
  duration: 0.36,
  ease:     'easeOut',
};

export const PageWrapper = ({ children }: PageWrapperProps) => (
  <motion.div
    variants={variants}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={transition}
    className="flex-1 z-20 relative"
    style={{
      padding:  'clamp(2rem, 5vw, 3.5rem) clamp(1.5rem, 5vw, 3.5rem)',
      maxWidth: '100%',
    }}
  >
    {children}
  </motion.div>
);
