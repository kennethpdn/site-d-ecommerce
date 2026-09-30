import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  faBars,
  faXmark,
  faBagShopping,
  faChevronDown,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import { faCircleQuestion as faCircleQuestionRegular } from '@fortawesome/free-regular-svg-icons';
import { useCart } from '../../context/CartContext';
import { SEED_UNIVERS } from '../../data/seed';
import { Icon } from '../common/Icon';

export const Header: React.FC = () => {
  const { totalCount, toggleDrawer } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUniversDropdownOpen, setIsUniversDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY >= 40);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full h-16 md:h-20 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#060F1F]/85 backdrop-blur-[12px] border-b border-[#C7CCD1]/20 shadow-lg'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-[1200px] mx-auto h-full px-5 md:px-8 flex items-center justify-between">
          {/* Zone 1 : Marque */}
          <div className="flex items-center gap-4">
            <Link
              to="/"
              onClick={closeMobileMenu}
              className="font-display text-2xl md:text-3xl font-medium tracking-tight text-[#E8ECEF] hover:text-[#D9C2A3] transition-colors whitespace-nowrap"
            >
              Maison Minuit
            </Link>
          </div>

          {/* Zone 2 : Liens de navigation bureau */}
          <nav className="hidden lg:flex items-center gap-8 text-xs uppercase tracking-[0.18em] font-sans font-medium text-[#C7CCD1]">
            {/* Univers avec menu déroulant élégant */}
            <div
              className="relative py-4"
              onMouseEnter={() => setIsUniversDropdownOpen(true)}
              onMouseLeave={() => setIsUniversDropdownOpen(false)}
            >
              <Link
                to="/univers"
                className="flex items-center gap-1.5 hover:text-[#E8ECEF] transition-colors"
              >
                <span>Univers</span>
                <Icon
                  icon={faChevronDown}
                  className={`text-[9px] transition-transform duration-200 ${
                    isUniversDropdownOpen ? 'rotate-180 text-[#D9C2A3]' : ''
                  }`}
                />
              </Link>

              {/* Menu déroulant des 6 univers */}
              {isUniversDropdownOpen && (
                <div className="absolute top-full left-0 w-64 bg-[#060F1F] border border-argent-20 shadow-2xl p-3 z-50">
                  <div className="space-y-1">
                    {SEED_UNIVERS.map((u) => (
                      <Link
                        key={u.id}
                        to={`/univers/${u.slug}`}
                        onClick={() => setIsUniversDropdownOpen(false)}
                        className="block px-3 py-2 text-xs text-[#C7CCD1] hover:text-[#D9C2A3] hover:bg-[#14294A]/40 transition-colors uppercase tracking-wider"
                      >
                        {u.nom}
                      </Link>
                    ))}
                    <div className="pt-2 mt-2 border-t border-argent-20">
                      <Link
                        to="/univers"
                        onClick={() => setIsUniversDropdownOpen(false)}
                        className="block px-3 py-1.5 text-[11px] text-[#D9C2A3] uppercase tracking-widest hover:underline"
                      >
                        Tous les univers →
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/boutique"
              className={`hover:text-[#E8ECEF] transition-colors ${
                location.pathname === '/boutique' ? 'text-[#D9C2A3]' : ''
              }`}
            >
              Boutique
            </Link>

            <Link
              to="/inspirations"
              className={`hover:text-[#E8ECEF] transition-colors ${
                location.pathname.startsWith('/inspirations') ? 'text-[#D9C2A3]' : ''
              }`}
            >
              Inspirations
            </Link>

            <Link
              to="/atelier"
              className={`hover:text-[#E8ECEF] transition-colors ${
                location.pathname === '/atelier' ? 'text-[#D9C2A3]' : ''
              }`}
            >
              L’Atelier
            </Link>
          </nav>

          {/* Zone 3 : Actions principales */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/aide"
              className="hidden sm:flex items-center gap-2 text-xs uppercase tracking-widest text-[#C7CCD1] hover:text-[#E8ECEF] px-2 py-1 transition-colors"
              title="Centre d'aide"
            >
              <Icon icon={faCircleQuestionRegular} className="text-sm text-[#D9C2A3]/90" />
              <span className="hidden md:inline">Aide</span>
            </Link>

            {/* Bouton « Ma sélection » : pastille champagne UNIQUEMENT si supérieur à 0 */}
            <button
              type="button"
              onClick={toggleDrawer}
              className="relative inline-flex items-center gap-2.5 px-3 sm:px-4 py-2 bg-[#14294A] border border-argent-20 hover:border-[#D9C2A3] transition-colors cursor-pointer group"
              aria-label={`Ma sélection, ${totalCount} article(s)`}
            >
              <Icon icon={faBagShopping} className="text-xs text-[#D9C2A3]" />
              <span className="hidden sm:inline text-xs uppercase tracking-wider text-[#E8ECEF]">
                Ma Sélection
              </span>
              {totalCount > 0 && (
                <span className="font-mono text-[11px] font-semibold text-[#060F1F] bg-[#D9C2A3] px-1.5 py-0.5 rounded-xs tabular-nums leading-none">
                  {totalCount}
                </span>
              )}
            </button>

            {/* Burger mobile */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center border border-argent-20 text-[#E8ECEF] hover:text-[#D9C2A3] hover:border-[#D9C2A3] transition-colors cursor-pointer"
              aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            >
              <Icon icon={isMobileMenuOpen ? faXmark : faBars} className="text-base" />
            </button>
          </div>
        </div>
      </header>

      {/* Menu mobile plein écran */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 z-30 bg-[#060F1F] flex flex-col justify-between p-6 overflow-y-auto">
          <div className="space-y-6 pt-4">
            <div className="space-y-4">
              <span className="block text-[11px] uppercase tracking-[0.25em] text-[#D9C2A3]">
                Navigation
              </span>
              <div className="flex flex-col space-y-3 font-display text-2xl text-[#E8ECEF]">
                <Link to="/" onClick={closeMobileMenu} className="hover:text-[#D9C2A3]">
                  Accueil
                </Link>
                <Link to="/boutique" onClick={closeMobileMenu} className="hover:text-[#D9C2A3]">
                  La Boutique
                </Link>
                <Link to="/univers" onClick={closeMobileMenu} className="hover:text-[#D9C2A3]">
                  Les 6 Univers
                </Link>
                <div className="pl-4 space-y-2 border-l border-argent-20/40 my-2">
                  {SEED_UNIVERS.map((u) => (
                    <Link
                      key={u.id}
                      to={`/univers/${u.slug}`}
                      onClick={closeMobileMenu}
                      className="block text-base font-sans text-[#C7CCD1] hover:text-[#D9C2A3]"
                    >
                      {u.nom}
                    </Link>
                  ))}
                </div>
                <Link to="/inspirations" onClick={closeMobileMenu} className="hover:text-[#D9C2A3]">
                  Inspirations
                </Link>
                <Link to="/atelier" onClick={closeMobileMenu} className="hover:text-[#D9C2A3]">
                  L’Atelier
                </Link>
                <Link to="/aide" onClick={closeMobileMenu} className="hover:text-[#D9C2A3]">
                  Aide & Conseils
                </Link>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-argent-20 space-y-4">
            <button
              type="button"
              onClick={() => {
                closeMobileMenu();
                toggleDrawer();
              }}
              className="w-full py-3.5 px-4 bg-[#E8ECEF] text-[#0B1B33] text-xs font-medium uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <span>Accéder à ma sélection</span>
              {totalCount > 0 && (
                <span className="font-mono text-xs font-bold text-[#060F1F] bg-[#D9C2A3] px-1.5 py-0.5 rounded-xs tabular-nums">
                  {totalCount}
                </span>
              )}
              <Icon icon={faArrowRight} className="text-xs ml-1" />
            </button>
            <p className="text-center text-[11px] text-[#C7CCD1]/60 uppercase tracking-widest">
              Réveillon du 31 décembre 2026
            </p>
          </div>
        </div>
      )}
    </>
  );
};
