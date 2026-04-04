import type { Metadata } from "next";
import Layout from "@/components/common/Layout";
import { Container, Typography, Box, Divider } from "@mui/material";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read our privacy policy to understand how we collect, use, and protect your data.",
};

const sections = [
  {
    title: "1. Information We Collect",
    content: `We collect information you provide directly to us, such as when you create an account, place an order, or contact us for support. This includes your name, email address, shipping address, phone number, and payment information. We also automatically collect certain information when you use our website, including your IP address, browser type, and browsing behavior.`,
  },
  {
    title: "2. How We Use Your Information",
    content: `We use the information we collect to process your orders and payments, send you order confirmations and updates, respond to your comments and questions, send you marketing communications (with your consent), improve our website and services, and comply with legal obligations.`,
  },
  {
    title: "3. Sharing Your Information",
    content: `We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our website and conducting our business, provided they agree to keep your information confidential. We may also disclose your information when required by law.`,
  },
  {
    title: "4. Cookies",
    content: `We use cookies and similar tracking technologies to enhance your experience on our website. Cookies help us remember your preferences, understand how you use our site, and provide relevant content. You can control cookie settings through your browser preferences.`,
  },
  {
    title: "5. Data Security",
    content: `We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.`,
  },
  {
    title: "6. Data Retention",
    content: `We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law. When your data is no longer needed, we will securely delete or anonymize it.`,
  },
  {
    title: "7. Your Rights",
    content: `You have the right to access, correct, or delete your personal information. You may also object to or restrict certain processing of your data. To exercise these rights, please contact us at support@mystore.com. We will respond to your request within 30 days.`,
  },
  {
    title: "8. Third-Party Links",
    content: `Our website may contain links to third-party websites. We are not responsible for the privacy practices of those sites and encourage you to review their privacy policies before providing any personal information.`,
  },
  {
    title: "9. Changes to This Policy",
    content: `We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page with an updated date. Your continued use of our website after changes constitutes acceptance of the updated policy.`,
  },
  {
    title: "10. Contact Us",
    content: `If you have any questions about this Privacy Policy, please contact us at support@mystore.com or write to us at 123 Store St, New York, NY 10001.`,
  },
];

export default function PrivacyPage() {
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
            Privacy Policy
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
          At MyStore, we are committed to protecting your privacy. This policy
          explains how we collect, use, and safeguard your personal information
          when you use our website.
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
