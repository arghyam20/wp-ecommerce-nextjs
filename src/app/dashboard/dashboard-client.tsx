'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/common/DashboardLayout';
import { Typography, Box, Button } from '@mui/material';
import Link from 'next/link';

export default function DashboardClient() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login?callbackUrl=/dashboard');
  }, [status, router]);

  if (status === 'loading' || !session) return null;

  const name = session.user?.name || session.user?.email || 'there';

  return (
    <DashboardLayout>
      <Typography variant="body1" mb={3}>
        Hello <strong>{name}</strong> (not {name}?{' '}
        <Link href="/api/auth/signout" style={{ color: 'inherit' }}>Log out</Link>)
      </Typography>
      <Typography variant="body1" color="text.secondary">
        From your account dashboard you can view your{' '}
        <Link href="/dashboard/orders"><strong>recent orders</strong></Link>,
        manage your{' '}
        <Link href="/dashboard/profile"><strong>account details</strong></Link>{' '}
        and{' '}
        <Link href="/dashboard/change-password"><strong>change your password</strong></Link>.
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mt: 4, flexWrap: 'wrap' }}>
        <Link href="/dashboard/orders" passHref>
          <Button variant="outlined">View Orders</Button>
        </Link>
        <Link href="/dashboard/profile" passHref>
          <Button variant="outlined">Account Details</Button>
        </Link>
        <Link href="/products" passHref>
          <Button variant="outlined">Browse Products</Button>
        </Link>
      </Box>
    </DashboardLayout>
  );
}
