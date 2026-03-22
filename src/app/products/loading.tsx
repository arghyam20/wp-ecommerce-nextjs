'use client';

import { Container, Grid, Skeleton, Box } from '@mui/material';
import Layout from '@/components/common/Layout';

export default function ProductsLoading() {
  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Skeleton variant="text" width={200} height={48} sx={{ mx: 'auto', mb: 4 }} />
        <Grid container spacing={3}>
          {Array.from({ length: 12 }).map((_, i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
              <Box>
                <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 1 }} />
                <Skeleton variant="text" sx={{ mt: 1 }} />
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="rectangular" height={36} sx={{ mt: 1, borderRadius: 1 }} />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Layout>
  );
}
