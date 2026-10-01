import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { SEO } from '../components/common/SEO';
import { Reveal, RevealText, Stagger, StaggerItem } from '../motion';
import { Icon } from '../components/common/Icon';
import { getArticleBySlug } from '../lib/supabase';
import { Article } from '../types';

export const InspirationsDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!slug) return;
      setLoading(true);
      try {
        const art = await getArticleBySlug(slug);
        setArticle(art);
      } catch {
        // Erreur discrète
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="py-24 max-w-[800px] mx-auto px-5 md:px-8">
        <div className="h-4 w-32 bg-[#14294A] animate-pulse mb-8" />
        <div className="h-10 w-3/4 bg-[#14294A] animate-pulse mb-6" />
        <div className="h-20 w-full bg-[#14294A] animate-pulse mb-12" />
        <div className="space-y-4">
          <div className="h-4 w-full bg-[#14294A] animate-pulse" />
          <div className="h-4 w-5/6 bg-[#14294A] animate-pulse" />
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="py-24 text-center max-w-[1200px] mx-auto px-5">
        <h1 className="font-display text-3xl text-[#E8ECEF] mb-4">Article introuvable</h1>
        <Link
          to="/inspirations"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#D9C2A3] hover:underline"
        >
          <Icon icon={faArrowLeft} className="text-xs" />
          <span>Retour aux inspirations</span>
        </Link>
      </div>
    );
  }

  // Vérifier si c'est l'article des 5 gestes
  const is5Gestes = article.slug === 'composer-une-table-de-reveillon-en-5-gestes';

  const gestes5 = [
    {
      titre: '1. Choisir une nappe sombre',
      texte:
        'Le noir ou le bleu nuit absorbe la clarté ambiante et crée une assise théâtrale pour la vaisselle. Les assiettes et les couverts clairs s’y découpent avec une netteté remarquable.',
    },
    {
      titre: '2. S’en tenir à une teinte métallique',
      texte:
        'Le mélange des ors et des chromes disperse le regard et brouille la lecture de la table. Choisissez un seul métal pour l’ensemble des chandeliers, couverts et liserés.',
    },
    {
      titre: '3. Multiplier les petites lumières',
      texte:
        'Les grandes sources aveuglent et coupent les convives dans leurs conversations intimes. Disposez de nombreux photophores bas pour baigner chaque couvert d’une lueur feutrée.',
    },
    {
      titre: '4. Varier les hauteurs',
      texte:
        'Une table plane manque de souffle et tasse les perspectives de votre salle à manger. Érigez deux ou trois cierges hauts au centre, puis redescendez vers des pièces rases aux extrémités.',
    },
    {
      titre: '5. Éteindre le plafonnier',
      texte:
        'La lumière zénithale écrase les visages et brise le mystère des douze coups de minuit. Dès l’entrée des premiers invités, laissez les bougies et lampes d’appoint régner seules.',
    },
  ];

  return (
    <div className="py-16 md:py-24 max-w-[800px] mx-auto px-5 md:px-8">
      <SEO title={article.titre} description={article.extrait} />

      <Reveal>
        <Link
          to="/inspirations"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#C7CCD1] hover:text-[#D9C2A3] transition-colors mb-10"
        >
          <Icon icon={faArrowLeft} className="text-xs" />
          <span>Toutes les inspirations</span>
        </Link>
      </Reveal>

      <article>
        <header className="mb-12">
          <Reveal direction="down" distance={10}>
            <span className="text-xs uppercase tracking-[0.25em] text-[#D9C2A3] font-mono block mb-3">
              Carnet de Réveillon
            </span>
          </Reveal>
          <RevealText
            as="h1"
            text={article.titre}
            className="title-fluid-section font-display text-[#E8ECEF] mb-6"
          />
          <Reveal delay={0.15}>
            <p className="subtitle-editorial text-[#D9C2A3]/90 italic border-l-2 border-[#D9C2A3]/50 pl-4 py-1">
              {article.extrait}
            </p>
          </Reveal>
        </header>

        {is5Gestes ? (
          <Stagger className="space-y-10 my-10">
            {gestes5.map((geste, idx) => (
              <StaggerItem key={idx}>
                <div className="pb-8 border-b border-argent-20/40 last:border-b-0">
                  <RevealText
                    as="h2"
                    text={geste.titre}
                    className="font-display text-2xl text-[#E8ECEF] mb-3"
                  />
                  <p className="text-base text-[#C7CCD1] leading-relaxed">
                    {geste.texte}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        ) : (
          <Reveal delay={0.2}>
            <div className="text-[#C7CCD1] text-base leading-relaxed space-y-6">
              {article.contenu.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </Reveal>
        )}

        <div className="mt-16 pt-8 border-t border-argent-20 flex justify-between items-center text-xs text-[#C7CCD1]/60">
          <span>Maison Minuit · Carnet d’Apparat</span>
          <span>31 Décembre 2026</span>
        </div>
      </article>
    </div>
  );
};
