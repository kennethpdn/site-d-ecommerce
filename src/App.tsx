import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { Layout } from './components/layout/Layout';

// Pages
import { Home } from './pages/Home';
import { UniversList } from './pages/UniversList';
import { UniversDetail } from './pages/UniversDetail';
import { Boutique } from './pages/Boutique';
import { ProduitDetail } from './pages/ProduitDetail';
import { MaSelection } from './pages/MaSelection';
import { Commande } from './pages/Commande';
import { CommandeConfirmation } from './pages/CommandeConfirmation';
import { InspirationsList } from './pages/InspirationsList';
import { InspirationsDetail } from './pages/InspirationsDetail';
import { Atelier } from './pages/Atelier';
import { Aide } from './pages/Aide';
import { Contact } from './pages/Contact';
import { Legal } from './pages/Legal';
import { NotFound } from './pages/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/univers" element={<UniversList />} />
            <Route path="/univers/:slug" element={<UniversDetail />} />
            <Route path="/boutique" element={<Boutique />} />
            <Route path="/produit/:slug" element={<ProduitDetail />} />
            <Route path="/ma-selection" element={<MaSelection />} />
            <Route path="/commande" element={<Commande />} />
            <Route path="/commande/confirmation" element={<CommandeConfirmation />} />
            <Route path="/inspirations" element={<InspirationsList />} />
            <Route path="/inspirations/:slug" element={<InspirationsDetail />} />
            <Route path="/atelier" element={<Atelier />} />
            <Route path="/aide" element={<Aide />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cgv" element={<Legal />} />
            <Route path="/mentions-legales" element={<Legal />} />
            <Route path="/confidentialite" element={<Legal />} />
            <Route path="/cookies" element={<Legal />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </CartProvider>
    </BrowserRouter>
  );
}
