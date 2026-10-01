/**
 * Maison Minuit — Motion Design Tokens
 * 
 * Strict performance rules:
 * - Only transform and opacity (clip-path allowed for image reveals).
 * - Durations: micro 0.18s, base 0.5s, slow 0.9s.
 * - Easing: [0.22, 1, 0.36, 1] for entrances, [0.65, 0, 0.35, 1] for exits.
 * - Spring for sheets and drawers: stiffness 260, damping 30.
 * - Stagger: 0.08s.
 * - Reveal distance: 24px (desktop), 16px (touch).
 */

export const MOTION_DURATIONS = {
  micro: 0.18,
  base: 0.5,
  slow: 0.9,
  text: 0.7,
  page: 0.3,
  reduced: 0.2,
} as const;

export const MOTION_EASINGS = {
  entrance: [0.22, 1, 0.36, 1] as const, // Framer-like custom cubic bezier
  exit: [0.65, 0, 0.35, 1] as const,
  spring: {
    stiffness: 260,
    damping: 30,
    mass: 1,
  },
} as const;

export const MOTION_DISTANCES = {
  revealDesktop: 24,
  revealTouch: 16,
  pageTransition: 12,
  parallaxMax: 40,
} as const;

export const MOTION_STAGGER = {
  default: 0.08,
  fast: 0.05,
} as const;

export const MOTION_VIEWPORT = {
  once: true,
  margin: '-10%',
} as const;
