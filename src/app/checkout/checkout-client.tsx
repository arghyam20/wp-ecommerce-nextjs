'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/common/Layout';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import { Container, Typography, Grid, Paper, Divider, Box } from '@mui/material';
import { useCart } from '@/context/CartContext';

export default function CheckoutClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { cart } = useCart();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/checkout');
    }
  }, [status, router]);

  if (status === 'loading' || !session) return null;

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" mb={4}>Checkout</Typography>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 8 }}>
            <CheckoutForm />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 3 }} elevation={2}>
              <Typography variant="h6" fontWeight="bold" mb={2}>Order Summary</Typography>
              {cart?.items.map((item) => (
                <Box key={item.key} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">{item.name} × {item.quantity}</Typography>
                  <Typography variant="body2">${item.line_total}</Typography>
                </Box>
              ))}
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography fontWeight="bold">Total</Typography>
                <Typography fontWeight="bold">${cart?.total || '0.00'}</Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
}
