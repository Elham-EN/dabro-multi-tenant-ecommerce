import React, { Suspense } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { SearchParams } from "nuqs/server";
import { getQueryClient, trpc } from "@/lib/trpc/server";
import ProductFilters from "@/modules/products/components/ProductFilters";
import ProductList from "@/modules/products/components/ProductList";
import ProductListSkeleton from "@/modules/products/components/ProductListSkeleton";
import { loadProductFilters } from "@/modules/products/hooks/useProductFilters";

interface Props {
  params: Promise<{ category: string }>;
  searchParams: Promise<SearchParams>;
}
// The Server Side Component (page.tsx):
export default async function page({ params, searchParams }: Props) {
  const { category } = await params;
  const filters = await loadProductFilters(searchParams);
  const queryClient = getQueryClient();
  // Server component to prefetch products:
  // - Fetches the products data on the server
  // - Stores it in the server's query cache
  // - This happens before any HTML is sent to the browser
  void queryClient.prefetchQuery(
    trpc.products.getMany.queryOptions({ category, ...filters })
  );

  return (
    // Uses dehydrate() to convert the query cache into a serializable
    // format that can be embedded in the markup. The dehydrated state gets
    // passed to HydrationBoundary so it can be hydrated on the client
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="px-4 lg:p-12 flex flex-col gap-4">
        <div
          className="grid grid-cols-1 lg:grid-cols-6 
          xl:grid-cols-8 gap-y-6 gap-x-12"
        >
          <div className="lg:col-span-2 mt-2 lg:mt-0">
            <ProductFilters />
          </div>
          <div className="lg:col-span-4 xl:col-span-6">
            {/* The Client Side Component (ProductList.tsx):
          No Loading State: Because data was prefetched, you never see 
          ProductListSkeleton. The data is already there */}
            <Suspense fallback={<ProductListSkeleton />}>
              {/* When ProductList renders, useSuspenseQuery checks:
              - Is data already in cache? → YES (from server prefetch)
              - Is data fresh enough? → YES (just fetched)
              - Result: Returns the data immediately, data is guaranteed 
                to be defined */}
              <ProductList category={category} />
            </Suspense>
          </div>
        </div>
      </div>
    </HydrationBoundary>
  );
}
