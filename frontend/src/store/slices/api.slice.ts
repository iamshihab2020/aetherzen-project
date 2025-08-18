import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

import {
  Category,
  CreateProductForm,
  Order,
  Prescription,
  Product,
  ProductsResponse,
  UpdateProductForm,
  User,
} from "@/types/types";
import { logout, setCredentials } from "./auth.slice";

const baseQueryWithoutToken = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
  credentials: "include",
});

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
  credentials:
    process.env.NODE_ENV === "production" ? "include" : "same-origin",
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // If 401 error, try to refresh token
  if (result.error && result.error.status === 401) {
    // Try to refresh token using cookie-based auth
    const refreshResult = await baseQueryWithoutToken(
      { url: "/auth/refresh-token", method: "POST" },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      // Store the new token
      const { token } = refreshResult.data as { token: string };
      api.dispatch(setCredentials({ token }));

      // Retry the original request with new token
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Refresh failed - log out user
      api.dispatch(logout());
      // Redirect to login page
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    // Auth endpoints
    register: builder.mutation({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    login: builder.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    logout: builder.mutation({
      query: () => ({ url: "/auth/logout", method: "POST" }),
    }),
    createUserByAdmin: builder.mutation({
      query: (data) => ({
        url: "/auth/dashboard/users",
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["User"],
    }),

    // Users
    getUsers: builder.query<User[], void>({
      query: () => "/users",
      providesTags: ["User"],
    }),

    // Category
    getCategories: builder.query<Category[], void>({
      query: () => "/categories",
      transformResponse: (response: { data: Category[] }) => response.data,
      providesTags: ["Category"],
    }),
    getCategoryById: builder.query<Category, string>({
      query: (id) => `/categories/${id}`,
      transformResponse: (response: { data: Category }) => response.data,
      providesTags: ["Category"],
    }),
    createCategory: builder.mutation({
      query: (data) => ({
        url: "/categories",
        method: "POST",
        body: {
          name: data.name,
          description: data.description,
          slug: data.slug,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Category"],
    }),
    updateCategory: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/categories/${id}`,
        method: "PATCH",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Category"],
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({ url: `/categories/${id}`, method: "DELETE" }),
      invalidatesTags: ["Category"],
    }),

    // Products
    getProducts: builder.query<ProductsResponse, void>({
      query: () => "/products",
      providesTags: ["Product"],
    }),
    getProductById: builder.query<Product, string>({
      query: (id) => `/products/${id}`,
      providesTags: ["Product"],
    }),
    createProduct: builder.mutation<Product, CreateProductForm>({
      query: (data) => ({
        url: "/products",
        method: "POST",
        body: {
          name: data.name,
          description: data.description,
          price: data.priceCents,
          categoryId: data.categoryId,
          stock: data.inventory,
          isRestricted: data.isRestricted,
          isEmergencyItem: data.isEmergencyItem,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Product"],
    }),
    updateProduct: builder.mutation<Product, UpdateProductForm>({
      query: ({ id, ...data }) => ({
        url: `/products/${id}`,
        method: "PATCH",
        body: {
          name: data.name,
          description: data.description,
          price: data.priceCents / 100,
          categoryId: data.categoryId,
          stock: data.inventory,
          isRestricted: data.isRestricted,
          isEmergencyItem: data.isEmergencyItem,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Product"],
    }),
    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({ url: `/products/${id}`, method: "DELETE" }),
      invalidatesTags: ["Product"],
    }),

    // Orders
    getOrders: builder.query<Order[], void>({
      query: () => "/api/orders",
      providesTags: ["Order"],
    }),
    getMyOrders: builder.query<Order[], void>({
      query: () => "/api/orders/mine",
      providesTags: ["Order"],
    }),
    createOrder: builder.mutation({
      query: (data) => ({
        url: "/api/orders",
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Order"],
    }),

    // Prescriptions
    getPrescriptions: builder.query<Prescription[], void>({
      query: () => "/prescriptions",
      providesTags: ["Prescription"],
    }),
    getMyPrescriptions: builder.query<Prescription[], void>({
      query: () => "/prescriptions/mine",
      providesTags: ["Prescription"],
    }),
    uploadPrescription: builder.mutation({
      query: (data) => ({
        url: "/prescriptions",
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Prescription"],
    }),
    approvePrescription: builder.mutation({
      query: (id) => ({ url: `/prescriptions/${id}/approve`, method: "PATCH" }),
      invalidatesTags: ["Prescription"],
    }),
    rejectPrescription: builder.mutation({
      query: (id) => ({ url: `/prescriptions/${id}/reject`, method: "PATCH" }),
      invalidatesTags: ["Prescription"],
    }),
  }),
  tagTypes: ["User", "Product", "Order", "Prescription", "Category"],
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useCreateUserByAdminMutation,
  useGetUsersQuery,
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetOrdersQuery,
  useGetMyOrdersQuery,
  useCreateOrderMutation,
  useGetPrescriptionsQuery,
  useGetMyPrescriptionsQuery,
  useUploadPrescriptionMutation,
  useApprovePrescriptionMutation,
  useRejectPrescriptionMutation,
} = api;
