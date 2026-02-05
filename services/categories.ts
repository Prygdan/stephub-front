import { GetProductsFiltersParams, PaginatedResponse, TMetaTags, TTimestamps } from "@/lib/types";
import { apiHelper, http } from "./instance";
import { secureRequest } from "@/hooks/use-csrf-cookie";
import { AxiosResponse } from "axios";
import { TSubcategory } from "./subcategories";
import { unstable_cache } from "next/cache";
import { TProduct } from "./products";
import { buildProductsQuery } from "@/lib/filters-products-query";
import { TCarousel } from "./carousels";

export type TCategory = TTimestamps & TMetaTags & {
  id: string
  name: string,
  slug: string,
  description: string | null
  allowed_filters: string[] | null
  
  subcategories?: TSubcategory[]
  carousel?:  TCarousel
}

export type TCategoryWithProducts = {
  category: TCategory
  products: PaginatedResponse<TProduct>
}

const api = apiHelper('categories');

export const get = async (): Promise<AxiosResponse<TCategory[]>> => {
  try {
    return await api.get();
  } catch (error: unknown) {
    throw error;
  }
};

export const getSSR = unstable_cache(
  async (): Promise<TCategory[]> => {
    try {
      return (await api.get()).data;
    } catch (error: unknown) {
      throw error;
    }
  }, ['category-get'], { tags: ['category-get']}
);

export const show = unstable_cache(
  async ({ slug, page, searchParams }: GetProductsFiltersParams): Promise<TCategoryWithProducts | null> => {
    const query = buildProductsQuery({ page, searchParams });
    const url = `api/categories/${slug}?${query}`;

    try {
      const data = (await http.get(url));

      return data.data;
    } catch (error: any) {
        if (error.response?.status === 404) {
        return null;
      } else if(error.response.status === 422) {
        return null;
      }
      else {
        console.log('Error fetching data:', error); 
        throw error;
      }
    }
}, ['category'], { tags: ['category']});

export const store = async (data: TCategory): Promise<AxiosResponse<TCategory>> => {
  try {
    return await secureRequest(() => api.post(data));
  } catch (error: unknown) {
    throw error;
  }
}

export const update = async (slug: string, item: TCategory): Promise<AxiosResponse<TCategory>> => {
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