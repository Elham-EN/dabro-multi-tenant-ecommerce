import { parseAsString, useQueryStates } from "nuqs";

export function useProductFilters() {
  return useQueryStates({
    // clearOnDefault: false - URL: ?minPrice=&maxPrice=100 (empty values stay in URL)
    // clearOnDeafult: true - URL: ?maxPrice=100 (empty/default values are removed in URL)
    minPrice: parseAsString.withOptions({ clearOnDefault: true }),
    maxPrice: parseAsString.withOptions({ clearOnDefault: true }),
  });
}
