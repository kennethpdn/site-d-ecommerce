import React, { useRef } from 'react';
import { m, useScroll, useTransform } from 'framer-motion';
import { MOTION_DISTANCES } from './tokens';
import { useReducedMotion } from './hooks/useReducedMotion';
import { useIsTouch } from './hooks/useIsTouch';

export interface ParallaxProps {
  speed?: number; // -1 to 1 multiplier
  maxOffset?: number; // max in px, capped at ±40px
  className?: string;
  children: React.ReactNode;
}

export const Parallax: React.FC<ParallaxProps> = ({
  speed = 0.2,
  maxOffset = MOTION_DISTANCES.parallaxMax,
  className = '',
  children,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const isTouch = useIsTouch();

  // Strict rule: Desktop only, disabled on touch/reduced-motion
  const isDisabled = prefersReduced || isTouch;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const clampedOffset = Math.min(Math.abs(maxOffset), MOTION_DISTANCES.parallaxMax);
  const targetOffset = clampedOffset * speed;

  const y = useTransform(scrollYProgress, [0, 1], [-targetOffset, targetOffset]);

  if (isDisabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={className}>
      <m.div style={{ y, willChange: 'transform' }}>
        {children}
      </m.div>
    </div>
  );
};
