'use client';

import { Grid, Paper, Box, Typography } from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

const values = [
  {
    icon: <StorefrontIcon fontSize="large" />,
    title: 'Quality Products',
    desc: 'Carefully curated selection of top-quality items.',
  },
  {
    icon: <LocalShippingIcon fontSize="large" />,
    title: 'Fast Shipping',
    desc: 'Quick and reliable delivery to your doorstep.',
  },
  {
    icon: <SupportAgentIcon fontSize="large" />,
    title: '24/7 Support',
    desc: 'Our team is always here to help you.',
  },
];

export default function AboutValues() {
  return (
    <Grid container spacing={4}>
      {values.map(({ icon, title, desc }) => (
        <Grid size={{ xs: 12, md: 4 }} key={title}>
          <Paper sx={{ p: 4, textAlign: 'center', height: '100%' }} elevation={2}>
            <Box color="primary.main" mb={2}>
              {icon}
            </Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              {title}
            </Typography>
            <Typography color="text.secondary">{desc}</Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}
