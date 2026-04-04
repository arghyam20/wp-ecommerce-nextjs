import type { Metadata } from 'next';
import Layout from '@/components/common/Layout';
import ProductGrid from '@/components/products/ProductGrid';
import { getProducts } from '@/lib/woocommerce/products';
import { Product } from '@/types';
import { Typography, Container, Button } from '@mui/material';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'MyStore – Shop Quality Products Online',
  description:
    'Discover amazing products at great prices. Browse our featured collection and shop now.',
  openGraph: {
    title: 'MyStore – Shop Quality Products Online',
    description: 'Discover amazing products at great prices.',
    url: '/',
  },
};

export const revalidate = 3600;

export default async function HomePage() {
  let featuredProducts: Product[] = [];
  try {
    const { products } = await getProducts(1, 6);
    featuredProducts = products;
  } catch {
    featuredProducts = [];
  }

  return (
    <Layout>
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <Container maxWidth="lg">
          <div className="text-center">
            <Typography variant="h2" component="h1" gutterBottom className="font-bold">
              Welcome to Our Store
            </Typography>
            <Typography variant="h5" gutterBottom className="mb-8">
              Discover amazing products at great prices
            </Typography>
            <Link href="/products" passHref>
              <Button
                variant="contained"
                size="large"
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                Shop Now
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" gutterBottom className="text-center mb-12">
            Featured Products
          </Typography>
          <ProductGrid products={featuredProducts} />
        </Container>
      </section>
    </Layout>
  );
}
