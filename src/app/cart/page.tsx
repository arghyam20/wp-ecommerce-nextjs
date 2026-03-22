import type { Metadata } from 'next';
import CartClient from './cart-client';

export const metadata: Metadata = {
  title: 'Shopping Cart',
  description: 'Review your cart items and proceed to checkout.',
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return <CartClient />;
}
