import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { m, AnimatePresence, useScroll, useSpring, useMotionValueEvent } from 'framer-motion';
import {
  faMagnifyingGlass,
  faUser,
  faCartShopping,
  faXmark,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import { useCart } from '../../context/CartContext';
import { SEED_UNIVERS, SEED_PRODUITS } from '../../data/seed';
import { Icon } from '../common/Icon';
import { formatPrix } from '../../config';
import { useLenis } from '../../motion/context/LenisContext';
import { MOTION_EASINGS } from '../../motion/tokens';

export const Header: React.FC = () => {
  const { totalCount, toggleDrawer } = useCart();
  const { stop: stopLenis, start: startLenis } = useLenis();
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const { scrollY, scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 40);
    const diff = latest - lastScrollY.current;
    if (latest > 100 && diff > 8) {
      setIsHidden(true);
    } else if (diff < -8) {
      setIsHidden(false);
    }
    lastScrollY.current = latest;
  });

  const isTransparent = false;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Bloquer le scroll et Lenis quand le menu est ouvert
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      stopLenis();
    } else {
      document.body.style.overflow = '';
      startLenis();
    }
    return () => {
      document.body.style.overflow = '';
      startLenis();
    };
  }, [isMobileMenuOpen, stopLenis, startLenis]);

  // Fermer la recherche instantanée au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // Filtrage instantané des produits
  const searchResults = searchQuery.trim()
    ? SEED_PRODUITS.filter((p) =>
        `${p.nom} ${p.accroche || ''} ${p.matieres || ''}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase().trim())
      ).slice(0, 5)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
      navigate(`/boutique?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <m.header
        animate={{ y: isHidden ? '-100%' : '0%' }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 w-full h-16 sm:h-18 transition-colors duration-300 ${
          isTransparent
            ? 'bg-transparent border-b border-white/10 text-white'
            : 'bg-white/95 backdrop-blur-md border-b border-gray-200/90 text-[#000000] shadow-xs'
        }`}
      >
        <div className="max-w-[1240px] mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-3 sm:gap-6">
          {/* ========================================================= */}
          {/* SECTION GAUCHE : LOGO BULLSEYE + MENU BURGER               */}
          {/* ========================================================= */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Logo Bullseye Concentrique */}
            <Link
              to="/"
              onClick={closeMobileMenu}
              className="flex items-center justify-center shrink-0 group transition-transform hover:scale-105"
              title="Maison Minuit — Accueil"
              aria-label="Maison Minuit — Accueil"
            >
              <svg
                width="30"
                height="30"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`shrink-0 transition-colors ${isTransparent ? 'text-white' : 'text-[#000000]'}`}
              >
                <circle cx="16" cy="16" r="13.5" stroke="currentColor" strokeWidth="3" />
                <circle cx="16" cy="16" r="7.5" fill="currentColor" />
              </svg>
            </Link>

            {/* Menu Hamburger 3 barres horizontales */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`flex flex-col items-center justify-center gap-1.5 w-8 h-8 cursor-pointer transition-opacity shrink-0 ${
                isTransparent ? 'text-white hover:opacity-80' : 'text-[#000000] hover:opacity-75'
              }`}
              aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            >
              <span className={`w-6 h-[2.5px] rounded-full transition-colors ${isTransparent ? 'bg-white' : 'bg-[#000000]'}`} />
              <span className={`w-6 h-[2.5px] rounded-full transition-colors ${isTransparent ? 'bg-white' : 'bg-[#000000]'}`} />
              <span className={`w-6 h-[2.5px] rounded-full transition-colors ${isTransparent ? 'bg-white' : 'bg-[#000000]'}`} />
            </button>
          </div>

          {/* ========================================================= */}
          {/* SECTION CENTRALE : BARRE DE RECHERCHE OVALE CAPSULE        */}
          {/* ========================================================= */}
          <div ref={searchContainerRef} className="relative flex-1 max-w-2xl mx-1 sm:mx-4">
            <form onSubmit={handleSearchSubmit}>
              <div
                className={`relative flex items-center justify-center w-full h-10 sm:h-11 px-4 sm:px-6 rounded-full border transition-all shadow-xs ${
                  isTransparent
                    ? 'border-white/20 bg-black/30 backdrop-blur-md text-white focus-within:border-white/50'
                    : 'border-gray-300 hover:border-gray-400 focus-within:border-gray-500 bg-white text-gray-800'
                }`}
              >
                <Icon
                  icon={faMagnifyingGlass}
                  className={`text-sm mr-2 sm:mr-3 shrink-0 ${isTransparent ? 'text-white/70' : 'text-gray-400'}`}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchFocused(true);
                  }}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder="search"
                  className={`w-full bg-transparent text-sm font-normal focus:outline-none ${
                    isTransparent ? 'text-white placeholder-white/60' : 'text-gray-800 placeholder-gray-500'
                  }`}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setIsSearchFocused(false);
                    }}
                    className={`p-1 text-xs cursor-pointer ml-1 ${isTransparent ? 'text-white/70 hover:text-white' : 'text-gray-400 hover:text-gray-600'}`}
                    aria-label="Effacer la recherche"
                  >
                    <Icon icon={faXmark} />
                  </button>
                )}
              </div>
            </form>

            {/* Dropdown interactif des suggestions de recherche */}
            {isSearchFocused && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden z-50 animate-fade-in text-gray-900">
                <div className="p-2 border-b border-gray-100 flex items-center justify-between text-xs text-gray-400 px-3">
                  <span>Créations correspondantes</span>
                  <span>{searchResults.length} résultat(s)</span>
                </div>
                <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                  {searchResults.map((p) => (
                    <Link
                      key={p.id}
                      to={`/produit/${p.slug}`}
                      onClick={() => {
                        setIsSearchFocused(false);
                        setSearchQuery('');
                      }}
                      className="p-3 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                        {p.images && p.images[0] ? (
                          <img src={p.images[0]} alt={p.nom} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[10px] text-gray-400">Minuit</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold text-gray-900 truncate">{p.nom}</h4>
                        <p className="text-[11px] text-gray-500 truncate">{p.accroche}</p>
                      </div>
                      <span className="text-xs font-bold text-gray-900 shrink-0">
                        {formatPrix(p.prix)}
                      </span>
                    </Link>
                  ))}
                </div>
                <div className="p-2.5 bg-gray-50 border-t border-gray-100 text-center">
                  <Link
                    to="/boutique"
                    onClick={() => {
                      setIsSearchFocused(false);
                      setSearchQuery('');
                    }}
                    className="text-xs font-semibold text-[#000000] hover:underline"
                  >
                    Voir tout le catalogue de réveillon →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* ========================================================= */}
          {/* SECTION DROITE : ICÔNES COMPTE + PANIER                    */}
          {/* ========================================================= */}
          <div className="flex items-center gap-4 sm:gap-6 shrink-0">
            {/* Profil / Compte silhouette utilisateur */}
            <Link
              to="/commande"
              className={`flex items-center justify-center transition-all shrink-0 ${
                isTransparent ? 'text-white hover:text-[#D9C2A3]' : 'text-[#000000] hover:opacity-75'
              }`}
              title="Mon compte / Ma commande"
              aria-label="Mon compte / Ma commande"
            >
              <Icon icon={faUser} className="text-xl sm:text-2xl" />
            </Link>

            {/* Panier Chariot à roulettes avec badge d'articles */}
            <button
              type="button"
              onClick={toggleDrawer}
              className={`relative flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                isTransparent ? 'text-white hover:text-[#D9C2A3]' : 'text-[#000000] hover:opacity-75'
              }`}
              title="Voir ma sélection"
              aria-label={`Ma sélection, ${totalCount} article(s)`}
            >
              <Icon icon={faCartShopping} className="text-xl sm:text-2xl" />
              {totalCount > 0 && (
                <span
                  className={`absolute -top-1.5 -right-2 min-w-4 h-4 px-1 text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs leading-none ${
                    isTransparent ? 'bg-[#D9C2A3] text-[#080E1A]' : 'bg-[#000000] text-white'
                  }`}
                >
                  {totalCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* 10. SCROLL PROGRESS : Barre champagne de 2px sous le header */}
        <m.div
          style={{ scaleX, transformOrigin: '0%' }}
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D9C2A3] z-50 pointer-events-none"
        />
      </m.header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex">
            {/* Voile sombre d'arrière-plan */}
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
              onClick={closeMobileMenu}
            />

            {/* Panneau de navigation coulissant avec spring token */}
            <m.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', ...MOTION_EASINGS.spring }}
              className="relative z-10 w-full max-w-sm bg-white text-gray-900 h-full flex flex-col justify-between shadow-2xl p-6 overflow-y-auto"
            >
              {/* Haut du menu : Marque & Bouton fermer */}
              <div>
                <div className="flex items-center justify-between pb-5 border-b border-gray-200">
                  <div className="flex items-center gap-2.5">
                    <svg
                      width="26"
                      height="26"
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-[#000000]"
                    >
                      <circle cx="16" cy="16" r="13.5" stroke="currentColor" strokeWidth="3" />
                      <circle cx="16" cy="16" r="7.5" fill="currentColor" />
                    </svg>
                    <span className="font-extrabold text-base tracking-wider text-gray-900 uppercase">
                      Maison Minuit
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={closeMobileMenu}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors cursor-pointer"
                    aria-label="Fermer"
                  >
                    <Icon icon={faXmark} className="text-sm" />
                  </button>
                </div>

                {/* Liens principaux de navigation */}
                <nav className="py-6 space-y-4 font-sans text-base font-medium text-gray-800">
                  <Link
                    to="/"
                    onClick={closeMobileMenu}
                    className="block hover:text-[#000000] hover:translate-x-1 transition-all py-1"
                  >
                    Accueil
                  </Link>
                  <Link
                    to="/boutique"
                    onClick={closeMobileMenu}
                    className="block hover:text-[#000000] hover:translate-x-1 transition-all py-1"
                  >
                    La Boutique
                  </Link>
                  <Link
                    to="/univers"
                    onClick={closeMobileMenu}
                    className="block hover:text-[#000000] hover:translate-x-1 transition-all py-1"
                  >
                    Les 6 Univers de Réveillon
                  </Link>

                  {/* Sous-liens des 6 univers */}
                  <div className="pl-4 space-y-2 border-l-2 border-gray-100 my-2">
                    {SEED_UNIVERS.map((u) => (
                      <Link
                        key={u.id}
                        to={`/univers/${u.slug}`}
                        onClick={closeMobileMenu}
                        className="block text-xs text-gray-600 hover:text-[#000000] py-1"
                      >
                        {u.nom}
                      </Link>
                    ))}
                  </div>

                  <Link
                    to="/inspirations"
                    onClick={closeMobileMenu}
                    className="block hover:text-[#000000] hover:translate-x-1 transition-all py-1"
                  >
                    Carnet d’Inspirations
                  </Link>
                  <Link
                    to="/atelier"
                    onClick={closeMobileMenu}
                    className="block hover:text-[#000000] hover:translate-x-1 transition-all py-1"
                  >
                    L’Atelier Sur-Mesure
                  </Link>
                  <Link
                    to="/aide"
                    onClick={closeMobileMenu}
                    className="block hover:text-[#000000] hover:translate-x-1 transition-all py-1"
                  >
                    Aide &amp; Conseils
                  </Link>
                </nav>
              </div>

              {/* Pied du menu : Accès direct au panier & réveillon */}
              <div className="pt-6 border-t border-gray-200 space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    closeMobileMenu();
                    toggleDrawer();
                  }}
                  className="w-full py-3.5 px-5 bg-[#000000] hover:bg-[#1f2937] text-white text-xs font-bold uppercase tracking-wider rounded-full flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
                >
                  <span>Accéder à ma sélection</span>
                  {totalCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-white text-[#000000] text-[11px] font-extrabold flex items-center justify-center">
                      {totalCount}
                    </span>
                  )}
                  <Icon icon={faArrowRight} className="text-xs ml-1" />
                </button>
                <p className="text-center text-[11px] text-gray-400">
                  Réveillon du 31 décembre 2026
                </p>
              </div>
            </m.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
