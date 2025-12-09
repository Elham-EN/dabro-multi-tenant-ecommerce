"use client";

import React from "react";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc/client";

import { DEFAULT_LIMIT } from "@/modules/products/constants";

import ProductCard from "@/modules/library/ui/components/ProductCard";
import { Button } from "@/components/ui/button";
import ProductNotFound from "@/components/ui/ProductNotFound";

// The Client Side Component:
// useSuspenseQuery Runs: When ProductList renders, useSuspenseQuery
// checks:
// - Is data already in cache? → YES (from server prefetch)
// - Is data fresh enough? → YES (just fetched)
// - Result: Returns the data immediately, data is guaranteed to be defined
function ProductList(): React.ReactElement {
  const trpc = useTRPC();
  const {
    data,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useSuspenseInfiniteQuery(
    trpc.library.getMany.infiniteQueryOptions(
      {
        limit: DEFAULT_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => {
          return lastPage.docs.length > 0
            ? lastPage.nextPage
            : undefined;
        },
      }
    )
  );
  if (data.pages?.[0]?.docs.length === 0) {
    return <ProductNotFound />;
  }

  return (
    <>
      <div
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 
        2xl:grid-cols-4 gap-4"
      >
        {data.pages
          .flatMap((page) => page.docs)
          .map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              imageUrl={product.image?.url}
              tenantSlug={product.tenant?.slug}
              tenantImageUrl={product.tenant?.image?.url}
              reviewRating={product.reviewRating}
              reviewCount={product.reviewCount}
            />
          ))}
      </div>
      <div className="flex justify-center mt-12">
        {hasNextPage && (
          <Button
            disabled={isFetchingNextPage}
            onClick={() => fetchNextPage()}
            variant={"elevated"}
            className="font-medium disabled:opacity-50 text-base 
              bg-white"
          >
            Load More
          </Button>
        )}{" "}
      </div>
    </>
  );
}

export default ProductList;
