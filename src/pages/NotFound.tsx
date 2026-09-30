import React from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/common/SEO';
import { Button } from '../components/common/Button';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-5 py-24">
      <SEO
        title="Cette page a passé minuit — Maison Minuit"
        description="Cette page a passé minuit. Retour à l'accueil."
      />

      <span className="font-mono text-sm tracking-[0.3em] uppercase text-[#D9C2A3] mb-4">
        Erreur 404
      </span>

      <h1 className="title-fluid-section font-display text-[#E8ECEF] max-w-xl mb-6">
        Cette page a passé minuit.
      </h1>

      <p className="subtitle-editorial text-[#C7CCD1] max-w-md mb-10">
        L’instant que vous recherchiez s’est évanoui dans les reflets de la nuit.
      </p>

      <Link to="/">
        <Button variant="solid" size="lg">
          Retour à l'accueil
        </Button>
      </Link>
    </div>
  );
};
