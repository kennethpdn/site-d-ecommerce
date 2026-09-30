import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { SEO } from '../components/common/SEO';
import { Reveal } from '../components/common/Reveal';
import { ProductCard } from '../components/shop/ProductCard';
import { KitCard } from '../components/shop/KitCard';
import { Icon } from '../components/common/Icon';
import { ProductCardSkeleton } from '../components/common/Skeleton';
import { getUniversBySlug, getUniversList, getProduits, getKits } from '../lib/supabase';
import { Univers, Produit, Kit } from '../types';

export const UniversDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [univers, setUnivers] = useState<Univers | null>(null);
  const [allUnivers, setAllUnivers] = useState<Univers[]>([]);
  const [produits, setProduits] = useState<Produit[]>([]);
  const [kitLie, setKitLie] = useState<Kit | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!slug) return;
      setLoading(true);
      try {
        const [u, uList, kList] = await Promise.all([
          getUniversBySlug(slug),
          getUniversList(),
          getKits(),
        ]);

        if (u) {
          setUnivers(u);
          setAllUnivers(uList);
          const pList = await getProduits({ univers_id: u.id });
          setProduits(pList);

          // Kit associé à cet univers
          let associatedKit: Kit | null = null;
          if (u.slug === 'diner-de-minuit') {
            associatedKit = kList.find((k) => k.slug === 'table-de-minuit') || null;
          } else if (u.slug === 'salon-dore') {
            associatedKit = kList.find((k) => k.slug === 'salon-dore') || null;
          } else if (u.slug === 'exterieur') {
            associatedKit = kList.find((k) => k.slug === 'facade-etoilee') || null;
          }
          setKitLie(associatedKit);
        }
      } catch {
        // Erreur discrète
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  // Trouver l'univers suivant (boucle cyclique 1 -> 2 -> ... -> 6 -> 1)
  const nextUnivers = React.useMemo(() => {
    if (!univers || allUnivers.length === 0) return null;
    const currentIndex = allUnivers.findIndex((u) => u.id === univers.id);
    if (currentIndex === -1) return null;
    const nextIndex = (currentIndex + 1) % allUnivers.length;
    return allUnivers[nextIndex];
  }, [univers, allUnivers]);

  if (loading) {
    return (
      <div className="py-20 max-w-[1200px] mx-auto px-5 md:px-8">
        <div className="h-4 w-32 bg-[#14294A] animate-pulse mb-8" />
        <div className="h-12 w-2/3 bg-[#14294A] animate-pulse mb-6" />
        <div className="h-6 w-1/2 bg-[#14294A] animate-pulse mb-12" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!univers) {
    return (
      <div className="py-24 text-center max-w-[1200px] mx-auto px-5">
        <h1 className="font-display text-3xl text-[#E8ECEF] mb-4">Univers introuvable</h1>
        <p className="text-sm text-[#C7CCD1] mb-8">Cet univers ne fait pas partie de notre collection.</p>
        <Link
          to="/univers"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#D9C2A3] hover:underline"
        >
          <Icon icon={faArrowLeft} className="text-xs" />
          <span>Retour aux univers</span>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <SEO
        title={`${univers.nom} — Univers Réveillon`}
        description={univers.description}
      />

      {/* --- BANDEAU VISUEL D'AMBIANCE --- */}
      <section className="relative py-20 md:py-28 bg-[#060F1F] border-b border-argent-20/60 overflow-hidden">
        <div className="absolute inset-0 halo-champagne opacity-60 pointer-events-none" />
        <div className="relative z-10 max-w-[1200px] mx-auto px-5 md:px-8">
          <Link
            to="/univers"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#C7CCD1] hover:text-[#D9C2A3] transition-colors mb-8"
          >
            <Icon icon={faArrowLeft} className="text-xs" />
            <span>Tous les univers</span>
          </Link>

          <div className="max-w-3xl">
            <span className="text-xs uppercase tracking-[0.25em] text-[#D9C2A3] font-mono block mb-2">
              Univers 0{univers.ordre}
            </span>
            <h1 className="title-fluid-section font-display text-[#E8ECEF] mb-4">
              {univers.nom}
            </h1>
            <p className="subtitle-editorial text-[#D9C2A3] mb-6">
              {univers.accroche}
            </p>
            <p className="text-base sm:text-lg text-[#C7CCD1] leading-relaxed">
              {univers.description}
            </p>
          </div>
        </div>
      </section>

      {/* --- GRILLE DE PRODUITS EN CASCADE --- */}
      <section className="py-16 md:py-24 max-w-[1200px] mx-auto px-5 md:px-8">
        <div className="flex items-center justify-between pb-4 mb-10 border-b border-argent-20">
          <span className="text-xs uppercase tracking-widest text-[#D9C2A3] font-mono">
            Pièces de la collection ({produits.length})
          </span>
          <span className="text-xs uppercase tracking-widest text-[#C7CCD1]/60">
            Édition 31 décembre 2026
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {produits.map((produit, idx) => (
            <Reveal key={produit.id} staggerIndex={idx}>
              <ProductCard produit={produit} />
            </Reveal>
          ))}
        </div>

        {/* --- KIT LIÉ À CET UNIVERS (SI DISPONIBLE) --- */}
        {kitLie && (
          <div className="mt-20 pt-16 border-t border-argent-20/60">
            <div className="mb-8">
              <span className="text-xs uppercase tracking-[0.25em] text-[#D9C2A3] font-mono block mb-2">
                Composition prête à poser
              </span>
              <h2 className="font-display text-3xl text-[#E8ECEF]">
                L’ensemble dédié : {kitLie.nom}
              </h2>
            </div>
            <div className="max-w-xl">
              <KitCard kit={kitLie} />
            </div>
          </div>
        )}

        {/* --- LIEN UNIVERS SUIVANT --- */}
        {nextUnivers && (
          <div className="mt-24 pt-10 border-t border-argent-20 flex justify-end">
            <Link
              to={`/univers/${nextUnivers.slug}`}
              className="group inline-flex items-center gap-3 text-sm uppercase tracking-widest text-[#E8ECEF] hover:text-[#D9C2A3] transition-colors"
            >
              <span>Univers suivant : {nextUnivers.nom}</span>
              <div className="w-8 h-8 flex items-center justify-center border border-argent-20 group-hover:border-[#D9C2A3] text-[#D9C2A3] group-hover:translate-x-1 transition-all">
                <Icon icon={faArrowRight} className="text-xs" />
              </div>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};
