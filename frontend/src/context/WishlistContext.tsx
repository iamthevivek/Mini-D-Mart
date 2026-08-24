import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  wishlist: Product[];
  isInWishlist: (productId: number) => boolean;
  toggleWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  clearWishlist: () => void;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { info, success, error } = useToast();
  const { user } = useAuth();

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      if (!user) return [];
      const saved = localStorage.getItem(`minidmart_wishlist_${user.id}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Re-sync wishlist when logged-in user changes or logs out
  useEffect(() => {
    if (user && user.role === 'CUSTOMER') {
      try {
        const saved = localStorage.getItem(`minidmart_wishlist_${user.id}`);
        setWishlist(saved ? JSON.parse(saved) : []);
      } catch {
        setWishlist([]);
      }
    } else {
      setWishlist([]);
    }
  }, [user]);

  // Persist user-scoped wishlist to localStorage
  useEffect(() => {
    if (user && user.role === 'CUSTOMER') {
      try {
        localStorage.setItem(`minidmart_wishlist_${user.id}`, JSON.stringify(wishlist));
      } catch {}
    }
  }, [wishlist, user]);

  const isInWishlist = (productId: number) => {
    if (!user || user.role !== 'CUSTOMER') return false;
    return wishlist.some((item) => item.id === productId);
  };

  const toggleWishlist = (product: Product) => {
    if (!user) {
      error('Sign In Required', 'Please sign in to save items to your wishlist.');
      return;
    }
    if (user.role !== 'CUSTOMER') {
      info('Notice', 'Wishlist is available for customer accounts.');
      return;
    }

    if (isInWishlist(product.id)) {
      setWishlist((prev) => prev.filter((item) => item.id !== product.id));
      info('Removed from Wishlist', product.name);
    } else {
      setWishlist((prev) => [product, ...prev]);
      success('Added to Wishlist', product.name);
    }
  };

  const removeFromWishlist = (productId: number) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
        wishlistCount: wishlist.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
