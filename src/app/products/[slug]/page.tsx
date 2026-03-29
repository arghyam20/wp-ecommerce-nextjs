import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Layout from '@/components/common/Layout';
import ProductDetails from '@/components/products/ProductDetails';
import ProductGrid from '@/components/products/ProductGrid';
import { getProducts, getProductBySlug, getRelatedProducts } from '@/lib/woocommerce/products';
import { Container, Typography, Divider } from '@mui/material';

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const { products } = await getProducts(1, 50);
    return products.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await getProductBySlug(slug);
    if (!product) return { title: 'Product Not Found' };
    const description = product.short_description.replace(/<[^>]*>/g, '').substring(0, 160);
    return {
      title: product.name,
      description,
      openGraph: {
        title: `${product.name} | MyStore`,
        description,
        url: `/products/${slug}`,
        images: product.images[0] ? [{ url: product.images[0].src, alt: product.images[0].alt }] : [],
      },
    };
  } catch {
    return { title: 'Product' };
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let product;
  try {
    product = await getProductBySlug(slug);
  } catch {
    notFound();
  }
  if (!product) notFound();

  const categoryId = product.categories?.[0]?.id;
  const related = categoryId ? await getRelatedProducts(product.id, categoryId) : [];

  return (
    <Layout>
      <ProductDetails product={product} />
      {related.length > 0 && (
        <Container maxWidth="lg" sx={{ pb: 6 }}>
          <Divider sx={{ mb: 4 }} />
          <Typography variant="h5" fontWeight="bold" mb={3}>Related Products</Typography>
          <ProductGrid products={related} />
        </Container>
      )}
    </Layout>
  );
}
