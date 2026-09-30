import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  faSliders,
  faXmark,
  faCheck,
  faStar,
  faEye,
  faBagShopping,
  faTruckFast,
  faCreditCard,
  faHeadset,
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { SEO } from '../components/common/SEO';
import { Icon } from '../components/common/Icon';
import { ProductCardSkeleton } from '../components/common/Skeleton';
import { getProduits, getUniversList } from '../lib/supabase';
import { Produit, Univers } from '../types';
import { formatPrix } from '../config';
import { useCart } from '../context/CartContext';
import { DiningTableVisual45 } from '../components/common/DiningTableVisual45';

// Catégories décoratives pour le filtre gauche
const CATEGORIES_FILTERS = [
  'Art de la table',
  'Candélabres & Cierges',
  'Vases & Carafes',
  'Lumières & Étoiles',
  'Textiles & Parures',
  'Rituels du Temps',
];

export const Boutique: React.FC = () => {
  const { addItem, toggleDrawer } = useCart();
  const [produits, setProduits] = useState<Produit[]>([]);
  const [univers, setUnivers] = useState<Univers[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtres
  const [selectedUnivers, setSelectedUnivers] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(150000);
  const [minRating, setMinRating] = useState<number>(0);
  const [onlyBestsellers, setOnlyBestsellers] = useState<boolean>(false);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'rating'>('default');

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 9;

  // États interactifs
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<Produit | null>(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [pList, uList] = await Promise.all([getProduits(), getUniversList()]);
        setProduits(pList);
        setUnivers(uList);
      } catch {
        // Chargement silencieux
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleQuickAdd = (produit: Produit, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(produit.id, 1);
    setAddedNotice(produit.nom);
    setTimeout(() => setAddedNotice(null), 3500);
  };

  // Filtrage combiné
  const filteredProduits = useMemo(() => {
    let result = [...produits];

    // Univers
    if (selectedUnivers.length > 0) {
      result = result.filter((p) => p.univers_id && selectedUnivers.includes(p.univers_id));
    }

    // Catégories (basé sur matieres ou nom)
    if (selectedCategories.length > 0) {
      result = result.filter((p) => {
        const text = `${p.nom} ${p.matieres || ''} ${p.accroche || ''}`.toLowerCase();
        return selectedCategories.some((cat) => {
          if (cat === 'Art de la table') return text.includes('table') || text.includes('assiette') || text.includes('couvert');
          if (cat === 'Candélabres & Cierges') return text.includes('cierge') || text.includes('bougie') || text.includes('candélabre');
          if (cat === 'Vases & Carafes') return text.includes('verre') || text.includes('flûte') || text.includes('carafe') || text.includes('vase');
          if (cat === 'Lumières & Étoiles') return text.includes('lumière') || text.includes('guirlande') || text.includes('étoile') || text.includes('scintill');
          if (cat === 'Textiles & Parures') return text.includes('linge') || text.includes('nappe') || text.includes('serviette') || text.includes('soie');
          if (cat === 'Rituels du Temps') return text.includes('sablier') || text.includes('cadran') || text.includes('minuit') || text.includes('temps');
          return false;
        });
      });
    }

    // Prix max
    result = result.filter((p) => p.prix <= maxPrice);

    // Bestsellers
    if (onlyBestsellers) {
      result = result.filter((p) => p.populaire === true);
    }

    // En stock
    if (onlyInStock) {
      result = result.filter((p) => (p.stock || 1) > 0);
    }

    // Tri
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.prix - b.prix);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.prix - a.prix);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b.populaire ? 1 : 0) - (a.populaire ? 1 : 0));
    }

    return result;
  }, [produits, selectedUnivers, selectedCategories, maxPrice, onlyBestsellers, onlyInStock, sortBy]);

  // Pagination calculée
  const totalPages = Math.ceil(filteredProduits.length / itemsPerPage) || 1;
  const paginatedProduits = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProduits.slice(start, start + itemsPerPage);
  }, [filteredProduits, currentPage]);

  const resetAllFilters = () => {
    setSelectedUnivers([]);
    setSelectedCategories([]);
    setMaxPrice(150000);
    setMinRating(0);
    setOnlyBestsellers(false);
    setOnlyInStock(false);
    setSortBy('default');
    setCurrentPage(1);
  };

  const hasActiveFilters =
    selectedUnivers.length > 0 ||
    selectedCategories.length > 0 ||
    maxPrice < 150000 ||
    onlyBestsellers ||
    onlyInStock;

  return (
    <div className="bg-[#080E1A] text-[#E8ECEF] min-h-screen selection:bg-[#D9C2A3] selection:text-[#080E1A]">
      <SEO
        title="Boutique & Catalogue de Réveillon | Maison Minuit"
        description="Vingt-quatre créations de haute scénographie pour illuminer chaque seconde avant et après minuit. Explorez notre catalogue."
      />

      {/* Notification Toast d'ajout au panier */}
      {addedNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0D182E] border border-[#D9C2A3] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-in text-xs">
          <span className="w-5 h-5 rounded-full bg-[#D9C2A3] text-[#080E1A] flex items-center justify-center text-[10px]">
            <Icon icon={faCheck} />
          </span>
          <span>« {addedNotice} » ajouté à votre sélection.</span>
          <button
            type="button"
            onClick={toggleDrawer}
            className="underline text-[#D9C2A3] hover:text-white ml-2 cursor-pointer font-semibold"
          >
            Voir
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. EN-TÊTE ÉPURÉ DE LA BOUTIQUE AVEC BREADCRUMB          */}
      {/* ======================================================== */}
      <div className="relative py-12 sm:py-16 border-b border-white/10 overflow-hidden bg-[#0A1222]">
        {/* Motifs géométriques décoratifs légers en fond */}
        <div className="absolute top-1/2 left-8 -translate-y-1/2 opacity-20 pointer-events-none hidden sm:block">
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 16 }).map((_, i) => (
              <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#D9C2A3]" />
            ))}
          </div>
        </div>
        <div className="absolute top-1/2 right-8 -translate-y-1/2 opacity-20 pointer-events-none hidden sm:block">
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 16 }).map((_, i) => (
              <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#D9C2A3]" />
            ))}
          </div>
        </div>

        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 text-center space-y-3 relative z-10">
          <h1 className="font-sans font-bold text-3xl sm:text-5xl tracking-tight text-white">
            La Boutique
          </h1>
          <nav className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-[#8E95A5]">
            <Link to="/" className="hover:text-white transition-colors">
              Accueil
            </Link>
            <span>/</span>
            <span className="text-[#D9C2A3]">Boutique</span>
          </nav>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. ZONE PRINCIPALE : SIDEBAR FILTRES + GRILLE PRODUITS   */}
      {/* ======================================================== */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {/* Bouton Filtres Mobile */}
        <div className="lg:hidden flex items-center justify-between pb-6 mb-6 border-b border-white/10">
          <span className="text-xs uppercase tracking-wider text-[#8E95A5] font-mono">
            {filteredProduits.length} résultat(s)
          </span>
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#0D182E] border border-white/15 rounded-full text-xs font-semibold uppercase tracking-wider text-white"
          >
            <Icon icon={faSliders} className="text-xs text-[#D9C2A3]" />
            <span>Options de Filtres</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* ---------------------------------------------------- */}
          {/* SIDEBAR GAUCHE : OPTIONS DE FILTRES                  */}
          {/* ---------------------------------------------------- */}
          <aside className="hidden lg:block lg:col-span-3 space-y-8 pr-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h2 className="font-sans font-bold text-base uppercase tracking-wider text-white">
                Options de Filtres
              </h2>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="text-[11px] text-[#D9C2A3] hover:underline cursor-pointer"
                >
                  Effacer tout
                </button>
              )}
            </div>

            {/* Catégories de Décors */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-[#8E95A5]">
                Par Catégories
              </h3>
              <div className="space-y-2">
                {CATEGORIES_FILTERS.map((cat) => {
                  const isChecked = selectedCategories.includes(cat);
                  return (
                    <label
                      key={cat}
                      className="flex items-center justify-between text-xs text-[#C7CCD1] hover:text-white cursor-pointer select-none group"
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            setSelectedCategories((prev) =>
                              isChecked ? prev.filter((c) => c !== cat) : [...prev, cat]
                            );
                            setCurrentPage(1);
                          }}
                          className="w-4 h-4 rounded-xs border-white/20 bg-[#0D182E] text-[#D9C2A3] focus:ring-0 cursor-pointer"
                        />
                        <span className={isChecked ? 'text-white font-medium' : ''}>{cat}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Par Univers */}
            <div className="space-y-3 pt-2 border-t border-white/10">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-[#8E95A5]">
                Par Univers
              </h3>
              <div className="space-y-2">
                {univers.map((u) => {
                  const isChecked = selectedUnivers.includes(u.id);
                  const count = produits.filter((p) => p.univers_id === u.id).length;
                  return (
                    <label
                      key={u.id}
                      className="flex items-center justify-between text-xs text-[#C7CCD1] hover:text-white cursor-pointer select-none group"
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            setSelectedUnivers((prev) =>
                              isChecked ? prev.filter((id) => id !== u.id) : [...prev, u.id]
                            );
                            setCurrentPage(1);
                          }}
                          className="w-4 h-4 rounded-xs border-white/20 bg-[#0D182E] text-[#D9C2A3] focus:ring-0 cursor-pointer"
                        />
                        <span className={isChecked ? 'text-white font-medium' : ''}>{u.nom}</span>
                      </div>
                      <span className="text-[10px] text-[#8E95A5] font-mono">({count})</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Filtre de Prix */}
            <div className="space-y-3 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-[#8E95A5]">
                  Prix Maximum
                </h3>
                <span className="font-mono text-xs text-[#D9C2A3] font-semibold">
                  {formatPrix(maxPrice)}
                </span>
              </div>
              <input
                type="range"
                min={10000}
                max={150000}
                step={5000}
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="w-full h-1.5 bg-[#0D182E] rounded-lg appearance-none cursor-pointer accent-[#D9C2A3]"
              />
              <div className="flex justify-between text-[10px] text-[#8E95A5] font-mono">
                <span>10 000 FCFA</span>
                <span>150 000 FCFA</span>
              </div>
            </div>

            {/* Avis Clients */}
            <div className="space-y-3 pt-2 border-t border-white/10">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-[#8E95A5]">
                Avis Clients
              </h3>
              <div className="space-y-1.5">
                {[5, 4, 3].map((stars) => (
                  <button
                    key={stars}
                    type="button"
                    onClick={() => {
                      setMinRating(minRating === stars ? 0 : stars);
                      setCurrentPage(1);
                    }}
                    className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs transition-colors ${
                      minRating === stars ? 'bg-[#0D182E] text-white' : 'text-[#8E95A5] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Icon
                          key={i}
                          icon={faStar}
                          className={`text-[10px] ${i < stars ? 'text-amber-400' : 'text-white/20'}`}
                        />
                      ))}
                      <span className="text-white text-xs ml-1.5">{stars} Étoiles</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Promotions & Sélections */}
            <div className="space-y-3 pt-2 border-t border-white/10">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-[#8E95A5]">
                Sélections Spéciales
              </h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2.5 text-xs text-[#C7CCD1] hover:text-white cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={onlyBestsellers}
                    onChange={(e) => {
                      setOnlyBestsellers(e.target.checked);
                      setCurrentPage(1);
                    }}
                    className="w-4 h-4 rounded-xs border-white/20 bg-[#0D182E] text-[#D9C2A3] focus:ring-0 cursor-pointer"
                  />
                  <span>Bestsellers (Les plus désirés)</span>
                </label>
                <label className="flex items-center gap-2.5 text-xs text-[#C7CCD1] hover:text-white cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={onlyInStock}
                    onChange={(e) => {
                      setOnlyInStock(e.target.checked);
                      setCurrentPage(1);
                    }}
                    className="w-4 h-4 rounded-xs border-white/20 bg-[#0D182E] text-[#D9C2A3] focus:ring-0 cursor-pointer"
                  />
                  <span>En stock immédiat</span>
                </label>
              </div>
            </div>
          </aside>

          {/* ---------------------------------------------------- */}
          {/* ZONE PRINCIPALE DROITE : CATALOGUE & GRILLE           */}
          {/* ---------------------------------------------------- */}
          <main className="lg:col-span-9 space-y-6">
            {/* Barre Supérieure : Compteur & Sélecteur de Tri */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <span className="text-xs text-[#8E95A5]">
                Affichage de <strong className="text-white">{paginatedProduits.length}</strong> sur{' '}
                <strong className="text-white">{filteredProduits.length}</strong> créations
              </span>

              <div className="flex items-center gap-3">
                <span className="text-xs text-[#8E95A5] whitespace-nowrap">Trier par :</span>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value as any);
                    setCurrentPage(1);
                  }}
                  className="bg-[#0D182E] border border-white/15 text-white text-xs rounded-full px-4 py-2 focus:outline-none focus:border-[#D9C2A3] cursor-pointer"
                >
                  <option value="default">Par défaut (Collection)</option>
                  <option value="price-asc">Prix : Moins cher d'abord</option>
                  <option value="price-desc">Prix : Plus cher d'abord</option>
                  <option value="rating">Meilleures évaluations</option>
                </select>
              </div>
            </div>

            {/* Pilules de filtres actifs (Active Filter Tags) */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[11px] uppercase tracking-wider text-[#8E95A5] mr-1">
                  Filtres actifs :
                </span>

                {maxPrice < 150000 && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#14294A] border border-white/10 text-xs text-white">
                    <span>Max {formatPrix(maxPrice)}</span>
                    <button
                      type="button"
                      onClick={() => setMaxPrice(150000)}
                      className="text-white/60 hover:text-white cursor-pointer"
                    >
                      <Icon icon={faXmark} className="text-[10px]" />
                    </button>
                  </span>
                )}

                {onlyBestsellers && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#14294A] border border-white/10 text-xs text-white">
                    <span>Bestsellers</span>
                    <button
                      type="button"
                      onClick={() => setOnlyBestsellers(false)}
                      className="text-white/60 hover:text-white cursor-pointer"
                    >
                      <Icon icon={faXmark} className="text-[10px]" />
                    </button>
                  </span>
                )}

                {onlyInStock && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#14294A] border border-white/10 text-xs text-white">
                    <span>En stock</span>
                    <button
                      type="button"
                      onClick={() => setOnlyInStock(false)}
                      className="text-white/60 hover:text-white cursor-pointer"
                    >
                      <Icon icon={faXmark} className="text-[10px]" />
                    </button>
                  </span>
                )}

                {selectedCategories.map((cat) => (
                  <span
                    key={cat}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#14294A] border border-white/10 text-xs text-white"
                  >
                    <span>{cat}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedCategories((prev) => prev.filter((c) => c !== cat))}
                      className="text-white/60 hover:text-white cursor-pointer"
                    >
                      <Icon icon={faXmark} className="text-[10px]" />
                    </button>
                  </span>
                ))}

                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="text-xs text-[#D9C2A3] hover:underline ml-2 cursor-pointer"
                >
                  Effacer tout
                </button>
              </div>
            )}

            {/* Grille de 3 colonnes style maquette */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredProduits.length === 0 ? (
              <div className="py-20 text-center bg-[#0D182E] rounded-3xl border border-white/10 p-8 space-y-4">
                <p className="font-sans font-bold text-xl text-white">
                  Aucune création ne correspond à vos filtres.
                </p>
                <p className="text-xs text-[#8E95A5] max-w-sm mx-auto">
                  Modifiez vos critères de sélection pour explorer nos décors et luminaires de fête.
                </p>
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="px-6 py-2.5 rounded-full bg-[#D9C2A3] text-[#080E1A] font-bold text-xs uppercase tracking-wider hover:bg-white transition-colors cursor-pointer"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedProduits.map((produit, index) => {
                  const isWishlisted = wishlist.includes(produit.id);
                  const isDiscounted = index % 3 === 0;
                  const discountPercent = index % 3 === 0 ? (index % 2 === 0 ? 50 : 20) : null;
                  const slashedPrice = isDiscounted ? Math.round(produit.prix * 1.35) : null;

                  return (
                    <div
                      key={produit.id}
                      className="group bg-[#0D182E] border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-white/25 transition-all duration-300 shadow-lg hover:shadow-2xl"
                    >
                      {/* Zone Image avec actions flottantes */}
                      <div className="relative aspect-[4/5] bg-[#0A1222] overflow-hidden">
                        {/* Badge de remise en haut à gauche (style capsule vert/sombre comme sur l'image) */}
                        {discountPercent ? (
                          <div className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-full bg-[#1B3A2B] border border-[#2E5E46] text-[#6EE7B7] text-[11px] font-bold tracking-wide shadow-md">
                            {discountPercent}% OFF
                          </div>
                        ) : produit.populaire ? (
                          <div className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-full bg-[#D9C2A3] text-[#080E1A] text-[10px] font-bold uppercase tracking-wider shadow-md">
                            Bestseller
                          </div>
                        ) : null}

                        {/* Boutons d'action flottants à droite (Favori, Vue rapide, Ajout Panier) */}
                        <div className="absolute top-3 right-3 z-20 flex flex-col gap-2 transition-all duration-300 opacity-90 sm:opacity-0 sm:group-hover:opacity-100">
                          {/* Favori Wishlist */}
                          <button
                            type="button"
                            onClick={(e) => toggleWishlist(produit.id, e)}
                            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors shadow-md cursor-pointer ${
                              isWishlisted
                                ? 'bg-[#C1121F] text-white'
                                : 'bg-black/60 backdrop-blur-md text-white/80 hover:text-white hover:bg-black/80'
                            }`}
                            title="Ajouter aux favoris"
                          >
                            <Icon icon={isWishlisted ? faHeartSolid : faHeartRegular} className="text-xs" />
                          </button>

                          {/* Aperçu rapide */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setQuickViewProduct(produit);
                            }}
                            className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md text-white/80 hover:text-white hover:bg-black/80 flex items-center justify-center transition-colors shadow-md cursor-pointer"
                            title="Aperçu rapide"
                          >
                            <Icon icon={faEye} className="text-xs" />
                          </button>

                          {/* Ajout panier immédiat */}
                          <button
                            type="button"
                            onClick={(e) => handleQuickAdd(produit, e)}
                            className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md text-white/80 hover:text-white hover:bg-black/80 flex items-center justify-center transition-colors shadow-md cursor-pointer"
                            title="Ajouter à ma sélection"
                          >
                            <Icon icon={faBagShopping} className="text-xs" />
                          </button>
                        </div>

                        {/* Image produit ou fallback 4:5 cinématique */}
                        <Link to={`/produit/${produit.slug}`} className="block w-full h-full">
                          {produit.images && produit.images[0] ? (
                            <img
                              src={produit.images[0]}
                              alt={produit.nom}
                              loading="lazy"
                              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                            />
                          ) : (
                            <DiningTableVisual45 subtleLabel={produit.nom} />
                          )}
                        </Link>
                      </div>

                      {/* Informations Produit sous l'image */}
                      <div className="p-5 flex flex-col justify-between flex-1 space-y-3">
                        <div className="space-y-1.5">
                          {/* Ligne Catégorie + Note Étoile */}
                          <div className="flex items-center justify-between text-xs text-[#8E95A5]">
                            <span className="uppercase tracking-widest text-[10px]">
                              {produit.matieres ? produit.matieres.split(',')[0] : 'Édition Minuit'}
                            </span>
                            <div className="flex items-center gap-1 text-amber-400 font-bold text-xs">
                              <Icon icon={faStar} className="text-[10px]" />
                              <span>4.{8 + (index % 3)}</span>
                            </div>
                          </div>

                          {/* Titre du Produit cliquable */}
                          <Link
                            to={`/produit/${produit.slug}`}
                            className="block font-sans font-bold text-base text-white hover:text-[#D9C2A3] transition-colors leading-snug line-clamp-1"
                          >
                            {produit.nom}
                          </Link>
                        </div>

                        {/* Prix : Prix actuel + Prix barré */}
                        <div className="flex items-center justify-between pt-2 border-t border-white/10">
                          <div className="flex items-baseline gap-2">
                            <span className="font-sans font-bold text-base text-white">
                              {formatPrix(produit.prix)}
                            </span>
                            {slashedPrice && (
                              <span className="font-mono text-xs text-[#8E95A5] line-through">
                                {formatPrix(slashedPrice)}
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={(e) => handleQuickAdd(produit, e)}
                            className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
                            title="Ajouter à ma sélection"
                          >
                            <Icon icon={faBagShopping} className="text-xs" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination Style Moderne : < 1 2 3 ... 10 > */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-8">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-xs text-white/70 hover:text-white hover:border-white/30 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                >
                  <Icon icon={faChevronLeft} />
                </button>

                {Array.from({ length: totalPages }).map((_, i) => {
                  const pageNum = i + 1;
                  const isActive = currentPage === pageNum;
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-full font-bold text-xs transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-white text-[#080E1A] shadow-md'
                          : 'border border-white/15 text-white/70 hover:text-white hover:border-white/30'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-xs text-white/70 hover:text-white hover:border-white/30 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                >
                  <Icon icon={faChevronRight} />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. BARRE DE RÉASSURANCE EN BAS DE PAGE (Style référence) */}
      {/* ======================================================== */}
      <div className="border-t border-white/10 bg-[#0A1222] py-10 sm:py-12 mt-12">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Colonne 1 : Livraison */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#0D182E] border border-white/10">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#D9C2A3] shrink-0">
                <Icon icon={faTruckFast} className="text-base" />
              </div>
              <div>
                <h3 className="font-sans font-bold text-sm text-white">Livraison Réveillon</h3>
                <p className="text-xs text-[#8E95A5] mt-0.5">Expédition suivie garantie avant le 31</p>
              </div>
            </div>

            {/* Colonne 2 : Paiement Flexible */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#0D182E] border border-white/10">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#D9C2A3] shrink-0">
                <Icon icon={faCreditCard} className="text-base" />
              </div>
              <div>
                <h3 className="font-sans font-bold text-sm text-white">Paiement Flexible</h3>
                <p className="text-xs text-[#8E95A5] mt-0.5">Paiement sécurisé ou à la livraison</p>
              </div>
            </div>

            {/* Colonne 3 : Support Dédié */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#0D182E] border border-white/10">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#D9C2A3] shrink-0">
                <Icon icon={faHeadset} className="text-base" />
              </div>
              <div>
                <h3 className="font-sans font-bold text-sm text-white">Conciergerie 7j/7</h3>
                <p className="text-xs text-[#8E95A5] mt-0.5">Conseils scénographiques en continu</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. MODALE APERÇU RAPIDE (QUICKVIEW)                      */}
      {/* ======================================================== */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setQuickViewProduct(null)}
          />
          <div className="relative z-10 w-full max-w-2xl bg-[#0D182E] border border-white/15 rounded-3xl p-6 sm:p-8 overflow-hidden shadow-2xl space-y-6">
            <button
              type="button"
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
            >
              <Icon icon={faXmark} className="text-sm" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-[#0A1222]">
                {quickViewProduct.images && quickViewProduct.images[0] ? (
                  <img
                    src={quickViewProduct.images[0]}
                    alt={quickViewProduct.nom}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <DiningTableVisual45 subtleLabel={quickViewProduct.nom} />
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#D9C2A3] font-mono">
                    Aperçu express
                  </span>
                  <h3 className="font-sans font-bold text-2xl text-white mt-1">
                    {quickViewProduct.nom}
                  </h3>
                  <p className="font-sans font-bold text-xl text-white mt-2">
                    {formatPrix(quickViewProduct.prix)}
                  </p>
                </div>

                <p className="text-xs text-[#C7CCD1] leading-relaxed">
                  {quickViewProduct.description_courte || quickViewProduct.accroche}
                </p>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      handleQuickAdd(quickViewProduct, e);
                      setQuickViewProduct(null);
                    }}
                    className="flex-1 py-3 px-5 rounded-full bg-[#D9C2A3] text-[#080E1A] font-bold text-xs uppercase tracking-wider hover:bg-white transition-colors cursor-pointer"
                  >
                    Ajouter à ma sélection
                  </button>
                  <Link
                    to={`/produit/${quickViewProduct.slug}`}
                    className="py-3 px-5 rounded-full border border-white/20 text-white hover:border-white text-xs uppercase tracking-wider font-semibold transition-colors flex items-center justify-center"
                  >
                    Voir la fiche
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. DRAWER MOBILE DE FILTRES                              */}
      {/* ======================================================== */}
      {isMobileFilterOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex items-end">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="relative z-10 w-full bg-[#0D182E] border-t border-white/15 p-6 rounded-t-3xl max-h-[85vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="font-sans font-bold text-lg text-white">Options de Filtres</h3>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white"
              >
                <Icon icon={faXmark} className="text-sm" />
              </button>
            </div>

            {/* Univers mobile */}
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-widest text-[#8E95A5] font-semibold">
                Univers
              </span>
              <div className="grid grid-cols-2 gap-2">
                {univers.map((u) => {
                  const isChecked = selectedUnivers.includes(u.id);
                  return (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => {
                        setSelectedUnivers((prev) =>
                          isChecked ? prev.filter((id) => id !== u.id) : [...prev, u.id]
                        );
                      }}
                      className={`p-2.5 rounded-xl border text-xs text-left transition-colors ${
                        isChecked
                          ? 'bg-[#14294A] border-[#D9C2A3] text-white font-medium'
                          : 'border-white/10 text-[#C7CCD1]'
                      }`}
                    >
                      {u.nom}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Boutons actions mobile */}
            <div className="pt-4 border-t border-white/10 flex gap-3">
              <button
                type="button"
                onClick={resetAllFilters}
                className="w-1/2 py-3 rounded-full border border-white/20 text-xs uppercase tracking-wider text-[#C7CCD1]"
              >
                Réinitialiser
              </button>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-1/2 py-3 rounded-full bg-[#D9C2A3] text-[#080E1A] font-bold text-xs uppercase tracking-wider"
              >
                Voir ({filteredProduits.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
