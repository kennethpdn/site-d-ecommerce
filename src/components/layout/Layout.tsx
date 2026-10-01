import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { LazyMotion, domAnimation } from 'framer-motion';
import { Header } from './Header';
import { Footer } from './Footer';
import { CartDrawer } from '../cart/CartDrawer';
import { LenisProvider } from '../../motion/context/LenisContext';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { pathname } = useLocation();

  // Remonter en haut de page à chaque changement de route
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <LazyMotion features={domAnimation}>
      <LenisProvider>
        <div className="min-h-screen flex flex-col bg-[#0B1B33] text-[#E8ECEF] relative selection:bg-[#D9C2A3] selection:text-[#060F1F]">
          <Header />
          <main className="flex-1 w-full pt-16 sm:pt-20 transition-opacity duration-300">
            {children}
          </main>
          <Footer />
          <CartDrawer />
        </div>
      </LenisProvider>
    </LazyMotion>
  );
};
