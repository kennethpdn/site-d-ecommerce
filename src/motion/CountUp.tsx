import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from './hooks/useReducedMotion';

export interface CountUpProps {
  target: number;
  duration?: number; // seconds
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
  formatter?: (val: number) => string;
}

export const CountUp: React.FC<CountUpProps> = ({
  target,
  duration = 1.2,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = '',
  formatter,
}) => {
  const prefersReduced = useReducedMotion();
  const [displayValue, setDisplayValue] = useState<number>(prefersReduced ? target : 0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (prefersReduced) {
      setDisplayValue(target);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startTime = performance.now();
          const durationMs = duration * 1000;

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / durationMs, 1);
            // Ease out cubic [0.22, 1, 0.36, 1] approximation
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentVal = easeOut * target;

            setDisplayValue(currentVal);

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setDisplayValue(target);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.1, rootMargin: '-10%' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [target, duration, prefersReduced]);

  const formatted = formatter
    ? formatter(displayValue)
    : decimals > 0
    ? displayValue.toFixed(decimals)
    : Math.round(displayValue).toLocaleString('fr-FR');

  return (
    <span
      ref={ref}
      className={`tabular-nums font-mono ${className}`}
      style={{ fontVariantNumeric: 'tabular-nums' }}
    >
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
};
