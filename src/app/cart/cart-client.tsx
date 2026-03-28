'use client';

import Layout from '@/components/common/Layout';
import {
  Container, Typography, Box, Button, Divider, IconButton,
  Paper, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, TextField, Grid, Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function CartClient() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [coupon, setCoupon] = useState('');

  if (!cart || cart.items.length === 0) {
    return (
      <Layout>
        <Container maxWidth="md" sx={{ py: 10 }}>
          <Alert severity="info" sx={{ mb: 3 }}>Your cart is currently empty.</Alert>
          <Link href="/products" passHref>
            <Button variant="contained">Return to Shop</Button>
          </Link>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" mb={4}>Cart</Typography>
        <Grid container spacing={4}>
          {/* Cart Table */}
          <Grid size={{ xs: 12, md: 8 }}>
            <TableContainer component={Paper} elevation={1}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell><Typography fontWeight="bold">Product</Typography></TableCell>
                    <TableCell><Typography fontWeight="bold">Price</Typography></TableCell>
                    <TableCell><Typography fontWeight="bold">Quantity</Typography></TableCell>
                    <TableCell><Typography fontWeight="bold">Subtotal</Typography></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cart.items.map((item) => (
                    <TableRow key={item.key}>
                      <TableCell padding="checkbox">
                        <IconButton size="small" color="default" onClick={() => removeFromCart(item.key)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                      <TableCell sx={{ width: 72 }}>
                        {item.image ? (
                          <img
                            src={item.image.src}
                            alt={item.image.alt || item.name}
                            style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 4, display: 'block' }}
                          />
                        ) : (
                          <Box sx={{ width: 56, height: 56, bgcolor: 'grey.100', borderRadius: 1 }} />
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">{item.name}</Typography>
                        {item.variation && Object.keys(item.variation).length > 0 && (
                          <Typography variant="caption" color="text.secondary">
                            {Object.entries(item.variation).map(([k, v]) => `${k}: ${v}`).join(', ')}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">${parseFloat(item.price).toFixed(2)}</Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <IconButton size="small" onClick={() => updateQuantity(item.key, item.quantity - 1)} disabled={item.quantity <= 1}>
                            <RemoveIcon fontSize="small" />
                          </IconButton>
                          <Typography sx={{ minWidth: 24, textAlign: 'center' }}>{item.quantity}</Typography>
                          <IconButton size="small" onClick={() => updateQuantity(item.key, item.quantity + 1)}>
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Coupon + Clear Cart */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  size="small"
                  placeholder="Coupon code"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                />
                <Button variant="outlined" onClick={() => toast('Coupon feature coming soon')}>
                  Apply Coupon
                </Button>
              </Box>
              <Button variant="outlined" color="error" onClick={() => clearCart()}>
                Clear Cart
              </Button>
            </Box>
          </Grid>

          {/* Cart Totals */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 3 }} elevation={2}>
              <Typography variant="h6" fontWeight="bold" mb={2}>Cart Totals</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Subtotal</Typography>
                <Typography>${cart.subtotal}</Typography>
              </Box>
              <Divider sx={{ my: 1.5 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Shipping</Typography>
                <Typography color="text.secondary" variant="body2">Calculated at checkout</Typography>
              </Box>
              <Divider sx={{ my: 1.5 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography fontWeight="bold" variant="h6">Total</Typography>
                <Typography fontWeight="bold" variant="h6">${cart.total}</Typography>
              </Box>
              <Link href="/checkout" passHref>
                <Button variant="contained" size="large" fullWidth>
                  Proceed to Checkout
                </Button>
              </Link>
              <Link href="/products" passHref>
                <Button variant="text" fullWidth sx={{ mt: 1 }}>
                  Continue Shopping
                </Button>
              </Link>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
}
