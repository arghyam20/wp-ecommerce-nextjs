'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/common/DashboardLayout';
import { Typography, TextField, Button, Box, Grid, Divider } from '@mui/material';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { profileSchema } from '@/lib/validation/schemas';
import { User } from '@/types';
import axios from 'axios';
import toast from 'react-hot-toast';

interface ProfileForm { firstName: string; lastName: string; email: string; }

export default function ProfileClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileForm>({
    resolver: joiResolver(profileSchema),
  });

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login?callbackUrl=/dashboard/profile');
    if (status === 'authenticated') {
      axios.get('/api/user/profile').then((r) => {
        setUser(r.data);
        reset({ firstName: r.data.firstName, lastName: r.data.lastName, email: r.data.email });
      }).catch(() => {});
    }
  }, [status, router, reset]);

  const onSubmit = async (data: ProfileForm) => {
    setLoading(true);
    try {
      await axios.put('/api/user/profile', data);
      toast.success('Account details saved.');
    } catch {
      toast.error('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || !session || !user) return null;

  return (
    <DashboardLayout>
      <Typography variant="h5" component="h1" fontWeight="bold" mb={3}>Account Details</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 600 }}>
          {/* Name */}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="First Name *" {...register('firstName')}
                error={!!errors.firstName} helperText={errors.firstName?.message} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Last Name *" {...register('lastName')}
                error={!!errors.lastName} helperText={errors.lastName?.message} />
            </Grid>
          </Grid>

          {/* Display name hint */}
          <Typography variant="caption" color="text.secondary" sx={{ mt: -2 }}>
            This will be how your name will be displayed in the account section and in reviews.
          </Typography>

          <Divider />

          {/* Email */}
          <TextField fullWidth label="Email Address *" type="email" {...register('email')}
            error={!!errors.email} helperText={errors.email?.message} />

          <Divider />

          {/* Password change hint */}
          <Box>
            <Typography variant="body2" color="text.secondary" mb={1}>
              Want to change your password?{' '}
              <a href="/dashboard/change-password" style={{ color: 'inherit', fontWeight: 600 }}>
                Click here
              </a>
            </Typography>
          </Box>

          <Button type="submit" variant="contained" disabled={loading} sx={{ alignSelf: 'flex-start', px: 4 }}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      </form>
    </DashboardLayout>
  );
}
