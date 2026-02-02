import { AxiosResponse } from "axios";
import { http } from "./instance";
import { TCartItem } from "@/hooks/use-cart";
import { TPatmentMethod } from "@/components/shared/checkout/payment-method";
import { secureRequest } from "@/hooks/use-csrf-cookie";

export type TFastGuest = {
  name?:       string;
  surname?:    string;
  phone?:      string;
}

export type TGuest = TFastGuest & TGuestDelivery & {
  id?:            number
  middle_name?:   string;
  comment?:       string;
};

export type TGuestDelivery = {
  area?: string
  area_ref?: string
  city?: string
  city_ref?: string
  branch?: string
  branch_ref?: string
  postomat?: string
  postomat_ref?: string
  payment_method?: TPatmentMethod
}

export type TFastOrder = TFastGuest & {
  id?:        number
  products:   TCartItem[];
}

export type TOrderRequest = TGuest & {
  products:   TCartItem[];
};

export async function store(data: TOrderRequest): Promise<AxiosResponse<TOrderRequest>> {
  return await secureRequest(() => http.post('api/order', data));
}

export async function fastStore(data: TFastOrder): Promise<AxiosResponse<TFastOrder>> {
  return await secureRequest(() => http.post('api/fast-order', data));
}
