import { useQueryStates } from "nuqs";
import {
  parseAsString,
  parseAsStringLiteral,
  parseAsArrayOf,
  createLoader,
} from "nuqs/server";

// pass a readonly list of allowed values
export const sortValues = ["curated", "trending", "hot_and_new"] as const;

export const params = {
  sort: parseAsStringLiteral(sortValues).withDefault("curated"),
  // clearOnDefault: false - URL: ?minPrice=&maxPrice=100 (empty values stay in URL)
  // clearOnDeafult: true - URL: ?maxPrice=100 (empty/default values are removed in URL)
  minPrice: parseAsString.withOptions({ clearOnDefault: true }).withDefault(""),
  maxPrice: parseAsString.withOptions({ clearOnDefault: true }).withDefault(""),
  tags: parseAsArrayOf(parseAsString)
    .withOptions({ clearOnDefault: true })
    .withDefault([]),
};

export function useProductFilters() {
  return useQueryStates(params);
}

export const loadProductFilters = createLoader(params);
