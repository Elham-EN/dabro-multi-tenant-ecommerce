import { getQueryClient, trpc } from "@/lib/trpc/server";
import ProductList from "@/modules/products/components/ProductList";
import ProductListSkeleton from "@/modules/products/components/ProductListSkeleton";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import React, { Suspense } from "react";

interface Props {
  params: Promise<{
    subcategory: string;
  }>;
}

export default async function page({ params }: Props) {
  const { subcategory } = await params;
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.products.getMany.queryOptions({ category: subcategory })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<ProductListSkeleton />}>
        <ProductList category={subcategory} />
      </Suspense>
    </HydrationBoundary>
  );
}
