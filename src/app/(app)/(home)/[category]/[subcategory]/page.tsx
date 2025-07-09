import React from "react";
import {
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import { SearchParams } from "nuqs/server";
import { getQueryClient, trpc } from "@/lib/trpc/server";
import ProductListView from "@/modules/products/views/ProductListView";
import { loadProductFilters } from "@/modules/products/hooks/useProductFilters";
import { DEFAULT_LIMIT } from "@/modules/products/constants";

interface Props {
  params: Promise<{
    subcategory: string;
  }>;
  searchParams: Promise<SearchParams>;
}

export default async function page({
  params,
  searchParams,
}: Props) {
  const { subcategory } = await params;
  const filters = await loadProductFilters(searchParams);
  const queryClient = getQueryClient();
  // Server component to prefetch products:
  // - Fetches the products data on the server
  // - Stores it in the server's query cache
  // - This happens before any HTML is sent to the browser
  void queryClient.prefetchInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions({
      category: subcategory,
      ...filters,
      limit: DEFAULT_LIMIT,
    })
  );

  return (
    // Uses dehydrate() to convert the query cache into a serializable
    // format that can be embedded in the markup. The dehydrated state gets
    // passed to HydrationBoundary so it can be hydrated on the client
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductListView category={subcategory} />
    </HydrationBoundary>
  );
}
