import { useState, useEffect } from 'react';

/**
 * Hook to detect touch devices or small screens (< 768px or pointer: coarse).
 * Disables heavy parallax, cursor magnetic effects, and scroll hijacking on mobile.
 */
export function useIsTouch(): boolean {
  const [isTouch, setIsTouch] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const isSmall = window.innerWidth < 768;
    const isCoarseOnly =
      window.matchMedia('(pointer: coarse)').matches &&
      !window.matchMedia('(pointer: fine)').matches;
    return isSmall || isCoarseOnly;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkTouch = () => {
      const isSmall = window.innerWidth < 768;
      const isCoarseOnly =
        window.matchMedia('(pointer: coarse)').matches &&
        !window.matchMedia('(pointer: fine)').matches;
      setIsTouch(isSmall || isCoarseOnly);
    };

    checkTouch();
    window.addEventListener('resize', checkTouch, { passive: true });
    const mql = window.matchMedia('(pointer: coarse)');
    mql.addEventListener('change', checkTouch);

    return () => {
      window.removeEventListener('resize', checkTouch);
      mql.removeEventListener('change', checkTouch);
    };
  }, []);

  return isTouch;
}
