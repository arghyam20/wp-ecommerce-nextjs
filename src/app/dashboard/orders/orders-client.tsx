'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/common/DashboardLayout';
import { Typography, Paper, Box, Chip, Divider } from '@mui/material';
import { Order } from '@/types';
import axios from 'axios';

const statusColor: Record<string, 'default' | 'warning' | 'success' | 'error' | 'info'> = {
  pending: 'warning',
  processing: 'info',
  completed: 'success',
  cancelled: 'error',
  refunded: 'default',
};

export default function OrdersClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login?callbackUrl=/dashboard/orders');
    if (status === 'authenticated') {
      axios.get('/api/user/orders').then((r) => setOrders(r.data)).catch(() => {});
    }
  }, [status, router]);

  if (status === 'loading' || !session) return null;

  return (
    <DashboardLayout>
      <Typography variant="h5" component="h1" fontWeight="bold" mb={3}>My Orders</Typography>
      {orders.length === 0 ? (
        <Typography color="text.secondary">You have no orders yet.</Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {orders.map((order) => (
            <Paper key={order.id} sx={{ p: 3 }} elevation={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography fontWeight="bold">Order #{order.number}</Typography>
                <Chip
                  label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  color={statusColor[order.status] || 'default'}
                  size="small"
                />
              </Box>
              <Typography variant="body2" color="text.secondary" mb={1}>
                {new Date(order.date_created).toLocaleDateString()}
              </Typography>
              <Divider sx={{ my: 1 }} />
              {order.line_items.map((item) => (
                <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                  <Typography variant="body2">{item.name} × {item.quantity}</Typography>
                  <Typography variant="body2">{order.currency} {item.total}</Typography>
                </Box>
              ))}
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Typography fontWeight="bold">Total: {order.currency} {order.total}</Typography>
              </Box>
            </Paper>
          ))}
        </Box>
      )}
    </DashboardLayout>
  );
}
