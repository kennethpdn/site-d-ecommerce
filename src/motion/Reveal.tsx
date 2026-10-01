import React from 'react';
import { m, HTMLMotionProps } from 'framer-motion';
import {
  MOTION_DURATIONS,
  MOTION_EASINGS,
  MOTION_DISTANCES,
  MOTION_STAGGER,
  MOTION_VIEWPORT,
} from './tokens';
import { useReducedMotion } from './hooks/useReducedMotion';
import { useIsTouch } from './hooks/useIsTouch';

export interface RevealProps extends HTMLMotionProps<'div'> {
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  delay?: number;
  duration?: number;
  className?: string;
  children: React.ReactNode;
  staggerIndex?: number;
}

export const Reveal: React.FC<RevealProps> = ({
  direction = 'up',
  distance,
  delay = 0,
  duration,
  className = '',
  children,
  staggerIndex,
  ...rest
}) => {
  const prefersReduced = useReducedMotion();
  const isTouch = useIsTouch();

  const finalDistance =
    distance ?? (isTouch ? MOTION_DISTANCES.revealTouch : MOTION_DISTANCES.revealDesktop);
  const finalDuration = duration ?? (prefersReduced ? MOTION_DURATIONS.reduced : MOTION_DURATIONS.base);
  const computedDelay = staggerIndex !== undefined ? staggerIndex * MOTION_STAGGER.default : delay;

  if (prefersReduced) {
    return (
      <m.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={MOTION_VIEWPORT}
        transition={{ duration: finalDuration, delay: computedDelay, ease: 'easeOut' }}
        className={className}
        {...rest}
      >
        {children}
      </m.div>
    );
  }

  const offset = {
    up: { x: 0, y: finalDistance },
    down: { x: 0, y: -finalDistance },
    left: { x: finalDistance, y: 0 },
    right: { x: -finalDistance, y: 0 },
    none: { x: 0, y: 0 },
  }[direction];

  return (
    <m.div
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={MOTION_VIEWPORT}
      transition={{
        duration: finalDuration,
        delay: computedDelay,
        ease: MOTION_EASINGS.entrance,
      }}
      className={className}
      style={{ willChange: 'opacity, transform' }}
      {...rest}
    >
      {children}
    </m.div>
  );
};
