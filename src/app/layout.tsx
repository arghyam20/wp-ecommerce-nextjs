import type { Metadata } from 'next';
import '@/styles/globals.scss';
import ThemeRegistry from './theme-registry';
import Providers from './providers';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  title: {
    default: 'MyStore – Shop Quality Products Online',
    template: '%s | MyStore',
  },
  description: 'Discover amazing products at great prices. Fast shipping, 24/7 support, and a seamless shopping experience.',
  keywords: ['ecommerce', 'online store', 'shop', 'products'],
  openGraph: {
    type: 'website',
    siteName: 'MyStore',
    title: 'MyStore – Shop Quality Products Online',
    description: 'Discover amazing products at great prices.',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <ThemeRegistry>
          <Providers>{children}</Providers>
        </ThemeRegistry>
      </body>
    </html>
  );
}
