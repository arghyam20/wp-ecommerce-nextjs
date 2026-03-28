'use client';

import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { checkoutSchema } from '@/lib/validation/schemas';
import { CheckoutFormData } from '@/types';
import {
  TextField, Button, Grid, Typography, MenuItem, Divider,
  Alert, Box, Collapse,
} from '@mui/material';
import { useCart } from '@/context/CartContext';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import Link from 'next/link';

const COUNTRIES = [
  { code: 'US', name: 'United States' }, { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' }, { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' }, { code: 'FR', name: 'France' },
  { code: 'IT', name: 'Italy' }, { code: 'ES', name: 'Spain' },
  { code: 'IN', name: 'India' },
];

const PAYMENT_METHODS = [
  { value: 'cod', label: 'Cash on Delivery', desc: 'Pay with cash upon delivery.' },
  { value: 'bank_transfer', label: 'Direct Bank Transfer', desc: 'Make your payment directly into our bank account.' },
];

export default function CheckoutForm() {
  const { cart, clearCart } = useCart();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('cod');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CheckoutFormData>({
    resolver: joiResolver(checkoutSchema),
    defaultValues: { paymentMethod: 'cod', country: 'US' },
  });

  // Pre-fill from saved address when logged in
  useEffect(() => {
    if (status !== 'authenticated') return;
    axios.get('/api/user/profile').then(({ data }) => {
      const b = data.billing;
      reset({
        firstName: data.firstName ?? '',
        lastName: data.lastName ?? '',
        email: data.email ?? '',
        phone: b?.phone ?? '',
        address: b?.address1 ?? '',
        city: b?.city ?? '',
        state: b?.state ?? '',
        postcode: b?.postcode ?? '',
        country: b?.country || 'US',
        paymentMethod: 'cod',
      });
    }).catch(() => {});
  }, [status, reset]);

  const onSubmit = async (data: CheckoutFormData) => {
    if (!cart || cart.items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    setLoading(true);
    try {
      const { data: res } = await axios.post('/api/checkout', {
        ...data,
        paymentMethod: selectedPayment,
        items: cart.items,
      });
      await clearCart();
      toast.success('Order placed successfully!');
      router.push(`/order-confirmation?order=${res.orderNumber}`);
    } catch (error) {
      const msg = (error as { response?: { data?: { message?: string } } }).response?.data?.message;
      toast.error(msg || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Guest notice */}
      {!session && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Returning customer?{' '}
          <Link href={`/login?callbackUrl=/checkout`} style={{ fontWeight: 600 }}>
            Click here to login
          </Link>
        </Alert>
      )}

      {/* Billing Details */}
      <Typography variant="h6" fontWeight="bold" mb={2}>Billing Details</Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField fullWidth label="First Name *" {...register('firstName')}
            error={!!errors.firstName} helperText={errors.firstName?.message} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField fullWidth label="Last Name *" {...register('lastName')}
            error={!!errors.lastName} helperText={errors.lastName?.message} />
        </Grid>
        <Grid size={12}>
          <TextField fullWidth label="Country / Region *" select {...register('country')}
            error={!!errors.country} helperText={errors.country?.message} defaultValue="US">
            {COUNTRIES.map((c) => (
              <MenuItem key={c.code} value={c.code}>{c.name}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={12}>
          <TextField fullWidth label="Street Address *" placeholder="House number and street name"
            {...register('address')} error={!!errors.address} helperText={errors.address?.message} />
        </Grid>
        <Grid size={12}>
          <TextField fullWidth label="Town / City *" {...register('city')}
            error={!!errors.city} helperText={errors.city?.message} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField fullWidth label="State *" {...register('state')}
            error={!!errors.state} helperText={errors.state?.message} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField fullWidth label="Postcode / ZIP *" {...register('postcode')}
            error={!!errors.postcode} helperText={errors.postcode?.message} />
        </Grid>
        <Grid size={12}>
          <TextField fullWidth label="Phone *" type="tel" {...register('phone')}
            error={!!errors.phone} helperText={errors.phone?.message} />
        </Grid>
        <Grid size={12}>
          <TextField fullWidth label="Email Address *" type="email" {...register('email')}
            error={!!errors.email} helperText={errors.email?.message} />
        </Grid>
      </Grid>

      {/* Order Notes */}
      <Typography variant="h6" fontWeight="bold" mt={4} mb={2}>Additional Information</Typography>
      <TextField
        fullWidth
        multiline
        rows={3}
        label="Order Notes (optional)"
        placeholder="Notes about your order, e.g. special notes for delivery."
      />

      {/* Payment Methods */}
      <Divider sx={{ my: 4 }} />
      <Typography variant="h6" fontWeight="bold" mb={2}>Payment</Typography>
      <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
        {PAYMENT_METHODS.map((method, i) => (
          <Box key={method.value}>
            {i > 0 && <Divider />}
            <Box
              sx={{ p: 2, cursor: 'pointer', bgcolor: selectedPayment === method.value ? 'primary.50' : 'transparent' }}
              onClick={() => setSelectedPayment(method.value)}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <input
                  type="radio"
                  checked={selectedPayment === method.value}
                  onChange={() => setSelectedPayment(method.value)}
                  style={{ accentColor: '#1976d2' }}
                />
                <Typography fontWeight={selectedPayment === method.value ? 'bold' : 'normal'}>
                  {method.label}
                </Typography>
              </Box>
              <Collapse in={selectedPayment === method.value}>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, ml: 3 }}>
                  {method.desc}
                </Typography>
              </Collapse>
            </Box>
          </Box>
        ))}
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 2, mb: 3 }}>
        Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our privacy policy.
      </Typography>

      <Button
        type="submit"
        variant="contained"
        size="large"
        fullWidth
        disabled={loading}
        sx={{ py: 1.5 }}
      >
        {loading ? 'Placing Order...' : 'Place Order'}
      </Button>
    </form>
  );
}
