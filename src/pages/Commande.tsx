import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faShieldHalved, faSpinner, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { SEO } from '../components/common/SEO';
import { SectionTitle } from '../components/common/SectionTitle';
import { Reveal } from '../components/common/Reveal';
import { Icon } from '../components/common/Icon';
import { useCart } from '../context/CartContext';
import { SEED_PRODUITS } from '../data/seed';
import { formatPrix, NUMERO_WHATSAPP } from '../config';
import { creerCommande } from '../lib/supabase';

export const Commande: React.FC = () => {
  const { items } = useCart();
  const navigate = useNavigate();

  const [nom, setNom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [adresse, setAdresse] = useState('');
  const [creneau, setCreneau] = useState('après-midi');
  const [notes, setNotes] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Champ piège anti-spam

  // États d'erreur et de soumission
  const [erreurs, setErreurs] = useState<{ telephone?: string; adresse?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const detailedItems = useMemo(() => {
    return items.map((cartItem) => {
      const prod = SEED_PRODUITS.find((p) => p.id === cartItem.produit_id);
      return {
        ...cartItem,
        produit: prod,
      };
    });
  }, [items]);

  const sousTotal = useMemo(() => {
    return detailedItems.reduce((acc, curr) => {
      const price = curr.produit?.prix || 0;
      return acc + price * curr.quantite;
    }, 0);
  }, [detailedItems]);

  // Message WhatsApp de secours si l'enregistrement échoue
  const emergencyWhatsAppMessage = useMemo(() => {
    const lignesStr = detailedItems
      .map((item) => `${item.quantite}× ${item.produit?.nom || 'Article'}`)
      .join(', ');
    return `Bonjour Maison Minuit, je souhaite passer ma commande : ${lignesStr}. Total estimé : ${formatPrix(
      sousTotal
    )}. Nom : ${nom}. Téléphone : ${telephone}. Adresse : ${adresse}. Créneau : ${creneau}.`;
  }, [detailedItems, sousTotal, nom, telephone, adresse, creneau]);

  const validate = () => {
    const errs: { telephone?: string; adresse?: string } = {};

    // Validation téléphone : au moins 6 chiffres/caractères usuels
    const cleanPhone = telephone.replace(/[^0-9+]/g, '');
    if (!cleanPhone || cleanPhone.length < 6) {
      errs.telephone = "Merci d'indiquer un numéro de téléphone valide.";
    }

    if (!adresse.trim()) {
      errs.adresse = "Merci de préciser votre adresse de livraison.";
    }

    setErreurs(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Si le champ piège anti-spam est rempli, on feint le succès sans rien créer
    if (honeypot) {
      return;
    }

    if (!validate()) {
      return;
    }

    if (detailedItems.length === 0) {
      setErrorMessage('Votre sélection est vide.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await creerCommande({
        nom,
        telephone,
        adresse,
        creneau,
        notes,
        lignes: detailedItems.map((item) => ({
          produit_id: item.produit_id,
          quantite: item.quantite,
        })),
      });

      if (!result || !result.numero) {
        throw new Error('Impossible de générer la référence de commande.');
      }

      // Stocker les détails pour la page de confirmation
      const orderPayload = {
        numero: result.numero,
        total: result.total || sousTotal,
        nom,
        telephone,
        adresse,
        creneau,
        notes,
        lignes: detailedItems.map((item) => ({
          nom: item.produit?.nom || 'Pièce de réveillon',
          quantite: item.quantite,
          prix: item.produit?.prix || 0,
        })),
      };

      sessionStorage.setItem('derniere_commande', JSON.stringify(orderPayload));

      // La sélection est vidée dans /commande/confirmation après succès
      navigate('/commande/confirmation');
    } catch {
      setErrorMessage(
        'Une difficulté est survenue lors de l’enregistrement de votre commande. Vous pouvez nous la transmettre directement sur WhatsApp sans perdre votre sélection.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (detailedItems.length === 0) {
    return (
      <div className="py-24 text-center max-w-[1200px] mx-auto px-5">
        <h1 className="font-display text-3xl text-[#E8ECEF] mb-4">Votre sélection est vide.</h1>
        <p className="text-sm text-[#C7CCD1] mb-8">
          Commencez par l'un de nos univers pour composer votre soirée.
        </p>
        <Link
          to="/univers"
          className="inline-block py-3 px-6 bg-[#E8ECEF] text-[#0B1B33] text-xs uppercase tracking-widest font-medium"
        >
          Explorer les univers
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12 md:py-20 max-w-[1200px] mx-auto px-5 md:px-8">
      <SEO
        title="Finalisez votre commande | Maison Minuit"
        description="Dites-nous où et quand vous livrer, nous confirmons par WhatsApp. Aucun paiement en ligne."
      />

      <Reveal>
        <SectionTitle
          kicker="Réservation Hors-Ligne"
          title="Finalisez votre commande."
          subtitle="Dites-nous où et quand vous livrer, nous confirmons par WhatsApp."
        />
      </Reveal>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Colonne gauche : Formulaire */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#14294A] border border-argent-20 p-6 sm:p-8 space-y-5">
            <h3 className="font-display text-2xl text-[#E8ECEF]">
              Coordonnées de Livraison
            </h3>

            {/* Champ piège anti-spam masqué aux utilisateurs réels */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="website_hp">Ne pas remplir</label>
              <input
                id="website_hp"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>

            {/* Nom complet */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#C7CCD1] mb-2 font-mono">
                Nom complet *
              </label>
              <input
                type="text"
                required
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Ex. Éléonore de Saint-Germain"
                className="w-full bg-[#060F1F] border border-argent-20 px-4 py-3 text-sm text-[#E8ECEF] focus:outline-none focus:border-[#D9C2A3]"
              />
            </div>

            {/* Téléphone */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#C7CCD1] mb-2 font-mono">
                Téléphone (WhatsApp de préférence) *
              </label>
              <input
                type="tel"
                required
                value={telephone}
                onChange={(e) => {
                  setTelephone(e.target.value);
                  if (erreurs.telephone) setErreurs((prev) => ({ ...prev, telephone: undefined }));
                }}
                placeholder="+229 01 54 75 45 44"
                className={`w-full bg-[#060F1F] border px-4 py-3 text-sm text-[#E8ECEF] focus:outline-none focus:border-[#D9C2A3] ${
                  erreurs.telephone ? 'border-[#C1121F]' : 'border-argent-20'
                }`}
              />
              {erreurs.telephone && (
                <p className="mt-1.5 text-xs text-[#C1121F] font-sans">
                  {erreurs.telephone}
                </p>
              )}
            </div>

            {/* Adresse de livraison */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#C7CCD1] mb-2 font-mono">
                Adresse de livraison *
              </label>
              <textarea
                required
                rows={3}
                value={adresse}
                onChange={(e) => {
                  setAdresse(e.target.value);
                  if (erreurs.adresse) setErreurs((prev) => ({ ...prev, adresse: undefined }));
                }}
                placeholder="Rue, quartier, résidence, indications d'accès pour le livreur..."
                className={`w-full bg-[#060F1F] border px-4 py-3 text-sm text-[#E8ECEF] focus:outline-none focus:border-[#D9C2A3] ${
                  erreurs.adresse ? 'border-[#C1121F]' : 'border-argent-20'
                }`}
              />
              {erreurs.adresse && (
                <p className="mt-1.5 text-xs text-[#C1121F] font-sans">
                  {erreurs.adresse}
                </p>
              )}
            </div>

            {/* Créneau souhaité */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#C7CCD1] mb-2 font-mono">
                Créneau souhaité *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'matin', label: 'Matin' },
                  { id: 'après-midi', label: 'Après-midi' },
                  { id: 'soirée', label: 'Soirée' },
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCreneau(c.id)}
                    className={`py-3 px-2 text-xs uppercase tracking-wider border text-center transition-all cursor-pointer ${
                      creneau === c.id
                        ? 'bg-[#E8ECEF] text-[#0B1B33] border-[#E8ECEF] font-medium'
                        : 'bg-[#060F1F] text-[#C7CCD1] border-argent-20 hover:border-argent-400'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Un mot pour nous ? */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#C7CCD1] mb-2 font-mono">
                Un mot pour nous ? (facultatif)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Remise en main propre, emballage cadeau, remarque..."
                className="w-full bg-[#060F1F] border border-argent-20 px-4 py-3 text-sm text-[#E8ECEF] focus:outline-none focus:border-[#D9C2A3]"
              />
            </div>
          </div>

          {/* Message d'erreur et secours WhatsApp */}
          {errorMessage && (
            <div className="p-5 bg-[#060F1F] border border-[#C1121F] space-y-4">
              <p className="text-xs text-[#E8ECEF] leading-relaxed">
                {errorMessage}
              </p>
              <a
                href={`https://wa.me/${NUMERO_WHATSAPP.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  emergencyWhatsAppMessage
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#25D366] text-[#060F1F] text-xs uppercase tracking-wider font-semibold"
              >
                <Icon icon={faWhatsapp} className="text-sm" />
                <span>Envoyer ma commande directement sur WhatsApp</span>
              </a>
            </div>
          )}
        </div>

        {/* Colonne droite : Récapitulatif fixe */}
        <div className="lg:col-span-5">
          <div className="sticky top-28 bg-[#14294A] border border-argent-20 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-argent-20">
              <h3 className="font-display text-2xl text-[#E8ECEF]">
                Récapitulatif
              </h3>
              <Link
                to="/ma-selection"
                className="text-xs uppercase tracking-widest text-[#D9C2A3] hover:underline"
              >
                Modifier
              </Link>
            </div>

            <div className="divide-y divide-argent-20/40 max-h-60 overflow-y-auto pr-2">
              {detailedItems.map(({ produit_id, quantite, produit }) => (
                <div key={produit_id} className="py-3 flex justify-between items-center text-xs">
                  <div>
                    <span className="text-[#E8ECEF] font-medium block">
                      {produit?.nom || 'Pièce'}
                    </span>
                    <span className="text-[#C7CCD1]/60">Quantité : {quantite}</span>
                  </div>
                  <span className="font-mono text-[#D9C2A3] tabular-nums">
                    {formatPrix((produit?.prix || 0) * quantite)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-argent-20 space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-xs uppercase tracking-widest text-[#E8ECEF] font-mono">
                  Total
                </span>
                <span className="font-mono text-2xl text-[#D9C2A3] font-medium tabular-nums">
                  {formatPrix(sousTotal)}
                </span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 bg-[#E8ECEF] text-[#0B1B33] hover:bg-transparent hover:text-[#E8ECEF] border border-[#E8ECEF] text-xs font-medium uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all duration-400 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Icon icon={faSpinner} spin className="text-xs" />
                    <span>Envoi en cours…</span>
                  </>
                ) : (
                  <span>Envoyer ma commande</span>
                )}
              </button>

              <p className="text-[11px] text-[#C7CCD1] text-center leading-relaxed">
                Aucun paiement en ligne. Nous confirmons votre commande et le règlement à la livraison sur WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
