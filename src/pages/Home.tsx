import React from 'react';
import { SEO } from '../components/common/SEO';
import { VibeLanding } from '../components/home/VibeLanding';
import { Countdown } from '../components/common/Countdown';
import {
  DELAI_LIVRAISON,
  RETOURS,
  MODE_PAIEMENT,
  NUMERO_WHATSAPP,
  GUIDE_URL,
} from '../config';
import { faTruckFast, faRotateLeft, faHandHoldingDollar } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { Icon } from '../components/common/Icon';
import { inscrireNewsletter } from '../lib/supabase';

export const Home: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = React.useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = React.useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      await inscrireNewsletter(newsletterEmail);
      setNewsletterSubmitted(true);
    }
  };

  const reassuranceItems = [
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
          titre: 'Retour',
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
    <>
      <SEO
        title="Maison Minuit | Décoration et illuminations pour le réveillon du 31 décembre"
        description="Maison Minuit. Décors et lumières pour le réveillon du 31 décembre 2026. Explorez nos six univers et nos kits prêts à poser."
      />

      {/* Landing page style VibeVault : Bento Hero, Collection By Univers, Coveted Showcase */}
      <VibeLanding />

      {/* Compte à rebours monumental style Framer Marketplace */}
      <section className="relative py-20 sm:py-28 md:py-36 bg-[#000000] border-y border-white/10 overflow-hidden">
        {/* Lueur blanche diffuse dans le coin supérieur droit comme sur la référence */}
        <div
          className="absolute -top-32 -right-32 w-80 h-80 sm:w-[500px] sm:h-[500px] rounded-full pointer-events-none select-none opacity-60"
          style={{
            background:
              'radial-gradient(circle, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.04) 40%, transparent 70%)',
          }}
          aria-hidden="true"
        />

        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 relative z-10 flex flex-col items-center">
          <Countdown />
        </div>
      </section>

      {/* Réassurance discrète */}
      {reassuranceItems.length > 0 && (
        <section className="py-10 bg-[#080E1A] border-t border-white/10">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {reassuranceItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-[#0D182E] border border-white/10"
                >
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#D9C2A3] shrink-0">
                    <Icon icon={item.icon} className="text-sm" />
                  </div>
                  <div>
                    <h3 className="text-xs uppercase tracking-wider text-white font-medium">
                      {item.titre}
                    </h3>
                    <p className="text-xs text-[#C7CCD1] mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter (si GUIDE_URL) */}
      {GUIDE_URL && (
        <section className="py-16 bg-[#0B1528] border-t border-white/10 text-center">
          <div className="max-w-[700px] mx-auto px-5">
            <span className="text-xs uppercase tracking-[0.25em] text-[#D9C2A3] font-mono block mb-3">
              Le Guide Cérémoniel
            </span>
            <h2 className="font-sans font-bold text-3xl sm:text-4xl text-white mb-3">
              Le guide des 10 ambiances du 31 décembre.
            </h2>
            <p className="text-sm text-[#C7CCD1] mb-8">
              Recevez-le par e-mail, gratuitement.
            </p>

            {newsletterSubmitted ? (
              <div className="p-4 rounded-2xl bg-[#0D182E] border border-[#D9C2A3] text-sm text-white">
                Merci, le guide arrive dans votre boîte.
              </div>
            ) : (
              <form
                onSubmit={handleNewsletterSubmit}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <input
                  type="email"
                  required
                  placeholder="Votre adresse e-mail"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 bg-[#060F1F] border border-white/20 rounded-full px-5 py-3 text-sm text-white focus:outline-none focus:border-[#D9C2A3]"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-full bg-[#E8ECEF] text-[#080E1A] hover:bg-[#D9C2A3] text-xs uppercase font-bold tracking-wider transition-colors cursor-pointer"
                >
                  Recevoir le guide
                </button>
              </form>
            )}
          </div>
        </section>
      )}
    </>
  );
};
