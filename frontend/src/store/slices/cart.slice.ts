
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/types/types";

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
}

const initialState: CartState = {
  items: [],
  total: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      const existingItem = state.items.find((item) => item.product.id === product.id);
      if (existingItem) {
        existingItem.quantity++;
      } else {
        state.items.push({ product, quantity: 1 });
      }
      state.total += product.price;
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const existingItem = state.items.find((item) => item.product.id === id);
      if (existingItem) {
        state.total -= existingItem.product.price * existingItem.quantity;
        state.items = state.items.filter((item) => item.product.id !== id);
      }
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const { id, quantity } = action.payload;
      const existingItem = state.items.find((item) => item.product.id === id);
      if (existingItem) {
        state.total -= existingItem.product.price * existingItem.quantity;
        existingItem.quantity = quantity;
        state.total += existingItem.product.price * existingItem.quantity;
      }
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity } = cartSlice.actions;
export default cartSlice.reducer;
