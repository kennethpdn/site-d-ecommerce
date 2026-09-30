import React from 'react';

export interface AvisClient {
  id: string;
  auteur: string;
  commentaire: string;
  date: string;
  note?: number;
}

interface AvisListProps {
  avis?: AvisClient[];
}

/**
 * Composant d'avis certifiés prêt à accueillir de vrais avis.
 * Reste strictement masqué s'il n'y a aucun avis vérifié (pas d'avis inventés).
 */
export const AvisList: React.FC<AvisListProps> = ({ avis = [] }) => {
  // Masqué tant qu'il n'y en a aucun
  if (!avis || avis.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-24 border-t border-argent-20/60 bg-[#060F1F]">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-[0.25em] text-[#D9C2A3] font-mono">
            Témoignages Vérifiés
          </span>
          <h2 className="font-display text-3xl text-[#E8ECEF] mt-2">
            Les retours de nos hôtes
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {avis.map((a) => (
            <div key={a.id} className="p-6 bg-[#14294A] border border-argent-20 flex flex-col justify-between">
              <p className="text-sm text-[#C7CCD1] leading-relaxed italic mb-4">
                « {a.commentaire} »
              </p>
              <div className="pt-3 border-t border-argent-20/40 text-xs text-[#D9C2A3]">
                {a.auteur} · {a.date}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
