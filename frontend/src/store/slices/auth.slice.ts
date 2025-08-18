import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { LoginCredentials, RegisterCredentials, User } from "@/types/auth";
import { login, register } from "@/services/auth.service";

interface AuthUser {
  id: string;
  email: string;
  role: string;
  name?: string;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
}

const initialState: AuthState = {
  token: null,
  user: null,
};

if (typeof window !== "undefined") {
  initialState.token = localStorage.getItem("authToken");
  initialState.user = JSON.parse(localStorage.getItem("authUser") || "null");
}

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      return await login(credentials);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (credentials: RegisterCredentials, { rejectWithValue }) => {
    try {
      return await register(credentials);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token?: string; user?: User }>
    ) => {
      if (action.payload.token) {
        state.token = action.payload.token;
        localStorage.setItem("authToken", action.payload.token);
      }
      if (action.payload.user) {
        state.user = action.payload.user;
        localStorage.setItem("authUser", JSON.stringify(action.payload.user));
      }
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken");
        localStorage.removeItem("authUser");
      }
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
