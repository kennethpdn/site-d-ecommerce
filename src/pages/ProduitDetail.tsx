import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  faArrowLeft,
  faBagShopping,
  faCheck,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { SEO } from '../components/common/SEO';
import { Reveal } from '../components/common/Reveal';
import { ProductCard } from '../components/shop/ProductCard';
import { Icon } from '../components/common/Icon';
import { getProduitBySlug, getProduits, getUniversList } from '../lib/supabase';
import { Produit, Univers } from '../types';
import {
  formatPrix,
  DEADLINE_COMMANDE,
  DELAI_LIVRAISON,
  RETOURS,
} from '../config';
import { useCart } from '../context/CartContext';
import { DiningTableVisual45 } from '../components/common/DiningTableVisual45';

export const ProduitDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [produit, setProduit] = useState<Produit | null>(null);
  const [univers, setUnivers] = useState<Univers | null>(null);
  const [produitsAssocies, setProduitsAssocies] = useState<Produit[]>([]);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [quantite, setQuantite] = useState(1);
  const [isAddedToast, setIsAddedToast] = useState(false);
  const [loading, setLoading] = useState(true);

  // Accordéons
  const [openAccordion, setOpenAccordion] = useState<string | null>('details');

  const { addItem } = useCart();

  useEffect(() => {
    async function load() {
      if (!slug) return;
      setLoading(true);
      try {
        const p = await getProduitBySlug(slug);
        if (p) {
          setProduit(p);
          const [uList, related] = await Promise.all([
            getUniversList(),
            getProduits({ univers_id: p.univers_id }),
          ]);
          const u = uList.find((item) => item.id === p.univers_id) || null;
          setUnivers(u);
          setProduitsAssocies(related.filter((item) => item.id !== p.id).slice(0, 3));
        }
      } catch {
        // Erreur discrète
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  const handleAddToCart = () => {
    if (!produit) return;
    addItem(produit.id, quantite);
    setIsAddedToast(true);
    setTimeout(() => setIsAddedToast(false), 2400);
  };

  const toggleAccordion = (name: string) => {
    setOpenAccordion(openAccordion === name ? null : name);
  };

  // Liste d'images : 3 à 4 images pour la galerie swipe
  const galleryImages = React.useMemo(() => {
    if (produit?.images && produit.images.length > 0) {
      return produit.images;
    }
    // S'il n'y a pas d'images externes, 3 vues virtuelles du produit avec halo et angles
    return [
      { id: 1, angle: 'Vue principale' },
      { id: 2, angle: 'Détail des textures' },
      { id: 3, angle: 'Mise en ambiance nocturne' },
    ];
  }, [produit]);

  if (loading) {
    return (
      <div className="py-20 max-w-[1200px] mx-auto px-5 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 aspect-[4/5] bg-[#14294A]/40 animate-pulse" />
          <div className="lg:col-span-5 space-y-6">
            <div className="h-4 w-24 bg-[#14294A] animate-pulse" />
            <div className="h-10 w-3/4 bg-[#14294A] animate-pulse" />
            <div className="h-8 w-1/3 bg-[#14294A] animate-pulse" />
            <div className="h-24 w-full bg-[#14294A] animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!produit) {
    return (
      <div className="py-24 text-center max-w-[1200px] mx-auto px-5">
        <h1 className="font-display text-3xl text-[#E8ECEF] mb-4">Pièce introuvable</h1>
        <p className="text-sm text-[#C7CCD1] mb-8">Cette création n’est pas répertoriée dans notre catalogue.</p>
        <Link
          to="/boutique"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#D9C2A3] hover:underline"
        >
          <Icon icon={faArrowLeft} className="text-xs" />
          <span>Retour à la boutique</span>
        </Link>
      </div>
    );
  }

  const isLowStock = produit.stock !== null && produit.stock !== undefined && produit.stock > 0 && produit.stock <= 5;

  return (
    <div className="py-8 md:py-20 max-w-[1200px] mx-auto px-5 md:px-8 pb-28 md:pb-20">
      <SEO
        title={`${produit.nom} — Maison Minuit`}
        description={produit.description_courte || produit.accroche || 'Création d’apparat pour le réveillon 2026.'}
      />

      {/* Fil d'Ariane épuré */}
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#C7CCD1]/70 mb-8">
        <Link to="/boutique" className="hover:text-[#E8ECEF] transition-colors">
          Boutique
        </Link>
        <span aria-hidden="true">/</span>
        {univers && (
          <>
            <Link to={`/univers/${univers.slug}`} className="hover:text-[#E8ECEF] transition-colors">
              {univers.nom}
            </Link>
            <span aria-hidden="true">/</span>
          </>
        )}
        <span className="text-[#D9C2A3] truncate max-w-[200px] sm:max-w-none">{produit.nom}</span>
      </div>

      {/* Grille principale : Galerie swipe à gauche / Module achat à droite */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 pb-16 border-b border-argent-20">
        {/* --- GALERIE SWIPE (3-4 images) --- */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[4/5] bg-[#14294A] border border-argent-20 overflow-hidden flex items-center justify-center">
            {typeof galleryImages[activeImageIdx] === 'string' ? (
              <img
                src={galleryImages[activeImageIdx] as string}
                alt={`${produit.nom} - vue ${activeImageIdx + 1}`}
                className="w-full h-full object-cover transition-all duration-400"
              />
            ) : (
              <DiningTableVisual45 subtleLabel={(galleryImages[activeImageIdx] as any)?.angle || produit.nom} />
            )}

            {/* Flèches de navigation galerie */}
            {galleryImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setActiveImageIdx((prev) =>
                      prev === 0 ? galleryImages.length - 1 : prev - 1
                    )
                  }
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-[#060F1F]/80 border border-argent-20 flex items-center justify-center text-[#E8ECEF] hover:text-[#D9C2A3] transition-colors cursor-pointer z-10"
                  aria-label="Image précédente"
                >
                  <Icon icon={faChevronLeft} className="text-xs" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setActiveImageIdx((prev) => (prev + 1) % galleryImages.length)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-[#060F1F]/80 border border-argent-20 flex items-center justify-center text-[#E8ECEF] hover:text-[#D9C2A3] transition-colors cursor-pointer z-10"
                  aria-label="Image suivante"
                >
                  <Icon icon={faChevronRight} className="text-xs" />
                </button>
              </>
            )}
          </div>

          {/* Miniatures cliquables */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            {galleryImages.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveImageIdx(i)}
                className={`w-20 h-20 shrink-0 border transition-all cursor-pointer bg-[#060F1F] flex items-center justify-center text-[10px] uppercase font-mono ${
                  activeImageIdx === i
                    ? 'border-[#D9C2A3] text-[#D9C2A3]'
                    : 'border-argent-20/40 text-[#C7CCD1]/60 hover:border-argent-20'
                }`}
              >
                0{i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* --- MODULE ACHAT & DÉTAILS --- */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div>
            {univers && (
              <span className="text-xs uppercase tracking-[0.2em] text-[#D9C2A3] font-mono">
                {univers.nom}
              </span>
            )}

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#E8ECEF] mt-2 mb-3">
              {produit.nom}
            </h1>

            <div className="flex items-baseline gap-4 mb-4">
              <span className="font-mono text-2xl sm:text-3xl text-[#D9C2A3] font-medium tabular-nums">
                {formatPrix(produit.prix)}
              </span>
              {isLowStock && (
                <span className="text-xs uppercase tracking-wider text-[#C1121F] font-mono">
                  Stock restreint ({produit.stock} pièces)
                </span>
              )}
            </div>

            {produit.accroche && (
              <p className="subtitle-editorial text-[#C7CCD1] italic mb-6">
                « {produit.accroche} »
              </p>
            )}

            <p className="text-base text-[#C7CCD1] leading-relaxed mb-6">
              {produit.description_courte}
            </p>
          </div>

          {/* Bouton d'achat bureau */}
          <div className="hidden md:block space-y-3 pt-4 border-t border-argent-20/60">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-argent-20 bg-[#060F1F]">
                <button
                  type="button"
                  onClick={() => setQuantite(Math.max(1, quantite - 1))}
                  className="w-10 h-11 flex items-center justify-center text-[#C7CCD1] hover:text-[#E8ECEF] cursor-pointer"
                  aria-label="Diminuer la quantité"
                >
                  -
                </button>
                <span className="w-10 text-center font-mono text-sm text-[#E8ECEF] tabular-nums">
                  {quantite}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantite(quantite + 1)}
                  className="w-10 h-11 flex items-center justify-center text-[#C7CCD1] hover:text-[#E8ECEF] cursor-pointer"
                  aria-label="Augmenter la quantité"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 py-3.5 px-6 bg-[#E8ECEF] text-[#0B1B33] hover:bg-transparent hover:text-[#E8ECEF] border border-[#E8ECEF] text-xs uppercase tracking-wider font-medium flex items-center justify-center gap-2.5 transition-all duration-400 cursor-pointer"
              >
                <Icon icon={faBagShopping} className="text-xs" />
                <span>Ajouter à ma sélection</span>
              </button>
            </div>

            {/* Mention de délai sous le bouton si configurée */}
            {DEADLINE_COMMANDE && (
              <p className="text-xs text-[#C7CCD1] text-center pt-2">
                Commandé avant le {DEADLINE_COMMANDE}, livré avant le 31 décembre.
              </p>
            )}
          </div>

          {/* --- ACCORDÉONS : Détails / Livraison et retours / Souvent associé --- */}
          <div className="space-y-2 pt-6 border-t border-argent-20/60 text-xs">
            {/* Accordéon 1 : Détails */}
            <div className="border border-argent-20/60">
              <button
                type="button"
                onClick={() => toggleAccordion('details')}
                className="w-full p-4 flex items-center justify-between text-left text-xs uppercase tracking-wider font-medium text-[#E8ECEF] bg-[#14294A]/40 cursor-pointer"
              >
                <span>Détails & Matières</span>
                <Icon
                  icon={faChevronDown}
                  className={`text-xs text-[#D9C2A3] transition-transform duration-300 ${
                    openAccordion === 'details' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openAccordion === 'details' && (
                <div className="p-4 bg-[#0B1B33] text-[#C7CCD1] space-y-3 leading-relaxed">
                  <p>{produit.description_longue || produit.description_courte}</p>
                  <div className="space-y-1.5 pt-2 border-t border-argent-20/40">
                    {produit.matieres && (
                      <p>
                        <strong className="text-[#E8ECEF]">Matières :</strong> {produit.matieres}
                      </p>
                    )}
                    {produit.dimensions && (
                      <p>
                        <strong className="text-[#E8ECEF]">Dimensions :</strong> {produit.dimensions}
                      </p>
                    )}
                    {produit.poids && (
                      <p>
                        <strong className="text-[#E8ECEF]">Poids :</strong> {produit.poids}
                      </p>
                    )}
                    {produit.duree && (
                      <p>
                        <strong className="text-[#E8ECEF]">Combustion :</strong> {produit.duree}
                      </p>
                    )}
                    {produit.parfum && (
                      <p>
                        <strong className="text-[#E8ECEF]">Parfum :</strong> {produit.parfum}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Accordéon 2 : Livraison et retours */}
            <div className="border border-argent-20/60">
              <button
                type="button"
                onClick={() => toggleAccordion('livraison')}
                className="w-full p-4 flex items-center justify-between text-left text-xs uppercase tracking-wider font-medium text-[#E8ECEF] bg-[#14294A]/40 cursor-pointer"
              >
                <span>Livraison et retours</span>
                <Icon
                  icon={faChevronDown}
                  className={`text-xs text-[#D9C2A3] transition-transform duration-300 ${
                    openAccordion === 'livraison' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openAccordion === 'livraison' && (
                <div className="p-4 bg-[#0B1B33] text-[#C7CCD1] space-y-2 leading-relaxed">
                  {DELAI_LIVRAISON ? (
                    <p>
                      <strong className="text-[#E8ECEF]">Délais :</strong> {DELAI_LIVRAISON}
                    </p>
                  ) : (
                    <p>Acheminement sécurisé garanti avant le réveillon.</p>
                  )}
                  {RETOURS && (
                    <p>
                      <strong className="text-[#E8ECEF]">Retours :</strong> {RETOURS}
                    </p>
                  )}
                  <p>Emballage protecteur renforcé pour pièces de collection et verreries.</p>
                </div>
              )}
            </div>

            {/* Accordéon 3 : Souvent associé */}
            {produitsAssocies.length > 0 && (
              <div className="border border-argent-20/60">
                <button
                  type="button"
                  onClick={() => toggleAccordion('associe')}
                  className="w-full p-4 flex items-center justify-between text-left text-xs uppercase tracking-wider font-medium text-[#E8ECEF] bg-[#14294A]/40 cursor-pointer"
                >
                  <span>Souvent associé</span>
                  <Icon
                    icon={faChevronDown}
                    className={`text-xs text-[#D9C2A3] transition-transform duration-300 ${
                      openAccordion === 'associe' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordion === 'associe' && (
                  <div className="p-4 bg-[#0B1B33] space-y-3">
                    {produitsAssocies.map((p) => (
                      <Link
                        key={p.id}
                        to={`/produit/${p.slug}`}
                        className="flex items-center justify-between p-2 border border-argent-20/40 hover:border-[#D9C2A3] transition-colors"
                      >
                        <span className="text-xs text-[#E8ECEF]">{p.nom}</span>
                        <span className="font-mono text-xs text-[#D9C2A3] tabular-nums">
                          {formatPrix(p.prix)}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- PRODUITS ASSOCIÉS EN BAS --- */}
      {produitsAssocies.length > 0 && (
        <div className="pt-16">
          <h2 className="text-xs uppercase tracking-[0.2em] text-[#D9C2A3] font-mono mb-8">
            Pièces en accord
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {produitsAssocies.map((item) => (
              <ProductCard key={item.id} produit={item} />
            ))}
          </div>
        </div>
      )}

      {/* --- TOAST DE CONFIRMATION D'AJOUT --- */}
      {isAddedToast && (
        <div className="fixed bottom-20 md:bottom-8 right-5 z-50 bg-[#060F1F] border border-[#D9C2A3] px-5 py-3 shadow-2xl flex items-center gap-3 animate-fade-in">
          <Icon icon={faCheck} className="text-xs text-[#D9C2A3]" />
          <span className="text-xs text-[#E8ECEF] font-sans">
            Ajouté à votre sélection.
          </span>
        </div>
      )}

      {/* --- BOUTON COLLÉ EN BAS SUR MOBILE (STICKY BOTTOM BUY BAR) --- */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#060F1F] border-t border-argent-20 p-4 flex items-center justify-between gap-4">
        <div>
          <span className="block font-display text-base text-[#E8ECEF] truncate max-w-[140px]">
            {produit.nom}
          </span>
          <span className="font-mono text-xs text-[#D9C2A3] tabular-nums">
            {formatPrix(produit.prix)}
          </span>
        </div>
        <button
          type="button"
          onClick={handleAddToCart}
          className="flex-1 py-3 px-4 bg-[#E8ECEF] text-[#0B1B33] text-xs uppercase tracking-wider font-medium flex items-center justify-center gap-2 cursor-pointer"
        >
          <Icon icon={faBagShopping} className="text-xs" />
          <span>Ajouter à ma sélection</span>
        </button>
      </div>
    </div>
  );
};
