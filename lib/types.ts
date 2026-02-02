export type PaginatedResponse<T> = {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  next_page_url: string | null;
  prev_page_url: string | null;
  first_page_url: string;
  from: number;
  last_page_url: string;
  path: string;
  to: number;
}

export type TTimestamps = {
  created_at?: string
  updated_at?: string
}

export type TMetaTags = {
  meta_title?:        string | null
  meta_description?:  string | null
  meta_keywords?:     string | null
}

export type GetProductsFiltersParams = {
  slug:           string, 
  page?:          number
  searchParams?:  TSearchParams
}

export type TSearchParams = {
  sortBy?:          string,
  priceFrom?:       string, 
  priceTo?:         string,
  brands?:          string,
  seasons?:         string,
  materials?:       string,
  categories?:      string,
  subcategories?:   string,
  sizes?:           string
}

export enum SortOption {
  PriceAsc        = 'price_asc',
  PriceDesc       = 'price_desc',
  Newest          = 'newest',
  Oldest          = 'oldest',
  BiggestDiscount = 'biggest_discount'
}

export const SortOptionLabels: Record<SortOption, string> = {
  [SortOption.PriceAsc]:        'Від дешевих до дорогих',
  [SortOption.PriceDesc]:       'Від дорогих до дешевих',
  [SortOption.Newest]:          'Спочатку нові',
  [SortOption.Oldest]:          'Спочатку старі',
  [SortOption.BiggestDiscount]: 'По відсотку знижки',
};