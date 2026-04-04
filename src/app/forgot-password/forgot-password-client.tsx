'use client';

import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { forgotPasswordSchema } from '@/lib/validation/schemas';
import { TextField, Button, Paper, Typography, Box } from '@mui/material';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useState } from 'react';
import axios from 'axios';
import Layout from '@/components/common/Layout';

export default function ForgotPasswordClient() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string }>({
    resolver: joiResolver(forgotPasswordSchema),
  });

  const onSubmit = async ({ email }: { email: string }) => {
    setLoading(true);
    try {
      await axios.post('/api/auth/forgot-password', { email });
      setSent(true);
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh',
          px: 2,
        }}
      >
        <Paper sx={{ p: 4, width: '100%', maxWidth: 420 }} elevation={3}>
          <Typography variant="h5" fontWeight="bold" textAlign="center" mb={1}>
            Forgot Password
          </Typography>
          {sent ? (
            <Box textAlign="center" mt={2}>
              <Typography color="success.main" mb={2}>
                If an account exists for that email, a reset link has been sent.
              </Typography>
              <Link href="/login">Back to Sign In</Link>
            </Box>
          ) : (
            <>
              <Typography color="text.secondary" textAlign="center" mb={3}>
                Enter your email and we&apos;ll send you a reset link.
              </Typography>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    {...register('email')}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={loading}
                  >
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </Button>
                  <Typography textAlign="center" variant="body2">
                    <Link href="/login">Back to Sign In</Link>
                  </Typography>
                </Box>
              </form>
            </>
          )}
        </Paper>
      </Box>
    </Layout>
  );
}
