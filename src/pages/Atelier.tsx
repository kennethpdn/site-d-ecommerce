import React from 'react';
import { SEO } from '../components/common/SEO';
import { SectionTitle } from '../components/common/SectionTitle';
import { Reveal, RevealText, Stagger, StaggerItem } from '../motion';

export const Atelier: React.FC = () => {
  return (
    <div className="py-16 md:py-24 max-w-[1200px] mx-auto px-5 md:px-8">
      <SEO
        title="L’Atelier — Maison Minuit"
        description="Le 31 décembre mérite mieux qu'un décor de dernière minute. Découvrez la démarche et les trois principes de Maison Minuit."
      />

      <Reveal>
        <SectionTitle
          kicker="Démarche"
          title="L’Atelier de Minuit"
          subtitle="Une approche mesurée pour faire de votre réveillon un moment d’exception."
        />
      </Reveal>

      {/* Manifeste imposé */}
      <Reveal delay={0.1}>
        <div className="max-w-3xl mx-auto text-center my-12 p-8 sm:p-12 bg-[#14294A] border border-argent-20 relative overflow-hidden">
          <div className="absolute inset-0 halo-champagne opacity-60 pointer-events-none" />
          <blockquote className="font-display text-2xl sm:text-3xl text-[#E8ECEF] leading-snug relative z-10">
            « Le 31 décembre mérite mieux qu'un décor de dernière minute. Maison Minuit sélectionne des lumières et des objets pour composer une soirée, pas seulement pour la décorer. »
          </blockquote>
        </div>
      </Reveal>

      {/* Les Trois Principes avec Stagger */}
      <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-8 my-16">
        <StaggerItem>
          <div className="p-8 bg-[#14294A] border border-argent-20 h-full flex flex-col justify-between">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#D9C2A3] font-mono block mb-3">
                Principe 01
              </span>
              <RevealText
                as="h3"
                text="Choisir peu, choisir bien"
                className="font-display text-2xl text-[#E8ECEF] mb-4"
              />
              <p className="text-sm text-[#C7CCD1] leading-relaxed">
                Une sélection resserrée de pièces durables évite la dispersion visuelle. Chaque objet possède une présence singulière qui structure l’espace sans l’alourdir.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-argent-20/40 text-[11px] uppercase tracking-wider text-[#C7CCD1]/60">
              Rigueur & Épure
            </div>
          </div>
        </StaggerItem>

        <StaggerItem>
          <div className="p-8 bg-[#14294A] border border-argent-20 h-full flex flex-col justify-between">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#D9C2A3] font-mono block mb-3">
                Principe 02
              </span>
              <RevealText
                as="h3"
                text="Composer plutôt qu'empiler"
                className="font-display text-2xl text-[#E8ECEF] mb-4"
              />
              <p className="text-sm text-[#C7CCD1] leading-relaxed">
                L’harmonie naît de l’équilibre entre la flamme, le reflet des métaux et la profondeur des étoffes sombres. Nous pensons l’ensemble comme une scène continue.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-argent-20/40 text-[11px] uppercase tracking-wider text-[#C7CCD1]/60">
              Scénographie Vivante
            </div>
          </div>
        </StaggerItem>

        <StaggerItem>
          <div className="p-8 bg-[#14294A] border border-argent-20 h-full flex flex-col justify-between">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#D9C2A3] font-mono block mb-3">
                Principe 03
              </span>
              <RevealText
                as="h3"
                text="Conseiller à chaque étape"
                className="font-display text-2xl text-[#E8ECEF] mb-4"
              />
              <p className="text-sm text-[#C7CCD1] leading-relaxed">
                Du choix du candélabre au calcul de la durée de combustion des cierges, notre conciergerie accompagne vos préparatifs pour une soirée sans imprévu.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-argent-20/40 text-[11px] uppercase tracking-wider text-[#C7CCD1]/60">
              Accompagnement Dédié
            </div>
          </div>
        </StaggerItem>
      </Stagger>
    </div>
  );
};
