import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faCheck, faCopy, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { SEO } from '../components/common/SEO';
import { Reveal, RevealText } from '../motion';
import { Icon } from '../components/common/Icon';
import { formatPrix, NUMERO_WHATSAPP } from '../config';
import { useCart } from '../context/CartContext';

export const CommandeConfirmation: React.FC = () => {
  const { clearCart } = useCart();
  const navigate = useNavigate();
  const [commande, setCommande] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('derniere_commande');
      if (stored) {
        const parsed = JSON.parse(stored);
        setCommande(parsed);
        // Vider la sélection après succès
        clearCart();
      } else {
        // Redirection vers l'accueil si aucun contexte de commande
        navigate('/', { replace: true });
      }
    } catch {
      navigate('/', { replace: true });
    }
  }, [clearCart, navigate]);

  if (!commande) {
    return null;
  }

  // Formatage des lignes et quantités pour le message WhatsApp
  const lignesText = commande.lignes
    ? commande.lignes.map((l: any) => `${l.quantite}× ${l.nom}`).join(', ')
    : '';

  const totalFormatte = formatPrix(commande.total);

  // Message imposé exact :
  // « Bonjour Maison Minuit, je souhaite confirmer ma commande {numero} : {lignes et quantités}. Total : {total}. Nom : {nom}. Téléphone : {téléphone}. Adresse : {adresse}. Créneau : {créneau}. »
  const messageWhatsApp = `Bonjour Maison Minuit, je souhaite confirmer ma commande ${commande.numero} : ${lignesText}. Total : ${totalFormatte}. Nom : ${commande.nom}. Téléphone : ${commande.telephone}. Adresse : ${commande.adresse}. Créneau : ${commande.creneau || 'Non spécifié'}.`;

  const cleanWhatsappNumber = NUMERO_WHATSAPP.replace(/[^0-9]/g, '') || '2290154754544';
  const whatsappUrl = `https://wa.me/${cleanWhatsappNumber}?text=${encodeURIComponent(messageWhatsApp)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(messageWhatsApp).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="py-16 md:py-28 max-w-[800px] mx-auto px-5 md:px-8 text-center">
      <SEO
        title="Merci. Votre commande est enregistrée | Maison Minuit"
        description="Dernière étape : confirmez votre créneau et le règlement à la livraison avec Maison Minuit sur WhatsApp."
      />

      <Reveal>
        <div className="w-16 h-16 border border-[#D9C2A3] flex items-center justify-center mx-auto mb-6 text-[#D9C2A3]">
          <Icon icon={faCheck} className="text-xl" />
        </div>

        <span className="text-xs uppercase tracking-[0.25em] text-[#D9C2A3] font-mono block mb-2">
          Réservation validée
        </span>

        <RevealText
          as="h1"
          text="Merci. Votre commande est enregistrée."
          className="title-fluid-section font-display text-[#E8ECEF] mb-4"
        />

        <p className="font-mono text-base text-[#D9C2A3] mb-6 tracking-wider">
          Référence : {commande.numero}
        </p>

        <p className="subtitle-editorial text-[#C7CCD1] max-w-xl mx-auto mb-10 leading-relaxed text-sm sm:text-base">
          Dernière étape : envoyez-nous le récapitulatif sur WhatsApp pour que nous confirmions votre créneau et votre règlement à la livraison.
        </p>

        {/* Récapitulatif visuel */}
        <div className="bg-[#14294A] border border-argent-20 p-6 sm:p-8 text-left mb-10 space-y-4 max-w-lg mx-auto">
          <div className="flex justify-between items-center pb-3 border-b border-argent-20/60 text-xs">
            <span className="text-[#C7CCD1] uppercase tracking-wider">Destinataire</span>
            <span className="text-[#E8ECEF] font-medium">{commande.nom}</span>
          </div>

          <div className="flex justify-between items-center pb-3 border-b border-argent-20/60 text-xs">
            <span className="text-[#C7CCD1] uppercase tracking-wider">Téléphone</span>
            <span className="text-[#E8ECEF] font-mono">{commande.telephone}</span>
          </div>

          <div className="flex justify-between items-center pb-3 border-b border-argent-20/60 text-xs">
            <span className="text-[#C7CCD1] uppercase tracking-wider">Adresse</span>
            <span className="text-[#E8ECEF] text-right max-w-[240px] truncate">{commande.adresse}</span>
          </div>

          <div className="flex justify-between items-center pb-3 border-b border-argent-20/60 text-xs">
            <span className="text-[#C7CCD1] uppercase tracking-wider">Créneau</span>
            <span className="text-[#D9C2A3] uppercase">{commande.creneau || 'Non spécifié'}</span>
          </div>

          {commande.lignes && commande.lignes.length > 0 && (
            <div className="py-2 space-y-1.5 text-xs text-[#C7CCD1]">
              <span className="block text-[11px] uppercase tracking-wider text-[#C7CCD1]/60 mb-1">
                Articles :
              </span>
              {commande.lignes.map((l: any, i: number) => (
                <div key={i} className="flex justify-between">
                  <span>{l.quantite}× {l.nom}</span>
                  <span className="font-mono text-[#E8ECEF] tabular-nums">{formatPrix(l.prix * l.quantite)}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between items-baseline pt-3 border-t border-argent-20 text-sm">
            <span className="font-medium text-[#E8ECEF]">Total à régler à la livraison</span>
            <span className="font-mono text-xl text-[#D9C2A3] font-bold tabular-nums">
              {totalFormatte}
            </span>
          </div>
        </div>

        {/* Boutons d'action : Envoyer sur WhatsApp + Copier le récapitulatif */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex-1 py-4 px-6 bg-[#25D366] text-[#060F1F] text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2.5 transition-all hover:bg-[#20b859] cursor-pointer"
          >
            <Icon icon={faWhatsapp} className="text-base" />
            <span>Envoyer sur WhatsApp</span>
          </a>

          <button
            type="button"
            onClick={handleCopy}
            className="w-full sm:w-auto py-4 px-6 bg-[#E8ECEF] text-[#0B1B33] hover:bg-transparent hover:text-[#E8ECEF] border border-[#E8ECEF] text-xs uppercase tracking-wider font-medium flex items-center justify-center gap-2 transition-all duration-400 cursor-pointer"
          >
            <Icon icon={copied ? faCheck : faCopy} className="text-xs" />
            <span>{copied ? 'Récapitulatif copié' : 'Copier le récapitulatif'}</span>
          </button>
        </div>

        <div className="mt-12 pt-8 border-t border-argent-20/60">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#C7CCD1] hover:text-[#D9C2A3] transition-colors"
          >
            <span>Retour à l'accueil de la maison</span>
            <Icon icon={faArrowRight} className="text-xs" />
          </Link>
        </div>
      </Reveal>
    </div>
  );
};
