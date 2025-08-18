import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth.slice";
import { api } from "./slices/api.slice";
import cartReducer from "./slices/cart.slice";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth: authReducer,
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
