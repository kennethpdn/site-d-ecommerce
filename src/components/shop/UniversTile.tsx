import React from 'react';
import { Link } from 'react-router-dom';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Univers } from '../../types';
import { Icon } from '../common/Icon';

interface UniversTileProps {
  univers: Univers;
  index: number;
}

export const UniversTile: React.FC<UniversTileProps> = ({ univers, index }) => {
  return (
    <Link
      to={`/univers/${univers.slug}`}
      className="group relative flex flex-col justify-between p-4 sm:p-6 lg:p-8 min-h-[220px] sm:min-h-[280px] bg-[#14294A]/70 border border-argent-20 overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[#14294A] hover:border-[#D9C2A3]/50"
    >
      {/* Halo champagne discret en fond */}
      <div className="absolute inset-0 halo-champagne opacity-40 group-hover:opacity-75 transition-opacity duration-600 pointer-events-none" />

      {/* Numérotation éditoriale élégante */}
      <div className="relative z-10 flex items-center justify-between">
        <span className="font-mono text-[11px] sm:text-xs tracking-widest text-[#D9C2A3] uppercase">
          0{index + 1}
        </span>
        <span className="hidden sm:inline text-[10px] sm:text-xs uppercase tracking-widest text-[#C7CCD1]/60">
          Ambiance
        </span>
      </div>

      {/* Contenu textuel */}
      <div className="relative z-10 my-3 sm:my-4">
        <h3 className="font-display text-lg sm:text-2xl lg:text-3xl text-[#E8ECEF] group-hover:text-[#D9C2A3] transition-colors duration-300">
          {univers.nom}
        </h3>
        <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-[#C7CCD1] line-clamp-2 leading-relaxed">
          {univers.accroche}
        </p>
      </div>

      {/* Pied de tuile */}
      <div className="relative z-10 flex items-center justify-between pt-3 sm:pt-4 border-t border-argent-20/60">
        <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#E8ECEF] font-medium group-hover:text-[#D9C2A3] transition-colors truncate pr-1">
          Découvrir
        </span>
        <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center border border-argent-20 text-[#E8ECEF] group-hover:border-[#D9C2A3] group-hover:text-[#D9C2A3] group-hover:translate-x-1 transition-all duration-300 shrink-0">
          <Icon icon={faArrowRight} className="text-[10px] sm:text-xs" />
        </div>
      </div>
    </Link>
  );
};
