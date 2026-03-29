'use client';

import { Box, Container, Typography, Grid, Divider } from '@mui/material';
import Link from 'next/link';

const LINKS = {
  Shop: [
    { label: 'All Products', href: '/products' },
    { label: 'Wishlist', href: '/wishlist' },
    { label: 'Cart', href: '/cart' },
    { label: 'Checkout', href: '/checkout' },
  ],
  'My Account': [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Orders', href: '/dashboard/orders' },
    { label: 'Addresses', href: '/dashboard/addresses' },
    { label: 'Account Details', href: '/dashboard/profile' },
  ],
  Information: [
    { label: 'About Us', href: '/about' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms & Conditions', href: '/terms' },
  ],
};

export default function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: 'grey.900', color: 'grey.300', mt: 'auto' }}>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          {/* Brand */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography variant="h6" fontWeight="bold" color="white" mb={1}>MyStore</Typography>
            <Typography variant="body2" color="grey.500">
              Your one-stop shop for quality products at great prices. Fast shipping, easy returns.
            </Typography>
          </Grid>

          {/* Link columns */}
          {Object.entries(LINKS).map(([title, links]) => (
            <Grid key={title} size={{ xs: 6, md: 3 }}>
              <Typography variant="subtitle2" fontWeight="bold" color="white" mb={2} textTransform="uppercase" letterSpacing={1}>
                {title}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {links.map(({ label, href }) => (
                  <Link key={href} href={href} style={{ textDecoration: 'none' }}>
                    <Typography variant="body2" color="grey.400" sx={{ '&:hover': { color: 'white' }, transition: 'color 0.2s' }}>
                      {label}
                    </Typography>
                  </Link>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ borderColor: 'grey.700', my: 4 }} />
        <Typography variant="body2" color="grey.500" textAlign="center">
          © {new Date().getFullYear()} MyStore. All rights reserved. Built with Next.js & WooCommerce.
        </Typography>
      </Container>
    </Box>
  );
}
