"use client";

import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc/client";

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
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.products.getMany.queryOptions({ category })
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
      {data.docs.map((product) => (
        <div key={product.id} className="border rounded-md bg-white p-2">
          <h1 className="text-4xl">
            Product Name: <span className="text-red-400">{product.name}</span>
          </h1>
        </div>
      ))}
    </div>
  );
}

export default ProductList;
