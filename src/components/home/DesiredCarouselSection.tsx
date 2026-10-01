import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { m } from 'framer-motion';
import { faArrowRight, faChevronLeft, faChevronRight, faBagShopping } from '@fortawesome/free-solid-svg-icons';
import { Icon } from '../common/Icon';
import { SEED_PRODUITS } from '../../data/seed';
import { formatPrix } from '../../config';
import { useCart } from '../../context/CartContext';
import { Reveal, RevealText } from '../../motion';
import { useReducedMotion } from '../../motion/hooks/useReducedMotion';
import { MOTION_EASINGS } from '../../motion/tokens';

export const DesiredCarouselSection: React.FC = () => {
  const { addItem } = useCart();
  const carouselRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  // Produits les plus convoités / bestsellers
  const desiredProducts = SEED_PRODUITS.filter((p) => p.populaire || p.stock! > 0).slice(0, 8);

  const scrollBy = (offset: number) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 md:py-28 bg-[#060F1F] text-[#E8ECEF] border-t border-argent-20/60 overflow-hidden">
      <div className="max-w-[1240px] mx-auto px-5 md:px-8">
        {/* Entête de section avec navigation fléchée */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <Reveal direction="down" distance={10}>
              <span className="text-xs uppercase tracking-[0.25em] text-[#D9C2A3] font-mono block mb-2">
                Pièces d'Apparat
              </span>
            </Reveal>
            <RevealText
              as="h2"
              text="Les Plus Désirés"
              className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#E8ECEF]"
            />
            <Reveal delay={0.1}>
              <p className="text-xs sm:text-sm text-[#C7CCD1] mt-2 max-w-md">
                Les pièces les plus plébiscitées pour habiller vos tables et illuminer chaque instant.
              </p>
            </Reveal>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => scrollBy(-360)}
              className="w-10 h-10 rounded-full border border-argent-20 flex items-center justify-center text-white/80 hover:text-white hover:border-[#D9C2A3] transition-colors cursor-pointer"
              aria-label="Faire défiler vers la gauche"
            >
              <Icon icon={faChevronLeft} className="text-xs" />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(360)}
              className="w-10 h-10 rounded-full border border-argent-20 flex items-center justify-center text-white/80 hover:text-white hover:border-[#D9C2A3] transition-colors cursor-pointer"
              aria-label="Faire défiler vers la droite"
            >
              <Icon icon={faChevronRight} className="text-xs" />
            </button>
          </div>
        </div>

        {/* Carrousel swipeable avec CSS scroll-snap et active image scale 1.04 */}
        <div
          ref={carouselRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-6 pt-2 -mx-5 px-5"
        >
          {desiredProducts.map((produit, index) => (
            <m.div
              key={produit.id}
              initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{
                duration: 0.5,
                delay: prefersReduced ? 0 : Math.min(index * 0.08, 0.4),
                ease: MOTION_EASINGS.entrance,
              }}
              className="snap-start shrink-0 w-[280px] sm:w-[320px] md:w-[340px] group bg-[#0B1B33] border border-argent-20/60 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-[#D9C2A3]/50 transition-all duration-300 shadow-xl will-change-transform"
            >
              {/* Visuel avec active image scale 1.04 */}
              <div className="relative aspect-[4/5] bg-[#060F1F] overflow-hidden">
                <Link to={`/produit/${produit.slug}`} className="block w-full h-full">
                  <img
                    src={
                      produit.images?.[0] ||
                      'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80'
                    }
                    alt={produit.nom}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out will-change-transform"
                  />
                </Link>

                {/* Badge Bestseller */}
                <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[#D9C2A3] text-[10px] uppercase font-bold tracking-wider">
                  Bestseller
                </div>

                {/* Bouton rapide d'ajout au panier */}
                <button
                  type="button"
                  onClick={() => addItem(produit.id)}
                  className="absolute bottom-3 right-3 z-10 w-9 h-9 rounded-full bg-[#E8ECEF] text-[#0B1B33] hover:bg-[#D9C2A3] flex items-center justify-center transition-all shadow-lg cursor-pointer"
                  title="Ajouter au panier"
                >
                  <Icon icon={faBagShopping} className="text-xs" />
                </button>
              </div>

              {/* Détails du produit */}
              <div className="p-5 flex flex-col justify-between flex-1 space-y-3">
                <div className="space-y-1">
                  <Link
                    to={`/produit/${produit.slug}`}
                    className="font-display text-lg text-white group-hover:text-[#D9C2A3] transition-colors line-clamp-1 block"
                  >
                    {produit.nom}
                  </Link>
                  <p className="text-xs text-[#C7CCD1] line-clamp-2 leading-relaxed">
                    {produit.accroche || produit.description_courte}
                  </p>
                </div>

                <div className="pt-3 border-t border-argent-20/40 flex items-center justify-between">
                  <span className="font-mono text-sm text-[#D9C2A3] font-medium tabular-nums">
                    {formatPrix(produit.prix)}
                  </span>
                  <Link
                    to={`/produit/${produit.slug}`}
                    className="text-xs text-[#C7CCD1] hover:text-white transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>Détail</span>
                    <Icon icon={faArrowRight} className="text-[10px]" />
                  </Link>
                </div>
              </div>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
};
