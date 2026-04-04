'use client';

import { Drawer, Box, Typography, IconButton, Button, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

interface MiniCartProps {
  open: boolean;
  onClose: () => void;
}

export default function MiniCart({ open, onClose }: MiniCartProps) {
  const { cart, removeFromCart, updateQuantity } = useCart();

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 340, display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Cart ({cart?.item_count ?? 0})
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Items */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
          {!cart || cart.items.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Typography color="text.secondary">Your cart is empty.</Typography>
              <Link href="/products" passHref>
                <Button variant="outlined" sx={{ mt: 2 }} onClick={onClose}>
                  Browse Products
                </Button>
              </Link>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {cart.items.map((item) => (
                <Box key={item.key} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                  {item.image && (
                    <img
                      src={item.image.src}
                      alt={item.image.alt || item.name}
                      style={{
                        width: 56,
                        height: 56,
                        objectFit: 'cover',
                        borderRadius: 4,
                        flexShrink: 0,
                      }}
                    />
                  )}
                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography variant="body2" fontWeight="medium" noWrap>
                      {item.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ${parseFloat(item.price).toFixed(2)}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                      <IconButton
                        size="small"
                        onClick={() => updateQuantity(item.key, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <RemoveIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                      <Typography variant="body2" sx={{ minWidth: 20, textAlign: 'center' }}>
                        {item.quantity}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => updateQuantity(item.key, item.quantity + 1)}
                      >
                        <AddIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                      gap: 0.5,
                    }}
                  >
                    <Typography variant="body2" fontWeight="bold">
                      ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                    </Typography>
                    <IconButton size="small" color="error" onClick={() => removeFromCart(item.key)}>
                      <DeleteIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {/* Footer */}
        {cart && cart.items.length > 0 && (
          <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography fontWeight="bold">Subtotal</Typography>
              <Typography fontWeight="bold">${cart.subtotal}</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/cart" passHref>
                <Button fullWidth variant="outlined" onClick={onClose}>
                  View Cart
                </Button>
              </Link>
              <Link href="/checkout" passHref>
                <Button fullWidth variant="contained" onClick={onClose}>
                  Checkout
                </Button>
              </Link>
            </Box>
          </Box>
        )}
      </Box>
    </Drawer>
  );
}
