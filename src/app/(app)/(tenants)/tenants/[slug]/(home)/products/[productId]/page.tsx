import { getQueryClient, trpc } from "@/lib/trpc/server";
import ProductView from "@/modules/products/views/ProductView";
import {
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import React from "react";

type Props = {
  params: Promise<{ productId: string; slug: string }>;
};

export default async function Page({ params }: Props) {
  const { productId, slug } = await params;
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.tenants.getOne.queryOptions({
      slug,
    })
  );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductView
        productId={productId}
        tenantSlug={slug}
      />
    </HydrationBoundary>
  );
}
