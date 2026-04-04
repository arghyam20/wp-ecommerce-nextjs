import type { Metadata } from "next";
import Layout from "@/components/common/Layout";
import ProductGrid from "@/components/products/ProductGrid";
import ProductsPagination from "./pagination";
import ProductsFilters from "./filters";
import { getProducts, getCategories } from "@/lib/woocommerce/products";
import { Product } from "@/types";
import { PRODUCTS_PER_PAGE } from '@/lib/constants';
import { Container, Typography, Grid, Box, Chip } from "@mui/material";
import Link from "next/link";

export const metadata: Metadata = {
  title: "All Products",
  description:
    "Browse our full collection of quality products. Filter by category, price, and more.",
};

export const revalidate = 3600;
const PER_PAGE = PRODUCTS_PER_PAGE;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    sort?: string;
    category?: string;
  }>;
}) {
  const {
    page: pageParam,
    search = "",
    sort = "date-desc",
    category = "",
  } = await searchParams;
  const page = Number(pageParam) || 1;
  const [orderby, order] = sort.split("-") as [string, string];

  const [{ products, totalPages }, categories] = await Promise.all([
    getProducts(page, PER_PAGE, search, orderby, order, category).catch(() => ({
      products: [] as Product[],
      totalPages: 1,
    })),
    getCategories().catch(() => []),
  ]);

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" mb={4}>
          Shop
        </Typography>
        <Grid container spacing={4}>
          {/* Sidebar */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Box sx={{ position: "sticky", top: 80 }}>
              <Typography variant="subtitle1" fontWeight="bold" mb={2}>
                Categories
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                <Link href="/products" style={{ textDecoration: "none" }}>
                  <Chip
                    label="All Products"
                    clickable
                    variant={!category ? "filled" : "outlined"}
                    color={!category ? "primary" : "default"}
                    sx={{ justifyContent: "flex-start", width: "100%" }}
                  />
                </Link>
                {categories
                  .filter((c) => c.parent === 0)
                  .map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/products?category=${cat.id}`}
                      style={{ textDecoration: "none" }}
                    >
                      <Chip
                        label={`${cat.name} (${cat.count})`}
                        clickable
                        variant={
                          category === String(cat.id) ? "filled" : "outlined"
                        }
                        color={
                          category === String(cat.id) ? "primary" : "default"
                        }
                        sx={{ justifyContent: "flex-start", width: "100%" }}
                      />
                    </Link>
                  ))}
              </Box>
            </Box>
          </Grid>

          {/* Products */}
          <Grid size={{ xs: 12, md: 9 }}>
            <ProductsFilters search={search} sort={sort} />
            {products.length === 0 ? (
              <Typography textAlign="center" color="text.secondary" py={8}>
                No products found{search ? ` for "${search}"` : ""}.
              </Typography>
            ) : (
              <>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Showing {products.length} product
                  {products.length !== 1 ? "s" : ""}
                </Typography>
                <ProductGrid products={products} />
                <ProductsPagination
                  page={page}
                  totalPages={totalPages}
                  search={search}
                  sort={sort}
                />
              </>
            )}
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
}
