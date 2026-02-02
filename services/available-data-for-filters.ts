import { TTimestamps } from "@/lib/types";
import { http } from "./instance";
import { AxiosResponse } from "axios";
import { TBrand } from "./brands";
import { TCategory } from "./categories";
import { TSubcategory } from "./subcategories";
import { TSeason } from "./seasons";
import { TMaterial } from "./materials";
import { TSize } from "./sizes";

export type TAvailableDataForFilters = TTimestamps & {
  available_brands?:        TBrand[]
  available_categories?:    TCategory[]
  available_subcategories?: TSubcategory[]
  available_seasons?:       TSeason[]
  available_materials?:     TMaterial[]
  available_sizes?:         TSize[]
  price_range: {
    min: string
    max: string
  }
}

export type TType = 'categories' | 'subcategories' | 'brands'
 
type TAvailableDataForFiltersParams = {
  type: TType
  typeSlug: string
  params?: string
}

export const get = async ({type, typeSlug, params}: TAvailableDataForFiltersParams): Promise<AxiosResponse<TAvailableDataForFilters>> => {
  try {
    const data = (await http.get(`api/${type}/${typeSlug}/filters/?${params}`));

    return data;
  } catch(error: unknown) {
    throw error;
  }
}
