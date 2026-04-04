'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/common/DashboardLayout';
import { Typography, TextField, Button, Box, Paper } from '@mui/material';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { changePasswordSchema } from '@/lib/validation/schemas';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useState } from 'react';

interface ChangePasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ChangePasswordClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordForm>({
    resolver: joiResolver(changePasswordSchema),
  });

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login?callbackUrl=/dashboard/change-password');
  }, [status, router]);

  const onSubmit = async ({ currentPassword, newPassword }: ChangePasswordForm) => {
    setLoading(true);
    try {
      await axios.post('/api/user/change-password', { currentPassword, newPassword });
      toast.success('Password changed successfully!');
      reset();
    } catch (err) {
      const msg =
        (err as { response?: { data?: { message?: string } } }).response?.data?.message ||
        'Failed to change password';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || !session) return null;

  return (
    <DashboardLayout>
      <Typography variant="h5" component="h1" fontWeight="bold" mb={3}>
        Change Password
      </Typography>
      <Paper sx={{ p: 4, maxWidth: 480 }} elevation={2}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Current Password"
              type="password"
              {...register('currentPassword')}
              error={!!errors.currentPassword}
              helperText={errors.currentPassword?.message}
            />
            <TextField
              fullWidth
              label="New Password"
              type="password"
              {...register('newPassword')}
              error={!!errors.newPassword}
              helperText={errors.newPassword?.message}
            />
            <TextField
              fullWidth
              label="Confirm New Password"
              type="password"
              {...register('confirmPassword')}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ alignSelf: 'flex-start' }}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </Button>
          </Box>
        </form>
      </Paper>
    </DashboardLayout>
  );
}
