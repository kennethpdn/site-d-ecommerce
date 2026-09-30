import React from 'react';

interface DiningTableVisual45Props {
  className?: string;
  subtleLabel?: string;
}

/**
 * Rendu visuel 4:5 de table de réveillon cinématique haut de gamme :
 * - Atmosphère bleu nuit profond (#0B1B33, #060F1F)
 * - Lumières bokeh or-champagne en arrière-plan
 * - Flou artistique (shallow depth of field)
 * - Reflets cristallins et lueur de cierge délicate
 * - Espace central sombre dégagé pour les titrages ou la contemplation
 */
export const DiningTableVisual45: React.FC<DiningTableVisual45Props> = ({
  className = '',
  subtleLabel,
}) => {
  return (
    <div
      className={`relative aspect-[4/5] w-full overflow-hidden bg-[#0B1B33] select-none ${className}`}
      aria-hidden="true"
    >
      {/* Fond bleu nuit en dégradé profond */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 38%, rgba(20, 41, 74, 0.9) 0%, rgba(11, 27, 51, 0.98) 60%, rgba(6, 15, 31, 1) 100%)',
        }}
      />

      {/* Bokeh champagne et lueurs de table en SVG vectoriel ultra détaillé */}
      <svg
        className="absolute inset-0 w-full h-full opacity-75 mix-blend-screen"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 800 1000"
      >
        <defs>
          <filter id="bokeh-45-heavy" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="30" />
          </filter>
          <filter id="bokeh-45-med" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="16" />
          </filter>
          <filter id="bokeh-45-soft" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" />
          </filter>

          <radialGradient id="champagne-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF4DE" stopOpacity="0.85" />
            <stop offset="45%" stopColor="#D9C2A3" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#0B1B33" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="candle-flame-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFDF7" stopOpacity="0.95" />
            <stop offset="35%" stopColor="#F5D79E" stopOpacity="0.6" />
            <stop offset="70%" stopColor="#D9C2A3" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#0B1B33" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Constellations de bokeh lointains en haut et en arrière-plan */}
        <circle cx="160" cy="180" r="55" fill="url(#champagne-glow)" filter="url(#bokeh-45-heavy)" />
        <circle cx="280" cy="120" r="40" fill="url(#champagne-glow)" filter="url(#bokeh-45-med)" />
        <circle cx="620" cy="190" r="60" fill="url(#champagne-glow)" filter="url(#bokeh-45-heavy)" />
        <circle cx="700" cy="280" r="45" fill="url(#champagne-glow)" filter="url(#bokeh-45-med)" />
        <circle cx="120" cy="340" r="35" fill="url(#champagne-glow)" filter="url(#bokeh-45-med)" />

        {/* Lueur unique du cierge en flou artistique doux (latéral bas gauche) */}
        <circle cx="240" cy="740" r="140" fill="url(#candle-flame-glow)" filter="url(#bokeh-45-heavy)" opacity="0.6" />
        <ellipse cx="240" cy="735" rx="30" ry="60" fill="url(#candle-flame-glow)" filter="url(#bokeh-45-soft)" opacity="0.8" />

        {/* Reflets de cristal fins (flûte en verre diaphane évanescente) */}
        <path
          d="M 580 620 Q 610 700 600 780 L 600 860 L 570 870 L 630 870"
          stroke="#D9C2A3"
          strokeWidth="1.5"
          fill="none"
          opacity="0.3"
          filter="url(#bokeh-45-soft)"
        />
        <ellipse cx="600" cy="620" rx="35" ry="12" stroke="#E8ECEF" strokeWidth="1" fill="none" opacity="0.35" filter="url(#bokeh-45-soft)" />

        {/* Ligne d'horizon de la table avec poudroiement d'or doux */}
        <ellipse cx="400" cy="880" rx="380" ry="85" fill="url(#champagne-glow)" filter="url(#bokeh-45-heavy)" opacity="0.45" />

        {/* Particules scintillantes discrètes de lueurs */}
        <circle cx="190" cy="240" r="5" fill="#FFF2D6" filter="url(#bokeh-45-soft)" opacity="0.8" />
        <circle cx="230" cy="160" r="4" fill="#D9C2A3" filter="url(#bokeh-45-soft)" opacity="0.7" />
        <circle cx="650" cy="140" r="6" fill="#FFF2D6" filter="url(#bokeh-45-soft)" opacity="0.85" />
        <circle cx="560" cy="220" r="3.5" fill="#D9C2A3" filter="url(#bokeh-45-soft)" opacity="0.6" />
        <circle cx="480" cy="810" r="4.5" fill="#FFF4DE" filter="url(#bokeh-45-soft)" opacity="0.75" />
      </svg>

      {/* Trame géométrique ténue anti-banding */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(199,204,209,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(199,204,209,0.02)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none" />

      {/* Espace central sombre dégagé pour la respiration textuelle ou le titre */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
        <div className="w-12 h-[1px] bg-[#D9C2A3]/30 mb-4" />
        <span className="font-display italic text-2xl sm:text-3xl text-[#D9C2A3]/80 mb-2">
          Maison Minuit
        </span>
        {subtleLabel && (
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#C7CCD1]/70 font-mono">
            {subtleLabel}
          </span>
        )}
        <div className="w-12 h-[1px] bg-[#D9C2A3]/30 mt-4" />
      </div>

      {/* Filet champagne subtil en bordure inférieure */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D9C2A3]/40 to-transparent" />
    </div>
  );
};
