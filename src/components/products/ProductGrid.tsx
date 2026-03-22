import { Grid } from '@mui/material';
import ProductCard from './ProductCard';
import { Product } from '@/types';

export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <Grid container spacing={3}>
      {products.map((product) => (
        <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4 }}>
          <ProductCard product={product} />
        </Grid>
      ))}
    </Grid>
  );
}
