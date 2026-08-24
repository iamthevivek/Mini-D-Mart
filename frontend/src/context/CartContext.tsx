import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';
import { CartSummary } from '../types';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface CartContextType {
  cart: CartSummary | null;
  isLoading: boolean;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  fetchCart: () => Promise<void>;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { success, error, info } = useToast();
  const [cart, setCart] = useState<CartSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);

  const fetchCart = async () => {
    if (!user || user.role !== 'CUSTOMER') {
      setCart(null);
      return;
    }
    try {
      setIsLoading(true);
      const res = await api.get<CartSummary>('/cart');
      setCart(res.data);
    } catch {
      // Ignored if unauthenticated
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (productId: number, quantity: number = 1) => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    try {
      setIsLoading(true);
      const res = await api.post<CartSummary>('/cart', { productId, quantity });
      setCart(res.data);
      success('Added to Cart', 'Item successfully added to your shopping cart');
    } catch (err: any) {
      error('Cart Error', err.response?.data?.message || 'Failed to add item to cart');
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (cartItemId: number, quantity: number) => {
    try {
      setIsLoading(true);
      const res = await api.put<CartSummary>(`/cart/${cartItemId}`, { quantity });
      setCart(res.data);
    } catch (err: any) {
      error('Quantity Error', err.response?.data?.message || 'Failed to update quantity');
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (cartItemId: number) => {
    try {
      setIsLoading(true);
      const res = await api.delete<CartSummary>(`/cart/${cartItemId}`);
      setCart(res.data);
      info('Item Removed', 'Item removed from your cart');
    } catch (err: any) {
      error('Remove Error', err.response?.data?.message || 'Failed to remove item');
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      await api.delete('/cart');
      setCart(null);
    } catch {
      // Cart cleared
    }
  };

  const cartCount = cart ? cart.totalItems : 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
