import { useQueryStates } from "nuqs";
import { parseAsString, createLoader } from "nuqs/server";

export const params = {
  // clearOnDefault: false - URL: ?minPrice=&maxPrice=100 (empty values stay in URL)
  // clearOnDeafult: true - URL: ?maxPrice=100 (empty/default values are removed in URL)
  minPrice: parseAsString.withOptions({ clearOnDefault: true }),
  maxPrice: parseAsString.withOptions({ clearOnDefault: true }),
};

export function useProductFilters() {
  return useQueryStates(params);
}

export const loadProductFilters = createLoader(params);
