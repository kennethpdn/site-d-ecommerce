import React, { createContext, useContext, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useIsTouch } from '../hooks/useIsTouch';

interface LenisContextType {
  lenis: Lenis | null;
  stop: () => void;
  start: () => void;
  scrollTo: (target: number | string | HTMLElement, options?: { immediate?: boolean; offset?: number; duration?: number }) => void;
}

const LenisContext = createContext<LenisContextType>({
  lenis: null,
  stop: () => {},
  start: () => {},
  scrollTo: () => {},
});

export const useLenis = () => useContext(LenisContext);

interface LenisProviderProps {
  children: React.ReactNode;
}

export const LenisProvider: React.FC<LenisProviderProps> = ({ children }) => {
  const lenisRef = useRef<Lenis | null>(null);
  const prefersReduced = useReducedMotion();
  const isTouch = useIsTouch();
  const location = useLocation();

  useEffect(() => {
    // Disabled on reduced motion, touch or small screens (<768px or pointer: coarse)
    if (prefersReduced || isTouch || typeof window === 'undefined') {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      return;
    }

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      syncTouch: false,
      anchors: true,
    });

    lenisRef.current = lenis;

    let rafId: number;
    function update(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(update);
    }
    rafId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [prefersReduced, isTouch]);

  // Handle route changes: scroll to top and reset position smoothly or instantly
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [location.pathname]);

  const stop = () => {
    lenisRef.current?.stop();
  };

  const start = () => {
    lenisRef.current?.start();
  };

  const scrollTo = (
    target: number | string | HTMLElement,
    options?: { immediate?: boolean; offset?: number; duration?: number }
  ) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, options);
    } else if (typeof window !== 'undefined') {
      if (typeof target === 'number') {
        window.scrollTo({ top: target, behavior: options?.immediate ? 'instant' : 'smooth' });
      } else if (typeof target === 'string') {
        const el = document.querySelector(target);
        el?.scrollIntoView({ behavior: options?.immediate ? 'instant' : 'smooth' });
      } else if (target instanceof HTMLElement) {
        target.scrollIntoView({ behavior: options?.immediate ? 'instant' : 'smooth' });
      }
    }
  };

  return (
    <LenisContext.Provider value={{ lenis: lenisRef.current, stop, start, scrollTo }}>
      {children}
    </LenisContext.Provider>
  );
};
