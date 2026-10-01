import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  faArrowRight,
  faArrowUpRightFromSquare,
  faChevronLeft,
  faChevronRight,
  faStar,
  faTruckFast,
  faCreditCard,
  faHeadset,
} from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { SEO } from '../components/common/SEO';
import { Icon } from '../components/common/Icon';
import { getArticles } from '../lib/supabase';
import { Article } from '../types';
import { Reveal, RevealText, Stagger, StaggerItem } from '../motion';

// Images d'ambiance et de scénographie sélectionnées
const ARTICLE_IMAGES = [
  'https://images.unsplash.com/photo-1543258103-a62bdc069871?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1507499739999-097706ad8914?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
];

const ARTICLE_METAS = [
  { tag: 'Guide', cat: 'Art de la table', date: '15 Déc 2026', readTime: '6 min', rating: '4.95' },
  { tag: 'Nouveau', cat: 'Candélabres', date: '14 Déc 2026', readTime: '5 min', rating: '4.96' },
  { tag: 'Coup de Cœur', cat: 'Pénombre & Or', date: '12 Déc 2026', readTime: '8 min', rating: '5.00' },
  { tag: 'Essai', cat: 'Salon Doré', date: '11 Déc 2026', readTime: '7 min', rating: '4.88' },
  { tag: 'Matières', cat: 'Grès & Verre', date: '10 Déc 2026', readTime: '4 min', rating: '4.92' },
  { tag: 'Rituel', cat: 'Entrée & Façade', date: '09 Déc 2026', readTime: '5 min', rating: '4.90' },
  { tag: 'Temps', cat: 'Compte à Rebours', date: '08 Déc 2026', readTime: '6 min', rating: '4.94' },
  { tag: 'Miroirs', cat: 'Scénographie', date: '07 Déc 2026', readTime: '9 min', rating: '4.98' },
  { tag: 'Sérénité', cat: '1er Janvier', date: '06 Déc 2026', readTime: '5 min', rating: '4.85' },
];

const FILTER_TABS = ['Tous', 'Art de la table', 'Candélabres', 'Salon Doré', 'Rituels', 'Pénombre'];

