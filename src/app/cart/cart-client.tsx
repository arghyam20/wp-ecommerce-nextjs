'use client';

import Layout from '@/components/common/Layout';
import { Container, Typography, Box, Button, Divider, IconButton, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import Image from 'next/image';

export default function CartClient() {
  const { cart, removeFromCart, updateQuantity } = useCart();

  if (!cart || cart.items.length === 0) {
    return (
      <Layout>
        <Container maxWidth="md" sx={{ py: 10, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>Your cart is empty</Typography>
          <Link href="/products" passHref>
            <Button variant="contained" size="large" sx={{ mt: 2 }}>Shop Now</Button>
          </Link>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" mb={4}>Shopping Cart</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {cart.items.map((item) => (
            <Paper key={item.key} sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }} elevation={1}>
              {item.image && (
                <Box sx={{ position: 'relative', width: 80, height: 80, flexShrink: 0 }}>
                  <Image src={item.image.src} alt={item.image.alt} fill style={{ objectFit: 'cover' }} />
                </Box>
              )}
              <Box sx={{ flexGrow: 1 }}>
                <Typography fontWeight="bold">{item.name}</Typography>
                <Typography color="text.secondary">${item.price}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton size="small" onClick={() => updateQuantity(item.key, item.quantity - 1)} disabled={item.quantity <= 1}>
                  <RemoveIcon fontSize="small" />
                </IconButton>
                <Typography>{item.quantity}</Typography>
                <IconButton size="small" onClick={() => updateQuantity(item.key, item.quantity + 1)}>
                  <AddIcon fontSize="small" />
                </IconButton>
              </Box>
              <Typography fontWeight="bold" sx={{ minWidth: 80, textAlign: 'right' }}>${item.line_total}</Typography>
              <IconButton color="error" onClick={() => removeFromCart(item.key)}>
                <DeleteIcon />
              </IconButton>
            </Paper>
          ))}
        </Box>
        <Divider sx={{ my: 3 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" fontWeight="bold">Total: ${cart.total}</Typography>
          <Link href="/checkout" passHref>
            <Button variant="contained" size="large">Proceed to Checkout</Button>
          </Link>
        </Box>
      </Container>
    </Layout>
  );
}
