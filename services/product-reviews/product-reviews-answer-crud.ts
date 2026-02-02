import { AxiosResponse } from "axios";
import { apiHelper } from "../instance";
import { secureRequest } from "@/hooks/use-csrf-cookie";
import { PaginatedResponse, TTimestamps } from "@/lib/types";
import { ProductReview } from "./product-review";

const api = apiHelper('crud-reviews-answers');

export interface ProductReviewAnswerCrud extends TTimestamps {
  id?: string;
  product_review_id?: string;
  reviews?: ProductReview[]
  content: string;
}

export const get = async (): Promise<AxiosResponse<PaginatedResponse<ProductReviewAnswerCrud>>> => {
  try {
    return await api.get();
  } catch (error: unknown) {
    throw error;
  }
};

export const store = async (item: ProductReviewAnswerCrud): Promise<AxiosResponse<ProductReviewAnswerCrud>> => {
  try {
    return await secureRequest(() => api.post(item));
  } catch (error: unknown) {
    throw error;
  }
}

export const update = async (id: string, item: ProductReviewAnswerCrud): Promise<AxiosResponse<ProductReviewAnswerCrud>> => {
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
