import { AxiosResponse } from "axios";
import { http } from "../instance";
import { PaginatedResponse } from "@/lib/types";
import { unstable_cache } from "next/cache";
import { TProduct } from "../products";
import { ProductReviewAnswerCrud } from "./product-reviews-answer-crud";

export interface ProductReviewWithAverageRating {
  reviews: PaginatedResponse<ProductReview>
  average_rating: number
}

export interface ProductReview {
  id: string;
  product_id: string;
  product?: TProduct
  user_id?: string | null;
  rating: number;
  advantages?: string;
  disadvantages?: string;
  comment: string;
  name: string | null;
  is_name_hidden: boolean;
  answer?: ProductReviewAnswerCrud
  created_at: string;
}

export interface ProductReviewStore {
  rating: number;
  advantages?: string;
  disadvantages?: string;
  comment: string;
  name: string;
  is_name_hidden: boolean;
}

export type GetProductReviewParams = {
  productSlug: string
  page?: number
}

export type RatingStat = {
  rating: number;
  count: number;
  percentage: number;
};

export type RatingStatResponse = {
  total: number
  stats: RatingStat[];
}

export const get = unstable_cache(async ({productSlug, page}: GetProductReviewParams): Promise<ProductReviewWithAverageRating | null> => {
  const params = new URLSearchParams();
  if (page) params.append('page', page.toString());

  const url = `api/product-reviews/${productSlug}?${params.toString()}`;

  try {
    return (await http.get(url)).data;
  } catch (error: unknown) {
    throw error;
  }
}, ['reviews'], { tags: ['reviews']});

export const getClient = async ({productSlug, page}: GetProductReviewParams): Promise<ProductReviewWithAverageRating | null> => {
  const params = new URLSearchParams();
  if (page) params.append('page', page.toString());

  const url = `api/product-reviews/${productSlug}?${params.toString()}`;

  try {
    return (await http.get(url)).data;
  } catch (error: unknown) {
    throw error;
  }
}

export const store = async (productSlug: string, data: ProductReviewStore): Promise<AxiosResponse<ProductReview>> => {
  try {
    return await http.post(`api/product-reviews/${productSlug}`, data);
  } catch (error: unknown) {
    throw error;
  }
}

export const getRatingStats = async (productSlug: string): Promise<AxiosResponse<RatingStatResponse>> => {
  try {
    return await http.get(`api/product-rating-stats/${productSlug}`);
  } catch (error: unknown) {
    throw error;
  }
};
