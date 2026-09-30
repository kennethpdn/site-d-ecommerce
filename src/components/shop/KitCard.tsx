import React, { useState } from 'react';
import { faCheck, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Kit } from '../../types';
import { formatPrix } from '../../config';
import { useCart } from '../../context/CartContext';
import { Icon } from '../common/Icon';

interface KitCardProps {
  kit: Kit;
}

export const KitCard: React.FC<KitCardProps> = ({ kit }) => {
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddKit = () => {
    if (kit.produits && kit.produits.length > 0) {
      kit.produits.forEach((item) => {
        addItem(item.produit_id, item.quantite);
      });
    }
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1600);
  };

  return (
    <div className="relative flex flex-col justify-between p-6 sm:p-8 bg-[#14294A] border border-argent-20">
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs uppercase tracking-widest text-[#D9C2A3] font-mono">
            Ensemble de réveillon
          </span>
          <span className="text-sm font-mono text-[#D9C2A3] font-medium tabular-nums">
            {formatPrix(kit.prix)}
          </span>
        </div>

        <h3 className="font-display text-2xl sm:text-3xl text-[#E8ECEF] mb-3">
          {kit.nom}
        </h3>

        <p className="text-sm text-[#C7CCD1] leading-relaxed mb-6">
          {kit.description}
        </p>

        {/* Détail de composition si disponible */}
        {kit.produits && kit.produits.length > 0 && (
          <div className="mb-6 pt-4 border-t border-argent-20/60">
            <span className="block text-[11px] uppercase tracking-wider text-[#C7CCD1]/60 mb-2.5">
              Composition du coffret :
            </span>
            <ul className="space-y-1.5 text-xs text-[#E8ECEF]/90">
              {kit.produits.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#D9C2A3]/60" />
                  <span>
                    {item.quantite}× {item.produit?.nom || 'Pièce artisanale'}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-argent-20">
        <button
          type="button"
          onClick={handleAddKit}
          className={`
            w-full py-3 px-4 flex items-center justify-center gap-2
            text-xs uppercase tracking-wider font-medium font-sans
            transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]
            cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D9C2A3]
            ${
              isAdded
                ? 'bg-[#D9C2A3] text-[#060F1F]'
                : 'bg-[#E8ECEF] text-[#0B1B33] hover:bg-transparent hover:text-[#E8ECEF] border border-[#E8ECEF]'
            }
          `}
        >
          {isAdded ? (
            <>
              <Icon icon={faCheck} className="text-xs" />
              <span>Coffret ajouté à votre sélection</span>
            </>
          ) : (
            <>
              <Icon icon={faPlus} className="text-xs" />
              <span>Sélectionner cet ensemble</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
