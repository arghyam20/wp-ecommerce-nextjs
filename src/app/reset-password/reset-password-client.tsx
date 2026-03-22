'use client';

import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { resetPasswordSchema } from '@/lib/validation/schemas';
import { TextField, Button, Paper, Typography, Box } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useState } from 'react';
import axios from 'axios';
import Layout from '@/components/common/Layout';

interface ResetForm { password: string; confirmPassword: string; }

export default function ResetPasswordClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const code = searchParams.get('code');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ResetForm>({
    resolver: joiResolver(resetPasswordSchema),
  });

  const onSubmit = async ({ password }: ResetForm) => {
    if (!email || !code) {
      toast.error('Invalid reset link');
      return;
    }
    setLoading(true);
    try {
      await axios.post('/api/auth/reset-password', { email, code, password });
      toast.success('Password reset successfully!');
      router.push('/login');
    } catch (err) {
      toast.error((err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', px: 2 }}>
        <Paper sx={{ p: 4, width: '100%', maxWidth: 420 }} elevation={3}>
          <Typography variant="h5" fontWeight="bold" textAlign="center" mb={3}>Reset Password</Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField fullWidth label="New Password" type="password" {...register('password')}
                error={!!errors.password} helperText={errors.password?.message} />
              <TextField fullWidth label="Confirm Password" type="password" {...register('confirmPassword')}
                error={!!errors.confirmPassword} helperText={errors.confirmPassword?.message} />
              <Button type="submit" variant="contained" size="large" fullWidth disabled={loading}>
                {loading ? 'Resetting...' : 'Reset Password'}
              </Button>
              <Typography textAlign="center" variant="body2">
                <Link href="/login">Back to Sign In</Link>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Box>
    </Layout>
  );
}
