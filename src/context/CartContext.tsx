'use client';

import React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import {
  fetchCart,
  addToCart as addToCartThunk,
  removeFromCart as removeFromCartThunk,
  updateQuantity as updateQuantityThunk,
  clearCart as clearCartThunk,
} from '@/store/cartSlice';

// Re-export CartProvider as a no-op wrapper so _app.tsx needs no changes
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export const useCart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { cart, loading, fetched } = useSelector((state: RootState) => state.cart);

  useEffect(() => {
    if (!fetched) dispatch(fetchCart());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    cart,
    loading,
    addToCart: (productId: number, quantity: number, variation?: Record<string, string>, name?: string, price?: string, image?: { src: string; alt: string }) =>
      dispatch(addToCartThunk({ productId, quantity, variation, name: name ?? '', price: price ?? '0', image })).unwrap(),
    removeFromCart: (itemKey: string) =>
      dispatch(removeFromCartThunk(itemKey)).unwrap(),
    updateQuantity: (itemKey: string, quantity: number) =>
      dispatch(updateQuantityThunk({ itemKey, quantity })).unwrap(),
    clearCart: () =>
      dispatch(clearCartThunk()).unwrap(),
  };
};
