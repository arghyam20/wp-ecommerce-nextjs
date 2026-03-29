'use client';

import { Product } from '@/types';
import { Container, Grid, Typography, Button, Box, Divider, Chip, IconButton, Tooltip } from '@mui/material';
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { toggleWishlist, initWishlist } from '@/store/wishlistSlice';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import CheckIcon from '@mui/icons-material/Check';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariation, setSelectedVariation] = useState<Record<string, string>>({});
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const isWishlisted = wishlistItems.some(i => i.id === product.id);
  const { addToCart } = useCart();

  useEffect(() => { dispatch(initWishlist()); }, [dispatch]);

  const price = product.sale_price || product.price;
  const inStock = product.stock_status === 'instock';

  const handleQtyChange = (val: number) => setQuantity(Math.max(1, val));

  const handleAddToCart = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await addToCart(
        product.id,
        quantity,
        Object.keys(selectedVariation).length ? selectedVariation : undefined,
        product.name,
        price,
        product.images[0] ? { src: product.images[0].src, alt: product.images[0].alt } : undefined
      );
      toast.success(`"${product.name}" added to cart`);
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    } catch {
      toast.error('Failed to add to cart');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Breadcrumb */}
      <Typography variant="body2" color="text.secondary" mb={3}>
        <Link href="/" style={{ color: 'inherit' }}>Home</Link>
        {' / '}
        <Link href="/products" style={{ color: 'inherit' }}>Products</Link>
        {' / '}
        {product.name}
      </Typography>

      <Grid container spacing={6}>
        {/* Images */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden', mb: 1 }}>
            <img
              src={product.images[activeImage]?.src || '/placeholder.jpg'}
              alt={product.images[activeImage]?.alt || product.name}
              style={{ width: '100%', height: 420, objectFit: 'contain', display: 'block' }}
            />
          </Box>
          {/* Thumbnails */}
          {product.images.length > 1 && (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {product.images.map((img, i) => (
                <Box
                  key={img.id}
                  onClick={() => setActiveImage(i)}
                  sx={{
                    width: 72, height: 72, cursor: 'pointer', border: '2px solid',
                    borderColor: activeImage === i ? 'primary.main' : 'divider',
                    borderRadius: 1, overflow: 'hidden',
                  }}
                >
                  <img src={img.src} alt={img.alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </Box>
              ))}
            </Box>
          )}
        </Grid>

        {/* Info */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            {product.name}
          </Typography>

          {/* Price */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Typography variant="h4" color="primary" fontWeight="bold">
              ${parseFloat(price).toFixed(2)}
            </Typography>
            {product.sale_price && product.regular_price && (
              <Typography variant="h6" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                ${parseFloat(product.regular_price).toFixed(2)}
              </Typography>
            )}
            {product.sale_price && (
              <Chip label="Sale" color="error" size="small" />
            )}
          </Box>

          {/* Stock */}
          <Chip
            label={inStock ? 'In Stock' : 'Out of Stock'}
            color={inStock ? 'success' : 'error'}
            size="small"
            sx={{ mb: 2 }}
          />

          {/* Short Description */}
          {product.short_description && (
            <Typography variant="body1" color="text.secondary" mb={2} component="div">
              <span dangerouslySetInnerHTML={{ __html: product.short_description }} />
            </Typography>
          )}

          <Divider sx={{ my: 2 }} />

          {/* Attributes / Variations */}
          {product.attributes?.length > 0 && (
            <Box mb={2}>
              {product.attributes.map((attr) => (
                <Box key={attr.id} mb={2}>
                  <Typography variant="subtitle2" fontWeight="bold" mb={1}>{attr.name}</Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {attr.options.map((option) => (
                      <Button
                        key={option}
                        size="small"
                        variant={selectedVariation[attr.name] === option ? 'contained' : 'outlined'}
                        onClick={() => setSelectedVariation((prev) => ({ ...prev, [attr.name]: option }))}
                        sx={{ minWidth: 48 }}
                      >
                        {option}
                      </Button>
                    ))}
                  </Box>
                </Box>
              ))}
            </Box>
          )}

          {/* Quantity + Add to Cart + Wishlist */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            {/* Quantity Stepper */}
            <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <IconButton size="small" onClick={() => handleQtyChange(quantity - 1)} disabled={quantity <= 1}>
                <RemoveIcon fontSize="small" />
              </IconButton>
              <Typography sx={{ px: 2, minWidth: 40, textAlign: 'center', fontWeight: 'bold' }}>
                {quantity}
              </Typography>
              <IconButton size="small" onClick={() => handleQtyChange(quantity + 1)}>
                <AddIcon fontSize="small" />
              </IconButton>
            </Box>

            {/* Add to Cart */}
            <Button
              variant={added ? 'outlined' : 'contained'}
              color={added ? 'success' : 'primary'}
              size="large"
              onClick={handleAddToCart}
              disabled={!inStock || loading}
              startIcon={added ? <CheckIcon /> : <AddShoppingCartIcon />}
              sx={{ flexGrow: 1, py: 1.5 }}
            >
              {!inStock ? 'Out of Stock' : loading ? 'Adding...' : added ? 'Added to Cart!' : 'Add to Cart'}
            </Button>

            {/* Wishlist */}
            <Tooltip title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}>
              <IconButton onClick={() => dispatch(toggleWishlist(product))} color={isWishlisted ? 'error' : 'default'}>
                {isWishlisted ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </IconButton>
            </Tooltip>
          </Box>

          {/* View Cart link after adding */}
          {added && (
            <Typography variant="body2" mb={2}>
              <Link href="/cart" style={{ fontWeight: 600 }}>View Cart →</Link>
            </Typography>
          )}

          <Divider sx={{ my: 2 }} />

          {/* Meta */}
          {product.categories?.length > 0 && (
            <Typography variant="body2" color="text.secondary">
              Category:{' '}
              {product.categories.map((c) => c.name).join(', ')}
            </Typography>
          )}

          {/* Full Description */}
          {product.description && (
            <Box mt={3}>
              <Typography variant="subtitle2" fontWeight="bold" mb={1}>Description</Typography>
              <Typography variant="body2" color="text.secondary" component="div">
                <span dangerouslySetInnerHTML={{ __html: product.description }} />
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
