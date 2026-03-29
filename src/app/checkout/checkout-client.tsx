'use client';

import Layout from '@/components/common/Layout';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import {
  Container, Typography, Grid, Paper, Divider, Box, Button, Alert,
} from '@mui/material';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function CheckoutClient() {
  const { cart } = useCart();

  if (!cart || cart.items.length === 0) {
    return (
      <Layout>
        <Container maxWidth="sm" sx={{ py: 10 }}>
          <Alert severity="info" sx={{ mb: 3 }}>Your cart is empty — you cannot checkout.</Alert>
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
        <Typography variant="h4" component="h1" fontWeight="bold" mb={4}>Checkout</Typography>
        <Grid container spacing={5} alignItems="flex-start">

          {/* Left — Billing Form */}
          <Grid size={{ xs: 12, md: 7 }}>
            <CheckoutForm />
          </Grid>

          {/* Right — Sticky Order Summary */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box sx={{ position: 'sticky', top: 80 }}>
              <Paper sx={{ p: 3 }} elevation={2}>
                <Typography variant="h6" fontWeight="bold" mb={2}>Your Order</Typography>

                {/* Header row */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 1, borderBottom: '2px solid', borderColor: 'divider' }}>
                  <Typography variant="body2" fontWeight="bold">Product</Typography>
                  <Typography variant="body2" fontWeight="bold">Subtotal</Typography>
                </Box>

                {/* Items */}
                <Box sx={{ my: 1 }}>
                  {cart.items.map((item) => (
                    <Box key={item.key} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                      {item.image && (
                        <Box sx={{ position: 'relative', flexShrink: 0 }}>
                          <img
                            src={item.image.src}
                            alt={item.image.alt || item.name}
                            style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 4 }}
                          />
                          <Box sx={{
                            position: 'absolute', top: -6, right: -6,
                            bgcolor: 'grey.600', color: 'white',
                            borderRadius: '50%', width: 18, height: 18,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 10, fontWeight: 'bold',
                          }}>
                            {item.quantity}
                          </Box>
                        </Box>
                      )}
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography variant="body2" fontWeight="medium" noWrap>{item.name}</Typography>
                        {item.variation && Object.keys(item.variation).length > 0 && (
                          <Typography variant="caption" color="text.secondary">
                            {Object.entries(item.variation).map(([k, v]) => `${k}: ${v}`).join(', ')}
                          </Typography>
                        )}
                      </Box>
                      <Typography variant="body2" fontWeight="medium" sx={{ flexShrink: 0 }}>
                        ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                {/* Totals */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                  <Typography variant="body2">Subtotal</Typography>
                  <Typography variant="body2">${cart.subtotal}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                  <Typography variant="body2" color="text.secondary">Shipping</Typography>
                  <Typography variant="body2" color="success.main" fontWeight="medium">Free</Typography>
                </Box>
                <Divider sx={{ my: 1.5 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6" fontWeight="bold">Total</Typography>
                  <Typography variant="h6" fontWeight="bold" color="primary">${cart.total}</Typography>
                </Box>

                {/* Edit cart link */}
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Link href="/cart" style={{ fontSize: 13, color: 'inherit' }}>
                    ← Edit Cart
                  </Link>
                </Box>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
}
