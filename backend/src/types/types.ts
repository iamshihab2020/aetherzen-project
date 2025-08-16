// src/types.ts
import { Request } from "express";

export interface ProductBody {
  name: string;
  price: number;
  description?: string;
}

export interface ProductRequest extends Request {
  body: ProductBody;
  params: {
    id?: string;
  };
}
