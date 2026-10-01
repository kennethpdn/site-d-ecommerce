import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { CartProvider } from './context/CartContext';
import { Layout } from './components/layout/Layout';
import { PageTransition } from './motion/PageTransition';

// Code-splitting des routes avec React.lazy
const Home = React.lazy(() => import('./pages/Home').then((m) => ({ default: m.Home })));
const UniversList = React.lazy(() => import('./pages/UniversList').then((m) => ({ default: m.UniversList })));
const UniversDetail = React.lazy(() => import('./pages/UniversDetail').then((m) => ({ default: m.UniversDetail })));
const Boutique = React.lazy(() => import('./pages/Boutique').then((m) => ({ default: m.Boutique })));
const ProduitDetail = React.lazy(() => import('./pages/ProduitDetail').then((m) => ({ default: m.ProduitDetail })));
const MaSelection = React.lazy(() => import('./pages/MaSelection').then((m) => ({ default: m.MaSelection })));
const Commande = React.lazy(() => import('./pages/Commande').then((m) => ({ default: m.Commande })));
const CommandeConfirmation = React.lazy(() => import('./pages/CommandeConfirmation').then((m) => ({ default: m.CommandeConfirmation })));
const InspirationsList = React.lazy(() => import('./pages/InspirationsList').then((m) => ({ default: m.InspirationsList })));
const InspirationsDetail = React.lazy(() => import('./pages/InspirationsDetail').then((m) => ({ default: m.InspirationsDetail })));
const Atelier = React.lazy(() => import('./pages/Atelier').then((m) => ({ default: m.Atelier })));
const Aide = React.lazy(() => import('./pages/Aide').then((m) => ({ default: m.Aide })));
const Contact = React.lazy(() => import('./pages/Contact').then((m) => ({ default: m.Contact })));
const Legal = React.lazy(() => import('./pages/Legal').then((m) => ({ default: m.Legal })));
const NotFound = React.lazy(() => import('./pages/NotFound').then((m) => ({ default: m.NotFound })));

// Fallback skeleton léger pour le chargement des routes
const RouteLoadingFallback: React.FC = () => (
  <div className="min-h-[70vh] w-full flex flex-col items-center justify-center p-8 bg-[#0B1B33]">
    <div className="w-10 h-10 rounded-full border-2 border-[#D9C2A3]/20 border-t-[#D9C2A3] animate-spin mb-4" />
    <span className="text-[11px] uppercase tracking-[0.25em] text-[#C7CCD1] font-mono">
      Maison Minuit · Chargement
    </span>
  </div>
);

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<RouteLoadingFallback />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/univers" element={<PageTransition><UniversList /></PageTransition>} />
          <Route path="/univers/:slug" element={<PageTransition><UniversDetail /></PageTransition>} />
          <Route path="/boutique" element={<PageTransition><Boutique /></PageTransition>} />
          <Route path="/produit/:slug" element={<PageTransition><ProduitDetail /></PageTransition>} />
          <Route path="/ma-selection" element={<PageTransition><MaSelection /></PageTransition>} />
          <Route path="/commande" element={<PageTransition><Commande /></PageTransition>} />
          <Route path="/commande/confirmation" element={<PageTransition><CommandeConfirmation /></PageTransition>} />
          <Route path="/inspirations" element={<PageTransition><InspirationsList /></PageTransition>} />
          <Route path="/inspirations/:slug" element={<PageTransition><InspirationsDetail /></PageTransition>} />
          <Route path="/atelier" element={<PageTransition><Atelier /></PageTransition>} />
          <Route path="/aide" element={<PageTransition><Aide /></PageTransition>} />
          <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
          <Route path="/cgv" element={<PageTransition><Legal /></PageTransition>} />
          <Route path="/mentions-legales" element={<PageTransition><Legal /></PageTransition>} />
          <Route path="/confidentialite" element={<PageTransition><Legal /></PageTransition>} />
          <Route path="/cookies" element={<PageTransition><Legal /></PageTransition>} />
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Layout>
          <AnimatedRoutes />
        </Layout>
      </CartProvider>
    </BrowserRouter>
  );
}
