import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { faBagShopping, faCheck } from '@fortawesome/free-solid-svg-icons';
import { Produit } from '../../types';
import { formatPrix } from '../../config';
import { useCart } from '../../context/CartContext';
import { Icon } from '../common/Icon';
import { DiningTableVisual45 } from '../common/DiningTableVisual45';

interface ProductCardProps {
  produit: Produit;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ produit, className = '' }) => {
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(produit.id, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1400);
  };

  const isLowStock = produit.stock !== null && produit.stock !== undefined && produit.stock > 0 && produit.stock <= 5;

  return (
    <div
      className={`group relative flex flex-col bg-[#14294A] border border-argent-20 transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-transparent ${className}`}
    >
      {/* Filet champagne qui se dessine au survol */}
      <span className="absolute inset-0 border border-[#D9C2A3] opacity-0 group-hover:opacity-100 transition-opacity duration-600 pointer-events-none z-20" />

      {/* Zone Image dominante */}
      <Link
        to={`/produit/${produit.slug}`}
        className="relative block aspect-[4/5] sm:aspect-[3/4] w-full overflow-hidden bg-[#060F1F]"
      >
        {produit.images && produit.images[0] ? (
          <img
            src={produit.images[0]}
            alt={produit.nom}
            loading="lazy"
            className="w-full h-full object-cover object-center transition-transform duration-600 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
          />
        ) : (
          <DiningTableVisual45 subtleLabel={produit.nom} />
        )}

        {/* Indicateur discret si stock bas (urgence #C1121F réservée uniquement à cet usage) */}
        {isLowStock && (
          <div className="absolute top-3 left-3 z-10 px-2.5 py-1 bg-[#060F1F]/90 border border-[#C1121F]/40 text-[#C1121F] text-[11px] uppercase tracking-wider font-mono">
            Dernières pièces ({produit.stock})
          </div>
        )}
      </Link>

      {/* Détails du produit */}
      <div className="flex flex-col flex-1 p-5 sm:p-6 justify-between bg-[#14294A]">
        <div>
          {produit.accroche && (
            <p className="text-xs text-[#C7CCD1] tracking-wide mb-1 line-clamp-1">
              {produit.accroche}
            </p>
          )}

          <h3 className="font-display text-xl sm:text-2xl text-[#E8ECEF] group-hover:text-[#D9C2A3] transition-colors duration-300">
            <Link to={`/produit/${produit.slug}`} className="focus:outline-none">
              {produit.nom}
            </Link>
          </h3>

          <div className="mt-2.5 flex items-baseline justify-between">
            <span className="font-mono text-base sm:text-lg font-medium text-[#D9C2A3] tabular-nums">
              {formatPrix(produit.prix)}
            </span>
          </div>
        </div>

        {/* Bouton d'action rapide */}
        <div className="mt-5 pt-4 border-t border-argent-20">
          <button
            type="button"
            onClick={handleAddToCart}
            className={`
              w-full py-2.5 px-3 flex items-center justify-center gap-2
              text-xs uppercase tracking-wider font-medium font-sans
              transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]
              cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D9C2A3]
              ${
                isAdded
                  ? 'bg-[#D9C2A3] text-[#060F1F]'
                  : 'bg-transparent text-[#E8ECEF] border border-[rgba(199,204,209,0.3)] hover:bg-[#E8ECEF] hover:text-[#0B1B33]'
              }
            `}
            aria-label={`Ajouter ${produit.nom} à ma sélection`}
          >
            {isAdded ? (
              <>
                <Icon icon={faCheck} className="text-xs" />
                <span>Ajouté</span>
              </>
            ) : (
              <>
                <Icon icon={faBagShopping} className="text-xs" />
                <span>Ajouter à ma sélection</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
