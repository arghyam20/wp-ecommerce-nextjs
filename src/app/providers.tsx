'use client';

import { CartProvider } from '@/context/CartContext';
import { Toaster } from 'react-hot-toast';
import { SessionProvider } from 'next-auth/react';
import { Provider } from 'react-redux';
import { store } from '@/store';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <SessionProvider>
        <CartProvider>
          {children}
          <Toaster position="top-right" />
        </CartProvider>
      </SessionProvider>
    </Provider>
  );
}
