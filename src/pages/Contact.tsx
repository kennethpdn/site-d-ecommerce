import React, { useState } from 'react';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faCheck } from '@fortawesome/free-solid-svg-icons';
import { SEO } from '../components/common/SEO';
import { SectionTitle } from '../components/common/SectionTitle';
import { Reveal, RevealText } from '../motion';
import { Button } from '../components/common/Button';
import { Icon } from '../components/common/Icon';
import { NUMERO_WHATSAPP } from '../config';

export const Contact: React.FC = () => {
  const [sent, setSent] = useState(false);
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [sujet, setSujet] = useState('');
  const [message, setMessage] = useState('');

  const contactEmail = (import.meta.env.VITE_CONTACT_EMAIL as string | undefined)?.trim() || 'conciergerie@maisonminuit.com';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setNom('');
      setEmail('');
      setSujet('');
      setMessage('');
    }, 4000);
  };

  const cleanWhatsappNumber = NUMERO_WHATSAPP.replace(/[^0-9]/g, '') || '2290154754544';

  return (
    <div className="py-16 md:py-24 max-w-[1000px] mx-auto px-5 md:px-8">
      <SEO
        title="Contact & Conciergerie | Maison Minuit"
        description="Prenez contact avec la maison pour vos projets d’ambiance, commandes de réveillon ou questions d’acheminement."
      />

      <Reveal>
        <SectionTitle
          kicker="Liaison Dédiée"
          title="Conciergerie de Minuit"
          subtitle="Nous sommes à votre écoute pour accompagner chaque détail de vos réjouissances du 31 décembre 2026."
        />
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
        {/* Colonne gauche : Canaux directs */}
        <Reveal delay={0.1} className="lg:col-span-5 space-y-6">
          <div className="p-8 bg-[#14294A] border border-argent-20 space-y-6">
            <RevealText as="h3" text="Nos Canaux Privilégiés" className="font-display text-2xl text-[#E8ECEF]" />

            {/* WhatsApp */}
            <div className="pt-2">
              <span className="block text-xs uppercase tracking-widest text-[#D9C2A3] font-mono mb-2">
                WhatsApp Direct
              </span>
              <a
                href={`https://wa.me/${cleanWhatsappNumber}?text=${encodeURIComponent(
                  'Bonjour Maison Minuit, je souhaite un renseignement pour mes décors de réveillon.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-[#E8ECEF] hover:text-[#D9C2A3] transition-colors"
              >
                <div className="w-8 h-8 flex items-center justify-center border border-argent-20 text-[#25D366]">
                  <Icon icon={faWhatsapp} className="text-sm" />
                </div>
                <span>+{cleanWhatsappNumber}</span>
              </a>
            </div>

            {/* Email */}
            <div>
              <span className="block text-xs uppercase tracking-widest text-[#D9C2A3] font-mono mb-2">
                Courrier Électronique
              </span>
              <a
                href={`mailto:${contactEmail}`}
                className="flex items-center gap-3 text-sm text-[#E8ECEF] hover:text-[#D9C2A3] transition-colors"
              >
                <div className="w-8 h-8 flex items-center justify-center border border-argent-20 text-[#D9C2A3]">
                  <Icon icon={faEnvelope} className="text-xs" />
                </div>
                <span className="truncate">{contactEmail}</span>
              </a>
            </div>

            <div className="pt-4 border-t border-argent-20/60 text-xs text-[#C7CCD1] leading-relaxed">
              <p>
                Accueil et conseil personnalisé pour l'agencement de vos tables et la mise en lumière de vos pièces de réception.
              </p>
            </div>
          </div>
        </Reveal>

        {/* Colonne droite : Formulaire simple */}
        <Reveal delay={0.2} className="lg:col-span-7">
          <div className="p-8 bg-[#14294A] border border-argent-20">
            {sent ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-12 h-12 border border-[#D9C2A3] flex items-center justify-center mx-auto text-[#D9C2A3] mb-4">
                  <Icon icon={faCheck} className="text-lg" />
                </div>
                <RevealText as="h3" text="Message transmis" className="font-display text-2xl text-[#E8ECEF]" />
                <p className="text-sm text-[#C7CCD1]">
                  Notre conciergerie a bien reçu votre demande et vous répondra sous quelques heures.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <RevealText as="h3" text="Transmettre une demande" className="font-display text-2xl text-[#E8ECEF] mb-6" />

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#C7CCD1] mb-2 font-mono">
                    Votre nom complet *
                  </label>
                  <input
                    type="text"
                    required
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    className="w-full bg-[#060F1F] border border-argent-20 px-4 py-3 text-sm text-[#E8ECEF] focus:outline-none focus:border-[#D9C2A3]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#C7CCD1] mb-2 font-mono">
                    Adresse e-mail *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#060F1F] border border-argent-20 px-4 py-3 text-sm text-[#E8ECEF] focus:outline-none focus:border-[#D9C2A3]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#C7CCD1] mb-2 font-mono">
                    Objet
                  </label>
                  <input
                    type="text"
                    value={sujet}
                    onChange={(e) => setSujet(e.target.value)}
                    placeholder="Composition sur-mesure, question d'acheminement..."
                    className="w-full bg-[#060F1F] border border-argent-20 px-4 py-3 text-sm text-[#E8ECEF] focus:outline-none focus:border-[#D9C2A3]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#C7CCD1] mb-2 font-mono">
                    Votre message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-[#060F1F] border border-argent-20 px-4 py-3 text-sm text-[#E8ECEF] focus:outline-none focus:border-[#D9C2A3]"
                  />
                </div>

                <div className="pt-2">
                  <Button type="submit" variant="solid" className="w-full">
                    Envoyer le message
                  </Button>
                </div>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </div>
  );
};
