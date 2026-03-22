import type { Metadata } from 'next';
import Layout from '@/components/common/Layout';
import AboutValues from './about-values';
import { Container, Typography, Box, Grid } from '@mui/material';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about MyStore — our story, mission, and commitment to quality products and exceptional service.',
  openGraph: {
    title: 'About Us | MyStore',
    description: 'Learn about MyStore — our story, mission, and commitment to quality.',
    url: '/about',
  },
};

export default function AboutPage() {
  return (
    <Layout>
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 10, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" fontWeight="bold" gutterBottom>About Us</Typography>
          <Typography variant="h6">
            We&apos;re passionate about bringing you the best products at unbeatable prices.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4} mb={8}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>Our Story</Typography>
            <Typography color="text.secondary" paragraph>
              Founded in 2020, MyStore started with a simple mission: make quality products accessible to everyone.
              What began as a small online shop has grown into a trusted destination for thousands of happy customers.
            </Typography>
            <Typography color="text.secondary">
              We partner with top brands and independent makers to offer a diverse catalog that meets every need and budget.
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>Our Mission</Typography>
            <Typography color="text.secondary" paragraph>
              To provide an exceptional shopping experience through a seamless platform, transparent pricing, and outstanding customer service.
            </Typography>
            <Typography color="text.secondary">
              We believe shopping should be easy, enjoyable, and trustworthy — every single time.
            </Typography>
          </Grid>
        </Grid>

        <Typography variant="h4" fontWeight="bold" textAlign="center" mb={4}>Why Choose Us</Typography>
        <AboutValues />
      </Container>
    </Layout>
  );
}
