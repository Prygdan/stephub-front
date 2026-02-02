import { PaginatedResponse } from "@/lib/types";
import { apiHelper } from "./instance";
import { secureRequest } from "@/hooks/use-csrf-cookie";
import { TGuest } from "./order";
import { TCartItem } from "@/hooks/use-cart";
import { TProduct } from "./products";
import { AxiosResponse } from "axios";
import { TSize } from "./sizes";
import { TPatmentMethod } from "@/components/shared/checkout/payment-method";

export type TCartItemResponse = {
  id: string;
  cart_id: string;
  product_id: string;
  price: string;
  quantity: number;
  created_at?: string;
  updated_at?: string;
  product: TProduct;
  size_id: string;
  taste: TSize;
};

export type TCart = {
  id: string;
  user_id: string | null;
  guest_id: string | null;
  session_id: string | null;
  status: string;
  comment?: string | null;
  total_price: string;
  created_at?: string;
  updated_at?: string;
  items: TCartItemResponse[];
};

export type TOrder = {
  id: string,
  user_id: string | null,
  guest_id: string | null,
  session_id: string | null,
  total_price: string
  status: string
  comment?: string
  created_at?: string
  updated_at?: string
}

export type TOrderResponse = TOrder & {
  id?: string
  guest: ({ id: string; created_at?: string; updated_at?: string } & TGuest) | null;
  user: null;
  payment_method: TPatmentMethod
  items: Array<
    { id: string; created_at?: string; updated_at?: string } & TCartItem & {
      product: TProduct;
      size: TSize
    }
  >;
};

export enum OrderStatus {
  Pending   = 1,  
  Ordered   = 2,
  Confirmed = 3
}

export const OrderStatusLabel: Record<OrderStatus, string> = {
  [OrderStatus.Pending]:    'В очікуванні',
  [OrderStatus.Ordered]:    'Замовив',
  [OrderStatus.Confirmed]:  'Підтверджено'
}

export type TOrderRequestUpdate = TGuest & {
  status: string
  products: TCartItem[];
};

const api = apiHelper('crud-orders');

export const get = async (page = 1): Promise<AxiosResponse<PaginatedResponse<TOrderResponse>>> => {
  return await api.get({ page });
};

export const update = async (id: string, item: TOrderRequestUpdate) => {
  return await secureRequest(() => api.put(id, item));
};

export const destroy = async (id: string) => {
  return await secureRequest(() => api.delete(id));
};
