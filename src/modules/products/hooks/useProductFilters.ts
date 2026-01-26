/**
 * PRODUCT FILTERS HOOK
 *
 * This file manages product filtering via URL query parameters (search params).
 *
 * Think of it like Amazon's filter sidebar:
 * - User selects "Price: $10-$50" → URL becomes ?minPrice=10&maxPrice=50
 * - User clicks "Trending" → URL becomes ?sort=trending
 * - Filters are stored in URL so users can share/bookmark filtered results
 *
 * Uses the "nuqs" library which syncs React state with URL query parameters.
 */

import { useQueryStates } from "nuqs";
import {
  parseAsString,
  parseAsStringLiteral,
  parseAsArrayOf,
  createLoader,
} from "nuqs/server";

/**
 * ALLOWED SORT OPTIONS
 *
 * Define the only valid sort values users can use.
 * "as const" makes this readonly - TypeScript will prevent typos.
 *
 * Example URLs:
 * - ?sort=curated (default)
 * - ?sort=trending
 * - ?sort=hot_and_new
 */
export const sortValues = ["curated", "trending", "hot_and_new"] as const;

/**
 * FILTER PARAMETERS DEFINITION
 *
 * This object defines ALL the filters users can apply to products.
 * Each filter has a parser that converts URL strings into proper types.
 */
export const params = {
  /**
   * SEARCH FILTER
   * parseAsString - Accepts any text value for product search
   * clearOnDefault: true - If empty, remove from URL
   * Example: ?search=figma
   */
  search: parseAsString.withOptions({ clearOnDefault: true }).withDefault(""),

  /**
   * SORT FILTER
   * parseAsStringLiteral() - Only accepts values from sortValues array
   * withDefault("curated") - If no ?sort= in URL, use "curated"
   * Example: ?sort=trending
   */
  sort: parseAsStringLiteral(sortValues).withDefault("curated"),

  /**
   * MIN PRICE FILTER
   * parseAsString - Accepts any text value
   * clearOnDefault: true - If empty, remove from URL (keeps URL clean)
   * withDefault("") - Start with empty string (no minimum)
   *
   * Examples:
   * - User sets min: ?minPrice=10
   * - User clears min: query param removed from URL
   */
  minPrice: parseAsString.withOptions({ clearOnDefault: true }).withDefault(""),

  /**
   * MAX PRICE FILTER
   * Same as minPrice but for maximum price limit
   * Example: ?maxPrice=100
   */
  maxPrice: parseAsString.withOptions({ clearOnDefault: true }).withDefault(""),

  /**
   * TAGS FILTER
   * parseAsArrayOf(parseAsString) - Converts URL string into array of strings
   * withDefault([]) - Start with empty array (no tags selected)
   *
   * Examples:
   * - User selects 1 tag: ?tags=digital
   * - User selects 3 tags: ?tags=digital&tags=premium&tags=bundle
   * - In code, you get: ["digital", "premium", "bundle"]
   */
  tags: parseAsArrayOf(parseAsString)
    .withOptions({ clearOnDefault: true })
    .withDefault([]),
};

/**
 * CLIENT-SIDE HOOK (for React components with "use client")
 *
 * Use this in client components to read and update filters.
 * Returns [filters, setFilters] - similar to useState()
 *
 * Example usage:
 * ```tsx
 * const [filters, setFilters] = useProductFilters();
 * console.log(filters.sort); // "trending"
 * setFilters({ sort: "hot_and_new" }); // Updates URL and state
 * ```
 */
export function useProductFilters() {
  return useQueryStates(params);
}

/**
 * SERVER-SIDE LOADER (for Server Components)
 *
 * Use this in server components (page.tsx) to read filters from URL.
 * Cannot set/update filters - server components are read-only.
 *
 * Example usage in page.tsx:
 * ```tsx
 * const filters = await loadProductFilters(searchParams);
 * // Use filters to query database
 * const products = await db.find({ price: { min: filters.minPrice } });
 * ```
 */
export const loadProductFilters = createLoader(params);
