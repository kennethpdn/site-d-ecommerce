import { useEffect, useState } from 'react';
import { useReducedMotion as useFramerReducedMotion } from 'framer-motion';

/**
 * Hook to detect if user has requested reduced motion.
 * Respects OS accessibility settings.
 */
export function useReducedMotion(): boolean {
  const framerReduced = useFramerReducedMotion();
  const [prefersReduced, setPrefersReduced] = useState<boolean>(Boolean(framerReduced));

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mediaQuery.matches || Boolean(framerReduced));

    const handler = (event: MediaQueryListEvent) => {
      setPrefersReduced(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [framerReduced]);

  return prefersReduced;
}
