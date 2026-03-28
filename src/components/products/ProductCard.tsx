'use client';

import { Product } from '@/types';
import { Card, CardContent, CardMedia, Typography, Button, CardActions } from '@mui/material';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
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
          variant="contained"
          color="primary"
          onClick={handleAddToCart}
          disabled={loading || product.stock_status === 'outofstock'}
          startIcon={<AddShoppingCartIcon />}
        >
          {product.stock_status === 'outofstock' ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </CardActions>
    </Card>
  );
}