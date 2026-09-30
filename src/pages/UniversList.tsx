import React, { useState, useEffect } from 'react';
import { SEO } from '../components/common/SEO';
import { SectionTitle } from '../components/common/SectionTitle';
import { UniversTile } from '../components/shop/UniversTile';
import { Reveal } from '../components/common/Reveal';
import { getUniversList } from '../lib/supabase';
import { Univers } from '../types';

export const UniversList: React.FC = () => {
  const [univers, setUnivers] = useState<Univers[]>([]);

  useEffect(() => {
    getUniversList().then(setUnivers);
  }, []);

  return (
    <div className="py-16 md:py-24 max-w-[1200px] mx-auto px-5 md:px-8">
      <SEO
        title="Les Univers Scénographiques"
        description="Découvrez les six univers pensés par Maison Minuit pour orchestrer votre réveillon du 31 décembre 2026."
      />

      <Reveal>
        <SectionTitle
          kicker="Collections de la Saint-Sylvestre"
          title="Les Six Univers de Minuit"
          subtitle="Chaque univers exprime un moment distinct du passage de l’année : l’attente, l’éclat de la table, les constellations nocturnes et la clarté du premier jour."
        />
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {univers.map((u, idx) => (
          <Reveal key={u.id} staggerIndex={idx}>
            <UniversTile univers={u} index={idx} />
          </Reveal>
        ))}
      </div>
    </div>
  );
};
