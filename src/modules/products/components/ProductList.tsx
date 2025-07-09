"use client";

import React from "react";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc/client";
import { useProductFilters } from "../hooks/useProductFilters";
import { DEFAULT_LIMIT } from "../constants";
import { InboxIcon } from "lucide-react";
import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";

interface Props {
  category?: string;
}

// The Client Side Component:
// useSuspenseQuery Runs: When ProductList renders, useSuspenseQuery
// checks:
// - Is data already in cache? → YES (from server prefetch)
// - Is data fresh enough? → YES (just fetched)
// - Result: Returns the data immediately, data is guaranteed to be defined
function ProductList({
  category,
}: Props): React.ReactElement {
  const [filters] = useProductFilters();
  const trpc = useTRPC();
  const {
    data,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useSuspenseInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions(
      { category, ...filters, limit: DEFAULT_LIMIT },
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
    return (
      <div
        className="border border-black border-dashed flex flex-col 
        items-center justify-center gap-y-4 p-8 w-full rounded-lg"
      >
        <InboxIcon />
        <p className="text-base font-medium">
          No Product found
        </p>
      </div>
    );
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
              authorUsername={"elham"}
              authorImageUrl={undefined}
              reviewRating={3}
              reviewCount={5}
              price={product.price}
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
