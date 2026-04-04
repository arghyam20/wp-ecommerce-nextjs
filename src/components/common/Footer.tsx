"use client";

import { Box, Container, Typography, Grid, Divider } from "@mui/material";
import Link from "next/link";
import { SITE_NAME, SITE_DESCRIPTION, FOOTER_LINKS } from "@/lib/constants";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{ bgcolor: "grey.900", color: "grey.300", mt: "auto" }}
    >
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          {/* Brand */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography variant="h6" fontWeight="bold" color="white" mb={1}>
              {SITE_NAME}
            </Typography>
            <Typography variant="body2" color="grey.500">
              {SITE_DESCRIPTION}
            </Typography>
          </Grid>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <Grid key={title} size={{ xs: 6, md: 3 }}>
              <Typography
                variant="subtitle2"
                fontWeight="bold"
                color="white"
                mb={2}
                textTransform="uppercase"
                letterSpacing={1}
              >
                {title}
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {links.map(({ label, href }) => (
                  <Link
                    key={href}
                    href={href}
                    style={{ textDecoration: "none" }}
                  >
                    <Typography
                      variant="body2"
                      color="grey.400"
                      sx={{
                        "&:hover": { color: "white" },
                        transition: "color 0.2s",
                      }}
                    >
                      {label}
                    </Typography>
                  </Link>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ borderColor: "grey.700", my: 4 }} />
        <Typography variant="body2" color="grey.500" textAlign="center">
          © {new Date().getFullYear()} {SITE_NAME}. All rights reserved. Built
          with Next.js & WooCommerce.
        </Typography>
      </Container>
    </Box>
  );
}
