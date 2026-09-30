import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  faArrowRight,
  faChevronLeft,
  faChevronRight,
  faTruckFast,
  faCreditCard,
  faHeadset,
} from '@fortawesome/free-solid-svg-icons';
import { SEO } from '../components/common/SEO';
import { Icon } from '../components/common/Icon';
import { getArticles } from '../lib/supabase';
import { Article } from '../types';

// Images d'intérieur et de décors de fête soigneusement sélectionnées
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

const ARTICLE_DATES = [
  '15 Décembre 2026',
  '14 Décembre 2026',
  '12 Décembre 2026',
  '11 Décembre 2026',
  '10 Décembre 2026',
  '09 Décembre 2026',
  '08 Décembre 2026',
  '07 Décembre 2026',
  '06 Décembre 2026',
];

export const InspirationsList: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getArticles()
      .then((data) => setArticles(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-[#080E1A] text-[#E8ECEF] min-h-screen selection:bg-[#D9C2A3] selection:text-[#080E1A]">
      <SEO
        title="Inspirations & Gestes — Maison Minuit"
        description="Essais, conseils d'agencement et rituels pour préparer la nuit du 31 décembre 2026."
      />

      {/* ======================================================== */}
      {/* 1. EN-TÊTE ÉPURÉ STYLE BLOG AVEC BREADCRUMB              */}
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
            Le Carnet d'Inspirations
          </h1>
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
      {/* 2. GRILLE 3x3 D'ARTICLES STYLE BLOG MAQUETTE FIGMA       */}
      {/* ======================================================== */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-14 sm:py-20">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-4 animate-pulse">
                <div className="aspect-[16/11] rounded-2xl bg-[#0D182E]" />
                <div className="h-4 w-24 bg-[#0D182E] rounded" />
                <div className="h-6 w-3/4 bg-[#0D182E] rounded" />
                <div className="h-12 w-full bg-[#0D182E] rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {articles.map((article, idx) => {
              const imageSrc =
                article.image_url || ARTICLE_IMAGES[idx % ARTICLE_IMAGES.length];
              const dateText = ARTICLE_DATES[idx % ARTICLE_DATES.length];

              return (
                <article
                  key={article.id}
                  className="group flex flex-col justify-between space-y-4"
                >
                  <Link
                    to={`/inspirations/${article.slug}`}
                    className="block overflow-hidden"
                  >
                    {/* Conteneur Image avec coins arrondis et badge date doré */}
                    <div className="relative aspect-[16/11] rounded-2xl sm:rounded-[22px] overflow-hidden bg-[#0D182E] shadow-lg">
                      <img
                        src={imageSrc}
                        alt={article.titre}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />

                      {/* Badge date doré arrondi en bas au centre comme sur la maquette */}
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 px-4 py-1.5 rounded-full bg-[#E5A93C] text-[#080E1A] font-bold text-xs shadow-md tracking-wide whitespace-nowrap">
                        {dateText}
                      </div>
                    </div>
                  </Link>

                  {/* Textes et lien "Lire l'article" */}
                  <div className="space-y-3 pt-1">
                    <Link
                      to={`/inspirations/${article.slug}`}
                      className="block font-sans font-bold text-lg sm:text-xl text-white group-hover:text-[#D9C2A3] transition-colors leading-snug line-clamp-2"
                    >
                      {article.titre}
                    </Link>

                    <p className="text-xs sm:text-sm text-[#C7CCD1] leading-relaxed line-clamp-2">
                      {article.extrait}
                    </p>

                    <div className="pt-2">
                      <Link
                        to={`/inspirations/${article.slug}`}
                        className="inline-flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-white hover:text-[#D9C2A3] underline underline-offset-4 decoration-white/40 hover:decoration-[#D9C2A3] transition-colors"
                      >
                        <span>Lire l'article</span>
                        <Icon
                          icon={faArrowRight}
                          className="text-[10px] group-hover:translate-x-1 transition-transform"
                        />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* ======================================================== */}
        {/* 3. PAGINATION EN BAS : < 1 2 3 ... 10 >                 */}
        {/* ======================================================== */}
        <div className="flex items-center justify-center gap-2 pt-14 sm:pt-20">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-xs text-white/70 hover:text-white hover:border-white/30 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <Icon icon={faChevronLeft} />
          </button>

          {[1, 2, 3].map((num) => {
            const isActive = currentPage === num;
            return (
              <button
                key={num}
                type="button"
                onClick={() => setCurrentPage(num)}
                className={`w-10 h-10 rounded-full font-bold text-xs transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#E5A93C] text-[#080E1A] shadow-md'
                    : 'border border-white/15 text-white/70 hover:text-white hover:border-white/30'
                }`}
              >
                {num}
              </button>
            );
          })}

          <span className="px-2 text-xs text-white/40">...</span>

          <button
            type="button"
            onClick={() => setCurrentPage(10)}
            className={`w-10 h-10 rounded-full font-bold text-xs transition-colors cursor-pointer ${
              currentPage === 10
                ? 'bg-[#E5A93C] text-[#080E1A] shadow-md'
                : 'border border-white/15 text-white/70 hover:text-white hover:border-white/30'
            }`}
          >
            10
          </button>

          <button
            type="button"
            disabled={currentPage === 10}
            onClick={() => setCurrentPage((p) => Math.min(10, p + 1))}
            className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-xs text-white/70 hover:text-white hover:border-white/30 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <Icon icon={faChevronRight} />
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. BARRE DE RÉASSURANCE EN BAS DE PAGE (Style maquette)  */}
      {/* ======================================================== */}
      <div className="border-t border-white/10 bg-[#0A1222] py-10 sm:py-12">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Colonne 1 : Livraison */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#0D182E] border border-white/10">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#E5A93C] shrink-0">
                <Icon icon={faTruckFast} className="text-base" />
              </div>
              <div>
                <h3 className="font-sans font-bold text-sm text-white">Livraison Réveillon</h3>
                <p className="text-xs text-[#8E95A5] mt-0.5">Expédition suivie garantie avant le 31</p>
              </div>
            </div>

            {/* Colonne 2 : Paiement Flexible */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#0D182E] border border-white/10">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#E5A93C] shrink-0">
                <Icon icon={faCreditCard} className="text-base" />
              </div>
              <div>
                <h3 className="font-sans font-bold text-sm text-white">Paiement Flexible</h3>
                <p className="text-xs text-[#8E95A5] mt-0.5">Paiement sécurisé ou à la livraison</p>
              </div>
            </div>

            {/* Colonne 3 : Support Dédié */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#0D182E] border border-white/10">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#E5A93C] shrink-0">
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
    </div>
  );
};
