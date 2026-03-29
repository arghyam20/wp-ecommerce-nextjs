'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { initWishlist, toggleWishlist } from '@/store/wishlistSlice';
import { useCart } from '@/context/CartContext';
import Layout from '@/components/common/Layout';
import {
  Container, Typography, Grid, Card, CardMedia, CardContent,
  CardActions, Button, Box, Alert, IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function WishlistClient() {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector((state: RootState) => state.wishlist.items);
  const { addToCart } = useCart();

  useEffect(() => { dispatch(initWishlist()); }, [dispatch]);

  const handleAddToCart = async (product: typeof items[0]) => {
    try {
      await addToCart(
        product.id, 1, undefined, product.name,
        product.sale_price || product.price,
        product.images[0] ? { src: product.images[0].src, alt: product.images[0].alt } : undefined
      );
      toast.success(`"${product.name}" added to cart`);
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" mb={4}>Wishlist</Typography>
        {items.length === 0 ? (
          <Alert severity="info" sx={{ mb: 3 }}>
            Your wishlist is empty.{' '}
            <Link href="/products"><strong>Browse products</strong></Link>
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {items.map((product) => (
              <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Link href={`/products/${product.slug}`}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={product.images[0]?.src || '/placeholder.jpg'}
                      alt={product.name}
                      sx={{ objectFit: 'cover', cursor: 'pointer' }}
                    />
                  </Link>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" fontWeight="medium" gutterBottom>{product.name}</Typography>
                    <Typography variant="h6" color="primary">
                      ${parseFloat(product.sale_price || product.price).toFixed(2)}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ gap: 1, px: 2, pb: 2 }}>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<AddShoppingCartIcon />}
                      onClick={() => handleAddToCart(product)}
                      sx={{ flexGrow: 1 }}
                    >
                      Add to Cart
                    </Button>
                    <IconButton size="small" color="error" onClick={() => dispatch(toggleWishlist(product))}>
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
        {items.length > 0 && (
          <Box mt={3}>
            <Link href="/products" passHref>
              <Button variant="outlined">Continue Shopping</Button>
            </Link>
          </Box>
        )}
      </Container>
    </Layout>
  );
}
