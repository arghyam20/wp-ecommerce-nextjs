import type { Metadata } from "next";
import Layout from "@/components/common/Layout";
import { Container, Typography, Box, Divider } from "@mui/material";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Read our terms and conditions for using MyStore.",
};

const sections = [
  {
    title: "1. Acceptance of Terms",
    content: `By accessing and using MyStore, you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our website. We reserve the right to modify these terms at any time, and your continued use of the site constitutes acceptance of any changes.`,
  },
  {
    title: "2. Use of the Website",
    content: `You agree to use this website only for lawful purposes and in a manner that does not infringe the rights of others. You must not use the site to transmit any harmful, offensive, or illegal content. We reserve the right to terminate access for any user who violates these terms.`,
  },
  {
    title: "3. Products and Pricing",
    content: `All products are subject to availability. We reserve the right to discontinue any product at any time. Prices are subject to change without notice. We make every effort to display accurate product information, but we do not warrant that product descriptions or prices are error-free.`,
  },
  {
    title: "4. Orders and Payment",
    content: `By placing an order, you confirm that all information provided is accurate and complete. We reserve the right to refuse or cancel any order at our discretion. Payment must be received in full before orders are processed. We accept the payment methods listed at checkout.`,
  },
  {
    title: "5. Shipping and Delivery",
    content: `Delivery times are estimates and not guaranteed. We are not responsible for delays caused by carriers or customs. Risk of loss and title for items pass to you upon delivery. Please inspect your order upon receipt and contact us immediately if there are any issues.`,
  },
  {
    title: "6. Returns and Refunds",
    content: `We accept returns within 30 days of delivery for unused items in original condition. To initiate a return, contact our support team. Refunds will be processed within 5-10 business days after we receive the returned item. Shipping costs for returns are the responsibility of the customer unless the item is defective.`,
  },
  {
    title: "7. Intellectual Property",
    content: `All content on this website, including text, images, logos, and graphics, is the property of MyStore and is protected by copyright laws. You may not reproduce, distribute, or create derivative works without our express written permission.`,
  },
  {
    title: "8. Limitation of Liability",
    content: `MyStore shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the website or products purchased. Our total liability shall not exceed the amount paid for the specific product giving rise to the claim.`,
  },
  {
    title: "9. Governing Law",
    content: `These Terms and Conditions are governed by the laws of the State of New York, without regard to its conflict of law provisions. Any disputes shall be resolved in the courts of New York.`,
  },
  {
    title: "10. Contact",
    content: `For questions about these Terms and Conditions, please contact us at support@mystore.com or write to us at 123 Store St, New York, NY 10001.`,
  },
];

export default function TermsPage() {
  return (
    <Layout>
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "white",
          py: 8,
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h3"
            component="h1"
            fontWeight="bold"
            gutterBottom
          >
            Terms &amp; Conditions
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.85 }}>
            Last updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography color="text.secondary" mb={4}>
          Please read these Terms and Conditions carefully before using MyStore.
          By using our website, you agree to these terms in full.
        </Typography>

        {sections.map((section, i) => (
          <Box key={i} mb={4}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              {section.title}
            </Typography>
            <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
              {section.content}
            </Typography>
            {i < sections.length - 1 && <Divider sx={{ mt: 3 }} />}
          </Box>
        ))}
      </Container>
    </Layout>
  );
}
