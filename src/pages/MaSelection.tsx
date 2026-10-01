import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { faPlus, faMinus, faTrash, faArrowRight, faBagShopping } from '@fortawesome/free-solid-svg-icons';
import { SEO } from '../components/common/SEO';
import { Reveal, RevealText, Stagger, StaggerItem } from '../motion';
import { SectionTitle } from '../components/common/SectionTitle';
import { Button } from '../components/common/Button';
import { Icon } from '../components/common/Icon';
import { useCart } from '../context/CartContext';
import { SEED_PRODUITS } from '../data/seed';
import { formatPrix } from '../config';

export const MaSelection: React.FC = () => {
  const { items, updateQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();

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

  return (
    <div className="py-16 md:py-24 max-w-[1200px] mx-auto px-5 md:px-8">
      <SEO
        title="Ma Sélection de Réveillon"
        description="Consultez l'ensemble des créations réunies pour composer votre ambiance du 31 décembre 2026."
      />

      <Reveal>
        <SectionTitle
          kicker="Préparatifs du Réveillon"
          title="Ma Sélection"
          subtitle="Les pièces retenues pour embellir votre passage vers la nouvelle année."
        />
      </Reveal>

      {detailedItems.length === 0 ? (
        <div className="py-20 text-center max-w-md mx-auto">
          <div className="w-16 h-16 border border-argent-20 flex items-center justify-center mx-auto mb-6 text-[#D9C2A3]">
            <Icon icon={faBagShopping} className="text-xl" />
          </div>
          <RevealText
            as="h2"
            text="Votre sélection est vide."
            className="font-display text-2xl sm:text-3xl text-[#E8ECEF] mb-3"
          />
          <p className="text-sm text-[#C7CCD1] leading-relaxed mb-8">
            Votre sélection est vide. Commencez par l'un de nos univers.
          </p>
          <Button variant="solid" onClick={() => navigate('/univers')}>
            Explorer les univers
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Liste des pièces */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-argent-20">
              <span className="text-xs uppercase tracking-widest text-[#C7CCD1] font-mono">
                {detailedItems.length} création(s) sélectionnée(s)
              </span>
              <button
                type="button"
                onClick={clearCart}
                className="text-xs uppercase tracking-widest text-[#C7CCD1]/60 hover:text-[#C1121F] transition-colors cursor-pointer"
              >
                Vider la sélection
              </button>
            </div>

            <Stagger className="divide-y divide-argent-20/40">
              {detailedItems.map(({ produit_id, quantite, produit }) => (
                <StaggerItem key={produit_id}>
                  <div className="py-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
                    <div className="flex gap-4 items-center">
                      <div className="w-20 h-24 bg-[#14294A] border border-argent-20 shrink-0 relative overflow-hidden flex items-center justify-center">
                        {produit?.images && produit.images[0] ? (
                          <img
                            src={produit.images[0]}
                            alt={produit.nom}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 halo-champagne opacity-60 flex items-center justify-center">
                            <span className="font-display text-xs text-[#D9C2A3]">MM</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <Link
                          to={`/produit/${produit?.slug || ''}`}
                          className="font-display text-xl text-[#E8ECEF] hover:text-[#D9C2A3] transition-colors"
                        >
                          {produit?.nom || 'Pièce artisanale'}
                        </Link>
                        <p className="font-mono text-xs text-[#D9C2A3] mt-1 tabular-nums">
                          {formatPrix(produit?.prix)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                      {/* Contrôleur quantité */}
                      <div className="flex items-center border border-argent-20 bg-[#060F1F]">
                        <button
                          type="button"
                          onClick={() => updateQuantity(produit_id, quantite - 1)}
                          className="w-8 h-8 flex items-center justify-center text-[#C7CCD1] hover:text-[#E8ECEF] cursor-pointer"
                          aria-label="Diminuer la quantité"
                        >
                          <Icon icon={faMinus} className="text-xs" />
                        </button>
                        <span className="w-10 text-center font-mono text-xs text-[#E8ECEF] tabular-nums">
                          {quantite}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(produit_id, quantite + 1)}
                          className="w-8 h-8 flex items-center justify-center text-[#C7CCD1] hover:text-[#E8ECEF] cursor-pointer"
                          aria-label="Augmenter la quantité"
                        >
                          <Icon icon={faPlus} className="text-xs" />
                        </button>
                      </div>

                      <span className="font-mono text-sm text-[#E8ECEF] min-w-[80px] text-right tabular-nums">
                        {formatPrix((produit?.prix || 0) * quantite)}
                      </span>

                      <button
                        type="button"
                        onClick={() => removeItem(produit_id)}
                        className="text-[#C7CCD1]/40 hover:text-[#C1121F] p-2 transition-colors cursor-pointer"
                        aria-label="Supprimer cet article"
                      >
                        <Icon icon={faTrash} className="text-xs" />
                      </button>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          {/* Récapitulatif commande */}
          <div className="lg:col-span-4">
            <Reveal delay={0.15}>
              <div className="p-8 bg-[#14294A] border border-argent-20 space-y-6">
                <RevealText as="h3" text="Récapitulatif" className="font-display text-2xl text-[#E8ECEF]" />

              <div className="space-y-3 text-xs text-[#C7CCD1] pb-6 border-b border-argent-20/60">
                <div className="flex justify-between">
                  <span>Sous-total articles</span>
                  <span className="font-mono text-[#E8ECEF] tabular-nums">{formatPrix(sousTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Livraison estimée</span>
                  <span className="text-[#D9C2A3]">Précisée à l’étape suivante</span>
                </div>
              </div>

              <div className="flex justify-between items-baseline pt-2">
                <span className="text-xs uppercase tracking-widest text-[#E8ECEF] font-mono">
                  Total estimé
                </span>
                <span className="font-mono text-2xl text-[#D9C2A3] font-medium tabular-nums">
                  {formatPrix(sousTotal)}
                </span>
              </div>

              <button
                type="button"
                onClick={() => navigate('/commande')}
                className="w-full py-4 px-6 bg-[#E8ECEF] text-[#0B1B33] hover:bg-transparent hover:text-[#E8ECEF] border border-[#E8ECEF] text-xs uppercase tracking-wider font-medium flex items-center justify-center gap-2 transition-all duration-400 cursor-pointer"
              >
                <span>Passer à la commande</span>
                <Icon icon={faArrowRight} className="text-xs" />
              </button>

              <p className="text-[11px] text-[#C7CCD1]/60 text-center leading-relaxed">
                Paiement sécurisé et vérification manuelle de chaque colis avant expédition pour le 31 décembre.
              </p>
            </div>
            </Reveal>
          </div>
        </div>
      )}
    </div>
  );
};
