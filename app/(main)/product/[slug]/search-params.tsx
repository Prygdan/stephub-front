import { createLoader, parseAsInteger } from "nuqs/server";

// Describe your search params, and reuse this in useQueryStates / createSerializer:
export const coordinatesSearchParams = {
  page:       parseAsInteger.withDefault(1),
};

export const loadSearchParams = createLoader(coordinatesSearchParams);