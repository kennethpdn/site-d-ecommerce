import React, { useRef } from 'react';
import { m, useScroll, useTransform } from 'framer-motion';
import { SEED_KITS } from '../../data/seed';
import { KitCard } from '../shop/KitCard';
import { useReducedMotion } from '../../motion/hooks/useReducedMotion';
import { Reveal, RevealText, Stagger, StaggerItem } from '../../motion';

// Composant pour une carte empilable sticky avec réduction d'échelle et assombrissement subtil
const StackingKitCard: React.FC<{
  kit: any;
  index: number;
  total: number;
}> = ({ kit, index, total }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isLast = index === total - 1;
  const prefersReduced = useReducedMotion();

  // Calcul du scroll pour l'assombrissement et la réduction d'échelle (0.96)
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start start', 'end start'],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, isLast ? 1 : 0.96]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, isLast ? 1 : 0.82]);
  const filter = useTransform(scrollYProgress, [0, 1], ['brightness(1)', isLast ? 'brightness(1)' : 'brightness(0.75)']);

  // Sticky offset échelonné (top-28, top-32, top-36)
  const topOffset = `${7 + index * 1.5}rem`;

  return (
    <div
      ref={cardRef}
      style={{ top: topOffset }}
      className="sticky mb-16 will-change-transform"
    >
      <m.div
        style={
          prefersReduced
            ? {}
            : {
                scale,
                opacity,
                filter,
              }
        }
        className="rounded-3xl overflow-hidden shadow-2xl border border-argent-20/80 bg-[#14294A]"
      >
        <KitCard kit={kit} />
      </m.div>
    </div>
  );
};

export const KitsStackingSection: React.FC = () => {
  return (
    <section id="kits-signature" className="py-20 md:py-28 bg-[#080E1A] text-[#E8ECEF] border-t border-argent-20/60">
      <div className="max-w-[1000px] mx-auto px-5 md:px-8">
        {/* Titre éditorial de la section */}
        <div className="text-center mb-16">
          <Reveal direction="down" distance={10}>
            <span className="text-xs uppercase tracking-[0.25em] text-[#D9C2A3] font-mono block mb-3">
              Compositions Scénographiques
            </span>
          </Reveal>
          <RevealText
            as="h2"
            text="Les Kits Signature"
            className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#E8ECEF] mb-4"
          />
          <Reveal delay={0.15}>
            <p className="text-sm sm:text-base text-[#C7CCD1] max-w-xl mx-auto leading-relaxed">
              Tout le nécessaire pour orchestrer vos tables et réceptions du 31 décembre sans fausse note.
            </p>
          </Reveal>
        </div>

        {/* ========================================================= */}
        {/* VERSION DESKTOP : 3 CARTES EMPILÉES STICKY (STACKING)      */}
        {/* ========================================================= */}
        <div className="hidden md:block relative pb-24">
          {SEED_KITS.map((kit, index) => (
            <StackingKitCard
              key={kit.id}
              kit={kit}
              index={index}
              total={SEED_KITS.length}
            />
          ))}
        </div>

        {/* ========================================================= */}
        {/* VERSION MOBILE : STAGGER REVEAL CLASSIQUE                  */}
        {/* ========================================================= */}
        <div className="md:hidden">
          <Stagger className="space-y-8">
            {SEED_KITS.map((kit) => (
              <StaggerItem key={kit.id}>
                <div className="rounded-2xl overflow-hidden border border-argent-20 shadow-xl bg-[#14294A]">
                  <KitCard kit={kit} />
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
};
