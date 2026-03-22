'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/common/DashboardLayout';
import { Typography, Paper, Box, Button, Grid } from '@mui/material';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import PersonIcon from '@mui/icons-material/Person';
import Link from 'next/link';

const cards = [
  { label: 'My Orders', desc: 'View your order history', href: '/dashboard/orders', icon: <ShoppingBagIcon fontSize="large" color="primary" /> },
  { label: 'Profile', desc: 'Update your personal info', href: '/dashboard/profile', icon: <PersonIcon fontSize="large" color="primary" /> },
];

export default function DashboardClient() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login?callbackUrl=/dashboard');
  }, [status, router]);

  if (status === 'loading' || !session) return null;

  const name = session.user?.name || 'there';

  return (
    <DashboardLayout>
      <Typography variant="h4" fontWeight="bold" mb={1}>Welcome, {name}!</Typography>
      <Typography color="text.secondary" mb={4}>Manage your account and orders from here.</Typography>
      <Grid container spacing={3}>
        {cards.map(({ label, desc, href, icon }) => (
          <Grid size={{ xs: 12, sm: 6 }} key={href}>
            <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 1 }} elevation={2}>
              <Box>{icon}</Box>
              <Typography variant="h6" fontWeight="bold">{label}</Typography>
              <Typography color="text.secondary" variant="body2">{desc}</Typography>
              <Link href={href} passHref>
                <Button variant="outlined" size="small" sx={{ alignSelf: 'flex-start', mt: 1 }}>Go</Button>
              </Link>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </DashboardLayout>
  );
}