export const InspirationsList: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [activeTab, setActiveTab] = useState<string>('Tous');
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 8;

  useEffect(() => {
    getArticles()
      .then((data) => setArticles(data))
      .finally(() => setLoading(false));
  }, []);

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredArticles = useMemo(() => {
    if (activeTab === 'Tous') return articles;
    return articles.filter((art, idx) => {
      const meta = ARTICLE_METAS[idx % ARTICLE_METAS.length];
      return (
        meta.cat.toLowerCase().includes(activeTab.toLowerCase()) ||
        art.titre.toLowerCase().includes(activeTab.toLowerCase())
      );
    });
  }, [articles, activeTab]);

  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage) || 1;
  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredArticles.slice(start, start + itemsPerPage);
  }, [filteredArticles, currentPage]);

  return (
    <div className="bg-[#080E1A] text-[#E8ECEF] min-h-screen selection:bg-[#D9C2A3] selection:text-[#080E1A]">
      <SEO
        title="Inspirations & Gestes — Maison Minuit"
        description="Essais, conseils d'agencement et rituels pour préparer la nuit du 31 décembre 2026."
      />

      {/* ======================================================== */}
      {/* 1. EN-TÊTE ÉPURÉ AVEC BREADCRUMB                         */}
      {/* ======================================================== */}
      <div className="relative py-12 sm:py-16 border-b border-white/10 overflow-hidden bg-[#0A1222]">
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
          <RevealText
            as="h1"
            text="Le Carnet d'Inspirations"
            className="font-sans font-bold text-3xl sm:text-5xl tracking-tight text-white"
          />
          <nav className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-[#8E95A5]">
            <Link to="/" className="hover:text-white transition-colors">
              Accueil
            </Link>
            <span>/</span>
            <span className="text-[#D9C2A3]">Inspirations</span>
          </nav>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. SECTION CARDS STYLE VIBEVAULT : "BY TYPE"             */}
      {/* ======================================================== */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* En-tête de section avec onglets capsules horizontaux */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-white/10">
          <div>
            <Reveal direction="down" distance={10}>
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#D9C2A3] font-mono block mb-2">
                ✦ ÉDITIONS & RITUELS DE MINUIT
              </span>
            </Reveal>
            <RevealText
              as="h2"
              text="Explorer les Récits Par Thème"
              className="font-sans font-black text-2xl sm:text-4xl text-white tracking-tight"
            />
          </div>

          {/* Onglets capsules */}
          <div className="flex flex-wrap items-center gap-2">
            {FILTER_TABS.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-[#080E1A] shadow-md'
                      : 'bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grille de Cards style VibeVault (4 colonnes) */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-[#0B1528] border border-white/10 rounded-[28px] p-4 h-[420px] animate-pulse"
              />
            ))}
          </div>
        ) : (
          <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {paginatedArticles.map((article, index) => {
              const meta = ARTICLE_METAS[index % ARTICLE_METAS.length];
              const imageSrc =
                article.image_url || ARTICLE_IMAGES[index % ARTICLE_IMAGES.length];
              const isWishlisted = wishlist.includes(article.id);
              // La 3ème carte adopte la variante mise en avant (comme "Frost Bite Grillz" dans la maquette)
              const isSpecialHighlight = index === 2;

              if (isSpecialHighlight) {
                return (
                  <StaggerItem key={article.id}>
                    <div
                      className="group bg-[#0B1528] border border-white/15 rounded-[28px] p-5 flex flex-col justify-between hover:border-[#D9C2A3]/50 transition-all duration-300 shadow-xl relative overflow-hidden h-full"
                    >
                    {/* En-tête spécial de la carte mise en avant */}
                    <div className="space-y-3 z-10">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#E5A93C] text-[#080E1A] font-bold text-[10px] uppercase tracking-wider">
                          {meta.tag}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full border border-white/20 text-[#C7CCD1] text-[10px] uppercase tracking-wider">
                          {meta.cat}
                        </span>
                      </div>

                      <Link
                        to={`/inspirations/${article.slug}`}
                        className="block font-sans font-bold text-lg text-white group-hover:text-[#D9C2A3] transition-colors line-clamp-2 leading-snug"
                      >
                        {article.titre}
                      </Link>
                    </div>

                    {/* Visuel central */}
                    <Link
                      to={`/inspirations/${article.slug}`}
                      className="block aspect-[4/3.8] rounded-2xl overflow-hidden my-4 relative"
                    >
                      <img
                        src={imageSrc}
                        alt={article.titre}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                    </Link>

                    {/* Barre d'action basse : Bouton large "LIRE L'ESSAI →" + Coeur */}
                    <div className="flex items-center gap-2.5 z-10 pt-1">
                      <Link
                        to={`/inspirations/${article.slug}`}
                        className="flex-1 py-2.5 px-4 rounded-full bg-white text-[#080E1A] hover:bg-[#D9C2A3] transition-colors font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md"
                      >
                        <span>LIRE L'ARTICLE</span>
                        <Icon icon={faArrowRight} className="text-[10px]" />
                      </Link>

                      <button
                        type="button"
                        onClick={(e) => toggleWishlist(article.id, e)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center border transition-colors shadow-sm cursor-pointer ${
                          isWishlisted
                            ? 'bg-[#C1121F] border-[#C1121F] text-white'
                            : 'border-white/20 bg-white/5 text-white/80 hover:text-white hover:border-white/40'
                        }`}
                        title="Sauvegarder"
                      >
                        <Icon icon={isWishlisted ? faHeartSolid : faHeartRegular} className="text-xs" />
                      </button>
                    </div>
                  </div>
                </StaggerItem>
              );
            }

            // Cartes standard (Modèle 1, 2, 4 du design de référence)
            return (
              <StaggerItem key={article.id}>
                <div
                  className="group bg-[#0B1528] border border-white/10 rounded-[28px] p-4 flex flex-col justify-between hover:border-white/25 transition-all duration-300 shadow-xl h-full"
                >
                  {/* Zone Visuelle avec boutons ronds supérieurs ↗ et ♡ */}
                  <div className="relative aspect-[4/4.2] rounded-2xl overflow-hidden bg-[#070D18]">
                    {/* Bouton rond diagonal ↗ en haut à gauche */}
                    <Link
                      to={`/inspirations/${article.slug}`}
                      className="absolute top-3 left-3 z-20 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/80 transition-all shadow-md"
                      title="Lire cet article"
                    >
                      <Icon icon={faArrowUpRightFromSquare} className="text-[10px]" />
                    </Link>

                    {/* Bouton rond favori ♡ en haut à droite */}
                    <button
                      type="button"
                      onClick={(e) => toggleWishlist(article.id, e)}
                      className={`absolute top-3 right-3 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-md cursor-pointer ${
                        isWishlisted
                          ? 'bg-[#C1121F] text-white'
                          : 'bg-black/60 backdrop-blur-md border border-white/10 text-white/80 hover:text-white hover:bg-black/80'
                      }`}
                      title="Ajouter aux favoris"
                    >
                      <Icon icon={isWishlisted ? faHeartSolid : faHeartRegular} className="text-[11px]" />
                    </button>

                    {/* Image avec zoom doux */}
                    <Link to={`/inspirations/${article.slug}`} className="block w-full h-full">
                      <img
                        src={imageSrc}
                        alt={article.titre}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                    </Link>
                  </div>

                  {/* Section informations sous l'image */}
                  <div className="pt-3.5 space-y-2 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      {/* Ligne des badges capsules (highlight + outline) */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2 py-0.5 rounded-full bg-[#E5A93C] text-[#080E1A] font-bold text-[9px] uppercase tracking-wider">
                          {meta.tag}
                        </span>
                        <span className="px-2 py-0.5 rounded-full border border-white/20 text-[#C7CCD1] text-[9px] uppercase tracking-wider">
                          {meta.cat}
                        </span>
                      </div>

                      {/* Titre en gras sans-serif */}
                      <Link
                        to={`/inspirations/${article.slug}`}
                        className="block font-sans font-bold text-sm sm:text-base text-white group-hover:text-[#D9C2A3] transition-colors leading-snug line-clamp-1"
                      >
                        {article.titre}
                      </Link>

                      {/* Extrait majuscule / épuré */}
                      <p className="text-[10px] text-[#8E95A5] uppercase tracking-wider line-clamp-2 leading-relaxed">
                        {article.extrait}
                      </p>
                    </div>

                    {/* Ligne inférieure : Date/Lecture + Note étoiles */}
                    <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                      <span className="font-sans font-bold text-xs text-white">
                        {meta.date}
                      </span>
                      <div className="flex items-center gap-1 text-amber-400 font-bold text-xs">
                        <Icon icon={faStar} className="text-[10px]" />
                        <span>{meta.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </StaggerItem>
              );
            })}
          </Stagger>
        )}

        {/* ======================================================== */}
        {/* 3. PAGINATION STYLE VIBEVAULT : "1/3" + FLECHES          */}
        {/* ======================================================== */}
        <div className="flex items-center justify-between pt-10 border-t border-white/10 mt-12">
          <span className="text-xs uppercase tracking-widest text-[#8E95A5] font-mono">
            {currentPage} / {totalPages}
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-xs text-white/70 hover:text-white hover:border-white/30 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              title="Page précédente"
            >
              <Icon icon={faChevronLeft} />
            </button>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-xs text-white/70 hover:text-white hover:border-white/30 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              title="Page suivante"
            >
              <Icon icon={faChevronRight} />
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. BARRE DE RÉASSURANCE EN BAS DE PAGE                  */}
      {/* ======================================================== */}
      <div className="border-t border-white/10 bg-[#0A1222] py-10 sm:py-12">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <StaggerItem>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#0D182E] border border-white/10 h-full">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#E5A93C] shrink-0">
                  <Icon icon={faTruckFast} className="text-base" />
                </div>
                <div>
                  <h3 className="font-sans font-bold text-sm text-white">Livraison Réveillon</h3>
                  <p className="text-xs text-[#8E95A5] mt-0.5">Expédition suivie garantie avant le 31</p>
                </div>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#0D182E] border border-white/10 h-full">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#E5A93C] shrink-0">
                  <Icon icon={faCreditCard} className="text-base" />
                </div>
                <div>
                  <h3 className="font-sans font-bold text-sm text-white">Paiement Flexible</h3>
                  <p className="text-xs text-[#8E95A5] mt-0.5">Paiement sécurisé ou à la livraison</p>
                </div>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#0D182E] border border-white/10 h-full">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#E5A93C] shrink-0">
                  <Icon icon={faHeadset} className="text-base" />
                </div>
                <div>
                  <h3 className="font-sans font-bold text-sm text-white">Conciergerie 7j/7</h3>
                  <p className="text-xs text-[#8E95A5] mt-0.5">Conseils scénographiques en continu</p>
                </div>
              </div>
            </StaggerItem>
          </Stagger>
        </div>
      </div>
    </div>
  );
};
