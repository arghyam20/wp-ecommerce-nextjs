import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/types";
import { WISHLIST_STORAGE_KEY } from "@/lib/constants";

interface WishlistState {
  items: Product[];
}

const WISHLIST_KEY = WISHLIST_STORAGE_KEY;

function load(): Product[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(WISHLIST_KEY) || "[]");
  } catch {
    return [];
  }
}

function save(items: Product[]) {
  if (typeof window !== "undefined")
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
}

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: { items: [] } as WishlistState,
  reducers: {
    initWishlist(state) {
      state.items = load();
    },
    toggleWishlist(state, action: PayloadAction<Product>) {
      const exists = state.items.find((i) => i.id === action.payload.id);
      if (exists) {
        state.items = state.items.filter((i) => i.id !== action.payload.id);
      } else {
        state.items.push(action.payload);
      }
      save(state.items);
    },
  },
});

export const { initWishlist, toggleWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
