import React from 'react';
import { m } from 'framer-motion';
import {
  MOTION_DURATIONS,
  MOTION_EASINGS,
  MOTION_VIEWPORT,
} from './tokens';
import { useReducedMotion } from './hooks/useReducedMotion';

export interface ImageRevealProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  aspectRatio?: string; // e.g. "16/9", "4/3", "1/1"
  priority?: boolean;
  delay?: number;
}

export const ImageReveal: React.FC<ImageRevealProps> = ({
  src,
  alt,
  className = '',
  imgClassName = '',
  aspectRatio,
  priority = false,
  delay = 0,
}) => {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return (
      <m.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={MOTION_VIEWPORT}
        transition={{ duration: MOTION_DURATIONS.reduced, delay }}
        className={`overflow-hidden relative ${className}`}
        style={aspectRatio ? { aspectRatio } : undefined}
      >
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          className={`w-full h-full object-cover ${imgClassName}`}
        />
      </m.div>
    );
  }

  return (
    <m.div
      initial={{
        clipPath: 'inset(12% 0% 0% 0%)',
        opacity: 0,
      }}
      whileInView={{
        clipPath: 'inset(0% 0% 0% 0%)',
        opacity: 1,
      }}
      viewport={MOTION_VIEWPORT}
      transition={{
        duration: MOTION_DURATIONS.slow,
        delay,
        ease: MOTION_EASINGS.entrance,
      }}
      className={`overflow-hidden relative ${className}`}
      style={{
        aspectRatio: aspectRatio || undefined,
        willChange: 'clip-path, opacity',
      }}
    >
      <m.img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        initial={{ scale: 1.08 }}
        whileInView={{ scale: 1 }}
        viewport={MOTION_VIEWPORT}
        transition={{
          duration: MOTION_DURATIONS.slow,
          delay,
          ease: MOTION_EASINGS.entrance,
        }}
        className={`w-full h-full object-cover will-change-transform ${imgClassName}`}
      />
    </m.div>
  );
};
