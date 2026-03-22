'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/common/DashboardLayout';
import { Typography, TextField, Button, Box, Paper, Avatar } from '@mui/material';
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
      toast.success('Profile updated successfully!');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || !session || !user) return null;

  return (
    <DashboardLayout>
      <Typography variant="h5" component="h1" fontWeight="bold" mb={3}>My Profile</Typography>
      <Paper sx={{ p: 4 }} elevation={2}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <Avatar src={user.avatarUrl} sx={{ width: 64, height: 64, fontSize: 28 }}>
            {user.firstName?.[0]}
          </Avatar>
          <Box>
            <Typography fontWeight="bold">{user.firstName} {user.lastName}</Typography>
            <Typography variant="body2" color="text.secondary">{user.email}</Typography>
          </Box>
        </Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField fullWidth label="First Name" {...register('firstName')}
                error={!!errors.firstName} helperText={errors.firstName?.message} />
              <TextField fullWidth label="Last Name" {...register('lastName')}
                error={!!errors.lastName} helperText={errors.lastName?.message} />
            </Box>
            <TextField fullWidth label="Email" type="email" {...register('email')}
              error={!!errors.email} helperText={errors.email?.message} />
            <Button type="submit" variant="contained" disabled={loading} sx={{ alignSelf: 'flex-start' }}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        </form>
      </Paper>
    </DashboardLayout>
  );
}
