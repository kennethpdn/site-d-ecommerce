import React from 'react';
import { useReducedMotion } from './hooks/useReducedMotion';

export interface MarqueeProps {
  speedSeconds?: number;
  direction?: 'left' | 'right';
  pauseOnHover?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const Marquee: React.FC<MarqueeProps> = ({
  speedSeconds = 25,
  direction = 'left',
  pauseOnHover = true,
  className = '',
  children,
}) => {
  const prefersReduced = useReducedMotion();
  const animationDirection = direction === 'left' ? 'marquee-left' : 'marquee-right';

  return (
    <div
      className={`overflow-hidden relative w-full flex select-none group ${className}`}
      style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}
    >
      <div
        className={`flex shrink-0 items-center gap-8 ${
          pauseOnHover && !prefersReduced ? 'group-hover:[animation-play-state:paused]' : ''
        }`}
        style={{
          animation: prefersReduced
            ? 'none'
            : `${animationDirection} ${speedSeconds}s linear infinite`,
          willChange: prefersReduced ? 'auto' : 'transform',
        }}
      >
        {children}
      </div>
      {!prefersReduced && (
        <div
          aria-hidden="true"
          className={`flex shrink-0 items-center gap-8 ${
            pauseOnHover ? 'group-hover:[animation-play-state:paused]' : ''
          }`}
          style={{
            animation: `${animationDirection} ${speedSeconds}s linear infinite`,
            willChange: 'transform',
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};
