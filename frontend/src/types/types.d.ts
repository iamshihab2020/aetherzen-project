import { UserRole } from "./auth";

export interface CreateUserForm {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

// src/types/types.ts

export interface Product {
  id: string;
  title: string;
  description: string;
  sku: string | null;
  priceCents: number; // Price in cents
  isPrescriptionRequired: boolean;
  isEmergencyItem: boolean;
  isTaxExempt: boolean;
  inventory: number; // Stock quantity
  createdAt: string;
  updatedAt: string;
  categoryId: string;
  ProductVariant: ProductVariant[];
  certifications: string[];
}

export interface ProductVariant {
  id: string;
  productId: string;
  size: string;
  model: string;
  certifications: string[];
  additionalPrice: string; // Could be number if converted
}

// API response structure
// Add this to your existing types
export interface ProductsResponse {
  message: string;
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateProductForm {
  name: string;
  description?: string;
  priceCents: number;
  inventory: number;
  categoryId: string;
  isRestricted?: boolean;
  isEmergencyItem?: boolean;
}

export interface UpdateProductForm extends CreateProductForm {
  id: string;
}
export interface Order {
  id: string;
  user: User;
  total: number;
  status: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  product: Product;
  quantity: number;
}

export interface Prescription {
  id: string;
  patient: User;
  doctor: User;
  status: string;
  file: string;
}
