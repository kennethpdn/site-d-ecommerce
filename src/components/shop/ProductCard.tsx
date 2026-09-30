import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  faStar,
  faCartShopping,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
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
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(produit.id, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1600);
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div
      className={`group bg-[#F8F9FA] text-[#111827] rounded-[28px] sm:rounded-[32px] p-5 sm:p-6 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 shadow-sm relative min-h-[350px] border border-black/[0.04] ${className}`}
    >
      {/* Haut : Bouton favori bleu royal dans le coin supérieur gauche */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={toggleWishlist}
          className="w-8 h-8 flex items-center justify-center text-[#0055D4] hover:scale-110 transition-transform cursor-pointer -ml-1 -mt-1"
          title="Ajouter aux favoris"
          aria-label="Ajouter aux favoris"
        >
          <Icon icon={isWishlisted ? faHeartSolid : faHeartRegular} className="text-base" />
        </button>
      </div>

      {/* Visuel produit centré sur fond blanc épuré */}
      <Link
        to={`/produit/${produit.slug}`}
        className="h-44 sm:h-52 w-full flex items-center justify-center my-2 overflow-hidden block"
      >
        {produit.images && produit.images[0] ? (
          <img
            src={produit.images[0]}
            alt={produit.nom}
            loading="lazy"
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <DiningTableVisual45 subtleLabel={produit.nom} />
          </div>
        )}
      </Link>

      {/* Titre, note étoilée bleue et prix + panier circulaire noir */}
      <div className="space-y-1.5 pt-2">
        <Link
          to={`/produit/${produit.slug}`}
          className="font-sans font-semibold text-xs sm:text-[13px] text-[#111827] hover:text-[#0055D4] transition-colors leading-snug line-clamp-2 block"
        >
          {produit.nom} {produit.accroche ? `— ${produit.accroche}` : ''}
        </Link>

        {/* Ligne d'avis en bleu royal style mockup */}
        <div className="flex items-center gap-1 text-xs text-[#0055D4] font-medium pt-0.5">
          <Icon icon={faStar} className="text-[11px] text-[#0055D4]" />
          <span>5.0</span>
          <span className="text-[#0055D4]/80">(14 reviews)</span>
        </div>

        {/* Ligne inférieure : Prix et bouton rond noir panier */}
        <div className="flex items-center justify-between pt-2">
          <span className="font-sans font-bold text-base sm:text-lg text-[#111827]">
            {formatPrix(produit.prix)}
          </span>

          <button
            type="button"
            onClick={handleAddToCart}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-colors shadow-md cursor-pointer shrink-0 ${
              isAdded ? 'bg-[#0055D4] text-white' : 'bg-[#111827] hover:bg-[#0055D4] text-white'
            }`}
            title="Ajouter au panier"
            aria-label="Ajouter au panier"
          >
            <Icon icon={isAdded ? faCheck : faCartShopping} className="text-xs" />
          </button>
        </div>
      </div>
    </div>
  );
};
