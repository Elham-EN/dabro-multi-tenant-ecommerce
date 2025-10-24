import React, { Suspense } from "react";
import ProductFilters from "../components/ProductFilters";
import ProductListSkeleton from "../components/ProductListSkeleton";
import ProductList from "../components/ProductList";
import ProductSort from "../components/ProductSort";

interface Props {
  category?: string;
  tenantSlug?: string;
}

export default function ProductListView({
  category,
  tenantSlug,
}: Props) {
  return (
    <div className="px-4 lg:p-12 flex flex-col gap-4">
      <div
        className="flex flex-col lg:flex-row lg:items-center 
        gap-y-2 lg:gap-y-0 justify-between mt-4 lg:mt-0"
      >
        <p className="text-2xl font-medium">
          Curated for you
        </p>
        <ProductSort />
      </div>
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
            <ProductList
              tenantSlug={tenantSlug}
              category={category}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
