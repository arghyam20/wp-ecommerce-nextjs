import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Cart } from '@/types';
import axios from 'axios';
import toast from 'react-hot-toast';

interface CartState {
  cart: Cart | null;
  loading: boolean;
  fetched: boolean;
}

const initialState: CartState = {
  cart: null,
  loading: false,
  fetched: false,
};

export const fetchCart = createAsyncThunk('cart/fetch', async () => {
  const { data } = await axios.get('/api/cart');
  return data as Cart;
});

export const addToCart = createAsyncThunk(
  'cart/add',
  async ({ productId, quantity, variation }: { productId: number; quantity: number; variation?: Record<string, string> }) => {
    const { data } = await axios.post('/api/cart', { productId, quantity, variation });
    return data as Cart;
  }
);

export const removeFromCart = createAsyncThunk('cart/remove', async (itemKey: string) => {
  const { data } = await axios.delete('/api/cart', { data: { itemKey } });
  return data as Cart;
});

export const updateQuantity = createAsyncThunk(
  'cart/updateQuantity',
  async ({ itemKey, quantity }: { itemKey: string; quantity: number }) => {
    const { data } = await axios.put('/api/cart', { itemKey, quantity });
    return data as Cart;
  }
);

export const clearCart = createAsyncThunk('cart/clear', async () => {
  await axios.delete('/api/cart/clear');
});

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // fetchCart
    builder.addCase(fetchCart.pending, (state) => { state.loading = true; });
    builder.addCase(fetchCart.fulfilled, (state, action: PayloadAction<Cart>) => {
      state.cart = action.payload;
      state.loading = false;
      state.fetched = true;
    });
    builder.addCase(fetchCart.rejected, (state) => {
      state.loading = false;
      state.fetched = true;
      toast.error('Failed to load cart');
    });

    // addToCart
    builder.addCase(addToCart.fulfilled, (state, action: PayloadAction<Cart>) => {
      state.cart = action.payload;
      toast.success('Product added to cart');
    });
    builder.addCase(addToCart.rejected, () => {
      toast.error('Failed to add product to cart');
    });

    // removeFromCart
    builder.addCase(removeFromCart.fulfilled, (state, action: PayloadAction<Cart>) => {
      state.cart = action.payload;
      toast.success('Item removed from cart');
    });
    builder.addCase(removeFromCart.rejected, () => {
      toast.error('Failed to remove item');
    });

    // updateQuantity
    builder.addCase(updateQuantity.fulfilled, (state, action: PayloadAction<Cart>) => {
      state.cart = action.payload;
    });
    builder.addCase(updateQuantity.rejected, () => {
      toast.error('Failed to update quantity');
    });

    // clearCart
    builder.addCase(clearCart.fulfilled, (state) => {
      state.cart = null;
    });
    builder.addCase(clearCart.rejected, () => {
      toast.error('Failed to clear cart');
    });
  },
});

export default cartSlice.reducer;
