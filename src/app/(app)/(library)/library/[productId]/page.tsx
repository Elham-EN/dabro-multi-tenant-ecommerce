import { getQueryClient, trpc } from "@/lib/trpc/server";
import LibraryProductView from "@/modules/library/ui/views/LibraryProductView";
import {
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import React from "react";

type Props = {
  params: Promise<{ productId: string }>;
};

export default async function Page({ params }: Props) {
  const { productId } = await params;
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.library.getOne.queryOptions({
      productId: productId,
    })
  );
  void queryClient.prefetchQuery(
    trpc.reviews.getOne.queryOptions({ productId })
  );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <LibraryProductView productId={productId} />
    </HydrationBoundary>
  );
}
