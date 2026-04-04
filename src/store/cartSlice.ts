import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Cart, CartItem } from "@/types";
import { CART_STORAGE_KEY, DEFAULT_CURRENCY } from "@/lib/constants";

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

const CART_KEY = CART_STORAGE_KEY;

function loadCart(): Cart {
  if (typeof window === "undefined") return emptyCart();
  try {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : emptyCart();
  } catch {
    return emptyCart();
  }
}

function saveCart(cart: Cart) {
  if (typeof window !== "undefined") {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }
}

function emptyCart(): Cart {
  return {
    items: [],
    total: "0.00",
    subtotal: "0.00",
    currency: DEFAULT_CURRENCY,
    item_count: 0,
  };
}

function recalculate(items: CartItem[]): Cart {
  const subtotal = items.reduce(
    (sum, i) => sum + parseFloat(i.price) * i.quantity,
    0,
  );
  return {
    items,
    subtotal: subtotal.toFixed(2),
    total: subtotal.toFixed(2),
    currency: DEFAULT_CURRENCY,
    item_count: items.reduce((sum, i) => sum + i.quantity, 0),
  };
}

export const fetchCart = createAsyncThunk("cart/fetch", async () => {
  return loadCart();
});

export const addToCart = createAsyncThunk(
  "cart/add",
  async ({
    productId,
    quantity,
    variation,
    name,
    price,
    image,
  }: {
    productId: number;
    quantity: number;
    variation?: Record<string, string>;
    name: string;
    price: string;
    image?: { src: string; alt: string };
  }) => {
    const cart = loadCart();
    const variationKey = variation ? JSON.stringify(variation) : "";
    const key = `${productId}_${variationKey}`;
    const existing = cart.items.find((i) => i.key === key);

    let items: CartItem[];
    if (existing) {
      items = cart.items.map((i) =>
        i.key === key ? { ...i, quantity: i.quantity + quantity } : i,
      );
    } else {
      items = [
        ...cart.items,
        {
          key,
          id: productId,
          quantity,
          name,
          price,
          line_total: (parseFloat(price) * quantity).toFixed(2),
          image,
          variation,
        },
      ];
    }

    const updated = recalculate(items);
    saveCart(updated);
    return updated;
  },
);

export const removeFromCart = createAsyncThunk(
  "cart/remove",
  async (itemKey: string) => {
    const cart = loadCart();
    const updated = recalculate(cart.items.filter((i) => i.key !== itemKey));
    saveCart(updated);
    return updated;
  },
);

export const updateQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async ({ itemKey, quantity }: { itemKey: string; quantity: number }) => {
    const cart = loadCart();
    const items =
      quantity <= 0
        ? cart.items.filter((i) => i.key !== itemKey)
        : cart.items.map((i) =>
            i.key === itemKey
              ? {
                  ...i,
                  quantity,
                  line_total: (parseFloat(i.price) * quantity).toFixed(2),
                }
              : i,
          );
    const updated = recalculate(items);
    saveCart(updated);
    return updated;
  },
);

export const clearCart = createAsyncThunk("cart/clear", async () => {
  saveCart(emptyCart());
});

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCart.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      fetchCart.fulfilled,
      (state, action: PayloadAction<Cart>) => {
        state.cart = action.payload;
        state.loading = false;
        state.fetched = true;
      },
    );
    builder.addCase(fetchCart.rejected, (state) => {
      state.loading = false;
      state.fetched = true;
    });

    builder.addCase(
      addToCart.fulfilled,
      (state, action: PayloadAction<Cart>) => {
        state.cart = action.payload;
      },
    );

    builder.addCase(
      removeFromCart.fulfilled,
      (state, action: PayloadAction<Cart>) => {
        state.cart = action.payload;
      },
    );

    builder.addCase(
      updateQuantity.fulfilled,
      (state, action: PayloadAction<Cart>) => {
        state.cart = action.payload;
      },
    );

    builder.addCase(clearCart.fulfilled, (state) => {
      state.cart = emptyCart();
    });
  },
});

export default cartSlice.reducer;
