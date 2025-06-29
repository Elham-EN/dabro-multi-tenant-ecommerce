import { getQueryClient, trpc } from "@/lib/trpc/server";
import ProductList from "@/modules/products/components/ProductList";
import ProductListSkeleton from "@/modules/products/components/ProductListSkeleton";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import React, { Suspense } from "react";

interface Props {
  params: Promise<{ category: string }>;
}
// The Server Side Component (page.tsx):
export default async function page({}: Props) {
  const queryClient = getQueryClient();
  // Server component to prefetch products:
  // - Fetches the products data on the server
  // - Stores it in the server's query cache
  // - This happens before any HTML is sent to the browser
  void queryClient.prefetchQuery(trpc.products.getMany.queryOptions());

  return (
    // Uses dehydrate() to convert the query cache into a serializable
    // format that can be embedded in the markup. The dehydrated state gets
    // passed to HydrationBoundary so it can be hydrated on the client
    <HydrationBoundary state={dehydrate(queryClient)}>
      {/* The Client Side Component (ProductList.tsx):
          No Loading State: Because data was prefetched, you never see 
          ProductListSkeleton. The data is already there */}
      <Suspense fallback={<ProductListSkeleton />}>
        {/* When ProductList renders, useSuspenseQuery checks:
              - Is data already in cache? → YES (from server prefetch)
              - Is data fresh enough? → YES (just fetched)
              - Result: Returns the data immediately, data is guaranteed 
                to be defined */}
        <ProductList />
      </Suspense>
    </HydrationBoundary>
  );
}
