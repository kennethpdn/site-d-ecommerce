import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  faInstagram,
  faYoutube,
  faXTwitter,
  faLinkedin,
  faPinterest,
} from '@fortawesome/free-brands-svg-icons';
import { faBolt, faCheck } from '@fortawesome/free-solid-svg-icons';
import { Icon } from '../common/Icon';
import { SEED_UNIVERS } from '../../data/seed';
import { inscrireNewsletter } from '../../lib/supabase';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || loading) return;

    setLoading(true);
    try {
      await inscrireNewsletter(email.trim());
      setSubscribed(true);
      setEmail('');
    } catch {
      setSubscribed(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="w-full bg-[#060F1F] text-[#C7CCD1] pt-12 md:pt-16 pb-12 overflow-hidden">
      <div className="max-w-[1240px] mx-auto px-5 md:px-8">
        {/* --- BANNIÈRE NEWSLETTER ARRONDIR STYLE MODERNE --- */}
        <div className="relative rounded-[28px] sm:rounded-[36px] bg-gradient-to-r from-[#D9A74A] via-[#E5B558] to-[#C99638] text-[#060F1F] p-8 sm:p-12 lg:p-14 shadow-2xl overflow-hidden">
          {/* Lueur d'ambiance intérieure */}
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/20 filter blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-black/10 filter blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Colonne gauche : Titre et sous-titre */}
            <div className="lg:col-span-6 space-y-2">
              <h2 className="text-2xl sm:text-3xl lg:text-[38px] font-bold tracking-tight text-[#060F1F] leading-tight">
                Abonnez-vous à notre newsletter
              </h2>
              <p className="text-sm sm:text-base text-[#060F1F]/80 font-normal max-w-md">
                Soyez les premiers informés de nos créations, décors exclusifs et conseils pour le réveillon 2026.
              </p>
            </div>

            {/* Colonne droite : Formulaire capsule & consentement */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              {subscribed ? (
                <div className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#060F1F] text-white rounded-full text-sm font-medium">
                  <Icon icon={faCheck} className="text-[#D9A74A]" />
                  <span>Merci ! Votre invitation aux Lettres de Minuit est confirmée.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-2.5">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-2 bg-white/20 backdrop-blur-md p-1.5 rounded-[24px] sm:rounded-full border border-white/25">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Entrez votre email..."
                      required
                      className="flex-1 bg-transparent px-5 py-3 text-sm text-[#060F1F] placeholder:text-[#060F1F]/60 focus:outline-none rounded-full"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-[#060F1F] hover:bg-[#14294A] text-white px-7 py-3 rounded-full text-sm font-semibold tracking-wide transition-all shadow-md hover:shadow-lg disabled:opacity-60 cursor-pointer whitespace-nowrap"
                    >
                      {loading ? 'Inscription...' : 'S’inscrire'}
                    </button>
                  </div>
                  <p className="text-[11px] sm:text-xs text-[#060F1F]/70 px-2">
                    En vous inscrivant, vous acceptez notre{' '}
                    <Link to="/confidentialite" className="underline hover:text-black">
                      Politique de Confidentialité
                    </Link>
                    .
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* --- SECTION BASSE DU FOOTER --- */}
        <div className="mt-16 md:mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8 pb-12">
          {/* Bloc Marque & Description & Réseaux */}
          <div className="lg:col-span-2 space-y-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2.5 text-xl font-bold tracking-tight text-[#E8ECEF] hover:text-[#D9A74A] transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-[#14294A] border border-white/10 flex items-center justify-center text-[#D9A74A]">
                <Icon icon={faBolt} className="text-xs" />
              </div>
              <span className="font-sans font-bold">Maison Minuit</span>
            </Link>

            <p className="text-xs sm:text-sm text-[#C7CCD1]/80 max-w-sm leading-relaxed">
              Votre référence de haute scénographie et lumières pour le réveillon du 31 décembre 2026.
            </p>

            {/* Rangée d'icônes réseaux sociaux style pills/cercles */}
            <div className="pt-2 flex items-center gap-2.5">
              <a
                href="#instagram"
                className="w-9 h-9 rounded-full bg-[#14294A]/40 border border-white/10 hover:border-[#D9A74A] hover:text-[#D9A74A] hover:bg-[#14294A] flex items-center justify-center transition-all text-xs"
                aria-label="Instagram"
              >
                <Icon icon={faInstagram} />
              </a>
              <a
                href="#youtube"
                className="w-9 h-9 rounded-full bg-[#14294A]/40 border border-white/10 hover:border-[#D9A74A] hover:text-[#D9A74A] hover:bg-[#14294A] flex items-center justify-center transition-all text-xs"
                aria-label="YouTube"
              >
                <Icon icon={faYoutube} />
              </a>
              <a
                href="#twitter"
                className="w-9 h-9 rounded-full bg-[#14294A]/40 border border-white/10 hover:border-[#D9A74A] hover:text-[#D9A74A] hover:bg-[#14294A] flex items-center justify-center transition-all text-xs"
                aria-label="X / Twitter"
              >
                <Icon icon={faXTwitter} />
              </a>
              <a
                href="#linkedin"
                className="w-9 h-9 rounded-full bg-[#14294A]/40 border border-white/10 hover:border-[#D9A74A] hover:text-[#D9A74A] hover:bg-[#14294A] flex items-center justify-center transition-all text-xs"
                aria-label="LinkedIn"
              >
                <Icon icon={faLinkedin} />
              </a>
              <a
                href="#pinterest"
                className="w-9 h-9 rounded-full bg-[#14294A]/40 border border-white/10 hover:border-[#D9A74A] hover:text-[#D9A74A] hover:bg-[#14294A] flex items-center justify-center transition-all text-xs"
                aria-label="Pinterest"
              >
                <Icon icon={faPinterest} />
              </a>
            </div>
          </div>

          {/* Colonne 1 : Univers */}
          <div className="space-y-3.5">
            <h3 className="text-xs font-semibold text-[#E8ECEF] uppercase tracking-wider">
              Univers
            </h3>
            <ul className="space-y-2 text-xs">
              {SEED_UNIVERS.map((u) => (
                <li key={u.id}>
                  <Link
                    to={`/univers/${u.slug}`}
                    className="text-[#C7CCD1] hover:text-[#E8ECEF] transition-colors"
                  >
                    {u.nom}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 2 : Maison */}
          <div className="space-y-3.5">
            <h3 className="text-xs font-semibold text-[#E8ECEF] uppercase tracking-wider">
              Maison
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/boutique" className="text-[#C7CCD1] hover:text-[#E8ECEF] transition-colors">
                  Boutique
                </Link>
              </li>
              <li>
                <Link to="/inspirations" className="text-[#C7CCD1] hover:text-[#E8ECEF] transition-colors">
                  Inspirations
                </Link>
              </li>
              <li>
                <Link to="/atelier" className="text-[#C7CCD1] hover:text-[#E8ECEF] transition-colors">
                  L’Atelier
                </Link>
              </li>
              <li>
                <Link to="/univers" className="text-[#C7CCD1] hover:text-[#E8ECEF] transition-colors">
                  Tous les univers
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 3 : Support */}
          <div className="space-y-3.5">
            <h3 className="text-xs font-semibold text-[#E8ECEF] uppercase tracking-wider">
              Support
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/aide" className="text-[#C7CCD1] hover:text-[#E8ECEF] transition-colors">
                  Centre d’Aide
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-[#C7CCD1] hover:text-[#E8ECEF] transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/aide" className="text-[#C7CCD1] hover:text-[#E8ECEF] transition-colors">
                  Livraison Réveillon
                </Link>
              </li>
              <li>
                <Link to="/aide" className="text-[#C7CCD1] hover:text-[#E8ECEF] transition-colors">
                  Retours & Échanges
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 4 : Légal */}
          <div className="space-y-3.5">
            <h3 className="text-xs font-semibold text-[#E8ECEF] uppercase tracking-wider">
              Légal
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/confidentialite" className="text-[#C7CCD1] hover:text-[#E8ECEF] transition-colors">
                  Confidentialité
                </Link>
              </li>
              <li>
                <Link to="/cgv" className="text-[#C7CCD1] hover:text-[#E8ECEF] transition-colors">
                  Conditions Générales
                </Link>
              </li>
              <li>
                <Link to="/mentions-legales" className="text-[#C7CCD1] hover:text-[#E8ECEF] transition-colors">
                  Mentions Légales
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-[#C7CCD1] hover:text-[#E8ECEF] transition-colors">
                  Gestion des Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* --- SOUS-LIGNE DISCRÈTE COPYRIGHT --- */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#C7CCD1]/60">
          <p>© 2026 Maison Minuit. Tous droits réservés.</p>
          <p className="text-center sm:text-right">
            Édition Réveillon · Minuit du 31 décembre 2026
          </p>
        </div>
      </div>
    </footer>
  );
};
