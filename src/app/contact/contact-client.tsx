'use client';

import Layout from '@/components/common/Layout';
import { Container, Typography, TextField, Button, Paper, Box, Grid } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useState } from 'react';
import toast from 'react-hot-toast';

const contactInfo = [
  { icon: <EmailIcon />, label: 'Email', value: 'support@mystore.com' },
  { icon: <PhoneIcon />, label: 'Phone', value: '+1 (555) 123-4567' },
  { icon: <LocationOnIcon />, label: 'Address', value: '123 Store St, New York, NY 10001' },
];

export default function ContactClient() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast.success("Message sent! We'll get back to you soon.");
    setForm({ name: '', email: '', subject: '', message: '' });
    setLoading(false);
  };

  return (
    <Layout>
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 10, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" fontWeight="bold" gutterBottom>Contact Us</Typography>
          <Typography variant="h6">We&apos;d love to hear from you. Send us a message!</Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>Get in Touch</Typography>
            <Typography color="text.secondary" mb={4}>
              Have a question or need help? Reach out through any of the channels below.
            </Typography>
            {contactInfo.map(({ icon, label, value }) => (
              <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Box color="primary.main">{icon}</Box>
                <Box>
                  <Typography fontWeight="bold">{label}</Typography>
                  <Typography color="text.secondary">{value}</Typography>
                </Box>
              </Box>
            ))}
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <Paper sx={{ p: 4 }} elevation={2}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>Send a Message</Typography>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth label="Name" required value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth label="Email" type="email" required value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  </Grid>
                  <Grid size={12}>
                    <TextField fullWidth label="Subject" required value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })} />
                  </Grid>
                  <Grid size={12}>
                    <TextField fullWidth label="Message" multiline rows={5} required value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })} />
                  </Grid>
                  <Grid size={12}>
                    <Button type="submit" variant="contained" size="large" disabled={loading}>
                      {loading ? 'Sending...' : 'Send Message'}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
}
