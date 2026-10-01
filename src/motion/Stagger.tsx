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

export interface StaggerProps extends HTMLMotionProps<'div'> {
  staggerDelay?: number;
  delay?: number;
  className?: string;
  children: React.ReactNode;
}

export const Stagger: React.FC<StaggerProps> = ({
  staggerDelay = MOTION_STAGGER.default,
  delay = 0,
  className = '',
  children,
  ...rest
}) => {
  const prefersReduced = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: delay,
        staggerChildren: prefersReduced ? 0 : staggerDelay,
      },
    },
  };

  return (
    <m.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={MOTION_VIEWPORT}
      className={className}
      {...rest}
    >
      {children}
    </m.div>
  );
};

export interface StaggerItemProps extends HTMLMotionProps<'div'> {
  className?: string;
  children: React.ReactNode;
}

export const StaggerItem: React.FC<StaggerItemProps> = ({
  className = '',
  children,
  ...rest
}) => {
  const prefersReduced = useReducedMotion();
  const isTouch = useIsTouch();

  const distance = isTouch ? MOTION_DISTANCES.revealTouch : MOTION_DISTANCES.revealDesktop;

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: prefersReduced ? 0 : distance,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReduced ? MOTION_DURATIONS.reduced : MOTION_DURATIONS.base,
        ease: MOTION_EASINGS.entrance,
      },
    },
  };

  return (
    <m.div
      variants={itemVariants}
      className={className}
      style={{ willChange: 'opacity, transform' }}
      {...rest}
    >
      {children}
    </m.div>
  );
};
