import { api } from "./api.slice";
import type { LoginCredentials, RegisterCredentials, User } from "@/types/auth";

interface AuthResponse {
  token: string;
  user: User;
}

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginCredentials>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    register: builder.mutation<AuthResponse, RegisterCredentials>({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
    }),
    // Admin-only: create user with explicit role
    adminCreateUser: builder.mutation<
      { user: User },
      { email: string; password: string; name?: string; role: User["role"] }
    >({
      query: (payload) => ({
        url: "/auth/dashboard/users",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["User"],
    }),
    refreshToken: builder.mutation<{ token: string }, void>({
      query: () => ({ url: "/auth/refresh-token", method: "POST" }),
    }),
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({ url: "/auth/logout", method: "POST" }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useAdminCreateUserMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
} = authApi;
