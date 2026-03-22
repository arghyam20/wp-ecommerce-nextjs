'use client';

import { Product } from '@/types';
import { Container, Grid, Typography, Button, TextField, Paper, Divider } from '@mui/material';
import Image from 'next/image';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import toast from 'react-hot-toast';

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariation, setSelectedVariation] = useState<Record<string, string>>({});
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    try {
      await addToCart(product.id, quantity, selectedVariation);
      toast.success('Product added to cart!');
    } catch {
      toast.error('Failed to add product to cart');
    }
  };

  return (
    <Container maxWidth="lg" className="py-8">
      <Grid container spacing={4}>
        {/* Product Images */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={2} className="p-4">
            <div className="relative h-96 w-full">
              <Image
                src={product.images[0]?.src || '/placeholder.jpg'}
                alt={product.images[0]?.alt || product.name}
                fill
                className="object-contain"
              />
            </div>
          </Paper>
        </Grid>

        {/* Product Info */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {product.name}
          </Typography>

          <div className="flex items-center gap-4 mb-4">
            {product.sale_price ? (
              <>
                <Typography variant="h4" color="primary">
                  ${product.sale_price}
                </Typography>
                <Typography variant="h6" color="text.secondary" className="line-through">
                  ${product.regular_price}
                </Typography>
              </>
            ) : (
              <Typography variant="h4" color="primary">
                ${product.price}
              </Typography>
            )}
          </div>

          <Divider className="my-4" />

          {/* Description */}
          <Typography variant="body1" className="mb-6" component="div">
            <div dangerouslySetInnerHTML={{ __html: product.description }} />
          </Typography>

          {/* Attributes/Variations */}
          {product.attributes && product.attributes.length > 0 && (
            <div className="mb-6">
              {product.attributes.map((attribute) => (
                <div key={attribute.id} className="mb-4">
                  <Typography variant="subtitle1" className="mb-2">
                    {attribute.name}
                  </Typography>
                  <div className="flex gap-2">
                    {attribute.options.map((option) => (
                      <Button
                        key={option}
                        variant={selectedVariation[attribute.name] === option ? 'contained' : 'outlined'}
                        onClick={() => setSelectedVariation({ ...selectedVariation, [attribute.name]: option })}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <Typography variant="subtitle1" className="mb-2">
              Quantity
            </Typography>
            <TextField
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              inputProps={{ min: 1 }}
              size="small"
              className="w-24"
            />
          </div>

          {/* Add to Cart Button */}
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={handleAddToCart}
            disabled={product.stock_status === 'outofstock'}
            startIcon={<AddShoppingCartIcon />}
            className="py-3"
          >
            {product.stock_status === 'outofstock' ? 'Out of Stock' : 'Add to Cart'}
          </Button>

          {/* Stock Status */}
          <Typography
            variant="body2"
            className="mt-4"
            color={product.stock_status === 'instock' ? 'success.main' : 'error.main'}
          >
            Status: {product.stock_status === 'instock' ? 'In Stock' : 'Out of Stock'}
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
}