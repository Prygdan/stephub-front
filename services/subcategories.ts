import { GetProductsFiltersParams, PaginatedResponse, TMetaTags, TTimestamps } from "@/lib/types";
import { apiHelper, http } from "./instance";
import { secureRequest } from "@/hooks/use-csrf-cookie";
import { AxiosResponse } from "axios";
import { unstable_cache } from "next/cache";
import { TProduct } from "./products";
import { buildProductsQuery } from "@/lib/filters-products-query";

export type TSubcategory = TTimestamps & TMetaTags & {
  id:               string
  category_id:      string
  name:             string,
  slug:             string,
  description:      string | null
  allowed_filters:  string[] | null
}

export type TSubcategoryWithProducts = {
  subcategory: TSubcategory
  products: PaginatedResponse<TProduct>
}

const api = apiHelper('subcategories');

export const get = async (): Promise<AxiosResponse<TSubcategory[]>> => {
  try {
    return await api.get();
  } catch (error: unknown) {
    throw error;
  }
};

export const show = unstable_cache(
  async ({slug, page, searchParams}: GetProductsFiltersParams): Promise<TSubcategoryWithProducts | null> => {
    const query = buildProductsQuery({ page, searchParams });
    const url = `api/subcategories/${slug}?${query}`;

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
}, ['subcategory'], { tags: ['subcategory']});

export const store = async (data: TSubcategory): Promise<AxiosResponse<TSubcategory>> => {
  try {
    return await secureRequest(() => api.post(data));
  } catch (error: unknown) {
    throw error;
  }
}

export const update = async (slug: string, item: TSubcategory): Promise<AxiosResponse<TSubcategory>> => {
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
