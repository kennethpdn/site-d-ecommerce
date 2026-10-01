import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { m, useScroll, useTransform } from 'framer-motion';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Icon } from '../common/Icon';
import { SEED_UNIVERS } from '../../data/seed';
import { useReducedMotion } from '../../motion/hooks/useReducedMotion';
import { useIsTouch } from '../../motion/hooks/useIsTouch';
import { Reveal, RevealText } from '../../motion';

// Images atmosphériques sélectionnées pour chaque univers de réveillon
const UNIVERS_IMAGES: Record<string, string> = {
  'compte-a-rebours': 'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=800&q=80',
  'salon-dore': 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
  'diner-de-minuit': 'https://images.unsplash.com/photo-1543258103-a62bdc069871?auto=format&fit=crop&w=800&q=80',
  'nuit-scintillante': 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
  'exterieur': 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
  'rituel-du-1er-janvier': 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
};

export const UniversPinnedSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const isTouch = useIsTouch();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Déplacement horizontal des 6 tuiles (de 0% à -56%)
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-56%']);

  // Parallaxe interne des images dans les tuiles
  const innerImageX = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);

  return (
    <section className="relative bg-[#060F1F] text-[#E8ECEF] border-t border-argent-20/60 overflow-hidden">
      {/* ========================================================= */}
      {/* VERSION DESKTOP : SECTION ÉPINGLÉE (PINNED 300vh)          */}
      {/* ========================================================= */}
      <div ref={containerRef} className="hidden md:block relative h-[300vh]">
          <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between py-12 px-8 lg:px-16">
            {/* Haut de section : Titre + ligne de progrès champagne 1px */}
            <div className="max-w-[1240px] w-full mx-auto flex flex-col gap-4">
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-xs uppercase tracking-[0.25em] text-[#D9C2A3] font-mono block mb-2">
                    Collections de la Saint-Sylvestre
                  </span>
                  <h2 className="font-display text-4xl lg:text-5xl text-[#E8ECEF]">
                    Les Six Univers de Minuit
                  </h2>
                </div>
                <Link
                  to="/univers"
                  className="group inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#D9C2A3] hover:text-white transition-colors pb-1"
                >
                  <span>Tous les univers</span>
                  <Icon
                    icon={faArrowRight}
                    className="text-xs transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </div>

              {/* Ligne de progression champagne 1px */}
              <div className="w-full h-[1px] bg-white/10 relative overflow-hidden mt-2">
                <m.div
                  style={{ scaleX: scrollYProgress, transformOrigin: '0%' }}
                  className="absolute inset-0 h-full bg-[#D9C2A3]"
                />
              </div>
            </div>

            {/* Centre : Conteneur horizontal animé par le scroll vertical */}
            <div className="relative w-full overflow-visible py-6">
              <m.div
                style={{ x: prefersReduced ? '0%' : x }}
                className="flex items-center gap-8 pl-4 lg:pl-16 will-change-transform"
              >
                {SEED_UNIVERS.map((univers, idx) => {
                  const imageSrc = UNIVERS_IMAGES[univers.slug] || UNIVERS_IMAGES['diner-de-minuit'];

                  return (
                    <Link
                      key={univers.id}
                      to={`/univers/${univers.slug}`}
                      className="group relative w-[380px] lg:w-[440px] h-[440px] lg:h-[480px] shrink-0 rounded-2xl overflow-hidden border border-argent-20/60 bg-[#0B1B33] flex flex-col justify-between p-8 hover:border-[#D9C2A3]/60 transition-all duration-500 shadow-2xl"
                    >
                      {/* Fond visuel avec parallaxe interne et brightening au survol */}
                      <div className="absolute inset-0 w-full h-full overflow-hidden">
                        <m.img
                          src={imageSrc}
                          alt={univers.nom}
                          loading="lazy"
                          style={{ x: prefersReduced ? '0%' : innerImageX, scale: 1.15 }}
                          className="w-full h-full object-cover group-hover:brightness-115 transition-all duration-500 ease-out will-change-transform"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#060F1F] via-[#060F1F]/60 to-[#060F1F]/20 pointer-events-none" />
                      </div>

                      {/* Header de tuile : Indice 01..06 */}
                      <div className="relative z-10 flex items-center justify-between">
                        <span className="font-mono text-xs tracking-widest text-[#D9C2A3] uppercase px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
                          0{idx + 1}
                        </span>
                        <span className="text-[11px] uppercase tracking-widest text-white/70">
                          Ambiance
                        </span>
                      </div>

                      {/* Footer de tuile : Titre, accroche et flèche */}
                      <div className="relative z-10 space-y-2">
                        <h3 className="font-display text-2xl lg:text-3xl text-white group-hover:text-[#D9C2A3] transition-colors leading-tight">
                          {univers.nom}
                        </h3>
                        <p className="text-xs sm:text-sm text-[#C7CCD1] line-clamp-2 leading-relaxed">
                          {univers.accroche}
                        </p>
                        <div className="pt-3 flex items-center justify-between border-t border-white/10">
                          <span className="text-xs uppercase tracking-widest text-white/90 font-medium group-hover:text-[#D9C2A3] transition-colors">
                            Explorer l'ambiance
                          </span>
                          <div className="w-8 h-8 rounded-full border border-white/20 group-hover:border-[#D9C2A3] flex items-center justify-center text-white group-hover:text-[#D9C2A3] group-hover:translate-x-1 transition-all">
                            <Icon icon={faArrowRight} className="text-xs" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </m.div>
            </div>

            {/* Légende discrète sous le carrousel */}
            <div className="max-w-[1240px] w-full mx-auto flex items-center justify-between text-xs text-[#C7CCD1]/60 font-mono">
              <span>Faites défiler verticalement pour explorer</span>
              <span>6 univers d'apparat</span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* VERSION MOBILE : SWIPE NATIVE SNAP                         */}
        {/* ========================================================= */}
        <div className="md:hidden py-16 px-5 max-w-[1240px] mx-auto">
          <div className="mb-8">
            <span className="text-xs uppercase tracking-[0.25em] text-[#D9C2A3] font-mono block mb-2">
              Collections de la Saint-Sylvestre
            </span>
            <RevealText
              as="h2"
              text="Les Six Univers de Minuit"
              className="font-display text-3xl sm:text-4xl text-[#E8ECEF]"
            />
            <p className="text-sm text-[#C7CCD1] mt-2">
              Chaque univers exprime un moment distinct du passage de l'année.
            </p>
          </div>

          {/* Swipeable avec CSS scroll-snap sans blocage du scroll */}
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-4 -mx-5 px-5">
            {SEED_UNIVERS.map((univers, idx) => {
              const imageSrc = UNIVERS_IMAGES[univers.slug] || UNIVERS_IMAGES['diner-de-minuit'];

              return (
                <Link
                  key={univers.id}
                  to={`/univers/${univers.slug}`}
                  className="snap-center shrink-0 w-[84vw] sm:w-[55vw] h-[380px] rounded-2xl overflow-hidden border border-argent-20/60 bg-[#0B1B33] flex flex-col justify-between p-6 relative"
                >
                  <img
                    src={imageSrc}
                    alt={univers.nom}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060F1F] via-[#060F1F]/65 to-transparent pointer-events-none" />

                  <div className="relative z-10 flex items-center justify-between">
                    <span className="font-mono text-xs tracking-widest text-[#D9C2A3] uppercase px-3 py-1 rounded-full bg-black/50 border border-white/10">
                      0{idx + 1}
                    </span>
                  </div>

                  <div className="relative z-10 space-y-1.5">
                    <h3 className="font-display text-2xl text-white">
                      {univers.nom}
                    </h3>
                    <p className="text-xs text-[#C7CCD1] line-clamp-2">
                      {univers.accroche}
                    </p>
                    <div className="pt-2 flex items-center justify-between text-xs text-[#D9C2A3] font-medium">
                      <span>Découvrir</span>
                      <Icon icon={faArrowRight} className="text-xs" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
    </section>
  );
};
