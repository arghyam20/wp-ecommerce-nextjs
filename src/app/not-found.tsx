import Layout from "@/components/common/Layout";
import { Container, Typography, Box, Button } from "@mui/material";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import Link from "next/link";

export default function NotFound() {
  return (
    <Layout>
      <Container maxWidth="sm" sx={{ py: 14, textAlign: "center" }}>
        <SearchOffIcon sx={{ fontSize: 90, color: "text.disabled", mb: 2 }} />
        <Typography variant="h2" fontWeight="bold" gutterBottom>
          404
        </Typography>
        <Typography variant="h5" gutterBottom>
          Page Not Found
        </Typography>
        <Typography color="text.secondary" mb={5}>
          Sorry, the page you are looking for doesn&apos;t exist or has been
          moved.
        </Typography>
        <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
          <Link href="/" passHref>
            <Button variant="contained" size="large">
              Go Home
            </Button>
          </Link>
          <Link href="/products" passHref>
            <Button variant="outlined" size="large">
              Browse Products
            </Button>
          </Link>
        </Box>
      </Container>
    </Layout>
  );
}
