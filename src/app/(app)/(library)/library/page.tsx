import { getQueryClient, trpc } from "@/lib/trpc/server";
import LibraryView from "@/modules/library/ui/views/LibraryView";
import { DEFAULT_LIMIT } from "@/modules/products/constants";
import {
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import React from "react";

export default async function Page() {
  const queryClient = getQueryClient();
  void queryClient.prefetchInfiniteQuery(
    trpc.library.getMany.infiniteQueryOptions({
      limit: DEFAULT_LIMIT,
    })
  );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <LibraryView />
    </HydrationBoundary>
  );
}
