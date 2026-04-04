'use client';

import { CartProvider } from '@/context/CartContext';
import { Toaster } from 'react-hot-toast';
import { SessionProvider } from 'next-auth/react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { initWishlist } from '@/store/wishlistSlice';

function WishlistInit() {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(initWishlist());
  }, [dispatch]);
  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <SessionProvider>
        <CartProvider>
          <WishlistInit />
          {children}
          <Toaster position="top-right" />
        </CartProvider>
      </SessionProvider>
    </Provider>
  );
}
