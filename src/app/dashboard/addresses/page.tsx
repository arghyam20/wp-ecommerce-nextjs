import type { Metadata } from 'next';
import AddressesClient from './addresses-client';

export const metadata: Metadata = {
  title: 'Addresses',
  robots: { index: false, follow: false },
};

export default function AddressesPage() {
  return <AddressesClient />;
}
