import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { m, useScroll, useTransform, MotionValue } from 'framer-motion';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Icon } from '../common/Icon';
import { ImageReveal } from '../../motion/ImageReveal';
import { Reveal } from '../../motion/Reveal';

// Mot individuel dont l'opacité est calée en continu sur le scroll (de 20% à 100%)
const ScrubbedWord: React.FC<{
  word: string;
  progress: MotionValue<number>;
  start: number;
  end: number;
}> = ({ word, progress, start, end }) => {
  const opacity = useTransform(progress, [start, end], [0.2, 1]);

  return (
    <m.span
      style={{ opacity }}
      className="inline-block mr-[0.28em] transition-opacity duration-75 will-change-[opacity]"
    >
      {word}
    </m.span>
  );
};

export const EditorialSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 80%', 'end 40%'],
  });

  const manifestoText =
    "Le 31 décembre mérite mieux qu'un décor de dernière minute. Maison Minuit sélectionne des lumières et des objets d'artisanat pour composer une soirée inoubliable, pas seulement pour la décorer.";

  const words = manifestoText.split(' ');

  return (
    <section
      ref={containerRef}
      className="py-24 md:py-36 bg-[#080E1A] text-[#E8ECEF] border-t border-argent-20/60 overflow-hidden"
    >
      <div className="max-w-[1240px] mx-auto px-5 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Colonne gauche : Grand titre scrubbé mot par mot au scroll */}
          <div className="lg:col-span-7 space-y-8">
            <Reveal direction="down" distance={10}>
              <span className="text-xs uppercase tracking-[0.25em] text-[#D9C2A3] font-mono block">
                Manifeste Éditorial
              </span>
            </Reveal>

            <h2 className="font-display text-2xl sm:text-4xl lg:text-[42px] leading-[1.25] text-white tracking-tight">
              {words.map((word, i) => {
                const step = 1 / words.length;
                const start = i * step;
                const end = Math.min(1, (i + 1) * step);
                return (
                  <ScrubbedWord
                    key={i}
                    word={word}
                    progress={scrollYProgress}
                    start={start}
                    end={end}
                  />
                );
              })}
            </h2>

            <Reveal delay={0.2}>
              <div className="pt-4 flex items-center gap-6">
                <Link
                  to="/atelier"
                  className="group inline-flex items-center gap-2.5 text-xs uppercase tracking-widest text-[#D9C2A3] hover:text-white transition-colors"
                >
                  <span>Découvrir l'Atelier</span>
                  <Icon
                    icon={faArrowRight}
                    className="text-xs transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
                <span className="text-xs text-[#C7CCD1]/60 font-mono">
                  Édition Limitée Réveillon
                </span>
              </div>
            </Reveal>
          </div>

          {/* Colonne droite : Image avec ImageReveal (clip-path inset + scale 1.08 -> 1 over 0.9s) */}
          <div className="lg:col-span-5">
            <ImageReveal
              src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80"
              alt="Maison Minuit composition de table réveillon"
              aspectRatio="4/5"
              className="rounded-3xl border border-argent-20/60 shadow-2xl overflow-hidden"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
