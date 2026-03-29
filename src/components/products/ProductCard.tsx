'use client';

import { Product } from '@/types';
import { Card, CardContent, CardMedia, Typography, Button, CardActions, IconButton, Box, Tooltip } from '@mui/material';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { toggleWishlist } from '@/store/wishlistSlice';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import CheckIcon from '@mui/icons-material/Check';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const dispatch = useDispatch<AppDispatch>();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const isWishlisted = wishlistItems.some(i => i.id === product.id);
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await addToCart(
        product.id,
        1,
        undefined,
        product.name,
        product.sale_price || product.price,
        product.images[0] ? { src: product.images[0].src, alt: product.images[0].alt } : undefined
      );
      toast.success(`"${product.name}" added to cart`);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch {
      toast.error('Failed to add to cart');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow" sx={{ position: 'relative' }}>
      {/* Wishlist button */}
      <Tooltip title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}>
        <IconButton
          size="small"
          onClick={() => dispatch(toggleWishlist(product))}
          sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'white', zIndex: 1, '&:hover': { bgcolor: 'white' } }}
        >
          {isWishlisted ? <FavoriteIcon color="error" fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
        </IconButton>
      </Tooltip>

      {/* Sale badge */}
      {product.sale_price && (
        <Box sx={{ position: 'absolute', top: 8, left: 8, bgcolor: 'error.main', color: 'white', px: 1, py: 0.25, borderRadius: 1, fontSize: 12, fontWeight: 'bold', zIndex: 1 }}>
          Sale
        </Box>
      )}
      <Link href={`/products/${product.slug}`}>
        <CardMedia
          component="img"
          height="200"
          image={product.images[0]?.src || '/placeholder.jpg'}
          alt={product.images[0]?.alt || product.name}
          className="object-cover h-48 cursor-pointer"
        />
      </Link>
      
      <CardContent className="flex-grow">
        <Link href={`/products/${product.slug}`} className="no-underline">
          <Typography gutterBottom variant="h6" component="h3" className="hover:text-blue-600">
            {product.name}
          </Typography>
        </Link>
        
        <Typography variant="body2" color="text.secondary" className="mb-2">
          {product.short_description.replace(/<[^>]*>/g, '').substring(0, 100)}...
        </Typography>
        
        <div className="flex items-center gap-2">
          {product.sale_price ? (
            <>
              <Typography variant="h6" color="primary">
                ${product.sale_price}
              </Typography>
              <Typography variant="body2" color="text.secondary" className="line-through">
                ${product.regular_price}
              </Typography>
            </>
          ) : (
            <Typography variant="h6" color="primary">
              ${product.price}
            </Typography>
          )}
        </div>
      </CardContent>
      
      <CardActions>
        <Button
          fullWidth
          variant={added ? 'outlined' : 'contained'}
          color={added ? 'success' : 'primary'}
          onClick={handleAddToCart}
          disabled={loading || product.stock_status === 'outofstock'}
          startIcon={added ? <CheckIcon /> : <AddShoppingCartIcon />}
        >
          {product.stock_status === 'outofstock' ? 'Out of Stock' : added ? 'Added!' : loading ? 'Adding...' : 'Add to Cart'}
        </Button>
      </CardActions>
    </Card>
  );
}