"use client";

import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc/client";
import { useProductFilters } from "../hooks/useProductFilters";
import ProductCard from "./ProductCard";

interface Props {
  category?: string;
}

// The Client Side Component:
// useSuspenseQuery Runs: When ProductList renders, useSuspenseQuery
// checks:
// - Is data already in cache? → YES (from server prefetch)
// - Is data fresh enough? → YES (just fetched)
// - Result: Returns the data immediately, data is guaranteed to be defined
function ProductList({ category }: Props): React.ReactElement {
  const [filters] = useProductFilters();
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.products.getMany.queryOptions({ category, ...filters })
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
      {data.docs.map((product) => (
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
  );
}

export default ProductList;
