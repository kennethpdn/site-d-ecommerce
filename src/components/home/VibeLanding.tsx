import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  faArrowRight,
  faArrowUpRightFromSquare,
  faChevronLeft,
  faChevronRight,
  faStar,
  faPlus,
  faMagnifyingGlass,
  faBagShopping,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { Icon } from '../common/Icon';
import { useCart } from '../../context/CartContext';
import { SEED_PRODUITS, SEED_UNIVERS } from '../../data/seed';
import { formatPrix } from '../../config';

// Rosette géométrique dorée iconique de la mise en page
export const RosetteIcon: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 28,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block ${className}`}
    aria-hidden="true"
  >
    <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
    <path
      d="M24 4 L26 18 L38 10 L30 22 L44 24 L30 26 L38 38 L26 30 L24 44 L22 30 L10 38 L18 26 L4 24 L18 22 L10 10 L22 18 Z"
      fill="currentColor"
      opacity="0.9"
    />
    <circle cx="24" cy="24" r="5" fill="#0B1B33" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

// Rayonnement solaire / éventail décoratif du titre
export const SunburstIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    width="48"
    height="32"
    viewBox="0 0 64 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block ${className}`}
    aria-hidden="true"
  >
    <path d="M4 36 L32 10 L60 36" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
    <path d="M12 36 L32 16 L52 36" stroke="currentColor" strokeWidth="1.5" opacity="0.8" />
    <path d="M20 36 L32 22 L44 36" stroke="currentColor" strokeWidth="1.5" />
    <line x1="32" y1="4" x2="32" y2="22" stroke="currentColor" strokeWidth="2" />
    <line x1="16" y1="12" x2="28" y2="24" stroke="currentColor" strokeWidth="1.5" />
    <line x1="48" y1="12" x2="36" y2="24" stroke="currentColor" strokeWidth="1.5" />
    <line x1="6" y1="24" x2="24" y2="28" stroke="currentColor" strokeWidth="1.5" />
    <line x1="58" y1="24" x2="40" y2="28" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

