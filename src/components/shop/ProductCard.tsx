import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  faArrowUpRightFromSquare,
  faStar,
  faBagShopping,
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

  const isDiscounted = produit.populaire;
  const slashedPrice = isDiscounted ? Math.round(produit.prix * 1.3) : null;
  const firstMaterial = produit.matieres ? produit.matieres.split(',')[0].trim() : 'Édition Minuit';

  return (
    <div
      className={`group bg-[#0B1528] border border-white/10 rounded-[28px] p-4 flex flex-col justify-between hover:border-white/25 transition-all duration-300 shadow-xl ${className}`}
    >
      {/* Zone Image avec boutons circulaires ↗ et ♡ */}
      <div className="relative aspect-[4/4.4] rounded-2xl overflow-hidden bg-[#070D18]">
        {/* Bouton rond diagonal ↗ en haut à gauche */}
        <Link
          to={`/produit/${produit.slug}`}
          className="absolute top-3 left-3 z-20 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/80 transition-all shadow-md"
          title="Consulter le produit"
        >
          <Icon icon={faArrowUpRightFromSquare} className="text-[10px]" />
        </Link>

        {/* Bouton rond favori ♡ en haut à droite */}
        <button
          type="button"
          onClick={toggleWishlist}
          className={`absolute top-3 right-3 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-md cursor-pointer ${
            isWishlisted
              ? 'bg-[#C1121F] text-white'
              : 'bg-black/60 backdrop-blur-md border border-white/10 text-white/80 hover:text-white hover:bg-black/80'
          }`}
          title="Ajouter aux favoris"
        >
          <Icon icon={isWishlisted ? faHeartSolid : faHeartRegular} className="text-[11px]" />
        </button>

        {/* Visuel du produit */}
        <Link to={`/produit/${produit.slug}`} className="block w-full h-full">
          {produit.images && produit.images[0] ? (
            <img
              src={produit.images[0]}
              alt={produit.nom}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          ) : (
            <DiningTableVisual45 subtleLabel={produit.nom} />
          )}
        </Link>
      </div>

      {/* Détails du produit sous l'image */}
      <div className="pt-3.5 space-y-2 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          {/* Ligne des badges capsules (highlight + outline) */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {produit.populaire ? (
              <span className="px-2 py-0.5 rounded-full bg-[#E5A93C] text-[#080E1A] font-bold text-[9px] uppercase tracking-wider">
                Bestseller
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-white/15 text-white font-bold text-[9px] uppercase tracking-wider">
                Minuit 2026
              </span>
            )}
            <span className="px-2 py-0.5 rounded-full border border-white/20 text-[#C7CCD1] text-[9px] uppercase tracking-wider line-clamp-1">
              {firstMaterial}
            </span>
          </div>

          {/* Titre du Produit */}
          <Link
            to={`/produit/${produit.slug}`}
            className="block font-sans font-bold text-sm sm:text-base text-white group-hover:text-[#D9C2A3] transition-colors leading-snug line-clamp-1"
          >
            {produit.nom}
          </Link>

          {/* Sous-titre majuscule style VibeVault */}
          <p className="text-[10px] text-[#8E95A5] uppercase tracking-wider line-clamp-1 leading-relaxed">
            {produit.accroche || produit.description_courte}
          </p>
        </div>

        {/* Ligne inférieure : Prix + Note + Bouton Ajout Panier */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="font-sans font-bold text-sm sm:text-base text-white">
              {formatPrix(produit.prix)}
            </span>
            {slashedPrice && (
              <span className="font-mono text-[10px] text-[#8E95A5] line-through">
                {formatPrix(slashedPrice)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-amber-400 font-bold text-xs">
              <Icon icon={faStar} className="text-[10px]" />
              <span>4.95</span>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                isAdded
                  ? 'bg-[#D9C2A3] text-[#080E1A]'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
              title="Ajouter au panier"
            >
              <Icon icon={isAdded ? faCheck : faBagShopping} className="text-[10px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
