'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import DashboardLayout from '@/components/common/DashboardLayout';
import {
  Typography, Chip, Box, Paper, Divider, Grid,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, CircularProgress,
} from '@mui/material';
import { Order } from '@/types';
import axios from 'axios';
import Link from 'next/link';

const STATUS_COLOR: Record<string, 'default' | 'warning' | 'success' | 'error' | 'info'> = {
  pending: 'warning',
  processing: 'info',
  'on-hold': 'default',
  completed: 'success',
  cancelled: 'error',
  refunded: 'default',
  failed: 'error',
};

export default function OrderDetailClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login?callbackUrl=/dashboard/orders');
    if (status === 'authenticated') {
      axios.get(`/api/user/orders/${id}`)
        .then((r) => setOrder(r.data))
        .catch(() => setError('Order not found.'))
        .finally(() => setLoading(false));
    }
  }, [status, router, id]);

  if (status === 'loading' || !session) return null;

  return (
    <DashboardLayout>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          Order Details
        </Typography>
        <Link href="/dashboard/orders" passHref>
          <Button variant="outlined" size="small">← Back to Orders</Button>
        </Link>
      </Box>

      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}

      {order && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Order Meta */}
          <Paper sx={{ p: 3 }} elevation={1}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">Order Number</Typography>
                <Typography fontWeight="bold">#{order.number}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Date</Typography>
                <Typography>{new Date(order.date_created).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Status</Typography>
                <Box mt={0.5}>
                  <Chip
                    label={order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('-', ' ')}
                    color={STATUS_COLOR[order.status] ?? 'default'}
                    size="small"
                  />
                </Box>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Total</Typography>
                <Typography fontWeight="bold">{order.currency} {order.total}</Typography>
              </Box>
            </Box>
          </Paper>

          {/* Order Items */}
          <Paper sx={{ p: 3 }} elevation={1}>
            <Typography variant="h6" fontWeight="bold" mb={2}>Order Items</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell><Typography variant="body2" fontWeight="bold">Product</Typography></TableCell>
                    <TableCell align="center"><Typography variant="body2" fontWeight="bold">Quantity</Typography></TableCell>
                    <TableCell align="right"><Typography variant="body2" fontWeight="bold">Total</Typography></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.line_items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          {item.image?.src && (
                            <img src={item.image.src} alt={item.name} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} />
                          )}
                          <Typography variant="body2">{item.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2">× {item.quantity}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2">{order.currency} {item.total}</Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 4 }}>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="body2" color="text.secondary">Subtotal</Typography>
                <Typography variant="body2" color="text.secondary" mt={0.5}>Shipping</Typography>
                <Typography fontWeight="bold" mt={0.5}>Total</Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="body2">{order.currency} {order.total}</Typography>
                <Typography variant="body2" color="text.secondary" mt={0.5}>Free</Typography>
                <Typography fontWeight="bold" mt={0.5}>{order.currency} {order.total}</Typography>
              </Box>
            </Box>
          </Paper>

          {/* Billing Address */}
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper sx={{ p: 3 }} elevation={1}>
                <Typography variant="h6" fontWeight="bold" mb={2}>Billing Address</Typography>
                <Typography variant="body2">{order.billing.first_name} {order.billing.last_name}</Typography>
                <Typography variant="body2">{order.billing.address_1}</Typography>
                <Typography variant="body2">{order.billing.city}, {order.billing.state} {order.billing.postcode}</Typography>
                <Typography variant="body2">{order.billing.country}</Typography>
                <Typography variant="body2" mt={1}>{order.billing.email}</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )}
    </DashboardLayout>
  );
}
