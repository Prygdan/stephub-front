import { SortOption } from "@/lib/types";
import { createLoader, parseAsInteger, parseAsString } from "nuqs/server";

// Describe your search params, and reuse this in useQueryStates / createSerializer:
export const coordinatesSearchParams = {
  page:           parseAsInteger.withDefault(1),
  sortBy:         parseAsString.withDefault(SortOption.Newest),
  priceFrom:      parseAsString.withDefault(""),
  priceTo:        parseAsString.withDefault(""),
  sizes:          parseAsString.withDefault(""),
  brands:         parseAsString.withDefault(""),
  seasons:        parseAsString.withDefault(""),
  materials:      parseAsString.withDefault(""),
  categories:     parseAsString.withDefault(""),
  subcategories:  parseAsString.withDefault(""),
};

export const loadSearchParams = createLoader(coordinatesSearchParams);