import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { m, useScroll, useTransform } from 'framer-motion';
import { useReducedMotion } from '../../motion/hooks/useReducedMotion';
import { faArrowRight, faClock, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Icon } from '../common/Icon';
import { REVEILLON_TARGET_DATE } from '../../config';
import { MOTION_EASINGS } from '../../motion/tokens';
import { Magnetic } from '../../motion/Magnetic';

const EASING = MOTION_EASINGS.entrance;

// 14 particules bokeh en CSS-only (8 sur mobile, 6 additionnelles sur écran >= 640px)
const BOKEH_PARTICLES = [
  // 8 visibles sur mobile et grand écran
  { id: 1, size: 14, color: '#D9C2A3', top: '16%', left: '12%', minOp: 0.12, maxOp: 0.28, driftDur: 22, pulseDur: 7, blur: 1.5, desktopOnly: false },
  { id: 2, size: 8, color: '#C7CCD1', top: '28%', left: '84%', minOp: 0.10, maxOp: 0.25, driftDur: 26, pulseDur: 8, blur: 1, desktopOnly: false },
  { id: 3, size: 20, color: '#D9C2A3', top: '44%', left: '8%', minOp: 0.15, maxOp: 0.32, driftDur: 19, pulseDur: 6, blur: 2, desktopOnly: false },
  { id: 4, size: 10, color: '#C7CCD1', top: '68%', left: '20%', minOp: 0.10, maxOp: 0.22, driftDur: 28, pulseDur: 9, blur: 1, desktopOnly: false },
  { id: 5, size: 24, color: '#D9C2A3', top: '76%', left: '82%', minOp: 0.16, maxOp: 0.35, driftDur: 24, pulseDur: 8, blur: 2.5, desktopOnly: false },
  { id: 6, size: 12, color: '#D9C2A3', top: '22%', left: '70%', minOp: 0.12, maxOp: 0.28, driftDur: 21, pulseDur: 7, blur: 1.5, desktopOnly: false },
  { id: 7, size: 16, color: '#C7CCD1', top: '84%', left: '36%', minOp: 0.14, maxOp: 0.30, driftDur: 25, pulseDur: 9, blur: 1.8, desktopOnly: false },
  { id: 8, size: 6, color: '#D9C2A3', top: '36%', left: '32%', minOp: 0.10, maxOp: 0.25, driftDur: 30, pulseDur: 6, blur: 1, desktopOnly: false },

  // 6 additionnelles affichées sur écran >= 640px
  { id: 9, size: 18, color: '#D9C2A3', top: '14%', left: '46%', minOp: 0.14, maxOp: 0.32, driftDur: 23, pulseDur: 8, blur: 2, desktopOnly: true },
  { id: 10, size: 12, color: '#C7CCD1', top: '56%', left: '74%', minOp: 0.10, maxOp: 0.24, driftDur: 27, pulseDur: 10, blur: 1.2, desktopOnly: true },
  { id: 11, size: 22, color: '#D9C2A3', top: '88%', left: '14%', minOp: 0.16, maxOp: 0.34, driftDur: 20, pulseDur: 7, blur: 2.2, desktopOnly: true },
  { id: 12, size: 8, color: '#C7CCD1', top: '10%', left: '92%', minOp: 0.10, maxOp: 0.22, driftDur: 29, pulseDur: 9, blur: 1, desktopOnly: true },
  { id: 13, size: 14, color: '#D9C2A3', top: '48%', left: '94%', minOp: 0.12, maxOp: 0.28, driftDur: 18, pulseDur: 6, blur: 1.5, desktopOnly: true },
  { id: 14, size: 16, color: '#C7CCD1', top: '72%', left: '56%', minOp: 0.15, maxOp: 0.30, driftDur: 24, pulseDur: 8, blur: 1.8, desktopOnly: true },
];

