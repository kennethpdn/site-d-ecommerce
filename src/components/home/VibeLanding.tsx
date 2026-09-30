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
  faCartShopping,
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
      {/* SECTION 1 : HERO BANNER JAUNE D'OR & TREND PRODUCTS       */}
      {/* Style inspiré fidèlement de la maquette eCommerce         */}
      {/* ========================================================= */}
      <section className="max-w-[1240px] mx-auto px-4 sm:px-6 pt-2 pb-16 space-y-8">
        {/* --- GRAND HERO BANNER JAUNE D'OR AVEC ÉCHANCRURE CENTRALE --- */}
        <div className="relative rounded-[32px] sm:rounded-[44px] bg-[#F6CD3C] text-[#080E1A] p-6 sm:p-12 lg:p-14 shadow-2xl overflow-hidden min-h-[480px] sm:min-h-[520px] flex items-center">
          {/* Échancrure centrale supérieure décorative avec logo */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 hidden md:block">
            <div className="bg-[#080E1A] px-7 py-3 rounded-b-3xl border-b border-x border-white/10 flex items-center gap-2 shadow-lg">
              <RosetteIcon size={20} className="text-[#F6CD3C]" />
              <span className="font-extrabold text-xs tracking-widest uppercase text-white font-sans">
                Maison Minuit
              </span>
            </div>
          </div>

          {/* Grille principale 2 colonnes */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full relative z-10">
            {/* Colonne Gauche : Titre imposant, texte et boutons capsules */}
            <div className="lg:col-span-6 space-y-6 pt-6 sm:pt-4">
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#080E1A]/70 font-mono">
                  Édition Réveillon · 31 Décembre 2026
                </span>
                <h1 className="font-sans font-black text-4xl sm:text-5xl lg:text-[62px] leading-[1.04] tracking-tight text-[#080E1A]">
                  Coussins Velours <br />
                  <span className="font-serif italic font-normal text-[#080E1A]/90">
                    &amp; Lumières Dorées
                  </span>
                </h1>
              </div>

              <p className="text-xs sm:text-sm text-[#080E1A]/85 font-medium max-w-md leading-relaxed">
                Des textures précieuses en velours côtelé et des lueurs tamisées pour faire vibrer votre intérieur et sublimer vos tables de réveillon.
              </p>

              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  to="/boutique"
                  className="px-8 py-3.5 rounded-full bg-white text-[#080E1A] hover:bg-[#080E1A] hover:text-white transition-all duration-300 font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg"
                >
                  Commander
                </Link>
                <Link
                  to="/univers"
                  className="px-8 py-3.5 rounded-full bg-[#080E1A] text-white hover:bg-white hover:text-[#080E1A] transition-all duration-300 font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg"
                >
                  Explorer plus
                </Link>
              </div>
            </div>

            {/* Colonne Droite : Visuel lifestyle avec Hotspot de prix et Badge bleu royal */}
            <div className="lg:col-span-6 relative">
              <div className="relative aspect-[4/3] sm:aspect-[16/11] rounded-3xl overflow-hidden shadow-2xl bg-[#E8BC2D]">
                <img
                  src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80"
                  alt="Coussins velours et décor de réveillon"
                  className="w-full h-full object-cover object-center scale-102"
                />

                {/* Voile discret */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

                {/* Hotspot interactif de prix posé sur le coussin */}
                <div className="absolute top-[28%] left-[28%] z-20">
                  <Link
                    to="/produit/p-chemin-de-table-nocturne"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-[#080E1A] text-xs font-bold shadow-xl hover:scale-105 transition-transform"
                    title="Voir le détail"
                  >
                    <span>28 000 FCFA</span>
                    <span className="w-4 h-4 rounded-full bg-[#080E1A] text-white flex items-center justify-center text-[10px]">
                      +
                    </span>
                  </Link>
                </div>

                {/* Badge bleu royal flottant avec flèche ronde */}
                <Link
                  to="/boutique"
                  className="absolute bottom-5 left-5 z-20 bg-[#0055D4] hover:bg-[#0043A8] text-white p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl shadow-2xl flex items-center gap-3 transition-transform hover:scale-102 max-w-[240px]"
                >
                  <span className="text-xs font-bold leading-tight">
                    Plus de 44 créations de fête
                  </span>
                  <span className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center shrink-0">
                    <Icon icon={faArrowUpRightFromSquare} className="text-xs" />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* --- RANGÉE INFÉRIEURE : TREND PRODUCTS (1 Carte Bleue + 3 Cartes Produits Claires) --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Carte 1 : Highlight Bleu Royal "Trend Products" */}
          <div className="rounded-[28px] bg-[#0055D4] text-white p-6 relative overflow-hidden flex flex-col justify-between min-h-[340px] shadow-xl group">
            <div className="relative z-10 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-white/70 font-mono">
                Collection
              </span>
              <h3 className="font-sans font-black text-2xl sm:text-3xl leading-tight text-white">
                Trend <br />
                Products
              </h3>
            </div>

            {/* Silhouette du produit signature en halo */}
            <div className="my-auto py-2 flex items-center justify-center relative">
              <div className="w-32 h-32 rounded-full bg-white/10 filter blur-xl absolute inset-0 m-auto pointer-events-none" />
              <img
                src="https://images.unsplash.com/photo-1543258103-a62bdc069871?auto=format&fit=crop&w=400&q=80"
                alt="Produit tendance"
                className="w-28 h-28 object-cover rounded-2xl shadow-lg relative z-10 group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="relative z-10 flex items-center justify-between pt-2">
              <span className="text-xs font-semibold text-white/80">
                Sélection festive
              </span>
              <Link
                to="/boutique"
                className="w-11 h-11 rounded-full bg-white/20 group-hover:bg-white group-hover:text-[#0055D4] text-white flex items-center justify-center transition-all shadow-md"
                title="Découvrir tous les produits tendances"
              >
                <Icon icon={faArrowUpRightFromSquare} className="text-xs" />
              </Link>
            </div>
          </div>

          {/* Cartes 2, 3, 4 : Cartes Produits Épurées Blanches style eCommerce Website That Inspire 20 */}
          {[
            {
              id: 'p-bougie-nuit-blanche',
              nom: 'Bougie Nuit Blanche pour Dîner de Minuit',
              slug: 'bougie-nuit-blanche',
              prix: 28000,
              note: '5.0',
              reviews: '14 reviews',
              image:
                'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80',
            },
            {
              id: 'p-candelabre-olympe',
              nom: 'Candélabre Astral Or Antique Grand Format',
              slug: 'candelabre-olympe',
              prix: 48000,
              note: '4.6',
              reviews: '7 reviews',
              image:
                'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
            },
            {
              id: 'p-photophore-aureole',
              nom: 'Photophore Auréole Fumé & Cire Végétale',
              slug: 'photophore-aureole',
              prix: 18000,
              note: '4.3',
              reviews: '36 reviews',
              image:
                'https://images.unsplash.com/photo-1507499739999-097706ad8914?auto=format&fit=crop&w=600&q=80',
            },
          ].map((prod) => {
            const isFav = !!favorites[prod.id];
            return (
              <div
                key={prod.id}
                className="rounded-[28px] sm:rounded-[32px] bg-[#F8F9FA] text-[#111827] p-5 sm:p-6 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between min-h-[350px] border border-black/[0.04] group relative"
              >
                {/* Ligne haute : Bouton favori bleu royal dans le coin supérieur gauche */}
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={(e) => toggleFavorite(prod.id, e)}
                    className="w-8 h-8 flex items-center justify-center text-[#0055D4] hover:scale-110 transition-transform cursor-pointer -ml-1 -mt-1"
                    title="Ajouter aux favoris"
                    aria-label="Ajouter aux favoris"
                  >
                    <Icon icon={isFav ? faHeartSolid : faHeartRegular} className="text-base" />
                  </button>
                </div>

                {/* Visuel produit centré */}
                <Link
                  to={`/produit/${prod.slug}`}
                  className="h-44 sm:h-50 w-full flex items-center justify-center my-2 overflow-hidden block"
                >
                  <img
                    src={prod.image}
                    alt={prod.nom}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>

                {/* Titre 2 lignes, note bleue et prix + panier circulaire noir */}
                <div className="space-y-1.5 pt-2">
                  <Link
                    to={`/produit/${prod.slug}`}
                    className="font-sans font-semibold text-xs sm:text-[13px] text-[#111827] hover:text-[#0055D4] transition-colors leading-snug line-clamp-2 block"
                  >
                    {prod.nom}
                  </Link>

                  {/* Ligne d'avis en bleu royal style mockup */}
                  <div className="flex items-center gap-1 text-xs text-[#0055D4] font-medium pt-0.5">
                    <Icon icon={faStar} className="text-[11px] text-[#0055D4]" />
                    <span>{prod.note}</span>
                    <span className="text-[#0055D4]/80">({prod.reviews})</span>
                  </div>

                  {/* Ligne inférieure : Prix et bouton rond noir panier */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="font-sans font-bold text-base sm:text-lg text-[#111827]">
                      {formatPrix(prod.prix)}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => handleQuickAdd(prod.id, prod.nom, e)}
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#111827] hover:bg-[#0055D4] text-white flex items-center justify-center transition-colors shadow-md cursor-pointer shrink-0"
                      title="Ajouter au panier"
                      aria-label="Ajouter au panier"
                    >
                      <Icon icon={faCartShopping} className="text-xs" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
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

        {/* Grille de 4 cartes haut de gamme style eCommerce Website That Inspire 20 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((produit, idx) => {
            const isLiked = Boolean(favorites[produit.id]);

            return (
              <div
                key={produit.id}
                className="rounded-[28px] sm:rounded-[32px] bg-[#F8F9FA] text-[#111827] p-5 sm:p-6 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between min-h-[350px] border border-black/[0.04] group relative"
              >
                {/* Ligne haute : Bouton favori bleu royal dans le coin supérieur gauche */}
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={(e) => toggleFavorite(produit.id, e)}
                    className="w-8 h-8 flex items-center justify-center text-[#0055D4] hover:scale-110 transition-transform cursor-pointer -ml-1 -mt-1"
                    title="Ajouter aux favoris"
                    aria-label="Ajouter aux favoris"
                  >
                    <Icon icon={isLiked ? faHeartSolid : faHeartRegular} className="text-base" />
                  </button>
                </div>

                {/* Visuel produit centré */}
                <Link
                  to={`/produit/${produit.slug}`}
                  className="h-44 sm:h-50 w-full flex items-center justify-center my-2 overflow-hidden block"
                >
                  {produit.images && produit.images[0] ? (
                    <img
                      src={produit.images[0]}
                      alt={produit.nom}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                      <RosetteIcon size={36} className="text-[#080E1A]/40 mb-2" />
                      <span className="font-serif italic text-sm text-[#080E1A]/60">Maison Minuit</span>
                    </div>
                  )}
                </Link>

                {/* Titre 2 lignes, note bleue et prix + panier circulaire noir */}
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
                    <span className="text-[#0055D4]/80">({14 + (idx * 4)} reviews)</span>
                  </div>

                  {/* Ligne inférieure : Prix et bouton rond noir panier */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="font-sans font-bold text-base sm:text-lg text-[#111827]">
                      {formatPrix(produit.prix)}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => handleQuickAdd(produit.id, produit.nom, e)}
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#111827] hover:bg-[#0055D4] text-white flex items-center justify-center transition-colors shadow-md cursor-pointer shrink-0"
                      title="Ajouter au panier"
                      aria-label="Ajouter au panier"
                    >
                      <Icon icon={faCartShopping} className="text-xs" />
                    </button>
                  </div>
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
