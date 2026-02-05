import { GetProductsFiltersParams, PaginatedResponse, TTimestamps } from "@/lib/types";
import { apiHelper, http } from "./instance";
import { secureRequest } from "@/hooks/use-csrf-cookie";
import { AxiosResponse } from "axios";
import { unstable_cache } from "next/cache";
import { buildProductsQuery } from "@/lib/filters-products-query";
import { TProduct } from "./products";

export type TBrand = TTimestamps & {
  id: string
  name: string,
  slug: string,
  image: string | null
  in_popular: boolean
  allowed_filters: string[] | null
}

export type TBrandWithProducts = {
  brand: TBrand
  products: PaginatedResponse<TProduct>
}

const api = apiHelper('brands');

export const get = async (): Promise<AxiosResponse<TBrand[]>> => {
  try {
    return await api.get();
  } catch (error: unknown) {
    throw error;
  }
};

export const getSSR = unstable_cache(async (): Promise<TBrand[]> => {
  try {
    return (await api.get()).data;
  } catch (error: unknown) {
    throw error;
  }
}, ['brand-get'], { tags: ['brand-get']});

export const show = unstable_cache(
  async ({ slug, page, searchParams }: GetProductsFiltersParams): Promise<TBrandWithProducts | null> => {
    const query = buildProductsQuery({ page, searchParams });
    const url = `api/brands/${slug}?${query}`;

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
}, ['brand'], { tags: ['brand']});

export const store = async (data: TBrand): Promise<AxiosResponse<TBrand>> => {
  try {
    return await secureRequest(() => api.post(data));
  } catch (error: unknown) {
    throw error;
  }
}

export const update = async (slug: string, item: TBrand): Promise<AxiosResponse<TBrand>> => {
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