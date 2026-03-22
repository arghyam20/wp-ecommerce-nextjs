import type { Metadata } from 'next';
import Layout from '@/components/common/Layout';
import { Container, Typography, Box, Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Order Confirmed',
  description: 'Your order has been placed successfully.',
  robots: { index: false, follow: false },
};

export default function OrderConfirmationPage() {
  return (
    <Layout>
      <Container maxWidth="sm" sx={{ py: 12, textAlign: 'center' }}>
        <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>Order Placed!</Typography>
        <Typography color="text.secondary" mb={4}>
          Thank you for your purchase. You will receive a confirmation email shortly.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Link href="/dashboard/orders" passHref>
            <Button variant="contained">View Orders</Button>
          </Link>
          <Link href="/products" passHref>
            <Button variant="outlined">Continue Shopping</Button>
          </Link>
        </Box>
      </Container>
    </Layout>
  );
}
