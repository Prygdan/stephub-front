import { PaginatedResponse, TMetaTags, TTimestamps } from "@/lib/types"
import { TBrand } from "./brands"
import { TMaterial } from "./materials"
import { TSeason } from "./seasons"
import { TSubcategory } from "./subcategories"
import { TProductImage } from "./upload-product-image"
import { apiHelper, http } from "./instance"
import { AxiosResponse } from "axios"
import { secureRequest } from "@/hooks/use-csrf-cookie"
import { TSize } from "./sizes"
import { TCategory } from "./categories"
import { unstable_cache } from "next/cache"

export type TProduct = TTimestamps & TMetaTags & {
  id?:                string
  slug?:              string
  category_id:        string
  subcategory_id:     string 
  brand_id:           string
  season_id:          string
  material_id:        string
  
  name:               string
  article:            string
  description:        string

  price:              number
  discount:           number
  discounted_price?:  number
  is_active:          boolean

  category?:          TCategory
  subcategory?:       TSubcategory
  brand?:             TBrand
  season?:            TSeason
  material?:          TMaterial

  sizes:              TSize[] | string[] 
  images?:            TProductImage[] | null
}

export type SearchedProduct = {
  id:               number
  name:             string
  slug:             string
  images:           TProductImage[]
  category_id:      string
  subcategory_id:   string

  category?:        TSubcategory
  subcategory?:     TSubcategory
}

const api = apiHelper('products');

export const get = async (page?: number): Promise<AxiosResponse<PaginatedResponse<TProduct>>> => {
  const params = new URLSearchParams();
  if (page) params.append('page', page.toString());
  
  try {
    return await api.get({ page: page });
  } catch (error: unknown) {
    throw error;
  }
};

export const show = async (slug: string): Promise<AxiosResponse<TProduct>> => {
  return await api.show(slug);
};

export const store = async (data: TProduct): Promise<AxiosResponse<TProduct>> => {
  try {
    return await secureRequest(() => api.post(data));
  } catch (error: unknown) {
    throw error;
  }
}

export const update = async (slug: string, item: TProduct): Promise<AxiosResponse<TProduct>> => {
  try {
    return await secureRequest(() => api.put(slug, item));
  } catch (error: unknown) {
    throw error;
  }
}

export const destroy = async (slug: string): Promise<AxiosResponse<void>> => {
  try {
    return await secureRequest(() => api.delete(slug));
  } catch (error: unknown) {
    throw error;
  }
}

export const search = async (query: string): Promise<AxiosResponse<SearchedProduct[]> | null> => {
  try {
    return await http.get(`api/search?query=${query}`);
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    } else if(error.response.status === 422) {
      return null;
    }
    else {
      throw error;
    }
  }
}

export const getDiscountProducts = unstable_cache(
  async ({ page = 1 }: { page?: number }): Promise<PaginatedResponse<TProduct>> => {
    const params = new URLSearchParams();
    params.append("page", String(page));

    const res = await http.get(`api/products-with-discount?${params.toString()}`);
    
    return res.data;
  },
  ["discountProducts"],
  {
    tags: ["discountProducts"],
  }
);
