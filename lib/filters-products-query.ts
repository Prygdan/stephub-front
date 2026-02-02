import { TSearchParams } from "@/lib/types";

type TBuildProductsQuery = {
  page?:          number
  searchParams?:  TSearchParams
}

export function buildProductsQuery({ page, searchParams }: TBuildProductsQuery) {
  const params = new URLSearchParams();

  if (page) params.append("page", page.toString());
  if (searchParams?.sortBy) params.append("sortBy", searchParams.sortBy);
  if (searchParams?.priceFrom) params.append("priceFrom", searchParams.priceFrom);
  if (searchParams?.priceTo) params.append("priceTo", searchParams.priceTo);
  if (searchParams?.brands) params.append("brands", searchParams.brands);
  if (searchParams?.seasons) params.append("seasons", searchParams.seasons);
  if (searchParams?.materials) params.append("materials", searchParams.materials);
  if (searchParams?.categories) params.append("categories", searchParams.categories);
  if (searchParams?.subcategories) params.append("subcategories", searchParams.subcategories);
  if (searchParams?.sizes) params.append("sizes", searchParams.sizes);

  return params.toString();
}