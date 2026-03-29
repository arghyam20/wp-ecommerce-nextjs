import type { Metadata } from 'next';
import WishlistClient from './wishlist-client';

export const metadata: Metadata = {
  title: 'Wishlist',
  description: 'Your saved products wishlist.',
};

export default function WishlistPage() {
  return <WishlistClient />;
}
