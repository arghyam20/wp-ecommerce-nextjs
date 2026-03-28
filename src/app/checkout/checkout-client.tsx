'use client';

import Layout from '@/components/common/Layout';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import {
  Container, Typography, Grid, Paper, Divider, Box, Button, Alert,
  Table, TableBody, TableCell, TableHead, TableRow,
} from '@mui/material';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function CheckoutClient() {
  const { cart } = useCart();

  if (!cart || cart.items.length === 0) {
    return (
      <Layout>
        <Container maxWidth="sm" sx={{ py: 10 }}>
          <Alert severity="info" sx={{ mb: 3 }}>
            Your cart is empty — you cannot checkout.
          </Alert>
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
        <Grid container spacing={5}>
          {/* Left — Billing Form */}
          <Grid size={{ xs: 12, md: 7 }}>
            <CheckoutForm />
          </Grid>

          {/* Right — Order Review */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Paper sx={{ p: 3 }} elevation={2}>
              <Typography variant="h6" fontWeight="bold" mb={2}>Your Order</Typography>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell><Typography variant="body2" fontWeight="bold">Product</Typography></TableCell>
                    <TableCell align="right"><Typography variant="body2" fontWeight="bold">Subtotal</Typography></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cart.items.map((item) => (
                    <TableRow key={item.key}>
                      <TableCell>
                        <Typography variant="body2">
                          {item.name}{' '}
                          <Typography component="span" variant="body2" color="text.secondary">
                            × {item.quantity}
                          </Typography>
                        </Typography>
                        {item.variation && Object.keys(item.variation).length > 0 && (
                          <Typography variant="caption" color="text.secondary" display="block">
                            {Object.entries(item.variation).map(([k, v]) => `${k}: ${v}`).join(', ')}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2">
                          ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell><Typography variant="body2">Subtotal</Typography></TableCell>
                    <TableCell align="right"><Typography variant="body2">${cart.subtotal}</Typography></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><Typography variant="body2" color="text.secondary">Shipping</Typography></TableCell>
                    <TableCell align="right"><Typography variant="body2" color="text.secondary">Free</Typography></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography fontWeight="bold" variant="h6">Total</Typography>
                <Typography fontWeight="bold" variant="h6" color="primary">${cart.total}</Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
}