export const VibeLanding: React.FC = () => {
  const { addItem, totalCount, toggleDrawer } = useCart();
  const navigate = useNavigate();

  // Catégorie active pour la section "Collection de Réveillon By Univers"
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [addedItemNotice, setAddedItemNotice] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState<number>(1);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleQuickAdd = (produitId: string, nom: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(produitId);
    setAddedItemNotice(nom);
    setTimeout(() => setAddedItemNotice(null), 2500);
  };

  // Filtrage des produits pour la grille
  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') {
      return SEED_PRODUITS.slice(0, 8);
    }
    return SEED_PRODUITS.filter((p) => p.univers_id === activeCategory).slice(0, 8);
  }, [activeCategory]);

  return (
    <div className="bg-[#080E1A] text-[#E8ECEF] min-h-screen font-sans selection:bg-[#D9C2A3] selection:text-[#080E1A] pb-24">
      {/* Toast d'ajout rapide au panier */}
      {addedItemNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#14294A] border border-[#D9C2A3] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-in text-xs font-medium">
          <span className="w-5 h-5 rounded-full bg-[#D9C2A3] text-[#080E1A] flex items-center justify-center text-[10px]">
            <Icon icon={faCheck} />
          </span>
          <span>« {addedItemNotice} » ajouté à votre sélection.</span>
          <button
            type="button"
            onClick={toggleDrawer}
            className="underline text-[#D9C2A3] hover:text-white ml-2 cursor-pointer"
          >
            Voir
          </button>
        </div>
      )}

      {/* ========================================================= */}
      {/* HEADER FLOTTANT STYLE VIBE-VAULT (arrondi et micro-bordures) */}
      {/* ========================================================= */}
      <header className="sticky top-4 z-40 max-w-[1240px] mx-auto px-4 sm:px-6 mb-4">
        <div className="bg-[#0B1528]/85 backdrop-blur-xl border border-white/10 rounded-full px-5 py-3 flex items-center justify-between shadow-2xl">
          {/* Logo & Emblème */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <RosetteIcon size={24} className="text-[#D9C2A3] group-hover:rotate-45 transition-transform duration-500" />
            <span className="font-sans font-extrabold text-sm sm:text-base tracking-[0.15em] uppercase text-white">
              MAISON MINUIT
            </span>
          </Link>

          {/* Navigation centrale */}
          <nav className="hidden md:flex items-center gap-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C7CCD1]">
            <Link to="/" className="text-white hover:text-[#D9C2A3] transition-colors">
              Accueil
            </Link>
            <Link to="/univers" className="hover:text-[#D9C2A3] transition-colors">
              Univers
            </Link>
            <Link to="/boutique" className="hover:text-[#D9C2A3] transition-colors">
              Boutique
            </Link>
            <Link to="/inspirations" className="hover:text-[#D9C2A3] transition-colors">
              Inspirations
            </Link>
            <Link to="/atelier" className="hover:text-[#D9C2A3] transition-colors">
              L'Atelier
            </Link>
          </nav>

          {/* Actions : Recherche + Sélection + Bouton Commander */}
          <div className="flex items-center gap-2.5">
            <Link
              to="/boutique"
              className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
              title="Explorer le catalogue"
            >
              <Icon icon={faMagnifyingGlass} className="text-xs" />
            </Link>

            <button
              type="button"
              onClick={toggleDrawer}
              className="h-9 px-3.5 rounded-full bg-white/5 border border-white/10 flex items-center gap-2 text-xs font-semibold text-white hover:border-[#D9C2A3] transition-all cursor-pointer"
            >
              <Icon icon={faBagShopping} className="text-xs text-[#D9C2A3]" />
              <span className="font-mono text-xs">{totalCount}</span>
            </button>

            <Link
              to="/commande"
              className="hidden sm:inline-flex items-center gap-1.5 h-9 px-4 rounded-full bg-[#E8ECEF] text-[#080E1A] hover:bg-[#D9C2A3] font-bold text-xs uppercase tracking-wider transition-colors"
            >
              <span>RÉSERVER</span>
              <Icon icon={faArrowUpRightFromSquare} className="text-[10px]" />
            </Link>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* SECTION 1 : HERO BENTO GRID (Copie exacte de l'architecture) */}
      {/* ========================================================= */}
      <section className="max-w-[1240px] mx-auto px-4 sm:px-6 pt-2 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* --- CARTE GAUCHE PRINCIPALE (Hero Atmosphere) --- */}
          <div className="lg:col-span-8 bg-[#0D182E] border border-white/10 rounded-3xl p-6 sm:p-10 relative overflow-hidden flex flex-col justify-between min-h-[460px] sm:min-h-[520px]">
            {/* Image de fond atmosphérique du dîner de réveillon avec bokeh champagne */}
            <div
              className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-45 mix-blend-screen scale-105"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 65% 35%, rgba(217, 194, 163, 0.4) 0%, rgba(13, 24, 46, 0.95) 75%), url("https://images.unsplash.com/photo-1543258103-a62bdc069871?auto=format&fit=crop&w=1400&q=80")',
              }}
            />

            {/* Gradient assombrissant sur le texte */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#080E1A] via-[#080E1A]/40 to-transparent" />

            {/* Haut de carte : Badge pill décoratif */}
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#D9C2A3]">
                <RosetteIcon size={14} className="text-[#D9C2A3]" />
                <span>RÉVEILLON 2026 · ÉCRIN DE DÉCORS & LUMIÈRES</span>
              </div>
            </div>

            {/* Bas de carte : Titre imposant et boutons pills */}
            <div className="relative z-10 mt-24 sm:mt-32 space-y-6">
              <h1 className="font-sans font-black text-4xl sm:text-6xl lg:text-7xl leading-[1.02] tracking-tight text-white max-w-2xl">
                Illuminez votre nuit <br />
                <span className="font-serif italic font-normal text-[#D9C2A3]">avec Maison Minuit</span>
              </h1>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/boutique"
                  className="h-12 px-7 rounded-full bg-white text-[#080E1A] hover:bg-[#D9C2A3] transition-colors font-bold text-xs uppercase tracking-wider flex items-center justify-center"
                >
                  COLLECTION
                </Link>

                <button
                  type="button"
                  onClick={() => navigate('/univers')}
                  className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                  title="Voir les 6 univers"
                >
                  <Icon icon={faPlus} className="text-sm" />
                </button>

                <Link
                  to="/commande"
                  className="h-12 px-7 rounded-full bg-[#D9C2A3] text-[#080E1A] hover:bg-white transition-colors font-bold text-xs uppercase tracking-wider flex items-center gap-2"
                >
                  <span>COMMANDER</span>
                  <Icon icon={faArrowUpRightFromSquare} className="text-xs" />
                </Link>
              </div>
            </div>
          </div>

          {/* --- COLONNE DROITE : CARTE SPOTLIGHT PRODUIT --- */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-5">
            {/* Carte Produit Spotlight */}
            <div className="bg-[#0D182E] border border-white/10 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between flex-1">
              <div className="flex items-start justify-between">
                {/* Vignette bijou / pièce de table */}
                <div className="w-20 h-20 rounded-2xl bg-[#14294A] border border-white/10 overflow-hidden relative flex items-center justify-center">
                  <div className="absolute inset-0 halo-champagne opacity-70" />
                  <RosetteIcon size={32} className="text-[#D9C2A3]" />
                </div>

                {/* Indicateur de position (01 | 04) */}
                <div className="flex flex-col items-end text-[10px] font-mono text-[#C7CCD1]">
                  <span>01</span>
                  <div className="w-px h-8 bg-white/20 my-1" />
                  <span>04</span>
                </div>
              </div>

              <div className="my-6 space-y-2">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#D9C2A3]">
                  PIÈCE SIGNATURE
                </span>
                <h3 className="font-sans font-bold text-xl text-white">
                  Cierge Or de Minuit
                </h3>
                <p className="text-xs text-[#C7CCD1] leading-relaxed">
                  Cire parfumée coulée à la main, poudroiement d'or 24 carats et flamme à combustion lente.
                </p>
                <div className="flex items-center justify-between pt-2">
                  <span className="font-mono text-2xl font-bold text-white">
                    28 000 FCFA
                  </span>
                  <Link
                    to="/produit/p-bougie-or-de-minuit"
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#D9C2A3] hover:text-[#080E1A] border border-white/20 flex items-center justify-center text-white transition-all"
                  >
                    <Icon icon={faArrowUpRightFromSquare} className="text-xs" />
                  </Link>
                </div>
              </div>

              {/* Bouton pill en bas */}
              <div className="pt-3 border-t border-white/10">
                <Link
                  to="/produit/p-bougie-or-de-minuit"
                  className="w-full py-3 px-4 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-between text-xs text-white transition-colors"
                >
                  <span className="text-[11px] uppercase tracking-wider font-semibold">
                    Personnaliser pour votre table
                  </span>
                  <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px]">
                    +
                  </span>
                </Link>
              </div>
            </div>

            {/* Slider flèches de commande pour la carte */}
            <div className="flex items-center justify-end gap-2 pr-1">
              <button
                type="button"
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white transition-colors cursor-pointer"
                aria-label="Article précédent"
              >
                <Icon icon={faChevronLeft} className="text-xs" />
              </button>
              <button
                type="button"
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white transition-colors cursor-pointer"
                aria-label="Article suivant"
              >
                <Icon icon={faChevronRight} className="text-xs" />
              </button>
            </div>
          </div>
        </div>

        {/* --- RANGÉE DU BAS : 2 CARTES BENTO SECONDAIRES --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mt-5">
          {/* Carte B1 : Sur-mesure / Atelier (fond sombre avec rosette) */}
          <div className="md:col-span-7 bg-[#0D182E] border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-[#14294A] border border-white/10 flex items-center justify-center text-[#D9C2A3] shrink-0">
                <RosetteIcon size={34} />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] uppercase font-mono tracking-widest text-[#C7CCD1]">
                  Scénographie Exclusive · 31 Décembre
                </span>
                <h4 className="font-sans font-bold text-xl sm:text-2xl text-white">
                  Composez votre propre <br className="hidden sm:block" /> décor de réveillon
                </h4>
              </div>
            </div>

            <Link
              to="/atelier"
              className="w-12 h-12 rounded-full bg-white/10 hover:bg-[#D9C2A3] hover:text-[#080E1A] border border-white/20 flex items-center justify-center text-white transition-all shrink-0 self-end sm:self-center"
            >
              <Icon icon={faArrowUpRightFromSquare} className="text-sm" />
            </Link>
          </div>

          {/* Carte B2 : Carte Warm Champagne (univers préférés avec 3 avatars / vignettes) */}
          <div className="md:col-span-5 bg-[#D9C2A3] rounded-3xl p-6 sm:p-8 text-[#080E1A] flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="font-sans font-bold text-xs uppercase tracking-[0.2em]">
                Univers Préférés ●●●
              </span>
              <RosetteIcon size={20} className="text-[#080E1A]" />
            </div>

            <div className="flex items-center justify-between gap-4 mt-2">
              {/* Stack de 3 cercles superposés */}
              <div className="flex -space-x-4">
                <div className="w-14 h-14 rounded-full border-2 border-[#D9C2A3] bg-[#0B1528] flex items-center justify-center overflow-hidden text-white font-serif text-sm">
                  <span>Or</span>
                </div>
                <div className="w-14 h-14 rounded-full border-2 border-[#D9C2A3] bg-[#14294A] flex items-center justify-center overflow-hidden text-[#D9C2A3] font-serif text-sm">
                  <span>Nuit</span>
                </div>
                <div className="w-14 h-14 rounded-full border-2 border-[#D9C2A3] bg-[#060F1F] flex items-center justify-center overflow-hidden text-white font-serif text-sm">
                  <span>Table</span>
                </div>
              </div>

              <Link
                to="/univers"
                className="w-12 h-12 rounded-full bg-[#080E1A] text-white hover:bg-white hover:text-[#080E1A] flex items-center justify-center transition-all shrink-0"
              >
                <Icon icon={faArrowUpRightFromSquare} className="text-sm" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 2 : COLLECTION DE RÉVEILLON BY UNIVERS (Catalogue) */}
      {/* ========================================================= */}
      <section className="max-w-[1240px] mx-auto px-4 sm:px-6 py-16 border-t border-white/10">
        {/* Titre géant stylisé façon "New Ice Jewelry By Type" */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
          <div>
            <div className="flex flex-wrap items-center gap-4">
              <h2 className="font-sans font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white">
                Les Décors De Minuit
              </h2>
              <div className="hidden sm:inline-flex items-center gap-3">
                <Link
                  to="/boutique"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-colors"
                >
                  <Icon icon={faArrowRight} className="text-xs" />
                </Link>
                <Link
                  to="/boutique"
                  className="h-10 px-5 rounded-full bg-[#D9C2A3] text-[#080E1A] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 hover:bg-white transition-colors"
                >
                  <span>BOUTIQUE</span>
                  <Icon icon={faArrowUpRightFromSquare} className="text-[10px]" />
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-2">
              <SunburstIcon className="text-[#D9C2A3]" />
              <span className="font-sans font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white">
                Par Univers
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#C7CCD1] max-w-md leading-relaxed">
            Découvrez nos 24 créations d'illuminations et d'accessoires de table.
            Des candélabres sculptés aux guirlandes diaphanes, chaque pièce est façonnée
            pour faire de minuit un souvenir impérissable.
          </p>
        </div>

        {/* Ligne de filtres pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-10">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`h-9 px-5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-white text-[#080E1A]'
                : 'bg-white/5 text-[#C7CCD1] hover:bg-white/10 hover:text-white border border-white/10'
            }`}
          >
            Tous
          </button>
          {SEED_UNIVERS.map((u) => (
            <button
              key={u.id}
              type="button"
              onClick={() => setActiveCategory(u.id)}
              className={`h-9 px-5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === u.id
                  ? 'bg-white text-[#080E1A]'
                  : 'bg-white/5 text-[#C7CCD1] hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              {u.nom}
            </button>
          ))}
        </div>

        {/* Grille de 4 cartes haut de gamme */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((produit, idx) => {
            const isLiked = Boolean(favorites[produit.id]);
            // La 3ème carte a le look de mise en avant "Frost Bite Grillz" dans le design
            const isSpecialHighlight = idx === 2;

            return (
              <div
                key={produit.id}
                className={`rounded-3xl border transition-all duration-400 p-5 flex flex-col justify-between group ${
                  isSpecialHighlight
                    ? 'bg-[#121E36] border-[#D9C2A3]/50 shadow-xl'
                    : 'bg-[#0D182E] border-white/10 hover:border-white/25'
                }`}
              >
                {/* Haut : Boutons ronds (Lien ↗ et Coeur ♡) */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Link
                      to={`/produit/${produit.slug}`}
                      className="w-9 h-9 rounded-full bg-white/5 hover:bg-white hover:text-[#080E1A] border border-white/15 flex items-center justify-center text-white transition-all"
                      title="Voir les détails"
                    >
                      <Icon icon={faArrowUpRightFromSquare} className="text-xs" />
                    </Link>

                    <button
                      type="button"
                      onClick={(e) => toggleFavorite(produit.id, e)}
                      className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                        isLiked
                          ? 'bg-[#C1121F] border-[#C1121F] text-white'
                          : 'bg-white/5 border-white/15 text-white/70 hover:text-white hover:bg-white/15'
                      }`}
                      aria-label="Ajouter aux favoris"
                    >
                      <Icon icon={isLiked ? faHeartSolid : faHeartRegular} className="text-xs" />
                    </button>
                  </div>

                  {/* Badges pills */}
                  <div className="flex items-center gap-1.5 mb-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#D9C2A3]/15 text-[#D9C2A3] text-[10px] font-mono uppercase tracking-wider">
                      {idx % 2 === 0 ? 'Signature' : 'Sélection'}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white/80 text-[10px] font-mono uppercase tracking-wider">
                      {produit.univers_id ? produit.univers_id.replace('u-', '').replace(/-/g, ' ') : 'Édition 2026'}
                    </span>
                  </div>

                  {/* Vignette image */}
                  <Link
                    to={`/produit/${produit.slug}`}
                    className="block aspect-[4/5] rounded-2xl bg-[#060F1F] border border-white/10 overflow-hidden relative mb-5 group-hover:scale-[1.02] transition-transform"
                  >
                    {produit.images && produit.images[0] ? (
                      <img
                        src={produit.images[0]}
                        alt={produit.nom}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                        <RosetteIcon size={36} className="text-[#D9C2A3]/60 mb-2" />
                        <span className="font-serif italic text-sm text-[#D9C2A3]/80">Maison Minuit</span>
                      </div>
                    )}
                  </Link>
                </div>

                {/* Bas de carte */}
                <div className="space-y-3">
                  <div>
                    <h3 className="font-sans font-bold text-lg text-white group-hover:text-[#D9C2A3] transition-colors line-clamp-1">
                      {produit.nom}
                    </h3>
                    <p className="text-[11px] text-[#C7CCD1] line-clamp-2 mt-1 leading-relaxed">
                      {produit.description_courte}
                    </p>
                  </div>

                  {isSpecialHighlight ? (
                    <div className="pt-2 flex items-center gap-2">
                      <Link
                        to={`/produit/${produit.slug}`}
                        className="flex-1 py-3 px-4 rounded-full bg-white text-[#080E1A] hover:bg-[#D9C2A3] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                      >
                        <span>EN SAVOIR PLUS</span>
                        <Icon icon={faArrowRight} className="text-xs" />
                      </Link>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                      <div>
                        <span className="font-mono text-base font-bold text-white">
                          {formatPrix(produit.prix)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-[#D9C2A3] font-mono">
                        <Icon icon={faStar} className="text-[10px]" />
                        <span>4.95</span>
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={(e) => handleQuickAdd(produit.id, produit.nom, e)}
                    className="w-full py-2.5 rounded-full bg-white/5 hover:bg-white/20 border border-white/10 text-xs font-semibold text-white/90 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>+ Ajouter à ma sélection</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer pagination 1/24 */}
        <div className="flex items-center justify-between mt-12 pt-6 border-t border-white/10">
          <span className="font-mono text-xs text-[#C7CCD1]">
            Affichage de 8 créations d'ambiance
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPageIndex((p) => Math.max(1, p - 1))}
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white transition-colors cursor-pointer"
              aria-label="Page précédente"
            >
              <Icon icon={faChevronLeft} className="text-xs" />
            </button>
            <button
              type="button"
              onClick={() => setPageIndex((p) => p + 1)}
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white transition-colors cursor-pointer"
              aria-label="Page suivante"
            >
              <Icon icon={faChevronRight} className="text-xs" />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 3 : "UNCOVER OUR MOST [COVETED] RÉVEILLON DECOR" (BENTO) */}
      {/* ========================================================= */}
      <section className="max-w-[1240px] mx-auto px-4 sm:px-6 py-16 border-t border-white/10">
        {/* Titre avec le badge pill encadré [Les Plus Prisées] */}
        <div className="mb-12">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="font-sans font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight text-white">
              Découvrez Nos Créations
            </h2>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/30 text-white font-serif italic text-2xl sm:text-4xl bg-white/5">
              <span>Les Plus Prisées</span>
              <span className="inline-flex gap-1 text-[#D9C2A3]">●●●</span>
              <RosetteIcon size={20} className="text-[#D9C2A3]" />
            </div>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex -space-x-1 text-[#D9C2A3]">
              <RosetteIcon size={24} />
              <RosetteIcon size={24} />
              <RosetteIcon size={24} />
            </div>
            <span className="font-sans font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight text-white">
              De Réveillon
            </span>
          </div>
        </div>

        {/* Grille Bento de 3 colonnes */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Bento Gauche : Statistique 1.500+ & Story */}
          <div className="lg:col-span-5 bg-[#0D182E] border border-white/10 rounded-3xl p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-10">
                <RosetteIcon size={44} className="text-[#D9C2A3]" />
                <Link
                  to="/atelier"
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#D9C2A3] hover:text-[#080E1A] border border-white/15 flex items-center justify-center text-white transition-all"
                >
                  <Icon icon={faArrowUpRightFromSquare} className="text-xs" />
                </Link>
              </div>

              <div className="flex items-center justify-between gap-4 mb-8">
                <div>
                  <span className="font-sans font-black text-5xl sm:text-6xl text-white block">
                    1.500+
                  </span>
                  <span className="text-xs uppercase font-mono tracking-widest text-[#D9C2A3]">
                    Tables Illuminées
                  </span>
                </div>

                {/* Cluster d'avatars */}
                <div className="flex -space-x-3">
                  <div className="w-11 h-11 rounded-full border-2 border-[#0D182E] bg-[#14294A] flex items-center justify-center text-xs text-[#D9C2A3]">
                    ✦
                  </div>
                  <div className="w-11 h-11 rounded-full border-2 border-[#0D182E] bg-[#060F1F] flex items-center justify-center text-xs text-white">
                    ✦
                  </div>
                  <div className="w-11 h-11 rounded-full border-2 border-[#0D182E] bg-[#D9C2A3] flex items-center justify-center text-xs text-[#080E1A] font-bold">
                    +
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#C7CCD1] leading-relaxed pt-6 border-t border-white/10">
              Avec une exigence absolue de qualité et d'artisanat d'art, Maison Minuit a illuminé
              plus de 1 500 réveillons mémorables. Nos pièces exclusives transforment chaque seconde
              précédant les douze coups en instant d'émerveillement.
            </p>
          </div>

          {/* Bento Centre : Pièce phare en grand avec tags */}
          <div className="lg:col-span-5 bg-[#0D182E] border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#D9C2A3] text-[#080E1A] text-[10px] font-bold uppercase tracking-wider">
                    Coup de cœur
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-white text-[10px] font-mono uppercase tracking-wider">
                    Bestseller
                  </span>
                </div>
                <Link
                  to="/boutique"
                  className="text-[11px] font-mono uppercase text-[#D9C2A3] hover:underline flex items-center gap-1"
                >
                  <span>VOIR TOUT</span>
                  <Icon icon={faArrowUpRightFromSquare} className="text-[9px]" />
                </Link>
              </div>

              {/* Image pièce phare */}
              <div className="aspect-[4/3] rounded-2xl bg-[#060F1F] border border-white/10 overflow-hidden relative mb-6">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle at center, rgba(217, 194, 163, 0.3) 0%, rgba(6, 15, 31, 0.9) 70%), url("https://images.unsplash.com/photo-1578357078586-491adf1aa5ba?auto=format&fit=crop&w=800&q=80")',
                  }}
                />
                <div className="absolute top-4 right-4">
                  <span className="w-9 h-9 rounded-full bg-black/40 border border-white/20 flex items-center justify-center text-white">
                    <Icon icon={faArrowUpRightFromSquare} className="text-xs" />
                  </span>
                </div>
              </div>

              <h3 className="font-sans font-bold text-xl text-white">
                Candélabre Astral Or Antique
              </h3>
              <p className="text-xs text-[#C7CCD1] mt-1 leading-relaxed">
                Pièce centrale sculptée en laiton vieilli à 5 branches pour illuminer le centre de votre table.
              </p>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-white/10 mt-6">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[10px]">★</span>
                  <span className="w-6 h-6 rounded-full bg-[#D9C2A3] text-[#080E1A] flex items-center justify-center text-[10px] font-bold">+1.2k</span>
                </div>
                <span className="text-[11px] font-mono text-[#C7CCD1]">avis vérifiés</span>
              </div>
              <div className="flex items-center gap-1 text-[#D9C2A3] font-mono text-sm font-bold">
                <Icon icon={faStar} className="text-xs" />
                <span>4.95</span>
              </div>
            </div>
          </div>

          {/* Bento Droite : Rubans verticaux iconiques du design (2 colonnes verticales) */}
          <div className="lg:col-span-2 flex sm:flex-row lg:flex-col gap-4">
            <Link
              to="/boutique"
              className="flex-1 bg-[#0D182E] border border-white/10 rounded-3xl p-5 flex flex-col justify-between items-center group hover:border-[#D9C2A3] transition-all min-h-[180px]"
            >
              <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-[#D9C2A3] group-hover:text-[#080E1A] flex items-center justify-center text-white transition-colors">
                ↑
              </div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#C7CCD1] group-hover:text-white transition-colors [writing-mode:vertical-rl] rotate-180 py-4">
                Lumières Célestes
              </span>
              <RosetteIcon size={20} className="text-[#D9C2A3]" />
            </Link>

            <Link
              to="/boutique"
              className="flex-1 bg-[#0D182E] border border-white/10 rounded-3xl p-5 flex flex-col justify-between items-center group hover:border-[#D9C2A3] transition-all min-h-[180px]"
            >
              <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-[#D9C2A3] group-hover:text-[#080E1A] flex items-center justify-center text-white transition-colors">
                ↑
              </div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#C7CCD1] group-hover:text-white transition-colors [writing-mode:vertical-rl] rotate-180 py-4">
                Candélabres Dorés
              </span>
              <RosetteIcon size={20} className="text-[#D9C2A3]" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 4 : CTA FINAL DE RÉSERVATION SANS PAIEMENT EN LIGNE */}
      {/* ========================================================= */}
      <section className="max-w-[1240px] mx-auto px-4 sm:px-6 pt-10">
        <div className="bg-gradient-to-r from-[#0D182E] via-[#14294A] to-[#0D182E] border border-white/15 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#D9C2A3]/10 rounded-full blur-3xl pointer-events-none" />

          <RosetteIcon size={40} className="text-[#D9C2A3] mx-auto mb-4" />
          <h2 className="font-sans font-black text-3xl sm:text-5xl text-white mb-4">
            Préparez votre passage vers 2027
          </h2>
          <p className="text-sm text-[#C7CCD1] max-w-lg mx-auto mb-8 leading-relaxed">
            Aucun paiement en ligne requis. Sélectionnez vos créations, nous confirmons votre livraison
            et le règlement sur WhatsApp.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/commande"
              className="h-12 px-8 rounded-full bg-[#E8ECEF] text-[#080E1A] hover:bg-[#D9C2A3] font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors"
            >
              <span>PASSER MA COMMANDE</span>
              <Icon icon={faArrowRight} className="text-xs" />
            </Link>
            <Link
              to="/univers"
              className="h-12 px-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs uppercase tracking-wider transition-colors flex items-center justify-center"
            >
              EXPLORER LES 6 UNIVERS
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
