import React, { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { REVEILLON_TARGET_DATE, DEADLINE_COMMANDE } from '../../config';
import { MOTION_EASINGS } from '../../motion/tokens';
import { useReducedMotion } from '../../motion/hooks/useReducedMotion';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  isUrgent: boolean;
}

function calculateTimeLeft(): TimeLeft {
  const now = new Date();
  const diffReveillon = +REVEILLON_TARGET_DATE - +now;

  if (diffReveillon <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true,
      isUrgent: true,
    };
  }

  const days = Math.floor(diffReveillon / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffReveillon / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diffReveillon / 1000 / 60) % 60);
  const seconds = Math.floor((diffReveillon / 1000) % 60);

  const isUnder3Days = diffReveillon <= 3 * 24 * 60 * 60 * 1000;

  return {
    days,
    hours,
    minutes,
    seconds,
    isExpired: false,
    isUrgent: isUnder3Days,
  };
}

// Chiffre individuel avec glissement vertical fluide (0.3 s)
const RollingDigit: React.FC<{ digit: string }> = ({ digit }) => {
  const prefersReduced = useReducedMotion();

  return (
    <div className="relative inline-block h-[1.1em] w-[0.64em] overflow-hidden text-center select-none">
      <AnimatePresence mode="popLayout" initial={false}>
        <m.span
          key={digit}
          initial={prefersReduced ? { opacity: 0 } : { y: '100%', opacity: 0.2 }}
          animate={prefersReduced ? { opacity: 1 } : { y: '0%', opacity: 1 }}
          exit={prefersReduced ? { opacity: 0 } : { y: '-100%', opacity: 0.2 }}
          transition={
            prefersReduced
              ? { duration: 0.15 }
              : { duration: 0.3, ease: MOTION_EASINGS.entrance }
          }
          className="absolute inset-0 flex items-center justify-center font-mono tabular-nums font-bold leading-none will-change-transform"
        >
          {digit}
        </m.span>
      </AnimatePresence>
    </div>
  );
};

// Bloc à 2 chiffres
const RollingNumber: React.FC<{ value: number }> = ({ value }) => {
  const formatted = value.toString().padStart(2, '0');
  const d1 = formatted[0];
  const d2 = formatted[1];
  return (
    <div className="inline-flex items-center justify-center leading-none text-white">
      <RollingDigit digit={d1} />
      <RollingDigit digit={d2} />
    </div>
  );
};

// Deux points de séparation verticaux comme sur la maquette de référence
const ColonSeparator: React.FC = () => (
  <div className="flex flex-col items-center justify-center gap-2 sm:gap-3.5 md:gap-5 px-1 sm:px-2 md:px-3 text-white/80 select-none pb-4 sm:pb-6">
    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 rounded-full bg-white/85 shadow-sm" />
    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 rounded-full bg-white/85 shadow-sm" />
  </div>
);

export const Countdown: React.FC<{ compact?: boolean; className?: string }> = ({
  compact = false,
  className = '',
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number): string => {
    return num.toString().padStart(2, '0');
  };

  if (compact) {
    return (
      <div
        className={`inline-flex items-center gap-2 font-mono tabular-nums text-xs tracking-wider ${
          timeLeft.isUrgent ? 'text-[#C1121F]' : 'text-[#D9C2A3]'
        } ${className}`}
      >
        <span>
          J-{timeLeft.days} · {formatNumber(timeLeft.hours)}:{formatNumber(timeLeft.minutes)}:{formatNumber(timeLeft.seconds)}
        </span>
      </div>
    );
  }

  const units = [
    { label: 'DAYS', frLabel: 'JOURS', value: timeLeft.days },
    { label: 'HOURS', frLabel: 'HEURES', value: timeLeft.hours },
    { label: 'MINUTES', frLabel: 'MINUTES', value: timeLeft.minutes },
    { label: 'SECONDS', frLabel: 'SECONDES', value: timeLeft.seconds },
  ];

  return (
    <div className={`w-full text-center flex flex-col items-center justify-center ${className}`}>
      {/* Horloge monumentale minimaliste style Framer Marketplace */}
      <div className="flex items-center justify-center text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[108px] font-sans font-black tracking-tight text-white py-4 sm:py-6">
        {units.map((unit, index) => (
          <React.Fragment key={unit.label}>
            {/* Colonne Nombre + Label */}
            <div className="flex flex-col items-center justify-center px-1 sm:px-2 md:px-4">
              <RollingNumber value={unit.value} />
              <span className="text-[10px] sm:text-xs md:text-sm font-semibold tracking-[0.25em] text-[#8E95A5] mt-3 sm:mt-5 uppercase font-sans">
                {unit.label}
              </span>
            </div>

            {/* Séparateur deux points entre chaque unité */}
            {index < units.length - 1 && <ColonSeparator />}
          </React.Fragment>
        ))}
      </div>

      {/* Mention discrète sous l'horloge */}
      {DEADLINE_COMMANDE && (
        <p className="mt-8 text-xs sm:text-sm tracking-widest uppercase text-[#8E95A5]/70 font-sans">
          Expédition garantie avant le réveillon pour toute commande avant le{' '}
          <span className="text-white font-medium">{DEADLINE_COMMANDE}</span>
        </p>
      )}
    </div>
  );
};
