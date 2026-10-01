import React from 'react';
import { m } from 'framer-motion';
import { faTruckFast, faRotateLeft, faHandHoldingDollar } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { Icon } from '../common/Icon';
import { DELAI_LIVRAISON, RETOURS, MODE_PAIEMENT, NUMERO_WHATSAPP } from '../../config';
import { MOTION_EASINGS, MOTION_VIEWPORT } from '../../motion/tokens';
import { useReducedMotion } from '../../motion/hooks/useReducedMotion';

export const ReassuranceSection: React.FC = () => {
  const prefersReduced = useReducedMotion();

  const items = [
    DELAI_LIVRAISON
      ? {
          icon: faTruckFast,
          titre: 'Livraison suivie',
          desc: DELAI_LIVRAISON,
        }
      : null,
    RETOURS
      ? {
          icon: faRotateLeft,
          titre: 'Retour & Échange',
          desc: RETOURS,
        }
      : null,
    MODE_PAIEMENT
      ? {
          icon: faHandHoldingDollar,
          titre: 'Paiement à la livraison',
          desc: MODE_PAIEMENT,
        }
      : null,
    NUMERO_WHATSAPP
      ? {
          icon: faWhatsapp,
          titre: 'Une question ? Nous répondons.',
          desc: 'Conseil dédié via WhatsApp',
          link: `https://wa.me/${NUMERO_WHATSAPP.replace(/[^0-9]/g, '')}`,
        }
      : null,
  ].filter(Boolean) as Array<{
    icon: any;
    titre: string;
    desc: string;
    link?: string;
  }>;

  return (
    <section className="py-14 bg-[#080E1A] border-t border-argent-20/60">
      <div className="max-w-[1240px] mx-auto px-5 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, idx) => (
            <m.div
              key={idx}
              initial={prefersReduced ? { opacity: 0 } : { scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={MOTION_VIEWPORT}
              transition={
                prefersReduced
                  ? { duration: 0.2, delay: idx * 0.05 }
                  : {
                      type: 'spring',
                      stiffness: MOTION_EASINGS.spring.stiffness,
                      damping: MOTION_EASINGS.spring.damping,
                      delay: idx * 0.08,
                    }
              }
              className="will-change-transform h-full"
            >
              <div className="flex items-center gap-4 p-5 rounded-2xl bg-[#0B1B33] border border-argent-20/60 hover:border-[#D9C2A3]/50 transition-colors h-full shadow-lg">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#D9C2A3] shrink-0">
                  <Icon icon={item.icon} className="text-base" />
                </div>
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-white font-semibold">
                    {item.titre}
                  </h3>
                  <p className="text-xs text-[#C7CCD1] mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
};