function calculateDaysLeft(): number {
  const target = REVEILLON_TARGET_DATE.getTime();
  const now = Date.now();
  const diff = target - now;
  if (diff <= 0) return 0;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export const HeroSection: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const [daysLeft, setDaysLeft] = useState<number>(calculateDaysLeft());
  const [imageLoaded, setImageLoaded] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setDaysLeft(calculateDaysLeft());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Parallaxe et scroll-out du Hero
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.65], [0, -60]);

  return (
    <section
      ref={heroRef}
      className="relative h-[100svh] min-h-[100svh] w-full flex items-center justify-center overflow-hidden bg-[#060F1F] px-5 py-24 sm:py-32"
    >
      {/* --- FOND DU HERO : zoom CSS 1.05 -> 1.15 sur 24s + parallaxe + scale vers 0.94 avec bordure argent 1px --- */}
      <m.div
        style={shouldReduceMotion ? {} : { scale: heroScale }}
        className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none border border-argent-20/40"
      >
        <m.div
          style={shouldReduceMotion ? {} : { y: backgroundY }}
          className="absolute inset-0 w-full h-full overflow-hidden hero-zoom-bg"
        >
          {/* Fond ambiant de sécurité */}
          <div
            className="absolute inset-0 w-full h-full bg-[#0B1B33]"
            style={{
              background:
                'radial-gradient(circle at 50% 50%, #14294A 0%, #0B1B33 60%, #060F1F 100%)',
            }}
          />

          {/* Image de fond de haute qualité */}
          <img
            src="https://images.unsplash.com/photo-1543258103-a62bdc069871?auto=format&fit=crop&w=1920&q=85"
            alt="Maison Minuit Réveillon"
            fetchPriority="high"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Overlays cinématiques pour contraste parfait */}
          <div
            className="absolute inset-0 md:hidden pointer-events-none"
            style={{
              background:
                'linear-gradient(to bottom, rgba(6,15,31,0.85) 0%, rgba(11,27,51,0.82) 50%, #0B1B33 100%)',
            }}
          />
          <div
            className="absolute inset-0 hidden md:block pointer-events-none"
            style={{
              background:
                'linear-gradient(to bottom, rgba(6,15,31,0.75) 0%, rgba(11,27,51,0.65) 50%, #0B1B33 100%)',
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at 50% 60%, rgba(217, 194, 163, 0.14) 0%, transparent 65%)',
            }}
          />
        </m.div>
      </m.div>

      {/* --- LUMIÈRES : 14 Particules Bokeh en CSS pur (8 sur mobile, 6 sur desktop) --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {BOKEH_PARTICLES.map((p) => (
          <span
            key={p.id}
            className={`absolute rounded-full bokeh-particle ${p.desktopOnly ? 'hidden sm:block' : ''}`}
            style={
              {
                width: `${p.size}px`,
                height: `${p.size}px`,
                backgroundColor: p.color,
                top: p.top,
                left: p.left,
                filter: `blur(${p.blur}px)`,
                animationDuration: `${p.driftDur}s, ${p.pulseDur}s`,
                '--bokeh-opacity-min': p.minOp,
                '--bokeh-opacity-max': p.maxOp,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* --- CONTENU DU HERO : Sequence sous 1.4s + On scroll-out fade & rise (opacity 1 -> 0, y 0 -> -60) --- */}
      <m.div
        style={shouldReduceMotion ? {} : { opacity: contentOpacity, y: contentY }}
        className="relative z-10 max-w-[1200px] mx-auto text-center flex flex-col items-center pt-8 sm:pt-4"
      >
        {/* 1. Surtitre / Eyebrow (0 ms, 400ms) */}
        <m.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0, ease: EASING }}
          className="flex items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8"
        >
          <span className="w-6 h-[1px] bg-[#D9C2A3] opacity-80" aria-hidden="true" />
          <span className="font-sans font-medium text-[12px] sm:text-[13px] tracking-[0.3em] uppercase text-[#D9C2A3]">
            RÉVEILLON 2026 · DÉCORS & LUMIÈRES
          </span>
          <span className="w-6 h-[1px] bg-[#D9C2A3] opacity-80" aria-hidden="true" />
        </m.div>

        {/* 2. H1 « Il est minuit quelque part. » lignes masquées (stagger 0.12 s : 0.12s et 0.24s) */}
        <h1 className="font-display text-[clamp(44px,9vw,104px)] text-[#E8ECEF] font-medium tracking-tight text-center leading-[1.05] mb-6">
          <span className="block overflow-hidden pb-1">
            <m.span
              className="block"
              initial={shouldReduceMotion ? {} : { y: '100%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.12, ease: EASING }}
            >
              Il est
            </m.span>
          </span>

          <span className="block overflow-hidden pb-2">
            <m.span
              className="block"
              initial={shouldReduceMotion ? {} : { y: '100%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.24, ease: EASING }}
            >
              <em className="font-display italic text-[#D9C2A3] font-normal not-italic:font-serif">
                minuit
              </em>{' '}
              quelque part.
            </m.span>
          </span>
        </h1>

        {/* 3. Sous-titre (0.4 s, 400ms) */}
        <m.p
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4, ease: EASING }}
          className="font-sans text-base sm:text-xl text-[#C7CCD1] font-light max-w-[34ch] text-center leading-relaxed mb-10"
        >
          Décors et lumières pour le réveillon du 31 décembre 2026.
        </m.p>

        {/* 4. Boutons avec Stagger 0.1s (0.6s & 0.7s), fill sweep 0.4s, arrow 4px, magnetic pull max 6px */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-8">
          <m.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6, ease: EASING }}
            className="w-full sm:w-auto"
          >
            <Magnetic maxPull={6}>
              <Link
                to="/univers"
                className="group btn-sweep w-full sm:w-auto h-[52px] px-8 bg-[#E8ECEF] text-[#0B1B33] hover:text-[#E8ECEF] border border-[#E8ECEF] text-xs uppercase tracking-wider font-medium flex items-center justify-center gap-2.5 transition-all duration-400 cursor-pointer"
              >
                <span className="relative z-10">Explorer les univers</span>
                <Icon
                  icon={faArrowRight}
                  className="text-xs relative z-10 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
                />
              </Link>
            </Magnetic>
          </m.div>

          <m.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.7, ease: EASING }}
            className="w-full sm:w-auto"
          >
            <Magnetic maxPull={6}>
              <a
                href="#kits-signature"
                className="group btn-sweep btn-sweep-outline w-full sm:w-auto h-[52px] px-8 bg-transparent text-[#E8ECEF] hover:border-[#D9C2A3] hover:text-[#0B1B33] border border-argent-20 text-xs uppercase tracking-wider font-medium flex items-center justify-center transition-all duration-400 cursor-pointer"
              >
                <span className="relative z-10">Voir les kits prêts à poser</span>
              </a>
            </Magnetic>
          </m.div>
        </div>

        {/* 5. Countdown pill (0.9 s, 400ms) - Total load sequence <= 1.3s (< 1.4s) */}
        <m.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.9, ease: EASING }}
        >
          <div className="inline-flex items-center gap-2.5 px-4 py-2 border border-[#C7CCD1]/20 bg-[#14294A]/40 backdrop-blur-xs rounded-full">
            <Icon icon={faClock} className="text-xs text-[#D9C2A3]" />
            <span className="font-mono text-xs text-[#E8ECEF] tabular-nums tracking-wide">
              Il reste {daysLeft} jours avant minuit
            </span>
          </div>
        </m.div>
      </m.div>

      {/* Indicateur de scroll : flèche basse */}
      <m.div
        animate={
          shouldReduceMotion
            ? {}
            : {
                y: [0, 8, 0],
              }
        }
        transition={{
          duration: 2.4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex-col items-center pointer-events-none text-[#D9C2A3]/70"
        aria-hidden="true"
      >
        <Icon icon={faChevronDown} className="text-xs" />
      </m.div>
    </section>
  );
};
