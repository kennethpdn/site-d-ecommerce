import React from 'react';
import { m } from 'framer-motion';
import {
  MOTION_DURATIONS,
  MOTION_EASINGS,
  MOTION_DISTANCES,
} from './tokens';
import { useReducedMotion } from './hooks/useReducedMotion';

export interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  className = '',
}) => {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return (
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: MOTION_DURATIONS.reduced, ease: 'easeOut' }}
        className={`w-full ${className}`}
      >
        {children}
      </m.div>
    );
  }

  return (
    <m.div
      initial={{ opacity: 0, y: MOTION_DISTANCES.pageTransition }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -MOTION_DISTANCES.pageTransition }}
      transition={{
        duration: MOTION_DURATIONS.page,
        ease: MOTION_EASINGS.entrance,
      }}
      className={`w-full ${className}`}
      style={{ willChange: 'opacity, transform' }}
    >
      {children}
    </m.div>
  );
};
