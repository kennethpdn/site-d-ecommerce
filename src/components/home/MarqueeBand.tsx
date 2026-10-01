import React from 'react';
import { Marquee } from '../../motion/Marquee';

export const MarqueeBand: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`py-4 sm:py-5 border-y border-argent-20/40 bg-[#060F1F] overflow-hidden select-none ${className}`}
      aria-label="Informations Réveillon Maison Minuit"
    >
      <Marquee speedSeconds={26} pauseOnHover={false}>
        <div className="flex items-center gap-8 sm:gap-12 font-display italic text-[#D9C2A3] opacity-60 text-lg sm:text-2xl tracking-wider uppercase whitespace-nowrap">
          <span>RÉVEILLON 2026</span>
          <span className="not-italic text-xs opacity-60">·</span>
          <span>DÉCORS &amp; LUMIÈRES</span>
          <span className="not-italic text-xs opacity-60">·</span>
          <span>LIVRAISON SUIVIE</span>
          <span className="not-italic text-xs opacity-60">·</span>
          <span>CONSEIL WHATSAPP</span>
          <span className="not-italic text-xs opacity-60">·</span>
        </div>
      </Marquee>
    </div>
  );
};
