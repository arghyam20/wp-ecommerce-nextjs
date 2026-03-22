'use client';

import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { checkoutSchema } from '@/lib/validation/schemas';
import { CheckoutFormData } from '@/types';
import { TextField, Button, Grid, Paper, Typography, MenuItem } from '@mui/material';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const countries = ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'IT', 'ES'];
const paymentMethods = [
  { value: 'cod', label: 'Cash on Delivery' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'card', label: 'Credit Card' },
];

export default function CheckoutForm() {
  const { cart, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: joiResolver(checkoutSchema),
  });

  const onSubmit = async (data: CheckoutFormData) => {
    if (!cart || cart.items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/checkout', data);
      await clearCart();
      toast.success('Order placed successfully!');
      router.push('/order-confirmation');
    } catch (error) {
      if ((error as { response?: { data?: { errors?: unknown } } }).response?.data?.errors) {
        Object.values((error as { response: { data: { errors: Record<string, string> } } }).response.data.errors).forEach((err: string) => {
          toast.error(err);
        });
      } else {
        toast.error('Failed to place order');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper className="p-6">
      <Typography variant="h5" gutterBottom>
        Shipping Information
      </Typography>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="First Name"
              {...register('firstName')}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
            />
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Last Name"
              {...register('lastName')}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
            />
          </Grid>
          
          <Grid size={12}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          </Grid>
          
          <Grid size={12}>
            <TextField
              fullWidth
              label="Phone"
              {...register('phone')}
              error={!!errors.phone}
              helperText={errors.phone?.message}
            />
          </Grid>
          
          <Grid size={12}>
            <TextField
              fullWidth
              label="Address"
              {...register('address')}
              error={!!errors.address}
              helperText={errors.address?.message}
            />
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="City"
              {...register('city')}
              error={!!errors.city}
              helperText={errors.city?.message}
            />
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="State/Province"
              {...register('state')}
              error={!!errors.state}
              helperText={errors.state?.message}
            />
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Postal Code"
              {...register('postcode')}
              error={!!errors.postcode}
              helperText={errors.postcode?.message}
            />
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              select
              label="Country"
              {...register('country')}
              error={!!errors.country}
              helperText={errors.country?.message}
              defaultValue=""
            >
              <MenuItem value="">Select a country</MenuItem>
              {countries.map((country) => (
                <MenuItem key={country} value={country}>
                  {country}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          
          <Grid size={12}>
            <Typography variant="h6" gutterBottom className="mt-4">
              Payment Method
            </Typography>
            <TextField
              fullWidth
              select
              label="Payment Method"
              {...register('paymentMethod')}
              error={!!errors.paymentMethod}
              helperText={errors.paymentMethod?.message}
              defaultValue=""
            >
              <MenuItem value="">Select payment method</MenuItem>
              {paymentMethods.map((method) => (
                <MenuItem key={method.value} value={method.value}>
                  {method.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          
          <Grid size={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              disabled={loading}
              className="mt-4"
            >
              {loading ? 'Processing...' : 'Place Order'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}