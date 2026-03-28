'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/common/DashboardLayout';
import { Typography, TextField, Button, Box, Grid, MenuItem, Paper } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { User } from '@/types';
import axios from 'axios';
import toast from 'react-hot-toast';

const COUNTRIES = [
  { code: 'US', name: 'United States' }, { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' }, { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' }, { code: 'FR', name: 'France' },
  { code: 'IT', name: 'Italy' }, { code: 'ES', name: 'Spain' },
  { code: 'IN', name: 'India' },
];

interface AddressForm {
  billing: { address1: string; address2: string; city: string; state: string; postcode: string; country: string; phone: string };
  shipping: { address1: string; address2: string; city: string; state: string; postcode: string; country: string };
}

function AddressFields({ prefix, control, register }: {
  prefix: 'billing' | 'shipping';
  control: ReturnType<typeof useForm<AddressForm>>['control'];
  register: ReturnType<typeof useForm<AddressForm>>['register'];
}) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField fullWidth size="small" label="Street Address" placeholder="House number and street name"
        {...register(`${prefix}.address1`)} />
      <TextField fullWidth size="small" label="Apartment, suite, unit, etc. (optional)"
        {...register(`${prefix}.address2`)} />
      <TextField fullWidth size="small" label="Town / City" {...register(`${prefix}.city`)} />
      <TextField fullWidth size="small" label="State / County" {...register(`${prefix}.state`)} />
      <TextField fullWidth size="small" label="Postcode / ZIP" {...register(`${prefix}.postcode`)} />
      <Controller
        name={`${prefix}.country`}
        control={control}
        render={({ field }) => (
          <TextField fullWidth size="small" select label="Country / Region" {...field} value={field.value ?? ''}>
            <MenuItem value=""><em>Select a country</em></MenuItem>
            {COUNTRIES.map((c) => <MenuItem key={c.code} value={c.code}>{c.name}</MenuItem>)}
          </TextField>
        )}
      />
      {prefix === 'billing' && (
        <TextField fullWidth size="small" label="Phone" type="tel" {...register('billing.phone')} />
      )}
    </Box>
  );
}

export default function AddressesClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, control } = useForm<AddressForm>({
    defaultValues: {
      billing: { address1: '', address2: '', city: '', state: '', postcode: '', country: '', phone: '' },
      shipping: { address1: '', address2: '', city: '', state: '', postcode: '', country: '' },
    },
  });

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login?callbackUrl=/dashboard/addresses');
    if (status === 'authenticated') {
      axios.get('/api/user/profile').then((r) => {
        const user: User = r.data;
        reset({
          billing: user.billing ?? { address1: '', address2: '', city: '', state: '', postcode: '', country: '', phone: '' },
          shipping: user.shipping ?? { address1: '', address2: '', city: '', state: '', postcode: '', country: '' },
        });
      }).catch(() => {});
    }
  }, [status, router, reset]);

  const onSubmit = async (data: AddressForm) => {
    setLoading(true);
    try {
      await axios.put('/api/user/address', data);
      toast.success('Addresses saved successfully.');
    } catch {
      toast.error('Failed to save addresses.');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || !session) return null;

  return (
    <DashboardLayout>
      <Typography variant="h5" component="h1" fontWeight="bold" mb={1}>Addresses</Typography>
      <Typography variant="body2" color="text.secondary" mb={4}>
        The following addresses will be used on the checkout page by default.
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3 }} elevation={1}>
              <Typography variant="h6" fontWeight="bold" mb={2}>Billing Address</Typography>
              <AddressFields prefix="billing" control={control} register={register} />
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3 }} elevation={1}>
              <Typography variant="h6" fontWeight="bold" mb={2}>Shipping Address</Typography>
              <AddressFields prefix="shipping" control={control} register={register} />
            </Paper>
          </Grid>
        </Grid>
        <Button type="submit" variant="contained" disabled={loading} sx={{ mt: 3, px: 4 }}>
          {loading ? 'Saving...' : 'Save Addresses'}
        </Button>
      </form>
    </DashboardLayout>
  );
}
