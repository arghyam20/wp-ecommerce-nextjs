import type { Metadata } from 'next';
import ContactClient from './contact-client';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    "Get in touch with MyStore. We're here to help with any questions about orders, products, or your account.",
  openGraph: {
    title: 'Contact Us | MyStore',
    description: 'Get in touch with MyStore support.',
    url: '/contact',
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
