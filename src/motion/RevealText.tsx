import React from 'react';
import { m } from 'framer-motion';
import {
  MOTION_DURATIONS,
  MOTION_EASINGS,
  MOTION_STAGGER,
  MOTION_VIEWPORT,
} from './tokens';
import { useReducedMotion } from './hooks/useReducedMotion';

export interface RevealTextProps {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'span' | 'p' | 'div';
  text?: string;
  children?: React.ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
  splitBy?: 'words' | 'lines';
}

export const RevealText: React.FC<RevealTextProps> = ({
  as: Component = 'h2',
  text,
  children,
  className = '',
  delay = 0,
  stagger = MOTION_STAGGER.default,
  splitBy = 'words',
}) => {
  const prefersReduced = useReducedMotion();

  // If text is provided, use it; otherwise, if children is a string, use it.
  const rawText = text ?? (typeof children === 'string' ? children : '');

  // If complex JSX children without raw text, or reduced motion:
  if (!rawText || prefersReduced) {
    return (
      <m.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={MOTION_VIEWPORT}
        transition={{ duration: MOTION_DURATIONS.reduced, delay, ease: 'easeOut' }}
        className={className}
      >
        <Component className={className}>{children ?? text}</Component>
      </m.div>
    );
  }

  // Split into units (words or lines)
  const items = splitBy === 'lines' ? rawText.split('\n') : rawText.split(' ');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: delay,
        staggerChildren: stagger,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: '100%',
    },
    visible: {
      opacity: 1,
      y: '0%',
      transition: {
        duration: MOTION_DURATIONS.text,
        ease: MOTION_EASINGS.entrance,
      },
    },
  };

  return (
    <Component className={className}>
      <m.span
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={MOTION_VIEWPORT}
        className="inline-block"
      >
        {items.map((item, index) => (
          <span key={index} className="inline-block overflow-hidden pb-1 -mb-1 mr-[0.25em] align-top">
            <m.span
              variants={itemVariants}
              className="inline-block will-change-transform"
            >
              {item}
            </m.span>
          </span>
        ))}
      </m.span>
    </Component>
  );
};
