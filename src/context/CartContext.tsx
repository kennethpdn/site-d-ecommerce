import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { CartItem } from '../types';

interface CartContextType {
  items: CartItem[];
  addItem: (produit_id: string, quantite?: number) => void;
  removeItem: (produit_id: string) => void;
  updateQuantity: (produit_id: string, quantite: number) => void;
  clearCart: () => void;
  totalCount: number;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
}

const CART_STORAGE_KEY = 'maison_minuit_selection_v1';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.filter(
            (item): item is CartItem =>
              typeof item === 'object' &&
              item !== null &&
              typeof item.produit_id === 'string' &&
              typeof item.quantite === 'number' &&
              item.quantite > 0
          );
        }
      }
    } catch {
      // Ignorer l'erreur localStorage silencieusement
    }
    return [];
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Sauvegarde dans localStorage avec try/catch
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Gérer le stockage plein ou mode privé
    }
  }, [items]);

  const addItem = (produit_id: string, quantite = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.produit_id === produit_id);
      if (existing) {
        return prev.map((item) =>
          item.produit_id === produit_id
            ? { ...item, quantite: item.quantite + quantite }
            : item
        );
      }
      return [...prev, { produit_id, quantite }];
    });
    setIsDrawerOpen(true);
  };

  const removeItem = (produit_id: string) => {
    setItems((prev) => prev.filter((item) => item.produit_id !== produit_id));
  };

  const updateQuantity = (produit_id: string, quantite: number) => {
    if (quantite <= 0) {
      removeItem(produit_id);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.produit_id === produit_id ? { ...item, quantite } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantite, 0);
  }, [items]);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);
  const toggleDrawer = () => setIsDrawerOpen((prev) => !prev);

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalCount,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
      toggleDrawer,
    }),
    [items, totalCount, isDrawerOpen]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
