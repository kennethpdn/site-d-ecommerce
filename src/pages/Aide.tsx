import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { SEO } from '../components/common/SEO';
import { SectionTitle } from '../components/common/SectionTitle';
import { Reveal, RevealText, Stagger, StaggerItem } from '../motion';
import { Button } from '../components/common/Button';
import { Icon } from '../components/common/Icon';
import {
  DELAI_LIVRAISON,
  MODE_PAIEMENT,
  RETOURS,
  ZONES,
  NUMERO_WHATSAPP,
} from '../config';

interface FAQItem {
  id: string;
  question: string;
  reponse: string;
  visible: boolean;
}

export const Aide: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('paiement-ligne');

  // FAQ strictement conditionnée : les réponses factuelles ne s'affichent que si renseignées
  const faqs: FAQItem[] = [
    {
      id: 'paiement-ligne',
      question: 'Comment commander sans paiement en ligne ?',
      reponse:
        'Composez votre sélection, remplissez le formulaire, puis envoyez-nous le récapitulatif sur WhatsApp. Nous confirmons la commande avec vous.',
      visible: true,
    },
    {
      id: 'livraison',
      question: 'Quand serai-je livré ?',
      reponse: DELAI_LIVRAISON,
      visible: Boolean(DELAI_LIVRAISON),
    },
    {
      id: 'paiement',
      question: 'Comment payer ?',
      reponse: MODE_PAIEMENT,
      visible: Boolean(MODE_PAIEMENT),
    },
    {
      id: 'retours',
      question: 'Puis-je retourner un article ?',
      reponse: RETOURS,
      visible: Boolean(RETOURS),
    },
    {
      id: 'zones',
      question: 'Où livrez-vous ?',
      reponse: ZONES,
      visible: Boolean(ZONES),
    },
    {
      id: 'contact',
      question: 'Comment vous joindre ?',
      reponse: NUMERO_WHATSAPP
        ? `Notre conciergerie est joignable directement par WhatsApp au ${NUMERO_WHATSAPP} ou par notre formulaire de contact.`
        : 'Notre conciergerie vous répond par e-mail ou via le formulaire de contact pour toute demande relative à vos décors de réveillon.',
      visible: true,
    },
  ].filter((f) => f.visible);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="py-16 md:py-24 max-w-[900px] mx-auto px-5 md:px-8">
      <SEO
        title="Livraison, retours et questions fréquentes | Maison Minuit"
        description="Foire aux questions concernant la commande sans paiement en ligne, la livraison avant le 31 décembre et nos engagements."
      />

      <Reveal>
        <SectionTitle
          kicker="Assistance Cérémonielle"
          title="Foire Aux Questions"
          subtitle="Toutes les réponses pour préparer votre soirée du 31 décembre en toute sérénité."
        />
      </Reveal>

      {/* Accordéon FAQ */}
      <Stagger className="divide-y divide-argent-20/60 border-y border-argent-20/60 mb-16">
        {faqs.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <StaggerItem key={faq.id}>
              <div className="py-5">
                <button
                  type="button"
                  onClick={() => toggle(faq.id)}
                  className="w-full flex items-center justify-between text-left group cursor-pointer focus:outline-none"
                >
                  <span className="font-display text-xl sm:text-2xl text-[#E8ECEF] group-hover:text-[#D9C2A3] transition-colors pr-4">
                    {faq.question}
                  </span>
                  <Icon
                    icon={faChevronDown}
                    className={`text-xs text-[#D9C2A3] transition-transform duration-300 shrink-0 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="mt-4 text-sm text-[#C7CCD1] leading-relaxed pr-8">
                    {faq.reponse}
                  </div>
                )}
              </div>
            </StaggerItem>
          );
        })}
      </Stagger>

      <Reveal delay={0.15}>
        <div className="text-center p-8 bg-[#060F1F] border border-argent-20">
          <RevealText
            as="h3"
            text="Une question particulière ?"
            className="font-display text-2xl text-[#E8ECEF] mb-3"
          />
          <p className="text-sm text-[#C7CCD1] mb-6">
            Notre équipe de conciergerie vous répond pour ajuster vos préparatifs.
          </p>
          <Link to="/contact">
            <Button variant="solid" size="md">
              Écrire à la conciergerie
            </Button>
          </Link>
        </div>
      </Reveal>
    </div>
  );
};
