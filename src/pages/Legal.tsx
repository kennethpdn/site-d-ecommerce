import { Reveal, RevealText } from '../motion';
import { useLocation, Link } from 'react-router-dom';
import { SEO } from '../components/common/SEO';

export const Legal: React.FC = () => {
  const { pathname } = useLocation();

  const getPageInfo = () => {
    switch (pathname) {
      case '/cgv':
        return {
          title: 'Conditions Générales de Vente',
          kicker: 'Cadre Contractuel',
          content: [
            {
              h: 'Article 1 — Champ d’application',
              p: 'Les présentes conditions régissent sans réserve toute acquisition d’articles d’artisanat et d’illuminations au sein de Maison Minuit, spécialement conçus pour la célébration du réveillon du 31 décembre 2026. [Modèle — À compléter et à valider]',
            },
            {
              h: 'Article 2 — Réservations et absence de paiement en ligne',
              p: 'Maison Minuit ne traite aucun règlement bancaire en ligne. Toute commande transmise via le site web constitue une réservation préalable qui est ensuite validée et confirmée avec le client sur WhatsApp. Le règlement intervient hors ligne selon les modalités convenues. [Modèle — À compléter et à valider]',
            },
            {
              h: 'Article 3 — Tarifs et devises',
              p: 'Les prix affichés sont exprimés en Francs CFA (FCFA) ou devises locales applicables. Les frais éventuels d’acheminement sont confirmés lors de l’échange WhatsApp préalable à la livraison. [Modèle — À compléter et à valider]',
            },
            {
              h: 'Article 4 — Délais d’acheminement pour la Saint-Sylvestre',
              p: 'Maison Minuit organise ses tournées pour garantir la remise des colis avant l’ouverture du réveillon du 31 décembre 2026 pour toutes les commandes confirmées avant la clôture fixée. [Modèle — À compléter et à valider]',
            },
          ],
        };
      case '/mentions-legales':
        return {
          title: 'Mentions Légales',
          kicker: 'Informations Réglementaires',
          content: [
            {
              h: 'Édition du Service',
              p: 'Le présent service en ligne est édité pour Maison Minuit. Contact conciergerie : WhatsApp +229 01 54 75 45 44. [Modèle — À compléter et à valider]',
            },
            {
              h: 'Hébergement',
              p: 'L’infrastructure applicative est hébergée sur des serveurs sécurisés conformes aux normes en vigueur. [Modèle — À compléter et à valider]',
            },
            {
              h: 'Propriété Intellectuelle',
              p: 'L’ensemble des dénominations, créations scénographiques, textes et compositions photographiques demeurent la propriété exclusive de Maison Minuit. [Modèle — À compléter et à valider]',
            },
          ],
        };
      case '/confidentialite':
        return {
          title: 'Politique de Confidentialité',
          kicker: 'Protection des Données',
          content: [
            {
              h: 'Collecte raisonnée et finalité',
              p: 'Maison Minuit ne recueille que les informations strictement indispensables à la livraison de vos pièces (nom, numéro WhatsApp, adresse, créneau souhaité). Aucune coordonnée bancaire n’est requise ni conservée. [Modèle — À compléter et à valider]',
            },
            {
              h: 'Confidentialité et non-cession',
              p: 'Vos coordonnées ne font l’objet d’aucune cession ni exploitation commerciale tierce. Elles servent uniquement à l’exécution de votre commande du 31 décembre 2026. [Modèle — À compléter et à valider]',
            },
            {
              h: 'Vos droits',
              p: 'Vous disposez d’un droit permanent d’accès, de rectification et de suppression de vos données sur simple demande auprès de notre conciergerie. [Modèle — À compléter et à valider]',
            },
          ],
        };
      case '/cookies':
      default:
        return {
          title: 'Politique des Cookies',
          kicker: 'Traceurs & Confidentialité',
          content: [
            {
              h: 'Cookies fonctionnels strictement nécessaires',
              p: 'Maison Minuit emploie exclusivement le stockage local de votre navigateur pour maintenir en mémoire votre panier (« Ma sélection ») lors de votre navigation. [Modèle — À compléter et à valider]',
            },
            {
              h: 'Absence totale de traceurs publicitaires',
              p: 'Notre plateforme n’embarque aucun traceur tiers, ni régie publicitaire, ni profilage comportemental. [Modèle — À compléter et à valider]',
            },
          ],
        };
    }
  };

  const info = getPageInfo();

  return (
    <div className="py-16 md:py-24 max-w-[800px] mx-auto px-5 md:px-8">
      <SEO title={`${info.title} | Maison Minuit`} description={`${info.title} de Maison Minuit.`} />

      <Reveal>
        <div className="mb-6 inline-block p-3 bg-[#14294A] border border-[#D9C2A3]/50 text-xs text-[#D9C2A3] font-mono">
          Document modèle — À compléter et à valider avant exploitation définitive
        </div>

        <span className="text-xs uppercase tracking-[0.25em] text-[#D9C2A3] font-mono block mb-2">
          {info.kicker}
        </span>
        <RevealText
          as="h1"
          text={info.title}
          className="title-fluid-section font-display text-[#E8ECEF] mb-10"
        />

        <div className="space-y-8 text-sm text-[#C7CCD1] leading-relaxed">
          {info.content.map((item, idx) => (
            <div key={idx} className="space-y-2 pb-6 border-b border-argent-20/40 last:border-b-0">
              <RevealText as="h2" text={item.h} className="font-display text-xl text-[#E8ECEF]" />
              <p>{item.p}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-argent-20 flex flex-wrap gap-4 text-xs text-[#C7CCD1]/60">
          <Link to="/cgv" className="hover:text-[#D9C2A3]">
            Conditions Générales
          </Link>
          <span aria-hidden="true">·</span>
          <Link to="/mentions-legales" className="hover:text-[#D9C2A3]">
            Mentions Légales
          </Link>
          <span aria-hidden="true">·</span>
          <Link to="/confidentialite" className="hover:text-[#D9C2A3]">
            Confidentialité
          </Link>
          <span aria-hidden="true">·</span>
          <Link to="/cookies" className="hover:text-[#D9C2A3]">
            Cookies
          </Link>
        </div>
      </Reveal>
    </div>
  );
};
