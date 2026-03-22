import type { Metadata } from 'next';
import Layout from '@/components/common/Layout';
import ProductGrid from '@/components/products/ProductGrid';
import ProductsPagination from './pagination';
import ProductsFilters from './filters';
import { getProducts } from '@/lib/woocommerce/products';
import { Product } from '@/types';
import { Container, Typography } from '@mui/material';

export const metadata: Metadata = {
  title: 'All Products',
  description: 'Browse our full collection of quality products. Filter by category, price, and more.',
  openGraph: {
    title: 'All Products | MyStore',
    description: 'Browse our full collection of quality products.',
    url: '/products',
  },
};

const PER_PAGE = 12;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; sort?: string }>;
}) {
  const { page: pageParam, search = '', sort = 'date-desc' } = await searchParams;
  const page = Number(pageParam) || 1;

  const [orderby, order] = sort.split('-') as [string, string];

  let products: Product[] = [];
  let totalPages = 1;

  try {
    const result = await getProducts(page, PER_PAGE, search, orderby, order);
    products = result.products;
    totalPages = result.totalPages;
  } catch {
    products = [];
  }

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom textAlign="center" mb={4}>
          All Products
        </Typography>

        <ProductsFilters search={search} sort={sort} />

        {products.length === 0 ? (
          <Typography textAlign="center" color="text.secondary" py={8}>
            No products found{search ? ` for "${search}"` : ''}.
          </Typography>
        ) : (
          <>
            <ProductGrid products={products} />
            <ProductsPagination page={page} totalPages={totalPages} search={search} sort={sort} />
          </>
        )}
      </Container>
    </Layout>
  );
}
