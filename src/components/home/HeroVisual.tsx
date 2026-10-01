import React from 'react';
import { m } from 'framer-motion';
import { useReducedMotion } from '../../motion/hooks/useReducedMotion';

export const HeroVisual: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {/* Fond dégradé nuit profonde 60% #060F1F / #0B1B33 */}
      <div className="absolute inset-0 bg-[#060F1F]" />

      {/* Ambiance cinématographique avec zoom très lent (20s) */}
      <m.div
        animate={
          shouldReduceMotion
            ? {}
            : {
                scale: [1, 1.06, 1],
                opacity: [0.85, 1, 0.85],
              }
        }
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute inset-0 w-full h-full"
      >
        {/* Illumination centrale en halo champagne doux */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 65% 50% at 50% 48%, rgba(217, 194, 163, 0.16) 0%, rgba(11, 27, 51, 0.7) 55%, rgba(6, 15, 31, 0.98) 100%)',
          }}
        />

        {/* Lueur de cierge unique en flou artistique (bas droite / centre doux) */}
        <div
          className="absolute bottom-12 right-1/4 w-72 h-72 rounded-full filter blur-3xl opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(217, 194, 163, 0.7) 0%, rgba(11, 27, 51, 0) 70%)',
          }}
        />

        {/* Halo chaud d'arrière-plan gauche */}
        <div
          className="absolute top-1/4 left-1/5 w-96 h-96 rounded-full filter blur-3xl opacity-25"
          style={{
            background: 'radial-gradient(circle, rgba(217, 194, 163, 0.5) 0%, rgba(11, 27, 51, 0) 70%)',
          }}
        />

        {/* Constellation de bokeh champagne en flou artistique d'arrière-plan */}
        <svg
          className="absolute inset-0 w-full h-full opacity-60 mix-blend-screen"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
          viewBox="0 0 1920 1080"
        >
          <defs>
            <filter id="bokeh-blur-lg" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="35" />
            </filter>
            <filter id="bokeh-blur-md" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="20" />
            </filter>
            <filter id="bokeh-blur-sm" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="8" />
            </filter>

            {/* Dégradé or champagne doux */}
            <radialGradient id="champagne-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFF2D6" stopOpacity="0.8" />
              <stop offset="40%" stopColor="#D9C2A3" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0B1B33" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Orbes bokeh d'ambiance lointaine */}
          <circle cx="220" cy="380" r="90" fill="url(#champagne-grad)" filter="url(#bokeh-blur-lg)" />
          <circle cx="340" cy="520" r="65" fill="url(#champagne-grad)" filter="url(#bokeh-blur-md)" />
          <circle cx="160" cy="620" r="80" fill="url(#champagne-grad)" filter="url(#bokeh-blur-lg)" />
          <circle cx="480" cy="290" r="45" fill="url(#champagne-grad)" filter="url(#bokeh-blur-md)" />

          <circle cx="1680" cy="320" r="95" fill="url(#champagne-grad)" filter="url(#bokeh-blur-lg)" />
          <circle cx="1520" cy="460" r="60" fill="url(#champagne-grad)" filter="url(#bokeh-blur-md)" />
          <circle cx="1780" cy="580" r="110" fill="url(#champagne-grad)" filter="url(#bokeh-blur-lg)" />
          <circle cx="1400" cy="240" r="40" fill="url(#champagne-grad)" filter="url(#bokeh-blur-sm)" />

          {/* Reflets subtils au ras de la table (horizon bas) */}
          <ellipse cx="960" cy="980" rx="720" ry="120" fill="url(#champagne-grad)" filter="url(#bokeh-blur-lg)" opacity="0.4" />
          <ellipse cx="450" cy="920" rx="300" ry="60" fill="url(#champagne-grad)" filter="url(#bokeh-blur-md)" opacity="0.3" />
          <ellipse cx="1480" cy="940" rx="350" ry="70" fill="url(#champagne-grad)" filter="url(#bokeh-blur-md)" opacity="0.35" />

          {/* Particules discrètes de lueurs */}
          <circle cx="280" cy="440" r="12" fill="#D9C2A3" filter="url(#bokeh-blur-sm)" opacity="0.7" />
          <circle cx="390" cy="360" r="8" fill="#FFF2D6" filter="url(#bokeh-blur-sm)" opacity="0.6" />
          <circle cx="1560" cy="390" r="14" fill="#D9C2A3" filter="url(#bokeh-blur-sm)" opacity="0.75" />
          <circle cx="1640" cy="490" r="9" fill="#FFF2D6" filter="url(#bokeh-blur-sm)" opacity="0.6" />
          <circle cx="1440" cy="340" r="6" fill="#D9C2A3" filter="url(#bokeh-blur-sm)" opacity="0.5" />
        </svg>

        {/* Silhouette évocatrice de table de fête au premier plan bas (verrerie et cierge en ombre douce) */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#060F1F] via-[#060F1F]/80 to-transparent" />
      </m.div>

      {/* Trame géométrique texturée anti-banding */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(199,204,209,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(199,204,209,0.02)_1px,transparent_1px)] bg-[size:5rem_5rem] pointer-events-none" />

      {/* Vignetage cinématographique supérieur et inférieur assurant un espace sombre textuel pur au centre */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#060F1F]/70 via-transparent to-[#060F1F]" />
    </div>
  );
};
