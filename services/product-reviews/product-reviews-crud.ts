import { AxiosResponse } from "axios";
import { apiHelper } from "../instance";
import { ProductReview } from "./product-review";
import { secureRequest } from "@/hooks/use-csrf-cookie";
import { PaginatedResponse, TTimestamps } from "@/lib/types";
import { TUser } from "@/hooks/use-auth";
import { TProduct } from "../products";
import { ProductReviewAnswerCrud } from "./product-reviews-answer-crud";

const api = apiHelper('crud-reviews');

export interface ProductReviewCrud extends TTimestamps {
  id: string;
  product_id: string;
  rating: number;
  advantages?: string;
  disadvantages?: string;
  comment: string;
  is_name_hidden: boolean;
  name: string | null;
  user_id?: string | null;
  user?: TUser
  product?: TProduct
  answer?: ProductReviewAnswerCrud
}

export const get = async (): Promise<AxiosResponse<PaginatedResponse<ProductReview>>> => {
  try {
    return await api.get();
  } catch (error: unknown) {
    throw error;
  }
};

export const update = async (id: string, item: ProductReviewCrud): Promise<AxiosResponse<ProductReviewCrud>> => {
  try {
    return await secureRequest(() => api.put(id, item));
  } catch (error: unknown) {
    throw error;
  }
}

export const destroy = async (id: string): Promise<AxiosResponse<void>> => {
  try {
    return await secureRequest(() => api.delete(id));
  } catch (error: unknown) {
    throw error;
  }
}
