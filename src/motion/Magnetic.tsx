import React, { useRef } from 'react';
import { m, useSpring } from 'framer-motion';
import { useReducedMotion } from './hooks/useReducedMotion';
import { useIsTouch } from './hooks/useIsTouch';

export interface MagneticProps {
  children: React.ReactNode;
  maxPull?: number; // max 6px per spec
  className?: string;
}

export const Magnetic: React.FC<MagneticProps> = ({
  children,
  maxPull = 6,
  className = '',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const isTouch = useIsTouch();

  const x = useSpring(0, { stiffness: 260, damping: 20 });
  const y = useSpring(0, { stiffness: 260, damping: 20 });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReduced || isTouch || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    // Cap to maxPull (6px)
    const pullX = Math.max(-maxPull, Math.min(maxPull, distanceX * 0.2));
    const pullY = Math.max(-maxPull, Math.min(maxPull, distanceY * 0.2));
    x.set(pullX);
    y.set(pullY);
  };

  const handlePointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  if (prefersReduced || isTouch) {
    return <div className={className}>{children}</div>;
  }

  return (
    <m.div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ x, y, willChange: 'transform' }}
      className={`inline-block ${className}`}
    >
      {children}
    </m.div>
  );
};
