'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/common/DashboardLayout';
import {
  Typography,
  Chip,
  Button,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { Order } from '@/types';
import axios from 'axios';
import Link from 'next/link';

const STATUS_COLOR: Record<
  string,
  'default' | 'warning' | 'success' | 'error' | 'info' | 'primary'
> = {
  pending: 'warning',
  processing: 'info',
  'on-hold': 'default',
  completed: 'success',
  cancelled: 'error',
  refunded: 'default',
  failed: 'error',
};

export default function OrdersClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login?callbackUrl=/dashboard/orders');
    if (status === 'authenticated') {
      axios
        .get('/api/user/orders')
        .then((r) => setOrders(r.data))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [status, router]);

  if (status === 'loading' || !session) return null;

  return (
    <DashboardLayout>
      <Typography variant="h5" component="h1" fontWeight="bold" mb={3}>
        Orders
      </Typography>
      {!loading && orders.length === 0 ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          No orders have been made yet.{' '}
          <Link href="/products">
            <strong>Browse products</strong>
          </Link>
        </Alert>
      ) : (
        <TableContainer component={Paper} elevation={1}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    Order
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    Date
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    Status
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    Total
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    Actions
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      #{order.number}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(order.date_created).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={
                        order.status.charAt(0).toUpperCase() +
                        order.status.slice(1).replace('-', ' ')
                      }
                      color={STATUS_COLOR[order.status] ?? 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {order.currency} {order.total} for{' '}
                      {order.line_items.reduce((s, i) => s + i.quantity, 0)} item(s)
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Link href={`/dashboard/orders/${order.id}`} passHref>
                      <Button size="small" variant="outlined">
                        View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </DashboardLayout>
  );
}
