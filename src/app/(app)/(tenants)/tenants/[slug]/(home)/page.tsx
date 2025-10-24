import React from "react";
import type { SearchParams } from "nuqs/server";
import { trpc, getQueryClient } from "@/lib/trpc/server";
import { DEFAULT_LIMIT } from "@/modules/products/constants";
import ProductListView from "@/modules/products/views/ProductListView";
import { loadProductFilters } from "@/modules/products/hooks/useProductFilters";
import {
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";

type Props = {
  searchParams: Promise<SearchParams>;
  params: Promise<{ slug: string }>;
};

export default async function Page({
  searchParams,
  params,
}: Props) {
  const { slug } = await params;
  // Read filters from URL
  const filters = await loadProductFilters(searchParams);

  const queryClient = getQueryClient();
  void queryClient.prefetchInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions({
      ...filters,
      tenantSlug: slug,
      limit: DEFAULT_LIMIT,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductListView tenantSlug={slug} />
    </HydrationBoundary>
  );
}
