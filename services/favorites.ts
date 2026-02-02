import { apiHelper } from "./instance";
import { AxiosResponse } from "axios";
import { TProduct } from "./products";
import { secureRequest } from "@/hooks/use-csrf-cookie";

const api = apiHelper('favorites');

export type TFavoriteProduct = {
  id: string
  user_id: string
  session_id: string
  product_id: string
  product?: TProduct
}

export const get = async (): Promise<AxiosResponse<TFavoriteProduct[]>> => {
  return await api.get();
};

export const store = async (productId: string): Promise<AxiosResponse<TFavoriteProduct>> => {
  try {
    return await secureRequest(() => api.post({product_id: productId}));
  } catch (error) {
    throw error;
  }
};
