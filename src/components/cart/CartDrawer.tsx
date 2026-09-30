import React, { useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { faXmark, faPlus, faMinus, faTrash, faArrowRight, faBagShopping } from '@fortawesome/free-solid-svg-icons';
import { useCart } from '../../context/CartContext';
import { SEED_PRODUITS } from '../../data/seed';
import { formatPrix } from '../../config';
import { Icon } from '../common/Icon';
import { Button } from '../common/Button';

export const CartDrawer: React.FC = () => {
  const { isDrawerOpen, closeDrawer, items, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  // Bloquer le scroll du body quand le tiroir est ouvert
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  // Fermer avec la touche Échap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        closeDrawer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen, closeDrawer]);

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

  const handleCheckout = () => {
    closeDrawer();
    navigate('/commande');
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Voile sombre semi-transparent */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeDrawer}
            className="fixed inset-0 bg-[#060F1F]/80 backdrop-blur-xs cursor-pointer"
            aria-hidden="true"
          />

          {/* Panneau latéral glissant 400ms */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-md bg-[#0B1B33] border-l border-argent-20 h-full flex flex-col justify-between shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Votre sélection"
          >
            {/* En-tête du tiroir */}
            <div className="p-6 border-b border-argent-20 flex items-center justify-between bg-[#060F1F]">
              <div className="flex items-center gap-3">
                <Icon icon={faBagShopping} className="text-[#D9C2A3] text-sm" />
                <h2 className="font-display text-2xl text-[#E8ECEF]">Ma Sélection</h2>
              </div>
              <button
                type="button"
                onClick={closeDrawer}
                className="w-10 h-10 flex items-center justify-center text-[#C7CCD1] hover:text-[#E8ECEF] hover:border hover:border-argent-20 transition-all cursor-pointer"
                aria-label="Fermer le tiroir"
              >
                <Icon icon={faXmark} className="text-lg" />
              </button>
            </div>

            {/* Corps du tiroir */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {detailedItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-14 h-14 border border-argent-20 flex items-center justify-center mb-4 text-[#D9C2A3]/50">
                    <Icon icon={faBagShopping} className="text-xl" />
                  </div>
                  <p className="font-display text-2xl text-[#E8ECEF] mb-2">
                    Votre sélection est vide.
                  </p>
                  <p className="text-sm text-[#C7CCD1] max-w-xs mb-8">
                    Votre sélection est vide. Commencez par l'un de nos univers.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      closeDrawer();
                      navigate('/univers');
                    }}
                  >
                    Explorer les univers
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-argent-20/40">
                  {detailedItems.map(({ produit_id, quantite, produit }) => (
                    <div key={produit_id} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                      {/* Vignette */}
                      <div className="w-20 h-24 bg-[#14294A] border border-argent-20 shrink-0 relative overflow-hidden flex items-center justify-center">
                        {produit?.images && produit.images[0] ? (
                          <img
                            src={produit.images[0]}
                            alt={produit.nom}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 halo-champagne opacity-60 flex items-center justify-center">
                            <span className="font-display text-xs italic text-[#D9C2A3]">MM</span>
                          </div>
                        )}
                      </div>

                      {/* Infos */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <Link
                              to={`/produit/${produit?.slug || ''}`}
                              onClick={closeDrawer}
                              className="font-display text-lg text-[#E8ECEF] hover:text-[#D9C2A3] transition-colors line-clamp-1"
                            >
                              {produit?.nom || 'Pièce de collection'}
                            </Link>
                            <button
                              type="button"
                              onClick={() => removeItem(produit_id)}
                              className="text-[#C7CCD1]/50 hover:text-[#C1121F] p-1 transition-colors cursor-pointer"
                              aria-label="Retirer l'article"
                            >
                              <Icon icon={faTrash} className="text-xs" />
                            </button>
                          </div>
                          <p className="font-mono text-xs text-[#D9C2A3] mt-1 tabular-nums">
                            {formatPrix(produit?.prix)}
                          </p>
                        </div>

                        {/* Sélecteur de quantité */}
                        <div className="flex items-center gap-3 mt-3">
                          <div className="inline-flex items-center border border-argent-20 bg-[#060F1F]">
                            <button
                              type="button"
                              onClick={() => updateQuantity(produit_id, quantite - 1)}
                              className="w-7 h-7 flex items-center justify-center text-[#C7CCD1] hover:text-[#E8ECEF] cursor-pointer"
                              aria-label="Diminuer la quantité"
                            >
                              <Icon icon={faMinus} className="text-[10px]" />
                            </button>
                            <span className="w-8 text-center text-xs font-mono text-[#E8ECEF] tabular-nums">
                              {quantite}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(produit_id, quantite + 1)}
                              className="w-7 h-7 flex items-center justify-center text-[#C7CCD1] hover:text-[#E8ECEF] cursor-pointer"
                              aria-label="Augmenter la quantité"
                            >
                              <Icon icon={faPlus} className="text-[10px]" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pied du tiroir */}
            {detailedItems.length > 0 && (
              <div className="p-6 bg-[#060F1F] border-t border-argent-20 space-y-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs uppercase tracking-widest text-[#C7CCD1]">
                    Sous-total indicatif
                  </span>
                  <span className="font-mono text-xl text-[#D9C2A3] font-medium tabular-nums">
                    {formatPrix(sousTotal)}
                  </span>
                </div>

                <p className="text-[11px] text-[#C7CCD1]/70 leading-normal">
                  Frais de port et délais personnalisés calculés à la finalisation.
                </p>

                <div className="space-y-2 pt-2">
                  <button
                    type="button"
                    onClick={handleCheckout}
                    className="w-full py-3.5 px-4 bg-[#E8ECEF] text-[#0B1B33] hover:bg-transparent hover:text-[#E8ECEF] border border-[#E8ECEF] text-xs font-medium uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-400 cursor-pointer"
                  >
                    <span>Passer à la commande</span>
                    <Icon icon={faArrowRight} className="text-xs" />
                  </button>

                  <Link
                    to="/ma-selection"
                    onClick={closeDrawer}
                    className="block text-center py-2 text-xs uppercase tracking-widest text-[#C7CCD1] hover:text-[#D9C2A3] transition-colors"
                  >
                    Voir toute ma sélection en plein écran
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
